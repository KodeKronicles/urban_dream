/* ============================================
   1. INIZIALIZZAZIONE - DOM Ready e JSON Fetch
=============================================== */
document.addEventListener("DOMContentLoaded", function () {
    backButtonContainer = document.querySelector(".back-button-container");
    backButton = document.getElementById("backButton");

    backButton.addEventListener("click", handleBackButton);
    setupImageMapClicks();
    setupTableClicks();

    fetchAndRenderData();
});

/* ============================================
   2. FETCH DATI E COSTRUZIONE TABELLA
=============================================== */
function fetchAndRenderData() {
    fetch('data2.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('dynamicTableBody');
            if (!tableBody) return;
            data.items.forEach(item => insertTableRows(item, tableBody));
        });
}

function insertTableRows(item, tableBody) {
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
                        <img class="hidden-img" src="${item.image2}" alt="${item.shortName} Image">
                    </div>
                    <div class="col-md-8 details-right">
                        <p>${item.mediumInfo || item.shortInfo}</p>
                        <p>Location: ${item.info.Location}</p>
                        <p>Check out if you like: ${item.shortInfo}</p>
                        <p>Recommended by: ${item.info["Recommended by"]}</p>
                        <a href="${item.info.Link}" target="_blank" class="read-more">Read More</a>
                    </div>
                </div>
            </div>
        </td>
    `;

    tableBody.appendChild(mainRow);
    tableBody.appendChild(detailRow);
}

/* ============================================
   3. FUNZIONI DI INTERAZIONE
=============================================== */
function toggleInfo(event, element) {
    event.stopPropagation();
    const mainRow = element.closest('tr');
    const infoRow = mainRow.nextElementSibling;

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

function filterTable(value, selector) {
    let hasMatch = false;
    document.querySelectorAll("tbody tr.item").forEach(row => {
        const cell = row.querySelector(selector);
        const match = cell && cell.textContent.trim().toLowerCase() === value.toString().toLowerCase();
        row.style.display = match ? "" : "none";
        if (match) hasMatch = true;
    });
    checkBackButton();
    updateImage(hasMatch ? value : "default");
}

function updateImage(category) {
    const svgImage = document.querySelector('svg image');

    const normalizedCategory = category?.toLowerCase().replace(/\s+/g, '-') || 'default';
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

function sortTable(columnIndex, element) {
    const table = document.getElementById("Table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr:not(.hidden-info)"));
    const direction = element.classList.contains("desc") ? "asc" : "desc";

    const expandedRows = [];
    document.querySelectorAll("tr.expanded").forEach(row => {
        expandedRows.push(row.id);
    });

    document.querySelectorAll("th").forEach(th => th.classList.remove("desc"));
    if (direction === "desc") element.classList.add("desc");

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

    tbody.innerHTML = "";
    rows.forEach(row => {
        tbody.appendChild(row);
        const hiddenRowData = hiddenRows.find(hr => hr.mainId === row.id);
        if (hiddenRowData) {
            tbody.appendChild(hiddenRowData.element);
        }
    });

    expandedRows.forEach(id => {
        const row = document.getElementById(id);
        if (row) {
            row.classList.add("expanded");
            const toggleBtn = row.querySelector(".toggle-info");
            if (toggleBtn) toggleBtn.textContent = "×";
            const infoRow = row.nextElementSibling;
            if (infoRow && infoRow.classList.contains("hidden-info")) {
                infoRow.style.display = "table-row";
            }
        }
    });
}

/* ============================================
   4. EVENTI UTENTE
=============================================== */
function handleBackButton() {
    document.querySelectorAll("tr.item").forEach(row => {
        row.style.display = "";
    });
    checkBackButton();
    updateImage("default");
}

function checkBackButton() {
    const selectedItems = document.querySelectorAll("tr.item[style='display: none;']");
    backButtonContainer.classList.toggle("hidden", selectedItems.length === 0);
}

function setupImageMapClicks() {
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
}

function setupTableClicks() {
    document.querySelector('tbody').addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-info')) {
            toggleInfo(e, e.target);
        }
        if (e.target.classList.contains('filter-year') || 
            e.target.classList.contains('filter-context') ||
            e.target.classList.contains('filter-status') ||
            e.target.classList.contains('filter-ideals')) {
            const selector = `.${e.target.classList[0]}`;
            filterTable(e.target.textContent, selector);
        }
    });
}

/* ============================================
   5. DROPDOWN & FILTRI AVANZATI
=============================================== */

function filterByStatus(status) {
    filterTable(status === "all" ? "" : status, ".filter-status");
    toggleDropdown("statusDropdown", 4);
}

function filterByContext(context) {
    filterTable(context === "all" ? "" : context, ".filter-context");
    toggleDropdown("contextDropdown", 5);
}

function filterByIdeals(ideal) {
    filterTable(ideal === "all" ? "" : ideal, ".filter-ideals");
    toggleDropdown("idealsDropdown", 6);
}

function toggleDropdown(dropdownId, columnIndex) {
    const dropdown = document.getElementById(dropdownId);
    const arrow = document.querySelector(`.status-header:nth-child(${columnIndex}) .sort-arrow`);
    
    dropdown.classList.toggle("show");       // apre o chiude il menu
    arrow.classList.toggle("desc");          // ruota la freccia
    closeOtherDropdowns(dropdown);           // chiude gli altri
}

function closeOtherDropdowns(currentDropdown) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== currentDropdown) {
            menu.classList.remove("show");
            menu.closest("th")?.querySelector(".sort-arrow")?.classList.remove("desc");
        }
    });
}

/* ============================================
   6. CLICK FUORI DAI DROPDOWN
=============================================== */
document.addEventListener("click", function(e) {
    if (!e.target.closest(".status-header")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
        document.querySelectorAll(".sort-arrow").forEach(arrow => arrow.classList.remove("desc"));
    }
});
