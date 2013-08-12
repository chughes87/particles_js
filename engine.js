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
      for(var j = 0; j < particles.length; j++){
        if(particles[j] == this)
          continue;
        var distance = this.distanceFrom(particles[j]);
        var fx = 1/Math.pow(distance.x,2);
        var fy = 1/Math.pow(distance.y,2);
        dx += fx/10;
        dy += fy/10;
      }
      if (x + dx > WIDTH || x + dx < 0)
        dx = -dx;
      if (y + dy > HEIGHT || y + dy < 0)
        dy = -dy;
      // dy += 0.5;
      x += dx;
      y += dy;
        document.getElementById('debug1').innerHTML = "fx: "+fx;
        document.getElementById('debug2').innerHTML = "fy: "+fy;
        document.getElementById('debug3').innerHTML = "dx: "+dx;
        document.getElementById('debug4').innerHTML = "dy: "+dy;
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
  return setInterval(draw, 100);
}

function draw() {
  clear();
  for(var i = 0; i < particles.length; i++)
  {
    particles[i].iterate();
  }
}

init();
// init_mouse();