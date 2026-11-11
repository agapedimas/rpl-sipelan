const LogCategoryRepository = require("../repositories/logCategory.repository");
const LogCategory = require("../models/logCategory.model");

const ALLOWED_TYPES = ["string", "number", "boolean"];

/**
 * @param { typeof LogCategory.prototype.type } type 
 * @returns { typeof ALLOWED_TYPES }
 */
function isValidType(type) {
    return ALLOWED_TYPES.includes(type);
}

/**
 * @returns { Promise<Array<LogCategory>> }
 */
async function findAll() {
    return await LogCategoryRepository.findAll();
}

/**
 * @param { typeof LogCategory.prototype.categoryId } categoryId
 * @returns { Promise<LogCategory> }
 */
async function findById(categoryId) {
    return await LogCategoryRepository.findById(categoryId);
}

/**
 * @param { typeof LogCategory.prototype.name } name
 * @param { typeof LogCategory.prototype.type } type
 * @param { typeof LogCategory.prototype.unit } unit
 * @returns { typeof LogCategory.prototype.id } 
 */
async function add(name, type, unit) {
    if (!isValidType(type)) {
        throw new Error(`Invalid log category type. Allowed types: ${ALLOWED_TYPES.join(", ")}`);
    }
    return await LogCategoryRepository.add(name, type, unit);
}

/**
 * @param { typeof LogCategory.prototype.categoryId } categoryId
 * @param {{ 
 *      name: LogCategory.prototype.name, 
 *      type: LogCategory.prototype.type, 
 *      unit: LogCategory.prototype.unit 
 * }} updatedInfo
 * @returns { Promise<boolean> }
 */
async function updateInfo(categoryId, updatedInfo) {
    if (updatedInfo.type && !isValidType(updatedInfo.type)) {
        throw new Error(`Invalid log category type. Allowed types: ${ALLOWED_TYPES.join(", ")}`);
    }

    const isSuccess = await LogCategoryRepository.updateInfo(
        categoryId,
        updatedInfo.name,
        updatedInfo.type,
        updatedInfo.unit
    );

    return isSuccess
}

/**
 * @param { number } categoryId
 * @returns { Promise<boolean> }
 */
async function remove(categoryId) {
    return await LogCategoryRepository.remove(categoryId);
}

module.exports = {
    findAll, findById,
    add,
    updateInfo,
    remove,
    isValidType
};