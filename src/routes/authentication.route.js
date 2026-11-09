const Routes = require("../routes");
const Server = Routes.getServer();

const Controller = require("../controllers/authentication.controller");
const Middleware = require("../middlewares/authentication.middleware");

Server.post("/api/requestOtp", Middleware.doesNeedAuthentication)
Server.post("/api/signin", Controller.signIn);
Server.post("/api/signup", Controller.signUp);

Server.get("/signin", Middleware.doesNeedAuthenticationAndRedirect);
Server.get("/signup", Middleware.doesNeedAuthenticationAndRedirect);
Server.get("/signout", Controller.signOut);