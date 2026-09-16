/**
 * Make the URL tidy
 * @param { string } path
 * @returns {{
 *    needRefresh: boolean,
 *    refinedPath: string
 * }} 
 */
function refinePath(path) {
    let refresh = false;

    if (path.startsWith("//"))
        refresh = true;

    while (path.startsWith("/"))
        path = path.substring(1);

    if (path.includes("//")) {
        refresh = true;
        path = path.replaceAll("//", "/");
    }
    if (path.endsWith("/")) {
        refresh = true;
        path = path.substring(0, path.length - 1);
    }
    if (path.endsWith(".html")) {
        refresh = true;
        path = path.substring(0, path.length - 5);
    }
    if (path.endsWith(".shtml")) {
        refresh = true;
        path = path.substring(0, path.length - 6);
    }
    
    return {
        needRefresh: refresh, 
        refinedPath: path
    }
}

module.exports = {
    refinePath
}