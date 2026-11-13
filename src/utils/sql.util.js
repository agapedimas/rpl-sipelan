const Model = require("../models/model");

/**
 * Convert SQL RowPackets to Class Instance
 * @param { import("mysql2").RowDataPacket[] } rows 
 * @param { new (...args: any[]) => T } model
 * @returns { Array<new (...args: Array<Model>) => T> }
 */
function convertRowToClass(rows, model) {
    if (rows == null)
        return [];

	return rows.map(row => model.objectToModel(row));
}

module.exports = {
    convertRowToClass
}