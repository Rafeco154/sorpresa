// ==== CONFIGURACIÓN COMPARTIDA (index.html + juegos.html) ====

// Cumpleaños: a partir de este día (incluido) se puede desbloquear el regalo
const BIRTHDAY_DATE = new Date("2026-12-15T00:00:00").getTime();

// Fragmentos de la contraseña final, uno por juego mensual.
// Mezcla el día que os conocisteis (13 de junio), el día que os visteis en
// persona (21 de junio), su cumpleaños (15/12) y la palabra "AMOR" repartida
// entre los fragmentos en vez de ir toda junta al final.
// Concatenados (en este orden) forman la contraseña: "13AM2115OR12"
// Diciembre no suma nada nuevo: su juego (el puzzle) es el cierre/foto final.
const FRAGMENTS = {
    august: "13A",
    september: "M21",
    october: "15",
    november: "OR",
    december: "12"
};

// Contraseña final = todos los fragmentos anteriores, en orden
const FINAL_PASSWORD = Object.values(FRAGMENTS).join("");

// Foto para el puzzle deslizante de diciembre (debe ser cuadrada para que las
// piezas no salgan deformadas). TODO: sustituye el archivo por la foto que
// prefieras manteniendo el mismo nombre, o cambia esta ruta.
const DECEMBER_PUZZLE_IMAGE = "images/puzzle-diciembre.jpg";

// Fecha en la que se desbloquea cada juego (el día 1 de cada mes)
// TODO: ajusta el año si lo necesitas
const GAME_UNLOCK_DATES = {
    august: new Date("2026-08-01T00:00:00").getTime(),
    september: new Date("2026-09-01T00:00:00").getTime(),
    october: new Date("2026-10-01T00:00:00").getTime(),
    november: new Date("2026-11-01T00:00:00").getTime(),
    december: new Date("2026-12-01T00:00:00").getTime()
};

const MONTH_NAMES = {
    august: "agosto",
    september: "septiembre",
    october: "octubre",
    november: "noviembre",
    december: "diciembre"
};

// Modo prueba de los juegos: con esto en true, los 5 juegos están
// desbloqueados sin importar la fecha. Puesto de nuevo en false para que
// cada uno se desbloquee solo en su fecha real (1 de agosto, septiembre, etc).
const TESTING_MODE_UNLOCK_ALL = false;

// Modo prueba de la contraseña final: con esto en true, se puede desbloquear
// el regalo aunque todavía no sea su cumpleaños. Ponlo en false cuando toque
// volver a exigir la fecha real (15 de diciembre).
const TESTING_MODE_SKIP_BIRTHDAY_GATE = false;

function isGameUnlocked(monthKey) {
    if (TESTING_MODE_UNLOCK_ALL) return true;
    return Date.now() >= GAME_UNLOCK_DATES[monthKey];
}
