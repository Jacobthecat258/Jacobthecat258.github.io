function loadPath(path, changes) {
    var arrPath = [];
    var oldPath = path;
    for(;oldPath !== "";) {
        var x = oldPath.indexOf("\\");
        if (x === -1) {
            arrPath.push(oldPath);
            oldPath = "";
        } else {
            arrPath.push(oldPath.substring(0, x));
            oldPath = oldPath.substring(x + 1, oldPath.length);
            console.log(oldPath, arrPath);
        }
    }
    var ls = getLS();
    var current = ls.system;
    var currentStack = [current];
    var returnValue;
    for (var i = 0; i < arrPath.length && !returnValue; i++) {
        var c;
        try {
            c = current[arrPath[i]];
            if (i == arrPath.length - 1) contents = c; 
        } catch {
            returnValue = {
                type: "error",
                value: "Cannot get path"
            }
        }
        if (c === undefined) {
            returnValue = {
                type: "error",
                value: "Cannot get path"
            }
        }
        current = c;
        currentStack.push(current);
    }
    if (returnValue) return returnValue;
    if (changes) {
        var str = "ls.system"
        for (var i = 0; i < arrPath.length; i++) {
            str += "[" + JSON.stringify(arrPath[i]) + "]"
        }
        var str1 = "ls.system"
        for (var i = 0; i < arrPath.length - 1; i++) {
            str1 += "[" + JSON.stringify(arrPath[i]) + "]"
        }

        if (changes?.create && typeof current === "object") {
            current[changes.create.name] = changes.create.value;
        }
        if (changes?.edit && typeof current === "string") {
            console.log("edit!", currentStack, arrPath, currentStack[currentStack.length - 2], currentStack, JSON.parse(JSON.stringify(currentStack)));
            str += ` = ${JSON.stringify(changes.edit)}`;
            console.log(str);
            eval(str);
            current = changes.edit;
        }
        if (changes?.delete) {
            console.log(str);
            eval("delete " + str);
        }
        if (changes?.rename) {
            loadPath(path, {delete: true});
            var p = "";
            for (var i = 0; i < arrPath.length - 1; i++) {
                p += arrPath[i] + "\\";
            }
            var c;
            if (typeof current == "string") {
                c = JSON.stringify(current);
            } else {
                c = JSON.stringify(JSON.stringify(current));
            }
            console.log(str1 + "[" + JSON.stringify(changes?.rename) + "] = " + c);
            eval(str1 + "[" + JSON.stringify(changes?.rename) + "] = " + c);
            eval("delete " + str);
        };
        //create, rename, delete, edit, check if multiple work at same time, also do rename last so the change in target wont mess anything up
        //so in order create, edit, delete, rename... just cant rename something you deleted or youll get an error...
        writeToLS(ls);
    }
    if (typeof current === "object") {
        return {
            type: "folder",
            value: current
        }
    } else {
        return {
            type: "file",
            value: current
        }
    }
}