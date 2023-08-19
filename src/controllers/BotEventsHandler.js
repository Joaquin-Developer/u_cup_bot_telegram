/**
 * Modulo para controlar los eventos del bot
 * Estos eventos son comandos recibidos por el usuario
 */

const functions = require("../modules/generic.modules")
const { IncorrectFaseData } = require("../exceptions/exceptions")


class BotEventsHandler {

    static _waitForUserResponse(ctx, bot) {
        return new Promise((resolve) => {
            bot.on("text", (message) => {
                if (message.chat.id === ctx.chat.id) {
                    resolve(message.text)
                }
            })
        })
    }

    static help(ctx) {
        ctx.reply(functions.help())
    }

    static hearsHandle(ctx) {
        const username = ctx.message.from.first_name
        ctx.reply(`Hola ${username} :)\nPara saber como usarme escribí /help`)
    }

    static async grupo(ctx) {
        const message = ctx.message.text
        console.log(`Mensaje recibido de ${ctx.message.from.first_name}`)
        let grupoName = message.split("/grupo ")[1]

        if (!grupoName) {
            return ctx.reply("Dato incorrecto! Debes proporcionar un gupo valido")
        }

        grupoName = grupoName.toUpperCase().trim()
        ctx.reply(await functions.getGroupResults(grupoName))
    }

    static async equipo(ctx) {
        const message = ctx.message.text
        console.log(`Mensaje recibido de ${ctx.message.from.first_name}`)
        let teamName = message.split("/equipo ")[1]

        if (!teamName) {
            return ctx.reply("Dato incorrecto! Debes proporcionar un equipo valido")
        }
        teamName = teamName.toUpperCase().trim()
        ctx.reply(await functions.getTeamResults(teamName))
    }

    static async resultado_seleccionarPartido(ctx) {
        const teamName = ctx.message.text.split("/resultado ")[1].toUpperCase().trim()
        ctx.reply(await functions.getTeamPartidos(teamName))
    }

    static async resultado_set(ctx) {
        const message = ctx.message.text.split("/resultado ")[1]
        const idPartido = parseInt(message.split(" ")[0])
        const golLocal = parseInt(message.split(" ")[1].split("-")[0])
        const golVisitante = parseInt(message.split(" ")[1].split("-")[1])
        let penalLocal, penalVisitante

        if (message.indexOf("--p ") !== -1) {
            penalLocal = parseInt(message.split("--p ")[1].split("-")[0])
            penalVisitante = parseInt(message.split("--p ")[1].split("-")[1])
        }

        try {
            await functions.setTeamPartido(idPartido, golLocal, golVisitante, penalLocal, penalVisitante)
            ctx.reply("¡Datos actualizados!")
        } catch (error) {
            ctx.reply("Se produjo un error inesperado. No se pudo actualizar la información.")
        }
    }

    /**
     * Setear el resultado de un partido
     * Recibe equipo y selecciona partido por id.
     */
    static async resultado(ctx) {
        // const { bot } = this
        const message = ctx.message.text
        console.log(`Mensaje recibido de ${ctx.message.from.first_name}`)
        // let teamName = message.split("/resultado ")[1]

        let request = message.split("/resultado ")[1]

        if (!request) {
            ctx.reply("Dato incorrecto! Debes proporcionar un equipo valido")
        } else if (isNaN(parseInt(request.split(" ")[0]))) {
            BotEventsHandler.resultado_seleccionarPartido(ctx)
        } else {
            BotEventsHandler.resultado_set(ctx)
        }
    }

    static async estadisticas(ctx) {
        const message = ctx.message.text
        console.log(`Mensaje recibido de ${ctx.message.from.first_name}`)
        let grupoName = message.split("/estadisticas ")[1]

        if (!grupoName) {
            return ctx.reply("Dato incorrecto! Debes proporcionar un gupo valido")
        }

        grupoName = grupoName.toUpperCase().trim()
        ctx.replyWithMarkdown(await functions.getGroupStatistics(grupoName))
    }

    static async fase(ctx) {
        const message = ctx.message.text
        console.log(`Mensaje recibido de ${ctx.message.from.first_name}`)
        let faseName = message.split("/fase ")[1]

        try {
            if (!faseName) {
                throw new IncorrectFaseData()
            }

            faseName = faseName.toLowerCase().trim()
            ctx.reply(await functions.getResultsByFase(faseName))

        } catch (error) {
            console.error(error)
            ctx.reply(error.toString())
        }

    }

    static async resultadoFase(ctx) { }

}

module.exports = BotEventsHandler