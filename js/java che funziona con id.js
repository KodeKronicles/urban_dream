// CONSIDERA CHE USANDO QUESTO CODICE DEVI CAMBIARE CLASSE A QUELLI CON DOPPIA PAROLA E METTERLI COME radical-living
// non ha update image implementato 

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
        case 'deconstruction': imagePath = 'img/map/deconstruction.png'; break;
        case 'innovation': imagePath = 'img/map/innovation.png'; break;
        case 'radical-living': imagePath = 'img/map/radical.png'; break;
        case 'artistic-intervention': imagePath = 'img/map/artistic.png'; break;
        case 'tech-infrastructure': imagePath = 'img/map/tech.png'; break;
        case 'urbanism': imagePath = 'img/map/urbanism.png'; break;
    }

    svgImage.setAttribute('xlink:href', imagePath);
}

function checkBackButton() {
    const selectedItems = document.querySelectorAll("tr.item[style='display: none;']");
    backButtonContainer.classList.toggle("hidden", selectedItems.length === 0);
}

function toggleInfo(event, element) {
    const mainRow = element.parentElement;
    const infoRow = mainRow.nextElementSibling;

    if (infoRow.style.display === "none" || !infoRow.style.display) {
        infoRow.style.display = "table-row";
        mainRow.classList.add("expanded");
        element.innerText = "×";
    } else {
        infoRow.style.display = "none";
        mainRow.classList.remove("expanded");
        element.innerText = "+";
    }
}

function sortTable(columnIndex, element) {
    const table = document.getElementById("Table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr:not(.hidden-info)"));
    const direction = element.classList.contains("desc") ? "asc" : "desc";

    document.querySelectorAll("th").forEach(th => th.classList.remove("desc"));
    if (direction === "desc") element.classList.add("desc");

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText.trim();
        const cellB = rowB.cells[columnIndex].innerText.trim();

        if (!isNaN(cellA) && !isNaN(cellB)) {
            return direction === "asc" 
                ? parseInt(cellA) - parseInt(cellB) 
                : parseInt(cellB) - parseInt(cellA);
        }
        return direction === "asc"
            ? cellA.localeCompare(cellB, undefined, { numeric: true })
            : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    tbody.innerHTML = "";
    rows.forEach(row => {
        tbody.appendChild(row);
        const hiddenRow = document.getElementById(row.id)?.nextElementSibling;
        if (hiddenRow?.classList.contains("hidden-info")) tbody.appendChild(hiddenRow);
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

document.addEventListener("DOMContentLoaded", function () {
    // Initialize global elements
    backButtonContainer = document.querySelector(".back-button-container");
    backButton = document.getElementById("backButton");

    // Back button handler
    backButton.addEventListener("click", function() {
        document.querySelectorAll("tr.item").forEach(row => {
            row.style.display = "";
            row.classList.remove("filtered");
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

    // Table controls
    document.querySelectorAll(".toggle-info").forEach(button => {
        button.addEventListener("click", (event) => toggleInfo(event, this));
    });

    // Filter handlers
    const filterHandlers = {
        ".filter-year": ".filter-year",
        ".filter-context": ".filter-context",
        ".filter-status": ".filter-status",
        ".filter-ideals": ".filter-ideals"
    };

    Object.entries(filterHandlers).forEach(([selector, target]) => {
        document.querySelectorAll(selector).forEach(filter => {
            filter.addEventListener("click", () => filterTable(filter.textContent, target));
        });
    });
});

// Global click handler for dropdowns
document.addEventListener("click", function(e) {
    if (!e.target.closest(".status-header")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
        document.querySelectorAll(".sort-arrow").forEach(arrow => arrow.classList.remove("desc"));
    }
});


// Context Dropdown
function toggleContextDropdown() {
    const dropdown = document.getElementById("contextDropdown");
    const arrow = document.querySelector(".status-header:nth-child(5) .sort-arrow");
    
    dropdown.classList.toggle("show");
    arrow.classList.toggle("desc");
    
    closeOtherDropdowns(dropdown);
}

// Ideals Dropdown
function toggleIdealsDropdown() {
    const dropdown = document.getElementById("idealsDropdown");
    const arrow = document.querySelector(".status-header:nth-child(6) .sort-arrow");
    
    dropdown.classList.toggle("show");
    arrow.classList.toggle("desc");
    
    closeOtherDropdowns(dropdown);
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



// Nuova funzione di filtro generica
function filterByClass(className, resetOthers = true) {
    document.querySelectorAll("tr.item").forEach(row => {
        const show = row.classList.contains(className);
        row.style.display = show ? "" : "none";
        if(show) row.classList.add("filtered");
    });
    
    if(resetOthers) {
        updateImage(className);
        checkBackButton();
    }
}

// Modifica i dropdown handler
function filterByContext(context) {
    filterByClass(context.toLowerCase().replace(' ', '-'));
    toggleContextDropdown();
}

function filterByIdeals(ideal) {
    filterByClass(ideal.toLowerCase());
    toggleIdealsDropdown();
}

function filterByStatus(status) {
    filterByClass(status.toLowerCase());
    toggleStatusDropdown();
}