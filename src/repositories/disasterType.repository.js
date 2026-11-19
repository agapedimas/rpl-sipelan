const Database = require("../database");
const DisasterType = require("../models/disasterType.model");
const SqlUtil = require("../utils/sql.util");

/**
 * @returns {Promise<Array<DisasterType>>}
 */
async function findAll() {
    const queryResult = await Database.doQuery(
        "SELECT * FROM DisasterType"
    );

    const dataResults = SqlUtil.convertRowToClass(
        queryResult.rows,
        DisasterType
    );

    return dataResults || [];
}

/**
 * @returns { Promise<Array<DisasterType>> }
 */
async function findAllActive() {
    const queryResult = await Database.doQuery(
        "SELECT * FROM DisasterType WHERE isActive = TRUE"
    );

    const dataResults = SqlUtil.convertRowToClass(
        queryResult.rows,
        DisasterType
    );

    return dataResults || [];
}

/**
 * @param { typeof DisasterType.prototype.id } disasterTypeId
 * @returns { Promise<DisasterType?> }
 */
async function findByDisasterTypeId(disasterTypeId) {
    const queryResult = await Database.doQuery(
        "SELECT * FROM DisasterType WHERE id = ? LIMIT 1",
        disasterTypeId
    );

    const dataResults = SqlUtil.convertRowToClass(
        queryResult.rows,
        DisasterType
    );

    return dataResults?.at(0) || null;
}

/**
 * @param { typeof DisasterType.prototype.name } name
 * @returns { Promise<typeof DisasterType.prototype.id> }
 */
async function add(name) {
    const queryResult = await Database.doQuery(
    `INSERT INTO DisasterType
    (name)
    VALUES(?)`,name);

    return queryResult.insertId;
}

/**
 * @param { typeof DisasterType.prototype.id } disasterTypeId
 * @param { typeof DisasterType.prototype.isActive } isActive
 * @returns { Promise<boolean> }
 */
async function updateActiveState(disasterTypeId, isActive = false) {
    const queryResult = await Database.doQuery(
    `UPDATE DisasterType
    SET
        isActive = ?
    WHERE
        id = ?`,
    [isActive, disasterTypeId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof DisasterType.prototype.id } disasterTypeId
 * @returns { Promise<boolean> }
 */
async function remove(disasterTypeId) {
    const queryResult = await Database.doQuery(
    `DELETE FROM DisasterType
    WHERE
        id = ?`,disasterTypeId);

    return queryResult.isSuccess;
}

module.exports = {
    findAll,
    findAllActive,
    findByDisasterTypeId,
    add,
    updateActiveState,
    remove
};