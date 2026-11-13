/** @type {import("express").RequestHandler} */
async function redirectToReportPage(req, res) {
    return res.redirect("/reports");
}

module.exports = {
    redirectToReportPage
}