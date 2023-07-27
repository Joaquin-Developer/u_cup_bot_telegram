module.exports = {
    inProduction: true,
    api: {
        API_URL: "http://localhost:8000/api/v1",
        ENDPOINTS: {
            "get_results_group": "/resultados/resultados/grupos/{group_id}",
            "get_results_fase": "/resultados/resultados/fase/{fase_id}",
            "get_results_group_team": "/resultados/resultados/equipos/{equipo_id}",
            "get_results_team": "/resultados/resultados/equipos/{equipo_nombre}",
            "set_results_group": "/partido/partidos/{partido_id}",
            "set_results_fase": "/partido/fase_final/{partido_id}",
            "get_teams": "/equipos/",
            "get_group_statistics": "/estadisticas/grupos/{group_id}"
        }
    },
    bot: {
        TELEGRAM_TOKEN: process.env["TELEGRAM_BOT_UCUP23_TOKEN"] || "6055957945:AAFWg4T2dX0pG-w710tEiXJMx6S2Xzm8lyk",
    },
    ERR_MESSAGES: {
        CONSTANT_ERR_COMMAND: "Modo incorrecto de úso.\nEscribe /help para mas información."
    }
}