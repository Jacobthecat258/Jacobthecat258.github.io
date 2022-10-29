//SETTINGS
const defaultX = 0;
const defaultY = 0;

//Disable context menu
window.oncontextmenu = ()=>false

//Create $
function $(e) {
    return document.querySelector(e);
}

//Target elements
const n = $("#name");
const a = $("#appdata");
const i = $("#icon");
const s = $("#submit");

//Detect submit
s.onclick = function() {
    if (n.value && a.value) {
        window.parent.addDesktopItem({
            name: n.value,
            icon: i.value, //todo: Add icon for when no icon specified instead of using invalid URL
            x: defaultX,
            y: defaultY,
            application: a.value
        });
        window.close();
    } //Todo: add message saying specify the name and appdata on else
}