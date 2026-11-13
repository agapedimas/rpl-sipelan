const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Province = require("../models/province.model");

/**
 * @returns { Promise<Array<Province>> }
 */
async function findAll() {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM Province"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Province);
    return dataResults || [];
}

/**
 * @param { string } query
 * @returns { Promise<Array<Province>> }
 */
async function findAllByQuery(query) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM Province WHERE name LIKE ?", 
            "%" + query + "%"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Province);
    return dataResults || [];
}

/**
 * @param { typeof Province.prototype.id } provinceId
 * @returns { Promise<Province?> }
 */
async function findByProvinceId(provinceId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM Province WHERE id = ? LIMIT 1", 
            provinceId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Province);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof Province.prototype.phone } name
 * @returns { Promise<typeof Province.prototype.id> } Province id
 */
async function add(name) {
    const queryResult = 
        await Database.doQuery(`
            INSERT INTO Province 
                (name)
            VALUES 
                (?)
        `, name);
    return queryResult.insertId;
}

/**
 * @param { typeof Province.prototype.id } provinceId 
 * @param { typeof Province.prototype.name } name 
 * @returns { Promise<boolean> } Result of execution
 */
async function updateInfo(provinceId, name) {
    const queryResult =
        await Database.doQuery(`
            UPDATE Province
            SET
                name = COALESCE(?, name)
            WHERE
                id = ?
        `, 
        [name, provinceId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Province.prototype.id } provinceId 
 * @returns { Promise<boolean> }
 */
async function remove(provinceId) {
    const queryResult =
        await Database.doQuery(`
            DELETE FROM Province
            WHERE
                id = ?
        `, 
        provinceId);

    return queryResult.isSuccess;
}

module.exports = {
    findAll, findAllByQuery, findByProvinceId,
    add, 
    updateInfo,
    remove
};