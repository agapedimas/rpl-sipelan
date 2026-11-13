const AccountService = require("../services/account.service");
const AuthenticationService = require("../services/authentication.service");

const FormatterUtil = require("../utils/formatter.util");
const ResponseUtil = require("../utils/response.util");

/** @type {import("express").RequestHandler} */
async function checkAccountExistenceForOtp(req, res, next) {
    const phone = req.body.phone;
    const account = await AccountService.findByPhone(phone);

    if (account == null) {
        // If account is not registered yet, then ask the user to sign up
        return ResponseUtil.sendApiResponse(res, 200, null, { redirectUrl: "/signup?phone=" + encodeURIComponent(phone) });
    }
    else {
        // Assign OTP info to session and continue to request OTP
        req.session.otpInfo = { 
            accountId: account.id,
            accountPhone: FormatterUtil.censorPhoneNumber(account.phone),
            accountName: account.name
        };
        return next();
    }
}

/** @type {import("express").RequestHandler} */
async function checkIfAuthenticationNeeded(req, res, next) {
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
async function checkIfAuthenticationNeededAndRedirect(req, res, next) {
    const authenticationId = req.session.authenticationId;

    // Check if user already signed in
    if (await AuthenticationService.isSignedIn(authenticationId) === true) {
        // Redirect to their dashboard page
        const accountId = req.session.accountId;
        const accountRole = await AccountService.getRole(accountId);

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

/** @type {import("express").RequestHandler} */
async function checkIfOtpPending(req, res, next) {
    const otpInfo = req.session.otpInfo;
    if (otpInfo == null) {
        // If there are no otp pending, redirect to sign in page.
        return res.redirect("/signin");
    }
    else {
        // Assign data to page renderer
        res.locals = otpInfo;
        return next();
    }
}

module.exports = {
    checkAccountExistenceForOtp,
    checkIfOtpPending,
    checkIfAuthenticationNeeded,
    checkIfAuthenticationNeededAndRedirect
}