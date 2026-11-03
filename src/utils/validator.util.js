/**
 * Check if field is empty.
 * 
 * Checks for string (empty), array (empty elements), and other (null value).
 * @param { Array<any> } fields
 * @returns { boolean } 
 */
function areFieldsEmpty(fields) {
    for (const field of fields) {
        if (typeof field === "string" && !field.trim())
            return true;
        else if (Array.isArray(fields) && field.length == 0)
            return true;
        else if (field == null)
            return true;
    }
    return false;
}

/**
 * Check if email is valid
 * @param { string } email 
 * @returns { "OK" |  "TOO_LONG" | "INVALID" }
 */
function checkEmailValidity(email) {
    if (typeof email !== "string")
        return "INVALID";

    if (email.length > 254)
        return "TOO_LONG";

    const regex = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;
    if (regex.test(email) == false)
        return "INVALID";

    return "OK";
}

/**
 * Check if entity name is valid
 * @param { string } name  // User's name, School's name, etc.
 * @returns { "OK" | "TOO_SHORT" | "TOO_LONG" | "INVALID" }
 */
function checkEntityNameValidity(name) {
    if (typeof name !== "string")
        return "INVALID";

    if (name.length < 3)
        return "TOO_SHORT";

    if (name.length > 255)
        return "TOO_LONG";

    const regex = /^[\p{L}\s]+$/u;
    if (regex.test(name) == false)
        return "INVALID";

    return "OK";
}

/**
 * Check if mobile number is valid
 * @param { string | number } mobile
 * @returns { "OK" | "TOO_SHORT" | "TOO_LONG" | "INVALID" } 
 */
function checkMobileNumberValidity(mobile) {
    // Convert to string
    if (typeof mobile === "number")
        mobile += "";
    else if (typeof mobile !== "string")
        return "INVALID";

    // Clear white spaces and stripes
    mobile = mobile.replace(/[\s\-]/g, "");
    
    // Check remaining characters
    const regex = /^\+?[0-9]+$/;
    if (regex.test(mobile) == false)
        return "INVALID";

    if (mobile.length < 6)
        return "TOO_SHORT";

    if (mobile.length > 15)
        return "TOO_LONG";

    return "OK";
}

/**
 * Check if nik is valid
 * @param { string | number } nik
 * @returns { "OK" | "INVALID" }
 */
function checkNikValidity(nik) {
    if (typeof nik !== "string") {
        if (typeof nik === "number")
            nik += "";
        else
            return "INVALID";
    }

    nik = nik.replace(/\D/g, "");

    if (nik.length !== 16)
        return "INVALID";

    return "OK";
}

/**
 * Check if password is valid
 * @param { string } password
 * @returns { "OK" | "TOO_SHORT" | "TOO_LONG" | "INVALID" }
 */
function checkPasswordValidity(password) {
    if (typeof password !== "string")
        return "INVALID";

    if (password.length < 8)
        return "TOO_SHORT";

    if (password.length > 64)
        return "TOO_LONG";

    return "OK";
}

module.exports = {
    areFieldsEmpty,
    checkEmailValidity,
    checkEntityNameValidity,
    checkMobileNumberValidity,
    checkNikValidity,
    checkPasswordValidity
}