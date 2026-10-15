class District {
    /** @type {number} */
    #id;
    /** @type {number} */
    #cityId;
    /** @type {string} */
    #name;
    /** @type {string} */
    #postalCode;

    /**
     * @param {number} id
     * @param {number} cityId
     * @param {string} name
     * @param {string} postalCode
     */
    constructor(id, cityId, name, postalCode) {
        this.#id = id;
        this.#cityId = cityId;
        this.#name = name;
        this.#postalCode = postalCode;
    }

    get id() {
        return this.#id;
    }

    get cityId() {
        return this.#cityId;
    }

    get name() {
        return this.#name;
    }

    get postalCode() {
        return this.#postalCode;
    }
}

module.exports = District;