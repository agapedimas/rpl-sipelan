const ProvinceRepository = require("../repositories/province.repository");

const Province = require("../models/province.model");

/**
 * @param { typeof Province.prototype.name } name 
 * @returns { Promise<typeof Province.prototype.id> }
 */
async function add(name) {
    const provinceId = await ProvinceRepository.add(name);
    return provinceId;
}

/**
 * @param { typeof Province.prototype.id } provinceId 
 * @param {{
 *      name: typeof Province.prototype.name
 * }} updatedInfo
 * @returns { Promise<boolean> }
 */
async function updateInfo(provinceId, updatedInfo) {
    const isSuccess = await ProvinceRepository.updateInfo(provinceId, updatedInfo.name);
    return isSuccess;
}

/**
 * @param { typeof Province.prototype.id } provinceId 
 * @returns { Promise<boolean> }
 */
async function remove(provinceId) {
    const isSuccess = await ProvinceRepository.remove(provinceId);
    return isSuccess;
}

/**
 * @returns { Promise<Array<Province>> }
 */
async function findAll() {
    const provinces = await ProvinceRepository.findAll();
    return provinces;
}

/**
 * @param { string } query 
 * @returns { Promise<Array<Province>> }
 */
async function findAllByQuery(query) {
    // Prevent SQL execution if query is empty
    if (!query)
        return [];
    query = query.trim();

    const provinces = await ProvinceRepository.findAllByQuery(query);
    return provinces;
}

/**
 * @param { typeof Province.prototype.id } provinceId 
 * @returns { Promise<Province?> }
 */
async function findByProvinceId(provinceId) {
    const province = await ProvinceRepository.findByProvinceId(provinceId);
    return province;
}

/**
 * @param { typeof Province.prototype.id } provinceId 
 * @returns { Promise<boolean> }
 */
async function doesProvinceExist(provinceId) {
    const province = await ProvinceRepository.findByProvinceId(provinceId);
    return province != null;
}

module.exports = {
    add, updateInfo, remove,
    findAll, findAllByQuery, findByProvinceId,
    doesProvinceExist
}