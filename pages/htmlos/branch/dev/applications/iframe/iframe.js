//Prevent context menu
document.oncontextmenu = () => false;

//Define functions
const $ = (e) => document.querySelector(e); //e = element
const ele = (n) => document.createElement(n); //n = element name

//Define element variables
const v = $("#view"); //v = view
const u = $("#url"); //u = url
const s = $("#submit"); //s = submit

//Listen for submit
s.onclick = function() {
    /*
    v.innerHTML = "";
    var i = ele("iframe"); //i = iframe
    i.src = u.value;
    document.body.classList.remove("visit");
    v.append(i);
    */
   window.location.href = u.value;
}