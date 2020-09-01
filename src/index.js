import { pipe, map, curry, tap } from 'ramda';

var ctx;
var WIDTH;
var HEIGHT;
var downx;
var downy;
const positron = '#FF0000';
const negatron = '#0000FF';
const neutron = '#00FF00';
const MAX_VELOCITY = 5;
const CIRCLE_RADIUS = 10;
const DEFAULT_DRAW_TIME = 10;
let drawTime = DEFAULT_DRAW_TIME;
let particles = [];
let drawId;

const log = curry((tag, x) => console.log(tag + ': ' + JSON.stringify(x)));

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const distanceBetween = (a, b) => {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
  var xComp = dist * dist/dx;
  var yComp = dist * dist/dy;
  return {total: dist, x: xComp, y: yComp};
};

const calcAttraction = (a, b) => {
  var dist = distanceBetween(a, b);
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
}

const applyGravity = (p) => ({ ...p, vy: p.vy + 0.01 });

const clampVelocity = (v) => Math.min(Math.max(v, -MAX_VELOCITY), MAX_VELOCITY);

const calcAttractions = curry((particles, a) => {
  if (a.justColided || particles.length <= 1) {
    return a;
  }
  return particles
    .filter(b => a.id !== b.id)
    .reduce((newA, b) => {
      const sign = - newA.charge * b.charge;
      const force = calcAttraction(newA, b);
      const xChange = sign * force.x * 10;
      const yChange = sign * force.y * 10;
      return {
        ...newA,
        vx: clampVelocity(newA.vx + xChange),
        vy: clampVelocity(newA.vy + yChange)
      }
  }, a);
});

const getType = ({ charge }) => charge === -1 ? negatron : charge === 1 ? positron : neutron;

const display = (particle, showId = false) => {
  const { x, y, vx, vy, justColided, id } = particle;
  ctx.fillStyle = getType(particle); 
  ctx.beginPath();
  ctx.arc(x, y, CIRCLE_RADIUS, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
  ctx.fillText(`${vx.toFixed(2)}, ${vy.toFixed(2)}, ${justColided} ${showId ? id : ''}`, x, y);
};

const detectCollision = (a, b) => distanceBetween(a, b).total <= (CIRCLE_RADIUS * 2);

const detectCollisions = curry((particles, a) => {
  if (particles.length <= 1) {
    return a;
  }

  const round = makeid(4);
  return particles
    .filter(b => a.id !== b.id)
    .reduce((newA, b) => {
      const collisionDetected = detectCollision(a, b);
      if (collisionDetected) {
        if (!a.justColided) {
          // const dy = y - b.y;
          // const dx = x - b.x;
          return {
            ...newA,
            vx: b.vx,
            vy: b.vy,
            justColided: true,
            detectionRound: round,
          };
        }
      }
      else if (a.justColided && round !== a.detectionRound) {
        return {
          ...newA,
          justColided: false,
        };
      }

      return newA;
    }, a);
});

const iterate = (p) => ({ ...p, y: p.y + p.vy, x: p.x + p.vx });

const checkBorders = ({ x, vx, y, vy, ...p }) => ({
  ...p,
  x,
  y,
  vx: x + vx + 10 > WIDTH || x + vx < 0 ? -vx : vx,
  vy: y + vy + 10 > HEIGHT || y + vy < 0 ? -vy : vy,
});

var makeParticle = (x, y, vx, vy, charge) => ({
  x,
  y,
  vx,
  vy,
  charge,
  id: makeid(10),
  justColided: false,
});

function draw() {
  clear();
  particles = map(pipe(
    detectCollisions(particles),
    calcAttractions(particles),
    // applyGravity,
    checkBorders,
    iterate,
    tap(display),
  ))(particles);

  drawId = setTimeout(() => draw(), drawTime);
}

function onRightClick(evt) {
  evt.preventDefault();
}

function onMouseDown(evt) {
  downx = evt.pageX;
  downy = evt.pageY;
  clearTimeout(drawId);
}

const chargeForButton = {
  0: 1,
  1: 0,
  2: -1,
};

function onMouseUp(evt) {
  const upx = evt.pageX;
  const upy = evt.pageY;

  const charge = chargeForButton[evt.button];

  const dx = (downx-upx)/10;
  const dy = (downy-upy)/10;
  particles.push(makeParticle(downx, downy, dx, dy, charge));
  draw();
}

if (typeof document !== 'undefined') {
  document.onmousedown = onMouseDown;
  document.onmouseup = onMouseUp;
  document.oncontextmenu = onRightClick;
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
  return draw();
}

init();