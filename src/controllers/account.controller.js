const path = require("path")

const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");
const LanguageUtil = require("../utils/language.util");

const AccountService = require("../services/account.service");
const DistrictService = require("../services/district.service");

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    const { phone, name, districtId, role, nik } = req.body;

    const isSuccess = await AccountService.add(phone, name, districtId, role, nik);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 201);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {
    const accountId = req.session.accountId;
    const { phone, name, districtId, role, nik } = req.body;

    const isSuccess = await AccountService.updateInfo(accountId, {
        phone: phone,
        name: name,
        districtId: districtId,
        nik: nik
    });

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

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