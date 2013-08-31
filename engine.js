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
const positron = '#FF0000';
const negatron = '#0000FF';
const neutron = '#00FF00';

var particle = (function (x, y, vx, vy, charge) {
  return {
    copy: function (p){
      var vel = p.getVelocity();
      var pos = p.getPosition();
      x = pos.x;
      y = pos.y;
      vx = vel.x;
      vy = vel.y;
      charge = p.getCharge();
    },
    getPosition: function (){
      return {x: x, y: y};
    },
    getVelocity: function (){
      return {x: vx, y: vy};
    },
    getCharge: function (){
      return charge;
    },
    distanceFrom: function (p){
      var pos = p.getPosition();
      var dx = x - pos.x;
      var dy = y - pos.y;
      var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
      var xComp = dist*dist/dx;
      var yComp = dist*dist/dy;
      return {total: dist, x: xComp, y: yComp};
    },
    calcAttraction: function (p)
    {
      var dist = this.distanceFrom(p);
      var forceX = 0;
      var forceY = 0;
      var sign = 0;
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
      vy += 0.1;
      return this;
    },
    calcAttractions: function(){
      var force = 0;
      var sign = 1;
      for(var j = 0; j < new_world.length; j++){
        if(new_world[j] !== this && vx+vy < 10){
          sign = - charge * old_world[j].getCharge();
          force = old_world[j].calcAttraction(this);
          if(vx + force.x*100 < 5)
            vx += sign*force.x*100;
          if(vy + force.y*100 < 5)
            vy += sign*force.y*100;
        }
      }
      return this;
    },
    display: function(){
      if(charge === -1)
        circle(x,y,10,negatron);
      else if(charge === 1)
        circle(x,y,10,positron);
      else
        circle(x,y,10,neutron);
    },
    detectCollision: function (p)
    {
      if(this.distanceFrom(p).total <= 20)
        return 1;
      else
        return 0;
    },
    detectCollisions: function (){
      var dist;
      for(var j = 0; j < old_world.length; j++){
        if(new_world[j] !== this){
          dist = this.distanceFrom(old_world[j]);
          if(this.detectCollision(old_world[j]) === 1){
            vx = old_world[j].getVelocity().x;
            vy = old_world[j].getVelocity().y;
          }
        }
      }
      return this;
    },
    iterate: function(){
      // line(x,y,x+vx,y+vy,'#ff0000');
      y += vy;
      x += vx;
      return this;
    },
    checkBorders: function(){
      if (x + vx + 10 > WIDTH || x + vx < 0)
        vx = -vx;
      if (y + vy + 10 > HEIGHT || y + vy < 0)
        vy = -vy;
      return this;
    }
  };
});

function draw() {
  clear();
  for(var i = 0; i < new_world.length; i++){
    old_world[i].copy(new_world[i]);
  }
  for(i = 0; i < new_world.length; i++){
    new_world[i].calcAttractions()
                .detectCollisions()
                .gravity()
                .checkBorders()
                .iterate()
                .display();
  }
}

function addParticle(x,y,dx,dy,charge)
{
  new_world.push(particle(x,y,dx,dy,charge));
  old_world.push(particle(x,y,dx,dy,charge));
}


function onMouseClick(evt)
{
  addParticle(evt.pageX,evt.pageY,(downx-upx)/10,(downy-upy)/10,0);
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
  addParticle(evt.pageX,evt.pageY,(downx-upx)/10,(downy-upy)/10,-1);
  // draw();
}

function onDoubleClick(evt)
{
  addParticle(evt.pageX,evt.pageY,(downx-upx)/10,(downy-upy)/10,-1);
}

document.ondblclick = onDoubleClick;
document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;
document.onclick = onMouseClick;
document.onkeypress = onKeyPress;

function circle(x,y,radius,color) {
  ctx.fillStyle = color; 
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function line(x1,y1,x2,y2,color){
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle = color;
  ctx.stroke();
  // ctx.strokeStyle = '#000000';
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

init();
