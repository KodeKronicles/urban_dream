document.addEventListener("DOMContentLoaded", () => {
    fetch("data2.json")
      .then(res => res.json())
      .then(data => {
        const items = data.items;
  
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
  
          const grouped = {};
  
          items.forEach(item => {
            const value = item.info[fieldName];
            if (!value) return;
  
            const key = value.trim().toLowerCase(); // 🟢 forza lowercase per compatibilità filtro
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
          });
  
          for (const [subcat, cards] of Object.entries(grouped)) {
            const subcatWrapper = document.createElement("div");
            subcatWrapper.classList.add(
              "row",
              "row-cols-1",
              "row-cols-md-3",
              "g-4",
              "card-container",
              "custom-card-wrapper"
            );
  
            subcatWrapper.innerHTML = `
              ${cards
                .map(
                  item => `
                  <div class="col filter-item ${subcat
                    .toLowerCase()
                    .replace(/\s+/g, "-")}">
                    <div class="card h-100">
                      <img src="${item.image1}" class="card-img-top img-fluid" alt="${item.shortName}">
                      <div class="card-body">
                        <h5 class="card-title">
                          <a href="${item.mediumInfo}" target="_blank">${item.shortName}</a>
                        </h5>
                      </div>
                    </div>
                  </div>
                `
                )
                .join("")}
            `;
  
            subcatWrapper.style.display = "none";
            section.appendChild(subcatWrapper);
          }
        });
  
        // Funzione riutilizzabile per applicare un filtro in un tab
        function applyFilter(tabId, filter, shouldScroll = true) {
          const tabPane = document.getElementById(tabId);
          if (!tabPane) return;
  
          const cardContainers = tabPane.querySelectorAll(".card-container");
  
          cardContainers.forEach(container => {
            const shouldShow = container.querySelector(`.${filter}`);
            container.style.display = shouldShow ? "block" : "none";
  
            if (shouldScroll && shouldShow) {
              const offset =
                container.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({
                top: offset,
                behavior: "smooth"
              });
            }
          });
  
          tabPane.querySelectorAll(".filter-btn").forEach(b => {
            b.classList.toggle(
              "active",
              b.getAttribute("data-filter") === filter
            );
          });
        }
  
        // Evento: click su un filtro
        document.querySelectorAll(".filter-btn").forEach(btn => {
          btn.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");
            const tabPane = this.closest(".tab-pane");
            if (!tabPane) return;
            const tabId = tabPane.id;
            applyFilter(tabId, filter, true); // con scroll
          });
        });
  
        // Scroll morbido quando si cambia tab (SPACE, TIME, ecc.)
        document.querySelectorAll(
          '#myTab button[data-bs-toggle="pill"]'
        ).forEach(button => {
          button.addEventListener("shown.bs.tab", function () {
            const targetId = this.getAttribute("data-bs-target");
            const targetEl = document.querySelector(targetId);
  
            if (targetEl) {
              const offset =
                targetEl.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({
                top: offset,
                behavior: "smooth"
              });
            }
          });
        });
  
        // Filtro iniziale per il primo tab (space)
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
            if (filter) applyFilter(tabId, filter, false); // senza scroll
          }
        });
  
        // Applica filtro automatico quando cambio tab
        document
          .querySelectorAll('#myTab button[data-bs-toggle="pill"]')
          .forEach(button => {
            button.addEventListener("shown.bs.tab", function () {
              const tabId = this.getAttribute("data-bs-target")?.replace("#", "");
              const filter = defaultFilters[tabId];
              if (filter) applyFilter(tabId, filter, false); // senza scroll
            });
          });
      });
  });
  