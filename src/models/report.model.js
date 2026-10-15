class Report {
    /** @type {number} */
    #id;
    /** @type {boolean} */
    #isArchived;
    /** @type {"closed" | "handlingRequired" | "noHandlingRequired"} */
    #status;
    /** @type {string} */
    #description;
    /** @type {number} */
    #time;
    /** @type {number} */
    #disasterTypeId;

    /**
     * @param {number} id
     * @param {boolean} isArchived
     * @param {"closed" | "handlingRequired" | "noHandlingRequired"} status
     * @param {string} description
     * @param {number} time Unix timestamp in milliseconds
     * @param {number} disasterTypeId
     */
    constructor(id, isArchived, status, description, time, disasterTypeId) {
        this.#id = id;
        this.#isArchived = isArchived;
        this.#status = status;
        this.#description = description;
        this.#time = time;
        this.#disasterTypeId = disasterTypeId;
    }

    get id() { return this.#id; }
    get isArchived() { return this.#isArchived; }
    get status() { return this.#status; }
    get description() { return this.#description; }
    get time() { return this.#time; }
    get disasterTypeId() { return this.#disasterTypeId; }
}

module.exports = Report;