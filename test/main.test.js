
const Configurations = require("../src/configurations");

const { test, suite, before, after, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const baseUrl = "http://localhost:" + Configurations.get("app").port;

/**
 * Create a cookie jar to store and reuse session cookies.
 * @returns {{
 *     getHeader: () => string,
 *     store: (response: Response) => void
 * }}
 */
function createCookieJar() {
    const cookies = new Map();

    return {
        getHeader() {
            return Array.from(
                cookies,
                ([name, value]) => `${name}=${value}`
            ).join("; ");
        },

        store(response) {
            for (const cookie of response.headers.getSetCookie()) {
                const [pair] = cookie.split(";");
                const separator = pair.indexOf("=");

                if (separator < 0)
                    continue;

                cookies.set(
                    pair.slice(0, separator),
                    pair.slice(separator + 1)
                );
            }
        }
    };
}

/**
 * Build request URL.
 * @param { string } requestPath
 * @param { object } [query]
 * @returns { URL }
 */
function buildUrl(requestPath, query) {
    const url = new URL(requestPath, baseUrl);

    if (query != null) {
        for (const [key, value] of Object.entries(query)) {
            if (value == null)
                continue;

            if (Array.isArray(value)) {
                for (const item of value) {
                    url.searchParams.append(key, item);
                }
            }
            else {
                url.searchParams.set(key, value);
            }
        }
    }

    return url;
}

/**
 * Send HTTP request.
 * @param { string } method
 * @param { string } requestPath
 * @param { object } [options]
 * @returns { Promise<Response> }
 */
async function request(method, requestPath, options = {}) {
    const headers = new Headers(options.headers);
    const cookieHeader = options.cookieJar?.getHeader();
    if (cookieHeader)
        headers.set("cookie", cookieHeader);

    let body = options.body;
    if (
        body != null &&
        typeof body === "object" &&
        !(body instanceof FormData) &&
        !(body instanceof URLSearchParams)
    ) {
        body = JSON.stringify(body);

        if (!headers.has("content-type"))
            headers.set("content-type", "application/json");
    }

    const response = await fetch(
        buildUrl(requestPath, options.query),
        {
            method,
            headers,
            body,
            redirect: options.redirect
        }
    );

    options.cookieJar?.store(response);

    return response;
}

function getRequest(requestPath, options = {}) {
    return request("GET", requestPath, options);
}

function postRequest(requestPath, options = {}) {
    return request("POST", requestPath, options);
}

function putRequest(requestPath, options = {}) {
    return request("PUT", requestPath, options);
}

function patchRequest(requestPath, options = {}) {
    return request("PATCH", requestPath, options);
}

function deleteRequest(requestPath, options = {}) {
    return request("DELETE", requestPath, options);
}

module.exports = {
    test,
    suite,
    before,
    after,
    beforeEach, 
    afterEach,
    assert,
    request,
    getRequest,
    postRequest,
    putRequest,
    patchRequest,
    deleteRequest,
    createCookieJar
};
