const Routes = require("../routes");
const Server = Routes.getServer();

const AuthenticationController = require("../controllers/authentication.controller");
const AuthenticationMiddleware = require("../middlewares/authentication.middleware");

Server.post("/api/requestOtp", AuthenticationMiddleware.doesNeedAuthentication)
Server.post("/api/signin", AuthenticationController.signIn);
Server.post("/api/signup", AuthenticationController.signUp);

Server.get("/signin", AuthenticationMiddleware.doesNeedAuthenticationAndRedirect);
Server.get("/signup", AuthenticationMiddleware.doesNeedAuthenticationAndRedirect);
Server.get("/signout", AuthenticationController.signOut);