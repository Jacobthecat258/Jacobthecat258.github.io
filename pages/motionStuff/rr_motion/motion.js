class motionDetector {
    constructor(stream) {
        var video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        return {
            update: function(requiredChange) {
                var settings = stream.getTracks()[0].getSettings();
                canvas.width = settings.width;
                canvas.height = settings.height;
                ctx.drawImage(video, 0, 0);
                var arr = Array.from(ctx.getImageData(0, 0, settings.width, settings.height).data);
                var diff = [];
                if (this.prev === null) {
                    this.prev = arr;
                }
                for (var i = 0; i < arr.length; i = i + 4) {
                    var r = Math.abs(arr[i] - this.prev[i]);
                    var g = Math.abs(arr[i + 1] - this.prev[i + 1]);
                    var b = Math.abs(arr[i + 2] - this.prev[i + 2]);
                    diff.push(r + g + b);
                }
                this.prev = arr;
                var motion = 0;
                var motionPixels = [];
                for (var i = 0; i < diff.length; i++) {
                    motion += diff[i] >= requiredChange;
                    motionPixels.push(diff[i] >= requiredChange);
                }
                return {
                    change: motion,
                    details: motionPixels,
                    diff: diff,
                    original: arr
                };
            },
            canvas: canvas,
            prev: null
        }
    }
}