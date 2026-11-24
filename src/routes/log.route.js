const Routes = require("../routes");

const MainMiddleware = require("../middlewares/main.http.middleware");
const LogController = require("../controllers/log.controller");

// GET
Routes.getMapping("/api/log",
    LogController.findAll
);

Routes.getMapping("/api/log/category/:logCategoryId",
    LogController.findAllByLogCategoryId
);

Routes.getMapping("/api/log/report/:reportId",
    LogController.findAllByReportId
);

Routes.getMapping("/api/log/reporter/:reporterId",
    LogController.findAllByReporterId
);

Routes.getMapping("/api/log/:logId",
    LogController.findByLogId
);

Routes.getMapping("/api/log/:logId/picture",
    LogController.getPicture
);

// POST
Routes.postMapping("/api/log",
    MainMiddleware.accessAsVolunteerOrOfficer,
    LogController.add
);

// PUT
Routes.putMapping("/api/log/:logId/update",
    MainMiddleware.accessAsVolunteerOrOfficer,
    LogController.updateInfo
);

Routes.putMapping("/api/log/:logId/picture",
    MainMiddleware.accessAsVolunteerOrOfficer,
    LogController.setPicture
);

// DELETE
Routes.deleteMapping("/api/log/:logId",
    MainMiddleware.accessAsVolunteerOrOfficer,
    LogController.remove
);

Routes.deleteMapping("/api/log/:logId/picture",
    MainMiddleware.accessAsVolunteerOrOfficer,
    LogController.removePicture
);