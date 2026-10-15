const Authentications = require("../repositories/authentication.repository");
const Validator = require("../utils/validator.util");
const Language = require("../utils/language.util");

async function needAuthAndRedirect(req, res, next) {
    const authenticationId = req.session.authenticationId;
    // Check if user already signed in
    if (await Authentications.checkAccess(authenticationId) == true) {
        return res.redirect("/admin");
    }
    // Continue to Sign In / Sign Up page
    else {
        return next();
    }
} 

async function validateSignInInput(req, res, next) {
    /** @typedef { string } */
    req.body.email = req.body.email?.trim();
    req.body.password = req.body.password?.trim();

    if (!req.body.email || !req.body.password)
        return res.api.sendError(422);

    return next();
}

async function validateSignUpInput(req, res, next) {
    req.body.email = req.body.email?.trim();
    req.body.password = req.body.password?.trim();
    req.body.fullname = req.body.fullname?.trim();

    const validateEmail = Validator.checkEmail(req.body.email);
    const validatePassword = Validator.checkPassword(req.body.password);
    const validateFullname = Validator.checkEntityName(req.body.fullname);

    if (validateEmail !== "OK")
        return res.api.sendError(422, validateEmail);

    if (validatePassword !== "OK")
        return res.api.sendError(422, validatePassword);

    if (validateFullname !== "OK")
        return res.api.sendError(422, validateFullname);

    return next();
}


module.exports = {
    needAuthAndRedirect,
    validateSignInInput,
    validateSignUpInput
}