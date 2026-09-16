const Routes = require("../routes");
const Server = Routes.getServer();

const Controller = require("../controllers/admin.controller");
const Middleware = require("../middlewares/admin.middleware");

Server.get("/admin*", Middleware.checkAccessAndRedirect, Controller.preRender);
Server.get("/api/admin*", Middleware.checkAccess);
Server.post("/api/admin*", Middleware.checkAccess);
Server.put("/api/admin*", Middleware.checkAccess);
Server.patch("/api/admin*", Middleware.checkAccess);
Server.delete("/api/admin*", Middleware.checkAccess);