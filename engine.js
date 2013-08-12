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

var particle = (function (x, y, vx, vy) {
  return {
    getX: function (){
      return x;
    },
    getY: function (){
      return y;
    },
    distanceFrom: function (xc, yc){
      var dx = xc - x;
      var dy = yc - y;
      return {dx: dx, dy: dy};
    },
    iterate: function (){
      var fx = 0;
      var fy = 0;
      var distance;
      var sign = 0;
      circle(x, y, 5);
      for(var j = 0; j < particles.length; j++){
        if(particles[j] === this)
          continue;
        distance = particles[j].distanceFrom(x,y);
        if(distance.dx != 0){
          var sign = distance.dx/Math.abs(distance.dx);
          fx += sign/Math.pow(distance.dx,2);
        }
        if(distance.dy != 0){
          var sign = distance.dy/Math.abs(distance.dy);
          fy += sign/Math.pow(distance.dy,2);
        }
      }
      vx += fx*10;
      vy += fy*10;
      line(x,y,x+fx*100,y+fy*100,'#499df5')
      if (x + vx > WIDTH || x + vx < 0)
        vx = -vx;
      if (y + vy > HEIGHT || y + vy < 0)
        vy = -vy;
      line(x,y,x+vx*10,y+vy*10,'#ff0000');
      y += vy;
      x += vx;
      // document.getElementById('debug1').innerHTML = "fx: "+fx;
      // document.getElementById('debug2').innerHTML = "fy: "+fy;
      // document.getElementById('debug3').innerHTML = "dx: "+vx;
      // document.getElementById('debug4').innerHTML = "dy: "+vy;
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