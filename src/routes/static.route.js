const Routes = require("../routes");

const PageController = require("../controllers/page.controller");
const StaticController = require("../controllers/static.controller");

Routes.getMapping("*", 
    StaticController.map, 
    StaticController.sendStaticFile, 
    PageController.sendErrorPage(404));