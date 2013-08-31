var ctx;
var WIDTH;
var HEIGHT;
var canvasMinX;
var canvasMaxX;
var canvasMinY;
var canvasMaxY;
var downPos;
var upPos;
var old_world = [];
var new_world = [];
const positron = '#FF0000';
const negatron = '#0000FF';
const neutron = '#00FF00';

var vector = (function (pos1, pos2) {
  var magnitude = function (){
    var dx = pos1.getX() - pos2.getX();
    var dy = pos1.getY() - pos2.getY();
    return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
  }();
  console.log("magnitude: " + magnitude);
  var xComponent = magnitude * magnitude / (pos1.getX() - pos2.getX());
  var yComponent = magnitude * magnitude / (pos1.getY() - pos2.getY());
  return{
    clone: function (){
      return vector(pos1, pos2);
    },
    cross: function (v){

    },
    dot: function (v){

    },
    inverseSquare: function(){
      var x = 0;
      var y = 0;
      var sign = 0;
      if(xComponent != 0){
        sign = xComponent/Math.abs(xComponent);
        x = sign/Math.pow(xComponent,2);
      }
      if(yComponent != 0){
        sign = yComponent/Math.abs(yComponent);
        y = sign/Math.pow(yComponent,2);
      }
      var pos1 = position(0,0);
      var pos2 = position(x,y)
      return vector(pos1, pos2);
    },
    plus: function (v){
      var pos1 = position(0,0);
      var dx = v.getX() + xComponent;
      var dy = v.getY() + yComponent;
      var pos2 = position(dx,dy);
      return vector(pos1,pos2);
    },
    minus: function (v){
      var pos1 = position(0,0);
      var dx = xComponent - v.getX();
      var dy = yComponent - v.getY();
      return vector(pos1,pos2);
    },
    inverse: function (){
      return vector(pos1.inverse(), pos2.inverse());
    },
    getX: function (){
      return xComponent;
    },
    getY: function (){
      return yComponent;
    },
    getMagnitude: function (){
      return magnitude;
    }
  };
});

var position = (function (x,y) {
  return{
    clone: function (){
      return position(x,y);
    },
    getX: function (){
      return x;
    },
    getY: function (){
      return y;
    },
    applyVelocity: function (v){
      x += v.getX();
      y += v.getY();
    },
    distanceFrom: function (pos){
      return vector(this, pos);
    },
    inverse: function (){
      return position(-x,-y);
    }
  };
});

var particle = (function (pos, vel, charge) {
  return {
    copy: function (p){
      vel = p.getVelocity();
      pos = p.getPosition();
      charge = p.getCharge();
    },
    getPosition: function (){
      return pos.clone();
    },
    getVelocity: function (){
      return vel.clone();
    },
    getCharge: function (){
      return charge;
    },
    calcAttraction: function (otherParticle)
    {
      return vector(pos, otherParticle.getPosition()).inverseSquare();
      // var dist = pos.distanceFrom(otherParticle.getPosition());
      // var force = vector();
      // var forceX = 0;
      // var forceY = 0;
      // var sign = 0;
      // if(dist.x != 0){
      //   sign = dist.x/Math.abs(dist.x);
      //   forceX += sign/Math.pow(dist.x,2);
      // }
      // if(dist.y != 0){
      //   sign = dist.y/Math.abs(dist.y);
      //   forceY += sign/Math.pow(dist.y,2);
      // }
      // return {x: forceX, y: forceY};
    },
    gravity: function(){
      // vy += 0.1;
      g = vector(position(0,0), position(0,0.1));
      vel = vel.plus(g);
      return this;
    },
    calcAttractions: function(){
      var force = 0;
      var sign = 1;
      for(var j = 0; j < new_world.length; j++){
        if(new_world[j] !== this){// && vx+vy < 10){
          sign = - charge * old_world[j].getCharge();
          force = old_world[j].calcAttraction(this);
          vel = vel.plus( sign > 0 ? force : force.inverse());
          // if(vx + force.x*100 < 5)
          // vx += sign*force.x*100;
          // if(vy + force.y*100 < 5)
          // vy += sign*force.y*100;
        }
      }
      return this;
    },
    display: function(){
      if(charge === -1)
        circle(pos.getX(),pos.getY(),10,negatron);
      else if(charge === 1)
        circle(pos.getX(),pos.getY(),10,positron);
      else
        circle(pos.getX(),pos.getY(),10,neutron);
    },
    detectCollision: function (otherParticle)
    {
      if(pos.distanceFrom(otherParticle.getPosition()).getMagnitude() <= 20)
        return 1;
      else
        return 0;
    },
    detectCollisions: function (){
      var dist;
      for(var j = 0; j < old_world.length; j++){
        if(new_world[j] !== this){
          dist = pos.distanceFrom(old_world[j].getPosition());
          if(this.detectCollision(old_world[j]) === 1){
            vel - old_world[j].getVelocity();
          }
        }
      }
      return this;
    },
    iterate: function(){
      // line(x,y,x+vx,y+vy,'#ff0000');
      // y += vy;
      // x += vx;
      pos.applyVelocity(vel);
      return this;
    },
    checkBorders: function(){
      // if (x + vx + 10 > WIDTH || x + vx < 0)
        // vx = -vx;
      // if (y + vy + 10 > HEIGHT || y + vy < 0)
        // vy = -vy;
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

function addParticle(pos, vel, charge)
{
  console.log("pos: " + pos.getX() + " : " + pos.getY() + " vel: " + vel.getX() + " : " + vel.getY());
  new_world.push(particle(pos, vel, charge));
  old_world.push(particle(pos, vel, charge));
}

function onMouseClick(evt)
{
  var pos = position(evt.pageX, evt.pageY);
  var vel = vector(downPos, upPos);
  addParticle(pos, vel, 1);
}

function onMouseDown(evt)
{
  downPos = position(evt.pageX, evt.pageY);
}

function onMouseUp(evt)
{
  upPos = position(evt.pageX/10, evt.pageY/10);
}

function onKeyPress(evt)
{
  vel = vector(downPos, upPos);
  addParticle(downPos, vel, -1);
  // draw();
}

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
