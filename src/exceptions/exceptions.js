
class AxiosFetchError extends Error { }


class IncorrectFaseData extends Error {
    constructor() {
        super("Dato incorrecto! Debes proporcionar un nombre de fase valido. (8vos, 4tos, SemiFinal, 3er Puesto, Final)")
    }
}

module.exports = { AxiosFetchError, IncorrectFaseData }