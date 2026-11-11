const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Log = require("../models/log.model");

/**
 * @returns { Promise<Array<Log>> }
 */
async function findAll() {
    const queryResult = 
        await Database.doQuery(`
            SELECT * FROM Log 
            ORDER BY time DESC`
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Log);
    return dataResults || [];
}

/**
 * @param { typeof Log.prototype.id } logId
 * @returns { Promise<Log?> }
 */
async function findByLogId(logId) {
    const queryResult = 
        await Database.doQuery(`
            SELECT * FROM Log WHERE id = ?`,
            logId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Log);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof Log.prototype.reporterId } reporterId
 * @returns { Promise<Log?> }
 */
async function findAllByReporterId(reporterId) {
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Log WHERE reporterId = ?
            ORDER BY time DESC`,
            reporterId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Log);
    return dataResults || [];
}

/**
 * @param { typeof Log.prototype.logCategoryId } logCategoryId
 * @returns { Promise<Log?> }
 */
async function findAllByLogCategoryId(logCategoryId) {
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Log WHERE logCategoryId = ?
            ORDER BY time DESC`,
            logCategoryId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Log);
    return dataResults || [];
}

/**
 * @param { typeof Log.prototype.reportId } reportId
 * @returns { Promise<Log?> }
 */
async function findAllByReportId(reportId) {
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Log WHERE reporterId = ?
            ORDER BY time DESC`,
            reportId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Log);
    return dataResults || [];
}

/**
 * @param { typeof Log.prototype.id } logId
 * @returns { Promise<typeof Log.prototype.picture?> } pictureBuffer
 */
async function getPicture(logId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT picture FROM Log WHERE id = ?",
            logId
        );
    return queryResult.rows?.at(0)?.picture;
}

/**
 * @param { typeof Log.prototype.value } value
 * @param { typeof Log.prototype.time } time
 * @param { typeof Log.prototype.picture? } picture
 * @param { typeof Log.prototype.reporterId } reporterId
 * @param { typeof Log.prototype.logCategoryId } logCategoryId
 * @param { typeof Log.prototype.reportId } reportId
 * @returns { Promise<typeof Log.prototype.id> } Log id
 */
async function add(value, time, picture, reporterId, logCategoryId, reportId) {
    const queryResult = 
        await Database.doQuery(`
            INSERT INTO Log 
                (value, time, picture, reporterId, logCategoryId, reportId)
            VALUES 
                (?, ?, ?, ?, ?, ?)
        `, 
        [value, time, picture, reporterId, logCategoryId, reportId]);
    return queryResult.insertId;
}

/**
 * @param { typeof Log.prototype.id } logId 
 * @param { typeof Log.prototype.value? } value 
 * @param { typeof Log.prototype.time? } time 
 * @param { typeof Log.prototype.logCategoryId? } logCategoryId
 * @returns { Promise<boolean> } Result of execution
 */
async function updateInfo(logId, value, time, logCategoryId) {
    const queryResult =
        await Database.doQuery(`
            UPDATE Log
            SET
                value = COALESCE(?, value),
                time = COALESCE(?, time),
                logCategoryId = COALESCE(?, logCategoryId)
            WHERE
                id = ?
        `, 
        [value, time, logCategoryId, logId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Log.prototype.id } logId 
 * @param { typeof Log.prototype.picture? } pictureBuffer
 * @returns { Promise<boolean> } Result of execution
 */
async function updatePicture(logId, pictureBuffer) {
    const queryResult =
        await Database.doQuery(`
            UPDATE Log
            SET
                picture = ? 
            WHERE
                id = ?
        `, 
        [pictureBuffer, logId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Log.prototype.id } logId 
 * @returns { Promise<boolean> }
 */
async function remove(logId) {
    const queryResult =
        await Database.doQuery(`
            DELETE FROM Log
            WHERE
                id = ?
        `, 
        logId);

    return queryResult.isSuccess;
}

module.exports = {
    findAll, findAllByReporterId, findAllByLogCategoryId, findAllByReportId, findByLogId,
    getPicture,
    add,
    updateInfo, updatePicture,
    remove
}