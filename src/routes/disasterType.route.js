const Routes = require("../routes");
const DisasterTypeController = require("../controllers/disasterType.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");

Routes.getMapping("/api/disaster-type",
    DisasterTypeController.find
);

Routes.getMapping("/api/disaster-type/active",
    DisasterTypeController.findActive
);

Routes.getMapping("/api/disaster-type/:disasterTypeId",
    DisasterTypeController.findByDisasterTypeId
);

Routes.postMapping("/api/disaster-type",
    MainMiddleware.accessAsAdmin,
    DisasterTypeController.add
);

Routes.putMapping("/api/disaster-type/:disasterTypeId/deactivate",
    MainMiddleware.accessAsAdmin,
    DisasterTypeController.deactivate
);

Routes.deleteMapping("/api/disaster-type/:disasterTypeId",
    MainMiddleware.accessAsAdmin,
    DisasterTypeController.remove
);
