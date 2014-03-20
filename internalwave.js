window.requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;

function InternalWave(cntxt, k, m, phi, beta) {
  this.cntxt = cntxt;
  this.k = k;
  this.m = m;
  this.phi = phi;
  this.beta = beta;
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

InternalWave.prototype.cgVec = function () {
  var cg = [Math.cos(this.phi), Math.sin(this.phi)];
  //document.write(cg);
  return cg;
}



function drawLoop(t) {
  t = t || new Date.time();
  if (startTime === null) startTime = t;
  var elapsedTime = t - startTime;
  clearFrame();
  drawFrame(elapsedTime);
  requestAnimationFrame(drawLoop);
}

function clearFrame() {
  context.clearRect(0, 0, cwidth, cheight);
}

function drawFrame(t) {
  var k = wv.kVec(),
      cg = wv.cgVec(),
      x0 = [0.5*cwidth, 0.5*cheight],
      sx = cwidth / wv.width,
      sz = cheight / wv.height;
  wv.cntxt.beginPath();
  wv.cntxt.moveTo(x0[0], x0[1]);
  wv.cntxt.lineTo(x0[0] + cg[0]*sx, 
                  x0[1] - cg[1]*sz);
  wv.cntxt.moveTo(x0[0], x0[1]);
  wv.cntxt.lineTo(x0[0] + k[0]*sx, 
                  x0[1] - k[1]*sz);
  wv.cntxt.closePath();
  wv.cntxt.stroke();
  return;
}
