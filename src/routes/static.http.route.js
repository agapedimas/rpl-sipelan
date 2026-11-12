const Routes = require("../routes");

const PageController = require("../controllers/page.http.controller");
const StaticController = require("../controllers/static.http.controller");

Routes.getMapping("*", 
    StaticController.map, 
    StaticController.sendStaticFile, 
    PageController.sendErrorPage(404));