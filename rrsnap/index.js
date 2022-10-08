//snap
(async function() {
    var c = document.createElement("canvas");
    var v = document.createElement("video");
    var m = await navigator.mediaDevices.getUserMedia({video:true});
    var t = c.getContext("2d");
    var s = m.getTracks()[0].getSettings();
    v.srcObject = m;
    v.play();
    v.onplaying = function() {
        c.width = s.width;
        c.height = s.height;
        t.drawImage(v, 0, 0);
        var dat = Array.from(t.getImageData(0, 0, s.width, s.height).data);
        var ls = localStorage.getItem("rrsnap");
        if (ls == null) {
            ls = [];
        } else {
            ls = JSON.parse(ls);
        }
        ls.push({
            date: new Date().toString(),
            data: dat,
            width: s.width,
            height: s.height
        });
        localStorage.setItem("rrsnap", JSON.stringify(ls));
        location.href = "rr.html";
    }
})();