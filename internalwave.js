window.requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;

var allWaves = new Array(0);

function InternalWave(ctx, x, z, k, m, phi) {
  this.ctx = ctx;
  this.k = k;
  this.m = m;
  this.phi = phi;
  this.N = 1.0;

  this.wx = [-1.0, 1.0];
  this.wz = [0.0, 1.0];
  this.width = this.wx[1] - this.wx[0];
  this.height = this.wz[1] - this.wz[0];
  this.xi = x;
  this.zi = z;
  allWaves.push(this);
}

InternalWave.prototype.updateOmega = function() {
  this.omega = this.N*this.N * this.k*this.k / (this.k*this.k + this.m*this.m);
  return this;
}

InternalWave.prototype.kVec = function() {
  var theta = null;
  if (this.phi < 0) {
    theta = this.phi + Math.PI * 0.5;
  } else {
    theta = this.phi - Math.PI * 0.5;
  }
  var kv = [0.2*Math.cos(theta), 0.2*Math.sin(theta)];
  return kv;
}

InternalWave.prototype.cgVec = function() {
  var cg = [0.2*Math.cos(this.phi), 0.2*Math.sin(this.phi)];
  return cg;
}

InternalWave.prototype.reflect = function(beta, dx) {
  var phir = -this.phi; // assume forward reflection
  if (phir < beta) {
    phir = Math.PI-this.phi; // if this is less than the slope angle, back-reflect
  }
  var kr = this.k * Math.sin(this.phi+beta) / Math.sin(this.phi-beta),
      mr = this.m * Math.sin(this.phi+beta) / Math.sin(this.phi-beta);
  var dz = -Math.sin(this.phi) * dx;
  wvr = new InternalWave(this.ctx, this.xi+dx, this.zi+dz, kr, mr, phir);
  return wvr;
}

function drawLoop(t) {
  t = t || new Date.time();

  var elapsedTime = t - startTime;
  clearFrame();
  drawFrame(elapsedTime);
  //requestAnimationFrame(drawLoop);
}

function clearFrame() {
  cparams.context.clearRect(0, 0, cparams.width, cparams.height);
}

function drawFrame(t) {
  for (var i=0; i<allWaves.length; i++) {
    var wv = allWaves[i],
        k = wv.kVec(),
        cg = wv.cgVec(),
        x0 = [(wv.xi-wv.wx[0]) / (wv.wx[1]-wv.wx[0]) * cparams.width,
              (wv.zi-wv.wz[0]) / (wv.wz[1]-wv.wz[0]) * cparams.height],
        sx = cparams.width / wv.width,
        sz = cparams.height / wv.height;
    if (wv.ctx) {
      wv.ctx.lineWidth = 3.0;
      wv.ctx.beginPath();
      wv.ctx.moveTo(x0[0], x0[1]);
      wv.ctx.lineTo(x0[0] + cg[0]*sx,
                      x0[1] - cg[1]*sz);
      wv.ctx.stroke();

      wv.ctx.lineWidth = 1.0;
      wv.ctx.beginPath();
      wv.ctx.moveTo(x0[0], x0[1]);
      wv.ctx.lineTo(x0[0] + k[0]*sx,
                      x0[1] - k[1]*sz);
      wv.ctx.stroke();
      //wv.ctx.closePath();
  return;
}
