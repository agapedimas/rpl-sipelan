const crypto = require("crypto");

const OTP = require("../models/otp.model");
const Account = require("../models/account.model");

/**
 * Generate random 6-digit code
 * @returns { number } 6-digit code
 */
function generateSecure6Digit() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return 100000 + (array[0] % 900000);
}

// Map to store OTP
/** @type { Map<number, OTP>() } */
const otpList = new Map();


/**
 * Generate OTP and send it to user's phone number
 * @param { typeof Account.prototype.id } accountId 
 * @returns { void }
 */
function generateOtp(accountId) {
    const code = generateSecure6Digit();

    // If code is already available and still valid, then regenerate
    const oldOtp = otpList.get(code);
    if (oldOtp != null && oldOtp.isValid === true) {
        return generateOtp(accountId);
    }

    // Store to map
    const otp = new OTP(code, accountId);
    otpList.set(code, otp);

    console.log("OTP for '" + accountId + "' is: " + code);
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { number } code 
 * @returns { boolean } Validation result
 */
function validateOtp(accountId, code) {
    const otp = otpList.get(code);
    if (otp == null)
        return false;
    else if (otp.accountId !== accountId)
        return false;
    else if (otp.isValid === false)
        return false;

    otp.useCode();
    return true;
}

module.exports = {
    generateOtp,
    validateOtp
}