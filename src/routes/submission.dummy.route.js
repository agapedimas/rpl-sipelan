const Routes = require("../routes");

const AccountController = require("../controllers/account.controller");
const PageController = require("../controllers/page.http.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");


Routes.getMapping("/submissions",
    MainMiddleware.viewAsCitizen,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("submission", "citizen")
);