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

    document.querySelectorAll(".filter-type").forEach(filter => {
        filter.addEventListener("click", () => filterTable(filter.textContent, ".filter-type"));
    });

    document.querySelectorAll(".filter-status").forEach(filter => {
        filter.addEventListener("click", () => filterTable(filter.textContent, ".filter-status"));
    });

    document.querySelectorAll(".filter-philosophy").forEach(filter => {
        filter.addEventListener("click", () => filterTable(filter.textContent, ".filter-philosophy"));
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



document.addEventListener("DOMContentLoaded", function () {
    const starContainer = document.getElementById("star-container");

    // Lista delle stelle (coordinate già convertite in percentuale)
    const starPositions = [
        { id: 1, cx: "-4.34%", cy: "127.87%" },
        { id: 2, cx: "3.22%", cy: "121.49%" },
        { id: 3, cx: "14.37%", cy: "121.49%" },
        { id: 4, cx: "23.33%", cy: "127.87%" },
        { id: 5, cx: "31.45%", cy: "121.49%" },
        { id: 6, cx: "27.08%", cy: "138.51%" },
        { id: 7, cx: "27.08%", cy: "151.78%" },
        { id: 8, cx: "27.08%", cy: "164.14%" },
        { id: 9, cx: "33.61%", cy: "146.54%" },
        { id: 10, cx: "33.61%", cy: "158.83%" },
        { id: 11, cx: "27.08%", cy: "176.52%" },
        { id: 12, cx: "19.27%", cy: "176.52%" },
        { id: 13, cx: "19.27%", cy: "164.14%" }
    ];

    // Funzione per mostrare le stelle quando necessario
    function showStar(id) {
        let starData = starPositions.find(star => star.id === id);
        if (starData) {
            let existingStar = document.getElementById(`star-${id}`);
            if (!existingStar) {
                let newStar = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                newStar.setAttribute("id", `star-${id}`);
                newStar.setAttribute("class", "star");
                newStar.setAttribute("cx", starData.cx);
                newStar.setAttribute("cy", starData.cy);
                newStar.setAttribute("r", "1.5%");
                newStar.setAttribute("onclick", `showInfo(${id})`);
                starContainer.appendChild(newStar);
            }
        }
    }

    // Esempio: Mostra una stella quando l'utente clicca un bottone
    document.getElementById("showStarButton").addEventListener("click", function() {
        showStar(3); // Cambia con l'ID della stella da mostrare
    });
});


