const Language = require("../utils/language.util");

function setLanguage(req, res, next) {
    if (Language.SUPPORTED_LANGUAGES.includes(req.params.languageId)) {
        req.session.languageId = req.params.languageId;
        return res.api.sendSuccess();
    }
    else {
        return res.api.sendError(404, "Language is not available.");
    }
}

function getLanguagedFile(req, res, next) {
    if (Language.SUPPORTED_LANGUAGES.includes(req.params.languageId)) {
        // If user visit page with language path
        if (req.path.endsWith(".js") == false && req.path.endsWith(".css") == false) {
            req.session.languageId = req.params.languageId;
            return res.redirect("/" + req.params[0]);
        }

        req.filePath = "./public/" + req.params[0];
    }

    return next();
}

module.exports = {
    setLanguage,
    getLanguagedFile
}