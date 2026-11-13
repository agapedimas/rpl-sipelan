const Routes = require("../routes");

const CityController = require("../controllers/city.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");

Routes.getMapping("/api/city",
    CityController.find
);

Routes.getMapping("/api/city/:cityId",
    CityController.findByCityId
);

Routes.postMapping("/api/city",
    MainMiddleware.accessAsAdmin,
    CityController.add
);

Routes.putMapping("/api/city/:cityId",
    MainMiddleware.accessAsAdmin,
    CityController.updateInfo
);

Routes.deleteMapping("/api/city/:cityId",
    MainMiddleware.accessAsAdmin,
    CityController.remove
);