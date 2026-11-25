const ImageUtil = require("../utils/image.util");
const FormatterUtil = require("../utils/formatter.util");

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
    if (phone)
        phone = FormatterUtil.formatPhoneNumber(phone);

    if (nik)
        nik = FormatterUtil.formatNik(nik);

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
    if (updatedInfo.phone)
        updatedInfo.phone = FormatterUtil.formatPhoneNumber(updatedInfo.phone);

    if (updatedInfo.nik)
        updatedInfo.nik = FormatterUtil.formatNik(updatedInfo.nik);

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
 * @returns { Promise<typeof Account.prototype.picture> }
 */
async function getPicture(accountId) {
    const pictureBuffer = await AccountRepository.getPicture(accountId);
    return pictureBuffer;
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
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<typeof Account.prototype.districtId> }
 */
async function getDistrictId(accountId) {
    if (accountId == null)
        return null;
    const districtId = await AccountRepository.getDistrictId(accountId);
    return districtId;
}

/**
 * @param { string } role 
 * @returns { boolean }
 */
async function doesRoleExist(role) {
    return ["citizen", "volunteer", "officer", "admin"].includes(role);
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<typeof Account.prototype.role> }
 */
async function getRole(accountId) {
    if (accountId == null)
        return null;
    const role = await AccountRepository.getRole(accountId);
    return role;
}

/**
 * @param { typeof Account.prototype.role } role
 * @param { string? } query
 * @returns { Promise<Array<Account>> }
 */
async function findAllByRole(role, query) {
    if (role == null)
        return null;

    if (!query) {
        const accounts = await AccountRepository.findAllByRole(role);
        return accounts;
    }
    else {
        const accounts = await AccountRepository.findAllByRoleAndQuery(role, query);
        return accounts;    
    }
}

/**
 * @param { typeof Account.prototype.role } role
 * @param { typeof Account.prototype.districtId } districtId
 * @param { string? } query
 * @returns { Promise<Array<Account>> }
 */
async function findAllByRoleAndDistrictId(role, districtId, query) {
    if (role == null || districtId == null)
        return null;

    if (!query) {
        const accounts = await AccountRepository.findAllByRoleAndDistrictId(role, districtId);
        return accounts;
    }
    else {
        const accounts = await AccountRepository.findAllByRoleAndDistrictIdAndQuery(role, districtId, query);
        return accounts;    
    }
}

/**
 * @param { typeof Account.prototype.id } accountId
 * @returns { Promise<Account> }
 */
async function findByAccountId(accountId) {
    const account = await AccountRepository.findByAccountId(accountId);
    return account;
}

/**
 * @param { typeof Account.prototype.phone } phone
 * @returns { Promise<Account> }
 */
async function findByPhone(phone) {
    phone = FormatterUtil.formatPhoneNumber(phone);
    const account = await AccountRepository.findByPhone(phone);
    return account;
}

module.exports = {
    add, 
    updateInfo, 
    getPicture, setPicture, removePicture,
    activate, deactivate,
    doesRoleExist,
    getRole, getDistrictId,
    findAllByRole, findAllByRoleAndDistrictId, findByAccountId, findByPhone
}