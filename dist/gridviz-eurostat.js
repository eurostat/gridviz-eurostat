(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["gviz_es"] = factory();
	else
		root["gviz_es"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/d3-array/src/fsum.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-array/src/fsum.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Adder: () => (/* binding */ Adder),
/* harmony export */   fcumsum: () => (/* binding */ fcumsum),
/* harmony export */   fsum: () => (/* binding */ fsum)
/* harmony export */ });
// https://github.com/python/cpython/blob/a74eea238f5baba15797e2e8b570d153bc8690a7/Modules/mathmodule.c#L1423
class Adder {
  constructor() {
    this._partials = new Float64Array(32);
    this._n = 0;
  }
  add(x) {
    const p = this._partials;
    let i = 0;
    for (let j = 0; j < this._n && j < 32; j++) {
      const y = p[j],
        hi = x + y,
        lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
      if (lo) p[i++] = lo;
      x = hi;
    }
    p[i] = x;
    this._n = i + 1;
    return this;
  }
  valueOf() {
    const p = this._partials;
    let n = this._n, x, y, lo, hi = 0;
    if (n > 0) {
      hi = p[--n];
      while (n > 0) {
        x = hi;
        y = p[--n];
        hi = x + y;
        lo = y - (hi - x);
        if (lo) break;
      }
      if (n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
        y = lo * 2;
        x = hi + y;
        if (y == x - hi) hi = x;
      }
    }
    return hi;
  }
}

function fsum(values, valueof) {
  const adder = new Adder();
  if (valueof === undefined) {
    for (let value of values) {
      if (value = +value) {
        adder.add(value);
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if (value = +valueof(value, ++index, values)) {
        adder.add(value);
      }
    }
  }
  return +adder;
}

function fcumsum(values, valueof) {
  const adder = new Adder();
  let index = -1;
  return Float64Array.from(values, valueof === undefined
      ? v => adder.add(+v || 0)
      : v => adder.add(+valueof(v, ++index, values) || 0)
  );
}


/***/ }),

/***/ "./node_modules/d3-array/src/merge.js":
/*!********************************************!*\
  !*** ./node_modules/d3-array/src/merge.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ merge)
/* harmony export */ });
function* flatten(arrays) {
  for (const array of arrays) {
    yield* array;
  }
}

function merge(arrays) {
  return Array.from(flatten(arrays));
}


/***/ }),

/***/ "./node_modules/d3-geo/src/cartesian.js":
/*!**********************************************!*\
  !*** ./node_modules/d3-geo/src/cartesian.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cartesian: () => (/* binding */ cartesian),
/* harmony export */   cartesianAddInPlace: () => (/* binding */ cartesianAddInPlace),
/* harmony export */   cartesianCross: () => (/* binding */ cartesianCross),
/* harmony export */   cartesianDot: () => (/* binding */ cartesianDot),
/* harmony export */   cartesianNormalizeInPlace: () => (/* binding */ cartesianNormalizeInPlace),
/* harmony export */   cartesianScale: () => (/* binding */ cartesianScale),
/* harmony export */   spherical: () => (/* binding */ spherical)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/d3-geo/src/math.js");


function spherical(cartesian) {
  return [(0,_math_js__WEBPACK_IMPORTED_MODULE_0__.atan2)(cartesian[1], cartesian[0]), (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.asin)(cartesian[2])];
}

function cartesian(spherical) {
  var lambda = spherical[0], phi = spherical[1], cosPhi = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(phi);
  return [cosPhi * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(lambda), cosPhi * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(lambda), (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(phi)];
}

function cartesianDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

// TODO return a
function cartesianAddInPlace(a, b) {
  a[0] += b[0], a[1] += b[1], a[2] += b[2];
}

function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
}

// TODO return d
function cartesianNormalizeInPlace(d) {
  var l = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sqrt)(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/circle.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-geo/src/circle.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   circleStream: () => (/* binding */ circleStream),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cartesian_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cartesian.js */ "./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constant.js */ "./node_modules/d3-geo/src/constant.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/d3-geo/src/math.js");
/* harmony import */ var _rotation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rotation.js */ "./node_modules/d3-geo/src/rotation.js");





// Generates a circle centered at [0°, 0°], with a given radius and precision.
function circleStream(stream, radius, delta, direction, t0, t1) {
  if (!delta) return;
  var cosRadius = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(radius),
      sinRadius = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(radius),
      step = direction * delta;
  if (t0 == null) {
    t0 = radius + direction * _math_js__WEBPACK_IMPORTED_MODULE_0__.tau;
    t1 = radius - step / 2;
  } else {
    t0 = circleRadius(cosRadius, t0);
    t1 = circleRadius(cosRadius, t1);
    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * _math_js__WEBPACK_IMPORTED_MODULE_0__.tau;
  }
  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
    point = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_1__.spherical)([cosRadius, -sinRadius * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(t), -sinRadius * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(t)]);
    stream.point(point[0], point[1]);
  }
}

// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
function circleRadius(cosRadius, point) {
  point = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_1__.cartesian)(point), point[0] -= cosRadius;
  (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_1__.cartesianNormalizeInPlace)(point);
  var radius = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.acos)(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + _math_js__WEBPACK_IMPORTED_MODULE_0__.tau - _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon) % _math_js__WEBPACK_IMPORTED_MODULE_0__.tau;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var center = (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])([0, 0]),
      radius = (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])(90),
      precision = (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])(6),
      ring,
      rotate,
      stream = {point: point};

  function point(x, y) {
    ring.push(x = rotate(x, y));
    x[0] *= _math_js__WEBPACK_IMPORTED_MODULE_0__.degrees, x[1] *= _math_js__WEBPACK_IMPORTED_MODULE_0__.degrees;
  }

  function circle() {
    var c = center.apply(this, arguments),
        r = radius.apply(this, arguments) * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians,
        p = precision.apply(this, arguments) * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians;
    ring = [];
    rotate = (0,_rotation_js__WEBPACK_IMPORTED_MODULE_3__.rotateRadians)(-c[0] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians, -c[1] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians, 0).invert;
    circleStream(stream, r, p, 1);
    c = {type: "Polygon", coordinates: [ring]};
    ring = rotate = null;
    return c;
  }

  circle.center = function(_) {
    return arguments.length ? (center = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])([+_[0], +_[1]]), circle) : center;
  };

  circle.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])(+_), circle) : radius;
  };

  circle.precision = function(_) {
    return arguments.length ? (precision = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])(+_), circle) : precision;
  };

  return circle;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/antimeridian.js":
/*!******************************************************!*\
  !*** ./node_modules/d3-geo/src/clip/antimeridian.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-geo/src/clip/index.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(
  function() { return true; },
  clipAntimeridianLine,
  clipAntimeridianInterpolate,
  [-_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, -_math_js__WEBPACK_IMPORTED_MODULE_1__.halfPi]
));

// Takes a line and cuts into visible segments. Return values: 0 - there were
// intersections or the line was empty; 1 - no intersections; 2 - there were
// intersections, and the first and last segments should be rejoined.
function clipAntimeridianLine(stream) {
  var lambda0 = NaN,
      phi0 = NaN,
      sign0 = NaN,
      clean; // no intersections

  return {
    lineStart: function() {
      stream.lineStart();
      clean = 1;
    },
    point: function(lambda1, phi1) {
      var sign1 = lambda1 > 0 ? _math_js__WEBPACK_IMPORTED_MODULE_1__.pi : -_math_js__WEBPACK_IMPORTED_MODULE_1__.pi,
          delta = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.abs)(lambda1 - lambda0);
      if ((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.abs)(delta - _math_js__WEBPACK_IMPORTED_MODULE_1__.pi) < _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon) { // line crosses a pole
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? _math_js__WEBPACK_IMPORTED_MODULE_1__.halfPi : -_math_js__WEBPACK_IMPORTED_MODULE_1__.halfPi);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        clean = 0;
      } else if (sign0 !== sign1 && delta >= _math_js__WEBPACK_IMPORTED_MODULE_1__.pi) { // line crosses antimeridian
        if ((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.abs)(lambda0 - sign0) < _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon) lambda0 -= sign0 * _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon; // handle degeneracies
        if ((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.abs)(lambda1 - sign1) < _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon) lambda1 -= sign1 * _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon;
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        clean = 0;
      }
      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function() {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function() {
      return 2 - clean; // if intersections, rejoin first and last segments
    }
  };
}

function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
  var cosPhi0,
      cosPhi1,
      sinLambda0Lambda1 = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sin)(lambda0 - lambda1);
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.abs)(sinLambda0Lambda1) > _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon
      ? (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.atan)(((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sin)(phi0) * (cosPhi1 = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.cos)(phi1)) * (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sin)(lambda1)
          - (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sin)(phi1) * (cosPhi0 = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.cos)(phi0)) * (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sin)(lambda0))
          / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
      : (phi0 + phi1) / 2;
}

function clipAntimeridianInterpolate(from, to, direction, stream) {
  var phi;
  if (from == null) {
    phi = direction * _math_js__WEBPACK_IMPORTED_MODULE_1__.halfPi;
    stream.point(-_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, phi);
    stream.point(0, phi);
    stream.point(_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, phi);
    stream.point(_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, 0);
    stream.point(_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, -phi);
    stream.point(0, -phi);
    stream.point(-_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, -phi);
    stream.point(-_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, 0);
    stream.point(-_math_js__WEBPACK_IMPORTED_MODULE_1__.pi, phi);
  } else if ((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.abs)(from[0] - to[0]) > _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon) {
    var lambda = from[0] < to[0] ? _math_js__WEBPACK_IMPORTED_MODULE_1__.pi : -_math_js__WEBPACK_IMPORTED_MODULE_1__.pi;
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/buffer.js":
/*!************************************************!*\
  !*** ./node_modules/d3-geo/src/clip/buffer.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _noop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../noop.js */ "./node_modules/d3-geo/src/noop.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var lines = [],
      line;
  return {
    point: function(x, y, m) {
      line.push([x, y, m]);
    },
    lineStart: function() {
      lines.push(line = []);
    },
    lineEnd: _noop_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    rejoin: function() {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/circle.js":
/*!************************************************!*\
  !*** ./node_modules/d3-geo/src/clip/circle.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cartesian_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../cartesian.js */ "./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var _circle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../circle.js */ "./node_modules/d3-geo/src/circle.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");
/* harmony import */ var _pointEqual_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pointEqual.js */ "./node_modules/d3-geo/src/pointEqual.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-geo/src/clip/index.js");






/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(radius) {
  var cr = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(radius),
      delta = 6 * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians,
      smallRadius = cr > 0,
      notHemisphere = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(cr) > _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon; // TODO optimise for this common case

  function interpolate(from, to, direction, stream) {
    (0,_circle_js__WEBPACK_IMPORTED_MODULE_1__.circleStream)(stream, radius, delta, direction, from, to);
  }

  function visible(lambda, phi) {
    return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(lambda) * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(phi) > cr;
  }

  // Takes a line and cuts into visible segments. Return values used for polygon
  // clipping: 0 - there were intersections or the line was empty; 1 - no
  // intersections 2 - there were intersections, and the first and last segments
  // should be rejoined.
  function clipLine(stream) {
    var point0, // previous point
        c0, // code for previous point
        v0, // visibility of previous point
        v00, // visibility of first point
        clean; // no intersections
    return {
      lineStart: function() {
        v00 = v0 = false;
        clean = 1;
      },
      point: function(lambda, phi) {
        var point1 = [lambda, phi],
            point2,
            v = visible(lambda, phi),
            c = smallRadius
              ? v ? 0 : code(lambda, phi)
              : v ? code(lambda + (lambda < 0 ? _math_js__WEBPACK_IMPORTED_MODULE_0__.pi : -_math_js__WEBPACK_IMPORTED_MODULE_0__.pi), phi) : 0;
        if (!point0 && (v00 = v0 = v)) stream.lineStart();
        if (v !== v0) {
          point2 = intersect(point0, point1);
          if (!point2 || (0,_pointEqual_js__WEBPACK_IMPORTED_MODULE_2__["default"])(point0, point2) || (0,_pointEqual_js__WEBPACK_IMPORTED_MODULE_2__["default"])(point1, point2))
            point1[2] = 1;
        }
        if (v !== v0) {
          clean = 0;
          if (v) {
            // outside going in
            stream.lineStart();
            point2 = intersect(point1, point0);
            stream.point(point2[0], point2[1]);
          } else {
            // inside going out
            point2 = intersect(point0, point1);
            stream.point(point2[0], point2[1], 2);
            stream.lineEnd();
          }
          point0 = point2;
        } else if (notHemisphere && point0 && smallRadius ^ v) {
          var t;
          // If the codes for two points are different, or are both zero,
          // and there this segment intersects with the small circle.
          if (!(c & c0) && (t = intersect(point1, point0, true))) {
            clean = 0;
            if (smallRadius) {
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
            } else {
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
              stream.lineStart();
              stream.point(t[0][0], t[0][1], 3);
            }
          }
        }
        if (v && (!point0 || !(0,_pointEqual_js__WEBPACK_IMPORTED_MODULE_2__["default"])(point0, point1))) {
          stream.point(point1[0], point1[1]);
        }
        point0 = point1, v0 = v, c0 = c;
      },
      lineEnd: function() {
        if (v0) stream.lineEnd();
        point0 = null;
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function() {
        return clean | ((v00 && v0) << 1);
      }
    };
  }

  // Intersects the great circle between a and b with the clip circle.
  function intersect(a, b, two) {
    var pa = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesian)(a),
        pb = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesian)(b);

    // We have two planes, n1.p = d1 and n2.p = d2.
    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
    var n1 = [1, 0, 0], // normal
        n2 = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianCross)(pa, pb),
        n2n2 = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianDot)(n2, n2),
        n1n2 = n2[0], // cartesianDot(n1, n2),
        determinant = n2n2 - n1n2 * n1n2;

    // Two polar points.
    if (!determinant) return !two && a;

    var c1 =  cr * n2n2 / determinant,
        c2 = -cr * n1n2 / determinant,
        n1xn2 = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianCross)(n1, n2),
        A = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianScale)(n1, c1),
        B = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianScale)(n2, c2);
    (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianAddInPlace)(A, B);

    // Solve |p(t)|^2 = 1.
    var u = n1xn2,
        w = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianDot)(A, u),
        uu = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianDot)(u, u),
        t2 = w * w - uu * ((0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianDot)(A, A) - 1);

    if (t2 < 0) return;

    var t = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sqrt)(t2),
        q = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianScale)(u, (-w - t) / uu);
    (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianAddInPlace)(q, A);
    q = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.spherical)(q);

    if (!two) return q;

    // Two intersection points.
    var lambda0 = a[0],
        lambda1 = b[0],
        phi0 = a[1],
        phi1 = b[1],
        z;

    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

    var delta = lambda1 - lambda0,
        polar = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(delta - _math_js__WEBPACK_IMPORTED_MODULE_0__.pi) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon,
        meridian = polar || delta < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon;

    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

    // Check that the first point is between a and b.
    if (meridian
        ? polar
          ? phi0 + phi1 > 0 ^ q[1] < ((0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(q[0] - lambda0) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon ? phi0 : phi1)
          : phi0 <= q[1] && q[1] <= phi1
        : delta > _math_js__WEBPACK_IMPORTED_MODULE_0__.pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
      var q1 = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianScale)(u, (-w + t) / uu);
      (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.cartesianAddInPlace)(q1, A);
      return [q, (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_3__.spherical)(q1)];
    }
  }

  // Generates a 4-bit vector representing the location of a point relative to
  // the small circle's bounding box.
  function code(lambda, phi) {
    var r = smallRadius ? radius : _math_js__WEBPACK_IMPORTED_MODULE_0__.pi - radius,
        code = 0;
    if (lambda < -r) code |= 1; // left
    else if (lambda > r) code |= 2; // right
    if (phi < -r) code |= 4; // below
    else if (phi > r) code |= 8; // above
    return code;
  }

  return (0,_index_js__WEBPACK_IMPORTED_MODULE_4__["default"])(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-_math_js__WEBPACK_IMPORTED_MODULE_0__.pi, radius - _math_js__WEBPACK_IMPORTED_MODULE_0__.pi]);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/index.js":
/*!***********************************************!*\
  !*** ./node_modules/d3-geo/src/clip/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buffer.js */ "./node_modules/d3-geo/src/clip/buffer.js");
/* harmony import */ var _rejoin_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rejoin.js */ "./node_modules/d3-geo/src/clip/rejoin.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");
/* harmony import */ var _polygonContains_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../polygonContains.js */ "./node_modules/d3-geo/src/polygonContains.js");
/* harmony import */ var d3_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-array */ "./node_modules/d3-array/src/merge.js");






/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(pointVisible, clipLine, interpolate, start) {
  return function(sink) {
    var line = clipLine(sink),
        ringBuffer = (0,_buffer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(),
        ringSink = clipLine(ringBuffer),
        polygonStarted = false,
        polygon,
        segments,
        ring;

    var clip = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function() {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = (0,d3_array__WEBPACK_IMPORTED_MODULE_1__["default"])(segments);
        var startInside = (0,_polygonContains_js__WEBPACK_IMPORTED_MODULE_2__["default"])(polygon, start);
        if (segments.length) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          (0,_rejoin_js__WEBPACK_IMPORTED_MODULE_3__["default"])(segments, compareIntersection, startInside, interpolate, sink);
        } else if (startInside) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
        }
        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function() {
        sink.polygonStart();
        sink.lineStart();
        interpolate(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };

    function point(lambda, phi) {
      if (pointVisible(lambda, phi)) sink.point(lambda, phi);
    }

    function pointLine(lambda, phi) {
      line.point(lambda, phi);
    }

    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }

    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }

    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      ringSink.point(lambda, phi);
    }

    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }

    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();

      var clean = ringSink.clean(),
          ringSegments = ringBuffer.result(),
          i, n = ringSegments.length, m,
          segment,
          point;

      ring.pop();
      polygon.push(ring);
      ring = null;

      if (!n) return;

      // No intersections.
      if (clean & 1) {
        segment = ringSegments[0];
        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
          sink.lineEnd();
        }
        return;
      }

      // Rejoin connected segments.
      // TODO reuse ringBuffer.rejoin()?
      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

      segments.push(ringSegments.filter(validSegment));
    }

    return clip;
  };
}

function validSegment(segment) {
  return segment.length > 1;
}

// Intersections are sorted along the clip edge. For both antimeridian cutting
// and circle clipping, the same comparison is used.
function compareIntersection(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - _math_js__WEBPACK_IMPORTED_MODULE_4__.halfPi - _math_js__WEBPACK_IMPORTED_MODULE_4__.epsilon : _math_js__WEBPACK_IMPORTED_MODULE_4__.halfPi - a[1])
       - ((b = b.x)[0] < 0 ? b[1] - _math_js__WEBPACK_IMPORTED_MODULE_4__.halfPi - _math_js__WEBPACK_IMPORTED_MODULE_4__.epsilon : _math_js__WEBPACK_IMPORTED_MODULE_4__.halfPi - b[1]);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/line.js":
/*!**********************************************!*\
  !*** ./node_modules/d3-geo/src/clip/line.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, b, x0, y0, x1, y1) {
  var ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
  return true;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/rectangle.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-geo/src/clip/rectangle.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ clipRectangle)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");
/* harmony import */ var _buffer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buffer.js */ "./node_modules/d3-geo/src/clip/buffer.js");
/* harmony import */ var _line_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./line.js */ "./node_modules/d3-geo/src/clip/line.js");
/* harmony import */ var _rejoin_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rejoin.js */ "./node_modules/d3-geo/src/clip/rejoin.js");
/* harmony import */ var d3_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-array */ "./node_modules/d3-array/src/merge.js");






var clipMax = 1e9, clipMin = -clipMax;

// TODO Use d3-polygon’s polygonContains here for the ring check?
// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

function clipRectangle(x0, y0, x1, y1) {

  function visible(x, y) {
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function interpolate(from, to, direction, stream) {
    var a = 0, a1 = 0;
    if (from == null
        || (a = corner(from, direction)) !== (a1 = corner(to, direction))
        || comparePoint(from, to) < 0 ^ direction > 0) {
      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
      while ((a = (a + direction + 4) % 4) !== a1);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function corner(p, direction) {
    return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(p[0] - x0) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon ? direction > 0 ? 0 : 3
        : (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(p[0] - x1) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon ? direction > 0 ? 2 : 1
        : (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(p[1] - y0) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon ? direction > 0 ? 1 : 0
        : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
  }

  function compareIntersection(a, b) {
    return comparePoint(a.x, b.x);
  }

  function comparePoint(a, b) {
    var ca = corner(a, 1),
        cb = corner(b, 1);
    return ca !== cb ? ca - cb
        : ca === 0 ? b[1] - a[1]
        : ca === 1 ? a[0] - b[0]
        : ca === 2 ? a[1] - b[1]
        : b[0] - a[0];
  }

  return function(stream) {
    var activeStream = stream,
        bufferStream = (0,_buffer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(),
        segments,
        polygon,
        ring,
        x__, y__, v__, // first point
        x_, y_, v_, // previous point
        first,
        clean;

    var clipStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: polygonStart,
      polygonEnd: polygonEnd
    };

    function point(x, y) {
      if (visible(x, y)) activeStream.point(x, y);
    }

    function polygonInside() {
      var winding = 0;

      for (var i = 0, n = polygon.length; i < n; ++i) {
        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
          if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
          else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
        }
      }

      return winding;
    }

    // Buffer geometry within a polygon and then clip it en masse.
    function polygonStart() {
      activeStream = bufferStream, segments = [], polygon = [], clean = true;
    }

    function polygonEnd() {
      var startInside = polygonInside(),
          cleanInside = clean && startInside,
          visible = (segments = (0,d3_array__WEBPACK_IMPORTED_MODULE_2__["default"])(segments)).length;
      if (cleanInside || visible) {
        stream.polygonStart();
        if (cleanInside) {
          stream.lineStart();
          interpolate(null, null, 1, stream);
          stream.lineEnd();
        }
        if (visible) {
          (0,_rejoin_js__WEBPACK_IMPORTED_MODULE_3__["default"])(segments, compareIntersection, startInside, interpolate, stream);
        }
        stream.polygonEnd();
      }
      activeStream = stream, segments = polygon = ring = null;
    }

    function lineStart() {
      clipStream.point = linePoint;
      if (polygon) polygon.push(ring = []);
      first = true;
      v_ = false;
      x_ = y_ = NaN;
    }

    // TODO rather than special-case polygons, simply handle them separately.
    // Ideally, coincident intersection points should be jittered to avoid
    // clipping issues.
    function lineEnd() {
      if (segments) {
        linePoint(x__, y__);
        if (v__ && v_) bufferStream.rejoin();
        segments.push(bufferStream.result());
      }
      clipStream.point = point;
      if (v_) activeStream.lineEnd();
    }

    function linePoint(x, y) {
      var v = visible(x, y);
      if (polygon) ring.push([x, y]);
      if (first) {
        x__ = x, y__ = y, v__ = v;
        first = false;
        if (v) {
          activeStream.lineStart();
          activeStream.point(x, y);
        }
      } else {
        if (v && v_) activeStream.point(x, y);
        else {
          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
          if ((0,_line_js__WEBPACK_IMPORTED_MODULE_4__["default"])(a, b, x0, y0, x1, y1)) {
            if (!v_) {
              activeStream.lineStart();
              activeStream.point(a[0], a[1]);
            }
            activeStream.point(b[0], b[1]);
            if (!v) activeStream.lineEnd();
            clean = false;
          } else if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
            clean = false;
          }
        }
      }
      x_ = x, y_ = y, v_ = v;
    }

    return clipStream;
  };
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/rejoin.js":
/*!************************************************!*\
  !*** ./node_modules/d3-geo/src/clip/rejoin.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pointEqual_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pointEqual.js */ "./node_modules/d3-geo/src/pointEqual.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");



function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection
  this.e = entry; // is an entry?
  this.v = false; // visited
  this.n = this.p = null; // next & previous
}

// A generalized polygon clipping algorithm: given a polygon that has been cut
// into its visible line segments, and rejoins the segments by interpolating
// along the clip edge.
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(segments, compareIntersection, startInside, interpolate, stream) {
  var subject = [],
      clip = [],
      i,
      n;

  segments.forEach(function(segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n, p0 = segment[0], p1 = segment[n], x;

    if ((0,_pointEqual_js__WEBPACK_IMPORTED_MODULE_0__["default"])(p0, p1)) {
      if (!p0[2] && !p1[2]) {
        stream.lineStart();
        for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
        stream.lineEnd();
        return;
      }
      // handle degenerate cases by moving the point
      p1[0] += 2 * _math_js__WEBPACK_IMPORTED_MODULE_1__.epsilon;
    }

    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });

  if (!subject.length) return;

  clip.sort(compareIntersection);
  link(subject);
  link(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;
    while (current.v) if ((current = current.n) === start) return;
    points = current.z;
    stream.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.n.x, 1, stream);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.p.x, -1, stream);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    stream.lineEnd();
  }
}

function link(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;
  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }
  a.n = b = array[0];
  b.p = a;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/compose.js":
/*!********************************************!*\
  !*** ./node_modules/d3-geo/src/compose.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, b) {

  function compose(x, y) {
    return x = a(x, y), b(x[0], x[1]);
  }

  if (a.invert && b.invert) compose.invert = function(x, y) {
    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
  };

  return compose;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/constant.js":
/*!*********************************************!*\
  !*** ./node_modules/d3-geo/src/constant.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return function() {
    return x;
  };
}


/***/ }),

/***/ "./node_modules/d3-geo/src/identity.js":
/*!*********************************************!*\
  !*** ./node_modules/d3-geo/src/identity.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (x => x);


/***/ }),

/***/ "./node_modules/d3-geo/src/math.js":
/*!*****************************************!*\
  !*** ./node_modules/d3-geo/src/math.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abs: () => (/* binding */ abs),
/* harmony export */   acos: () => (/* binding */ acos),
/* harmony export */   asin: () => (/* binding */ asin),
/* harmony export */   atan: () => (/* binding */ atan),
/* harmony export */   atan2: () => (/* binding */ atan2),
/* harmony export */   ceil: () => (/* binding */ ceil),
/* harmony export */   cos: () => (/* binding */ cos),
/* harmony export */   degrees: () => (/* binding */ degrees),
/* harmony export */   epsilon: () => (/* binding */ epsilon),
/* harmony export */   epsilon2: () => (/* binding */ epsilon2),
/* harmony export */   exp: () => (/* binding */ exp),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   halfPi: () => (/* binding */ halfPi),
/* harmony export */   haversin: () => (/* binding */ haversin),
/* harmony export */   hypot: () => (/* binding */ hypot),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   pi: () => (/* binding */ pi),
/* harmony export */   pow: () => (/* binding */ pow),
/* harmony export */   quarterPi: () => (/* binding */ quarterPi),
/* harmony export */   radians: () => (/* binding */ radians),
/* harmony export */   sign: () => (/* binding */ sign),
/* harmony export */   sin: () => (/* binding */ sin),
/* harmony export */   sqrt: () => (/* binding */ sqrt),
/* harmony export */   tan: () => (/* binding */ tan),
/* harmony export */   tau: () => (/* binding */ tau)
/* harmony export */ });
var epsilon = 1e-6;
var epsilon2 = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var quarterPi = pi / 4;
var tau = pi * 2;

var degrees = 180 / pi;
var radians = pi / 180;

var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var ceil = Math.ceil;
var exp = Math.exp;
var floor = Math.floor;
var hypot = Math.hypot;
var log = Math.log;
var pow = Math.pow;
var sin = Math.sin;
var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sqrt = Math.sqrt;
var tan = Math.tan;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function haversin(x) {
  return (x = sin(x / 2)) * x;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/noop.js":
/*!*****************************************!*\
  !*** ./node_modules/d3-geo/src/noop.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ noop)
/* harmony export */ });
function noop() {}


/***/ }),

/***/ "./node_modules/d3-geo/src/path/bounds.js":
/*!************************************************!*\
  !*** ./node_modules/d3-geo/src/path/bounds.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _noop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../noop.js */ "./node_modules/d3-geo/src/noop.js");


var x0 = Infinity,
    y0 = x0,
    x1 = -x0,
    y1 = x1;

var boundsStream = {
  point: boundsPoint,
  lineStart: _noop_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  lineEnd: _noop_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  polygonStart: _noop_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  polygonEnd: _noop_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  result: function() {
    var bounds = [[x0, y0], [x1, y1]];
    x1 = y1 = -(y0 = x0 = Infinity);
    return bounds;
  }
};

function boundsPoint(x, y) {
  if (x < x0) x0 = x;
  if (x > x1) x1 = x;
  if (y < y0) y0 = y;
  if (y > y1) y1 = y;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (boundsStream);


/***/ }),

/***/ "./node_modules/d3-geo/src/pointEqual.js":
/*!***********************************************!*\
  !*** ./node_modules/d3-geo/src/pointEqual.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/d3-geo/src/math.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, b) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(a[0] - b[0]) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon && (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(a[1] - b[1]) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/polygonContains.js":
/*!****************************************************!*\
  !*** ./node_modules/d3-geo/src/polygonContains.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-array */ "./node_modules/d3-array/src/fsum.js");
/* harmony import */ var _cartesian_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cartesian.js */ "./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/d3-geo/src/math.js");




function longitude(point) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(point[0]) <= _math_js__WEBPACK_IMPORTED_MODULE_0__.pi ? point[0] : (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sign)(point[0]) * (((0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(point[0]) + _math_js__WEBPACK_IMPORTED_MODULE_0__.pi) % _math_js__WEBPACK_IMPORTED_MODULE_0__.tau - _math_js__WEBPACK_IMPORTED_MODULE_0__.pi);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(polygon, point) {
  var lambda = longitude(point),
      phi = point[1],
      sinPhi = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(phi),
      normal = [(0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(lambda), -(0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(lambda), 0],
      angle = 0,
      winding = 0;

  var sum = new d3_array__WEBPACK_IMPORTED_MODULE_1__.Adder();

  if (sinPhi === 1) phi = _math_js__WEBPACK_IMPORTED_MODULE_0__.halfPi + _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon;
  else if (sinPhi === -1) phi = -_math_js__WEBPACK_IMPORTED_MODULE_0__.halfPi - _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon;

  for (var i = 0, n = polygon.length; i < n; ++i) {
    if (!(m = (ring = polygon[i]).length)) continue;
    var ring,
        m,
        point0 = ring[m - 1],
        lambda0 = longitude(point0),
        phi0 = point0[1] / 2 + _math_js__WEBPACK_IMPORTED_MODULE_0__.quarterPi,
        sinPhi0 = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(phi0),
        cosPhi0 = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(phi0);

    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j],
          lambda1 = longitude(point1),
          phi1 = point1[1] / 2 + _math_js__WEBPACK_IMPORTED_MODULE_0__.quarterPi,
          sinPhi1 = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(phi1),
          cosPhi1 = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(phi1),
          delta = lambda1 - lambda0,
          sign = delta >= 0 ? 1 : -1,
          absDelta = sign * delta,
          antimeridian = absDelta > _math_js__WEBPACK_IMPORTED_MODULE_0__.pi,
          k = sinPhi0 * sinPhi1;

      sum.add((0,_math_js__WEBPACK_IMPORTED_MODULE_0__.atan2)(k * sign * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(absDelta), cosPhi0 * cosPhi1 + k * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(absDelta)));
      angle += antimeridian ? delta + sign * _math_js__WEBPACK_IMPORTED_MODULE_0__.tau : delta;

      // Are the longitudes either side of the point’s meridian (lambda),
      // and are the latitudes smaller than the parallel (phi)?
      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_2__.cartesianCross)((0,_cartesian_js__WEBPACK_IMPORTED_MODULE_2__.cartesian)(point0), (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_2__.cartesian)(point1));
        (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_2__.cartesianNormalizeInPlace)(arc);
        var intersection = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_2__.cartesianCross)(normal, arc);
        (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_2__.cartesianNormalizeInPlace)(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.asin)(intersection[2]);
        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  }

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a lambda
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  return (angle < -_math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon || angle < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon && sum < -_math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon2) ^ (winding & 1);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/azimuthal.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-geo/src/projection/azimuthal.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   azimuthalInvert: () => (/* binding */ azimuthalInvert),
/* harmony export */   azimuthalRaw: () => (/* binding */ azimuthalRaw)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");


function azimuthalRaw(scale) {
  return function(x, y) {
    var cx = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(x),
        cy = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(y),
        k = scale(cx * cy);
        if (k === Infinity) return [2, 0];
    return [
      k * cy * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(x),
      k * (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(y)
    ];
  }
}

function azimuthalInvert(angle) {
  return function(x, y) {
    var z = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sqrt)(x * x + y * y),
        c = angle(z),
        sc = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(c),
        cc = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(c);
    return [
      (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.atan2)(x * sc, z * cc),
      (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.asin)(z && y * sc / z)
    ];
  }
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/azimuthalEqualArea.js":
/*!******************************************************************!*\
  !*** ./node_modules/d3-geo/src/projection/azimuthalEqualArea.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   azimuthalEqualAreaRaw: () => (/* binding */ azimuthalEqualAreaRaw),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");
/* harmony import */ var _azimuthal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./azimuthal.js */ "./node_modules/d3-geo/src/projection/azimuthal.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-geo/src/projection/index.js");




var azimuthalEqualAreaRaw = (0,_azimuthal_js__WEBPACK_IMPORTED_MODULE_0__.azimuthalRaw)(function(cxcy) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sqrt)(2 / (1 + cxcy));
});

azimuthalEqualAreaRaw.invert = (0,_azimuthal_js__WEBPACK_IMPORTED_MODULE_0__.azimuthalInvert)(function(z) {
  return 2 * (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.asin)(z / 2);
});

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return (0,_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(azimuthalEqualAreaRaw)
      .scale(124.75)
      .clipAngle(180 - 1e-3);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/fit.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-geo/src/projection/fit.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fitExtent: () => (/* binding */ fitExtent),
/* harmony export */   fitHeight: () => (/* binding */ fitHeight),
/* harmony export */   fitSize: () => (/* binding */ fitSize),
/* harmony export */   fitWidth: () => (/* binding */ fitWidth)
/* harmony export */ });
/* harmony import */ var _stream_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../stream.js */ "./node_modules/d3-geo/src/stream.js");
/* harmony import */ var _path_bounds_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../path/bounds.js */ "./node_modules/d3-geo/src/path/bounds.js");



function fit(projection, fitBounds, object) {
  var clip = projection.clipExtent && projection.clipExtent();
  projection.scale(150).translate([0, 0]);
  if (clip != null) projection.clipExtent(null);
  (0,_stream_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, projection.stream(_path_bounds_js__WEBPACK_IMPORTED_MODULE_1__["default"]));
  fitBounds(_path_bounds_js__WEBPACK_IMPORTED_MODULE_1__["default"].result());
  if (clip != null) projection.clipExtent(clip);
  return projection;
}

function fitExtent(projection, extent, object) {
  return fit(projection, function(b) {
    var w = extent[1][0] - extent[0][0],
        h = extent[1][1] - extent[0][1],
        k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
        x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
        y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

function fitSize(projection, size, object) {
  return fitExtent(projection, [[0, 0], size], object);
}

function fitWidth(projection, width, object) {
  return fit(projection, function(b) {
    var w = +width,
        k = w / (b[1][0] - b[0][0]),
        x = (w - k * (b[1][0] + b[0][0])) / 2,
        y = -k * b[0][1];
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

function fitHeight(projection, height, object) {
  return fit(projection, function(b) {
    var h = +height,
        k = h / (b[1][1] - b[0][1]),
        x = -k * b[0][0],
        y = (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/d3-geo/src/projection/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ projection),
/* harmony export */   projectionMutator: () => (/* binding */ projectionMutator)
/* harmony export */ });
/* harmony import */ var _clip_antimeridian_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../clip/antimeridian.js */ "./node_modules/d3-geo/src/clip/antimeridian.js");
/* harmony import */ var _clip_circle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../clip/circle.js */ "./node_modules/d3-geo/src/clip/circle.js");
/* harmony import */ var _clip_rectangle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../clip/rectangle.js */ "./node_modules/d3-geo/src/clip/rectangle.js");
/* harmony import */ var _compose_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../compose.js */ "./node_modules/d3-geo/src/compose.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../identity.js */ "./node_modules/d3-geo/src/identity.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");
/* harmony import */ var _rotation_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../rotation.js */ "./node_modules/d3-geo/src/rotation.js");
/* harmony import */ var _transform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../transform.js */ "./node_modules/d3-geo/src/transform.js");
/* harmony import */ var _fit_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./fit.js */ "./node_modules/d3-geo/src/projection/fit.js");
/* harmony import */ var _resample_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./resample.js */ "./node_modules/d3-geo/src/projection/resample.js");











var transformRadians = (0,_transform_js__WEBPACK_IMPORTED_MODULE_0__.transformer)({
  point: function(x, y) {
    this.stream.point(x * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians, y * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians);
  }
});

function transformRotate(rotate) {
  return (0,_transform_js__WEBPACK_IMPORTED_MODULE_0__.transformer)({
    point: function(x, y) {
      var r = rotate(x, y);
      return this.stream.point(r[0], r[1]);
    }
  });
}

function scaleTranslate(k, dx, dy, sx, sy) {
  function transform(x, y) {
    x *= sx; y *= sy;
    return [dx + k * x, dy - k * y];
  }
  transform.invert = function(x, y) {
    return [(x - dx) / k * sx, (dy - y) / k * sy];
  };
  return transform;
}

function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
  if (!alpha) return scaleTranslate(k, dx, dy, sx, sy);
  var cosAlpha = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.cos)(alpha),
      sinAlpha = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sin)(alpha),
      a = cosAlpha * k,
      b = sinAlpha * k,
      ai = cosAlpha / k,
      bi = sinAlpha / k,
      ci = (sinAlpha * dy - cosAlpha * dx) / k,
      fi = (sinAlpha * dx + cosAlpha * dy) / k;
  function transform(x, y) {
    x *= sx; y *= sy;
    return [a * x - b * y + dx, dy - b * x - a * y];
  }
  transform.invert = function(x, y) {
    return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
  };
  return transform;
}

function projection(project) {
  return projectionMutator(function() { return project; })();
}

function projectionMutator(projectAt) {
  var project,
      k = 150, // scale
      x = 480, y = 250, // translate
      lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, // pre-rotate
      alpha = 0, // post-rotate angle
      sx = 1, // reflectX
      sy = 1, // reflectX
      theta = null, preclip = _clip_antimeridian_js__WEBPACK_IMPORTED_MODULE_2__["default"], // pre-clip angle
      x0 = null, y0, x1, y1, postclip = _identity_js__WEBPACK_IMPORTED_MODULE_3__["default"], // post-clip extent
      delta2 = 0.5, // precision
      projectResample,
      projectTransform,
      projectRotateTransform,
      cache,
      cacheStream;

  function projection(point) {
    return projectRotateTransform(point[0] * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians, point[1] * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians);
  }

  function invert(point) {
    point = projectRotateTransform.invert(point[0], point[1]);
    return point && [point[0] * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees, point[1] * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees];
  }

  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
  };

  projection.preclip = function(_) {
    return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
  };

  projection.postclip = function(_) {
    return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
  };

  projection.clipAngle = function(_) {
    return arguments.length ? (preclip = +_ ? (0,_clip_circle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(theta = _ * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians) : (theta = null, _clip_antimeridian_js__WEBPACK_IMPORTED_MODULE_2__["default"]), reset()) : theta * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees;
  };

  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, _identity_js__WEBPACK_IMPORTED_MODULE_3__["default"]) : (0,_clip_rectangle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function(_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };

  projection.translate = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };

  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians, phi = _[1] % 360 * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians, recenter()) : [lambda * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees, phi * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees];
  };

  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians, deltaPhi = _[1] % 360 * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians, deltaGamma = _.length > 2 ? _[2] % 360 * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians : 0, recenter()) : [deltaLambda * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees, deltaPhi * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees, deltaGamma * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees];
  };

  projection.angle = function(_) {
    return arguments.length ? (alpha = _ % 360 * _math_js__WEBPACK_IMPORTED_MODULE_1__.radians, recenter()) : alpha * _math_js__WEBPACK_IMPORTED_MODULE_1__.degrees;
  };

  projection.reflectX = function(_) {
    return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
  };

  projection.reflectY = function(_) {
    return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
  };

  projection.precision = function(_) {
    return arguments.length ? (projectResample = (0,_resample_js__WEBPACK_IMPORTED_MODULE_6__["default"])(projectTransform, delta2 = _ * _), reset()) : (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.sqrt)(delta2);
  };

  projection.fitExtent = function(extent, object) {
    return (0,_fit_js__WEBPACK_IMPORTED_MODULE_7__.fitExtent)(projection, extent, object);
  };

  projection.fitSize = function(size, object) {
    return (0,_fit_js__WEBPACK_IMPORTED_MODULE_7__.fitSize)(projection, size, object);
  };

  projection.fitWidth = function(width, object) {
    return (0,_fit_js__WEBPACK_IMPORTED_MODULE_7__.fitWidth)(projection, width, object);
  };

  projection.fitHeight = function(height, object) {
    return (0,_fit_js__WEBPACK_IMPORTED_MODULE_7__.fitHeight)(projection, height, object);
  };

  function recenter() {
    var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)),
        transform = scaleTranslateRotate(k, x - center[0], y - center[1], sx, sy, alpha);
    rotate = (0,_rotation_js__WEBPACK_IMPORTED_MODULE_8__.rotateRadians)(deltaLambda, deltaPhi, deltaGamma);
    projectTransform = (0,_compose_js__WEBPACK_IMPORTED_MODULE_9__["default"])(project, transform);
    projectRotateTransform = (0,_compose_js__WEBPACK_IMPORTED_MODULE_9__["default"])(rotate, projectTransform);
    projectResample = (0,_resample_js__WEBPACK_IMPORTED_MODULE_6__["default"])(projectTransform, delta2);
    return reset();
  }

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/resample.js":
/*!********************************************************!*\
  !*** ./node_modules/d3-geo/src/projection/resample.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cartesian_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../cartesian.js */ "./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../math.js */ "./node_modules/d3-geo/src/math.js");
/* harmony import */ var _transform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../transform.js */ "./node_modules/d3-geo/src/transform.js");




var maxDepth = 16, // maximum depth of subdivision
    cosMinDistance = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(30 * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians); // cos(minimum angular distance)

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(project, delta2) {
  return +delta2 ? resample(project, delta2) : resampleNone(project);
}

function resampleNone(project) {
  return (0,_transform_js__WEBPACK_IMPORTED_MODULE_1__.transformer)({
    point: function(x, y) {
      x = project(x, y);
      this.stream.point(x[0], x[1]);
    }
  });
}

function resample(project, delta2) {

  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
    var dx = x1 - x0,
        dy = y1 - y0,
        d2 = dx * dx + dy * dy;
    if (d2 > 4 * delta2 && depth--) {
      var a = a0 + a1,
          b = b0 + b1,
          c = c0 + c1,
          m = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sqrt)(a * a + b * b + c * c),
          phi2 = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.asin)(c /= m),
          lambda2 = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)((0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(c) - 1) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon || (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(lambda0 - lambda1) < _math_js__WEBPACK_IMPORTED_MODULE_0__.epsilon ? (lambda0 + lambda1) / 2 : (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.atan2)(b, a),
          p = project(lambda2, phi2),
          x2 = p[0],
          y2 = p[1],
          dx2 = x2 - x0,
          dy2 = y2 - y0,
          dz = dy * dx2 - dx * dy2;
      if (dz * dz / d2 > delta2 // perpendicular projected distance
          || (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
          || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
        stream.point(x2, y2);
        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
      }
    }
  }
  return function(stream) {
    var lambda00, x00, y00, a00, b00, c00, // first point
        lambda0, x0, y0, a0, b0, c0; // previous point

    var resampleStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
      polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
    };

    function point(x, y) {
      x = project(x, y);
      stream.point(x[0], x[1]);
    }

    function lineStart() {
      x0 = NaN;
      resampleStream.point = linePoint;
      stream.lineStart();
    }

    function linePoint(lambda, phi) {
      var c = (0,_cartesian_js__WEBPACK_IMPORTED_MODULE_2__.cartesian)([lambda, phi]), p = project(lambda, phi);
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
      stream.point(x0, y0);
    }

    function lineEnd() {
      resampleStream.point = point;
      stream.lineEnd();
    }

    function ringStart() {
      lineStart();
      resampleStream.point = ringPoint;
      resampleStream.lineEnd = ringEnd;
    }

    function ringPoint(lambda, phi) {
      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
      resampleStream.point = linePoint;
    }

    function ringEnd() {
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
      resampleStream.lineEnd = lineEnd;
      lineEnd();
    }

    return resampleStream;
  };
}


/***/ }),

/***/ "./node_modules/d3-geo/src/rotation.js":
/*!*********************************************!*\
  !*** ./node_modules/d3-geo/src/rotation.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   rotateRadians: () => (/* binding */ rotateRadians)
/* harmony export */ });
/* harmony import */ var _compose_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compose.js */ "./node_modules/d3-geo/src/compose.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/d3-geo/src/math.js");



function rotationIdentity(lambda, phi) {
  if ((0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(lambda) > _math_js__WEBPACK_IMPORTED_MODULE_0__.pi) lambda -= Math.round(lambda / _math_js__WEBPACK_IMPORTED_MODULE_0__.tau) * _math_js__WEBPACK_IMPORTED_MODULE_0__.tau;
  return [lambda, phi];
}

rotationIdentity.invert = rotationIdentity;

function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
  return (deltaLambda %= _math_js__WEBPACK_IMPORTED_MODULE_0__.tau) ? (deltaPhi || deltaGamma ? (0,_compose_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
    : rotationLambda(deltaLambda))
    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
    : rotationIdentity);
}

function forwardRotationLambda(deltaLambda) {
  return function(lambda, phi) {
    lambda += deltaLambda;
    if ((0,_math_js__WEBPACK_IMPORTED_MODULE_0__.abs)(lambda) > _math_js__WEBPACK_IMPORTED_MODULE_0__.pi) lambda -= Math.round(lambda / _math_js__WEBPACK_IMPORTED_MODULE_0__.tau) * _math_js__WEBPACK_IMPORTED_MODULE_0__.tau;
    return [lambda, phi];
  };
}

function rotationLambda(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
}

function rotationPhiGamma(deltaPhi, deltaGamma) {
  var cosDeltaPhi = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(deltaPhi),
      sinDeltaPhi = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(deltaPhi),
      cosDeltaGamma = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(deltaGamma),
      sinDeltaGamma = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(deltaGamma);

  function rotation(lambda, phi) {
    var cosPhi = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(phi),
        x = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(lambda) * cosPhi,
        y = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(lambda) * cosPhi,
        z = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(phi),
        k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [
      (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.atan2)(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
      (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.asin)(k * cosDeltaGamma + y * sinDeltaGamma)
    ];
  }

  rotation.invert = function(lambda, phi) {
    var cosPhi = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(phi),
        x = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.cos)(lambda) * cosPhi,
        y = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(lambda) * cosPhi,
        z = (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.sin)(phi),
        k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [
      (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.atan2)(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
      (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.asin)(k * cosDeltaPhi - x * sinDeltaPhi)
    ];
  };

  return rotation;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(rotate) {
  rotate = rotateRadians(rotate[0] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians, rotate[1] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians, rotate.length > 2 ? rotate[2] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians : 0);

  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians, coordinates[1] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians);
    return coordinates[0] *= _math_js__WEBPACK_IMPORTED_MODULE_0__.degrees, coordinates[1] *= _math_js__WEBPACK_IMPORTED_MODULE_0__.degrees, coordinates;
  }

  forward.invert = function(coordinates) {
    coordinates = rotate.invert(coordinates[0] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians, coordinates[1] * _math_js__WEBPACK_IMPORTED_MODULE_0__.radians);
    return coordinates[0] *= _math_js__WEBPACK_IMPORTED_MODULE_0__.degrees, coordinates[1] *= _math_js__WEBPACK_IMPORTED_MODULE_0__.degrees, coordinates;
  };

  return forward;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/stream.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-geo/src/stream.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function(object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function(object, stream) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) streamGeometry(features[i].geometry, stream);
  }
};

var streamGeometryType = {
  Sphere: function(object, stream) {
    stream.sphere();
  },
  Point: function(object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
  },
  LineString: function(object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamLine(coordinates[i], stream, 0);
  },
  Polygon: function(object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function(object, stream) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) streamGeometry(geometries[i], stream);
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  stream.lineStart();
  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1, n = coordinates.length;
  stream.polygonStart();
  while (++i < n) streamLine(coordinates[i], stream, 1);
  stream.polygonEnd();
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
}


/***/ }),

/***/ "./node_modules/d3-geo/src/transform.js":
/*!**********************************************!*\
  !*** ./node_modules/d3-geo/src/transform.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   transformer: () => (/* binding */ transformer)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(methods) {
  return {
    stream: transformer(methods)
  };
}

function transformer(methods) {
  return function(stream) {
    var s = new TransformStream;
    for (var key in methods) s[key] = methods[key];
    s.stream = stream;
    return s;
  };
}

function TransformStream() {}

TransformStream.prototype = {
  constructor: TransformStream,
  point: function(x, y) { this.stream.point(x, y); },
  sphere: function() { this.stream.sphere(); },
  lineStart: function() { this.stream.lineStart(); },
  lineEnd: function() { this.stream.lineEnd(); },
  polygonStart: function() { this.stream.polygonStart(); },
  polygonEnd: function() { this.stream.polygonEnd(); }
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEuronymeLabelLayer: () => (/* binding */ getEuronymeLabelLayer),
/* harmony export */   getEurostatBoundariesLayer: () => (/* binding */ getEurostatBoundariesLayer),
/* harmony export */   proj3035: () => (/* binding */ proj3035)
/* harmony export */ });
/* harmony import */ var d3_geo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-geo */ "./node_modules/d3-geo/src/projection/azimuthalEqualArea.js");
//@ts-check


;

/**
 * Projection function for European LAEA.
 */
const proj3035 = (0,d3_geo__WEBPACK_IMPORTED_MODULE_0__["default"])()
    .rotate([-10, -52])
    .reflectX(false)
    .reflectY(true)
    .scale(6378137)
    .translate([4321000, 3210000])

/**
 * Returns options for gridviz label layer.
 * From Euronym data: https://github.com/eurostat/euronym
 *
 * @returns {object}
 */
const getEuronymeLabelLayer = function (cc = 'EUR', res = 50, opts) {
    opts = opts || {}
    const ex = opts.ex || 1.2
    const fontFamily = opts.fontFamily || 'Arial'
    const exSize = opts.exSize || 1
    opts.style =
        opts.style ||
        ((lb, zf) => {
            if (lb.rs < ex * zf) return
            if (lb.r1 < ex * zf) return exSize + 'em ' + fontFamily
            return exSize * 1.5 + 'em ' + fontFamily
        })
    opts.proj = opts.proj || proj3035
    opts.preprocess = (lb) => {
        //exclude countries
        //if(opts.ccOut && lb.cc && opts.ccOut.includes(lb.cc)) return false;
        if (opts.ccIn && lb.cc && !(opts.ccIn.indexOf(lb.cc) >= 0)) return false

        //project from geo coordinates to ETRS89-LAEA
        const p = opts.proj([lb.lon, lb.lat])
        lb.x = p[0]
        lb.y = p[1]
        delete lb.lon
        delete lb.lat
    }
    opts.baseURL = opts.baseURL || 'https://raw.githubusercontent.com/eurostat/euronym/main/pub/v2/UTF/'
    opts.url = opts.baseURL + res + '/' + cc + '.csv'
    return opts
}


/**
 * Returns options for gridviz boundaries layer.
 * From Nuts2json data: https://github.com/eurostat/Nuts2json
 * 
 * @returns {object}
 */
const getEurostatBoundariesLayer = function (opts) {
    opts = opts || {}
    const nutsYear = opts.nutsYear || '2021'
    const crs = opts.crs || '3035'
    const scale = opts.scale || '03M'
    const nutsLevel = opts.nutsLevel || '3'
    const col = opts.col || '#888'
    const colKosovo = opts.colKosovo || '#bcbcbc'
    const showOth = opts.showOth == undefined ? true : opts.showOth

    //in most of the case, already projected data of nuts2json will be used, using 'opts.crs'
    if (opts.proj)
        opts.preprocess = (bn) => {

            if (bn.geometry.type === "LineString") {
                const cs = []
                for (let c of bn.geometry.coordinates)
                    cs.push(opts.proj(c))
                bn.geometry.coordinates = cs
            } else {
                console.warn("Could not project boundary - unsupported geometry type: " + bn.geometry.type)
            }

        }


    opts.color =
        opts.color ||
        ((f, zf) => {
            const p = f.properties
            if (!showOth /*&& p.co == "F"*/ && p.eu != 'T' && p.cc != 'T' && p.efta != 'T' && p.oth === 'T')
                return
            if (p.id >= 100000) return colKosovo
            if (p.co === 'T') return col
            if (zf < 400) return col
            else if (zf < 1000) return p.lvl >= 3 ? '' : col
            else if (zf < 2000) return p.lvl >= 2 ? '' : col
            else return p.lvl >= 1 ? '' : col
        })

    opts.width =
        opts.width ||
        ((f, zf) => {
            const p = f.properties
            if (p.co === 'T') return 0.5
            if (zf < 400) return p.lvl == 3 ? 2.2 : p.lvl == 2 ? 2.2 : p.lvl == 1 ? 2.2 : 4
            else if (zf < 1000) return p.lvl == 2 ? 1.8 : p.lvl == 1 ? 1.8 : 2.5
            else if (zf < 2000) return p.lvl == 1 ? 1.8 : 2.5
            else return 1.2
        })

    opts.lineDash =
        opts.lineDash ||
        ((f, zf) => {
            const p = f.properties
            if (p.co === 'T') return []
            if (zf < 400)
                return p.lvl == 3
                    ? [2 * zf, 2 * zf]
                    : p.lvl == 2
                        ? [5 * zf, 2 * zf]
                        : p.lvl == 1
                            ? [5 * zf, 2 * zf]
                            : [10 * zf, 3 * zf]
            else if (zf < 1000)
                return p.lvl == 2 ? [5 * zf, 2 * zf] : p.lvl == 1 ? [5 * zf, 2 * zf] : [10 * zf, 3 * zf]
            else if (zf < 2000) return p.lvl == 1 ? [5 * zf, 2 * zf] : [10 * zf, 3 * zf]
            else return [10 * zf, 3 * zf]
        })

    opts.baseURL = opts.baseURL || 'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/'
    opts.url = opts.baseURL + nutsYear + '/' + crs + '/' + scale + '/nutsbn_' + nutsLevel + '.json'
    return opts
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2d2aXpfZXMvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL2ZzdW0uanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NhcnRlc2lhbi5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2lyY2xlLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jbGlwL2FudGltZXJpZGlhbi5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2xpcC9idWZmZXIuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NsaXAvY2lyY2xlLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jbGlwL2luZGV4LmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jbGlwL2xpbmUuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NsaXAvcmVjdGFuZ2xlLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jbGlwL3Jlam9pbi5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY29tcG9zZS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY29uc3RhbnQuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2lkZW50aXR5LmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9tYXRoLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9ub29wLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wYXRoL2JvdW5kcy5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcG9pbnRFcXVhbC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcG9seWdvbkNvbnRhaW5zLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wcm9qZWN0aW9uL2F6aW11dGhhbC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcHJvamVjdGlvbi9hemltdXRoYWxFcXVhbEFyZWEuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3Byb2plY3Rpb24vZml0LmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wcm9qZWN0aW9uL2luZGV4LmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wcm9qZWN0aW9uL3Jlc2FtcGxlLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9yb3RhdGlvbi5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvc3RyZWFtLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy90cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ndml6X2VzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ndml6X2VzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2d2aXpfZXMvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZ3Zpel9lc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJndml6X2VzXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9weXRob24vY3B5dGhvbi9ibG9iL2E3NGVlYTIzOGY1YmFiYTE1Nzk3ZTJlOGI1NzBkMTUzYmM4NjkwYTcvTW9kdWxlcy9tYXRobW9kdWxlLmMjTDE0MjNcbmV4cG9ydCBjbGFzcyBBZGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3BhcnRpYWxzID0gbmV3IEZsb2F0NjRBcnJheSgzMik7XG4gICAgdGhpcy5fbiA9IDA7XG4gIH1cbiAgYWRkKHgpIHtcbiAgICBjb25zdCBwID0gdGhpcy5fcGFydGlhbHM7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5fbiAmJiBqIDwgMzI7IGorKykge1xuICAgICAgY29uc3QgeSA9IHBbal0sXG4gICAgICAgIGhpID0geCArIHksXG4gICAgICAgIGxvID0gTWF0aC5hYnMoeCkgPCBNYXRoLmFicyh5KSA/IHggLSAoaGkgLSB5KSA6IHkgLSAoaGkgLSB4KTtcbiAgICAgIGlmIChsbykgcFtpKytdID0gbG87XG4gICAgICB4ID0gaGk7XG4gICAgfVxuICAgIHBbaV0gPSB4O1xuICAgIHRoaXMuX24gPSBpICsgMTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB2YWx1ZU9mKCkge1xuICAgIGNvbnN0IHAgPSB0aGlzLl9wYXJ0aWFscztcbiAgICBsZXQgbiA9IHRoaXMuX24sIHgsIHksIGxvLCBoaSA9IDA7XG4gICAgaWYgKG4gPiAwKSB7XG4gICAgICBoaSA9IHBbLS1uXTtcbiAgICAgIHdoaWxlIChuID4gMCkge1xuICAgICAgICB4ID0gaGk7XG4gICAgICAgIHkgPSBwWy0tbl07XG4gICAgICAgIGhpID0geCArIHk7XG4gICAgICAgIGxvID0geSAtIChoaSAtIHgpO1xuICAgICAgICBpZiAobG8pIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKG4gPiAwICYmICgobG8gPCAwICYmIHBbbiAtIDFdIDwgMCkgfHwgKGxvID4gMCAmJiBwW24gLSAxXSA+IDApKSkge1xuICAgICAgICB5ID0gbG8gKiAyO1xuICAgICAgICB4ID0gaGkgKyB5O1xuICAgICAgICBpZiAoeSA9PSB4IC0gaGkpIGhpID0geDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmc3VtKHZhbHVlcywgdmFsdWVvZikge1xuICBjb25zdCBhZGRlciA9IG5ldyBBZGRlcigpO1xuICBpZiAodmFsdWVvZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBpZiAodmFsdWUgPSArdmFsdWUpIHtcbiAgICAgICAgYWRkZXIuYWRkKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBpZiAodmFsdWUgPSArdmFsdWVvZih2YWx1ZSwgKytpbmRleCwgdmFsdWVzKSkge1xuICAgICAgICBhZGRlci5hZGQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gK2FkZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmN1bXN1bSh2YWx1ZXMsIHZhbHVlb2YpIHtcbiAgY29uc3QgYWRkZXIgPSBuZXcgQWRkZXIoKTtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIHJldHVybiBGbG9hdDY0QXJyYXkuZnJvbSh2YWx1ZXMsIHZhbHVlb2YgPT09IHVuZGVmaW5lZFxuICAgICAgPyB2ID0+IGFkZGVyLmFkZCgrdiB8fCAwKVxuICAgICAgOiB2ID0+IGFkZGVyLmFkZCgrdmFsdWVvZih2LCArK2luZGV4LCB2YWx1ZXMpIHx8IDApXG4gICk7XG59XG4iLCJmdW5jdGlvbiogZmxhdHRlbihhcnJheXMpIHtcbiAgZm9yIChjb25zdCBhcnJheSBvZiBhcnJheXMpIHtcbiAgICB5aWVsZCogYXJyYXk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2UoYXJyYXlzKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGZsYXR0ZW4oYXJyYXlzKSk7XG59XG4iLCJpbXBvcnQge2FzaW4sIGF0YW4yLCBjb3MsIHNpbiwgc3FydH0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gc3BoZXJpY2FsKGNhcnRlc2lhbikge1xuICByZXR1cm4gW2F0YW4yKGNhcnRlc2lhblsxXSwgY2FydGVzaWFuWzBdKSwgYXNpbihjYXJ0ZXNpYW5bMl0pXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhbihzcGhlcmljYWwpIHtcbiAgdmFyIGxhbWJkYSA9IHNwaGVyaWNhbFswXSwgcGhpID0gc3BoZXJpY2FsWzFdLCBjb3NQaGkgPSBjb3MocGhpKTtcbiAgcmV0dXJuIFtjb3NQaGkgKiBjb3MobGFtYmRhKSwgY29zUGhpICogc2luKGxhbWJkYSksIHNpbihwaGkpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhbkRvdChhLCBiKSB7XG4gIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdICsgYVsyXSAqIGJbMl07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW5Dcm9zcyhhLCBiKSB7XG4gIHJldHVybiBbYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSwgYVsyXSAqIGJbMF0gLSBhWzBdICogYlsyXSwgYVswXSAqIGJbMV0gLSBhWzFdICogYlswXV07XG59XG5cbi8vIFRPRE8gcmV0dXJuIGFcbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW5BZGRJblBsYWNlKGEsIGIpIHtcbiAgYVswXSArPSBiWzBdLCBhWzFdICs9IGJbMV0sIGFbMl0gKz0gYlsyXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhblNjYWxlKHZlY3Rvciwgaykge1xuICByZXR1cm4gW3ZlY3RvclswXSAqIGssIHZlY3RvclsxXSAqIGssIHZlY3RvclsyXSAqIGtdO1xufVxuXG4vLyBUT0RPIHJldHVybiBkXG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShkKSB7XG4gIHZhciBsID0gc3FydChkWzBdICogZFswXSArIGRbMV0gKiBkWzFdICsgZFsyXSAqIGRbMl0pO1xuICBkWzBdIC89IGwsIGRbMV0gLz0gbCwgZFsyXSAvPSBsO1xufVxuIiwiaW1wb3J0IHtjYXJ0ZXNpYW4sIGNhcnRlc2lhbk5vcm1hbGl6ZUluUGxhY2UsIHNwaGVyaWNhbH0gZnJvbSBcIi4vY2FydGVzaWFuLmpzXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCB7YWNvcywgY29zLCBkZWdyZWVzLCBlcHNpbG9uLCByYWRpYW5zLCBzaW4sIHRhdX0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuaW1wb3J0IHtyb3RhdGVSYWRpYW5zfSBmcm9tIFwiLi9yb3RhdGlvbi5qc1wiO1xuXG4vLyBHZW5lcmF0ZXMgYSBjaXJjbGUgY2VudGVyZWQgYXQgWzDCsCwgMMKwXSwgd2l0aCBhIGdpdmVuIHJhZGl1cyBhbmQgcHJlY2lzaW9uLlxuZXhwb3J0IGZ1bmN0aW9uIGNpcmNsZVN0cmVhbShzdHJlYW0sIHJhZGl1cywgZGVsdGEsIGRpcmVjdGlvbiwgdDAsIHQxKSB7XG4gIGlmICghZGVsdGEpIHJldHVybjtcbiAgdmFyIGNvc1JhZGl1cyA9IGNvcyhyYWRpdXMpLFxuICAgICAgc2luUmFkaXVzID0gc2luKHJhZGl1cyksXG4gICAgICBzdGVwID0gZGlyZWN0aW9uICogZGVsdGE7XG4gIGlmICh0MCA9PSBudWxsKSB7XG4gICAgdDAgPSByYWRpdXMgKyBkaXJlY3Rpb24gKiB0YXU7XG4gICAgdDEgPSByYWRpdXMgLSBzdGVwIC8gMjtcbiAgfSBlbHNlIHtcbiAgICB0MCA9IGNpcmNsZVJhZGl1cyhjb3NSYWRpdXMsIHQwKTtcbiAgICB0MSA9IGNpcmNsZVJhZGl1cyhjb3NSYWRpdXMsIHQxKTtcbiAgICBpZiAoZGlyZWN0aW9uID4gMCA/IHQwIDwgdDEgOiB0MCA+IHQxKSB0MCArPSBkaXJlY3Rpb24gKiB0YXU7XG4gIH1cbiAgZm9yICh2YXIgcG9pbnQsIHQgPSB0MDsgZGlyZWN0aW9uID4gMCA/IHQgPiB0MSA6IHQgPCB0MTsgdCAtPSBzdGVwKSB7XG4gICAgcG9pbnQgPSBzcGhlcmljYWwoW2Nvc1JhZGl1cywgLXNpblJhZGl1cyAqIGNvcyh0KSwgLXNpblJhZGl1cyAqIHNpbih0KV0pO1xuICAgIHN0cmVhbS5wb2ludChwb2ludFswXSwgcG9pbnRbMV0pO1xuICB9XG59XG5cbi8vIFJldHVybnMgdGhlIHNpZ25lZCBhbmdsZSBvZiBhIGNhcnRlc2lhbiBwb2ludCByZWxhdGl2ZSB0byBbY29zUmFkaXVzLCAwLCAwXS5cbmZ1bmN0aW9uIGNpcmNsZVJhZGl1cyhjb3NSYWRpdXMsIHBvaW50KSB7XG4gIHBvaW50ID0gY2FydGVzaWFuKHBvaW50KSwgcG9pbnRbMF0gLT0gY29zUmFkaXVzO1xuICBjYXJ0ZXNpYW5Ob3JtYWxpemVJblBsYWNlKHBvaW50KTtcbiAgdmFyIHJhZGl1cyA9IGFjb3MoLXBvaW50WzFdKTtcbiAgcmV0dXJuICgoLXBvaW50WzJdIDwgMCA/IC1yYWRpdXMgOiByYWRpdXMpICsgdGF1IC0gZXBzaWxvbikgJSB0YXU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgY2VudGVyID0gY29uc3RhbnQoWzAsIDBdKSxcbiAgICAgIHJhZGl1cyA9IGNvbnN0YW50KDkwKSxcbiAgICAgIHByZWNpc2lvbiA9IGNvbnN0YW50KDYpLFxuICAgICAgcmluZyxcbiAgICAgIHJvdGF0ZSxcbiAgICAgIHN0cmVhbSA9IHtwb2ludDogcG9pbnR9O1xuXG4gIGZ1bmN0aW9uIHBvaW50KHgsIHkpIHtcbiAgICByaW5nLnB1c2goeCA9IHJvdGF0ZSh4LCB5KSk7XG4gICAgeFswXSAqPSBkZWdyZWVzLCB4WzFdICo9IGRlZ3JlZXM7XG4gIH1cblxuICBmdW5jdGlvbiBjaXJjbGUoKSB7XG4gICAgdmFyIGMgPSBjZW50ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgciA9IHJhZGl1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpICogcmFkaWFucyxcbiAgICAgICAgcCA9IHByZWNpc2lvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpICogcmFkaWFucztcbiAgICByaW5nID0gW107XG4gICAgcm90YXRlID0gcm90YXRlUmFkaWFucygtY1swXSAqIHJhZGlhbnMsIC1jWzFdICogcmFkaWFucywgMCkuaW52ZXJ0O1xuICAgIGNpcmNsZVN0cmVhbShzdHJlYW0sIHIsIHAsIDEpO1xuICAgIGMgPSB7dHlwZTogXCJQb2x5Z29uXCIsIGNvb3JkaW5hdGVzOiBbcmluZ119O1xuICAgIHJpbmcgPSByb3RhdGUgPSBudWxsO1xuICAgIHJldHVybiBjO1xuICB9XG5cbiAgY2lyY2xlLmNlbnRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjZW50ZXIgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KFsrX1swXSwgK19bMV1dKSwgY2lyY2xlKSA6IGNlbnRlcjtcbiAgfTtcblxuICBjaXJjbGUucmFkaXVzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhZGl1cyA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBjaXJjbGUpIDogcmFkaXVzO1xuICB9O1xuXG4gIGNpcmNsZS5wcmVjaXNpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocHJlY2lzaW9uID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGNpcmNsZSkgOiBwcmVjaXNpb247XG4gIH07XG5cbiAgcmV0dXJuIGNpcmNsZTtcbn1cbiIsImltcG9ydCBjbGlwIGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQge2FicywgYXRhbiwgY29zLCBlcHNpbG9uLCBoYWxmUGksIHBpLCBzaW59IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsaXAoXG4gIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgY2xpcEFudGltZXJpZGlhbkxpbmUsXG4gIGNsaXBBbnRpbWVyaWRpYW5JbnRlcnBvbGF0ZSxcbiAgWy1waSwgLWhhbGZQaV1cbik7XG5cbi8vIFRha2VzIGEgbGluZSBhbmQgY3V0cyBpbnRvIHZpc2libGUgc2VnbWVudHMuIFJldHVybiB2YWx1ZXM6IDAgLSB0aGVyZSB3ZXJlXG4vLyBpbnRlcnNlY3Rpb25zIG9yIHRoZSBsaW5lIHdhcyBlbXB0eTsgMSAtIG5vIGludGVyc2VjdGlvbnM7IDIgLSB0aGVyZSB3ZXJlXG4vLyBpbnRlcnNlY3Rpb25zLCBhbmQgdGhlIGZpcnN0IGFuZCBsYXN0IHNlZ21lbnRzIHNob3VsZCBiZSByZWpvaW5lZC5cbmZ1bmN0aW9uIGNsaXBBbnRpbWVyaWRpYW5MaW5lKHN0cmVhbSkge1xuICB2YXIgbGFtYmRhMCA9IE5hTixcbiAgICAgIHBoaTAgPSBOYU4sXG4gICAgICBzaWduMCA9IE5hTixcbiAgICAgIGNsZWFuOyAvLyBubyBpbnRlcnNlY3Rpb25zXG5cbiAgcmV0dXJuIHtcbiAgICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgY2xlYW4gPSAxO1xuICAgIH0sXG4gICAgcG9pbnQ6IGZ1bmN0aW9uKGxhbWJkYTEsIHBoaTEpIHtcbiAgICAgIHZhciBzaWduMSA9IGxhbWJkYTEgPiAwID8gcGkgOiAtcGksXG4gICAgICAgICAgZGVsdGEgPSBhYnMobGFtYmRhMSAtIGxhbWJkYTApO1xuICAgICAgaWYgKGFicyhkZWx0YSAtIHBpKSA8IGVwc2lsb24pIHsgLy8gbGluZSBjcm9zc2VzIGEgcG9sZVxuICAgICAgICBzdHJlYW0ucG9pbnQobGFtYmRhMCwgcGhpMCA9IChwaGkwICsgcGhpMSkgLyAyID4gMCA/IGhhbGZQaSA6IC1oYWxmUGkpO1xuICAgICAgICBzdHJlYW0ucG9pbnQoc2lnbjAsIHBoaTApO1xuICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgIHN0cmVhbS5wb2ludChzaWduMSwgcGhpMCk7XG4gICAgICAgIHN0cmVhbS5wb2ludChsYW1iZGExLCBwaGkwKTtcbiAgICAgICAgY2xlYW4gPSAwO1xuICAgICAgfSBlbHNlIGlmIChzaWduMCAhPT0gc2lnbjEgJiYgZGVsdGEgPj0gcGkpIHsgLy8gbGluZSBjcm9zc2VzIGFudGltZXJpZGlhblxuICAgICAgICBpZiAoYWJzKGxhbWJkYTAgLSBzaWduMCkgPCBlcHNpbG9uKSBsYW1iZGEwIC09IHNpZ24wICogZXBzaWxvbjsgLy8gaGFuZGxlIGRlZ2VuZXJhY2llc1xuICAgICAgICBpZiAoYWJzKGxhbWJkYTEgLSBzaWduMSkgPCBlcHNpbG9uKSBsYW1iZGExIC09IHNpZ24xICogZXBzaWxvbjtcbiAgICAgICAgcGhpMCA9IGNsaXBBbnRpbWVyaWRpYW5JbnRlcnNlY3QobGFtYmRhMCwgcGhpMCwgbGFtYmRhMSwgcGhpMSk7XG4gICAgICAgIHN0cmVhbS5wb2ludChzaWduMCwgcGhpMCk7XG4gICAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHNpZ24xLCBwaGkwKTtcbiAgICAgICAgY2xlYW4gPSAwO1xuICAgICAgfVxuICAgICAgc3RyZWFtLnBvaW50KGxhbWJkYTAgPSBsYW1iZGExLCBwaGkwID0gcGhpMSk7XG4gICAgICBzaWduMCA9IHNpZ24xO1xuICAgIH0sXG4gICAgbGluZUVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgbGFtYmRhMCA9IHBoaTAgPSBOYU47XG4gICAgfSxcbiAgICBjbGVhbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gMiAtIGNsZWFuOyAvLyBpZiBpbnRlcnNlY3Rpb25zLCByZWpvaW4gZmlyc3QgYW5kIGxhc3Qgc2VnbWVudHNcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsaXBBbnRpbWVyaWRpYW5JbnRlcnNlY3QobGFtYmRhMCwgcGhpMCwgbGFtYmRhMSwgcGhpMSkge1xuICB2YXIgY29zUGhpMCxcbiAgICAgIGNvc1BoaTEsXG4gICAgICBzaW5MYW1iZGEwTGFtYmRhMSA9IHNpbihsYW1iZGEwIC0gbGFtYmRhMSk7XG4gIHJldHVybiBhYnMoc2luTGFtYmRhMExhbWJkYTEpID4gZXBzaWxvblxuICAgICAgPyBhdGFuKChzaW4ocGhpMCkgKiAoY29zUGhpMSA9IGNvcyhwaGkxKSkgKiBzaW4obGFtYmRhMSlcbiAgICAgICAgICAtIHNpbihwaGkxKSAqIChjb3NQaGkwID0gY29zKHBoaTApKSAqIHNpbihsYW1iZGEwKSlcbiAgICAgICAgICAvIChjb3NQaGkwICogY29zUGhpMSAqIHNpbkxhbWJkYTBMYW1iZGExKSlcbiAgICAgIDogKHBoaTAgKyBwaGkxKSAvIDI7XG59XG5cbmZ1bmN0aW9uIGNsaXBBbnRpbWVyaWRpYW5JbnRlcnBvbGF0ZShmcm9tLCB0bywgZGlyZWN0aW9uLCBzdHJlYW0pIHtcbiAgdmFyIHBoaTtcbiAgaWYgKGZyb20gPT0gbnVsbCkge1xuICAgIHBoaSA9IGRpcmVjdGlvbiAqIGhhbGZQaTtcbiAgICBzdHJlYW0ucG9pbnQoLXBpLCBwaGkpO1xuICAgIHN0cmVhbS5wb2ludCgwLCBwaGkpO1xuICAgIHN0cmVhbS5wb2ludChwaSwgcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQocGksIDApO1xuICAgIHN0cmVhbS5wb2ludChwaSwgLXBoaSk7XG4gICAgc3RyZWFtLnBvaW50KDAsIC1waGkpO1xuICAgIHN0cmVhbS5wb2ludCgtcGksIC1waGkpO1xuICAgIHN0cmVhbS5wb2ludCgtcGksIDApO1xuICAgIHN0cmVhbS5wb2ludCgtcGksIHBoaSk7XG4gIH0gZWxzZSBpZiAoYWJzKGZyb21bMF0gLSB0b1swXSkgPiBlcHNpbG9uKSB7XG4gICAgdmFyIGxhbWJkYSA9IGZyb21bMF0gPCB0b1swXSA/IHBpIDogLXBpO1xuICAgIHBoaSA9IGRpcmVjdGlvbiAqIGxhbWJkYSAvIDI7XG4gICAgc3RyZWFtLnBvaW50KC1sYW1iZGEsIHBoaSk7XG4gICAgc3RyZWFtLnBvaW50KDAsIHBoaSk7XG4gICAgc3RyZWFtLnBvaW50KGxhbWJkYSwgcGhpKTtcbiAgfSBlbHNlIHtcbiAgICBzdHJlYW0ucG9pbnQodG9bMF0sIHRvWzFdKTtcbiAgfVxufVxuIiwiaW1wb3J0IG5vb3AgZnJvbSBcIi4uL25vb3AuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBsaW5lcyA9IFtdLFxuICAgICAgbGluZTtcbiAgcmV0dXJuIHtcbiAgICBwb2ludDogZnVuY3Rpb24oeCwgeSwgbSkge1xuICAgICAgbGluZS5wdXNoKFt4LCB5LCBtXSk7XG4gICAgfSxcbiAgICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgbGluZXMucHVzaChsaW5lID0gW10pO1xuICAgIH0sXG4gICAgbGluZUVuZDogbm9vcCxcbiAgICByZWpvaW46IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGxpbmVzLmxlbmd0aCA+IDEpIGxpbmVzLnB1c2gobGluZXMucG9wKCkuY29uY2F0KGxpbmVzLnNoaWZ0KCkpKTtcbiAgICB9LFxuICAgIHJlc3VsdDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gbGluZXM7XG4gICAgICBsaW5lcyA9IFtdO1xuICAgICAgbGluZSA9IG51bGw7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7Y2FydGVzaWFuLCBjYXJ0ZXNpYW5BZGRJblBsYWNlLCBjYXJ0ZXNpYW5Dcm9zcywgY2FydGVzaWFuRG90LCBjYXJ0ZXNpYW5TY2FsZSwgc3BoZXJpY2FsfSBmcm9tIFwiLi4vY2FydGVzaWFuLmpzXCI7XG5pbXBvcnQge2NpcmNsZVN0cmVhbX0gZnJvbSBcIi4uL2NpcmNsZS5qc1wiO1xuaW1wb3J0IHthYnMsIGNvcywgZXBzaWxvbiwgcGksIHJhZGlhbnMsIHNxcnR9IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5pbXBvcnQgcG9pbnRFcXVhbCBmcm9tIFwiLi4vcG9pbnRFcXVhbC5qc1wiO1xuaW1wb3J0IGNsaXAgZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocmFkaXVzKSB7XG4gIHZhciBjciA9IGNvcyhyYWRpdXMpLFxuICAgICAgZGVsdGEgPSA2ICogcmFkaWFucyxcbiAgICAgIHNtYWxsUmFkaXVzID0gY3IgPiAwLFxuICAgICAgbm90SGVtaXNwaGVyZSA9IGFicyhjcikgPiBlcHNpbG9uOyAvLyBUT0RPIG9wdGltaXNlIGZvciB0aGlzIGNvbW1vbiBjYXNlXG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoZnJvbSwgdG8sIGRpcmVjdGlvbiwgc3RyZWFtKSB7XG4gICAgY2lyY2xlU3RyZWFtKHN0cmVhbSwgcmFkaXVzLCBkZWx0YSwgZGlyZWN0aW9uLCBmcm9tLCB0byk7XG4gIH1cblxuICBmdW5jdGlvbiB2aXNpYmxlKGxhbWJkYSwgcGhpKSB7XG4gICAgcmV0dXJuIGNvcyhsYW1iZGEpICogY29zKHBoaSkgPiBjcjtcbiAgfVxuXG4gIC8vIFRha2VzIGEgbGluZSBhbmQgY3V0cyBpbnRvIHZpc2libGUgc2VnbWVudHMuIFJldHVybiB2YWx1ZXMgdXNlZCBmb3IgcG9seWdvblxuICAvLyBjbGlwcGluZzogMCAtIHRoZXJlIHdlcmUgaW50ZXJzZWN0aW9ucyBvciB0aGUgbGluZSB3YXMgZW1wdHk7IDEgLSBub1xuICAvLyBpbnRlcnNlY3Rpb25zIDIgLSB0aGVyZSB3ZXJlIGludGVyc2VjdGlvbnMsIGFuZCB0aGUgZmlyc3QgYW5kIGxhc3Qgc2VnbWVudHNcbiAgLy8gc2hvdWxkIGJlIHJlam9pbmVkLlxuICBmdW5jdGlvbiBjbGlwTGluZShzdHJlYW0pIHtcbiAgICB2YXIgcG9pbnQwLCAvLyBwcmV2aW91cyBwb2ludFxuICAgICAgICBjMCwgLy8gY29kZSBmb3IgcHJldmlvdXMgcG9pbnRcbiAgICAgICAgdjAsIC8vIHZpc2liaWxpdHkgb2YgcHJldmlvdXMgcG9pbnRcbiAgICAgICAgdjAwLCAvLyB2aXNpYmlsaXR5IG9mIGZpcnN0IHBvaW50XG4gICAgICAgIGNsZWFuOyAvLyBubyBpbnRlcnNlY3Rpb25zXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHYwMCA9IHYwID0gZmFsc2U7XG4gICAgICAgIGNsZWFuID0gMTtcbiAgICAgIH0sXG4gICAgICBwb2ludDogZnVuY3Rpb24obGFtYmRhLCBwaGkpIHtcbiAgICAgICAgdmFyIHBvaW50MSA9IFtsYW1iZGEsIHBoaV0sXG4gICAgICAgICAgICBwb2ludDIsXG4gICAgICAgICAgICB2ID0gdmlzaWJsZShsYW1iZGEsIHBoaSksXG4gICAgICAgICAgICBjID0gc21hbGxSYWRpdXNcbiAgICAgICAgICAgICAgPyB2ID8gMCA6IGNvZGUobGFtYmRhLCBwaGkpXG4gICAgICAgICAgICAgIDogdiA/IGNvZGUobGFtYmRhICsgKGxhbWJkYSA8IDAgPyBwaSA6IC1waSksIHBoaSkgOiAwO1xuICAgICAgICBpZiAoIXBvaW50MCAmJiAodjAwID0gdjAgPSB2KSkgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICBpZiAodiAhPT0gdjApIHtcbiAgICAgICAgICBwb2ludDIgPSBpbnRlcnNlY3QocG9pbnQwLCBwb2ludDEpO1xuICAgICAgICAgIGlmICghcG9pbnQyIHx8IHBvaW50RXF1YWwocG9pbnQwLCBwb2ludDIpIHx8IHBvaW50RXF1YWwocG9pbnQxLCBwb2ludDIpKVxuICAgICAgICAgICAgcG9pbnQxWzJdID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodiAhPT0gdjApIHtcbiAgICAgICAgICBjbGVhbiA9IDA7XG4gICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgIC8vIG91dHNpZGUgZ29pbmcgaW5cbiAgICAgICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgIHBvaW50MiA9IGludGVyc2VjdChwb2ludDEsIHBvaW50MCk7XG4gICAgICAgICAgICBzdHJlYW0ucG9pbnQocG9pbnQyWzBdLCBwb2ludDJbMV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpbnNpZGUgZ29pbmcgb3V0XG4gICAgICAgICAgICBwb2ludDIgPSBpbnRlcnNlY3QocG9pbnQwLCBwb2ludDEpO1xuICAgICAgICAgICAgc3RyZWFtLnBvaW50KHBvaW50MlswXSwgcG9pbnQyWzFdLCAyKTtcbiAgICAgICAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBvaW50MCA9IHBvaW50MjtcbiAgICAgICAgfSBlbHNlIGlmIChub3RIZW1pc3BoZXJlICYmIHBvaW50MCAmJiBzbWFsbFJhZGl1cyBeIHYpIHtcbiAgICAgICAgICB2YXIgdDtcbiAgICAgICAgICAvLyBJZiB0aGUgY29kZXMgZm9yIHR3byBwb2ludHMgYXJlIGRpZmZlcmVudCwgb3IgYXJlIGJvdGggemVybyxcbiAgICAgICAgICAvLyBhbmQgdGhlcmUgdGhpcyBzZWdtZW50IGludGVyc2VjdHMgd2l0aCB0aGUgc21hbGwgY2lyY2xlLlxuICAgICAgICAgIGlmICghKGMgJiBjMCkgJiYgKHQgPSBpbnRlcnNlY3QocG9pbnQxLCBwb2ludDAsIHRydWUpKSkge1xuICAgICAgICAgICAgY2xlYW4gPSAwO1xuICAgICAgICAgICAgaWYgKHNtYWxsUmFkaXVzKSB7XG4gICAgICAgICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgICAgc3RyZWFtLnBvaW50KHRbMF1bMF0sIHRbMF1bMV0pO1xuICAgICAgICAgICAgICBzdHJlYW0ucG9pbnQodFsxXVswXSwgdFsxXVsxXSk7XG4gICAgICAgICAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzdHJlYW0ucG9pbnQodFsxXVswXSwgdFsxXVsxXSk7XG4gICAgICAgICAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgICAgc3RyZWFtLnBvaW50KHRbMF1bMF0sIHRbMF1bMV0sIDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodiAmJiAoIXBvaW50MCB8fCAhcG9pbnRFcXVhbChwb2ludDAsIHBvaW50MSkpKSB7XG4gICAgICAgICAgc3RyZWFtLnBvaW50KHBvaW50MVswXSwgcG9pbnQxWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBwb2ludDAgPSBwb2ludDEsIHYwID0gdiwgYzAgPSBjO1xuICAgICAgfSxcbiAgICAgIGxpbmVFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodjApIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgIHBvaW50MCA9IG51bGw7XG4gICAgICB9LFxuICAgICAgLy8gUmVqb2luIGZpcnN0IGFuZCBsYXN0IHNlZ21lbnRzIGlmIHRoZXJlIHdlcmUgaW50ZXJzZWN0aW9ucyBhbmQgdGhlIGZpcnN0XG4gICAgICAvLyBhbmQgbGFzdCBwb2ludHMgd2VyZSB2aXNpYmxlLlxuICAgICAgY2xlYW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY2xlYW4gfCAoKHYwMCAmJiB2MCkgPDwgMSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIEludGVyc2VjdHMgdGhlIGdyZWF0IGNpcmNsZSBiZXR3ZWVuIGEgYW5kIGIgd2l0aCB0aGUgY2xpcCBjaXJjbGUuXG4gIGZ1bmN0aW9uIGludGVyc2VjdChhLCBiLCB0d28pIHtcbiAgICB2YXIgcGEgPSBjYXJ0ZXNpYW4oYSksXG4gICAgICAgIHBiID0gY2FydGVzaWFuKGIpO1xuXG4gICAgLy8gV2UgaGF2ZSB0d28gcGxhbmVzLCBuMS5wID0gZDEgYW5kIG4yLnAgPSBkMi5cbiAgICAvLyBGaW5kIGludGVyc2VjdGlvbiBsaW5lIHAodCkgPSBjMSBuMSArIGMyIG4yICsgdCAobjEg4qivIG4yKS5cbiAgICB2YXIgbjEgPSBbMSwgMCwgMF0sIC8vIG5vcm1hbFxuICAgICAgICBuMiA9IGNhcnRlc2lhbkNyb3NzKHBhLCBwYiksXG4gICAgICAgIG4ybjIgPSBjYXJ0ZXNpYW5Eb3QobjIsIG4yKSxcbiAgICAgICAgbjFuMiA9IG4yWzBdLCAvLyBjYXJ0ZXNpYW5Eb3QobjEsIG4yKSxcbiAgICAgICAgZGV0ZXJtaW5hbnQgPSBuMm4yIC0gbjFuMiAqIG4xbjI7XG5cbiAgICAvLyBUd28gcG9sYXIgcG9pbnRzLlxuICAgIGlmICghZGV0ZXJtaW5hbnQpIHJldHVybiAhdHdvICYmIGE7XG5cbiAgICB2YXIgYzEgPSAgY3IgKiBuMm4yIC8gZGV0ZXJtaW5hbnQsXG4gICAgICAgIGMyID0gLWNyICogbjFuMiAvIGRldGVybWluYW50LFxuICAgICAgICBuMXhuMiA9IGNhcnRlc2lhbkNyb3NzKG4xLCBuMiksXG4gICAgICAgIEEgPSBjYXJ0ZXNpYW5TY2FsZShuMSwgYzEpLFxuICAgICAgICBCID0gY2FydGVzaWFuU2NhbGUobjIsIGMyKTtcbiAgICBjYXJ0ZXNpYW5BZGRJblBsYWNlKEEsIEIpO1xuXG4gICAgLy8gU29sdmUgfHAodCl8XjIgPSAxLlxuICAgIHZhciB1ID0gbjF4bjIsXG4gICAgICAgIHcgPSBjYXJ0ZXNpYW5Eb3QoQSwgdSksXG4gICAgICAgIHV1ID0gY2FydGVzaWFuRG90KHUsIHUpLFxuICAgICAgICB0MiA9IHcgKiB3IC0gdXUgKiAoY2FydGVzaWFuRG90KEEsIEEpIC0gMSk7XG5cbiAgICBpZiAodDIgPCAwKSByZXR1cm47XG5cbiAgICB2YXIgdCA9IHNxcnQodDIpLFxuICAgICAgICBxID0gY2FydGVzaWFuU2NhbGUodSwgKC13IC0gdCkgLyB1dSk7XG4gICAgY2FydGVzaWFuQWRkSW5QbGFjZShxLCBBKTtcbiAgICBxID0gc3BoZXJpY2FsKHEpO1xuXG4gICAgaWYgKCF0d28pIHJldHVybiBxO1xuXG4gICAgLy8gVHdvIGludGVyc2VjdGlvbiBwb2ludHMuXG4gICAgdmFyIGxhbWJkYTAgPSBhWzBdLFxuICAgICAgICBsYW1iZGExID0gYlswXSxcbiAgICAgICAgcGhpMCA9IGFbMV0sXG4gICAgICAgIHBoaTEgPSBiWzFdLFxuICAgICAgICB6O1xuXG4gICAgaWYgKGxhbWJkYTEgPCBsYW1iZGEwKSB6ID0gbGFtYmRhMCwgbGFtYmRhMCA9IGxhbWJkYTEsIGxhbWJkYTEgPSB6O1xuXG4gICAgdmFyIGRlbHRhID0gbGFtYmRhMSAtIGxhbWJkYTAsXG4gICAgICAgIHBvbGFyID0gYWJzKGRlbHRhIC0gcGkpIDwgZXBzaWxvbixcbiAgICAgICAgbWVyaWRpYW4gPSBwb2xhciB8fCBkZWx0YSA8IGVwc2lsb247XG5cbiAgICBpZiAoIXBvbGFyICYmIHBoaTEgPCBwaGkwKSB6ID0gcGhpMCwgcGhpMCA9IHBoaTEsIHBoaTEgPSB6O1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgZmlyc3QgcG9pbnQgaXMgYmV0d2VlbiBhIGFuZCBiLlxuICAgIGlmIChtZXJpZGlhblxuICAgICAgICA/IHBvbGFyXG4gICAgICAgICAgPyBwaGkwICsgcGhpMSA+IDAgXiBxWzFdIDwgKGFicyhxWzBdIC0gbGFtYmRhMCkgPCBlcHNpbG9uID8gcGhpMCA6IHBoaTEpXG4gICAgICAgICAgOiBwaGkwIDw9IHFbMV0gJiYgcVsxXSA8PSBwaGkxXG4gICAgICAgIDogZGVsdGEgPiBwaSBeIChsYW1iZGEwIDw9IHFbMF0gJiYgcVswXSA8PSBsYW1iZGExKSkge1xuICAgICAgdmFyIHExID0gY2FydGVzaWFuU2NhbGUodSwgKC13ICsgdCkgLyB1dSk7XG4gICAgICBjYXJ0ZXNpYW5BZGRJblBsYWNlKHExLCBBKTtcbiAgICAgIHJldHVybiBbcSwgc3BoZXJpY2FsKHExKV07XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdGVzIGEgNC1iaXQgdmVjdG9yIHJlcHJlc2VudGluZyB0aGUgbG9jYXRpb24gb2YgYSBwb2ludCByZWxhdGl2ZSB0b1xuICAvLyB0aGUgc21hbGwgY2lyY2xlJ3MgYm91bmRpbmcgYm94LlxuICBmdW5jdGlvbiBjb2RlKGxhbWJkYSwgcGhpKSB7XG4gICAgdmFyIHIgPSBzbWFsbFJhZGl1cyA/IHJhZGl1cyA6IHBpIC0gcmFkaXVzLFxuICAgICAgICBjb2RlID0gMDtcbiAgICBpZiAobGFtYmRhIDwgLXIpIGNvZGUgfD0gMTsgLy8gbGVmdFxuICAgIGVsc2UgaWYgKGxhbWJkYSA+IHIpIGNvZGUgfD0gMjsgLy8gcmlnaHRcbiAgICBpZiAocGhpIDwgLXIpIGNvZGUgfD0gNDsgLy8gYmVsb3dcbiAgICBlbHNlIGlmIChwaGkgPiByKSBjb2RlIHw9IDg7IC8vIGFib3ZlXG4gICAgcmV0dXJuIGNvZGU7XG4gIH1cblxuICByZXR1cm4gY2xpcCh2aXNpYmxlLCBjbGlwTGluZSwgaW50ZXJwb2xhdGUsIHNtYWxsUmFkaXVzID8gWzAsIC1yYWRpdXNdIDogWy1waSwgcmFkaXVzIC0gcGldKTtcbn1cbiIsImltcG9ydCBjbGlwQnVmZmVyIGZyb20gXCIuL2J1ZmZlci5qc1wiO1xuaW1wb3J0IGNsaXBSZWpvaW4gZnJvbSBcIi4vcmVqb2luLmpzXCI7XG5pbXBvcnQge2Vwc2lsb24sIGhhbGZQaX0gZnJvbSBcIi4uL21hdGguanNcIjtcbmltcG9ydCBwb2x5Z29uQ29udGFpbnMgZnJvbSBcIi4uL3BvbHlnb25Db250YWlucy5qc1wiO1xuaW1wb3J0IHttZXJnZX0gZnJvbSBcImQzLWFycmF5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHBvaW50VmlzaWJsZSwgY2xpcExpbmUsIGludGVycG9sYXRlLCBzdGFydCkge1xuICByZXR1cm4gZnVuY3Rpb24oc2luaykge1xuICAgIHZhciBsaW5lID0gY2xpcExpbmUoc2luayksXG4gICAgICAgIHJpbmdCdWZmZXIgPSBjbGlwQnVmZmVyKCksXG4gICAgICAgIHJpbmdTaW5rID0gY2xpcExpbmUocmluZ0J1ZmZlciksXG4gICAgICAgIHBvbHlnb25TdGFydGVkID0gZmFsc2UsXG4gICAgICAgIHBvbHlnb24sXG4gICAgICAgIHNlZ21lbnRzLFxuICAgICAgICByaW5nO1xuXG4gICAgdmFyIGNsaXAgPSB7XG4gICAgICBwb2ludDogcG9pbnQsXG4gICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgIGxpbmVFbmQ6IGxpbmVFbmQsXG4gICAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGlwLnBvaW50ID0gcG9pbnRSaW5nO1xuICAgICAgICBjbGlwLmxpbmVTdGFydCA9IHJpbmdTdGFydDtcbiAgICAgICAgY2xpcC5saW5lRW5kID0gcmluZ0VuZDtcbiAgICAgICAgc2VnbWVudHMgPSBbXTtcbiAgICAgICAgcG9seWdvbiA9IFtdO1xuICAgICAgfSxcbiAgICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGlwLnBvaW50ID0gcG9pbnQ7XG4gICAgICAgIGNsaXAubGluZVN0YXJ0ID0gbGluZVN0YXJ0O1xuICAgICAgICBjbGlwLmxpbmVFbmQgPSBsaW5lRW5kO1xuICAgICAgICBzZWdtZW50cyA9IG1lcmdlKHNlZ21lbnRzKTtcbiAgICAgICAgdmFyIHN0YXJ0SW5zaWRlID0gcG9seWdvbkNvbnRhaW5zKHBvbHlnb24sIHN0YXJ0KTtcbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghcG9seWdvblN0YXJ0ZWQpIHNpbmsucG9seWdvblN0YXJ0KCksIHBvbHlnb25TdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICBjbGlwUmVqb2luKHNlZ21lbnRzLCBjb21wYXJlSW50ZXJzZWN0aW9uLCBzdGFydEluc2lkZSwgaW50ZXJwb2xhdGUsIHNpbmspO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0SW5zaWRlKSB7XG4gICAgICAgICAgaWYgKCFwb2x5Z29uU3RhcnRlZCkgc2luay5wb2x5Z29uU3RhcnQoKSwgcG9seWdvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgIHNpbmsubGluZVN0YXJ0KCk7XG4gICAgICAgICAgaW50ZXJwb2xhdGUobnVsbCwgbnVsbCwgMSwgc2luayk7XG4gICAgICAgICAgc2luay5saW5lRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvbHlnb25TdGFydGVkKSBzaW5rLnBvbHlnb25FbmQoKSwgcG9seWdvblN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2VnbWVudHMgPSBwb2x5Z29uID0gbnVsbDtcbiAgICAgIH0sXG4gICAgICBzcGhlcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzaW5rLnBvbHlnb25TdGFydCgpO1xuICAgICAgICBzaW5rLmxpbmVTdGFydCgpO1xuICAgICAgICBpbnRlcnBvbGF0ZShudWxsLCBudWxsLCAxLCBzaW5rKTtcbiAgICAgICAgc2luay5saW5lRW5kKCk7XG4gICAgICAgIHNpbmsucG9seWdvbkVuZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb2ludChsYW1iZGEsIHBoaSkge1xuICAgICAgaWYgKHBvaW50VmlzaWJsZShsYW1iZGEsIHBoaSkpIHNpbmsucG9pbnQobGFtYmRhLCBwaGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvaW50TGluZShsYW1iZGEsIHBoaSkge1xuICAgICAgbGluZS5wb2ludChsYW1iZGEsIHBoaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZVN0YXJ0KCkge1xuICAgICAgY2xpcC5wb2ludCA9IHBvaW50TGluZTtcbiAgICAgIGxpbmUubGluZVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZUVuZCgpIHtcbiAgICAgIGNsaXAucG9pbnQgPSBwb2ludDtcbiAgICAgIGxpbmUubGluZUVuZCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvaW50UmluZyhsYW1iZGEsIHBoaSkge1xuICAgICAgcmluZy5wdXNoKFtsYW1iZGEsIHBoaV0pO1xuICAgICAgcmluZ1NpbmsucG9pbnQobGFtYmRhLCBwaGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdTdGFydCgpIHtcbiAgICAgIHJpbmdTaW5rLmxpbmVTdGFydCgpO1xuICAgICAgcmluZyA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdFbmQoKSB7XG4gICAgICBwb2ludFJpbmcocmluZ1swXVswXSwgcmluZ1swXVsxXSk7XG4gICAgICByaW5nU2luay5saW5lRW5kKCk7XG5cbiAgICAgIHZhciBjbGVhbiA9IHJpbmdTaW5rLmNsZWFuKCksXG4gICAgICAgICAgcmluZ1NlZ21lbnRzID0gcmluZ0J1ZmZlci5yZXN1bHQoKSxcbiAgICAgICAgICBpLCBuID0gcmluZ1NlZ21lbnRzLmxlbmd0aCwgbSxcbiAgICAgICAgICBzZWdtZW50LFxuICAgICAgICAgIHBvaW50O1xuXG4gICAgICByaW5nLnBvcCgpO1xuICAgICAgcG9seWdvbi5wdXNoKHJpbmcpO1xuICAgICAgcmluZyA9IG51bGw7XG5cbiAgICAgIGlmICghbikgcmV0dXJuO1xuXG4gICAgICAvLyBObyBpbnRlcnNlY3Rpb25zLlxuICAgICAgaWYgKGNsZWFuICYgMSkge1xuICAgICAgICBzZWdtZW50ID0gcmluZ1NlZ21lbnRzWzBdO1xuICAgICAgICBpZiAoKG0gPSBzZWdtZW50Lmxlbmd0aCAtIDEpID4gMCkge1xuICAgICAgICAgIGlmICghcG9seWdvblN0YXJ0ZWQpIHNpbmsucG9seWdvblN0YXJ0KCksIHBvbHlnb25TdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICBzaW5rLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtOyArK2kpIHNpbmsucG9pbnQoKHBvaW50ID0gc2VnbWVudFtpXSlbMF0sIHBvaW50WzFdKTtcbiAgICAgICAgICBzaW5rLmxpbmVFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlam9pbiBjb25uZWN0ZWQgc2VnbWVudHMuXG4gICAgICAvLyBUT0RPIHJldXNlIHJpbmdCdWZmZXIucmVqb2luKCk/XG4gICAgICBpZiAobiA+IDEgJiYgY2xlYW4gJiAyKSByaW5nU2VnbWVudHMucHVzaChyaW5nU2VnbWVudHMucG9wKCkuY29uY2F0KHJpbmdTZWdtZW50cy5zaGlmdCgpKSk7XG5cbiAgICAgIHNlZ21lbnRzLnB1c2gocmluZ1NlZ21lbnRzLmZpbHRlcih2YWxpZFNlZ21lbnQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xpcDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdmFsaWRTZWdtZW50KHNlZ21lbnQpIHtcbiAgcmV0dXJuIHNlZ21lbnQubGVuZ3RoID4gMTtcbn1cblxuLy8gSW50ZXJzZWN0aW9ucyBhcmUgc29ydGVkIGFsb25nIHRoZSBjbGlwIGVkZ2UuIEZvciBib3RoIGFudGltZXJpZGlhbiBjdXR0aW5nXG4vLyBhbmQgY2lyY2xlIGNsaXBwaW5nLCB0aGUgc2FtZSBjb21wYXJpc29uIGlzIHVzZWQuXG5mdW5jdGlvbiBjb21wYXJlSW50ZXJzZWN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuICgoYSA9IGEueClbMF0gPCAwID8gYVsxXSAtIGhhbGZQaSAtIGVwc2lsb24gOiBoYWxmUGkgLSBhWzFdKVxuICAgICAgIC0gKChiID0gYi54KVswXSA8IDAgPyBiWzFdIC0gaGFsZlBpIC0gZXBzaWxvbiA6IGhhbGZQaSAtIGJbMV0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYiwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgdmFyIGF4ID0gYVswXSxcbiAgICAgIGF5ID0gYVsxXSxcbiAgICAgIGJ4ID0gYlswXSxcbiAgICAgIGJ5ID0gYlsxXSxcbiAgICAgIHQwID0gMCxcbiAgICAgIHQxID0gMSxcbiAgICAgIGR4ID0gYnggLSBheCxcbiAgICAgIGR5ID0gYnkgLSBheSxcbiAgICAgIHI7XG5cbiAgciA9IHgwIC0gYXg7XG4gIGlmICghZHggJiYgciA+IDApIHJldHVybjtcbiAgciAvPSBkeDtcbiAgaWYgKGR4IDwgMCkge1xuICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gIH0gZWxzZSBpZiAoZHggPiAwKSB7XG4gICAgaWYgKHIgPiB0MSkgcmV0dXJuO1xuICAgIGlmIChyID4gdDApIHQwID0gcjtcbiAgfVxuXG4gIHIgPSB4MSAtIGF4O1xuICBpZiAoIWR4ICYmIHIgPCAwKSByZXR1cm47XG4gIHIgLz0gZHg7XG4gIGlmIChkeCA8IDApIHtcbiAgICBpZiAociA+IHQxKSByZXR1cm47XG4gICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICB9IGVsc2UgaWYgKGR4ID4gMCkge1xuICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gIH1cblxuICByID0geTAgLSBheTtcbiAgaWYgKCFkeSAmJiByID4gMCkgcmV0dXJuO1xuICByIC89IGR5O1xuICBpZiAoZHkgPCAwKSB7XG4gICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgIGlmIChyIDwgdDEpIHQxID0gcjtcbiAgfSBlbHNlIGlmIChkeSA+IDApIHtcbiAgICBpZiAociA+IHQxKSByZXR1cm47XG4gICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICB9XG5cbiAgciA9IHkxIC0gYXk7XG4gIGlmICghZHkgJiYgciA8IDApIHJldHVybjtcbiAgciAvPSBkeTtcbiAgaWYgKGR5IDwgMCkge1xuICAgIGlmIChyID4gdDEpIHJldHVybjtcbiAgICBpZiAociA+IHQwKSB0MCA9IHI7XG4gIH0gZWxzZSBpZiAoZHkgPiAwKSB7XG4gICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgIGlmIChyIDwgdDEpIHQxID0gcjtcbiAgfVxuXG4gIGlmICh0MCA+IDApIGFbMF0gPSBheCArIHQwICogZHgsIGFbMV0gPSBheSArIHQwICogZHk7XG4gIGlmICh0MSA8IDEpIGJbMF0gPSBheCArIHQxICogZHgsIGJbMV0gPSBheSArIHQxICogZHk7XG4gIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHthYnMsIGVwc2lsb259IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5pbXBvcnQgY2xpcEJ1ZmZlciBmcm9tIFwiLi9idWZmZXIuanNcIjtcbmltcG9ydCBjbGlwTGluZSBmcm9tIFwiLi9saW5lLmpzXCI7XG5pbXBvcnQgY2xpcFJlam9pbiBmcm9tIFwiLi9yZWpvaW4uanNcIjtcbmltcG9ydCB7bWVyZ2V9IGZyb20gXCJkMy1hcnJheVwiO1xuXG52YXIgY2xpcE1heCA9IDFlOSwgY2xpcE1pbiA9IC1jbGlwTWF4O1xuXG4vLyBUT0RPIFVzZSBkMy1wb2x5Z29u4oCZcyBwb2x5Z29uQ29udGFpbnMgaGVyZSBmb3IgdGhlIHJpbmcgY2hlY2s/XG4vLyBUT0RPIEVsaW1pbmF0ZSBkdXBsaWNhdGUgYnVmZmVyaW5nIGluIGNsaXBCdWZmZXIgYW5kIHBvbHlnb24ucHVzaD9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xpcFJlY3RhbmdsZSh4MCwgeTAsIHgxLCB5MSkge1xuXG4gIGZ1bmN0aW9uIHZpc2libGUoeCwgeSkge1xuICAgIHJldHVybiB4MCA8PSB4ICYmIHggPD0geDEgJiYgeTAgPD0geSAmJiB5IDw9IHkxO1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoZnJvbSwgdG8sIGRpcmVjdGlvbiwgc3RyZWFtKSB7XG4gICAgdmFyIGEgPSAwLCBhMSA9IDA7XG4gICAgaWYgKGZyb20gPT0gbnVsbFxuICAgICAgICB8fCAoYSA9IGNvcm5lcihmcm9tLCBkaXJlY3Rpb24pKSAhPT0gKGExID0gY29ybmVyKHRvLCBkaXJlY3Rpb24pKVxuICAgICAgICB8fCBjb21wYXJlUG9pbnQoZnJvbSwgdG8pIDwgMCBeIGRpcmVjdGlvbiA+IDApIHtcbiAgICAgIGRvIHN0cmVhbS5wb2ludChhID09PSAwIHx8IGEgPT09IDMgPyB4MCA6IHgxLCBhID4gMSA/IHkxIDogeTApO1xuICAgICAgd2hpbGUgKChhID0gKGEgKyBkaXJlY3Rpb24gKyA0KSAlIDQpICE9PSBhMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmVhbS5wb2ludCh0b1swXSwgdG9bMV0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvcm5lcihwLCBkaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gYWJzKHBbMF0gLSB4MCkgPCBlcHNpbG9uID8gZGlyZWN0aW9uID4gMCA/IDAgOiAzXG4gICAgICAgIDogYWJzKHBbMF0gLSB4MSkgPCBlcHNpbG9uID8gZGlyZWN0aW9uID4gMCA/IDIgOiAxXG4gICAgICAgIDogYWJzKHBbMV0gLSB5MCkgPCBlcHNpbG9uID8gZGlyZWN0aW9uID4gMCA/IDEgOiAwXG4gICAgICAgIDogZGlyZWN0aW9uID4gMCA/IDMgOiAyOyAvLyBhYnMocFsxXSAtIHkxKSA8IGVwc2lsb25cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBhcmVJbnRlcnNlY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBjb21wYXJlUG9pbnQoYS54LCBiLngpO1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcGFyZVBvaW50KGEsIGIpIHtcbiAgICB2YXIgY2EgPSBjb3JuZXIoYSwgMSksXG4gICAgICAgIGNiID0gY29ybmVyKGIsIDEpO1xuICAgIHJldHVybiBjYSAhPT0gY2IgPyBjYSAtIGNiXG4gICAgICAgIDogY2EgPT09IDAgPyBiWzFdIC0gYVsxXVxuICAgICAgICA6IGNhID09PSAxID8gYVswXSAtIGJbMF1cbiAgICAgICAgOiBjYSA9PT0gMiA/IGFbMV0gLSBiWzFdXG4gICAgICAgIDogYlswXSAtIGFbMF07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgdmFyIGFjdGl2ZVN0cmVhbSA9IHN0cmVhbSxcbiAgICAgICAgYnVmZmVyU3RyZWFtID0gY2xpcEJ1ZmZlcigpLFxuICAgICAgICBzZWdtZW50cyxcbiAgICAgICAgcG9seWdvbixcbiAgICAgICAgcmluZyxcbiAgICAgICAgeF9fLCB5X18sIHZfXywgLy8gZmlyc3QgcG9pbnRcbiAgICAgICAgeF8sIHlfLCB2XywgLy8gcHJldmlvdXMgcG9pbnRcbiAgICAgICAgZmlyc3QsXG4gICAgICAgIGNsZWFuO1xuXG4gICAgdmFyIGNsaXBTdHJlYW0gPSB7XG4gICAgICBwb2ludDogcG9pbnQsXG4gICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgIGxpbmVFbmQ6IGxpbmVFbmQsXG4gICAgICBwb2x5Z29uU3RhcnQ6IHBvbHlnb25TdGFydCxcbiAgICAgIHBvbHlnb25FbmQ6IHBvbHlnb25FbmRcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgICAgaWYgKHZpc2libGUoeCwgeSkpIGFjdGl2ZVN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb2x5Z29uSW5zaWRlKCkge1xuICAgICAgdmFyIHdpbmRpbmcgPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IHBvbHlnb24ubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGZvciAodmFyIHJpbmcgPSBwb2x5Z29uW2ldLCBqID0gMSwgbSA9IHJpbmcubGVuZ3RoLCBwb2ludCA9IHJpbmdbMF0sIGEwLCBhMSwgYjAgPSBwb2ludFswXSwgYjEgPSBwb2ludFsxXTsgaiA8IG07ICsraikge1xuICAgICAgICAgIGEwID0gYjAsIGExID0gYjEsIHBvaW50ID0gcmluZ1tqXSwgYjAgPSBwb2ludFswXSwgYjEgPSBwb2ludFsxXTtcbiAgICAgICAgICBpZiAoYTEgPD0geTEpIHsgaWYgKGIxID4geTEgJiYgKGIwIC0gYTApICogKHkxIC0gYTEpID4gKGIxIC0gYTEpICogKHgwIC0gYTApKSArK3dpbmRpbmc7IH1cbiAgICAgICAgICBlbHNlIHsgaWYgKGIxIDw9IHkxICYmIChiMCAtIGEwKSAqICh5MSAtIGExKSA8IChiMSAtIGExKSAqICh4MCAtIGEwKSkgLS13aW5kaW5nOyB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdpbmRpbmc7XG4gICAgfVxuXG4gICAgLy8gQnVmZmVyIGdlb21ldHJ5IHdpdGhpbiBhIHBvbHlnb24gYW5kIHRoZW4gY2xpcCBpdCBlbiBtYXNzZS5cbiAgICBmdW5jdGlvbiBwb2x5Z29uU3RhcnQoKSB7XG4gICAgICBhY3RpdmVTdHJlYW0gPSBidWZmZXJTdHJlYW0sIHNlZ21lbnRzID0gW10sIHBvbHlnb24gPSBbXSwgY2xlYW4gPSB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvbHlnb25FbmQoKSB7XG4gICAgICB2YXIgc3RhcnRJbnNpZGUgPSBwb2x5Z29uSW5zaWRlKCksXG4gICAgICAgICAgY2xlYW5JbnNpZGUgPSBjbGVhbiAmJiBzdGFydEluc2lkZSxcbiAgICAgICAgICB2aXNpYmxlID0gKHNlZ21lbnRzID0gbWVyZ2Uoc2VnbWVudHMpKS5sZW5ndGg7XG4gICAgICBpZiAoY2xlYW5JbnNpZGUgfHwgdmlzaWJsZSkge1xuICAgICAgICBzdHJlYW0ucG9seWdvblN0YXJ0KCk7XG4gICAgICAgIGlmIChjbGVhbkluc2lkZSkge1xuICAgICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgICBpbnRlcnBvbGF0ZShudWxsLCBudWxsLCAxLCBzdHJlYW0pO1xuICAgICAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpc2libGUpIHtcbiAgICAgICAgICBjbGlwUmVqb2luKHNlZ21lbnRzLCBjb21wYXJlSW50ZXJzZWN0aW9uLCBzdGFydEluc2lkZSwgaW50ZXJwb2xhdGUsIHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RyZWFtLnBvbHlnb25FbmQoKTtcbiAgICAgIH1cbiAgICAgIGFjdGl2ZVN0cmVhbSA9IHN0cmVhbSwgc2VnbWVudHMgPSBwb2x5Z29uID0gcmluZyA9IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZVN0YXJ0KCkge1xuICAgICAgY2xpcFN0cmVhbS5wb2ludCA9IGxpbmVQb2ludDtcbiAgICAgIGlmIChwb2x5Z29uKSBwb2x5Z29uLnB1c2gocmluZyA9IFtdKTtcbiAgICAgIGZpcnN0ID0gdHJ1ZTtcbiAgICAgIHZfID0gZmFsc2U7XG4gICAgICB4XyA9IHlfID0gTmFOO1xuICAgIH1cblxuICAgIC8vIFRPRE8gcmF0aGVyIHRoYW4gc3BlY2lhbC1jYXNlIHBvbHlnb25zLCBzaW1wbHkgaGFuZGxlIHRoZW0gc2VwYXJhdGVseS5cbiAgICAvLyBJZGVhbGx5LCBjb2luY2lkZW50IGludGVyc2VjdGlvbiBwb2ludHMgc2hvdWxkIGJlIGppdHRlcmVkIHRvIGF2b2lkXG4gICAgLy8gY2xpcHBpbmcgaXNzdWVzLlxuICAgIGZ1bmN0aW9uIGxpbmVFbmQoKSB7XG4gICAgICBpZiAoc2VnbWVudHMpIHtcbiAgICAgICAgbGluZVBvaW50KHhfXywgeV9fKTtcbiAgICAgICAgaWYgKHZfXyAmJiB2XykgYnVmZmVyU3RyZWFtLnJlam9pbigpO1xuICAgICAgICBzZWdtZW50cy5wdXNoKGJ1ZmZlclN0cmVhbS5yZXN1bHQoKSk7XG4gICAgICB9XG4gICAgICBjbGlwU3RyZWFtLnBvaW50ID0gcG9pbnQ7XG4gICAgICBpZiAodl8pIGFjdGl2ZVN0cmVhbS5saW5lRW5kKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZVBvaW50KHgsIHkpIHtcbiAgICAgIHZhciB2ID0gdmlzaWJsZSh4LCB5KTtcbiAgICAgIGlmIChwb2x5Z29uKSByaW5nLnB1c2goW3gsIHldKTtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICB4X18gPSB4LCB5X18gPSB5LCB2X18gPSB2O1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgICBpZiAodikge1xuICAgICAgICAgIGFjdGl2ZVN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgICBhY3RpdmVTdHJlYW0ucG9pbnQoeCwgeSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2ICYmIHZfKSBhY3RpdmVTdHJlYW0ucG9pbnQoeCwgeSk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBhID0gW3hfID0gTWF0aC5tYXgoY2xpcE1pbiwgTWF0aC5taW4oY2xpcE1heCwgeF8pKSwgeV8gPSBNYXRoLm1heChjbGlwTWluLCBNYXRoLm1pbihjbGlwTWF4LCB5XykpXSxcbiAgICAgICAgICAgICAgYiA9IFt4ID0gTWF0aC5tYXgoY2xpcE1pbiwgTWF0aC5taW4oY2xpcE1heCwgeCkpLCB5ID0gTWF0aC5tYXgoY2xpcE1pbiwgTWF0aC5taW4oY2xpcE1heCwgeSkpXTtcbiAgICAgICAgICBpZiAoY2xpcExpbmUoYSwgYiwgeDAsIHkwLCB4MSwgeTEpKSB7XG4gICAgICAgICAgICBpZiAoIXZfKSB7XG4gICAgICAgICAgICAgIGFjdGl2ZVN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgICAgYWN0aXZlU3RyZWFtLnBvaW50KGFbMF0sIGFbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWN0aXZlU3RyZWFtLnBvaW50KGJbMF0sIGJbMV0pO1xuICAgICAgICAgICAgaWYgKCF2KSBhY3RpdmVTdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICAgICAgY2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHYpIHtcbiAgICAgICAgICAgIGFjdGl2ZVN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgIGFjdGl2ZVN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICAgICAgICAgIGNsZWFuID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB4XyA9IHgsIHlfID0geSwgdl8gPSB2O1xuICAgIH1cblxuICAgIHJldHVybiBjbGlwU3RyZWFtO1xuICB9O1xufVxuIiwiaW1wb3J0IHBvaW50RXF1YWwgZnJvbSBcIi4uL3BvaW50RXF1YWwuanNcIjtcbmltcG9ydCB7ZXBzaWxvbn0gZnJvbSBcIi4uL21hdGguanNcIjtcblxuZnVuY3Rpb24gSW50ZXJzZWN0aW9uKHBvaW50LCBwb2ludHMsIG90aGVyLCBlbnRyeSkge1xuICB0aGlzLnggPSBwb2ludDtcbiAgdGhpcy56ID0gcG9pbnRzO1xuICB0aGlzLm8gPSBvdGhlcjsgLy8gYW5vdGhlciBpbnRlcnNlY3Rpb25cbiAgdGhpcy5lID0gZW50cnk7IC8vIGlzIGFuIGVudHJ5P1xuICB0aGlzLnYgPSBmYWxzZTsgLy8gdmlzaXRlZFxuICB0aGlzLm4gPSB0aGlzLnAgPSBudWxsOyAvLyBuZXh0ICYgcHJldmlvdXNcbn1cblxuLy8gQSBnZW5lcmFsaXplZCBwb2x5Z29uIGNsaXBwaW5nIGFsZ29yaXRobTogZ2l2ZW4gYSBwb2x5Z29uIHRoYXQgaGFzIGJlZW4gY3V0XG4vLyBpbnRvIGl0cyB2aXNpYmxlIGxpbmUgc2VnbWVudHMsIGFuZCByZWpvaW5zIHRoZSBzZWdtZW50cyBieSBpbnRlcnBvbGF0aW5nXG4vLyBhbG9uZyB0aGUgY2xpcCBlZGdlLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VnbWVudHMsIGNvbXBhcmVJbnRlcnNlY3Rpb24sIHN0YXJ0SW5zaWRlLCBpbnRlcnBvbGF0ZSwgc3RyZWFtKSB7XG4gIHZhciBzdWJqZWN0ID0gW10sXG4gICAgICBjbGlwID0gW10sXG4gICAgICBpLFxuICAgICAgbjtcblxuICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHNlZ21lbnQpIHtcbiAgICBpZiAoKG4gPSBzZWdtZW50Lmxlbmd0aCAtIDEpIDw9IDApIHJldHVybjtcbiAgICB2YXIgbiwgcDAgPSBzZWdtZW50WzBdLCBwMSA9IHNlZ21lbnRbbl0sIHg7XG5cbiAgICBpZiAocG9pbnRFcXVhbChwMCwgcDEpKSB7XG4gICAgICBpZiAoIXAwWzJdICYmICFwMVsyXSkge1xuICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHN0cmVhbS5wb2ludCgocDAgPSBzZWdtZW50W2ldKVswXSwgcDBbMV0pO1xuICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBoYW5kbGUgZGVnZW5lcmF0ZSBjYXNlcyBieSBtb3ZpbmcgdGhlIHBvaW50XG4gICAgICBwMVswXSArPSAyICogZXBzaWxvbjtcbiAgICB9XG5cbiAgICBzdWJqZWN0LnB1c2goeCA9IG5ldyBJbnRlcnNlY3Rpb24ocDAsIHNlZ21lbnQsIG51bGwsIHRydWUpKTtcbiAgICBjbGlwLnB1c2goeC5vID0gbmV3IEludGVyc2VjdGlvbihwMCwgbnVsbCwgeCwgZmFsc2UpKTtcbiAgICBzdWJqZWN0LnB1c2goeCA9IG5ldyBJbnRlcnNlY3Rpb24ocDEsIHNlZ21lbnQsIG51bGwsIGZhbHNlKSk7XG4gICAgY2xpcC5wdXNoKHgubyA9IG5ldyBJbnRlcnNlY3Rpb24ocDEsIG51bGwsIHgsIHRydWUpKTtcbiAgfSk7XG5cbiAgaWYgKCFzdWJqZWN0Lmxlbmd0aCkgcmV0dXJuO1xuXG4gIGNsaXAuc29ydChjb21wYXJlSW50ZXJzZWN0aW9uKTtcbiAgbGluayhzdWJqZWN0KTtcbiAgbGluayhjbGlwKTtcblxuICBmb3IgKGkgPSAwLCBuID0gY2xpcC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICBjbGlwW2ldLmUgPSBzdGFydEluc2lkZSA9ICFzdGFydEluc2lkZTtcbiAgfVxuXG4gIHZhciBzdGFydCA9IHN1YmplY3RbMF0sXG4gICAgICBwb2ludHMsXG4gICAgICBwb2ludDtcblxuICB3aGlsZSAoMSkge1xuICAgIC8vIEZpbmQgZmlyc3QgdW52aXNpdGVkIGludGVyc2VjdGlvbi5cbiAgICB2YXIgY3VycmVudCA9IHN0YXJ0LFxuICAgICAgICBpc1N1YmplY3QgPSB0cnVlO1xuICAgIHdoaWxlIChjdXJyZW50LnYpIGlmICgoY3VycmVudCA9IGN1cnJlbnQubikgPT09IHN0YXJ0KSByZXR1cm47XG4gICAgcG9pbnRzID0gY3VycmVudC56O1xuICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICBkbyB7XG4gICAgICBjdXJyZW50LnYgPSBjdXJyZW50Lm8udiA9IHRydWU7XG4gICAgICBpZiAoY3VycmVudC5lKSB7XG4gICAgICAgIGlmIChpc1N1YmplY3QpIHtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBuID0gcG9pbnRzLmxlbmd0aDsgaSA8IG47ICsraSkgc3RyZWFtLnBvaW50KChwb2ludCA9IHBvaW50c1tpXSlbMF0sIHBvaW50WzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnRlcnBvbGF0ZShjdXJyZW50LngsIGN1cnJlbnQubi54LCAxLCBzdHJlYW0pO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNTdWJqZWN0KSB7XG4gICAgICAgICAgcG9pbnRzID0gY3VycmVudC5wLno7XG4gICAgICAgICAgZm9yIChpID0gcG9pbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSBzdHJlYW0ucG9pbnQoKHBvaW50ID0gcG9pbnRzW2ldKVswXSwgcG9pbnRbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGludGVycG9sYXRlKGN1cnJlbnQueCwgY3VycmVudC5wLngsIC0xLCBzdHJlYW0pO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnA7XG4gICAgICB9XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5vO1xuICAgICAgcG9pbnRzID0gY3VycmVudC56O1xuICAgICAgaXNTdWJqZWN0ID0gIWlzU3ViamVjdDtcbiAgICB9IHdoaWxlICghY3VycmVudC52KTtcbiAgICBzdHJlYW0ubGluZUVuZCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxpbmsoYXJyYXkpIHtcbiAgaWYgKCEobiA9IGFycmF5Lmxlbmd0aCkpIHJldHVybjtcbiAgdmFyIG4sXG4gICAgICBpID0gMCxcbiAgICAgIGEgPSBhcnJheVswXSxcbiAgICAgIGI7XG4gIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgYS5uID0gYiA9IGFycmF5W2ldO1xuICAgIGIucCA9IGE7XG4gICAgYSA9IGI7XG4gIH1cbiAgYS5uID0gYiA9IGFycmF5WzBdO1xuICBiLnAgPSBhO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuXG4gIGZ1bmN0aW9uIGNvbXBvc2UoeCwgeSkge1xuICAgIHJldHVybiB4ID0gYSh4LCB5KSwgYih4WzBdLCB4WzFdKTtcbiAgfVxuXG4gIGlmIChhLmludmVydCAmJiBiLmludmVydCkgY29tcG9zZS5pbnZlcnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgcmV0dXJuIHggPSBiLmludmVydCh4LCB5KSwgeCAmJiBhLmludmVydCh4WzBdLCB4WzFdKTtcbiAgfTtcblxuICByZXR1cm4gY29tcG9zZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgeCA9PiB4O1xuIiwiZXhwb3J0IHZhciBlcHNpbG9uID0gMWUtNjtcbmV4cG9ydCB2YXIgZXBzaWxvbjIgPSAxZS0xMjtcbmV4cG9ydCB2YXIgcGkgPSBNYXRoLlBJO1xuZXhwb3J0IHZhciBoYWxmUGkgPSBwaSAvIDI7XG5leHBvcnQgdmFyIHF1YXJ0ZXJQaSA9IHBpIC8gNDtcbmV4cG9ydCB2YXIgdGF1ID0gcGkgKiAyO1xuXG5leHBvcnQgdmFyIGRlZ3JlZXMgPSAxODAgLyBwaTtcbmV4cG9ydCB2YXIgcmFkaWFucyA9IHBpIC8gMTgwO1xuXG5leHBvcnQgdmFyIGFicyA9IE1hdGguYWJzO1xuZXhwb3J0IHZhciBhdGFuID0gTWF0aC5hdGFuO1xuZXhwb3J0IHZhciBhdGFuMiA9IE1hdGguYXRhbjI7XG5leHBvcnQgdmFyIGNvcyA9IE1hdGguY29zO1xuZXhwb3J0IHZhciBjZWlsID0gTWF0aC5jZWlsO1xuZXhwb3J0IHZhciBleHAgPSBNYXRoLmV4cDtcbmV4cG9ydCB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuZXhwb3J0IHZhciBoeXBvdCA9IE1hdGguaHlwb3Q7XG5leHBvcnQgdmFyIGxvZyA9IE1hdGgubG9nO1xuZXhwb3J0IHZhciBwb3cgPSBNYXRoLnBvdztcbmV4cG9ydCB2YXIgc2luID0gTWF0aC5zaW47XG5leHBvcnQgdmFyIHNpZ24gPSBNYXRoLnNpZ24gfHwgZnVuY3Rpb24oeCkgeyByZXR1cm4geCA+IDAgPyAxIDogeCA8IDAgPyAtMSA6IDA7IH07XG5leHBvcnQgdmFyIHNxcnQgPSBNYXRoLnNxcnQ7XG5leHBvcnQgdmFyIHRhbiA9IE1hdGgudGFuO1xuXG5leHBvcnQgZnVuY3Rpb24gYWNvcyh4KSB7XG4gIHJldHVybiB4ID4gMSA/IDAgOiB4IDwgLTEgPyBwaSA6IE1hdGguYWNvcyh4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzaW4oeCkge1xuICByZXR1cm4geCA+IDEgPyBoYWxmUGkgOiB4IDwgLTEgPyAtaGFsZlBpIDogTWF0aC5hc2luKHgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGF2ZXJzaW4oeCkge1xuICByZXR1cm4gKHggPSBzaW4oeCAvIDIpKSAqIHg7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub29wKCkge31cbiIsImltcG9ydCBub29wIGZyb20gXCIuLi9ub29wLmpzXCI7XG5cbnZhciB4MCA9IEluZmluaXR5LFxuICAgIHkwID0geDAsXG4gICAgeDEgPSAteDAsXG4gICAgeTEgPSB4MTtcblxudmFyIGJvdW5kc1N0cmVhbSA9IHtcbiAgcG9pbnQ6IGJvdW5kc1BvaW50LFxuICBsaW5lU3RhcnQ6IG5vb3AsXG4gIGxpbmVFbmQ6IG5vb3AsXG4gIHBvbHlnb25TdGFydDogbm9vcCxcbiAgcG9seWdvbkVuZDogbm9vcCxcbiAgcmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYm91bmRzID0gW1t4MCwgeTBdLCBbeDEsIHkxXV07XG4gICAgeDEgPSB5MSA9IC0oeTAgPSB4MCA9IEluZmluaXR5KTtcbiAgICByZXR1cm4gYm91bmRzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBib3VuZHNQb2ludCh4LCB5KSB7XG4gIGlmICh4IDwgeDApIHgwID0geDtcbiAgaWYgKHggPiB4MSkgeDEgPSB4O1xuICBpZiAoeSA8IHkwKSB5MCA9IHk7XG4gIGlmICh5ID4geTEpIHkxID0geTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYm91bmRzU3RyZWFtO1xuIiwiaW1wb3J0IHthYnMsIGVwc2lsb259IGZyb20gXCIuL21hdGguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYWJzKGFbMF0gLSBiWzBdKSA8IGVwc2lsb24gJiYgYWJzKGFbMV0gLSBiWzFdKSA8IGVwc2lsb247XG59XG4iLCJpbXBvcnQge0FkZGVyfSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7Y2FydGVzaWFuLCBjYXJ0ZXNpYW5Dcm9zcywgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZX0gZnJvbSBcIi4vY2FydGVzaWFuLmpzXCI7XG5pbXBvcnQge2FicywgYXNpbiwgYXRhbjIsIGNvcywgZXBzaWxvbiwgZXBzaWxvbjIsIGhhbGZQaSwgcGksIHF1YXJ0ZXJQaSwgc2lnbiwgc2luLCB0YXV9IGZyb20gXCIuL21hdGguanNcIjtcblxuZnVuY3Rpb24gbG9uZ2l0dWRlKHBvaW50KSB7XG4gIHJldHVybiBhYnMocG9pbnRbMF0pIDw9IHBpID8gcG9pbnRbMF0gOiBzaWduKHBvaW50WzBdKSAqICgoYWJzKHBvaW50WzBdKSArIHBpKSAlIHRhdSAtIHBpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocG9seWdvbiwgcG9pbnQpIHtcbiAgdmFyIGxhbWJkYSA9IGxvbmdpdHVkZShwb2ludCksXG4gICAgICBwaGkgPSBwb2ludFsxXSxcbiAgICAgIHNpblBoaSA9IHNpbihwaGkpLFxuICAgICAgbm9ybWFsID0gW3NpbihsYW1iZGEpLCAtY29zKGxhbWJkYSksIDBdLFxuICAgICAgYW5nbGUgPSAwLFxuICAgICAgd2luZGluZyA9IDA7XG5cbiAgdmFyIHN1bSA9IG5ldyBBZGRlcigpO1xuXG4gIGlmIChzaW5QaGkgPT09IDEpIHBoaSA9IGhhbGZQaSArIGVwc2lsb247XG4gIGVsc2UgaWYgKHNpblBoaSA9PT0gLTEpIHBoaSA9IC1oYWxmUGkgLSBlcHNpbG9uO1xuXG4gIGZvciAodmFyIGkgPSAwLCBuID0gcG9seWdvbi5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoIShtID0gKHJpbmcgPSBwb2x5Z29uW2ldKS5sZW5ndGgpKSBjb250aW51ZTtcbiAgICB2YXIgcmluZyxcbiAgICAgICAgbSxcbiAgICAgICAgcG9pbnQwID0gcmluZ1ttIC0gMV0sXG4gICAgICAgIGxhbWJkYTAgPSBsb25naXR1ZGUocG9pbnQwKSxcbiAgICAgICAgcGhpMCA9IHBvaW50MFsxXSAvIDIgKyBxdWFydGVyUGksXG4gICAgICAgIHNpblBoaTAgPSBzaW4ocGhpMCksXG4gICAgICAgIGNvc1BoaTAgPSBjb3MocGhpMCk7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG07ICsraiwgbGFtYmRhMCA9IGxhbWJkYTEsIHNpblBoaTAgPSBzaW5QaGkxLCBjb3NQaGkwID0gY29zUGhpMSwgcG9pbnQwID0gcG9pbnQxKSB7XG4gICAgICB2YXIgcG9pbnQxID0gcmluZ1tqXSxcbiAgICAgICAgICBsYW1iZGExID0gbG9uZ2l0dWRlKHBvaW50MSksXG4gICAgICAgICAgcGhpMSA9IHBvaW50MVsxXSAvIDIgKyBxdWFydGVyUGksXG4gICAgICAgICAgc2luUGhpMSA9IHNpbihwaGkxKSxcbiAgICAgICAgICBjb3NQaGkxID0gY29zKHBoaTEpLFxuICAgICAgICAgIGRlbHRhID0gbGFtYmRhMSAtIGxhbWJkYTAsXG4gICAgICAgICAgc2lnbiA9IGRlbHRhID49IDAgPyAxIDogLTEsXG4gICAgICAgICAgYWJzRGVsdGEgPSBzaWduICogZGVsdGEsXG4gICAgICAgICAgYW50aW1lcmlkaWFuID0gYWJzRGVsdGEgPiBwaSxcbiAgICAgICAgICBrID0gc2luUGhpMCAqIHNpblBoaTE7XG5cbiAgICAgIHN1bS5hZGQoYXRhbjIoayAqIHNpZ24gKiBzaW4oYWJzRGVsdGEpLCBjb3NQaGkwICogY29zUGhpMSArIGsgKiBjb3MoYWJzRGVsdGEpKSk7XG4gICAgICBhbmdsZSArPSBhbnRpbWVyaWRpYW4gPyBkZWx0YSArIHNpZ24gKiB0YXUgOiBkZWx0YTtcblxuICAgICAgLy8gQXJlIHRoZSBsb25naXR1ZGVzIGVpdGhlciBzaWRlIG9mIHRoZSBwb2ludOKAmXMgbWVyaWRpYW4gKGxhbWJkYSksXG4gICAgICAvLyBhbmQgYXJlIHRoZSBsYXRpdHVkZXMgc21hbGxlciB0aGFuIHRoZSBwYXJhbGxlbCAocGhpKT9cbiAgICAgIGlmIChhbnRpbWVyaWRpYW4gXiBsYW1iZGEwID49IGxhbWJkYSBeIGxhbWJkYTEgPj0gbGFtYmRhKSB7XG4gICAgICAgIHZhciBhcmMgPSBjYXJ0ZXNpYW5Dcm9zcyhjYXJ0ZXNpYW4ocG9pbnQwKSwgY2FydGVzaWFuKHBvaW50MSkpO1xuICAgICAgICBjYXJ0ZXNpYW5Ob3JtYWxpemVJblBsYWNlKGFyYyk7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjYXJ0ZXNpYW5Dcm9zcyhub3JtYWwsIGFyYyk7XG4gICAgICAgIGNhcnRlc2lhbk5vcm1hbGl6ZUluUGxhY2UoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgdmFyIHBoaUFyYyA9IChhbnRpbWVyaWRpYW4gXiBkZWx0YSA+PSAwID8gLTEgOiAxKSAqIGFzaW4oaW50ZXJzZWN0aW9uWzJdKTtcbiAgICAgICAgaWYgKHBoaSA+IHBoaUFyYyB8fCBwaGkgPT09IHBoaUFyYyAmJiAoYXJjWzBdIHx8IGFyY1sxXSkpIHtcbiAgICAgICAgICB3aW5kaW5nICs9IGFudGltZXJpZGlhbiBeIGRlbHRhID49IDAgPyAxIDogLTE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBGaXJzdCwgZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIFNvdXRoIHBvbGUgaXMgaW5zaWRlIG9yIG91dHNpZGU6XG4gIC8vXG4gIC8vIEl0IGlzIGluc2lkZSBpZjpcbiAgLy8gKiB0aGUgcG9seWdvbiB3aW5kcyBhcm91bmQgaXQgaW4gYSBjbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAvLyAqIHRoZSBwb2x5Z29uIGRvZXMgbm90IChjdW11bGF0aXZlbHkpIHdpbmQgYXJvdW5kIGl0LCBidXQgaGFzIGEgbmVnYXRpdmVcbiAgLy8gICAoY291bnRlci1jbG9ja3dpc2UpIGFyZWEuXG4gIC8vXG4gIC8vIFNlY29uZCwgY291bnQgdGhlIChzaWduZWQpIG51bWJlciBvZiB0aW1lcyBhIHNlZ21lbnQgY3Jvc3NlcyBhIGxhbWJkYVxuICAvLyBmcm9tIHRoZSBwb2ludCB0byB0aGUgU291dGggcG9sZS4gIElmIGl0IGlzIHplcm8sIHRoZW4gdGhlIHBvaW50IGlzIHRoZVxuICAvLyBzYW1lIHNpZGUgYXMgdGhlIFNvdXRoIHBvbGUuXG5cbiAgcmV0dXJuIChhbmdsZSA8IC1lcHNpbG9uIHx8IGFuZ2xlIDwgZXBzaWxvbiAmJiBzdW0gPCAtZXBzaWxvbjIpIF4gKHdpbmRpbmcgJiAxKTtcbn1cbiIsImltcG9ydCB7YXNpbiwgYXRhbjIsIGNvcywgc2luLCBzcXJ0fSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gYXppbXV0aGFsUmF3KHNjYWxlKSB7XG4gIHJldHVybiBmdW5jdGlvbih4LCB5KSB7XG4gICAgdmFyIGN4ID0gY29zKHgpLFxuICAgICAgICBjeSA9IGNvcyh5KSxcbiAgICAgICAgayA9IHNjYWxlKGN4ICogY3kpO1xuICAgICAgICBpZiAoayA9PT0gSW5maW5pdHkpIHJldHVybiBbMiwgMF07XG4gICAgcmV0dXJuIFtcbiAgICAgIGsgKiBjeSAqIHNpbih4KSxcbiAgICAgIGsgKiBzaW4oeSlcbiAgICBdO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhemltdXRoYWxJbnZlcnQoYW5nbGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgeiA9IHNxcnQoeCAqIHggKyB5ICogeSksXG4gICAgICAgIGMgPSBhbmdsZSh6KSxcbiAgICAgICAgc2MgPSBzaW4oYyksXG4gICAgICAgIGNjID0gY29zKGMpO1xuICAgIHJldHVybiBbXG4gICAgICBhdGFuMih4ICogc2MsIHogKiBjYyksXG4gICAgICBhc2luKHogJiYgeSAqIHNjIC8geilcbiAgICBdO1xuICB9XG59XG4iLCJpbXBvcnQge2FzaW4sIHNxcnR9IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5pbXBvcnQge2F6aW11dGhhbFJhdywgYXppbXV0aGFsSW52ZXJ0fSBmcm9tIFwiLi9hemltdXRoYWwuanNcIjtcbmltcG9ydCBwcm9qZWN0aW9uIGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCB2YXIgYXppbXV0aGFsRXF1YWxBcmVhUmF3ID0gYXppbXV0aGFsUmF3KGZ1bmN0aW9uKGN4Y3kpIHtcbiAgcmV0dXJuIHNxcnQoMiAvICgxICsgY3hjeSkpO1xufSk7XG5cbmF6aW11dGhhbEVxdWFsQXJlYVJhdy5pbnZlcnQgPSBhemltdXRoYWxJbnZlcnQoZnVuY3Rpb24oeikge1xuICByZXR1cm4gMiAqIGFzaW4oeiAvIDIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcHJvamVjdGlvbihhemltdXRoYWxFcXVhbEFyZWFSYXcpXG4gICAgICAuc2NhbGUoMTI0Ljc1KVxuICAgICAgLmNsaXBBbmdsZSgxODAgLSAxZS0zKTtcbn1cbiIsImltcG9ydCB7ZGVmYXVsdCBhcyBnZW9TdHJlYW19IGZyb20gXCIuLi9zdHJlYW0uanNcIjtcbmltcG9ydCBib3VuZHNTdHJlYW0gZnJvbSBcIi4uL3BhdGgvYm91bmRzLmpzXCI7XG5cbmZ1bmN0aW9uIGZpdChwcm9qZWN0aW9uLCBmaXRCb3VuZHMsIG9iamVjdCkge1xuICB2YXIgY2xpcCA9IHByb2plY3Rpb24uY2xpcEV4dGVudCAmJiBwcm9qZWN0aW9uLmNsaXBFeHRlbnQoKTtcbiAgcHJvamVjdGlvbi5zY2FsZSgxNTApLnRyYW5zbGF0ZShbMCwgMF0pO1xuICBpZiAoY2xpcCAhPSBudWxsKSBwcm9qZWN0aW9uLmNsaXBFeHRlbnQobnVsbCk7XG4gIGdlb1N0cmVhbShvYmplY3QsIHByb2plY3Rpb24uc3RyZWFtKGJvdW5kc1N0cmVhbSkpO1xuICBmaXRCb3VuZHMoYm91bmRzU3RyZWFtLnJlc3VsdCgpKTtcbiAgaWYgKGNsaXAgIT0gbnVsbCkgcHJvamVjdGlvbi5jbGlwRXh0ZW50KGNsaXApO1xuICByZXR1cm4gcHJvamVjdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpdEV4dGVudChwcm9qZWN0aW9uLCBleHRlbnQsIG9iamVjdCkge1xuICByZXR1cm4gZml0KHByb2plY3Rpb24sIGZ1bmN0aW9uKGIpIHtcbiAgICB2YXIgdyA9IGV4dGVudFsxXVswXSAtIGV4dGVudFswXVswXSxcbiAgICAgICAgaCA9IGV4dGVudFsxXVsxXSAtIGV4dGVudFswXVsxXSxcbiAgICAgICAgayA9IE1hdGgubWluKHcgLyAoYlsxXVswXSAtIGJbMF1bMF0pLCBoIC8gKGJbMV1bMV0gLSBiWzBdWzFdKSksXG4gICAgICAgIHggPSArZXh0ZW50WzBdWzBdICsgKHcgLSBrICogKGJbMV1bMF0gKyBiWzBdWzBdKSkgLyAyLFxuICAgICAgICB5ID0gK2V4dGVudFswXVsxXSArIChoIC0gayAqIChiWzFdWzFdICsgYlswXVsxXSkpIC8gMjtcbiAgICBwcm9qZWN0aW9uLnNjYWxlKDE1MCAqIGspLnRyYW5zbGF0ZShbeCwgeV0pO1xuICB9LCBvYmplY3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZml0U2l6ZShwcm9qZWN0aW9uLCBzaXplLCBvYmplY3QpIHtcbiAgcmV0dXJuIGZpdEV4dGVudChwcm9qZWN0aW9uLCBbWzAsIDBdLCBzaXplXSwgb2JqZWN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpdFdpZHRoKHByb2plY3Rpb24sIHdpZHRoLCBvYmplY3QpIHtcbiAgcmV0dXJuIGZpdChwcm9qZWN0aW9uLCBmdW5jdGlvbihiKSB7XG4gICAgdmFyIHcgPSArd2lkdGgsXG4gICAgICAgIGsgPSB3IC8gKGJbMV1bMF0gLSBiWzBdWzBdKSxcbiAgICAgICAgeCA9ICh3IC0gayAqIChiWzFdWzBdICsgYlswXVswXSkpIC8gMixcbiAgICAgICAgeSA9IC1rICogYlswXVsxXTtcbiAgICBwcm9qZWN0aW9uLnNjYWxlKDE1MCAqIGspLnRyYW5zbGF0ZShbeCwgeV0pO1xuICB9LCBvYmplY3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZml0SGVpZ2h0KHByb2plY3Rpb24sIGhlaWdodCwgb2JqZWN0KSB7XG4gIHJldHVybiBmaXQocHJvamVjdGlvbiwgZnVuY3Rpb24oYikge1xuICAgIHZhciBoID0gK2hlaWdodCxcbiAgICAgICAgayA9IGggLyAoYlsxXVsxXSAtIGJbMF1bMV0pLFxuICAgICAgICB4ID0gLWsgKiBiWzBdWzBdLFxuICAgICAgICB5ID0gKGggLSBrICogKGJbMV1bMV0gKyBiWzBdWzFdKSkgLyAyO1xuICAgIHByb2plY3Rpb24uc2NhbGUoMTUwICogaykudHJhbnNsYXRlKFt4LCB5XSk7XG4gIH0sIG9iamVjdCk7XG59XG4iLCJpbXBvcnQgY2xpcEFudGltZXJpZGlhbiBmcm9tIFwiLi4vY2xpcC9hbnRpbWVyaWRpYW4uanNcIjtcbmltcG9ydCBjbGlwQ2lyY2xlIGZyb20gXCIuLi9jbGlwL2NpcmNsZS5qc1wiO1xuaW1wb3J0IGNsaXBSZWN0YW5nbGUgZnJvbSBcIi4uL2NsaXAvcmVjdGFuZ2xlLmpzXCI7XG5pbXBvcnQgY29tcG9zZSBmcm9tIFwiLi4vY29tcG9zZS5qc1wiO1xuaW1wb3J0IGlkZW50aXR5IGZyb20gXCIuLi9pZGVudGl0eS5qc1wiO1xuaW1wb3J0IHtjb3MsIGRlZ3JlZXMsIHJhZGlhbnMsIHNpbiwgc3FydH0gZnJvbSBcIi4uL21hdGguanNcIjtcbmltcG9ydCB7cm90YXRlUmFkaWFuc30gZnJvbSBcIi4uL3JvdGF0aW9uLmpzXCI7XG5pbXBvcnQge3RyYW5zZm9ybWVyfSBmcm9tIFwiLi4vdHJhbnNmb3JtLmpzXCI7XG5pbXBvcnQge2ZpdEV4dGVudCwgZml0U2l6ZSwgZml0V2lkdGgsIGZpdEhlaWdodH0gZnJvbSBcIi4vZml0LmpzXCI7XG5pbXBvcnQgcmVzYW1wbGUgZnJvbSBcIi4vcmVzYW1wbGUuanNcIjtcblxudmFyIHRyYW5zZm9ybVJhZGlhbnMgPSB0cmFuc2Zvcm1lcih7XG4gIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgdGhpcy5zdHJlYW0ucG9pbnQoeCAqIHJhZGlhbnMsIHkgKiByYWRpYW5zKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybVJvdGF0ZShyb3RhdGUpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybWVyKHtcbiAgICBwb2ludDogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgdmFyIHIgPSByb3RhdGUoeCwgeSk7XG4gICAgICByZXR1cm4gdGhpcy5zdHJlYW0ucG9pbnQoclswXSwgclsxXSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2NhbGVUcmFuc2xhdGUoaywgZHgsIGR5LCBzeCwgc3kpIHtcbiAgZnVuY3Rpb24gdHJhbnNmb3JtKHgsIHkpIHtcbiAgICB4ICo9IHN4OyB5ICo9IHN5O1xuICAgIHJldHVybiBbZHggKyBrICogeCwgZHkgLSBrICogeV07XG4gIH1cbiAgdHJhbnNmb3JtLmludmVydCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICByZXR1cm4gWyh4IC0gZHgpIC8gayAqIHN4LCAoZHkgLSB5KSAvIGsgKiBzeV07XG4gIH07XG4gIHJldHVybiB0cmFuc2Zvcm07XG59XG5cbmZ1bmN0aW9uIHNjYWxlVHJhbnNsYXRlUm90YXRlKGssIGR4LCBkeSwgc3gsIHN5LCBhbHBoYSkge1xuICBpZiAoIWFscGhhKSByZXR1cm4gc2NhbGVUcmFuc2xhdGUoaywgZHgsIGR5LCBzeCwgc3kpO1xuICB2YXIgY29zQWxwaGEgPSBjb3MoYWxwaGEpLFxuICAgICAgc2luQWxwaGEgPSBzaW4oYWxwaGEpLFxuICAgICAgYSA9IGNvc0FscGhhICogayxcbiAgICAgIGIgPSBzaW5BbHBoYSAqIGssXG4gICAgICBhaSA9IGNvc0FscGhhIC8gayxcbiAgICAgIGJpID0gc2luQWxwaGEgLyBrLFxuICAgICAgY2kgPSAoc2luQWxwaGEgKiBkeSAtIGNvc0FscGhhICogZHgpIC8gayxcbiAgICAgIGZpID0gKHNpbkFscGhhICogZHggKyBjb3NBbHBoYSAqIGR5KSAvIGs7XG4gIGZ1bmN0aW9uIHRyYW5zZm9ybSh4LCB5KSB7XG4gICAgeCAqPSBzeDsgeSAqPSBzeTtcbiAgICByZXR1cm4gW2EgKiB4IC0gYiAqIHkgKyBkeCwgZHkgLSBiICogeCAtIGEgKiB5XTtcbiAgfVxuICB0cmFuc2Zvcm0uaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHJldHVybiBbc3ggKiAoYWkgKiB4IC0gYmkgKiB5ICsgY2kpLCBzeSAqIChmaSAtIGJpICogeCAtIGFpICogeSldO1xuICB9O1xuICByZXR1cm4gdHJhbnNmb3JtO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9qZWN0aW9uKHByb2plY3QpIHtcbiAgcmV0dXJuIHByb2plY3Rpb25NdXRhdG9yKGZ1bmN0aW9uKCkgeyByZXR1cm4gcHJvamVjdDsgfSkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2plY3Rpb25NdXRhdG9yKHByb2plY3RBdCkge1xuICB2YXIgcHJvamVjdCxcbiAgICAgIGsgPSAxNTAsIC8vIHNjYWxlXG4gICAgICB4ID0gNDgwLCB5ID0gMjUwLCAvLyB0cmFuc2xhdGVcbiAgICAgIGxhbWJkYSA9IDAsIHBoaSA9IDAsIC8vIGNlbnRlclxuICAgICAgZGVsdGFMYW1iZGEgPSAwLCBkZWx0YVBoaSA9IDAsIGRlbHRhR2FtbWEgPSAwLCByb3RhdGUsIC8vIHByZS1yb3RhdGVcbiAgICAgIGFscGhhID0gMCwgLy8gcG9zdC1yb3RhdGUgYW5nbGVcbiAgICAgIHN4ID0gMSwgLy8gcmVmbGVjdFhcbiAgICAgIHN5ID0gMSwgLy8gcmVmbGVjdFhcbiAgICAgIHRoZXRhID0gbnVsbCwgcHJlY2xpcCA9IGNsaXBBbnRpbWVyaWRpYW4sIC8vIHByZS1jbGlwIGFuZ2xlXG4gICAgICB4MCA9IG51bGwsIHkwLCB4MSwgeTEsIHBvc3RjbGlwID0gaWRlbnRpdHksIC8vIHBvc3QtY2xpcCBleHRlbnRcbiAgICAgIGRlbHRhMiA9IDAuNSwgLy8gcHJlY2lzaW9uXG4gICAgICBwcm9qZWN0UmVzYW1wbGUsXG4gICAgICBwcm9qZWN0VHJhbnNmb3JtLFxuICAgICAgcHJvamVjdFJvdGF0ZVRyYW5zZm9ybSxcbiAgICAgIGNhY2hlLFxuICAgICAgY2FjaGVTdHJlYW07XG5cbiAgZnVuY3Rpb24gcHJvamVjdGlvbihwb2ludCkge1xuICAgIHJldHVybiBwcm9qZWN0Um90YXRlVHJhbnNmb3JtKHBvaW50WzBdICogcmFkaWFucywgcG9pbnRbMV0gKiByYWRpYW5zKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludmVydChwb2ludCkge1xuICAgIHBvaW50ID0gcHJvamVjdFJvdGF0ZVRyYW5zZm9ybS5pbnZlcnQocG9pbnRbMF0sIHBvaW50WzFdKTtcbiAgICByZXR1cm4gcG9pbnQgJiYgW3BvaW50WzBdICogZGVncmVlcywgcG9pbnRbMV0gKiBkZWdyZWVzXTtcbiAgfVxuXG4gIHByb2plY3Rpb24uc3RyZWFtID0gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgcmV0dXJuIGNhY2hlICYmIGNhY2hlU3RyZWFtID09PSBzdHJlYW0gPyBjYWNoZSA6IGNhY2hlID0gdHJhbnNmb3JtUmFkaWFucyh0cmFuc2Zvcm1Sb3RhdGUocm90YXRlKShwcmVjbGlwKHByb2plY3RSZXNhbXBsZShwb3N0Y2xpcChjYWNoZVN0cmVhbSA9IHN0cmVhbSkpKSkpO1xuICB9O1xuXG4gIHByb2plY3Rpb24ucHJlY2xpcCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwcmVjbGlwID0gXywgdGhldGEgPSB1bmRlZmluZWQsIHJlc2V0KCkpIDogcHJlY2xpcDtcbiAgfTtcblxuICBwcm9qZWN0aW9uLnBvc3RjbGlwID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBvc3RjbGlwID0gXywgeDAgPSB5MCA9IHgxID0geTEgPSBudWxsLCByZXNldCgpKSA6IHBvc3RjbGlwO1xuICB9O1xuXG4gIHByb2plY3Rpb24uY2xpcEFuZ2xlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHByZWNsaXAgPSArXyA/IGNsaXBDaXJjbGUodGhldGEgPSBfICogcmFkaWFucykgOiAodGhldGEgPSBudWxsLCBjbGlwQW50aW1lcmlkaWFuKSwgcmVzZXQoKSkgOiB0aGV0YSAqIGRlZ3JlZXM7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5jbGlwRXh0ZW50ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBvc3RjbGlwID0gXyA9PSBudWxsID8gKHgwID0geTAgPSB4MSA9IHkxID0gbnVsbCwgaWRlbnRpdHkpIDogY2xpcFJlY3RhbmdsZSh4MCA9ICtfWzBdWzBdLCB5MCA9ICtfWzBdWzFdLCB4MSA9ICtfWzFdWzBdLCB5MSA9ICtfWzFdWzFdKSwgcmVzZXQoKSkgOiB4MCA9PSBudWxsID8gbnVsbCA6IFtbeDAsIHkwXSwgW3gxLCB5MV1dO1xuICB9O1xuXG4gIHByb2plY3Rpb24uc2NhbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoayA9ICtfLCByZWNlbnRlcigpKSA6IGs7XG4gIH07XG5cbiAgcHJvamVjdGlvbi50cmFuc2xhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeCA9ICtfWzBdLCB5ID0gK19bMV0sIHJlY2VudGVyKCkpIDogW3gsIHldO1xuICB9O1xuXG4gIHByb2plY3Rpb24uY2VudGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxhbWJkYSA9IF9bMF0gJSAzNjAgKiByYWRpYW5zLCBwaGkgPSBfWzFdICUgMzYwICogcmFkaWFucywgcmVjZW50ZXIoKSkgOiBbbGFtYmRhICogZGVncmVlcywgcGhpICogZGVncmVlc107XG4gIH07XG5cbiAgcHJvamVjdGlvbi5yb3RhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZGVsdGFMYW1iZGEgPSBfWzBdICUgMzYwICogcmFkaWFucywgZGVsdGFQaGkgPSBfWzFdICUgMzYwICogcmFkaWFucywgZGVsdGFHYW1tYSA9IF8ubGVuZ3RoID4gMiA/IF9bMl0gJSAzNjAgKiByYWRpYW5zIDogMCwgcmVjZW50ZXIoKSkgOiBbZGVsdGFMYW1iZGEgKiBkZWdyZWVzLCBkZWx0YVBoaSAqIGRlZ3JlZXMsIGRlbHRhR2FtbWEgKiBkZWdyZWVzXTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmFuZ2xlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhID0gXyAlIDM2MCAqIHJhZGlhbnMsIHJlY2VudGVyKCkpIDogYWxwaGEgKiBkZWdyZWVzO1xuICB9O1xuXG4gIHByb2plY3Rpb24ucmVmbGVjdFggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3ggPSBfID8gLTEgOiAxLCByZWNlbnRlcigpKSA6IHN4IDwgMDtcbiAgfTtcblxuICBwcm9qZWN0aW9uLnJlZmxlY3RZID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN5ID0gXyA/IC0xIDogMSwgcmVjZW50ZXIoKSkgOiBzeSA8IDA7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5wcmVjaXNpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocHJvamVjdFJlc2FtcGxlID0gcmVzYW1wbGUocHJvamVjdFRyYW5zZm9ybSwgZGVsdGEyID0gXyAqIF8pLCByZXNldCgpKSA6IHNxcnQoZGVsdGEyKTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmZpdEV4dGVudCA9IGZ1bmN0aW9uKGV4dGVudCwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGZpdEV4dGVudChwcm9qZWN0aW9uLCBleHRlbnQsIG9iamVjdCk7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5maXRTaXplID0gZnVuY3Rpb24oc2l6ZSwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGZpdFNpemUocHJvamVjdGlvbiwgc2l6ZSwgb2JqZWN0KTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmZpdFdpZHRoID0gZnVuY3Rpb24od2lkdGgsIG9iamVjdCkge1xuICAgIHJldHVybiBmaXRXaWR0aChwcm9qZWN0aW9uLCB3aWR0aCwgb2JqZWN0KTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmZpdEhlaWdodCA9IGZ1bmN0aW9uKGhlaWdodCwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGZpdEhlaWdodChwcm9qZWN0aW9uLCBoZWlnaHQsIG9iamVjdCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVjZW50ZXIoKSB7XG4gICAgdmFyIGNlbnRlciA9IHNjYWxlVHJhbnNsYXRlUm90YXRlKGssIDAsIDAsIHN4LCBzeSwgYWxwaGEpLmFwcGx5KG51bGwsIHByb2plY3QobGFtYmRhLCBwaGkpKSxcbiAgICAgICAgdHJhbnNmb3JtID0gc2NhbGVUcmFuc2xhdGVSb3RhdGUoaywgeCAtIGNlbnRlclswXSwgeSAtIGNlbnRlclsxXSwgc3gsIHN5LCBhbHBoYSk7XG4gICAgcm90YXRlID0gcm90YXRlUmFkaWFucyhkZWx0YUxhbWJkYSwgZGVsdGFQaGksIGRlbHRhR2FtbWEpO1xuICAgIHByb2plY3RUcmFuc2Zvcm0gPSBjb21wb3NlKHByb2plY3QsIHRyYW5zZm9ybSk7XG4gICAgcHJvamVjdFJvdGF0ZVRyYW5zZm9ybSA9IGNvbXBvc2Uocm90YXRlLCBwcm9qZWN0VHJhbnNmb3JtKTtcbiAgICBwcm9qZWN0UmVzYW1wbGUgPSByZXNhbXBsZShwcm9qZWN0VHJhbnNmb3JtLCBkZWx0YTIpO1xuICAgIHJldHVybiByZXNldCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgY2FjaGUgPSBjYWNoZVN0cmVhbSA9IG51bGw7XG4gICAgcmV0dXJuIHByb2plY3Rpb247XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcHJvamVjdCA9IHByb2plY3RBdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHByb2plY3Rpb24uaW52ZXJ0ID0gcHJvamVjdC5pbnZlcnQgJiYgaW52ZXJ0O1xuICAgIHJldHVybiByZWNlbnRlcigpO1xuICB9O1xufVxuIiwiaW1wb3J0IHtjYXJ0ZXNpYW59IGZyb20gXCIuLi9jYXJ0ZXNpYW4uanNcIjtcbmltcG9ydCB7YWJzLCBhc2luLCBhdGFuMiwgY29zLCBlcHNpbG9uLCByYWRpYW5zLCBzcXJ0fSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuaW1wb3J0IHt0cmFuc2Zvcm1lcn0gZnJvbSBcIi4uL3RyYW5zZm9ybS5qc1wiO1xuXG52YXIgbWF4RGVwdGggPSAxNiwgLy8gbWF4aW11bSBkZXB0aCBvZiBzdWJkaXZpc2lvblxuICAgIGNvc01pbkRpc3RhbmNlID0gY29zKDMwICogcmFkaWFucyk7IC8vIGNvcyhtaW5pbXVtIGFuZ3VsYXIgZGlzdGFuY2UpXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHByb2plY3QsIGRlbHRhMikge1xuICByZXR1cm4gK2RlbHRhMiA/IHJlc2FtcGxlKHByb2plY3QsIGRlbHRhMikgOiByZXNhbXBsZU5vbmUocHJvamVjdCk7XG59XG5cbmZ1bmN0aW9uIHJlc2FtcGxlTm9uZShwcm9qZWN0KSB7XG4gIHJldHVybiB0cmFuc2Zvcm1lcih7XG4gICAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgIHggPSBwcm9qZWN0KHgsIHkpO1xuICAgICAgdGhpcy5zdHJlYW0ucG9pbnQoeFswXSwgeFsxXSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzYW1wbGUocHJvamVjdCwgZGVsdGEyKSB7XG5cbiAgZnVuY3Rpb24gcmVzYW1wbGVMaW5lVG8oeDAsIHkwLCBsYW1iZGEwLCBhMCwgYjAsIGMwLCB4MSwgeTEsIGxhbWJkYTEsIGExLCBiMSwgYzEsIGRlcHRoLCBzdHJlYW0pIHtcbiAgICB2YXIgZHggPSB4MSAtIHgwLFxuICAgICAgICBkeSA9IHkxIC0geTAsXG4gICAgICAgIGQyID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgaWYgKGQyID4gNCAqIGRlbHRhMiAmJiBkZXB0aC0tKSB7XG4gICAgICB2YXIgYSA9IGEwICsgYTEsXG4gICAgICAgICAgYiA9IGIwICsgYjEsXG4gICAgICAgICAgYyA9IGMwICsgYzEsXG4gICAgICAgICAgbSA9IHNxcnQoYSAqIGEgKyBiICogYiArIGMgKiBjKSxcbiAgICAgICAgICBwaGkyID0gYXNpbihjIC89IG0pLFxuICAgICAgICAgIGxhbWJkYTIgPSBhYnMoYWJzKGMpIC0gMSkgPCBlcHNpbG9uIHx8IGFicyhsYW1iZGEwIC0gbGFtYmRhMSkgPCBlcHNpbG9uID8gKGxhbWJkYTAgKyBsYW1iZGExKSAvIDIgOiBhdGFuMihiLCBhKSxcbiAgICAgICAgICBwID0gcHJvamVjdChsYW1iZGEyLCBwaGkyKSxcbiAgICAgICAgICB4MiA9IHBbMF0sXG4gICAgICAgICAgeTIgPSBwWzFdLFxuICAgICAgICAgIGR4MiA9IHgyIC0geDAsXG4gICAgICAgICAgZHkyID0geTIgLSB5MCxcbiAgICAgICAgICBkeiA9IGR5ICogZHgyIC0gZHggKiBkeTI7XG4gICAgICBpZiAoZHogKiBkeiAvIGQyID4gZGVsdGEyIC8vIHBlcnBlbmRpY3VsYXIgcHJvamVjdGVkIGRpc3RhbmNlXG4gICAgICAgICAgfHwgYWJzKChkeCAqIGR4MiArIGR5ICogZHkyKSAvIGQyIC0gMC41KSA+IDAuMyAvLyBtaWRwb2ludCBjbG9zZSB0byBhbiBlbmRcbiAgICAgICAgICB8fCBhMCAqIGExICsgYjAgKiBiMSArIGMwICogYzEgPCBjb3NNaW5EaXN0YW5jZSkgeyAvLyBhbmd1bGFyIGRpc3RhbmNlXG4gICAgICAgIHJlc2FtcGxlTGluZVRvKHgwLCB5MCwgbGFtYmRhMCwgYTAsIGIwLCBjMCwgeDIsIHkyLCBsYW1iZGEyLCBhIC89IG0sIGIgLz0gbSwgYywgZGVwdGgsIHN0cmVhbSk7XG4gICAgICAgIHN0cmVhbS5wb2ludCh4MiwgeTIpO1xuICAgICAgICByZXNhbXBsZUxpbmVUbyh4MiwgeTIsIGxhbWJkYTIsIGEsIGIsIGMsIHgxLCB5MSwgbGFtYmRhMSwgYTEsIGIxLCBjMSwgZGVwdGgsIHN0cmVhbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICB2YXIgbGFtYmRhMDAsIHgwMCwgeTAwLCBhMDAsIGIwMCwgYzAwLCAvLyBmaXJzdCBwb2ludFxuICAgICAgICBsYW1iZGEwLCB4MCwgeTAsIGEwLCBiMCwgYzA7IC8vIHByZXZpb3VzIHBvaW50XG5cbiAgICB2YXIgcmVzYW1wbGVTdHJlYW0gPSB7XG4gICAgICBwb2ludDogcG9pbnQsXG4gICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgIGxpbmVFbmQ6IGxpbmVFbmQsXG4gICAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkgeyBzdHJlYW0ucG9seWdvblN0YXJ0KCk7IHJlc2FtcGxlU3RyZWFtLmxpbmVTdGFydCA9IHJpbmdTdGFydDsgfSxcbiAgICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkgeyBzdHJlYW0ucG9seWdvbkVuZCgpOyByZXNhbXBsZVN0cmVhbS5saW5lU3RhcnQgPSBsaW5lU3RhcnQ7IH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgICAgeCA9IHByb2plY3QoeCwgeSk7XG4gICAgICBzdHJlYW0ucG9pbnQoeFswXSwgeFsxXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZVN0YXJ0KCkge1xuICAgICAgeDAgPSBOYU47XG4gICAgICByZXNhbXBsZVN0cmVhbS5wb2ludCA9IGxpbmVQb2ludDtcbiAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lUG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgICAgIHZhciBjID0gY2FydGVzaWFuKFtsYW1iZGEsIHBoaV0pLCBwID0gcHJvamVjdChsYW1iZGEsIHBoaSk7XG4gICAgICByZXNhbXBsZUxpbmVUbyh4MCwgeTAsIGxhbWJkYTAsIGEwLCBiMCwgYzAsIHgwID0gcFswXSwgeTAgPSBwWzFdLCBsYW1iZGEwID0gbGFtYmRhLCBhMCA9IGNbMF0sIGIwID0gY1sxXSwgYzAgPSBjWzJdLCBtYXhEZXB0aCwgc3RyZWFtKTtcbiAgICAgIHN0cmVhbS5wb2ludCh4MCwgeTApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVFbmQoKSB7XG4gICAgICByZXNhbXBsZVN0cmVhbS5wb2ludCA9IHBvaW50O1xuICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByaW5nU3RhcnQoKSB7XG4gICAgICBsaW5lU3RhcnQoKTtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLnBvaW50ID0gcmluZ1BvaW50O1xuICAgICAgcmVzYW1wbGVTdHJlYW0ubGluZUVuZCA9IHJpbmdFbmQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmluZ1BvaW50KGxhbWJkYSwgcGhpKSB7XG4gICAgICBsaW5lUG9pbnQobGFtYmRhMDAgPSBsYW1iZGEsIHBoaSksIHgwMCA9IHgwLCB5MDAgPSB5MCwgYTAwID0gYTAsIGIwMCA9IGIwLCBjMDAgPSBjMDtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLnBvaW50ID0gbGluZVBvaW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdFbmQoKSB7XG4gICAgICByZXNhbXBsZUxpbmVUbyh4MCwgeTAsIGxhbWJkYTAsIGEwLCBiMCwgYzAsIHgwMCwgeTAwLCBsYW1iZGEwMCwgYTAwLCBiMDAsIGMwMCwgbWF4RGVwdGgsIHN0cmVhbSk7XG4gICAgICByZXNhbXBsZVN0cmVhbS5saW5lRW5kID0gbGluZUVuZDtcbiAgICAgIGxpbmVFbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzYW1wbGVTdHJlYW07XG4gIH07XG59XG4iLCJpbXBvcnQgY29tcG9zZSBmcm9tIFwiLi9jb21wb3NlLmpzXCI7XG5pbXBvcnQge2FicywgYXNpbiwgYXRhbjIsIGNvcywgZGVncmVlcywgcGksIHJhZGlhbnMsIHNpbiwgdGF1fSBmcm9tIFwiLi9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIHJvdGF0aW9uSWRlbnRpdHkobGFtYmRhLCBwaGkpIHtcbiAgaWYgKGFicyhsYW1iZGEpID4gcGkpIGxhbWJkYSAtPSBNYXRoLnJvdW5kKGxhbWJkYSAvIHRhdSkgKiB0YXU7XG4gIHJldHVybiBbbGFtYmRhLCBwaGldO1xufVxuXG5yb3RhdGlvbklkZW50aXR5LmludmVydCA9IHJvdGF0aW9uSWRlbnRpdHk7XG5cbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVSYWRpYW5zKGRlbHRhTGFtYmRhLCBkZWx0YVBoaSwgZGVsdGFHYW1tYSkge1xuICByZXR1cm4gKGRlbHRhTGFtYmRhICU9IHRhdSkgPyAoZGVsdGFQaGkgfHwgZGVsdGFHYW1tYSA/IGNvbXBvc2Uocm90YXRpb25MYW1iZGEoZGVsdGFMYW1iZGEpLCByb3RhdGlvblBoaUdhbW1hKGRlbHRhUGhpLCBkZWx0YUdhbW1hKSlcbiAgICA6IHJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKSlcbiAgICA6IChkZWx0YVBoaSB8fCBkZWx0YUdhbW1hID8gcm90YXRpb25QaGlHYW1tYShkZWx0YVBoaSwgZGVsdGFHYW1tYSlcbiAgICA6IHJvdGF0aW9uSWRlbnRpdHkpO1xufVxuXG5mdW5jdGlvbiBmb3J3YXJkUm90YXRpb25MYW1iZGEoZGVsdGFMYW1iZGEpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGxhbWJkYSwgcGhpKSB7XG4gICAgbGFtYmRhICs9IGRlbHRhTGFtYmRhO1xuICAgIGlmIChhYnMobGFtYmRhKSA+IHBpKSBsYW1iZGEgLT0gTWF0aC5yb3VuZChsYW1iZGEgLyB0YXUpICogdGF1O1xuICAgIHJldHVybiBbbGFtYmRhLCBwaGldO1xuICB9O1xufVxuXG5mdW5jdGlvbiByb3RhdGlvbkxhbWJkYShkZWx0YUxhbWJkYSkge1xuICB2YXIgcm90YXRpb24gPSBmb3J3YXJkUm90YXRpb25MYW1iZGEoZGVsdGFMYW1iZGEpO1xuICByb3RhdGlvbi5pbnZlcnQgPSBmb3J3YXJkUm90YXRpb25MYW1iZGEoLWRlbHRhTGFtYmRhKTtcbiAgcmV0dXJuIHJvdGF0aW9uO1xufVxuXG5mdW5jdGlvbiByb3RhdGlvblBoaUdhbW1hKGRlbHRhUGhpLCBkZWx0YUdhbW1hKSB7XG4gIHZhciBjb3NEZWx0YVBoaSA9IGNvcyhkZWx0YVBoaSksXG4gICAgICBzaW5EZWx0YVBoaSA9IHNpbihkZWx0YVBoaSksXG4gICAgICBjb3NEZWx0YUdhbW1hID0gY29zKGRlbHRhR2FtbWEpLFxuICAgICAgc2luRGVsdGFHYW1tYSA9IHNpbihkZWx0YUdhbW1hKTtcblxuICBmdW5jdGlvbiByb3RhdGlvbihsYW1iZGEsIHBoaSkge1xuICAgIHZhciBjb3NQaGkgPSBjb3MocGhpKSxcbiAgICAgICAgeCA9IGNvcyhsYW1iZGEpICogY29zUGhpLFxuICAgICAgICB5ID0gc2luKGxhbWJkYSkgKiBjb3NQaGksXG4gICAgICAgIHogPSBzaW4ocGhpKSxcbiAgICAgICAgayA9IHogKiBjb3NEZWx0YVBoaSArIHggKiBzaW5EZWx0YVBoaTtcbiAgICByZXR1cm4gW1xuICAgICAgYXRhbjIoeSAqIGNvc0RlbHRhR2FtbWEgLSBrICogc2luRGVsdGFHYW1tYSwgeCAqIGNvc0RlbHRhUGhpIC0geiAqIHNpbkRlbHRhUGhpKSxcbiAgICAgIGFzaW4oayAqIGNvc0RlbHRhR2FtbWEgKyB5ICogc2luRGVsdGFHYW1tYSlcbiAgICBdO1xuICB9XG5cbiAgcm90YXRpb24uaW52ZXJ0ID0gZnVuY3Rpb24obGFtYmRhLCBwaGkpIHtcbiAgICB2YXIgY29zUGhpID0gY29zKHBoaSksXG4gICAgICAgIHggPSBjb3MobGFtYmRhKSAqIGNvc1BoaSxcbiAgICAgICAgeSA9IHNpbihsYW1iZGEpICogY29zUGhpLFxuICAgICAgICB6ID0gc2luKHBoaSksXG4gICAgICAgIGsgPSB6ICogY29zRGVsdGFHYW1tYSAtIHkgKiBzaW5EZWx0YUdhbW1hO1xuICAgIHJldHVybiBbXG4gICAgICBhdGFuMih5ICogY29zRGVsdGFHYW1tYSArIHogKiBzaW5EZWx0YUdhbW1hLCB4ICogY29zRGVsdGFQaGkgKyBrICogc2luRGVsdGFQaGkpLFxuICAgICAgYXNpbihrICogY29zRGVsdGFQaGkgLSB4ICogc2luRGVsdGFQaGkpXG4gICAgXTtcbiAgfTtcblxuICByZXR1cm4gcm90YXRpb247XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHJvdGF0ZSkge1xuICByb3RhdGUgPSByb3RhdGVSYWRpYW5zKHJvdGF0ZVswXSAqIHJhZGlhbnMsIHJvdGF0ZVsxXSAqIHJhZGlhbnMsIHJvdGF0ZS5sZW5ndGggPiAyID8gcm90YXRlWzJdICogcmFkaWFucyA6IDApO1xuXG4gIGZ1bmN0aW9uIGZvcndhcmQoY29vcmRpbmF0ZXMpIHtcbiAgICBjb29yZGluYXRlcyA9IHJvdGF0ZShjb29yZGluYXRlc1swXSAqIHJhZGlhbnMsIGNvb3JkaW5hdGVzWzFdICogcmFkaWFucyk7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzWzBdICo9IGRlZ3JlZXMsIGNvb3JkaW5hdGVzWzFdICo9IGRlZ3JlZXMsIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgZm9yd2FyZC5pbnZlcnQgPSBmdW5jdGlvbihjb29yZGluYXRlcykge1xuICAgIGNvb3JkaW5hdGVzID0gcm90YXRlLmludmVydChjb29yZGluYXRlc1swXSAqIHJhZGlhbnMsIGNvb3JkaW5hdGVzWzFdICogcmFkaWFucyk7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzWzBdICo9IGRlZ3JlZXMsIGNvb3JkaW5hdGVzWzFdICo9IGRlZ3JlZXMsIGNvb3JkaW5hdGVzO1xuICB9O1xuXG4gIHJldHVybiBmb3J3YXJkO1xufVxuIiwiZnVuY3Rpb24gc3RyZWFtR2VvbWV0cnkoZ2VvbWV0cnksIHN0cmVhbSkge1xuICBpZiAoZ2VvbWV0cnkgJiYgc3RyZWFtR2VvbWV0cnlUeXBlLmhhc093blByb3BlcnR5KGdlb21ldHJ5LnR5cGUpKSB7XG4gICAgc3RyZWFtR2VvbWV0cnlUeXBlW2dlb21ldHJ5LnR5cGVdKGdlb21ldHJ5LCBzdHJlYW0pO1xuICB9XG59XG5cbnZhciBzdHJlYW1PYmplY3RUeXBlID0ge1xuICBGZWF0dXJlOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHN0cmVhbUdlb21ldHJ5KG9iamVjdC5nZW9tZXRyeSwgc3RyZWFtKTtcbiAgfSxcbiAgRmVhdHVyZUNvbGxlY3Rpb246IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgdmFyIGZlYXR1cmVzID0gb2JqZWN0LmZlYXR1cmVzLCBpID0gLTEsIG4gPSBmZWF0dXJlcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIHN0cmVhbUdlb21ldHJ5KGZlYXR1cmVzW2ldLmdlb21ldHJ5LCBzdHJlYW0pO1xuICB9XG59O1xuXG52YXIgc3RyZWFtR2VvbWV0cnlUeXBlID0ge1xuICBTcGhlcmU6IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgc3RyZWFtLnNwaGVyZSgpO1xuICB9LFxuICBQb2ludDogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICBvYmplY3QgPSBvYmplY3QuY29vcmRpbmF0ZXM7XG4gICAgc3RyZWFtLnBvaW50KG9iamVjdFswXSwgb2JqZWN0WzFdLCBvYmplY3RbMl0pO1xuICB9LFxuICBNdWx0aVBvaW50OiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHZhciBjb29yZGluYXRlcyA9IG9iamVjdC5jb29yZGluYXRlcywgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBvYmplY3QgPSBjb29yZGluYXRlc1tpXSwgc3RyZWFtLnBvaW50KG9iamVjdFswXSwgb2JqZWN0WzFdLCBvYmplY3RbMl0pO1xuICB9LFxuICBMaW5lU3RyaW5nOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHN0cmVhbUxpbmUob2JqZWN0LmNvb3JkaW5hdGVzLCBzdHJlYW0sIDApO1xuICB9LFxuICBNdWx0aUxpbmVTdHJpbmc6IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgdmFyIGNvb3JkaW5hdGVzID0gb2JqZWN0LmNvb3JkaW5hdGVzLCBpID0gLTEsIG4gPSBjb29yZGluYXRlcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIHN0cmVhbUxpbmUoY29vcmRpbmF0ZXNbaV0sIHN0cmVhbSwgMCk7XG4gIH0sXG4gIFBvbHlnb246IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgc3RyZWFtUG9seWdvbihvYmplY3QuY29vcmRpbmF0ZXMsIHN0cmVhbSk7XG4gIH0sXG4gIE11bHRpUG9seWdvbjogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgc3RyZWFtUG9seWdvbihjb29yZGluYXRlc1tpXSwgc3RyZWFtKTtcbiAgfSxcbiAgR2VvbWV0cnlDb2xsZWN0aW9uOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHZhciBnZW9tZXRyaWVzID0gb2JqZWN0Lmdlb21ldHJpZXMsIGkgPSAtMSwgbiA9IGdlb21ldHJpZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1HZW9tZXRyeShnZW9tZXRyaWVzW2ldLCBzdHJlYW0pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzdHJlYW1MaW5lKGNvb3JkaW5hdGVzLCBzdHJlYW0sIGNsb3NlZCkge1xuICB2YXIgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoIC0gY2xvc2VkLCBjb29yZGluYXRlO1xuICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gIHdoaWxlICgrK2kgPCBuKSBjb29yZGluYXRlID0gY29vcmRpbmF0ZXNbaV0sIHN0cmVhbS5wb2ludChjb29yZGluYXRlWzBdLCBjb29yZGluYXRlWzFdLCBjb29yZGluYXRlWzJdKTtcbiAgc3RyZWFtLmxpbmVFbmQoKTtcbn1cblxuZnVuY3Rpb24gc3RyZWFtUG9seWdvbihjb29yZGluYXRlcywgc3RyZWFtKSB7XG4gIHZhciBpID0gLTEsIG4gPSBjb29yZGluYXRlcy5sZW5ndGg7XG4gIHN0cmVhbS5wb2x5Z29uU3RhcnQoKTtcbiAgd2hpbGUgKCsraSA8IG4pIHN0cmVhbUxpbmUoY29vcmRpbmF0ZXNbaV0sIHN0cmVhbSwgMSk7XG4gIHN0cmVhbS5wb2x5Z29uRW5kKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gIGlmIChvYmplY3QgJiYgc3RyZWFtT2JqZWN0VHlwZS5oYXNPd25Qcm9wZXJ0eShvYmplY3QudHlwZSkpIHtcbiAgICBzdHJlYW1PYmplY3RUeXBlW29iamVjdC50eXBlXShvYmplY3QsIHN0cmVhbSk7XG4gIH0gZWxzZSB7XG4gICAgc3RyZWFtR2VvbWV0cnkob2JqZWN0LCBzdHJlYW0pO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtZXRob2RzKSB7XG4gIHJldHVybiB7XG4gICAgc3RyZWFtOiB0cmFuc2Zvcm1lcihtZXRob2RzKVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtZXIobWV0aG9kcykge1xuICByZXR1cm4gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgdmFyIHMgPSBuZXcgVHJhbnNmb3JtU3RyZWFtO1xuICAgIGZvciAodmFyIGtleSBpbiBtZXRob2RzKSBzW2tleV0gPSBtZXRob2RzW2tleV07XG4gICAgcy5zdHJlYW0gPSBzdHJlYW07XG4gICAgcmV0dXJuIHM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbSgpIHt9XG5cblRyYW5zZm9ybVN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBUcmFuc2Zvcm1TdHJlYW0sXG4gIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7IHRoaXMuc3RyZWFtLnBvaW50KHgsIHkpOyB9LFxuICBzcGhlcmU6IGZ1bmN0aW9uKCkgeyB0aGlzLnN0cmVhbS5zcGhlcmUoKTsgfSxcbiAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHsgdGhpcy5zdHJlYW0ubGluZVN0YXJ0KCk7IH0sXG4gIGxpbmVFbmQ6IGZ1bmN0aW9uKCkgeyB0aGlzLnN0cmVhbS5saW5lRW5kKCk7IH0sXG4gIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7IHRoaXMuc3RyZWFtLnBvbHlnb25TdGFydCgpOyB9LFxuICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHsgdGhpcy5zdHJlYW0ucG9seWdvbkVuZCgpOyB9XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvL0B0cy1jaGVja1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IGdlb0F6aW11dGhhbEVxdWFsQXJlYSB9IGZyb20gJ2QzLWdlbydcblxuLyoqXG4gKiBQcm9qZWN0aW9uIGZ1bmN0aW9uIGZvciBFdXJvcGVhbiBMQUVBLlxuICovXG5leHBvcnQgY29uc3QgcHJvajMwMzUgPSBnZW9BemltdXRoYWxFcXVhbEFyZWEoKVxuICAgIC5yb3RhdGUoWy0xMCwgLTUyXSlcbiAgICAucmVmbGVjdFgoZmFsc2UpXG4gICAgLnJlZmxlY3RZKHRydWUpXG4gICAgLnNjYWxlKDYzNzgxMzcpXG4gICAgLnRyYW5zbGF0ZShbNDMyMTAwMCwgMzIxMDAwMF0pXG5cbi8qKlxuICogUmV0dXJucyBvcHRpb25zIGZvciBncmlkdml6IGxhYmVsIGxheWVyLlxuICogRnJvbSBFdXJvbnltIGRhdGE6IGh0dHBzOi8vZ2l0aHViLmNvbS9ldXJvc3RhdC9ldXJvbnltXG4gKlxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEV1cm9ueW1lTGFiZWxMYXllciA9IGZ1bmN0aW9uIChjYyA9ICdFVVInLCByZXMgPSA1MCwgb3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgY29uc3QgZXggPSBvcHRzLmV4IHx8IDEuMlxuICAgIGNvbnN0IGZvbnRGYW1pbHkgPSBvcHRzLmZvbnRGYW1pbHkgfHwgJ0FyaWFsJ1xuICAgIGNvbnN0IGV4U2l6ZSA9IG9wdHMuZXhTaXplIHx8IDFcbiAgICBvcHRzLnN0eWxlID1cbiAgICAgICAgb3B0cy5zdHlsZSB8fFxuICAgICAgICAoKGxiLCB6ZikgPT4ge1xuICAgICAgICAgICAgaWYgKGxiLnJzIDwgZXggKiB6ZikgcmV0dXJuXG4gICAgICAgICAgICBpZiAobGIucjEgPCBleCAqIHpmKSByZXR1cm4gZXhTaXplICsgJ2VtICcgKyBmb250RmFtaWx5XG4gICAgICAgICAgICByZXR1cm4gZXhTaXplICogMS41ICsgJ2VtICcgKyBmb250RmFtaWx5XG4gICAgICAgIH0pXG4gICAgb3B0cy5wcm9qID0gb3B0cy5wcm9qIHx8IHByb2ozMDM1XG4gICAgb3B0cy5wcmVwcm9jZXNzID0gKGxiKSA9PiB7XG4gICAgICAgIC8vZXhjbHVkZSBjb3VudHJpZXNcbiAgICAgICAgLy9pZihvcHRzLmNjT3V0ICYmIGxiLmNjICYmIG9wdHMuY2NPdXQuaW5jbHVkZXMobGIuY2MpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChvcHRzLmNjSW4gJiYgbGIuY2MgJiYgIShvcHRzLmNjSW4uaW5kZXhPZihsYi5jYykgPj0gMCkpIHJldHVybiBmYWxzZVxuXG4gICAgICAgIC8vcHJvamVjdCBmcm9tIGdlbyBjb29yZGluYXRlcyB0byBFVFJTODktTEFFQVxuICAgICAgICBjb25zdCBwID0gb3B0cy5wcm9qKFtsYi5sb24sIGxiLmxhdF0pXG4gICAgICAgIGxiLnggPSBwWzBdXG4gICAgICAgIGxiLnkgPSBwWzFdXG4gICAgICAgIGRlbGV0ZSBsYi5sb25cbiAgICAgICAgZGVsZXRlIGxiLmxhdFxuICAgIH1cbiAgICBvcHRzLmJhc2VVUkwgPSBvcHRzLmJhc2VVUkwgfHwgJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9ldXJvc3RhdC9ldXJvbnltL21haW4vcHViL3YyL1VURi8nXG4gICAgb3B0cy51cmwgPSBvcHRzLmJhc2VVUkwgKyByZXMgKyAnLycgKyBjYyArICcuY3N2J1xuICAgIHJldHVybiBvcHRzXG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIG9wdGlvbnMgZm9yIGdyaWR2aXogYm91bmRhcmllcyBsYXllci5cbiAqIEZyb20gTnV0czJqc29uIGRhdGE6IGh0dHBzOi8vZ2l0aHViLmNvbS9ldXJvc3RhdC9OdXRzMmpzb25cbiAqIFxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEV1cm9zdGF0Qm91bmRhcmllc0xheWVyID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fVxuICAgIGNvbnN0IG51dHNZZWFyID0gb3B0cy5udXRzWWVhciB8fCAnMjAyMSdcbiAgICBjb25zdCBjcnMgPSBvcHRzLmNycyB8fCAnMzAzNSdcbiAgICBjb25zdCBzY2FsZSA9IG9wdHMuc2NhbGUgfHwgJzAzTSdcbiAgICBjb25zdCBudXRzTGV2ZWwgPSBvcHRzLm51dHNMZXZlbCB8fCAnMydcbiAgICBjb25zdCBjb2wgPSBvcHRzLmNvbCB8fCAnIzg4OCdcbiAgICBjb25zdCBjb2xLb3Nvdm8gPSBvcHRzLmNvbEtvc292byB8fCAnI2JjYmNiYydcbiAgICBjb25zdCBzaG93T3RoID0gb3B0cy5zaG93T3RoID09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRzLnNob3dPdGhcblxuICAgIC8vaW4gbW9zdCBvZiB0aGUgY2FzZSwgYWxyZWFkeSBwcm9qZWN0ZWQgZGF0YSBvZiBudXRzMmpzb24gd2lsbCBiZSB1c2VkLCB1c2luZyAnb3B0cy5jcnMnXG4gICAgaWYgKG9wdHMucHJvailcbiAgICAgICAgb3B0cy5wcmVwcm9jZXNzID0gKGJuKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChibi5nZW9tZXRyeS50eXBlID09PSBcIkxpbmVTdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNzID0gW11cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjIG9mIGJuLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAgICAgICAgICAgICBjcy5wdXNoKG9wdHMucHJvaihjKSlcbiAgICAgICAgICAgICAgICBibi5nZW9tZXRyeS5jb29yZGluYXRlcyA9IGNzXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBwcm9qZWN0IGJvdW5kYXJ5IC0gdW5zdXBwb3J0ZWQgZ2VvbWV0cnkgdHlwZTogXCIgKyBibi5nZW9tZXRyeS50eXBlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgb3B0cy5jb2xvciA9XG4gICAgICAgIG9wdHMuY29sb3IgfHxcbiAgICAgICAgKChmLCB6ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IGYucHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKCFzaG93T3RoIC8qJiYgcC5jbyA9PSBcIkZcIiovICYmIHAuZXUgIT0gJ1QnICYmIHAuY2MgIT0gJ1QnICYmIHAuZWZ0YSAhPSAnVCcgJiYgcC5vdGggPT09ICdUJylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGlmIChwLmlkID49IDEwMDAwMCkgcmV0dXJuIGNvbEtvc292b1xuICAgICAgICAgICAgaWYgKHAuY28gPT09ICdUJykgcmV0dXJuIGNvbFxuICAgICAgICAgICAgaWYgKHpmIDwgNDAwKSByZXR1cm4gY29sXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA+PSAzID8gJycgOiBjb2xcbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMjAwMCkgcmV0dXJuIHAubHZsID49IDIgPyAnJyA6IGNvbFxuICAgICAgICAgICAgZWxzZSByZXR1cm4gcC5sdmwgPj0gMSA/ICcnIDogY29sXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLndpZHRoID1cbiAgICAgICAgb3B0cy53aWR0aCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gMC41XG4gICAgICAgICAgICBpZiAoemYgPCA0MDApIHJldHVybiBwLmx2bCA9PSAzID8gMi4yIDogcC5sdmwgPT0gMiA/IDIuMiA6IHAubHZsID09IDEgPyAyLjIgOiA0XG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA9PSAyID8gMS44IDogcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAyMDAwKSByZXR1cm4gcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gMS4yXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLmxpbmVEYXNoID1cbiAgICAgICAgb3B0cy5saW5lRGFzaCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gW11cbiAgICAgICAgICAgIGlmICh6ZiA8IDQwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gM1xuICAgICAgICAgICAgICAgICAgICA/IFsyICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgOiBwLmx2bCA9PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFs1ICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogcC5sdmwgPT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gWzUgKiB6ZiwgMiAqIHpmXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWzEwICogemYsIDMgKiB6Zl1cbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMTAwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gMiA/IFs1ICogemYsIDIgKiB6Zl0gOiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDIwMDApIHJldHVybiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIHJldHVybiBbMTAgKiB6ZiwgMyAqIHpmXVxuICAgICAgICB9KVxuXG4gICAgb3B0cy5iYXNlVVJMID0gb3B0cy5iYXNlVVJMIHx8ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZXVyb3N0YXQvTnV0czJqc29uL21hc3Rlci9wdWIvdjIvJ1xuICAgIG9wdHMudXJsID0gb3B0cy5iYXNlVVJMICsgbnV0c1llYXIgKyAnLycgKyBjcnMgKyAnLycgKyBzY2FsZSArICcvbnV0c2JuXycgKyBudXRzTGV2ZWwgKyAnLmpzb24nXG4gICAgcmV0dXJuIG9wdHNcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==