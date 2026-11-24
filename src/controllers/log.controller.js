const ResponseUtil = require("../utils/response.util");
const LogService = require("../services/log.service");

const MAX_FILE_SIZE = 10_000_000; // 10 MB

/** @type {import("express").RequestHandler} */
async function findAll(req, res) {
    try {
        const logs = await LogService.findAll();
        return ResponseUtil.sendApiResponse(res, 200, null, { logs });
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function findByLogId(req, res) {
    try {
        const log = await LogService.findByLogId(req.params.id);
        if (!log)
            return ResponseUtil.sendApiResponse(res, 404, "Log not found.");

        return ResponseUtil.sendApiResponse(res, 200, null, { log });
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function findAllByReportId(req, res) {
    try {
        const logs = await LogService.findAllByReportId(req.params.reportId);
        return ResponseUtil.sendApiResponse(res, 200, null, { logs });
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function findAllByLogCategoryId(req, res) {
    try {
        const logs = await LogService.findAllByLogCategoryId(req.params.logCategoryId);
        return ResponseUtil.sendApiResponse(res, 200, null, { logs });
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function findAllByReporterId(req, res) {
    try {
        const logs = await LogService.findAllByReporterId(req.params.reporterId);
        return ResponseUtil.sendApiResponse(res, 200, null, { logs });
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    const { reportId, reporterId, logCategoryId, value, time } = req.body ?? {};
    const pictureBuffer = req.files?.file?.data ?? null;

    if (!reportId || !reporterId || !logCategoryId || value === undefined) {
        return ResponseUtil.sendApiResponse(
            res,
            400,
            "reportId, reporterId, logCategoryId, and value are required."
        );
    }

    const parsedTime = time !== undefined && time !== null && time !== "" ? Number(time) : null;
    if (parsedTime !== null && Number.isNaN(parsedTime)) {
        return ResponseUtil.sendApiResponse(res, 400, "time must be a valid number.");
    }

    if (pictureBuffer != null && pictureBuffer.length > MAX_FILE_SIZE) {
        return ResponseUtil.sendApiResponse(res, 400, "File size should not exceed 10 MB.");
    }

    try {
        const logId = await LogService.add(
            reportId,
            reporterId,
            logCategoryId,
            value,
            parsedTime,
            pictureBuffer
        );

        if (!logId)
            return ResponseUtil.sendApiResponse(res, 500, "Failed to create log.");

        return ResponseUtil.sendApiResponse(res, 201, null, { logId });
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 400, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {
    const logId = req.params.id;
    const { value, time, logCategoryId } = req.body ?? {};

    const parsedTime = time !== undefined && time !== null ? Number(time) : undefined;
    if (parsedTime !== undefined && Number.isNaN(parsedTime)) {
        return ResponseUtil.sendApiResponse(res, 400, "time must be a valid number.");
    }

    try {
        const isSuccess = await LogService.updateInfo(logId, {
            value,
            time: parsedTime,
            logCategoryId
        });

        if (!isSuccess)
            return ResponseUtil.sendApiResponse(res, 404, "Log not found or no changes applied.");

        return ResponseUtil.sendApiResponse(res, 200);
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 400, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function getPicture(req, res) {
    try {
        const pictureBuffer = await LogService.getPicture(req.params.id);

        if (pictureBuffer != null) {
            res.header("Content-Type", "image/webp");
            return ResponseUtil.sendBufferResponse(res, pictureBuffer);
        }

        return ResponseUtil.sendApiResponse(res, 404, "Picture not found.");
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function setPicture(req, res) {
    const pictureBuffer = req.files?.file?.data;

    if (!pictureBuffer)
        return ResponseUtil.sendApiResponse(res, 400, "No file was provided.");

    if (pictureBuffer.length > MAX_FILE_SIZE)
        return ResponseUtil.sendApiResponse(res, 400, "File size should not exceed 10 MB.");

    try {
        const isSuccess = await LogService.setPicture(req.params.id, pictureBuffer);
        if (!isSuccess)
            return ResponseUtil.sendApiResponse(res, 404, "Log not found.");

        return ResponseUtil.sendApiResponse(res, 200);
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 400, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function removePicture(req, res) {
    try {
        const isSuccess = await LogService.removePicture(req.params.id);
        if (!isSuccess)
            return ResponseUtil.sendApiResponse(res, 404, "Log not found.");

        return ResponseUtil.sendApiResponse(res, 200);
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function remove(req, res) {
    try {
        const isSuccess = await LogService.remove(req.params.id);
        if (!isSuccess)
            return ResponseUtil.sendApiResponse(res, 404, "Log not found.");

        return ResponseUtil.sendApiResponse(res, 200);
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 500, error.message);
    }
}

module.exports = {
    findAll, findByLogId,
    findAllByReportId, findAllByLogCategoryId, findAllByReporterId,
    add, updateInfo,
    getPicture, setPicture, removePicture,
    remove
};