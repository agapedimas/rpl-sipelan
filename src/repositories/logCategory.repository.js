const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const LogCategory = require("../models/logCategory.model")

/**
 * @returns { Promise<Array<LogCategory>> }
 */
async function findAll() {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM LogCategory"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, LogCategory);
    return dataResults || [];
}

/**
 * @param { typeof LogCategory.prototype.id } logCategoryId 
 * @returns { Promise<LogCategory?> }
 */
async function findByLogCategoryId(logCategoryId) {
    const queryResult =
        await Database.doQuery(
            "SELECT * FROM LogCategory WHERE id = ?",
            logCategoryId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult, LogCategory);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof LogCategory.prototype.name } name 
 * @param { typeof LogCategory.prototype.type } type 
 * @param { typeof LogCategory.prototype.unit } unit
 * @returns { Promise<typeof LogCategory.prototype.id> } LogCategory id
 */
async function add(name, type, unit) {
    const queryResult =
        await Database.doQuery(`
            INSERT INTO LogCategory
                (name, type, unit)
            VALUES
                (?, ?, ?)
        `,
        [name, type, unit]);
    return queryResult.insertId;
}

/**
 * @param { typeof LogCategory.prototype.id } logCategoryId 
 * @param { typeof LogCategory.prototype.name } name 
 * @returns { Promise<boolean> } Result of execution
 */
async function updateName(logCategoryId, name) {
    const queryResult =
        await Database.doQuery(`
            UPDATE LogCategory
            SET
                name = COALESCE(?, name)
            WHERE
                id = ?
        `,
        [name, logCategoryId]);
    return queryResult.isSuccess;
}

/**
 * @param { typeof LogCategory.prototype.id } logCategoryId 
 * @param { typeof LogCategory.prototype.type } type
 * @returns { Promise<boolean> } Result of execution
 */
async function updateType(logCategoryId, type) {
    const queryResult =
        await Database.doQuery(`
            UPDATE LogCategory
            SET
                type = COALESCE(?, type)
            WHERE
                id = ?
        `,
        [type, logCategoryId]);
    return queryResult.isSuccess;
}

/**
 * @param { typeof LogCategory.prototype.id } logCategoryId 
 * @param { typeof LogCategory.prototype.unit } unit
 * @returns { Promise<boolean> } Result of execution
 */
async function updateUnit(logCategoryId, unit) {
    const queryResult =
        await Database.doQuery(`
            UPDATE LogCategory
            SET
                unit = COALESCE(?, unit)
            WHERE
                id = ?
        `,
        [unit, logCategoryId]);
    return queryResult.isSuccess;
}

/**
 * @param { typeof LogCategory.prototype.id } logCategoryId
 * @returns { Promise<boolean> } Result of execution
 */
async function remove(logCategoryId) {
    const queryResult =
        await Database.doQuery(`
            DELETE FROM LogCategory
            WHERE
                id = ?
        `,
        logCategoryId);
    return queryResult.isSuccess;
}

module.exports = {
    findAll, findByLogCategoryId, 
    add, 
    updateName, updateType, updateUnit, 
    remove
}