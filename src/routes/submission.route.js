const Routes = require("../routes");

const MainMiddleware = require("../middlewares/main.http.middleware");
const SubmissionMiddleware = require("../middlewares/submission.middleware");

const SubmissionController = require("../controllers/submission.controller");
const AccountController = require("../controllers/account.controller");
const PageController = require("../controllers/page.http.controller");

// Get Submission data
Routes.getMapping("/api/submission",
    MainMiddleware.accessAsCitizen,
    SubmissionController.findAllByCitizenId
);

Routes.getMapping("/api/submission/district/:districtId",
    MainMiddleware.accessAsVolunteerOrOfficer,
    SubmissionMiddleware.checkDistrictAccess,
    SubmissionController.findAllByDistrictId
);

Routes.getMapping("/api/submission/:submissionId/picture",
    MainMiddleware.accessAsCitizenOrVolunteerOrOfficer,
    SubmissionMiddleware.checkSubmissionAccess,
    SubmissionController.getPicture
);

Routes.getMapping("/api/submission/:submissionId",
    MainMiddleware.accessAsCitizenOrVolunteerOrOfficer,
    SubmissionMiddleware.checkSubmissionAccess,
    SubmissionController.findBySubmissionId
);

// Add Submission
Routes.postMapping("/api/submission",
    MainMiddleware.accessAsCitizen,
    SubmissionController.add
);

// Update Submission information
Routes.putMapping("/api/submission/:submissionId",
    MainMiddleware.accessAsCitizen,
    SubmissionMiddleware.checkCitizenSubmissionModification,
    SubmissionController.updateInfo
);

// Cancel Submission
Routes.deleteMapping("/api/submission/:submissionId",
    MainMiddleware.accessAsCitizen,
    SubmissionMiddleware.checkCitizenSubmissionModification,
    SubmissionController.cancel
);

// Manage Submission picture
Routes.postMapping("/api/submission/:submissionId/picture",
    MainMiddleware.accessAsCitizen,
    SubmissionMiddleware.checkCitizenSubmissionModification,
    SubmissionController.setPicture
);

Routes.deleteMapping("/api/submission/:submissionId/picture",
    MainMiddleware.accessAsCitizen,
    SubmissionMiddleware.checkCitizenSubmissionModification,
    SubmissionController.removePicture
);


// Frontend
Routes.getMapping("/submissions",
    MainMiddleware.viewAsCitizen,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("submission", "citizen")
);