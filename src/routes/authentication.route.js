const Routes = require("../routes");

const ResponseUtil = require("../utils/response.util");

const PageController = require("../controllers/page.http.controller");

const AccountController = require("../controllers/account.controller");

const AuthenticationController = require("../controllers/authentication.controller");
const AuthenticationMiddleware = require("../middlewares/authentication.middleware");

// API
Routes.postMapping("/api/requestOtp", 
    AuthenticationMiddleware.doesNeedAuthentication, 
    AuthenticationMiddleware.checkAccountExistenceForOtp,
    AuthenticationController.requestOtp);

Routes.postMapping("/api/verifyOtp", 
    AuthenticationMiddleware.doesNeedAuthentication, 
    AuthenticationController.verifyOtp);

Routes.postMapping("/api/signin",
    AuthenticationController.signIn);

Routes.postMapping("/api/signup",
    AuthenticationController.signUpAsCitizen,
    AccountController.add);


// Frontend
Routes.getMapping("/signin", 
    AuthenticationMiddleware.doesNeedAuthenticationAndRedirect,
    PageController.sendRenderedPage({}, "signin", "auth"));

Routes.getMapping("/signin/verify", 
    AuthenticationMiddleware.doesNeedAuthenticationAndRedirect,
    PageController.sendRenderedPage({}, "signin/verify", "auth"));

Routes.getMapping("/signup", 
    AuthenticationMiddleware.doesNeedAuthenticationAndRedirect,
    PageController.sendRenderedPage({}, "signup", "auth"));

Routes.getMapping("/signout", 
    AuthenticationController.signOut);