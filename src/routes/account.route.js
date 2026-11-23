const Routes = require("../routes");

const PageController = require("../controllers/page.http.controller");
const AccountController = require("../controllers/account.controller");
const AccountMiddleware = require("../middlewares/account.middleware");
const MainMiddleware = require("../middlewares/main.http.middleware");

// Profile picture
Routes.getMapping("/pp/:accountId", AccountController.getPicture);
Routes.postMapping("/pp", AccountController.setPicture);
Routes.deleteMapping("/pp", AccountController.removePicture);

// Account management
Routes.patchMapping("/api/account/:accountId", 
    MainMiddleware.accessTheirOwn,
    AccountMiddleware.checkValidity,
    AccountMiddleware.checkExistence,
    AccountMiddleware.checkDuplicates,
    AccountMiddleware.checkIfPhoneNumberChanged,
    AccountController.updateInfo
);

// Front-end
Routes.getMapping("/profile",
    MainMiddleware.viewAsCitizen,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("profile", "citizen"));