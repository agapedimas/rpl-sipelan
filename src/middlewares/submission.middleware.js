const ResponseUtil = require("../utils/response.util");
const AccountRepository = require("../repositories/account.repository");
const SubmissionService = require("../services/submission.service");
const VerificationService = require("../services/verification.service");

/**
 * Cek apakah officer/volunte bisa akses distrik yang diminta
 * @type {import("express").RequestHandler}
 */
async function checkDistrictAccess(req, res, next) {
    const accountId = req.session.accountId;
    const { districtId } = req.params;

    const account = await AccountRepository.findByAccountId(accountId);

    if (account == null)
        return ResponseUtil.sendApiResponse(res, 403, "Account is not found.");

    if (String(account.districtId) !== String(districtId))
        return ResponseUtil.sendApiResponse(res, 403, "You do not have access to this district.");

    return next();
}

/**
 * Cek apakah peng request bisa akses submisi yang diminta
 * @type {import("express").RequestHandler}
 */
async function checkSubmissionAccess(req, res, next) {
    const accountId = req.session.accountId;
    const { submissionId } = req.params;

    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null)
        return ResponseUtil.sendApiResponse(res, 404, "Submission is not found.");

    const account = await AccountRepository.findByAccountId(accountId);

    if (account == null)
        return ResponseUtil.sendApiResponse(res, 403, "Account is not found.");

    const isCitizenOwner =
        account.role === "citizen" &&
        String(submission.citizenId) === String(account.id);

    const isStaffInSameDistrict =
        ["officer", "volunteer"].includes(account.role) &&
        String(submission.districtId) === String(account.districtId);

    if (!isCitizenOwner && !isStaffInSameDistrict)
        return ResponseUtil.sendApiResponse(res, 403, "You do not have access to this Submission.");

    return next();
}

/**
 * CEk apakah citizen bisa ubah submisi (hanya ketika belum di verif)
 * @type {import("express").RequestHandler}
 */
async function checkCitizenSubmissionModification(req, res, next) {
    const accountId = req.session.accountId;
    const { submissionId } = req.params;

    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null)
        return ResponseUtil.sendApiResponse(res, 404, "Submission is not found.");

    if (String(submission.citizenId) !== String(accountId))
        return ResponseUtil.sendApiResponse(res, 403, "You do not own this Submission.");

    if (submission.isArchived === true)
        return ResponseUtil.sendApiResponse(res, 400, "Archived Submission cannot be modified.");

    const verifications = await VerificationService.findAllBySubmissionId(submissionId);

    if (verifications.length > 0)
        return ResponseUtil.sendApiResponse(res, 400, "Submission has already been verified or rejected.");

    return next();
}

module.exports = {
    checkDistrictAccess,
    checkSubmissionAccess,
    checkCitizenSubmissionModification
};
