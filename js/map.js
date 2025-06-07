
// Inserisce dinamicamente le righe della tabella da data2.json

document.addEventListener("DOMContentLoaded", function() {
    fetch('data2.json')  
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
        const tableBody = document.getElementById('dynamicTableBody');
        if (!tableBody) {
          console.error("Elemento #dynamicTableBody non trovato!");
          return;
        }
  
        data.items.forEach(item => {
          const mainRow = document.createElement('tr');
          mainRow.className = `item ${item.info.Status.toLowerCase()} ${item.info.Context.toLowerCase().replace(/\s+/g, '_')} ${item.info.Ideals.toLowerCase()}`;
          mainRow.id = `id${item.id}`;
  
          mainRow.innerHTML = `
            <td>${item.id}</td>
            <td class="filter-item">${item.shortName}</td>
            <td class="filter-year">${item.info.Date}</td>
            <td class="filter-status">${item.info.Status}</td>
            <td><span class="filter-context">${item.info.Context}</span></td>
            <td><span class="filter-ideals">${item.info.Ideals}</span></td>
            <td class="toggle-info" onclick="toggleInfo(event, this)">+</td>
          `;
  
          const detailRow = document.createElement('tr');
          detailRow.className = 'hidden-info';
          detailRow.style.display = 'none';
          detailRow.innerHTML = `
            <td colspan="7">
              <div class="container">
                <div class="row">
                  <div class="col-md-4 details-left">
                    <img class="film-image" src="${item.image1}" alt="${item.shortName} Image">
                  </div>
                  <div class="col-md-8 details-right">
                    <p>${item.mediumInfo || item.shortInfo}</p>
                    <p>Location: ${item.info.Location}</p>
                    <p>Check out if you like: ${item.shortInfo}</p>
                    <p>Recommended by: ${item.info["Recommended by"]}</p>
                    <a href="${item.longInfo}" class="btn-watch-trailer">Read More</a>
                  </div>
                </div>
              </div>
            </td>
          `;
  
          tableBody.appendChild(mainRow);
          tableBody.appendChild(detailRow);
        });
      })
      .catch(error => {
        console.error("Errore nel caricamento del JSON:", error);
      });
  });

  
let backButtonContainer;
let backButton;

function updateImage(category) {
    const svgImage = document.querySelector('svg image');
    if (!svgImage) return;

    const normalizedCategory = category?.toLowerCase().replace(/\s+/g, '-') || 'default'    
    let imagePath = 'img/map/all.png';
    
    switch(normalizedCategory) {
        case 'unbuilt': imagePath = 'img/map/unbuilt.png'; break;
        case 'built': imagePath = 'img/map/built.png'; break;
        case 'utopian': imagePath = 'img/map/utopian.png'; break;
        case 'dystopian': imagePath = 'img/map/dystopian.png'; break;
        case 'deconstructive': imagePath = 'img/map/deconstruction.png'; break;
        case 'innovative': imagePath = 'img/map/innovation.png'; break;
        case 'radical-living': imagePath = 'img/map/radical.png'; break;
        case 'artistic-intervention': imagePath = 'img/map/artistic.png'; break;
        case 'tech-infrastructure': imagePath = 'img/map/tech.png'; break;
        case 'urbanism': imagePath = 'img/map/urbanism.png'; break;
    }

    svgImage.setAttribute('xlink:href', imagePath);
}

function filterTable(value, selector) {
    let hasMatch = false;
    
    document.querySelectorAll("tbody tr.item").forEach(row => {
        const cell = row.querySelector(selector);
        const match = cell && cell.textContent.trim().toLowerCase() === value.toString().toLowerCase();

        row.style.display = match ? "" : "none";
        if(match) hasMatch = true;
    });

    checkBackButton();
    updateImage(hasMatch ? value : "default");
}

function checkBackButton() {
    const selectedItems = document.querySelectorAll("tr.item[style='display: none;']");
    backButtonContainer.classList.toggle("hidden", selectedItems.length === 0);
}

function toggleInfo(event, element) {
    event.stopPropagation();
    
    const mainRow = element.closest('tr');
    const infoRow = mainRow.nextElementSibling;

    if (!infoRow || !infoRow.classList.contains('hidden-info')) return;

    if (infoRow.style.display === "none" || !infoRow.style.display) {
        infoRow.style.display = "table-row";
        mainRow.classList.add("expanded");
        element.textContent = "×";
    } else {
        infoRow.style.display = "none";
        mainRow.classList.remove("expanded");
        element.textContent = "+";
    }
}

function sortTable(columnIndex, element) {
    const table = document.getElementById("Table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr:not(.hidden-info)"));
    const direction = element.classList.contains("desc") ? "asc" : "desc";

    // Salva stato espanso
    const expandedRows = [];
    document.querySelectorAll("tr.expanded").forEach(row => {
        expandedRows.push(row.id);
    });

    // Aggiorna indicatori
    document.querySelectorAll("th").forEach(th => th.classList.remove("desc"));
    if (direction === "desc") element.classList.add("desc");
    
    // Salva le righe nascoste associate
    const hiddenRows = [];
    rows.forEach(row => {
        const hiddenRow = row.nextElementSibling;
        if (hiddenRow && hiddenRow.classList.contains("hidden-info")) {
            hiddenRows.push({
                mainId: row.id,
                element: hiddenRow,
                isExpanded: row.classList.contains("expanded")
            });
        }
    });

    // Ordina righe principali
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim();
        const cellB = rowB.cells[columnIndex].textContent.trim();
        const isNumeric = !isNaN(cellA) && !isNaN(cellB);

        if (isNumeric) {
            return direction === "asc" 
                ? parseFloat(cellA) - parseFloat(cellB) 
                : parseFloat(cellB) - parseFloat(cellA);
        }
        
        return direction === "asc"
            ? cellA.localeCompare(cellB, undefined, { numeric: true })
            : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    // Ricostruisci tabella
    tbody.innerHTML = "";
    rows.forEach(row => {
        tbody.appendChild(row);
        
        // Trova e aggiungi riga nascosta associata
        const hiddenRowData = hiddenRows.find(hr => hr.mainId === row.id);
        if (hiddenRowData) {
            tbody.appendChild(hiddenRowData.element);
        }
    });

    // Ripristina stato espanso
    expandedRows.forEach(id => {
        const row = document.getElementById(id);
        if (row) {
            row.classList.add("expanded");
            const toggleBtn = row.querySelector(".toggle-info");
            if (toggleBtn) toggleBtn.textContent = "×";
            
            // Ripristina visualizzazione riga nascosta
            const infoRow = row.nextElementSibling;
            if (infoRow && infoRow.classList.contains("hidden-info")) {
                infoRow.style.display = "table-row";
            }
        }
    });
}

function toggleStatusDropdown() {
    const dropdown = document.getElementById("statusDropdown");
    const arrow = document.querySelector(".status-header .sort-arrow");
    
    dropdown.classList.toggle("show");
    arrow.classList.toggle("desc");
    
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== dropdown) {
            menu.classList.remove("show");
            menu.closest("th")?.querySelector(".sort-arrow")?.classList.remove("desc");
        }
    });
}

function filterByStatus(status) {
    filterTable(status === "all" ? "" : status, ".filter-status");
    toggleStatusDropdown();
}

// Context Dropdown
function toggleContextDropdown() {
    const dropdown = document.getElementById("contextDropdown");
    const arrow = document.querySelector(".status-header:nth-child(5) .sort-arrow");
    
    dropdown.classList.toggle("show");
    arrow.classList.toggle("desc");
    
    closeOtherDropdowns(dropdown);
}

function filterByContext(context) {
    filterTable(context === "all" ? "" : context, ".filter-context");
    toggleContextDropdown();
}

// Ideals Dropdown
function toggleIdealsDropdown() {
    const dropdown = document.getElementById("idealsDropdown");
    const arrow = document.querySelector(".status-header:nth-child(6) .sort-arrow");
    
    dropdown.classList.toggle("show");
    arrow.classList.toggle("desc");
    
    closeOtherDropdowns(dropdown);
}

function filterByIdeals(ideal) {
    filterTable(ideal === "all" ? "" : ideal, ".filter-ideals");
    toggleIdealsDropdown();
}

// Funzione helper per chiudere altri dropdown
function closeOtherDropdowns(currentDropdown) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== currentDropdown) {
            menu.classList.remove("show");
            menu.closest("th")?.querySelector(".sort-arrow")?.classList.remove("desc");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize global elements
    backButtonContainer = document.querySelector(".back-button-container");
    backButton = document.getElementById("backButton");

    // Back button handler
    backButton.addEventListener("click", function() {
        document.querySelectorAll("tr.item").forEach(row => {
            row.style.display = "";
        });
        checkBackButton();
        updateImage("default");
    });

    // Map circles click handler
    document.querySelectorAll('.image-mapper-shape').forEach(circle => {
        circle.addEventListener('click', function(e) {
            const anchor = e.target.closest('a');
            const itemId = anchor?.getAttribute('xlink:title')?.replace('id', '');
            if(itemId) {
                filterTable(itemId, 'td:first-child');
                document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Delegazione eventi per la tabella
    document.querySelector('tbody').addEventListener('click', function(e) {
        // Gestione toggle info
        if (e.target.classList.contains('toggle-info')) {
            toggleInfo(e, e.target);
        }
        
        // Gestione filtri
        if (e.target.classList.contains('filter-year') || 
            e.target.classList.contains('filter-context') ||
            e.target.classList.contains('filter-status') ||
            e.target.classList.contains('filter-ideals')) {
            
            const selector = `.${e.target.classList[0]}`;
            filterTable(e.target.textContent, selector);
        }
    });
});

// Global click handler for dropdowns
document.addEventListener("click", function(e) {
    if (!e.target.closest(".status-header")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
        document.querySelectorAll(".sort-arrow").forEach(arrow => arrow.classList.remove("desc"));
    }
});
