const ProvinceRepository = require("../repositories/province.repository");
const CityRepository = require("../repositories/city.repository");

const Province = require("../models/province.model");
const City = require("../models/city.model");

/**
 * @param { typeof City.prototype.name } name 
 * @param { typeof Province.prototype.id } provinceId 
 * @returns { Promise<typeof City.prototype.id> }
 */
async function add(name, provinceId) {
    const cityId = await CityRepository.add(name, provinceId);
    return cityId;
}

/**
 * @param { typeof City.prototype.id } cityId 
 * @param {{
 *      name: typeof City.prototype.name,
 *      provinceId: typeof Province.prototype.id
 * }} updatedInfo
 * @returns { Promise<boolean> }
 */
async function updateInfo(cityId, updatedInfo) {
    const isSuccess = 
        await CityRepository.updateInfo(
            cityId, 
            updatedInfo.name,
            updatedInfo.provinceId);
    return isSuccess;
}

/**
 * @param { typeof City.prototype.id } cityId 
 * @returns { Promise<boolean> }
 */
async function remove(cityId) {
    const isSuccess = await CityRepository.remove(cityId);
    return isSuccess;
}

/**
 * @returns { Promise<Array<City>> }
 */
async function findAll() {
    const cities = await CityRepository.findAll();
    return cities;
}

/**
 * @param { string } query 
 * @returns { Promise<Array<City>> }
 */
async function findAllByQuery(query) {
    // Prevent SQL execution if query is empty
    if (!query)
        return [];
    query = query.trim();

    const cities = await CityRepository.findAllByQuery(query);
    return cities;
}

/**
 * @param { typeof Province.prototype.id } provinceId 
 * @returns { Promise<Array<City>> }
 */
async function findAllByProvinceId(provinceId) {
    const cities = await CityRepository.findAllByProvinceId(provinceId);
    return cities;
}

/**
 * @param { typeof City.prototype.id } cityId 
 * @returns { Promise<City?> }
 */
async function findByCityId(cityId) {
    const city = await CityRepository.findByCityId(cityId);
    return city;
}

/**
 * @param { typeof City.prototype.id } cityId
 * @returns { Promise<boolean> }
 */
async function doesCityExist(cityId) {
    const city = await CityRepository.findByCityId(cityId);
    return city != null;
}

/**
 * @param { typeof City.prototype.id } cityId
 * @returns { Promise<Province?> }
 */
async function getProvince(cityId) {
    const city = await CityRepository.findByCityId(cityId);

    if (city == null)
        return null;

    const province = await ProvinceRepository.findByProvinceId(city.provinceId);
    return province; 
}

module.exports = {
    add, updateInfo, remove,
    findAll, findAllByQuery, findAllByProvinceId, findByCityId,
    getProvince,
    doesCityExist
}