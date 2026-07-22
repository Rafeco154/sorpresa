// CONTADOR
const targetData = new Date("2026-12-15T00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetData - now;
    
    if (timeLeft < 0) {
        document.getElementById("clock").innerHTML = "<h2>¡La espera ha terminado!</h2><p>¡Feliz cumpleaños! 🎉</p>";
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, "0");
    document.getElementById("hours").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
    document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// LÓGICA DE CONTRASEÑA (Por ahora siempre falla)
function checkPassword() {
    const inputField = document.getElementById("pass-input");
    const errorMsg = document.getElementById("error-message");
    const card = document.querySelector(".card-container");

    // Siempre muestra error por ahora
    errorMsg.innerText = "❌ Contraseña incorrecta. ¡Aún no es el momento!";

    // Efecto visual de temblor en la tarjeta
    card.classList.remove("shake");
    void card.offsetWidth; // Reinicia la animación
    card.classList.add("shake");

    // Limpia el campo de texto
    inputField.value = "";
}

// Permite pulsar 'Enter' en el teclado para enviar la contraseña
document.getElementById("pass-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkPassword();
    }
});