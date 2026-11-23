const ResponseUtil = require("../utils/response.util");

const DomicileService = require("../services/domicile.service");

/** @type {import("express").RequestHandler} */
async function find(req, res) {
    const { cityId } = req.query;
    let domiciles;
    
    if (cityId)
        domiciles = await DomicileService.findAllByCityId(cityId);
    else
        domiciles = await DomicileService.findAll();

    return ResponseUtil.sendApiResponse(res, 200, null, { domiciles: domiciles });
}

/** @type {import("express").RequestHandler} */
async function findByDistrictId(req, res) {
    const { districtId } = req.params;
    const domicile = await DomicileService.findByDistrictId(districtId);
    return ResponseUtil.sendApiResponse(res, 200, null, { domicile: domicile });
}


module.exports = {
    find, 
    findByDistrictId
}