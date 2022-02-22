var projectsPromise = (async function() {
    var obj = await fetch("projects.json");
    return obj.text();
})();
projectsPromise.then((projectsJSON) => {
    var projects = JSON.stringify(projectsJSON);
    console.log(projects);
});