const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const District = require("../models/district.model");
const Domicile = require("../models/domicile.model");

/**
 * @returns { Promise<Array<Domicile>> }
 */
async function findAll() {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM Domicile"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Domicile);
    return dataResults || [];
}

/**
 * @param { typeof District.prototype.id } districtId
 * @returns { Promise<Domicile?> }
 */
async function findByDistrictId(districtId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM Domicile WHERE districtId = ? LIMIT 1", 
            districtId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Domicile);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof City.prototype.id } cityId
 * @returns { Promise<Array<Domicile>> }
 */
async function findAllByCityId(cityId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM Domicile WHERE cityId = ?", 
            cityId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Domicile);
    return dataResults || [];
}

module.exports = {
    findAll, 
    findByDistrictId,
    findAllByCityId
};