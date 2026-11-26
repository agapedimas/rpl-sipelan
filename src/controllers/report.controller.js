const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const ReportService = require("../services/report.service");

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    const { isArchived, status, description, disasterTypeId } = req.body;
    // fields tidak kosong ?
    if(ValidatorUtil.areFieldsEmpty([isArchived, status, description, disasterTypeId])){
        return ResponseUtil.sendApiResponse(res, 422, "isArchived, status, description, disasterTypeId are required fields ");
    }

    // valid description type ?
    if(typeof description !== "string"){
        return ResponseUtil.sendApiResponse(res, 400, "Description must be in a type of string");
    }

    // get the reportId that is added
    const reportId = await ReportService.add(isArchived, status, description, disasterTypeId);

    return ResponseUtil.sendApiResponse(res, 200, "Saved to database", { reportId: reportId });
}

/** 
 * Bertindak sebagai dispatcher /api/report
 * @type {import("express").RequestHandler} 
 * */
async function findAll(req, res) {
    const districtId = res.locals.districtId;
    const status = req.query.status;

    if(status){ // jika ada paremeter status pada url
        return findAllByStatus(res, status, districtId);
    }

    const reports = await ReportService.findAll(districtId);

    return sendGetApiResponseReports(res, reports);
}

/**
 * Controller get status
 * @type {import("express").RequestHandler}
 */
async function findAllByStatus(res, status, districtId) {
    const reports = await ReportService.findAllByStatus(status, districtId);
    
    return sendGetApiResponseReports(res, reports);
}

/** @type {import("express").RequestHandler} */
async function findAllByDisasterTypeId(req, res) {
    const districId = res.locals.districtId;
    const disasterTypeId = req.params.disasterTypeId; // dari js, dibuat form dengan method get

    const reports = await ReportService.findAllByDisasterTypeId(disasterTypeId, districId);

    return sendGetApiResponseReports(res, reports);
}

/** @type {import("express").RequestHandler} */
async function findAllByIsArchivedStatus(req, res) {
    const disctrictId = res.locals.districtId;
    const isArchived = req.query.status === "true" ? 
                    "1" : req.query.status === "false" ? 
                    "0" : null;

    if(!isArchived || isArchived.length === 0 || !["0", "1"].includes(isArchived)){
        return ResponseUtil.sendApiResponse(res, 400, "Retrive fail, invalid is archive status");
    }

    const reports = await ReportService.findAllByIsArchivedStatus(isArchived, disctrictId);
    return sendGetApiResponseReports(res, reports);
}

/** @type {import("express").RequestHandler} */
async function findAllByTime(req, res){
    const districtId = res.locals.districtId;
    const time = req.query.milis; // in milis, assume this is already converted from front end

    const reports = await ReportService.findAllByTime(time, districtId);
    return sendGetApiResponseReports(res, reports);
}

/** @type {import("express").RequestHandler} */
async function findByReportId(req, res) {
    const districtId = res.locals.districtId;
    const reportId = req.params.reportId;

    const report = await ReportService.findByReportId(reportId, districtId);


    return report == null ? 
        ResponseUtil.sendApiResponse(res, 404, "Report not found") : 
        ResponseUtil.sendApiResponse(res, 200, "Report found", { report: report });
}

/** @type {import("express").RequestHandler} */
async function updateIsArchived(req, res) {
    const districtId = res.locals.districtId;
    const reportId = req.params.reportId;
    const isArchived = req.body.isArchived;

    if (![0, 1, "0", "1"].includes(isArchived)) {
        return ResponseUtil.sendApiResponse(res, 400, "Invalid archive status");
    }

    const report = await ReportService.findByReportId(reportId, districtId);

    if (!report) {
        return ResponseUtil.sendApiResponse(res, 404, "Report not found");
    }

    if (Number(isArchived) === Number(report.isArchived)) {
        return ResponseUtil.sendApiResponse(res, 409, "Report already has this archive status");
    }

    const isSuccess = await ReportService.updateIsArchived(reportId, isArchived);

    return isSuccess ? 
        ResponseUtil.sendApiResponse(res, 200, "Report updated") : 
        ResponseUtil.sendApiResponse(res, 500, "Update failed");
}

/** @type {import("express").RequestHandler} */
async function updateStatus(req, res) {
    const districtId = res.locals.districtId;
    const reportId = req.params.reportId;
    const status = req.body.status;

    const report = await ReportService.findByReportId(reportId, districtId);

    if (!report) {
        return ResponseUtil.sendApiResponse(res, 404, "Report not found");
    }

    const isSuccess = await ReportService.updateStatus(reportId, status, districtId);

    return isSuccess ? 
        ResponseUtil.sendApiResponse(res, 200, "Report updated") : 
        ResponseUtil.sendApiResponse(res, 500, "Update failed");
}

/** @type {import("express").RequestHandler} */
async function updateDescription(req, res) {
    const districtId = res.locals.districtId;
    const reportId = req.params.reportId;
    const description = req.body.description;

    if (typeof description !== "string" || description.trim().length === 0) {
        return ResponseUtil.sendApiResponse(res, 400, "Invalid description");
    }

    const report = await ReportService.findByReportId(reportId, districtId);

    if (!report) {
        return ResponseUtil.sendApiResponse(res, 404, "Report not found");
    }

    const isSuccess = await ReportService.updateDescription(reportId, description, districtId);

    return isSuccess ? 
        ResponseUtil.sendApiResponse(res, 200, "Report updated") : 
        ResponseUtil.sendApiResponse(res, 500, "Update failed");
}

/** @type {import("express").RequestHandler} */
async function removeReport(req, res) {
    const districtId = res.locals.districtId;
    const reportId = req.params.reportId;

    const report = await ReportService.findByReportId(reportId, districtId);

    if (!report) {
        return ResponseUtil.sendApiResponse(res, 404, "Report not found");
    }

    const isSuccess = await ReportService.removeReport(reportId, districtId);

    return isSuccess ? 
        ResponseUtil.sendApiResponse(res, 200, "Report removed") : 
        ResponseUtil.sendApiResponse(res, 500, "Remove failed");
}

/**
 * Helper function for sending api response on many reports
 * @type {import("express").RequestHandler}
 * @returns { typeof import("express").Response }
 */
function sendGetApiResponseReports(res, data) {
    return ResponseUtil.sendApiResponse(
        res,
        200,
        data.length === 0 ? "No reports found" : "Successfully getting reports",
        { data: data }
    );
}

module.exports = {
    add,
    findAll, findAllByDisasterTypeId, findAllByIsArchivedStatus, findAllByTime, findByReportId, 
    updateIsArchived, updateStatus, updateDescription,
    removeReport
};