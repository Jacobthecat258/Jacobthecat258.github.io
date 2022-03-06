var $ = (e) => {
    return document.querySelector(e);
}
var video = $("video");
navigator.mediaDevices.getUserMedia({video: true}).then((s) => {
    video.srcObject = s;
    video.play();
});