const Routes = require("../routes");
const Server = Routes.getServer();

const Controller = require("../controllers/main.controller");

Server.get("*", Controller.map);