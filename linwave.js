
window.requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;

var k,
    om,
    eta,
    h;

var g = 9.8,
    n = 100,
    x = Array.apply(null, Array(n)).map(function (_, i) {return 4*Math.PI/n*i;});

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
  var h = height,
      w = width,
      hts = height / 5;

  // water
  context.fillStyle = "#8888FF";
  context.beginPath();
  var u = waveSurface(t);
  context.moveTo(w, 0.2*height + 0.2*height*u[-1]);
  context.lineTo(w, height);
  context.lineTo(0, height);
  context.lineTo(0, 0.2*height);
  for (var i=0; i < u.length; i++) {
    zs = 0.2 * height + (height-hts) * u[i] / H;
    context.lineTo(i*w/u.length, zs);
  }
  //context.stroke();
  context.fill();
  context.closePath();

  // particle
  addParticle(0.5*w, 0.2*height, t);
  addParticle(0.5*w, 0.3*height, t);
  addParticle(0.5*w, 0.5*height, t);
  addParticle(0.5*w, 0.7*height, t);
  addParticle(0.5*w, 0.9*height, t);


}

function addParticle(xs, zs, t) {
  var hts = height / 5; // pixel location of water surface
  var z = -((zs - hts) / (height - hts)) * H;
  var x = xs / width * L;
  var theta = k*x - om/1000*t;
  var psi = -eta * Math.sin(theta) * Math.cosh(k*(z+H)) / Math.sinh(k*H);
  var zeta = eta * Math.cos(theta) * Math.sinh(k*(z+H)) / Math.sinh(k*H);

  var psis = psi * width / L,
      zetas = zeta * (height-hts) / H;

  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(xs + psis, zs + zetas, 3, 0, 2*Math.PI);
  context.stroke();
  context.fill();
  context.closePath();

  return;
}

function waveSurface(t) {
  var u = x.map(function (x) {
      var xm = x / width * L;
      return eta * Math.cos(k*x - om/1000*t);
    });
  return u;
}

