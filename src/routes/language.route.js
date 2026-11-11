const Routes = require("../routes");

const LanguageController = require("../controllers/language.controller");

Routes.postMapping("/language/:languageId", LanguageController.setLanguage);
Routes.postMapping("/:languageId/*", LanguageController.getLanguagedFile);