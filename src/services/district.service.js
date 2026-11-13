const ProvinceRepository = require("../repositories/province.repository");
const CityRepository = require("../repositories/city.repository");
const DistrictRepository = require("../repositories/district.repository");

const Province = require("../models/province.model");
const City = require("../models/city.model");
const District = require("../models/district.model");

/**
 * @param { typeof District.prototype.name } name 
 * @param { typeof District.prototype.postalCode } postalCode
 * @param { typeof District.prototype.cityId } cityId
 * @returns { Promise<typeof District.prototype.id> }
 */
async function add(name, postalCode, cityId) {
    const districtId = await DistrictRepository.add(name, postalCode, cityId);
    return districtId;
}

/**
 * @param { typeof District.prototype.id } districtId 
 * @param {{
 *      name: typeof District.prototype.name,
 *      postalCode: typeof District.prototype.postalCode,
 *      cityId: typeof City.prototype.id
 * }} updatedInfo
 * @returns { Promise<boolean> }
 */
async function updateInfo(districtId, updatedInfo) {
    const isSuccess = 
        await DistrictRepository.updateInfo(
            districtId, 
            updatedInfo.name,
            updatedInfo.postalCode,
            updatedInfo.cityId);
    return isSuccess;
}

/**
 * @param { typeof District.prototype.id } districtId 
 * @returns { Promise<boolean> }
 */
async function remove(districtId) {
    const isSuccess = await DistrictRepository.remove(districtId);
    return isSuccess;
}

/**
 * @returns { Promise<Array<District>> }
 */
async function findAll() {
    const districts = await DistrictRepository.findAll();
    return districts;
}

/**
 * @param { string } query 
 * @returns { Promise<Array<District>> }
 */
async function findAllByQuery(query) {
    // Prevent SQL execution if query is empty
    if (!query)
        return [];
    query = query.trim();

    const districts = await DistrictRepository.findAllByQuery(query);
    return districts;
}

/**
 * @param { typeof City.prototype.id } cityId 
 * @returns { Promise<Array<District>> }
 */
async function findAllByCityId(cityId) {
    const districts = await DistrictRepository.findAllByCityId(cityId);
    return districts;
}

/**
 * @param { typeof District.prototype.id } districtId 
 * @returns { Promise<District?> }
 */
async function findByDistrictId(districtId) {
    const district = await DistrictRepository.findByDistrictId(districtId);
    return district;
}

/**
 * @param { typeof District.prototype.postalCode } postalCode 
 * @returns { Promise<District?> }
 */
async function findByPostalCode(postalCode) {
    const district = await DistrictRepository.findByPostalCode(postalCode);
    return district;
}

/**
 * @param { typeof District.prototype.id } districtId
 * @returns { Promise<boolean> }
 */
async function doesDistrictExist(districtId) {
    const district = await DistrictRepository.findByDistrictId(districtId);
    return district != null;
}

/**
 * @param { typeof District.prototype.id } districtId
 * @returns { Promise<City?> }
 */
async function getCity(districtId) {
    const district = await DistrictRepository.findByDistrictId(districtId);

    if (district == null)
        return null;

    const city = await CityRepository.findByCityId(district.cityId);
    return city; 
}

module.exports = {
    add, updateInfo, remove,
    findAll, findAllByQuery, findAllByCityId, findByPostalCode, findByDistrictId,
    getCity,
    doesDistrictExist
}