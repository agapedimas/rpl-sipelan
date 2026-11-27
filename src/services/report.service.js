const formatterUtil = require("../utils/formatter.util");

const Report = require("../models/report.model");
const ReportRepository = require("../repositories/report.repository");

/**
 * Insert a brand new Report
 * @param { typeof Report.prototype.isArchived } isArchived 
 * @param { typeof Report.prototype.status } status 
 * @param { typeof Report.prototype.description } description 
 * @param { typeof Report.prototype.disasterTypeId } disasterTypeId 
 * @returns { Promise<typeof Report.prototype.id> }
 */
async function add(status, description, disasterTypeId, submissionArray) {
    const timeStampMs = Date.now();

    const reportId = await ReportRepository.add(status, description, timeStampMs, disasterTypeId, submissionArray);
    return reportId;
}

/**
 * Get all the report records
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAll(districtId) {
    const reports = await ReportRepository.findAll(districtId);
    return reports;
}

/**
 * Get all report records that matched with the given status
 * @param { typeof Report.prototype.status } status 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByStatus(status, districtId){
    const reports = await ReportRepository.findAllByStatus(status, districtId);
    return reports;
}

/**
 * Get all report records that matched with the given disaster type id
 * @param { typeof Report.prototype.disasterTypeId } disasterTypeId 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByDisasterTypeId(disasterTypeId, districtId) {
    const reports = await ReportRepository.findAllByDisasterTypeId(disasterTypeId, districtId);
    return reports;
}

/**
 * Get all report records that matched with the given is archived status
 * @param { typeof Report.prototype.isArchived } isArchived 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByIsArchivedStatus(isArchived, districtId) {
    const reports = await ReportRepository.findAllByIsArchivedStatus(isArchived, districtId);
    return reports;
}

/**
 * Get all report records that matched with the given is time
 * @param { typeof Report.prototype.time } time 
 * @returns { Promise<Array<Report>> }
 */
async function findAllByTime(time, districtId){
    const reports = await ReportRepository.findAllByTime(time, districtId);
    return reports;
}

/**
 * Get a single report record that matched with the given report id
 * @param { typeof Report.prototype.id } id 
 * @returns { Promise<Report?> }
 */
async function findByReportId(id, districtId) {
    const report = await ReportRepository.findByReportId(id, districtId);
    return report;
}

/**
 * Update isArchived status by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.isArchived } isArchived
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Boolean> }
 */
async function updateIsArchived(id, isArchived, districtId) {
    const isSuccess = await ReportRepository.updateIsArchived(id, isArchived, districtId);
    return isSuccess;
}

/**
 * Update report status by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.status } status 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Boolean> }
 */
async function updateStatus(id, status, districtId) {
    const isSuccess = await ReportRepository.updateStatus(id, status, districtId);
    return isSuccess;
}

/**
 * Update description by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.description } description 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Boolean> }
 */
async function updateDescription(id, description, districtId) {
    const isSuccess = await ReportRepository.updateDescription(id, description, districtId);
    return isSuccess;
}

/**
 * Delete report by report id
 * @param { typeof Report.prototype.id } id 
 * @param { typeof Report.prototype.districtId } districtId 
 * @returns { Promise<Boolean> }
 */
async function removeReport(id, districId) {
    const isSuccess = await ReportRepository.removeReport(id, districId);
    return isSuccess;
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