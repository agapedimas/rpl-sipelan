class Log {
    /** @type {number} */
    #id;
    /** @type {string} */
    #value;
    /** @type {number} */
    #time;
    /** @type {ArrayBuffer | null} */
    #picture;
    /** @type {number} */
    #reporterId;
    /** @type {number} */
    #logCategoryId;
    /** @type {number} */
    #reportId;

    /**
     * @param {number} id
     * @param {string} value
     * @param {number} time Unix timestamp in milliseconds
     * @param {ArrayBuffer | null} picture
     * @param {number} reporterId
     * @param {number} logCategoryId
     * @param {number} reportId
     */
    constructor(
        id,
        value,
        time,
        picture,
        reporterId,
        logCategoryId,
        reportId
    ) {
        this.#id = id;
        this.#value = value;
        this.#time = time;
        this.#picture = picture;
        this.#reporterId = reporterId;
        this.#logCategoryId = logCategoryId;
        this.#reportId = reportId;
    }

    get id() { return this.#id; }
    get value() { return this.#value; }
    get time() { return this.#time; }
    get picture() { return this.#picture; }
    get reporterId() { return this.#reporterId; }
    get logCategoryId() { return this.#logCategoryId; }
    get reportId() { return this.#reportId; }
}

module.exports = Log;