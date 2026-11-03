const Routes = require("../routes");
const Server = Routes.getServer();

const Controller = require("../controllers/profilePicture.controller");
const Middleware = require("../middlewares/profilePicture.middleware");

Server.get(["/pp/:accountId","/pp/:accountId/:pictureId"], Middleware.checkPictureIdMatch, Controller.getProfilePicture);
Server.post("/pp/:accountId", Middleware.checkAccess, Middleware.checkValidity, Controller.setProfilePicture);
Server.delete("/pp/:accountId", Middleware.checkAccess, Controller.deleteProfilePicture);