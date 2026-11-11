const fs = require("fs");
const path = require("path");

const Language = require("../utils/language.util");
const Configurations = require("../configurations");
const URL = require("../utils/url.util");
const Minifier = require("../utils/minifier.util");

const ErrorController = require("./error.controller");

const publicFolderPath = "./src/public/";
const pageViewsFolderPath = "./src/views/pages/";

/** @type {import("express").RequestHandler} */
async function map(req, res, next) {
    const refinePathResult = URL.refinePath(req.path);
    const refinedPath = refinePathResult.refinedPath;

    // If the new path needs refresh
    if (refinePathResult.needRefresh == true)
        return res.redirect("/" + refinedPath);

    const languageId = req.session.languageId;
    const language = (key) => Language.getString(languageId, key) || key;
    const variables = {
        app: Configurations.get("app"),
        session: req.variables
    };

    // Define language alternatives for SEO improvement
    const appHost = Configurations.get("app").host.app;
    
    let hrefLang = "<link rel='alternate' hreflang='x-default' href='" + appHost + "/" + refinedPath + "'>";
    for (const lang of Language.SUPPORTED_LANGUAGES)
        hrefLang += "<link rel='alternate' hreflang='" + lang + "' href='" + appHost + "/" + lang + "/" + refinedPath + "'>";

    Object.assign(variables.session, { hrefLang });

    const extensionName = path.extname(refinedPath);

    // Check if path specifies file extension
    if (extensionName) {
        // Check if file exists
        if (fs.existsSync(publicFolderPath + refinedPath)) {
            const minifyConfig = Configurations.get("minify");
            if (minifyConfig.enabled === true) {
                const minifiedPath = refinedPath.replace(extensionName, ".min" + extensionName);
                if (extensionName === ".js") {
                    const output = await Minifier.minifyJs(publicFolderPath + refinedPath, minifiedPath);
                    
                    res.set("Content-Type", "application/javascript");
                    return res.send(output);
                }
                else if (extensionName === ".css") {
                    const output = await Minifier.minifyCss(publicFolderPath + refinedPath, minifiedPath);
                    
                    res.set("Content-Type", "text/css");
                    return res.send(output);
                }
            }
            return res.sendFile(publicFolderPath + refinedPath, { root: "./" });
        }
        // If file doesn't exist
        else {
            // and it's an image
            if (/(\.png|\.webp|\.jpg|\.bmp|\.jpeg)/g.test(extensionName)) {
                return res.status(404).sendFile("./src/assets/blank.png", { root: "./" });
            }
            else {
                return res.status(404).send();
            }
        }
    }
    else {
        const pageType = getPageType(refinedPath);
        const pageVariables = { language, variables, pageType };
        // Check if file exists
        // Case 1: Views
        if (fs.existsSync(pageViewsFolderPath + refinedPath + ".ejs")) {
            return res.render("pages/" + refinedPath, pageVariables);
        }
        else if (fs.existsSync(pageViewsFolderPath + refinedPath + "/index.ejs")) {
            return res.render("pages/" + refinedPath + "/index.ejs", pageVariables);
        }
        // Case 2: HTML file
        else if (fs.existsSync(publicFolderPath + refinedPath + ".html")) {
            return res.sendFile(publicFolderPath + refinedPath + ".html", { root: "./" });
        }
        else if (fs.existsSync(publicFolderPath + refinedPath + "index.html")) {
            return res.sendFile(publicFolderPath + refinedPath + "/index.html", { root: "./" });
        }
        // Case 3: File doesn't exist
        else {
            return ErrorController.send404ErrorPage(res, pageVariables);
        }
    }
}

/**
 * Get page type based on URL path
 * @param { string } path 
 * @returns { "auth" | "admin" | "main" }
 */
function getPageType(path) {
    if (path.startsWith("signin") || path.startsWith("signup"))
        return "auth";
    else if (path.startsWith("admin"))
        return "admin";
    else
        return "main";
}

module.exports = {
    map
}