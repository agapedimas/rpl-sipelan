const path = require("path");
const fs = require("fs");

const express = require("express");
const expressBodyParser = require("body-parser");
const expressFileUpload = require("express-fileupload");
const expressSession = require("express-session");
const expressMySqlSession = require("express-mysql-session")(expressSession);
const expressLayouts = require("express-ejs-layouts");
const expressMinifyHtml = require("express-minify-html");

const Database = require("./database");
const Configurations = require("./configurations");
const Language = require("./utils/language.util");
const Server = express();

async function initialize() {
    initializeSessions();
    initializeParser();
    initializeMinifier();
    initializeCaching();
    initializeLayouts();

    // Read every routes components
    require("./routes/language.route");
    require("./routes/authentication.route");
    require("./routes/account.route");
    require("./routes/static.route");

	const appPort = Configurations.get("app").port;

	Server
		.listen(appPort, function()  
		{
			if (process.env.production) {
				console.log("Server is ready");
			}
			else {
				console.log("Server for development is ready. Go to http://localhost:" + appPort);
				console.error("This server is running under development mode.");
			}
		});
}

function initializeSessions() {
    const dbPool = Database.getPool();
    const sessionStore = new expressMySqlSession({}, dbPool);

    Server.use(expressSession({
        key: "session_cookie_name",
        // A secret key used to sign the session ID cookie.
        // This should be a long, random string stored in environment variables for security.
        secret: process.env.SESSION_KEY,
        // Prevents saving a session that is "uninitialized" (new but not modified).
        // This reduces server storage usage and helps with privacy compliance.
        saveUninitialized: false,
        cookie: { 
            httpOnly: "auto",
            secure:  "auto",
            // Cookies saved for 1 year
            maxAge: 12 * 30 * 24 * 60 * 60 * 1000
        },
        store: sessionStore,
        resave: false 
    }));
}

function initializeParser() {
    Server.use(expressBodyParser.urlencoded({ limit: "50mb", extended: true }));
    Server.use(expressBodyParser.json({ limit: "50mb" }));
    Server.use(expressFileUpload());
    Server.set("trust proxy", true);

    Server.use(function(req, res, next) {
        if (!req.session.languageId)
            req.session.languageId = Language.SUPPORTED_LANGUAGES[0];

        next();
    });

    const throttle = Configurations.get("app")?.throttle;
    if (throttle.enabled == true) {
        Server.use(function(req, res, next) {
            setTimeout(next, throttle.delayTime || 0);
        })
    }
}

function initializeMinifier() {
    const minifyConfig = Configurations.get("minify");

    if (minifyConfig.enabled !== true)
        return;
    
    Server.use(expressMinifyHtml({
        override: true,
        exception_url: false,
        htmlMinifier: minifyConfig.htmlOptions
    }));
}

function initializeCaching() {
    Server.use(async function(req, res, next) {
        const file = {
    		icons: /\.(?:ico)$/i,
    		fonts: /\.(?:ttf|woff2)$/i,
    		images:/\.(?:png|webp|jpg|jpeg|bmp|svg)$/i
        }
    	
    	for (const [key, value] of Object.entries(file)) {
    		if (value.test(req.url)) {
                // Cache for 1 day
    			res.header("Cache-Control", "public, max-age=86400");
			}
			else if (req.query.cache == "false") {
				res.header("Cache-Control", "no-cache, no-store, must-revalidate");
				res.header("Pragma", "no-cache");
				res.header("Expires", "0");
			}
    	}

        next();
    });
}

function initializeLayouts() {
    Server.set("view engine", "ejs");
    Server.set("views", path.join(__dirname, "./views"));
    Server.use(expressLayouts);
}

// Methods for accepting HTTP requests
/** @type {typeof Server.get} */
const getMapping = (...args) => Server.get(...args);
/** @type {typeof Server.post} */
const postMapping = (...args) => Server.post(...args);
/** @type {typeof Server.put} */
const putMapping = (...args) => Server.put(...args);
/** @type {typeof Server.patch} */
const patchMapping = (...args) => Server.patch(...args);
/** @type {typeof Server.delete} */
const deleteMapping = (...args) => Server.delete(...args);

/**
 * Method to standardize API responses
 * @param { import("express").Response } res 
 * @param { number } code 
 * @param { string } message 
 * @param { object } data 
 */
function sendApiResponse(res, code = 200, message, data) {
    if (res == null)
        throw new Error("Please specify Express Response");

    return res.status(code).send({ message, data });
}

/**
 * Create middleware to render a page located inside `./views`.
 * @param { object } data
 * @param { string } pageName EJS filename located inside `./views/pages`.
 * @param { string } [pageType="main"] Subfolder inside `./views/pages`.
 * @param { string } [layoutName="main"] Layout filename located inside `./views/layouts`.
 * @returns { import("express").RequestHandler }
 */
function sendRenderedPage(data, pageName, pageType = "main", layoutName = "main") {
    const alphanumericRegex = /[^A-Za-z0-9]/;

    if (alphanumericRegex.test(pageName))
        throw new Error("Page name should only contain alphanumeric characters.");

    if (alphanumericRegex.test(pageType))
        throw new Error("Page type should only contain alphanumeric characters.");

    if (alphanumericRegex.test(layoutName))
        throw new Error("Layout name should only contain alphanumeric characters.");

    const pageViewsFolderPath = path.resolve(__dirname, "./views/pages");
    const pageViewPath = path.resolve(
        pageViewsFolderPath,
        pageType,
        pageName + ".ejs"
    );

    return function (req, res, next) {
        if (fs.existsSync(pageViewPath) === false)
            return sendErrorPage(404)(req, res, next);

        const languageId = req.session.languageId;
        const language = (key) => Language.getString(languageId, key) || key;
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

/**
 * Method to send static files located in `/src/public/`
 * @param { import("express").Request } req 
 * @param { import("express").Response } res 
 * @param { import("express").NextFunction } next 
 */
async function sendStaticFile(req, res, next) {
    const refinedPath = req.path || "/";
    const publicFolderPath = path.resolve(__dirname, "./public/");

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
    }
    
    return next();
}

function sendErrorPage(code = 500) {
    if ([403, 404, 500].includes(code) == false)
        code = 500;

    return async function (req, res, next) {
        return sendRenderedPage({}, code, "error", "error")(req, res, next);
    };
}

module.exports = {
    initialize,
    getMapping, postMapping, putMapping, patchMapping, deleteMapping,
    sendApiResponse, sendRenderedPage, sendStaticFile, sendErrorPage
}