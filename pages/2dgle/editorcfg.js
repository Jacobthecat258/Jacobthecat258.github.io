var editorCfgDisplay = {
    speed: "Editor movement speed",
    snap: "Snap size"
}

if (localStorage.getItem("editorcfg") == null) {
    localStorage.setItem("editorcfg", JSON.stringify({
        speed: 1,
        snap: 10
    }));
}
window.onload = function() {
    if (localStorage.getItem("2dgautosave") == null) {
        localStorage.setItem("2dgautosave", saveLevel(true));
    }
}

function changeEditorCfg() {
    keys = new Set();

    let ls = JSON.parse(localStorage.getItem("editorcfg"));
    Object.keys(editorCfgDisplay).forEach(function(e, i) {
        //let name = editorCfgDisplay[e];
        let newValue = prompt(Object.values(editorCfgDisplay)[i], ls[e]);
        //console.log(newValue, isNaN(newValue));
        ls[e] = isNaN(newValue) || newValue == null ? ls[e] : newValue;
    })
    localStorage.setItem("editorcfg", JSON.stringify(ls));
}