var s = document.createElement("style");
document.body.append(s);
window.onresize = function() {
    s.innerHTML = ":root{--win-width:" + window.innerWidth + "px;--win-height:" + window.innerHeight + "px}";
}
s.innerHTML = ":root{--win-width:" + window.innerWidth + "px;--win-height:" + window.innerHeight + "px}";