const ResponseUtil = require("../utils/response.util");
const LogCategoryService = require("../services/logCategory.service");

/** @type {import("express").RequestHandler} */
async function findAll(req, res) {
    const categories = await LogCategoryService.findAll();
    return ResponseUtil.sendApiResponse(res, 200, null, { categories });
}

/** @type {import("express").RequestHandler} */
async function findById(req, res) {
    const categoryId = req.params.id;
    const category = await LogCategoryService.findById(categoryId);

    if (!category)
        return ResponseUtil.sendApiResponse(res, 404, "Log category not found.");

    return ResponseUtil.sendApiResponse(res, 200, null, { category });
}

/** @type {import("express").RequestHandler} */
async function add(req, res) {
    const { name, type, unit } = req.body;

    try {
        const categoryId = await LogCategoryService.add(name, type, unit);

        if (categoryId)
            return ResponseUtil.sendApiResponse(res, 201, null, { categoryId });
        else
            return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 400, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function updateInfo(req, res) {
    const categoryId = req.params.id;
    const { name, type, unit } = req.body;

    try {
        const isSuccess = await LogCategoryService.updateInfo(categoryId, {
            name,
            type,
            unit
        });

        if (isSuccess)
            return ResponseUtil.sendApiResponse(res, 200);
        else
            return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
    } catch (error) {
        return ResponseUtil.sendApiResponse(res, 400, error.message);
    }
}

/** @type {import("express").RequestHandler} */
async function remove(req, res) {
    const categoryId = req.params.id;
    const isSuccess = await LogCategoryService.remove(categoryId);

    if (isSuccess)
        return ResponseUtil.sendApiResponse(res, 200);
    else
        return ResponseUtil.sendApiResponse(res, 500, "Something went wrong.");
}

module.exports = {
    findAll, findById,
    add, updateInfo,
    remove
};