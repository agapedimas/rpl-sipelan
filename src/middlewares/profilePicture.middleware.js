const Accounts = require("../repositories/accounts.repositories");
const Authentications = require("../repositories/authentications.repositories");

const Controller = require("../controllers/profilePicture.controller");

async function checkPictureIdMatch(req, res, next) {
    const accountId = req.params.accountId;
    const givenPictureId = req.params.pictureId;
    const databasePictureId = await Accounts.getPictureId(accountId);
    
    // Check if picture id is match and is not null
    if (databasePictureId && givenPictureId == databasePictureId) {
        return next();
    }
    // If doesn't match, return error
    else {
        res.status(400);
        return Controller.getDefaultProfilePicture(req, res, next);
    }
}
async function checkAccess(req, res, next) {
    const givenAccountId = req.params.accountId;
    const senderAccount = await Accounts.getByAuthenticationId(req.session.authenticationId);

    // Check if sender requested to change its own account 
    if (givenAccountId == senderAccount?.id)
        return next();
    else
        return res.api.sendError(403);
}
function checkValidity(req, res, next) {
    // Make sure it's not beyond limit
    const buffer = req.files.file.data;

    // Check if file size is at maximum 3 MB
    if (buffer.length > 3000000)
        return res.api.sendError(400);
    else
        return next();
}

module.exports = {
    checkPictureIdMatch,
    checkAccess,
    checkValidity
}