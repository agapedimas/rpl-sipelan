const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const ProvinceService = require("../services/province.service");
const CityService = require("../services/city.service");
const DistrictService = require("../services/district.service");

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    let { name, postalCode, cityId } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([name, postalCode, cityId])) {
        return ResponseUtil.sendApiResponse(res, 422, "Name, Postal Code, and City ID are required.");
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
        case "TOO_SHORT": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too short.");
        case "INVALID": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is invalid.");
    }

    if (CityService.doesCityExist(cityId)) {
        return ResponseUtil.sendApiResponse(res, 400, "City with id '" + cityId + "' is not found.");
    }

    const districtId = await DistrictService.add(name, postalCode, cityId);

    if (districtId != null)
        return ResponseUtil.sendApiResponse(res, 201, null, { districtId: districtId });
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {
    let { districtId, name, postalCode, cityId } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([districtId])) {
        return ResponseUtil.sendApiResponse(res, 422, "District ID is required.");
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
        case "TOO_SHORT": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too short.");
        case "INVALID": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is invalid.");
    }

    if (DistrictService.doesProvinceExist(districtId)) {
        return ResponseUtil.sendApiResponse(res, 404, "District is not found.");
    }

    if (CityService.doesCityExist(cityId) == false) {
        return ResponseUtil.sendApiResponse(res, 400, "City with id '" + cityId + "' is not found.");
    }

    const isSuccess = await DistrictService.updateInfo(districtId, { name: name, postalCode: postalCode, cityId: cityId });
    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function remove(req, res) {
    let { districtId } = req.body;

    if (DistrictService.doesDistrictExist(districtId) == false) {
        return ResponseUtil.sendApiResponse(res, 404, "District is not found.");
    }

    const isSuccess = await DistrictService.remove(districtId);
    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 204);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}


/** @type {import("express").RequestHandler} */
async function find(req, res) {
    const { query, cityId } = req.query;
    let districts;
    
    if (query)
        districts = await DistrictService.findAllByQuery(query);
    else if (cityId)
        districts = await DistrictService.findAllByCityId(cityId);
    else
        districts = await DistrictService.findAll();

    return ResponseUtil.sendApiResponse(res, 200, null, { districts: districts });
}

/** @type {import("express").RequestHandler} */
async function findByDistrictId(req, res) {
    const { districtId } = req.params;
    const district = await DistrictService.findByDistrictId(districtId);
    return ResponseUtil.sendApiResponse(res, 200, null, { district: district });
}


module.exports = {
    add,
    updateInfo,
    remove,
    find, findByDistrictId
}