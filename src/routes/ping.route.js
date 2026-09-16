const Routes = require("../routes");
const Server = Routes.getServer();

Server.post("/ping", function(req, res) {
    res.send();
});