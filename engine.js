var ctx;
var WIDTH;
var HEIGHT;
var canvasMinX;
var canvasMaxX;
var canvasMinY;
var canvasMaxY;
var downx;
var downy;
var upx;
var upy;
var old_world = [];
var new_world = [];

var particle = (function (x, y, vx, vy) {
  return {
    getPosition: function (){
      return {x: x, y: y};
    },
    getVelocity: function (){
      return {x: vx, y: vy};
    },
    distanceFrom: function (xc, yc){
      var dx = x - xc;
      var dy = y - yc;
      var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
      var xComp = dist*dist/dx;
      var yComp = dist*dist/dy;
      return {total: dist, x: xComp, y: yComp};
    },
    calcGrav: function (x2, y2)
    {
      dist = this.distanceFrom(x2,y2);
      var forceX = 0;
      var forceY = 0;
      if(dist.x != 0){
        sign = dist.x/Math.abs(dist.x);
        forceX += sign/Math.pow(dist.x,2);
      }
      if(dist.y != 0){
        sign = dist.y/Math.abs(dist.y);
        forceY += sign/Math.pow(dist.y,2);
      }
      return {x: forceX, y: forceY};
    },
    detectCollision: function (p)
    {
      vel = p.getVelocity();
      pos = p.getPosition();
      if(this.distanceFrom(pos.x,pos.y).total <= 20)
        return 1;
      else
        return 0;
    },
    iterate: function (){
      var force;
      var dist;
      var sign = 0;

      circle(x, y, 10);

      for(var j = 0; j < old_world.length; j++){
        if(old_world[j] !== this){
          force = old_world[j].calcGrav(x,y);
          vx += force.x*1000;
          vy += force.y*1000;
          if(this.detectCollision(old_world[j])){
            document.getElementById('debug1').innerHTML = "COLLISION!";
            vx = old_world[j].getVelocity.x;
            vy = old_world[j].getVelocity.y;
            // vx += -force.x*1000;
            // vy += -force.y*1000;
          }
        }
      }


      if (x + vx > WIDTH || x + vx < 0)
        vx = -vx;
      if (y + vy > HEIGHT || y + vy < 0)
        vy = -vy;

      line(x,y,x+vx,y+vy,'#ff0000');
      y += vy;
      x += vx;
      // document.getElementById('debug1').innerHTML = "forceX: "+force.x;
      // document.getElementById('debug2').innerHTML = "forceY:"+force.y;
      // document.getElementById('debug3').innerHTML = "vx: "+vx;
      // document.getElementById('debug4').innerHTML = "vy: "+vy;
    }
  };
});

function addParticle(x,y,dx,dy)
{
  old_world.push(particle(x,y,dx,dy));//{'x':x,'y':y,'dx':dx,'dy':dy});
}

// function init_mouse() {
//   canvasMinX = document.getElementById('canvas').offset().left;
//   canvasMaxX = canvasMinX + WIDTH;
//   canvasMinY = document.getElementById('canvas').offset().top;
//   canvasMaxY = canvasMinY + HEIGHT;
// }


function onMouseClick(evt)
{
  addParticle(evt.pageX,evt.pageY,(downx-upx)/10,(downy-upy)/10);
}

function onMouseDown(evt)
{
  downx = evt.pageX;
  downy = evt.pageY;
}

function onMouseUp(evt)
{
  upx = evt.pageX;
  upy = evt.pageY;
}

function onKeyPress(evt)
{
  draw();
}

document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;
document.onclick = onMouseClick;
document.onkeypress = onKeyPress;

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function line(x1,y1,x2,y2,color){
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.strokeStyle = '#000000';
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
  var cnvs = document.getElementById('canvas');
  ctx = cnvs.getContext('2d');
  WIDTH = cnvs.width;
  HEIGHT = cnvs.height;
  ctx.font="12px Arial";
  // return setInterval(draw, 100);
}

function draw() {
  clear();
  new_world = old_world;
  for(var i = 0; i < old_world.length; i++)
  {
    new_world[i].iterate();
  }
}

init();
// init_mouse();