const assert = require("chai").assert
// const helpModule = require("../../src/modules/generic.modules").help

const format = require("string-format")


describe("string-formatter", () => {

    it("Prueba string-formatter", () => {
        const name = "Joaquín"
        let str = format("Hola me llamo {name}", { name })
        console.log(str)

        assert.equal(str, "Hola me llamo " + name)
    })
})
