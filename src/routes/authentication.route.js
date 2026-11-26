const Routes = require("../routes");

const ResponseUtil = require("../utils/response.util");

const PageController = require("../controllers/page.http.controller");

const AccountController = require("../controllers/account.controller");

const AuthenticationController = require("../controllers/authentication.controller");
const AuthenticationMiddleware = require("../middlewares/authentication.middleware");

// API
Routes.postMapping("/api/requestOtp", 
    AuthenticationMiddleware.checkIfAuthenticationNeeded, 
    AuthenticationMiddleware.checkAccountExistenceForOtp,
    AuthenticationController.requestOtp);

Routes.postMapping("/api/verifyOtp", 
    AuthenticationMiddleware.checkIfAuthenticationNeeded, 
    AuthenticationController.verifyOtp,
    AuthenticationController.signIn);

Routes.postMapping("/api/signup",
    AuthenticationController.signUpAsCitizen,
    AccountController.add);

// Test only: signs in without OTP
if (process.env.NODE_ENV === "test") {
    Routes.postMapping("/api/test/signin", (req, res) => {
        req.session.accountId = req.body.accountId;
        res.status(200).json({ message: "Signed in for testing" });
    });

    Routes.getMapping("/api/test/whoami", async (req, res) => {
        const AccountService = require("../services/account.service");

        const accountId = req.session.accountId;
        const role = accountId == null ? null : await AccountService.getRole(accountId);

        res.json({ accountId: accountId ?? null, role: role ?? null });
    });
}


// Frontend
Routes.getMapping("/signin", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    PageController.sendRenderedPage("signin", "auth"));

Routes.getMapping("/signin/verify", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    AuthenticationMiddleware.checkIfOtpPending,
    PageController.sendRenderedPage("signin/verify", "auth"));

Routes.getMapping("/signin/verify/change", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    AuthenticationController.cancelOtp);

Routes.getMapping("/signup", 
    AuthenticationMiddleware.checkIfAuthenticationNeededAndRedirect,
    PageController.sendRenderedPage("signup", "auth"));

Routes.getMapping("/signout", 
    AuthenticationController.signOut);