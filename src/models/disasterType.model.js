const Model = require("./model");

class DisasterType extends Model {
    /** @type {number} */
    #id;
    /** @type {string} */
    #name;
    /** @type {boolean} */
    #isActive;

    /**
     * @param {number} id
     * @param {string} name
     * @param {boolean} isActive
     */
    constructor(id, name, isActive) {
        super();
        this.#id = id;
        this.#name = name;
        this.#isActive = isActive == 1;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get isActive() { return this.#isActive; }
}

module.exports = DisasterType;