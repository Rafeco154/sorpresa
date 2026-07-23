// La fecha de cumpleaños, los fragmentos de la contraseña (FRAGMENTS/FINAL_PASSWORD)
// y las fechas de los juegos mensuales viven en config.js (compartido con juegos.html)

// ==== ELEMENTOS ====
const loginStack = document.getElementById("login-stack"); // aviso + tarjeta: aparecen/desaparecen juntos
const loginScreen = document.getElementById("login-screen"); // solo la tarjeta (para el efecto shake)
const revealScreen = document.getElementById("reveal-screen");
const passInput = document.getElementById("pass-input");
const errorMsg = document.getElementById("error-message");

// ==== CONTADOR ====
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = BIRTHDAY_DATE - now;

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

// ==== AVISO IMPORTANTE (cuenta atrás hasta el 15 de agosto) ====
function updateNoticeCountdown() {
    const now = new Date().getTime();
    const timeLeft = NOTICE_DATE - now;

    if (TESTING_MODE_SHOW_NOTICE_END || timeLeft < 0) {
        document.getElementById("notice-banner").innerHTML =
            '<p class="notice-label">📌 Aviso importante</p>' +
            '<p class="notice-text">Es necesario dejar libres los días 18, 19 y 20 de diciembre.</p>';
        clearInterval(noticeCountdownInterval);
        return;
    }

    const noticeDays = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const noticeHours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const noticeMinutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const noticeSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("notice-days").innerText = String(noticeDays).padStart(2, "0");
    document.getElementById("notice-hours").innerText = String(noticeHours).padStart(2, "0");
    document.getElementById("notice-minutes").innerText = String(noticeMinutes).padStart(2, "0");
    document.getElementById("notice-seconds").innerText = String(noticeSeconds).padStart(2, "0");
}

const noticeCountdownInterval = setInterval(updateNoticeCountdown, 1000);
updateNoticeCountdown();

// ==== LÓGICA DE CONTRASEÑA ====
function checkPassword() {
    const value = passInput.value.trim();
    const isRightPassword = value.toUpperCase() === FINAL_PASSWORD.toUpperCase();
    const isBirthdayReached = TESTING_MODE_SKIP_BIRTHDAY_GATE || Date.now() >= BIRTHDAY_DATE;

    if (isRightPassword && isBirthdayReached) {
        unlockGift();
    } else if (isRightPassword && !isBirthdayReached) {
        showTooEarlyMessage();
    } else {
        showError();
    }
}

function showError() {
    errorMsg.innerText = "❌ Contraseña incorrecta. ¡Parece que no es el momento!";

    // Efecto visual de temblor en la tarjeta
    loginScreen.classList.remove("shake");
    void loginScreen.offsetWidth; // Reinicia la animación
    loginScreen.classList.add("shake");

    passInput.value = "";
}

function showTooEarlyMessage() {
    errorMsg.innerText = "Has acertado la contraseña, ¡pero aún no es el momento!";
    passInput.value = "";
}

function unlockGift() {
    errorMsg.innerText = "";

    // Fade-out del aviso + la pantalla de login, juntos
    loginStack.classList.add("fade-out");

    setTimeout(() => {
        loginStack.hidden = true;

        // Fade-in de la pantalla revelada
        revealScreen.hidden = false;
        void revealScreen.offsetWidth; // Reinicia la animación
        revealScreen.classList.add("fade-in");
    }, 500);
}

function lockGift() {
    // Fade-out de la pantalla revelada
    revealScreen.classList.remove("fade-in");

    setTimeout(() => {
        revealScreen.hidden = true;

        // Fade-in del aviso + la pantalla de login, listos para volver a intentarlo
        passInput.value = "";
        errorMsg.innerText = "";
        loginStack.hidden = false;
        void loginStack.offsetWidth; // Reinicia la animación
        loginStack.classList.remove("fade-out");
    }, 600);
}

document.getElementById("back-to-main").addEventListener("click", lockGift);

// Permite pulsar 'Enter' en el teclado para enviar la contraseña
passInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        checkPassword();
    }
});

// ==== MOSTRAR/OCULTAR CONTRASEÑA ====
const passwordToggle = document.getElementById("password-toggle");

passwordToggle.addEventListener("click", function () {
    const isHidden = passInput.type === "password";
    passInput.type = isHidden ? "text" : "password";
    passwordToggle.textContent = isHidden ? "🙈" : "👁️";
    passwordToggle.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
    passInput.focus();
});

// ==== LIGHTBOX (ampliar fotos de la galería) ====
const lightboxOverlay = document.getElementById("lightbox-overlay");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxOverlay.classList.add("active");
    document.body.classList.add("lightbox-open");
}

function closeLightbox() {
    lightboxOverlay.classList.remove("active");
    document.body.classList.remove("lightbox-open");
    lightboxImg.src = "";
}

document.querySelectorAll(".gallery-item img").forEach(function (img) {
    img.addEventListener("click", function () {
        openLightbox(img.src, img.alt);
    });
});

lightboxClose.addEventListener("click", closeLightbox);

// Cierra al hacer click fuera de la imagen (en el fondo del overlay)
lightboxOverlay.addEventListener("click", function (event) {
    if (event.target === lightboxOverlay) {
        closeLightbox();
    }
});

// Cierra con la tecla Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeLightbox();
    }
});
