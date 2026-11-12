const ResponseUtil = require("../utils/response.util");

const AccountService = require("../services/account.service");
const AuthenticationService = require("../services/authentication.service");


/** @type {import("express").RequestHandler} */
async function requestOtp(req, res, next) {
    const accountId = req.session.accountId;
    const isSuccess = await AuthenticationService.requestOtp(accountId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200, null, { redirectUrl: "/signin/verify" });
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function verifyOtp(req, res, next) {
    const accountId = req.session.accountId;
    const otpCode = req.body.otpCode;

    const isValid = await AuthenticationService.verifyOtp(accountId, otpCode);
    if (isValid) {
        return next();
    }
    else {
        return ResponseUtil.sendApiResponse(res, 401, "Invalid OTP code.");
    }
}

/** @type {import("express").RequestHandler} */
async function signIn(req, res, next) {
    const accountId = req.session.accountId;
    const authenticationId = await AuthenticationService.signIn(accountId, req.ip);
    if (authenticationId) {
        // Store authentication id and account id to encrypted cookies
        req.session.authenticationId = authenticationId;
        return ResponseUtil.sendApiResponse(res, 201, null, { authenticationId: authenticationId });
    }
    else {
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
    }
}

/** @type {import("express").RequestHandler} */
async function signOut(req, res, next) {
    if (req.session.authenticationId != null) {
        await Authentications.remove(req.session.authenticationId);
        delete req.session.authenticationId;
        delete req.session.accountId;
    }

    return res.redirect("/signin");
}

module.exports = {
    requestOtp, verifyOtp,
    signIn, signOut
}