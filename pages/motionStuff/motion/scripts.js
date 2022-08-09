//ls
var ls = JSON.parse(localStorage.getItem("motionsettings"));
//main
onclick=(async function(){
    if (!localStorage.getItem("lastAlert")) localStorage.setItem("lastAlert", 1);
    Notification.requestPermission();
    document.querySelector("h1").style.display = "none";
    var s = await navigator.mediaDevices.getUserMedia({video: true});
    //var s = await navigator.mediaDevices.getDisplayMedia();
    var settings = s.getTracks()[0].getSettings();
    var motion = new motionDetector(s);
    var e = document.querySelector("#hello");
    var c = document.querySelector("#motion");
    var ctx = c.getContext("2d");
    e.addEventListener("ended", function() {
        e.style.display = "none";
    });
    //document.body.append(motion.canvas);
    setInterval(function() {
        var data = motion.update(100);
        if (ls.one) { //true = hello there, false = video thing

        if (data.change > 100) {
            e.style.display = "block";
            e.play();
            if (ls.two) { //notification
                if (new Date().getTime() - localStorage.getItem("lastAlert") > 10000) {
                    new Notification("MOTION");
                    localStorage.setItem("lastAlert", new Date().getTime());
                }
            }
        }

        } else {

        c.style.display = "block";
        c.width = settings.width;
        c.height = settings.height;
        var newData = ctx.createImageData(settings.width, settings.height);
        for (var i = 0; i < data.diff.length; i++) {

            if (ls.two) { //color mode
                newData.data[i*4+0] = null;
                newData.data[i*4+1] = data.diff[i] / 3;
                newData.data[i*4+2] = 0;
                newData.data[i*4+3] = 255;
            } else {

            newData.data[i*4+0] = data.original[i*4+0];
            newData.data[i*4+1] = data.original[i*4+1];
            newData.data[i*4+2] = data.original[i*4+2];
            newData.data[i*4+3] = data.diff[i];

            }
        }
        ctx.putImageData(newData, 0, 0);

        }
    }, 100);
});