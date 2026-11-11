const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Account = require("../models/account.model");
const Authentication = require("../models/authentication.model");

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Authentication.prototype.ipAddress } ipAddress 
 * @returns { Promise<typeof Authentication.prototype.id> } Authentication id
 */
async function add(accountId, ipAddress) {
    const currentTime = Date.now();
    const queryResult = 
        // Allow single-session only
        await Database.doQuery(`
            REPLACE INTO Authentication (accountId, ipAddress, time)
            VALUES (?,?,?)
        `, [accountId, ipAddress, currentTime]);
    return queryResult.insertId;
}

/**
 * @param { typeof Authentication.prototype.id } authenticationId 
 * @returns { Promise<boolean> }
 */
async function remove(authenticationId) {
    const queryResult = await Database.doQuery(
        "DELETE FROM Authentication WHERE id = ?", 
        authenticationId
    );
    return queryResult.isSuccess;
}

/**
 * Check if account is signed in
 * @param { typeof Authentication.prototype.id } authenticationId 
 * @returns { Promise<boolean> }
 */
async function isAuthenticated(authenticationId) {
    if (authenticationId == null)
        return false;
    
    const queryResult = await Database.doQuery(
        "SELECT id FROM Authentication WHERE id = ? LIMIT 1",
        authenticationId
    );
    return queryResult.rows?.length > 0;
}


module.exports = {
    add, remove,
    isAuthenticated
};