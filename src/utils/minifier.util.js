const fs = require("fs");
const path = require("path");

const Configurations = require("../configurations");
const MINIFY_CONFIG = Configurations.get("minify");

const HtmlMinifier = require("html-minifier");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");

const cacheFolderPath = path.resolve(__dirname, "../../caches");

/**
 * Minify HTML
 * @param { string } filePath 
 * @param { string? } cacheName Provide if caching is preferred. Supports directories such as "/utils/forms.min.js"
 * @returns { Promise<string?> }
 */
function minifyHtml(filePath, cacheName) {
    return new Promise(function(resolve) {
        if (cacheName) {
            const cachedFile = getFromCache(cacheName);
            if (cachedFile)
                return resolve(cachedFile);
        }

        let input;
        if (fs.existsSync(filePath))
            input = fs.readFileSync(filePath, { encoding: "utf-8" });
        else
            return resolve();
    
        const output = HtmlMinifier.minify(input, MINIFY_CONFIG.htmlOptions);
        resolve(output);

        if (cacheName)
            saveToCache(cacheName, output);
    });
}

const _cleanCss = new CleanCSS(MINIFY_CONFIG.cssOptions);
/**
 * Minify CSS
 * @param { string } filePath 
 * @param { string? } cacheName Provide if caching is preferred. Supports directories such as "/utils/forms.min.js"
 * @returns { Promise<string?> }
 */
function minifyCss(filePath, cacheName) {
    return new Promise(async function(resolve) {
        if (cacheName) {
            const cachedFile = getFromCache(cacheName);
            if (cachedFile)
                return resolve(cachedFile);
        }

        let input;
        if (fs.existsSync(filePath))
            input = fs.readFileSync(filePath, { encoding: "utf-8" });
        else
            return resolve();
    
        const output = await _cleanCss.minify(input);

        if (output.errors?.length) {
            console.error(output.errors);
            return resolve(input);
        }
        else {
            resolve(output.styles);
            if (cacheName)
                saveToCache(cacheName, output.styles);
        }
    });
}

/**
 * Minify JS
 * @param { string } filePath 
 * @param { string? } cacheName Provide if caching is preferred. Supports directories such as "/utils/forms.min.js".
 * @returns { Promise<string?> }
 */
function minifyJs(filePath, cacheName) {
    return new Promise(function(resolve) {
        if (cacheName) {
            const cachedFile = getFromCache(cacheName);
            if (cachedFile)
                return resolve(cachedFile);
        }

        let input;
        if (fs.existsSync(filePath))
            input = fs.readFileSync(filePath, { encoding: "utf-8" });
        else
            return resolve();
    
        const output = UglifyJS.minify(input, MINIFY_CONFIG.jsOptions);

        if (output.error) {
            console.error(output.error);
            return resolve(input);
        }
        else {
            resolve(output.code);
            if (cacheName)
                saveToCache(cacheName, output.code);
        }
    });
}

/**
 * Get minified file from cache if exists
 * @param { string } cacheName Supports directories such as "/utils/forms.min.js"
 * @returns { string? }
 */
function getFromCache(cacheName) {
    const cacheFilePath = cacheFolderPath + "/" + cacheName;

    if (fs.existsSync(cacheFilePath))
        return fs.readFileSync(cacheFilePath, { encoding: "utf-8" });
}

/**
 * Save to cache
 * @param { string } cacheName Supports directories such as "/utils/forms.min.js"
 * @param { string } minified
 * @returns { void }
 */
function saveToCache(cacheName, minified) {
    let cacheFolderPathWithDirectories = cacheFolderPath;
    // Check if cache includes directories
    if (cacheName.includes("/")) {
        const directories = cacheName.split("/").filter(Boolean);
        cacheName = directories.pop();
        cacheFolderPathWithDirectories += "/" + directories.join("/");
    }

    // Create folder if path with directories does not exist
    if (fs.existsSync(cacheFolderPathWithDirectories) === false)
        fs.mkdirSync(cacheFolderPathWithDirectories, { recursive: true });

    const cacheFilePath = cacheFolderPathWithDirectories + "/" + cacheName;
    fs.writeFileSync(cacheFilePath, minified, { encoding: "utf-8" });
}

module.exports = {
    minifyHtml,
    minifyCss,
    minifyJs
}