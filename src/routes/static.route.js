const Routes = require("../routes");

const StaticController = require("../controllers/static.controller");

Routes.getMapping("*", 
    StaticController.map, 
    Routes.sendStaticFile, 
    Routes.sendErrorPage(404));