//Init functions
function $(e) {
    return document.querySelector(e);
}
function newEle(e) {
    return document.createElement(e);
}
function installApp(data) {
    var d = data;
    console.log(d);
    var x = `<!DOCTYPE html>
    <html lang="en-us">
    <head></head>
    <body>
    <style>
    body{
    font-family: sans-serif;
    }
    </style>
    <p>Are you sure you want to install ${data.name}?</p>
    <button id="y">Yes</button>
    <button id="n">No</button>
    <script src="${URL.createObjectURL(new Blob([`
    var $=e=>document.querySelector(e);
    var y = $("#y");
    var n = $("#n");
    y.onclick = function(){
    var u = JSON.parse(localStorage.getItem("udat"));
    u.desktopitems.push(JSON.parse(${JSON.stringify(JSON.stringify(d))}));
    localStorage.setItem("udat", JSON.stringify(u));
    parent.reloadDesktop();
    close();
    }
    n.onclick = function(){close()}`]))}"></script>
    </body>
    </html>`;
    console.log(x);
    parent.createWindow(x, false);
}

//Disable right-click
oncontextmenu=_=>false;

//Load application
var applications = $("#applications");

function createDesktopItem(data) {
    var e = newEle("div"); //e = element
    e.classList.add("desktopitem");
    e.classList.add("preview");
    var i = newEle("div"); //i = image
    i.classList.add("desktopitemimage");
    i.style.backgroundImage = `url("${data.icon}")`;
    i.ondragstart = () => false; /*function() {return false}*/
    i.onerror = function() {i.onerror = null; i.style.backgroundImage = "../assets/FallbackIcon.svg"} //Fallback icon for invalid URL
    e.append(i);
    var n = newEle("div"); //n = name;
    n.classList.add("desktopitemname");
    n.append(data.name);
    e.append(n);
    data.application = "appstore/" + data.application;
    data.icon = "appstore/" + data.icon;
    e.addEventListener("click", function() {
        installApp(data) 
    });
    return e;
}

(async function() {
    var r = await fetch("applications_list.json");
    var library = await r.json();
    for (i = 0; i < library.length; i++) {
        applications.append(createDesktopItem(library[i]));
    }
})();