const Routes = require("../routes");

const MainMiddleware = require("../middlewares/main.http.middleware");
const ReportMiddleware = require("../middlewares/report.middleware");
const ReportController = require("../controllers/report.controller");

// GET
Routes.getMapping("/api/reports",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.findAll
);

Routes.getMapping("/api/reports/disaster",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.findAllByDisasterTypeId
);

Routes.getMapping("/api/reports/archive/:isArchived",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.findAllByIsArchivedStatus
);

Routes.getMapping("/api/reports/time",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.findAllByTime
);

Routes.getMapping("/api/reports/:reportId",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.findByReportId
);

// POST
Routes.postMapping("/api/reports",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.add
);

// PUT
Routes.putMapping("/api/reports/:reportId/archive",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.updateIsArchived
);

Routes.putMapping("/api/reports/:reportId/status",
    MainMiddleware.accessAsVolunteerOrOfficer,
    MainMiddleware.validateReportStatus,
    ReportMiddleware.checkAccessDistrict,
    ReportController.updateStatus
);

Routes.putMapping("/api/reports/:reportId/description",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.updateDescription
);

// DELETE
Routes.deleteMapping("/api/reports/:reportId",
    MainMiddleware.accessAsVolunteerOrOfficer,
    ReportMiddleware.checkAccessDistrict,
    ReportController.removeReport
);
