(async function(){
    var rickroll = document.querySelector("video");
    var v = await navigator.mediaDevices.getUserMedia({video: true});
    var motion = new motionDetector(v);
    //var s = v.getTracks()[0].getSettings();
    var playing = false;

    setInterval(function() {
        var data = motion.update(100);
        if (data.change > 100) {
            rickroll.play();
            rickroll.style.display = "block";
        } else {
            rickroll.pause();
            rickroll.style.display = "none";
        }
    }, 100);
})();