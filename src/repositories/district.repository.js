const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const City = require("../models/city.model");
const District = require("../models/district.model");

/**
 * @returns { Promise<Array<District>> }
 */
async function findAll() {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM District"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, District);
    return dataResults || [];
}

/**
 * @param { string } query
 * @returns { Promise<Array<District>> }
 */
async function findAllByQuery(query) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM District WHERE name LIKE ?", 
            "%" + query + "%"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, District);
    return dataResults || [];
}

/**
 * @param { typeof District.prototype.id } districtId
 * @returns { Promise<District?> }
 */
async function findByDistrictId(districtId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM District WHERE id = ? LIMIT 1", 
            districtId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, District);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof District.prototype.postalCode } postalCode
 * @returns { Promise<District?> }
 */
async function findByPostalCode(postalCode) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM District WHERE postalCode = ? LIMIT 1", 
            postalCode
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, District);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof City.prototype.id } cityId
 * @returns { Promise<Array<District?>> }
 */
async function findAllByCityId(cityId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM District WHERE cityId = ?", 
            cityId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, District);
    return dataResults || [];
}

/**
 * @param { typeof District.prototype.name } name
 * @param { typeof District.prototype.postalCode } postalCode
 * @param { typeof District.prototype.cityId } cityId
 * @returns { Promise<typeof District.prototype.id> } District id
 */
async function add(name, postalCode, cityId) {
    const queryResult = 
        await Database.doQuery(`
            INSERT INTO District 
                (name, postalCode, cityId)
            VALUES 
                (?, ?, ?)
        `, [name, postalCode, cityId]);
    return queryResult.insertId;
}

/**
 * @param { typeof District.prototype.id } districtId 
 * @param { typeof District.prototype.name } name 
 * @param { typeof District.prototype.postalCode } postalCode
 * @param { typeof District.prototype.cityId } cityId
 * @returns { Promise<boolean> } Result of execution
 */
async function updateInfo(districtId, name, postalCode, cityId) {
    const queryResult =
        await Database.doQuery(`
            UPDATE District
            SET
                name = COALESCE(?, name),
                postalCode = COALESCE(?, postalCode),
                cityId = COALESCE(?, cityId)
            WHERE
                id = ?
        `, 
        [name, postalCode, cityId, districtId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof District.prototype.id } districtId 
 * @returns { Promise<boolean> }
 */
async function remove(districtId) {
    const queryResult =
        await Database.doQuery(`
            DELETE FROM District
            WHERE
                id = ?
        `, 
        districtId);

    return queryResult.isSuccess;
}

module.exports = {
    findAll, findAllByQuery, findAllByCityId, findByDistrictId, findByPostalCode,
    add, 
    updateInfo,
    remove
};