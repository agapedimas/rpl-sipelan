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
    const queryResult = 
        // Allow single-session only
        await Database.doQuery(`
            REPLACE INTO Authentication (accountId, ipAddress)
            VALUES (?,?)
        `, [accountId, ipAddress]);
    return queryResult.insertId;
}

/**
 * @param { typeof Authentication.prototype.id } authenticationId 
 * @returns { Promise<void> }
 */
async function remove(authenticationId) {
    await Database.doQuery("DELETE FROM Authentication WHERE id = ?", authenticationId);
}

/**
 * @param { string } email 
 * @param { string } password 
 * @returns { Promise<boolean> }
 */
async function checkCredentials(email, password) {
    if (!email || !password)
        return false;
    
    // Get password from database
    const result = await Database.doQuery("SELECT password FROM Account WHERE email=?", email);
    
    if (result.isSuccess == false || !result.data?.at(0))
        return false;

    const hashedPasswordWithSalt = result.data[0].password;
    return await Hash.isMatch(password, hashedPasswordWithSalt);
}

module.exports = {
    add, remove,
    checkAccess, checkCredentials
};