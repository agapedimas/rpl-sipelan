const Model = require("./model");

class Account extends Model {
    /** @type {number} */
    #id;
    /** @type {string} */
    #name;
    /** @type {string | null} */
    #nik;
    /** @type {ArrayBuffer | null} */
    #picture;
    /** @type {string} */
    #phone;
    /** @type {"citizen" | "volunteer" | "officer" | "admin"} */
    #role;
    /** @type {number} */
    #districtId;
    /** @type {boolean} */
    #isActive;

    /**
     * @param {number} id
     * @param {string} name
     * @param {string | null} nik
     * @param {ArrayBuffer | null} picture
     * @param {string} phone
     * @param {"citizen" | "volunteer" | "officer" | "admin"} role
     * @param {number} districtId
     * @param {boolean} isActive
     */
    constructor(id, name, nik, picture, phone, role, districtId, isActive) {
        super();
        this.#id = id;
        this.#name = name;
        this.#nik = nik;
        this.#picture = picture;
        this.#phone = phone;
        this.#role = role;
        this.#districtId = districtId;
        this.#isActive = isActive;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get nik() {
        return this.#nik;
    }

    get picture() {
        return this.#picture;
    }

    get phone() {
        return this.#phone;
    }

    get role() {
        return this.#role;
    }

    get districtId() {
        return this.#districtId;
    }

    get isActive() {
        return this.#isActive;
    }
}

module.exports = Account;