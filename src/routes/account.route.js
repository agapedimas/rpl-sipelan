const Routes = require("../routes");

const AccountController = require("../controllers/account.controller");
const AccountMiddleware = require("../middlewares/account.middleware");
const MainMiddleware = require("../middlewares/main.http.middleware");

Routes.getMapping("/pp/:accountId", AccountController.getPicture);
Routes.postMapping("/pp", AccountController.setPicture);
Routes.deleteMapping("/pp", AccountController.removePicture);
