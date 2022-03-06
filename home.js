//THIS HAS NOT BEEN TESTED, NEXT THING TO DO IS TEST - NO

var debug = {
    projects: null, //TEST THE VALUE OF THIS - FOR TESTING JSON FILE
    rows: []
}

function $(e) {
    return document.querySelector(e);
}

var r = $("#projects");

function generateHomeRow(row, value) {
    debug.rows.push({r: row, v: value}) //debugging

    var row = document.createElement("div");
    row.classList.add("sitetreeitem");
    var a = document.createElement("a");
    a.href = `pages/${value}`;
    a.append(value);
    row.append(a);
    r.append(row);
}

function loadPage(projects) {
    debug.projects = projects //For debugging

    for (i = 0; i < projects.pages.length; i++) {
        generateHomeRow(i, projects.pages[i].path);
    }
}

function loadJSON(text) {
    loadPage(JSON.parse(text));
}

function loadText(res) {
    res.text().then(loadJSON); //ADD JSON PARSING - DONE - NOW MOVED
}

fetch("projects.json").then(loadText);

//THIS HAS NOT BEEN TESTED, NEXT THING TO DO IS TEST - THIS IS OUTDATED, SEE TOP
//NOW HAS BEEN TESTED, WORKING