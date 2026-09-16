/**
 * @typedef { {
 *      variables: {
 *          app: object,
 *          session: object
 *      },
 *      language: string
 * } } ErrorVariables
 */

/**
 * @param { {
 *      title: string,
 *      message: string,
 *      actions: Array<"back" | "homepage" | "refresh">
 *      image: "error_notfound" | "error_forbidden" | "error_trouble" | "error_working"
 * }} errorDetails
 * @param { import("express").Response} res 
 * @param { ErrorVariables } variables 
 * @param { number } httpCode
 * @returns 
 */
function sendCustomErrorPage(res, variables, errorDetails, httpCode) {
    Object.assign(variables, { 
        layout: "layouts/error",
        error: errorDetails
    });
    return res.status(httpCode).render("layouts/error", variables);
}

/**
 * 
 * @param { import("express").Response } res 
 * @param { ErrorVariables } variables 
 * @returns 
 */
function send403ErrorPage(res, variables) {
    return sendCustomErrorPage(
        res, variables,{
            title: variables.language("general.errors.page_forbidden.title"),
            message: variables.language("general.errors.page_forbidden.message"),
            actions: ["back", "homepage"],
            image: "error_forbidden"
        },
        403
    );
}
/**
 * 
 * @param { import("express").Response } res 
 * @param { ErrorVariables } variables 
 * @returns 
 */
function send404ErrorPage(res, variables) {
    return sendCustomErrorPage(
        res, variables,{
            title: variables.language("general.errors.page_not_found.title"),
            message: variables.language("general.errors.page_not_found.message"),
            actions: ["back", "homepage"],
            image: "error_notfound"
        },
        404
    );
}
/**
 * 
 * @param { import("express").Response } res 
 * @param { ErrorVariables } variables 
 * @returns 
 */
function send500ErrorPage(res, variables) {
    return sendCustomErrorPage(
        res, variables,{
            title: variables.language("general.errors.page_trouble.title"),
            message: variables.language("general.errors.page_trouble.message"),
            actions: ["refresh", "back"],
            image: "error_trouble",
        },
        500
    );
}

module.exports = {
    send403ErrorPage,
    send404ErrorPage,
    send500ErrorPage
}