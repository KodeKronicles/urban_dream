

function updateImage(category) {
    const mainImage = document.getElementById('mainImage');
    let imagePath = 'img/map/all.png'; // Immagine predefinita

    switch(category) {
        case 'Unbuilt':
            imagePath = 'img/map/unbuilt.png';
            break;
        case 'Built':
            imagePath = 'img/map/built.png';
            break;
        // Aggiungi altri casi se necessario
    }

    if(mainImage) {
        mainImage.src = imagePath;
    }
}

// Sposta queste variabili in scope globale
let backButtonContainer;
let backButton;

// Sposta filterTable fuori dall'event listener
function filterTable(category, selector) {
    let hasMatch = false;
    document.querySelectorAll("tbody tr").forEach(row => {
        let cell = row.querySelector(selector);
        let detailRow = row.nextElementSibling;

        // Controllo esatto per gli ID
        const match = cell && cell.textContent.trim() === category.toString();
        
        if(match) {
            row.classList.add("filtered");
            row.style.display = "";
            if(detailRow) detailRow.style.display = "none";
            hasMatch = true;
        } else {
            row.classList.remove("filtered");
            row.style.display = "none";
            if(detailRow) detailRow.style.display = "none";
        }
    });
    
    checkBackButton();
    updateImage(hasMatch ? "Default" : "Default");
}

function checkBackButton() {
    const selectedItems = document.querySelectorAll("tr.filtered");
    backButtonContainer.classList.toggle("hidden", selectedItems.length === 0);
}

document.addEventListener("DOMContentLoaded", function () {
    // Inizializza le variabili
    backButtonContainer = document.querySelector(".back-button-container");
    backButton = document.getElementById("backButton");

    // In the Back button click handler (inside DOMContentLoaded)
backButton.addEventListener("click", function () {
    document.querySelectorAll("tr").forEach(row => {
        row.classList.remove("filtered", "expanded"); // Reset expanded state
        row.style.display = "";
    });
    
    document.querySelectorAll(".hidden-info").forEach(detailRow => {
        detailRow.style.display = "none";
    });

    // Reset all toggle buttons to "+"
    document.querySelectorAll(".toggle-info").forEach(button => {
        button.innerText = "+";
    });
    
    checkBackButton();
    updateImage("Default");
});

// Aggiungi listener per i cerchi della mappa
document.querySelectorAll('.image-mapper-shape').forEach(circle => {
    circle.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');
        const itemId = anchor?.getAttribute('xlink:title')?.replace('id', '');
        
        if(itemId) {
            filterTable(itemId, 'td:first-child');
            
            // Scroll alla tabella se necessario
            document.querySelector('.table-container')?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

        // Keep the existing event listener setup
        document.querySelectorAll(".toggle-info").forEach(button => {
            button.addEventListener("click", function (event) {
                toggleInfo(event, this);
            });
        });
    
    // Aggiunge eventi ai filtri
    document.querySelectorAll(".filter-year").forEach(filter => {
        filter.addEventListener("click", () => filterTable(filter.textContent, ".filter-year"));
    });

    document.querySelectorAll(".filter-context").forEach(filter => {
        filter.addEventListener("click", () => filterTable(filter.textContent, ".filter-context"));
    });

    document.querySelectorAll(".filter-status").forEach(filter => {
        filter.addEventListener("click", () => filterTable(filter.textContent, ".filter-status"));
    });

    document.querySelectorAll(".filter-ideals").forEach(filter => {
        filter.addEventListener("click", () => filterTable(filter.textContent, ".filter-ideals"));
    });

//
    // Funzione per mostrare/nascondere il bottone Back
    function checkBackButton() {
        const selectedItems = document.querySelectorAll("tr.filtered");
        backButtonContainer.classList.toggle("hidden", selectedItems.length === 0);
    }
    // Pulsante "Back" per ripristinare tutto
    backButton.addEventListener("click", function () {
        document.querySelectorAll("tr").forEach(row => {
            row.classList.remove("filtered");
            row.style.display = "";
        });
        document.querySelectorAll(".hidden-info").forEach(detailRow => {
            detailRow.style.display = "none"; // Nasconde tutti i dettagli al reset
        });
        checkBackButton();
        updateImage("Default");
    });

    // Aggiunge il listener per il click su "+"
    document.querySelectorAll(".toggle-info").forEach(button => {
        button.addEventListener("click", function (event) {
            toggleInfo(event, this);
        });
    });
});

// Funzione per espandere/nascondere le informazioni dettagliate DEGLI ITEM
function toggleInfo(event, element) {
    let mainRow = element.parentElement;
    let infoRow = mainRow.nextElementSibling;

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

// ARROW WORK: ABC & 123 x id x title x year
function sortTable(columnIndex, element) {
    let table = document.getElementById("Table");
    let tbody = table.querySelector("tbody");
    let rows = Array.from(tbody.querySelectorAll("tr:not(.hidden-info)"));
    let direction = element.classList.contains("desc") ? "asc" : "desc";

    // Clear old states
    document.querySelectorAll("th").forEach(th => th.classList.remove("desc"));
    if (direction === "desc") {
        element.classList.add("desc");
    }

    // Sort rows
    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText.trim();
        let cellB = rowB.cells[columnIndex].innerText.trim();

        // Numeric check
        if (!isNaN(cellA) && !isNaN(cellB)) {
            cellA = parseInt(cellA);
            cellB = parseInt(cellB);

            return direction === "asc" ? cellA - cellB : cellB - cellA;
        } else {
            // String compare
            return direction === "asc"
                ? cellA.localeCompare(cellB, undefined, { numeric: true })
                : cellB.localeCompare(cellA, undefined, { numeric: true });
        }
    });

    // Re-append rows in new order + their hidden info row
    tbody.innerHTML = "";
    rows.forEach(row => {
        tbody.appendChild(row);
        let hiddenRow = document.getElementById(row.id)?.nextElementSibling;
        if (hiddenRow && hiddenRow.classList.contains("hidden-info")) {
            tbody.appendChild(hiddenRow);
        }
    });
}


// FOR THE STUPID DROPDOWN AND FILTERING BY STATUS
function toggleStatusDropdown() {
    const dropdown = document.getElementById("statusDropdown");
    const arrow = document.querySelector(".status-header .sort-arrow");
    
    dropdown.classList.toggle("show");
    arrow.classList.toggle("desc");
    
    // Chiudi altri dropdown aperti
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== dropdown) {
            menu.classList.remove("show");
            menu.closest("th")?.querySelector(".sort-arrow")?.classList.remove("desc");
        }
    });
}

// Funzione filtro aggiornata che richiama l'esistente filterTable
function filterByStatus(status) {
    const selector = ".filter-status";
    let category = status === "all" ? "" : status;
    
    // Chiamata alla funzione di filtro esistente
    filterTable(category, selector);
    
    // Chiudi dropdown e resetta freccia
    toggleStatusDropdown();
}

// Listener per chiudere il dropdown
document.addEventListener("click", function(e) {
    if (!e.target.closest(".status-header")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.remove("show");
        });
        document.querySelectorAll(".sort-arrow").forEach(arrow => {
            arrow.classList.remove("desc");
        });
    }
});


