var projects = (async function() {
    var obj = await fetch("projects.json");
    var txt = await obj.text();
    var pro = await txt;
    return pro;
})();
console.log(projects);