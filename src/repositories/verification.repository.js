const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Verification = require("../models/verification.model");

// ===================== READ QUERY ============================

/**
 * Show all of the verification records in the database
 * @returns { Promise<Array<Verification>> }
 */
async function findAll(){
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Verification`
        );

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Verification);
    return dataResults || [];
}

/**
 * Show all of the verification records that matched with the given status
 * @param { typeof Verification.prototype.status } status 
 * @returns { Promise<Array<Verification>> }
 */
async function findAllByStatus(status){
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Verification WHERE status = ?`,
            status
        );
    
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Verification);
    return dataResults || [];
}

/**
 * Show a single verification record in the database that matched with the given verification id
 * @param { typeof Verification.prototype.id } id 
 * @returns { Promise<Array<Verification>> }
 */
async function findByVerificationId(id){
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Verification WHERE id = ?`,
            id
        );

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Verification);
    return dataResults?.at(0) || null;
}

/**
 * Show all of the verification records that matched with the given submission id
 * @param { typeof Verification.prototype.submissionId } submissionId 
 * @returns { Promise<Verification?> }
 */
async function findBySubmissionId(submissionId) {
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Verification WHERE submissionId = ?`,
            submissionId
        );

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Verification);
    return dataResults?.at(0) || null;
}

/**
 * Show all of verification records that matched with the given verifier id
 * @param { typeof Verification.prototype.verifierId } verifierId 
 * @returns { Promise<Verification?> }
 */
async function findByVerifierId(verifierId) {
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Verification WHERE verifierId = ?`,
            verifierId
        );

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Verification);
    return dataResults?.at(0) || null;
}

/**
 * Get the status attribute from the targeted verification
 * @param { typeof Verification.prototype.id } id 
 * @returns { Promise<typeof Verification.prototype.status> } 
 */
async function getStatus(id) {
    const queryResult = 
        await Database.doQuery(
            `SELECT status FROM Verification WHERE id = ? LIMIT 1`,
            id
        );

    return queryResult.rows?.at(0)?.status;
}

/**
 * Get the time attribute from the targeted verification
 * @param { typeof Verification.prototype.id } id 
 * @returns { Promise<typeof Verification.prototype.time> } 
 */
async function getTime(id) {
    const queryResult = 
        await Database.doQuery(
            `SELECT time FROM Verification WHERE id = ? LIMIT 1`,
            id
        );

    return queryResult.rows?.at(0)?.time;
}

/**
 * Get the reason attribute from the targeted verification 
 * @param { typeof Verification.prototype.id } id 
 * @returns { Promise<typeof Verification.prototype.reason> } 
 */
async function getReason(id) {
    const queryResult = 
        await Database.doQuery(
            `SELECT reason FROM Verification WHERE id = ? LIMIT 1`,
            id
        );

    return queryResult.rows?.at(0)?.reason;
}

// ===================== CREATE QUERY ============================

/**
 * Insert a brand new verification record
 * @param { typeof Verification.prototype.status } status 
 * @param { typeof Verification.prototype.time } time 
 * @param { typeof Verification.prototype.reason } reason 
 * @param { typeof Verification.prototype.submissionId } submissionId 
 * @param { typeof Verification.prototype.verifierId } verifierId 
 * @returns { typeof Promise<typeof Verification.prototype.id> } newVerificationId
 */
async function add(status, time, reason, submissionId, verifierId) {
    const queryResult = 
        await Database.doQuery(`
                INSERT INTO Verification (status, time, reason, submissionId, verifierId)
                VALUES(?, ?, ?, ?, ?)
            `, [status, time, reason, submissionId, verifierId]
        );

    return queryResult.insertId;
}

// ===================== UPDATE QUERY ============================

/**
 * Update status of verification record using the given verification id
 * @param { typeof Verification.prototype.id } id 
 * @param { typeof Verification.prototype.status } status 
 * @returns { Promise<Boolean> }
 */
async function updateVerificationStatus(id, status) {
    const queryResult = 
        await Database.doQuery(`
            UPDATE Verification
            SET
                status = ?
            WHERE
                id = ?    
        `, [status, id]
        );

    return queryResult.isSuccess;
}

// ===================== DELETE QUERY ============================
/**
 * Delete verification record using the given verification id
 * @param { typeof Verification.prototype.id } id 
 * @returns { Promise<Boolean> }
 */
async function removeVerification(id) {
    const queryResult = 
        await Database.doQuery(`
            DELETE FROM Verification
            WHERE id = ?
        `, id);
    
    return queryResult.isSuccess;
}

module.exports = {
    findAll, findAllByStatus, findByVerificationId, findBySubmissionId, findByVerifierId,
    getStatus, getTime, getReason, 
    add, 
    updateVerificationStatus, 
    removeVerification
};