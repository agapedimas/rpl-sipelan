const path = require("path");
const fs = require("fs");

const Configurations = require("../configurations");

const LanguageUtil = require("../utils/language.util");

/**
 * Create middleware to render a page located inside `./views`.
 * @param { object } data
 * @param { string } pageName EJS filename located inside `./views/pages`.
 * @param { string } [pageType="main"] Subfolder inside `./views/pages`.
 * @param { string } [layoutName="main"] Layout filename located inside `./views/layouts`.
 * @returns { import("express").RequestHandler }
 */
function sendRenderedPage(data, pageName, pageType = "main", layoutName = "main") {
    const alphanumericRegex = /[A-Za-z0-9]/;
    const alphanumericPathRegex = /^[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*$/;

    if (alphanumericPathRegex.test(pageName) === false)
        throw new Error("Page name should only contain alphanumeric characters or a valid directory path.");

    if (alphanumericRegex.test(pageType) === false)
        throw new Error("Page type should only contain alphanumeric characters.");

    if (alphanumericRegex.test(layoutName) === false)
        throw new Error("Layout name should only contain alphanumeric characters.");

    const pageViewsFolderPath = path.resolve(__dirname, "../views/pages");
    const pageViewPath = path.resolve(
        pageViewsFolderPath,
        pageType,
        pageName + ".ejs"
    );
    const pageViewPathWithIndex = path.resolve(
        pageViewsFolderPath,
        pageType,
        pageName + "/index" + ".ejs"
    );
    const pageNameWithIndex = pageName + "/index";

    return function (req, res, next) {
        // Check if path/to/file.ejs does not exist
        if (fs.existsSync(pageViewPath) === false) {
            // Check if path/to/file/index.ejs does exist
            if (fs.existsSync(pageViewPathWithIndex) === true) {
                // Change pageName with index to locate the .ejs file
                pageName = pageNameWithIndex;
            }
            else {
                return sendErrorPage(404)(req, res, next);
            }
        }

        const languageId = req.session.languageId;
        const language = (key) => LanguageUtil.getString(languageId, key) || key;
        const app = Configurations.get("app");

        return res.render(
            "pages/" + pageType + "/" + pageName,
            {
                layout: "layouts/" + layoutName,
                data,
                app,
                language,
                pageType
            }
        );
    };
}

function sendErrorPage(code = 500) {
    if ([403, 404, 500].includes(code) == false)
        code = 500;

    return async function (req, res, next) {
        return sendRenderedPage({}, code, "error", "error")(req, res, next);
    };
}

module.exports = {
    sendRenderedPage, sendErrorPage
}