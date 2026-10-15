const Accounts = require("../repositories/account.repository");
const Authentications = require("../repositories/authentication.repository");

async function signIn(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    
    const isValid = await Authentications.checkCredentials(email, password);

    if (isValid == true) {
        const account = await Accounts.getByEmail(email);
        const authenticationId = await Authentications.add(account.id, req.ip);
        req.session.authenticationId = authenticationId;
        // If success, redirect to home page
        return res.api.sendSuccess({ url: "/admin/" });
    }
    else {
        return res.api.sendError(401, "Email or password is incorrect.");
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