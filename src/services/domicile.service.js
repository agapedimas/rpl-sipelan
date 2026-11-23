const DomicileRepository = require("../repositories/domicile.repository");

const Province = require("../models/province.model");
const City = require("../models/city.model");
const District = require("../models/district.model");
const Domicile = require("../models/domicile.model");

/**
 * @returns { Promise<Array<Domicile>> }
 */
async function findAll() {
    const domiciles = await DomicileRepository.findAll();
    return domiciles;
}

/**
 * @param { typeof District.prototype.id } districtId 
 * @returns { Promise<Domicile?> }
 */
async function findByDistrictId(districtId) {
    const domicile = await DomicileRepository.findByDistrictId(districtId);
    return domicile;
}

/**
 * @param { typeof City.prototype.id } cityId 
 * @returns { Promise<Array<Domicile>> }
 */
async function findAllByCityId(cityId) {
    const domicile = await DomicileRepository.findAllByCityId(cityId);
    return domicile;
}

module.exports = {
    findAll, 
    findByDistrictId,
    findAllByCityId
}