const ResponseUtil = require("../utils/response.util");
const VerificationService = require("../services/verification.service");
const AccountService = require("../services/account.service");
const SubmissionService = require("../services/submission.service");
/**
 * check akses ke lokasi district
 * @type {import("express").RequestHandler}
 * @returns 
 */
async function checkDistrictAccess(req, res, next) {
    // ambil account id dari session
    const accountId = req.session.accountId;

    // ambil account di db untuk cek districtnya nanti
    const account = await AccountService.findByAccountId(accountId);

    const submission = await SubmissionService.findBySubmissionId(req.body.submissionId);

    if (account == null || submission == null) // jika account null atau undifiend
        return ResponseUtil.sendApiResponse(res, 403, "Account or Submission is not found.");
    
    console.log("verifier districtId", account.districtId);
    console.log("districtId dari submission", submission.districtId);

    if (String(account.districtId) !== String(submission.districtId))
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
        return ResponseUtil.sendApiResponse(res, 403, "This submission is already verified or rejected before");
    }
    
    return next();
}

module.exports = {
    checkDistrictAccess, checkIsVerifiedBefore
};