const District = require("./district.model");
const City = require("./city.model");
const Province = require("./province.model");
const Model = require("./model");

class Domicile extends Model {
    /** @type {typeof District.prototype.id} */
    #districtId;
    /** @type {typeof District.prototype.name} */
    #districtName;
    /** @type {typeof City.prototype.id} */
    #cityId;
    /** @type {typeof City.prototype.name} */
    #cityName;
    /** @type {typeof Province.prototype.id} */
    #provinceId;
    /** @type {typeof Province.prototype.name} */
    #provinceName;
    /** @type {typeof District.prototype.postalCode} */
    #postalCode;
    /** @type {string} */
    #displayName;

    /**
     * @param {typeof District.prototype.id} districtId
     * @param {typeof District.prototype.name} districtName
     * @param {typeof City.prototype.id} cityId
     * @param {typeof City.prototype.name} cityName
     * @param {typeof Province.prototype.id} provinceId
     * @param {typeof Province.prototype.name} provinceName
     * @param {typeof District.prototype.postalCode} postalCode
     * @param {string} displayName
     */
    constructor(districtId, districtName, cityId, cityName, provinceId, provinceName, postalCode, displayName) {
        super();
        this.#districtId = districtId;
        this.#districtName = districtName;
        this.#cityId = cityId;
        this.#cityName = cityName;
        this.#provinceId = provinceId;
        this.#provinceName = provinceName;
        this.#postalCode = postalCode;
        this.#displayName = displayName
    }

    get district() {
        return new District(this.#districtId, this.#districtName, this.#postalCode);
    }
    get city() {
        return new City(this.#cityId, this.#cityName);
    }
    get province() {
        return new Province(this.#provinceId, this.#provinceName);
    }

    get districtId() {
        return this.#districtId;
    }
    get districtName() {
        return this.#districtName;
    }
    get cityId() {
        return this.#cityId;
    }
    get cityName() {
        return this.#cityName;
    }
    get provinceId() {
        return this.#provinceId;
    }
    get provinceName() {
        return this.#provinceName;
    }
    get postalCode() {
        return this.#postalCode;
    }
    get displayName() {
        return this.#displayName;
    }
}

module.exports = Domicile;