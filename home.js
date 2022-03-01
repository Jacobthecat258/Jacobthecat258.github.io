//THIS HAS NOT BEEN TESTED, NEXT THING TO DO IS TEST - NO

var debug = {
    projects: null //TEST THE VALUE OF THIS
}

function loadPage(projects) {
    debug.projects = projects //For debugging
}

function loadJSON(res) {
    var parsed = JSON.parse(res)
    parsed.text().then(loadPage); //ADD JSON PARSING - DONE
}

fetch("projects.json").then(loadJSON);

//THIS HAS NOT BEEN TESTED, NEXT THING TO DO IS TEST - THIS IS OUTDATED, SEE TOP
//NOW HAS BEEN TESTED, WORKING