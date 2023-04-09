class jrc2 { //jrc2 = J-HTML Rendering Context 2D
    constructor(canvas) {
        function applyOpenRotation(ctx) { //todo add rotation origin params on object, maybe by default null and that way it will default to the center of the object
            ctx.openRotation = function(rotation, originx, originy) {
                ctx.openRotation._currentRotation = rotation;
                let ox = originx - (renderer.scrollx * renderer.quality), oy = originy - (renderer.scrolly * renderer.quality); //ox = origin x, oy = origin y
                ctx.translate(ox, oy);
                ctx.rotate(rotation);
                ctx.translate(0 - ox, 0 - oy);
                return {
                    close: function() {
                        ctx.translate(ox, oy);
                        ctx.rotate(0 - ctx.openRotation._currentRotation);
                        ctx.translate(0 - ox, 0 - oy);
                    }
                }
            }
            ctx.openRotation._currentRotation = 0;
        }
        function strictOr(a, b) { //The idea of a "strict or" is to return the second value only if the first value is strictly (===) undefined, not just undefined (==), so values like 0 will return.
            /*if (a === undefined) {
                return b;
            } else {
                return a;
            }*/
            return a === undefined ? b : a;
        }
        function arrayAll(array, fn) { //this could be "Array.prototype.all = function all(fn) {" but it would affect arrays outside of jrc2.
            let output = [];           //fn is function
            array.forEach(function(item, index) { //example: console.log(arrayAll([12, 30, -5], (e,i)=>e-i)); // [12, 29, -7]]
                output.push(fn(item, index, array));
            });
            return output;
        }
        let renderer = {
            reuseDeletedObjectSlots: false,
            zoom: {
                x: 0,
                y: 0,
                zoom: 2,
                enabled: false
            },
            _objects: [],
            _textures: [],
            _collisionPoints: [],
            updateDisplay: function() {
                renderer.canvas.width = strictOr(renderer.resolutionx, renderer.width * renderer.quality);
                renderer.canvas.height = strictOr(renderer.resolutiony, renderer.height * renderer.quality);
                if (this.config.updateDisplaySize) {
                    renderer.canvas.style.width = (renderer.canvas.width) || (renderer.width + "px");
                    renderer.canvas.style.height = (renderer.canvas.height) || (renderer.height + "px");
                }
                renderer._ctx.clearRect(0, 0, renderer.canvas.width * renderer.quality, renderer.canvas.height * renderer.quality);
                if (renderer.zoom.enabled) {
                    renderer._ctx.translate(0-renderer.quality*(renderer.zoom.x), 0-renderer.quality*(renderer.zoom.y));
                    renderer._ctx.scale(renderer.zoom.zoom, renderer.zoom.zoom);
                }
                renderer._objects.forEach(function(e) {
                    try {

                    if (e) {

                        let rotation = renderer._ctx.openRotation(e.rotation, (e.rotationOrigin.x!==null?e.rotationOrigin.x:(e.x + (e.sizex / 2))) * renderer.quality, (e.rotationOrigin.y!==null?e.rotationOrigin.y:(e.y + (e.sizey / 2))) * renderer.quality);

                        if (e.texture?.IS_ANIMATION) {

                            let frame = e.texture.getCurrentFrame();
                            if (frame.texture !== undefined) {
                                try {
                                    renderer._ctx.drawImage(renderer._textures.children[frame.texture], (e.x - renderer.scrollx) * renderer.quality, (e.y - renderer.scrolly) * renderer.quality, e.sizex * renderer.quality, e.sizey * renderer.quality);
                                } catch(err) {
                                    console.warn("JRC2 could not load image. Error: " + err);
                                }
                            } else {
                                renderer._ctx.fillStyle = frame.color;
                                renderer._ctx.fillRect((e.x - renderer.scrollx) * renderer.quality, (e.y - renderer.scrolly) * renderer.quality, e.sizex * renderer.quality, e.sizey * renderer.quality);
                            }
                            
                        } else if (e.texture?.IS_MEDIA_STREAM_TEXTURE) {

                            try {

                                if (!e.texture._video.srcObject) console.warn("The MediaStream texture used for object " + e.id + " doesn't appear to be applied.");

                                renderer._ctx.drawImage(e.texture._video, (e.x - renderer.scrollx) * renderer.quality, (e.y - renderer.scrolly) * renderer.quality, e.sizex * renderer.quality, e.sizey * renderer.quality);
                            } catch(err) {
                                console.warn("JRC2 couldn't display a MediaStream as a texture. Error: " + err);
                            }

                        } else {

                        if (e.texture !== undefined) {
                            try {/*`      `*/
                                renderer._ctx.drawImage(renderer._textures.children[e.texture], (e.x - renderer.scrollx) * renderer.quality, (e.y - renderer.scrolly) * renderer.quality, e.sizex * renderer.quality, e.sizey * renderer.quality);
                            } catch(err) {
                                console.warn("JRC2 could not load image. Error: " + err);
                                e.texture = undefined;
                            }
                        } else {
                            renderer._ctx.fillStyle = e.color;
                            renderer._ctx.fillRect((e.x - renderer.scrollx) * renderer.quality, (e.y - renderer.scrolly) * renderer.quality, e.sizex * renderer.quality, e.sizey * renderer.quality);
                        }

                        }

                        rotation.close(); //todo test this
                    }

                    } catch(err) {
                        console.warn("Failed to render object with ID " + e?.id + ". Error: " + err);
                    }
                });
                if (renderer.zoom.enabled) {
                    r._ctx.scale(1/renderer.zoom.zoom,1/renderer.zoom.zoom);
                    r._ctx.translate(renderer.quality*(renderer.zoom.x),renderer.quality*(renderer.zoom.y));
                }
            },
            createObject: function(x, y, sizex, sizey, color, texture, data, rotationOrigin) { //todo: rotation, remove function (done), object id
                let params = {};
                params.x = x;
                params.y = y;
                params.sizex = sizex;
                params.sizey = sizey;
                params.color = color;
                params.texture = texture;
                params.data = data;
                params.rotationOrigin = rotationOrigin;
                //console.log("pre", params);
                if (typeof x == "object") {
                    //console.log("is object");
                    params.y = x.y;
                    params.sizex = x.sizex;
                    params.sizey = x.sizey;
                    params.color = x.color;
                    params.texture = x.texture;
                    params.data = x.data;
                    params.rotationOrigin = x.rotationOrigin;
                    params.x = x.x;
                }
                //console.log("post", params)
                let reusedObjectID = false;
                let o = {
                    x: strictOr(params.x, 0),
                    y: strictOr(params.y, 0),
                    color: strictOr(params.color, "#ff0000"),
                    sizex: strictOr(params.sizex, 10),
                    sizey: strictOr(params.sizey, 10),
                    texture: strictOr(params.texture, undefined),
                    /*//*/rotation: 0, //in radians
                    ///*//*/rotationY: 0,
                    renderer: renderer,
                    id: /*renderer._objectid*/ (function() {
                        if (renderer.reuseDeletedObjectSlots) {
                            let index = renderer._objects.indexOf(null);
                            if (index>-1) {
                                reusedObjectID = true;
                                return index;
                            } else {
                                return renderer._objectid;
                            }
                        } else {
                            return renderer._objectid
                        }
                    })(),
                    remove: function() {
                        //console.log(renderer);
                        renderer._objects[o.id] = null;
                        o = undefined;
                    },
                    isColliding: function(object) {
                        return renderer.isColliding(o.x, o.y, o.sizex, o.sizey, object);
                    },
                    move: function(x, y, collisionCheck) {
                        o.x += x;
                        o.y += y;
                        if (collisionCheck && o.isColliding()) {
                            o.x -= x;
                            o.y -= y;
                        }
                    },
                    data: params.data,
                    rotationOrigin: params.rotationOrigin || {
                        x: null,
                        y: null
                    }
                };
                if (!reusedObjectID) renderer._objectid++;
                renderer._objects[o.id] = o;//renderer._objects.push(o);
                return o;
            },
            createTexture: function(src) {
                let i = document.createElement("img"); //i = image
                i.src = src;
                let l = renderer._textures.children.length; //l = length
                renderer._textures.append(i);
                return l;
            },
            createAnimation: function(frames, size, duration, config) {
                /*syntax:

                let animation = renderer.createAnimation([{
                    timestamp: 0,
                    color: "#f00"
                }, {
                    timestamp: 5,
                    texture: renderer.createTexture("texture.png"),
                    color: "#000" //fallback... not yet at least
                }], 10, 10000, {
                    loop: true
                });

                Creates a looping, 10x10, 10,000 milisecond animation with 10 frames.
                On frame 0, the color is "#f00".
                On frame 5, the texture is texture.png. If it can't load, it becomes black instead. ...when I add the fallback.
                */
                return {
                    frames: frames,
                    size: size,
                    duration: duration,
                    config: config,
                    createInstance: function() {
                        //let t = this;
                        return {
                            PAUSED: 0,
                            PLAYING: 1,
                            IS_ANIMATION: true,
                            frames: this.frames,
                            size: this.size,
                            duration: this.duration,
                            config: this.config,
                            requestFrameByPosition: function(pos) {
                                try {

                                let playedFrames = this.frames.filter(function(e) {
                                    return e.timestamp <= pos;
                                });
                                //console.log(JSON.stringify(playedFrames));
                                //let frame = Math.max(...playedFrames);
                                let f = playedFrames.sort((a, b) => a.timestamp - b.timestamp);
                                let frame = f[f.length - 1];
                                return {
                                    texture: frame.texture,
                                    color: frame.color
                                }

                                } catch(err) {
                                    console.warn("Error requesting frame. Error: " + err);
                                }
                            },
                            requestFrame: function(timestamp) {
                                return this.requestFrameByPosition(Math.floor(timestamp / (this.duration / this.size)));
                            },
                            _time: 0,
                            _starttime: null,
                            _pausetime: null,
                            state: 0,
                            play: function() {
                                this._starttime = Date.now();
                                this.state = 1;
                                this._pausetime = null;
                                return this;
                            },
                            pause: function() {
                                this._pausetime = Date.now();
                                this.state = 0;
                                if (this.config?.loop) {
                                    this._time = (this._time + (this._pausetime - this._starttime)) % this.duration;
                                } else {
                                    this._time += Math.min(this._pausetime - this._starttime, this.duration);
                                }
                                //if (this._time > this.duration) this._time = 0;
                                return this;
                            },
                            getTime: function() {
                                if (this.config?.loop) {
                                    return this.state == 0 ? this._time : (this._time + (Date.now() - this._starttime)) % this.duration;
                                } else {
                                    return this.state == 0 ? this._time : Math.min(this._time + (Date.now() - this._starttime), this.duration);
                                }
                            },
                            getCurrentFrame: function() {
                                return this.requestFrame(this.getTime()); //todo test this
                            }
                        }
                    }
                }
            },
            createMediaStreamTexture: function(stream) {
                let video = document.createElement("video");
                video.srcObject = stream;
                video.muted = true;
                video.play();
                //let t = this;
                return {
                    IS_MEDIA_STREAM_TEXTURE: true,
                    stream: stream,
                    _video: video
                }
            },
            createCollisionPoint: function(xfrom, yfrom, xto, yto, object, data) {
                renderer._collisionPoints.push({
                    xf: xfrom,
                    xt: xto,
                    yf: yfrom,
                    yt: yto,
                    object: object,
                    data: data
                });
            },
            createCollisionObject: function(x, y, sizex, sizey, color, texture, data) { //note: for now, collision won't be affected by rotation
                let length = renderer._collisionPoints.length;
                let o = renderer.createObject(x, y, sizex, sizey, color, texture, data);
                let oldRemove = o.remove;
                o.remove = function() {
                    oldRemove();
                    renderer._collisionPoints[length] = null;
                }
                o.collisionID = renderer._collisionPoints.length;
                renderer.createCollisionPoint(o.x, o.y, o.x + o.sizex, o.y + o.sizey, /*o.*/o, o.data);
                return o;
            },
            isColliding: function(x, y, sizex, sizey, object) {
                //let output = false; //todo: send all objects to array, then return. so if colliding with multiple objects, return all of them.
                let objects = [];
                (object ? /*arrayAll([objects])*/ strictOr([renderer._collisionPoints[object.collisionID]] || []) : renderer._collisionPoints).forEach(function(e) {
                    //console.log(e);
                    //let p1 = e;
                    if (/*p1*/e) {
                        //let o = p1.object; //This removes the object to prevent cyclic object error
                        //p1.object = null;
                        //let p = JSON.parse(JSON.stringify(p1)); //p = points, the parse and stringify are for making a clone of the object.
                        //p1.object = o;
                        //console.log(p);
                        let /*p.*/xf = e.xf - sizex;
                        let /*p.*/yf = e.yf - sizey;
                        if (xf <= x && e.xt >= x && yf <= y && e.yt >= y) {
                            objects.push(e.object || true); //output = e.object || true; //oops i changed to foreach instead of for... i tried to return and it kept saying false but i soon
                        }                  // (soon being the next day) figured out that the return statement returned the function in the
                    }                      // forEach, not the isColliding function.
                });
                return objects.length>0?objects:false //output;
            }
        };
        //console.log(renderer.createCollisionObject);
        //renderer.node = document.createElement("jrc2_renderer");
        //renderer.node.style.display = "inline-block";
        renderer.canvas = canvas || document.createElement("canvas");
        //renderer.canvas.style.width = "100%";
        //renderer.canvas.style.height = "100%";
        renderer.canvas.style.display = "block"
        //renderer.node.append(renderer.canvas);
        renderer.node = renderer.canvas; //legacy
        renderer.canvas.append("Sorry, your browser is not supported. Try upgrading your browser, or use another.");
        renderer._ctx = renderer.canvas.getContext("2d");
        applyOpenRotation(renderer._ctx) //rotation code
        renderer.width = 100;
        renderer.height = 100;
        renderer.scrollx = 0;
        renderer.scrolly = 0;
        renderer._textures = document.createElement("jrc2_textures");
        renderer._textures.style.display = "none";
        renderer._collisionPoints = [];
        renderer.canvas.append(renderer._textures);
        renderer._objectid = 0;
        renderer.quality = 1;
        renderer.config = {
            updateDisplaySize: true
        }
        if (!renderer._ctx) console.error("Browser does not support jrc2");
        return renderer;
    }
}


/*
 * Idea for jrc2.createRenderer.createObject();
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