document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      menuButton.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
      menu.classList.toggle("is-open", !isExpanded);
    });

    menu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        menu.classList.remove("is-open");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const searchInput = document.querySelector("#product-search");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const emptyState = document.querySelector("#empty-state");
  let activeCategory = new URLSearchParams(window.location.search).get("categorie") || "tout";

  const applyProductFilters = () => {
    const query = searchInput instanceof HTMLInputElement ? searchInput.value.trim().toLocaleLowerCase("fr") : "";
    let visibleCount = 0;

    productCards.forEach((card) => {
      const matchesCategory = activeCategory === "tout" || card.dataset.category === activeCategory;
      const matchesSearch = (card.dataset.name || "").toLocaleLowerCase("fr").includes(query);
      const isVisible = matchesCategory && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyState instanceof HTMLElement) emptyState.hidden = visibleCount > 0;
  };

  if (productCards.length > 0) {
    if (!filterButtons.some((button) => button.dataset.filter === activeCategory)) activeCategory = "tout";
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === activeCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.addEventListener("click", () => {
        activeCategory = button.dataset.filter || "tout";
        filterButtons.forEach((filterButton) => {
          const selected = filterButton === button;
          filterButton.classList.toggle("is-active", selected);
          filterButton.setAttribute("aria-pressed", String(selected));
        });
        applyProductFilters();
      });
    });
    if (searchInput instanceof HTMLInputElement) searchInput.addEventListener("input", applyProductFilters);
    applyProductFilters();
  }

  const productDialog = document.querySelector(".product-dialog");
  if (productDialog instanceof HTMLDialogElement) {
    const dialogTitle = productDialog.querySelector("#dialog-title");
    const orderLink = productDialog.querySelector("#dialog-order");
    productCards.forEach((card) => {
      const viewButton = card.querySelector("[data-view]");
      if (!(viewButton instanceof HTMLButtonElement)) return;
      viewButton.addEventListener("click", () => {
        const productName = viewButton.dataset.view || "Notre collection";
        if (dialogTitle) dialogTitle.textContent = productName;
        if (orderLink instanceof HTMLAnchorElement) {
          orderLink.href = `https://wa.me/212778188509?text=${encodeURIComponent(`Bonjour, je souhaite en savoir plus sur le ${productName}.`)}`;
        }
        productDialog.showModal();
      });
    });
    productDialog.querySelector(".dialog-close")?.addEventListener("click", () => productDialog.close());
    productDialog.addEventListener("click", (event) => {
      if (event.target === productDialog) productDialog.close();
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const text = `Bonjour CAFTAN ROYAL, je m'appelle ${name} (${email}). ${message}`;
      window.open(`https://wa.me/212778188509?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    });
  }
});
