class Submission {
    /** @type {number} */
    #id;
    /** @type {string} */
    #description;
    /** @type {number} */
    #time;
    /** @type {ArrayBuffer | null} */
    #picture;
    /** @type {boolean} */
    #isArchived;
    /** @type {number} */
    #districtId;
    /** @type {number} */
    #citizenId;
    /** @type {number} */
    #disasterTypeId;

    /**
     * @param {number} id
     * @param {string} description
     * @param {number} time Unix timestamp in milliseconds
     * @param {ArrayBuffer | null} picture
     * @param {boolean} isArchived
     * @param {number} districtId
     * @param {number} citizenId
     * @param {number} disasterTypeId
     */
    constructor(
        id,
        description,
        time,
        picture,
        isArchived,
        districtId,
        citizenId,
        disasterTypeId
    ) {
        this.#id = id;
        this.#description = description;
        this.#time = time;
        this.#picture = picture;
        this.#isArchived = isArchived;
        this.#districtId = districtId;
        this.#citizenId = citizenId;
        this.#disasterTypeId = disasterTypeId;
    }

    get id() { return this.#id; }
    get description() { return this.#description; }
    get time() { return this.#time; }
    get picture() { return this.#picture; }
    get isArchived() { return this.#isArchived; }
    get districtId() { return this.#districtId; }
    get citizenId() { return this.#citizenId; }
    get disasterTypeId() { return this.#disasterTypeId; }
}

module.exports = Submission;