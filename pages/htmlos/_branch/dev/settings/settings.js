oncontextmenu=_=>false;
(async()=>{
    window.oncontextmenumenu=_=>false;
    var $=e=>document.querySelector(e);
    var $$=e=>document.querySelectorAll(e);
    
    var settingMappingsRequest = await fetch("setting-mappings.json");
    var settingMappings = await settingMappingsRequest.json();
    var ls = getLS();
    console.log(settingMappings);
    
    for (var i = 0, x = $$("setting[n]"); i < x.length; i++) {
        var e = document.createElement("input");
        e.type = "number";
        x[i].append(e);
    }
    for (var i = 0, x = $$("setting[c]"); i < x.length; i++) {
        var e = document.createElement("input");
        e.type = "color";
        x[i].append(e);
    }
    for (var i = 0, x = $$("setting > input"); i < x.length; i++) {
        x[i].value = ls.settings[settingMappings[i]];
    }
    $("#wallpaper").value = ls.desktopimage;

    $("#save").addEventListener("click", function() {
        for (var i = 0, x = $$("setting > input"); i < x.length; i++) {
            ls.settings[settingMappings[i]] = x[i].value;
        }
        ls.desktopimage = $("#wallpaper").value;
        writeToLS(ls);
        parent.parseSettings();
        parent.reloadDesktop();
        parseSettings();
    });
})();

function uploadWP() {
    var e = document.createElement("input");
    e.type = "file";
    e.onchange = function() {
        var f = new FileReader();
        f.readAsDataURL(e.files[0]);
        f.onload = function() {
            document.querySelector("#wallpaper").value = f.result;
        }
    }
    console.log(e);
    e.click();
}