const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const SubmissionService = require("../services/submission.service");
const VerificationService = require("../services/verification.service");
const Verification = require("../models/verification.model");

/** @type {import("express").RequestHandler} */
async function add(req, res){
    // id petugas / officer yang lagi login
    const verifierId = req.session.accountId;
    // waktu verifikasi dalam ms (unix time stamp)
    const time = Date.now();
    // ketiga hal ini akan diberikan lewat input box dari form
    const { status, reason, submissionId } = req.body;

    // check whether the required fields is empty or not
    if(ValidatorUtil.areFieldsEmpty([status, time, reason, submissionId, verifierId])){
        return ResponseUtil.sendApiResponse(res, 422, "Required status, time, reason, submissionId, and verifierId fields");
    }

    // jika reason tidak diisi string, throw bad request
    if(typeof reason !== "string"){
        return ResponseUtil.sendApiResponse(res, 400, "Description must be a string.");
    }

    // periksa apakah submission id ada atau tidak
    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null) { // undifiend or null
        return ResponseUtil.sendApiResponse(res, 404, "The Submission ID is not present in the database");
    }

    const verificationId = await VerificationService.add(status, time, reason, submissionId, verifierId);
    if(verificationId !== null){
        return ResponseUtil.sendApiResponse(res, 201, "Saved to database", { verificationId: verificationId });
    } else {
        return ResponseUtil.sendApiResponse(res, 500, "Couldnt save the data, something went wrong");
    }
}

/** @type {import("express").RequestHandler} */
async function findAllByStatus(req, res) {

    const { status } = req.query; 
    const verifications = await VerificationService.findAllByStatus(status);

    return sendApiResponseVerifications(res, verifications);
}

/** @type {import("express").RequestHandler} */
async function findAllByVerifierId(req, res) {
    const verifierId = req.session.accountId;
    const verifications = await VerificationService.findAllByVerifierId(verifierId);

    return sendApiResponseVerifications(res, verifications)
}

// untuk end point "/api/verification/" => jadi dia sekarang bisa menerima query parameter seperti verification?status=pending
async function findAllVerification(req, res) {
    // pakai query parameter di URL
    // Diisi lewat input box (drop box), kemudian gunakan GET supaya data diubah ke URL jadi query parameter
    const { status } = req.query;

    let verifications;
    // kalo ada status yang di pass ke controller maka jalankan handle findbystatus
    if (status) {
        if (typeof status !== "string" || !["verified", "rejected"].includes(status)) {
            return ResponseUtil.sendApiResponse(res, 400, "This type of status is not available");
        }
        return findAllByStatus(req, res);
    } else {
        // kalo gk ada query status, pass ke controller yang handle verfierId
        return findAllByVerifierId(req, res);
    }
}

/** @type {import("express").RequestHandler} */
async function findAllBySubmissionId(req, res) {
    const { submissionId } = req.params;
    const verifications = await VerificationService.findAllBySubmissionId(submissionId);
    
    return sendApiResponseVerifications(res, verifications);
}

/** @type {import("express").RequestHandler} */
async function findByVerificationId(req, res) {
    const { verificationId } = req.params;
    const verification = await VerificationService.findByVerificationId(verificationId);
    
    return sendApiResponseVerification(res, verification);
}

/**
 * Helper function for sending a response of verifications data
 * @param {typeof Promise<Array<Verification>>} verifications 
 * @returns { import("express").Response } httpResponse
 */
function sendApiResponseVerifications(res, verifications){
    if(!Array.isArray(verifications) || !verifications.length){
        return ResponseUtil.sendApiResponse(res, 500, "Couldnt load the data");
    } else {
        return ResponseUtil.sendApiResponse(res, 200, "Getting verifications data", { verifications: verifications });
    }
}

/**
 * Helper function for sending response of a single verification data
 * @param {typeof Promise<Array<Verification>>} verification 
 * @returns { import("express").Response } httpResponse
 */
function sendApiResponseVerification(res, verification){
    if(verification === null){
        return ResponseUtil.sendApiResponse(res, 500, "Couldnt load the data");
    } else {
        return ResponseUtil.sendApiResponse(res, 200, "Getting verification data", { verification: verification });
    }
}

module.exports = {
    add,
    findAllBySubmissionId,
    findByVerificationId, findAllVerification
};


// TODO: 
// Note: Saat ini si verification tidak di handle berdasarkann dictrict di query nya, apakah saya harus memperbaikinya mas agape ?