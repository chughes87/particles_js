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
    copy: function (p){
      var vel = p.getVelocity();
      var pos = p.getPosition();
      x = pos.x;
      y = pos.y;
      vx = vel.x;
      vy = vel.y;
    },
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
      var dist = this.distanceFrom(x2,y2);
      var forceX = 0;
      var forceY = 0;
      var sign;
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
    gravity: function(){
      vy += 0.5;
    },
    calcAttraction: function(){
      var force;
      for(var j = 0; j < new_world.length; j++){
        if(new_world[j] !== this && vx+vy < 10){
          force = old_world[j].calcGrav(x,y);
          if(vx + force.x*10 < 5)
            vx += force.x*10;
          if(vy + force.y*10 < 5)
            vy += force.y*10;
        }
      }
    },
    display: function(){
      circle(x,y,10);
    },
    detectCollision: function (p)
    {
      var vel = p.getVelocity();
      var pos = p.getPosition();
      if(this.distanceFrom(pos.x,pos.y).total <= 20)
        return 1;
      else
        return 0;
    },
    detectCollisions: function (){
      for(var j = 0; j < old_world.length; j++){
        if(new_world[j] !== this){
          if(this.detectCollision(old_world[j]) === 1){
            vx = old_world[j].getVelocity().x;
            vy = old_world[j].getVelocity().y;
          }
        }
      }
    },
    iterate: function(){
      line(x,y,x+vx,y+vy,'#ff0000');
      y += vy;
      x += vx;
    },
    checkBorders: function(){
      if (x + vx + 10 > WIDTH || x + vx < 0)
        vx = -vx;
      if (y + vy + 10 > HEIGHT || y + vy < 0)
        vy = -vy;
    }
  };
});

function addParticle(x,y,dx,dy)
{
  new_world.push(particle(x,y,dx,dy));
  old_world.push(particle(x,y,dx,dy));
}


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
  ctx.font = "12px Arial";
  return setInterval(draw, 10);
}

function draw() {
  clear();
  for(var i = 0; i < new_world.length; i++){
    old_world[i].copy(new_world[i]);
  }
  for(i = 0; i < new_world.length; i++){
    new_world[i].calcAttraction();
    new_world[i].detectCollisions();
    new_world[i].checkBorders();
    new_world[i].iterate();
    new_world[i].display();
  }
}

init();
