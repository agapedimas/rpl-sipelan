const AccountService = require("../services/account.service");
const AuthenticationService = require("../services/authentication.service");

async function doesNeedAuthentication(req, res, next) {
    const accountId = req.session.accountId;
    const authenticationId = req.session.authenticationId;

    // Check if user already signed in
    if (await AuthenticationService.isSignedIn(accountId) === true) {
        return res.status(400).send({ message: "User is already signed in." });
    }
    else {
        return next();
    }
}

async function doesNeedAuthenticationAndRedirect(req, res, next) {
    const accountId = req.session.accountId;
    const authenticationId = req.session.authenticationId;

    // Check if user already signed in
    if (await AuthenticationService.isSignedIn(accountId) === true) {
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
    doesNeedAuthentication,
    doesNeedAuthenticationAndRedirect
}