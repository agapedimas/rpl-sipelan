const Routes = require("../routes");

const LanguageController = require("../controllers/language.http.controller");

Routes.postMapping("/language/:languageId", LanguageController.setLanguage);
Routes.postMapping("/:languageId/*", LanguageController.getLanguagedFile);