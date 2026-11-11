const Routes = require("../routes");
const Server = Routes.getServer();

const AuthenticationController = require("../controllers/authentication.controller");
const AuthenticationMiddleware = require("../middlewares/authentication.middleware");

Server.post("/api/requestOtp", 
    AuthenticationMiddleware.doesNeedAuthentication, 
    AuthenticationController.requestOtp);
Server.post("/api/verifyOtp", 
    AuthenticationMiddleware.doesNeedAuthentication, 
    AuthenticationController.verifyOtp);
Server.post("/api/signin",
    AuthenticationController.signIn);

Server.get("/signin", 
    AuthenticationMiddleware.doesNeedAuthenticationAndRedirect);
Server.get("/signout", 
    AuthenticationController.signOut);