const LogService = require("../services/log.service");

async function findAll(req, res, next) {
    const logs = await LogService.findAll();
    return res.send(logs);
}

async function findAllByReportId(req, res, next) {
    const reportId = req.params.reportId;
    const logs = await LogService.findAllByReportId(reportId);
    return res.send(logs);
}

async function findAllByLogCategoryId(req, res, next) {
    const logCategoryId = req.params.logCategoryId;
    const logs = await LogService.findAllByLogCategoryId(logCategoryId);
    return res.send(logs);
}

async function findAllByReporterId(req, res, next) {
    const reporterId = req.params.reporterId;
    const logs = await LogService.findAllByReporterId(reporterId);
    return res.send(logs);
}

async function add(req, res, next) {
    try {
        const { reportId, reporterId, logCategoryId, value, time } = req.body;
        const pictureBuffer = req.file ? req.file.buffer : null; // Asumsi menggunakan multer untuk file upload

        const logId = await LogService.add(
            reportId, 
            reporterId, 
            logCategoryId, 
            value, 
            time ? Number(time) : null, 
            pictureBuffer
        );
        return res.status(201).send({ logId });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

async function updateInfo(req, res, next) {
    try {
        const logId = req.params.id;
        const updatedInfo = req.body;
        
        const isSuccess = await LogService.updateInfo(logId, updatedInfo);
        if (isSuccess) {
            return res.send({ message: "Log updated successfully." });
        }
        return res.status(400).send({ message: "Failed to update log." });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

async function setPicture(req, res, next) {
    try {
        const logId = req.params.id;
        if (!req.file) {
            return res.status(400).send({ message: "No picture provided." });
        }

        const isSuccess = await LogService.setPicture(logId, req.file.buffer);
        if (isSuccess) {
            return res.send({ message: "Picture updated successfully." });
        }
        return res.status(400).send({ message: "Failed to update picture." });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

async function removePicture(req, res, next) {
    const logId = req.params.id;
    const isSuccess = await LogService.removePicture(logId);
    if (isSuccess) {
        return res.send({ message: "Picture removed successfully." });
    }
    return res.status(400).send({ message: "Failed to remove picture." });
}

async function remove(req, res, next) {
    const logId = req.params.id;
    const isSuccess = await LogService.remove(logId);
    if (isSuccess) {
        return res.send({ message: "Log deleted successfully." });
    }
    return res.status(400).send({ message: "Failed to delete log." });
}

module.exports = {
    findAll, findAllByReportId, findAllByLogCategoryId, findAllByReporterId,
    add, 
    updateInfo,
    setPicture, removePicture, 
    remove
};