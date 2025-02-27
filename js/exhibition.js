


document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".filter-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Rimuove la classe attiva da tutti i pulsanti
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");

            cards.forEach(card => {
                if (filter === "all" || card.classList.contains(filter)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-exhibition");
    const exhibitionText = document.getElementById("exhibition-text");

    toggleButton.addEventListener("click", function () {
        exhibitionText.classList.toggle("hidden");
    });
});
