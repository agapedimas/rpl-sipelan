const Routes = require("../routes");

const PageController = require("../controllers/page.http.controller");
const AccountController = require("../controllers/account.controller");
const AccountMiddleware = require("../middlewares/account.middleware");
const MainMiddleware = require("../middlewares/main.http.middleware");

// Profile picture
Routes.getMapping("/pp/:accountId", AccountController.getPicture);
Routes.postMapping("/pp", AccountController.setPicture);
Routes.deleteMapping("/pp", AccountController.removePicture);

// Allows admin to find all volunteers
Routes.getMapping("/api/account/officer", 
    MainMiddleware.accessAsAdmin,
    AccountController.findAllOfficers
);
// Allows admin to find all volunteers
Routes.getMapping("/api/account/volunteer", 
    MainMiddleware.accessAsAdmin,
    AccountController.findAllVolunteers
);
// Allows officer to find all volunteers on their District only
Routes.getMapping("/api/account/volunteer/district", 
    MainMiddleware.accessAsOfficer,
    AccountController.findAllVolunteersByDistrictId
);

// Create account
Routes.postMapping("/api/account/officer", 
    MainMiddleware.accessAsAdmin,
    AccountMiddleware.setRoleToOfficer,
    AccountMiddleware.checkRequiredFields,
    AccountMiddleware.checkValidity,
    AccountMiddleware.checkExistence,
    AccountMiddleware.checkDuplicates,
    AccountController.add
);
Routes.postMapping("/api/account/volunteer", 
    MainMiddleware.accessAsAdminOrOfficer,
    AccountMiddleware.setRoleToVolunteer,
    AccountMiddleware.checkRequiredFields,
    AccountMiddleware.checkValidity,
    AccountMiddleware.checkExistence,
    AccountMiddleware.checkDuplicates,
    AccountController.add
);

// Update account info
Routes.patchMapping("/api/account/:accountId", 
    MainMiddleware.accessTheirOwn,
    AccountMiddleware.checkValidity,
    AccountMiddleware.checkExistence,
    AccountMiddleware.checkDuplicates,
    // Citizen needs to confirm if it's really their phone number
    AccountMiddleware.checkIfPhoneNumberChanged,
    AccountController.updateInfo
);
Routes.patchMapping("/api/account/officer/:accountId", 
    MainMiddleware.accessAsAdmin,
    AccountMiddleware.checkValidity,
    AccountMiddleware.checkExistence,
    AccountMiddleware.checkDuplicates,
    AccountController.updateInfo
);
Routes.patchMapping("/api/account/volunteer/:accountId", 
    MainMiddleware.accessAsAdminOrOfficer,
    AccountMiddleware.checkValidity,
    AccountMiddleware.checkExistence,
    AccountMiddleware.checkDuplicates,
    AccountController.updateInfo
);

// Activate / deactivate account
Routes.patchMapping("/api/account/officer/:accountId/deactivate", 
    MainMiddleware.accessAsAdmin,
    AccountController.deactivate
);
Routes.patchMapping("/api/account/officer/:accountId/activate", 
    MainMiddleware.accessAsAdmin,
    AccountController.activate
);
Routes.patchMapping("/api/account/volunteer/:accountId/deactivate", 
    MainMiddleware.accessAsAdminOrOfficer,
    AccountController.deactivate
);
Routes.patchMapping("/api/account/volunteer/:accountId/activate", 
    MainMiddleware.accessAsAdminOrOfficer,
    AccountController.activate
);

// Front-end
Routes.getMapping("/profile",
    MainMiddleware.viewAsCitizen,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("profile", "citizen"));

// Admin
Routes.getMapping("/admin/profile",
    MainMiddleware.viewAsAdmin,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("profile", "admin"));
Routes.getMapping("/admin/officers",
    MainMiddleware.viewAsAdmin,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("officers", "admin"));
Routes.getMapping("/admin/volunteers",
    MainMiddleware.viewAsAdmin,
    AccountController.assignAccountInfo,
    PageController.sendRenderedPage("volunteers", "admin"));