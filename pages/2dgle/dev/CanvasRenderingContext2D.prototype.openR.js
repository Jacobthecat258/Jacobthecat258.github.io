CanvasRenderingContext2D.prototype.openRotation = function(rotation) {
    let t = this;
    t.openRotation._currentRotation = rotation;
    t.rotate(rotation);
    return {
        close: function() {
            t.rotate(0 - t._currentRotation);
        }
    }
}
CanvasRenderingContext2D.prototype.openRotation._currentRotation = 0;