const Routes = require("../routes");

const ResponseUtil = require("../utils/response.util");

const PageController = require("../controllers/page.http.controller");

const AccountController = require("../controllers/account.controller");

const AuthenticationController = require("../controllers/authentication.controller");
const AuthenticationMiddleware = require("../middlewares/authentication.middleware");

// API
Routes.postMapping("/api/requestOtp", 
    AuthenticationMiddleware.checkIfAuthenticationNeeded, 
    AuthenticationMiddleware.checkAccountExistenceForOtp,
    AuthenticationController.requestOtp);

Routes.postMapping("/api/verifyOtp", 
    AuthenticationMiddleware.checkIfAuthenticationNeeded, 
    AuthenticationController.verifyOtp,
    AuthenticationController.signIn);

Routes.postMapping("/api/signup",
    AuthenticationController.signUpAsCitizen,
    AccountController.add);


// Frontend
Routes.getMapping("/signin", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    PageController.sendRenderedPage("signin", "auth"));

Routes.getMapping("/signin/verify", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    AuthenticationMiddleware.checkIfOtpPending,
    PageController.sendRenderedPage("signin/verify", "auth"));

Routes.getMapping("/signin/verify/change", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    AuthenticationController.cancelOtp);

Routes.getMapping("/signup", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    PageController.sendRenderedPage("signup", "auth"));

Routes.getMapping("/signout", 
    AuthenticationController.signOut);