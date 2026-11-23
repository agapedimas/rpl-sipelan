const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");
const LanguageUtil = require("../utils/language.util");

const Account = require("../models/account.model");
const AccountService = require("../services/account.service");
const DistrictService = require("../services/district.service");
const OtpService = require("../services/otp.service");

/** 
 * If user ask to change their Phone Number, then give them an OTP verification.
 * @type {import("express").RequestHandler} 
 */
async function checkIfPhoneNumberChanged(req, res, next) {
    const { phone, otpCode } = req.body;
    const accountId = req.session.accountId;

    // Ignore if Phone Number is not changed
    if (ValidatorUtil.areFieldsEmpty([phone]) === true)
        return next();

    // Check if user already asked for OTP and they give their OTP code.
    if (ValidatorUtil.areFieldsEmpty([otpCode]) === true) {
        OtpService.generateOtp(accountId);
        return ResponseUtil.sendApiResponse(res, 200, null, { requireOtp: true });
    }
    else {
        const isValid = OtpService.verifyOtp(accountId, parseInt(otpCode));
        if (isValid)
            return next();
        else
            return ResponseUtil.sendApiResponse(res, 401, "Invalid OTP code.");
    }
}

/** 
 * Make sure required fields are providen
 * @type {import("express").RequestHandler} 
 */
async function checkRequiredFields(req, res, next) {
    const { phone, name, districtId, role, nik } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([phone, name, districtId, role]) === true) {
        return ResponseUtil.sendApiResponse(res, 422, "Phone, Name, DistrictId, and Role are required.");
    }

    return next();
}

/** 
 * Make sure given Phone Number, Name, and NIK are valid
 * @type {import("express").RequestHandler} 
 */
async function checkValidity(req, res, next) {
    const { phone, name, districtId, role, nik } = req.body;

    if (phone != null) {
        const phoneValidationResult = ValidatorUtil.checkPhoneNumberValidity(phone);
        if (phoneValidationResult !== "OK")
            return ResponseUtil.sendApiResponse(res, 400,
                LanguageUtil.getString(req.session.languageId, "account.phone.errors." + phoneValidationResult));
    }

    if (name != null) {
        const nameValidationResult = ValidatorUtil.checkEntityNameValidity(name);
        if (nameValidationResult !== "OK")
            return ResponseUtil.sendApiResponse(res, 400,
                LanguageUtil.getString(req.session.languageId, "account.name.errors." + nameValidationResult));
    }

    if (nik != null) {
        const nikValidationResult = ValidatorUtil.checkEntityNameValidity(name);
        if (nikValidationResult !== "OK")
            return ResponseUtil.sendApiResponse(res, 400,
                LanguageUtil.getString(req.session.languageId, "account.nik.errors." + nikValidationResult));
    }

    return next();
}

/** 
 * Make sure given Role and District' ID exist
 * @type {import("express").RequestHandler} 
 */
async function checkExistence(req, res, next) {
    const { phone, name, districtId, role, nik } = req.body;

    if (districtId != null) {
        if (DistrictService.doesDistrictExist(districtId) == false)
            return ResponseUtil.sendApiResponse(res, 400, "District with id '" + districtId + "' does not exist.");
    }

    if (role != null) {
        if (AccountService.doesRoleExist(role) === false)
            return ResponseUtil.sendApiResponse(res, 400, "Role '" + role + "' does not exist.");
    }

    return next();
}

/** 
 * Make sure Phone Number is not already used
 * @type {import("express").RequestHandler} 
 */
async function checkDuplicates(req, res, next) {
    const { phone, name, districtId, role, nik } = req.body;

    // Make sure phone number is not already used
    const phoneOwner = await AccountService.findByPhone(phone);
    if (phoneOwner !== null) {
        // If the phone number is their own, ignore then
        if (phoneOwner.id == req.session.accountId) {
            delete req.body.phone;
        }
        else {
            return ResponseUtil.sendApiResponse(res, 409, "Account with phone number '" + phone + "' is already used on another account.");
        }
    }

    return next();
}

module.exports = {
    checkIfPhoneNumberChanged,
    checkRequiredFields,
    checkValidity,
    checkExistence,
    checkDuplicates
}