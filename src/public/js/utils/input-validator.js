class InputValidator {
    /**
     * Check if email is valid
     * @param { string } email 
     * @returns { "OK" |  "TOO_LONG" | "INVALID" }
     */
    static checkEmail(email) {
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
    static checkEntityName(name) {
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
     * Check if phone number is valid
     * @param { string | number } phone
     * @returns { "OK" | "TOO_SHORT" | "TOO_LONG" | "INVALID" } 
     */
    static checkPhoneNumber(phone) {
        // Convert to string
        if (typeof phone === "number")
            phone += "";
        else if (typeof phone !== "string")
            return "INVALID";

        // Clear white spaces and stripes
        phone = phone.replace(/[\s\-]/g, "");
        
        // Check remaining characters
        const regex = /^\+?[0-9]+$/;
        if (regex.test(phone) == false)
            return "INVALID";

        if (phone.length < 6)
            return "TOO_SHORT";

        if (phone.length > 15)
            return "TOO_LONG";

        return "OK";
    }

    /**
     * Check if password is valid
     * @param { string } password
     * @returns { "OK" | "TOO_SHORT" | "TOO_LONG" | "INVALID" }
     */
    static checkPassword(password) {
        if (typeof password !== "string")
            return "INVALID";

        if (password.length < 8)
            return "TOO_SHORT";

        if (password.length > 64)
            return "TOO_LONG";

        return "OK";
    }
}    