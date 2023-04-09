//Init functions
function strictOr(a, b) {
    if (a === undefined) {
        return b;
    } else {
        return a;
    }
}

function arrayAll(array, fn) { //this could be "Array.prototype.all = function all(fn) {" but it would affect arrays outside of jrc2.
    let output = [];           //fn is function
    array.forEach(function(item, index) { //example: console.log(arrayAll([12, 30, -5], (e,i)=>e-i)); // [12, 29, -7]]
        output.push(fn(item, index, array));
    });
    return output;
}

function mapDataFromObject(e) {
    if (!e) return [];
    let o = [];
    o.push(e.x, e.y, e.sizex, e.sizey);
    if (e.data) o.push(e.data);
    //console.log(arrayAll(blockMappings, function(f) {return f[0]==Object.keys(textures)[Object.values(textures).indexOf(e.texture)]&&f[1]==e.color}));
    o.push(arrayAll(blockMappings, function(f) {return f[0]==Object.keys(textures)[Object.values(textures).indexOf(e.texture)]&&f[1]==e.color}).indexOf(true));
    return o;
}

function findNew(old) {
    //if (!old) return;
    let oldMD = JSON.stringify(mapDataFromObject(old));
    for (let i in r._objects) {
        if (JSON.stringify(mapDataFromObject(r._objects[i])) == oldMD) return r._objects[i];
    }
}

function updateLEDisplay() { //updateLEDisplay = update level editor display
    loadObjects();
    r.updateDisplay();
    drawDebugMode();
    selectedObjects.forEach(function(e, i) {
        selectedObjects[i] = findNew(e);
    });
}

function roundTo(x, y) {
    return Math.round(x / y) * y;
}
function useSnap(x, y) {
    if (!snapMove) return [x, y];
    let snapSize = JSON.parse(localStorage.getItem("editorcfg")).snap;
    return [roundTo(x, snapSize), roundTo(y, snapSize)];
}
function drawDebugMode() {
    if (debugModeEnabled) {
        var nextTxtY = 10; //make this let

        debugRows.forEach(function(e) {
            if (e.type == "txt") {
                r._ctx.textAlign = "start";
                r._ctx.textBaseline = "top";
                r._ctx.fillStyle = "#b00";
                r._ctx.font = "25px serif";
                r._ctx.fillText(e.a, 10, nextTxtY, 100 * r.quality);
                r._ctx.fillStyle = "#bb0";
                r._ctx.textAlign = "end";
                r._ctx.fillText(e.b(), 990, nextTxtY, 100 * r.quality);
                nextTxtY += 25;
            } else {
                r._ctx.textAlign = "start";
                r._ctx.textBaseline = "top";
                r._ctx.fillStyle = "#0b0";
                r._ctx.font = "25px serif";
                r._ctx.fillText(e.name, 10, nextTxtY, 100 * r.quality);     
                nextTxtY += 25;           
            }
        });
        let _x = player.x - r.scrollx, _y = player.y + player.sizey - jumpdetectoffset /*- (jumpdetectoffset * 2)*/- r.scrolly;
        line(_x, _y, _x + player.sizex, _y);
        //txt("jdo", _=>jumpdetectoffset);
        //let cols = player.isColliding();
        if (_dev_iscol) _dev_iscol.forEach(function(e) {
            //line(r.quality * (e.x - r.scrollx), r.quality * (e.y - r.scrolly), (e.x + e.sizex - r.scrollx) * r.quality, r.quality * (e.y - r.scrolly));
            r._ctx.fillRect(r.quality * (e.x - r.scrollx), r.quality * (e.y - r.scrolly), e.sizex * r.quality, /*e.sizey * r.quality*/ 10);
        });
    }
}
function updateSelectedObject(md, i) {
    let temp = r.createObject(...getObjectFromLevelData(md));
    temp.remove();
    selectedObjects[i] = temp;
}

function getKeyByValue(o, v) {
    return Object.keys(o).find(e => o[e] === v);
} 

// Help
window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyH") {
        e.preventDefault();
        this.window.open("help");
    }
});

//alert("Use Ctrl+H to bring up help");
let showHelpText = true;

function drawHelpText() {
    if (showHelpText) {
        r._ctx.font = "100px sans-serif";
        r._ctx.fillStyle = "#fff";
        r._ctx.strokeStyle = "#000";
        r._ctx.textAlign = "center";
        r._ctx.textBaseline = "bottom";
        r._ctx.lineWidth = 2;
        r._ctx.fillText("Press Y for help.", 500, 800);
        r._ctx.strokeText("Press Y for help.", 500, 800);
    }
}

window.addEventListener("keydown", function() {
    if (showHelpText) {
        inputStartFrame = frame;
    }
    showHelpText = false;
});

let startingValues = {};

function saveSV() {
    let config = {};
    config_names.forEach(function(e) {
        config[e] = window[e];
    });
    startingValues = JSON.parse(JSON.stringify(config));
    return config;
}
function restoreSV() {
    Object.keys(startingValues).forEach(function(e) {
        window[e] = startingValues[e];
    });
}

//Init JRC2
var r = new jrc2();
r.quality = 10;
r.width = 100;
r.height = 100;
r.scrollx = scrollx;
r.reuseDeletedObjectSlots = true;
/*r.resolutionx = "100";
r.resolutiony = "100";*/
r.node.style.display = "block";
//document.body.append(r.node);
document.querySelector("#game-wrapper").append(r.node);

//r.node.width = "100%";
//r.node.height = "100%";
r.config.updateDisplaySize = false;



//let rot = 0;

//debug init
var debugRows = [];
function txt(a,b) {
    debugRows.push({type: "txt", a: a, b: b});
    /*r._ctx.textAlign = "start";
    r._ctx.textBaseline = "top";
    r._ctx.fillStyle = "#b00";
    r._ctx.font = "50px serif";
    r._ctx.fillText(a, 10, nextTxtY, 100 * r.quality);
    r._ctx.fillStyle = "#bb0";
    r._ctx.textAlign = "end";
    r._ctx.fillText(b, 990, nextTxtY, 100 * r.quality);
    nextTxtY += 50;*/
}
function keybind(key, name, action) {
    debugRows.push({type: "bind", name: name})
    /*r._ctx.textAlign = "start";
    r._ctx.textBaseline = "top";
    r._ctx.fillStyle = "#0b0";
    r._ctx.font = "50px serif";
    r._ctx.fillText(name, 10, nextTxtY, 100 * r.quality);*/
    window.addEventListener("keydown", function(e) {if (debugModeEnabled && e.code == key) action()}); //if (keys.has(key)) action();
    //nextTxtY += 50;
}
//txt("hi", "there");
//txt("how", "r u");

txt("x:", _=>player.x);
txt("y:", _=>player?.y);
txt("psx:", _=>playersizex);
txt("psy:", _=>playersizey);
txt("items:", _=>JSON.stringify(items))
keybind("KeyK", "[k] lvl2", function(){
    player.x = 360;
    player.y = 64;
    r.scrollx = 350;
});
txt("keys:", _=>JSON.stringify(Array.from(keys)));
txt("ctrl", _=>keys.has("ControlLeft") || keys.has("ControlRight"));
txt("objs", _=>r._objects.length);
keybind("KeyI", "[i] create object to test object slot reusal", r.createObject);
keybind("KeyJ", "[J] create 1000 collision objects to test speed", function(){for(let i=0;i<1000;i++){r.createCollisionObject()}});
//txt("editorDragging", _=>editorDragging);
txt("cursorpos", _=>levelEditorCursor?._currentMousePos ? Number.parseFloat(levelEditorCursor?._currentMousePos[0]).toFixed(2)+", "+levelEditorCursor?._currentMousePos[1].toFixed(2) : "not loaded yet");
txt("USTO", _=>useSnapToOffset);
keybind("KeyG", "[g] +1 green key & +1 red key", _=>{items.greenKey++; items.redKey++});
txt("jumping", _=>jumping);
let _dev_iscol = false;
txt("iscol", _=>Boolean(_dev_iscol));
txt("iscol_semisolid", _=>Boolean(_dev_iscol) && _dev_iscol.some(e => e.texture === textures.semisolid)); 
let _dev_oldRAF = requestAnimationFrame;
let _dev_frameAdvance = false;
keybind("Backquote", "[`] frame advance toggle", function() {
    if (_dev_frameAdvance) {
        requestAnimationFrame = _dev_oldRAF;
        tick();
    } else {
        requestAnimationFrame = _=>undefined;
    }
    _dev_frameAdvance = !_dev_frameAdvance;
});
keybind("Backslash", "[\\] frame advance", function() {
    if (_dev_frameAdvance) tick();
});
function line(x, y, a, b) {
    r._ctx.beginPath();
    r._ctx.moveTo(x * r.quality, y * r.quality);
    r._ctx.strokeStyle = "#f0f";
    r._ctx.lineWidth = 10;
    r._ctx.lineTo(a * r.quality, b * r.quality);
    r._ctx.stroke();
    r._ctx.closePath();
}
txt("frame", _=>frame);
txt("frame_from_first_input", _=>inputStartFrame==Infinity?-1:frame-inputStartFrame);
txt("goalFrame", _=>inputStartFrame==Infinity||goalFrame==-1?-1:goalFrame-inputStartFrame);
txt("real_time", _=>inputStartFrame==Infinity||goalFrame==-1?-1:goalFrame_Date-ISF_Date);
txt("RT_sec", _=>inputStartFrame==Infinity||goalFrame==-1?-1:(goalFrame_Date-ISF_Date)/1000);
txt("scrollx", _=>r.scrollx);
txt("scrolly", _=>r.scrolly);

//var levelEditorButtonPressed = 

/*setInterval(function(){*/function tick(){

    let gamepad = navigator.getGamepads()[0];
    let buttons = gamepad?.buttons;
    let axes = gamepad?.axes;

    if (buttons?.[14].pressed || axes?.[0] < -0.2) {
        keys.add("ArrowLeft");
        showHelpText = false;
    } else {
        keys.delete("ArrowLeft");
    }
    if (buttons?.[15].pressed || axes?.[0] > 0.2) {
        keys.add("ArrowRight");
        showHelpText = false;
    } else {
        keys.delete("ArrowRight");
    }
    if ((buttons?.[13].pressed || axes?.[1] > 0.5) && levelEditorEnabled) {
        keys.add("ArrowDown");
        showHelpText = false;
    } else {
        keys.delete("ArrowDown");
    }
    if (buttons?.[12].pressed || (buttons?.[1].pressed && !levelEditorEnabled) || (buttons?.[0].pressed && !levelEditorEnabled) || axes?.[1] < -0.5) {
        showHelpText = false;
        keys.add("ArrowUp");
    } else {
        keys.delete("ArrowUp");
    }
    if (buttons?.[2].pressed) {
        if (confirm("Do you want to see the help section?")) location.href = "help";
    }
    if (buttons?.[11].pressed) {
        if (confirm("Do you want to " + (levelEditorEnabled ? "close" : "open") + " the level editor?")) window.dispatchEvent(new KeyboardEvent("keydown", {code: "KeyM", ctrlKey: true}));
    }

    //playersizex=-1;playersizey=-1//if(playersizex>0)playersizex*=-1;if(playersizey>0)playersizey*=-1;

    if (levelEditorEnabled) {
        updateLEDisplay(); //r.updateDisplay();
        r._ctx.strokeStyle = "#f00";
        r._ctx.lineWidth = r.quality;
        if (selectedObjects) {
            selectedObjects.forEach(function(e, i) {
                if (!e) {
                    console.warn("Found", e, "at index", i, "of selectedObjects. It will be deleted.");
                    selectedObjects.splice(i, 1);
                    return;
                }
                r._ctx.strokeRect((e.x - r.scrollx) * r.quality, (e.y - r.scrolly) * r.quality, e.sizex * r.quality, e.sizey * r.quality);
            });
        }
        if (/*levelEditorEnabled && */ multiSelect && levelEditorCursor?._currentMousePos) {
            console.log("drawing multiselect...");
            r._ctx.fillStyle = "#aaaaffaa";
            //r._ctx.fillRect((clickStart[0] - r.scrollx) * r.quality, (clickStart[1] - r.scrolly) * r.quality, (r.scrollx - clickStart[0]) * r.quality, (r.scrolly - clickStart[1]) * r.quality);
            //r._ctx.fillRect(dragStart[0] * r.quality, dragStart[1] * r.quality, (levelEditorCursor._currentMousePos[0] - dragStart[0]) * r.quality, (levelEditorCursor._currentMousePos[1] - dragStart[1]) * r.quality);
        }
        window.dispatchEvent(new Event("keyupdate"));
        //window.requestAnimationFrame(tick);
        //return;
    } else {

   // movementSpeed = keys?.ShiftLeft || keys?.ShiftRight ? sprintSpeed : noSprintSpeed;

    //rot++;
    //player.rotation = rot * Math.PI / 180;

    if (lockscrolly) {
        r.scrolly = 0
    } else {
        r.scrolly = player.y - 50;
    }

    r.updateDisplay();
    window.dispatchEvent(new Event("keyupdate"));
    move(0, gravity - jumping);
    jumping = jumping - jumpdownspeed;
    if (jumping < 0) jumping = 0;
    //document.querySelector("#debug").innerHTML = jumping + ",x&y=" + player.x + ", " + player.y;
    if (player.y > 100) {
        if (wrapmode) { //Wrap Mode
            player.y = 0 - playersizey;
        } else if (falldeath && death) {
            restart();
        }
    }
    player.sizex = playersizex;
    player.sizey = playersizey;
    /*if (iscolliding(player.x, player.y, playersizex, playersizey)) {
        move(1, -1, true);
    }*/


    drawDebugMode();
    drawHelpText();

    }
    frame++;

requestAnimationFrame(tick);/*}, 10);*/}requestAnimationFrame(tick);

//Init textures
var textures = {
    block: r.createTexture("textures/block.svg"),
    blockTop: r.createTexture("textures/block-top.svg"),
    player: r.createTexture("textures/player.svg"),
    //player: r.createTexture("dev/dance-moves.gif"),
    //player: r.createTexture("dev/minnie.png"),
    death: r.createTexture("textures/death.svg"),
    greenKey: r.createTexture("textures/green-key.svg"),
    greenKeyBlock: r.createTexture("textures/green-key-block.svg"),
    blockTR: r.createTexture("textures/block-tr.svg"), //tr = top-right
    plateSmall: r.createTexture("textures/plate-small.svg"),
    plateLarge: r.createTexture("textures/plate-large.svg"),
    goal: r.createTexture("textures/goal.svg"),
    redKey: r.createTexture("textures/red-key.svg"),
    redKeyBlock: r.createTexture("textures/red-key-block.svg"),
    pictureOfMe: r.createTexture("dev/dance-moves.gif"), //hehe
    transparent: r.createTexture("textures/transparent.svg"),
    jumpPad: r.createTexture("textures/jumppad.svg"),
    semisolid: r.createTexture("textures/semisolid.svg"),
    semisolidBottom: r.createTexture("textures/semisolid_bottom.svg"),
    move: r.createTexture("textures/move.svg"),
    signUp: r.createTexture("textures/indicators/sign_up.svg"),
    signDown: r.createTexture("textures/indicators/sign_down.svg"),
    signLeft: r.createTexture("textures/indicators/sign_left.svg"),
    signRight: r.createTexture("textures/indicators/sign_right.svg")
}


//Create map

function iscolliding(x, y, sizex, sizey) {
    let ps = r.isColliding(x, y, sizex, sizey); //ps being plural p\
    let remove = [];
    if (ps) {
        ps.forEach(function(p) {
            
        if (p?.texture === textures.semisolid) {
            //let col = r._collisionPoints[p.collisionID];
            //let yf = col.yf - sizey;
            //console.log(y + sizey + jumpdetectoffset, p.y);
            if (/*yf <= y*/ y + sizey - jumpdetectoffset <= p.y) {
                //console.log("semisolid collide");
                if (r.isColliding(x, y - jumping, sizex, sizey)) {
                    //more collide
                } else {
                    remove.push(p);
                }
            } else {
                //ps.splice(ps.indexOf(p), 1);
                //console.log("NOOOO semisolid collide");
                remove.push(p);
            }
            return;
        }
        if (p?.texture === textures.semisolidBottom || p?.texture === textures.signUp || p?.texture === textures.signDown || p?.texture === textures.signLeft || p?.texture === textures.signRight) {
            remove.push(p);
        }
        if (p?.texture === textures.move) {
            if (!p?.data?.used) {
                p.data.used = true;
                let o = r._objects[p.data.id], c = r._collisionPoints[o.collisionID];
                o.x += p.data.x, c.xf += p.data.x, c.xt += p.data.x;
                o.y += p.data.y, c.yf += p.data.y, c.yt += p.data.y;
                o.sizex += p.data.sizex, c.xt += p.data.sizex;
                o.sizey += p.data.sizey, c.yt += p.data.sizey;
            }
            remove.push(p);
        }
    /*for (i = 0; i < r._collisionPoints.length; i++) {
        var p1 = r._collisionPoints[i];
        if (p1) {
            var o = p; //This removes the object to prevent cyclic object error.
            p = null;
            var p = JSON.parse(JSON.stringify(r._collisionPoints[i])); //p = points, the parse and stringify are for making a clone of the object.
            p = o;
            p.xf = p.xf - sizex;
            p.yf = p.yf - sizey;

            if (p.xf <= x && p.xt >= x && p.yf <= y && p.yt >= y) {*/
                //Data
                if (p) {
                p.death = p?.texture === textures.death;
                p.isGreenKey = p?.texture === textures.greenKey;
                p.isGreenKeyBlock = p?.texture === textures.greenKeyBlock;
                p.isPlateSmall = p?.texture === textures.plateSmall;
                p.isPlateLarge = p?.texture === textures.plateLarge;
                p.isGoal = p?.texture === textures.goal;
                p.isRedKey = p?.texture === textures.redKey;
                p.isRedKeyBlock = p?.texture === textures.redKeyBlock;
                p.isJumpPad = p?.texture === textures.jumpPad;

                //document.querySelector("#debug").innerHTML = JSON.stringify(p);

                if (p.death && death) {
                    restart();
                } else if (p.isGreenKey) {
                    p.remove();
                    items.greenKey++;
                } else if (p.isGreenKeyBlock & items.greenKey > 0) {
                    items.greenKey--;
                    p.remove();
                } else if (p.isPlateSmall || p.isPlateLarge) {
                    playersizex = strictOr(p.data.sizex, p.data.size);
                    playersizey = strictOr(p.data.sizey, p.data.size);
                    player.y = p.y - playersizey;
                } else if (p.isGoal) {               //I was trying to fix this because it ran the code for the main goal instead of the one I was coming in contact with.
                    window.playerx = p.data.playerx; //Turns out both goals fired instead of just the one.
                    window.playery = p.data.playery; //I was staring at it for hours, turns ou tthe issue was the spawn location for the goal I touched was the same as the main goal.
                    window.scrollx = p.data.scrollx; //That means it instantly runs the code for the main goal on collision, so it ran the code for the main goal.
                    window.initialplayersizex = p.data.initialplayersizex;
                    window.initialplayersizey = p.data.initialplayersizey;
                    window.levelend = p.data.levelend;
                    window.lockscrolly = p.data.lockscrolly;
                    //console.log(p.data.minimumscrollx);
                    window.minimumscrollx = strictOr(p.data.minimumscrollx /*||*/, window.minimumscrollx);
                    var carryItems = items;
                    for (i = 0; i < r._objects.length; i++) {
                        if (r._objects[i] === player) {
                            r._objects[i].remove();
                        }
                    }
                    restart();
                    window.initialItems = strictOr(p.data.initialItems, initialItems);
                    loadPlayer();
                    if (p.data.carryItems) window.items = carryItems;
                    r.scrollx = scrollx;

                    goalFrame = frame;
                    goalFrame_Date = new Date();
                } else if (p.isRedKey) {
                    p.remove();
                    items.redKey++;
                } else if (p.isRedKeyBlock & items.redKey > 0) {
                    items.redKey--;
                    p.remove();
                } else if (p.isJumpPad) {
                    /*let oldJH = jumpspeed;
                    jumpspeed = p.data.speed;
                    jump();
                    jumpspeed = oldJH;*/
                    jumping = p.data.speed;
                }
                }/*
                return true
            }
        }
    }*/
        });
    }
    /*if (remove.length > 0) {
        remove.forEach(function(e) {
            ps.splice(ps.indexOf(e), 1);
        });
    }*/
    let ps2 = [];
    //console.log(remove);
    //console.log(ps);
    if (ps) {
        ps.forEach(function(e) {
            if (!remove.includes(e)) ps2.push(e);
            //console.log(remove.includes(e), e);
        });
    } else  {/*console.log("else");*/ ps2 = ps};
    if (ps2.length == 0) {ps2 = false}
    //console.log(ps, ps2);
    return ps2;
}

function loadObjects() {
    /*for (i = 0; i < r._objects.length; i++) {
        if (r._objects[i] !== player) {
            r._objects[i] = null;
        }
    }*/
    //console.log(r._objects);
    r._objects.forEach(function(e, i) {
        if (e !== player) /*e == undefined*/ r._objects[i] = null;
    });
    //console.log(window?.player, r._objects);
    //r._objects = [];

    //Level 1
    r._collisionPoints = [];

    /*

    r.createCollisionObject(0, 50, 100, 10, "#994400", textures.blockTop);
    r.createCollisionObject(0, 60, 100, 40, "#994400", textures.block);

    r.createCollisionObject(125, 40, 10, 10, "#994400", textures.blockTop);
    r.createCollisionObject(135, 50, 15, 10, "#ff0000", textures.death);
    r.createCollisionObject(150, 30, 30, 10, "#994400", textures.blockTop);
    r.createCollisionObject(170, 90, 20, 10, "#994400", textures.blockTop);
    r.createCollisionObject(172, 88, 16, 02, "#22dd22", textures.plateSmall, {size: 4});

    //Add green key and green key blocks
    //Behavior idea: The green key on contact will delete itself (through new proprity of the colisionObject, I'm not sure what it will be called. but it will point to the object. When there is no object (such as the left wall), it will be undefined or null) and run "items.greenKey++".
    //The green key block on contact will run some kind of code like this: "if (items.greenKey) {items.greenKey--; thisColisionPoint.theCollisionObjectItIsUsedFor.remove()}", where it removed a key and removes the object, but only if the player has a key. Otherwise, it could just be collided with, however, the collision is already programmed in the iscolliding. Also, the if loop will be placed in the iscolliding.
    r.createCollisionObject(160, 65, 10, 10, "#00ff00", textures.greenKey);
    r.createCollisionObject(230, 65, 10, 10, "#00ff00", textures.greenKeyBlock);
    r.createCollisionObject(210, 75, 120, 10, "#994400", textures.blockTop);
    r.createCollisionObject(210, 85, 120, 15, "#994400", textures.block);
    r.createCollisionObject(210, 00, 40, 10, "#994400", textures.blockTop);
    r.createCollisionObject(210, 10, 20, 45, "#994400", textures.block);
    r.createCollisionObject(220, 55, 10, 10, "#994400", textures.block);
    r.createCollisionObject(230, 10, 20, 35, "#994400", textures.block);
    r.createCollisionObject(240, 45, 10, 20, "#994400", textures.block);
    r.createCollisionObject(230, 55, 10, 10, "#ff0000", textures.redKeyBlock);
    r.createCollisionObject(230, 45, 10, 10, "#44bb44", textures.goal, {
        playerx: 360,
        playery: 64,
        scrollx: 350,
        initialplayersizex: 10,
        initialplayersizey: 10,
        carryItems: false,
        levelend: 500,
        initialItems: initialItems,
        minimumscrollx: 350
    });
    r.createCollisionObject(262, 73, 06, 02, "#dd2222", textures.plateLarge, {size: 40});
    r.createCollisionObject(252, 20, 10, 10, "#ff0000", textures.redKey);

    r.createCollisionObject(320, 0, 10, 75, "#44bb44", textures.goal, {
        playerx: 10,
        playery: 39,
        scrollx: 0,
        initialplayersizex: 25,
        initialplayersizey: 10,
        carryItems: true,
        levelend: 330,
        initialItems: window.items
    });

    //Level 2
    r.createCollisionObject(350, 75, 200, 10, "#994400", textures.blockTop);
    r.createCollisionObject(350, 85, 200, 35, "#994400", textures.block);
    
    //Left Border
    if (leftborder) {
        r.createCollisionPoint(0, 0, 0, 100);
        r.createCollisionPoint(350, 0, 350, 100);
    }

    */

    loadLevelData(mapData);
}
loadObjects();

//Create player
function restart() {
    window.items = JSON.parse(JSON.stringify(initialItems));
    player.x = playerx;
    player.y = playery;
    r.scrollx = scrollx;
    playersizex = initialplayersizex;
    playersizey = initialplayersizey;
    loadObjects();
    //loadPlayer();
}

function loadPlayer() {
    window.player = r.createObject(playerx, playery, initialplayersizex, initialplayersizey, "#ff0000", textures.player); //todo: Combine, as in, add all these to the same createObject function
    window.jumping = 0;
    window.items = JSON.parse(JSON.stringify(initialItems));
    /*player.x = playerx;
    player.y = playery;
    player.sizex = initialplayersizex;
    player.sizey = initialplayersizey;*/
    playersizex = initialplayersizex;
    playersizey = initialplayersizey;
    //player.texture = textures.player;
}
//var initialItems = startItems;
loadPlayer();

//Define movement
var keys = new Set();
window.addEventListener("keydown", function(e){
    //console.log("keydown", e.code)
    window.keys.add(e.code)
});
window.addEventListener("keyup", function(e){
    //delete this.window.keys[e.code]
    /*let index = keys.indexOf(e.code);
    if (index > -1) {
        keys.splice(index, 1);
    }*/
    keys.delete(e.code);
});
function onKey(key, callback) {
    window.addEventListener("keyupdate", function(e) {
        //console.log(keys);
        if (Array.isArray(key) ? key.some(e=>keys.has(e)) : keys.has(key)) {
            callback(e);
        }
    });
}
function move(x, y, disablecollideCheck) {
    if (levelEditorEnabled) {
        let speed = JSON.parse(localStorage.getItem("editorcfg")).speed;
        r.scrollx += x * speed;
        r.scrolly += y * speed;
    } else {

    player.x = player.x + x;
    player.y = player.y + y;
    //rot+=x;
    _dev_iscol = iscolliding(player.x, player.y, playersizex, playersizey);
    if (iscolliding(player.x, player.y, playersizex, playersizey) && !disablecollideCheck) {
        for (let i = 0; i < Math.abs(x)*2; i++) {
            //console.log("x", i);
            player.x-=0.5*Math.sign(x);
            //player.y = player.y - y;
            if (!iscolliding(player.x, player.y, playersizex, playersizey)) break;
        }
        for (let i = 0; i < Math.abs(y)*2; i++) {
            //console.log("y", i);
            player.y-=0.5*Math.sign(y);
            //player.y = player.y - y;
            if (!iscolliding(player.x, player.y, playersizex, playersizey)) break;
        }
        //rot+=x;
    }
    if (player.x > minimumscrollx + 50 && player.x + 50 < levelend) {
        r.scrollx = player.x - 50;
    }
    if (exactscrollingmode) { //Exact Scrolling Mode (For debugging, not to be used)
        r.scrollx = player.x - 50;
        r.scrolly = player.y - 50;
    }

    }
}
function keyToMove(key, x, y) {
    onKey(key, function() {
        move(x, y);
    });
}
function jump() {
    player.y = player.y + jumpdetectoffset;
    var ic = iscolliding(player.x, player.y, playersizex, playersizey);
    player.y = player.y - jumpdetectoffset;
    if (ic) {
        jumping = Math.max(jumpspeed, jumping);
    }
}

//if (!cursormovement) {

//keyToMove("KeyW", 0, 0-movementSpeed);
keyToMove(["KeyA", "ArrowLeft"], -1, 0); //todo apply this array thing to the rest
//keyToMove(["KeyS", "ArrowDown"], 0, movementSpeed);
keyToMove(["KeyD", "ArrowRight"], 1, 0);

//keyToMove("ArrowLeft", 0-movementSpeed, 0);
//keyToMove("ArrowDown", 0, movementSpeed);
onKey(["KeyS", "ArrowDown"], function() {
    ///console.log("konnichiwa");
    /*if (levelEditorEnabled) {
        let speed = JSON.parse(localStorage.getItem("editorcfg")).speed;
        //r.scrollx += x * speed;
        r.scrolly += -1 * speed;
    }*/
    if (levelEditorEnabled) move(0, 1);
})
//keyToMove("ArrowRight", movementSpeed, 0);

onKey(["KeyW", "ArrowUp", "Space"], jump);

onKey(["KeyW", "ArrowUp"], function() {
    if (levelEditorEnabled) move(0, -1);
})

//}

//onKey("ArrowUp", jump);

//fun things to mess with
function randomizeTextures() {
    r._objects.forEach(function(e) {
        if (e==null) return;
        e.texture = Math.floor(Math.random() * Object.keys(textures).length);
    });
}
function initRandomizeTextures() {
    window.oldRes = restart;
    window.restart = function() {
        oldRes();
        randomizeTextures();
    }
    randomizeTextures();
}

function removeBorders() {
    let oldRes = restart;
    function remove() {
    r._collisionPoints.forEach(function(e, i) {
        if (e.object === undefined) {
          r._collisionPoints[i] = null;
        }
      })
    }
    restart = function() {
        oldRes();
        remove();
    }
    remove();
}

function breakGame() {
    initRandomizeTextures();
    removeBorders();

    //wrapmode = true;
    exactscrollingmode = true;
    //death = !nodeath || true;
}

function animatePlayer() {
    let a = r.createAnimation([{
        timestamp: 0,
        color: "#f00"
    }, {
        timestamp: 5,
        texture: 2,
        color: "#000" //fallback... not yet at least
    }, {
        timestamp: 7,
        texture: 4,
        color: "#000" //fallback... not yet at least
    }], 10, 2000, {
        loop: true
    });

let b = a.createInstance();

b.play();

//r.createCollisionObject(30, 25, 30, 10, "#0f0", b);

player.texture = b;

/*let old = restart;

var restart = function() {
old();
player.texture = b;
//console.log("Res")
}*/
}

function mirrorCanvasToPlayer() {
    let x = r.createMediaStreamTexture(r.node.captureStream());

    player.texture = x;
}

//cursor movement mode
/*if (cursormovement) {
    r.canvas.addEventListener("mousemove", function(e) {
        move(((r.canvas.offsetWidth / r.canvas.width) * e.offsetX) - playerx - r.scrollx, ((r.canvas.offsetHeight / r.canvas.height) * e.offsetY) - playery - r.scrolly);
    });
}*/

//recording system

//canvasrecorder below
/*
** DOCUMENTATION
** 
** Create canvas recorder: var recorder = new CanvasRecorder();
** 
** Start recording: recorder.record(document.getElementById("myCanvas"));
** 
** End recording: recorder.stop();
** 
** When you stop a recording, it returns a promise that resolves into a blob with the video.
** Once the promise is resolved, the blob can also be located at CanvasRecorder.result
*/

class CanvasRecorder {
    constructor() {
        this._mr = null; //mr = media recorder
        this._chunks = null;
        this.result = null;
        this.record = function(canvas) {
            if (canvas == undefined) throw "Expected element, got undefined";
            let t = this;
            this._chunks = [];
            this._mr = new MediaRecorder(canvas.captureStream());
            this._mr.ondataavailable = function(e) {{
                t._chunks.push(e.data);
                //console.log("data avalible!");
            }}
            this._mr.start();
        }
        this.stop = function() {
            this._mr.stop();
            let t = this;
            return new Promise(function(res) {
                t._mr.ondataavailable = function(e) {
                    t._chunks.push(e.data);
                    t.result = new Blob(t._chunks);
                    res(t.result);
                }
            });
        }
    }
}

//main code of recording
let cr = new CanvasRecorder();
let recording = false;
window.addEventListener("keydown", async function(e) {
  if (e.code == "KeyP") { //p because it's not likely to be hit by mistake
  if (recording) {
    let b = await cr.stop();
    let u = URL.createObjectURL(b);
    let a = document.createElement("a");
    a.href = u;
    a.download = "2D Game Recording";
    a.click();
    a.remove();
  } else {
    if (confirm("Start recording?")) {
        cr.record(r.canvas);
    } else return;
  }
  recording = !recording;
  }
});

//dev
let dbg = document.querySelector("#debug");
function debug(e) {
    dbg.innerHTML = e;
}
var debugModeEnabled = false;
window.addEventListener("keydown", function(e) {
    if (e.shiftKey && e.altKey && (!e.ctrlKey) && e.code == "KeyL") { //l because i couldnt think of anything better lol
        e.preventDefault();
        //alert("Dev mode triggered");
        //debugModeEnabled = true;
        debugModeEnabled = !debugModeEnabled;
        //debug("Debug mode on.");
    }
});

//object selector
class objectselectioncursor {
    constructor(r) {
        let t = this;
        r.node.addEventListener("mousemove", function(e) {
            t._currentMousePos = [e.offsetX * (r.width/r.node.clientWidth) + r.scrollx,e.offsetY * (r.height/r.node.clientHeight) + r.scrolly];
        });
        t.getHovered = function(){if(t._currentMousePos)return r.isColliding(...t._currentMousePos,1,1)}
    }
}

//level editor :)
var levelEditorEnabled = false;
var levelEditorCursor = new objectselectioncursor(r);
window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyM") { //m because i guess it works well with l and p
        e.preventDefault();
        if (levelEditorEnabled) {
            levelEditorEnabled = false;
            selectedObjects = [];
            restart();
            loadPlayer();
            //this.requestAnimationFrame(tick);
        } else {
        //alert("level editor :D");
        levelEditorEnabled = true;
        restoreSV();
        r._ctx.clearRect(0, 0, 1000, 1000);
        loadObjects();
        player.remove();
        r.updateDisplay();
        r._objects.forEach(function(e) {
            if (e && e?.texture === textures.move) {
                e.data.used = false;
            }
        });
    }
    }

    if (e.ctrlKey && (!e.altkey) && (!e.shiftKey) && e.code == "KeyA" && levelEditorEnabled) {
        selectedObjects = [];
        r._objects.forEach(function(e) {
            if (e) selectedObjects.push(e);
        });
    }

    if ((!e.ctrlKey) && (!e.altKey) && (!e.shiftKey) && e.code == "Delete" && levelEditorEnabled) {
        selectedObjects.forEach(function(f) {
            deleteObject(f);
        });
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyO") {
        e.preventDefault();
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".2gl";
        input.addEventListener("change", async function() {
            //console.log("change");
            let fr = new FileReader();
            fr.onload = function() {
                //console.log("load");
                /*let func = new Function(fr.result);
                console.log(fr.result, func);
                func();*/
                let split = fr.result.split(";");
                for (i in config_names) {
                    window[config_names[i]] = split[i];
                }
                console.log(split[split.length-1]);
                window.mapData = JSON.parse(split[split.length-1]);
            }
            fr.readAsText(input.files[0]);
            //let func = new Function();
        })
        input.click();
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "Comma" && levelEditorEnabled) {
        //console.log("eee")
        e.preventDefault();
        mapData.push([...useSnap(r.scrollx + r.width/2, r.scrolly + r.height/2), 10, 10, 0]);
        //let tempObj = r.createObject(getObjectFromLevelData(mapData[mapData.length-1]));
        updateSelectedObject([...useSnap(r.scrollx + r.width/2, r.scrolly + r.height/2), 10, 10, 0], selectedObjects.length);
        localStorage.setItem("2dgautosave", saveLevel(true));
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "Slash" && levelEditorEnabled) {
        changeEditorCfg();
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "Semicolon" && levelEditorEnabled) {
        snapMove = !snapMove;
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftkey) && e.code == "KeyS") {
        e.preventDefault();
        saveLevel();
        keys = new Set();
    }
    if ((!e.ctrlKey) && (!e.altKey) && e.shiftKey && e.code == "Semicolon") {
        e.preventDefault();
        //console.log("eee", e.cancelable);
        useSnapToOffset = !useSnapToOffset;
    }
    if ((!e.ctrlKey) && (!e.altKey) && (!e.shiftKey) && (e.code == "BracketLeft" || e.code == "BracketRight") && levelEditorEnabled) {
        //console.log("level editor bracket");
        selectedObjects.forEach(function(f, i) {
            let oldObj = mapDataFromObject(f);
            let newObj = mapDataFromObject(f);
            //console.log("newobj-blockid", newObj[newObj.length - 1]);
            newObj[newObj.length - 1] += e.code == "BracketRight" ? 1 : -1;
            newObj[newObj.length - 1] = Math.max(0,Math.min(blockMappings.length-1,newObj[newObj.length - 1]));
            //console.log("dd", defaultData[getKeyByValue(textures, newObj[newObj.length - 1])]);
            let data = defaultData[getKeyByValue(textures, newObj[newObj.length - 1])];
            //if (Object.keys(defaultData).includes(getKeyByValue(textures, blockMappings[newObj[newObj.length - 1]][0]))) newObj.splice(4, 0, defaultData[getKeyByValue(textures, blockMappings[newObj[newObj.length - 1]][0])]);
            if (data) /*console.log(data); //*/ {
                //if (newObj
                newObj.splice(4, newObj.length == 6 ? 1 : 0, data);
            } else if (newObj.length == 6) {
                newObj.splice(4, 1);
            }
            setObject(oldObj, newObj);
            updateSelectedObject(newObj, i);
        });
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyY" && levelEditorEnabled) {
        selectedObjects.forEach(function(f, i) {
            alert("Object at " + i + " (id: " + f.id + "): " + JSON.stringify(mapDataFromObject(f)));
        });
        keys = new Set();
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyU" && levelEditorEnabled) {
        e.preventDefault();
        promptData();
        keys = new Set();
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyB") {
        e.preventDefault();
        if (levelEditorEnabled) {
            promptLevelConfig();
            keys = new Set();
        }
    }
    if (e.ctrlKey && e.altKey && (!e.shiftKey) && e.code == "KeyR") {
        if (this.confirm("restore?")) {
            window.eval(this.localStorage.getItem("2dgautosave"));
            //console.log(new Functio(this.localStorage.getItem("2dgautosave")));
            if (this.confirm("restart?")) restart();
        }
    }
    //if (e.ctrl)
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyC" && levelEditorEnabled) {
        clipboard = [];
        clipboardCopyPos = [r.scrollx, r.scrolly];
        selectedObjects.forEach(function(e) {
            clipboard.push(mapDataFromObject(e));
        });
        if (clipboard.length == 0) clipboard = null;
    }
    if (e.ctrlKey && (!e.altKey) && (!e.shiftKey) && e.code == "KeyV" && levelEditorEnabled) {
        if (clipboard) clipboard.forEach(function(e) {
            let f = JSON.parse(JSON.stringify(e));
            let snapped = useSnap(f[0] + r.scrollx - clipboardCopyPos[0], f[1] + r.scrolly - clipboardCopyPos[1]);
            f[0] = snapped[0];
            f[1] = snapped[1];
            mapData.push(f);
        });
    }
});

var selectedObjects = [];
let clickStart = [0, 0];
let previousPos = [0, 0];
let editorDragging = false;
let dragStart = [0, 0];
r.canvas.addEventListener("mousedown", function(e) {
    clickStart = [e.offsetX, e.offsetY];
    dragStart = levelEditorCursor._currentMousePos;
    previousPos = useSnap(...levelEditorCursor._currentMousePos||[0,0]);
    if (levelEditorEnabled) {
        //let selected = levelEditorCursor.getHovered();
        //zif (selectedObjects.length > 0) editorDragging = true;
        editorDragging = true;
        multiSelect = true;
    }
});
r.canvas.addEventListener("mousemove", function(e) {
    if (editorDragging) {
        //editorDragging = true;
        let pos = useSnap(...levelEditorCursor._currentMousePos);
        let shift = keys.has("ShiftLeft") || keys.has("ShiftRight");
        //console.log(shift);
        selectedObjects.forEach(function(f, i) {
            let oldObj = mapDataFromObject(f);
            let newObj = mapDataFromObject(f);
            //console.log("changex");
            let changingX = newObj[shift?2:0], changingY = newObj[shift?3:1];
            //console.log(changingX, changingY);
            let changeX = pos[0] - previousPos[0], changeY = pos[1] - previousPos[1];
            if (!useSnapToOffset) changeX += changingX, changeY += changingY;
            let changePos = useSnap(changeX, changeY /* + changingX*//*,  /*+ changingY*/);
            if (useSnapToOffset) {newObj[shift?2:0] += changePos[0], newObj[shift?3:1] += changePos[1]} else {newObj[shift?2:0] = changePos[0], newObj[shift?3:1] = changePos[1]};
            if (shift) {
                newObj[2] = Math.max(newObj[2], 1);
                newObj[3] = Math.max(newObj[3], 1);
            }
            setObject(oldObj, newObj);
            let temp = r.createObject(...getObjectFromLevelData(newObj));
            temp.remove();
            selectedObjects[i] = temp;
        });
        previousPos = pos;
    }
});
/*r.canvas*/ window.addEventListener("mouseup", function(e) {
    if (levelEditorEnabled) {
        editorDragging = false;
        multiSelect = false;
    }
    let noMove = (clickStart[0] == e.offsetX && clickStart[1] == e.offsetY) || selectedObjects.length == 0;
    //console.log(noMove);
    if (levelEditorEnabled/* && noMove*/) {
        let selected = levelEditorCursor.getHovered();
        /*let sA = dragStart[0]; // s = selected
        let sB = dragStart[1];
        let sC = levelEditorCursor._currentMousePos[0] - dragStart[0];
        let sD =  levelEditorCursor._currentMousePos[1] - dragStart[1];
        let sE = Math.min(sA, sB);
        let sF = Math.max(sA, sB);
        let sG = Math.min(sC, sD);
        let sH = Math.max(sC, sD);
        let selected = r.isColliding(sE, sF, sG, sH);*/
        if (keys.has("ControlLeft") || keys.has("ControlRight")) {
            if (selected) selected.forEach(function(f) {
                //console.log(selectedObjects.includes(f));
                if (selectedObjects.includes(f)) {
                    //console.log("splicing");
                    selectedObjects.splice(selectedObjects.indexOf(f), 1);
                } else {
                    selectedObjects = selectedObjects.concat(f);
                }
            });
        } else {
            //if (/*noMove*/) {
                if (selected) {
                    selectedObjects = selected;
                } else {
                    selectedObjects = [];
                }
            //}
        }
    }
});
/*r.canvas.addEventListener("wheel", function(e) {
    if (selectedObjects && levelEditorEnabled) {
        selectedObjects.forEach(function(f) {
            console.log(Object.keys(textures).indexOf(f.texture)+Math.round(e.deltaY));
            let x = Object.keys(textures).indexOf(f.texture)+Math.round(e.deltaY/10);
            f.texture = textures[Object.keys(textures)[x>0?Object.keys(textures).length+x:x%Object.keys(textures).length]];
        });
    }
});*/
/*function findNewObject(old) {
    return r._objects[r._objects.indexOf(old)];
}*/
function setObject(old, newState) {
    //mapData[mapData.indexOf(old)] = newState;
    let md = old;//let md = mapDataFromObject(old);
    let mapDataString = [];
    mapData.forEach(function(e) {
        mapDataString.push(JSON.stringify(e));
    });
    if (mapDataString.indexOf(JSON.stringify(md)) != -1) mapData[mapDataString.indexOf(JSON.stringify(md))] = newState; //mapDataFromObject(newState);
    localStorage.setItem("2dgautosave", saveLevel(true));
}
function deleteObject(obj) {
    let md = JSON.stringify(mapDataFromObject(obj));
    let mapDataString = [];
    mapData.forEach(function(e) {
        mapDataString.push(JSON.stringify(e));
    });
    let index = mapDataString.indexOf(md);
    mapData.splice(index, 1);
    selectedObjects = [];
    localStorage.setItem("2dgautosave", saveLevel(true));
}


var config_names = [
    "movementSpeed",
    "gravity",
    "jumpspeed",
    "jumpdownspeed",
    "jumpdetectoffset",
    "playerx",
    "playery",
    "scrollx",
    "initialplayersizex",
    "initialplayersizey",
    "levelend",
    "initialItems",
    "minimumscrollx",
    "lockscrolly",
    "wrapmode",
    "exactscrollingmode",
    "falldeath",
    "death"
]

function saveLevel(noDownload) {
    let txt = "";
    config_names.forEach(function(e) {
        txt += "var " + e + "=" + JSON.stringify(window[e]) + ";";
        //txt += JSON.stringify(window[e]) + ";";
    });
    txt += "var mapData=" + JSON.stringify(mapData);
    if (noDownload) return txt;
    let a = document.createElement("a");
    let u = URL.createObjectURL(new Blob([txt]));
    a.href = u;
    a.download = "2D Game Level.2gl";
    a.click();
    URL.revokeObjectURL(u);
    a.remove();
}

let snapMove = false;
let useSnapToOffset = true;

let defaultData = {
    plateSmall: {size: 5},
    plateLarge: {size: 20},
    goal: {
        playerx: 50,
        playery: 50,
        scrollx: 0,
        initialplayersizex: 10,
        initialplayersizey: 10,
        carryItems: false,
        levelend: 200,
        initialItems: {redKey: 0, greenKey: 0},
        minimumscrollx: 0,
        lockscrolly: true
    },
    jumpPad: {
        speed: 10
    },
    move: {
        id: 0,
        x: 10,
        y: 10,
        sizex: 10,
        sizey: 10,
        time: 1000
    }
}
let dataLabels = {
    size: "Player Size",
    playerx: "Player Start X",
    playery: "Player Start Y",
    scrollx: "Scroll X",
    initialplayersizex: "Player Starting Width",
    initialplayersizey: "Player Starting Height",
    carryItems: "Carry items from previous level",
    levelend: "Farthest Right to Scroll: X",
    redKey: "Red Keys to start",
    greenKey: "Green Keys to start",
    minimumscrollx: "Farthest Left to Scroll: X",
    speed: "Jump Speed",
    lockscrolly: "Lock Scroll Y",
    id: "Target ID",
    x: "Move X",
    y: "Move Y",
    sizex: "Resize X",
    sizey: "Resize Y"
}
let dataTypes = {
    size: "n",
    playerx: "n",
    playery: "n",
    scrollx: "n",
    initialplayersizex: "n",
    initialplayersizey: "n",
    carryItems: "b",
    levelend: "n",
    redKey: "n",
    greenKey: "n",
    minimumscrollx: "n",
    speed: "n",
    lockscrolly: "b",
    id: "n",
    x: "n",
    y: "n",
    sizex: "n",
    sizey: "n"
}
function promptObject(o) {
    let out = {};
    Object.keys(o).forEach(function(e, i) {
        if (typeof o[e] == "object") {
            out[e] = promptObject(o[e]);
        } else {
            let type = dataTypes[e];
            if (type == "n") {
                let num = prompt(dataLabels[e], o[e]);
                out[e] = isNaN(num) || num == null ? o[e] : Number(num);
            } else if (type == "b") {
                out[e] = confirm(dataLabels[e] + " (previous value: " + o[e] + ")");
            }
        }
    });
    return out;
}
function promptData() {
    //let texture = getKeyByValue(textures, o.texture);
    /*if (defaultData.contains(texture)) {
        let data 
    }*/
    selectedObjects.forEach(function(e, i) { 
        if (e?.data) {
            let d = promptObject(e.data);
            //console.log(d);
            let oldObj = mapDataFromObject(e);
            let newObj = mapDataFromObject(e);
            newObj[4] = d;
            setObject(oldObj, newObj);
            updateSelectedObject(newObj, i);
        }
    });
}
function promptLevelConfig() {
    config_names.forEach(function(e) {
        let type = typeof window[e];
        if (type == "number") {
            let result = prompt(e, window[e]);
            window[e] = isNaN(result) || result == null ? window[e] : Number(result);
        } else if (type == "boolean") {
            window[e] = confirm(e + " (previous value: " + window[e] + ")");
        } else if (e == "initialItems") {
            let o = {};
            let gk = prompt("greenKey", initialItems["greenKey"]);
            let rk = prompt("redKey", initialItems["redKey"]);
            o["greenKey"] = isNaN(gk) || gk == null ? window[e]["greenKey"] : Number(gk);
            o["redKey"] = isNaN(rk) || rk == null ? window[e]["redKey"] : Number(rk);
            initialItems = o;
        }
    });
    saveSV();
    localStorage.setItem("2dgautosave", saveLevel(true));
}


saveSV();

let moves = []; //for move block animations

let clipboard = null;
let clipboardCopyPos = [0, 0];

let frame = -1;
let inputStartFrame = Infinity;
let goalFrame = -1;
let ISF_Date = Date.now();
let goalFrame_Date = Date.now();

let multiSelect = false;
//let multiSelectStart = [0, 0];