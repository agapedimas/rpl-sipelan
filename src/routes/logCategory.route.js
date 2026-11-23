const Routes = require("../routes");

const MainMiddleware = require("../middlewares/main.http.middleware");
const LogCategoryController = require("../controllers/logCategory.controller.");
const DisasterTypeController = require("../controllers/disasterType.controller");

// GET
Routes.getMapping("/api/log-category",
    LogCategoryController.findAll
);

Routes.getMapping("/api/log-category/:logCategoryId",
    LogCategoryController.findById
);

// POST
Routes.postMapping("/api/log-category",
    MainMiddleware.accessAsAdmin,
    LogCategoryController.add
);

// PUT
Routes.putMapping("/api/disaster-type/:disasterTypeId/update",
    MainMiddleware.accessAsAdmin,
    LogCategoryController.updateInfo
);

// DELETE
Routes.deleteMapping("/api/disaster-type/:disasterTypeId",
    MainMiddleware.accessAsAdmin,
    DisasterTypeController.remove
);
