console.log("Starting Server |", new Date().toLocaleDateString(), "|", new Date().toLocaleTimeString());

// Get the .env first
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const Database = require("./database");
const Routes = require("./routes");

async function initialize()
{
	await Database.initialize();
	await Routes.initialize();
}

initialize();