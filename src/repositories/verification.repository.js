const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Verification = require("../models/verification.model");

// ===================== READ QUERIES ============================

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
 * @returns { Promise<typeof Array<Verification>> }
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
 * Show all of the verification records that matched with the given submission id
 * @param { typeof Verification.prototype.submissionId } submissionId 
 * @returns { Promise<typeof Array<Verification>> }
 */
async function findAllBySubmissionId(submissionId) {
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Verification WHERE submissionId = ?`,
            submissionId
        );

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Verification);
    return dataResults || [];
}

/**
 * Show all of verification records that matched with the given verifier id
 * @param { typeof Verification.prototype.verifierId } verifierId 
 * @returns { Promise<typeof Array<Verification>> }
 */
async function findAllByVerifierId(verifierId) {
    const queryResult = 
        await Database.doQuery(
            `SELECT * FROM Verification WHERE verifierId = ?`,
            verifierId
        );

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Verification);
    return dataResults || [];
}

/**
 * Show a single verification record in the database that matched with the given verification id
 * @param { typeof Verification.prototype.id } id 
 * @returns { Promise<typeof Verification?> }
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

// ===================== CREATE QUERY ============================

/**
 * Insert a brand new verification record
 * @param { typeof Verification.prototype.status } status 
 * @param { typeof Verification.prototype.time } time 
 * @param { typeof Verification.prototype.reason } reason 
 * @param { typeof Verification.prototype.submissionId } submissionId 
 * @param { typeof Verification.prototype.verifierId } verifierId 
 * @returns { Promise<typeof Verification.prototype.id> }
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

module.exports = {
    findAll, findAllByStatus, findAllBySubmissionId, findAllByVerifierId,
    findByVerificationId,
    add
};