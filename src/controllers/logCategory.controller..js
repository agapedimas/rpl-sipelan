const LogCategoryService = require("../services/logCategory.service");

async function findAll(req, res, next) {
    const categories = await LogCategoryService.findAll();
    return res.send(categories);
}

async function findById(req, res, next) {
    const categoryId = req.params.id;
    const category = await LogCategoryService.findById(categoryId);
    if (!category) {
        return res.status(404).send({ message: "Log category not found." });
    }
    return res.send(category);
}

async function add(req, res, next) {
    try {
        const { name, type, unit } = req.body;
        const categoryId = await LogCategoryService.add(name, type, unit);
        return res.status(201).send({ categoryId });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

async function updateInfo(req, res, next) {
    try {
        const categoryId = req.params.id;
        const updatedInfo = req.body;
        
        const isSuccess = await LogCategoryService.updateInfo(categoryId, updatedInfo);
        if (isSuccess) {
            return res.send({ message: "Log category updated successfully." });
        }
        return res.status(400).send({ message: "Failed to update log category." });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

async function remove(req, res, next) {
    const categoryId = req.params.id;
    const isSuccess = await LogCategoryService.remove(categoryId);
    if (isSuccess) {
        return res.send({ message: "Log category deleted successfully." });
    }
    return res.status(400).send({ message: "Failed to delete log category." });
}

module.exports = {
    findAll,
    findById,
    add,
    updateInfo,
    remove
};