const Database = require("../database");
const Submission = require("../models/submission.model");

/**
 * @param { import("mysql2").RowDataPacket } row
 * @returns { Submission }
 */
function convertRowToSubmission(row) {
    return new Submission(
        row.id, row.description, Number(row.time), row.picture,
        Boolean(row.isArchived), row.districtId, row.citizenId, row.disasterTypeId);
}

/**
 * @param { typeof Submission.prototype.citizenId } citizenId
 * @returns { Promise<Array<Submission>> }
 */
async function findAllByCitizenId(citizenId) {
    const queryResult = await Database.doQuery(
        "SELECT * FROM Submission WHERE citizenId = ? ORDER BY time DESC",
        citizenId);

    const dataResults = queryResult.rows?.map(row => convertRowToSubmission(row));

    return dataResults || [];
}

/**
 * @param { typeof Submission.prototype.districtId } districtId
 * @returns { Promise<Array<Submission>> }
 */
async function findAllByDistrictId(districtId) {
    const queryResult = await Database.doQuery(
        "SELECT * FROM Submission WHERE districtId = ? ORDER BY time DESC",
        districtId);

    const dataResults = queryResult.rows?.map(row => convertRowToSubmission(row));

    return dataResults || [];
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @returns { Promise<Submission?> }
 */
async function findBySubmissionId(submissionId) {
    const queryResult = await Database.doQuery(
        "SELECT * FROM Submission WHERE id = ? LIMIT 1",
        submissionId);

    const dataResults = queryResult.rows?.map(row =>
        convertRowToSubmission(row)
    );

    return dataResults?.at(0) || null;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @returns { Promise<typeof Submission.prototype.picture> }
 */
async function getPicture(submissionId) {
    const queryResult = await Database.doQuery(
        "SELECT picture FROM Submission WHERE id = ? LIMIT 1",
        submissionId);

    return queryResult.rows?.at(0)?.picture ?? null;
}

/**
 * @param { typeof Submission.prototype.description } description
 * @param { typeof Submission.prototype.time } time
 * @param { typeof Submission.prototype.picture } pictureBuffer
 * @param { typeof Submission.prototype.districtId } districtId
 * @param { typeof Submission.prototype.citizenId } citizenId
 * @param { typeof Submission.prototype.disasterTypeId } disasterTypeId
 * @returns { Promise<typeof Submission.prototype.id> }
 */
async function add(description, time, pictureBuffer, districtId, citizenId, disasterTypeId) {
    const queryResult = await Database.doQuery(
        `
        INSERT INTO Submission
                (description, time, picture, districtId, citizenId, disasterTypeId)
            VALUES
                (?, ?, ?, ?, ?, ?)
        `,
        [description, time, pictureBuffer, districtId, citizenId, disasterTypeId]);

    return queryResult.insertId;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @param { typeof Submission.prototype.description? } description
 * @param { typeof Submission.prototype.districtId? } districtId
 * @param { typeof Submission.prototype.disasterTypeId? } disasterTypeId
 * @returns { Promise<boolean> }
 */
async function updateInfo(submissionId, description, districtId, disasterTypeId) {
    const queryResult = await Database.doQuery(
        `
        UPDATE Submission
        SET
            description = COALESCE(?, description),
            districtId = COALESCE(?, districtId),
            disasterTypeId = COALESCE(?, disasterTypeId)
        WHERE
            id = ?
        `, [description, districtId, disasterTypeId, submissionId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @param { typeof Submission.prototype.picture } pictureBuffer
 * @returns { Promise<boolean> }
 */
async function updatePicture(submissionId, pictureBuffer) {
    const queryResult = await Database.doQuery(
        `
        UPDATE Submission
        SET
            picture = ?
        WHERE
            id = ?
        `, [pictureBuffer, submissionId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @param { typeof Submission.prototype.isArchived } isArchived
 * @returns { Promise<boolean> }
 */
async function updateArchivedState(submissionId, isArchived = true) {
    const queryResult = await Database.doQuery(
        `
        UPDATE Submission
        SET
            isArchived = ?
        WHERE
            id = ?
        `, [isArchived, submissionId]);

    return queryResult.isSuccess;
}

module.exports = {
    findAllByCitizenId,
    findAllByDistrictId,
    findBySubmissionId,
    getPicture,
    add,
    updateInfo,
    updatePicture,
    updateArchivedState
};
