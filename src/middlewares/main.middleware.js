const Account = require("../models/account.model");
const AccountService = require("../services/account.service");

/**
 * Check for requester role to view pages
 * @param { typeof Account.prototype.role } allowedRole 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function viewAs(allowedRole, req, res, next) {
    const accountId = req.session.accountId;
    const accountRole = await AccountService.getRole(accountId);

    if (accountRole === allowedRole)
        return next();
    else
        return res.redirect("/signin?continue=" + decodeURIComponent(req.url));
}

/**
 * Check for requester role to access or modify data
 * @param { Array<typeof Account.prototype.role> } allowedRoles 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function accessAs(allowedRoles, req, res, next) {
    const accountId = req.session.accountId;
    const accountRole = await AccountService.getRole(accountId);

    if (allowedRoles.includes(accountRole))
        return next();
    else
        return res.status(403).send({message: "You do not have required access to perform this action."});
}



async function viewAsCitizen(req, res, next) {
    return viewAs("citizen", req, res, next);
}
async function viewAsVolunteer(req, res, next) {
    return viewAs("volunteer", req, res, next);
}
async function viewAsOfficer(req, res, next) {
    return viewAs("officer", req, res, next);
}
async function viewAsAdmin(req, res, next) {
    return viewAs("admin", req, res, next);
}



async function accessAsCitizen(req, res, next) {
    return accessAs(["citizen"], req, res, next);
}
async function accessAsVolunteer(req, res, next) {
    return accessAs(["volunteer"], req, res, next);
}
async function accessAsOfficer(req, res, next) {
    return accessAs(["officer"], req, res, next);
}
async function accessAsAdmin(req, res, next) {
    return accessAs(["admin"], req, res, next);
}
async function accessAsVolunteerOrAdmin(req, res, next) {
    return accessAs(["volunteer", "admin"], req, res, next);
}




module.exports = {
    viewAsCitizen, viewAsVolunteer, viewAsOfficer, viewAsAdmin,
    accessAsCitizen, accessAsVolunteer, accessAsOfficer, accessAsAdmin,
    accessAsVolunteerOrAdmin
}