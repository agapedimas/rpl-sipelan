const path = require("path");

const Authentications = require("../repositories/authentications.repositories");

async function checkAccess(req, res, next) {
    if (await Authentications.checkAccess(req.session.authenticationId, ["owner", "admin"]))
        return next();
    else
        return res.api.sendError(403);
}

async function checkAccessAndRedirect(req, res, next) {
    if (await Authentications.checkAccess(req.session.authenticationId, ["owner", "admin"]))
        return next();
    // If path doesn't specify file extension
    else if (!path.extname(req.path))
        return res.redirect("/signin?continue=" + decodeURIComponent(req.url));
    else
        return res.api.sendError(403);
}

module.exports = {
    checkAccess,
    checkAccessAndRedirect
}