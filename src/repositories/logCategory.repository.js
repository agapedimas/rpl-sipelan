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
async function findById(logCategoryId) {
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
 * @param { number } categoryId
 * @param { string? } name
 * @param { string? } type
 * @param { string? } unit
 * @returns { Promise<boolean> } Result of execution
 */
async function updateInfo(categoryId, name, type, unit) {
    const queryResult = await Database.doQuery(`
        UPDATE LogCategory
        SET
            name = COALESCE(?, name),
            type = COALESCE(?, type),
            unit = COALESCE(?, unit)
        WHERE id = ?
    `, [name, type, unit, categoryId]);
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
    findAll, findById, 
    add, 
    updateInfo,
    remove
}