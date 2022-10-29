var setting_parser_cs = document.currentScript.src;
async function parseSettings() {
    var s = document.createElement("style");
    var styles = "";
    var req = await fetch(new URL("css-mappings.json", setting_parser_cs));
    var mappings = await req.json();
    var req2 = await fetch(new URL("setting-mappings.json", setting_parser_cs));
    var settingMappings = await req2.json();
    console.log(mappings, settingMappings);
    var ls = getLS();
    for (i = 0; i < mappings.length; i++) {
        var x = ls.settings[settingMappings[i]].toString();
        if (x.indexOf("#") === -1) x += "px";
        styles += "--" + mappings[i] + ":" + x + ";";
    }
    styles = ":root{" + styles + "}";
    s.innerHTML = styles;
    document.body.append(s);
}
parseSettings();