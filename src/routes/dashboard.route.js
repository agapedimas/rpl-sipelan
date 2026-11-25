const Routes = require("../routes");

const MainMiddleware = require("../middlewares/main.http.middleware");
const DashboardMiddleware = require("../middlewares/dashboard.middleware");

Routes.getMapping("/",
    DashboardMiddleware.redirectToDefaultRoleDashboardPage
);
Routes.getMapping("/admin",
    DashboardMiddleware.redirectToDefaultRoleDashboardPage
);
Routes.getMapping("/officer",
    DashboardMiddleware.redirectToDefaultRoleDashboardPage
);
Routes.getMapping("/citizen",
    DashboardMiddleware.redirectToDefaultRoleDashboardPage
);