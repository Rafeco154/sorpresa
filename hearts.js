// Efecto visual: pequeños corazones que aparecen y flotan al hacer click en cualquier parte de la página
(function () {
    const HEART_COLORS = ["#ff79c6", "#ff92d0", "#f178b6"];

    document.addEventListener("click", function (event) {
        const heart = document.createElement("span");
        heart.className = "click-heart";
        heart.textContent = "♥";
        heart.style.left = event.clientX + "px";
        heart.style.top = event.clientY + "px";
        heart.style.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];

        // Pequeña variación aleatoria de tamaño y trayectoria para que no se vean todos iguales
        const driftX = (Math.random() - 0.5) * 60;
        heart.style.setProperty("--drift-x", driftX + "px");
        heart.style.fontSize = (14 + Math.random() * 10) + "px";

        document.body.appendChild(heart);
        heart.addEventListener("animationend", function () {
            heart.remove();
        });
    });
})();
