/**
 * Format amount with currency
 * @param { number | string } amount 
 * @param { boolean } useFallback 
 * @returns { string }
 */
function formatAmount(amount, useFallback = true) {
    if (!amount)
        return useFallback ? "Rp0" : "";

    let parsed = parseInt(String(amount).replace(/[^0-9]/g, ""), 10);
    
    if (isNaN(parsed))
        return useFallback ? "Rp0" : "";

    return "Rp" + 
        new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 })
            .format(parsed);
}

/**
 * Format phone number
 * @param { number | string } number 
 * @param { boolean } useFallback 
 * @returns { string }
 */
function formatPhoneNumber(number, useFallback = true) {
    if (!number || /[^0-9\+\-\s]/.test(number))
        return useFallback ? "-" : "";

    number = String(number);
    number = number.replace(/\D/g, "");

    if (number.startsWith("0")) {
        number = "62" + number.substring(1);
    }
    else if (number.length > 0 && !number.startsWith("62")) {
        if (number !== "6")
            number = "62" + number;
    }

    if (number.length == 0) 
        return "";
    if (number.length <= 2) 
        return "+" + number;

    let prefix = "+" + number.substring(0, 2);
    let sisa = number.substring(2);
    let len = sisa.length;

    if (len <= 3) {
        return prefix + " " + sisa;
    } 
    else if (len >= 4 && len <= 7) {
        return prefix + " " + sisa.substring(0, 3) + "-" + sisa.substring(3);
    } 
    else if (len === 8) {
        return prefix + " " + sisa.substring(0, 3) + "-" + sisa.substring(3, 7) + "-" + sisa.substring(7);
    } 
    else if (len === 9) {
        return prefix + " " + sisa.substring(0, 3) + "-" + sisa.substring(3, 6) + "-" + sisa.substring(6);
    } 
    else {
        return prefix + " " + sisa.substring(0, 3) + "-" + sisa.substring(3, 7) + "-" + sisa.substring(7, 13);
    }
}

/**
 * Format censored phone number
 * @param { number | string } number 
 * @param { boolean } useFallback 
 * @returns { string }
 */
function censorPhoneNumber(number, useFallback = true) {
    const formattedPhoneNumber = formatPhoneNumber(number);
    if (!formattedPhoneNumber)
        return useFallback ? "-" : "";

    return "+62********" + formattedPhoneNumber.slice(-3);
}

/**
 * Format short date and time
 * @param { Date | string | number } inputDate 
 * @param { boolean } useFallback 
 * @returns { string }
 */
function formatShortDateTime(inputDate, useFallback = true) {
    if (!inputDate)
        return useFallback ? "-" : "";
    
    const date = new Date(inputDate);

    if (isNaN(date.getTime()))
        return useFallback ? "-" : "";

    return new Intl.DateTimeFormat(
        "id-ID", 
        {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        }
    ).format(date) 
    + " " +
    new Intl.DateTimeFormat(
        "id-ID", 
        {
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "shortGeneric"
        }
    ).format(date);
}

/**
 * Format date and time
 * @param { Date | string | number } inputDate 
 * @param { boolean } useFallback 
 * @returns { string }
 */
function formatDateTime(inputDate, useFallback = true) {
    if (!inputDate)
        return useFallback ? "-" : "";
    
    const date = new Date(inputDate);

    if (isNaN(date.getTime()))
        return useFallback ? "-" : "";

    return new Intl.DateTimeFormat(
        "id-ID", 
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    ).format(date) 
    + " " +
    new Intl.DateTimeFormat(
        "id-ID", 
        {
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "shortGeneric"
        }
    ).format(date);
}

/**
 * Format date
 * @param { Date | string | number } inputDate 
 * @param { boolean } useFallback 
 * @returns { string }
 */
function formatDate(inputDate, useFallback = true) {
    if (!inputDate)
        return useFallback ? "-" : "";
    
    const date = new Date(inputDate);

    if (isNaN(date.getTime()))
        return "";

    return new Intl.DateTimeFormat(
        "id-ID", 
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    ).format(date);
}

/**
 * Format date and time
 * @param { Date | string | number } inputDate 
 * @param { boolean } useFallback 
 * @returns { string }
 */
function formatTime(inputDate, useFallback = true) {
    if (!inputDate)
        return useFallback ? "-" : "";
    
    const date = new Date(inputDate);

    if (isNaN(date.getTime()))
        return useFallback ? "-" : "";

    return new Intl.DateTimeFormat(
        "id-ID", 
        {
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "shortGeneric"
        }
    ).format(date);
}

module.exports = {
    formatAmount,
    formatDate,
    formatDateTime,
    censorPhoneNumber,
    formatPhoneNumber,
    formatShortDateTime,
    formatTime
}