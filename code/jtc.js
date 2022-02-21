var projects = (() => {
    var obj = await fetch("projects.json");
    var pro = await obj.text();
    return pro;
})();
console.log(pro);