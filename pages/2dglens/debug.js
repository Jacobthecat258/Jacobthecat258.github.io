class jrc2debugobjectselectioncursor {
    constructor(r) {
      let t = this;
      //t._currentMousePos = [];
      r.node.addEventListener("mousemove", function(e) {
        t._currentMousePos = [e.offsetX * (r.width/r.node.clientWidth) + r.scrollx,e.offsetY * (r.height/r.node.clientHeight) + r.scrolly];
      });
      t.getHovered = function(){if(t._currentMousePos)return r.isColliding(...t._currentMousePos,1,1)}
      r.node.addEventListener("click", function(e) {
        console.log("Copied from jrc2 cursor", [t], ":", t.getHovered());
      });
    }
  }
/*  
  
  
  var x = new jrc2debugobjectselectioncursor(r);
  //onmousemove = function(){console.log(x.getHovered())}*/