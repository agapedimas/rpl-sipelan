const Account = require("./account.model");
const Model = require("./model");

class OTP extends Model {
    /** @type { number } */
    #code;
    /** @type { typeof Account.prototype.id } */
    #accountId;
    /** @type { string } */
    #expireAt;
    /** @type { boolean } */
    #isUsed = false;
    /**
     * @param { number } code 
     * @param { typeof Account.prototype.id } accountId 
     * @param { string } expireAt UNIX timestamp
     */
    constructor(code, accountId, expireAt) {
        super();
        this.#code = code;
        this.#accountId = accountId;
        // Default expiration time is 5 minutes 
        const expirationTime = Date.now() + (5 * 60 * 1000);
        this.#expireAt = expireAt ?? expirationTime;
    }

    useCode() {
        if (this.isValid === true) {
            this.#isUsed = true;
        }
        else {
            throw new Error("OTP is already used.");
        }
    }

    get code() {
        return this.#code;
    }

    get accountId() {
        return this.#accountId;
    }

    get isValid() {
        const isExpired = Date.now() - this.#expireAt > 0;
        return this.#isUsed === false && isExpired === false;
    }
}

module.exports = OTP;