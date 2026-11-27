const Routes = require("../routes");

const PageController = require("../controllers/page.http.controller");
const VerificationController = require("../controllers/verification.controller");
const VerificationMiddleware = require("../middlewares/verification.middleware");
const MainMiddleware = require("../middlewares/main.http.middleware");

// post form verification
Routes.postMapping("/api/verification",
    MainMiddleware.accessAsVolunteerOrOfficer,
    VerificationMiddleware.checkDistrictAccess,
    VerificationMiddleware.checkIsVerifiedBefore,
    VerificationController.add
);

// pakai session dari verifier id + query parameter yang opsional
Routes.getMapping("/api/verification",
    MainMiddleware.accessAsVolunteerOrOfficer,
    VerificationController.findAllVerification
);

// pakai path variable berisi submissionId
Routes.getMapping("/api/verification/submission/:submissionId",
    MainMiddleware.accessAsVolunteerOrOfficer,
    VerificationController.findAllBySubmissionId
);

// pakai path variable berisi verificationId
Routes.getMapping("/api/verification/:verificationId",
    MainMiddleware.accessAsVolunteerOrOfficer,
    VerificationController.findByVerificationId
);