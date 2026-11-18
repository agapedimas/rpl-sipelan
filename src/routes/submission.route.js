const Routes = require("../routes");
const SubmissionController = require("../controllers/submission.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");

// Get Submission data
Routes.getMapping("/api/submission",
    MainMiddleware.accessAsCitizen,
    SubmissionController.findAllByCitizenId
);

Routes.getMapping("/api/submission/district/:districtId",
    MainMiddleware.accessAsVolunteerOrOfficer,
    SubmissionController.findAllByDistrictId
);

Routes.getMapping("/api/submission/:submissionId/picture",
    MainMiddleware.accessAsCitizenOrVolunteerOrOfficer,
    SubmissionController.getPicture
);

Routes.getMapping("/api/submission/:submissionId",
    MainMiddleware.accessAsCitizenOrVolunteerOrOfficer,
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
    SubmissionController.updateInfo
);

// Cancel Submission
Routes.deleteMapping("/api/submission/:submissionId",
    MainMiddleware.accessAsCitizen,
    SubmissionController.cancel
);

// Manage Submission picture
Routes.postMapping("/api/submission/:submissionId/picture",
    MainMiddleware.accessAsCitizen,
    SubmissionController.setPicture
);

Routes.deleteMapping("/api/submission/:submissionId/picture",
    MainMiddleware.accessAsCitizen,
    SubmissionController.removePicture
);
