var movementSpeed = 1;
var gravity = 2;
var jumpspeed = 7;
var jumpdownspeed = .5
var jumpdetectoffset = 2;
var playerx = 10;
var playery = 39;
var scrollx = 0;
var initialplayersizex = 10;
var initialplayersizey = 10;
var levelend = 330;
var initialItems = {greenKey: 0, redKey: 0};
var minimumscrollx = 0;
var lockscrolly = true;

var wrapmode = false;
var exactscrollingmode = false;
var falldeath = true;
var death = true;

var mapData = [

    [0, 50, 100, 10, 1],
    [0, 60, 100, 40, 0],
    [125, 40, 10, 10, 1],
    [135, 50, 15, 10, 3],
    [150, 30, 30, 10, 1],
    [170, 90, 20, 10, 1],
    [172, 88, 16, 02, {size: 4}, 7],
    [160, 65, 10, 10, 4],
    [230, 65, 10, 10, 5],
    [210, 75, 120, 10, 1],
    [210, 85, 120, 15, 0], //was this one missing?
    [210, 00, 40, 10, 1],
    [210, 10, 20, 45, 0],
    [220, 55, 10, 10, 0],
    [230, 10, 20, 35, 0],
    [240, 45, 10, 20, 0],
    [230, 55, 10, 10, 11],
    [230, 45, 10, 10, {
        playerx: 360,
        playery: 64,
        scrollx: 350,
        initialplayersizex: 10,
        initialplayersizey: 10,
        carryItems: false,
        levelend: 500,
        initialItems: {greenKey: 0, redKey: 0},
        minimumscrollx: 350
    }, 9],
    [262, 73, 06, 02, {size: 40}, 8],
    [252, 20, 10, 10, 10],
    [320, 0, 10, 75, {
        playerx: 10,
        playery: 39,
        scrollx: 0,
        initialplayersizex: 25,
        initialplayersizey: 10,
        carryItems: true,
        levelend: 330,
        initialItems: window.items,
        minimumscrollx: 0
    }, 9],
    [350, 75, 200, 10, 1],
    [350, 85, 200, 35, 0],

    [0, 0, 0, 100, 13],
    [350, 0, 0, 100, 13]
]