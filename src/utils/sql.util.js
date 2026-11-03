/**
 * Convert SQL RowPackets to Class Instance
 * @param { import("mysql2").RowDataPacket[] } rows 
 * @param { new (...args: any[]) => T } model
 * @returns { Array<new (...args: any[]) => T> }
 */
function convertRowToClass(rows, model) {
    return rows.map(row => Object.assign(new model(), row));
}

module.exports = {
    convertRowToClass
}