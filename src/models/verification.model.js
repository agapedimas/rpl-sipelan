const Model = require("./model");

class Verification extends Model {
    /** @type {number} */
    #id;
    /** @type {"verified" | "rejected"} */
    #status;
    /** @type {number} */
    #time;
    /** @type {string | null} */
    #reason;
    /** @type {number} */
    #submissionId;
    /** @type {number} */
    #verifierId;

    /**
     * @param {number} id
     * @param {"verified" | "rejected"} status
     * @param {number} time Unix timestamp in milliseconds
     * @param {string | null} reason
     * @param {number} submissionId
     * @param {number} verifierId
     */
    constructor(id, status, time, reason, submissionId, verifierId) {
        super();
        this.#id = id;
        this.#status = status;
        this.#time = time;
        this.#reason = reason;
        this.#submissionId = submissionId;
        this.#verifierId = verifierId;
    }

    get id() { return this.#id; }
    get status() { return this.#status; }
    get time() { return this.#time; }
    get reason() { return this.#reason; }
    get submissionId() { return this.#submissionId; }
    get verifierId() { return this.#verifierId; }
}

module.exports = Verification;