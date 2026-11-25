const ResponseUtil = require("../utils/response.util");
const AccountService = require("../services/account.service");

/** @type {import("express").RequestHandler} */
async function redirectToDefaultRoleDashboardPage(req, res) {
    const accountId = req.session.accountId;
    const accountRole = await AccountService.getRole(accountId);

    if (accountRole == "officer")
        return res.redirect("/officer/reports");
    if (accountRole == "volunteer")
        return res.redirect("/volunteer/reports");
    if (accountRole == "admin")
        return res.redirect("/admin/officers");

    return res.redirect("/reports");
}

/**
 * Redirect from / to role's dashboard
 * @type {import("express").RequestHandler}
 */
async function checkIfNeedRedirectToRoleDashboard(req, res, next) {
    const accountId = req.session.accountId;

    // If user is not signed in, ignore.
    // Official reports can be accessed by anyone without authentication required.
    if (accountId == null)
        return next();

    const accountRole = await AccountService.getRole(accountId);
    // If user is an officer/volunteer/admin, redirect to their own dashboard.
    if (accountRole != "citizen") {
        return res.redirect("/" + accountRole);
    }

    return next();
}

module.exports = {
    redirectToDefaultRoleDashboardPage
}