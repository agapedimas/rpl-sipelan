class LogCategory {
    /** @type {number} */
    #id;
    /** @type {string} */
    #name;
    /** @type {"string" | "number" | "boolean"} */
    #type;
    /** @type {string | null} */
    #unit;

    /**
     * @param {number} id
     * @param {string} name
     * @param {"string" | "number" | "boolean"} type
     * @param {string | null} unit
     */
    constructor(id, name, type, unit) {
        this.#id = id;
        this.#name = name;
        this.#type = type;
        this.#unit = unit;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get type() { return this.#type; }
    get unit() { return this.#unit; }
}

module.exports = LogCategory;