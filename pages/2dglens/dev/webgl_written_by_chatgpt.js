class JWebGLRenderingContext {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext("webgl");
  
      this._objects = [];
      this._textures = [];
      this._collisionPoints = [];
    }
  
    updateDisplay() {
      this.canvas.width = strictOr(this.resolutionx, this.width * this.quality);
      this.canvas.height = strictOr(this.resolutiony, this.height * this.quality);
      if (this.config.updateDisplaySize) {
        this.canvas.style.width = (this.canvas.width) || (this.width + "px");
        this.canvas.style.height = (this.canvas.height) || (this.height + "px");
      }
    }
  
    clear() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
  
    drawObject(obj) {
      let program = this.createProgram(obj.vertexShader, obj.fragmentShader);
      this.gl.useProgram(program);
  
      let positionAttributeLocation = this.gl.getAttribLocation(program, "a_position");
      let positionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(obj.vertices),
        this.gl.STATIC_DRAW
      );
  
      this.gl.enableVertexAttribArray(positionAttributeLocation);
      this.gl.vertexAttribPointer(
        positionAttributeLocation,
        2, // position is a vec2
        this.gl.FLOAT,
        false,
        0,
        0
      );
  
      let resolutionUniformLocation = this.gl.getUniformLocation(
        program,
        "u_resolution"
      );
      this.gl.uniform2f(
        resolutionUniformLocation,
        this.canvas.width,
        this.canvas.height
      );
  
      let colorUniformLocation = this.gl.getUniformLocation(program, "u_color");
      this.gl.uniform4f(
        colorUniformLocation,
        obj.color[0] / 255,
        obj.color[1] / 255,
        obj.color[2] / 255,
        obj.color[3] / 255
      );
  
      this.gl.drawArrays(this.gl.TRIANGLES, 0, obj.vertices.length / 2);
    }
  
    createProgram(vertexShaderSource, fragmentShaderSource) {
      let vertexShader = this.createShader(
        this.gl.VERTEX_SHADER,
        vertexShaderSource
      );
      let fragmentShader = this.createShader(
        this.gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );
      let program = this.gl.createProgram();
      this.gl.  attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);
    
      let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
      if (success) {
        return program;
      }
    
      console.log(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
    }
    
    createShader(type, source) {
      let shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
      if (success) {
        return shader;
      }
    
      console.log(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
    }
    
    }
      