const blockMappings = [
    ["block", "#994400"],
    ["blockTop", "#994400"],
    ["player", "#ff0000"],
    ["death", "#ff0000"],
    ["greenKey", "#00ff00"],
    ["greenKeyBlock", "#00ff00"],
    ["blockTR", "#994400"],
    ["plateSmall", "#22dd22"],
    ["plateLarge", "#dd2222"],
    ["goal", "#44bb44"],
    ["redKey", "#ff0000"],
    ["redKeyBlock", "#ff0000"],
    ["pictureOfMe", "#000000"],
    ["transparent", "#0000"],
    ["jumpPad", "#ff22ff"],
    ["semisolid", "#cc773399"],
    ["semisolidBottom", "#cc773399"],
    ["move", "#00ff00"],
    ["signUp", "#ff0000"],
    ["signDown", "#ff0000"],
    ["signLeft", "#ff0000"],
    ["signRight", "#ff0000"]
]

function getObjectFromLevelData(e) {
    var params = [...e];
    var objectID = params.pop();
    var hasData = false;
    var data;
    if (typeof params[params.length-1] == "object") {
        hasData = true;
        data = params.pop();
    }
    //console.log(objectID, e);
    params = params.concat(blockMappings[objectID]);
    params[4] = blockMappings[objectID][1];
    params[5] = textures[blockMappings[objectID][0]];
    //console.log(params);
    if (hasData) params.push(data);
    
    return params;
}

function loadLevelData(data) {
    //console.log("data", data);
    var json = data; //[...data]; //JSON.parse(data);
    json.forEach(function(e) {
        r.createCollisionObject(...getObjectFromLevelData(e));
    });
}