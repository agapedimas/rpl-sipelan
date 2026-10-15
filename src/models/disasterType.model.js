class DisasterType {
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
        this.#id = id;
        this.#name = name;
        this.#isActive = isActive;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get isActive() { return this.#isActive; }
}

module.exports = DisasterType;