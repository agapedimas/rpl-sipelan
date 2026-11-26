const ResponseUtil = require("../utils/response.util");
const AccountService = require("../services/account.service");

/**
 * Menyediakan districtId untuk Controller.
 * MainMiddleware harus memastikan session sudah valid.
 *
 * @type {import("express").RequestHandler}
 */
async function checkAccessDistrict(req, res, next) {
    const account = await AccountService.findByAccountId(req.session.accountId);
    
    const districtId = account.districtId;

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
