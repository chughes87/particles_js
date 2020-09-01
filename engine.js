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
const MAX_VELOCITY = 2;
const CIRCLE_RADIUS = 10;
var drawTime = 10;

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

var particle = (function (x, y, vx, vy, charge) {
  return {
    id: makeid(10),
    justColided: false,
    copy: function (p){
      var vel = p.getVelocity();
      var pos = p.getPosition();
      x = pos.x;
      y = pos.y;
      vx = vel.x;
      vy = vel.y;
      charge = p.getCharge();
      this.justColided = p.justColided;
      this.id = p.id;
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
      vy += 0.01;
      return this;
    },
    calcAttractions: function(){
      if (this.justColided) {
        return this;
      }
      for(var j = 0; j < new_world.length; j++){
        if(new_world[j] !== this && vx < MAX_VELOCITY && vy < MAX_VELOCITY){
          const sign = - charge * old_world[j].getCharge();
          const force = old_world[j].calcAttraction(this);
          if(Math.abs(vx + force.x*100) < 5)
            vx += sign*force.x*10;
          if(Math.abs(vy + force.y*100) < 5)
            vy += sign*force.y*10;
        }
      }
      return this;
    },
    display: function(showId = false){
      ctx.fillStyle = this.getType(); 
      ctx.beginPath();
      ctx.arc(x, y, CIRCLE_RADIUS, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillText(`${vx.toFixed(2)}, ${vy.toFixed(2)}, ${this.justColided} ${showId ? this.id : ''}`, x, y);
    },
    getType: () => charge === -1 ? negatron : charge === 1 ? positron : neutron,
    detectCollision: function (p) { return this.distanceFrom(p).total <= (CIRCLE_RADIUS*2) },
    detectCollisions: function (){
      round = makeid(4);
      var dist;
      console.log(old_world.length);
      old_world
        .filter(b => b.id !== this.id)
        .forEach(b => {
          dist = this.distanceFrom(b);
          const collisionDetected = this.detectCollision(b);
          if(collisionDetected && !this.justColided){
            // const dy = y - b.y;
            // const dx = x - b.x;
            vx = b.getVelocity().x;
            vy = b.getVelocity().y;
            this.justColided = true;
            this.detectionRound = round;
          }
          if (!collisionDetected && this.justColided && round !== this.detectionRound) {
            this.justColided = false;
          }
        });
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
  old_world.forEach((w,i) => w.copy(new_world[i]));
  new_world.map(
    w => w
      .detectCollisions()
      .calcAttractions()
      // .gravity()
      .checkBorders()
      .iterate()
      .display()
  )
  setTimeout(draw, drawTime);
}

function addParticle(x,y,charge) {
  const dx = (downx-upx)/10;
  const dy = (downy-upy)/10;
  new_world.push(particle(x,y,dx,dy,charge));
  old_world.push(particle(x,y,dx,dy,charge));
}



function onRightClick(evt) {
  evt.preventDefault();
}

function onMouseDown(evt) {
  downx = evt.pageX;
  downy = evt.pageY;
}

function onMouseUp(evt) {
  upx = evt.pageX;
  upy = evt.pageY;


  let charge = null;
  switch (evt.button) {
    case 0:
      charge = 1;
      break;
    case 1:
      charge = 0;
      break;
    case 2:
      charge = -1;
      break;
  }
  addParticle(evt.pageX,evt.pageY,charge);
}

document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;
document.oncontextmenu = onRightClick;

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
  return draw();
}

init();
