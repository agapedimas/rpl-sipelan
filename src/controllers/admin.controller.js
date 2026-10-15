const Accounts = require("../repositories/account.repository");
const Authentications = require("../repositories/authentication.repository");

async function preRender(req, res, next) {
    const account = await Accounts.getByAuthenticationId(req.session.authenticationId);
    
    Object.assign(req.variables, {
        activeUser: {
            id: account?.id,
            email: account?.email,
            fullname: account?.fullname,
            pictureId: account?.pictureId,
            role: account?.role,
            created: account?.created
        }
    });

    return next();
}

module.exports = {
    preRender
}