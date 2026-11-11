const ImageUtil = require("../utils/image.util");
const Submission = require("../models/submission.model");
const SubmissionRepository = require("../repositories/submission.repository");

/**
 * @param { typeof Submission.prototype.citizenId } citizenId
 * @returns { Promise<Array<Submission>> }
 */
async function findAllByCitizenId(citizenId) {
    const submissions = await SubmissionRepository.findAllByCitizenId(citizenId);
    return submissions;
}

/**
 * @param { typeof Submission.prototype.districtId } districtId
 * @returns { Promise<Array<Submission>> }
 */
async function findAllByDistrictId(districtId) {
    const submissions = await SubmissionRepository.findAllByDistrictId(districtId);
    return submissions;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @returns { Promise<Submission?> }
 */
async function findBySubmissionId(submissionId) {
    const submission = await SubmissionRepository.findBySubmissionId(submissionId);
    return submission;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @returns { Promise<typeof Submission.prototype.picture> }
 */
async function getPicture(submissionId) {
    const picture = await SubmissionRepository.getPicture(submissionId);
    return picture;
}

/**
 * @param { typeof Submission.prototype.description } description
 * @param { typeof Submission.prototype.districtId } districtId
 * @param { typeof Submission.prototype.citizenId } citizenId
 * @param { typeof Submission.prototype.disasterTypeId } disasterTypeId
 * @param { Buffer | null } pictureBuffer
 * @returns { Promise<typeof Submission.prototype.id> }
 */
async function add(description, districtId, citizenId, disasterTypeId, pictureBuffer = null) {
    let processedPictureBuffer = null;

    if (pictureBuffer)
        processedPictureBuffer = await ImageUtil.resizeBuffer(pictureBuffer);

    const time = Date.now();

    const submissionId = await SubmissionRepository.add(
        description, time, processedPictureBuffer,
        districtId, citizenId, disasterTypeId);

    return submissionId;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @param { typeof Submission.prototype.description } description
 * @param { typeof Submission.prototype.districtId } districtId
 * @param { typeof Submission.prototype.disasterTypeId } disasterTypeId
 * @returns { Promise<boolean> }
 */
async function updateInfo(submissionId, description, districtId, disasterTypeId) {
    const isSuccess = await SubmissionRepository.updateInfo(
        submissionId, description,
        districtId, disasterTypeId);

    return isSuccess;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @param { Buffer } pictureBuffer
 * @returns { Promise<boolean> }
 */
async function setPicture(submissionId, pictureBuffer) {
    const processedPictureBuffer = await ImageUtil.resizeBuffer(pictureBuffer);

    const isSuccess = await SubmissionRepository.updatePicture(
        submissionId, processedPictureBuffer);

    return isSuccess;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @returns { Promise<boolean> }
 */
async function removePicture(submissionId) {
    const isSuccess = await SubmissionRepository.updatePicture(
        submissionId, null);

    return isSuccess;
}

/**
 * @param { typeof Submission.prototype.id } submissionId
 * @returns { Promise<boolean> }
 */
async function cancel(submissionId) {
    const isSuccess = await SubmissionRepository.updateArchivedState(
        submissionId, true);

    return isSuccess;
}

module.exports = {
    findAllByCitizenId,
    findAllByDistrictId,
    findBySubmissionId,
    getPicture,
    add,
    updateInfo,
    setPicture,
    removePicture,
    cancel
};
