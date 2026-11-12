const Routes = require("../routes");

const PageController = require("../controllers/page.http.controller");

const AuthenticationController = require("../controllers/authentication.controller");
const AuthenticationMiddleware = require("../middlewares/authentication.middleware");

Routes.postMapping("/api/requestOtp", 
    AuthenticationMiddleware.doesNeedAuthentication, 
    AuthenticationController.requestOtp);
Routes.postMapping("/api/verifyOtp", 
    AuthenticationMiddleware.doesNeedAuthentication, 
    AuthenticationController.verifyOtp);
Routes.postMapping("/api/signin",
    AuthenticationController.signIn);

Routes.getMapping("/signin", 
    AuthenticationMiddleware.doesNeedAuthenticationAndRedirect,
    PageController.sendRenderedPage({}, "signin", "auth"));
Routes.getMapping("/signout", 
    AuthenticationController.signOut);