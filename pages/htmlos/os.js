//Create $ and $$ functions
function $(e) {
    return document.querySelector(e);
}
function $$(e) {
    return document.querySelectorAll(e);
}

//Create element function
function newEle(name) {
    return document.createElement(name);
}

//Create range function
function range(number, min, max) {
    if (number < min) number = min;
    if (number > max) number = max;
    return number;
}

//Make dragable elements
var movepart = document;
var uppart = document;

function topZIndex(ele) {
    ele.style.zIndex = dragable.z + 1;
    dragable.z = dragable.z + 2;
}

function enableiframePointer() {
    for (i = 0; i < $$(".windowiframedragsurface").length; i++) {
        $$(".windowiframedragsurface")[i].style.display = "none";
    }
}

function disableiframePointer() {
    for (i = 0; i < $$(".windowiframedragsurface").length; i++) {
        $$(".windowiframedragsurface")[i].style.display = "block";
    }
}

var dragable = {
    z: 0,
    down: function(e, ele, drag) {
        disableiframePointer();
        ele.x2 = e.clientX;
        ele.y2 = e.clientY;
        movepart.onmousemove = function(e2) {
            dragable.move(e2, ele, drag);
        }
        uppart.onmouseup = function(e2) {
            dragable.up(e2, ele, drag);
        }
        topZIndex(ele);
    },
    move: function(e, ele, drag) {
        ele.x2 = ele.x1 - e.clientX;
        ele.y2 = ele.y1 - e.clientY;
        ele.x1 = e.clientX; //try using page instead of client
        ele.y1 = e.clientY;
        //console.log(`${e.clientX}px`, `${e.clientY}px`, ele, drag);
        ele.style.top = `${range((ele.offsetTop - ele.y2), 0, window.innerHeight)}px`;
        ele.style.left = `${range((ele.offsetLeft - ele.x2), 0, window.innerWidth)}px`;
    },
    up: function(e, ele, drag) {
        movepart.onmousemove = null;
        uppart.onmouseup = null;
        enableiframePointer();
        //console.log(ele);
        if (ele?.parentElement === desktop) {
            udat.desktopitems[ele.iconNumber].x = ele.style.left;
            udat.desktopitems[ele.iconNumber].y = ele.style.top;
            writeToLS(udat);
        }
    }
}

function makeDragable(element, dragpart) {
    dragpart.onmousedown = function(e) {
        dragable.down(e, element, dragpart);
    }
}

//Define OS
var os = $("#os");
os.innerHTML = "";
document.oncontextmenu = () => false;

var desktop = newEle("div");
desktop.id = "desktop";
os.append(desktop);
desktop.onselectstart = () => false; //Do not allow selecting of text, images, etc.

//Get user data
var udat = getLS();

//Create windows
var windows = newEle("div");
os.append(windows);
windows.id = "windows";

function createWindow(app, isRef) {
    var w = newEle("div"); //w = window
    w.classList.add("window");
    var h = newEle("div"); //h = header
    h.classList.add("windowheader");
    /*h.onmousedown = function() {

    }*/
    w.append(h);
    var c = newEle("button"); //c = close
    c.classList.add("windowclose");
    c.addEventListener("click", function() {
        w.remove();
    });
    h.append(c);
    var i = newEle("iframe"); //i = iframe
    i.classList.add("windowiframe");
    if (isRef) {
        i.src = app;
    } else {
        i.src = URL.createObjectURL(new Blob([app], {type: "text/html"}));
    }
    //i.setAttribute("sandbox", "");
    i.onload = function() {i.contentWindow.close = function() {w.remove()}} //This allows for closing the window via close() in the iframe
    w.append(i);
    var s = newEle("div") //s = iframe drag surface
    s.classList.add("windowiframedragsurface");
    w.append(s);
    makeDragable(w, h);
    topZIndex(w);
    windows.append(w);
}

//Create execute application functions
function handleAppOpen(e) {
    //console.log(e.target);
    if (e.button == 0 && e.detail == 2) createWindow(desktopitems[e.target.iconNumber].application);
}
function handleRefAppOpen(e) {
    //console.log(e.target);
    if (e.button == 0 && e.detail == 2) createWindow(desktopitems[e.target.iconNumber].application, true);
}

//Add files to desktop
var desktopitems = udat.desktopitems;

function createDesktopItem(data, nu) { //nu = icon number
    var e = newEle("div"); //e = element
    e.iconNumber = nu;
    e.classList.add("desktopitem");
    e.style.left = data.x;
    e.style.top = data.y;
    //console.log(data.isref);
    if (data.isref) {
        e.onclick = handleRefAppOpen;
    } else {
        e.onclick = handleAppOpen;
    }
    var w = newEle("div"); //w = image wrapper
    w.iconNumber = nu;
    w.classList.add("desktopitemimagewrapper");
    e.append(w);
    var i = newEle("img"); //i = image
    i.iconNumber = nu;
    i.classList.add("desktopitemimage");
    i.src = data.icon;
    i.ondragstart = () => false; /*function() {return false}*/
    i.onerror = function() {i.onerror = null; i.src = "assets/FallbackIcon.svg"} //Fallback icon for invalid URL
    w.append(i);
    var n = newEle("div"); //n = name
    n.iconNumber = nu;
    n.classList.add("desktopitemname");
    n.append(data.name);
    e.append(n);
    makeDragable(e, e);
    return e;
}

function addDesktopItem(data) {
    var l = udat.desktopitems.length; //l = length. This code may be confusing. The logic is that I want to pass the index of the item. But I have 2 options - 1: Subtract one 2: create a variable. I went for option 2.
    udat.desktopitems.push(data);
    writeToLS(udat);
    desktop.append(createDesktopItem(data, l));
}

for (i = 0; i < desktopitems.length; i++) {
    desktop.append(createDesktopItem(desktopitems[i], i));
}

//Add desktop image
document.body.style.background = udat.desktopimage;
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundSize = "contain"
document.body.style.backgroundPosition = "center";

//Create context menu [IN PROGRESS]
function getCTMI(ele, first) {
    if (!first) first = ele;
    if (ele.ctmi) {
        return ele.ctmi;
    } else if (ele.parentElement) {
        return getCTMI(ele.parentElement, first);
    } else {
        console.error("Cannot get CTMI on", first);
    }
}

function createContextMenu(ele) {
    var ctm = {} //ctm = context menu
    ctm.e = ele;
    ctm.node = newEle("div");
    ctm.node.classList.add("ctm");
    ctm.node.oncontextmenu = () => false;
    document.onmousedown = function(e) {
        if (!ctm.node.contains(e.target)) ctm.node.style.display = "none";
    }
    ctm.e.oncontextmenu = function(e) {
        if ((!e.target) || (!e.preventDefault)) return false;
        ctm.node.style.left = `${e.clientX}px`;
        ctm.node.style.top = `${e.clientY}px`;
        e.preventDefault();
        //console.log("tar", e.target);
        var items = getCTMI(e.target); //ctmi = context menu items
        ctm.node.innerHTML = "";
        for (i = 0; i < items.length; i++) {
            var it = newEle("div"); //it = item
            it.itemnumber = i;
            it.classList.add("ctmitem");
            it.append(items[i]?.name);
            it.onclick = function(e2) {
                //console.log(e.target);
                ctm.node.style.display = "none";
                //console.log(getCTMI(e.target)[e2.target.itemnumber]);
                getCTMI(e.target)[e2.target.itemnumber]?.run(e2);
            }
            ctm.node.append(it);
            //console.log(it);
        }
        ctm.node.style.display = "block";
    }
    return ctm;
}

//Create desktop context menu
desktop.ctmi = [
    {
        name: "Create File",
        run: function() {
            createWindow("applications/newfile/index.html", true);
        }
    }
]
var DCTM = createContextMenu(desktop);
DCTM.node.style.zIndex = 2;
os.append(DCTM.node);

//Testing Area
function rud() { //rud = reset user data. Used for testing.
    writeToLS(null);
}