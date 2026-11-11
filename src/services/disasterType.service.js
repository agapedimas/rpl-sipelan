const DisasterType = require("../models/disasterType.model");
const DisasterTypeRepository = require("../repositories/disasterType.repository");

/**
 * @returns { Promise<Array<DisasterType>> }
 */
async function findAll() {
    const disasterTypes = await DisasterTypeRepository.findAll();
    return disasterTypes;
}

/**
 * @returns { Promise<Array<DisasterType>> }
 */
async function findAllActive() {
    const disasterTypes = await DisasterTypeRepository.findAllActive();
    return disasterTypes;
}

/**
 * @param { typeof DisasterType.prototype.id } disasterTypeId
 * @returns { Promise<DisasterType?> }
 */
async function findByDisasterTypeId(disasterTypeId) {
    const disasterType = await DisasterTypeRepository.findByDisasterTypeId(disasterTypeId);
    return disasterType;
}

/**
 * @param { typeof DisasterType.prototype.name } name
 * @returns { Promise<typeof DisasterType.prototype.id> }
 */
async function add(name) {
    const disasterTypeId = await DisasterTypeRepository.add(name);
    return disasterTypeId;
}

/**
 * @param { typeof DisasterType.prototype.id } disasterTypeId
 * @returns { Promise<boolean> }
 */
async function activate(disasterTypeId) {
    const isSuccess = await DisasterTypeRepository.updateActiveState(disasterTypeId, true);
    return isSuccess;
}

/**
 * @param { typeof DisasterType.prototype.id } disasterTypeId
 * @returns { Promise<boolean> }
 */
async function deactivate(disasterTypeId) {
    const isSuccess = await DisasterTypeRepository.updateActiveState(disasterTypeId, false);
    return isSuccess;
}

/**
 * @param { typeof DisasterType.prototype.id } disasterTypeId
 * @returns { Promise<boolean> }
 */
async function remove(disasterTypeId) {
    const isSuccess = await DisasterTypeRepository.remove(disasterTypeId);
    return isSuccess;
}

module.exports = {
    findAll,
    findAllActive,
    findByDisasterTypeId,
    add,
    activate,
    deactivate,
    remove
};
