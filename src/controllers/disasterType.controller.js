const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const DisasterTypeService = require("../services/disasterType.service");

/** @type {import("express").RequestHandler} */
async function find(req, res) {
    const disasterTypes = await DisasterTypeService.findAll();

    return ResponseUtil.sendApiResponse(res, 200, null, { disasterTypes: disasterTypes });
}

/** @type {import("express").RequestHandler} */
async function findActive(req, res) {
    const disasterTypes = await DisasterTypeService.findAllActive();

    return ResponseUtil.sendApiResponse(
        res, 200, null, { disasterTypes: disasterTypes }
    );
}

/** @type {import("express").RequestHandler} */
async function findByDisasterTypeId(req, res) {
    const { disasterTypeId } = req.params;

    const disasterType = await DisasterTypeService.findByDisasterTypeId(disasterTypeId);

    return ResponseUtil.sendApiResponse(
        res, 200, null, { disasterType: disasterType }
    );
}


/** @type {import("express").RequestHandler} */
async function add(req, res) {
    let { name } = req.body;

    // field yang diperlukan harus ada
    if (ValidatorUtil.areFieldsEmpty([name])) {
        return ResponseUtil.sendApiResponse(res, 422, "Name is required.");
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG":
            return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
        case "TOO_SHORT":
            return ResponseUtil.sendApiResponse(res, 400, "Name is too short.");
        case "INVALID":
            return ResponseUtil.sendApiResponse(res, 400, "Name is invalid.");
    }

    // max lengthnya 128 mengikuti tabel di database
    if (name.length > 128) {
        return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
    }

    const disasterTypeId = await DisasterTypeService.add(name);

    if (disasterTypeId != null)
        return ResponseUtil.sendApiResponse(res, 201, null, { disasterTypeId: disasterTypeId });
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}


/** @type {import("express").RequestHandler} */
async function activate(req, res) {
    const { disasterTypeId } = req.params;

    const disasterType = await DisasterTypeService.findByDisasterTypeId(disasterTypeId);

    if (disasterType == null) {
        return ResponseUtil.sendApiResponse(res, 404, "Disaster Type is not found.");
    }

    const isSuccess = await DisasterTypeService.activate(disasterTypeId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function deactivate(req, res) {
    const { disasterTypeId } = req.params;

    const disasterType = await DisasterTypeService.findByDisasterTypeId(disasterTypeId);

    if (disasterType == null) {
        return ResponseUtil.sendApiResponse(res, 404, "Disaster Type is not found.");
    }

    const isSuccess = await DisasterTypeService.deactivate(disasterTypeId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function remove(req, res) {
    const { disasterTypeId } = req.params;

    const disasterType = await DisasterTypeService.findByDisasterTypeId(disasterTypeId);

    if (disasterType == null) {
        return ResponseUtil.sendApiResponse(res, 404, "Disaster Type is not found.");
    }

    const isSuccess = await DisasterTypeService.remove(disasterTypeId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 204);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

module.exports = {
    find,
    findActive,
    findByDisasterTypeId,
    add,
    activate,
    deactivate,
    remove
};