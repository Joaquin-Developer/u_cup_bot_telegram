const fs = require("fs")
const path = require('path');
const axios = require("axios")
const format = require("string-format")
const { Table } = require("cli-table")

const { AxiosFetchError } = require("../exceptions/exceptions")

const utils = {}


utils.TypeRequest = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT"
}


utils.groupsMap = (group) => {
    // mapea el nombre de grupo al id_grupo
    return {
        "A": 1,
        "B": 2,
        "C": 3,
        "D": 4,
        "E": 5,
        "F": 6,
        "G": 7,
        "H": 8,
    }[group]
}

utils.fasesMap = (faseName) => {
    return {
        "8vos": 1,
        "4tos": 2,
        "semifinal": 3,
        "3er puesto": 5,
        "final": 4
    }[faseName]
}


utils.readFile = (filePath) => {
    const _path = path.join(__dirname, "..", "..", filePath)
    return fs.readFileSync(_path, "utf-8")
}

utils.readHelpTemplate = () => {
    const templatePath = "templates/messages.txt"
    return utils.readFile(templatePath)
}


utils.fetch = async (url, typeRequest = utils.TypeRequest.GET, body = null) => {
    let response

    if (typeRequest === utils.TypeRequest.GET)
        response = await axios.get(url)
    if (typeRequest === utils.TypeRequest.POST)
        response = await axios.post(url, body)
    if (typeRequest === utils.TypeRequest.PUT)
        response = await axios.put(url, body)

    try {
        return await response.data
    } catch (error) {
        console.error(error)
        throw new AxiosFetchError(`Error al realizar fetch a API: ${error}`)
    }
}


utils.formatString = (str, fmt) => {
    return format(str, fmt)
}


utils.jsonToTable = (data, columns) => {
    const table = new Table({ head: columns })
    data.forEach(element => {
        const row = columns.map((columna) => element[columna])
        table.push(row)
    })
    return table.toString()
}


module.exports = utils