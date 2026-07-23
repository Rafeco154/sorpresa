// ==== CONFIGURACIÓN COMPARTIDA (index.html + juegos.html) ====

// Cumpleaños: a partir de este día (incluido) se puede desbloquear el regalo
// (restada 1 hora para que el contador llegue a 0 justo a las 00:00:00 del 15 de diciembre)
const BIRTHDAY_DATE = new Date("2026-12-14T23:00:00").getTime();

// Aviso importante: cuenta atrás hasta el 15 de agosto. Al llegar a 0, se
// sustituye por un aviso para bloquear los días 18, 19 y 20 de diciembre
// (las fechas en las que iríamos a las cabañas).
const NOTICE_DATE = new Date("2026-08-15T00:00:00").getTime();

// Fragmentos de la contraseña final, uno por juego. Hay tantos juegos (12)
// como caracteres tiene la contraseña, repartidos entre agosto y diciembre:
// 3 en agosto, 3 en septiembre, 2 en octubre, 2 en noviembre y 2 en diciembre.
// Mezcla el día que os conocisteis (13 de junio), el día que os visteis en
// persona (21 de junio), su cumpleaños (15/12) y la palabra "AMOR" repartida
// entre los fragmentos en vez de ir toda junta al final.
// Concatenados (en este orden) forman la contraseña: "13AM2115OR12"
const FRAGMENTS = {
    aug1: "1",
    aug2: "3",
    aug3: "A",
    sep1: "M",
    sep2: "2",
    sep3: "1",
    oct1: "1",
    oct2: "5",
    nov1: "O",
    nov2: "R",
    dic1: "1",
    dic2: "2"
};

// Contraseña final = todos los fragmentos anteriores, en orden
const FINAL_PASSWORD = Object.values(FRAGMENTS).join("");

// Foto para el puzzle deslizante de diciembre (debe ser cuadrada para que las
// piezas no salgan deformadas). TODO: sustituye el archivo por la foto que
// prefieras manteniendo el mismo nombre, o cambia esta ruta.
const DECEMBER_PUZZLE_IMAGE = "images/puzzle-diciembre.jpg";

// Fecha en la que se desbloquea cada juego
// TODO: ajusta el año si lo necesitas
const GAME_UNLOCK_DATES = {
    aug1: new Date("2026-08-01T00:00:00").getTime(),
    aug2: new Date("2026-08-11T00:00:00").getTime(),
    aug3: new Date("2026-08-21T00:00:00").getTime(),
    sep1: new Date("2026-09-01T00:00:00").getTime(),
    sep2: new Date("2026-09-11T00:00:00").getTime(),
    sep3: new Date("2026-09-21T00:00:00").getTime(),
    oct1: new Date("2026-10-01T00:00:00").getTime(),
    oct2: new Date("2026-10-15T00:00:00").getTime(),
    nov1: new Date("2026-11-01T00:00:00").getTime(),
    nov2: new Date("2026-11-15T00:00:00").getTime(),
    dic1: new Date("2026-12-01T00:00:00").getTime(),
    dic2: new Date("2026-12-10T00:00:00").getTime()
};

// Texto de la fecha de desbloqueo de cada juego, para el mensaje de "🔒 Espera hasta..."
const GAME_UNLOCK_LABELS = {
    aug1: "1 de agosto",
    aug2: "11 de agosto",
    aug3: "21 de agosto",
    sep1: "1 de septiembre",
    sep2: "11 de septiembre",
    sep3: "21 de septiembre",
    oct1: "1 de octubre",
    oct2: "15 de octubre",
    nov1: "1 de noviembre",
    nov2: "15 de noviembre",
    dic1: "1 de diciembre",
    dic2: "10 de diciembre"
};

// Modo prueba de los juegos: con esto en true, los 12 juegos están
// desbloqueados sin importar la fecha. Puesto de nuevo en false para que
// cada uno se desbloquee solo en su fecha real.
const TESTING_MODE_UNLOCK_ALL = false;

// Modo prueba de la contraseña final: con esto en true, se puede desbloquear
// el regalo aunque todavía no sea su cumpleaños. Ponlo en false cuando toque
// volver a exigir la fecha real (15 de diciembre).
const TESTING_MODE_SKIP_BIRTHDAY_GATE = false;

// Modo prueba del aviso importante: con esto en true, se ve directamente el
// mensaje final (el de dejar libres el 18, 19 y 20 de diciembre) en vez de la
// cuenta atrás, sin esperar a que llegue el 15 de agosto. Ponlo en false para
// volver a mostrar la cuenta atrás normal.
const TESTING_MODE_SHOW_NOTICE_END = false;

function isGameUnlocked(gameId) {
    if (TESTING_MODE_UNLOCK_ALL) return true;
    return Date.now() >= GAME_UNLOCK_DATES[gameId];
}
