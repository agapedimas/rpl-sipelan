const Routes = require("../routes");

const DistrictController = require("../controllers/district.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");

Routes.getMapping("/api/district",
    DistrictController.find
);

Routes.getMapping("/api/district/:districtId",
    DistrictController.findByDistrictId
);

Routes.postMapping("/api/district",
    MainMiddleware.accessAsAdmin,
    DistrictController.add
);

Routes.putMapping("/api/district/:districtId",
    MainMiddleware.accessAsAdmin,
    DistrictController.updateInfo
);

Routes.deleteMapping("/api/district/:districtId",
    MainMiddleware.accessAsAdmin,
    DistrictController.remove
);