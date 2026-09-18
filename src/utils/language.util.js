const fs = require("fs");

const languageFolderPath = "./src/assets/languages";
const SUPPORTED_LANGUAGES = [ "id", "en" ];

const indexedDictionary = {};

/**
 * Get language dictionary from assets
 * @param { string } languageId 
 * @param { string } key 
 * @returns { object }
 */
function getDictionary(languageId, key) {
    const folderPath = languageFolderPath + "/" + languageId + "/";
    const fileName = key;

    if (indexedDictionary[languageId] == null)
        indexedDictionary[languageId] = {};

    if (indexedDictionary[languageId][key] == null) {
        try {
            if (fs.existsSync(folderPath + fileName + ".json") == false)
                throw "Dictionary file for '" + fileName + "' does not exist.";

            const contentString = fs.readFileSync(folderPath + fileName + ".json", "utf-8");
            const contentJson = JSON.parse(contentString);
            indexedDictionary[languageId][key] = contentJson;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    return indexedDictionary[languageId][key];
}

/**
 * @param { string } languageId 
 * @param { string } accessor 
 */
function getString(languageId, accessor) {
    const key = accessor.substring(0, accessor.indexOf("."));
    accessor = accessor.substring(accessor.indexOf(".") + 1);

    const dictionary = getDictionary(languageId, key);
    const keys = accessor.split(".");

    let value = dictionary;
    for (const i of keys) {
        if (value && value[i])
            value = value[i];
        else
            return null;
    }
    
    return value;
}

module.exports = {
    SUPPORTED_LANGUAGES,
    getString
};