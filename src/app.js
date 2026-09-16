console.log(
	"Starting Server |",
	new Date().toLocaleDateString(), 
	"|",
	new Date().toLocaleTimeString()
);

const Database = require("./database");
const Routes = require("./routes");

async function initialize()
{
	await Database.initialize();
	await Routes.initialize();
}

initialize();