var debug = {
    projects: null //TEST THE VALUE OF THIS
}

function loadPage(projects) {
    debug.projects = projects //For debugging
}

function loadJSON(res) {
    res.text().then(loadPage);
}

fetch("projects.json").then(loadJSON);

//THIS HAS NOT BEEN TESTED, NEXT THING TO DO IS TEST