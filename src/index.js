const config = require("../config")
const { Telegraf } = require('telegraf')
const botEvents = require("./controllers/BotEventsHandler")
global.ERR_MESSAGES = config.ERR_MESSAGES

const bot = new Telegraf(config.bot.TELEGRAM_TOKEN)


bot.help(botEvents.help)
bot.command("grupo", botEvents.grupo)
bot.command("equipo", botEvents.equipo)
bot.command("resultado", botEvents.resultado)
bot.command("estadisticas", botEvents.estadisticas)
bot.command("fase", botEvents.fase)
// bot.command("resultadoFase", botEvents.resultadoFase)
bot.hears(/.*/, botEvents.hearsHandle)

console.log("Iniciando bot...")
bot.launch()
