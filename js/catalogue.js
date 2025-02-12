function sortTable(columnIndex, element) {
    let table = document.getElementById("filmTable");
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
        let nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains("hidden-info")) {
            tbody.appendChild(nextRow);
        }
    });
}

function toggleInfo(event, element) {

let mainRow = element.parentElement;           // la riga principale (quella con i dati film)
let infoRow = mainRow.nextElementSibling;      // la riga successiva con hidden-info

// Mostra o nasconde la riga hidden-info
if (infoRow.style.display === 'none' || !infoRow.style.display) {
infoRow.style.display = 'table-row';
mainRow.classList.add('expanded');
element.innerText = '×';
} else {
infoRow.style.display = 'none';
mainRow.classList.remove('expanded');
element.innerText = '+';
}
}