const Routes = require("../routes");

const ProvinceController = require("../controllers/province.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");

Routes.getMapping("/api/province",
    ProvinceController.find
);

Routes.getMapping("/api/province/:provinceId",
    ProvinceController.findByProvinceId
);

Routes.postMapping("/api/province",
    MainMiddleware.accessAsAdmin,
    ProvinceController.add
);

Routes.putMapping("/api/province/:provinceId",
    MainMiddleware.accessAsAdmin,
    ProvinceController.updateInfo
);

Routes.deleteMapping("/api/province/:provinceId",
    MainMiddleware.accessAsAdmin,
    ProvinceController.remove
);