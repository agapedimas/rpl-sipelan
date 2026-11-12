const AccountService = require("../services/account.service");
const AuthenticationService = require("../services/authentication.service");

const ResponseUtil = require("../utils/response.util");

/** @type {import("express").RequestHandler} */
async function checkAccountExistenceForOtp(req, res, next) {
    const phone = req.body.phone;
    const account = await AccountService.findByPhone(phone);

    if (account == null) {
        // signup
        return ResponseUtil.sendApiResponse(res, 200, "");
    }
    else {
        // Save account id to user's session and continue to request OTP
        req.session.accountId = account.id;
        return next();
    }
}

/** @type {import("express").RequestHandler} */
async function doesNeedAuthentication(req, res, next) {
    const accountId = req.session.accountId;
    const authenticationId = req.session.authenticationId;

    // Check if user already signed in
    if (await AuthenticationService.isSignedIn(authenticationId) === true) {
        return ResponseUtil.sendApiResponse(res, 400, "User is already signed in.");
    }
    else {
        return next();
    }
}
/** @type {import("express").RequestHandler} */
async function doesNeedAuthenticationAndRedirect(req, res, next) {
    const accountId = req.session.accountId;
    const authenticationId = req.session.authenticationId;

    // Check if user already signed in
    if (await AuthenticationService.isSignedIn(authenticationId) === true) {
        // Redirect to their dashboard page
        const accountRole = AccountService.getRole(accountId);
        switch(accountRole) {
            case "admin":
                return res.redirect("/admin");
            case "officer":
                return res.redirect("/officer");
            case "volunteer":
                return res.redirect("/volunteer");
            case "citizen":
                return res.redirect("/citizen");
            // If role is unknown, redirect to main page
            default:
                return res.redirect("/");
        }
    }
    // Continue to Sign In / Sign Up page
    else {
        return next();
    }
} 

module.exports = {
    checkAccountExistenceForOtp,
    doesNeedAuthentication,
    doesNeedAuthenticationAndRedirect
}