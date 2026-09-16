const Routes = require("../routes");
const Server = Routes.getServer();

const Controller = require("../controllers/language.controller");

Server.post("/language/:languageId", Controller.setLanguage);
Server.post("/:languageId/*", Controller.getLanguagedFile);