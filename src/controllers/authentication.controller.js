const ResponseUtil = require("../utils/response.util");

const AccountService = require("../services/account.service");
const AuthenticationService = require("../services/authentication.service");


/** @type {import("express").RequestHandler} */
async function requestOtp(req, res, next) {
    const accountId = req.session.otpInfo?.accountId;
    const isSuccess = await AuthenticationService.requestOtp(accountId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200, null, { redirectUrl: "/signin/verify" });
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function verifyOtp(req, res, next) {
    const accountId = req.session.otpInfo?.accountId;
    const otpCode = req.body.otpCode;

    const isValid = await AuthenticationService.verifyOtp(accountId, otpCode);
    if (isValid) {
        return next();
    }
    else {
        return ResponseUtil.sendApiResponse(res, 401, "Invalid OTP code.");
    }
}

async function cancelOtp(req, res, next) {
    delete req.session.otpInfo;
    return res.redirect("/signin");
}

/** @type {import("express").RequestHandler} */
async function signIn(req, res, next) {
    const accountId = req.session.otpInfo.accountId;
    const authenticationId = await AuthenticationService.signIn(accountId, req.ip);
    if (authenticationId) {
        // Store authentication id and account id to encrypted cookies
        req.session.authenticationId = authenticationId;
        req.session.accountId = accountId;
        // Delete otp info
        delete req.session.otpInfo;
        return ResponseUtil.sendApiResponse(res, 200, null);
    }
    else {
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
    }
}

/** @type {import("express").RequestHandler} */
async function signUpAsCitizen(req, res, next) {
    req.body.role = "citizen";
    return next();
}

/** @type {import("express").RequestHandler} */
async function signOut(req, res, next) {
    const authenticationId = req.session.authenticationId;
    if (authenticationId != null) {
        await AuthenticationService.signOut(authenticationId);
        delete req.session.authenticationId;
        delete req.session.accountId;
    }

    return res.redirect("/signin");
}

module.exports = {
    requestOtp, verifyOtp, cancelOtp,
    signIn, signUpAsCitizen, signOut
}