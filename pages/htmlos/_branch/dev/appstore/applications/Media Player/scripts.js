var $ = (e)=>document.querySelector(e);
var e = (e)=>document.createElement(e);
var i = e("input");
i.type = "file";
var v = $("#player");
var r = new FileReader;
r.onload = function() {
    v.src = r.result;
    v.setAttribute("controls", "");
}
i.onchange = function() {
    console.log("change");
    r.readAsDataURL(i.files[0])
}
i.setAttribute("accept", "video/mp4, audio/mp4, audio/mp3, audio/ogg, video/ogg, audio/wav, video/webm, .mp4, .mp3, .ogg, .ogv, .oga, .wav, .webm, .m4a");

function loadVideo() {
    i.click();
}