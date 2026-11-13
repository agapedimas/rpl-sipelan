const Model = require("./model");

class Province extends Model {
    /** @type {number} */
    #id;
    /** @type {string} */
    #name;

    /**
     * @param {number} id
     * @param {string} name
     */
    constructor(id, name) {
        super();
        this.#id = id;
        this.#name = name;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }
}

module.exports = Province;