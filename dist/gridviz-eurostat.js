(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["gridviz_eurostat"] = factory();
	else
		root["gridviz_eurostat"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/mgrs/mgrs.js":
/*!***********************************!*\
  !*** ./node_modules/mgrs/mgrs.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   toPoint: () => (/* binding */ toPoint)
/* harmony export */ });



/**
 * UTM zones are grouped, and assigned to one of a group of 6
 * sets.
 *
 * {int} @private
 */
var NUM_100K_SETS = 6;

/**
 * The column letters (for easting) of the lower left value, per
 * set.
 *
 * {string} @private
 */
var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';

/**
 * The row letters (for northing) of the lower left value, per
 * set.
 *
 * {string} @private
 */
var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';

var A = 65; // A
var I = 73; // I
var O = 79; // O
var V = 86; // V
var Z = 90; // Z
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  forward: forward,
  inverse: inverse,
  toPoint: toPoint
});
/**
 * Conversion of lat/lon to MGRS.
 *
 * @param {object} ll Object literal with lat and lon properties on a
 *     WGS84 ellipsoid.
 * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
 *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
 * @return {string} the MGRS string for the given location and accuracy.
 */
function forward(ll, accuracy) {
  accuracy = accuracy || 5; // default accuracy 1m
  return encode(LLtoUTM({
    lat: ll[1],
    lon: ll[0]
  }), accuracy);
};

/**
 * Conversion of MGRS to lat/lon.
 *
 * @param {string} mgrs MGRS string.
 * @return {array} An array with left (longitude), bottom (latitude), right
 *     (longitude) and top (latitude) values in WGS84, representing the
 *     bounding box for the provided MGRS reference.
 */
function inverse(mgrs) {
  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
  if (bbox.lat && bbox.lon) {
    return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
  }
  return [bbox.left, bbox.bottom, bbox.right, bbox.top];
};

function toPoint(mgrs) {
  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
  if (bbox.lat && bbox.lon) {
    return [bbox.lon, bbox.lat];
  }
  return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
};
/**
 * Conversion from degrees to radians.
 *
 * @private
 * @param {number} deg the angle in degrees.
 * @return {number} the angle in radians.
 */
function degToRad(deg) {
  return (deg * (Math.PI / 180.0));
}

/**
 * Conversion from radians to degrees.
 *
 * @private
 * @param {number} rad the angle in radians.
 * @return {number} the angle in degrees.
 */
function radToDeg(rad) {
  return (180.0 * (rad / Math.PI));
}

/**
 * Converts a set of Longitude and Latitude co-ordinates to UTM
 * using the WGS84 ellipsoid.
 *
 * @private
 * @param {object} ll Object literal with lat and lon properties
 *     representing the WGS84 coordinate to be converted.
 * @return {object} Object literal containing the UTM value with easting,
 *     northing, zoneNumber and zoneLetter properties, and an optional
 *     accuracy property in digits. Returns null if the conversion failed.
 */
function LLtoUTM(ll) {
  var Lat = ll.lat;
  var Long = ll.lon;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var k0 = 0.9996;
  var LongOrigin;
  var eccPrimeSquared;
  var N, T, C, A, M;
  var LatRad = degToRad(Lat);
  var LongRad = degToRad(Long);
  var LongOriginRad;
  var ZoneNumber;
  // (int)
  ZoneNumber = Math.floor((Long + 180) / 6) + 1;

  //Make sure the longitude 180.00 is in Zone 60
  if (Long === 180) {
    ZoneNumber = 60;
  }

  // Special zone for Norway
  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
    ZoneNumber = 32;
  }

  // Special zones for Svalbard
  if (Lat >= 72.0 && Lat < 84.0) {
    if (Long >= 0.0 && Long < 9.0) {
      ZoneNumber = 31;
    }
    else if (Long >= 9.0 && Long < 21.0) {
      ZoneNumber = 33;
    }
    else if (Long >= 21.0 && Long < 33.0) {
      ZoneNumber = 35;
    }
    else if (Long >= 33.0 && Long < 42.0) {
      ZoneNumber = 37;
    }
  }

  LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
  // in middle of
  // zone
  LongOriginRad = degToRad(LongOrigin);

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
  T = Math.tan(LatRad) * Math.tan(LatRad);
  C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
  A = Math.cos(LatRad) * (LongRad - LongOriginRad);

  M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

  var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

  var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
  if (Lat < 0.0) {
    UTMNorthing += 10000000.0; //10000000 meter offset for
    // southern hemisphere
  }

  return {
    northing: Math.round(UTMNorthing),
    easting: Math.round(UTMEasting),
    zoneNumber: ZoneNumber,
    zoneLetter: getLetterDesignator(Lat)
  };
}

/**
 * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
 * class where the Zone can be specified as a single string eg."60N" which
 * is then broken down into the ZoneNumber and ZoneLetter.
 *
 * @private
 * @param {object} utm An object literal with northing, easting, zoneNumber
 *     and zoneLetter properties. If an optional accuracy property is
 *     provided (in meters), a bounding box will be returned instead of
 *     latitude and longitude.
 * @return {object} An object literal containing either lat and lon values
 *     (if no accuracy was provided), or top, right, bottom and left values
 *     for the bounding box calculated according to the provided accuracy.
 *     Returns null if the conversion failed.
 */
function UTMtoLL(utm) {

  var UTMNorthing = utm.northing;
  var UTMEasting = utm.easting;
  var zoneLetter = utm.zoneLetter;
  var zoneNumber = utm.zoneNumber;
  // check the ZoneNummber is valid
  if (zoneNumber < 0 || zoneNumber > 60) {
    return null;
  }

  var k0 = 0.9996;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var eccPrimeSquared;
  var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
  var N1, T1, C1, R1, D, M;
  var LongOrigin;
  var mu, phi1Rad;

  // remove 500,000 meter offset for longitude
  var x = UTMEasting - 500000.0;
  var y = UTMNorthing;

  // We must know somehow if we are in the Northern or Southern
  // hemisphere, this is the only time we use the letter So even
  // if the Zone letter isn't exactly correct it should indicate
  // the hemisphere correctly
  if (zoneLetter < 'N') {
    y -= 10000000.0; // remove 10,000,000 meter offset used
    // for southern hemisphere
  }

  // There are 60 zones with zone 1 being at West -180 to -174
  LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
  // in middle of
  // zone

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  M = y / k0;
  mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

  phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
  // double phi1 = ProjMath.radToDeg(phi1Rad);

  N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  D = x / (N1 * k0);

  var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
  lat = radToDeg(lat);

  var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
  lon = LongOrigin + radToDeg(lon);

  var result;
  if (utm.accuracy) {
    var topRight = UTMtoLL({
      northing: utm.northing + utm.accuracy,
      easting: utm.easting + utm.accuracy,
      zoneLetter: utm.zoneLetter,
      zoneNumber: utm.zoneNumber
    });
    result = {
      top: topRight.lat,
      right: topRight.lon,
      bottom: lat,
      left: lon
    };
  }
  else {
    result = {
      lat: lat,
      lon: lon
    };
  }
  return result;
}

/**
 * Calculates the MGRS letter designator for the given latitude.
 *
 * @private
 * @param {number} lat The latitude in WGS84 to get the letter designator
 *     for.
 * @return {char} The letter designator.
 */
function getLetterDesignator(lat) {
  //This is here as an error flag to show that the Latitude is
  //outside MGRS limits
  var LetterDesignator = 'Z';

  if ((84 >= lat) && (lat >= 72)) {
    LetterDesignator = 'X';
  }
  else if ((72 > lat) && (lat >= 64)) {
    LetterDesignator = 'W';
  }
  else if ((64 > lat) && (lat >= 56)) {
    LetterDesignator = 'V';
  }
  else if ((56 > lat) && (lat >= 48)) {
    LetterDesignator = 'U';
  }
  else if ((48 > lat) && (lat >= 40)) {
    LetterDesignator = 'T';
  }
  else if ((40 > lat) && (lat >= 32)) {
    LetterDesignator = 'S';
  }
  else if ((32 > lat) && (lat >= 24)) {
    LetterDesignator = 'R';
  }
  else if ((24 > lat) && (lat >= 16)) {
    LetterDesignator = 'Q';
  }
  else if ((16 > lat) && (lat >= 8)) {
    LetterDesignator = 'P';
  }
  else if ((8 > lat) && (lat >= 0)) {
    LetterDesignator = 'N';
  }
  else if ((0 > lat) && (lat >= -8)) {
    LetterDesignator = 'M';
  }
  else if ((-8 > lat) && (lat >= -16)) {
    LetterDesignator = 'L';
  }
  else if ((-16 > lat) && (lat >= -24)) {
    LetterDesignator = 'K';
  }
  else if ((-24 > lat) && (lat >= -32)) {
    LetterDesignator = 'J';
  }
  else if ((-32 > lat) && (lat >= -40)) {
    LetterDesignator = 'H';
  }
  else if ((-40 > lat) && (lat >= -48)) {
    LetterDesignator = 'G';
  }
  else if ((-48 > lat) && (lat >= -56)) {
    LetterDesignator = 'F';
  }
  else if ((-56 > lat) && (lat >= -64)) {
    LetterDesignator = 'E';
  }
  else if ((-64 > lat) && (lat >= -72)) {
    LetterDesignator = 'D';
  }
  else if ((-72 > lat) && (lat >= -80)) {
    LetterDesignator = 'C';
  }
  return LetterDesignator;
}

/**
 * Encodes a UTM location as MGRS string.
 *
 * @private
 * @param {object} utm An object literal with easting, northing,
 *     zoneLetter, zoneNumber
 * @param {number} accuracy Accuracy in digits (1-5).
 * @return {string} MGRS string for the given UTM location.
 */
function encode(utm, accuracy) {
  // prepend with leading zeroes
  var seasting = "00000" + utm.easting,
    snorthing = "00000" + utm.northing;

  return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
}

/**
 * Get the two letter 100k designator for a given UTM easting,
 * northing and zone number value.
 *
 * @private
 * @param {number} easting
 * @param {number} northing
 * @param {number} zoneNumber
 * @return the two letter 100k designator for the given UTM location.
 */
function get100kID(easting, northing, zoneNumber) {
  var setParm = get100kSetForZone(zoneNumber);
  var setColumn = Math.floor(easting / 100000);
  var setRow = Math.floor(northing / 100000) % 20;
  return getLetter100kID(setColumn, setRow, setParm);
}

/**
 * Given a UTM zone number, figure out the MGRS 100K set it is in.
 *
 * @private
 * @param {number} i An UTM zone number.
 * @return {number} the 100k set the UTM zone is in.
 */
function get100kSetForZone(i) {
  var setParm = i % NUM_100K_SETS;
  if (setParm === 0) {
    setParm = NUM_100K_SETS;
  }

  return setParm;
}

/**
 * Get the two-letter MGRS 100k designator given information
 * translated from the UTM northing, easting and zone number.
 *
 * @private
 * @param {number} column the column index as it relates to the MGRS
 *        100k set spreadsheet, created from the UTM easting.
 *        Values are 1-8.
 * @param {number} row the row index as it relates to the MGRS 100k set
 *        spreadsheet, created from the UTM northing value. Values
 *        are from 0-19.
 * @param {number} parm the set block, as it relates to the MGRS 100k set
 *        spreadsheet, created from the UTM zone. Values are from
 *        1-60.
 * @return two letter MGRS 100k code.
 */
function getLetter100kID(column, row, parm) {
  // colOrigin and rowOrigin are the letters at the origin of the set
  var index = parm - 1;
  var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
  var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

  // colInt and rowInt are the letters to build to return
  var colInt = colOrigin + column - 1;
  var rowInt = rowOrigin + row;
  var rollover = false;

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
    rollover = true;
  }

  if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
    colInt++;
  }

  if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
    colInt++;

    if (colInt === I) {
      colInt++;
    }
  }

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
    rollover = true;
  }
  else {
    rollover = false;
  }

  if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
    rowInt++;
  }

  if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
    rowInt++;

    if (rowInt === I) {
      rowInt++;
    }
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
  }

  var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
  return twoLetter;
}

/**
 * Decode the UTM parameters from a MGRS string.
 *
 * @private
 * @param {string} mgrsString an UPPERCASE coordinate string is expected.
 * @return {object} An object literal with easting, northing, zoneLetter,
 *     zoneNumber and accuracy (in meters) properties.
 */
function decode(mgrsString) {

  if (mgrsString && mgrsString.length === 0) {
    throw ("MGRSPoint coverting from nothing");
  }

  var length = mgrsString.length;

  var hunK = null;
  var sb = "";
  var testChar;
  var i = 0;

  // get Zone number
  while (!(/[A-Z]/).test(testChar = mgrsString.charAt(i))) {
    if (i >= 2) {
      throw ("MGRSPoint bad conversion from: " + mgrsString);
    }
    sb += testChar;
    i++;
  }

  var zoneNumber = parseInt(sb, 10);

  if (i === 0 || i + 3 > length) {
    // A good MGRS string has to be 4-5 digits long,
    // ##AAA/#AAA at least.
    throw ("MGRSPoint bad conversion from: " + mgrsString);
  }

  var zoneLetter = mgrsString.charAt(i++);

  // Should we check the zone letter here? Why not.
  if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
    throw ("MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString);
  }

  hunK = mgrsString.substring(i, i += 2);

  var set = get100kSetForZone(zoneNumber);

  var east100k = getEastingFromChar(hunK.charAt(0), set);
  var north100k = getNorthingFromChar(hunK.charAt(1), set);

  // We have a bug where the northing may be 2000000 too low.
  // How
  // do we know when to roll over?

  while (north100k < getMinNorthing(zoneLetter)) {
    north100k += 2000000;
  }

  // calculate the char index for easting/northing separator
  var remainder = length - i;

  if (remainder % 2 !== 0) {
    throw ("MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString);
  }

  var sep = remainder / 2;

  var sepEasting = 0.0;
  var sepNorthing = 0.0;
  var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;
  if (sep > 0) {
    accuracyBonus = 100000.0 / Math.pow(10, sep);
    sepEastingString = mgrsString.substring(i, i + sep);
    sepEasting = parseFloat(sepEastingString) * accuracyBonus;
    sepNorthingString = mgrsString.substring(i + sep);
    sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
  }

  easting = sepEasting + east100k;
  northing = sepNorthing + north100k;

  return {
    easting: easting,
    northing: northing,
    zoneLetter: zoneLetter,
    zoneNumber: zoneNumber,
    accuracy: accuracyBonus
  };
}

/**
 * Given the first letter from a two-letter MGRS 100k zone, and given the
 * MGRS table set for the zone number, figure out the easting value that
 * should be added to the other, secondary easting value.
 *
 * @private
 * @param {char} e The first letter from a two-letter MGRS 100´k zone.
 * @param {number} set The MGRS table set for the zone number.
 * @return {number} The easting value for the given letter and set.
 */
function getEastingFromChar(e, set) {
  // colOrigin is the letter at the origin of the set for the
  // column
  var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
  var eastingValue = 100000.0;
  var rewindMarker = false;

  while (curCol !== e.charCodeAt(0)) {
    curCol++;
    if (curCol === I) {
      curCol++;
    }
    if (curCol === O) {
      curCol++;
    }
    if (curCol > Z) {
      if (rewindMarker) {
        throw ("Bad character: " + e);
      }
      curCol = A;
      rewindMarker = true;
    }
    eastingValue += 100000.0;
  }

  return eastingValue;
}

/**
 * Given the second letter from a two-letter MGRS 100k zone, and given the
 * MGRS table set for the zone number, figure out the northing value that
 * should be added to the other, secondary northing value. You have to
 * remember that Northings are determined from the equator, and the vertical
 * cycle of letters mean a 2000000 additional northing meters. This happens
 * approx. every 18 degrees of latitude. This method does *NOT* count any
 * additional northings. You have to figure out how many 2000000 meters need
 * to be added for the zone letter of the MGRS coordinate.
 *
 * @private
 * @param {char} n Second letter of the MGRS 100k zone
 * @param {number} set The MGRS table set number, which is dependent on the
 *     UTM zone number.
 * @return {number} The northing value for the given letter and set.
 */
function getNorthingFromChar(n, set) {

  if (n > 'V') {
    throw ("MGRSPoint given invalid Northing " + n);
  }

  // rowOrigin is the letter at the origin of the set for the
  // column
  var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
  var northingValue = 0.0;
  var rewindMarker = false;

  while (curRow !== n.charCodeAt(0)) {
    curRow++;
    if (curRow === I) {
      curRow++;
    }
    if (curRow === O) {
      curRow++;
    }
    // fixing a bug making whole application hang in this loop
    // when 'n' is a wrong character
    if (curRow > V) {
      if (rewindMarker) { // making sure that this loop ends
        throw ("Bad character: " + n);
      }
      curRow = A;
      rewindMarker = true;
    }
    northingValue += 100000.0;
  }

  return northingValue;
}

/**
 * The function getMinNorthing returns the minimum northing value of a MGRS
 * zone.
 *
 * Ported from Geotrans' c Lattitude_Band_Value structure table.
 *
 * @private
 * @param {char} zoneLetter The MGRS zone to get the min northing for.
 * @return {number}
 */
function getMinNorthing(zoneLetter) {
  var northing;
  switch (zoneLetter) {
  case 'C':
    northing = 1100000.0;
    break;
  case 'D':
    northing = 2000000.0;
    break;
  case 'E':
    northing = 2800000.0;
    break;
  case 'F':
    northing = 3700000.0;
    break;
  case 'G':
    northing = 4600000.0;
    break;
  case 'H':
    northing = 5500000.0;
    break;
  case 'J':
    northing = 6400000.0;
    break;
  case 'K':
    northing = 7300000.0;
    break;
  case 'L':
    northing = 8200000.0;
    break;
  case 'M':
    northing = 9100000.0;
    break;
  case 'N':
    northing = 0.0;
    break;
  case 'P':
    northing = 800000.0;
    break;
  case 'Q':
    northing = 1700000.0;
    break;
  case 'R':
    northing = 2600000.0;
    break;
  case 'S':
    northing = 3500000.0;
    break;
  case 'T':
    northing = 4400000.0;
    break;
  case 'U':
    northing = 5300000.0;
    break;
  case 'V':
    northing = 6200000.0;
    break;
  case 'W':
    northing = 7000000.0;
    break;
  case 'X':
    northing = 7900000.0;
    break;
  default:
    northing = -1.0;
  }
  if (northing >= 0.0) {
    return northing;
  }
  else {
    throw ("Invalid zone letter: " + zoneLetter);
  }

}


/***/ }),

/***/ "./node_modules/proj4/lib/Point.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/Point.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var mgrs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mgrs */ "./node_modules/mgrs/mgrs.js");


/**
 * @deprecated v3.0.0 - use proj4.toPoint instead
 * @param {number | import('./core').TemplateCoordinates | string} x
 * @param {number} [y]
 * @param {number} [z]
 */
function Point(x, y, z) {
  if (!(this instanceof Point)) {
    return new Point(x, y, z);
  }
  if (Array.isArray(x)) {
    this.x = x[0];
    this.y = x[1];
    this.z = x[2] || 0.0;
  } else if (typeof x === 'object') {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z || 0.0;
  } else if (typeof x === 'string' && typeof y === 'undefined') {
    var coords = x.split(',');
    this.x = parseFloat(coords[0]);
    this.y = parseFloat(coords[1]);
    this.z = parseFloat(coords[2]) || 0.0;
  } else {
    this.x = x;
    this.y = y;
    this.z = z || 0.0;
  }
  console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
}

Point.fromMGRS = function (mgrsStr) {
  return new Point((0,mgrs__WEBPACK_IMPORTED_MODULE_0__.toPoint)(mgrsStr));
};
Point.prototype.toMGRS = function (accuracy) {
  return (0,mgrs__WEBPACK_IMPORTED_MODULE_0__.forward)([this.x, this.y], accuracy);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Point);


/***/ }),

/***/ "./node_modules/proj4/lib/Proj.js":
/*!****************************************!*\
  !*** ./node_modules/proj4/lib/Proj.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parseCode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parseCode */ "./node_modules/proj4/lib/parseCode.js");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extend */ "./node_modules/proj4/lib/extend.js");
/* harmony import */ var _projections__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projections */ "./node_modules/proj4/lib/projections.js");
/* harmony import */ var _deriveConstants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deriveConstants */ "./node_modules/proj4/lib/deriveConstants.js");
/* harmony import */ var _constants_Datum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants/Datum */ "./node_modules/proj4/lib/constants/Datum.js");
/* harmony import */ var _datum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./datum */ "./node_modules/proj4/lib/datum.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");
/* harmony import */ var _nadgrid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./nadgrid */ "./node_modules/proj4/lib/nadgrid.js");









/**
 * @typedef {Object} DatumDefinition
 * @property {number} datum_type - The type of datum.
 * @property {number} a - Semi-major axis of the ellipsoid.
 * @property {number} b - Semi-minor axis of the ellipsoid.
 * @property {number} es - Eccentricity squared of the ellipsoid.
 * @property {number} ep2 - Second eccentricity squared of the ellipsoid.
 */

/**
 * @param {string | import('./core').PROJJSONDefinition | import('./defs').ProjectionDefinition} srsCode
 * @param {(errorMessage?: string, instance?: Projection) => void} [callback]
 */
function Projection(srsCode, callback) {
  if (!(this instanceof Projection)) {
    return new Projection(srsCode);
  }
  /** @type {<T extends import('./core').TemplateCoordinates>(coordinates: T, enforceAxis?: boolean) => T} */
  this.forward = null;
  /** @type {<T extends import('./core').TemplateCoordinates>(coordinates: T, enforceAxis?: boolean) => T} */
  this.inverse = null;
  /** @type {function(): void} */
  this.init = null;
  /** @type {string} */
  this.name;
  /** @type {Array<string>} */
  this.names = null;
  /** @type {string} */
  this.title;
  callback = callback || function (error) {
    if (error) {
      throw error;
    }
  };
  var json = (0,_parseCode__WEBPACK_IMPORTED_MODULE_0__["default"])(srsCode);
  if (typeof json !== 'object') {
    callback('Could not parse to valid json: ' + srsCode);
    return;
  }
  var ourProj = Projection.projections.get(json.projName);
  if (!ourProj) {
    callback('Could not get projection name from: ' + srsCode);
    return;
  }
  if (json.datumCode && json.datumCode !== 'none') {
    var datumDef = (0,_match__WEBPACK_IMPORTED_MODULE_6__["default"])(_constants_Datum__WEBPACK_IMPORTED_MODULE_4__["default"], json.datumCode);
    if (datumDef) {
      json.datum_params = json.datum_params || (datumDef.towgs84 ? datumDef.towgs84.split(',') : null);
      json.ellps = datumDef.ellipse;
      json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
    }
  }
  json.k0 = json.k0 || 1.0;
  json.axis = json.axis || 'enu';
  json.ellps = json.ellps || 'wgs84';
  json.lat1 = json.lat1 || json.lat0; // Lambert_Conformal_Conic_1SP, for example, needs this

  var sphere_ = (0,_deriveConstants__WEBPACK_IMPORTED_MODULE_3__.sphere)(json.a, json.b, json.rf, json.ellps, json.sphere);
  var ecc = (0,_deriveConstants__WEBPACK_IMPORTED_MODULE_3__.eccentricity)(sphere_.a, sphere_.b, sphere_.rf, json.R_A);
  var nadgrids = (0,_nadgrid__WEBPACK_IMPORTED_MODULE_7__.getNadgrids)(json.nadgrids);
  /** @type {DatumDefinition} */
  var datumObj = json.datum || (0,_datum__WEBPACK_IMPORTED_MODULE_5__["default"])(json.datumCode, json.datum_params, sphere_.a, sphere_.b, ecc.es, ecc.ep2,
    nadgrids);

  (0,_extend__WEBPACK_IMPORTED_MODULE_1__["default"])(this, json); // transfer everything over from the projection because we don't know what we'll need
  (0,_extend__WEBPACK_IMPORTED_MODULE_1__["default"])(this, ourProj); // transfer all the methods from the projection

  // copy the 4 things over we calculated in deriveConstants.sphere
  this.a = sphere_.a;
  this.b = sphere_.b;
  this.rf = sphere_.rf;
  this.sphere = sphere_.sphere;

  // copy the 3 things we calculated in deriveConstants.eccentricity
  this.es = ecc.es;
  this.e = ecc.e;
  this.ep2 = ecc.ep2;

  // add in the datum object
  this.datum = datumObj;

  // init the projection
  if ('init' in this && typeof this.init === 'function') {
    this.init();
  }

  // legecy callback from back in the day when it went to spatialreference.org
  callback(null, this);
}
Projection.projections = _projections__WEBPACK_IMPORTED_MODULE_2__["default"];
Projection.projections.start();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Projection);


/***/ }),

/***/ "./node_modules/proj4/lib/adjust_axis.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/adjust_axis.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(crs, denorm, point) {
  var xin = point.x,
    yin = point.y,
    zin = point.z || 0.0;
  var v, t, i;
  /** @type {import("./core").InterfaceCoordinates} */
  var out = {};
  for (i = 0; i < 3; i++) {
    if (denorm && i === 2 && point.z === undefined) {
      continue;
    }
    if (i === 0) {
      v = xin;
      if ('ew'.indexOf(crs.axis[i]) !== -1) {
        t = 'x';
      } else {
        t = 'y';
      }
    } else if (i === 1) {
      v = yin;
      if ('ns'.indexOf(crs.axis[i]) !== -1) {
        t = 'y';
      } else {
        t = 'x';
      }
    } else {
      v = zin;
      t = 'z';
    }
    switch (crs.axis[i]) {
      case 'e':
        out[t] = v;
        break;
      case 'w':
        out[t] = -v;
        break;
      case 'n':
        out[t] = v;
        break;
      case 's':
        out[t] = -v;
        break;
      case 'u':
        if (point[t] !== undefined) {
          out.z = v;
        }
        break;
      case 'd':
        if (point[t] !== undefined) {
          out.z = -v;
        }
        break;
      default:
      // console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
        return null;
    }
  }
  return out;
}


/***/ }),

/***/ "./node_modules/proj4/lib/checkSanity.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/checkSanity.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(point) {
  checkCoord(point.x);
  checkCoord(point.y);
}
function checkCoord(num) {
  if (typeof Number.isFinite === 'function') {
    if (Number.isFinite(num)) {
      return;
    }
    throw new TypeError('coordinates must be finite numbers');
  }
  if (typeof num !== 'number' || num !== num || !isFinite(num)) {
    throw new TypeError('coordinates must be finite numbers');
  }
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/adjust_lat.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/common/adjust_lat.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _sign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sign */ "./node_modules/proj4/lib/common/sign.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return (Math.abs(x) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI) ? x : (x - ((0,_sign__WEBPACK_IMPORTED_MODULE_1__["default"])(x) * Math.PI));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/adjust_lon.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/common/adjust_lon.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _sign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sign */ "./node_modules/proj4/lib/common/sign.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x, skipAdjust) {
  if (skipAdjust) {
    return x;
  }
  return (Math.abs(x) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI) ? x : (x - ((0,_sign__WEBPACK_IMPORTED_MODULE_1__["default"])(x) * _constants_values__WEBPACK_IMPORTED_MODULE_0__.TWO_PI));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/adjust_zone.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/common/adjust_zone.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(zone, lon) {
  if (zone === undefined) {
    zone = Math.floor(((0,_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon) + Math.PI) * 30 / Math.PI) + 1;

    if (zone < 0) {
      return 0;
    } else if (zone > 60) {
      return 60;
    }
  }
  return zone;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/asinhy.js":
/*!*************************************************!*\
  !*** ./node_modules/proj4/lib/common/asinhy.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hypot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hypot */ "./node_modules/proj4/lib/common/hypot.js");
/* harmony import */ var _log1py__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log1py */ "./node_modules/proj4/lib/common/log1py.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  var y = Math.abs(x);
  y = (0,_log1py__WEBPACK_IMPORTED_MODULE_1__["default"])(y * (1 + y / ((0,_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(1, y) + 1)));

  return x < 0 ? -y : y;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/asinz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/asinz.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  if (Math.abs(x) > 1) {
    x = (x > 1) ? 1 : -1;
  }
  return Math.asin(x);
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/clens.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/clens.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(pp, arg_r) {
  var r = 2 * Math.cos(arg_r);
  var i = pp.length - 1;
  var hr1 = pp[i];
  var hr2 = 0;
  var hr;

  while (--i >= 0) {
    hr = -hr2 + r * hr1 + pp[i];
    hr2 = hr1;
    hr1 = hr;
  }

  return Math.sin(arg_r) * hr;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/clens_cmplx.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/common/clens_cmplx.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sinh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sinh */ "./node_modules/proj4/lib/common/sinh.js");
/* harmony import */ var _cosh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cosh */ "./node_modules/proj4/lib/common/cosh.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(pp, arg_r, arg_i) {
  var sin_arg_r = Math.sin(arg_r);
  var cos_arg_r = Math.cos(arg_r);
  var sinh_arg_i = (0,_sinh__WEBPACK_IMPORTED_MODULE_0__["default"])(arg_i);
  var cosh_arg_i = (0,_cosh__WEBPACK_IMPORTED_MODULE_1__["default"])(arg_i);
  var r = 2 * cos_arg_r * cosh_arg_i;
  var i = -2 * sin_arg_r * sinh_arg_i;
  var j = pp.length - 1;
  var hr = pp[j];
  var hi1 = 0;
  var hr1 = 0;
  var hi = 0;
  var hr2;
  var hi2;

  while (--j >= 0) {
    hr2 = hr1;
    hi2 = hi1;
    hr1 = hr;
    hi1 = hi;
    hr = -hr2 + r * hr1 - i * hi1 + pp[j];
    hi = -hi2 + i * hr1 + r * hi1;
  }

  r = sin_arg_r * cosh_arg_i;
  i = cos_arg_r * sinh_arg_i;

  return [r * hr - i * hi, r * hi + i * hr];
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/cosh.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/cosh.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  var r = Math.exp(x);
  r = (r + 1 / r) / 2;
  return r;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/e0fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e0fn.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return (1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x)));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/e1fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e1fn.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return (0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x)));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/e2fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e2fn.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return (0.05859375 * x * x * (1 + 0.75 * x));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/e3fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e3fn.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return (x * x * x * (35 / 3072));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/gN.js":
/*!*********************************************!*\
  !*** ./node_modules/proj4/lib/common/gN.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, e, sinphi) {
  var temp = e * sinphi;
  return a / Math.sqrt(1 - temp * temp);
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/gatg.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/gatg.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(pp, B) {
  var cos_2B = 2 * Math.cos(2 * B);
  var i = pp.length - 1;
  var h1 = pp[i];
  var h2 = 0;
  var h;

  while (--i >= 0) {
    h = -h2 + cos_2B * h1 + pp[i];
    h2 = h1;
    h1 = h;
  }

  return (B + h * Math.sin(2 * B));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/hypot.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/hypot.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  var a = Math.max(x, y);
  var b = Math.min(x, y) / (a ? a : 1);

  return a * Math.sqrt(1 + Math.pow(b, 2));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/imlfn.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/imlfn.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(ml, e0, e1, e2, e3) {
  var phi;
  var dphi;

  phi = ml / e0;
  for (var i = 0; i < 15; i++) {
    dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }

  // ..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");
  return NaN;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/iqsfnz.js":
/*!*************************************************!*\
  !*** ./node_modules/proj4/lib/common/iqsfnz.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(eccent, q) {
  var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));
  if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
    if (q < 0) {
      return (-1 * _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI);
    } else {
      return _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    }
  }
  // var phi = 0.5* q/(1-eccent*eccent);
  var phi = Math.asin(0.5 * q);
  var dphi;
  var sin_phi;
  var cos_phi;
  var con;
  for (var i = 0; i < 30; i++) {
    sin_phi = Math.sin(phi);
    cos_phi = Math.cos(phi);
    con = eccent * sin_phi;
    dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }

  // console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");
  return NaN;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/log1py.js":
/*!*************************************************!*\
  !*** ./node_modules/proj4/lib/common/log1py.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  var y = 1 + x;
  var z = y - 1;

  return z === 0 ? x : x * Math.log(y) / z;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/mlfn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/mlfn.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(e0, e1, e2, e3, phi) {
  return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/msfnz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/msfnz.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(eccent, sinphi, cosphi) {
  var con = eccent * sinphi;
  return cosphi / (Math.sqrt(1 - con * con));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/phi2z.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/phi2z.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(eccent, ts) {
  var eccnth = 0.5 * eccent;
  var con, dphi;
  var phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - 2 * Math.atan(ts);
  for (var i = 0; i <= 15; i++) {
    con = eccent * Math.sin(phi);
    dphi = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - 2 * Math.atan(ts * (Math.pow(((1 - con) / (1 + con)), eccnth))) - phi;
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }
  // console.log("phi2z has NoConvergence");
  return -9999;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/pj_enfn.js":
/*!**************************************************!*\
  !*** ./node_modules/proj4/lib/common/pj_enfn.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var C00 = 1;
var C02 = 0.25;
var C04 = 0.046875;
var C06 = 0.01953125;
var C08 = 0.01068115234375;
var C22 = 0.75;
var C44 = 0.46875;
var C46 = 0.01302083333333333333;
var C48 = 0.00712076822916666666;
var C66 = 0.36458333333333333333;
var C68 = 0.00569661458333333333;
var C88 = 0.3076171875;

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(es) {
  var en = [];
  en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
  en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
  var t = es * es;
  en[2] = t * (C44 - es * (C46 + es * C48));
  t *= es;
  en[3] = t * (C66 - es * C68);
  en[4] = t * es * C88;
  return en;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/pj_inv_mlfn.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/common/pj_inv_mlfn.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pj_mlfn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pj_mlfn */ "./node_modules/proj4/lib/common/pj_mlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");



var MAX_ITER = 20;

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(arg, es, en) {
  var k = 1 / (1 - es);
  var phi = arg;
  for (var i = MAX_ITER; i; --i) { /* rarely goes over 2 iterations */
    var s = Math.sin(phi);
    var t = 1 - es * s * s;
    // t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
    // phi -= t * (t * Math.sqrt(t)) * k;
    t = ((0,_pj_mlfn__WEBPACK_IMPORTED_MODULE_0__["default"])(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
    phi -= t;
    if (Math.abs(t) < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      return phi;
    }
  }
  // ..reportError("cass:pj_inv_mlfn: Convergence error");
  return phi;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/pj_mlfn.js":
/*!**************************************************!*\
  !*** ./node_modules/proj4/lib/common/pj_mlfn.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(phi, sphi, cphi, en) {
  cphi *= sphi;
  sphi *= sphi;
  return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/qsfnz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/qsfnz.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(eccent, sinphi) {
  var con;
  if (eccent > 1.0e-7) {
    con = eccent * sinphi;
    return ((1 - eccent * eccent) * (sinphi / (1 - con * con) - (0.5 / eccent) * Math.log((1 - con) / (1 + con))));
  } else {
    return (2 * sinphi);
  }
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/sign.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/sign.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return x < 0 ? -1 : 1;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/sinh.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/sinh.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  var r = Math.exp(x);
  r = (r - 1 / r) / 2;
  return r;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/srat.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/srat.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(esinp, exp) {
  return (Math.pow((1 - esinp) / (1 + esinp), exp));
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/toPoint.js":
/*!**************************************************!*\
  !*** ./node_modules/proj4/lib/common/toPoint.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @param {Array<number>} array
 * @returns {import("../core").InterfaceCoordinates}
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(array) {
  var out = {
    x: array[0],
    y: array[1]
  };
  if (array.length > 2) {
    out.z = array[2];
  }
  if (array.length > 3) {
    out.m = array[3];
  }
  return out;
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/tsfnz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/tsfnz.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(eccent, phi, sinphi) {
  var con = eccent * sinphi;
  var com = 0.5 * eccent;
  con = Math.pow(((1 - con) / (1 + con)), com);
  return (Math.tan(0.5 * (_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - phi)) / con);
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/vincenty.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/common/vincenty.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   vincentyDirect: () => (/* binding */ vincentyDirect),
/* harmony export */   vincentyInverse: () => (/* binding */ vincentyInverse)
/* harmony export */ });
/**
 * Calculates the inverse geodesic problem using Vincenty's formulae.
 * Computes the forward azimuth and ellipsoidal distance between two points
 * specified by latitude and longitude on the surface of an ellipsoid.
 *
 * @param {number} lat1 Latitude of the first point in radians.
 * @param {number} lon1 Longitude of the first point in radians.
 * @param {number} lat2 Latitude of the second point in radians.
 * @param {number} lon2 Longitude of the second point in radians.
 * @param {number} a Semi-major axis of the ellipsoid (meters).
 * @param {number} f Flattening of the ellipsoid.
 * @returns {{ azi1: number, s12: number }} An object containing:
 *   - azi1: Forward azimuth from the first point to the second point (radians).
 *   - s12: Ellipsoidal distance between the two points (meters).
 */
function vincentyInverse(lat1, lon1, lat2, lon2, a, f) {
  const L = lon2 - lon1;
  const U1 = Math.atan((1 - f) * Math.tan(lat1));
  const U2 = Math.atan((1 - f) * Math.tan(lat2));
  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  let lambda = L, lambdaP, iterLimit = 100;
  let sinLambda, cosLambda, sinSigma, cosSigma, sigma, sinAlpha, cos2Alpha, cos2SigmaM, C;
  let uSq, A, B, deltaSigma, s;

  do {
    sinLambda = Math.sin(lambda);
    cosLambda = Math.cos(lambda);
    sinSigma = Math.sqrt(
      (cosU2 * sinLambda) * (cosU2 * sinLambda)
      + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
      * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
    );
    if (sinSigma === 0) {
      return { azi1: 0, s12: 0 }; // coincident points
    }
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
    cos2Alpha = 1 - sinAlpha * sinAlpha;
    cos2SigmaM = (cos2Alpha !== 0) ? (cosSigma - 2 * sinU1 * sinU2 / cos2Alpha) : 0;
    C = f / 16 * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
    lambdaP = lambda;
    lambda = L + (1 - C) * f * sinAlpha
    * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) {
    return { azi1: NaN, s12: NaN }; // formula failed to converge
  }

  uSq = cos2Alpha * (a * a - (a * (1 - f)) * (a * (1 - f))) / ((a * (1 - f)) * (a * (1 - f)));
  A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)
    - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));

  s = (a * (1 - f)) * A * (sigma - deltaSigma);

  // Forward azimuth
  const azi1 = Math.atan2(cosU2 * sinLambda, cosU1 * sinU2 - sinU1 * cosU2 * cosLambda);

  return { azi1, s12: s };
}

/**
 * Solves the direct geodetic problem using Vincenty's formulae.
 * Given a starting point, initial azimuth, and distance, computes the destination point on the ellipsoid.
 *
 * @param {number} lat1 Latitude of the starting point in radians.
 * @param {number} lon1 Longitude of the starting point in radians.
 * @param {number} azi1 Initial azimuth (forward azimuth) in radians.
 * @param {number} s12 Distance to travel from the starting point in meters.
 * @param {number} a Semi-major axis of the ellipsoid in meters.
 * @param {number} f Flattening of the ellipsoid.
 * @returns {{lat2: number, lon2: number}} The latitude and longitude (in radians) of the destination point.
 */
function vincentyDirect(lat1, lon1, azi1, s12, a, f) {
  const U1 = Math.atan((1 - f) * Math.tan(lat1));
  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinAlpha1 = Math.sin(azi1), cosAlpha1 = Math.cos(azi1);

  const sigma1 = Math.atan2(sinU1, cosU1 * cosAlpha1);
  const sinAlpha = cosU1 * sinAlpha1;
  const cos2Alpha = 1 - sinAlpha * sinAlpha;
  const uSq = cos2Alpha * (a * a - (a * (1 - f)) * (a * (1 - f))) / ((a * (1 - f)) * (a * (1 - f)));
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

  let sigma = s12 / ((a * (1 - f)) * A), sigmaP, iterLimit = 100;
  let cos2SigmaM, sinSigma, cosSigma, deltaSigma;

  do {
    cos2SigmaM = Math.cos(2 * sigma1 + sigma);
    sinSigma = Math.sin(sigma);
    cosSigma = Math.cos(sigma);
    deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)
      - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    sigmaP = sigma;
    sigma = s12 / ((a * (1 - f)) * A) + deltaSigma;
  } while (Math.abs(sigma - sigmaP) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) {
    return { lat2: NaN, lon2: NaN };
  }

  const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
  const lat2 = Math.atan2(
    sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
    (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
  );
  const lambda = Math.atan2(
    sinSigma * sinAlpha1,
    cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
  );
  const C = f / 16 * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
  const L = lambda - (1 - C) * f * sinAlpha
    * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  const lon2 = lon1 + L;

  return { lat2, lon2 };
}


/***/ }),

/***/ "./node_modules/proj4/lib/constants/Datum.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/constants/Datum.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var datums = {
  wgs84: {
    towgs84: '0,0,0',
    ellipse: 'WGS84',
    datumName: 'WGS84'
  },
  ch1903: {
    towgs84: '674.374,15.056,405.346',
    ellipse: 'bessel',
    datumName: 'swiss'
  },
  ggrs87: {
    towgs84: '-199.87,74.79,246.62',
    ellipse: 'GRS80',
    datumName: 'Greek_Geodetic_Reference_System_1987'
  },
  nad83: {
    towgs84: '0,0,0',
    ellipse: 'GRS80',
    datumName: 'North_American_Datum_1983'
  },
  nad27: {
    nadgrids: '@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat',
    ellipse: 'clrk66',
    datumName: 'North_American_Datum_1927'
  },
  potsdam: {
    towgs84: '598.1,73.7,418.2,0.202,0.045,-2.455,6.7',
    ellipse: 'bessel',
    datumName: 'Potsdam Rauenberg 1950 DHDN'
  },
  carthage: {
    towgs84: '-263.0,6.0,431.0',
    ellipse: 'clark80',
    datumName: 'Carthage 1934 Tunisia'
  },
  hermannskogel: {
    towgs84: '577.326,90.129,463.919,5.137,1.474,5.297,2.4232',
    ellipse: 'bessel',
    datumName: 'Hermannskogel'
  },
  mgi: {
    towgs84: '577.326,90.129,463.919,5.137,1.474,5.297,2.4232',
    ellipse: 'bessel',
    datumName: 'Militar-Geographische Institut'
  },
  osni52: {
    towgs84: '482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15',
    ellipse: 'airy',
    datumName: 'Irish National'
  },
  ire65: {
    towgs84: '482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15',
    ellipse: 'mod_airy',
    datumName: 'Ireland 1965'
  },
  rassadiran: {
    towgs84: '-133.63,-157.5,-158.62',
    ellipse: 'intl',
    datumName: 'Rassadiran'
  },
  nzgd49: {
    towgs84: '59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993',
    ellipse: 'intl',
    datumName: 'New Zealand Geodetic Datum 1949'
  },
  osgb36: {
    towgs84: '446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894',
    ellipse: 'airy',
    datumName: 'Ordnance Survey of Great Britain 1936'
  },
  s_jtsk: {
    towgs84: '589,76,480',
    ellipse: 'bessel',
    datumName: 'S-JTSK (Ferro)'
  },
  beduaram: {
    towgs84: '-106,-87,188',
    ellipse: 'clrk80',
    datumName: 'Beduaram'
  },
  gunung_segara: {
    towgs84: '-403,684,41',
    ellipse: 'bessel',
    datumName: 'Gunung Segara Jakarta'
  },
  rnb72: {
    towgs84: '106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1',
    ellipse: 'intl',
    datumName: 'Reseau National Belge 1972'
  },
  EPSG_5451: {
    towgs84: '6.41,-49.05,-11.28,1.5657,0.5242,6.9718,-5.7649'
  },
  IGNF_LURESG: {
    towgs84: '-192.986,13.673,-39.309,-0.4099,-2.9332,2.6881,0.43'
  },
  EPSG_4614: {
    towgs84: '-119.4248,-303.65872,-11.00061,1.164298,0.174458,1.096259,3.657065'
  },
  EPSG_4615: {
    towgs84: '-494.088,-312.129,279.877,-1.423,-1.013,1.59,-0.748'
  },
  ESRI_37241: {
    towgs84: '-76.822,257.457,-12.817,2.136,-0.033,-2.392,-0.031'
  },
  ESRI_37249: {
    towgs84: '-440.296,58.548,296.265,1.128,10.202,4.559,-0.438'
  },
  ESRI_37245: {
    towgs84: '-511.151,-181.269,139.609,1.05,2.703,1.798,3.071'
  },
  EPSG_4178: {
    towgs84: '24.9,-126.4,-93.2,-0.063,-0.247,-0.041,1.01'
  },
  EPSG_4622: {
    towgs84: '-472.29,-5.63,-304.12,0.4362,-0.8374,0.2563,1.8984'
  },
  EPSG_4625: {
    towgs84: '126.93,547.94,130.41,-2.7867,5.1612,-0.8584,13.8227'
  },
  EPSG_5252: {
    towgs84: '0.023,0.036,-0.068,0.00176,0.00912,-0.01136,0.00439'
  },
  EPSG_4314: {
    towgs84: '597.1,71.4,412.1,0.894,0.068,-1.563,7.58'
  },
  EPSG_4282: {
    towgs84: '-178.3,-316.7,-131.5,5.278,6.077,10.979,19.166'
  },
  EPSG_4231: {
    towgs84: '-83.11,-97.38,-117.22,0.0276,-0.2167,0.2147,0.1218'
  },
  EPSG_4274: {
    towgs84: '-230.994,102.591,25.199,0.633,-0.239,0.9,1.95'
  },
  EPSG_4134: {
    towgs84: '-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.71006'
  },
  EPSG_4254: {
    towgs84: '18.38,192.45,96.82,0.056,-0.142,-0.2,-0.0013'
  },
  EPSG_4159: {
    towgs84: '-194.513,-63.978,-25.759,-3.4027,3.756,-3.352,-0.9175'
  },
  EPSG_4687: {
    towgs84: '0.072,-0.507,-0.245,0.0183,-0.0003,0.007,-0.0093'
  },
  EPSG_4227: {
    towgs84: '-83.58,-397.54,458.78,-17.595,-2.847,4.256,3.225'
  },
  EPSG_4746: {
    towgs84: '599.4,72.4,419.2,-0.062,-0.022,-2.723,6.46'
  },
  EPSG_4745: {
    towgs84: '612.4,77,440.2,-0.054,0.057,-2.797,2.55'
  },
  EPSG_6311: {
    towgs84: '8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926'
  },
  EPSG_4289: {
    towgs84: '565.7381,50.4018,465.2904,-1.91514,1.60363,-9.09546,4.07244'
  },
  EPSG_4230: {
    towgs84: '-68.863,-134.888,-111.49,-0.53,-0.14,0.57,-3.4'
  },
  EPSG_4154: {
    towgs84: '-123.02,-158.95,-168.47'
  },
  EPSG_4156: {
    towgs84: '570.8,85.7,462.8,4.998,1.587,5.261,3.56'
  },
  EPSG_4299: {
    towgs84: '482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15'
  },
  EPSG_4179: {
    towgs84: '33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84'
  },
  EPSG_4313: {
    towgs84: '-106.8686,52.2978,-103.7239,0.3366,-0.457,1.8422,-1.2747'
  },
  EPSG_4194: {
    towgs84: '163.511,127.533,-159.789'
  },
  EPSG_4195: {
    towgs84: '105,326,-102.5'
  },
  EPSG_4196: {
    towgs84: '-45,417,-3.5'
  },
  EPSG_4611: {
    towgs84: '-162.619,-276.959,-161.764,0.067753,-2.243649,-1.158827,-1.094246'
  },
  EPSG_4633: {
    towgs84: '137.092,131.66,91.475,-1.9436,-11.5993,-4.3321,-7.4824'
  },
  EPSG_4641: {
    towgs84: '-408.809,366.856,-412.987,1.8842,-0.5308,2.1655,-121.0993'
  },
  EPSG_4643: {
    towgs84: '-480.26,-438.32,-643.429,16.3119,20.1721,-4.0349,-111.7002'
  },
  EPSG_4300: {
    towgs84: '482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15'
  },
  EPSG_4188: {
    towgs84: '482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15'
  },
  EPSG_4660: {
    towgs84: '982.6087,552.753,-540.873,32.39344,-153.25684,-96.2266,16.805'
  },
  EPSG_4662: {
    towgs84: '97.295,-263.247,310.882,-1.5999,0.8386,3.1409,13.3259'
  },
  EPSG_3906: {
    towgs84: '577.88891,165.22205,391.18289,4.9145,-0.94729,-13.05098,7.78664'
  },
  EPSG_4307: {
    towgs84: '-209.3622,-87.8162,404.6198,0.0046,3.4784,0.5805,-1.4547'
  },
  EPSG_6892: {
    towgs84: '-76.269,-16.683,68.562,-6.275,10.536,-4.286,-13.686'
  },
  EPSG_4690: {
    towgs84: '221.597,152.441,176.523,2.403,1.3893,0.884,11.4648'
  },
  EPSG_4691: {
    towgs84: '218.769,150.75,176.75,3.5231,2.0037,1.288,10.9817'
  },
  EPSG_4629: {
    towgs84: '72.51,345.411,79.241,-1.5862,-0.8826,-0.5495,1.3653'
  },
  EPSG_4630: {
    towgs84: '165.804,216.213,180.26,-0.6251,-0.4515,-0.0721,7.4111'
  },
  EPSG_4692: {
    towgs84: '217.109,86.452,23.711,0.0183,-0.0003,0.007,-0.0093'
  },
  EPSG_9333: {
    towgs84: '0,0,0,-8.393,0.749,-10.276,0'
  },
  EPSG_9059: {
    towgs84: '0,0,0'
  },
  EPSG_4312: {
    towgs84: '601.705,84.263,485.227,4.7354,1.3145,5.393,-2.3887'
  },
  EPSG_4123: {
    towgs84: '-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496'
  },
  EPSG_4309: {
    towgs84: '-124.45,183.74,44.64,-0.4384,0.5446,-0.9706,-2.1365'
  },
  ESRI_104106: {
    towgs84: '-283.088,-70.693,117.445,-1.157,0.059,-0.652,-4.058'
  },
  EPSG_4281: {
    towgs84: '-219.247,-73.802,269.529'
  },
  EPSG_4322: {
    towgs84: '0,0,4.5'
  },
  EPSG_4324: {
    towgs84: '0,0,1.9'
  },
  EPSG_4284: {
    towgs84: '43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549'
  },
  EPSG_4277: {
    towgs84: '446.448,-125.157,542.06,0.15,0.247,0.842,-20.489'
  },
  EPSG_4207: {
    towgs84: '-282.1,-72.2,120,-1.529,0.145,-0.89,-4.46'
  },
  EPSG_4688: {
    towgs84: '347.175,1077.618,2623.677,33.9058,-70.6776,9.4013,186.0647'
  },
  EPSG_4689: {
    towgs84: '410.793,54.542,80.501,-2.5596,-2.3517,-0.6594,17.3218'
  },
  EPSG_4720: {
    towgs84: '0,0,4.5'
  },
  EPSG_4273: {
    towgs84: '278.3,93,474.5,7.889,0.05,-6.61,6.21'
  },
  EPSG_4240: {
    towgs84: '204.64,834.74,293.8'
  },
  EPSG_4817: {
    towgs84: '278.3,93,474.5,7.889,0.05,-6.61,6.21'
  },
  ESRI_104131: {
    towgs84: '426.62,142.62,460.09,4.98,4.49,-12.42,-17.1'
  },
  EPSG_4265: {
    towgs84: '-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68'
  },
  EPSG_4263: {
    towgs84: '-111.92,-87.85,114.5,1.875,0.202,0.219,0.032'
  },
  EPSG_4298: {
    towgs84: '-689.5937,623.84046,-65.93566,-0.02331,1.17094,-0.80054,5.88536'
  },
  EPSG_4270: {
    towgs84: '-253.4392,-148.452,386.5267,0.15605,0.43,-0.1013,-0.0424'
  },
  EPSG_4229: {
    towgs84: '-121.8,98.1,-10.7'
  },
  EPSG_4220: {
    towgs84: '-55.5,-348,-229.2'
  },
  EPSG_4214: {
    towgs84: '12.646,-155.176,-80.863'
  },
  EPSG_4232: {
    towgs84: '-345,3,223'
  },
  EPSG_4238: {
    towgs84: '-1.977,-13.06,-9.993,0.364,0.254,0.689,-1.037'
  },
  EPSG_4168: {
    towgs84: '-170,33,326'
  },
  EPSG_4131: {
    towgs84: '199,931,318.9'
  },
  EPSG_4152: {
    towgs84: '-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0'
  },
  EPSG_5228: {
    towgs84: '572.213,85.334,461.94,4.9732,1.529,5.2484,3.5378'
  },
  EPSG_8351: {
    towgs84: '485.021,169.465,483.839,7.786342,4.397554,4.102655,0'
  },
  EPSG_4683: {
    towgs84: '-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06'
  },
  EPSG_4133: {
    towgs84: '0,0,0'
  },
  EPSG_7373: {
    towgs84: '0.819,-0.5762,-1.6446,-0.00378,-0.03317,0.00318,0.0693'
  },
  EPSG_9075: {
    towgs84: '-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0'
  },
  EPSG_9072: {
    towgs84: '-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0'
  },
  EPSG_9294: {
    towgs84: '1.16835,-1.42001,-2.24431,-0.00822,-0.05508,0.01818,0.23388'
  },
  EPSG_4212: {
    towgs84: '-267.434,173.496,181.814,-13.4704,8.7154,7.3926,14.7492'
  },
  EPSG_4191: {
    towgs84: '-44.183,-0.58,-38.489,2.3867,2.7072,-3.5196,-8.2703'
  },
  EPSG_4237: {
    towgs84: '52.684,-71.194,-13.975,-0.312,-0.1063,-0.3729,1.0191'
  },
  EPSG_4740: {
    towgs84: '-1.08,-0.27,-0.9'
  },
  EPSG_4124: {
    towgs84: '419.3836,99.3335,591.3451,0.850389,1.817277,-7.862238,-0.99496'
  },
  EPSG_5681: {
    towgs84: '584.9636,107.7175,413.8067,1.1155,0.2824,-3.1384,7.9922'
  },
  EPSG_4141: {
    towgs84: '23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262'
  },
  EPSG_4204: {
    towgs84: '-85.645,-273.077,-79.708,2.289,-1.421,2.532,3.194'
  },
  EPSG_4319: {
    towgs84: '226.702,-193.337,-35.371,-2.229,-4.391,9.238,0.9798'
  },
  EPSG_4200: {
    towgs84: '24.82,-131.21,-82.66'
  },
  EPSG_4130: {
    towgs84: '0,0,0'
  },
  EPSG_4127: {
    towgs84: '-82.875,-57.097,-156.768,-2.158,1.524,-0.982,-0.359'
  },
  EPSG_4149: {
    towgs84: '674.374,15.056,405.346'
  },
  EPSG_4617: {
    towgs84: '-0.991,1.9072,0.5129,1.25033e-7,4.6785e-8,5.6529e-8,0'
  },
  EPSG_4663: {
    towgs84: '-210.502,-66.902,-48.476,2.094,-15.067,-5.817,0.485'
  },
  EPSG_4664: {
    towgs84: '-211.939,137.626,58.3,-0.089,0.251,0.079,0.384'
  },
  EPSG_4665: {
    towgs84: '-105.854,165.589,-38.312,-0.003,-0.026,0.024,-0.048'
  },
  EPSG_4666: {
    towgs84: '631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43'
  },
  EPSG_4756: {
    towgs84: '-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188'
  },
  EPSG_4723: {
    towgs84: '-179.483,-69.379,-27.584,-7.862,8.163,6.042,-13.925'
  },
  EPSG_4726: {
    towgs84: '8.853,-52.644,180.304,-0.393,-2.323,2.96,-24.081'
  },
  EPSG_4267: {
    towgs84: '-8.0,160.0,176.0'
  },
  EPSG_5365: {
    towgs84: '-0.16959,0.35312,0.51846,0.03385,-0.16325,0.03446,0.03693'
  },
  EPSG_4218: {
    towgs84: '304.5,306.5,-318.1'
  },
  EPSG_4242: {
    towgs84: '-33.722,153.789,94.959,-8.581,-4.478,4.54,8.95'
  },
  EPSG_4216: {
    towgs84: '-292.295,248.758,429.447,4.9971,2.99,6.6906,1.0289'
  },
  ESRI_104105: {
    towgs84: '631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43'
  },
  ESRI_104129: {
    towgs84: '0,0,0'
  },
  EPSG_4673: {
    towgs84: '174.05,-25.49,112.57'
  },
  EPSG_4202: {
    towgs84: '-124,-60,154'
  },
  EPSG_4203: {
    towgs84: '-117.763,-51.51,139.061,0.292,0.443,0.277,-0.191'
  },
  EPSG_3819: {
    towgs84: '595.48,121.69,515.35,4.115,-2.9383,0.853,-3.408'
  },
  EPSG_8694: {
    towgs84: '-93.799,-132.737,-219.073,-1.844,0.648,-6.37,-0.169'
  },
  EPSG_4145: {
    towgs84: '275.57,676.78,229.6'
  },
  EPSG_4283: {
    towgs84: '61.55,-10.87,-40.19,39.4924,32.7221,32.8979,-9.994'
  },
  EPSG_4317: {
    towgs84: '2.3287,-147.0425,-92.0802,-0.3092483,0.32482185,0.49729934,5.68906266'
  },
  EPSG_4272: {
    towgs84: '59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993'
  },
  EPSG_4248: {
    towgs84: '-307.7,265.3,-363.5'
  },
  EPSG_5561: {
    towgs84: '24,-121,-76'
  },
  EPSG_5233: {
    towgs84: '-0.293,766.95,87.713,0.195704,1.695068,3.473016,-0.039338'
  },
  ESRI_104130: {
    towgs84: '-86,-98,-119'
  },
  ESRI_104102: {
    towgs84: '682,-203,480'
  },
  ESRI_37207: {
    towgs84: '7,-10,-26'
  },
  EPSG_4675: {
    towgs84: '59.935,118.4,-10.871'
  },
  ESRI_104109: {
    towgs84: '-89.121,-348.182,260.871'
  },
  ESRI_104112: {
    towgs84: '-185.583,-230.096,281.361'
  },
  ESRI_104113: {
    towgs84: '25.1,-275.6,222.6'
  },
  IGNF_WGS72G: {
    towgs84: '0,12,6'
  },
  IGNF_NTFG: {
    towgs84: '-168,-60,320'
  },
  IGNF_EFATE57G: {
    towgs84: '-127,-769,472'
  },
  IGNF_PGP50G: {
    towgs84: '324.8,153.6,172.1'
  },
  IGNF_REUN47G: {
    towgs84: '94,-948,-1262'
  },
  IGNF_CSG67G: {
    towgs84: '-186,230,110'
  },
  IGNF_GUAD48G: {
    towgs84: '-467,-16,-300'
  },
  IGNF_TAHI51G: {
    towgs84: '162,117,154'
  },
  IGNF_TAHAAG: {
    towgs84: '65,342,77'
  },
  IGNF_NUKU72G: {
    towgs84: '84,274,65'
  },
  IGNF_PETRELS72G: {
    towgs84: '365,194,166'
  },
  IGNF_WALL78G: {
    towgs84: '253,-133,-127'
  },
  IGNF_MAYO50G: {
    towgs84: '-382,-59,-262'
  },
  IGNF_TANNAG: {
    towgs84: '-139,-967,436'
  },
  IGNF_IGN72G: {
    towgs84: '-13,-348,292'
  },
  IGNF_ATIGG: {
    towgs84: '1118,23,66'
  },
  IGNF_FANGA84G: {
    towgs84: '150.57,158.33,118.32'
  },
  IGNF_RUSAT84G: {
    towgs84: '202.13,174.6,-15.74'
  },
  IGNF_KAUE70G: {
    towgs84: '126.74,300.1,-75.49'
  },
  IGNF_MOP90G: {
    towgs84: '-10.8,-1.8,12.77'
  },
  IGNF_MHPF67G: {
    towgs84: '338.08,212.58,-296.17'
  },
  IGNF_TAHI79G: {
    towgs84: '160.61,116.05,153.69'
  },
  IGNF_ANAA92G: {
    towgs84: '1.5,3.84,4.81'
  },
  IGNF_MARQUI72G: {
    towgs84: '330.91,-13.92,58.56'
  },
  IGNF_APAT86G: {
    towgs84: '143.6,197.82,74.05'
  },
  IGNF_TUBU69G: {
    towgs84: '237.17,171.61,-77.84'
  },
  IGNF_STPM50G: {
    towgs84: '11.363,424.148,373.13'
  },
  EPSG_4150: {
    towgs84: '674.374,15.056,405.346'
  },
  EPSG_4754: {
    towgs84: '-208.4058,-109.8777,-2.5764'
  },
  ESRI_104101: {
    towgs84: '374,150,588'
  },
  EPSG_4693: {
    towgs84: '0,-0.15,0.68'
  },
  EPSG_6207: {
    towgs84: '293.17,726.18,245.36'
  },
  EPSG_4153: {
    towgs84: '-133.63,-157.5,-158.62'
  },
  EPSG_4132: {
    towgs84: '-241.54,-163.64,396.06'
  },
  EPSG_4221: {
    towgs84: '-154.5,150.7,100.4'
  },
  EPSG_4266: {
    towgs84: '-80.7,-132.5,41.1'
  },
  EPSG_4193: {
    towgs84: '-70.9,-151.8,-41.4'
  },
  EPSG_5340: {
    towgs84: '-0.41,0.46,-0.35'
  },
  EPSG_4246: {
    towgs84: '-294.7,-200.1,525.5'
  },
  EPSG_4318: {
    towgs84: '-3.2,-5.7,2.8'
  },
  EPSG_4121: {
    towgs84: '-199.87,74.79,246.62'
  },
  EPSG_4223: {
    towgs84: '-260.1,5.5,432.2'
  },
  EPSG_4158: {
    towgs84: '-0.465,372.095,171.736'
  },
  EPSG_4285: {
    towgs84: '-128.16,-282.42,21.93'
  },
  EPSG_4613: {
    towgs84: '-404.78,685.68,45.47'
  },
  EPSG_4607: {
    towgs84: '195.671,332.517,274.607'
  },
  EPSG_4475: {
    towgs84: '-381.788,-57.501,-256.673'
  },
  EPSG_4208: {
    towgs84: '-157.84,308.54,-146.6'
  },
  EPSG_4743: {
    towgs84: '70.995,-335.916,262.898'
  },
  EPSG_4710: {
    towgs84: '-323.65,551.39,-491.22'
  },
  EPSG_7881: {
    towgs84: '-0.077,0.079,0.086'
  },
  EPSG_4682: {
    towgs84: '283.729,735.942,261.143'
  },
  EPSG_4739: {
    towgs84: '-156,-271,-189'
  },
  EPSG_4679: {
    towgs84: '-80.01,253.26,291.19'
  },
  EPSG_4750: {
    towgs84: '-56.263,16.136,-22.856'
  },
  EPSG_4644: {
    towgs84: '-10.18,-350.43,291.37'
  },
  EPSG_4695: {
    towgs84: '-103.746,-9.614,-255.95'
  },
  EPSG_4292: {
    towgs84: '-355,21,72'
  },
  EPSG_4302: {
    towgs84: '-61.702,284.488,472.052'
  },
  EPSG_4143: {
    towgs84: '-124.76,53,466.79'
  },
  EPSG_4606: {
    towgs84: '-153,153,307'
  },
  EPSG_4699: {
    towgs84: '-770.1,158.4,-498.2'
  },
  EPSG_4247: {
    towgs84: '-273.5,110.6,-357.9'
  },
  EPSG_4160: {
    towgs84: '8.88,184.86,106.69'
  },
  EPSG_4161: {
    towgs84: '-233.43,6.65,173.64'
  },
  EPSG_9251: {
    towgs84: '-9.5,122.9,138.2'
  },
  EPSG_9253: {
    towgs84: '-78.1,101.6,133.3'
  },
  EPSG_4297: {
    towgs84: '-198.383,-240.517,-107.909'
  },
  EPSG_4269: {
    towgs84: '0,0,0'
  },
  EPSG_4301: {
    towgs84: '-147,506,687'
  },
  EPSG_4618: {
    towgs84: '-59,-11,-52'
  },
  EPSG_4612: {
    towgs84: '0,0,0'
  },
  EPSG_4678: {
    towgs84: '44.585,-131.212,-39.544'
  },
  EPSG_4250: {
    towgs84: '-130,29,364'
  },
  EPSG_4144: {
    towgs84: '214,804,268'
  },
  EPSG_4147: {
    towgs84: '-17.51,-108.32,-62.39'
  },
  EPSG_4259: {
    towgs84: '-254.1,-5.36,-100.29'
  },
  EPSG_4164: {
    towgs84: '-76,-138,67'
  },
  EPSG_4211: {
    towgs84: '-378.873,676.002,-46.255'
  },
  EPSG_4182: {
    towgs84: '-422.651,-172.995,84.02'
  },
  EPSG_4224: {
    towgs84: '-143.87,243.37,-33.52'
  },
  EPSG_4225: {
    towgs84: '-205.57,168.77,-4.12'
  },
  EPSG_5527: {
    towgs84: '-67.35,3.88,-38.22'
  },
  EPSG_4752: {
    towgs84: '98,390,-22'
  },
  EPSG_4310: {
    towgs84: '-30,190,89'
  },
  EPSG_9248: {
    towgs84: '-192.26,65.72,132.08'
  },
  EPSG_4680: {
    towgs84: '124.5,-63.5,-281'
  },
  EPSG_4701: {
    towgs84: '-79.9,-158,-168.9'
  },
  EPSG_4706: {
    towgs84: '-146.21,112.63,4.05'
  },
  EPSG_4805: {
    towgs84: '682,-203,480'
  },
  EPSG_4201: {
    towgs84: '-165,-11,206'
  },
  EPSG_4210: {
    towgs84: '-157,-2,-299'
  },
  EPSG_4183: {
    towgs84: '-104,167,-38'
  },
  EPSG_4139: {
    towgs84: '11,72,-101'
  },
  EPSG_4668: {
    towgs84: '-86,-98,-119'
  },
  EPSG_4717: {
    towgs84: '-2,151,181'
  },
  EPSG_4732: {
    towgs84: '102,52,-38'
  },
  EPSG_4280: {
    towgs84: '-377,681,-50'
  },
  EPSG_4209: {
    towgs84: '-138,-105,-289'
  },
  EPSG_4261: {
    towgs84: '31,146,47'
  },
  EPSG_4658: {
    towgs84: '-73,46,-86'
  },
  EPSG_4721: {
    towgs84: '265.025,384.929,-194.046'
  },
  EPSG_4222: {
    towgs84: '-136,-108,-292'
  },
  EPSG_4601: {
    towgs84: '-255,-15,71'
  },
  EPSG_4602: {
    towgs84: '725,685,536'
  },
  EPSG_4603: {
    towgs84: '72,213.7,93'
  },
  EPSG_4605: {
    towgs84: '9,183,236'
  },
  EPSG_4621: {
    towgs84: '137,248,-430'
  },
  EPSG_4657: {
    towgs84: '-28,199,5'
  },
  EPSG_4316: {
    towgs84: '103.25,-100.4,-307.19'
  },
  EPSG_4642: {
    towgs84: '-13,-348,292'
  },
  EPSG_4698: {
    towgs84: '145,-187,103'
  },
  EPSG_4192: {
    towgs84: '-206.1,-174.7,-87.7'
  },
  EPSG_4311: {
    towgs84: '-265,120,-358'
  },
  EPSG_4135: {
    towgs84: '58,-283,-182'
  },
  ESRI_104138: {
    towgs84: '198,-226,-347'
  },
  EPSG_4245: {
    towgs84: '-11,851,5'
  },
  EPSG_4142: {
    towgs84: '-125,53,467'
  },
  EPSG_4213: {
    towgs84: '-106,-87,188'
  },
  EPSG_4253: {
    towgs84: '-133,-77,-51'
  },
  EPSG_4129: {
    towgs84: '-132,-110,-335'
  },
  EPSG_4713: {
    towgs84: '-77,-128,142'
  },
  EPSG_4239: {
    towgs84: '217,823,299'
  },
  EPSG_4146: {
    towgs84: '295,736,257'
  },
  EPSG_4155: {
    towgs84: '-83,37,124'
  },
  EPSG_4165: {
    towgs84: '-173,253,27'
  },
  EPSG_4672: {
    towgs84: '175,-38,113'
  },
  EPSG_4236: {
    towgs84: '-637,-549,-203'
  },
  EPSG_4251: {
    towgs84: '-90,40,88'
  },
  EPSG_4271: {
    towgs84: '-2,374,172'
  },
  EPSG_4175: {
    towgs84: '-88,4,101'
  },
  EPSG_4716: {
    towgs84: '298,-304,-375'
  },
  EPSG_4315: {
    towgs84: '-23,259,-9'
  },
  EPSG_4744: {
    towgs84: '-242.2,-144.9,370.3'
  },
  EPSG_4244: {
    towgs84: '-97,787,86'
  },
  EPSG_4293: {
    towgs84: '616,97,-251'
  },
  EPSG_4714: {
    towgs84: '-127,-769,472'
  },
  EPSG_4736: {
    towgs84: '260,12,-147'
  },
  EPSG_6883: {
    towgs84: '-235,-110,393'
  },
  EPSG_6894: {
    towgs84: '-63,176,185'
  },
  EPSG_4205: {
    towgs84: '-43,-163,45'
  },
  EPSG_4256: {
    towgs84: '41,-220,-134'
  },
  EPSG_4262: {
    towgs84: '639,405,60'
  },
  EPSG_4604: {
    towgs84: '174,359,365'
  },
  EPSG_4169: {
    towgs84: '-115,118,426'
  },
  EPSG_4620: {
    towgs84: '-106,-129,165'
  },
  EPSG_4184: {
    towgs84: '-203,141,53'
  },
  EPSG_4616: {
    towgs84: '-289,-124,60'
  },
  EPSG_9403: {
    towgs84: '-307,-92,127'
  },
  EPSG_4684: {
    towgs84: '-133,-321,50'
  },
  EPSG_4708: {
    towgs84: '-491,-22,435'
  },
  EPSG_4707: {
    towgs84: '114,-116,-333'
  },
  EPSG_4709: {
    towgs84: '145,75,-272'
  },
  EPSG_4712: {
    towgs84: '-205,107,53'
  },
  EPSG_4711: {
    towgs84: '124,-234,-25'
  },
  EPSG_4718: {
    towgs84: '230,-199,-752'
  },
  EPSG_4719: {
    towgs84: '211,147,111'
  },
  EPSG_4724: {
    towgs84: '208,-435,-229'
  },
  EPSG_4725: {
    towgs84: '189,-79,-202'
  },
  EPSG_4735: {
    towgs84: '647,1777,-1124'
  },
  EPSG_4722: {
    towgs84: '-794,119,-298'
  },
  EPSG_4728: {
    towgs84: '-307,-92,127'
  },
  EPSG_4734: {
    towgs84: '-632,438,-609'
  },
  EPSG_4727: {
    towgs84: '912,-58,1227'
  },
  EPSG_4729: {
    towgs84: '185,165,42'
  },
  EPSG_4730: {
    towgs84: '170,42,84'
  },
  EPSG_4733: {
    towgs84: '276,-57,149'
  },
  ESRI_37218: {
    towgs84: '230,-199,-752'
  },
  ESRI_37240: {
    towgs84: '-7,215,225'
  },
  ESRI_37221: {
    towgs84: '252,-209,-751'
  },
  ESRI_4305: {
    towgs84: '-123,-206,219'
  },
  ESRI_104139: {
    towgs84: '-73,-247,227'
  },
  EPSG_4748: {
    towgs84: '51,391,-36'
  },
  EPSG_4219: {
    towgs84: '-384,664,-48'
  },
  EPSG_4255: {
    towgs84: '-333,-222,114'
  },
  EPSG_4257: {
    towgs84: '-587.8,519.75,145.76'
  },
  EPSG_4646: {
    towgs84: '-963,510,-359'
  },
  EPSG_6881: {
    towgs84: '-24,-203,268'
  },
  EPSG_6882: {
    towgs84: '-183,-15,273'
  },
  EPSG_4715: {
    towgs84: '-104,-129,239'
  },
  IGNF_RGF93GDD: {
    towgs84: '0,0,0'
  },
  IGNF_RGM04GDD: {
    towgs84: '0,0,0'
  },
  IGNF_RGSPM06GDD: {
    towgs84: '0,0,0'
  },
  IGNF_RGTAAF07GDD: {
    towgs84: '0,0,0'
  },
  IGNF_RGFG95GDD: {
    towgs84: '0,0,0'
  },
  IGNF_RGNCG: {
    towgs84: '0,0,0'
  },
  IGNF_RGPFGDD: {
    towgs84: '0,0,0'
  },
  IGNF_ETRS89G: {
    towgs84: '0,0,0'
  },
  IGNF_RGR92GDD: {
    towgs84: '0,0,0'
  },
  EPSG_4173: {
    towgs84: '0,0,0'
  },
  EPSG_4180: {
    towgs84: '0,0,0'
  },
  EPSG_4619: {
    towgs84: '0,0,0'
  },
  EPSG_4667: {
    towgs84: '0,0,0'
  },
  EPSG_4075: {
    towgs84: '0,0,0'
  },
  EPSG_6706: {
    towgs84: '0,0,0'
  },
  EPSG_7798: {
    towgs84: '0,0,0'
  },
  EPSG_4661: {
    towgs84: '0,0,0'
  },
  EPSG_4669: {
    towgs84: '0,0,0'
  },
  EPSG_8685: {
    towgs84: '0,0,0'
  },
  EPSG_4151: {
    towgs84: '0,0,0'
  },
  EPSG_9702: {
    towgs84: '0,0,0'
  },
  EPSG_4758: {
    towgs84: '0,0,0'
  },
  EPSG_4761: {
    towgs84: '0,0,0'
  },
  EPSG_4765: {
    towgs84: '0,0,0'
  },
  EPSG_8997: {
    towgs84: '0,0,0'
  },
  EPSG_4023: {
    towgs84: '0,0,0'
  },
  EPSG_4670: {
    towgs84: '0,0,0'
  },
  EPSG_4694: {
    towgs84: '0,0,0'
  },
  EPSG_4148: {
    towgs84: '0,0,0'
  },
  EPSG_4163: {
    towgs84: '0,0,0'
  },
  EPSG_4167: {
    towgs84: '0,0,0'
  },
  EPSG_4189: {
    towgs84: '0,0,0'
  },
  EPSG_4190: {
    towgs84: '0,0,0'
  },
  EPSG_4176: {
    towgs84: '0,0,0'
  },
  EPSG_4659: {
    towgs84: '0,0,0'
  },
  EPSG_3824: {
    towgs84: '0,0,0'
  },
  EPSG_3889: {
    towgs84: '0,0,0'
  },
  EPSG_4046: {
    towgs84: '0,0,0'
  },
  EPSG_4081: {
    towgs84: '0,0,0'
  },
  EPSG_4558: {
    towgs84: '0,0,0'
  },
  EPSG_4483: {
    towgs84: '0,0,0'
  },
  EPSG_5013: {
    towgs84: '0,0,0'
  },
  EPSG_5264: {
    towgs84: '0,0,0'
  },
  EPSG_5324: {
    towgs84: '0,0,0'
  },
  EPSG_5354: {
    towgs84: '0,0,0'
  },
  EPSG_5371: {
    towgs84: '0,0,0'
  },
  EPSG_5373: {
    towgs84: '0,0,0'
  },
  EPSG_5381: {
    towgs84: '0,0,0'
  },
  EPSG_5393: {
    towgs84: '0,0,0'
  },
  EPSG_5489: {
    towgs84: '0,0,0'
  },
  EPSG_5593: {
    towgs84: '0,0,0'
  },
  EPSG_6135: {
    towgs84: '0,0,0'
  },
  EPSG_6365: {
    towgs84: '0,0,0'
  },
  EPSG_5246: {
    towgs84: '0,0,0'
  },
  EPSG_7886: {
    towgs84: '0,0,0'
  },
  EPSG_8431: {
    towgs84: '0,0,0'
  },
  EPSG_8427: {
    towgs84: '0,0,0'
  },
  EPSG_8699: {
    towgs84: '0,0,0'
  },
  EPSG_8818: {
    towgs84: '0,0,0'
  },
  EPSG_4757: {
    towgs84: '0,0,0'
  },
  EPSG_9140: {
    towgs84: '0,0,0'
  },
  EPSG_8086: {
    towgs84: '0,0,0'
  },
  EPSG_4686: {
    towgs84: '0,0,0'
  },
  EPSG_4737: {
    towgs84: '0,0,0'
  },
  EPSG_4702: {
    towgs84: '0,0,0'
  },
  EPSG_4747: {
    towgs84: '0,0,0'
  },
  EPSG_4749: {
    towgs84: '0,0,0'
  },
  EPSG_4674: {
    towgs84: '0,0,0'
  },
  EPSG_4755: {
    towgs84: '0,0,0'
  },
  EPSG_4759: {
    towgs84: '0,0,0'
  },
  EPSG_4762: {
    towgs84: '0,0,0'
  },
  EPSG_4763: {
    towgs84: '0,0,0'
  },
  EPSG_4764: {
    towgs84: '0,0,0'
  },
  EPSG_4166: {
    towgs84: '0,0,0'
  },
  EPSG_4170: {
    towgs84: '0,0,0'
  },
  EPSG_5546: {
    towgs84: '0,0,0'
  },
  EPSG_7844: {
    towgs84: '0,0,0'
  },
  EPSG_4818: {
    towgs84: '589,76,480'
  }
};

for (var key in datums) {
  var datum = datums[key];
  if (!datum.datumName) {
    continue;
  }
  datums[datum.datumName] = datum;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (datums);


/***/ }),

/***/ "./node_modules/proj4/lib/constants/Ellipsoid.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/constants/Ellipsoid.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ellipsoids = {
  MERIT: {
    a: 6378137,
    rf: 298.257,
    ellipseName: 'MERIT 1983'
  },
  SGS85: {
    a: 6378136,
    rf: 298.257,
    ellipseName: 'Soviet Geodetic System 85'
  },
  GRS80: {
    a: 6378137,
    rf: 298.257222101,
    ellipseName: 'GRS 1980(IUGG, 1980)'
  },
  IAU76: {
    a: 6378140,
    rf: 298.257,
    ellipseName: 'IAU 1976'
  },
  airy: {
    a: 6377563.396,
    b: 6356256.91,
    ellipseName: 'Airy 1830'
  },
  APL4: {
    a: 6378137,
    rf: 298.25,
    ellipseName: 'Appl. Physics. 1965'
  },
  NWL9D: {
    a: 6378145,
    rf: 298.25,
    ellipseName: 'Naval Weapons Lab., 1965'
  },
  mod_airy: {
    a: 6377340.189,
    b: 6356034.446,
    ellipseName: 'Modified Airy'
  },
  andrae: {
    a: 6377104.43,
    rf: 300,
    ellipseName: 'Andrae 1876 (Den., Iclnd.)'
  },
  aust_SA: {
    a: 6378160,
    rf: 298.25,
    ellipseName: 'Australian Natl & S. Amer. 1969'
  },
  GRS67: {
    a: 6378160,
    rf: 298.247167427,
    ellipseName: 'GRS 67(IUGG 1967)'
  },
  bessel: {
    a: 6377397.155,
    rf: 299.1528128,
    ellipseName: 'Bessel 1841'
  },
  bess_nam: {
    a: 6377483.865,
    rf: 299.1528128,
    ellipseName: 'Bessel 1841 (Namibia)'
  },
  clrk66: {
    a: 6378206.4,
    b: 6356583.8,
    ellipseName: 'Clarke 1866'
  },
  clrk80: {
    a: 6378249.145,
    rf: 293.4663,
    ellipseName: 'Clarke 1880 mod.'
  },
  clrk80ign: {
    a: 6378249.2,
    b: 6356515,
    rf: 293.4660213,
    ellipseName: 'Clarke 1880 (IGN)'
  },
  clrk58: {
    a: 6378293.645208759,
    rf: 294.2606763692654,
    ellipseName: 'Clarke 1858'
  },
  CPM: {
    a: 6375738.7,
    rf: 334.29,
    ellipseName: 'Comm. des Poids et Mesures 1799'
  },
  delmbr: {
    a: 6376428,
    rf: 311.5,
    ellipseName: 'Delambre 1810 (Belgium)'
  },
  engelis: {
    a: 6378136.05,
    rf: 298.2566,
    ellipseName: 'Engelis 1985'
  },
  evrst30: {
    a: 6377276.345,
    rf: 300.8017,
    ellipseName: 'Everest 1830'
  },
  evrst48: {
    a: 6377304.063,
    rf: 300.8017,
    ellipseName: 'Everest 1948'
  },
  evrst56: {
    a: 6377301.243,
    rf: 300.8017,
    ellipseName: 'Everest 1956'
  },
  evrst69: {
    a: 6377295.664,
    rf: 300.8017,
    ellipseName: 'Everest 1969'
  },
  evrstSS: {
    a: 6377298.556,
    rf: 300.8017,
    ellipseName: 'Everest (Sabah & Sarawak)'
  },
  fschr60: {
    a: 6378166,
    rf: 298.3,
    ellipseName: 'Fischer (Mercury Datum) 1960'
  },
  fschr60m: {
    a: 6378155,
    rf: 298.3,
    ellipseName: 'Fischer 1960'
  },
  fschr68: {
    a: 6378150,
    rf: 298.3,
    ellipseName: 'Fischer 1968'
  },
  helmert: {
    a: 6378200,
    rf: 298.3,
    ellipseName: 'Helmert 1906'
  },
  hough: {
    a: 6378270,
    rf: 297,
    ellipseName: 'Hough'
  },
  intl: {
    a: 6378388,
    rf: 297,
    ellipseName: 'International 1909 (Hayford)'
  },
  kaula: {
    a: 6378163,
    rf: 298.24,
    ellipseName: 'Kaula 1961'
  },
  lerch: {
    a: 6378139,
    rf: 298.257,
    ellipseName: 'Lerch 1979'
  },
  mprts: {
    a: 6397300,
    rf: 191,
    ellipseName: 'Maupertius 1738'
  },
  new_intl: {
    a: 6378157.5,
    b: 6356772.2,
    ellipseName: 'New International 1967'
  },
  plessis: {
    a: 6376523,
    rf: 6355863,
    ellipseName: 'Plessis 1817 (France)'
  },
  krass: {
    a: 6378245,
    rf: 298.3,
    ellipseName: 'Krassovsky, 1942'
  },
  SEasia: {
    a: 6378155,
    b: 6356773.3205,
    ellipseName: 'Southeast Asia'
  },
  walbeck: {
    a: 6376896,
    b: 6355834.8467,
    ellipseName: 'Walbeck'
  },
  WGS60: {
    a: 6378165,
    rf: 298.3,
    ellipseName: 'WGS 60'
  },
  WGS66: {
    a: 6378145,
    rf: 298.25,
    ellipseName: 'WGS 66'
  },
  WGS7: {
    a: 6378135,
    rf: 298.26,
    ellipseName: 'WGS 72'
  },
  WGS84: {
    a: 6378137,
    rf: 298.257223563,
    ellipseName: 'WGS 84'
  },
  sphere: {
    a: 6370997,
    b: 6370997,
    ellipseName: 'Normal Sphere (r=6370997)'
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ellipsoids);


/***/ }),

/***/ "./node_modules/proj4/lib/constants/PrimeMeridian.js":
/*!***********************************************************!*\
  !*** ./node_modules/proj4/lib/constants/PrimeMeridian.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var primeMeridian = {};

primeMeridian.greenwich = 0.0; // "0dE",
primeMeridian.lisbon = -9.131906111111; // "9d07'54.862\"W",
primeMeridian.paris = 2.337229166667; // "2d20'14.025\"E",
primeMeridian.bogota = -74.080916666667; // "74d04'51.3\"W",
primeMeridian.madrid = -3.687938888889; // "3d41'16.58\"W",
primeMeridian.rome = 12.452333333333; // "12d27'8.4\"E",
primeMeridian.bern = 7.439583333333; // "7d26'22.5\"E",
primeMeridian.jakarta = 106.807719444444; // "106d48'27.79\"E",
primeMeridian.ferro = -17.666666666667; // "17d40'W",
primeMeridian.brussels = 4.367975; // "4d22'4.71\"E",
primeMeridian.stockholm = 18.058277777778; // "18d3'29.8\"E",
primeMeridian.athens = 23.7163375; // "23d42'58.815\"E",
primeMeridian.oslo = 10.722916666667; // "10d43'22.5\"E"

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (primeMeridian);


/***/ }),

/***/ "./node_modules/proj4/lib/constants/units.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/constants/units.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mm: { to_meter: 0.001 },
  cm: { to_meter: 0.01 },
  ft: { to_meter: 0.3048 },
  'us-ft': { to_meter: 1200 / 3937 },
  fath: { to_meter: 1.8288 },
  kmi: { to_meter: 1852 },
  'us-ch': { to_meter: 20.1168402336805 },
  'us-mi': { to_meter: 1609.34721869444 },
  km: { to_meter: 1000 },
  'ind-ft': { to_meter: 0.30479841 },
  'ind-yd': { to_meter: 0.91439523 },
  mi: { to_meter: 1609.344 },
  yd: { to_meter: 0.9144 },
  ch: { to_meter: 20.1168 },
  link: { to_meter: 0.201168 },
  dm: { to_meter: 0.1 },
  in: { to_meter: 0.0254 },
  'ind-ch': { to_meter: 20.11669506 },
  'us-in': { to_meter: 0.025400050800101 },
  'us-yd': { to_meter: 0.914401828803658 }
});


/***/ }),

/***/ "./node_modules/proj4/lib/constants/values.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/constants/values.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D2R: () => (/* binding */ D2R),
/* harmony export */   EPSLN: () => (/* binding */ EPSLN),
/* harmony export */   FORTPI: () => (/* binding */ FORTPI),
/* harmony export */   HALF_PI: () => (/* binding */ HALF_PI),
/* harmony export */   PJD_3PARAM: () => (/* binding */ PJD_3PARAM),
/* harmony export */   PJD_7PARAM: () => (/* binding */ PJD_7PARAM),
/* harmony export */   PJD_GRIDSHIFT: () => (/* binding */ PJD_GRIDSHIFT),
/* harmony export */   PJD_NODATUM: () => (/* binding */ PJD_NODATUM),
/* harmony export */   PJD_WGS84: () => (/* binding */ PJD_WGS84),
/* harmony export */   R2D: () => (/* binding */ R2D),
/* harmony export */   RA4: () => (/* binding */ RA4),
/* harmony export */   RA6: () => (/* binding */ RA6),
/* harmony export */   SEC_TO_RAD: () => (/* binding */ SEC_TO_RAD),
/* harmony export */   SIXTH: () => (/* binding */ SIXTH),
/* harmony export */   SPI: () => (/* binding */ SPI),
/* harmony export */   SRS_WGS84_ESQUARED: () => (/* binding */ SRS_WGS84_ESQUARED),
/* harmony export */   SRS_WGS84_SEMIMAJOR: () => (/* binding */ SRS_WGS84_SEMIMAJOR),
/* harmony export */   SRS_WGS84_SEMIMINOR: () => (/* binding */ SRS_WGS84_SEMIMINOR),
/* harmony export */   TWO_PI: () => (/* binding */ TWO_PI)
/* harmony export */ });
var PJD_3PARAM = 1;
var PJD_7PARAM = 2;
var PJD_GRIDSHIFT = 3;
var PJD_WGS84 = 4; // WGS84 or equivalent
var PJD_NODATUM = 5; // WGS84 or equivalent
var SRS_WGS84_SEMIMAJOR = 6378137.0; // only used in grid shift transforms
var SRS_WGS84_SEMIMINOR = 6356752.314; // only used in grid shift transforms
var SRS_WGS84_ESQUARED = 0.0066943799901413165; // only used in grid shift transforms
var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
var HALF_PI = Math.PI / 2;
// ellipoid pj_set_ell.c
var SIXTH = 0.1666666666666666667;
/* 1/6 */
var RA4 = 0.04722222222222222222;
/* 17/360 */
var RA6 = 0.02215608465608465608;
var EPSLN = 1.0e-10;
// you'd think you could use Number.EPSILON above but that makes
// Mollweide get into an infinate loop.

var D2R = 0.01745329251994329577;
var R2D = 57.29577951308232088;
var FORTPI = Math.PI / 4;
var TWO_PI = Math.PI * 2;
// SPI is slightly greater than Math.PI, so values that exceed the -180..180
// degree range by a tiny amount don't get wrapped. This prevents points that
// have drifted from their original location along the 180th meridian (due to
// floating point error) from changing their sign.
var SPI = 3.14159265359;


/***/ }),

/***/ "./node_modules/proj4/lib/core.js":
/*!****************************************!*\
  !*** ./node_modules/proj4/lib/core.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Proj__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Proj */ "./node_modules/proj4/lib/Proj.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transform */ "./node_modules/proj4/lib/transform.js");


var wgs84 = (0,_Proj__WEBPACK_IMPORTED_MODULE_0__["default"])('WGS84');

/**
 * @typedef {{x: number, y: number, z?: number, m?: number}} InterfaceCoordinates
 */

/**
 * @typedef {Array<number> | InterfaceCoordinates} TemplateCoordinates
 */

/**
 * @typedef {Object} Converter
 * @property {<T extends TemplateCoordinates>(coordinates: T, enforceAxis?: boolean) => T} forward
 * @property {<T extends TemplateCoordinates>(coordinates: T, enforceAxis?: boolean) => T} inverse
 * @property {proj} [oProj]
 */

/**
 * @typedef {Object} PROJJSONDefinition
 * @property {string} [$schema]
 * @property {string} type
 * @property {string} [name]
 * @property {{authority: string, code: number}} [id]
 * @property {string} [scope]
 * @property {string} [area]
 * @property {{south_latitude: number, west_longitude: number, north_latitude: number, east_longitude: number}} [bbox]
 * @property {PROJJSONDefinition[]} [components]
 * @property {{type: string, name: string}} [datum]
 * @property {{
 *   name: string,
 *   members: Array<{
 *     name: string,
 *     id?: {authority: string, code: number}
 *   }>,
 *   ellipsoid?: {
 *     name: string,
 *     semi_major_axis: number,
 *     inverse_flattening?: number
 *   },
 *   accuracy?: string,
 *   id?: {authority: string, code: number}
 * }} [datum_ensemble]
 * @property {{
 *   subtype: string,
 *   axis: Array<{
 *     name: string,
 *     abbreviation?: string,
 *     direction: string,
 *     unit: string
 *   }>
 * }} [coordinate_system]
 * @property {{
 *   name: string,
 *   method: {name: string},
 *   parameters: Array<{
 *     name: string,
 *     value: number,
 *     unit?: string
 *   }>
 * }} [conversion]
 * @property {{
 *   name: string,
 *   method: {name: string},
 *   parameters: Array<{
 *     name: string,
 *     value: number,
 *     unit?: string,
 *     type?: string,
 *     file_name?: string
 *   }>
 * }} [transformation]
 */

/**
 * @template {TemplateCoordinates} T
 * @param {proj} from
 * @param {proj} to
 * @param {T} coords
 * @param {boolean} [enforceAxis]
 * @returns {T}
 */
function transformer(from, to, coords, enforceAxis) {
  var transformedArray, out, keys;
  if (Array.isArray(coords)) {
    transformedArray = (0,_transform__WEBPACK_IMPORTED_MODULE_1__["default"])(from, to, coords, enforceAxis) || { x: NaN, y: NaN };
    if (coords.length > 2) {
      if ((typeof from.name !== 'undefined' && from.name === 'geocent') || (typeof to.name !== 'undefined' && to.name === 'geocent')) {
        if (typeof transformedArray.z === 'number') {
          return /** @type {T} */ ([transformedArray.x, transformedArray.y, transformedArray.z].concat(coords.slice(3)));
        } else {
          return /** @type {T} */ ([transformedArray.x, transformedArray.y, coords[2]].concat(coords.slice(3)));
        }
      } else {
        return /** @type {T} */ ([transformedArray.x, transformedArray.y].concat(coords.slice(2)));
      }
    } else {
      return /** @type {T} */ ([transformedArray.x, transformedArray.y]);
    }
  } else {
    out = (0,_transform__WEBPACK_IMPORTED_MODULE_1__["default"])(from, to, coords, enforceAxis);
    keys = Object.keys(coords);
    if (keys.length === 2) {
      return /** @type {T} */ (out);
    }
    keys.forEach(function (key) {
      if ((typeof from.name !== 'undefined' && from.name === 'geocent') || (typeof to.name !== 'undefined' && to.name === 'geocent')) {
        if (key === 'x' || key === 'y' || key === 'z') {
          return;
        }
      } else {
        if (key === 'x' || key === 'y') {
          return;
        }
      }
      out[key] = coords[key];
    });
    return /** @type {T} */ (out);
  }
}

/**
 * @param {proj | string | PROJJSONDefinition | Converter} item
 * @returns {import('./Proj').default}
 */
function checkProj(item) {
  if (item instanceof _Proj__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    return item;
  }
  if (typeof item === 'object' && 'oProj' in item) {
    return item.oProj;
  }
  return (0,_Proj__WEBPACK_IMPORTED_MODULE_0__["default"])(/** @type {string | PROJJSONDefinition} */ (item));
}

/**
 * @overload
 * @param {string | PROJJSONDefinition | proj} toProj
 * @returns {Converter}
 */
/**
 * @overload
 * @param {string | PROJJSONDefinition | proj} fromProj
 * @param {string | PROJJSONDefinition | proj} toProj
 * @returns {Converter}
 */
/**
 * @template {TemplateCoordinates} T
 * @overload
 * @param {string | PROJJSONDefinition | proj} toProj
 * @param {T} coord
 * @returns {T}
 */
/**
 * @template {TemplateCoordinates} T
 * @overload
 * @param {string | PROJJSONDefinition | proj} fromProj
 * @param {string | PROJJSONDefinition | proj} toProj
 * @param {T} coord
 * @returns {T}
 */
/**
 * @template {TemplateCoordinates} T
 * @param {string | PROJJSONDefinition | proj} fromProjOrToProj
 * @param {string | PROJJSONDefinition | proj | TemplateCoordinates} [toProjOrCoord]
 * @param {T} [coord]
 * @returns {T|Converter}
 */
function proj4(fromProjOrToProj, toProjOrCoord, coord) {
  /** @type {proj} */
  var fromProj;
  /** @type {proj} */
  var toProj;
  var single = false;
  /** @type {Converter} */
  var obj;
  if (typeof toProjOrCoord === 'undefined') {
    toProj = checkProj(fromProjOrToProj);
    fromProj = wgs84;
    single = true;
  } else if (typeof /** @type {?} */ (toProjOrCoord).x !== 'undefined' || Array.isArray(toProjOrCoord)) {
    coord = /** @type {T} */ (/** @type {?} */ (toProjOrCoord));
    toProj = checkProj(fromProjOrToProj);
    fromProj = wgs84;
    single = true;
  }
  if (!fromProj) {
    fromProj = checkProj(fromProjOrToProj);
  }
  if (!toProj) {
    toProj = checkProj(/** @type {string | PROJJSONDefinition | proj } */ (toProjOrCoord));
  }
  if (coord) {
    return transformer(fromProj, toProj, coord);
  } else {
    obj = {
      /**
       * @template {TemplateCoordinates} T
       * @param {T} coords
       * @param {boolean=} enforceAxis
       * @returns {T}
       */
      forward: function (coords, enforceAxis) {
        return transformer(fromProj, toProj, coords, enforceAxis);
      },
      /**
       * @template {TemplateCoordinates} T
       * @param {T} coords
       * @param {boolean=} enforceAxis
       * @returns {T}
       */
      inverse: function (coords, enforceAxis) {
        return transformer(toProj, fromProj, coords, enforceAxis);
      }
    };
    if (single) {
      obj.oProj = toProj;
    }
    return obj;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (proj4);


/***/ }),

/***/ "./node_modules/proj4/lib/datum.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/datum.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");


function datum(datumCode, datum_params, a, b, es, ep2, nadgrids) {
  var out = {};

  if (datumCode === undefined || datumCode === 'none') {
    out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_NODATUM;
  } else {
    out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_WGS84;
  }

  if (datum_params) {
    out.datum_params = datum_params.map(parseFloat);
    if (out.datum_params[0] !== 0 || out.datum_params[1] !== 0 || out.datum_params[2] !== 0) {
      out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_3PARAM;
    }
    if (out.datum_params.length > 3) {
      if (out.datum_params[3] !== 0 || out.datum_params[4] !== 0 || out.datum_params[5] !== 0 || out.datum_params[6] !== 0) {
        out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_7PARAM;
        out.datum_params[3] *= _constants_values__WEBPACK_IMPORTED_MODULE_0__.SEC_TO_RAD;
        out.datum_params[4] *= _constants_values__WEBPACK_IMPORTED_MODULE_0__.SEC_TO_RAD;
        out.datum_params[5] *= _constants_values__WEBPACK_IMPORTED_MODULE_0__.SEC_TO_RAD;
        out.datum_params[6] = (out.datum_params[6] / 1000000.0) + 1.0;
      }
    }
  }

  if (nadgrids) {
    out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_GRIDSHIFT;
    out.grids = nadgrids;
  }
  out.a = a; // datum object also uses these values
  out.b = b;
  out.es = es;
  out.ep2 = ep2;
  return out;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (datum);


/***/ }),

/***/ "./node_modules/proj4/lib/datumUtils.js":
/*!**********************************************!*\
  !*** ./node_modules/proj4/lib/datumUtils.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compareDatums: () => (/* binding */ compareDatums),
/* harmony export */   geocentricFromWgs84: () => (/* binding */ geocentricFromWgs84),
/* harmony export */   geocentricToGeodetic: () => (/* binding */ geocentricToGeodetic),
/* harmony export */   geocentricToWgs84: () => (/* binding */ geocentricToWgs84),
/* harmony export */   geodeticToGeocentric: () => (/* binding */ geodeticToGeocentric)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");


function compareDatums(source, dest) {
  if (source.datum_type !== dest.datum_type) {
    return false; // false, datums are not equal
  } else if (source.a !== dest.a || Math.abs(source.es - dest.es) > 0.000000000050) {
    // the tolerance for es is to ensure that GRS80 and WGS84
    // are considered identical
    return false;
  } else if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_3PARAM) {
    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2]);
  } else if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_7PARAM) {
    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2] && source.datum_params[3] === dest.datum_params[3] && source.datum_params[4] === dest.datum_params[4] && source.datum_params[5] === dest.datum_params[5] && source.datum_params[6] === dest.datum_params[6]);
  } else {
    return true; // datums are equal
  }
} // cs_compare_datums()

/*
 * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
 * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
 * according to the current ellipsoid parameters.
 *
 *    Latitude  : Geodetic latitude in radians                     (input)
 *    Longitude : Geodetic longitude in radians                    (input)
 *    Height    : Geodetic height, in meters                       (input)
 *    X         : Calculated Geocentric X coordinate, in meters    (output)
 *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
 *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
 *
 */
function geodeticToGeocentric(p, es, a) {
  var Longitude = p.x;
  var Latitude = p.y;
  var Height = p.z ? p.z : 0; // Z value not always supplied

  var Rn; /*  Earth radius at location  */
  var Sin_Lat; /*  Math.sin(Latitude)  */
  var Sin2_Lat; /*  Square of Math.sin(Latitude)  */
  var Cos_Lat; /*  Math.cos(Latitude)  */

  /*
   ** Don't blow up if Latitude is just a little out of the value
   ** range as it may just be a rounding issue.  Also removed longitude
   ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
   */
  if (Latitude < -_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI && Latitude > -1.001 * _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI) {
    Latitude = -_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
  } else if (Latitude > _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI && Latitude < 1.001 * _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI) {
    Latitude = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
  } else if (Latitude < -_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI) {
    /* Latitude out of range */
    // ..reportError('geocent:lat out of range:' + Latitude);
    return { x: -Infinity, y: -Infinity, z: p.z };
  } else if (Latitude > _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI) {
    /* Latitude out of range */
    return { x: Infinity, y: Infinity, z: p.z };
  }

  if (Longitude > Math.PI) {
    Longitude -= (2 * Math.PI);
  }
  Sin_Lat = Math.sin(Latitude);
  Cos_Lat = Math.cos(Latitude);
  Sin2_Lat = Sin_Lat * Sin_Lat;
  Rn = a / (Math.sqrt(1.0e0 - es * Sin2_Lat));
  return {
    x: (Rn + Height) * Cos_Lat * Math.cos(Longitude),
    y: (Rn + Height) * Cos_Lat * Math.sin(Longitude),
    z: ((Rn * (1 - es)) + Height) * Sin_Lat
  };
} // cs_geodetic_to_geocentric()

function geocentricToGeodetic(p, es, a, b) {
  /* local defintions and variables */
  /* end-criterium of loop, accuracy of sin(Latitude) */
  var genau = 1e-12;
  var genau2 = (genau * genau);
  var maxiter = 30;

  var P; /* distance between semi-minor axis and location */
  var RR; /* distance between center and location */
  var CT; /* sin of geocentric latitude */
  var ST; /* cos of geocentric latitude */
  var RX;
  var RK;
  var RN; /* Earth radius at location */
  var CPHI0; /* cos of start or old geodetic latitude in iterations */
  var SPHI0; /* sin of start or old geodetic latitude in iterations */
  var CPHI; /* cos of searched geodetic latitude */
  var SPHI; /* sin of searched geodetic latitude */
  var SDPHI; /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
  var iter; /* # of continous iteration, max. 30 is always enough (s.a.) */

  var X = p.x;
  var Y = p.y;
  var Z = p.z ? p.z : 0.0; // Z value not always supplied
  var Longitude;
  var Latitude;
  var Height;

  P = Math.sqrt(X * X + Y * Y);
  RR = Math.sqrt(X * X + Y * Y + Z * Z);

  /*      special cases for latitude and longitude */
  if (P / a < genau) {
    /*  special case, if P=0. (X=0., Y=0.) */
    Longitude = 0.0;

    /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
     *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
    if (RR / a < genau) {
      Latitude = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
      Height = -b;
      return {
        x: p.x,
        y: p.y,
        z: p.z
      };
    }
  } else {
    /*  ellipsoidal (geodetic) longitude
     *  interval: -PI < Longitude <= +PI */
    Longitude = Math.atan2(Y, X);
  }

  /* --------------------------------------------------------------
   * Following iterative algorithm was developped by
   * "Institut for Erdmessung", University of Hannover, July 1988.
   * Internet: www.ife.uni-hannover.de
   * Iterative computation of CPHI,SPHI and Height.
   * Iteration of CPHI and SPHI to 10**-12 radian resp.
   * 2*10**-7 arcsec.
   * --------------------------------------------------------------
   */
  CT = Z / RR;
  ST = P / RR;
  RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST);
  CPHI0 = ST * (1.0 - es) * RX;
  SPHI0 = CT * RX;
  iter = 0;

  /* loop to find sin(Latitude) resp. Latitude
   * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
  do {
    iter++;
    RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0);

    /*  ellipsoidal (geodetic) height */
    Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0);

    RK = es * RN / (RN + Height);
    RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
    CPHI = ST * (1.0 - RK) * RX;
    SPHI = CT * RX;
    SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
    CPHI0 = CPHI;
    SPHI0 = SPHI;
  }
  while (SDPHI * SDPHI > genau2 && iter < maxiter);

  /*      ellipsoidal (geodetic) latitude */
  Latitude = Math.atan(SPHI / Math.abs(CPHI));
  return {
    x: Longitude,
    y: Latitude,
    z: Height
  };
} // cs_geocentric_to_geodetic()

/****************************************************************/
// pj_geocentic_to_wgs84( p )
//  p = point to transform in geocentric coordinates (x,y,z)

/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than by value.
    Other point classes may be used as long as they have
    x and y properties, which will get modified in the transform method.
*/
function geocentricToWgs84(p, datum_type, datum_params) {
  if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_3PARAM) {
    // if( x[io] === HUGE_VAL )
    //    continue;
    return {
      x: p.x + datum_params[0],
      y: p.y + datum_params[1],
      z: p.z + datum_params[2]
    };
  } else if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_7PARAM) {
    var Dx_BF = datum_params[0];
    var Dy_BF = datum_params[1];
    var Dz_BF = datum_params[2];
    var Rx_BF = datum_params[3];
    var Ry_BF = datum_params[4];
    var Rz_BF = datum_params[5];
    var M_BF = datum_params[6];
    // if( x[io] === HUGE_VAL )
    //    continue;
    return {
      x: M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF,
      y: M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF,
      z: M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF
    };
  }
} // cs_geocentric_to_wgs84

/****************************************************************/
// pj_geocentic_from_wgs84()
//  coordinate system definition,
//  point to transform in geocentric coordinates (x,y,z)
function geocentricFromWgs84(p, datum_type, datum_params) {
  if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_3PARAM) {
    // if( x[io] === HUGE_VAL )
    //    continue;
    return {
      x: p.x - datum_params[0],
      y: p.y - datum_params[1],
      z: p.z - datum_params[2]
    };
  } else if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_7PARAM) {
    var Dx_BF = datum_params[0];
    var Dy_BF = datum_params[1];
    var Dz_BF = datum_params[2];
    var Rx_BF = datum_params[3];
    var Ry_BF = datum_params[4];
    var Rz_BF = datum_params[5];
    var M_BF = datum_params[6];
    var x_tmp = (p.x - Dx_BF) / M_BF;
    var y_tmp = (p.y - Dy_BF) / M_BF;
    var z_tmp = (p.z - Dz_BF) / M_BF;
    // if( x[io] === HUGE_VAL )
    //    continue;

    return {
      x: x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp,
      y: -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp,
      z: Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp
    };
  } // cs_geocentric_from_wgs84()
}


/***/ }),

/***/ "./node_modules/proj4/lib/datum_transform.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/datum_transform.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyGridShift: () => (/* binding */ applyGridShift),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _datumUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./datumUtils */ "./node_modules/proj4/lib/datumUtils.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");




function checkParams(type) {
  return (type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_3PARAM || type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_7PARAM);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(source, dest, point) {
  // Short cut if the datums are identical.
  if ((0,_datumUtils__WEBPACK_IMPORTED_MODULE_1__.compareDatums)(source, dest)) {
    return point; // in this case, zero is sucess,
    // whereas cs_compare_datums returns 1 to indicate TRUE
    // confusing, should fix this
  }

  // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
  if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_NODATUM || dest.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_NODATUM) {
    return point;
  }

  // If this datum requires grid shifts, then apply it to geodetic coordinates.
  var source_a = source.a;
  var source_es = source.es;
  if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_GRIDSHIFT) {
    var gridShiftCode = applyGridShift(source, false, point);
    if (gridShiftCode !== 0) {
      return undefined;
    }
    source_a = _constants_values__WEBPACK_IMPORTED_MODULE_0__.SRS_WGS84_SEMIMAJOR;
    source_es = _constants_values__WEBPACK_IMPORTED_MODULE_0__.SRS_WGS84_ESQUARED;
  }

  var dest_a = dest.a;
  var dest_b = dest.b;
  var dest_es = dest.es;
  if (dest.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_GRIDSHIFT) {
    dest_a = _constants_values__WEBPACK_IMPORTED_MODULE_0__.SRS_WGS84_SEMIMAJOR;
    dest_b = _constants_values__WEBPACK_IMPORTED_MODULE_0__.SRS_WGS84_SEMIMINOR;
    dest_es = _constants_values__WEBPACK_IMPORTED_MODULE_0__.SRS_WGS84_ESQUARED;
  }

  // Do we need to go through geocentric coordinates?
  if (source_es === dest_es && source_a === dest_a && !checkParams(source.datum_type) && !checkParams(dest.datum_type)) {
    return point;
  }

  // Convert to geocentric coordinates.
  point = (0,_datumUtils__WEBPACK_IMPORTED_MODULE_1__.geodeticToGeocentric)(point, source_es, source_a);
  // Convert between datums
  if (checkParams(source.datum_type)) {
    point = (0,_datumUtils__WEBPACK_IMPORTED_MODULE_1__.geocentricToWgs84)(point, source.datum_type, source.datum_params);
  }
  if (checkParams(dest.datum_type)) {
    point = (0,_datumUtils__WEBPACK_IMPORTED_MODULE_1__.geocentricFromWgs84)(point, dest.datum_type, dest.datum_params);
  }
  point = (0,_datumUtils__WEBPACK_IMPORTED_MODULE_1__.geocentricToGeodetic)(point, dest_es, dest_a, dest_b);

  if (dest.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_GRIDSHIFT) {
    var destGridShiftResult = applyGridShift(dest, true, point);
    if (destGridShiftResult !== 0) {
      return undefined;
    }
  }

  return point;
}

function applyGridShift(source, inverse, point) {
  if (source.grids === null || source.grids.length === 0) {
    console.log('Grid shift grids not found');
    return -1;
  }
  var input = { x: -point.x, y: point.y };
  var output = { x: Number.NaN, y: Number.NaN };
  var attemptedGrids = [];
  outer:
  for (var i = 0; i < source.grids.length; i++) {
    var grid = source.grids[i];
    attemptedGrids.push(grid.name);
    if (grid.isNull) {
      output = input;
      break;
    }
    if (grid.grid === null) {
      if (grid.mandatory) {
        console.log('Unable to find mandatory grid \'' + grid.name + '\'');
        return -1;
      }
      continue;
    }
    var subgrids = grid.grid.subgrids;
    for (var j = 0, jj = subgrids.length; j < jj; j++) {
      var subgrid = subgrids[j];
      // skip tables that don't match our point at all
      var epsilon = (Math.abs(subgrid.del[1]) + Math.abs(subgrid.del[0])) / 10000.0;
      var minX = subgrid.ll[0] - epsilon;
      var minY = subgrid.ll[1] - epsilon;
      var maxX = subgrid.ll[0] + (subgrid.lim[0] - 1) * subgrid.del[0] + epsilon;
      var maxY = subgrid.ll[1] + (subgrid.lim[1] - 1) * subgrid.del[1] + epsilon;
      if (minY > input.y || minX > input.x || maxY < input.y || maxX < input.x) {
        continue;
      }
      output = applySubgridShift(input, inverse, subgrid);
      if (!isNaN(output.x)) {
        break outer;
      }
    }
  }
  if (isNaN(output.x)) {
    console.log('Failed to find a grid shift table for location \''
      + -input.x * _constants_values__WEBPACK_IMPORTED_MODULE_0__.R2D + ' ' + input.y * _constants_values__WEBPACK_IMPORTED_MODULE_0__.R2D + ' tried: \'' + attemptedGrids + '\'');
    return -1;
  }
  point.x = -output.x;
  point.y = output.y;
  return 0;
}

function applySubgridShift(pin, inverse, ct) {
  var val = { x: Number.NaN, y: Number.NaN };
  if (isNaN(pin.x)) {
    return val;
  }
  var tb = { x: pin.x, y: pin.y };
  tb.x -= ct.ll[0];
  tb.y -= ct.ll[1];
  tb.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(tb.x - Math.PI) + Math.PI;
  var t = nadInterpolate(tb, ct);
  if (inverse) {
    if (isNaN(t.x)) {
      return val;
    }
    t.x = tb.x - t.x;
    t.y = tb.y - t.y;
    var i = 9, tol = 1e-12;
    var dif, del;
    do {
      del = nadInterpolate(t, ct);
      if (isNaN(del.x)) {
        console.log('Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.');
        break;
      }
      dif = { x: tb.x - (del.x + t.x), y: tb.y - (del.y + t.y) };
      t.x += dif.x;
      t.y += dif.y;
    } while (i-- && Math.abs(dif.x) > tol && Math.abs(dif.y) > tol);
    if (i < 0) {
      console.log('Inverse grid shift iterator failed to converge.');
      return val;
    }
    val.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(t.x + ct.ll[0]);
    val.y = t.y + ct.ll[1];
  } else {
    if (!isNaN(t.x)) {
      val.x = pin.x + t.x;
      val.y = pin.y + t.y;
    }
  }
  return val;
}

function nadInterpolate(pin, ct) {
  var t = { x: pin.x / ct.del[0], y: pin.y / ct.del[1] };
  var indx = { x: Math.floor(t.x), y: Math.floor(t.y) };
  var frct = { x: t.x - 1.0 * indx.x, y: t.y - 1.0 * indx.y };
  var val = { x: Number.NaN, y: Number.NaN };
  var inx;
  if (indx.x < 0 || indx.x >= ct.lim[0]) {
    return val;
  }
  if (indx.y < 0 || indx.y >= ct.lim[1]) {
    return val;
  }
  inx = (indx.y * ct.lim[0]) + indx.x;
  var f00 = { x: ct.cvs[inx][0], y: ct.cvs[inx][1] };
  inx++;
  var f10 = { x: ct.cvs[inx][0], y: ct.cvs[inx][1] };
  inx += ct.lim[0];
  var f11 = { x: ct.cvs[inx][0], y: ct.cvs[inx][1] };
  inx--;
  var f01 = { x: ct.cvs[inx][0], y: ct.cvs[inx][1] };
  var m11 = frct.x * frct.y, m10 = frct.x * (1.0 - frct.y),
    m00 = (1.0 - frct.x) * (1.0 - frct.y), m01 = (1.0 - frct.x) * frct.y;
  val.x = (m00 * f00.x + m10 * f10.x + m01 * f01.x + m11 * f11.x);
  val.y = (m00 * f00.y + m10 * f10.y + m01 * f01.y + m11 * f11.y);
  return val;
}


/***/ }),

/***/ "./node_modules/proj4/lib/defs.js":
/*!****************************************!*\
  !*** ./node_modules/proj4/lib/defs.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./node_modules/proj4/lib/global.js");
/* harmony import */ var _projString__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projString */ "./node_modules/proj4/lib/projString.js");
/* harmony import */ var wkt_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wkt-parser */ "./node_modules/wkt-parser/index.js");




/**
 * @typedef {Object} ProjectionDefinition
 * @property {string} title
 * @property {string} [projName]
 * @property {string} [ellps]
 * @property {import('./Proj.js').DatumDefinition} [datum]
 * @property {string} [datumName]
 * @property {number} [rf]
 * @property {number} [lat0]
 * @property {number} [lat1]
 * @property {number} [lat2]
 * @property {number} [lat_ts]
 * @property {number} [long0]
 * @property {number} [long1]
 * @property {number} [long2]
 * @property {number} [alpha]
 * @property {number} [longc]
 * @property {number} [x0]
 * @property {number} [y0]
 * @property {number} [k0]
 * @property {number} [a]
 * @property {number} [b]
 * @property {true} [R_A]
 * @property {number} [zone]
 * @property {true} [utmSouth]
 * @property {string|Array<number>} [datum_params]
 * @property {number} [to_meter]
 * @property {string} [units]
 * @property {number} [from_greenwich]
 * @property {string} [datumCode]
 * @property {string} [nadgrids]
 * @property {string} [axis]
 * @property {boolean} [sphere]
 * @property {number} [rectified_grid_angle]
 * @property {boolean} [approx]
 * @property {boolean} [over]
 * @property {string} [projStr]
 * @property {<T extends import('./core').TemplateCoordinates>(coordinates: T, enforceAxis?: boolean) => T} inverse
 * @property {<T extends import('./core').TemplateCoordinates>(coordinates: T, enforceAxis?: boolean) => T} forward
 */

/**
 * @overload
 * @param {string} name
 * @param {string|ProjectionDefinition|import('./core.js').PROJJSONDefinition} projection
 * @returns {void}
 */
/**
 * @overload
 * @param {Array<[string, string]>} name
 * @returns {Array<ProjectionDefinition|undefined>}
 */
/**
 * @overload
 * @param {string} name
 * @returns {ProjectionDefinition}
 */

/**
 * @param {string | Array<Array<string>> | Partial<Record<'EPSG'|'ESRI'|'IAU2000', ProjectionDefinition>>} name
 * @returns {ProjectionDefinition | Array<ProjectionDefinition|undefined> | void}
 */
function defs(name) {
  /* global console */
  var that = this;
  if (arguments.length === 2) {
    var def = arguments[1];
    if (typeof def === 'string') {
      if (def.charAt(0) === '+') {
        defs[/** @type {string} */ (name)] = (0,_projString__WEBPACK_IMPORTED_MODULE_1__["default"])(arguments[1]);
      } else {
        defs[/** @type {string} */ (name)] = (0,wkt_parser__WEBPACK_IMPORTED_MODULE_2__["default"])(arguments[1]);
      }
    } else if (def && typeof def === 'object' && !('projName' in def)) {
      // PROJJSON
      defs[/** @type {string} */ (name)] = (0,wkt_parser__WEBPACK_IMPORTED_MODULE_2__["default"])(arguments[1]);
    } else {
      defs[/** @type {string} */ (name)] = def;
      if (!def) {
        delete defs[/** @type {string} */ (name)];
      }
    }
  } else if (arguments.length === 1) {
    if (Array.isArray(name)) {
      return name.map(function (v) {
        if (Array.isArray(v)) {
          return defs.apply(that, v);
        } else {
          return defs(v);
        }
      });
    } else if (typeof name === 'string') {
      if (name in defs) {
        return defs[name];
      }
    } else if ('EPSG' in name) {
      defs['EPSG:' + name.EPSG] = name;
    } else if ('ESRI' in name) {
      defs['ESRI:' + name.ESRI] = name;
    } else if ('IAU2000' in name) {
      defs['IAU2000:' + name.IAU2000] = name;
    } else {
      console.log(name);
    }
    return;
  }
}
(0,_global__WEBPACK_IMPORTED_MODULE_0__["default"])(defs);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defs);


/***/ }),

/***/ "./node_modules/proj4/lib/deriveConstants.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/deriveConstants.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   eccentricity: () => (/* binding */ eccentricity),
/* harmony export */   sphere: () => (/* binding */ sphere)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _constants_Ellipsoid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/Ellipsoid */ "./node_modules/proj4/lib/constants/Ellipsoid.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");




const WGS84 = _constants_Ellipsoid__WEBPACK_IMPORTED_MODULE_1__["default"].WGS84; // default ellipsoid

function eccentricity(a, b, rf, R_A) {
  var a2 = a * a; // used in geocentric
  var b2 = b * b; // used in geocentric
  var es = (a2 - b2) / a2; // e ^ 2
  var e = 0;
  if (R_A) {
    a *= 1 - es * (_constants_values__WEBPACK_IMPORTED_MODULE_0__.SIXTH + es * (_constants_values__WEBPACK_IMPORTED_MODULE_0__.RA4 + es * _constants_values__WEBPACK_IMPORTED_MODULE_0__.RA6));
    a2 = a * a;
    es = 0;
  } else {
    e = Math.sqrt(es); // eccentricity
  }
  var ep2 = (a2 - b2) / b2; // used in geocentric
  return {
    es: es,
    e: e,
    ep2: ep2
  };
}
function sphere(a, b, rf, ellps, sphere) {
  if (!a) { // do we have an ellipsoid?
    var ellipse = (0,_match__WEBPACK_IMPORTED_MODULE_2__["default"])(_constants_Ellipsoid__WEBPACK_IMPORTED_MODULE_1__["default"], ellps);
    if (!ellipse) {
      ellipse = WGS84;
    }
    a = ellipse.a;
    b = ellipse.b;
    rf = ellipse.rf;
  }

  if (rf && !b) {
    b = (1.0 - 1.0 / rf) * a;
  }
  if (rf === 0 || Math.abs(a - b) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    sphere = true;
    b = a;
  }
  return {
    a: a,
    b: b,
    rf: rf,
    sphere: sphere
  };
}


/***/ }),

/***/ "./node_modules/proj4/lib/extend.js":
/*!******************************************!*\
  !*** ./node_modules/proj4/lib/extend.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(destination, source) {
  destination = destination || {};
  var value, property;
  if (!source) {
    return destination;
  }
  for (property in source) {
    value = source[property];
    if (value !== undefined) {
      destination[property] = value;
    }
  }
  return destination;
}


/***/ }),

/***/ "./node_modules/proj4/lib/global.js":
/*!******************************************!*\
  !*** ./node_modules/proj4/lib/global.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(defs) {
  defs('EPSG:4326', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
  defs('EPSG:4269', '+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees');
  defs('EPSG:3857', '+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs');
  // UTM WGS84
  for (var i = 1; i <= 60; ++i) {
    defs('EPSG:' + (32600 + i), '+proj=utm +zone=' + i + ' +datum=WGS84 +units=m');
    defs('EPSG:' + (32700 + i), '+proj=utm +zone=' + i + ' +south +datum=WGS84 +units=m');
  }
  defs('EPSG:5041', '+title=WGS 84 / UPS North (E,N) +proj=stere +lat_0=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m');
  defs('EPSG:5042', '+title=WGS 84 / UPS South (E,N) +proj=stere +lat_0=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m');

  defs.WGS84 = defs['EPSG:4326'];
  defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857
  defs.GOOGLE = defs['EPSG:3857'];
  defs['EPSG:900913'] = defs['EPSG:3857'];
  defs['EPSG:102113'] = defs['EPSG:3857'];
}


/***/ }),

/***/ "./node_modules/proj4/lib/index.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./node_modules/proj4/lib/core.js");
/* harmony import */ var _Proj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proj */ "./node_modules/proj4/lib/Proj.js");
/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Point */ "./node_modules/proj4/lib/Point.js");
/* harmony import */ var _common_toPoint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/toPoint */ "./node_modules/proj4/lib/common/toPoint.js");
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defs */ "./node_modules/proj4/lib/defs.js");
/* harmony import */ var _nadgrid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nadgrid */ "./node_modules/proj4/lib/nadgrid.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transform */ "./node_modules/proj4/lib/transform.js");
/* harmony import */ var mgrs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! mgrs */ "./node_modules/mgrs/mgrs.js");
/* harmony import */ var _projs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../projs */ "./node_modules/proj4/projs.js");










/**
 * @typedef {Object} Mgrs
 * @property {(lonlat: [number, number]) => string} forward
 * @property {(mgrsString: string) => [number, number, number, number]} inverse
 * @property {(mgrsString: string) => [number, number]} toPoint
 */

/**
 * @typedef {import('./defs').ProjectionDefinition} ProjectionDefinition
 * @typedef {import('./core').TemplateCoordinates} TemplateCoordinates
 * @typedef {import('./core').InterfaceCoordinates} InterfaceCoordinates
 * @typedef {import('./core').Converter} Converter
 * @typedef {import('./Proj').DatumDefinition} DatumDefinition
 */

/**
 * @template {import('./core').TemplateCoordinates} T
 * @type {core<T> & {defaultDatum: string, Proj: typeof Proj, WGS84: Proj, Point: typeof Point, toPoint: typeof common, defs: typeof defs, nadgrid: typeof nadgrid, transform: typeof transform, mgrs: Mgrs, version: string}}
 */
const proj4 = Object.assign(_core__WEBPACK_IMPORTED_MODULE_0__["default"], {
  defaultDatum: 'WGS84',
  Proj: _Proj__WEBPACK_IMPORTED_MODULE_1__["default"],
  WGS84: new _Proj__WEBPACK_IMPORTED_MODULE_1__["default"]('WGS84'),
  Point: _Point__WEBPACK_IMPORTED_MODULE_2__["default"],
  toPoint: _common_toPoint__WEBPACK_IMPORTED_MODULE_3__["default"],
  defs: _defs__WEBPACK_IMPORTED_MODULE_4__["default"],
  nadgrid: _nadgrid__WEBPACK_IMPORTED_MODULE_5__["default"],
  transform: _transform__WEBPACK_IMPORTED_MODULE_6__["default"],
  mgrs: mgrs__WEBPACK_IMPORTED_MODULE_7__["default"],
  version: '__VERSION__'
});
(0,_projs__WEBPACK_IMPORTED_MODULE_8__["default"])(proj4);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (proj4);


/***/ }),

/***/ "./node_modules/proj4/lib/match.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/match.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ match)
/* harmony export */ });
var ignoredChar = /[\s_\-\/\(\)]/g;
function match(obj, key) {
  if (obj[key]) {
    return obj[key];
  }
  var keys = Object.keys(obj);
  var lkey = key.toLowerCase().replace(ignoredChar, '');
  var i = -1;
  var testkey, processedKey;
  while (++i < keys.length) {
    testkey = keys[i];
    processedKey = testkey.toLowerCase().replace(ignoredChar, '');
    if (processedKey === lkey) {
      return obj[testkey];
    }
  }
}


/***/ }),

/***/ "./node_modules/proj4/lib/nadgrid.js":
/*!*******************************************!*\
  !*** ./node_modules/proj4/lib/nadgrid.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ nadgrid),
/* harmony export */   getNadgrids: () => (/* binding */ getNadgrids)
/* harmony export */ });
/**
 * Resources for details of NTv2 file formats:
 * - https://web.archive.org/web/20140127204822if_/http://www.mgs.gov.on.ca:80/stdprodconsume/groups/content/@mgs/@iandit/documents/resourcelist/stel02_047447.pdf
 * - http://mimaka.com/help/gs/html/004_NTV2%20Data%20Format.htm
 */

/**
 * @typedef {Object} NadgridInfo
 * @property {string} name The name of the NAD grid or 'null' if not specified.
 * @property {boolean} mandatory Indicates if the grid is mandatory (true) or optional (false).
 * @property {*} grid The loaded NAD grid object, or null if not loaded or not applicable.
 * @property {boolean} isNull True if the grid is explicitly 'null', otherwise false.
 */

/**
 * @typedef {Object} NTV2GridOptions
 * @property {boolean} [includeErrorFields=true] Whether to include error fields in the subgrids.
 */

/**
 * @typedef {Object} NadgridHeader
 * @property {number} [nFields] Number of fields in the header.
 * @property {number} [nSubgridFields] Number of fields in each subgrid header.
 * @property {number} nSubgrids Number of subgrids in the file.
 * @property {string} [shiftType] Type of shift (e.g., "SECONDS").
 * @property {number} [fromSemiMajorAxis] Source ellipsoid semi-major axis.
 * @property {number} [fromSemiMinorAxis] Source ellipsoid semi-minor axis.
 * @property {number} [toSemiMajorAxis] Target ellipsoid semi-major axis.
 * @property {number} [toSemiMinorAxis] Target ellipsoid semi-minor axis.
 */

/**
 * @typedef {Object} Subgrid
 * @property {Array<number>} ll Lower left corner of the grid in radians [longitude, latitude].
 * @property {Array<number>} del Grid spacing in radians [longitude interval, latitude interval].
 * @property {Array<number>} lim Number of columns in the grid [longitude columns, latitude columns].
 * @property {number} [count] Total number of grid nodes.
 * @property {Array} cvs Mapped node values for the grid.
 */

/** @typedef {{header: NadgridHeader, subgrids: Array<Subgrid>}} NADGrid */

/**
 * @typedef {Object} GeoTIFF
 * @property {() => Promise<number>} getImageCount - Returns the number of images in the GeoTIFF.
 * @property {(index: number) => Promise<GeoTIFFImage>} getImage - Returns a GeoTIFFImage for the given index.
 */

/**
 * @typedef {Object} GeoTIFFImage
 * @property {() => number} getWidth - Returns the width of the image.
 * @property {() => number} getHeight - Returns the height of the image.
 * @property {() => number[]} getBoundingBox - Returns the bounding box as [minX, minY, maxX, maxY] in degrees.
 * @property {() => Promise<ArrayLike<ArrayLike<number>>>} readRasters - Returns the raster data as an array of bands.
 * @property {Object} fileDirectory - The file directory object containing metadata.
 * @property {Object} fileDirectory.ModelPixelScale - The pixel scale array [scaleX, scaleY, scaleZ] in degrees.
 */

var loadedNadgrids = {};

/**
 * @overload
 * @param {string} key - The key to associate with the loaded grid.
 * @param {ArrayBuffer} data - The NTv2 grid data as an ArrayBuffer.
 * @param {NTV2GridOptions} [options] - Optional parameters for loading the grid.
 * @returns {NADGrid} - The loaded NAD grid information.
 */
/**
 * @overload
 * @param {string} key - The key to associate with the loaded grid.
 * @param {GeoTIFF} data - The GeoTIFF instance to read the grid from.
 * @returns {{ready: Promise<NADGrid>}} - A promise that resolves to the loaded grid information.
 */
/**
 * Load either a NTv2 file (.gsb) or a Geotiff (.tif) to a key that can be used in a proj string like +nadgrids=<key>. Pass the NTv2 file
 * as an ArrayBuffer. Pass Geotiff as a GeoTIFF instance from the geotiff.js library.
 * @param {string} key - The key to associate with the loaded grid.
 * @param {ArrayBuffer|GeoTIFF} data The data to load, either an ArrayBuffer for NTv2 or a GeoTIFF instance.
 * @param {NTV2GridOptions} [options] Optional parameters.
 * @returns {{ready: Promise<NADGrid>}|NADGrid} - A promise that resolves to the loaded grid information.
 */
function nadgrid(key, data, options) {
  if (data instanceof ArrayBuffer) {
    return readNTV2Grid(key, data, options);
  }
  return { ready: readGeotiffGrid(key, data) };
}

/**
 * @param {string} key The key to associate with the loaded grid.
 * @param {ArrayBuffer} data The NTv2 grid data as an ArrayBuffer.
 * @param {NTV2GridOptions} [options] Optional parameters for loading the grid.
 * @returns {NADGrid} The loaded NAD grid information.
 */
function readNTV2Grid(key, data, options) {
  var includeErrorFields = true;
  if (options !== undefined && options.includeErrorFields === false) {
    includeErrorFields = false;
  }
  var view = new DataView(data);
  var isLittleEndian = detectLittleEndian(view);
  var header = readHeader(view, isLittleEndian);
  var subgrids = readSubgrids(view, header, isLittleEndian, includeErrorFields);
  var nadgrid = { header: header, subgrids: subgrids };
  loadedNadgrids[key] = nadgrid;
  return nadgrid;
}

/**
 * @param {string} key The key to associate with the loaded grid.
 * @param {GeoTIFF} tiff The GeoTIFF instance to read the grid from.
 * @returns {Promise<NADGrid>} A promise that resolves to the loaded NAD grid information.
 */
async function readGeotiffGrid(key, tiff) {
  var subgrids = [];
  var subGridCount = await tiff.getImageCount();
  // proj produced tiff grid shift files appear to organize lower res subgrids first, higher res/ child subgrids last.
  for (var subgridIndex = subGridCount - 1; subgridIndex >= 0; subgridIndex--) {
    var image = await tiff.getImage(subgridIndex);

    var rasters = await image.readRasters();
    var data = rasters;
    var lim = [image.getWidth(), image.getHeight()];
    var imageBBoxRadians = image.getBoundingBox().map(degreesToRadians);
    var del = [image.fileDirectory.ModelPixelScale[0], image.fileDirectory.ModelPixelScale[1]].map(degreesToRadians);

    var maxX = imageBBoxRadians[0] + (lim[0] - 1) * del[0];
    var minY = imageBBoxRadians[3] - (lim[1] - 1) * del[1];

    var latitudeOffsetBand = data[0];
    var longitudeOffsetBand = data[1];
    var nodes = [];

    for (let i = lim[1] - 1; i >= 0; i--) {
      for (let j = lim[0] - 1; j >= 0; j--) {
        var index = i * lim[0] + j;
        nodes.push([-secondsToRadians(longitudeOffsetBand[index]), secondsToRadians(latitudeOffsetBand[index])]);
      }
    }

    subgrids.push({
      del: del,
      lim: lim,
      ll: [-maxX, minY],
      cvs: nodes
    });
  }

  var tifGrid = {
    header: {
      nSubgrids: subGridCount
    },
    subgrids: subgrids
  };
  loadedNadgrids[key] = tifGrid;
  return tifGrid;
};

/**
 * Given a proj4 value for nadgrids, return an array of loaded grids
 * @param {string} nadgrids A comma-separated list of grid names, optionally prefixed with '@' to indicate optional grids.
 * @returns
 */
function getNadgrids(nadgrids) {
  // Format details: http://proj.maptools.org/gen_parms.html
  if (nadgrids === undefined) {
    return null;
  }
  var grids = nadgrids.split(',');
  return grids.map(parseNadgridString);
}

/**
 * @param {string} value The nadgrid string to get information for.
 * @returns {NadgridInfo|null} An object with grid information, or null if the input is empty.
 */
function parseNadgridString(value) {
  if (value.length === 0) {
    return null;
  }
  var optional = value[0] === '@';
  if (optional) {
    value = value.slice(1);
  }
  if (value === 'null') {
    return { name: 'null', mandatory: !optional, grid: null, isNull: true };
  }
  return {
    name: value,
    mandatory: !optional,
    grid: loadedNadgrids[value] || null,
    isNull: false
  };
}

function degreesToRadians(degrees) {
  return (degrees) * Math.PI / 180;
}

function secondsToRadians(seconds) {
  return (seconds / 3600) * Math.PI / 180;
}

function detectLittleEndian(view) {
  var nFields = view.getInt32(8, false);
  if (nFields === 11) {
    return false;
  }
  nFields = view.getInt32(8, true);
  if (nFields !== 11) {
    console.warn('Failed to detect nadgrid endian-ness, defaulting to little-endian');
  }
  return true;
}

function readHeader(view, isLittleEndian) {
  return {
    nFields: view.getInt32(8, isLittleEndian),
    nSubgridFields: view.getInt32(24, isLittleEndian),
    nSubgrids: view.getInt32(40, isLittleEndian),
    shiftType: decodeString(view, 56, 56 + 8).trim(),
    fromSemiMajorAxis: view.getFloat64(120, isLittleEndian),
    fromSemiMinorAxis: view.getFloat64(136, isLittleEndian),
    toSemiMajorAxis: view.getFloat64(152, isLittleEndian),
    toSemiMinorAxis: view.getFloat64(168, isLittleEndian)
  };
}

function decodeString(view, start, end) {
  return String.fromCharCode.apply(null, new Uint8Array(view.buffer.slice(start, end)));
}

function readSubgrids(view, header, isLittleEndian, includeErrorFields) {
  var gridOffset = 176;
  var grids = [];
  for (var i = 0; i < header.nSubgrids; i++) {
    var subHeader = readGridHeader(view, gridOffset, isLittleEndian);
    var nodes = readGridNodes(view, gridOffset, subHeader, isLittleEndian, includeErrorFields);
    var lngColumnCount = Math.round(
      1 + (subHeader.upperLongitude - subHeader.lowerLongitude) / subHeader.longitudeInterval);
    var latColumnCount = Math.round(
      1 + (subHeader.upperLatitude - subHeader.lowerLatitude) / subHeader.latitudeInterval);
    // Proj4 operates on radians whereas the coordinates are in seconds in the grid
    grids.push({
      ll: [secondsToRadians(subHeader.lowerLongitude), secondsToRadians(subHeader.lowerLatitude)],
      del: [secondsToRadians(subHeader.longitudeInterval), secondsToRadians(subHeader.latitudeInterval)],
      lim: [lngColumnCount, latColumnCount],
      count: subHeader.gridNodeCount,
      cvs: mapNodes(nodes)
    });
    var rowSize = 16;
    if (includeErrorFields === false) {
      rowSize = 8;
    }
    gridOffset += 176 + subHeader.gridNodeCount * rowSize;
  }
  return grids;
}

/**
 * @param {*} nodes
 * @returns Array<Array<number>>
 */
function mapNodes(nodes) {
  return nodes.map(function (r) {
    return [secondsToRadians(r.longitudeShift), secondsToRadians(r.latitudeShift)];
  });
}

function readGridHeader(view, offset, isLittleEndian) {
  return {
    name: decodeString(view, offset + 8, offset + 16).trim(),
    parent: decodeString(view, offset + 24, offset + 24 + 8).trim(),
    lowerLatitude: view.getFloat64(offset + 72, isLittleEndian),
    upperLatitude: view.getFloat64(offset + 88, isLittleEndian),
    lowerLongitude: view.getFloat64(offset + 104, isLittleEndian),
    upperLongitude: view.getFloat64(offset + 120, isLittleEndian),
    latitudeInterval: view.getFloat64(offset + 136, isLittleEndian),
    longitudeInterval: view.getFloat64(offset + 152, isLittleEndian),
    gridNodeCount: view.getInt32(offset + 168, isLittleEndian)
  };
}

function readGridNodes(view, offset, gridHeader, isLittleEndian, includeErrorFields) {
  var nodesOffset = offset + 176;
  var gridRecordLength = 16;

  if (includeErrorFields === false) {
    gridRecordLength = 8;
  }

  var gridShiftRecords = [];
  for (var i = 0; i < gridHeader.gridNodeCount; i++) {
    var record = {
      latitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength, isLittleEndian),
      longitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength + 4, isLittleEndian)

    };

    if (includeErrorFields !== false) {
      record.latitudeAccuracy = view.getFloat32(nodesOffset + i * gridRecordLength + 8, isLittleEndian);
      record.longitudeAccuracy = view.getFloat32(nodesOffset + i * gridRecordLength + 12, isLittleEndian);
    }

    gridShiftRecords.push(record);
  }
  return gridShiftRecords;
}


/***/ }),

/***/ "./node_modules/proj4/lib/parseCode.js":
/*!*********************************************!*\
  !*** ./node_modules/proj4/lib/parseCode.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defs */ "./node_modules/proj4/lib/defs.js");
/* harmony import */ var wkt_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wkt-parser */ "./node_modules/wkt-parser/index.js");
/* harmony import */ var _projString__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projString */ "./node_modules/proj4/lib/projString.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");




function testObj(code) {
  return typeof code === 'string';
}
function testDef(code) {
  return code in _defs__WEBPACK_IMPORTED_MODULE_0__["default"];
}
function testWKT(code) {
  return (code.indexOf('+') !== 0 && code.indexOf('[') !== -1) || (typeof code === 'object' && !('srsCode' in code));
}
var codes = ['3857', '900913', '3785', '102113'];
function checkMercator(item) {
  var auth = (0,_match__WEBPACK_IMPORTED_MODULE_3__["default"])(item, 'authority');
  if (!auth) {
    return;
  }
  var code = (0,_match__WEBPACK_IMPORTED_MODULE_3__["default"])(auth, 'epsg');
  return code && codes.indexOf(code) > -1;
}
function checkProjStr(item) {
  var ext = (0,_match__WEBPACK_IMPORTED_MODULE_3__["default"])(item, 'extension');
  if (!ext) {
    return;
  }
  return (0,_match__WEBPACK_IMPORTED_MODULE_3__["default"])(ext, 'proj4');
}
function testProj(code) {
  return code[0] === '+';
}
/**
 * @param {string | import('./core').PROJJSONDefinition | import('./defs').ProjectionDefinition} code
 * @returns {import('./defs').ProjectionDefinition}
 */
function parse(code) {
  if (testObj(code)) {
    // check to see if this is a WKT string
    if (testDef(code)) {
      return _defs__WEBPACK_IMPORTED_MODULE_0__["default"][code];
    }
    if (testWKT(code)) {
      var out = (0,wkt_parser__WEBPACK_IMPORTED_MODULE_1__["default"])(code);
      // test of spetial case, due to this being a very common and often malformed
      if (checkMercator(out)) {
        return _defs__WEBPACK_IMPORTED_MODULE_0__["default"]['EPSG:3857'];
      }
      var maybeProjStr = checkProjStr(out);
      if (maybeProjStr) {
        return (0,_projString__WEBPACK_IMPORTED_MODULE_2__["default"])(maybeProjStr);
      }
      return out;
    }
    if (testProj(code)) {
      return (0,_projString__WEBPACK_IMPORTED_MODULE_2__["default"])(code);
    }
  } else if (!('projName' in code)) {
    return (0,wkt_parser__WEBPACK_IMPORTED_MODULE_1__["default"])(code);
  } else {
    return code;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);


/***/ }),

/***/ "./node_modules/proj4/lib/projString.js":
/*!**********************************************!*\
  !*** ./node_modules/proj4/lib/projString.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _constants_PrimeMeridian__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/PrimeMeridian */ "./node_modules/proj4/lib/constants/PrimeMeridian.js");
/* harmony import */ var _constants_units__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/units */ "./node_modules/proj4/lib/constants/units.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");





/**
 * @param {string} defData
 * @returns {import('./defs').ProjectionDefinition}
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(defData) {
  /** @type {import('./defs').ProjectionDefinition} */
  var self = {};
  var paramObj = defData.split('+').map(function (v) {
    return v.trim();
  }).filter(function (a) {
    return a;
  }).reduce(function (p, a) {
    /** @type {Array<?>} */
    var split = a.split('=');
    split.push(true);
    p[split[0].toLowerCase()] = split[1];
    return p;
  }, {});
  var paramName, paramVal, paramOutname;
  var params = {
    proj: 'projName',
    datum: 'datumCode',
    rf: function (v) {
      self.rf = parseFloat(v);
    },
    lat_0: function (v) {
      self.lat0 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    lat_1: function (v) {
      self.lat1 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    lat_2: function (v) {
      self.lat2 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    lat_ts: function (v) {
      self.lat_ts = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    lon_0: function (v) {
      self.long0 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    lon_1: function (v) {
      self.long1 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    lon_2: function (v) {
      self.long2 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    alpha: function (v) {
      self.alpha = parseFloat(v) * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    gamma: function (v) {
      self.rectified_grid_angle = parseFloat(v) * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    lonc: function (v) {
      self.longc = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    x_0: function (v) {
      self.x0 = parseFloat(v);
    },
    y_0: function (v) {
      self.y0 = parseFloat(v);
    },
    k_0: function (v) {
      self.k0 = parseFloat(v);
    },
    k: function (v) {
      self.k0 = parseFloat(v);
    },
    a: function (v) {
      self.a = parseFloat(v);
    },
    b: function (v) {
      self.b = parseFloat(v);
    },
    r: function (v) {
      self.a = self.b = parseFloat(v);
    },
    r_a: function () {
      self.R_A = true;
    },
    zone: function (v) {
      self.zone = parseInt(v, 10);
    },
    south: function () {
      self.utmSouth = true;
    },
    towgs84: function (v) {
      self.datum_params = v.split(',').map(function (a) {
        return parseFloat(a);
      });
    },
    to_meter: function (v) {
      self.to_meter = parseFloat(v);
    },
    units: function (v) {
      self.units = v;
      var unit = (0,_match__WEBPACK_IMPORTED_MODULE_3__["default"])(_constants_units__WEBPACK_IMPORTED_MODULE_2__["default"], v);
      if (unit) {
        self.to_meter = unit.to_meter;
      }
    },
    from_greenwich: function (v) {
      self.from_greenwich = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    pm: function (v) {
      var pm = (0,_match__WEBPACK_IMPORTED_MODULE_3__["default"])(_constants_PrimeMeridian__WEBPACK_IMPORTED_MODULE_1__["default"], v);
      self.from_greenwich = (pm ? pm : parseFloat(v)) * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    },
    nadgrids: function (v) {
      if (v === '@null') {
        self.datumCode = 'none';
      } else {
        self.nadgrids = v;
      }
    },
    axis: function (v) {
      var legalAxis = 'ewnsud';
      if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
        self.axis = v;
      }
    },
    approx: function () {
      self.approx = true;
    },
    over: function () {
      self.over = true;
    }
  };
  for (paramName in paramObj) {
    paramVal = paramObj[paramName];
    if (paramName in params) {
      paramOutname = params[paramName];
      if (typeof paramOutname === 'function') {
        paramOutname(paramVal);
      } else {
        self[paramOutname] = paramVal;
      }
    } else {
      self[paramName] = paramVal;
    }
  }
  if (typeof self.datumCode === 'string' && self.datumCode !== 'WGS84') {
    self.datumCode = self.datumCode.toLowerCase();
  }
  self['projStr'] = defData;
  return self;
}


/***/ }),

/***/ "./node_modules/proj4/lib/projections.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/projections.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   getNormalizedProjName: () => (/* binding */ getNormalizedProjName),
/* harmony export */   start: () => (/* binding */ start)
/* harmony export */ });
/* harmony import */ var _projections_merc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./projections/merc */ "./node_modules/proj4/lib/projections/merc.js");
/* harmony import */ var _projections_longlat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projections/longlat */ "./node_modules/proj4/lib/projections/longlat.js");


/** @type {Array<Partial<import('./Proj').default>>} */
var projs = [_projections_merc__WEBPACK_IMPORTED_MODULE_0__["default"], _projections_longlat__WEBPACK_IMPORTED_MODULE_1__["default"]];
var names = {};
var projStore = [];

/**
 * @param {import('./Proj').default} proj
 * @param {number} i
 */
function add(proj, i) {
  var len = projStore.length;
  if (!proj.names) {
    console.log(i);
    return true;
  }
  projStore[len] = proj;
  proj.names.forEach(function (n) {
    names[n.toLowerCase()] = len;
  });
  return this;
}

function getNormalizedProjName(n) {
  return n.replace(/[-\(\)\s]+/g, ' ').trim().replace(/ /g, '_');
}

/**
 * Get a projection by name.
 * @param {string} name
 * @returns {import('./Proj').default|false}
 */
function get(name) {
  if (!name) {
    return false;
  }
  var n = name.toLowerCase();
  if (typeof names[n] !== 'undefined' && projStore[names[n]]) {
    return projStore[names[n]];
  }
  n = getNormalizedProjName(n);
  if (n in names && projStore[names[n]]) {
    return projStore[names[n]];
  }
}

function start() {
  projs.forEach(add);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  start: start,
  add: add,
  get: get
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/aea.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/aea.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names),
/* harmony export */   phi1z: () => (/* binding */ phi1z)
/* harmony export */ });
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_qsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/qsfnz */ "./node_modules/proj4/lib/common/qsfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");






/**
 * @typedef {Object} LocalThis
 * @property {number} temp
 * @property {number} es
 * @property {number} e3
 * @property {number} sin_po
 * @property {number} cos_po
 * @property {number} t1
 * @property {number} con
 * @property {number} ms1
 * @property {number} qs1
 * @property {number} t2
 * @property {number} ms2
 * @property {number} qs2
 * @property {number} t3
 * @property {number} qs0
 * @property {number} ns0
 * @property {number} c
 * @property {number} rh
 * @property {number} sin_phi
 * @property {number} cos_phi
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  if (Math.abs(this.lat1 + this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN) {
    return;
  }
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2);
  this.e3 = Math.sqrt(this.es);

  this.sin_po = Math.sin(this.lat1);
  this.cos_po = Math.cos(this.lat1);
  this.t1 = this.sin_po;
  this.con = this.sin_po;
  this.ms1 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e3, this.sin_po, this.cos_po);
  this.qs1 = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_po);

  this.sin_po = Math.sin(this.lat2);
  this.cos_po = Math.cos(this.lat2);
  this.t2 = this.sin_po;
  this.ms2 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e3, this.sin_po, this.cos_po);
  this.qs2 = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_po);

  this.sin_po = Math.sin(this.lat0);
  this.cos_po = Math.cos(this.lat0);
  this.t3 = this.sin_po;
  this.qs0 = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_po);

  if (Math.abs(this.lat1 - this.lat2) > _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN) {
    this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
  } else {
    this.ns0 = this.con;
  }
  this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
  this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
}

/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
  ------------------------------------------------------------------- */
/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function forward(p) {
  var lon = p.x;
  var lat = p.y;

  this.sin_phi = Math.sin(lat);
  this.cos_phi = Math.cos(lat);

  var qs = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_phi);
  var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
  var theta = this.ns0 * (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(lon - this.long0, this.over);
  var x = rh1 * Math.sin(theta) + this.x0;
  var y = this.rh - rh1 * Math.cos(theta) + this.y0;

  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var rh1, qs, con, theta, lon, lat;

  p.x -= this.x0;
  p.y = this.rh - p.y + this.y0;
  if (this.ns0 >= 0) {
    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
    con = 1;
  } else {
    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
    con = -1;
  }
  theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2(con * p.x, con * p.y);
  }
  con = rh1 * this.ns0 / this.a;
  if (this.sphere) {
    lat = Math.asin((this.c - con * con) / (2 * this.ns0));
  } else {
    qs = (this.c - con * con) / this.ns0;
    lat = this.phi1z(this.e3, qs);
  }

  lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(theta / this.ns0 + this.long0, this.over);
  p.x = lon;
  p.y = lat;
  return p;
}

/* Function to compute phi1, the latitude for the inverse of the
   Albers Conical Equal-Area projection.
------------------------------------------- */
function phi1z(eccent, qs) {
  var sinphi, cosphi, con, com, dphi;
  var phi = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_3__["default"])(0.5 * qs);
  if (eccent < _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN) {
    return phi;
  }

  var eccnts = eccent * eccent;
  for (var i = 1; i <= 25; i++) {
    sinphi = Math.sin(phi);
    cosphi = Math.cos(phi);
    con = eccent * sinphi;
    com = 1 - con * con;
    dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
    phi = phi + dphi;
    if (Math.abs(dphi) <= 1e-7) {
      return phi;
    }
  }
  return null;
}

var names = ['Albers_Conic_Equal_Area', 'Albers_Equal_Area', 'Albers', 'aea'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names,
  phi1z: phi1z
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/aeqd.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/aeqd.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _common_imlfn__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/imlfn */ "./node_modules/proj4/lib/common/imlfn.js");
/* harmony import */ var _common_vincenty__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../common/vincenty */ "./node_modules/proj4/lib/common/vincenty.js");











/**
 * @typedef {Object} LocalThis
 * @property {number} es
 * @property {number} sin_p12
 * @property {number} cos_p12
 * @property {number} a
 * @property {number} f
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  this.sin_p12 = Math.sin(this.lat0);
  this.cos_p12 = Math.cos(this.lat0);
  // flattening for ellipsoid
  this.f = this.es / (1 + Math.sqrt(1 - this.es));
}

function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var sinphi = Math.sin(p.y);
  var cosphi = Math.cos(p.y);
  var dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);
  var e0, e1, e2, e3, Mlp, Ml, c, kp, cos_c, vars, azi1;
  if (this.sphere) {
    if (Math.abs(this.sin_p12 - 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      // North Pole case
      p.x = this.x0 + this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI - lat) * Math.sin(dlon);
      p.y = this.y0 - this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI - lat) * Math.cos(dlon);
      return p;
    } else if (Math.abs(this.sin_p12 + 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      // South Pole case
      p.x = this.x0 + this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI + lat) * Math.sin(dlon);
      p.y = this.y0 + this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI + lat) * Math.cos(dlon);
      return p;
    } else {
      // default case
      cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
      c = Math.acos(cos_c);
      kp = c ? c / Math.sin(c) : 1;
      p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
      p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
      return p;
    }
  } else {
    e0 = (0,_common_e0fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
    e1 = (0,_common_e1fn__WEBPACK_IMPORTED_MODULE_4__["default"])(this.es);
    e2 = (0,_common_e2fn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.es);
    e3 = (0,_common_e3fn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.es);
    if (Math.abs(this.sin_p12 - 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      // North Pole case
      Mlp = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI);
      Ml = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, lat);
      p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
      p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
      return p;
    } else if (Math.abs(this.sin_p12 + 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      // South Pole case
      Mlp = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI);
      Ml = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, lat);
      p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
      p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
      return p;
    } else {
      // Default case
      if (Math.abs(lon) < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN && Math.abs(lat - this.lat0) < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
        p.x = p.y = 0;
        return p;
      }
      vars = (0,_common_vincenty__WEBPACK_IMPORTED_MODULE_9__.vincentyInverse)(this.lat0, this.long0, lat, lon, this.a, this.f);
      azi1 = vars.azi1;
      p.x = vars.s12 * Math.sin(azi1);
      p.y = vars.s12 * Math.cos(azi1);
      return p;
    }
  }
}

function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, azi1, s12, vars;
  if (this.sphere) {
    rh = Math.sqrt(p.x * p.x + p.y * p.y);
    if (rh > (2 * _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI * this.a)) {
      return;
    }
    z = rh / this.a;

    sinz = Math.sin(z);
    cosz = Math.cos(z);

    lon = this.long0;
    if (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      lat = this.lat0;
    } else {
      lat = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_7__["default"])(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
      con = Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI;
      if (Math.abs(con) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
        if (this.lat0 >= 0) {
          lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, -p.y), this.over);
        } else {
          lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 - Math.atan2(-p.x, p.y), this.over);
        }
      } else {
        lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz), this.over);
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  } else {
    e0 = (0,_common_e0fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
    e1 = (0,_common_e1fn__WEBPACK_IMPORTED_MODULE_4__["default"])(this.es);
    e2 = (0,_common_e2fn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.es);
    e3 = (0,_common_e3fn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.es);
    if (Math.abs(this.sin_p12 - 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      // North pole case
      Mlp = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI);
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      M = Mlp - rh;
      lat = (0,_common_imlfn__WEBPACK_IMPORTED_MODULE_8__["default"])(M / this.a, e0, e1, e2, e3);
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, -1 * p.y), this.over);
      p.x = lon;
      p.y = lat;
      return p;
    } else if (Math.abs(this.sin_p12 + 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      // South pole case
      Mlp = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI);
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      M = rh - Mlp;

      lat = (0,_common_imlfn__WEBPACK_IMPORTED_MODULE_8__["default"])(M / this.a, e0, e1, e2, e3);
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, p.y), this.over);
      p.x = lon;
      p.y = lat;
      return p;
    } else {
      // default case
      azi1 = Math.atan2(p.x, p.y);
      s12 = Math.sqrt(p.x * p.x + p.y * p.y);
      vars = (0,_common_vincenty__WEBPACK_IMPORTED_MODULE_9__.vincentyDirect)(this.lat0, this.long0, azi1, s12, this.a, this.f);

      p.x = vars.lon2;
      p.y = vars.lat2;
      return p;
    }
  }
}

var names = ['Azimuthal_Equidistant', 'aeqd'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/bonne.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/bonne.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_hypot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/hypot */ "./node_modules/proj4/lib/common/hypot.js");
/* harmony import */ var _common_pj_enfn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/pj_enfn */ "./node_modules/proj4/lib/common/pj_enfn.js");
/* harmony import */ var _common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/pj_inv_mlfn */ "./node_modules/proj4/lib/common/pj_inv_mlfn.js");
/* harmony import */ var _common_pj_mlfn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/pj_mlfn */ "./node_modules/proj4/lib/common/pj_mlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");








/**
 * @typedef {Object} LocalThis
 * @property {number} phi1
 * @property {number} cphi1
 * @property {number} es
 * @property {Array<number>} en
 * @property {number} m1
 * @property {number} am1
 */

var EPS10 = 1e-10;

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  var c;

  this.phi1 = this.lat1;
  if (Math.abs(this.phi1) < EPS10) {
    throw new Error();
  }
  if (this.es) {
    this.en = (0,_common_pj_enfn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
    this.m1 = (0,_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.phi1, this.am1 = Math.sin(this.phi1),
      c = Math.cos(this.phi1), this.en);
    this.am1 = c / (Math.sqrt(1 - this.es * this.am1 * this.am1) * this.am1);
    this.inverse = e_inv;
    this.forward = e_fwd;
  } else {
    if (Math.abs(this.phi1) + EPS10 >= _constants_values__WEBPACK_IMPORTED_MODULE_6__.HALF_PI) {
      this.cphi1 = 0;
    } else {
      this.cphi1 = 1 / Math.tan(this.phi1);
    }
    this.inverse = s_inv;
    this.forward = s_fwd;
  }
}

function e_fwd(p) {
  var lam = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x - (this.long0 || 0), this.over);
  var phi = p.y;
  var rh, E, c;
  rh = this.am1 + this.m1 - (0,_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(phi, E = Math.sin(phi), c = Math.cos(phi), this.en);
  E = c * lam / (rh * Math.sqrt(1 - this.es * E * E));
  p.x = rh * Math.sin(E);
  p.y = this.am1 - rh * Math.cos(E);

  p.x = this.a * p.x + (this.x0 || 0);
  p.y = this.a * p.y + (this.y0 || 0);
  return p;
}

function e_inv(p) {
  p.x = (p.x - (this.x0 || 0)) / this.a;
  p.y = (p.y - (this.y0 || 0)) / this.a;

  var s, rh, lam, phi;
  rh = (0,_common_hypot__WEBPACK_IMPORTED_MODULE_2__["default"])(p.x, p.y = this.am1 - p.y);
  phi = (0,_common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_4__["default"])(this.am1 + this.m1 - rh, this.es, this.en);
  if ((s = Math.abs(phi)) < _constants_values__WEBPACK_IMPORTED_MODULE_6__.HALF_PI) {
    s = Math.sin(phi);
    lam = rh * Math.atan2(p.x, p.y) * Math.sqrt(1 - this.es * s * s) / Math.cos(phi);
  } else if (Math.abs(s - _constants_values__WEBPACK_IMPORTED_MODULE_6__.HALF_PI) <= EPS10) {
    lam = 0;
  } else {
    throw new Error();
  }
  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lam + (this.long0 || 0), this.over);
  p.y = (0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_0__["default"])(phi);
  return p;
}

function s_fwd(p) {
  var lam = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x - (this.long0 || 0), this.over);
  var phi = p.y;
  var E, rh;
  rh = this.cphi1 + this.phi1 - phi;
  if (Math.abs(rh) > EPS10) {
    p.x = rh * Math.sin(E = lam * Math.cos(phi) / rh);
    p.y = this.cphi1 - rh * Math.cos(E);
  } else {
    p.x = p.y = 0;
  }

  p.x = this.a * p.x + (this.x0 || 0);
  p.y = this.a * p.y + (this.y0 || 0);
  return p;
}

function s_inv(p) {
  p.x = (p.x - (this.x0 || 0)) / this.a;
  p.y = (p.y - (this.y0 || 0)) / this.a;

  var lam, phi;
  var rh = (0,_common_hypot__WEBPACK_IMPORTED_MODULE_2__["default"])(p.x, p.y = this.cphi1 - p.y);
  phi = this.cphi1 + this.phi1 - rh;
  if (Math.abs(phi) > _constants_values__WEBPACK_IMPORTED_MODULE_6__.HALF_PI) {
    throw new Error();
  }
  if (Math.abs(Math.abs(phi) - _constants_values__WEBPACK_IMPORTED_MODULE_6__.HALF_PI) <= EPS10) {
    lam = 0;
  } else {
    lam = rh * Math.atan2(p.x, p.y) / Math.cos(phi);
  }
  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lam + (this.long0 || 0), this.over);
  p.y = (0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_0__["default"])(phi);
  return p;
}

var names = ['bonne', 'Bonne (Werner lat_1=90)'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/cass.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/cass.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_gN__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/gN */ "./node_modules/proj4/lib/common/gN.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_imlfn__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/imlfn */ "./node_modules/proj4/lib/common/imlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");











/**
 * @typedef {Object} LocalThis
 * @property {number} es
 * @property {number} e0
 * @property {number} e1
 * @property {number} e2
 * @property {number} e3
 * @property {number} ml0
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  if (!this.sphere) {
    this.e0 = (0,_common_e0fn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.es);
    this.e1 = (0,_common_e1fn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
    this.e2 = (0,_common_e2fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
    this.e3 = (0,_common_e3fn__WEBPACK_IMPORTED_MODULE_4__["default"])(this.es);
    this.ml0 = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat0);
  }
}

/* Cassini forward equations--mapping lat,long to x,y
  ----------------------------------------------------------------------- */
function forward(p) {
  /* Forward equations
      ----------------- */
  var x, y;
  var lam = p.x;
  var phi = p.y;
  lam = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(lam - this.long0, this.over);

  if (this.sphere) {
    x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
    y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
  } else {
    // ellipsoid
    var sinphi = Math.sin(phi);
    var cosphi = Math.cos(phi);
    var nl = (0,_common_gN__WEBPACK_IMPORTED_MODULE_5__["default"])(this.a, this.e, sinphi);
    var tl = Math.tan(phi) * Math.tan(phi);
    var al = lam * Math.cos(phi);
    var asq = al * al;
    var cl = this.es * cosphi * cosphi / (1 - this.es);
    var ml = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e0, this.e1, this.e2, this.e3, phi);

    x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
    y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);
  }

  p.x = x + this.x0;
  p.y = y + this.y0;
  return p;
}

/* Inverse equations
  ----------------- */
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var x = p.x / this.a;
  var y = p.y / this.a;
  var phi, lam;

  if (this.sphere) {
    var dd = y + this.lat0;
    phi = Math.asin(Math.sin(dd) * Math.cos(x));
    lam = Math.atan2(Math.tan(x), Math.cos(dd));
  } else {
    /* ellipsoid */
    var ml1 = this.ml0 / this.a + y;
    var phi1 = (0,_common_imlfn__WEBPACK_IMPORTED_MODULE_8__["default"])(ml1, this.e0, this.e1, this.e2, this.e3);
    if (Math.abs(Math.abs(phi1) - _constants_values__WEBPACK_IMPORTED_MODULE_9__.HALF_PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_9__.EPSLN) {
      p.x = this.long0;
      p.y = _constants_values__WEBPACK_IMPORTED_MODULE_9__.HALF_PI;
      if (y < 0) {
        p.y *= -1;
      }
      return p;
    }
    var nl1 = (0,_common_gN__WEBPACK_IMPORTED_MODULE_5__["default"])(this.a, this.e, Math.sin(phi1));

    var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
    var tl1 = Math.pow(Math.tan(phi1), 2);
    var dl = x * this.a / nl1;
    var dsq = dl * dl;
    phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
    lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);
  }

  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(lam + this.long0, this.over);
  p.y = (0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__["default"])(phi);
  return p;
}

var names = ['Cassini', 'Cassini_Soldner', 'cass'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/cea.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/cea.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_qsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/qsfnz */ "./node_modules/proj4/lib/common/qsfnz.js");
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_iqsfnz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/iqsfnz */ "./node_modules/proj4/lib/common/iqsfnz.js");





/**
 * @typedef {Object} LocalThis
 * @property {number} e
 */

/**
  reference:
    "Cartographic Projection Procedures for the UNIX Environment-
    A User's Manual" by Gerald I. Evenden,
    USGS Open File Report 90-284and Release 4 Interim Reports (2003)
  @this {import('../defs.js').ProjectionDefinition & LocalThis}
*/
function init() {
  // no-op
  if (!this.sphere) {
    this.k0 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
  }
}

/* Cylindrical Equal Area forward equations--mapping lat,long to x,y
    ------------------------------------------------------------ */
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var x, y;
  /* Forward equations
      ----------------- */
  var dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);
  if (this.sphere) {
    x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
    y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
  } else {
    var qs = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, Math.sin(lat));
    x = this.x0 + this.a * this.k0 * dlon;
    y = this.y0 + this.a * qs * 0.5 / this.k0;
  }

  p.x = x;
  p.y = y;
  return p;
}

/* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------ */
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var lon, lat;

  if (this.sphere) {
    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts), this.over);
    lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
  } else {
    lat = (0,_common_iqsfnz__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, 2 * p.y * this.k0 / this.a);
    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + p.x / (this.a * this.k0), this.over);
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['cea'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/eqc.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/eqc.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");



function init() {
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.lat0 = this.lat0 || 0;
  this.long0 = this.long0 || 0;
  this.lat_ts = this.lat_ts || 0;
  this.title = this.title || 'Equidistant Cylindrical (Plate Carre)';

  this.rc = Math.cos(this.lat_ts);
}

// forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function forward(p) {
  var lon = p.x;
  var lat = p.y;

  var dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);
  var dlat = (0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__["default"])(lat - this.lat0);
  p.x = this.x0 + (this.a * dlon * this.rc);
  p.y = this.y0 + (this.a * dlat);
  return p;
}

// inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function inverse(p) {
  var x = p.x;
  var y = p.y;

  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + ((x - this.x0) / (this.a * this.rc)), this.over);
  p.y = (0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__["default"])(this.lat0 + ((y - this.y0) / (this.a)));
  return p;
}

var names = ['Equirectangular', 'Equidistant_Cylindrical', 'Equidistant_Cylindrical_Spherical', 'eqc'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/eqdc.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/eqdc.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_imlfn__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/imlfn */ "./node_modules/proj4/lib/common/imlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");











/**
 * @typedef {Object} LocalThis
 * @property {number} temp
 * @property {number} es
 * @property {number} e
 * @property {number} e0
 * @property {number} e1
 * @property {number} e2
 * @property {number} e3
 * @property {number} sin_phi
 * @property {number} cos_phi
 * @property {number} ms1
 * @property {number} ml1
 * @property {number} ms2
 * @property {number} ml2
 * @property {number} ns
 * @property {number} g
 * @property {number} ml0
 * @property {number} rh
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  /* Place parameters in static storage for common use
      ------------------------------------------------- */
  // Standard Parallels cannot be equal and on opposite sides of the equator
  if (Math.abs(this.lat1 + this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_9__.EPSLN) {
    return;
  }
  this.lat2 = this.lat2 || this.lat1;
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2);
  this.e = Math.sqrt(this.es);
  this.e0 = (0,_common_e0fn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.es);
  this.e1 = (0,_common_e1fn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.es);
  this.e2 = (0,_common_e2fn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
  this.e3 = (0,_common_e3fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);

  this.sin_phi = Math.sin(this.lat1);
  this.cos_phi = Math.cos(this.lat1);

  this.ms1 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, this.sin_phi, this.cos_phi);
  this.ml1 = (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat1);

  if (Math.abs(this.lat1 - this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_9__.EPSLN) {
    this.ns = this.sin_phi;
  } else {
    this.sin_phi = Math.sin(this.lat2);
    this.cos_phi = Math.cos(this.lat2);
    this.ms2 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, this.sin_phi, this.cos_phi);
    this.ml2 = (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat2);
    this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
  }
  this.g = this.ml1 + this.ms1 / this.ns;
  this.ml0 = (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat0);
  this.rh = this.a * (this.g - this.ml0);
}

/* Equidistant Conic forward equations--mapping lat,long to x,y
  ----------------------------------------------------------- */
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var rh1;

  /* Forward equations
      ----------------- */
  if (this.sphere) {
    rh1 = this.a * (this.g - lat);
  } else {
    var ml = (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, lat);
    rh1 = this.a * (this.g - ml);
  }
  var theta = this.ns * (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(lon - this.long0, this.over);
  var x = this.x0 + rh1 * Math.sin(theta);
  var y = this.y0 + this.rh - rh1 * Math.cos(theta);
  p.x = x;
  p.y = y;
  return p;
}

/* Inverse equations
  ----------------- */
function inverse(p) {
  p.x -= this.x0;
  p.y = this.rh - p.y + this.y0;
  var con, rh1, lat, lon;
  if (this.ns >= 0) {
    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
    con = 1;
  } else {
    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
    con = -1;
  }
  var theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2(con * p.x, con * p.y);
  }

  if (this.sphere) {
    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(this.long0 + theta / this.ns, this.over);
    lat = (0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__["default"])(this.g - rh1 / this.a);
    p.x = lon;
    p.y = lat;
    return p;
  } else {
    var ml = this.g - rh1 / this.a;
    lat = (0,_common_imlfn__WEBPACK_IMPORTED_MODULE_8__["default"])(ml, this.e0, this.e1, this.e2, this.e3);
    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(this.long0 + theta / this.ns, this.over);
    p.x = lon;
    p.y = lat;
    return p;
  }
}

var names = ['Equidistant_Conic', 'eqdc'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/eqearth.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/eqearth.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/**
 * Copyright 2018 Bernie Jenny, Monash University, Melbourne, Australia.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Equal Earth is a projection inspired by the Robinson projection, but unlike
 * the Robinson projection retains the relative size of areas. The projection
 * was designed in 2018 by Bojan Savric, Tom Patterson and Bernhard Jenny.
 *
 * Publication:
 * Bojan Savric, Tom Patterson & Bernhard Jenny (2018). The Equal Earth map
 * projection, International Journal of Geographical Information Science,
 * DOI: 10.1080/13658816.2018.1504949
 *
 * Code released August 2018
 * Ported to JavaScript and adapted for mapshaper-proj by Matthew Bloch August 2018
 * Modified for proj4js by Andreas Hocevar by Andreas Hocevar March 2024
 */



var A1 = 1.340264,
  A2 = -0.081106,
  A3 = 0.000893,
  A4 = 0.003796,
  M = Math.sqrt(3) / 2.0;

function init() {
  this.es = 0;
  this.long0 = this.long0 !== undefined ? this.long0 : 0;
  this.x0 = this.x0 !== undefined ? this.x0 : 0;
  this.y0 = this.y0 !== undefined ? this.y0 : 0;
}

function forward(p) {
  var lam = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(p.x - this.long0, this.over);
  var phi = p.y;
  var paramLat = Math.asin(M * Math.sin(phi)),
    paramLatSq = paramLat * paramLat,
    paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;
  p.x = lam * Math.cos(paramLat)
    / (M * (A1 + 3 * A2 * paramLatSq + paramLatPow6 * (7 * A3 + 9 * A4 * paramLatSq)));
  p.y = paramLat * (A1 + A2 * paramLatSq + paramLatPow6 * (A3 + A4 * paramLatSq));

  p.x = this.a * p.x + this.x0;
  p.y = this.a * p.y + this.y0;
  return p;
}

function inverse(p) {
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  var EPS = 1e-9,
    NITER = 12,
    paramLat = p.y,
    paramLatSq, paramLatPow6, fy, fpy, dlat, i;

  for (i = 0; i < NITER; ++i) {
    paramLatSq = paramLat * paramLat;
    paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;
    fy = paramLat * (A1 + A2 * paramLatSq + paramLatPow6 * (A3 + A4 * paramLatSq)) - p.y;
    fpy = A1 + 3 * A2 * paramLatSq + paramLatPow6 * (7 * A3 + 9 * A4 * paramLatSq);
    paramLat -= dlat = fy / fpy;
    if (Math.abs(dlat) < EPS) {
      break;
    }
  }
  paramLatSq = paramLat * paramLat;
  paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;
  p.x = M * p.x * (A1 + 3 * A2 * paramLatSq + paramLatPow6 * (7 * A3 + 9 * A4 * paramLatSq))
    / Math.cos(paramLat);
  p.y = Math.asin(Math.sin(paramLat) / M);

  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(p.x + this.long0, this.over);
  return p;
}

var names = ['eqearth', 'Equal Earth', 'Equal_Earth'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/etmerc.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/etmerc.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projections/tmerc */ "./node_modules/proj4/lib/projections/tmerc.js");
/* harmony import */ var _common_sinh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/sinh */ "./node_modules/proj4/lib/common/sinh.js");
/* harmony import */ var _common_hypot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/hypot */ "./node_modules/proj4/lib/common/hypot.js");
/* harmony import */ var _common_asinhy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/asinhy */ "./node_modules/proj4/lib/common/asinhy.js");
/* harmony import */ var _common_gatg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/gatg */ "./node_modules/proj4/lib/common/gatg.js");
/* harmony import */ var _common_clens__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/clens */ "./node_modules/proj4/lib/common/clens.js");
/* harmony import */ var _common_clens_cmplx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/clens_cmplx */ "./node_modules/proj4/lib/common/clens_cmplx.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
// Heavily based on this etmerc projection implementation
// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/etmerc.js










/**
 * @typedef {Object} LocalThis
 * @property {number} es
 * @property {Array<number>} cbg
 * @property {Array<number>} cgb
 * @property {Array<number>} utg
 * @property {Array<number>} gtu
 * @property {number} Qn
 * @property {number} Zb
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  if (!this.approx && (isNaN(this.es) || this.es <= 0)) {
    throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
  }
  if (this.approx) {
    // When '+approx' is set, use tmerc instead
    _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"].init.apply(this);
    this.forward = _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"].forward;
    this.inverse = _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"].inverse;
  }

  this.x0 = this.x0 !== undefined ? this.x0 : 0;
  this.y0 = this.y0 !== undefined ? this.y0 : 0;
  this.long0 = this.long0 !== undefined ? this.long0 : 0;
  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

  this.cgb = [];
  this.cbg = [];
  this.utg = [];
  this.gtu = [];

  var f = this.es / (1 + Math.sqrt(1 - this.es));
  var n = f / (2 - f);
  var np = n;

  this.cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675))))));
  this.cbg[0] = n * (-2 + n * (2 / 3 + n * (4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));

  np = np * n;
  this.cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
  this.cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * (-13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));

  np = np * n;
  this.cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
  this.cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));

  np = np * n;
  this.cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
  this.cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * (-24832 / 14175)));

  np = np * n;
  this.cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
  this.cbg[4] = np * (-734 / 315 + n * (109598 / 31185));

  np = np * n;
  this.cgb[5] = np * (601676 / 22275);
  this.cbg[5] = np * (444337 / 155925);

  np = Math.pow(n, 2);
  this.Qn = this.k0 / (1 + n) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));

  this.utg[0] = n * (-0.5 + n * (2 / 3 + n * (-37 / 96 + n * (1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
  this.gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));

  this.utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
  this.gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));

  np = np * n;
  this.utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720))));
  this.gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));

  np = np * n;
  this.utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
  this.gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));

  np = np * n;
  this.utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
  this.gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));

  np = np * n;
  this.utg[5] = np * (-20648693 / 638668800);
  this.gtu[5] = np * (212378941 / 319334400);

  var Z = (0,_common_gatg__WEBPACK_IMPORTED_MODULE_4__["default"])(this.cbg, this.lat0);
  this.Zb = -this.Qn * (Z + (0,_common_clens__WEBPACK_IMPORTED_MODULE_5__["default"])(this.gtu, 2 * Z));
}

function forward(p) {
  var Ce = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_7__["default"])(p.x - this.long0, this.over);
  var Cn = p.y;

  Cn = (0,_common_gatg__WEBPACK_IMPORTED_MODULE_4__["default"])(this.cbg, Cn);
  var sin_Cn = Math.sin(Cn);
  var cos_Cn = Math.cos(Cn);
  var sin_Ce = Math.sin(Ce);
  var cos_Ce = Math.cos(Ce);

  Cn = Math.atan2(sin_Cn, cos_Ce * cos_Cn);
  Ce = Math.atan2(sin_Ce * cos_Cn, (0,_common_hypot__WEBPACK_IMPORTED_MODULE_2__["default"])(sin_Cn, cos_Cn * cos_Ce));
  Ce = (0,_common_asinhy__WEBPACK_IMPORTED_MODULE_3__["default"])(Math.tan(Ce));

  var tmp = (0,_common_clens_cmplx__WEBPACK_IMPORTED_MODULE_6__["default"])(this.gtu, 2 * Cn, 2 * Ce);

  Cn = Cn + tmp[0];
  Ce = Ce + tmp[1];

  var x;
  var y;

  if (Math.abs(Ce) <= 2.623395162778) {
    x = this.a * (this.Qn * Ce) + this.x0;
    y = this.a * (this.Qn * Cn + this.Zb) + this.y0;
  } else {
    x = Infinity;
    y = Infinity;
  }

  p.x = x;
  p.y = y;

  return p;
}

function inverse(p) {
  var Ce = (p.x - this.x0) * (1 / this.a);
  var Cn = (p.y - this.y0) * (1 / this.a);

  Cn = (Cn - this.Zb) / this.Qn;
  Ce = Ce / this.Qn;

  var lon;
  var lat;

  if (Math.abs(Ce) <= 2.623395162778) {
    var tmp = (0,_common_clens_cmplx__WEBPACK_IMPORTED_MODULE_6__["default"])(this.utg, 2 * Cn, 2 * Ce);

    Cn = Cn + tmp[0];
    Ce = Ce + tmp[1];
    Ce = Math.atan((0,_common_sinh__WEBPACK_IMPORTED_MODULE_1__["default"])(Ce));

    var sin_Cn = Math.sin(Cn);
    var cos_Cn = Math.cos(Cn);
    var sin_Ce = Math.sin(Ce);
    var cos_Ce = Math.cos(Ce);

    Cn = Math.atan2(sin_Cn * cos_Ce, (0,_common_hypot__WEBPACK_IMPORTED_MODULE_2__["default"])(sin_Ce, cos_Ce * cos_Cn));
    Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);

    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_7__["default"])(Ce + this.long0, this.over);
    lat = (0,_common_gatg__WEBPACK_IMPORTED_MODULE_4__["default"])(this.cgb, Cn);
  } else {
    lon = Infinity;
    lat = Infinity;
  }

  p.x = lon;
  p.y = lat;

  return p;
}

var names = ['Extended_Transverse_Mercator', 'Extended Transverse Mercator', 'etmerc', 'Transverse_Mercator', 'Transverse Mercator', 'Gauss Kruger', 'Gauss_Kruger', 'tmerc'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/gauss.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/gauss.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_srat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/srat */ "./node_modules/proj4/lib/common/srat.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");

var MAX_ITER = 20;


/**
 * @typedef {Object} LocalThis
 * @property {number} rc
 * @property {number} C
 * @property {number} phic0
 * @property {number} ratexp
 * @property {number} K
 * @property {number} e
 * @property {number} es
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  var sphi = Math.sin(this.lat0);
  var cphi = Math.cos(this.lat0);
  cphi *= cphi;
  this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
  this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
  this.phic0 = Math.asin(sphi / this.C);
  this.ratexp = 0.5 * this.C * this.e;
  this.K = Math.tan(0.5 * this.phic0 + _constants_values__WEBPACK_IMPORTED_MODULE_1__.FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + _constants_values__WEBPACK_IMPORTED_MODULE_1__.FORTPI), this.C) * (0,_common_srat__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e * sphi, this.ratexp));
}

function forward(p) {
  var lon = p.x;
  var lat = p.y;

  p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + _constants_values__WEBPACK_IMPORTED_MODULE_1__.FORTPI), this.C) * (0,_common_srat__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e * Math.sin(lat), this.ratexp)) - _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI;
  p.x = this.C * lon;
  return p;
}

function inverse(p) {
  var DEL_TOL = 1e-14;
  var lon = p.x / this.C;
  var lat = p.y;
  var num = Math.pow(Math.tan(0.5 * lat + _constants_values__WEBPACK_IMPORTED_MODULE_1__.FORTPI) / this.K, 1 / this.C);
  for (var i = MAX_ITER; i > 0; --i) {
    lat = 2 * Math.atan(num * (0,_common_srat__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e * Math.sin(p.y), -0.5 * this.e)) - _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI;
    if (Math.abs(lat - p.y) < DEL_TOL) {
      break;
    }
    p.y = lat;
  }
  /* convergence failed */
  if (!i) {
    return null;
  }
  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['gauss'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/geocent.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/geocent.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _datumUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../datumUtils */ "./node_modules/proj4/lib/datumUtils.js");


function init() {
  this.name = 'geocent';
}

function forward(p) {
  var point = (0,_datumUtils__WEBPACK_IMPORTED_MODULE_0__.geodeticToGeocentric)(p, this.es, this.a);
  return point;
}

function inverse(p) {
  var point = (0,_datumUtils__WEBPACK_IMPORTED_MODULE_0__.geocentricToGeodetic)(p, this.es, this.a, this.b);
  return point;
}

var names = ['Geocentric', 'geocentric', 'geocent', 'Geocent'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/geos.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/geos.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_hypot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/hypot */ "./node_modules/proj4/lib/common/hypot.js");


/**
 * @typedef {Object} LocalThis
 * @property {1 | 0} flip_axis
 * @property {number} h
 * @property {number} radius_g_1
 * @property {number} radius_g
 * @property {number} radius_p
 * @property {number} radius_p2
 * @property {number} radius_p_inv2
 * @property {'ellipse'|'sphere'} shape
 * @property {number} C
 * @property {string} sweep
 * @property {number} es
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  this.flip_axis = (this.sweep === 'x' ? 1 : 0);
  this.h = Number(this.h);
  this.radius_g_1 = this.h / this.a;

  if (this.radius_g_1 <= 0 || this.radius_g_1 > 1e10) {
    throw new Error();
  }

  this.radius_g = 1.0 + this.radius_g_1;
  this.C = this.radius_g * this.radius_g - 1.0;

  if (this.es !== 0.0) {
    var one_es = 1.0 - this.es;
    var rone_es = 1 / one_es;

    this.radius_p = Math.sqrt(one_es);
    this.radius_p2 = one_es;
    this.radius_p_inv2 = rone_es;

    this.shape = 'ellipse'; // Use as a condition in the forward and inverse functions.
  } else {
    this.radius_p = 1.0;
    this.radius_p2 = 1.0;
    this.radius_p_inv2 = 1.0;

    this.shape = 'sphere'; // Use as a condition in the forward and inverse functions.
  }

  if (!this.title) {
    this.title = 'Geostationary Satellite View';
  }
}

function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var tmp, v_x, v_y, v_z;
  lon = lon - this.long0;

  if (this.shape === 'ellipse') {
    lat = Math.atan(this.radius_p2 * Math.tan(lat));
    var r = this.radius_p / (0,_common_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(this.radius_p * Math.cos(lat), Math.sin(lat));

    v_x = r * Math.cos(lon) * Math.cos(lat);
    v_y = r * Math.sin(lon) * Math.cos(lat);
    v_z = r * Math.sin(lat);

    if (((this.radius_g - v_x) * v_x - v_y * v_y - v_z * v_z * this.radius_p_inv2) < 0.0) {
      p.x = Number.NaN;
      p.y = Number.NaN;
      return p;
    }

    tmp = this.radius_g - v_x;
    if (this.flip_axis) {
      p.x = this.radius_g_1 * Math.atan(v_y / (0,_common_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(v_z, tmp));
      p.y = this.radius_g_1 * Math.atan(v_z / tmp);
    } else {
      p.x = this.radius_g_1 * Math.atan(v_y / tmp);
      p.y = this.radius_g_1 * Math.atan(v_z / (0,_common_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(v_y, tmp));
    }
  } else if (this.shape === 'sphere') {
    tmp = Math.cos(lat);
    v_x = Math.cos(lon) * tmp;
    v_y = Math.sin(lon) * tmp;
    v_z = Math.sin(lat);
    tmp = this.radius_g - v_x;

    if (this.flip_axis) {
      p.x = this.radius_g_1 * Math.atan(v_y / (0,_common_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(v_z, tmp));
      p.y = this.radius_g_1 * Math.atan(v_z / tmp);
    } else {
      p.x = this.radius_g_1 * Math.atan(v_y / tmp);
      p.y = this.radius_g_1 * Math.atan(v_z / (0,_common_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(v_y, tmp));
    }
  }
  p.x = p.x * this.a;
  p.y = p.y * this.a;
  return p;
}

function inverse(p) {
  var v_x = -1.0;
  var v_y = 0.0;
  var v_z = 0.0;
  var a, b, det, k;

  p.x = p.x / this.a;
  p.y = p.y / this.a;

  if (this.shape === 'ellipse') {
    if (this.flip_axis) {
      v_z = Math.tan(p.y / this.radius_g_1);
      v_y = Math.tan(p.x / this.radius_g_1) * (0,_common_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(1.0, v_z);
    } else {
      v_y = Math.tan(p.x / this.radius_g_1);
      v_z = Math.tan(p.y / this.radius_g_1) * (0,_common_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(1.0, v_y);
    }

    var v_zp = v_z / this.radius_p;
    a = v_y * v_y + v_zp * v_zp + v_x * v_x;
    b = 2 * this.radius_g * v_x;
    det = (b * b) - 4 * a * this.C;

    if (det < 0.0) {
      p.x = Number.NaN;
      p.y = Number.NaN;
      return p;
    }

    k = (-b - Math.sqrt(det)) / (2.0 * a);
    v_x = this.radius_g + k * v_x;
    v_y *= k;
    v_z *= k;

    p.x = Math.atan2(v_y, v_x);
    p.y = Math.atan(v_z * Math.cos(p.x) / v_x);
    p.y = Math.atan(this.radius_p_inv2 * Math.tan(p.y));
  } else if (this.shape === 'sphere') {
    if (this.flip_axis) {
      v_z = Math.tan(p.y / this.radius_g_1);
      v_y = Math.tan(p.x / this.radius_g_1) * Math.sqrt(1.0 + v_z * v_z);
    } else {
      v_y = Math.tan(p.x / this.radius_g_1);
      v_z = Math.tan(p.y / this.radius_g_1) * Math.sqrt(1.0 + v_y * v_y);
    }

    a = v_y * v_y + v_z * v_z + v_x * v_x;
    b = 2 * this.radius_g * v_x;
    det = (b * b) - 4 * a * this.C;
    if (det < 0.0) {
      p.x = Number.NaN;
      p.y = Number.NaN;
      return p;
    }

    k = (-b - Math.sqrt(det)) / (2.0 * a);
    v_x = this.radius_g + k * v_x;
    v_y *= k;
    v_z *= k;

    p.x = Math.atan2(v_y, v_x);
    p.y = Math.atan(v_z * Math.cos(p.x) / v_x);
  }
  p.x = p.x + this.long0;
  return p;
}

var names = ['Geostationary Satellite View', 'Geostationary_Satellite', 'geos'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/gnom.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/gnom.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");




/**
 * @typedef {Object} LocalThis
 * @property {number} sin_p14
 * @property {number} cos_p14
 * @property {number} infinity_dist
 * @property {number} rc
 */

/**
  reference:
    Wolfram Mathworld "Gnomonic Projection"
    http://mathworld.wolfram.com/GnomonicProjection.html
    Accessed: 12th November 2009
   @this {import('../defs.js').ProjectionDefinition & LocalThis}
 */
function init() {
  /* Place parameters in static storage for common use
      ------------------------------------------------- */
  this.sin_p14 = Math.sin(this.lat0);
  this.cos_p14 = Math.cos(this.lat0);
  // Approximation for projecting points to the horizon (infinity)
  this.infinity_dist = 1000 * this.a;
  this.rc = 1;
}

/* Gnomonic forward equations--mapping lat,long to x,y
    --------------------------------------------------- */
function forward(p) {
  var sinphi, cosphi; /* sin and cos value        */
  var dlon; /* delta longitude value      */
  var coslon; /* cos of longitude        */
  var ksp; /* scale factor          */
  var g;
  var x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      ----------------- */
  dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);

  sinphi = Math.sin(lat);
  cosphi = Math.cos(lat);

  coslon = Math.cos(dlon);
  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
  ksp = 1;
  if ((g > 0) || (Math.abs(g) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__.EPSLN)) {
    x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
  } else {
    // Point is in the opposing hemisphere and is unprojectable
    // We still need to return a reasonable point, so we project
    // to infinity, on a bearing
    // equivalent to the northern hemisphere equivalent
    // This is a reasonable approximation for short shapes and lines that
    // straddle the horizon.

    x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
    y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
  }
  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var rh; /* Rho */
  var sinc, cosc;
  var c;
  var lon, lat;

  /* Inverse equations
      ----------------- */
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  p.x /= this.k0;
  p.y /= this.k0;

  if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
    c = Math.atan2(rh, this.rc);
    sinc = Math.sin(c);
    cosc = Math.cos(c);

    lat = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_1__["default"])(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
    lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + lon, this.over);
  } else {
    lat = this.phic0;
    lon = 0;
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['gnom'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/krovak.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/krovak.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");


function init() {
  this.a = 6377397.155;
  this.es = 0.006674372230614;
  this.e = Math.sqrt(this.es);
  if (!this.lat0) {
    this.lat0 = 0.863937979737193;
  }
  if (!this.long0) {
    this.long0 = 0.7417649320975901 - 0.308341501185665;
  }
  /* if scale not set default to 0.9999 */
  if (!this.k0) {
    this.k0 = 0.9999;
  }
  this.s45 = 0.785398163397448; /* 45 */
  this.s90 = 2 * this.s45;
  this.fi0 = this.lat0;
  this.e2 = this.es;
  this.e = Math.sqrt(this.e2);
  this.alfa = Math.sqrt(1 + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1 - this.e2));
  this.uq = 1.04216856380474;
  this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
  this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
  this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
  this.k1 = this.k0;
  this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
  this.s0 = 1.37008346281555;
  this.n = Math.sin(this.s0);
  this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
  this.ad = this.s90 - this.uq;
}

/* ellipsoid */
/* calculate xy from lat/lon */
/* Constants, identical to inverse transform function */
function forward(p) {
  var gfi, u, deltav, s, d, eps, ro;
  var lon = p.x;
  var lat = p.y;
  var delta_lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);
  /* Transformation */
  gfi = Math.pow(((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat))), (this.alfa * this.e / 2));
  u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
  deltav = -delta_lon * this.alfa;
  s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
  d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
  eps = this.n * d;
  ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
  p.y = ro * Math.cos(eps) / 1;
  p.x = ro * Math.sin(eps) / 1;

  if (!this.czech) {
    p.y *= -1;
    p.x *= -1;
  }
  return (p);
}

/* calculate lat/lon from xy */
function inverse(p) {
  var u, deltav, s, d, eps, ro, fi1;
  var ok;

  /* Transformation */
  /* revert y, x */
  var tmp = p.x;
  p.x = p.y;
  p.y = tmp;
  if (!this.czech) {
    p.y *= -1;
    p.x *= -1;
  }
  ro = Math.sqrt(p.x * p.x + p.y * p.y);
  eps = Math.atan2(p.y, p.x);
  d = eps / Math.sin(this.s0);
  s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
  u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
  deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
  p.x = this.long0 - deltav / this.alfa;
  fi1 = u;
  ok = 0;
  var iter = 0;
  do {
    p.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);
    if (Math.abs(fi1 - p.y) < 0.0000000001) {
      ok = 1;
    }
    fi1 = p.y;
    iter += 1;
  } while (ok === 0 && iter < 15);
  if (iter >= 15) {
    return null;
  }

  return (p);
}

var names = ['Krovak', 'krovak'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/laea.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/laea.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EQUIT: () => (/* binding */ EQUIT),
/* harmony export */   N_POLE: () => (/* binding */ N_POLE),
/* harmony export */   OBLIQ: () => (/* binding */ OBLIQ),
/* harmony export */   S_POLE: () => (/* binding */ S_POLE),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_qsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/qsfnz */ "./node_modules/proj4/lib/common/qsfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");





/**
 * @typedef {Object} LocalThis
 * @property {number} mode
 * @property {Array<number>} apa
 * @property {number} dd
 * @property {number} e
 * @property {number} es
 * @property {number} mmf
 * @property {number} rq
 * @property {number} qp
 * @property {number} sinb1
 * @property {number} cosb1
 * @property {number} ymf
 * @property {number} xmf
 * @property {number} sinph0
 * @property {number} cosph0
 */

/*
  reference
    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
  */

var S_POLE = 1;
var N_POLE = 2;
var EQUIT = 3;
var OBLIQ = 4;

/**
 * Initialize the Lambert Azimuthal Equal Area projection
 * @this {import('../defs.js').ProjectionDefinition & LocalThis}
 */
function init() {
  var t = Math.abs(this.lat0);
  if (Math.abs(t - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    this.mode = this.lat0 < 0 ? S_POLE : N_POLE;
  } else if (Math.abs(t) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    this.mode = EQUIT;
  } else {
    this.mode = OBLIQ;
  }
  if (this.es > 0) {
    var sinphi;

    this.qp = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, 1);
    this.mmf = 0.5 / (1 - this.es);
    this.apa = authset(this.es);
    switch (this.mode) {
      case N_POLE:
        this.dd = 1;
        break;
      case S_POLE:
        this.dd = 1;
        break;
      case EQUIT:
        this.rq = Math.sqrt(0.5 * this.qp);
        this.dd = 1 / this.rq;
        this.xmf = 1;
        this.ymf = 0.5 * this.qp;
        break;
      case OBLIQ:
        this.rq = Math.sqrt(0.5 * this.qp);
        sinphi = Math.sin(this.lat0);
        this.sinb1 = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, sinphi) / this.qp;
        this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
        this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
        this.ymf = (this.xmf = this.rq) / this.dd;
        this.xmf *= this.dd;
        break;
    }
  } else {
    if (this.mode === OBLIQ) {
      this.sinph0 = Math.sin(this.lat0);
      this.cosph0 = Math.cos(this.lat0);
    }
  }
}

/* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
  ----------------------------------------------------------------------- */
function forward(p) {
  /* Forward equations
      ----------------- */
  var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
  var lam = p.x;
  var phi = p.y;

  lam = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(lam - this.long0, this.over);
  if (this.sphere) {
    sinphi = Math.sin(phi);
    cosphi = Math.cos(phi);
    coslam = Math.cos(lam);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      y = (this.mode === this.EQUIT) ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
      if (y <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
        return null;
      }
      y = Math.sqrt(2 / y);
      x = y * cosphi * Math.sin(lam);
      y *= (this.mode === this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE) {
        coslam = -coslam;
      }
      if (Math.abs(phi + this.lat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
        return null;
      }
      y = _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI - phi * 0.5;
      y = 2 * ((this.mode === this.S_POLE) ? Math.cos(y) : Math.sin(y));
      x = y * Math.sin(lam);
      y *= coslam;
    }
  } else {
    sinb = 0;
    cosb = 0;
    b = 0;
    coslam = Math.cos(lam);
    sinlam = Math.sin(lam);
    sinphi = Math.sin(phi);
    q = (0,_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, sinphi);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      sinb = q / this.qp;
      cosb = Math.sqrt(1 - sinb * sinb);
    }
    switch (this.mode) {
      case this.OBLIQ:
        b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
        break;
      case this.EQUIT:
        b = 1 + cosb * coslam;
        break;
      case this.N_POLE:
        b = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + phi;
        q = this.qp - q;
        break;
      case this.S_POLE:
        b = phi - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
        q = this.qp + q;
        break;
    }
    if (Math.abs(b) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      return null;
    }
    switch (this.mode) {
      case this.OBLIQ:
      case this.EQUIT:
        b = Math.sqrt(2 / b);
        if (this.mode === this.OBLIQ) {
          y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
        } else {
          y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
        }
        x = this.xmf * b * cosb * sinlam;
        break;
      case this.N_POLE:
      case this.S_POLE:
        if (q >= 0) {
          x = (b = Math.sqrt(q)) * sinlam;
          y = coslam * ((this.mode === this.S_POLE) ? b : -b);
        } else {
          x = y = 0;
        }
        break;
    }
  }

  p.x = this.a * x + this.x0;
  p.y = this.a * y + this.y0;
  return p;
}

/* Inverse equations
  ----------------- */
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var x = p.x / this.a;
  var y = p.y / this.a;
  var lam, phi, cCe, sCe, q, rho, ab;
  if (this.sphere) {
    var cosz = 0,
      rh, sinz = 0;

    rh = Math.sqrt(x * x + y * y);
    phi = rh * 0.5;
    if (phi > 1) {
      return null;
    }
    phi = 2 * Math.asin(phi);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      sinz = Math.sin(phi);
      cosz = Math.cos(phi);
    }
    switch (this.mode) {
      case this.EQUIT:
        phi = (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) ? 0 : Math.asin(y * sinz / rh);
        x *= sinz;
        y = cosz * rh;
        break;
      case this.OBLIQ:
        phi = (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) ? this.lat0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
        x *= sinz * this.cosph0;
        y = (cosz - Math.sin(phi) * this.sinph0) * rh;
        break;
      case this.N_POLE:
        y = -y;
        phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - phi;
        break;
      case this.S_POLE:
        phi -= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
        break;
    }
    lam = (y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ)) ? 0 : Math.atan2(x, y);
  } else {
    ab = 0;
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      x /= this.dd;
      y *= this.dd;
      rho = Math.sqrt(x * x + y * y);
      if (rho < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
        p.x = this.long0;
        p.y = this.lat0;
        return p;
      }
      sCe = 2 * Math.asin(0.5 * rho / this.rq);
      cCe = Math.cos(sCe);
      x *= (sCe = Math.sin(sCe));
      if (this.mode === this.OBLIQ) {
        ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
        q = this.qp * ab;
        y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
      } else {
        ab = y * sCe / rho;
        q = this.qp * ab;
        y = rho * cCe;
      }
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE) {
        y = -y;
      }
      q = (x * x + y * y);
      if (!q) {
        p.x = this.long0;
        p.y = this.lat0;
        return p;
      }
      ab = 1 - q / this.qp;
      if (this.mode === this.S_POLE) {
        ab = -ab;
      }
    }
    lam = Math.atan2(x, y);
    phi = authlat(Math.asin(ab), this.apa);
  }

  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(this.long0 + lam, this.over);
  p.y = phi;
  return p;
}

/* determine latitude from authalic latitude */
var P00 = 0.33333333333333333333;

var P01 = 0.17222222222222222222;
var P02 = 0.10257936507936507936;
var P10 = 0.06388888888888888888;
var P11 = 0.06640211640211640211;
var P20 = 0.01641501294219154443;

function authset(es) {
  var t;
  var APA = [];
  APA[0] = es * P00;
  t = es * es;
  APA[0] += t * P01;
  APA[1] = t * P10;
  t *= es;
  APA[0] += t * P02;
  APA[1] += t * P11;
  APA[2] = t * P20;
  return APA;
}

function authlat(beta, APA) {
  var t = beta + beta;
  return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
}

var names = ['Lambert Azimuthal Equal Area', 'Lambert_Azimuthal_Equal_Area', 'laea'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names,
  S_POLE: S_POLE,
  N_POLE: N_POLE,
  EQUIT: EQUIT,
  OBLIQ: OBLIQ
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/lcc.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/lcc.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_sign__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/sign */ "./node_modules/proj4/lib/common/sign.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");







/**
 * @typedef {Object} LocalThis
 * @property {number} e
 * @property {number} ns
 * @property {number} f0
 * @property {number} rh
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  // double lat0;                    /* the reference latitude               */
  // double long0;                   /* the reference longitude              */
  // double lat1;                    /* first standard parallel              */
  // double lat2;                    /* second standard parallel             */
  // double r_maj;                   /* major axis                           */
  // double r_min;                   /* minor axis                           */
  // double false_east;              /* x offset in meters                   */
  // double false_north;             /* y offset in meters                   */

  // the above value can be set with proj4.defs
  // example: proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

  if (!this.lat2) {
    this.lat2 = this.lat1;
  } // if lat2 is not defined
  if (!this.k0) {
    this.k0 = 1;
  }
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  // Standard Parallels cannot be equal and on opposite sides of the equator
  if (Math.abs(this.lat1 + this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN) {
    return;
  }

  var temp = this.b / this.a;
  this.e = Math.sqrt(1 - temp * temp);

  var sin1 = Math.sin(this.lat1);
  var cos1 = Math.cos(this.lat1);
  var ms1 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, sin1, cos1);
  var ts1 = (0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, this.lat1, sin1);

  var sin2 = Math.sin(this.lat2);
  var cos2 = Math.cos(this.lat2);
  var ms2 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, sin2, cos2);
  var ts2 = (0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, this.lat2, sin2);

  var ts0 = Math.abs(Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_5__.HALF_PI) < _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN
    ? 0 // Handle poles by setting ts0 to 0
    : (0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, this.lat0, Math.sin(this.lat0));

  if (Math.abs(this.lat1 - this.lat2) > _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN) {
    this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
  } else {
    this.ns = sin1;
  }
  if (isNaN(this.ns)) {
    this.ns = sin1;
  }
  this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
  this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
  if (!this.title) {
    this.title = 'Lambert Conformal Conic';
  }
}

// Lambert Conformal conic forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function forward(p) {
  var lon = p.x;
  var lat = p.y;

  // singular cases :
  if (Math.abs(2 * Math.abs(lat) - Math.PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN) {
    lat = (0,_common_sign__WEBPACK_IMPORTED_MODULE_2__["default"])(lat) * (_constants_values__WEBPACK_IMPORTED_MODULE_5__.HALF_PI - 2 * _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN);
  }

  var con = Math.abs(Math.abs(lat) - _constants_values__WEBPACK_IMPORTED_MODULE_5__.HALF_PI);
  var ts, rh1;
  if (con > _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN) {
    ts = (0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, lat, Math.sin(lat));
    rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
  } else {
    con = lat * this.ns;
    if (con <= 0) {
      return null;
    }
    rh1 = 0;
  }
  var theta = this.ns * (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(lon - this.long0, this.over);
  p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
  p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

  return p;
}

// Lambert Conformal Conic inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function inverse(p) {
  var rh1, con, ts;
  var lat, lon;
  var x = (p.x - this.x0) / this.k0;
  var y = (this.rh - (p.y - this.y0) / this.k0);
  if (this.ns > 0) {
    rh1 = Math.sqrt(x * x + y * y);
    con = 1;
  } else {
    rh1 = -Math.sqrt(x * x + y * y);
    con = -1;
  }
  var theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2((con * x), (con * y));
  }
  if ((rh1 !== 0) || (this.ns > 0)) {
    con = 1 / this.ns;
    ts = Math.pow((rh1 / (this.a * this.f0)), con);
    lat = (0,_common_phi2z__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, ts);
    if (lat === -9999) {
      return null;
    }
  } else {
    lat = -_constants_values__WEBPACK_IMPORTED_MODULE_5__.HALF_PI;
  }
  lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(theta / this.ns + this.long0, this.over);

  p.x = lon;
  p.y = lat;
  return p;
}

var names = [
  'Lambert Tangential Conformal Conic Projection',
  'Lambert_Conformal_Conic',
  'Lambert_Conformal_Conic_1SP',
  'Lambert_Conformal_Conic_2SP',
  'lcc',
  'Lambert Conic Conformal (1SP)',
  'Lambert Conic Conformal (2SP)'
];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/longlat.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/longlat.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ identity),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ identity),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
function init() {
  // no-op for longlat
}

function identity(pt) {
  return pt;
}


var names = ['longlat', 'identity'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: identity,
  inverse: identity,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/merc.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/merc.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");







/**
 * @typedef {Object} LocalThis
 * @property {number} es
 * @property {number} e
 * @property {number} k
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  var con = this.b / this.a;
  this.es = 1 - con * con;
  if (!('x0' in this)) {
    this.x0 = 0;
  }
  if (!('y0' in this)) {
    this.y0 = 0;
  }
  this.e = Math.sqrt(this.es);
  if (this.lat_ts) {
    if (this.sphere) {
      this.k0 = Math.cos(this.lat_ts);
    } else {
      this.k0 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
    }
  } else {
    if (!this.k0) {
      if (this.k) {
        this.k0 = this.k;
      } else {
        this.k0 = 1;
      }
    }
  }
}

/* Mercator forward equations--mapping lat,long to x,y
  -------------------------------------------------- */

function forward(p) {
  var lon = p.x;
  var lat = p.y;
  // convert to radians
  if (lat * _constants_values__WEBPACK_IMPORTED_MODULE_4__.R2D > 90 && lat * _constants_values__WEBPACK_IMPORTED_MODULE_4__.R2D < -90 && lon * _constants_values__WEBPACK_IMPORTED_MODULE_4__.R2D > 180 && lon * _constants_values__WEBPACK_IMPORTED_MODULE_4__.R2D < -180) {
    return null;
  }

  var x, y;
  if (Math.abs(Math.abs(lat) - _constants_values__WEBPACK_IMPORTED_MODULE_4__.HALF_PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN) {
    return null;
  } else {
    if (this.sphere) {
      x = this.x0 + this.a * this.k0 * (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lon - this.long0, this.over);
      y = this.y0 + this.a * this.k0 * Math.log(Math.tan(_constants_values__WEBPACK_IMPORTED_MODULE_4__.FORTPI + 0.5 * lat));
    } else {
      var sinphi = Math.sin(lat);
      var ts = (0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, lat, sinphi);
      x = this.x0 + this.a * this.k0 * (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lon - this.long0, this.over);
      y = this.y0 - this.a * this.k0 * Math.log(ts);
    }
    p.x = x;
    p.y = y;
    return p;
  }
}

/* Mercator inverse equations--mapping x,y to lat/long
  -------------------------------------------------- */
function inverse(p) {
  var x = p.x - this.x0;
  var y = p.y - this.y0;
  var lon, lat;

  if (this.sphere) {
    lat = _constants_values__WEBPACK_IMPORTED_MODULE_4__.HALF_PI - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
  } else {
    var ts = Math.exp(-y / (this.a * this.k0));
    lat = (0,_common_phi2z__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, ts);
    if (lat === -9999) {
      return null;
    }
  }
  lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(this.long0 + x / (this.a * this.k0), this.over);

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['Mercator', 'Popular Visualisation Pseudo Mercator', 'Mercator_1SP', 'Mercator_Auxiliary_Sphere', 'Mercator_Variant_A', 'merc'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/mill.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/mill.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");


/*
  reference
    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
  */

/* Initialize the Miller Cylindrical projection
  ------------------------------------------- */
function init() {
  // no-op
}

/* Miller Cylindrical forward equations--mapping lat,long to x,y
    ------------------------------------------------------------ */
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      ----------------- */
  var dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);
  var x = this.x0 + this.a * dlon;
  var y = this.y0 + this.a * Math.log(Math.tan((Math.PI / 4) + (lat / 2.5))) * 1.25;

  p.x = x;
  p.y = y;
  return p;
}

/* Miller Cylindrical inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------ */
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;

  var lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + p.x / this.a, this.over);
  var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['Miller_Cylindrical', 'mill'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/moll.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/moll.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");



/** @this {import('../defs.js').ProjectionDefinition} */
function init() {
  this.x0 = this.x0 !== undefined ? this.x0 : 0;
  this.y0 = this.y0 !== undefined ? this.y0 : 0;
  this.long0 = this.long0 !== undefined ? this.long0 : 0;
}

/* Mollweide forward equations--mapping lat,long to x,y
    ---------------------------------------------------- */
function forward(p) {
  /* Forward equations
      ----------------- */
  var lon = p.x;
  var lat = p.y;

  var delta_lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);
  var theta = lat;
  var con = Math.PI * Math.sin(lat);

  /* Iterate using the Newton-Raphson method to find theta
      ----------------------------------------------------- */
  while (true) {
    var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
    theta += delta_theta;
    if (Math.abs(delta_theta) < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      break;
    }
  }
  theta /= 2;

  /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
       this is done here because of precision problems with "cos(theta)"
       -------------------------------------------------------------------------- */
  if (Math.PI / 2 - Math.abs(lat) < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
    delta_lon = 0;
  }
  var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
  var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var theta;
  var arg;

  /* Inverse equations
      ----------------- */
  p.x -= this.x0;
  p.y -= this.y0;
  arg = p.y / (1.4142135623731 * this.a);

  /* Because of division by zero problems, 'arg' can not be 1.  Therefore
       a number very close to one is used instead.
       ------------------------------------------------------------------- */
  if (Math.abs(arg) > 0.999999999999) {
    arg = 0.999999999999;
  }
  theta = Math.asin(arg);
  var lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))), this.over);
  if (lon < (-Math.PI)) {
    lon = -Math.PI;
  }
  if (lon > Math.PI) {
    lon = Math.PI;
  }
  arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;
  if (Math.abs(arg) > 1) {
    arg = 1;
  }
  var lat = Math.asin(arg);

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['Mollweide', 'moll'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/nzmg.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/nzmg.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   iterations: () => (/* binding */ iterations),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/*
  reference
    Department of Land and Survey Technical Circular 1973/32
      http://www.linz.govt.nz/docs/miscellaneous/nz-map-definition.pdf
    OSG Technical Report 4.1
      http://www.linz.govt.nz/docs/miscellaneous/nzmg.pdf
  */

/**
 * iterations: Number of iterations to refine inverse transform.
 *     0 -> km accuracy
 *     1 -> m accuracy -- suitable for most mapping applications
 *     2 -> mm accuracy
 */
var iterations = 1;

function init() {
  this.A = [];
  this.A[1] = 0.6399175073;
  this.A[2] = -0.1358797613;
  this.A[3] = 0.063294409;
  this.A[4] = -0.02526853;
  this.A[5] = 0.0117879;
  this.A[6] = -0.0055161;
  this.A[7] = 0.0026906;
  this.A[8] = -0.001333;
  this.A[9] = 0.00067;
  this.A[10] = -0.00034;

  this.B_re = [];
  this.B_im = [];
  this.B_re[1] = 0.7557853228;
  this.B_im[1] = 0;
  this.B_re[2] = 0.249204646;
  this.B_im[2] = 0.003371507;
  this.B_re[3] = -0.001541739;
  this.B_im[3] = 0.041058560;
  this.B_re[4] = -0.10162907;
  this.B_im[4] = 0.01727609;
  this.B_re[5] = -0.26623489;
  this.B_im[5] = -0.36249218;
  this.B_re[6] = -0.6870983;
  this.B_im[6] = -1.1651967;

  this.C_re = [];
  this.C_im = [];
  this.C_re[1] = 1.3231270439;
  this.C_im[1] = 0;
  this.C_re[2] = -0.577245789;
  this.C_im[2] = -0.007809598;
  this.C_re[3] = 0.508307513;
  this.C_im[3] = -0.112208952;
  this.C_re[4] = -0.15094762;
  this.C_im[4] = 0.18200602;
  this.C_re[5] = 1.01418179;
  this.C_im[5] = 1.64497696;
  this.C_re[6] = 1.9660549;
  this.C_im[6] = 2.5127645;

  this.D = [];
  this.D[1] = 1.5627014243;
  this.D[2] = 0.5185406398;
  this.D[3] = -0.03333098;
  this.D[4] = -0.1052906;
  this.D[5] = -0.0368594;
  this.D[6] = 0.007317;
  this.D[7] = 0.01220;
  this.D[8] = 0.00394;
  this.D[9] = -0.0013;
}

/**
    New Zealand Map Grid Forward  - long/lat to x/y
    long/lat in radians
  */
function forward(p) {
  var n;
  var lon = p.x;
  var lat = p.y;

  var delta_lat = lat - this.lat0;
  var delta_lon = lon - this.long0;

  // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
  // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
  var d_phi = delta_lat / _constants_values__WEBPACK_IMPORTED_MODULE_0__.SEC_TO_RAD * 1E-5;
  var d_lambda = delta_lon;
  var d_phi_n = 1; // d_phi^0

  var d_psi = 0;
  for (n = 1; n <= 10; n++) {
    d_phi_n = d_phi_n * d_phi;
    d_psi = d_psi + this.A[n] * d_phi_n;
  }

  // 2. Calculate theta
  var th_re = d_psi;
  var th_im = d_lambda;

  // 3. Calculate z
  var th_n_re = 1;
  var th_n_im = 0; // theta^0
  var th_n_re1;
  var th_n_im1;

  var z_re = 0;
  var z_im = 0;
  for (n = 1; n <= 6; n++) {
    th_n_re1 = th_n_re * th_re - th_n_im * th_im;
    th_n_im1 = th_n_im * th_re + th_n_re * th_im;
    th_n_re = th_n_re1;
    th_n_im = th_n_im1;
    z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
    z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
  }

  // 4. Calculate easting and northing
  p.x = (z_im * this.a) + this.x0;
  p.y = (z_re * this.a) + this.y0;

  return p;
}

/**
    New Zealand Map Grid Inverse  -  x/y to long/lat
  */
function inverse(p) {
  var n;
  var x = p.x;
  var y = p.y;

  var delta_x = x - this.x0;
  var delta_y = y - this.y0;

  // 1. Calculate z
  var z_re = delta_y / this.a;
  var z_im = delta_x / this.a;

  // 2a. Calculate theta - first approximation gives km accuracy
  var z_n_re = 1;
  var z_n_im = 0; // z^0
  var z_n_re1;
  var z_n_im1;

  var th_re = 0;
  var th_im = 0;
  for (n = 1; n <= 6; n++) {
    z_n_re1 = z_n_re * z_re - z_n_im * z_im;
    z_n_im1 = z_n_im * z_re + z_n_re * z_im;
    z_n_re = z_n_re1;
    z_n_im = z_n_im1;
    th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
    th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
  }

  // 2b. Iterate to refine the accuracy of the calculation
  //        0 iterations gives km accuracy
  //        1 iteration gives m accuracy -- good enough for most mapping applications
  //        2 iterations bives mm accuracy
  for (var i = 0; i < this.iterations; i++) {
    var th_n_re = th_re;
    var th_n_im = th_im;
    var th_n_re1;
    var th_n_im1;

    var num_re = z_re;
    var num_im = z_im;
    for (n = 2; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
      num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
    }

    th_n_re = 1;
    th_n_im = 0;
    var den_re = this.B_re[1];
    var den_im = this.B_im[1];
    for (n = 2; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
      den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
    }

    // Complex division
    var den2 = den_re * den_re + den_im * den_im;
    th_re = (num_re * den_re + num_im * den_im) / den2;
    th_im = (num_im * den_re - num_re * den_im) / den2;
  }

  // 3. Calculate d_phi              ...                                    // and d_lambda
  var d_psi = th_re;
  var d_lambda = th_im;
  var d_psi_n = 1; // d_psi^0

  var d_phi = 0;
  for (n = 1; n <= 9; n++) {
    d_psi_n = d_psi_n * d_psi;
    d_phi = d_phi + this.D[n] * d_psi_n;
  }

  // 4. Calculate latitude and longitude
  // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
  var lat = this.lat0 + (d_phi * _constants_values__WEBPACK_IMPORTED_MODULE_0__.SEC_TO_RAD * 1E5);
  var lon = this.long0 + d_lambda;

  p.x = lon;
  p.y = lat;

  return p;
}

var names = ['New_Zealand_Map_Grid', 'nzmg'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/ob_tran.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/ob_tran.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _Proj__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Proj */ "./node_modules/proj4/lib/Proj.js");
/* harmony import */ var _longlat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./longlat */ "./node_modules/proj4/lib/projections/longlat.js");





/**
    Original projection implementation:
        https://github.com/OSGeo/PROJ/blob/46c47e9adf6376ae06afabe5d24a0016a05ced82/src/projections/ob_tran.cpp

    Documentation:
        https://proj.org/operations/projections/ob_tran.html

    References/Formulas:
        https://pubs.usgs.gov/pp/1395/report.pdf

    Examples:
        +proj=ob_tran +o_proj=moll +o_lat_p=45 +o_lon_p=-90
        +proj=ob_tran +o_proj=moll +o_lat_p=45 +o_lon_p=-90 +lon_0=60
        +proj=ob_tran +o_proj=moll +o_lat_p=45 +o_lon_p=-90 +lon_0=-90
*/

const projectionType = {
  OBLIQUE: {
    forward: forwardOblique,
    inverse: inverseOblique
  },
  TRANSVERSE: {
    forward: forwardTransverse,
    inverse: inverseTransverse
  }
};

/**
 * @typedef {Object} LocalThis
 * @property {number} lamp
 * @property {number} cphip
 * @property {number} sphip
 * @property {Object} projectionType
 * @property {string | undefined} o_proj
 * @property {string | undefined} o_lon_p
 * @property {string | undefined} o_lat_p
 * @property {string | undefined} o_alpha
 * @property {string | undefined} o_lon_c
 * @property {string | undefined} o_lat_c
 * @property {string | undefined} o_lon_1
 * @property {string | undefined} o_lat_1
 * @property {string | undefined} o_lon_2
 * @property {string | undefined} o_lat_2
 * @property {number | undefined} oLongP
 * @property {number | undefined} oLatP
 * @property {number | undefined} oAlpha
 * @property {number | undefined} oLongC
 * @property {number | undefined} oLatC
 * @property {number | undefined} oLong1
 * @property {number | undefined} oLat1
 * @property {number | undefined} oLong2
 * @property {number | undefined} oLat2
 * @property {boolean} isIdentity
 * @property {import('..').Converter} obliqueProjection
 *
 */

/**
 *    Parameters can be from the following sets:
 *       New pole --> o_lat_p, o_lon_p
 *       Rotate about point --> o_alpha, o_lon_c, o_lat_c
 *       New equator points --> lon_1, lat_1, lon_2, lat_2
 *
 *    Per the original source code, the parameter sets are
 *    checked in the order of the object below.
 */
const paramSets = {
  ROTATE: {
    o_alpha: 'oAlpha',
    o_lon_c: 'oLongC',
    o_lat_c: 'oLatC'
  },
  NEW_POLE: {
    o_lat_p: 'oLatP',
    o_lon_p: 'oLongP'
  },
  NEW_EQUATOR: {
    o_lon_1: 'oLong1',
    o_lat_1: 'oLat1',
    o_lon_2: 'oLong2',
    o_lat_2: 'oLat2'
  }
};

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.long0 = this.long0 || 0;
  this.title = this.title || 'General Oblique Transformation';
  this.isIdentity = _longlat__WEBPACK_IMPORTED_MODULE_3__.names.includes(this.o_proj);

  /** Verify required parameters exist */
  if (!this.o_proj) {
    throw new Error('Missing parameter: o_proj');
  }

  if (this.o_proj === `ob_tran`) {
    throw new Error('Invalid value for o_proj: ' + this.o_proj);
  }

  const newProjStr = this.projStr.replace('+proj=ob_tran', '').replace('+o_proj=', '+proj=').trim();

  /** @type {import('../defs.js').ProjectionDefinition} */
  const oProj = (0,_Proj__WEBPACK_IMPORTED_MODULE_2__["default"])(newProjStr);
  if (!oProj) {
    throw new Error('Invalid parameter: o_proj. Unknown projection ' + this.o_proj);
  }
  oProj.long0 = 0; // we handle long0 before/after forward/inverse
  this.obliqueProjection = oProj;

  let matchedSet;
  const paramSetsKeys = Object.keys(paramSets);

  /**
   * parse strings, convert to radians, throw on NaN
   * @param {string} name
   * @returns {number | undefined}
   */
  const parseParam = (name) => {
    if (typeof this[name] === `undefined`) {
      return undefined;
    }
    const val = parseFloat(this[name]) * _constants_values__WEBPACK_IMPORTED_MODULE_1__.D2R;
    if (isNaN(val)) {
      throw new Error('Invalid value for ' + name + ': ' + this[name]);
    }
    return val;
  };

  for (let i = 0; i < paramSetsKeys.length; i++) {
    const setKey = paramSetsKeys[i];
    const set = paramSets[setKey];
    const params = Object.entries(set);
    const setHasParams = params.some(
      ([p]) => typeof this[p] !== 'undefined'
    );
    if (!setHasParams) {
      continue;
    }
    matchedSet = set;
    for (let ii = 0; ii < params.length; ii++) {
      const [inputParam, param] = params[ii];
      const val = parseParam(inputParam);
      if (typeof val === 'undefined') {
        throw new Error('Missing parameter: ' + inputParam + '.');
      }
      this[param] = val;
    }
    break;
  }

  if (!matchedSet) {
    throw new Error('No valid parameters provided for ob_tran projection.');
  }

  const { lamp, phip } = createRotation(this, matchedSet);
  this.lamp = lamp;

  if (Math.abs(phip) > _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
    this.cphip = Math.cos(phip);
    this.sphip = Math.sin(phip);
    this.projectionType = projectionType.OBLIQUE;
  } else {
    this.projectionType = projectionType.TRANSVERSE;
  }
}

// ob_tran forward equations--mapping (lat,long) to (x,y)
// transverse (90 degrees from normal orientation) - forwardTransverse
// or oblique (arbitrary angle) used based on parameters - forwardOblique
// -----------------------------------------------------------------
/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function forward(p) {
  return this.projectionType.forward(this, p);
}

// inverse equations--mapping (x,y) to (lat,long)
// transverse: inverseTransverse
// oblique: inverseOblique
// -----------------------------------------------------------------
/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function inverse(p) {
  return this.projectionType.inverse(this, p);
}

/**
 * @param {import('../defs.js').ProjectionDefinition & LocalThis} params - Initialized projection definition
 * @param {Object} how - Transformation method
 * @returns {{phip: number, lamp: number}}
 */
function createRotation(params, how) {
  let phip, lamp;
  if (how === paramSets.ROTATE) {
    let lamc = params.oLongC;
    let phic = params.oLatC;
    let alpha = params.oAlpha;
    if (Math.abs(Math.abs(phic) - _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      throw new Error('Invalid value for o_lat_c: ' + params.o_lat_c + ' should be < 90°');
    }
    lamp = lamc + Math.atan2(-1 * Math.cos(alpha), -1 * Math.sin(alpha) * Math.sin(phic));
    phip = Math.asin(Math.cos(phic) * Math.sin(alpha));
  } else if (how === paramSets.NEW_POLE) {
    lamp = params.oLongP;
    phip = params.oLatP;
  } else {
    let lam1 = params.oLong1;
    let phi1 = params.oLat1;
    let lam2 = params.oLong2;
    let phi2 = params.oLat2;
    let con = Math.abs(phi1);

    if (Math.abs(phi1) > _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI - _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      throw new Error('Invalid value for o_lat_1: ' + params.o_lat_1 + ' should be < 90°');
    }

    if (Math.abs(phi2) > _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI - _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      throw new Error('Invalid value for o_lat_2: ' + params.o_lat_2 + ' should be < 90°');
    }

    if (Math.abs(phi1 - phi2) < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      throw new Error('Invalid value for o_lat_1 and o_lat_2: o_lat_1 should be different from o_lat_2');
    }
    if (con < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
      throw new Error('Invalid value for o_lat_1: o_lat_1 should be different from zero');
    }

    lamp = Math.atan2(
      (Math.cos(phi1) * Math.sin(phi2) * Math.cos(lam1))
      - (Math.sin(phi1) * Math.cos(phi2) * Math.cos(lam2)),
      (Math.sin(phi1) * Math.cos(phi2) * Math.sin(lam2))
      - (Math.cos(phi1) * Math.sin(phi2) * Math.sin(lam1))
    );

    phip = Math.atan(-1 * Math.cos(lamp - lam1) / Math.tan(phi1));
  }

  return { lamp, phip };
}

/**
 * Forward (lng, lat) to (x, y) for oblique case
 * @param {import('../defs.js').ProjectionDefinition & LocalThis} self
 * @param {{x: number, y: number}} lp - lambda, phi
 */
function forwardOblique(self, lp) {
  let { x: lam, y: phi } = lp;
  lam += self.long0;
  const coslam = Math.cos(lam);
  const sinphi = Math.sin(phi);
  const cosphi = Math.cos(phi);

  lp.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(
    Math.atan2(
      cosphi * Math.sin(lam),
      (self.sphip * cosphi * coslam) + (self.cphip * sinphi)
    ) + self.lamp
  );
  lp.y = Math.asin(
    (self.sphip * sinphi) - (self.cphip * cosphi * coslam)
  );

  const result = self.obliqueProjection.forward(lp);
  if (self.isIdentity) {
    result.x *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.R2D;
    result.y *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.R2D;
  }
  return result;
}

/**
 * Forward (lng, lat) to (x, y) for transverse case
 * @param {import('../defs.js').ProjectionDefinition & LocalThis} self
 * @param {{x: number, y: number}} lp - lambda, phi
 */
function forwardTransverse(self, lp) {
  let { x: lam, y: phi } = lp;
  lam += self.long0;
  const cosphi = Math.cos(phi);
  const coslam = Math.cos(lam);
  lp.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(
    Math.atan2(
      cosphi * Math.sin(lam),
      Math.sin(phi)
    ) + self.lamp
  );
  lp.y = Math.asin(-1 * cosphi * coslam);

  const result = self.obliqueProjection.forward(lp);

  if (self.isIdentity) {
    result.x *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.R2D;
    result.y *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.R2D;
  }
  return result;
}

/**
 * Inverse (x, y) to (lng, lat) for oblique case
 * @param {import('../defs.js').ProjectionDefinition & LocalThis} self
 * @param {{x: number, y: number}} lp - lambda, phi
 */
function inverseOblique(self, lp) {
  if (self.isIdentity) {
    lp.x *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.D2R;
    lp.y *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.D2R;
  }

  const innerLp = self.obliqueProjection.inverse(lp);
  let { x: lam, y: phi } = innerLp;

  if (lam < Number.MAX_VALUE) {
    lam -= self.lamp;
    const coslam = Math.cos(lam);
    const sinphi = Math.sin(phi);
    const cosphi = Math.cos(phi);
    lp.x = Math.atan2(
      cosphi * Math.sin(lam),
      (self.sphip * cosphi * coslam) - (self.cphip * sinphi)
    );
    lp.y = Math.asin(
      (self.sphip * sinphi) + (self.cphip * cosphi * coslam)
    );
  }

  lp.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lp.x + self.long0);
  return lp;
}

/**
 * Inverse (x, y) to (lng, lat) for transverse case
 * @param {import('../defs.js').ProjectionDefinition & LocalThis} self
 * @param {{x: number, y: number}} lp - lambda, phi
 */
function inverseTransverse(self, lp) {
  if (self.isIdentity) {
    lp.x *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.D2R;
    lp.y *= _constants_values__WEBPACK_IMPORTED_MODULE_1__.D2R;
  }

  const innerLp = self.obliqueProjection.inverse(lp);
  let { x: lam, y: phi } = innerLp;

  if (lam < Number.MAX_VALUE) {
    const cosphi = Math.cos(phi);
    lam -= self.lamp;
    lp.x = Math.atan2(
      cosphi * Math.sin(lam),
      -1 * Math.sin(phi)
    );
    lp.y = Math.asin(
      cosphi * Math.cos(lam)
    );
  }

  lp.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lp.x + self.long0);
  return lp;
}

var names = ['General Oblique Transformation', 'General_Oblique_Transformation', 'ob_tran'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/omerc.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/omerc.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _projections__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../projections */ "./node_modules/proj4/lib/projections.js");






/**
 * @typedef {Object} LocalThis
 * @property {boolean} no_off
 * @property {boolean} no_rot
 * @property {number} rectified_grid_angle
 * @property {number} es
 * @property {number} A
 * @property {number} B
 * @property {number} E
 * @property {number} e
 * @property {number} lam0
 * @property {number} singam
 * @property {number} cosgam
 * @property {number} sinrot
 * @property {number} cosrot
 * @property {number} rB
 * @property {number} ArB
 * @property {number} BrA
 * @property {number} u_0
 * @property {number} v_pole_n
 * @property {number} v_pole_s
 */

var TOL = 1e-7;

function isTypeA(P) {
  var typeAProjections = ['Hotine_Oblique_Mercator', 'Hotine_Oblique_Mercator_variant_A', 'Hotine_Oblique_Mercator_Azimuth_Natural_Origin'];
  var projectionName = typeof P.projName === 'object' ? Object.keys(P.projName)[0] : P.projName;

  return 'no_uoff' in P || 'no_off' in P || typeAProjections.indexOf(projectionName) !== -1 || typeAProjections.indexOf((0,_projections__WEBPACK_IMPORTED_MODULE_4__.getNormalizedProjName)(projectionName)) !== -1;
}

/**
 * Initialize the Oblique Mercator  projection
 * @this {import('../defs.js').ProjectionDefinition & LocalThis}
 */
function init() {
  var con, com, cosph0, D, F, H, L, sinph0, p, J, gamma = 0,
    gamma0, lamc = 0, lam1 = 0, lam2 = 0, phi1 = 0, phi2 = 0, alpha_c = 0;

  // only Type A uses the no_off or no_uoff property
  // https://github.com/OSGeo/proj.4/issues/104
  this.no_off = isTypeA(this);
  this.no_rot = 'no_rot' in this;

  var alp = false;
  if ('alpha' in this) {
    alp = true;
  }

  var gam = false;
  if ('rectified_grid_angle' in this) {
    gam = true;
  }

  if (alp) {
    alpha_c = this.alpha;
  }

  if (gam) {
    gamma = this.rectified_grid_angle;
  }

  if (alp || gam) {
    lamc = this.longc;
  } else {
    lam1 = this.long1;
    phi1 = this.lat1;
    lam2 = this.long2;
    phi2 = this.lat2;

    if (Math.abs(phi1 - phi2) <= TOL || (con = Math.abs(phi1)) <= TOL
      || Math.abs(con - _constants_values__WEBPACK_IMPORTED_MODULE_3__.HALF_PI) <= TOL || Math.abs(Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_3__.HALF_PI) <= TOL
      || Math.abs(Math.abs(phi2) - _constants_values__WEBPACK_IMPORTED_MODULE_3__.HALF_PI) <= TOL) {
      throw new Error();
    }
  }

  var one_es = 1.0 - this.es;
  com = Math.sqrt(one_es);

  if (Math.abs(this.lat0) > _constants_values__WEBPACK_IMPORTED_MODULE_3__.EPSLN) {
    sinph0 = Math.sin(this.lat0);
    cosph0 = Math.cos(this.lat0);
    con = 1 - this.es * sinph0 * sinph0;
    this.B = cosph0 * cosph0;
    this.B = Math.sqrt(1 + this.es * this.B * this.B / one_es);
    this.A = this.B * this.k0 * com / con;
    D = this.B * com / (cosph0 * Math.sqrt(con));
    F = D * D - 1;

    if (F <= 0) {
      F = 0;
    } else {
      F = Math.sqrt(F);
      if (this.lat0 < 0) {
        F = -F;
      }
    }

    this.E = F += D;
    this.E *= Math.pow((0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, this.lat0, sinph0), this.B);
  } else {
    this.B = 1 / com;
    this.A = this.k0;
    this.E = D = F = 1;
  }

  if (alp || gam) {
    if (alp) {
      gamma0 = Math.asin(Math.sin(alpha_c) / D);
      if (!gam) {
        gamma = alpha_c;
      }
    } else {
      gamma0 = gamma;
      alpha_c = Math.asin(D * Math.sin(gamma0));
    }
    this.lam0 = lamc - Math.asin(0.5 * (F - 1 / F) * Math.tan(gamma0)) / this.B;
  } else {
    H = Math.pow((0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, phi1, Math.sin(phi1)), this.B);
    L = Math.pow((0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, phi2, Math.sin(phi2)), this.B);
    F = this.E / H;
    p = (L - H) / (L + H);
    J = this.E * this.E;
    J = (J - L * H) / (J + L * H);
    con = lam1 - lam2;

    if (con < -Math.PI) {
      lam2 -= _constants_values__WEBPACK_IMPORTED_MODULE_3__.TWO_PI;
    } else if (con > Math.PI) {
      lam2 += _constants_values__WEBPACK_IMPORTED_MODULE_3__.TWO_PI;
    }

    this.lam0 = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(0.5 * (lam1 + lam2) - Math.atan(J * Math.tan(0.5 * this.B * (lam1 - lam2)) / p) / this.B, this.over);
    gamma0 = Math.atan(2 * Math.sin(this.B * (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lam1 - this.lam0, this.over)) / (F - 1 / F));
    gamma = alpha_c = Math.asin(D * Math.sin(gamma0));
  }

  this.singam = Math.sin(gamma0);
  this.cosgam = Math.cos(gamma0);
  this.sinrot = Math.sin(gamma);
  this.cosrot = Math.cos(gamma);

  this.rB = 1 / this.B;
  this.ArB = this.A * this.rB;
  this.BrA = 1 / this.ArB;

  if (this.no_off) {
    this.u_0 = 0;
  } else {
    this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(D * D - 1) / Math.cos(alpha_c)));

    if (this.lat0 < 0) {
      this.u_0 = -this.u_0;
    }
  }

  F = 0.5 * gamma0;
  this.v_pole_n = this.ArB * Math.log(Math.tan(_constants_values__WEBPACK_IMPORTED_MODULE_3__.FORTPI - F));
  this.v_pole_s = this.ArB * Math.log(Math.tan(_constants_values__WEBPACK_IMPORTED_MODULE_3__.FORTPI + F));
}

/* Oblique Mercator forward equations--mapping lat,long to x,y
    ---------------------------------------------------------- */
function forward(p) {
  var coords = {};
  var S, T, U, V, W, temp, u, v;
  p.x = p.x - this.lam0;

  if (Math.abs(Math.abs(p.y) - _constants_values__WEBPACK_IMPORTED_MODULE_3__.HALF_PI) > _constants_values__WEBPACK_IMPORTED_MODULE_3__.EPSLN) {
    W = this.E / Math.pow((0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, p.y, Math.sin(p.y)), this.B);

    temp = 1 / W;
    S = 0.5 * (W - temp);
    T = 0.5 * (W + temp);
    V = Math.sin(this.B * p.x);
    U = (S * this.singam - V * this.cosgam) / T;

    if (Math.abs(Math.abs(U) - 1.0) < _constants_values__WEBPACK_IMPORTED_MODULE_3__.EPSLN) {
      throw new Error();
    }

    v = 0.5 * this.ArB * Math.log((1 - U) / (1 + U));
    temp = Math.cos(this.B * p.x);

    if (Math.abs(temp) < TOL) {
      u = this.A * p.x;
    } else {
      u = this.ArB * Math.atan2((S * this.cosgam + V * this.singam), temp);
    }
  } else {
    v = p.y > 0 ? this.v_pole_n : this.v_pole_s;
    u = this.ArB * p.y;
  }

  if (this.no_rot) {
    coords.x = u;
    coords.y = v;
  } else {
    u -= this.u_0;
    coords.x = v * this.cosrot + u * this.sinrot;
    coords.y = u * this.cosrot - v * this.sinrot;
  }

  coords.x = (this.a * coords.x + this.x0);
  coords.y = (this.a * coords.y + this.y0);

  return coords;
}

function inverse(p) {
  var u, v, Qp, Sp, Tp, Vp, Up;
  var coords = {};

  p.x = (p.x - this.x0) * (1.0 / this.a);
  p.y = (p.y - this.y0) * (1.0 / this.a);

  if (this.no_rot) {
    v = p.y;
    u = p.x;
  } else {
    v = p.x * this.cosrot - p.y * this.sinrot;
    u = p.y * this.cosrot + p.x * this.sinrot + this.u_0;
  }

  Qp = Math.exp(-this.BrA * v);
  Sp = 0.5 * (Qp - 1 / Qp);
  Tp = 0.5 * (Qp + 1 / Qp);
  Vp = Math.sin(this.BrA * u);
  Up = (Vp * this.cosgam + Sp * this.singam) / Tp;

  if (Math.abs(Math.abs(Up) - 1) < _constants_values__WEBPACK_IMPORTED_MODULE_3__.EPSLN) {
    coords.x = 0;
    coords.y = Up < 0 ? -_constants_values__WEBPACK_IMPORTED_MODULE_3__.HALF_PI : _constants_values__WEBPACK_IMPORTED_MODULE_3__.HALF_PI;
  } else {
    coords.y = this.E / Math.sqrt((1 + Up) / (1 - Up));
    coords.y = (0,_common_phi2z__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, Math.pow(coords.y, 1 / this.B));

    if (coords.y === Infinity) {
      throw new Error();
    }

    coords.x = -this.rB * Math.atan2((Sp * this.cosgam - Vp * this.singam), Math.cos(this.BrA * u));
  }

  coords.x += this.lam0;

  return coords;
}

var names = ['Hotine_Oblique_Mercator', 'Hotine Oblique Mercator', 'Hotine_Oblique_Mercator_variant_A', 'Hotine_Oblique_Mercator_Variant_B', 'Hotine_Oblique_Mercator_Azimuth_Natural_Origin', 'Hotine_Oblique_Mercator_Two_Point_Natural_Origin', 'Hotine_Oblique_Mercator_Azimuth_Center', 'Oblique_Mercator', 'omerc'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/ortho.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/ortho.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");




/**
 * @typedef {Object} LocalThis
 * @property {number} sin_p14
 * @property {number} cos_p14
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  // double temp;      /* temporary variable    */

  /* Place parameters in static storage for common use
      ------------------------------------------------- */
  this.sin_p14 = Math.sin(this.lat0);
  this.cos_p14 = Math.cos(this.lat0);
}

/* Orthographic forward equations--mapping lat,long to x,y
    --------------------------------------------------- */
function forward(p) {
  var sinphi, cosphi; /* sin and cos value        */
  var dlon; /* delta longitude value      */
  var coslon; /* cos of longitude        */
  var ksp; /* scale factor          */
  var g, x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      ----------------- */
  dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);

  sinphi = Math.sin(lat);
  cosphi = Math.cos(lat);

  coslon = Math.cos(dlon);
  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
  ksp = 1;
  if ((g > 0) || (Math.abs(g) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__.EPSLN)) {
    x = this.a * ksp * cosphi * Math.sin(dlon);
    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
  }
  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var rh; /* height above ellipsoid      */
  var z; /* angle          */
  var sinz, cosz; /* sin of z and cos of z      */
  var con;
  var lon, lat;
  /* Inverse equations
      ----------------- */
  p.x -= this.x0;
  p.y -= this.y0;
  rh = Math.sqrt(p.x * p.x + p.y * p.y);
  z = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_1__["default"])(rh / this.a);

  sinz = Math.sin(z);
  cosz = Math.cos(z);

  lon = this.long0;
  if (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__.EPSLN) {
    lat = this.lat0;
    p.x = lon;
    p.y = lat;
    return p;
  }
  lat = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_1__["default"])(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14) / rh);
  con = Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_2__.HALF_PI;
  if (Math.abs(con) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__.EPSLN) {
    if (this.lat0 >= 0) {
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, -p.y), this.over);
    } else {
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 - Math.atan2(-p.x, p.y), this.over);
    }
    p.x = lon;
    p.y = lat;
    return p;
  }
  lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2((p.x * sinz), rh * this.cos_p14 * cosz - p.y * this.sin_p14 * sinz), this.over);
  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['ortho'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/poly.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/poly.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_gN__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/gN */ "./node_modules/proj4/lib/common/gN.js");











/**
 * @typedef {Object} LocalThis
 * @property {number} temp
 * @property {number} es
 * @property {number} e
 * @property {number} e0
 * @property {number} e1
 * @property {number} e2
 * @property {number} e3
 * @property {number} ml0
 */

var MAX_ITER = 20;

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  /* Place parameters in static storage for common use
      ------------------------------------------------- */
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
  this.e = Math.sqrt(this.es);
  this.e0 = (0,_common_e0fn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.es);
  this.e1 = (0,_common_e1fn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.es);
  this.e2 = (0,_common_e2fn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
  this.e3 = (0,_common_e3fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
  this.ml0 = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat0); // si que des zeros le calcul ne se fait pas
}

/* Polyconic forward equations--mapping lat,long to x,y
    --------------------------------------------------- */
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var x, y, el;
  var dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(lon - this.long0, this.over);
  el = dlon * Math.sin(lat);
  if (this.sphere) {
    if (Math.abs(lat) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__.EPSLN) {
      x = this.a * dlon;
      y = -1 * this.a * this.lat0;
    } else {
      x = this.a * Math.sin(el) / Math.tan(lat);
      y = this.a * ((0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_5__["default"])(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
    }
  } else {
    if (Math.abs(lat) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__.EPSLN) {
      x = this.a * dlon;
      y = -1 * this.ml0;
    } else {
      var nl = (0,_common_gN__WEBPACK_IMPORTED_MODULE_8__["default"])(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
      x = nl * Math.sin(el);
      y = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
    }
  }
  p.x = x + this.x0;
  p.y = y + this.y0;
  return p;
}

/* Inverse equations
  ----------------- */
function inverse(p) {
  var lon, lat, x, y, i;
  var al, bl;
  var phi, dphi;
  x = p.x - this.x0;
  y = p.y - this.y0;

  if (this.sphere) {
    if (Math.abs(y + this.a * this.lat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__.EPSLN) {
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(x / this.a + this.long0, this.over);
      lat = 0;
    } else {
      al = this.lat0 + y / this.a;
      bl = x * x / this.a / this.a + al * al;
      phi = al;
      var tanphi;
      for (i = MAX_ITER; i; --i) {
        tanphi = Math.tan(phi);
        dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
        phi += dphi;
        if (Math.abs(dphi) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__.EPSLN) {
          lat = phi;
          break;
        }
      }
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat), this.over);
    }
  } else {
    if (Math.abs(y + this.ml0) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__.EPSLN) {
      lat = 0;
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(this.long0 + x / this.a, this.over);
    } else {
      al = (this.ml0 + y) / this.a;
      bl = x * x / this.a / this.a + al * al;
      phi = al;
      var cl, mln, mlnp, ma;
      var con;
      for (i = MAX_ITER; i; --i) {
        con = this.e * Math.sin(phi);
        cl = Math.sqrt(1 - con * con) * Math.tan(phi);
        mln = this.a * (0,_common_mlfn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.e0, this.e1, this.e2, this.e3, phi);
        mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
        ma = mln / this.a;
        dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
        phi -= dphi;
        if (Math.abs(dphi) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__.EPSLN) {
          lat = phi;
          break;
        }
      }

      // lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
      cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat), this.over);
    }
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['Polyconic', 'American_Polyconic', 'poly'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/qsc.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/qsc.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
// QSC projection rewritten from the original PROJ4
// https://github.com/OSGeo/proj.4/blob/master/src/PJ_qsc.c



/**
 * @typedef {Object} LocalThis
 * @property {number} face
 * @property {number} x0
 * @property {number} y0
 * @property {number} es
 * @property {number} one_minus_f
 * @property {number} one_minus_f_squared
 */

/* constants */
var FACE_ENUM = {
  FRONT: 1,
  RIGHT: 2,
  BACK: 3,
  LEFT: 4,
  TOP: 5,
  BOTTOM: 6
};

var AREA_ENUM = {
  AREA_0: 1,
  AREA_1: 2,
  AREA_2: 3,
  AREA_3: 4
};

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.lat0 = this.lat0 || 0;
  this.long0 = this.long0 || 0;
  this.lat_ts = this.lat_ts || 0;
  this.title = this.title || 'Quadrilateralized Spherical Cube';

  /* Determine the cube face from the center of projection. */
  if (this.lat0 >= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI / 2.0) {
    this.face = FACE_ENUM.TOP;
  } else if (this.lat0 <= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI / 2.0)) {
    this.face = FACE_ENUM.BOTTOM;
  } else if (Math.abs(this.long0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
    this.face = FACE_ENUM.FRONT;
  } else if (Math.abs(this.long0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
    this.face = this.long0 > 0.0 ? FACE_ENUM.RIGHT : FACE_ENUM.LEFT;
  } else {
    this.face = FACE_ENUM.BACK;
  }

  /* Fill in useful values for the ellipsoid <-> sphere shift
   * described in [LK12]. */
  if (this.es !== 0) {
    this.one_minus_f = 1 - (this.a - this.b) / this.a;
    this.one_minus_f_squared = this.one_minus_f * this.one_minus_f;
  }
}

// QSC forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function forward(p) {
  var xy = { x: 0, y: 0 };
  var lat, lon;
  var theta, phi;
  var t, mu;
  /* nu; */
  var area = { value: 0 };

  // move lon according to projection's lon
  p.x -= this.long0;

  /* Convert the geodetic latitude to a geocentric latitude.
   * This corresponds to the shift from the ellipsoid to the sphere
   * described in [LK12]. */
  if (this.es !== 0) { // if (P->es != 0) {
    lat = Math.atan(this.one_minus_f_squared * Math.tan(p.y));
  } else {
    lat = p.y;
  }

  /* Convert the input lat, lon into theta, phi as used by QSC.
   * This depends on the cube face and the area on it.
   * For the top and bottom face, we can compute theta and phi
   * directly from phi, lam. For the other faces, we must use
   * unit sphere cartesian coordinates as an intermediate step. */
  lon = p.x; // lon = lp.lam;
  if (this.face === FACE_ENUM.TOP) {
    phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - lat;
    if (lon >= _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI && lon <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
      area.value = AREA_ENUM.AREA_0;
      theta = lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else if (lon > _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI || lon <= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI)) {
      area.value = AREA_ENUM.AREA_1;
      theta = (lon > 0.0 ? lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI : lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
    } else if (lon > -(_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) && lon <= -_constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
      area.value = AREA_ENUM.AREA_2;
      theta = lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else {
      area.value = AREA_ENUM.AREA_3;
      theta = lon;
    }
  } else if (this.face === FACE_ENUM.BOTTOM) {
    phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + lat;
    if (lon >= _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI && lon <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
      area.value = AREA_ENUM.AREA_0;
      theta = -lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else if (lon < _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI && lon >= -_constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
      area.value = AREA_ENUM.AREA_1;
      theta = -lon;
    } else if (lon < -_constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI && lon >= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI)) {
      area.value = AREA_ENUM.AREA_2;
      theta = -lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else {
      area.value = AREA_ENUM.AREA_3;
      theta = (lon > 0.0 ? -lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI : -lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
    }
  } else {
    var q, r, s;
    var sinlat, coslat;
    var sinlon, coslon;

    if (this.face === FACE_ENUM.RIGHT) {
      lon = qsc_shift_lon_origin(lon, +_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI);
    } else if (this.face === FACE_ENUM.BACK) {
      lon = qsc_shift_lon_origin(lon, +_constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
    } else if (this.face === FACE_ENUM.LEFT) {
      lon = qsc_shift_lon_origin(lon, -_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI);
    }
    sinlat = Math.sin(lat);
    coslat = Math.cos(lat);
    sinlon = Math.sin(lon);
    coslon = Math.cos(lon);
    q = coslat * coslon;
    r = coslat * sinlon;
    s = sinlat;

    if (this.face === FACE_ENUM.FRONT) {
      phi = Math.acos(q);
      theta = qsc_fwd_equat_face_theta(phi, s, r, area);
    } else if (this.face === FACE_ENUM.RIGHT) {
      phi = Math.acos(r);
      theta = qsc_fwd_equat_face_theta(phi, s, -q, area);
    } else if (this.face === FACE_ENUM.BACK) {
      phi = Math.acos(-q);
      theta = qsc_fwd_equat_face_theta(phi, s, -r, area);
    } else if (this.face === FACE_ENUM.LEFT) {
      phi = Math.acos(-r);
      theta = qsc_fwd_equat_face_theta(phi, s, q, area);
    } else {
      /* Impossible */
      phi = theta = 0;
      area.value = AREA_ENUM.AREA_0;
    }
  }

  /* Compute mu and nu for the area of definition.
   * For mu, see Eq. (3-21) in [OL76], but note the typos:
   * compare with Eq. (3-14). For nu, see Eq. (3-38). */
  mu = Math.atan((12 / _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI) * (theta + Math.acos(Math.sin(theta) * Math.cos(_constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI)) - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI));
  t = Math.sqrt((1 - Math.cos(phi)) / (Math.cos(mu) * Math.cos(mu)) / (1 - Math.cos(Math.atan(1 / Math.cos(theta)))));

  /* Apply the result to the real area. */
  if (area.value === AREA_ENUM.AREA_1) {
    mu += _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
  } else if (area.value === AREA_ENUM.AREA_2) {
    mu += _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI;
  } else if (area.value === AREA_ENUM.AREA_3) {
    mu += 1.5 * _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI;
  }

  /* Now compute x, y from mu and nu */
  xy.x = t * Math.cos(mu);
  xy.y = t * Math.sin(mu);
  xy.x = xy.x * this.a + this.x0;
  xy.y = xy.y * this.a + this.y0;

  p.x = xy.x;
  p.y = xy.y;
  return p;
}

// QSC inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function inverse(p) {
  var lp = { lam: 0, phi: 0 };
  var mu, nu, cosmu, tannu;
  var tantheta, theta, cosphi, phi;
  var t;
  var area = { value: 0 };

  /* de-offset */
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  /* Convert the input x, y to the mu and nu angles as used by QSC.
   * This depends on the area of the cube face. */
  nu = Math.atan(Math.sqrt(p.x * p.x + p.y * p.y));
  mu = Math.atan2(p.y, p.x);
  if (p.x >= 0.0 && p.x >= Math.abs(p.y)) {
    area.value = AREA_ENUM.AREA_0;
  } else if (p.y >= 0.0 && p.y >= Math.abs(p.x)) {
    area.value = AREA_ENUM.AREA_1;
    mu -= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
  } else if (p.x < 0.0 && -p.x >= Math.abs(p.y)) {
    area.value = AREA_ENUM.AREA_2;
    mu = (mu < 0.0 ? mu + _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI : mu - _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
  } else {
    area.value = AREA_ENUM.AREA_3;
    mu += _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
  }

  /* Compute phi and theta for the area of definition.
   * The inverse projection is not described in the original paper, but some
   * good hints can be found here (as of 2011-12-14):
   * http://fits.gsfc.nasa.gov/fitsbits/saf.93/saf.9302
   * (search for "Message-Id: <9302181759.AA25477 at fits.cv.nrao.edu>") */
  t = (_constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI / 12) * Math.tan(mu);
  tantheta = Math.sin(t) / (Math.cos(t) - (1 / Math.sqrt(2)));
  theta = Math.atan(tantheta);
  cosmu = Math.cos(mu);
  tannu = Math.tan(nu);
  cosphi = 1 - cosmu * cosmu * tannu * tannu * (1 - Math.cos(Math.atan(1 / Math.cos(theta))));
  if (cosphi < -1) {
    cosphi = -1;
  } else if (cosphi > +1) {
    cosphi = +1;
  }

  /* Apply the result to the real area on the cube face.
   * For the top and bottom face, we can compute phi and lam directly.
   * For the other faces, we must use unit sphere cartesian coordinates
   * as an intermediate step. */
  if (this.face === FACE_ENUM.TOP) {
    phi = Math.acos(cosphi);
    lp.phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI - phi;
    if (area.value === AREA_ENUM.AREA_0) {
      lp.lam = theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else if (area.value === AREA_ENUM.AREA_1) {
      lp.lam = (theta < 0.0 ? theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI : theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
    } else if (area.value === AREA_ENUM.AREA_2) {
      lp.lam = theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else /* area.value == AREA_ENUM.AREA_3 */ {
      lp.lam = theta;
    }
  } else if (this.face === FACE_ENUM.BOTTOM) {
    phi = Math.acos(cosphi);
    lp.phi = phi - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    if (area.value === AREA_ENUM.AREA_0) {
      lp.lam = -theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else if (area.value === AREA_ENUM.AREA_1) {
      lp.lam = -theta;
    } else if (area.value === AREA_ENUM.AREA_2) {
      lp.lam = -theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else /* area.value == AREA_ENUM.AREA_3 */ {
      lp.lam = (theta < 0.0 ? -theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI : -theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
    }
  } else {
    /* Compute phi and lam via cartesian unit sphere coordinates. */
    var q, r, s;
    q = cosphi;
    t = q * q;
    if (t >= 1) {
      s = 0;
    } else {
      s = Math.sqrt(1 - t) * Math.sin(theta);
    }
    t += s * s;
    if (t >= 1) {
      r = 0;
    } else {
      r = Math.sqrt(1 - t);
    }
    /* Rotate q,r,s into the correct area. */
    if (area.value === AREA_ENUM.AREA_1) {
      t = r;
      r = -s;
      s = t;
    } else if (area.value === AREA_ENUM.AREA_2) {
      r = -r;
      s = -s;
    } else if (area.value === AREA_ENUM.AREA_3) {
      t = r;
      r = s;
      s = -t;
    }
    /* Rotate q,r,s into the correct cube face. */
    if (this.face === FACE_ENUM.RIGHT) {
      t = q;
      q = -r;
      r = t;
    } else if (this.face === FACE_ENUM.BACK) {
      q = -q;
      r = -r;
    } else if (this.face === FACE_ENUM.LEFT) {
      t = q;
      q = r;
      r = -t;
    }
    /* Now compute phi and lam from the unit sphere coordinates. */
    lp.phi = Math.acos(-s) - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    lp.lam = Math.atan2(r, q);
    if (this.face === FACE_ENUM.RIGHT) {
      lp.lam = qsc_shift_lon_origin(lp.lam, -_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI);
    } else if (this.face === FACE_ENUM.BACK) {
      lp.lam = qsc_shift_lon_origin(lp.lam, -_constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
    } else if (this.face === FACE_ENUM.LEFT) {
      lp.lam = qsc_shift_lon_origin(lp.lam, +_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI);
    }
  }

  /* Apply the shift from the sphere to the ellipsoid as described
   * in [LK12]. */
  if (this.es !== 0) {
    var invert_sign;
    var tanphi, xa;
    invert_sign = (lp.phi < 0 ? 1 : 0);
    tanphi = Math.tan(lp.phi);
    xa = this.b / Math.sqrt(tanphi * tanphi + this.one_minus_f_squared);
    lp.phi = Math.atan(Math.sqrt(this.a * this.a - xa * xa) / (this.one_minus_f * xa));
    if (invert_sign) {
      lp.phi = -lp.phi;
    }
  }

  lp.lam += this.long0;
  p.x = lp.lam;
  p.y = lp.phi;
  return p;
}

/* Helper function for forward projection: compute the theta angle
 * and determine the area number. */
function qsc_fwd_equat_face_theta(phi, y, x, area) {
  var theta;
  if (phi < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    area.value = AREA_ENUM.AREA_0;
    theta = 0.0;
  } else {
    theta = Math.atan2(y, x);
    if (Math.abs(theta) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
      area.value = AREA_ENUM.AREA_0;
    } else if (theta > _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI && theta <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI) {
      area.value = AREA_ENUM.AREA_1;
      theta -= _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    } else if (theta > _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI || theta <= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + _constants_values__WEBPACK_IMPORTED_MODULE_0__.FORTPI)) {
      area.value = AREA_ENUM.AREA_2;
      theta = (theta >= 0.0 ? theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI : theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI);
    } else {
      area.value = AREA_ENUM.AREA_3;
      theta += _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    }
  }
  return theta;
}

/* Helper function: shift the longitude. */
function qsc_shift_lon_origin(lon, offset) {
  var slon = lon + offset;
  if (slon < -_constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI) {
    slon += _constants_values__WEBPACK_IMPORTED_MODULE_0__.TWO_PI;
  } else if (slon > +_constants_values__WEBPACK_IMPORTED_MODULE_0__.SPI) {
    slon -= _constants_values__WEBPACK_IMPORTED_MODULE_0__.TWO_PI;
  }
  return slon;
}

var names = ['Quadrilateralized Spherical Cube', 'Quadrilateralized_Spherical_Cube', 'qsc'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/robin.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/robin.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
// Robinson projection
// Based on https://github.com/OSGeo/proj.4/blob/master/src/PJ_robin.c
// Polynomial coeficients from http://article.gmane.org/gmane.comp.gis.proj-4.devel/6039




var COEFS_X = [
  [1.0000, 2.2199e-17, -7.15515e-05, 3.1103e-06],
  [0.9986, -0.000482243, -2.4897e-05, -1.3309e-06],
  [0.9954, -0.00083103, -4.48605e-05, -9.86701e-07],
  [0.9900, -0.00135364, -5.9661e-05, 3.6777e-06],
  [0.9822, -0.00167442, -4.49547e-06, -5.72411e-06],
  [0.9730, -0.00214868, -9.03571e-05, 1.8736e-08],
  [0.9600, -0.00305085, -9.00761e-05, 1.64917e-06],
  [0.9427, -0.00382792, -6.53386e-05, -2.6154e-06],
  [0.9216, -0.00467746, -0.00010457, 4.81243e-06],
  [0.8962, -0.00536223, -3.23831e-05, -5.43432e-06],
  [0.8679, -0.00609363, -0.000113898, 3.32484e-06],
  [0.8350, -0.00698325, -6.40253e-05, 9.34959e-07],
  [0.7986, -0.00755338, -5.00009e-05, 9.35324e-07],
  [0.7597, -0.00798324, -3.5971e-05, -2.27626e-06],
  [0.7186, -0.00851367, -7.01149e-05, -8.6303e-06],
  [0.6732, -0.00986209, -0.000199569, 1.91974e-05],
  [0.6213, -0.010418, 8.83923e-05, 6.24051e-06],
  [0.5722, -0.00906601, 0.000182, 6.24051e-06],
  [0.5322, -0.00677797, 0.000275608, 6.24051e-06]
];

var COEFS_Y = [
  [-5.20417e-18, 0.0124, 1.21431e-18, -8.45284e-11],
  [0.0620, 0.0124, -1.26793e-09, 4.22642e-10],
  [0.1240, 0.0124, 5.07171e-09, -1.60604e-09],
  [0.1860, 0.0123999, -1.90189e-08, 6.00152e-09],
  [0.2480, 0.0124002, 7.10039e-08, -2.24e-08],
  [0.3100, 0.0123992, -2.64997e-07, 8.35986e-08],
  [0.3720, 0.0124029, 9.88983e-07, -3.11994e-07],
  [0.4340, 0.0123893, -3.69093e-06, -4.35621e-07],
  [0.4958, 0.0123198, -1.02252e-05, -3.45523e-07],
  [0.5571, 0.0121916, -1.54081e-05, -5.82288e-07],
  [0.6176, 0.0119938, -2.41424e-05, -5.25327e-07],
  [0.6769, 0.011713, -3.20223e-05, -5.16405e-07],
  [0.7346, 0.0113541, -3.97684e-05, -6.09052e-07],
  [0.7903, 0.0109107, -4.89042e-05, -1.04739e-06],
  [0.8435, 0.0103431, -6.4615e-05, -1.40374e-09],
  [0.8936, 0.00969686, -6.4636e-05, -8.547e-06],
  [0.9394, 0.00840947, -0.000192841, -4.2106e-06],
  [0.9761, 0.00616527, -0.000256, -4.2106e-06],
  [1.0000, 0.00328947, -0.000319159, -4.2106e-06]
];

var FXC = 0.8487;
var FYC = 1.3523;
var C1 = _constants_values__WEBPACK_IMPORTED_MODULE_0__.R2D / 5; // rad to 5-degree interval
var RC1 = 1 / C1;
var NODES = 18;

var poly3_val = function (coefs, x) {
  return coefs[0] + x * (coefs[1] + x * (coefs[2] + x * coefs[3]));
};

var poly3_der = function (coefs, x) {
  return coefs[1] + x * (2 * coefs[2] + x * 3 * coefs[3]);
};

function newton_rapshon(f_df, start, max_err, iters) {
  var x = start;
  for (; iters; --iters) {
    var upd = f_df(x);
    x -= upd;
    if (Math.abs(upd) < max_err) {
      break;
    }
  }
  return x;
}

function init() {
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.long0 = this.long0 || 0;
  this.es = 0;
  this.title = this.title || 'Robinson';
}

function forward(ll) {
  var lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(ll.x - this.long0, this.over);

  var dphi = Math.abs(ll.y);
  var i = Math.floor(dphi * C1);
  if (i < 0) {
    i = 0;
  } else if (i >= NODES) {
    i = NODES - 1;
  }
  dphi = _constants_values__WEBPACK_IMPORTED_MODULE_0__.R2D * (dphi - RC1 * i);
  var xy = {
    x: poly3_val(COEFS_X[i], dphi) * lon,
    y: poly3_val(COEFS_Y[i], dphi)
  };
  if (ll.y < 0) {
    xy.y = -xy.y;
  }

  xy.x = xy.x * this.a * FXC + this.x0;
  xy.y = xy.y * this.a * FYC + this.y0;
  return xy;
}

function inverse(xy) {
  var ll = {
    x: (xy.x - this.x0) / (this.a * FXC),
    y: Math.abs(xy.y - this.y0) / (this.a * FYC)
  };

  if (ll.y >= 1) { // pathologic case
    ll.x /= COEFS_X[NODES][0];
    ll.y = xy.y < 0 ? -_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI : _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
  } else {
    // find table interval
    var i = Math.floor(ll.y * NODES);
    if (i < 0) {
      i = 0;
    } else if (i >= NODES) {
      i = NODES - 1;
    }
    for (;;) {
      if (COEFS_Y[i][0] > ll.y) {
        --i;
      } else if (COEFS_Y[i + 1][0] <= ll.y) {
        ++i;
      } else {
        break;
      }
    }
    // linear interpolation in 5 degree interval
    var coefs = COEFS_Y[i];
    var t = 5 * (ll.y - coefs[0]) / (COEFS_Y[i + 1][0] - coefs[0]);
    // find t so that poly3_val(coefs, t) = ll.y
    t = newton_rapshon(function (x) {
      return (poly3_val(coefs, x) - ll.y) / poly3_der(coefs, x);
    }, t, _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN, 100);

    ll.x /= poly3_val(COEFS_X[i], t);
    ll.y = (5 * i + t) * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    if (xy.y < 0) {
      ll.y = -ll.y;
    }
  }

  ll.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(ll.x + this.long0, this.over);
  return ll;
}

var names = ['Robinson', 'robin'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/sinu.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/sinu.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_pj_enfn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/pj_enfn */ "./node_modules/proj4/lib/common/pj_enfn.js");
/* harmony import */ var _common_pj_mlfn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/pj_mlfn */ "./node_modules/proj4/lib/common/pj_mlfn.js");
/* harmony import */ var _common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/pj_inv_mlfn */ "./node_modules/proj4/lib/common/pj_inv_mlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");



var MAX_ITER = 20;






/**
 * @typedef {Object} LocalThis
 * @property {Array<number>} en
 * @property {number} n
 * @property {number} m
 * @property {number} C_y
 * @property {number} C_x
 * @property {number} es
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  /* Place parameters in static storage for common use
    ------------------------------------------------- */

  if (!this.sphere) {
    this.en = (0,_common_pj_enfn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
  } else {
    this.n = 1;
    this.m = 0;
    this.es = 0;
    this.C_y = Math.sqrt((this.m + 1) / this.n);
    this.C_x = this.C_y / (this.m + 1);
  }
}

/* Sinusoidal forward equations--mapping lat,long to x,y
  ----------------------------------------------------- */
function forward(p) {
  var x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
    ----------------- */
  lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);

  if (this.sphere) {
    if (!this.m) {
      lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
    } else {
      var k = this.n * Math.sin(lat);
      for (var i = MAX_ITER; i; --i) {
        var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
        lat -= V;
        if (Math.abs(V) < _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN) {
          break;
        }
      }
    }
    x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
    y = this.a * this.C_y * lat;
  } else {
    var s = Math.sin(lat);
    var c = Math.cos(lat);
    y = this.a * (0,_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_3__["default"])(lat, s, c, this.en);
    x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
  }

  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var lat, temp, lon, s;

  p.x -= this.x0;
  lon = p.x / this.a;
  p.y -= this.y0;
  lat = p.y / this.a;

  if (this.sphere) {
    lat /= this.C_y;
    lon = lon / (this.C_x * (this.m + Math.cos(lat)));
    if (this.m) {
      lat = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_6__["default"])((this.m * lat + Math.sin(lat)) / this.n);
    } else if (this.n !== 1) {
      lat = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_6__["default"])(Math.sin(lat) / this.n);
    }
    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon + this.long0, this.over);
    lat = (0,_common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__["default"])(lat);
  } else {
    lat = (0,_common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_4__["default"])(p.y / this.a, this.es, this.en);
    s = Math.abs(lat);
    if (s < _constants_values__WEBPACK_IMPORTED_MODULE_5__.HALF_PI) {
      s = Math.sin(lat);
      temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat));
      // temp = this.long0 + p.x / (this.a * Math.cos(lat));
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(temp, this.over);
    } else if ((s - _constants_values__WEBPACK_IMPORTED_MODULE_5__.EPSLN) < _constants_values__WEBPACK_IMPORTED_MODULE_5__.HALF_PI) {
      lon = this.long0;
    }
  }
  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['Sinusoidal', 'sinu'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/somerc.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/somerc.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/*
  references:
    Formules et constantes pour le Calcul pour la
    projection cylindrique conforme à axe oblique et pour la transformation entre
    des systèmes de référence.
    http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
  */

/**
 * @typedef {Object} LocalThis
 * @property {number} lambda0
 * @property {number} e
 * @property {number} R
 * @property {number} b0
 * @property {number} K
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  var phy0 = this.lat0;
  this.lambda0 = this.long0;
  var sinPhy0 = Math.sin(phy0);
  var semiMajorAxis = this.a;
  var invF = this.rf;
  var flattening = 1 / invF;
  var e2 = 2 * flattening - Math.pow(flattening, 2);
  var e = this.e = Math.sqrt(e2);
  this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
  this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
  this.b0 = Math.asin(sinPhy0 / this.alpha);
  var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
  var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
  var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
  this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
}

function forward(p) {
  var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
  var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
  var S = -this.alpha * (Sa1 + Sa2) + this.K;

  // spheric latitude
  var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4);

  // spheric longitude
  var I = this.alpha * (p.x - this.lambda0);

  // psoeudo equatorial rotation
  var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));

  var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

  p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
  p.x = this.R * rotI + this.x0;
  return p;
}

function inverse(p) {
  var Y = p.x - this.x0;
  var X = p.y - this.y0;

  var rotI = Y / this.R;
  var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);

  var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
  var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));

  var lambda = this.lambda0 + I / this.alpha;

  var S = 0;
  var phy = b;
  var prevPhy = -1000;
  var iteration = 0;
  while (Math.abs(phy - prevPhy) > 0.0000001) {
    if (++iteration > 20) {
      // ...reportError("omercFwdInfinity");
      return;
    }
    // S = Math.log(Math.tan(Math.PI / 4 + phy / 2));
    S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
    prevPhy = phy;
    phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
  }

  p.x = lambda;
  p.y = phy;
  return p;
}

var names = ['somerc'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/stere.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/stere.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names),
/* harmony export */   ssfn_: () => (/* binding */ ssfn_)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_sign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/sign */ "./node_modules/proj4/lib/common/sign.js");
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");








/**
 * @typedef {Object} LocalThis
 * @property {number} coslat0
 * @property {number} sinlat0
 * @property {number} ms1
 * @property {number} X0
 * @property {number} cosX0
 * @property {number} sinX0
 * @property {number} con
 * @property {number} cons
 * @property {number} e
 */

function ssfn_(phit, sinphi, eccen) {
  sinphi *= eccen;
  return (Math.tan(0.5 * (_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen));
}

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  // setting default parameters
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.lat0 = this.lat0 || 0;
  this.long0 = this.long0 || 0;

  this.coslat0 = Math.cos(this.lat0);
  this.sinlat0 = Math.sin(this.lat0);
  if (this.sphere) {
    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      this.k0 = 0.5 * (1 + (0,_common_sign__WEBPACK_IMPORTED_MODULE_1__["default"])(this.lat0) * Math.sin(this.lat_ts));
    }
  } else {
    if (Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      if (this.lat0 > 0) {
        // North pole
        // trace('stere:north pole');
        this.con = 1;
      } else {
        // South pole
        // trace('stere:south pole');
        this.con = -1;
      }
    }
    this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN && Math.abs(Math.cos(this.lat_ts)) > _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      // When k0 is 1 (default value) and lat_ts is a vaild number and lat0 is at a pole and lat_ts is not at a pole
      // Recalculate k0 using formula 21-35 from p161 of Snyder, 1987
      this.k0 = 0.5 * this.cons * (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / (0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
    }
    this.ms1 = (0,_common_msfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, this.sinlat0, this.coslat0);
    this.X0 = 2 * Math.atan(ssfn_(this.lat0, this.sinlat0, this.e)) - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    this.cosX0 = Math.cos(this.X0);
    this.sinX0 = Math.sin(this.X0);
  }
}

// Stereographic forward equations--mapping lat,long to x,y
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var sinlat = Math.sin(lat);
  var coslat = Math.cos(lat);
  var A, X, sinX, cosX, ts, rh;
  var dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(lon - this.long0, this.over);

  if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN && Math.abs(lat + this.lat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    // case of the origine point
    // trace('stere:this is the origin point');
    p.x = NaN;
    p.y = NaN;
    return p;
  }
  if (this.sphere) {
    // trace('stere:sphere case');
    A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
    p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
    p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
    return p;
  } else {
    X = 2 * Math.atan(ssfn_(lat, sinlat, this.e)) - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI;
    cosX = Math.cos(X);
    sinX = Math.sin(X);
    if (Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      ts = (0,_common_tsfnz__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, lat * this.con, this.con * sinlat);
      rh = 2 * this.a * this.k0 * ts / this.cons;
      p.x = this.x0 + rh * Math.sin(lon - this.long0);
      p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0);
      // trace(p.toString());
      return p;
    } else if (Math.abs(this.sinlat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      // Eq
      // trace('stere:equateur');
      A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
      p.y = A * sinX;
    } else {
      // other case
      // trace('stere:normal case');
      A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
      p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
    }
    p.x = A * cosX * Math.sin(dlon) + this.x0;
  }
  // trace(p.toString());
  return p;
}

//* Stereographic inverse equations--mapping x,y to lat/long
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var lon, lat, ts, ce, Chi;
  var rh = Math.sqrt(p.x * p.x + p.y * p.y);
  if (this.sphere) {
    var c = 2 * Math.atan(rh / (2 * this.a * this.k0));
    lon = this.long0;
    lat = this.lat0;
    if (rh <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      p.x = lon;
      p.y = lat;
      return p;
    }
    lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);
    if (Math.abs(this.coslat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      if (this.lat0 > 0) {
        lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x, -1 * p.y), this.over);
      } else {
        lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x, p.y), this.over);
      }
    } else {
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)), this.over);
    }
    p.x = lon;
    p.y = lat;
    return p;
  } else {
    if (Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
      if (rh <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
        lat = this.lat0;
        lon = this.long0;
        p.x = lon;
        p.y = lat;
        // trace(p.toString());
        return p;
      }
      p.x *= this.con;
      p.y *= this.con;
      ts = rh * this.cons / (2 * this.a * this.k0);
      lat = this.con * (0,_common_phi2z__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, ts);
      lon = this.con * (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.con * this.long0 + Math.atan2(p.x, -1 * p.y), this.over);
    } else {
      ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
      lon = this.long0;
      if (rh <= _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
        Chi = this.X0;
      } else {
        Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
        lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)), this.over);
      }
      lat = -1 * (0,_common_phi2z__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, Math.tan(0.5 * (_constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI + Chi)));
    }
  }
  p.x = lon;
  p.y = lat;

  // trace(p.toString());
  return p;
}

var names = ['stere', 'Stereographic_South_Pole', 'Polar_Stereographic_variant_A', 'Polar_Stereographic_variant_B', 'Polar_Stereographic'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names,
  ssfn_: ssfn_
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/sterea.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/sterea.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _gauss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gauss */ "./node_modules/proj4/lib/projections/gauss.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_hypot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/hypot */ "./node_modules/proj4/lib/common/hypot.js");




/**
 * @typedef {Object} LocalThis
 * @property {number} sinc0
 * @property {number} cosc0
 * @property {number} R2
 * @property {number} rc
 * @property {number} phic0
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  _gauss__WEBPACK_IMPORTED_MODULE_0__["default"].init.apply(this);
  if (!this.rc) {
    return;
  }
  this.sinc0 = Math.sin(this.phic0);
  this.cosc0 = Math.cos(this.phic0);
  this.R2 = 2 * this.rc;
  if (!this.title) {
    this.title = 'Oblique Stereographic Alternative';
  }
}

function forward(p) {
  var sinc, cosc, cosl, k;
  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x - this.long0, this.over);
  _gauss__WEBPACK_IMPORTED_MODULE_0__["default"].forward.apply(this, [p]);
  sinc = Math.sin(p.y);
  cosc = Math.cos(p.y);
  cosl = Math.cos(p.x);
  k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
  p.x = k * cosc * Math.sin(p.x);
  p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
  p.x = this.a * p.x + this.x0;
  p.y = this.a * p.y + this.y0;
  return p;
}

function inverse(p) {
  var sinc, cosc, lon, lat, rho;
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  p.x /= this.k0;
  p.y /= this.k0;
  if ((rho = (0,_common_hypot__WEBPACK_IMPORTED_MODULE_2__["default"])(p.x, p.y))) {
    var c = 2 * Math.atan2(rho, this.R2);
    sinc = Math.sin(c);
    cosc = Math.cos(c);
    lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
    lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
  } else {
    lat = this.phic0;
    lon = 0;
  }

  p.x = lon;
  p.y = lat;
  _gauss__WEBPACK_IMPORTED_MODULE_0__["default"].inverse.apply(this, [p]);
  p.x = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x + this.long0, this.over);
  return p;
}

var names = ['Stereographic_North_Pole', 'Oblique_Stereographic', 'sterea', 'Oblique Stereographic Alternative', 'Double_Stereographic'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/tmerc.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/tmerc.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_pj_enfn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pj_enfn */ "./node_modules/proj4/lib/common/pj_enfn.js");
/* harmony import */ var _common_pj_mlfn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/pj_mlfn */ "./node_modules/proj4/lib/common/pj_mlfn.js");
/* harmony import */ var _common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/pj_inv_mlfn */ "./node_modules/proj4/lib/common/pj_inv_mlfn.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_sign__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/sign */ "./node_modules/proj4/lib/common/sign.js");
// Heavily based on this tmerc projection implementation
// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/tmerc.js









/**
 * @typedef {Object} LocalThis
 * @property {number} es
 * @property {Array<number>} en
 * @property {number} ml0
 */

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  this.x0 = this.x0 !== undefined ? this.x0 : 0;
  this.y0 = this.y0 !== undefined ? this.y0 : 0;
  this.long0 = this.long0 !== undefined ? this.long0 : 0;
  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

  if (this.es) {
    this.en = (0,_common_pj_enfn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.es);
    this.ml0 = (0,_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
  }
}

/**
    Transverse Mercator Forward  - long/lat to x/y
    long/lat in radians
  */
function forward(p) {
  var lon = p.x;
  var lat = p.y;

  var delta_lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(lon - this.long0, this.over);
  var con;
  var x, y;
  var sin_phi = Math.sin(lat);
  var cos_phi = Math.cos(lat);

  if (!this.es) {
    var b = cos_phi * Math.sin(delta_lon);

    if ((Math.abs(Math.abs(b) - 1)) < _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN) {
      return (93);
    } else {
      x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b)) + this.x0;
      y = cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - Math.pow(b, 2));
      b = Math.abs(y);

      if (b >= 1) {
        if ((b - 1) > _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN) {
          return (93);
        } else {
          y = 0;
        }
      } else {
        y = Math.acos(y);
      }

      if (lat < 0) {
        y = -y;
      }

      y = this.a * this.k0 * (y - this.lat0) + this.y0;
    }
  } else {
    var al = cos_phi * delta_lon;
    var als = Math.pow(al, 2);
    var c = this.ep2 * Math.pow(cos_phi, 2);
    var cs = Math.pow(c, 2);
    var tq = Math.abs(cos_phi) > _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN ? Math.tan(lat) : 0;
    var t = Math.pow(tq, 2);
    var ts = Math.pow(t, 2);
    con = 1 - this.es * Math.pow(sin_phi, 2);
    al = al / Math.sqrt(con);
    var ml = (0,_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_1__["default"])(lat, sin_phi, cos_phi, this.en);

    x = this.a * (this.k0 * al * (1
      + als / 6 * (1 - t + c
        + als / 20 * (5 - 18 * t + ts + 14 * c - 58 * t * c
          + als / 42 * (61 + 179 * ts - ts * t - 479 * t)))))
        + this.x0;

    y = this.a * (this.k0 * (ml - this.ml0
      + sin_phi * delta_lon * al / 2 * (1
        + als / 12 * (5 - t + 9 * c + 4 * cs
          + als / 30 * (61 + ts - 58 * t + 270 * c - 330 * t * c
            + als / 56 * (1385 + 543 * ts - ts * t - 3111 * t))))))
          + this.y0;
  }

  p.x = x;
  p.y = y;

  return p;
}

/**
    Transverse Mercator Inverse  -  x/y to long/lat
  */
function inverse(p) {
  var con, phi;
  var lat, lon;
  var x = (p.x - this.x0) * (1 / this.a);
  var y = (p.y - this.y0) * (1 / this.a);

  if (!this.es) {
    var f = Math.exp(x / this.k0);
    var g = 0.5 * (f - 1 / f);
    var temp = this.lat0 + y / this.k0;
    var h = Math.cos(temp);
    con = Math.sqrt((1 - Math.pow(h, 2)) / (1 + Math.pow(g, 2)));
    lat = Math.asin(con);

    if (y < 0) {
      lat = -lat;
    }

    if ((g === 0) && (h === 0)) {
      lon = 0;
    } else {
      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(Math.atan2(g, h) + this.long0, this.over);
    }
  } else { // ellipsoidal form
    con = this.ml0 + y / this.k0;
    phi = (0,_common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(con, this.es, this.en);

    if (Math.abs(phi) < _constants_values__WEBPACK_IMPORTED_MODULE_4__.HALF_PI) {
      var sin_phi = Math.sin(phi);
      var cos_phi = Math.cos(phi);
      var tan_phi = Math.abs(cos_phi) > _constants_values__WEBPACK_IMPORTED_MODULE_4__.EPSLN ? Math.tan(phi) : 0;
      var c = this.ep2 * Math.pow(cos_phi, 2);
      var cs = Math.pow(c, 2);
      var t = Math.pow(tan_phi, 2);
      var ts = Math.pow(t, 2);
      con = 1 - this.es * Math.pow(sin_phi, 2);
      var d = x * Math.sqrt(con) / this.k0;
      var ds = Math.pow(d, 2);
      con = con * tan_phi;

      lat = phi - (con * ds / (1 - this.es)) * 0.5 * (1
        - ds / 12 * (5 + 3 * t - 9 * c * t + c - 4 * cs
          - ds / 30 * (61 + 90 * t - 252 * c * t + 45 * ts + 46 * c
            - ds / 56 * (1385 + 3633 * t + 4095 * ts + 1574 * ts * t))));

      lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(this.long0 + (d * (1
        - ds / 6 * (1 + 2 * t + c
          - ds / 20 * (5 + 28 * t + 24 * ts + 8 * c * t + 6 * c
            - ds / 42 * (61 + 662 * t + 1320 * ts + 720 * ts * t)))) / cos_phi), this.over);
    } else {
      lat = _constants_values__WEBPACK_IMPORTED_MODULE_4__.HALF_PI * (0,_common_sign__WEBPACK_IMPORTED_MODULE_5__["default"])(y);
      lon = 0;
    }
  }

  p.x = lon;
  p.y = lat;

  return p;
}

var names = ['Fast_Transverse_Mercator', 'Fast Transverse Mercator'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/tpers.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/tpers.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_hypot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/hypot */ "./node_modules/proj4/lib/common/hypot.js");



/**
 * @typedef {Object} LocalThis
 * @property {number} mode
 * @property {number} sinph0
 * @property {number} cosph0
 * @property {number} pn1
 * @property {number} h
 * @property {number} rp
 * @property {number} p
 * @property {number} h1
 * @property {number} pfact
 * @property {number} es
 * @property {number} tilt
 * @property {number} azi
 * @property {number} cg
 * @property {number} sg
 * @property {number} cw
 * @property {number} sw
 */

var mode = {
  N_POLE: 0,
  S_POLE: 1,
  EQUIT: 2,
  OBLIQ: 3
};

var params = {
  h: { def: 100000, num: true }, // default is Karman line, no default in PROJ.7
  azi: { def: 0, num: true, degrees: true }, // default is North
  tilt: { def: 0, num: true, degrees: true }, // default is Nadir
  long0: { def: 0, num: true }, // default is Greenwich, conversion to rad is automatic
  lat0: { def: 0, num: true } // default is Equator, conversion to rad is automatic
};

/** @this {import('../defs.js').ProjectionDefinition & LocalThis} */
function init() {
  Object.keys(params).forEach(function (p) {
    if (typeof this[p] === 'undefined') {
      this[p] = params[p].def;
    } else if (params[p].num && isNaN(this[p])) {
      throw new Error('Invalid parameter value, must be numeric ' + p + ' = ' + this[p]);
    } else if (params[p].num) {
      this[p] = parseFloat(this[p]);
    }
    if (params[p].degrees) {
      this[p] = this[p] * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R;
    }
  }.bind(this));

  if (Math.abs((Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_0__.HALF_PI)) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    this.mode = this.lat0 < 0 ? mode.S_POLE : mode.N_POLE;
  } else if (Math.abs(this.lat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    this.mode = mode.EQUIT;
  } else {
    this.mode = mode.OBLIQ;
    this.sinph0 = Math.sin(this.lat0);
    this.cosph0 = Math.cos(this.lat0);
  }

  this.pn1 = this.h / this.a; // Normalize relative to the Earth's radius

  if (this.pn1 <= 0 || this.pn1 > 1e10) {
    throw new Error('Invalid height');
  }

  this.p = 1 + this.pn1;
  this.rp = 1 / this.p;
  this.h1 = 1 / this.pn1;
  this.pfact = (this.p + 1) * this.h1;
  this.es = 0;

  var omega = this.tilt;
  var gamma = this.azi;
  this.cg = Math.cos(gamma);
  this.sg = Math.sin(gamma);
  this.cw = Math.cos(omega);
  this.sw = Math.sin(omega);
}

function forward(p) {
  p.x -= this.long0;
  var sinphi = Math.sin(p.y);
  var cosphi = Math.cos(p.y);
  var coslam = Math.cos(p.x);
  var x, y;
  switch (this.mode) {
    case mode.OBLIQ:
      y = this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
      break;
    case mode.EQUIT:
      y = cosphi * coslam;
      break;
    case mode.S_POLE:
      y = -sinphi;
      break;
    case mode.N_POLE:
      y = sinphi;
      break;
  }
  y = this.pn1 / (this.p - y);
  x = y * cosphi * Math.sin(p.x);

  switch (this.mode) {
    case mode.OBLIQ:
      y *= this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
      break;
    case mode.EQUIT:
      y *= sinphi;
      break;
    case mode.N_POLE:
      y *= -(cosphi * coslam);
      break;
    case mode.S_POLE:
      y *= cosphi * coslam;
      break;
  }

  // Tilt
  var yt, ba;
  yt = y * this.cg + x * this.sg;
  ba = 1 / (yt * this.sw * this.h1 + this.cw);
  x = (x * this.cg - y * this.sg) * this.cw * ba;
  y = yt * ba;

  p.x = x * this.a;
  p.y = y * this.a;
  return p;
}

function inverse(p) {
  p.x /= this.a;
  p.y /= this.a;
  var r = { x: p.x, y: p.y };

  // Un-Tilt
  var bm, bq, yt;
  yt = 1 / (this.pn1 - p.y * this.sw);
  bm = this.pn1 * p.x * yt;
  bq = this.pn1 * p.y * this.cw * yt;
  p.x = bm * this.cg + bq * this.sg;
  p.y = bq * this.cg - bm * this.sg;

  var rh = (0,_common_hypot__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x, p.y);
  if (Math.abs(rh) < _constants_values__WEBPACK_IMPORTED_MODULE_0__.EPSLN) {
    r.x = 0;
    r.y = p.y;
  } else {
    var cosz, sinz;
    sinz = 1 - rh * rh * this.pfact;
    sinz = (this.p - Math.sqrt(sinz)) / (this.pn1 / rh + rh / this.pn1);
    cosz = Math.sqrt(1 - sinz * sinz);
    switch (this.mode) {
      case mode.OBLIQ:
        r.y = Math.asin(cosz * this.sinph0 + p.y * sinz * this.cosph0 / rh);
        p.y = (cosz - this.sinph0 * Math.sin(r.y)) * rh;
        p.x *= sinz * this.cosph0;
        break;
      case mode.EQUIT:
        r.y = Math.asin(p.y * sinz / rh);
        p.y = cosz * rh;
        p.x *= sinz;
        break;
      case mode.N_POLE:
        r.y = Math.asin(cosz);
        p.y = -p.y;
        break;
      case mode.S_POLE:
        r.y = -Math.asin(cosz);
        break;
    }
    r.x = Math.atan2(p.x, p.y);
  }

  p.x = r.x + this.long0;
  p.y = r.y;
  return p;
}

var names = ['Tilted_Perspective', 'tpers'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/utm.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/utm.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   dependsOn: () => (/* binding */ dependsOn),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_zone */ "./node_modules/proj4/lib/common/adjust_zone.js");
/* harmony import */ var _etmerc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./etmerc */ "./node_modules/proj4/lib/projections/etmerc.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


var dependsOn = 'etmerc';


/** @this {import('../defs.js').ProjectionDefinition} */
function init() {
  var zone = (0,_common_adjust_zone__WEBPACK_IMPORTED_MODULE_0__["default"])(this.zone, this.long0);
  if (zone === undefined) {
    throw new Error('unknown utm zone');
  }
  this.lat0 = 0;
  this.long0 = ((6 * Math.abs(zone)) - 183) * _constants_values__WEBPACK_IMPORTED_MODULE_2__.D2R;
  this.x0 = 500000;
  this.y0 = this.utmSouth ? 10000000 : 0;
  this.k0 = 0.9996;

  _etmerc__WEBPACK_IMPORTED_MODULE_1__["default"].init.apply(this);
  this.forward = _etmerc__WEBPACK_IMPORTED_MODULE_1__["default"].forward;
  this.inverse = _etmerc__WEBPACK_IMPORTED_MODULE_1__["default"].inverse;
}

var names = ['Universal Transverse Mercator System', 'utm'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  names: names,
  dependsOn: dependsOn
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/vandg.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/vandg.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forward: () => (/* binding */ forward),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");






/**
 * @typedef {Object} LocalThis
 * @property {number} R - Radius of the Earth
 */

/**
 * Initialize the Van Der Grinten projection
 * @this {import('../defs.js').ProjectionDefinition & LocalThis}
 */
function init() {
  // this.R = 6370997; //Radius of earth
  this.R = this.a;
}

function forward(p) {
  var lon = p.x;
  var lat = p.y;

  /* Forward equations
    ----------------- */
  var dlon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0, this.over);
  var x, y;

  if (Math.abs(lat) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
    x = this.x0 + this.R * dlon;
    y = this.y0;
  }
  var theta = (0,_common_asinz__WEBPACK_IMPORTED_MODULE_2__["default"])(2 * Math.abs(lat / Math.PI));
  if ((Math.abs(dlon) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) || (Math.abs(Math.abs(lat) - _constants_values__WEBPACK_IMPORTED_MODULE_1__.HALF_PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN)) {
    x = this.x0;
    if (lat >= 0) {
      y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
    } else {
      y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
    }
    //  return(OK);
  }
  var al = 0.5 * Math.abs((Math.PI / dlon) - (dlon / Math.PI));
  var asq = al * al;
  var sinth = Math.sin(theta);
  var costh = Math.cos(theta);

  var g = costh / (sinth + costh - 1);
  var gsq = g * g;
  var m = g * (2 / sinth - 1);
  var msq = m * m;
  var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
  if (dlon < 0) {
    con = -con;
  }
  x = this.x0 + con;
  // con = Math.abs(con / (Math.PI * this.R));
  var q = asq + g;
  con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);
  if (lat >= 0) {
    // y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
    y = this.y0 + con;
  } else {
    // y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
    y = this.y0 - con;
  }
  p.x = x;
  p.y = y;
  return p;
}

/* Van Der Grinten inverse equations--mapping x,y to lat/long
  --------------------------------------------------------- */
function inverse(p) {
  var lon, lat;
  var xx, yy, xys, c1, c2, c3;
  var a1;
  var m1;
  var con;
  var th1;
  var d;

  /* inverse equations
    ----------------- */
  p.x -= this.x0;
  p.y -= this.y0;
  con = Math.PI * this.R;
  xx = p.x / con;
  yy = p.y / con;
  xys = xx * xx + yy * yy;
  c1 = -Math.abs(yy) * (1 + xys);
  c2 = c1 - 2 * yy * yy + xx * xx;
  c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
  d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
  a1 = (c1 - c2 * c2 / 3 / c3) / c3;
  m1 = 2 * Math.sqrt(-a1 / 3);
  con = ((3 * d) / a1) / m1;
  if (Math.abs(con) > 1) {
    if (con >= 0) {
      con = 1;
    } else {
      con = -1;
    }
  }
  th1 = Math.acos(con) / 3;
  if (p.y >= 0) {
    lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
  } else {
    lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
  }

  if (Math.abs(xx) < _constants_values__WEBPACK_IMPORTED_MODULE_1__.EPSLN) {
    lon = this.long0;
  } else {
    lon = (0,_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx, this.over);
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ['Van_der_Grinten_I', 'VanDerGrinten', 'Van_der_Grinten', 'vandg'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/transform.js":
/*!*********************************************!*\
  !*** ./node_modules/proj4/lib/transform.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ transform)
/* harmony export */ });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _datum_transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./datum_transform */ "./node_modules/proj4/lib/datum_transform.js");
/* harmony import */ var _adjust_axis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./adjust_axis */ "./node_modules/proj4/lib/adjust_axis.js");
/* harmony import */ var _Proj__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Proj */ "./node_modules/proj4/lib/Proj.js");
/* harmony import */ var _common_toPoint__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/toPoint */ "./node_modules/proj4/lib/common/toPoint.js");
/* harmony import */ var _checkSanity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./checkSanity */ "./node_modules/proj4/lib/checkSanity.js");







function checkNotWGS(source, dest) {
  return (
    (source.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_3PARAM || source.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_7PARAM || source.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_GRIDSHIFT) && dest.datumCode !== 'WGS84')
  || ((dest.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_3PARAM || dest.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_7PARAM || dest.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__.PJD_GRIDSHIFT) && source.datumCode !== 'WGS84');
}

/**
 * @param {import('./defs').ProjectionDefinition} source
 * @param {import('./defs').ProjectionDefinition} dest
 * @param {import('./core').TemplateCoordinates} point
 * @param {boolean} enforceAxis
 * @returns {import('./core').InterfaceCoordinates | undefined}
 */
function transform(source, dest, point, enforceAxis) {
  var wgs84;
  if (Array.isArray(point)) {
    point = (0,_common_toPoint__WEBPACK_IMPORTED_MODULE_4__["default"])(point);
  } else {
    // Clone the point object so inputs don't get modified
    point = {
      x: point.x,
      y: point.y,
      z: point.z,
      m: point.m
    };
  }
  var hasZ = point.z !== undefined;
  (0,_checkSanity__WEBPACK_IMPORTED_MODULE_5__["default"])(point);
  // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
  if (source.datum && dest.datum && checkNotWGS(source, dest)) {
    wgs84 = new _Proj__WEBPACK_IMPORTED_MODULE_3__["default"]('WGS84');
    point = transform(source, wgs84, point, enforceAxis);
    source = wgs84;
  }
  // DGR, 2010/11/12
  if (enforceAxis && source.axis !== 'enu') {
    point = (0,_adjust_axis__WEBPACK_IMPORTED_MODULE_2__["default"])(source, false, point);
  }
  // Transform source points to long/lat, if they aren't already.
  if (source.projName === 'longlat') {
    point = {
      x: point.x * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R,
      y: point.y * _constants_values__WEBPACK_IMPORTED_MODULE_0__.D2R,
      z: point.z || 0
    };
  } else {
    if (source.to_meter) {
      point = {
        x: point.x * source.to_meter,
        y: point.y * source.to_meter,
        z: point.z || 0
      };
    }
    point = source.inverse(point); // Convert Cartesian to longlat
    if (!point) {
      return;
    }
  }
  // Adjust for the prime meridian if necessary
  if (source.from_greenwich) {
    point.x += source.from_greenwich;
  }

  // Convert datums if needed, and if possible.
  point = (0,_datum_transform__WEBPACK_IMPORTED_MODULE_1__["default"])(source.datum, dest.datum, point);
  if (!point) {
    return;
  }

  point = /** @type {import('./core').InterfaceCoordinates} */ (point);

  // Adjust for the prime meridian if necessary
  if (dest.from_greenwich) {
    point = {
      x: point.x - dest.from_greenwich,
      y: point.y,
      z: point.z || 0
    };
  }

  if (dest.projName === 'longlat') {
    // convert radians to decimal degrees
    point = {
      x: point.x * _constants_values__WEBPACK_IMPORTED_MODULE_0__.R2D,
      y: point.y * _constants_values__WEBPACK_IMPORTED_MODULE_0__.R2D,
      z: point.z || 0
    };
  } else { // else project
    point = dest.forward(point);
    if (dest.to_meter) {
      point = {
        x: point.x / dest.to_meter,
        y: point.y / dest.to_meter,
        z: point.z || 0
      };
    }
  }

  // DGR, 2010/11/12
  if (enforceAxis && dest.axis !== 'enu') {
    return (0,_adjust_axis__WEBPACK_IMPORTED_MODULE_2__["default"])(dest, true, point);
  }

  if (point && !hasZ) {
    delete point.z;
  }
  return point;
}


/***/ }),

/***/ "./node_modules/proj4/projs.js":
/*!*************************************!*\
  !*** ./node_modules/proj4/projs.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_projections_tmerc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/projections/tmerc */ "./node_modules/proj4/lib/projections/tmerc.js");
/* harmony import */ var _lib_projections_etmerc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/projections/etmerc */ "./node_modules/proj4/lib/projections/etmerc.js");
/* harmony import */ var _lib_projections_utm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/projections/utm */ "./node_modules/proj4/lib/projections/utm.js");
/* harmony import */ var _lib_projections_sterea__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/projections/sterea */ "./node_modules/proj4/lib/projections/sterea.js");
/* harmony import */ var _lib_projections_stere__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/projections/stere */ "./node_modules/proj4/lib/projections/stere.js");
/* harmony import */ var _lib_projections_somerc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/projections/somerc */ "./node_modules/proj4/lib/projections/somerc.js");
/* harmony import */ var _lib_projections_omerc__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/projections/omerc */ "./node_modules/proj4/lib/projections/omerc.js");
/* harmony import */ var _lib_projections_lcc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/projections/lcc */ "./node_modules/proj4/lib/projections/lcc.js");
/* harmony import */ var _lib_projections_krovak__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lib/projections/krovak */ "./node_modules/proj4/lib/projections/krovak.js");
/* harmony import */ var _lib_projections_cass__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./lib/projections/cass */ "./node_modules/proj4/lib/projections/cass.js");
/* harmony import */ var _lib_projections_laea__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./lib/projections/laea */ "./node_modules/proj4/lib/projections/laea.js");
/* harmony import */ var _lib_projections_aea__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./lib/projections/aea */ "./node_modules/proj4/lib/projections/aea.js");
/* harmony import */ var _lib_projections_gnom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./lib/projections/gnom */ "./node_modules/proj4/lib/projections/gnom.js");
/* harmony import */ var _lib_projections_cea__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./lib/projections/cea */ "./node_modules/proj4/lib/projections/cea.js");
/* harmony import */ var _lib_projections_eqc__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./lib/projections/eqc */ "./node_modules/proj4/lib/projections/eqc.js");
/* harmony import */ var _lib_projections_poly__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./lib/projections/poly */ "./node_modules/proj4/lib/projections/poly.js");
/* harmony import */ var _lib_projections_nzmg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./lib/projections/nzmg */ "./node_modules/proj4/lib/projections/nzmg.js");
/* harmony import */ var _lib_projections_mill__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./lib/projections/mill */ "./node_modules/proj4/lib/projections/mill.js");
/* harmony import */ var _lib_projections_sinu__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./lib/projections/sinu */ "./node_modules/proj4/lib/projections/sinu.js");
/* harmony import */ var _lib_projections_moll__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./lib/projections/moll */ "./node_modules/proj4/lib/projections/moll.js");
/* harmony import */ var _lib_projections_eqdc__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./lib/projections/eqdc */ "./node_modules/proj4/lib/projections/eqdc.js");
/* harmony import */ var _lib_projections_vandg__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./lib/projections/vandg */ "./node_modules/proj4/lib/projections/vandg.js");
/* harmony import */ var _lib_projections_aeqd__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./lib/projections/aeqd */ "./node_modules/proj4/lib/projections/aeqd.js");
/* harmony import */ var _lib_projections_ortho__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./lib/projections/ortho */ "./node_modules/proj4/lib/projections/ortho.js");
/* harmony import */ var _lib_projections_qsc__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./lib/projections/qsc */ "./node_modules/proj4/lib/projections/qsc.js");
/* harmony import */ var _lib_projections_robin__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./lib/projections/robin */ "./node_modules/proj4/lib/projections/robin.js");
/* harmony import */ var _lib_projections_geocent__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./lib/projections/geocent */ "./node_modules/proj4/lib/projections/geocent.js");
/* harmony import */ var _lib_projections_tpers__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./lib/projections/tpers */ "./node_modules/proj4/lib/projections/tpers.js");
/* harmony import */ var _lib_projections_geos__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./lib/projections/geos */ "./node_modules/proj4/lib/projections/geos.js");
/* harmony import */ var _lib_projections_eqearth__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./lib/projections/eqearth */ "./node_modules/proj4/lib/projections/eqearth.js");
/* harmony import */ var _lib_projections_bonne__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./lib/projections/bonne */ "./node_modules/proj4/lib/projections/bonne.js");
/* harmony import */ var _lib_projections_ob_tran__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./lib/projections/ob_tran */ "./node_modules/proj4/lib/projections/ob_tran.js");
































/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(proj4) {
  proj4.Proj.projections.add(_lib_projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"]);
  proj4.Proj.projections.add(_lib_projections_etmerc__WEBPACK_IMPORTED_MODULE_1__["default"]);
  proj4.Proj.projections.add(_lib_projections_utm__WEBPACK_IMPORTED_MODULE_2__["default"]);
  proj4.Proj.projections.add(_lib_projections_sterea__WEBPACK_IMPORTED_MODULE_3__["default"]);
  proj4.Proj.projections.add(_lib_projections_stere__WEBPACK_IMPORTED_MODULE_4__["default"]);
  proj4.Proj.projections.add(_lib_projections_somerc__WEBPACK_IMPORTED_MODULE_5__["default"]);
  proj4.Proj.projections.add(_lib_projections_omerc__WEBPACK_IMPORTED_MODULE_6__["default"]);
  proj4.Proj.projections.add(_lib_projections_lcc__WEBPACK_IMPORTED_MODULE_7__["default"]);
  proj4.Proj.projections.add(_lib_projections_krovak__WEBPACK_IMPORTED_MODULE_8__["default"]);
  proj4.Proj.projections.add(_lib_projections_cass__WEBPACK_IMPORTED_MODULE_9__["default"]);
  proj4.Proj.projections.add(_lib_projections_laea__WEBPACK_IMPORTED_MODULE_10__["default"]);
  proj4.Proj.projections.add(_lib_projections_aea__WEBPACK_IMPORTED_MODULE_11__["default"]);
  proj4.Proj.projections.add(_lib_projections_gnom__WEBPACK_IMPORTED_MODULE_12__["default"]);
  proj4.Proj.projections.add(_lib_projections_cea__WEBPACK_IMPORTED_MODULE_13__["default"]);
  proj4.Proj.projections.add(_lib_projections_eqc__WEBPACK_IMPORTED_MODULE_14__["default"]);
  proj4.Proj.projections.add(_lib_projections_poly__WEBPACK_IMPORTED_MODULE_15__["default"]);
  proj4.Proj.projections.add(_lib_projections_nzmg__WEBPACK_IMPORTED_MODULE_16__["default"]);
  proj4.Proj.projections.add(_lib_projections_mill__WEBPACK_IMPORTED_MODULE_17__["default"]);
  proj4.Proj.projections.add(_lib_projections_sinu__WEBPACK_IMPORTED_MODULE_18__["default"]);
  proj4.Proj.projections.add(_lib_projections_moll__WEBPACK_IMPORTED_MODULE_19__["default"]);
  proj4.Proj.projections.add(_lib_projections_eqdc__WEBPACK_IMPORTED_MODULE_20__["default"]);
  proj4.Proj.projections.add(_lib_projections_vandg__WEBPACK_IMPORTED_MODULE_21__["default"]);
  proj4.Proj.projections.add(_lib_projections_aeqd__WEBPACK_IMPORTED_MODULE_22__["default"]);
  proj4.Proj.projections.add(_lib_projections_ortho__WEBPACK_IMPORTED_MODULE_23__["default"]);
  proj4.Proj.projections.add(_lib_projections_qsc__WEBPACK_IMPORTED_MODULE_24__["default"]);
  proj4.Proj.projections.add(_lib_projections_robin__WEBPACK_IMPORTED_MODULE_25__["default"]);
  proj4.Proj.projections.add(_lib_projections_geocent__WEBPACK_IMPORTED_MODULE_26__["default"]);
  proj4.Proj.projections.add(_lib_projections_tpers__WEBPACK_IMPORTED_MODULE_27__["default"]);
  proj4.Proj.projections.add(_lib_projections_geos__WEBPACK_IMPORTED_MODULE_28__["default"]);
  proj4.Proj.projections.add(_lib_projections_eqearth__WEBPACK_IMPORTED_MODULE_29__["default"]);
  proj4.Proj.projections.add(_lib_projections_bonne__WEBPACK_IMPORTED_MODULE_30__["default"]);
  proj4.Proj.projections.add(_lib_projections_ob_tran__WEBPACK_IMPORTED_MODULE_31__["default"]);
}


/***/ }),

/***/ "./node_modules/wkt-parser/PROJJSONBuilder2015.js":
/*!********************************************************!*\
  !*** ./node_modules/wkt-parser/PROJJSONBuilder2015.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PROJJSONBuilderBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PROJJSONBuilderBase.js */ "./node_modules/wkt-parser/PROJJSONBuilderBase.js");


class PROJJSONBuilder2015 extends _PROJJSONBuilderBase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static convert(node, result = {}) {
    super.convert(node, result);

    // Skip `CS` and `USAGE` nodes for WKT2-2015
    if (result.coordinate_system && result.coordinate_system.subtype === 'Cartesian') {
      delete result.coordinate_system;
    }
    if (result.usage) {
      delete result.usage;
    }

    return result;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PROJJSONBuilder2015);

/***/ }),

/***/ "./node_modules/wkt-parser/PROJJSONBuilder2019.js":
/*!********************************************************!*\
  !*** ./node_modules/wkt-parser/PROJJSONBuilder2019.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PROJJSONBuilderBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PROJJSONBuilderBase.js */ "./node_modules/wkt-parser/PROJJSONBuilderBase.js");


class PROJJSONBuilder2019 extends _PROJJSONBuilderBase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static convert(node, result = {}) {
    super.convert(node, result);

    // Handle `CS` node for WKT2-2019
    const csNode = node.find((child) => Array.isArray(child) && child[0] === 'CS');
    if (csNode) {
      result.coordinate_system = {
        subtype: csNode[1],
        axis: this.extractAxes(node),
      };
    }

    // Handle `USAGE` node for WKT2-2019
    const usageNode = node.find((child) => Array.isArray(child) && child[0] === 'USAGE');
    if (usageNode) {
      const scope = usageNode.find((child) => Array.isArray(child) && child[0] === 'SCOPE');
      const area = usageNode.find((child) => Array.isArray(child) && child[0] === 'AREA');
      const bbox = usageNode.find((child) => Array.isArray(child) && child[0] === 'BBOX');
      result.usage = {};
      if (scope) {
        result.usage.scope = scope[1];
      }
      if (area) {
        result.usage.area = area[1];
      }
      if (bbox) {
        result.usage.bbox = bbox.slice(1);
      }
    }

    return result;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PROJJSONBuilder2019);

/***/ }),

/***/ "./node_modules/wkt-parser/PROJJSONBuilderBase.js":
/*!********************************************************!*\
  !*** ./node_modules/wkt-parser/PROJJSONBuilderBase.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class PROJJSONBuilderBase {
  static getId(node) {
    const idNode = node.find((child) => Array.isArray(child) && child[0] === 'ID');
    if (idNode && idNode.length >= 3) {
      return {
        authority: idNode[1],
        code: parseInt(idNode[2], 10),
      };
    }
    return null;
  }

  static convertUnit(node, type = 'unit') {
    if (!node || node.length < 3) {
      return { type, name: 'unknown', conversion_factor: null };
    }

    const name = node[1];
    const conversionFactor = parseFloat(node[2]) || null;

    const idNode = node.find((child) => Array.isArray(child) && child[0] === 'ID');
    const id = idNode
      ? {
        authority: idNode[1],
        code: parseInt(idNode[2], 10),
      }
      : null;

    return {
      type,
      name,
      conversion_factor: conversionFactor,
      id,
    };
  }

  static convertAxis(node) {
    const name = node[1] || 'Unknown';

    // Determine the direction
    let direction;
    const abbreviationMatch = name.match(/^\((.)\)$/); // Match abbreviations like "(E)" or "(N)"
    if (abbreviationMatch) {
      // Use the abbreviation to determine the direction
      const abbreviation = abbreviationMatch[1].toUpperCase();
      if (abbreviation === 'E') direction = 'east';
      else if (abbreviation === 'N') direction = 'north';
      else if (abbreviation === 'U') direction = 'up';
      else throw new Error(`Unknown axis abbreviation: ${abbreviation}`);
    } else {
      // Use the explicit direction provided in the AXIS node
      direction = node[2] ? node[2].toLowerCase() : 'unknown';
    }

    const orderNode = node.find((child) => Array.isArray(child) && child[0] === 'ORDER');
    const order = orderNode ? parseInt(orderNode[1], 10) : null;

    const unitNode = node.find(
      (child) =>
        Array.isArray(child) &&
        (child[0] === 'LENGTHUNIT' || child[0] === 'ANGLEUNIT' || child[0] === 'SCALEUNIT')
    );
    const unit = this.convertUnit(unitNode);

    return {
      name,
      direction, // Use the valid PROJJSON direction value
      unit,
      order,
    };
  }

  static extractAxes(node) {
    return node
      .filter((child) => Array.isArray(child) && child[0] === 'AXIS')
      .map((axis) => this.convertAxis(axis))
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by the "order" property
  }

  static convert(node, result = {}) {

    switch (node[0]) {
      case 'PROJCRS':
        result.type = 'ProjectedCRS';
        result.name = node[1];
        result.base_crs = node.find((child) => Array.isArray(child) && child[0] === 'BASEGEOGCRS')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'BASEGEOGCRS'))
          : null;
        result.conversion = node.find((child) => Array.isArray(child) && child[0] === 'CONVERSION')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'CONVERSION'))
          : null;

        const csNode = node.find((child) => Array.isArray(child) && child[0] === 'CS');
        if (csNode) {
          result.coordinate_system = {
            type: csNode[1],
            axis: this.extractAxes(node),
          };
        }

        const lengthUnitNode = node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT');
        if (lengthUnitNode) {
          const unit = this.convertUnit(lengthUnitNode);
          result.coordinate_system.unit = unit; // Add unit to coordinate_system
        }

        result.id = this.getId(node);
        break;

      case 'BASEGEOGCRS':
      case 'GEOGCRS':
        result.type = 'GeographicCRS';
        result.name = node[1];
      
        // Handle DATUM or ENSEMBLE
        const datumOrEnsembleNode = node.find(
          (child) => Array.isArray(child) && (child[0] === 'DATUM' || child[0] === 'ENSEMBLE')
        );
        if (datumOrEnsembleNode) {
          const datumOrEnsemble = this.convert(datumOrEnsembleNode);
          if (datumOrEnsembleNode[0] === 'ENSEMBLE') {
            result.datum_ensemble = datumOrEnsemble;
          } else {
            result.datum = datumOrEnsemble;
          }
          const primem = node.find((child) => Array.isArray(child) && child[0] === 'PRIMEM');
          if (primem && primem[1] !== 'Greenwich') {
            datumOrEnsemble.prime_meridian = {
              name: primem[1],
              longitude: parseFloat(primem[2]),
            }
          }
        }
      
        result.coordinate_system = {
          type: 'ellipsoidal',
          axis: this.extractAxes(node),
        };
      
        result.id = this.getId(node);
        break;

      case 'DATUM':
        result.type = 'GeodeticReferenceFrame';
        result.name = node[1];
        result.ellipsoid = node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID'))
          : null;
        break;
      
      case 'ENSEMBLE':
        result.type = 'DatumEnsemble';
        result.name = node[1];
      
        // Extract ensemble members
        result.members = node
          .filter((child) => Array.isArray(child) && child[0] === 'MEMBER')
          .map((member) => ({
            type: 'DatumEnsembleMember',
            name: member[1],
            id: this.getId(member), // Extract ID as { authority, code }
          }));
      
        // Extract accuracy
        const accuracyNode = node.find((child) => Array.isArray(child) && child[0] === 'ENSEMBLEACCURACY');
        if (accuracyNode) {
          result.accuracy = parseFloat(accuracyNode[1]);
        }
      
        // Extract ellipsoid
        const ellipsoidNode = node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID');
        if (ellipsoidNode) {
          result.ellipsoid = this.convert(ellipsoidNode); // Convert the ellipsoid node
        }
      
        // Extract identifier for the ensemble
        result.id = this.getId(node);
        break;

      case 'ELLIPSOID':
        result.type = 'Ellipsoid';
        result.name = node[1];
        result.semi_major_axis = parseFloat(node[2]);
        result.inverse_flattening = parseFloat(node[3]);
        const units = node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT'), result)
          : null;
        break;

      case 'CONVERSION':
        result.type = 'Conversion';
        result.name = node[1];
        result.method = node.find((child) => Array.isArray(child) && child[0] === 'METHOD')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'METHOD'))
          : null;
        result.parameters = node
          .filter((child) => Array.isArray(child) && child[0] === 'PARAMETER')
          .map((param) => this.convert(param));
        break;

      case 'METHOD':
        result.type = 'Method';
        result.name = node[1];
        result.id = this.getId(node);
        break;

      case 'PARAMETER':
        result.type = 'Parameter';
        result.name = node[1];
        result.value = parseFloat(node[2]);
        result.unit = this.convertUnit(
          node.find(
            (child) =>
              Array.isArray(child) &&
              (child[0] === 'LENGTHUNIT' || child[0] === 'ANGLEUNIT' || child[0] === 'SCALEUNIT')
          )
        );
        result.id = this.getId(node);
        break;

      case 'BOUNDCRS':
        result.type = 'BoundCRS';

        // Process SOURCECRS
        const sourceCrsNode = node.find((child) => Array.isArray(child) && child[0] === 'SOURCECRS');
        if (sourceCrsNode) {
          const sourceCrsContent = sourceCrsNode.find((child) => Array.isArray(child));
          result.source_crs = sourceCrsContent ? this.convert(sourceCrsContent) : null;
        }

        // Process TARGETCRS
        const targetCrsNode = node.find((child) => Array.isArray(child) && child[0] === 'TARGETCRS');
        if (targetCrsNode) {
          const targetCrsContent = targetCrsNode.find((child) => Array.isArray(child));
          result.target_crs = targetCrsContent ? this.convert(targetCrsContent) : null;
        }

        // Process ABRIDGEDTRANSFORMATION
        const transformationNode = node.find((child) => Array.isArray(child) && child[0] === 'ABRIDGEDTRANSFORMATION');
        if (transformationNode) {
          result.transformation = this.convert(transformationNode);
        } else {
          result.transformation = null;
        }
        break;

      case 'ABRIDGEDTRANSFORMATION':
        result.type = 'Transformation';
        result.name = node[1];
        result.method = node.find((child) => Array.isArray(child) && child[0] === 'METHOD')
          ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'METHOD'))
          : null;

        result.parameters = node
          .filter((child) => Array.isArray(child) && (child[0] === 'PARAMETER' || child[0] === 'PARAMETERFILE'))
          .map((param) => {
            if (param[0] === 'PARAMETER') {
              return this.convert(param);
            } else if (param[0] === 'PARAMETERFILE') {
              return {
                name: param[1],
                value: param[2],
                id: {
                  'authority': 'EPSG',
                  'code': 8656
                }
              };
            }
          });

        // Adjust the Scale difference parameter if present
        if (result.parameters.length === 7) {
          const scaleDifference = result.parameters[6];
          if (scaleDifference.name === 'Scale difference') {
            scaleDifference.value = Math.round((scaleDifference.value - 1) * 1e12) / 1e6;
          }
        }

        result.id = this.getId(node);
        break;
      
      case 'AXIS':
        if (!result.coordinate_system) {
          result.coordinate_system = { type: 'unspecified', axis: [] };
        }
        result.coordinate_system.axis.push(this.convertAxis(node));
        break;
      
      case 'LENGTHUNIT':
        const unit = this.convertUnit(node, 'LinearUnit');
        if (result.coordinate_system && result.coordinate_system.axis) {
          result.coordinate_system.axis.forEach((axis) => {
            if (!axis.unit) {
              axis.unit = unit;
            }
          });
        }
        if (unit.conversion_factor && unit.conversion_factor !== 1) {
          if (result.semi_major_axis) {
            result.semi_major_axis = {
              value: result.semi_major_axis,
              unit,
            }
          }
        }
        break;

      default:
        result.keyword = node[0];
        break;
    }

    return result;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PROJJSONBuilderBase);

/***/ }),

/***/ "./node_modules/wkt-parser/buildPROJJSON.js":
/*!**************************************************!*\
  !*** ./node_modules/wkt-parser/buildPROJJSON.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildPROJJSON: () => (/* binding */ buildPROJJSON)
/* harmony export */ });
/* harmony import */ var _PROJJSONBuilder2015_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PROJJSONBuilder2015.js */ "./node_modules/wkt-parser/PROJJSONBuilder2015.js");
/* harmony import */ var _PROJJSONBuilder2019_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PROJJSONBuilder2019.js */ "./node_modules/wkt-parser/PROJJSONBuilder2019.js");



/**
 * Detects the WKT2 version based on the structure of the WKT.
 * @param {Array} root The root WKT array node.
 * @returns {string} The detected version ("2015" or "2019").
 */
function detectWKT2Version(root) {
  // Check for WKT2-2019-specific nodes
  if (root.find((child) => Array.isArray(child) && child[0] === 'USAGE')) {
    return '2019'; // `USAGE` is specific to WKT2-2019
  }

  // Check for WKT2-2015-specific nodes
  if (root.find((child) => Array.isArray(child) && child[0] === 'CS')) {
    return '2015'; // `CS` is valid in both, but default to 2015 unless `USAGE` is present
  }

  if (root[0] === 'BOUNDCRS' || root[0] === 'PROJCRS' || root[0] === 'GEOGCRS') {
    return '2015'; // These are valid in both, but default to 2015
  }

  // Default to WKT2-2015 if no specific indicators are found
  return '2015';
}

/**
 * Builds a PROJJSON object from a WKT array structure.
 * @param {Array} root The root WKT array node.
 * @returns {Object} The PROJJSON object.
 */
function buildPROJJSON(root) {
  const version = detectWKT2Version(root);
  const builder = version === '2019' ? _PROJJSONBuilder2019_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _PROJJSONBuilder2015_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  return builder.convert(root);
}


/***/ }),

/***/ "./node_modules/wkt-parser/detectWKTVersion.js":
/*!*****************************************************!*\
  !*** ./node_modules/wkt-parser/detectWKTVersion.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectWKTVersion: () => (/* binding */ detectWKTVersion)
/* harmony export */ });
/**
 * Detects whether the WKT string is WKT1 or WKT2.
 * @param {string} wkt The WKT string.
 * @returns {string} The detected version ("WKT1" or "WKT2").
 */
function detectWKTVersion(wkt) {
  // Normalize the WKT string for easier keyword matching
  const normalizedWKT = wkt.toUpperCase();

  // Check for WKT2-specific keywords
  if (
    normalizedWKT.includes('PROJCRS') ||
    normalizedWKT.includes('GEOGCRS') ||
    normalizedWKT.includes('BOUNDCRS') ||
    normalizedWKT.includes('VERTCRS') ||
    normalizedWKT.includes('LENGTHUNIT') ||
    normalizedWKT.includes('ANGLEUNIT') ||
    normalizedWKT.includes('SCALEUNIT')
  ) {
    return 'WKT2';
  }

  // Check for WKT1-specific keywords
  if (
    normalizedWKT.includes('PROJCS') ||
    normalizedWKT.includes('GEOGCS') ||
    normalizedWKT.includes('LOCAL_CS') ||
    normalizedWKT.includes('VERT_CS') ||
    normalizedWKT.includes('UNIT')
  ) {
    return 'WKT1';
  }

  // Default to WKT1 if no specific indicators are found
  return 'WKT1';
}

/***/ }),

/***/ "./node_modules/wkt-parser/index.js":
/*!******************************************!*\
  !*** ./node_modules/wkt-parser/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _buildPROJJSON_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buildPROJJSON.js */ "./node_modules/wkt-parser/buildPROJJSON.js");
/* harmony import */ var _detectWKTVersion_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectWKTVersion.js */ "./node_modules/wkt-parser/detectWKTVersion.js");
/* harmony import */ var _parser_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parser.js */ "./node_modules/wkt-parser/parser.js");
/* harmony import */ var _process_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./process.js */ "./node_modules/wkt-parser/process.js");
/* harmony import */ var _transformPROJJSON_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transformPROJJSON.js */ "./node_modules/wkt-parser/transformPROJJSON.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util.js */ "./node_modules/wkt-parser/util.js");







var knownTypes = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS', 'GEOCCS', 'PROJCS', 'LOCAL_CS', 'GEODCRS',
  'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];

function rename(obj, params) {
  var outName = params[0];
  var inName = params[1];
  if (!(outName in obj) && (inName in obj)) {
    obj[outName] = obj[inName];
    if (params.length === 3) {
      obj[outName] = params[2](obj[outName]);
    }
  }
}

function cleanWKT(wkt) {
  var keys = Object.keys(wkt);
  for (var i = 0, ii = keys.length; i <ii; ++i) {
    var key = keys[i];
    // the followings are the crs defined in
    // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
    if (knownTypes.indexOf(key) !== -1) {
      setPropertiesFromWkt(wkt[key]);
    }
    if (typeof wkt[key] === 'object') {
      cleanWKT(wkt[key]);
    }
  }
}

function setPropertiesFromWkt(wkt) {
  if (wkt.AUTHORITY) {
    var authority = Object.keys(wkt.AUTHORITY)[0];
    if (authority && authority in wkt.AUTHORITY) {
      wkt.title = authority + ':' + wkt.AUTHORITY[authority];
    }
  }
  if (wkt.type === 'GEOGCS') {
    wkt.projName = 'longlat';
  } else if (wkt.type === 'LOCAL_CS') {
    wkt.projName = 'identity';
    wkt.local = true;
  } else {
    if (typeof wkt.PROJECTION === 'object') {
      wkt.projName = Object.keys(wkt.PROJECTION)[0];
    } else {
      wkt.projName = wkt.PROJECTION;
    }
  }
  if (wkt.AXIS) {
    var axisOrder = '';
    for (var i = 0, ii = wkt.AXIS.length; i < ii; ++i) {
      var axis = [wkt.AXIS[i][0].toLowerCase(), wkt.AXIS[i][1].toLowerCase()];
      if (axis[0].indexOf('north') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'north')) {
        axisOrder += 'n';
      } else if (axis[0].indexOf('south') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'south')) {
        axisOrder += 's';
      } else if (axis[0].indexOf('east') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'east')) {
        axisOrder += 'e';
      } else if (axis[0].indexOf('west') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'west')) {
        axisOrder += 'w';
      }
    }
    if (axisOrder.length === 2) {
      axisOrder += 'u';
    }
    if (axisOrder.length === 3) {
      wkt.axis = axisOrder;
    }
  }
  if (wkt.UNIT) {
    wkt.units = wkt.UNIT.name.toLowerCase();
    if (wkt.units === 'metre') {
      wkt.units = 'meter';
    }
    if (wkt.UNIT.convert) {
      if (wkt.type === 'GEOGCS') {
        if (wkt.DATUM && wkt.DATUM.SPHEROID) {
          wkt.to_meter = wkt.UNIT.convert*wkt.DATUM.SPHEROID.a;
        }
      } else {
        wkt.to_meter = wkt.UNIT.convert;
      }
    }
  }
  var geogcs = wkt.GEOGCS;
  if (wkt.type === 'GEOGCS') {
    geogcs = wkt;
  }
  if (geogcs) {
    //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
    //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
    //}
    if (geogcs.DATUM) {
      wkt.datumCode = geogcs.DATUM.name.toLowerCase();
    } else {
      wkt.datumCode = geogcs.name.toLowerCase();
    }
    if (wkt.datumCode.slice(0, 2) === 'd_') {
      wkt.datumCode = wkt.datumCode.slice(2);
    }
    if (wkt.datumCode === 'new_zealand_1949') {
      wkt.datumCode = 'nzgd49';
    }
    if (wkt.datumCode === 'wgs_1984' || wkt.datumCode === 'world_geodetic_system_1984') {
      if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
        wkt.sphere = true;
      }
      wkt.datumCode = 'wgs84';
    }
    if (wkt.datumCode === 'belge_1972') {
      wkt.datumCode = 'rnb72';
    }
    if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
      wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
      if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
        wkt.ellps = 'intl';
      }

      wkt.a = geogcs.DATUM.SPHEROID.a;
      wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
    }

    if (geogcs.DATUM && geogcs.DATUM.TOWGS84) {
      wkt.datum_params = geogcs.DATUM.TOWGS84;
    }
    if (~wkt.datumCode.indexOf('osgb_1936')) {
      wkt.datumCode = 'osgb36';
    }
    if (~wkt.datumCode.indexOf('osni_1952')) {
      wkt.datumCode = 'osni52';
    }
    if (~wkt.datumCode.indexOf('tm65')
      || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
      wkt.datumCode = 'ire65';
    }
    if (wkt.datumCode === 'ch1903+') {
      wkt.datumCode = 'ch1903';
    }
    if (~wkt.datumCode.indexOf('israel')) {
      wkt.datumCode = 'isr93';
    }
  }
  if (wkt.b && !isFinite(wkt.b)) {
    wkt.b = wkt.a;
  }
  if (wkt.rectified_grid_angle) {
    wkt.rectified_grid_angle = (0,_util_js__WEBPACK_IMPORTED_MODULE_5__.d2r)(wkt.rectified_grid_angle);
  }

  function toMeter(input) {
    var ratio = wkt.to_meter || 1;
    return input * ratio;
  }
  var renamer = function(a) {
    return rename(wkt, a);
  };
  var list = [
    ['standard_parallel_1', 'Standard_Parallel_1'],
    ['standard_parallel_1', 'Latitude of 1st standard parallel'],
    ['standard_parallel_2', 'Standard_Parallel_2'],
    ['standard_parallel_2', 'Latitude of 2nd standard parallel'],
    ['false_easting', 'False_Easting'],
    ['false_easting', 'False easting'],
    ['false-easting', 'Easting at false origin'],
    ['false_northing', 'False_Northing'],
    ['false_northing', 'False northing'],
    ['false_northing', 'Northing at false origin'],
    ['central_meridian', 'Central_Meridian'],
    ['central_meridian', 'Longitude of natural origin'],
    ['central_meridian', 'Longitude of false origin'],
    ['latitude_of_origin', 'Latitude_Of_Origin'],
    ['latitude_of_origin', 'Central_Parallel'],
    ['latitude_of_origin', 'Latitude of natural origin'],
    ['latitude_of_origin', 'Latitude of false origin'],
    ['scale_factor', 'Scale_Factor'],
    ['k0', 'scale_factor'],
    ['latitude_of_center', 'Latitude_Of_Center'],
    ['latitude_of_center', 'Latitude_of_center'],
    ['lat0', 'latitude_of_center', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['longitude_of_center', 'Longitude_Of_Center'],
    ['longitude_of_center', 'Longitude_of_center'],
    ['longc', 'longitude_of_center', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['x0', 'false_easting', toMeter],
    ['y0', 'false_northing', toMeter],
    ['long0', 'central_meridian', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['lat0', 'latitude_of_origin', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['lat0', 'standard_parallel_1', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['lat1', 'standard_parallel_1', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['lat2', 'standard_parallel_2', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['azimuth', 'Azimuth'],
    ['alpha', 'azimuth', _util_js__WEBPACK_IMPORTED_MODULE_5__.d2r],
    ['srsCode', 'name']
  ];
  list.forEach(renamer);
  (0,_util_js__WEBPACK_IMPORTED_MODULE_5__.applyProjectionDefaults)(wkt);
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(wkt) {
  if (typeof wkt === 'object') {
    return (0,_transformPROJJSON_js__WEBPACK_IMPORTED_MODULE_4__.transformPROJJSON)(wkt);
  }
  const version = (0,_detectWKTVersion_js__WEBPACK_IMPORTED_MODULE_1__.detectWKTVersion)(wkt);
  var lisp = (0,_parser_js__WEBPACK_IMPORTED_MODULE_2__["default"])(wkt);
  if (version === 'WKT2') {
    const projjson = (0,_buildPROJJSON_js__WEBPACK_IMPORTED_MODULE_0__.buildPROJJSON)(lisp);
    return (0,_transformPROJJSON_js__WEBPACK_IMPORTED_MODULE_4__.transformPROJJSON)(projjson);
  }
  var type = lisp[0];
  var obj = {};
  (0,_process_js__WEBPACK_IMPORTED_MODULE_3__.sExpr)(lisp, obj);
  cleanWKT(obj);
  return obj[type];
}


/***/ }),

/***/ "./node_modules/wkt-parser/parser.js":
/*!*******************************************!*\
  !*** ./node_modules/wkt-parser/parser.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parseString);

var NEUTRAL = 1;
var KEYWORD = 2;
var NUMBER = 3;
var QUOTED = 4;
var AFTERQUOTE = 5;
var ENDED = -1;
var whitespace = /\s/;
var latin = /[A-Za-z]/;
var keyword = /[A-Za-z84_]/;
var endThings = /[,\]]/;
var digets = /[\d\.E\-\+]/;
// const ignoredChar = /[\s_\-\/\(\)]/g;
function Parser(text) {
  if (typeof text !== 'string') {
    throw new Error('not a string');
  }
  this.text = text.trim();
  this.level = 0;
  this.place = 0;
  this.root = null;
  this.stack = [];
  this.currentObject = null;
  this.state = NEUTRAL;
}
Parser.prototype.readCharicter = function() {
  var char = this.text[this.place++];
  if (this.state !== QUOTED) {
    while (whitespace.test(char)) {
      if (this.place >= this.text.length) {
        return;
      }
      char = this.text[this.place++];
    }
  }
  switch (this.state) {
    case NEUTRAL:
      return this.neutral(char);
    case KEYWORD:
      return this.keyword(char)
    case QUOTED:
      return this.quoted(char);
    case AFTERQUOTE:
      return this.afterquote(char);
    case NUMBER:
      return this.number(char);
    case ENDED:
      return;
  }
};
Parser.prototype.afterquote = function(char) {
  if (char === '"') {
    this.word += '"';
    this.state = QUOTED;
    return;
  }
  if (endThings.test(char)) {
    this.word = this.word.trim();
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in afterquote yet, index ' + this.place);
};
Parser.prototype.afterItem = function(char) {
  if (char === ',') {
    if (this.word !== null) {
      this.currentObject.push(this.word);
    }
    this.word = null;
    this.state = NEUTRAL;
    return;
  }
  if (char === ']') {
    this.level--;
    if (this.word !== null) {
      this.currentObject.push(this.word);
      this.word = null;
    }
    this.state = NEUTRAL;
    this.currentObject = this.stack.pop();
    if (!this.currentObject) {
      this.state = ENDED;
    }

    return;
  }
};
Parser.prototype.number = function(char) {
  if (digets.test(char)) {
    this.word += char;
    return;
  }
  if (endThings.test(char)) {
    this.word = parseFloat(this.word);
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in number yet, index ' + this.place);
};
Parser.prototype.quoted = function(char) {
  if (char === '"') {
    this.state = AFTERQUOTE;
    return;
  }
  this.word += char;
  return;
};
Parser.prototype.keyword = function(char) {
  if (keyword.test(char)) {
    this.word += char;
    return;
  }
  if (char === '[') {
    var newObjects = [];
    newObjects.push(this.word);
    this.level++;
    if (this.root === null) {
      this.root = newObjects;
    } else {
      this.currentObject.push(newObjects);
    }
    this.stack.push(this.currentObject);
    this.currentObject = newObjects;
    this.state = NEUTRAL;
    return;
  }
  if (endThings.test(char)) {
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in keyword yet, index ' + this.place);
};
Parser.prototype.neutral = function(char) {
  if (latin.test(char)) {
    this.word = char;
    this.state = KEYWORD;
    return;
  }
  if (char === '"') {
    this.word = '';
    this.state = QUOTED;
    return;
  }
  if (digets.test(char)) {
    this.word = char;
    this.state = NUMBER;
    return;
  }
  if (endThings.test(char)) {
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in neutral yet, index ' + this.place);
};
Parser.prototype.output = function() {
  while (this.place < this.text.length) {
    this.readCharicter();
  }
  if (this.state === ENDED) {
    return this.root;
  }
  throw new Error('unable to parse string "' +this.text + '". State is ' + this.state);
};

function parseString(txt) {
  var parser = new Parser(txt);
  return parser.output();
}


/***/ }),

/***/ "./node_modules/wkt-parser/process.js":
/*!********************************************!*\
  !*** ./node_modules/wkt-parser/process.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sExpr: () => (/* binding */ sExpr)
/* harmony export */ });


function mapit(obj, key, value) {
  if (Array.isArray(key)) {
    value.unshift(key);
    key = null;
  }
  var thing = key ? {} : obj;

  var out = value.reduce(function(newObj, item) {
    sExpr(item, newObj);
    return newObj
  }, thing);
  if (key) {
    obj[key] = out;
  }
}

function sExpr(v, obj) {
  if (!Array.isArray(v)) {
    obj[v] = true;
    return;
  }
  var key = v.shift();
  if (key === 'PARAMETER') {
    key = v.shift();
  }
  if (v.length === 1) {
    if (Array.isArray(v[0])) {
      obj[key] = {};
      sExpr(v[0], obj[key]);
      return;
    }
    obj[key] = v[0];
    return;
  }
  if (!v.length) {
    obj[key] = true;
    return;
  }
  if (key === 'TOWGS84') {
    obj[key] = v;
    return;
  }
  if (key === 'AXIS') {
    if (!(key in obj)) {
      obj[key] = [];
    }
    obj[key].push(v);
    return;
  }
  if (!Array.isArray(key)) {
    obj[key] = {};
  }

  var i;
  switch (key) {
    case 'UNIT':
    case 'PRIMEM':
    case 'VERT_DATUM':
      obj[key] = {
        name: v[0].toLowerCase(),
        convert: v[1]
      };
      if (v.length === 3) {
        sExpr(v[2], obj[key]);
      }
      return;
    case 'SPHEROID':
    case 'ELLIPSOID':
      obj[key] = {
        name: v[0],
        a: v[1],
        rf: v[2]
      };
      if (v.length === 4) {
        sExpr(v[3], obj[key]);
      }
      return;
    case 'EDATUM':
    case 'ENGINEERINGDATUM':
    case 'LOCAL_DATUM':
    case 'DATUM':
    case 'VERT_CS':
    case 'VERTCRS':
    case 'VERTICALCRS':
      v[0] = ['name', v[0]];
      mapit(obj, key, v);
      return;
    case 'COMPD_CS':
    case 'COMPOUNDCRS':
    case 'FITTED_CS':
    // the followings are the crs defined in
    // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
    case 'PROJECTEDCRS':
    case 'PROJCRS':
    case 'GEOGCS':
    case 'GEOCCS':
    case 'PROJCS':
    case 'LOCAL_CS':
    case 'GEODCRS':
    case 'GEODETICCRS':
    case 'GEODETICDATUM':
    case 'ENGCRS':
    case 'ENGINEERINGCRS':
      v[0] = ['name', v[0]];
      mapit(obj, key, v);
      obj[key].type = key;
      return;
    default:
      i = -1;
      while (++i < v.length) {
        if (!Array.isArray(v[i])) {
          return sExpr(v, obj[key]);
        }
      }
      return mapit(obj, key, v);
  }
}


/***/ }),

/***/ "./node_modules/wkt-parser/transformPROJJSON.js":
/*!******************************************************!*\
  !*** ./node_modules/wkt-parser/transformPROJJSON.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   transformPROJJSON: () => (/* binding */ transformPROJJSON)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./node_modules/wkt-parser/util.js");


// Helper function to process units and to_meter
function processUnit(unit) {
  let result = { units: null, to_meter: undefined };

  if (typeof unit === 'string') {
    result.units = unit.toLowerCase();
    if (result.units === 'metre') {
      result.units = 'meter'; // Normalize 'metre' to 'meter'
    }
    if (result.units === 'meter') {
      result.to_meter = 1; // Only set to_meter if units are 'meter'
    }
  } else if (unit && unit.name) {
    result.units = unit.name.toLowerCase();
    if (result.units === 'metre') {
      result.units = 'meter'; // Normalize 'metre' to 'meter'
    }
    result.to_meter = unit.conversion_factor;
  }

  return result;
}

function toValue(valueOrObject) {
  if (typeof valueOrObject === 'object') {
    return valueOrObject.value * valueOrObject.unit.conversion_factor;
  }
  return valueOrObject;
}

function calculateEllipsoid(value, result) {
  if (value.ellipsoid.radius) {
    result.a = value.ellipsoid.radius;
    result.rf = 0;
  } else {
    result.a = toValue(value.ellipsoid.semi_major_axis);
    if (value.ellipsoid.inverse_flattening !== undefined) {
      result.rf = value.ellipsoid.inverse_flattening;
    } else if (value.ellipsoid.semi_major_axis !== undefined && value.ellipsoid.semi_minor_axis !== undefined) {
      result.rf = result.a / (result.a - toValue(value.ellipsoid.semi_minor_axis));
    }
  }
}

function transformPROJJSON(projjson, result = {}) {
  if (!projjson || typeof projjson !== 'object') {
    return projjson; // Return primitive values as-is
  }

  if (projjson.type === 'BoundCRS') {
    transformPROJJSON(projjson.source_crs, result);

    if (projjson.transformation) {
      if (projjson.transformation.method && projjson.transformation.method.name === 'NTv2') {
        // Set nadgrids to the filename from the parameterfile
        result.nadgrids = projjson.transformation.parameters[0].value;
      } else {
        // Populate datum_params if no parameterfile is found
        result.datum_params = projjson.transformation.parameters.map((param) => param.value);
      }
    }
    return result; // Return early for BoundCRS
  }

  // Handle specific keys in PROJJSON
  Object.keys(projjson).forEach((key) => {
    const value = projjson[key];
    if (value === null) {
      return;
    }

    switch (key) {
      case 'name':
        if (result.srsCode) {
          break;
        }
        result.name = value;
        result.srsCode = value; // Map `name` to `srsCode`
        break;

      case 'type':
        if (value === 'GeographicCRS') {
          result.projName = 'longlat';
        } else if (value === 'ProjectedCRS' && projjson.conversion && projjson.conversion.method) {
          result.projName = projjson.conversion.method.name; // Retain original capitalization
        }
        break;

      case 'datum':
      case 'datum_ensemble': // Handle both datum and ensemble
        if (value.ellipsoid) {
          // Extract ellipsoid properties
          result.ellps = value.ellipsoid.name;
          calculateEllipsoid(value, result);
        }
        if (value.prime_meridian) {
          result.from_greenwich = value.prime_meridian.longitude * Math.PI / 180; // Convert to radians
        }
        break;

      case 'ellipsoid':
        result.ellps = value.name;
        calculateEllipsoid(value, result);
        break;

      case 'prime_meridian':
        result.long0 = (value.longitude || 0) * Math.PI / 180; // Convert to radians
        break;

      case 'coordinate_system':
        if (value.axis) {
          result.axis = value.axis
            .map((axis) => {
              const direction = axis.direction;
              if (direction === 'east') return 'e';
              if (direction === 'north') return 'n';
              if (direction === 'west') return 'w';
              if (direction === 'south') return 's';
              throw new Error(`Unknown axis direction: ${direction}`);
            })
            .join('') + 'u'; // Combine into a single string (e.g., "enu")

          if (value.unit) {
            const { units, to_meter } = processUnit(value.unit);
            result.units = units;
            result.to_meter = to_meter;
          } else if (value.axis[0] && value.axis[0].unit) {
            const { units, to_meter } = processUnit(value.axis[0].unit);
            result.units = units;
            result.to_meter = to_meter;
          }
        }
        break;
        
      case 'id':
        if (value.authority && value.code) {
          result.title = value.authority + ':' + value.code;
        }
        break;

      case 'conversion':
        if (value.method && value.method.name) {
          result.projName = value.method.name; // Retain original capitalization
        }
        if (value.parameters) {
          value.parameters.forEach((param) => {
            const paramName = param.name.toLowerCase().replace(/\s+/g, '_');
            const paramValue = param.value;
            if (param.unit && param.unit.conversion_factor) {
              result[paramName] = paramValue * param.unit.conversion_factor; // Convert to radians or meters
            } else if (param.unit === 'degree') {
              result[paramName] = paramValue * Math.PI / 180; // Convert to radians
            } else {
              result[paramName] = paramValue;
            }
          });
        }
        break;

      case 'unit':
        if (value.name) {
          result.units = value.name.toLowerCase();
          if (result.units === 'metre') {
            result.units = 'meter';
          }
        }
        if (value.conversion_factor) {
          result.to_meter = value.conversion_factor;
        }
        break;

      case 'base_crs':
        transformPROJJSON(value, result); // Pass `result` directly
        result.datumCode = value.id ? value.id.authority + '_' + value.id.code : value.name; // Set datumCode
        break;

      default:
        // Ignore irrelevant or unneeded properties
        break;
    }
  });

  // Additional calculated properties
  if (result.latitude_of_false_origin !== undefined) {
    result.lat0 = result.latitude_of_false_origin; // Already in radians
  }
  if (result.longitude_of_false_origin !== undefined) {
    result.long0 = result.longitude_of_false_origin;
  }
  if (result.latitude_of_standard_parallel !== undefined) {
    result.lat0 = result.latitude_of_standard_parallel;
    result.lat1 = result.latitude_of_standard_parallel;
  }
  if (result.latitude_of_1st_standard_parallel !== undefined) {
    result.lat1 = result.latitude_of_1st_standard_parallel;
  }
  if (result.latitude_of_2nd_standard_parallel !== undefined) {
    result.lat2 = result.latitude_of_2nd_standard_parallel; 
  }
  if (result.latitude_of_projection_centre !== undefined) {
    result.lat0 = result.latitude_of_projection_centre;
  }
  if (result.longitude_of_projection_centre !== undefined) {
    result.longc = result.longitude_of_projection_centre;
  }
  if (result.easting_at_false_origin !== undefined) {
    result.x0 = result.easting_at_false_origin;
  }
  if (result.northing_at_false_origin !== undefined) {
    result.y0 = result.northing_at_false_origin;
  }
  if (result.latitude_of_natural_origin !== undefined) {
    result.lat0 = result.latitude_of_natural_origin;
  }
  if (result.longitude_of_natural_origin !== undefined) {
    result.long0 = result.longitude_of_natural_origin;
  }
  if (result.longitude_of_origin !== undefined) {
    result.long0 = result.longitude_of_origin;
  }
  if (result.false_easting !== undefined) {
    result.x0 = result.false_easting;
  }
  if (result.easting_at_projection_centre) {
    result.x0 = result.easting_at_projection_centre;
  }
  if (result.false_northing !== undefined) {
    result.y0 = result.false_northing;
  }
  if (result.northing_at_projection_centre) {
    result.y0 = result.northing_at_projection_centre;
  }
  if (result.standard_parallel_1 !== undefined) {
    result.lat1 = result.standard_parallel_1;
  }
  if (result.standard_parallel_2 !== undefined) {
    result.lat2 = result.standard_parallel_2;
  }
  if (result.scale_factor_at_natural_origin !== undefined) {
    result.k0 = result.scale_factor_at_natural_origin;
  }
  if (result.scale_factor_at_projection_centre !== undefined) {
    result.k0 = result.scale_factor_at_projection_centre;
  }
  if (result.scale_factor_on_pseudo_standard_parallel !== undefined) {  
    result.k0 = result.scale_factor_on_pseudo_standard_parallel;
  }
  if (result.azimuth !== undefined) {
    result.alpha = result.azimuth;
  }
  if (result.azimuth_at_projection_centre !== undefined) {
    result.alpha = result.azimuth_at_projection_centre;
  }
  if (result.angle_from_rectified_to_skew_grid) {
    result.rectified_grid_angle = result.angle_from_rectified_to_skew_grid;
  }

  // Apply projection defaults
  (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.applyProjectionDefaults)(result);

  return result;
}

/***/ }),

/***/ "./node_modules/wkt-parser/util.js":
/*!*****************************************!*\
  !*** ./node_modules/wkt-parser/util.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyProjectionDefaults: () => (/* binding */ applyProjectionDefaults),
/* harmony export */   d2r: () => (/* binding */ d2r)
/* harmony export */ });
var D2R = 0.01745329251994329577;

function d2r(input) {
  return input * D2R;
}

function applyProjectionDefaults(wkt) {
  // Normalize projName for WKT2 compatibility
  const normalizedProjName = (wkt.projName || '').toLowerCase().replace(/_/g, ' ');

  if (!wkt.long0 && wkt.longc && (normalizedProjName === 'albers conic equal area' || normalizedProjName === 'lambert azimuthal equal area')) {
    wkt.long0 = wkt.longc;
  }
  if (!wkt.lat_ts && wkt.lat1 && (normalizedProjName === 'stereographic south pole' || normalizedProjName === 'polar stereographic (variant b)')) {
    wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
    wkt.lat_ts = wkt.lat1;
    delete wkt.lat1;
  } else if (!wkt.lat_ts && wkt.lat0 && (normalizedProjName === 'polar stereographic' || normalizedProjName === 'polar stereographic (variant a)')) {
    wkt.lat_ts = wkt.lat0;
    wkt.lat0 = d2r(wkt.lat0 > 0 ? 90 : -90);
    delete wkt.lat1;
  }
}

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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEuronymeLabelLayer: () => (/* binding */ getEuronymeLabelLayer),
/* harmony export */   getEurostatBoundariesLayer: () => (/* binding */ getEurostatBoundariesLayer),
/* harmony export */   giscoBackgroundLayer: () => (/* binding */ giscoBackgroundLayer),
/* harmony export */   proj3035: () => (/* binding */ proj3035)
/* harmony export */ });
/* harmony import */ var proj4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! proj4 */ "./node_modules/proj4/lib/index.js");
//@ts-check


;

// EPSG:3035 definition
proj4__WEBPACK_IMPORTED_MODULE_0__["default"].defs("EPSG:3035",
  "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs"
);
const transform = (0,proj4__WEBPACK_IMPORTED_MODULE_0__["default"])(proj4__WEBPACK_IMPORTED_MODULE_0__["default"].WGS84, "EPSG:3035");

/**
 * Projection function for European LAEA.
 * From [lon,lat] to [x,y]
 */
const proj3035 = transform.forward;


//test
//console.log(proj3035([33.003, 34.747]))
//1615067,2  6415728,5


//import { geoAzimuthalEqualArea } from 'd3-geo'
//"d3-geo": "^3.0.1",

/*export const proj3035 = geoAzimuthalEqualArea()
    .rotate([-10, -52])
    .reflectX(false)
    .reflectY(true)
    .scale(6370997) //6378137
    .translate([4321000, 3210000])
*/




/**
 * Returns options for gridviz label layer.
 * From Euronym data: https://github.com/eurostat/euronym
 *
 * @returns {object}
 */
const getEuronymeLabelLayer = function (cc = 'EUR', res = 50, opts={}) {
    opts = opts || {}
    const ex = opts.ex || 1.2
    const fontFamily = opts.fontFamily || 'Arial'
    const exSize = opts.exSize || 1.2
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
        const p = opts.proj([+lb.lon, +lb.lat])
        lb.x = p[0]
        lb.y = p[1]
        delete lb.lon
        delete lb.lat
    }
    opts.baseURL = opts.baseURL || 'https://raw.githubusercontent.com/eurostat/euronym/main/pub/v3/UTF_LATIN/'
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
    const nutsYear = opts.nutsYear || '2024'
    const geo = opts.geo
    const crs = opts.crs || '3035'
    const scale = opts.scale || '03M'
    const nutsLevel = opts.nutsLevel || '3'
    const col = opts.col || '#888'
    const colKosovo = opts.colKosovo || '#bcbcbc'
    const showOth = opts.showOth == undefined ? true : opts.showOth

    //in most cases, already projected data of nuts2json will be used, using 'opts.crs'
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
            //return col
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
    opts.url = opts.baseURL + nutsYear + (geo ? '/' + geo : '') + '/' + crs + '/' + scale + '/nutsbn_' + nutsLevel + '.json'
    return opts
}



//prepare object for gisco background layer creation
//see https://gisco-services.ec.europa.eu/maps/demo/?wmts_layer=OSMPositronBackground&format=png&srs=EPSG%3A3035
function giscoBackgroundLayer(map = "OSMPositronBackground", depth = 19, crs = "EPSG3035", template = {}) {
    template.url = "https://gisco-services.ec.europa.eu/maps/tiles/" + map + "/" + crs + "/"
    template.resolutions = Array.from({ length: depth }, (_, i) => 156543.03392804097 * Math.pow(2, -i))
    template.origin = [0, 6000000]
    return template
}


})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHZpei1ldXJvc3RhdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFFBQVE7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxRQUFRO0FBQ1o7QUFDQTs7QUFFQSxZQUFZO0FBQ1osWUFBWTtBQUNaLFlBQVk7QUFDWixZQUFZO0FBQ1osWUFBWTtBQUNaLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCO0FBQ087QUFDUCw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUI7QUFDckIsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBLCtDQUErQztBQUMvQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ2h3Q3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEs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dURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxhQUFhO0FBQ3RFLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7O0FBRUEsa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLG1CQUFtQixFOzs7Ozs7Ozs7Ozs7Ozs7O0FDNVR5QjtBQUNBOztBQUUzRDtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNPO0FBQ1A7QUFDQSx1Q0FBdUMsK0RBQW1CLEdBQUcsK0RBQW1CO0FBQ2hGO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkNtRDtBQUNNO0FBQ3hCO0FBQ0U7QUFDd0I7QUFDRjs7QUFFekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsNkNBQUc7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyx5Q0FBRztBQUN0QztBQUNBO0FBQ0EscUNBQXFDLHlDQUFHO0FBQ3hDO0FBQ0E7QUFDQSxrQ0FBa0MseUNBQUc7QUFDckMsbUNBQW1DLHlDQUFHO0FBQ3RDLG9DQUFvQyx5Q0FBRztBQUN2QyxvQ0FBb0MseUNBQUc7QUFDdkMsb0NBQW9DLHlDQUFHO0FBQ3ZDO0FBQ0EseUJBQXlCLHlDQUFHO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLEVBQUUsaUVBQXVCO0FBQ3pCO0FBQ0EsNkJBQWUsb0NBQVM7QUFDeEI7QUFDQSxXQUFXLHdFQUFpQjtBQUM1QjtBQUNBLGtCQUFrQixzRUFBZ0I7QUFDbEMsYUFBYSxzREFBTTtBQUNuQjtBQUNBLHFCQUFxQixnRUFBYTtBQUNsQyxXQUFXLHdFQUFpQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxFQUFFLGtEQUFLO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUMxTkEsaUVBQWUsV0FBVyxFQUFDOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNPLHdHQUF3RztBQUMvRztBQUNBLHdDQUF3QyxlQUFlO0FBQ3ZEO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvbWdycy9tZ3JzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL1BvaW50LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL1Byb2ouanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvYWRqdXN0X2F4aXMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY2hlY2tTYW5pdHkuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2FkanVzdF9sYXQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2FkanVzdF9sb24uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2FkanVzdF96b25lLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9hc2luaHkuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2FzaW56LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9jbGVucy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vY2xlbnNfY21wbHguanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2Nvc2guanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2UwZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2UxZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2UyZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2UzZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2dOLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9nYXRnLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9oeXBvdC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vaW1sZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2lxc2Zuei5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vbG9nMXB5LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9tbGZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9tc2Zuei5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vcGhpMnouanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3BqX2VuZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3BqX2ludl9tbGZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9wal9tbGZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9xc2Zuei5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vc2lnbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vc2luaC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vc3JhdC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vdG9Qb2ludC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vdHNmbnouanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3ZpbmNlbnR5LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy9EYXR1bS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb25zdGFudHMvRWxsaXBzb2lkLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy9QcmltZU1lcmlkaWFuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy91bml0cy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb25zdGFudHMvdmFsdWVzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvcmUuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGF0dW0uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGF0dW1VdGlscy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9kYXR1bV90cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGVmcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9kZXJpdmVDb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZXh0ZW5kLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9tYXRjaC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9uYWRncmlkLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3BhcnNlQ29kZS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qU3RyaW5nLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2FlYS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9hZXFkLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2Jvbm5lLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2Nhc3MuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvY2VhLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2VxYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9lcWRjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2VxZWFydGguanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZXRtZXJjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2dhdXNzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2dlb2NlbnQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZ2Vvcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9nbm9tLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2tyb3Zhay5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9sYWVhLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2xjYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9sb25nbGF0LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL21lcmMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbWlsbC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9tb2xsLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL256bWcuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvb2JfdHJhbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9vbWVyYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9vcnRoby5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9wb2x5LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3FzYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9yb2Jpbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9zaW51LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3NvbWVyYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9zdGVyZS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9zdGVyZWEuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvdG1lcmMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvdHBlcnMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvdXRtLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3ZhbmRnLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L3Byb2pzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9QUk9KSlNPTkJ1aWxkZXIyMDE1LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9QUk9KSlNPTkJ1aWxkZXIyMDE5LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9QUk9KSlNPTkJ1aWxkZXJCYXNlLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9idWlsZFBST0pKU09OLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9kZXRlY3RXS1RWZXJzaW9uLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvcGFyc2VyLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9wcm9jZXNzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci90cmFuc2Zvcm1QUk9KSlNPTi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJncmlkdml6X2V1cm9zdGF0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImdyaWR2aXpfZXVyb3N0YXRcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiXG5cblxuLyoqXG4gKiBVVE0gem9uZXMgYXJlIGdyb3VwZWQsIGFuZCBhc3NpZ25lZCB0byBvbmUgb2YgYSBncm91cCBvZiA2XG4gKiBzZXRzLlxuICpcbiAqIHtpbnR9IEBwcml2YXRlXG4gKi9cbnZhciBOVU1fMTAwS19TRVRTID0gNjtcblxuLyoqXG4gKiBUaGUgY29sdW1uIGxldHRlcnMgKGZvciBlYXN0aW5nKSBvZiB0aGUgbG93ZXIgbGVmdCB2YWx1ZSwgcGVyXG4gKiBzZXQuXG4gKlxuICoge3N0cmluZ30gQHByaXZhdGVcbiAqL1xudmFyIFNFVF9PUklHSU5fQ09MVU1OX0xFVFRFUlMgPSAnQUpTQUpTJztcblxuLyoqXG4gKiBUaGUgcm93IGxldHRlcnMgKGZvciBub3J0aGluZykgb2YgdGhlIGxvd2VyIGxlZnQgdmFsdWUsIHBlclxuICogc2V0LlxuICpcbiAqIHtzdHJpbmd9IEBwcml2YXRlXG4gKi9cbnZhciBTRVRfT1JJR0lOX1JPV19MRVRURVJTID0gJ0FGQUZBRic7XG5cbnZhciBBID0gNjU7IC8vIEFcbnZhciBJID0gNzM7IC8vIElcbnZhciBPID0gNzk7IC8vIE9cbnZhciBWID0gODY7IC8vIFZcbnZhciBaID0gOTA7IC8vIFpcbmV4cG9ydCBkZWZhdWx0IHtcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgdG9Qb2ludDogdG9Qb2ludFxufTtcbi8qKlxuICogQ29udmVyc2lvbiBvZiBsYXQvbG9uIHRvIE1HUlMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGxsIE9iamVjdCBsaXRlcmFsIHdpdGggbGF0IGFuZCBsb24gcHJvcGVydGllcyBvbiBhXG4gKiAgICAgV0dTODQgZWxsaXBzb2lkLlxuICogQHBhcmFtIHtpbnR9IGFjY3VyYWN5IEFjY3VyYWN5IGluIGRpZ2l0cyAoNSBmb3IgMSBtLCA0IGZvciAxMCBtLCAzIGZvclxuICogICAgICAxMDAgbSwgMiBmb3IgMTAwMCBtIG9yIDEgZm9yIDEwMDAwIG0pLiBPcHRpb25hbCwgZGVmYXVsdCBpcyA1LlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgTUdSUyBzdHJpbmcgZm9yIHRoZSBnaXZlbiBsb2NhdGlvbiBhbmQgYWNjdXJhY3kuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKGxsLCBhY2N1cmFjeSkge1xuICBhY2N1cmFjeSA9IGFjY3VyYWN5IHx8IDU7IC8vIGRlZmF1bHQgYWNjdXJhY3kgMW1cbiAgcmV0dXJuIGVuY29kZShMTHRvVVRNKHtcbiAgICBsYXQ6IGxsWzFdLFxuICAgIGxvbjogbGxbMF1cbiAgfSksIGFjY3VyYWN5KTtcbn07XG5cbi8qKlxuICogQ29udmVyc2lvbiBvZiBNR1JTIHRvIGxhdC9sb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ncnMgTUdSUyBzdHJpbmcuXG4gKiBAcmV0dXJuIHthcnJheX0gQW4gYXJyYXkgd2l0aCBsZWZ0IChsb25naXR1ZGUpLCBib3R0b20gKGxhdGl0dWRlKSwgcmlnaHRcbiAqICAgICAobG9uZ2l0dWRlKSBhbmQgdG9wIChsYXRpdHVkZSkgdmFsdWVzIGluIFdHUzg0LCByZXByZXNlbnRpbmcgdGhlXG4gKiAgICAgYm91bmRpbmcgYm94IGZvciB0aGUgcHJvdmlkZWQgTUdSUyByZWZlcmVuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKG1ncnMpIHtcbiAgdmFyIGJib3ggPSBVVE10b0xMKGRlY29kZShtZ3JzLnRvVXBwZXJDYXNlKCkpKTtcbiAgaWYgKGJib3gubGF0ICYmIGJib3gubG9uKSB7XG4gICAgcmV0dXJuIFtiYm94LmxvbiwgYmJveC5sYXQsIGJib3gubG9uLCBiYm94LmxhdF07XG4gIH1cbiAgcmV0dXJuIFtiYm94LmxlZnQsIGJib3guYm90dG9tLCBiYm94LnJpZ2h0LCBiYm94LnRvcF07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9Qb2ludChtZ3JzKSB7XG4gIHZhciBiYm94ID0gVVRNdG9MTChkZWNvZGUobWdycy50b1VwcGVyQ2FzZSgpKSk7XG4gIGlmIChiYm94LmxhdCAmJiBiYm94Lmxvbikge1xuICAgIHJldHVybiBbYmJveC5sb24sIGJib3gubGF0XTtcbiAgfVxuICByZXR1cm4gWyhiYm94LmxlZnQgKyBiYm94LnJpZ2h0KSAvIDIsIChiYm94LnRvcCArIGJib3guYm90dG9tKSAvIDJdO1xufTtcbi8qKlxuICogQ29udmVyc2lvbiBmcm9tIGRlZ3JlZXMgdG8gcmFkaWFucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRlZyB0aGUgYW5nbGUgaW4gZGVncmVlcy5cbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIGFuZ2xlIGluIHJhZGlhbnMuXG4gKi9cbmZ1bmN0aW9uIGRlZ1RvUmFkKGRlZykge1xuICByZXR1cm4gKGRlZyAqIChNYXRoLlBJIC8gMTgwLjApKTtcbn1cblxuLyoqXG4gKiBDb252ZXJzaW9uIGZyb20gcmFkaWFucyB0byBkZWdyZWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkIHRoZSBhbmdsZSBpbiByYWRpYW5zLlxuICogQHJldHVybiB7bnVtYmVyfSB0aGUgYW5nbGUgaW4gZGVncmVlcy5cbiAqL1xuZnVuY3Rpb24gcmFkVG9EZWcocmFkKSB7XG4gIHJldHVybiAoMTgwLjAgKiAocmFkIC8gTWF0aC5QSSkpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgc2V0IG9mIExvbmdpdHVkZSBhbmQgTGF0aXR1ZGUgY28tb3JkaW5hdGVzIHRvIFVUTVxuICogdXNpbmcgdGhlIFdHUzg0IGVsbGlwc29pZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtvYmplY3R9IGxsIE9iamVjdCBsaXRlcmFsIHdpdGggbGF0IGFuZCBsb24gcHJvcGVydGllc1xuICogICAgIHJlcHJlc2VudGluZyB0aGUgV0dTODQgY29vcmRpbmF0ZSB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcmV0dXJuIHtvYmplY3R9IE9iamVjdCBsaXRlcmFsIGNvbnRhaW5pbmcgdGhlIFVUTSB2YWx1ZSB3aXRoIGVhc3RpbmcsXG4gKiAgICAgbm9ydGhpbmcsIHpvbmVOdW1iZXIgYW5kIHpvbmVMZXR0ZXIgcHJvcGVydGllcywgYW5kIGFuIG9wdGlvbmFsXG4gKiAgICAgYWNjdXJhY3kgcHJvcGVydHkgaW4gZGlnaXRzLiBSZXR1cm5zIG51bGwgaWYgdGhlIGNvbnZlcnNpb24gZmFpbGVkLlxuICovXG5mdW5jdGlvbiBMTHRvVVRNKGxsKSB7XG4gIHZhciBMYXQgPSBsbC5sYXQ7XG4gIHZhciBMb25nID0gbGwubG9uO1xuICB2YXIgYSA9IDYzNzgxMzcuMDsgLy9lbGxpcC5yYWRpdXM7XG4gIHZhciBlY2NTcXVhcmVkID0gMC4wMDY2OTQzODsgLy9lbGxpcC5lY2NzcTtcbiAgdmFyIGswID0gMC45OTk2O1xuICB2YXIgTG9uZ09yaWdpbjtcbiAgdmFyIGVjY1ByaW1lU3F1YXJlZDtcbiAgdmFyIE4sIFQsIEMsIEEsIE07XG4gIHZhciBMYXRSYWQgPSBkZWdUb1JhZChMYXQpO1xuICB2YXIgTG9uZ1JhZCA9IGRlZ1RvUmFkKExvbmcpO1xuICB2YXIgTG9uZ09yaWdpblJhZDtcbiAgdmFyIFpvbmVOdW1iZXI7XG4gIC8vIChpbnQpXG4gIFpvbmVOdW1iZXIgPSBNYXRoLmZsb29yKChMb25nICsgMTgwKSAvIDYpICsgMTtcblxuICAvL01ha2Ugc3VyZSB0aGUgbG9uZ2l0dWRlIDE4MC4wMCBpcyBpbiBab25lIDYwXG4gIGlmIChMb25nID09PSAxODApIHtcbiAgICBab25lTnVtYmVyID0gNjA7XG4gIH1cblxuICAvLyBTcGVjaWFsIHpvbmUgZm9yIE5vcndheVxuICBpZiAoTGF0ID49IDU2LjAgJiYgTGF0IDwgNjQuMCAmJiBMb25nID49IDMuMCAmJiBMb25nIDwgMTIuMCkge1xuICAgIFpvbmVOdW1iZXIgPSAzMjtcbiAgfVxuXG4gIC8vIFNwZWNpYWwgem9uZXMgZm9yIFN2YWxiYXJkXG4gIGlmIChMYXQgPj0gNzIuMCAmJiBMYXQgPCA4NC4wKSB7XG4gICAgaWYgKExvbmcgPj0gMC4wICYmIExvbmcgPCA5LjApIHtcbiAgICAgIFpvbmVOdW1iZXIgPSAzMTtcbiAgICB9XG4gICAgZWxzZSBpZiAoTG9uZyA+PSA5LjAgJiYgTG9uZyA8IDIxLjApIHtcbiAgICAgIFpvbmVOdW1iZXIgPSAzMztcbiAgICB9XG4gICAgZWxzZSBpZiAoTG9uZyA+PSAyMS4wICYmIExvbmcgPCAzMy4wKSB7XG4gICAgICBab25lTnVtYmVyID0gMzU7XG4gICAgfVxuICAgIGVsc2UgaWYgKExvbmcgPj0gMzMuMCAmJiBMb25nIDwgNDIuMCkge1xuICAgICAgWm9uZU51bWJlciA9IDM3O1xuICAgIH1cbiAgfVxuXG4gIExvbmdPcmlnaW4gPSAoWm9uZU51bWJlciAtIDEpICogNiAtIDE4MCArIDM7IC8vKzMgcHV0cyBvcmlnaW5cbiAgLy8gaW4gbWlkZGxlIG9mXG4gIC8vIHpvbmVcbiAgTG9uZ09yaWdpblJhZCA9IGRlZ1RvUmFkKExvbmdPcmlnaW4pO1xuXG4gIGVjY1ByaW1lU3F1YXJlZCA9IChlY2NTcXVhcmVkKSAvICgxIC0gZWNjU3F1YXJlZCk7XG5cbiAgTiA9IGEgLyBNYXRoLnNxcnQoMSAtIGVjY1NxdWFyZWQgKiBNYXRoLnNpbihMYXRSYWQpICogTWF0aC5zaW4oTGF0UmFkKSk7XG4gIFQgPSBNYXRoLnRhbihMYXRSYWQpICogTWF0aC50YW4oTGF0UmFkKTtcbiAgQyA9IGVjY1ByaW1lU3F1YXJlZCAqIE1hdGguY29zKExhdFJhZCkgKiBNYXRoLmNvcyhMYXRSYWQpO1xuICBBID0gTWF0aC5jb3MoTGF0UmFkKSAqIChMb25nUmFkIC0gTG9uZ09yaWdpblJhZCk7XG5cbiAgTSA9IGEgKiAoKDEgLSBlY2NTcXVhcmVkIC8gNCAtIDMgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDY0IC0gNSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDI1NikgKiBMYXRSYWQgLSAoMyAqIGVjY1NxdWFyZWQgLyA4ICsgMyAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMzIgKyA0NSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDEwMjQpICogTWF0aC5zaW4oMiAqIExhdFJhZCkgKyAoMTUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDI1NiArIDQ1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMTAyNCkgKiBNYXRoLnNpbig0ICogTGF0UmFkKSAtICgzNSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDMwNzIpICogTWF0aC5zaW4oNiAqIExhdFJhZCkpO1xuXG4gIHZhciBVVE1FYXN0aW5nID0gKGswICogTiAqIChBICsgKDEgLSBUICsgQykgKiBBICogQSAqIEEgLyA2LjAgKyAoNSAtIDE4ICogVCArIFQgKiBUICsgNzIgKiBDIC0gNTggKiBlY2NQcmltZVNxdWFyZWQpICogQSAqIEEgKiBBICogQSAqIEEgLyAxMjAuMCkgKyA1MDAwMDAuMCk7XG5cbiAgdmFyIFVUTU5vcnRoaW5nID0gKGswICogKE0gKyBOICogTWF0aC50YW4oTGF0UmFkKSAqIChBICogQSAvIDIgKyAoNSAtIFQgKyA5ICogQyArIDQgKiBDICogQykgKiBBICogQSAqIEEgKiBBIC8gMjQuMCArICg2MSAtIDU4ICogVCArIFQgKiBUICsgNjAwICogQyAtIDMzMCAqIGVjY1ByaW1lU3F1YXJlZCkgKiBBICogQSAqIEEgKiBBICogQSAqIEEgLyA3MjAuMCkpKTtcbiAgaWYgKExhdCA8IDAuMCkge1xuICAgIFVUTU5vcnRoaW5nICs9IDEwMDAwMDAwLjA7IC8vMTAwMDAwMDAgbWV0ZXIgb2Zmc2V0IGZvclxuICAgIC8vIHNvdXRoZXJuIGhlbWlzcGhlcmVcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbm9ydGhpbmc6IE1hdGgucm91bmQoVVRNTm9ydGhpbmcpLFxuICAgIGVhc3Rpbmc6IE1hdGgucm91bmQoVVRNRWFzdGluZyksXG4gICAgem9uZU51bWJlcjogWm9uZU51bWJlcixcbiAgICB6b25lTGV0dGVyOiBnZXRMZXR0ZXJEZXNpZ25hdG9yKExhdClcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBVVE0gY29vcmRzIHRvIGxhdC9sb25nLCB1c2luZyB0aGUgV0dTODQgZWxsaXBzb2lkLiBUaGlzIGlzIGEgY29udmVuaWVuY2VcbiAqIGNsYXNzIHdoZXJlIHRoZSBab25lIGNhbiBiZSBzcGVjaWZpZWQgYXMgYSBzaW5nbGUgc3RyaW5nIGVnLlwiNjBOXCIgd2hpY2hcbiAqIGlzIHRoZW4gYnJva2VuIGRvd24gaW50byB0aGUgWm9uZU51bWJlciBhbmQgWm9uZUxldHRlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtvYmplY3R9IHV0bSBBbiBvYmplY3QgbGl0ZXJhbCB3aXRoIG5vcnRoaW5nLCBlYXN0aW5nLCB6b25lTnVtYmVyXG4gKiAgICAgYW5kIHpvbmVMZXR0ZXIgcHJvcGVydGllcy4gSWYgYW4gb3B0aW9uYWwgYWNjdXJhY3kgcHJvcGVydHkgaXNcbiAqICAgICBwcm92aWRlZCAoaW4gbWV0ZXJzKSwgYSBib3VuZGluZyBib3ggd2lsbCBiZSByZXR1cm5lZCBpbnN0ZWFkIG9mXG4gKiAgICAgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZS5cbiAqIEByZXR1cm4ge29iamVjdH0gQW4gb2JqZWN0IGxpdGVyYWwgY29udGFpbmluZyBlaXRoZXIgbGF0IGFuZCBsb24gdmFsdWVzXG4gKiAgICAgKGlmIG5vIGFjY3VyYWN5IHdhcyBwcm92aWRlZCksIG9yIHRvcCwgcmlnaHQsIGJvdHRvbSBhbmQgbGVmdCB2YWx1ZXNcbiAqICAgICBmb3IgdGhlIGJvdW5kaW5nIGJveCBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgcHJvdmlkZWQgYWNjdXJhY3kuXG4gKiAgICAgUmV0dXJucyBudWxsIGlmIHRoZSBjb252ZXJzaW9uIGZhaWxlZC5cbiAqL1xuZnVuY3Rpb24gVVRNdG9MTCh1dG0pIHtcblxuICB2YXIgVVRNTm9ydGhpbmcgPSB1dG0ubm9ydGhpbmc7XG4gIHZhciBVVE1FYXN0aW5nID0gdXRtLmVhc3Rpbmc7XG4gIHZhciB6b25lTGV0dGVyID0gdXRtLnpvbmVMZXR0ZXI7XG4gIHZhciB6b25lTnVtYmVyID0gdXRtLnpvbmVOdW1iZXI7XG4gIC8vIGNoZWNrIHRoZSBab25lTnVtbWJlciBpcyB2YWxpZFxuICBpZiAoem9uZU51bWJlciA8IDAgfHwgem9uZU51bWJlciA+IDYwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgazAgPSAwLjk5OTY7XG4gIHZhciBhID0gNjM3ODEzNy4wOyAvL2VsbGlwLnJhZGl1cztcbiAgdmFyIGVjY1NxdWFyZWQgPSAwLjAwNjY5NDM4OyAvL2VsbGlwLmVjY3NxO1xuICB2YXIgZWNjUHJpbWVTcXVhcmVkO1xuICB2YXIgZTEgPSAoMSAtIE1hdGguc3FydCgxIC0gZWNjU3F1YXJlZCkpIC8gKDEgKyBNYXRoLnNxcnQoMSAtIGVjY1NxdWFyZWQpKTtcbiAgdmFyIE4xLCBUMSwgQzEsIFIxLCBELCBNO1xuICB2YXIgTG9uZ09yaWdpbjtcbiAgdmFyIG11LCBwaGkxUmFkO1xuXG4gIC8vIHJlbW92ZSA1MDAsMDAwIG1ldGVyIG9mZnNldCBmb3IgbG9uZ2l0dWRlXG4gIHZhciB4ID0gVVRNRWFzdGluZyAtIDUwMDAwMC4wO1xuICB2YXIgeSA9IFVUTU5vcnRoaW5nO1xuXG4gIC8vIFdlIG11c3Qga25vdyBzb21laG93IGlmIHdlIGFyZSBpbiB0aGUgTm9ydGhlcm4gb3IgU291dGhlcm5cbiAgLy8gaGVtaXNwaGVyZSwgdGhpcyBpcyB0aGUgb25seSB0aW1lIHdlIHVzZSB0aGUgbGV0dGVyIFNvIGV2ZW5cbiAgLy8gaWYgdGhlIFpvbmUgbGV0dGVyIGlzbid0IGV4YWN0bHkgY29ycmVjdCBpdCBzaG91bGQgaW5kaWNhdGVcbiAgLy8gdGhlIGhlbWlzcGhlcmUgY29ycmVjdGx5XG4gIGlmICh6b25lTGV0dGVyIDwgJ04nKSB7XG4gICAgeSAtPSAxMDAwMDAwMC4wOyAvLyByZW1vdmUgMTAsMDAwLDAwMCBtZXRlciBvZmZzZXQgdXNlZFxuICAgIC8vIGZvciBzb3V0aGVybiBoZW1pc3BoZXJlXG4gIH1cblxuICAvLyBUaGVyZSBhcmUgNjAgem9uZXMgd2l0aCB6b25lIDEgYmVpbmcgYXQgV2VzdCAtMTgwIHRvIC0xNzRcbiAgTG9uZ09yaWdpbiA9ICh6b25lTnVtYmVyIC0gMSkgKiA2IC0gMTgwICsgMzsgLy8gKzMgcHV0cyBvcmlnaW5cbiAgLy8gaW4gbWlkZGxlIG9mXG4gIC8vIHpvbmVcblxuICBlY2NQcmltZVNxdWFyZWQgPSAoZWNjU3F1YXJlZCkgLyAoMSAtIGVjY1NxdWFyZWQpO1xuXG4gIE0gPSB5IC8gazA7XG4gIG11ID0gTSAvIChhICogKDEgLSBlY2NTcXVhcmVkIC8gNCAtIDMgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDY0IC0gNSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDI1NikpO1xuXG4gIHBoaTFSYWQgPSBtdSArICgzICogZTEgLyAyIC0gMjcgKiBlMSAqIGUxICogZTEgLyAzMikgKiBNYXRoLnNpbigyICogbXUpICsgKDIxICogZTEgKiBlMSAvIDE2IC0gNTUgKiBlMSAqIGUxICogZTEgKiBlMSAvIDMyKSAqIE1hdGguc2luKDQgKiBtdSkgKyAoMTUxICogZTEgKiBlMSAqIGUxIC8gOTYpICogTWF0aC5zaW4oNiAqIG11KTtcbiAgLy8gZG91YmxlIHBoaTEgPSBQcm9qTWF0aC5yYWRUb0RlZyhwaGkxUmFkKTtcblxuICBOMSA9IGEgLyBNYXRoLnNxcnQoMSAtIGVjY1NxdWFyZWQgKiBNYXRoLnNpbihwaGkxUmFkKSAqIE1hdGguc2luKHBoaTFSYWQpKTtcbiAgVDEgPSBNYXRoLnRhbihwaGkxUmFkKSAqIE1hdGgudGFuKHBoaTFSYWQpO1xuICBDMSA9IGVjY1ByaW1lU3F1YXJlZCAqIE1hdGguY29zKHBoaTFSYWQpICogTWF0aC5jb3MocGhpMVJhZCk7XG4gIFIxID0gYSAqICgxIC0gZWNjU3F1YXJlZCkgLyBNYXRoLnBvdygxIC0gZWNjU3F1YXJlZCAqIE1hdGguc2luKHBoaTFSYWQpICogTWF0aC5zaW4ocGhpMVJhZCksIDEuNSk7XG4gIEQgPSB4IC8gKE4xICogazApO1xuXG4gIHZhciBsYXQgPSBwaGkxUmFkIC0gKE4xICogTWF0aC50YW4ocGhpMVJhZCkgLyBSMSkgKiAoRCAqIEQgLyAyIC0gKDUgKyAzICogVDEgKyAxMCAqIEMxIC0gNCAqIEMxICogQzEgLSA5ICogZWNjUHJpbWVTcXVhcmVkKSAqIEQgKiBEICogRCAqIEQgLyAyNCArICg2MSArIDkwICogVDEgKyAyOTggKiBDMSArIDQ1ICogVDEgKiBUMSAtIDI1MiAqIGVjY1ByaW1lU3F1YXJlZCAtIDMgKiBDMSAqIEMxKSAqIEQgKiBEICogRCAqIEQgKiBEICogRCAvIDcyMCk7XG4gIGxhdCA9IHJhZFRvRGVnKGxhdCk7XG5cbiAgdmFyIGxvbiA9IChEIC0gKDEgKyAyICogVDEgKyBDMSkgKiBEICogRCAqIEQgLyA2ICsgKDUgLSAyICogQzEgKyAyOCAqIFQxIC0gMyAqIEMxICogQzEgKyA4ICogZWNjUHJpbWVTcXVhcmVkICsgMjQgKiBUMSAqIFQxKSAqIEQgKiBEICogRCAqIEQgKiBEIC8gMTIwKSAvIE1hdGguY29zKHBoaTFSYWQpO1xuICBsb24gPSBMb25nT3JpZ2luICsgcmFkVG9EZWcobG9uKTtcblxuICB2YXIgcmVzdWx0O1xuICBpZiAodXRtLmFjY3VyYWN5KSB7XG4gICAgdmFyIHRvcFJpZ2h0ID0gVVRNdG9MTCh7XG4gICAgICBub3J0aGluZzogdXRtLm5vcnRoaW5nICsgdXRtLmFjY3VyYWN5LFxuICAgICAgZWFzdGluZzogdXRtLmVhc3RpbmcgKyB1dG0uYWNjdXJhY3ksXG4gICAgICB6b25lTGV0dGVyOiB1dG0uem9uZUxldHRlcixcbiAgICAgIHpvbmVOdW1iZXI6IHV0bS56b25lTnVtYmVyXG4gICAgfSk7XG4gICAgcmVzdWx0ID0ge1xuICAgICAgdG9wOiB0b3BSaWdodC5sYXQsXG4gICAgICByaWdodDogdG9wUmlnaHQubG9uLFxuICAgICAgYm90dG9tOiBsYXQsXG4gICAgICBsZWZ0OiBsb25cbiAgICB9O1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IHtcbiAgICAgIGxhdDogbGF0LFxuICAgICAgbG9uOiBsb25cbiAgICB9O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgTUdSUyBsZXR0ZXIgZGVzaWduYXRvciBmb3IgdGhlIGdpdmVuIGxhdGl0dWRlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbGF0IFRoZSBsYXRpdHVkZSBpbiBXR1M4NCB0byBnZXQgdGhlIGxldHRlciBkZXNpZ25hdG9yXG4gKiAgICAgZm9yLlxuICogQHJldHVybiB7Y2hhcn0gVGhlIGxldHRlciBkZXNpZ25hdG9yLlxuICovXG5mdW5jdGlvbiBnZXRMZXR0ZXJEZXNpZ25hdG9yKGxhdCkge1xuICAvL1RoaXMgaXMgaGVyZSBhcyBhbiBlcnJvciBmbGFnIHRvIHNob3cgdGhhdCB0aGUgTGF0aXR1ZGUgaXNcbiAgLy9vdXRzaWRlIE1HUlMgbGltaXRzXG4gIHZhciBMZXR0ZXJEZXNpZ25hdG9yID0gJ1onO1xuXG4gIGlmICgoODQgPj0gbGF0KSAmJiAobGF0ID49IDcyKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnWCc7XG4gIH1cbiAgZWxzZSBpZiAoKDcyID4gbGF0KSAmJiAobGF0ID49IDY0KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnVyc7XG4gIH1cbiAgZWxzZSBpZiAoKDY0ID4gbGF0KSAmJiAobGF0ID49IDU2KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnVic7XG4gIH1cbiAgZWxzZSBpZiAoKDU2ID4gbGF0KSAmJiAobGF0ID49IDQ4KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnVSc7XG4gIH1cbiAgZWxzZSBpZiAoKDQ4ID4gbGF0KSAmJiAobGF0ID49IDQwKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnVCc7XG4gIH1cbiAgZWxzZSBpZiAoKDQwID4gbGF0KSAmJiAobGF0ID49IDMyKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnUyc7XG4gIH1cbiAgZWxzZSBpZiAoKDMyID4gbGF0KSAmJiAobGF0ID49IDI0KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnUic7XG4gIH1cbiAgZWxzZSBpZiAoKDI0ID4gbGF0KSAmJiAobGF0ID49IDE2KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnUSc7XG4gIH1cbiAgZWxzZSBpZiAoKDE2ID4gbGF0KSAmJiAobGF0ID49IDgpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdQJztcbiAgfVxuICBlbHNlIGlmICgoOCA+IGxhdCkgJiYgKGxhdCA+PSAwKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnTic7XG4gIH1cbiAgZWxzZSBpZiAoKDAgPiBsYXQpICYmIChsYXQgPj0gLTgpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdNJztcbiAgfVxuICBlbHNlIGlmICgoLTggPiBsYXQpICYmIChsYXQgPj0gLTE2KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnTCc7XG4gIH1cbiAgZWxzZSBpZiAoKC0xNiA+IGxhdCkgJiYgKGxhdCA+PSAtMjQpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdLJztcbiAgfVxuICBlbHNlIGlmICgoLTI0ID4gbGF0KSAmJiAobGF0ID49IC0zMikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0onO1xuICB9XG4gIGVsc2UgaWYgKCgtMzIgPiBsYXQpICYmIChsYXQgPj0gLTQwKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnSCc7XG4gIH1cbiAgZWxzZSBpZiAoKC00MCA+IGxhdCkgJiYgKGxhdCA+PSAtNDgpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdHJztcbiAgfVxuICBlbHNlIGlmICgoLTQ4ID4gbGF0KSAmJiAobGF0ID49IC01NikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0YnO1xuICB9XG4gIGVsc2UgaWYgKCgtNTYgPiBsYXQpICYmIChsYXQgPj0gLTY0KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnRSc7XG4gIH1cbiAgZWxzZSBpZiAoKC02NCA+IGxhdCkgJiYgKGxhdCA+PSAtNzIpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdEJztcbiAgfVxuICBlbHNlIGlmICgoLTcyID4gbGF0KSAmJiAobGF0ID49IC04MCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0MnO1xuICB9XG4gIHJldHVybiBMZXR0ZXJEZXNpZ25hdG9yO1xufVxuXG4vKipcbiAqIEVuY29kZXMgYSBVVE0gbG9jYXRpb24gYXMgTUdSUyBzdHJpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB1dG0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCBlYXN0aW5nLCBub3J0aGluZyxcbiAqICAgICB6b25lTGV0dGVyLCB6b25lTnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0gYWNjdXJhY3kgQWNjdXJhY3kgaW4gZGlnaXRzICgxLTUpLlxuICogQHJldHVybiB7c3RyaW5nfSBNR1JTIHN0cmluZyBmb3IgdGhlIGdpdmVuIFVUTSBsb2NhdGlvbi5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHV0bSwgYWNjdXJhY3kpIHtcbiAgLy8gcHJlcGVuZCB3aXRoIGxlYWRpbmcgemVyb2VzXG4gIHZhciBzZWFzdGluZyA9IFwiMDAwMDBcIiArIHV0bS5lYXN0aW5nLFxuICAgIHNub3J0aGluZyA9IFwiMDAwMDBcIiArIHV0bS5ub3J0aGluZztcblxuICByZXR1cm4gdXRtLnpvbmVOdW1iZXIgKyB1dG0uem9uZUxldHRlciArIGdldDEwMGtJRCh1dG0uZWFzdGluZywgdXRtLm5vcnRoaW5nLCB1dG0uem9uZU51bWJlcikgKyBzZWFzdGluZy5zdWJzdHIoc2Vhc3RpbmcubGVuZ3RoIC0gNSwgYWNjdXJhY3kpICsgc25vcnRoaW5nLnN1YnN0cihzbm9ydGhpbmcubGVuZ3RoIC0gNSwgYWNjdXJhY3kpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdHdvIGxldHRlciAxMDBrIGRlc2lnbmF0b3IgZm9yIGEgZ2l2ZW4gVVRNIGVhc3RpbmcsXG4gKiBub3J0aGluZyBhbmQgem9uZSBudW1iZXIgdmFsdWUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBlYXN0aW5nXG4gKiBAcGFyYW0ge251bWJlcn0gbm9ydGhpbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSB6b25lTnVtYmVyXG4gKiBAcmV0dXJuIHRoZSB0d28gbGV0dGVyIDEwMGsgZGVzaWduYXRvciBmb3IgdGhlIGdpdmVuIFVUTSBsb2NhdGlvbi5cbiAqL1xuZnVuY3Rpb24gZ2V0MTAwa0lEKGVhc3RpbmcsIG5vcnRoaW5nLCB6b25lTnVtYmVyKSB7XG4gIHZhciBzZXRQYXJtID0gZ2V0MTAwa1NldEZvclpvbmUoem9uZU51bWJlcik7XG4gIHZhciBzZXRDb2x1bW4gPSBNYXRoLmZsb29yKGVhc3RpbmcgLyAxMDAwMDApO1xuICB2YXIgc2V0Um93ID0gTWF0aC5mbG9vcihub3J0aGluZyAvIDEwMDAwMCkgJSAyMDtcbiAgcmV0dXJuIGdldExldHRlcjEwMGtJRChzZXRDb2x1bW4sIHNldFJvdywgc2V0UGFybSk7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBVVE0gem9uZSBudW1iZXIsIGZpZ3VyZSBvdXQgdGhlIE1HUlMgMTAwSyBzZXQgaXQgaXMgaW4uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpIEFuIFVUTSB6b25lIG51bWJlci5cbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIDEwMGsgc2V0IHRoZSBVVE0gem9uZSBpcyBpbi5cbiAqL1xuZnVuY3Rpb24gZ2V0MTAwa1NldEZvclpvbmUoaSkge1xuICB2YXIgc2V0UGFybSA9IGkgJSBOVU1fMTAwS19TRVRTO1xuICBpZiAoc2V0UGFybSA9PT0gMCkge1xuICAgIHNldFBhcm0gPSBOVU1fMTAwS19TRVRTO1xuICB9XG5cbiAgcmV0dXJuIHNldFBhcm07XG59XG5cbi8qKlxuICogR2V0IHRoZSB0d28tbGV0dGVyIE1HUlMgMTAwayBkZXNpZ25hdG9yIGdpdmVuIGluZm9ybWF0aW9uXG4gKiB0cmFuc2xhdGVkIGZyb20gdGhlIFVUTSBub3J0aGluZywgZWFzdGluZyBhbmQgem9uZSBudW1iZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW4gdGhlIGNvbHVtbiBpbmRleCBhcyBpdCByZWxhdGVzIHRvIHRoZSBNR1JTXG4gKiAgICAgICAgMTAwayBzZXQgc3ByZWFkc2hlZXQsIGNyZWF0ZWQgZnJvbSB0aGUgVVRNIGVhc3RpbmcuXG4gKiAgICAgICAgVmFsdWVzIGFyZSAxLTguXG4gKiBAcGFyYW0ge251bWJlcn0gcm93IHRoZSByb3cgaW5kZXggYXMgaXQgcmVsYXRlcyB0byB0aGUgTUdSUyAxMDBrIHNldFxuICogICAgICAgIHNwcmVhZHNoZWV0LCBjcmVhdGVkIGZyb20gdGhlIFVUTSBub3J0aGluZyB2YWx1ZS4gVmFsdWVzXG4gKiAgICAgICAgYXJlIGZyb20gMC0xOS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJtIHRoZSBzZXQgYmxvY2ssIGFzIGl0IHJlbGF0ZXMgdG8gdGhlIE1HUlMgMTAwayBzZXRcbiAqICAgICAgICBzcHJlYWRzaGVldCwgY3JlYXRlZCBmcm9tIHRoZSBVVE0gem9uZS4gVmFsdWVzIGFyZSBmcm9tXG4gKiAgICAgICAgMS02MC5cbiAqIEByZXR1cm4gdHdvIGxldHRlciBNR1JTIDEwMGsgY29kZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TGV0dGVyMTAwa0lEKGNvbHVtbiwgcm93LCBwYXJtKSB7XG4gIC8vIGNvbE9yaWdpbiBhbmQgcm93T3JpZ2luIGFyZSB0aGUgbGV0dGVycyBhdCB0aGUgb3JpZ2luIG9mIHRoZSBzZXRcbiAgdmFyIGluZGV4ID0gcGFybSAtIDE7XG4gIHZhciBjb2xPcmlnaW4gPSBTRVRfT1JJR0lOX0NPTFVNTl9MRVRURVJTLmNoYXJDb2RlQXQoaW5kZXgpO1xuICB2YXIgcm93T3JpZ2luID0gU0VUX09SSUdJTl9ST1dfTEVUVEVSUy5jaGFyQ29kZUF0KGluZGV4KTtcblxuICAvLyBjb2xJbnQgYW5kIHJvd0ludCBhcmUgdGhlIGxldHRlcnMgdG8gYnVpbGQgdG8gcmV0dXJuXG4gIHZhciBjb2xJbnQgPSBjb2xPcmlnaW4gKyBjb2x1bW4gLSAxO1xuICB2YXIgcm93SW50ID0gcm93T3JpZ2luICsgcm93O1xuICB2YXIgcm9sbG92ZXIgPSBmYWxzZTtcblxuICBpZiAoY29sSW50ID4gWikge1xuICAgIGNvbEludCA9IGNvbEludCAtIFogKyBBIC0gMTtcbiAgICByb2xsb3ZlciA9IHRydWU7XG4gIH1cblxuICBpZiAoY29sSW50ID09PSBJIHx8IChjb2xPcmlnaW4gPCBJICYmIGNvbEludCA+IEkpIHx8ICgoY29sSW50ID4gSSB8fCBjb2xPcmlnaW4gPCBJKSAmJiByb2xsb3ZlcikpIHtcbiAgICBjb2xJbnQrKztcbiAgfVxuXG4gIGlmIChjb2xJbnQgPT09IE8gfHwgKGNvbE9yaWdpbiA8IE8gJiYgY29sSW50ID4gTykgfHwgKChjb2xJbnQgPiBPIHx8IGNvbE9yaWdpbiA8IE8pICYmIHJvbGxvdmVyKSkge1xuICAgIGNvbEludCsrO1xuXG4gICAgaWYgKGNvbEludCA9PT0gSSkge1xuICAgICAgY29sSW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbEludCA+IFopIHtcbiAgICBjb2xJbnQgPSBjb2xJbnQgLSBaICsgQSAtIDE7XG4gIH1cblxuICBpZiAocm93SW50ID4gVikge1xuICAgIHJvd0ludCA9IHJvd0ludCAtIFYgKyBBIC0gMTtcbiAgICByb2xsb3ZlciA9IHRydWU7XG4gIH1cbiAgZWxzZSB7XG4gICAgcm9sbG92ZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICgoKHJvd0ludCA9PT0gSSkgfHwgKChyb3dPcmlnaW4gPCBJKSAmJiAocm93SW50ID4gSSkpKSB8fCAoKChyb3dJbnQgPiBJKSB8fCAocm93T3JpZ2luIDwgSSkpICYmIHJvbGxvdmVyKSkge1xuICAgIHJvd0ludCsrO1xuICB9XG5cbiAgaWYgKCgocm93SW50ID09PSBPKSB8fCAoKHJvd09yaWdpbiA8IE8pICYmIChyb3dJbnQgPiBPKSkpIHx8ICgoKHJvd0ludCA+IE8pIHx8IChyb3dPcmlnaW4gPCBPKSkgJiYgcm9sbG92ZXIpKSB7XG4gICAgcm93SW50Kys7XG5cbiAgICBpZiAocm93SW50ID09PSBJKSB7XG4gICAgICByb3dJbnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAocm93SW50ID4gVikge1xuICAgIHJvd0ludCA9IHJvd0ludCAtIFYgKyBBIC0gMTtcbiAgfVxuXG4gIHZhciB0d29MZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbEludCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKHJvd0ludCk7XG4gIHJldHVybiB0d29MZXR0ZXI7XG59XG5cbi8qKlxuICogRGVjb2RlIHRoZSBVVE0gcGFyYW1ldGVycyBmcm9tIGEgTUdSUyBzdHJpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZ3JzU3RyaW5nIGFuIFVQUEVSQ0FTRSBjb29yZGluYXRlIHN0cmluZyBpcyBleHBlY3RlZC5cbiAqIEByZXR1cm4ge29iamVjdH0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCBlYXN0aW5nLCBub3J0aGluZywgem9uZUxldHRlcixcbiAqICAgICB6b25lTnVtYmVyIGFuZCBhY2N1cmFjeSAoaW4gbWV0ZXJzKSBwcm9wZXJ0aWVzLlxuICovXG5mdW5jdGlvbiBkZWNvZGUobWdyc1N0cmluZykge1xuXG4gIGlmIChtZ3JzU3RyaW5nICYmIG1ncnNTdHJpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgKFwiTUdSU1BvaW50IGNvdmVydGluZyBmcm9tIG5vdGhpbmdcIik7XG4gIH1cblxuICB2YXIgbGVuZ3RoID0gbWdyc1N0cmluZy5sZW5ndGg7XG5cbiAgdmFyIGh1bksgPSBudWxsO1xuICB2YXIgc2IgPSBcIlwiO1xuICB2YXIgdGVzdENoYXI7XG4gIHZhciBpID0gMDtcblxuICAvLyBnZXQgWm9uZSBudW1iZXJcbiAgd2hpbGUgKCEoL1tBLVpdLykudGVzdCh0ZXN0Q2hhciA9IG1ncnNTdHJpbmcuY2hhckF0KGkpKSkge1xuICAgIGlmIChpID49IDIpIHtcbiAgICAgIHRocm93IChcIk1HUlNQb2ludCBiYWQgY29udmVyc2lvbiBmcm9tOiBcIiArIG1ncnNTdHJpbmcpO1xuICAgIH1cbiAgICBzYiArPSB0ZXN0Q2hhcjtcbiAgICBpKys7XG4gIH1cblxuICB2YXIgem9uZU51bWJlciA9IHBhcnNlSW50KHNiLCAxMCk7XG5cbiAgaWYgKGkgPT09IDAgfHwgaSArIDMgPiBsZW5ndGgpIHtcbiAgICAvLyBBIGdvb2QgTUdSUyBzdHJpbmcgaGFzIHRvIGJlIDQtNSBkaWdpdHMgbG9uZyxcbiAgICAvLyAjI0FBQS8jQUFBIGF0IGxlYXN0LlxuICAgIHRocm93IChcIk1HUlNQb2ludCBiYWQgY29udmVyc2lvbiBmcm9tOiBcIiArIG1ncnNTdHJpbmcpO1xuICB9XG5cbiAgdmFyIHpvbmVMZXR0ZXIgPSBtZ3JzU3RyaW5nLmNoYXJBdChpKyspO1xuXG4gIC8vIFNob3VsZCB3ZSBjaGVjayB0aGUgem9uZSBsZXR0ZXIgaGVyZT8gV2h5IG5vdC5cbiAgaWYgKHpvbmVMZXR0ZXIgPD0gJ0EnIHx8IHpvbmVMZXR0ZXIgPT09ICdCJyB8fCB6b25lTGV0dGVyID09PSAnWScgfHwgem9uZUxldHRlciA+PSAnWicgfHwgem9uZUxldHRlciA9PT0gJ0knIHx8IHpvbmVMZXR0ZXIgPT09ICdPJykge1xuICAgIHRocm93IChcIk1HUlNQb2ludCB6b25lIGxldHRlciBcIiArIHpvbmVMZXR0ZXIgKyBcIiBub3QgaGFuZGxlZDogXCIgKyBtZ3JzU3RyaW5nKTtcbiAgfVxuXG4gIGh1bksgPSBtZ3JzU3RyaW5nLnN1YnN0cmluZyhpLCBpICs9IDIpO1xuXG4gIHZhciBzZXQgPSBnZXQxMDBrU2V0Rm9yWm9uZSh6b25lTnVtYmVyKTtcblxuICB2YXIgZWFzdDEwMGsgPSBnZXRFYXN0aW5nRnJvbUNoYXIoaHVuSy5jaGFyQXQoMCksIHNldCk7XG4gIHZhciBub3J0aDEwMGsgPSBnZXROb3J0aGluZ0Zyb21DaGFyKGh1bksuY2hhckF0KDEpLCBzZXQpO1xuXG4gIC8vIFdlIGhhdmUgYSBidWcgd2hlcmUgdGhlIG5vcnRoaW5nIG1heSBiZSAyMDAwMDAwIHRvbyBsb3cuXG4gIC8vIEhvd1xuICAvLyBkbyB3ZSBrbm93IHdoZW4gdG8gcm9sbCBvdmVyP1xuXG4gIHdoaWxlIChub3J0aDEwMGsgPCBnZXRNaW5Ob3J0aGluZyh6b25lTGV0dGVyKSkge1xuICAgIG5vcnRoMTAwayArPSAyMDAwMDAwO1xuICB9XG5cbiAgLy8gY2FsY3VsYXRlIHRoZSBjaGFyIGluZGV4IGZvciBlYXN0aW5nL25vcnRoaW5nIHNlcGFyYXRvclxuICB2YXIgcmVtYWluZGVyID0gbGVuZ3RoIC0gaTtcblxuICBpZiAocmVtYWluZGVyICUgMiAhPT0gMCkge1xuICAgIHRocm93IChcIk1HUlNQb2ludCBoYXMgdG8gaGF2ZSBhbiBldmVuIG51bWJlciBcXG5vZiBkaWdpdHMgYWZ0ZXIgdGhlIHpvbmUgbGV0dGVyIGFuZCB0d28gMTAwa20gbGV0dGVycyAtIGZyb250IFxcbmhhbGYgZm9yIGVhc3RpbmcgbWV0ZXJzLCBzZWNvbmQgaGFsZiBmb3IgXFxubm9ydGhpbmcgbWV0ZXJzXCIgKyBtZ3JzU3RyaW5nKTtcbiAgfVxuXG4gIHZhciBzZXAgPSByZW1haW5kZXIgLyAyO1xuXG4gIHZhciBzZXBFYXN0aW5nID0gMC4wO1xuICB2YXIgc2VwTm9ydGhpbmcgPSAwLjA7XG4gIHZhciBhY2N1cmFjeUJvbnVzLCBzZXBFYXN0aW5nU3RyaW5nLCBzZXBOb3J0aGluZ1N0cmluZywgZWFzdGluZywgbm9ydGhpbmc7XG4gIGlmIChzZXAgPiAwKSB7XG4gICAgYWNjdXJhY3lCb251cyA9IDEwMDAwMC4wIC8gTWF0aC5wb3coMTAsIHNlcCk7XG4gICAgc2VwRWFzdGluZ1N0cmluZyA9IG1ncnNTdHJpbmcuc3Vic3RyaW5nKGksIGkgKyBzZXApO1xuICAgIHNlcEVhc3RpbmcgPSBwYXJzZUZsb2F0KHNlcEVhc3RpbmdTdHJpbmcpICogYWNjdXJhY3lCb251cztcbiAgICBzZXBOb3J0aGluZ1N0cmluZyA9IG1ncnNTdHJpbmcuc3Vic3RyaW5nKGkgKyBzZXApO1xuICAgIHNlcE5vcnRoaW5nID0gcGFyc2VGbG9hdChzZXBOb3J0aGluZ1N0cmluZykgKiBhY2N1cmFjeUJvbnVzO1xuICB9XG5cbiAgZWFzdGluZyA9IHNlcEVhc3RpbmcgKyBlYXN0MTAwaztcbiAgbm9ydGhpbmcgPSBzZXBOb3J0aGluZyArIG5vcnRoMTAwaztcblxuICByZXR1cm4ge1xuICAgIGVhc3Rpbmc6IGVhc3RpbmcsXG4gICAgbm9ydGhpbmc6IG5vcnRoaW5nLFxuICAgIHpvbmVMZXR0ZXI6IHpvbmVMZXR0ZXIsXG4gICAgem9uZU51bWJlcjogem9uZU51bWJlcixcbiAgICBhY2N1cmFjeTogYWNjdXJhY3lCb251c1xuICB9O1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBmaXJzdCBsZXR0ZXIgZnJvbSBhIHR3by1sZXR0ZXIgTUdSUyAxMDBrIHpvbmUsIGFuZCBnaXZlbiB0aGVcbiAqIE1HUlMgdGFibGUgc2V0IGZvciB0aGUgem9uZSBudW1iZXIsIGZpZ3VyZSBvdXQgdGhlIGVhc3RpbmcgdmFsdWUgdGhhdFxuICogc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBvdGhlciwgc2Vjb25kYXJ5IGVhc3RpbmcgdmFsdWUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Y2hhcn0gZSBUaGUgZmlyc3QgbGV0dGVyIGZyb20gYSB0d28tbGV0dGVyIE1HUlMgMTAwwrRrIHpvbmUuXG4gKiBAcGFyYW0ge251bWJlcn0gc2V0IFRoZSBNR1JTIHRhYmxlIHNldCBmb3IgdGhlIHpvbmUgbnVtYmVyLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgZWFzdGluZyB2YWx1ZSBmb3IgdGhlIGdpdmVuIGxldHRlciBhbmQgc2V0LlxuICovXG5mdW5jdGlvbiBnZXRFYXN0aW5nRnJvbUNoYXIoZSwgc2V0KSB7XG4gIC8vIGNvbE9yaWdpbiBpcyB0aGUgbGV0dGVyIGF0IHRoZSBvcmlnaW4gb2YgdGhlIHNldCBmb3IgdGhlXG4gIC8vIGNvbHVtblxuICB2YXIgY3VyQ29sID0gU0VUX09SSUdJTl9DT0xVTU5fTEVUVEVSUy5jaGFyQ29kZUF0KHNldCAtIDEpO1xuICB2YXIgZWFzdGluZ1ZhbHVlID0gMTAwMDAwLjA7XG4gIHZhciByZXdpbmRNYXJrZXIgPSBmYWxzZTtcblxuICB3aGlsZSAoY3VyQ29sICE9PSBlLmNoYXJDb2RlQXQoMCkpIHtcbiAgICBjdXJDb2wrKztcbiAgICBpZiAoY3VyQ29sID09PSBJKSB7XG4gICAgICBjdXJDb2wrKztcbiAgICB9XG4gICAgaWYgKGN1ckNvbCA9PT0gTykge1xuICAgICAgY3VyQ29sKys7XG4gICAgfVxuICAgIGlmIChjdXJDb2wgPiBaKSB7XG4gICAgICBpZiAocmV3aW5kTWFya2VyKSB7XG4gICAgICAgIHRocm93IChcIkJhZCBjaGFyYWN0ZXI6IFwiICsgZSk7XG4gICAgICB9XG4gICAgICBjdXJDb2wgPSBBO1xuICAgICAgcmV3aW5kTWFya2VyID0gdHJ1ZTtcbiAgICB9XG4gICAgZWFzdGluZ1ZhbHVlICs9IDEwMDAwMC4wO1xuICB9XG5cbiAgcmV0dXJuIGVhc3RpbmdWYWx1ZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgc2Vjb25kIGxldHRlciBmcm9tIGEgdHdvLWxldHRlciBNR1JTIDEwMGsgem9uZSwgYW5kIGdpdmVuIHRoZVxuICogTUdSUyB0YWJsZSBzZXQgZm9yIHRoZSB6b25lIG51bWJlciwgZmlndXJlIG91dCB0aGUgbm9ydGhpbmcgdmFsdWUgdGhhdFxuICogc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBvdGhlciwgc2Vjb25kYXJ5IG5vcnRoaW5nIHZhbHVlLiBZb3UgaGF2ZSB0b1xuICogcmVtZW1iZXIgdGhhdCBOb3J0aGluZ3MgYXJlIGRldGVybWluZWQgZnJvbSB0aGUgZXF1YXRvciwgYW5kIHRoZSB2ZXJ0aWNhbFxuICogY3ljbGUgb2YgbGV0dGVycyBtZWFuIGEgMjAwMDAwMCBhZGRpdGlvbmFsIG5vcnRoaW5nIG1ldGVycy4gVGhpcyBoYXBwZW5zXG4gKiBhcHByb3guIGV2ZXJ5IDE4IGRlZ3JlZXMgb2YgbGF0aXR1ZGUuIFRoaXMgbWV0aG9kIGRvZXMgKk5PVCogY291bnQgYW55XG4gKiBhZGRpdGlvbmFsIG5vcnRoaW5ncy4gWW91IGhhdmUgdG8gZmlndXJlIG91dCBob3cgbWFueSAyMDAwMDAwIG1ldGVycyBuZWVkXG4gKiB0byBiZSBhZGRlZCBmb3IgdGhlIHpvbmUgbGV0dGVyIG9mIHRoZSBNR1JTIGNvb3JkaW5hdGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Y2hhcn0gbiBTZWNvbmQgbGV0dGVyIG9mIHRoZSBNR1JTIDEwMGsgem9uZVxuICogQHBhcmFtIHtudW1iZXJ9IHNldCBUaGUgTUdSUyB0YWJsZSBzZXQgbnVtYmVyLCB3aGljaCBpcyBkZXBlbmRlbnQgb24gdGhlXG4gKiAgICAgVVRNIHpvbmUgbnVtYmVyLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbm9ydGhpbmcgdmFsdWUgZm9yIHRoZSBnaXZlbiBsZXR0ZXIgYW5kIHNldC5cbiAqL1xuZnVuY3Rpb24gZ2V0Tm9ydGhpbmdGcm9tQ2hhcihuLCBzZXQpIHtcblxuICBpZiAobiA+ICdWJykge1xuICAgIHRocm93IChcIk1HUlNQb2ludCBnaXZlbiBpbnZhbGlkIE5vcnRoaW5nIFwiICsgbik7XG4gIH1cblxuICAvLyByb3dPcmlnaW4gaXMgdGhlIGxldHRlciBhdCB0aGUgb3JpZ2luIG9mIHRoZSBzZXQgZm9yIHRoZVxuICAvLyBjb2x1bW5cbiAgdmFyIGN1clJvdyA9IFNFVF9PUklHSU5fUk9XX0xFVFRFUlMuY2hhckNvZGVBdChzZXQgLSAxKTtcbiAgdmFyIG5vcnRoaW5nVmFsdWUgPSAwLjA7XG4gIHZhciByZXdpbmRNYXJrZXIgPSBmYWxzZTtcblxuICB3aGlsZSAoY3VyUm93ICE9PSBuLmNoYXJDb2RlQXQoMCkpIHtcbiAgICBjdXJSb3crKztcbiAgICBpZiAoY3VyUm93ID09PSBJKSB7XG4gICAgICBjdXJSb3crKztcbiAgICB9XG4gICAgaWYgKGN1clJvdyA9PT0gTykge1xuICAgICAgY3VyUm93Kys7XG4gICAgfVxuICAgIC8vIGZpeGluZyBhIGJ1ZyBtYWtpbmcgd2hvbGUgYXBwbGljYXRpb24gaGFuZyBpbiB0aGlzIGxvb3BcbiAgICAvLyB3aGVuICduJyBpcyBhIHdyb25nIGNoYXJhY3RlclxuICAgIGlmIChjdXJSb3cgPiBWKSB7XG4gICAgICBpZiAocmV3aW5kTWFya2VyKSB7IC8vIG1ha2luZyBzdXJlIHRoYXQgdGhpcyBsb29wIGVuZHNcbiAgICAgICAgdGhyb3cgKFwiQmFkIGNoYXJhY3RlcjogXCIgKyBuKTtcbiAgICAgIH1cbiAgICAgIGN1clJvdyA9IEE7XG4gICAgICByZXdpbmRNYXJrZXIgPSB0cnVlO1xuICAgIH1cbiAgICBub3J0aGluZ1ZhbHVlICs9IDEwMDAwMC4wO1xuICB9XG5cbiAgcmV0dXJuIG5vcnRoaW5nVmFsdWU7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIGdldE1pbk5vcnRoaW5nIHJldHVybnMgdGhlIG1pbmltdW0gbm9ydGhpbmcgdmFsdWUgb2YgYSBNR1JTXG4gKiB6b25lLlxuICpcbiAqIFBvcnRlZCBmcm9tIEdlb3RyYW5zJyBjIExhdHRpdHVkZV9CYW5kX1ZhbHVlIHN0cnVjdHVyZSB0YWJsZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtjaGFyfSB6b25lTGV0dGVyIFRoZSBNR1JTIHpvbmUgdG8gZ2V0IHRoZSBtaW4gbm9ydGhpbmcgZm9yLlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRNaW5Ob3J0aGluZyh6b25lTGV0dGVyKSB7XG4gIHZhciBub3J0aGluZztcbiAgc3dpdGNoICh6b25lTGV0dGVyKSB7XG4gIGNhc2UgJ0MnOlxuICAgIG5vcnRoaW5nID0gMTEwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdEJzpcbiAgICBub3J0aGluZyA9IDIwMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnRSc6XG4gICAgbm9ydGhpbmcgPSAyODAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0YnOlxuICAgIG5vcnRoaW5nID0gMzcwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdHJzpcbiAgICBub3J0aGluZyA9IDQ2MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnSCc6XG4gICAgbm9ydGhpbmcgPSA1NTAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0onOlxuICAgIG5vcnRoaW5nID0gNjQwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdLJzpcbiAgICBub3J0aGluZyA9IDczMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnTCc6XG4gICAgbm9ydGhpbmcgPSA4MjAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ00nOlxuICAgIG5vcnRoaW5nID0gOTEwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdOJzpcbiAgICBub3J0aGluZyA9IDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnUCc6XG4gICAgbm9ydGhpbmcgPSA4MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnUSc6XG4gICAgbm9ydGhpbmcgPSAxNzAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1InOlxuICAgIG5vcnRoaW5nID0gMjYwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdTJzpcbiAgICBub3J0aGluZyA9IDM1MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnVCc6XG4gICAgbm9ydGhpbmcgPSA0NDAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1UnOlxuICAgIG5vcnRoaW5nID0gNTMwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdWJzpcbiAgICBub3J0aGluZyA9IDYyMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnVyc6XG4gICAgbm9ydGhpbmcgPSA3MDAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1gnOlxuICAgIG5vcnRoaW5nID0gNzkwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBkZWZhdWx0OlxuICAgIG5vcnRoaW5nID0gLTEuMDtcbiAgfVxuICBpZiAobm9ydGhpbmcgPj0gMC4wKSB7XG4gICAgcmV0dXJuIG5vcnRoaW5nO1xuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IChcIkludmFsaWQgem9uZSBsZXR0ZXI6IFwiICsgem9uZUxldHRlcik7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgdG9Qb2ludCwgZm9yd2FyZCB9IGZyb20gJ21ncnMnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHYzLjAuMCAtIHVzZSBwcm9qNC50b1BvaW50IGluc3RlYWRcbiAqIEBwYXJhbSB7bnVtYmVyIHwgaW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzIHwgc3RyaW5nfSB4XG4gKiBAcGFyYW0ge251bWJlcn0gW3ldXG4gKiBAcGFyYW0ge251bWJlcn0gW3pdXG4gKi9cbmZ1bmN0aW9uIFBvaW50KHgsIHksIHopIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBvaW50KSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSwgeik7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICB0aGlzLnggPSB4WzBdO1xuICAgIHRoaXMueSA9IHhbMV07XG4gICAgdGhpcy56ID0geFsyXSB8fCAwLjA7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgdGhpcy54ID0geC54O1xuICAgIHRoaXMueSA9IHgueTtcbiAgICB0aGlzLnogPSB4LnogfHwgMC4wO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgeSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgY29vcmRzID0geC5zcGxpdCgnLCcpO1xuICAgIHRoaXMueCA9IHBhcnNlRmxvYXQoY29vcmRzWzBdKTtcbiAgICB0aGlzLnkgPSBwYXJzZUZsb2F0KGNvb3Jkc1sxXSk7XG4gICAgdGhpcy56ID0gcGFyc2VGbG9hdChjb29yZHNbMl0pIHx8IDAuMDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy56ID0geiB8fCAwLjA7XG4gIH1cbiAgY29uc29sZS53YXJuKCdwcm9qNC5Qb2ludCB3aWxsIGJlIHJlbW92ZWQgaW4gdmVyc2lvbiAzLCB1c2UgcHJvajQudG9Qb2ludCcpO1xufVxuXG5Qb2ludC5mcm9tTUdSUyA9IGZ1bmN0aW9uIChtZ3JzU3RyKSB7XG4gIHJldHVybiBuZXcgUG9pbnQodG9Qb2ludChtZ3JzU3RyKSk7XG59O1xuUG9pbnQucHJvdG90eXBlLnRvTUdSUyA9IGZ1bmN0aW9uIChhY2N1cmFjeSkge1xuICByZXR1cm4gZm9yd2FyZChbdGhpcy54LCB0aGlzLnldLCBhY2N1cmFjeSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgUG9pbnQ7XG4iLCJpbXBvcnQgcGFyc2VDb2RlIGZyb20gJy4vcGFyc2VDb2RlJztcbmltcG9ydCBleHRlbmQgZnJvbSAnLi9leHRlbmQnO1xuaW1wb3J0IHByb2plY3Rpb25zIGZyb20gJy4vcHJvamVjdGlvbnMnO1xuaW1wb3J0IHsgc3BoZXJlIGFzIGRjX3NwaGVyZSwgZWNjZW50cmljaXR5IGFzIGRjX2VjY2VudHJpY2l0eSB9IGZyb20gJy4vZGVyaXZlQ29uc3RhbnRzJztcbmltcG9ydCBEYXR1bSBmcm9tICcuL2NvbnN0YW50cy9EYXR1bSc7XG5pbXBvcnQgZGF0dW0gZnJvbSAnLi9kYXR1bSc7XG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCc7XG5pbXBvcnQgeyBnZXROYWRncmlkcyB9IGZyb20gJy4vbmFkZ3JpZCc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gRGF0dW1EZWZpbml0aW9uXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGF0dW1fdHlwZSAtIFRoZSB0eXBlIG9mIGRhdHVtLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGEgLSBTZW1pLW1ham9yIGF4aXMgb2YgdGhlIGVsbGlwc29pZC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiIC0gU2VtaS1taW5vciBheGlzIG9mIHRoZSBlbGxpcHNvaWQuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXMgLSBFY2NlbnRyaWNpdHkgc3F1YXJlZCBvZiB0aGUgZWxsaXBzb2lkLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVwMiAtIFNlY29uZCBlY2NlbnRyaWNpdHkgc3F1YXJlZCBvZiB0aGUgZWxsaXBzb2lkLlxuICovXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmcgfCBpbXBvcnQoJy4vY29yZScpLlBST0pKU09ORGVmaW5pdGlvbiB8IGltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259IHNyc0NvZGVcbiAqIEBwYXJhbSB7KGVycm9yTWVzc2FnZT86IHN0cmluZywgaW5zdGFuY2U/OiBQcm9qZWN0aW9uKSA9PiB2b2lkfSBbY2FsbGJhY2tdXG4gKi9cbmZ1bmN0aW9uIFByb2plY3Rpb24oc3JzQ29kZSwgY2FsbGJhY2spIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb2plY3Rpb24pKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9qZWN0aW9uKHNyc0NvZGUpO1xuICB9XG4gIC8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXM+KGNvb3JkaW5hdGVzOiBULCBlbmZvcmNlQXhpcz86IGJvb2xlYW4pID0+IFR9ICovXG4gIHRoaXMuZm9yd2FyZCA9IG51bGw7XG4gIC8qKiBAdHlwZSB7PFQgZXh0ZW5kcyBpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXM+KGNvb3JkaW5hdGVzOiBULCBlbmZvcmNlQXhpcz86IGJvb2xlYW4pID0+IFR9ICovXG4gIHRoaXMuaW52ZXJzZSA9IG51bGw7XG4gIC8qKiBAdHlwZSB7ZnVuY3Rpb24oKTogdm9pZH0gKi9cbiAgdGhpcy5pbml0ID0gbnVsbDtcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gIHRoaXMubmFtZTtcbiAgLyoqIEB0eXBlIHtBcnJheTxzdHJpbmc+fSAqL1xuICB0aGlzLm5hbWVzID0gbnVsbDtcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gIHRoaXMudGl0bGU7XG4gIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH07XG4gIHZhciBqc29uID0gcGFyc2VDb2RlKHNyc0NvZGUpO1xuICBpZiAodHlwZW9mIGpzb24gIT09ICdvYmplY3QnKSB7XG4gICAgY2FsbGJhY2soJ0NvdWxkIG5vdCBwYXJzZSB0byB2YWxpZCBqc29uOiAnICsgc3JzQ29kZSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBvdXJQcm9qID0gUHJvamVjdGlvbi5wcm9qZWN0aW9ucy5nZXQoanNvbi5wcm9qTmFtZSk7XG4gIGlmICghb3VyUHJvaikge1xuICAgIGNhbGxiYWNrKCdDb3VsZCBub3QgZ2V0IHByb2plY3Rpb24gbmFtZSBmcm9tOiAnICsgc3JzQ29kZSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChqc29uLmRhdHVtQ29kZSAmJiBqc29uLmRhdHVtQ29kZSAhPT0gJ25vbmUnKSB7XG4gICAgdmFyIGRhdHVtRGVmID0gbWF0Y2goRGF0dW0sIGpzb24uZGF0dW1Db2RlKTtcbiAgICBpZiAoZGF0dW1EZWYpIHtcbiAgICAgIGpzb24uZGF0dW1fcGFyYW1zID0ganNvbi5kYXR1bV9wYXJhbXMgfHwgKGRhdHVtRGVmLnRvd2dzODQgPyBkYXR1bURlZi50b3dnczg0LnNwbGl0KCcsJykgOiBudWxsKTtcbiAgICAgIGpzb24uZWxscHMgPSBkYXR1bURlZi5lbGxpcHNlO1xuICAgICAganNvbi5kYXR1bU5hbWUgPSBkYXR1bURlZi5kYXR1bU5hbWUgPyBkYXR1bURlZi5kYXR1bU5hbWUgOiBqc29uLmRhdHVtQ29kZTtcbiAgICB9XG4gIH1cbiAganNvbi5rMCA9IGpzb24uazAgfHwgMS4wO1xuICBqc29uLmF4aXMgPSBqc29uLmF4aXMgfHwgJ2VudSc7XG4gIGpzb24uZWxscHMgPSBqc29uLmVsbHBzIHx8ICd3Z3M4NCc7XG4gIGpzb24ubGF0MSA9IGpzb24ubGF0MSB8fCBqc29uLmxhdDA7IC8vIExhbWJlcnRfQ29uZm9ybWFsX0NvbmljXzFTUCwgZm9yIGV4YW1wbGUsIG5lZWRzIHRoaXNcblxuICB2YXIgc3BoZXJlXyA9IGRjX3NwaGVyZShqc29uLmEsIGpzb24uYiwganNvbi5yZiwganNvbi5lbGxwcywganNvbi5zcGhlcmUpO1xuICB2YXIgZWNjID0gZGNfZWNjZW50cmljaXR5KHNwaGVyZV8uYSwgc3BoZXJlXy5iLCBzcGhlcmVfLnJmLCBqc29uLlJfQSk7XG4gIHZhciBuYWRncmlkcyA9IGdldE5hZGdyaWRzKGpzb24ubmFkZ3JpZHMpO1xuICAvKiogQHR5cGUge0RhdHVtRGVmaW5pdGlvbn0gKi9cbiAgdmFyIGRhdHVtT2JqID0ganNvbi5kYXR1bSB8fCBkYXR1bShqc29uLmRhdHVtQ29kZSwganNvbi5kYXR1bV9wYXJhbXMsIHNwaGVyZV8uYSwgc3BoZXJlXy5iLCBlY2MuZXMsIGVjYy5lcDIsXG4gICAgbmFkZ3JpZHMpO1xuXG4gIGV4dGVuZCh0aGlzLCBqc29uKTsgLy8gdHJhbnNmZXIgZXZlcnl0aGluZyBvdmVyIGZyb20gdGhlIHByb2plY3Rpb24gYmVjYXVzZSB3ZSBkb24ndCBrbm93IHdoYXQgd2UnbGwgbmVlZFxuICBleHRlbmQodGhpcywgb3VyUHJvaik7IC8vIHRyYW5zZmVyIGFsbCB0aGUgbWV0aG9kcyBmcm9tIHRoZSBwcm9qZWN0aW9uXG5cbiAgLy8gY29weSB0aGUgNCB0aGluZ3Mgb3ZlciB3ZSBjYWxjdWxhdGVkIGluIGRlcml2ZUNvbnN0YW50cy5zcGhlcmVcbiAgdGhpcy5hID0gc3BoZXJlXy5hO1xuICB0aGlzLmIgPSBzcGhlcmVfLmI7XG4gIHRoaXMucmYgPSBzcGhlcmVfLnJmO1xuICB0aGlzLnNwaGVyZSA9IHNwaGVyZV8uc3BoZXJlO1xuXG4gIC8vIGNvcHkgdGhlIDMgdGhpbmdzIHdlIGNhbGN1bGF0ZWQgaW4gZGVyaXZlQ29uc3RhbnRzLmVjY2VudHJpY2l0eVxuICB0aGlzLmVzID0gZWNjLmVzO1xuICB0aGlzLmUgPSBlY2MuZTtcbiAgdGhpcy5lcDIgPSBlY2MuZXAyO1xuXG4gIC8vIGFkZCBpbiB0aGUgZGF0dW0gb2JqZWN0XG4gIHRoaXMuZGF0dW0gPSBkYXR1bU9iajtcblxuICAvLyBpbml0IHRoZSBwcm9qZWN0aW9uXG4gIGlmICgnaW5pdCcgaW4gdGhpcyAmJiB0eXBlb2YgdGhpcy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvLyBsZWdlY3kgY2FsbGJhY2sgZnJvbSBiYWNrIGluIHRoZSBkYXkgd2hlbiBpdCB3ZW50IHRvIHNwYXRpYWxyZWZlcmVuY2Uub3JnXG4gIGNhbGxiYWNrKG51bGwsIHRoaXMpO1xufVxuUHJvamVjdGlvbi5wcm9qZWN0aW9ucyA9IHByb2plY3Rpb25zO1xuUHJvamVjdGlvbi5wcm9qZWN0aW9ucy5zdGFydCgpO1xuZXhwb3J0IGRlZmF1bHQgUHJvamVjdGlvbjtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjcnMsIGRlbm9ybSwgcG9pbnQpIHtcbiAgdmFyIHhpbiA9IHBvaW50LngsXG4gICAgeWluID0gcG9pbnQueSxcbiAgICB6aW4gPSBwb2ludC56IHx8IDAuMDtcbiAgdmFyIHYsIHQsIGk7XG4gIC8qKiBAdHlwZSB7aW1wb3J0KFwiLi9jb3JlXCIpLkludGVyZmFjZUNvb3JkaW5hdGVzfSAqL1xuICB2YXIgb3V0ID0ge307XG4gIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBpZiAoZGVub3JtICYmIGkgPT09IDIgJiYgcG9pbnQueiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIHYgPSB4aW47XG4gICAgICBpZiAoJ2V3Jy5pbmRleE9mKGNycy5heGlzW2ldKSAhPT0gLTEpIHtcbiAgICAgICAgdCA9ICd4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHQgPSAneSc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpID09PSAxKSB7XG4gICAgICB2ID0geWluO1xuICAgICAgaWYgKCducycuaW5kZXhPZihjcnMuYXhpc1tpXSkgIT09IC0xKSB7XG4gICAgICAgIHQgPSAneSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ID0gJ3gnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2ID0gemluO1xuICAgICAgdCA9ICd6JztcbiAgICB9XG4gICAgc3dpdGNoIChjcnMuYXhpc1tpXSkge1xuICAgICAgY2FzZSAnZSc6XG4gICAgICAgIG91dFt0XSA9IHY7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndyc6XG4gICAgICAgIG91dFt0XSA9IC12O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ24nOlxuICAgICAgICBvdXRbdF0gPSB2O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3MnOlxuICAgICAgICBvdXRbdF0gPSAtdjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1JzpcbiAgICAgICAgaWYgKHBvaW50W3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvdXQueiA9IHY7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkJzpcbiAgICAgICAgaWYgKHBvaW50W3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvdXQueiA9IC12O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiRVJST1I6IHVua25vdyBheGlzIChcIitjcnMuYXhpc1tpXStcIikgLSBjaGVjayBkZWZpbml0aW9uIG9mIFwiK2Nycy5wcm9qTmFtZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBvaW50KSB7XG4gIGNoZWNrQ29vcmQocG9pbnQueCk7XG4gIGNoZWNrQ29vcmQocG9pbnQueSk7XG59XG5mdW5jdGlvbiBjaGVja0Nvb3JkKG51bSkge1xuICBpZiAodHlwZW9mIE51bWJlci5pc0Zpbml0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobnVtKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb29yZGluYXRlcyBtdXN0IGJlIGZpbml0ZSBudW1iZXJzJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBudW0gIT09ICdudW1iZXInIHx8IG51bSAhPT0gbnVtIHx8ICFpc0Zpbml0ZShudW0pKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29vcmRpbmF0ZXMgbXVzdCBiZSBmaW5pdGUgbnVtYmVycycpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgc2lnbiBmcm9tICcuL3NpZ24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gKE1hdGguYWJzKHgpIDwgSEFMRl9QSSkgPyB4IDogKHggLSAoc2lnbih4KSAqIE1hdGguUEkpKTtcbn1cbiIsImltcG9ydCB7IFRXT19QSSwgU1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgc2lnbiBmcm9tICcuL3NpZ24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCwgc2tpcEFkanVzdCkge1xuICBpZiAoc2tpcEFkanVzdCkge1xuICAgIHJldHVybiB4O1xuICB9XG4gIHJldHVybiAoTWF0aC5hYnMoeCkgPD0gU1BJKSA/IHggOiAoeCAtIChzaWduKHgpICogVFdPX1BJKSk7XG59XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuL2FkanVzdF9sb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoem9uZSwgbG9uKSB7XG4gIGlmICh6b25lID09PSB1bmRlZmluZWQpIHtcbiAgICB6b25lID0gTWF0aC5mbG9vcigoYWRqdXN0X2xvbihsb24pICsgTWF0aC5QSSkgKiAzMCAvIE1hdGguUEkpICsgMTtcblxuICAgIGlmICh6b25lIDwgMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmICh6b25lID4gNjApIHtcbiAgICAgIHJldHVybiA2MDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHpvbmU7XG59XG4iLCJpbXBvcnQgaHlwb3QgZnJvbSAnLi9oeXBvdCc7XG5pbXBvcnQgbG9nMXB5IGZyb20gJy4vbG9nMXB5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHkgPSBNYXRoLmFicyh4KTtcbiAgeSA9IGxvZzFweSh5ICogKDEgKyB5IC8gKGh5cG90KDEsIHkpICsgMSkpKTtcblxuICByZXR1cm4geCA8IDAgPyAteSA6IHk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICBpZiAoTWF0aC5hYnMoeCkgPiAxKSB7XG4gICAgeCA9ICh4ID4gMSkgPyAxIDogLTE7XG4gIH1cbiAgcmV0dXJuIE1hdGguYXNpbih4KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwcCwgYXJnX3IpIHtcbiAgdmFyIHIgPSAyICogTWF0aC5jb3MoYXJnX3IpO1xuICB2YXIgaSA9IHBwLmxlbmd0aCAtIDE7XG4gIHZhciBocjEgPSBwcFtpXTtcbiAgdmFyIGhyMiA9IDA7XG4gIHZhciBocjtcblxuICB3aGlsZSAoLS1pID49IDApIHtcbiAgICBociA9IC1ocjIgKyByICogaHIxICsgcHBbaV07XG4gICAgaHIyID0gaHIxO1xuICAgIGhyMSA9IGhyO1xuICB9XG5cbiAgcmV0dXJuIE1hdGguc2luKGFyZ19yKSAqIGhyO1xufVxuIiwiaW1wb3J0IHNpbmggZnJvbSAnLi9zaW5oJztcbmltcG9ydCBjb3NoIGZyb20gJy4vY29zaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwcCwgYXJnX3IsIGFyZ19pKSB7XG4gIHZhciBzaW5fYXJnX3IgPSBNYXRoLnNpbihhcmdfcik7XG4gIHZhciBjb3NfYXJnX3IgPSBNYXRoLmNvcyhhcmdfcik7XG4gIHZhciBzaW5oX2FyZ19pID0gc2luaChhcmdfaSk7XG4gIHZhciBjb3NoX2FyZ19pID0gY29zaChhcmdfaSk7XG4gIHZhciByID0gMiAqIGNvc19hcmdfciAqIGNvc2hfYXJnX2k7XG4gIHZhciBpID0gLTIgKiBzaW5fYXJnX3IgKiBzaW5oX2FyZ19pO1xuICB2YXIgaiA9IHBwLmxlbmd0aCAtIDE7XG4gIHZhciBociA9IHBwW2pdO1xuICB2YXIgaGkxID0gMDtcbiAgdmFyIGhyMSA9IDA7XG4gIHZhciBoaSA9IDA7XG4gIHZhciBocjI7XG4gIHZhciBoaTI7XG5cbiAgd2hpbGUgKC0taiA+PSAwKSB7XG4gICAgaHIyID0gaHIxO1xuICAgIGhpMiA9IGhpMTtcbiAgICBocjEgPSBocjtcbiAgICBoaTEgPSBoaTtcbiAgICBociA9IC1ocjIgKyByICogaHIxIC0gaSAqIGhpMSArIHBwW2pdO1xuICAgIGhpID0gLWhpMiArIGkgKiBocjEgKyByICogaGkxO1xuICB9XG5cbiAgciA9IHNpbl9hcmdfciAqIGNvc2hfYXJnX2k7XG4gIGkgPSBjb3NfYXJnX3IgKiBzaW5oX2FyZ19pO1xuXG4gIHJldHVybiBbciAqIGhyIC0gaSAqIGhpLCByICogaGkgKyBpICogaHJdO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHIgPSBNYXRoLmV4cCh4KTtcbiAgciA9IChyICsgMSAvIHIpIC8gMjtcbiAgcmV0dXJuIHI7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gKDEgLSAwLjI1ICogeCAqICgxICsgeCAvIDE2ICogKDMgKyAxLjI1ICogeCkpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiAoMC4zNzUgKiB4ICogKDEgKyAwLjI1ICogeCAqICgxICsgMC40Njg3NSAqIHgpKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gKDAuMDU4NTkzNzUgKiB4ICogeCAqICgxICsgMC43NSAqIHgpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiAoeCAqIHggKiB4ICogKDM1IC8gMzA3MikpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGEsIGUsIHNpbnBoaSkge1xuICB2YXIgdGVtcCA9IGUgKiBzaW5waGk7XG4gIHJldHVybiBhIC8gTWF0aC5zcXJ0KDEgLSB0ZW1wICogdGVtcCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHAsIEIpIHtcbiAgdmFyIGNvc18yQiA9IDIgKiBNYXRoLmNvcygyICogQik7XG4gIHZhciBpID0gcHAubGVuZ3RoIC0gMTtcbiAgdmFyIGgxID0gcHBbaV07XG4gIHZhciBoMiA9IDA7XG4gIHZhciBoO1xuXG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIGggPSAtaDIgKyBjb3NfMkIgKiBoMSArIHBwW2ldO1xuICAgIGgyID0gaDE7XG4gICAgaDEgPSBoO1xuICB9XG5cbiAgcmV0dXJuIChCICsgaCAqIE1hdGguc2luKDIgKiBCKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCwgeSkge1xuICB4ID0gTWF0aC5hYnMoeCk7XG4gIHkgPSBNYXRoLmFicyh5KTtcbiAgdmFyIGEgPSBNYXRoLm1heCh4LCB5KTtcbiAgdmFyIGIgPSBNYXRoLm1pbih4LCB5KSAvIChhID8gYSA6IDEpO1xuXG4gIHJldHVybiBhICogTWF0aC5zcXJ0KDEgKyBNYXRoLnBvdyhiLCAyKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobWwsIGUwLCBlMSwgZTIsIGUzKSB7XG4gIHZhciBwaGk7XG4gIHZhciBkcGhpO1xuXG4gIHBoaSA9IG1sIC8gZTA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTU7IGkrKykge1xuICAgIGRwaGkgPSAobWwgLSAoZTAgKiBwaGkgLSBlMSAqIE1hdGguc2luKDIgKiBwaGkpICsgZTIgKiBNYXRoLnNpbig0ICogcGhpKSAtIGUzICogTWF0aC5zaW4oNiAqIHBoaSkpKSAvIChlMCAtIDIgKiBlMSAqIE1hdGguY29zKDIgKiBwaGkpICsgNCAqIGUyICogTWF0aC5jb3MoNCAqIHBoaSkgLSA2ICogZTMgKiBNYXRoLmNvcyg2ICogcGhpKSk7XG4gICAgcGhpICs9IGRwaGk7XG4gICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IDAuMDAwMDAwMDAwMSkge1xuICAgICAgcmV0dXJuIHBoaTtcbiAgICB9XG4gIH1cblxuICAvLyAuLnJlcG9ydEVycm9yKFwiSU1MRk4tQ09OVjpMYXRpdHVkZSBmYWlsZWQgdG8gY29udmVyZ2UgYWZ0ZXIgMTUgaXRlcmF0aW9uc1wiKTtcbiAgcmV0dXJuIE5hTjtcbn1cbiIsImltcG9ydCB7IEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGVjY2VudCwgcSkge1xuICB2YXIgdGVtcCA9IDEgLSAoMSAtIGVjY2VudCAqIGVjY2VudCkgLyAoMiAqIGVjY2VudCkgKiBNYXRoLmxvZygoMSAtIGVjY2VudCkgLyAoMSArIGVjY2VudCkpO1xuICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMocSkgLSB0ZW1wKSA8IDEuMEUtNikge1xuICAgIGlmIChxIDwgMCkge1xuICAgICAgcmV0dXJuICgtMSAqIEhBTEZfUEkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gSEFMRl9QSTtcbiAgICB9XG4gIH1cbiAgLy8gdmFyIHBoaSA9IDAuNSogcS8oMS1lY2NlbnQqZWNjZW50KTtcbiAgdmFyIHBoaSA9IE1hdGguYXNpbigwLjUgKiBxKTtcbiAgdmFyIGRwaGk7XG4gIHZhciBzaW5fcGhpO1xuICB2YXIgY29zX3BoaTtcbiAgdmFyIGNvbjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMDsgaSsrKSB7XG4gICAgc2luX3BoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgY29zX3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgY29uID0gZWNjZW50ICogc2luX3BoaTtcbiAgICBkcGhpID0gTWF0aC5wb3coMSAtIGNvbiAqIGNvbiwgMikgLyAoMiAqIGNvc19waGkpICogKHEgLyAoMSAtIGVjY2VudCAqIGVjY2VudCkgLSBzaW5fcGhpIC8gKDEgLSBjb24gKiBjb24pICsgMC41IC8gZWNjZW50ICogTWF0aC5sb2coKDEgLSBjb24pIC8gKDEgKyBjb24pKSk7XG4gICAgcGhpICs9IGRwaGk7XG4gICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IDAuMDAwMDAwMDAwMSkge1xuICAgICAgcmV0dXJuIHBoaTtcbiAgICB9XG4gIH1cblxuICAvLyBjb25zb2xlLmxvZyhcIklRU0ZOLUNPTlY6TGF0aXR1ZGUgZmFpbGVkIHRvIGNvbnZlcmdlIGFmdGVyIDMwIGl0ZXJhdGlvbnNcIik7XG4gIHJldHVybiBOYU47XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICB2YXIgeSA9IDEgKyB4O1xuICB2YXIgeiA9IHkgLSAxO1xuXG4gIHJldHVybiB6ID09PSAwID8geCA6IHggKiBNYXRoLmxvZyh5KSAvIHo7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZTAsIGUxLCBlMiwgZTMsIHBoaSkge1xuICByZXR1cm4gKGUwICogcGhpIC0gZTEgKiBNYXRoLnNpbigyICogcGhpKSArIGUyICogTWF0aC5zaW4oNCAqIHBoaSkgLSBlMyAqIE1hdGguc2luKDYgKiBwaGkpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlY2NlbnQsIHNpbnBoaSwgY29zcGhpKSB7XG4gIHZhciBjb24gPSBlY2NlbnQgKiBzaW5waGk7XG4gIHJldHVybiBjb3NwaGkgLyAoTWF0aC5zcXJ0KDEgLSBjb24gKiBjb24pKTtcbn1cbiIsImltcG9ydCB7IEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGVjY2VudCwgdHMpIHtcbiAgdmFyIGVjY250aCA9IDAuNSAqIGVjY2VudDtcbiAgdmFyIGNvbiwgZHBoaTtcbiAgdmFyIHBoaSA9IEhBTEZfUEkgLSAyICogTWF0aC5hdGFuKHRzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPD0gMTU7IGkrKykge1xuICAgIGNvbiA9IGVjY2VudCAqIE1hdGguc2luKHBoaSk7XG4gICAgZHBoaSA9IEhBTEZfUEkgLSAyICogTWF0aC5hdGFuKHRzICogKE1hdGgucG93KCgoMSAtIGNvbikgLyAoMSArIGNvbikpLCBlY2NudGgpKSkgLSBwaGk7XG4gICAgcGhpICs9IGRwaGk7XG4gICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IDAuMDAwMDAwMDAwMSkge1xuICAgICAgcmV0dXJuIHBoaTtcbiAgICB9XG4gIH1cbiAgLy8gY29uc29sZS5sb2coXCJwaGkyeiBoYXMgTm9Db252ZXJnZW5jZVwiKTtcbiAgcmV0dXJuIC05OTk5O1xufVxuIiwidmFyIEMwMCA9IDE7XG52YXIgQzAyID0gMC4yNTtcbnZhciBDMDQgPSAwLjA0Njg3NTtcbnZhciBDMDYgPSAwLjAxOTUzMTI1O1xudmFyIEMwOCA9IDAuMDEwNjgxMTUyMzQzNzU7XG52YXIgQzIyID0gMC43NTtcbnZhciBDNDQgPSAwLjQ2ODc1O1xudmFyIEM0NiA9IDAuMDEzMDIwODMzMzMzMzMzMzMzMzM7XG52YXIgQzQ4ID0gMC4wMDcxMjA3NjgyMjkxNjY2NjY2NjtcbnZhciBDNjYgPSAwLjM2NDU4MzMzMzMzMzMzMzMzMzMzO1xudmFyIEM2OCA9IDAuMDA1Njk2NjE0NTgzMzMzMzMzMzM7XG52YXIgQzg4ID0gMC4zMDc2MTcxODc1O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZXMpIHtcbiAgdmFyIGVuID0gW107XG4gIGVuWzBdID0gQzAwIC0gZXMgKiAoQzAyICsgZXMgKiAoQzA0ICsgZXMgKiAoQzA2ICsgZXMgKiBDMDgpKSk7XG4gIGVuWzFdID0gZXMgKiAoQzIyIC0gZXMgKiAoQzA0ICsgZXMgKiAoQzA2ICsgZXMgKiBDMDgpKSk7XG4gIHZhciB0ID0gZXMgKiBlcztcbiAgZW5bMl0gPSB0ICogKEM0NCAtIGVzICogKEM0NiArIGVzICogQzQ4KSk7XG4gIHQgKj0gZXM7XG4gIGVuWzNdID0gdCAqIChDNjYgLSBlcyAqIEM2OCk7XG4gIGVuWzRdID0gdCAqIGVzICogQzg4O1xuICByZXR1cm4gZW47XG59XG4iLCJpbXBvcnQgcGpfbWxmbiBmcm9tICcuL3BqX21sZm4nO1xuaW1wb3J0IHsgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxudmFyIE1BWF9JVEVSID0gMjA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhcmcsIGVzLCBlbikge1xuICB2YXIgayA9IDEgLyAoMSAtIGVzKTtcbiAgdmFyIHBoaSA9IGFyZztcbiAgZm9yICh2YXIgaSA9IE1BWF9JVEVSOyBpOyAtLWkpIHsgLyogcmFyZWx5IGdvZXMgb3ZlciAyIGl0ZXJhdGlvbnMgKi9cbiAgICB2YXIgcyA9IE1hdGguc2luKHBoaSk7XG4gICAgdmFyIHQgPSAxIC0gZXMgKiBzICogcztcbiAgICAvLyB0ID0gdGhpcy5wal9tbGZuKHBoaSwgcywgTWF0aC5jb3MocGhpKSwgZW4pIC0gYXJnO1xuICAgIC8vIHBoaSAtPSB0ICogKHQgKiBNYXRoLnNxcnQodCkpICogaztcbiAgICB0ID0gKHBqX21sZm4ocGhpLCBzLCBNYXRoLmNvcyhwaGkpLCBlbikgLSBhcmcpICogKHQgKiBNYXRoLnNxcnQodCkpICogaztcbiAgICBwaGkgLT0gdDtcbiAgICBpZiAoTWF0aC5hYnModCkgPCBFUFNMTikge1xuICAgICAgcmV0dXJuIHBoaTtcbiAgICB9XG4gIH1cbiAgLy8gLi5yZXBvcnRFcnJvcihcImNhc3M6cGpfaW52X21sZm46IENvbnZlcmdlbmNlIGVycm9yXCIpO1xuICByZXR1cm4gcGhpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBoaSwgc3BoaSwgY3BoaSwgZW4pIHtcbiAgY3BoaSAqPSBzcGhpO1xuICBzcGhpICo9IHNwaGk7XG4gIHJldHVybiAoZW5bMF0gKiBwaGkgLSBjcGhpICogKGVuWzFdICsgc3BoaSAqIChlblsyXSArIHNwaGkgKiAoZW5bM10gKyBzcGhpICogZW5bNF0pKSkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGVjY2VudCwgc2lucGhpKSB7XG4gIHZhciBjb247XG4gIGlmIChlY2NlbnQgPiAxLjBlLTcpIHtcbiAgICBjb24gPSBlY2NlbnQgKiBzaW5waGk7XG4gICAgcmV0dXJuICgoMSAtIGVjY2VudCAqIGVjY2VudCkgKiAoc2lucGhpIC8gKDEgLSBjb24gKiBjb24pIC0gKDAuNSAvIGVjY2VudCkgKiBNYXRoLmxvZygoMSAtIGNvbikgLyAoMSArIGNvbikpKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICgyICogc2lucGhpKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuIHggPCAwID8gLTEgOiAxO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHIgPSBNYXRoLmV4cCh4KTtcbiAgciA9IChyIC0gMSAvIHIpIC8gMjtcbiAgcmV0dXJuIHI7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZXNpbnAsIGV4cCkge1xuICByZXR1cm4gKE1hdGgucG93KCgxIC0gZXNpbnApIC8gKDEgKyBlc2lucCksIGV4cCkpO1xufVxuIiwiLyoqXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IGFycmF5XG4gKiBAcmV0dXJucyB7aW1wb3J0KFwiLi4vY29yZVwiKS5JbnRlcmZhY2VDb29yZGluYXRlc31cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFycmF5KSB7XG4gIHZhciBvdXQgPSB7XG4gICAgeDogYXJyYXlbMF0sXG4gICAgeTogYXJyYXlbMV1cbiAgfTtcbiAgaWYgKGFycmF5Lmxlbmd0aCA+IDIpIHtcbiAgICBvdXQueiA9IGFycmF5WzJdO1xuICB9XG4gIGlmIChhcnJheS5sZW5ndGggPiAzKSB7XG4gICAgb3V0Lm0gPSBhcnJheVszXTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiaW1wb3J0IHsgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZWNjZW50LCBwaGksIHNpbnBoaSkge1xuICB2YXIgY29uID0gZWNjZW50ICogc2lucGhpO1xuICB2YXIgY29tID0gMC41ICogZWNjZW50O1xuICBjb24gPSBNYXRoLnBvdygoKDEgLSBjb24pIC8gKDEgKyBjb24pKSwgY29tKTtcbiAgcmV0dXJuIChNYXRoLnRhbigwLjUgKiAoSEFMRl9QSSAtIHBoaSkpIC8gY29uKTtcbn1cbiIsIi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgaW52ZXJzZSBnZW9kZXNpYyBwcm9ibGVtIHVzaW5nIFZpbmNlbnR5J3MgZm9ybXVsYWUuXG4gKiBDb21wdXRlcyB0aGUgZm9yd2FyZCBhemltdXRoIGFuZCBlbGxpcHNvaWRhbCBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIHNwZWNpZmllZCBieSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIG9uIHRoZSBzdXJmYWNlIG9mIGFuIGVsbGlwc29pZC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbGF0MSBMYXRpdHVkZSBvZiB0aGUgZmlyc3QgcG9pbnQgaW4gcmFkaWFucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsb24xIExvbmdpdHVkZSBvZiB0aGUgZmlyc3QgcG9pbnQgaW4gcmFkaWFucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsYXQyIExhdGl0dWRlIG9mIHRoZSBzZWNvbmQgcG9pbnQgaW4gcmFkaWFucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsb24yIExvbmdpdHVkZSBvZiB0aGUgc2Vjb25kIHBvaW50IGluIHJhZGlhbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gYSBTZW1pLW1ham9yIGF4aXMgb2YgdGhlIGVsbGlwc29pZCAobWV0ZXJzKS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmIEZsYXR0ZW5pbmcgb2YgdGhlIGVsbGlwc29pZC5cbiAqIEByZXR1cm5zIHt7IGF6aTE6IG51bWJlciwgczEyOiBudW1iZXIgfX0gQW4gb2JqZWN0IGNvbnRhaW5pbmc6XG4gKiAgIC0gYXppMTogRm9yd2FyZCBhemltdXRoIGZyb20gdGhlIGZpcnN0IHBvaW50IHRvIHRoZSBzZWNvbmQgcG9pbnQgKHJhZGlhbnMpLlxuICogICAtIHMxMjogRWxsaXBzb2lkYWwgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIHBvaW50cyAobWV0ZXJzKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZpbmNlbnR5SW52ZXJzZShsYXQxLCBsb24xLCBsYXQyLCBsb24yLCBhLCBmKSB7XG4gIGNvbnN0IEwgPSBsb24yIC0gbG9uMTtcbiAgY29uc3QgVTEgPSBNYXRoLmF0YW4oKDEgLSBmKSAqIE1hdGgudGFuKGxhdDEpKTtcbiAgY29uc3QgVTIgPSBNYXRoLmF0YW4oKDEgLSBmKSAqIE1hdGgudGFuKGxhdDIpKTtcbiAgY29uc3Qgc2luVTEgPSBNYXRoLnNpbihVMSksIGNvc1UxID0gTWF0aC5jb3MoVTEpO1xuICBjb25zdCBzaW5VMiA9IE1hdGguc2luKFUyKSwgY29zVTIgPSBNYXRoLmNvcyhVMik7XG5cbiAgbGV0IGxhbWJkYSA9IEwsIGxhbWJkYVAsIGl0ZXJMaW1pdCA9IDEwMDtcbiAgbGV0IHNpbkxhbWJkYSwgY29zTGFtYmRhLCBzaW5TaWdtYSwgY29zU2lnbWEsIHNpZ21hLCBzaW5BbHBoYSwgY29zMkFscGhhLCBjb3MyU2lnbWFNLCBDO1xuICBsZXQgdVNxLCBBLCBCLCBkZWx0YVNpZ21hLCBzO1xuXG4gIGRvIHtcbiAgICBzaW5MYW1iZGEgPSBNYXRoLnNpbihsYW1iZGEpO1xuICAgIGNvc0xhbWJkYSA9IE1hdGguY29zKGxhbWJkYSk7XG4gICAgc2luU2lnbWEgPSBNYXRoLnNxcnQoXG4gICAgICAoY29zVTIgKiBzaW5MYW1iZGEpICogKGNvc1UyICogc2luTGFtYmRhKVxuICAgICAgKyAoY29zVTEgKiBzaW5VMiAtIHNpblUxICogY29zVTIgKiBjb3NMYW1iZGEpXG4gICAgICAqIChjb3NVMSAqIHNpblUyIC0gc2luVTEgKiBjb3NVMiAqIGNvc0xhbWJkYSlcbiAgICApO1xuICAgIGlmIChzaW5TaWdtYSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHsgYXppMTogMCwgczEyOiAwIH07IC8vIGNvaW5jaWRlbnQgcG9pbnRzXG4gICAgfVxuICAgIGNvc1NpZ21hID0gc2luVTEgKiBzaW5VMiArIGNvc1UxICogY29zVTIgKiBjb3NMYW1iZGE7XG4gICAgc2lnbWEgPSBNYXRoLmF0YW4yKHNpblNpZ21hLCBjb3NTaWdtYSk7XG4gICAgc2luQWxwaGEgPSBjb3NVMSAqIGNvc1UyICogc2luTGFtYmRhIC8gc2luU2lnbWE7XG4gICAgY29zMkFscGhhID0gMSAtIHNpbkFscGhhICogc2luQWxwaGE7XG4gICAgY29zMlNpZ21hTSA9IChjb3MyQWxwaGEgIT09IDApID8gKGNvc1NpZ21hIC0gMiAqIHNpblUxICogc2luVTIgLyBjb3MyQWxwaGEpIDogMDtcbiAgICBDID0gZiAvIDE2ICogY29zMkFscGhhICogKDQgKyBmICogKDQgLSAzICogY29zMkFscGhhKSk7XG4gICAgbGFtYmRhUCA9IGxhbWJkYTtcbiAgICBsYW1iZGEgPSBMICsgKDEgLSBDKSAqIGYgKiBzaW5BbHBoYVxuICAgICogKHNpZ21hICsgQyAqIHNpblNpZ21hICogKGNvczJTaWdtYU0gKyBDICogY29zU2lnbWEgKiAoLTEgKyAyICogY29zMlNpZ21hTSAqIGNvczJTaWdtYU0pKSk7XG4gIH0gd2hpbGUgKE1hdGguYWJzKGxhbWJkYSAtIGxhbWJkYVApID4gMWUtMTIgJiYgLS1pdGVyTGltaXQgPiAwKTtcblxuICBpZiAoaXRlckxpbWl0ID09PSAwKSB7XG4gICAgcmV0dXJuIHsgYXppMTogTmFOLCBzMTI6IE5hTiB9OyAvLyBmb3JtdWxhIGZhaWxlZCB0byBjb252ZXJnZVxuICB9XG5cbiAgdVNxID0gY29zMkFscGhhICogKGEgKiBhIC0gKGEgKiAoMSAtIGYpKSAqIChhICogKDEgLSBmKSkpIC8gKChhICogKDEgLSBmKSkgKiAoYSAqICgxIC0gZikpKTtcbiAgQSA9IDEgKyB1U3EgLyAxNjM4NCAqICg0MDk2ICsgdVNxICogKC03NjggKyB1U3EgKiAoMzIwIC0gMTc1ICogdVNxKSkpO1xuICBCID0gdVNxIC8gMTAyNCAqICgyNTYgKyB1U3EgKiAoLTEyOCArIHVTcSAqICg3NCAtIDQ3ICogdVNxKSkpO1xuICBkZWx0YVNpZ21hID0gQiAqIHNpblNpZ21hICogKGNvczJTaWdtYU0gKyBCIC8gNCAqIChjb3NTaWdtYSAqICgtMSArIDIgKiBjb3MyU2lnbWFNICogY29zMlNpZ21hTSlcbiAgICAtIEIgLyA2ICogY29zMlNpZ21hTSAqICgtMyArIDQgKiBzaW5TaWdtYSAqIHNpblNpZ21hKSAqICgtMyArIDQgKiBjb3MyU2lnbWFNICogY29zMlNpZ21hTSkpKTtcblxuICBzID0gKGEgKiAoMSAtIGYpKSAqIEEgKiAoc2lnbWEgLSBkZWx0YVNpZ21hKTtcblxuICAvLyBGb3J3YXJkIGF6aW11dGhcbiAgY29uc3QgYXppMSA9IE1hdGguYXRhbjIoY29zVTIgKiBzaW5MYW1iZGEsIGNvc1UxICogc2luVTIgLSBzaW5VMSAqIGNvc1UyICogY29zTGFtYmRhKTtcblxuICByZXR1cm4geyBhemkxLCBzMTI6IHMgfTtcbn1cblxuLyoqXG4gKiBTb2x2ZXMgdGhlIGRpcmVjdCBnZW9kZXRpYyBwcm9ibGVtIHVzaW5nIFZpbmNlbnR5J3MgZm9ybXVsYWUuXG4gKiBHaXZlbiBhIHN0YXJ0aW5nIHBvaW50LCBpbml0aWFsIGF6aW11dGgsIGFuZCBkaXN0YW5jZSwgY29tcHV0ZXMgdGhlIGRlc3RpbmF0aW9uIHBvaW50IG9uIHRoZSBlbGxpcHNvaWQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGxhdDEgTGF0aXR1ZGUgb2YgdGhlIHN0YXJ0aW5nIHBvaW50IGluIHJhZGlhbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gbG9uMSBMb25naXR1ZGUgb2YgdGhlIHN0YXJ0aW5nIHBvaW50IGluIHJhZGlhbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gYXppMSBJbml0aWFsIGF6aW11dGggKGZvcndhcmQgYXppbXV0aCkgaW4gcmFkaWFucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzMTIgRGlzdGFuY2UgdG8gdHJhdmVsIGZyb20gdGhlIHN0YXJ0aW5nIHBvaW50IGluIG1ldGVycy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhIFNlbWktbWFqb3IgYXhpcyBvZiB0aGUgZWxsaXBzb2lkIGluIG1ldGVycy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmIEZsYXR0ZW5pbmcgb2YgdGhlIGVsbGlwc29pZC5cbiAqIEByZXR1cm5zIHt7bGF0MjogbnVtYmVyLCBsb24yOiBudW1iZXJ9fSBUaGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSAoaW4gcmFkaWFucykgb2YgdGhlIGRlc3RpbmF0aW9uIHBvaW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdmluY2VudHlEaXJlY3QobGF0MSwgbG9uMSwgYXppMSwgczEyLCBhLCBmKSB7XG4gIGNvbnN0IFUxID0gTWF0aC5hdGFuKCgxIC0gZikgKiBNYXRoLnRhbihsYXQxKSk7XG4gIGNvbnN0IHNpblUxID0gTWF0aC5zaW4oVTEpLCBjb3NVMSA9IE1hdGguY29zKFUxKTtcbiAgY29uc3Qgc2luQWxwaGExID0gTWF0aC5zaW4oYXppMSksIGNvc0FscGhhMSA9IE1hdGguY29zKGF6aTEpO1xuXG4gIGNvbnN0IHNpZ21hMSA9IE1hdGguYXRhbjIoc2luVTEsIGNvc1UxICogY29zQWxwaGExKTtcbiAgY29uc3Qgc2luQWxwaGEgPSBjb3NVMSAqIHNpbkFscGhhMTtcbiAgY29uc3QgY29zMkFscGhhID0gMSAtIHNpbkFscGhhICogc2luQWxwaGE7XG4gIGNvbnN0IHVTcSA9IGNvczJBbHBoYSAqIChhICogYSAtIChhICogKDEgLSBmKSkgKiAoYSAqICgxIC0gZikpKSAvICgoYSAqICgxIC0gZikpICogKGEgKiAoMSAtIGYpKSk7XG4gIGNvbnN0IEEgPSAxICsgdVNxIC8gMTYzODQgKiAoNDA5NiArIHVTcSAqICgtNzY4ICsgdVNxICogKDMyMCAtIDE3NSAqIHVTcSkpKTtcbiAgY29uc3QgQiA9IHVTcSAvIDEwMjQgKiAoMjU2ICsgdVNxICogKC0xMjggKyB1U3EgKiAoNzQgLSA0NyAqIHVTcSkpKTtcblxuICBsZXQgc2lnbWEgPSBzMTIgLyAoKGEgKiAoMSAtIGYpKSAqIEEpLCBzaWdtYVAsIGl0ZXJMaW1pdCA9IDEwMDtcbiAgbGV0IGNvczJTaWdtYU0sIHNpblNpZ21hLCBjb3NTaWdtYSwgZGVsdGFTaWdtYTtcblxuICBkbyB7XG4gICAgY29zMlNpZ21hTSA9IE1hdGguY29zKDIgKiBzaWdtYTEgKyBzaWdtYSk7XG4gICAgc2luU2lnbWEgPSBNYXRoLnNpbihzaWdtYSk7XG4gICAgY29zU2lnbWEgPSBNYXRoLmNvcyhzaWdtYSk7XG4gICAgZGVsdGFTaWdtYSA9IEIgKiBzaW5TaWdtYSAqIChjb3MyU2lnbWFNICsgQiAvIDQgKiAoY29zU2lnbWEgKiAoLTEgKyAyICogY29zMlNpZ21hTSAqIGNvczJTaWdtYU0pXG4gICAgICAtIEIgLyA2ICogY29zMlNpZ21hTSAqICgtMyArIDQgKiBzaW5TaWdtYSAqIHNpblNpZ21hKSAqICgtMyArIDQgKiBjb3MyU2lnbWFNICogY29zMlNpZ21hTSkpKTtcbiAgICBzaWdtYVAgPSBzaWdtYTtcbiAgICBzaWdtYSA9IHMxMiAvICgoYSAqICgxIC0gZikpICogQSkgKyBkZWx0YVNpZ21hO1xuICB9IHdoaWxlIChNYXRoLmFicyhzaWdtYSAtIHNpZ21hUCkgPiAxZS0xMiAmJiAtLWl0ZXJMaW1pdCA+IDApO1xuXG4gIGlmIChpdGVyTGltaXQgPT09IDApIHtcbiAgICByZXR1cm4geyBsYXQyOiBOYU4sIGxvbjI6IE5hTiB9O1xuICB9XG5cbiAgY29uc3QgdG1wID0gc2luVTEgKiBzaW5TaWdtYSAtIGNvc1UxICogY29zU2lnbWEgKiBjb3NBbHBoYTE7XG4gIGNvbnN0IGxhdDIgPSBNYXRoLmF0YW4yKFxuICAgIHNpblUxICogY29zU2lnbWEgKyBjb3NVMSAqIHNpblNpZ21hICogY29zQWxwaGExLFxuICAgICgxIC0gZikgKiBNYXRoLnNxcnQoc2luQWxwaGEgKiBzaW5BbHBoYSArIHRtcCAqIHRtcClcbiAgKTtcbiAgY29uc3QgbGFtYmRhID0gTWF0aC5hdGFuMihcbiAgICBzaW5TaWdtYSAqIHNpbkFscGhhMSxcbiAgICBjb3NVMSAqIGNvc1NpZ21hIC0gc2luVTEgKiBzaW5TaWdtYSAqIGNvc0FscGhhMVxuICApO1xuICBjb25zdCBDID0gZiAvIDE2ICogY29zMkFscGhhICogKDQgKyBmICogKDQgLSAzICogY29zMkFscGhhKSk7XG4gIGNvbnN0IEwgPSBsYW1iZGEgLSAoMSAtIEMpICogZiAqIHNpbkFscGhhXG4gICAgKiAoc2lnbWEgKyBDICogc2luU2lnbWEgKiAoY29zMlNpZ21hTSArIEMgKiBjb3NTaWdtYSAqICgtMSArIDIgKiBjb3MyU2lnbWFNICogY29zMlNpZ21hTSkpKTtcbiAgY29uc3QgbG9uMiA9IGxvbjEgKyBMO1xuXG4gIHJldHVybiB7IGxhdDIsIGxvbjIgfTtcbn1cbiIsInZhciBkYXR1bXMgPSB7XG4gIHdnczg0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJyxcbiAgICBlbGxpcHNlOiAnV0dTODQnLFxuICAgIGRhdHVtTmFtZTogJ1dHUzg0J1xuICB9LFxuICBjaDE5MDM6IHtcbiAgICB0b3dnczg0OiAnNjc0LjM3NCwxNS4wNTYsNDA1LjM0NicsXG4gICAgZWxsaXBzZTogJ2Jlc3NlbCcsXG4gICAgZGF0dW1OYW1lOiAnc3dpc3MnXG4gIH0sXG4gIGdncnM4Nzoge1xuICAgIHRvd2dzODQ6ICctMTk5Ljg3LDc0Ljc5LDI0Ni42MicsXG4gICAgZWxsaXBzZTogJ0dSUzgwJyxcbiAgICBkYXR1bU5hbWU6ICdHcmVla19HZW9kZXRpY19SZWZlcmVuY2VfU3lzdGVtXzE5ODcnXG4gIH0sXG4gIG5hZDgzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJyxcbiAgICBlbGxpcHNlOiAnR1JTODAnLFxuICAgIGRhdHVtTmFtZTogJ05vcnRoX0FtZXJpY2FuX0RhdHVtXzE5ODMnXG4gIH0sXG4gIG5hZDI3OiB7XG4gICAgbmFkZ3JpZHM6ICdAY29udXMsQGFsYXNrYSxAbnR2Ml8wLmdzYixAbnR2MV9jYW4uZGF0JyxcbiAgICBlbGxpcHNlOiAnY2xyazY2JyxcbiAgICBkYXR1bU5hbWU6ICdOb3J0aF9BbWVyaWNhbl9EYXR1bV8xOTI3J1xuICB9LFxuICBwb3RzZGFtOiB7XG4gICAgdG93Z3M4NDogJzU5OC4xLDczLjcsNDE4LjIsMC4yMDIsMC4wNDUsLTIuNDU1LDYuNycsXG4gICAgZWxsaXBzZTogJ2Jlc3NlbCcsXG4gICAgZGF0dW1OYW1lOiAnUG90c2RhbSBSYXVlbmJlcmcgMTk1MCBESEROJ1xuICB9LFxuICBjYXJ0aGFnZToge1xuICAgIHRvd2dzODQ6ICctMjYzLjAsNi4wLDQzMS4wJyxcbiAgICBlbGxpcHNlOiAnY2xhcms4MCcsXG4gICAgZGF0dW1OYW1lOiAnQ2FydGhhZ2UgMTkzNCBUdW5pc2lhJ1xuICB9LFxuICBoZXJtYW5uc2tvZ2VsOiB7XG4gICAgdG93Z3M4NDogJzU3Ny4zMjYsOTAuMTI5LDQ2My45MTksNS4xMzcsMS40NzQsNS4yOTcsMi40MjMyJyxcbiAgICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgICBkYXR1bU5hbWU6ICdIZXJtYW5uc2tvZ2VsJ1xuICB9LFxuICBtZ2k6IHtcbiAgICB0b3dnczg0OiAnNTc3LjMyNiw5MC4xMjksNDYzLjkxOSw1LjEzNywxLjQ3NCw1LjI5NywyLjQyMzInLFxuICAgIGVsbGlwc2U6ICdiZXNzZWwnLFxuICAgIGRhdHVtTmFtZTogJ01pbGl0YXItR2VvZ3JhcGhpc2NoZSBJbnN0aXR1dCdcbiAgfSxcbiAgb3NuaTUyOiB7XG4gICAgdG93Z3M4NDogJzQ4Mi41MzAsLTEzMC41OTYsNTY0LjU1NywtMS4wNDIsLTAuMjE0LC0wLjYzMSw4LjE1JyxcbiAgICBlbGxpcHNlOiAnYWlyeScsXG4gICAgZGF0dW1OYW1lOiAnSXJpc2ggTmF0aW9uYWwnXG4gIH0sXG4gIGlyZTY1OiB7XG4gICAgdG93Z3M4NDogJzQ4Mi41MzAsLTEzMC41OTYsNTY0LjU1NywtMS4wNDIsLTAuMjE0LC0wLjYzMSw4LjE1JyxcbiAgICBlbGxpcHNlOiAnbW9kX2FpcnknLFxuICAgIGRhdHVtTmFtZTogJ0lyZWxhbmQgMTk2NSdcbiAgfSxcbiAgcmFzc2FkaXJhbjoge1xuICAgIHRvd2dzODQ6ICctMTMzLjYzLC0xNTcuNSwtMTU4LjYyJyxcbiAgICBlbGxpcHNlOiAnaW50bCcsXG4gICAgZGF0dW1OYW1lOiAnUmFzc2FkaXJhbidcbiAgfSxcbiAgbnpnZDQ5OiB7XG4gICAgdG93Z3M4NDogJzU5LjQ3LC01LjA0LDE4Ny40NCwwLjQ3LC0wLjEsMS4wMjQsLTQuNTk5MycsXG4gICAgZWxsaXBzZTogJ2ludGwnLFxuICAgIGRhdHVtTmFtZTogJ05ldyBaZWFsYW5kIEdlb2RldGljIERhdHVtIDE5NDknXG4gIH0sXG4gIG9zZ2IzNjoge1xuICAgIHRvd2dzODQ6ICc0NDYuNDQ4LC0xMjUuMTU3LDU0Mi4wNjAsMC4xNTAyLDAuMjQ3MCwwLjg0MjEsLTIwLjQ4OTQnLFxuICAgIGVsbGlwc2U6ICdhaXJ5JyxcbiAgICBkYXR1bU5hbWU6ICdPcmRuYW5jZSBTdXJ2ZXkgb2YgR3JlYXQgQnJpdGFpbiAxOTM2J1xuICB9LFxuICBzX2p0c2s6IHtcbiAgICB0b3dnczg0OiAnNTg5LDc2LDQ4MCcsXG4gICAgZWxsaXBzZTogJ2Jlc3NlbCcsXG4gICAgZGF0dW1OYW1lOiAnUy1KVFNLIChGZXJybyknXG4gIH0sXG4gIGJlZHVhcmFtOiB7XG4gICAgdG93Z3M4NDogJy0xMDYsLTg3LDE4OCcsXG4gICAgZWxsaXBzZTogJ2Nscms4MCcsXG4gICAgZGF0dW1OYW1lOiAnQmVkdWFyYW0nXG4gIH0sXG4gIGd1bnVuZ19zZWdhcmE6IHtcbiAgICB0b3dnczg0OiAnLTQwMyw2ODQsNDEnLFxuICAgIGVsbGlwc2U6ICdiZXNzZWwnLFxuICAgIGRhdHVtTmFtZTogJ0d1bnVuZyBTZWdhcmEgSmFrYXJ0YSdcbiAgfSxcbiAgcm5iNzI6IHtcbiAgICB0b3dnczg0OiAnMTA2Ljg2OSwtNTIuMjk3OCwxMDMuNzI0LC0wLjMzNjU3LDAuNDU2OTU1LC0xLjg0MjE4LDEnLFxuICAgIGVsbGlwc2U6ICdpbnRsJyxcbiAgICBkYXR1bU5hbWU6ICdSZXNlYXUgTmF0aW9uYWwgQmVsZ2UgMTk3MidcbiAgfSxcbiAgRVBTR181NDUxOiB7XG4gICAgdG93Z3M4NDogJzYuNDEsLTQ5LjA1LC0xMS4yOCwxLjU2NTcsMC41MjQyLDYuOTcxOCwtNS43NjQ5J1xuICB9LFxuICBJR05GX0xVUkVTRzoge1xuICAgIHRvd2dzODQ6ICctMTkyLjk4NiwxMy42NzMsLTM5LjMwOSwtMC40MDk5LC0yLjkzMzIsMi42ODgxLDAuNDMnXG4gIH0sXG4gIEVQU0dfNDYxNDoge1xuICAgIHRvd2dzODQ6ICctMTE5LjQyNDgsLTMwMy42NTg3MiwtMTEuMDAwNjEsMS4xNjQyOTgsMC4xNzQ0NTgsMS4wOTYyNTksMy42NTcwNjUnXG4gIH0sXG4gIEVQU0dfNDYxNToge1xuICAgIHRvd2dzODQ6ICctNDk0LjA4OCwtMzEyLjEyOSwyNzkuODc3LC0xLjQyMywtMS4wMTMsMS41OSwtMC43NDgnXG4gIH0sXG4gIEVTUklfMzcyNDE6IHtcbiAgICB0b3dnczg0OiAnLTc2LjgyMiwyNTcuNDU3LC0xMi44MTcsMi4xMzYsLTAuMDMzLC0yLjM5MiwtMC4wMzEnXG4gIH0sXG4gIEVTUklfMzcyNDk6IHtcbiAgICB0b3dnczg0OiAnLTQ0MC4yOTYsNTguNTQ4LDI5Ni4yNjUsMS4xMjgsMTAuMjAyLDQuNTU5LC0wLjQzOCdcbiAgfSxcbiAgRVNSSV8zNzI0NToge1xuICAgIHRvd2dzODQ6ICctNTExLjE1MSwtMTgxLjI2OSwxMzkuNjA5LDEuMDUsMi43MDMsMS43OTgsMy4wNzEnXG4gIH0sXG4gIEVQU0dfNDE3ODoge1xuICAgIHRvd2dzODQ6ICcyNC45LC0xMjYuNCwtOTMuMiwtMC4wNjMsLTAuMjQ3LC0wLjA0MSwxLjAxJ1xuICB9LFxuICBFUFNHXzQ2MjI6IHtcbiAgICB0b3dnczg0OiAnLTQ3Mi4yOSwtNS42MywtMzA0LjEyLDAuNDM2MiwtMC44Mzc0LDAuMjU2MywxLjg5ODQnXG4gIH0sXG4gIEVQU0dfNDYyNToge1xuICAgIHRvd2dzODQ6ICcxMjYuOTMsNTQ3Ljk0LDEzMC40MSwtMi43ODY3LDUuMTYxMiwtMC44NTg0LDEzLjgyMjcnXG4gIH0sXG4gIEVQU0dfNTI1Mjoge1xuICAgIHRvd2dzODQ6ICcwLjAyMywwLjAzNiwtMC4wNjgsMC4wMDE3NiwwLjAwOTEyLC0wLjAxMTM2LDAuMDA0MzknXG4gIH0sXG4gIEVQU0dfNDMxNDoge1xuICAgIHRvd2dzODQ6ICc1OTcuMSw3MS40LDQxMi4xLDAuODk0LDAuMDY4LC0xLjU2Myw3LjU4J1xuICB9LFxuICBFUFNHXzQyODI6IHtcbiAgICB0b3dnczg0OiAnLTE3OC4zLC0zMTYuNywtMTMxLjUsNS4yNzgsNi4wNzcsMTAuOTc5LDE5LjE2NidcbiAgfSxcbiAgRVBTR180MjMxOiB7XG4gICAgdG93Z3M4NDogJy04My4xMSwtOTcuMzgsLTExNy4yMiwwLjAyNzYsLTAuMjE2NywwLjIxNDcsMC4xMjE4J1xuICB9LFxuICBFUFNHXzQyNzQ6IHtcbiAgICB0b3dnczg0OiAnLTIzMC45OTQsMTAyLjU5MSwyNS4xOTksMC42MzMsLTAuMjM5LDAuOSwxLjk1J1xuICB9LFxuICBFUFNHXzQxMzQ6IHtcbiAgICB0b3dnczg0OiAnLTE4MC42MjQsLTIyNS41MTYsMTczLjkxOSwtMC44MSwtMS44OTgsOC4zMzYsMTYuNzEwMDYnXG4gIH0sXG4gIEVQU0dfNDI1NDoge1xuICAgIHRvd2dzODQ6ICcxOC4zOCwxOTIuNDUsOTYuODIsMC4wNTYsLTAuMTQyLC0wLjIsLTAuMDAxMydcbiAgfSxcbiAgRVBTR180MTU5OiB7XG4gICAgdG93Z3M4NDogJy0xOTQuNTEzLC02My45NzgsLTI1Ljc1OSwtMy40MDI3LDMuNzU2LC0zLjM1MiwtMC45MTc1J1xuICB9LFxuICBFUFNHXzQ2ODc6IHtcbiAgICB0b3dnczg0OiAnMC4wNzIsLTAuNTA3LC0wLjI0NSwwLjAxODMsLTAuMDAwMywwLjAwNywtMC4wMDkzJ1xuICB9LFxuICBFUFNHXzQyMjc6IHtcbiAgICB0b3dnczg0OiAnLTgzLjU4LC0zOTcuNTQsNDU4Ljc4LC0xNy41OTUsLTIuODQ3LDQuMjU2LDMuMjI1J1xuICB9LFxuICBFUFNHXzQ3NDY6IHtcbiAgICB0b3dnczg0OiAnNTk5LjQsNzIuNCw0MTkuMiwtMC4wNjIsLTAuMDIyLC0yLjcyMyw2LjQ2J1xuICB9LFxuICBFUFNHXzQ3NDU6IHtcbiAgICB0b3dnczg0OiAnNjEyLjQsNzcsNDQwLjIsLTAuMDU0LDAuMDU3LC0yLjc5NywyLjU1J1xuICB9LFxuICBFUFNHXzYzMTE6IHtcbiAgICB0b3dnczg0OiAnOC44NDYsLTQuMzk0LC0xLjEyMiwtMC4wMDIzNywtMC4xNDY1MjgsMC4xMzA0MjgsMC43ODM5MjYnXG4gIH0sXG4gIEVQU0dfNDI4OToge1xuICAgIHRvd2dzODQ6ICc1NjUuNzM4MSw1MC40MDE4LDQ2NS4yOTA0LC0xLjkxNTE0LDEuNjAzNjMsLTkuMDk1NDYsNC4wNzI0NCdcbiAgfSxcbiAgRVBTR180MjMwOiB7XG4gICAgdG93Z3M4NDogJy02OC44NjMsLTEzNC44ODgsLTExMS40OSwtMC41MywtMC4xNCwwLjU3LC0zLjQnXG4gIH0sXG4gIEVQU0dfNDE1NDoge1xuICAgIHRvd2dzODQ6ICctMTIzLjAyLC0xNTguOTUsLTE2OC40NydcbiAgfSxcbiAgRVBTR180MTU2OiB7XG4gICAgdG93Z3M4NDogJzU3MC44LDg1LjcsNDYyLjgsNC45OTgsMS41ODcsNS4yNjEsMy41NidcbiAgfSxcbiAgRVBTR180Mjk5OiB7XG4gICAgdG93Z3M4NDogJzQ4Mi41LC0xMzAuNiw1NjQuNiwtMS4wNDIsLTAuMjE0LC0wLjYzMSw4LjE1J1xuICB9LFxuICBFUFNHXzQxNzk6IHtcbiAgICB0b3dnczg0OiAnMzMuNCwtMTQ2LjYsLTc2LjMsLTAuMzU5LC0wLjA1MywwLjg0NCwtMC44NCdcbiAgfSxcbiAgRVBTR180MzEzOiB7XG4gICAgdG93Z3M4NDogJy0xMDYuODY4Niw1Mi4yOTc4LC0xMDMuNzIzOSwwLjMzNjYsLTAuNDU3LDEuODQyMiwtMS4yNzQ3J1xuICB9LFxuICBFUFNHXzQxOTQ6IHtcbiAgICB0b3dnczg0OiAnMTYzLjUxMSwxMjcuNTMzLC0xNTkuNzg5J1xuICB9LFxuICBFUFNHXzQxOTU6IHtcbiAgICB0b3dnczg0OiAnMTA1LDMyNiwtMTAyLjUnXG4gIH0sXG4gIEVQU0dfNDE5Njoge1xuICAgIHRvd2dzODQ6ICctNDUsNDE3LC0zLjUnXG4gIH0sXG4gIEVQU0dfNDYxMToge1xuICAgIHRvd2dzODQ6ICctMTYyLjYxOSwtMjc2Ljk1OSwtMTYxLjc2NCwwLjA2Nzc1MywtMi4yNDM2NDksLTEuMTU4ODI3LC0xLjA5NDI0NidcbiAgfSxcbiAgRVBTR180NjMzOiB7XG4gICAgdG93Z3M4NDogJzEzNy4wOTIsMTMxLjY2LDkxLjQ3NSwtMS45NDM2LC0xMS41OTkzLC00LjMzMjEsLTcuNDgyNCdcbiAgfSxcbiAgRVBTR180NjQxOiB7XG4gICAgdG93Z3M4NDogJy00MDguODA5LDM2Ni44NTYsLTQxMi45ODcsMS44ODQyLC0wLjUzMDgsMi4xNjU1LC0xMjEuMDk5MydcbiAgfSxcbiAgRVBTR180NjQzOiB7XG4gICAgdG93Z3M4NDogJy00ODAuMjYsLTQzOC4zMiwtNjQzLjQyOSwxNi4zMTE5LDIwLjE3MjEsLTQuMDM0OSwtMTExLjcwMDInXG4gIH0sXG4gIEVQU0dfNDMwMDoge1xuICAgIHRvd2dzODQ6ICc0ODIuNSwtMTMwLjYsNTY0LjYsLTEuMDQyLC0wLjIxNCwtMC42MzEsOC4xNSdcbiAgfSxcbiAgRVBTR180MTg4OiB7XG4gICAgdG93Z3M4NDogJzQ4Mi41LC0xMzAuNiw1NjQuNiwtMS4wNDIsLTAuMjE0LC0wLjYzMSw4LjE1J1xuICB9LFxuICBFUFNHXzQ2NjA6IHtcbiAgICB0b3dnczg0OiAnOTgyLjYwODcsNTUyLjc1MywtNTQwLjg3MywzMi4zOTM0NCwtMTUzLjI1Njg0LC05Ni4yMjY2LDE2LjgwNSdcbiAgfSxcbiAgRVBTR180NjYyOiB7XG4gICAgdG93Z3M4NDogJzk3LjI5NSwtMjYzLjI0NywzMTAuODgyLC0xLjU5OTksMC44Mzg2LDMuMTQwOSwxMy4zMjU5J1xuICB9LFxuICBFUFNHXzM5MDY6IHtcbiAgICB0b3dnczg0OiAnNTc3Ljg4ODkxLDE2NS4yMjIwNSwzOTEuMTgyODksNC45MTQ1LC0wLjk0NzI5LC0xMy4wNTA5OCw3Ljc4NjY0J1xuICB9LFxuICBFUFNHXzQzMDc6IHtcbiAgICB0b3dnczg0OiAnLTIwOS4zNjIyLC04Ny44MTYyLDQwNC42MTk4LDAuMDA0NiwzLjQ3ODQsMC41ODA1LC0xLjQ1NDcnXG4gIH0sXG4gIEVQU0dfNjg5Mjoge1xuICAgIHRvd2dzODQ6ICctNzYuMjY5LC0xNi42ODMsNjguNTYyLC02LjI3NSwxMC41MzYsLTQuMjg2LC0xMy42ODYnXG4gIH0sXG4gIEVQU0dfNDY5MDoge1xuICAgIHRvd2dzODQ6ICcyMjEuNTk3LDE1Mi40NDEsMTc2LjUyMywyLjQwMywxLjM4OTMsMC44ODQsMTEuNDY0OCdcbiAgfSxcbiAgRVBTR180NjkxOiB7XG4gICAgdG93Z3M4NDogJzIxOC43NjksMTUwLjc1LDE3Ni43NSwzLjUyMzEsMi4wMDM3LDEuMjg4LDEwLjk4MTcnXG4gIH0sXG4gIEVQU0dfNDYyOToge1xuICAgIHRvd2dzODQ6ICc3Mi41MSwzNDUuNDExLDc5LjI0MSwtMS41ODYyLC0wLjg4MjYsLTAuNTQ5NSwxLjM2NTMnXG4gIH0sXG4gIEVQU0dfNDYzMDoge1xuICAgIHRvd2dzODQ6ICcxNjUuODA0LDIxNi4yMTMsMTgwLjI2LC0wLjYyNTEsLTAuNDUxNSwtMC4wNzIxLDcuNDExMSdcbiAgfSxcbiAgRVBTR180NjkyOiB7XG4gICAgdG93Z3M4NDogJzIxNy4xMDksODYuNDUyLDIzLjcxMSwwLjAxODMsLTAuMDAwMywwLjAwNywtMC4wMDkzJ1xuICB9LFxuICBFUFNHXzkzMzM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAsLTguMzkzLDAuNzQ5LC0xMC4yNzYsMCdcbiAgfSxcbiAgRVBTR185MDU5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQzMTI6IHtcbiAgICB0b3dnczg0OiAnNjAxLjcwNSw4NC4yNjMsNDg1LjIyNyw0LjczNTQsMS4zMTQ1LDUuMzkzLC0yLjM4ODcnXG4gIH0sXG4gIEVQU0dfNDEyMzoge1xuICAgIHRvd2dzODQ6ICctOTYuMDYyLC04Mi40MjgsLTEyMS43NTMsNC44MDEsMC4zNDUsLTEuMzc2LDEuNDk2J1xuICB9LFxuICBFUFNHXzQzMDk6IHtcbiAgICB0b3dnczg0OiAnLTEyNC40NSwxODMuNzQsNDQuNjQsLTAuNDM4NCwwLjU0NDYsLTAuOTcwNiwtMi4xMzY1J1xuICB9LFxuICBFU1JJXzEwNDEwNjoge1xuICAgIHRvd2dzODQ6ICctMjgzLjA4OCwtNzAuNjkzLDExNy40NDUsLTEuMTU3LDAuMDU5LC0wLjY1MiwtNC4wNTgnXG4gIH0sXG4gIEVQU0dfNDI4MToge1xuICAgIHRvd2dzODQ6ICctMjE5LjI0NywtNzMuODAyLDI2OS41MjknXG4gIH0sXG4gIEVQU0dfNDMyMjoge1xuICAgIHRvd2dzODQ6ICcwLDAsNC41J1xuICB9LFxuICBFUFNHXzQzMjQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDEuOSdcbiAgfSxcbiAgRVBTR180Mjg0OiB7XG4gICAgdG93Z3M4NDogJzQzLjgyMiwtMTA4Ljg0MiwtMTE5LjU4NSwxLjQ1NSwtMC43NjEsMC43MzcsMC41NDknXG4gIH0sXG4gIEVQU0dfNDI3Nzoge1xuICAgIHRvd2dzODQ6ICc0NDYuNDQ4LC0xMjUuMTU3LDU0Mi4wNiwwLjE1LDAuMjQ3LDAuODQyLC0yMC40ODknXG4gIH0sXG4gIEVQU0dfNDIwNzoge1xuICAgIHRvd2dzODQ6ICctMjgyLjEsLTcyLjIsMTIwLC0xLjUyOSwwLjE0NSwtMC44OSwtNC40NidcbiAgfSxcbiAgRVBTR180Njg4OiB7XG4gICAgdG93Z3M4NDogJzM0Ny4xNzUsMTA3Ny42MTgsMjYyMy42NzcsMzMuOTA1OCwtNzAuNjc3Niw5LjQwMTMsMTg2LjA2NDcnXG4gIH0sXG4gIEVQU0dfNDY4OToge1xuICAgIHRvd2dzODQ6ICc0MTAuNzkzLDU0LjU0Miw4MC41MDEsLTIuNTU5NiwtMi4zNTE3LC0wLjY1OTQsMTcuMzIxOCdcbiAgfSxcbiAgRVBTR180NzIwOiB7XG4gICAgdG93Z3M4NDogJzAsMCw0LjUnXG4gIH0sXG4gIEVQU0dfNDI3Mzoge1xuICAgIHRvd2dzODQ6ICcyNzguMyw5Myw0NzQuNSw3Ljg4OSwwLjA1LC02LjYxLDYuMjEnXG4gIH0sXG4gIEVQU0dfNDI0MDoge1xuICAgIHRvd2dzODQ6ICcyMDQuNjQsODM0Ljc0LDI5My44J1xuICB9LFxuICBFUFNHXzQ4MTc6IHtcbiAgICB0b3dnczg0OiAnMjc4LjMsOTMsNDc0LjUsNy44ODksMC4wNSwtNi42MSw2LjIxJ1xuICB9LFxuICBFU1JJXzEwNDEzMToge1xuICAgIHRvd2dzODQ6ICc0MjYuNjIsMTQyLjYyLDQ2MC4wOSw0Ljk4LDQuNDksLTEyLjQyLC0xNy4xJ1xuICB9LFxuICBFUFNHXzQyNjU6IHtcbiAgICB0b3dnczg0OiAnLTEwNC4xLC00OS4xLC05LjksMC45NzEsLTIuOTE3LDAuNzE0LC0xMS42OCdcbiAgfSxcbiAgRVBTR180MjYzOiB7XG4gICAgdG93Z3M4NDogJy0xMTEuOTIsLTg3Ljg1LDExNC41LDEuODc1LDAuMjAyLDAuMjE5LDAuMDMyJ1xuICB9LFxuICBFUFNHXzQyOTg6IHtcbiAgICB0b3dnczg0OiAnLTY4OS41OTM3LDYyMy44NDA0NiwtNjUuOTM1NjYsLTAuMDIzMzEsMS4xNzA5NCwtMC44MDA1NCw1Ljg4NTM2J1xuICB9LFxuICBFUFNHXzQyNzA6IHtcbiAgICB0b3dnczg0OiAnLTI1My40MzkyLC0xNDguNDUyLDM4Ni41MjY3LDAuMTU2MDUsMC40MywtMC4xMDEzLC0wLjA0MjQnXG4gIH0sXG4gIEVQU0dfNDIyOToge1xuICAgIHRvd2dzODQ6ICctMTIxLjgsOTguMSwtMTAuNydcbiAgfSxcbiAgRVBTR180MjIwOiB7XG4gICAgdG93Z3M4NDogJy01NS41LC0zNDgsLTIyOS4yJ1xuICB9LFxuICBFUFNHXzQyMTQ6IHtcbiAgICB0b3dnczg0OiAnMTIuNjQ2LC0xNTUuMTc2LC04MC44NjMnXG4gIH0sXG4gIEVQU0dfNDIzMjoge1xuICAgIHRvd2dzODQ6ICctMzQ1LDMsMjIzJ1xuICB9LFxuICBFUFNHXzQyMzg6IHtcbiAgICB0b3dnczg0OiAnLTEuOTc3LC0xMy4wNiwtOS45OTMsMC4zNjQsMC4yNTQsMC42ODksLTEuMDM3J1xuICB9LFxuICBFUFNHXzQxNjg6IHtcbiAgICB0b3dnczg0OiAnLTE3MCwzMywzMjYnXG4gIH0sXG4gIEVQU0dfNDEzMToge1xuICAgIHRvd2dzODQ6ICcxOTksOTMxLDMxOC45J1xuICB9LFxuICBFUFNHXzQxNTI6IHtcbiAgICB0b3dnczg0OiAnLTAuOTEwMiwyLjAxNDEsMC41NjAyLDAuMDI5MDM5LDAuMDEwMDY1LDAuMDEwMTAxLDAnXG4gIH0sXG4gIEVQU0dfNTIyODoge1xuICAgIHRvd2dzODQ6ICc1NzIuMjEzLDg1LjMzNCw0NjEuOTQsNC45NzMyLDEuNTI5LDUuMjQ4NCwzLjUzNzgnXG4gIH0sXG4gIEVQU0dfODM1MToge1xuICAgIHRvd2dzODQ6ICc0ODUuMDIxLDE2OS40NjUsNDgzLjgzOSw3Ljc4NjM0Miw0LjM5NzU1NCw0LjEwMjY1NSwwJ1xuICB9LFxuICBFUFNHXzQ2ODM6IHtcbiAgICB0b3dnczg0OiAnLTEyNy42MiwtNjcuMjQsLTQ3LjA0LC0zLjA2OCw0LjkwMywxLjU3OCwtMS4wNidcbiAgfSxcbiAgRVBTR180MTMzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzczNzM6IHtcbiAgICB0b3dnczg0OiAnMC44MTksLTAuNTc2MiwtMS42NDQ2LC0wLjAwMzc4LC0wLjAzMzE3LDAuMDAzMTgsMC4wNjkzJ1xuICB9LFxuICBFUFNHXzkwNzU6IHtcbiAgICB0b3dnczg0OiAnLTAuOTEwMiwyLjAxNDEsMC41NjAyLDAuMDI5MDM5LDAuMDEwMDY1LDAuMDEwMTAxLDAnXG4gIH0sXG4gIEVQU0dfOTA3Mjoge1xuICAgIHRvd2dzODQ6ICctMC45MTAyLDIuMDE0MSwwLjU2MDIsMC4wMjkwMzksMC4wMTAwNjUsMC4wMTAxMDEsMCdcbiAgfSxcbiAgRVBTR185Mjk0OiB7XG4gICAgdG93Z3M4NDogJzEuMTY4MzUsLTEuNDIwMDEsLTIuMjQ0MzEsLTAuMDA4MjIsLTAuMDU1MDgsMC4wMTgxOCwwLjIzMzg4J1xuICB9LFxuICBFUFNHXzQyMTI6IHtcbiAgICB0b3dnczg0OiAnLTI2Ny40MzQsMTczLjQ5NiwxODEuODE0LC0xMy40NzA0LDguNzE1NCw3LjM5MjYsMTQuNzQ5MidcbiAgfSxcbiAgRVBTR180MTkxOiB7XG4gICAgdG93Z3M4NDogJy00NC4xODMsLTAuNTgsLTM4LjQ4OSwyLjM4NjcsMi43MDcyLC0zLjUxOTYsLTguMjcwMydcbiAgfSxcbiAgRVBTR180MjM3OiB7XG4gICAgdG93Z3M4NDogJzUyLjY4NCwtNzEuMTk0LC0xMy45NzUsLTAuMzEyLC0wLjEwNjMsLTAuMzcyOSwxLjAxOTEnXG4gIH0sXG4gIEVQU0dfNDc0MDoge1xuICAgIHRvd2dzODQ6ICctMS4wOCwtMC4yNywtMC45J1xuICB9LFxuICBFUFNHXzQxMjQ6IHtcbiAgICB0b3dnczg0OiAnNDE5LjM4MzYsOTkuMzMzNSw1OTEuMzQ1MSwwLjg1MDM4OSwxLjgxNzI3NywtNy44NjIyMzgsLTAuOTk0OTYnXG4gIH0sXG4gIEVQU0dfNTY4MToge1xuICAgIHRvd2dzODQ6ICc1ODQuOTYzNiwxMDcuNzE3NSw0MTMuODA2NywxLjExNTUsMC4yODI0LC0zLjEzODQsNy45OTIyJ1xuICB9LFxuICBFUFNHXzQxNDE6IHtcbiAgICB0b3dnczg0OiAnMjMuNzcyLDE3LjQ5LDE3Ljg1OSwtMC4zMTMyLC0xLjg1Mjc0LDEuNjcyOTksLTUuNDI2MidcbiAgfSxcbiAgRVBTR180MjA0OiB7XG4gICAgdG93Z3M4NDogJy04NS42NDUsLTI3My4wNzcsLTc5LjcwOCwyLjI4OSwtMS40MjEsMi41MzIsMy4xOTQnXG4gIH0sXG4gIEVQU0dfNDMxOToge1xuICAgIHRvd2dzODQ6ICcyMjYuNzAyLC0xOTMuMzM3LC0zNS4zNzEsLTIuMjI5LC00LjM5MSw5LjIzOCwwLjk3OTgnXG4gIH0sXG4gIEVQU0dfNDIwMDoge1xuICAgIHRvd2dzODQ6ICcyNC44MiwtMTMxLjIxLC04Mi42NidcbiAgfSxcbiAgRVBTR180MTMwOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxMjc6IHtcbiAgICB0b3dnczg0OiAnLTgyLjg3NSwtNTcuMDk3LC0xNTYuNzY4LC0yLjE1OCwxLjUyNCwtMC45ODIsLTAuMzU5J1xuICB9LFxuICBFUFNHXzQxNDk6IHtcbiAgICB0b3dnczg0OiAnNjc0LjM3NCwxNS4wNTYsNDA1LjM0NidcbiAgfSxcbiAgRVBTR180NjE3OiB7XG4gICAgdG93Z3M4NDogJy0wLjk5MSwxLjkwNzIsMC41MTI5LDEuMjUwMzNlLTcsNC42Nzg1ZS04LDUuNjUyOWUtOCwwJ1xuICB9LFxuICBFUFNHXzQ2NjM6IHtcbiAgICB0b3dnczg0OiAnLTIxMC41MDIsLTY2LjkwMiwtNDguNDc2LDIuMDk0LC0xNS4wNjcsLTUuODE3LDAuNDg1J1xuICB9LFxuICBFUFNHXzQ2NjQ6IHtcbiAgICB0b3dnczg0OiAnLTIxMS45MzksMTM3LjYyNiw1OC4zLC0wLjA4OSwwLjI1MSwwLjA3OSwwLjM4NCdcbiAgfSxcbiAgRVBTR180NjY1OiB7XG4gICAgdG93Z3M4NDogJy0xMDUuODU0LDE2NS41ODksLTM4LjMxMiwtMC4wMDMsLTAuMDI2LDAuMDI0LC0wLjA0OCdcbiAgfSxcbiAgRVBTR180NjY2OiB7XG4gICAgdG93Z3M4NDogJzYzMS4zOTIsLTY2LjU1MSw0ODEuNDQyLDEuMDksLTQuNDQ1LC00LjQ4NywtNC40MydcbiAgfSxcbiAgRVBTR180NzU2OiB7XG4gICAgdG93Z3M4NDogJy0xOTIuODczLC0zOS4zODIsLTExMS4yMDIsLTAuMDAyMDUsLTAuMDAwNSwwLjAwMzM1LDAuMDE4OCdcbiAgfSxcbiAgRVBTR180NzIzOiB7XG4gICAgdG93Z3M4NDogJy0xNzkuNDgzLC02OS4zNzksLTI3LjU4NCwtNy44NjIsOC4xNjMsNi4wNDIsLTEzLjkyNSdcbiAgfSxcbiAgRVBTR180NzI2OiB7XG4gICAgdG93Z3M4NDogJzguODUzLC01Mi42NDQsMTgwLjMwNCwtMC4zOTMsLTIuMzIzLDIuOTYsLTI0LjA4MSdcbiAgfSxcbiAgRVBTR180MjY3OiB7XG4gICAgdG93Z3M4NDogJy04LjAsMTYwLjAsMTc2LjAnXG4gIH0sXG4gIEVQU0dfNTM2NToge1xuICAgIHRvd2dzODQ6ICctMC4xNjk1OSwwLjM1MzEyLDAuNTE4NDYsMC4wMzM4NSwtMC4xNjMyNSwwLjAzNDQ2LDAuMDM2OTMnXG4gIH0sXG4gIEVQU0dfNDIxODoge1xuICAgIHRvd2dzODQ6ICczMDQuNSwzMDYuNSwtMzE4LjEnXG4gIH0sXG4gIEVQU0dfNDI0Mjoge1xuICAgIHRvd2dzODQ6ICctMzMuNzIyLDE1My43ODksOTQuOTU5LC04LjU4MSwtNC40NzgsNC41NCw4Ljk1J1xuICB9LFxuICBFUFNHXzQyMTY6IHtcbiAgICB0b3dnczg0OiAnLTI5Mi4yOTUsMjQ4Ljc1OCw0MjkuNDQ3LDQuOTk3MSwyLjk5LDYuNjkwNiwxLjAyODknXG4gIH0sXG4gIEVTUklfMTA0MTA1OiB7XG4gICAgdG93Z3M4NDogJzYzMS4zOTIsLTY2LjU1MSw0ODEuNDQyLDEuMDksLTQuNDQ1LC00LjQ4NywtNC40MydcbiAgfSxcbiAgRVNSSV8xMDQxMjk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY3Mzoge1xuICAgIHRvd2dzODQ6ICcxNzQuMDUsLTI1LjQ5LDExMi41NydcbiAgfSxcbiAgRVBTR180MjAyOiB7XG4gICAgdG93Z3M4NDogJy0xMjQsLTYwLDE1NCdcbiAgfSxcbiAgRVBTR180MjAzOiB7XG4gICAgdG93Z3M4NDogJy0xMTcuNzYzLC01MS41MSwxMzkuMDYxLDAuMjkyLDAuNDQzLDAuMjc3LC0wLjE5MSdcbiAgfSxcbiAgRVBTR18zODE5OiB7XG4gICAgdG93Z3M4NDogJzU5NS40OCwxMjEuNjksNTE1LjM1LDQuMTE1LC0yLjkzODMsMC44NTMsLTMuNDA4J1xuICB9LFxuICBFUFNHXzg2OTQ6IHtcbiAgICB0b3dnczg0OiAnLTkzLjc5OSwtMTMyLjczNywtMjE5LjA3MywtMS44NDQsMC42NDgsLTYuMzcsLTAuMTY5J1xuICB9LFxuICBFUFNHXzQxNDU6IHtcbiAgICB0b3dnczg0OiAnMjc1LjU3LDY3Ni43OCwyMjkuNidcbiAgfSxcbiAgRVBTR180MjgzOiB7XG4gICAgdG93Z3M4NDogJzYxLjU1LC0xMC44NywtNDAuMTksMzkuNDkyNCwzMi43MjIxLDMyLjg5NzksLTkuOTk0J1xuICB9LFxuICBFUFNHXzQzMTc6IHtcbiAgICB0b3dnczg0OiAnMi4zMjg3LC0xNDcuMDQyNSwtOTIuMDgwMiwtMC4zMDkyNDgzLDAuMzI0ODIxODUsMC40OTcyOTkzNCw1LjY4OTA2MjY2J1xuICB9LFxuICBFUFNHXzQyNzI6IHtcbiAgICB0b3dnczg0OiAnNTkuNDcsLTUuMDQsMTg3LjQ0LDAuNDcsLTAuMSwxLjAyNCwtNC41OTkzJ1xuICB9LFxuICBFUFNHXzQyNDg6IHtcbiAgICB0b3dnczg0OiAnLTMwNy43LDI2NS4zLC0zNjMuNSdcbiAgfSxcbiAgRVBTR181NTYxOiB7XG4gICAgdG93Z3M4NDogJzI0LC0xMjEsLTc2J1xuICB9LFxuICBFUFNHXzUyMzM6IHtcbiAgICB0b3dnczg0OiAnLTAuMjkzLDc2Ni45NSw4Ny43MTMsMC4xOTU3MDQsMS42OTUwNjgsMy40NzMwMTYsLTAuMDM5MzM4J1xuICB9LFxuICBFU1JJXzEwNDEzMDoge1xuICAgIHRvd2dzODQ6ICctODYsLTk4LC0xMTknXG4gIH0sXG4gIEVTUklfMTA0MTAyOiB7XG4gICAgdG93Z3M4NDogJzY4MiwtMjAzLDQ4MCdcbiAgfSxcbiAgRVNSSV8zNzIwNzoge1xuICAgIHRvd2dzODQ6ICc3LC0xMCwtMjYnXG4gIH0sXG4gIEVQU0dfNDY3NToge1xuICAgIHRvd2dzODQ6ICc1OS45MzUsMTE4LjQsLTEwLjg3MSdcbiAgfSxcbiAgRVNSSV8xMDQxMDk6IHtcbiAgICB0b3dnczg0OiAnLTg5LjEyMSwtMzQ4LjE4MiwyNjAuODcxJ1xuICB9LFxuICBFU1JJXzEwNDExMjoge1xuICAgIHRvd2dzODQ6ICctMTg1LjU4MywtMjMwLjA5NiwyODEuMzYxJ1xuICB9LFxuICBFU1JJXzEwNDExMzoge1xuICAgIHRvd2dzODQ6ICcyNS4xLC0yNzUuNiwyMjIuNidcbiAgfSxcbiAgSUdORl9XR1M3Mkc6IHtcbiAgICB0b3dnczg0OiAnMCwxMiw2J1xuICB9LFxuICBJR05GX05URkc6IHtcbiAgICB0b3dnczg0OiAnLTE2OCwtNjAsMzIwJ1xuICB9LFxuICBJR05GX0VGQVRFNTdHOiB7XG4gICAgdG93Z3M4NDogJy0xMjcsLTc2OSw0NzInXG4gIH0sXG4gIElHTkZfUEdQNTBHOiB7XG4gICAgdG93Z3M4NDogJzMyNC44LDE1My42LDE3Mi4xJ1xuICB9LFxuICBJR05GX1JFVU40N0c6IHtcbiAgICB0b3dnczg0OiAnOTQsLTk0OCwtMTI2MidcbiAgfSxcbiAgSUdORl9DU0c2N0c6IHtcbiAgICB0b3dnczg0OiAnLTE4NiwyMzAsMTEwJ1xuICB9LFxuICBJR05GX0dVQUQ0OEc6IHtcbiAgICB0b3dnczg0OiAnLTQ2NywtMTYsLTMwMCdcbiAgfSxcbiAgSUdORl9UQUhJNTFHOiB7XG4gICAgdG93Z3M4NDogJzE2MiwxMTcsMTU0J1xuICB9LFxuICBJR05GX1RBSEFBRzoge1xuICAgIHRvd2dzODQ6ICc2NSwzNDIsNzcnXG4gIH0sXG4gIElHTkZfTlVLVTcyRzoge1xuICAgIHRvd2dzODQ6ICc4NCwyNzQsNjUnXG4gIH0sXG4gIElHTkZfUEVUUkVMUzcyRzoge1xuICAgIHRvd2dzODQ6ICczNjUsMTk0LDE2NidcbiAgfSxcbiAgSUdORl9XQUxMNzhHOiB7XG4gICAgdG93Z3M4NDogJzI1MywtMTMzLC0xMjcnXG4gIH0sXG4gIElHTkZfTUFZTzUwRzoge1xuICAgIHRvd2dzODQ6ICctMzgyLC01OSwtMjYyJ1xuICB9LFxuICBJR05GX1RBTk5BRzoge1xuICAgIHRvd2dzODQ6ICctMTM5LC05NjcsNDM2J1xuICB9LFxuICBJR05GX0lHTjcyRzoge1xuICAgIHRvd2dzODQ6ICctMTMsLTM0OCwyOTInXG4gIH0sXG4gIElHTkZfQVRJR0c6IHtcbiAgICB0b3dnczg0OiAnMTExOCwyMyw2NidcbiAgfSxcbiAgSUdORl9GQU5HQTg0Rzoge1xuICAgIHRvd2dzODQ6ICcxNTAuNTcsMTU4LjMzLDExOC4zMidcbiAgfSxcbiAgSUdORl9SVVNBVDg0Rzoge1xuICAgIHRvd2dzODQ6ICcyMDIuMTMsMTc0LjYsLTE1Ljc0J1xuICB9LFxuICBJR05GX0tBVUU3MEc6IHtcbiAgICB0b3dnczg0OiAnMTI2Ljc0LDMwMC4xLC03NS40OSdcbiAgfSxcbiAgSUdORl9NT1A5MEc6IHtcbiAgICB0b3dnczg0OiAnLTEwLjgsLTEuOCwxMi43NydcbiAgfSxcbiAgSUdORl9NSFBGNjdHOiB7XG4gICAgdG93Z3M4NDogJzMzOC4wOCwyMTIuNTgsLTI5Ni4xNydcbiAgfSxcbiAgSUdORl9UQUhJNzlHOiB7XG4gICAgdG93Z3M4NDogJzE2MC42MSwxMTYuMDUsMTUzLjY5J1xuICB9LFxuICBJR05GX0FOQUE5Mkc6IHtcbiAgICB0b3dnczg0OiAnMS41LDMuODQsNC44MSdcbiAgfSxcbiAgSUdORl9NQVJRVUk3Mkc6IHtcbiAgICB0b3dnczg0OiAnMzMwLjkxLC0xMy45Miw1OC41NidcbiAgfSxcbiAgSUdORl9BUEFUODZHOiB7XG4gICAgdG93Z3M4NDogJzE0My42LDE5Ny44Miw3NC4wNSdcbiAgfSxcbiAgSUdORl9UVUJVNjlHOiB7XG4gICAgdG93Z3M4NDogJzIzNy4xNywxNzEuNjEsLTc3Ljg0J1xuICB9LFxuICBJR05GX1NUUE01MEc6IHtcbiAgICB0b3dnczg0OiAnMTEuMzYzLDQyNC4xNDgsMzczLjEzJ1xuICB9LFxuICBFUFNHXzQxNTA6IHtcbiAgICB0b3dnczg0OiAnNjc0LjM3NCwxNS4wNTYsNDA1LjM0NidcbiAgfSxcbiAgRVBTR180NzU0OiB7XG4gICAgdG93Z3M4NDogJy0yMDguNDA1OCwtMTA5Ljg3NzcsLTIuNTc2NCdcbiAgfSxcbiAgRVNSSV8xMDQxMDE6IHtcbiAgICB0b3dnczg0OiAnMzc0LDE1MCw1ODgnXG4gIH0sXG4gIEVQU0dfNDY5Mzoge1xuICAgIHRvd2dzODQ6ICcwLC0wLjE1LDAuNjgnXG4gIH0sXG4gIEVQU0dfNjIwNzoge1xuICAgIHRvd2dzODQ6ICcyOTMuMTcsNzI2LjE4LDI0NS4zNidcbiAgfSxcbiAgRVBTR180MTUzOiB7XG4gICAgdG93Z3M4NDogJy0xMzMuNjMsLTE1Ny41LC0xNTguNjInXG4gIH0sXG4gIEVQU0dfNDEzMjoge1xuICAgIHRvd2dzODQ6ICctMjQxLjU0LC0xNjMuNjQsMzk2LjA2J1xuICB9LFxuICBFUFNHXzQyMjE6IHtcbiAgICB0b3dnczg0OiAnLTE1NC41LDE1MC43LDEwMC40J1xuICB9LFxuICBFUFNHXzQyNjY6IHtcbiAgICB0b3dnczg0OiAnLTgwLjcsLTEzMi41LDQxLjEnXG4gIH0sXG4gIEVQU0dfNDE5Mzoge1xuICAgIHRvd2dzODQ6ICctNzAuOSwtMTUxLjgsLTQxLjQnXG4gIH0sXG4gIEVQU0dfNTM0MDoge1xuICAgIHRvd2dzODQ6ICctMC40MSwwLjQ2LC0wLjM1J1xuICB9LFxuICBFUFNHXzQyNDY6IHtcbiAgICB0b3dnczg0OiAnLTI5NC43LC0yMDAuMSw1MjUuNSdcbiAgfSxcbiAgRVBTR180MzE4OiB7XG4gICAgdG93Z3M4NDogJy0zLjIsLTUuNywyLjgnXG4gIH0sXG4gIEVQU0dfNDEyMToge1xuICAgIHRvd2dzODQ6ICctMTk5Ljg3LDc0Ljc5LDI0Ni42MidcbiAgfSxcbiAgRVBTR180MjIzOiB7XG4gICAgdG93Z3M4NDogJy0yNjAuMSw1LjUsNDMyLjInXG4gIH0sXG4gIEVQU0dfNDE1ODoge1xuICAgIHRvd2dzODQ6ICctMC40NjUsMzcyLjA5NSwxNzEuNzM2J1xuICB9LFxuICBFUFNHXzQyODU6IHtcbiAgICB0b3dnczg0OiAnLTEyOC4xNiwtMjgyLjQyLDIxLjkzJ1xuICB9LFxuICBFUFNHXzQ2MTM6IHtcbiAgICB0b3dnczg0OiAnLTQwNC43OCw2ODUuNjgsNDUuNDcnXG4gIH0sXG4gIEVQU0dfNDYwNzoge1xuICAgIHRvd2dzODQ6ICcxOTUuNjcxLDMzMi41MTcsMjc0LjYwNydcbiAgfSxcbiAgRVBTR180NDc1OiB7XG4gICAgdG93Z3M4NDogJy0zODEuNzg4LC01Ny41MDEsLTI1Ni42NzMnXG4gIH0sXG4gIEVQU0dfNDIwODoge1xuICAgIHRvd2dzODQ6ICctMTU3Ljg0LDMwOC41NCwtMTQ2LjYnXG4gIH0sXG4gIEVQU0dfNDc0Mzoge1xuICAgIHRvd2dzODQ6ICc3MC45OTUsLTMzNS45MTYsMjYyLjg5OCdcbiAgfSxcbiAgRVBTR180NzEwOiB7XG4gICAgdG93Z3M4NDogJy0zMjMuNjUsNTUxLjM5LC00OTEuMjInXG4gIH0sXG4gIEVQU0dfNzg4MToge1xuICAgIHRvd2dzODQ6ICctMC4wNzcsMC4wNzksMC4wODYnXG4gIH0sXG4gIEVQU0dfNDY4Mjoge1xuICAgIHRvd2dzODQ6ICcyODMuNzI5LDczNS45NDIsMjYxLjE0MydcbiAgfSxcbiAgRVBTR180NzM5OiB7XG4gICAgdG93Z3M4NDogJy0xNTYsLTI3MSwtMTg5J1xuICB9LFxuICBFUFNHXzQ2Nzk6IHtcbiAgICB0b3dnczg0OiAnLTgwLjAxLDI1My4yNiwyOTEuMTknXG4gIH0sXG4gIEVQU0dfNDc1MDoge1xuICAgIHRvd2dzODQ6ICctNTYuMjYzLDE2LjEzNiwtMjIuODU2J1xuICB9LFxuICBFUFNHXzQ2NDQ6IHtcbiAgICB0b3dnczg0OiAnLTEwLjE4LC0zNTAuNDMsMjkxLjM3J1xuICB9LFxuICBFUFNHXzQ2OTU6IHtcbiAgICB0b3dnczg0OiAnLTEwMy43NDYsLTkuNjE0LC0yNTUuOTUnXG4gIH0sXG4gIEVQU0dfNDI5Mjoge1xuICAgIHRvd2dzODQ6ICctMzU1LDIxLDcyJ1xuICB9LFxuICBFUFNHXzQzMDI6IHtcbiAgICB0b3dnczg0OiAnLTYxLjcwMiwyODQuNDg4LDQ3Mi4wNTInXG4gIH0sXG4gIEVQU0dfNDE0Mzoge1xuICAgIHRvd2dzODQ6ICctMTI0Ljc2LDUzLDQ2Ni43OSdcbiAgfSxcbiAgRVBTR180NjA2OiB7XG4gICAgdG93Z3M4NDogJy0xNTMsMTUzLDMwNydcbiAgfSxcbiAgRVBTR180Njk5OiB7XG4gICAgdG93Z3M4NDogJy03NzAuMSwxNTguNCwtNDk4LjInXG4gIH0sXG4gIEVQU0dfNDI0Nzoge1xuICAgIHRvd2dzODQ6ICctMjczLjUsMTEwLjYsLTM1Ny45J1xuICB9LFxuICBFUFNHXzQxNjA6IHtcbiAgICB0b3dnczg0OiAnOC44OCwxODQuODYsMTA2LjY5J1xuICB9LFxuICBFUFNHXzQxNjE6IHtcbiAgICB0b3dnczg0OiAnLTIzMy40Myw2LjY1LDE3My42NCdcbiAgfSxcbiAgRVBTR185MjUxOiB7XG4gICAgdG93Z3M4NDogJy05LjUsMTIyLjksMTM4LjInXG4gIH0sXG4gIEVQU0dfOTI1Mzoge1xuICAgIHRvd2dzODQ6ICctNzguMSwxMDEuNiwxMzMuMydcbiAgfSxcbiAgRVBTR180Mjk3OiB7XG4gICAgdG93Z3M4NDogJy0xOTguMzgzLC0yNDAuNTE3LC0xMDcuOTA5J1xuICB9LFxuICBFUFNHXzQyNjk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDMwMToge1xuICAgIHRvd2dzODQ6ICctMTQ3LDUwNiw2ODcnXG4gIH0sXG4gIEVQU0dfNDYxODoge1xuICAgIHRvd2dzODQ6ICctNTksLTExLC01MidcbiAgfSxcbiAgRVBTR180NjEyOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2Nzg6IHtcbiAgICB0b3dnczg0OiAnNDQuNTg1LC0xMzEuMjEyLC0zOS41NDQnXG4gIH0sXG4gIEVQU0dfNDI1MDoge1xuICAgIHRvd2dzODQ6ICctMTMwLDI5LDM2NCdcbiAgfSxcbiAgRVBTR180MTQ0OiB7XG4gICAgdG93Z3M4NDogJzIxNCw4MDQsMjY4J1xuICB9LFxuICBFUFNHXzQxNDc6IHtcbiAgICB0b3dnczg0OiAnLTE3LjUxLC0xMDguMzIsLTYyLjM5J1xuICB9LFxuICBFUFNHXzQyNTk6IHtcbiAgICB0b3dnczg0OiAnLTI1NC4xLC01LjM2LC0xMDAuMjknXG4gIH0sXG4gIEVQU0dfNDE2NDoge1xuICAgIHRvd2dzODQ6ICctNzYsLTEzOCw2NydcbiAgfSxcbiAgRVBTR180MjExOiB7XG4gICAgdG93Z3M4NDogJy0zNzguODczLDY3Ni4wMDIsLTQ2LjI1NSdcbiAgfSxcbiAgRVBTR180MTgyOiB7XG4gICAgdG93Z3M4NDogJy00MjIuNjUxLC0xNzIuOTk1LDg0LjAyJ1xuICB9LFxuICBFUFNHXzQyMjQ6IHtcbiAgICB0b3dnczg0OiAnLTE0My44NywyNDMuMzcsLTMzLjUyJ1xuICB9LFxuICBFUFNHXzQyMjU6IHtcbiAgICB0b3dnczg0OiAnLTIwNS41NywxNjguNzcsLTQuMTInXG4gIH0sXG4gIEVQU0dfNTUyNzoge1xuICAgIHRvd2dzODQ6ICctNjcuMzUsMy44OCwtMzguMjInXG4gIH0sXG4gIEVQU0dfNDc1Mjoge1xuICAgIHRvd2dzODQ6ICc5OCwzOTAsLTIyJ1xuICB9LFxuICBFUFNHXzQzMTA6IHtcbiAgICB0b3dnczg0OiAnLTMwLDE5MCw4OSdcbiAgfSxcbiAgRVBTR185MjQ4OiB7XG4gICAgdG93Z3M4NDogJy0xOTIuMjYsNjUuNzIsMTMyLjA4J1xuICB9LFxuICBFUFNHXzQ2ODA6IHtcbiAgICB0b3dnczg0OiAnMTI0LjUsLTYzLjUsLTI4MSdcbiAgfSxcbiAgRVBTR180NzAxOiB7XG4gICAgdG93Z3M4NDogJy03OS45LC0xNTgsLTE2OC45J1xuICB9LFxuICBFUFNHXzQ3MDY6IHtcbiAgICB0b3dnczg0OiAnLTE0Ni4yMSwxMTIuNjMsNC4wNSdcbiAgfSxcbiAgRVBTR180ODA1OiB7XG4gICAgdG93Z3M4NDogJzY4MiwtMjAzLDQ4MCdcbiAgfSxcbiAgRVBTR180MjAxOiB7XG4gICAgdG93Z3M4NDogJy0xNjUsLTExLDIwNidcbiAgfSxcbiAgRVBTR180MjEwOiB7XG4gICAgdG93Z3M4NDogJy0xNTcsLTIsLTI5OSdcbiAgfSxcbiAgRVBTR180MTgzOiB7XG4gICAgdG93Z3M4NDogJy0xMDQsMTY3LC0zOCdcbiAgfSxcbiAgRVBTR180MTM5OiB7XG4gICAgdG93Z3M4NDogJzExLDcyLC0xMDEnXG4gIH0sXG4gIEVQU0dfNDY2ODoge1xuICAgIHRvd2dzODQ6ICctODYsLTk4LC0xMTknXG4gIH0sXG4gIEVQU0dfNDcxNzoge1xuICAgIHRvd2dzODQ6ICctMiwxNTEsMTgxJ1xuICB9LFxuICBFUFNHXzQ3MzI6IHtcbiAgICB0b3dnczg0OiAnMTAyLDUyLC0zOCdcbiAgfSxcbiAgRVBTR180MjgwOiB7XG4gICAgdG93Z3M4NDogJy0zNzcsNjgxLC01MCdcbiAgfSxcbiAgRVBTR180MjA5OiB7XG4gICAgdG93Z3M4NDogJy0xMzgsLTEwNSwtMjg5J1xuICB9LFxuICBFUFNHXzQyNjE6IHtcbiAgICB0b3dnczg0OiAnMzEsMTQ2LDQ3J1xuICB9LFxuICBFUFNHXzQ2NTg6IHtcbiAgICB0b3dnczg0OiAnLTczLDQ2LC04NidcbiAgfSxcbiAgRVBTR180NzIxOiB7XG4gICAgdG93Z3M4NDogJzI2NS4wMjUsMzg0LjkyOSwtMTk0LjA0NidcbiAgfSxcbiAgRVBTR180MjIyOiB7XG4gICAgdG93Z3M4NDogJy0xMzYsLTEwOCwtMjkyJ1xuICB9LFxuICBFUFNHXzQ2MDE6IHtcbiAgICB0b3dnczg0OiAnLTI1NSwtMTUsNzEnXG4gIH0sXG4gIEVQU0dfNDYwMjoge1xuICAgIHRvd2dzODQ6ICc3MjUsNjg1LDUzNidcbiAgfSxcbiAgRVBTR180NjAzOiB7XG4gICAgdG93Z3M4NDogJzcyLDIxMy43LDkzJ1xuICB9LFxuICBFUFNHXzQ2MDU6IHtcbiAgICB0b3dnczg0OiAnOSwxODMsMjM2J1xuICB9LFxuICBFUFNHXzQ2MjE6IHtcbiAgICB0b3dnczg0OiAnMTM3LDI0OCwtNDMwJ1xuICB9LFxuICBFUFNHXzQ2NTc6IHtcbiAgICB0b3dnczg0OiAnLTI4LDE5OSw1J1xuICB9LFxuICBFUFNHXzQzMTY6IHtcbiAgICB0b3dnczg0OiAnMTAzLjI1LC0xMDAuNCwtMzA3LjE5J1xuICB9LFxuICBFUFNHXzQ2NDI6IHtcbiAgICB0b3dnczg0OiAnLTEzLC0zNDgsMjkyJ1xuICB9LFxuICBFUFNHXzQ2OTg6IHtcbiAgICB0b3dnczg0OiAnMTQ1LC0xODcsMTAzJ1xuICB9LFxuICBFUFNHXzQxOTI6IHtcbiAgICB0b3dnczg0OiAnLTIwNi4xLC0xNzQuNywtODcuNydcbiAgfSxcbiAgRVBTR180MzExOiB7XG4gICAgdG93Z3M4NDogJy0yNjUsMTIwLC0zNTgnXG4gIH0sXG4gIEVQU0dfNDEzNToge1xuICAgIHRvd2dzODQ6ICc1OCwtMjgzLC0xODInXG4gIH0sXG4gIEVTUklfMTA0MTM4OiB7XG4gICAgdG93Z3M4NDogJzE5OCwtMjI2LC0zNDcnXG4gIH0sXG4gIEVQU0dfNDI0NToge1xuICAgIHRvd2dzODQ6ICctMTEsODUxLDUnXG4gIH0sXG4gIEVQU0dfNDE0Mjoge1xuICAgIHRvd2dzODQ6ICctMTI1LDUzLDQ2NydcbiAgfSxcbiAgRVBTR180MjEzOiB7XG4gICAgdG93Z3M4NDogJy0xMDYsLTg3LDE4OCdcbiAgfSxcbiAgRVBTR180MjUzOiB7XG4gICAgdG93Z3M4NDogJy0xMzMsLTc3LC01MSdcbiAgfSxcbiAgRVBTR180MTI5OiB7XG4gICAgdG93Z3M4NDogJy0xMzIsLTExMCwtMzM1J1xuICB9LFxuICBFUFNHXzQ3MTM6IHtcbiAgICB0b3dnczg0OiAnLTc3LC0xMjgsMTQyJ1xuICB9LFxuICBFUFNHXzQyMzk6IHtcbiAgICB0b3dnczg0OiAnMjE3LDgyMywyOTknXG4gIH0sXG4gIEVQU0dfNDE0Njoge1xuICAgIHRvd2dzODQ6ICcyOTUsNzM2LDI1NydcbiAgfSxcbiAgRVBTR180MTU1OiB7XG4gICAgdG93Z3M4NDogJy04MywzNywxMjQnXG4gIH0sXG4gIEVQU0dfNDE2NToge1xuICAgIHRvd2dzODQ6ICctMTczLDI1MywyNydcbiAgfSxcbiAgRVBTR180NjcyOiB7XG4gICAgdG93Z3M4NDogJzE3NSwtMzgsMTEzJ1xuICB9LFxuICBFUFNHXzQyMzY6IHtcbiAgICB0b3dnczg0OiAnLTYzNywtNTQ5LC0yMDMnXG4gIH0sXG4gIEVQU0dfNDI1MToge1xuICAgIHRvd2dzODQ6ICctOTAsNDAsODgnXG4gIH0sXG4gIEVQU0dfNDI3MToge1xuICAgIHRvd2dzODQ6ICctMiwzNzQsMTcyJ1xuICB9LFxuICBFUFNHXzQxNzU6IHtcbiAgICB0b3dnczg0OiAnLTg4LDQsMTAxJ1xuICB9LFxuICBFUFNHXzQ3MTY6IHtcbiAgICB0b3dnczg0OiAnMjk4LC0zMDQsLTM3NSdcbiAgfSxcbiAgRVBTR180MzE1OiB7XG4gICAgdG93Z3M4NDogJy0yMywyNTksLTknXG4gIH0sXG4gIEVQU0dfNDc0NDoge1xuICAgIHRvd2dzODQ6ICctMjQyLjIsLTE0NC45LDM3MC4zJ1xuICB9LFxuICBFUFNHXzQyNDQ6IHtcbiAgICB0b3dnczg0OiAnLTk3LDc4Nyw4NidcbiAgfSxcbiAgRVBTR180MjkzOiB7XG4gICAgdG93Z3M4NDogJzYxNiw5NywtMjUxJ1xuICB9LFxuICBFUFNHXzQ3MTQ6IHtcbiAgICB0b3dnczg0OiAnLTEyNywtNzY5LDQ3MidcbiAgfSxcbiAgRVBTR180NzM2OiB7XG4gICAgdG93Z3M4NDogJzI2MCwxMiwtMTQ3J1xuICB9LFxuICBFUFNHXzY4ODM6IHtcbiAgICB0b3dnczg0OiAnLTIzNSwtMTEwLDM5MydcbiAgfSxcbiAgRVBTR182ODk0OiB7XG4gICAgdG93Z3M4NDogJy02MywxNzYsMTg1J1xuICB9LFxuICBFUFNHXzQyMDU6IHtcbiAgICB0b3dnczg0OiAnLTQzLC0xNjMsNDUnXG4gIH0sXG4gIEVQU0dfNDI1Njoge1xuICAgIHRvd2dzODQ6ICc0MSwtMjIwLC0xMzQnXG4gIH0sXG4gIEVQU0dfNDI2Mjoge1xuICAgIHRvd2dzODQ6ICc2MzksNDA1LDYwJ1xuICB9LFxuICBFUFNHXzQ2MDQ6IHtcbiAgICB0b3dnczg0OiAnMTc0LDM1OSwzNjUnXG4gIH0sXG4gIEVQU0dfNDE2OToge1xuICAgIHRvd2dzODQ6ICctMTE1LDExOCw0MjYnXG4gIH0sXG4gIEVQU0dfNDYyMDoge1xuICAgIHRvd2dzODQ6ICctMTA2LC0xMjksMTY1J1xuICB9LFxuICBFUFNHXzQxODQ6IHtcbiAgICB0b3dnczg0OiAnLTIwMywxNDEsNTMnXG4gIH0sXG4gIEVQU0dfNDYxNjoge1xuICAgIHRvd2dzODQ6ICctMjg5LC0xMjQsNjAnXG4gIH0sXG4gIEVQU0dfOTQwMzoge1xuICAgIHRvd2dzODQ6ICctMzA3LC05MiwxMjcnXG4gIH0sXG4gIEVQU0dfNDY4NDoge1xuICAgIHRvd2dzODQ6ICctMTMzLC0zMjEsNTAnXG4gIH0sXG4gIEVQU0dfNDcwODoge1xuICAgIHRvd2dzODQ6ICctNDkxLC0yMiw0MzUnXG4gIH0sXG4gIEVQU0dfNDcwNzoge1xuICAgIHRvd2dzODQ6ICcxMTQsLTExNiwtMzMzJ1xuICB9LFxuICBFUFNHXzQ3MDk6IHtcbiAgICB0b3dnczg0OiAnMTQ1LDc1LC0yNzInXG4gIH0sXG4gIEVQU0dfNDcxMjoge1xuICAgIHRvd2dzODQ6ICctMjA1LDEwNyw1MydcbiAgfSxcbiAgRVBTR180NzExOiB7XG4gICAgdG93Z3M4NDogJzEyNCwtMjM0LC0yNSdcbiAgfSxcbiAgRVBTR180NzE4OiB7XG4gICAgdG93Z3M4NDogJzIzMCwtMTk5LC03NTInXG4gIH0sXG4gIEVQU0dfNDcxOToge1xuICAgIHRvd2dzODQ6ICcyMTEsMTQ3LDExMSdcbiAgfSxcbiAgRVBTR180NzI0OiB7XG4gICAgdG93Z3M4NDogJzIwOCwtNDM1LC0yMjknXG4gIH0sXG4gIEVQU0dfNDcyNToge1xuICAgIHRvd2dzODQ6ICcxODksLTc5LC0yMDInXG4gIH0sXG4gIEVQU0dfNDczNToge1xuICAgIHRvd2dzODQ6ICc2NDcsMTc3NywtMTEyNCdcbiAgfSxcbiAgRVBTR180NzIyOiB7XG4gICAgdG93Z3M4NDogJy03OTQsMTE5LC0yOTgnXG4gIH0sXG4gIEVQU0dfNDcyODoge1xuICAgIHRvd2dzODQ6ICctMzA3LC05MiwxMjcnXG4gIH0sXG4gIEVQU0dfNDczNDoge1xuICAgIHRvd2dzODQ6ICctNjMyLDQzOCwtNjA5J1xuICB9LFxuICBFUFNHXzQ3Mjc6IHtcbiAgICB0b3dnczg0OiAnOTEyLC01OCwxMjI3J1xuICB9LFxuICBFUFNHXzQ3Mjk6IHtcbiAgICB0b3dnczg0OiAnMTg1LDE2NSw0MidcbiAgfSxcbiAgRVBTR180NzMwOiB7XG4gICAgdG93Z3M4NDogJzE3MCw0Miw4NCdcbiAgfSxcbiAgRVBTR180NzMzOiB7XG4gICAgdG93Z3M4NDogJzI3NiwtNTcsMTQ5J1xuICB9LFxuICBFU1JJXzM3MjE4OiB7XG4gICAgdG93Z3M4NDogJzIzMCwtMTk5LC03NTInXG4gIH0sXG4gIEVTUklfMzcyNDA6IHtcbiAgICB0b3dnczg0OiAnLTcsMjE1LDIyNSdcbiAgfSxcbiAgRVNSSV8zNzIyMToge1xuICAgIHRvd2dzODQ6ICcyNTIsLTIwOSwtNzUxJ1xuICB9LFxuICBFU1JJXzQzMDU6IHtcbiAgICB0b3dnczg0OiAnLTEyMywtMjA2LDIxOSdcbiAgfSxcbiAgRVNSSV8xMDQxMzk6IHtcbiAgICB0b3dnczg0OiAnLTczLC0yNDcsMjI3J1xuICB9LFxuICBFUFNHXzQ3NDg6IHtcbiAgICB0b3dnczg0OiAnNTEsMzkxLC0zNidcbiAgfSxcbiAgRVBTR180MjE5OiB7XG4gICAgdG93Z3M4NDogJy0zODQsNjY0LC00OCdcbiAgfSxcbiAgRVBTR180MjU1OiB7XG4gICAgdG93Z3M4NDogJy0zMzMsLTIyMiwxMTQnXG4gIH0sXG4gIEVQU0dfNDI1Nzoge1xuICAgIHRvd2dzODQ6ICctNTg3LjgsNTE5Ljc1LDE0NS43NidcbiAgfSxcbiAgRVBTR180NjQ2OiB7XG4gICAgdG93Z3M4NDogJy05NjMsNTEwLC0zNTknXG4gIH0sXG4gIEVQU0dfNjg4MToge1xuICAgIHRvd2dzODQ6ICctMjQsLTIwMywyNjgnXG4gIH0sXG4gIEVQU0dfNjg4Mjoge1xuICAgIHRvd2dzODQ6ICctMTgzLC0xNSwyNzMnXG4gIH0sXG4gIEVQU0dfNDcxNToge1xuICAgIHRvd2dzODQ6ICctMTA0LC0xMjksMjM5J1xuICB9LFxuICBJR05GX1JHRjkzR0REOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX1JHTTA0R0REOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX1JHU1BNMDZHREQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfUkdUQUFGMDdHREQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfUkdGRzk1R0REOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX1JHTkNHOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX1JHUEZHREQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfRVRSUzg5Rzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9SR1I5MkdERDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTczOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxODA6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDYxOToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NjY3OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQwNzU6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNjcwNjoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR183Nzk4OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2NjE6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY2OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR184Njg1OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNTE6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfOTcwMjoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzU4OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NjE6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc2NToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR184OTk3OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQwMjM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY3MDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180Njk0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNDg6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE2Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTY3OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxODk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE5MDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTc2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2NTk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfMzgyNDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR18zODg5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQwNDY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDA4MToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NTU4OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ0ODM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTAxMzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MjY0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUzMjQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTM1NDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MzcxOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUzNzM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTM4MToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MzkzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzU0ODk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTU5Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR182MTM1OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzYzNjU6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTI0Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR183ODg2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzg0MzE6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfODQyNzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR184Njk5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzg4MTg6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc1Nzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR185MTQwOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzgwODY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY4Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzM3OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3MDI6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc0Nzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzQ5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2NzQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc1NToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzU5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NjI6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc2Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzY0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNjY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE3MDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181NTQ2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzc4NDQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDgxODoge1xuICAgIHRvd2dzODQ6ICc1ODksNzYsNDgwJ1xuICB9XG59O1xuXG5mb3IgKHZhciBrZXkgaW4gZGF0dW1zKSB7XG4gIHZhciBkYXR1bSA9IGRhdHVtc1trZXldO1xuICBpZiAoIWRhdHVtLmRhdHVtTmFtZSkge1xuICAgIGNvbnRpbnVlO1xuICB9XG4gIGRhdHVtc1tkYXR1bS5kYXR1bU5hbWVdID0gZGF0dW07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdHVtcztcbiIsInZhciBlbGxpcHNvaWRzID0ge1xuICBNRVJJVDoge1xuICAgIGE6IDYzNzgxMzcsXG4gICAgcmY6IDI5OC4yNTcsXG4gICAgZWxsaXBzZU5hbWU6ICdNRVJJVCAxOTgzJ1xuICB9LFxuICBTR1M4NToge1xuICAgIGE6IDYzNzgxMzYsXG4gICAgcmY6IDI5OC4yNTcsXG4gICAgZWxsaXBzZU5hbWU6ICdTb3ZpZXQgR2VvZGV0aWMgU3lzdGVtIDg1J1xuICB9LFxuICBHUlM4MDoge1xuICAgIGE6IDYzNzgxMzcsXG4gICAgcmY6IDI5OC4yNTcyMjIxMDEsXG4gICAgZWxsaXBzZU5hbWU6ICdHUlMgMTk4MChJVUdHLCAxOTgwKSdcbiAgfSxcbiAgSUFVNzY6IHtcbiAgICBhOiA2Mzc4MTQwLFxuICAgIHJmOiAyOTguMjU3LFxuICAgIGVsbGlwc2VOYW1lOiAnSUFVIDE5NzYnXG4gIH0sXG4gIGFpcnk6IHtcbiAgICBhOiA2Mzc3NTYzLjM5NixcbiAgICBiOiA2MzU2MjU2LjkxLFxuICAgIGVsbGlwc2VOYW1lOiAnQWlyeSAxODMwJ1xuICB9LFxuICBBUEw0OiB7XG4gICAgYTogNjM3ODEzNyxcbiAgICByZjogMjk4LjI1LFxuICAgIGVsbGlwc2VOYW1lOiAnQXBwbC4gUGh5c2ljcy4gMTk2NSdcbiAgfSxcbiAgTldMOUQ6IHtcbiAgICBhOiA2Mzc4MTQ1LFxuICAgIHJmOiAyOTguMjUsXG4gICAgZWxsaXBzZU5hbWU6ICdOYXZhbCBXZWFwb25zIExhYi4sIDE5NjUnXG4gIH0sXG4gIG1vZF9haXJ5OiB7XG4gICAgYTogNjM3NzM0MC4xODksXG4gICAgYjogNjM1NjAzNC40NDYsXG4gICAgZWxsaXBzZU5hbWU6ICdNb2RpZmllZCBBaXJ5J1xuICB9LFxuICBhbmRyYWU6IHtcbiAgICBhOiA2Mzc3MTA0LjQzLFxuICAgIHJmOiAzMDAsXG4gICAgZWxsaXBzZU5hbWU6ICdBbmRyYWUgMTg3NiAoRGVuLiwgSWNsbmQuKSdcbiAgfSxcbiAgYXVzdF9TQToge1xuICAgIGE6IDYzNzgxNjAsXG4gICAgcmY6IDI5OC4yNSxcbiAgICBlbGxpcHNlTmFtZTogJ0F1c3RyYWxpYW4gTmF0bCAmIFMuIEFtZXIuIDE5NjknXG4gIH0sXG4gIEdSUzY3OiB7XG4gICAgYTogNjM3ODE2MCxcbiAgICByZjogMjk4LjI0NzE2NzQyNyxcbiAgICBlbGxpcHNlTmFtZTogJ0dSUyA2NyhJVUdHIDE5NjcpJ1xuICB9LFxuICBiZXNzZWw6IHtcbiAgICBhOiA2Mzc3Mzk3LjE1NSxcbiAgICByZjogMjk5LjE1MjgxMjgsXG4gICAgZWxsaXBzZU5hbWU6ICdCZXNzZWwgMTg0MSdcbiAgfSxcbiAgYmVzc19uYW06IHtcbiAgICBhOiA2Mzc3NDgzLjg2NSxcbiAgICByZjogMjk5LjE1MjgxMjgsXG4gICAgZWxsaXBzZU5hbWU6ICdCZXNzZWwgMTg0MSAoTmFtaWJpYSknXG4gIH0sXG4gIGNscms2Njoge1xuICAgIGE6IDYzNzgyMDYuNCxcbiAgICBiOiA2MzU2NTgzLjgsXG4gICAgZWxsaXBzZU5hbWU6ICdDbGFya2UgMTg2NidcbiAgfSxcbiAgY2xyazgwOiB7XG4gICAgYTogNjM3ODI0OS4xNDUsXG4gICAgcmY6IDI5My40NjYzLFxuICAgIGVsbGlwc2VOYW1lOiAnQ2xhcmtlIDE4ODAgbW9kLidcbiAgfSxcbiAgY2xyazgwaWduOiB7XG4gICAgYTogNjM3ODI0OS4yLFxuICAgIGI6IDYzNTY1MTUsXG4gICAgcmY6IDI5My40NjYwMjEzLFxuICAgIGVsbGlwc2VOYW1lOiAnQ2xhcmtlIDE4ODAgKElHTiknXG4gIH0sXG4gIGNscms1ODoge1xuICAgIGE6IDYzNzgyOTMuNjQ1MjA4NzU5LFxuICAgIHJmOiAyOTQuMjYwNjc2MzY5MjY1NCxcbiAgICBlbGxpcHNlTmFtZTogJ0NsYXJrZSAxODU4J1xuICB9LFxuICBDUE06IHtcbiAgICBhOiA2Mzc1NzM4LjcsXG4gICAgcmY6IDMzNC4yOSxcbiAgICBlbGxpcHNlTmFtZTogJ0NvbW0uIGRlcyBQb2lkcyBldCBNZXN1cmVzIDE3OTknXG4gIH0sXG4gIGRlbG1icjoge1xuICAgIGE6IDYzNzY0MjgsXG4gICAgcmY6IDMxMS41LFxuICAgIGVsbGlwc2VOYW1lOiAnRGVsYW1icmUgMTgxMCAoQmVsZ2l1bSknXG4gIH0sXG4gIGVuZ2VsaXM6IHtcbiAgICBhOiA2Mzc4MTM2LjA1LFxuICAgIHJmOiAyOTguMjU2NixcbiAgICBlbGxpcHNlTmFtZTogJ0VuZ2VsaXMgMTk4NSdcbiAgfSxcbiAgZXZyc3QzMDoge1xuICAgIGE6IDYzNzcyNzYuMzQ1LFxuICAgIHJmOiAzMDAuODAxNyxcbiAgICBlbGxpcHNlTmFtZTogJ0V2ZXJlc3QgMTgzMCdcbiAgfSxcbiAgZXZyc3Q0ODoge1xuICAgIGE6IDYzNzczMDQuMDYzLFxuICAgIHJmOiAzMDAuODAxNyxcbiAgICBlbGxpcHNlTmFtZTogJ0V2ZXJlc3QgMTk0OCdcbiAgfSxcbiAgZXZyc3Q1Njoge1xuICAgIGE6IDYzNzczMDEuMjQzLFxuICAgIHJmOiAzMDAuODAxNyxcbiAgICBlbGxpcHNlTmFtZTogJ0V2ZXJlc3QgMTk1NidcbiAgfSxcbiAgZXZyc3Q2OToge1xuICAgIGE6IDYzNzcyOTUuNjY0LFxuICAgIHJmOiAzMDAuODAxNyxcbiAgICBlbGxpcHNlTmFtZTogJ0V2ZXJlc3QgMTk2OSdcbiAgfSxcbiAgZXZyc3RTUzoge1xuICAgIGE6IDYzNzcyOTguNTU2LFxuICAgIHJmOiAzMDAuODAxNyxcbiAgICBlbGxpcHNlTmFtZTogJ0V2ZXJlc3QgKFNhYmFoICYgU2FyYXdhayknXG4gIH0sXG4gIGZzY2hyNjA6IHtcbiAgICBhOiA2Mzc4MTY2LFxuICAgIHJmOiAyOTguMyxcbiAgICBlbGxpcHNlTmFtZTogJ0Zpc2NoZXIgKE1lcmN1cnkgRGF0dW0pIDE5NjAnXG4gIH0sXG4gIGZzY2hyNjBtOiB7XG4gICAgYTogNjM3ODE1NSxcbiAgICByZjogMjk4LjMsXG4gICAgZWxsaXBzZU5hbWU6ICdGaXNjaGVyIDE5NjAnXG4gIH0sXG4gIGZzY2hyNjg6IHtcbiAgICBhOiA2Mzc4MTUwLFxuICAgIHJmOiAyOTguMyxcbiAgICBlbGxpcHNlTmFtZTogJ0Zpc2NoZXIgMTk2OCdcbiAgfSxcbiAgaGVsbWVydDoge1xuICAgIGE6IDYzNzgyMDAsXG4gICAgcmY6IDI5OC4zLFxuICAgIGVsbGlwc2VOYW1lOiAnSGVsbWVydCAxOTA2J1xuICB9LFxuICBob3VnaDoge1xuICAgIGE6IDYzNzgyNzAsXG4gICAgcmY6IDI5NyxcbiAgICBlbGxpcHNlTmFtZTogJ0hvdWdoJ1xuICB9LFxuICBpbnRsOiB7XG4gICAgYTogNjM3ODM4OCxcbiAgICByZjogMjk3LFxuICAgIGVsbGlwc2VOYW1lOiAnSW50ZXJuYXRpb25hbCAxOTA5IChIYXlmb3JkKSdcbiAgfSxcbiAga2F1bGE6IHtcbiAgICBhOiA2Mzc4MTYzLFxuICAgIHJmOiAyOTguMjQsXG4gICAgZWxsaXBzZU5hbWU6ICdLYXVsYSAxOTYxJ1xuICB9LFxuICBsZXJjaDoge1xuICAgIGE6IDYzNzgxMzksXG4gICAgcmY6IDI5OC4yNTcsXG4gICAgZWxsaXBzZU5hbWU6ICdMZXJjaCAxOTc5J1xuICB9LFxuICBtcHJ0czoge1xuICAgIGE6IDYzOTczMDAsXG4gICAgcmY6IDE5MSxcbiAgICBlbGxpcHNlTmFtZTogJ01hdXBlcnRpdXMgMTczOCdcbiAgfSxcbiAgbmV3X2ludGw6IHtcbiAgICBhOiA2Mzc4MTU3LjUsXG4gICAgYjogNjM1Njc3Mi4yLFxuICAgIGVsbGlwc2VOYW1lOiAnTmV3IEludGVybmF0aW9uYWwgMTk2NydcbiAgfSxcbiAgcGxlc3Npczoge1xuICAgIGE6IDYzNzY1MjMsXG4gICAgcmY6IDYzNTU4NjMsXG4gICAgZWxsaXBzZU5hbWU6ICdQbGVzc2lzIDE4MTcgKEZyYW5jZSknXG4gIH0sXG4gIGtyYXNzOiB7XG4gICAgYTogNjM3ODI0NSxcbiAgICByZjogMjk4LjMsXG4gICAgZWxsaXBzZU5hbWU6ICdLcmFzc292c2t5LCAxOTQyJ1xuICB9LFxuICBTRWFzaWE6IHtcbiAgICBhOiA2Mzc4MTU1LFxuICAgIGI6IDYzNTY3NzMuMzIwNSxcbiAgICBlbGxpcHNlTmFtZTogJ1NvdXRoZWFzdCBBc2lhJ1xuICB9LFxuICB3YWxiZWNrOiB7XG4gICAgYTogNjM3Njg5NixcbiAgICBiOiA2MzU1ODM0Ljg0NjcsXG4gICAgZWxsaXBzZU5hbWU6ICdXYWxiZWNrJ1xuICB9LFxuICBXR1M2MDoge1xuICAgIGE6IDYzNzgxNjUsXG4gICAgcmY6IDI5OC4zLFxuICAgIGVsbGlwc2VOYW1lOiAnV0dTIDYwJ1xuICB9LFxuICBXR1M2Njoge1xuICAgIGE6IDYzNzgxNDUsXG4gICAgcmY6IDI5OC4yNSxcbiAgICBlbGxpcHNlTmFtZTogJ1dHUyA2NidcbiAgfSxcbiAgV0dTNzoge1xuICAgIGE6IDYzNzgxMzUsXG4gICAgcmY6IDI5OC4yNixcbiAgICBlbGxpcHNlTmFtZTogJ1dHUyA3MidcbiAgfSxcbiAgV0dTODQ6IHtcbiAgICBhOiA2Mzc4MTM3LFxuICAgIHJmOiAyOTguMjU3MjIzNTYzLFxuICAgIGVsbGlwc2VOYW1lOiAnV0dTIDg0J1xuICB9LFxuICBzcGhlcmU6IHtcbiAgICBhOiA2MzcwOTk3LFxuICAgIGI6IDYzNzA5OTcsXG4gICAgZWxsaXBzZU5hbWU6ICdOb3JtYWwgU3BoZXJlIChyPTYzNzA5OTcpJ1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBlbGxpcHNvaWRzO1xuIiwidmFyIHByaW1lTWVyaWRpYW4gPSB7fTtcblxucHJpbWVNZXJpZGlhbi5ncmVlbndpY2ggPSAwLjA7IC8vIFwiMGRFXCIsXG5wcmltZU1lcmlkaWFuLmxpc2JvbiA9IC05LjEzMTkwNjExMTExMTsgLy8gXCI5ZDA3JzU0Ljg2MlxcXCJXXCIsXG5wcmltZU1lcmlkaWFuLnBhcmlzID0gMi4zMzcyMjkxNjY2Njc7IC8vIFwiMmQyMCcxNC4wMjVcXFwiRVwiLFxucHJpbWVNZXJpZGlhbi5ib2dvdGEgPSAtNzQuMDgwOTE2NjY2NjY3OyAvLyBcIjc0ZDA0JzUxLjNcXFwiV1wiLFxucHJpbWVNZXJpZGlhbi5tYWRyaWQgPSAtMy42ODc5Mzg4ODg4ODk7IC8vIFwiM2Q0MScxNi41OFxcXCJXXCIsXG5wcmltZU1lcmlkaWFuLnJvbWUgPSAxMi40NTIzMzMzMzMzMzM7IC8vIFwiMTJkMjcnOC40XFxcIkVcIixcbnByaW1lTWVyaWRpYW4uYmVybiA9IDcuNDM5NTgzMzMzMzMzOyAvLyBcIjdkMjYnMjIuNVxcXCJFXCIsXG5wcmltZU1lcmlkaWFuLmpha2FydGEgPSAxMDYuODA3NzE5NDQ0NDQ0OyAvLyBcIjEwNmQ0OCcyNy43OVxcXCJFXCIsXG5wcmltZU1lcmlkaWFuLmZlcnJvID0gLTE3LjY2NjY2NjY2NjY2NzsgLy8gXCIxN2Q0MCdXXCIsXG5wcmltZU1lcmlkaWFuLmJydXNzZWxzID0gNC4zNjc5NzU7IC8vIFwiNGQyMic0LjcxXFxcIkVcIixcbnByaW1lTWVyaWRpYW4uc3RvY2tob2xtID0gMTguMDU4Mjc3Nzc3Nzc4OyAvLyBcIjE4ZDMnMjkuOFxcXCJFXCIsXG5wcmltZU1lcmlkaWFuLmF0aGVucyA9IDIzLjcxNjMzNzU7IC8vIFwiMjNkNDInNTguODE1XFxcIkVcIixcbnByaW1lTWVyaWRpYW4ub3NsbyA9IDEwLjcyMjkxNjY2NjY2NzsgLy8gXCIxMGQ0MycyMi41XFxcIkVcIlxuXG5leHBvcnQgZGVmYXVsdCBwcmltZU1lcmlkaWFuO1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBtbTogeyB0b19tZXRlcjogMC4wMDEgfSxcbiAgY206IHsgdG9fbWV0ZXI6IDAuMDEgfSxcbiAgZnQ6IHsgdG9fbWV0ZXI6IDAuMzA0OCB9LFxuICAndXMtZnQnOiB7IHRvX21ldGVyOiAxMjAwIC8gMzkzNyB9LFxuICBmYXRoOiB7IHRvX21ldGVyOiAxLjgyODggfSxcbiAga21pOiB7IHRvX21ldGVyOiAxODUyIH0sXG4gICd1cy1jaCc6IHsgdG9fbWV0ZXI6IDIwLjExNjg0MDIzMzY4MDUgfSxcbiAgJ3VzLW1pJzogeyB0b19tZXRlcjogMTYwOS4zNDcyMTg2OTQ0NCB9LFxuICBrbTogeyB0b19tZXRlcjogMTAwMCB9LFxuICAnaW5kLWZ0JzogeyB0b19tZXRlcjogMC4zMDQ3OTg0MSB9LFxuICAnaW5kLXlkJzogeyB0b19tZXRlcjogMC45MTQzOTUyMyB9LFxuICBtaTogeyB0b19tZXRlcjogMTYwOS4zNDQgfSxcbiAgeWQ6IHsgdG9fbWV0ZXI6IDAuOTE0NCB9LFxuICBjaDogeyB0b19tZXRlcjogMjAuMTE2OCB9LFxuICBsaW5rOiB7IHRvX21ldGVyOiAwLjIwMTE2OCB9LFxuICBkbTogeyB0b19tZXRlcjogMC4xIH0sXG4gIGluOiB7IHRvX21ldGVyOiAwLjAyNTQgfSxcbiAgJ2luZC1jaCc6IHsgdG9fbWV0ZXI6IDIwLjExNjY5NTA2IH0sXG4gICd1cy1pbic6IHsgdG9fbWV0ZXI6IDAuMDI1NDAwMDUwODAwMTAxIH0sXG4gICd1cy15ZCc6IHsgdG9fbWV0ZXI6IDAuOTE0NDAxODI4ODAzNjU4IH1cbn07XG4iLCJleHBvcnQgdmFyIFBKRF8zUEFSQU0gPSAxO1xuZXhwb3J0IHZhciBQSkRfN1BBUkFNID0gMjtcbmV4cG9ydCB2YXIgUEpEX0dSSURTSElGVCA9IDM7XG5leHBvcnQgdmFyIFBKRF9XR1M4NCA9IDQ7IC8vIFdHUzg0IG9yIGVxdWl2YWxlbnRcbmV4cG9ydCB2YXIgUEpEX05PREFUVU0gPSA1OyAvLyBXR1M4NCBvciBlcXVpdmFsZW50XG5leHBvcnQgdmFyIFNSU19XR1M4NF9TRU1JTUFKT1IgPSA2Mzc4MTM3LjA7IC8vIG9ubHkgdXNlZCBpbiBncmlkIHNoaWZ0IHRyYW5zZm9ybXNcbmV4cG9ydCB2YXIgU1JTX1dHUzg0X1NFTUlNSU5PUiA9IDYzNTY3NTIuMzE0OyAvLyBvbmx5IHVzZWQgaW4gZ3JpZCBzaGlmdCB0cmFuc2Zvcm1zXG5leHBvcnQgdmFyIFNSU19XR1M4NF9FU1FVQVJFRCA9IDAuMDA2Njk0Mzc5OTkwMTQxMzE2NTsgLy8gb25seSB1c2VkIGluIGdyaWQgc2hpZnQgdHJhbnNmb3Jtc1xuZXhwb3J0IHZhciBTRUNfVE9fUkFEID0gNC44NDgxMzY4MTEwOTUzNTk5MzU4OTkxNDEwMjM1N2UtNjtcbmV4cG9ydCB2YXIgSEFMRl9QSSA9IE1hdGguUEkgLyAyO1xuLy8gZWxsaXBvaWQgcGpfc2V0X2VsbC5jXG5leHBvcnQgdmFyIFNJWFRIID0gMC4xNjY2NjY2NjY2NjY2NjY2NjY3O1xuLyogMS82ICovXG5leHBvcnQgdmFyIFJBNCA9IDAuMDQ3MjIyMjIyMjIyMjIyMjIyMjI7XG4vKiAxNy8zNjAgKi9cbmV4cG9ydCB2YXIgUkE2ID0gMC4wMjIxNTYwODQ2NTYwODQ2NTYwODtcbmV4cG9ydCB2YXIgRVBTTE4gPSAxLjBlLTEwO1xuLy8geW91J2QgdGhpbmsgeW91IGNvdWxkIHVzZSBOdW1iZXIuRVBTSUxPTiBhYm92ZSBidXQgdGhhdCBtYWtlc1xuLy8gTW9sbHdlaWRlIGdldCBpbnRvIGFuIGluZmluYXRlIGxvb3AuXG5cbmV4cG9ydCB2YXIgRDJSID0gMC4wMTc0NTMyOTI1MTk5NDMyOTU3NztcbmV4cG9ydCB2YXIgUjJEID0gNTcuMjk1Nzc5NTEzMDgyMzIwODg7XG5leHBvcnQgdmFyIEZPUlRQSSA9IE1hdGguUEkgLyA0O1xuZXhwb3J0IHZhciBUV09fUEkgPSBNYXRoLlBJICogMjtcbi8vIFNQSSBpcyBzbGlnaHRseSBncmVhdGVyIHRoYW4gTWF0aC5QSSwgc28gdmFsdWVzIHRoYXQgZXhjZWVkIHRoZSAtMTgwLi4xODBcbi8vIGRlZ3JlZSByYW5nZSBieSBhIHRpbnkgYW1vdW50IGRvbid0IGdldCB3cmFwcGVkLiBUaGlzIHByZXZlbnRzIHBvaW50cyB0aGF0XG4vLyBoYXZlIGRyaWZ0ZWQgZnJvbSB0aGVpciBvcmlnaW5hbCBsb2NhdGlvbiBhbG9uZyB0aGUgMTgwdGggbWVyaWRpYW4gKGR1ZSB0b1xuLy8gZmxvYXRpbmcgcG9pbnQgZXJyb3IpIGZyb20gY2hhbmdpbmcgdGhlaXIgc2lnbi5cbmV4cG9ydCB2YXIgU1BJID0gMy4xNDE1OTI2NTM1OTtcbiIsImltcG9ydCBwcm9qIGZyb20gJy4vUHJvaic7XG5pbXBvcnQgdHJhbnNmb3JtIGZyb20gJy4vdHJhbnNmb3JtJztcbnZhciB3Z3M4NCA9IHByb2ooJ1dHUzg0Jyk7XG5cbi8qKlxuICogQHR5cGVkZWYge3t4OiBudW1iZXIsIHk6IG51bWJlciwgej86IG51bWJlciwgbT86IG51bWJlcn19IEludGVyZmFjZUNvb3JkaW5hdGVzXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7QXJyYXk8bnVtYmVyPiB8IEludGVyZmFjZUNvb3JkaW5hdGVzfSBUZW1wbGF0ZUNvb3JkaW5hdGVzXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDb252ZXJ0ZXJcbiAqIEBwcm9wZXJ0eSB7PFQgZXh0ZW5kcyBUZW1wbGF0ZUNvb3JkaW5hdGVzPihjb29yZGluYXRlczogVCwgZW5mb3JjZUF4aXM/OiBib29sZWFuKSA9PiBUfSBmb3J3YXJkXG4gKiBAcHJvcGVydHkgezxUIGV4dGVuZHMgVGVtcGxhdGVDb29yZGluYXRlcz4oY29vcmRpbmF0ZXM6IFQsIGVuZm9yY2VBeGlzPzogYm9vbGVhbikgPT4gVH0gaW52ZXJzZVxuICogQHByb3BlcnR5IHtwcm9qfSBbb1Byb2pdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQUk9KSlNPTkRlZmluaXRpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbJHNjaGVtYV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdXG4gKiBAcHJvcGVydHkge3thdXRob3JpdHk6IHN0cmluZywgY29kZTogbnVtYmVyfX0gW2lkXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzY29wZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbYXJlYV1cbiAqIEBwcm9wZXJ0eSB7e3NvdXRoX2xhdGl0dWRlOiBudW1iZXIsIHdlc3RfbG9uZ2l0dWRlOiBudW1iZXIsIG5vcnRoX2xhdGl0dWRlOiBudW1iZXIsIGVhc3RfbG9uZ2l0dWRlOiBudW1iZXJ9fSBbYmJveF1cbiAqIEBwcm9wZXJ0eSB7UFJPSkpTT05EZWZpbml0aW9uW119IFtjb21wb25lbnRzXVxuICogQHByb3BlcnR5IHt7dHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmd9fSBbZGF0dW1dXG4gKiBAcHJvcGVydHkge3tcbiAqICAgbmFtZTogc3RyaW5nLFxuICogICBtZW1iZXJzOiBBcnJheTx7XG4gKiAgICAgbmFtZTogc3RyaW5nLFxuICogICAgIGlkPzoge2F1dGhvcml0eTogc3RyaW5nLCBjb2RlOiBudW1iZXJ9XG4gKiAgIH0+LFxuICogICBlbGxpcHNvaWQ/OiB7XG4gKiAgICAgbmFtZTogc3RyaW5nLFxuICogICAgIHNlbWlfbWFqb3JfYXhpczogbnVtYmVyLFxuICogICAgIGludmVyc2VfZmxhdHRlbmluZz86IG51bWJlclxuICogICB9LFxuICogICBhY2N1cmFjeT86IHN0cmluZyxcbiAqICAgaWQ/OiB7YXV0aG9yaXR5OiBzdHJpbmcsIGNvZGU6IG51bWJlcn1cbiAqIH19IFtkYXR1bV9lbnNlbWJsZV1cbiAqIEBwcm9wZXJ0eSB7e1xuICogICBzdWJ0eXBlOiBzdHJpbmcsXG4gKiAgIGF4aXM6IEFycmF5PHtcbiAqICAgICBuYW1lOiBzdHJpbmcsXG4gKiAgICAgYWJicmV2aWF0aW9uPzogc3RyaW5nLFxuICogICAgIGRpcmVjdGlvbjogc3RyaW5nLFxuICogICAgIHVuaXQ6IHN0cmluZ1xuICogICB9PlxuICogfX0gW2Nvb3JkaW5hdGVfc3lzdGVtXVxuICogQHByb3BlcnR5IHt7XG4gKiAgIG5hbWU6IHN0cmluZyxcbiAqICAgbWV0aG9kOiB7bmFtZTogc3RyaW5nfSxcbiAqICAgcGFyYW1ldGVyczogQXJyYXk8e1xuICogICAgIG5hbWU6IHN0cmluZyxcbiAqICAgICB2YWx1ZTogbnVtYmVyLFxuICogICAgIHVuaXQ/OiBzdHJpbmdcbiAqICAgfT5cbiAqIH19IFtjb252ZXJzaW9uXVxuICogQHByb3BlcnR5IHt7XG4gKiAgIG5hbWU6IHN0cmluZyxcbiAqICAgbWV0aG9kOiB7bmFtZTogc3RyaW5nfSxcbiAqICAgcGFyYW1ldGVyczogQXJyYXk8e1xuICogICAgIG5hbWU6IHN0cmluZyxcbiAqICAgICB2YWx1ZTogbnVtYmVyLFxuICogICAgIHVuaXQ/OiBzdHJpbmcsXG4gKiAgICAgdHlwZT86IHN0cmluZyxcbiAqICAgICBmaWxlX25hbWU/OiBzdHJpbmdcbiAqICAgfT5cbiAqIH19IFt0cmFuc2Zvcm1hdGlvbl1cbiAqL1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7VGVtcGxhdGVDb29yZGluYXRlc30gVFxuICogQHBhcmFtIHtwcm9qfSBmcm9tXG4gKiBAcGFyYW0ge3Byb2p9IHRvXG4gKiBAcGFyYW0ge1R9IGNvb3Jkc1xuICogQHBhcmFtIHtib29sZWFufSBbZW5mb3JjZUF4aXNdXG4gKiBAcmV0dXJucyB7VH1cbiAqL1xuZnVuY3Rpb24gdHJhbnNmb3JtZXIoZnJvbSwgdG8sIGNvb3JkcywgZW5mb3JjZUF4aXMpIHtcbiAgdmFyIHRyYW5zZm9ybWVkQXJyYXksIG91dCwga2V5cztcbiAgaWYgKEFycmF5LmlzQXJyYXkoY29vcmRzKSkge1xuICAgIHRyYW5zZm9ybWVkQXJyYXkgPSB0cmFuc2Zvcm0oZnJvbSwgdG8sIGNvb3JkcywgZW5mb3JjZUF4aXMpIHx8IHsgeDogTmFOLCB5OiBOYU4gfTtcbiAgICBpZiAoY29vcmRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGlmICgodHlwZW9mIGZyb20ubmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZnJvbS5uYW1lID09PSAnZ2VvY2VudCcpIHx8ICh0eXBlb2YgdG8ubmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdG8ubmFtZSA9PT0gJ2dlb2NlbnQnKSkge1xuICAgICAgICBpZiAodHlwZW9mIHRyYW5zZm9ybWVkQXJyYXkueiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gLyoqIEB0eXBlIHtUfSAqLyAoW3RyYW5zZm9ybWVkQXJyYXkueCwgdHJhbnNmb3JtZWRBcnJheS55LCB0cmFuc2Zvcm1lZEFycmF5LnpdLmNvbmNhdChjb29yZHMuc2xpY2UoMykpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gLyoqIEB0eXBlIHtUfSAqLyAoW3RyYW5zZm9ybWVkQXJyYXkueCwgdHJhbnNmb3JtZWRBcnJheS55LCBjb29yZHNbMl1dLmNvbmNhdChjb29yZHMuc2xpY2UoMykpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKFt0cmFuc2Zvcm1lZEFycmF5LngsIHRyYW5zZm9ybWVkQXJyYXkueV0uY29uY2F0KGNvb3Jkcy5zbGljZSgyKSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLyoqIEB0eXBlIHtUfSAqLyAoW3RyYW5zZm9ybWVkQXJyYXkueCwgdHJhbnNmb3JtZWRBcnJheS55XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCA9IHRyYW5zZm9ybShmcm9tLCB0bywgY29vcmRzLCBlbmZvcmNlQXhpcyk7XG4gICAga2V5cyA9IE9iamVjdC5rZXlzKGNvb3Jkcyk7XG4gICAgaWYgKGtleXMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gLyoqIEB0eXBlIHtUfSAqLyAob3V0KTtcbiAgICB9XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmICgodHlwZW9mIGZyb20ubmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZnJvbS5uYW1lID09PSAnZ2VvY2VudCcpIHx8ICh0eXBlb2YgdG8ubmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdG8ubmFtZSA9PT0gJ2dlb2NlbnQnKSkge1xuICAgICAgICBpZiAoa2V5ID09PSAneCcgfHwga2V5ID09PSAneScgfHwga2V5ID09PSAneicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChrZXkgPT09ICd4JyB8fCBrZXkgPT09ICd5Jykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3V0W2tleV0gPSBjb29yZHNba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gLyoqIEB0eXBlIHtUfSAqLyAob3V0KTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7cHJvaiB8IHN0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IENvbnZlcnRlcn0gaXRlbVxuICogQHJldHVybnMge2ltcG9ydCgnLi9Qcm9qJykuZGVmYXVsdH1cbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9qKGl0ZW0pIHtcbiAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBwcm9qKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cbiAgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAnb1Byb2onIGluIGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5vUHJvajtcbiAgfVxuICByZXR1cm4gcHJvaigvKiogQHR5cGUge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbn0gKi8gKGl0ZW0pKTtcbn1cblxuLyoqXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvan0gdG9Qcm9qXG4gKiBAcmV0dXJucyB7Q29udmVydGVyfVxuICovXG4vKipcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qfSBmcm9tUHJvalxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qfSB0b1Byb2pcbiAqIEByZXR1cm5zIHtDb252ZXJ0ZXJ9XG4gKi9cbi8qKlxuICogQHRlbXBsYXRlIHtUZW1wbGF0ZUNvb3JkaW5hdGVzfSBUXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvan0gdG9Qcm9qXG4gKiBAcGFyYW0ge1R9IGNvb3JkXG4gKiBAcmV0dXJucyB7VH1cbiAqL1xuLyoqXG4gKiBAdGVtcGxhdGUge1RlbXBsYXRlQ29vcmRpbmF0ZXN9IFRcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qfSBmcm9tUHJvalxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qfSB0b1Byb2pcbiAqIEBwYXJhbSB7VH0gY29vcmRcbiAqIEByZXR1cm5zIHtUfVxuICovXG4vKipcbiAqIEB0ZW1wbGF0ZSB7VGVtcGxhdGVDb29yZGluYXRlc30gVFxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qfSBmcm9tUHJvak9yVG9Qcm9qXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2ogfCBUZW1wbGF0ZUNvb3JkaW5hdGVzfSBbdG9Qcm9qT3JDb29yZF1cbiAqIEBwYXJhbSB7VH0gW2Nvb3JkXVxuICogQHJldHVybnMge1R8Q29udmVydGVyfVxuICovXG5mdW5jdGlvbiBwcm9qNChmcm9tUHJvak9yVG9Qcm9qLCB0b1Byb2pPckNvb3JkLCBjb29yZCkge1xuICAvKiogQHR5cGUge3Byb2p9ICovXG4gIHZhciBmcm9tUHJvajtcbiAgLyoqIEB0eXBlIHtwcm9qfSAqL1xuICB2YXIgdG9Qcm9qO1xuICB2YXIgc2luZ2xlID0gZmFsc2U7XG4gIC8qKiBAdHlwZSB7Q29udmVydGVyfSAqL1xuICB2YXIgb2JqO1xuICBpZiAodHlwZW9mIHRvUHJvak9yQ29vcmQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdG9Qcm9qID0gY2hlY2tQcm9qKGZyb21Qcm9qT3JUb1Byb2opO1xuICAgIGZyb21Qcm9qID0gd2dzODQ7XG4gICAgc2luZ2xlID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgLyoqIEB0eXBlIHs/fSAqLyAodG9Qcm9qT3JDb29yZCkueCAhPT0gJ3VuZGVmaW5lZCcgfHwgQXJyYXkuaXNBcnJheSh0b1Byb2pPckNvb3JkKSkge1xuICAgIGNvb3JkID0gLyoqIEB0eXBlIHtUfSAqLyAoLyoqIEB0eXBlIHs/fSAqLyAodG9Qcm9qT3JDb29yZCkpO1xuICAgIHRvUHJvaiA9IGNoZWNrUHJvaihmcm9tUHJvak9yVG9Qcm9qKTtcbiAgICBmcm9tUHJvaiA9IHdnczg0O1xuICAgIHNpbmdsZSA9IHRydWU7XG4gIH1cbiAgaWYgKCFmcm9tUHJvaikge1xuICAgIGZyb21Qcm9qID0gY2hlY2tQcm9qKGZyb21Qcm9qT3JUb1Byb2opO1xuICB9XG4gIGlmICghdG9Qcm9qKSB7XG4gICAgdG9Qcm9qID0gY2hlY2tQcm9qKC8qKiBAdHlwZSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvaiB9ICovICh0b1Byb2pPckNvb3JkKSk7XG4gIH1cbiAgaWYgKGNvb3JkKSB7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyKGZyb21Qcm9qLCB0b1Byb2osIGNvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBvYmogPSB7XG4gICAgICAvKipcbiAgICAgICAqIEB0ZW1wbGF0ZSB7VGVtcGxhdGVDb29yZGluYXRlc30gVFxuICAgICAgICogQHBhcmFtIHtUfSBjb29yZHNcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IGVuZm9yY2VBeGlzXG4gICAgICAgKiBAcmV0dXJucyB7VH1cbiAgICAgICAqL1xuICAgICAgZm9yd2FyZDogZnVuY3Rpb24gKGNvb3JkcywgZW5mb3JjZUF4aXMpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyKGZyb21Qcm9qLCB0b1Byb2osIGNvb3JkcywgZW5mb3JjZUF4aXMpO1xuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogQHRlbXBsYXRlIHtUZW1wbGF0ZUNvb3JkaW5hdGVzfSBUXG4gICAgICAgKiBAcGFyYW0ge1R9IGNvb3Jkc1xuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gZW5mb3JjZUF4aXNcbiAgICAgICAqIEByZXR1cm5zIHtUfVxuICAgICAgICovXG4gICAgICBpbnZlcnNlOiBmdW5jdGlvbiAoY29vcmRzLCBlbmZvcmNlQXhpcykge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtZXIodG9Qcm9qLCBmcm9tUHJvaiwgY29vcmRzLCBlbmZvcmNlQXhpcyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoc2luZ2xlKSB7XG4gICAgICBvYmoub1Byb2ogPSB0b1Byb2o7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJvajQ7XG4iLCJpbXBvcnQgeyBQSkRfM1BBUkFNLCBQSkRfN1BBUkFNLCBQSkRfR1JJRFNISUZULCBQSkRfV0dTODQsIFBKRF9OT0RBVFVNLCBTRUNfVE9fUkFEIH0gZnJvbSAnLi9jb25zdGFudHMvdmFsdWVzJztcblxuZnVuY3Rpb24gZGF0dW0oZGF0dW1Db2RlLCBkYXR1bV9wYXJhbXMsIGEsIGIsIGVzLCBlcDIsIG5hZGdyaWRzKSB7XG4gIHZhciBvdXQgPSB7fTtcblxuICBpZiAoZGF0dW1Db2RlID09PSB1bmRlZmluZWQgfHwgZGF0dW1Db2RlID09PSAnbm9uZScpIHtcbiAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF9OT0RBVFVNO1xuICB9IGVsc2Uge1xuICAgIG91dC5kYXR1bV90eXBlID0gUEpEX1dHUzg0O1xuICB9XG5cbiAgaWYgKGRhdHVtX3BhcmFtcykge1xuICAgIG91dC5kYXR1bV9wYXJhbXMgPSBkYXR1bV9wYXJhbXMubWFwKHBhcnNlRmxvYXQpO1xuICAgIGlmIChvdXQuZGF0dW1fcGFyYW1zWzBdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbMV0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1syXSAhPT0gMCkge1xuICAgICAgb3V0LmRhdHVtX3R5cGUgPSBQSkRfM1BBUkFNO1xuICAgIH1cbiAgICBpZiAob3V0LmRhdHVtX3BhcmFtcy5sZW5ndGggPiAzKSB7XG4gICAgICBpZiAob3V0LmRhdHVtX3BhcmFtc1szXSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzRdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbNV0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1s2XSAhPT0gMCkge1xuICAgICAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF83UEFSQU07XG4gICAgICAgIG91dC5kYXR1bV9wYXJhbXNbM10gKj0gU0VDX1RPX1JBRDtcbiAgICAgICAgb3V0LmRhdHVtX3BhcmFtc1s0XSAqPSBTRUNfVE9fUkFEO1xuICAgICAgICBvdXQuZGF0dW1fcGFyYW1zWzVdICo9IFNFQ19UT19SQUQ7XG4gICAgICAgIG91dC5kYXR1bV9wYXJhbXNbNl0gPSAob3V0LmRhdHVtX3BhcmFtc1s2XSAvIDEwMDAwMDAuMCkgKyAxLjA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKG5hZGdyaWRzKSB7XG4gICAgb3V0LmRhdHVtX3R5cGUgPSBQSkRfR1JJRFNISUZUO1xuICAgIG91dC5ncmlkcyA9IG5hZGdyaWRzO1xuICB9XG4gIG91dC5hID0gYTsgLy8gZGF0dW0gb2JqZWN0IGFsc28gdXNlcyB0aGVzZSB2YWx1ZXNcbiAgb3V0LmIgPSBiO1xuICBvdXQuZXMgPSBlcztcbiAgb3V0LmVwMiA9IGVwMjtcbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGF0dW07XG4iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgeyBQSkRfM1BBUkFNLCBQSkRfN1BBUkFNLCBIQUxGX1BJIH0gZnJvbSAnLi9jb25zdGFudHMvdmFsdWVzJztcbmV4cG9ydCBmdW5jdGlvbiBjb21wYXJlRGF0dW1zKHNvdXJjZSwgZGVzdCkge1xuICBpZiAoc291cmNlLmRhdHVtX3R5cGUgIT09IGRlc3QuZGF0dW1fdHlwZSkge1xuICAgIHJldHVybiBmYWxzZTsgLy8gZmFsc2UsIGRhdHVtcyBhcmUgbm90IGVxdWFsXG4gIH0gZWxzZSBpZiAoc291cmNlLmEgIT09IGRlc3QuYSB8fCBNYXRoLmFicyhzb3VyY2UuZXMgLSBkZXN0LmVzKSA+IDAuMDAwMDAwMDAwMDUwKSB7XG4gICAgLy8gdGhlIHRvbGVyYW5jZSBmb3IgZXMgaXMgdG8gZW5zdXJlIHRoYXQgR1JTODAgYW5kIFdHUzg0XG4gICAgLy8gYXJlIGNvbnNpZGVyZWQgaWRlbnRpY2FsXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHNvdXJjZS5kYXR1bV90eXBlID09PSBQSkRfM1BBUkFNKSB7XG4gICAgcmV0dXJuIChzb3VyY2UuZGF0dW1fcGFyYW1zWzBdID09PSBkZXN0LmRhdHVtX3BhcmFtc1swXSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzFdID09PSBkZXN0LmRhdHVtX3BhcmFtc1sxXSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzJdID09PSBkZXN0LmRhdHVtX3BhcmFtc1syXSk7XG4gIH0gZWxzZSBpZiAoc291cmNlLmRhdHVtX3R5cGUgPT09IFBKRF83UEFSQU0pIHtcbiAgICByZXR1cm4gKHNvdXJjZS5kYXR1bV9wYXJhbXNbMF0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzBdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMV0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzFdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMl0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzJdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbM10gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzNdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbNF0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzRdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbNV0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzVdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbNl0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzZdKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTsgLy8gZGF0dW1zIGFyZSBlcXVhbFxuICB9XG59IC8vIGNzX2NvbXBhcmVfZGF0dW1zKClcblxuLypcbiAqIFRoZSBmdW5jdGlvbiBDb252ZXJ0X0dlb2RldGljX1RvX0dlb2NlbnRyaWMgY29udmVydHMgZ2VvZGV0aWMgY29vcmRpbmF0ZXNcbiAqIChsYXRpdHVkZSwgbG9uZ2l0dWRlLCBhbmQgaGVpZ2h0KSB0byBnZW9jZW50cmljIGNvb3JkaW5hdGVzIChYLCBZLCBaKSxcbiAqIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBlbGxpcHNvaWQgcGFyYW1ldGVycy5cbiAqXG4gKiAgICBMYXRpdHVkZSAgOiBHZW9kZXRpYyBsYXRpdHVkZSBpbiByYWRpYW5zICAgICAgICAgICAgICAgICAgICAgKGlucHV0KVxuICogICAgTG9uZ2l0dWRlIDogR2VvZGV0aWMgbG9uZ2l0dWRlIGluIHJhZGlhbnMgICAgICAgICAgICAgICAgICAgIChpbnB1dClcbiAqICAgIEhlaWdodCAgICA6IEdlb2RldGljIGhlaWdodCwgaW4gbWV0ZXJzICAgICAgICAgICAgICAgICAgICAgICAoaW5wdXQpXG4gKiAgICBYICAgICAgICAgOiBDYWxjdWxhdGVkIEdlb2NlbnRyaWMgWCBjb29yZGluYXRlLCBpbiBtZXRlcnMgICAgKG91dHB1dClcbiAqICAgIFkgICAgICAgICA6IENhbGN1bGF0ZWQgR2VvY2VudHJpYyBZIGNvb3JkaW5hdGUsIGluIG1ldGVycyAgICAob3V0cHV0KVxuICogICAgWiAgICAgICAgIDogQ2FsY3VsYXRlZCBHZW9jZW50cmljIFogY29vcmRpbmF0ZSwgaW4gbWV0ZXJzICAgIChvdXRwdXQpXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VvZGV0aWNUb0dlb2NlbnRyaWMocCwgZXMsIGEpIHtcbiAgdmFyIExvbmdpdHVkZSA9IHAueDtcbiAgdmFyIExhdGl0dWRlID0gcC55O1xuICB2YXIgSGVpZ2h0ID0gcC56ID8gcC56IDogMDsgLy8gWiB2YWx1ZSBub3QgYWx3YXlzIHN1cHBsaWVkXG5cbiAgdmFyIFJuOyAvKiAgRWFydGggcmFkaXVzIGF0IGxvY2F0aW9uICAqL1xuICB2YXIgU2luX0xhdDsgLyogIE1hdGguc2luKExhdGl0dWRlKSAgKi9cbiAgdmFyIFNpbjJfTGF0OyAvKiAgU3F1YXJlIG9mIE1hdGguc2luKExhdGl0dWRlKSAgKi9cbiAgdmFyIENvc19MYXQ7IC8qICBNYXRoLmNvcyhMYXRpdHVkZSkgICovXG5cbiAgLypcbiAgICoqIERvbid0IGJsb3cgdXAgaWYgTGF0aXR1ZGUgaXMganVzdCBhIGxpdHRsZSBvdXQgb2YgdGhlIHZhbHVlXG4gICAqKiByYW5nZSBhcyBpdCBtYXkganVzdCBiZSBhIHJvdW5kaW5nIGlzc3VlLiAgQWxzbyByZW1vdmVkIGxvbmdpdHVkZVxuICAgKiogdGVzdCwgaXQgc2hvdWxkIGJlIHdyYXBwZWQgYnkgTWF0aC5jb3MoKSBhbmQgTWF0aC5zaW4oKS4gIE5GVyBmb3IgUFJPSi40LCBTZXAvMjAwMS5cbiAgICovXG4gIGlmIChMYXRpdHVkZSA8IC1IQUxGX1BJICYmIExhdGl0dWRlID4gLTEuMDAxICogSEFMRl9QSSkge1xuICAgIExhdGl0dWRlID0gLUhBTEZfUEk7XG4gIH0gZWxzZSBpZiAoTGF0aXR1ZGUgPiBIQUxGX1BJICYmIExhdGl0dWRlIDwgMS4wMDEgKiBIQUxGX1BJKSB7XG4gICAgTGF0aXR1ZGUgPSBIQUxGX1BJO1xuICB9IGVsc2UgaWYgKExhdGl0dWRlIDwgLUhBTEZfUEkpIHtcbiAgICAvKiBMYXRpdHVkZSBvdXQgb2YgcmFuZ2UgKi9cbiAgICAvLyAuLnJlcG9ydEVycm9yKCdnZW9jZW50OmxhdCBvdXQgb2YgcmFuZ2U6JyArIExhdGl0dWRlKTtcbiAgICByZXR1cm4geyB4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgejogcC56IH07XG4gIH0gZWxzZSBpZiAoTGF0aXR1ZGUgPiBIQUxGX1BJKSB7XG4gICAgLyogTGF0aXR1ZGUgb3V0IG9mIHJhbmdlICovXG4gICAgcmV0dXJuIHsgeDogSW5maW5pdHksIHk6IEluZmluaXR5LCB6OiBwLnogfTtcbiAgfVxuXG4gIGlmIChMb25naXR1ZGUgPiBNYXRoLlBJKSB7XG4gICAgTG9uZ2l0dWRlIC09ICgyICogTWF0aC5QSSk7XG4gIH1cbiAgU2luX0xhdCA9IE1hdGguc2luKExhdGl0dWRlKTtcbiAgQ29zX0xhdCA9IE1hdGguY29zKExhdGl0dWRlKTtcbiAgU2luMl9MYXQgPSBTaW5fTGF0ICogU2luX0xhdDtcbiAgUm4gPSBhIC8gKE1hdGguc3FydCgxLjBlMCAtIGVzICogU2luMl9MYXQpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiAoUm4gKyBIZWlnaHQpICogQ29zX0xhdCAqIE1hdGguY29zKExvbmdpdHVkZSksXG4gICAgeTogKFJuICsgSGVpZ2h0KSAqIENvc19MYXQgKiBNYXRoLnNpbihMb25naXR1ZGUpLFxuICAgIHo6ICgoUm4gKiAoMSAtIGVzKSkgKyBIZWlnaHQpICogU2luX0xhdFxuICB9O1xufSAvLyBjc19nZW9kZXRpY190b19nZW9jZW50cmljKClcblxuZXhwb3J0IGZ1bmN0aW9uIGdlb2NlbnRyaWNUb0dlb2RldGljKHAsIGVzLCBhLCBiKSB7XG4gIC8qIGxvY2FsIGRlZmludGlvbnMgYW5kIHZhcmlhYmxlcyAqL1xuICAvKiBlbmQtY3JpdGVyaXVtIG9mIGxvb3AsIGFjY3VyYWN5IG9mIHNpbihMYXRpdHVkZSkgKi9cbiAgdmFyIGdlbmF1ID0gMWUtMTI7XG4gIHZhciBnZW5hdTIgPSAoZ2VuYXUgKiBnZW5hdSk7XG4gIHZhciBtYXhpdGVyID0gMzA7XG5cbiAgdmFyIFA7IC8qIGRpc3RhbmNlIGJldHdlZW4gc2VtaS1taW5vciBheGlzIGFuZCBsb2NhdGlvbiAqL1xuICB2YXIgUlI7IC8qIGRpc3RhbmNlIGJldHdlZW4gY2VudGVyIGFuZCBsb2NhdGlvbiAqL1xuICB2YXIgQ1Q7IC8qIHNpbiBvZiBnZW9jZW50cmljIGxhdGl0dWRlICovXG4gIHZhciBTVDsgLyogY29zIG9mIGdlb2NlbnRyaWMgbGF0aXR1ZGUgKi9cbiAgdmFyIFJYO1xuICB2YXIgUks7XG4gIHZhciBSTjsgLyogRWFydGggcmFkaXVzIGF0IGxvY2F0aW9uICovXG4gIHZhciBDUEhJMDsgLyogY29zIG9mIHN0YXJ0IG9yIG9sZCBnZW9kZXRpYyBsYXRpdHVkZSBpbiBpdGVyYXRpb25zICovXG4gIHZhciBTUEhJMDsgLyogc2luIG9mIHN0YXJ0IG9yIG9sZCBnZW9kZXRpYyBsYXRpdHVkZSBpbiBpdGVyYXRpb25zICovXG4gIHZhciBDUEhJOyAvKiBjb3Mgb2Ygc2VhcmNoZWQgZ2VvZGV0aWMgbGF0aXR1ZGUgKi9cbiAgdmFyIFNQSEk7IC8qIHNpbiBvZiBzZWFyY2hlZCBnZW9kZXRpYyBsYXRpdHVkZSAqL1xuICB2YXIgU0RQSEk7IC8qIGVuZC1jcml0ZXJpdW06IGFkZGl0aW9uLXRoZW9yZW0gb2Ygc2luKExhdGl0dWRlKGl0ZXIpLUxhdGl0dWRlKGl0ZXItMSkpICovXG4gIHZhciBpdGVyOyAvKiAjIG9mIGNvbnRpbm91cyBpdGVyYXRpb24sIG1heC4gMzAgaXMgYWx3YXlzIGVub3VnaCAocy5hLikgKi9cblxuICB2YXIgWCA9IHAueDtcbiAgdmFyIFkgPSBwLnk7XG4gIHZhciBaID0gcC56ID8gcC56IDogMC4wOyAvLyBaIHZhbHVlIG5vdCBhbHdheXMgc3VwcGxpZWRcbiAgdmFyIExvbmdpdHVkZTtcbiAgdmFyIExhdGl0dWRlO1xuICB2YXIgSGVpZ2h0O1xuXG4gIFAgPSBNYXRoLnNxcnQoWCAqIFggKyBZICogWSk7XG4gIFJSID0gTWF0aC5zcXJ0KFggKiBYICsgWSAqIFkgKyBaICogWik7XG5cbiAgLyogICAgICBzcGVjaWFsIGNhc2VzIGZvciBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlICovXG4gIGlmIChQIC8gYSA8IGdlbmF1KSB7XG4gICAgLyogIHNwZWNpYWwgY2FzZSwgaWYgUD0wLiAoWD0wLiwgWT0wLikgKi9cbiAgICBMb25naXR1ZGUgPSAwLjA7XG5cbiAgICAvKiAgaWYgKFgsWSxaKT0oMC4sMC4sMC4pIHRoZW4gSGVpZ2h0IGJlY29tZXMgc2VtaS1taW5vciBheGlzXG4gICAgICogIG9mIGVsbGlwc29pZCAoPWNlbnRlciBvZiBtYXNzKSwgTGF0aXR1ZGUgYmVjb21lcyBQSS8yICovXG4gICAgaWYgKFJSIC8gYSA8IGdlbmF1KSB7XG4gICAgICBMYXRpdHVkZSA9IEhBTEZfUEk7XG4gICAgICBIZWlnaHQgPSAtYjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHAueCxcbiAgICAgICAgeTogcC55LFxuICAgICAgICB6OiBwLnpcbiAgICAgIH07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8qICBlbGxpcHNvaWRhbCAoZ2VvZGV0aWMpIGxvbmdpdHVkZVxuICAgICAqICBpbnRlcnZhbDogLVBJIDwgTG9uZ2l0dWRlIDw9ICtQSSAqL1xuICAgIExvbmdpdHVkZSA9IE1hdGguYXRhbjIoWSwgWCk7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBGb2xsb3dpbmcgaXRlcmF0aXZlIGFsZ29yaXRobSB3YXMgZGV2ZWxvcHBlZCBieVxuICAgKiBcIkluc3RpdHV0IGZvciBFcmRtZXNzdW5nXCIsIFVuaXZlcnNpdHkgb2YgSGFubm92ZXIsIEp1bHkgMTk4OC5cbiAgICogSW50ZXJuZXQ6IHd3dy5pZmUudW5pLWhhbm5vdmVyLmRlXG4gICAqIEl0ZXJhdGl2ZSBjb21wdXRhdGlvbiBvZiBDUEhJLFNQSEkgYW5kIEhlaWdodC5cbiAgICogSXRlcmF0aW9uIG9mIENQSEkgYW5kIFNQSEkgdG8gMTAqKi0xMiByYWRpYW4gcmVzcC5cbiAgICogMioxMCoqLTcgYXJjc2VjLlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgQ1QgPSBaIC8gUlI7XG4gIFNUID0gUCAvIFJSO1xuICBSWCA9IDEuMCAvIE1hdGguc3FydCgxLjAgLSBlcyAqICgyLjAgLSBlcykgKiBTVCAqIFNUKTtcbiAgQ1BISTAgPSBTVCAqICgxLjAgLSBlcykgKiBSWDtcbiAgU1BISTAgPSBDVCAqIFJYO1xuICBpdGVyID0gMDtcblxuICAvKiBsb29wIHRvIGZpbmQgc2luKExhdGl0dWRlKSByZXNwLiBMYXRpdHVkZVxuICAgKiB1bnRpbCB8c2luKExhdGl0dWRlKGl0ZXIpLUxhdGl0dWRlKGl0ZXItMSkpfCA8IGdlbmF1ICovXG4gIGRvIHtcbiAgICBpdGVyKys7XG4gICAgUk4gPSBhIC8gTWF0aC5zcXJ0KDEuMCAtIGVzICogU1BISTAgKiBTUEhJMCk7XG5cbiAgICAvKiAgZWxsaXBzb2lkYWwgKGdlb2RldGljKSBoZWlnaHQgKi9cbiAgICBIZWlnaHQgPSBQICogQ1BISTAgKyBaICogU1BISTAgLSBSTiAqICgxLjAgLSBlcyAqIFNQSEkwICogU1BISTApO1xuXG4gICAgUksgPSBlcyAqIFJOIC8gKFJOICsgSGVpZ2h0KTtcbiAgICBSWCA9IDEuMCAvIE1hdGguc3FydCgxLjAgLSBSSyAqICgyLjAgLSBSSykgKiBTVCAqIFNUKTtcbiAgICBDUEhJID0gU1QgKiAoMS4wIC0gUkspICogUlg7XG4gICAgU1BISSA9IENUICogUlg7XG4gICAgU0RQSEkgPSBTUEhJICogQ1BISTAgLSBDUEhJICogU1BISTA7XG4gICAgQ1BISTAgPSBDUEhJO1xuICAgIFNQSEkwID0gU1BISTtcbiAgfVxuICB3aGlsZSAoU0RQSEkgKiBTRFBISSA+IGdlbmF1MiAmJiBpdGVyIDwgbWF4aXRlcik7XG5cbiAgLyogICAgICBlbGxpcHNvaWRhbCAoZ2VvZGV0aWMpIGxhdGl0dWRlICovXG4gIExhdGl0dWRlID0gTWF0aC5hdGFuKFNQSEkgLyBNYXRoLmFicyhDUEhJKSk7XG4gIHJldHVybiB7XG4gICAgeDogTG9uZ2l0dWRlLFxuICAgIHk6IExhdGl0dWRlLFxuICAgIHo6IEhlaWdodFxuICB9O1xufSAvLyBjc19nZW9jZW50cmljX3RvX2dlb2RldGljKClcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBwal9nZW9jZW50aWNfdG9fd2dzODQoIHAgKVxuLy8gIHAgPSBwb2ludCB0byB0cmFuc2Zvcm0gaW4gZ2VvY2VudHJpYyBjb29yZGluYXRlcyAoeCx5LHopXG5cbi8qKiBwb2ludCBvYmplY3QsIG5vdGhpbmcgZmFuY3ksIGp1c3QgYWxsb3dzIHZhbHVlcyB0byBiZVxuICAgIHBhc3NlZCBiYWNrIGFuZCBmb3J0aCBieSByZWZlcmVuY2UgcmF0aGVyIHRoYW4gYnkgdmFsdWUuXG4gICAgT3RoZXIgcG9pbnQgY2xhc3NlcyBtYXkgYmUgdXNlZCBhcyBsb25nIGFzIHRoZXkgaGF2ZVxuICAgIHggYW5kIHkgcHJvcGVydGllcywgd2hpY2ggd2lsbCBnZXQgbW9kaWZpZWQgaW4gdGhlIHRyYW5zZm9ybSBtZXRob2QuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdlb2NlbnRyaWNUb1dnczg0KHAsIGRhdHVtX3R5cGUsIGRhdHVtX3BhcmFtcykge1xuICBpZiAoZGF0dW1fdHlwZSA9PT0gUEpEXzNQQVJBTSkge1xuICAgIC8vIGlmKCB4W2lvXSA9PT0gSFVHRV9WQUwgKVxuICAgIC8vICAgIGNvbnRpbnVlO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBwLnggKyBkYXR1bV9wYXJhbXNbMF0sXG4gICAgICB5OiBwLnkgKyBkYXR1bV9wYXJhbXNbMV0sXG4gICAgICB6OiBwLnogKyBkYXR1bV9wYXJhbXNbMl1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGRhdHVtX3R5cGUgPT09IFBKRF83UEFSQU0pIHtcbiAgICB2YXIgRHhfQkYgPSBkYXR1bV9wYXJhbXNbMF07XG4gICAgdmFyIER5X0JGID0gZGF0dW1fcGFyYW1zWzFdO1xuICAgIHZhciBEel9CRiA9IGRhdHVtX3BhcmFtc1syXTtcbiAgICB2YXIgUnhfQkYgPSBkYXR1bV9wYXJhbXNbM107XG4gICAgdmFyIFJ5X0JGID0gZGF0dW1fcGFyYW1zWzRdO1xuICAgIHZhciBSel9CRiA9IGRhdHVtX3BhcmFtc1s1XTtcbiAgICB2YXIgTV9CRiA9IGRhdHVtX3BhcmFtc1s2XTtcbiAgICAvLyBpZiggeFtpb10gPT09IEhVR0VfVkFMIClcbiAgICAvLyAgICBjb250aW51ZTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogTV9CRiAqIChwLnggLSBSel9CRiAqIHAueSArIFJ5X0JGICogcC56KSArIER4X0JGLFxuICAgICAgeTogTV9CRiAqIChSel9CRiAqIHAueCArIHAueSAtIFJ4X0JGICogcC56KSArIER5X0JGLFxuICAgICAgejogTV9CRiAqICgtUnlfQkYgKiBwLnggKyBSeF9CRiAqIHAueSArIHAueikgKyBEel9CRlxuICAgIH07XG4gIH1cbn0gLy8gY3NfZ2VvY2VudHJpY190b193Z3M4NFxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIHBqX2dlb2NlbnRpY19mcm9tX3dnczg0KClcbi8vICBjb29yZGluYXRlIHN5c3RlbSBkZWZpbml0aW9uLFxuLy8gIHBvaW50IHRvIHRyYW5zZm9ybSBpbiBnZW9jZW50cmljIGNvb3JkaW5hdGVzICh4LHkseilcbmV4cG9ydCBmdW5jdGlvbiBnZW9jZW50cmljRnJvbVdnczg0KHAsIGRhdHVtX3R5cGUsIGRhdHVtX3BhcmFtcykge1xuICBpZiAoZGF0dW1fdHlwZSA9PT0gUEpEXzNQQVJBTSkge1xuICAgIC8vIGlmKCB4W2lvXSA9PT0gSFVHRV9WQUwgKVxuICAgIC8vICAgIGNvbnRpbnVlO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBwLnggLSBkYXR1bV9wYXJhbXNbMF0sXG4gICAgICB5OiBwLnkgLSBkYXR1bV9wYXJhbXNbMV0sXG4gICAgICB6OiBwLnogLSBkYXR1bV9wYXJhbXNbMl1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGRhdHVtX3R5cGUgPT09IFBKRF83UEFSQU0pIHtcbiAgICB2YXIgRHhfQkYgPSBkYXR1bV9wYXJhbXNbMF07XG4gICAgdmFyIER5X0JGID0gZGF0dW1fcGFyYW1zWzFdO1xuICAgIHZhciBEel9CRiA9IGRhdHVtX3BhcmFtc1syXTtcbiAgICB2YXIgUnhfQkYgPSBkYXR1bV9wYXJhbXNbM107XG4gICAgdmFyIFJ5X0JGID0gZGF0dW1fcGFyYW1zWzRdO1xuICAgIHZhciBSel9CRiA9IGRhdHVtX3BhcmFtc1s1XTtcbiAgICB2YXIgTV9CRiA9IGRhdHVtX3BhcmFtc1s2XTtcbiAgICB2YXIgeF90bXAgPSAocC54IC0gRHhfQkYpIC8gTV9CRjtcbiAgICB2YXIgeV90bXAgPSAocC55IC0gRHlfQkYpIC8gTV9CRjtcbiAgICB2YXIgel90bXAgPSAocC56IC0gRHpfQkYpIC8gTV9CRjtcbiAgICAvLyBpZiggeFtpb10gPT09IEhVR0VfVkFMIClcbiAgICAvLyAgICBjb250aW51ZTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiB4X3RtcCArIFJ6X0JGICogeV90bXAgLSBSeV9CRiAqIHpfdG1wLFxuICAgICAgeTogLVJ6X0JGICogeF90bXAgKyB5X3RtcCArIFJ4X0JGICogel90bXAsXG4gICAgICB6OiBSeV9CRiAqIHhfdG1wIC0gUnhfQkYgKiB5X3RtcCArIHpfdG1wXG4gICAgfTtcbiAgfSAvLyBjc19nZW9jZW50cmljX2Zyb21fd2dzODQoKVxufVxuIiwiaW1wb3J0IHtcbiAgUEpEXzNQQVJBTSxcbiAgUEpEXzdQQVJBTSxcbiAgUEpEX0dSSURTSElGVCxcbiAgUEpEX05PREFUVU0sXG4gIFIyRCxcbiAgU1JTX1dHUzg0X0VTUVVBUkVELFxuICBTUlNfV0dTODRfU0VNSU1BSk9SLCBTUlNfV0dTODRfU0VNSU1JTk9SXG59IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCB7IGdlb2RldGljVG9HZW9jZW50cmljLCBnZW9jZW50cmljVG9HZW9kZXRpYywgZ2VvY2VudHJpY1RvV2dzODQsIGdlb2NlbnRyaWNGcm9tV2dzODQsIGNvbXBhcmVEYXR1bXMgfSBmcm9tICcuL2RhdHVtVXRpbHMnO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi9jb21tb24vYWRqdXN0X2xvbic7XG5mdW5jdGlvbiBjaGVja1BhcmFtcyh0eXBlKSB7XG4gIHJldHVybiAodHlwZSA9PT0gUEpEXzNQQVJBTSB8fCB0eXBlID09PSBQSkRfN1BBUkFNKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHNvdXJjZSwgZGVzdCwgcG9pbnQpIHtcbiAgLy8gU2hvcnQgY3V0IGlmIHRoZSBkYXR1bXMgYXJlIGlkZW50aWNhbC5cbiAgaWYgKGNvbXBhcmVEYXR1bXMoc291cmNlLCBkZXN0KSkge1xuICAgIHJldHVybiBwb2ludDsgLy8gaW4gdGhpcyBjYXNlLCB6ZXJvIGlzIHN1Y2VzcyxcbiAgICAvLyB3aGVyZWFzIGNzX2NvbXBhcmVfZGF0dW1zIHJldHVybnMgMSB0byBpbmRpY2F0ZSBUUlVFXG4gICAgLy8gY29uZnVzaW5nLCBzaG91bGQgZml4IHRoaXNcbiAgfVxuXG4gIC8vIEV4cGxpY2l0bHkgc2tpcCBkYXR1bSB0cmFuc2Zvcm0gYnkgc2V0dGluZyAnZGF0dW09bm9uZScgYXMgcGFyYW1ldGVyIGZvciBlaXRoZXIgc291cmNlIG9yIGRlc3RcbiAgaWYgKHNvdXJjZS5kYXR1bV90eXBlID09PSBQSkRfTk9EQVRVTSB8fCBkZXN0LmRhdHVtX3R5cGUgPT09IFBKRF9OT0RBVFVNKSB7XG4gICAgcmV0dXJuIHBvaW50O1xuICB9XG5cbiAgLy8gSWYgdGhpcyBkYXR1bSByZXF1aXJlcyBncmlkIHNoaWZ0cywgdGhlbiBhcHBseSBpdCB0byBnZW9kZXRpYyBjb29yZGluYXRlcy5cbiAgdmFyIHNvdXJjZV9hID0gc291cmNlLmE7XG4gIHZhciBzb3VyY2VfZXMgPSBzb3VyY2UuZXM7XG4gIGlmIChzb3VyY2UuZGF0dW1fdHlwZSA9PT0gUEpEX0dSSURTSElGVCkge1xuICAgIHZhciBncmlkU2hpZnRDb2RlID0gYXBwbHlHcmlkU2hpZnQoc291cmNlLCBmYWxzZSwgcG9pbnQpO1xuICAgIGlmIChncmlkU2hpZnRDb2RlICE9PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzb3VyY2VfYSA9IFNSU19XR1M4NF9TRU1JTUFKT1I7XG4gICAgc291cmNlX2VzID0gU1JTX1dHUzg0X0VTUVVBUkVEO1xuICB9XG5cbiAgdmFyIGRlc3RfYSA9IGRlc3QuYTtcbiAgdmFyIGRlc3RfYiA9IGRlc3QuYjtcbiAgdmFyIGRlc3RfZXMgPSBkZXN0LmVzO1xuICBpZiAoZGVzdC5kYXR1bV90eXBlID09PSBQSkRfR1JJRFNISUZUKSB7XG4gICAgZGVzdF9hID0gU1JTX1dHUzg0X1NFTUlNQUpPUjtcbiAgICBkZXN0X2IgPSBTUlNfV0dTODRfU0VNSU1JTk9SO1xuICAgIGRlc3RfZXMgPSBTUlNfV0dTODRfRVNRVUFSRUQ7XG4gIH1cblxuICAvLyBEbyB3ZSBuZWVkIHRvIGdvIHRocm91Z2ggZ2VvY2VudHJpYyBjb29yZGluYXRlcz9cbiAgaWYgKHNvdXJjZV9lcyA9PT0gZGVzdF9lcyAmJiBzb3VyY2VfYSA9PT0gZGVzdF9hICYmICFjaGVja1BhcmFtcyhzb3VyY2UuZGF0dW1fdHlwZSkgJiYgIWNoZWNrUGFyYW1zKGRlc3QuZGF0dW1fdHlwZSkpIHtcbiAgICByZXR1cm4gcG9pbnQ7XG4gIH1cblxuICAvLyBDb252ZXJ0IHRvIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMuXG4gIHBvaW50ID0gZ2VvZGV0aWNUb0dlb2NlbnRyaWMocG9pbnQsIHNvdXJjZV9lcywgc291cmNlX2EpO1xuICAvLyBDb252ZXJ0IGJldHdlZW4gZGF0dW1zXG4gIGlmIChjaGVja1BhcmFtcyhzb3VyY2UuZGF0dW1fdHlwZSkpIHtcbiAgICBwb2ludCA9IGdlb2NlbnRyaWNUb1dnczg0KHBvaW50LCBzb3VyY2UuZGF0dW1fdHlwZSwgc291cmNlLmRhdHVtX3BhcmFtcyk7XG4gIH1cbiAgaWYgKGNoZWNrUGFyYW1zKGRlc3QuZGF0dW1fdHlwZSkpIHtcbiAgICBwb2ludCA9IGdlb2NlbnRyaWNGcm9tV2dzODQocG9pbnQsIGRlc3QuZGF0dW1fdHlwZSwgZGVzdC5kYXR1bV9wYXJhbXMpO1xuICB9XG4gIHBvaW50ID0gZ2VvY2VudHJpY1RvR2VvZGV0aWMocG9pbnQsIGRlc3RfZXMsIGRlc3RfYSwgZGVzdF9iKTtcblxuICBpZiAoZGVzdC5kYXR1bV90eXBlID09PSBQSkRfR1JJRFNISUZUKSB7XG4gICAgdmFyIGRlc3RHcmlkU2hpZnRSZXN1bHQgPSBhcHBseUdyaWRTaGlmdChkZXN0LCB0cnVlLCBwb2ludCk7XG4gICAgaWYgKGRlc3RHcmlkU2hpZnRSZXN1bHQgIT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBvaW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlHcmlkU2hpZnQoc291cmNlLCBpbnZlcnNlLCBwb2ludCkge1xuICBpZiAoc291cmNlLmdyaWRzID09PSBudWxsIHx8IHNvdXJjZS5ncmlkcy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zb2xlLmxvZygnR3JpZCBzaGlmdCBncmlkcyBub3QgZm91bmQnKTtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgdmFyIGlucHV0ID0geyB4OiAtcG9pbnQueCwgeTogcG9pbnQueSB9O1xuICB2YXIgb3V0cHV0ID0geyB4OiBOdW1iZXIuTmFOLCB5OiBOdW1iZXIuTmFOIH07XG4gIHZhciBhdHRlbXB0ZWRHcmlkcyA9IFtdO1xuICBvdXRlcjpcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UuZ3JpZHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZ3JpZCA9IHNvdXJjZS5ncmlkc1tpXTtcbiAgICBhdHRlbXB0ZWRHcmlkcy5wdXNoKGdyaWQubmFtZSk7XG4gICAgaWYgKGdyaWQuaXNOdWxsKSB7XG4gICAgICBvdXRwdXQgPSBpbnB1dDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoZ3JpZC5ncmlkID09PSBudWxsKSB7XG4gICAgICBpZiAoZ3JpZC5tYW5kYXRvcnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBmaW5kIG1hbmRhdG9yeSBncmlkIFxcJycgKyBncmlkLm5hbWUgKyAnXFwnJyk7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB2YXIgc3ViZ3JpZHMgPSBncmlkLmdyaWQuc3ViZ3JpZHM7XG4gICAgZm9yICh2YXIgaiA9IDAsIGpqID0gc3ViZ3JpZHMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgdmFyIHN1YmdyaWQgPSBzdWJncmlkc1tqXTtcbiAgICAgIC8vIHNraXAgdGFibGVzIHRoYXQgZG9uJ3QgbWF0Y2ggb3VyIHBvaW50IGF0IGFsbFxuICAgICAgdmFyIGVwc2lsb24gPSAoTWF0aC5hYnMoc3ViZ3JpZC5kZWxbMV0pICsgTWF0aC5hYnMoc3ViZ3JpZC5kZWxbMF0pKSAvIDEwMDAwLjA7XG4gICAgICB2YXIgbWluWCA9IHN1YmdyaWQubGxbMF0gLSBlcHNpbG9uO1xuICAgICAgdmFyIG1pblkgPSBzdWJncmlkLmxsWzFdIC0gZXBzaWxvbjtcbiAgICAgIHZhciBtYXhYID0gc3ViZ3JpZC5sbFswXSArIChzdWJncmlkLmxpbVswXSAtIDEpICogc3ViZ3JpZC5kZWxbMF0gKyBlcHNpbG9uO1xuICAgICAgdmFyIG1heFkgPSBzdWJncmlkLmxsWzFdICsgKHN1YmdyaWQubGltWzFdIC0gMSkgKiBzdWJncmlkLmRlbFsxXSArIGVwc2lsb247XG4gICAgICBpZiAobWluWSA+IGlucHV0LnkgfHwgbWluWCA+IGlucHV0LnggfHwgbWF4WSA8IGlucHV0LnkgfHwgbWF4WCA8IGlucHV0LngpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBvdXRwdXQgPSBhcHBseVN1YmdyaWRTaGlmdChpbnB1dCwgaW52ZXJzZSwgc3ViZ3JpZCk7XG4gICAgICBpZiAoIWlzTmFOKG91dHB1dC54KSkge1xuICAgICAgICBicmVhayBvdXRlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGlzTmFOKG91dHB1dC54KSkge1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZmluZCBhIGdyaWQgc2hpZnQgdGFibGUgZm9yIGxvY2F0aW9uIFxcJydcbiAgICAgICsgLWlucHV0LnggKiBSMkQgKyAnICcgKyBpbnB1dC55ICogUjJEICsgJyB0cmllZDogXFwnJyArIGF0dGVtcHRlZEdyaWRzICsgJ1xcJycpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBwb2ludC54ID0gLW91dHB1dC54O1xuICBwb2ludC55ID0gb3V0cHV0Lnk7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBhcHBseVN1YmdyaWRTaGlmdChwaW4sIGludmVyc2UsIGN0KSB7XG4gIHZhciB2YWwgPSB7IHg6IE51bWJlci5OYU4sIHk6IE51bWJlci5OYU4gfTtcbiAgaWYgKGlzTmFOKHBpbi54KSkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgdmFyIHRiID0geyB4OiBwaW4ueCwgeTogcGluLnkgfTtcbiAgdGIueCAtPSBjdC5sbFswXTtcbiAgdGIueSAtPSBjdC5sbFsxXTtcbiAgdGIueCA9IGFkanVzdF9sb24odGIueCAtIE1hdGguUEkpICsgTWF0aC5QSTtcbiAgdmFyIHQgPSBuYWRJbnRlcnBvbGF0ZSh0YiwgY3QpO1xuICBpZiAoaW52ZXJzZSkge1xuICAgIGlmIChpc05hTih0LngpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICB0LnggPSB0Yi54IC0gdC54O1xuICAgIHQueSA9IHRiLnkgLSB0Lnk7XG4gICAgdmFyIGkgPSA5LCB0b2wgPSAxZS0xMjtcbiAgICB2YXIgZGlmLCBkZWw7XG4gICAgZG8ge1xuICAgICAgZGVsID0gbmFkSW50ZXJwb2xhdGUodCwgY3QpO1xuICAgICAgaWYgKGlzTmFOKGRlbC54KSkge1xuICAgICAgICBjb25zb2xlLmxvZygnSW52ZXJzZSBncmlkIHNoaWZ0IGl0ZXJhdGlvbiBmYWlsZWQsIHByZXN1bWFibHkgYXQgZ3JpZCBlZGdlLiAgVXNpbmcgZmlyc3QgYXBwcm94aW1hdGlvbi4nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkaWYgPSB7IHg6IHRiLnggLSAoZGVsLnggKyB0LngpLCB5OiB0Yi55IC0gKGRlbC55ICsgdC55KSB9O1xuICAgICAgdC54ICs9IGRpZi54O1xuICAgICAgdC55ICs9IGRpZi55O1xuICAgIH0gd2hpbGUgKGktLSAmJiBNYXRoLmFicyhkaWYueCkgPiB0b2wgJiYgTWF0aC5hYnMoZGlmLnkpID4gdG9sKTtcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdJbnZlcnNlIGdyaWQgc2hpZnQgaXRlcmF0b3IgZmFpbGVkIHRvIGNvbnZlcmdlLicpO1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdmFsLnggPSBhZGp1c3RfbG9uKHQueCArIGN0LmxsWzBdKTtcbiAgICB2YWwueSA9IHQueSArIGN0LmxsWzFdO1xuICB9IGVsc2Uge1xuICAgIGlmICghaXNOYU4odC54KSkge1xuICAgICAgdmFsLnggPSBwaW4ueCArIHQueDtcbiAgICAgIHZhbC55ID0gcGluLnkgKyB0Lnk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIG5hZEludGVycG9sYXRlKHBpbiwgY3QpIHtcbiAgdmFyIHQgPSB7IHg6IHBpbi54IC8gY3QuZGVsWzBdLCB5OiBwaW4ueSAvIGN0LmRlbFsxXSB9O1xuICB2YXIgaW5keCA9IHsgeDogTWF0aC5mbG9vcih0LngpLCB5OiBNYXRoLmZsb29yKHQueSkgfTtcbiAgdmFyIGZyY3QgPSB7IHg6IHQueCAtIDEuMCAqIGluZHgueCwgeTogdC55IC0gMS4wICogaW5keC55IH07XG4gIHZhciB2YWwgPSB7IHg6IE51bWJlci5OYU4sIHk6IE51bWJlci5OYU4gfTtcbiAgdmFyIGlueDtcbiAgaWYgKGluZHgueCA8IDAgfHwgaW5keC54ID49IGN0LmxpbVswXSkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgaWYgKGluZHgueSA8IDAgfHwgaW5keC55ID49IGN0LmxpbVsxXSkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgaW54ID0gKGluZHgueSAqIGN0LmxpbVswXSkgKyBpbmR4Lng7XG4gIHZhciBmMDAgPSB7IHg6IGN0LmN2c1tpbnhdWzBdLCB5OiBjdC5jdnNbaW54XVsxXSB9O1xuICBpbngrKztcbiAgdmFyIGYxMCA9IHsgeDogY3QuY3ZzW2lueF1bMF0sIHk6IGN0LmN2c1tpbnhdWzFdIH07XG4gIGlueCArPSBjdC5saW1bMF07XG4gIHZhciBmMTEgPSB7IHg6IGN0LmN2c1tpbnhdWzBdLCB5OiBjdC5jdnNbaW54XVsxXSB9O1xuICBpbngtLTtcbiAgdmFyIGYwMSA9IHsgeDogY3QuY3ZzW2lueF1bMF0sIHk6IGN0LmN2c1tpbnhdWzFdIH07XG4gIHZhciBtMTEgPSBmcmN0LnggKiBmcmN0LnksIG0xMCA9IGZyY3QueCAqICgxLjAgLSBmcmN0LnkpLFxuICAgIG0wMCA9ICgxLjAgLSBmcmN0LngpICogKDEuMCAtIGZyY3QueSksIG0wMSA9ICgxLjAgLSBmcmN0LngpICogZnJjdC55O1xuICB2YWwueCA9IChtMDAgKiBmMDAueCArIG0xMCAqIGYxMC54ICsgbTAxICogZjAxLnggKyBtMTEgKiBmMTEueCk7XG4gIHZhbC55ID0gKG0wMCAqIGYwMC55ICsgbTEwICogZjEwLnkgKyBtMDEgKiBmMDEueSArIG0xMSAqIGYxMS55KTtcbiAgcmV0dXJuIHZhbDtcbn1cbiIsImltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCBwYXJzZVByb2ogZnJvbSAnLi9wcm9qU3RyaW5nJztcbmltcG9ydCB3a3QgZnJvbSAnd2t0LXBhcnNlcic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gUHJvamVjdGlvbkRlZmluaXRpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0aXRsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtwcm9qTmFtZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZWxscHNdXG4gKiBAcHJvcGVydHkge2ltcG9ydCgnLi9Qcm9qLmpzJykuRGF0dW1EZWZpbml0aW9ufSBbZGF0dW1dXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2RhdHVtTmFtZV1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbcmZdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xhdDBdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xhdDFdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xhdDJdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xhdF90c11cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbG9uZzBdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xvbmcxXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsb25nMl1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbYWxwaGFdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xvbmdjXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt4MF1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbeTBdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2swXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFthXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtiXVxuICogQHByb3BlcnR5IHt0cnVlfSBbUl9BXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt6b25lXVxuICogQHByb3BlcnR5IHt0cnVlfSBbdXRtU291dGhdXG4gKiBAcHJvcGVydHkge3N0cmluZ3xBcnJheTxudW1iZXI+fSBbZGF0dW1fcGFyYW1zXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0b19tZXRlcl1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdW5pdHNdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2Zyb21fZ3JlZW53aWNoXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkYXR1bUNvZGVdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hZGdyaWRzXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtheGlzXVxuICogQHByb3BlcnR5IHtib29sZWFufSBbc3BoZXJlXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtyZWN0aWZpZWRfZ3JpZF9hbmdsZV1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2FwcHJveF1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW292ZXJdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Byb2pTdHJdXG4gKiBAcHJvcGVydHkgezxUIGV4dGVuZHMgaW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzPihjb29yZGluYXRlczogVCwgZW5mb3JjZUF4aXM/OiBib29sZWFuKSA9PiBUfSBpbnZlcnNlXG4gKiBAcHJvcGVydHkgezxUIGV4dGVuZHMgaW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzPihjb29yZGluYXRlczogVCwgZW5mb3JjZUF4aXM/OiBib29sZWFuKSA9PiBUfSBmb3J3YXJkXG4gKi9cblxuLyoqXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge3N0cmluZ3xQcm9qZWN0aW9uRGVmaW5pdGlvbnxpbXBvcnQoJy4vY29yZS5qcycpLlBST0pKU09ORGVmaW5pdGlvbn0gcHJvamVjdGlvblxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbi8qKlxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge0FycmF5PFtzdHJpbmcsIHN0cmluZ10+fSBuYW1lXG4gKiBAcmV0dXJucyB7QXJyYXk8UHJvamVjdGlvbkRlZmluaXRpb258dW5kZWZpbmVkPn1cbiAqL1xuLyoqXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7UHJvamVjdGlvbkRlZmluaXRpb259XG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZyB8IEFycmF5PEFycmF5PHN0cmluZz4+IHwgUGFydGlhbDxSZWNvcmQ8J0VQU0cnfCdFU1JJJ3wnSUFVMjAwMCcsIFByb2plY3Rpb25EZWZpbml0aW9uPj59IG5hbWVcbiAqIEByZXR1cm5zIHtQcm9qZWN0aW9uRGVmaW5pdGlvbiB8IEFycmF5PFByb2plY3Rpb25EZWZpbml0aW9ufHVuZGVmaW5lZD4gfCB2b2lkfVxuICovXG5mdW5jdGlvbiBkZWZzKG5hbWUpIHtcbiAgLyogZ2xvYmFsIGNvbnNvbGUgKi9cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHZhciBkZWYgPSBhcmd1bWVudHNbMV07XG4gICAgaWYgKHR5cGVvZiBkZWYgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZGVmLmNoYXJBdCgwKSA9PT0gJysnKSB7XG4gICAgICAgIGRlZnNbLyoqIEB0eXBlIHtzdHJpbmd9ICovIChuYW1lKV0gPSBwYXJzZVByb2ooYXJndW1lbnRzWzFdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZnNbLyoqIEB0eXBlIHtzdHJpbmd9ICovIChuYW1lKV0gPSB3a3QoYXJndW1lbnRzWzFdKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRlZiAmJiB0eXBlb2YgZGVmID09PSAnb2JqZWN0JyAmJiAhKCdwcm9qTmFtZScgaW4gZGVmKSkge1xuICAgICAgLy8gUFJPSkpTT05cbiAgICAgIGRlZnNbLyoqIEB0eXBlIHtzdHJpbmd9ICovIChuYW1lKV0gPSB3a3QoYXJndW1lbnRzWzFdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmc1svKiogQHR5cGUge3N0cmluZ30gKi8gKG5hbWUpXSA9IGRlZjtcbiAgICAgIGlmICghZGVmKSB7XG4gICAgICAgIGRlbGV0ZSBkZWZzWy8qKiBAdHlwZSB7c3RyaW5nfSAqLyAobmFtZSldO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgICAgIHJldHVybiBkZWZzLmFwcGx5KHRoYXQsIHYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkZWZzKHYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKG5hbWUgaW4gZGVmcykge1xuICAgICAgICByZXR1cm4gZGVmc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCdFUFNHJyBpbiBuYW1lKSB7XG4gICAgICBkZWZzWydFUFNHOicgKyBuYW1lLkVQU0ddID0gbmFtZTtcbiAgICB9IGVsc2UgaWYgKCdFU1JJJyBpbiBuYW1lKSB7XG4gICAgICBkZWZzWydFU1JJOicgKyBuYW1lLkVTUkldID0gbmFtZTtcbiAgICB9IGVsc2UgaWYgKCdJQVUyMDAwJyBpbiBuYW1lKSB7XG4gICAgICBkZWZzWydJQVUyMDAwOicgKyBuYW1lLklBVTIwMDBdID0gbmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2cobmFtZSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxufVxuZ2xvYmFscyhkZWZzKTtcbmV4cG9ydCBkZWZhdWx0IGRlZnM7XG4iLCJpbXBvcnQgeyBTSVhUSCwgUkE0LCBSQTYsIEVQU0xOIH0gZnJvbSAnLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgRWxsaXBzb2lkIH0gZnJvbSAnLi9jb25zdGFudHMvRWxsaXBzb2lkJztcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJztcblxuY29uc3QgV0dTODQgPSBFbGxpcHNvaWQuV0dTODQ7IC8vIGRlZmF1bHQgZWxsaXBzb2lkXG5cbmV4cG9ydCBmdW5jdGlvbiBlY2NlbnRyaWNpdHkoYSwgYiwgcmYsIFJfQSkge1xuICB2YXIgYTIgPSBhICogYTsgLy8gdXNlZCBpbiBnZW9jZW50cmljXG4gIHZhciBiMiA9IGIgKiBiOyAvLyB1c2VkIGluIGdlb2NlbnRyaWNcbiAgdmFyIGVzID0gKGEyIC0gYjIpIC8gYTI7IC8vIGUgXiAyXG4gIHZhciBlID0gMDtcbiAgaWYgKFJfQSkge1xuICAgIGEgKj0gMSAtIGVzICogKFNJWFRIICsgZXMgKiAoUkE0ICsgZXMgKiBSQTYpKTtcbiAgICBhMiA9IGEgKiBhO1xuICAgIGVzID0gMDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5zcXJ0KGVzKTsgLy8gZWNjZW50cmljaXR5XG4gIH1cbiAgdmFyIGVwMiA9IChhMiAtIGIyKSAvIGIyOyAvLyB1c2VkIGluIGdlb2NlbnRyaWNcbiAgcmV0dXJuIHtcbiAgICBlczogZXMsXG4gICAgZTogZSxcbiAgICBlcDI6IGVwMlxuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNwaGVyZShhLCBiLCByZiwgZWxscHMsIHNwaGVyZSkge1xuICBpZiAoIWEpIHsgLy8gZG8gd2UgaGF2ZSBhbiBlbGxpcHNvaWQ/XG4gICAgdmFyIGVsbGlwc2UgPSBtYXRjaChFbGxpcHNvaWQsIGVsbHBzKTtcbiAgICBpZiAoIWVsbGlwc2UpIHtcbiAgICAgIGVsbGlwc2UgPSBXR1M4NDtcbiAgICB9XG4gICAgYSA9IGVsbGlwc2UuYTtcbiAgICBiID0gZWxsaXBzZS5iO1xuICAgIHJmID0gZWxsaXBzZS5yZjtcbiAgfVxuXG4gIGlmIChyZiAmJiAhYikge1xuICAgIGIgPSAoMS4wIC0gMS4wIC8gcmYpICogYTtcbiAgfVxuICBpZiAocmYgPT09IDAgfHwgTWF0aC5hYnMoYSAtIGIpIDwgRVBTTE4pIHtcbiAgICBzcGhlcmUgPSB0cnVlO1xuICAgIGIgPSBhO1xuICB9XG4gIHJldHVybiB7XG4gICAgYTogYSxcbiAgICBiOiBiLFxuICAgIHJmOiByZixcbiAgICBzcGhlcmU6IHNwaGVyZVxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbiB8fCB7fTtcbiAgdmFyIHZhbHVlLCBwcm9wZXJ0eTtcbiAgaWYgKCFzb3VyY2UpIHtcbiAgICByZXR1cm4gZGVzdGluYXRpb247XG4gIH1cbiAgZm9yIChwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcbiAgICB2YWx1ZSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlc3RpbmF0aW9uW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdGluYXRpb247XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZGVmcykge1xuICBkZWZzKCdFUFNHOjQzMjYnLCAnK3RpdGxlPVdHUyA4NCAobG9uZy9sYXQpICtwcm9qPWxvbmdsYXQgK2VsbHBzPVdHUzg0ICtkYXR1bT1XR1M4NCArdW5pdHM9ZGVncmVlcycpO1xuICBkZWZzKCdFUFNHOjQyNjknLCAnK3RpdGxlPU5BRDgzIChsb25nL2xhdCkgK3Byb2o9bG9uZ2xhdCArYT02Mzc4MTM3LjAgK2I9NjM1Njc1Mi4zMTQxNDAzNiArZWxscHM9R1JTODAgK2RhdHVtPU5BRDgzICt1bml0cz1kZWdyZWVzJyk7XG4gIGRlZnMoJ0VQU0c6Mzg1NycsICcrdGl0bGU9V0dTIDg0IC8gUHNldWRvLU1lcmNhdG9yICtwcm9qPW1lcmMgK2E9NjM3ODEzNyArYj02Mzc4MTM3ICtsYXRfdHM9MC4wICtsb25fMD0wLjAgK3hfMD0wLjAgK3lfMD0wICtrPTEuMCArdW5pdHM9bSArbmFkZ3JpZHM9QG51bGwgK25vX2RlZnMnKTtcbiAgLy8gVVRNIFdHUzg0XG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IDYwOyArK2kpIHtcbiAgICBkZWZzKCdFUFNHOicgKyAoMzI2MDAgKyBpKSwgJytwcm9qPXV0bSArem9uZT0nICsgaSArICcgK2RhdHVtPVdHUzg0ICt1bml0cz1tJyk7XG4gICAgZGVmcygnRVBTRzonICsgKDMyNzAwICsgaSksICcrcHJvaj11dG0gK3pvbmU9JyArIGkgKyAnICtzb3V0aCArZGF0dW09V0dTODQgK3VuaXRzPW0nKTtcbiAgfVxuICBkZWZzKCdFUFNHOjUwNDEnLCAnK3RpdGxlPVdHUyA4NCAvIFVQUyBOb3J0aCAoRSxOKSArcHJvaj1zdGVyZSArbGF0XzA9OTAgK2xvbl8wPTAgK2s9MC45OTQgK3hfMD0yMDAwMDAwICt5XzA9MjAwMDAwMCArZGF0dW09V0dTODQgK3VuaXRzPW0nKTtcbiAgZGVmcygnRVBTRzo1MDQyJywgJyt0aXRsZT1XR1MgODQgLyBVUFMgU291dGggKEUsTikgK3Byb2o9c3RlcmUgK2xhdF8wPS05MCArbG9uXzA9MCAraz0wLjk5NCAreF8wPTIwMDAwMDAgK3lfMD0yMDAwMDAwICtkYXR1bT1XR1M4NCArdW5pdHM9bScpO1xuXG4gIGRlZnMuV0dTODQgPSBkZWZzWydFUFNHOjQzMjYnXTtcbiAgZGVmc1snRVBTRzozNzg1J10gPSBkZWZzWydFUFNHOjM4NTcnXTsgLy8gbWFpbnRhaW4gYmFja3dhcmQgY29tcGF0LCBvZmZpY2lhbCBjb2RlIGlzIDM4NTdcbiAgZGVmcy5HT09HTEUgPSBkZWZzWydFUFNHOjM4NTcnXTtcbiAgZGVmc1snRVBTRzo5MDA5MTMnXSA9IGRlZnNbJ0VQU0c6Mzg1NyddO1xuICBkZWZzWydFUFNHOjEwMjExMyddID0gZGVmc1snRVBTRzozODU3J107XG59XG4iLCJpbXBvcnQgY29yZSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0IFByb2ogZnJvbSAnLi9Qcm9qJztcbmltcG9ydCBQb2ludCBmcm9tICcuL1BvaW50JztcbmltcG9ydCBjb21tb24gZnJvbSAnLi9jb21tb24vdG9Qb2ludCc7XG5pbXBvcnQgZGVmcyBmcm9tICcuL2RlZnMnO1xuaW1wb3J0IG5hZGdyaWQgZnJvbSAnLi9uYWRncmlkJztcbmltcG9ydCB0cmFuc2Zvcm0gZnJvbSAnLi90cmFuc2Zvcm0nO1xuaW1wb3J0IG1ncnMgZnJvbSAnbWdycyc7XG5pbXBvcnQgaW5jbHVkZWRQcm9qZWN0aW9ucyBmcm9tICcuLi9wcm9qcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTWdyc1xuICogQHByb3BlcnR5IHsobG9ubGF0OiBbbnVtYmVyLCBudW1iZXJdKSA9PiBzdHJpbmd9IGZvcndhcmRcbiAqIEBwcm9wZXJ0eSB7KG1ncnNTdHJpbmc6IHN0cmluZykgPT4gW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl19IGludmVyc2VcbiAqIEBwcm9wZXJ0eSB7KG1ncnNTdHJpbmc6IHN0cmluZykgPT4gW251bWJlciwgbnVtYmVyXX0gdG9Qb2ludFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259IFByb2plY3Rpb25EZWZpbml0aW9uXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzfSBUZW1wbGF0ZUNvb3JkaW5hdGVzXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2NvcmUnKS5JbnRlcmZhY2VDb29yZGluYXRlc30gSW50ZXJmYWNlQ29vcmRpbmF0ZXNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vY29yZScpLkNvbnZlcnRlcn0gQ29udmVydGVyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL1Byb2onKS5EYXR1bURlZmluaXRpb259IERhdHVtRGVmaW5pdGlvblxuICovXG5cbi8qKlxuICogQHRlbXBsYXRlIHtpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXN9IFRcbiAqIEB0eXBlIHtjb3JlPFQ+ICYge2RlZmF1bHREYXR1bTogc3RyaW5nLCBQcm9qOiB0eXBlb2YgUHJvaiwgV0dTODQ6IFByb2osIFBvaW50OiB0eXBlb2YgUG9pbnQsIHRvUG9pbnQ6IHR5cGVvZiBjb21tb24sIGRlZnM6IHR5cGVvZiBkZWZzLCBuYWRncmlkOiB0eXBlb2YgbmFkZ3JpZCwgdHJhbnNmb3JtOiB0eXBlb2YgdHJhbnNmb3JtLCBtZ3JzOiBNZ3JzLCB2ZXJzaW9uOiBzdHJpbmd9fVxuICovXG5jb25zdCBwcm9qNCA9IE9iamVjdC5hc3NpZ24oY29yZSwge1xuICBkZWZhdWx0RGF0dW06ICdXR1M4NCcsXG4gIFByb2osXG4gIFdHUzg0OiBuZXcgUHJvaignV0dTODQnKSxcbiAgUG9pbnQsXG4gIHRvUG9pbnQ6IGNvbW1vbixcbiAgZGVmcyxcbiAgbmFkZ3JpZCxcbiAgdHJhbnNmb3JtLFxuICBtZ3JzLFxuICB2ZXJzaW9uOiAnX19WRVJTSU9OX18nXG59KTtcbmluY2x1ZGVkUHJvamVjdGlvbnMocHJvajQpO1xuZXhwb3J0IGRlZmF1bHQgcHJvajQ7XG4iLCJ2YXIgaWdub3JlZENoYXIgPSAvW1xcc19cXC1cXC9cXChcXCldL2c7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaChvYmosIGtleSkge1xuICBpZiAob2JqW2tleV0pIHtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICB2YXIgbGtleSA9IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoaWdub3JlZENoYXIsICcnKTtcbiAgdmFyIGkgPSAtMTtcbiAgdmFyIHRlc3RrZXksIHByb2Nlc3NlZEtleTtcbiAgd2hpbGUgKCsraSA8IGtleXMubGVuZ3RoKSB7XG4gICAgdGVzdGtleSA9IGtleXNbaV07XG4gICAgcHJvY2Vzc2VkS2V5ID0gdGVzdGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoaWdub3JlZENoYXIsICcnKTtcbiAgICBpZiAocHJvY2Vzc2VkS2V5ID09PSBsa2V5KSB7XG4gICAgICByZXR1cm4gb2JqW3Rlc3RrZXldO1xuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBSZXNvdXJjZXMgZm9yIGRldGFpbHMgb2YgTlR2MiBmaWxlIGZvcm1hdHM6XG4gKiAtIGh0dHBzOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDE0MDEyNzIwNDgyMmlmXy9odHRwOi8vd3d3Lm1ncy5nb3Yub24uY2E6ODAvc3RkcHJvZGNvbnN1bWUvZ3JvdXBzL2NvbnRlbnQvQG1ncy9AaWFuZGl0L2RvY3VtZW50cy9yZXNvdXJjZWxpc3Qvc3RlbDAyXzA0NzQ0Ny5wZGZcbiAqIC0gaHR0cDovL21pbWFrYS5jb20vaGVscC9ncy9odG1sLzAwNF9OVFYyJTIwRGF0YSUyMEZvcm1hdC5odG1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE5hZGdyaWRJbmZvXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgTkFEIGdyaWQgb3IgJ251bGwnIGlmIG5vdCBzcGVjaWZpZWQuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG1hbmRhdG9yeSBJbmRpY2F0ZXMgaWYgdGhlIGdyaWQgaXMgbWFuZGF0b3J5ICh0cnVlKSBvciBvcHRpb25hbCAoZmFsc2UpLlxuICogQHByb3BlcnR5IHsqfSBncmlkIFRoZSBsb2FkZWQgTkFEIGdyaWQgb2JqZWN0LCBvciBudWxsIGlmIG5vdCBsb2FkZWQgb3Igbm90IGFwcGxpY2FibGUuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzTnVsbCBUcnVlIGlmIHRoZSBncmlkIGlzIGV4cGxpY2l0bHkgJ251bGwnLCBvdGhlcndpc2UgZmFsc2UuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBOVFYyR3JpZE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2luY2x1ZGVFcnJvckZpZWxkcz10cnVlXSBXaGV0aGVyIHRvIGluY2x1ZGUgZXJyb3IgZmllbGRzIGluIHRoZSBzdWJncmlkcy5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE5hZGdyaWRIZWFkZXJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbkZpZWxkc10gTnVtYmVyIG9mIGZpZWxkcyBpbiB0aGUgaGVhZGVyLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtuU3ViZ3JpZEZpZWxkc10gTnVtYmVyIG9mIGZpZWxkcyBpbiBlYWNoIHN1YmdyaWQgaGVhZGVyLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5TdWJncmlkcyBOdW1iZXIgb2Ygc3ViZ3JpZHMgaW4gdGhlIGZpbGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3NoaWZ0VHlwZV0gVHlwZSBvZiBzaGlmdCAoZS5nLiwgXCJTRUNPTkRTXCIpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtmcm9tU2VtaU1ham9yQXhpc10gU291cmNlIGVsbGlwc29pZCBzZW1pLW1ham9yIGF4aXMuXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2Zyb21TZW1pTWlub3JBeGlzXSBTb3VyY2UgZWxsaXBzb2lkIHNlbWktbWlub3IgYXhpcy5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbdG9TZW1pTWFqb3JBeGlzXSBUYXJnZXQgZWxsaXBzb2lkIHNlbWktbWFqb3IgYXhpcy5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbdG9TZW1pTWlub3JBeGlzXSBUYXJnZXQgZWxsaXBzb2lkIHNlbWktbWlub3IgYXhpcy5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN1YmdyaWRcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gbGwgTG93ZXIgbGVmdCBjb3JuZXIgb2YgdGhlIGdyaWQgaW4gcmFkaWFucyBbbG9uZ2l0dWRlLCBsYXRpdHVkZV0uXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGRlbCBHcmlkIHNwYWNpbmcgaW4gcmFkaWFucyBbbG9uZ2l0dWRlIGludGVydmFsLCBsYXRpdHVkZSBpbnRlcnZhbF0uXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGxpbSBOdW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgZ3JpZCBbbG9uZ2l0dWRlIGNvbHVtbnMsIGxhdGl0dWRlIGNvbHVtbnNdLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtjb3VudF0gVG90YWwgbnVtYmVyIG9mIGdyaWQgbm9kZXMuXG4gKiBAcHJvcGVydHkge0FycmF5fSBjdnMgTWFwcGVkIG5vZGUgdmFsdWVzIGZvciB0aGUgZ3JpZC5cbiAqL1xuXG4vKiogQHR5cGVkZWYge3toZWFkZXI6IE5hZGdyaWRIZWFkZXIsIHN1YmdyaWRzOiBBcnJheTxTdWJncmlkPn19IE5BREdyaWQgKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBHZW9USUZGXG4gKiBAcHJvcGVydHkgeygpID0+IFByb21pc2U8bnVtYmVyPn0gZ2V0SW1hZ2VDb3VudCAtIFJldHVybnMgdGhlIG51bWJlciBvZiBpbWFnZXMgaW4gdGhlIEdlb1RJRkYuXG4gKiBAcHJvcGVydHkgeyhpbmRleDogbnVtYmVyKSA9PiBQcm9taXNlPEdlb1RJRkZJbWFnZT59IGdldEltYWdlIC0gUmV0dXJucyBhIEdlb1RJRkZJbWFnZSBmb3IgdGhlIGdpdmVuIGluZGV4LlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gR2VvVElGRkltYWdlXG4gKiBAcHJvcGVydHkgeygpID0+IG51bWJlcn0gZ2V0V2lkdGggLSBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgaW1hZ2UuXG4gKiBAcHJvcGVydHkgeygpID0+IG51bWJlcn0gZ2V0SGVpZ2h0IC0gUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSBpbWFnZS5cbiAqIEBwcm9wZXJ0eSB7KCkgPT4gbnVtYmVyW119IGdldEJvdW5kaW5nQm94IC0gUmV0dXJucyB0aGUgYm91bmRpbmcgYm94IGFzIFttaW5YLCBtaW5ZLCBtYXhYLCBtYXhZXSBpbiBkZWdyZWVzLlxuICogQHByb3BlcnR5IHsoKSA9PiBQcm9taXNlPEFycmF5TGlrZTxBcnJheUxpa2U8bnVtYmVyPj4+fSByZWFkUmFzdGVycyAtIFJldHVybnMgdGhlIHJhc3RlciBkYXRhIGFzIGFuIGFycmF5IG9mIGJhbmRzLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGZpbGVEaXJlY3RvcnkgLSBUaGUgZmlsZSBkaXJlY3Rvcnkgb2JqZWN0IGNvbnRhaW5pbmcgbWV0YWRhdGEuXG4gKiBAcHJvcGVydHkge09iamVjdH0gZmlsZURpcmVjdG9yeS5Nb2RlbFBpeGVsU2NhbGUgLSBUaGUgcGl4ZWwgc2NhbGUgYXJyYXkgW3NjYWxlWCwgc2NhbGVZLCBzY2FsZVpdIGluIGRlZ3JlZXMuXG4gKi9cblxudmFyIGxvYWRlZE5hZGdyaWRzID0ge307XG5cbi8qKlxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgbG9hZGVkIGdyaWQuXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBkYXRhIC0gVGhlIE5UdjIgZ3JpZCBkYXRhIGFzIGFuIEFycmF5QnVmZmVyLlxuICogQHBhcmFtIHtOVFYyR3JpZE9wdGlvbnN9IFtvcHRpb25zXSAtIE9wdGlvbmFsIHBhcmFtZXRlcnMgZm9yIGxvYWRpbmcgdGhlIGdyaWQuXG4gKiBAcmV0dXJucyB7TkFER3JpZH0gLSBUaGUgbG9hZGVkIE5BRCBncmlkIGluZm9ybWF0aW9uLlxuICovXG4vKipcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGxvYWRlZCBncmlkLlxuICogQHBhcmFtIHtHZW9USUZGfSBkYXRhIC0gVGhlIEdlb1RJRkYgaW5zdGFuY2UgdG8gcmVhZCB0aGUgZ3JpZCBmcm9tLlxuICogQHJldHVybnMge3tyZWFkeTogUHJvbWlzZTxOQURHcmlkPn19IC0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGxvYWRlZCBncmlkIGluZm9ybWF0aW9uLlxuICovXG4vKipcbiAqIExvYWQgZWl0aGVyIGEgTlR2MiBmaWxlICguZ3NiKSBvciBhIEdlb3RpZmYgKC50aWYpIHRvIGEga2V5IHRoYXQgY2FuIGJlIHVzZWQgaW4gYSBwcm9qIHN0cmluZyBsaWtlICtuYWRncmlkcz08a2V5Pi4gUGFzcyB0aGUgTlR2MiBmaWxlXG4gKiBhcyBhbiBBcnJheUJ1ZmZlci4gUGFzcyBHZW90aWZmIGFzIGEgR2VvVElGRiBpbnN0YW5jZSBmcm9tIHRoZSBnZW90aWZmLmpzIGxpYnJhcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgbG9hZGVkIGdyaWQuXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfEdlb1RJRkZ9IGRhdGEgVGhlIGRhdGEgdG8gbG9hZCwgZWl0aGVyIGFuIEFycmF5QnVmZmVyIGZvciBOVHYyIG9yIGEgR2VvVElGRiBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7TlRWMkdyaWRPcHRpb25zfSBbb3B0aW9uc10gT3B0aW9uYWwgcGFyYW1ldGVycy5cbiAqIEByZXR1cm5zIHt7cmVhZHk6IFByb21pc2U8TkFER3JpZD59fE5BREdyaWR9IC0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGxvYWRlZCBncmlkIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBuYWRncmlkKGtleSwgZGF0YSwgb3B0aW9ucykge1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHJlYWROVFYyR3JpZChrZXksIGRhdGEsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiB7IHJlYWR5OiByZWFkR2VvdGlmZkdyaWQoa2V5LCBkYXRhKSB9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgbG9hZGVkIGdyaWQuXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBkYXRhIFRoZSBOVHYyIGdyaWQgZGF0YSBhcyBhbiBBcnJheUJ1ZmZlci5cbiAqIEBwYXJhbSB7TlRWMkdyaWRPcHRpb25zfSBbb3B0aW9uc10gT3B0aW9uYWwgcGFyYW1ldGVycyBmb3IgbG9hZGluZyB0aGUgZ3JpZC5cbiAqIEByZXR1cm5zIHtOQURHcmlkfSBUaGUgbG9hZGVkIE5BRCBncmlkIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiByZWFkTlRWMkdyaWQoa2V5LCBkYXRhLCBvcHRpb25zKSB7XG4gIHZhciBpbmNsdWRlRXJyb3JGaWVsZHMgPSB0cnVlO1xuICBpZiAob3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuaW5jbHVkZUVycm9yRmllbGRzID09PSBmYWxzZSkge1xuICAgIGluY2x1ZGVFcnJvckZpZWxkcyA9IGZhbHNlO1xuICB9XG4gIHZhciB2aWV3ID0gbmV3IERhdGFWaWV3KGRhdGEpO1xuICB2YXIgaXNMaXR0bGVFbmRpYW4gPSBkZXRlY3RMaXR0bGVFbmRpYW4odmlldyk7XG4gIHZhciBoZWFkZXIgPSByZWFkSGVhZGVyKHZpZXcsIGlzTGl0dGxlRW5kaWFuKTtcbiAgdmFyIHN1YmdyaWRzID0gcmVhZFN1YmdyaWRzKHZpZXcsIGhlYWRlciwgaXNMaXR0bGVFbmRpYW4sIGluY2x1ZGVFcnJvckZpZWxkcyk7XG4gIHZhciBuYWRncmlkID0geyBoZWFkZXI6IGhlYWRlciwgc3ViZ3JpZHM6IHN1YmdyaWRzIH07XG4gIGxvYWRlZE5hZGdyaWRzW2tleV0gPSBuYWRncmlkO1xuICByZXR1cm4gbmFkZ3JpZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGxvYWRlZCBncmlkLlxuICogQHBhcmFtIHtHZW9USUZGfSB0aWZmIFRoZSBHZW9USUZGIGluc3RhbmNlIHRvIHJlYWQgdGhlIGdyaWQgZnJvbS5cbiAqIEByZXR1cm5zIHtQcm9taXNlPE5BREdyaWQ+fSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbG9hZGVkIE5BRCBncmlkIGluZm9ybWF0aW9uLlxuICovXG5hc3luYyBmdW5jdGlvbiByZWFkR2VvdGlmZkdyaWQoa2V5LCB0aWZmKSB7XG4gIHZhciBzdWJncmlkcyA9IFtdO1xuICB2YXIgc3ViR3JpZENvdW50ID0gYXdhaXQgdGlmZi5nZXRJbWFnZUNvdW50KCk7XG4gIC8vIHByb2ogcHJvZHVjZWQgdGlmZiBncmlkIHNoaWZ0IGZpbGVzIGFwcGVhciB0byBvcmdhbml6ZSBsb3dlciByZXMgc3ViZ3JpZHMgZmlyc3QsIGhpZ2hlciByZXMvIGNoaWxkIHN1YmdyaWRzIGxhc3QuXG4gIGZvciAodmFyIHN1YmdyaWRJbmRleCA9IHN1YkdyaWRDb3VudCAtIDE7IHN1YmdyaWRJbmRleCA+PSAwOyBzdWJncmlkSW5kZXgtLSkge1xuICAgIHZhciBpbWFnZSA9IGF3YWl0IHRpZmYuZ2V0SW1hZ2Uoc3ViZ3JpZEluZGV4KTtcblxuICAgIHZhciByYXN0ZXJzID0gYXdhaXQgaW1hZ2UucmVhZFJhc3RlcnMoKTtcbiAgICB2YXIgZGF0YSA9IHJhc3RlcnM7XG4gICAgdmFyIGxpbSA9IFtpbWFnZS5nZXRXaWR0aCgpLCBpbWFnZS5nZXRIZWlnaHQoKV07XG4gICAgdmFyIGltYWdlQkJveFJhZGlhbnMgPSBpbWFnZS5nZXRCb3VuZGluZ0JveCgpLm1hcChkZWdyZWVzVG9SYWRpYW5zKTtcbiAgICB2YXIgZGVsID0gW2ltYWdlLmZpbGVEaXJlY3RvcnkuTW9kZWxQaXhlbFNjYWxlWzBdLCBpbWFnZS5maWxlRGlyZWN0b3J5Lk1vZGVsUGl4ZWxTY2FsZVsxXV0ubWFwKGRlZ3JlZXNUb1JhZGlhbnMpO1xuXG4gICAgdmFyIG1heFggPSBpbWFnZUJCb3hSYWRpYW5zWzBdICsgKGxpbVswXSAtIDEpICogZGVsWzBdO1xuICAgIHZhciBtaW5ZID0gaW1hZ2VCQm94UmFkaWFuc1szXSAtIChsaW1bMV0gLSAxKSAqIGRlbFsxXTtcblxuICAgIHZhciBsYXRpdHVkZU9mZnNldEJhbmQgPSBkYXRhWzBdO1xuICAgIHZhciBsb25naXR1ZGVPZmZzZXRCYW5kID0gZGF0YVsxXTtcbiAgICB2YXIgbm9kZXMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSBsaW1bMV0gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgZm9yIChsZXQgaiA9IGxpbVswXSAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGkgKiBsaW1bMF0gKyBqO1xuICAgICAgICBub2Rlcy5wdXNoKFstc2Vjb25kc1RvUmFkaWFucyhsb25naXR1ZGVPZmZzZXRCYW5kW2luZGV4XSksIHNlY29uZHNUb1JhZGlhbnMobGF0aXR1ZGVPZmZzZXRCYW5kW2luZGV4XSldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdWJncmlkcy5wdXNoKHtcbiAgICAgIGRlbDogZGVsLFxuICAgICAgbGltOiBsaW0sXG4gICAgICBsbDogWy1tYXhYLCBtaW5ZXSxcbiAgICAgIGN2czogbm9kZXNcbiAgICB9KTtcbiAgfVxuXG4gIHZhciB0aWZHcmlkID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgblN1YmdyaWRzOiBzdWJHcmlkQ291bnRcbiAgICB9LFxuICAgIHN1YmdyaWRzOiBzdWJncmlkc1xuICB9O1xuICBsb2FkZWROYWRncmlkc1trZXldID0gdGlmR3JpZDtcbiAgcmV0dXJuIHRpZkdyaWQ7XG59O1xuXG4vKipcbiAqIEdpdmVuIGEgcHJvajQgdmFsdWUgZm9yIG5hZGdyaWRzLCByZXR1cm4gYW4gYXJyYXkgb2YgbG9hZGVkIGdyaWRzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFkZ3JpZHMgQSBjb21tYS1zZXBhcmF0ZWQgbGlzdCBvZiBncmlkIG5hbWVzLCBvcHRpb25hbGx5IHByZWZpeGVkIHdpdGggJ0AnIHRvIGluZGljYXRlIG9wdGlvbmFsIGdyaWRzLlxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5hZGdyaWRzKG5hZGdyaWRzKSB7XG4gIC8vIEZvcm1hdCBkZXRhaWxzOiBodHRwOi8vcHJvai5tYXB0b29scy5vcmcvZ2VuX3Bhcm1zLmh0bWxcbiAgaWYgKG5hZGdyaWRzID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgZ3JpZHMgPSBuYWRncmlkcy5zcGxpdCgnLCcpO1xuICByZXR1cm4gZ3JpZHMubWFwKHBhcnNlTmFkZ3JpZFN0cmluZyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuYWRncmlkIHN0cmluZyB0byBnZXQgaW5mb3JtYXRpb24gZm9yLlxuICogQHJldHVybnMge05hZGdyaWRJbmZvfG51bGx9IEFuIG9iamVjdCB3aXRoIGdyaWQgaW5mb3JtYXRpb24sIG9yIG51bGwgaWYgdGhlIGlucHV0IGlzIGVtcHR5LlxuICovXG5mdW5jdGlvbiBwYXJzZU5hZGdyaWRTdHJpbmcodmFsdWUpIHtcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBvcHRpb25hbCA9IHZhbHVlWzBdID09PSAnQCc7XG4gIGlmIChvcHRpb25hbCkge1xuICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSk7XG4gIH1cbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpIHtcbiAgICByZXR1cm4geyBuYW1lOiAnbnVsbCcsIG1hbmRhdG9yeTogIW9wdGlvbmFsLCBncmlkOiBudWxsLCBpc051bGw6IHRydWUgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWU6IHZhbHVlLFxuICAgIG1hbmRhdG9yeTogIW9wdGlvbmFsLFxuICAgIGdyaWQ6IGxvYWRlZE5hZGdyaWRzW3ZhbHVlXSB8fCBudWxsLFxuICAgIGlzTnVsbDogZmFsc2VcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzKSB7XG4gIHJldHVybiAoZGVncmVlcykgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG5mdW5jdGlvbiBzZWNvbmRzVG9SYWRpYW5zKHNlY29uZHMpIHtcbiAgcmV0dXJuIChzZWNvbmRzIC8gMzYwMCkgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG5mdW5jdGlvbiBkZXRlY3RMaXR0bGVFbmRpYW4odmlldykge1xuICB2YXIgbkZpZWxkcyA9IHZpZXcuZ2V0SW50MzIoOCwgZmFsc2UpO1xuICBpZiAobkZpZWxkcyA9PT0gMTEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgbkZpZWxkcyA9IHZpZXcuZ2V0SW50MzIoOCwgdHJ1ZSk7XG4gIGlmIChuRmllbGRzICE9PSAxMSkge1xuICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGRldGVjdCBuYWRncmlkIGVuZGlhbi1uZXNzLCBkZWZhdWx0aW5nIHRvIGxpdHRsZS1lbmRpYW4nKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVhZEhlYWRlcih2aWV3LCBpc0xpdHRsZUVuZGlhbikge1xuICByZXR1cm4ge1xuICAgIG5GaWVsZHM6IHZpZXcuZ2V0SW50MzIoOCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIG5TdWJncmlkRmllbGRzOiB2aWV3LmdldEludDMyKDI0LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgblN1YmdyaWRzOiB2aWV3LmdldEludDMyKDQwLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgc2hpZnRUeXBlOiBkZWNvZGVTdHJpbmcodmlldywgNTYsIDU2ICsgOCkudHJpbSgpLFxuICAgIGZyb21TZW1pTWFqb3JBeGlzOiB2aWV3LmdldEZsb2F0NjQoMTIwLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgZnJvbVNlbWlNaW5vckF4aXM6IHZpZXcuZ2V0RmxvYXQ2NCgxMzYsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICB0b1NlbWlNYWpvckF4aXM6IHZpZXcuZ2V0RmxvYXQ2NCgxNTIsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICB0b1NlbWlNaW5vckF4aXM6IHZpZXcuZ2V0RmxvYXQ2NCgxNjgsIGlzTGl0dGxlRW5kaWFuKVxuICB9O1xufVxuXG5mdW5jdGlvbiBkZWNvZGVTdHJpbmcodmlldywgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDhBcnJheSh2aWV3LmJ1ZmZlci5zbGljZShzdGFydCwgZW5kKSkpO1xufVxuXG5mdW5jdGlvbiByZWFkU3ViZ3JpZHModmlldywgaGVhZGVyLCBpc0xpdHRsZUVuZGlhbiwgaW5jbHVkZUVycm9yRmllbGRzKSB7XG4gIHZhciBncmlkT2Zmc2V0ID0gMTc2O1xuICB2YXIgZ3JpZHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWFkZXIublN1YmdyaWRzOyBpKyspIHtcbiAgICB2YXIgc3ViSGVhZGVyID0gcmVhZEdyaWRIZWFkZXIodmlldywgZ3JpZE9mZnNldCwgaXNMaXR0bGVFbmRpYW4pO1xuICAgIHZhciBub2RlcyA9IHJlYWRHcmlkTm9kZXModmlldywgZ3JpZE9mZnNldCwgc3ViSGVhZGVyLCBpc0xpdHRsZUVuZGlhbiwgaW5jbHVkZUVycm9yRmllbGRzKTtcbiAgICB2YXIgbG5nQ29sdW1uQ291bnQgPSBNYXRoLnJvdW5kKFxuICAgICAgMSArIChzdWJIZWFkZXIudXBwZXJMb25naXR1ZGUgLSBzdWJIZWFkZXIubG93ZXJMb25naXR1ZGUpIC8gc3ViSGVhZGVyLmxvbmdpdHVkZUludGVydmFsKTtcbiAgICB2YXIgbGF0Q29sdW1uQ291bnQgPSBNYXRoLnJvdW5kKFxuICAgICAgMSArIChzdWJIZWFkZXIudXBwZXJMYXRpdHVkZSAtIHN1YkhlYWRlci5sb3dlckxhdGl0dWRlKSAvIHN1YkhlYWRlci5sYXRpdHVkZUludGVydmFsKTtcbiAgICAvLyBQcm9qNCBvcGVyYXRlcyBvbiByYWRpYW5zIHdoZXJlYXMgdGhlIGNvb3JkaW5hdGVzIGFyZSBpbiBzZWNvbmRzIGluIHRoZSBncmlkXG4gICAgZ3JpZHMucHVzaCh7XG4gICAgICBsbDogW3NlY29uZHNUb1JhZGlhbnMoc3ViSGVhZGVyLmxvd2VyTG9uZ2l0dWRlKSwgc2Vjb25kc1RvUmFkaWFucyhzdWJIZWFkZXIubG93ZXJMYXRpdHVkZSldLFxuICAgICAgZGVsOiBbc2Vjb25kc1RvUmFkaWFucyhzdWJIZWFkZXIubG9uZ2l0dWRlSW50ZXJ2YWwpLCBzZWNvbmRzVG9SYWRpYW5zKHN1YkhlYWRlci5sYXRpdHVkZUludGVydmFsKV0sXG4gICAgICBsaW06IFtsbmdDb2x1bW5Db3VudCwgbGF0Q29sdW1uQ291bnRdLFxuICAgICAgY291bnQ6IHN1YkhlYWRlci5ncmlkTm9kZUNvdW50LFxuICAgICAgY3ZzOiBtYXBOb2Rlcyhub2RlcylcbiAgICB9KTtcbiAgICB2YXIgcm93U2l6ZSA9IDE2O1xuICAgIGlmIChpbmNsdWRlRXJyb3JGaWVsZHMgPT09IGZhbHNlKSB7XG4gICAgICByb3dTaXplID0gODtcbiAgICB9XG4gICAgZ3JpZE9mZnNldCArPSAxNzYgKyBzdWJIZWFkZXIuZ3JpZE5vZGVDb3VudCAqIHJvd1NpemU7XG4gIH1cbiAgcmV0dXJuIGdyaWRzO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Kn0gbm9kZXNcbiAqIEByZXR1cm5zIEFycmF5PEFycmF5PG51bWJlcj4+XG4gKi9cbmZ1bmN0aW9uIG1hcE5vZGVzKG5vZGVzKSB7XG4gIHJldHVybiBub2Rlcy5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICByZXR1cm4gW3NlY29uZHNUb1JhZGlhbnMoci5sb25naXR1ZGVTaGlmdCksIHNlY29uZHNUb1JhZGlhbnMoci5sYXRpdHVkZVNoaWZ0KV07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZWFkR3JpZEhlYWRlcih2aWV3LCBvZmZzZXQsIGlzTGl0dGxlRW5kaWFuKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogZGVjb2RlU3RyaW5nKHZpZXcsIG9mZnNldCArIDgsIG9mZnNldCArIDE2KS50cmltKCksXG4gICAgcGFyZW50OiBkZWNvZGVTdHJpbmcodmlldywgb2Zmc2V0ICsgMjQsIG9mZnNldCArIDI0ICsgOCkudHJpbSgpLFxuICAgIGxvd2VyTGF0aXR1ZGU6IHZpZXcuZ2V0RmxvYXQ2NChvZmZzZXQgKyA3MiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHVwcGVyTGF0aXR1ZGU6IHZpZXcuZ2V0RmxvYXQ2NChvZmZzZXQgKyA4OCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIGxvd2VyTG9uZ2l0dWRlOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgMTA0LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgdXBwZXJMb25naXR1ZGU6IHZpZXcuZ2V0RmxvYXQ2NChvZmZzZXQgKyAxMjAsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBsYXRpdHVkZUludGVydmFsOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgMTM2LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgbG9uZ2l0dWRlSW50ZXJ2YWw6IHZpZXcuZ2V0RmxvYXQ2NChvZmZzZXQgKyAxNTIsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBncmlkTm9kZUNvdW50OiB2aWV3LmdldEludDMyKG9mZnNldCArIDE2OCwgaXNMaXR0bGVFbmRpYW4pXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlYWRHcmlkTm9kZXModmlldywgb2Zmc2V0LCBncmlkSGVhZGVyLCBpc0xpdHRsZUVuZGlhbiwgaW5jbHVkZUVycm9yRmllbGRzKSB7XG4gIHZhciBub2Rlc09mZnNldCA9IG9mZnNldCArIDE3NjtcbiAgdmFyIGdyaWRSZWNvcmRMZW5ndGggPSAxNjtcblxuICBpZiAoaW5jbHVkZUVycm9yRmllbGRzID09PSBmYWxzZSkge1xuICAgIGdyaWRSZWNvcmRMZW5ndGggPSA4O1xuICB9XG5cbiAgdmFyIGdyaWRTaGlmdFJlY29yZHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBncmlkSGVhZGVyLmdyaWROb2RlQ291bnQ7IGkrKykge1xuICAgIHZhciByZWNvcmQgPSB7XG4gICAgICBsYXRpdHVkZVNoaWZ0OiB2aWV3LmdldEZsb2F0MzIobm9kZXNPZmZzZXQgKyBpICogZ3JpZFJlY29yZExlbmd0aCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgICAgbG9uZ2l0dWRlU2hpZnQ6IHZpZXcuZ2V0RmxvYXQzMihub2Rlc09mZnNldCArIGkgKiBncmlkUmVjb3JkTGVuZ3RoICsgNCwgaXNMaXR0bGVFbmRpYW4pXG5cbiAgICB9O1xuXG4gICAgaWYgKGluY2x1ZGVFcnJvckZpZWxkcyAhPT0gZmFsc2UpIHtcbiAgICAgIHJlY29yZC5sYXRpdHVkZUFjY3VyYWN5ID0gdmlldy5nZXRGbG9hdDMyKG5vZGVzT2Zmc2V0ICsgaSAqIGdyaWRSZWNvcmRMZW5ndGggKyA4LCBpc0xpdHRsZUVuZGlhbik7XG4gICAgICByZWNvcmQubG9uZ2l0dWRlQWNjdXJhY3kgPSB2aWV3LmdldEZsb2F0MzIobm9kZXNPZmZzZXQgKyBpICogZ3JpZFJlY29yZExlbmd0aCArIDEyLCBpc0xpdHRsZUVuZGlhbik7XG4gICAgfVxuXG4gICAgZ3JpZFNoaWZ0UmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gIH1cbiAgcmV0dXJuIGdyaWRTaGlmdFJlY29yZHM7XG59XG4iLCJpbXBvcnQgZGVmcyBmcm9tICcuL2RlZnMnO1xuaW1wb3J0IHdrdCBmcm9tICd3a3QtcGFyc2VyJztcbmltcG9ydCBwcm9qU3RyIGZyb20gJy4vcHJvalN0cmluZyc7XG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCc7XG5mdW5jdGlvbiB0ZXN0T2JqKGNvZGUpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb2RlID09PSAnc3RyaW5nJztcbn1cbmZ1bmN0aW9uIHRlc3REZWYoY29kZSkge1xuICByZXR1cm4gY29kZSBpbiBkZWZzO1xufVxuZnVuY3Rpb24gdGVzdFdLVChjb2RlKSB7XG4gIHJldHVybiAoY29kZS5pbmRleE9mKCcrJykgIT09IDAgJiYgY29kZS5pbmRleE9mKCdbJykgIT09IC0xKSB8fCAodHlwZW9mIGNvZGUgPT09ICdvYmplY3QnICYmICEoJ3Nyc0NvZGUnIGluIGNvZGUpKTtcbn1cbnZhciBjb2RlcyA9IFsnMzg1NycsICc5MDA5MTMnLCAnMzc4NScsICcxMDIxMTMnXTtcbmZ1bmN0aW9uIGNoZWNrTWVyY2F0b3IoaXRlbSkge1xuICB2YXIgYXV0aCA9IG1hdGNoKGl0ZW0sICdhdXRob3JpdHknKTtcbiAgaWYgKCFhdXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBjb2RlID0gbWF0Y2goYXV0aCwgJ2Vwc2cnKTtcbiAgcmV0dXJuIGNvZGUgJiYgY29kZXMuaW5kZXhPZihjb2RlKSA+IC0xO1xufVxuZnVuY3Rpb24gY2hlY2tQcm9qU3RyKGl0ZW0pIHtcbiAgdmFyIGV4dCA9IG1hdGNoKGl0ZW0sICdleHRlbnNpb24nKTtcbiAgaWYgKCFleHQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIG1hdGNoKGV4dCwgJ3Byb2o0Jyk7XG59XG5mdW5jdGlvbiB0ZXN0UHJvaihjb2RlKSB7XG4gIHJldHVybiBjb2RlWzBdID09PSAnKyc7XG59XG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nIHwgaW1wb3J0KCcuL2NvcmUnKS5QUk9KSlNPTkRlZmluaXRpb24gfCBpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSBjb2RlXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn1cbiAqL1xuZnVuY3Rpb24gcGFyc2UoY29kZSkge1xuICBpZiAodGVzdE9iaihjb2RlKSkge1xuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiB0aGlzIGlzIGEgV0tUIHN0cmluZ1xuICAgIGlmICh0ZXN0RGVmKGNvZGUpKSB7XG4gICAgICByZXR1cm4gZGVmc1tjb2RlXTtcbiAgICB9XG4gICAgaWYgKHRlc3RXS1QoY29kZSkpIHtcbiAgICAgIHZhciBvdXQgPSB3a3QoY29kZSk7XG4gICAgICAvLyB0ZXN0IG9mIHNwZXRpYWwgY2FzZSwgZHVlIHRvIHRoaXMgYmVpbmcgYSB2ZXJ5IGNvbW1vbiBhbmQgb2Z0ZW4gbWFsZm9ybWVkXG4gICAgICBpZiAoY2hlY2tNZXJjYXRvcihvdXQpKSB7XG4gICAgICAgIHJldHVybiBkZWZzWydFUFNHOjM4NTcnXTtcbiAgICAgIH1cbiAgICAgIHZhciBtYXliZVByb2pTdHIgPSBjaGVja1Byb2pTdHIob3V0KTtcbiAgICAgIGlmIChtYXliZVByb2pTdHIpIHtcbiAgICAgICAgcmV0dXJuIHByb2pTdHIobWF5YmVQcm9qU3RyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGlmICh0ZXN0UHJvaihjb2RlKSkge1xuICAgICAgcmV0dXJuIHByb2pTdHIoY29kZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCEoJ3Byb2pOYW1lJyBpbiBjb2RlKSkge1xuICAgIHJldHVybiB3a3QoY29kZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvZGU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2U7XG4iLCJpbXBvcnQgeyBEMlIgfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IFByaW1lTWVyaWRpYW4gZnJvbSAnLi9jb25zdGFudHMvUHJpbWVNZXJpZGlhbic7XG5pbXBvcnQgdW5pdHMgZnJvbSAnLi9jb25zdGFudHMvdW5pdHMnO1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZWZEYXRhXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGRlZkRhdGEpIHtcbiAgLyoqIEB0eXBlIHtpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSAqL1xuICB2YXIgc2VsZiA9IHt9O1xuICB2YXIgcGFyYW1PYmogPSBkZWZEYXRhLnNwbGl0KCcrJykubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgcmV0dXJuIHYudHJpbSgpO1xuICB9KS5maWx0ZXIoZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSkucmVkdWNlKGZ1bmN0aW9uIChwLCBhKSB7XG4gICAgLyoqIEB0eXBlIHtBcnJheTw/Pn0gKi9cbiAgICB2YXIgc3BsaXQgPSBhLnNwbGl0KCc9Jyk7XG4gICAgc3BsaXQucHVzaCh0cnVlKTtcbiAgICBwW3NwbGl0WzBdLnRvTG93ZXJDYXNlKCldID0gc3BsaXRbMV07XG4gICAgcmV0dXJuIHA7XG4gIH0sIHt9KTtcbiAgdmFyIHBhcmFtTmFtZSwgcGFyYW1WYWwsIHBhcmFtT3V0bmFtZTtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBwcm9qOiAncHJvak5hbWUnLFxuICAgIGRhdHVtOiAnZGF0dW1Db2RlJyxcbiAgICByZjogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYucmYgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgbGF0XzA6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxhdDAgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbGF0XzE6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxhdDEgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbGF0XzI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxhdDIgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbGF0X3RzOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sYXRfdHMgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbG9uXzA6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxvbmcwID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGxvbl8xOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sb25nMSA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBsb25fMjogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubG9uZzIgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgYWxwaGE6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmFscGhhID0gcGFyc2VGbG9hdCh2KSAqIEQyUjtcbiAgICB9LFxuICAgIGdhbW1hOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5yZWN0aWZpZWRfZ3JpZF9hbmdsZSA9IHBhcnNlRmxvYXQodikgKiBEMlI7XG4gICAgfSxcbiAgICBsb25jOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sb25nYyA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICB4XzA6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLngwID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIHlfMDogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYueTAgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAga18wOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5rMCA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICBrOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5rMCA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICBhOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5hID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmIgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgcjogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuYSA9IHNlbGYuYiA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICByX2E6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuUl9BID0gdHJ1ZTtcbiAgICB9LFxuICAgIHpvbmU6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLnpvbmUgPSBwYXJzZUludCh2LCAxMCk7XG4gICAgfSxcbiAgICBzb3V0aDogZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi51dG1Tb3V0aCA9IHRydWU7XG4gICAgfSxcbiAgICB0b3dnczg0OiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5kYXR1bV9wYXJhbXMgPSB2LnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGEpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICB0b19tZXRlcjogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYudG9fbWV0ZXIgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgdW5pdHM6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLnVuaXRzID0gdjtcbiAgICAgIHZhciB1bml0ID0gbWF0Y2godW5pdHMsIHYpO1xuICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgc2VsZi50b19tZXRlciA9IHVuaXQudG9fbWV0ZXI7XG4gICAgICB9XG4gICAgfSxcbiAgICBmcm9tX2dyZWVud2ljaDogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuZnJvbV9ncmVlbndpY2ggPSB2ICogRDJSO1xuICAgIH0sXG4gICAgcG06IGZ1bmN0aW9uICh2KSB7XG4gICAgICB2YXIgcG0gPSBtYXRjaChQcmltZU1lcmlkaWFuLCB2KTtcbiAgICAgIHNlbGYuZnJvbV9ncmVlbndpY2ggPSAocG0gPyBwbSA6IHBhcnNlRmxvYXQodikpICogRDJSO1xuICAgIH0sXG4gICAgbmFkZ3JpZHM6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBpZiAodiA9PT0gJ0BudWxsJykge1xuICAgICAgICBzZWxmLmRhdHVtQ29kZSA9ICdub25lJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYubmFkZ3JpZHMgPSB2O1xuICAgICAgfVxuICAgIH0sXG4gICAgYXhpczogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHZhciBsZWdhbEF4aXMgPSAnZXduc3VkJztcbiAgICAgIGlmICh2Lmxlbmd0aCA9PT0gMyAmJiBsZWdhbEF4aXMuaW5kZXhPZih2LnN1YnN0cigwLCAxKSkgIT09IC0xICYmIGxlZ2FsQXhpcy5pbmRleE9mKHYuc3Vic3RyKDEsIDEpKSAhPT0gLTEgJiYgbGVnYWxBeGlzLmluZGV4T2Yodi5zdWJzdHIoMiwgMSkpICE9PSAtMSkge1xuICAgICAgICBzZWxmLmF4aXMgPSB2O1xuICAgICAgfVxuICAgIH0sXG4gICAgYXBwcm94OiBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmFwcHJveCA9IHRydWU7XG4gICAgfSxcbiAgICBvdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLm92ZXIgPSB0cnVlO1xuICAgIH1cbiAgfTtcbiAgZm9yIChwYXJhbU5hbWUgaW4gcGFyYW1PYmopIHtcbiAgICBwYXJhbVZhbCA9IHBhcmFtT2JqW3BhcmFtTmFtZV07XG4gICAgaWYgKHBhcmFtTmFtZSBpbiBwYXJhbXMpIHtcbiAgICAgIHBhcmFtT3V0bmFtZSA9IHBhcmFtc1twYXJhbU5hbWVdO1xuICAgICAgaWYgKHR5cGVvZiBwYXJhbU91dG5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcGFyYW1PdXRuYW1lKHBhcmFtVmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGZbcGFyYW1PdXRuYW1lXSA9IHBhcmFtVmFsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmW3BhcmFtTmFtZV0gPSBwYXJhbVZhbDtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBzZWxmLmRhdHVtQ29kZSA9PT0gJ3N0cmluZycgJiYgc2VsZi5kYXR1bUNvZGUgIT09ICdXR1M4NCcpIHtcbiAgICBzZWxmLmRhdHVtQ29kZSA9IHNlbGYuZGF0dW1Db2RlLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgc2VsZlsncHJvalN0ciddID0gZGVmRGF0YTtcbiAgcmV0dXJuIHNlbGY7XG59XG4iLCJpbXBvcnQgbWVyYyBmcm9tICcuL3Byb2plY3Rpb25zL21lcmMnO1xuaW1wb3J0IGxvbmdsYXQgZnJvbSAnLi9wcm9qZWN0aW9ucy9sb25nbGF0Jztcbi8qKiBAdHlwZSB7QXJyYXk8UGFydGlhbDxpbXBvcnQoJy4vUHJvaicpLmRlZmF1bHQ+Pn0gKi9cbnZhciBwcm9qcyA9IFttZXJjLCBsb25nbGF0XTtcbnZhciBuYW1lcyA9IHt9O1xudmFyIHByb2pTdG9yZSA9IFtdO1xuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL1Byb2onKS5kZWZhdWx0fSBwcm9qXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkKHByb2osIGkpIHtcbiAgdmFyIGxlbiA9IHByb2pTdG9yZS5sZW5ndGg7XG4gIGlmICghcHJvai5uYW1lcykge1xuICAgIGNvbnNvbGUubG9nKGkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHByb2pTdG9yZVtsZW5dID0gcHJvajtcbiAgcHJvai5uYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgbmFtZXNbbi50b0xvd2VyQ2FzZSgpXSA9IGxlbjtcbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9ybWFsaXplZFByb2pOYW1lKG4pIHtcbiAgcmV0dXJuIG4ucmVwbGFjZSgvWy1cXChcXClcXHNdKy9nLCAnICcpLnRyaW0oKS5yZXBsYWNlKC8gL2csICdfJyk7XG59XG5cbi8qKlxuICogR2V0IGEgcHJvamVjdGlvbiBieSBuYW1lLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vUHJvaicpLmRlZmF1bHR8ZmFsc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXQobmFtZSkge1xuICBpZiAoIW5hbWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIG4gPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGlmICh0eXBlb2YgbmFtZXNbbl0gIT09ICd1bmRlZmluZWQnICYmIHByb2pTdG9yZVtuYW1lc1tuXV0pIHtcbiAgICByZXR1cm4gcHJvalN0b3JlW25hbWVzW25dXTtcbiAgfVxuICBuID0gZ2V0Tm9ybWFsaXplZFByb2pOYW1lKG4pO1xuICBpZiAobiBpbiBuYW1lcyAmJiBwcm9qU3RvcmVbbmFtZXNbbl1dKSB7XG4gICAgcmV0dXJuIHByb2pTdG9yZVtuYW1lc1tuXV07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICBwcm9qcy5mb3JFYWNoKGFkZCk7XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIHN0YXJ0OiBzdGFydCxcbiAgYWRkOiBhZGQsXG4gIGdldDogZ2V0XG59O1xuIiwiaW1wb3J0IG1zZm56IGZyb20gJy4uL2NvbW1vbi9tc2Zueic7XG5pbXBvcnQgcXNmbnogZnJvbSAnLi4vY29tbW9uL3FzZm56JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuaW1wb3J0IHsgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0ZW1wXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlM1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbl9wb1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc19wb1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHQxXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29uXG4gKiBAcHJvcGVydHkge251bWJlcn0gbXMxXG4gKiBAcHJvcGVydHkge251bWJlcn0gcXMxXG4gKiBAcHJvcGVydHkge251bWJlcn0gdDJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtczJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxczJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0M1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHFzMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5zMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByaFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbl9waGlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NfcGhpXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxICsgdGhpcy5sYXQyKSA8IEVQU0xOKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMudGVtcCA9IHRoaXMuYiAvIHRoaXMuYTtcbiAgdGhpcy5lcyA9IDEgLSBNYXRoLnBvdyh0aGlzLnRlbXAsIDIpO1xuICB0aGlzLmUzID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuXG4gIHRoaXMuc2luX3BvID0gTWF0aC5zaW4odGhpcy5sYXQxKTtcbiAgdGhpcy5jb3NfcG8gPSBNYXRoLmNvcyh0aGlzLmxhdDEpO1xuICB0aGlzLnQxID0gdGhpcy5zaW5fcG87XG4gIHRoaXMuY29uID0gdGhpcy5zaW5fcG87XG4gIHRoaXMubXMxID0gbXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcG8sIHRoaXMuY29zX3BvKTtcbiAgdGhpcy5xczEgPSBxc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbyk7XG5cbiAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDIpO1xuICB0aGlzLmNvc19wbyA9IE1hdGguY29zKHRoaXMubGF0Mik7XG4gIHRoaXMudDIgPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5tczIgPSBtc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbywgdGhpcy5jb3NfcG8pO1xuICB0aGlzLnFzMiA9IHFzZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvKTtcblxuICB0aGlzLnNpbl9wbyA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gIHRoaXMuY29zX3BvID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgdGhpcy50MyA9IHRoaXMuc2luX3BvO1xuICB0aGlzLnFzMCA9IHFzZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvKTtcblxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxIC0gdGhpcy5sYXQyKSA+IEVQU0xOKSB7XG4gICAgdGhpcy5uczAgPSAodGhpcy5tczEgKiB0aGlzLm1zMSAtIHRoaXMubXMyICogdGhpcy5tczIpIC8gKHRoaXMucXMyIC0gdGhpcy5xczEpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubnMwID0gdGhpcy5jb247XG4gIH1cbiAgdGhpcy5jID0gdGhpcy5tczEgKiB0aGlzLm1zMSArIHRoaXMubnMwICogdGhpcy5xczE7XG4gIHRoaXMucmggPSB0aGlzLmEgKiBNYXRoLnNxcnQodGhpcy5jIC0gdGhpcy5uczAgKiB0aGlzLnFzMCkgLyB0aGlzLm5zMDtcbn1cblxuLyogQWxiZXJzIENvbmljYWwgRXF1YWwgQXJlYSBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICB0aGlzLnNpbl9waGkgPSBNYXRoLnNpbihsYXQpO1xuICB0aGlzLmNvc19waGkgPSBNYXRoLmNvcyhsYXQpO1xuXG4gIHZhciBxcyA9IHFzZm56KHRoaXMuZTMsIHRoaXMuc2luX3BoaSk7XG4gIHZhciByaDEgPSB0aGlzLmEgKiBNYXRoLnNxcnQodGhpcy5jIC0gdGhpcy5uczAgKiBxcykgLyB0aGlzLm5zMDtcbiAgdmFyIHRoZXRhID0gdGhpcy5uczAgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciB4ID0gcmgxICogTWF0aC5zaW4odGhldGEpICsgdGhpcy54MDtcbiAgdmFyIHkgPSB0aGlzLnJoIC0gcmgxICogTWF0aC5jb3ModGhldGEpICsgdGhpcy55MDtcblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgcmgxLCBxcywgY29uLCB0aGV0YSwgbG9uLCBsYXQ7XG5cbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSA9IHRoaXMucmggLSBwLnkgKyB0aGlzLnkwO1xuICBpZiAodGhpcy5uczAgPj0gMCkge1xuICAgIHJoMSA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgIGNvbiA9IDE7XG4gIH0gZWxzZSB7XG4gICAgcmgxID0gLU1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgIGNvbiA9IC0xO1xuICB9XG4gIHRoZXRhID0gMDtcbiAgaWYgKHJoMSAhPT0gMCkge1xuICAgIHRoZXRhID0gTWF0aC5hdGFuMihjb24gKiBwLngsIGNvbiAqIHAueSk7XG4gIH1cbiAgY29uID0gcmgxICogdGhpcy5uczAgLyB0aGlzLmE7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGxhdCA9IE1hdGguYXNpbigodGhpcy5jIC0gY29uICogY29uKSAvICgyICogdGhpcy5uczApKTtcbiAgfSBlbHNlIHtcbiAgICBxcyA9ICh0aGlzLmMgLSBjb24gKiBjb24pIC8gdGhpcy5uczA7XG4gICAgbGF0ID0gdGhpcy5waGkxeih0aGlzLmUzLCBxcyk7XG4gIH1cblxuICBsb24gPSBhZGp1c3RfbG9uKHRoZXRhIC8gdGhpcy5uczAgKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEZ1bmN0aW9uIHRvIGNvbXB1dGUgcGhpMSwgdGhlIGxhdGl0dWRlIGZvciB0aGUgaW52ZXJzZSBvZiB0aGVcbiAgIEFsYmVycyBDb25pY2FsIEVxdWFsLUFyZWEgcHJvamVjdGlvbi5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaGkxeihlY2NlbnQsIHFzKSB7XG4gIHZhciBzaW5waGksIGNvc3BoaSwgY29uLCBjb20sIGRwaGk7XG4gIHZhciBwaGkgPSBhc2lueigwLjUgKiBxcyk7XG4gIGlmIChlY2NlbnQgPCBFUFNMTikge1xuICAgIHJldHVybiBwaGk7XG4gIH1cblxuICB2YXIgZWNjbnRzID0gZWNjZW50ICogZWNjZW50O1xuICBmb3IgKHZhciBpID0gMTsgaSA8PSAyNTsgaSsrKSB7XG4gICAgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcbiAgICBjb20gPSAxIC0gY29uICogY29uO1xuICAgIGRwaGkgPSAwLjUgKiBjb20gKiBjb20gLyBjb3NwaGkgKiAocXMgLyAoMSAtIGVjY250cykgLSBzaW5waGkgLyBjb20gKyAwLjUgLyBlY2NlbnQgKiBNYXRoLmxvZygoMSAtIGNvbikgLyAoMSArIGNvbikpKTtcbiAgICBwaGkgPSBwaGkgKyBkcGhpO1xuICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSAxZS03KSB7XG4gICAgICByZXR1cm4gcGhpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnQWxiZXJzX0NvbmljX0VxdWFsX0FyZWEnLCAnQWxiZXJzX0VxdWFsX0FyZWEnLCAnQWxiZXJzJywgJ2FlYSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXMsXG4gIHBoaTF6OiBwaGkxelxufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCB7IEhBTEZfUEksIEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgbWxmbiBmcm9tICcuLi9jb21tb24vbWxmbic7XG5pbXBvcnQgZTBmbiBmcm9tICcuLi9jb21tb24vZTBmbic7XG5pbXBvcnQgZTFmbiBmcm9tICcuLi9jb21tb24vZTFmbic7XG5pbXBvcnQgZTJmbiBmcm9tICcuLi9jb21tb24vZTJmbic7XG5pbXBvcnQgZTNmbiBmcm9tICcuLi9jb21tb24vZTNmbic7XG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcbmltcG9ydCBpbWxmbiBmcm9tICcuLi9jb21tb24vaW1sZm4nO1xuaW1wb3J0IHsgdmluY2VudHlEaXJlY3QsIHZpbmNlbnR5SW52ZXJzZSB9IGZyb20gJy4uL2NvbW1vbi92aW5jZW50eSc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5fcDEyXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zX3AxMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBmXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLnNpbl9wMTIgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB0aGlzLmNvc19wMTIgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICAvLyBmbGF0dGVuaW5nIGZvciBlbGxpcHNvaWRcbiAgdGhpcy5mID0gdGhpcy5lcyAvICgxICsgTWF0aC5zcXJ0KDEgLSB0aGlzLmVzKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHNpbnBoaSA9IE1hdGguc2luKHAueSk7XG4gIHZhciBjb3NwaGkgPSBNYXRoLmNvcyhwLnkpO1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIGUwLCBlMSwgZTIsIGUzLCBNbHAsIE1sLCBjLCBrcCwgY29zX2MsIHZhcnMsIGF6aTE7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgLSAxKSA8PSBFUFNMTikge1xuICAgICAgLy8gTm9ydGggUG9sZSBjYXNlXG4gICAgICBwLnggPSB0aGlzLngwICsgdGhpcy5hICogKEhBTEZfUEkgLSBsYXQpICogTWF0aC5zaW4oZGxvbik7XG4gICAgICBwLnkgPSB0aGlzLnkwIC0gdGhpcy5hICogKEhBTEZfUEkgLSBsYXQpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICByZXR1cm4gcDtcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiArIDEpIDw9IEVQU0xOKSB7XG4gICAgICAvLyBTb3V0aCBQb2xlIGNhc2VcbiAgICAgIHAueCA9IHRoaXMueDAgKyB0aGlzLmEgKiAoSEFMRl9QSSArIGxhdCkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICAgIHAueSA9IHRoaXMueTAgKyB0aGlzLmEgKiAoSEFMRl9QSSArIGxhdCkgKiBNYXRoLmNvcyhkbG9uKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZhdWx0IGNhc2VcbiAgICAgIGNvc19jID0gdGhpcy5zaW5fcDEyICogc2lucGhpICsgdGhpcy5jb3NfcDEyICogY29zcGhpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICBjID0gTWF0aC5hY29zKGNvc19jKTtcbiAgICAgIGtwID0gYyA/IGMgLyBNYXRoLnNpbihjKSA6IDE7XG4gICAgICBwLnggPSB0aGlzLngwICsgdGhpcy5hICoga3AgKiBjb3NwaGkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICAgIHAueSA9IHRoaXMueTAgKyB0aGlzLmEgKiBrcCAqICh0aGlzLmNvc19wMTIgKiBzaW5waGkgLSB0aGlzLnNpbl9wMTIgKiBjb3NwaGkgKiBNYXRoLmNvcyhkbG9uKSk7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZTAgPSBlMGZuKHRoaXMuZXMpO1xuICAgIGUxID0gZTFmbih0aGlzLmVzKTtcbiAgICBlMiA9IGUyZm4odGhpcy5lcyk7XG4gICAgZTMgPSBlM2ZuKHRoaXMuZXMpO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgLSAxKSA8PSBFUFNMTikge1xuICAgICAgLy8gTm9ydGggUG9sZSBjYXNlXG4gICAgICBNbHAgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBIQUxGX1BJKTtcbiAgICAgIE1sID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgbGF0KTtcbiAgICAgIHAueCA9IHRoaXMueDAgKyAoTWxwIC0gTWwpICogTWF0aC5zaW4oZGxvbik7XG4gICAgICBwLnkgPSB0aGlzLnkwIC0gKE1scCAtIE1sKSAqIE1hdGguY29zKGRsb24pO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgKyAxKSA8PSBFUFNMTikge1xuICAgICAgLy8gU291dGggUG9sZSBjYXNlXG4gICAgICBNbHAgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBIQUxGX1BJKTtcbiAgICAgIE1sID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgbGF0KTtcbiAgICAgIHAueCA9IHRoaXMueDAgKyAoTWxwICsgTWwpICogTWF0aC5zaW4oZGxvbik7XG4gICAgICBwLnkgPSB0aGlzLnkwICsgKE1scCArIE1sKSAqIE1hdGguY29zKGRsb24pO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQgY2FzZVxuICAgICAgaWYgKE1hdGguYWJzKGxvbikgPCBFUFNMTiAmJiBNYXRoLmFicyhsYXQgLSB0aGlzLmxhdDApIDwgRVBTTE4pIHtcbiAgICAgICAgcC54ID0gcC55ID0gMDtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9XG4gICAgICB2YXJzID0gdmluY2VudHlJbnZlcnNlKHRoaXMubGF0MCwgdGhpcy5sb25nMCwgbGF0LCBsb24sIHRoaXMuYSwgdGhpcy5mKTtcbiAgICAgIGF6aTEgPSB2YXJzLmF6aTE7XG4gICAgICBwLnggPSB2YXJzLnMxMiAqIE1hdGguc2luKGF6aTEpO1xuICAgICAgcC55ID0gdmFycy5zMTIgKiBNYXRoLmNvcyhhemkxKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgdmFyIHJoLCB6LCBzaW56LCBjb3N6LCBsb24sIGxhdCwgY29uLCBlMCwgZTEsIGUyLCBlMywgTWxwLCBNLCBhemkxLCBzMTIsIHZhcnM7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgaWYgKHJoID4gKDIgKiBIQUxGX1BJICogdGhpcy5hKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB6ID0gcmggLyB0aGlzLmE7XG5cbiAgICBzaW56ID0gTWF0aC5zaW4oeik7XG4gICAgY29zeiA9IE1hdGguY29zKHopO1xuXG4gICAgbG9uID0gdGhpcy5sb25nMDtcbiAgICBpZiAoTWF0aC5hYnMocmgpIDw9IEVQU0xOKSB7XG4gICAgICBsYXQgPSB0aGlzLmxhdDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhdCA9IGFzaW56KGNvc3ogKiB0aGlzLnNpbl9wMTIgKyAocC55ICogc2lueiAqIHRoaXMuY29zX3AxMikgLyByaCk7XG4gICAgICBjb24gPSBNYXRoLmFicyh0aGlzLmxhdDApIC0gSEFMRl9QSTtcbiAgICAgIGlmIChNYXRoLmFicyhjb24pIDw9IEVQU0xOKSB7XG4gICAgICAgIGlmICh0aGlzLmxhdDAgPj0gMCkge1xuICAgICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtcC55KSwgdGhpcy5vdmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgLSBNYXRoLmF0YW4yKC1wLngsIHAueSksIHRoaXMub3Zlcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54ICogc2lueiwgcmggKiB0aGlzLmNvc19wMTIgKiBjb3N6IC0gcC55ICogdGhpcy5zaW5fcDEyICogc2lueiksIHRoaXMub3Zlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcC54ID0gbG9uO1xuICAgIHAueSA9IGxhdDtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICBlMCA9IGUwZm4odGhpcy5lcyk7XG4gICAgZTEgPSBlMWZuKHRoaXMuZXMpO1xuICAgIGUyID0gZTJmbih0aGlzLmVzKTtcbiAgICBlMyA9IGUzZm4odGhpcy5lcyk7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiAtIDEpIDw9IEVQU0xOKSB7XG4gICAgICAvLyBOb3J0aCBwb2xlIGNhc2VcbiAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuICAgICAgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICAgIE0gPSBNbHAgLSByaDtcbiAgICAgIGxhdCA9IGltbGZuKE0gLyB0aGlzLmEsIGUwLCBlMSwgZTIsIGUzKTtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtMSAqIHAueSksIHRoaXMub3Zlcik7XG4gICAgICBwLnggPSBsb247XG4gICAgICBwLnkgPSBsYXQ7XG4gICAgICByZXR1cm4gcDtcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiArIDEpIDw9IEVQU0xOKSB7XG4gICAgICAvLyBTb3V0aCBwb2xlIGNhc2VcbiAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuICAgICAgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICAgIE0gPSByaCAtIE1scDtcblxuICAgICAgbGF0ID0gaW1sZm4oTSAvIHRoaXMuYSwgZTAsIGUxLCBlMiwgZTMpO1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIHAueSksIHRoaXMub3Zlcik7XG4gICAgICBwLnggPSBsb247XG4gICAgICBwLnkgPSBsYXQ7XG4gICAgICByZXR1cm4gcDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVmYXVsdCBjYXNlXG4gICAgICBhemkxID0gTWF0aC5hdGFuMihwLngsIHAueSk7XG4gICAgICBzMTIgPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICAgIHZhcnMgPSB2aW5jZW50eURpcmVjdCh0aGlzLmxhdDAsIHRoaXMubG9uZzAsIGF6aTEsIHMxMiwgdGhpcy5hLCB0aGlzLmYpO1xuXG4gICAgICBwLnggPSB2YXJzLmxvbjI7XG4gICAgICBwLnkgPSB2YXJzLmxhdDI7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnQXppbXV0aGFsX0VxdWlkaXN0YW50JywgJ2FlcWQnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGh5cG90IGZyb20gJy4uL2NvbW1vbi9oeXBvdCc7XG5pbXBvcnQgcGpfZW5mbiBmcm9tICcuLi9jb21tb24vcGpfZW5mbic7XG5pbXBvcnQgcGpfaW52X21sZm4gZnJvbSAnLi4vY29tbW9uL3BqX2ludl9tbGZuJztcbmltcG9ydCBwal9tbGZuIGZyb20gJy4uL2NvbW1vbi9wal9tbGZuJztcbmltcG9ydCB7IEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwaGkxXG4gKiBAcHJvcGVydHkge251bWJlcn0gY3BoaTFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBlblxuICogQHByb3BlcnR5IHtudW1iZXJ9IG0xXG4gKiBAcHJvcGVydHkge251bWJlcn0gYW0xXG4gKi9cblxudmFyIEVQUzEwID0gMWUtMTA7XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIGM7XG5cbiAgdGhpcy5waGkxID0gdGhpcy5sYXQxO1xuICBpZiAoTWF0aC5hYnModGhpcy5waGkxKSA8IEVQUzEwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gIH1cbiAgaWYgKHRoaXMuZXMpIHtcbiAgICB0aGlzLmVuID0gcGpfZW5mbih0aGlzLmVzKTtcbiAgICB0aGlzLm0xID0gcGpfbWxmbih0aGlzLnBoaTEsIHRoaXMuYW0xID0gTWF0aC5zaW4odGhpcy5waGkxKSxcbiAgICAgIGMgPSBNYXRoLmNvcyh0aGlzLnBoaTEpLCB0aGlzLmVuKTtcbiAgICB0aGlzLmFtMSA9IGMgLyAoTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogdGhpcy5hbTEgKiB0aGlzLmFtMSkgKiB0aGlzLmFtMSk7XG4gICAgdGhpcy5pbnZlcnNlID0gZV9pbnY7XG4gICAgdGhpcy5mb3J3YXJkID0gZV9md2Q7XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMucGhpMSkgKyBFUFMxMCA+PSBIQUxGX1BJKSB7XG4gICAgICB0aGlzLmNwaGkxID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jcGhpMSA9IDEgLyBNYXRoLnRhbih0aGlzLnBoaTEpO1xuICAgIH1cbiAgICB0aGlzLmludmVyc2UgPSBzX2ludjtcbiAgICB0aGlzLmZvcndhcmQgPSBzX2Z3ZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBlX2Z3ZChwKSB7XG4gIHZhciBsYW0gPSBhZGp1c3RfbG9uKHAueCAtICh0aGlzLmxvbmcwIHx8IDApLCB0aGlzLm92ZXIpO1xuICB2YXIgcGhpID0gcC55O1xuICB2YXIgcmgsIEUsIGM7XG4gIHJoID0gdGhpcy5hbTEgKyB0aGlzLm0xIC0gcGpfbWxmbihwaGksIEUgPSBNYXRoLnNpbihwaGkpLCBjID0gTWF0aC5jb3MocGhpKSwgdGhpcy5lbik7XG4gIEUgPSBjICogbGFtIC8gKHJoICogTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogRSAqIEUpKTtcbiAgcC54ID0gcmggKiBNYXRoLnNpbihFKTtcbiAgcC55ID0gdGhpcy5hbTEgLSByaCAqIE1hdGguY29zKEUpO1xuXG4gIHAueCA9IHRoaXMuYSAqIHAueCArICh0aGlzLngwIHx8IDApO1xuICBwLnkgPSB0aGlzLmEgKiBwLnkgKyAodGhpcy55MCB8fCAwKTtcbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGVfaW52KHApIHtcbiAgcC54ID0gKHAueCAtICh0aGlzLngwIHx8IDApKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtICh0aGlzLnkwIHx8IDApKSAvIHRoaXMuYTtcblxuICB2YXIgcywgcmgsIGxhbSwgcGhpO1xuICByaCA9IGh5cG90KHAueCwgcC55ID0gdGhpcy5hbTEgLSBwLnkpO1xuICBwaGkgPSBwal9pbnZfbWxmbih0aGlzLmFtMSArIHRoaXMubTEgLSByaCwgdGhpcy5lcywgdGhpcy5lbik7XG4gIGlmICgocyA9IE1hdGguYWJzKHBoaSkpIDwgSEFMRl9QSSkge1xuICAgIHMgPSBNYXRoLnNpbihwaGkpO1xuICAgIGxhbSA9IHJoICogTWF0aC5hdGFuMihwLngsIHAueSkgKiBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBzICogcykgLyBNYXRoLmNvcyhwaGkpO1xuICB9IGVsc2UgaWYgKE1hdGguYWJzKHMgLSBIQUxGX1BJKSA8PSBFUFMxMCkge1xuICAgIGxhbSA9IDA7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gIH1cbiAgcC54ID0gYWRqdXN0X2xvbihsYW0gKyAodGhpcy5sb25nMCB8fCAwKSwgdGhpcy5vdmVyKTtcbiAgcC55ID0gYWRqdXN0X2xhdChwaGkpO1xuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gc19md2QocCkge1xuICB2YXIgbGFtID0gYWRqdXN0X2xvbihwLnggLSAodGhpcy5sb25nMCB8fCAwKSwgdGhpcy5vdmVyKTtcbiAgdmFyIHBoaSA9IHAueTtcbiAgdmFyIEUsIHJoO1xuICByaCA9IHRoaXMuY3BoaTEgKyB0aGlzLnBoaTEgLSBwaGk7XG4gIGlmIChNYXRoLmFicyhyaCkgPiBFUFMxMCkge1xuICAgIHAueCA9IHJoICogTWF0aC5zaW4oRSA9IGxhbSAqIE1hdGguY29zKHBoaSkgLyByaCk7XG4gICAgcC55ID0gdGhpcy5jcGhpMSAtIHJoICogTWF0aC5jb3MoRSk7XG4gIH0gZWxzZSB7XG4gICAgcC54ID0gcC55ID0gMDtcbiAgfVxuXG4gIHAueCA9IHRoaXMuYSAqIHAueCArICh0aGlzLngwIHx8IDApO1xuICBwLnkgPSB0aGlzLmEgKiBwLnkgKyAodGhpcy55MCB8fCAwKTtcbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHNfaW52KHApIHtcbiAgcC54ID0gKHAueCAtICh0aGlzLngwIHx8IDApKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtICh0aGlzLnkwIHx8IDApKSAvIHRoaXMuYTtcblxuICB2YXIgbGFtLCBwaGk7XG4gIHZhciByaCA9IGh5cG90KHAueCwgcC55ID0gdGhpcy5jcGhpMSAtIHAueSk7XG4gIHBoaSA9IHRoaXMuY3BoaTEgKyB0aGlzLnBoaTEgLSByaDtcbiAgaWYgKE1hdGguYWJzKHBoaSkgPiBIQUxGX1BJKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gIH1cbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKHBoaSkgLSBIQUxGX1BJKSA8PSBFUFMxMCkge1xuICAgIGxhbSA9IDA7XG4gIH0gZWxzZSB7XG4gICAgbGFtID0gcmggKiBNYXRoLmF0YW4yKHAueCwgcC55KSAvIE1hdGguY29zKHBoaSk7XG4gIH1cbiAgcC54ID0gYWRqdXN0X2xvbihsYW0gKyAodGhpcy5sb25nMCB8fCAwKSwgdGhpcy5vdmVyKTtcbiAgcC55ID0gYWRqdXN0X2xhdChwaGkpO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnYm9ubmUnLCAnQm9ubmUgKFdlcm5lciBsYXRfMT05MCknXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IG1sZm4gZnJvbSAnLi4vY29tbW9uL21sZm4nO1xuaW1wb3J0IGUwZm4gZnJvbSAnLi4vY29tbW9uL2UwZm4nO1xuaW1wb3J0IGUxZm4gZnJvbSAnLi4vY29tbW9uL2UxZm4nO1xuaW1wb3J0IGUyZm4gZnJvbSAnLi4vY29tbW9uL2UyZm4nO1xuaW1wb3J0IGUzZm4gZnJvbSAnLi4vY29tbW9uL2UzZm4nO1xuaW1wb3J0IGdOIGZyb20gJy4uL2NvbW1vbi9nTic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5pbXBvcnQgaW1sZm4gZnJvbSAnLi4vY29tbW9uL2ltbGZuJztcbmltcG9ydCB7IEhBTEZfUEksIEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUxXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlM1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG1sMFxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgaWYgKCF0aGlzLnNwaGVyZSkge1xuICAgIHRoaXMuZTAgPSBlMGZuKHRoaXMuZXMpO1xuICAgIHRoaXMuZTEgPSBlMWZuKHRoaXMuZXMpO1xuICAgIHRoaXMuZTIgPSBlMmZuKHRoaXMuZXMpO1xuICAgIHRoaXMuZTMgPSBlM2ZuKHRoaXMuZXMpO1xuICAgIHRoaXMubWwwID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDApO1xuICB9XG59XG5cbi8qIENhc3NpbmkgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB2YXIgeCwgeTtcbiAgdmFyIGxhbSA9IHAueDtcbiAgdmFyIHBoaSA9IHAueTtcbiAgbGFtID0gYWRqdXN0X2xvbihsYW0gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHggPSB0aGlzLmEgKiBNYXRoLmFzaW4oTWF0aC5jb3MocGhpKSAqIE1hdGguc2luKGxhbSkpO1xuICAgIHkgPSB0aGlzLmEgKiAoTWF0aC5hdGFuMihNYXRoLnRhbihwaGkpLCBNYXRoLmNvcyhsYW0pKSAtIHRoaXMubGF0MCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gZWxsaXBzb2lkXG4gICAgdmFyIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgdmFyIGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgdmFyIG5sID0gZ04odGhpcy5hLCB0aGlzLmUsIHNpbnBoaSk7XG4gICAgdmFyIHRsID0gTWF0aC50YW4ocGhpKSAqIE1hdGgudGFuKHBoaSk7XG4gICAgdmFyIGFsID0gbGFtICogTWF0aC5jb3MocGhpKTtcbiAgICB2YXIgYXNxID0gYWwgKiBhbDtcbiAgICB2YXIgY2wgPSB0aGlzLmVzICogY29zcGhpICogY29zcGhpIC8gKDEgLSB0aGlzLmVzKTtcbiAgICB2YXIgbWwgPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHBoaSk7XG5cbiAgICB4ID0gbmwgKiBhbCAqICgxIC0gYXNxICogdGwgKiAoMSAvIDYgLSAoOCAtIHRsICsgOCAqIGNsKSAqIGFzcSAvIDEyMCkpO1xuICAgIHkgPSBtbCAtIHRoaXMubWwwICsgbmwgKiBzaW5waGkgLyBjb3NwaGkgKiBhc3EgKiAoMC41ICsgKDUgLSB0bCArIDYgKiBjbCkgKiBhc3EgLyAyNCk7XG4gIH1cblxuICBwLnggPSB4ICsgdGhpcy54MDtcbiAgcC55ID0geSArIHRoaXMueTA7XG4gIHJldHVybiBwO1xufVxuXG4vKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciB4ID0gcC54IC8gdGhpcy5hO1xuICB2YXIgeSA9IHAueSAvIHRoaXMuYTtcbiAgdmFyIHBoaSwgbGFtO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHZhciBkZCA9IHkgKyB0aGlzLmxhdDA7XG4gICAgcGhpID0gTWF0aC5hc2luKE1hdGguc2luKGRkKSAqIE1hdGguY29zKHgpKTtcbiAgICBsYW0gPSBNYXRoLmF0YW4yKE1hdGgudGFuKHgpLCBNYXRoLmNvcyhkZCkpO1xuICB9IGVsc2Uge1xuICAgIC8qIGVsbGlwc29pZCAqL1xuICAgIHZhciBtbDEgPSB0aGlzLm1sMCAvIHRoaXMuYSArIHk7XG4gICAgdmFyIHBoaTEgPSBpbWxmbihtbDEsIHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMpO1xuICAgIGlmIChNYXRoLmFicyhNYXRoLmFicyhwaGkxKSAtIEhBTEZfUEkpIDw9IEVQU0xOKSB7XG4gICAgICBwLnggPSB0aGlzLmxvbmcwO1xuICAgICAgcC55ID0gSEFMRl9QSTtcbiAgICAgIGlmICh5IDwgMCkge1xuICAgICAgICBwLnkgKj0gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgdmFyIG5sMSA9IGdOKHRoaXMuYSwgdGhpcy5lLCBNYXRoLnNpbihwaGkxKSk7XG5cbiAgICB2YXIgcmwxID0gbmwxICogbmwxICogbmwxIC8gdGhpcy5hIC8gdGhpcy5hICogKDEgLSB0aGlzLmVzKTtcbiAgICB2YXIgdGwxID0gTWF0aC5wb3coTWF0aC50YW4ocGhpMSksIDIpO1xuICAgIHZhciBkbCA9IHggKiB0aGlzLmEgLyBubDE7XG4gICAgdmFyIGRzcSA9IGRsICogZGw7XG4gICAgcGhpID0gcGhpMSAtIG5sMSAqIE1hdGgudGFuKHBoaTEpIC8gcmwxICogZGwgKiBkbCAqICgwLjUgLSAoMSArIDMgKiB0bDEpICogZGwgKiBkbCAvIDI0KTtcbiAgICBsYW0gPSBkbCAqICgxIC0gZHNxICogKHRsMSAvIDMgKyAoMSArIDMgKiB0bDEpICogdGwxICogZHNxIC8gMTUpKSAvIE1hdGguY29zKHBoaTEpO1xuICB9XG5cbiAgcC54ID0gYWRqdXN0X2xvbihsYW0gKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICBwLnkgPSBhZGp1c3RfbGF0KHBoaSk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydDYXNzaW5pJywgJ0Nhc3NpbmlfU29sZG5lcicsICdjYXNzJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBxc2ZueiBmcm9tICcuLi9jb21tb24vcXNmbnonO1xuaW1wb3J0IG1zZm56IGZyb20gJy4uL2NvbW1vbi9tc2Zueic7XG5pbXBvcnQgaXFzZm56IGZyb20gJy4uL2NvbW1vbi9pcXNmbnonO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqL1xuXG4vKipcbiAgcmVmZXJlbmNlOlxuICAgIFwiQ2FydG9ncmFwaGljIFByb2plY3Rpb24gUHJvY2VkdXJlcyBmb3IgdGhlIFVOSVggRW52aXJvbm1lbnQtXG4gICAgQSBVc2VyJ3MgTWFudWFsXCIgYnkgR2VyYWxkIEkuIEV2ZW5kZW4sXG4gICAgVVNHUyBPcGVuIEZpbGUgUmVwb3J0IDkwLTI4NGFuZCBSZWxlYXNlIDQgSW50ZXJpbSBSZXBvcnRzICgyMDAzKVxuICBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIG5vLW9wXG4gIGlmICghdGhpcy5zcGhlcmUpIHtcbiAgICB0aGlzLmswID0gbXNmbnoodGhpcy5lLCBNYXRoLnNpbih0aGlzLmxhdF90cyksIE1hdGguY29zKHRoaXMubGF0X3RzKSk7XG4gIH1cbn1cblxuLyogQ3lsaW5kcmljYWwgRXF1YWwgQXJlYSBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHgsIHk7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiBkbG9uICogTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xuICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICogTWF0aC5zaW4obGF0KSAvIE1hdGguY29zKHRoaXMubGF0X3RzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcXMgPSBxc2Zueih0aGlzLmUsIE1hdGguc2luKGxhdCkpO1xuICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogdGhpcy5rMCAqIGRsb247XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBxcyAqIDAuNSAvIHRoaXMuazA7XG4gIH1cblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuLyogQ3lsaW5kcmljYWwgRXF1YWwgQXJlYSBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICB2YXIgbG9uLCBsYXQ7XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKHAueCAvIHRoaXMuYSkgLyBNYXRoLmNvcyh0aGlzLmxhdF90cyksIHRoaXMub3Zlcik7XG4gICAgbGF0ID0gTWF0aC5hc2luKChwLnkgLyB0aGlzLmEpICogTWF0aC5jb3ModGhpcy5sYXRfdHMpKTtcbiAgfSBlbHNlIHtcbiAgICBsYXQgPSBpcXNmbnoodGhpcy5lLCAyICogcC55ICogdGhpcy5rMCAvIHRoaXMuYSk7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgcC54IC8gKHRoaXMuYSAqIHRoaXMuazApLCB0aGlzLm92ZXIpO1xuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydjZWEnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy54MCA9IHRoaXMueDAgfHwgMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgfHwgMDtcbiAgdGhpcy5sYXQwID0gdGhpcy5sYXQwIHx8IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwIHx8IDA7XG4gIHRoaXMubGF0X3RzID0gdGhpcy5sYXRfdHMgfHwgMDtcbiAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGUgfHwgJ0VxdWlkaXN0YW50IEN5bGluZHJpY2FsIChQbGF0ZSBDYXJyZSknO1xuXG4gIHRoaXMucmMgPSBNYXRoLmNvcyh0aGlzLmxhdF90cyk7XG59XG5cbi8vIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIGRsYXQgPSBhZGp1c3RfbGF0KGxhdCAtIHRoaXMubGF0MCk7XG4gIHAueCA9IHRoaXMueDAgKyAodGhpcy5hICogZGxvbiAqIHRoaXMucmMpO1xuICBwLnkgPSB0aGlzLnkwICsgKHRoaXMuYSAqIGRsYXQpO1xuICByZXR1cm4gcDtcbn1cblxuLy8gaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgeCA9IHAueDtcbiAgdmFyIHkgPSBwLnk7XG5cbiAgcC54ID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKCh4IC0gdGhpcy54MCkgLyAodGhpcy5hICogdGhpcy5yYykpLCB0aGlzLm92ZXIpO1xuICBwLnkgPSBhZGp1c3RfbGF0KHRoaXMubGF0MCArICgoeSAtIHRoaXMueTApIC8gKHRoaXMuYSkpKTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0VxdWlyZWN0YW5ndWxhcicsICdFcXVpZGlzdGFudF9DeWxpbmRyaWNhbCcsICdFcXVpZGlzdGFudF9DeWxpbmRyaWNhbF9TcGhlcmljYWwnLCAnZXFjJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBlMGZuIGZyb20gJy4uL2NvbW1vbi9lMGZuJztcbmltcG9ydCBlMWZuIGZyb20gJy4uL2NvbW1vbi9lMWZuJztcbmltcG9ydCBlMmZuIGZyb20gJy4uL2NvbW1vbi9lMmZuJztcbmltcG9ydCBlM2ZuIGZyb20gJy4uL2NvbW1vbi9lM2ZuJztcbmltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IG1sZm4gZnJvbSAnLi4vY29tbW9uL21sZm4nO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuaW1wb3J0IGltbGZuIGZyb20gJy4uL2NvbW1vbi9pbWxmbic7XG5pbXBvcnQgeyBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRlbXBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUxXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlM1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbl9waGlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NfcGhpXG4gKiBAcHJvcGVydHkge251bWJlcn0gbXMxXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWwxXG4gKiBAcHJvcGVydHkge251bWJlcn0gbXMyXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWwyXG4gKiBAcHJvcGVydHkge251bWJlcn0gbnNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBnXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWwwXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmhcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2VcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgLy8gU3RhbmRhcmQgUGFyYWxsZWxzIGNhbm5vdCBiZSBlcXVhbCBhbmQgb24gb3Bwb3NpdGUgc2lkZXMgb2YgdGhlIGVxdWF0b3JcbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MSArIHRoaXMubGF0MikgPCBFUFNMTikge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmxhdDIgPSB0aGlzLmxhdDIgfHwgdGhpcy5sYXQxO1xuICB0aGlzLnRlbXAgPSB0aGlzLmIgLyB0aGlzLmE7XG4gIHRoaXMuZXMgPSAxIC0gTWF0aC5wb3codGhpcy50ZW1wLCAyKTtcbiAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuICB0aGlzLmUwID0gZTBmbih0aGlzLmVzKTtcbiAgdGhpcy5lMSA9IGUxZm4odGhpcy5lcyk7XG4gIHRoaXMuZTIgPSBlMmZuKHRoaXMuZXMpO1xuICB0aGlzLmUzID0gZTNmbih0aGlzLmVzKTtcblxuICB0aGlzLnNpbl9waGkgPSBNYXRoLnNpbih0aGlzLmxhdDEpO1xuICB0aGlzLmNvc19waGkgPSBNYXRoLmNvcyh0aGlzLmxhdDEpO1xuXG4gIHRoaXMubXMxID0gbXNmbnoodGhpcy5lLCB0aGlzLnNpbl9waGksIHRoaXMuY29zX3BoaSk7XG4gIHRoaXMubWwxID0gbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDEpO1xuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgLSB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcbiAgICB0aGlzLm5zID0gdGhpcy5zaW5fcGhpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuc2luX3BoaSA9IE1hdGguc2luKHRoaXMubGF0Mik7XG4gICAgdGhpcy5jb3NfcGhpID0gTWF0aC5jb3ModGhpcy5sYXQyKTtcbiAgICB0aGlzLm1zMiA9IG1zZm56KHRoaXMuZSwgdGhpcy5zaW5fcGhpLCB0aGlzLmNvc19waGkpO1xuICAgIHRoaXMubWwyID0gbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDIpO1xuICAgIHRoaXMubnMgPSAodGhpcy5tczEgLSB0aGlzLm1zMikgLyAodGhpcy5tbDIgLSB0aGlzLm1sMSk7XG4gIH1cbiAgdGhpcy5nID0gdGhpcy5tbDEgKyB0aGlzLm1zMSAvIHRoaXMubnM7XG4gIHRoaXMubWwwID0gbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDApO1xuICB0aGlzLnJoID0gdGhpcy5hICogKHRoaXMuZyAtIHRoaXMubWwwKTtcbn1cblxuLyogRXF1aWRpc3RhbnQgQ29uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciByaDE7XG5cbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHJoMSA9IHRoaXMuYSAqICh0aGlzLmcgLSBsYXQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtbCA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgbGF0KTtcbiAgICByaDEgPSB0aGlzLmEgKiAodGhpcy5nIC0gbWwpO1xuICB9XG4gIHZhciB0aGV0YSA9IHRoaXMubnMgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciB4ID0gdGhpcy54MCArIHJoMSAqIE1hdGguc2luKHRoZXRhKTtcbiAgdmFyIHkgPSB0aGlzLnkwICsgdGhpcy5yaCAtIHJoMSAqIE1hdGguY29zKHRoZXRhKTtcbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEludmVyc2UgZXF1YXRpb25zXG4gIC0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgPSB0aGlzLnJoIC0gcC55ICsgdGhpcy55MDtcbiAgdmFyIGNvbiwgcmgxLCBsYXQsIGxvbjtcbiAgaWYgKHRoaXMubnMgPj0gMCkge1xuICAgIHJoMSA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgIGNvbiA9IDE7XG4gIH0gZWxzZSB7XG4gICAgcmgxID0gLU1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgIGNvbiA9IC0xO1xuICB9XG4gIHZhciB0aGV0YSA9IDA7XG4gIGlmIChyaDEgIT09IDApIHtcbiAgICB0aGV0YSA9IE1hdGguYXRhbjIoY29uICogcC54LCBjb24gKiBwLnkpO1xuICB9XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgdGhldGEgLyB0aGlzLm5zLCB0aGlzLm92ZXIpO1xuICAgIGxhdCA9IGFkanVzdF9sYXQodGhpcy5nIC0gcmgxIC8gdGhpcy5hKTtcbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9IGVsc2Uge1xuICAgIHZhciBtbCA9IHRoaXMuZyAtIHJoMSAvIHRoaXMuYTtcbiAgICBsYXQgPSBpbWxmbihtbCwgdGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMyk7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgdGhldGEgLyB0aGlzLm5zLCB0aGlzLm92ZXIpO1xuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH1cbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnRXF1aWRpc3RhbnRfQ29uaWMnLCAnZXFkYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE4IEJlcm5pZSBKZW5ueSwgTW9uYXNoIFVuaXZlcnNpdHksIE1lbGJvdXJuZSwgQXVzdHJhbGlhLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEVxdWFsIEVhcnRoIGlzIGEgcHJvamVjdGlvbiBpbnNwaXJlZCBieSB0aGUgUm9iaW5zb24gcHJvamVjdGlvbiwgYnV0IHVubGlrZVxuICogdGhlIFJvYmluc29uIHByb2plY3Rpb24gcmV0YWlucyB0aGUgcmVsYXRpdmUgc2l6ZSBvZiBhcmVhcy4gVGhlIHByb2plY3Rpb25cbiAqIHdhcyBkZXNpZ25lZCBpbiAyMDE4IGJ5IEJvamFuIFNhdnJpYywgVG9tIFBhdHRlcnNvbiBhbmQgQmVybmhhcmQgSmVubnkuXG4gKlxuICogUHVibGljYXRpb246XG4gKiBCb2phbiBTYXZyaWMsIFRvbSBQYXR0ZXJzb24gJiBCZXJuaGFyZCBKZW5ueSAoMjAxOCkuIFRoZSBFcXVhbCBFYXJ0aCBtYXBcbiAqIHByb2plY3Rpb24sIEludGVybmF0aW9uYWwgSm91cm5hbCBvZiBHZW9ncmFwaGljYWwgSW5mb3JtYXRpb24gU2NpZW5jZSxcbiAqIERPSTogMTAuMTA4MC8xMzY1ODgxNi4yMDE4LjE1MDQ5NDlcbiAqXG4gKiBDb2RlIHJlbGVhc2VkIEF1Z3VzdCAyMDE4XG4gKiBQb3J0ZWQgdG8gSmF2YVNjcmlwdCBhbmQgYWRhcHRlZCBmb3IgbWFwc2hhcGVyLXByb2ogYnkgTWF0dGhldyBCbG9jaCBBdWd1c3QgMjAxOFxuICogTW9kaWZpZWQgZm9yIHByb2o0anMgYnkgQW5kcmVhcyBIb2NldmFyIGJ5IEFuZHJlYXMgSG9jZXZhciBNYXJjaCAyMDI0XG4gKi9cblxuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG52YXIgQTEgPSAxLjM0MDI2NCxcbiAgQTIgPSAtMC4wODExMDYsXG4gIEEzID0gMC4wMDA4OTMsXG4gIEE0ID0gMC4wMDM3OTYsXG4gIE0gPSBNYXRoLnNxcnQoMykgLyAyLjA7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLmVzID0gMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgIT09IHVuZGVmaW5lZCA/IHRoaXMubG9uZzAgOiAwO1xuICB0aGlzLngwID0gdGhpcy54MCAhPT0gdW5kZWZpbmVkID8gdGhpcy54MCA6IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwICE9PSB1bmRlZmluZWQgPyB0aGlzLnkwIDogMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbGFtID0gYWRqdXN0X2xvbihwLnggLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgcGhpID0gcC55O1xuICB2YXIgcGFyYW1MYXQgPSBNYXRoLmFzaW4oTSAqIE1hdGguc2luKHBoaSkpLFxuICAgIHBhcmFtTGF0U3EgPSBwYXJhbUxhdCAqIHBhcmFtTGF0LFxuICAgIHBhcmFtTGF0UG93NiA9IHBhcmFtTGF0U3EgKiBwYXJhbUxhdFNxICogcGFyYW1MYXRTcTtcbiAgcC54ID0gbGFtICogTWF0aC5jb3MocGFyYW1MYXQpXG4gICAgLyAoTSAqIChBMSArIDMgKiBBMiAqIHBhcmFtTGF0U3EgKyBwYXJhbUxhdFBvdzYgKiAoNyAqIEEzICsgOSAqIEE0ICogcGFyYW1MYXRTcSkpKTtcbiAgcC55ID0gcGFyYW1MYXQgKiAoQTEgKyBBMiAqIHBhcmFtTGF0U3EgKyBwYXJhbUxhdFBvdzYgKiAoQTMgKyBBNCAqIHBhcmFtTGF0U3EpKTtcblxuICBwLnggPSB0aGlzLmEgKiBwLnggKyB0aGlzLngwO1xuICBwLnkgPSB0aGlzLmEgKiBwLnkgKyB0aGlzLnkwO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggPSAocC54IC0gdGhpcy54MCkgLyB0aGlzLmE7XG4gIHAueSA9IChwLnkgLSB0aGlzLnkwKSAvIHRoaXMuYTtcblxuICB2YXIgRVBTID0gMWUtOSxcbiAgICBOSVRFUiA9IDEyLFxuICAgIHBhcmFtTGF0ID0gcC55LFxuICAgIHBhcmFtTGF0U3EsIHBhcmFtTGF0UG93NiwgZnksIGZweSwgZGxhdCwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgTklURVI7ICsraSkge1xuICAgIHBhcmFtTGF0U3EgPSBwYXJhbUxhdCAqIHBhcmFtTGF0O1xuICAgIHBhcmFtTGF0UG93NiA9IHBhcmFtTGF0U3EgKiBwYXJhbUxhdFNxICogcGFyYW1MYXRTcTtcbiAgICBmeSA9IHBhcmFtTGF0ICogKEExICsgQTIgKiBwYXJhbUxhdFNxICsgcGFyYW1MYXRQb3c2ICogKEEzICsgQTQgKiBwYXJhbUxhdFNxKSkgLSBwLnk7XG4gICAgZnB5ID0gQTEgKyAzICogQTIgKiBwYXJhbUxhdFNxICsgcGFyYW1MYXRQb3c2ICogKDcgKiBBMyArIDkgKiBBNCAqIHBhcmFtTGF0U3EpO1xuICAgIHBhcmFtTGF0IC09IGRsYXQgPSBmeSAvIGZweTtcbiAgICBpZiAoTWF0aC5hYnMoZGxhdCkgPCBFUFMpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBwYXJhbUxhdFNxID0gcGFyYW1MYXQgKiBwYXJhbUxhdDtcbiAgcGFyYW1MYXRQb3c2ID0gcGFyYW1MYXRTcSAqIHBhcmFtTGF0U3EgKiBwYXJhbUxhdFNxO1xuICBwLnggPSBNICogcC54ICogKEExICsgMyAqIEEyICogcGFyYW1MYXRTcSArIHBhcmFtTGF0UG93NiAqICg3ICogQTMgKyA5ICogQTQgKiBwYXJhbUxhdFNxKSlcbiAgICAvIE1hdGguY29zKHBhcmFtTGF0KTtcbiAgcC55ID0gTWF0aC5hc2luKE1hdGguc2luKHBhcmFtTGF0KSAvIE0pO1xuXG4gIHAueCA9IGFkanVzdF9sb24ocC54ICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ2VxZWFydGgnLCAnRXF1YWwgRWFydGgnLCAnRXF1YWxfRWFydGgnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiLy8gSGVhdmlseSBiYXNlZCBvbiB0aGlzIGV0bWVyYyBwcm9qZWN0aW9uIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWJsb2NoL21hcHNoYXBlci1wcm9qL2Jsb2IvbWFzdGVyL3NyYy9wcm9qZWN0aW9ucy9ldG1lcmMuanNcblxuaW1wb3J0IHRtZXJjIGZyb20gJy4uL3Byb2plY3Rpb25zL3RtZXJjJztcbmltcG9ydCBzaW5oIGZyb20gJy4uL2NvbW1vbi9zaW5oJztcbmltcG9ydCBoeXBvdCBmcm9tICcuLi9jb21tb24vaHlwb3QnO1xuaW1wb3J0IGFzaW5oeSBmcm9tICcuLi9jb21tb24vYXNpbmh5JztcbmltcG9ydCBnYXRnIGZyb20gJy4uL2NvbW1vbi9nYXRnJztcbmltcG9ydCBjbGVucyBmcm9tICcuLi9jb21tb24vY2xlbnMnO1xuaW1wb3J0IGNsZW5zX2NtcGx4IGZyb20gJy4uL2NvbW1vbi9jbGVuc19jbXBseCc7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gY2JnXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGNnYlxuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSB1dGdcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gZ3R1XG4gKiBAcHJvcGVydHkge251bWJlcn0gUW5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBaYlxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgaWYgKCF0aGlzLmFwcHJveCAmJiAoaXNOYU4odGhpcy5lcykgfHwgdGhpcy5lcyA8PSAwKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IGVsbGlwdGljYWwgdXNhZ2UuIFRyeSB1c2luZyB0aGUgK2FwcHJveCBvcHRpb24gaW4gdGhlIHByb2ogc3RyaW5nLCBvciBQUk9KRUNUSU9OW1wiRmFzdF9UcmFuc3ZlcnNlX01lcmNhdG9yXCJdIGluIHRoZSBXS1QuJyk7XG4gIH1cbiAgaWYgKHRoaXMuYXBwcm94KSB7XG4gICAgLy8gV2hlbiAnK2FwcHJveCcgaXMgc2V0LCB1c2UgdG1lcmMgaW5zdGVhZFxuICAgIHRtZXJjLmluaXQuYXBwbHkodGhpcyk7XG4gICAgdGhpcy5mb3J3YXJkID0gdG1lcmMuZm9yd2FyZDtcbiAgICB0aGlzLmludmVyc2UgPSB0bWVyYy5pbnZlcnNlO1xuICB9XG5cbiAgdGhpcy54MCA9IHRoaXMueDAgIT09IHVuZGVmaW5lZCA/IHRoaXMueDAgOiAwO1xuICB0aGlzLnkwID0gdGhpcy55MCAhPT0gdW5kZWZpbmVkID8gdGhpcy55MCA6IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwICE9PSB1bmRlZmluZWQgPyB0aGlzLmxvbmcwIDogMDtcbiAgdGhpcy5sYXQwID0gdGhpcy5sYXQwICE9PSB1bmRlZmluZWQgPyB0aGlzLmxhdDAgOiAwO1xuXG4gIHRoaXMuY2diID0gW107XG4gIHRoaXMuY2JnID0gW107XG4gIHRoaXMudXRnID0gW107XG4gIHRoaXMuZ3R1ID0gW107XG5cbiAgdmFyIGYgPSB0aGlzLmVzIC8gKDEgKyBNYXRoLnNxcnQoMSAtIHRoaXMuZXMpKTtcbiAgdmFyIG4gPSBmIC8gKDIgLSBmKTtcbiAgdmFyIG5wID0gbjtcblxuICB0aGlzLmNnYlswXSA9IG4gKiAoMiArIG4gKiAoLTIgLyAzICsgbiAqICgtMiArIG4gKiAoMTE2IC8gNDUgKyBuICogKDI2IC8gNDUgKyBuICogKC0yODU0IC8gNjc1KSkpKSkpO1xuICB0aGlzLmNiZ1swXSA9IG4gKiAoLTIgKyBuICogKDIgLyAzICsgbiAqICg0IC8gMyArIG4gKiAoLTgyIC8gNDUgKyBuICogKDMyIC8gNDUgKyBuICogKDQ2NDIgLyA0NzI1KSkpKSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLmNnYlsxXSA9IG5wICogKDcgLyAzICsgbiAqICgtOCAvIDUgKyBuICogKC0yMjcgLyA0NSArIG4gKiAoMjcwNCAvIDMxNSArIG4gKiAoMjMyMyAvIDk0NSkpKSkpO1xuICB0aGlzLmNiZ1sxXSA9IG5wICogKDUgLyAzICsgbiAqICgtMTYgLyAxNSArIG4gKiAoLTEzIC8gOSArIG4gKiAoOTA0IC8gMzE1ICsgbiAqICgtMTUyMiAvIDk0NSkpKSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLmNnYlsyXSA9IG5wICogKDU2IC8gMTUgKyBuICogKC0xMzYgLyAzNSArIG4gKiAoLTEyNjIgLyAxMDUgKyBuICogKDczODE0IC8gMjgzNSkpKSk7XG4gIHRoaXMuY2JnWzJdID0gbnAgKiAoLTI2IC8gMTUgKyBuICogKDM0IC8gMjEgKyBuICogKDggLyA1ICsgbiAqICgtMTI2ODYgLyAyODM1KSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy5jZ2JbM10gPSBucCAqICg0Mjc5IC8gNjMwICsgbiAqICgtMzMyIC8gMzUgKyBuICogKC0zOTk1NzIgLyAxNDE3NSkpKTtcbiAgdGhpcy5jYmdbM10gPSBucCAqICgxMjM3IC8gNjMwICsgbiAqICgtMTIgLyA1ICsgbiAqICgtMjQ4MzIgLyAxNDE3NSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy5jZ2JbNF0gPSBucCAqICg0MTc0IC8gMzE1ICsgbiAqICgtMTQ0ODM4IC8gNjIzNykpO1xuICB0aGlzLmNiZ1s0XSA9IG5wICogKC03MzQgLyAzMTUgKyBuICogKDEwOTU5OCAvIDMxMTg1KSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMuY2diWzVdID0gbnAgKiAoNjAxNjc2IC8gMjIyNzUpO1xuICB0aGlzLmNiZ1s1XSA9IG5wICogKDQ0NDMzNyAvIDE1NTkyNSk7XG5cbiAgbnAgPSBNYXRoLnBvdyhuLCAyKTtcbiAgdGhpcy5RbiA9IHRoaXMuazAgLyAoMSArIG4pICogKDEgKyBucCAqICgxIC8gNCArIG5wICogKDEgLyA2NCArIG5wIC8gMjU2KSkpO1xuXG4gIHRoaXMudXRnWzBdID0gbiAqICgtMC41ICsgbiAqICgyIC8gMyArIG4gKiAoLTM3IC8gOTYgKyBuICogKDEgLyAzNjAgKyBuICogKDgxIC8gNTEyICsgbiAqICgtOTYxOTkgLyA2MDQ4MDApKSkpKSk7XG4gIHRoaXMuZ3R1WzBdID0gbiAqICgwLjUgKyBuICogKC0yIC8gMyArIG4gKiAoNSAvIDE2ICsgbiAqICg0MSAvIDE4MCArIG4gKiAoLTEyNyAvIDI4OCArIG4gKiAoNzg5MSAvIDM3ODAwKSkpKSkpO1xuXG4gIHRoaXMudXRnWzFdID0gbnAgKiAoLTEgLyA0OCArIG4gKiAoLTEgLyAxNSArIG4gKiAoNDM3IC8gMTQ0MCArIG4gKiAoLTQ2IC8gMTA1ICsgbiAqICgxMTE4NzExIC8gMzg3MDcyMCkpKSkpO1xuICB0aGlzLmd0dVsxXSA9IG5wICogKDEzIC8gNDggKyBuICogKC0zIC8gNSArIG4gKiAoNTU3IC8gMTQ0MCArIG4gKiAoMjgxIC8gNjMwICsgbiAqICgtMTk4MzQzMyAvIDE5MzUzNjApKSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy51dGdbMl0gPSBucCAqICgtMTcgLyA0ODAgKyBuICogKDM3IC8gODQwICsgbiAqICgyMDkgLyA0NDgwICsgbiAqICgtNTU2OSAvIDkwNzIwKSkpKTtcbiAgdGhpcy5ndHVbMl0gPSBucCAqICg2MSAvIDI0MCArIG4gKiAoLTEwMyAvIDE0MCArIG4gKiAoMTUwNjEgLyAyNjg4MCArIG4gKiAoMTY3NjAzIC8gMTgxNDQwKSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy51dGdbM10gPSBucCAqICgtNDM5NyAvIDE2MTI4MCArIG4gKiAoMTEgLyA1MDQgKyBuICogKDgzMDI1MSAvIDcyNTc2MDApKSk7XG4gIHRoaXMuZ3R1WzNdID0gbnAgKiAoNDk1NjEgLyAxNjEyODAgKyBuICogKC0xNzkgLyAxNjggKyBuICogKDY2MDE2NjEgLyA3MjU3NjAwKSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLnV0Z1s0XSA9IG5wICogKC00NTgzIC8gMTYxMjgwICsgbiAqICgxMDg4NDcgLyAzOTkxNjgwKSk7XG4gIHRoaXMuZ3R1WzRdID0gbnAgKiAoMzQ3MjkgLyA4MDY0MCArIG4gKiAoLTM0MTg4ODkgLyAxOTk1ODQwKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMudXRnWzVdID0gbnAgKiAoLTIwNjQ4NjkzIC8gNjM4NjY4ODAwKTtcbiAgdGhpcy5ndHVbNV0gPSBucCAqICgyMTIzNzg5NDEgLyAzMTkzMzQ0MDApO1xuXG4gIHZhciBaID0gZ2F0Zyh0aGlzLmNiZywgdGhpcy5sYXQwKTtcbiAgdGhpcy5aYiA9IC10aGlzLlFuICogKFogKyBjbGVucyh0aGlzLmd0dSwgMiAqIFopKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgQ2UgPSBhZGp1c3RfbG9uKHAueCAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciBDbiA9IHAueTtcblxuICBDbiA9IGdhdGcodGhpcy5jYmcsIENuKTtcbiAgdmFyIHNpbl9DbiA9IE1hdGguc2luKENuKTtcbiAgdmFyIGNvc19DbiA9IE1hdGguY29zKENuKTtcbiAgdmFyIHNpbl9DZSA9IE1hdGguc2luKENlKTtcbiAgdmFyIGNvc19DZSA9IE1hdGguY29zKENlKTtcblxuICBDbiA9IE1hdGguYXRhbjIoc2luX0NuLCBjb3NfQ2UgKiBjb3NfQ24pO1xuICBDZSA9IE1hdGguYXRhbjIoc2luX0NlICogY29zX0NuLCBoeXBvdChzaW5fQ24sIGNvc19DbiAqIGNvc19DZSkpO1xuICBDZSA9IGFzaW5oeShNYXRoLnRhbihDZSkpO1xuXG4gIHZhciB0bXAgPSBjbGVuc19jbXBseCh0aGlzLmd0dSwgMiAqIENuLCAyICogQ2UpO1xuXG4gIENuID0gQ24gKyB0bXBbMF07XG4gIENlID0gQ2UgKyB0bXBbMV07XG5cbiAgdmFyIHg7XG4gIHZhciB5O1xuXG4gIGlmIChNYXRoLmFicyhDZSkgPD0gMi42MjMzOTUxNjI3NzgpIHtcbiAgICB4ID0gdGhpcy5hICogKHRoaXMuUW4gKiBDZSkgKyB0aGlzLngwO1xuICAgIHkgPSB0aGlzLmEgKiAodGhpcy5RbiAqIENuICsgdGhpcy5aYikgKyB0aGlzLnkwO1xuICB9IGVsc2Uge1xuICAgIHggPSBJbmZpbml0eTtcbiAgICB5ID0gSW5maW5pdHk7XG4gIH1cblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuXG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBDZSA9IChwLnggLSB0aGlzLngwKSAqICgxIC8gdGhpcy5hKTtcbiAgdmFyIENuID0gKHAueSAtIHRoaXMueTApICogKDEgLyB0aGlzLmEpO1xuXG4gIENuID0gKENuIC0gdGhpcy5aYikgLyB0aGlzLlFuO1xuICBDZSA9IENlIC8gdGhpcy5RbjtcblxuICB2YXIgbG9uO1xuICB2YXIgbGF0O1xuXG4gIGlmIChNYXRoLmFicyhDZSkgPD0gMi42MjMzOTUxNjI3NzgpIHtcbiAgICB2YXIgdG1wID0gY2xlbnNfY21wbHgodGhpcy51dGcsIDIgKiBDbiwgMiAqIENlKTtcblxuICAgIENuID0gQ24gKyB0bXBbMF07XG4gICAgQ2UgPSBDZSArIHRtcFsxXTtcbiAgICBDZSA9IE1hdGguYXRhbihzaW5oKENlKSk7XG5cbiAgICB2YXIgc2luX0NuID0gTWF0aC5zaW4oQ24pO1xuICAgIHZhciBjb3NfQ24gPSBNYXRoLmNvcyhDbik7XG4gICAgdmFyIHNpbl9DZSA9IE1hdGguc2luKENlKTtcbiAgICB2YXIgY29zX0NlID0gTWF0aC5jb3MoQ2UpO1xuXG4gICAgQ24gPSBNYXRoLmF0YW4yKHNpbl9DbiAqIGNvc19DZSwgaHlwb3Qoc2luX0NlLCBjb3NfQ2UgKiBjb3NfQ24pKTtcbiAgICBDZSA9IE1hdGguYXRhbjIoc2luX0NlLCBjb3NfQ2UgKiBjb3NfQ24pO1xuXG4gICAgbG9uID0gYWRqdXN0X2xvbihDZSArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gICAgbGF0ID0gZ2F0Zyh0aGlzLmNnYiwgQ24pO1xuICB9IGVsc2Uge1xuICAgIGxvbiA9IEluZmluaXR5O1xuICAgIGxhdCA9IEluZmluaXR5O1xuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG5cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0V4dGVuZGVkX1RyYW5zdmVyc2VfTWVyY2F0b3InLCAnRXh0ZW5kZWQgVHJhbnN2ZXJzZSBNZXJjYXRvcicsICdldG1lcmMnLCAnVHJhbnN2ZXJzZV9NZXJjYXRvcicsICdUcmFuc3ZlcnNlIE1lcmNhdG9yJywgJ0dhdXNzIEtydWdlcicsICdHYXVzc19LcnVnZXInLCAndG1lcmMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHNyYXQgZnJvbSAnLi4vY29tbW9uL3NyYXQnO1xudmFyIE1BWF9JVEVSID0gMjA7XG5pbXBvcnQgeyBIQUxGX1BJLCBGT1JUUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByY1xuICogQHByb3BlcnR5IHtudW1iZXJ9IENcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwaGljMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJhdGV4cFxuICogQHByb3BlcnR5IHtudW1iZXJ9IEtcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBzcGhpID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgdmFyIGNwaGkgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICBjcGhpICo9IGNwaGk7XG4gIHRoaXMucmMgPSBNYXRoLnNxcnQoMSAtIHRoaXMuZXMpIC8gKDEgLSB0aGlzLmVzICogc3BoaSAqIHNwaGkpO1xuICB0aGlzLkMgPSBNYXRoLnNxcnQoMSArIHRoaXMuZXMgKiBjcGhpICogY3BoaSAvICgxIC0gdGhpcy5lcykpO1xuICB0aGlzLnBoaWMwID0gTWF0aC5hc2luKHNwaGkgLyB0aGlzLkMpO1xuICB0aGlzLnJhdGV4cCA9IDAuNSAqIHRoaXMuQyAqIHRoaXMuZTtcbiAgdGhpcy5LID0gTWF0aC50YW4oMC41ICogdGhpcy5waGljMCArIEZPUlRQSSkgLyAoTWF0aC5wb3coTWF0aC50YW4oMC41ICogdGhpcy5sYXQwICsgRk9SVFBJKSwgdGhpcy5DKSAqIHNyYXQodGhpcy5lICogc3BoaSwgdGhpcy5yYXRleHApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHAueSA9IDIgKiBNYXRoLmF0YW4odGhpcy5LICogTWF0aC5wb3coTWF0aC50YW4oMC41ICogbGF0ICsgRk9SVFBJKSwgdGhpcy5DKSAqIHNyYXQodGhpcy5lICogTWF0aC5zaW4obGF0KSwgdGhpcy5yYXRleHApKSAtIEhBTEZfUEk7XG4gIHAueCA9IHRoaXMuQyAqIGxvbjtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIERFTF9UT0wgPSAxZS0xNDtcbiAgdmFyIGxvbiA9IHAueCAvIHRoaXMuQztcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIG51bSA9IE1hdGgucG93KE1hdGgudGFuKDAuNSAqIGxhdCArIEZPUlRQSSkgLyB0aGlzLkssIDEgLyB0aGlzLkMpO1xuICBmb3IgKHZhciBpID0gTUFYX0lURVI7IGkgPiAwOyAtLWkpIHtcbiAgICBsYXQgPSAyICogTWF0aC5hdGFuKG51bSAqIHNyYXQodGhpcy5lICogTWF0aC5zaW4ocC55KSwgLTAuNSAqIHRoaXMuZSkpIC0gSEFMRl9QSTtcbiAgICBpZiAoTWF0aC5hYnMobGF0IC0gcC55KSA8IERFTF9UT0wpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwLnkgPSBsYXQ7XG4gIH1cbiAgLyogY29udmVyZ2VuY2UgZmFpbGVkICovXG4gIGlmICghaSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnZ2F1c3MnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHtcbiAgZ2VvZGV0aWNUb0dlb2NlbnRyaWMsXG4gIGdlb2NlbnRyaWNUb0dlb2RldGljXG59IGZyb20gJy4uL2RhdHVtVXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy5uYW1lID0gJ2dlb2NlbnQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBwb2ludCA9IGdlb2RldGljVG9HZW9jZW50cmljKHAsIHRoaXMuZXMsIHRoaXMuYSk7XG4gIHJldHVybiBwb2ludDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgcG9pbnQgPSBnZW9jZW50cmljVG9HZW9kZXRpYyhwLCB0aGlzLmVzLCB0aGlzLmEsIHRoaXMuYik7XG4gIHJldHVybiBwb2ludDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnR2VvY2VudHJpYycsICdnZW9jZW50cmljJywgJ2dlb2NlbnQnLCAnR2VvY2VudCddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgaHlwb3QgZnJvbSAnLi4vY29tbW9uL2h5cG90JztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7MSB8IDB9IGZsaXBfYXhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGhcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByYWRpdXNfZ18xXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmFkaXVzX2dcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByYWRpdXNfcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1c19wMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1c19wX2ludjJcbiAqIEBwcm9wZXJ0eSB7J2VsbGlwc2UnfCdzcGhlcmUnfSBzaGFwZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IENcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzd2VlcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLmZsaXBfYXhpcyA9ICh0aGlzLnN3ZWVwID09PSAneCcgPyAxIDogMCk7XG4gIHRoaXMuaCA9IE51bWJlcih0aGlzLmgpO1xuICB0aGlzLnJhZGl1c19nXzEgPSB0aGlzLmggLyB0aGlzLmE7XG5cbiAgaWYgKHRoaXMucmFkaXVzX2dfMSA8PSAwIHx8IHRoaXMucmFkaXVzX2dfMSA+IDFlMTApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgfVxuXG4gIHRoaXMucmFkaXVzX2cgPSAxLjAgKyB0aGlzLnJhZGl1c19nXzE7XG4gIHRoaXMuQyA9IHRoaXMucmFkaXVzX2cgKiB0aGlzLnJhZGl1c19nIC0gMS4wO1xuXG4gIGlmICh0aGlzLmVzICE9PSAwLjApIHtcbiAgICB2YXIgb25lX2VzID0gMS4wIC0gdGhpcy5lcztcbiAgICB2YXIgcm9uZV9lcyA9IDEgLyBvbmVfZXM7XG5cbiAgICB0aGlzLnJhZGl1c19wID0gTWF0aC5zcXJ0KG9uZV9lcyk7XG4gICAgdGhpcy5yYWRpdXNfcDIgPSBvbmVfZXM7XG4gICAgdGhpcy5yYWRpdXNfcF9pbnYyID0gcm9uZV9lcztcblxuICAgIHRoaXMuc2hhcGUgPSAnZWxsaXBzZSc7IC8vIFVzZSBhcyBhIGNvbmRpdGlvbiBpbiB0aGUgZm9yd2FyZCBhbmQgaW52ZXJzZSBmdW5jdGlvbnMuXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yYWRpdXNfcCA9IDEuMDtcbiAgICB0aGlzLnJhZGl1c19wMiA9IDEuMDtcbiAgICB0aGlzLnJhZGl1c19wX2ludjIgPSAxLjA7XG5cbiAgICB0aGlzLnNoYXBlID0gJ3NwaGVyZSc7IC8vIFVzZSBhcyBhIGNvbmRpdGlvbiBpbiB0aGUgZm9yd2FyZCBhbmQgaW52ZXJzZSBmdW5jdGlvbnMuXG4gIH1cblxuICBpZiAoIXRoaXMudGl0bGUpIHtcbiAgICB0aGlzLnRpdGxlID0gJ0dlb3N0YXRpb25hcnkgU2F0ZWxsaXRlIFZpZXcnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgdG1wLCB2X3gsIHZfeSwgdl96O1xuICBsb24gPSBsb24gLSB0aGlzLmxvbmcwO1xuXG4gIGlmICh0aGlzLnNoYXBlID09PSAnZWxsaXBzZScpIHtcbiAgICBsYXQgPSBNYXRoLmF0YW4odGhpcy5yYWRpdXNfcDIgKiBNYXRoLnRhbihsYXQpKTtcbiAgICB2YXIgciA9IHRoaXMucmFkaXVzX3AgLyBoeXBvdCh0aGlzLnJhZGl1c19wICogTWF0aC5jb3MobGF0KSwgTWF0aC5zaW4obGF0KSk7XG5cbiAgICB2X3ggPSByICogTWF0aC5jb3MobG9uKSAqIE1hdGguY29zKGxhdCk7XG4gICAgdl95ID0gciAqIE1hdGguc2luKGxvbikgKiBNYXRoLmNvcyhsYXQpO1xuICAgIHZfeiA9IHIgKiBNYXRoLnNpbihsYXQpO1xuXG4gICAgaWYgKCgodGhpcy5yYWRpdXNfZyAtIHZfeCkgKiB2X3ggLSB2X3kgKiB2X3kgLSB2X3ogKiB2X3ogKiB0aGlzLnJhZGl1c19wX2ludjIpIDwgMC4wKSB7XG4gICAgICBwLnggPSBOdW1iZXIuTmFOO1xuICAgICAgcC55ID0gTnVtYmVyLk5hTjtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIHRtcCA9IHRoaXMucmFkaXVzX2cgLSB2X3g7XG4gICAgaWYgKHRoaXMuZmxpcF9heGlzKSB7XG4gICAgICBwLnggPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl95IC8gaHlwb3Qodl96LCB0bXApKTtcbiAgICAgIHAueSA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3ogLyB0bXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnggPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl95IC8gdG1wKTtcbiAgICAgIHAueSA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3ogLyBoeXBvdCh2X3ksIHRtcCkpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0aGlzLnNoYXBlID09PSAnc3BoZXJlJykge1xuICAgIHRtcCA9IE1hdGguY29zKGxhdCk7XG4gICAgdl94ID0gTWF0aC5jb3MobG9uKSAqIHRtcDtcbiAgICB2X3kgPSBNYXRoLnNpbihsb24pICogdG1wO1xuICAgIHZfeiA9IE1hdGguc2luKGxhdCk7XG4gICAgdG1wID0gdGhpcy5yYWRpdXNfZyAtIHZfeDtcblxuICAgIGlmICh0aGlzLmZsaXBfYXhpcykge1xuICAgICAgcC54ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeSAvIGh5cG90KHZfeiwgdG1wKSk7XG4gICAgICBwLnkgPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl96IC8gdG1wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeSAvIHRtcCk7XG4gICAgICBwLnkgPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl96IC8gaHlwb3Qodl95LCB0bXApKTtcbiAgICB9XG4gIH1cbiAgcC54ID0gcC54ICogdGhpcy5hO1xuICBwLnkgPSBwLnkgKiB0aGlzLmE7XG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHZfeCA9IC0xLjA7XG4gIHZhciB2X3kgPSAwLjA7XG4gIHZhciB2X3ogPSAwLjA7XG4gIHZhciBhLCBiLCBkZXQsIGs7XG5cbiAgcC54ID0gcC54IC8gdGhpcy5hO1xuICBwLnkgPSBwLnkgLyB0aGlzLmE7XG5cbiAgaWYgKHRoaXMuc2hhcGUgPT09ICdlbGxpcHNlJykge1xuICAgIGlmICh0aGlzLmZsaXBfYXhpcykge1xuICAgICAgdl96ID0gTWF0aC50YW4ocC55IC8gdGhpcy5yYWRpdXNfZ18xKTtcbiAgICAgIHZfeSA9IE1hdGgudGFuKHAueCAvIHRoaXMucmFkaXVzX2dfMSkgKiBoeXBvdCgxLjAsIHZfeik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZfeSA9IE1hdGgudGFuKHAueCAvIHRoaXMucmFkaXVzX2dfMSk7XG4gICAgICB2X3ogPSBNYXRoLnRhbihwLnkgLyB0aGlzLnJhZGl1c19nXzEpICogaHlwb3QoMS4wLCB2X3kpO1xuICAgIH1cblxuICAgIHZhciB2X3pwID0gdl96IC8gdGhpcy5yYWRpdXNfcDtcbiAgICBhID0gdl95ICogdl95ICsgdl96cCAqIHZfenAgKyB2X3ggKiB2X3g7XG4gICAgYiA9IDIgKiB0aGlzLnJhZGl1c19nICogdl94O1xuICAgIGRldCA9IChiICogYikgLSA0ICogYSAqIHRoaXMuQztcblxuICAgIGlmIChkZXQgPCAwLjApIHtcbiAgICAgIHAueCA9IE51bWJlci5OYU47XG4gICAgICBwLnkgPSBOdW1iZXIuTmFOO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgayA9ICgtYiAtIE1hdGguc3FydChkZXQpKSAvICgyLjAgKiBhKTtcbiAgICB2X3ggPSB0aGlzLnJhZGl1c19nICsgayAqIHZfeDtcbiAgICB2X3kgKj0gaztcbiAgICB2X3ogKj0gaztcblxuICAgIHAueCA9IE1hdGguYXRhbjIodl95LCB2X3gpO1xuICAgIHAueSA9IE1hdGguYXRhbih2X3ogKiBNYXRoLmNvcyhwLngpIC8gdl94KTtcbiAgICBwLnkgPSBNYXRoLmF0YW4odGhpcy5yYWRpdXNfcF9pbnYyICogTWF0aC50YW4ocC55KSk7XG4gIH0gZWxzZSBpZiAodGhpcy5zaGFwZSA9PT0gJ3NwaGVyZScpIHtcbiAgICBpZiAodGhpcy5mbGlwX2F4aXMpIHtcbiAgICAgIHZfeiA9IE1hdGgudGFuKHAueSAvIHRoaXMucmFkaXVzX2dfMSk7XG4gICAgICB2X3kgPSBNYXRoLnRhbihwLnggLyB0aGlzLnJhZGl1c19nXzEpICogTWF0aC5zcXJ0KDEuMCArIHZfeiAqIHZfeik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZfeSA9IE1hdGgudGFuKHAueCAvIHRoaXMucmFkaXVzX2dfMSk7XG4gICAgICB2X3ogPSBNYXRoLnRhbihwLnkgLyB0aGlzLnJhZGl1c19nXzEpICogTWF0aC5zcXJ0KDEuMCArIHZfeSAqIHZfeSk7XG4gICAgfVxuXG4gICAgYSA9IHZfeSAqIHZfeSArIHZfeiAqIHZfeiArIHZfeCAqIHZfeDtcbiAgICBiID0gMiAqIHRoaXMucmFkaXVzX2cgKiB2X3g7XG4gICAgZGV0ID0gKGIgKiBiKSAtIDQgKiBhICogdGhpcy5DO1xuICAgIGlmIChkZXQgPCAwLjApIHtcbiAgICAgIHAueCA9IE51bWJlci5OYU47XG4gICAgICBwLnkgPSBOdW1iZXIuTmFOO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgayA9ICgtYiAtIE1hdGguc3FydChkZXQpKSAvICgyLjAgKiBhKTtcbiAgICB2X3ggPSB0aGlzLnJhZGl1c19nICsgayAqIHZfeDtcbiAgICB2X3kgKj0gaztcbiAgICB2X3ogKj0gaztcblxuICAgIHAueCA9IE1hdGguYXRhbjIodl95LCB2X3gpO1xuICAgIHAueSA9IE1hdGguYXRhbih2X3ogKiBNYXRoLmNvcyhwLngpIC8gdl94KTtcbiAgfVxuICBwLnggPSBwLnggKyB0aGlzLmxvbmcwO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnR2Vvc3RhdGlvbmFyeSBTYXRlbGxpdGUgVmlldycsICdHZW9zdGF0aW9uYXJ5X1NhdGVsbGl0ZScsICdnZW9zJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuaW1wb3J0IHsgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5fcDE0XG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zX3AxNFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGluZmluaXR5X2Rpc3RcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByY1xuICovXG5cbi8qKlxuICByZWZlcmVuY2U6XG4gICAgV29sZnJhbSBNYXRod29ybGQgXCJHbm9tb25pYyBQcm9qZWN0aW9uXCJcbiAgICBodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL0dub21vbmljUHJvamVjdGlvbi5odG1sXG4gICAgQWNjZXNzZWQ6IDEydGggTm92ZW1iZXIgMjAwOVxuICAgQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB0aGlzLnNpbl9wMTQgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB0aGlzLmNvc19wMTQgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICAvLyBBcHByb3hpbWF0aW9uIGZvciBwcm9qZWN0aW5nIHBvaW50cyB0byB0aGUgaG9yaXpvbiAoaW5maW5pdHkpXG4gIHRoaXMuaW5maW5pdHlfZGlzdCA9IDEwMDAgKiB0aGlzLmE7XG4gIHRoaXMucmMgPSAxO1xufVxuXG4vKiBHbm9tb25pYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHNpbnBoaSwgY29zcGhpOyAvKiBzaW4gYW5kIGNvcyB2YWx1ZSAgICAgICAgKi9cbiAgdmFyIGRsb247IC8qIGRlbHRhIGxvbmdpdHVkZSB2YWx1ZSAgICAgICovXG4gIHZhciBjb3Nsb247IC8qIGNvcyBvZiBsb25naXR1ZGUgICAgICAgICovXG4gIHZhciBrc3A7IC8qIHNjYWxlIGZhY3RvciAgICAgICAgICAqL1xuICB2YXIgZztcbiAgdmFyIHgsIHk7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuXG4gIHNpbnBoaSA9IE1hdGguc2luKGxhdCk7XG4gIGNvc3BoaSA9IE1hdGguY29zKGxhdCk7XG5cbiAgY29zbG9uID0gTWF0aC5jb3MoZGxvbik7XG4gIGcgPSB0aGlzLnNpbl9wMTQgKiBzaW5waGkgKyB0aGlzLmNvc19wMTQgKiBjb3NwaGkgKiBjb3Nsb247XG4gIGtzcCA9IDE7XG4gIGlmICgoZyA+IDApIHx8IChNYXRoLmFicyhnKSA8PSBFUFNMTikpIHtcbiAgICB4ID0gdGhpcy54MCArIHRoaXMuYSAqIGtzcCAqIGNvc3BoaSAqIE1hdGguc2luKGRsb24pIC8gZztcbiAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIGtzcCAqICh0aGlzLmNvc19wMTQgKiBzaW5waGkgLSB0aGlzLnNpbl9wMTQgKiBjb3NwaGkgKiBjb3Nsb24pIC8gZztcbiAgfSBlbHNlIHtcbiAgICAvLyBQb2ludCBpcyBpbiB0aGUgb3Bwb3NpbmcgaGVtaXNwaGVyZSBhbmQgaXMgdW5wcm9qZWN0YWJsZVxuICAgIC8vIFdlIHN0aWxsIG5lZWQgdG8gcmV0dXJuIGEgcmVhc29uYWJsZSBwb2ludCwgc28gd2UgcHJvamVjdFxuICAgIC8vIHRvIGluZmluaXR5LCBvbiBhIGJlYXJpbmdcbiAgICAvLyBlcXVpdmFsZW50IHRvIHRoZSBub3J0aGVybiBoZW1pc3BoZXJlIGVxdWl2YWxlbnRcbiAgICAvLyBUaGlzIGlzIGEgcmVhc29uYWJsZSBhcHByb3hpbWF0aW9uIGZvciBzaG9ydCBzaGFwZXMgYW5kIGxpbmVzIHRoYXRcbiAgICAvLyBzdHJhZGRsZSB0aGUgaG9yaXpvbi5cblxuICAgIHggPSB0aGlzLngwICsgdGhpcy5pbmZpbml0eV9kaXN0ICogY29zcGhpICogTWF0aC5zaW4oZGxvbik7XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmluZmluaXR5X2Rpc3QgKiAodGhpcy5jb3NfcDE0ICogc2lucGhpIC0gdGhpcy5zaW5fcDE0ICogY29zcGhpICogY29zbG9uKTtcbiAgfVxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgcmg7IC8qIFJobyAqL1xuICB2YXIgc2luYywgY29zYztcbiAgdmFyIGM7XG4gIHZhciBsb24sIGxhdDtcblxuICAvKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgcC54ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5hO1xuICBwLnkgPSAocC55IC0gdGhpcy55MCkgLyB0aGlzLmE7XG5cbiAgcC54IC89IHRoaXMuazA7XG4gIHAueSAvPSB0aGlzLmswO1xuXG4gIGlmICgocmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KSkpIHtcbiAgICBjID0gTWF0aC5hdGFuMihyaCwgdGhpcy5yYyk7XG4gICAgc2luYyA9IE1hdGguc2luKGMpO1xuICAgIGNvc2MgPSBNYXRoLmNvcyhjKTtcblxuICAgIGxhdCA9IGFzaW56KGNvc2MgKiB0aGlzLnNpbl9wMTQgKyAocC55ICogc2luYyAqIHRoaXMuY29zX3AxNCkgLyByaCk7XG4gICAgbG9uID0gTWF0aC5hdGFuMihwLnggKiBzaW5jLCByaCAqIHRoaXMuY29zX3AxNCAqIGNvc2MgLSBwLnkgKiB0aGlzLnNpbl9wMTQgKiBzaW5jKTtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBsb24sIHRoaXMub3Zlcik7XG4gIH0gZWxzZSB7XG4gICAgbGF0ID0gdGhpcy5waGljMDtcbiAgICBsb24gPSAwO1xuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydnbm9tJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMuYSA9IDYzNzczOTcuMTU1O1xuICB0aGlzLmVzID0gMC4wMDY2NzQzNzIyMzA2MTQ7XG4gIHRoaXMuZSA9IE1hdGguc3FydCh0aGlzLmVzKTtcbiAgaWYgKCF0aGlzLmxhdDApIHtcbiAgICB0aGlzLmxhdDAgPSAwLjg2MzkzNzk3OTczNzE5MztcbiAgfVxuICBpZiAoIXRoaXMubG9uZzApIHtcbiAgICB0aGlzLmxvbmcwID0gMC43NDE3NjQ5MzIwOTc1OTAxIC0gMC4zMDgzNDE1MDExODU2NjU7XG4gIH1cbiAgLyogaWYgc2NhbGUgbm90IHNldCBkZWZhdWx0IHRvIDAuOTk5OSAqL1xuICBpZiAoIXRoaXMuazApIHtcbiAgICB0aGlzLmswID0gMC45OTk5O1xuICB9XG4gIHRoaXMuczQ1ID0gMC43ODUzOTgxNjMzOTc0NDg7IC8qIDQ1ICovXG4gIHRoaXMuczkwID0gMiAqIHRoaXMuczQ1O1xuICB0aGlzLmZpMCA9IHRoaXMubGF0MDtcbiAgdGhpcy5lMiA9IHRoaXMuZXM7XG4gIHRoaXMuZSA9IE1hdGguc3FydCh0aGlzLmUyKTtcbiAgdGhpcy5hbGZhID0gTWF0aC5zcXJ0KDEgKyAodGhpcy5lMiAqIE1hdGgucG93KE1hdGguY29zKHRoaXMuZmkwKSwgNCkpIC8gKDEgLSB0aGlzLmUyKSk7XG4gIHRoaXMudXEgPSAxLjA0MjE2ODU2MzgwNDc0O1xuICB0aGlzLnUwID0gTWF0aC5hc2luKE1hdGguc2luKHRoaXMuZmkwKSAvIHRoaXMuYWxmYSk7XG4gIHRoaXMuZyA9IE1hdGgucG93KCgxICsgdGhpcy5lICogTWF0aC5zaW4odGhpcy5maTApKSAvICgxIC0gdGhpcy5lICogTWF0aC5zaW4odGhpcy5maTApKSwgdGhpcy5hbGZhICogdGhpcy5lIC8gMik7XG4gIHRoaXMuayA9IE1hdGgudGFuKHRoaXMudTAgLyAyICsgdGhpcy5zNDUpIC8gTWF0aC5wb3coTWF0aC50YW4odGhpcy5maTAgLyAyICsgdGhpcy5zNDUpLCB0aGlzLmFsZmEpICogdGhpcy5nO1xuICB0aGlzLmsxID0gdGhpcy5rMDtcbiAgdGhpcy5uMCA9IHRoaXMuYSAqIE1hdGguc3FydCgxIC0gdGhpcy5lMikgLyAoMSAtIHRoaXMuZTIgKiBNYXRoLnBvdyhNYXRoLnNpbih0aGlzLmZpMCksIDIpKTtcbiAgdGhpcy5zMCA9IDEuMzcwMDgzNDYyODE1NTU7XG4gIHRoaXMubiA9IE1hdGguc2luKHRoaXMuczApO1xuICB0aGlzLnJvMCA9IHRoaXMuazEgKiB0aGlzLm4wIC8gTWF0aC50YW4odGhpcy5zMCk7XG4gIHRoaXMuYWQgPSB0aGlzLnM5MCAtIHRoaXMudXE7XG59XG5cbi8qIGVsbGlwc29pZCAqL1xuLyogY2FsY3VsYXRlIHh5IGZyb20gbGF0L2xvbiAqL1xuLyogQ29uc3RhbnRzLCBpZGVudGljYWwgdG8gaW52ZXJzZSB0cmFuc2Zvcm0gZnVuY3Rpb24gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGdmaSwgdSwgZGVsdGF2LCBzLCBkLCBlcHMsIHJvO1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgZGVsdGFfbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICAvKiBUcmFuc2Zvcm1hdGlvbiAqL1xuICBnZmkgPSBNYXRoLnBvdygoKDEgKyB0aGlzLmUgKiBNYXRoLnNpbihsYXQpKSAvICgxIC0gdGhpcy5lICogTWF0aC5zaW4obGF0KSkpLCAodGhpcy5hbGZhICogdGhpcy5lIC8gMikpO1xuICB1ID0gMiAqIChNYXRoLmF0YW4odGhpcy5rICogTWF0aC5wb3coTWF0aC50YW4obGF0IC8gMiArIHRoaXMuczQ1KSwgdGhpcy5hbGZhKSAvIGdmaSkgLSB0aGlzLnM0NSk7XG4gIGRlbHRhdiA9IC1kZWx0YV9sb24gKiB0aGlzLmFsZmE7XG4gIHMgPSBNYXRoLmFzaW4oTWF0aC5jb3ModGhpcy5hZCkgKiBNYXRoLnNpbih1KSArIE1hdGguc2luKHRoaXMuYWQpICogTWF0aC5jb3ModSkgKiBNYXRoLmNvcyhkZWx0YXYpKTtcbiAgZCA9IE1hdGguYXNpbihNYXRoLmNvcyh1KSAqIE1hdGguc2luKGRlbHRhdikgLyBNYXRoLmNvcyhzKSk7XG4gIGVwcyA9IHRoaXMubiAqIGQ7XG4gIHJvID0gdGhpcy5ybzAgKiBNYXRoLnBvdyhNYXRoLnRhbih0aGlzLnMwIC8gMiArIHRoaXMuczQ1KSwgdGhpcy5uKSAvIE1hdGgucG93KE1hdGgudGFuKHMgLyAyICsgdGhpcy5zNDUpLCB0aGlzLm4pO1xuICBwLnkgPSBybyAqIE1hdGguY29zKGVwcykgLyAxO1xuICBwLnggPSBybyAqIE1hdGguc2luKGVwcykgLyAxO1xuXG4gIGlmICghdGhpcy5jemVjaCkge1xuICAgIHAueSAqPSAtMTtcbiAgICBwLnggKj0gLTE7XG4gIH1cbiAgcmV0dXJuIChwKTtcbn1cblxuLyogY2FsY3VsYXRlIGxhdC9sb24gZnJvbSB4eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgdSwgZGVsdGF2LCBzLCBkLCBlcHMsIHJvLCBmaTE7XG4gIHZhciBvaztcblxuICAvKiBUcmFuc2Zvcm1hdGlvbiAqL1xuICAvKiByZXZlcnQgeSwgeCAqL1xuICB2YXIgdG1wID0gcC54O1xuICBwLnggPSBwLnk7XG4gIHAueSA9IHRtcDtcbiAgaWYgKCF0aGlzLmN6ZWNoKSB7XG4gICAgcC55ICo9IC0xO1xuICAgIHAueCAqPSAtMTtcbiAgfVxuICBybyA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICBlcHMgPSBNYXRoLmF0YW4yKHAueSwgcC54KTtcbiAgZCA9IGVwcyAvIE1hdGguc2luKHRoaXMuczApO1xuICBzID0gMiAqIChNYXRoLmF0YW4oTWF0aC5wb3codGhpcy5ybzAgLyBybywgMSAvIHRoaXMubikgKiBNYXRoLnRhbih0aGlzLnMwIC8gMiArIHRoaXMuczQ1KSkgLSB0aGlzLnM0NSk7XG4gIHUgPSBNYXRoLmFzaW4oTWF0aC5jb3ModGhpcy5hZCkgKiBNYXRoLnNpbihzKSAtIE1hdGguc2luKHRoaXMuYWQpICogTWF0aC5jb3MocykgKiBNYXRoLmNvcyhkKSk7XG4gIGRlbHRhdiA9IE1hdGguYXNpbihNYXRoLmNvcyhzKSAqIE1hdGguc2luKGQpIC8gTWF0aC5jb3ModSkpO1xuICBwLnggPSB0aGlzLmxvbmcwIC0gZGVsdGF2IC8gdGhpcy5hbGZhO1xuICBmaTEgPSB1O1xuICBvayA9IDA7XG4gIHZhciBpdGVyID0gMDtcbiAgZG8ge1xuICAgIHAueSA9IDIgKiAoTWF0aC5hdGFuKE1hdGgucG93KHRoaXMuaywgLTEgLyB0aGlzLmFsZmEpICogTWF0aC5wb3coTWF0aC50YW4odSAvIDIgKyB0aGlzLnM0NSksIDEgLyB0aGlzLmFsZmEpICogTWF0aC5wb3coKDEgKyB0aGlzLmUgKiBNYXRoLnNpbihmaTEpKSAvICgxIC0gdGhpcy5lICogTWF0aC5zaW4oZmkxKSksIHRoaXMuZSAvIDIpKSAtIHRoaXMuczQ1KTtcbiAgICBpZiAoTWF0aC5hYnMoZmkxIC0gcC55KSA8IDAuMDAwMDAwMDAwMSkge1xuICAgICAgb2sgPSAxO1xuICAgIH1cbiAgICBmaTEgPSBwLnk7XG4gICAgaXRlciArPSAxO1xuICB9IHdoaWxlIChvayA9PT0gMCAmJiBpdGVyIDwgMTUpO1xuICBpZiAoaXRlciA+PSAxNSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChwKTtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnS3JvdmFrJywgJ2tyb3ZhayddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgeyBIQUxGX1BJLCBFUFNMTiwgRk9SVFBJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBxc2ZueiBmcm9tICcuLi9jb21tb24vcXNmbnonO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG1vZGVcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gYXBhXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtbWZcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBycVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHFwXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luYjFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NiMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHltZlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHhtZlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbnBoMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc3BoMFxuICovXG5cbi8qXG4gIHJlZmVyZW5jZVxuICAgIFwiTmV3IEVxdWFsLUFyZWEgTWFwIFByb2plY3Rpb25zIGZvciBOb25jaXJjdWxhciBSZWdpb25zXCIsIEpvaG4gUC4gU255ZGVyLFxuICAgIFRoZSBBbWVyaWNhbiBDYXJ0b2dyYXBoZXIsIFZvbCAxNSwgTm8uIDQsIE9jdG9iZXIgMTk4OCwgcHAuIDM0MS0zNTUuXG4gICovXG5cbmV4cG9ydCB2YXIgU19QT0xFID0gMTtcbmV4cG9ydCB2YXIgTl9QT0xFID0gMjtcbmV4cG9ydCB2YXIgRVFVSVQgPSAzO1xuZXhwb3J0IHZhciBPQkxJUSA9IDQ7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgTGFtYmVydCBBemltdXRoYWwgRXF1YWwgQXJlYSBwcm9qZWN0aW9uXG4gKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgdCA9IE1hdGguYWJzKHRoaXMubGF0MCk7XG4gIGlmIChNYXRoLmFicyh0IC0gSEFMRl9QSSkgPCBFUFNMTikge1xuICAgIHRoaXMubW9kZSA9IHRoaXMubGF0MCA8IDAgPyBTX1BPTEUgOiBOX1BPTEU7XG4gIH0gZWxzZSBpZiAoTWF0aC5hYnModCkgPCBFUFNMTikge1xuICAgIHRoaXMubW9kZSA9IEVRVUlUO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubW9kZSA9IE9CTElRO1xuICB9XG4gIGlmICh0aGlzLmVzID4gMCkge1xuICAgIHZhciBzaW5waGk7XG5cbiAgICB0aGlzLnFwID0gcXNmbnoodGhpcy5lLCAxKTtcbiAgICB0aGlzLm1tZiA9IDAuNSAvICgxIC0gdGhpcy5lcyk7XG4gICAgdGhpcy5hcGEgPSBhdXRoc2V0KHRoaXMuZXMpO1xuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlIE5fUE9MRTpcbiAgICAgICAgdGhpcy5kZCA9IDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTX1BPTEU6XG4gICAgICAgIHRoaXMuZGQgPSAxO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRVFVSVQ6XG4gICAgICAgIHRoaXMucnEgPSBNYXRoLnNxcnQoMC41ICogdGhpcy5xcCk7XG4gICAgICAgIHRoaXMuZGQgPSAxIC8gdGhpcy5ycTtcbiAgICAgICAgdGhpcy54bWYgPSAxO1xuICAgICAgICB0aGlzLnltZiA9IDAuNSAqIHRoaXMucXA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPQkxJUTpcbiAgICAgICAgdGhpcy5ycSA9IE1hdGguc3FydCgwLjUgKiB0aGlzLnFwKTtcbiAgICAgICAgc2lucGhpID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgICAgICAgdGhpcy5zaW5iMSA9IHFzZm56KHRoaXMuZSwgc2lucGhpKSAvIHRoaXMucXA7XG4gICAgICAgIHRoaXMuY29zYjEgPSBNYXRoLnNxcnQoMSAtIHRoaXMuc2luYjEgKiB0aGlzLnNpbmIxKTtcbiAgICAgICAgdGhpcy5kZCA9IE1hdGguY29zKHRoaXMubGF0MCkgLyAoTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogc2lucGhpICogc2lucGhpKSAqIHRoaXMucnEgKiB0aGlzLmNvc2IxKTtcbiAgICAgICAgdGhpcy55bWYgPSAodGhpcy54bWYgPSB0aGlzLnJxKSAvIHRoaXMuZGQ7XG4gICAgICAgIHRoaXMueG1mICo9IHRoaXMuZGQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSBPQkxJUSkge1xuICAgICAgdGhpcy5zaW5waDAgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICAgICAgdGhpcy5jb3NwaDAgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICAgIH1cbiAgfVxufVxuXG4vKiBMYW1iZXJ0IEF6aW11dGhhbCBFcXVhbCBBcmVhIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdmFyIHgsIHksIGNvc2xhbSwgc2lubGFtLCBzaW5waGksIHEsIHNpbmIsIGNvc2IsIGIsIGNvc3BoaTtcbiAgdmFyIGxhbSA9IHAueDtcbiAgdmFyIHBoaSA9IHAueTtcblxuICBsYW0gPSBhZGp1c3RfbG9uKGxhbSAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBjb3NsYW0gPSBNYXRoLmNvcyhsYW0pO1xuICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEgfHwgdGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSB7XG4gICAgICB5ID0gKHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkgPyAxICsgY29zcGhpICogY29zbGFtIDogMSArIHRoaXMuc2lucGgwICogc2lucGhpICsgdGhpcy5jb3NwaDAgKiBjb3NwaGkgKiBjb3NsYW07XG4gICAgICBpZiAoeSA8PSBFUFNMTikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHkgPSBNYXRoLnNxcnQoMiAvIHkpO1xuICAgICAgeCA9IHkgKiBjb3NwaGkgKiBNYXRoLnNpbihsYW0pO1xuICAgICAgeSAqPSAodGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSA/IHNpbnBoaSA6IHRoaXMuY29zcGgwICogc2lucGhpIC0gdGhpcy5zaW5waDAgKiBjb3NwaGkgKiBjb3NsYW07XG4gICAgfSBlbHNlIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuTl9QT0xFIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpIHtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuTl9QT0xFKSB7XG4gICAgICAgIGNvc2xhbSA9IC1jb3NsYW07XG4gICAgICB9XG4gICAgICBpZiAoTWF0aC5hYnMocGhpICsgdGhpcy5sYXQwKSA8IEVQU0xOKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgeSA9IEZPUlRQSSAtIHBoaSAqIDAuNTtcbiAgICAgIHkgPSAyICogKCh0aGlzLm1vZGUgPT09IHRoaXMuU19QT0xFKSA/IE1hdGguY29zKHkpIDogTWF0aC5zaW4oeSkpO1xuICAgICAgeCA9IHkgKiBNYXRoLnNpbihsYW0pO1xuICAgICAgeSAqPSBjb3NsYW07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNpbmIgPSAwO1xuICAgIGNvc2IgPSAwO1xuICAgIGIgPSAwO1xuICAgIGNvc2xhbSA9IE1hdGguY29zKGxhbSk7XG4gICAgc2lubGFtID0gTWF0aC5zaW4obGFtKTtcbiAgICBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIHEgPSBxc2Zueih0aGlzLmUsIHNpbnBoaSk7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSB8fCB0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQpIHtcbiAgICAgIHNpbmIgPSBxIC8gdGhpcy5xcDtcbiAgICAgIGNvc2IgPSBNYXRoLnNxcnQoMSAtIHNpbmIgKiBzaW5iKTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgdGhpcy5PQkxJUTpcbiAgICAgICAgYiA9IDEgKyB0aGlzLnNpbmIxICogc2luYiArIHRoaXMuY29zYjEgKiBjb3NiICogY29zbGFtO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5FUVVJVDpcbiAgICAgICAgYiA9IDEgKyBjb3NiICogY29zbGFtO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5OX1BPTEU6XG4gICAgICAgIGIgPSBIQUxGX1BJICsgcGhpO1xuICAgICAgICBxID0gdGhpcy5xcCAtIHE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLlNfUE9MRTpcbiAgICAgICAgYiA9IHBoaSAtIEhBTEZfUEk7XG4gICAgICAgIHEgPSB0aGlzLnFwICsgcTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChNYXRoLmFicyhiKSA8IEVQU0xOKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgdGhpcy5PQkxJUTpcbiAgICAgIGNhc2UgdGhpcy5FUVVJVDpcbiAgICAgICAgYiA9IE1hdGguc3FydCgyIC8gYik7XG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEpIHtcbiAgICAgICAgICB5ID0gdGhpcy55bWYgKiBiICogKHRoaXMuY29zYjEgKiBzaW5iIC0gdGhpcy5zaW5iMSAqIGNvc2IgKiBjb3NsYW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHkgPSAoYiA9IE1hdGguc3FydCgyIC8gKDEgKyBjb3NiICogY29zbGFtKSkpICogc2luYiAqIHRoaXMueW1mO1xuICAgICAgICB9XG4gICAgICAgIHggPSB0aGlzLnhtZiAqIGIgKiBjb3NiICogc2lubGFtO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5OX1BPTEU6XG4gICAgICBjYXNlIHRoaXMuU19QT0xFOlxuICAgICAgICBpZiAocSA+PSAwKSB7XG4gICAgICAgICAgeCA9IChiID0gTWF0aC5zcXJ0KHEpKSAqIHNpbmxhbTtcbiAgICAgICAgICB5ID0gY29zbGFtICogKCh0aGlzLm1vZGUgPT09IHRoaXMuU19QT0xFKSA/IGIgOiAtYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeCA9IHkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHAueCA9IHRoaXMuYSAqIHggKyB0aGlzLngwO1xuICBwLnkgPSB0aGlzLmEgKiB5ICsgdGhpcy55MDtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEludmVyc2UgZXF1YXRpb25zXG4gIC0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgdmFyIHggPSBwLnggLyB0aGlzLmE7XG4gIHZhciB5ID0gcC55IC8gdGhpcy5hO1xuICB2YXIgbGFtLCBwaGksIGNDZSwgc0NlLCBxLCByaG8sIGFiO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICB2YXIgY29zeiA9IDAsXG4gICAgICByaCwgc2lueiA9IDA7XG5cbiAgICByaCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICBwaGkgPSByaCAqIDAuNTtcbiAgICBpZiAocGhpID4gMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHBoaSA9IDIgKiBNYXRoLmFzaW4ocGhpKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuICAgICAgc2lueiA9IE1hdGguc2luKHBoaSk7XG4gICAgICBjb3N6ID0gTWF0aC5jb3MocGhpKTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgdGhpcy5FUVVJVDpcbiAgICAgICAgcGhpID0gKE1hdGguYWJzKHJoKSA8PSBFUFNMTikgPyAwIDogTWF0aC5hc2luKHkgKiBzaW56IC8gcmgpO1xuICAgICAgICB4ICo9IHNpbno7XG4gICAgICAgIHkgPSBjb3N6ICogcmg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLk9CTElROlxuICAgICAgICBwaGkgPSAoTWF0aC5hYnMocmgpIDw9IEVQU0xOKSA/IHRoaXMubGF0MCA6IE1hdGguYXNpbihjb3N6ICogdGhpcy5zaW5waDAgKyB5ICogc2lueiAqIHRoaXMuY29zcGgwIC8gcmgpO1xuICAgICAgICB4ICo9IHNpbnogKiB0aGlzLmNvc3BoMDtcbiAgICAgICAgeSA9IChjb3N6IC0gTWF0aC5zaW4ocGhpKSAqIHRoaXMuc2lucGgwKSAqIHJoO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5OX1BPTEU6XG4gICAgICAgIHkgPSAteTtcbiAgICAgICAgcGhpID0gSEFMRl9QSSAtIHBoaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuU19QT0xFOlxuICAgICAgICBwaGkgLT0gSEFMRl9QSTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxhbSA9ICh5ID09PSAwICYmICh0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQgfHwgdGhpcy5tb2RlID09PSB0aGlzLk9CTElRKSkgPyAwIDogTWF0aC5hdGFuMih4LCB5KTtcbiAgfSBlbHNlIHtcbiAgICBhYiA9IDA7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSB8fCB0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQpIHtcbiAgICAgIHggLz0gdGhpcy5kZDtcbiAgICAgIHkgKj0gdGhpcy5kZDtcbiAgICAgIHJobyA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICAgIGlmIChyaG8gPCBFUFNMTikge1xuICAgICAgICBwLnggPSB0aGlzLmxvbmcwO1xuICAgICAgICBwLnkgPSB0aGlzLmxhdDA7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfVxuICAgICAgc0NlID0gMiAqIE1hdGguYXNpbigwLjUgKiByaG8gLyB0aGlzLnJxKTtcbiAgICAgIGNDZSA9IE1hdGguY29zKHNDZSk7XG4gICAgICB4ICo9IChzQ2UgPSBNYXRoLnNpbihzQ2UpKTtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEpIHtcbiAgICAgICAgYWIgPSBjQ2UgKiB0aGlzLnNpbmIxICsgeSAqIHNDZSAqIHRoaXMuY29zYjEgLyByaG87XG4gICAgICAgIHEgPSB0aGlzLnFwICogYWI7XG4gICAgICAgIHkgPSByaG8gKiB0aGlzLmNvc2IxICogY0NlIC0geSAqIHRoaXMuc2luYjEgKiBzQ2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhYiA9IHkgKiBzQ2UgLyByaG87XG4gICAgICAgIHEgPSB0aGlzLnFwICogYWI7XG4gICAgICAgIHkgPSByaG8gKiBjQ2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuTl9QT0xFIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpIHtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuTl9QT0xFKSB7XG4gICAgICAgIHkgPSAteTtcbiAgICAgIH1cbiAgICAgIHEgPSAoeCAqIHggKyB5ICogeSk7XG4gICAgICBpZiAoIXEpIHtcbiAgICAgICAgcC54ID0gdGhpcy5sb25nMDtcbiAgICAgICAgcC55ID0gdGhpcy5sYXQwO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH1cbiAgICAgIGFiID0gMSAtIHEgLyB0aGlzLnFwO1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpIHtcbiAgICAgICAgYWIgPSAtYWI7XG4gICAgICB9XG4gICAgfVxuICAgIGxhbSA9IE1hdGguYXRhbjIoeCwgeSk7XG4gICAgcGhpID0gYXV0aGxhdChNYXRoLmFzaW4oYWIpLCB0aGlzLmFwYSk7XG4gIH1cblxuICBwLnggPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBsYW0sIHRoaXMub3Zlcik7XG4gIHAueSA9IHBoaTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIGRldGVybWluZSBsYXRpdHVkZSBmcm9tIGF1dGhhbGljIGxhdGl0dWRlICovXG52YXIgUDAwID0gMC4zMzMzMzMzMzMzMzMzMzMzMzMzMztcblxudmFyIFAwMSA9IDAuMTcyMjIyMjIyMjIyMjIyMjIyMjI7XG52YXIgUDAyID0gMC4xMDI1NzkzNjUwNzkzNjUwNzkzNjtcbnZhciBQMTAgPSAwLjA2Mzg4ODg4ODg4ODg4ODg4ODg4O1xudmFyIFAxMSA9IDAuMDY2NDAyMTE2NDAyMTE2NDAyMTE7XG52YXIgUDIwID0gMC4wMTY0MTUwMTI5NDIxOTE1NDQ0MztcblxuZnVuY3Rpb24gYXV0aHNldChlcykge1xuICB2YXIgdDtcbiAgdmFyIEFQQSA9IFtdO1xuICBBUEFbMF0gPSBlcyAqIFAwMDtcbiAgdCA9IGVzICogZXM7XG4gIEFQQVswXSArPSB0ICogUDAxO1xuICBBUEFbMV0gPSB0ICogUDEwO1xuICB0ICo9IGVzO1xuICBBUEFbMF0gKz0gdCAqIFAwMjtcbiAgQVBBWzFdICs9IHQgKiBQMTE7XG4gIEFQQVsyXSA9IHQgKiBQMjA7XG4gIHJldHVybiBBUEE7XG59XG5cbmZ1bmN0aW9uIGF1dGhsYXQoYmV0YSwgQVBBKSB7XG4gIHZhciB0ID0gYmV0YSArIGJldGE7XG4gIHJldHVybiAoYmV0YSArIEFQQVswXSAqIE1hdGguc2luKHQpICsgQVBBWzFdICogTWF0aC5zaW4odCArIHQpICsgQVBBWzJdICogTWF0aC5zaW4odCArIHQgKyB0KSk7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0xhbWJlcnQgQXppbXV0aGFsIEVxdWFsIEFyZWEnLCAnTGFtYmVydF9BemltdXRoYWxfRXF1YWxfQXJlYScsICdsYWVhJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lcyxcbiAgU19QT0xFOiBTX1BPTEUsXG4gIE5fUE9MRTogTl9QT0xFLFxuICBFUVVJVDogRVFVSVQsXG4gIE9CTElROiBPQkxJUVxufTtcbiIsImltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IHRzZm56IGZyb20gJy4uL2NvbW1vbi90c2Zueic7XG5pbXBvcnQgc2lnbiBmcm9tICcuLi9jb21tb24vc2lnbic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgcGhpMnogZnJvbSAnLi4vY29tbW9uL3BoaTJ6JztcbmltcG9ydCB7IEhBTEZfUEksIEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5zXG4gKiBAcHJvcGVydHkge251bWJlcn0gZjBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByaFxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gZG91YmxlIGxhdDA7ICAgICAgICAgICAgICAgICAgICAvKiB0aGUgcmVmZXJlbmNlIGxhdGl0dWRlICAgICAgICAgICAgICAgKi9cbiAgLy8gZG91YmxlIGxvbmcwOyAgICAgICAgICAgICAgICAgICAvKiB0aGUgcmVmZXJlbmNlIGxvbmdpdHVkZSAgICAgICAgICAgICAgKi9cbiAgLy8gZG91YmxlIGxhdDE7ICAgICAgICAgICAgICAgICAgICAvKiBmaXJzdCBzdGFuZGFyZCBwYXJhbGxlbCAgICAgICAgICAgICAgKi9cbiAgLy8gZG91YmxlIGxhdDI7ICAgICAgICAgICAgICAgICAgICAvKiBzZWNvbmQgc3RhbmRhcmQgcGFyYWxsZWwgICAgICAgICAgICAgKi9cbiAgLy8gZG91YmxlIHJfbWFqOyAgICAgICAgICAgICAgICAgICAvKiBtYWpvciBheGlzICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgLy8gZG91YmxlIHJfbWluOyAgICAgICAgICAgICAgICAgICAvKiBtaW5vciBheGlzICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgLy8gZG91YmxlIGZhbHNlX2Vhc3Q7ICAgICAgICAgICAgICAvKiB4IG9mZnNldCBpbiBtZXRlcnMgICAgICAgICAgICAgICAgICAgKi9cbiAgLy8gZG91YmxlIGZhbHNlX25vcnRoOyAgICAgICAgICAgICAvKiB5IG9mZnNldCBpbiBtZXRlcnMgICAgICAgICAgICAgICAgICAgKi9cblxuICAvLyB0aGUgYWJvdmUgdmFsdWUgY2FuIGJlIHNldCB3aXRoIHByb2o0LmRlZnNcbiAgLy8gZXhhbXBsZTogcHJvajQuZGVmcyhcIkVQU0c6MjE1NFwiLFwiK3Byb2o9bGNjICtsYXRfMT00OSArbGF0XzI9NDQgK2xhdF8wPTQ2LjUgK2xvbl8wPTMgK3hfMD03MDAwMDAgK3lfMD02NjAwMDAwICtlbGxwcz1HUlM4MCArdG93Z3M4ND0wLDAsMCwwLDAsMCwwICt1bml0cz1tICtub19kZWZzXCIpO1xuXG4gIGlmICghdGhpcy5sYXQyKSB7XG4gICAgdGhpcy5sYXQyID0gdGhpcy5sYXQxO1xuICB9IC8vIGlmIGxhdDIgaXMgbm90IGRlZmluZWRcbiAgaWYgKCF0aGlzLmswKSB7XG4gICAgdGhpcy5rMCA9IDE7XG4gIH1cbiAgdGhpcy54MCA9IHRoaXMueDAgfHwgMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgfHwgMDtcbiAgLy8gU3RhbmRhcmQgUGFyYWxsZWxzIGNhbm5vdCBiZSBlcXVhbCBhbmQgb24gb3Bwb3NpdGUgc2lkZXMgb2YgdGhlIGVxdWF0b3JcbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MSArIHRoaXMubGF0MikgPCBFUFNMTikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmUgPSBNYXRoLnNxcnQoMSAtIHRlbXAgKiB0ZW1wKTtcblxuICB2YXIgc2luMSA9IE1hdGguc2luKHRoaXMubGF0MSk7XG4gIHZhciBjb3MxID0gTWF0aC5jb3ModGhpcy5sYXQxKTtcbiAgdmFyIG1zMSA9IG1zZm56KHRoaXMuZSwgc2luMSwgY29zMSk7XG4gIHZhciB0czEgPSB0c2Zueih0aGlzLmUsIHRoaXMubGF0MSwgc2luMSk7XG5cbiAgdmFyIHNpbjIgPSBNYXRoLnNpbih0aGlzLmxhdDIpO1xuICB2YXIgY29zMiA9IE1hdGguY29zKHRoaXMubGF0Mik7XG4gIHZhciBtczIgPSBtc2Zueih0aGlzLmUsIHNpbjIsIGNvczIpO1xuICB2YXIgdHMyID0gdHNmbnoodGhpcy5lLCB0aGlzLmxhdDIsIHNpbjIpO1xuXG4gIHZhciB0czAgPSBNYXRoLmFicyhNYXRoLmFicyh0aGlzLmxhdDApIC0gSEFMRl9QSSkgPCBFUFNMTlxuICAgID8gMCAvLyBIYW5kbGUgcG9sZXMgYnkgc2V0dGluZyB0czAgdG8gMFxuICAgIDogdHNmbnoodGhpcy5lLCB0aGlzLmxhdDAsIE1hdGguc2luKHRoaXMubGF0MCkpO1xuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgLSB0aGlzLmxhdDIpID4gRVBTTE4pIHtcbiAgICB0aGlzLm5zID0gTWF0aC5sb2cobXMxIC8gbXMyKSAvIE1hdGgubG9nKHRzMSAvIHRzMik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ucyA9IHNpbjE7XG4gIH1cbiAgaWYgKGlzTmFOKHRoaXMubnMpKSB7XG4gICAgdGhpcy5ucyA9IHNpbjE7XG4gIH1cbiAgdGhpcy5mMCA9IG1zMSAvICh0aGlzLm5zICogTWF0aC5wb3codHMxLCB0aGlzLm5zKSk7XG4gIHRoaXMucmggPSB0aGlzLmEgKiB0aGlzLmYwICogTWF0aC5wb3codHMwLCB0aGlzLm5zKTtcbiAgaWYgKCF0aGlzLnRpdGxlKSB7XG4gICAgdGhpcy50aXRsZSA9ICdMYW1iZXJ0IENvbmZvcm1hbCBDb25pYyc7XG4gIH1cbn1cblxuLy8gTGFtYmVydCBDb25mb3JtYWwgY29uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIC8vIHNpbmd1bGFyIGNhc2VzIDpcbiAgaWYgKE1hdGguYWJzKDIgKiBNYXRoLmFicyhsYXQpIC0gTWF0aC5QSSkgPD0gRVBTTE4pIHtcbiAgICBsYXQgPSBzaWduKGxhdCkgKiAoSEFMRl9QSSAtIDIgKiBFUFNMTik7XG4gIH1cblxuICB2YXIgY29uID0gTWF0aC5hYnMoTWF0aC5hYnMobGF0KSAtIEhBTEZfUEkpO1xuICB2YXIgdHMsIHJoMTtcbiAgaWYgKGNvbiA+IEVQU0xOKSB7XG4gICAgdHMgPSB0c2Zueih0aGlzLmUsIGxhdCwgTWF0aC5zaW4obGF0KSk7XG4gICAgcmgxID0gdGhpcy5hICogdGhpcy5mMCAqIE1hdGgucG93KHRzLCB0aGlzLm5zKTtcbiAgfSBlbHNlIHtcbiAgICBjb24gPSBsYXQgKiB0aGlzLm5zO1xuICAgIGlmIChjb24gPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJoMSA9IDA7XG4gIH1cbiAgdmFyIHRoZXRhID0gdGhpcy5ucyAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgcC54ID0gdGhpcy5rMCAqIChyaDEgKiBNYXRoLnNpbih0aGV0YSkpICsgdGhpcy54MDtcbiAgcC55ID0gdGhpcy5rMCAqICh0aGlzLnJoIC0gcmgxICogTWF0aC5jb3ModGhldGEpKSArIHRoaXMueTA7XG5cbiAgcmV0dXJuIHA7XG59XG5cbi8vIExhbWJlcnQgQ29uZm9ybWFsIENvbmljIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHJoMSwgY29uLCB0cztcbiAgdmFyIGxhdCwgbG9uO1xuICB2YXIgeCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuazA7XG4gIHZhciB5ID0gKHRoaXMucmggLSAocC55IC0gdGhpcy55MCkgLyB0aGlzLmswKTtcbiAgaWYgKHRoaXMubnMgPiAwKSB7XG4gICAgcmgxID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIGNvbiA9IDE7XG4gIH0gZWxzZSB7XG4gICAgcmgxID0gLU1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICBjb24gPSAtMTtcbiAgfVxuICB2YXIgdGhldGEgPSAwO1xuICBpZiAocmgxICE9PSAwKSB7XG4gICAgdGhldGEgPSBNYXRoLmF0YW4yKChjb24gKiB4KSwgKGNvbiAqIHkpKTtcbiAgfVxuICBpZiAoKHJoMSAhPT0gMCkgfHwgKHRoaXMubnMgPiAwKSkge1xuICAgIGNvbiA9IDEgLyB0aGlzLm5zO1xuICAgIHRzID0gTWF0aC5wb3coKHJoMSAvICh0aGlzLmEgKiB0aGlzLmYwKSksIGNvbik7XG4gICAgbGF0ID0gcGhpMnoodGhpcy5lLCB0cyk7XG4gICAgaWYgKGxhdCA9PT0gLTk5OTkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsYXQgPSAtSEFMRl9QSTtcbiAgfVxuICBsb24gPSBhZGp1c3RfbG9uKHRoZXRhIC8gdGhpcy5ucyArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1xuICAnTGFtYmVydCBUYW5nZW50aWFsIENvbmZvcm1hbCBDb25pYyBQcm9qZWN0aW9uJyxcbiAgJ0xhbWJlcnRfQ29uZm9ybWFsX0NvbmljJyxcbiAgJ0xhbWJlcnRfQ29uZm9ybWFsX0NvbmljXzFTUCcsXG4gICdMYW1iZXJ0X0NvbmZvcm1hbF9Db25pY18yU1AnLFxuICAnbGNjJyxcbiAgJ0xhbWJlcnQgQ29uaWMgQ29uZm9ybWFsICgxU1ApJyxcbiAgJ0xhbWJlcnQgQ29uaWMgQ29uZm9ybWFsICgyU1ApJ1xuXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gbm8tb3AgZm9yIGxvbmdsYXRcbn1cblxuZnVuY3Rpb24gaWRlbnRpdHkocHQpIHtcbiAgcmV0dXJuIHB0O1xufVxuZXhwb3J0IHsgaWRlbnRpdHkgYXMgZm9yd2FyZCB9O1xuZXhwb3J0IHsgaWRlbnRpdHkgYXMgaW52ZXJzZSB9O1xuZXhwb3J0IHZhciBuYW1lcyA9IFsnbG9uZ2xhdCcsICdpZGVudGl0eSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBpZGVudGl0eSxcbiAgaW52ZXJzZTogaWRlbnRpdHksXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuXG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgdHNmbnogZnJvbSAnLi4vY29tbW9uL3RzZm56JztcbmltcG9ydCBwaGkyeiBmcm9tICcuLi9jb21tb24vcGhpMnonO1xuaW1wb3J0IHsgRk9SVFBJLCBSMkQsIEVQU0xOLCBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0ga1xuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIGNvbiA9IHRoaXMuYiAvIHRoaXMuYTtcbiAgdGhpcy5lcyA9IDEgLSBjb24gKiBjb247XG4gIGlmICghKCd4MCcgaW4gdGhpcykpIHtcbiAgICB0aGlzLngwID0gMDtcbiAgfVxuICBpZiAoISgneTAnIGluIHRoaXMpKSB7XG4gICAgdGhpcy55MCA9IDA7XG4gIH1cbiAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuICBpZiAodGhpcy5sYXRfdHMpIHtcbiAgICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICAgIHRoaXMuazAgPSBNYXRoLmNvcyh0aGlzLmxhdF90cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuazAgPSBtc2Zueih0aGlzLmUsIE1hdGguc2luKHRoaXMubGF0X3RzKSwgTWF0aC5jb3ModGhpcy5sYXRfdHMpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCF0aGlzLmswKSB7XG4gICAgICBpZiAodGhpcy5rKSB7XG4gICAgICAgIHRoaXMuazAgPSB0aGlzLms7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmswID0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyogTWVyY2F0b3IgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgLy8gY29udmVydCB0byByYWRpYW5zXG4gIGlmIChsYXQgKiBSMkQgPiA5MCAmJiBsYXQgKiBSMkQgPCAtOTAgJiYgbG9uICogUjJEID4gMTgwICYmIGxvbiAqIFIyRCA8IC0xODApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciB4LCB5O1xuICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMobGF0KSAtIEhBTEZfUEkpIDw9IEVQU0xOKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgICB4ID0gdGhpcy54MCArIHRoaXMuYSAqIHRoaXMuazAgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gICAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIHRoaXMuazAgKiBNYXRoLmxvZyhNYXRoLnRhbihGT1JUUEkgKyAwLjUgKiBsYXQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHNpbnBoaSA9IE1hdGguc2luKGxhdCk7XG4gICAgICB2YXIgdHMgPSB0c2Zueih0aGlzLmUsIGxhdCwgc2lucGhpKTtcbiAgICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogdGhpcy5rMCAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgICAgIHkgPSB0aGlzLnkwIC0gdGhpcy5hICogdGhpcy5rMCAqIE1hdGgubG9nKHRzKTtcbiAgICB9XG4gICAgcC54ID0geDtcbiAgICBwLnkgPSB5O1xuICAgIHJldHVybiBwO1xuICB9XG59XG5cbi8qIE1lcmNhdG9yIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgeCA9IHAueCAtIHRoaXMueDA7XG4gIHZhciB5ID0gcC55IC0gdGhpcy55MDtcbiAgdmFyIGxvbiwgbGF0O1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGxhdCA9IEhBTEZfUEkgLSAyICogTWF0aC5hdGFuKE1hdGguZXhwKC15IC8gKHRoaXMuYSAqIHRoaXMuazApKSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRzID0gTWF0aC5leHAoLXkgLyAodGhpcy5hICogdGhpcy5rMCkpO1xuICAgIGxhdCA9IHBoaTJ6KHRoaXMuZSwgdHMpO1xuICAgIGlmIChsYXQgPT09IC05OTk5KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgeCAvICh0aGlzLmEgKiB0aGlzLmswKSwgdGhpcy5vdmVyKTtcblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ01lcmNhdG9yJywgJ1BvcHVsYXIgVmlzdWFsaXNhdGlvbiBQc2V1ZG8gTWVyY2F0b3InLCAnTWVyY2F0b3JfMVNQJywgJ01lcmNhdG9yX0F1eGlsaWFyeV9TcGhlcmUnLCAnTWVyY2F0b3JfVmFyaWFudF9BJywgJ21lcmMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG4vKlxuICByZWZlcmVuY2VcbiAgICBcIk5ldyBFcXVhbC1BcmVhIE1hcCBQcm9qZWN0aW9ucyBmb3IgTm9uY2lyY3VsYXIgUmVnaW9uc1wiLCBKb2huIFAuIFNueWRlcixcbiAgICBUaGUgQW1lcmljYW4gQ2FydG9ncmFwaGVyLCBWb2wgMTUsIE5vLiA0LCBPY3RvYmVyIDE5ODgsIHBwLiAzNDEtMzU1LlxuICAqL1xuXG4vKiBJbml0aWFsaXplIHRoZSBNaWxsZXIgQ3lsaW5kcmljYWwgcHJvamVjdGlvblxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gbm8tb3Bcbn1cblxuLyogTWlsbGVyIEN5bGluZHJpY2FsIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciB4ID0gdGhpcy54MCArIHRoaXMuYSAqIGRsb247XG4gIHZhciB5ID0gdGhpcy55MCArIHRoaXMuYSAqIE1hdGgubG9nKE1hdGgudGFuKChNYXRoLlBJIC8gNCkgKyAobGF0IC8gMi41KSkpICogMS4yNTtcblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuLyogTWlsbGVyIEN5bGluZHJpY2FsIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG5cbiAgdmFyIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHAueCAvIHRoaXMuYSwgdGhpcy5vdmVyKTtcbiAgdmFyIGxhdCA9IDIuNSAqIChNYXRoLmF0YW4oTWF0aC5leHAoMC44ICogcC55IC8gdGhpcy5hKSkgLSBNYXRoLlBJIC8gNCk7XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydNaWxsZXJfQ3lsaW5kcmljYWwnLCAnbWlsbCddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgeyBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMueDAgPSB0aGlzLngwICE9PSB1bmRlZmluZWQgPyB0aGlzLngwIDogMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgIT09IHVuZGVmaW5lZCA/IHRoaXMueTAgOiAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sb25nMCA6IDA7XG59XG5cbi8qIE1vbGx3ZWlkZSBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHZhciBkZWx0YV9sb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciB0aGV0YSA9IGxhdDtcbiAgdmFyIGNvbiA9IE1hdGguUEkgKiBNYXRoLnNpbihsYXQpO1xuXG4gIC8qIEl0ZXJhdGUgdXNpbmcgdGhlIE5ld3Rvbi1SYXBoc29uIG1ldGhvZCB0byBmaW5kIHRoZXRhXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciBkZWx0YV90aGV0YSA9IC0odGhldGEgKyBNYXRoLnNpbih0aGV0YSkgLSBjb24pIC8gKDEgKyBNYXRoLmNvcyh0aGV0YSkpO1xuICAgIHRoZXRhICs9IGRlbHRhX3RoZXRhO1xuICAgIGlmIChNYXRoLmFicyhkZWx0YV90aGV0YSkgPCBFUFNMTikge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHRoZXRhIC89IDI7XG5cbiAgLyogSWYgdGhlIGxhdGl0dWRlIGlzIDkwIGRlZywgZm9yY2UgdGhlIHggY29vcmRpbmF0ZSB0byBiZSBcIjAgKyBmYWxzZSBlYXN0aW5nXCJcbiAgICAgICB0aGlzIGlzIGRvbmUgaGVyZSBiZWNhdXNlIG9mIHByZWNpc2lvbiBwcm9ibGVtcyB3aXRoIFwiY29zKHRoZXRhKVwiXG4gICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgaWYgKE1hdGguUEkgLyAyIC0gTWF0aC5hYnMobGF0KSA8IEVQU0xOKSB7XG4gICAgZGVsdGFfbG9uID0gMDtcbiAgfVxuICB2YXIgeCA9IDAuOTAwMzE2MzE2MTU4ICogdGhpcy5hICogZGVsdGFfbG9uICogTWF0aC5jb3ModGhldGEpICsgdGhpcy54MDtcbiAgdmFyIHkgPSAxLjQxNDIxMzU2MjM3MzEgKiB0aGlzLmEgKiBNYXRoLnNpbih0aGV0YSkgKyB0aGlzLnkwO1xuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciB0aGV0YTtcbiAgdmFyIGFyZztcblxuICAvKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICBhcmcgPSBwLnkgLyAoMS40MTQyMTM1NjIzNzMxICogdGhpcy5hKTtcblxuICAvKiBCZWNhdXNlIG9mIGRpdmlzaW9uIGJ5IHplcm8gcHJvYmxlbXMsICdhcmcnIGNhbiBub3QgYmUgMS4gIFRoZXJlZm9yZVxuICAgICAgIGEgbnVtYmVyIHZlcnkgY2xvc2UgdG8gb25lIGlzIHVzZWQgaW5zdGVhZC5cbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIGlmIChNYXRoLmFicyhhcmcpID4gMC45OTk5OTk5OTk5OTkpIHtcbiAgICBhcmcgPSAwLjk5OTk5OTk5OTk5OTtcbiAgfVxuICB0aGV0YSA9IE1hdGguYXNpbihhcmcpO1xuICB2YXIgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKHAueCAvICgwLjkwMDMxNjMxNjE1OCAqIHRoaXMuYSAqIE1hdGguY29zKHRoZXRhKSkpLCB0aGlzLm92ZXIpO1xuICBpZiAobG9uIDwgKC1NYXRoLlBJKSkge1xuICAgIGxvbiA9IC1NYXRoLlBJO1xuICB9XG4gIGlmIChsb24gPiBNYXRoLlBJKSB7XG4gICAgbG9uID0gTWF0aC5QSTtcbiAgfVxuICBhcmcgPSAoMiAqIHRoZXRhICsgTWF0aC5zaW4oMiAqIHRoZXRhKSkgLyBNYXRoLlBJO1xuICBpZiAoTWF0aC5hYnMoYXJnKSA+IDEpIHtcbiAgICBhcmcgPSAxO1xuICB9XG4gIHZhciBsYXQgPSBNYXRoLmFzaW4oYXJnKTtcblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ01vbGx3ZWlkZScsICdtb2xsJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB7IFNFQ19UT19SQUQgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLypcbiAgcmVmZXJlbmNlXG4gICAgRGVwYXJ0bWVudCBvZiBMYW5kIGFuZCBTdXJ2ZXkgVGVjaG5pY2FsIENpcmN1bGFyIDE5NzMvMzJcbiAgICAgIGh0dHA6Ly93d3cubGluei5nb3Z0Lm56L2RvY3MvbWlzY2VsbGFuZW91cy9uei1tYXAtZGVmaW5pdGlvbi5wZGZcbiAgICBPU0cgVGVjaG5pY2FsIFJlcG9ydCA0LjFcbiAgICAgIGh0dHA6Ly93d3cubGluei5nb3Z0Lm56L2RvY3MvbWlzY2VsbGFuZW91cy9uem1nLnBkZlxuICAqL1xuXG4vKipcbiAqIGl0ZXJhdGlvbnM6IE51bWJlciBvZiBpdGVyYXRpb25zIHRvIHJlZmluZSBpbnZlcnNlIHRyYW5zZm9ybS5cbiAqICAgICAwIC0+IGttIGFjY3VyYWN5XG4gKiAgICAgMSAtPiBtIGFjY3VyYWN5IC0tIHN1aXRhYmxlIGZvciBtb3N0IG1hcHBpbmcgYXBwbGljYXRpb25zXG4gKiAgICAgMiAtPiBtbSBhY2N1cmFjeVxuICovXG5leHBvcnQgdmFyIGl0ZXJhdGlvbnMgPSAxO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy5BID0gW107XG4gIHRoaXMuQVsxXSA9IDAuNjM5OTE3NTA3MztcbiAgdGhpcy5BWzJdID0gLTAuMTM1ODc5NzYxMztcbiAgdGhpcy5BWzNdID0gMC4wNjMyOTQ0MDk7XG4gIHRoaXMuQVs0XSA9IC0wLjAyNTI2ODUzO1xuICB0aGlzLkFbNV0gPSAwLjAxMTc4Nzk7XG4gIHRoaXMuQVs2XSA9IC0wLjAwNTUxNjE7XG4gIHRoaXMuQVs3XSA9IDAuMDAyNjkwNjtcbiAgdGhpcy5BWzhdID0gLTAuMDAxMzMzO1xuICB0aGlzLkFbOV0gPSAwLjAwMDY3O1xuICB0aGlzLkFbMTBdID0gLTAuMDAwMzQ7XG5cbiAgdGhpcy5CX3JlID0gW107XG4gIHRoaXMuQl9pbSA9IFtdO1xuICB0aGlzLkJfcmVbMV0gPSAwLjc1NTc4NTMyMjg7XG4gIHRoaXMuQl9pbVsxXSA9IDA7XG4gIHRoaXMuQl9yZVsyXSA9IDAuMjQ5MjA0NjQ2O1xuICB0aGlzLkJfaW1bMl0gPSAwLjAwMzM3MTUwNztcbiAgdGhpcy5CX3JlWzNdID0gLTAuMDAxNTQxNzM5O1xuICB0aGlzLkJfaW1bM10gPSAwLjA0MTA1ODU2MDtcbiAgdGhpcy5CX3JlWzRdID0gLTAuMTAxNjI5MDc7XG4gIHRoaXMuQl9pbVs0XSA9IDAuMDE3Mjc2MDk7XG4gIHRoaXMuQl9yZVs1XSA9IC0wLjI2NjIzNDg5O1xuICB0aGlzLkJfaW1bNV0gPSAtMC4zNjI0OTIxODtcbiAgdGhpcy5CX3JlWzZdID0gLTAuNjg3MDk4MztcbiAgdGhpcy5CX2ltWzZdID0gLTEuMTY1MTk2NztcblxuICB0aGlzLkNfcmUgPSBbXTtcbiAgdGhpcy5DX2ltID0gW107XG4gIHRoaXMuQ19yZVsxXSA9IDEuMzIzMTI3MDQzOTtcbiAgdGhpcy5DX2ltWzFdID0gMDtcbiAgdGhpcy5DX3JlWzJdID0gLTAuNTc3MjQ1Nzg5O1xuICB0aGlzLkNfaW1bMl0gPSAtMC4wMDc4MDk1OTg7XG4gIHRoaXMuQ19yZVszXSA9IDAuNTA4MzA3NTEzO1xuICB0aGlzLkNfaW1bM10gPSAtMC4xMTIyMDg5NTI7XG4gIHRoaXMuQ19yZVs0XSA9IC0wLjE1MDk0NzYyO1xuICB0aGlzLkNfaW1bNF0gPSAwLjE4MjAwNjAyO1xuICB0aGlzLkNfcmVbNV0gPSAxLjAxNDE4MTc5O1xuICB0aGlzLkNfaW1bNV0gPSAxLjY0NDk3Njk2O1xuICB0aGlzLkNfcmVbNl0gPSAxLjk2NjA1NDk7XG4gIHRoaXMuQ19pbVs2XSA9IDIuNTEyNzY0NTtcblxuICB0aGlzLkQgPSBbXTtcbiAgdGhpcy5EWzFdID0gMS41NjI3MDE0MjQzO1xuICB0aGlzLkRbMl0gPSAwLjUxODU0MDYzOTg7XG4gIHRoaXMuRFszXSA9IC0wLjAzMzMzMDk4O1xuICB0aGlzLkRbNF0gPSAtMC4xMDUyOTA2O1xuICB0aGlzLkRbNV0gPSAtMC4wMzY4NTk0O1xuICB0aGlzLkRbNl0gPSAwLjAwNzMxNztcbiAgdGhpcy5EWzddID0gMC4wMTIyMDtcbiAgdGhpcy5EWzhdID0gMC4wMDM5NDtcbiAgdGhpcy5EWzldID0gLTAuMDAxMztcbn1cblxuLyoqXG4gICAgTmV3IFplYWxhbmQgTWFwIEdyaWQgRm9yd2FyZCAgLSBsb25nL2xhdCB0byB4L3lcbiAgICBsb25nL2xhdCBpbiByYWRpYW5zXG4gICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBuO1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHZhciBkZWx0YV9sYXQgPSBsYXQgLSB0aGlzLmxhdDA7XG4gIHZhciBkZWx0YV9sb24gPSBsb24gLSB0aGlzLmxvbmcwO1xuXG4gIC8vIDEuIENhbGN1bGF0ZSBkX3BoaSBhbmQgZF9wc2kgICAgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgZF9sYW1iZGFcbiAgLy8gRm9yIHRoaXMgYWxnb3JpdGhtLCBkZWx0YV9sYXRpdHVkZSBpcyBpbiBzZWNvbmRzIG9mIGFyYyB4IDEwLTUsIHNvIHdlIG5lZWQgdG8gc2NhbGUgdG8gdGhvc2UgdW5pdHMuIExvbmdpdHVkZSBpcyByYWRpYW5zLlxuICB2YXIgZF9waGkgPSBkZWx0YV9sYXQgLyBTRUNfVE9fUkFEICogMUUtNTtcbiAgdmFyIGRfbGFtYmRhID0gZGVsdGFfbG9uO1xuICB2YXIgZF9waGlfbiA9IDE7IC8vIGRfcGhpXjBcblxuICB2YXIgZF9wc2kgPSAwO1xuICBmb3IgKG4gPSAxOyBuIDw9IDEwOyBuKyspIHtcbiAgICBkX3BoaV9uID0gZF9waGlfbiAqIGRfcGhpO1xuICAgIGRfcHNpID0gZF9wc2kgKyB0aGlzLkFbbl0gKiBkX3BoaV9uO1xuICB9XG5cbiAgLy8gMi4gQ2FsY3VsYXRlIHRoZXRhXG4gIHZhciB0aF9yZSA9IGRfcHNpO1xuICB2YXIgdGhfaW0gPSBkX2xhbWJkYTtcblxuICAvLyAzLiBDYWxjdWxhdGUgelxuICB2YXIgdGhfbl9yZSA9IDE7XG4gIHZhciB0aF9uX2ltID0gMDsgLy8gdGhldGFeMFxuICB2YXIgdGhfbl9yZTE7XG4gIHZhciB0aF9uX2ltMTtcblxuICB2YXIgel9yZSA9IDA7XG4gIHZhciB6X2ltID0gMDtcbiAgZm9yIChuID0gMTsgbiA8PSA2OyBuKyspIHtcbiAgICB0aF9uX3JlMSA9IHRoX25fcmUgKiB0aF9yZSAtIHRoX25faW0gKiB0aF9pbTtcbiAgICB0aF9uX2ltMSA9IHRoX25faW0gKiB0aF9yZSArIHRoX25fcmUgKiB0aF9pbTtcbiAgICB0aF9uX3JlID0gdGhfbl9yZTE7XG4gICAgdGhfbl9pbSA9IHRoX25faW0xO1xuICAgIHpfcmUgPSB6X3JlICsgdGhpcy5CX3JlW25dICogdGhfbl9yZSAtIHRoaXMuQl9pbVtuXSAqIHRoX25faW07XG4gICAgel9pbSA9IHpfaW0gKyB0aGlzLkJfaW1bbl0gKiB0aF9uX3JlICsgdGhpcy5CX3JlW25dICogdGhfbl9pbTtcbiAgfVxuXG4gIC8vIDQuIENhbGN1bGF0ZSBlYXN0aW5nIGFuZCBub3J0aGluZ1xuICBwLnggPSAoel9pbSAqIHRoaXMuYSkgKyB0aGlzLngwO1xuICBwLnkgPSAoel9yZSAqIHRoaXMuYSkgKyB0aGlzLnkwO1xuXG4gIHJldHVybiBwO1xufVxuXG4vKipcbiAgICBOZXcgWmVhbGFuZCBNYXAgR3JpZCBJbnZlcnNlICAtICB4L3kgdG8gbG9uZy9sYXRcbiAgKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIG47XG4gIHZhciB4ID0gcC54O1xuICB2YXIgeSA9IHAueTtcblxuICB2YXIgZGVsdGFfeCA9IHggLSB0aGlzLngwO1xuICB2YXIgZGVsdGFfeSA9IHkgLSB0aGlzLnkwO1xuXG4gIC8vIDEuIENhbGN1bGF0ZSB6XG4gIHZhciB6X3JlID0gZGVsdGFfeSAvIHRoaXMuYTtcbiAgdmFyIHpfaW0gPSBkZWx0YV94IC8gdGhpcy5hO1xuXG4gIC8vIDJhLiBDYWxjdWxhdGUgdGhldGEgLSBmaXJzdCBhcHByb3hpbWF0aW9uIGdpdmVzIGttIGFjY3VyYWN5XG4gIHZhciB6X25fcmUgPSAxO1xuICB2YXIgel9uX2ltID0gMDsgLy8gel4wXG4gIHZhciB6X25fcmUxO1xuICB2YXIgel9uX2ltMTtcblxuICB2YXIgdGhfcmUgPSAwO1xuICB2YXIgdGhfaW0gPSAwO1xuICBmb3IgKG4gPSAxOyBuIDw9IDY7IG4rKykge1xuICAgIHpfbl9yZTEgPSB6X25fcmUgKiB6X3JlIC0gel9uX2ltICogel9pbTtcbiAgICB6X25faW0xID0gel9uX2ltICogel9yZSArIHpfbl9yZSAqIHpfaW07XG4gICAgel9uX3JlID0gel9uX3JlMTtcbiAgICB6X25faW0gPSB6X25faW0xO1xuICAgIHRoX3JlID0gdGhfcmUgKyB0aGlzLkNfcmVbbl0gKiB6X25fcmUgLSB0aGlzLkNfaW1bbl0gKiB6X25faW07XG4gICAgdGhfaW0gPSB0aF9pbSArIHRoaXMuQ19pbVtuXSAqIHpfbl9yZSArIHRoaXMuQ19yZVtuXSAqIHpfbl9pbTtcbiAgfVxuXG4gIC8vIDJiLiBJdGVyYXRlIHRvIHJlZmluZSB0aGUgYWNjdXJhY3kgb2YgdGhlIGNhbGN1bGF0aW9uXG4gIC8vICAgICAgICAwIGl0ZXJhdGlvbnMgZ2l2ZXMga20gYWNjdXJhY3lcbiAgLy8gICAgICAgIDEgaXRlcmF0aW9uIGdpdmVzIG0gYWNjdXJhY3kgLS0gZ29vZCBlbm91Z2ggZm9yIG1vc3QgbWFwcGluZyBhcHBsaWNhdGlvbnNcbiAgLy8gICAgICAgIDIgaXRlcmF0aW9ucyBiaXZlcyBtbSBhY2N1cmFjeVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlcmF0aW9uczsgaSsrKSB7XG4gICAgdmFyIHRoX25fcmUgPSB0aF9yZTtcbiAgICB2YXIgdGhfbl9pbSA9IHRoX2ltO1xuICAgIHZhciB0aF9uX3JlMTtcbiAgICB2YXIgdGhfbl9pbTE7XG5cbiAgICB2YXIgbnVtX3JlID0gel9yZTtcbiAgICB2YXIgbnVtX2ltID0gel9pbTtcbiAgICBmb3IgKG4gPSAyOyBuIDw9IDY7IG4rKykge1xuICAgICAgdGhfbl9yZTEgPSB0aF9uX3JlICogdGhfcmUgLSB0aF9uX2ltICogdGhfaW07XG4gICAgICB0aF9uX2ltMSA9IHRoX25faW0gKiB0aF9yZSArIHRoX25fcmUgKiB0aF9pbTtcbiAgICAgIHRoX25fcmUgPSB0aF9uX3JlMTtcbiAgICAgIHRoX25faW0gPSB0aF9uX2ltMTtcbiAgICAgIG51bV9yZSA9IG51bV9yZSArIChuIC0gMSkgKiAodGhpcy5CX3JlW25dICogdGhfbl9yZSAtIHRoaXMuQl9pbVtuXSAqIHRoX25faW0pO1xuICAgICAgbnVtX2ltID0gbnVtX2ltICsgKG4gLSAxKSAqICh0aGlzLkJfaW1bbl0gKiB0aF9uX3JlICsgdGhpcy5CX3JlW25dICogdGhfbl9pbSk7XG4gICAgfVxuXG4gICAgdGhfbl9yZSA9IDE7XG4gICAgdGhfbl9pbSA9IDA7XG4gICAgdmFyIGRlbl9yZSA9IHRoaXMuQl9yZVsxXTtcbiAgICB2YXIgZGVuX2ltID0gdGhpcy5CX2ltWzFdO1xuICAgIGZvciAobiA9IDI7IG4gPD0gNjsgbisrKSB7XG4gICAgICB0aF9uX3JlMSA9IHRoX25fcmUgKiB0aF9yZSAtIHRoX25faW0gKiB0aF9pbTtcbiAgICAgIHRoX25faW0xID0gdGhfbl9pbSAqIHRoX3JlICsgdGhfbl9yZSAqIHRoX2ltO1xuICAgICAgdGhfbl9yZSA9IHRoX25fcmUxO1xuICAgICAgdGhfbl9pbSA9IHRoX25faW0xO1xuICAgICAgZGVuX3JlID0gZGVuX3JlICsgbiAqICh0aGlzLkJfcmVbbl0gKiB0aF9uX3JlIC0gdGhpcy5CX2ltW25dICogdGhfbl9pbSk7XG4gICAgICBkZW5faW0gPSBkZW5faW0gKyBuICogKHRoaXMuQl9pbVtuXSAqIHRoX25fcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX2ltKTtcbiAgICB9XG5cbiAgICAvLyBDb21wbGV4IGRpdmlzaW9uXG4gICAgdmFyIGRlbjIgPSBkZW5fcmUgKiBkZW5fcmUgKyBkZW5faW0gKiBkZW5faW07XG4gICAgdGhfcmUgPSAobnVtX3JlICogZGVuX3JlICsgbnVtX2ltICogZGVuX2ltKSAvIGRlbjI7XG4gICAgdGhfaW0gPSAobnVtX2ltICogZGVuX3JlIC0gbnVtX3JlICogZGVuX2ltKSAvIGRlbjI7XG4gIH1cblxuICAvLyAzLiBDYWxjdWxhdGUgZF9waGkgICAgICAgICAgICAgIC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBkX2xhbWJkYVxuICB2YXIgZF9wc2kgPSB0aF9yZTtcbiAgdmFyIGRfbGFtYmRhID0gdGhfaW07XG4gIHZhciBkX3BzaV9uID0gMTsgLy8gZF9wc2leMFxuXG4gIHZhciBkX3BoaSA9IDA7XG4gIGZvciAobiA9IDE7IG4gPD0gOTsgbisrKSB7XG4gICAgZF9wc2lfbiA9IGRfcHNpX24gKiBkX3BzaTtcbiAgICBkX3BoaSA9IGRfcGhpICsgdGhpcy5EW25dICogZF9wc2lfbjtcbiAgfVxuXG4gIC8vIDQuIENhbGN1bGF0ZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlXG4gIC8vIGRfcGhpIGlzIGNhbGN1YXRlZCBpbiBzZWNvbmQgb2YgYXJjICogMTBeLTUsIHNvIHdlIG5lZWQgdG8gc2NhbGUgYmFjayB0byByYWRpYW5zLiBkX2xhbWJkYSBpcyBpbiByYWRpYW5zLlxuICB2YXIgbGF0ID0gdGhpcy5sYXQwICsgKGRfcGhpICogU0VDX1RPX1JBRCAqIDFFNSk7XG4gIHZhciBsb24gPSB0aGlzLmxvbmcwICsgZF9sYW1iZGE7XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG5cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ05ld19aZWFsYW5kX01hcF9HcmlkJywgJ256bWcnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHsgRDJSLCBSMkQsIEhBTEZfUEksIEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgUHJvaiBmcm9tICcuLi9Qcm9qJztcbmltcG9ydCB7IG5hbWVzIGFzIGxvbmdMYXROYW1lcyB9IGZyb20gJy4vbG9uZ2xhdCc7XG5cbi8qKlxuICAgIE9yaWdpbmFsIHByb2plY3Rpb24gaW1wbGVtZW50YXRpb246XG4gICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9PU0dlby9QUk9KL2Jsb2IvNDZjNDdlOWFkZjYzNzZhZTA2YWZhYmU1ZDI0YTAwMTZhMDVjZWQ4Mi9zcmMvcHJvamVjdGlvbnMvb2JfdHJhbi5jcHBcblxuICAgIERvY3VtZW50YXRpb246XG4gICAgICAgIGh0dHBzOi8vcHJvai5vcmcvb3BlcmF0aW9ucy9wcm9qZWN0aW9ucy9vYl90cmFuLmh0bWxcblxuICAgIFJlZmVyZW5jZXMvRm9ybXVsYXM6XG4gICAgICAgIGh0dHBzOi8vcHVicy51c2dzLmdvdi9wcC8xMzk1L3JlcG9ydC5wZGZcblxuICAgIEV4YW1wbGVzOlxuICAgICAgICArcHJvaj1vYl90cmFuICtvX3Byb2o9bW9sbCArb19sYXRfcD00NSArb19sb25fcD0tOTBcbiAgICAgICAgK3Byb2o9b2JfdHJhbiArb19wcm9qPW1vbGwgK29fbGF0X3A9NDUgK29fbG9uX3A9LTkwICtsb25fMD02MFxuICAgICAgICArcHJvaj1vYl90cmFuICtvX3Byb2o9bW9sbCArb19sYXRfcD00NSArb19sb25fcD0tOTAgK2xvbl8wPS05MFxuKi9cblxuY29uc3QgcHJvamVjdGlvblR5cGUgPSB7XG4gIE9CTElRVUU6IHtcbiAgICBmb3J3YXJkOiBmb3J3YXJkT2JsaXF1ZSxcbiAgICBpbnZlcnNlOiBpbnZlcnNlT2JsaXF1ZVxuICB9LFxuICBUUkFOU1ZFUlNFOiB7XG4gICAgZm9yd2FyZDogZm9yd2FyZFRyYW5zdmVyc2UsXG4gICAgaW52ZXJzZTogaW52ZXJzZVRyYW5zdmVyc2VcbiAgfVxufTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsYW1wXG4gKiBAcHJvcGVydHkge251bWJlcn0gY3BoaXBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzcGhpcFxuICogQHByb3BlcnR5IHtPYmplY3R9IHByb2plY3Rpb25UeXBlXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19wcm9qXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sb25fcFxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbGF0X3BcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2FscGhhXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sb25fY1xuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbGF0X2NcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xvbl8xXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sYXRfMVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbG9uXzJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xhdF8yXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xvbmdQXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xhdFBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvQWxwaGFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTG9uZ0NcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTGF0Q1xuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9Mb25nMVxuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9MYXQxXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xvbmcyXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xhdDJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNJZGVudGl0eVxuICogQHByb3BlcnR5IHtpbXBvcnQoJy4uJykuQ29udmVydGVyfSBvYmxpcXVlUHJvamVjdGlvblxuICpcbiAqL1xuXG4vKipcbiAqICAgIFBhcmFtZXRlcnMgY2FuIGJlIGZyb20gdGhlIGZvbGxvd2luZyBzZXRzOlxuICogICAgICAgTmV3IHBvbGUgLS0+IG9fbGF0X3AsIG9fbG9uX3BcbiAqICAgICAgIFJvdGF0ZSBhYm91dCBwb2ludCAtLT4gb19hbHBoYSwgb19sb25fYywgb19sYXRfY1xuICogICAgICAgTmV3IGVxdWF0b3IgcG9pbnRzIC0tPiBsb25fMSwgbGF0XzEsIGxvbl8yLCBsYXRfMlxuICpcbiAqICAgIFBlciB0aGUgb3JpZ2luYWwgc291cmNlIGNvZGUsIHRoZSBwYXJhbWV0ZXIgc2V0cyBhcmVcbiAqICAgIGNoZWNrZWQgaW4gdGhlIG9yZGVyIG9mIHRoZSBvYmplY3QgYmVsb3cuXG4gKi9cbmNvbnN0IHBhcmFtU2V0cyA9IHtcbiAgUk9UQVRFOiB7XG4gICAgb19hbHBoYTogJ29BbHBoYScsXG4gICAgb19sb25fYzogJ29Mb25nQycsXG4gICAgb19sYXRfYzogJ29MYXRDJ1xuICB9LFxuICBORVdfUE9MRToge1xuICAgIG9fbGF0X3A6ICdvTGF0UCcsXG4gICAgb19sb25fcDogJ29Mb25nUCdcbiAgfSxcbiAgTkVXX0VRVUFUT1I6IHtcbiAgICBvX2xvbl8xOiAnb0xvbmcxJyxcbiAgICBvX2xhdF8xOiAnb0xhdDEnLFxuICAgIG9fbG9uXzI6ICdvTG9uZzInLFxuICAgIG9fbGF0XzI6ICdvTGF0MidcbiAgfVxufTtcblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCB8fCAwO1xuICB0aGlzLnRpdGxlID0gdGhpcy50aXRsZSB8fCAnR2VuZXJhbCBPYmxpcXVlIFRyYW5zZm9ybWF0aW9uJztcbiAgdGhpcy5pc0lkZW50aXR5ID0gbG9uZ0xhdE5hbWVzLmluY2x1ZGVzKHRoaXMub19wcm9qKTtcblxuICAvKiogVmVyaWZ5IHJlcXVpcmVkIHBhcmFtZXRlcnMgZXhpc3QgKi9cbiAgaWYgKCF0aGlzLm9fcHJvaikge1xuICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBwYXJhbWV0ZXI6IG9fcHJvaicpO1xuICB9XG5cbiAgaWYgKHRoaXMub19wcm9qID09PSBgb2JfdHJhbmApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9fcHJvajogJyArIHRoaXMub19wcm9qKTtcbiAgfVxuXG4gIGNvbnN0IG5ld1Byb2pTdHIgPSB0aGlzLnByb2pTdHIucmVwbGFjZSgnK3Byb2o9b2JfdHJhbicsICcnKS5yZXBsYWNlKCcrb19wcm9qPScsICcrcHJvaj0nKS50cmltKCk7XG5cbiAgLyoqIEB0eXBlIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gKi9cbiAgY29uc3Qgb1Byb2ogPSBQcm9qKG5ld1Byb2pTdHIpO1xuICBpZiAoIW9Qcm9qKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmFtZXRlcjogb19wcm9qLiBVbmtub3duIHByb2plY3Rpb24gJyArIHRoaXMub19wcm9qKTtcbiAgfVxuICBvUHJvai5sb25nMCA9IDA7IC8vIHdlIGhhbmRsZSBsb25nMCBiZWZvcmUvYWZ0ZXIgZm9yd2FyZC9pbnZlcnNlXG4gIHRoaXMub2JsaXF1ZVByb2plY3Rpb24gPSBvUHJvajtcblxuICBsZXQgbWF0Y2hlZFNldDtcbiAgY29uc3QgcGFyYW1TZXRzS2V5cyA9IE9iamVjdC5rZXlzKHBhcmFtU2V0cyk7XG5cbiAgLyoqXG4gICAqIHBhcnNlIHN0cmluZ3MsIGNvbnZlcnQgdG8gcmFkaWFucywgdGhyb3cgb24gTmFOXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHtudW1iZXIgfCB1bmRlZmluZWR9XG4gICAqL1xuICBjb25zdCBwYXJzZVBhcmFtID0gKG5hbWUpID0+IHtcbiAgICBpZiAodHlwZW9mIHRoaXNbbmFtZV0gPT09IGB1bmRlZmluZWRgKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCB2YWwgPSBwYXJzZUZsb2F0KHRoaXNbbmFtZV0pICogRDJSO1xuICAgIGlmIChpc05hTih2YWwpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yICcgKyBuYW1lICsgJzogJyArIHRoaXNbbmFtZV0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xuICB9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1TZXRzS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNldEtleSA9IHBhcmFtU2V0c0tleXNbaV07XG4gICAgY29uc3Qgc2V0ID0gcGFyYW1TZXRzW3NldEtleV07XG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmVudHJpZXMoc2V0KTtcbiAgICBjb25zdCBzZXRIYXNQYXJhbXMgPSBwYXJhbXMuc29tZShcbiAgICAgIChbcF0pID0+IHR5cGVvZiB0aGlzW3BdICE9PSAndW5kZWZpbmVkJ1xuICAgICk7XG4gICAgaWYgKCFzZXRIYXNQYXJhbXMpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBtYXRjaGVkU2V0ID0gc2V0O1xuICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBwYXJhbXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICBjb25zdCBbaW5wdXRQYXJhbSwgcGFyYW1dID0gcGFyYW1zW2lpXTtcbiAgICAgIGNvbnN0IHZhbCA9IHBhcnNlUGFyYW0oaW5wdXRQYXJhbSk7XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHBhcmFtZXRlcjogJyArIGlucHV0UGFyYW0gKyAnLicpO1xuICAgICAgfVxuICAgICAgdGhpc1twYXJhbV0gPSB2YWw7XG4gICAgfVxuICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKCFtYXRjaGVkU2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyB2YWxpZCBwYXJhbWV0ZXJzIHByb3ZpZGVkIGZvciBvYl90cmFuIHByb2plY3Rpb24uJyk7XG4gIH1cblxuICBjb25zdCB7IGxhbXAsIHBoaXAgfSA9IGNyZWF0ZVJvdGF0aW9uKHRoaXMsIG1hdGNoZWRTZXQpO1xuICB0aGlzLmxhbXAgPSBsYW1wO1xuXG4gIGlmIChNYXRoLmFicyhwaGlwKSA+IEVQU0xOKSB7XG4gICAgdGhpcy5jcGhpcCA9IE1hdGguY29zKHBoaXApO1xuICAgIHRoaXMuc3BoaXAgPSBNYXRoLnNpbihwaGlwKTtcbiAgICB0aGlzLnByb2plY3Rpb25UeXBlID0gcHJvamVjdGlvblR5cGUuT0JMSVFVRTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByb2plY3Rpb25UeXBlID0gcHJvamVjdGlvblR5cGUuVFJBTlNWRVJTRTtcbiAgfVxufVxuXG4vLyBvYl90cmFuIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIChsYXQsbG9uZykgdG8gKHgseSlcbi8vIHRyYW5zdmVyc2UgKDkwIGRlZ3JlZXMgZnJvbSBub3JtYWwgb3JpZW50YXRpb24pIC0gZm9yd2FyZFRyYW5zdmVyc2Vcbi8vIG9yIG9ibGlxdWUgKGFyYml0cmFyeSBhbmdsZSkgdXNlZCBiYXNlZCBvbiBwYXJhbWV0ZXJzIC0gZm9yd2FyZE9ibGlxdWVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICByZXR1cm4gdGhpcy5wcm9qZWN0aW9uVHlwZS5mb3J3YXJkKHRoaXMsIHApO1xufVxuXG4vLyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyAoeCx5KSB0byAobGF0LGxvbmcpXG4vLyB0cmFuc3ZlcnNlOiBpbnZlcnNlVHJhbnN2ZXJzZVxuLy8gb2JsaXF1ZTogaW52ZXJzZU9ibGlxdWVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICByZXR1cm4gdGhpcy5wcm9qZWN0aW9uVHlwZS5pbnZlcnNlKHRoaXMsIHApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9IHBhcmFtcyAtIEluaXRpYWxpemVkIHByb2plY3Rpb24gZGVmaW5pdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGhvdyAtIFRyYW5zZm9ybWF0aW9uIG1ldGhvZFxuICogQHJldHVybnMge3twaGlwOiBudW1iZXIsIGxhbXA6IG51bWJlcn19XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJvdGF0aW9uKHBhcmFtcywgaG93KSB7XG4gIGxldCBwaGlwLCBsYW1wO1xuICBpZiAoaG93ID09PSBwYXJhbVNldHMuUk9UQVRFKSB7XG4gICAgbGV0IGxhbWMgPSBwYXJhbXMub0xvbmdDO1xuICAgIGxldCBwaGljID0gcGFyYW1zLm9MYXRDO1xuICAgIGxldCBhbHBoYSA9IHBhcmFtcy5vQWxwaGE7XG4gICAgaWYgKE1hdGguYWJzKE1hdGguYWJzKHBoaWMpIC0gSEFMRl9QSSkgPD0gRVBTTE4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3Igb19sYXRfYzogJyArIHBhcmFtcy5vX2xhdF9jICsgJyBzaG91bGQgYmUgPCA5MMKwJyk7XG4gICAgfVxuICAgIGxhbXAgPSBsYW1jICsgTWF0aC5hdGFuMigtMSAqIE1hdGguY29zKGFscGhhKSwgLTEgKiBNYXRoLnNpbihhbHBoYSkgKiBNYXRoLnNpbihwaGljKSk7XG4gICAgcGhpcCA9IE1hdGguYXNpbihNYXRoLmNvcyhwaGljKSAqIE1hdGguc2luKGFscGhhKSk7XG4gIH0gZWxzZSBpZiAoaG93ID09PSBwYXJhbVNldHMuTkVXX1BPTEUpIHtcbiAgICBsYW1wID0gcGFyYW1zLm9Mb25nUDtcbiAgICBwaGlwID0gcGFyYW1zLm9MYXRQO1xuICB9IGVsc2Uge1xuICAgIGxldCBsYW0xID0gcGFyYW1zLm9Mb25nMTtcbiAgICBsZXQgcGhpMSA9IHBhcmFtcy5vTGF0MTtcbiAgICBsZXQgbGFtMiA9IHBhcmFtcy5vTG9uZzI7XG4gICAgbGV0IHBoaTIgPSBwYXJhbXMub0xhdDI7XG4gICAgbGV0IGNvbiA9IE1hdGguYWJzKHBoaTEpO1xuXG4gICAgaWYgKE1hdGguYWJzKHBoaTEpID4gSEFMRl9QSSAtIEVQU0xOKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9fbGF0XzE6ICcgKyBwYXJhbXMub19sYXRfMSArICcgc2hvdWxkIGJlIDwgOTDCsCcpO1xuICAgIH1cblxuICAgIGlmIChNYXRoLmFicyhwaGkyKSA+IEhBTEZfUEkgLSBFUFNMTikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBvX2xhdF8yOiAnICsgcGFyYW1zLm9fbGF0XzIgKyAnIHNob3VsZCBiZSA8IDkwwrAnKTtcbiAgICB9XG5cbiAgICBpZiAoTWF0aC5hYnMocGhpMSAtIHBoaTIpIDwgRVBTTE4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3Igb19sYXRfMSBhbmQgb19sYXRfMjogb19sYXRfMSBzaG91bGQgYmUgZGlmZmVyZW50IGZyb20gb19sYXRfMicpO1xuICAgIH1cbiAgICBpZiAoY29uIDwgRVBTTE4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3Igb19sYXRfMTogb19sYXRfMSBzaG91bGQgYmUgZGlmZmVyZW50IGZyb20gemVybycpO1xuICAgIH1cblxuICAgIGxhbXAgPSBNYXRoLmF0YW4yKFxuICAgICAgKE1hdGguY29zKHBoaTEpICogTWF0aC5zaW4ocGhpMikgKiBNYXRoLmNvcyhsYW0xKSlcbiAgICAgIC0gKE1hdGguc2luKHBoaTEpICogTWF0aC5jb3MocGhpMikgKiBNYXRoLmNvcyhsYW0yKSksXG4gICAgICAoTWF0aC5zaW4ocGhpMSkgKiBNYXRoLmNvcyhwaGkyKSAqIE1hdGguc2luKGxhbTIpKVxuICAgICAgLSAoTWF0aC5jb3MocGhpMSkgKiBNYXRoLnNpbihwaGkyKSAqIE1hdGguc2luKGxhbTEpKVxuICAgICk7XG5cbiAgICBwaGlwID0gTWF0aC5hdGFuKC0xICogTWF0aC5jb3MobGFtcCAtIGxhbTEpIC8gTWF0aC50YW4ocGhpMSkpO1xuICB9XG5cbiAgcmV0dXJuIHsgbGFtcCwgcGhpcCB9O1xufVxuXG4vKipcbiAqIEZvcndhcmQgKGxuZywgbGF0KSB0byAoeCwgeSkgZm9yIG9ibGlxdWUgY2FzZVxuICogQHBhcmFtIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gc2VsZlxuICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSBscCAtIGxhbWJkYSwgcGhpXG4gKi9cbmZ1bmN0aW9uIGZvcndhcmRPYmxpcXVlKHNlbGYsIGxwKSB7XG4gIGxldCB7IHg6IGxhbSwgeTogcGhpIH0gPSBscDtcbiAgbGFtICs9IHNlbGYubG9uZzA7XG4gIGNvbnN0IGNvc2xhbSA9IE1hdGguY29zKGxhbSk7XG4gIGNvbnN0IHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gIGNvbnN0IGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG5cbiAgbHAueCA9IGFkanVzdF9sb24oXG4gICAgTWF0aC5hdGFuMihcbiAgICAgIGNvc3BoaSAqIE1hdGguc2luKGxhbSksXG4gICAgICAoc2VsZi5zcGhpcCAqIGNvc3BoaSAqIGNvc2xhbSkgKyAoc2VsZi5jcGhpcCAqIHNpbnBoaSlcbiAgICApICsgc2VsZi5sYW1wXG4gICk7XG4gIGxwLnkgPSBNYXRoLmFzaW4oXG4gICAgKHNlbGYuc3BoaXAgKiBzaW5waGkpIC0gKHNlbGYuY3BoaXAgKiBjb3NwaGkgKiBjb3NsYW0pXG4gICk7XG5cbiAgY29uc3QgcmVzdWx0ID0gc2VsZi5vYmxpcXVlUHJvamVjdGlvbi5mb3J3YXJkKGxwKTtcbiAgaWYgKHNlbGYuaXNJZGVudGl0eSkge1xuICAgIHJlc3VsdC54ICo9IFIyRDtcbiAgICByZXN1bHQueSAqPSBSMkQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGb3J3YXJkIChsbmcsIGxhdCkgdG8gKHgsIHkpIGZvciB0cmFuc3ZlcnNlIGNhc2VcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9IHNlbGZcbiAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gbHAgLSBsYW1iZGEsIHBoaVxuICovXG5mdW5jdGlvbiBmb3J3YXJkVHJhbnN2ZXJzZShzZWxmLCBscCkge1xuICBsZXQgeyB4OiBsYW0sIHk6IHBoaSB9ID0gbHA7XG4gIGxhbSArPSBzZWxmLmxvbmcwO1xuICBjb25zdCBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuICBjb25zdCBjb3NsYW0gPSBNYXRoLmNvcyhsYW0pO1xuICBscC54ID0gYWRqdXN0X2xvbihcbiAgICBNYXRoLmF0YW4yKFxuICAgICAgY29zcGhpICogTWF0aC5zaW4obGFtKSxcbiAgICAgIE1hdGguc2luKHBoaSlcbiAgICApICsgc2VsZi5sYW1wXG4gICk7XG4gIGxwLnkgPSBNYXRoLmFzaW4oLTEgKiBjb3NwaGkgKiBjb3NsYW0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHNlbGYub2JsaXF1ZVByb2plY3Rpb24uZm9yd2FyZChscCk7XG5cbiAgaWYgKHNlbGYuaXNJZGVudGl0eSkge1xuICAgIHJlc3VsdC54ICo9IFIyRDtcbiAgICByZXN1bHQueSAqPSBSMkQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBJbnZlcnNlICh4LCB5KSB0byAobG5nLCBsYXQpIGZvciBvYmxpcXVlIGNhc2VcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9IHNlbGZcbiAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gbHAgLSBsYW1iZGEsIHBoaVxuICovXG5mdW5jdGlvbiBpbnZlcnNlT2JsaXF1ZShzZWxmLCBscCkge1xuICBpZiAoc2VsZi5pc0lkZW50aXR5KSB7XG4gICAgbHAueCAqPSBEMlI7XG4gICAgbHAueSAqPSBEMlI7XG4gIH1cblxuICBjb25zdCBpbm5lckxwID0gc2VsZi5vYmxpcXVlUHJvamVjdGlvbi5pbnZlcnNlKGxwKTtcbiAgbGV0IHsgeDogbGFtLCB5OiBwaGkgfSA9IGlubmVyTHA7XG5cbiAgaWYgKGxhbSA8IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICBsYW0gLT0gc2VsZi5sYW1wO1xuICAgIGNvbnN0IGNvc2xhbSA9IE1hdGguY29zKGxhbSk7XG4gICAgY29uc3Qgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICBjb25zdCBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIGxwLnggPSBNYXRoLmF0YW4yKFxuICAgICAgY29zcGhpICogTWF0aC5zaW4obGFtKSxcbiAgICAgIChzZWxmLnNwaGlwICogY29zcGhpICogY29zbGFtKSAtIChzZWxmLmNwaGlwICogc2lucGhpKVxuICAgICk7XG4gICAgbHAueSA9IE1hdGguYXNpbihcbiAgICAgIChzZWxmLnNwaGlwICogc2lucGhpKSArIChzZWxmLmNwaGlwICogY29zcGhpICogY29zbGFtKVxuICAgICk7XG4gIH1cblxuICBscC54ID0gYWRqdXN0X2xvbihscC54ICsgc2VsZi5sb25nMCk7XG4gIHJldHVybiBscDtcbn1cblxuLyoqXG4gKiBJbnZlcnNlICh4LCB5KSB0byAobG5nLCBsYXQpIGZvciB0cmFuc3ZlcnNlIGNhc2VcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9IHNlbGZcbiAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gbHAgLSBsYW1iZGEsIHBoaVxuICovXG5mdW5jdGlvbiBpbnZlcnNlVHJhbnN2ZXJzZShzZWxmLCBscCkge1xuICBpZiAoc2VsZi5pc0lkZW50aXR5KSB7XG4gICAgbHAueCAqPSBEMlI7XG4gICAgbHAueSAqPSBEMlI7XG4gIH1cblxuICBjb25zdCBpbm5lckxwID0gc2VsZi5vYmxpcXVlUHJvamVjdGlvbi5pbnZlcnNlKGxwKTtcbiAgbGV0IHsgeDogbGFtLCB5OiBwaGkgfSA9IGlubmVyTHA7XG5cbiAgaWYgKGxhbSA8IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICBjb25zdCBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIGxhbSAtPSBzZWxmLmxhbXA7XG4gICAgbHAueCA9IE1hdGguYXRhbjIoXG4gICAgICBjb3NwaGkgKiBNYXRoLnNpbihsYW0pLFxuICAgICAgLTEgKiBNYXRoLnNpbihwaGkpXG4gICAgKTtcbiAgICBscC55ID0gTWF0aC5hc2luKFxuICAgICAgY29zcGhpICogTWF0aC5jb3MobGFtKVxuICAgICk7XG4gIH1cblxuICBscC54ID0gYWRqdXN0X2xvbihscC54ICsgc2VsZi5sb25nMCk7XG4gIHJldHVybiBscDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnR2VuZXJhbCBPYmxpcXVlIFRyYW5zZm9ybWF0aW9uJywgJ0dlbmVyYWxfT2JsaXF1ZV9UcmFuc2Zvcm1hdGlvbicsICdvYl90cmFuJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB0c2ZueiBmcm9tICcuLi9jb21tb24vdHNmbnonO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHBoaTJ6IGZyb20gJy4uL2NvbW1vbi9waGkyeic7XG5pbXBvcnQgeyBFUFNMTiwgSEFMRl9QSSwgVFdPX1BJLCBGT1JUUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCB7IGdldE5vcm1hbGl6ZWRQcm9qTmFtZSB9IGZyb20gJy4uL3Byb2plY3Rpb25zJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbm9fb2ZmXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG5vX3JvdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJlY3RpZmllZF9ncmlkX2FuZ2xlXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBBXG4gKiBAcHJvcGVydHkge251bWJlcn0gQlxuICogQHByb3BlcnR5IHtudW1iZXJ9IEVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gbGFtMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbmdhbVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc2dhbVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbnJvdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc3JvdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJCXG4gKiBAcHJvcGVydHkge251bWJlcn0gQXJCXG4gKiBAcHJvcGVydHkge251bWJlcn0gQnJBXG4gKiBAcHJvcGVydHkge251bWJlcn0gdV8wXG4gKiBAcHJvcGVydHkge251bWJlcn0gdl9wb2xlX25cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB2X3BvbGVfc1xuICovXG5cbnZhciBUT0wgPSAxZS03O1xuXG5mdW5jdGlvbiBpc1R5cGVBKFApIHtcbiAgdmFyIHR5cGVBUHJvamVjdGlvbnMgPSBbJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yJywgJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yX3ZhcmlhbnRfQScsICdIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl9BemltdXRoX05hdHVyYWxfT3JpZ2luJ107XG4gIHZhciBwcm9qZWN0aW9uTmFtZSA9IHR5cGVvZiBQLnByb2pOYW1lID09PSAnb2JqZWN0JyA/IE9iamVjdC5rZXlzKFAucHJvak5hbWUpWzBdIDogUC5wcm9qTmFtZTtcblxuICByZXR1cm4gJ25vX3VvZmYnIGluIFAgfHwgJ25vX29mZicgaW4gUCB8fCB0eXBlQVByb2plY3Rpb25zLmluZGV4T2YocHJvamVjdGlvbk5hbWUpICE9PSAtMSB8fCB0eXBlQVByb2plY3Rpb25zLmluZGV4T2YoZ2V0Tm9ybWFsaXplZFByb2pOYW1lKHByb2plY3Rpb25OYW1lKSkgIT09IC0xO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIE9ibGlxdWUgTWVyY2F0b3IgIHByb2plY3Rpb25cbiAqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBjb24sIGNvbSwgY29zcGgwLCBELCBGLCBILCBMLCBzaW5waDAsIHAsIEosIGdhbW1hID0gMCxcbiAgICBnYW1tYTAsIGxhbWMgPSAwLCBsYW0xID0gMCwgbGFtMiA9IDAsIHBoaTEgPSAwLCBwaGkyID0gMCwgYWxwaGFfYyA9IDA7XG5cbiAgLy8gb25seSBUeXBlIEEgdXNlcyB0aGUgbm9fb2ZmIG9yIG5vX3VvZmYgcHJvcGVydHlcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL09TR2VvL3Byb2ouNC9pc3N1ZXMvMTA0XG4gIHRoaXMubm9fb2ZmID0gaXNUeXBlQSh0aGlzKTtcbiAgdGhpcy5ub19yb3QgPSAnbm9fcm90JyBpbiB0aGlzO1xuXG4gIHZhciBhbHAgPSBmYWxzZTtcbiAgaWYgKCdhbHBoYScgaW4gdGhpcykge1xuICAgIGFscCA9IHRydWU7XG4gIH1cblxuICB2YXIgZ2FtID0gZmFsc2U7XG4gIGlmICgncmVjdGlmaWVkX2dyaWRfYW5nbGUnIGluIHRoaXMpIHtcbiAgICBnYW0gPSB0cnVlO1xuICB9XG5cbiAgaWYgKGFscCkge1xuICAgIGFscGhhX2MgPSB0aGlzLmFscGhhO1xuICB9XG5cbiAgaWYgKGdhbSkge1xuICAgIGdhbW1hID0gdGhpcy5yZWN0aWZpZWRfZ3JpZF9hbmdsZTtcbiAgfVxuXG4gIGlmIChhbHAgfHwgZ2FtKSB7XG4gICAgbGFtYyA9IHRoaXMubG9uZ2M7XG4gIH0gZWxzZSB7XG4gICAgbGFtMSA9IHRoaXMubG9uZzE7XG4gICAgcGhpMSA9IHRoaXMubGF0MTtcbiAgICBsYW0yID0gdGhpcy5sb25nMjtcbiAgICBwaGkyID0gdGhpcy5sYXQyO1xuXG4gICAgaWYgKE1hdGguYWJzKHBoaTEgLSBwaGkyKSA8PSBUT0wgfHwgKGNvbiA9IE1hdGguYWJzKHBoaTEpKSA8PSBUT0xcbiAgICAgIHx8IE1hdGguYWJzKGNvbiAtIEhBTEZfUEkpIDw9IFRPTCB8fCBNYXRoLmFicyhNYXRoLmFicyh0aGlzLmxhdDApIC0gSEFMRl9QSSkgPD0gVE9MXG4gICAgICB8fCBNYXRoLmFicyhNYXRoLmFicyhwaGkyKSAtIEhBTEZfUEkpIDw9IFRPTCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIG9uZV9lcyA9IDEuMCAtIHRoaXMuZXM7XG4gIGNvbSA9IE1hdGguc3FydChvbmVfZXMpO1xuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDApID4gRVBTTE4pIHtcbiAgICBzaW5waDAgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICAgIGNvc3BoMCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gICAgY29uID0gMSAtIHRoaXMuZXMgKiBzaW5waDAgKiBzaW5waDA7XG4gICAgdGhpcy5CID0gY29zcGgwICogY29zcGgwO1xuICAgIHRoaXMuQiA9IE1hdGguc3FydCgxICsgdGhpcy5lcyAqIHRoaXMuQiAqIHRoaXMuQiAvIG9uZV9lcyk7XG4gICAgdGhpcy5BID0gdGhpcy5CICogdGhpcy5rMCAqIGNvbSAvIGNvbjtcbiAgICBEID0gdGhpcy5CICogY29tIC8gKGNvc3BoMCAqIE1hdGguc3FydChjb24pKTtcbiAgICBGID0gRCAqIEQgLSAxO1xuXG4gICAgaWYgKEYgPD0gMCkge1xuICAgICAgRiA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIEYgPSBNYXRoLnNxcnQoRik7XG4gICAgICBpZiAodGhpcy5sYXQwIDwgMCkge1xuICAgICAgICBGID0gLUY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5FID0gRiArPSBEO1xuICAgIHRoaXMuRSAqPSBNYXRoLnBvdyh0c2Zueih0aGlzLmUsIHRoaXMubGF0MCwgc2lucGgwKSwgdGhpcy5CKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLkIgPSAxIC8gY29tO1xuICAgIHRoaXMuQSA9IHRoaXMuazA7XG4gICAgdGhpcy5FID0gRCA9IEYgPSAxO1xuICB9XG5cbiAgaWYgKGFscCB8fCBnYW0pIHtcbiAgICBpZiAoYWxwKSB7XG4gICAgICBnYW1tYTAgPSBNYXRoLmFzaW4oTWF0aC5zaW4oYWxwaGFfYykgLyBEKTtcbiAgICAgIGlmICghZ2FtKSB7XG4gICAgICAgIGdhbW1hID0gYWxwaGFfYztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZ2FtbWEwID0gZ2FtbWE7XG4gICAgICBhbHBoYV9jID0gTWF0aC5hc2luKEQgKiBNYXRoLnNpbihnYW1tYTApKTtcbiAgICB9XG4gICAgdGhpcy5sYW0wID0gbGFtYyAtIE1hdGguYXNpbigwLjUgKiAoRiAtIDEgLyBGKSAqIE1hdGgudGFuKGdhbW1hMCkpIC8gdGhpcy5CO1xuICB9IGVsc2Uge1xuICAgIEggPSBNYXRoLnBvdyh0c2Zueih0aGlzLmUsIHBoaTEsIE1hdGguc2luKHBoaTEpKSwgdGhpcy5CKTtcbiAgICBMID0gTWF0aC5wb3codHNmbnoodGhpcy5lLCBwaGkyLCBNYXRoLnNpbihwaGkyKSksIHRoaXMuQik7XG4gICAgRiA9IHRoaXMuRSAvIEg7XG4gICAgcCA9IChMIC0gSCkgLyAoTCArIEgpO1xuICAgIEogPSB0aGlzLkUgKiB0aGlzLkU7XG4gICAgSiA9IChKIC0gTCAqIEgpIC8gKEogKyBMICogSCk7XG4gICAgY29uID0gbGFtMSAtIGxhbTI7XG5cbiAgICBpZiAoY29uIDwgLU1hdGguUEkpIHtcbiAgICAgIGxhbTIgLT0gVFdPX1BJO1xuICAgIH0gZWxzZSBpZiAoY29uID4gTWF0aC5QSSkge1xuICAgICAgbGFtMiArPSBUV09fUEk7XG4gICAgfVxuXG4gICAgdGhpcy5sYW0wID0gYWRqdXN0X2xvbigwLjUgKiAobGFtMSArIGxhbTIpIC0gTWF0aC5hdGFuKEogKiBNYXRoLnRhbigwLjUgKiB0aGlzLkIgKiAobGFtMSAtIGxhbTIpKSAvIHApIC8gdGhpcy5CLCB0aGlzLm92ZXIpO1xuICAgIGdhbW1hMCA9IE1hdGguYXRhbigyICogTWF0aC5zaW4odGhpcy5CICogYWRqdXN0X2xvbihsYW0xIC0gdGhpcy5sYW0wLCB0aGlzLm92ZXIpKSAvIChGIC0gMSAvIEYpKTtcbiAgICBnYW1tYSA9IGFscGhhX2MgPSBNYXRoLmFzaW4oRCAqIE1hdGguc2luKGdhbW1hMCkpO1xuICB9XG5cbiAgdGhpcy5zaW5nYW0gPSBNYXRoLnNpbihnYW1tYTApO1xuICB0aGlzLmNvc2dhbSA9IE1hdGguY29zKGdhbW1hMCk7XG4gIHRoaXMuc2lucm90ID0gTWF0aC5zaW4oZ2FtbWEpO1xuICB0aGlzLmNvc3JvdCA9IE1hdGguY29zKGdhbW1hKTtcblxuICB0aGlzLnJCID0gMSAvIHRoaXMuQjtcbiAgdGhpcy5BckIgPSB0aGlzLkEgKiB0aGlzLnJCO1xuICB0aGlzLkJyQSA9IDEgLyB0aGlzLkFyQjtcblxuICBpZiAodGhpcy5ub19vZmYpIHtcbiAgICB0aGlzLnVfMCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy51XzAgPSBNYXRoLmFicyh0aGlzLkFyQiAqIE1hdGguYXRhbihNYXRoLnNxcnQoRCAqIEQgLSAxKSAvIE1hdGguY29zKGFscGhhX2MpKSk7XG5cbiAgICBpZiAodGhpcy5sYXQwIDwgMCkge1xuICAgICAgdGhpcy51XzAgPSAtdGhpcy51XzA7XG4gICAgfVxuICB9XG5cbiAgRiA9IDAuNSAqIGdhbW1hMDtcbiAgdGhpcy52X3BvbGVfbiA9IHRoaXMuQXJCICogTWF0aC5sb2coTWF0aC50YW4oRk9SVFBJIC0gRikpO1xuICB0aGlzLnZfcG9sZV9zID0gdGhpcy5BckIgKiBNYXRoLmxvZyhNYXRoLnRhbihGT1JUUEkgKyBGKSk7XG59XG5cbi8qIE9ibGlxdWUgTWVyY2F0b3IgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgY29vcmRzID0ge307XG4gIHZhciBTLCBULCBVLCBWLCBXLCB0ZW1wLCB1LCB2O1xuICBwLnggPSBwLnggLSB0aGlzLmxhbTA7XG5cbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKHAueSkgLSBIQUxGX1BJKSA+IEVQU0xOKSB7XG4gICAgVyA9IHRoaXMuRSAvIE1hdGgucG93KHRzZm56KHRoaXMuZSwgcC55LCBNYXRoLnNpbihwLnkpKSwgdGhpcy5CKTtcblxuICAgIHRlbXAgPSAxIC8gVztcbiAgICBTID0gMC41ICogKFcgLSB0ZW1wKTtcbiAgICBUID0gMC41ICogKFcgKyB0ZW1wKTtcbiAgICBWID0gTWF0aC5zaW4odGhpcy5CICogcC54KTtcbiAgICBVID0gKFMgKiB0aGlzLnNpbmdhbSAtIFYgKiB0aGlzLmNvc2dhbSkgLyBUO1xuXG4gICAgaWYgKE1hdGguYWJzKE1hdGguYWJzKFUpIC0gMS4wKSA8IEVQU0xOKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2ID0gMC41ICogdGhpcy5BckIgKiBNYXRoLmxvZygoMSAtIFUpIC8gKDEgKyBVKSk7XG4gICAgdGVtcCA9IE1hdGguY29zKHRoaXMuQiAqIHAueCk7XG5cbiAgICBpZiAoTWF0aC5hYnModGVtcCkgPCBUT0wpIHtcbiAgICAgIHUgPSB0aGlzLkEgKiBwLng7XG4gICAgfSBlbHNlIHtcbiAgICAgIHUgPSB0aGlzLkFyQiAqIE1hdGguYXRhbjIoKFMgKiB0aGlzLmNvc2dhbSArIFYgKiB0aGlzLnNpbmdhbSksIHRlbXApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2ID0gcC55ID4gMCA/IHRoaXMudl9wb2xlX24gOiB0aGlzLnZfcG9sZV9zO1xuICAgIHUgPSB0aGlzLkFyQiAqIHAueTtcbiAgfVxuXG4gIGlmICh0aGlzLm5vX3JvdCkge1xuICAgIGNvb3Jkcy54ID0gdTtcbiAgICBjb29yZHMueSA9IHY7XG4gIH0gZWxzZSB7XG4gICAgdSAtPSB0aGlzLnVfMDtcbiAgICBjb29yZHMueCA9IHYgKiB0aGlzLmNvc3JvdCArIHUgKiB0aGlzLnNpbnJvdDtcbiAgICBjb29yZHMueSA9IHUgKiB0aGlzLmNvc3JvdCAtIHYgKiB0aGlzLnNpbnJvdDtcbiAgfVxuXG4gIGNvb3Jkcy54ID0gKHRoaXMuYSAqIGNvb3Jkcy54ICsgdGhpcy54MCk7XG4gIGNvb3Jkcy55ID0gKHRoaXMuYSAqIGNvb3Jkcy55ICsgdGhpcy55MCk7XG5cbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgdSwgdiwgUXAsIFNwLCBUcCwgVnAsIFVwO1xuICB2YXIgY29vcmRzID0ge307XG5cbiAgcC54ID0gKHAueCAtIHRoaXMueDApICogKDEuMCAvIHRoaXMuYSk7XG4gIHAueSA9IChwLnkgLSB0aGlzLnkwKSAqICgxLjAgLyB0aGlzLmEpO1xuXG4gIGlmICh0aGlzLm5vX3JvdCkge1xuICAgIHYgPSBwLnk7XG4gICAgdSA9IHAueDtcbiAgfSBlbHNlIHtcbiAgICB2ID0gcC54ICogdGhpcy5jb3Nyb3QgLSBwLnkgKiB0aGlzLnNpbnJvdDtcbiAgICB1ID0gcC55ICogdGhpcy5jb3Nyb3QgKyBwLnggKiB0aGlzLnNpbnJvdCArIHRoaXMudV8wO1xuICB9XG5cbiAgUXAgPSBNYXRoLmV4cCgtdGhpcy5CckEgKiB2KTtcbiAgU3AgPSAwLjUgKiAoUXAgLSAxIC8gUXApO1xuICBUcCA9IDAuNSAqIChRcCArIDEgLyBRcCk7XG4gIFZwID0gTWF0aC5zaW4odGhpcy5CckEgKiB1KTtcbiAgVXAgPSAoVnAgKiB0aGlzLmNvc2dhbSArIFNwICogdGhpcy5zaW5nYW0pIC8gVHA7XG5cbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKFVwKSAtIDEpIDwgRVBTTE4pIHtcbiAgICBjb29yZHMueCA9IDA7XG4gICAgY29vcmRzLnkgPSBVcCA8IDAgPyAtSEFMRl9QSSA6IEhBTEZfUEk7XG4gIH0gZWxzZSB7XG4gICAgY29vcmRzLnkgPSB0aGlzLkUgLyBNYXRoLnNxcnQoKDEgKyBVcCkgLyAoMSAtIFVwKSk7XG4gICAgY29vcmRzLnkgPSBwaGkyeih0aGlzLmUsIE1hdGgucG93KGNvb3Jkcy55LCAxIC8gdGhpcy5CKSk7XG5cbiAgICBpZiAoY29vcmRzLnkgPT09IEluZmluaXR5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG5cbiAgICBjb29yZHMueCA9IC10aGlzLnJCICogTWF0aC5hdGFuMigoU3AgKiB0aGlzLmNvc2dhbSAtIFZwICogdGhpcy5zaW5nYW0pLCBNYXRoLmNvcyh0aGlzLkJyQSAqIHUpKTtcbiAgfVxuXG4gIGNvb3Jkcy54ICs9IHRoaXMubGFtMDtcblxuICByZXR1cm4gY29vcmRzO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcicsICdIb3RpbmUgT2JsaXF1ZSBNZXJjYXRvcicsICdIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl92YXJpYW50X0EnLCAnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfVmFyaWFudF9CJywgJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yX0F6aW11dGhfTmF0dXJhbF9PcmlnaW4nLCAnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfVHdvX1BvaW50X05hdHVyYWxfT3JpZ2luJywgJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yX0F6aW11dGhfQ2VudGVyJywgJ09ibGlxdWVfTWVyY2F0b3InLCAnb21lcmMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFzaW56IGZyb20gJy4uL2NvbW1vbi9hc2lueic7XG5pbXBvcnQgeyBFUFNMTiwgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbl9wMTRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NfcDE0XG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvLyBkb3VibGUgdGVtcDsgICAgICAvKiB0ZW1wb3JhcnkgdmFyaWFibGUgICAgKi9cblxuICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHRoaXMuc2luX3AxNCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gIHRoaXMuY29zX3AxNCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG59XG5cbi8qIE9ydGhvZ3JhcGhpYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHNpbnBoaSwgY29zcGhpOyAvKiBzaW4gYW5kIGNvcyB2YWx1ZSAgICAgICAgKi9cbiAgdmFyIGRsb247IC8qIGRlbHRhIGxvbmdpdHVkZSB2YWx1ZSAgICAgICovXG4gIHZhciBjb3Nsb247IC8qIGNvcyBvZiBsb25naXR1ZGUgICAgICAgICovXG4gIHZhciBrc3A7IC8qIHNjYWxlIGZhY3RvciAgICAgICAgICAqL1xuICB2YXIgZywgeCwgeTtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG5cbiAgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcbiAgY29zcGhpID0gTWF0aC5jb3MobGF0KTtcblxuICBjb3Nsb24gPSBNYXRoLmNvcyhkbG9uKTtcbiAgZyA9IHRoaXMuc2luX3AxNCAqIHNpbnBoaSArIHRoaXMuY29zX3AxNCAqIGNvc3BoaSAqIGNvc2xvbjtcbiAga3NwID0gMTtcbiAgaWYgKChnID4gMCkgfHwgKE1hdGguYWJzKGcpIDw9IEVQU0xOKSkge1xuICAgIHggPSB0aGlzLmEgKiBrc3AgKiBjb3NwaGkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIGtzcCAqICh0aGlzLmNvc19wMTQgKiBzaW5waGkgLSB0aGlzLnNpbl9wMTQgKiBjb3NwaGkgKiBjb3Nsb24pO1xuICB9XG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciByaDsgLyogaGVpZ2h0IGFib3ZlIGVsbGlwc29pZCAgICAgICovXG4gIHZhciB6OyAvKiBhbmdsZSAgICAgICAgICAqL1xuICB2YXIgc2lueiwgY29zejsgLyogc2luIG9mIHogYW5kIGNvcyBvZiB6ICAgICAgKi9cbiAgdmFyIGNvbjtcbiAgdmFyIGxvbiwgbGF0O1xuICAvKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICByaCA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICB6ID0gYXNpbnoocmggLyB0aGlzLmEpO1xuXG4gIHNpbnogPSBNYXRoLnNpbih6KTtcbiAgY29zeiA9IE1hdGguY29zKHopO1xuXG4gIGxvbiA9IHRoaXMubG9uZzA7XG4gIGlmIChNYXRoLmFicyhyaCkgPD0gRVBTTE4pIHtcbiAgICBsYXQgPSB0aGlzLmxhdDA7XG4gICAgcC54ID0gbG9uO1xuICAgIHAueSA9IGxhdDtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBsYXQgPSBhc2lueihjb3N6ICogdGhpcy5zaW5fcDE0ICsgKHAueSAqIHNpbnogKiB0aGlzLmNvc19wMTQpIC8gcmgpO1xuICBjb24gPSBNYXRoLmFicyh0aGlzLmxhdDApIC0gSEFMRl9QSTtcbiAgaWYgKE1hdGguYWJzKGNvbikgPD0gRVBTTE4pIHtcbiAgICBpZiAodGhpcy5sYXQwID49IDApIHtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtcC55KSwgdGhpcy5vdmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwIC0gTWF0aC5hdGFuMigtcC54LCBwLnkpLCB0aGlzLm92ZXIpO1xuICAgIH1cbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9XG4gIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIoKHAueCAqIHNpbnopLCByaCAqIHRoaXMuY29zX3AxNCAqIGNvc3ogLSBwLnkgKiB0aGlzLnNpbl9wMTQgKiBzaW56KSwgdGhpcy5vdmVyKTtcbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydvcnRobyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgZTBmbiBmcm9tICcuLi9jb21tb24vZTBmbic7XG5pbXBvcnQgZTFmbiBmcm9tICcuLi9jb21tb24vZTFmbic7XG5pbXBvcnQgZTJmbiBmcm9tICcuLi9jb21tb24vZTJmbic7XG5pbXBvcnQgZTNmbiBmcm9tICcuLi9jb21tb24vZTNmbic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5pbXBvcnQgbWxmbiBmcm9tICcuLi9jb21tb24vbWxmbic7XG5pbXBvcnQgeyBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5pbXBvcnQgZ04gZnJvbSAnLi4vY29tbW9uL2dOJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0ZW1wXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtbDBcbiAqL1xuXG52YXIgTUFYX0lURVIgPSAyMDtcblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHRoaXMudGVtcCA9IHRoaXMuYiAvIHRoaXMuYTtcbiAgdGhpcy5lcyA9IDEgLSBNYXRoLnBvdyh0aGlzLnRlbXAsIDIpOyAvLyBkZXZhaXQgZXRyZSBkYW5zIHRtZXJjLmpzIG1haXMgbiB5IGVzdCBwYXMgZG9uYyBqZSBjb21tZW50ZSBzaW5vbiByZXRvdXIgZGUgdmFsZXVycyBudWxsZXNcbiAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuICB0aGlzLmUwID0gZTBmbih0aGlzLmVzKTtcbiAgdGhpcy5lMSA9IGUxZm4odGhpcy5lcyk7XG4gIHRoaXMuZTIgPSBlMmZuKHRoaXMuZXMpO1xuICB0aGlzLmUzID0gZTNmbih0aGlzLmVzKTtcbiAgdGhpcy5tbDAgPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHRoaXMubGF0MCk7IC8vIHNpIHF1ZSBkZXMgemVyb3MgbGUgY2FsY3VsIG5lIHNlIGZhaXQgcGFzXG59XG5cbi8qIFBvbHljb25pYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHgsIHksIGVsO1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgZWwgPSBkbG9uICogTWF0aC5zaW4obGF0KTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgaWYgKE1hdGguYWJzKGxhdCkgPD0gRVBTTE4pIHtcbiAgICAgIHggPSB0aGlzLmEgKiBkbG9uO1xuICAgICAgeSA9IC0xICogdGhpcy5hICogdGhpcy5sYXQwO1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0gdGhpcy5hICogTWF0aC5zaW4oZWwpIC8gTWF0aC50YW4obGF0KTtcbiAgICAgIHkgPSB0aGlzLmEgKiAoYWRqdXN0X2xhdChsYXQgLSB0aGlzLmxhdDApICsgKDEgLSBNYXRoLmNvcyhlbCkpIC8gTWF0aC50YW4obGF0KSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG4gICAgICB4ID0gdGhpcy5hICogZGxvbjtcbiAgICAgIHkgPSAtMSAqIHRoaXMubWwwO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbmwgPSBnTih0aGlzLmEsIHRoaXMuZSwgTWF0aC5zaW4obGF0KSkgLyBNYXRoLnRhbihsYXQpO1xuICAgICAgeCA9IG5sICogTWF0aC5zaW4oZWwpO1xuICAgICAgeSA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgbGF0KSAtIHRoaXMubWwwICsgbmwgKiAoMSAtIE1hdGguY29zKGVsKSk7XG4gICAgfVxuICB9XG4gIHAueCA9IHggKyB0aGlzLngwO1xuICBwLnkgPSB5ICsgdGhpcy55MDtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEludmVyc2UgZXF1YXRpb25zXG4gIC0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBsb24sIGxhdCwgeCwgeSwgaTtcbiAgdmFyIGFsLCBibDtcbiAgdmFyIHBoaSwgZHBoaTtcbiAgeCA9IHAueCAtIHRoaXMueDA7XG4gIHkgPSBwLnkgLSB0aGlzLnkwO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmIChNYXRoLmFicyh5ICsgdGhpcy5hICogdGhpcy5sYXQwKSA8PSBFUFNMTikge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih4IC8gdGhpcy5hICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgICAgIGxhdCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsID0gdGhpcy5sYXQwICsgeSAvIHRoaXMuYTtcbiAgICAgIGJsID0geCAqIHggLyB0aGlzLmEgLyB0aGlzLmEgKyBhbCAqIGFsO1xuICAgICAgcGhpID0gYWw7XG4gICAgICB2YXIgdGFucGhpO1xuICAgICAgZm9yIChpID0gTUFYX0lURVI7IGk7IC0taSkge1xuICAgICAgICB0YW5waGkgPSBNYXRoLnRhbihwaGkpO1xuICAgICAgICBkcGhpID0gLTEgKiAoYWwgKiAocGhpICogdGFucGhpICsgMSkgLSBwaGkgLSAwLjUgKiAocGhpICogcGhpICsgYmwpICogdGFucGhpKSAvICgocGhpIC0gYWwpIC8gdGFucGhpIC0gMSk7XG4gICAgICAgIHBoaSArPSBkcGhpO1xuICAgICAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gRVBTTE4pIHtcbiAgICAgICAgICBsYXQgPSBwaGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIChNYXRoLmFzaW4oeCAqIE1hdGgudGFuKHBoaSkgLyB0aGlzLmEpKSAvIE1hdGguc2luKGxhdCksIHRoaXMub3Zlcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNYXRoLmFicyh5ICsgdGhpcy5tbDApIDw9IEVQU0xOKSB7XG4gICAgICBsYXQgPSAwO1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgeCAvIHRoaXMuYSwgdGhpcy5vdmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWwgPSAodGhpcy5tbDAgKyB5KSAvIHRoaXMuYTtcbiAgICAgIGJsID0geCAqIHggLyB0aGlzLmEgLyB0aGlzLmEgKyBhbCAqIGFsO1xuICAgICAgcGhpID0gYWw7XG4gICAgICB2YXIgY2wsIG1sbiwgbWxucCwgbWE7XG4gICAgICB2YXIgY29uO1xuICAgICAgZm9yIChpID0gTUFYX0lURVI7IGk7IC0taSkge1xuICAgICAgICBjb24gPSB0aGlzLmUgKiBNYXRoLnNpbihwaGkpO1xuICAgICAgICBjbCA9IE1hdGguc3FydCgxIC0gY29uICogY29uKSAqIE1hdGgudGFuKHBoaSk7XG4gICAgICAgIG1sbiA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgcGhpKTtcbiAgICAgICAgbWxucCA9IHRoaXMuZTAgLSAyICogdGhpcy5lMSAqIE1hdGguY29zKDIgKiBwaGkpICsgNCAqIHRoaXMuZTIgKiBNYXRoLmNvcyg0ICogcGhpKSAtIDYgKiB0aGlzLmUzICogTWF0aC5jb3MoNiAqIHBoaSk7XG4gICAgICAgIG1hID0gbWxuIC8gdGhpcy5hO1xuICAgICAgICBkcGhpID0gKGFsICogKGNsICogbWEgKyAxKSAtIG1hIC0gMC41ICogY2wgKiAobWEgKiBtYSArIGJsKSkgLyAodGhpcy5lcyAqIE1hdGguc2luKDIgKiBwaGkpICogKG1hICogbWEgKyBibCAtIDIgKiBhbCAqIG1hKSAvICg0ICogY2wpICsgKGFsIC0gbWEpICogKGNsICogbWxucCAtIDIgLyBNYXRoLnNpbigyICogcGhpKSkgLSBtbG5wKTtcbiAgICAgICAgcGhpIC09IGRwaGk7XG4gICAgICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSBFUFNMTikge1xuICAgICAgICAgIGxhdCA9IHBoaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBsYXQ9cGhpNHoodGhpcy5lLHRoaXMuZTAsdGhpcy5lMSx0aGlzLmUyLHRoaXMuZTMsYWwsYmwsMCwwKTtcbiAgICAgIGNsID0gTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogTWF0aC5wb3coTWF0aC5zaW4obGF0KSwgMikpICogTWF0aC50YW4obGF0KTtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXNpbih4ICogY2wgLyB0aGlzLmEpIC8gTWF0aC5zaW4obGF0KSwgdGhpcy5vdmVyKTtcbiAgICB9XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1BvbHljb25pYycsICdBbWVyaWNhbl9Qb2x5Y29uaWMnLCAncG9seSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvLyBRU0MgcHJvamVjdGlvbiByZXdyaXR0ZW4gZnJvbSB0aGUgb3JpZ2luYWwgUFJPSjRcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9PU0dlby9wcm9qLjQvYmxvYi9tYXN0ZXIvc3JjL1BKX3FzYy5jXG5cbmltcG9ydCB7IEVQU0xOLCBUV09fUEksIFNQSSwgSEFMRl9QSSwgRk9SVFBJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZmFjZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHgwXG4gKiBAcHJvcGVydHkge251bWJlcn0geTBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG9uZV9taW51c19mXG4gKiBAcHJvcGVydHkge251bWJlcn0gb25lX21pbnVzX2Zfc3F1YXJlZFxuICovXG5cbi8qIGNvbnN0YW50cyAqL1xudmFyIEZBQ0VfRU5VTSA9IHtcbiAgRlJPTlQ6IDEsXG4gIFJJR0hUOiAyLFxuICBCQUNLOiAzLFxuICBMRUZUOiA0LFxuICBUT1A6IDUsXG4gIEJPVFRPTTogNlxufTtcblxudmFyIEFSRUFfRU5VTSA9IHtcbiAgQVJFQV8wOiAxLFxuICBBUkVBXzE6IDIsXG4gIEFSRUFfMjogMyxcbiAgQVJFQV8zOiA0XG59O1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG4gIHRoaXMubGF0MCA9IHRoaXMubGF0MCB8fCAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCB8fCAwO1xuICB0aGlzLmxhdF90cyA9IHRoaXMubGF0X3RzIHx8IDA7XG4gIHRoaXMudGl0bGUgPSB0aGlzLnRpdGxlIHx8ICdRdWFkcmlsYXRlcmFsaXplZCBTcGhlcmljYWwgQ3ViZSc7XG5cbiAgLyogRGV0ZXJtaW5lIHRoZSBjdWJlIGZhY2UgZnJvbSB0aGUgY2VudGVyIG9mIHByb2plY3Rpb24uICovXG4gIGlmICh0aGlzLmxhdDAgPj0gSEFMRl9QSSAtIEZPUlRQSSAvIDIuMCkge1xuICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5UT1A7XG4gIH0gZWxzZSBpZiAodGhpcy5sYXQwIDw9IC0oSEFMRl9QSSAtIEZPUlRQSSAvIDIuMCkpIHtcbiAgICB0aGlzLmZhY2UgPSBGQUNFX0VOVU0uQk9UVE9NO1xuICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMubG9uZzApIDw9IEZPUlRQSSkge1xuICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5GUk9OVDtcbiAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLmxvbmcwKSA8PSBIQUxGX1BJICsgRk9SVFBJKSB7XG4gICAgdGhpcy5mYWNlID0gdGhpcy5sb25nMCA+IDAuMCA/IEZBQ0VfRU5VTS5SSUdIVCA6IEZBQ0VfRU5VTS5MRUZUO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5CQUNLO1xuICB9XG5cbiAgLyogRmlsbCBpbiB1c2VmdWwgdmFsdWVzIGZvciB0aGUgZWxsaXBzb2lkIDwtPiBzcGhlcmUgc2hpZnRcbiAgICogZGVzY3JpYmVkIGluIFtMSzEyXS4gKi9cbiAgaWYgKHRoaXMuZXMgIT09IDApIHtcbiAgICB0aGlzLm9uZV9taW51c19mID0gMSAtICh0aGlzLmEgLSB0aGlzLmIpIC8gdGhpcy5hO1xuICAgIHRoaXMub25lX21pbnVzX2Zfc3F1YXJlZCA9IHRoaXMub25lX21pbnVzX2YgKiB0aGlzLm9uZV9taW51c19mO1xuICB9XG59XG5cbi8vIFFTQyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciB4eSA9IHsgeDogMCwgeTogMCB9O1xuICB2YXIgbGF0LCBsb247XG4gIHZhciB0aGV0YSwgcGhpO1xuICB2YXIgdCwgbXU7XG4gIC8qIG51OyAqL1xuICB2YXIgYXJlYSA9IHsgdmFsdWU6IDAgfTtcblxuICAvLyBtb3ZlIGxvbiBhY2NvcmRpbmcgdG8gcHJvamVjdGlvbidzIGxvblxuICBwLnggLT0gdGhpcy5sb25nMDtcblxuICAvKiBDb252ZXJ0IHRoZSBnZW9kZXRpYyBsYXRpdHVkZSB0byBhIGdlb2NlbnRyaWMgbGF0aXR1ZGUuXG4gICAqIFRoaXMgY29ycmVzcG9uZHMgdG8gdGhlIHNoaWZ0IGZyb20gdGhlIGVsbGlwc29pZCB0byB0aGUgc3BoZXJlXG4gICAqIGRlc2NyaWJlZCBpbiBbTEsxMl0uICovXG4gIGlmICh0aGlzLmVzICE9PSAwKSB7IC8vIGlmIChQLT5lcyAhPSAwKSB7XG4gICAgbGF0ID0gTWF0aC5hdGFuKHRoaXMub25lX21pbnVzX2Zfc3F1YXJlZCAqIE1hdGgudGFuKHAueSkpO1xuICB9IGVsc2Uge1xuICAgIGxhdCA9IHAueTtcbiAgfVxuXG4gIC8qIENvbnZlcnQgdGhlIGlucHV0IGxhdCwgbG9uIGludG8gdGhldGEsIHBoaSBhcyB1c2VkIGJ5IFFTQy5cbiAgICogVGhpcyBkZXBlbmRzIG9uIHRoZSBjdWJlIGZhY2UgYW5kIHRoZSBhcmVhIG9uIGl0LlxuICAgKiBGb3IgdGhlIHRvcCBhbmQgYm90dG9tIGZhY2UsIHdlIGNhbiBjb21wdXRlIHRoZXRhIGFuZCBwaGlcbiAgICogZGlyZWN0bHkgZnJvbSBwaGksIGxhbS4gRm9yIHRoZSBvdGhlciBmYWNlcywgd2UgbXVzdCB1c2VcbiAgICogdW5pdCBzcGhlcmUgY2FydGVzaWFuIGNvb3JkaW5hdGVzIGFzIGFuIGludGVybWVkaWF0ZSBzdGVwLiAqL1xuICBsb24gPSBwLng7IC8vIGxvbiA9IGxwLmxhbTtcbiAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlRPUCkge1xuICAgIHBoaSA9IEhBTEZfUEkgLSBsYXQ7XG4gICAgaWYgKGxvbiA+PSBGT1JUUEkgJiYgbG9uIDw9IEhBTEZfUEkgKyBGT1JUUEkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICAgICAgdGhldGEgPSBsb24gLSBIQUxGX1BJO1xuICAgIH0gZWxzZSBpZiAobG9uID4gSEFMRl9QSSArIEZPUlRQSSB8fCBsb24gPD0gLShIQUxGX1BJICsgRk9SVFBJKSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzE7XG4gICAgICB0aGV0YSA9IChsb24gPiAwLjAgPyBsb24gLSBTUEkgOiBsb24gKyBTUEkpO1xuICAgIH0gZWxzZSBpZiAobG9uID4gLShIQUxGX1BJICsgRk9SVFBJKSAmJiBsb24gPD0gLUZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzI7XG4gICAgICB0aGV0YSA9IGxvbiArIEhBTEZfUEk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8zO1xuICAgICAgdGhldGEgPSBsb247XG4gICAgfVxuICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJPVFRPTSkge1xuICAgIHBoaSA9IEhBTEZfUEkgKyBsYXQ7XG4gICAgaWYgKGxvbiA+PSBGT1JUUEkgJiYgbG9uIDw9IEhBTEZfUEkgKyBGT1JUUEkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICAgICAgdGhldGEgPSAtbG9uICsgSEFMRl9QSTtcbiAgICB9IGVsc2UgaWYgKGxvbiA8IEZPUlRQSSAmJiBsb24gPj0gLUZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzE7XG4gICAgICB0aGV0YSA9IC1sb247XG4gICAgfSBlbHNlIGlmIChsb24gPCAtRk9SVFBJICYmIGxvbiA+PSAtKEhBTEZfUEkgKyBGT1JUUEkpKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMjtcbiAgICAgIHRoZXRhID0gLWxvbiAtIEhBTEZfUEk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8zO1xuICAgICAgdGhldGEgPSAobG9uID4gMC4wID8gLWxvbiArIFNQSSA6IC1sb24gLSBTUEkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgcSwgciwgcztcbiAgICB2YXIgc2lubGF0LCBjb3NsYXQ7XG4gICAgdmFyIHNpbmxvbiwgY29zbG9uO1xuXG4gICAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlJJR0hUKSB7XG4gICAgICBsb24gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihsb24sICtIQUxGX1BJKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJBQ0spIHtcbiAgICAgIGxvbiA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgK1NQSSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5MRUZUKSB7XG4gICAgICBsb24gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihsb24sIC1IQUxGX1BJKTtcbiAgICB9XG4gICAgc2lubGF0ID0gTWF0aC5zaW4obGF0KTtcbiAgICBjb3NsYXQgPSBNYXRoLmNvcyhsYXQpO1xuICAgIHNpbmxvbiA9IE1hdGguc2luKGxvbik7XG4gICAgY29zbG9uID0gTWF0aC5jb3MobG9uKTtcbiAgICBxID0gY29zbGF0ICogY29zbG9uO1xuICAgIHIgPSBjb3NsYXQgKiBzaW5sb247XG4gICAgcyA9IHNpbmxhdDtcblxuICAgIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5GUk9OVCkge1xuICAgICAgcGhpID0gTWF0aC5hY29zKHEpO1xuICAgICAgdGhldGEgPSBxc2NfZndkX2VxdWF0X2ZhY2VfdGhldGEocGhpLCBzLCByLCBhcmVhKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlJJR0hUKSB7XG4gICAgICBwaGkgPSBNYXRoLmFjb3Mocik7XG4gICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIC1xLCBhcmVhKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJBQ0spIHtcbiAgICAgIHBoaSA9IE1hdGguYWNvcygtcSk7XG4gICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIC1yLCBhcmVhKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkxFRlQpIHtcbiAgICAgIHBoaSA9IE1hdGguYWNvcygtcik7XG4gICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIHEsIGFyZWEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKiBJbXBvc3NpYmxlICovXG4gICAgICBwaGkgPSB0aGV0YSA9IDA7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcbiAgICB9XG4gIH1cblxuICAvKiBDb21wdXRlIG11IGFuZCBudSBmb3IgdGhlIGFyZWEgb2YgZGVmaW5pdGlvbi5cbiAgICogRm9yIG11LCBzZWUgRXEuICgzLTIxKSBpbiBbT0w3Nl0sIGJ1dCBub3RlIHRoZSB0eXBvczpcbiAgICogY29tcGFyZSB3aXRoIEVxLiAoMy0xNCkuIEZvciBudSwgc2VlIEVxLiAoMy0zOCkuICovXG4gIG11ID0gTWF0aC5hdGFuKCgxMiAvIFNQSSkgKiAodGhldGEgKyBNYXRoLmFjb3MoTWF0aC5zaW4odGhldGEpICogTWF0aC5jb3MoRk9SVFBJKSkgLSBIQUxGX1BJKSk7XG4gIHQgPSBNYXRoLnNxcnQoKDEgLSBNYXRoLmNvcyhwaGkpKSAvIChNYXRoLmNvcyhtdSkgKiBNYXRoLmNvcyhtdSkpIC8gKDEgLSBNYXRoLmNvcyhNYXRoLmF0YW4oMSAvIE1hdGguY29zKHRoZXRhKSkpKSk7XG5cbiAgLyogQXBwbHkgdGhlIHJlc3VsdCB0byB0aGUgcmVhbCBhcmVhLiAqL1xuICBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMSkge1xuICAgIG11ICs9IEhBTEZfUEk7XG4gIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMikge1xuICAgIG11ICs9IFNQSTtcbiAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8zKSB7XG4gICAgbXUgKz0gMS41ICogU1BJO1xuICB9XG5cbiAgLyogTm93IGNvbXB1dGUgeCwgeSBmcm9tIG11IGFuZCBudSAqL1xuICB4eS54ID0gdCAqIE1hdGguY29zKG11KTtcbiAgeHkueSA9IHQgKiBNYXRoLnNpbihtdSk7XG4gIHh5LnggPSB4eS54ICogdGhpcy5hICsgdGhpcy54MDtcbiAgeHkueSA9IHh5LnkgKiB0aGlzLmEgKyB0aGlzLnkwO1xuXG4gIHAueCA9IHh5Lng7XG4gIHAueSA9IHh5Lnk7XG4gIHJldHVybiBwO1xufVxuXG4vLyBRU0MgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbHAgPSB7IGxhbTogMCwgcGhpOiAwIH07XG4gIHZhciBtdSwgbnUsIGNvc211LCB0YW5udTtcbiAgdmFyIHRhbnRoZXRhLCB0aGV0YSwgY29zcGhpLCBwaGk7XG4gIHZhciB0O1xuICB2YXIgYXJlYSA9IHsgdmFsdWU6IDAgfTtcblxuICAvKiBkZS1vZmZzZXQgKi9cbiAgcC54ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5hO1xuICBwLnkgPSAocC55IC0gdGhpcy55MCkgLyB0aGlzLmE7XG5cbiAgLyogQ29udmVydCB0aGUgaW5wdXQgeCwgeSB0byB0aGUgbXUgYW5kIG51IGFuZ2xlcyBhcyB1c2VkIGJ5IFFTQy5cbiAgICogVGhpcyBkZXBlbmRzIG9uIHRoZSBhcmVhIG9mIHRoZSBjdWJlIGZhY2UuICovXG4gIG51ID0gTWF0aC5hdGFuKE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpKTtcbiAgbXUgPSBNYXRoLmF0YW4yKHAueSwgcC54KTtcbiAgaWYgKHAueCA+PSAwLjAgJiYgcC54ID49IE1hdGguYWJzKHAueSkpIHtcbiAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcbiAgfSBlbHNlIGlmIChwLnkgPj0gMC4wICYmIHAueSA+PSBNYXRoLmFicyhwLngpKSB7XG4gICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzE7XG4gICAgbXUgLT0gSEFMRl9QSTtcbiAgfSBlbHNlIGlmIChwLnggPCAwLjAgJiYgLXAueCA+PSBNYXRoLmFicyhwLnkpKSB7XG4gICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzI7XG4gICAgbXUgPSAobXUgPCAwLjAgPyBtdSArIFNQSSA6IG11IC0gU1BJKTtcbiAgfSBlbHNlIHtcbiAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMztcbiAgICBtdSArPSBIQUxGX1BJO1xuICB9XG5cbiAgLyogQ29tcHV0ZSBwaGkgYW5kIHRoZXRhIGZvciB0aGUgYXJlYSBvZiBkZWZpbml0aW9uLlxuICAgKiBUaGUgaW52ZXJzZSBwcm9qZWN0aW9uIGlzIG5vdCBkZXNjcmliZWQgaW4gdGhlIG9yaWdpbmFsIHBhcGVyLCBidXQgc29tZVxuICAgKiBnb29kIGhpbnRzIGNhbiBiZSBmb3VuZCBoZXJlIChhcyBvZiAyMDExLTEyLTE0KTpcbiAgICogaHR0cDovL2ZpdHMuZ3NmYy5uYXNhLmdvdi9maXRzYml0cy9zYWYuOTMvc2FmLjkzMDJcbiAgICogKHNlYXJjaCBmb3IgXCJNZXNzYWdlLUlkOiA8OTMwMjE4MTc1OS5BQTI1NDc3IGF0IGZpdHMuY3YubnJhby5lZHU+XCIpICovXG4gIHQgPSAoU1BJIC8gMTIpICogTWF0aC50YW4obXUpO1xuICB0YW50aGV0YSA9IE1hdGguc2luKHQpIC8gKE1hdGguY29zKHQpIC0gKDEgLyBNYXRoLnNxcnQoMikpKTtcbiAgdGhldGEgPSBNYXRoLmF0YW4odGFudGhldGEpO1xuICBjb3NtdSA9IE1hdGguY29zKG11KTtcbiAgdGFubnUgPSBNYXRoLnRhbihudSk7XG4gIGNvc3BoaSA9IDEgLSBjb3NtdSAqIGNvc211ICogdGFubnUgKiB0YW5udSAqICgxIC0gTWF0aC5jb3MoTWF0aC5hdGFuKDEgLyBNYXRoLmNvcyh0aGV0YSkpKSk7XG4gIGlmIChjb3NwaGkgPCAtMSkge1xuICAgIGNvc3BoaSA9IC0xO1xuICB9IGVsc2UgaWYgKGNvc3BoaSA+ICsxKSB7XG4gICAgY29zcGhpID0gKzE7XG4gIH1cblxuICAvKiBBcHBseSB0aGUgcmVzdWx0IHRvIHRoZSByZWFsIGFyZWEgb24gdGhlIGN1YmUgZmFjZS5cbiAgICogRm9yIHRoZSB0b3AgYW5kIGJvdHRvbSBmYWNlLCB3ZSBjYW4gY29tcHV0ZSBwaGkgYW5kIGxhbSBkaXJlY3RseS5cbiAgICogRm9yIHRoZSBvdGhlciBmYWNlcywgd2UgbXVzdCB1c2UgdW5pdCBzcGhlcmUgY2FydGVzaWFuIGNvb3JkaW5hdGVzXG4gICAqIGFzIGFuIGludGVybWVkaWF0ZSBzdGVwLiAqL1xuICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uVE9QKSB7XG4gICAgcGhpID0gTWF0aC5hY29zKGNvc3BoaSk7XG4gICAgbHAucGhpID0gSEFMRl9QSSAtIHBoaTtcbiAgICBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMCkge1xuICAgICAgbHAubGFtID0gdGhldGEgKyBIQUxGX1BJO1xuICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMSkge1xuICAgICAgbHAubGFtID0gKHRoZXRhIDwgMC4wID8gdGhldGEgKyBTUEkgOiB0aGV0YSAtIFNQSSk7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8yKSB7XG4gICAgICBscC5sYW0gPSB0aGV0YSAtIEhBTEZfUEk7XG4gICAgfSBlbHNlIC8qIGFyZWEudmFsdWUgPT0gQVJFQV9FTlVNLkFSRUFfMyAqLyB7XG4gICAgICBscC5sYW0gPSB0aGV0YTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQk9UVE9NKSB7XG4gICAgcGhpID0gTWF0aC5hY29zKGNvc3BoaSk7XG4gICAgbHAucGhpID0gcGhpIC0gSEFMRl9QSTtcbiAgICBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMCkge1xuICAgICAgbHAubGFtID0gLXRoZXRhICsgSEFMRl9QSTtcbiAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcbiAgICAgIGxwLmxhbSA9IC10aGV0YTtcbiAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzIpIHtcbiAgICAgIGxwLmxhbSA9IC10aGV0YSAtIEhBTEZfUEk7XG4gICAgfSBlbHNlIC8qIGFyZWEudmFsdWUgPT0gQVJFQV9FTlVNLkFSRUFfMyAqLyB7XG4gICAgICBscC5sYW0gPSAodGhldGEgPCAwLjAgPyAtdGhldGEgLSBTUEkgOiAtdGhldGEgKyBTUEkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvKiBDb21wdXRlIHBoaSBhbmQgbGFtIHZpYSBjYXJ0ZXNpYW4gdW5pdCBzcGhlcmUgY29vcmRpbmF0ZXMuICovXG4gICAgdmFyIHEsIHIsIHM7XG4gICAgcSA9IGNvc3BoaTtcbiAgICB0ID0gcSAqIHE7XG4gICAgaWYgKHQgPj0gMSkge1xuICAgICAgcyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHMgPSBNYXRoLnNxcnQoMSAtIHQpICogTWF0aC5zaW4odGhldGEpO1xuICAgIH1cbiAgICB0ICs9IHMgKiBzO1xuICAgIGlmICh0ID49IDEpIHtcbiAgICAgIHIgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByID0gTWF0aC5zcXJ0KDEgLSB0KTtcbiAgICB9XG4gICAgLyogUm90YXRlIHEscixzIGludG8gdGhlIGNvcnJlY3QgYXJlYS4gKi9cbiAgICBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMSkge1xuICAgICAgdCA9IHI7XG4gICAgICByID0gLXM7XG4gICAgICBzID0gdDtcbiAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzIpIHtcbiAgICAgIHIgPSAtcjtcbiAgICAgIHMgPSAtcztcbiAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzMpIHtcbiAgICAgIHQgPSByO1xuICAgICAgciA9IHM7XG4gICAgICBzID0gLXQ7XG4gICAgfVxuICAgIC8qIFJvdGF0ZSBxLHIscyBpbnRvIHRoZSBjb3JyZWN0IGN1YmUgZmFjZS4gKi9cbiAgICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcbiAgICAgIHQgPSBxO1xuICAgICAgcSA9IC1yO1xuICAgICAgciA9IHQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5CQUNLKSB7XG4gICAgICBxID0gLXE7XG4gICAgICByID0gLXI7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5MRUZUKSB7XG4gICAgICB0ID0gcTtcbiAgICAgIHEgPSByO1xuICAgICAgciA9IC10O1xuICAgIH1cbiAgICAvKiBOb3cgY29tcHV0ZSBwaGkgYW5kIGxhbSBmcm9tIHRoZSB1bml0IHNwaGVyZSBjb29yZGluYXRlcy4gKi9cbiAgICBscC5waGkgPSBNYXRoLmFjb3MoLXMpIC0gSEFMRl9QSTtcbiAgICBscC5sYW0gPSBNYXRoLmF0YW4yKHIsIHEpO1xuICAgIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5SSUdIVCkge1xuICAgICAgbHAubGFtID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obHAubGFtLCAtSEFMRl9QSSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5CQUNLKSB7XG4gICAgICBscC5sYW0gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihscC5sYW0sIC1TUEkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uTEVGVCkge1xuICAgICAgbHAubGFtID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obHAubGFtLCArSEFMRl9QSSk7XG4gICAgfVxuICB9XG5cbiAgLyogQXBwbHkgdGhlIHNoaWZ0IGZyb20gdGhlIHNwaGVyZSB0byB0aGUgZWxsaXBzb2lkIGFzIGRlc2NyaWJlZFxuICAgKiBpbiBbTEsxMl0uICovXG4gIGlmICh0aGlzLmVzICE9PSAwKSB7XG4gICAgdmFyIGludmVydF9zaWduO1xuICAgIHZhciB0YW5waGksIHhhO1xuICAgIGludmVydF9zaWduID0gKGxwLnBoaSA8IDAgPyAxIDogMCk7XG4gICAgdGFucGhpID0gTWF0aC50YW4obHAucGhpKTtcbiAgICB4YSA9IHRoaXMuYiAvIE1hdGguc3FydCh0YW5waGkgKiB0YW5waGkgKyB0aGlzLm9uZV9taW51c19mX3NxdWFyZWQpO1xuICAgIGxwLnBoaSA9IE1hdGguYXRhbihNYXRoLnNxcnQodGhpcy5hICogdGhpcy5hIC0geGEgKiB4YSkgLyAodGhpcy5vbmVfbWludXNfZiAqIHhhKSk7XG4gICAgaWYgKGludmVydF9zaWduKSB7XG4gICAgICBscC5waGkgPSAtbHAucGhpO1xuICAgIH1cbiAgfVxuXG4gIGxwLmxhbSArPSB0aGlzLmxvbmcwO1xuICBwLnggPSBscC5sYW07XG4gIHAueSA9IGxwLnBoaTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEhlbHBlciBmdW5jdGlvbiBmb3IgZm9yd2FyZCBwcm9qZWN0aW9uOiBjb21wdXRlIHRoZSB0aGV0YSBhbmdsZVxuICogYW5kIGRldGVybWluZSB0aGUgYXJlYSBudW1iZXIuICovXG5mdW5jdGlvbiBxc2NfZndkX2VxdWF0X2ZhY2VfdGhldGEocGhpLCB5LCB4LCBhcmVhKSB7XG4gIHZhciB0aGV0YTtcbiAgaWYgKHBoaSA8IEVQU0xOKSB7XG4gICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgdGhldGEgPSAwLjA7XG4gIH0gZWxzZSB7XG4gICAgdGhldGEgPSBNYXRoLmF0YW4yKHksIHgpO1xuICAgIGlmIChNYXRoLmFicyh0aGV0YSkgPD0gRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcbiAgICB9IGVsc2UgaWYgKHRoZXRhID4gRk9SVFBJICYmIHRoZXRhIDw9IEhBTEZfUEkgKyBGT1JUUEkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8xO1xuICAgICAgdGhldGEgLT0gSEFMRl9QSTtcbiAgICB9IGVsc2UgaWYgKHRoZXRhID4gSEFMRl9QSSArIEZPUlRQSSB8fCB0aGV0YSA8PSAtKEhBTEZfUEkgKyBGT1JUUEkpKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMjtcbiAgICAgIHRoZXRhID0gKHRoZXRhID49IDAuMCA/IHRoZXRhIC0gU1BJIDogdGhldGEgKyBTUEkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMztcbiAgICAgIHRoZXRhICs9IEhBTEZfUEk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGV0YTtcbn1cblxuLyogSGVscGVyIGZ1bmN0aW9uOiBzaGlmdCB0aGUgbG9uZ2l0dWRlLiAqL1xuZnVuY3Rpb24gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obG9uLCBvZmZzZXQpIHtcbiAgdmFyIHNsb24gPSBsb24gKyBvZmZzZXQ7XG4gIGlmIChzbG9uIDwgLVNQSSkge1xuICAgIHNsb24gKz0gVFdPX1BJO1xuICB9IGVsc2UgaWYgKHNsb24gPiArU1BJKSB7XG4gICAgc2xvbiAtPSBUV09fUEk7XG4gIH1cbiAgcmV0dXJuIHNsb247XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1F1YWRyaWxhdGVyYWxpemVkIFNwaGVyaWNhbCBDdWJlJywgJ1F1YWRyaWxhdGVyYWxpemVkX1NwaGVyaWNhbF9DdWJlJywgJ3FzYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvLyBSb2JpbnNvbiBwcm9qZWN0aW9uXG4vLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vcHJvai40L2Jsb2IvbWFzdGVyL3NyYy9QSl9yb2Jpbi5jXG4vLyBQb2x5bm9taWFsIGNvZWZpY2llbnRzIGZyb20gaHR0cDovL2FydGljbGUuZ21hbmUub3JnL2dtYW5lLmNvbXAuZ2lzLnByb2otNC5kZXZlbC82MDM5XG5cbmltcG9ydCB7IEhBTEZfUEksIEQyUiwgUjJELCBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG52YXIgQ09FRlNfWCA9IFtcbiAgWzEuMDAwMCwgMi4yMTk5ZS0xNywgLTcuMTU1MTVlLTA1LCAzLjExMDNlLTA2XSxcbiAgWzAuOTk4NiwgLTAuMDAwNDgyMjQzLCAtMi40ODk3ZS0wNSwgLTEuMzMwOWUtMDZdLFxuICBbMC45OTU0LCAtMC4wMDA4MzEwMywgLTQuNDg2MDVlLTA1LCAtOS44NjcwMWUtMDddLFxuICBbMC45OTAwLCAtMC4wMDEzNTM2NCwgLTUuOTY2MWUtMDUsIDMuNjc3N2UtMDZdLFxuICBbMC45ODIyLCAtMC4wMDE2NzQ0MiwgLTQuNDk1NDdlLTA2LCAtNS43MjQxMWUtMDZdLFxuICBbMC45NzMwLCAtMC4wMDIxNDg2OCwgLTkuMDM1NzFlLTA1LCAxLjg3MzZlLTA4XSxcbiAgWzAuOTYwMCwgLTAuMDAzMDUwODUsIC05LjAwNzYxZS0wNSwgMS42NDkxN2UtMDZdLFxuICBbMC45NDI3LCAtMC4wMDM4Mjc5MiwgLTYuNTMzODZlLTA1LCAtMi42MTU0ZS0wNl0sXG4gIFswLjkyMTYsIC0wLjAwNDY3NzQ2LCAtMC4wMDAxMDQ1NywgNC44MTI0M2UtMDZdLFxuICBbMC44OTYyLCAtMC4wMDUzNjIyMywgLTMuMjM4MzFlLTA1LCAtNS40MzQzMmUtMDZdLFxuICBbMC44Njc5LCAtMC4wMDYwOTM2MywgLTAuMDAwMTEzODk4LCAzLjMyNDg0ZS0wNl0sXG4gIFswLjgzNTAsIC0wLjAwNjk4MzI1LCAtNi40MDI1M2UtMDUsIDkuMzQ5NTllLTA3XSxcbiAgWzAuNzk4NiwgLTAuMDA3NTUzMzgsIC01LjAwMDA5ZS0wNSwgOS4zNTMyNGUtMDddLFxuICBbMC43NTk3LCAtMC4wMDc5ODMyNCwgLTMuNTk3MWUtMDUsIC0yLjI3NjI2ZS0wNl0sXG4gIFswLjcxODYsIC0wLjAwODUxMzY3LCAtNy4wMTE0OWUtMDUsIC04LjYzMDNlLTA2XSxcbiAgWzAuNjczMiwgLTAuMDA5ODYyMDksIC0wLjAwMDE5OTU2OSwgMS45MTk3NGUtMDVdLFxuICBbMC42MjEzLCAtMC4wMTA0MTgsIDguODM5MjNlLTA1LCA2LjI0MDUxZS0wNl0sXG4gIFswLjU3MjIsIC0wLjAwOTA2NjAxLCAwLjAwMDE4MiwgNi4yNDA1MWUtMDZdLFxuICBbMC41MzIyLCAtMC4wMDY3Nzc5NywgMC4wMDAyNzU2MDgsIDYuMjQwNTFlLTA2XVxuXTtcblxudmFyIENPRUZTX1kgPSBbXG4gIFstNS4yMDQxN2UtMTgsIDAuMDEyNCwgMS4yMTQzMWUtMTgsIC04LjQ1Mjg0ZS0xMV0sXG4gIFswLjA2MjAsIDAuMDEyNCwgLTEuMjY3OTNlLTA5LCA0LjIyNjQyZS0xMF0sXG4gIFswLjEyNDAsIDAuMDEyNCwgNS4wNzE3MWUtMDksIC0xLjYwNjA0ZS0wOV0sXG4gIFswLjE4NjAsIDAuMDEyMzk5OSwgLTEuOTAxODllLTA4LCA2LjAwMTUyZS0wOV0sXG4gIFswLjI0ODAsIDAuMDEyNDAwMiwgNy4xMDAzOWUtMDgsIC0yLjI0ZS0wOF0sXG4gIFswLjMxMDAsIDAuMDEyMzk5MiwgLTIuNjQ5OTdlLTA3LCA4LjM1OTg2ZS0wOF0sXG4gIFswLjM3MjAsIDAuMDEyNDAyOSwgOS44ODk4M2UtMDcsIC0zLjExOTk0ZS0wN10sXG4gIFswLjQzNDAsIDAuMDEyMzg5MywgLTMuNjkwOTNlLTA2LCAtNC4zNTYyMWUtMDddLFxuICBbMC40OTU4LCAwLjAxMjMxOTgsIC0xLjAyMjUyZS0wNSwgLTMuNDU1MjNlLTA3XSxcbiAgWzAuNTU3MSwgMC4wMTIxOTE2LCAtMS41NDA4MWUtMDUsIC01LjgyMjg4ZS0wN10sXG4gIFswLjYxNzYsIDAuMDExOTkzOCwgLTIuNDE0MjRlLTA1LCAtNS4yNTMyN2UtMDddLFxuICBbMC42NzY5LCAwLjAxMTcxMywgLTMuMjAyMjNlLTA1LCAtNS4xNjQwNWUtMDddLFxuICBbMC43MzQ2LCAwLjAxMTM1NDEsIC0zLjk3Njg0ZS0wNSwgLTYuMDkwNTJlLTA3XSxcbiAgWzAuNzkwMywgMC4wMTA5MTA3LCAtNC44OTA0MmUtMDUsIC0xLjA0NzM5ZS0wNl0sXG4gIFswLjg0MzUsIDAuMDEwMzQzMSwgLTYuNDYxNWUtMDUsIC0xLjQwMzc0ZS0wOV0sXG4gIFswLjg5MzYsIDAuMDA5Njk2ODYsIC02LjQ2MzZlLTA1LCAtOC41NDdlLTA2XSxcbiAgWzAuOTM5NCwgMC4wMDg0MDk0NywgLTAuMDAwMTkyODQxLCAtNC4yMTA2ZS0wNl0sXG4gIFswLjk3NjEsIDAuMDA2MTY1MjcsIC0wLjAwMDI1NiwgLTQuMjEwNmUtMDZdLFxuICBbMS4wMDAwLCAwLjAwMzI4OTQ3LCAtMC4wMDAzMTkxNTksIC00LjIxMDZlLTA2XVxuXTtcblxudmFyIEZYQyA9IDAuODQ4NztcbnZhciBGWUMgPSAxLjM1MjM7XG52YXIgQzEgPSBSMkQgLyA1OyAvLyByYWQgdG8gNS1kZWdyZWUgaW50ZXJ2YWxcbnZhciBSQzEgPSAxIC8gQzE7XG52YXIgTk9ERVMgPSAxODtcblxudmFyIHBvbHkzX3ZhbCA9IGZ1bmN0aW9uIChjb2VmcywgeCkge1xuICByZXR1cm4gY29lZnNbMF0gKyB4ICogKGNvZWZzWzFdICsgeCAqIChjb2Vmc1syXSArIHggKiBjb2Vmc1szXSkpO1xufTtcblxudmFyIHBvbHkzX2RlciA9IGZ1bmN0aW9uIChjb2VmcywgeCkge1xuICByZXR1cm4gY29lZnNbMV0gKyB4ICogKDIgKiBjb2Vmc1syXSArIHggKiAzICogY29lZnNbM10pO1xufTtcblxuZnVuY3Rpb24gbmV3dG9uX3JhcHNob24oZl9kZiwgc3RhcnQsIG1heF9lcnIsIGl0ZXJzKSB7XG4gIHZhciB4ID0gc3RhcnQ7XG4gIGZvciAoOyBpdGVyczsgLS1pdGVycykge1xuICAgIHZhciB1cGQgPSBmX2RmKHgpO1xuICAgIHggLT0gdXBkO1xuICAgIGlmIChNYXRoLmFicyh1cGQpIDwgbWF4X2Vycikge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy54MCA9IHRoaXMueDAgfHwgMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgfHwgMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcbiAgdGhpcy5lcyA9IDA7XG4gIHRoaXMudGl0bGUgPSB0aGlzLnRpdGxlIHx8ICdSb2JpbnNvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKGxsKSB7XG4gIHZhciBsb24gPSBhZGp1c3RfbG9uKGxsLnggLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuXG4gIHZhciBkcGhpID0gTWF0aC5hYnMobGwueSk7XG4gIHZhciBpID0gTWF0aC5mbG9vcihkcGhpICogQzEpO1xuICBpZiAoaSA8IDApIHtcbiAgICBpID0gMDtcbiAgfSBlbHNlIGlmIChpID49IE5PREVTKSB7XG4gICAgaSA9IE5PREVTIC0gMTtcbiAgfVxuICBkcGhpID0gUjJEICogKGRwaGkgLSBSQzEgKiBpKTtcbiAgdmFyIHh5ID0ge1xuICAgIHg6IHBvbHkzX3ZhbChDT0VGU19YW2ldLCBkcGhpKSAqIGxvbixcbiAgICB5OiBwb2x5M192YWwoQ09FRlNfWVtpXSwgZHBoaSlcbiAgfTtcbiAgaWYgKGxsLnkgPCAwKSB7XG4gICAgeHkueSA9IC14eS55O1xuICB9XG5cbiAgeHkueCA9IHh5LnggKiB0aGlzLmEgKiBGWEMgKyB0aGlzLngwO1xuICB4eS55ID0geHkueSAqIHRoaXMuYSAqIEZZQyArIHRoaXMueTA7XG4gIHJldHVybiB4eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UoeHkpIHtcbiAgdmFyIGxsID0ge1xuICAgIHg6ICh4eS54IC0gdGhpcy54MCkgLyAodGhpcy5hICogRlhDKSxcbiAgICB5OiBNYXRoLmFicyh4eS55IC0gdGhpcy55MCkgLyAodGhpcy5hICogRllDKVxuICB9O1xuXG4gIGlmIChsbC55ID49IDEpIHsgLy8gcGF0aG9sb2dpYyBjYXNlXG4gICAgbGwueCAvPSBDT0VGU19YW05PREVTXVswXTtcbiAgICBsbC55ID0geHkueSA8IDAgPyAtSEFMRl9QSSA6IEhBTEZfUEk7XG4gIH0gZWxzZSB7XG4gICAgLy8gZmluZCB0YWJsZSBpbnRlcnZhbFxuICAgIHZhciBpID0gTWF0aC5mbG9vcihsbC55ICogTk9ERVMpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgaSA9IDA7XG4gICAgfSBlbHNlIGlmIChpID49IE5PREVTKSB7XG4gICAgICBpID0gTk9ERVMgLSAxO1xuICAgIH1cbiAgICBmb3IgKDs7KSB7XG4gICAgICBpZiAoQ09FRlNfWVtpXVswXSA+IGxsLnkpIHtcbiAgICAgICAgLS1pO1xuICAgICAgfSBlbHNlIGlmIChDT0VGU19ZW2kgKyAxXVswXSA8PSBsbC55KSB7XG4gICAgICAgICsraTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBpbiA1IGRlZ3JlZSBpbnRlcnZhbFxuICAgIHZhciBjb2VmcyA9IENPRUZTX1lbaV07XG4gICAgdmFyIHQgPSA1ICogKGxsLnkgLSBjb2Vmc1swXSkgLyAoQ09FRlNfWVtpICsgMV1bMF0gLSBjb2Vmc1swXSk7XG4gICAgLy8gZmluZCB0IHNvIHRoYXQgcG9seTNfdmFsKGNvZWZzLCB0KSA9IGxsLnlcbiAgICB0ID0gbmV3dG9uX3JhcHNob24oZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiAocG9seTNfdmFsKGNvZWZzLCB4KSAtIGxsLnkpIC8gcG9seTNfZGVyKGNvZWZzLCB4KTtcbiAgICB9LCB0LCBFUFNMTiwgMTAwKTtcblxuICAgIGxsLnggLz0gcG9seTNfdmFsKENPRUZTX1hbaV0sIHQpO1xuICAgIGxsLnkgPSAoNSAqIGkgKyB0KSAqIEQyUjtcbiAgICBpZiAoeHkueSA8IDApIHtcbiAgICAgIGxsLnkgPSAtbGwueTtcbiAgICB9XG4gIH1cblxuICBsbC54ID0gYWRqdXN0X2xvbihsbC54ICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgcmV0dXJuIGxsO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydSb2JpbnNvbicsICdyb2JpbiddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5pbXBvcnQgcGpfZW5mbiBmcm9tICcuLi9jb21tb24vcGpfZW5mbic7XG52YXIgTUFYX0lURVIgPSAyMDtcbmltcG9ydCBwal9tbGZuIGZyb20gJy4uL2NvbW1vbi9wal9tbGZuJztcbmltcG9ydCBwal9pbnZfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfaW52X21sZm4nO1xuaW1wb3J0IHsgRVBTTE4sIEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuaW1wb3J0IGFzaW56IGZyb20gJy4uL2NvbW1vbi9hc2lueic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGVuXG4gKiBAcHJvcGVydHkge251bWJlcn0gblxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDX3lcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDX3hcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBpZiAoIXRoaXMuc3BoZXJlKSB7XG4gICAgdGhpcy5lbiA9IHBqX2VuZm4odGhpcy5lcyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5uID0gMTtcbiAgICB0aGlzLm0gPSAwO1xuICAgIHRoaXMuZXMgPSAwO1xuICAgIHRoaXMuQ195ID0gTWF0aC5zcXJ0KCh0aGlzLm0gKyAxKSAvIHRoaXMubik7XG4gICAgdGhpcy5DX3ggPSB0aGlzLkNfeSAvICh0aGlzLm0gKyAxKTtcbiAgfVxufVxuXG4vKiBTaW51c29pZGFsIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgeCwgeTtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgaWYgKCF0aGlzLm0pIHtcbiAgICAgIGxhdCA9IHRoaXMubiAhPT0gMSA/IE1hdGguYXNpbih0aGlzLm4gKiBNYXRoLnNpbihsYXQpKSA6IGxhdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGsgPSB0aGlzLm4gKiBNYXRoLnNpbihsYXQpO1xuICAgICAgZm9yICh2YXIgaSA9IE1BWF9JVEVSOyBpOyAtLWkpIHtcbiAgICAgICAgdmFyIFYgPSAodGhpcy5tICogbGF0ICsgTWF0aC5zaW4obGF0KSAtIGspIC8gKHRoaXMubSArIE1hdGguY29zKGxhdCkpO1xuICAgICAgICBsYXQgLT0gVjtcbiAgICAgICAgaWYgKE1hdGguYWJzKFYpIDwgRVBTTE4pIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB4ID0gdGhpcy5hICogdGhpcy5DX3ggKiBsb24gKiAodGhpcy5tICsgTWF0aC5jb3MobGF0KSk7XG4gICAgeSA9IHRoaXMuYSAqIHRoaXMuQ195ICogbGF0O1xuICB9IGVsc2Uge1xuICAgIHZhciBzID0gTWF0aC5zaW4obGF0KTtcbiAgICB2YXIgYyA9IE1hdGguY29zKGxhdCk7XG4gICAgeSA9IHRoaXMuYSAqIHBqX21sZm4obGF0LCBzLCBjLCB0aGlzLmVuKTtcbiAgICB4ID0gdGhpcy5hICogbG9uICogYyAvIE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIHMgKiBzKTtcbiAgfVxuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBsYXQsIHRlbXAsIGxvbiwgcztcblxuICBwLnggLT0gdGhpcy54MDtcbiAgbG9uID0gcC54IC8gdGhpcy5hO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgbGF0ID0gcC55IC8gdGhpcy5hO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGxhdCAvPSB0aGlzLkNfeTtcbiAgICBsb24gPSBsb24gLyAodGhpcy5DX3ggKiAodGhpcy5tICsgTWF0aC5jb3MobGF0KSkpO1xuICAgIGlmICh0aGlzLm0pIHtcbiAgICAgIGxhdCA9IGFzaW56KCh0aGlzLm0gKiBsYXQgKyBNYXRoLnNpbihsYXQpKSAvIHRoaXMubik7XG4gICAgfSBlbHNlIGlmICh0aGlzLm4gIT09IDEpIHtcbiAgICAgIGxhdCA9IGFzaW56KE1hdGguc2luKGxhdCkgLyB0aGlzLm4pO1xuICAgIH1cbiAgICBsb24gPSBhZGp1c3RfbG9uKGxvbiArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gICAgbGF0ID0gYWRqdXN0X2xhdChsYXQpO1xuICB9IGVsc2Uge1xuICAgIGxhdCA9IHBqX2ludl9tbGZuKHAueSAvIHRoaXMuYSwgdGhpcy5lcywgdGhpcy5lbik7XG4gICAgcyA9IE1hdGguYWJzKGxhdCk7XG4gICAgaWYgKHMgPCBIQUxGX1BJKSB7XG4gICAgICBzID0gTWF0aC5zaW4obGF0KTtcbiAgICAgIHRlbXAgPSB0aGlzLmxvbmcwICsgcC54ICogTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogcyAqIHMpIC8gKHRoaXMuYSAqIE1hdGguY29zKGxhdCkpO1xuICAgICAgLy8gdGVtcCA9IHRoaXMubG9uZzAgKyBwLnggLyAodGhpcy5hICogTWF0aC5jb3MobGF0KSk7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRlbXAsIHRoaXMub3Zlcik7XG4gICAgfSBlbHNlIGlmICgocyAtIEVQU0xOKSA8IEhBTEZfUEkpIHtcbiAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgfVxuICB9XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnU2ludXNvaWRhbCcsICdzaW51J107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIi8qXG4gIHJlZmVyZW5jZXM6XG4gICAgRm9ybXVsZXMgZXQgY29uc3RhbnRlcyBwb3VyIGxlIENhbGN1bCBwb3VyIGxhXG4gICAgcHJvamVjdGlvbiBjeWxpbmRyaXF1ZSBjb25mb3JtZSDDoCBheGUgb2JsaXF1ZSBldCBwb3VyIGxhIHRyYW5zZm9ybWF0aW9uIGVudHJlXG4gICAgZGVzIHN5c3TDqG1lcyBkZSByw6lmw6lyZW5jZS5cbiAgICBodHRwOi8vd3d3LnN3aXNzdG9wby5hZG1pbi5jaC9pbnRlcm5ldC9zd2lzc3RvcG8vZnIvaG9tZS90b3BpY3Mvc3VydmV5L3N5cy9yZWZzeXMvc3dpdHplcmxhbmQucGFyc3lzcmVsYXRlZDEuMzEyMTYuZG93bmxvYWRMaXN0Ljc3MDA0LkRvd25sb2FkRmlsZS50bXAvc3dpc3Nwcm9qZWN0aW9uZnIucGRmXG4gICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbGFtYmRhMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBSXG4gKiBAcHJvcGVydHkge251bWJlcn0gYjBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBLXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgcGh5MCA9IHRoaXMubGF0MDtcbiAgdGhpcy5sYW1iZGEwID0gdGhpcy5sb25nMDtcbiAgdmFyIHNpblBoeTAgPSBNYXRoLnNpbihwaHkwKTtcbiAgdmFyIHNlbWlNYWpvckF4aXMgPSB0aGlzLmE7XG4gIHZhciBpbnZGID0gdGhpcy5yZjtcbiAgdmFyIGZsYXR0ZW5pbmcgPSAxIC8gaW52RjtcbiAgdmFyIGUyID0gMiAqIGZsYXR0ZW5pbmcgLSBNYXRoLnBvdyhmbGF0dGVuaW5nLCAyKTtcbiAgdmFyIGUgPSB0aGlzLmUgPSBNYXRoLnNxcnQoZTIpO1xuICB0aGlzLlIgPSB0aGlzLmswICogc2VtaU1ham9yQXhpcyAqIE1hdGguc3FydCgxIC0gZTIpIC8gKDEgLSBlMiAqIE1hdGgucG93KHNpblBoeTAsIDIpKTtcbiAgdGhpcy5hbHBoYSA9IE1hdGguc3FydCgxICsgZTIgLyAoMSAtIGUyKSAqIE1hdGgucG93KE1hdGguY29zKHBoeTApLCA0KSk7XG4gIHRoaXMuYjAgPSBNYXRoLmFzaW4oc2luUGh5MCAvIHRoaXMuYWxwaGEpO1xuICB2YXIgazEgPSBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIHRoaXMuYjAgLyAyKSk7XG4gIHZhciBrMiA9IE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgcGh5MCAvIDIpKTtcbiAgdmFyIGszID0gTWF0aC5sb2coKDEgKyBlICogc2luUGh5MCkgLyAoMSAtIGUgKiBzaW5QaHkwKSk7XG4gIHRoaXMuSyA9IGsxIC0gdGhpcy5hbHBoYSAqIGsyICsgdGhpcy5hbHBoYSAqIGUgLyAyICogazM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIFNhMSA9IE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0IC0gcC55IC8gMikpO1xuICB2YXIgU2EyID0gdGhpcy5lIC8gMiAqIE1hdGgubG9nKCgxICsgdGhpcy5lICogTWF0aC5zaW4ocC55KSkgLyAoMSAtIHRoaXMuZSAqIE1hdGguc2luKHAueSkpKTtcbiAgdmFyIFMgPSAtdGhpcy5hbHBoYSAqIChTYTEgKyBTYTIpICsgdGhpcy5LO1xuXG4gIC8vIHNwaGVyaWMgbGF0aXR1ZGVcbiAgdmFyIGIgPSAyICogKE1hdGguYXRhbihNYXRoLmV4cChTKSkgLSBNYXRoLlBJIC8gNCk7XG5cbiAgLy8gc3BoZXJpYyBsb25naXR1ZGVcbiAgdmFyIEkgPSB0aGlzLmFscGhhICogKHAueCAtIHRoaXMubGFtYmRhMCk7XG5cbiAgLy8gcHNvZXVkbyBlcXVhdG9yaWFsIHJvdGF0aW9uXG4gIHZhciByb3RJID0gTWF0aC5hdGFuKE1hdGguc2luKEkpIC8gKE1hdGguc2luKHRoaXMuYjApICogTWF0aC50YW4oYikgKyBNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguY29zKEkpKSk7XG5cbiAgdmFyIHJvdEIgPSBNYXRoLmFzaW4oTWF0aC5jb3ModGhpcy5iMCkgKiBNYXRoLnNpbihiKSAtIE1hdGguc2luKHRoaXMuYjApICogTWF0aC5jb3MoYikgKiBNYXRoLmNvcyhJKSk7XG5cbiAgcC55ID0gdGhpcy5SIC8gMiAqIE1hdGgubG9nKCgxICsgTWF0aC5zaW4ocm90QikpIC8gKDEgLSBNYXRoLnNpbihyb3RCKSkpICsgdGhpcy55MDtcbiAgcC54ID0gdGhpcy5SICogcm90SSArIHRoaXMueDA7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBZID0gcC54IC0gdGhpcy54MDtcbiAgdmFyIFggPSBwLnkgLSB0aGlzLnkwO1xuXG4gIHZhciByb3RJID0gWSAvIHRoaXMuUjtcbiAgdmFyIHJvdEIgPSAyICogKE1hdGguYXRhbihNYXRoLmV4cChYIC8gdGhpcy5SKSkgLSBNYXRoLlBJIC8gNCk7XG5cbiAgdmFyIGIgPSBNYXRoLmFzaW4oTWF0aC5jb3ModGhpcy5iMCkgKiBNYXRoLnNpbihyb3RCKSArIE1hdGguc2luKHRoaXMuYjApICogTWF0aC5jb3Mocm90QikgKiBNYXRoLmNvcyhyb3RJKSk7XG4gIHZhciBJID0gTWF0aC5hdGFuKE1hdGguc2luKHJvdEkpIC8gKE1hdGguY29zKHRoaXMuYjApICogTWF0aC5jb3Mocm90SSkgLSBNYXRoLnNpbih0aGlzLmIwKSAqIE1hdGgudGFuKHJvdEIpKSk7XG5cbiAgdmFyIGxhbWJkYSA9IHRoaXMubGFtYmRhMCArIEkgLyB0aGlzLmFscGhhO1xuXG4gIHZhciBTID0gMDtcbiAgdmFyIHBoeSA9IGI7XG4gIHZhciBwcmV2UGh5ID0gLTEwMDA7XG4gIHZhciBpdGVyYXRpb24gPSAwO1xuICB3aGlsZSAoTWF0aC5hYnMocGh5IC0gcHJldlBoeSkgPiAwLjAwMDAwMDEpIHtcbiAgICBpZiAoKytpdGVyYXRpb24gPiAyMCkge1xuICAgICAgLy8gLi4ucmVwb3J0RXJyb3IoXCJvbWVyY0Z3ZEluZmluaXR5XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBTID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBwaHkgLyAyKSk7XG4gICAgUyA9IDEgLyB0aGlzLmFscGhhICogKE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgYiAvIDIpKSAtIHRoaXMuSykgKyB0aGlzLmUgKiBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIE1hdGguYXNpbih0aGlzLmUgKiBNYXRoLnNpbihwaHkpKSAvIDIpKTtcbiAgICBwcmV2UGh5ID0gcGh5O1xuICAgIHBoeSA9IDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoUykpIC0gTWF0aC5QSSAvIDI7XG4gIH1cblxuICBwLnggPSBsYW1iZGE7XG4gIHAueSA9IHBoeTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ3NvbWVyYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgeyBFUFNMTiwgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5pbXBvcnQgc2lnbiBmcm9tICcuLi9jb21tb24vc2lnbic7XG5pbXBvcnQgbXNmbnogZnJvbSAnLi4vY29tbW9uL21zZm56JztcbmltcG9ydCB0c2ZueiBmcm9tICcuLi9jb21tb24vdHNmbnonO1xuaW1wb3J0IHBoaTJ6IGZyb20gJy4uL2NvbW1vbi9waGkyeic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zbGF0MFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbmxhdDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtczFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBYMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc1gwXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luWDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb25cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb25zXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzc2ZuXyhwaGl0LCBzaW5waGksIGVjY2VuKSB7XG4gIHNpbnBoaSAqPSBlY2NlbjtcbiAgcmV0dXJuIChNYXRoLnRhbigwLjUgKiAoSEFMRl9QSSArIHBoaXQpKSAqIE1hdGgucG93KCgxIC0gc2lucGhpKSAvICgxICsgc2lucGhpKSwgMC41ICogZWNjZW4pKTtcbn1cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvLyBzZXR0aW5nIGRlZmF1bHQgcGFyYW1ldGVyc1xuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgfHwgMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcblxuICB0aGlzLmNvc2xhdDAgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICB0aGlzLnNpbmxhdDAgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBpZiAodGhpcy5rMCA9PT0gMSAmJiAhaXNOYU4odGhpcy5sYXRfdHMpICYmIE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIHRoaXMuazAgPSAwLjUgKiAoMSArIHNpZ24odGhpcy5sYXQwKSAqIE1hdGguc2luKHRoaXMubGF0X3RzKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNYXRoLmFicyh0aGlzLmNvc2xhdDApIDw9IEVQU0xOKSB7XG4gICAgICBpZiAodGhpcy5sYXQwID4gMCkge1xuICAgICAgICAvLyBOb3J0aCBwb2xlXG4gICAgICAgIC8vIHRyYWNlKCdzdGVyZTpub3J0aCBwb2xlJyk7XG4gICAgICAgIHRoaXMuY29uID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNvdXRoIHBvbGVcbiAgICAgICAgLy8gdHJhY2UoJ3N0ZXJlOnNvdXRoIHBvbGUnKTtcbiAgICAgICAgdGhpcy5jb24gPSAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25zID0gTWF0aC5zcXJ0KE1hdGgucG93KDEgKyB0aGlzLmUsIDEgKyB0aGlzLmUpICogTWF0aC5wb3coMSAtIHRoaXMuZSwgMSAtIHRoaXMuZSkpO1xuICAgIGlmICh0aGlzLmswID09PSAxICYmICFpc05hTih0aGlzLmxhdF90cykgJiYgTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8PSBFUFNMTiAmJiBNYXRoLmFicyhNYXRoLmNvcyh0aGlzLmxhdF90cykpID4gRVBTTE4pIHtcbiAgICAgIC8vIFdoZW4gazAgaXMgMSAoZGVmYXVsdCB2YWx1ZSkgYW5kIGxhdF90cyBpcyBhIHZhaWxkIG51bWJlciBhbmQgbGF0MCBpcyBhdCBhIHBvbGUgYW5kIGxhdF90cyBpcyBub3QgYXQgYSBwb2xlXG4gICAgICAvLyBSZWNhbGN1bGF0ZSBrMCB1c2luZyBmb3JtdWxhIDIxLTM1IGZyb20gcDE2MSBvZiBTbnlkZXIsIDE5ODdcbiAgICAgIHRoaXMuazAgPSAwLjUgKiB0aGlzLmNvbnMgKiBtc2Zueih0aGlzLmUsIE1hdGguc2luKHRoaXMubGF0X3RzKSwgTWF0aC5jb3ModGhpcy5sYXRfdHMpKSAvIHRzZm56KHRoaXMuZSwgdGhpcy5jb24gKiB0aGlzLmxhdF90cywgdGhpcy5jb24gKiBNYXRoLnNpbih0aGlzLmxhdF90cykpO1xuICAgIH1cbiAgICB0aGlzLm1zMSA9IG1zZm56KHRoaXMuZSwgdGhpcy5zaW5sYXQwLCB0aGlzLmNvc2xhdDApO1xuICAgIHRoaXMuWDAgPSAyICogTWF0aC5hdGFuKHNzZm5fKHRoaXMubGF0MCwgdGhpcy5zaW5sYXQwLCB0aGlzLmUpKSAtIEhBTEZfUEk7XG4gICAgdGhpcy5jb3NYMCA9IE1hdGguY29zKHRoaXMuWDApO1xuICAgIHRoaXMuc2luWDAgPSBNYXRoLnNpbih0aGlzLlgwKTtcbiAgfVxufVxuXG4vLyBTdGVyZW9ncmFwaGljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgc2lubGF0ID0gTWF0aC5zaW4obGF0KTtcbiAgdmFyIGNvc2xhdCA9IE1hdGguY29zKGxhdCk7XG4gIHZhciBBLCBYLCBzaW5YLCBjb3NYLCB0cywgcmg7XG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuXG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhsb24gLSB0aGlzLmxvbmcwKSAtIE1hdGguUEkpIDw9IEVQU0xOICYmIE1hdGguYWJzKGxhdCArIHRoaXMubGF0MCkgPD0gRVBTTE4pIHtcbiAgICAvLyBjYXNlIG9mIHRoZSBvcmlnaW5lIHBvaW50XG4gICAgLy8gdHJhY2UoJ3N0ZXJlOnRoaXMgaXMgdGhlIG9yaWdpbiBwb2ludCcpO1xuICAgIHAueCA9IE5hTjtcbiAgICBwLnkgPSBOYU47XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgLy8gdHJhY2UoJ3N0ZXJlOnNwaGVyZSBjYXNlJyk7XG4gICAgQSA9IDIgKiB0aGlzLmswIC8gKDEgKyB0aGlzLnNpbmxhdDAgKiBzaW5sYXQgKyB0aGlzLmNvc2xhdDAgKiBjb3NsYXQgKiBNYXRoLmNvcyhkbG9uKSk7XG4gICAgcC54ID0gdGhpcy5hICogQSAqIGNvc2xhdCAqIE1hdGguc2luKGRsb24pICsgdGhpcy54MDtcbiAgICBwLnkgPSB0aGlzLmEgKiBBICogKHRoaXMuY29zbGF0MCAqIHNpbmxhdCAtIHRoaXMuc2lubGF0MCAqIGNvc2xhdCAqIE1hdGguY29zKGRsb24pKSArIHRoaXMueTA7XG4gICAgcmV0dXJuIHA7XG4gIH0gZWxzZSB7XG4gICAgWCA9IDIgKiBNYXRoLmF0YW4oc3Nmbl8obGF0LCBzaW5sYXQsIHRoaXMuZSkpIC0gSEFMRl9QSTtcbiAgICBjb3NYID0gTWF0aC5jb3MoWCk7XG4gICAgc2luWCA9IE1hdGguc2luKFgpO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLmNvc2xhdDApIDw9IEVQU0xOKSB7XG4gICAgICB0cyA9IHRzZm56KHRoaXMuZSwgbGF0ICogdGhpcy5jb24sIHRoaXMuY29uICogc2lubGF0KTtcbiAgICAgIHJoID0gMiAqIHRoaXMuYSAqIHRoaXMuazAgKiB0cyAvIHRoaXMuY29ucztcbiAgICAgIHAueCA9IHRoaXMueDAgKyByaCAqIE1hdGguc2luKGxvbiAtIHRoaXMubG9uZzApO1xuICAgICAgcC55ID0gdGhpcy55MCAtIHRoaXMuY29uICogcmggKiBNYXRoLmNvcyhsb24gLSB0aGlzLmxvbmcwKTtcbiAgICAgIC8vIHRyYWNlKHAudG9TdHJpbmcoKSk7XG4gICAgICByZXR1cm4gcDtcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuc2lubGF0MCkgPCBFUFNMTikge1xuICAgICAgLy8gRXFcbiAgICAgIC8vIHRyYWNlKCdzdGVyZTplcXVhdGV1cicpO1xuICAgICAgQSA9IDIgKiB0aGlzLmEgKiB0aGlzLmswIC8gKDEgKyBjb3NYICogTWF0aC5jb3MoZGxvbikpO1xuICAgICAgcC55ID0gQSAqIHNpblg7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyIGNhc2VcbiAgICAgIC8vIHRyYWNlKCdzdGVyZTpub3JtYWwgY2FzZScpO1xuICAgICAgQSA9IDIgKiB0aGlzLmEgKiB0aGlzLmswICogdGhpcy5tczEgLyAodGhpcy5jb3NYMCAqICgxICsgdGhpcy5zaW5YMCAqIHNpblggKyB0aGlzLmNvc1gwICogY29zWCAqIE1hdGguY29zKGRsb24pKSk7XG4gICAgICBwLnkgPSBBICogKHRoaXMuY29zWDAgKiBzaW5YIC0gdGhpcy5zaW5YMCAqIGNvc1ggKiBNYXRoLmNvcyhkbG9uKSkgKyB0aGlzLnkwO1xuICAgIH1cbiAgICBwLnggPSBBICogY29zWCAqIE1hdGguc2luKGRsb24pICsgdGhpcy54MDtcbiAgfVxuICAvLyB0cmFjZShwLnRvU3RyaW5nKCkpO1xuICByZXR1cm4gcDtcbn1cblxuLy8qIFN0ZXJlb2dyYXBoaWMgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgdmFyIGxvbiwgbGF0LCB0cywgY2UsIENoaTtcbiAgdmFyIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHZhciBjID0gMiAqIE1hdGguYXRhbihyaCAvICgyICogdGhpcy5hICogdGhpcy5rMCkpO1xuICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgbGF0ID0gdGhpcy5sYXQwO1xuICAgIGlmIChyaCA8PSBFUFNMTikge1xuICAgICAgcC54ID0gbG9uO1xuICAgICAgcC55ID0gbGF0O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGxhdCA9IE1hdGguYXNpbihNYXRoLmNvcyhjKSAqIHRoaXMuc2lubGF0MCArIHAueSAqIE1hdGguc2luKGMpICogdGhpcy5jb3NsYXQwIC8gcmgpO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLmNvc2xhdDApIDwgRVBTTE4pIHtcbiAgICAgIGlmICh0aGlzLmxhdDAgPiAwKSB7XG4gICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtMSAqIHAueSksIHRoaXMub3Zlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgcC55KSwgdGhpcy5vdmVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLnggKiBNYXRoLnNpbihjKSwgcmggKiB0aGlzLmNvc2xhdDAgKiBNYXRoLmNvcyhjKSAtIHAueSAqIHRoaXMuc2lubGF0MCAqIE1hdGguc2luKGMpKSwgdGhpcy5vdmVyKTtcbiAgICB9XG4gICAgcC54ID0gbG9uO1xuICAgIHAueSA9IGxhdDtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8PSBFUFNMTikge1xuICAgICAgaWYgKHJoIDw9IEVQU0xOKSB7XG4gICAgICAgIGxhdCA9IHRoaXMubGF0MDtcbiAgICAgICAgbG9uID0gdGhpcy5sb25nMDtcbiAgICAgICAgcC54ID0gbG9uO1xuICAgICAgICBwLnkgPSBsYXQ7XG4gICAgICAgIC8vIHRyYWNlKHAudG9TdHJpbmcoKSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfVxuICAgICAgcC54ICo9IHRoaXMuY29uO1xuICAgICAgcC55ICo9IHRoaXMuY29uO1xuICAgICAgdHMgPSByaCAqIHRoaXMuY29ucyAvICgyICogdGhpcy5hICogdGhpcy5rMCk7XG4gICAgICBsYXQgPSB0aGlzLmNvbiAqIHBoaTJ6KHRoaXMuZSwgdHMpO1xuICAgICAgbG9uID0gdGhpcy5jb24gKiBhZGp1c3RfbG9uKHRoaXMuY29uICogdGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtMSAqIHAueSksIHRoaXMub3Zlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlID0gMiAqIE1hdGguYXRhbihyaCAqIHRoaXMuY29zWDAgLyAoMiAqIHRoaXMuYSAqIHRoaXMuazAgKiB0aGlzLm1zMSkpO1xuICAgICAgbG9uID0gdGhpcy5sb25nMDtcbiAgICAgIGlmIChyaCA8PSBFUFNMTikge1xuICAgICAgICBDaGkgPSB0aGlzLlgwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ2hpID0gTWF0aC5hc2luKE1hdGguY29zKGNlKSAqIHRoaXMuc2luWDAgKyBwLnkgKiBNYXRoLnNpbihjZSkgKiB0aGlzLmNvc1gwIC8gcmgpO1xuICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCAqIE1hdGguc2luKGNlKSwgcmggKiB0aGlzLmNvc1gwICogTWF0aC5jb3MoY2UpIC0gcC55ICogdGhpcy5zaW5YMCAqIE1hdGguc2luKGNlKSksIHRoaXMub3Zlcik7XG4gICAgICB9XG4gICAgICBsYXQgPSAtMSAqIHBoaTJ6KHRoaXMuZSwgTWF0aC50YW4oMC41ICogKEhBTEZfUEkgKyBDaGkpKSk7XG4gICAgfVxuICB9XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuXG4gIC8vIHRyYWNlKHAudG9TdHJpbmcoKSk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydzdGVyZScsICdTdGVyZW9ncmFwaGljX1NvdXRoX1BvbGUnLCAnUG9sYXJfU3RlcmVvZ3JhcGhpY192YXJpYW50X0EnLCAnUG9sYXJfU3RlcmVvZ3JhcGhpY192YXJpYW50X0InLCAnUG9sYXJfU3RlcmVvZ3JhcGhpYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXMsXG4gIHNzZm5fOiBzc2ZuX1xufTtcbiIsImltcG9ydCBnYXVzcyBmcm9tICcuL2dhdXNzJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBoeXBvdCBmcm9tICcuLi9jb21tb24vaHlwb3QnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbmMwXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zYzBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBSMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJjXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGhpYzBcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIGdhdXNzLmluaXQuYXBwbHkodGhpcyk7XG4gIGlmICghdGhpcy5yYykge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnNpbmMwID0gTWF0aC5zaW4odGhpcy5waGljMCk7XG4gIHRoaXMuY29zYzAgPSBNYXRoLmNvcyh0aGlzLnBoaWMwKTtcbiAgdGhpcy5SMiA9IDIgKiB0aGlzLnJjO1xuICBpZiAoIXRoaXMudGl0bGUpIHtcbiAgICB0aGlzLnRpdGxlID0gJ09ibGlxdWUgU3RlcmVvZ3JhcGhpYyBBbHRlcm5hdGl2ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgc2luYywgY29zYywgY29zbCwgaztcbiAgcC54ID0gYWRqdXN0X2xvbihwLnggLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICBnYXVzcy5mb3J3YXJkLmFwcGx5KHRoaXMsIFtwXSk7XG4gIHNpbmMgPSBNYXRoLnNpbihwLnkpO1xuICBjb3NjID0gTWF0aC5jb3MocC55KTtcbiAgY29zbCA9IE1hdGguY29zKHAueCk7XG4gIGsgPSB0aGlzLmswICogdGhpcy5SMiAvICgxICsgdGhpcy5zaW5jMCAqIHNpbmMgKyB0aGlzLmNvc2MwICogY29zYyAqIGNvc2wpO1xuICBwLnggPSBrICogY29zYyAqIE1hdGguc2luKHAueCk7XG4gIHAueSA9IGsgKiAodGhpcy5jb3NjMCAqIHNpbmMgLSB0aGlzLnNpbmMwICogY29zYyAqIGNvc2wpO1xuICBwLnggPSB0aGlzLmEgKiBwLnggKyB0aGlzLngwO1xuICBwLnkgPSB0aGlzLmEgKiBwLnkgKyB0aGlzLnkwO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgc2luYywgY29zYywgbG9uLCBsYXQsIHJobztcbiAgcC54ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5hO1xuICBwLnkgPSAocC55IC0gdGhpcy55MCkgLyB0aGlzLmE7XG5cbiAgcC54IC89IHRoaXMuazA7XG4gIHAueSAvPSB0aGlzLmswO1xuICBpZiAoKHJobyA9IGh5cG90KHAueCwgcC55KSkpIHtcbiAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKHJobywgdGhpcy5SMik7XG4gICAgc2luYyA9IE1hdGguc2luKGMpO1xuICAgIGNvc2MgPSBNYXRoLmNvcyhjKTtcbiAgICBsYXQgPSBNYXRoLmFzaW4oY29zYyAqIHRoaXMuc2luYzAgKyBwLnkgKiBzaW5jICogdGhpcy5jb3NjMCAvIHJobyk7XG4gICAgbG9uID0gTWF0aC5hdGFuMihwLnggKiBzaW5jLCByaG8gKiB0aGlzLmNvc2MwICogY29zYyAtIHAueSAqIHRoaXMuc2luYzAgKiBzaW5jKTtcbiAgfSBlbHNlIHtcbiAgICBsYXQgPSB0aGlzLnBoaWMwO1xuICAgIGxvbiA9IDA7XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgZ2F1c3MuaW52ZXJzZS5hcHBseSh0aGlzLCBbcF0pO1xuICBwLnggPSBhZGp1c3RfbG9uKHAueCArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydTdGVyZW9ncmFwaGljX05vcnRoX1BvbGUnLCAnT2JsaXF1ZV9TdGVyZW9ncmFwaGljJywgJ3N0ZXJlYScsICdPYmxpcXVlIFN0ZXJlb2dyYXBoaWMgQWx0ZXJuYXRpdmUnLCAnRG91YmxlX1N0ZXJlb2dyYXBoaWMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiLy8gSGVhdmlseSBiYXNlZCBvbiB0aGlzIHRtZXJjIHByb2plY3Rpb24gaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYmxvY2gvbWFwc2hhcGVyLXByb2ovYmxvYi9tYXN0ZXIvc3JjL3Byb2plY3Rpb25zL3RtZXJjLmpzXG5cbmltcG9ydCBwal9lbmZuIGZyb20gJy4uL2NvbW1vbi9wal9lbmZuJztcbmltcG9ydCBwal9tbGZuIGZyb20gJy4uL2NvbW1vbi9wal9tbGZuJztcbmltcG9ydCBwal9pbnZfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfaW52X21sZm4nO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG5pbXBvcnQgeyBFUFNMTiwgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IHNpZ24gZnJvbSAnLi4vY29tbW9uL3NpZ24nO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGVuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWwwXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLngwID0gdGhpcy54MCAhPT0gdW5kZWZpbmVkID8gdGhpcy54MCA6IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwICE9PSB1bmRlZmluZWQgPyB0aGlzLnkwIDogMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgIT09IHVuZGVmaW5lZCA/IHRoaXMubG9uZzAgOiAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgIT09IHVuZGVmaW5lZCA/IHRoaXMubGF0MCA6IDA7XG5cbiAgaWYgKHRoaXMuZXMpIHtcbiAgICB0aGlzLmVuID0gcGpfZW5mbih0aGlzLmVzKTtcbiAgICB0aGlzLm1sMCA9IHBqX21sZm4odGhpcy5sYXQwLCBNYXRoLnNpbih0aGlzLmxhdDApLCBNYXRoLmNvcyh0aGlzLmxhdDApLCB0aGlzLmVuKTtcbiAgfVxufVxuXG4vKipcbiAgICBUcmFuc3ZlcnNlIE1lcmNhdG9yIEZvcndhcmQgIC0gbG9uZy9sYXQgdG8geC95XG4gICAgbG9uZy9sYXQgaW4gcmFkaWFuc1xuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHZhciBkZWx0YV9sb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciBjb247XG4gIHZhciB4LCB5O1xuICB2YXIgc2luX3BoaSA9IE1hdGguc2luKGxhdCk7XG4gIHZhciBjb3NfcGhpID0gTWF0aC5jb3MobGF0KTtcblxuICBpZiAoIXRoaXMuZXMpIHtcbiAgICB2YXIgYiA9IGNvc19waGkgKiBNYXRoLnNpbihkZWx0YV9sb24pO1xuXG4gICAgaWYgKChNYXRoLmFicyhNYXRoLmFicyhiKSAtIDEpKSA8IEVQU0xOKSB7XG4gICAgICByZXR1cm4gKDkzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IDAuNSAqIHRoaXMuYSAqIHRoaXMuazAgKiBNYXRoLmxvZygoMSArIGIpIC8gKDEgLSBiKSkgKyB0aGlzLngwO1xuICAgICAgeSA9IGNvc19waGkgKiBNYXRoLmNvcyhkZWx0YV9sb24pIC8gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdyhiLCAyKSk7XG4gICAgICBiID0gTWF0aC5hYnMoeSk7XG5cbiAgICAgIGlmIChiID49IDEpIHtcbiAgICAgICAgaWYgKChiIC0gMSkgPiBFUFNMTikge1xuICAgICAgICAgIHJldHVybiAoOTMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHkgPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB5ID0gTWF0aC5hY29zKHkpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGF0IDwgMCkge1xuICAgICAgICB5ID0gLXk7XG4gICAgICB9XG5cbiAgICAgIHkgPSB0aGlzLmEgKiB0aGlzLmswICogKHkgLSB0aGlzLmxhdDApICsgdGhpcy55MDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGFsID0gY29zX3BoaSAqIGRlbHRhX2xvbjtcbiAgICB2YXIgYWxzID0gTWF0aC5wb3coYWwsIDIpO1xuICAgIHZhciBjID0gdGhpcy5lcDIgKiBNYXRoLnBvdyhjb3NfcGhpLCAyKTtcbiAgICB2YXIgY3MgPSBNYXRoLnBvdyhjLCAyKTtcbiAgICB2YXIgdHEgPSBNYXRoLmFicyhjb3NfcGhpKSA+IEVQU0xOID8gTWF0aC50YW4obGF0KSA6IDA7XG4gICAgdmFyIHQgPSBNYXRoLnBvdyh0cSwgMik7XG4gICAgdmFyIHRzID0gTWF0aC5wb3codCwgMik7XG4gICAgY29uID0gMSAtIHRoaXMuZXMgKiBNYXRoLnBvdyhzaW5fcGhpLCAyKTtcbiAgICBhbCA9IGFsIC8gTWF0aC5zcXJ0KGNvbik7XG4gICAgdmFyIG1sID0gcGpfbWxmbihsYXQsIHNpbl9waGksIGNvc19waGksIHRoaXMuZW4pO1xuXG4gICAgeCA9IHRoaXMuYSAqICh0aGlzLmswICogYWwgKiAoMVxuICAgICAgKyBhbHMgLyA2ICogKDEgLSB0ICsgY1xuICAgICAgICArIGFscyAvIDIwICogKDUgLSAxOCAqIHQgKyB0cyArIDE0ICogYyAtIDU4ICogdCAqIGNcbiAgICAgICAgICArIGFscyAvIDQyICogKDYxICsgMTc5ICogdHMgLSB0cyAqIHQgLSA0NzkgKiB0KSkpKSlcbiAgICAgICAgKyB0aGlzLngwO1xuXG4gICAgeSA9IHRoaXMuYSAqICh0aGlzLmswICogKG1sIC0gdGhpcy5tbDBcbiAgICAgICsgc2luX3BoaSAqIGRlbHRhX2xvbiAqIGFsIC8gMiAqICgxXG4gICAgICAgICsgYWxzIC8gMTIgKiAoNSAtIHQgKyA5ICogYyArIDQgKiBjc1xuICAgICAgICAgICsgYWxzIC8gMzAgKiAoNjEgKyB0cyAtIDU4ICogdCArIDI3MCAqIGMgLSAzMzAgKiB0ICogY1xuICAgICAgICAgICAgKyBhbHMgLyA1NiAqICgxMzg1ICsgNTQzICogdHMgLSB0cyAqIHQgLSAzMTExICogdCkpKSkpKVxuICAgICAgICAgICsgdGhpcy55MDtcbiAgfVxuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG5cbiAgcmV0dXJuIHA7XG59XG5cbi8qKlxuICAgIFRyYW5zdmVyc2UgTWVyY2F0b3IgSW52ZXJzZSAgLSAgeC95IHRvIGxvbmcvbGF0XG4gICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBjb24sIHBoaTtcbiAgdmFyIGxhdCwgbG9uO1xuICB2YXIgeCA9IChwLnggLSB0aGlzLngwKSAqICgxIC8gdGhpcy5hKTtcbiAgdmFyIHkgPSAocC55IC0gdGhpcy55MCkgKiAoMSAvIHRoaXMuYSk7XG5cbiAgaWYgKCF0aGlzLmVzKSB7XG4gICAgdmFyIGYgPSBNYXRoLmV4cCh4IC8gdGhpcy5rMCk7XG4gICAgdmFyIGcgPSAwLjUgKiAoZiAtIDEgLyBmKTtcbiAgICB2YXIgdGVtcCA9IHRoaXMubGF0MCArIHkgLyB0aGlzLmswO1xuICAgIHZhciBoID0gTWF0aC5jb3ModGVtcCk7XG4gICAgY29uID0gTWF0aC5zcXJ0KCgxIC0gTWF0aC5wb3coaCwgMikpIC8gKDEgKyBNYXRoLnBvdyhnLCAyKSkpO1xuICAgIGxhdCA9IE1hdGguYXNpbihjb24pO1xuXG4gICAgaWYgKHkgPCAwKSB7XG4gICAgICBsYXQgPSAtbGF0O1xuICAgIH1cblxuICAgIGlmICgoZyA9PT0gMCkgJiYgKGggPT09IDApKSB7XG4gICAgICBsb24gPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKE1hdGguYXRhbjIoZywgaCkgKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gZWxsaXBzb2lkYWwgZm9ybVxuICAgIGNvbiA9IHRoaXMubWwwICsgeSAvIHRoaXMuazA7XG4gICAgcGhpID0gcGpfaW52X21sZm4oY29uLCB0aGlzLmVzLCB0aGlzLmVuKTtcblxuICAgIGlmIChNYXRoLmFicyhwaGkpIDwgSEFMRl9QSSkge1xuICAgICAgdmFyIHNpbl9waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgICAgdmFyIGNvc19waGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgICAgdmFyIHRhbl9waGkgPSBNYXRoLmFicyhjb3NfcGhpKSA+IEVQU0xOID8gTWF0aC50YW4ocGhpKSA6IDA7XG4gICAgICB2YXIgYyA9IHRoaXMuZXAyICogTWF0aC5wb3coY29zX3BoaSwgMik7XG4gICAgICB2YXIgY3MgPSBNYXRoLnBvdyhjLCAyKTtcbiAgICAgIHZhciB0ID0gTWF0aC5wb3codGFuX3BoaSwgMik7XG4gICAgICB2YXIgdHMgPSBNYXRoLnBvdyh0LCAyKTtcbiAgICAgIGNvbiA9IDEgLSB0aGlzLmVzICogTWF0aC5wb3coc2luX3BoaSwgMik7XG4gICAgICB2YXIgZCA9IHggKiBNYXRoLnNxcnQoY29uKSAvIHRoaXMuazA7XG4gICAgICB2YXIgZHMgPSBNYXRoLnBvdyhkLCAyKTtcbiAgICAgIGNvbiA9IGNvbiAqIHRhbl9waGk7XG5cbiAgICAgIGxhdCA9IHBoaSAtIChjb24gKiBkcyAvICgxIC0gdGhpcy5lcykpICogMC41ICogKDFcbiAgICAgICAgLSBkcyAvIDEyICogKDUgKyAzICogdCAtIDkgKiBjICogdCArIGMgLSA0ICogY3NcbiAgICAgICAgICAtIGRzIC8gMzAgKiAoNjEgKyA5MCAqIHQgLSAyNTIgKiBjICogdCArIDQ1ICogdHMgKyA0NiAqIGNcbiAgICAgICAgICAgIC0gZHMgLyA1NiAqICgxMzg1ICsgMzYzMyAqIHQgKyA0MDk1ICogdHMgKyAxNTc0ICogdHMgKiB0KSkpKTtcblxuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKGQgKiAoMVxuICAgICAgICAtIGRzIC8gNiAqICgxICsgMiAqIHQgKyBjXG4gICAgICAgICAgLSBkcyAvIDIwICogKDUgKyAyOCAqIHQgKyAyNCAqIHRzICsgOCAqIGMgKiB0ICsgNiAqIGNcbiAgICAgICAgICAgIC0gZHMgLyA0MiAqICg2MSArIDY2MiAqIHQgKyAxMzIwICogdHMgKyA3MjAgKiB0cyAqIHQpKSkpIC8gY29zX3BoaSksIHRoaXMub3Zlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhdCA9IEhBTEZfUEkgKiBzaWduKHkpO1xuICAgICAgbG9uID0gMDtcbiAgICB9XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcblxuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnRmFzdF9UcmFuc3ZlcnNlX01lcmNhdG9yJywgJ0Zhc3QgVHJhbnN2ZXJzZSBNZXJjYXRvciddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgeyBEMlIsIEhBTEZfUEksIEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgaHlwb3QgZnJvbSAnLi4vY29tbW9uL2h5cG90JztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtb2RlXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2lucGgwXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zcGgwXG4gKiBAcHJvcGVydHkge251bWJlcn0gcG4xXG4gKiBAcHJvcGVydHkge251bWJlcn0gaFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJwXG4gKiBAcHJvcGVydHkge251bWJlcn0gcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGgxXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGZhY3RcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRpbHRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhemlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjZ1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNnXG4gKiBAcHJvcGVydHkge251bWJlcn0gY3dcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzd1xuICovXG5cbnZhciBtb2RlID0ge1xuICBOX1BPTEU6IDAsXG4gIFNfUE9MRTogMSxcbiAgRVFVSVQ6IDIsXG4gIE9CTElROiAzXG59O1xuXG52YXIgcGFyYW1zID0ge1xuICBoOiB7IGRlZjogMTAwMDAwLCBudW06IHRydWUgfSwgLy8gZGVmYXVsdCBpcyBLYXJtYW4gbGluZSwgbm8gZGVmYXVsdCBpbiBQUk9KLjdcbiAgYXppOiB7IGRlZjogMCwgbnVtOiB0cnVlLCBkZWdyZWVzOiB0cnVlIH0sIC8vIGRlZmF1bHQgaXMgTm9ydGhcbiAgdGlsdDogeyBkZWY6IDAsIG51bTogdHJ1ZSwgZGVncmVlczogdHJ1ZSB9LCAvLyBkZWZhdWx0IGlzIE5hZGlyXG4gIGxvbmcwOiB7IGRlZjogMCwgbnVtOiB0cnVlIH0sIC8vIGRlZmF1bHQgaXMgR3JlZW53aWNoLCBjb252ZXJzaW9uIHRvIHJhZCBpcyBhdXRvbWF0aWNcbiAgbGF0MDogeyBkZWY6IDAsIG51bTogdHJ1ZSB9IC8vIGRlZmF1bHQgaXMgRXF1YXRvciwgY29udmVyc2lvbiB0byByYWQgaXMgYXV0b21hdGljXG59O1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgIGlmICh0eXBlb2YgdGhpc1twXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXNbcF0gPSBwYXJhbXNbcF0uZGVmO1xuICAgIH0gZWxzZSBpZiAocGFyYW1zW3BdLm51bSAmJiBpc05hTih0aGlzW3BdKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmFtZXRlciB2YWx1ZSwgbXVzdCBiZSBudW1lcmljICcgKyBwICsgJyA9ICcgKyB0aGlzW3BdKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtc1twXS5udW0pIHtcbiAgICAgIHRoaXNbcF0gPSBwYXJzZUZsb2F0KHRoaXNbcF0pO1xuICAgIH1cbiAgICBpZiAocGFyYW1zW3BdLmRlZ3JlZXMpIHtcbiAgICAgIHRoaXNbcF0gPSB0aGlzW3BdICogRDJSO1xuICAgIH1cbiAgfS5iaW5kKHRoaXMpKTtcblxuICBpZiAoTWF0aC5hYnMoKE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJKSkgPCBFUFNMTikge1xuICAgIHRoaXMubW9kZSA9IHRoaXMubGF0MCA8IDAgPyBtb2RlLlNfUE9MRSA6IG1vZGUuTl9QT0xFO1xuICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMubGF0MCkgPCBFUFNMTikge1xuICAgIHRoaXMubW9kZSA9IG1vZGUuRVFVSVQ7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tb2RlID0gbW9kZS5PQkxJUTtcbiAgICB0aGlzLnNpbnBoMCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gICAgdGhpcy5jb3NwaDAgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICB9XG5cbiAgdGhpcy5wbjEgPSB0aGlzLmggLyB0aGlzLmE7IC8vIE5vcm1hbGl6ZSByZWxhdGl2ZSB0byB0aGUgRWFydGgncyByYWRpdXNcblxuICBpZiAodGhpcy5wbjEgPD0gMCB8fCB0aGlzLnBuMSA+IDFlMTApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGVpZ2h0Jyk7XG4gIH1cblxuICB0aGlzLnAgPSAxICsgdGhpcy5wbjE7XG4gIHRoaXMucnAgPSAxIC8gdGhpcy5wO1xuICB0aGlzLmgxID0gMSAvIHRoaXMucG4xO1xuICB0aGlzLnBmYWN0ID0gKHRoaXMucCArIDEpICogdGhpcy5oMTtcbiAgdGhpcy5lcyA9IDA7XG5cbiAgdmFyIG9tZWdhID0gdGhpcy50aWx0O1xuICB2YXIgZ2FtbWEgPSB0aGlzLmF6aTtcbiAgdGhpcy5jZyA9IE1hdGguY29zKGdhbW1hKTtcbiAgdGhpcy5zZyA9IE1hdGguc2luKGdhbW1hKTtcbiAgdGhpcy5jdyA9IE1hdGguY29zKG9tZWdhKTtcbiAgdGhpcy5zdyA9IE1hdGguc2luKG9tZWdhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICBwLnggLT0gdGhpcy5sb25nMDtcbiAgdmFyIHNpbnBoaSA9IE1hdGguc2luKHAueSk7XG4gIHZhciBjb3NwaGkgPSBNYXRoLmNvcyhwLnkpO1xuICB2YXIgY29zbGFtID0gTWF0aC5jb3MocC54KTtcbiAgdmFyIHgsIHk7XG4gIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgY2FzZSBtb2RlLk9CTElROlxuICAgICAgeSA9IHRoaXMuc2lucGgwICogc2lucGhpICsgdGhpcy5jb3NwaDAgKiBjb3NwaGkgKiBjb3NsYW07XG4gICAgICBicmVhaztcbiAgICBjYXNlIG1vZGUuRVFVSVQ6XG4gICAgICB5ID0gY29zcGhpICogY29zbGFtO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLlNfUE9MRTpcbiAgICAgIHkgPSAtc2lucGhpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLk5fUE9MRTpcbiAgICAgIHkgPSBzaW5waGk7XG4gICAgICBicmVhaztcbiAgfVxuICB5ID0gdGhpcy5wbjEgLyAodGhpcy5wIC0geSk7XG4gIHggPSB5ICogY29zcGhpICogTWF0aC5zaW4ocC54KTtcblxuICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgIGNhc2UgbW9kZS5PQkxJUTpcbiAgICAgIHkgKj0gdGhpcy5jb3NwaDAgKiBzaW5waGkgLSB0aGlzLnNpbnBoMCAqIGNvc3BoaSAqIGNvc2xhbTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbW9kZS5FUVVJVDpcbiAgICAgIHkgKj0gc2lucGhpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLk5fUE9MRTpcbiAgICAgIHkgKj0gLShjb3NwaGkgKiBjb3NsYW0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLlNfUE9MRTpcbiAgICAgIHkgKj0gY29zcGhpICogY29zbGFtO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBUaWx0XG4gIHZhciB5dCwgYmE7XG4gIHl0ID0geSAqIHRoaXMuY2cgKyB4ICogdGhpcy5zZztcbiAgYmEgPSAxIC8gKHl0ICogdGhpcy5zdyAqIHRoaXMuaDEgKyB0aGlzLmN3KTtcbiAgeCA9ICh4ICogdGhpcy5jZyAtIHkgKiB0aGlzLnNnKSAqIHRoaXMuY3cgKiBiYTtcbiAgeSA9IHl0ICogYmE7XG5cbiAgcC54ID0geCAqIHRoaXMuYTtcbiAgcC55ID0geSAqIHRoaXMuYTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC89IHRoaXMuYTtcbiAgcC55IC89IHRoaXMuYTtcbiAgdmFyIHIgPSB7IHg6IHAueCwgeTogcC55IH07XG5cbiAgLy8gVW4tVGlsdFxuICB2YXIgYm0sIGJxLCB5dDtcbiAgeXQgPSAxIC8gKHRoaXMucG4xIC0gcC55ICogdGhpcy5zdyk7XG4gIGJtID0gdGhpcy5wbjEgKiBwLnggKiB5dDtcbiAgYnEgPSB0aGlzLnBuMSAqIHAueSAqIHRoaXMuY3cgKiB5dDtcbiAgcC54ID0gYm0gKiB0aGlzLmNnICsgYnEgKiB0aGlzLnNnO1xuICBwLnkgPSBicSAqIHRoaXMuY2cgLSBibSAqIHRoaXMuc2c7XG5cbiAgdmFyIHJoID0gaHlwb3QocC54LCBwLnkpO1xuICBpZiAoTWF0aC5hYnMocmgpIDwgRVBTTE4pIHtcbiAgICByLnggPSAwO1xuICAgIHIueSA9IHAueTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY29zeiwgc2luejtcbiAgICBzaW56ID0gMSAtIHJoICogcmggKiB0aGlzLnBmYWN0O1xuICAgIHNpbnogPSAodGhpcy5wIC0gTWF0aC5zcXJ0KHNpbnopKSAvICh0aGlzLnBuMSAvIHJoICsgcmggLyB0aGlzLnBuMSk7XG4gICAgY29zeiA9IE1hdGguc3FydCgxIC0gc2lueiAqIHNpbnopO1xuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlIG1vZGUuT0JMSVE6XG4gICAgICAgIHIueSA9IE1hdGguYXNpbihjb3N6ICogdGhpcy5zaW5waDAgKyBwLnkgKiBzaW56ICogdGhpcy5jb3NwaDAgLyByaCk7XG4gICAgICAgIHAueSA9IChjb3N6IC0gdGhpcy5zaW5waDAgKiBNYXRoLnNpbihyLnkpKSAqIHJoO1xuICAgICAgICBwLnggKj0gc2lueiAqIHRoaXMuY29zcGgwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgbW9kZS5FUVVJVDpcbiAgICAgICAgci55ID0gTWF0aC5hc2luKHAueSAqIHNpbnogLyByaCk7XG4gICAgICAgIHAueSA9IGNvc3ogKiByaDtcbiAgICAgICAgcC54ICo9IHNpbno7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBtb2RlLk5fUE9MRTpcbiAgICAgICAgci55ID0gTWF0aC5hc2luKGNvc3opO1xuICAgICAgICBwLnkgPSAtcC55O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgbW9kZS5TX1BPTEU6XG4gICAgICAgIHIueSA9IC1NYXRoLmFzaW4oY29zeik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByLnggPSBNYXRoLmF0YW4yKHAueCwgcC55KTtcbiAgfVxuXG4gIHAueCA9IHIueCArIHRoaXMubG9uZzA7XG4gIHAueSA9IHIueTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1RpbHRlZF9QZXJzcGVjdGl2ZScsICd0cGVycyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X3pvbmUgZnJvbSAnLi4vY29tbW9uL2FkanVzdF96b25lJztcbmltcG9ydCBldG1lcmMgZnJvbSAnLi9ldG1lcmMnO1xuZXhwb3J0IHZhciBkZXBlbmRzT24gPSAnZXRtZXJjJztcbmltcG9ydCB7IEQyUiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciB6b25lID0gYWRqdXN0X3pvbmUodGhpcy56b25lLCB0aGlzLmxvbmcwKTtcbiAgaWYgKHpvbmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biB1dG0gem9uZScpO1xuICB9XG4gIHRoaXMubGF0MCA9IDA7XG4gIHRoaXMubG9uZzAgPSAoKDYgKiBNYXRoLmFicyh6b25lKSkgLSAxODMpICogRDJSO1xuICB0aGlzLngwID0gNTAwMDAwO1xuICB0aGlzLnkwID0gdGhpcy51dG1Tb3V0aCA/IDEwMDAwMDAwIDogMDtcbiAgdGhpcy5rMCA9IDAuOTk5NjtcblxuICBldG1lcmMuaW5pdC5hcHBseSh0aGlzKTtcbiAgdGhpcy5mb3J3YXJkID0gZXRtZXJjLmZvcndhcmQ7XG4gIHRoaXMuaW52ZXJzZSA9IGV0bWVyYy5pbnZlcnNlO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydVbml2ZXJzYWwgVHJhbnN2ZXJzZSBNZXJjYXRvciBTeXN0ZW0nLCAndXRtJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIG5hbWVzOiBuYW1lcyxcbiAgZGVwZW5kc09uOiBkZXBlbmRzT25cbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbmltcG9ydCB7IEhBTEZfUEksIEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IFIgLSBSYWRpdXMgb2YgdGhlIEVhcnRoXG4gKi9cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBWYW4gRGVyIEdyaW50ZW4gcHJvamVjdGlvblxuICogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gdGhpcy5SID0gNjM3MDk5NzsgLy9SYWRpdXMgb2YgZWFydGhcbiAgdGhpcy5SID0gdGhpcy5hO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIHgsIHk7XG5cbiAgaWYgKE1hdGguYWJzKGxhdCkgPD0gRVBTTE4pIHtcbiAgICB4ID0gdGhpcy54MCArIHRoaXMuUiAqIGRsb247XG4gICAgeSA9IHRoaXMueTA7XG4gIH1cbiAgdmFyIHRoZXRhID0gYXNpbnooMiAqIE1hdGguYWJzKGxhdCAvIE1hdGguUEkpKTtcbiAgaWYgKChNYXRoLmFicyhkbG9uKSA8PSBFUFNMTikgfHwgKE1hdGguYWJzKE1hdGguYWJzKGxhdCkgLSBIQUxGX1BJKSA8PSBFUFNMTikpIHtcbiAgICB4ID0gdGhpcy54MDtcbiAgICBpZiAobGF0ID49IDApIHtcbiAgICAgIHkgPSB0aGlzLnkwICsgTWF0aC5QSSAqIHRoaXMuUiAqIE1hdGgudGFuKDAuNSAqIHRoZXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeSA9IHRoaXMueTAgKyBNYXRoLlBJICogdGhpcy5SICogLU1hdGgudGFuKDAuNSAqIHRoZXRhKTtcbiAgICB9XG4gICAgLy8gIHJldHVybihPSyk7XG4gIH1cbiAgdmFyIGFsID0gMC41ICogTWF0aC5hYnMoKE1hdGguUEkgLyBkbG9uKSAtIChkbG9uIC8gTWF0aC5QSSkpO1xuICB2YXIgYXNxID0gYWwgKiBhbDtcbiAgdmFyIHNpbnRoID0gTWF0aC5zaW4odGhldGEpO1xuICB2YXIgY29zdGggPSBNYXRoLmNvcyh0aGV0YSk7XG5cbiAgdmFyIGcgPSBjb3N0aCAvIChzaW50aCArIGNvc3RoIC0gMSk7XG4gIHZhciBnc3EgPSBnICogZztcbiAgdmFyIG0gPSBnICogKDIgLyBzaW50aCAtIDEpO1xuICB2YXIgbXNxID0gbSAqIG07XG4gIHZhciBjb24gPSBNYXRoLlBJICogdGhpcy5SICogKGFsICogKGcgLSBtc3EpICsgTWF0aC5zcXJ0KGFzcSAqIChnIC0gbXNxKSAqIChnIC0gbXNxKSAtIChtc3EgKyBhc3EpICogKGdzcSAtIG1zcSkpKSAvIChtc3EgKyBhc3EpO1xuICBpZiAoZGxvbiA8IDApIHtcbiAgICBjb24gPSAtY29uO1xuICB9XG4gIHggPSB0aGlzLngwICsgY29uO1xuICAvLyBjb24gPSBNYXRoLmFicyhjb24gLyAoTWF0aC5QSSAqIHRoaXMuUikpO1xuICB2YXIgcSA9IGFzcSArIGc7XG4gIGNvbiA9IE1hdGguUEkgKiB0aGlzLlIgKiAobSAqIHEgLSBhbCAqIE1hdGguc3FydCgobXNxICsgYXNxKSAqIChhc3EgKyAxKSAtIHEgKiBxKSkgLyAobXNxICsgYXNxKTtcbiAgaWYgKGxhdCA+PSAwKSB7XG4gICAgLy8geSA9IHRoaXMueTAgKyBNYXRoLlBJICogdGhpcy5SICogTWF0aC5zcXJ0KDEgLSBjb24gKiBjb24gLSAyICogYWwgKiBjb24pO1xuICAgIHkgPSB0aGlzLnkwICsgY29uO1xuICB9IGVsc2Uge1xuICAgIC8vIHkgPSB0aGlzLnkwIC0gTWF0aC5QSSAqIHRoaXMuUiAqIE1hdGguc3FydCgxIC0gY29uICogY29uIC0gMiAqIGFsICogY29uKTtcbiAgICB5ID0gdGhpcy55MCAtIGNvbjtcbiAgfVxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuLyogVmFuIERlciBHcmludGVuIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIGxvbiwgbGF0O1xuICB2YXIgeHgsIHl5LCB4eXMsIGMxLCBjMiwgYzM7XG4gIHZhciBhMTtcbiAgdmFyIG0xO1xuICB2YXIgY29uO1xuICB2YXIgdGgxO1xuICB2YXIgZDtcblxuICAvKiBpbnZlcnNlIGVxdWF0aW9uc1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgY29uID0gTWF0aC5QSSAqIHRoaXMuUjtcbiAgeHggPSBwLnggLyBjb247XG4gIHl5ID0gcC55IC8gY29uO1xuICB4eXMgPSB4eCAqIHh4ICsgeXkgKiB5eTtcbiAgYzEgPSAtTWF0aC5hYnMoeXkpICogKDEgKyB4eXMpO1xuICBjMiA9IGMxIC0gMiAqIHl5ICogeXkgKyB4eCAqIHh4O1xuICBjMyA9IC0yICogYzEgKyAxICsgMiAqIHl5ICogeXkgKyB4eXMgKiB4eXM7XG4gIGQgPSB5eSAqIHl5IC8gYzMgKyAoMiAqIGMyICogYzIgKiBjMiAvIGMzIC8gYzMgLyBjMyAtIDkgKiBjMSAqIGMyIC8gYzMgLyBjMykgLyAyNztcbiAgYTEgPSAoYzEgLSBjMiAqIGMyIC8gMyAvIGMzKSAvIGMzO1xuICBtMSA9IDIgKiBNYXRoLnNxcnQoLWExIC8gMyk7XG4gIGNvbiA9ICgoMyAqIGQpIC8gYTEpIC8gbTE7XG4gIGlmIChNYXRoLmFicyhjb24pID4gMSkge1xuICAgIGlmIChjb24gPj0gMCkge1xuICAgICAgY29uID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uID0gLTE7XG4gICAgfVxuICB9XG4gIHRoMSA9IE1hdGguYWNvcyhjb24pIC8gMztcbiAgaWYgKHAueSA+PSAwKSB7XG4gICAgbGF0ID0gKC1tMSAqIE1hdGguY29zKHRoMSArIE1hdGguUEkgLyAzKSAtIGMyIC8gMyAvIGMzKSAqIE1hdGguUEk7XG4gIH0gZWxzZSB7XG4gICAgbGF0ID0gLSgtbTEgKiBNYXRoLmNvcyh0aDEgKyBNYXRoLlBJIC8gMykgLSBjMiAvIDMgLyBjMykgKiBNYXRoLlBJO1xuICB9XG5cbiAgaWYgKE1hdGguYWJzKHh4KSA8IEVQU0xOKSB7XG4gICAgbG9uID0gdGhpcy5sb25nMDtcbiAgfSBlbHNlIHtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLlBJICogKHh5cyAtIDEgKyBNYXRoLnNxcnQoMSArIDIgKiAoeHggKiB4eCAtIHl5ICogeXkpICsgeHlzICogeHlzKSkgLyAyIC8geHgsIHRoaXMub3Zlcik7XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1Zhbl9kZXJfR3JpbnRlbl9JJywgJ1ZhbkRlckdyaW50ZW4nLCAnVmFuX2Rlcl9HcmludGVuJywgJ3ZhbmRnJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB7IEQyUiwgUjJELCBQSkRfM1BBUkFNLCBQSkRfN1BBUkFNLCBQSkRfR1JJRFNISUZUIH0gZnJvbSAnLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBkYXR1bV90cmFuc2Zvcm0gZnJvbSAnLi9kYXR1bV90cmFuc2Zvcm0nO1xuaW1wb3J0IGFkanVzdF9heGlzIGZyb20gJy4vYWRqdXN0X2F4aXMnO1xuaW1wb3J0IHByb2ogZnJvbSAnLi9Qcm9qJztcbmltcG9ydCB0b1BvaW50IGZyb20gJy4vY29tbW9uL3RvUG9pbnQnO1xuaW1wb3J0IGNoZWNrU2FuaXR5IGZyb20gJy4vY2hlY2tTYW5pdHknO1xuXG5mdW5jdGlvbiBjaGVja05vdFdHUyhzb3VyY2UsIGRlc3QpIHtcbiAgcmV0dXJuIChcbiAgICAoc291cmNlLmRhdHVtLmRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0gfHwgc291cmNlLmRhdHVtLmRhdHVtX3R5cGUgPT09IFBKRF83UEFSQU0gfHwgc291cmNlLmRhdHVtLmRhdHVtX3R5cGUgPT09IFBKRF9HUklEU0hJRlQpICYmIGRlc3QuZGF0dW1Db2RlICE9PSAnV0dTODQnKVxuICB8fCAoKGRlc3QuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEXzNQQVJBTSB8fCBkZXN0LmRhdHVtLmRhdHVtX3R5cGUgPT09IFBKRF83UEFSQU0gfHwgZGVzdC5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfR1JJRFNISUZUKSAmJiBzb3VyY2UuZGF0dW1Db2RlICE9PSAnV0dTODQnKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259IHNvdXJjZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSBkZXN0XG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlc30gcG9pbnRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5mb3JjZUF4aXNcbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vY29yZScpLkludGVyZmFjZUNvb3JkaW5hdGVzIHwgdW5kZWZpbmVkfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2Zvcm0oc291cmNlLCBkZXN0LCBwb2ludCwgZW5mb3JjZUF4aXMpIHtcbiAgdmFyIHdnczg0O1xuICBpZiAoQXJyYXkuaXNBcnJheShwb2ludCkpIHtcbiAgICBwb2ludCA9IHRvUG9pbnQocG9pbnQpO1xuICB9IGVsc2Uge1xuICAgIC8vIENsb25lIHRoZSBwb2ludCBvYmplY3Qgc28gaW5wdXRzIGRvbid0IGdldCBtb2RpZmllZFxuICAgIHBvaW50ID0ge1xuICAgICAgeDogcG9pbnQueCxcbiAgICAgIHk6IHBvaW50LnksXG4gICAgICB6OiBwb2ludC56LFxuICAgICAgbTogcG9pbnQubVxuICAgIH07XG4gIH1cbiAgdmFyIGhhc1ogPSBwb2ludC56ICE9PSB1bmRlZmluZWQ7XG4gIGNoZWNrU2FuaXR5KHBvaW50KTtcbiAgLy8gV29ya2Fyb3VuZCBmb3IgZGF0dW0gc2hpZnRzIHRvd2dzODQsIGlmIGVpdGhlciBzb3VyY2Ugb3IgZGVzdGluYXRpb24gcHJvamVjdGlvbiBpcyBub3Qgd2dzODRcbiAgaWYgKHNvdXJjZS5kYXR1bSAmJiBkZXN0LmRhdHVtICYmIGNoZWNrTm90V0dTKHNvdXJjZSwgZGVzdCkpIHtcbiAgICB3Z3M4NCA9IG5ldyBwcm9qKCdXR1M4NCcpO1xuICAgIHBvaW50ID0gdHJhbnNmb3JtKHNvdXJjZSwgd2dzODQsIHBvaW50LCBlbmZvcmNlQXhpcyk7XG4gICAgc291cmNlID0gd2dzODQ7XG4gIH1cbiAgLy8gREdSLCAyMDEwLzExLzEyXG4gIGlmIChlbmZvcmNlQXhpcyAmJiBzb3VyY2UuYXhpcyAhPT0gJ2VudScpIHtcbiAgICBwb2ludCA9IGFkanVzdF9heGlzKHNvdXJjZSwgZmFsc2UsIHBvaW50KTtcbiAgfVxuICAvLyBUcmFuc2Zvcm0gc291cmNlIHBvaW50cyB0byBsb25nL2xhdCwgaWYgdGhleSBhcmVuJ3QgYWxyZWFkeS5cbiAgaWYgKHNvdXJjZS5wcm9qTmFtZSA9PT0gJ2xvbmdsYXQnKSB7XG4gICAgcG9pbnQgPSB7XG4gICAgICB4OiBwb2ludC54ICogRDJSLFxuICAgICAgeTogcG9pbnQueSAqIEQyUixcbiAgICAgIHo6IHBvaW50LnogfHwgMFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaWYgKHNvdXJjZS50b19tZXRlcikge1xuICAgICAgcG9pbnQgPSB7XG4gICAgICAgIHg6IHBvaW50LnggKiBzb3VyY2UudG9fbWV0ZXIsXG4gICAgICAgIHk6IHBvaW50LnkgKiBzb3VyY2UudG9fbWV0ZXIsXG4gICAgICAgIHo6IHBvaW50LnogfHwgMFxuICAgICAgfTtcbiAgICB9XG4gICAgcG9pbnQgPSBzb3VyY2UuaW52ZXJzZShwb2ludCk7IC8vIENvbnZlcnQgQ2FydGVzaWFuIHRvIGxvbmdsYXRcbiAgICBpZiAoIXBvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIC8vIEFkanVzdCBmb3IgdGhlIHByaW1lIG1lcmlkaWFuIGlmIG5lY2Vzc2FyeVxuICBpZiAoc291cmNlLmZyb21fZ3JlZW53aWNoKSB7XG4gICAgcG9pbnQueCArPSBzb3VyY2UuZnJvbV9ncmVlbndpY2g7XG4gIH1cblxuICAvLyBDb252ZXJ0IGRhdHVtcyBpZiBuZWVkZWQsIGFuZCBpZiBwb3NzaWJsZS5cbiAgcG9pbnQgPSBkYXR1bV90cmFuc2Zvcm0oc291cmNlLmRhdHVtLCBkZXN0LmRhdHVtLCBwb2ludCk7XG4gIGlmICghcG9pbnQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwb2ludCA9IC8qKiBAdHlwZSB7aW1wb3J0KCcuL2NvcmUnKS5JbnRlcmZhY2VDb29yZGluYXRlc30gKi8gKHBvaW50KTtcblxuICAvLyBBZGp1c3QgZm9yIHRoZSBwcmltZSBtZXJpZGlhbiBpZiBuZWNlc3NhcnlcbiAgaWYgKGRlc3QuZnJvbV9ncmVlbndpY2gpIHtcbiAgICBwb2ludCA9IHtcbiAgICAgIHg6IHBvaW50LnggLSBkZXN0LmZyb21fZ3JlZW53aWNoLFxuICAgICAgeTogcG9pbnQueSxcbiAgICAgIHo6IHBvaW50LnogfHwgMFxuICAgIH07XG4gIH1cblxuICBpZiAoZGVzdC5wcm9qTmFtZSA9PT0gJ2xvbmdsYXQnKSB7XG4gICAgLy8gY29udmVydCByYWRpYW5zIHRvIGRlY2ltYWwgZGVncmVlc1xuICAgIHBvaW50ID0ge1xuICAgICAgeDogcG9pbnQueCAqIFIyRCxcbiAgICAgIHk6IHBvaW50LnkgKiBSMkQsXG4gICAgICB6OiBwb2ludC56IHx8IDBcbiAgICB9O1xuICB9IGVsc2UgeyAvLyBlbHNlIHByb2plY3RcbiAgICBwb2ludCA9IGRlc3QuZm9yd2FyZChwb2ludCk7XG4gICAgaWYgKGRlc3QudG9fbWV0ZXIpIHtcbiAgICAgIHBvaW50ID0ge1xuICAgICAgICB4OiBwb2ludC54IC8gZGVzdC50b19tZXRlcixcbiAgICAgICAgeTogcG9pbnQueSAvIGRlc3QudG9fbWV0ZXIsXG4gICAgICAgIHo6IHBvaW50LnogfHwgMFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvLyBER1IsIDIwMTAvMTEvMTJcbiAgaWYgKGVuZm9yY2VBeGlzICYmIGRlc3QuYXhpcyAhPT0gJ2VudScpIHtcbiAgICByZXR1cm4gYWRqdXN0X2F4aXMoZGVzdCwgdHJ1ZSwgcG9pbnQpO1xuICB9XG5cbiAgaWYgKHBvaW50ICYmICFoYXNaKSB7XG4gICAgZGVsZXRlIHBvaW50Lno7XG4gIH1cbiAgcmV0dXJuIHBvaW50O1xufVxuIiwiaW1wb3J0IHRtZXJjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3RtZXJjJztcbmltcG9ydCBldG1lcmMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZXRtZXJjJztcbmltcG9ydCB1dG0gZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvdXRtJztcbmltcG9ydCBzdGVyZWEgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvc3RlcmVhJztcbmltcG9ydCBzdGVyZSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9zdGVyZSc7XG5pbXBvcnQgc29tZXJjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3NvbWVyYyc7XG5pbXBvcnQgb21lcmMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvb21lcmMnO1xuaW1wb3J0IGxjYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9sY2MnO1xuaW1wb3J0IGtyb3ZhayBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9rcm92YWsnO1xuaW1wb3J0IGNhc3MgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvY2Fzcyc7XG5pbXBvcnQgbGFlYSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9sYWVhJztcbmltcG9ydCBhZWEgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvYWVhJztcbmltcG9ydCBnbm9tIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2dub20nO1xuaW1wb3J0IGNlYSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9jZWEnO1xuaW1wb3J0IGVxYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9lcWMnO1xuaW1wb3J0IHBvbHkgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvcG9seSc7XG5pbXBvcnQgbnptZyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9uem1nJztcbmltcG9ydCBtaWxsIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL21pbGwnO1xuaW1wb3J0IHNpbnUgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvc2ludSc7XG5pbXBvcnQgbW9sbCBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9tb2xsJztcbmltcG9ydCBlcWRjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2VxZGMnO1xuaW1wb3J0IHZhbmRnIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3ZhbmRnJztcbmltcG9ydCBhZXFkIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2FlcWQnO1xuaW1wb3J0IG9ydGhvIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL29ydGhvJztcbmltcG9ydCBxc2MgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvcXNjJztcbmltcG9ydCByb2JpbiBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9yb2Jpbic7XG5pbXBvcnQgZ2VvY2VudCBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9nZW9jZW50JztcbmltcG9ydCB0cGVycyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy90cGVycyc7XG5pbXBvcnQgZ2VvcyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9nZW9zJztcbmltcG9ydCBlcWVhcnRoIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2VxZWFydGgnO1xuaW1wb3J0IGJvbm5lIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2Jvbm5lJztcbmltcG9ydCBvYl90cmFuIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL29iX3RyYW4nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHByb2o0KSB7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHRtZXJjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZXRtZXJjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQodXRtKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoc3RlcmVhKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoc3RlcmUpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChzb21lcmMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChvbWVyYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGxjYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGtyb3Zhayk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGNhc3MpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChsYWVhKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoYWVhKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZ25vbSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGNlYSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGVxYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHBvbHkpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChuem1nKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobWlsbCk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHNpbnUpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChtb2xsKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZXFkYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHZhbmRnKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoYWVxZCk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG9ydGhvKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQocXNjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQocm9iaW4pO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChnZW9jZW50KTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQodHBlcnMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChnZW9zKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZXFlYXJ0aCk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGJvbm5lKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQob2JfdHJhbik7XG59XG4iLCJpbXBvcnQgUFJPSkpTT05CdWlsZGVyQmFzZSBmcm9tICcuL1BST0pKU09OQnVpbGRlckJhc2UuanMnO1xuXG5jbGFzcyBQUk9KSlNPTkJ1aWxkZXIyMDE1IGV4dGVuZHMgUFJPSkpTT05CdWlsZGVyQmFzZSB7XG4gIHN0YXRpYyBjb252ZXJ0KG5vZGUsIHJlc3VsdCA9IHt9KSB7XG4gICAgc3VwZXIuY29udmVydChub2RlLCByZXN1bHQpO1xuXG4gICAgLy8gU2tpcCBgQ1NgIGFuZCBgVVNBR0VgIG5vZGVzIGZvciBXS1QyLTIwMTVcbiAgICBpZiAocmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtICYmIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbS5zdWJ0eXBlID09PSAnQ2FydGVzaWFuJykge1xuICAgICAgZGVsZXRlIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdC51c2FnZSkge1xuICAgICAgZGVsZXRlIHJlc3VsdC51c2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBST0pKU09OQnVpbGRlcjIwMTU7IiwiaW1wb3J0IFBST0pKU09OQnVpbGRlckJhc2UgZnJvbSAnLi9QUk9KSlNPTkJ1aWxkZXJCYXNlLmpzJztcblxuY2xhc3MgUFJPSkpTT05CdWlsZGVyMjAxOSBleHRlbmRzIFBST0pKU09OQnVpbGRlckJhc2Uge1xuICBzdGF0aWMgY29udmVydChub2RlLCByZXN1bHQgPSB7fSkge1xuICAgIHN1cGVyLmNvbnZlcnQobm9kZSwgcmVzdWx0KTtcblxuICAgIC8vIEhhbmRsZSBgQ1NgIG5vZGUgZm9yIFdLVDItMjAxOVxuICAgIGNvbnN0IGNzTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQ1MnKTtcbiAgICBpZiAoY3NOb2RlKSB7XG4gICAgICByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0gPSB7XG4gICAgICAgIHN1YnR5cGU6IGNzTm9kZVsxXSxcbiAgICAgICAgYXhpczogdGhpcy5leHRyYWN0QXhlcyhub2RlKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGBVU0FHRWAgbm9kZSBmb3IgV0tUMi0yMDE5XG4gICAgY29uc3QgdXNhZ2VOb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdVU0FHRScpO1xuICAgIGlmICh1c2FnZU5vZGUpIHtcbiAgICAgIGNvbnN0IHNjb3BlID0gdXNhZ2VOb2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ1NDT1BFJyk7XG4gICAgICBjb25zdCBhcmVhID0gdXNhZ2VOb2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0FSRUEnKTtcbiAgICAgIGNvbnN0IGJib3ggPSB1c2FnZU5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQkJPWCcpO1xuICAgICAgcmVzdWx0LnVzYWdlID0ge307XG4gICAgICBpZiAoc2NvcGUpIHtcbiAgICAgICAgcmVzdWx0LnVzYWdlLnNjb3BlID0gc2NvcGVbMV07XG4gICAgICB9XG4gICAgICBpZiAoYXJlYSkge1xuICAgICAgICByZXN1bHQudXNhZ2UuYXJlYSA9IGFyZWFbMV07XG4gICAgICB9XG4gICAgICBpZiAoYmJveCkge1xuICAgICAgICByZXN1bHQudXNhZ2UuYmJveCA9IGJib3guc2xpY2UoMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQUk9KSlNPTkJ1aWxkZXIyMDE5OyIsImNsYXNzIFBST0pKU09OQnVpbGRlckJhc2Uge1xuICBzdGF0aWMgZ2V0SWQobm9kZSkge1xuICAgIGNvbnN0IGlkTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnSUQnKTtcbiAgICBpZiAoaWROb2RlICYmIGlkTm9kZS5sZW5ndGggPj0gMykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYXV0aG9yaXR5OiBpZE5vZGVbMV0sXG4gICAgICAgIGNvZGU6IHBhcnNlSW50KGlkTm9kZVsyXSwgMTApLFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzdGF0aWMgY29udmVydFVuaXQobm9kZSwgdHlwZSA9ICd1bml0Jykge1xuICAgIGlmICghbm9kZSB8fCBub2RlLmxlbmd0aCA8IDMpIHtcbiAgICAgIHJldHVybiB7IHR5cGUsIG5hbWU6ICd1bmtub3duJywgY29udmVyc2lvbl9mYWN0b3I6IG51bGwgfTtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lID0gbm9kZVsxXTtcbiAgICBjb25zdCBjb252ZXJzaW9uRmFjdG9yID0gcGFyc2VGbG9hdChub2RlWzJdKSB8fCBudWxsO1xuXG4gICAgY29uc3QgaWROb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdJRCcpO1xuICAgIGNvbnN0IGlkID0gaWROb2RlXG4gICAgICA/IHtcbiAgICAgICAgYXV0aG9yaXR5OiBpZE5vZGVbMV0sXG4gICAgICAgIGNvZGU6IHBhcnNlSW50KGlkTm9kZVsyXSwgMTApLFxuICAgICAgfVxuICAgICAgOiBudWxsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGUsXG4gICAgICBuYW1lLFxuICAgICAgY29udmVyc2lvbl9mYWN0b3I6IGNvbnZlcnNpb25GYWN0b3IsXG4gICAgICBpZCxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGNvbnZlcnRBeGlzKG5vZGUpIHtcbiAgICBjb25zdCBuYW1lID0gbm9kZVsxXSB8fCAnVW5rbm93bic7XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIGRpcmVjdGlvblxuICAgIGxldCBkaXJlY3Rpb247XG4gICAgY29uc3QgYWJicmV2aWF0aW9uTWF0Y2ggPSBuYW1lLm1hdGNoKC9eXFwoKC4pXFwpJC8pOyAvLyBNYXRjaCBhYmJyZXZpYXRpb25zIGxpa2UgXCIoRSlcIiBvciBcIihOKVwiXG4gICAgaWYgKGFiYnJldmlhdGlvbk1hdGNoKSB7XG4gICAgICAvLyBVc2UgdGhlIGFiYnJldmlhdGlvbiB0byBkZXRlcm1pbmUgdGhlIGRpcmVjdGlvblxuICAgICAgY29uc3QgYWJicmV2aWF0aW9uID0gYWJicmV2aWF0aW9uTWF0Y2hbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgIGlmIChhYmJyZXZpYXRpb24gPT09ICdFJykgZGlyZWN0aW9uID0gJ2Vhc3QnO1xuICAgICAgZWxzZSBpZiAoYWJicmV2aWF0aW9uID09PSAnTicpIGRpcmVjdGlvbiA9ICdub3J0aCc7XG4gICAgICBlbHNlIGlmIChhYmJyZXZpYXRpb24gPT09ICdVJykgZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGF4aXMgYWJicmV2aWF0aW9uOiAke2FiYnJldmlhdGlvbn1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBleHBsaWNpdCBkaXJlY3Rpb24gcHJvdmlkZWQgaW4gdGhlIEFYSVMgbm9kZVxuICAgICAgZGlyZWN0aW9uID0gbm9kZVsyXSA/IG5vZGVbMl0udG9Mb3dlckNhc2UoKSA6ICd1bmtub3duJztcbiAgICB9XG5cbiAgICBjb25zdCBvcmRlck5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ09SREVSJyk7XG4gICAgY29uc3Qgb3JkZXIgPSBvcmRlck5vZGUgPyBwYXJzZUludChvcmRlck5vZGVbMV0sIDEwKSA6IG51bGw7XG5cbiAgICBjb25zdCB1bml0Tm9kZSA9IG5vZGUuZmluZChcbiAgICAgIChjaGlsZCkgPT5cbiAgICAgICAgQXJyYXkuaXNBcnJheShjaGlsZCkgJiZcbiAgICAgICAgKGNoaWxkWzBdID09PSAnTEVOR1RIVU5JVCcgfHwgY2hpbGRbMF0gPT09ICdBTkdMRVVOSVQnIHx8IGNoaWxkWzBdID09PSAnU0NBTEVVTklUJylcbiAgICApO1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLmNvbnZlcnRVbml0KHVuaXROb2RlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lLFxuICAgICAgZGlyZWN0aW9uLCAvLyBVc2UgdGhlIHZhbGlkIFBST0pKU09OIGRpcmVjdGlvbiB2YWx1ZVxuICAgICAgdW5pdCxcbiAgICAgIG9yZGVyLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZXh0cmFjdEF4ZXMobm9kZSkge1xuICAgIHJldHVybiBub2RlXG4gICAgICAuZmlsdGVyKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdBWElTJylcbiAgICAgIC5tYXAoKGF4aXMpID0+IHRoaXMuY29udmVydEF4aXMoYXhpcykpXG4gICAgICAuc29ydCgoYSwgYikgPT4gKGEub3JkZXIgfHwgMCkgLSAoYi5vcmRlciB8fCAwKSk7IC8vIFNvcnQgYnkgdGhlIFwib3JkZXJcIiBwcm9wZXJ0eVxuICB9XG5cbiAgc3RhdGljIGNvbnZlcnQobm9kZSwgcmVzdWx0ID0ge30pIHtcblxuICAgIHN3aXRjaCAobm9kZVswXSkge1xuICAgICAgY2FzZSAnUFJPSkNSUyc6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ1Byb2plY3RlZENSUyc7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgICAgcmVzdWx0LmJhc2VfY3JzID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdCQVNFR0VPR0NSUycpXG4gICAgICAgICAgPyB0aGlzLmNvbnZlcnQobm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdCQVNFR0VPR0NSUycpKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgcmVzdWx0LmNvbnZlcnNpb24gPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0NPTlZFUlNJT04nKVxuICAgICAgICAgID8gdGhpcy5jb252ZXJ0KG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQ09OVkVSU0lPTicpKVxuICAgICAgICAgIDogbnVsbDtcblxuICAgICAgICBjb25zdCBjc05vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0NTJyk7XG4gICAgICAgIGlmIChjc05vZGUpIHtcbiAgICAgICAgICByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0gPSB7XG4gICAgICAgICAgICB0eXBlOiBjc05vZGVbMV0sXG4gICAgICAgICAgICBheGlzOiB0aGlzLmV4dHJhY3RBeGVzKG5vZGUpLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsZW5ndGhVbml0Tm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTEVOR1RIVU5JVCcpO1xuICAgICAgICBpZiAobGVuZ3RoVW5pdE5vZGUpIHtcbiAgICAgICAgICBjb25zdCB1bml0ID0gdGhpcy5jb252ZXJ0VW5pdChsZW5ndGhVbml0Tm9kZSk7XG4gICAgICAgICAgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtLnVuaXQgPSB1bml0OyAvLyBBZGQgdW5pdCB0byBjb29yZGluYXRlX3N5c3RlbVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LmlkID0gdGhpcy5nZXRJZChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0JBU0VHRU9HQ1JTJzpcbiAgICAgIGNhc2UgJ0dFT0dDUlMnOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdHZW9ncmFwaGljQ1JTJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgXG4gICAgICAgIC8vIEhhbmRsZSBEQVRVTSBvciBFTlNFTUJMRVxuICAgICAgICBjb25zdCBkYXR1bU9yRW5zZW1ibGVOb2RlID0gbm9kZS5maW5kKFxuICAgICAgICAgIChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgKGNoaWxkWzBdID09PSAnREFUVU0nIHx8IGNoaWxkWzBdID09PSAnRU5TRU1CTEUnKVxuICAgICAgICApO1xuICAgICAgICBpZiAoZGF0dW1PckVuc2VtYmxlTm9kZSkge1xuICAgICAgICAgIGNvbnN0IGRhdHVtT3JFbnNlbWJsZSA9IHRoaXMuY29udmVydChkYXR1bU9yRW5zZW1ibGVOb2RlKTtcbiAgICAgICAgICBpZiAoZGF0dW1PckVuc2VtYmxlTm9kZVswXSA9PT0gJ0VOU0VNQkxFJykge1xuICAgICAgICAgICAgcmVzdWx0LmRhdHVtX2Vuc2VtYmxlID0gZGF0dW1PckVuc2VtYmxlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuZGF0dW0gPSBkYXR1bU9yRW5zZW1ibGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHByaW1lbSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnUFJJTUVNJyk7XG4gICAgICAgICAgaWYgKHByaW1lbSAmJiBwcmltZW1bMV0gIT09ICdHcmVlbndpY2gnKSB7XG4gICAgICAgICAgICBkYXR1bU9yRW5zZW1ibGUucHJpbWVfbWVyaWRpYW4gPSB7XG4gICAgICAgICAgICAgIG5hbWU6IHByaW1lbVsxXSxcbiAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBwYXJzZUZsb2F0KHByaW1lbVsyXSksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtID0ge1xuICAgICAgICAgIHR5cGU6ICdlbGxpcHNvaWRhbCcsXG4gICAgICAgICAgYXhpczogdGhpcy5leHRyYWN0QXhlcyhub2RlKSxcbiAgICAgICAgfTtcbiAgICAgIFxuICAgICAgICByZXN1bHQuaWQgPSB0aGlzLmdldElkKG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnREFUVU0nOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdHZW9kZXRpY1JlZmVyZW5jZUZyYW1lJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgICByZXN1bHQuZWxsaXBzb2lkID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdFTExJUFNPSUQnKVxuICAgICAgICAgID8gdGhpcy5jb252ZXJ0KG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnRUxMSVBTT0lEJykpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICBicmVhaztcbiAgICAgIFxuICAgICAgY2FzZSAnRU5TRU1CTEUnOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdEYXR1bUVuc2VtYmxlJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgXG4gICAgICAgIC8vIEV4dHJhY3QgZW5zZW1ibGUgbWVtYmVyc1xuICAgICAgICByZXN1bHQubWVtYmVycyA9IG5vZGVcbiAgICAgICAgICAuZmlsdGVyKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdNRU1CRVInKVxuICAgICAgICAgIC5tYXAoKG1lbWJlcikgPT4gKHtcbiAgICAgICAgICAgIHR5cGU6ICdEYXR1bUVuc2VtYmxlTWVtYmVyJyxcbiAgICAgICAgICAgIG5hbWU6IG1lbWJlclsxXSxcbiAgICAgICAgICAgIGlkOiB0aGlzLmdldElkKG1lbWJlciksIC8vIEV4dHJhY3QgSUQgYXMgeyBhdXRob3JpdHksIGNvZGUgfVxuICAgICAgICAgIH0pKTtcbiAgICAgIFxuICAgICAgICAvLyBFeHRyYWN0IGFjY3VyYWN5XG4gICAgICAgIGNvbnN0IGFjY3VyYWN5Tm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnRU5TRU1CTEVBQ0NVUkFDWScpO1xuICAgICAgICBpZiAoYWNjdXJhY3lOb2RlKSB7XG4gICAgICAgICAgcmVzdWx0LmFjY3VyYWN5ID0gcGFyc2VGbG9hdChhY2N1cmFjeU5vZGVbMV0pO1xuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgLy8gRXh0cmFjdCBlbGxpcHNvaWRcbiAgICAgICAgY29uc3QgZWxsaXBzb2lkTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnRUxMSVBTT0lEJyk7XG4gICAgICAgIGlmIChlbGxpcHNvaWROb2RlKSB7XG4gICAgICAgICAgcmVzdWx0LmVsbGlwc29pZCA9IHRoaXMuY29udmVydChlbGxpcHNvaWROb2RlKTsgLy8gQ29udmVydCB0aGUgZWxsaXBzb2lkIG5vZGVcbiAgICAgICAgfVxuICAgICAgXG4gICAgICAgIC8vIEV4dHJhY3QgaWRlbnRpZmllciBmb3IgdGhlIGVuc2VtYmxlXG4gICAgICAgIHJlc3VsdC5pZCA9IHRoaXMuZ2V0SWQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdFTExJUFNPSUQnOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdFbGxpcHNvaWQnO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICAgIHJlc3VsdC5zZW1pX21ham9yX2F4aXMgPSBwYXJzZUZsb2F0KG5vZGVbMl0pO1xuICAgICAgICByZXN1bHQuaW52ZXJzZV9mbGF0dGVuaW5nID0gcGFyc2VGbG9hdChub2RlWzNdKTtcbiAgICAgICAgY29uc3QgdW5pdHMgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0xFTkdUSFVOSVQnKVxuICAgICAgICAgID8gdGhpcy5jb252ZXJ0KG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTEVOR1RIVU5JVCcpLCByZXN1bHQpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnQ09OVkVSU0lPTic6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ0NvbnZlcnNpb24nO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICAgIHJlc3VsdC5tZXRob2QgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ01FVEhPRCcpXG4gICAgICAgICAgPyB0aGlzLmNvbnZlcnQobm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdNRVRIT0QnKSlcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIHJlc3VsdC5wYXJhbWV0ZXJzID0gbm9kZVxuICAgICAgICAgIC5maWx0ZXIoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ1BBUkFNRVRFUicpXG4gICAgICAgICAgLm1hcCgocGFyYW0pID0+IHRoaXMuY29udmVydChwYXJhbSkpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnTUVUSE9EJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnTWV0aG9kJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgICByZXN1bHQuaWQgPSB0aGlzLmdldElkKG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnUEFSQU1FVEVSJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnUGFyYW1ldGVyJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgICByZXN1bHQudmFsdWUgPSBwYXJzZUZsb2F0KG5vZGVbMl0pO1xuICAgICAgICByZXN1bHQudW5pdCA9IHRoaXMuY29udmVydFVuaXQoXG4gICAgICAgICAgbm9kZS5maW5kKFxuICAgICAgICAgICAgKGNoaWxkKSA9PlxuICAgICAgICAgICAgICBBcnJheS5pc0FycmF5KGNoaWxkKSAmJlxuICAgICAgICAgICAgICAoY2hpbGRbMF0gPT09ICdMRU5HVEhVTklUJyB8fCBjaGlsZFswXSA9PT0gJ0FOR0xFVU5JVCcgfHwgY2hpbGRbMF0gPT09ICdTQ0FMRVVOSVQnKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgcmVzdWx0LmlkID0gdGhpcy5nZXRJZChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0JPVU5EQ1JTJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnQm91bmRDUlMnO1xuXG4gICAgICAgIC8vIFByb2Nlc3MgU09VUkNFQ1JTXG4gICAgICAgIGNvbnN0IHNvdXJjZUNyc05vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ1NPVVJDRUNSUycpO1xuICAgICAgICBpZiAoc291cmNlQ3JzTm9kZSkge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZUNyc0NvbnRlbnQgPSBzb3VyY2VDcnNOb2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSk7XG4gICAgICAgICAgcmVzdWx0LnNvdXJjZV9jcnMgPSBzb3VyY2VDcnNDb250ZW50ID8gdGhpcy5jb252ZXJ0KHNvdXJjZUNyc0NvbnRlbnQpIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByb2Nlc3MgVEFSR0VUQ1JTXG4gICAgICAgIGNvbnN0IHRhcmdldENyc05vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ1RBUkdFVENSUycpO1xuICAgICAgICBpZiAodGFyZ2V0Q3JzTm9kZSkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldENyc0NvbnRlbnQgPSB0YXJnZXRDcnNOb2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSk7XG4gICAgICAgICAgcmVzdWx0LnRhcmdldF9jcnMgPSB0YXJnZXRDcnNDb250ZW50ID8gdGhpcy5jb252ZXJ0KHRhcmdldENyc0NvbnRlbnQpIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByb2Nlc3MgQUJSSURHRURUUkFOU0ZPUk1BVElPTlxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1hdGlvbk5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0FCUklER0VEVFJBTlNGT1JNQVRJT04nKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybWF0aW9uTm9kZSkge1xuICAgICAgICAgIHJlc3VsdC50cmFuc2Zvcm1hdGlvbiA9IHRoaXMuY29udmVydCh0cmFuc2Zvcm1hdGlvbk5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC50cmFuc2Zvcm1hdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0FCUklER0VEVFJBTlNGT1JNQVRJT04nOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdUcmFuc2Zvcm1hdGlvbic7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgICAgcmVzdWx0Lm1ldGhvZCA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTUVUSE9EJylcbiAgICAgICAgICA/IHRoaXMuY29udmVydChub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ01FVEhPRCcpKVxuICAgICAgICAgIDogbnVsbDtcblxuICAgICAgICByZXN1bHQucGFyYW1ldGVycyA9IG5vZGVcbiAgICAgICAgICAuZmlsdGVyKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgKGNoaWxkWzBdID09PSAnUEFSQU1FVEVSJyB8fCBjaGlsZFswXSA9PT0gJ1BBUkFNRVRFUkZJTEUnKSlcbiAgICAgICAgICAubWFwKChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgaWYgKHBhcmFtWzBdID09PSAnUEFSQU1FVEVSJykge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0KHBhcmFtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1bMF0gPT09ICdQQVJBTUVURVJGSUxFJykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHBhcmFtWzFdLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwYXJhbVsyXSxcbiAgICAgICAgICAgICAgICBpZDoge1xuICAgICAgICAgICAgICAgICAgJ2F1dGhvcml0eSc6ICdFUFNHJyxcbiAgICAgICAgICAgICAgICAgICdjb2RlJzogODY1NlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGp1c3QgdGhlIFNjYWxlIGRpZmZlcmVuY2UgcGFyYW1ldGVyIGlmIHByZXNlbnRcbiAgICAgICAgaWYgKHJlc3VsdC5wYXJhbWV0ZXJzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAgIGNvbnN0IHNjYWxlRGlmZmVyZW5jZSA9IHJlc3VsdC5wYXJhbWV0ZXJzWzZdO1xuICAgICAgICAgIGlmIChzY2FsZURpZmZlcmVuY2UubmFtZSA9PT0gJ1NjYWxlIGRpZmZlcmVuY2UnKSB7XG4gICAgICAgICAgICBzY2FsZURpZmZlcmVuY2UudmFsdWUgPSBNYXRoLnJvdW5kKChzY2FsZURpZmZlcmVuY2UudmFsdWUgLSAxKSAqIDFlMTIpIC8gMWU2O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5pZCA9IHRoaXMuZ2V0SWQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgICBjYXNlICdBWElTJzpcbiAgICAgICAgaWYgKCFyZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0pIHtcbiAgICAgICAgICByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0gPSB7IHR5cGU6ICd1bnNwZWNpZmllZCcsIGF4aXM6IFtdIH07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtLmF4aXMucHVzaCh0aGlzLmNvbnZlcnRBeGlzKG5vZGUpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBcbiAgICAgIGNhc2UgJ0xFTkdUSFVOSVQnOlxuICAgICAgICBjb25zdCB1bml0ID0gdGhpcy5jb252ZXJ0VW5pdChub2RlLCAnTGluZWFyVW5pdCcpO1xuICAgICAgICBpZiAocmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtICYmIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbS5heGlzKSB7XG4gICAgICAgICAgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtLmF4aXMuZm9yRWFjaCgoYXhpcykgPT4ge1xuICAgICAgICAgICAgaWYgKCFheGlzLnVuaXQpIHtcbiAgICAgICAgICAgICAgYXhpcy51bml0ID0gdW5pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5pdC5jb252ZXJzaW9uX2ZhY3RvciAmJiB1bml0LmNvbnZlcnNpb25fZmFjdG9yICE9PSAxKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zZW1pX21ham9yX2F4aXMpIHtcbiAgICAgICAgICAgIHJlc3VsdC5zZW1pX21ham9yX2F4aXMgPSB7XG4gICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuc2VtaV9tYWpvcl9heGlzLFxuICAgICAgICAgICAgICB1bml0LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmVzdWx0LmtleXdvcmQgPSBub2RlWzBdO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBST0pKU09OQnVpbGRlckJhc2U7IiwiaW1wb3J0IFBST0pKU09OQnVpbGRlcjIwMTUgZnJvbSAnLi9QUk9KSlNPTkJ1aWxkZXIyMDE1LmpzJztcbmltcG9ydCBQUk9KSlNPTkJ1aWxkZXIyMDE5IGZyb20gJy4vUFJPSkpTT05CdWlsZGVyMjAxOS5qcyc7XG5cbi8qKlxuICogRGV0ZWN0cyB0aGUgV0tUMiB2ZXJzaW9uIGJhc2VkIG9uIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIFdLVC5cbiAqIEBwYXJhbSB7QXJyYXl9IHJvb3QgVGhlIHJvb3QgV0tUIGFycmF5IG5vZGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgdmVyc2lvbiAoXCIyMDE1XCIgb3IgXCIyMDE5XCIpLlxuICovXG5mdW5jdGlvbiBkZXRlY3RXS1QyVmVyc2lvbihyb290KSB7XG4gIC8vIENoZWNrIGZvciBXS1QyLTIwMTktc3BlY2lmaWMgbm9kZXNcbiAgaWYgKHJvb3QuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnVVNBR0UnKSkge1xuICAgIHJldHVybiAnMjAxOSc7IC8vIGBVU0FHRWAgaXMgc3BlY2lmaWMgdG8gV0tUMi0yMDE5XG4gIH1cblxuICAvLyBDaGVjayBmb3IgV0tUMi0yMDE1LXNwZWNpZmljIG5vZGVzXG4gIGlmIChyb290LmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0NTJykpIHtcbiAgICByZXR1cm4gJzIwMTUnOyAvLyBgQ1NgIGlzIHZhbGlkIGluIGJvdGgsIGJ1dCBkZWZhdWx0IHRvIDIwMTUgdW5sZXNzIGBVU0FHRWAgaXMgcHJlc2VudFxuICB9XG5cbiAgaWYgKHJvb3RbMF0gPT09ICdCT1VORENSUycgfHwgcm9vdFswXSA9PT0gJ1BST0pDUlMnIHx8IHJvb3RbMF0gPT09ICdHRU9HQ1JTJykge1xuICAgIHJldHVybiAnMjAxNSc7IC8vIFRoZXNlIGFyZSB2YWxpZCBpbiBib3RoLCBidXQgZGVmYXVsdCB0byAyMDE1XG4gIH1cblxuICAvLyBEZWZhdWx0IHRvIFdLVDItMjAxNSBpZiBubyBzcGVjaWZpYyBpbmRpY2F0b3JzIGFyZSBmb3VuZFxuICByZXR1cm4gJzIwMTUnO1xufVxuXG4vKipcbiAqIEJ1aWxkcyBhIFBST0pKU09OIG9iamVjdCBmcm9tIGEgV0tUIGFycmF5IHN0cnVjdHVyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IHJvb3QgVGhlIHJvb3QgV0tUIGFycmF5IG5vZGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgUFJPSkpTT04gb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRQUk9KSlNPTihyb290KSB7XG4gIGNvbnN0IHZlcnNpb24gPSBkZXRlY3RXS1QyVmVyc2lvbihyb290KTtcbiAgY29uc3QgYnVpbGRlciA9IHZlcnNpb24gPT09ICcyMDE5JyA/IFBST0pKU09OQnVpbGRlcjIwMTkgOiBQUk9KSlNPTkJ1aWxkZXIyMDE1O1xuICByZXR1cm4gYnVpbGRlci5jb252ZXJ0KHJvb3QpO1xufVxuIiwiLyoqXG4gKiBEZXRlY3RzIHdoZXRoZXIgdGhlIFdLVCBzdHJpbmcgaXMgV0tUMSBvciBXS1QyLlxuICogQHBhcmFtIHtzdHJpbmd9IHdrdCBUaGUgV0tUIHN0cmluZy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBkZXRlY3RlZCB2ZXJzaW9uIChcIldLVDFcIiBvciBcIldLVDJcIikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RXS1RWZXJzaW9uKHdrdCkge1xuICAvLyBOb3JtYWxpemUgdGhlIFdLVCBzdHJpbmcgZm9yIGVhc2llciBrZXl3b3JkIG1hdGNoaW5nXG4gIGNvbnN0IG5vcm1hbGl6ZWRXS1QgPSB3a3QudG9VcHBlckNhc2UoKTtcblxuICAvLyBDaGVjayBmb3IgV0tUMi1zcGVjaWZpYyBrZXl3b3Jkc1xuICBpZiAoXG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnUFJPSkNSUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnR0VPR0NSUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnQk9VTkRDUlMnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ1ZFUlRDUlMnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ0xFTkdUSFVOSVQnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ0FOR0xFVU5JVCcpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnU0NBTEVVTklUJylcbiAgKSB7XG4gICAgcmV0dXJuICdXS1QyJztcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBXS1QxLXNwZWNpZmljIGtleXdvcmRzXG4gIGlmIChcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdQUk9KQ1MnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ0dFT0dDUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnTE9DQUxfQ1MnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ1ZFUlRfQ1MnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ1VOSVQnKVxuICApIHtcbiAgICByZXR1cm4gJ1dLVDEnO1xuICB9XG5cbiAgLy8gRGVmYXVsdCB0byBXS1QxIGlmIG5vIHNwZWNpZmljIGluZGljYXRvcnMgYXJlIGZvdW5kXG4gIHJldHVybiAnV0tUMSc7XG59IiwiaW1wb3J0IHsgYnVpbGRQUk9KSlNPTiB9IGZyb20gJy4vYnVpbGRQUk9KSlNPTi5qcyc7XG5pbXBvcnQgeyBkZXRlY3RXS1RWZXJzaW9uIH0gZnJvbSAnLi9kZXRlY3RXS1RWZXJzaW9uLmpzJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9wYXJzZXIuanMnO1xuaW1wb3J0IHtzRXhwcn0gZnJvbSAnLi9wcm9jZXNzLmpzJztcbmltcG9ydCB7IHRyYW5zZm9ybVBST0pKU09OIH0gZnJvbSAnLi90cmFuc2Zvcm1QUk9KSlNPTi5qcyc7XG5pbXBvcnQgeyBhcHBseVByb2plY3Rpb25EZWZhdWx0cywgZDJyIH0gZnJvbSAnLi91dGlsLmpzJztcblxudmFyIGtub3duVHlwZXMgPSBbJ1BST0pFQ1RFRENSUycsICdQUk9KQ1JTJywgJ0dFT0dDUycsICdHRU9DQ1MnLCAnUFJPSkNTJywgJ0xPQ0FMX0NTJywgJ0dFT0RDUlMnLFxuICAnR0VPREVUSUNDUlMnLCAnR0VPREVUSUNEQVRVTScsICdFTkdDUlMnLCAnRU5HSU5FRVJJTkdDUlMnXTtcblxuZnVuY3Rpb24gcmVuYW1lKG9iaiwgcGFyYW1zKSB7XG4gIHZhciBvdXROYW1lID0gcGFyYW1zWzBdO1xuICB2YXIgaW5OYW1lID0gcGFyYW1zWzFdO1xuICBpZiAoIShvdXROYW1lIGluIG9iaikgJiYgKGluTmFtZSBpbiBvYmopKSB7XG4gICAgb2JqW291dE5hbWVdID0gb2JqW2luTmFtZV07XG4gICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDMpIHtcbiAgICAgIG9ialtvdXROYW1lXSA9IHBhcmFtc1syXShvYmpbb3V0TmFtZV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhbldLVCh3a3QpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh3a3QpO1xuICBmb3IgKHZhciBpID0gMCwgaWkgPSBrZXlzLmxlbmd0aDsgaSA8aWk7ICsraSkge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIC8vIHRoZSBmb2xsb3dpbmdzIGFyZSB0aGUgY3JzIGRlZmluZWQgaW5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcHJvajRqcy9wcm9qNGpzL2Jsb2IvMWRhNGVkMGI4NjVkMGZjYjUxYzEzNjA5MDU2OTIxMGNkY2M5MDE5ZS9saWIvcGFyc2VDb2RlLmpzI0wxMVxuICAgIGlmIChrbm93blR5cGVzLmluZGV4T2Yoa2V5KSAhPT0gLTEpIHtcbiAgICAgIHNldFByb3BlcnRpZXNGcm9tV2t0KHdrdFtrZXldKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3a3Rba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNsZWFuV0tUKHdrdFtrZXldKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydGllc0Zyb21Xa3Qod2t0KSB7XG4gIGlmICh3a3QuQVVUSE9SSVRZKSB7XG4gICAgdmFyIGF1dGhvcml0eSA9IE9iamVjdC5rZXlzKHdrdC5BVVRIT1JJVFkpWzBdO1xuICAgIGlmIChhdXRob3JpdHkgJiYgYXV0aG9yaXR5IGluIHdrdC5BVVRIT1JJVFkpIHtcbiAgICAgIHdrdC50aXRsZSA9IGF1dGhvcml0eSArICc6JyArIHdrdC5BVVRIT1JJVFlbYXV0aG9yaXR5XTtcbiAgICB9XG4gIH1cbiAgaWYgKHdrdC50eXBlID09PSAnR0VPR0NTJykge1xuICAgIHdrdC5wcm9qTmFtZSA9ICdsb25nbGF0JztcbiAgfSBlbHNlIGlmICh3a3QudHlwZSA9PT0gJ0xPQ0FMX0NTJykge1xuICAgIHdrdC5wcm9qTmFtZSA9ICdpZGVudGl0eSc7XG4gICAgd2t0LmxvY2FsID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIHdrdC5QUk9KRUNUSU9OID09PSAnb2JqZWN0Jykge1xuICAgICAgd2t0LnByb2pOYW1lID0gT2JqZWN0LmtleXMod2t0LlBST0pFQ1RJT04pWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICB3a3QucHJvak5hbWUgPSB3a3QuUFJPSkVDVElPTjtcbiAgICB9XG4gIH1cbiAgaWYgKHdrdC5BWElTKSB7XG4gICAgdmFyIGF4aXNPcmRlciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHdrdC5BWElTLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgIHZhciBheGlzID0gW3drdC5BWElTW2ldWzBdLnRvTG93ZXJDYXNlKCksIHdrdC5BWElTW2ldWzFdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgaWYgKGF4aXNbMF0uaW5kZXhPZignbm9ydGgnKSAhPT0gLTEgfHwgKChheGlzWzBdID09PSAneScgfHwgYXhpc1swXSA9PT0gJ2xhdCcpICYmIGF4aXNbMV0gPT09ICdub3J0aCcpKSB7XG4gICAgICAgIGF4aXNPcmRlciArPSAnbic7XG4gICAgICB9IGVsc2UgaWYgKGF4aXNbMF0uaW5kZXhPZignc291dGgnKSAhPT0gLTEgfHwgKChheGlzWzBdID09PSAneScgfHwgYXhpc1swXSA9PT0gJ2xhdCcpICYmIGF4aXNbMV0gPT09ICdzb3V0aCcpKSB7XG4gICAgICAgIGF4aXNPcmRlciArPSAncyc7XG4gICAgICB9IGVsc2UgaWYgKGF4aXNbMF0uaW5kZXhPZignZWFzdCcpICE9PSAtMSB8fCAoKGF4aXNbMF0gPT09ICd4JyB8fCBheGlzWzBdID09PSAnbG9uJykgJiYgYXhpc1sxXSA9PT0gJ2Vhc3QnKSkge1xuICAgICAgICBheGlzT3JkZXIgKz0gJ2UnO1xuICAgICAgfSBlbHNlIGlmIChheGlzWzBdLmluZGV4T2YoJ3dlc3QnKSAhPT0gLTEgfHwgKChheGlzWzBdID09PSAneCcgfHwgYXhpc1swXSA9PT0gJ2xvbicpICYmIGF4aXNbMV0gPT09ICd3ZXN0JykpIHtcbiAgICAgICAgYXhpc09yZGVyICs9ICd3JztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF4aXNPcmRlci5sZW5ndGggPT09IDIpIHtcbiAgICAgIGF4aXNPcmRlciArPSAndSc7XG4gICAgfVxuICAgIGlmIChheGlzT3JkZXIubGVuZ3RoID09PSAzKSB7XG4gICAgICB3a3QuYXhpcyA9IGF4aXNPcmRlcjtcbiAgICB9XG4gIH1cbiAgaWYgKHdrdC5VTklUKSB7XG4gICAgd2t0LnVuaXRzID0gd2t0LlVOSVQubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICh3a3QudW5pdHMgPT09ICdtZXRyZScpIHtcbiAgICAgIHdrdC51bml0cyA9ICdtZXRlcic7XG4gICAgfVxuICAgIGlmICh3a3QuVU5JVC5jb252ZXJ0KSB7XG4gICAgICBpZiAod2t0LnR5cGUgPT09ICdHRU9HQ1MnKSB7XG4gICAgICAgIGlmICh3a3QuREFUVU0gJiYgd2t0LkRBVFVNLlNQSEVST0lEKSB7XG4gICAgICAgICAgd2t0LnRvX21ldGVyID0gd2t0LlVOSVQuY29udmVydCp3a3QuREFUVU0uU1BIRVJPSUQuYTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2t0LnRvX21ldGVyID0gd2t0LlVOSVQuY29udmVydDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdmFyIGdlb2djcyA9IHdrdC5HRU9HQ1M7XG4gIGlmICh3a3QudHlwZSA9PT0gJ0dFT0dDUycpIHtcbiAgICBnZW9nY3MgPSB3a3Q7XG4gIH1cbiAgaWYgKGdlb2djcykge1xuICAgIC8vaWYod2t0LkdFT0dDUy5QUklNRU0mJndrdC5HRU9HQ1MuUFJJTUVNLmNvbnZlcnQpe1xuICAgIC8vICB3a3QuZnJvbV9ncmVlbndpY2g9d2t0LkdFT0dDUy5QUklNRU0uY29udmVydCpEMlI7XG4gICAgLy99XG4gICAgaWYgKGdlb2djcy5EQVRVTSkge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9IGdlb2djcy5EQVRVTS5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSBnZW9nY3MubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZS5zbGljZSgwLCAyKSA9PT0gJ2RfJykge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9IHdrdC5kYXR1bUNvZGUuc2xpY2UoMik7XG4gICAgfVxuICAgIGlmICh3a3QuZGF0dW1Db2RlID09PSAnbmV3X3plYWxhbmRfMTk0OScpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnbnpnZDQ5JztcbiAgICB9XG4gICAgaWYgKHdrdC5kYXR1bUNvZGUgPT09ICd3Z3NfMTk4NCcgfHwgd2t0LmRhdHVtQ29kZSA9PT0gJ3dvcmxkX2dlb2RldGljX3N5c3RlbV8xOTg0Jykge1xuICAgICAgaWYgKHdrdC5QUk9KRUNUSU9OID09PSAnTWVyY2F0b3JfQXV4aWxpYXJ5X1NwaGVyZScpIHtcbiAgICAgICAgd2t0LnNwaGVyZSA9IHRydWU7XG4gICAgICB9XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ3dnczg0JztcbiAgICB9XG4gICAgaWYgKHdrdC5kYXR1bUNvZGUgPT09ICdiZWxnZV8xOTcyJykge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdybmI3Mic7XG4gICAgfVxuICAgIGlmIChnZW9nY3MuREFUVU0gJiYgZ2VvZ2NzLkRBVFVNLlNQSEVST0lEKSB7XG4gICAgICB3a3QuZWxscHMgPSBnZW9nY3MuREFUVU0uU1BIRVJPSUQubmFtZS5yZXBsYWNlKCdfMTknLCAnJykucmVwbGFjZSgvW0NjXWxhcmtlXFxfMTgvLCAnY2xyaycpO1xuICAgICAgaWYgKHdrdC5lbGxwcy50b0xvd2VyQ2FzZSgpLnNsaWNlKDAsIDEzKSA9PT0gJ2ludGVybmF0aW9uYWwnKSB7XG4gICAgICAgIHdrdC5lbGxwcyA9ICdpbnRsJztcbiAgICAgIH1cblxuICAgICAgd2t0LmEgPSBnZW9nY3MuREFUVU0uU1BIRVJPSUQuYTtcbiAgICAgIHdrdC5yZiA9IHBhcnNlRmxvYXQoZ2VvZ2NzLkRBVFVNLlNQSEVST0lELnJmLCAxMCk7XG4gICAgfVxuXG4gICAgaWYgKGdlb2djcy5EQVRVTSAmJiBnZW9nY3MuREFUVU0uVE9XR1M4NCkge1xuICAgICAgd2t0LmRhdHVtX3BhcmFtcyA9IGdlb2djcy5EQVRVTS5UT1dHUzg0O1xuICAgIH1cbiAgICBpZiAofndrdC5kYXR1bUNvZGUuaW5kZXhPZignb3NnYl8xOTM2JykpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnb3NnYjM2JztcbiAgICB9XG4gICAgaWYgKH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ29zbmlfMTk1MicpKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ29zbmk1Mic7XG4gICAgfVxuICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCd0bTY1JylcbiAgICAgIHx8IH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ2dlb2RldGljX2RhdHVtX29mXzE5NjUnKSkge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdpcmU2NSc7XG4gICAgfVxuICAgIGlmICh3a3QuZGF0dW1Db2RlID09PSAnY2gxOTAzKycpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnY2gxOTAzJztcbiAgICB9XG4gICAgaWYgKH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ2lzcmFlbCcpKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ2lzcjkzJztcbiAgICB9XG4gIH1cbiAgaWYgKHdrdC5iICYmICFpc0Zpbml0ZSh3a3QuYikpIHtcbiAgICB3a3QuYiA9IHdrdC5hO1xuICB9XG4gIGlmICh3a3QucmVjdGlmaWVkX2dyaWRfYW5nbGUpIHtcbiAgICB3a3QucmVjdGlmaWVkX2dyaWRfYW5nbGUgPSBkMnIod2t0LnJlY3RpZmllZF9ncmlkX2FuZ2xlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvTWV0ZXIoaW5wdXQpIHtcbiAgICB2YXIgcmF0aW8gPSB3a3QudG9fbWV0ZXIgfHwgMTtcbiAgICByZXR1cm4gaW5wdXQgKiByYXRpbztcbiAgfVxuICB2YXIgcmVuYW1lciA9IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gcmVuYW1lKHdrdCwgYSk7XG4gIH07XG4gIHZhciBsaXN0ID0gW1xuICAgIFsnc3RhbmRhcmRfcGFyYWxsZWxfMScsICdTdGFuZGFyZF9QYXJhbGxlbF8xJ10sXG4gICAgWydzdGFuZGFyZF9wYXJhbGxlbF8xJywgJ0xhdGl0dWRlIG9mIDFzdCBzdGFuZGFyZCBwYXJhbGxlbCddLFxuICAgIFsnc3RhbmRhcmRfcGFyYWxsZWxfMicsICdTdGFuZGFyZF9QYXJhbGxlbF8yJ10sXG4gICAgWydzdGFuZGFyZF9wYXJhbGxlbF8yJywgJ0xhdGl0dWRlIG9mIDJuZCBzdGFuZGFyZCBwYXJhbGxlbCddLFxuICAgIFsnZmFsc2VfZWFzdGluZycsICdGYWxzZV9FYXN0aW5nJ10sXG4gICAgWydmYWxzZV9lYXN0aW5nJywgJ0ZhbHNlIGVhc3RpbmcnXSxcbiAgICBbJ2ZhbHNlLWVhc3RpbmcnLCAnRWFzdGluZyBhdCBmYWxzZSBvcmlnaW4nXSxcbiAgICBbJ2ZhbHNlX25vcnRoaW5nJywgJ0ZhbHNlX05vcnRoaW5nJ10sXG4gICAgWydmYWxzZV9ub3J0aGluZycsICdGYWxzZSBub3J0aGluZyddLFxuICAgIFsnZmFsc2Vfbm9ydGhpbmcnLCAnTm9ydGhpbmcgYXQgZmFsc2Ugb3JpZ2luJ10sXG4gICAgWydjZW50cmFsX21lcmlkaWFuJywgJ0NlbnRyYWxfTWVyaWRpYW4nXSxcbiAgICBbJ2NlbnRyYWxfbWVyaWRpYW4nLCAnTG9uZ2l0dWRlIG9mIG5hdHVyYWwgb3JpZ2luJ10sXG4gICAgWydjZW50cmFsX21lcmlkaWFuJywgJ0xvbmdpdHVkZSBvZiBmYWxzZSBvcmlnaW4nXSxcbiAgICBbJ2xhdGl0dWRlX29mX29yaWdpbicsICdMYXRpdHVkZV9PZl9PcmlnaW4nXSxcbiAgICBbJ2xhdGl0dWRlX29mX29yaWdpbicsICdDZW50cmFsX1BhcmFsbGVsJ10sXG4gICAgWydsYXRpdHVkZV9vZl9vcmlnaW4nLCAnTGF0aXR1ZGUgb2YgbmF0dXJhbCBvcmlnaW4nXSxcbiAgICBbJ2xhdGl0dWRlX29mX29yaWdpbicsICdMYXRpdHVkZSBvZiBmYWxzZSBvcmlnaW4nXSxcbiAgICBbJ3NjYWxlX2ZhY3RvcicsICdTY2FsZV9GYWN0b3InXSxcbiAgICBbJ2swJywgJ3NjYWxlX2ZhY3RvciddLFxuICAgIFsnbGF0aXR1ZGVfb2ZfY2VudGVyJywgJ0xhdGl0dWRlX09mX0NlbnRlciddLFxuICAgIFsnbGF0aXR1ZGVfb2ZfY2VudGVyJywgJ0xhdGl0dWRlX29mX2NlbnRlciddLFxuICAgIFsnbGF0MCcsICdsYXRpdHVkZV9vZl9jZW50ZXInLCBkMnJdLFxuICAgIFsnbG9uZ2l0dWRlX29mX2NlbnRlcicsICdMb25naXR1ZGVfT2ZfQ2VudGVyJ10sXG4gICAgWydsb25naXR1ZGVfb2ZfY2VudGVyJywgJ0xvbmdpdHVkZV9vZl9jZW50ZXInXSxcbiAgICBbJ2xvbmdjJywgJ2xvbmdpdHVkZV9vZl9jZW50ZXInLCBkMnJdLFxuICAgIFsneDAnLCAnZmFsc2VfZWFzdGluZycsIHRvTWV0ZXJdLFxuICAgIFsneTAnLCAnZmFsc2Vfbm9ydGhpbmcnLCB0b01ldGVyXSxcbiAgICBbJ2xvbmcwJywgJ2NlbnRyYWxfbWVyaWRpYW4nLCBkMnJdLFxuICAgIFsnbGF0MCcsICdsYXRpdHVkZV9vZl9vcmlnaW4nLCBkMnJdLFxuICAgIFsnbGF0MCcsICdzdGFuZGFyZF9wYXJhbGxlbF8xJywgZDJyXSxcbiAgICBbJ2xhdDEnLCAnc3RhbmRhcmRfcGFyYWxsZWxfMScsIGQycl0sXG4gICAgWydsYXQyJywgJ3N0YW5kYXJkX3BhcmFsbGVsXzInLCBkMnJdLFxuICAgIFsnYXppbXV0aCcsICdBemltdXRoJ10sXG4gICAgWydhbHBoYScsICdhemltdXRoJywgZDJyXSxcbiAgICBbJ3Nyc0NvZGUnLCAnbmFtZSddXG4gIF07XG4gIGxpc3QuZm9yRWFjaChyZW5hbWVyKTtcbiAgYXBwbHlQcm9qZWN0aW9uRGVmYXVsdHMod2t0KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHdrdCkge1xuICBpZiAodHlwZW9mIHdrdCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gdHJhbnNmb3JtUFJPSkpTT04od2t0KTtcbiAgfVxuICBjb25zdCB2ZXJzaW9uID0gZGV0ZWN0V0tUVmVyc2lvbih3a3QpO1xuICB2YXIgbGlzcCA9IHBhcnNlcih3a3QpO1xuICBpZiAodmVyc2lvbiA9PT0gJ1dLVDInKSB7XG4gICAgY29uc3QgcHJvampzb24gPSBidWlsZFBST0pKU09OKGxpc3ApO1xuICAgIHJldHVybiB0cmFuc2Zvcm1QUk9KSlNPTihwcm9qanNvbik7XG4gIH1cbiAgdmFyIHR5cGUgPSBsaXNwWzBdO1xuICB2YXIgb2JqID0ge307XG4gIHNFeHByKGxpc3AsIG9iaik7XG4gIGNsZWFuV0tUKG9iaik7XG4gIHJldHVybiBvYmpbdHlwZV07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBwYXJzZVN0cmluZztcblxudmFyIE5FVVRSQUwgPSAxO1xudmFyIEtFWVdPUkQgPSAyO1xudmFyIE5VTUJFUiA9IDM7XG52YXIgUVVPVEVEID0gNDtcbnZhciBBRlRFUlFVT1RFID0gNTtcbnZhciBFTkRFRCA9IC0xO1xudmFyIHdoaXRlc3BhY2UgPSAvXFxzLztcbnZhciBsYXRpbiA9IC9bQS1aYS16XS87XG52YXIga2V5d29yZCA9IC9bQS1aYS16ODRfXS87XG52YXIgZW5kVGhpbmdzID0gL1ssXFxdXS87XG52YXIgZGlnZXRzID0gL1tcXGRcXC5FXFwtXFwrXS87XG4vLyBjb25zdCBpZ25vcmVkQ2hhciA9IC9bXFxzX1xcLVxcL1xcKFxcKV0vZztcbmZ1bmN0aW9uIFBhcnNlcih0ZXh0KSB7XG4gIGlmICh0eXBlb2YgdGV4dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBhIHN0cmluZycpO1xuICB9XG4gIHRoaXMudGV4dCA9IHRleHQudHJpbSgpO1xuICB0aGlzLmxldmVsID0gMDtcbiAgdGhpcy5wbGFjZSA9IDA7XG4gIHRoaXMucm9vdCA9IG51bGw7XG4gIHRoaXMuc3RhY2sgPSBbXTtcbiAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbnVsbDtcbiAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG59XG5QYXJzZXIucHJvdG90eXBlLnJlYWRDaGFyaWN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNoYXIgPSB0aGlzLnRleHRbdGhpcy5wbGFjZSsrXTtcbiAgaWYgKHRoaXMuc3RhdGUgIT09IFFVT1RFRCkge1xuICAgIHdoaWxlICh3aGl0ZXNwYWNlLnRlc3QoY2hhcikpIHtcbiAgICAgIGlmICh0aGlzLnBsYWNlID49IHRoaXMudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2hhciA9IHRoaXMudGV4dFt0aGlzLnBsYWNlKytdO1xuICAgIH1cbiAgfVxuICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICBjYXNlIE5FVVRSQUw6XG4gICAgICByZXR1cm4gdGhpcy5uZXV0cmFsKGNoYXIpO1xuICAgIGNhc2UgS0VZV09SRDpcbiAgICAgIHJldHVybiB0aGlzLmtleXdvcmQoY2hhcilcbiAgICBjYXNlIFFVT1RFRDpcbiAgICAgIHJldHVybiB0aGlzLnF1b3RlZChjaGFyKTtcbiAgICBjYXNlIEFGVEVSUVVPVEU6XG4gICAgICByZXR1cm4gdGhpcy5hZnRlcnF1b3RlKGNoYXIpO1xuICAgIGNhc2UgTlVNQkVSOlxuICAgICAgcmV0dXJuIHRoaXMubnVtYmVyKGNoYXIpO1xuICAgIGNhc2UgRU5ERUQ6XG4gICAgICByZXR1cm47XG4gIH1cbn07XG5QYXJzZXIucHJvdG90eXBlLmFmdGVycXVvdGUgPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChjaGFyID09PSAnXCInKSB7XG4gICAgdGhpcy53b3JkICs9ICdcIic7XG4gICAgdGhpcy5zdGF0ZSA9IFFVT1RFRDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkID0gdGhpcy53b3JkLnRyaW0oKTtcbiAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBhZnRlcnF1b3RlIHlldCwgaW5kZXggJyArIHRoaXMucGxhY2UpO1xufTtcblBhcnNlci5wcm90b3R5cGUuYWZ0ZXJJdGVtID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAoY2hhciA9PT0gJywnKSB7XG4gICAgaWYgKHRoaXMud29yZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LnB1c2godGhpcy53b3JkKTtcbiAgICB9XG4gICAgdGhpcy53b3JkID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gTkVVVFJBTDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNoYXIgPT09ICddJykge1xuICAgIHRoaXMubGV2ZWwtLTtcbiAgICBpZiAodGhpcy53b3JkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmN1cnJlbnRPYmplY3QucHVzaCh0aGlzLndvcmQpO1xuICAgICAgdGhpcy53b3JkID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG4gICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gdGhpcy5zdGFjay5wb3AoKTtcbiAgICBpZiAoIXRoaXMuY3VycmVudE9iamVjdCkge1xuICAgICAgdGhpcy5zdGF0ZSA9IEVOREVEO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxufTtcblBhcnNlci5wcm90b3R5cGUubnVtYmVyID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAoZGlnZXRzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgKz0gY2hhcjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkID0gcGFyc2VGbG9hdCh0aGlzLndvcmQpO1xuICAgIHRoaXMuYWZ0ZXJJdGVtKGNoYXIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2hhdm5cXCd0IGhhbmRsZWQgXCInICtjaGFyICsgJ1wiIGluIG51bWJlciB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcbn07XG5QYXJzZXIucHJvdG90eXBlLnF1b3RlZCA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGNoYXIgPT09ICdcIicpIHtcbiAgICB0aGlzLnN0YXRlID0gQUZURVJRVU9URTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy53b3JkICs9IGNoYXI7XG4gIHJldHVybjtcbn07XG5QYXJzZXIucHJvdG90eXBlLmtleXdvcmQgPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChrZXl3b3JkLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgKz0gY2hhcjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNoYXIgPT09ICdbJykge1xuICAgIHZhciBuZXdPYmplY3RzID0gW107XG4gICAgbmV3T2JqZWN0cy5wdXNoKHRoaXMud29yZCk7XG4gICAgdGhpcy5sZXZlbCsrO1xuICAgIGlmICh0aGlzLnJvb3QgPT09IG51bGwpIHtcbiAgICAgIHRoaXMucm9vdCA9IG5ld09iamVjdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudE9iamVjdC5wdXNoKG5ld09iamVjdHMpO1xuICAgIH1cbiAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5jdXJyZW50T2JqZWN0KTtcbiAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXdPYmplY3RzO1xuICAgIHRoaXMuc3RhdGUgPSBORVVUUkFMO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZW5kVGhpbmdzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBrZXl3b3JkIHlldCwgaW5kZXggJyArIHRoaXMucGxhY2UpO1xufTtcblBhcnNlci5wcm90b3R5cGUubmV1dHJhbCA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGxhdGluLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgPSBjaGFyO1xuICAgIHRoaXMuc3RhdGUgPSBLRVlXT1JEO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY2hhciA9PT0gJ1wiJykge1xuICAgIHRoaXMud29yZCA9ICcnO1xuICAgIHRoaXMuc3RhdGUgPSBRVU9URUQ7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChkaWdldHMudGVzdChjaGFyKSkge1xuICAgIHRoaXMud29yZCA9IGNoYXI7XG4gICAgdGhpcy5zdGF0ZSA9IE5VTUJFUjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy5hZnRlckl0ZW0oY2hhcik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignaGF2blxcJ3QgaGFuZGxlZCBcIicgK2NoYXIgKyAnXCIgaW4gbmV1dHJhbCB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcbn07XG5QYXJzZXIucHJvdG90eXBlLm91dHB1dCA9IGZ1bmN0aW9uKCkge1xuICB3aGlsZSAodGhpcy5wbGFjZSA8IHRoaXMudGV4dC5sZW5ndGgpIHtcbiAgICB0aGlzLnJlYWRDaGFyaWN0ZXIoKTtcbiAgfVxuICBpZiAodGhpcy5zdGF0ZSA9PT0gRU5ERUQpIHtcbiAgICByZXR1cm4gdGhpcy5yb290O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIHBhcnNlIHN0cmluZyBcIicgK3RoaXMudGV4dCArICdcIi4gU3RhdGUgaXMgJyArIHRoaXMuc3RhdGUpO1xufTtcblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcodHh0KSB7XG4gIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKHR4dCk7XG4gIHJldHVybiBwYXJzZXIub3V0cHV0KCk7XG59XG4iLCJcblxuZnVuY3Rpb24gbWFwaXQob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICB2YWx1ZS51bnNoaWZ0KGtleSk7XG4gICAga2V5ID0gbnVsbDtcbiAgfVxuICB2YXIgdGhpbmcgPSBrZXkgPyB7fSA6IG9iajtcblxuICB2YXIgb3V0ID0gdmFsdWUucmVkdWNlKGZ1bmN0aW9uKG5ld09iaiwgaXRlbSkge1xuICAgIHNFeHByKGl0ZW0sIG5ld09iaik7XG4gICAgcmV0dXJuIG5ld09ialxuICB9LCB0aGluZyk7XG4gIGlmIChrZXkpIHtcbiAgICBvYmpba2V5XSA9IG91dDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc0V4cHIodiwgb2JqKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh2KSkge1xuICAgIG9ialt2XSA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXkgPSB2LnNoaWZ0KCk7XG4gIGlmIChrZXkgPT09ICdQQVJBTUVURVInKSB7XG4gICAga2V5ID0gdi5zaGlmdCgpO1xuICB9XG4gIGlmICh2Lmxlbmd0aCA9PT0gMSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZbMF0pKSB7XG4gICAgICBvYmpba2V5XSA9IHt9O1xuICAgICAgc0V4cHIodlswXSwgb2JqW2tleV0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvYmpba2V5XSA9IHZbMF07XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghdi5sZW5ndGgpIHtcbiAgICBvYmpba2V5XSA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChrZXkgPT09ICdUT1dHUzg0Jykge1xuICAgIG9ialtrZXldID0gdjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGtleSA9PT0gJ0FYSVMnKSB7XG4gICAgaWYgKCEoa2V5IGluIG9iaikpIHtcbiAgICAgIG9ialtrZXldID0gW107XG4gICAgfVxuICAgIG9ialtrZXldLnB1c2godik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgb2JqW2tleV0gPSB7fTtcbiAgfVxuXG4gIHZhciBpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgJ1VOSVQnOlxuICAgIGNhc2UgJ1BSSU1FTSc6XG4gICAgY2FzZSAnVkVSVF9EQVRVTSc6XG4gICAgICBvYmpba2V5XSA9IHtcbiAgICAgICAgbmFtZTogdlswXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBjb252ZXJ0OiB2WzFdXG4gICAgICB9O1xuICAgICAgaWYgKHYubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHNFeHByKHZbMl0sIG9ialtrZXldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdTUEhFUk9JRCc6XG4gICAgY2FzZSAnRUxMSVBTT0lEJzpcbiAgICAgIG9ialtrZXldID0ge1xuICAgICAgICBuYW1lOiB2WzBdLFxuICAgICAgICBhOiB2WzFdLFxuICAgICAgICByZjogdlsyXVxuICAgICAgfTtcbiAgICAgIGlmICh2Lmxlbmd0aCA9PT0gNCkge1xuICAgICAgICBzRXhwcih2WzNdLCBvYmpba2V5XSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgY2FzZSAnRURBVFVNJzpcbiAgICBjYXNlICdFTkdJTkVFUklOR0RBVFVNJzpcbiAgICBjYXNlICdMT0NBTF9EQVRVTSc6XG4gICAgY2FzZSAnREFUVU0nOlxuICAgIGNhc2UgJ1ZFUlRfQ1MnOlxuICAgIGNhc2UgJ1ZFUlRDUlMnOlxuICAgIGNhc2UgJ1ZFUlRJQ0FMQ1JTJzpcbiAgICAgIHZbMF0gPSBbJ25hbWUnLCB2WzBdXTtcbiAgICAgIG1hcGl0KG9iaiwga2V5LCB2KTtcbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdDT01QRF9DUyc6XG4gICAgY2FzZSAnQ09NUE9VTkRDUlMnOlxuICAgIGNhc2UgJ0ZJVFRFRF9DUyc6XG4gICAgLy8gdGhlIGZvbGxvd2luZ3MgYXJlIHRoZSBjcnMgZGVmaW5lZCBpblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9qNGpzL3Byb2o0anMvYmxvYi8xZGE0ZWQwYjg2NWQwZmNiNTFjMTM2MDkwNTY5MjEwY2RjYzkwMTllL2xpYi9wYXJzZUNvZGUuanMjTDExXG4gICAgY2FzZSAnUFJPSkVDVEVEQ1JTJzpcbiAgICBjYXNlICdQUk9KQ1JTJzpcbiAgICBjYXNlICdHRU9HQ1MnOlxuICAgIGNhc2UgJ0dFT0NDUyc6XG4gICAgY2FzZSAnUFJPSkNTJzpcbiAgICBjYXNlICdMT0NBTF9DUyc6XG4gICAgY2FzZSAnR0VPRENSUyc6XG4gICAgY2FzZSAnR0VPREVUSUNDUlMnOlxuICAgIGNhc2UgJ0dFT0RFVElDREFUVU0nOlxuICAgIGNhc2UgJ0VOR0NSUyc6XG4gICAgY2FzZSAnRU5HSU5FRVJJTkdDUlMnOlxuICAgICAgdlswXSA9IFsnbmFtZScsIHZbMF1dO1xuICAgICAgbWFwaXQob2JqLCBrZXksIHYpO1xuICAgICAgb2JqW2tleV0udHlwZSA9IGtleTtcbiAgICAgIHJldHVybjtcbiAgICBkZWZhdWx0OlxuICAgICAgaSA9IC0xO1xuICAgICAgd2hpbGUgKCsraSA8IHYubGVuZ3RoKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2W2ldKSkge1xuICAgICAgICAgIHJldHVybiBzRXhwcih2LCBvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBpdChvYmosIGtleSwgdik7XG4gIH1cbn1cbiIsImltcG9ydCB7IGFwcGx5UHJvamVjdGlvbkRlZmF1bHRzIH0gZnJvbSAnLi91dGlsLmpzJztcblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHByb2Nlc3MgdW5pdHMgYW5kIHRvX21ldGVyXG5mdW5jdGlvbiBwcm9jZXNzVW5pdCh1bml0KSB7XG4gIGxldCByZXN1bHQgPSB7IHVuaXRzOiBudWxsLCB0b19tZXRlcjogdW5kZWZpbmVkIH07XG5cbiAgaWYgKHR5cGVvZiB1bml0ID09PSAnc3RyaW5nJykge1xuICAgIHJlc3VsdC51bml0cyA9IHVuaXQudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAocmVzdWx0LnVuaXRzID09PSAnbWV0cmUnKSB7XG4gICAgICByZXN1bHQudW5pdHMgPSAnbWV0ZXInOyAvLyBOb3JtYWxpemUgJ21ldHJlJyB0byAnbWV0ZXInXG4gICAgfVxuICAgIGlmIChyZXN1bHQudW5pdHMgPT09ICdtZXRlcicpIHtcbiAgICAgIHJlc3VsdC50b19tZXRlciA9IDE7IC8vIE9ubHkgc2V0IHRvX21ldGVyIGlmIHVuaXRzIGFyZSAnbWV0ZXInXG4gICAgfVxuICB9IGVsc2UgaWYgKHVuaXQgJiYgdW5pdC5uYW1lKSB7XG4gICAgcmVzdWx0LnVuaXRzID0gdW5pdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHJlc3VsdC51bml0cyA9PT0gJ21ldHJlJykge1xuICAgICAgcmVzdWx0LnVuaXRzID0gJ21ldGVyJzsgLy8gTm9ybWFsaXplICdtZXRyZScgdG8gJ21ldGVyJ1xuICAgIH1cbiAgICByZXN1bHQudG9fbWV0ZXIgPSB1bml0LmNvbnZlcnNpb25fZmFjdG9yO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdG9WYWx1ZSh2YWx1ZU9yT2JqZWN0KSB7XG4gIGlmICh0eXBlb2YgdmFsdWVPck9iamVjdCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gdmFsdWVPck9iamVjdC52YWx1ZSAqIHZhbHVlT3JPYmplY3QudW5pdC5jb252ZXJzaW9uX2ZhY3RvcjtcbiAgfVxuICByZXR1cm4gdmFsdWVPck9iamVjdDtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRWxsaXBzb2lkKHZhbHVlLCByZXN1bHQpIHtcbiAgaWYgKHZhbHVlLmVsbGlwc29pZC5yYWRpdXMpIHtcbiAgICByZXN1bHQuYSA9IHZhbHVlLmVsbGlwc29pZC5yYWRpdXM7XG4gICAgcmVzdWx0LnJmID0gMDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQuYSA9IHRvVmFsdWUodmFsdWUuZWxsaXBzb2lkLnNlbWlfbWFqb3JfYXhpcyk7XG4gICAgaWYgKHZhbHVlLmVsbGlwc29pZC5pbnZlcnNlX2ZsYXR0ZW5pbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0LnJmID0gdmFsdWUuZWxsaXBzb2lkLmludmVyc2VfZmxhdHRlbmluZztcbiAgICB9IGVsc2UgaWYgKHZhbHVlLmVsbGlwc29pZC5zZW1pX21ham9yX2F4aXMgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5lbGxpcHNvaWQuc2VtaV9taW5vcl9heGlzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5yZiA9IHJlc3VsdC5hIC8gKHJlc3VsdC5hIC0gdG9WYWx1ZSh2YWx1ZS5lbGxpcHNvaWQuc2VtaV9taW5vcl9heGlzKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1QUk9KSlNPTihwcm9qanNvbiwgcmVzdWx0ID0ge30pIHtcbiAgaWYgKCFwcm9qanNvbiB8fCB0eXBlb2YgcHJvampzb24gIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHByb2pqc29uOyAvLyBSZXR1cm4gcHJpbWl0aXZlIHZhbHVlcyBhcy1pc1xuICB9XG5cbiAgaWYgKHByb2pqc29uLnR5cGUgPT09ICdCb3VuZENSUycpIHtcbiAgICB0cmFuc2Zvcm1QUk9KSlNPTihwcm9qanNvbi5zb3VyY2VfY3JzLCByZXN1bHQpO1xuXG4gICAgaWYgKHByb2pqc29uLnRyYW5zZm9ybWF0aW9uKSB7XG4gICAgICBpZiAocHJvampzb24udHJhbnNmb3JtYXRpb24ubWV0aG9kICYmIHByb2pqc29uLnRyYW5zZm9ybWF0aW9uLm1ldGhvZC5uYW1lID09PSAnTlR2MicpIHtcbiAgICAgICAgLy8gU2V0IG5hZGdyaWRzIHRvIHRoZSBmaWxlbmFtZSBmcm9tIHRoZSBwYXJhbWV0ZXJmaWxlXG4gICAgICAgIHJlc3VsdC5uYWRncmlkcyA9IHByb2pqc29uLnRyYW5zZm9ybWF0aW9uLnBhcmFtZXRlcnNbMF0udmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQb3B1bGF0ZSBkYXR1bV9wYXJhbXMgaWYgbm8gcGFyYW1ldGVyZmlsZSBpcyBmb3VuZFxuICAgICAgICByZXN1bHQuZGF0dW1fcGFyYW1zID0gcHJvampzb24udHJhbnNmb3JtYXRpb24ucGFyYW1ldGVycy5tYXAoKHBhcmFtKSA9PiBwYXJhbS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7IC8vIFJldHVybiBlYXJseSBmb3IgQm91bmRDUlNcbiAgfVxuXG4gIC8vIEhhbmRsZSBzcGVjaWZpYyBrZXlzIGluIFBST0pKU09OXG4gIE9iamVjdC5rZXlzKHByb2pqc29uKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IHByb2pqc29uW2tleV07XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3dpdGNoIChrZXkpIHtcbiAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICBpZiAocmVzdWx0LnNyc0NvZGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQubmFtZSA9IHZhbHVlO1xuICAgICAgICByZXN1bHQuc3JzQ29kZSA9IHZhbHVlOyAvLyBNYXAgYG5hbWVgIHRvIGBzcnNDb2RlYFxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndHlwZSc6XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gJ0dlb2dyYXBoaWNDUlMnKSB7XG4gICAgICAgICAgcmVzdWx0LnByb2pOYW1lID0gJ2xvbmdsYXQnO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnUHJvamVjdGVkQ1JTJyAmJiBwcm9qanNvbi5jb252ZXJzaW9uICYmIHByb2pqc29uLmNvbnZlcnNpb24ubWV0aG9kKSB7XG4gICAgICAgICAgcmVzdWx0LnByb2pOYW1lID0gcHJvampzb24uY29udmVyc2lvbi5tZXRob2QubmFtZTsgLy8gUmV0YWluIG9yaWdpbmFsIGNhcGl0YWxpemF0aW9uXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2RhdHVtJzpcbiAgICAgIGNhc2UgJ2RhdHVtX2Vuc2VtYmxlJzogLy8gSGFuZGxlIGJvdGggZGF0dW0gYW5kIGVuc2VtYmxlXG4gICAgICAgIGlmICh2YWx1ZS5lbGxpcHNvaWQpIHtcbiAgICAgICAgICAvLyBFeHRyYWN0IGVsbGlwc29pZCBwcm9wZXJ0aWVzXG4gICAgICAgICAgcmVzdWx0LmVsbHBzID0gdmFsdWUuZWxsaXBzb2lkLm5hbWU7XG4gICAgICAgICAgY2FsY3VsYXRlRWxsaXBzb2lkKHZhbHVlLCByZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5wcmltZV9tZXJpZGlhbikge1xuICAgICAgICAgIHJlc3VsdC5mcm9tX2dyZWVud2ljaCA9IHZhbHVlLnByaW1lX21lcmlkaWFuLmxvbmdpdHVkZSAqIE1hdGguUEkgLyAxODA7IC8vIENvbnZlcnQgdG8gcmFkaWFuc1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdlbGxpcHNvaWQnOlxuICAgICAgICByZXN1bHQuZWxscHMgPSB2YWx1ZS5uYW1lO1xuICAgICAgICBjYWxjdWxhdGVFbGxpcHNvaWQodmFsdWUsIHJlc3VsdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdwcmltZV9tZXJpZGlhbic6XG4gICAgICAgIHJlc3VsdC5sb25nMCA9ICh2YWx1ZS5sb25naXR1ZGUgfHwgMCkgKiBNYXRoLlBJIC8gMTgwOyAvLyBDb252ZXJ0IHRvIHJhZGlhbnNcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2Nvb3JkaW5hdGVfc3lzdGVtJzpcbiAgICAgICAgaWYgKHZhbHVlLmF4aXMpIHtcbiAgICAgICAgICByZXN1bHQuYXhpcyA9IHZhbHVlLmF4aXNcbiAgICAgICAgICAgIC5tYXAoKGF4aXMpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gYXhpcy5kaXJlY3Rpb247XG4gICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdlYXN0JykgcmV0dXJuICdlJztcbiAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ25vcnRoJykgcmV0dXJuICduJztcbiAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3dlc3QnKSByZXR1cm4gJ3cnO1xuICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnc291dGgnKSByZXR1cm4gJ3MnO1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gYXhpcyBkaXJlY3Rpb246ICR7ZGlyZWN0aW9ufWApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCcnKSArICd1JzsgLy8gQ29tYmluZSBpbnRvIGEgc2luZ2xlIHN0cmluZyAoZS5nLiwgXCJlbnVcIilcblxuICAgICAgICAgIGlmICh2YWx1ZS51bml0KSB7XG4gICAgICAgICAgICBjb25zdCB7IHVuaXRzLCB0b19tZXRlciB9ID0gcHJvY2Vzc1VuaXQodmFsdWUudW5pdCk7XG4gICAgICAgICAgICByZXN1bHQudW5pdHMgPSB1bml0cztcbiAgICAgICAgICAgIHJlc3VsdC50b19tZXRlciA9IHRvX21ldGVyO1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUuYXhpc1swXSAmJiB2YWx1ZS5heGlzWzBdLnVuaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdW5pdHMsIHRvX21ldGVyIH0gPSBwcm9jZXNzVW5pdCh2YWx1ZS5heGlzWzBdLnVuaXQpO1xuICAgICAgICAgICAgcmVzdWx0LnVuaXRzID0gdW5pdHM7XG4gICAgICAgICAgICByZXN1bHQudG9fbWV0ZXIgPSB0b19tZXRlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgY2FzZSAnaWQnOlxuICAgICAgICBpZiAodmFsdWUuYXV0aG9yaXR5ICYmIHZhbHVlLmNvZGUpIHtcbiAgICAgICAgICByZXN1bHQudGl0bGUgPSB2YWx1ZS5hdXRob3JpdHkgKyAnOicgKyB2YWx1ZS5jb2RlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjb252ZXJzaW9uJzpcbiAgICAgICAgaWYgKHZhbHVlLm1ldGhvZCAmJiB2YWx1ZS5tZXRob2QubmFtZSkge1xuICAgICAgICAgIHJlc3VsdC5wcm9qTmFtZSA9IHZhbHVlLm1ldGhvZC5uYW1lOyAvLyBSZXRhaW4gb3JpZ2luYWwgY2FwaXRhbGl6YXRpb25cbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUucGFyYW1ldGVycykge1xuICAgICAgICAgIHZhbHVlLnBhcmFtZXRlcnMuZm9yRWFjaCgocGFyYW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IHBhcmFtLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csICdfJyk7XG4gICAgICAgICAgICBjb25zdCBwYXJhbVZhbHVlID0gcGFyYW0udmFsdWU7XG4gICAgICAgICAgICBpZiAocGFyYW0udW5pdCAmJiBwYXJhbS51bml0LmNvbnZlcnNpb25fZmFjdG9yKSB7XG4gICAgICAgICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gcGFyYW1WYWx1ZSAqIHBhcmFtLnVuaXQuY29udmVyc2lvbl9mYWN0b3I7IC8vIENvbnZlcnQgdG8gcmFkaWFucyBvciBtZXRlcnNcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW0udW5pdCA9PT0gJ2RlZ3JlZScpIHtcbiAgICAgICAgICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBwYXJhbVZhbHVlICogTWF0aC5QSSAvIDE4MDsgLy8gQ29udmVydCB0byByYWRpYW5zXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IHBhcmFtVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3VuaXQnOlxuICAgICAgICBpZiAodmFsdWUubmFtZSkge1xuICAgICAgICAgIHJlc3VsdC51bml0cyA9IHZhbHVlLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBpZiAocmVzdWx0LnVuaXRzID09PSAnbWV0cmUnKSB7XG4gICAgICAgICAgICByZXN1bHQudW5pdHMgPSAnbWV0ZXInO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUuY29udmVyc2lvbl9mYWN0b3IpIHtcbiAgICAgICAgICByZXN1bHQudG9fbWV0ZXIgPSB2YWx1ZS5jb252ZXJzaW9uX2ZhY3RvcjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYmFzZV9jcnMnOlxuICAgICAgICB0cmFuc2Zvcm1QUk9KSlNPTih2YWx1ZSwgcmVzdWx0KTsgLy8gUGFzcyBgcmVzdWx0YCBkaXJlY3RseVxuICAgICAgICByZXN1bHQuZGF0dW1Db2RlID0gdmFsdWUuaWQgPyB2YWx1ZS5pZC5hdXRob3JpdHkgKyAnXycgKyB2YWx1ZS5pZC5jb2RlIDogdmFsdWUubmFtZTsgLy8gU2V0IGRhdHVtQ29kZVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gSWdub3JlIGlycmVsZXZhbnQgb3IgdW5uZWVkZWQgcHJvcGVydGllc1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFkZGl0aW9uYWwgY2FsY3VsYXRlZCBwcm9wZXJ0aWVzXG4gIGlmIChyZXN1bHQubGF0aXR1ZGVfb2ZfZmFsc2Vfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MCA9IHJlc3VsdC5sYXRpdHVkZV9vZl9mYWxzZV9vcmlnaW47IC8vIEFscmVhZHkgaW4gcmFkaWFuc1xuICB9XG4gIGlmIChyZXN1bHQubG9uZ2l0dWRlX29mX2ZhbHNlX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxvbmcwID0gcmVzdWx0LmxvbmdpdHVkZV9vZl9mYWxzZV9vcmlnaW47XG4gIH1cbiAgaWYgKHJlc3VsdC5sYXRpdHVkZV9vZl9zdGFuZGFyZF9wYXJhbGxlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDAgPSByZXN1bHQubGF0aXR1ZGVfb2Zfc3RhbmRhcmRfcGFyYWxsZWw7XG4gICAgcmVzdWx0LmxhdDEgPSByZXN1bHQubGF0aXR1ZGVfb2Zfc3RhbmRhcmRfcGFyYWxsZWw7XG4gIH1cbiAgaWYgKHJlc3VsdC5sYXRpdHVkZV9vZl8xc3Rfc3RhbmRhcmRfcGFyYWxsZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQxID0gcmVzdWx0LmxhdGl0dWRlX29mXzFzdF9zdGFuZGFyZF9wYXJhbGxlbDtcbiAgfVxuICBpZiAocmVzdWx0LmxhdGl0dWRlX29mXzJuZF9zdGFuZGFyZF9wYXJhbGxlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDIgPSByZXN1bHQubGF0aXR1ZGVfb2ZfMm5kX3N0YW5kYXJkX3BhcmFsbGVsOyBcbiAgfVxuICBpZiAocmVzdWx0LmxhdGl0dWRlX29mX3Byb2plY3Rpb25fY2VudHJlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MCA9IHJlc3VsdC5sYXRpdHVkZV9vZl9wcm9qZWN0aW9uX2NlbnRyZTtcbiAgfVxuICBpZiAocmVzdWx0LmxvbmdpdHVkZV9vZl9wcm9qZWN0aW9uX2NlbnRyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxvbmdjID0gcmVzdWx0LmxvbmdpdHVkZV9vZl9wcm9qZWN0aW9uX2NlbnRyZTtcbiAgfVxuICBpZiAocmVzdWx0LmVhc3RpbmdfYXRfZmFsc2Vfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQueDAgPSByZXN1bHQuZWFzdGluZ19hdF9mYWxzZV9vcmlnaW47XG4gIH1cbiAgaWYgKHJlc3VsdC5ub3J0aGluZ19hdF9mYWxzZV9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC55MCA9IHJlc3VsdC5ub3J0aGluZ19hdF9mYWxzZV9vcmlnaW47XG4gIH1cbiAgaWYgKHJlc3VsdC5sYXRpdHVkZV9vZl9uYXR1cmFsX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDAgPSByZXN1bHQubGF0aXR1ZGVfb2ZfbmF0dXJhbF9vcmlnaW47XG4gIH1cbiAgaWYgKHJlc3VsdC5sb25naXR1ZGVfb2ZfbmF0dXJhbF9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sb25nMCA9IHJlc3VsdC5sb25naXR1ZGVfb2ZfbmF0dXJhbF9vcmlnaW47XG4gIH1cbiAgaWYgKHJlc3VsdC5sb25naXR1ZGVfb2Zfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubG9uZzAgPSByZXN1bHQubG9uZ2l0dWRlX29mX29yaWdpbjtcbiAgfVxuICBpZiAocmVzdWx0LmZhbHNlX2Vhc3RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC54MCA9IHJlc3VsdC5mYWxzZV9lYXN0aW5nO1xuICB9XG4gIGlmIChyZXN1bHQuZWFzdGluZ19hdF9wcm9qZWN0aW9uX2NlbnRyZSkge1xuICAgIHJlc3VsdC54MCA9IHJlc3VsdC5lYXN0aW5nX2F0X3Byb2plY3Rpb25fY2VudHJlO1xuICB9XG4gIGlmIChyZXN1bHQuZmFsc2Vfbm9ydGhpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC55MCA9IHJlc3VsdC5mYWxzZV9ub3J0aGluZztcbiAgfVxuICBpZiAocmVzdWx0Lm5vcnRoaW5nX2F0X3Byb2plY3Rpb25fY2VudHJlKSB7XG4gICAgcmVzdWx0LnkwID0gcmVzdWx0Lm5vcnRoaW5nX2F0X3Byb2plY3Rpb25fY2VudHJlO1xuICB9XG4gIGlmIChyZXN1bHQuc3RhbmRhcmRfcGFyYWxsZWxfMSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDEgPSByZXN1bHQuc3RhbmRhcmRfcGFyYWxsZWxfMTtcbiAgfVxuICBpZiAocmVzdWx0LnN0YW5kYXJkX3BhcmFsbGVsXzIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQyID0gcmVzdWx0LnN0YW5kYXJkX3BhcmFsbGVsXzI7XG4gIH1cbiAgaWYgKHJlc3VsdC5zY2FsZV9mYWN0b3JfYXRfbmF0dXJhbF9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5rMCA9IHJlc3VsdC5zY2FsZV9mYWN0b3JfYXRfbmF0dXJhbF9vcmlnaW47XG4gIH1cbiAgaWYgKHJlc3VsdC5zY2FsZV9mYWN0b3JfYXRfcHJvamVjdGlvbl9jZW50cmUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5rMCA9IHJlc3VsdC5zY2FsZV9mYWN0b3JfYXRfcHJvamVjdGlvbl9jZW50cmU7XG4gIH1cbiAgaWYgKHJlc3VsdC5zY2FsZV9mYWN0b3Jfb25fcHNldWRvX3N0YW5kYXJkX3BhcmFsbGVsICE9PSB1bmRlZmluZWQpIHsgIFxuICAgIHJlc3VsdC5rMCA9IHJlc3VsdC5zY2FsZV9mYWN0b3Jfb25fcHNldWRvX3N0YW5kYXJkX3BhcmFsbGVsO1xuICB9XG4gIGlmIChyZXN1bHQuYXppbXV0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmFscGhhID0gcmVzdWx0LmF6aW11dGg7XG4gIH1cbiAgaWYgKHJlc3VsdC5hemltdXRoX2F0X3Byb2plY3Rpb25fY2VudHJlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQuYWxwaGEgPSByZXN1bHQuYXppbXV0aF9hdF9wcm9qZWN0aW9uX2NlbnRyZTtcbiAgfVxuICBpZiAocmVzdWx0LmFuZ2xlX2Zyb21fcmVjdGlmaWVkX3RvX3NrZXdfZ3JpZCkge1xuICAgIHJlc3VsdC5yZWN0aWZpZWRfZ3JpZF9hbmdsZSA9IHJlc3VsdC5hbmdsZV9mcm9tX3JlY3RpZmllZF90b19za2V3X2dyaWQ7XG4gIH1cblxuICAvLyBBcHBseSBwcm9qZWN0aW9uIGRlZmF1bHRzXG4gIGFwcGx5UHJvamVjdGlvbkRlZmF1bHRzKHJlc3VsdCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCJ2YXIgRDJSID0gMC4wMTc0NTMyOTI1MTk5NDMyOTU3NztcblxuZXhwb3J0IGZ1bmN0aW9uIGQycihpbnB1dCkge1xuICByZXR1cm4gaW5wdXQgKiBEMlI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVByb2plY3Rpb25EZWZhdWx0cyh3a3QpIHtcbiAgLy8gTm9ybWFsaXplIHByb2pOYW1lIGZvciBXS1QyIGNvbXBhdGliaWxpdHlcbiAgY29uc3Qgbm9ybWFsaXplZFByb2pOYW1lID0gKHdrdC5wcm9qTmFtZSB8fCAnJykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICcgJyk7XG5cbiAgaWYgKCF3a3QubG9uZzAgJiYgd2t0LmxvbmdjICYmIChub3JtYWxpemVkUHJvak5hbWUgPT09ICdhbGJlcnMgY29uaWMgZXF1YWwgYXJlYScgfHwgbm9ybWFsaXplZFByb2pOYW1lID09PSAnbGFtYmVydCBhemltdXRoYWwgZXF1YWwgYXJlYScpKSB7XG4gICAgd2t0LmxvbmcwID0gd2t0LmxvbmdjO1xuICB9XG4gIGlmICghd2t0LmxhdF90cyAmJiB3a3QubGF0MSAmJiAobm9ybWFsaXplZFByb2pOYW1lID09PSAnc3RlcmVvZ3JhcGhpYyBzb3V0aCBwb2xlJyB8fCBub3JtYWxpemVkUHJvak5hbWUgPT09ICdwb2xhciBzdGVyZW9ncmFwaGljICh2YXJpYW50IGIpJykpIHtcbiAgICB3a3QubGF0MCA9IGQycih3a3QubGF0MSA+IDAgPyA5MCA6IC05MCk7XG4gICAgd2t0LmxhdF90cyA9IHdrdC5sYXQxO1xuICAgIGRlbGV0ZSB3a3QubGF0MTtcbiAgfSBlbHNlIGlmICghd2t0LmxhdF90cyAmJiB3a3QubGF0MCAmJiAobm9ybWFsaXplZFByb2pOYW1lID09PSAncG9sYXIgc3RlcmVvZ3JhcGhpYycgfHwgbm9ybWFsaXplZFByb2pOYW1lID09PSAncG9sYXIgc3RlcmVvZ3JhcGhpYyAodmFyaWFudCBhKScpKSB7XG4gICAgd2t0LmxhdF90cyA9IHdrdC5sYXQwO1xuICAgIHdrdC5sYXQwID0gZDJyKHdrdC5sYXQwID4gMCA/IDkwIDogLTkwKTtcbiAgICBkZWxldGUgd2t0LmxhdDE7XG4gIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vQHRzLWNoZWNrXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0IHByb2o0IGZyb20gXCJwcm9qNFwiO1xuXG4vLyBFUFNHOjMwMzUgZGVmaW5pdGlvblxucHJvajQuZGVmcyhcIkVQU0c6MzAzNVwiLFxuICBcIitwcm9qPWxhZWEgK2xhdF8wPTUyICtsb25fMD0xMCAreF8wPTQzMjEwMDAgK3lfMD0zMjEwMDAwICtlbGxwcz1HUlM4MCArdW5pdHM9bSArbm9fZGVmc1wiXG4pO1xuY29uc3QgdHJhbnNmb3JtID0gcHJvajQocHJvajQuV0dTODQsIFwiRVBTRzozMDM1XCIpO1xuXG4vKipcbiAqIFByb2plY3Rpb24gZnVuY3Rpb24gZm9yIEV1cm9wZWFuIExBRUEuXG4gKiBGcm9tIFtsb24sbGF0XSB0byBbeCx5XVxuICovXG5leHBvcnQgY29uc3QgcHJvajMwMzUgPSB0cmFuc2Zvcm0uZm9yd2FyZDtcblxuXG4vL3Rlc3Rcbi8vY29uc29sZS5sb2cocHJvajMwMzUoWzMzLjAwMywgMzQuNzQ3XSkpXG4vLzE2MTUwNjcsMiAgNjQxNTcyOCw1XG5cblxuLy9pbXBvcnQgeyBnZW9BemltdXRoYWxFcXVhbEFyZWEgfSBmcm9tICdkMy1nZW8nXG4vL1wiZDMtZ2VvXCI6IFwiXjMuMC4xXCIsXG5cbi8qZXhwb3J0IGNvbnN0IHByb2ozMDM1ID0gZ2VvQXppbXV0aGFsRXF1YWxBcmVhKClcbiAgICAucm90YXRlKFstMTAsIC01Ml0pXG4gICAgLnJlZmxlY3RYKGZhbHNlKVxuICAgIC5yZWZsZWN0WSh0cnVlKVxuICAgIC5zY2FsZSg2MzcwOTk3KSAvLzYzNzgxMzdcbiAgICAudHJhbnNsYXRlKFs0MzIxMDAwLCAzMjEwMDAwXSlcbiovXG5cblxuXG5cbi8qKlxuICogUmV0dXJucyBvcHRpb25zIGZvciBncmlkdml6IGxhYmVsIGxheWVyLlxuICogRnJvbSBFdXJvbnltIGRhdGE6IGh0dHBzOi8vZ2l0aHViLmNvbS9ldXJvc3RhdC9ldXJvbnltXG4gKlxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEV1cm9ueW1lTGFiZWxMYXllciA9IGZ1bmN0aW9uIChjYyA9ICdFVVInLCByZXMgPSA1MCwgb3B0cz17fSkge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgY29uc3QgZXggPSBvcHRzLmV4IHx8IDEuMlxuICAgIGNvbnN0IGZvbnRGYW1pbHkgPSBvcHRzLmZvbnRGYW1pbHkgfHwgJ0FyaWFsJ1xuICAgIGNvbnN0IGV4U2l6ZSA9IG9wdHMuZXhTaXplIHx8IDEuMlxuICAgIG9wdHMuc3R5bGUgPVxuICAgICAgICBvcHRzLnN0eWxlIHx8XG4gICAgICAgICgobGIsIHpmKSA9PiB7XG4gICAgICAgICAgICBpZiAobGIucnMgPCBleCAqIHpmKSByZXR1cm5cbiAgICAgICAgICAgIGlmIChsYi5yMSA8IGV4ICogemYpIHJldHVybiBleFNpemUgKyAnZW0gJyArIGZvbnRGYW1pbHlcbiAgICAgICAgICAgIHJldHVybiBleFNpemUgKiAxLjUgKyAnZW0gJyArIGZvbnRGYW1pbHlcbiAgICAgICAgfSlcbiAgICBvcHRzLnByb2ogPSBvcHRzLnByb2ogfHwgcHJvajMwMzVcbiAgICBvcHRzLnByZXByb2Nlc3MgPSAobGIpID0+IHtcbiAgICAgICAgLy9leGNsdWRlIGNvdW50cmllc1xuICAgICAgICAvL2lmKG9wdHMuY2NPdXQgJiYgbGIuY2MgJiYgb3B0cy5jY091dC5pbmNsdWRlcyhsYi5jYykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKG9wdHMuY2NJbiAmJiBsYi5jYyAmJiAhKG9wdHMuY2NJbi5pbmRleE9mKGxiLmNjKSA+PSAwKSkgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgLy9wcm9qZWN0IGZyb20gZ2VvIGNvb3JkaW5hdGVzIHRvIEVUUlM4OS1MQUVBXG4gICAgICAgIGNvbnN0IHAgPSBvcHRzLnByb2ooWytsYi5sb24sICtsYi5sYXRdKVxuICAgICAgICBsYi54ID0gcFswXVxuICAgICAgICBsYi55ID0gcFsxXVxuICAgICAgICBkZWxldGUgbGIubG9uXG4gICAgICAgIGRlbGV0ZSBsYi5sYXRcbiAgICB9XG4gICAgb3B0cy5iYXNlVVJMID0gb3B0cy5iYXNlVVJMIHx8ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZXVyb3N0YXQvZXVyb255bS9tYWluL3B1Yi92My9VVEZfTEFUSU4vJ1xuICAgIG9wdHMudXJsID0gb3B0cy5iYXNlVVJMICsgcmVzICsgJy8nICsgY2MgKyAnLmNzdidcbiAgICByZXR1cm4gb3B0c1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBvcHRpb25zIGZvciBncmlkdml6IGJvdW5kYXJpZXMgbGF5ZXIuXG4gKiBGcm9tIE51dHMyanNvbiBkYXRhOiBodHRwczovL2dpdGh1Yi5jb20vZXVyb3N0YXQvTnV0czJqc29uXG4gKiBcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFdXJvc3RhdEJvdW5kYXJpZXNMYXllciA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge31cbiAgICBjb25zdCBudXRzWWVhciA9IG9wdHMubnV0c1llYXIgfHwgJzIwMjQnXG4gICAgY29uc3QgZ2VvID0gb3B0cy5nZW9cbiAgICBjb25zdCBjcnMgPSBvcHRzLmNycyB8fCAnMzAzNSdcbiAgICBjb25zdCBzY2FsZSA9IG9wdHMuc2NhbGUgfHwgJzAzTSdcbiAgICBjb25zdCBudXRzTGV2ZWwgPSBvcHRzLm51dHNMZXZlbCB8fCAnMydcbiAgICBjb25zdCBjb2wgPSBvcHRzLmNvbCB8fCAnIzg4OCdcbiAgICBjb25zdCBjb2xLb3Nvdm8gPSBvcHRzLmNvbEtvc292byB8fCAnI2JjYmNiYydcbiAgICBjb25zdCBzaG93T3RoID0gb3B0cy5zaG93T3RoID09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRzLnNob3dPdGhcblxuICAgIC8vaW4gbW9zdCBjYXNlcywgYWxyZWFkeSBwcm9qZWN0ZWQgZGF0YSBvZiBudXRzMmpzb24gd2lsbCBiZSB1c2VkLCB1c2luZyAnb3B0cy5jcnMnXG4gICAgaWYgKG9wdHMucHJvailcbiAgICAgICAgb3B0cy5wcmVwcm9jZXNzID0gKGJuKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChibi5nZW9tZXRyeS50eXBlID09PSBcIkxpbmVTdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNzID0gW11cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjIG9mIGJuLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAgICAgICAgICAgICBjcy5wdXNoKG9wdHMucHJvaihjKSlcbiAgICAgICAgICAgICAgICBibi5nZW9tZXRyeS5jb29yZGluYXRlcyA9IGNzXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBwcm9qZWN0IGJvdW5kYXJ5IC0gdW5zdXBwb3J0ZWQgZ2VvbWV0cnkgdHlwZTogXCIgKyBibi5nZW9tZXRyeS50eXBlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgb3B0cy5jb2xvciA9XG4gICAgICAgIG9wdHMuY29sb3IgfHxcbiAgICAgICAgKChmLCB6ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IGYucHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKCFzaG93T3RoIC8qJiYgcC5jbyA9PSBcIkZcIiovICYmIHAuZXUgIT0gJ1QnICYmIHAuY2MgIT0gJ1QnICYmIHAuZWZ0YSAhPSAnVCcgJiYgcC5vdGggPT09ICdUJylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGlmIChwLmlkID49IDEwMDAwMCkgcmV0dXJuIGNvbEtvc292b1xuICAgICAgICAgICAgLy9yZXR1cm4gY29sXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gY29sXG4gICAgICAgICAgICBpZiAoemYgPCA0MDApIHJldHVybiBjb2xcbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMTAwMCkgcmV0dXJuIHAubHZsID49IDMgPyAnJyA6IGNvbFxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAyMDAwKSByZXR1cm4gcC5sdmwgPj0gMiA/ICcnIDogY29sXG4gICAgICAgICAgICBlbHNlIHJldHVybiBwLmx2bCA+PSAxID8gJycgOiBjb2xcbiAgICAgICAgfSlcblxuICAgIG9wdHMud2lkdGggPVxuICAgICAgICBvcHRzLndpZHRoIHx8XG4gICAgICAgICgoZiwgemYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBmLnByb3BlcnRpZXNcbiAgICAgICAgICAgIGlmIChwLmNvID09PSAnVCcpIHJldHVybiAwLjVcbiAgICAgICAgICAgIGlmICh6ZiA8IDQwMCkgcmV0dXJuIHAubHZsID09IDMgPyAyLjIgOiBwLmx2bCA9PSAyID8gMi4yIDogcC5sdmwgPT0gMSA/IDIuMiA6IDRcbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMTAwMCkgcmV0dXJuIHAubHZsID09IDIgPyAxLjggOiBwLmx2bCA9PSAxID8gMS44IDogMi41XG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDIwMDApIHJldHVybiBwLmx2bCA9PSAxID8gMS44IDogMi41XG4gICAgICAgICAgICBlbHNlIHJldHVybiAxLjJcbiAgICAgICAgfSlcblxuICAgIG9wdHMubGluZURhc2ggPVxuICAgICAgICBvcHRzLmxpbmVEYXNoIHx8XG4gICAgICAgICgoZiwgemYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBmLnByb3BlcnRpZXNcbiAgICAgICAgICAgIGlmIChwLmNvID09PSAnVCcpIHJldHVybiBbXVxuICAgICAgICAgICAgaWYgKHpmIDwgNDAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBwLmx2bCA9PSAzXG4gICAgICAgICAgICAgICAgICAgID8gWzIgKiB6ZiwgMiAqIHpmXVxuICAgICAgICAgICAgICAgICAgICA6IHAubHZsID09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gWzUgKiB6ZiwgMiAqIHpmXVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBwLmx2bCA9PSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBbNSAqIHpmLCAyICogemZdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbMTAgKiB6ZiwgMyAqIHpmXVxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAxMDAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBwLmx2bCA9PSAyID8gWzUgKiB6ZiwgMiAqIHpmXSA6IHAubHZsID09IDEgPyBbNSAqIHpmLCAyICogemZdIDogWzEwICogemYsIDMgKiB6Zl1cbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMjAwMCkgcmV0dXJuIHAubHZsID09IDEgPyBbNSAqIHpmLCAyICogemZdIDogWzEwICogemYsIDMgKiB6Zl1cbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLmJhc2VVUkwgPSBvcHRzLmJhc2VVUkwgfHwgJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9ldXJvc3RhdC9OdXRzMmpzb24vbWFzdGVyL3B1Yi92Mi8nXG4gICAgb3B0cy51cmwgPSBvcHRzLmJhc2VVUkwgKyBudXRzWWVhciArIChnZW8gPyAnLycgKyBnZW8gOiAnJykgKyAnLycgKyBjcnMgKyAnLycgKyBzY2FsZSArICcvbnV0c2JuXycgKyBudXRzTGV2ZWwgKyAnLmpzb24nXG4gICAgcmV0dXJuIG9wdHNcbn1cblxuXG5cbi8vcHJlcGFyZSBvYmplY3QgZm9yIGdpc2NvIGJhY2tncm91bmQgbGF5ZXIgY3JlYXRpb25cbi8vc2VlIGh0dHBzOi8vZ2lzY28tc2VydmljZXMuZWMuZXVyb3BhLmV1L21hcHMvZGVtby8/d210c19sYXllcj1PU01Qb3NpdHJvbkJhY2tncm91bmQmZm9ybWF0PXBuZyZzcnM9RVBTRyUzQTMwMzVcbmV4cG9ydCBmdW5jdGlvbiBnaXNjb0JhY2tncm91bmRMYXllcihtYXAgPSBcIk9TTVBvc2l0cm9uQmFja2dyb3VuZFwiLCBkZXB0aCA9IDE5LCBjcnMgPSBcIkVQU0czMDM1XCIsIHRlbXBsYXRlID0ge30pIHtcbiAgICB0ZW1wbGF0ZS51cmwgPSBcImh0dHBzOi8vZ2lzY28tc2VydmljZXMuZWMuZXVyb3BhLmV1L21hcHMvdGlsZXMvXCIgKyBtYXAgKyBcIi9cIiArIGNycyArIFwiL1wiXG4gICAgdGVtcGxhdGUucmVzb2x1dGlvbnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBkZXB0aCB9LCAoXywgaSkgPT4gMTU2NTQzLjAzMzkyODA0MDk3ICogTWF0aC5wb3coMiwgLWkpKVxuICAgIHRlbXBsYXRlLm9yaWdpbiA9IFswLCA2MDAwMDAwXVxuICAgIHJldHVybiB0ZW1wbGF0ZVxufVxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=