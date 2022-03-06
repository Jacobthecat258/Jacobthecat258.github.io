var pos = {
    x: 0,
    y: 0
}

j.install([j.packages.$, j.packages.gamepad, j.packages.input]);

var tail = j.$(".tail");
var speed = 3;

window.addEventListener("jinput", (e) => {
    if (e.detail.axesnum == 0) {
        pos.x = pos.x + e.detail.value;
        tail.style.left = speed * pos.x + "px";
    }
    if (e.detail.axesnum == 1) {
        pos.y = pos.y + e.detail.value;
        tail.style.top = speed * pos.y + "px";
    }
});