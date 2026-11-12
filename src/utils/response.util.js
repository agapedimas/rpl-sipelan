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