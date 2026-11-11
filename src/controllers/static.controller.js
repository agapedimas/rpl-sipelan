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

module.exports = {
    map
}