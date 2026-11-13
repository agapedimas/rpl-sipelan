const Verification = require("../models/verification.model");
const VerificationRepository = require("../repositories/verification.repository");

/**
 * Insert a brand new verification record
 * @param { typeof Verification.prototype.status } status 
 * @param { typeof Verification.prototype.time } time 
 * @param { typeof Verification.prototype.reason } reason 
 * @param { typeof Verification.prototype.submissionId } submissionId 
 * @param { typeof Verification.prototype.verifierId } verifierId 
 * @returns { Promise<typeof Verification.prototype.id> }
 */
async function add(status, time, reason, submissionId, verifierId) {
    const verificationId = await VerificationRepository.add(status, time, reason, submissionId, verifierId);
    return verificationId;
}

/**
 * Get all of the verification records
 * @returns { Promise<Array<Verification>> }
 */
async function findAll() {
    const verifications = await VerificationRepository.findAll();
    return verifications;
}

/**
 * Get all of the verification records that matched with the given status
 * @param { typeof Verification.prototype.status } status 
 * @returns { Promise<typeof Array<Verification>> }
 */
async function findAllByStatus(status) {
    const verificationStatus = await VerificationRepository.findAllByStatus(status);
    return verificationStatus;
}

/**
 * Get all of the verification records that matched with the given submission id
 * @param { typeof Verification.prototype.submissionId } submissionId 
 * @returns { Promise<typeof Array<Verification>> }
 */
async function findAllBySubmissionId(submissionId) {
    const verifications = await VerificationRepository.findAllBySubmissionId(submissionId);
    return verifications;
}

/**
 * Get all of verification records that matched with the given verifier id
 * @param { typeof Verification.prototype.verifierId } verifierId 
 * @returns { Promise<typeof Array<Verification>> }
 */
async function findAllByVerifierId(verifierId) {
    const verifications = await VerificationRepository.findAllByVerifierId(verifierId);
    return verifications;
}

/**
 * Get a single verification record that matched with the given verification id
 * @param { typeof Verification.prototype.id } verificationId 
 * @returns { Promise<typeof Verification?> }
 */
async function findByVerificationId(verificationId) {
    const verifications = await VerificationRepository.findByVerificationId(verificationId);
    return verifications;
}

module.exports = {
    findAll, findAllByStatus, findAllBySubmissionId, findAllByVerifierId,
    findByVerificationId,
    add
};