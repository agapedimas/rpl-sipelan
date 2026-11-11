const path = require("path");

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
    require("./routes/ping.route");
    require("./routes/language.route");
    require("./routes/authentication.route");
    require("./routes/admin.route");
    require("./routes/account.route");
    require("./routes/main.route");

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

        req.variables = {};

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
    Server.set("layout", "layouts/main");
}

function getServer() {
    return Server;
}

module.exports = {
    initialize,
    getServer
}