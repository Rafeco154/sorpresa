// ==== CONTENIDO EDITABLE DE CADA JUEGO ====
// TODO: cambia estas palabras, mensajes y respuestas por los tuyos
const HANGMAN_WORD = "AVENTURA"; // Septiembre 1
const RIDDLE_1_ANSWER = "BOSQUE"; // Septiembre 3
const RIDDLE_2_ANSWER = "TIEMPO"; // Diciembre 1
const ANAGRAM_WORD = "CARIÑO"; // Agosto 3
const CIPHER_SHIFT = 3;
const CIPHER_MESSAGE = "ERES MI PERSONA FAVORITA"; // Octubre 1

// ==== ESTADO DE CADA TARJETA (bloqueada / en juego) ====
// El progreso no se guarda: los juegos se pueden repetir siempre que estén
// desbloqueados, y el fragmento se muestra en pantalla para que lo apunte.
function renderCardState(gameId) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const lockedMsg = card.querySelector(".game-locked-msg");
    const body = card.querySelector(".game-body");

    if (isGameUnlocked(gameId)) {
        lockedMsg.hidden = true;
        body.hidden = false;
    } else {
        lockedMsg.hidden = false;
        lockedMsg.textContent = "🔒 Espera hasta el " + GAME_UNLOCK_LABELS[gameId] + " para jugar";
        body.hidden = true;
    }
}

function showFragmentSuccess(feedbackEl, gameId) {
    feedbackEl.classList.remove("is-error");
    feedbackEl.classList.add("is-success");
    feedbackEl.innerHTML = "✅ ¡Conseguido! Tu fragmento es: <strong>" + FRAGMENTS[gameId] + "</strong> · apúntalo 📝";
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

// ==== TRIVIA ====
function setupTrivia(gameId) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const feedback = card.querySelector(".game-feedback");

    card.querySelectorAll(".trivia-option").forEach(function (option) {
        option.addEventListener("click", function () {
            if (option.dataset.correct === "true") {
                showFragmentSuccess(feedback, gameId);
            } else {
                showFeedbackError(feedback, "❌ No es esa... ¡inténtalo de nuevo!");
                triggerShake(card);
            }
        });
    });
}

// ==== MEMORAMA ====
function setupMemory(gameId) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
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
                    showFragmentSuccess(feedback, gameId);
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

// ==== AHORCADO ====
const HANGMAN_ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const HANGMAN_MAX_LIVES = 6;

function setupHangman(gameId, targetWord) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const wordEl = card.querySelector(".hangman-word");
    const livesEl = card.querySelector(".hangman-lives");
    const lettersEl = card.querySelector(".hangman-letters");
    const feedback = card.querySelector(".game-feedback");

    let guessed = [];
    let wrongCount = 0;

    function render() {
        wordEl.textContent = targetWord
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

            if (targetWord.indexOf(letter) !== -1) {
                guessed.push(letter);
                render();

                const solved = targetWord.split("").every(function (l) {
                    return guessed.indexOf(l) !== -1;
                });
                if (solved) {
                    showFragmentSuccess(feedback, gameId);
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

// ==== ADIVINANZA ====
function setupRiddle(gameId, answer) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const input = card.querySelector(".riddle-input");
    const button = card.querySelector(".riddle-check");
    const feedback = card.querySelector(".game-feedback");

    function checkAnswer() {
        const value = input.value.trim().toUpperCase();

        if (value === answer) {
            showFragmentSuccess(feedback, gameId);
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

// ==== ANAGRAMA ====
function setupAnagram(gameId, targetWord) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const lettersEl = card.querySelector(".anagram-letters");
    const answerEl = card.querySelector(".anagram-answer");
    const clearBtn = card.querySelector(".anagram-clear");
    const feedback = card.querySelector(".game-feedback");

    let answer = "";

    function shuffledLetters() {
        const letters = targetWord.split("");
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = letters[i];
            letters[i] = letters[j];
            letters[j] = tmp;
        }
        return letters;
    }

    function render() {
        answer = "";
        answerEl.textContent = "…";
        lettersEl.innerHTML = "";

        shuffledLetters().forEach(function (letter) {
            const key = document.createElement("button");
            key.type = "button";
            key.className = "anagram-letter";
            key.textContent = letter;

            key.addEventListener("click", function () {
                if (key.disabled) return;
                key.disabled = true;
                answer += letter;
                answerEl.textContent = answer;

                if (answer.length === targetWord.length) {
                    if (answer === targetWord) {
                        showFragmentSuccess(feedback, gameId);
                    } else {
                        showFeedbackError(feedback, "❌ No es esa... ¡vuelve a intentarlo!");
                        triggerShake(card);
                        render();
                    }
                }
            });

            lettersEl.appendChild(key);
        });
    }

    clearBtn.addEventListener("click", render);

    render();
}

// ==== VERDADERO O FALSO ====
function setupTrueFalse(gameId) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const items = card.querySelectorAll(".truefalse-item");
    const feedback = card.querySelector(".game-feedback");
    let solvedCount = 0;

    items.forEach(function (item) {
        const correct = item.dataset.answer === "true";
        const options = item.querySelectorAll(".truefalse-option");

        options.forEach(function (option) {
            option.addEventListener("click", function () {
                if (item.classList.contains("is-solved")) return;

                const chosenTrue = option.dataset.value === "true";

                if (chosenTrue === correct) {
                    item.classList.add("is-solved");
                    options.forEach(function (o) { o.disabled = true; });
                    solvedCount++;

                    if (solvedCount === items.length) {
                        showFragmentSuccess(feedback, gameId);
                    }
                } else {
                    showFeedbackError(feedback, "❌ Esa no es... ¡piénsalo de nuevo!");
                    triggerShake(card);
                }
            });
        });
    });
}

// ==== CIFRADO CÉSAR ====
function caesarEncode(text, shift) {
    return text.split("").map(function (char) {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        return char;
    }).join("");
}

function setupCipher(gameId, message, shift) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const cipherTextEl = card.querySelector(".cipher-text");
    const input = card.querySelector(".cipher-input");
    const button = card.querySelector(".cipher-check");
    const feedback = card.querySelector(".game-feedback");

    cipherTextEl.textContent = caesarEncode(message, shift);

    function checkAnswer() {
        const value = input.value.trim().toUpperCase();

        if (value === message) {
            showFragmentSuccess(feedback, gameId);
        } else {
            showFeedbackError(feedback, "❌ No es correcto... ¡vuelve a descifrarlo!");
            triggerShake(card);
        }
        input.value = "";
    }

    button.addEventListener("click", checkAnswer);
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") checkAnswer();
    });
}

// ==== PUZZLE DESLIZANTE (8-puzzle) ====
const SLIDING_SIZE = 3;

function setupSlidingPuzzle(gameId, imagePath) {
    const card = document.querySelector('.game-card[data-game="' + gameId + '"]');
    if (!card) return;

    const container = card.querySelector(".sliding-puzzle");
    if (!container) return;
    const feedback = card.querySelector(".game-feedback");

    let tiles = shuffleSolvable([1, 2, 3, 4, 5, 6, 7, 8, null]);
    renderPuzzle(container, tiles, feedback, gameId, imagePath);
}

function renderPuzzle(container, tiles, feedback, gameId, imagePath) {
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
            tile.style.backgroundImage = "url('" + imagePath + "')";
            tile.style.backgroundPosition = (col * 50) + "% " + (row * 50) + "%";
        }

        tile.addEventListener("click", function () {
            handlePuzzleTileClick(container, tiles, index, feedback, gameId, imagePath);
        });

        container.appendChild(tile);
    });
}

function handlePuzzleTileClick(container, tiles, index, feedback, gameId, imagePath) {
    const emptyIndex = tiles.indexOf(null);
    if (!areAdjacentTiles(index, emptyIndex)) return;

    tiles[emptyIndex] = tiles[index];
    tiles[index] = null;
    renderPuzzle(container, tiles, feedback, gameId, imagePath);

    if (isPuzzleSolved(tiles) && feedback) {
        showFragmentSuccess(feedback, gameId);
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

setupTrivia("aug1");
setupMemory("aug2");
setupAnagram("aug3", ANAGRAM_WORD);
setupHangman("sep1", HANGMAN_WORD);
setupTrueFalse("sep2");
setupRiddle("sep3", RIDDLE_1_ANSWER);
setupCipher("oct1", CIPHER_MESSAGE, CIPHER_SHIFT);
setupTrivia("oct2");
setupMemory("nov1");
setupTrueFalse("nov2");
setupRiddle("dic1", RIDDLE_2_ANSWER);
setupSlidingPuzzle("dic2", DECEMBER_PUZZLE_IMAGE);
