const ResponseUtil = require("../utils/response.util");
const AccountService = require("../services/account.service");

/**
 * Menyediakan districtId untuk Controller.
 * MainMiddleware harus memastikan session sudah valid.
 *
 * @type {import("express").RequestHandler}
 */
function checkAccessDistrict(req, res, next) {
    const districtId = AccountService.findByAccountId(req.session.id).districtId;

    if (!districtId) {
        return ResponseUtil.sendApiResponse(res, 403, "District access unavailable");
    }

    res.locals.districtId = districtId;
    return next();
}

/**
 * Memvalidasi status Report.
 *
 * @type {import("express").RequestHandler}
 */
function validateReportStatus(req, res, next) {
    const status = req.body.status;

    if (!["closed", "handlingRequired"].includes(status)) {
        return ResponseUtil.sendApiResponse(res, 400, "Invalid report status");
    }

    return next();
}

module.exports = {
    checkAccessDistrict,
    validateReportStatus
};
