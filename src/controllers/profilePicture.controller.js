const path = require("path");
const fs = require("fs");

const Accounts = require("../repositories/account.repository");
const Authentications = require("../repositories/authentication.repository");

const defaultProfilePictureFilePath = path.resolve(__dirname, "../assets/profilePicture.webp");
const pictureFolderPath = path.resolve(__dirname, "../../data/pp");

async function getProfilePicture(req, res, next) {
    const pictureId = req.params.pictureId;
    const profilePicturePath = pictureFolderPath + "/" + pictureId;

    if (fs.existsSync(profilePicturePath)) {
        // Set cache of profile picture to 1 year, because it can be refreshed with 'pictureId'
        res.header("Cache-Control", "public, max-age=31536000");
        res.header("Content-Type", "image/webp");
    
        return res.sendFile(profilePicturePath);
    }
    else {
        return getDefaultProfilePicture(req, res, next);
    }
}
async function getDefaultProfilePicture(req, res, next) {
    return res.sendFile(defaultProfilePictureFilePath);
}
async function setProfilePicture(req, res, next) {
    const accountId = req.params.accountId;
    const buffer = req.files.file.data;

    const newPictureId = await Accounts.setPicture(accountId, buffer);
    return res.api.sendSuccess({ id: newPictureId });
}
async function deleteProfilePicture(req, res, next) {
    const accountId = req.params.accountId;
    await Accounts.removePicture(accountId);
    return res.api.sendSuccess();
}

module.exports = {
    getProfilePicture,
    getDefaultProfilePicture,
    setProfilePicture,
    deleteProfilePicture
}