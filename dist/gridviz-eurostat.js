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
            //exclude countries
            //if(opts.ccOut && lb.cc && opts.ccOut.includes(lb.cc)) return false;
            //if (opts.ccIn && lb.cc && !(opts.ccIn.indexOf(lb.cc) >= 0)) return false

            //project from geo coordinates to ETRS89-LAEA
            //const p = opts.proj([lb.lon, lb.lat])
            //lb.x = p[0]
            //lb.y = p[1]
            //delete lb.lon
            //delete lb.lat
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ3Zpel9lcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvZnN1bS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2FydGVzaWFuLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jaXJjbGUuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NsaXAvYW50aW1lcmlkaWFuLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jbGlwL2J1ZmZlci5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2xpcC9jaXJjbGUuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NsaXAvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NsaXAvbGluZS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2xpcC9yZWN0YW5nbGUuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NsaXAvcmVqb2luLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jb21wb3NlLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvaWRlbnRpdHkuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL21hdGguanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL25vb3AuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3BhdGgvYm91bmRzLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wb2ludEVxdWFsLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wb2x5Z29uQ29udGFpbnMuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3Byb2plY3Rpb24vYXppbXV0aGFsLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wcm9qZWN0aW9uL2F6aW11dGhhbEVxdWFsQXJlYS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcHJvamVjdGlvbi9maXQuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3Byb2plY3Rpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3Byb2plY3Rpb24vcmVzYW1wbGUuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3JvdGF0aW9uLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9zdHJlYW0uanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2d2aXpfZXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2d2aXpfZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ndml6X2VzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJndml6X2VzXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImd2aXpfZXNcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3B5dGhvbi9jcHl0aG9uL2Jsb2IvYTc0ZWVhMjM4ZjViYWJhMTU3OTdlMmU4YjU3MGQxNTNiYzg2OTBhNy9Nb2R1bGVzL21hdGhtb2R1bGUuYyNMMTQyM1xuZXhwb3J0IGNsYXNzIEFkZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcGFydGlhbHMgPSBuZXcgRmxvYXQ2NEFycmF5KDMyKTtcbiAgICB0aGlzLl9uID0gMDtcbiAgfVxuICBhZGQoeCkge1xuICAgIGNvbnN0IHAgPSB0aGlzLl9wYXJ0aWFscztcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9uICYmIGogPCAzMjsgaisrKSB7XG4gICAgICBjb25zdCB5ID0gcFtqXSxcbiAgICAgICAgaGkgPSB4ICsgeSxcbiAgICAgICAgbG8gPSBNYXRoLmFicyh4KSA8IE1hdGguYWJzKHkpID8geCAtIChoaSAtIHkpIDogeSAtIChoaSAtIHgpO1xuICAgICAgaWYgKGxvKSBwW2krK10gPSBsbztcbiAgICAgIHggPSBoaTtcbiAgICB9XG4gICAgcFtpXSA9IHg7XG4gICAgdGhpcy5fbiA9IGkgKyAxO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZhbHVlT2YoKSB7XG4gICAgY29uc3QgcCA9IHRoaXMuX3BhcnRpYWxzO1xuICAgIGxldCBuID0gdGhpcy5fbiwgeCwgeSwgbG8sIGhpID0gMDtcbiAgICBpZiAobiA+IDApIHtcbiAgICAgIGhpID0gcFstLW5dO1xuICAgICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgIHggPSBoaTtcbiAgICAgICAgeSA9IHBbLS1uXTtcbiAgICAgICAgaGkgPSB4ICsgeTtcbiAgICAgICAgbG8gPSB5IC0gKGhpIC0geCk7XG4gICAgICAgIGlmIChsbykgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAobiA+IDAgJiYgKChsbyA8IDAgJiYgcFtuIC0gMV0gPCAwKSB8fCAobG8gPiAwICYmIHBbbiAtIDFdID4gMCkpKSB7XG4gICAgICAgIHkgPSBsbyAqIDI7XG4gICAgICAgIHggPSBoaSArIHk7XG4gICAgICAgIGlmICh5ID09IHggLSBoaSkgaGkgPSB4O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZzdW0odmFsdWVzLCB2YWx1ZW9mKSB7XG4gIGNvbnN0IGFkZGVyID0gbmV3IEFkZGVyKCk7XG4gIGlmICh2YWx1ZW9mID09PSB1bmRlZmluZWQpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIGlmICh2YWx1ZSA9ICt2YWx1ZSkge1xuICAgICAgICBhZGRlci5hZGQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIGlmICh2YWx1ZSA9ICt2YWx1ZW9mKHZhbHVlLCArK2luZGV4LCB2YWx1ZXMpKSB7XG4gICAgICAgIGFkZGVyLmFkZCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiArYWRkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmY3Vtc3VtKHZhbHVlcywgdmFsdWVvZikge1xuICBjb25zdCBhZGRlciA9IG5ldyBBZGRlcigpO1xuICBsZXQgaW5kZXggPSAtMTtcbiAgcmV0dXJuIEZsb2F0NjRBcnJheS5mcm9tKHZhbHVlcywgdmFsdWVvZiA9PT0gdW5kZWZpbmVkXG4gICAgICA/IHYgPT4gYWRkZXIuYWRkKCt2IHx8IDApXG4gICAgICA6IHYgPT4gYWRkZXIuYWRkKCt2YWx1ZW9mKHYsICsraW5kZXgsIHZhbHVlcykgfHwgMClcbiAgKTtcbn1cbiIsImZ1bmN0aW9uKiBmbGF0dGVuKGFycmF5cykge1xuICBmb3IgKGNvbnN0IGFycmF5IG9mIGFycmF5cykge1xuICAgIHlpZWxkKiBhcnJheTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZShhcnJheXMpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20oZmxhdHRlbihhcnJheXMpKTtcbn1cbiIsImltcG9ydCB7YXNpbiwgYXRhbjIsIGNvcywgc2luLCBzcXJ0fSBmcm9tIFwiLi9tYXRoLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGhlcmljYWwoY2FydGVzaWFuKSB7XG4gIHJldHVybiBbYXRhbjIoY2FydGVzaWFuWzFdLCBjYXJ0ZXNpYW5bMF0pLCBhc2luKGNhcnRlc2lhblsyXSldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuKHNwaGVyaWNhbCkge1xuICB2YXIgbGFtYmRhID0gc3BoZXJpY2FsWzBdLCBwaGkgPSBzcGhlcmljYWxbMV0sIGNvc1BoaSA9IGNvcyhwaGkpO1xuICByZXR1cm4gW2Nvc1BoaSAqIGNvcyhsYW1iZGEpLCBjb3NQaGkgKiBzaW4obGFtYmRhKSwgc2luKHBoaSldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuRG90KGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV0gKyBhWzJdICogYlsyXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhbkNyb3NzKGEsIGIpIHtcbiAgcmV0dXJuIFthWzFdICogYlsyXSAtIGFbMl0gKiBiWzFdLCBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLCBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdXTtcbn1cblxuLy8gVE9ETyByZXR1cm4gYVxuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhbkFkZEluUGxhY2UoYSwgYikge1xuICBhWzBdICs9IGJbMF0sIGFbMV0gKz0gYlsxXSwgYVsyXSArPSBiWzJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuU2NhbGUodmVjdG9yLCBrKSB7XG4gIHJldHVybiBbdmVjdG9yWzBdICogaywgdmVjdG9yWzFdICogaywgdmVjdG9yWzJdICoga107XG59XG5cbi8vIFRPRE8gcmV0dXJuIGRcbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW5Ob3JtYWxpemVJblBsYWNlKGQpIHtcbiAgdmFyIGwgPSBzcXJ0KGRbMF0gKiBkWzBdICsgZFsxXSAqIGRbMV0gKyBkWzJdICogZFsyXSk7XG4gIGRbMF0gLz0gbCwgZFsxXSAvPSBsLCBkWzJdIC89IGw7XG59XG4iLCJpbXBvcnQge2NhcnRlc2lhbiwgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZSwgc3BoZXJpY2FsfSBmcm9tIFwiLi9jYXJ0ZXNpYW4uanNcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IHthY29zLCBjb3MsIGRlZ3JlZXMsIGVwc2lsb24sIHJhZGlhbnMsIHNpbiwgdGF1fSBmcm9tIFwiLi9tYXRoLmpzXCI7XG5pbXBvcnQge3JvdGF0ZVJhZGlhbnN9IGZyb20gXCIuL3JvdGF0aW9uLmpzXCI7XG5cbi8vIEdlbmVyYXRlcyBhIGNpcmNsZSBjZW50ZXJlZCBhdCBbMMKwLCAwwrBdLCB3aXRoIGEgZ2l2ZW4gcmFkaXVzIGFuZCBwcmVjaXNpb24uXG5leHBvcnQgZnVuY3Rpb24gY2lyY2xlU3RyZWFtKHN0cmVhbSwgcmFkaXVzLCBkZWx0YSwgZGlyZWN0aW9uLCB0MCwgdDEpIHtcbiAgaWYgKCFkZWx0YSkgcmV0dXJuO1xuICB2YXIgY29zUmFkaXVzID0gY29zKHJhZGl1cyksXG4gICAgICBzaW5SYWRpdXMgPSBzaW4ocmFkaXVzKSxcbiAgICAgIHN0ZXAgPSBkaXJlY3Rpb24gKiBkZWx0YTtcbiAgaWYgKHQwID09IG51bGwpIHtcbiAgICB0MCA9IHJhZGl1cyArIGRpcmVjdGlvbiAqIHRhdTtcbiAgICB0MSA9IHJhZGl1cyAtIHN0ZXAgLyAyO1xuICB9IGVsc2Uge1xuICAgIHQwID0gY2lyY2xlUmFkaXVzKGNvc1JhZGl1cywgdDApO1xuICAgIHQxID0gY2lyY2xlUmFkaXVzKGNvc1JhZGl1cywgdDEpO1xuICAgIGlmIChkaXJlY3Rpb24gPiAwID8gdDAgPCB0MSA6IHQwID4gdDEpIHQwICs9IGRpcmVjdGlvbiAqIHRhdTtcbiAgfVxuICBmb3IgKHZhciBwb2ludCwgdCA9IHQwOyBkaXJlY3Rpb24gPiAwID8gdCA+IHQxIDogdCA8IHQxOyB0IC09IHN0ZXApIHtcbiAgICBwb2ludCA9IHNwaGVyaWNhbChbY29zUmFkaXVzLCAtc2luUmFkaXVzICogY29zKHQpLCAtc2luUmFkaXVzICogc2luKHQpXSk7XG4gICAgc3RyZWFtLnBvaW50KHBvaW50WzBdLCBwb2ludFsxXSk7XG4gIH1cbn1cblxuLy8gUmV0dXJucyB0aGUgc2lnbmVkIGFuZ2xlIG9mIGEgY2FydGVzaWFuIHBvaW50IHJlbGF0aXZlIHRvIFtjb3NSYWRpdXMsIDAsIDBdLlxuZnVuY3Rpb24gY2lyY2xlUmFkaXVzKGNvc1JhZGl1cywgcG9pbnQpIHtcbiAgcG9pbnQgPSBjYXJ0ZXNpYW4ocG9pbnQpLCBwb2ludFswXSAtPSBjb3NSYWRpdXM7XG4gIGNhcnRlc2lhbk5vcm1hbGl6ZUluUGxhY2UocG9pbnQpO1xuICB2YXIgcmFkaXVzID0gYWNvcygtcG9pbnRbMV0pO1xuICByZXR1cm4gKCgtcG9pbnRbMl0gPCAwID8gLXJhZGl1cyA6IHJhZGl1cykgKyB0YXUgLSBlcHNpbG9uKSAlIHRhdTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBjZW50ZXIgPSBjb25zdGFudChbMCwgMF0pLFxuICAgICAgcmFkaXVzID0gY29uc3RhbnQoOTApLFxuICAgICAgcHJlY2lzaW9uID0gY29uc3RhbnQoNiksXG4gICAgICByaW5nLFxuICAgICAgcm90YXRlLFxuICAgICAgc3RyZWFtID0ge3BvaW50OiBwb2ludH07XG5cbiAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgIHJpbmcucHVzaCh4ID0gcm90YXRlKHgsIHkpKTtcbiAgICB4WzBdICo9IGRlZ3JlZXMsIHhbMV0gKj0gZGVncmVlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNpcmNsZSgpIHtcbiAgICB2YXIgYyA9IGNlbnRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpLFxuICAgICAgICByID0gcmFkaXVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgKiByYWRpYW5zLFxuICAgICAgICBwID0gcHJlY2lzaW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgKiByYWRpYW5zO1xuICAgIHJpbmcgPSBbXTtcbiAgICByb3RhdGUgPSByb3RhdGVSYWRpYW5zKC1jWzBdICogcmFkaWFucywgLWNbMV0gKiByYWRpYW5zLCAwKS5pbnZlcnQ7XG4gICAgY2lyY2xlU3RyZWFtKHN0cmVhbSwgciwgcCwgMSk7XG4gICAgYyA9IHt0eXBlOiBcIlBvbHlnb25cIiwgY29vcmRpbmF0ZXM6IFtyaW5nXX07XG4gICAgcmluZyA9IHJvdGF0ZSA9IG51bGw7XG4gICAgcmV0dXJuIGM7XG4gIH1cblxuICBjaXJjbGUuY2VudGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNlbnRlciA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoWytfWzBdLCArX1sxXV0pLCBjaXJjbGUpIDogY2VudGVyO1xuICB9O1xuXG4gIGNpcmNsZS5yYWRpdXMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFkaXVzID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGNpcmNsZSkgOiByYWRpdXM7XG4gIH07XG5cbiAgY2lyY2xlLnByZWNpc2lvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwcmVjaXNpb24gPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgY2lyY2xlKSA6IHByZWNpc2lvbjtcbiAgfTtcblxuICByZXR1cm4gY2lyY2xlO1xufVxuIiwiaW1wb3J0IGNsaXAgZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCB7YWJzLCBhdGFuLCBjb3MsIGVwc2lsb24sIGhhbGZQaSwgcGksIHNpbn0gZnJvbSBcIi4uL21hdGguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xpcChcbiAgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9LFxuICBjbGlwQW50aW1lcmlkaWFuTGluZSxcbiAgY2xpcEFudGltZXJpZGlhbkludGVycG9sYXRlLFxuICBbLXBpLCAtaGFsZlBpXVxuKTtcblxuLy8gVGFrZXMgYSBsaW5lIGFuZCBjdXRzIGludG8gdmlzaWJsZSBzZWdtZW50cy4gUmV0dXJuIHZhbHVlczogMCAtIHRoZXJlIHdlcmVcbi8vIGludGVyc2VjdGlvbnMgb3IgdGhlIGxpbmUgd2FzIGVtcHR5OyAxIC0gbm8gaW50ZXJzZWN0aW9uczsgMiAtIHRoZXJlIHdlcmVcbi8vIGludGVyc2VjdGlvbnMsIGFuZCB0aGUgZmlyc3QgYW5kIGxhc3Qgc2VnbWVudHMgc2hvdWxkIGJlIHJlam9pbmVkLlxuZnVuY3Rpb24gY2xpcEFudGltZXJpZGlhbkxpbmUoc3RyZWFtKSB7XG4gIHZhciBsYW1iZGEwID0gTmFOLFxuICAgICAgcGhpMCA9IE5hTixcbiAgICAgIHNpZ24wID0gTmFOLFxuICAgICAgY2xlYW47IC8vIG5vIGludGVyc2VjdGlvbnNcblxuICByZXR1cm4ge1xuICAgIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICBjbGVhbiA9IDE7XG4gICAgfSxcbiAgICBwb2ludDogZnVuY3Rpb24obGFtYmRhMSwgcGhpMSkge1xuICAgICAgdmFyIHNpZ24xID0gbGFtYmRhMSA+IDAgPyBwaSA6IC1waSxcbiAgICAgICAgICBkZWx0YSA9IGFicyhsYW1iZGExIC0gbGFtYmRhMCk7XG4gICAgICBpZiAoYWJzKGRlbHRhIC0gcGkpIDwgZXBzaWxvbikgeyAvLyBsaW5lIGNyb3NzZXMgYSBwb2xlXG4gICAgICAgIHN0cmVhbS5wb2ludChsYW1iZGEwLCBwaGkwID0gKHBoaTAgKyBwaGkxKSAvIDIgPiAwID8gaGFsZlBpIDogLWhhbGZQaSk7XG4gICAgICAgIHN0cmVhbS5wb2ludChzaWduMCwgcGhpMCk7XG4gICAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHNpZ24xLCBwaGkwKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KGxhbWJkYTEsIHBoaTApO1xuICAgICAgICBjbGVhbiA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHNpZ24wICE9PSBzaWduMSAmJiBkZWx0YSA+PSBwaSkgeyAvLyBsaW5lIGNyb3NzZXMgYW50aW1lcmlkaWFuXG4gICAgICAgIGlmIChhYnMobGFtYmRhMCAtIHNpZ24wKSA8IGVwc2lsb24pIGxhbWJkYTAgLT0gc2lnbjAgKiBlcHNpbG9uOyAvLyBoYW5kbGUgZGVnZW5lcmFjaWVzXG4gICAgICAgIGlmIChhYnMobGFtYmRhMSAtIHNpZ24xKSA8IGVwc2lsb24pIGxhbWJkYTEgLT0gc2lnbjEgKiBlcHNpbG9uO1xuICAgICAgICBwaGkwID0gY2xpcEFudGltZXJpZGlhbkludGVyc2VjdChsYW1iZGEwLCBwaGkwLCBsYW1iZGExLCBwaGkxKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHNpZ24wLCBwaGkwKTtcbiAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICBzdHJlYW0ucG9pbnQoc2lnbjEsIHBoaTApO1xuICAgICAgICBjbGVhbiA9IDA7XG4gICAgICB9XG4gICAgICBzdHJlYW0ucG9pbnQobGFtYmRhMCA9IGxhbWJkYTEsIHBoaTAgPSBwaGkxKTtcbiAgICAgIHNpZ24wID0gc2lnbjE7XG4gICAgfSxcbiAgICBsaW5lRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICBsYW1iZGEwID0gcGhpMCA9IE5hTjtcbiAgICB9LFxuICAgIGNsZWFuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAyIC0gY2xlYW47IC8vIGlmIGludGVyc2VjdGlvbnMsIHJlam9pbiBmaXJzdCBhbmQgbGFzdCBzZWdtZW50c1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xpcEFudGltZXJpZGlhbkludGVyc2VjdChsYW1iZGEwLCBwaGkwLCBsYW1iZGExLCBwaGkxKSB7XG4gIHZhciBjb3NQaGkwLFxuICAgICAgY29zUGhpMSxcbiAgICAgIHNpbkxhbWJkYTBMYW1iZGExID0gc2luKGxhbWJkYTAgLSBsYW1iZGExKTtcbiAgcmV0dXJuIGFicyhzaW5MYW1iZGEwTGFtYmRhMSkgPiBlcHNpbG9uXG4gICAgICA/IGF0YW4oKHNpbihwaGkwKSAqIChjb3NQaGkxID0gY29zKHBoaTEpKSAqIHNpbihsYW1iZGExKVxuICAgICAgICAgIC0gc2luKHBoaTEpICogKGNvc1BoaTAgPSBjb3MocGhpMCkpICogc2luKGxhbWJkYTApKVxuICAgICAgICAgIC8gKGNvc1BoaTAgKiBjb3NQaGkxICogc2luTGFtYmRhMExhbWJkYTEpKVxuICAgICAgOiAocGhpMCArIHBoaTEpIC8gMjtcbn1cblxuZnVuY3Rpb24gY2xpcEFudGltZXJpZGlhbkludGVycG9sYXRlKGZyb20sIHRvLCBkaXJlY3Rpb24sIHN0cmVhbSkge1xuICB2YXIgcGhpO1xuICBpZiAoZnJvbSA9PSBudWxsKSB7XG4gICAgcGhpID0gZGlyZWN0aW9uICogaGFsZlBpO1xuICAgIHN0cmVhbS5wb2ludCgtcGksIHBoaSk7XG4gICAgc3RyZWFtLnBvaW50KDAsIHBoaSk7XG4gICAgc3RyZWFtLnBvaW50KHBpLCBwaGkpO1xuICAgIHN0cmVhbS5wb2ludChwaSwgMCk7XG4gICAgc3RyZWFtLnBvaW50KHBpLCAtcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoMCwgLXBoaSk7XG4gICAgc3RyZWFtLnBvaW50KC1waSwgLXBoaSk7XG4gICAgc3RyZWFtLnBvaW50KC1waSwgMCk7XG4gICAgc3RyZWFtLnBvaW50KC1waSwgcGhpKTtcbiAgfSBlbHNlIGlmIChhYnMoZnJvbVswXSAtIHRvWzBdKSA+IGVwc2lsb24pIHtcbiAgICB2YXIgbGFtYmRhID0gZnJvbVswXSA8IHRvWzBdID8gcGkgOiAtcGk7XG4gICAgcGhpID0gZGlyZWN0aW9uICogbGFtYmRhIC8gMjtcbiAgICBzdHJlYW0ucG9pbnQoLWxhbWJkYSwgcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoMCwgcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQobGFtYmRhLCBwaGkpO1xuICB9IGVsc2Uge1xuICAgIHN0cmVhbS5wb2ludCh0b1swXSwgdG9bMV0pO1xuICB9XG59XG4iLCJpbXBvcnQgbm9vcCBmcm9tIFwiLi4vbm9vcC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIGxpbmVzID0gW10sXG4gICAgICBsaW5lO1xuICByZXR1cm4ge1xuICAgIHBvaW50OiBmdW5jdGlvbih4LCB5LCBtKSB7XG4gICAgICBsaW5lLnB1c2goW3gsIHksIG1dKTtcbiAgICB9LFxuICAgIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBsaW5lcy5wdXNoKGxpbmUgPSBbXSk7XG4gICAgfSxcbiAgICBsaW5lRW5kOiBub29wLFxuICAgIHJlam9pbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAobGluZXMubGVuZ3RoID4gMSkgbGluZXMucHVzaChsaW5lcy5wb3AoKS5jb25jYXQobGluZXMuc2hpZnQoKSkpO1xuICAgIH0sXG4gICAgcmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXN1bHQgPSBsaW5lcztcbiAgICAgIGxpbmVzID0gW107XG4gICAgICBsaW5lID0gbnVsbDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHtjYXJ0ZXNpYW4sIGNhcnRlc2lhbkFkZEluUGxhY2UsIGNhcnRlc2lhbkNyb3NzLCBjYXJ0ZXNpYW5Eb3QsIGNhcnRlc2lhblNjYWxlLCBzcGhlcmljYWx9IGZyb20gXCIuLi9jYXJ0ZXNpYW4uanNcIjtcbmltcG9ydCB7Y2lyY2xlU3RyZWFtfSBmcm9tIFwiLi4vY2lyY2xlLmpzXCI7XG5pbXBvcnQge2FicywgY29zLCBlcHNpbG9uLCBwaSwgcmFkaWFucywgc3FydH0gZnJvbSBcIi4uL21hdGguanNcIjtcbmltcG9ydCBwb2ludEVxdWFsIGZyb20gXCIuLi9wb2ludEVxdWFsLmpzXCI7XG5pbXBvcnQgY2xpcCBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihyYWRpdXMpIHtcbiAgdmFyIGNyID0gY29zKHJhZGl1cyksXG4gICAgICBkZWx0YSA9IDYgKiByYWRpYW5zLFxuICAgICAgc21hbGxSYWRpdXMgPSBjciA+IDAsXG4gICAgICBub3RIZW1pc3BoZXJlID0gYWJzKGNyKSA+IGVwc2lsb247IC8vIFRPRE8gb3B0aW1pc2UgZm9yIHRoaXMgY29tbW9uIGNhc2VcblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShmcm9tLCB0bywgZGlyZWN0aW9uLCBzdHJlYW0pIHtcbiAgICBjaXJjbGVTdHJlYW0oc3RyZWFtLCByYWRpdXMsIGRlbHRhLCBkaXJlY3Rpb24sIGZyb20sIHRvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZpc2libGUobGFtYmRhLCBwaGkpIHtcbiAgICByZXR1cm4gY29zKGxhbWJkYSkgKiBjb3MocGhpKSA+IGNyO1xuICB9XG5cbiAgLy8gVGFrZXMgYSBsaW5lIGFuZCBjdXRzIGludG8gdmlzaWJsZSBzZWdtZW50cy4gUmV0dXJuIHZhbHVlcyB1c2VkIGZvciBwb2x5Z29uXG4gIC8vIGNsaXBwaW5nOiAwIC0gdGhlcmUgd2VyZSBpbnRlcnNlY3Rpb25zIG9yIHRoZSBsaW5lIHdhcyBlbXB0eTsgMSAtIG5vXG4gIC8vIGludGVyc2VjdGlvbnMgMiAtIHRoZXJlIHdlcmUgaW50ZXJzZWN0aW9ucywgYW5kIHRoZSBmaXJzdCBhbmQgbGFzdCBzZWdtZW50c1xuICAvLyBzaG91bGQgYmUgcmVqb2luZWQuXG4gIGZ1bmN0aW9uIGNsaXBMaW5lKHN0cmVhbSkge1xuICAgIHZhciBwb2ludDAsIC8vIHByZXZpb3VzIHBvaW50XG4gICAgICAgIGMwLCAvLyBjb2RlIGZvciBwcmV2aW91cyBwb2ludFxuICAgICAgICB2MCwgLy8gdmlzaWJpbGl0eSBvZiBwcmV2aW91cyBwb2ludFxuICAgICAgICB2MDAsIC8vIHZpc2liaWxpdHkgb2YgZmlyc3QgcG9pbnRcbiAgICAgICAgY2xlYW47IC8vIG5vIGludGVyc2VjdGlvbnNcbiAgICByZXR1cm4ge1xuICAgICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdjAwID0gdjAgPSBmYWxzZTtcbiAgICAgICAgY2xlYW4gPSAxO1xuICAgICAgfSxcbiAgICAgIHBvaW50OiBmdW5jdGlvbihsYW1iZGEsIHBoaSkge1xuICAgICAgICB2YXIgcG9pbnQxID0gW2xhbWJkYSwgcGhpXSxcbiAgICAgICAgICAgIHBvaW50MixcbiAgICAgICAgICAgIHYgPSB2aXNpYmxlKGxhbWJkYSwgcGhpKSxcbiAgICAgICAgICAgIGMgPSBzbWFsbFJhZGl1c1xuICAgICAgICAgICAgICA/IHYgPyAwIDogY29kZShsYW1iZGEsIHBoaSlcbiAgICAgICAgICAgICAgOiB2ID8gY29kZShsYW1iZGEgKyAobGFtYmRhIDwgMCA/IHBpIDogLXBpKSwgcGhpKSA6IDA7XG4gICAgICAgIGlmICghcG9pbnQwICYmICh2MDAgPSB2MCA9IHYpKSBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgIGlmICh2ICE9PSB2MCkge1xuICAgICAgICAgIHBvaW50MiA9IGludGVyc2VjdChwb2ludDAsIHBvaW50MSk7XG4gICAgICAgICAgaWYgKCFwb2ludDIgfHwgcG9pbnRFcXVhbChwb2ludDAsIHBvaW50MikgfHwgcG9pbnRFcXVhbChwb2ludDEsIHBvaW50MikpXG4gICAgICAgICAgICBwb2ludDFbMl0gPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2ICE9PSB2MCkge1xuICAgICAgICAgIGNsZWFuID0gMDtcbiAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgLy8gb3V0c2lkZSBnb2luZyBpblxuICAgICAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MSwgcG9pbnQwKTtcbiAgICAgICAgICAgIHN0cmVhbS5wb2ludChwb2ludDJbMF0sIHBvaW50MlsxXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGluc2lkZSBnb2luZyBvdXRcbiAgICAgICAgICAgIHBvaW50MiA9IGludGVyc2VjdChwb2ludDAsIHBvaW50MSk7XG4gICAgICAgICAgICBzdHJlYW0ucG9pbnQocG9pbnQyWzBdLCBwb2ludDJbMV0sIDIpO1xuICAgICAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcG9pbnQwID0gcG9pbnQyO1xuICAgICAgICB9IGVsc2UgaWYgKG5vdEhlbWlzcGhlcmUgJiYgcG9pbnQwICYmIHNtYWxsUmFkaXVzIF4gdikge1xuICAgICAgICAgIHZhciB0O1xuICAgICAgICAgIC8vIElmIHRoZSBjb2RlcyBmb3IgdHdvIHBvaW50cyBhcmUgZGlmZmVyZW50LCBvciBhcmUgYm90aCB6ZXJvLFxuICAgICAgICAgIC8vIGFuZCB0aGVyZSB0aGlzIHNlZ21lbnQgaW50ZXJzZWN0cyB3aXRoIHRoZSBzbWFsbCBjaXJjbGUuXG4gICAgICAgICAgaWYgKCEoYyAmIGMwKSAmJiAodCA9IGludGVyc2VjdChwb2ludDEsIHBvaW50MCwgdHJ1ZSkpKSB7XG4gICAgICAgICAgICBjbGVhbiA9IDA7XG4gICAgICAgICAgICBpZiAoc21hbGxSYWRpdXMpIHtcbiAgICAgICAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgICBzdHJlYW0ucG9pbnQodFswXVswXSwgdFswXVsxXSk7XG4gICAgICAgICAgICAgIHN0cmVhbS5wb2ludCh0WzFdWzBdLCB0WzFdWzFdKTtcbiAgICAgICAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0cmVhbS5wb2ludCh0WzFdWzBdLCB0WzFdWzFdKTtcbiAgICAgICAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgICBzdHJlYW0ucG9pbnQodFswXVswXSwgdFswXVsxXSwgMyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh2ICYmICghcG9pbnQwIHx8ICFwb2ludEVxdWFsKHBvaW50MCwgcG9pbnQxKSkpIHtcbiAgICAgICAgICBzdHJlYW0ucG9pbnQocG9pbnQxWzBdLCBwb2ludDFbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50MCA9IHBvaW50MSwgdjAgPSB2LCBjMCA9IGM7XG4gICAgICB9LFxuICAgICAgbGluZUVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh2MCkgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgcG9pbnQwID0gbnVsbDtcbiAgICAgIH0sXG4gICAgICAvLyBSZWpvaW4gZmlyc3QgYW5kIGxhc3Qgc2VnbWVudHMgaWYgdGhlcmUgd2VyZSBpbnRlcnNlY3Rpb25zIGFuZCB0aGUgZmlyc3RcbiAgICAgIC8vIGFuZCBsYXN0IHBvaW50cyB3ZXJlIHZpc2libGUuXG4gICAgICBjbGVhbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjbGVhbiB8ICgodjAwICYmIHYwKSA8PCAxKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gSW50ZXJzZWN0cyB0aGUgZ3JlYXQgY2lyY2xlIGJldHdlZW4gYSBhbmQgYiB3aXRoIHRoZSBjbGlwIGNpcmNsZS5cbiAgZnVuY3Rpb24gaW50ZXJzZWN0KGEsIGIsIHR3bykge1xuICAgIHZhciBwYSA9IGNhcnRlc2lhbihhKSxcbiAgICAgICAgcGIgPSBjYXJ0ZXNpYW4oYik7XG5cbiAgICAvLyBXZSBoYXZlIHR3byBwbGFuZXMsIG4xLnAgPSBkMSBhbmQgbjIucCA9IGQyLlxuICAgIC8vIEZpbmQgaW50ZXJzZWN0aW9uIGxpbmUgcCh0KSA9IGMxIG4xICsgYzIgbjIgKyB0IChuMSDiqK8gbjIpLlxuICAgIHZhciBuMSA9IFsxLCAwLCAwXSwgLy8gbm9ybWFsXG4gICAgICAgIG4yID0gY2FydGVzaWFuQ3Jvc3MocGEsIHBiKSxcbiAgICAgICAgbjJuMiA9IGNhcnRlc2lhbkRvdChuMiwgbjIpLFxuICAgICAgICBuMW4yID0gbjJbMF0sIC8vIGNhcnRlc2lhbkRvdChuMSwgbjIpLFxuICAgICAgICBkZXRlcm1pbmFudCA9IG4ybjIgLSBuMW4yICogbjFuMjtcblxuICAgIC8vIFR3byBwb2xhciBwb2ludHMuXG4gICAgaWYgKCFkZXRlcm1pbmFudCkgcmV0dXJuICF0d28gJiYgYTtcblxuICAgIHZhciBjMSA9ICBjciAqIG4ybjIgLyBkZXRlcm1pbmFudCxcbiAgICAgICAgYzIgPSAtY3IgKiBuMW4yIC8gZGV0ZXJtaW5hbnQsXG4gICAgICAgIG4xeG4yID0gY2FydGVzaWFuQ3Jvc3MobjEsIG4yKSxcbiAgICAgICAgQSA9IGNhcnRlc2lhblNjYWxlKG4xLCBjMSksXG4gICAgICAgIEIgPSBjYXJ0ZXNpYW5TY2FsZShuMiwgYzIpO1xuICAgIGNhcnRlc2lhbkFkZEluUGxhY2UoQSwgQik7XG5cbiAgICAvLyBTb2x2ZSB8cCh0KXxeMiA9IDEuXG4gICAgdmFyIHUgPSBuMXhuMixcbiAgICAgICAgdyA9IGNhcnRlc2lhbkRvdChBLCB1KSxcbiAgICAgICAgdXUgPSBjYXJ0ZXNpYW5Eb3QodSwgdSksXG4gICAgICAgIHQyID0gdyAqIHcgLSB1dSAqIChjYXJ0ZXNpYW5Eb3QoQSwgQSkgLSAxKTtcblxuICAgIGlmICh0MiA8IDApIHJldHVybjtcblxuICAgIHZhciB0ID0gc3FydCh0MiksXG4gICAgICAgIHEgPSBjYXJ0ZXNpYW5TY2FsZSh1LCAoLXcgLSB0KSAvIHV1KTtcbiAgICBjYXJ0ZXNpYW5BZGRJblBsYWNlKHEsIEEpO1xuICAgIHEgPSBzcGhlcmljYWwocSk7XG5cbiAgICBpZiAoIXR3bykgcmV0dXJuIHE7XG5cbiAgICAvLyBUd28gaW50ZXJzZWN0aW9uIHBvaW50cy5cbiAgICB2YXIgbGFtYmRhMCA9IGFbMF0sXG4gICAgICAgIGxhbWJkYTEgPSBiWzBdLFxuICAgICAgICBwaGkwID0gYVsxXSxcbiAgICAgICAgcGhpMSA9IGJbMV0sXG4gICAgICAgIHo7XG5cbiAgICBpZiAobGFtYmRhMSA8IGxhbWJkYTApIHogPSBsYW1iZGEwLCBsYW1iZGEwID0gbGFtYmRhMSwgbGFtYmRhMSA9IHo7XG5cbiAgICB2YXIgZGVsdGEgPSBsYW1iZGExIC0gbGFtYmRhMCxcbiAgICAgICAgcG9sYXIgPSBhYnMoZGVsdGEgLSBwaSkgPCBlcHNpbG9uLFxuICAgICAgICBtZXJpZGlhbiA9IHBvbGFyIHx8IGRlbHRhIDwgZXBzaWxvbjtcblxuICAgIGlmICghcG9sYXIgJiYgcGhpMSA8IHBoaTApIHogPSBwaGkwLCBwaGkwID0gcGhpMSwgcGhpMSA9IHo7XG5cbiAgICAvLyBDaGVjayB0aGF0IHRoZSBmaXJzdCBwb2ludCBpcyBiZXR3ZWVuIGEgYW5kIGIuXG4gICAgaWYgKG1lcmlkaWFuXG4gICAgICAgID8gcG9sYXJcbiAgICAgICAgICA/IHBoaTAgKyBwaGkxID4gMCBeIHFbMV0gPCAoYWJzKHFbMF0gLSBsYW1iZGEwKSA8IGVwc2lsb24gPyBwaGkwIDogcGhpMSlcbiAgICAgICAgICA6IHBoaTAgPD0gcVsxXSAmJiBxWzFdIDw9IHBoaTFcbiAgICAgICAgOiBkZWx0YSA+IHBpIF4gKGxhbWJkYTAgPD0gcVswXSAmJiBxWzBdIDw9IGxhbWJkYTEpKSB7XG4gICAgICB2YXIgcTEgPSBjYXJ0ZXNpYW5TY2FsZSh1LCAoLXcgKyB0KSAvIHV1KTtcbiAgICAgIGNhcnRlc2lhbkFkZEluUGxhY2UocTEsIEEpO1xuICAgICAgcmV0dXJuIFtxLCBzcGhlcmljYWwocTEpXTtcbiAgICB9XG4gIH1cblxuICAvLyBHZW5lcmF0ZXMgYSA0LWJpdCB2ZWN0b3IgcmVwcmVzZW50aW5nIHRoZSBsb2NhdGlvbiBvZiBhIHBvaW50IHJlbGF0aXZlIHRvXG4gIC8vIHRoZSBzbWFsbCBjaXJjbGUncyBib3VuZGluZyBib3guXG4gIGZ1bmN0aW9uIGNvZGUobGFtYmRhLCBwaGkpIHtcbiAgICB2YXIgciA9IHNtYWxsUmFkaXVzID8gcmFkaXVzIDogcGkgLSByYWRpdXMsXG4gICAgICAgIGNvZGUgPSAwO1xuICAgIGlmIChsYW1iZGEgPCAtcikgY29kZSB8PSAxOyAvLyBsZWZ0XG4gICAgZWxzZSBpZiAobGFtYmRhID4gcikgY29kZSB8PSAyOyAvLyByaWdodFxuICAgIGlmIChwaGkgPCAtcikgY29kZSB8PSA0OyAvLyBiZWxvd1xuICAgIGVsc2UgaWYgKHBoaSA+IHIpIGNvZGUgfD0gODsgLy8gYWJvdmVcbiAgICByZXR1cm4gY29kZTtcbiAgfVxuXG4gIHJldHVybiBjbGlwKHZpc2libGUsIGNsaXBMaW5lLCBpbnRlcnBvbGF0ZSwgc21hbGxSYWRpdXMgPyBbMCwgLXJhZGl1c10gOiBbLXBpLCByYWRpdXMgLSBwaV0pO1xufVxuIiwiaW1wb3J0IGNsaXBCdWZmZXIgZnJvbSBcIi4vYnVmZmVyLmpzXCI7XG5pbXBvcnQgY2xpcFJlam9pbiBmcm9tIFwiLi9yZWpvaW4uanNcIjtcbmltcG9ydCB7ZXBzaWxvbiwgaGFsZlBpfSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuaW1wb3J0IHBvbHlnb25Db250YWlucyBmcm9tIFwiLi4vcG9seWdvbkNvbnRhaW5zLmpzXCI7XG5pbXBvcnQge21lcmdlfSBmcm9tIFwiZDMtYXJyYXlcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocG9pbnRWaXNpYmxlLCBjbGlwTGluZSwgaW50ZXJwb2xhdGUsIHN0YXJ0KSB7XG4gIHJldHVybiBmdW5jdGlvbihzaW5rKSB7XG4gICAgdmFyIGxpbmUgPSBjbGlwTGluZShzaW5rKSxcbiAgICAgICAgcmluZ0J1ZmZlciA9IGNsaXBCdWZmZXIoKSxcbiAgICAgICAgcmluZ1NpbmsgPSBjbGlwTGluZShyaW5nQnVmZmVyKSxcbiAgICAgICAgcG9seWdvblN0YXJ0ZWQgPSBmYWxzZSxcbiAgICAgICAgcG9seWdvbixcbiAgICAgICAgc2VnbWVudHMsXG4gICAgICAgIHJpbmc7XG5cbiAgICB2YXIgY2xpcCA9IHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgbGluZUVuZDogbGluZUVuZCxcbiAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsaXAucG9pbnQgPSBwb2ludFJpbmc7XG4gICAgICAgIGNsaXAubGluZVN0YXJ0ID0gcmluZ1N0YXJ0O1xuICAgICAgICBjbGlwLmxpbmVFbmQgPSByaW5nRW5kO1xuICAgICAgICBzZWdtZW50cyA9IFtdO1xuICAgICAgICBwb2x5Z29uID0gW107XG4gICAgICB9LFxuICAgICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsaXAucG9pbnQgPSBwb2ludDtcbiAgICAgICAgY2xpcC5saW5lU3RhcnQgPSBsaW5lU3RhcnQ7XG4gICAgICAgIGNsaXAubGluZUVuZCA9IGxpbmVFbmQ7XG4gICAgICAgIHNlZ21lbnRzID0gbWVyZ2Uoc2VnbWVudHMpO1xuICAgICAgICB2YXIgc3RhcnRJbnNpZGUgPSBwb2x5Z29uQ29udGFpbnMocG9seWdvbiwgc3RhcnQpO1xuICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFwb2x5Z29uU3RhcnRlZCkgc2luay5wb2x5Z29uU3RhcnQoKSwgcG9seWdvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgIGNsaXBSZWpvaW4oc2VnbWVudHMsIGNvbXBhcmVJbnRlcnNlY3Rpb24sIHN0YXJ0SW5zaWRlLCBpbnRlcnBvbGF0ZSwgc2luayk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnRJbnNpZGUpIHtcbiAgICAgICAgICBpZiAoIXBvbHlnb25TdGFydGVkKSBzaW5rLnBvbHlnb25TdGFydCgpLCBwb2x5Z29uU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgc2luay5saW5lU3RhcnQoKTtcbiAgICAgICAgICBpbnRlcnBvbGF0ZShudWxsLCBudWxsLCAxLCBzaW5rKTtcbiAgICAgICAgICBzaW5rLmxpbmVFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9seWdvblN0YXJ0ZWQpIHNpbmsucG9seWdvbkVuZCgpLCBwb2x5Z29uU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICBzZWdtZW50cyA9IHBvbHlnb24gPSBudWxsO1xuICAgICAgfSxcbiAgICAgIHNwaGVyZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpbmsucG9seWdvblN0YXJ0KCk7XG4gICAgICAgIHNpbmsubGluZVN0YXJ0KCk7XG4gICAgICAgIGludGVycG9sYXRlKG51bGwsIG51bGwsIDEsIHNpbmspO1xuICAgICAgICBzaW5rLmxpbmVFbmQoKTtcbiAgICAgICAgc2luay5wb2x5Z29uRW5kKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHBvaW50KGxhbWJkYSwgcGhpKSB7XG4gICAgICBpZiAocG9pbnRWaXNpYmxlKGxhbWJkYSwgcGhpKSkgc2luay5wb2ludChsYW1iZGEsIHBoaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9pbnRMaW5lKGxhbWJkYSwgcGhpKSB7XG4gICAgICBsaW5lLnBvaW50KGxhbWJkYSwgcGhpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICBjbGlwLnBvaW50ID0gcG9pbnRMaW5lO1xuICAgICAgbGluZS5saW5lU3RhcnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lRW5kKCkge1xuICAgICAgY2xpcC5wb2ludCA9IHBvaW50O1xuICAgICAgbGluZS5saW5lRW5kKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9pbnRSaW5nKGxhbWJkYSwgcGhpKSB7XG4gICAgICByaW5nLnB1c2goW2xhbWJkYSwgcGhpXSk7XG4gICAgICByaW5nU2luay5wb2ludChsYW1iZGEsIHBoaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmluZ1N0YXJ0KCkge1xuICAgICAgcmluZ1NpbmsubGluZVN0YXJ0KCk7XG4gICAgICByaW5nID0gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmluZ0VuZCgpIHtcbiAgICAgIHBvaW50UmluZyhyaW5nWzBdWzBdLCByaW5nWzBdWzFdKTtcbiAgICAgIHJpbmdTaW5rLmxpbmVFbmQoKTtcblxuICAgICAgdmFyIGNsZWFuID0gcmluZ1NpbmsuY2xlYW4oKSxcbiAgICAgICAgICByaW5nU2VnbWVudHMgPSByaW5nQnVmZmVyLnJlc3VsdCgpLFxuICAgICAgICAgIGksIG4gPSByaW5nU2VnbWVudHMubGVuZ3RoLCBtLFxuICAgICAgICAgIHNlZ21lbnQsXG4gICAgICAgICAgcG9pbnQ7XG5cbiAgICAgIHJpbmcucG9wKCk7XG4gICAgICBwb2x5Z29uLnB1c2gocmluZyk7XG4gICAgICByaW5nID0gbnVsbDtcblxuICAgICAgaWYgKCFuKSByZXR1cm47XG5cbiAgICAgIC8vIE5vIGludGVyc2VjdGlvbnMuXG4gICAgICBpZiAoY2xlYW4gJiAxKSB7XG4gICAgICAgIHNlZ21lbnQgPSByaW5nU2VnbWVudHNbMF07XG4gICAgICAgIGlmICgobSA9IHNlZ21lbnQubGVuZ3RoIC0gMSkgPiAwKSB7XG4gICAgICAgICAgaWYgKCFwb2x5Z29uU3RhcnRlZCkgc2luay5wb2x5Z29uU3RhcnQoKSwgcG9seWdvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgIHNpbmsubGluZVN0YXJ0KCk7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IG07ICsraSkgc2luay5wb2ludCgocG9pbnQgPSBzZWdtZW50W2ldKVswXSwgcG9pbnRbMV0pO1xuICAgICAgICAgIHNpbmsubGluZUVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUmVqb2luIGNvbm5lY3RlZCBzZWdtZW50cy5cbiAgICAgIC8vIFRPRE8gcmV1c2UgcmluZ0J1ZmZlci5yZWpvaW4oKT9cbiAgICAgIGlmIChuID4gMSAmJiBjbGVhbiAmIDIpIHJpbmdTZWdtZW50cy5wdXNoKHJpbmdTZWdtZW50cy5wb3AoKS5jb25jYXQocmluZ1NlZ21lbnRzLnNoaWZ0KCkpKTtcblxuICAgICAgc2VnbWVudHMucHVzaChyaW5nU2VnbWVudHMuZmlsdGVyKHZhbGlkU2VnbWVudCkpO1xuICAgIH1cblxuICAgIHJldHVybiBjbGlwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB2YWxpZFNlZ21lbnQoc2VnbWVudCkge1xuICByZXR1cm4gc2VnbWVudC5sZW5ndGggPiAxO1xufVxuXG4vLyBJbnRlcnNlY3Rpb25zIGFyZSBzb3J0ZWQgYWxvbmcgdGhlIGNsaXAgZWRnZS4gRm9yIGJvdGggYW50aW1lcmlkaWFuIGN1dHRpbmdcbi8vIGFuZCBjaXJjbGUgY2xpcHBpbmcsIHRoZSBzYW1lIGNvbXBhcmlzb24gaXMgdXNlZC5cbmZ1bmN0aW9uIGNvbXBhcmVJbnRlcnNlY3Rpb24oYSwgYikge1xuICByZXR1cm4gKChhID0gYS54KVswXSA8IDAgPyBhWzFdIC0gaGFsZlBpIC0gZXBzaWxvbiA6IGhhbGZQaSAtIGFbMV0pXG4gICAgICAgLSAoKGIgPSBiLngpWzBdIDwgMCA/IGJbMV0gLSBoYWxmUGkgLSBlcHNpbG9uIDogaGFsZlBpIC0gYlsxXSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiLCB4MCwgeTAsIHgxLCB5MSkge1xuICB2YXIgYXggPSBhWzBdLFxuICAgICAgYXkgPSBhWzFdLFxuICAgICAgYnggPSBiWzBdLFxuICAgICAgYnkgPSBiWzFdLFxuICAgICAgdDAgPSAwLFxuICAgICAgdDEgPSAxLFxuICAgICAgZHggPSBieCAtIGF4LFxuICAgICAgZHkgPSBieSAtIGF5LFxuICAgICAgcjtcblxuICByID0geDAgLSBheDtcbiAgaWYgKCFkeCAmJiByID4gMCkgcmV0dXJuO1xuICByIC89IGR4O1xuICBpZiAoZHggPCAwKSB7XG4gICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgIGlmIChyIDwgdDEpIHQxID0gcjtcbiAgfSBlbHNlIGlmIChkeCA+IDApIHtcbiAgICBpZiAociA+IHQxKSByZXR1cm47XG4gICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICB9XG5cbiAgciA9IHgxIC0gYXg7XG4gIGlmICghZHggJiYgciA8IDApIHJldHVybjtcbiAgciAvPSBkeDtcbiAgaWYgKGR4IDwgMCkge1xuICAgIGlmIChyID4gdDEpIHJldHVybjtcbiAgICBpZiAociA+IHQwKSB0MCA9IHI7XG4gIH0gZWxzZSBpZiAoZHggPiAwKSB7XG4gICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgIGlmIChyIDwgdDEpIHQxID0gcjtcbiAgfVxuXG4gIHIgPSB5MCAtIGF5O1xuICBpZiAoIWR5ICYmIHIgPiAwKSByZXR1cm47XG4gIHIgLz0gZHk7XG4gIGlmIChkeSA8IDApIHtcbiAgICBpZiAociA8IHQwKSByZXR1cm47XG4gICAgaWYgKHIgPCB0MSkgdDEgPSByO1xuICB9IGVsc2UgaWYgKGR5ID4gMCkge1xuICAgIGlmIChyID4gdDEpIHJldHVybjtcbiAgICBpZiAociA+IHQwKSB0MCA9IHI7XG4gIH1cblxuICByID0geTEgLSBheTtcbiAgaWYgKCFkeSAmJiByIDwgMCkgcmV0dXJuO1xuICByIC89IGR5O1xuICBpZiAoZHkgPCAwKSB7XG4gICAgaWYgKHIgPiB0MSkgcmV0dXJuO1xuICAgIGlmIChyID4gdDApIHQwID0gcjtcbiAgfSBlbHNlIGlmIChkeSA+IDApIHtcbiAgICBpZiAociA8IHQwKSByZXR1cm47XG4gICAgaWYgKHIgPCB0MSkgdDEgPSByO1xuICB9XG5cbiAgaWYgKHQwID4gMCkgYVswXSA9IGF4ICsgdDAgKiBkeCwgYVsxXSA9IGF5ICsgdDAgKiBkeTtcbiAgaWYgKHQxIDwgMSkgYlswXSA9IGF4ICsgdDEgKiBkeCwgYlsxXSA9IGF5ICsgdDEgKiBkeTtcbiAgcmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQge2FicywgZXBzaWxvbn0gZnJvbSBcIi4uL21hdGguanNcIjtcbmltcG9ydCBjbGlwQnVmZmVyIGZyb20gXCIuL2J1ZmZlci5qc1wiO1xuaW1wb3J0IGNsaXBMaW5lIGZyb20gXCIuL2xpbmUuanNcIjtcbmltcG9ydCBjbGlwUmVqb2luIGZyb20gXCIuL3Jlam9pbi5qc1wiO1xuaW1wb3J0IHttZXJnZX0gZnJvbSBcImQzLWFycmF5XCI7XG5cbnZhciBjbGlwTWF4ID0gMWU5LCBjbGlwTWluID0gLWNsaXBNYXg7XG5cbi8vIFRPRE8gVXNlIGQzLXBvbHlnb27igJlzIHBvbHlnb25Db250YWlucyBoZXJlIGZvciB0aGUgcmluZyBjaGVjaz9cbi8vIFRPRE8gRWxpbWluYXRlIGR1cGxpY2F0ZSBidWZmZXJpbmcgaW4gY2xpcEJ1ZmZlciBhbmQgcG9seWdvbi5wdXNoP1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGlwUmVjdGFuZ2xlKHgwLCB5MCwgeDEsIHkxKSB7XG5cbiAgZnVuY3Rpb24gdmlzaWJsZSh4LCB5KSB7XG4gICAgcmV0dXJuIHgwIDw9IHggJiYgeCA8PSB4MSAmJiB5MCA8PSB5ICYmIHkgPD0geTE7XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShmcm9tLCB0bywgZGlyZWN0aW9uLCBzdHJlYW0pIHtcbiAgICB2YXIgYSA9IDAsIGExID0gMDtcbiAgICBpZiAoZnJvbSA9PSBudWxsXG4gICAgICAgIHx8IChhID0gY29ybmVyKGZyb20sIGRpcmVjdGlvbikpICE9PSAoYTEgPSBjb3JuZXIodG8sIGRpcmVjdGlvbikpXG4gICAgICAgIHx8IGNvbXBhcmVQb2ludChmcm9tLCB0bykgPCAwIF4gZGlyZWN0aW9uID4gMCkge1xuICAgICAgZG8gc3RyZWFtLnBvaW50KGEgPT09IDAgfHwgYSA9PT0gMyA/IHgwIDogeDEsIGEgPiAxID8geTEgOiB5MCk7XG4gICAgICB3aGlsZSAoKGEgPSAoYSArIGRpcmVjdGlvbiArIDQpICUgNCkgIT09IGExKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyZWFtLnBvaW50KHRvWzBdLCB0b1sxXSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29ybmVyKHAsIGRpcmVjdGlvbikge1xuICAgIHJldHVybiBhYnMocFswXSAtIHgwKSA8IGVwc2lsb24gPyBkaXJlY3Rpb24gPiAwID8gMCA6IDNcbiAgICAgICAgOiBhYnMocFswXSAtIHgxKSA8IGVwc2lsb24gPyBkaXJlY3Rpb24gPiAwID8gMiA6IDFcbiAgICAgICAgOiBhYnMocFsxXSAtIHkwKSA8IGVwc2lsb24gPyBkaXJlY3Rpb24gPiAwID8gMSA6IDBcbiAgICAgICAgOiBkaXJlY3Rpb24gPiAwID8gMyA6IDI7IC8vIGFicyhwWzFdIC0geTEpIDwgZXBzaWxvblxuICB9XG5cbiAgZnVuY3Rpb24gY29tcGFyZUludGVyc2VjdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGNvbXBhcmVQb2ludChhLngsIGIueCk7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wYXJlUG9pbnQoYSwgYikge1xuICAgIHZhciBjYSA9IGNvcm5lcihhLCAxKSxcbiAgICAgICAgY2IgPSBjb3JuZXIoYiwgMSk7XG4gICAgcmV0dXJuIGNhICE9PSBjYiA/IGNhIC0gY2JcbiAgICAgICAgOiBjYSA9PT0gMCA/IGJbMV0gLSBhWzFdXG4gICAgICAgIDogY2EgPT09IDEgPyBhWzBdIC0gYlswXVxuICAgICAgICA6IGNhID09PSAyID8gYVsxXSAtIGJbMV1cbiAgICAgICAgOiBiWzBdIC0gYVswXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICB2YXIgYWN0aXZlU3RyZWFtID0gc3RyZWFtLFxuICAgICAgICBidWZmZXJTdHJlYW0gPSBjbGlwQnVmZmVyKCksXG4gICAgICAgIHNlZ21lbnRzLFxuICAgICAgICBwb2x5Z29uLFxuICAgICAgICByaW5nLFxuICAgICAgICB4X18sIHlfXywgdl9fLCAvLyBmaXJzdCBwb2ludFxuICAgICAgICB4XywgeV8sIHZfLCAvLyBwcmV2aW91cyBwb2ludFxuICAgICAgICBmaXJzdCxcbiAgICAgICAgY2xlYW47XG5cbiAgICB2YXIgY2xpcFN0cmVhbSA9IHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgbGluZUVuZDogbGluZUVuZCxcbiAgICAgIHBvbHlnb25TdGFydDogcG9seWdvblN0YXJ0LFxuICAgICAgcG9seWdvbkVuZDogcG9seWdvbkVuZFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb2ludCh4LCB5KSB7XG4gICAgICBpZiAodmlzaWJsZSh4LCB5KSkgYWN0aXZlU3RyZWFtLnBvaW50KHgsIHkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvbHlnb25JbnNpZGUoKSB7XG4gICAgICB2YXIgd2luZGluZyA9IDA7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcG9seWdvbi5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgcmluZyA9IHBvbHlnb25baV0sIGogPSAxLCBtID0gcmluZy5sZW5ndGgsIHBvaW50ID0gcmluZ1swXSwgYTAsIGExLCBiMCA9IHBvaW50WzBdLCBiMSA9IHBvaW50WzFdOyBqIDwgbTsgKytqKSB7XG4gICAgICAgICAgYTAgPSBiMCwgYTEgPSBiMSwgcG9pbnQgPSByaW5nW2pdLCBiMCA9IHBvaW50WzBdLCBiMSA9IHBvaW50WzFdO1xuICAgICAgICAgIGlmIChhMSA8PSB5MSkgeyBpZiAoYjEgPiB5MSAmJiAoYjAgLSBhMCkgKiAoeTEgLSBhMSkgPiAoYjEgLSBhMSkgKiAoeDAgLSBhMCkpICsrd2luZGluZzsgfVxuICAgICAgICAgIGVsc2UgeyBpZiAoYjEgPD0geTEgJiYgKGIwIC0gYTApICogKHkxIC0gYTEpIDwgKGIxIC0gYTEpICogKHgwIC0gYTApKSAtLXdpbmRpbmc7IH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2luZGluZztcbiAgICB9XG5cbiAgICAvLyBCdWZmZXIgZ2VvbWV0cnkgd2l0aGluIGEgcG9seWdvbiBhbmQgdGhlbiBjbGlwIGl0IGVuIG1hc3NlLlxuICAgIGZ1bmN0aW9uIHBvbHlnb25TdGFydCgpIHtcbiAgICAgIGFjdGl2ZVN0cmVhbSA9IGJ1ZmZlclN0cmVhbSwgc2VnbWVudHMgPSBbXSwgcG9seWdvbiA9IFtdLCBjbGVhbiA9IHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9seWdvbkVuZCgpIHtcbiAgICAgIHZhciBzdGFydEluc2lkZSA9IHBvbHlnb25JbnNpZGUoKSxcbiAgICAgICAgICBjbGVhbkluc2lkZSA9IGNsZWFuICYmIHN0YXJ0SW5zaWRlLFxuICAgICAgICAgIHZpc2libGUgPSAoc2VnbWVudHMgPSBtZXJnZShzZWdtZW50cykpLmxlbmd0aDtcbiAgICAgIGlmIChjbGVhbkluc2lkZSB8fCB2aXNpYmxlKSB7XG4gICAgICAgIHN0cmVhbS5wb2x5Z29uU3RhcnQoKTtcbiAgICAgICAgaWYgKGNsZWFuSW5zaWRlKSB7XG4gICAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGludGVycG9sYXRlKG51bGwsIG51bGwsIDEsIHN0cmVhbSk7XG4gICAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlzaWJsZSkge1xuICAgICAgICAgIGNsaXBSZWpvaW4oc2VnbWVudHMsIGNvbXBhcmVJbnRlcnNlY3Rpb24sIHN0YXJ0SW5zaWRlLCBpbnRlcnBvbGF0ZSwgc3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgICBzdHJlYW0ucG9seWdvbkVuZCgpO1xuICAgICAgfVxuICAgICAgYWN0aXZlU3RyZWFtID0gc3RyZWFtLCBzZWdtZW50cyA9IHBvbHlnb24gPSByaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICBjbGlwU3RyZWFtLnBvaW50ID0gbGluZVBvaW50O1xuICAgICAgaWYgKHBvbHlnb24pIHBvbHlnb24ucHVzaChyaW5nID0gW10pO1xuICAgICAgZmlyc3QgPSB0cnVlO1xuICAgICAgdl8gPSBmYWxzZTtcbiAgICAgIHhfID0geV8gPSBOYU47XG4gICAgfVxuXG4gICAgLy8gVE9ETyByYXRoZXIgdGhhbiBzcGVjaWFsLWNhc2UgcG9seWdvbnMsIHNpbXBseSBoYW5kbGUgdGhlbSBzZXBhcmF0ZWx5LlxuICAgIC8vIElkZWFsbHksIGNvaW5jaWRlbnQgaW50ZXJzZWN0aW9uIHBvaW50cyBzaG91bGQgYmUgaml0dGVyZWQgdG8gYXZvaWRcbiAgICAvLyBjbGlwcGluZyBpc3N1ZXMuXG4gICAgZnVuY3Rpb24gbGluZUVuZCgpIHtcbiAgICAgIGlmIChzZWdtZW50cykge1xuICAgICAgICBsaW5lUG9pbnQoeF9fLCB5X18pO1xuICAgICAgICBpZiAodl9fICYmIHZfKSBidWZmZXJTdHJlYW0ucmVqb2luKCk7XG4gICAgICAgIHNlZ21lbnRzLnB1c2goYnVmZmVyU3RyZWFtLnJlc3VsdCgpKTtcbiAgICAgIH1cbiAgICAgIGNsaXBTdHJlYW0ucG9pbnQgPSBwb2ludDtcbiAgICAgIGlmICh2XykgYWN0aXZlU3RyZWFtLmxpbmVFbmQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lUG9pbnQoeCwgeSkge1xuICAgICAgdmFyIHYgPSB2aXNpYmxlKHgsIHkpO1xuICAgICAgaWYgKHBvbHlnb24pIHJpbmcucHVzaChbeCwgeV0pO1xuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIHhfXyA9IHgsIHlfXyA9IHksIHZfXyA9IHY7XG4gICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgYWN0aXZlU3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGFjdGl2ZVN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHYgJiYgdl8pIGFjdGl2ZVN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGEgPSBbeF8gPSBNYXRoLm1heChjbGlwTWluLCBNYXRoLm1pbihjbGlwTWF4LCB4XykpLCB5XyA9IE1hdGgubWF4KGNsaXBNaW4sIE1hdGgubWluKGNsaXBNYXgsIHlfKSldLFxuICAgICAgICAgICAgICBiID0gW3ggPSBNYXRoLm1heChjbGlwTWluLCBNYXRoLm1pbihjbGlwTWF4LCB4KSksIHkgPSBNYXRoLm1heChjbGlwTWluLCBNYXRoLm1pbihjbGlwTWF4LCB5KSldO1xuICAgICAgICAgIGlmIChjbGlwTGluZShhLCBiLCB4MCwgeTAsIHgxLCB5MSkpIHtcbiAgICAgICAgICAgIGlmICghdl8pIHtcbiAgICAgICAgICAgICAgYWN0aXZlU3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgICBhY3RpdmVTdHJlYW0ucG9pbnQoYVswXSwgYVsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY3RpdmVTdHJlYW0ucG9pbnQoYlswXSwgYlsxXSk7XG4gICAgICAgICAgICBpZiAoIXYpIGFjdGl2ZVN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgICAgICBjbGVhbiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAodikge1xuICAgICAgICAgICAgYWN0aXZlU3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgYWN0aXZlU3RyZWFtLnBvaW50KHgsIHkpO1xuICAgICAgICAgICAgY2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHhfID0geCwgeV8gPSB5LCB2XyA9IHY7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsaXBTdHJlYW07XG4gIH07XG59XG4iLCJpbXBvcnQgcG9pbnRFcXVhbCBmcm9tIFwiLi4vcG9pbnRFcXVhbC5qc1wiO1xuaW1wb3J0IHtlcHNpbG9ufSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBJbnRlcnNlY3Rpb24ocG9pbnQsIHBvaW50cywgb3RoZXIsIGVudHJ5KSB7XG4gIHRoaXMueCA9IHBvaW50O1xuICB0aGlzLnogPSBwb2ludHM7XG4gIHRoaXMubyA9IG90aGVyOyAvLyBhbm90aGVyIGludGVyc2VjdGlvblxuICB0aGlzLmUgPSBlbnRyeTsgLy8gaXMgYW4gZW50cnk/XG4gIHRoaXMudiA9IGZhbHNlOyAvLyB2aXNpdGVkXG4gIHRoaXMubiA9IHRoaXMucCA9IG51bGw7IC8vIG5leHQgJiBwcmV2aW91c1xufVxuXG4vLyBBIGdlbmVyYWxpemVkIHBvbHlnb24gY2xpcHBpbmcgYWxnb3JpdGhtOiBnaXZlbiBhIHBvbHlnb24gdGhhdCBoYXMgYmVlbiBjdXRcbi8vIGludG8gaXRzIHZpc2libGUgbGluZSBzZWdtZW50cywgYW5kIHJlam9pbnMgdGhlIHNlZ21lbnRzIGJ5IGludGVycG9sYXRpbmdcbi8vIGFsb25nIHRoZSBjbGlwIGVkZ2UuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWdtZW50cywgY29tcGFyZUludGVyc2VjdGlvbiwgc3RhcnRJbnNpZGUsIGludGVycG9sYXRlLCBzdHJlYW0pIHtcbiAgdmFyIHN1YmplY3QgPSBbXSxcbiAgICAgIGNsaXAgPSBbXSxcbiAgICAgIGksXG4gICAgICBuO1xuXG4gIHNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24oc2VnbWVudCkge1xuICAgIGlmICgobiA9IHNlZ21lbnQubGVuZ3RoIC0gMSkgPD0gMCkgcmV0dXJuO1xuICAgIHZhciBuLCBwMCA9IHNlZ21lbnRbMF0sIHAxID0gc2VnbWVudFtuXSwgeDtcblxuICAgIGlmIChwb2ludEVxdWFsKHAwLCBwMSkpIHtcbiAgICAgIGlmICghcDBbMl0gJiYgIXAxWzJdKSB7XG4gICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkgc3RyZWFtLnBvaW50KChwMCA9IHNlZ21lbnRbaV0pWzBdLCBwMFsxXSk7XG4gICAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGhhbmRsZSBkZWdlbmVyYXRlIGNhc2VzIGJ5IG1vdmluZyB0aGUgcG9pbnRcbiAgICAgIHAxWzBdICs9IDIgKiBlcHNpbG9uO1xuICAgIH1cblxuICAgIHN1YmplY3QucHVzaCh4ID0gbmV3IEludGVyc2VjdGlvbihwMCwgc2VnbWVudCwgbnVsbCwgdHJ1ZSkpO1xuICAgIGNsaXAucHVzaCh4Lm8gPSBuZXcgSW50ZXJzZWN0aW9uKHAwLCBudWxsLCB4LCBmYWxzZSkpO1xuICAgIHN1YmplY3QucHVzaCh4ID0gbmV3IEludGVyc2VjdGlvbihwMSwgc2VnbWVudCwgbnVsbCwgZmFsc2UpKTtcbiAgICBjbGlwLnB1c2goeC5vID0gbmV3IEludGVyc2VjdGlvbihwMSwgbnVsbCwgeCwgdHJ1ZSkpO1xuICB9KTtcblxuICBpZiAoIXN1YmplY3QubGVuZ3RoKSByZXR1cm47XG5cbiAgY2xpcC5zb3J0KGNvbXBhcmVJbnRlcnNlY3Rpb24pO1xuICBsaW5rKHN1YmplY3QpO1xuICBsaW5rKGNsaXApO1xuXG4gIGZvciAoaSA9IDAsIG4gPSBjbGlwLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGNsaXBbaV0uZSA9IHN0YXJ0SW5zaWRlID0gIXN0YXJ0SW5zaWRlO1xuICB9XG5cbiAgdmFyIHN0YXJ0ID0gc3ViamVjdFswXSxcbiAgICAgIHBvaW50cyxcbiAgICAgIHBvaW50O1xuXG4gIHdoaWxlICgxKSB7XG4gICAgLy8gRmluZCBmaXJzdCB1bnZpc2l0ZWQgaW50ZXJzZWN0aW9uLlxuICAgIHZhciBjdXJyZW50ID0gc3RhcnQsXG4gICAgICAgIGlzU3ViamVjdCA9IHRydWU7XG4gICAgd2hpbGUgKGN1cnJlbnQudikgaWYgKChjdXJyZW50ID0gY3VycmVudC5uKSA9PT0gc3RhcnQpIHJldHVybjtcbiAgICBwb2ludHMgPSBjdXJyZW50Lno7XG4gICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgIGRvIHtcbiAgICAgIGN1cnJlbnQudiA9IGN1cnJlbnQuby52ID0gdHJ1ZTtcbiAgICAgIGlmIChjdXJyZW50LmUpIHtcbiAgICAgICAgaWYgKGlzU3ViamVjdCkge1xuICAgICAgICAgIGZvciAoaSA9IDAsIG4gPSBwb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSBzdHJlYW0ucG9pbnQoKHBvaW50ID0gcG9pbnRzW2ldKVswXSwgcG9pbnRbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGludGVycG9sYXRlKGN1cnJlbnQueCwgY3VycmVudC5uLngsIDEsIHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc1N1YmplY3QpIHtcbiAgICAgICAgICBwb2ludHMgPSBjdXJyZW50LnAuejtcbiAgICAgICAgICBmb3IgKGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHN0cmVhbS5wb2ludCgocG9pbnQgPSBwb2ludHNbaV0pWzBdLCBwb2ludFsxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW50ZXJwb2xhdGUoY3VycmVudC54LCBjdXJyZW50LnAueCwgLTEsIHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucDtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm87XG4gICAgICBwb2ludHMgPSBjdXJyZW50Lno7XG4gICAgICBpc1N1YmplY3QgPSAhaXNTdWJqZWN0O1xuICAgIH0gd2hpbGUgKCFjdXJyZW50LnYpO1xuICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbGluayhhcnJheSkge1xuICBpZiAoIShuID0gYXJyYXkubGVuZ3RoKSkgcmV0dXJuO1xuICB2YXIgbixcbiAgICAgIGkgPSAwLFxuICAgICAgYSA9IGFycmF5WzBdLFxuICAgICAgYjtcbiAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICBhLm4gPSBiID0gYXJyYXlbaV07XG4gICAgYi5wID0gYTtcbiAgICBhID0gYjtcbiAgfVxuICBhLm4gPSBiID0gYXJyYXlbMF07XG4gIGIucCA9IGE7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG5cbiAgZnVuY3Rpb24gY29tcG9zZSh4LCB5KSB7XG4gICAgcmV0dXJuIHggPSBhKHgsIHkpLCBiKHhbMF0sIHhbMV0pO1xuICB9XG5cbiAgaWYgKGEuaW52ZXJ0ICYmIGIuaW52ZXJ0KSBjb21wb3NlLmludmVydCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICByZXR1cm4geCA9IGIuaW52ZXJ0KHgsIHkpLCB4ICYmIGEuaW52ZXJ0KHhbMF0sIHhbMV0pO1xuICB9O1xuXG4gIHJldHVybiBjb21wb3NlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCB4ID0+IHg7XG4iLCJleHBvcnQgdmFyIGVwc2lsb24gPSAxZS02O1xuZXhwb3J0IHZhciBlcHNpbG9uMiA9IDFlLTEyO1xuZXhwb3J0IHZhciBwaSA9IE1hdGguUEk7XG5leHBvcnQgdmFyIGhhbGZQaSA9IHBpIC8gMjtcbmV4cG9ydCB2YXIgcXVhcnRlclBpID0gcGkgLyA0O1xuZXhwb3J0IHZhciB0YXUgPSBwaSAqIDI7XG5cbmV4cG9ydCB2YXIgZGVncmVlcyA9IDE4MCAvIHBpO1xuZXhwb3J0IHZhciByYWRpYW5zID0gcGkgLyAxODA7XG5cbmV4cG9ydCB2YXIgYWJzID0gTWF0aC5hYnM7XG5leHBvcnQgdmFyIGF0YW4gPSBNYXRoLmF0YW47XG5leHBvcnQgdmFyIGF0YW4yID0gTWF0aC5hdGFuMjtcbmV4cG9ydCB2YXIgY29zID0gTWF0aC5jb3M7XG5leHBvcnQgdmFyIGNlaWwgPSBNYXRoLmNlaWw7XG5leHBvcnQgdmFyIGV4cCA9IE1hdGguZXhwO1xuZXhwb3J0IHZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5leHBvcnQgdmFyIGh5cG90ID0gTWF0aC5oeXBvdDtcbmV4cG9ydCB2YXIgbG9nID0gTWF0aC5sb2c7XG5leHBvcnQgdmFyIHBvdyA9IE1hdGgucG93O1xuZXhwb3J0IHZhciBzaW4gPSBNYXRoLnNpbjtcbmV4cG9ydCB2YXIgc2lnbiA9IE1hdGguc2lnbiB8fCBmdW5jdGlvbih4KSB7IHJldHVybiB4ID4gMCA/IDEgOiB4IDwgMCA/IC0xIDogMDsgfTtcbmV4cG9ydCB2YXIgc3FydCA9IE1hdGguc3FydDtcbmV4cG9ydCB2YXIgdGFuID0gTWF0aC50YW47XG5cbmV4cG9ydCBmdW5jdGlvbiBhY29zKHgpIHtcbiAgcmV0dXJuIHggPiAxID8gMCA6IHggPCAtMSA/IHBpIDogTWF0aC5hY29zKHgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNpbih4KSB7XG4gIHJldHVybiB4ID4gMSA/IGhhbGZQaSA6IHggPCAtMSA/IC1oYWxmUGkgOiBNYXRoLmFzaW4oeCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXZlcnNpbih4KSB7XG4gIHJldHVybiAoeCA9IHNpbih4IC8gMikpICogeDtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vb3AoKSB7fVxuIiwiaW1wb3J0IG5vb3AgZnJvbSBcIi4uL25vb3AuanNcIjtcblxudmFyIHgwID0gSW5maW5pdHksXG4gICAgeTAgPSB4MCxcbiAgICB4MSA9IC14MCxcbiAgICB5MSA9IHgxO1xuXG52YXIgYm91bmRzU3RyZWFtID0ge1xuICBwb2ludDogYm91bmRzUG9pbnQsXG4gIGxpbmVTdGFydDogbm9vcCxcbiAgbGluZUVuZDogbm9vcCxcbiAgcG9seWdvblN0YXJ0OiBub29wLFxuICBwb2x5Z29uRW5kOiBub29wLFxuICByZXN1bHQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBib3VuZHMgPSBbW3gwLCB5MF0sIFt4MSwgeTFdXTtcbiAgICB4MSA9IHkxID0gLSh5MCA9IHgwID0gSW5maW5pdHkpO1xuICAgIHJldHVybiBib3VuZHM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJvdW5kc1BvaW50KHgsIHkpIHtcbiAgaWYgKHggPCB4MCkgeDAgPSB4O1xuICBpZiAoeCA+IHgxKSB4MSA9IHg7XG4gIGlmICh5IDwgeTApIHkwID0geTtcbiAgaWYgKHkgPiB5MSkgeTEgPSB5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBib3VuZHNTdHJlYW07XG4iLCJpbXBvcnQge2FicywgZXBzaWxvbn0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhYnMoYVswXSAtIGJbMF0pIDwgZXBzaWxvbiAmJiBhYnMoYVsxXSAtIGJbMV0pIDwgZXBzaWxvbjtcbn1cbiIsImltcG9ydCB7QWRkZXJ9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtjYXJ0ZXNpYW4sIGNhcnRlc2lhbkNyb3NzLCBjYXJ0ZXNpYW5Ob3JtYWxpemVJblBsYWNlfSBmcm9tIFwiLi9jYXJ0ZXNpYW4uanNcIjtcbmltcG9ydCB7YWJzLCBhc2luLCBhdGFuMiwgY29zLCBlcHNpbG9uLCBlcHNpbG9uMiwgaGFsZlBpLCBwaSwgcXVhcnRlclBpLCBzaWduLCBzaW4sIHRhdX0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBsb25naXR1ZGUocG9pbnQpIHtcbiAgcmV0dXJuIGFicyhwb2ludFswXSkgPD0gcGkgPyBwb2ludFswXSA6IHNpZ24ocG9pbnRbMF0pICogKChhYnMocG9pbnRbMF0pICsgcGkpICUgdGF1IC0gcGkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihwb2x5Z29uLCBwb2ludCkge1xuICB2YXIgbGFtYmRhID0gbG9uZ2l0dWRlKHBvaW50KSxcbiAgICAgIHBoaSA9IHBvaW50WzFdLFxuICAgICAgc2luUGhpID0gc2luKHBoaSksXG4gICAgICBub3JtYWwgPSBbc2luKGxhbWJkYSksIC1jb3MobGFtYmRhKSwgMF0sXG4gICAgICBhbmdsZSA9IDAsXG4gICAgICB3aW5kaW5nID0gMDtcblxuICB2YXIgc3VtID0gbmV3IEFkZGVyKCk7XG5cbiAgaWYgKHNpblBoaSA9PT0gMSkgcGhpID0gaGFsZlBpICsgZXBzaWxvbjtcbiAgZWxzZSBpZiAoc2luUGhpID09PSAtMSkgcGhpID0gLWhhbGZQaSAtIGVwc2lsb247XG5cbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBwb2x5Z29uLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmICghKG0gPSAocmluZyA9IHBvbHlnb25baV0pLmxlbmd0aCkpIGNvbnRpbnVlO1xuICAgIHZhciByaW5nLFxuICAgICAgICBtLFxuICAgICAgICBwb2ludDAgPSByaW5nW20gLSAxXSxcbiAgICAgICAgbGFtYmRhMCA9IGxvbmdpdHVkZShwb2ludDApLFxuICAgICAgICBwaGkwID0gcG9pbnQwWzFdIC8gMiArIHF1YXJ0ZXJQaSxcbiAgICAgICAgc2luUGhpMCA9IHNpbihwaGkwKSxcbiAgICAgICAgY29zUGhpMCA9IGNvcyhwaGkwKTtcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbTsgKytqLCBsYW1iZGEwID0gbGFtYmRhMSwgc2luUGhpMCA9IHNpblBoaTEsIGNvc1BoaTAgPSBjb3NQaGkxLCBwb2ludDAgPSBwb2ludDEpIHtcbiAgICAgIHZhciBwb2ludDEgPSByaW5nW2pdLFxuICAgICAgICAgIGxhbWJkYTEgPSBsb25naXR1ZGUocG9pbnQxKSxcbiAgICAgICAgICBwaGkxID0gcG9pbnQxWzFdIC8gMiArIHF1YXJ0ZXJQaSxcbiAgICAgICAgICBzaW5QaGkxID0gc2luKHBoaTEpLFxuICAgICAgICAgIGNvc1BoaTEgPSBjb3MocGhpMSksXG4gICAgICAgICAgZGVsdGEgPSBsYW1iZGExIC0gbGFtYmRhMCxcbiAgICAgICAgICBzaWduID0gZGVsdGEgPj0gMCA/IDEgOiAtMSxcbiAgICAgICAgICBhYnNEZWx0YSA9IHNpZ24gKiBkZWx0YSxcbiAgICAgICAgICBhbnRpbWVyaWRpYW4gPSBhYnNEZWx0YSA+IHBpLFxuICAgICAgICAgIGsgPSBzaW5QaGkwICogc2luUGhpMTtcblxuICAgICAgc3VtLmFkZChhdGFuMihrICogc2lnbiAqIHNpbihhYnNEZWx0YSksIGNvc1BoaTAgKiBjb3NQaGkxICsgayAqIGNvcyhhYnNEZWx0YSkpKTtcbiAgICAgIGFuZ2xlICs9IGFudGltZXJpZGlhbiA/IGRlbHRhICsgc2lnbiAqIHRhdSA6IGRlbHRhO1xuXG4gICAgICAvLyBBcmUgdGhlIGxvbmdpdHVkZXMgZWl0aGVyIHNpZGUgb2YgdGhlIHBvaW504oCZcyBtZXJpZGlhbiAobGFtYmRhKSxcbiAgICAgIC8vIGFuZCBhcmUgdGhlIGxhdGl0dWRlcyBzbWFsbGVyIHRoYW4gdGhlIHBhcmFsbGVsIChwaGkpP1xuICAgICAgaWYgKGFudGltZXJpZGlhbiBeIGxhbWJkYTAgPj0gbGFtYmRhIF4gbGFtYmRhMSA+PSBsYW1iZGEpIHtcbiAgICAgICAgdmFyIGFyYyA9IGNhcnRlc2lhbkNyb3NzKGNhcnRlc2lhbihwb2ludDApLCBjYXJ0ZXNpYW4ocG9pbnQxKSk7XG4gICAgICAgIGNhcnRlc2lhbk5vcm1hbGl6ZUluUGxhY2UoYXJjKTtcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbiA9IGNhcnRlc2lhbkNyb3NzKG5vcm1hbCwgYXJjKTtcbiAgICAgICAgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShpbnRlcnNlY3Rpb24pO1xuICAgICAgICB2YXIgcGhpQXJjID0gKGFudGltZXJpZGlhbiBeIGRlbHRhID49IDAgPyAtMSA6IDEpICogYXNpbihpbnRlcnNlY3Rpb25bMl0pO1xuICAgICAgICBpZiAocGhpID4gcGhpQXJjIHx8IHBoaSA9PT0gcGhpQXJjICYmIChhcmNbMF0gfHwgYXJjWzFdKSkge1xuICAgICAgICAgIHdpbmRpbmcgKz0gYW50aW1lcmlkaWFuIF4gZGVsdGEgPj0gMCA/IDEgOiAtMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEZpcnN0LCBkZXRlcm1pbmUgd2hldGhlciB0aGUgU291dGggcG9sZSBpcyBpbnNpZGUgb3Igb3V0c2lkZTpcbiAgLy9cbiAgLy8gSXQgaXMgaW5zaWRlIGlmOlxuICAvLyAqIHRoZSBwb2x5Z29uIHdpbmRzIGFyb3VuZCBpdCBpbiBhIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gIC8vICogdGhlIHBvbHlnb24gZG9lcyBub3QgKGN1bXVsYXRpdmVseSkgd2luZCBhcm91bmQgaXQsIGJ1dCBoYXMgYSBuZWdhdGl2ZVxuICAvLyAgIChjb3VudGVyLWNsb2Nrd2lzZSkgYXJlYS5cbiAgLy9cbiAgLy8gU2Vjb25kLCBjb3VudCB0aGUgKHNpZ25lZCkgbnVtYmVyIG9mIHRpbWVzIGEgc2VnbWVudCBjcm9zc2VzIGEgbGFtYmRhXG4gIC8vIGZyb20gdGhlIHBvaW50IHRvIHRoZSBTb3V0aCBwb2xlLiAgSWYgaXQgaXMgemVybywgdGhlbiB0aGUgcG9pbnQgaXMgdGhlXG4gIC8vIHNhbWUgc2lkZSBhcyB0aGUgU291dGggcG9sZS5cblxuICByZXR1cm4gKGFuZ2xlIDwgLWVwc2lsb24gfHwgYW5nbGUgPCBlcHNpbG9uICYmIHN1bSA8IC1lcHNpbG9uMikgXiAod2luZGluZyAmIDEpO1xufVxuIiwiaW1wb3J0IHthc2luLCBhdGFuMiwgY29zLCBzaW4sIHNxcnR9IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhemltdXRoYWxSYXcoc2NhbGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgY3ggPSBjb3MoeCksXG4gICAgICAgIGN5ID0gY29zKHkpLFxuICAgICAgICBrID0gc2NhbGUoY3ggKiBjeSk7XG4gICAgICAgIGlmIChrID09PSBJbmZpbml0eSkgcmV0dXJuIFsyLCAwXTtcbiAgICByZXR1cm4gW1xuICAgICAgayAqIGN5ICogc2luKHgpLFxuICAgICAgayAqIHNpbih5KVxuICAgIF07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF6aW11dGhhbEludmVydChhbmdsZSkge1xuICByZXR1cm4gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciB6ID0gc3FydCh4ICogeCArIHkgKiB5KSxcbiAgICAgICAgYyA9IGFuZ2xlKHopLFxuICAgICAgICBzYyA9IHNpbihjKSxcbiAgICAgICAgY2MgPSBjb3MoYyk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGF0YW4yKHggKiBzYywgeiAqIGNjKSxcbiAgICAgIGFzaW4oeiAmJiB5ICogc2MgLyB6KVxuICAgIF07XG4gIH1cbn1cbiIsImltcG9ydCB7YXNpbiwgc3FydH0gZnJvbSBcIi4uL21hdGguanNcIjtcbmltcG9ydCB7YXppbXV0aGFsUmF3LCBhemltdXRoYWxJbnZlcnR9IGZyb20gXCIuL2F6aW11dGhhbC5qc1wiO1xuaW1wb3J0IHByb2plY3Rpb24gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IHZhciBhemltdXRoYWxFcXVhbEFyZWFSYXcgPSBhemltdXRoYWxSYXcoZnVuY3Rpb24oY3hjeSkge1xuICByZXR1cm4gc3FydCgyIC8gKDEgKyBjeGN5KSk7XG59KTtcblxuYXppbXV0aGFsRXF1YWxBcmVhUmF3LmludmVydCA9IGF6aW11dGhhbEludmVydChmdW5jdGlvbih6KSB7XG4gIHJldHVybiAyICogYXNpbih6IC8gMik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBwcm9qZWN0aW9uKGF6aW11dGhhbEVxdWFsQXJlYVJhdylcbiAgICAgIC5zY2FsZSgxMjQuNzUpXG4gICAgICAuY2xpcEFuZ2xlKDE4MCAtIDFlLTMpO1xufVxuIiwiaW1wb3J0IHtkZWZhdWx0IGFzIGdlb1N0cmVhbX0gZnJvbSBcIi4uL3N0cmVhbS5qc1wiO1xuaW1wb3J0IGJvdW5kc1N0cmVhbSBmcm9tIFwiLi4vcGF0aC9ib3VuZHMuanNcIjtcblxuZnVuY3Rpb24gZml0KHByb2plY3Rpb24sIGZpdEJvdW5kcywgb2JqZWN0KSB7XG4gIHZhciBjbGlwID0gcHJvamVjdGlvbi5jbGlwRXh0ZW50ICYmIHByb2plY3Rpb24uY2xpcEV4dGVudCgpO1xuICBwcm9qZWN0aW9uLnNjYWxlKDE1MCkudHJhbnNsYXRlKFswLCAwXSk7XG4gIGlmIChjbGlwICE9IG51bGwpIHByb2plY3Rpb24uY2xpcEV4dGVudChudWxsKTtcbiAgZ2VvU3RyZWFtKG9iamVjdCwgcHJvamVjdGlvbi5zdHJlYW0oYm91bmRzU3RyZWFtKSk7XG4gIGZpdEJvdW5kcyhib3VuZHNTdHJlYW0ucmVzdWx0KCkpO1xuICBpZiAoY2xpcCAhPSBudWxsKSBwcm9qZWN0aW9uLmNsaXBFeHRlbnQoY2xpcCk7XG4gIHJldHVybiBwcm9qZWN0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZml0RXh0ZW50KHByb2plY3Rpb24sIGV4dGVudCwgb2JqZWN0KSB7XG4gIHJldHVybiBmaXQocHJvamVjdGlvbiwgZnVuY3Rpb24oYikge1xuICAgIHZhciB3ID0gZXh0ZW50WzFdWzBdIC0gZXh0ZW50WzBdWzBdLFxuICAgICAgICBoID0gZXh0ZW50WzFdWzFdIC0gZXh0ZW50WzBdWzFdLFxuICAgICAgICBrID0gTWF0aC5taW4odyAvIChiWzFdWzBdIC0gYlswXVswXSksIGggLyAoYlsxXVsxXSAtIGJbMF1bMV0pKSxcbiAgICAgICAgeCA9ICtleHRlbnRbMF1bMF0gKyAodyAtIGsgKiAoYlsxXVswXSArIGJbMF1bMF0pKSAvIDIsXG4gICAgICAgIHkgPSArZXh0ZW50WzBdWzFdICsgKGggLSBrICogKGJbMV1bMV0gKyBiWzBdWzFdKSkgLyAyO1xuICAgIHByb2plY3Rpb24uc2NhbGUoMTUwICogaykudHJhbnNsYXRlKFt4LCB5XSk7XG4gIH0sIG9iamVjdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXRTaXplKHByb2plY3Rpb24sIHNpemUsIG9iamVjdCkge1xuICByZXR1cm4gZml0RXh0ZW50KHByb2plY3Rpb24sIFtbMCwgMF0sIHNpemVdLCBvYmplY3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZml0V2lkdGgocHJvamVjdGlvbiwgd2lkdGgsIG9iamVjdCkge1xuICByZXR1cm4gZml0KHByb2plY3Rpb24sIGZ1bmN0aW9uKGIpIHtcbiAgICB2YXIgdyA9ICt3aWR0aCxcbiAgICAgICAgayA9IHcgLyAoYlsxXVswXSAtIGJbMF1bMF0pLFxuICAgICAgICB4ID0gKHcgLSBrICogKGJbMV1bMF0gKyBiWzBdWzBdKSkgLyAyLFxuICAgICAgICB5ID0gLWsgKiBiWzBdWzFdO1xuICAgIHByb2plY3Rpb24uc2NhbGUoMTUwICogaykudHJhbnNsYXRlKFt4LCB5XSk7XG4gIH0sIG9iamVjdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXRIZWlnaHQocHJvamVjdGlvbiwgaGVpZ2h0LCBvYmplY3QpIHtcbiAgcmV0dXJuIGZpdChwcm9qZWN0aW9uLCBmdW5jdGlvbihiKSB7XG4gICAgdmFyIGggPSAraGVpZ2h0LFxuICAgICAgICBrID0gaCAvIChiWzFdWzFdIC0gYlswXVsxXSksXG4gICAgICAgIHggPSAtayAqIGJbMF1bMF0sXG4gICAgICAgIHkgPSAoaCAtIGsgKiAoYlsxXVsxXSArIGJbMF1bMV0pKSAvIDI7XG4gICAgcHJvamVjdGlvbi5zY2FsZSgxNTAgKiBrKS50cmFuc2xhdGUoW3gsIHldKTtcbiAgfSwgb2JqZWN0KTtcbn1cbiIsImltcG9ydCBjbGlwQW50aW1lcmlkaWFuIGZyb20gXCIuLi9jbGlwL2FudGltZXJpZGlhbi5qc1wiO1xuaW1wb3J0IGNsaXBDaXJjbGUgZnJvbSBcIi4uL2NsaXAvY2lyY2xlLmpzXCI7XG5pbXBvcnQgY2xpcFJlY3RhbmdsZSBmcm9tIFwiLi4vY2xpcC9yZWN0YW5nbGUuanNcIjtcbmltcG9ydCBjb21wb3NlIGZyb20gXCIuLi9jb21wb3NlLmpzXCI7XG5pbXBvcnQgaWRlbnRpdHkgZnJvbSBcIi4uL2lkZW50aXR5LmpzXCI7XG5pbXBvcnQge2NvcywgZGVncmVlcywgcmFkaWFucywgc2luLCBzcXJ0fSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuaW1wb3J0IHtyb3RhdGVSYWRpYW5zfSBmcm9tIFwiLi4vcm90YXRpb24uanNcIjtcbmltcG9ydCB7dHJhbnNmb3JtZXJ9IGZyb20gXCIuLi90cmFuc2Zvcm0uanNcIjtcbmltcG9ydCB7Zml0RXh0ZW50LCBmaXRTaXplLCBmaXRXaWR0aCwgZml0SGVpZ2h0fSBmcm9tIFwiLi9maXQuanNcIjtcbmltcG9ydCByZXNhbXBsZSBmcm9tIFwiLi9yZXNhbXBsZS5qc1wiO1xuXG52YXIgdHJhbnNmb3JtUmFkaWFucyA9IHRyYW5zZm9ybWVyKHtcbiAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB0aGlzLnN0cmVhbS5wb2ludCh4ICogcmFkaWFucywgeSAqIHJhZGlhbnMpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gdHJhbnNmb3JtUm90YXRlKHJvdGF0ZSkge1xuICByZXR1cm4gdHJhbnNmb3JtZXIoe1xuICAgIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICB2YXIgciA9IHJvdGF0ZSh4LCB5KTtcbiAgICAgIHJldHVybiB0aGlzLnN0cmVhbS5wb2ludChyWzBdLCByWzFdKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzY2FsZVRyYW5zbGF0ZShrLCBkeCwgZHksIHN4LCBzeSkge1xuICBmdW5jdGlvbiB0cmFuc2Zvcm0oeCwgeSkge1xuICAgIHggKj0gc3g7IHkgKj0gc3k7XG4gICAgcmV0dXJuIFtkeCArIGsgKiB4LCBkeSAtIGsgKiB5XTtcbiAgfVxuICB0cmFuc2Zvcm0uaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHJldHVybiBbKHggLSBkeCkgLyBrICogc3gsIChkeSAtIHkpIC8gayAqIHN5XTtcbiAgfTtcbiAgcmV0dXJuIHRyYW5zZm9ybTtcbn1cblxuZnVuY3Rpb24gc2NhbGVUcmFuc2xhdGVSb3RhdGUoaywgZHgsIGR5LCBzeCwgc3ksIGFscGhhKSB7XG4gIGlmICghYWxwaGEpIHJldHVybiBzY2FsZVRyYW5zbGF0ZShrLCBkeCwgZHksIHN4LCBzeSk7XG4gIHZhciBjb3NBbHBoYSA9IGNvcyhhbHBoYSksXG4gICAgICBzaW5BbHBoYSA9IHNpbihhbHBoYSksXG4gICAgICBhID0gY29zQWxwaGEgKiBrLFxuICAgICAgYiA9IHNpbkFscGhhICogayxcbiAgICAgIGFpID0gY29zQWxwaGEgLyBrLFxuICAgICAgYmkgPSBzaW5BbHBoYSAvIGssXG4gICAgICBjaSA9IChzaW5BbHBoYSAqIGR5IC0gY29zQWxwaGEgKiBkeCkgLyBrLFxuICAgICAgZmkgPSAoc2luQWxwaGEgKiBkeCArIGNvc0FscGhhICogZHkpIC8gaztcbiAgZnVuY3Rpb24gdHJhbnNmb3JtKHgsIHkpIHtcbiAgICB4ICo9IHN4OyB5ICo9IHN5O1xuICAgIHJldHVybiBbYSAqIHggLSBiICogeSArIGR4LCBkeSAtIGIgKiB4IC0gYSAqIHldO1xuICB9XG4gIHRyYW5zZm9ybS5pbnZlcnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgcmV0dXJuIFtzeCAqIChhaSAqIHggLSBiaSAqIHkgKyBjaSksIHN5ICogKGZpIC0gYmkgKiB4IC0gYWkgKiB5KV07XG4gIH07XG4gIHJldHVybiB0cmFuc2Zvcm07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHByb2plY3Rpb24ocHJvamVjdCkge1xuICByZXR1cm4gcHJvamVjdGlvbk11dGF0b3IoZnVuY3Rpb24oKSB7IHJldHVybiBwcm9qZWN0OyB9KSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvamVjdGlvbk11dGF0b3IocHJvamVjdEF0KSB7XG4gIHZhciBwcm9qZWN0LFxuICAgICAgayA9IDE1MCwgLy8gc2NhbGVcbiAgICAgIHggPSA0ODAsIHkgPSAyNTAsIC8vIHRyYW5zbGF0ZVxuICAgICAgbGFtYmRhID0gMCwgcGhpID0gMCwgLy8gY2VudGVyXG4gICAgICBkZWx0YUxhbWJkYSA9IDAsIGRlbHRhUGhpID0gMCwgZGVsdGFHYW1tYSA9IDAsIHJvdGF0ZSwgLy8gcHJlLXJvdGF0ZVxuICAgICAgYWxwaGEgPSAwLCAvLyBwb3N0LXJvdGF0ZSBhbmdsZVxuICAgICAgc3ggPSAxLCAvLyByZWZsZWN0WFxuICAgICAgc3kgPSAxLCAvLyByZWZsZWN0WFxuICAgICAgdGhldGEgPSBudWxsLCBwcmVjbGlwID0gY2xpcEFudGltZXJpZGlhbiwgLy8gcHJlLWNsaXAgYW5nbGVcbiAgICAgIHgwID0gbnVsbCwgeTAsIHgxLCB5MSwgcG9zdGNsaXAgPSBpZGVudGl0eSwgLy8gcG9zdC1jbGlwIGV4dGVudFxuICAgICAgZGVsdGEyID0gMC41LCAvLyBwcmVjaXNpb25cbiAgICAgIHByb2plY3RSZXNhbXBsZSxcbiAgICAgIHByb2plY3RUcmFuc2Zvcm0sXG4gICAgICBwcm9qZWN0Um90YXRlVHJhbnNmb3JtLFxuICAgICAgY2FjaGUsXG4gICAgICBjYWNoZVN0cmVhbTtcblxuICBmdW5jdGlvbiBwcm9qZWN0aW9uKHBvaW50KSB7XG4gICAgcmV0dXJuIHByb2plY3RSb3RhdGVUcmFuc2Zvcm0ocG9pbnRbMF0gKiByYWRpYW5zLCBwb2ludFsxXSAqIHJhZGlhbnMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52ZXJ0KHBvaW50KSB7XG4gICAgcG9pbnQgPSBwcm9qZWN0Um90YXRlVHJhbnNmb3JtLmludmVydChwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgIHJldHVybiBwb2ludCAmJiBbcG9pbnRbMF0gKiBkZWdyZWVzLCBwb2ludFsxXSAqIGRlZ3JlZXNdO1xuICB9XG5cbiAgcHJvamVjdGlvbi5zdHJlYW0gPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICByZXR1cm4gY2FjaGUgJiYgY2FjaGVTdHJlYW0gPT09IHN0cmVhbSA/IGNhY2hlIDogY2FjaGUgPSB0cmFuc2Zvcm1SYWRpYW5zKHRyYW5zZm9ybVJvdGF0ZShyb3RhdGUpKHByZWNsaXAocHJvamVjdFJlc2FtcGxlKHBvc3RjbGlwKGNhY2hlU3RyZWFtID0gc3RyZWFtKSkpKSk7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5wcmVjbGlwID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHByZWNsaXAgPSBfLCB0aGV0YSA9IHVuZGVmaW5lZCwgcmVzZXQoKSkgOiBwcmVjbGlwO1xuICB9O1xuXG4gIHByb2plY3Rpb24ucG9zdGNsaXAgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocG9zdGNsaXAgPSBfLCB4MCA9IHkwID0geDEgPSB5MSA9IG51bGwsIHJlc2V0KCkpIDogcG9zdGNsaXA7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5jbGlwQW5nbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocHJlY2xpcCA9ICtfID8gY2xpcENpcmNsZSh0aGV0YSA9IF8gKiByYWRpYW5zKSA6ICh0aGV0YSA9IG51bGwsIGNsaXBBbnRpbWVyaWRpYW4pLCByZXNldCgpKSA6IHRoZXRhICogZGVncmVlcztcbiAgfTtcblxuICBwcm9qZWN0aW9uLmNsaXBFeHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocG9zdGNsaXAgPSBfID09IG51bGwgPyAoeDAgPSB5MCA9IHgxID0geTEgPSBudWxsLCBpZGVudGl0eSkgOiBjbGlwUmVjdGFuZ2xlKHgwID0gK19bMF1bMF0sIHkwID0gK19bMF1bMV0sIHgxID0gK19bMV1bMF0sIHkxID0gK19bMV1bMV0pLCByZXNldCgpKSA6IHgwID09IG51bGwgPyBudWxsIDogW1t4MCwgeTBdLCBbeDEsIHkxXV07XG4gIH07XG5cbiAgcHJvamVjdGlvbi5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChrID0gK18sIHJlY2VudGVyKCkpIDogaztcbiAgfTtcblxuICBwcm9qZWN0aW9uLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gK19bMF0sIHkgPSArX1sxXSwgcmVjZW50ZXIoKSkgOiBbeCwgeV07XG4gIH07XG5cbiAgcHJvamVjdGlvbi5jZW50ZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGFtYmRhID0gX1swXSAlIDM2MCAqIHJhZGlhbnMsIHBoaSA9IF9bMV0gJSAzNjAgKiByYWRpYW5zLCByZWNlbnRlcigpKSA6IFtsYW1iZGEgKiBkZWdyZWVzLCBwaGkgKiBkZWdyZWVzXTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLnJvdGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkZWx0YUxhbWJkYSA9IF9bMF0gJSAzNjAgKiByYWRpYW5zLCBkZWx0YVBoaSA9IF9bMV0gJSAzNjAgKiByYWRpYW5zLCBkZWx0YUdhbW1hID0gXy5sZW5ndGggPiAyID8gX1syXSAlIDM2MCAqIHJhZGlhbnMgOiAwLCByZWNlbnRlcigpKSA6IFtkZWx0YUxhbWJkYSAqIGRlZ3JlZXMsIGRlbHRhUGhpICogZGVncmVlcywgZGVsdGFHYW1tYSAqIGRlZ3JlZXNdO1xuICB9O1xuXG4gIHByb2plY3Rpb24uYW5nbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoYWxwaGEgPSBfICUgMzYwICogcmFkaWFucywgcmVjZW50ZXIoKSkgOiBhbHBoYSAqIGRlZ3JlZXM7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5yZWZsZWN0WCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzeCA9IF8gPyAtMSA6IDEsIHJlY2VudGVyKCkpIDogc3ggPCAwO1xuICB9O1xuXG4gIHByb2plY3Rpb24ucmVmbGVjdFkgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3kgPSBfID8gLTEgOiAxLCByZWNlbnRlcigpKSA6IHN5IDwgMDtcbiAgfTtcblxuICBwcm9qZWN0aW9uLnByZWNpc2lvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwcm9qZWN0UmVzYW1wbGUgPSByZXNhbXBsZShwcm9qZWN0VHJhbnNmb3JtLCBkZWx0YTIgPSBfICogXyksIHJlc2V0KCkpIDogc3FydChkZWx0YTIpO1xuICB9O1xuXG4gIHByb2plY3Rpb24uZml0RXh0ZW50ID0gZnVuY3Rpb24oZXh0ZW50LCBvYmplY3QpIHtcbiAgICByZXR1cm4gZml0RXh0ZW50KHByb2plY3Rpb24sIGV4dGVudCwgb2JqZWN0KTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmZpdFNpemUgPSBmdW5jdGlvbihzaXplLCBvYmplY3QpIHtcbiAgICByZXR1cm4gZml0U2l6ZShwcm9qZWN0aW9uLCBzaXplLCBvYmplY3QpO1xuICB9O1xuXG4gIHByb2plY3Rpb24uZml0V2lkdGggPSBmdW5jdGlvbih3aWR0aCwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGZpdFdpZHRoKHByb2plY3Rpb24sIHdpZHRoLCBvYmplY3QpO1xuICB9O1xuXG4gIHByb2plY3Rpb24uZml0SGVpZ2h0ID0gZnVuY3Rpb24oaGVpZ2h0LCBvYmplY3QpIHtcbiAgICByZXR1cm4gZml0SGVpZ2h0KHByb2plY3Rpb24sIGhlaWdodCwgb2JqZWN0KTtcbiAgfTtcblxuICBmdW5jdGlvbiByZWNlbnRlcigpIHtcbiAgICB2YXIgY2VudGVyID0gc2NhbGVUcmFuc2xhdGVSb3RhdGUoaywgMCwgMCwgc3gsIHN5LCBhbHBoYSkuYXBwbHkobnVsbCwgcHJvamVjdChsYW1iZGEsIHBoaSkpLFxuICAgICAgICB0cmFuc2Zvcm0gPSBzY2FsZVRyYW5zbGF0ZVJvdGF0ZShrLCB4IC0gY2VudGVyWzBdLCB5IC0gY2VudGVyWzFdLCBzeCwgc3ksIGFscGhhKTtcbiAgICByb3RhdGUgPSByb3RhdGVSYWRpYW5zKGRlbHRhTGFtYmRhLCBkZWx0YVBoaSwgZGVsdGFHYW1tYSk7XG4gICAgcHJvamVjdFRyYW5zZm9ybSA9IGNvbXBvc2UocHJvamVjdCwgdHJhbnNmb3JtKTtcbiAgICBwcm9qZWN0Um90YXRlVHJhbnNmb3JtID0gY29tcG9zZShyb3RhdGUsIHByb2plY3RUcmFuc2Zvcm0pO1xuICAgIHByb2plY3RSZXNhbXBsZSA9IHJlc2FtcGxlKHByb2plY3RUcmFuc2Zvcm0sIGRlbHRhMik7XG4gICAgcmV0dXJuIHJlc2V0KCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBjYWNoZSA9IGNhY2hlU3RyZWFtID0gbnVsbDtcbiAgICByZXR1cm4gcHJvamVjdGlvbjtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBwcm9qZWN0ID0gcHJvamVjdEF0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcHJvamVjdGlvbi5pbnZlcnQgPSBwcm9qZWN0LmludmVydCAmJiBpbnZlcnQ7XG4gICAgcmV0dXJuIHJlY2VudGVyKCk7XG4gIH07XG59XG4iLCJpbXBvcnQge2NhcnRlc2lhbn0gZnJvbSBcIi4uL2NhcnRlc2lhbi5qc1wiO1xuaW1wb3J0IHthYnMsIGFzaW4sIGF0YW4yLCBjb3MsIGVwc2lsb24sIHJhZGlhbnMsIHNxcnR9IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5pbXBvcnQge3RyYW5zZm9ybWVyfSBmcm9tIFwiLi4vdHJhbnNmb3JtLmpzXCI7XG5cbnZhciBtYXhEZXB0aCA9IDE2LCAvLyBtYXhpbXVtIGRlcHRoIG9mIHN1YmRpdmlzaW9uXG4gICAgY29zTWluRGlzdGFuY2UgPSBjb3MoMzAgKiByYWRpYW5zKTsgLy8gY29zKG1pbmltdW0gYW5ndWxhciBkaXN0YW5jZSlcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocHJvamVjdCwgZGVsdGEyKSB7XG4gIHJldHVybiArZGVsdGEyID8gcmVzYW1wbGUocHJvamVjdCwgZGVsdGEyKSA6IHJlc2FtcGxlTm9uZShwcm9qZWN0KTtcbn1cblxuZnVuY3Rpb24gcmVzYW1wbGVOb25lKHByb2plY3QpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybWVyKHtcbiAgICBwb2ludDogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgeCA9IHByb2plY3QoeCwgeSk7XG4gICAgICB0aGlzLnN0cmVhbS5wb2ludCh4WzBdLCB4WzFdKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNhbXBsZShwcm9qZWN0LCBkZWx0YTIpIHtcblxuICBmdW5jdGlvbiByZXNhbXBsZUxpbmVUbyh4MCwgeTAsIGxhbWJkYTAsIGEwLCBiMCwgYzAsIHgxLCB5MSwgbGFtYmRhMSwgYTEsIGIxLCBjMSwgZGVwdGgsIHN0cmVhbSkge1xuICAgIHZhciBkeCA9IHgxIC0geDAsXG4gICAgICAgIGR5ID0geTEgLSB5MCxcbiAgICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICBpZiAoZDIgPiA0ICogZGVsdGEyICYmIGRlcHRoLS0pIHtcbiAgICAgIHZhciBhID0gYTAgKyBhMSxcbiAgICAgICAgICBiID0gYjAgKyBiMSxcbiAgICAgICAgICBjID0gYzAgKyBjMSxcbiAgICAgICAgICBtID0gc3FydChhICogYSArIGIgKiBiICsgYyAqIGMpLFxuICAgICAgICAgIHBoaTIgPSBhc2luKGMgLz0gbSksXG4gICAgICAgICAgbGFtYmRhMiA9IGFicyhhYnMoYykgLSAxKSA8IGVwc2lsb24gfHwgYWJzKGxhbWJkYTAgLSBsYW1iZGExKSA8IGVwc2lsb24gPyAobGFtYmRhMCArIGxhbWJkYTEpIC8gMiA6IGF0YW4yKGIsIGEpLFxuICAgICAgICAgIHAgPSBwcm9qZWN0KGxhbWJkYTIsIHBoaTIpLFxuICAgICAgICAgIHgyID0gcFswXSxcbiAgICAgICAgICB5MiA9IHBbMV0sXG4gICAgICAgICAgZHgyID0geDIgLSB4MCxcbiAgICAgICAgICBkeTIgPSB5MiAtIHkwLFxuICAgICAgICAgIGR6ID0gZHkgKiBkeDIgLSBkeCAqIGR5MjtcbiAgICAgIGlmIChkeiAqIGR6IC8gZDIgPiBkZWx0YTIgLy8gcGVycGVuZGljdWxhciBwcm9qZWN0ZWQgZGlzdGFuY2VcbiAgICAgICAgICB8fCBhYnMoKGR4ICogZHgyICsgZHkgKiBkeTIpIC8gZDIgLSAwLjUpID4gMC4zIC8vIG1pZHBvaW50IGNsb3NlIHRvIGFuIGVuZFxuICAgICAgICAgIHx8IGEwICogYTEgKyBiMCAqIGIxICsgYzAgKiBjMSA8IGNvc01pbkRpc3RhbmNlKSB7IC8vIGFuZ3VsYXIgZGlzdGFuY2VcbiAgICAgICAgcmVzYW1wbGVMaW5lVG8oeDAsIHkwLCBsYW1iZGEwLCBhMCwgYjAsIGMwLCB4MiwgeTIsIGxhbWJkYTIsIGEgLz0gbSwgYiAvPSBtLCBjLCBkZXB0aCwgc3RyZWFtKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHgyLCB5Mik7XG4gICAgICAgIHJlc2FtcGxlTGluZVRvKHgyLCB5MiwgbGFtYmRhMiwgYSwgYiwgYywgeDEsIHkxLCBsYW1iZGExLCBhMSwgYjEsIGMxLCBkZXB0aCwgc3RyZWFtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHZhciBsYW1iZGEwMCwgeDAwLCB5MDAsIGEwMCwgYjAwLCBjMDAsIC8vIGZpcnN0IHBvaW50XG4gICAgICAgIGxhbWJkYTAsIHgwLCB5MCwgYTAsIGIwLCBjMDsgLy8gcHJldmlvdXMgcG9pbnRcblxuICAgIHZhciByZXNhbXBsZVN0cmVhbSA9IHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgbGluZUVuZDogbGluZUVuZCxcbiAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7IHN0cmVhbS5wb2x5Z29uU3RhcnQoKTsgcmVzYW1wbGVTdHJlYW0ubGluZVN0YXJ0ID0gcmluZ1N0YXJ0OyB9LFxuICAgICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7IHN0cmVhbS5wb2x5Z29uRW5kKCk7IHJlc2FtcGxlU3RyZWFtLmxpbmVTdGFydCA9IGxpbmVTdGFydDsgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb2ludCh4LCB5KSB7XG4gICAgICB4ID0gcHJvamVjdCh4LCB5KTtcbiAgICAgIHN0cmVhbS5wb2ludCh4WzBdLCB4WzFdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICB4MCA9IE5hTjtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLnBvaW50ID0gbGluZVBvaW50O1xuICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVQb2ludChsYW1iZGEsIHBoaSkge1xuICAgICAgdmFyIGMgPSBjYXJ0ZXNpYW4oW2xhbWJkYSwgcGhpXSksIHAgPSBwcm9qZWN0KGxhbWJkYSwgcGhpKTtcbiAgICAgIHJlc2FtcGxlTGluZVRvKHgwLCB5MCwgbGFtYmRhMCwgYTAsIGIwLCBjMCwgeDAgPSBwWzBdLCB5MCA9IHBbMV0sIGxhbWJkYTAgPSBsYW1iZGEsIGEwID0gY1swXSwgYjAgPSBjWzFdLCBjMCA9IGNbMl0sIG1heERlcHRoLCBzdHJlYW0pO1xuICAgICAgc3RyZWFtLnBvaW50KHgwLCB5MCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZUVuZCgpIHtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLnBvaW50ID0gcG9pbnQ7XG4gICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdTdGFydCgpIHtcbiAgICAgIGxpbmVTdGFydCgpO1xuICAgICAgcmVzYW1wbGVTdHJlYW0ucG9pbnQgPSByaW5nUG9pbnQ7XG4gICAgICByZXNhbXBsZVN0cmVhbS5saW5lRW5kID0gcmluZ0VuZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByaW5nUG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgICAgIGxpbmVQb2ludChsYW1iZGEwMCA9IGxhbWJkYSwgcGhpKSwgeDAwID0geDAsIHkwMCA9IHkwLCBhMDAgPSBhMCwgYjAwID0gYjAsIGMwMCA9IGMwO1xuICAgICAgcmVzYW1wbGVTdHJlYW0ucG9pbnQgPSBsaW5lUG9pbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmluZ0VuZCgpIHtcbiAgICAgIHJlc2FtcGxlTGluZVRvKHgwLCB5MCwgbGFtYmRhMCwgYTAsIGIwLCBjMCwgeDAwLCB5MDAsIGxhbWJkYTAwLCBhMDAsIGIwMCwgYzAwLCBtYXhEZXB0aCwgc3RyZWFtKTtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLmxpbmVFbmQgPSBsaW5lRW5kO1xuICAgICAgbGluZUVuZCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXNhbXBsZVN0cmVhbTtcbiAgfTtcbn1cbiIsImltcG9ydCBjb21wb3NlIGZyb20gXCIuL2NvbXBvc2UuanNcIjtcbmltcG9ydCB7YWJzLCBhc2luLCBhdGFuMiwgY29zLCBkZWdyZWVzLCBwaSwgcmFkaWFucywgc2luLCB0YXV9IGZyb20gXCIuL21hdGguanNcIjtcblxuZnVuY3Rpb24gcm90YXRpb25JZGVudGl0eShsYW1iZGEsIHBoaSkge1xuICBpZiAoYWJzKGxhbWJkYSkgPiBwaSkgbGFtYmRhIC09IE1hdGgucm91bmQobGFtYmRhIC8gdGF1KSAqIHRhdTtcbiAgcmV0dXJuIFtsYW1iZGEsIHBoaV07XG59XG5cbnJvdGF0aW9uSWRlbnRpdHkuaW52ZXJ0ID0gcm90YXRpb25JZGVudGl0eTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZVJhZGlhbnMoZGVsdGFMYW1iZGEsIGRlbHRhUGhpLCBkZWx0YUdhbW1hKSB7XG4gIHJldHVybiAoZGVsdGFMYW1iZGEgJT0gdGF1KSA/IChkZWx0YVBoaSB8fCBkZWx0YUdhbW1hID8gY29tcG9zZShyb3RhdGlvbkxhbWJkYShkZWx0YUxhbWJkYSksIHJvdGF0aW9uUGhpR2FtbWEoZGVsdGFQaGksIGRlbHRhR2FtbWEpKVxuICAgIDogcm90YXRpb25MYW1iZGEoZGVsdGFMYW1iZGEpKVxuICAgIDogKGRlbHRhUGhpIHx8IGRlbHRhR2FtbWEgPyByb3RhdGlvblBoaUdhbW1hKGRlbHRhUGhpLCBkZWx0YUdhbW1hKVxuICAgIDogcm90YXRpb25JZGVudGl0eSk7XG59XG5cbmZ1bmN0aW9uIGZvcndhcmRSb3RhdGlvbkxhbWJkYShkZWx0YUxhbWJkYSkge1xuICByZXR1cm4gZnVuY3Rpb24obGFtYmRhLCBwaGkpIHtcbiAgICBsYW1iZGEgKz0gZGVsdGFMYW1iZGE7XG4gICAgaWYgKGFicyhsYW1iZGEpID4gcGkpIGxhbWJkYSAtPSBNYXRoLnJvdW5kKGxhbWJkYSAvIHRhdSkgKiB0YXU7XG4gICAgcmV0dXJuIFtsYW1iZGEsIHBoaV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKSB7XG4gIHZhciByb3RhdGlvbiA9IGZvcndhcmRSb3RhdGlvbkxhbWJkYShkZWx0YUxhbWJkYSk7XG4gIHJvdGF0aW9uLmludmVydCA9IGZvcndhcmRSb3RhdGlvbkxhbWJkYSgtZGVsdGFMYW1iZGEpO1xuICByZXR1cm4gcm90YXRpb247XG59XG5cbmZ1bmN0aW9uIHJvdGF0aW9uUGhpR2FtbWEoZGVsdGFQaGksIGRlbHRhR2FtbWEpIHtcbiAgdmFyIGNvc0RlbHRhUGhpID0gY29zKGRlbHRhUGhpKSxcbiAgICAgIHNpbkRlbHRhUGhpID0gc2luKGRlbHRhUGhpKSxcbiAgICAgIGNvc0RlbHRhR2FtbWEgPSBjb3MoZGVsdGFHYW1tYSksXG4gICAgICBzaW5EZWx0YUdhbW1hID0gc2luKGRlbHRhR2FtbWEpO1xuXG4gIGZ1bmN0aW9uIHJvdGF0aW9uKGxhbWJkYSwgcGhpKSB7XG4gICAgdmFyIGNvc1BoaSA9IGNvcyhwaGkpLFxuICAgICAgICB4ID0gY29zKGxhbWJkYSkgKiBjb3NQaGksXG4gICAgICAgIHkgPSBzaW4obGFtYmRhKSAqIGNvc1BoaSxcbiAgICAgICAgeiA9IHNpbihwaGkpLFxuICAgICAgICBrID0geiAqIGNvc0RlbHRhUGhpICsgeCAqIHNpbkRlbHRhUGhpO1xuICAgIHJldHVybiBbXG4gICAgICBhdGFuMih5ICogY29zRGVsdGFHYW1tYSAtIGsgKiBzaW5EZWx0YUdhbW1hLCB4ICogY29zRGVsdGFQaGkgLSB6ICogc2luRGVsdGFQaGkpLFxuICAgICAgYXNpbihrICogY29zRGVsdGFHYW1tYSArIHkgKiBzaW5EZWx0YUdhbW1hKVxuICAgIF07XG4gIH1cblxuICByb3RhdGlvbi5pbnZlcnQgPSBmdW5jdGlvbihsYW1iZGEsIHBoaSkge1xuICAgIHZhciBjb3NQaGkgPSBjb3MocGhpKSxcbiAgICAgICAgeCA9IGNvcyhsYW1iZGEpICogY29zUGhpLFxuICAgICAgICB5ID0gc2luKGxhbWJkYSkgKiBjb3NQaGksXG4gICAgICAgIHogPSBzaW4ocGhpKSxcbiAgICAgICAgayA9IHogKiBjb3NEZWx0YUdhbW1hIC0geSAqIHNpbkRlbHRhR2FtbWE7XG4gICAgcmV0dXJuIFtcbiAgICAgIGF0YW4yKHkgKiBjb3NEZWx0YUdhbW1hICsgeiAqIHNpbkRlbHRhR2FtbWEsIHggKiBjb3NEZWx0YVBoaSArIGsgKiBzaW5EZWx0YVBoaSksXG4gICAgICBhc2luKGsgKiBjb3NEZWx0YVBoaSAtIHggKiBzaW5EZWx0YVBoaSlcbiAgICBdO1xuICB9O1xuXG4gIHJldHVybiByb3RhdGlvbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocm90YXRlKSB7XG4gIHJvdGF0ZSA9IHJvdGF0ZVJhZGlhbnMocm90YXRlWzBdICogcmFkaWFucywgcm90YXRlWzFdICogcmFkaWFucywgcm90YXRlLmxlbmd0aCA+IDIgPyByb3RhdGVbMl0gKiByYWRpYW5zIDogMCk7XG5cbiAgZnVuY3Rpb24gZm9yd2FyZChjb29yZGluYXRlcykge1xuICAgIGNvb3JkaW5hdGVzID0gcm90YXRlKGNvb3JkaW5hdGVzWzBdICogcmFkaWFucywgY29vcmRpbmF0ZXNbMV0gKiByYWRpYW5zKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXNbMF0gKj0gZGVncmVlcywgY29vcmRpbmF0ZXNbMV0gKj0gZGVncmVlcywgY29vcmRpbmF0ZXM7XG4gIH1cblxuICBmb3J3YXJkLmludmVydCA9IGZ1bmN0aW9uKGNvb3JkaW5hdGVzKSB7XG4gICAgY29vcmRpbmF0ZXMgPSByb3RhdGUuaW52ZXJ0KGNvb3JkaW5hdGVzWzBdICogcmFkaWFucywgY29vcmRpbmF0ZXNbMV0gKiByYWRpYW5zKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXNbMF0gKj0gZGVncmVlcywgY29vcmRpbmF0ZXNbMV0gKj0gZGVncmVlcywgY29vcmRpbmF0ZXM7XG4gIH07XG5cbiAgcmV0dXJuIGZvcndhcmQ7XG59XG4iLCJmdW5jdGlvbiBzdHJlYW1HZW9tZXRyeShnZW9tZXRyeSwgc3RyZWFtKSB7XG4gIGlmIChnZW9tZXRyeSAmJiBzdHJlYW1HZW9tZXRyeVR5cGUuaGFzT3duUHJvcGVydHkoZ2VvbWV0cnkudHlwZSkpIHtcbiAgICBzdHJlYW1HZW9tZXRyeVR5cGVbZ2VvbWV0cnkudHlwZV0oZ2VvbWV0cnksIHN0cmVhbSk7XG4gIH1cbn1cblxudmFyIHN0cmVhbU9iamVjdFR5cGUgPSB7XG4gIEZlYXR1cmU6IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgc3RyZWFtR2VvbWV0cnkob2JqZWN0Lmdlb21ldHJ5LCBzdHJlYW0pO1xuICB9LFxuICBGZWF0dXJlQ29sbGVjdGlvbjogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICB2YXIgZmVhdHVyZXMgPSBvYmplY3QuZmVhdHVyZXMsIGkgPSAtMSwgbiA9IGZlYXR1cmVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgc3RyZWFtR2VvbWV0cnkoZmVhdHVyZXNbaV0uZ2VvbWV0cnksIHN0cmVhbSk7XG4gIH1cbn07XG5cbnZhciBzdHJlYW1HZW9tZXRyeVR5cGUgPSB7XG4gIFNwaGVyZTogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICBzdHJlYW0uc3BoZXJlKCk7XG4gIH0sXG4gIFBvaW50OiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIG9iamVjdCA9IG9iamVjdC5jb29yZGluYXRlcztcbiAgICBzdHJlYW0ucG9pbnQob2JqZWN0WzBdLCBvYmplY3RbMV0sIG9iamVjdFsyXSk7XG4gIH0sXG4gIE11bHRpUG9pbnQ6IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgdmFyIGNvb3JkaW5hdGVzID0gb2JqZWN0LmNvb3JkaW5hdGVzLCBpID0gLTEsIG4gPSBjb29yZGluYXRlcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIG9iamVjdCA9IGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0ucG9pbnQob2JqZWN0WzBdLCBvYmplY3RbMV0sIG9iamVjdFsyXSk7XG4gIH0sXG4gIExpbmVTdHJpbmc6IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgc3RyZWFtTGluZShvYmplY3QuY29vcmRpbmF0ZXMsIHN0cmVhbSwgMCk7XG4gIH0sXG4gIE11bHRpTGluZVN0cmluZzogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgc3RyZWFtTGluZShjb29yZGluYXRlc1tpXSwgc3RyZWFtLCAwKTtcbiAgfSxcbiAgUG9seWdvbjogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICBzdHJlYW1Qb2x5Z29uKG9iamVjdC5jb29yZGluYXRlcywgc3RyZWFtKTtcbiAgfSxcbiAgTXVsdGlQb2x5Z29uOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHZhciBjb29yZGluYXRlcyA9IG9iamVjdC5jb29yZGluYXRlcywgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1Qb2x5Z29uKGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0pO1xuICB9LFxuICBHZW9tZXRyeUNvbGxlY3Rpb246IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgdmFyIGdlb21ldHJpZXMgPSBvYmplY3QuZ2VvbWV0cmllcywgaSA9IC0xLCBuID0gZ2VvbWV0cmllcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIHN0cmVhbUdlb21ldHJ5KGdlb21ldHJpZXNbaV0sIHN0cmVhbSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0cmVhbUxpbmUoY29vcmRpbmF0ZXMsIHN0cmVhbSwgY2xvc2VkKSB7XG4gIHZhciBpID0gLTEsIG4gPSBjb29yZGluYXRlcy5sZW5ndGggLSBjbG9zZWQsIGNvb3JkaW5hdGU7XG4gIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgd2hpbGUgKCsraSA8IG4pIGNvb3JkaW5hdGUgPSBjb29yZGluYXRlc1tpXSwgc3RyZWFtLnBvaW50KGNvb3JkaW5hdGVbMF0sIGNvb3JkaW5hdGVbMV0sIGNvb3JkaW5hdGVbMl0pO1xuICBzdHJlYW0ubGluZUVuZCgpO1xufVxuXG5mdW5jdGlvbiBzdHJlYW1Qb2x5Z29uKGNvb3JkaW5hdGVzLCBzdHJlYW0pIHtcbiAgdmFyIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgc3RyZWFtLnBvbHlnb25TdGFydCgpO1xuICB3aGlsZSAoKytpIDwgbikgc3RyZWFtTGluZShjb29yZGluYXRlc1tpXSwgc3RyZWFtLCAxKTtcbiAgc3RyZWFtLnBvbHlnb25FbmQoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgaWYgKG9iamVjdCAmJiBzdHJlYW1PYmplY3RUeXBlLmhhc093blByb3BlcnR5KG9iamVjdC50eXBlKSkge1xuICAgIHN0cmVhbU9iamVjdFR5cGVbb2JqZWN0LnR5cGVdKG9iamVjdCwgc3RyZWFtKTtcbiAgfSBlbHNlIHtcbiAgICBzdHJlYW1HZW9tZXRyeShvYmplY3QsIHN0cmVhbSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgcmV0dXJuIHtcbiAgICBzdHJlYW06IHRyYW5zZm9ybWVyKG1ldGhvZHMpXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1lcihtZXRob2RzKSB7XG4gIHJldHVybiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICB2YXIgcyA9IG5ldyBUcmFuc2Zvcm1TdHJlYW07XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGhvZHMpIHNba2V5XSA9IG1ldGhvZHNba2V5XTtcbiAgICBzLnN0cmVhbSA9IHN0cmVhbTtcbiAgICByZXR1cm4gcztcbiAgfTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtKCkge31cblxuVHJhbnNmb3JtU3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFRyYW5zZm9ybVN0cmVhbSxcbiAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHsgdGhpcy5zdHJlYW0ucG9pbnQoeCwgeSk7IH0sXG4gIHNwaGVyZTogZnVuY3Rpb24oKSB7IHRoaXMuc3RyZWFtLnNwaGVyZSgpOyB9LFxuICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkgeyB0aGlzLnN0cmVhbS5saW5lU3RhcnQoKTsgfSxcbiAgbGluZUVuZDogZnVuY3Rpb24oKSB7IHRoaXMuc3RyZWFtLmxpbmVFbmQoKTsgfSxcbiAgcG9seWdvblN0YXJ0OiBmdW5jdGlvbigpIHsgdGhpcy5zdHJlYW0ucG9seWdvblN0YXJ0KCk7IH0sXG4gIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkgeyB0aGlzLnN0cmVhbS5wb2x5Z29uRW5kKCk7IH1cbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vQHRzLWNoZWNrXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgZ2VvQXppbXV0aGFsRXF1YWxBcmVhIH0gZnJvbSAnZDMtZ2VvJ1xuXG4vKipcbiAqIFByb2plY3Rpb24gZnVuY3Rpb24gZm9yIEV1cm9wZWFuIExBRUEuXG4gKi9cbmV4cG9ydCBjb25zdCBwcm9qMzAzNSA9IGdlb0F6aW11dGhhbEVxdWFsQXJlYSgpXG4gICAgLnJvdGF0ZShbLTEwLCAtNTJdKVxuICAgIC5yZWZsZWN0WChmYWxzZSlcbiAgICAucmVmbGVjdFkodHJ1ZSlcbiAgICAuc2NhbGUoNjM3ODEzNylcbiAgICAudHJhbnNsYXRlKFs0MzIxMDAwLCAzMjEwMDAwXSlcblxuLyoqXG4gKiBSZXR1cm5zIG9wdGlvbnMgZm9yIGdyaWR2aXogbGFiZWwgbGF5ZXIuXG4gKiBGcm9tIEV1cm9ueW0gZGF0YTogaHR0cHM6Ly9naXRodWIuY29tL2V1cm9zdGF0L2V1cm9ueW1cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgZ2V0RXVyb255bWVMYWJlbExheWVyID0gZnVuY3Rpb24gKGNjID0gJ0VVUicsIHJlcyA9IDUwLCBvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge31cbiAgICBjb25zdCBleCA9IG9wdHMuZXggfHwgMS4yXG4gICAgY29uc3QgZm9udEZhbWlseSA9IG9wdHMuZm9udEZhbWlseSB8fCAnQXJpYWwnXG4gICAgY29uc3QgZXhTaXplID0gb3B0cy5leFNpemUgfHwgMVxuICAgIG9wdHMuc3R5bGUgPVxuICAgICAgICBvcHRzLnN0eWxlIHx8XG4gICAgICAgICgobGIsIHpmKSA9PiB7XG4gICAgICAgICAgICBpZiAobGIucnMgPCBleCAqIHpmKSByZXR1cm5cbiAgICAgICAgICAgIGlmIChsYi5yMSA8IGV4ICogemYpIHJldHVybiBleFNpemUgKyAnZW0gJyArIGZvbnRGYW1pbHlcbiAgICAgICAgICAgIHJldHVybiBleFNpemUgKiAxLjUgKyAnZW0gJyArIGZvbnRGYW1pbHlcbiAgICAgICAgfSlcbiAgICBvcHRzLnByb2ogPSBvcHRzLnByb2ogfHwgcHJvajMwMzVcbiAgICBvcHRzLnByZXByb2Nlc3MgPSAobGIpID0+IHtcbiAgICAgICAgLy9leGNsdWRlIGNvdW50cmllc1xuICAgICAgICAvL2lmKG9wdHMuY2NPdXQgJiYgbGIuY2MgJiYgb3B0cy5jY091dC5pbmNsdWRlcyhsYi5jYykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKG9wdHMuY2NJbiAmJiBsYi5jYyAmJiAhKG9wdHMuY2NJbi5pbmRleE9mKGxiLmNjKSA+PSAwKSkgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgLy9wcm9qZWN0IGZyb20gZ2VvIGNvb3JkaW5hdGVzIHRvIEVUUlM4OS1MQUVBXG4gICAgICAgIGNvbnN0IHAgPSBvcHRzLnByb2ooW2xiLmxvbiwgbGIubGF0XSlcbiAgICAgICAgbGIueCA9IHBbMF1cbiAgICAgICAgbGIueSA9IHBbMV1cbiAgICAgICAgZGVsZXRlIGxiLmxvblxuICAgICAgICBkZWxldGUgbGIubGF0XG4gICAgfVxuICAgIG9wdHMuYmFzZVVSTCA9IG9wdHMuYmFzZVVSTCB8fCAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2V1cm9zdGF0L2V1cm9ueW0vbWFpbi9wdWIvdjIvVVRGLydcbiAgICBvcHRzLnVybCA9IG9wdHMuYmFzZVVSTCArIHJlcyArICcvJyArIGNjICsgJy5jc3YnXG4gICAgcmV0dXJuIG9wdHNcbn1cblxuXG4vKipcbiAqIFJldHVybnMgb3B0aW9ucyBmb3IgZ3JpZHZpeiBib3VuZGFyaWVzIGxheWVyLlxuICogRnJvbSBOdXRzMmpzb24gZGF0YTogaHR0cHM6Ly9naXRodWIuY29tL2V1cm9zdGF0L051dHMyanNvblxuICogXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgZ2V0RXVyb3N0YXRCb3VuZGFyaWVzTGF5ZXIgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgY29uc3QgbnV0c1llYXIgPSBvcHRzLm51dHNZZWFyIHx8ICcyMDIxJ1xuICAgIGNvbnN0IGNycyA9IG9wdHMuY3JzIHx8ICczMDM1J1xuICAgIGNvbnN0IHNjYWxlID0gb3B0cy5zY2FsZSB8fCAnMDNNJ1xuICAgIGNvbnN0IG51dHNMZXZlbCA9IG9wdHMubnV0c0xldmVsIHx8ICczJ1xuICAgIGNvbnN0IGNvbCA9IG9wdHMuY29sIHx8ICcjODg4J1xuICAgIGNvbnN0IGNvbEtvc292byA9IG9wdHMuY29sS29zb3ZvIHx8ICcjYmNiY2JjJ1xuICAgIGNvbnN0IHNob3dPdGggPSBvcHRzLnNob3dPdGggPT0gdW5kZWZpbmVkID8gdHJ1ZSA6IG9wdHMuc2hvd090aFxuXG4gICAgLy9pbiBtb3N0IG9mIHRoZSBjYXNlLCBhbHJlYWR5IHByb2plY3RlZCBkYXRhIG9mIG51dHMyanNvbiB3aWxsIGJlIHVzZWQsIHVzaW5nICdvcHRzLmNycydcbiAgICBpZiAob3B0cy5wcm9qKVxuICAgICAgICBvcHRzLnByZXByb2Nlc3MgPSAoYm4pID0+IHtcbiAgICAgICAgICAgIC8vZXhjbHVkZSBjb3VudHJpZXNcbiAgICAgICAgICAgIC8vaWYob3B0cy5jY091dCAmJiBsYi5jYyAmJiBvcHRzLmNjT3V0LmluY2x1ZGVzKGxiLmNjKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgLy9pZiAob3B0cy5jY0luICYmIGxiLmNjICYmICEob3B0cy5jY0luLmluZGV4T2YobGIuY2MpID49IDApKSByZXR1cm4gZmFsc2VcblxuICAgICAgICAgICAgLy9wcm9qZWN0IGZyb20gZ2VvIGNvb3JkaW5hdGVzIHRvIEVUUlM4OS1MQUVBXG4gICAgICAgICAgICAvL2NvbnN0IHAgPSBvcHRzLnByb2ooW2xiLmxvbiwgbGIubGF0XSlcbiAgICAgICAgICAgIC8vbGIueCA9IHBbMF1cbiAgICAgICAgICAgIC8vbGIueSA9IHBbMV1cbiAgICAgICAgICAgIC8vZGVsZXRlIGxiLmxvblxuICAgICAgICAgICAgLy9kZWxldGUgbGIubGF0XG4gICAgICAgIH1cblxuXG4gICAgb3B0cy5jb2xvciA9XG4gICAgICAgIG9wdHMuY29sb3IgfHxcbiAgICAgICAgKChmLCB6ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IGYucHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKCFzaG93T3RoIC8qJiYgcC5jbyA9PSBcIkZcIiovICYmIHAuZXUgIT0gJ1QnICYmIHAuY2MgIT0gJ1QnICYmIHAuZWZ0YSAhPSAnVCcgJiYgcC5vdGggPT09ICdUJylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGlmIChwLmlkID49IDEwMDAwMCkgcmV0dXJuIGNvbEtvc292b1xuICAgICAgICAgICAgaWYgKHAuY28gPT09ICdUJykgcmV0dXJuIGNvbFxuICAgICAgICAgICAgaWYgKHpmIDwgNDAwKSByZXR1cm4gY29sXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA+PSAzID8gJycgOiBjb2xcbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMjAwMCkgcmV0dXJuIHAubHZsID49IDIgPyAnJyA6IGNvbFxuICAgICAgICAgICAgZWxzZSByZXR1cm4gcC5sdmwgPj0gMSA/ICcnIDogY29sXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLndpZHRoID1cbiAgICAgICAgb3B0cy53aWR0aCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gMC41XG4gICAgICAgICAgICBpZiAoemYgPCA0MDApIHJldHVybiBwLmx2bCA9PSAzID8gMi4yIDogcC5sdmwgPT0gMiA/IDIuMiA6IHAubHZsID09IDEgPyAyLjIgOiA0XG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA9PSAyID8gMS44IDogcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAyMDAwKSByZXR1cm4gcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gMS4yXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLmxpbmVEYXNoID1cbiAgICAgICAgb3B0cy5saW5lRGFzaCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gW11cbiAgICAgICAgICAgIGlmICh6ZiA8IDQwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gM1xuICAgICAgICAgICAgICAgICAgICA/IFsyICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgOiBwLmx2bCA9PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFs1ICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogcC5sdmwgPT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gWzUgKiB6ZiwgMiAqIHpmXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWzEwICogemYsIDMgKiB6Zl1cbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMTAwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gMiA/IFs1ICogemYsIDIgKiB6Zl0gOiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDIwMDApIHJldHVybiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIHJldHVybiBbMTAgKiB6ZiwgMyAqIHpmXVxuICAgICAgICB9KVxuXG4gICAgb3B0cy5iYXNlVVJMID0gb3B0cy5iYXNlVVJMIHx8ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZXVyb3N0YXQvTnV0czJqc29uL21hc3Rlci9wdWIvdjIvJ1xuICAgIG9wdHMudXJsID0gb3B0cy5iYXNlVVJMICsgbnV0c1llYXIgKyAnLycgKyBjcnMgKyAnLycgKyBzY2FsZSArICcvbnV0c2JuXycgKyBudXRzTGV2ZWwgKyAnLmpzb24nXG4gICAgcmV0dXJuIG9wdHNcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==