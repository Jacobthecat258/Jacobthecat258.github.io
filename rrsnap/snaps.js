var a = document.querySelector("#amount");
var w = document.querySelector("#wrapper");
var amount_s = document.querySelector("#amount_s");
var ls = localStorage.getItem("rrsnap");
if (ls == null) {
    alert("No data");
} else {
    ls = JSON.parse(ls);
    a.innerHTML = ls.length;
    if (ls.length != 1) {
        amount_s.innerHTML = "s"
    }
    for (var i = 0; i < ls.length; i++) {
        var d = document.createElement("div");
        var p = document.createElement("p");
        var c = document.createElement("canvas");
        var t = c.getContext("2d");
        var data = t.createImageData(ls[i].width, ls[i].height);
        p.innerHTML = ls[i].date;
        c.width = ls[i].width;
        c.height = ls[i].height;
        for (var pixel = 0; pixel < ls[i].data.length; pixel++) {
            data.data[pixel] = ls[i].data[pixel];
        }
        t.putImageData(data, 0, 0);
        d.append(p, c);
        w.append(d);
    }
}