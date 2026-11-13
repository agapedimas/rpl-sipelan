const Model = require("./model");

class Authentication extends Model {
    /** @type {number} */
    #id;
    /** @type {number} */
    #accountId;
    /** @type {string} */
    #ipAddress;
    /** @type {number} */
    #time;

    /**
     * @param {number} id
     * @param {number} accountId
     * @param {string} ipAddress IP address from request
     * @param {number} time Unix timestamp in milliseconds
     */
    constructor(id, accountId, ipAddress, time) {
        super();
        this.#id = id;
        this.#accountId = accountId;
        this.#ipAddress = ipAddress;
        this.#time = time;
    }

    get id() {
        return this.#id;
    }

    get accountId() {
        return this.#accountId;
    }

    get ipAddress() {
        return this.#ipAddress;
    }

    get time() {
        return this.#time;
    }
}

module.exports = Authentication;