const ImageUtil = require("../utils/image.util");
const LogRepository = require("../repositories/log.repository");
const LogCategoryService = require("./logCategory.service");
const Log = require("../models/log.model");

/**
 * @param { typeof Log.prototype.type } type 
 * @param { typeof Log.prototype.value } value 
 * @returns { boolean }
 */
function validateLogValue(type, value) {
    switch (type) {
        case "number":
            return !isNaN(value) && value !== "";
        case "boolean":
            return value === "true" || value === "false" || value === "1" || value === "0" || typeof value === "boolean";
        case "string":
        default:
            return typeof value === "string";
    }
}

/**
 * @param { typeof Log.prototype.reportId } reportId
 * @param { typeof Log.prototype.reporterId } reporterId
 * @param { typeof Log.prototype.logCategoryId } logCategoryId
 * @param { typeof Log.prototype.value } value
 * @param { typeof Log.prototype.time } time 
 * @param { typeof Log.prototype.pictureBuffer } pictureBuffer
 * @returns { typeof Log.prototype.id } Log ID
 */
async function add(reportId, reporterId, logCategoryId, value, time, pictureBuffer) {
    const category = await LogCategoryService.findById(logCategoryId);
    if (!category) {
        throw new Error("Log category not found.");
    }

    if (!validateLogValue(category.type, value)) {
        throw new Error(`Value '${value}' does not match the category type '${category.type}'.`);
    }

    const logTime = time || Date.now();

    let processedPicture = null;
    if (pictureBuffer) {
        processedPicture = await ImageUtil.resizeBuffer(
            pictureBuffer, {
                width: 1024, height: 1024,
                horizontalAlignment: "center", verticalAlignment: "center"
            }
        );
    }

    const logId = await LogRepository.add(
        value,
        logTime,
        processedPicture,
        reporterId,
        logCategoryId,
        reportId
    );

    return logId;
}

/**
 * @param { typeof Log.prototype.id } logId
 * @param {{ 
 *      value: typeof Log.prototype.value, 
 *      time: typeof Log.prototype.time, 
 *      logCategoryId: typeof Log.prototype.logCategoryId 
 * }} updatedInfo
 * @returns { Promise<boolean> }
 */
async function updateInfo(logId, updatedInfo) {
    if (updatedInfo.logCategoryId || updatedInfo.value) {
        const categoryId = updatedInfo.logCategoryId;

        if (categoryId) {
            const category = await LogCategoryService.findById(categoryId);

            if (!category) 
                throw new Error("Log category not found.");
            
            if (updatedInfo.value && !validateLogValue(category.type, updatedInfo.value))
                throw new Error(`Value does not match the category type '${category.type}'.`);
        }
    }

    return await LogRepository.updateInfo(
        logId,
        updatedInfo.value,
        updatedInfo.time,
        updatedInfo.logCategoryId
    );
}

/**
 * @param { typeof Log.prototype.id } logId
 * @returns { Promise<typeof Log.prototype.picture> }
 */
async function getPicture(logId) {
    return await LogRepository.getPicture(logId);
}

/**
 * @param { typeof Log.prototype.id } logId 
 * @param { typeof Log.prototype.picture } pictureBuffer 
 * @returns { Promise<boolean> }
 */
async function setPicture(logId, pictureBuffer) {
    const resizedPictureBuffer = await ImageUtil.resizeBuffer(
        pictureBuffer, {
            width: 1024, height: 1024,
            horizontalAlignment: "center", verticalAlignment: "center"
        }
    );
    return await LogRepository.updatePicture(logId, resizedPictureBuffer);
}

/**
 * @param { typeof Log.prototype.id } logId 
 * @returns { Promise<boolean> }
 */
async function removePicture(logId) {
    return await LogRepository.updatePicture(logId, null);
}

/**
 * @returns { Promise<Array<Log>> }
 */
async function findAll() {
    return await LogRepository.findAll();
}

/**
 * @param { typeof Log.prototype.id } id
 * @returns { Promise<Array<Log>> }
 */
async function findByLogId(logId) {
    return await LogRepository.findByLogId(logId);
}

/**
 * @param { typeof Log.prototype.reportId } reportId
 * @returns { Promise<Array<Log>> }
 */
async function findAllByReportId(reportId) {
    return await LogRepository.findAllByReportId(reportId);
}

/**
 * @param { typeof Log.prototype.reporterId } reporterId
 * @returns { Promise<Array<Log>> }
 */
async function findAllByReporterId(reporterId) {
    return await LogRepository.findAllByReporterId(reporterId);
}

/**
 * @param { typeof Log.prototype.logCategoryId } logCategoryId
 * @returns { Promise<Array<Log>> }
 */
async function findAllByLogCategoryId(logCategoryId) {
    return await LogRepository.findAllByLogCategoryId(logCategoryId);
}

/**
 * @param { typeof Log.prototype.id } logId
 * @returns { Promise<boolean> }
 */
async function remove(logId) {
    return await LogRepository.remove(logId);
}

module.exports = {
    add,
    updateInfo, 
    getPicture, setPicture, removePicture,
    findAll, findByLogId, findAllByReportId,
    findAllByReporterId, findAllByLogCategoryId,
    remove
};