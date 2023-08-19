/**
 * Logica de cada funcionalidad del bot
 */

const { AxiosFetchError, IncorrectFaseData } = require("../exceptions/exceptions")
const config = require("../../config")
const utils = require("../utils/utils")

const functions = {}


functions.help = () => {
    return utils.readHelpTemplate()
}


function generateResponseByData(data) {
    let respTxt = ""

    data.forEach(partido => {

        respTxt += `- ${partido.equipo_local} `

        if (partido.status_partido === "JUGADO") {
            if (partido.penales_local && partido.penales_visitante) {
                respTxt += `${partido.goles_local}(${partido.penales_local}) - (${partido.penales_visitante})${partido.goles_visitante} `
            } else {
                respTxt += `${partido.goles_local} - ${partido.goles_visitante} `
            }
        } else {
            respTxt += "vs "
        }

        respTxt += `${partido.equipo_visitante}\n\n`
    })
    return respTxt
}


functions.getGroupResults = async (group) => {
    const grId = utils.groupsMap(group)
    const api = config.api
    let url = api.API_URL + api.ENDPOINTS["get_results_group"]
    url = utils.formatString(url, { group_id: grId })
    const data = await utils.fetch(url)

    const ida = data.slice(0, 6)
    const vuelta = data.slice(6, 12)

    let txt = `Partidos del Grupo ${group}:\n\nIda:\n\n`

    txt += generateResponseByData(ida)
    txt += "Vuelta:\n\n"
    txt += generateResponseByData(vuelta)
    txt += "Copa Unión 2023."
    return txt
}


functions.getTeams = async () => {
    const api = config.api
    const url = api.API_URL + api.ENDPOINTS["get_teams"]
    return await utils.fetch(url)
}


functions.getTeamResults = async (team, returnOnlyData = false) => {
    const api = config.api
    let url = api.API_URL + api.ENDPOINTS["get_results_team"]
    url = utils.formatString(url, { equipo_nombre: team })
    const data = await utils.fetch(url)

    if (returnOnlyData)
        return data

    let txt = `Partidos del Equipo ${team}:\n\n`
    txt += generateResponseByData(data)
    txt += "Copa Unión 2023."
    return txt
}


functions.getTeamPartidos = async (team) => {
    const data = await functions.getTeamResults(team, true)
    const jugados = data.filter(partido => partido.status_partido === "NO JUGADO")
    let txt = "A continuación, indica el id de partido que desea modificar\n\n"
    jugados.forEach(info => {
        txt += `${info.id_partido} - ${info.equipo_local} vs ${info.equipo_visitante}\n`
    })
    txt += "\n/resultado <id_partido> <GolLocal>-<GolVisitante> --p <PenalLocal>-<PenalVisitante>\n"
    txt += "Ejemplo 1: /resultado 102 4-1\nEjemplo 2: /resultado 101 1-1 --p 5-4"
    return txt
}


functions.setTeamPartido = async (partidoId, golLocal, golVisitante, penalLocal = null, penalVisitante = null) => {
    const api = config.api
    let url = api.API_URL + api.ENDPOINTS["set_results_group"]
    url = utils.formatString(url, { partido_id: partidoId })
    const body = {
        "goles_local": golLocal,
        "goles_visitante": golVisitante
    }

    if (penalLocal && penalVisitante) {
        body["penales_local"] = penalLocal
        body["penales_visitante"] = penalVisitante
    }

    const resp = await utils.fetch(url, utils.TypeRequest.PUT, body)
    console.log(resp)
    return resp
}


functions.getGroupStatistics = async (group) => {
    const grId = utils.groupsMap(group)
    const api = config.api
    let url = api.API_URL + api.ENDPOINTS["get_group_statistics"]
    url = utils.formatString(url, { group_id: grId })
    const data = await utils.fetch(url)
    let txt = `Estadísticas del grupo ${group}\n\n`

    const maxNameLength = data.reduce((max, item) => Math.max(max, item.nombre.length), 0)

    txt += `${"Equipo".padEnd(maxNameLength, " ")} |Pts|GF|GC|DIF\n`

    data.forEach(elem => {
        txt += `${elem.nombre.padEnd(maxNameLength, " ")} ${elem.pts.toString().padStart(3, ' ')} ${elem.goles_favor.toString().padStart(3, ' ')} ${elem.goles_contra.toString().padStart(3, ' ')} ${elem.diferencia.toString().padStart(3, ' ')}\n`
    })

    return "`" + txt + "`"
}


functions.getResultsByFase = async (faseName) => {
    const faseId = utils.fasesMap(faseName)
    if (!faseId) {
        throw new IncorrectFaseData()
    }

    const api = config.api
    let url = api.API_URL + api.ENDPOINTS["get_results_fase"]
    url = utils.formatString(url, { fase_id: faseId })
    const data = await utils.fetch(url)

    let txt = `Partidos de la fase ${faseName}:\n\n`

    // des-hardcodear esto!!!
    if (faseId === 1 || faseId === 2) {
        txt += "Ida:\n\n"
        const ida = data.slice(0, data.length / 2)
        const vuelta = data.slice(data.length / 2, data.length)
        txt += generateResponseByData(ida)
        txt += "Vuelta:\n\n"
        txt += generateResponseByData(vuelta)
    } else {
        txt += generateResponseByData(data)
    }

    txt += "Copa Unión 2023."
    return txt
}


module.exports = functions