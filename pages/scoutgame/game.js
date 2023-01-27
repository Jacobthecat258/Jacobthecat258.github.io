// Init game vars
const canvas = $("#game");
const ctx = canvas.getContext("2d");
const gradCanvas = document.createElement("canvas");
const gradCanvasCtx = gradCanvas.getContext("2d");
gradCanvas.width = 1920;
gradCanvas.height = 1080;

ctx.font = "50px sans-serif";
var barGrad = ctx.createLinearGradient(0, 0, 0, 1080);
barGrad.addColorStop(0, "green");
//barGrad.addColorStop(0.5, "yellow");
//barGrad.addColorStop(1, "red");
barGrad.addColorStop(1, "yellow");
gradCanvasCtx.fillStyle = barGrad;
gradCanvasCtx.fillRect(10, 120, 1900, 1790);

//const startTime = Date.now();

var speedMultiplier = 1.03;
var score = 0;
var speed = 1.5;
var playerX = /*2*/1000;
var death = -200;
var barY = 1060;
var gameOver = false;
function init() {
    score = 0;
    speed = 1.5;
    playerX = /*2*/1000;
    death = -200;
    barY = 1060;
    gameOver = false;

    ctx.textAlign = "left";

    getDelta();
    tick();
}

if (localStorage.getItem("highscore") == null) {
    localStorage.setItem("highscore", 0);
}

//var barOffset = 0;
//var barScale = 1; //I CAN'T REMEMBER THE WORD AHHH... it was first stretch now scale... i think thats it?
                                  // Nah... ill do that later ↑
// Init functions
speedMultiplier--;
function updateScore(delta) {
    speed += speed * speedMultiplier * (delta / 1000);
}
function toScaledBar(x) {
    return x / playerX;
    //return barOffset + (x / barScale);
}

function updateBar() {
    //ctx.strokeWidth = 10000;
    ctx.fillStyle = "#f00";
    ctx.fillRect(10, 10, Math.max(0, toScaledBar(death)), 100);
    ctx.fillStyle = "#000";
    ctx.fillRect(1900, 10, 10, 100);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(10, 10, 1900, 100);
}

function updateScore() { //wait there 2 update score? ykw(youKnowWhat) im not gonna question
    ctx.fillText("Score: " + score, 100, 980);
    ctx.fillText("High: " + localStorage.getItem("highscore"), 100, 880);
}

function gameEnd() {
    gameOver = true;
    var isHighScore = false;
    if (score > localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", score);
        isHighScore = true;
    }
    updateScore();
    //alert(":D");
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.fillStyle = "#f00";
    if (isHighScore) ctx.fillText("High Score!", 100, 780);
    ctx.font = "200px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", 960, 200);
    ctx.fillStyle = "#000";
    ctx.font = "50px sans-serif";
    ctx.fillText("Press space to restart.", 960, 540);
}

//updateBar();
//updateScore();

// Init game loop
function tick() {
    //if (gameOver) return;
    let d = getDelta();



    ctx.clearRect(0, 0, 1920, 1080);
    speed += speedMultiplier * speed * (d / 1000);
    death += speed * (d * 100) * 2;
    barY -= speed * (d / 2);
    updateBar();

    //ctx.fillStyle = barGrad;
    //actx.fillRect(10, 120, 1900, 1790);
    ctx.drawImage(gradCanvas, 0, 0);
    ctx.fillStyle = "#f00";
    ctx.fillRect(10, 120, 1900, 50);
    ctx.fillStyle = "#000";
    ctx.fillRect(10, barY, 1900, 10);

    if (barY <= 170 || death / playerX >= 1900) {
        gameEnd();
        return;
    }

    updateScore();

    window.requestAnimationFrame(tick);
}

window.addEventListener("keydown", function(e) {
    if (e.code == "Space") {
        if (gameOver) {
            init();
            return;
        }
        let distanceToEnd = /*1790*/ 1000 - barY;
        playerX += (distanceToEnd * distanceToEnd * distanceToEnd) / 700000;
        score += Math.max(0, Math.ceil(distanceToEnd / 50));
        barY = 1060;
    }
});

tick();