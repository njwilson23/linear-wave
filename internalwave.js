window.requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;

var allWaves = new Array(0);

function InternalWave(ctx, k, m, phi) {
  this.ctx = ctx;
  this.k = k;
  this.m = m;
  this.phi = phi;
  this.N = 1.0;

  this.wx = [-1.0, 1.0];
  this.wz = [0.0, 1.0];
  this.width = this.wx[1] - this.wx[0];
  this.height = this.wz[1] - this.wz[0];
  //this.updateOmega();
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
  var kv = [Math.cos(theta), Math.sin(theta)];
  return kv;
}

InternalWave.prototype.cgVec = function() {
  var cg = [Math.cos(this.phi), Math.sin(this.phi)];
  //document.write(cg);
  return cg;
}

InternalWave.prototype.reflect = function(beta, dx) {
  var phir = -this.phi; // assume forward reflection
  if (phir < beta) {
    phir = Math.PI-this.phi; // if this is less than the slope angle, back-reflect
  }
  var kr = this.k * Math.sin(this.phi+beta) / Math.sin(this.phi-beta),
      mr = this.m * Math.sin(this.phi+beta) / Math.sin(this.phi-beta);
  return new InternalWave(this.cntxt, kr, mr, phir);
}


function drawLoop(t) {
  t = t || new Date.time();

  var elapsedTime = t - startTime;
  clearFrame();
  drawFrame(elapsedTime);
  requestAnimationFrame(drawLoop);
}

function clearFrame() {
  cparams.context.clearRect(0, 0, cparams.width, cparams.height);
}

function drawFrame(t) {
  var k = wv.kVec(),
      cg = wv.cgVec(),
      x0 = [0.5*cparams.width, 0.5*cparams.height],
      sx = cparams.width / wv.width,
      sz = cparams.height / wv.height;
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
