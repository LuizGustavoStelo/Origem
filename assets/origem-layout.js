(() => {
  document.querySelectorAll(".menu-toggle").forEach((button) => {
    const nav = document.getElementById(button.getAttribute("aria-controls"));
    if (!nav) return;

    const label = button.querySelector("span");
    const iconPath = button.querySelector(".menu-icon path");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
      if (label) label.textContent = open ? "Fechar" : "Menu";
      if (iconPath) iconPath.setAttribute("d", open ? "M5 5l14 14M19 5 5 19" : "M4 7h16M4 12h16M4 17h16");
    };

    button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 821px)").matches) setOpen(false);
    });
  });

  const revealTargets = document.querySelectorAll([
    ".story-mosaic > .story > figure, .story-mosaic > .story > h3, .story-mosaic > .story > .story__link",
    ".food-notebook > .section-heading, .food-entry--text .food-entry__copy",
    ".territory-spread > .media-bleed, .territory-spread > .territory-spread__copy",
    ".food-entry:not(.food-entry--text) > figure, .food-entry:not(.food-entry--text) > .food-entry__copy",
    ".directory-note > *",
    ".destination > figure, .destination > div",
    ".nature-essay > figure, .nature-essay > div",
    ".culture-story > figure, .culture-story > .culture-story__copy",
    ".city-culture__figures > figure",
    ".city-culture > .section-heading, .city-culture > .section-tail, .culture-note > div",
    ".route-status > div",
    ".route-itinerary > .route-country",
    ".route-branches > .route-branch",
    ".route-ports > *",
    ".split-feature > *",
    ".business-details__intro, .business-list > div",
    ".site-footer__content",
  ].join(","));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealTargets.length && !reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });

    document.documentElement.classList.add("has-scroll-reveal");
    revealTargets.forEach((target) => {
      target.dataset.reveal = "";
      if (target.matches(".story > h3, .story__link, .food-entry__copy, .territory-spread__copy, .directory-note__copy, .destination > div, .nature-essay > div, .culture-story__copy, .city-culture > .section-heading, .city-culture > .section-tail, .culture-note > div, .route-status > div, .split-feature__copy")) {
        target.dataset.revealDelay = "short";
      }
      observer.observe(target);
    });
  }

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const stories = [...document.querySelectorAll("[data-story]")];
  const storyList = document.getElementById("story-list");
  const status = document.getElementById("filter-status");

  if (!filterButtons.length || !stories.length) return;

  const validFilters = new Set(filterButtons.map((button) => button.dataset.filter));
  const filterFromUrl = () => {
    const requested = new URLSearchParams(window.location.search).get("assunto");
    return validFilters.has(requested) ? requested : "tudo";
  };

  let activeFilter = "tudo";
  const applyFilter = (selected) => {
    const selectedButton = filterButtons.find((button) => button.dataset.filter === selected);
    if (!selectedButton) return;

    activeFilter = selected;
    if (storyList) storyList.classList.toggle("is-filtered", selected !== "tudo");

    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button === selectedButton));
    });

    let visibleCount = 0;
    stories.forEach((story) => {
      const visible = selected === "tudo" || story.dataset.story === selected;
      story.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (status) {
      const subject = selected === "tudo" ? "para explorar" : `sobre ${selectedButton.textContent.trim().toLowerCase()}`;
      status.textContent = `${visibleCount} ${visibleCount === 1 ? "história" : "histórias"} ${subject}.`;
    }
  };

  applyFilter(filterFromUrl());
  window.addEventListener("popstate", () => applyFilter(filterFromUrl()));

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      if (selected === activeFilter) return;

      const url = new URL(window.location.href);
      if (selected === "tudo") url.searchParams.delete("assunto");
      else url.searchParams.set("assunto", selected);

      window.history.pushState({ assunto: selected }, "", url);
      applyFilter(selected);
    });
  });
})();
