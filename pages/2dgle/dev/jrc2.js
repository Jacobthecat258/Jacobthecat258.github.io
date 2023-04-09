var jrc2 = { //jrc2 = J-HTML Rendering Context 2D
    createRenderer: function() {
        function strictOr(a, b) { //The idea of a "strict or" is to return the second value only if the first value is strictly (===) undefined, not just undefined (==), so values like 0 will return.
            if (a === undefined) {
                return b;
            } else {
                return a;
            }
        }
        var renderer = {
            internal: {
                objects: []
            },
            updateDisplay: function() {
                renderer.internal.canvas.width = strictOr(renderer.resolutionx, renderer.width);
                renderer.internal.canvas.height = strictOr(renderer.resolutiony, renderer.height);
                renderer.node.style.width = (renderer.node.width) || (renderer.width + "px");
                renderer.node.style.height = (renderer.node.height) || (renderer.height + "px");
                renderer.internal.ctx.clearRect(0, 0, renderer.internal.canvas.width, renderer.internal.canvas.height);
                for (var i = 0; i < renderer.internal.objects.length; i++) {
                    let object = renderer.internal.objects[i];
                    if (object) {
                        if (object.texture !== undefined) {
                            try {
                                renderer.internal.ctx.drawImage(renderer.internal.textures.children[object.texture], object.x - renderer.scrollx, object.y - renderer.scrolly, object.sizex, object.sizey);
                            } catch(err) {
                                console.log("JRC2 could not load image. Error: " + err);
                                object.texture = undefined;
                            }
                        } else {
                            renderer.internal.ctx.fillStyle = object.color;
                            renderer.internal.ctx.fillRect(object.x - renderer.scrollx, object.y - renderer.scrolly, object.sizex, object.sizey);
                        }
                    }
                }
            },
            createObject: function(x, y, sizex, sizey, color, texture) { //todo: rotation, remove function, object id
                var o = {
                    x: strictOr(x, 0),
                    y: strictOr(y, 0),
                    color: strictOr(color, "#ff0000"),
                    sizex: strictOr(sizex, 10),
                    sizey: strictOr(sizey, 10),
                    texture: strictOr(texture, undefined),
                    //rotationx: 0,
                    //rotationY: 0,
                    renderer: renderer,
                    id: renderer.internal.objectid,
                    remove: function() {
                        renderer.internal.objects[o.id] = undefined;
                        o = undefined;
                    }
                };
                renderer.internal.objectid++;
                renderer.internal.objects.push(o);
                return o;
            },
            createTexture: function(src) {
                var i = document.createElement("img"); //i = image
                i.src = src;
                var l = renderer.internal.textures.children.length; //l = length
                renderer.internal.textures.append(i);
                return l;
            }
        };
        renderer.node = document.createElement("hrc2_renderer");
        renderer.node.style.display = "inline-block";
        renderer.internal.canvas = document.createElement("canvas");
        renderer.internal.canvas.style.width = "100%";
        renderer.internal.canvas.style.height = "100%";
        renderer.internal.canvas.style.display = "block"
        renderer.node.append(renderer.internal.canvas);
        renderer.internal.canvas.append("Sorry, your browser is not supported. Try upgrading your browser, or use another.");
        renderer.internal.ctx = renderer.internal.canvas.getContext("2d");
        renderer.width = 100;
        renderer.height = 100;
        renderer.scrollx = 0;
        renderer.scrolly = 0;
        renderer.internal.textures = document.createElement("hrc2_textures");
        renderer.internal.textures.style.display = "none";
        renderer.node.append(renderer.internal.textures);
        renderer.internal.objectid = 0;
        if (!renderer.internal.ctx) console.error("Browser does not support hrc2");
        return renderer;
    }
}


/*
 * Idea for hrc2.createRenderer.createObject();
 *
 * Creates an object (like {}, not an object to be drawn) that has these keys:
 * 
 * - color | texture: A HTML color for what color the object would be. Also might add suppoort for images to be used as textures
 * - visible: If the object is visible (rendered)
 * - position: An object marking the position of the object. Contains the following keys:
 *   + x: The X position
 *   + y: The Y position
 * - rotation: An object making the rotation of the object. Contains the following keys:
 *   + x: The X rotation
 *   + Y: The Y rotation
 * - size: An object making the size of the object. Contains the following keys:
 *   + x: The X size
 *   + Y: The Y size
 * - remove: A function for removing the object
 */