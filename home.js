//THIS HAS NOT BEEN TESTED, NEXT THING TO DO IS TEST - YES

var debug = {
    projects: null //TEST THE VALUE OF THIS
}

function loadPage(projects) {
    debug.projects = projects //For debugging
}

function loadJSON(text) {
    loadPage(JSON.parse(text));
}

function loadText(res) {
    res.text().then(loadPage); //ADD JSON PARSING - DONE - NOW MOVED
}

fetch("projects.json").then(loadText);

//THIS HAS NOT BEEN TESTED, NEXT THING TO DO IS TEST - THIS IS OUTDATED, SEE TOP
//NOW HAS BEEN TESTED, WORKING