const District = require("./district.model");
const City = require("./city.model");
const Province = require("./province.model");
const Model = require("./model");

class Domicile extends Model {
    /** @type {District} */
    #district;
    /** @type {City} */
    #city;
    /** @type {Province} */
    #province;

    /**
     * @param {District} district
     * @param {City} city
     * @param {Province} province
     */
    constructor(district, city, province) {
        super();
        this.#district = district;
        this.#city = city;
        this.#province = province;
    }

    get district() {
        return this.#district;
    }
    get city() {
        return this.#city;
    }
    get province() {
        return this.#province;
    }
}

module.exports = Domicile;