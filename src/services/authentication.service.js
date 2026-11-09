const Account = require("../models/account.model");
const Authentication = require("../models/authentication.model");
const OTP = require("../models/otp.model");

const AuthenticationRepository = require("../repositories/authentication.repository");

const OtpService = require("../services/otp.service");

/**
 * @param { typeof Account.prototype.id } id
 * @returns { Promise<boolean> }
 */
async function requestOtp(accountId) {
    const isSuccess = OtpService.generateOtp(accountId);
    return isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof OTP.prototype.code } otpCode 
 * @param { boolean }
 */
function verifyOtp(accountId, otpCode) {
    const isValid = OtpService.verifyOtp(accountId, otpCode);
    return isValid;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Authentication.prototype.ipAddress } ipAddress 
 * @returns { Promise<typeof Authentication.prototype.id }
 */
async function signIn(accountId, ipAddress) {
    const authenticationId = await AuthenticationRepository.add(accountId, ipAddress);
    return authenticationId;
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
    requestOtp,
    verifyOtp,
    signIn,
    signOut,
    isSignedIn
}