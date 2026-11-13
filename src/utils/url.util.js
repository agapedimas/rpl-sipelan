/**
 * Make the URL tidy
 * @param { string } path
 * @returns { string } 
 */
function refinePath(path) {
    if (path.includes("//")) {
        path = path.replaceAll("//", "/");
    }
    if (path.endsWith("/")) {
        path = path.substring(0, path.length - 1);
    }
    if (path.endsWith(".html")) {
        path = path.substring(0, path.length - 5);
    }
    if (path.endsWith(".shtml")) {
        path = path.substring(0, path.length - 6);
    }
    if (path.endsWith("/index")) {
        path = path.substring(0, path.length - 6);
    }
    if (path.startsWith("/") == false) {
        path = "/" + path;
    }
    return path;
}

module.exports = {
    refinePath
}