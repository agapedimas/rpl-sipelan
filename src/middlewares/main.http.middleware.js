const Account = require("../models/account.model");
const AccountService = require("../services/account.service");

const ResponseUtil = require("../utils/response.util");

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
        return ResponseUtil.sendApiResponse(res, 403, "You do not have required access to perform this action.");
}



/** @type {import("express").RequestHandler} */
async function viewAsCitizen(req, res, next) {
    return viewAs("citizen", req, res, next);
}
/** @type {import("express").RequestHandler} */
async function viewAsVolunteer(req, res, next) {
    return viewAs("volunteer", req, res, next);
}
/** @type {import("express").RequestHandler} */
async function viewAsOfficer(req, res, next) {
    return viewAs("officer", req, res, next);
}
/** @type {import("express").RequestHandler} */
async function viewAsAdmin(req, res, next) {
    return viewAs("admin", req, res, next);
}



/** @type {import("express").RequestHandler} */
async function accessAsCitizen(req, res, next) {
    return accessAs(["citizen"], req, res, next);
}
/** @type {import("express").RequestHandler} */
async function accessAsVolunteer(req, res, next) {
    return accessAs(["volunteer"], req, res, next);
}
/** @type {import("express").RequestHandler} */
async function accessAsOfficer(req, res, next) {
    return accessAs(["officer"], req, res, next);
}
/** @type {import("express").RequestHandler} */
async function accessAsAdmin(req, res, next) {
    return accessAs(["admin"], req, res, next);
}
/** @type {import("express").RequestHandler} */
async function accessAsVolunteerOrOfficer(req, res, next) {
    return accessAs(["volunteer", "officer"], req, res, next);
}

/** @type {import("express").RequestHandler} */
async function accessAsCitizenOrVolunteerOrOfficer(req, res, next) {
    return accessAs(["citizen", "volunteer", "officer"], req, res, next);
}




module.exports = {
    viewAsCitizen, viewAsVolunteer, viewAsOfficer, viewAsAdmin,
    accessAsCitizen, accessAsVolunteer, accessAsOfficer, accessAsAdmin,
    accessAsVolunteerOrOfficer,
    accessAsCitizenOrVolunteerOrOfficer
}