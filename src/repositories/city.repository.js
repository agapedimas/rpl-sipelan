const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Province = require("../models/province.model");
const City = require("../models/city.model");

/**
 * @returns { Promise<Array<City>> }
 */
async function findAll() {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM City"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, City);
    return dataResults || [];
}

/**
 * @param { string } query
 * @returns { Promise<Array<City>> }
 */
async function findAllByQuery(query) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM City WHERE name LIKE ?", 
            "%" + query + "%"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, City);
    return dataResults || [];
}

/**
 * @param { typeof Province.prototype.id } provinceId
 * @returns { Promise<City?> }
 */
async function findAllByProvinceId(provinceId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM City WHERE provinceId = ?", 
            provinceId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, City);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof City.prototype.id } cityId
 * @returns { Promise<City?> }
 */
async function findByCityId(cityId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM City WHERE id = ? LIMIT 1", 
            cityId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, City);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof City.prototype.phone } name
 * @param { typeof Province.prototype.id } provinceId
 * @returns { Promise<typeof City.prototype.id> } City id
*/
async function add(name, provinceId) {
    const queryResult = 
        await Database.doQuery(`
            INSERT INTO City 
                (name, provinceId)
            VALUES 
                (?, ?)
        `, [name, provinceId]);
    return queryResult.insertId;
}

/**
 * @param { typeof City.prototype.id } cityId 
 * @param { typeof City.prototype.name } name 
 * @param { typeof Province.prototype.id } provinceId
 * @returns { Promise<boolean> } Result of execution
 */
async function updateInfo(cityId, name, provinceId) {
    const queryResult =
        await Database.doQuery(`
            UPDATE City
            SET
                name = COALESCE(?, name),
                provinceId = COALESCE(?, provinceId)
            WHERE
                id = ?
        `, 
        [name, provinceId, cityId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof City.prototype.id } cityId 
 * @returns { Promise<boolean> }
 */
async function remove(cityId) {
    const queryResult =
        await Database.doQuery(`
            DELETE FROM City
            WHERE
                id = ?
        `, 
        cityId);

    return queryResult.isSuccess;
}

module.exports = {
    findAll, findAllByQuery, findAllByProvinceId, findByCityId,
    add, 
    updateInfo,
    remove
};