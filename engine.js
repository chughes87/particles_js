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
      var dx = x - xc;
      var dy = y - yc;
      var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
      var xComp = dist*dist/dx;
      var yComp = dist*dist/dy;
      return {x: xComp, y: yComp};
    },
    iterate: function (){
      var forceX = 0;
      var forceY = 0;
      var dist;
      var sign = 0;

      circle(x, y, 5);
      for(var j = 0; j < particles.length; j++){
        if(particles[j] === this)
          continue;
        dist = particles[j].distanceFrom(x,y);
        if(dist.dx != 0){
          sign = dist.x/Math.abs(dist.x);
          forceX += sign/Math.pow(dist.x,2);
        }
        if(dist.dy != 0){
          sign = dist.y/Math.abs(dist.y);
          forceY += sign/Math.pow(dist.y,2);
        }
      }
      vx += forceX*1000;
      vy += forceY*1000;
      if (x + vx > WIDTH || x + vx < 0)
        vx = -vx;
      if (y + vy > HEIGHT || y + vy < 0)
        vy = -vy;
      line(x,y,x+forceX*100,y+forceY*100,'#499df5')
      line(x,y,x+vx*10,y+vy*10,'#ff0000');
      y += vy;
      x += vx;
      document.getElementById('debug1').innerHTML = "forceX: "+forceX;
      document.getElementById('debug2').innerHTML = "forceY:"+forceY;
      document.getElementById('debug3').innerHTML = "vx: "+vx;
      document.getElementById('debug4').innerHTML = "vy: "+vy;
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
  ctx.font="12px Arial";
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