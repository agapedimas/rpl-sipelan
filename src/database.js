const fs = require("fs");
const mySql = require("mysql2");

const tableFolderPath = "./src/database/tables/";
const tableFiles = 
    fs
        .readdirSync(tableFolderPath)
        .filter(o => o.endsWith(".sql"))
        .sort((a,b) => a.localeCompare(b, undefined, { numeric: true }));

/** @type { mySql.Pool } */
let pool;

/**
 * Initializes database connection and table definitions
 * @returns { Promise<void> }
 */
function initialize() {
    return new Promise(async function(resolve) {
        pool = mySql.createPool({
            connectionLimit: 10,
            connectTimeout: 20000,
            waitForConnections: true,
            queueLimit: 0,
            host: process.env.SQL_HOST,
            port: 3306,
            user: process.env.SQL_USERNAME,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            charset: "utf8mb4",
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            multipleStatements: true,
            typeCast: function(field, next)
            {
                if (field.type == "JSON") 
                    return JSON.parse(field.string("utf8"));
                
                return next();
            }
        });

        for (const tableFileName of tableFiles) {
            const tableFileContent = fs.readFileSync(tableFolderPath + tableFileName, { encoding: "utf-8" });

            const queries = 
                tableFileContent
                    .split(/(?<!\\);/g)
                    .map((o) => o.replace(/\\;/g, ";").trim())
                    .filter((o) => o != "");

            for (const query of queries) {
                const result = await doQuery(query);
                if (result.isSuccess == false)
                    break;
            }
        }

        resolve();
    });
}

function getPool() {
    return pool;
}

/**
 * 
 * @param { string } query 
 * @param { string | Array<string> } values 
 * @returns { Promise<{
 *      isSuccess: boolean,
 *      rows: Array<import("mysql2").RowDataPacket>,
 *      affectedRows: number,
 *      fieldCount: number,
 *      insertId: any,
 *      message: string
 * }> }
 */
function doQuery(query, values = []) {
    return new Promise(function(resolve) {
        pool.query(query, values, function(error, results) {
            if (error) {
                const errorObject = JSON.parse(JSON.stringify(error));
                console.error(error.message, errorObject);

                return resolve({
                    isSuccess: false
                });
            }

            let rows = null;
            if (results.constructor.name === "RowPacket") {
                rows = results || [];
            }

            return resolve({
                isSuccess: true,
                rows: rows,        
                affectedRows: results.affectedRows,
                fieldCount: results.fieldCount,
                insertId: results.insertId,
                message: results.message
            });
        });
    });
}

module.exports = { initialize, getPool, doQuery };