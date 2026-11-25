const Database = require("../database");
const SqlUtil = require("../utils/sql.util");

const Account = require("../models/account.model");

/**
 * @returns { Promise<Array<Account>> }
 */
async function findAll() {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView"
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults || [];
}

/**
 * @param { typeof Account.prototype.role } role
 * @returns { Promise<Array<Account>> }
 */
async function findAllByRole(role) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView WHERE role = ?", 
            role
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults || [];
}
/**
 * @param { typeof Account.prototype.role } role
 * @param { string } query
 * @returns { Promise<Array<Account>> }
 */
async function findAllByRoleAndQuery(role, query) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView WHERE role = ? AND LOWER(name) LIKE ?", 
            [role, "%" + query + "%"]
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults || [];
}

/**
 * @param { typeof Account.prototype.role } role
 * @param { typeof Account.prototype.districtId } districtId
 * @returns { Promise<Array<Account>> }
 */
async function findAllByRoleAndDistrictId(role, districtId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView WHERE role = ? AND districtId = ?", 
            [role, districtId]
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults || [];
}

/**
 * @param { typeof Account.prototype.role } role
 * @param { typeof Account.prototype.districtId } districtId
 * @param { string } query
 * @returns { Promise<Array<Account>> }
 */
async function findAllByRoleAndDistrictIdAndQuery(role, districtId, query) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView WHERE role = ? AND districtId = ? AND LOWER(name) LIKE ?", 
            [role, districtId, "%" + query + "%"]
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults || [];
}

/**
 * @param { typeof Account.prototype.id } accountId
 * @returns { Promise<Account?> }
 */
async function findByAccountId(accountId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView WHERE id = ? LIMIT 1", 
            accountId
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof Account.prototype.nik } nik
 * @returns { Promise<Account?> }
 */
async function findByNik(nik) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView WHERE nik = ? LIMIT 1", 
            nik
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof Account.prototype.phone } phone
 * @returns { Promise<Account?> }
 */
async function findByPhone(phone) {
    const queryResult = 
        await Database.doQuery(
            "SELECT * FROM AccountView WHERE phone = ? LIMIT 1", 
            phone
        );
    const dataResults = SqlUtil.convertRowToClass(queryResult.rows, Account);
    return dataResults?.at(0) || null;
}

/**
 * @param { typeof Account.prototype.id } accountId
 * @returns { Promise<typeof Account.prototype.picture?> } pictureBuffer
 */
async function getPicture(accountId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT picture FROM Account WHERE id = ? LIMIT 1",
            accountId
        );
    return queryResult.rows?.at(0)?.picture;
}

/**
 * @param { typeof Account.prototype.id } accountId
 * @returns { Promise<typeof Account.prototype.role?> }
 */
async function getRole(accountId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT role FROM AccountView WHERE id = ? LIMIT 1",
            accountId
        );
    return queryResult.rows?.at(0)?.role;
}

/**
 * @param { typeof Account.prototype.id } accountId
 * @returns { Promise<typeof Account.prototype.districtId?> }
 */
async function getDistrictId(accountId) {
    const queryResult = 
        await Database.doQuery(
            "SELECT districtId FROM AccountView WHERE id = ? LIMIT 1",
            accountId
        );
    return queryResult.rows?.at(0)?.districtId;
}

/**
 * @param { typeof Account.prototype.phone } phone
 * @param { typeof Account.prototype.name } name 
 * @param { typeof Account.prototype.districtId } districtId
 * @param { typeof Account.prototype.role } role
 * @param { typeof Account.prototype.nik } nik 
 * @returns { Promise<typeof Account.prototype.id> } Account id
 */
async function add(phone, name, districtId, role, nik) {
    const queryResult = 
        await Database.doQuery(`
            INSERT INTO Account 
                (name, nik, phone, role, districtId)
            VALUES 
                (?, ?, ?, ?, ?)
        `, 
        [name, nik, phone, role, districtId]);
    return queryResult.insertId;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Account.prototype.phone? } phone 
 * @param { typeof Account.prototype.name? } name 
 * @param { typeof Account.prototype.districtId? } districtId
 * @param { typeof Account.prototype.nik? } nik 
 * @returns { Promise<boolean> } Result of execution
 */
async function updateInfo(accountId, phone, name, districtId, nik) {
    const queryResult =
        await Database.doQuery(`
            UPDATE Account
            SET
                phone = COALESCE(?, phone),
                name = COALESCE(?, name),
                districtId = COALESCE(?, districtId),
                nik = COALESCE(?, nik) 
            WHERE
                id = ?
        `, 
        [phone, name, districtId, nik, accountId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Account.prototype.picture? } pictureBuffer
 * @returns { Promise<boolean> } Result of execution
 */
async function updatePicture(accountId, pictureBuffer) {
    const queryResult =
        await Database.doQuery(`
            UPDATE Account
            SET
                picture = ? 
            WHERE
                id = ?
        `, 
        [pictureBuffer, accountId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Account.prototype.isActive } isActive 
 */
async function updateActiveState(accountId, isActive = false) {
    const queryResult =
        await Database.doQuery(`
            UPDATE Account
            SET
                isActive = ? 
            WHERE
                id = ?
        `, 
        [isActive, accountId]);

    return queryResult.isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<boolean> }
 */
async function remove(accountId) {
    const queryResult =
        await Database.doQuery(`
            DELETE FROM Account
            WHERE
                id = ?
        `, 
        accountId);

    return queryResult.isSuccess;
}

module.exports = {
    findAll, 
    findAllByRole, findAllByRoleAndQuery, findAllByRoleAndDistrictId, findAllByRoleAndDistrictIdAndQuery, 
    findByAccountId, findByNik, findByPhone,
    getPicture, getRole, getDistrictId,
    add, 
    updateInfo, updatePicture, updateActiveState,
    remove
};