const ResponseUtil = require("../utils/response.util");
const VerificationService = require("../services/verification.service");
/**
 * check akses ke lokasi district
 * @type {import("express").RequestHandler}
 * @returns 
 */
async function checkDistrictAccess(req, res, next) {
    // ambil account id dari session
    const accountId = req.session.accountId;
    // asumsikan district id diambli dari session, karena akan kepakai di banyak page contoh: submission, report, verification
    // sehingga butuh simpan data waktu satu kali sesi jabat tangan, supaya tidak selalu hit db
    const districtId = req.session.districtId;
    const account = await AccountRepository.findByAccountId(accountId);

    if (account == null) // null dan undifiend
        return ResponseUtil.sendApiResponse(res, 403, "Account is not found.");
    
    if (String(account.districtId) !== String(districtId))
        return ResponseUtil.sendApiResponse(res, 403, "You do not have access to this district.");
    
    return next();
}

/**
 * check apakah sudah pernah diverifikasi submission ini sebelumnya
 * @type {import("express").RequestHandler}
 * @returns 
 */
async function checkIsVerifiedBefore(req, res, next) {
    // ambil submissionId
    const { submissionId } = req.body;
    const verifications = await VerificationService.findAllBySubmissionId(submissionId);

    if (verifications.length !== 0) {
        return ResponseUtil.sendApiResponse(res, 403, "This submission is already verified");
    }
    
    return next();
}

module.exports = {
    checkDistrictAccess, checkIsVerifiedBefore
};