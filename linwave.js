
function Waves(k, om, h, eta) {
  this.k = k;
  this.om = om;
  this.eta = eta;
  this.h = h;

  this.g = 9.8;
  this.x = Array.apply(null, Array(100)).map(function (_, i) {return i;});
  return this;
}

Waves.prototype.draw = function(t) {
  this.svg = d3.select("div#waveSim")
    .append("svg")
      .attr("width", "100%")
      .attr("height", "80%")
      .attr("id", "waveSvg");

  var s = this.surface(0);
  var surface = this.svg.selectAll("circles")
    .data(s)
    .enter()
      .append("circle");

  /*var sfcLine = d3.svg.line()
    .x(function (d, i) { return 10 + 6*i; })
    .y(function (d, i) { return 100 + 20*d; })
    .interpolate("linear");

  this.svg.append("svg:path")
    .attr("d", sfcLine(this.surface(0)));*/

  this.elements = {};
  this.elements["surface"] = surface;

  //this.update(0);
  var i = 0;
  var w = this;
  setInterval(function () {

    i++;
    w.update(2*i);

    //w.elements.surface
    //  .data(w.surface(t))
    //  .enter()
    //    .append("circle");

    //w.elements.surface
    //  .attr("cx", function (d, i) { return 15+i*6; })
    //  .attr("cy", function (d, i) { return 100 + 20*d; })
    //  .attr("r", function (_,_) {return 3; });
    }, 30);


  return this;
}

Waves.prototype.surface = function(t) {
  // Return the wave surface
  var u = this.x.map(function (x) {return this.eta * Math.cos(this.k*x - this.om*t);})
  return u;
}

Waves.prototype.update = function(t) {

  this.elements.surface
    .data(this.surface(t))
    .enter()
      .append("circle");

  this.elements.surface
    .attr("cx", function (d, i) { return 15+i*6; })
    .attr("cy", function (d, i) { return 100 + 20*d; })
    .attr("r", function (_,_) {return 3; });
  return;
}


