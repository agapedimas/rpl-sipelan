console.log("Starting Server |", new Date().toLocaleDateString(), "|", new Date().toLocaleTimeString());

// Get the .env first
const path = require("path");
const envPath = process.env.NODE_ENV === "test" ? "../.env.test" : "../.env"
require("dotenv").config({
    path: path.join(__dirname, envPath)
});

const Database = require("./database");
const Routes = require("./routes");

async function initialize()
{
	await Database.initialize();
	await Routes.initialize();
}

initialize();