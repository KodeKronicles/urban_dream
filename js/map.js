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

    // Funzione per espandere/nascondere le informazioni dettagliate
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


function toggleDropdown(id) {
    let dropdown = document.getElementById(id);
    let allDropdowns = document.querySelectorAll('.dropdown-menu');

    allDropdowns.forEach(menu => {
        if (menu.id !== id) {
            menu.classList.add('hidden');
        }
    });

    dropdown.classList.toggle('hidden');
}

// Chiudi il menu se si clicca fuori
document.addEventListener('click', function(event) {
    if (!event.target.closest('th')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    }
});

// Funzione per filtrare gli item in base allo status
function filterByStatus(status) {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (item.classList.contains(status)) {
            item.style.display = 'table-row';
        } else {
            item.style.display = 'none';
        }
    });
    // Cambia l'immagine principale in base al filtro
    document.getElementById('mainImage').src = `img/${status}.jpg`;
}

// Funzione per filtrare gli item in base al domain
function filterByDomain(domain) {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (item.classList.contains(domain)) {
            item.style.display = 'table-row';
        } else {
            item.style.display = 'none';
        }
    });
    // Cambia l'immagine principale in base al filtro
    document.getElementById('mainImage').src = `img/${domain}.jpg`;
}

// Funzione per mostrare tutti gli item
function showAll() {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.style.display = 'table-row';
    });
    document.getElementById('mainImage').src = 'img/map/cerchicompleti.png';
    
    // Mostra la tabella
    document.querySelector('.table-container').style.display = 'block';
}

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


function toggleTable() {
    const tableContainer = document.querySelector('.table-container');
    
    if (tableContainer.style.display === 'none' || tableContainer.style.display === '') {
        tableContainer.style.display = 'block';
        document.getElementById('mainImage').src = 'img/map/cerchicompleti.png';
    } else {
        tableContainer.style.display = 'none';
    }
}

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const arrow = dropdown.previousElementSibling.querySelector('.arrow');
    
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== id) {
            menu.classList.add('hidden');
            menu.previousElementSibling.querySelector('.arrow').classList.remove('rotated');
        }
    });

    dropdown.classList.toggle('hidden');
    arrow.classList.toggle('rotated');
}

// Chiudi i dropdown cliccando fuori
document.addEventListener('click', function(event) {
    if (!event.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
            menu.previousElementSibling.querySelector('.arrow').classList.remove('rotated');
        });
    }
});

function filterByTime(time) {
    const items = document.querySelectorAll('.item');
    const tableContainer = document.querySelector('.table-container');

    // Controlla se la tabella è nascosta e la mostra
    if (tableContainer.style.display === "none" || !tableContainer.style.display) {
        tableContainer.style.display = "block";
    }

    let hasMatch = false; // Controlla se esistono elementi corrispondenti al filtro

    items.forEach(item => {
        if (item.classList.contains(time)) {
            item.style.display = 'table-row';
            hasMatch = true;
        } else {
            item.style.display = 'none';
        }
    });

    // Se non ci sono corrispondenze, nasconde la tabella di nuovo
    if (!hasMatch) {
        tableContainer.style.display = "none";
    }

    // Cambia l'immagine principale in base al filtro selezionato
    document.getElementById('mainImage').src = hasMatch ? `img/${time}.jpg` : "img/map/cerchicompleti.png";
}


// Modifica la funzione esistente per lo status
function filterByStatus(status) {
    const items = document.querySelectorAll('.item');
    const backButton = document.getElementById("backButton");
    const tableContainer = document.querySelector('.table-container'); 

    // Mostra la tabella se è nascosta
    if (tableContainer.style.display === "none" || !tableContainer.style.display) {
        tableContainer.style.display = "block"; 
    }

    // Se viene selezionato "Status" (vuoto), mostra tutti gli elementi
    if (status === "") {
        items.forEach(item => {
            item.style.display = 'table-row';
        });
        document.querySelectorAll(".hidden-info").forEach(detailRow => {
            detailRow.style.display = "none"; // Nasconde i dettagli al reset
        });

        // Ripristina immagine predefinita
        document.getElementById('mainImage').src = "img/map/cerchicompleti.png";

        // Nasconde il bottone "Back"
        backButton.classList.add("hidden");

        return; // Esce dalla funzione
    }

    // Altrimenti, filtra gli elementi per stato
    items.forEach(item => {
        if (item.classList.contains(status)) {
            item.style.display = 'table-row';
        } else {
            item.style.display = 'none';
        }
    });

    // Cambia l'immagine principale in base al filtro
    document.getElementById('mainImage').src = `img/${status}.jpg`;

    // Mostra il bottone "Back" quando un filtro è attivo
    backButton.classList.remove("hidden");
}


function handleTimeFilter(filterClass) {
    document.querySelectorAll('.item').forEach(item => {
        if (filterClass === "" || item.classList.contains(filterClass)) {
            item.style.display = 'table-row';
        } else {
            item.style.display = 'none';
        }
    });
     // Toggle the arrow rotation
     const timeArrow = document.getElementById('timeArrow');
     if (timeArrow) {
         timeArrow.classList.toggle('desc');
     }

     // Cambia l'immagine principale in base al filtro
    document.getElementById('mainImage').src = `img/${time}.jpg`;
}
