const ResponseUtil = require("../utils/response.util");
const ValidatorUtil = require("../utils/validator.util");

const ProvinceService = require("../services/province.service");
const CityService = require("../services/city.service");

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    let { name, provinceId } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([name, provinceId]) === false) {
        return ResponseUtil.sendApiResponse(res, 422, "Name and Province ID are required.");
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
        case "TOO_SHORT": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too short.");
        case "INVALID": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is invalid.");
    }

    if (ProvinceService.doesProvinceExist(provinceId)) {
        return ResponseUtil.sendApiResponse(res, 400, "Province with id '" + provinceId + "' is not found.");
    }

    const cityId = await CityService.add(name, provinceId);

    if (cityId != null)
        return ResponseUtil.sendApiResponse(res, 201, null, { cityId: cityId });
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {
    let { cityId, name, provinceId } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([cityId]) === false) {
        return ResponseUtil.sendApiResponse(res, 422, "City ID is required.");
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too long.");
        case "TOO_SHORT": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is too short.");
        case "INVALID": 
            return ResponseUtil.sendApiResponse(res, 400, "Name is invalid.");
    }

    if (CityService.doesCityExist(cityId) == false) {
        return ResponseUtil.sendApiResponse(res, 404, "City is not found.");
    }

    if (ProvinceService.doesProvinceExist(provinceId)) {
        return ResponseUtil.sendApiResponse(res, 400, "Province with id '" + provinceId + "' is not found.");
    }

    const isSuccess = await CityService.updateInfo(cityId, { name: name, provinceId: provinceId });
    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function remove(req, res) {
    let { cityId } = req.body;

    if (CityService.doesCityExist(cityId) == false) {
        return ResponseUtil.sendApiResponse(res, 404, "City is not found.");
    }

    const isSuccess = await CityService.remove(cityId);
    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 204);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

/** @type {import("express").RequestHandler} */
async function find(req, res) {
    const { query, provinceId } = req.query;
    let cities;
    
    if (query)
        cities = await CityService.findAllByQuery(query);
    else if (provinceId)
        cities = await CityService.findAllByProvinceId(provinceId);
    else
        cities = await CityService.findAll();

    return ResponseUtil.sendApiResponse(res, 200, null, { cities: cities });
}

/** @type {import("express").RequestHandler} */
async function findByCityId(req, res) {
    const { cityId } = req.params;
    const city = await CityService.findByCityId(cityId);
    return ResponseUtil.sendApiResponse(res, 200, null, { city: city });
}

module.exports = {
    add,
    updateInfo,
    remove,
    find, findByCityId
}