const AccountService = require("../services/account.service");
const AuthenticationService = require("../services/authentication.service");

async function requestOtp(req, res, next) {
    const phone = req.body.phone;
    const account = await AccountService.findByPhone(phone);
    const isSuccess = await AuthenticationService.requestOtp(account.phone);

    if (isSuccess)
        return res.send({ accountId: account.id });
    else
        return res.status(500).send({ message: "Something went wrong." });
}

async function verifyOtp(req, res, next) {
    const accountId = req.body.accountId;
    const otpCode = req.body.otpCode;

    const isValid = await AuthenticationService.verifyOtp(accountId, otpCode);
    if (isValid) {
        return next();
    }
    else {
        return res.status(401).send({ message: "Invalid OTP code. "});
    }
}

async function signIn(req, res, next) {
    const authenticationId = await AuthenticationService.signIn(accountId, req.ip);
    if (authenticationId) {
        // Store authentication id and account id to encrypted cookies
        req.session.authenticationId = authenticationId;
        req.session.accountId = accountId;
        return res.status(201).send({ authenticationId: authenticationId });
    }
    else {
        return res.status(400).send({ message: "Something went wrong. "});
    }
}

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