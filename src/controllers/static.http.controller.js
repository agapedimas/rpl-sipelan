const fs = require("fs");
const path = require("path");

const Configurations = require("../configurations");
const UrlUtil = require("../utils/url.util");
const MinifierUtil = require("../utils/minifier.util");


/** @type {import("express").RequestHandler} */
async function map(req, res, next) {
    const refinedPath = UrlUtil.refinePath(req.path);

    // Redirect if the path is refined
    if (req.path !== refinedPath)
        return res.redirect(refinedPath);

    next();
}

/**
 * Method to send static files located in `/src/public/`
 * @type {import("express").RequestHandler}
 */
async function sendStaticFile(req, res, next) {
    const refinedPath = req.path || "/";
    const publicFolderPath = path.resolve(__dirname, "../public/");

    // Check if path explicitly uses extension name
    const extensionName = path.extname(refinedPath);

    if (extensionName) {
        const filePath = path.resolve(publicFolderPath + refinedPath);
        const minifyConfig = Configurations.get("minify");
        
        // Check if static files need to be minified
        if (minifyConfig.enabled === true) {
            const minifiedFilePath = refinedPath.replace(extensionName, ".min" + extensionName);
            if (extensionName === ".js") {
                const output = await MinifierUtil.minifyJs(filePath, minifiedFilePath);
                res.set("Content-Type", "application/javascript");
                return res.send(output);
            }
            else if (extensionName === ".css") {
                const output = await MinifierUtil.minifyCss(filePath, minifiedFilePath);
                res.set("Content-Type", "text/css");
                return res.send(output);
            }
        }
        else {
            return res.sendFile(filePath);
        }
    }
    else {
        const htmlFilePath = path.resolve(publicFolderPath, refinedPath + ".html");
        const htmlFilePathWithIndex = path.resolve(publicFolderPath, refinedPath, "index.html");
        
        if (fs.existsSync(htmlFilePath)) {
            return res.sendFile(htmlFilePath);
        }
        else if (fs.existsSync(htmlFilePathWithIndex)) {
            return res.sendFile(htmlFilePathWithIndex);
        }
        else {
            // Continue to send 404 error page
            return next();
        }
    }
}

module.exports = {
    map, sendStaticFile
}