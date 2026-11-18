const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const SubmissionService = require("../services/submission.service");
const DistrictService = require("../services/district.service");
const DisasterTypeService = require("../services/disasterType.service");

/** @type {import("express").RequestHandler} */
async function findAllByCitizenId(req, res) {
    const citizenId = req.session.accountId;

    const submissions = await SubmissionService.findAllByCitizenId(citizenId);

    return ResponseUtil.sendApiResponse(
        res, 200, null, { submissions: submissions }
    );
}

/** @type {import("express").RequestHandler} */
async function findAllByDistrictId(req, res) {
    const { districtId } = req.params;

    const submissions = await SubmissionService.findAllByDistrictId(districtId);

    return ResponseUtil.sendApiResponse(
        res, 200, null, { submissions: submissions }
    );
}

/** @type {import("express").RequestHandler} */
async function findBySubmissionId(req, res) {
    const { submissionId } = req.params;

    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null)
        return ResponseUtil.sendApiResponse(res, 404, "Submission is not found.");

    return ResponseUtil.sendApiResponse(
        res, 200, null, { submission: submission }
    );
}

/** @type {import("express").RequestHandler} */
async function getPicture(req, res) {
    const { submissionId } = req.params;

    const pictureBuffer = await SubmissionService.getPicture(submissionId);

    if (pictureBuffer != null) {
        res.header("Content-Type", "image/png");
        res.header("Cache-Control", "private, max-age=86400");

        return ResponseUtil.sendBufferResponse(res, pictureBuffer);
    }
    else {
        return ResponseUtil.sendApiResponse(res, 404, "Submission picture is not found.");
    }
}


/** @type {import("express").RequestHandler} */
async function add(req, res) {
    let { description, districtId, disasterTypeId } = req.body;
    const citizenId = req.session.accountId;

    // Seperti biasa field yang diperlukan harus ada
    if (ValidatorUtil.areFieldsEmpty([description, districtId, disasterTypeId])) {
        return ResponseUtil.sendApiResponse(res, 422, "Description, District ID, and Disaster Type ID are required.");
    }

    if (typeof description !== "string") {

        return ResponseUtil.sendApiResponse(res, 400, "Description must be a string.");
    }

    const isDistrictExists = await DistrictService.doesDistrictExist(districtId);

    if (isDistrictExists === false) {
        return ResponseUtil.sendApiResponse(res, 400, "District with id '" + districtId + "' does not exist.");
    }

    const disasterType = await DisasterTypeService.findByDisasterTypeId(disasterTypeId);

    if (disasterType == null || disasterType.isActive === false) {
        return ResponseUtil.sendApiResponse(res, 400, "Disaster Type does not exist or is inactive.");
    }

    // Keterangan gambar tidak wajib
    let pictureBuffer = null;

    if (req.files != null && req.files.file != null) {
        pictureBuffer = req.files.file.data;

        // Ukuran maks 3MB
        if (pictureBuffer.length > 3_000_000)
            return ResponseUtil.sendApiResponse(res, 400, "File size should not exceed 3 MB.");
    }

    const submissionId = await SubmissionService.add(description, districtId, citizenId, disasterTypeId, pictureBuffer);

    if (submissionId != null)
        return ResponseUtil.sendApiResponse(res, 201, null, { submissionId: submissionId });
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}


/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {
    const { submissionId } = req.params;
    let { description, districtId, disasterTypeId } = req.body;

    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null)
        return ResponseUtil.sendApiResponse(res, 404, "Submission is not found.");

    if (submission.isArchived === true)
        return ResponseUtil.sendApiResponse(res, 400, "Archived Submission cannot be updated.");

    // Pastikan description berupa String jika dikirim
    if (description != null && typeof description !== "string") {
        return ResponseUtil.sendApiResponse(res, 400, "Description must be a string.");
    }

    // Salah satu field harus diisi
    if (description == null && districtId == null && disasterTypeId == null)
        return ResponseUtil.sendApiResponse(res, 422, "At least one field must be provided.");

    if (description != null && ValidatorUtil.areFieldsEmpty([description]))
        return ResponseUtil.sendApiResponse(res, 422, "Description cannot be empty.");

    if (districtId != null) {
        if (ValidatorUtil.areFieldsEmpty([districtId]))
            return ResponseUtil.sendApiResponse(res, 422, "District ID cannot be empty.");

        const isDistrictExists = await DistrictService.doesDistrictExist(districtId);

        if (isDistrictExists === false)
            return ResponseUtil.sendApiResponse(res, 400, "District does not exist.");
    }

    if (disasterTypeId != null) {
        if (ValidatorUtil.areFieldsEmpty([disasterTypeId]))
            return ResponseUtil.sendApiResponse(res, 422, "Disaster Type ID cannot be empty.");

        const disasterType = await DisasterTypeService.findByDisasterTypeId(disasterTypeId);

        if (disasterType == null || disasterType.isActive === false)
            return ResponseUtil.sendApiResponse(res, 400, "Disaster Type does not exist or is inactive.");
    }

    // Hanya update yang tidak null
    if (description == null) description = null;
    if (districtId == null) districtId = null;
    if (disasterTypeId == null) disasterTypeId = null;

    const isSuccess = await SubmissionService.updateInfo(submissionId, description, districtId, disasterTypeId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}


/** @type {import("express").RequestHandler} */
async function cancel(req, res) {
    const { submissionId } = req.params;

    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null)
        return ResponseUtil.sendApiResponse(res, 404, "Submission is not found.");

    if (submission.isArchived === true)
        return ResponseUtil.sendApiResponse(res, 400, "Submission is already archived.");

    const isSuccess = await SubmissionService.cancel(submissionId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}


/** @type {import("express").RequestHandler} */
async function setPicture(req, res) {
    const { submissionId } = req.params;

    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null)
        return ResponseUtil.sendApiResponse(res, 404, "Submission is not found.");

    if (submission.isArchived === true)
        return ResponseUtil.sendApiResponse(res, 400, "Archived Submission cannot be updated.");

    // File harus ada
    if (req.files == null || req.files.file == null)
        return ResponseUtil.sendApiResponse(res, 400, "No files are provided.");

    const pictureBuffer = req.files.file.data;

    // btas ukuran 3MB
    if (pictureBuffer.length > 3_000_000)
        return ResponseUtil.sendApiResponse(res, 400, "File size should not exceed 3 MB.");

    const isSuccess = await SubmissionService.setPicture(
        submissionId, pictureBuffer
    );

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 201);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}


/** @type {import("express").RequestHandler} */
async function removePicture(req, res) {
    const { submissionId } = req.params;

    const submission = await SubmissionService.findBySubmissionId(submissionId);

    if (submission == null)
        return ResponseUtil.sendApiResponse(res, 404, "Submission is not found.");

    if (submission.isArchived === true)
        return ResponseUtil.sendApiResponse(res, 400, "Archived Submission cannot be updated.");

    const isSuccess = await SubmissionService.removePicture(submissionId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

module.exports = {
    findAllByCitizenId,
    findAllByDistrictId,
    findBySubmissionId,
    getPicture,
    add,
    updateInfo,
    cancel,
    setPicture,
    removePicture
};