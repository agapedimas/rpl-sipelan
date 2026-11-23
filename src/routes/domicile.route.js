const Routes = require("../routes");

const DomicileController = require("../controllers/domicile.controller");
const MainMiddleware = require("../middlewares/main.http.middleware");

Routes.getMapping("/api/domicile",
    DomicileController.find
);

Routes.getMapping("/api/domicile/:districtId",
    DomicileController.findByDistrictId
);