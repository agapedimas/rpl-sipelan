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
// Update account info
Routes.patchMapping("/api/account/:accountId", 
    MainMiddleware.accessTheirOwn,
    AccountMiddleware.checkValidity,
    AccountMiddleware.checkExistence,
    AccountMiddleware.checkDuplicates,
    AccountMiddleware.checkIfPhoneNumberChanged,
    AccountController.updateInfo
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