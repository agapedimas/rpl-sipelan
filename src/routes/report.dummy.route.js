const Routes = require("../routes");

const AccountController = require("../controllers/account.controller");
const PageController = require("../controllers/page.http.controller");
const ReportController = require("../controllers/report.dummy.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");


Routes.getMapping("/",
    ReportController.redirectToReportPage
);
Routes.getMapping("/reports",
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("report", "citizen")
);