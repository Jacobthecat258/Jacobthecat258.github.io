function $(e) {return document.querySelector(e)}
function getID() {return $("#id").value}
if (localStorage.getItem("ist") === null) localStorage.setItem("ist", "[]");

$("#lookup").onclick = function(){
    if (getID() != "") /*window.open(*/ window.location.href = "lookup.html?i=" + getID(), "", "e" /*)*/;
}
$("#create").onclick = function(){
    /*window.open(*/ window.location.href = "create.html", "", "e" /*)*/;
}