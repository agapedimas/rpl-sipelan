const Account = require("../models/account.model");
const Authentication = require("../models/authentication.model");
const OTP = require("../models/otp.model");

const AuthenticationRepository = require("../repositories/authentication.repository");

const OtpService = require("../services/otp.service");

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof OTP.prototype.code } otpCode 
 * @param { boolean }
 */
function signIn(accountId, otpCode) {
    const isValid = OtpService.validateOtp(accountId, otpCode);
    return isValid;
}

/**
 * @param { typeof Authentication.prototype.id } authenticationId 
 * @param { Promise<boolean> }
 */
async function signOut(authenticationId) {
    const isSuccess = await AuthenticationRepository.remove(authenticationId);
    return isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { Promise<boolean> }
 */
async function isSignedIn(accountId) {
    const isAuthenticated = await AuthenticationRepository.isAuthenticated(accountId);
    return isAuthenticated;
}

module.exports = {
    signIn,
    signOut,
    isSignedIn
}