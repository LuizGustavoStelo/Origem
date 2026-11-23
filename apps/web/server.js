const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const ROOT = path.resolve(__dirname, "../..");

const pages = new Map([
  ["/", "home/code.html"],
  ["/gastronomia", "gastronomia_origem_ms/code.html"],
  ["/cultura", "cultura_origem_ms/code.html"],
  ["/turismo", "turismo_origem_ms/code.html"],
  ["/a-rota", "a_rota_origem_ms/code.html"],
  ["/estabelecimentos", "estabelecimentos_origem_ms/code.html"],
]);

const globalLayoutScript = '<script src="/assets/origem-layout.js" defer></script>';

const placeholders = new Map([
  ["/sobre", ["Nossa história", "A história editorial da Origem MS está em preparação."]],
  ["/expedicoes", ["Expedições", "Roteiros e experiências conectadas à Rota Bioceânica estão em preparação."]],
  ["/contato", ["Contato", "Para conversar com a equipe da Origem MS, escreva para contato@origemms.com.br."]],
  ["/privacidade", ["Privacidade", "A política de privacidade e o tratamento de dados pessoais serão publicados antes da abertura do cadastro."]],
  ["/termos", ["Termos de uso", "Os termos de uso da plataforma Origem MS serão publicados antes da abertura do cadastro."]],
  ["/admin", ["Painel administrativo", "Esta área ainda não está disponível ao público."]],
]);

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function tenantFromHost(host = "") {
  const hostname = host.split(":")[0].toLowerCase();

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "local";
  }

  const match = hostname.match(/^(?:www\.)?origem([a-z]{2})\.com\.br$/);
  if (match) {
    return match[1].toUpperCase();
  }

  if (hostname === "www.origemms.com.br") {
    return "MS";
  }

  return "desconhecido";
}

function htmlShell(title, description, statusCode = 200, extraContent = "") {
  return {
    statusCode,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
    body: `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f1f3ee">
  <title>${title} | Origem MS</title>
  <link rel="stylesheet" href="/assets/origem.css">
  ${globalLayoutScript}
</head>
<body>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="wordmark" href="/" aria-label="Origem MS, início"><span>Origem</span><span class="wordmark__state">MS</span></a>
      <button class="menu-toggle" type="button" aria-label="Abrir menu de navegação" aria-controls="primary-navigation" aria-expanded="false"><span>Menu</span><svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      <nav class="primary-navigation" id="primary-navigation" aria-label="Navegação principal">
        <a href="/gastronomia">Gastronomia</a><a href="/turismo">Lugares</a><a href="/cultura">Cultura</a><a href="/a-rota">Rota Bioceânica</a><a class="nav-business" href="/estabelecimentos">Para estabelecimentos</a>
      </nav>
    </div>
  </header>
  <main id="conteudo">
    <section class="business-details">
      <div class="business-details__intro">
        <h1>${title}</h1>
        <p>${description}</p>
        ${extraContent}
        <a class="text-link" href="/"><span>Voltar ao início</span></a>
      </div>
    </section>
  </main>
</body>
</html>`,
  };
}

async function renderPage(routePath) {
  const relativeFile = pages.get(routePath);
  if (!relativeFile) {
    return null;
  }

  const file = path.join(ROOT, relativeFile);
  const rawBody = await fs.readFile(file, "utf8");
  const body = rawBody.includes(globalLayoutScript)
    ? rawBody
    : rawBody.replace("</head>", `${globalLayoutScript}\n</head>`);

  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
    body,
  };
}

async function renderStaticAsset(routePath) {
  if (!routePath.startsWith("/assets/")) {
    return null;
  }

  const assetRoot = path.resolve(ROOT, "assets");
  const file = path.resolve(ROOT, routePath.slice(1));
  const relativePath = path.relative(assetRoot, file);

  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  try {
    const extension = path.extname(file).toLowerCase();
    const contentTypes = new Map([
      [".css", "text/css; charset=utf-8"],
      [".png", "image/png"],
      [".jpg", "image/jpeg"],
      [".jpeg", "image/jpeg"],
      [".webp", "image/webp"],
      [".svg", "image/svg+xml; charset=utf-8"],
      [".ico", "image/x-icon"],
      [".js", "application/javascript; charset=utf-8"],
      [".woff2", "font/woff2"],
    ]);
    const contentType = contentTypes.get(extension);

    if (!contentType) {
      return null;
    }

    const body = await fs.readFile(file);

    return {
      statusCode: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
      },
      body,
    };
  } catch {
    return null;
  }
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const routePath = normalizePath(decodeURIComponent(requestUrl.pathname));
  const tenant = tenantFromHost(request.headers.host);

  response.setHeader("x-tenant-key", tenant);

  if (routePath === "/healthz") {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    response.end(JSON.stringify({ status: "ok", tenant }));
    return;
  }

  try {
    const page = await renderPage(routePath);
    const placeholder = placeholders.get(routePath);
    const asset = !page && !placeholder ? await renderStaticAsset(routePath) : null;
    const contactLink = routePath === "/contato"
      ? `<p><a class="text-link" href="mailto:contato@origemms.com.br"><span>contato@origemms.com.br</span></a></p>`
      : "";
    const result = page || asset || (placeholder ? htmlShell(placeholder[0], placeholder[1], 200, contactLink) : htmlShell("Página não encontrada", "O conteúdo solicitado ainda não está disponível.", 404));

    response.writeHead(result.statusCode, result.headers);
    response.end(result.body);
  } catch (error) {
    console.error(error);
    const result = htmlShell("Erro interno", "Não foi possível carregar esta página agora.", 500);
    response.writeHead(result.statusCode, result.headers);
    response.end(result.body);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Origem web ouvindo na porta ${PORT}`);
});
