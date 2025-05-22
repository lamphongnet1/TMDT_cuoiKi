document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("quantityInput");
    const btnIncrease = document.getElementById("increase");
    const btnDecrease = document.getElementById("decrease");

    btnIncrease.addEventListener("click", function () {
        let current = parseInt(input.value) || 1;
        input.value = current + 1;
    });

    btnDecrease.addEventListener("click", function () {
        let current = parseInt(input.value) || 1;
        if (current > 1) {
            input.value = current - 1;
        }
    });
});