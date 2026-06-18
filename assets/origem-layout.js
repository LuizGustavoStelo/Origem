(function () {
  const links = [
    { href: "/", label: "Início" },
    { href: "/gastronomia", label: "Gastronomia" },
    { href: "/cultura", label: "Cultura" },
    { href: "/turismo", label: "Turismo" },
    { href: "/a-rota", label: "A Rota" },
  ];

  const footerLinks = [
    { href: "/sobre", label: "Nossa História" },
    { href: "/expedicoes", label: "Expedições" },
    { href: "/contato", label: "Contato" },
    { href: "/privacidade", label: "Privacidade" },
  ];

  function currentPath() {
    const path = window.location.pathname.replace(/\/$/, "");
    return path || "/";
  }

  function isActive(href) {
    return currentPath() === href;
  }

  function linkMarkup(item) {
    const active = isActive(item.href) ? " origem-nav__link--active" : "";
    return `<a class="origem-nav__link${active}" href="${item.href}">${item.label}</a>`;
  }

  function removeLegacyLayout() {
    document.querySelector("body > #mobileMenu")?.remove();
    document.querySelector("body > header")?.remove();
    document.querySelector("body > nav")?.remove();
    document.querySelector("body > footer")?.remove();
  }

  function injectStyles() {
    if (document.getElementById("origem-global-layout-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "origem-global-layout-style";
    style.textContent = `
      :root {
        --origem-surface: #131314;
        --origem-surface-low: #0e0e0f;
        --origem-surface-line: rgba(197, 160, 89, 0.28);
        --origem-gold: #C5A059;
        --origem-cream: #F4F1EA;
        --origem-muted: #d1c5b4;
        --origem-clay: #B35A38;
        --origem-graphite: #1A1A1B;
      }

      .origem-header {
        align-items: center;
        background: rgba(19, 19, 20, 0.92);
        border-bottom: 1px solid var(--origem-surface-line);
        box-sizing: border-box;
        display: flex;
        gap: 24px;
        height: 76px;
        justify-content: space-between;
        left: 0;
        padding: 0 clamp(20px, 5vw, 64px);
        position: fixed;
        right: 0;
        top: 0;
        z-index: 80;
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
      }

      .origem-brand {
        color: var(--origem-gold);
        font-family: "EB Garamond", Georgia, serif;
        font-size: clamp(30px, 4vw, 44px);
        font-weight: 500;
        line-height: 1;
        text-decoration: none;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .origem-nav {
        align-items: center;
        display: flex;
        gap: clamp(18px, 3vw, 34px);
      }

      .origem-nav__link {
        border-bottom: 1px solid transparent;
        color: var(--origem-muted);
        font-family: Inter, Arial, sans-serif;
        font-size: 15px;
        font-weight: 600;
        line-height: 1;
        padding: 8px 0;
        text-decoration: none;
        transition: color 180ms ease, border-color 180ms ease;
        white-space: nowrap;
      }

      .origem-nav__link:hover,
      .origem-nav__link--active {
        border-color: var(--origem-gold);
        color: var(--origem-gold);
      }

      .origem-menu-button {
        align-items: center;
        background: transparent;
        border: 1px solid var(--origem-surface-line);
        color: var(--origem-gold);
        cursor: pointer;
        display: none;
        font-family: Inter, Arial, sans-serif;
        font-size: 22px;
        height: 44px;
        justify-content: center;
        width: 44px;
      }

      .origem-mobile-panel {
        background: rgba(14, 14, 15, 0.98);
        display: none;
        inset: 0;
        padding: 96px 28px 40px;
        position: fixed;
        z-index: 90;
      }

      .origem-mobile-panel--open {
        display: block;
      }

      .origem-mobile-panel__close {
        background: transparent;
        border: 1px solid var(--origem-surface-line);
        color: var(--origem-gold);
        cursor: pointer;
        font-size: 30px;
        height: 46px;
        position: absolute;
        right: 24px;
        top: 22px;
        width: 46px;
      }

      .origem-mobile-panel__nav {
        display: flex;
        flex-direction: column;
        gap: 26px;
      }

      .origem-mobile-panel__nav .origem-nav__link {
        font-family: "EB Garamond", Georgia, serif;
        font-size: 42px;
        font-weight: 500;
      }

      .origem-footer {
        background: var(--origem-surface-low);
        border-top: 1px solid var(--origem-surface-line);
        box-sizing: border-box;
        color: var(--origem-muted);
        display: grid;
        gap: 32px;
        grid-template-columns: minmax(0, 1.3fr) minmax(180px, 0.7fr) minmax(180px, 0.7fr);
        padding: 72px clamp(20px, 5vw, 64px);
      }

      .origem-footer__brand {
        color: var(--origem-gold);
        font-family: "EB Garamond", Georgia, serif;
        font-size: 40px;
        line-height: 1;
        margin: 0 0 18px;
        text-transform: uppercase;
      }

      .origem-footer__text,
      .origem-footer__copy {
        font-family: Inter, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.7;
        margin: 0;
        max-width: 420px;
      }

      .origem-footer__title {
        color: var(--origem-gold);
        display: block;
        font-family: Inter, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.14em;
        margin-bottom: 18px;
        text-transform: uppercase;
      }

      .origem-footer__links {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .origem-footer__links a {
        color: var(--origem-muted);
        font-family: Inter, Arial, sans-serif;
        font-size: 15px;
        text-decoration: none;
      }

      .origem-footer__links a:hover {
        color: var(--origem-gold);
      }

      @media (max-width: 820px) {
        .origem-header {
          height: 70px;
        }

        .origem-nav {
          display: none;
        }

        .origem-menu-button {
          display: inline-flex;
        }

        .origem-footer {
          grid-template-columns: 1fr;
          padding-bottom: 52px;
          padding-top: 52px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createHeader() {
    const header = document.createElement("header");
    header.className = "origem-header";
    header.innerHTML = `
      <a class="origem-brand" href="/" aria-label="Origem MS">Origem MS</a>
      <nav class="origem-nav" aria-label="Navegação principal">
        ${links.map(linkMarkup).join("")}
      </nav>
      <button class="origem-menu-button" type="button" aria-label="Abrir menu" aria-expanded="false">☰</button>
    `;
    return header;
  }

  function createMobilePanel() {
    const panel = document.createElement("div");
    panel.className = "origem-mobile-panel";
    panel.innerHTML = `
      <button class="origem-mobile-panel__close" type="button" aria-label="Fechar menu">×</button>
      <nav class="origem-mobile-panel__nav" aria-label="Navegação principal no celular">
        ${links.map(linkMarkup).join("")}
      </nav>
    `;
    return panel;
  }

  function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "origem-footer";
    footer.innerHTML = `
      <section>
        <h2 class="origem-footer__brand">Origem MS</h2>
        <p class="origem-footer__text">Uma curadoria definitiva da gastronomia, cultura e turismo no coração da Rota Bioceânica.</p>
      </section>
      <section>
        <span class="origem-footer__title">Explorar</span>
        <nav class="origem-footer__links" aria-label="Links institucionais">
          ${footerLinks.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
        </nav>
      </section>
      <section>
        <span class="origem-footer__title">Território</span>
        <p class="origem-footer__copy">© 2026 Origem MS. Território de Identidade.</p>
      </section>
    `;
    return footer;
  }

  function bindMobileMenu(header, panel) {
    const openButton = header.querySelector(".origem-menu-button");
    const closeButton = panel.querySelector(".origem-mobile-panel__close");

    function open() {
      panel.classList.add("origem-mobile-panel--open");
      openButton.setAttribute("aria-expanded", "true");
    }

    function close() {
      panel.classList.remove("origem-mobile-panel--open");
      openButton.setAttribute("aria-expanded", "false");
    }

    openButton.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    panel.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        close();
      }
    });
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function installFilters() {
    document.querySelectorAll("[data-origem-filter-form]").forEach((form) => {
      const search = form.querySelector("[data-filter-search]");
      const category = form.querySelector("[data-filter-category]");
      const location = form.querySelector("[data-filter-location]");
      const clear = form.querySelector("[data-filter-clear]");
      const count = form.querySelector("[data-filter-count]");
      const cards = Array.from(document.querySelectorAll("[data-filter-card]"));
      const empty = document.querySelector("[data-filter-empty]");

      if (!cards.length) {
        return;
      }

      function cardMatches(card) {
        const searchValue = normalize(search?.value);
        const categoryValue = normalize(category?.value);
        const locationValue = normalize(location?.value);
        const text = normalize(card.dataset.filterText || card.textContent);
        const cardCategory = normalize(card.dataset.filterCategory);
        const cardLocation = normalize(card.dataset.filterLocation);

        return (!searchValue || text.includes(searchValue))
          && (!categoryValue || cardCategory.includes(categoryValue))
          && (!locationValue || cardLocation.includes(locationValue));
      }

      function update() {
        let visible = 0;

        cards.forEach((card) => {
          const matched = cardMatches(card);
          card.classList.toggle("hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("hidden", visible !== 0);
        }

        if (count) {
          count.textContent = visible === cards.length
            ? `Exibindo todos os ${cards.length} itens.`
            : `Exibindo ${visible} de ${cards.length} itens.`;
        }
      }

      [search, category, location].forEach((control) => {
        control?.addEventListener("input", update);
        control?.addEventListener("change", update);
      });

      clear?.addEventListener("click", () => {
        if (search) search.value = "";
        if (category) category.value = "";
        if (location) location.value = "";
        update();
      });

      update();
    });
  }

  function installLayout() {
    injectStyles();
    removeLegacyLayout();

    const header = createHeader();
    const panel = createMobilePanel();
    const footer = createFooter();

    document.body.prepend(panel);
    document.body.prepend(header);
    document.body.append(footer);
    bindMobileMenu(header, panel);
    installFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installLayout);
  } else {
    installLayout();
  }
})();
