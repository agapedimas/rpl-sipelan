const Routes = require("../routes");
const Server = Routes.getServer();

const AccountController = require("../controllers/account.controller");
const AccountMiddleware = require("../middlewares/account.middleware");
const MainMiddleware = require("../middlewares/main.middleware");

Server.get("/pp/:accountId", AccountController.getPicture);
Server.post("/pp", AccountController.setPicture);
Server.delete("/pp", AccountController.removePicture);