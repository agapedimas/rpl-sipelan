const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Report = require("../models/report.model");

// ===================== READ QUERIES ============================

/**
 * Show all the report records in the database
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAll(districtId){
    const queryResult = 
        await Database.doQuery(`
            SELECT * FROM ReportView WHERE districtId = ?
        `, districtId); 
    
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Report);
    return dataResults || [];
}

/**
 * Show all report records in the database that matched with the given status
 * @param { typeof Report.prototype.status } status 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByStatus(status, districtId) {
    const queryResult = 
        await Database.doQuery(`
            SELECT * 
            FROM ReportView 
            WHERE 
                status = ? AND districtId = ?
            `, [status, districtId]);

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Report);
    return dataResults || [];
}

/**
 * Show all report records in the database that matched with the given disaster type id
 * @param { typeof Report.prototype.disasterTypeId } disasterTypeId 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByDisasterTypeId(disasterTypeId, districtId) {
    const queryResult = 
        await Database.doQuery(`
            SELECT * FROM ReportView 
            WHERE 
                disasterTypeId = ? AND districtId = ?
        `, [disasterTypeId, districtId]);

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Report);
    return dataResults || [];
}

/**
 * Show all report records in the database that matched with the given is archived status
 * @param { typeof Report.prototype.isArchived } isArchived 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByIsArchivedStatus(isArchived, districtId) {
    const queryResult = 
        await Database.doQuery(`
            SELECT * 
            FROM ReportView
            WHERE 
                isArchived = ? AND districtId = ?   
        `, [isArchived, districtId]);

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Report);
    return dataResults || [];
}

/**
 * Show all report records in the database that matched with the given is time
 * @param { typeof Report.prototype.time } time 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByTime(time, districtId){
    const queryResult = 
        await Database.doQuery(`
            SELECT * 
            FROM ReportView 
            WHERE 
                time = ? AND districtId = ?
        `, [time, districtId]);
    
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Report);
    return dataResults || [];
}

/**
 * Show a single report record in the database that matched with the given report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Report?> }
 */
async function findByReportId(id, districtId) {    
    const queryResult = 
        await Database.doQuery(`
            SELECT * FROM ReportView 
            WHERE 
                id = ? AND districtId = ?
            LIMIT 1
        `, [id, districtId]);

    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Report);

    return dataResults?.at(0) || null;
}

// ===================== CREATE QUERIES ============================

/**
 * Insert a brand new Report record
 * @param { typeof Report.prototype.isArchived } isArchived 
 * @param { typeof Report.prototype.status } status 
 * @param { typeof Report.prototype.description } description 
 * @param { typeof Report.prototype.time } time 
 * @param { typeof Report.prototype.disasterTypeId } disasterTypeId 
 * @param { typeof Array<Submission> } submissionArray 
 * @returns { Promise<typeof Report.prototype.id> }
 */
async function add(status, description, time, disasterTypeId, submissionArray) {
    const queryResult = 
        await Database.doQuery(`
            INSERT INTO Report(isArchived, status, description, time, disasterTypeId)
            VALUES(FALSE, ?, ?, ?, ?)
            `, [status, description, time, disasterTypeId]);
    
    const reportId = queryResult.insertId;

    if(!reportId) return null; 

    await addPartOfReport(reportId, submissionArray);
    
    return reportId;
}

/**
 * 
 * @param {typeof Report.prototype.id} reportId 
 * @param {typeof Array<Submission>} submissionArray 
 */
async function addPartOfReport(reportId, submissionArray) {
    // populate partOfReport
    for(const submissionId of submissionArray){
        console.log("submss: " + submissionId);
        
        const qs = await Database.doQuery(`
            INSERT INTO partOfReport(reportId, submissionId)
            VALUES(?, ?)    
        `, [reportId, submissionId]);

        console.log("inserted id " + qs.insertId);
    }
}

// ===================== UPDATE QUERIES ============================
/**
 * Update isArchive status by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.isArchived } isArchived 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Boolean> }
 */
async function updateIsArchived(id, isArchived, districtId) {
    const existing = await findByReportId(id, districtId);

    if(!existing){
        return false;
    }

    const queryResult = 
        await Database.doQuery(`
            UPDATE Report
            SET
                isArchived = ?
            WHERE
                id = ?
        `, [isArchived, id]);

    return queryResult?.isSuccess;
}

/**
 * Update report status by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.status } status 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Boolean> }
 */
async function updateStatus(id, status, districtId) {
    const existing = await findByReportId(id, districtId);

    if(!existing){
        return false;
    }

    const queryResult = 
        await Database.doQuery(`
            UPDATE Report
            SET
                status = ?
            WHERE 
                id = ?
        `, [status, id]);
    
    return queryResult.isSuccess;
}

/**
 * Update description by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.description } description 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Boolean> }
 */
async function updateDescription(id, description, districtId) {
    const existing = await findByReportId(id, districtId);

    if(!existing){
        return false;
    }

    const queryResult = 
        await Database.doQuery(`
            UPDATE Report
            SET
                description = ?
            WHERE
                id = ?
        `, [description, id]);

    return queryResult?.isSuccess;
}

// ===================== DELETE QUERIES ============================

/**
 * Delete report by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.districtId } disctrictId 
 * @returns { Promise<Boolean> }
 */
async function removeReport(id, disctrictId) {
    const existing = await findByReportId(id, disctrictId);

    console.log("ini existing: " + JSON.stringify(existing));
    
    if (!existing) {
        return false;
    }
    
    const delPartOfReport = await deletePartOfReport(id);

    if(!delPartOfReport) return false;

    const queryResult = await Database.doQuery(`
        DELETE FROM Report
        WHERE id = ?
    `,id);    

    return Boolean(queryResult?.isSuccess);
}

/**
 * 
 * @param {typeof Report.prototype.id} id 
 * @returns 
 */
async function deletePartOfReport(id) {
    const queryResult = await Database.doQuery(`
        DELETE FROM partOfReport 
        WHERE reportId = ?    
        `, id);
    
    return queryResult?.isSuccess;
}

module.exports = {
    findAll, findAllByIsArchivedStatus, findAllByStatus, findAllByTime, findAllByDisasterTypeId, 
    findByReportId,
    add,
    updateIsArchived,
    updateStatus,
    updateDescription,
    removeReport
};