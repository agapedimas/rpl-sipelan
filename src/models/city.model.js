class City {
    /** @type {number} */
    #id;
    /** @type {number} */
    #provinceId;
    /** @type {string} */
    #name;

    /**
     * @param {number} id
     * @param {number} provinceId
     * @param {string} name
     */
    constructor(id, provinceId, name) {
        this.#id = id;
        this.#provinceId = provinceId;
        this.#name = name;
    }

    get id() {
        return this.#id;
    }

    get provinceId() {
        return this.#provinceId;
    }

    get name() {
        return this.#name;
    }
}

module.exports = City;