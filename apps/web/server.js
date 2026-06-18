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
]);

const globalLayoutScript = '<script src="/assets/origem-layout.js" defer></script>';

const placeholders = new Map([
  ["/sobre", ["Nossa História", "Em breve, a história editorial da Origem MS e sua curadoria territorial."]],
  ["/expedicoes", ["Expedições", "Em breve, roteiros e experiências conectadas à Rota Bioceânica."]],
  ["/contato", ["Contato", "Em breve, formulário comercial para estabelecimentos, marcas e parceiros."]],
  ["/privacidade", ["Privacidade", "Em breve, política de privacidade e tratamento de dados pessoais."]],
  ["/termos", ["Termos de Uso", "Em breve, termos de uso da plataforma Origem MS."]],
  ["/admin", ["Painel Administrativo", "Área reservada para superadmin, admins estaduais e usuários de estabelecimentos."]],
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

function htmlShell(title, description, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
    body: `<!doctype html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Origem MS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  ${globalLayoutScript}
</head>
<body class="min-h-screen bg-[#131314] text-[#e5e2e3] antialiased">
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
    <a href="/" class="mb-10 text-sm uppercase tracking-[0.2em] text-[#C5A059]">Origem MS</a>
    <h1 class="font-['EB_Garamond'] text-5xl text-[#F4F1EA]">${title}</h1>
    <p class="mt-6 font-['Inter'] text-lg leading-8 text-[#d1c5b4]">${description}</p>
    <nav class="mt-10 flex flex-wrap gap-4 font-['Inter'] text-sm text-[#C5A059]">
      <a href="/gastronomia">Gastronomia</a>
      <a href="/cultura">Cultura</a>
      <a href="/turismo">Turismo</a>
      <a href="/a-rota">A Rota</a>
    </nav>
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
  const safePath = path.normalize(routePath).replace(/^(\.\.[/\\])+/, "");
  const file = path.join(ROOT, safePath);

  if (!file.startsWith(ROOT)) {
    return null;
  }

  try {
    const extension = path.extname(file).toLowerCase();
    const contentTypes = new Map([
      [".png", "image/png"],
      [".jpg", "image/jpeg"],
      [".jpeg", "image/jpeg"],
      [".webp", "image/webp"],
      [".svg", "image/svg+xml"],
      [".ico", "image/x-icon"],
      [".js", "application/javascript; charset=utf-8"],
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
        "cache-control": "public, max-age=31536000, immutable",
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
    const result = page || asset || (placeholder ? htmlShell(placeholder[0], placeholder[1]) : htmlShell("Página não encontrada", "O conteúdo solicitado ainda não existe.", 404));

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
