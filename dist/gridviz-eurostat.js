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

    //this line is useless but to show it is possible to specify a projection function.
    //in most of the case, already projected data of nuts2json will be used, using 'opts.crs'
    opts.proj = opts.proj || undefined

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ndml6X2VzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9mc3VtLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL21lcmdlLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jYXJ0ZXNpYW4uanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NpcmNsZS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2xpcC9hbnRpbWVyaWRpYW4uanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NsaXAvYnVmZmVyLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jbGlwL2NpcmNsZS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2xpcC9pbmRleC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2xpcC9saW5lLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9jbGlwL3JlY3RhbmdsZS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvY2xpcC9yZWpvaW4uanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NvbXBvc2UuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL2NvbnN0YW50LmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9pZGVudGl0eS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvbWF0aC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvbm9vcC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcGF0aC9ib3VuZHMuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3BvaW50RXF1YWwuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3BvbHlnb25Db250YWlucy5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcHJvamVjdGlvbi9hemltdXRoYWwuanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3Byb2plY3Rpb24vYXppbXV0aGFsRXF1YWxBcmVhLmpzIiwid2VicGFjazovL2d2aXpfZXMvLi9ub2RlX21vZHVsZXMvZDMtZ2VvL3NyYy9wcm9qZWN0aW9uL2ZpdC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcHJvamVjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcHJvamVjdGlvbi9yZXNhbXBsZS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvcm90YXRpb24uanMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy8uL25vZGVfbW9kdWxlcy9kMy1nZW8vc3JjL3N0cmVhbS5qcyIsIndlYnBhY2s6Ly9ndml6X2VzLy4vbm9kZV9tb2R1bGVzL2QzLWdlby9zcmMvdHJhbnNmb3JtLmpzIiwid2VicGFjazovL2d2aXpfZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZ3Zpel9lcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2d2aXpfZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9ndml6X2VzLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImd2aXpfZXNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZ3Zpel9lc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vcHl0aG9uL2NweXRob24vYmxvYi9hNzRlZWEyMzhmNWJhYmExNTc5N2UyZThiNTcwZDE1M2JjODY5MGE3L01vZHVsZXMvbWF0aG1vZHVsZS5jI0wxNDIzXG5leHBvcnQgY2xhc3MgQWRkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9wYXJ0aWFscyA9IG5ldyBGbG9hdDY0QXJyYXkoMzIpO1xuICAgIHRoaXMuX24gPSAwO1xuICB9XG4gIGFkZCh4KSB7XG4gICAgY29uc3QgcCA9IHRoaXMuX3BhcnRpYWxzO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX24gJiYgaiA8IDMyOyBqKyspIHtcbiAgICAgIGNvbnN0IHkgPSBwW2pdLFxuICAgICAgICBoaSA9IHggKyB5LFxuICAgICAgICBsbyA9IE1hdGguYWJzKHgpIDwgTWF0aC5hYnMoeSkgPyB4IC0gKGhpIC0geSkgOiB5IC0gKGhpIC0geCk7XG4gICAgICBpZiAobG8pIHBbaSsrXSA9IGxvO1xuICAgICAgeCA9IGhpO1xuICAgIH1cbiAgICBwW2ldID0geDtcbiAgICB0aGlzLl9uID0gaSArIDE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdmFsdWVPZigpIHtcbiAgICBjb25zdCBwID0gdGhpcy5fcGFydGlhbHM7XG4gICAgbGV0IG4gPSB0aGlzLl9uLCB4LCB5LCBsbywgaGkgPSAwO1xuICAgIGlmIChuID4gMCkge1xuICAgICAgaGkgPSBwWy0tbl07XG4gICAgICB3aGlsZSAobiA+IDApIHtcbiAgICAgICAgeCA9IGhpO1xuICAgICAgICB5ID0gcFstLW5dO1xuICAgICAgICBoaSA9IHggKyB5O1xuICAgICAgICBsbyA9IHkgLSAoaGkgLSB4KTtcbiAgICAgICAgaWYgKGxvKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChuID4gMCAmJiAoKGxvIDwgMCAmJiBwW24gLSAxXSA8IDApIHx8IChsbyA+IDAgJiYgcFtuIC0gMV0gPiAwKSkpIHtcbiAgICAgICAgeSA9IGxvICogMjtcbiAgICAgICAgeCA9IGhpICsgeTtcbiAgICAgICAgaWYgKHkgPT0geCAtIGhpKSBoaSA9IHg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoaTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnN1bSh2YWx1ZXMsIHZhbHVlb2YpIHtcbiAgY29uc3QgYWRkZXIgPSBuZXcgQWRkZXIoKTtcbiAgaWYgKHZhbHVlb2YgPT09IHVuZGVmaW5lZCkge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgaWYgKHZhbHVlID0gK3ZhbHVlKSB7XG4gICAgICAgIGFkZGVyLmFkZCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgaWYgKHZhbHVlID0gK3ZhbHVlb2YodmFsdWUsICsraW5kZXgsIHZhbHVlcykpIHtcbiAgICAgICAgYWRkZXIuYWRkKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuICthZGRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZjdW1zdW0odmFsdWVzLCB2YWx1ZW9mKSB7XG4gIGNvbnN0IGFkZGVyID0gbmV3IEFkZGVyKCk7XG4gIGxldCBpbmRleCA9IC0xO1xuICByZXR1cm4gRmxvYXQ2NEFycmF5LmZyb20odmFsdWVzLCB2YWx1ZW9mID09PSB1bmRlZmluZWRcbiAgICAgID8gdiA9PiBhZGRlci5hZGQoK3YgfHwgMClcbiAgICAgIDogdiA9PiBhZGRlci5hZGQoK3ZhbHVlb2YodiwgKytpbmRleCwgdmFsdWVzKSB8fCAwKVxuICApO1xufVxuIiwiZnVuY3Rpb24qIGZsYXR0ZW4oYXJyYXlzKSB7XG4gIGZvciAoY29uc3QgYXJyYXkgb2YgYXJyYXlzKSB7XG4gICAgeWllbGQqIGFycmF5O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlKGFycmF5cykge1xuICByZXR1cm4gQXJyYXkuZnJvbShmbGF0dGVuKGFycmF5cykpO1xufVxuIiwiaW1wb3J0IHthc2luLCBhdGFuMiwgY29zLCBzaW4sIHNxcnR9IGZyb20gXCIuL21hdGguanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNwaGVyaWNhbChjYXJ0ZXNpYW4pIHtcbiAgcmV0dXJuIFthdGFuMihjYXJ0ZXNpYW5bMV0sIGNhcnRlc2lhblswXSksIGFzaW4oY2FydGVzaWFuWzJdKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW4oc3BoZXJpY2FsKSB7XG4gIHZhciBsYW1iZGEgPSBzcGhlcmljYWxbMF0sIHBoaSA9IHNwaGVyaWNhbFsxXSwgY29zUGhpID0gY29zKHBoaSk7XG4gIHJldHVybiBbY29zUGhpICogY29zKGxhbWJkYSksIGNvc1BoaSAqIHNpbihsYW1iZGEpLCBzaW4ocGhpKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW5Eb3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXSArIGFbMl0gKiBiWzJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuQ3Jvc3MoYSwgYikge1xuICByZXR1cm4gW2FbMV0gKiBiWzJdIC0gYVsyXSAqIGJbMV0sIGFbMl0gKiBiWzBdIC0gYVswXSAqIGJbMl0sIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF1dO1xufVxuXG4vLyBUT0RPIHJldHVybiBhXG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuQWRkSW5QbGFjZShhLCBiKSB7XG4gIGFbMF0gKz0gYlswXSwgYVsxXSArPSBiWzFdLCBhWzJdICs9IGJbMl07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW5TY2FsZSh2ZWN0b3IsIGspIHtcbiAgcmV0dXJuIFt2ZWN0b3JbMF0gKiBrLCB2ZWN0b3JbMV0gKiBrLCB2ZWN0b3JbMl0gKiBrXTtcbn1cblxuLy8gVE9ETyByZXR1cm4gZFxuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhbk5vcm1hbGl6ZUluUGxhY2UoZCkge1xuICB2YXIgbCA9IHNxcnQoZFswXSAqIGRbMF0gKyBkWzFdICogZFsxXSArIGRbMl0gKiBkWzJdKTtcbiAgZFswXSAvPSBsLCBkWzFdIC89IGwsIGRbMl0gLz0gbDtcbn1cbiIsImltcG9ydCB7Y2FydGVzaWFuLCBjYXJ0ZXNpYW5Ob3JtYWxpemVJblBsYWNlLCBzcGhlcmljYWx9IGZyb20gXCIuL2NhcnRlc2lhbi5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQge2Fjb3MsIGNvcywgZGVncmVlcywgZXBzaWxvbiwgcmFkaWFucywgc2luLCB0YXV9IGZyb20gXCIuL21hdGguanNcIjtcbmltcG9ydCB7cm90YXRlUmFkaWFuc30gZnJvbSBcIi4vcm90YXRpb24uanNcIjtcblxuLy8gR2VuZXJhdGVzIGEgY2lyY2xlIGNlbnRlcmVkIGF0IFswwrAsIDDCsF0sIHdpdGggYSBnaXZlbiByYWRpdXMgYW5kIHByZWNpc2lvbi5cbmV4cG9ydCBmdW5jdGlvbiBjaXJjbGVTdHJlYW0oc3RyZWFtLCByYWRpdXMsIGRlbHRhLCBkaXJlY3Rpb24sIHQwLCB0MSkge1xuICBpZiAoIWRlbHRhKSByZXR1cm47XG4gIHZhciBjb3NSYWRpdXMgPSBjb3MocmFkaXVzKSxcbiAgICAgIHNpblJhZGl1cyA9IHNpbihyYWRpdXMpLFxuICAgICAgc3RlcCA9IGRpcmVjdGlvbiAqIGRlbHRhO1xuICBpZiAodDAgPT0gbnVsbCkge1xuICAgIHQwID0gcmFkaXVzICsgZGlyZWN0aW9uICogdGF1O1xuICAgIHQxID0gcmFkaXVzIC0gc3RlcCAvIDI7XG4gIH0gZWxzZSB7XG4gICAgdDAgPSBjaXJjbGVSYWRpdXMoY29zUmFkaXVzLCB0MCk7XG4gICAgdDEgPSBjaXJjbGVSYWRpdXMoY29zUmFkaXVzLCB0MSk7XG4gICAgaWYgKGRpcmVjdGlvbiA+IDAgPyB0MCA8IHQxIDogdDAgPiB0MSkgdDAgKz0gZGlyZWN0aW9uICogdGF1O1xuICB9XG4gIGZvciAodmFyIHBvaW50LCB0ID0gdDA7IGRpcmVjdGlvbiA+IDAgPyB0ID4gdDEgOiB0IDwgdDE7IHQgLT0gc3RlcCkge1xuICAgIHBvaW50ID0gc3BoZXJpY2FsKFtjb3NSYWRpdXMsIC1zaW5SYWRpdXMgKiBjb3ModCksIC1zaW5SYWRpdXMgKiBzaW4odCldKTtcbiAgICBzdHJlYW0ucG9pbnQocG9pbnRbMF0sIHBvaW50WzFdKTtcbiAgfVxufVxuXG4vLyBSZXR1cm5zIHRoZSBzaWduZWQgYW5nbGUgb2YgYSBjYXJ0ZXNpYW4gcG9pbnQgcmVsYXRpdmUgdG8gW2Nvc1JhZGl1cywgMCwgMF0uXG5mdW5jdGlvbiBjaXJjbGVSYWRpdXMoY29zUmFkaXVzLCBwb2ludCkge1xuICBwb2ludCA9IGNhcnRlc2lhbihwb2ludCksIHBvaW50WzBdIC09IGNvc1JhZGl1cztcbiAgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShwb2ludCk7XG4gIHZhciByYWRpdXMgPSBhY29zKC1wb2ludFsxXSk7XG4gIHJldHVybiAoKC1wb2ludFsyXSA8IDAgPyAtcmFkaXVzIDogcmFkaXVzKSArIHRhdSAtIGVwc2lsb24pICUgdGF1O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIGNlbnRlciA9IGNvbnN0YW50KFswLCAwXSksXG4gICAgICByYWRpdXMgPSBjb25zdGFudCg5MCksXG4gICAgICBwcmVjaXNpb24gPSBjb25zdGFudCg2KSxcbiAgICAgIHJpbmcsXG4gICAgICByb3RhdGUsXG4gICAgICBzdHJlYW0gPSB7cG9pbnQ6IHBvaW50fTtcblxuICBmdW5jdGlvbiBwb2ludCh4LCB5KSB7XG4gICAgcmluZy5wdXNoKHggPSByb3RhdGUoeCwgeSkpO1xuICAgIHhbMF0gKj0gZGVncmVlcywgeFsxXSAqPSBkZWdyZWVzO1xuICB9XG5cbiAgZnVuY3Rpb24gY2lyY2xlKCkge1xuICAgIHZhciBjID0gY2VudGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksXG4gICAgICAgIHIgPSByYWRpdXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSAqIHJhZGlhbnMsXG4gICAgICAgIHAgPSBwcmVjaXNpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKSAqIHJhZGlhbnM7XG4gICAgcmluZyA9IFtdO1xuICAgIHJvdGF0ZSA9IHJvdGF0ZVJhZGlhbnMoLWNbMF0gKiByYWRpYW5zLCAtY1sxXSAqIHJhZGlhbnMsIDApLmludmVydDtcbiAgICBjaXJjbGVTdHJlYW0oc3RyZWFtLCByLCBwLCAxKTtcbiAgICBjID0ge3R5cGU6IFwiUG9seWdvblwiLCBjb29yZGluYXRlczogW3JpbmddfTtcbiAgICByaW5nID0gcm90YXRlID0gbnVsbDtcbiAgICByZXR1cm4gYztcbiAgfVxuXG4gIGNpcmNsZS5jZW50ZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2VudGVyID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudChbK19bMF0sICtfWzFdXSksIGNpcmNsZSkgOiBjZW50ZXI7XG4gIH07XG5cbiAgY2lyY2xlLnJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYWRpdXMgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgY2lyY2xlKSA6IHJhZGl1cztcbiAgfTtcblxuICBjaXJjbGUucHJlY2lzaW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHByZWNpc2lvbiA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBjaXJjbGUpIDogcHJlY2lzaW9uO1xuICB9O1xuXG4gIHJldHVybiBjaXJjbGU7XG59XG4iLCJpbXBvcnQgY2xpcCBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHthYnMsIGF0YW4sIGNvcywgZXBzaWxvbiwgaGFsZlBpLCBwaSwgc2lufSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGlwKFxuICBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0sXG4gIGNsaXBBbnRpbWVyaWRpYW5MaW5lLFxuICBjbGlwQW50aW1lcmlkaWFuSW50ZXJwb2xhdGUsXG4gIFstcGksIC1oYWxmUGldXG4pO1xuXG4vLyBUYWtlcyBhIGxpbmUgYW5kIGN1dHMgaW50byB2aXNpYmxlIHNlZ21lbnRzLiBSZXR1cm4gdmFsdWVzOiAwIC0gdGhlcmUgd2VyZVxuLy8gaW50ZXJzZWN0aW9ucyBvciB0aGUgbGluZSB3YXMgZW1wdHk7IDEgLSBubyBpbnRlcnNlY3Rpb25zOyAyIC0gdGhlcmUgd2VyZVxuLy8gaW50ZXJzZWN0aW9ucywgYW5kIHRoZSBmaXJzdCBhbmQgbGFzdCBzZWdtZW50cyBzaG91bGQgYmUgcmVqb2luZWQuXG5mdW5jdGlvbiBjbGlwQW50aW1lcmlkaWFuTGluZShzdHJlYW0pIHtcbiAgdmFyIGxhbWJkYTAgPSBOYU4sXG4gICAgICBwaGkwID0gTmFOLFxuICAgICAgc2lnbjAgPSBOYU4sXG4gICAgICBjbGVhbjsgLy8gbm8gaW50ZXJzZWN0aW9uc1xuXG4gIHJldHVybiB7XG4gICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgIGNsZWFuID0gMTtcbiAgICB9LFxuICAgIHBvaW50OiBmdW5jdGlvbihsYW1iZGExLCBwaGkxKSB7XG4gICAgICB2YXIgc2lnbjEgPSBsYW1iZGExID4gMCA/IHBpIDogLXBpLFxuICAgICAgICAgIGRlbHRhID0gYWJzKGxhbWJkYTEgLSBsYW1iZGEwKTtcbiAgICAgIGlmIChhYnMoZGVsdGEgLSBwaSkgPCBlcHNpbG9uKSB7IC8vIGxpbmUgY3Jvc3NlcyBhIHBvbGVcbiAgICAgICAgc3RyZWFtLnBvaW50KGxhbWJkYTAsIHBoaTAgPSAocGhpMCArIHBoaTEpIC8gMiA+IDAgPyBoYWxmUGkgOiAtaGFsZlBpKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHNpZ24wLCBwaGkwKTtcbiAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICBzdHJlYW0ucG9pbnQoc2lnbjEsIHBoaTApO1xuICAgICAgICBzdHJlYW0ucG9pbnQobGFtYmRhMSwgcGhpMCk7XG4gICAgICAgIGNsZWFuID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoc2lnbjAgIT09IHNpZ24xICYmIGRlbHRhID49IHBpKSB7IC8vIGxpbmUgY3Jvc3NlcyBhbnRpbWVyaWRpYW5cbiAgICAgICAgaWYgKGFicyhsYW1iZGEwIC0gc2lnbjApIDwgZXBzaWxvbikgbGFtYmRhMCAtPSBzaWduMCAqIGVwc2lsb247IC8vIGhhbmRsZSBkZWdlbmVyYWNpZXNcbiAgICAgICAgaWYgKGFicyhsYW1iZGExIC0gc2lnbjEpIDwgZXBzaWxvbikgbGFtYmRhMSAtPSBzaWduMSAqIGVwc2lsb247XG4gICAgICAgIHBoaTAgPSBjbGlwQW50aW1lcmlkaWFuSW50ZXJzZWN0KGxhbWJkYTAsIHBoaTAsIGxhbWJkYTEsIHBoaTEpO1xuICAgICAgICBzdHJlYW0ucG9pbnQoc2lnbjAsIHBoaTApO1xuICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgIHN0cmVhbS5wb2ludChzaWduMSwgcGhpMCk7XG4gICAgICAgIGNsZWFuID0gMDtcbiAgICAgIH1cbiAgICAgIHN0cmVhbS5wb2ludChsYW1iZGEwID0gbGFtYmRhMSwgcGhpMCA9IHBoaTEpO1xuICAgICAgc2lnbjAgPSBzaWduMTtcbiAgICB9LFxuICAgIGxpbmVFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgIGxhbWJkYTAgPSBwaGkwID0gTmFOO1xuICAgIH0sXG4gICAgY2xlYW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIDIgLSBjbGVhbjsgLy8gaWYgaW50ZXJzZWN0aW9ucywgcmVqb2luIGZpcnN0IGFuZCBsYXN0IHNlZ21lbnRzXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjbGlwQW50aW1lcmlkaWFuSW50ZXJzZWN0KGxhbWJkYTAsIHBoaTAsIGxhbWJkYTEsIHBoaTEpIHtcbiAgdmFyIGNvc1BoaTAsXG4gICAgICBjb3NQaGkxLFxuICAgICAgc2luTGFtYmRhMExhbWJkYTEgPSBzaW4obGFtYmRhMCAtIGxhbWJkYTEpO1xuICByZXR1cm4gYWJzKHNpbkxhbWJkYTBMYW1iZGExKSA+IGVwc2lsb25cbiAgICAgID8gYXRhbigoc2luKHBoaTApICogKGNvc1BoaTEgPSBjb3MocGhpMSkpICogc2luKGxhbWJkYTEpXG4gICAgICAgICAgLSBzaW4ocGhpMSkgKiAoY29zUGhpMCA9IGNvcyhwaGkwKSkgKiBzaW4obGFtYmRhMCkpXG4gICAgICAgICAgLyAoY29zUGhpMCAqIGNvc1BoaTEgKiBzaW5MYW1iZGEwTGFtYmRhMSkpXG4gICAgICA6IChwaGkwICsgcGhpMSkgLyAyO1xufVxuXG5mdW5jdGlvbiBjbGlwQW50aW1lcmlkaWFuSW50ZXJwb2xhdGUoZnJvbSwgdG8sIGRpcmVjdGlvbiwgc3RyZWFtKSB7XG4gIHZhciBwaGk7XG4gIGlmIChmcm9tID09IG51bGwpIHtcbiAgICBwaGkgPSBkaXJlY3Rpb24gKiBoYWxmUGk7XG4gICAgc3RyZWFtLnBvaW50KC1waSwgcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoMCwgcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQocGksIHBoaSk7XG4gICAgc3RyZWFtLnBvaW50KHBpLCAwKTtcbiAgICBzdHJlYW0ucG9pbnQocGksIC1waGkpO1xuICAgIHN0cmVhbS5wb2ludCgwLCAtcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoLXBpLCAtcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoLXBpLCAwKTtcbiAgICBzdHJlYW0ucG9pbnQoLXBpLCBwaGkpO1xuICB9IGVsc2UgaWYgKGFicyhmcm9tWzBdIC0gdG9bMF0pID4gZXBzaWxvbikge1xuICAgIHZhciBsYW1iZGEgPSBmcm9tWzBdIDwgdG9bMF0gPyBwaSA6IC1waTtcbiAgICBwaGkgPSBkaXJlY3Rpb24gKiBsYW1iZGEgLyAyO1xuICAgIHN0cmVhbS5wb2ludCgtbGFtYmRhLCBwaGkpO1xuICAgIHN0cmVhbS5wb2ludCgwLCBwaGkpO1xuICAgIHN0cmVhbS5wb2ludChsYW1iZGEsIHBoaSk7XG4gIH0gZWxzZSB7XG4gICAgc3RyZWFtLnBvaW50KHRvWzBdLCB0b1sxXSk7XG4gIH1cbn1cbiIsImltcG9ydCBub29wIGZyb20gXCIuLi9ub29wLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgbGluZXMgPSBbXSxcbiAgICAgIGxpbmU7XG4gIHJldHVybiB7XG4gICAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHksIG0pIHtcbiAgICAgIGxpbmUucHVzaChbeCwgeSwgbV0pO1xuICAgIH0sXG4gICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIGxpbmVzLnB1c2gobGluZSA9IFtdKTtcbiAgICB9LFxuICAgIGxpbmVFbmQ6IG5vb3AsXG4gICAgcmVqb2luOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChsaW5lcy5sZW5ndGggPiAxKSBsaW5lcy5wdXNoKGxpbmVzLnBvcCgpLmNvbmNhdChsaW5lcy5zaGlmdCgpKSk7XG4gICAgfSxcbiAgICByZXN1bHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IGxpbmVzO1xuICAgICAgbGluZXMgPSBbXTtcbiAgICAgIGxpbmUgPSBudWxsO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQge2NhcnRlc2lhbiwgY2FydGVzaWFuQWRkSW5QbGFjZSwgY2FydGVzaWFuQ3Jvc3MsIGNhcnRlc2lhbkRvdCwgY2FydGVzaWFuU2NhbGUsIHNwaGVyaWNhbH0gZnJvbSBcIi4uL2NhcnRlc2lhbi5qc1wiO1xuaW1wb3J0IHtjaXJjbGVTdHJlYW19IGZyb20gXCIuLi9jaXJjbGUuanNcIjtcbmltcG9ydCB7YWJzLCBjb3MsIGVwc2lsb24sIHBpLCByYWRpYW5zLCBzcXJ0fSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuaW1wb3J0IHBvaW50RXF1YWwgZnJvbSBcIi4uL3BvaW50RXF1YWwuanNcIjtcbmltcG9ydCBjbGlwIGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHJhZGl1cykge1xuICB2YXIgY3IgPSBjb3MocmFkaXVzKSxcbiAgICAgIGRlbHRhID0gNiAqIHJhZGlhbnMsXG4gICAgICBzbWFsbFJhZGl1cyA9IGNyID4gMCxcbiAgICAgIG5vdEhlbWlzcGhlcmUgPSBhYnMoY3IpID4gZXBzaWxvbjsgLy8gVE9ETyBvcHRpbWlzZSBmb3IgdGhpcyBjb21tb24gY2FzZVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlKGZyb20sIHRvLCBkaXJlY3Rpb24sIHN0cmVhbSkge1xuICAgIGNpcmNsZVN0cmVhbShzdHJlYW0sIHJhZGl1cywgZGVsdGEsIGRpcmVjdGlvbiwgZnJvbSwgdG8pO1xuICB9XG5cbiAgZnVuY3Rpb24gdmlzaWJsZShsYW1iZGEsIHBoaSkge1xuICAgIHJldHVybiBjb3MobGFtYmRhKSAqIGNvcyhwaGkpID4gY3I7XG4gIH1cblxuICAvLyBUYWtlcyBhIGxpbmUgYW5kIGN1dHMgaW50byB2aXNpYmxlIHNlZ21lbnRzLiBSZXR1cm4gdmFsdWVzIHVzZWQgZm9yIHBvbHlnb25cbiAgLy8gY2xpcHBpbmc6IDAgLSB0aGVyZSB3ZXJlIGludGVyc2VjdGlvbnMgb3IgdGhlIGxpbmUgd2FzIGVtcHR5OyAxIC0gbm9cbiAgLy8gaW50ZXJzZWN0aW9ucyAyIC0gdGhlcmUgd2VyZSBpbnRlcnNlY3Rpb25zLCBhbmQgdGhlIGZpcnN0IGFuZCBsYXN0IHNlZ21lbnRzXG4gIC8vIHNob3VsZCBiZSByZWpvaW5lZC5cbiAgZnVuY3Rpb24gY2xpcExpbmUoc3RyZWFtKSB7XG4gICAgdmFyIHBvaW50MCwgLy8gcHJldmlvdXMgcG9pbnRcbiAgICAgICAgYzAsIC8vIGNvZGUgZm9yIHByZXZpb3VzIHBvaW50XG4gICAgICAgIHYwLCAvLyB2aXNpYmlsaXR5IG9mIHByZXZpb3VzIHBvaW50XG4gICAgICAgIHYwMCwgLy8gdmlzaWJpbGl0eSBvZiBmaXJzdCBwb2ludFxuICAgICAgICBjbGVhbjsgLy8gbm8gaW50ZXJzZWN0aW9uc1xuICAgIHJldHVybiB7XG4gICAgICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2MDAgPSB2MCA9IGZhbHNlO1xuICAgICAgICBjbGVhbiA9IDE7XG4gICAgICB9LFxuICAgICAgcG9pbnQ6IGZ1bmN0aW9uKGxhbWJkYSwgcGhpKSB7XG4gICAgICAgIHZhciBwb2ludDEgPSBbbGFtYmRhLCBwaGldLFxuICAgICAgICAgICAgcG9pbnQyLFxuICAgICAgICAgICAgdiA9IHZpc2libGUobGFtYmRhLCBwaGkpLFxuICAgICAgICAgICAgYyA9IHNtYWxsUmFkaXVzXG4gICAgICAgICAgICAgID8gdiA/IDAgOiBjb2RlKGxhbWJkYSwgcGhpKVxuICAgICAgICAgICAgICA6IHYgPyBjb2RlKGxhbWJkYSArIChsYW1iZGEgPCAwID8gcGkgOiAtcGkpLCBwaGkpIDogMDtcbiAgICAgICAgaWYgKCFwb2ludDAgJiYgKHYwMCA9IHYwID0gdikpIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgaWYgKHYgIT09IHYwKSB7XG4gICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MCwgcG9pbnQxKTtcbiAgICAgICAgICBpZiAoIXBvaW50MiB8fCBwb2ludEVxdWFsKHBvaW50MCwgcG9pbnQyKSB8fCBwb2ludEVxdWFsKHBvaW50MSwgcG9pbnQyKSlcbiAgICAgICAgICAgIHBvaW50MVsyXSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHYgIT09IHYwKSB7XG4gICAgICAgICAgY2xlYW4gPSAwO1xuICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAvLyBvdXRzaWRlIGdvaW5nIGluXG4gICAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICBwb2ludDIgPSBpbnRlcnNlY3QocG9pbnQxLCBwb2ludDApO1xuICAgICAgICAgICAgc3RyZWFtLnBvaW50KHBvaW50MlswXSwgcG9pbnQyWzFdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaW5zaWRlIGdvaW5nIG91dFxuICAgICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MCwgcG9pbnQxKTtcbiAgICAgICAgICAgIHN0cmVhbS5wb2ludChwb2ludDJbMF0sIHBvaW50MlsxXSwgMik7XG4gICAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb2ludDAgPSBwb2ludDI7XG4gICAgICAgIH0gZWxzZSBpZiAobm90SGVtaXNwaGVyZSAmJiBwb2ludDAgJiYgc21hbGxSYWRpdXMgXiB2KSB7XG4gICAgICAgICAgdmFyIHQ7XG4gICAgICAgICAgLy8gSWYgdGhlIGNvZGVzIGZvciB0d28gcG9pbnRzIGFyZSBkaWZmZXJlbnQsIG9yIGFyZSBib3RoIHplcm8sXG4gICAgICAgICAgLy8gYW5kIHRoZXJlIHRoaXMgc2VnbWVudCBpbnRlcnNlY3RzIHdpdGggdGhlIHNtYWxsIGNpcmNsZS5cbiAgICAgICAgICBpZiAoIShjICYgYzApICYmICh0ID0gaW50ZXJzZWN0KHBvaW50MSwgcG9pbnQwLCB0cnVlKSkpIHtcbiAgICAgICAgICAgIGNsZWFuID0gMDtcbiAgICAgICAgICAgIGlmIChzbWFsbFJhZGl1cykge1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5wb2ludCh0WzBdWzBdLCB0WzBdWzFdKTtcbiAgICAgICAgICAgICAgc3RyZWFtLnBvaW50KHRbMV1bMF0sIHRbMV1bMV0pO1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyZWFtLnBvaW50KHRbMV1bMF0sIHRbMV1bMV0pO1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5wb2ludCh0WzBdWzBdLCB0WzBdWzFdLCAzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHYgJiYgKCFwb2ludDAgfHwgIXBvaW50RXF1YWwocG9pbnQwLCBwb2ludDEpKSkge1xuICAgICAgICAgIHN0cmVhbS5wb2ludChwb2ludDFbMF0sIHBvaW50MVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnQwID0gcG9pbnQxLCB2MCA9IHYsIGMwID0gYztcbiAgICAgIH0sXG4gICAgICBsaW5lRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHYwKSBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICBwb2ludDAgPSBudWxsO1xuICAgICAgfSxcbiAgICAgIC8vIFJlam9pbiBmaXJzdCBhbmQgbGFzdCBzZWdtZW50cyBpZiB0aGVyZSB3ZXJlIGludGVyc2VjdGlvbnMgYW5kIHRoZSBmaXJzdFxuICAgICAgLy8gYW5kIGxhc3QgcG9pbnRzIHdlcmUgdmlzaWJsZS5cbiAgICAgIGNsZWFuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNsZWFuIHwgKCh2MDAgJiYgdjApIDw8IDEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBJbnRlcnNlY3RzIHRoZSBncmVhdCBjaXJjbGUgYmV0d2VlbiBhIGFuZCBiIHdpdGggdGhlIGNsaXAgY2lyY2xlLlxuICBmdW5jdGlvbiBpbnRlcnNlY3QoYSwgYiwgdHdvKSB7XG4gICAgdmFyIHBhID0gY2FydGVzaWFuKGEpLFxuICAgICAgICBwYiA9IGNhcnRlc2lhbihiKTtcblxuICAgIC8vIFdlIGhhdmUgdHdvIHBsYW5lcywgbjEucCA9IGQxIGFuZCBuMi5wID0gZDIuXG4gICAgLy8gRmluZCBpbnRlcnNlY3Rpb24gbGluZSBwKHQpID0gYzEgbjEgKyBjMiBuMiArIHQgKG4xIOKoryBuMikuXG4gICAgdmFyIG4xID0gWzEsIDAsIDBdLCAvLyBub3JtYWxcbiAgICAgICAgbjIgPSBjYXJ0ZXNpYW5Dcm9zcyhwYSwgcGIpLFxuICAgICAgICBuMm4yID0gY2FydGVzaWFuRG90KG4yLCBuMiksXG4gICAgICAgIG4xbjIgPSBuMlswXSwgLy8gY2FydGVzaWFuRG90KG4xLCBuMiksXG4gICAgICAgIGRldGVybWluYW50ID0gbjJuMiAtIG4xbjIgKiBuMW4yO1xuXG4gICAgLy8gVHdvIHBvbGFyIHBvaW50cy5cbiAgICBpZiAoIWRldGVybWluYW50KSByZXR1cm4gIXR3byAmJiBhO1xuXG4gICAgdmFyIGMxID0gIGNyICogbjJuMiAvIGRldGVybWluYW50LFxuICAgICAgICBjMiA9IC1jciAqIG4xbjIgLyBkZXRlcm1pbmFudCxcbiAgICAgICAgbjF4bjIgPSBjYXJ0ZXNpYW5Dcm9zcyhuMSwgbjIpLFxuICAgICAgICBBID0gY2FydGVzaWFuU2NhbGUobjEsIGMxKSxcbiAgICAgICAgQiA9IGNhcnRlc2lhblNjYWxlKG4yLCBjMik7XG4gICAgY2FydGVzaWFuQWRkSW5QbGFjZShBLCBCKTtcblxuICAgIC8vIFNvbHZlIHxwKHQpfF4yID0gMS5cbiAgICB2YXIgdSA9IG4xeG4yLFxuICAgICAgICB3ID0gY2FydGVzaWFuRG90KEEsIHUpLFxuICAgICAgICB1dSA9IGNhcnRlc2lhbkRvdCh1LCB1KSxcbiAgICAgICAgdDIgPSB3ICogdyAtIHV1ICogKGNhcnRlc2lhbkRvdChBLCBBKSAtIDEpO1xuXG4gICAgaWYgKHQyIDwgMCkgcmV0dXJuO1xuXG4gICAgdmFyIHQgPSBzcXJ0KHQyKSxcbiAgICAgICAgcSA9IGNhcnRlc2lhblNjYWxlKHUsICgtdyAtIHQpIC8gdXUpO1xuICAgIGNhcnRlc2lhbkFkZEluUGxhY2UocSwgQSk7XG4gICAgcSA9IHNwaGVyaWNhbChxKTtcblxuICAgIGlmICghdHdvKSByZXR1cm4gcTtcblxuICAgIC8vIFR3byBpbnRlcnNlY3Rpb24gcG9pbnRzLlxuICAgIHZhciBsYW1iZGEwID0gYVswXSxcbiAgICAgICAgbGFtYmRhMSA9IGJbMF0sXG4gICAgICAgIHBoaTAgPSBhWzFdLFxuICAgICAgICBwaGkxID0gYlsxXSxcbiAgICAgICAgejtcblxuICAgIGlmIChsYW1iZGExIDwgbGFtYmRhMCkgeiA9IGxhbWJkYTAsIGxhbWJkYTAgPSBsYW1iZGExLCBsYW1iZGExID0gejtcblxuICAgIHZhciBkZWx0YSA9IGxhbWJkYTEgLSBsYW1iZGEwLFxuICAgICAgICBwb2xhciA9IGFicyhkZWx0YSAtIHBpKSA8IGVwc2lsb24sXG4gICAgICAgIG1lcmlkaWFuID0gcG9sYXIgfHwgZGVsdGEgPCBlcHNpbG9uO1xuXG4gICAgaWYgKCFwb2xhciAmJiBwaGkxIDwgcGhpMCkgeiA9IHBoaTAsIHBoaTAgPSBwaGkxLCBwaGkxID0gejtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIGZpcnN0IHBvaW50IGlzIGJldHdlZW4gYSBhbmQgYi5cbiAgICBpZiAobWVyaWRpYW5cbiAgICAgICAgPyBwb2xhclxuICAgICAgICAgID8gcGhpMCArIHBoaTEgPiAwIF4gcVsxXSA8IChhYnMocVswXSAtIGxhbWJkYTApIDwgZXBzaWxvbiA/IHBoaTAgOiBwaGkxKVxuICAgICAgICAgIDogcGhpMCA8PSBxWzFdICYmIHFbMV0gPD0gcGhpMVxuICAgICAgICA6IGRlbHRhID4gcGkgXiAobGFtYmRhMCA8PSBxWzBdICYmIHFbMF0gPD0gbGFtYmRhMSkpIHtcbiAgICAgIHZhciBxMSA9IGNhcnRlc2lhblNjYWxlKHUsICgtdyArIHQpIC8gdXUpO1xuICAgICAgY2FydGVzaWFuQWRkSW5QbGFjZShxMSwgQSk7XG4gICAgICByZXR1cm4gW3EsIHNwaGVyaWNhbChxMSldO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlcyBhIDQtYml0IHZlY3RvciByZXByZXNlbnRpbmcgdGhlIGxvY2F0aW9uIG9mIGEgcG9pbnQgcmVsYXRpdmUgdG9cbiAgLy8gdGhlIHNtYWxsIGNpcmNsZSdzIGJvdW5kaW5nIGJveC5cbiAgZnVuY3Rpb24gY29kZShsYW1iZGEsIHBoaSkge1xuICAgIHZhciByID0gc21hbGxSYWRpdXMgPyByYWRpdXMgOiBwaSAtIHJhZGl1cyxcbiAgICAgICAgY29kZSA9IDA7XG4gICAgaWYgKGxhbWJkYSA8IC1yKSBjb2RlIHw9IDE7IC8vIGxlZnRcbiAgICBlbHNlIGlmIChsYW1iZGEgPiByKSBjb2RlIHw9IDI7IC8vIHJpZ2h0XG4gICAgaWYgKHBoaSA8IC1yKSBjb2RlIHw9IDQ7IC8vIGJlbG93XG4gICAgZWxzZSBpZiAocGhpID4gcikgY29kZSB8PSA4OyAvLyBhYm92ZVxuICAgIHJldHVybiBjb2RlO1xuICB9XG5cbiAgcmV0dXJuIGNsaXAodmlzaWJsZSwgY2xpcExpbmUsIGludGVycG9sYXRlLCBzbWFsbFJhZGl1cyA/IFswLCAtcmFkaXVzXSA6IFstcGksIHJhZGl1cyAtIHBpXSk7XG59XG4iLCJpbXBvcnQgY2xpcEJ1ZmZlciBmcm9tIFwiLi9idWZmZXIuanNcIjtcbmltcG9ydCBjbGlwUmVqb2luIGZyb20gXCIuL3Jlam9pbi5qc1wiO1xuaW1wb3J0IHtlcHNpbG9uLCBoYWxmUGl9IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5pbXBvcnQgcG9seWdvbkNvbnRhaW5zIGZyb20gXCIuLi9wb2x5Z29uQ29udGFpbnMuanNcIjtcbmltcG9ydCB7bWVyZ2V9IGZyb20gXCJkMy1hcnJheVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihwb2ludFZpc2libGUsIGNsaXBMaW5lLCBpbnRlcnBvbGF0ZSwgc3RhcnQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHNpbmspIHtcbiAgICB2YXIgbGluZSA9IGNsaXBMaW5lKHNpbmspLFxuICAgICAgICByaW5nQnVmZmVyID0gY2xpcEJ1ZmZlcigpLFxuICAgICAgICByaW5nU2luayA9IGNsaXBMaW5lKHJpbmdCdWZmZXIpLFxuICAgICAgICBwb2x5Z29uU3RhcnRlZCA9IGZhbHNlLFxuICAgICAgICBwb2x5Z29uLFxuICAgICAgICBzZWdtZW50cyxcbiAgICAgICAgcmluZztcblxuICAgIHZhciBjbGlwID0ge1xuICAgICAgcG9pbnQ6IHBvaW50LFxuICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICBsaW5lRW5kOiBsaW5lRW5kLFxuICAgICAgcG9seWdvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xpcC5wb2ludCA9IHBvaW50UmluZztcbiAgICAgICAgY2xpcC5saW5lU3RhcnQgPSByaW5nU3RhcnQ7XG4gICAgICAgIGNsaXAubGluZUVuZCA9IHJpbmdFbmQ7XG4gICAgICAgIHNlZ21lbnRzID0gW107XG4gICAgICAgIHBvbHlnb24gPSBbXTtcbiAgICAgIH0sXG4gICAgICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xpcC5wb2ludCA9IHBvaW50O1xuICAgICAgICBjbGlwLmxpbmVTdGFydCA9IGxpbmVTdGFydDtcbiAgICAgICAgY2xpcC5saW5lRW5kID0gbGluZUVuZDtcbiAgICAgICAgc2VnbWVudHMgPSBtZXJnZShzZWdtZW50cyk7XG4gICAgICAgIHZhciBzdGFydEluc2lkZSA9IHBvbHlnb25Db250YWlucyhwb2x5Z29uLCBzdGFydCk7XG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIXBvbHlnb25TdGFydGVkKSBzaW5rLnBvbHlnb25TdGFydCgpLCBwb2x5Z29uU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgY2xpcFJlam9pbihzZWdtZW50cywgY29tcGFyZUludGVyc2VjdGlvbiwgc3RhcnRJbnNpZGUsIGludGVycG9sYXRlLCBzaW5rKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdGFydEluc2lkZSkge1xuICAgICAgICAgIGlmICghcG9seWdvblN0YXJ0ZWQpIHNpbmsucG9seWdvblN0YXJ0KCksIHBvbHlnb25TdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICBzaW5rLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGludGVycG9sYXRlKG51bGwsIG51bGwsIDEsIHNpbmspO1xuICAgICAgICAgIHNpbmsubGluZUVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb2x5Z29uU3RhcnRlZCkgc2luay5wb2x5Z29uRW5kKCksIHBvbHlnb25TdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHNlZ21lbnRzID0gcG9seWdvbiA9IG51bGw7XG4gICAgICB9LFxuICAgICAgc3BoZXJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2luay5wb2x5Z29uU3RhcnQoKTtcbiAgICAgICAgc2luay5saW5lU3RhcnQoKTtcbiAgICAgICAgaW50ZXJwb2xhdGUobnVsbCwgbnVsbCwgMSwgc2luayk7XG4gICAgICAgIHNpbmsubGluZUVuZCgpO1xuICAgICAgICBzaW5rLnBvbHlnb25FbmQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgICAgIGlmIChwb2ludFZpc2libGUobGFtYmRhLCBwaGkpKSBzaW5rLnBvaW50KGxhbWJkYSwgcGhpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb2ludExpbmUobGFtYmRhLCBwaGkpIHtcbiAgICAgIGxpbmUucG9pbnQobGFtYmRhLCBwaGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVTdGFydCgpIHtcbiAgICAgIGNsaXAucG9pbnQgPSBwb2ludExpbmU7XG4gICAgICBsaW5lLmxpbmVTdGFydCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVFbmQoKSB7XG4gICAgICBjbGlwLnBvaW50ID0gcG9pbnQ7XG4gICAgICBsaW5lLmxpbmVFbmQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb2ludFJpbmcobGFtYmRhLCBwaGkpIHtcbiAgICAgIHJpbmcucHVzaChbbGFtYmRhLCBwaGldKTtcbiAgICAgIHJpbmdTaW5rLnBvaW50KGxhbWJkYSwgcGhpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByaW5nU3RhcnQoKSB7XG4gICAgICByaW5nU2luay5saW5lU3RhcnQoKTtcbiAgICAgIHJpbmcgPSBbXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByaW5nRW5kKCkge1xuICAgICAgcG9pbnRSaW5nKHJpbmdbMF1bMF0sIHJpbmdbMF1bMV0pO1xuICAgICAgcmluZ1NpbmsubGluZUVuZCgpO1xuXG4gICAgICB2YXIgY2xlYW4gPSByaW5nU2luay5jbGVhbigpLFxuICAgICAgICAgIHJpbmdTZWdtZW50cyA9IHJpbmdCdWZmZXIucmVzdWx0KCksXG4gICAgICAgICAgaSwgbiA9IHJpbmdTZWdtZW50cy5sZW5ndGgsIG0sXG4gICAgICAgICAgc2VnbWVudCxcbiAgICAgICAgICBwb2ludDtcblxuICAgICAgcmluZy5wb3AoKTtcbiAgICAgIHBvbHlnb24ucHVzaChyaW5nKTtcbiAgICAgIHJpbmcgPSBudWxsO1xuXG4gICAgICBpZiAoIW4pIHJldHVybjtcblxuICAgICAgLy8gTm8gaW50ZXJzZWN0aW9ucy5cbiAgICAgIGlmIChjbGVhbiAmIDEpIHtcbiAgICAgICAgc2VnbWVudCA9IHJpbmdTZWdtZW50c1swXTtcbiAgICAgICAgaWYgKChtID0gc2VnbWVudC5sZW5ndGggLSAxKSA+IDApIHtcbiAgICAgICAgICBpZiAoIXBvbHlnb25TdGFydGVkKSBzaW5rLnBvbHlnb25TdGFydCgpLCBwb2x5Z29uU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgc2luay5saW5lU3RhcnQoKTtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbTsgKytpKSBzaW5rLnBvaW50KChwb2ludCA9IHNlZ21lbnRbaV0pWzBdLCBwb2ludFsxXSk7XG4gICAgICAgICAgc2luay5saW5lRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBSZWpvaW4gY29ubmVjdGVkIHNlZ21lbnRzLlxuICAgICAgLy8gVE9ETyByZXVzZSByaW5nQnVmZmVyLnJlam9pbigpP1xuICAgICAgaWYgKG4gPiAxICYmIGNsZWFuICYgMikgcmluZ1NlZ21lbnRzLnB1c2gocmluZ1NlZ21lbnRzLnBvcCgpLmNvbmNhdChyaW5nU2VnbWVudHMuc2hpZnQoKSkpO1xuXG4gICAgICBzZWdtZW50cy5wdXNoKHJpbmdTZWdtZW50cy5maWx0ZXIodmFsaWRTZWdtZW50KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsaXA7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHZhbGlkU2VnbWVudChzZWdtZW50KSB7XG4gIHJldHVybiBzZWdtZW50Lmxlbmd0aCA+IDE7XG59XG5cbi8vIEludGVyc2VjdGlvbnMgYXJlIHNvcnRlZCBhbG9uZyB0aGUgY2xpcCBlZGdlLiBGb3IgYm90aCBhbnRpbWVyaWRpYW4gY3V0dGluZ1xuLy8gYW5kIGNpcmNsZSBjbGlwcGluZywgdGhlIHNhbWUgY29tcGFyaXNvbiBpcyB1c2VkLlxuZnVuY3Rpb24gY29tcGFyZUludGVyc2VjdGlvbihhLCBiKSB7XG4gIHJldHVybiAoKGEgPSBhLngpWzBdIDwgMCA/IGFbMV0gLSBoYWxmUGkgLSBlcHNpbG9uIDogaGFsZlBpIC0gYVsxXSlcbiAgICAgICAtICgoYiA9IGIueClbMF0gPCAwID8gYlsxXSAtIGhhbGZQaSAtIGVwc2lsb24gOiBoYWxmUGkgLSBiWzFdKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIsIHgwLCB5MCwgeDEsIHkxKSB7XG4gIHZhciBheCA9IGFbMF0sXG4gICAgICBheSA9IGFbMV0sXG4gICAgICBieCA9IGJbMF0sXG4gICAgICBieSA9IGJbMV0sXG4gICAgICB0MCA9IDAsXG4gICAgICB0MSA9IDEsXG4gICAgICBkeCA9IGJ4IC0gYXgsXG4gICAgICBkeSA9IGJ5IC0gYXksXG4gICAgICByO1xuXG4gIHIgPSB4MCAtIGF4O1xuICBpZiAoIWR4ICYmIHIgPiAwKSByZXR1cm47XG4gIHIgLz0gZHg7XG4gIGlmIChkeCA8IDApIHtcbiAgICBpZiAociA8IHQwKSByZXR1cm47XG4gICAgaWYgKHIgPCB0MSkgdDEgPSByO1xuICB9IGVsc2UgaWYgKGR4ID4gMCkge1xuICAgIGlmIChyID4gdDEpIHJldHVybjtcbiAgICBpZiAociA+IHQwKSB0MCA9IHI7XG4gIH1cblxuICByID0geDEgLSBheDtcbiAgaWYgKCFkeCAmJiByIDwgMCkgcmV0dXJuO1xuICByIC89IGR4O1xuICBpZiAoZHggPCAwKSB7XG4gICAgaWYgKHIgPiB0MSkgcmV0dXJuO1xuICAgIGlmIChyID4gdDApIHQwID0gcjtcbiAgfSBlbHNlIGlmIChkeCA+IDApIHtcbiAgICBpZiAociA8IHQwKSByZXR1cm47XG4gICAgaWYgKHIgPCB0MSkgdDEgPSByO1xuICB9XG5cbiAgciA9IHkwIC0gYXk7XG4gIGlmICghZHkgJiYgciA+IDApIHJldHVybjtcbiAgciAvPSBkeTtcbiAgaWYgKGR5IDwgMCkge1xuICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gIH0gZWxzZSBpZiAoZHkgPiAwKSB7XG4gICAgaWYgKHIgPiB0MSkgcmV0dXJuO1xuICAgIGlmIChyID4gdDApIHQwID0gcjtcbiAgfVxuXG4gIHIgPSB5MSAtIGF5O1xuICBpZiAoIWR5ICYmIHIgPCAwKSByZXR1cm47XG4gIHIgLz0gZHk7XG4gIGlmIChkeSA8IDApIHtcbiAgICBpZiAociA+IHQxKSByZXR1cm47XG4gICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICB9IGVsc2UgaWYgKGR5ID4gMCkge1xuICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gIH1cblxuICBpZiAodDAgPiAwKSBhWzBdID0gYXggKyB0MCAqIGR4LCBhWzFdID0gYXkgKyB0MCAqIGR5O1xuICBpZiAodDEgPCAxKSBiWzBdID0gYXggKyB0MSAqIGR4LCBiWzFdID0gYXkgKyB0MSAqIGR5O1xuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImltcG9ydCB7YWJzLCBlcHNpbG9ufSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuaW1wb3J0IGNsaXBCdWZmZXIgZnJvbSBcIi4vYnVmZmVyLmpzXCI7XG5pbXBvcnQgY2xpcExpbmUgZnJvbSBcIi4vbGluZS5qc1wiO1xuaW1wb3J0IGNsaXBSZWpvaW4gZnJvbSBcIi4vcmVqb2luLmpzXCI7XG5pbXBvcnQge21lcmdlfSBmcm9tIFwiZDMtYXJyYXlcIjtcblxudmFyIGNsaXBNYXggPSAxZTksIGNsaXBNaW4gPSAtY2xpcE1heDtcblxuLy8gVE9ETyBVc2UgZDMtcG9seWdvbuKAmXMgcG9seWdvbkNvbnRhaW5zIGhlcmUgZm9yIHRoZSByaW5nIGNoZWNrP1xuLy8gVE9ETyBFbGltaW5hdGUgZHVwbGljYXRlIGJ1ZmZlcmluZyBpbiBjbGlwQnVmZmVyIGFuZCBwb2x5Z29uLnB1c2g/XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsaXBSZWN0YW5nbGUoeDAsIHkwLCB4MSwgeTEpIHtcblxuICBmdW5jdGlvbiB2aXNpYmxlKHgsIHkpIHtcbiAgICByZXR1cm4geDAgPD0geCAmJiB4IDw9IHgxICYmIHkwIDw9IHkgJiYgeSA8PSB5MTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlKGZyb20sIHRvLCBkaXJlY3Rpb24sIHN0cmVhbSkge1xuICAgIHZhciBhID0gMCwgYTEgPSAwO1xuICAgIGlmIChmcm9tID09IG51bGxcbiAgICAgICAgfHwgKGEgPSBjb3JuZXIoZnJvbSwgZGlyZWN0aW9uKSkgIT09IChhMSA9IGNvcm5lcih0bywgZGlyZWN0aW9uKSlcbiAgICAgICAgfHwgY29tcGFyZVBvaW50KGZyb20sIHRvKSA8IDAgXiBkaXJlY3Rpb24gPiAwKSB7XG4gICAgICBkbyBzdHJlYW0ucG9pbnQoYSA9PT0gMCB8fCBhID09PSAzID8geDAgOiB4MSwgYSA+IDEgPyB5MSA6IHkwKTtcbiAgICAgIHdoaWxlICgoYSA9IChhICsgZGlyZWN0aW9uICsgNCkgJSA0KSAhPT0gYTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJlYW0ucG9pbnQodG9bMF0sIHRvWzFdKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb3JuZXIocCwgZGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGFicyhwWzBdIC0geDApIDwgZXBzaWxvbiA/IGRpcmVjdGlvbiA+IDAgPyAwIDogM1xuICAgICAgICA6IGFicyhwWzBdIC0geDEpIDwgZXBzaWxvbiA/IGRpcmVjdGlvbiA+IDAgPyAyIDogMVxuICAgICAgICA6IGFicyhwWzFdIC0geTApIDwgZXBzaWxvbiA/IGRpcmVjdGlvbiA+IDAgPyAxIDogMFxuICAgICAgICA6IGRpcmVjdGlvbiA+IDAgPyAzIDogMjsgLy8gYWJzKHBbMV0gLSB5MSkgPCBlcHNpbG9uXG4gIH1cblxuICBmdW5jdGlvbiBjb21wYXJlSW50ZXJzZWN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gY29tcGFyZVBvaW50KGEueCwgYi54KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBhcmVQb2ludChhLCBiKSB7XG4gICAgdmFyIGNhID0gY29ybmVyKGEsIDEpLFxuICAgICAgICBjYiA9IGNvcm5lcihiLCAxKTtcbiAgICByZXR1cm4gY2EgIT09IGNiID8gY2EgLSBjYlxuICAgICAgICA6IGNhID09PSAwID8gYlsxXSAtIGFbMV1cbiAgICAgICAgOiBjYSA9PT0gMSA/IGFbMF0gLSBiWzBdXG4gICAgICAgIDogY2EgPT09IDIgPyBhWzFdIC0gYlsxXVxuICAgICAgICA6IGJbMF0gLSBhWzBdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHZhciBhY3RpdmVTdHJlYW0gPSBzdHJlYW0sXG4gICAgICAgIGJ1ZmZlclN0cmVhbSA9IGNsaXBCdWZmZXIoKSxcbiAgICAgICAgc2VnbWVudHMsXG4gICAgICAgIHBvbHlnb24sXG4gICAgICAgIHJpbmcsXG4gICAgICAgIHhfXywgeV9fLCB2X18sIC8vIGZpcnN0IHBvaW50XG4gICAgICAgIHhfLCB5Xywgdl8sIC8vIHByZXZpb3VzIHBvaW50XG4gICAgICAgIGZpcnN0LFxuICAgICAgICBjbGVhbjtcblxuICAgIHZhciBjbGlwU3RyZWFtID0ge1xuICAgICAgcG9pbnQ6IHBvaW50LFxuICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICBsaW5lRW5kOiBsaW5lRW5kLFxuICAgICAgcG9seWdvblN0YXJ0OiBwb2x5Z29uU3RhcnQsXG4gICAgICBwb2x5Z29uRW5kOiBwb2x5Z29uRW5kXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHBvaW50KHgsIHkpIHtcbiAgICAgIGlmICh2aXNpYmxlKHgsIHkpKSBhY3RpdmVTdHJlYW0ucG9pbnQoeCwgeSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9seWdvbkluc2lkZSgpIHtcbiAgICAgIHZhciB3aW5kaW5nID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBwb2x5Z29uLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICBmb3IgKHZhciByaW5nID0gcG9seWdvbltpXSwgaiA9IDEsIG0gPSByaW5nLmxlbmd0aCwgcG9pbnQgPSByaW5nWzBdLCBhMCwgYTEsIGIwID0gcG9pbnRbMF0sIGIxID0gcG9pbnRbMV07IGogPCBtOyArK2opIHtcbiAgICAgICAgICBhMCA9IGIwLCBhMSA9IGIxLCBwb2ludCA9IHJpbmdbal0sIGIwID0gcG9pbnRbMF0sIGIxID0gcG9pbnRbMV07XG4gICAgICAgICAgaWYgKGExIDw9IHkxKSB7IGlmIChiMSA+IHkxICYmIChiMCAtIGEwKSAqICh5MSAtIGExKSA+IChiMSAtIGExKSAqICh4MCAtIGEwKSkgKyt3aW5kaW5nOyB9XG4gICAgICAgICAgZWxzZSB7IGlmIChiMSA8PSB5MSAmJiAoYjAgLSBhMCkgKiAoeTEgLSBhMSkgPCAoYjEgLSBhMSkgKiAoeDAgLSBhMCkpIC0td2luZGluZzsgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB3aW5kaW5nO1xuICAgIH1cblxuICAgIC8vIEJ1ZmZlciBnZW9tZXRyeSB3aXRoaW4gYSBwb2x5Z29uIGFuZCB0aGVuIGNsaXAgaXQgZW4gbWFzc2UuXG4gICAgZnVuY3Rpb24gcG9seWdvblN0YXJ0KCkge1xuICAgICAgYWN0aXZlU3RyZWFtID0gYnVmZmVyU3RyZWFtLCBzZWdtZW50cyA9IFtdLCBwb2x5Z29uID0gW10sIGNsZWFuID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb2x5Z29uRW5kKCkge1xuICAgICAgdmFyIHN0YXJ0SW5zaWRlID0gcG9seWdvbkluc2lkZSgpLFxuICAgICAgICAgIGNsZWFuSW5zaWRlID0gY2xlYW4gJiYgc3RhcnRJbnNpZGUsXG4gICAgICAgICAgdmlzaWJsZSA9IChzZWdtZW50cyA9IG1lcmdlKHNlZ21lbnRzKSkubGVuZ3RoO1xuICAgICAgaWYgKGNsZWFuSW5zaWRlIHx8IHZpc2libGUpIHtcbiAgICAgICAgc3RyZWFtLnBvbHlnb25TdGFydCgpO1xuICAgICAgICBpZiAoY2xlYW5JbnNpZGUpIHtcbiAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgaW50ZXJwb2xhdGUobnVsbCwgbnVsbCwgMSwgc3RyZWFtKTtcbiAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICAgICAgY2xpcFJlam9pbihzZWdtZW50cywgY29tcGFyZUludGVyc2VjdGlvbiwgc3RhcnRJbnNpZGUsIGludGVycG9sYXRlLCBzdHJlYW0pO1xuICAgICAgICB9XG4gICAgICAgIHN0cmVhbS5wb2x5Z29uRW5kKCk7XG4gICAgICB9XG4gICAgICBhY3RpdmVTdHJlYW0gPSBzdHJlYW0sIHNlZ21lbnRzID0gcG9seWdvbiA9IHJpbmcgPSBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVTdGFydCgpIHtcbiAgICAgIGNsaXBTdHJlYW0ucG9pbnQgPSBsaW5lUG9pbnQ7XG4gICAgICBpZiAocG9seWdvbikgcG9seWdvbi5wdXNoKHJpbmcgPSBbXSk7XG4gICAgICBmaXJzdCA9IHRydWU7XG4gICAgICB2XyA9IGZhbHNlO1xuICAgICAgeF8gPSB5XyA9IE5hTjtcbiAgICB9XG5cbiAgICAvLyBUT0RPIHJhdGhlciB0aGFuIHNwZWNpYWwtY2FzZSBwb2x5Z29ucywgc2ltcGx5IGhhbmRsZSB0aGVtIHNlcGFyYXRlbHkuXG4gICAgLy8gSWRlYWxseSwgY29pbmNpZGVudCBpbnRlcnNlY3Rpb24gcG9pbnRzIHNob3VsZCBiZSBqaXR0ZXJlZCB0byBhdm9pZFxuICAgIC8vIGNsaXBwaW5nIGlzc3Vlcy5cbiAgICBmdW5jdGlvbiBsaW5lRW5kKCkge1xuICAgICAgaWYgKHNlZ21lbnRzKSB7XG4gICAgICAgIGxpbmVQb2ludCh4X18sIHlfXyk7XG4gICAgICAgIGlmICh2X18gJiYgdl8pIGJ1ZmZlclN0cmVhbS5yZWpvaW4oKTtcbiAgICAgICAgc2VnbWVudHMucHVzaChidWZmZXJTdHJlYW0ucmVzdWx0KCkpO1xuICAgICAgfVxuICAgICAgY2xpcFN0cmVhbS5wb2ludCA9IHBvaW50O1xuICAgICAgaWYgKHZfKSBhY3RpdmVTdHJlYW0ubGluZUVuZCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVQb2ludCh4LCB5KSB7XG4gICAgICB2YXIgdiA9IHZpc2libGUoeCwgeSk7XG4gICAgICBpZiAocG9seWdvbikgcmluZy5wdXNoKFt4LCB5XSk7XG4gICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgeF9fID0geCwgeV9fID0geSwgdl9fID0gdjtcbiAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICBhY3RpdmVTdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgYWN0aXZlU3RyZWFtLnBvaW50KHgsIHkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodiAmJiB2XykgYWN0aXZlU3RyZWFtLnBvaW50KHgsIHkpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgYSA9IFt4XyA9IE1hdGgubWF4KGNsaXBNaW4sIE1hdGgubWluKGNsaXBNYXgsIHhfKSksIHlfID0gTWF0aC5tYXgoY2xpcE1pbiwgTWF0aC5taW4oY2xpcE1heCwgeV8pKV0sXG4gICAgICAgICAgICAgIGIgPSBbeCA9IE1hdGgubWF4KGNsaXBNaW4sIE1hdGgubWluKGNsaXBNYXgsIHgpKSwgeSA9IE1hdGgubWF4KGNsaXBNaW4sIE1hdGgubWluKGNsaXBNYXgsIHkpKV07XG4gICAgICAgICAgaWYgKGNsaXBMaW5lKGEsIGIsIHgwLCB5MCwgeDEsIHkxKSkge1xuICAgICAgICAgICAgaWYgKCF2Xykge1xuICAgICAgICAgICAgICBhY3RpdmVTdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgIGFjdGl2ZVN0cmVhbS5wb2ludChhWzBdLCBhWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFjdGl2ZVN0cmVhbS5wb2ludChiWzBdLCBiWzFdKTtcbiAgICAgICAgICAgIGlmICghdikgYWN0aXZlU3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgICAgIGNsZWFuID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIGlmICh2KSB7XG4gICAgICAgICAgICBhY3RpdmVTdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICBhY3RpdmVTdHJlYW0ucG9pbnQoeCwgeSk7XG4gICAgICAgICAgICBjbGVhbiA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgeF8gPSB4LCB5XyA9IHksIHZfID0gdjtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xpcFN0cmVhbTtcbiAgfTtcbn1cbiIsImltcG9ydCBwb2ludEVxdWFsIGZyb20gXCIuLi9wb2ludEVxdWFsLmpzXCI7XG5pbXBvcnQge2Vwc2lsb259IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIEludGVyc2VjdGlvbihwb2ludCwgcG9pbnRzLCBvdGhlciwgZW50cnkpIHtcbiAgdGhpcy54ID0gcG9pbnQ7XG4gIHRoaXMueiA9IHBvaW50cztcbiAgdGhpcy5vID0gb3RoZXI7IC8vIGFub3RoZXIgaW50ZXJzZWN0aW9uXG4gIHRoaXMuZSA9IGVudHJ5OyAvLyBpcyBhbiBlbnRyeT9cbiAgdGhpcy52ID0gZmFsc2U7IC8vIHZpc2l0ZWRcbiAgdGhpcy5uID0gdGhpcy5wID0gbnVsbDsgLy8gbmV4dCAmIHByZXZpb3VzXG59XG5cbi8vIEEgZ2VuZXJhbGl6ZWQgcG9seWdvbiBjbGlwcGluZyBhbGdvcml0aG06IGdpdmVuIGEgcG9seWdvbiB0aGF0IGhhcyBiZWVuIGN1dFxuLy8gaW50byBpdHMgdmlzaWJsZSBsaW5lIHNlZ21lbnRzLCBhbmQgcmVqb2lucyB0aGUgc2VnbWVudHMgYnkgaW50ZXJwb2xhdGluZ1xuLy8gYWxvbmcgdGhlIGNsaXAgZWRnZS5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlZ21lbnRzLCBjb21wYXJlSW50ZXJzZWN0aW9uLCBzdGFydEluc2lkZSwgaW50ZXJwb2xhdGUsIHN0cmVhbSkge1xuICB2YXIgc3ViamVjdCA9IFtdLFxuICAgICAgY2xpcCA9IFtdLFxuICAgICAgaSxcbiAgICAgIG47XG5cbiAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbihzZWdtZW50KSB7XG4gICAgaWYgKChuID0gc2VnbWVudC5sZW5ndGggLSAxKSA8PSAwKSByZXR1cm47XG4gICAgdmFyIG4sIHAwID0gc2VnbWVudFswXSwgcDEgPSBzZWdtZW50W25dLCB4O1xuXG4gICAgaWYgKHBvaW50RXF1YWwocDAsIHAxKSkge1xuICAgICAgaWYgKCFwMFsyXSAmJiAhcDFbMl0pIHtcbiAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSBzdHJlYW0ucG9pbnQoKHAwID0gc2VnbWVudFtpXSlbMF0sIHAwWzFdKTtcbiAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gaGFuZGxlIGRlZ2VuZXJhdGUgY2FzZXMgYnkgbW92aW5nIHRoZSBwb2ludFxuICAgICAgcDFbMF0gKz0gMiAqIGVwc2lsb247XG4gICAgfVxuXG4gICAgc3ViamVjdC5wdXNoKHggPSBuZXcgSW50ZXJzZWN0aW9uKHAwLCBzZWdtZW50LCBudWxsLCB0cnVlKSk7XG4gICAgY2xpcC5wdXNoKHgubyA9IG5ldyBJbnRlcnNlY3Rpb24ocDAsIG51bGwsIHgsIGZhbHNlKSk7XG4gICAgc3ViamVjdC5wdXNoKHggPSBuZXcgSW50ZXJzZWN0aW9uKHAxLCBzZWdtZW50LCBudWxsLCBmYWxzZSkpO1xuICAgIGNsaXAucHVzaCh4Lm8gPSBuZXcgSW50ZXJzZWN0aW9uKHAxLCBudWxsLCB4LCB0cnVlKSk7XG4gIH0pO1xuXG4gIGlmICghc3ViamVjdC5sZW5ndGgpIHJldHVybjtcblxuICBjbGlwLnNvcnQoY29tcGFyZUludGVyc2VjdGlvbik7XG4gIGxpbmsoc3ViamVjdCk7XG4gIGxpbmsoY2xpcCk7XG5cbiAgZm9yIChpID0gMCwgbiA9IGNsaXAubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgY2xpcFtpXS5lID0gc3RhcnRJbnNpZGUgPSAhc3RhcnRJbnNpZGU7XG4gIH1cblxuICB2YXIgc3RhcnQgPSBzdWJqZWN0WzBdLFxuICAgICAgcG9pbnRzLFxuICAgICAgcG9pbnQ7XG5cbiAgd2hpbGUgKDEpIHtcbiAgICAvLyBGaW5kIGZpcnN0IHVudmlzaXRlZCBpbnRlcnNlY3Rpb24uXG4gICAgdmFyIGN1cnJlbnQgPSBzdGFydCxcbiAgICAgICAgaXNTdWJqZWN0ID0gdHJ1ZTtcbiAgICB3aGlsZSAoY3VycmVudC52KSBpZiAoKGN1cnJlbnQgPSBjdXJyZW50Lm4pID09PSBzdGFydCkgcmV0dXJuO1xuICAgIHBvaW50cyA9IGN1cnJlbnQuejtcbiAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgZG8ge1xuICAgICAgY3VycmVudC52ID0gY3VycmVudC5vLnYgPSB0cnVlO1xuICAgICAgaWYgKGN1cnJlbnQuZSkge1xuICAgICAgICBpZiAoaXNTdWJqZWN0KSB7XG4gICAgICAgICAgZm9yIChpID0gMCwgbiA9IHBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHN0cmVhbS5wb2ludCgocG9pbnQgPSBwb2ludHNbaV0pWzBdLCBwb2ludFsxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW50ZXJwb2xhdGUoY3VycmVudC54LCBjdXJyZW50Lm4ueCwgMSwgc3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzU3ViamVjdCkge1xuICAgICAgICAgIHBvaW50cyA9IGN1cnJlbnQucC56O1xuICAgICAgICAgIGZvciAoaSA9IHBvaW50cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkgc3RyZWFtLnBvaW50KChwb2ludCA9IHBvaW50c1tpXSlbMF0sIHBvaW50WzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnRlcnBvbGF0ZShjdXJyZW50LngsIGN1cnJlbnQucC54LCAtMSwgc3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wO1xuICAgICAgfVxuICAgICAgY3VycmVudCA9IGN1cnJlbnQubztcbiAgICAgIHBvaW50cyA9IGN1cnJlbnQuejtcbiAgICAgIGlzU3ViamVjdCA9ICFpc1N1YmplY3Q7XG4gICAgfSB3aGlsZSAoIWN1cnJlbnQudik7XG4gICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsaW5rKGFycmF5KSB7XG4gIGlmICghKG4gPSBhcnJheS5sZW5ndGgpKSByZXR1cm47XG4gIHZhciBuLFxuICAgICAgaSA9IDAsXG4gICAgICBhID0gYXJyYXlbMF0sXG4gICAgICBiO1xuICB3aGlsZSAoKytpIDwgbikge1xuICAgIGEubiA9IGIgPSBhcnJheVtpXTtcbiAgICBiLnAgPSBhO1xuICAgIGEgPSBiO1xuICB9XG4gIGEubiA9IGIgPSBhcnJheVswXTtcbiAgYi5wID0gYTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcblxuICBmdW5jdGlvbiBjb21wb3NlKHgsIHkpIHtcbiAgICByZXR1cm4geCA9IGEoeCwgeSksIGIoeFswXSwgeFsxXSk7XG4gIH1cblxuICBpZiAoYS5pbnZlcnQgJiYgYi5pbnZlcnQpIGNvbXBvc2UuaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHJldHVybiB4ID0gYi5pbnZlcnQoeCwgeSksIHggJiYgYS5pbnZlcnQoeFswXSwgeFsxXSk7XG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvc2U7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IHggPT4geDtcbiIsImV4cG9ydCB2YXIgZXBzaWxvbiA9IDFlLTY7XG5leHBvcnQgdmFyIGVwc2lsb24yID0gMWUtMTI7XG5leHBvcnQgdmFyIHBpID0gTWF0aC5QSTtcbmV4cG9ydCB2YXIgaGFsZlBpID0gcGkgLyAyO1xuZXhwb3J0IHZhciBxdWFydGVyUGkgPSBwaSAvIDQ7XG5leHBvcnQgdmFyIHRhdSA9IHBpICogMjtcblxuZXhwb3J0IHZhciBkZWdyZWVzID0gMTgwIC8gcGk7XG5leHBvcnQgdmFyIHJhZGlhbnMgPSBwaSAvIDE4MDtcblxuZXhwb3J0IHZhciBhYnMgPSBNYXRoLmFicztcbmV4cG9ydCB2YXIgYXRhbiA9IE1hdGguYXRhbjtcbmV4cG9ydCB2YXIgYXRhbjIgPSBNYXRoLmF0YW4yO1xuZXhwb3J0IHZhciBjb3MgPSBNYXRoLmNvcztcbmV4cG9ydCB2YXIgY2VpbCA9IE1hdGguY2VpbDtcbmV4cG9ydCB2YXIgZXhwID0gTWF0aC5leHA7XG5leHBvcnQgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbmV4cG9ydCB2YXIgaHlwb3QgPSBNYXRoLmh5cG90O1xuZXhwb3J0IHZhciBsb2cgPSBNYXRoLmxvZztcbmV4cG9ydCB2YXIgcG93ID0gTWF0aC5wb3c7XG5leHBvcnQgdmFyIHNpbiA9IE1hdGguc2luO1xuZXhwb3J0IHZhciBzaWduID0gTWF0aC5zaWduIHx8IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPiAwID8gMSA6IHggPCAwID8gLTEgOiAwOyB9O1xuZXhwb3J0IHZhciBzcXJ0ID0gTWF0aC5zcXJ0O1xuZXhwb3J0IHZhciB0YW4gPSBNYXRoLnRhbjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFjb3MoeCkge1xuICByZXR1cm4geCA+IDEgPyAwIDogeCA8IC0xID8gcGkgOiBNYXRoLmFjb3MoeCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc2luKHgpIHtcbiAgcmV0dXJuIHggPiAxID8gaGFsZlBpIDogeCA8IC0xID8gLWhhbGZQaSA6IE1hdGguYXNpbih4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhdmVyc2luKHgpIHtcbiAgcmV0dXJuICh4ID0gc2luKHggLyAyKSkgKiB4O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCJpbXBvcnQgbm9vcCBmcm9tIFwiLi4vbm9vcC5qc1wiO1xuXG52YXIgeDAgPSBJbmZpbml0eSxcbiAgICB5MCA9IHgwLFxuICAgIHgxID0gLXgwLFxuICAgIHkxID0geDE7XG5cbnZhciBib3VuZHNTdHJlYW0gPSB7XG4gIHBvaW50OiBib3VuZHNQb2ludCxcbiAgbGluZVN0YXJ0OiBub29wLFxuICBsaW5lRW5kOiBub29wLFxuICBwb2x5Z29uU3RhcnQ6IG5vb3AsXG4gIHBvbHlnb25FbmQ6IG5vb3AsXG4gIHJlc3VsdDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJvdW5kcyA9IFtbeDAsIHkwXSwgW3gxLCB5MV1dO1xuICAgIHgxID0geTEgPSAtKHkwID0geDAgPSBJbmZpbml0eSk7XG4gICAgcmV0dXJuIGJvdW5kcztcbiAgfVxufTtcblxuZnVuY3Rpb24gYm91bmRzUG9pbnQoeCwgeSkge1xuICBpZiAoeCA8IHgwKSB4MCA9IHg7XG4gIGlmICh4ID4geDEpIHgxID0geDtcbiAgaWYgKHkgPCB5MCkgeTAgPSB5O1xuICBpZiAoeSA+IHkxKSB5MSA9IHk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJvdW5kc1N0cmVhbTtcbiIsImltcG9ydCB7YWJzLCBlcHNpbG9ufSBmcm9tIFwiLi9tYXRoLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGFicyhhWzBdIC0gYlswXSkgPCBlcHNpbG9uICYmIGFicyhhWzFdIC0gYlsxXSkgPCBlcHNpbG9uO1xufVxuIiwiaW1wb3J0IHtBZGRlcn0gZnJvbSBcImQzLWFycmF5XCI7XG5pbXBvcnQge2NhcnRlc2lhbiwgY2FydGVzaWFuQ3Jvc3MsIGNhcnRlc2lhbk5vcm1hbGl6ZUluUGxhY2V9IGZyb20gXCIuL2NhcnRlc2lhbi5qc1wiO1xuaW1wb3J0IHthYnMsIGFzaW4sIGF0YW4yLCBjb3MsIGVwc2lsb24sIGVwc2lsb24yLCBoYWxmUGksIHBpLCBxdWFydGVyUGksIHNpZ24sIHNpbiwgdGF1fSBmcm9tIFwiLi9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIGxvbmdpdHVkZShwb2ludCkge1xuICByZXR1cm4gYWJzKHBvaW50WzBdKSA8PSBwaSA/IHBvaW50WzBdIDogc2lnbihwb2ludFswXSkgKiAoKGFicyhwb2ludFswXSkgKyBwaSkgJSB0YXUgLSBwaSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHBvbHlnb24sIHBvaW50KSB7XG4gIHZhciBsYW1iZGEgPSBsb25naXR1ZGUocG9pbnQpLFxuICAgICAgcGhpID0gcG9pbnRbMV0sXG4gICAgICBzaW5QaGkgPSBzaW4ocGhpKSxcbiAgICAgIG5vcm1hbCA9IFtzaW4obGFtYmRhKSwgLWNvcyhsYW1iZGEpLCAwXSxcbiAgICAgIGFuZ2xlID0gMCxcbiAgICAgIHdpbmRpbmcgPSAwO1xuXG4gIHZhciBzdW0gPSBuZXcgQWRkZXIoKTtcblxuICBpZiAoc2luUGhpID09PSAxKSBwaGkgPSBoYWxmUGkgKyBlcHNpbG9uO1xuICBlbHNlIGlmIChzaW5QaGkgPT09IC0xKSBwaGkgPSAtaGFsZlBpIC0gZXBzaWxvbjtcblxuICBmb3IgKHZhciBpID0gMCwgbiA9IHBvbHlnb24ubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKCEobSA9IChyaW5nID0gcG9seWdvbltpXSkubGVuZ3RoKSkgY29udGludWU7XG4gICAgdmFyIHJpbmcsXG4gICAgICAgIG0sXG4gICAgICAgIHBvaW50MCA9IHJpbmdbbSAtIDFdLFxuICAgICAgICBsYW1iZGEwID0gbG9uZ2l0dWRlKHBvaW50MCksXG4gICAgICAgIHBoaTAgPSBwb2ludDBbMV0gLyAyICsgcXVhcnRlclBpLFxuICAgICAgICBzaW5QaGkwID0gc2luKHBoaTApLFxuICAgICAgICBjb3NQaGkwID0gY29zKHBoaTApO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBtOyArK2osIGxhbWJkYTAgPSBsYW1iZGExLCBzaW5QaGkwID0gc2luUGhpMSwgY29zUGhpMCA9IGNvc1BoaTEsIHBvaW50MCA9IHBvaW50MSkge1xuICAgICAgdmFyIHBvaW50MSA9IHJpbmdbal0sXG4gICAgICAgICAgbGFtYmRhMSA9IGxvbmdpdHVkZShwb2ludDEpLFxuICAgICAgICAgIHBoaTEgPSBwb2ludDFbMV0gLyAyICsgcXVhcnRlclBpLFxuICAgICAgICAgIHNpblBoaTEgPSBzaW4ocGhpMSksXG4gICAgICAgICAgY29zUGhpMSA9IGNvcyhwaGkxKSxcbiAgICAgICAgICBkZWx0YSA9IGxhbWJkYTEgLSBsYW1iZGEwLFxuICAgICAgICAgIHNpZ24gPSBkZWx0YSA+PSAwID8gMSA6IC0xLFxuICAgICAgICAgIGFic0RlbHRhID0gc2lnbiAqIGRlbHRhLFxuICAgICAgICAgIGFudGltZXJpZGlhbiA9IGFic0RlbHRhID4gcGksXG4gICAgICAgICAgayA9IHNpblBoaTAgKiBzaW5QaGkxO1xuXG4gICAgICBzdW0uYWRkKGF0YW4yKGsgKiBzaWduICogc2luKGFic0RlbHRhKSwgY29zUGhpMCAqIGNvc1BoaTEgKyBrICogY29zKGFic0RlbHRhKSkpO1xuICAgICAgYW5nbGUgKz0gYW50aW1lcmlkaWFuID8gZGVsdGEgKyBzaWduICogdGF1IDogZGVsdGE7XG5cbiAgICAgIC8vIEFyZSB0aGUgbG9uZ2l0dWRlcyBlaXRoZXIgc2lkZSBvZiB0aGUgcG9pbnTigJlzIG1lcmlkaWFuIChsYW1iZGEpLFxuICAgICAgLy8gYW5kIGFyZSB0aGUgbGF0aXR1ZGVzIHNtYWxsZXIgdGhhbiB0aGUgcGFyYWxsZWwgKHBoaSk/XG4gICAgICBpZiAoYW50aW1lcmlkaWFuIF4gbGFtYmRhMCA+PSBsYW1iZGEgXiBsYW1iZGExID49IGxhbWJkYSkge1xuICAgICAgICB2YXIgYXJjID0gY2FydGVzaWFuQ3Jvc3MoY2FydGVzaWFuKHBvaW50MCksIGNhcnRlc2lhbihwb2ludDEpKTtcbiAgICAgICAgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShhcmMpO1xuICAgICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY2FydGVzaWFuQ3Jvc3Mobm9ybWFsLCBhcmMpO1xuICAgICAgICBjYXJ0ZXNpYW5Ob3JtYWxpemVJblBsYWNlKGludGVyc2VjdGlvbik7XG4gICAgICAgIHZhciBwaGlBcmMgPSAoYW50aW1lcmlkaWFuIF4gZGVsdGEgPj0gMCA/IC0xIDogMSkgKiBhc2luKGludGVyc2VjdGlvblsyXSk7XG4gICAgICAgIGlmIChwaGkgPiBwaGlBcmMgfHwgcGhpID09PSBwaGlBcmMgJiYgKGFyY1swXSB8fCBhcmNbMV0pKSB7XG4gICAgICAgICAgd2luZGluZyArPSBhbnRpbWVyaWRpYW4gXiBkZWx0YSA+PSAwID8gMSA6IC0xO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRmlyc3QsIGRldGVybWluZSB3aGV0aGVyIHRoZSBTb3V0aCBwb2xlIGlzIGluc2lkZSBvciBvdXRzaWRlOlxuICAvL1xuICAvLyBJdCBpcyBpbnNpZGUgaWY6XG4gIC8vICogdGhlIHBvbHlnb24gd2luZHMgYXJvdW5kIGl0IGluIGEgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgLy8gKiB0aGUgcG9seWdvbiBkb2VzIG5vdCAoY3VtdWxhdGl2ZWx5KSB3aW5kIGFyb3VuZCBpdCwgYnV0IGhhcyBhIG5lZ2F0aXZlXG4gIC8vICAgKGNvdW50ZXItY2xvY2t3aXNlKSBhcmVhLlxuICAvL1xuICAvLyBTZWNvbmQsIGNvdW50IHRoZSAoc2lnbmVkKSBudW1iZXIgb2YgdGltZXMgYSBzZWdtZW50IGNyb3NzZXMgYSBsYW1iZGFcbiAgLy8gZnJvbSB0aGUgcG9pbnQgdG8gdGhlIFNvdXRoIHBvbGUuICBJZiBpdCBpcyB6ZXJvLCB0aGVuIHRoZSBwb2ludCBpcyB0aGVcbiAgLy8gc2FtZSBzaWRlIGFzIHRoZSBTb3V0aCBwb2xlLlxuXG4gIHJldHVybiAoYW5nbGUgPCAtZXBzaWxvbiB8fCBhbmdsZSA8IGVwc2lsb24gJiYgc3VtIDwgLWVwc2lsb24yKSBeICh3aW5kaW5nICYgMSk7XG59XG4iLCJpbXBvcnQge2FzaW4sIGF0YW4yLCBjb3MsIHNpbiwgc3FydH0gZnJvbSBcIi4uL21hdGguanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGF6aW11dGhhbFJhdyhzY2FsZSkge1xuICByZXR1cm4gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciBjeCA9IGNvcyh4KSxcbiAgICAgICAgY3kgPSBjb3MoeSksXG4gICAgICAgIGsgPSBzY2FsZShjeCAqIGN5KTtcbiAgICAgICAgaWYgKGsgPT09IEluZmluaXR5KSByZXR1cm4gWzIsIDBdO1xuICAgIHJldHVybiBbXG4gICAgICBrICogY3kgKiBzaW4oeCksXG4gICAgICBrICogc2luKHkpXG4gICAgXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXppbXV0aGFsSW52ZXJ0KGFuZ2xlKSB7XG4gIHJldHVybiBmdW5jdGlvbih4LCB5KSB7XG4gICAgdmFyIHogPSBzcXJ0KHggKiB4ICsgeSAqIHkpLFxuICAgICAgICBjID0gYW5nbGUoeiksXG4gICAgICAgIHNjID0gc2luKGMpLFxuICAgICAgICBjYyA9IGNvcyhjKTtcbiAgICByZXR1cm4gW1xuICAgICAgYXRhbjIoeCAqIHNjLCB6ICogY2MpLFxuICAgICAgYXNpbih6ICYmIHkgKiBzYyAvIHopXG4gICAgXTtcbiAgfVxufVxuIiwiaW1wb3J0IHthc2luLCBzcXJ0fSBmcm9tIFwiLi4vbWF0aC5qc1wiO1xuaW1wb3J0IHthemltdXRoYWxSYXcsIGF6aW11dGhhbEludmVydH0gZnJvbSBcIi4vYXppbXV0aGFsLmpzXCI7XG5pbXBvcnQgcHJvamVjdGlvbiBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgdmFyIGF6aW11dGhhbEVxdWFsQXJlYVJhdyA9IGF6aW11dGhhbFJhdyhmdW5jdGlvbihjeGN5KSB7XG4gIHJldHVybiBzcXJ0KDIgLyAoMSArIGN4Y3kpKTtcbn0pO1xuXG5hemltdXRoYWxFcXVhbEFyZWFSYXcuaW52ZXJ0ID0gYXppbXV0aGFsSW52ZXJ0KGZ1bmN0aW9uKHopIHtcbiAgcmV0dXJuIDIgKiBhc2luKHogLyAyKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHByb2plY3Rpb24oYXppbXV0aGFsRXF1YWxBcmVhUmF3KVxuICAgICAgLnNjYWxlKDEyNC43NSlcbiAgICAgIC5jbGlwQW5nbGUoMTgwIC0gMWUtMyk7XG59XG4iLCJpbXBvcnQge2RlZmF1bHQgYXMgZ2VvU3RyZWFtfSBmcm9tIFwiLi4vc3RyZWFtLmpzXCI7XG5pbXBvcnQgYm91bmRzU3RyZWFtIGZyb20gXCIuLi9wYXRoL2JvdW5kcy5qc1wiO1xuXG5mdW5jdGlvbiBmaXQocHJvamVjdGlvbiwgZml0Qm91bmRzLCBvYmplY3QpIHtcbiAgdmFyIGNsaXAgPSBwcm9qZWN0aW9uLmNsaXBFeHRlbnQgJiYgcHJvamVjdGlvbi5jbGlwRXh0ZW50KCk7XG4gIHByb2plY3Rpb24uc2NhbGUoMTUwKS50cmFuc2xhdGUoWzAsIDBdKTtcbiAgaWYgKGNsaXAgIT0gbnVsbCkgcHJvamVjdGlvbi5jbGlwRXh0ZW50KG51bGwpO1xuICBnZW9TdHJlYW0ob2JqZWN0LCBwcm9qZWN0aW9uLnN0cmVhbShib3VuZHNTdHJlYW0pKTtcbiAgZml0Qm91bmRzKGJvdW5kc1N0cmVhbS5yZXN1bHQoKSk7XG4gIGlmIChjbGlwICE9IG51bGwpIHByb2plY3Rpb24uY2xpcEV4dGVudChjbGlwKTtcbiAgcmV0dXJuIHByb2plY3Rpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXRFeHRlbnQocHJvamVjdGlvbiwgZXh0ZW50LCBvYmplY3QpIHtcbiAgcmV0dXJuIGZpdChwcm9qZWN0aW9uLCBmdW5jdGlvbihiKSB7XG4gICAgdmFyIHcgPSBleHRlbnRbMV1bMF0gLSBleHRlbnRbMF1bMF0sXG4gICAgICAgIGggPSBleHRlbnRbMV1bMV0gLSBleHRlbnRbMF1bMV0sXG4gICAgICAgIGsgPSBNYXRoLm1pbih3IC8gKGJbMV1bMF0gLSBiWzBdWzBdKSwgaCAvIChiWzFdWzFdIC0gYlswXVsxXSkpLFxuICAgICAgICB4ID0gK2V4dGVudFswXVswXSArICh3IC0gayAqIChiWzFdWzBdICsgYlswXVswXSkpIC8gMixcbiAgICAgICAgeSA9ICtleHRlbnRbMF1bMV0gKyAoaCAtIGsgKiAoYlsxXVsxXSArIGJbMF1bMV0pKSAvIDI7XG4gICAgcHJvamVjdGlvbi5zY2FsZSgxNTAgKiBrKS50cmFuc2xhdGUoW3gsIHldKTtcbiAgfSwgb2JqZWN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpdFNpemUocHJvamVjdGlvbiwgc2l6ZSwgb2JqZWN0KSB7XG4gIHJldHVybiBmaXRFeHRlbnQocHJvamVjdGlvbiwgW1swLCAwXSwgc2l6ZV0sIG9iamVjdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXRXaWR0aChwcm9qZWN0aW9uLCB3aWR0aCwgb2JqZWN0KSB7XG4gIHJldHVybiBmaXQocHJvamVjdGlvbiwgZnVuY3Rpb24oYikge1xuICAgIHZhciB3ID0gK3dpZHRoLFxuICAgICAgICBrID0gdyAvIChiWzFdWzBdIC0gYlswXVswXSksXG4gICAgICAgIHggPSAodyAtIGsgKiAoYlsxXVswXSArIGJbMF1bMF0pKSAvIDIsXG4gICAgICAgIHkgPSAtayAqIGJbMF1bMV07XG4gICAgcHJvamVjdGlvbi5zY2FsZSgxNTAgKiBrKS50cmFuc2xhdGUoW3gsIHldKTtcbiAgfSwgb2JqZWN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpdEhlaWdodChwcm9qZWN0aW9uLCBoZWlnaHQsIG9iamVjdCkge1xuICByZXR1cm4gZml0KHByb2plY3Rpb24sIGZ1bmN0aW9uKGIpIHtcbiAgICB2YXIgaCA9ICtoZWlnaHQsXG4gICAgICAgIGsgPSBoIC8gKGJbMV1bMV0gLSBiWzBdWzFdKSxcbiAgICAgICAgeCA9IC1rICogYlswXVswXSxcbiAgICAgICAgeSA9IChoIC0gayAqIChiWzFdWzFdICsgYlswXVsxXSkpIC8gMjtcbiAgICBwcm9qZWN0aW9uLnNjYWxlKDE1MCAqIGspLnRyYW5zbGF0ZShbeCwgeV0pO1xuICB9LCBvYmplY3QpO1xufVxuIiwiaW1wb3J0IGNsaXBBbnRpbWVyaWRpYW4gZnJvbSBcIi4uL2NsaXAvYW50aW1lcmlkaWFuLmpzXCI7XG5pbXBvcnQgY2xpcENpcmNsZSBmcm9tIFwiLi4vY2xpcC9jaXJjbGUuanNcIjtcbmltcG9ydCBjbGlwUmVjdGFuZ2xlIGZyb20gXCIuLi9jbGlwL3JlY3RhbmdsZS5qc1wiO1xuaW1wb3J0IGNvbXBvc2UgZnJvbSBcIi4uL2NvbXBvc2UuanNcIjtcbmltcG9ydCBpZGVudGl0eSBmcm9tIFwiLi4vaWRlbnRpdHkuanNcIjtcbmltcG9ydCB7Y29zLCBkZWdyZWVzLCByYWRpYW5zLCBzaW4sIHNxcnR9IGZyb20gXCIuLi9tYXRoLmpzXCI7XG5pbXBvcnQge3JvdGF0ZVJhZGlhbnN9IGZyb20gXCIuLi9yb3RhdGlvbi5qc1wiO1xuaW1wb3J0IHt0cmFuc2Zvcm1lcn0gZnJvbSBcIi4uL3RyYW5zZm9ybS5qc1wiO1xuaW1wb3J0IHtmaXRFeHRlbnQsIGZpdFNpemUsIGZpdFdpZHRoLCBmaXRIZWlnaHR9IGZyb20gXCIuL2ZpdC5qc1wiO1xuaW1wb3J0IHJlc2FtcGxlIGZyb20gXCIuL3Jlc2FtcGxlLmpzXCI7XG5cbnZhciB0cmFuc2Zvcm1SYWRpYW5zID0gdHJhbnNmb3JtZXIoe1xuICBwb2ludDogZnVuY3Rpb24oeCwgeSkge1xuICAgIHRoaXMuc3RyZWFtLnBvaW50KHggKiByYWRpYW5zLCB5ICogcmFkaWFucyk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Sb3RhdGUocm90YXRlKSB7XG4gIHJldHVybiB0cmFuc2Zvcm1lcih7XG4gICAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgIHZhciByID0gcm90YXRlKHgsIHkpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyZWFtLnBvaW50KHJbMF0sIHJbMV0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNjYWxlVHJhbnNsYXRlKGssIGR4LCBkeSwgc3gsIHN5KSB7XG4gIGZ1bmN0aW9uIHRyYW5zZm9ybSh4LCB5KSB7XG4gICAgeCAqPSBzeDsgeSAqPSBzeTtcbiAgICByZXR1cm4gW2R4ICsgayAqIHgsIGR5IC0gayAqIHldO1xuICB9XG4gIHRyYW5zZm9ybS5pbnZlcnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgcmV0dXJuIFsoeCAtIGR4KSAvIGsgKiBzeCwgKGR5IC0geSkgLyBrICogc3ldO1xuICB9O1xuICByZXR1cm4gdHJhbnNmb3JtO1xufVxuXG5mdW5jdGlvbiBzY2FsZVRyYW5zbGF0ZVJvdGF0ZShrLCBkeCwgZHksIHN4LCBzeSwgYWxwaGEpIHtcbiAgaWYgKCFhbHBoYSkgcmV0dXJuIHNjYWxlVHJhbnNsYXRlKGssIGR4LCBkeSwgc3gsIHN5KTtcbiAgdmFyIGNvc0FscGhhID0gY29zKGFscGhhKSxcbiAgICAgIHNpbkFscGhhID0gc2luKGFscGhhKSxcbiAgICAgIGEgPSBjb3NBbHBoYSAqIGssXG4gICAgICBiID0gc2luQWxwaGEgKiBrLFxuICAgICAgYWkgPSBjb3NBbHBoYSAvIGssXG4gICAgICBiaSA9IHNpbkFscGhhIC8gayxcbiAgICAgIGNpID0gKHNpbkFscGhhICogZHkgLSBjb3NBbHBoYSAqIGR4KSAvIGssXG4gICAgICBmaSA9IChzaW5BbHBoYSAqIGR4ICsgY29zQWxwaGEgKiBkeSkgLyBrO1xuICBmdW5jdGlvbiB0cmFuc2Zvcm0oeCwgeSkge1xuICAgIHggKj0gc3g7IHkgKj0gc3k7XG4gICAgcmV0dXJuIFthICogeCAtIGIgKiB5ICsgZHgsIGR5IC0gYiAqIHggLSBhICogeV07XG4gIH1cbiAgdHJhbnNmb3JtLmludmVydCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICByZXR1cm4gW3N4ICogKGFpICogeCAtIGJpICogeSArIGNpKSwgc3kgKiAoZmkgLSBiaSAqIHggLSBhaSAqIHkpXTtcbiAgfTtcbiAgcmV0dXJuIHRyYW5zZm9ybTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJvamVjdGlvbihwcm9qZWN0KSB7XG4gIHJldHVybiBwcm9qZWN0aW9uTXV0YXRvcihmdW5jdGlvbigpIHsgcmV0dXJuIHByb2plY3Q7IH0pKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0aW9uTXV0YXRvcihwcm9qZWN0QXQpIHtcbiAgdmFyIHByb2plY3QsXG4gICAgICBrID0gMTUwLCAvLyBzY2FsZVxuICAgICAgeCA9IDQ4MCwgeSA9IDI1MCwgLy8gdHJhbnNsYXRlXG4gICAgICBsYW1iZGEgPSAwLCBwaGkgPSAwLCAvLyBjZW50ZXJcbiAgICAgIGRlbHRhTGFtYmRhID0gMCwgZGVsdGFQaGkgPSAwLCBkZWx0YUdhbW1hID0gMCwgcm90YXRlLCAvLyBwcmUtcm90YXRlXG4gICAgICBhbHBoYSA9IDAsIC8vIHBvc3Qtcm90YXRlIGFuZ2xlXG4gICAgICBzeCA9IDEsIC8vIHJlZmxlY3RYXG4gICAgICBzeSA9IDEsIC8vIHJlZmxlY3RYXG4gICAgICB0aGV0YSA9IG51bGwsIHByZWNsaXAgPSBjbGlwQW50aW1lcmlkaWFuLCAvLyBwcmUtY2xpcCBhbmdsZVxuICAgICAgeDAgPSBudWxsLCB5MCwgeDEsIHkxLCBwb3N0Y2xpcCA9IGlkZW50aXR5LCAvLyBwb3N0LWNsaXAgZXh0ZW50XG4gICAgICBkZWx0YTIgPSAwLjUsIC8vIHByZWNpc2lvblxuICAgICAgcHJvamVjdFJlc2FtcGxlLFxuICAgICAgcHJvamVjdFRyYW5zZm9ybSxcbiAgICAgIHByb2plY3RSb3RhdGVUcmFuc2Zvcm0sXG4gICAgICBjYWNoZSxcbiAgICAgIGNhY2hlU3RyZWFtO1xuXG4gIGZ1bmN0aW9uIHByb2plY3Rpb24ocG9pbnQpIHtcbiAgICByZXR1cm4gcHJvamVjdFJvdGF0ZVRyYW5zZm9ybShwb2ludFswXSAqIHJhZGlhbnMsIHBvaW50WzFdICogcmFkaWFucyk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZlcnQocG9pbnQpIHtcbiAgICBwb2ludCA9IHByb2plY3RSb3RhdGVUcmFuc2Zvcm0uaW52ZXJ0KHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgcmV0dXJuIHBvaW50ICYmIFtwb2ludFswXSAqIGRlZ3JlZXMsIHBvaW50WzFdICogZGVncmVlc107XG4gIH1cblxuICBwcm9qZWN0aW9uLnN0cmVhbSA9IGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHJldHVybiBjYWNoZSAmJiBjYWNoZVN0cmVhbSA9PT0gc3RyZWFtID8gY2FjaGUgOiBjYWNoZSA9IHRyYW5zZm9ybVJhZGlhbnModHJhbnNmb3JtUm90YXRlKHJvdGF0ZSkocHJlY2xpcChwcm9qZWN0UmVzYW1wbGUocG9zdGNsaXAoY2FjaGVTdHJlYW0gPSBzdHJlYW0pKSkpKTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLnByZWNsaXAgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocHJlY2xpcCA9IF8sIHRoZXRhID0gdW5kZWZpbmVkLCByZXNldCgpKSA6IHByZWNsaXA7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5wb3N0Y2xpcCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwb3N0Y2xpcCA9IF8sIHgwID0geTAgPSB4MSA9IHkxID0gbnVsbCwgcmVzZXQoKSkgOiBwb3N0Y2xpcDtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmNsaXBBbmdsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwcmVjbGlwID0gK18gPyBjbGlwQ2lyY2xlKHRoZXRhID0gXyAqIHJhZGlhbnMpIDogKHRoZXRhID0gbnVsbCwgY2xpcEFudGltZXJpZGlhbiksIHJlc2V0KCkpIDogdGhldGEgKiBkZWdyZWVzO1xuICB9O1xuXG4gIHByb2plY3Rpb24uY2xpcEV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwb3N0Y2xpcCA9IF8gPT0gbnVsbCA/ICh4MCA9IHkwID0geDEgPSB5MSA9IG51bGwsIGlkZW50aXR5KSA6IGNsaXBSZWN0YW5nbGUoeDAgPSArX1swXVswXSwgeTAgPSArX1swXVsxXSwgeDEgPSArX1sxXVswXSwgeTEgPSArX1sxXVsxXSksIHJlc2V0KCkpIDogeDAgPT0gbnVsbCA/IG51bGwgOiBbW3gwLCB5MF0sIFt4MSwgeTFdXTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLnNjYWxlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGsgPSArXywgcmVjZW50ZXIoKSkgOiBrO1xuICB9O1xuXG4gIHByb2plY3Rpb24udHJhbnNsYXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSArX1swXSwgeSA9ICtfWzFdLCByZWNlbnRlcigpKSA6IFt4LCB5XTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmNlbnRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYW1iZGEgPSBfWzBdICUgMzYwICogcmFkaWFucywgcGhpID0gX1sxXSAlIDM2MCAqIHJhZGlhbnMsIHJlY2VudGVyKCkpIDogW2xhbWJkYSAqIGRlZ3JlZXMsIHBoaSAqIGRlZ3JlZXNdO1xuICB9O1xuXG4gIHByb2plY3Rpb24ucm90YXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRlbHRhTGFtYmRhID0gX1swXSAlIDM2MCAqIHJhZGlhbnMsIGRlbHRhUGhpID0gX1sxXSAlIDM2MCAqIHJhZGlhbnMsIGRlbHRhR2FtbWEgPSBfLmxlbmd0aCA+IDIgPyBfWzJdICUgMzYwICogcmFkaWFucyA6IDAsIHJlY2VudGVyKCkpIDogW2RlbHRhTGFtYmRhICogZGVncmVlcywgZGVsdGFQaGkgKiBkZWdyZWVzLCBkZWx0YUdhbW1hICogZGVncmVlc107XG4gIH07XG5cbiAgcHJvamVjdGlvbi5hbmdsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChhbHBoYSA9IF8gJSAzNjAgKiByYWRpYW5zLCByZWNlbnRlcigpKSA6IGFscGhhICogZGVncmVlcztcbiAgfTtcblxuICBwcm9qZWN0aW9uLnJlZmxlY3RYID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN4ID0gXyA/IC0xIDogMSwgcmVjZW50ZXIoKSkgOiBzeCA8IDA7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5yZWZsZWN0WSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzeSA9IF8gPyAtMSA6IDEsIHJlY2VudGVyKCkpIDogc3kgPCAwO1xuICB9O1xuXG4gIHByb2plY3Rpb24ucHJlY2lzaW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHByb2plY3RSZXNhbXBsZSA9IHJlc2FtcGxlKHByb2plY3RUcmFuc2Zvcm0sIGRlbHRhMiA9IF8gKiBfKSwgcmVzZXQoKSkgOiBzcXJ0KGRlbHRhMik7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5maXRFeHRlbnQgPSBmdW5jdGlvbihleHRlbnQsIG9iamVjdCkge1xuICAgIHJldHVybiBmaXRFeHRlbnQocHJvamVjdGlvbiwgZXh0ZW50LCBvYmplY3QpO1xuICB9O1xuXG4gIHByb2plY3Rpb24uZml0U2l6ZSA9IGZ1bmN0aW9uKHNpemUsIG9iamVjdCkge1xuICAgIHJldHVybiBmaXRTaXplKHByb2plY3Rpb24sIHNpemUsIG9iamVjdCk7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5maXRXaWR0aCA9IGZ1bmN0aW9uKHdpZHRoLCBvYmplY3QpIHtcbiAgICByZXR1cm4gZml0V2lkdGgocHJvamVjdGlvbiwgd2lkdGgsIG9iamVjdCk7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5maXRIZWlnaHQgPSBmdW5jdGlvbihoZWlnaHQsIG9iamVjdCkge1xuICAgIHJldHVybiBmaXRIZWlnaHQocHJvamVjdGlvbiwgaGVpZ2h0LCBvYmplY3QpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlY2VudGVyKCkge1xuICAgIHZhciBjZW50ZXIgPSBzY2FsZVRyYW5zbGF0ZVJvdGF0ZShrLCAwLCAwLCBzeCwgc3ksIGFscGhhKS5hcHBseShudWxsLCBwcm9qZWN0KGxhbWJkYSwgcGhpKSksXG4gICAgICAgIHRyYW5zZm9ybSA9IHNjYWxlVHJhbnNsYXRlUm90YXRlKGssIHggLSBjZW50ZXJbMF0sIHkgLSBjZW50ZXJbMV0sIHN4LCBzeSwgYWxwaGEpO1xuICAgIHJvdGF0ZSA9IHJvdGF0ZVJhZGlhbnMoZGVsdGFMYW1iZGEsIGRlbHRhUGhpLCBkZWx0YUdhbW1hKTtcbiAgICBwcm9qZWN0VHJhbnNmb3JtID0gY29tcG9zZShwcm9qZWN0LCB0cmFuc2Zvcm0pO1xuICAgIHByb2plY3RSb3RhdGVUcmFuc2Zvcm0gPSBjb21wb3NlKHJvdGF0ZSwgcHJvamVjdFRyYW5zZm9ybSk7XG4gICAgcHJvamVjdFJlc2FtcGxlID0gcmVzYW1wbGUocHJvamVjdFRyYW5zZm9ybSwgZGVsdGEyKTtcbiAgICByZXR1cm4gcmVzZXQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGNhY2hlID0gY2FjaGVTdHJlYW0gPSBudWxsO1xuICAgIHJldHVybiBwcm9qZWN0aW9uO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHByb2plY3QgPSBwcm9qZWN0QXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBwcm9qZWN0aW9uLmludmVydCA9IHByb2plY3QuaW52ZXJ0ICYmIGludmVydDtcbiAgICByZXR1cm4gcmVjZW50ZXIoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7Y2FydGVzaWFufSBmcm9tIFwiLi4vY2FydGVzaWFuLmpzXCI7XG5pbXBvcnQge2FicywgYXNpbiwgYXRhbjIsIGNvcywgZXBzaWxvbiwgcmFkaWFucywgc3FydH0gZnJvbSBcIi4uL21hdGguanNcIjtcbmltcG9ydCB7dHJhbnNmb3JtZXJ9IGZyb20gXCIuLi90cmFuc2Zvcm0uanNcIjtcblxudmFyIG1heERlcHRoID0gMTYsIC8vIG1heGltdW0gZGVwdGggb2Ygc3ViZGl2aXNpb25cbiAgICBjb3NNaW5EaXN0YW5jZSA9IGNvcygzMCAqIHJhZGlhbnMpOyAvLyBjb3MobWluaW11bSBhbmd1bGFyIGRpc3RhbmNlKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihwcm9qZWN0LCBkZWx0YTIpIHtcbiAgcmV0dXJuICtkZWx0YTIgPyByZXNhbXBsZShwcm9qZWN0LCBkZWx0YTIpIDogcmVzYW1wbGVOb25lKHByb2plY3QpO1xufVxuXG5mdW5jdGlvbiByZXNhbXBsZU5vbmUocHJvamVjdCkge1xuICByZXR1cm4gdHJhbnNmb3JtZXIoe1xuICAgIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICB4ID0gcHJvamVjdCh4LCB5KTtcbiAgICAgIHRoaXMuc3RyZWFtLnBvaW50KHhbMF0sIHhbMV0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc2FtcGxlKHByb2plY3QsIGRlbHRhMikge1xuXG4gIGZ1bmN0aW9uIHJlc2FtcGxlTGluZVRvKHgwLCB5MCwgbGFtYmRhMCwgYTAsIGIwLCBjMCwgeDEsIHkxLCBsYW1iZGExLCBhMSwgYjEsIGMxLCBkZXB0aCwgc3RyZWFtKSB7XG4gICAgdmFyIGR4ID0geDEgLSB4MCxcbiAgICAgICAgZHkgPSB5MSAtIHkwLFxuICAgICAgICBkMiA9IGR4ICogZHggKyBkeSAqIGR5O1xuICAgIGlmIChkMiA+IDQgKiBkZWx0YTIgJiYgZGVwdGgtLSkge1xuICAgICAgdmFyIGEgPSBhMCArIGExLFxuICAgICAgICAgIGIgPSBiMCArIGIxLFxuICAgICAgICAgIGMgPSBjMCArIGMxLFxuICAgICAgICAgIG0gPSBzcXJ0KGEgKiBhICsgYiAqIGIgKyBjICogYyksXG4gICAgICAgICAgcGhpMiA9IGFzaW4oYyAvPSBtKSxcbiAgICAgICAgICBsYW1iZGEyID0gYWJzKGFicyhjKSAtIDEpIDwgZXBzaWxvbiB8fCBhYnMobGFtYmRhMCAtIGxhbWJkYTEpIDwgZXBzaWxvbiA/IChsYW1iZGEwICsgbGFtYmRhMSkgLyAyIDogYXRhbjIoYiwgYSksXG4gICAgICAgICAgcCA9IHByb2plY3QobGFtYmRhMiwgcGhpMiksXG4gICAgICAgICAgeDIgPSBwWzBdLFxuICAgICAgICAgIHkyID0gcFsxXSxcbiAgICAgICAgICBkeDIgPSB4MiAtIHgwLFxuICAgICAgICAgIGR5MiA9IHkyIC0geTAsXG4gICAgICAgICAgZHogPSBkeSAqIGR4MiAtIGR4ICogZHkyO1xuICAgICAgaWYgKGR6ICogZHogLyBkMiA+IGRlbHRhMiAvLyBwZXJwZW5kaWN1bGFyIHByb2plY3RlZCBkaXN0YW5jZVxuICAgICAgICAgIHx8IGFicygoZHggKiBkeDIgKyBkeSAqIGR5MikgLyBkMiAtIDAuNSkgPiAwLjMgLy8gbWlkcG9pbnQgY2xvc2UgdG8gYW4gZW5kXG4gICAgICAgICAgfHwgYTAgKiBhMSArIGIwICogYjEgKyBjMCAqIGMxIDwgY29zTWluRGlzdGFuY2UpIHsgLy8gYW5ndWxhciBkaXN0YW5jZVxuICAgICAgICByZXNhbXBsZUxpbmVUbyh4MCwgeTAsIGxhbWJkYTAsIGEwLCBiMCwgYzAsIHgyLCB5MiwgbGFtYmRhMiwgYSAvPSBtLCBiIC89IG0sIGMsIGRlcHRoLCBzdHJlYW0pO1xuICAgICAgICBzdHJlYW0ucG9pbnQoeDIsIHkyKTtcbiAgICAgICAgcmVzYW1wbGVMaW5lVG8oeDIsIHkyLCBsYW1iZGEyLCBhLCBiLCBjLCB4MSwgeTEsIGxhbWJkYTEsIGExLCBiMSwgYzEsIGRlcHRoLCBzdHJlYW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgdmFyIGxhbWJkYTAwLCB4MDAsIHkwMCwgYTAwLCBiMDAsIGMwMCwgLy8gZmlyc3QgcG9pbnRcbiAgICAgICAgbGFtYmRhMCwgeDAsIHkwLCBhMCwgYjAsIGMwOyAvLyBwcmV2aW91cyBwb2ludFxuXG4gICAgdmFyIHJlc2FtcGxlU3RyZWFtID0ge1xuICAgICAgcG9pbnQ6IHBvaW50LFxuICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICBsaW5lRW5kOiBsaW5lRW5kLFxuICAgICAgcG9seWdvblN0YXJ0OiBmdW5jdGlvbigpIHsgc3RyZWFtLnBvbHlnb25TdGFydCgpOyByZXNhbXBsZVN0cmVhbS5saW5lU3RhcnQgPSByaW5nU3RhcnQ7IH0sXG4gICAgICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHsgc3RyZWFtLnBvbHlnb25FbmQoKTsgcmVzYW1wbGVTdHJlYW0ubGluZVN0YXJ0ID0gbGluZVN0YXJ0OyB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHBvaW50KHgsIHkpIHtcbiAgICAgIHggPSBwcm9qZWN0KHgsIHkpO1xuICAgICAgc3RyZWFtLnBvaW50KHhbMF0sIHhbMV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVTdGFydCgpIHtcbiAgICAgIHgwID0gTmFOO1xuICAgICAgcmVzYW1wbGVTdHJlYW0ucG9pbnQgPSBsaW5lUG9pbnQ7XG4gICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZVBvaW50KGxhbWJkYSwgcGhpKSB7XG4gICAgICB2YXIgYyA9IGNhcnRlc2lhbihbbGFtYmRhLCBwaGldKSwgcCA9IHByb2plY3QobGFtYmRhLCBwaGkpO1xuICAgICAgcmVzYW1wbGVMaW5lVG8oeDAsIHkwLCBsYW1iZGEwLCBhMCwgYjAsIGMwLCB4MCA9IHBbMF0sIHkwID0gcFsxXSwgbGFtYmRhMCA9IGxhbWJkYSwgYTAgPSBjWzBdLCBiMCA9IGNbMV0sIGMwID0gY1syXSwgbWF4RGVwdGgsIHN0cmVhbSk7XG4gICAgICBzdHJlYW0ucG9pbnQoeDAsIHkwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lRW5kKCkge1xuICAgICAgcmVzYW1wbGVTdHJlYW0ucG9pbnQgPSBwb2ludDtcbiAgICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmluZ1N0YXJ0KCkge1xuICAgICAgbGluZVN0YXJ0KCk7XG4gICAgICByZXNhbXBsZVN0cmVhbS5wb2ludCA9IHJpbmdQb2ludDtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLmxpbmVFbmQgPSByaW5nRW5kO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdQb2ludChsYW1iZGEsIHBoaSkge1xuICAgICAgbGluZVBvaW50KGxhbWJkYTAwID0gbGFtYmRhLCBwaGkpLCB4MDAgPSB4MCwgeTAwID0geTAsIGEwMCA9IGEwLCBiMDAgPSBiMCwgYzAwID0gYzA7XG4gICAgICByZXNhbXBsZVN0cmVhbS5wb2ludCA9IGxpbmVQb2ludDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByaW5nRW5kKCkge1xuICAgICAgcmVzYW1wbGVMaW5lVG8oeDAsIHkwLCBsYW1iZGEwLCBhMCwgYjAsIGMwLCB4MDAsIHkwMCwgbGFtYmRhMDAsIGEwMCwgYjAwLCBjMDAsIG1heERlcHRoLCBzdHJlYW0pO1xuICAgICAgcmVzYW1wbGVTdHJlYW0ubGluZUVuZCA9IGxpbmVFbmQ7XG4gICAgICBsaW5lRW5kKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc2FtcGxlU3RyZWFtO1xuICB9O1xufVxuIiwiaW1wb3J0IGNvbXBvc2UgZnJvbSBcIi4vY29tcG9zZS5qc1wiO1xuaW1wb3J0IHthYnMsIGFzaW4sIGF0YW4yLCBjb3MsIGRlZ3JlZXMsIHBpLCByYWRpYW5zLCBzaW4sIHRhdX0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiByb3RhdGlvbklkZW50aXR5KGxhbWJkYSwgcGhpKSB7XG4gIGlmIChhYnMobGFtYmRhKSA+IHBpKSBsYW1iZGEgLT0gTWF0aC5yb3VuZChsYW1iZGEgLyB0YXUpICogdGF1O1xuICByZXR1cm4gW2xhbWJkYSwgcGhpXTtcbn1cblxucm90YXRpb25JZGVudGl0eS5pbnZlcnQgPSByb3RhdGlvbklkZW50aXR5O1xuXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlUmFkaWFucyhkZWx0YUxhbWJkYSwgZGVsdGFQaGksIGRlbHRhR2FtbWEpIHtcbiAgcmV0dXJuIChkZWx0YUxhbWJkYSAlPSB0YXUpID8gKGRlbHRhUGhpIHx8IGRlbHRhR2FtbWEgPyBjb21wb3NlKHJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKSwgcm90YXRpb25QaGlHYW1tYShkZWx0YVBoaSwgZGVsdGFHYW1tYSkpXG4gICAgOiByb3RhdGlvbkxhbWJkYShkZWx0YUxhbWJkYSkpXG4gICAgOiAoZGVsdGFQaGkgfHwgZGVsdGFHYW1tYSA/IHJvdGF0aW9uUGhpR2FtbWEoZGVsdGFQaGksIGRlbHRhR2FtbWEpXG4gICAgOiByb3RhdGlvbklkZW50aXR5KTtcbn1cblxuZnVuY3Rpb24gZm9yd2FyZFJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKSB7XG4gIHJldHVybiBmdW5jdGlvbihsYW1iZGEsIHBoaSkge1xuICAgIGxhbWJkYSArPSBkZWx0YUxhbWJkYTtcbiAgICBpZiAoYWJzKGxhbWJkYSkgPiBwaSkgbGFtYmRhIC09IE1hdGgucm91bmQobGFtYmRhIC8gdGF1KSAqIHRhdTtcbiAgICByZXR1cm4gW2xhbWJkYSwgcGhpXTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcm90YXRpb25MYW1iZGEoZGVsdGFMYW1iZGEpIHtcbiAgdmFyIHJvdGF0aW9uID0gZm9yd2FyZFJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKTtcbiAgcm90YXRpb24uaW52ZXJ0ID0gZm9yd2FyZFJvdGF0aW9uTGFtYmRhKC1kZWx0YUxhbWJkYSk7XG4gIHJldHVybiByb3RhdGlvbjtcbn1cblxuZnVuY3Rpb24gcm90YXRpb25QaGlHYW1tYShkZWx0YVBoaSwgZGVsdGFHYW1tYSkge1xuICB2YXIgY29zRGVsdGFQaGkgPSBjb3MoZGVsdGFQaGkpLFxuICAgICAgc2luRGVsdGFQaGkgPSBzaW4oZGVsdGFQaGkpLFxuICAgICAgY29zRGVsdGFHYW1tYSA9IGNvcyhkZWx0YUdhbW1hKSxcbiAgICAgIHNpbkRlbHRhR2FtbWEgPSBzaW4oZGVsdGFHYW1tYSk7XG5cbiAgZnVuY3Rpb24gcm90YXRpb24obGFtYmRhLCBwaGkpIHtcbiAgICB2YXIgY29zUGhpID0gY29zKHBoaSksXG4gICAgICAgIHggPSBjb3MobGFtYmRhKSAqIGNvc1BoaSxcbiAgICAgICAgeSA9IHNpbihsYW1iZGEpICogY29zUGhpLFxuICAgICAgICB6ID0gc2luKHBoaSksXG4gICAgICAgIGsgPSB6ICogY29zRGVsdGFQaGkgKyB4ICogc2luRGVsdGFQaGk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGF0YW4yKHkgKiBjb3NEZWx0YUdhbW1hIC0gayAqIHNpbkRlbHRhR2FtbWEsIHggKiBjb3NEZWx0YVBoaSAtIHogKiBzaW5EZWx0YVBoaSksXG4gICAgICBhc2luKGsgKiBjb3NEZWx0YUdhbW1hICsgeSAqIHNpbkRlbHRhR2FtbWEpXG4gICAgXTtcbiAgfVxuXG4gIHJvdGF0aW9uLmludmVydCA9IGZ1bmN0aW9uKGxhbWJkYSwgcGhpKSB7XG4gICAgdmFyIGNvc1BoaSA9IGNvcyhwaGkpLFxuICAgICAgICB4ID0gY29zKGxhbWJkYSkgKiBjb3NQaGksXG4gICAgICAgIHkgPSBzaW4obGFtYmRhKSAqIGNvc1BoaSxcbiAgICAgICAgeiA9IHNpbihwaGkpLFxuICAgICAgICBrID0geiAqIGNvc0RlbHRhR2FtbWEgLSB5ICogc2luRGVsdGFHYW1tYTtcbiAgICByZXR1cm4gW1xuICAgICAgYXRhbjIoeSAqIGNvc0RlbHRhR2FtbWEgKyB6ICogc2luRGVsdGFHYW1tYSwgeCAqIGNvc0RlbHRhUGhpICsgayAqIHNpbkRlbHRhUGhpKSxcbiAgICAgIGFzaW4oayAqIGNvc0RlbHRhUGhpIC0geCAqIHNpbkRlbHRhUGhpKVxuICAgIF07XG4gIH07XG5cbiAgcmV0dXJuIHJvdGF0aW9uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihyb3RhdGUpIHtcbiAgcm90YXRlID0gcm90YXRlUmFkaWFucyhyb3RhdGVbMF0gKiByYWRpYW5zLCByb3RhdGVbMV0gKiByYWRpYW5zLCByb3RhdGUubGVuZ3RoID4gMiA/IHJvdGF0ZVsyXSAqIHJhZGlhbnMgOiAwKTtcblxuICBmdW5jdGlvbiBmb3J3YXJkKGNvb3JkaW5hdGVzKSB7XG4gICAgY29vcmRpbmF0ZXMgPSByb3RhdGUoY29vcmRpbmF0ZXNbMF0gKiByYWRpYW5zLCBjb29yZGluYXRlc1sxXSAqIHJhZGlhbnMpO1xuICAgIHJldHVybiBjb29yZGluYXRlc1swXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlc1sxXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlcztcbiAgfVxuXG4gIGZvcndhcmQuaW52ZXJ0ID0gZnVuY3Rpb24oY29vcmRpbmF0ZXMpIHtcbiAgICBjb29yZGluYXRlcyA9IHJvdGF0ZS5pbnZlcnQoY29vcmRpbmF0ZXNbMF0gKiByYWRpYW5zLCBjb29yZGluYXRlc1sxXSAqIHJhZGlhbnMpO1xuICAgIHJldHVybiBjb29yZGluYXRlc1swXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlc1sxXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlcztcbiAgfTtcblxuICByZXR1cm4gZm9yd2FyZDtcbn1cbiIsImZ1bmN0aW9uIHN0cmVhbUdlb21ldHJ5KGdlb21ldHJ5LCBzdHJlYW0pIHtcbiAgaWYgKGdlb21ldHJ5ICYmIHN0cmVhbUdlb21ldHJ5VHlwZS5oYXNPd25Qcm9wZXJ0eShnZW9tZXRyeS50eXBlKSkge1xuICAgIHN0cmVhbUdlb21ldHJ5VHlwZVtnZW9tZXRyeS50eXBlXShnZW9tZXRyeSwgc3RyZWFtKTtcbiAgfVxufVxuXG52YXIgc3RyZWFtT2JqZWN0VHlwZSA9IHtcbiAgRmVhdHVyZTogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICBzdHJlYW1HZW9tZXRyeShvYmplY3QuZ2VvbWV0cnksIHN0cmVhbSk7XG4gIH0sXG4gIEZlYXR1cmVDb2xsZWN0aW9uOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHZhciBmZWF0dXJlcyA9IG9iamVjdC5mZWF0dXJlcywgaSA9IC0xLCBuID0gZmVhdHVyZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1HZW9tZXRyeShmZWF0dXJlc1tpXS5nZW9tZXRyeSwgc3RyZWFtKTtcbiAgfVxufTtcblxudmFyIHN0cmVhbUdlb21ldHJ5VHlwZSA9IHtcbiAgU3BoZXJlOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHN0cmVhbS5zcGhlcmUoKTtcbiAgfSxcbiAgUG9pbnQ6IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0LmNvb3JkaW5hdGVzO1xuICAgIHN0cmVhbS5wb2ludChvYmplY3RbMF0sIG9iamVjdFsxXSwgb2JqZWN0WzJdKTtcbiAgfSxcbiAgTXVsdGlQb2ludDogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgb2JqZWN0ID0gY29vcmRpbmF0ZXNbaV0sIHN0cmVhbS5wb2ludChvYmplY3RbMF0sIG9iamVjdFsxXSwgb2JqZWN0WzJdKTtcbiAgfSxcbiAgTGluZVN0cmluZzogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICBzdHJlYW1MaW5lKG9iamVjdC5jb29yZGluYXRlcywgc3RyZWFtLCAwKTtcbiAgfSxcbiAgTXVsdGlMaW5lU3RyaW5nOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHZhciBjb29yZGluYXRlcyA9IG9iamVjdC5jb29yZGluYXRlcywgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1MaW5lKGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0sIDApO1xuICB9LFxuICBQb2x5Z29uOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHN0cmVhbVBvbHlnb24ob2JqZWN0LmNvb3JkaW5hdGVzLCBzdHJlYW0pO1xuICB9LFxuICBNdWx0aVBvbHlnb246IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgdmFyIGNvb3JkaW5hdGVzID0gb2JqZWN0LmNvb3JkaW5hdGVzLCBpID0gLTEsIG4gPSBjb29yZGluYXRlcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIHN0cmVhbVBvbHlnb24oY29vcmRpbmF0ZXNbaV0sIHN0cmVhbSk7XG4gIH0sXG4gIEdlb21ldHJ5Q29sbGVjdGlvbjogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICB2YXIgZ2VvbWV0cmllcyA9IG9iamVjdC5nZW9tZXRyaWVzLCBpID0gLTEsIG4gPSBnZW9tZXRyaWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgc3RyZWFtR2VvbWV0cnkoZ2VvbWV0cmllc1tpXSwgc3RyZWFtKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc3RyZWFtTGluZShjb29yZGluYXRlcywgc3RyZWFtLCBjbG9zZWQpIHtcbiAgdmFyIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aCAtIGNsb3NlZCwgY29vcmRpbmF0ZTtcbiAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICB3aGlsZSAoKytpIDwgbikgY29vcmRpbmF0ZSA9IGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0ucG9pbnQoY29vcmRpbmF0ZVswXSwgY29vcmRpbmF0ZVsxXSwgY29vcmRpbmF0ZVsyXSk7XG4gIHN0cmVhbS5saW5lRW5kKCk7XG59XG5cbmZ1bmN0aW9uIHN0cmVhbVBvbHlnb24oY29vcmRpbmF0ZXMsIHN0cmVhbSkge1xuICB2YXIgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICBzdHJlYW0ucG9seWdvblN0YXJ0KCk7XG4gIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1MaW5lKGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0sIDEpO1xuICBzdHJlYW0ucG9seWdvbkVuZCgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICBpZiAob2JqZWN0ICYmIHN0cmVhbU9iamVjdFR5cGUuaGFzT3duUHJvcGVydHkob2JqZWN0LnR5cGUpKSB7XG4gICAgc3RyZWFtT2JqZWN0VHlwZVtvYmplY3QudHlwZV0ob2JqZWN0LCBzdHJlYW0pO1xuICB9IGVsc2Uge1xuICAgIHN0cmVhbUdlb21ldHJ5KG9iamVjdCwgc3RyZWFtKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWV0aG9kcykge1xuICByZXR1cm4ge1xuICAgIHN0cmVhbTogdHJhbnNmb3JtZXIobWV0aG9kcylcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybWVyKG1ldGhvZHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHZhciBzID0gbmV3IFRyYW5zZm9ybVN0cmVhbTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kcykgc1trZXldID0gbWV0aG9kc1trZXldO1xuICAgIHMuc3RyZWFtID0gc3RyZWFtO1xuICAgIHJldHVybiBzO1xuICB9O1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW0oKSB7fVxuXG5UcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogVHJhbnNmb3JtU3RyZWFtLFxuICBwb2ludDogZnVuY3Rpb24oeCwgeSkgeyB0aGlzLnN0cmVhbS5wb2ludCh4LCB5KTsgfSxcbiAgc3BoZXJlOiBmdW5jdGlvbigpIHsgdGhpcy5zdHJlYW0uc3BoZXJlKCk7IH0sXG4gIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7IHRoaXMuc3RyZWFtLmxpbmVTdGFydCgpOyB9LFxuICBsaW5lRW5kOiBmdW5jdGlvbigpIHsgdGhpcy5zdHJlYW0ubGluZUVuZCgpOyB9LFxuICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkgeyB0aGlzLnN0cmVhbS5wb2x5Z29uU3RhcnQoKTsgfSxcbiAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7IHRoaXMuc3RyZWFtLnBvbHlnb25FbmQoKTsgfVxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy9AdHMtY2hlY2tcbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBnZW9BemltdXRoYWxFcXVhbEFyZWEgfSBmcm9tICdkMy1nZW8nXG5cbi8qKlxuICogUHJvamVjdGlvbiBmdW5jdGlvbiBmb3IgRXVyb3BlYW4gTEFFQS5cbiAqL1xuZXhwb3J0IGNvbnN0IHByb2ozMDM1ID0gZ2VvQXppbXV0aGFsRXF1YWxBcmVhKClcbiAgICAucm90YXRlKFstMTAsIC01Ml0pXG4gICAgLnJlZmxlY3RYKGZhbHNlKVxuICAgIC5yZWZsZWN0WSh0cnVlKVxuICAgIC5zY2FsZSg2Mzc4MTM3KVxuICAgIC50cmFuc2xhdGUoWzQzMjEwMDAsIDMyMTAwMDBdKVxuXG4vKipcbiAqIFJldHVybnMgb3B0aW9ucyBmb3IgZ3JpZHZpeiBsYWJlbCBsYXllci5cbiAqIEZyb20gRXVyb255bSBkYXRhOiBodHRwczovL2dpdGh1Yi5jb20vZXVyb3N0YXQvZXVyb255bVxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFdXJvbnltZUxhYmVsTGF5ZXIgPSBmdW5jdGlvbiAoY2MgPSAnRVVSJywgcmVzID0gNTAsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fVxuICAgIGNvbnN0IGV4ID0gb3B0cy5leCB8fCAxLjJcbiAgICBjb25zdCBmb250RmFtaWx5ID0gb3B0cy5mb250RmFtaWx5IHx8ICdBcmlhbCdcbiAgICBjb25zdCBleFNpemUgPSBvcHRzLmV4U2l6ZSB8fCAxXG4gICAgb3B0cy5zdHlsZSA9XG4gICAgICAgIG9wdHMuc3R5bGUgfHxcbiAgICAgICAgKChsYiwgemYpID0+IHtcbiAgICAgICAgICAgIGlmIChsYi5ycyA8IGV4ICogemYpIHJldHVyblxuICAgICAgICAgICAgaWYgKGxiLnIxIDwgZXggKiB6ZikgcmV0dXJuIGV4U2l6ZSArICdlbSAnICsgZm9udEZhbWlseVxuICAgICAgICAgICAgcmV0dXJuIGV4U2l6ZSAqIDEuNSArICdlbSAnICsgZm9udEZhbWlseVxuICAgICAgICB9KVxuICAgIG9wdHMucHJvaiA9IG9wdHMucHJvaiB8fCBwcm9qMzAzNVxuICAgIG9wdHMucHJlcHJvY2VzcyA9IChsYikgPT4ge1xuICAgICAgICAvL2V4Y2x1ZGUgY291bnRyaWVzXG4gICAgICAgIC8vaWYob3B0cy5jY091dCAmJiBsYi5jYyAmJiBvcHRzLmNjT3V0LmluY2x1ZGVzKGxiLmNjKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAob3B0cy5jY0luICYmIGxiLmNjICYmICEob3B0cy5jY0luLmluZGV4T2YobGIuY2MpID49IDApKSByZXR1cm4gZmFsc2VcblxuICAgICAgICAvL3Byb2plY3QgZnJvbSBnZW8gY29vcmRpbmF0ZXMgdG8gRVRSUzg5LUxBRUFcbiAgICAgICAgY29uc3QgcCA9IG9wdHMucHJvaihbbGIubG9uLCBsYi5sYXRdKVxuICAgICAgICBsYi54ID0gcFswXVxuICAgICAgICBsYi55ID0gcFsxXVxuICAgICAgICBkZWxldGUgbGIubG9uXG4gICAgICAgIGRlbGV0ZSBsYi5sYXRcbiAgICB9XG4gICAgb3B0cy5iYXNlVVJMID0gb3B0cy5iYXNlVVJMIHx8ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZXVyb3N0YXQvZXVyb255bS9tYWluL3B1Yi92Mi9VVEYvJ1xuICAgIG9wdHMudXJsID0gb3B0cy5iYXNlVVJMICsgcmVzICsgJy8nICsgY2MgKyAnLmNzdidcbiAgICByZXR1cm4gb3B0c1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBvcHRpb25zIGZvciBncmlkdml6IGJvdW5kYXJpZXMgbGF5ZXIuXG4gKiBGcm9tIE51dHMyanNvbiBkYXRhOiBodHRwczovL2dpdGh1Yi5jb20vZXVyb3N0YXQvTnV0czJqc29uXG4gKiBcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFdXJvc3RhdEJvdW5kYXJpZXNMYXllciA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge31cbiAgICBjb25zdCBudXRzWWVhciA9IG9wdHMubnV0c1llYXIgfHwgJzIwMjEnXG4gICAgY29uc3QgY3JzID0gb3B0cy5jcnMgfHwgJzMwMzUnXG4gICAgY29uc3Qgc2NhbGUgPSBvcHRzLnNjYWxlIHx8ICcwM00nXG4gICAgY29uc3QgbnV0c0xldmVsID0gb3B0cy5udXRzTGV2ZWwgfHwgJzMnXG4gICAgY29uc3QgY29sID0gb3B0cy5jb2wgfHwgJyM4ODgnXG4gICAgY29uc3QgY29sS29zb3ZvID0gb3B0cy5jb2xLb3Nvdm8gfHwgJyNiY2JjYmMnXG4gICAgY29uc3Qgc2hvd090aCA9IG9wdHMuc2hvd090aCA9PSB1bmRlZmluZWQgPyB0cnVlIDogb3B0cy5zaG93T3RoXG5cbiAgICAvL3RoaXMgbGluZSBpcyB1c2VsZXNzIGJ1dCB0byBzaG93IGl0IGlzIHBvc3NpYmxlIHRvIHNwZWNpZnkgYSBwcm9qZWN0aW9uIGZ1bmN0aW9uLlxuICAgIC8vaW4gbW9zdCBvZiB0aGUgY2FzZSwgYWxyZWFkeSBwcm9qZWN0ZWQgZGF0YSBvZiBudXRzMmpzb24gd2lsbCBiZSB1c2VkLCB1c2luZyAnb3B0cy5jcnMnXG4gICAgb3B0cy5wcm9qID0gb3B0cy5wcm9qIHx8IHVuZGVmaW5lZFxuXG4gICAgb3B0cy5jb2xvciA9XG4gICAgICAgIG9wdHMuY29sb3IgfHxcbiAgICAgICAgKChmLCB6ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IGYucHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKCFzaG93T3RoIC8qJiYgcC5jbyA9PSBcIkZcIiovICYmIHAuZXUgIT0gJ1QnICYmIHAuY2MgIT0gJ1QnICYmIHAuZWZ0YSAhPSAnVCcgJiYgcC5vdGggPT09ICdUJylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGlmIChwLmlkID49IDEwMDAwMCkgcmV0dXJuIGNvbEtvc292b1xuICAgICAgICAgICAgaWYgKHAuY28gPT09ICdUJykgcmV0dXJuIGNvbFxuICAgICAgICAgICAgaWYgKHpmIDwgNDAwKSByZXR1cm4gY29sXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA+PSAzID8gJycgOiBjb2xcbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMjAwMCkgcmV0dXJuIHAubHZsID49IDIgPyAnJyA6IGNvbFxuICAgICAgICAgICAgZWxzZSByZXR1cm4gcC5sdmwgPj0gMSA/ICcnIDogY29sXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLndpZHRoID1cbiAgICAgICAgb3B0cy53aWR0aCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gMC41XG4gICAgICAgICAgICBpZiAoemYgPCA0MDApIHJldHVybiBwLmx2bCA9PSAzID8gMi4yIDogcC5sdmwgPT0gMiA/IDIuMiA6IHAubHZsID09IDEgPyAyLjIgOiA0XG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA9PSAyID8gMS44IDogcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAyMDAwKSByZXR1cm4gcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gMS4yXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLmxpbmVEYXNoID1cbiAgICAgICAgb3B0cy5saW5lRGFzaCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gW11cbiAgICAgICAgICAgIGlmICh6ZiA8IDQwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gM1xuICAgICAgICAgICAgICAgICAgICA/IFsyICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgOiBwLmx2bCA9PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFs1ICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogcC5sdmwgPT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gWzUgKiB6ZiwgMiAqIHpmXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWzEwICogemYsIDMgKiB6Zl1cbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMTAwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gMiA/IFs1ICogemYsIDIgKiB6Zl0gOiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDIwMDApIHJldHVybiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIHJldHVybiBbMTAgKiB6ZiwgMyAqIHpmXVxuICAgICAgICB9KVxuXG4gICAgb3B0cy5iYXNlVVJMID0gb3B0cy5iYXNlVVJMIHx8ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZXVyb3N0YXQvTnV0czJqc29uL21hc3Rlci9wdWIvdjIvJ1xuICAgIG9wdHMudXJsID0gb3B0cy5iYXNlVVJMICsgbnV0c1llYXIgKyAnLycgKyBjcnMgKyAnLycgKyBzY2FsZSArICcvbnV0c2JuXycgKyBudXRzTGV2ZWwgKyAnLmpzb24nXG4gICAgcmV0dXJuIG9wdHNcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==