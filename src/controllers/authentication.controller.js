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

async function signIn(req, res, next) {
    const accountId = req.body.accountId;
    const otpCode = req.body.otpCode;

    const isValid = await AuthenticationService.verifyOtp(accountId, otpCode);
    if (isValid) {
        // If valid, sign the user in
        const authenticationId = await AuthenticationService.signIn(accountId, req.ip);
        if (authenticationId) {
            return res.status(201).send({ authenticationId: authenticationId });
        }
        else {
            return res.status(400).send({ message: "Something went wrong. "});
        }
    }
    else {
        return res.status(401).send({ message: "Invalid OTP code. "});
    }
}

async function signUp(req, res, next) {
    return res.api.sendError(501, "Not yet implemented.");
    
    const email = req.body.email;
    const password = req.body.password;
    const fullname = req.body.fullname;

    const accountId = await Accounts.add(email, fullname, password, "member");
    // Signs in new account
    const authenticationId = await Authentications.add(accountId, req.ip);
    req.session.authenticationId = authenticationId;
    return res.api.sendSuccess();
}

async function signOut(req, res, next) {
    if (req.session.authenticationId) {
        await Authentications.remove(req.session.authenticationId);
        delete req.session.authenticationId;
    }

    return res.redirect("/signin");
}

module.exports = {
    signIn, signUp, signOut
}