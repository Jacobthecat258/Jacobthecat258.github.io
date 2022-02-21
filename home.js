var projects = (async function() {
    var obj = await fetch("projects.json");
    var pro = obj.text();
    return pro;
})();
async var projects = await projects;
console.log(projects);