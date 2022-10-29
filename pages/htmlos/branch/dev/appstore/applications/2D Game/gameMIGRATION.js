//Init functions
function strictOr(a, b) {
    if (a === undefined) {
        return b;
    } else {
        return a;
    }
}

//Init JRC2
var r = new jrc2();
r.width = 100;
r.height = 100;
r.scrollx = scrollx;
/*r.resolutionx = "100";
r.resolutiony = "100";*/
r.node.style.display = "block";
document.body.append(r.node);
setInterval(function(){
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
    /*if (isColiding(player.x, player.y, playersizex, playersizey)) {
        move(1, -1, true);
    }*/
}, 10);

//Init textures
var textures = {
    block: r.createTexture("textures/block.svg"),
    blockTop: r.createTexture("textures/block-top.svg"),
    player: r.createTexture("textures/player.svg"),
    death: r.createTexture("textures/death.svg"),
    greenKey: r.createTexture("textures/green-key.svg"),
    greenKeyBlock: r.createTexture("textures/green-key-block.svg"),
    blockTR: r.createTexture("textures/block-tr.svg"), //tr = top-right
    plateSmall: r.createTexture("textures/plate-small.svg"),
    plateLarge: r.createTexture("textures/plate-large.svg"),
    goal: r.createTexture("textures/goal.svg"),
    redKey: r.createTexture("textures/red-key.svg"),
    redKeyBlock: r.createTexture("textures/red-key-block.svg")
}


//Create map

function isColiding(x, y, sizex, sizey) {
    for (i = 0; i < r.internal.collisionPoints.length; i++) {
        var p1 = r.internal.collisionPoints[i];
        if (p1) {
            var o = p1.object; //This removes the object to prevent cyclic object error.
            p1.object = null;
            var p = JSON.parse(JSON.stringify(r.internal.collisionPoints[i])); //p = points, the parse and stringify are for making a clone of the object.
            p1.object = o;
            p.xf = p.xf - sizex;
            p.yf = p.yf - sizey;

            if (p.xf <= x && p.xt >= x && p.yf <= y && p.yt >= y) {
                //Data
                p.death = p1?.object?.texture === textures.death;
                p.isGreenKey = p1?.object?.texture === textures.greenKey;
                p.isGreenKeyBlock = p1?.object?.texture === textures.greenKeyBlock;
                p.isPlateSmall = p1?.object?.texture === textures.plateSmall;
                p.isPlateLarge = p1?.object?.texture === textures.plateLarge;
                p.isGoal = p1?.object?.texture === textures.goal;
                p.isRedKey = p1?.object?.texture === textures.redKey;
                p.isRedKeyBlock = p1?.object?.texture === textures.redKeyBlock;

                document.querySelector("#debug").innerHTML = JSON.stringify(p);

                if (p.death && death) {
                    restart();
                } else if (p.isGreenKey) {
                    p1.object.remove();
                    items.greenKey++;
                } else if (p.isGreenKeyBlock & items.greenKey > 0) {
                    items.greenKey--;
                    p1.object.remove();
                } else if (p.isPlateSmall || p.isPlateLarge) {
                    playersizex = strictOr(p.data.sizex, p.data.size);
                    playersizey = strictOr(p.data.sizey, p.data.size);
                    player.y = p1.object.y - playersizey;
                } else if (p.isGoal) {               //I was trying to fix this because it ran the code for the main goal instead of the one I was coming in contact with.
                    window.playerx = p.data.playerx; //Turns out both goals fired instead of just the one.
                    window.playery = p.data.playery; //I was staring at it for hours, turns ou tthe issue was the spawn location for the goal I touched was the same as the main goal.
                    window.scrollx = p.data.scrollx; //That means it instantly runs the code for the main goal on collision, so it ran the code for the main goal.
                    window.initialplayersizex = p.data.initialplayersizex;
                    window.initialplayersizey = p.data.initialplayersizey;
                    window.levelend = p.data.levelend;
                    window.minimumscrollx = strictOr(p.data.minimumscrollx || window.minimumscrollx);
                    var carryItems = items;
                    for (i = 0; i < r.internal.objects.length; i++) {
                        if (r.internal.objects[i] === player) {
                            r.internal.objects[i].remove();
                        }
                    }
                    restart();
                    window.initialItems = strictOr(p.data.initialItems, initialItems);
                    loadPlayer();
                    if (p.data.carryItems) window.items = carryItems;
                    r.scrollx = scrollx;
                } else if (p.isRedKey) {
                    p1.object.remove();
                    items.redKey++;
                } else if (p.isRedKeyBlock & items.redKey > 0) {
                    items.redKey--;
                    p1.object.remove();
                }
                return true
            }
        }
    }
    return false;
}

function loadObjects() {
    for (i = 0; i < r.internal.objects.length; i++) {
        if (r.internal.objects[i] !== player) {
            r.internal.objects[i] = null;
        }
    }
    //r.internal.objects = [];

    //Level 1
    r.internal.collisionPoints = [];

    r.createCollisionObject(0, 50, 100, 10, "#994400", textures.blockTop);
    r.createCollisionObject(0, 60, 100, 40, "#994400", textures.block);

    r.createCollisionObject(125, 40, 10, 10, "#994400", textures.blockTop);
    r.createCollisionObject(135, 50, 15, 10, "#ff0000", textures.death);
    r.createCollisionObject(150, 30, 30, 10, "#994400", textures.blockTop);
    r.createCollisionObject(170, 90, 20, 10, "#994400", textures.blockTop);
    r.createCollisionObject(172, 88, 16, 02, "#22dd22", textures.plateSmall, {size: 4});

    //Add green key and green key blocks
    //Behavior idea: The green key on contact will delete itself (through new proprity of the colisionObject, I'm not sure what it will be called. but it will point to the object. When there is no object (such as the left wall), it will be undefined or null) and run "items.greenKey++".
    //The green key block on contact will run some kind of code like this: "if (items.greenKey) {items.greenKey--; thisColisionPoint.theCollisionObjectItIsUsedFor.remove()}", where it removed a key and removes the object, but only if the player has a key. Otherwise, it could just be collided with, however, the collision is already programmed in the isColiding. Also, the if loop will be placed in the isColiding.
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
        initialItems: startitems,
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
var initialItems = startitems;
loadPlayer();

//Define movement
var keys = {};
window.addEventListener("keydown", function(e){window.keys[e.code] = true});
window.addEventListener("keyup", function(e){window.keys[e.code] = false});
function onKey(key, callback) {
    window.addEventListener("keyupdate", function(e) {
        if (keys[key]) {
            callback(e);
        }
    });
}
function move(x, y, disableColideCheck) {
    player.x = player.x + x;
    player.y = player.y + y;
    if (isColiding(player.x, player.y, playersizex, playersizey) && !disableColideCheck) {
        player.x = player.x - x;
        player.y = player.y - y;
    }
    if (player.x > minimumscrollx + 50 && player.x + 50 < levelend) {
        r.scrollx = player.x - 50;
    }
    if (exactscrollingmode) { //Exact Scrolling Mode (For debugging, not to be used)
        r.scrollx = player.x - 50;
        r.scrolly = player.y - 50;
    }
}
function keyToMove(key, x, y) {
    onKey(key, function() {
        move(x, y);
    });
}
function jump() {
    player.y = player.y + jumpdetectoffset;
    var ic = isColiding(player.x, player.y, playersizex, playersizey);
    player.y = player.y - jumpdetectoffset;
    if (ic) {
        jumping = jumpspeed;
    }
}

//keyToMove("KeyW", 0, 0-movementSpeed);
keyToMove("KeyA", 0-movementSpeed, 0);
keyToMove("KeyS", 0, movementSpeed);
keyToMove("KeyD", movementSpeed, 0);

onKey("KeyW", jump);