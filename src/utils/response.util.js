/**
 * Method to standardize API responses
 * @param { import("express").Response } res 
 * @param { number } httpCode 
 * @param { string } message 
 * @param { any } data 
 */
function sendApiResponse(res, httpCode = 200, message, data) {
    if (res == null)
        throw new Error("Please specify Express Response.");

    if (typeof httpCode !== "number")
        throw new Error("HTTP Code should be a number.");

    if (message != null && typeof message !== "string")
        throw new Error("Message should be a string.");

    return res.status(httpCode).send({ message: message, data: data });
}

export {
    sendApiResponse
}