// TO OPERATE OPEN THE CATALOGUE
function toggleTable() {
    const tableContainer = document.querySelector('.table-container');
    
    if (tableContainer.style.display === 'none' || tableContainer.style.display === '') {
        tableContainer.style.display = 'block';
        document.getElementById('mainImage').src = 'img/map/cerchicompleti.png';
    } else {
        tableContainer.style.display = 'none';
    }
}

function filterByStatus(status) {
    const category = status === 'all' ? '' : status.toLowerCase();
    filterTable(category, '.filter-status');
    toggleStatusDropdown(); // Chiude il dropdown dopo la selezione
}
// TO FILTER THE TABLE
document.addEventListener("DOMContentLoaded", function () {
    const backButtonContainer = document.querySelector(".back-button-container");
    const backButton = document.getElementById("backButton");

    // Funzione per mostrare/nascondere il bottone Back
    function checkBackButton() {
        const selectedItems = document.querySelectorAll("tr.filtered");
        backButtonContainer.classList.toggle("hidden", selectedItems.length === 0);
    }

    // Funzione per filtrare la tabella
    function filterTable(category, selector) {
        let hasMatch = false;
        document.querySelectorAll("tbody tr").forEach(row => {
            let cell = row.querySelector(selector);
            let detailRow = row.nextElementSibling; // La riga con i dettagli

            if (cell && cell.textContent.includes(category)) {
                row.classList.add("filtered");
                row.style.display = "";
                if (detailRow && detailRow.classList.contains("hidden-info")) {
                    detailRow.style.display = "none"; // Nasconde i dettagli finché non si clicca "+"
                }
                hasMatch = true;
            } else {
                row.classList.remove("filtered");
                row.style.display = "none";
                if (detailRow && detailRow.classList.contains("hidden-info")) {
                    detailRow.style.display = "none"; // Nasconde i dettagli degli elementi non selezionati
                }
            }
        });
        checkBackButton();
        updateImage(hasMatch ? category : "Default");
    }

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

    // Aggiunge il listener per il click su "+"
    document.querySelectorAll(".toggle-info").forEach(button => {
        button.addEventListener("click", function (event) {
            toggleInfo(event, this);
        });
    });
});


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







// Nuove funzioni per gestire il dropdown
function toggleStatusDropdown() {
    const dropdown = document.getElementById("statusDropdown");
    const arrow = document.querySelector(".custom-arrow");
    
    dropdown.classList.toggle("hidden");
    arrow.classList.toggle("arrow-up");
    
    // Chiudi altri dropdown aperti
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== dropdown) {
            menu.classList.add("hidden");
            menu.previousElementSibling.querySelector(".sort-arrow")?.classList.remove("arrow-up");
        }
    });
}

function filterByStatus(status) {
    const selector = ".filter-status";
    let category = status === "all" ? "" : status;
    
    // Chiama la tua esistente funzione filterTable
    filterTable(category, selector);
    
    // Chiudi dropdown
    toggleStatusDropdown();
}

// Chiudi dropdown cliccando fuori
document.addEventListener("click", function(event) {
    if (!event.target.closest(".custom-dropdown")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.add("hidden");
        });
        document.querySelectorAll(".sort-arrow").forEach(arrow => {
            arrow.classList.remove("arrow-up");
        });
    }
});


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