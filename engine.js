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
var particles = [];

var particle = (function (x,y,dx,dy){
  return {
    getX: function (){
      return x;
    },
    getY: function (){
      return y;
    },
    distanceFrom: function (p){
      var dx = x - p.getX();
      var dy = y - p.getY();
      return {tot:Math.sqrt(dx^2+dy^2),x: dx, y:dy};
    },
    iterate: function (){
      circle(x, y, 10);
       for(i = 0; i < particles.length; i++){
        document.getElementById('debug').innerHTML = i;
        // if(particles[i] == this)
          // continue;
        // distance = this.distanceFrom(particles[i]);
        // fx = 1/Math.pow(distance.x,2);
        // fy = 1/Math.pow(distance.y,2);
        // dx += fx;
        // dy += fy;
      }
      if (x + dx > WIDTH || x + dx < 0)
        dx = -dx;
      if (y + dy > HEIGHT || y + dy < 0)
        dy = -dy;
      x += dx;
      y += dy;
    }
  };
});

function addParticle(x,y,dx,dy)
{
  particles.push(particle(x,y,dx,dy));//{'x':x,'y':y,'dx':dx,'dy':dy});
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

document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;
document.onclick = onMouseClick;

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
  var cnvs = document.getElementById('canvas');
  ctx = cnvs.getContext('2d');
  WIDTH = cnvs.width;
  HEIGHT = cnvs.height;
  return setInterval(draw, 10);
}

function draw() {
  clear();
  for(i = 0; i < particles.length; i++)
  {
    particles[i].iterate();
  }
}

init();
// init_mouse();