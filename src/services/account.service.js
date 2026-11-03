const ImageUtil = require("../utils/image.util");

const Account = require("../models/account.model");
const AccountRepository = require("../repositories/account.repository");

/**
 * @param { typeof Account.prototype.phone } phone
 * @param { typeof Account.prototype.name } name 
 * @param { typeof Account.prototype.districtId } districtId
 * @param { typeof Account.prototype.role } role
 * @param { typeof Account.prototype.nik } nik 
 * @returns { Promise<typeof Account.prototype.id> } Account id
 */
async function add(phone, name, districtId, role, nik) {
    const accountId = await AccountRepository.add(phone, name, districtId, role, nik);
    return accountId;
}

/**
 * @param { typeof Account.prototype.id } accountId
 * @param {{
 *      phone: Account.prototype.phone,
 *      name: Account.prototype.name,
 *      districtId: Account.prototype.districtId,
 *      nik: Account.prototype.nik
 * }} updatedInfo
 * @returns { Promise<boolean> } Result of execution
 */
async function updateInfo(accountId, updatedInfo) {
    const isSuccess = 
        await AccountRepository.updateInfo(
            accountId,
            updatedInfo.phone, 
            updatedInfo.name, 
            updatedInfo.districtId, 
            updatedInfo.nik);
    return isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Account.prototype.picture } pictureBuffer 
 * @returns { Promise<boolean> }
 */
async function setPicture(accountId, pictureBuffer) {
    const resizedPictureBuffer = await ImageUtil.resizeBuffer(
        pictureBuffer, {
            width: 720, height: 720,
            horizontalAlignment: "center", verticalAlignment: "center"
        } 
    );
    const isSuccess = 
        await AccountRepository.updatePicture(
            accountId,
            resizedPictureBuffer
        );
    return isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<boolean> }
 */
async function removePicture(accountId) {
    const isSuccess = 
        await AccountRepository.updatePicture(
            accountId,
            null
        );
    return isSuccess;
}


/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<boolean> }
 */
async function activate(accountId) {
    const isSuccess = await AccountRepository.updateActiveState(accountId, true);
    return isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<boolean> }
 */
async function deactivate(accountId) {
    const isSuccess = await AccountRepository.updateActiveState(accountId, false);
    return isSuccess;
}

/**
 * @param { string } role 
 * @returns { boolean }
 */
async function doesRoleExist(role) {
    return ["citizen", "volunteer", "officer", "admin"].includes(role);
}

module.exports = {
    add, 
    updateInfo, 
    setPicture, removePicture,
    activate, deactivate,
    doesRoleExist
}