var projectsPromise = (async function() {
    var obj = await fetch("projects.json");
    return obj.json();
})();
projectsPromise.then((projectsJSON) => {
    var projects = JSON.parse(projectsJSON);
    console.log(projects);
});