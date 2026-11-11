const Routes = require("../routes");

const MainController = require("../controllers/main.controller");

Routes.getMapping("*", MainController.map);