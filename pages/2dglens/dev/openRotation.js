/*

============
== Always ==
============

CanvasRenderingContext2D.prototype.openRotation = function(rotation) {
    let t = this;
    t.openRotation._currentRotation = rotation;
    t.rotate(rotation);
    return {
        close: function() {
            t.rotate(0 - t.openRotation._currentRotation);
        }
    }
}
CanvasRenderingContext2D.prototype.openRotation._currentRotation = 0;

*/

function applyOpenRotation(ctx) {
    ctx.openRotation = function(rotation) {
        ctx.openRotation._currentRotation = rotation;
        ctx.rotate(rotation);
        return {
            close: function() {
                ctx.rotate(0 - ctx.openRotation._currentRotation);
            }
        }
    }
    ctx.openRotation._currentRotation = 0;
}