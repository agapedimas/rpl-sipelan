const Routes = require("../routes");

const PageController = require("../controllers/page.http.controller");
const AccountController = require("../controllers/account.controller");
const AccountMiddleware = require("../middlewares/account.middleware");
const MainMiddleware = require("../middlewares/main.http.middleware");

Routes.getMapping("/pp/:accountId", AccountController.getPicture);
Routes.postMapping("/pp", AccountController.setPicture);
Routes.deleteMapping("/pp", AccountController.removePicture);

Routes.getMapping("/profile",
    MainMiddleware.viewAsCitizen,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("profile", "citizen"));