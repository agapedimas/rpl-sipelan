const Routes = require("../routes");
const Server = Routes.getServer();

const Controller = require("../controllers/authentication.controller");
const Middleware = require("../middlewares/authentication.middleware");

Server.post("/api/signin", Middleware.validateSignInInput, Controller.signIn);
Server.post("/api/signup", Middleware.validateSignUpInput, Controller.signUp);

Server.get("/signin", Middleware.needAuthAndRedirect);
Server.get("/signup", Middleware.needAuthAndRedirect);
Server.get("/signout", Controller.signOut);