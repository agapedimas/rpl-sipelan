
const Routes = require("../routes");

const SubmissionController = require("../controllers/submission.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");
const SubmissionMiddleware = require("../middlewares/submission.middleware");

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
