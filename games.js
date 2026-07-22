// ==== PALABRAS OBJETIVO DE CADA JUEGO ====
// TODO: cambia estas respuestas por las tuyas: la palabra del ahorcado de
// octubre y la respuesta de la adivinanza de noviembre (ver juegos.html)
const OCTOBER_TARGET_WORD = "AVENTURA";
const NOVEMBER_ANSWER = "BOSQUE";

// ==== ESTADO DE CADA TARJETA (bloqueada / en juego) ====
// El progreso no se guarda: los juegos se pueden repetir siempre que estén
// desbloqueados, y el fragmento se muestra en pantalla para que lo apunte.
function renderCardState(monthKey) {
    const card = document.querySelector('.game-card[data-month="' + monthKey + '"]');
    if (!card) return;

    const lockedMsg = card.querySelector(".game-locked-msg");
    const body = card.querySelector(".game-body");

    if (isGameUnlocked(monthKey)) {
        lockedMsg.hidden = true;
        body.hidden = false;
    } else {
        lockedMsg.hidden = false;
        lockedMsg.textContent = "🔒 Espera hasta el 1 de " + MONTH_NAMES[monthKey] + " para jugar";
        body.hidden = true;
    }
}

function showFragmentSuccess(feedbackEl, monthKey) {
    feedbackEl.classList.remove("is-error");
    feedbackEl.classList.add("is-success");
    feedbackEl.innerHTML = "✅ ¡Conseguido! Tu fragmento es: <strong>" + FRAGMENTS[monthKey] + "</strong> · apúntalo 📝";
}

function showFeedbackError(feedbackEl, message) {
    feedbackEl.classList.remove("is-success");
    feedbackEl.classList.add("is-error");
    feedbackEl.textContent = message;
}

function triggerShake(element) {
    element.classList.remove("shake");
    void element.offsetWidth; // Reinicia la animación
    element.classList.add("shake");
}

// ==== AGOSTO: TRIVIA ====
function setupTrivia() {
    const card = document.querySelector('.game-card[data-month="august"]');
    if (!card) return;

    const feedback = card.querySelector(".game-feedback");

    card.querySelectorAll(".trivia-option").forEach(function (option) {
        option.addEventListener("click", function () {
            if (option.dataset.correct === "true") {
                showFragmentSuccess(feedback, "august");
            } else {
                showFeedbackError(feedback, "❌ No es esa... ¡inténtalo de nuevo!");
                triggerShake(card);
            }
        });
    });
}

// ==== SEPTIEMBRE: MEMORAMA ====
function setupMemory() {
    const card = document.querySelector('.game-card[data-month="september"]');
    if (!card) return;

    const cells = card.querySelectorAll(".memory-card");
    const feedback = card.querySelector(".game-feedback");
    const totalPairs = cells.length / 2;
    let firstPick = null;
    let lock = false;
    let matchedCount = 0;

    cells.forEach(function (cell) {
        cell.addEventListener("click", function () {
            if (lock || cell === firstPick || cell.classList.contains("is-matched")) return;

            cell.classList.add("is-flipped");
            cell.textContent = cell.dataset.symbol;

            if (!firstPick) {
                firstPick = cell;
                return;
            }

            lock = true;
            const secondPick = cell;

            if (firstPick.dataset.pair === secondPick.dataset.pair) {
                firstPick.classList.add("is-matched");
                secondPick.classList.add("is-matched");
                matchedCount++;
                firstPick = null;
                lock = false;

                if (matchedCount === totalPairs) {
                    showFragmentSuccess(feedback, "september");
                }
            } else {
                setTimeout(function () {
                    firstPick.classList.remove("is-flipped");
                    firstPick.textContent = "❓";
                    secondPick.classList.remove("is-flipped");
                    secondPick.textContent = "❓";
                    firstPick = null;
                    lock = false;
                }, 700);
            }
        });
    });
}

// ==== OCTUBRE: AHORCADO ====
const HANGMAN_ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const HANGMAN_MAX_LIVES = 6;

function setupHangman() {
    const card = document.querySelector('.game-card[data-month="october"]');
    if (!card) return;

    const wordEl = card.querySelector(".hangman-word");
    const livesEl = card.querySelector(".hangman-lives");
    const lettersEl = card.querySelector(".hangman-letters");
    const feedback = card.querySelector(".game-feedback");

    let guessed = [];
    let wrongCount = 0;

    function render() {
        wordEl.textContent = OCTOBER_TARGET_WORD
            .split("")
            .map(function (letter) { return guessed.indexOf(letter) !== -1 ? letter : "_"; })
            .join(" ");

        livesEl.textContent = "❤️".repeat(HANGMAN_MAX_LIVES - wrongCount) + "🤍".repeat(wrongCount);
    }

    function resetRound(message) {
        guessed = [];
        wrongCount = 0;
        lettersEl.querySelectorAll("button").forEach(function (button) {
            button.disabled = false;
        });
        showFeedbackError(feedback, message);
        render();
    }

    HANGMAN_ALPHABET.forEach(function (letter) {
        const key = document.createElement("button");
        key.type = "button";
        key.className = "hangman-key";
        key.textContent = letter;

        key.addEventListener("click", function () {
            key.disabled = true;

            if (OCTOBER_TARGET_WORD.indexOf(letter) !== -1) {
                guessed.push(letter);
                render();

                const solved = OCTOBER_TARGET_WORD.split("").every(function (l) {
                    return guessed.indexOf(l) !== -1;
                });
                if (solved) {
                    showFragmentSuccess(feedback, "october");
                }
            } else {
                wrongCount++;
                render();

                if (wrongCount >= HANGMAN_MAX_LIVES) {
                    resetRound("💔 Sin vidas... ¡vuelve a intentarlo!");
                }
            }
        });

        lettersEl.appendChild(key);
    });

    render();
}

// ==== NOVIEMBRE: ADIVINANZA ====
function setupRiddle() {
    const card = document.querySelector('.game-card[data-month="november"]');
    if (!card) return;

    const input = card.querySelector(".riddle-input");
    const button = card.querySelector(".riddle-check");
    const feedback = card.querySelector(".game-feedback");

    function checkAnswer() {
        const value = input.value.trim().toUpperCase();

        if (value === NOVEMBER_ANSWER) {
            showFragmentSuccess(feedback, "november");
        } else {
            showFeedbackError(feedback, "❌ No es esa... ¡piénsalo un poco más!");
            triggerShake(card);
        }
        input.value = "";
    }

    button.addEventListener("click", checkAnswer);
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") checkAnswer();
    });
}

// ==== DICIEMBRE: PUZZLE DESLIZANTE (8-puzzle) ====
const SLIDING_SIZE = 3;

function setupSlidingPuzzle() {
    const container = document.getElementById("sliding-puzzle");
    if (!container) return;

    const card = document.querySelector('.game-card[data-month="december"]');
    const feedback = card ? card.querySelector(".game-feedback") : null;

    let tiles = shuffleSolvable([1, 2, 3, 4, 5, 6, 7, 8, null]);
    renderPuzzle(container, tiles, feedback);
}

function renderPuzzle(container, tiles, feedback) {
    container.innerHTML = "";

    tiles.forEach(function (value, index) {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "puzzle-tile" + (value === null ? " is-empty" : "");

        if (value !== null) {
            // La ficha muestra el trozo de la foto que le corresponde en la
            // imagen resuelta (según su número), no su posición actual
            const slot = value - 1;
            const row = Math.floor(slot / SLIDING_SIZE);
            const col = slot % SLIDING_SIZE;
            tile.style.backgroundImage = "url('" + DECEMBER_PUZZLE_IMAGE + "')";
            tile.style.backgroundPosition = (col * 50) + "% " + (row * 50) + "%";
        }

        tile.addEventListener("click", function () {
            handlePuzzleTileClick(container, tiles, index, feedback);
        });

        container.appendChild(tile);
    });
}

function handlePuzzleTileClick(container, tiles, index, feedback) {
    const emptyIndex = tiles.indexOf(null);
    if (!areAdjacentTiles(index, emptyIndex)) return;

    tiles[emptyIndex] = tiles[index];
    tiles[index] = null;
    renderPuzzle(container, tiles, feedback);

    if (isPuzzleSolved(tiles) && feedback) {
        showFragmentSuccess(feedback, "december");
    }
}

function areAdjacentTiles(a, b) {
    const rowA = Math.floor(a / SLIDING_SIZE);
    const colA = a % SLIDING_SIZE;
    const rowB = Math.floor(b / SLIDING_SIZE);
    const colB = b % SLIDING_SIZE;

    return (rowA === rowB && Math.abs(colA - colB) === 1) ||
           (colA === colB && Math.abs(rowA - rowB) === 1);
}

function isPuzzleSolved(tiles) {
    for (let i = 0; i < 8; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return tiles[8] === null;
}

function shuffleSolvable(solvedTiles) {
    // Parte del estado resuelto y hace movimientos válidos al azar:
    // así el puzzle siempre queda en un estado resoluble.
    const state = solvedTiles.slice();

    for (let i = 0; i < 150; i++) {
        const emptyIndex = state.indexOf(null);
        const neighbors = getNeighborIndexes(emptyIndex);
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

        state[emptyIndex] = state[randomNeighbor];
        state[randomNeighbor] = null;
    }

    return state;
}

function getNeighborIndexes(index) {
    const row = Math.floor(index / SLIDING_SIZE);
    const col = index % SLIDING_SIZE;
    const neighbors = [];

    if (row > 0) neighbors.push(index - SLIDING_SIZE);
    if (row < SLIDING_SIZE - 1) neighbors.push(index + SLIDING_SIZE);
    if (col > 0) neighbors.push(index - 1);
    if (col < SLIDING_SIZE - 1) neighbors.push(index + 1);

    return neighbors;
}

// ==== INICIALIZACIÓN ====
Object.keys(GAME_UNLOCK_DATES).forEach(renderCardState);

setupTrivia();
setupMemory();
setupHangman();
setupRiddle();
setupSlidingPuzzle();
