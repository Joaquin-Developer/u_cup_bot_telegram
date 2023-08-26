
class AxiosFetchError extends Error { }


class IncorrectFaseData extends Error {
    constructor() {
        super(global.ERR_MESSAGES.INCORRECT_FASE_DATA)
    }
}

module.exports = { AxiosFetchError, IncorrectFaseData }