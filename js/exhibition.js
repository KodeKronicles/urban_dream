/* ============================================
   1. INIZIALIZZAZIONE - DOM Ready e JSON Fetch
=============================================== */
document.addEventListener("DOMContentLoaded", () => {
  fetch("data2.json")
    .then(res => res.json())
    .then(data => {
      const items = data.items;

      /* ============================================
         2. GENERAZIONE CARD NEI TAB TEMATICI
      =============================================== */
      const tabs = {
        space: "Space",
        time: "Time",
        reality: "Reality",
        context: "Context",
        ideals: "Ideals"
      };

      Object.entries(tabs).forEach(([tabId, fieldName]) => {
        const section = document.querySelector(`#${tabId} .card-wrapper`);
        if (!section) return;

        section.className = "card-wrapper";
        section.innerHTML = "";

        items.forEach(item => {
          const value = item.info[fieldName];
          if (!value) return;

          const filterClass = value.trim().toLowerCase().replace(/\s+/g, "-");

          const col = document.createElement("div");
          col.className = `col filter-item ${filterClass}`;

          col.innerHTML = `
            <div class="card h-100">
              <img src="${item.image1}" class="card-img-top img-fluid" alt="${item.shortName}">
              <div class="card-body">
               <h5 class="card-title">${item.shortName}</h5>
              </div>
            </div>
          `;

          section.appendChild(col);
        });
      });

      /* ============================================
         3. FUNZIONE DI FILTRAGGIO PER CATEGORIA
      =============================================== */
      function applyFilter(tabId, filter, shouldScroll = true) {
        const tabPane = document.getElementById(tabId);
        if (!tabPane) return;

        const cards = tabPane.querySelectorAll(".card-wrapper .filter-item");
        let firstVisible = null;

        cards.forEach(card => {
          if (card.classList.contains(filter)) {
            card.style.display = "block";
            if (!firstVisible) firstVisible = card;
          } else {
            card.style.display = "none";
          }
        });

        if (shouldScroll && firstVisible) {
          const offset = firstVisible.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }

        tabPane.querySelectorAll(".filter-btn").forEach(b => {
          b.classList.toggle("active", b.getAttribute("data-filter") === filter);
        });
      }

      /* ============================================
         4. EVENTI FILTRO PER PULSANTI
      =============================================== */
      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          const filter = this.getAttribute("data-filter");
          const tabPane = this.closest(".tab-pane");
          if (!tabPane) return;
          const tabId = tabPane.id;
          applyFilter(tabId, filter, true);
        });
      });

      /* ============================================
         5. SCROLL MORBIDO AL CAMBIO TAB
      =============================================== */
      document.querySelectorAll('#myTab button[data-bs-toggle="pill"]').forEach(button => {
        button.addEventListener("shown.bs.tab", function () {
          const targetId = this.getAttribute("data-bs-target");
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            const offset = targetEl.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        });
      });

      /* ============================================
         6. FILTRO INIZIALE E CAMBIO AUTOMATICO TAB
      =============================================== */
      const defaultFilters = {
        space: "global",
        time: "before-2000",
        reality: "in-theory",
        context: "urban",
        ideals: "utopian"
      };

      window.addEventListener("load", () => {
        const activeTabPane = document.querySelector(".tab-pane.active.show");
        if (activeTabPane) {
          const tabId = activeTabPane.id;
          const filter = defaultFilters[tabId];
          if (filter) applyFilter(tabId, filter, false);
        }
      });

      document.querySelectorAll('#myTab button[data-bs-toggle="pill"]').forEach(button => {
        button.addEventListener("shown.bs.tab", function () {
          const tabId = this.getAttribute("data-bs-target")?.replace("#", "");
          const filter = defaultFilters[tabId];
          if (filter) applyFilter(tabId, filter, false);
        });
      });
    });
});
