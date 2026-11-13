const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const ProvinceService = require("../services/province.service");

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    let { name } = req.body;

    // Make sure required fields are providen
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

    const provinceId = await ProvinceService.add(name);

    if (provinceId != null)
        return ResponseUtil.sendApiResponse(res, 201, null, { provinceId: provinceId });
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {
    let { provinceId, name } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([provinceId])) {
        return ResponseUtil.sendApiResponse(res, 422, "Province ID is required.");
    }

    if (ProvinceService.doesProvinceExist(provinceId) == false) {
        return ResponseUtil.sendApiResponse(res, 404, "Province is not found.");
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
        case "TOO_SHORT": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too short.");
        case "INVALID": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is invalid.");
    }

    const isSuccess = await ProvinceService.updateInfo(provinceId, { name: name });
    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function remove(req, res) {
    let { provinceId } = req.params;

    if (ProvinceService.doesProvinceExist(provinceId) == false) {
        return ResponseUtil.sendApiResponse(res, 404, "Province is not found.");
    }

    const isSuccess = await ProvinceService.remove(provinceId);
    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 204);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}


/** @type {import("express").RequestHandler} */
async function find(req, res) {
    const { query } = req.query;
    let provinces;
    
    if (query)
        provinces = await ProvinceService.findAllByQuery(query);
    else
        provinces = await ProvinceService.findAll();

    return ResponseUtil.sendApiResponse(res, 200, null, { provinces: provinces });
}

/** @type {import("express").RequestHandler} */
async function findByProvinceId(req, res) {
    const { provinceId } = req.params;
    const province = await ProvinceService.findByProvinceId(provinceId);
    return ResponseUtil.sendApiResponse(res, 200, null, { province: province });
}


module.exports = {
    add,
    updateInfo,
    remove,
    find, findByProvinceId
}