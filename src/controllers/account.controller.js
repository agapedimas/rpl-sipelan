const path = require("path")

const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const AccountService = require("../services/account.service");
const DistrictService = require("../services/district.service");

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    let { phone, name, districtId, role, nik } = req.body;
    
    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([phone, name, districtId, role])) {
        return ResponseUtil.sendApiResponse(res, 422, "Phone, Name, DistrictId, and Role are required.");
    }

    switch (ValidatorUtil.checkPhoneNumberValidity(phone)) {
        case "TOO_LONG": 
            return ResponseUtil.sendApiResponse(res, 400, "Phone number is too long.");
        case "TOO_SHORT": 
            return ResponseUtil.sendApiResponse(res, 400, "Phone number is too short.");
        case "INVALID": 
            return ResponseUtil.sendApiResponse(res, 400, "Phone number is invalid.");
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
        case "TOO_SHORT": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too short.");
        case "INVALID": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is invalid.");
    }

    if (DistrictService.doesDistrictExist(districtId) == false)
        return ResponseUtil.sendApiResponse(res, 400, "District with id '" + districtId + "' does not exist.");

    if (AccountService.doesRoleExist(role) === false)
        return ResponseUtil.sendApiResponse(res, 400, "Role '" + role + "' does not exist.");

    // Make sure phone number is not already used
    if (await AccountService.findByPhone(phone) !== null)
        return ResponseUtil.sendApiResponse(res, 400, "Account with phone number '" + phone + "' is already used on another account.");

    // NIK is optional. If providen, then check for its validity.
    if (nik != null) {
        switch (ValidatorUtil.checkNikValidity(nik)) {
            case "INVALID": 
                return ResponseUtil.sendApiResponse(res, 400, "NIK is should be a number and 16 digits.");
        }
    }

    const isSuccess = await AccountService.add(phone, name, districtId, role, nik);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 201);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {}

/** @type {import("express").RequestHandler} */
async function getPicture(req, res) {
    const accountId = req.params.accountId;
    const pictureBuffer = await AccountService.getPicture(accountId);

    if (pictureBuffer != null) {
        res.header("Content-Type", "image/webp");
    
        return ResponseUtil.sendBufferResponse(res, pictureBuffer);
    }
    // Send placeholder profile picture if not available
    else {
        const defaultProfilePictureFilePath = path.resolve(__dirname, "../assets/profilePicture.webp");
        return ResponseUtil.sendFileResponse(res, defaultProfilePictureFilePath);
    }
}

/** @type {import("express").RequestHandler} */
async function setPicture(req, res) {
    const accountId = req.session.accountId;
    const pictureBuffer = req.files.file.data;

    if (pictureBuffer != null) {
        // Make sure the file size is not beyond limit,
        // which is 3 MB at maximum
        if (pictureBuffer.length > 3_000_000)
            return ResponseUtil.sendApiResponse(res, 400, "File size should not exceed 3 MB.");
        
        const isSuccess = await AccountService.setPicture(accountId, pictureBuffer);
        if (isSuccess)
            return ResponseUtil.sendApiResponse(res, 201);
        else
            return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
    }
    else {
        return ResponseUtil.sendApiResponse(res, 400, "No files are providen.");
    }
}

/** @type {import("express").RequestHandler} */
async function removePicture(req, res) {
    const accountId = req.session.accountId;
    await AccountService.removePicture(accountId);
    return ResponseUtil.sendApiResponse(res, 200);
}

/** @type {import("express").RequestHandler} */
async function assignAccountInfo(req, res, next) {
    const accountId = req.session.accountId;

    if (accountId) {
        const account = await AccountService.findByAccountId(accountId);
        res.locals.account = account;
    }

    return next();
}

module.exports = {
    add,
    updateInfo,
    getPicture, setPicture, removePicture,
    assignAccountInfo
}