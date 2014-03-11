
window.requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;

Math.cosh = Math.cosh || function(x) {return (Math.exp(x) + Math.exp(-x))/2;};
Math.sinh = Math.sinh || function(x) {return (Math.exp(x) - Math.exp(-x))/2;};
Math.tanh = Math.tanh || function(x) {return Math.sinh(x) / Math.cosh(x);};

var k, eta, h;

var g = 9.8,
    n = 200,
    fracSky = 0.2;

var canvas = document.getElementById('waves');
var context = canvas.getContext('2d'),
    height = canvas.height,
    width = canvas.width;

var startTime = null;

function drawLoop(t) {
  t = t || new Date.time();
  if (startTime === null) startTime = t;
  var elapsedTime = t - startTime;
  clearFrame();
  drawFrame(elapsedTime);
  requestAnimationFrame(drawLoop);
}

function clearFrame() {
  context.clearRect(0, 0, width, height);
}

function drawFrame(t) {
  addWater(t);

  var particleY = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  var particleX = [0.1, 0.5, 0.9];
  for (var ipy=0; ipy < particleY.length; ipy++) {
    for (var ipx=0; ipx < particleX.length; ipx++) {
      addParticle(particleX[ipx]*width, particleY[ipy]*height, t);
    }
  }

  return;
}

function addWater(t) {
  var hts = height * fracSky;
  var u = waveSurface(t);
  var ulast = u[u.length-1];

  context.fillStyle = "#8888FF";
  context.beginPath();
  // start at upper left
  context.moveTo(width, hts + (height-hts) / H * ulast);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.lineTo(0, hts);
  for (var i=0; i < u.length; i++) {
    zs = hts - (height-hts) / H * u[i];
    context.lineTo(i*width/(u.length-1), zs);
  }
  context.fill();
  context.closePath();
  return;
}

function addParticle(xs, zs, t) {
  // scales
  var hts = height * fracSky, // pixel location of water surface
      z = -(zs - hts) / (height - hts) * H,
      x = xs / width * L;

  // particle displacements
  var theta = phase(x, t),
      psi = -eta * Math.sin(theta) * Math.cosh(k*(z+H)) / Math.sinh(k*H),
      zeta = eta * Math.cos(theta) * Math.sinh(k*(z+H)) / Math.sinh(k*H);

  // displacements scaled to pixels
  var psis = psi * width / L,
      zetas = -zeta * (height-hts) / H;

  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(xs + psis, zs + zetas, 3, 0, 2*Math.PI);
  context.stroke();
  context.fill();
  context.closePath();

  var psimax = eta * Math.cosh(k*(z+H))  / Math.sinh(k*H),
      zetamax = eta * Math.sinh(k*(z+H))  / Math.sinh(k*H);
  var psimaxs = psimax * width / L,
      zetamaxs = zetamax * (height-hts) / H;
  drawEllipseByCenter(context, xs, zs, psimaxs*2, zetamaxs*2);

  return;
}

function waveSurface(t) {
  var u = x.map(function (x) {
      return eta * Math.cos(phase(x,t));
    });
  return u;
}

function phase(x, t) {
  var om = Math.sqrt(g*k * Math.tanh(k*H));
  return k*x - om*t/1000;
}

// ellipse code from Steve Tranby
// http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
function drawEllipseByCenter(ctx, cx, cy, w, h) {
  drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  ctx.stroke();
  ctx.closePath()
}
