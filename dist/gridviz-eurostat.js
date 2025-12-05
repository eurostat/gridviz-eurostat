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
const getEuronymeLabelLayer = function (cc = 'EUR', res = 50, opts) {
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
        const p = opts.proj([lb.lon, lb.lat])
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
    const nutsYear = opts.nutsYear || '2021'
    const geo = opts.geo
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHZpei1ldXJvc3RhdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFFBQVE7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxRQUFRO0FBQ1o7QUFDQTs7QUFFQSxZQUFZO0FBQ1osWUFBWTtBQUNaLFlBQVk7QUFDWixZQUFZO0FBQ1osWUFBWTtBQUNaLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCO0FBQ087QUFDUCw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUI7QUFDckIsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBLCtDQUErQztBQUMvQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ2h3Q3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEs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dURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxhQUFhO0FBQ3RFLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7O0FBRUEsa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLG1CQUFtQixFOzs7Ozs7Ozs7Ozs7Ozs7O0FDNVR5QjtBQUNBOztBQUUzRDtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNPO0FBQ1A7QUFDQSx1Q0FBdUMsK0RBQW1CLEdBQUcsK0RBQW1CO0FBQ2hGO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkNtRDtBQUNNO0FBQ3hCO0FBQ0U7QUFDd0I7QUFDRjs7QUFFekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsNkNBQUc7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyx5Q0FBRztBQUN0QztBQUNBO0FBQ0EscUNBQXFDLHlDQUFHO0FBQ3hDO0FBQ0E7QUFDQSxrQ0FBa0MseUNBQUc7QUFDckMsbUNBQW1DLHlDQUFHO0FBQ3RDLG9DQUFvQyx5Q0FBRztBQUN2QyxvQ0FBb0MseUNBQUc7QUFDdkMsb0NBQW9DLHlDQUFHO0FBQ3ZDO0FBQ0EseUJBQXlCLHlDQUFHO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLEVBQUUsaUVBQXVCO0FBQ3pCO0FBQ0EsNkJBQWUsb0NBQVM7QUFDeEI7QUFDQSxXQUFXLHdFQUFpQjtBQUM1QjtBQUNBLGtCQUFrQixzRUFBZ0I7QUFDbEMsYUFBYSxzREFBTTtBQUNuQjtBQUNBLHFCQUFxQixnRUFBYTtBQUNsQyxXQUFXLHdFQUFpQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxFQUFFLGtEQUFLO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUMxTkEsaUVBQWUsV0FBVyxFQUFDOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ08sd0dBQXdHO0FBQy9HO0FBQ0Esd0NBQXdDLGVBQWU7QUFDdkQ7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9tZ3JzL21ncnMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvUHJvai5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9hZGp1c3RfYXhpcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jaGVja1Nhbml0eS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vYWRqdXN0X2xhdC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vYWRqdXN0X2xvbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vYWRqdXN0X3pvbmUuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2FzaW5oeS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vYXNpbnouanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2NsZW5zLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9jbGVuc19jbXBseC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vY29zaC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZTBmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZTFmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZTJmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZTNmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZ04uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2dhdGcuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2h5cG90LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9pbWxmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vaXFzZm56LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9sb2cxcHkuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL21sZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL21zZm56LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9waGkyei5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vcGpfZW5mbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vcGpfaW52X21sZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3BqX21sZm4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3FzZm56LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9zaWduLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9zaW5oLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9zcmF0LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi90b1BvaW50LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi90c2Zuei5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vdmluY2VudHkuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29uc3RhbnRzL0RhdHVtLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy9FbGxpcHNvaWQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29uc3RhbnRzL1ByaW1lTWVyaWRpYW4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29uc3RhbnRzL3VuaXRzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy92YWx1ZXMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29yZS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9kYXR1bS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9kYXR1bVV0aWxzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2RhdHVtX3RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9kZWZzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2Rlcml2ZUNvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9leHRlbmQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZ2xvYmFsLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2luZGV4LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL21hdGNoLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL25hZGdyaWQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcGFyc2VDb2RlLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2pTdHJpbmcuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvYWVhLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2FlcWQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvYm9ubmUuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvY2Fzcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9jZWEuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZXFjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2VxZGMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZXFlYXJ0aC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9ldG1lcmMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZ2F1c3MuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZ2VvY2VudC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9nZW9zLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2dub20uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMva3JvdmFrLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2xhZWEuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbGNjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2xvbmdsYXQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbWVyYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9taWxsLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL21vbGwuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbnptZy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9vYl90cmFuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL29tZXJjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL29ydGhvLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3BvbHkuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvcXNjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3JvYmluLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3NpbnUuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvc29tZXJjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3N0ZXJlLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3N0ZXJlYS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy90bWVyYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy90cGVycy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy91dG0uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvdmFuZGcuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvdHJhbnNmb3JtLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvcHJvanMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL1BST0pKU09OQnVpbGRlcjIwMTUuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL1BST0pKU09OQnVpbGRlcjIwMTkuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL1BST0pKU09OQnVpbGRlckJhc2UuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL2J1aWxkUFJPSkpTT04uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL2RldGVjdFdLVFZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL2luZGV4LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL3Byb2Nlc3MuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL3RyYW5zZm9ybVBST0pKU09OLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci91dGlsLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImdyaWR2aXpfZXVyb3N0YXRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZ3JpZHZpel9ldXJvc3RhdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCJcblxuXG4vKipcbiAqIFVUTSB6b25lcyBhcmUgZ3JvdXBlZCwgYW5kIGFzc2lnbmVkIHRvIG9uZSBvZiBhIGdyb3VwIG9mIDZcbiAqIHNldHMuXG4gKlxuICoge2ludH0gQHByaXZhdGVcbiAqL1xudmFyIE5VTV8xMDBLX1NFVFMgPSA2O1xuXG4vKipcbiAqIFRoZSBjb2x1bW4gbGV0dGVycyAoZm9yIGVhc3RpbmcpIG9mIHRoZSBsb3dlciBsZWZ0IHZhbHVlLCBwZXJcbiAqIHNldC5cbiAqXG4gKiB7c3RyaW5nfSBAcHJpdmF0ZVxuICovXG52YXIgU0VUX09SSUdJTl9DT0xVTU5fTEVUVEVSUyA9ICdBSlNBSlMnO1xuXG4vKipcbiAqIFRoZSByb3cgbGV0dGVycyAoZm9yIG5vcnRoaW5nKSBvZiB0aGUgbG93ZXIgbGVmdCB2YWx1ZSwgcGVyXG4gKiBzZXQuXG4gKlxuICoge3N0cmluZ30gQHByaXZhdGVcbiAqL1xudmFyIFNFVF9PUklHSU5fUk9XX0xFVFRFUlMgPSAnQUZBRkFGJztcblxudmFyIEEgPSA2NTsgLy8gQVxudmFyIEkgPSA3MzsgLy8gSVxudmFyIE8gPSA3OTsgLy8gT1xudmFyIFYgPSA4NjsgLy8gVlxudmFyIFogPSA5MDsgLy8gWlxuZXhwb3J0IGRlZmF1bHQge1xuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICB0b1BvaW50OiB0b1BvaW50XG59O1xuLyoqXG4gKiBDb252ZXJzaW9uIG9mIGxhdC9sb24gdG8gTUdSUy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gbGwgT2JqZWN0IGxpdGVyYWwgd2l0aCBsYXQgYW5kIGxvbiBwcm9wZXJ0aWVzIG9uIGFcbiAqICAgICBXR1M4NCBlbGxpcHNvaWQuXG4gKiBAcGFyYW0ge2ludH0gYWNjdXJhY3kgQWNjdXJhY3kgaW4gZGlnaXRzICg1IGZvciAxIG0sIDQgZm9yIDEwIG0sIDMgZm9yXG4gKiAgICAgIDEwMCBtLCAyIGZvciAxMDAwIG0gb3IgMSBmb3IgMTAwMDAgbSkuIE9wdGlvbmFsLCBkZWZhdWx0IGlzIDUuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBNR1JTIHN0cmluZyBmb3IgdGhlIGdpdmVuIGxvY2F0aW9uIGFuZCBhY2N1cmFjeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQobGwsIGFjY3VyYWN5KSB7XG4gIGFjY3VyYWN5ID0gYWNjdXJhY3kgfHwgNTsgLy8gZGVmYXVsdCBhY2N1cmFjeSAxbVxuICByZXR1cm4gZW5jb2RlKExMdG9VVE0oe1xuICAgIGxhdDogbGxbMV0sXG4gICAgbG9uOiBsbFswXVxuICB9KSwgYWNjdXJhY3kpO1xufTtcblxuLyoqXG4gKiBDb252ZXJzaW9uIG9mIE1HUlMgdG8gbGF0L2xvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWdycyBNR1JTIHN0cmluZy5cbiAqIEByZXR1cm4ge2FycmF5fSBBbiBhcnJheSB3aXRoIGxlZnQgKGxvbmdpdHVkZSksIGJvdHRvbSAobGF0aXR1ZGUpLCByaWdodFxuICogICAgIChsb25naXR1ZGUpIGFuZCB0b3AgKGxhdGl0dWRlKSB2YWx1ZXMgaW4gV0dTODQsIHJlcHJlc2VudGluZyB0aGVcbiAqICAgICBib3VuZGluZyBib3ggZm9yIHRoZSBwcm92aWRlZCBNR1JTIHJlZmVyZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UobWdycykge1xuICB2YXIgYmJveCA9IFVUTXRvTEwoZGVjb2RlKG1ncnMudG9VcHBlckNhc2UoKSkpO1xuICBpZiAoYmJveC5sYXQgJiYgYmJveC5sb24pIHtcbiAgICByZXR1cm4gW2Jib3gubG9uLCBiYm94LmxhdCwgYmJveC5sb24sIGJib3gubGF0XTtcbiAgfVxuICByZXR1cm4gW2Jib3gubGVmdCwgYmJveC5ib3R0b20sIGJib3gucmlnaHQsIGJib3gudG9wXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1BvaW50KG1ncnMpIHtcbiAgdmFyIGJib3ggPSBVVE10b0xMKGRlY29kZShtZ3JzLnRvVXBwZXJDYXNlKCkpKTtcbiAgaWYgKGJib3gubGF0ICYmIGJib3gubG9uKSB7XG4gICAgcmV0dXJuIFtiYm94LmxvbiwgYmJveC5sYXRdO1xuICB9XG4gIHJldHVybiBbKGJib3gubGVmdCArIGJib3gucmlnaHQpIC8gMiwgKGJib3gudG9wICsgYmJveC5ib3R0b20pIC8gMl07XG59O1xuLyoqXG4gKiBDb252ZXJzaW9uIGZyb20gZGVncmVlcyB0byByYWRpYW5zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGVnIHRoZSBhbmdsZSBpbiBkZWdyZWVzLlxuICogQHJldHVybiB7bnVtYmVyfSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAqL1xuZnVuY3Rpb24gZGVnVG9SYWQoZGVnKSB7XG4gIHJldHVybiAoZGVnICogKE1hdGguUEkgLyAxODAuMCkpO1xufVxuXG4vKipcbiAqIENvbnZlcnNpb24gZnJvbSByYWRpYW5zIHRvIGRlZ3JlZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWQgdGhlIGFuZ2xlIGluIHJhZGlhbnMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBhbmdsZSBpbiBkZWdyZWVzLlxuICovXG5mdW5jdGlvbiByYWRUb0RlZyhyYWQpIHtcbiAgcmV0dXJuICgxODAuMCAqIChyYWQgLyBNYXRoLlBJKSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBzZXQgb2YgTG9uZ2l0dWRlIGFuZCBMYXRpdHVkZSBjby1vcmRpbmF0ZXMgdG8gVVRNXG4gKiB1c2luZyB0aGUgV0dTODQgZWxsaXBzb2lkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gbGwgT2JqZWN0IGxpdGVyYWwgd2l0aCBsYXQgYW5kIGxvbiBwcm9wZXJ0aWVzXG4gKiAgICAgcmVwcmVzZW50aW5nIHRoZSBXR1M4NCBjb29yZGluYXRlIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGxpdGVyYWwgY29udGFpbmluZyB0aGUgVVRNIHZhbHVlIHdpdGggZWFzdGluZyxcbiAqICAgICBub3J0aGluZywgem9uZU51bWJlciBhbmQgem9uZUxldHRlciBwcm9wZXJ0aWVzLCBhbmQgYW4gb3B0aW9uYWxcbiAqICAgICBhY2N1cmFjeSBwcm9wZXJ0eSBpbiBkaWdpdHMuIFJldHVybnMgbnVsbCBpZiB0aGUgY29udmVyc2lvbiBmYWlsZWQuXG4gKi9cbmZ1bmN0aW9uIExMdG9VVE0obGwpIHtcbiAgdmFyIExhdCA9IGxsLmxhdDtcbiAgdmFyIExvbmcgPSBsbC5sb247XG4gIHZhciBhID0gNjM3ODEzNy4wOyAvL2VsbGlwLnJhZGl1cztcbiAgdmFyIGVjY1NxdWFyZWQgPSAwLjAwNjY5NDM4OyAvL2VsbGlwLmVjY3NxO1xuICB2YXIgazAgPSAwLjk5OTY7XG4gIHZhciBMb25nT3JpZ2luO1xuICB2YXIgZWNjUHJpbWVTcXVhcmVkO1xuICB2YXIgTiwgVCwgQywgQSwgTTtcbiAgdmFyIExhdFJhZCA9IGRlZ1RvUmFkKExhdCk7XG4gIHZhciBMb25nUmFkID0gZGVnVG9SYWQoTG9uZyk7XG4gIHZhciBMb25nT3JpZ2luUmFkO1xuICB2YXIgWm9uZU51bWJlcjtcbiAgLy8gKGludClcbiAgWm9uZU51bWJlciA9IE1hdGguZmxvb3IoKExvbmcgKyAxODApIC8gNikgKyAxO1xuXG4gIC8vTWFrZSBzdXJlIHRoZSBsb25naXR1ZGUgMTgwLjAwIGlzIGluIFpvbmUgNjBcbiAgaWYgKExvbmcgPT09IDE4MCkge1xuICAgIFpvbmVOdW1iZXIgPSA2MDtcbiAgfVxuXG4gIC8vIFNwZWNpYWwgem9uZSBmb3IgTm9yd2F5XG4gIGlmIChMYXQgPj0gNTYuMCAmJiBMYXQgPCA2NC4wICYmIExvbmcgPj0gMy4wICYmIExvbmcgPCAxMi4wKSB7XG4gICAgWm9uZU51bWJlciA9IDMyO1xuICB9XG5cbiAgLy8gU3BlY2lhbCB6b25lcyBmb3IgU3ZhbGJhcmRcbiAgaWYgKExhdCA+PSA3Mi4wICYmIExhdCA8IDg0LjApIHtcbiAgICBpZiAoTG9uZyA+PSAwLjAgJiYgTG9uZyA8IDkuMCkge1xuICAgICAgWm9uZU51bWJlciA9IDMxO1xuICAgIH1cbiAgICBlbHNlIGlmIChMb25nID49IDkuMCAmJiBMb25nIDwgMjEuMCkge1xuICAgICAgWm9uZU51bWJlciA9IDMzO1xuICAgIH1cbiAgICBlbHNlIGlmIChMb25nID49IDIxLjAgJiYgTG9uZyA8IDMzLjApIHtcbiAgICAgIFpvbmVOdW1iZXIgPSAzNTtcbiAgICB9XG4gICAgZWxzZSBpZiAoTG9uZyA+PSAzMy4wICYmIExvbmcgPCA0Mi4wKSB7XG4gICAgICBab25lTnVtYmVyID0gMzc7XG4gICAgfVxuICB9XG5cbiAgTG9uZ09yaWdpbiA9IChab25lTnVtYmVyIC0gMSkgKiA2IC0gMTgwICsgMzsgLy8rMyBwdXRzIG9yaWdpblxuICAvLyBpbiBtaWRkbGUgb2ZcbiAgLy8gem9uZVxuICBMb25nT3JpZ2luUmFkID0gZGVnVG9SYWQoTG9uZ09yaWdpbik7XG5cbiAgZWNjUHJpbWVTcXVhcmVkID0gKGVjY1NxdWFyZWQpIC8gKDEgLSBlY2NTcXVhcmVkKTtcblxuICBOID0gYSAvIE1hdGguc3FydCgxIC0gZWNjU3F1YXJlZCAqIE1hdGguc2luKExhdFJhZCkgKiBNYXRoLnNpbihMYXRSYWQpKTtcbiAgVCA9IE1hdGgudGFuKExhdFJhZCkgKiBNYXRoLnRhbihMYXRSYWQpO1xuICBDID0gZWNjUHJpbWVTcXVhcmVkICogTWF0aC5jb3MoTGF0UmFkKSAqIE1hdGguY29zKExhdFJhZCk7XG4gIEEgPSBNYXRoLmNvcyhMYXRSYWQpICogKExvbmdSYWQgLSBMb25nT3JpZ2luUmFkKTtcblxuICBNID0gYSAqICgoMSAtIGVjY1NxdWFyZWQgLyA0IC0gMyAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gNjQgLSA1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMjU2KSAqIExhdFJhZCAtICgzICogZWNjU3F1YXJlZCAvIDggKyAzICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAzMiArIDQ1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMTAyNCkgKiBNYXRoLnNpbigyICogTGF0UmFkKSArICgxNSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMjU2ICsgNDUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAxMDI0KSAqIE1hdGguc2luKDQgKiBMYXRSYWQpIC0gKDM1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMzA3MikgKiBNYXRoLnNpbig2ICogTGF0UmFkKSk7XG5cbiAgdmFyIFVUTUVhc3RpbmcgPSAoazAgKiBOICogKEEgKyAoMSAtIFQgKyBDKSAqIEEgKiBBICogQSAvIDYuMCArICg1IC0gMTggKiBUICsgVCAqIFQgKyA3MiAqIEMgLSA1OCAqIGVjY1ByaW1lU3F1YXJlZCkgKiBBICogQSAqIEEgKiBBICogQSAvIDEyMC4wKSArIDUwMDAwMC4wKTtcblxuICB2YXIgVVRNTm9ydGhpbmcgPSAoazAgKiAoTSArIE4gKiBNYXRoLnRhbihMYXRSYWQpICogKEEgKiBBIC8gMiArICg1IC0gVCArIDkgKiBDICsgNCAqIEMgKiBDKSAqIEEgKiBBICogQSAqIEEgLyAyNC4wICsgKDYxIC0gNTggKiBUICsgVCAqIFQgKyA2MDAgKiBDIC0gMzMwICogZWNjUHJpbWVTcXVhcmVkKSAqIEEgKiBBICogQSAqIEEgKiBBICogQSAvIDcyMC4wKSkpO1xuICBpZiAoTGF0IDwgMC4wKSB7XG4gICAgVVRNTm9ydGhpbmcgKz0gMTAwMDAwMDAuMDsgLy8xMDAwMDAwMCBtZXRlciBvZmZzZXQgZm9yXG4gICAgLy8gc291dGhlcm4gaGVtaXNwaGVyZVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBub3J0aGluZzogTWF0aC5yb3VuZChVVE1Ob3J0aGluZyksXG4gICAgZWFzdGluZzogTWF0aC5yb3VuZChVVE1FYXN0aW5nKSxcbiAgICB6b25lTnVtYmVyOiBab25lTnVtYmVyLFxuICAgIHpvbmVMZXR0ZXI6IGdldExldHRlckRlc2lnbmF0b3IoTGF0KVxuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIFVUTSBjb29yZHMgdG8gbGF0L2xvbmcsIHVzaW5nIHRoZSBXR1M4NCBlbGxpcHNvaWQuIFRoaXMgaXMgYSBjb252ZW5pZW5jZVxuICogY2xhc3Mgd2hlcmUgdGhlIFpvbmUgY2FuIGJlIHNwZWNpZmllZCBhcyBhIHNpbmdsZSBzdHJpbmcgZWcuXCI2ME5cIiB3aGljaFxuICogaXMgdGhlbiBicm9rZW4gZG93biBpbnRvIHRoZSBab25lTnVtYmVyIGFuZCBab25lTGV0dGVyLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gdXRtIEFuIG9iamVjdCBsaXRlcmFsIHdpdGggbm9ydGhpbmcsIGVhc3RpbmcsIHpvbmVOdW1iZXJcbiAqICAgICBhbmQgem9uZUxldHRlciBwcm9wZXJ0aWVzLiBJZiBhbiBvcHRpb25hbCBhY2N1cmFjeSBwcm9wZXJ0eSBpc1xuICogICAgIHByb3ZpZGVkIChpbiBtZXRlcnMpLCBhIGJvdW5kaW5nIGJveCB3aWxsIGJlIHJldHVybmVkIGluc3RlYWQgb2ZcbiAqICAgICBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlLlxuICogQHJldHVybiB7b2JqZWN0fSBBbiBvYmplY3QgbGl0ZXJhbCBjb250YWluaW5nIGVpdGhlciBsYXQgYW5kIGxvbiB2YWx1ZXNcbiAqICAgICAoaWYgbm8gYWNjdXJhY3kgd2FzIHByb3ZpZGVkKSwgb3IgdG9wLCByaWdodCwgYm90dG9tIGFuZCBsZWZ0IHZhbHVlc1xuICogICAgIGZvciB0aGUgYm91bmRpbmcgYm94IGNhbGN1bGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBwcm92aWRlZCBhY2N1cmFjeS5cbiAqICAgICBSZXR1cm5zIG51bGwgaWYgdGhlIGNvbnZlcnNpb24gZmFpbGVkLlxuICovXG5mdW5jdGlvbiBVVE10b0xMKHV0bSkge1xuXG4gIHZhciBVVE1Ob3J0aGluZyA9IHV0bS5ub3J0aGluZztcbiAgdmFyIFVUTUVhc3RpbmcgPSB1dG0uZWFzdGluZztcbiAgdmFyIHpvbmVMZXR0ZXIgPSB1dG0uem9uZUxldHRlcjtcbiAgdmFyIHpvbmVOdW1iZXIgPSB1dG0uem9uZU51bWJlcjtcbiAgLy8gY2hlY2sgdGhlIFpvbmVOdW1tYmVyIGlzIHZhbGlkXG4gIGlmICh6b25lTnVtYmVyIDwgMCB8fCB6b25lTnVtYmVyID4gNjApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBrMCA9IDAuOTk5NjtcbiAgdmFyIGEgPSA2Mzc4MTM3LjA7IC8vZWxsaXAucmFkaXVzO1xuICB2YXIgZWNjU3F1YXJlZCA9IDAuMDA2Njk0Mzg7IC8vZWxsaXAuZWNjc3E7XG4gIHZhciBlY2NQcmltZVNxdWFyZWQ7XG4gIHZhciBlMSA9ICgxIC0gTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkKSkgLyAoMSArIE1hdGguc3FydCgxIC0gZWNjU3F1YXJlZCkpO1xuICB2YXIgTjEsIFQxLCBDMSwgUjEsIEQsIE07XG4gIHZhciBMb25nT3JpZ2luO1xuICB2YXIgbXUsIHBoaTFSYWQ7XG5cbiAgLy8gcmVtb3ZlIDUwMCwwMDAgbWV0ZXIgb2Zmc2V0IGZvciBsb25naXR1ZGVcbiAgdmFyIHggPSBVVE1FYXN0aW5nIC0gNTAwMDAwLjA7XG4gIHZhciB5ID0gVVRNTm9ydGhpbmc7XG5cbiAgLy8gV2UgbXVzdCBrbm93IHNvbWVob3cgaWYgd2UgYXJlIGluIHRoZSBOb3J0aGVybiBvciBTb3V0aGVyblxuICAvLyBoZW1pc3BoZXJlLCB0aGlzIGlzIHRoZSBvbmx5IHRpbWUgd2UgdXNlIHRoZSBsZXR0ZXIgU28gZXZlblxuICAvLyBpZiB0aGUgWm9uZSBsZXR0ZXIgaXNuJ3QgZXhhY3RseSBjb3JyZWN0IGl0IHNob3VsZCBpbmRpY2F0ZVxuICAvLyB0aGUgaGVtaXNwaGVyZSBjb3JyZWN0bHlcbiAgaWYgKHpvbmVMZXR0ZXIgPCAnTicpIHtcbiAgICB5IC09IDEwMDAwMDAwLjA7IC8vIHJlbW92ZSAxMCwwMDAsMDAwIG1ldGVyIG9mZnNldCB1c2VkXG4gICAgLy8gZm9yIHNvdXRoZXJuIGhlbWlzcGhlcmVcbiAgfVxuXG4gIC8vIFRoZXJlIGFyZSA2MCB6b25lcyB3aXRoIHpvbmUgMSBiZWluZyBhdCBXZXN0IC0xODAgdG8gLTE3NFxuICBMb25nT3JpZ2luID0gKHpvbmVOdW1iZXIgLSAxKSAqIDYgLSAxODAgKyAzOyAvLyArMyBwdXRzIG9yaWdpblxuICAvLyBpbiBtaWRkbGUgb2ZcbiAgLy8gem9uZVxuXG4gIGVjY1ByaW1lU3F1YXJlZCA9IChlY2NTcXVhcmVkKSAvICgxIC0gZWNjU3F1YXJlZCk7XG5cbiAgTSA9IHkgLyBrMDtcbiAgbXUgPSBNIC8gKGEgKiAoMSAtIGVjY1NxdWFyZWQgLyA0IC0gMyAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gNjQgLSA1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMjU2KSk7XG5cbiAgcGhpMVJhZCA9IG11ICsgKDMgKiBlMSAvIDIgLSAyNyAqIGUxICogZTEgKiBlMSAvIDMyKSAqIE1hdGguc2luKDIgKiBtdSkgKyAoMjEgKiBlMSAqIGUxIC8gMTYgLSA1NSAqIGUxICogZTEgKiBlMSAqIGUxIC8gMzIpICogTWF0aC5zaW4oNCAqIG11KSArICgxNTEgKiBlMSAqIGUxICogZTEgLyA5NikgKiBNYXRoLnNpbig2ICogbXUpO1xuICAvLyBkb3VibGUgcGhpMSA9IFByb2pNYXRoLnJhZFRvRGVnKHBoaTFSYWQpO1xuXG4gIE4xID0gYSAvIE1hdGguc3FydCgxIC0gZWNjU3F1YXJlZCAqIE1hdGguc2luKHBoaTFSYWQpICogTWF0aC5zaW4ocGhpMVJhZCkpO1xuICBUMSA9IE1hdGgudGFuKHBoaTFSYWQpICogTWF0aC50YW4ocGhpMVJhZCk7XG4gIEMxID0gZWNjUHJpbWVTcXVhcmVkICogTWF0aC5jb3MocGhpMVJhZCkgKiBNYXRoLmNvcyhwaGkxUmFkKTtcbiAgUjEgPSBhICogKDEgLSBlY2NTcXVhcmVkKSAvIE1hdGgucG93KDEgLSBlY2NTcXVhcmVkICogTWF0aC5zaW4ocGhpMVJhZCkgKiBNYXRoLnNpbihwaGkxUmFkKSwgMS41KTtcbiAgRCA9IHggLyAoTjEgKiBrMCk7XG5cbiAgdmFyIGxhdCA9IHBoaTFSYWQgLSAoTjEgKiBNYXRoLnRhbihwaGkxUmFkKSAvIFIxKSAqIChEICogRCAvIDIgLSAoNSArIDMgKiBUMSArIDEwICogQzEgLSA0ICogQzEgKiBDMSAtIDkgKiBlY2NQcmltZVNxdWFyZWQpICogRCAqIEQgKiBEICogRCAvIDI0ICsgKDYxICsgOTAgKiBUMSArIDI5OCAqIEMxICsgNDUgKiBUMSAqIFQxIC0gMjUyICogZWNjUHJpbWVTcXVhcmVkIC0gMyAqIEMxICogQzEpICogRCAqIEQgKiBEICogRCAqIEQgKiBEIC8gNzIwKTtcbiAgbGF0ID0gcmFkVG9EZWcobGF0KTtcblxuICB2YXIgbG9uID0gKEQgLSAoMSArIDIgKiBUMSArIEMxKSAqIEQgKiBEICogRCAvIDYgKyAoNSAtIDIgKiBDMSArIDI4ICogVDEgLSAzICogQzEgKiBDMSArIDggKiBlY2NQcmltZVNxdWFyZWQgKyAyNCAqIFQxICogVDEpICogRCAqIEQgKiBEICogRCAqIEQgLyAxMjApIC8gTWF0aC5jb3MocGhpMVJhZCk7XG4gIGxvbiA9IExvbmdPcmlnaW4gKyByYWRUb0RlZyhsb24pO1xuXG4gIHZhciByZXN1bHQ7XG4gIGlmICh1dG0uYWNjdXJhY3kpIHtcbiAgICB2YXIgdG9wUmlnaHQgPSBVVE10b0xMKHtcbiAgICAgIG5vcnRoaW5nOiB1dG0ubm9ydGhpbmcgKyB1dG0uYWNjdXJhY3ksXG4gICAgICBlYXN0aW5nOiB1dG0uZWFzdGluZyArIHV0bS5hY2N1cmFjeSxcbiAgICAgIHpvbmVMZXR0ZXI6IHV0bS56b25lTGV0dGVyLFxuICAgICAgem9uZU51bWJlcjogdXRtLnpvbmVOdW1iZXJcbiAgICB9KTtcbiAgICByZXN1bHQgPSB7XG4gICAgICB0b3A6IHRvcFJpZ2h0LmxhdCxcbiAgICAgIHJpZ2h0OiB0b3BSaWdodC5sb24sXG4gICAgICBib3R0b206IGxhdCxcbiAgICAgIGxlZnQ6IGxvblxuICAgIH07XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0ge1xuICAgICAgbGF0OiBsYXQsXG4gICAgICBsb246IGxvblxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBNR1JTIGxldHRlciBkZXNpZ25hdG9yIGZvciB0aGUgZ2l2ZW4gbGF0aXR1ZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgVGhlIGxhdGl0dWRlIGluIFdHUzg0IHRvIGdldCB0aGUgbGV0dGVyIGRlc2lnbmF0b3JcbiAqICAgICBmb3IuXG4gKiBAcmV0dXJuIHtjaGFyfSBUaGUgbGV0dGVyIGRlc2lnbmF0b3IuXG4gKi9cbmZ1bmN0aW9uIGdldExldHRlckRlc2lnbmF0b3IobGF0KSB7XG4gIC8vVGhpcyBpcyBoZXJlIGFzIGFuIGVycm9yIGZsYWcgdG8gc2hvdyB0aGF0IHRoZSBMYXRpdHVkZSBpc1xuICAvL291dHNpZGUgTUdSUyBsaW1pdHNcbiAgdmFyIExldHRlckRlc2lnbmF0b3IgPSAnWic7XG5cbiAgaWYgKCg4NCA+PSBsYXQpICYmIChsYXQgPj0gNzIpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdYJztcbiAgfVxuICBlbHNlIGlmICgoNzIgPiBsYXQpICYmIChsYXQgPj0gNjQpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdXJztcbiAgfVxuICBlbHNlIGlmICgoNjQgPiBsYXQpICYmIChsYXQgPj0gNTYpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdWJztcbiAgfVxuICBlbHNlIGlmICgoNTYgPiBsYXQpICYmIChsYXQgPj0gNDgpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdVJztcbiAgfVxuICBlbHNlIGlmICgoNDggPiBsYXQpICYmIChsYXQgPj0gNDApKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdUJztcbiAgfVxuICBlbHNlIGlmICgoNDAgPiBsYXQpICYmIChsYXQgPj0gMzIpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdTJztcbiAgfVxuICBlbHNlIGlmICgoMzIgPiBsYXQpICYmIChsYXQgPj0gMjQpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdSJztcbiAgfVxuICBlbHNlIGlmICgoMjQgPiBsYXQpICYmIChsYXQgPj0gMTYpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdRJztcbiAgfVxuICBlbHNlIGlmICgoMTYgPiBsYXQpICYmIChsYXQgPj0gOCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1AnO1xuICB9XG4gIGVsc2UgaWYgKCg4ID4gbGF0KSAmJiAobGF0ID49IDApKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdOJztcbiAgfVxuICBlbHNlIGlmICgoMCA+IGxhdCkgJiYgKGxhdCA+PSAtOCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ00nO1xuICB9XG4gIGVsc2UgaWYgKCgtOCA+IGxhdCkgJiYgKGxhdCA+PSAtMTYpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdMJztcbiAgfVxuICBlbHNlIGlmICgoLTE2ID4gbGF0KSAmJiAobGF0ID49IC0yNCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0snO1xuICB9XG4gIGVsc2UgaWYgKCgtMjQgPiBsYXQpICYmIChsYXQgPj0gLTMyKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnSic7XG4gIH1cbiAgZWxzZSBpZiAoKC0zMiA+IGxhdCkgJiYgKGxhdCA+PSAtNDApKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdIJztcbiAgfVxuICBlbHNlIGlmICgoLTQwID4gbGF0KSAmJiAobGF0ID49IC00OCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0cnO1xuICB9XG4gIGVsc2UgaWYgKCgtNDggPiBsYXQpICYmIChsYXQgPj0gLTU2KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnRic7XG4gIH1cbiAgZWxzZSBpZiAoKC01NiA+IGxhdCkgJiYgKGxhdCA+PSAtNjQpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdFJztcbiAgfVxuICBlbHNlIGlmICgoLTY0ID4gbGF0KSAmJiAobGF0ID49IC03MikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0QnO1xuICB9XG4gIGVsc2UgaWYgKCgtNzIgPiBsYXQpICYmIChsYXQgPj0gLTgwKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnQyc7XG4gIH1cbiAgcmV0dXJuIExldHRlckRlc2lnbmF0b3I7XG59XG5cbi8qKlxuICogRW5jb2RlcyBhIFVUTSBsb2NhdGlvbiBhcyBNR1JTIHN0cmluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtvYmplY3R9IHV0bSBBbiBvYmplY3QgbGl0ZXJhbCB3aXRoIGVhc3RpbmcsIG5vcnRoaW5nLFxuICogICAgIHpvbmVMZXR0ZXIsIHpvbmVOdW1iZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBhY2N1cmFjeSBBY2N1cmFjeSBpbiBkaWdpdHMgKDEtNSkuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IE1HUlMgc3RyaW5nIGZvciB0aGUgZ2l2ZW4gVVRNIGxvY2F0aW9uLlxuICovXG5mdW5jdGlvbiBlbmNvZGUodXRtLCBhY2N1cmFjeSkge1xuICAvLyBwcmVwZW5kIHdpdGggbGVhZGluZyB6ZXJvZXNcbiAgdmFyIHNlYXN0aW5nID0gXCIwMDAwMFwiICsgdXRtLmVhc3RpbmcsXG4gICAgc25vcnRoaW5nID0gXCIwMDAwMFwiICsgdXRtLm5vcnRoaW5nO1xuXG4gIHJldHVybiB1dG0uem9uZU51bWJlciArIHV0bS56b25lTGV0dGVyICsgZ2V0MTAwa0lEKHV0bS5lYXN0aW5nLCB1dG0ubm9ydGhpbmcsIHV0bS56b25lTnVtYmVyKSArIHNlYXN0aW5nLnN1YnN0cihzZWFzdGluZy5sZW5ndGggLSA1LCBhY2N1cmFjeSkgKyBzbm9ydGhpbmcuc3Vic3RyKHNub3J0aGluZy5sZW5ndGggLSA1LCBhY2N1cmFjeSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSB0d28gbGV0dGVyIDEwMGsgZGVzaWduYXRvciBmb3IgYSBnaXZlbiBVVE0gZWFzdGluZyxcbiAqIG5vcnRoaW5nIGFuZCB6b25lIG51bWJlciB2YWx1ZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGVhc3RpbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSBub3J0aGluZ1xuICogQHBhcmFtIHtudW1iZXJ9IHpvbmVOdW1iZXJcbiAqIEByZXR1cm4gdGhlIHR3byBsZXR0ZXIgMTAwayBkZXNpZ25hdG9yIGZvciB0aGUgZ2l2ZW4gVVRNIGxvY2F0aW9uLlxuICovXG5mdW5jdGlvbiBnZXQxMDBrSUQoZWFzdGluZywgbm9ydGhpbmcsIHpvbmVOdW1iZXIpIHtcbiAgdmFyIHNldFBhcm0gPSBnZXQxMDBrU2V0Rm9yWm9uZSh6b25lTnVtYmVyKTtcbiAgdmFyIHNldENvbHVtbiA9IE1hdGguZmxvb3IoZWFzdGluZyAvIDEwMDAwMCk7XG4gIHZhciBzZXRSb3cgPSBNYXRoLmZsb29yKG5vcnRoaW5nIC8gMTAwMDAwKSAlIDIwO1xuICByZXR1cm4gZ2V0TGV0dGVyMTAwa0lEKHNldENvbHVtbiwgc2V0Um93LCBzZXRQYXJtKTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIFVUTSB6b25lIG51bWJlciwgZmlndXJlIG91dCB0aGUgTUdSUyAxMDBLIHNldCBpdCBpcyBpbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGkgQW4gVVRNIHpvbmUgbnVtYmVyLlxuICogQHJldHVybiB7bnVtYmVyfSB0aGUgMTAwayBzZXQgdGhlIFVUTSB6b25lIGlzIGluLlxuICovXG5mdW5jdGlvbiBnZXQxMDBrU2V0Rm9yWm9uZShpKSB7XG4gIHZhciBzZXRQYXJtID0gaSAlIE5VTV8xMDBLX1NFVFM7XG4gIGlmIChzZXRQYXJtID09PSAwKSB7XG4gICAgc2V0UGFybSA9IE5VTV8xMDBLX1NFVFM7XG4gIH1cblxuICByZXR1cm4gc2V0UGFybTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHR3by1sZXR0ZXIgTUdSUyAxMDBrIGRlc2lnbmF0b3IgZ2l2ZW4gaW5mb3JtYXRpb25cbiAqIHRyYW5zbGF0ZWQgZnJvbSB0aGUgVVRNIG5vcnRoaW5nLCBlYXN0aW5nIGFuZCB6b25lIG51bWJlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbiB0aGUgY29sdW1uIGluZGV4IGFzIGl0IHJlbGF0ZXMgdG8gdGhlIE1HUlNcbiAqICAgICAgICAxMDBrIHNldCBzcHJlYWRzaGVldCwgY3JlYXRlZCBmcm9tIHRoZSBVVE0gZWFzdGluZy5cbiAqICAgICAgICBWYWx1ZXMgYXJlIDEtOC5cbiAqIEBwYXJhbSB7bnVtYmVyfSByb3cgdGhlIHJvdyBpbmRleCBhcyBpdCByZWxhdGVzIHRvIHRoZSBNR1JTIDEwMGsgc2V0XG4gKiAgICAgICAgc3ByZWFkc2hlZXQsIGNyZWF0ZWQgZnJvbSB0aGUgVVRNIG5vcnRoaW5nIHZhbHVlLiBWYWx1ZXNcbiAqICAgICAgICBhcmUgZnJvbSAwLTE5LlxuICogQHBhcmFtIHtudW1iZXJ9IHBhcm0gdGhlIHNldCBibG9jaywgYXMgaXQgcmVsYXRlcyB0byB0aGUgTUdSUyAxMDBrIHNldFxuICogICAgICAgIHNwcmVhZHNoZWV0LCBjcmVhdGVkIGZyb20gdGhlIFVUTSB6b25lLiBWYWx1ZXMgYXJlIGZyb21cbiAqICAgICAgICAxLTYwLlxuICogQHJldHVybiB0d28gbGV0dGVyIE1HUlMgMTAwayBjb2RlLlxuICovXG5mdW5jdGlvbiBnZXRMZXR0ZXIxMDBrSUQoY29sdW1uLCByb3csIHBhcm0pIHtcbiAgLy8gY29sT3JpZ2luIGFuZCByb3dPcmlnaW4gYXJlIHRoZSBsZXR0ZXJzIGF0IHRoZSBvcmlnaW4gb2YgdGhlIHNldFxuICB2YXIgaW5kZXggPSBwYXJtIC0gMTtcbiAgdmFyIGNvbE9yaWdpbiA9IFNFVF9PUklHSU5fQ09MVU1OX0xFVFRFUlMuY2hhckNvZGVBdChpbmRleCk7XG4gIHZhciByb3dPcmlnaW4gPSBTRVRfT1JJR0lOX1JPV19MRVRURVJTLmNoYXJDb2RlQXQoaW5kZXgpO1xuXG4gIC8vIGNvbEludCBhbmQgcm93SW50IGFyZSB0aGUgbGV0dGVycyB0byBidWlsZCB0byByZXR1cm5cbiAgdmFyIGNvbEludCA9IGNvbE9yaWdpbiArIGNvbHVtbiAtIDE7XG4gIHZhciByb3dJbnQgPSByb3dPcmlnaW4gKyByb3c7XG4gIHZhciByb2xsb3ZlciA9IGZhbHNlO1xuXG4gIGlmIChjb2xJbnQgPiBaKSB7XG4gICAgY29sSW50ID0gY29sSW50IC0gWiArIEEgLSAxO1xuICAgIHJvbGxvdmVyID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChjb2xJbnQgPT09IEkgfHwgKGNvbE9yaWdpbiA8IEkgJiYgY29sSW50ID4gSSkgfHwgKChjb2xJbnQgPiBJIHx8IGNvbE9yaWdpbiA8IEkpICYmIHJvbGxvdmVyKSkge1xuICAgIGNvbEludCsrO1xuICB9XG5cbiAgaWYgKGNvbEludCA9PT0gTyB8fCAoY29sT3JpZ2luIDwgTyAmJiBjb2xJbnQgPiBPKSB8fCAoKGNvbEludCA+IE8gfHwgY29sT3JpZ2luIDwgTykgJiYgcm9sbG92ZXIpKSB7XG4gICAgY29sSW50Kys7XG5cbiAgICBpZiAoY29sSW50ID09PSBJKSB7XG4gICAgICBjb2xJbnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoY29sSW50ID4gWikge1xuICAgIGNvbEludCA9IGNvbEludCAtIFogKyBBIC0gMTtcbiAgfVxuXG4gIGlmIChyb3dJbnQgPiBWKSB7XG4gICAgcm93SW50ID0gcm93SW50IC0gViArIEEgLSAxO1xuICAgIHJvbGxvdmVyID0gdHJ1ZTtcbiAgfVxuICBlbHNlIHtcbiAgICByb2xsb3ZlciA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCgocm93SW50ID09PSBJKSB8fCAoKHJvd09yaWdpbiA8IEkpICYmIChyb3dJbnQgPiBJKSkpIHx8ICgoKHJvd0ludCA+IEkpIHx8IChyb3dPcmlnaW4gPCBJKSkgJiYgcm9sbG92ZXIpKSB7XG4gICAgcm93SW50Kys7XG4gIH1cblxuICBpZiAoKChyb3dJbnQgPT09IE8pIHx8ICgocm93T3JpZ2luIDwgTykgJiYgKHJvd0ludCA+IE8pKSkgfHwgKCgocm93SW50ID4gTykgfHwgKHJvd09yaWdpbiA8IE8pKSAmJiByb2xsb3ZlcikpIHtcbiAgICByb3dJbnQrKztcblxuICAgIGlmIChyb3dJbnQgPT09IEkpIHtcbiAgICAgIHJvd0ludCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChyb3dJbnQgPiBWKSB7XG4gICAgcm93SW50ID0gcm93SW50IC0gViArIEEgLSAxO1xuICB9XG5cbiAgdmFyIHR3b0xldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29sSW50KSArIFN0cmluZy5mcm9tQ2hhckNvZGUocm93SW50KTtcbiAgcmV0dXJuIHR3b0xldHRlcjtcbn1cblxuLyoqXG4gKiBEZWNvZGUgdGhlIFVUTSBwYXJhbWV0ZXJzIGZyb20gYSBNR1JTIHN0cmluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IG1ncnNTdHJpbmcgYW4gVVBQRVJDQVNFIGNvb3JkaW5hdGUgc3RyaW5nIGlzIGV4cGVjdGVkLlxuICogQHJldHVybiB7b2JqZWN0fSBBbiBvYmplY3QgbGl0ZXJhbCB3aXRoIGVhc3RpbmcsIG5vcnRoaW5nLCB6b25lTGV0dGVyLFxuICogICAgIHpvbmVOdW1iZXIgYW5kIGFjY3VyYWN5IChpbiBtZXRlcnMpIHByb3BlcnRpZXMuXG4gKi9cbmZ1bmN0aW9uIGRlY29kZShtZ3JzU3RyaW5nKSB7XG5cbiAgaWYgKG1ncnNTdHJpbmcgJiYgbWdyc1N0cmluZy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgY292ZXJ0aW5nIGZyb20gbm90aGluZ1wiKTtcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBtZ3JzU3RyaW5nLmxlbmd0aDtcblxuICB2YXIgaHVuSyA9IG51bGw7XG4gIHZhciBzYiA9IFwiXCI7XG4gIHZhciB0ZXN0Q2hhcjtcbiAgdmFyIGkgPSAwO1xuXG4gIC8vIGdldCBab25lIG51bWJlclxuICB3aGlsZSAoISgvW0EtWl0vKS50ZXN0KHRlc3RDaGFyID0gbWdyc1N0cmluZy5jaGFyQXQoaSkpKSB7XG4gICAgaWYgKGkgPj0gMikge1xuICAgICAgdGhyb3cgKFwiTUdSU1BvaW50IGJhZCBjb252ZXJzaW9uIGZyb206IFwiICsgbWdyc1N0cmluZyk7XG4gICAgfVxuICAgIHNiICs9IHRlc3RDaGFyO1xuICAgIGkrKztcbiAgfVxuXG4gIHZhciB6b25lTnVtYmVyID0gcGFyc2VJbnQoc2IsIDEwKTtcblxuICBpZiAoaSA9PT0gMCB8fCBpICsgMyA+IGxlbmd0aCkge1xuICAgIC8vIEEgZ29vZCBNR1JTIHN0cmluZyBoYXMgdG8gYmUgNC01IGRpZ2l0cyBsb25nLFxuICAgIC8vICMjQUFBLyNBQUEgYXQgbGVhc3QuXG4gICAgdGhyb3cgKFwiTUdSU1BvaW50IGJhZCBjb252ZXJzaW9uIGZyb206IFwiICsgbWdyc1N0cmluZyk7XG4gIH1cblxuICB2YXIgem9uZUxldHRlciA9IG1ncnNTdHJpbmcuY2hhckF0KGkrKyk7XG5cbiAgLy8gU2hvdWxkIHdlIGNoZWNrIHRoZSB6b25lIGxldHRlciBoZXJlPyBXaHkgbm90LlxuICBpZiAoem9uZUxldHRlciA8PSAnQScgfHwgem9uZUxldHRlciA9PT0gJ0InIHx8IHpvbmVMZXR0ZXIgPT09ICdZJyB8fCB6b25lTGV0dGVyID49ICdaJyB8fCB6b25lTGV0dGVyID09PSAnSScgfHwgem9uZUxldHRlciA9PT0gJ08nKSB7XG4gICAgdGhyb3cgKFwiTUdSU1BvaW50IHpvbmUgbGV0dGVyIFwiICsgem9uZUxldHRlciArIFwiIG5vdCBoYW5kbGVkOiBcIiArIG1ncnNTdHJpbmcpO1xuICB9XG5cbiAgaHVuSyA9IG1ncnNTdHJpbmcuc3Vic3RyaW5nKGksIGkgKz0gMik7XG5cbiAgdmFyIHNldCA9IGdldDEwMGtTZXRGb3Jab25lKHpvbmVOdW1iZXIpO1xuXG4gIHZhciBlYXN0MTAwayA9IGdldEVhc3RpbmdGcm9tQ2hhcihodW5LLmNoYXJBdCgwKSwgc2V0KTtcbiAgdmFyIG5vcnRoMTAwayA9IGdldE5vcnRoaW5nRnJvbUNoYXIoaHVuSy5jaGFyQXQoMSksIHNldCk7XG5cbiAgLy8gV2UgaGF2ZSBhIGJ1ZyB3aGVyZSB0aGUgbm9ydGhpbmcgbWF5IGJlIDIwMDAwMDAgdG9vIGxvdy5cbiAgLy8gSG93XG4gIC8vIGRvIHdlIGtub3cgd2hlbiB0byByb2xsIG92ZXI/XG5cbiAgd2hpbGUgKG5vcnRoMTAwayA8IGdldE1pbk5vcnRoaW5nKHpvbmVMZXR0ZXIpKSB7XG4gICAgbm9ydGgxMDBrICs9IDIwMDAwMDA7XG4gIH1cblxuICAvLyBjYWxjdWxhdGUgdGhlIGNoYXIgaW5kZXggZm9yIGVhc3Rpbmcvbm9ydGhpbmcgc2VwYXJhdG9yXG4gIHZhciByZW1haW5kZXIgPSBsZW5ndGggLSBpO1xuXG4gIGlmIChyZW1haW5kZXIgJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgKFwiTUdSU1BvaW50IGhhcyB0byBoYXZlIGFuIGV2ZW4gbnVtYmVyIFxcbm9mIGRpZ2l0cyBhZnRlciB0aGUgem9uZSBsZXR0ZXIgYW5kIHR3byAxMDBrbSBsZXR0ZXJzIC0gZnJvbnQgXFxuaGFsZiBmb3IgZWFzdGluZyBtZXRlcnMsIHNlY29uZCBoYWxmIGZvciBcXG5ub3J0aGluZyBtZXRlcnNcIiArIG1ncnNTdHJpbmcpO1xuICB9XG5cbiAgdmFyIHNlcCA9IHJlbWFpbmRlciAvIDI7XG5cbiAgdmFyIHNlcEVhc3RpbmcgPSAwLjA7XG4gIHZhciBzZXBOb3J0aGluZyA9IDAuMDtcbiAgdmFyIGFjY3VyYWN5Qm9udXMsIHNlcEVhc3RpbmdTdHJpbmcsIHNlcE5vcnRoaW5nU3RyaW5nLCBlYXN0aW5nLCBub3J0aGluZztcbiAgaWYgKHNlcCA+IDApIHtcbiAgICBhY2N1cmFjeUJvbnVzID0gMTAwMDAwLjAgLyBNYXRoLnBvdygxMCwgc2VwKTtcbiAgICBzZXBFYXN0aW5nU3RyaW5nID0gbWdyc1N0cmluZy5zdWJzdHJpbmcoaSwgaSArIHNlcCk7XG4gICAgc2VwRWFzdGluZyA9IHBhcnNlRmxvYXQoc2VwRWFzdGluZ1N0cmluZykgKiBhY2N1cmFjeUJvbnVzO1xuICAgIHNlcE5vcnRoaW5nU3RyaW5nID0gbWdyc1N0cmluZy5zdWJzdHJpbmcoaSArIHNlcCk7XG4gICAgc2VwTm9ydGhpbmcgPSBwYXJzZUZsb2F0KHNlcE5vcnRoaW5nU3RyaW5nKSAqIGFjY3VyYWN5Qm9udXM7XG4gIH1cblxuICBlYXN0aW5nID0gc2VwRWFzdGluZyArIGVhc3QxMDBrO1xuICBub3J0aGluZyA9IHNlcE5vcnRoaW5nICsgbm9ydGgxMDBrO1xuXG4gIHJldHVybiB7XG4gICAgZWFzdGluZzogZWFzdGluZyxcbiAgICBub3J0aGluZzogbm9ydGhpbmcsXG4gICAgem9uZUxldHRlcjogem9uZUxldHRlcixcbiAgICB6b25lTnVtYmVyOiB6b25lTnVtYmVyLFxuICAgIGFjY3VyYWN5OiBhY2N1cmFjeUJvbnVzXG4gIH07XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGZpcnN0IGxldHRlciBmcm9tIGEgdHdvLWxldHRlciBNR1JTIDEwMGsgem9uZSwgYW5kIGdpdmVuIHRoZVxuICogTUdSUyB0YWJsZSBzZXQgZm9yIHRoZSB6b25lIG51bWJlciwgZmlndXJlIG91dCB0aGUgZWFzdGluZyB2YWx1ZSB0aGF0XG4gKiBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIG90aGVyLCBzZWNvbmRhcnkgZWFzdGluZyB2YWx1ZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtjaGFyfSBlIFRoZSBmaXJzdCBsZXR0ZXIgZnJvbSBhIHR3by1sZXR0ZXIgTUdSUyAxMDDCtGsgem9uZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzZXQgVGhlIE1HUlMgdGFibGUgc2V0IGZvciB0aGUgem9uZSBudW1iZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBlYXN0aW5nIHZhbHVlIGZvciB0aGUgZ2l2ZW4gbGV0dGVyIGFuZCBzZXQuXG4gKi9cbmZ1bmN0aW9uIGdldEVhc3RpbmdGcm9tQ2hhcihlLCBzZXQpIHtcbiAgLy8gY29sT3JpZ2luIGlzIHRoZSBsZXR0ZXIgYXQgdGhlIG9yaWdpbiBvZiB0aGUgc2V0IGZvciB0aGVcbiAgLy8gY29sdW1uXG4gIHZhciBjdXJDb2wgPSBTRVRfT1JJR0lOX0NPTFVNTl9MRVRURVJTLmNoYXJDb2RlQXQoc2V0IC0gMSk7XG4gIHZhciBlYXN0aW5nVmFsdWUgPSAxMDAwMDAuMDtcbiAgdmFyIHJld2luZE1hcmtlciA9IGZhbHNlO1xuXG4gIHdoaWxlIChjdXJDb2wgIT09IGUuY2hhckNvZGVBdCgwKSkge1xuICAgIGN1ckNvbCsrO1xuICAgIGlmIChjdXJDb2wgPT09IEkpIHtcbiAgICAgIGN1ckNvbCsrO1xuICAgIH1cbiAgICBpZiAoY3VyQ29sID09PSBPKSB7XG4gICAgICBjdXJDb2wrKztcbiAgICB9XG4gICAgaWYgKGN1ckNvbCA+IFopIHtcbiAgICAgIGlmIChyZXdpbmRNYXJrZXIpIHtcbiAgICAgICAgdGhyb3cgKFwiQmFkIGNoYXJhY3RlcjogXCIgKyBlKTtcbiAgICAgIH1cbiAgICAgIGN1ckNvbCA9IEE7XG4gICAgICByZXdpbmRNYXJrZXIgPSB0cnVlO1xuICAgIH1cbiAgICBlYXN0aW5nVmFsdWUgKz0gMTAwMDAwLjA7XG4gIH1cblxuICByZXR1cm4gZWFzdGluZ1ZhbHVlO1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBzZWNvbmQgbGV0dGVyIGZyb20gYSB0d28tbGV0dGVyIE1HUlMgMTAwayB6b25lLCBhbmQgZ2l2ZW4gdGhlXG4gKiBNR1JTIHRhYmxlIHNldCBmb3IgdGhlIHpvbmUgbnVtYmVyLCBmaWd1cmUgb3V0IHRoZSBub3J0aGluZyB2YWx1ZSB0aGF0XG4gKiBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIG90aGVyLCBzZWNvbmRhcnkgbm9ydGhpbmcgdmFsdWUuIFlvdSBoYXZlIHRvXG4gKiByZW1lbWJlciB0aGF0IE5vcnRoaW5ncyBhcmUgZGV0ZXJtaW5lZCBmcm9tIHRoZSBlcXVhdG9yLCBhbmQgdGhlIHZlcnRpY2FsXG4gKiBjeWNsZSBvZiBsZXR0ZXJzIG1lYW4gYSAyMDAwMDAwIGFkZGl0aW9uYWwgbm9ydGhpbmcgbWV0ZXJzLiBUaGlzIGhhcHBlbnNcbiAqIGFwcHJveC4gZXZlcnkgMTggZGVncmVlcyBvZiBsYXRpdHVkZS4gVGhpcyBtZXRob2QgZG9lcyAqTk9UKiBjb3VudCBhbnlcbiAqIGFkZGl0aW9uYWwgbm9ydGhpbmdzLiBZb3UgaGF2ZSB0byBmaWd1cmUgb3V0IGhvdyBtYW55IDIwMDAwMDAgbWV0ZXJzIG5lZWRcbiAqIHRvIGJlIGFkZGVkIGZvciB0aGUgem9uZSBsZXR0ZXIgb2YgdGhlIE1HUlMgY29vcmRpbmF0ZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtjaGFyfSBuIFNlY29uZCBsZXR0ZXIgb2YgdGhlIE1HUlMgMTAwayB6b25lXG4gKiBAcGFyYW0ge251bWJlcn0gc2V0IFRoZSBNR1JTIHRhYmxlIHNldCBudW1iZXIsIHdoaWNoIGlzIGRlcGVuZGVudCBvbiB0aGVcbiAqICAgICBVVE0gem9uZSBudW1iZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBub3J0aGluZyB2YWx1ZSBmb3IgdGhlIGdpdmVuIGxldHRlciBhbmQgc2V0LlxuICovXG5mdW5jdGlvbiBnZXROb3J0aGluZ0Zyb21DaGFyKG4sIHNldCkge1xuXG4gIGlmIChuID4gJ1YnKSB7XG4gICAgdGhyb3cgKFwiTUdSU1BvaW50IGdpdmVuIGludmFsaWQgTm9ydGhpbmcgXCIgKyBuKTtcbiAgfVxuXG4gIC8vIHJvd09yaWdpbiBpcyB0aGUgbGV0dGVyIGF0IHRoZSBvcmlnaW4gb2YgdGhlIHNldCBmb3IgdGhlXG4gIC8vIGNvbHVtblxuICB2YXIgY3VyUm93ID0gU0VUX09SSUdJTl9ST1dfTEVUVEVSUy5jaGFyQ29kZUF0KHNldCAtIDEpO1xuICB2YXIgbm9ydGhpbmdWYWx1ZSA9IDAuMDtcbiAgdmFyIHJld2luZE1hcmtlciA9IGZhbHNlO1xuXG4gIHdoaWxlIChjdXJSb3cgIT09IG4uY2hhckNvZGVBdCgwKSkge1xuICAgIGN1clJvdysrO1xuICAgIGlmIChjdXJSb3cgPT09IEkpIHtcbiAgICAgIGN1clJvdysrO1xuICAgIH1cbiAgICBpZiAoY3VyUm93ID09PSBPKSB7XG4gICAgICBjdXJSb3crKztcbiAgICB9XG4gICAgLy8gZml4aW5nIGEgYnVnIG1ha2luZyB3aG9sZSBhcHBsaWNhdGlvbiBoYW5nIGluIHRoaXMgbG9vcFxuICAgIC8vIHdoZW4gJ24nIGlzIGEgd3JvbmcgY2hhcmFjdGVyXG4gICAgaWYgKGN1clJvdyA+IFYpIHtcbiAgICAgIGlmIChyZXdpbmRNYXJrZXIpIHsgLy8gbWFraW5nIHN1cmUgdGhhdCB0aGlzIGxvb3AgZW5kc1xuICAgICAgICB0aHJvdyAoXCJCYWQgY2hhcmFjdGVyOiBcIiArIG4pO1xuICAgICAgfVxuICAgICAgY3VyUm93ID0gQTtcbiAgICAgIHJld2luZE1hcmtlciA9IHRydWU7XG4gICAgfVxuICAgIG5vcnRoaW5nVmFsdWUgKz0gMTAwMDAwLjA7XG4gIH1cblxuICByZXR1cm4gbm9ydGhpbmdWYWx1ZTtcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gZ2V0TWluTm9ydGhpbmcgcmV0dXJucyB0aGUgbWluaW11bSBub3J0aGluZyB2YWx1ZSBvZiBhIE1HUlNcbiAqIHpvbmUuXG4gKlxuICogUG9ydGVkIGZyb20gR2VvdHJhbnMnIGMgTGF0dGl0dWRlX0JhbmRfVmFsdWUgc3RydWN0dXJlIHRhYmxlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2NoYXJ9IHpvbmVMZXR0ZXIgVGhlIE1HUlMgem9uZSB0byBnZXQgdGhlIG1pbiBub3J0aGluZyBmb3IuXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldE1pbk5vcnRoaW5nKHpvbmVMZXR0ZXIpIHtcbiAgdmFyIG5vcnRoaW5nO1xuICBzd2l0Y2ggKHpvbmVMZXR0ZXIpIHtcbiAgY2FzZSAnQyc6XG4gICAgbm9ydGhpbmcgPSAxMTAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0QnOlxuICAgIG5vcnRoaW5nID0gMjAwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdFJzpcbiAgICBub3J0aGluZyA9IDI4MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnRic6XG4gICAgbm9ydGhpbmcgPSAzNzAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0cnOlxuICAgIG5vcnRoaW5nID0gNDYwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdIJzpcbiAgICBub3J0aGluZyA9IDU1MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnSic6XG4gICAgbm9ydGhpbmcgPSA2NDAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0snOlxuICAgIG5vcnRoaW5nID0gNzMwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdMJzpcbiAgICBub3J0aGluZyA9IDgyMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnTSc6XG4gICAgbm9ydGhpbmcgPSA5MTAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ04nOlxuICAgIG5vcnRoaW5nID0gMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdQJzpcbiAgICBub3J0aGluZyA9IDgwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdRJzpcbiAgICBub3J0aGluZyA9IDE3MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnUic6XG4gICAgbm9ydGhpbmcgPSAyNjAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1MnOlxuICAgIG5vcnRoaW5nID0gMzUwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdUJzpcbiAgICBub3J0aGluZyA9IDQ0MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnVSc6XG4gICAgbm9ydGhpbmcgPSA1MzAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1YnOlxuICAgIG5vcnRoaW5nID0gNjIwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdXJzpcbiAgICBub3J0aGluZyA9IDcwMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnWCc6XG4gICAgbm9ydGhpbmcgPSA3OTAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGRlZmF1bHQ6XG4gICAgbm9ydGhpbmcgPSAtMS4wO1xuICB9XG4gIGlmIChub3J0aGluZyA+PSAwLjApIHtcbiAgICByZXR1cm4gbm9ydGhpbmc7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgKFwiSW52YWxpZCB6b25lIGxldHRlcjogXCIgKyB6b25lTGV0dGVyKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyB0b1BvaW50LCBmb3J3YXJkIH0gZnJvbSAnbWdycyc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdjMuMC4wIC0gdXNlIHByb2o0LnRvUG9pbnQgaW5zdGVhZFxuICogQHBhcmFtIHtudW1iZXIgfCBpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXMgfCBzdHJpbmd9IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeV1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbel1cbiAqL1xuZnVuY3Rpb24gUG9pbnQoeCwgeSwgeikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUG9pbnQpKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5LCB6KTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheSh4KSkge1xuICAgIHRoaXMueCA9IHhbMF07XG4gICAgdGhpcy55ID0geFsxXTtcbiAgICB0aGlzLnogPSB4WzJdIHx8IDAuMDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICB0aGlzLnggPSB4Lng7XG4gICAgdGhpcy55ID0geC55O1xuICAgIHRoaXMueiA9IHgueiB8fCAwLjA7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnICYmIHR5cGVvZiB5ID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBjb29yZHMgPSB4LnNwbGl0KCcsJyk7XG4gICAgdGhpcy54ID0gcGFyc2VGbG9hdChjb29yZHNbMF0pO1xuICAgIHRoaXMueSA9IHBhcnNlRmxvYXQoY29vcmRzWzFdKTtcbiAgICB0aGlzLnogPSBwYXJzZUZsb2F0KGNvb3Jkc1syXSkgfHwgMC4wO1xuICB9IGVsc2Uge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnogPSB6IHx8IDAuMDtcbiAgfVxuICBjb25zb2xlLndhcm4oJ3Byb2o0LlBvaW50IHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDMsIHVzZSBwcm9qNC50b1BvaW50Jyk7XG59XG5cblBvaW50LmZyb21NR1JTID0gZnVuY3Rpb24gKG1ncnNTdHIpIHtcbiAgcmV0dXJuIG5ldyBQb2ludCh0b1BvaW50KG1ncnNTdHIpKTtcbn07XG5Qb2ludC5wcm90b3R5cGUudG9NR1JTID0gZnVuY3Rpb24gKGFjY3VyYWN5KSB7XG4gIHJldHVybiBmb3J3YXJkKFt0aGlzLngsIHRoaXMueV0sIGFjY3VyYWN5KTtcbn07XG5leHBvcnQgZGVmYXVsdCBQb2ludDtcbiIsImltcG9ydCBwYXJzZUNvZGUgZnJvbSAnLi9wYXJzZUNvZGUnO1xuaW1wb3J0IGV4dGVuZCBmcm9tICcuL2V4dGVuZCc7XG5pbXBvcnQgcHJvamVjdGlvbnMgZnJvbSAnLi9wcm9qZWN0aW9ucyc7XG5pbXBvcnQgeyBzcGhlcmUgYXMgZGNfc3BoZXJlLCBlY2NlbnRyaWNpdHkgYXMgZGNfZWNjZW50cmljaXR5IH0gZnJvbSAnLi9kZXJpdmVDb25zdGFudHMnO1xuaW1wb3J0IERhdHVtIGZyb20gJy4vY29uc3RhbnRzL0RhdHVtJztcbmltcG9ydCBkYXR1bSBmcm9tICcuL2RhdHVtJztcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJztcbmltcG9ydCB7IGdldE5hZGdyaWRzIH0gZnJvbSAnLi9uYWRncmlkJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXR1bURlZmluaXRpb25cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkYXR1bV90eXBlIC0gVGhlIHR5cGUgb2YgZGF0dW0uXG4gKiBAcHJvcGVydHkge251bWJlcn0gYSAtIFNlbWktbWFqb3IgYXhpcyBvZiB0aGUgZWxsaXBzb2lkLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGIgLSBTZW1pLW1pbm9yIGF4aXMgb2YgdGhlIGVsbGlwc29pZC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlcyAtIEVjY2VudHJpY2l0eSBzcXVhcmVkIG9mIHRoZSBlbGxpcHNvaWQuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXAyIC0gU2Vjb25kIGVjY2VudHJpY2l0eSBzcXVhcmVkIG9mIHRoZSBlbGxpcHNvaWQuXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZyB8IGltcG9ydCgnLi9jb3JlJykuUFJPSkpTT05EZWZpbml0aW9uIHwgaW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gc3JzQ29kZVxuICogQHBhcmFtIHsoZXJyb3JNZXNzYWdlPzogc3RyaW5nLCBpbnN0YW5jZT86IFByb2plY3Rpb24pID0+IHZvaWR9IFtjYWxsYmFja11cbiAqL1xuZnVuY3Rpb24gUHJvamVjdGlvbihzcnNDb2RlLCBjYWxsYmFjaykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvamVjdGlvbikpIHtcbiAgICByZXR1cm4gbmV3IFByb2plY3Rpb24oc3JzQ29kZSk7XG4gIH1cbiAgLyoqIEB0eXBlIHs8VCBleHRlbmRzIGltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlcz4oY29vcmRpbmF0ZXM6IFQsIGVuZm9yY2VBeGlzPzogYm9vbGVhbikgPT4gVH0gKi9cbiAgdGhpcy5mb3J3YXJkID0gbnVsbDtcbiAgLyoqIEB0eXBlIHs8VCBleHRlbmRzIGltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlcz4oY29vcmRpbmF0ZXM6IFQsIGVuZm9yY2VBeGlzPzogYm9vbGVhbikgPT4gVH0gKi9cbiAgdGhpcy5pbnZlcnNlID0gbnVsbDtcbiAgLyoqIEB0eXBlIHtmdW5jdGlvbigpOiB2b2lkfSAqL1xuICB0aGlzLmluaXQgPSBudWxsO1xuICAvKiogQHR5cGUge3N0cmluZ30gKi9cbiAgdGhpcy5uYW1lO1xuICAvKiogQHR5cGUge0FycmF5PHN0cmluZz59ICovXG4gIHRoaXMubmFtZXMgPSBudWxsO1xuICAvKiogQHR5cGUge3N0cmluZ30gKi9cbiAgdGhpcy50aXRsZTtcbiAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcbiAgdmFyIGpzb24gPSBwYXJzZUNvZGUoc3JzQ29kZSk7XG4gIGlmICh0eXBlb2YganNvbiAhPT0gJ29iamVjdCcpIHtcbiAgICBjYWxsYmFjaygnQ291bGQgbm90IHBhcnNlIHRvIHZhbGlkIGpzb246ICcgKyBzcnNDb2RlKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG91clByb2ogPSBQcm9qZWN0aW9uLnByb2plY3Rpb25zLmdldChqc29uLnByb2pOYW1lKTtcbiAgaWYgKCFvdXJQcm9qKSB7XG4gICAgY2FsbGJhY2soJ0NvdWxkIG5vdCBnZXQgcHJvamVjdGlvbiBuYW1lIGZyb206ICcgKyBzcnNDb2RlKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGpzb24uZGF0dW1Db2RlICYmIGpzb24uZGF0dW1Db2RlICE9PSAnbm9uZScpIHtcbiAgICB2YXIgZGF0dW1EZWYgPSBtYXRjaChEYXR1bSwganNvbi5kYXR1bUNvZGUpO1xuICAgIGlmIChkYXR1bURlZikge1xuICAgICAganNvbi5kYXR1bV9wYXJhbXMgPSBqc29uLmRhdHVtX3BhcmFtcyB8fCAoZGF0dW1EZWYudG93Z3M4NCA/IGRhdHVtRGVmLnRvd2dzODQuc3BsaXQoJywnKSA6IG51bGwpO1xuICAgICAganNvbi5lbGxwcyA9IGRhdHVtRGVmLmVsbGlwc2U7XG4gICAgICBqc29uLmRhdHVtTmFtZSA9IGRhdHVtRGVmLmRhdHVtTmFtZSA/IGRhdHVtRGVmLmRhdHVtTmFtZSA6IGpzb24uZGF0dW1Db2RlO1xuICAgIH1cbiAgfVxuICBqc29uLmswID0ganNvbi5rMCB8fCAxLjA7XG4gIGpzb24uYXhpcyA9IGpzb24uYXhpcyB8fCAnZW51JztcbiAganNvbi5lbGxwcyA9IGpzb24uZWxscHMgfHwgJ3dnczg0JztcbiAganNvbi5sYXQxID0ganNvbi5sYXQxIHx8IGpzb24ubGF0MDsgLy8gTGFtYmVydF9Db25mb3JtYWxfQ29uaWNfMVNQLCBmb3IgZXhhbXBsZSwgbmVlZHMgdGhpc1xuXG4gIHZhciBzcGhlcmVfID0gZGNfc3BoZXJlKGpzb24uYSwganNvbi5iLCBqc29uLnJmLCBqc29uLmVsbHBzLCBqc29uLnNwaGVyZSk7XG4gIHZhciBlY2MgPSBkY19lY2NlbnRyaWNpdHkoc3BoZXJlXy5hLCBzcGhlcmVfLmIsIHNwaGVyZV8ucmYsIGpzb24uUl9BKTtcbiAgdmFyIG5hZGdyaWRzID0gZ2V0TmFkZ3JpZHMoanNvbi5uYWRncmlkcyk7XG4gIC8qKiBAdHlwZSB7RGF0dW1EZWZpbml0aW9ufSAqL1xuICB2YXIgZGF0dW1PYmogPSBqc29uLmRhdHVtIHx8IGRhdHVtKGpzb24uZGF0dW1Db2RlLCBqc29uLmRhdHVtX3BhcmFtcywgc3BoZXJlXy5hLCBzcGhlcmVfLmIsIGVjYy5lcywgZWNjLmVwMixcbiAgICBuYWRncmlkcyk7XG5cbiAgZXh0ZW5kKHRoaXMsIGpzb24pOyAvLyB0cmFuc2ZlciBldmVyeXRoaW5nIG92ZXIgZnJvbSB0aGUgcHJvamVjdGlvbiBiZWNhdXNlIHdlIGRvbid0IGtub3cgd2hhdCB3ZSdsbCBuZWVkXG4gIGV4dGVuZCh0aGlzLCBvdXJQcm9qKTsgLy8gdHJhbnNmZXIgYWxsIHRoZSBtZXRob2RzIGZyb20gdGhlIHByb2plY3Rpb25cblxuICAvLyBjb3B5IHRoZSA0IHRoaW5ncyBvdmVyIHdlIGNhbGN1bGF0ZWQgaW4gZGVyaXZlQ29uc3RhbnRzLnNwaGVyZVxuICB0aGlzLmEgPSBzcGhlcmVfLmE7XG4gIHRoaXMuYiA9IHNwaGVyZV8uYjtcbiAgdGhpcy5yZiA9IHNwaGVyZV8ucmY7XG4gIHRoaXMuc3BoZXJlID0gc3BoZXJlXy5zcGhlcmU7XG5cbiAgLy8gY29weSB0aGUgMyB0aGluZ3Mgd2UgY2FsY3VsYXRlZCBpbiBkZXJpdmVDb25zdGFudHMuZWNjZW50cmljaXR5XG4gIHRoaXMuZXMgPSBlY2MuZXM7XG4gIHRoaXMuZSA9IGVjYy5lO1xuICB0aGlzLmVwMiA9IGVjYy5lcDI7XG5cbiAgLy8gYWRkIGluIHRoZSBkYXR1bSBvYmplY3RcbiAgdGhpcy5kYXR1bSA9IGRhdHVtT2JqO1xuXG4gIC8vIGluaXQgdGhlIHByb2plY3Rpb25cbiAgaWYgKCdpbml0JyBpbiB0aGlzICYmIHR5cGVvZiB0aGlzLmluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIC8vIGxlZ2VjeSBjYWxsYmFjayBmcm9tIGJhY2sgaW4gdGhlIGRheSB3aGVuIGl0IHdlbnQgdG8gc3BhdGlhbHJlZmVyZW5jZS5vcmdcbiAgY2FsbGJhY2sobnVsbCwgdGhpcyk7XG59XG5Qcm9qZWN0aW9uLnByb2plY3Rpb25zID0gcHJvamVjdGlvbnM7XG5Qcm9qZWN0aW9uLnByb2plY3Rpb25zLnN0YXJ0KCk7XG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0aW9uO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGNycywgZGVub3JtLCBwb2ludCkge1xuICB2YXIgeGluID0gcG9pbnQueCxcbiAgICB5aW4gPSBwb2ludC55LFxuICAgIHppbiA9IHBvaW50LnogfHwgMC4wO1xuICB2YXIgdiwgdCwgaTtcbiAgLyoqIEB0eXBlIHtpbXBvcnQoXCIuL2NvcmVcIikuSW50ZXJmYWNlQ29vcmRpbmF0ZXN9ICovXG4gIHZhciBvdXQgPSB7fTtcbiAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGlmIChkZW5vcm0gJiYgaSA9PT0gMiAmJiBwb2ludC56ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgdiA9IHhpbjtcbiAgICAgIGlmICgnZXcnLmluZGV4T2YoY3JzLmF4aXNbaV0pICE9PSAtMSkge1xuICAgICAgICB0ID0gJ3gnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdCA9ICd5JztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGkgPT09IDEpIHtcbiAgICAgIHYgPSB5aW47XG4gICAgICBpZiAoJ25zJy5pbmRleE9mKGNycy5heGlzW2ldKSAhPT0gLTEpIHtcbiAgICAgICAgdCA9ICd5JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHQgPSAneCc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHYgPSB6aW47XG4gICAgICB0ID0gJ3onO1xuICAgIH1cbiAgICBzd2l0Y2ggKGNycy5heGlzW2ldKSB7XG4gICAgICBjYXNlICdlJzpcbiAgICAgICAgb3V0W3RdID0gdjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3JzpcbiAgICAgICAgb3V0W3RdID0gLXY7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbic6XG4gICAgICAgIG91dFt0XSA9IHY7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncyc6XG4gICAgICAgIG91dFt0XSA9IC12O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3UnOlxuICAgICAgICBpZiAocG9pbnRbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC56ID0gdjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2QnOlxuICAgICAgICBpZiAocG9pbnRbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC56ID0gLXY7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgLy8gY29uc29sZS5sb2coXCJFUlJPUjogdW5rbm93IGF4aXMgKFwiK2Nycy5heGlzW2ldK1wiKSAtIGNoZWNrIGRlZmluaXRpb24gb2YgXCIrY3JzLnByb2pOYW1lKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocG9pbnQpIHtcbiAgY2hlY2tDb29yZChwb2ludC54KTtcbiAgY2hlY2tDb29yZChwb2ludC55KTtcbn1cbmZ1bmN0aW9uIGNoZWNrQ29vcmQobnVtKSB7XG4gIGlmICh0eXBlb2YgTnVtYmVyLmlzRmluaXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShudW0pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nvb3JkaW5hdGVzIG11c3QgYmUgZmluaXRlIG51bWJlcnMnKTtcbiAgfVxuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgbnVtICE9PSBudW0gfHwgIWlzRmluaXRlKG51bSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb29yZGluYXRlcyBtdXN0IGJlIGZpbml0ZSBudW1iZXJzJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBzaWduIGZyb20gJy4vc2lnbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiAoTWF0aC5hYnMoeCkgPCBIQUxGX1BJKSA/IHggOiAoeCAtIChzaWduKHgpICogTWF0aC5QSSkpO1xufVxuIiwiaW1wb3J0IHsgVFdPX1BJLCBTUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBzaWduIGZyb20gJy4vc2lnbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4LCBza2lwQWRqdXN0KSB7XG4gIGlmIChza2lwQWRqdXN0KSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgcmV0dXJuIChNYXRoLmFicyh4KSA8PSBTUEkpID8geCA6ICh4IC0gKHNpZ24oeCkgKiBUV09fUEkpKTtcbn1cbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4vYWRqdXN0X2xvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh6b25lLCBsb24pIHtcbiAgaWYgKHpvbmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHpvbmUgPSBNYXRoLmZsb29yKChhZGp1c3RfbG9uKGxvbikgKyBNYXRoLlBJKSAqIDMwIC8gTWF0aC5QSSkgKyAxO1xuXG4gICAgaWYgKHpvbmUgPCAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2UgaWYgKHpvbmUgPiA2MCkge1xuICAgICAgcmV0dXJuIDYwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gem9uZTtcbn1cbiIsImltcG9ydCBoeXBvdCBmcm9tICcuL2h5cG90JztcbmltcG9ydCBsb2cxcHkgZnJvbSAnLi9sb2cxcHknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICB2YXIgeSA9IE1hdGguYWJzKHgpO1xuICB5ID0gbG9nMXB5KHkgKiAoMSArIHkgLyAoaHlwb3QoMSwgeSkgKyAxKSkpO1xuXG4gIHJldHVybiB4IDwgMCA/IC15IDogeTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIGlmIChNYXRoLmFicyh4KSA+IDEpIHtcbiAgICB4ID0gKHggPiAxKSA/IDEgOiAtMTtcbiAgfVxuICByZXR1cm4gTWF0aC5hc2luKHgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBwLCBhcmdfcikge1xuICB2YXIgciA9IDIgKiBNYXRoLmNvcyhhcmdfcik7XG4gIHZhciBpID0gcHAubGVuZ3RoIC0gMTtcbiAgdmFyIGhyMSA9IHBwW2ldO1xuICB2YXIgaHIyID0gMDtcbiAgdmFyIGhyO1xuXG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIGhyID0gLWhyMiArIHIgKiBocjEgKyBwcFtpXTtcbiAgICBocjIgPSBocjE7XG4gICAgaHIxID0gaHI7XG4gIH1cblxuICByZXR1cm4gTWF0aC5zaW4oYXJnX3IpICogaHI7XG59XG4iLCJpbXBvcnQgc2luaCBmcm9tICcuL3NpbmgnO1xuaW1wb3J0IGNvc2ggZnJvbSAnLi9jb3NoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBwLCBhcmdfciwgYXJnX2kpIHtcbiAgdmFyIHNpbl9hcmdfciA9IE1hdGguc2luKGFyZ19yKTtcbiAgdmFyIGNvc19hcmdfciA9IE1hdGguY29zKGFyZ19yKTtcbiAgdmFyIHNpbmhfYXJnX2kgPSBzaW5oKGFyZ19pKTtcbiAgdmFyIGNvc2hfYXJnX2kgPSBjb3NoKGFyZ19pKTtcbiAgdmFyIHIgPSAyICogY29zX2FyZ19yICogY29zaF9hcmdfaTtcbiAgdmFyIGkgPSAtMiAqIHNpbl9hcmdfciAqIHNpbmhfYXJnX2k7XG4gIHZhciBqID0gcHAubGVuZ3RoIC0gMTtcbiAgdmFyIGhyID0gcHBbal07XG4gIHZhciBoaTEgPSAwO1xuICB2YXIgaHIxID0gMDtcbiAgdmFyIGhpID0gMDtcbiAgdmFyIGhyMjtcbiAgdmFyIGhpMjtcblxuICB3aGlsZSAoLS1qID49IDApIHtcbiAgICBocjIgPSBocjE7XG4gICAgaGkyID0gaGkxO1xuICAgIGhyMSA9IGhyO1xuICAgIGhpMSA9IGhpO1xuICAgIGhyID0gLWhyMiArIHIgKiBocjEgLSBpICogaGkxICsgcHBbal07XG4gICAgaGkgPSAtaGkyICsgaSAqIGhyMSArIHIgKiBoaTE7XG4gIH1cblxuICByID0gc2luX2FyZ19yICogY29zaF9hcmdfaTtcbiAgaSA9IGNvc19hcmdfciAqIHNpbmhfYXJnX2k7XG5cbiAgcmV0dXJuIFtyICogaHIgLSBpICogaGksIHIgKiBoaSArIGkgKiBocl07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICB2YXIgciA9IE1hdGguZXhwKHgpO1xuICByID0gKHIgKyAxIC8gcikgLyAyO1xuICByZXR1cm4gcjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiAoMSAtIDAuMjUgKiB4ICogKDEgKyB4IC8gMTYgKiAoMyArIDEuMjUgKiB4KSkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuICgwLjM3NSAqIHggKiAoMSArIDAuMjUgKiB4ICogKDEgKyAwLjQ2ODc1ICogeCkpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiAoMC4wNTg1OTM3NSAqIHggKiB4ICogKDEgKyAwLjc1ICogeCkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuICh4ICogeCAqIHggKiAoMzUgLyAzMDcyKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYSwgZSwgc2lucGhpKSB7XG4gIHZhciB0ZW1wID0gZSAqIHNpbnBoaTtcbiAgcmV0dXJuIGEgLyBNYXRoLnNxcnQoMSAtIHRlbXAgKiB0ZW1wKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwcCwgQikge1xuICB2YXIgY29zXzJCID0gMiAqIE1hdGguY29zKDIgKiBCKTtcbiAgdmFyIGkgPSBwcC5sZW5ndGggLSAxO1xuICB2YXIgaDEgPSBwcFtpXTtcbiAgdmFyIGgyID0gMDtcbiAgdmFyIGg7XG5cbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgaCA9IC1oMiArIGNvc18yQiAqIGgxICsgcHBbaV07XG4gICAgaDIgPSBoMTtcbiAgICBoMSA9IGg7XG4gIH1cblxuICByZXR1cm4gKEIgKyBoICogTWF0aC5zaW4oMiAqIEIpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHggPSBNYXRoLmFicyh4KTtcbiAgeSA9IE1hdGguYWJzKHkpO1xuICB2YXIgYSA9IE1hdGgubWF4KHgsIHkpO1xuICB2YXIgYiA9IE1hdGgubWluKHgsIHkpIC8gKGEgPyBhIDogMSk7XG5cbiAgcmV0dXJuIGEgKiBNYXRoLnNxcnQoMSArIE1hdGgucG93KGIsIDIpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChtbCwgZTAsIGUxLCBlMiwgZTMpIHtcbiAgdmFyIHBoaTtcbiAgdmFyIGRwaGk7XG5cbiAgcGhpID0gbWwgLyBlMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNTsgaSsrKSB7XG4gICAgZHBoaSA9IChtbCAtIChlMCAqIHBoaSAtIGUxICogTWF0aC5zaW4oMiAqIHBoaSkgKyBlMiAqIE1hdGguc2luKDQgKiBwaGkpIC0gZTMgKiBNYXRoLnNpbig2ICogcGhpKSkpIC8gKGUwIC0gMiAqIGUxICogTWF0aC5jb3MoMiAqIHBoaSkgKyA0ICogZTIgKiBNYXRoLmNvcyg0ICogcGhpKSAtIDYgKiBlMyAqIE1hdGguY29zKDYgKiBwaGkpKTtcbiAgICBwaGkgKz0gZHBoaTtcbiAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gMC4wMDAwMDAwMDAxKSB7XG4gICAgICByZXR1cm4gcGhpO1xuICAgIH1cbiAgfVxuXG4gIC8vIC4ucmVwb3J0RXJyb3IoXCJJTUxGTi1DT05WOkxhdGl0dWRlIGZhaWxlZCB0byBjb252ZXJnZSBhZnRlciAxNSBpdGVyYXRpb25zXCIpO1xuICByZXR1cm4gTmFOO1xufVxuIiwiaW1wb3J0IHsgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZWNjZW50LCBxKSB7XG4gIHZhciB0ZW1wID0gMSAtICgxIC0gZWNjZW50ICogZWNjZW50KSAvICgyICogZWNjZW50KSAqIE1hdGgubG9nKCgxIC0gZWNjZW50KSAvICgxICsgZWNjZW50KSk7XG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhxKSAtIHRlbXApIDwgMS4wRS02KSB7XG4gICAgaWYgKHEgPCAwKSB7XG4gICAgICByZXR1cm4gKC0xICogSEFMRl9QSSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBIQUxGX1BJO1xuICAgIH1cbiAgfVxuICAvLyB2YXIgcGhpID0gMC41KiBxLygxLWVjY2VudCplY2NlbnQpO1xuICB2YXIgcGhpID0gTWF0aC5hc2luKDAuNSAqIHEpO1xuICB2YXIgZHBoaTtcbiAgdmFyIHNpbl9waGk7XG4gIHZhciBjb3NfcGhpO1xuICB2YXIgY29uO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDMwOyBpKyspIHtcbiAgICBzaW5fcGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICBjb3NfcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBjb24gPSBlY2NlbnQgKiBzaW5fcGhpO1xuICAgIGRwaGkgPSBNYXRoLnBvdygxIC0gY29uICogY29uLCAyKSAvICgyICogY29zX3BoaSkgKiAocSAvICgxIC0gZWNjZW50ICogZWNjZW50KSAtIHNpbl9waGkgLyAoMSAtIGNvbiAqIGNvbikgKyAwLjUgLyBlY2NlbnQgKiBNYXRoLmxvZygoMSAtIGNvbikgLyAoMSArIGNvbikpKTtcbiAgICBwaGkgKz0gZHBoaTtcbiAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gMC4wMDAwMDAwMDAxKSB7XG4gICAgICByZXR1cm4gcGhpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbnNvbGUubG9nKFwiSVFTRk4tQ09OVjpMYXRpdHVkZSBmYWlsZWQgdG8gY29udmVyZ2UgYWZ0ZXIgMzAgaXRlcmF0aW9uc1wiKTtcbiAgcmV0dXJuIE5hTjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHZhciB5ID0gMSArIHg7XG4gIHZhciB6ID0geSAtIDE7XG5cbiAgcmV0dXJuIHogPT09IDAgPyB4IDogeCAqIE1hdGgubG9nKHkpIC8gejtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlMCwgZTEsIGUyLCBlMywgcGhpKSB7XG4gIHJldHVybiAoZTAgKiBwaGkgLSBlMSAqIE1hdGguc2luKDIgKiBwaGkpICsgZTIgKiBNYXRoLnNpbig0ICogcGhpKSAtIGUzICogTWF0aC5zaW4oNiAqIHBoaSkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGVjY2VudCwgc2lucGhpLCBjb3NwaGkpIHtcbiAgdmFyIGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcbiAgcmV0dXJuIGNvc3BoaSAvIChNYXRoLnNxcnQoMSAtIGNvbiAqIGNvbikpO1xufVxuIiwiaW1wb3J0IHsgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZWNjZW50LCB0cykge1xuICB2YXIgZWNjbnRoID0gMC41ICogZWNjZW50O1xuICB2YXIgY29uLCBkcGhpO1xuICB2YXIgcGhpID0gSEFMRl9QSSAtIDIgKiBNYXRoLmF0YW4odHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8PSAxNTsgaSsrKSB7XG4gICAgY29uID0gZWNjZW50ICogTWF0aC5zaW4ocGhpKTtcbiAgICBkcGhpID0gSEFMRl9QSSAtIDIgKiBNYXRoLmF0YW4odHMgKiAoTWF0aC5wb3coKCgxIC0gY29uKSAvICgxICsgY29uKSksIGVjY250aCkpKSAtIHBoaTtcbiAgICBwaGkgKz0gZHBoaTtcbiAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gMC4wMDAwMDAwMDAxKSB7XG4gICAgICByZXR1cm4gcGhpO1xuICAgIH1cbiAgfVxuICAvLyBjb25zb2xlLmxvZyhcInBoaTJ6IGhhcyBOb0NvbnZlcmdlbmNlXCIpO1xuICByZXR1cm4gLTk5OTk7XG59XG4iLCJ2YXIgQzAwID0gMTtcbnZhciBDMDIgPSAwLjI1O1xudmFyIEMwNCA9IDAuMDQ2ODc1O1xudmFyIEMwNiA9IDAuMDE5NTMxMjU7XG52YXIgQzA4ID0gMC4wMTA2ODExNTIzNDM3NTtcbnZhciBDMjIgPSAwLjc1O1xudmFyIEM0NCA9IDAuNDY4NzU7XG52YXIgQzQ2ID0gMC4wMTMwMjA4MzMzMzMzMzMzMzMzMztcbnZhciBDNDggPSAwLjAwNzEyMDc2ODIyOTE2NjY2NjY2O1xudmFyIEM2NiA9IDAuMzY0NTgzMzMzMzMzMzMzMzMzMzM7XG52YXIgQzY4ID0gMC4wMDU2OTY2MTQ1ODMzMzMzMzMzMztcbnZhciBDODggPSAwLjMwNzYxNzE4NzU7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlcykge1xuICB2YXIgZW4gPSBbXTtcbiAgZW5bMF0gPSBDMDAgLSBlcyAqIChDMDIgKyBlcyAqIChDMDQgKyBlcyAqIChDMDYgKyBlcyAqIEMwOCkpKTtcbiAgZW5bMV0gPSBlcyAqIChDMjIgLSBlcyAqIChDMDQgKyBlcyAqIChDMDYgKyBlcyAqIEMwOCkpKTtcbiAgdmFyIHQgPSBlcyAqIGVzO1xuICBlblsyXSA9IHQgKiAoQzQ0IC0gZXMgKiAoQzQ2ICsgZXMgKiBDNDgpKTtcbiAgdCAqPSBlcztcbiAgZW5bM10gPSB0ICogKEM2NiAtIGVzICogQzY4KTtcbiAgZW5bNF0gPSB0ICogZXMgKiBDODg7XG4gIHJldHVybiBlbjtcbn1cbiIsImltcG9ydCBwal9tbGZuIGZyb20gJy4vcGpfbWxmbic7XG5pbXBvcnQgeyBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG52YXIgTUFYX0lURVIgPSAyMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFyZywgZXMsIGVuKSB7XG4gIHZhciBrID0gMSAvICgxIC0gZXMpO1xuICB2YXIgcGhpID0gYXJnO1xuICBmb3IgKHZhciBpID0gTUFYX0lURVI7IGk7IC0taSkgeyAvKiByYXJlbHkgZ29lcyBvdmVyIDIgaXRlcmF0aW9ucyAqL1xuICAgIHZhciBzID0gTWF0aC5zaW4ocGhpKTtcbiAgICB2YXIgdCA9IDEgLSBlcyAqIHMgKiBzO1xuICAgIC8vIHQgPSB0aGlzLnBqX21sZm4ocGhpLCBzLCBNYXRoLmNvcyhwaGkpLCBlbikgLSBhcmc7XG4gICAgLy8gcGhpIC09IHQgKiAodCAqIE1hdGguc3FydCh0KSkgKiBrO1xuICAgIHQgPSAocGpfbWxmbihwaGksIHMsIE1hdGguY29zKHBoaSksIGVuKSAtIGFyZykgKiAodCAqIE1hdGguc3FydCh0KSkgKiBrO1xuICAgIHBoaSAtPSB0O1xuICAgIGlmIChNYXRoLmFicyh0KSA8IEVQU0xOKSB7XG4gICAgICByZXR1cm4gcGhpO1xuICAgIH1cbiAgfVxuICAvLyAuLnJlcG9ydEVycm9yKFwiY2Fzczpwal9pbnZfbWxmbjogQ29udmVyZ2VuY2UgZXJyb3JcIik7XG4gIHJldHVybiBwaGk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGhpLCBzcGhpLCBjcGhpLCBlbikge1xuICBjcGhpICo9IHNwaGk7XG4gIHNwaGkgKj0gc3BoaTtcbiAgcmV0dXJuIChlblswXSAqIHBoaSAtIGNwaGkgKiAoZW5bMV0gKyBzcGhpICogKGVuWzJdICsgc3BoaSAqIChlblszXSArIHNwaGkgKiBlbls0XSkpKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZWNjZW50LCBzaW5waGkpIHtcbiAgdmFyIGNvbjtcbiAgaWYgKGVjY2VudCA+IDEuMGUtNykge1xuICAgIGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcbiAgICByZXR1cm4gKCgxIC0gZWNjZW50ICogZWNjZW50KSAqIChzaW5waGkgLyAoMSAtIGNvbiAqIGNvbikgLSAoMC41IC8gZWNjZW50KSAqIE1hdGgubG9nKCgxIC0gY29uKSAvICgxICsgY29uKSkpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKDIgKiBzaW5waGkpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4geCA8IDAgPyAtMSA6IDE7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICB2YXIgciA9IE1hdGguZXhwKHgpO1xuICByID0gKHIgLSAxIC8gcikgLyAyO1xuICByZXR1cm4gcjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlc2lucCwgZXhwKSB7XG4gIHJldHVybiAoTWF0aC5wb3coKDEgLSBlc2lucCkgLyAoMSArIGVzaW5wKSwgZXhwKSk7XG59XG4iLCIvKipcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gYXJyYXlcbiAqIEByZXR1cm5zIHtpbXBvcnQoXCIuLi9jb3JlXCIpLkludGVyZmFjZUNvb3JkaW5hdGVzfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgdmFyIG91dCA9IHtcbiAgICB4OiBhcnJheVswXSxcbiAgICB5OiBhcnJheVsxXVxuICB9O1xuICBpZiAoYXJyYXkubGVuZ3RoID4gMikge1xuICAgIG91dC56ID0gYXJyYXlbMl07XG4gIH1cbiAgaWYgKGFycmF5Lmxlbmd0aCA+IDMpIHtcbiAgICBvdXQubSA9IGFycmF5WzNdO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCJpbXBvcnQgeyBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlY2NlbnQsIHBoaSwgc2lucGhpKSB7XG4gIHZhciBjb24gPSBlY2NlbnQgKiBzaW5waGk7XG4gIHZhciBjb20gPSAwLjUgKiBlY2NlbnQ7XG4gIGNvbiA9IE1hdGgucG93KCgoMSAtIGNvbikgLyAoMSArIGNvbikpLCBjb20pO1xuICByZXR1cm4gKE1hdGgudGFuKDAuNSAqIChIQUxGX1BJIC0gcGhpKSkgLyBjb24pO1xufVxuIiwiLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBpbnZlcnNlIGdlb2Rlc2ljIHByb2JsZW0gdXNpbmcgVmluY2VudHkncyBmb3JtdWxhZS5cbiAqIENvbXB1dGVzIHRoZSBmb3J3YXJkIGF6aW11dGggYW5kIGVsbGlwc29pZGFsIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuICogc3BlY2lmaWVkIGJ5IGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgb24gdGhlIHN1cmZhY2Ugb2YgYW4gZWxsaXBzb2lkLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBsYXQxIExhdGl0dWRlIG9mIHRoZSBmaXJzdCBwb2ludCBpbiByYWRpYW5zLlxuICogQHBhcmFtIHtudW1iZXJ9IGxvbjEgTG9uZ2l0dWRlIG9mIHRoZSBmaXJzdCBwb2ludCBpbiByYWRpYW5zLlxuICogQHBhcmFtIHtudW1iZXJ9IGxhdDIgTGF0aXR1ZGUgb2YgdGhlIHNlY29uZCBwb2ludCBpbiByYWRpYW5zLlxuICogQHBhcmFtIHtudW1iZXJ9IGxvbjIgTG9uZ2l0dWRlIG9mIHRoZSBzZWNvbmQgcG9pbnQgaW4gcmFkaWFucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhIFNlbWktbWFqb3IgYXhpcyBvZiB0aGUgZWxsaXBzb2lkIChtZXRlcnMpLlxuICogQHBhcmFtIHtudW1iZXJ9IGYgRmxhdHRlbmluZyBvZiB0aGUgZWxsaXBzb2lkLlxuICogQHJldHVybnMge3sgYXppMTogbnVtYmVyLCBzMTI6IG51bWJlciB9fSBBbiBvYmplY3QgY29udGFpbmluZzpcbiAqICAgLSBhemkxOiBGb3J3YXJkIGF6aW11dGggZnJvbSB0aGUgZmlyc3QgcG9pbnQgdG8gdGhlIHNlY29uZCBwb2ludCAocmFkaWFucykuXG4gKiAgIC0gczEyOiBFbGxpcHNvaWRhbCBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzIChtZXRlcnMpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdmluY2VudHlJbnZlcnNlKGxhdDEsIGxvbjEsIGxhdDIsIGxvbjIsIGEsIGYpIHtcbiAgY29uc3QgTCA9IGxvbjIgLSBsb24xO1xuICBjb25zdCBVMSA9IE1hdGguYXRhbigoMSAtIGYpICogTWF0aC50YW4obGF0MSkpO1xuICBjb25zdCBVMiA9IE1hdGguYXRhbigoMSAtIGYpICogTWF0aC50YW4obGF0MikpO1xuICBjb25zdCBzaW5VMSA9IE1hdGguc2luKFUxKSwgY29zVTEgPSBNYXRoLmNvcyhVMSk7XG4gIGNvbnN0IHNpblUyID0gTWF0aC5zaW4oVTIpLCBjb3NVMiA9IE1hdGguY29zKFUyKTtcblxuICBsZXQgbGFtYmRhID0gTCwgbGFtYmRhUCwgaXRlckxpbWl0ID0gMTAwO1xuICBsZXQgc2luTGFtYmRhLCBjb3NMYW1iZGEsIHNpblNpZ21hLCBjb3NTaWdtYSwgc2lnbWEsIHNpbkFscGhhLCBjb3MyQWxwaGEsIGNvczJTaWdtYU0sIEM7XG4gIGxldCB1U3EsIEEsIEIsIGRlbHRhU2lnbWEsIHM7XG5cbiAgZG8ge1xuICAgIHNpbkxhbWJkYSA9IE1hdGguc2luKGxhbWJkYSk7XG4gICAgY29zTGFtYmRhID0gTWF0aC5jb3MobGFtYmRhKTtcbiAgICBzaW5TaWdtYSA9IE1hdGguc3FydChcbiAgICAgIChjb3NVMiAqIHNpbkxhbWJkYSkgKiAoY29zVTIgKiBzaW5MYW1iZGEpXG4gICAgICArIChjb3NVMSAqIHNpblUyIC0gc2luVTEgKiBjb3NVMiAqIGNvc0xhbWJkYSlcbiAgICAgICogKGNvc1UxICogc2luVTIgLSBzaW5VMSAqIGNvc1UyICogY29zTGFtYmRhKVxuICAgICk7XG4gICAgaWYgKHNpblNpZ21hID09PSAwKSB7XG4gICAgICByZXR1cm4geyBhemkxOiAwLCBzMTI6IDAgfTsgLy8gY29pbmNpZGVudCBwb2ludHNcbiAgICB9XG4gICAgY29zU2lnbWEgPSBzaW5VMSAqIHNpblUyICsgY29zVTEgKiBjb3NVMiAqIGNvc0xhbWJkYTtcbiAgICBzaWdtYSA9IE1hdGguYXRhbjIoc2luU2lnbWEsIGNvc1NpZ21hKTtcbiAgICBzaW5BbHBoYSA9IGNvc1UxICogY29zVTIgKiBzaW5MYW1iZGEgLyBzaW5TaWdtYTtcbiAgICBjb3MyQWxwaGEgPSAxIC0gc2luQWxwaGEgKiBzaW5BbHBoYTtcbiAgICBjb3MyU2lnbWFNID0gKGNvczJBbHBoYSAhPT0gMCkgPyAoY29zU2lnbWEgLSAyICogc2luVTEgKiBzaW5VMiAvIGNvczJBbHBoYSkgOiAwO1xuICAgIEMgPSBmIC8gMTYgKiBjb3MyQWxwaGEgKiAoNCArIGYgKiAoNCAtIDMgKiBjb3MyQWxwaGEpKTtcbiAgICBsYW1iZGFQID0gbGFtYmRhO1xuICAgIGxhbWJkYSA9IEwgKyAoMSAtIEMpICogZiAqIHNpbkFscGhhXG4gICAgKiAoc2lnbWEgKyBDICogc2luU2lnbWEgKiAoY29zMlNpZ21hTSArIEMgKiBjb3NTaWdtYSAqICgtMSArIDIgKiBjb3MyU2lnbWFNICogY29zMlNpZ21hTSkpKTtcbiAgfSB3aGlsZSAoTWF0aC5hYnMobGFtYmRhIC0gbGFtYmRhUCkgPiAxZS0xMiAmJiAtLWl0ZXJMaW1pdCA+IDApO1xuXG4gIGlmIChpdGVyTGltaXQgPT09IDApIHtcbiAgICByZXR1cm4geyBhemkxOiBOYU4sIHMxMjogTmFOIH07IC8vIGZvcm11bGEgZmFpbGVkIHRvIGNvbnZlcmdlXG4gIH1cblxuICB1U3EgPSBjb3MyQWxwaGEgKiAoYSAqIGEgLSAoYSAqICgxIC0gZikpICogKGEgKiAoMSAtIGYpKSkgLyAoKGEgKiAoMSAtIGYpKSAqIChhICogKDEgLSBmKSkpO1xuICBBID0gMSArIHVTcSAvIDE2Mzg0ICogKDQwOTYgKyB1U3EgKiAoLTc2OCArIHVTcSAqICgzMjAgLSAxNzUgKiB1U3EpKSk7XG4gIEIgPSB1U3EgLyAxMDI0ICogKDI1NiArIHVTcSAqICgtMTI4ICsgdVNxICogKDc0IC0gNDcgKiB1U3EpKSk7XG4gIGRlbHRhU2lnbWEgPSBCICogc2luU2lnbWEgKiAoY29zMlNpZ21hTSArIEIgLyA0ICogKGNvc1NpZ21hICogKC0xICsgMiAqIGNvczJTaWdtYU0gKiBjb3MyU2lnbWFNKVxuICAgIC0gQiAvIDYgKiBjb3MyU2lnbWFNICogKC0zICsgNCAqIHNpblNpZ21hICogc2luU2lnbWEpICogKC0zICsgNCAqIGNvczJTaWdtYU0gKiBjb3MyU2lnbWFNKSkpO1xuXG4gIHMgPSAoYSAqICgxIC0gZikpICogQSAqIChzaWdtYSAtIGRlbHRhU2lnbWEpO1xuXG4gIC8vIEZvcndhcmQgYXppbXV0aFxuICBjb25zdCBhemkxID0gTWF0aC5hdGFuMihjb3NVMiAqIHNpbkxhbWJkYSwgY29zVTEgKiBzaW5VMiAtIHNpblUxICogY29zVTIgKiBjb3NMYW1iZGEpO1xuXG4gIHJldHVybiB7IGF6aTEsIHMxMjogcyB9O1xufVxuXG4vKipcbiAqIFNvbHZlcyB0aGUgZGlyZWN0IGdlb2RldGljIHByb2JsZW0gdXNpbmcgVmluY2VudHkncyBmb3JtdWxhZS5cbiAqIEdpdmVuIGEgc3RhcnRpbmcgcG9pbnQsIGluaXRpYWwgYXppbXV0aCwgYW5kIGRpc3RhbmNlLCBjb21wdXRlcyB0aGUgZGVzdGluYXRpb24gcG9pbnQgb24gdGhlIGVsbGlwc29pZC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbGF0MSBMYXRpdHVkZSBvZiB0aGUgc3RhcnRpbmcgcG9pbnQgaW4gcmFkaWFucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsb24xIExvbmdpdHVkZSBvZiB0aGUgc3RhcnRpbmcgcG9pbnQgaW4gcmFkaWFucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhemkxIEluaXRpYWwgYXppbXV0aCAoZm9yd2FyZCBhemltdXRoKSBpbiByYWRpYW5zLlxuICogQHBhcmFtIHtudW1iZXJ9IHMxMiBEaXN0YW5jZSB0byB0cmF2ZWwgZnJvbSB0aGUgc3RhcnRpbmcgcG9pbnQgaW4gbWV0ZXJzLlxuICogQHBhcmFtIHtudW1iZXJ9IGEgU2VtaS1tYWpvciBheGlzIG9mIHRoZSBlbGxpcHNvaWQgaW4gbWV0ZXJzLlxuICogQHBhcmFtIHtudW1iZXJ9IGYgRmxhdHRlbmluZyBvZiB0aGUgZWxsaXBzb2lkLlxuICogQHJldHVybnMge3tsYXQyOiBudW1iZXIsIGxvbjI6IG51bWJlcn19IFRoZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIChpbiByYWRpYW5zKSBvZiB0aGUgZGVzdGluYXRpb24gcG9pbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2aW5jZW50eURpcmVjdChsYXQxLCBsb24xLCBhemkxLCBzMTIsIGEsIGYpIHtcbiAgY29uc3QgVTEgPSBNYXRoLmF0YW4oKDEgLSBmKSAqIE1hdGgudGFuKGxhdDEpKTtcbiAgY29uc3Qgc2luVTEgPSBNYXRoLnNpbihVMSksIGNvc1UxID0gTWF0aC5jb3MoVTEpO1xuICBjb25zdCBzaW5BbHBoYTEgPSBNYXRoLnNpbihhemkxKSwgY29zQWxwaGExID0gTWF0aC5jb3MoYXppMSk7XG5cbiAgY29uc3Qgc2lnbWExID0gTWF0aC5hdGFuMihzaW5VMSwgY29zVTEgKiBjb3NBbHBoYTEpO1xuICBjb25zdCBzaW5BbHBoYSA9IGNvc1UxICogc2luQWxwaGExO1xuICBjb25zdCBjb3MyQWxwaGEgPSAxIC0gc2luQWxwaGEgKiBzaW5BbHBoYTtcbiAgY29uc3QgdVNxID0gY29zMkFscGhhICogKGEgKiBhIC0gKGEgKiAoMSAtIGYpKSAqIChhICogKDEgLSBmKSkpIC8gKChhICogKDEgLSBmKSkgKiAoYSAqICgxIC0gZikpKTtcbiAgY29uc3QgQSA9IDEgKyB1U3EgLyAxNjM4NCAqICg0MDk2ICsgdVNxICogKC03NjggKyB1U3EgKiAoMzIwIC0gMTc1ICogdVNxKSkpO1xuICBjb25zdCBCID0gdVNxIC8gMTAyNCAqICgyNTYgKyB1U3EgKiAoLTEyOCArIHVTcSAqICg3NCAtIDQ3ICogdVNxKSkpO1xuXG4gIGxldCBzaWdtYSA9IHMxMiAvICgoYSAqICgxIC0gZikpICogQSksIHNpZ21hUCwgaXRlckxpbWl0ID0gMTAwO1xuICBsZXQgY29zMlNpZ21hTSwgc2luU2lnbWEsIGNvc1NpZ21hLCBkZWx0YVNpZ21hO1xuXG4gIGRvIHtcbiAgICBjb3MyU2lnbWFNID0gTWF0aC5jb3MoMiAqIHNpZ21hMSArIHNpZ21hKTtcbiAgICBzaW5TaWdtYSA9IE1hdGguc2luKHNpZ21hKTtcbiAgICBjb3NTaWdtYSA9IE1hdGguY29zKHNpZ21hKTtcbiAgICBkZWx0YVNpZ21hID0gQiAqIHNpblNpZ21hICogKGNvczJTaWdtYU0gKyBCIC8gNCAqIChjb3NTaWdtYSAqICgtMSArIDIgKiBjb3MyU2lnbWFNICogY29zMlNpZ21hTSlcbiAgICAgIC0gQiAvIDYgKiBjb3MyU2lnbWFNICogKC0zICsgNCAqIHNpblNpZ21hICogc2luU2lnbWEpICogKC0zICsgNCAqIGNvczJTaWdtYU0gKiBjb3MyU2lnbWFNKSkpO1xuICAgIHNpZ21hUCA9IHNpZ21hO1xuICAgIHNpZ21hID0gczEyIC8gKChhICogKDEgLSBmKSkgKiBBKSArIGRlbHRhU2lnbWE7XG4gIH0gd2hpbGUgKE1hdGguYWJzKHNpZ21hIC0gc2lnbWFQKSA+IDFlLTEyICYmIC0taXRlckxpbWl0ID4gMCk7XG5cbiAgaWYgKGl0ZXJMaW1pdCA9PT0gMCkge1xuICAgIHJldHVybiB7IGxhdDI6IE5hTiwgbG9uMjogTmFOIH07XG4gIH1cblxuICBjb25zdCB0bXAgPSBzaW5VMSAqIHNpblNpZ21hIC0gY29zVTEgKiBjb3NTaWdtYSAqIGNvc0FscGhhMTtcbiAgY29uc3QgbGF0MiA9IE1hdGguYXRhbjIoXG4gICAgc2luVTEgKiBjb3NTaWdtYSArIGNvc1UxICogc2luU2lnbWEgKiBjb3NBbHBoYTEsXG4gICAgKDEgLSBmKSAqIE1hdGguc3FydChzaW5BbHBoYSAqIHNpbkFscGhhICsgdG1wICogdG1wKVxuICApO1xuICBjb25zdCBsYW1iZGEgPSBNYXRoLmF0YW4yKFxuICAgIHNpblNpZ21hICogc2luQWxwaGExLFxuICAgIGNvc1UxICogY29zU2lnbWEgLSBzaW5VMSAqIHNpblNpZ21hICogY29zQWxwaGExXG4gICk7XG4gIGNvbnN0IEMgPSBmIC8gMTYgKiBjb3MyQWxwaGEgKiAoNCArIGYgKiAoNCAtIDMgKiBjb3MyQWxwaGEpKTtcbiAgY29uc3QgTCA9IGxhbWJkYSAtICgxIC0gQykgKiBmICogc2luQWxwaGFcbiAgICAqIChzaWdtYSArIEMgKiBzaW5TaWdtYSAqIChjb3MyU2lnbWFNICsgQyAqIGNvc1NpZ21hICogKC0xICsgMiAqIGNvczJTaWdtYU0gKiBjb3MyU2lnbWFNKSkpO1xuICBjb25zdCBsb24yID0gbG9uMSArIEw7XG5cbiAgcmV0dXJuIHsgbGF0MiwgbG9uMiB9O1xufVxuIiwidmFyIGRhdHVtcyA9IHtcbiAgd2dzODQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnLFxuICAgIGVsbGlwc2U6ICdXR1M4NCcsXG4gICAgZGF0dW1OYW1lOiAnV0dTODQnXG4gIH0sXG4gIGNoMTkwMzoge1xuICAgIHRvd2dzODQ6ICc2NzQuMzc0LDE1LjA1Niw0MDUuMzQ2JyxcbiAgICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgICBkYXR1bU5hbWU6ICdzd2lzcydcbiAgfSxcbiAgZ2dyczg3OiB7XG4gICAgdG93Z3M4NDogJy0xOTkuODcsNzQuNzksMjQ2LjYyJyxcbiAgICBlbGxpcHNlOiAnR1JTODAnLFxuICAgIGRhdHVtTmFtZTogJ0dyZWVrX0dlb2RldGljX1JlZmVyZW5jZV9TeXN0ZW1fMTk4NydcbiAgfSxcbiAgbmFkODM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnLFxuICAgIGVsbGlwc2U6ICdHUlM4MCcsXG4gICAgZGF0dW1OYW1lOiAnTm9ydGhfQW1lcmljYW5fRGF0dW1fMTk4MydcbiAgfSxcbiAgbmFkMjc6IHtcbiAgICBuYWRncmlkczogJ0Bjb251cyxAYWxhc2thLEBudHYyXzAuZ3NiLEBudHYxX2Nhbi5kYXQnLFxuICAgIGVsbGlwc2U6ICdjbHJrNjYnLFxuICAgIGRhdHVtTmFtZTogJ05vcnRoX0FtZXJpY2FuX0RhdHVtXzE5MjcnXG4gIH0sXG4gIHBvdHNkYW06IHtcbiAgICB0b3dnczg0OiAnNTk4LjEsNzMuNyw0MTguMiwwLjIwMiwwLjA0NSwtMi40NTUsNi43JyxcbiAgICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgICBkYXR1bU5hbWU6ICdQb3RzZGFtIFJhdWVuYmVyZyAxOTUwIERIRE4nXG4gIH0sXG4gIGNhcnRoYWdlOiB7XG4gICAgdG93Z3M4NDogJy0yNjMuMCw2LjAsNDMxLjAnLFxuICAgIGVsbGlwc2U6ICdjbGFyazgwJyxcbiAgICBkYXR1bU5hbWU6ICdDYXJ0aGFnZSAxOTM0IFR1bmlzaWEnXG4gIH0sXG4gIGhlcm1hbm5za29nZWw6IHtcbiAgICB0b3dnczg0OiAnNTc3LjMyNiw5MC4xMjksNDYzLjkxOSw1LjEzNywxLjQ3NCw1LjI5NywyLjQyMzInLFxuICAgIGVsbGlwc2U6ICdiZXNzZWwnLFxuICAgIGRhdHVtTmFtZTogJ0hlcm1hbm5za29nZWwnXG4gIH0sXG4gIG1naToge1xuICAgIHRvd2dzODQ6ICc1NzcuMzI2LDkwLjEyOSw0NjMuOTE5LDUuMTM3LDEuNDc0LDUuMjk3LDIuNDIzMicsXG4gICAgZWxsaXBzZTogJ2Jlc3NlbCcsXG4gICAgZGF0dW1OYW1lOiAnTWlsaXRhci1HZW9ncmFwaGlzY2hlIEluc3RpdHV0J1xuICB9LFxuICBvc25pNTI6IHtcbiAgICB0b3dnczg0OiAnNDgyLjUzMCwtMTMwLjU5Niw1NjQuNTU3LC0xLjA0MiwtMC4yMTQsLTAuNjMxLDguMTUnLFxuICAgIGVsbGlwc2U6ICdhaXJ5JyxcbiAgICBkYXR1bU5hbWU6ICdJcmlzaCBOYXRpb25hbCdcbiAgfSxcbiAgaXJlNjU6IHtcbiAgICB0b3dnczg0OiAnNDgyLjUzMCwtMTMwLjU5Niw1NjQuNTU3LC0xLjA0MiwtMC4yMTQsLTAuNjMxLDguMTUnLFxuICAgIGVsbGlwc2U6ICdtb2RfYWlyeScsXG4gICAgZGF0dW1OYW1lOiAnSXJlbGFuZCAxOTY1J1xuICB9LFxuICByYXNzYWRpcmFuOiB7XG4gICAgdG93Z3M4NDogJy0xMzMuNjMsLTE1Ny41LC0xNTguNjInLFxuICAgIGVsbGlwc2U6ICdpbnRsJyxcbiAgICBkYXR1bU5hbWU6ICdSYXNzYWRpcmFuJ1xuICB9LFxuICBuemdkNDk6IHtcbiAgICB0b3dnczg0OiAnNTkuNDcsLTUuMDQsMTg3LjQ0LDAuNDcsLTAuMSwxLjAyNCwtNC41OTkzJyxcbiAgICBlbGxpcHNlOiAnaW50bCcsXG4gICAgZGF0dW1OYW1lOiAnTmV3IFplYWxhbmQgR2VvZGV0aWMgRGF0dW0gMTk0OSdcbiAgfSxcbiAgb3NnYjM2OiB7XG4gICAgdG93Z3M4NDogJzQ0Ni40NDgsLTEyNS4xNTcsNTQyLjA2MCwwLjE1MDIsMC4yNDcwLDAuODQyMSwtMjAuNDg5NCcsXG4gICAgZWxsaXBzZTogJ2FpcnknLFxuICAgIGRhdHVtTmFtZTogJ09yZG5hbmNlIFN1cnZleSBvZiBHcmVhdCBCcml0YWluIDE5MzYnXG4gIH0sXG4gIHNfanRzazoge1xuICAgIHRvd2dzODQ6ICc1ODksNzYsNDgwJyxcbiAgICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgICBkYXR1bU5hbWU6ICdTLUpUU0sgKEZlcnJvKSdcbiAgfSxcbiAgYmVkdWFyYW06IHtcbiAgICB0b3dnczg0OiAnLTEwNiwtODcsMTg4JyxcbiAgICBlbGxpcHNlOiAnY2xyazgwJyxcbiAgICBkYXR1bU5hbWU6ICdCZWR1YXJhbSdcbiAgfSxcbiAgZ3VudW5nX3NlZ2FyYToge1xuICAgIHRvd2dzODQ6ICctNDAzLDY4NCw0MScsXG4gICAgZWxsaXBzZTogJ2Jlc3NlbCcsXG4gICAgZGF0dW1OYW1lOiAnR3VudW5nIFNlZ2FyYSBKYWthcnRhJ1xuICB9LFxuICBybmI3Mjoge1xuICAgIHRvd2dzODQ6ICcxMDYuODY5LC01Mi4yOTc4LDEwMy43MjQsLTAuMzM2NTcsMC40NTY5NTUsLTEuODQyMTgsMScsXG4gICAgZWxsaXBzZTogJ2ludGwnLFxuICAgIGRhdHVtTmFtZTogJ1Jlc2VhdSBOYXRpb25hbCBCZWxnZSAxOTcyJ1xuICB9LFxuICBFUFNHXzU0NTE6IHtcbiAgICB0b3dnczg0OiAnNi40MSwtNDkuMDUsLTExLjI4LDEuNTY1NywwLjUyNDIsNi45NzE4LC01Ljc2NDknXG4gIH0sXG4gIElHTkZfTFVSRVNHOiB7XG4gICAgdG93Z3M4NDogJy0xOTIuOTg2LDEzLjY3MywtMzkuMzA5LC0wLjQwOTksLTIuOTMzMiwyLjY4ODEsMC40MydcbiAgfSxcbiAgRVBTR180NjE0OiB7XG4gICAgdG93Z3M4NDogJy0xMTkuNDI0OCwtMzAzLjY1ODcyLC0xMS4wMDA2MSwxLjE2NDI5OCwwLjE3NDQ1OCwxLjA5NjI1OSwzLjY1NzA2NSdcbiAgfSxcbiAgRVBTR180NjE1OiB7XG4gICAgdG93Z3M4NDogJy00OTQuMDg4LC0zMTIuMTI5LDI3OS44NzcsLTEuNDIzLC0xLjAxMywxLjU5LC0wLjc0OCdcbiAgfSxcbiAgRVNSSV8zNzI0MToge1xuICAgIHRvd2dzODQ6ICctNzYuODIyLDI1Ny40NTcsLTEyLjgxNywyLjEzNiwtMC4wMzMsLTIuMzkyLC0wLjAzMSdcbiAgfSxcbiAgRVNSSV8zNzI0OToge1xuICAgIHRvd2dzODQ6ICctNDQwLjI5Niw1OC41NDgsMjk2LjI2NSwxLjEyOCwxMC4yMDIsNC41NTksLTAuNDM4J1xuICB9LFxuICBFU1JJXzM3MjQ1OiB7XG4gICAgdG93Z3M4NDogJy01MTEuMTUxLC0xODEuMjY5LDEzOS42MDksMS4wNSwyLjcwMywxLjc5OCwzLjA3MSdcbiAgfSxcbiAgRVBTR180MTc4OiB7XG4gICAgdG93Z3M4NDogJzI0LjksLTEyNi40LC05My4yLC0wLjA2MywtMC4yNDcsLTAuMDQxLDEuMDEnXG4gIH0sXG4gIEVQU0dfNDYyMjoge1xuICAgIHRvd2dzODQ6ICctNDcyLjI5LC01LjYzLC0zMDQuMTIsMC40MzYyLC0wLjgzNzQsMC4yNTYzLDEuODk4NCdcbiAgfSxcbiAgRVBTR180NjI1OiB7XG4gICAgdG93Z3M4NDogJzEyNi45Myw1NDcuOTQsMTMwLjQxLC0yLjc4NjcsNS4xNjEyLC0wLjg1ODQsMTMuODIyNydcbiAgfSxcbiAgRVBTR181MjUyOiB7XG4gICAgdG93Z3M4NDogJzAuMDIzLDAuMDM2LC0wLjA2OCwwLjAwMTc2LDAuMDA5MTIsLTAuMDExMzYsMC4wMDQzOSdcbiAgfSxcbiAgRVBTR180MzE0OiB7XG4gICAgdG93Z3M4NDogJzU5Ny4xLDcxLjQsNDEyLjEsMC44OTQsMC4wNjgsLTEuNTYzLDcuNTgnXG4gIH0sXG4gIEVQU0dfNDI4Mjoge1xuICAgIHRvd2dzODQ6ICctMTc4LjMsLTMxNi43LC0xMzEuNSw1LjI3OCw2LjA3NywxMC45NzksMTkuMTY2J1xuICB9LFxuICBFUFNHXzQyMzE6IHtcbiAgICB0b3dnczg0OiAnLTgzLjExLC05Ny4zOCwtMTE3LjIyLDAuMDI3NiwtMC4yMTY3LDAuMjE0NywwLjEyMTgnXG4gIH0sXG4gIEVQU0dfNDI3NDoge1xuICAgIHRvd2dzODQ6ICctMjMwLjk5NCwxMDIuNTkxLDI1LjE5OSwwLjYzMywtMC4yMzksMC45LDEuOTUnXG4gIH0sXG4gIEVQU0dfNDEzNDoge1xuICAgIHRvd2dzODQ6ICctMTgwLjYyNCwtMjI1LjUxNiwxNzMuOTE5LC0wLjgxLC0xLjg5OCw4LjMzNiwxNi43MTAwNidcbiAgfSxcbiAgRVBTR180MjU0OiB7XG4gICAgdG93Z3M4NDogJzE4LjM4LDE5Mi40NSw5Ni44MiwwLjA1NiwtMC4xNDIsLTAuMiwtMC4wMDEzJ1xuICB9LFxuICBFUFNHXzQxNTk6IHtcbiAgICB0b3dnczg0OiAnLTE5NC41MTMsLTYzLjk3OCwtMjUuNzU5LC0zLjQwMjcsMy43NTYsLTMuMzUyLC0wLjkxNzUnXG4gIH0sXG4gIEVQU0dfNDY4Nzoge1xuICAgIHRvd2dzODQ6ICcwLjA3MiwtMC41MDcsLTAuMjQ1LDAuMDE4MywtMC4wMDAzLDAuMDA3LC0wLjAwOTMnXG4gIH0sXG4gIEVQU0dfNDIyNzoge1xuICAgIHRvd2dzODQ6ICctODMuNTgsLTM5Ny41NCw0NTguNzgsLTE3LjU5NSwtMi44NDcsNC4yNTYsMy4yMjUnXG4gIH0sXG4gIEVQU0dfNDc0Njoge1xuICAgIHRvd2dzODQ6ICc1OTkuNCw3Mi40LDQxOS4yLC0wLjA2MiwtMC4wMjIsLTIuNzIzLDYuNDYnXG4gIH0sXG4gIEVQU0dfNDc0NToge1xuICAgIHRvd2dzODQ6ICc2MTIuNCw3Nyw0NDAuMiwtMC4wNTQsMC4wNTcsLTIuNzk3LDIuNTUnXG4gIH0sXG4gIEVQU0dfNjMxMToge1xuICAgIHRvd2dzODQ6ICc4Ljg0NiwtNC4zOTQsLTEuMTIyLC0wLjAwMjM3LC0wLjE0NjUyOCwwLjEzMDQyOCwwLjc4MzkyNidcbiAgfSxcbiAgRVBTR180Mjg5OiB7XG4gICAgdG93Z3M4NDogJzU2NS43MzgxLDUwLjQwMTgsNDY1LjI5MDQsLTEuOTE1MTQsMS42MDM2MywtOS4wOTU0Niw0LjA3MjQ0J1xuICB9LFxuICBFUFNHXzQyMzA6IHtcbiAgICB0b3dnczg0OiAnLTY4Ljg2MywtMTM0Ljg4OCwtMTExLjQ5LC0wLjUzLC0wLjE0LDAuNTcsLTMuNCdcbiAgfSxcbiAgRVBTR180MTU0OiB7XG4gICAgdG93Z3M4NDogJy0xMjMuMDIsLTE1OC45NSwtMTY4LjQ3J1xuICB9LFxuICBFUFNHXzQxNTY6IHtcbiAgICB0b3dnczg0OiAnNTcwLjgsODUuNyw0NjIuOCw0Ljk5OCwxLjU4Nyw1LjI2MSwzLjU2J1xuICB9LFxuICBFUFNHXzQyOTk6IHtcbiAgICB0b3dnczg0OiAnNDgyLjUsLTEzMC42LDU2NC42LC0xLjA0MiwtMC4yMTQsLTAuNjMxLDguMTUnXG4gIH0sXG4gIEVQU0dfNDE3OToge1xuICAgIHRvd2dzODQ6ICczMy40LC0xNDYuNiwtNzYuMywtMC4zNTksLTAuMDUzLDAuODQ0LC0wLjg0J1xuICB9LFxuICBFUFNHXzQzMTM6IHtcbiAgICB0b3dnczg0OiAnLTEwNi44Njg2LDUyLjI5NzgsLTEwMy43MjM5LDAuMzM2NiwtMC40NTcsMS44NDIyLC0xLjI3NDcnXG4gIH0sXG4gIEVQU0dfNDE5NDoge1xuICAgIHRvd2dzODQ6ICcxNjMuNTExLDEyNy41MzMsLTE1OS43ODknXG4gIH0sXG4gIEVQU0dfNDE5NToge1xuICAgIHRvd2dzODQ6ICcxMDUsMzI2LC0xMDIuNSdcbiAgfSxcbiAgRVBTR180MTk2OiB7XG4gICAgdG93Z3M4NDogJy00NSw0MTcsLTMuNSdcbiAgfSxcbiAgRVBTR180NjExOiB7XG4gICAgdG93Z3M4NDogJy0xNjIuNjE5LC0yNzYuOTU5LC0xNjEuNzY0LDAuMDY3NzUzLC0yLjI0MzY0OSwtMS4xNTg4MjcsLTEuMDk0MjQ2J1xuICB9LFxuICBFUFNHXzQ2MzM6IHtcbiAgICB0b3dnczg0OiAnMTM3LjA5MiwxMzEuNjYsOTEuNDc1LC0xLjk0MzYsLTExLjU5OTMsLTQuMzMyMSwtNy40ODI0J1xuICB9LFxuICBFUFNHXzQ2NDE6IHtcbiAgICB0b3dnczg0OiAnLTQwOC44MDksMzY2Ljg1NiwtNDEyLjk4NywxLjg4NDIsLTAuNTMwOCwyLjE2NTUsLTEyMS4wOTkzJ1xuICB9LFxuICBFUFNHXzQ2NDM6IHtcbiAgICB0b3dnczg0OiAnLTQ4MC4yNiwtNDM4LjMyLC02NDMuNDI5LDE2LjMxMTksMjAuMTcyMSwtNC4wMzQ5LC0xMTEuNzAwMidcbiAgfSxcbiAgRVBTR180MzAwOiB7XG4gICAgdG93Z3M4NDogJzQ4Mi41LC0xMzAuNiw1NjQuNiwtMS4wNDIsLTAuMjE0LC0wLjYzMSw4LjE1J1xuICB9LFxuICBFUFNHXzQxODg6IHtcbiAgICB0b3dnczg0OiAnNDgyLjUsLTEzMC42LDU2NC42LC0xLjA0MiwtMC4yMTQsLTAuNjMxLDguMTUnXG4gIH0sXG4gIEVQU0dfNDY2MDoge1xuICAgIHRvd2dzODQ6ICc5ODIuNjA4Nyw1NTIuNzUzLC01NDAuODczLDMyLjM5MzQ0LC0xNTMuMjU2ODQsLTk2LjIyNjYsMTYuODA1J1xuICB9LFxuICBFUFNHXzQ2NjI6IHtcbiAgICB0b3dnczg0OiAnOTcuMjk1LC0yNjMuMjQ3LDMxMC44ODIsLTEuNTk5OSwwLjgzODYsMy4xNDA5LDEzLjMyNTknXG4gIH0sXG4gIEVQU0dfMzkwNjoge1xuICAgIHRvd2dzODQ6ICc1NzcuODg4OTEsMTY1LjIyMjA1LDM5MS4xODI4OSw0LjkxNDUsLTAuOTQ3MjksLTEzLjA1MDk4LDcuNzg2NjQnXG4gIH0sXG4gIEVQU0dfNDMwNzoge1xuICAgIHRvd2dzODQ6ICctMjA5LjM2MjIsLTg3LjgxNjIsNDA0LjYxOTgsMC4wMDQ2LDMuNDc4NCwwLjU4MDUsLTEuNDU0NydcbiAgfSxcbiAgRVBTR182ODkyOiB7XG4gICAgdG93Z3M4NDogJy03Ni4yNjksLTE2LjY4Myw2OC41NjIsLTYuMjc1LDEwLjUzNiwtNC4yODYsLTEzLjY4NidcbiAgfSxcbiAgRVBTR180NjkwOiB7XG4gICAgdG93Z3M4NDogJzIyMS41OTcsMTUyLjQ0MSwxNzYuNTIzLDIuNDAzLDEuMzg5MywwLjg4NCwxMS40NjQ4J1xuICB9LFxuICBFUFNHXzQ2OTE6IHtcbiAgICB0b3dnczg0OiAnMjE4Ljc2OSwxNTAuNzUsMTc2Ljc1LDMuNTIzMSwyLjAwMzcsMS4yODgsMTAuOTgxNydcbiAgfSxcbiAgRVBTR180NjI5OiB7XG4gICAgdG93Z3M4NDogJzcyLjUxLDM0NS40MTEsNzkuMjQxLC0xLjU4NjIsLTAuODgyNiwtMC41NDk1LDEuMzY1MydcbiAgfSxcbiAgRVBTR180NjMwOiB7XG4gICAgdG93Z3M4NDogJzE2NS44MDQsMjE2LjIxMywxODAuMjYsLTAuNjI1MSwtMC40NTE1LC0wLjA3MjEsNy40MTExJ1xuICB9LFxuICBFUFNHXzQ2OTI6IHtcbiAgICB0b3dnczg0OiAnMjE3LjEwOSw4Ni40NTIsMjMuNzExLDAuMDE4MywtMC4wMDAzLDAuMDA3LC0wLjAwOTMnXG4gIH0sXG4gIEVQU0dfOTMzMzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCwtOC4zOTMsMC43NDksLTEwLjI3NiwwJ1xuICB9LFxuICBFUFNHXzkwNTk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDMxMjoge1xuICAgIHRvd2dzODQ6ICc2MDEuNzA1LDg0LjI2Myw0ODUuMjI3LDQuNzM1NCwxLjMxNDUsNS4zOTMsLTIuMzg4NydcbiAgfSxcbiAgRVBTR180MTIzOiB7XG4gICAgdG93Z3M4NDogJy05Ni4wNjIsLTgyLjQyOCwtMTIxLjc1Myw0LjgwMSwwLjM0NSwtMS4zNzYsMS40OTYnXG4gIH0sXG4gIEVQU0dfNDMwOToge1xuICAgIHRvd2dzODQ6ICctMTI0LjQ1LDE4My43NCw0NC42NCwtMC40Mzg0LDAuNTQ0NiwtMC45NzA2LC0yLjEzNjUnXG4gIH0sXG4gIEVTUklfMTA0MTA2OiB7XG4gICAgdG93Z3M4NDogJy0yODMuMDg4LC03MC42OTMsMTE3LjQ0NSwtMS4xNTcsMC4wNTksLTAuNjUyLC00LjA1OCdcbiAgfSxcbiAgRVBTR180MjgxOiB7XG4gICAgdG93Z3M4NDogJy0yMTkuMjQ3LC03My44MDIsMjY5LjUyOSdcbiAgfSxcbiAgRVBTR180MzIyOiB7XG4gICAgdG93Z3M4NDogJzAsMCw0LjUnXG4gIH0sXG4gIEVQU0dfNDMyNDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMS45J1xuICB9LFxuICBFUFNHXzQyODQ6IHtcbiAgICB0b3dnczg0OiAnNDMuODIyLC0xMDguODQyLC0xMTkuNTg1LDEuNDU1LC0wLjc2MSwwLjczNywwLjU0OSdcbiAgfSxcbiAgRVBTR180Mjc3OiB7XG4gICAgdG93Z3M4NDogJzQ0Ni40NDgsLTEyNS4xNTcsNTQyLjA2LDAuMTUsMC4yNDcsMC44NDIsLTIwLjQ4OSdcbiAgfSxcbiAgRVBTR180MjA3OiB7XG4gICAgdG93Z3M4NDogJy0yODIuMSwtNzIuMiwxMjAsLTEuNTI5LDAuMTQ1LC0wLjg5LC00LjQ2J1xuICB9LFxuICBFUFNHXzQ2ODg6IHtcbiAgICB0b3dnczg0OiAnMzQ3LjE3NSwxMDc3LjYxOCwyNjIzLjY3NywzMy45MDU4LC03MC42Nzc2LDkuNDAxMywxODYuMDY0NydcbiAgfSxcbiAgRVBTR180Njg5OiB7XG4gICAgdG93Z3M4NDogJzQxMC43OTMsNTQuNTQyLDgwLjUwMSwtMi41NTk2LC0yLjM1MTcsLTAuNjU5NCwxNy4zMjE4J1xuICB9LFxuICBFUFNHXzQ3MjA6IHtcbiAgICB0b3dnczg0OiAnMCwwLDQuNSdcbiAgfSxcbiAgRVBTR180MjczOiB7XG4gICAgdG93Z3M4NDogJzI3OC4zLDkzLDQ3NC41LDcuODg5LDAuMDUsLTYuNjEsNi4yMSdcbiAgfSxcbiAgRVBTR180MjQwOiB7XG4gICAgdG93Z3M4NDogJzIwNC42NCw4MzQuNzQsMjkzLjgnXG4gIH0sXG4gIEVQU0dfNDgxNzoge1xuICAgIHRvd2dzODQ6ICcyNzguMyw5Myw0NzQuNSw3Ljg4OSwwLjA1LC02LjYxLDYuMjEnXG4gIH0sXG4gIEVTUklfMTA0MTMxOiB7XG4gICAgdG93Z3M4NDogJzQyNi42MiwxNDIuNjIsNDYwLjA5LDQuOTgsNC40OSwtMTIuNDIsLTE3LjEnXG4gIH0sXG4gIEVQU0dfNDI2NToge1xuICAgIHRvd2dzODQ6ICctMTA0LjEsLTQ5LjEsLTkuOSwwLjk3MSwtMi45MTcsMC43MTQsLTExLjY4J1xuICB9LFxuICBFUFNHXzQyNjM6IHtcbiAgICB0b3dnczg0OiAnLTExMS45MiwtODcuODUsMTE0LjUsMS44NzUsMC4yMDIsMC4yMTksMC4wMzInXG4gIH0sXG4gIEVQU0dfNDI5ODoge1xuICAgIHRvd2dzODQ6ICctNjg5LjU5MzcsNjIzLjg0MDQ2LC02NS45MzU2NiwtMC4wMjMzMSwxLjE3MDk0LC0wLjgwMDU0LDUuODg1MzYnXG4gIH0sXG4gIEVQU0dfNDI3MDoge1xuICAgIHRvd2dzODQ6ICctMjUzLjQzOTIsLTE0OC40NTIsMzg2LjUyNjcsMC4xNTYwNSwwLjQzLC0wLjEwMTMsLTAuMDQyNCdcbiAgfSxcbiAgRVBTR180MjI5OiB7XG4gICAgdG93Z3M4NDogJy0xMjEuOCw5OC4xLC0xMC43J1xuICB9LFxuICBFUFNHXzQyMjA6IHtcbiAgICB0b3dnczg0OiAnLTU1LjUsLTM0OCwtMjI5LjInXG4gIH0sXG4gIEVQU0dfNDIxNDoge1xuICAgIHRvd2dzODQ6ICcxMi42NDYsLTE1NS4xNzYsLTgwLjg2MydcbiAgfSxcbiAgRVBTR180MjMyOiB7XG4gICAgdG93Z3M4NDogJy0zNDUsMywyMjMnXG4gIH0sXG4gIEVQU0dfNDIzODoge1xuICAgIHRvd2dzODQ6ICctMS45NzcsLTEzLjA2LC05Ljk5MywwLjM2NCwwLjI1NCwwLjY4OSwtMS4wMzcnXG4gIH0sXG4gIEVQU0dfNDE2ODoge1xuICAgIHRvd2dzODQ6ICctMTcwLDMzLDMyNidcbiAgfSxcbiAgRVBTR180MTMxOiB7XG4gICAgdG93Z3M4NDogJzE5OSw5MzEsMzE4LjknXG4gIH0sXG4gIEVQU0dfNDE1Mjoge1xuICAgIHRvd2dzODQ6ICctMC45MTAyLDIuMDE0MSwwLjU2MDIsMC4wMjkwMzksMC4wMTAwNjUsMC4wMTAxMDEsMCdcbiAgfSxcbiAgRVBTR181MjI4OiB7XG4gICAgdG93Z3M4NDogJzU3Mi4yMTMsODUuMzM0LDQ2MS45NCw0Ljk3MzIsMS41MjksNS4yNDg0LDMuNTM3OCdcbiAgfSxcbiAgRVBTR184MzUxOiB7XG4gICAgdG93Z3M4NDogJzQ4NS4wMjEsMTY5LjQ2NSw0ODMuODM5LDcuNzg2MzQyLDQuMzk3NTU0LDQuMTAyNjU1LDAnXG4gIH0sXG4gIEVQU0dfNDY4Mzoge1xuICAgIHRvd2dzODQ6ICctMTI3LjYyLC02Ny4yNCwtNDcuMDQsLTMuMDY4LDQuOTAzLDEuNTc4LC0xLjA2J1xuICB9LFxuICBFUFNHXzQxMzM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNzM3Mzoge1xuICAgIHRvd2dzODQ6ICcwLjgxOSwtMC41NzYyLC0xLjY0NDYsLTAuMDAzNzgsLTAuMDMzMTcsMC4wMDMxOCwwLjA2OTMnXG4gIH0sXG4gIEVQU0dfOTA3NToge1xuICAgIHRvd2dzODQ6ICctMC45MTAyLDIuMDE0MSwwLjU2MDIsMC4wMjkwMzksMC4wMTAwNjUsMC4wMTAxMDEsMCdcbiAgfSxcbiAgRVBTR185MDcyOiB7XG4gICAgdG93Z3M4NDogJy0wLjkxMDIsMi4wMTQxLDAuNTYwMiwwLjAyOTAzOSwwLjAxMDA2NSwwLjAxMDEwMSwwJ1xuICB9LFxuICBFUFNHXzkyOTQ6IHtcbiAgICB0b3dnczg0OiAnMS4xNjgzNSwtMS40MjAwMSwtMi4yNDQzMSwtMC4wMDgyMiwtMC4wNTUwOCwwLjAxODE4LDAuMjMzODgnXG4gIH0sXG4gIEVQU0dfNDIxMjoge1xuICAgIHRvd2dzODQ6ICctMjY3LjQzNCwxNzMuNDk2LDE4MS44MTQsLTEzLjQ3MDQsOC43MTU0LDcuMzkyNiwxNC43NDkyJ1xuICB9LFxuICBFUFNHXzQxOTE6IHtcbiAgICB0b3dnczg0OiAnLTQ0LjE4MywtMC41OCwtMzguNDg5LDIuMzg2NywyLjcwNzIsLTMuNTE5NiwtOC4yNzAzJ1xuICB9LFxuICBFUFNHXzQyMzc6IHtcbiAgICB0b3dnczg0OiAnNTIuNjg0LC03MS4xOTQsLTEzLjk3NSwtMC4zMTIsLTAuMTA2MywtMC4zNzI5LDEuMDE5MSdcbiAgfSxcbiAgRVBTR180NzQwOiB7XG4gICAgdG93Z3M4NDogJy0xLjA4LC0wLjI3LC0wLjknXG4gIH0sXG4gIEVQU0dfNDEyNDoge1xuICAgIHRvd2dzODQ6ICc0MTkuMzgzNiw5OS4zMzM1LDU5MS4zNDUxLDAuODUwMzg5LDEuODE3Mjc3LC03Ljg2MjIzOCwtMC45OTQ5NidcbiAgfSxcbiAgRVBTR181NjgxOiB7XG4gICAgdG93Z3M4NDogJzU4NC45NjM2LDEwNy43MTc1LDQxMy44MDY3LDEuMTE1NSwwLjI4MjQsLTMuMTM4NCw3Ljk5MjInXG4gIH0sXG4gIEVQU0dfNDE0MToge1xuICAgIHRvd2dzODQ6ICcyMy43NzIsMTcuNDksMTcuODU5LC0wLjMxMzIsLTEuODUyNzQsMS42NzI5OSwtNS40MjYyJ1xuICB9LFxuICBFUFNHXzQyMDQ6IHtcbiAgICB0b3dnczg0OiAnLTg1LjY0NSwtMjczLjA3NywtNzkuNzA4LDIuMjg5LC0xLjQyMSwyLjUzMiwzLjE5NCdcbiAgfSxcbiAgRVBTR180MzE5OiB7XG4gICAgdG93Z3M4NDogJzIyNi43MDIsLTE5My4zMzcsLTM1LjM3MSwtMi4yMjksLTQuMzkxLDkuMjM4LDAuOTc5OCdcbiAgfSxcbiAgRVBTR180MjAwOiB7XG4gICAgdG93Z3M4NDogJzI0LjgyLC0xMzEuMjEsLTgyLjY2J1xuICB9LFxuICBFUFNHXzQxMzA6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDEyNzoge1xuICAgIHRvd2dzODQ6ICctODIuODc1LC01Ny4wOTcsLTE1Ni43NjgsLTIuMTU4LDEuNTI0LC0wLjk4MiwtMC4zNTknXG4gIH0sXG4gIEVQU0dfNDE0OToge1xuICAgIHRvd2dzODQ6ICc2NzQuMzc0LDE1LjA1Niw0MDUuMzQ2J1xuICB9LFxuICBFUFNHXzQ2MTc6IHtcbiAgICB0b3dnczg0OiAnLTAuOTkxLDEuOTA3MiwwLjUxMjksMS4yNTAzM2UtNyw0LjY3ODVlLTgsNS42NTI5ZS04LDAnXG4gIH0sXG4gIEVQU0dfNDY2Mzoge1xuICAgIHRvd2dzODQ6ICctMjEwLjUwMiwtNjYuOTAyLC00OC40NzYsMi4wOTQsLTE1LjA2NywtNS44MTcsMC40ODUnXG4gIH0sXG4gIEVQU0dfNDY2NDoge1xuICAgIHRvd2dzODQ6ICctMjExLjkzOSwxMzcuNjI2LDU4LjMsLTAuMDg5LDAuMjUxLDAuMDc5LDAuMzg0J1xuICB9LFxuICBFUFNHXzQ2NjU6IHtcbiAgICB0b3dnczg0OiAnLTEwNS44NTQsMTY1LjU4OSwtMzguMzEyLC0wLjAwMywtMC4wMjYsMC4wMjQsLTAuMDQ4J1xuICB9LFxuICBFUFNHXzQ2NjY6IHtcbiAgICB0b3dnczg0OiAnNjMxLjM5MiwtNjYuNTUxLDQ4MS40NDIsMS4wOSwtNC40NDUsLTQuNDg3LC00LjQzJ1xuICB9LFxuICBFUFNHXzQ3NTY6IHtcbiAgICB0b3dnczg0OiAnLTE5Mi44NzMsLTM5LjM4MiwtMTExLjIwMiwtMC4wMDIwNSwtMC4wMDA1LDAuMDAzMzUsMC4wMTg4J1xuICB9LFxuICBFUFNHXzQ3MjM6IHtcbiAgICB0b3dnczg0OiAnLTE3OS40ODMsLTY5LjM3OSwtMjcuNTg0LC03Ljg2Miw4LjE2Myw2LjA0MiwtMTMuOTI1J1xuICB9LFxuICBFUFNHXzQ3MjY6IHtcbiAgICB0b3dnczg0OiAnOC44NTMsLTUyLjY0NCwxODAuMzA0LC0wLjM5MywtMi4zMjMsMi45NiwtMjQuMDgxJ1xuICB9LFxuICBFUFNHXzQyNjc6IHtcbiAgICB0b3dnczg0OiAnLTguMCwxNjAuMCwxNzYuMCdcbiAgfSxcbiAgRVBTR181MzY1OiB7XG4gICAgdG93Z3M4NDogJy0wLjE2OTU5LDAuMzUzMTIsMC41MTg0NiwwLjAzMzg1LC0wLjE2MzI1LDAuMDM0NDYsMC4wMzY5MydcbiAgfSxcbiAgRVBTR180MjE4OiB7XG4gICAgdG93Z3M4NDogJzMwNC41LDMwNi41LC0zMTguMSdcbiAgfSxcbiAgRVBTR180MjQyOiB7XG4gICAgdG93Z3M4NDogJy0zMy43MjIsMTUzLjc4OSw5NC45NTksLTguNTgxLC00LjQ3OCw0LjU0LDguOTUnXG4gIH0sXG4gIEVQU0dfNDIxNjoge1xuICAgIHRvd2dzODQ6ICctMjkyLjI5NSwyNDguNzU4LDQyOS40NDcsNC45OTcxLDIuOTksNi42OTA2LDEuMDI4OSdcbiAgfSxcbiAgRVNSSV8xMDQxMDU6IHtcbiAgICB0b3dnczg0OiAnNjMxLjM5MiwtNjYuNTUxLDQ4MS40NDIsMS4wOSwtNC40NDUsLTQuNDg3LC00LjQzJ1xuICB9LFxuICBFU1JJXzEwNDEyOToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NjczOiB7XG4gICAgdG93Z3M4NDogJzE3NC4wNSwtMjUuNDksMTEyLjU3J1xuICB9LFxuICBFUFNHXzQyMDI6IHtcbiAgICB0b3dnczg0OiAnLTEyNCwtNjAsMTU0J1xuICB9LFxuICBFUFNHXzQyMDM6IHtcbiAgICB0b3dnczg0OiAnLTExNy43NjMsLTUxLjUxLDEzOS4wNjEsMC4yOTIsMC40NDMsMC4yNzcsLTAuMTkxJ1xuICB9LFxuICBFUFNHXzM4MTk6IHtcbiAgICB0b3dnczg0OiAnNTk1LjQ4LDEyMS42OSw1MTUuMzUsNC4xMTUsLTIuOTM4MywwLjg1MywtMy40MDgnXG4gIH0sXG4gIEVQU0dfODY5NDoge1xuICAgIHRvd2dzODQ6ICctOTMuNzk5LC0xMzIuNzM3LC0yMTkuMDczLC0xLjg0NCwwLjY0OCwtNi4zNywtMC4xNjknXG4gIH0sXG4gIEVQU0dfNDE0NToge1xuICAgIHRvd2dzODQ6ICcyNzUuNTcsNjc2Ljc4LDIyOS42J1xuICB9LFxuICBFUFNHXzQyODM6IHtcbiAgICB0b3dnczg0OiAnNjEuNTUsLTEwLjg3LC00MC4xOSwzOS40OTI0LDMyLjcyMjEsMzIuODk3OSwtOS45OTQnXG4gIH0sXG4gIEVQU0dfNDMxNzoge1xuICAgIHRvd2dzODQ6ICcyLjMyODcsLTE0Ny4wNDI1LC05Mi4wODAyLC0wLjMwOTI0ODMsMC4zMjQ4MjE4NSwwLjQ5NzI5OTM0LDUuNjg5MDYyNjYnXG4gIH0sXG4gIEVQU0dfNDI3Mjoge1xuICAgIHRvd2dzODQ6ICc1OS40NywtNS4wNCwxODcuNDQsMC40NywtMC4xLDEuMDI0LC00LjU5OTMnXG4gIH0sXG4gIEVQU0dfNDI0ODoge1xuICAgIHRvd2dzODQ6ICctMzA3LjcsMjY1LjMsLTM2My41J1xuICB9LFxuICBFUFNHXzU1NjE6IHtcbiAgICB0b3dnczg0OiAnMjQsLTEyMSwtNzYnXG4gIH0sXG4gIEVQU0dfNTIzMzoge1xuICAgIHRvd2dzODQ6ICctMC4yOTMsNzY2Ljk1LDg3LjcxMywwLjE5NTcwNCwxLjY5NTA2OCwzLjQ3MzAxNiwtMC4wMzkzMzgnXG4gIH0sXG4gIEVTUklfMTA0MTMwOiB7XG4gICAgdG93Z3M4NDogJy04NiwtOTgsLTExOSdcbiAgfSxcbiAgRVNSSV8xMDQxMDI6IHtcbiAgICB0b3dnczg0OiAnNjgyLC0yMDMsNDgwJ1xuICB9LFxuICBFU1JJXzM3MjA3OiB7XG4gICAgdG93Z3M4NDogJzcsLTEwLC0yNidcbiAgfSxcbiAgRVBTR180Njc1OiB7XG4gICAgdG93Z3M4NDogJzU5LjkzNSwxMTguNCwtMTAuODcxJ1xuICB9LFxuICBFU1JJXzEwNDEwOToge1xuICAgIHRvd2dzODQ6ICctODkuMTIxLC0zNDguMTgyLDI2MC44NzEnXG4gIH0sXG4gIEVTUklfMTA0MTEyOiB7XG4gICAgdG93Z3M4NDogJy0xODUuNTgzLC0yMzAuMDk2LDI4MS4zNjEnXG4gIH0sXG4gIEVTUklfMTA0MTEzOiB7XG4gICAgdG93Z3M4NDogJzI1LjEsLTI3NS42LDIyMi42J1xuICB9LFxuICBJR05GX1dHUzcyRzoge1xuICAgIHRvd2dzODQ6ICcwLDEyLDYnXG4gIH0sXG4gIElHTkZfTlRGRzoge1xuICAgIHRvd2dzODQ6ICctMTY4LC02MCwzMjAnXG4gIH0sXG4gIElHTkZfRUZBVEU1N0c6IHtcbiAgICB0b3dnczg0OiAnLTEyNywtNzY5LDQ3MidcbiAgfSxcbiAgSUdORl9QR1A1MEc6IHtcbiAgICB0b3dnczg0OiAnMzI0LjgsMTUzLjYsMTcyLjEnXG4gIH0sXG4gIElHTkZfUkVVTjQ3Rzoge1xuICAgIHRvd2dzODQ6ICc5NCwtOTQ4LC0xMjYyJ1xuICB9LFxuICBJR05GX0NTRzY3Rzoge1xuICAgIHRvd2dzODQ6ICctMTg2LDIzMCwxMTAnXG4gIH0sXG4gIElHTkZfR1VBRDQ4Rzoge1xuICAgIHRvd2dzODQ6ICctNDY3LC0xNiwtMzAwJ1xuICB9LFxuICBJR05GX1RBSEk1MUc6IHtcbiAgICB0b3dnczg0OiAnMTYyLDExNywxNTQnXG4gIH0sXG4gIElHTkZfVEFIQUFHOiB7XG4gICAgdG93Z3M4NDogJzY1LDM0Miw3NydcbiAgfSxcbiAgSUdORl9OVUtVNzJHOiB7XG4gICAgdG93Z3M4NDogJzg0LDI3NCw2NSdcbiAgfSxcbiAgSUdORl9QRVRSRUxTNzJHOiB7XG4gICAgdG93Z3M4NDogJzM2NSwxOTQsMTY2J1xuICB9LFxuICBJR05GX1dBTEw3OEc6IHtcbiAgICB0b3dnczg0OiAnMjUzLC0xMzMsLTEyNydcbiAgfSxcbiAgSUdORl9NQVlPNTBHOiB7XG4gICAgdG93Z3M4NDogJy0zODIsLTU5LC0yNjInXG4gIH0sXG4gIElHTkZfVEFOTkFHOiB7XG4gICAgdG93Z3M4NDogJy0xMzksLTk2Nyw0MzYnXG4gIH0sXG4gIElHTkZfSUdONzJHOiB7XG4gICAgdG93Z3M4NDogJy0xMywtMzQ4LDI5MidcbiAgfSxcbiAgSUdORl9BVElHRzoge1xuICAgIHRvd2dzODQ6ICcxMTE4LDIzLDY2J1xuICB9LFxuICBJR05GX0ZBTkdBODRHOiB7XG4gICAgdG93Z3M4NDogJzE1MC41NywxNTguMzMsMTE4LjMyJ1xuICB9LFxuICBJR05GX1JVU0FUODRHOiB7XG4gICAgdG93Z3M4NDogJzIwMi4xMywxNzQuNiwtMTUuNzQnXG4gIH0sXG4gIElHTkZfS0FVRTcwRzoge1xuICAgIHRvd2dzODQ6ICcxMjYuNzQsMzAwLjEsLTc1LjQ5J1xuICB9LFxuICBJR05GX01PUDkwRzoge1xuICAgIHRvd2dzODQ6ICctMTAuOCwtMS44LDEyLjc3J1xuICB9LFxuICBJR05GX01IUEY2N0c6IHtcbiAgICB0b3dnczg0OiAnMzM4LjA4LDIxMi41OCwtMjk2LjE3J1xuICB9LFxuICBJR05GX1RBSEk3OUc6IHtcbiAgICB0b3dnczg0OiAnMTYwLjYxLDExNi4wNSwxNTMuNjknXG4gIH0sXG4gIElHTkZfQU5BQTkyRzoge1xuICAgIHRvd2dzODQ6ICcxLjUsMy44NCw0LjgxJ1xuICB9LFxuICBJR05GX01BUlFVSTcyRzoge1xuICAgIHRvd2dzODQ6ICczMzAuOTEsLTEzLjkyLDU4LjU2J1xuICB9LFxuICBJR05GX0FQQVQ4Nkc6IHtcbiAgICB0b3dnczg0OiAnMTQzLjYsMTk3LjgyLDc0LjA1J1xuICB9LFxuICBJR05GX1RVQlU2OUc6IHtcbiAgICB0b3dnczg0OiAnMjM3LjE3LDE3MS42MSwtNzcuODQnXG4gIH0sXG4gIElHTkZfU1RQTTUwRzoge1xuICAgIHRvd2dzODQ6ICcxMS4zNjMsNDI0LjE0OCwzNzMuMTMnXG4gIH0sXG4gIEVQU0dfNDE1MDoge1xuICAgIHRvd2dzODQ6ICc2NzQuMzc0LDE1LjA1Niw0MDUuMzQ2J1xuICB9LFxuICBFUFNHXzQ3NTQ6IHtcbiAgICB0b3dnczg0OiAnLTIwOC40MDU4LC0xMDkuODc3NywtMi41NzY0J1xuICB9LFxuICBFU1JJXzEwNDEwMToge1xuICAgIHRvd2dzODQ6ICczNzQsMTUwLDU4OCdcbiAgfSxcbiAgRVBTR180NjkzOiB7XG4gICAgdG93Z3M4NDogJzAsLTAuMTUsMC42OCdcbiAgfSxcbiAgRVBTR182MjA3OiB7XG4gICAgdG93Z3M4NDogJzI5My4xNyw3MjYuMTgsMjQ1LjM2J1xuICB9LFxuICBFUFNHXzQxNTM6IHtcbiAgICB0b3dnczg0OiAnLTEzMy42MywtMTU3LjUsLTE1OC42MidcbiAgfSxcbiAgRVBTR180MTMyOiB7XG4gICAgdG93Z3M4NDogJy0yNDEuNTQsLTE2My42NCwzOTYuMDYnXG4gIH0sXG4gIEVQU0dfNDIyMToge1xuICAgIHRvd2dzODQ6ICctMTU0LjUsMTUwLjcsMTAwLjQnXG4gIH0sXG4gIEVQU0dfNDI2Njoge1xuICAgIHRvd2dzODQ6ICctODAuNywtMTMyLjUsNDEuMSdcbiAgfSxcbiAgRVBTR180MTkzOiB7XG4gICAgdG93Z3M4NDogJy03MC45LC0xNTEuOCwtNDEuNCdcbiAgfSxcbiAgRVBTR181MzQwOiB7XG4gICAgdG93Z3M4NDogJy0wLjQxLDAuNDYsLTAuMzUnXG4gIH0sXG4gIEVQU0dfNDI0Njoge1xuICAgIHRvd2dzODQ6ICctMjk0LjcsLTIwMC4xLDUyNS41J1xuICB9LFxuICBFUFNHXzQzMTg6IHtcbiAgICB0b3dnczg0OiAnLTMuMiwtNS43LDIuOCdcbiAgfSxcbiAgRVBTR180MTIxOiB7XG4gICAgdG93Z3M4NDogJy0xOTkuODcsNzQuNzksMjQ2LjYyJ1xuICB9LFxuICBFUFNHXzQyMjM6IHtcbiAgICB0b3dnczg0OiAnLTI2MC4xLDUuNSw0MzIuMidcbiAgfSxcbiAgRVBTR180MTU4OiB7XG4gICAgdG93Z3M4NDogJy0wLjQ2NSwzNzIuMDk1LDE3MS43MzYnXG4gIH0sXG4gIEVQU0dfNDI4NToge1xuICAgIHRvd2dzODQ6ICctMTI4LjE2LC0yODIuNDIsMjEuOTMnXG4gIH0sXG4gIEVQU0dfNDYxMzoge1xuICAgIHRvd2dzODQ6ICctNDA0Ljc4LDY4NS42OCw0NS40NydcbiAgfSxcbiAgRVBTR180NjA3OiB7XG4gICAgdG93Z3M4NDogJzE5NS42NzEsMzMyLjUxNywyNzQuNjA3J1xuICB9LFxuICBFUFNHXzQ0NzU6IHtcbiAgICB0b3dnczg0OiAnLTM4MS43ODgsLTU3LjUwMSwtMjU2LjY3MydcbiAgfSxcbiAgRVBTR180MjA4OiB7XG4gICAgdG93Z3M4NDogJy0xNTcuODQsMzA4LjU0LC0xNDYuNidcbiAgfSxcbiAgRVBTR180NzQzOiB7XG4gICAgdG93Z3M4NDogJzcwLjk5NSwtMzM1LjkxNiwyNjIuODk4J1xuICB9LFxuICBFUFNHXzQ3MTA6IHtcbiAgICB0b3dnczg0OiAnLTMyMy42NSw1NTEuMzksLTQ5MS4yMidcbiAgfSxcbiAgRVBTR183ODgxOiB7XG4gICAgdG93Z3M4NDogJy0wLjA3NywwLjA3OSwwLjA4NidcbiAgfSxcbiAgRVBTR180NjgyOiB7XG4gICAgdG93Z3M4NDogJzI4My43MjksNzM1Ljk0MiwyNjEuMTQzJ1xuICB9LFxuICBFUFNHXzQ3Mzk6IHtcbiAgICB0b3dnczg0OiAnLTE1NiwtMjcxLC0xODknXG4gIH0sXG4gIEVQU0dfNDY3OToge1xuICAgIHRvd2dzODQ6ICctODAuMDEsMjUzLjI2LDI5MS4xOSdcbiAgfSxcbiAgRVBTR180NzUwOiB7XG4gICAgdG93Z3M4NDogJy01Ni4yNjMsMTYuMTM2LC0yMi44NTYnXG4gIH0sXG4gIEVQU0dfNDY0NDoge1xuICAgIHRvd2dzODQ6ICctMTAuMTgsLTM1MC40MywyOTEuMzcnXG4gIH0sXG4gIEVQU0dfNDY5NToge1xuICAgIHRvd2dzODQ6ICctMTAzLjc0NiwtOS42MTQsLTI1NS45NSdcbiAgfSxcbiAgRVBTR180MjkyOiB7XG4gICAgdG93Z3M4NDogJy0zNTUsMjEsNzInXG4gIH0sXG4gIEVQU0dfNDMwMjoge1xuICAgIHRvd2dzODQ6ICctNjEuNzAyLDI4NC40ODgsNDcyLjA1MidcbiAgfSxcbiAgRVBTR180MTQzOiB7XG4gICAgdG93Z3M4NDogJy0xMjQuNzYsNTMsNDY2Ljc5J1xuICB9LFxuICBFUFNHXzQ2MDY6IHtcbiAgICB0b3dnczg0OiAnLTE1MywxNTMsMzA3J1xuICB9LFxuICBFUFNHXzQ2OTk6IHtcbiAgICB0b3dnczg0OiAnLTc3MC4xLDE1OC40LC00OTguMidcbiAgfSxcbiAgRVBTR180MjQ3OiB7XG4gICAgdG93Z3M4NDogJy0yNzMuNSwxMTAuNiwtMzU3LjknXG4gIH0sXG4gIEVQU0dfNDE2MDoge1xuICAgIHRvd2dzODQ6ICc4Ljg4LDE4NC44NiwxMDYuNjknXG4gIH0sXG4gIEVQU0dfNDE2MToge1xuICAgIHRvd2dzODQ6ICctMjMzLjQzLDYuNjUsMTczLjY0J1xuICB9LFxuICBFUFNHXzkyNTE6IHtcbiAgICB0b3dnczg0OiAnLTkuNSwxMjIuOSwxMzguMidcbiAgfSxcbiAgRVBTR185MjUzOiB7XG4gICAgdG93Z3M4NDogJy03OC4xLDEwMS42LDEzMy4zJ1xuICB9LFxuICBFUFNHXzQyOTc6IHtcbiAgICB0b3dnczg0OiAnLTE5OC4zODMsLTI0MC41MTcsLTEwNy45MDknXG4gIH0sXG4gIEVQU0dfNDI2OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MzAxOiB7XG4gICAgdG93Z3M4NDogJy0xNDcsNTA2LDY4NydcbiAgfSxcbiAgRVBTR180NjE4OiB7XG4gICAgdG93Z3M4NDogJy01OSwtMTEsLTUyJ1xuICB9LFxuICBFUFNHXzQ2MTI6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY3ODoge1xuICAgIHRvd2dzODQ6ICc0NC41ODUsLTEzMS4yMTIsLTM5LjU0NCdcbiAgfSxcbiAgRVBTR180MjUwOiB7XG4gICAgdG93Z3M4NDogJy0xMzAsMjksMzY0J1xuICB9LFxuICBFUFNHXzQxNDQ6IHtcbiAgICB0b3dnczg0OiAnMjE0LDgwNCwyNjgnXG4gIH0sXG4gIEVQU0dfNDE0Nzoge1xuICAgIHRvd2dzODQ6ICctMTcuNTEsLTEwOC4zMiwtNjIuMzknXG4gIH0sXG4gIEVQU0dfNDI1OToge1xuICAgIHRvd2dzODQ6ICctMjU0LjEsLTUuMzYsLTEwMC4yOSdcbiAgfSxcbiAgRVBTR180MTY0OiB7XG4gICAgdG93Z3M4NDogJy03NiwtMTM4LDY3J1xuICB9LFxuICBFUFNHXzQyMTE6IHtcbiAgICB0b3dnczg0OiAnLTM3OC44NzMsNjc2LjAwMiwtNDYuMjU1J1xuICB9LFxuICBFUFNHXzQxODI6IHtcbiAgICB0b3dnczg0OiAnLTQyMi42NTEsLTE3Mi45OTUsODQuMDInXG4gIH0sXG4gIEVQU0dfNDIyNDoge1xuICAgIHRvd2dzODQ6ICctMTQzLjg3LDI0My4zNywtMzMuNTInXG4gIH0sXG4gIEVQU0dfNDIyNToge1xuICAgIHRvd2dzODQ6ICctMjA1LjU3LDE2OC43NywtNC4xMidcbiAgfSxcbiAgRVBTR181NTI3OiB7XG4gICAgdG93Z3M4NDogJy02Ny4zNSwzLjg4LC0zOC4yMidcbiAgfSxcbiAgRVBTR180NzUyOiB7XG4gICAgdG93Z3M4NDogJzk4LDM5MCwtMjInXG4gIH0sXG4gIEVQU0dfNDMxMDoge1xuICAgIHRvd2dzODQ6ICctMzAsMTkwLDg5J1xuICB9LFxuICBFUFNHXzkyNDg6IHtcbiAgICB0b3dnczg0OiAnLTE5Mi4yNiw2NS43MiwxMzIuMDgnXG4gIH0sXG4gIEVQU0dfNDY4MDoge1xuICAgIHRvd2dzODQ6ICcxMjQuNSwtNjMuNSwtMjgxJ1xuICB9LFxuICBFUFNHXzQ3MDE6IHtcbiAgICB0b3dnczg0OiAnLTc5LjksLTE1OCwtMTY4LjknXG4gIH0sXG4gIEVQU0dfNDcwNjoge1xuICAgIHRvd2dzODQ6ICctMTQ2LjIxLDExMi42Myw0LjA1J1xuICB9LFxuICBFUFNHXzQ4MDU6IHtcbiAgICB0b3dnczg0OiAnNjgyLC0yMDMsNDgwJ1xuICB9LFxuICBFUFNHXzQyMDE6IHtcbiAgICB0b3dnczg0OiAnLTE2NSwtMTEsMjA2J1xuICB9LFxuICBFUFNHXzQyMTA6IHtcbiAgICB0b3dnczg0OiAnLTE1NywtMiwtMjk5J1xuICB9LFxuICBFUFNHXzQxODM6IHtcbiAgICB0b3dnczg0OiAnLTEwNCwxNjcsLTM4J1xuICB9LFxuICBFUFNHXzQxMzk6IHtcbiAgICB0b3dnczg0OiAnMTEsNzIsLTEwMSdcbiAgfSxcbiAgRVBTR180NjY4OiB7XG4gICAgdG93Z3M4NDogJy04NiwtOTgsLTExOSdcbiAgfSxcbiAgRVBTR180NzE3OiB7XG4gICAgdG93Z3M4NDogJy0yLDE1MSwxODEnXG4gIH0sXG4gIEVQU0dfNDczMjoge1xuICAgIHRvd2dzODQ6ICcxMDIsNTIsLTM4J1xuICB9LFxuICBFUFNHXzQyODA6IHtcbiAgICB0b3dnczg0OiAnLTM3Nyw2ODEsLTUwJ1xuICB9LFxuICBFUFNHXzQyMDk6IHtcbiAgICB0b3dnczg0OiAnLTEzOCwtMTA1LC0yODknXG4gIH0sXG4gIEVQU0dfNDI2MToge1xuICAgIHRvd2dzODQ6ICczMSwxNDYsNDcnXG4gIH0sXG4gIEVQU0dfNDY1ODoge1xuICAgIHRvd2dzODQ6ICctNzMsNDYsLTg2J1xuICB9LFxuICBFUFNHXzQ3MjE6IHtcbiAgICB0b3dnczg0OiAnMjY1LjAyNSwzODQuOTI5LC0xOTQuMDQ2J1xuICB9LFxuICBFUFNHXzQyMjI6IHtcbiAgICB0b3dnczg0OiAnLTEzNiwtMTA4LC0yOTInXG4gIH0sXG4gIEVQU0dfNDYwMToge1xuICAgIHRvd2dzODQ6ICctMjU1LC0xNSw3MSdcbiAgfSxcbiAgRVBTR180NjAyOiB7XG4gICAgdG93Z3M4NDogJzcyNSw2ODUsNTM2J1xuICB9LFxuICBFUFNHXzQ2MDM6IHtcbiAgICB0b3dnczg0OiAnNzIsMjEzLjcsOTMnXG4gIH0sXG4gIEVQU0dfNDYwNToge1xuICAgIHRvd2dzODQ6ICc5LDE4MywyMzYnXG4gIH0sXG4gIEVQU0dfNDYyMToge1xuICAgIHRvd2dzODQ6ICcxMzcsMjQ4LC00MzAnXG4gIH0sXG4gIEVQU0dfNDY1Nzoge1xuICAgIHRvd2dzODQ6ICctMjgsMTk5LDUnXG4gIH0sXG4gIEVQU0dfNDMxNjoge1xuICAgIHRvd2dzODQ6ICcxMDMuMjUsLTEwMC40LC0zMDcuMTknXG4gIH0sXG4gIEVQU0dfNDY0Mjoge1xuICAgIHRvd2dzODQ6ICctMTMsLTM0OCwyOTInXG4gIH0sXG4gIEVQU0dfNDY5ODoge1xuICAgIHRvd2dzODQ6ICcxNDUsLTE4NywxMDMnXG4gIH0sXG4gIEVQU0dfNDE5Mjoge1xuICAgIHRvd2dzODQ6ICctMjA2LjEsLTE3NC43LC04Ny43J1xuICB9LFxuICBFUFNHXzQzMTE6IHtcbiAgICB0b3dnczg0OiAnLTI2NSwxMjAsLTM1OCdcbiAgfSxcbiAgRVBTR180MTM1OiB7XG4gICAgdG93Z3M4NDogJzU4LC0yODMsLTE4MidcbiAgfSxcbiAgRVNSSV8xMDQxMzg6IHtcbiAgICB0b3dnczg0OiAnMTk4LC0yMjYsLTM0NydcbiAgfSxcbiAgRVBTR180MjQ1OiB7XG4gICAgdG93Z3M4NDogJy0xMSw4NTEsNSdcbiAgfSxcbiAgRVBTR180MTQyOiB7XG4gICAgdG93Z3M4NDogJy0xMjUsNTMsNDY3J1xuICB9LFxuICBFUFNHXzQyMTM6IHtcbiAgICB0b3dnczg0OiAnLTEwNiwtODcsMTg4J1xuICB9LFxuICBFUFNHXzQyNTM6IHtcbiAgICB0b3dnczg0OiAnLTEzMywtNzcsLTUxJ1xuICB9LFxuICBFUFNHXzQxMjk6IHtcbiAgICB0b3dnczg0OiAnLTEzMiwtMTEwLC0zMzUnXG4gIH0sXG4gIEVQU0dfNDcxMzoge1xuICAgIHRvd2dzODQ6ICctNzcsLTEyOCwxNDInXG4gIH0sXG4gIEVQU0dfNDIzOToge1xuICAgIHRvd2dzODQ6ICcyMTcsODIzLDI5OSdcbiAgfSxcbiAgRVBTR180MTQ2OiB7XG4gICAgdG93Z3M4NDogJzI5NSw3MzYsMjU3J1xuICB9LFxuICBFUFNHXzQxNTU6IHtcbiAgICB0b3dnczg0OiAnLTgzLDM3LDEyNCdcbiAgfSxcbiAgRVBTR180MTY1OiB7XG4gICAgdG93Z3M4NDogJy0xNzMsMjUzLDI3J1xuICB9LFxuICBFUFNHXzQ2NzI6IHtcbiAgICB0b3dnczg0OiAnMTc1LC0zOCwxMTMnXG4gIH0sXG4gIEVQU0dfNDIzNjoge1xuICAgIHRvd2dzODQ6ICctNjM3LC01NDksLTIwMydcbiAgfSxcbiAgRVBTR180MjUxOiB7XG4gICAgdG93Z3M4NDogJy05MCw0MCw4OCdcbiAgfSxcbiAgRVBTR180MjcxOiB7XG4gICAgdG93Z3M4NDogJy0yLDM3NCwxNzInXG4gIH0sXG4gIEVQU0dfNDE3NToge1xuICAgIHRvd2dzODQ6ICctODgsNCwxMDEnXG4gIH0sXG4gIEVQU0dfNDcxNjoge1xuICAgIHRvd2dzODQ6ICcyOTgsLTMwNCwtMzc1J1xuICB9LFxuICBFUFNHXzQzMTU6IHtcbiAgICB0b3dnczg0OiAnLTIzLDI1OSwtOSdcbiAgfSxcbiAgRVBTR180NzQ0OiB7XG4gICAgdG93Z3M4NDogJy0yNDIuMiwtMTQ0LjksMzcwLjMnXG4gIH0sXG4gIEVQU0dfNDI0NDoge1xuICAgIHRvd2dzODQ6ICctOTcsNzg3LDg2J1xuICB9LFxuICBFUFNHXzQyOTM6IHtcbiAgICB0b3dnczg0OiAnNjE2LDk3LC0yNTEnXG4gIH0sXG4gIEVQU0dfNDcxNDoge1xuICAgIHRvd2dzODQ6ICctMTI3LC03NjksNDcyJ1xuICB9LFxuICBFUFNHXzQ3MzY6IHtcbiAgICB0b3dnczg0OiAnMjYwLDEyLC0xNDcnXG4gIH0sXG4gIEVQU0dfNjg4Mzoge1xuICAgIHRvd2dzODQ6ICctMjM1LC0xMTAsMzkzJ1xuICB9LFxuICBFUFNHXzY4OTQ6IHtcbiAgICB0b3dnczg0OiAnLTYzLDE3NiwxODUnXG4gIH0sXG4gIEVQU0dfNDIwNToge1xuICAgIHRvd2dzODQ6ICctNDMsLTE2Myw0NSdcbiAgfSxcbiAgRVBTR180MjU2OiB7XG4gICAgdG93Z3M4NDogJzQxLC0yMjAsLTEzNCdcbiAgfSxcbiAgRVBTR180MjYyOiB7XG4gICAgdG93Z3M4NDogJzYzOSw0MDUsNjAnXG4gIH0sXG4gIEVQU0dfNDYwNDoge1xuICAgIHRvd2dzODQ6ICcxNzQsMzU5LDM2NSdcbiAgfSxcbiAgRVBTR180MTY5OiB7XG4gICAgdG93Z3M4NDogJy0xMTUsMTE4LDQyNidcbiAgfSxcbiAgRVBTR180NjIwOiB7XG4gICAgdG93Z3M4NDogJy0xMDYsLTEyOSwxNjUnXG4gIH0sXG4gIEVQU0dfNDE4NDoge1xuICAgIHRvd2dzODQ6ICctMjAzLDE0MSw1MydcbiAgfSxcbiAgRVBTR180NjE2OiB7XG4gICAgdG93Z3M4NDogJy0yODksLTEyNCw2MCdcbiAgfSxcbiAgRVBTR185NDAzOiB7XG4gICAgdG93Z3M4NDogJy0zMDcsLTkyLDEyNydcbiAgfSxcbiAgRVBTR180Njg0OiB7XG4gICAgdG93Z3M4NDogJy0xMzMsLTMyMSw1MCdcbiAgfSxcbiAgRVBTR180NzA4OiB7XG4gICAgdG93Z3M4NDogJy00OTEsLTIyLDQzNSdcbiAgfSxcbiAgRVBTR180NzA3OiB7XG4gICAgdG93Z3M4NDogJzExNCwtMTE2LC0zMzMnXG4gIH0sXG4gIEVQU0dfNDcwOToge1xuICAgIHRvd2dzODQ6ICcxNDUsNzUsLTI3MidcbiAgfSxcbiAgRVBTR180NzEyOiB7XG4gICAgdG93Z3M4NDogJy0yMDUsMTA3LDUzJ1xuICB9LFxuICBFUFNHXzQ3MTE6IHtcbiAgICB0b3dnczg0OiAnMTI0LC0yMzQsLTI1J1xuICB9LFxuICBFUFNHXzQ3MTg6IHtcbiAgICB0b3dnczg0OiAnMjMwLC0xOTksLTc1MidcbiAgfSxcbiAgRVBTR180NzE5OiB7XG4gICAgdG93Z3M4NDogJzIxMSwxNDcsMTExJ1xuICB9LFxuICBFUFNHXzQ3MjQ6IHtcbiAgICB0b3dnczg0OiAnMjA4LC00MzUsLTIyOSdcbiAgfSxcbiAgRVBTR180NzI1OiB7XG4gICAgdG93Z3M4NDogJzE4OSwtNzksLTIwMidcbiAgfSxcbiAgRVBTR180NzM1OiB7XG4gICAgdG93Z3M4NDogJzY0NywxNzc3LC0xMTI0J1xuICB9LFxuICBFUFNHXzQ3MjI6IHtcbiAgICB0b3dnczg0OiAnLTc5NCwxMTksLTI5OCdcbiAgfSxcbiAgRVBTR180NzI4OiB7XG4gICAgdG93Z3M4NDogJy0zMDcsLTkyLDEyNydcbiAgfSxcbiAgRVBTR180NzM0OiB7XG4gICAgdG93Z3M4NDogJy02MzIsNDM4LC02MDknXG4gIH0sXG4gIEVQU0dfNDcyNzoge1xuICAgIHRvd2dzODQ6ICc5MTIsLTU4LDEyMjcnXG4gIH0sXG4gIEVQU0dfNDcyOToge1xuICAgIHRvd2dzODQ6ICcxODUsMTY1LDQyJ1xuICB9LFxuICBFUFNHXzQ3MzA6IHtcbiAgICB0b3dnczg0OiAnMTcwLDQyLDg0J1xuICB9LFxuICBFUFNHXzQ3MzM6IHtcbiAgICB0b3dnczg0OiAnMjc2LC01NywxNDknXG4gIH0sXG4gIEVTUklfMzcyMTg6IHtcbiAgICB0b3dnczg0OiAnMjMwLC0xOTksLTc1MidcbiAgfSxcbiAgRVNSSV8zNzI0MDoge1xuICAgIHRvd2dzODQ6ICctNywyMTUsMjI1J1xuICB9LFxuICBFU1JJXzM3MjIxOiB7XG4gICAgdG93Z3M4NDogJzI1MiwtMjA5LC03NTEnXG4gIH0sXG4gIEVTUklfNDMwNToge1xuICAgIHRvd2dzODQ6ICctMTIzLC0yMDYsMjE5J1xuICB9LFxuICBFU1JJXzEwNDEzOToge1xuICAgIHRvd2dzODQ6ICctNzMsLTI0NywyMjcnXG4gIH0sXG4gIEVQU0dfNDc0ODoge1xuICAgIHRvd2dzODQ6ICc1MSwzOTEsLTM2J1xuICB9LFxuICBFUFNHXzQyMTk6IHtcbiAgICB0b3dnczg0OiAnLTM4NCw2NjQsLTQ4J1xuICB9LFxuICBFUFNHXzQyNTU6IHtcbiAgICB0b3dnczg0OiAnLTMzMywtMjIyLDExNCdcbiAgfSxcbiAgRVBTR180MjU3OiB7XG4gICAgdG93Z3M4NDogJy01ODcuOCw1MTkuNzUsMTQ1Ljc2J1xuICB9LFxuICBFUFNHXzQ2NDY6IHtcbiAgICB0b3dnczg0OiAnLTk2Myw1MTAsLTM1OSdcbiAgfSxcbiAgRVBTR182ODgxOiB7XG4gICAgdG93Z3M4NDogJy0yNCwtMjAzLDI2OCdcbiAgfSxcbiAgRVBTR182ODgyOiB7XG4gICAgdG93Z3M4NDogJy0xODMsLTE1LDI3MydcbiAgfSxcbiAgRVBTR180NzE1OiB7XG4gICAgdG93Z3M4NDogJy0xMDQsLTEyOSwyMzknXG4gIH0sXG4gIElHTkZfUkdGOTNHREQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfUkdNMDRHREQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfUkdTUE0wNkdERDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9SR1RBQUYwN0dERDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9SR0ZHOTVHREQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfUkdOQ0c6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfUkdQRkdERDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9FVFJTODlHOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX1JHUjkyR0REOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNzM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE4MDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NjE5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2Njc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDA3NToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR182NzA2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzc3OTg6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY2MToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NjY5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzg2ODU6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE1MToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR185NzAyOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NTg6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc2MToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzY1OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzg5OTc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDAyMzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NjcwOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2OTQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE0ODoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTYzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNjc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE4OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTkwOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNzY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY1OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR18zODI0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzM4ODk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDA0Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MDgxOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ1NTg6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDQ4Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MDEzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUyNjQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTMyNDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MzU0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUzNzE6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTM3Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MzgxOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUzOTM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTQ4OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181NTkzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzYxMzU6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNjM2NToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MjQ2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzc4ODY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfODQzMToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR184NDI3OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzg2OTk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfODgxODoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzU3OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzkxNDA6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfODA4Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180Njg2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3Mzc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDcwMjoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzQ3OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NDk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY3NDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzU1OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NTk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc2Mjoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzYzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NjQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE2Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTcwOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzU1NDY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNzg0NDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180ODE4OiB7XG4gICAgdG93Z3M4NDogJzU4OSw3Niw0ODAnXG4gIH1cbn07XG5cbmZvciAodmFyIGtleSBpbiBkYXR1bXMpIHtcbiAgdmFyIGRhdHVtID0gZGF0dW1zW2tleV07XG4gIGlmICghZGF0dW0uZGF0dW1OYW1lKSB7XG4gICAgY29udGludWU7XG4gIH1cbiAgZGF0dW1zW2RhdHVtLmRhdHVtTmFtZV0gPSBkYXR1bTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGF0dW1zO1xuIiwidmFyIGVsbGlwc29pZHMgPSB7XG4gIE1FUklUOiB7XG4gICAgYTogNjM3ODEzNyxcbiAgICByZjogMjk4LjI1NyxcbiAgICBlbGxpcHNlTmFtZTogJ01FUklUIDE5ODMnXG4gIH0sXG4gIFNHUzg1OiB7XG4gICAgYTogNjM3ODEzNixcbiAgICByZjogMjk4LjI1NyxcbiAgICBlbGxpcHNlTmFtZTogJ1NvdmlldCBHZW9kZXRpYyBTeXN0ZW0gODUnXG4gIH0sXG4gIEdSUzgwOiB7XG4gICAgYTogNjM3ODEzNyxcbiAgICByZjogMjk4LjI1NzIyMjEwMSxcbiAgICBlbGxpcHNlTmFtZTogJ0dSUyAxOTgwKElVR0csIDE5ODApJ1xuICB9LFxuICBJQVU3Njoge1xuICAgIGE6IDYzNzgxNDAsXG4gICAgcmY6IDI5OC4yNTcsXG4gICAgZWxsaXBzZU5hbWU6ICdJQVUgMTk3NidcbiAgfSxcbiAgYWlyeToge1xuICAgIGE6IDYzNzc1NjMuMzk2LFxuICAgIGI6IDYzNTYyNTYuOTEsXG4gICAgZWxsaXBzZU5hbWU6ICdBaXJ5IDE4MzAnXG4gIH0sXG4gIEFQTDQ6IHtcbiAgICBhOiA2Mzc4MTM3LFxuICAgIHJmOiAyOTguMjUsXG4gICAgZWxsaXBzZU5hbWU6ICdBcHBsLiBQaHlzaWNzLiAxOTY1J1xuICB9LFxuICBOV0w5RDoge1xuICAgIGE6IDYzNzgxNDUsXG4gICAgcmY6IDI5OC4yNSxcbiAgICBlbGxpcHNlTmFtZTogJ05hdmFsIFdlYXBvbnMgTGFiLiwgMTk2NSdcbiAgfSxcbiAgbW9kX2Fpcnk6IHtcbiAgICBhOiA2Mzc3MzQwLjE4OSxcbiAgICBiOiA2MzU2MDM0LjQ0NixcbiAgICBlbGxpcHNlTmFtZTogJ01vZGlmaWVkIEFpcnknXG4gIH0sXG4gIGFuZHJhZToge1xuICAgIGE6IDYzNzcxMDQuNDMsXG4gICAgcmY6IDMwMCxcbiAgICBlbGxpcHNlTmFtZTogJ0FuZHJhZSAxODc2IChEZW4uLCBJY2xuZC4pJ1xuICB9LFxuICBhdXN0X1NBOiB7XG4gICAgYTogNjM3ODE2MCxcbiAgICByZjogMjk4LjI1LFxuICAgIGVsbGlwc2VOYW1lOiAnQXVzdHJhbGlhbiBOYXRsICYgUy4gQW1lci4gMTk2OSdcbiAgfSxcbiAgR1JTNjc6IHtcbiAgICBhOiA2Mzc4MTYwLFxuICAgIHJmOiAyOTguMjQ3MTY3NDI3LFxuICAgIGVsbGlwc2VOYW1lOiAnR1JTIDY3KElVR0cgMTk2NyknXG4gIH0sXG4gIGJlc3NlbDoge1xuICAgIGE6IDYzNzczOTcuMTU1LFxuICAgIHJmOiAyOTkuMTUyODEyOCxcbiAgICBlbGxpcHNlTmFtZTogJ0Jlc3NlbCAxODQxJ1xuICB9LFxuICBiZXNzX25hbToge1xuICAgIGE6IDYzNzc0ODMuODY1LFxuICAgIHJmOiAyOTkuMTUyODEyOCxcbiAgICBlbGxpcHNlTmFtZTogJ0Jlc3NlbCAxODQxIChOYW1pYmlhKSdcbiAgfSxcbiAgY2xyazY2OiB7XG4gICAgYTogNjM3ODIwNi40LFxuICAgIGI6IDYzNTY1ODMuOCxcbiAgICBlbGxpcHNlTmFtZTogJ0NsYXJrZSAxODY2J1xuICB9LFxuICBjbHJrODA6IHtcbiAgICBhOiA2Mzc4MjQ5LjE0NSxcbiAgICByZjogMjkzLjQ2NjMsXG4gICAgZWxsaXBzZU5hbWU6ICdDbGFya2UgMTg4MCBtb2QuJ1xuICB9LFxuICBjbHJrODBpZ246IHtcbiAgICBhOiA2Mzc4MjQ5LjIsXG4gICAgYjogNjM1NjUxNSxcbiAgICByZjogMjkzLjQ2NjAyMTMsXG4gICAgZWxsaXBzZU5hbWU6ICdDbGFya2UgMTg4MCAoSUdOKSdcbiAgfSxcbiAgY2xyazU4OiB7XG4gICAgYTogNjM3ODI5My42NDUyMDg3NTksXG4gICAgcmY6IDI5NC4yNjA2NzYzNjkyNjU0LFxuICAgIGVsbGlwc2VOYW1lOiAnQ2xhcmtlIDE4NTgnXG4gIH0sXG4gIENQTToge1xuICAgIGE6IDYzNzU3MzguNyxcbiAgICByZjogMzM0LjI5LFxuICAgIGVsbGlwc2VOYW1lOiAnQ29tbS4gZGVzIFBvaWRzIGV0IE1lc3VyZXMgMTc5OSdcbiAgfSxcbiAgZGVsbWJyOiB7XG4gICAgYTogNjM3NjQyOCxcbiAgICByZjogMzExLjUsXG4gICAgZWxsaXBzZU5hbWU6ICdEZWxhbWJyZSAxODEwIChCZWxnaXVtKSdcbiAgfSxcbiAgZW5nZWxpczoge1xuICAgIGE6IDYzNzgxMzYuMDUsXG4gICAgcmY6IDI5OC4yNTY2LFxuICAgIGVsbGlwc2VOYW1lOiAnRW5nZWxpcyAxOTg1J1xuICB9LFxuICBldnJzdDMwOiB7XG4gICAgYTogNjM3NzI3Ni4zNDUsXG4gICAgcmY6IDMwMC44MDE3LFxuICAgIGVsbGlwc2VOYW1lOiAnRXZlcmVzdCAxODMwJ1xuICB9LFxuICBldnJzdDQ4OiB7XG4gICAgYTogNjM3NzMwNC4wNjMsXG4gICAgcmY6IDMwMC44MDE3LFxuICAgIGVsbGlwc2VOYW1lOiAnRXZlcmVzdCAxOTQ4J1xuICB9LFxuICBldnJzdDU2OiB7XG4gICAgYTogNjM3NzMwMS4yNDMsXG4gICAgcmY6IDMwMC44MDE3LFxuICAgIGVsbGlwc2VOYW1lOiAnRXZlcmVzdCAxOTU2J1xuICB9LFxuICBldnJzdDY5OiB7XG4gICAgYTogNjM3NzI5NS42NjQsXG4gICAgcmY6IDMwMC44MDE3LFxuICAgIGVsbGlwc2VOYW1lOiAnRXZlcmVzdCAxOTY5J1xuICB9LFxuICBldnJzdFNTOiB7XG4gICAgYTogNjM3NzI5OC41NTYsXG4gICAgcmY6IDMwMC44MDE3LFxuICAgIGVsbGlwc2VOYW1lOiAnRXZlcmVzdCAoU2FiYWggJiBTYXJhd2FrKSdcbiAgfSxcbiAgZnNjaHI2MDoge1xuICAgIGE6IDYzNzgxNjYsXG4gICAgcmY6IDI5OC4zLFxuICAgIGVsbGlwc2VOYW1lOiAnRmlzY2hlciAoTWVyY3VyeSBEYXR1bSkgMTk2MCdcbiAgfSxcbiAgZnNjaHI2MG06IHtcbiAgICBhOiA2Mzc4MTU1LFxuICAgIHJmOiAyOTguMyxcbiAgICBlbGxpcHNlTmFtZTogJ0Zpc2NoZXIgMTk2MCdcbiAgfSxcbiAgZnNjaHI2ODoge1xuICAgIGE6IDYzNzgxNTAsXG4gICAgcmY6IDI5OC4zLFxuICAgIGVsbGlwc2VOYW1lOiAnRmlzY2hlciAxOTY4J1xuICB9LFxuICBoZWxtZXJ0OiB7XG4gICAgYTogNjM3ODIwMCxcbiAgICByZjogMjk4LjMsXG4gICAgZWxsaXBzZU5hbWU6ICdIZWxtZXJ0IDE5MDYnXG4gIH0sXG4gIGhvdWdoOiB7XG4gICAgYTogNjM3ODI3MCxcbiAgICByZjogMjk3LFxuICAgIGVsbGlwc2VOYW1lOiAnSG91Z2gnXG4gIH0sXG4gIGludGw6IHtcbiAgICBhOiA2Mzc4Mzg4LFxuICAgIHJmOiAyOTcsXG4gICAgZWxsaXBzZU5hbWU6ICdJbnRlcm5hdGlvbmFsIDE5MDkgKEhheWZvcmQpJ1xuICB9LFxuICBrYXVsYToge1xuICAgIGE6IDYzNzgxNjMsXG4gICAgcmY6IDI5OC4yNCxcbiAgICBlbGxpcHNlTmFtZTogJ0thdWxhIDE5NjEnXG4gIH0sXG4gIGxlcmNoOiB7XG4gICAgYTogNjM3ODEzOSxcbiAgICByZjogMjk4LjI1NyxcbiAgICBlbGxpcHNlTmFtZTogJ0xlcmNoIDE5NzknXG4gIH0sXG4gIG1wcnRzOiB7XG4gICAgYTogNjM5NzMwMCxcbiAgICByZjogMTkxLFxuICAgIGVsbGlwc2VOYW1lOiAnTWF1cGVydGl1cyAxNzM4J1xuICB9LFxuICBuZXdfaW50bDoge1xuICAgIGE6IDYzNzgxNTcuNSxcbiAgICBiOiA2MzU2NzcyLjIsXG4gICAgZWxsaXBzZU5hbWU6ICdOZXcgSW50ZXJuYXRpb25hbCAxOTY3J1xuICB9LFxuICBwbGVzc2lzOiB7XG4gICAgYTogNjM3NjUyMyxcbiAgICByZjogNjM1NTg2MyxcbiAgICBlbGxpcHNlTmFtZTogJ1BsZXNzaXMgMTgxNyAoRnJhbmNlKSdcbiAgfSxcbiAga3Jhc3M6IHtcbiAgICBhOiA2Mzc4MjQ1LFxuICAgIHJmOiAyOTguMyxcbiAgICBlbGxpcHNlTmFtZTogJ0tyYXNzb3Zza3ksIDE5NDInXG4gIH0sXG4gIFNFYXNpYToge1xuICAgIGE6IDYzNzgxNTUsXG4gICAgYjogNjM1Njc3My4zMjA1LFxuICAgIGVsbGlwc2VOYW1lOiAnU291dGhlYXN0IEFzaWEnXG4gIH0sXG4gIHdhbGJlY2s6IHtcbiAgICBhOiA2Mzc2ODk2LFxuICAgIGI6IDYzNTU4MzQuODQ2NyxcbiAgICBlbGxpcHNlTmFtZTogJ1dhbGJlY2snXG4gIH0sXG4gIFdHUzYwOiB7XG4gICAgYTogNjM3ODE2NSxcbiAgICByZjogMjk4LjMsXG4gICAgZWxsaXBzZU5hbWU6ICdXR1MgNjAnXG4gIH0sXG4gIFdHUzY2OiB7XG4gICAgYTogNjM3ODE0NSxcbiAgICByZjogMjk4LjI1LFxuICAgIGVsbGlwc2VOYW1lOiAnV0dTIDY2J1xuICB9LFxuICBXR1M3OiB7XG4gICAgYTogNjM3ODEzNSxcbiAgICByZjogMjk4LjI2LFxuICAgIGVsbGlwc2VOYW1lOiAnV0dTIDcyJ1xuICB9LFxuICBXR1M4NDoge1xuICAgIGE6IDYzNzgxMzcsXG4gICAgcmY6IDI5OC4yNTcyMjM1NjMsXG4gICAgZWxsaXBzZU5hbWU6ICdXR1MgODQnXG4gIH0sXG4gIHNwaGVyZToge1xuICAgIGE6IDYzNzA5OTcsXG4gICAgYjogNjM3MDk5NyxcbiAgICBlbGxpcHNlTmFtZTogJ05vcm1hbCBTcGhlcmUgKHI9NjM3MDk5NyknXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGVsbGlwc29pZHM7XG4iLCJ2YXIgcHJpbWVNZXJpZGlhbiA9IHt9O1xuXG5wcmltZU1lcmlkaWFuLmdyZWVud2ljaCA9IDAuMDsgLy8gXCIwZEVcIixcbnByaW1lTWVyaWRpYW4ubGlzYm9uID0gLTkuMTMxOTA2MTExMTExOyAvLyBcIjlkMDcnNTQuODYyXFxcIldcIixcbnByaW1lTWVyaWRpYW4ucGFyaXMgPSAyLjMzNzIyOTE2NjY2NzsgLy8gXCIyZDIwJzE0LjAyNVxcXCJFXCIsXG5wcmltZU1lcmlkaWFuLmJvZ290YSA9IC03NC4wODA5MTY2NjY2Njc7IC8vIFwiNzRkMDQnNTEuM1xcXCJXXCIsXG5wcmltZU1lcmlkaWFuLm1hZHJpZCA9IC0zLjY4NzkzODg4ODg4OTsgLy8gXCIzZDQxJzE2LjU4XFxcIldcIixcbnByaW1lTWVyaWRpYW4ucm9tZSA9IDEyLjQ1MjMzMzMzMzMzMzsgLy8gXCIxMmQyNyc4LjRcXFwiRVwiLFxucHJpbWVNZXJpZGlhbi5iZXJuID0gNy40Mzk1ODMzMzMzMzM7IC8vIFwiN2QyNicyMi41XFxcIkVcIixcbnByaW1lTWVyaWRpYW4uamFrYXJ0YSA9IDEwNi44MDc3MTk0NDQ0NDQ7IC8vIFwiMTA2ZDQ4JzI3Ljc5XFxcIkVcIixcbnByaW1lTWVyaWRpYW4uZmVycm8gPSAtMTcuNjY2NjY2NjY2NjY3OyAvLyBcIjE3ZDQwJ1dcIixcbnByaW1lTWVyaWRpYW4uYnJ1c3NlbHMgPSA0LjM2Nzk3NTsgLy8gXCI0ZDIyJzQuNzFcXFwiRVwiLFxucHJpbWVNZXJpZGlhbi5zdG9ja2hvbG0gPSAxOC4wNTgyNzc3Nzc3Nzg7IC8vIFwiMThkMycyOS44XFxcIkVcIixcbnByaW1lTWVyaWRpYW4uYXRoZW5zID0gMjMuNzE2MzM3NTsgLy8gXCIyM2Q0Mic1OC44MTVcXFwiRVwiLFxucHJpbWVNZXJpZGlhbi5vc2xvID0gMTAuNzIyOTE2NjY2NjY3OyAvLyBcIjEwZDQzJzIyLjVcXFwiRVwiXG5cbmV4cG9ydCBkZWZhdWx0IHByaW1lTWVyaWRpYW47XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIG1tOiB7IHRvX21ldGVyOiAwLjAwMSB9LFxuICBjbTogeyB0b19tZXRlcjogMC4wMSB9LFxuICBmdDogeyB0b19tZXRlcjogMC4zMDQ4IH0sXG4gICd1cy1mdCc6IHsgdG9fbWV0ZXI6IDEyMDAgLyAzOTM3IH0sXG4gIGZhdGg6IHsgdG9fbWV0ZXI6IDEuODI4OCB9LFxuICBrbWk6IHsgdG9fbWV0ZXI6IDE4NTIgfSxcbiAgJ3VzLWNoJzogeyB0b19tZXRlcjogMjAuMTE2ODQwMjMzNjgwNSB9LFxuICAndXMtbWknOiB7IHRvX21ldGVyOiAxNjA5LjM0NzIxODY5NDQ0IH0sXG4gIGttOiB7IHRvX21ldGVyOiAxMDAwIH0sXG4gICdpbmQtZnQnOiB7IHRvX21ldGVyOiAwLjMwNDc5ODQxIH0sXG4gICdpbmQteWQnOiB7IHRvX21ldGVyOiAwLjkxNDM5NTIzIH0sXG4gIG1pOiB7IHRvX21ldGVyOiAxNjA5LjM0NCB9LFxuICB5ZDogeyB0b19tZXRlcjogMC45MTQ0IH0sXG4gIGNoOiB7IHRvX21ldGVyOiAyMC4xMTY4IH0sXG4gIGxpbms6IHsgdG9fbWV0ZXI6IDAuMjAxMTY4IH0sXG4gIGRtOiB7IHRvX21ldGVyOiAwLjEgfSxcbiAgaW46IHsgdG9fbWV0ZXI6IDAuMDI1NCB9LFxuICAnaW5kLWNoJzogeyB0b19tZXRlcjogMjAuMTE2Njk1MDYgfSxcbiAgJ3VzLWluJzogeyB0b19tZXRlcjogMC4wMjU0MDAwNTA4MDAxMDEgfSxcbiAgJ3VzLXlkJzogeyB0b19tZXRlcjogMC45MTQ0MDE4Mjg4MDM2NTggfVxufTtcbiIsImV4cG9ydCB2YXIgUEpEXzNQQVJBTSA9IDE7XG5leHBvcnQgdmFyIFBKRF83UEFSQU0gPSAyO1xuZXhwb3J0IHZhciBQSkRfR1JJRFNISUZUID0gMztcbmV4cG9ydCB2YXIgUEpEX1dHUzg0ID0gNDsgLy8gV0dTODQgb3IgZXF1aXZhbGVudFxuZXhwb3J0IHZhciBQSkRfTk9EQVRVTSA9IDU7IC8vIFdHUzg0IG9yIGVxdWl2YWxlbnRcbmV4cG9ydCB2YXIgU1JTX1dHUzg0X1NFTUlNQUpPUiA9IDYzNzgxMzcuMDsgLy8gb25seSB1c2VkIGluIGdyaWQgc2hpZnQgdHJhbnNmb3Jtc1xuZXhwb3J0IHZhciBTUlNfV0dTODRfU0VNSU1JTk9SID0gNjM1Njc1Mi4zMTQ7IC8vIG9ubHkgdXNlZCBpbiBncmlkIHNoaWZ0IHRyYW5zZm9ybXNcbmV4cG9ydCB2YXIgU1JTX1dHUzg0X0VTUVVBUkVEID0gMC4wMDY2OTQzNzk5OTAxNDEzMTY1OyAvLyBvbmx5IHVzZWQgaW4gZ3JpZCBzaGlmdCB0cmFuc2Zvcm1zXG5leHBvcnQgdmFyIFNFQ19UT19SQUQgPSA0Ljg0ODEzNjgxMTA5NTM1OTkzNTg5OTE0MTAyMzU3ZS02O1xuZXhwb3J0IHZhciBIQUxGX1BJID0gTWF0aC5QSSAvIDI7XG4vLyBlbGxpcG9pZCBwal9zZXRfZWxsLmNcbmV4cG9ydCB2YXIgU0lYVEggPSAwLjE2NjY2NjY2NjY2NjY2NjY2Njc7XG4vKiAxLzYgKi9cbmV4cG9ydCB2YXIgUkE0ID0gMC4wNDcyMjIyMjIyMjIyMjIyMjIyMjtcbi8qIDE3LzM2MCAqL1xuZXhwb3J0IHZhciBSQTYgPSAwLjAyMjE1NjA4NDY1NjA4NDY1NjA4O1xuZXhwb3J0IHZhciBFUFNMTiA9IDEuMGUtMTA7XG4vLyB5b3UnZCB0aGluayB5b3UgY291bGQgdXNlIE51bWJlci5FUFNJTE9OIGFib3ZlIGJ1dCB0aGF0IG1ha2VzXG4vLyBNb2xsd2VpZGUgZ2V0IGludG8gYW4gaW5maW5hdGUgbG9vcC5cblxuZXhwb3J0IHZhciBEMlIgPSAwLjAxNzQ1MzI5MjUxOTk0MzI5NTc3O1xuZXhwb3J0IHZhciBSMkQgPSA1Ny4yOTU3Nzk1MTMwODIzMjA4ODtcbmV4cG9ydCB2YXIgRk9SVFBJID0gTWF0aC5QSSAvIDQ7XG5leHBvcnQgdmFyIFRXT19QSSA9IE1hdGguUEkgKiAyO1xuLy8gU1BJIGlzIHNsaWdodGx5IGdyZWF0ZXIgdGhhbiBNYXRoLlBJLCBzbyB2YWx1ZXMgdGhhdCBleGNlZWQgdGhlIC0xODAuLjE4MFxuLy8gZGVncmVlIHJhbmdlIGJ5IGEgdGlueSBhbW91bnQgZG9uJ3QgZ2V0IHdyYXBwZWQuIFRoaXMgcHJldmVudHMgcG9pbnRzIHRoYXRcbi8vIGhhdmUgZHJpZnRlZCBmcm9tIHRoZWlyIG9yaWdpbmFsIGxvY2F0aW9uIGFsb25nIHRoZSAxODB0aCBtZXJpZGlhbiAoZHVlIHRvXG4vLyBmbG9hdGluZyBwb2ludCBlcnJvcikgZnJvbSBjaGFuZ2luZyB0aGVpciBzaWduLlxuZXhwb3J0IHZhciBTUEkgPSAzLjE0MTU5MjY1MzU5O1xuIiwiaW1wb3J0IHByb2ogZnJvbSAnLi9Qcm9qJztcbmltcG9ydCB0cmFuc2Zvcm0gZnJvbSAnLi90cmFuc2Zvcm0nO1xudmFyIHdnczg0ID0gcHJvaignV0dTODQnKTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7e3g6IG51bWJlciwgeTogbnVtYmVyLCB6PzogbnVtYmVyLCBtPzogbnVtYmVyfX0gSW50ZXJmYWNlQ29vcmRpbmF0ZXNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtBcnJheTxudW1iZXI+IHwgSW50ZXJmYWNlQ29vcmRpbmF0ZXN9IFRlbXBsYXRlQ29vcmRpbmF0ZXNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENvbnZlcnRlclxuICogQHByb3BlcnR5IHs8VCBleHRlbmRzIFRlbXBsYXRlQ29vcmRpbmF0ZXM+KGNvb3JkaW5hdGVzOiBULCBlbmZvcmNlQXhpcz86IGJvb2xlYW4pID0+IFR9IGZvcndhcmRcbiAqIEBwcm9wZXJ0eSB7PFQgZXh0ZW5kcyBUZW1wbGF0ZUNvb3JkaW5hdGVzPihjb29yZGluYXRlczogVCwgZW5mb3JjZUF4aXM/OiBib29sZWFuKSA9PiBUfSBpbnZlcnNlXG4gKiBAcHJvcGVydHkge3Byb2p9IFtvUHJval1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFBST0pKU09ORGVmaW5pdGlvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IFskc2NoZW1hXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV1cbiAqIEBwcm9wZXJ0eSB7e2F1dGhvcml0eTogc3RyaW5nLCBjb2RlOiBudW1iZXJ9fSBbaWRdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Njb3BlXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFthcmVhXVxuICogQHByb3BlcnR5IHt7c291dGhfbGF0aXR1ZGU6IG51bWJlciwgd2VzdF9sb25naXR1ZGU6IG51bWJlciwgbm9ydGhfbGF0aXR1ZGU6IG51bWJlciwgZWFzdF9sb25naXR1ZGU6IG51bWJlcn19IFtiYm94XVxuICogQHByb3BlcnR5IHtQUk9KSlNPTkRlZmluaXRpb25bXX0gW2NvbXBvbmVudHNdXG4gKiBAcHJvcGVydHkge3t0eXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZ319IFtkYXR1bV1cbiAqIEBwcm9wZXJ0eSB7e1xuICogICBuYW1lOiBzdHJpbmcsXG4gKiAgIG1lbWJlcnM6IEFycmF5PHtcbiAqICAgICBuYW1lOiBzdHJpbmcsXG4gKiAgICAgaWQ/OiB7YXV0aG9yaXR5OiBzdHJpbmcsIGNvZGU6IG51bWJlcn1cbiAqICAgfT4sXG4gKiAgIGVsbGlwc29pZD86IHtcbiAqICAgICBuYW1lOiBzdHJpbmcsXG4gKiAgICAgc2VtaV9tYWpvcl9heGlzOiBudW1iZXIsXG4gKiAgICAgaW52ZXJzZV9mbGF0dGVuaW5nPzogbnVtYmVyXG4gKiAgIH0sXG4gKiAgIGFjY3VyYWN5Pzogc3RyaW5nLFxuICogICBpZD86IHthdXRob3JpdHk6IHN0cmluZywgY29kZTogbnVtYmVyfVxuICogfX0gW2RhdHVtX2Vuc2VtYmxlXVxuICogQHByb3BlcnR5IHt7XG4gKiAgIHN1YnR5cGU6IHN0cmluZyxcbiAqICAgYXhpczogQXJyYXk8e1xuICogICAgIG5hbWU6IHN0cmluZyxcbiAqICAgICBhYmJyZXZpYXRpb24/OiBzdHJpbmcsXG4gKiAgICAgZGlyZWN0aW9uOiBzdHJpbmcsXG4gKiAgICAgdW5pdDogc3RyaW5nXG4gKiAgIH0+XG4gKiB9fSBbY29vcmRpbmF0ZV9zeXN0ZW1dXG4gKiBAcHJvcGVydHkge3tcbiAqICAgbmFtZTogc3RyaW5nLFxuICogICBtZXRob2Q6IHtuYW1lOiBzdHJpbmd9LFxuICogICBwYXJhbWV0ZXJzOiBBcnJheTx7XG4gKiAgICAgbmFtZTogc3RyaW5nLFxuICogICAgIHZhbHVlOiBudW1iZXIsXG4gKiAgICAgdW5pdD86IHN0cmluZ1xuICogICB9PlxuICogfX0gW2NvbnZlcnNpb25dXG4gKiBAcHJvcGVydHkge3tcbiAqICAgbmFtZTogc3RyaW5nLFxuICogICBtZXRob2Q6IHtuYW1lOiBzdHJpbmd9LFxuICogICBwYXJhbWV0ZXJzOiBBcnJheTx7XG4gKiAgICAgbmFtZTogc3RyaW5nLFxuICogICAgIHZhbHVlOiBudW1iZXIsXG4gKiAgICAgdW5pdD86IHN0cmluZyxcbiAqICAgICB0eXBlPzogc3RyaW5nLFxuICogICAgIGZpbGVfbmFtZT86IHN0cmluZ1xuICogICB9PlxuICogfX0gW3RyYW5zZm9ybWF0aW9uXVxuICovXG5cbi8qKlxuICogQHRlbXBsYXRlIHtUZW1wbGF0ZUNvb3JkaW5hdGVzfSBUXG4gKiBAcGFyYW0ge3Byb2p9IGZyb21cbiAqIEBwYXJhbSB7cHJvan0gdG9cbiAqIEBwYXJhbSB7VH0gY29vcmRzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtlbmZvcmNlQXhpc11cbiAqIEByZXR1cm5zIHtUfVxuICovXG5mdW5jdGlvbiB0cmFuc2Zvcm1lcihmcm9tLCB0bywgY29vcmRzLCBlbmZvcmNlQXhpcykge1xuICB2YXIgdHJhbnNmb3JtZWRBcnJheSwgb3V0LCBrZXlzO1xuICBpZiAoQXJyYXkuaXNBcnJheShjb29yZHMpKSB7XG4gICAgdHJhbnNmb3JtZWRBcnJheSA9IHRyYW5zZm9ybShmcm9tLCB0bywgY29vcmRzLCBlbmZvcmNlQXhpcykgfHwgeyB4OiBOYU4sIHk6IE5hTiB9O1xuICAgIGlmIChjb29yZHMubGVuZ3RoID4gMikge1xuICAgICAgaWYgKCh0eXBlb2YgZnJvbS5uYW1lICE9PSAndW5kZWZpbmVkJyAmJiBmcm9tLm5hbWUgPT09ICdnZW9jZW50JykgfHwgKHR5cGVvZiB0by5uYW1lICE9PSAndW5kZWZpbmVkJyAmJiB0by5uYW1lID09PSAnZ2VvY2VudCcpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdHJhbnNmb3JtZWRBcnJheS56ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiAvKiogQHR5cGUge1R9ICovIChbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnksIHRyYW5zZm9ybWVkQXJyYXkuel0uY29uY2F0KGNvb3Jkcy5zbGljZSgzKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAvKiogQHR5cGUge1R9ICovIChbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnksIGNvb3Jkc1syXV0uY29uY2F0KGNvb3Jkcy5zbGljZSgzKSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gLyoqIEB0eXBlIHtUfSAqLyAoW3RyYW5zZm9ybWVkQXJyYXkueCwgdHJhbnNmb3JtZWRBcnJheS55XS5jb25jYXQoY29vcmRzLnNsaWNlKDIpKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAvKiogQHR5cGUge1R9ICovIChbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb3V0ID0gdHJhbnNmb3JtKGZyb20sIHRvLCBjb29yZHMsIGVuZm9yY2VBeGlzKTtcbiAgICBrZXlzID0gT2JqZWN0LmtleXMoY29vcmRzKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiAvKiogQHR5cGUge1R9ICovIChvdXQpO1xuICAgIH1cbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKCh0eXBlb2YgZnJvbS5uYW1lICE9PSAndW5kZWZpbmVkJyAmJiBmcm9tLm5hbWUgPT09ICdnZW9jZW50JykgfHwgKHR5cGVvZiB0by5uYW1lICE9PSAndW5kZWZpbmVkJyAmJiB0by5uYW1lID09PSAnZ2VvY2VudCcpKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICd4JyB8fCBrZXkgPT09ICd5JyB8fCBrZXkgPT09ICd6Jykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3gnIHx8IGtleSA9PT0gJ3knKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvdXRba2V5XSA9IGNvb3Jkc1trZXldO1xuICAgIH0pO1xuICAgIHJldHVybiAvKiogQHR5cGUge1R9ICovIChvdXQpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtwcm9qIHwgc3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgQ29udmVydGVyfSBpdGVtXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL1Byb2onKS5kZWZhdWx0fVxuICovXG5mdW5jdGlvbiBjaGVja1Byb2ooaXRlbSkge1xuICBpZiAoaXRlbSBpbnN0YW5jZW9mIHByb2opIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICdvUHJvaicgaW4gaXRlbSkge1xuICAgIHJldHVybiBpdGVtLm9Qcm9qO1xuICB9XG4gIHJldHVybiBwcm9qKC8qKiBAdHlwZSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9ufSAqLyAoaXRlbSkpO1xufVxuXG4vKipcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qfSB0b1Byb2pcbiAqIEByZXR1cm5zIHtDb252ZXJ0ZXJ9XG4gKi9cbi8qKlxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2p9IGZyb21Qcm9qXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2p9IHRvUHJvalxuICogQHJldHVybnMge0NvbnZlcnRlcn1cbiAqL1xuLyoqXG4gKiBAdGVtcGxhdGUge1RlbXBsYXRlQ29vcmRpbmF0ZXN9IFRcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qfSB0b1Byb2pcbiAqIEBwYXJhbSB7VH0gY29vcmRcbiAqIEByZXR1cm5zIHtUfVxuICovXG4vKipcbiAqIEB0ZW1wbGF0ZSB7VGVtcGxhdGVDb29yZGluYXRlc30gVFxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2p9IGZyb21Qcm9qXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2p9IHRvUHJvalxuICogQHBhcmFtIHtUfSBjb29yZFxuICogQHJldHVybnMge1R9XG4gKi9cbi8qKlxuICogQHRlbXBsYXRlIHtUZW1wbGF0ZUNvb3JkaW5hdGVzfSBUXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2p9IGZyb21Qcm9qT3JUb1Byb2pcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvaiB8IFRlbXBsYXRlQ29vcmRpbmF0ZXN9IFt0b1Byb2pPckNvb3JkXVxuICogQHBhcmFtIHtUfSBbY29vcmRdXG4gKiBAcmV0dXJucyB7VHxDb252ZXJ0ZXJ9XG4gKi9cbmZ1bmN0aW9uIHByb2o0KGZyb21Qcm9qT3JUb1Byb2osIHRvUHJvak9yQ29vcmQsIGNvb3JkKSB7XG4gIC8qKiBAdHlwZSB7cHJvan0gKi9cbiAgdmFyIGZyb21Qcm9qO1xuICAvKiogQHR5cGUge3Byb2p9ICovXG4gIHZhciB0b1Byb2o7XG4gIHZhciBzaW5nbGUgPSBmYWxzZTtcbiAgLyoqIEB0eXBlIHtDb252ZXJ0ZXJ9ICovXG4gIHZhciBvYmo7XG4gIGlmICh0eXBlb2YgdG9Qcm9qT3JDb29yZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0b1Byb2ogPSBjaGVja1Byb2ooZnJvbVByb2pPclRvUHJvaik7XG4gICAgZnJvbVByb2ogPSB3Z3M4NDtcbiAgICBzaW5nbGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiAvKiogQHR5cGUgez99ICovICh0b1Byb2pPckNvb3JkKS54ICE9PSAndW5kZWZpbmVkJyB8fCBBcnJheS5pc0FycmF5KHRvUHJvak9yQ29vcmQpKSB7XG4gICAgY29vcmQgPSAvKiogQHR5cGUge1R9ICovICgvKiogQHR5cGUgez99ICovICh0b1Byb2pPckNvb3JkKSk7XG4gICAgdG9Qcm9qID0gY2hlY2tQcm9qKGZyb21Qcm9qT3JUb1Byb2opO1xuICAgIGZyb21Qcm9qID0gd2dzODQ7XG4gICAgc2luZ2xlID0gdHJ1ZTtcbiAgfVxuICBpZiAoIWZyb21Qcm9qKSB7XG4gICAgZnJvbVByb2ogPSBjaGVja1Byb2ooZnJvbVByb2pPclRvUHJvaik7XG4gIH1cbiAgaWYgKCF0b1Byb2opIHtcbiAgICB0b1Byb2ogPSBjaGVja1Byb2ooLyoqIEB0eXBlIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qIH0gKi8gKHRvUHJvak9yQ29vcmQpKTtcbiAgfVxuICBpZiAoY29vcmQpIHtcbiAgICByZXR1cm4gdHJhbnNmb3JtZXIoZnJvbVByb2osIHRvUHJvaiwgY29vcmQpO1xuICB9IGVsc2Uge1xuICAgIG9iaiA9IHtcbiAgICAgIC8qKlxuICAgICAgICogQHRlbXBsYXRlIHtUZW1wbGF0ZUNvb3JkaW5hdGVzfSBUXG4gICAgICAgKiBAcGFyYW0ge1R9IGNvb3Jkc1xuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gZW5mb3JjZUF4aXNcbiAgICAgICAqIEByZXR1cm5zIHtUfVxuICAgICAgICovXG4gICAgICBmb3J3YXJkOiBmdW5jdGlvbiAoY29vcmRzLCBlbmZvcmNlQXhpcykge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtZXIoZnJvbVByb2osIHRvUHJvaiwgY29vcmRzLCBlbmZvcmNlQXhpcyk7XG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBAdGVtcGxhdGUge1RlbXBsYXRlQ29vcmRpbmF0ZXN9IFRcbiAgICAgICAqIEBwYXJhbSB7VH0gY29vcmRzXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBlbmZvcmNlQXhpc1xuICAgICAgICogQHJldHVybnMge1R9XG4gICAgICAgKi9cbiAgICAgIGludmVyc2U6IGZ1bmN0aW9uIChjb29yZHMsIGVuZm9yY2VBeGlzKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcih0b1Byb2osIGZyb21Qcm9qLCBjb29yZHMsIGVuZm9yY2VBeGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgIG9iai5vUHJvaiA9IHRvUHJvajtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcm9qNDtcbiIsImltcG9ydCB7IFBKRF8zUEFSQU0sIFBKRF83UEFSQU0sIFBKRF9HUklEU0hJRlQsIFBKRF9XR1M4NCwgUEpEX05PREFUVU0sIFNFQ19UT19SQUQgfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5mdW5jdGlvbiBkYXR1bShkYXR1bUNvZGUsIGRhdHVtX3BhcmFtcywgYSwgYiwgZXMsIGVwMiwgbmFkZ3JpZHMpIHtcbiAgdmFyIG91dCA9IHt9O1xuXG4gIGlmIChkYXR1bUNvZGUgPT09IHVuZGVmaW5lZCB8fCBkYXR1bUNvZGUgPT09ICdub25lJykge1xuICAgIG91dC5kYXR1bV90eXBlID0gUEpEX05PREFUVU07XG4gIH0gZWxzZSB7XG4gICAgb3V0LmRhdHVtX3R5cGUgPSBQSkRfV0dTODQ7XG4gIH1cblxuICBpZiAoZGF0dW1fcGFyYW1zKSB7XG4gICAgb3V0LmRhdHVtX3BhcmFtcyA9IGRhdHVtX3BhcmFtcy5tYXAocGFyc2VGbG9hdCk7XG4gICAgaWYgKG91dC5kYXR1bV9wYXJhbXNbMF0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1sxXSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzJdICE9PSAwKSB7XG4gICAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF8zUEFSQU07XG4gICAgfVxuICAgIGlmIChvdXQuZGF0dW1fcGFyYW1zLmxlbmd0aCA+IDMpIHtcbiAgICAgIGlmIChvdXQuZGF0dW1fcGFyYW1zWzNdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbNF0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1s1XSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzZdICE9PSAwKSB7XG4gICAgICAgIG91dC5kYXR1bV90eXBlID0gUEpEXzdQQVJBTTtcbiAgICAgICAgb3V0LmRhdHVtX3BhcmFtc1szXSAqPSBTRUNfVE9fUkFEO1xuICAgICAgICBvdXQuZGF0dW1fcGFyYW1zWzRdICo9IFNFQ19UT19SQUQ7XG4gICAgICAgIG91dC5kYXR1bV9wYXJhbXNbNV0gKj0gU0VDX1RPX1JBRDtcbiAgICAgICAgb3V0LmRhdHVtX3BhcmFtc1s2XSA9IChvdXQuZGF0dW1fcGFyYW1zWzZdIC8gMTAwMDAwMC4wKSArIDEuMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAobmFkZ3JpZHMpIHtcbiAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF9HUklEU0hJRlQ7XG4gICAgb3V0LmdyaWRzID0gbmFkZ3JpZHM7XG4gIH1cbiAgb3V0LmEgPSBhOyAvLyBkYXR1bSBvYmplY3QgYWxzbyB1c2VzIHRoZXNlIHZhbHVlc1xuICBvdXQuYiA9IGI7XG4gIG91dC5lcyA9IGVzO1xuICBvdXQuZXAyID0gZXAyO1xuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkYXR1bTtcbiIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCB7IFBKRF8zUEFSQU0sIFBKRF83UEFSQU0sIEhBTEZfUEkgfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBhcmVEYXR1bXMoc291cmNlLCBkZXN0KSB7XG4gIGlmIChzb3VyY2UuZGF0dW1fdHlwZSAhPT0gZGVzdC5kYXR1bV90eXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlOyAvLyBmYWxzZSwgZGF0dW1zIGFyZSBub3QgZXF1YWxcbiAgfSBlbHNlIGlmIChzb3VyY2UuYSAhPT0gZGVzdC5hIHx8IE1hdGguYWJzKHNvdXJjZS5lcyAtIGRlc3QuZXMpID4gMC4wMDAwMDAwMDAwNTApIHtcbiAgICAvLyB0aGUgdG9sZXJhbmNlIGZvciBlcyBpcyB0byBlbnN1cmUgdGhhdCBHUlM4MCBhbmQgV0dTODRcbiAgICAvLyBhcmUgY29uc2lkZXJlZCBpZGVudGljYWxcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAoc291cmNlLmRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0pIHtcbiAgICByZXR1cm4gKHNvdXJjZS5kYXR1bV9wYXJhbXNbMF0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzBdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMV0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzFdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMl0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzJdKTtcbiAgfSBlbHNlIGlmIChzb3VyY2UuZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSkge1xuICAgIHJldHVybiAoc291cmNlLmRhdHVtX3BhcmFtc1swXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMF0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1sxXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMV0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1syXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMl0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1szXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbM10gJiYgc291cmNlLmRhdHVtX3BhcmFtc1s0XSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbNF0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1s1XSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbNV0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1s2XSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbNl0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlOyAvLyBkYXR1bXMgYXJlIGVxdWFsXG4gIH1cbn0gLy8gY3NfY29tcGFyZV9kYXR1bXMoKVxuXG4vKlxuICogVGhlIGZ1bmN0aW9uIENvbnZlcnRfR2VvZGV0aWNfVG9fR2VvY2VudHJpYyBjb252ZXJ0cyBnZW9kZXRpYyBjb29yZGluYXRlc1xuICogKGxhdGl0dWRlLCBsb25naXR1ZGUsIGFuZCBoZWlnaHQpIHRvIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMgKFgsIFksIFopLFxuICogYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IGVsbGlwc29pZCBwYXJhbWV0ZXJzLlxuICpcbiAqICAgIExhdGl0dWRlICA6IEdlb2RldGljIGxhdGl0dWRlIGluIHJhZGlhbnMgICAgICAgICAgICAgICAgICAgICAoaW5wdXQpXG4gKiAgICBMb25naXR1ZGUgOiBHZW9kZXRpYyBsb25naXR1ZGUgaW4gcmFkaWFucyAgICAgICAgICAgICAgICAgICAgKGlucHV0KVxuICogICAgSGVpZ2h0ICAgIDogR2VvZGV0aWMgaGVpZ2h0LCBpbiBtZXRlcnMgICAgICAgICAgICAgICAgICAgICAgIChpbnB1dClcbiAqICAgIFggICAgICAgICA6IENhbGN1bGF0ZWQgR2VvY2VudHJpYyBYIGNvb3JkaW5hdGUsIGluIG1ldGVycyAgICAob3V0cHV0KVxuICogICAgWSAgICAgICAgIDogQ2FsY3VsYXRlZCBHZW9jZW50cmljIFkgY29vcmRpbmF0ZSwgaW4gbWV0ZXJzICAgIChvdXRwdXQpXG4gKiAgICBaICAgICAgICAgOiBDYWxjdWxhdGVkIEdlb2NlbnRyaWMgWiBjb29yZGluYXRlLCBpbiBtZXRlcnMgICAgKG91dHB1dClcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW9kZXRpY1RvR2VvY2VudHJpYyhwLCBlcywgYSkge1xuICB2YXIgTG9uZ2l0dWRlID0gcC54O1xuICB2YXIgTGF0aXR1ZGUgPSBwLnk7XG4gIHZhciBIZWlnaHQgPSBwLnogPyBwLnogOiAwOyAvLyBaIHZhbHVlIG5vdCBhbHdheXMgc3VwcGxpZWRcblxuICB2YXIgUm47IC8qICBFYXJ0aCByYWRpdXMgYXQgbG9jYXRpb24gICovXG4gIHZhciBTaW5fTGF0OyAvKiAgTWF0aC5zaW4oTGF0aXR1ZGUpICAqL1xuICB2YXIgU2luMl9MYXQ7IC8qICBTcXVhcmUgb2YgTWF0aC5zaW4oTGF0aXR1ZGUpICAqL1xuICB2YXIgQ29zX0xhdDsgLyogIE1hdGguY29zKExhdGl0dWRlKSAgKi9cblxuICAvKlxuICAgKiogRG9uJ3QgYmxvdyB1cCBpZiBMYXRpdHVkZSBpcyBqdXN0IGEgbGl0dGxlIG91dCBvZiB0aGUgdmFsdWVcbiAgICoqIHJhbmdlIGFzIGl0IG1heSBqdXN0IGJlIGEgcm91bmRpbmcgaXNzdWUuICBBbHNvIHJlbW92ZWQgbG9uZ2l0dWRlXG4gICAqKiB0ZXN0LCBpdCBzaG91bGQgYmUgd3JhcHBlZCBieSBNYXRoLmNvcygpIGFuZCBNYXRoLnNpbigpLiAgTkZXIGZvciBQUk9KLjQsIFNlcC8yMDAxLlxuICAgKi9cbiAgaWYgKExhdGl0dWRlIDwgLUhBTEZfUEkgJiYgTGF0aXR1ZGUgPiAtMS4wMDEgKiBIQUxGX1BJKSB7XG4gICAgTGF0aXR1ZGUgPSAtSEFMRl9QSTtcbiAgfSBlbHNlIGlmIChMYXRpdHVkZSA+IEhBTEZfUEkgJiYgTGF0aXR1ZGUgPCAxLjAwMSAqIEhBTEZfUEkpIHtcbiAgICBMYXRpdHVkZSA9IEhBTEZfUEk7XG4gIH0gZWxzZSBpZiAoTGF0aXR1ZGUgPCAtSEFMRl9QSSkge1xuICAgIC8qIExhdGl0dWRlIG91dCBvZiByYW5nZSAqL1xuICAgIC8vIC4ucmVwb3J0RXJyb3IoJ2dlb2NlbnQ6bGF0IG91dCBvZiByYW5nZTonICsgTGF0aXR1ZGUpO1xuICAgIHJldHVybiB7IHg6IC1JbmZpbml0eSwgeTogLUluZmluaXR5LCB6OiBwLnogfTtcbiAgfSBlbHNlIGlmIChMYXRpdHVkZSA+IEhBTEZfUEkpIHtcbiAgICAvKiBMYXRpdHVkZSBvdXQgb2YgcmFuZ2UgKi9cbiAgICByZXR1cm4geyB4OiBJbmZpbml0eSwgeTogSW5maW5pdHksIHo6IHAueiB9O1xuICB9XG5cbiAgaWYgKExvbmdpdHVkZSA+IE1hdGguUEkpIHtcbiAgICBMb25naXR1ZGUgLT0gKDIgKiBNYXRoLlBJKTtcbiAgfVxuICBTaW5fTGF0ID0gTWF0aC5zaW4oTGF0aXR1ZGUpO1xuICBDb3NfTGF0ID0gTWF0aC5jb3MoTGF0aXR1ZGUpO1xuICBTaW4yX0xhdCA9IFNpbl9MYXQgKiBTaW5fTGF0O1xuICBSbiA9IGEgLyAoTWF0aC5zcXJ0KDEuMGUwIC0gZXMgKiBTaW4yX0xhdCkpO1xuICByZXR1cm4ge1xuICAgIHg6IChSbiArIEhlaWdodCkgKiBDb3NfTGF0ICogTWF0aC5jb3MoTG9uZ2l0dWRlKSxcbiAgICB5OiAoUm4gKyBIZWlnaHQpICogQ29zX0xhdCAqIE1hdGguc2luKExvbmdpdHVkZSksXG4gICAgejogKChSbiAqICgxIC0gZXMpKSArIEhlaWdodCkgKiBTaW5fTGF0XG4gIH07XG59IC8vIGNzX2dlb2RldGljX3RvX2dlb2NlbnRyaWMoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VvY2VudHJpY1RvR2VvZGV0aWMocCwgZXMsIGEsIGIpIHtcbiAgLyogbG9jYWwgZGVmaW50aW9ucyBhbmQgdmFyaWFibGVzICovXG4gIC8qIGVuZC1jcml0ZXJpdW0gb2YgbG9vcCwgYWNjdXJhY3kgb2Ygc2luKExhdGl0dWRlKSAqL1xuICB2YXIgZ2VuYXUgPSAxZS0xMjtcbiAgdmFyIGdlbmF1MiA9IChnZW5hdSAqIGdlbmF1KTtcbiAgdmFyIG1heGl0ZXIgPSAzMDtcblxuICB2YXIgUDsgLyogZGlzdGFuY2UgYmV0d2VlbiBzZW1pLW1pbm9yIGF4aXMgYW5kIGxvY2F0aW9uICovXG4gIHZhciBSUjsgLyogZGlzdGFuY2UgYmV0d2VlbiBjZW50ZXIgYW5kIGxvY2F0aW9uICovXG4gIHZhciBDVDsgLyogc2luIG9mIGdlb2NlbnRyaWMgbGF0aXR1ZGUgKi9cbiAgdmFyIFNUOyAvKiBjb3Mgb2YgZ2VvY2VudHJpYyBsYXRpdHVkZSAqL1xuICB2YXIgUlg7XG4gIHZhciBSSztcbiAgdmFyIFJOOyAvKiBFYXJ0aCByYWRpdXMgYXQgbG9jYXRpb24gKi9cbiAgdmFyIENQSEkwOyAvKiBjb3Mgb2Ygc3RhcnQgb3Igb2xkIGdlb2RldGljIGxhdGl0dWRlIGluIGl0ZXJhdGlvbnMgKi9cbiAgdmFyIFNQSEkwOyAvKiBzaW4gb2Ygc3RhcnQgb3Igb2xkIGdlb2RldGljIGxhdGl0dWRlIGluIGl0ZXJhdGlvbnMgKi9cbiAgdmFyIENQSEk7IC8qIGNvcyBvZiBzZWFyY2hlZCBnZW9kZXRpYyBsYXRpdHVkZSAqL1xuICB2YXIgU1BISTsgLyogc2luIG9mIHNlYXJjaGVkIGdlb2RldGljIGxhdGl0dWRlICovXG4gIHZhciBTRFBISTsgLyogZW5kLWNyaXRlcml1bTogYWRkaXRpb24tdGhlb3JlbSBvZiBzaW4oTGF0aXR1ZGUoaXRlciktTGF0aXR1ZGUoaXRlci0xKSkgKi9cbiAgdmFyIGl0ZXI7IC8qICMgb2YgY29udGlub3VzIGl0ZXJhdGlvbiwgbWF4LiAzMCBpcyBhbHdheXMgZW5vdWdoIChzLmEuKSAqL1xuXG4gIHZhciBYID0gcC54O1xuICB2YXIgWSA9IHAueTtcbiAgdmFyIFogPSBwLnogPyBwLnogOiAwLjA7IC8vIFogdmFsdWUgbm90IGFsd2F5cyBzdXBwbGllZFxuICB2YXIgTG9uZ2l0dWRlO1xuICB2YXIgTGF0aXR1ZGU7XG4gIHZhciBIZWlnaHQ7XG5cbiAgUCA9IE1hdGguc3FydChYICogWCArIFkgKiBZKTtcbiAgUlIgPSBNYXRoLnNxcnQoWCAqIFggKyBZICogWSArIFogKiBaKTtcblxuICAvKiAgICAgIHNwZWNpYWwgY2FzZXMgZm9yIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgKi9cbiAgaWYgKFAgLyBhIDwgZ2VuYXUpIHtcbiAgICAvKiAgc3BlY2lhbCBjYXNlLCBpZiBQPTAuIChYPTAuLCBZPTAuKSAqL1xuICAgIExvbmdpdHVkZSA9IDAuMDtcblxuICAgIC8qICBpZiAoWCxZLFopPSgwLiwwLiwwLikgdGhlbiBIZWlnaHQgYmVjb21lcyBzZW1pLW1pbm9yIGF4aXNcbiAgICAgKiAgb2YgZWxsaXBzb2lkICg9Y2VudGVyIG9mIG1hc3MpLCBMYXRpdHVkZSBiZWNvbWVzIFBJLzIgKi9cbiAgICBpZiAoUlIgLyBhIDwgZ2VuYXUpIHtcbiAgICAgIExhdGl0dWRlID0gSEFMRl9QSTtcbiAgICAgIEhlaWdodCA9IC1iO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogcC54LFxuICAgICAgICB5OiBwLnksXG4gICAgICAgIHo6IHAuelxuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLyogIGVsbGlwc29pZGFsIChnZW9kZXRpYykgbG9uZ2l0dWRlXG4gICAgICogIGludGVydmFsOiAtUEkgPCBMb25naXR1ZGUgPD0gK1BJICovXG4gICAgTG9uZ2l0dWRlID0gTWF0aC5hdGFuMihZLCBYKTtcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIEZvbGxvd2luZyBpdGVyYXRpdmUgYWxnb3JpdGhtIHdhcyBkZXZlbG9wcGVkIGJ5XG4gICAqIFwiSW5zdGl0dXQgZm9yIEVyZG1lc3N1bmdcIiwgVW5pdmVyc2l0eSBvZiBIYW5ub3ZlciwgSnVseSAxOTg4LlxuICAgKiBJbnRlcm5ldDogd3d3LmlmZS51bmktaGFubm92ZXIuZGVcbiAgICogSXRlcmF0aXZlIGNvbXB1dGF0aW9uIG9mIENQSEksU1BISSBhbmQgSGVpZ2h0LlxuICAgKiBJdGVyYXRpb24gb2YgQ1BISSBhbmQgU1BISSB0byAxMCoqLTEyIHJhZGlhbiByZXNwLlxuICAgKiAyKjEwKiotNyBhcmNzZWMuXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBDVCA9IFogLyBSUjtcbiAgU1QgPSBQIC8gUlI7XG4gIFJYID0gMS4wIC8gTWF0aC5zcXJ0KDEuMCAtIGVzICogKDIuMCAtIGVzKSAqIFNUICogU1QpO1xuICBDUEhJMCA9IFNUICogKDEuMCAtIGVzKSAqIFJYO1xuICBTUEhJMCA9IENUICogUlg7XG4gIGl0ZXIgPSAwO1xuXG4gIC8qIGxvb3AgdG8gZmluZCBzaW4oTGF0aXR1ZGUpIHJlc3AuIExhdGl0dWRlXG4gICAqIHVudGlsIHxzaW4oTGF0aXR1ZGUoaXRlciktTGF0aXR1ZGUoaXRlci0xKSl8IDwgZ2VuYXUgKi9cbiAgZG8ge1xuICAgIGl0ZXIrKztcbiAgICBSTiA9IGEgLyBNYXRoLnNxcnQoMS4wIC0gZXMgKiBTUEhJMCAqIFNQSEkwKTtcblxuICAgIC8qICBlbGxpcHNvaWRhbCAoZ2VvZGV0aWMpIGhlaWdodCAqL1xuICAgIEhlaWdodCA9IFAgKiBDUEhJMCArIFogKiBTUEhJMCAtIFJOICogKDEuMCAtIGVzICogU1BISTAgKiBTUEhJMCk7XG5cbiAgICBSSyA9IGVzICogUk4gLyAoUk4gKyBIZWlnaHQpO1xuICAgIFJYID0gMS4wIC8gTWF0aC5zcXJ0KDEuMCAtIFJLICogKDIuMCAtIFJLKSAqIFNUICogU1QpO1xuICAgIENQSEkgPSBTVCAqICgxLjAgLSBSSykgKiBSWDtcbiAgICBTUEhJID0gQ1QgKiBSWDtcbiAgICBTRFBISSA9IFNQSEkgKiBDUEhJMCAtIENQSEkgKiBTUEhJMDtcbiAgICBDUEhJMCA9IENQSEk7XG4gICAgU1BISTAgPSBTUEhJO1xuICB9XG4gIHdoaWxlIChTRFBISSAqIFNEUEhJID4gZ2VuYXUyICYmIGl0ZXIgPCBtYXhpdGVyKTtcblxuICAvKiAgICAgIGVsbGlwc29pZGFsIChnZW9kZXRpYykgbGF0aXR1ZGUgKi9cbiAgTGF0aXR1ZGUgPSBNYXRoLmF0YW4oU1BISSAvIE1hdGguYWJzKENQSEkpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiBMb25naXR1ZGUsXG4gICAgeTogTGF0aXR1ZGUsXG4gICAgejogSGVpZ2h0XG4gIH07XG59IC8vIGNzX2dlb2NlbnRyaWNfdG9fZ2VvZGV0aWMoKVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIHBqX2dlb2NlbnRpY190b193Z3M4NCggcCApXG4vLyAgcCA9IHBvaW50IHRvIHRyYW5zZm9ybSBpbiBnZW9jZW50cmljIGNvb3JkaW5hdGVzICh4LHkseilcblxuLyoqIHBvaW50IG9iamVjdCwgbm90aGluZyBmYW5jeSwganVzdCBhbGxvd3MgdmFsdWVzIHRvIGJlXG4gICAgcGFzc2VkIGJhY2sgYW5kIGZvcnRoIGJ5IHJlZmVyZW5jZSByYXRoZXIgdGhhbiBieSB2YWx1ZS5cbiAgICBPdGhlciBwb2ludCBjbGFzc2VzIG1heSBiZSB1c2VkIGFzIGxvbmcgYXMgdGhleSBoYXZlXG4gICAgeCBhbmQgeSBwcm9wZXJ0aWVzLCB3aGljaCB3aWxsIGdldCBtb2RpZmllZCBpbiB0aGUgdHJhbnNmb3JtIG1ldGhvZC5cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2VvY2VudHJpY1RvV2dzODQocCwgZGF0dW1fdHlwZSwgZGF0dW1fcGFyYW1zKSB7XG4gIGlmIChkYXR1bV90eXBlID09PSBQSkRfM1BBUkFNKSB7XG4gICAgLy8gaWYoIHhbaW9dID09PSBIVUdFX1ZBTCApXG4gICAgLy8gICAgY29udGludWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHAueCArIGRhdHVtX3BhcmFtc1swXSxcbiAgICAgIHk6IHAueSArIGRhdHVtX3BhcmFtc1sxXSxcbiAgICAgIHo6IHAueiArIGRhdHVtX3BhcmFtc1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSkge1xuICAgIHZhciBEeF9CRiA9IGRhdHVtX3BhcmFtc1swXTtcbiAgICB2YXIgRHlfQkYgPSBkYXR1bV9wYXJhbXNbMV07XG4gICAgdmFyIER6X0JGID0gZGF0dW1fcGFyYW1zWzJdO1xuICAgIHZhciBSeF9CRiA9IGRhdHVtX3BhcmFtc1szXTtcbiAgICB2YXIgUnlfQkYgPSBkYXR1bV9wYXJhbXNbNF07XG4gICAgdmFyIFJ6X0JGID0gZGF0dW1fcGFyYW1zWzVdO1xuICAgIHZhciBNX0JGID0gZGF0dW1fcGFyYW1zWzZdO1xuICAgIC8vIGlmKCB4W2lvXSA9PT0gSFVHRV9WQUwgKVxuICAgIC8vICAgIGNvbnRpbnVlO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNX0JGICogKHAueCAtIFJ6X0JGICogcC55ICsgUnlfQkYgKiBwLnopICsgRHhfQkYsXG4gICAgICB5OiBNX0JGICogKFJ6X0JGICogcC54ICsgcC55IC0gUnhfQkYgKiBwLnopICsgRHlfQkYsXG4gICAgICB6OiBNX0JGICogKC1SeV9CRiAqIHAueCArIFJ4X0JGICogcC55ICsgcC56KSArIER6X0JGXG4gICAgfTtcbiAgfVxufSAvLyBjc19nZW9jZW50cmljX3RvX3dnczg0XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gcGpfZ2VvY2VudGljX2Zyb21fd2dzODQoKVxuLy8gIGNvb3JkaW5hdGUgc3lzdGVtIGRlZmluaXRpb24sXG4vLyAgcG9pbnQgdG8gdHJhbnNmb3JtIGluIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMgKHgseSx6KVxuZXhwb3J0IGZ1bmN0aW9uIGdlb2NlbnRyaWNGcm9tV2dzODQocCwgZGF0dW1fdHlwZSwgZGF0dW1fcGFyYW1zKSB7XG4gIGlmIChkYXR1bV90eXBlID09PSBQSkRfM1BBUkFNKSB7XG4gICAgLy8gaWYoIHhbaW9dID09PSBIVUdFX1ZBTCApXG4gICAgLy8gICAgY29udGludWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHAueCAtIGRhdHVtX3BhcmFtc1swXSxcbiAgICAgIHk6IHAueSAtIGRhdHVtX3BhcmFtc1sxXSxcbiAgICAgIHo6IHAueiAtIGRhdHVtX3BhcmFtc1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSkge1xuICAgIHZhciBEeF9CRiA9IGRhdHVtX3BhcmFtc1swXTtcbiAgICB2YXIgRHlfQkYgPSBkYXR1bV9wYXJhbXNbMV07XG4gICAgdmFyIER6X0JGID0gZGF0dW1fcGFyYW1zWzJdO1xuICAgIHZhciBSeF9CRiA9IGRhdHVtX3BhcmFtc1szXTtcbiAgICB2YXIgUnlfQkYgPSBkYXR1bV9wYXJhbXNbNF07XG4gICAgdmFyIFJ6X0JGID0gZGF0dW1fcGFyYW1zWzVdO1xuICAgIHZhciBNX0JGID0gZGF0dW1fcGFyYW1zWzZdO1xuICAgIHZhciB4X3RtcCA9IChwLnggLSBEeF9CRikgLyBNX0JGO1xuICAgIHZhciB5X3RtcCA9IChwLnkgLSBEeV9CRikgLyBNX0JGO1xuICAgIHZhciB6X3RtcCA9IChwLnogLSBEel9CRikgLyBNX0JGO1xuICAgIC8vIGlmKCB4W2lvXSA9PT0gSFVHRV9WQUwgKVxuICAgIC8vICAgIGNvbnRpbnVlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHhfdG1wICsgUnpfQkYgKiB5X3RtcCAtIFJ5X0JGICogel90bXAsXG4gICAgICB5OiAtUnpfQkYgKiB4X3RtcCArIHlfdG1wICsgUnhfQkYgKiB6X3RtcCxcbiAgICAgIHo6IFJ5X0JGICogeF90bXAgLSBSeF9CRiAqIHlfdG1wICsgel90bXBcbiAgICB9O1xuICB9IC8vIGNzX2dlb2NlbnRyaWNfZnJvbV93Z3M4NCgpXG59XG4iLCJpbXBvcnQge1xuICBQSkRfM1BBUkFNLFxuICBQSkRfN1BBUkFNLFxuICBQSkRfR1JJRFNISUZULFxuICBQSkRfTk9EQVRVTSxcbiAgUjJELFxuICBTUlNfV0dTODRfRVNRVUFSRUQsXG4gIFNSU19XR1M4NF9TRU1JTUFKT1IsIFNSU19XR1M4NF9TRU1JTUlOT1Jcbn0gZnJvbSAnLi9jb25zdGFudHMvdmFsdWVzJztcblxuaW1wb3J0IHsgZ2VvZGV0aWNUb0dlb2NlbnRyaWMsIGdlb2NlbnRyaWNUb0dlb2RldGljLCBnZW9jZW50cmljVG9XZ3M4NCwgZ2VvY2VudHJpY0Zyb21XZ3M4NCwgY29tcGFyZURhdHVtcyB9IGZyb20gJy4vZGF0dW1VdGlscyc7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuL2NvbW1vbi9hZGp1c3RfbG9uJztcbmZ1bmN0aW9uIGNoZWNrUGFyYW1zKHR5cGUpIHtcbiAgcmV0dXJuICh0eXBlID09PSBQSkRfM1BBUkFNIHx8IHR5cGUgPT09IFBKRF83UEFSQU0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoc291cmNlLCBkZXN0LCBwb2ludCkge1xuICAvLyBTaG9ydCBjdXQgaWYgdGhlIGRhdHVtcyBhcmUgaWRlbnRpY2FsLlxuICBpZiAoY29tcGFyZURhdHVtcyhzb3VyY2UsIGRlc3QpKSB7XG4gICAgcmV0dXJuIHBvaW50OyAvLyBpbiB0aGlzIGNhc2UsIHplcm8gaXMgc3VjZXNzLFxuICAgIC8vIHdoZXJlYXMgY3NfY29tcGFyZV9kYXR1bXMgcmV0dXJucyAxIHRvIGluZGljYXRlIFRSVUVcbiAgICAvLyBjb25mdXNpbmcsIHNob3VsZCBmaXggdGhpc1xuICB9XG5cbiAgLy8gRXhwbGljaXRseSBza2lwIGRhdHVtIHRyYW5zZm9ybSBieSBzZXR0aW5nICdkYXR1bT1ub25lJyBhcyBwYXJhbWV0ZXIgZm9yIGVpdGhlciBzb3VyY2Ugb3IgZGVzdFxuICBpZiAoc291cmNlLmRhdHVtX3R5cGUgPT09IFBKRF9OT0RBVFVNIHx8IGRlc3QuZGF0dW1fdHlwZSA9PT0gUEpEX05PREFUVU0pIHtcbiAgICByZXR1cm4gcG9pbnQ7XG4gIH1cblxuICAvLyBJZiB0aGlzIGRhdHVtIHJlcXVpcmVzIGdyaWQgc2hpZnRzLCB0aGVuIGFwcGx5IGl0IHRvIGdlb2RldGljIGNvb3JkaW5hdGVzLlxuICB2YXIgc291cmNlX2EgPSBzb3VyY2UuYTtcbiAgdmFyIHNvdXJjZV9lcyA9IHNvdXJjZS5lcztcbiAgaWYgKHNvdXJjZS5kYXR1bV90eXBlID09PSBQSkRfR1JJRFNISUZUKSB7XG4gICAgdmFyIGdyaWRTaGlmdENvZGUgPSBhcHBseUdyaWRTaGlmdChzb3VyY2UsIGZhbHNlLCBwb2ludCk7XG4gICAgaWYgKGdyaWRTaGlmdENvZGUgIT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHNvdXJjZV9hID0gU1JTX1dHUzg0X1NFTUlNQUpPUjtcbiAgICBzb3VyY2VfZXMgPSBTUlNfV0dTODRfRVNRVUFSRUQ7XG4gIH1cblxuICB2YXIgZGVzdF9hID0gZGVzdC5hO1xuICB2YXIgZGVzdF9iID0gZGVzdC5iO1xuICB2YXIgZGVzdF9lcyA9IGRlc3QuZXM7XG4gIGlmIChkZXN0LmRhdHVtX3R5cGUgPT09IFBKRF9HUklEU0hJRlQpIHtcbiAgICBkZXN0X2EgPSBTUlNfV0dTODRfU0VNSU1BSk9SO1xuICAgIGRlc3RfYiA9IFNSU19XR1M4NF9TRU1JTUlOT1I7XG4gICAgZGVzdF9lcyA9IFNSU19XR1M4NF9FU1FVQVJFRDtcbiAgfVxuXG4gIC8vIERvIHdlIG5lZWQgdG8gZ28gdGhyb3VnaCBnZW9jZW50cmljIGNvb3JkaW5hdGVzP1xuICBpZiAoc291cmNlX2VzID09PSBkZXN0X2VzICYmIHNvdXJjZV9hID09PSBkZXN0X2EgJiYgIWNoZWNrUGFyYW1zKHNvdXJjZS5kYXR1bV90eXBlKSAmJiAhY2hlY2tQYXJhbXMoZGVzdC5kYXR1bV90eXBlKSkge1xuICAgIHJldHVybiBwb2ludDtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdG8gZ2VvY2VudHJpYyBjb29yZGluYXRlcy5cbiAgcG9pbnQgPSBnZW9kZXRpY1RvR2VvY2VudHJpYyhwb2ludCwgc291cmNlX2VzLCBzb3VyY2VfYSk7XG4gIC8vIENvbnZlcnQgYmV0d2VlbiBkYXR1bXNcbiAgaWYgKGNoZWNrUGFyYW1zKHNvdXJjZS5kYXR1bV90eXBlKSkge1xuICAgIHBvaW50ID0gZ2VvY2VudHJpY1RvV2dzODQocG9pbnQsIHNvdXJjZS5kYXR1bV90eXBlLCBzb3VyY2UuZGF0dW1fcGFyYW1zKTtcbiAgfVxuICBpZiAoY2hlY2tQYXJhbXMoZGVzdC5kYXR1bV90eXBlKSkge1xuICAgIHBvaW50ID0gZ2VvY2VudHJpY0Zyb21XZ3M4NChwb2ludCwgZGVzdC5kYXR1bV90eXBlLCBkZXN0LmRhdHVtX3BhcmFtcyk7XG4gIH1cbiAgcG9pbnQgPSBnZW9jZW50cmljVG9HZW9kZXRpYyhwb2ludCwgZGVzdF9lcywgZGVzdF9hLCBkZXN0X2IpO1xuXG4gIGlmIChkZXN0LmRhdHVtX3R5cGUgPT09IFBKRF9HUklEU0hJRlQpIHtcbiAgICB2YXIgZGVzdEdyaWRTaGlmdFJlc3VsdCA9IGFwcGx5R3JpZFNoaWZ0KGRlc3QsIHRydWUsIHBvaW50KTtcbiAgICBpZiAoZGVzdEdyaWRTaGlmdFJlc3VsdCAhPT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcG9pbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUdyaWRTaGlmdChzb3VyY2UsIGludmVyc2UsIHBvaW50KSB7XG4gIGlmIChzb3VyY2UuZ3JpZHMgPT09IG51bGwgfHwgc291cmNlLmdyaWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnNvbGUubG9nKCdHcmlkIHNoaWZ0IGdyaWRzIG5vdCBmb3VuZCcpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICB2YXIgaW5wdXQgPSB7IHg6IC1wb2ludC54LCB5OiBwb2ludC55IH07XG4gIHZhciBvdXRwdXQgPSB7IHg6IE51bWJlci5OYU4sIHk6IE51bWJlci5OYU4gfTtcbiAgdmFyIGF0dGVtcHRlZEdyaWRzID0gW107XG4gIG91dGVyOlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5ncmlkcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBncmlkID0gc291cmNlLmdyaWRzW2ldO1xuICAgIGF0dGVtcHRlZEdyaWRzLnB1c2goZ3JpZC5uYW1lKTtcbiAgICBpZiAoZ3JpZC5pc051bGwpIHtcbiAgICAgIG91dHB1dCA9IGlucHV0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChncmlkLmdyaWQgPT09IG51bGwpIHtcbiAgICAgIGlmIChncmlkLm1hbmRhdG9yeSkge1xuICAgICAgICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIGZpbmQgbWFuZGF0b3J5IGdyaWQgXFwnJyArIGdyaWQubmFtZSArICdcXCcnKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHZhciBzdWJncmlkcyA9IGdyaWQuZ3JpZC5zdWJncmlkcztcbiAgICBmb3IgKHZhciBqID0gMCwgamogPSBzdWJncmlkcy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICB2YXIgc3ViZ3JpZCA9IHN1YmdyaWRzW2pdO1xuICAgICAgLy8gc2tpcCB0YWJsZXMgdGhhdCBkb24ndCBtYXRjaCBvdXIgcG9pbnQgYXQgYWxsXG4gICAgICB2YXIgZXBzaWxvbiA9IChNYXRoLmFicyhzdWJncmlkLmRlbFsxXSkgKyBNYXRoLmFicyhzdWJncmlkLmRlbFswXSkpIC8gMTAwMDAuMDtcbiAgICAgIHZhciBtaW5YID0gc3ViZ3JpZC5sbFswXSAtIGVwc2lsb247XG4gICAgICB2YXIgbWluWSA9IHN1YmdyaWQubGxbMV0gLSBlcHNpbG9uO1xuICAgICAgdmFyIG1heFggPSBzdWJncmlkLmxsWzBdICsgKHN1YmdyaWQubGltWzBdIC0gMSkgKiBzdWJncmlkLmRlbFswXSArIGVwc2lsb247XG4gICAgICB2YXIgbWF4WSA9IHN1YmdyaWQubGxbMV0gKyAoc3ViZ3JpZC5saW1bMV0gLSAxKSAqIHN1YmdyaWQuZGVsWzFdICsgZXBzaWxvbjtcbiAgICAgIGlmIChtaW5ZID4gaW5wdXQueSB8fCBtaW5YID4gaW5wdXQueCB8fCBtYXhZIDwgaW5wdXQueSB8fCBtYXhYIDwgaW5wdXQueCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG91dHB1dCA9IGFwcGx5U3ViZ3JpZFNoaWZ0KGlucHV0LCBpbnZlcnNlLCBzdWJncmlkKTtcbiAgICAgIGlmICghaXNOYU4ob3V0cHV0LngpKSB7XG4gICAgICAgIGJyZWFrIG91dGVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoaXNOYU4ob3V0cHV0LngpKSB7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBmaW5kIGEgZ3JpZCBzaGlmdCB0YWJsZSBmb3IgbG9jYXRpb24gXFwnJ1xuICAgICAgKyAtaW5wdXQueCAqIFIyRCArICcgJyArIGlucHV0LnkgKiBSMkQgKyAnIHRyaWVkOiBcXCcnICsgYXR0ZW1wdGVkR3JpZHMgKyAnXFwnJyk7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHBvaW50LnggPSAtb3V0cHV0Lng7XG4gIHBvaW50LnkgPSBvdXRwdXQueTtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U3ViZ3JpZFNoaWZ0KHBpbiwgaW52ZXJzZSwgY3QpIHtcbiAgdmFyIHZhbCA9IHsgeDogTnVtYmVyLk5hTiwgeTogTnVtYmVyLk5hTiB9O1xuICBpZiAoaXNOYU4ocGluLngpKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICB2YXIgdGIgPSB7IHg6IHBpbi54LCB5OiBwaW4ueSB9O1xuICB0Yi54IC09IGN0LmxsWzBdO1xuICB0Yi55IC09IGN0LmxsWzFdO1xuICB0Yi54ID0gYWRqdXN0X2xvbih0Yi54IC0gTWF0aC5QSSkgKyBNYXRoLlBJO1xuICB2YXIgdCA9IG5hZEludGVycG9sYXRlKHRiLCBjdCk7XG4gIGlmIChpbnZlcnNlKSB7XG4gICAgaWYgKGlzTmFOKHQueCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIHQueCA9IHRiLnggLSB0Lng7XG4gICAgdC55ID0gdGIueSAtIHQueTtcbiAgICB2YXIgaSA9IDksIHRvbCA9IDFlLTEyO1xuICAgIHZhciBkaWYsIGRlbDtcbiAgICBkbyB7XG4gICAgICBkZWwgPSBuYWRJbnRlcnBvbGF0ZSh0LCBjdCk7XG4gICAgICBpZiAoaXNOYU4oZGVsLngpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdJbnZlcnNlIGdyaWQgc2hpZnQgaXRlcmF0aW9uIGZhaWxlZCwgcHJlc3VtYWJseSBhdCBncmlkIGVkZ2UuICBVc2luZyBmaXJzdCBhcHByb3hpbWF0aW9uLicpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRpZiA9IHsgeDogdGIueCAtIChkZWwueCArIHQueCksIHk6IHRiLnkgLSAoZGVsLnkgKyB0LnkpIH07XG4gICAgICB0LnggKz0gZGlmLng7XG4gICAgICB0LnkgKz0gZGlmLnk7XG4gICAgfSB3aGlsZSAoaS0tICYmIE1hdGguYWJzKGRpZi54KSA+IHRvbCAmJiBNYXRoLmFicyhkaWYueSkgPiB0b2wpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgY29uc29sZS5sb2coJ0ludmVyc2UgZ3JpZCBzaGlmdCBpdGVyYXRvciBmYWlsZWQgdG8gY29udmVyZ2UuJyk7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICB2YWwueCA9IGFkanVzdF9sb24odC54ICsgY3QubGxbMF0pO1xuICAgIHZhbC55ID0gdC55ICsgY3QubGxbMV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFpc05hTih0LngpKSB7XG4gICAgICB2YWwueCA9IHBpbi54ICsgdC54O1xuICAgICAgdmFsLnkgPSBwaW4ueSArIHQueTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gbmFkSW50ZXJwb2xhdGUocGluLCBjdCkge1xuICB2YXIgdCA9IHsgeDogcGluLnggLyBjdC5kZWxbMF0sIHk6IHBpbi55IC8gY3QuZGVsWzFdIH07XG4gIHZhciBpbmR4ID0geyB4OiBNYXRoLmZsb29yKHQueCksIHk6IE1hdGguZmxvb3IodC55KSB9O1xuICB2YXIgZnJjdCA9IHsgeDogdC54IC0gMS4wICogaW5keC54LCB5OiB0LnkgLSAxLjAgKiBpbmR4LnkgfTtcbiAgdmFyIHZhbCA9IHsgeDogTnVtYmVyLk5hTiwgeTogTnVtYmVyLk5hTiB9O1xuICB2YXIgaW54O1xuICBpZiAoaW5keC54IDwgMCB8fCBpbmR4LnggPj0gY3QubGltWzBdKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICBpZiAoaW5keC55IDwgMCB8fCBpbmR4LnkgPj0gY3QubGltWzFdKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICBpbnggPSAoaW5keC55ICogY3QubGltWzBdKSArIGluZHgueDtcbiAgdmFyIGYwMCA9IHsgeDogY3QuY3ZzW2lueF1bMF0sIHk6IGN0LmN2c1tpbnhdWzFdIH07XG4gIGlueCsrO1xuICB2YXIgZjEwID0geyB4OiBjdC5jdnNbaW54XVswXSwgeTogY3QuY3ZzW2lueF1bMV0gfTtcbiAgaW54ICs9IGN0LmxpbVswXTtcbiAgdmFyIGYxMSA9IHsgeDogY3QuY3ZzW2lueF1bMF0sIHk6IGN0LmN2c1tpbnhdWzFdIH07XG4gIGlueC0tO1xuICB2YXIgZjAxID0geyB4OiBjdC5jdnNbaW54XVswXSwgeTogY3QuY3ZzW2lueF1bMV0gfTtcbiAgdmFyIG0xMSA9IGZyY3QueCAqIGZyY3QueSwgbTEwID0gZnJjdC54ICogKDEuMCAtIGZyY3QueSksXG4gICAgbTAwID0gKDEuMCAtIGZyY3QueCkgKiAoMS4wIC0gZnJjdC55KSwgbTAxID0gKDEuMCAtIGZyY3QueCkgKiBmcmN0Lnk7XG4gIHZhbC54ID0gKG0wMCAqIGYwMC54ICsgbTEwICogZjEwLnggKyBtMDEgKiBmMDEueCArIG0xMSAqIGYxMS54KTtcbiAgdmFsLnkgPSAobTAwICogZjAwLnkgKyBtMTAgKiBmMTAueSArIG0wMSAqIGYwMS55ICsgbTExICogZjExLnkpO1xuICByZXR1cm4gdmFsO1xufVxuIiwiaW1wb3J0IGdsb2JhbHMgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHBhcnNlUHJvaiBmcm9tICcuL3Byb2pTdHJpbmcnO1xuaW1wb3J0IHdrdCBmcm9tICd3a3QtcGFyc2VyJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQcm9qZWN0aW9uRGVmaW5pdGlvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRpdGxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Byb2pOYW1lXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtlbGxwc11cbiAqIEBwcm9wZXJ0eSB7aW1wb3J0KCcuL1Byb2ouanMnKS5EYXR1bURlZmluaXRpb259IFtkYXR1bV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGF0dW1OYW1lXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtyZl1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbGF0MF1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbGF0MV1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbGF0Ml1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbGF0X3RzXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsb25nMF1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbG9uZzFdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xvbmcyXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFthbHBoYV1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbG9uZ2NdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3gwXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt5MF1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbazBdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2FdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2JdXG4gKiBAcHJvcGVydHkge3RydWV9IFtSX0FdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3pvbmVdXG4gKiBAcHJvcGVydHkge3RydWV9IFt1dG1Tb3V0aF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfEFycmF5PG51bWJlcj59IFtkYXR1bV9wYXJhbXNdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3RvX21ldGVyXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1bml0c11cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbZnJvbV9ncmVlbndpY2hdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2RhdHVtQ29kZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFkZ3JpZHNdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2F4aXNdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtzcGhlcmVdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3JlY3RpZmllZF9ncmlkX2FuZ2xlXVxuICogQHByb3BlcnR5IHtib29sZWFufSBbYXBwcm94XVxuICogQHByb3BlcnR5IHtib29sZWFufSBbb3Zlcl1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcHJvalN0cl1cbiAqIEBwcm9wZXJ0eSB7PFQgZXh0ZW5kcyBpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXM+KGNvb3JkaW5hdGVzOiBULCBlbmZvcmNlQXhpcz86IGJvb2xlYW4pID0+IFR9IGludmVyc2VcbiAqIEBwcm9wZXJ0eSB7PFQgZXh0ZW5kcyBpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXM+KGNvb3JkaW5hdGVzOiBULCBlbmZvcmNlQXhpcz86IGJvb2xlYW4pID0+IFR9IGZvcndhcmRcbiAqL1xuXG4vKipcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfFByb2plY3Rpb25EZWZpbml0aW9ufGltcG9ydCgnLi9jb3JlLmpzJykuUFJPSkpTT05EZWZpbml0aW9ufSBwcm9qZWN0aW9uXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuLyoqXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7QXJyYXk8W3N0cmluZywgc3RyaW5nXT59IG5hbWVcbiAqIEByZXR1cm5zIHtBcnJheTxQcm9qZWN0aW9uRGVmaW5pdGlvbnx1bmRlZmluZWQ+fVxuICovXG4vKipcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEByZXR1cm5zIHtQcm9qZWN0aW9uRGVmaW5pdGlvbn1cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nIHwgQXJyYXk8QXJyYXk8c3RyaW5nPj4gfCBQYXJ0aWFsPFJlY29yZDwnRVBTRyd8J0VTUkknfCdJQVUyMDAwJywgUHJvamVjdGlvbkRlZmluaXRpb24+Pn0gbmFtZVxuICogQHJldHVybnMge1Byb2plY3Rpb25EZWZpbml0aW9uIHwgQXJyYXk8UHJvamVjdGlvbkRlZmluaXRpb258dW5kZWZpbmVkPiB8IHZvaWR9XG4gKi9cbmZ1bmN0aW9uIGRlZnMobmFtZSkge1xuICAvKiBnbG9iYWwgY29uc29sZSAqL1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgdmFyIGRlZiA9IGFyZ3VtZW50c1sxXTtcbiAgICBpZiAodHlwZW9mIGRlZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChkZWYuY2hhckF0KDApID09PSAnKycpIHtcbiAgICAgICAgZGVmc1svKiogQHR5cGUge3N0cmluZ30gKi8gKG5hbWUpXSA9IHBhcnNlUHJvaihhcmd1bWVudHNbMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmc1svKiogQHR5cGUge3N0cmluZ30gKi8gKG5hbWUpXSA9IHdrdChhcmd1bWVudHNbMV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGVmICYmIHR5cGVvZiBkZWYgPT09ICdvYmplY3QnICYmICEoJ3Byb2pOYW1lJyBpbiBkZWYpKSB7XG4gICAgICAvLyBQUk9KSlNPTlxuICAgICAgZGVmc1svKiogQHR5cGUge3N0cmluZ30gKi8gKG5hbWUpXSA9IHdrdChhcmd1bWVudHNbMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZzWy8qKiBAdHlwZSB7c3RyaW5nfSAqLyAobmFtZSldID0gZGVmO1xuICAgICAgaWYgKCFkZWYpIHtcbiAgICAgICAgZGVsZXRlIGRlZnNbLyoqIEB0eXBlIHtzdHJpbmd9ICovIChuYW1lKV07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZnMuYXBwbHkodGhhdCwgdik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGRlZnModik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAobmFtZSBpbiBkZWZzKSB7XG4gICAgICAgIHJldHVybiBkZWZzW25hbWVdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoJ0VQU0cnIGluIG5hbWUpIHtcbiAgICAgIGRlZnNbJ0VQU0c6JyArIG5hbWUuRVBTR10gPSBuYW1lO1xuICAgIH0gZWxzZSBpZiAoJ0VTUkknIGluIG5hbWUpIHtcbiAgICAgIGRlZnNbJ0VTUkk6JyArIG5hbWUuRVNSSV0gPSBuYW1lO1xuICAgIH0gZWxzZSBpZiAoJ0lBVTIwMDAnIGluIG5hbWUpIHtcbiAgICAgIGRlZnNbJ0lBVTIwMDA6JyArIG5hbWUuSUFVMjAwMF0gPSBuYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG59XG5nbG9iYWxzKGRlZnMpO1xuZXhwb3J0IGRlZmF1bHQgZGVmcztcbiIsImltcG9ydCB7IFNJWFRILCBSQTQsIFJBNiwgRVBTTE4gfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBFbGxpcHNvaWQgfSBmcm9tICcuL2NvbnN0YW50cy9FbGxpcHNvaWQnO1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnO1xuXG5jb25zdCBXR1M4NCA9IEVsbGlwc29pZC5XR1M4NDsgLy8gZGVmYXVsdCBlbGxpcHNvaWRcblxuZXhwb3J0IGZ1bmN0aW9uIGVjY2VudHJpY2l0eShhLCBiLCByZiwgUl9BKSB7XG4gIHZhciBhMiA9IGEgKiBhOyAvLyB1c2VkIGluIGdlb2NlbnRyaWNcbiAgdmFyIGIyID0gYiAqIGI7IC8vIHVzZWQgaW4gZ2VvY2VudHJpY1xuICB2YXIgZXMgPSAoYTIgLSBiMikgLyBhMjsgLy8gZSBeIDJcbiAgdmFyIGUgPSAwO1xuICBpZiAoUl9BKSB7XG4gICAgYSAqPSAxIC0gZXMgKiAoU0lYVEggKyBlcyAqIChSQTQgKyBlcyAqIFJBNikpO1xuICAgIGEyID0gYSAqIGE7XG4gICAgZXMgPSAwO1xuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLnNxcnQoZXMpOyAvLyBlY2NlbnRyaWNpdHlcbiAgfVxuICB2YXIgZXAyID0gKGEyIC0gYjIpIC8gYjI7IC8vIHVzZWQgaW4gZ2VvY2VudHJpY1xuICByZXR1cm4ge1xuICAgIGVzOiBlcyxcbiAgICBlOiBlLFxuICAgIGVwMjogZXAyXG4gIH07XG59XG5leHBvcnQgZnVuY3Rpb24gc3BoZXJlKGEsIGIsIHJmLCBlbGxwcywgc3BoZXJlKSB7XG4gIGlmICghYSkgeyAvLyBkbyB3ZSBoYXZlIGFuIGVsbGlwc29pZD9cbiAgICB2YXIgZWxsaXBzZSA9IG1hdGNoKEVsbGlwc29pZCwgZWxscHMpO1xuICAgIGlmICghZWxsaXBzZSkge1xuICAgICAgZWxsaXBzZSA9IFdHUzg0O1xuICAgIH1cbiAgICBhID0gZWxsaXBzZS5hO1xuICAgIGIgPSBlbGxpcHNlLmI7XG4gICAgcmYgPSBlbGxpcHNlLnJmO1xuICB9XG5cbiAgaWYgKHJmICYmICFiKSB7XG4gICAgYiA9ICgxLjAgLSAxLjAgLyByZikgKiBhO1xuICB9XG4gIGlmIChyZiA9PT0gMCB8fCBNYXRoLmFicyhhIC0gYikgPCBFUFNMTikge1xuICAgIHNwaGVyZSA9IHRydWU7XG4gICAgYiA9IGE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBhOiBhLFxuICAgIGI6IGIsXG4gICAgcmY6IHJmLFxuICAgIHNwaGVyZTogc3BoZXJlXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICBkZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uIHx8IHt9O1xuICB2YXIgdmFsdWUsIHByb3BlcnR5O1xuICBpZiAoIXNvdXJjZSkge1xuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgfVxuICBmb3IgKHByb3BlcnR5IGluIHNvdXJjZSkge1xuICAgIHZhbHVlID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChkZWZzKSB7XG4gIGRlZnMoJ0VQU0c6NDMyNicsICcrdGl0bGU9V0dTIDg0IChsb25nL2xhdCkgK3Byb2o9bG9uZ2xhdCArZWxscHM9V0dTODQgK2RhdHVtPVdHUzg0ICt1bml0cz1kZWdyZWVzJyk7XG4gIGRlZnMoJ0VQU0c6NDI2OScsICcrdGl0bGU9TkFEODMgKGxvbmcvbGF0KSArcHJvaj1sb25nbGF0ICthPTYzNzgxMzcuMCArYj02MzU2NzUyLjMxNDE0MDM2ICtlbGxwcz1HUlM4MCArZGF0dW09TkFEODMgK3VuaXRzPWRlZ3JlZXMnKTtcbiAgZGVmcygnRVBTRzozODU3JywgJyt0aXRsZT1XR1MgODQgLyBQc2V1ZG8tTWVyY2F0b3IgK3Byb2o9bWVyYyArYT02Mzc4MTM3ICtiPTYzNzgxMzcgK2xhdF90cz0wLjAgK2xvbl8wPTAuMCAreF8wPTAuMCAreV8wPTAgK2s9MS4wICt1bml0cz1tICtuYWRncmlkcz1AbnVsbCArbm9fZGVmcycpO1xuICAvLyBVVE0gV0dTODRcbiAgZm9yICh2YXIgaSA9IDE7IGkgPD0gNjA7ICsraSkge1xuICAgIGRlZnMoJ0VQU0c6JyArICgzMjYwMCArIGkpLCAnK3Byb2o9dXRtICt6b25lPScgKyBpICsgJyArZGF0dW09V0dTODQgK3VuaXRzPW0nKTtcbiAgICBkZWZzKCdFUFNHOicgKyAoMzI3MDAgKyBpKSwgJytwcm9qPXV0bSArem9uZT0nICsgaSArICcgK3NvdXRoICtkYXR1bT1XR1M4NCArdW5pdHM9bScpO1xuICB9XG4gIGRlZnMoJ0VQU0c6NTA0MScsICcrdGl0bGU9V0dTIDg0IC8gVVBTIE5vcnRoIChFLE4pICtwcm9qPXN0ZXJlICtsYXRfMD05MCArbG9uXzA9MCAraz0wLjk5NCAreF8wPTIwMDAwMDAgK3lfMD0yMDAwMDAwICtkYXR1bT1XR1M4NCArdW5pdHM9bScpO1xuICBkZWZzKCdFUFNHOjUwNDInLCAnK3RpdGxlPVdHUyA4NCAvIFVQUyBTb3V0aCAoRSxOKSArcHJvaj1zdGVyZSArbGF0XzA9LTkwICtsb25fMD0wICtrPTAuOTk0ICt4XzA9MjAwMDAwMCAreV8wPTIwMDAwMDAgK2RhdHVtPVdHUzg0ICt1bml0cz1tJyk7XG5cbiAgZGVmcy5XR1M4NCA9IGRlZnNbJ0VQU0c6NDMyNiddO1xuICBkZWZzWydFUFNHOjM3ODUnXSA9IGRlZnNbJ0VQU0c6Mzg1NyddOyAvLyBtYWludGFpbiBiYWNrd2FyZCBjb21wYXQsIG9mZmljaWFsIGNvZGUgaXMgMzg1N1xuICBkZWZzLkdPT0dMRSA9IGRlZnNbJ0VQU0c6Mzg1NyddO1xuICBkZWZzWydFUFNHOjkwMDkxMyddID0gZGVmc1snRVBTRzozODU3J107XG4gIGRlZnNbJ0VQU0c6MTAyMTEzJ10gPSBkZWZzWydFUFNHOjM4NTcnXTtcbn1cbiIsImltcG9ydCBjb3JlIGZyb20gJy4vY29yZSc7XG5pbXBvcnQgUHJvaiBmcm9tICcuL1Byb2onO1xuaW1wb3J0IFBvaW50IGZyb20gJy4vUG9pbnQnO1xuaW1wb3J0IGNvbW1vbiBmcm9tICcuL2NvbW1vbi90b1BvaW50JztcbmltcG9ydCBkZWZzIGZyb20gJy4vZGVmcyc7XG5pbXBvcnQgbmFkZ3JpZCBmcm9tICcuL25hZGdyaWQnO1xuaW1wb3J0IHRyYW5zZm9ybSBmcm9tICcuL3RyYW5zZm9ybSc7XG5pbXBvcnQgbWdycyBmcm9tICdtZ3JzJztcbmltcG9ydCBpbmNsdWRlZFByb2plY3Rpb25zIGZyb20gJy4uL3Byb2pzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBNZ3JzXG4gKiBAcHJvcGVydHkgeyhsb25sYXQ6IFtudW1iZXIsIG51bWJlcl0pID0+IHN0cmluZ30gZm9yd2FyZFxuICogQHByb3BlcnR5IHsobWdyc1N0cmluZzogc3RyaW5nKSA9PiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXX0gaW52ZXJzZVxuICogQHByb3BlcnR5IHsobWdyc1N0cmluZzogc3RyaW5nKSA9PiBbbnVtYmVyLCBudW1iZXJdfSB0b1BvaW50XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gUHJvamVjdGlvbkRlZmluaXRpb25cbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXN9IFRlbXBsYXRlQ29vcmRpbmF0ZXNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vY29yZScpLkludGVyZmFjZUNvb3JkaW5hdGVzfSBJbnRlcmZhY2VDb29yZGluYXRlc1xuICogQHR5cGVkZWYge2ltcG9ydCgnLi9jb3JlJykuQ29udmVydGVyfSBDb252ZXJ0ZXJcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vUHJvaicpLkRhdHVtRGVmaW5pdGlvbn0gRGF0dW1EZWZpbml0aW9uXG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUge2ltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlc30gVFxuICogQHR5cGUge2NvcmU8VD4gJiB7ZGVmYXVsdERhdHVtOiBzdHJpbmcsIFByb2o6IHR5cGVvZiBQcm9qLCBXR1M4NDogUHJvaiwgUG9pbnQ6IHR5cGVvZiBQb2ludCwgdG9Qb2ludDogdHlwZW9mIGNvbW1vbiwgZGVmczogdHlwZW9mIGRlZnMsIG5hZGdyaWQ6IHR5cGVvZiBuYWRncmlkLCB0cmFuc2Zvcm06IHR5cGVvZiB0cmFuc2Zvcm0sIG1ncnM6IE1ncnMsIHZlcnNpb246IHN0cmluZ319XG4gKi9cbmNvbnN0IHByb2o0ID0gT2JqZWN0LmFzc2lnbihjb3JlLCB7XG4gIGRlZmF1bHREYXR1bTogJ1dHUzg0JyxcbiAgUHJvaixcbiAgV0dTODQ6IG5ldyBQcm9qKCdXR1M4NCcpLFxuICBQb2ludCxcbiAgdG9Qb2ludDogY29tbW9uLFxuICBkZWZzLFxuICBuYWRncmlkLFxuICB0cmFuc2Zvcm0sXG4gIG1ncnMsXG4gIHZlcnNpb246ICdfX1ZFUlNJT05fXydcbn0pO1xuaW5jbHVkZWRQcm9qZWN0aW9ucyhwcm9qNCk7XG5leHBvcnQgZGVmYXVsdCBwcm9qNDtcbiIsInZhciBpZ25vcmVkQ2hhciA9IC9bXFxzX1xcLVxcL1xcKFxcKV0vZztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hdGNoKG9iaiwga2V5KSB7XG4gIGlmIChvYmpba2V5XSkge1xuICAgIHJldHVybiBvYmpba2V5XTtcbiAgfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gIHZhciBsa2V5ID0ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZShpZ25vcmVkQ2hhciwgJycpO1xuICB2YXIgaSA9IC0xO1xuICB2YXIgdGVzdGtleSwgcHJvY2Vzc2VkS2V5O1xuICB3aGlsZSAoKytpIDwga2V5cy5sZW5ndGgpIHtcbiAgICB0ZXN0a2V5ID0ga2V5c1tpXTtcbiAgICBwcm9jZXNzZWRLZXkgPSB0ZXN0a2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZShpZ25vcmVkQ2hhciwgJycpO1xuICAgIGlmIChwcm9jZXNzZWRLZXkgPT09IGxrZXkpIHtcbiAgICAgIHJldHVybiBvYmpbdGVzdGtleV07XG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIFJlc291cmNlcyBmb3IgZGV0YWlscyBvZiBOVHYyIGZpbGUgZm9ybWF0czpcbiAqIC0gaHR0cHM6Ly93ZWIuYXJjaGl2ZS5vcmcvd2ViLzIwMTQwMTI3MjA0ODIyaWZfL2h0dHA6Ly93d3cubWdzLmdvdi5vbi5jYTo4MC9zdGRwcm9kY29uc3VtZS9ncm91cHMvY29udGVudC9AbWdzL0BpYW5kaXQvZG9jdW1lbnRzL3Jlc291cmNlbGlzdC9zdGVsMDJfMDQ3NDQ3LnBkZlxuICogLSBodHRwOi8vbWltYWthLmNvbS9oZWxwL2dzL2h0bWwvMDA0X05UVjIlMjBEYXRhJTIwRm9ybWF0Lmh0bVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTmFkZ3JpZEluZm9cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBOQUQgZ3JpZCBvciAnbnVsbCcgaWYgbm90IHNwZWNpZmllZC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbWFuZGF0b3J5IEluZGljYXRlcyBpZiB0aGUgZ3JpZCBpcyBtYW5kYXRvcnkgKHRydWUpIG9yIG9wdGlvbmFsIChmYWxzZSkuXG4gKiBAcHJvcGVydHkgeyp9IGdyaWQgVGhlIGxvYWRlZCBOQUQgZ3JpZCBvYmplY3QsIG9yIG51bGwgaWYgbm90IGxvYWRlZCBvciBub3QgYXBwbGljYWJsZS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNOdWxsIFRydWUgaWYgdGhlIGdyaWQgaXMgZXhwbGljaXRseSAnbnVsbCcsIG90aGVyd2lzZSBmYWxzZS5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE5UVjJHcmlkT3B0aW9uc1xuICogQHByb3BlcnR5IHtib29sZWFufSBbaW5jbHVkZUVycm9yRmllbGRzPXRydWVdIFdoZXRoZXIgdG8gaW5jbHVkZSBlcnJvciBmaWVsZHMgaW4gdGhlIHN1YmdyaWRzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTmFkZ3JpZEhlYWRlclxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtuRmllbGRzXSBOdW1iZXIgb2YgZmllbGRzIGluIHRoZSBoZWFkZXIuXG4gKiBAcHJvcGVydHkge251bWJlcn0gW25TdWJncmlkRmllbGRzXSBOdW1iZXIgb2YgZmllbGRzIGluIGVhY2ggc3ViZ3JpZCBoZWFkZXIuXG4gKiBAcHJvcGVydHkge251bWJlcn0gblN1YmdyaWRzIE51bWJlciBvZiBzdWJncmlkcyBpbiB0aGUgZmlsZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2hpZnRUeXBlXSBUeXBlIG9mIHNoaWZ0IChlLmcuLCBcIlNFQ09ORFNcIikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2Zyb21TZW1pTWFqb3JBeGlzXSBTb3VyY2UgZWxsaXBzb2lkIHNlbWktbWFqb3IgYXhpcy5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbZnJvbVNlbWlNaW5vckF4aXNdIFNvdXJjZSBlbGxpcHNvaWQgc2VtaS1taW5vciBheGlzLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0b1NlbWlNYWpvckF4aXNdIFRhcmdldCBlbGxpcHNvaWQgc2VtaS1tYWpvciBheGlzLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0b1NlbWlNaW5vckF4aXNdIFRhcmdldCBlbGxpcHNvaWQgc2VtaS1taW5vciBheGlzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gU3ViZ3JpZFxuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBsbCBMb3dlciBsZWZ0IGNvcm5lciBvZiB0aGUgZ3JpZCBpbiByYWRpYW5zIFtsb25naXR1ZGUsIGxhdGl0dWRlXS5cbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gZGVsIEdyaWQgc3BhY2luZyBpbiByYWRpYW5zIFtsb25naXR1ZGUgaW50ZXJ2YWwsIGxhdGl0dWRlIGludGVydmFsXS5cbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gbGltIE51bWJlciBvZiBjb2x1bW5zIGluIHRoZSBncmlkIFtsb25naXR1ZGUgY29sdW1ucywgbGF0aXR1ZGUgY29sdW1uc10uXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2NvdW50XSBUb3RhbCBudW1iZXIgb2YgZ3JpZCBub2Rlcy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IGN2cyBNYXBwZWQgbm9kZSB2YWx1ZXMgZm9yIHRoZSBncmlkLlxuICovXG5cbi8qKiBAdHlwZWRlZiB7e2hlYWRlcjogTmFkZ3JpZEhlYWRlciwgc3ViZ3JpZHM6IEFycmF5PFN1YmdyaWQ+fX0gTkFER3JpZCAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEdlb1RJRkZcbiAqIEBwcm9wZXJ0eSB7KCkgPT4gUHJvbWlzZTxudW1iZXI+fSBnZXRJbWFnZUNvdW50IC0gUmV0dXJucyB0aGUgbnVtYmVyIG9mIGltYWdlcyBpbiB0aGUgR2VvVElGRi5cbiAqIEBwcm9wZXJ0eSB7KGluZGV4OiBudW1iZXIpID0+IFByb21pc2U8R2VvVElGRkltYWdlPn0gZ2V0SW1hZ2UgLSBSZXR1cm5zIGEgR2VvVElGRkltYWdlIGZvciB0aGUgZ2l2ZW4gaW5kZXguXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBHZW9USUZGSW1hZ2VcbiAqIEBwcm9wZXJ0eSB7KCkgPT4gbnVtYmVyfSBnZXRXaWR0aCAtIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBpbWFnZS5cbiAqIEBwcm9wZXJ0eSB7KCkgPT4gbnVtYmVyfSBnZXRIZWlnaHQgLSBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGltYWdlLlxuICogQHByb3BlcnR5IHsoKSA9PiBudW1iZXJbXX0gZ2V0Qm91bmRpbmdCb3ggLSBSZXR1cm5zIHRoZSBib3VuZGluZyBib3ggYXMgW21pblgsIG1pblksIG1heFgsIG1heFldIGluIGRlZ3JlZXMuXG4gKiBAcHJvcGVydHkgeygpID0+IFByb21pc2U8QXJyYXlMaWtlPEFycmF5TGlrZTxudW1iZXI+Pj59IHJlYWRSYXN0ZXJzIC0gUmV0dXJucyB0aGUgcmFzdGVyIGRhdGEgYXMgYW4gYXJyYXkgb2YgYmFuZHMuXG4gKiBAcHJvcGVydHkge09iamVjdH0gZmlsZURpcmVjdG9yeSAtIFRoZSBmaWxlIGRpcmVjdG9yeSBvYmplY3QgY29udGFpbmluZyBtZXRhZGF0YS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBmaWxlRGlyZWN0b3J5Lk1vZGVsUGl4ZWxTY2FsZSAtIFRoZSBwaXhlbCBzY2FsZSBhcnJheSBbc2NhbGVYLCBzY2FsZVksIHNjYWxlWl0gaW4gZGVncmVlcy5cbiAqL1xuXG52YXIgbG9hZGVkTmFkZ3JpZHMgPSB7fTtcblxuLyoqXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBsb2FkZWQgZ3JpZC5cbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGRhdGEgLSBUaGUgTlR2MiBncmlkIGRhdGEgYXMgYW4gQXJyYXlCdWZmZXIuXG4gKiBAcGFyYW0ge05UVjJHcmlkT3B0aW9uc30gW29wdGlvbnNdIC0gT3B0aW9uYWwgcGFyYW1ldGVycyBmb3IgbG9hZGluZyB0aGUgZ3JpZC5cbiAqIEByZXR1cm5zIHtOQURHcmlkfSAtIFRoZSBsb2FkZWQgTkFEIGdyaWQgaW5mb3JtYXRpb24uXG4gKi9cbi8qKlxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgbG9hZGVkIGdyaWQuXG4gKiBAcGFyYW0ge0dlb1RJRkZ9IGRhdGEgLSBUaGUgR2VvVElGRiBpbnN0YW5jZSB0byByZWFkIHRoZSBncmlkIGZyb20uXG4gKiBAcmV0dXJucyB7e3JlYWR5OiBQcm9taXNlPE5BREdyaWQ+fX0gLSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbG9hZGVkIGdyaWQgaW5mb3JtYXRpb24uXG4gKi9cbi8qKlxuICogTG9hZCBlaXRoZXIgYSBOVHYyIGZpbGUgKC5nc2IpIG9yIGEgR2VvdGlmZiAoLnRpZikgdG8gYSBrZXkgdGhhdCBjYW4gYmUgdXNlZCBpbiBhIHByb2ogc3RyaW5nIGxpa2UgK25hZGdyaWRzPTxrZXk+LiBQYXNzIHRoZSBOVHYyIGZpbGVcbiAqIGFzIGFuIEFycmF5QnVmZmVyLiBQYXNzIEdlb3RpZmYgYXMgYSBHZW9USUZGIGluc3RhbmNlIGZyb20gdGhlIGdlb3RpZmYuanMgbGlicmFyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBsb2FkZWQgZ3JpZC5cbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ8R2VvVElGRn0gZGF0YSBUaGUgZGF0YSB0byBsb2FkLCBlaXRoZXIgYW4gQXJyYXlCdWZmZXIgZm9yIE5UdjIgb3IgYSBHZW9USUZGIGluc3RhbmNlLlxuICogQHBhcmFtIHtOVFYyR3JpZE9wdGlvbnN9IFtvcHRpb25zXSBPcHRpb25hbCBwYXJhbWV0ZXJzLlxuICogQHJldHVybnMge3tyZWFkeTogUHJvbWlzZTxOQURHcmlkPn18TkFER3JpZH0gLSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbG9hZGVkIGdyaWQgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5hZGdyaWQoa2V5LCBkYXRhLCBvcHRpb25zKSB7XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gcmVhZE5UVjJHcmlkKGtleSwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIHsgcmVhZHk6IHJlYWRHZW90aWZmR3JpZChrZXksIGRhdGEpIH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBsb2FkZWQgZ3JpZC5cbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGRhdGEgVGhlIE5UdjIgZ3JpZCBkYXRhIGFzIGFuIEFycmF5QnVmZmVyLlxuICogQHBhcmFtIHtOVFYyR3JpZE9wdGlvbnN9IFtvcHRpb25zXSBPcHRpb25hbCBwYXJhbWV0ZXJzIGZvciBsb2FkaW5nIHRoZSBncmlkLlxuICogQHJldHVybnMge05BREdyaWR9IFRoZSBsb2FkZWQgTkFEIGdyaWQgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIHJlYWROVFYyR3JpZChrZXksIGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIGluY2x1ZGVFcnJvckZpZWxkcyA9IHRydWU7XG4gIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5pbmNsdWRlRXJyb3JGaWVsZHMgPT09IGZhbHNlKSB7XG4gICAgaW5jbHVkZUVycm9yRmllbGRzID0gZmFsc2U7XG4gIH1cbiAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoZGF0YSk7XG4gIHZhciBpc0xpdHRsZUVuZGlhbiA9IGRldGVjdExpdHRsZUVuZGlhbih2aWV3KTtcbiAgdmFyIGhlYWRlciA9IHJlYWRIZWFkZXIodmlldywgaXNMaXR0bGVFbmRpYW4pO1xuICB2YXIgc3ViZ3JpZHMgPSByZWFkU3ViZ3JpZHModmlldywgaGVhZGVyLCBpc0xpdHRsZUVuZGlhbiwgaW5jbHVkZUVycm9yRmllbGRzKTtcbiAgdmFyIG5hZGdyaWQgPSB7IGhlYWRlcjogaGVhZGVyLCBzdWJncmlkczogc3ViZ3JpZHMgfTtcbiAgbG9hZGVkTmFkZ3JpZHNba2V5XSA9IG5hZGdyaWQ7XG4gIHJldHVybiBuYWRncmlkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgbG9hZGVkIGdyaWQuXG4gKiBAcGFyYW0ge0dlb1RJRkZ9IHRpZmYgVGhlIEdlb1RJRkYgaW5zdGFuY2UgdG8gcmVhZCB0aGUgZ3JpZCBmcm9tLlxuICogQHJldHVybnMge1Byb21pc2U8TkFER3JpZD59IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBsb2FkZWQgTkFEIGdyaWQgaW5mb3JtYXRpb24uXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRHZW90aWZmR3JpZChrZXksIHRpZmYpIHtcbiAgdmFyIHN1YmdyaWRzID0gW107XG4gIHZhciBzdWJHcmlkQ291bnQgPSBhd2FpdCB0aWZmLmdldEltYWdlQ291bnQoKTtcbiAgLy8gcHJvaiBwcm9kdWNlZCB0aWZmIGdyaWQgc2hpZnQgZmlsZXMgYXBwZWFyIHRvIG9yZ2FuaXplIGxvd2VyIHJlcyBzdWJncmlkcyBmaXJzdCwgaGlnaGVyIHJlcy8gY2hpbGQgc3ViZ3JpZHMgbGFzdC5cbiAgZm9yICh2YXIgc3ViZ3JpZEluZGV4ID0gc3ViR3JpZENvdW50IC0gMTsgc3ViZ3JpZEluZGV4ID49IDA7IHN1YmdyaWRJbmRleC0tKSB7XG4gICAgdmFyIGltYWdlID0gYXdhaXQgdGlmZi5nZXRJbWFnZShzdWJncmlkSW5kZXgpO1xuXG4gICAgdmFyIHJhc3RlcnMgPSBhd2FpdCBpbWFnZS5yZWFkUmFzdGVycygpO1xuICAgIHZhciBkYXRhID0gcmFzdGVycztcbiAgICB2YXIgbGltID0gW2ltYWdlLmdldFdpZHRoKCksIGltYWdlLmdldEhlaWdodCgpXTtcbiAgICB2YXIgaW1hZ2VCQm94UmFkaWFucyA9IGltYWdlLmdldEJvdW5kaW5nQm94KCkubWFwKGRlZ3JlZXNUb1JhZGlhbnMpO1xuICAgIHZhciBkZWwgPSBbaW1hZ2UuZmlsZURpcmVjdG9yeS5Nb2RlbFBpeGVsU2NhbGVbMF0sIGltYWdlLmZpbGVEaXJlY3RvcnkuTW9kZWxQaXhlbFNjYWxlWzFdXS5tYXAoZGVncmVlc1RvUmFkaWFucyk7XG5cbiAgICB2YXIgbWF4WCA9IGltYWdlQkJveFJhZGlhbnNbMF0gKyAobGltWzBdIC0gMSkgKiBkZWxbMF07XG4gICAgdmFyIG1pblkgPSBpbWFnZUJCb3hSYWRpYW5zWzNdIC0gKGxpbVsxXSAtIDEpICogZGVsWzFdO1xuXG4gICAgdmFyIGxhdGl0dWRlT2Zmc2V0QmFuZCA9IGRhdGFbMF07XG4gICAgdmFyIGxvbmdpdHVkZU9mZnNldEJhbmQgPSBkYXRhWzFdO1xuICAgIHZhciBub2RlcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IGxpbVsxXSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBmb3IgKGxldCBqID0gbGltWzBdIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gaSAqIGxpbVswXSArIGo7XG4gICAgICAgIG5vZGVzLnB1c2goWy1zZWNvbmRzVG9SYWRpYW5zKGxvbmdpdHVkZU9mZnNldEJhbmRbaW5kZXhdKSwgc2Vjb25kc1RvUmFkaWFucyhsYXRpdHVkZU9mZnNldEJhbmRbaW5kZXhdKV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1YmdyaWRzLnB1c2goe1xuICAgICAgZGVsOiBkZWwsXG4gICAgICBsaW06IGxpbSxcbiAgICAgIGxsOiBbLW1heFgsIG1pblldLFxuICAgICAgY3ZzOiBub2Rlc1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHRpZkdyaWQgPSB7XG4gICAgaGVhZGVyOiB7XG4gICAgICBuU3ViZ3JpZHM6IHN1YkdyaWRDb3VudFxuICAgIH0sXG4gICAgc3ViZ3JpZHM6IHN1YmdyaWRzXG4gIH07XG4gIGxvYWRlZE5hZGdyaWRzW2tleV0gPSB0aWZHcmlkO1xuICByZXR1cm4gdGlmR3JpZDtcbn07XG5cbi8qKlxuICogR2l2ZW4gYSBwcm9qNCB2YWx1ZSBmb3IgbmFkZ3JpZHMsIHJldHVybiBhbiBhcnJheSBvZiBsb2FkZWQgZ3JpZHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYWRncmlkcyBBIGNvbW1hLXNlcGFyYXRlZCBsaXN0IG9mIGdyaWQgbmFtZXMsIG9wdGlvbmFsbHkgcHJlZml4ZWQgd2l0aCAnQCcgdG8gaW5kaWNhdGUgb3B0aW9uYWwgZ3JpZHMuXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFkZ3JpZHMobmFkZ3JpZHMpIHtcbiAgLy8gRm9ybWF0IGRldGFpbHM6IGh0dHA6Ly9wcm9qLm1hcHRvb2xzLm9yZy9nZW5fcGFybXMuaHRtbFxuICBpZiAobmFkZ3JpZHMgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBncmlkcyA9IG5hZGdyaWRzLnNwbGl0KCcsJyk7XG4gIHJldHVybiBncmlkcy5tYXAocGFyc2VOYWRncmlkU3RyaW5nKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5hZGdyaWQgc3RyaW5nIHRvIGdldCBpbmZvcm1hdGlvbiBmb3IuXG4gKiBAcmV0dXJucyB7TmFkZ3JpZEluZm98bnVsbH0gQW4gb2JqZWN0IHdpdGggZ3JpZCBpbmZvcm1hdGlvbiwgb3IgbnVsbCBpZiB0aGUgaW5wdXQgaXMgZW1wdHkuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlTmFkZ3JpZFN0cmluZyh2YWx1ZSkge1xuICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIG9wdGlvbmFsID0gdmFsdWVbMF0gPT09ICdAJztcbiAgaWYgKG9wdGlvbmFsKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgfVxuICBpZiAodmFsdWUgPT09ICdudWxsJykge1xuICAgIHJldHVybiB7IG5hbWU6ICdudWxsJywgbWFuZGF0b3J5OiAhb3B0aW9uYWwsIGdyaWQ6IG51bGwsIGlzTnVsbDogdHJ1ZSB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogdmFsdWUsXG4gICAgbWFuZGF0b3J5OiAhb3B0aW9uYWwsXG4gICAgZ3JpZDogbG9hZGVkTmFkZ3JpZHNbdmFsdWVdIHx8IG51bGwsXG4gICAgaXNOdWxsOiBmYWxzZVxuICB9O1xufVxuXG5mdW5jdGlvbiBkZWdyZWVzVG9SYWRpYW5zKGRlZ3JlZXMpIHtcbiAgcmV0dXJuIChkZWdyZWVzKSAqIE1hdGguUEkgLyAxODA7XG59XG5cbmZ1bmN0aW9uIHNlY29uZHNUb1JhZGlhbnMoc2Vjb25kcykge1xuICByZXR1cm4gKHNlY29uZHMgLyAzNjAwKSAqIE1hdGguUEkgLyAxODA7XG59XG5cbmZ1bmN0aW9uIGRldGVjdExpdHRsZUVuZGlhbih2aWV3KSB7XG4gIHZhciBuRmllbGRzID0gdmlldy5nZXRJbnQzMig4LCBmYWxzZSk7XG4gIGlmIChuRmllbGRzID09PSAxMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBuRmllbGRzID0gdmlldy5nZXRJbnQzMig4LCB0cnVlKTtcbiAgaWYgKG5GaWVsZHMgIT09IDExKSB7XG4gICAgY29uc29sZS53YXJuKCdGYWlsZWQgdG8gZGV0ZWN0IG5hZGdyaWQgZW5kaWFuLW5lc3MsIGRlZmF1bHRpbmcgdG8gbGl0dGxlLWVuZGlhbicpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZWFkSGVhZGVyKHZpZXcsIGlzTGl0dGxlRW5kaWFuKSB7XG4gIHJldHVybiB7XG4gICAgbkZpZWxkczogdmlldy5nZXRJbnQzMig4LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgblN1YmdyaWRGaWVsZHM6IHZpZXcuZ2V0SW50MzIoMjQsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBuU3ViZ3JpZHM6IHZpZXcuZ2V0SW50MzIoNDAsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBzaGlmdFR5cGU6IGRlY29kZVN0cmluZyh2aWV3LCA1NiwgNTYgKyA4KS50cmltKCksXG4gICAgZnJvbVNlbWlNYWpvckF4aXM6IHZpZXcuZ2V0RmxvYXQ2NCgxMjAsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBmcm9tU2VtaU1pbm9yQXhpczogdmlldy5nZXRGbG9hdDY0KDEzNiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHRvU2VtaU1ham9yQXhpczogdmlldy5nZXRGbG9hdDY0KDE1MiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHRvU2VtaU1pbm9yQXhpczogdmlldy5nZXRGbG9hdDY0KDE2OCwgaXNMaXR0bGVFbmRpYW4pXG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlY29kZVN0cmluZyh2aWV3LCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50OEFycmF5KHZpZXcuYnVmZmVyLnNsaWNlKHN0YXJ0LCBlbmQpKSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRTdWJncmlkcyh2aWV3LCBoZWFkZXIsIGlzTGl0dGxlRW5kaWFuLCBpbmNsdWRlRXJyb3JGaWVsZHMpIHtcbiAgdmFyIGdyaWRPZmZzZXQgPSAxNzY7XG4gIHZhciBncmlkcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGhlYWRlci5uU3ViZ3JpZHM7IGkrKykge1xuICAgIHZhciBzdWJIZWFkZXIgPSByZWFkR3JpZEhlYWRlcih2aWV3LCBncmlkT2Zmc2V0LCBpc0xpdHRsZUVuZGlhbik7XG4gICAgdmFyIG5vZGVzID0gcmVhZEdyaWROb2Rlcyh2aWV3LCBncmlkT2Zmc2V0LCBzdWJIZWFkZXIsIGlzTGl0dGxlRW5kaWFuLCBpbmNsdWRlRXJyb3JGaWVsZHMpO1xuICAgIHZhciBsbmdDb2x1bW5Db3VudCA9IE1hdGgucm91bmQoXG4gICAgICAxICsgKHN1YkhlYWRlci51cHBlckxvbmdpdHVkZSAtIHN1YkhlYWRlci5sb3dlckxvbmdpdHVkZSkgLyBzdWJIZWFkZXIubG9uZ2l0dWRlSW50ZXJ2YWwpO1xuICAgIHZhciBsYXRDb2x1bW5Db3VudCA9IE1hdGgucm91bmQoXG4gICAgICAxICsgKHN1YkhlYWRlci51cHBlckxhdGl0dWRlIC0gc3ViSGVhZGVyLmxvd2VyTGF0aXR1ZGUpIC8gc3ViSGVhZGVyLmxhdGl0dWRlSW50ZXJ2YWwpO1xuICAgIC8vIFByb2o0IG9wZXJhdGVzIG9uIHJhZGlhbnMgd2hlcmVhcyB0aGUgY29vcmRpbmF0ZXMgYXJlIGluIHNlY29uZHMgaW4gdGhlIGdyaWRcbiAgICBncmlkcy5wdXNoKHtcbiAgICAgIGxsOiBbc2Vjb25kc1RvUmFkaWFucyhzdWJIZWFkZXIubG93ZXJMb25naXR1ZGUpLCBzZWNvbmRzVG9SYWRpYW5zKHN1YkhlYWRlci5sb3dlckxhdGl0dWRlKV0sXG4gICAgICBkZWw6IFtzZWNvbmRzVG9SYWRpYW5zKHN1YkhlYWRlci5sb25naXR1ZGVJbnRlcnZhbCksIHNlY29uZHNUb1JhZGlhbnMoc3ViSGVhZGVyLmxhdGl0dWRlSW50ZXJ2YWwpXSxcbiAgICAgIGxpbTogW2xuZ0NvbHVtbkNvdW50LCBsYXRDb2x1bW5Db3VudF0sXG4gICAgICBjb3VudDogc3ViSGVhZGVyLmdyaWROb2RlQ291bnQsXG4gICAgICBjdnM6IG1hcE5vZGVzKG5vZGVzKVxuICAgIH0pO1xuICAgIHZhciByb3dTaXplID0gMTY7XG4gICAgaWYgKGluY2x1ZGVFcnJvckZpZWxkcyA9PT0gZmFsc2UpIHtcbiAgICAgIHJvd1NpemUgPSA4O1xuICAgIH1cbiAgICBncmlkT2Zmc2V0ICs9IDE3NiArIHN1YkhlYWRlci5ncmlkTm9kZUNvdW50ICogcm93U2l6ZTtcbiAgfVxuICByZXR1cm4gZ3JpZHM7XG59XG5cbi8qKlxuICogQHBhcmFtIHsqfSBub2Rlc1xuICogQHJldHVybnMgQXJyYXk8QXJyYXk8bnVtYmVyPj5cbiAqL1xuZnVuY3Rpb24gbWFwTm9kZXMobm9kZXMpIHtcbiAgcmV0dXJuIG5vZGVzLm1hcChmdW5jdGlvbiAocikge1xuICAgIHJldHVybiBbc2Vjb25kc1RvUmFkaWFucyhyLmxvbmdpdHVkZVNoaWZ0KSwgc2Vjb25kc1RvUmFkaWFucyhyLmxhdGl0dWRlU2hpZnQpXTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRHcmlkSGVhZGVyKHZpZXcsIG9mZnNldCwgaXNMaXR0bGVFbmRpYW4pIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBkZWNvZGVTdHJpbmcodmlldywgb2Zmc2V0ICsgOCwgb2Zmc2V0ICsgMTYpLnRyaW0oKSxcbiAgICBwYXJlbnQ6IGRlY29kZVN0cmluZyh2aWV3LCBvZmZzZXQgKyAyNCwgb2Zmc2V0ICsgMjQgKyA4KS50cmltKCksXG4gICAgbG93ZXJMYXRpdHVkZTogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDcyLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgdXBwZXJMYXRpdHVkZTogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDg4LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgbG93ZXJMb25naXR1ZGU6IHZpZXcuZ2V0RmxvYXQ2NChvZmZzZXQgKyAxMDQsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICB1cHBlckxvbmdpdHVkZTogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDEyMCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIGxhdGl0dWRlSW50ZXJ2YWw6IHZpZXcuZ2V0RmxvYXQ2NChvZmZzZXQgKyAxMzYsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBsb25naXR1ZGVJbnRlcnZhbDogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDE1MiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIGdyaWROb2RlQ291bnQ6IHZpZXcuZ2V0SW50MzIob2Zmc2V0ICsgMTY4LCBpc0xpdHRsZUVuZGlhbilcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVhZEdyaWROb2Rlcyh2aWV3LCBvZmZzZXQsIGdyaWRIZWFkZXIsIGlzTGl0dGxlRW5kaWFuLCBpbmNsdWRlRXJyb3JGaWVsZHMpIHtcbiAgdmFyIG5vZGVzT2Zmc2V0ID0gb2Zmc2V0ICsgMTc2O1xuICB2YXIgZ3JpZFJlY29yZExlbmd0aCA9IDE2O1xuXG4gIGlmIChpbmNsdWRlRXJyb3JGaWVsZHMgPT09IGZhbHNlKSB7XG4gICAgZ3JpZFJlY29yZExlbmd0aCA9IDg7XG4gIH1cblxuICB2YXIgZ3JpZFNoaWZ0UmVjb3JkcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGdyaWRIZWFkZXIuZ3JpZE5vZGVDb3VudDsgaSsrKSB7XG4gICAgdmFyIHJlY29yZCA9IHtcbiAgICAgIGxhdGl0dWRlU2hpZnQ6IHZpZXcuZ2V0RmxvYXQzMihub2Rlc09mZnNldCArIGkgKiBncmlkUmVjb3JkTGVuZ3RoLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgICBsb25naXR1ZGVTaGlmdDogdmlldy5nZXRGbG9hdDMyKG5vZGVzT2Zmc2V0ICsgaSAqIGdyaWRSZWNvcmRMZW5ndGggKyA0LCBpc0xpdHRsZUVuZGlhbilcblxuICAgIH07XG5cbiAgICBpZiAoaW5jbHVkZUVycm9yRmllbGRzICE9PSBmYWxzZSkge1xuICAgICAgcmVjb3JkLmxhdGl0dWRlQWNjdXJhY3kgPSB2aWV3LmdldEZsb2F0MzIobm9kZXNPZmZzZXQgKyBpICogZ3JpZFJlY29yZExlbmd0aCArIDgsIGlzTGl0dGxlRW5kaWFuKTtcbiAgICAgIHJlY29yZC5sb25naXR1ZGVBY2N1cmFjeSA9IHZpZXcuZ2V0RmxvYXQzMihub2Rlc09mZnNldCArIGkgKiBncmlkUmVjb3JkTGVuZ3RoICsgMTIsIGlzTGl0dGxlRW5kaWFuKTtcbiAgICB9XG5cbiAgICBncmlkU2hpZnRSZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgfVxuICByZXR1cm4gZ3JpZFNoaWZ0UmVjb3Jkcztcbn1cbiIsImltcG9ydCBkZWZzIGZyb20gJy4vZGVmcyc7XG5pbXBvcnQgd2t0IGZyb20gJ3drdC1wYXJzZXInO1xuaW1wb3J0IHByb2pTdHIgZnJvbSAnLi9wcm9qU3RyaW5nJztcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJztcbmZ1bmN0aW9uIHRlc3RPYmooY29kZSkge1xuICByZXR1cm4gdHlwZW9mIGNvZGUgPT09ICdzdHJpbmcnO1xufVxuZnVuY3Rpb24gdGVzdERlZihjb2RlKSB7XG4gIHJldHVybiBjb2RlIGluIGRlZnM7XG59XG5mdW5jdGlvbiB0ZXN0V0tUKGNvZGUpIHtcbiAgcmV0dXJuIChjb2RlLmluZGV4T2YoJysnKSAhPT0gMCAmJiBjb2RlLmluZGV4T2YoJ1snKSAhPT0gLTEpIHx8ICh0eXBlb2YgY29kZSA9PT0gJ29iamVjdCcgJiYgISgnc3JzQ29kZScgaW4gY29kZSkpO1xufVxudmFyIGNvZGVzID0gWyczODU3JywgJzkwMDkxMycsICczNzg1JywgJzEwMjExMyddO1xuZnVuY3Rpb24gY2hlY2tNZXJjYXRvcihpdGVtKSB7XG4gIHZhciBhdXRoID0gbWF0Y2goaXRlbSwgJ2F1dGhvcml0eScpO1xuICBpZiAoIWF1dGgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGNvZGUgPSBtYXRjaChhdXRoLCAnZXBzZycpO1xuICByZXR1cm4gY29kZSAmJiBjb2Rlcy5pbmRleE9mKGNvZGUpID4gLTE7XG59XG5mdW5jdGlvbiBjaGVja1Byb2pTdHIoaXRlbSkge1xuICB2YXIgZXh0ID0gbWF0Y2goaXRlbSwgJ2V4dGVuc2lvbicpO1xuICBpZiAoIWV4dCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gbWF0Y2goZXh0LCAncHJvajQnKTtcbn1cbmZ1bmN0aW9uIHRlc3RQcm9qKGNvZGUpIHtcbiAgcmV0dXJuIGNvZGVbMF0gPT09ICcrJztcbn1cbi8qKlxuICogQHBhcmFtIHtzdHJpbmcgfCBpbXBvcnQoJy4vY29yZScpLlBST0pKU09ORGVmaW5pdGlvbiB8IGltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259IGNvZGVcbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufVxuICovXG5mdW5jdGlvbiBwYXJzZShjb2RlKSB7XG4gIGlmICh0ZXN0T2JqKGNvZGUpKSB7XG4gICAgLy8gY2hlY2sgdG8gc2VlIGlmIHRoaXMgaXMgYSBXS1Qgc3RyaW5nXG4gICAgaWYgKHRlc3REZWYoY29kZSkpIHtcbiAgICAgIHJldHVybiBkZWZzW2NvZGVdO1xuICAgIH1cbiAgICBpZiAodGVzdFdLVChjb2RlKSkge1xuICAgICAgdmFyIG91dCA9IHdrdChjb2RlKTtcbiAgICAgIC8vIHRlc3Qgb2Ygc3BldGlhbCBjYXNlLCBkdWUgdG8gdGhpcyBiZWluZyBhIHZlcnkgY29tbW9uIGFuZCBvZnRlbiBtYWxmb3JtZWRcbiAgICAgIGlmIChjaGVja01lcmNhdG9yKG91dCkpIHtcbiAgICAgICAgcmV0dXJuIGRlZnNbJ0VQU0c6Mzg1NyddO1xuICAgICAgfVxuICAgICAgdmFyIG1heWJlUHJvalN0ciA9IGNoZWNrUHJvalN0cihvdXQpO1xuICAgICAgaWYgKG1heWJlUHJvalN0cikge1xuICAgICAgICByZXR1cm4gcHJvalN0cihtYXliZVByb2pTdHIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgaWYgKHRlc3RQcm9qKGNvZGUpKSB7XG4gICAgICByZXR1cm4gcHJvalN0cihjb2RlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoISgncHJvak5hbWUnIGluIGNvZGUpKSB7XG4gICAgcmV0dXJuIHdrdChjb2RlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29kZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZTtcbiIsImltcG9ydCB7IEQyUiB9IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgUHJpbWVNZXJpZGlhbiBmcm9tICcuL2NvbnN0YW50cy9QcmltZU1lcmlkaWFuJztcbmltcG9ydCB1bml0cyBmcm9tICcuL2NvbnN0YW50cy91bml0cyc7XG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCc7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGRlZkRhdGFcbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZGVmRGF0YSkge1xuICAvKiogQHR5cGUge2ltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259ICovXG4gIHZhciBzZWxmID0ge307XG4gIHZhciBwYXJhbU9iaiA9IGRlZkRhdGEuc3BsaXQoJysnKS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICByZXR1cm4gdi50cmltKCk7XG4gIH0pLmZpbHRlcihmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBhO1xuICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHAsIGEpIHtcbiAgICAvKiogQHR5cGUge0FycmF5PD8+fSAqL1xuICAgIHZhciBzcGxpdCA9IGEuc3BsaXQoJz0nKTtcbiAgICBzcGxpdC5wdXNoKHRydWUpO1xuICAgIHBbc3BsaXRbMF0udG9Mb3dlckNhc2UoKV0gPSBzcGxpdFsxXTtcbiAgICByZXR1cm4gcDtcbiAgfSwge30pO1xuICB2YXIgcGFyYW1OYW1lLCBwYXJhbVZhbCwgcGFyYW1PdXRuYW1lO1xuICB2YXIgcGFyYW1zID0ge1xuICAgIHByb2o6ICdwcm9qTmFtZScsXG4gICAgZGF0dW06ICdkYXR1bUNvZGUnLFxuICAgIHJmOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5yZiA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICBsYXRfMDogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubGF0MCA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBsYXRfMTogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubGF0MSA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBsYXRfMjogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubGF0MiA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBsYXRfdHM6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxhdF90cyA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBsb25fMDogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubG9uZzAgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbG9uXzE6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxvbmcxID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGxvbl8yOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sb25nMiA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBhbHBoYTogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuYWxwaGEgPSBwYXJzZUZsb2F0KHYpICogRDJSO1xuICAgIH0sXG4gICAgZ2FtbWE6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLnJlY3RpZmllZF9ncmlkX2FuZ2xlID0gcGFyc2VGbG9hdCh2KSAqIEQyUjtcbiAgICB9LFxuICAgIGxvbmM6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxvbmdjID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIHhfMDogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYueDAgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgeV8wOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi55MCA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICBrXzA6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmswID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGs6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmswID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGE6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmEgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgYjogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuYiA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICByOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5hID0gc2VsZi5iID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIHJfYTogZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5SX0EgPSB0cnVlO1xuICAgIH0sXG4gICAgem9uZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuem9uZSA9IHBhcnNlSW50KHYsIDEwKTtcbiAgICB9LFxuICAgIHNvdXRoOiBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnV0bVNvdXRoID0gdHJ1ZTtcbiAgICB9LFxuICAgIHRvd2dzODQ6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmRhdHVtX3BhcmFtcyA9IHYuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHRvX21ldGVyOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi50b19tZXRlciA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICB1bml0czogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYudW5pdHMgPSB2O1xuICAgICAgdmFyIHVuaXQgPSBtYXRjaCh1bml0cywgdik7XG4gICAgICBpZiAodW5pdCkge1xuICAgICAgICBzZWxmLnRvX21ldGVyID0gdW5pdC50b19tZXRlcjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZyb21fZ3JlZW53aWNoOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5mcm9tX2dyZWVud2ljaCA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBwbTogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHZhciBwbSA9IG1hdGNoKFByaW1lTWVyaWRpYW4sIHYpO1xuICAgICAgc2VsZi5mcm9tX2dyZWVud2ljaCA9IChwbSA/IHBtIDogcGFyc2VGbG9hdCh2KSkgKiBEMlI7XG4gICAgfSxcbiAgICBuYWRncmlkczogZnVuY3Rpb24gKHYpIHtcbiAgICAgIGlmICh2ID09PSAnQG51bGwnKSB7XG4gICAgICAgIHNlbGYuZGF0dW1Db2RlID0gJ25vbmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5uYWRncmlkcyA9IHY7XG4gICAgICB9XG4gICAgfSxcbiAgICBheGlzOiBmdW5jdGlvbiAodikge1xuICAgICAgdmFyIGxlZ2FsQXhpcyA9ICdld25zdWQnO1xuICAgICAgaWYgKHYubGVuZ3RoID09PSAzICYmIGxlZ2FsQXhpcy5pbmRleE9mKHYuc3Vic3RyKDAsIDEpKSAhPT0gLTEgJiYgbGVnYWxBeGlzLmluZGV4T2Yodi5zdWJzdHIoMSwgMSkpICE9PSAtMSAmJiBsZWdhbEF4aXMuaW5kZXhPZih2LnN1YnN0cigyLCAxKSkgIT09IC0xKSB7XG4gICAgICAgIHNlbGYuYXhpcyA9IHY7XG4gICAgICB9XG4gICAgfSxcbiAgICBhcHByb3g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuYXBwcm94ID0gdHJ1ZTtcbiAgICB9LFxuICAgIG92ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYub3ZlciA9IHRydWU7XG4gICAgfVxuICB9O1xuICBmb3IgKHBhcmFtTmFtZSBpbiBwYXJhbU9iaikge1xuICAgIHBhcmFtVmFsID0gcGFyYW1PYmpbcGFyYW1OYW1lXTtcbiAgICBpZiAocGFyYW1OYW1lIGluIHBhcmFtcykge1xuICAgICAgcGFyYW1PdXRuYW1lID0gcGFyYW1zW3BhcmFtTmFtZV07XG4gICAgICBpZiAodHlwZW9mIHBhcmFtT3V0bmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwYXJhbU91dG5hbWUocGFyYW1WYWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZltwYXJhbU91dG5hbWVdID0gcGFyYW1WYWw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGZbcGFyYW1OYW1lXSA9IHBhcmFtVmFsO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHNlbGYuZGF0dW1Db2RlID09PSAnc3RyaW5nJyAmJiBzZWxmLmRhdHVtQ29kZSAhPT0gJ1dHUzg0Jykge1xuICAgIHNlbGYuZGF0dW1Db2RlID0gc2VsZi5kYXR1bUNvZGUudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBzZWxmWydwcm9qU3RyJ10gPSBkZWZEYXRhO1xuICByZXR1cm4gc2VsZjtcbn1cbiIsImltcG9ydCBtZXJjIGZyb20gJy4vcHJvamVjdGlvbnMvbWVyYyc7XG5pbXBvcnQgbG9uZ2xhdCBmcm9tICcuL3Byb2plY3Rpb25zL2xvbmdsYXQnO1xuLyoqIEB0eXBlIHtBcnJheTxQYXJ0aWFsPGltcG9ydCgnLi9Qcm9qJykuZGVmYXVsdD4+fSAqL1xudmFyIHByb2pzID0gW21lcmMsIGxvbmdsYXRdO1xudmFyIG5hbWVzID0ge307XG52YXIgcHJvalN0b3JlID0gW107XG5cbi8qKlxuICogQHBhcmFtIHtpbXBvcnQoJy4vUHJvaicpLmRlZmF1bHR9IHByb2pcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGQocHJvaiwgaSkge1xuICB2YXIgbGVuID0gcHJvalN0b3JlLmxlbmd0aDtcbiAgaWYgKCFwcm9qLm5hbWVzKSB7XG4gICAgY29uc29sZS5sb2coaSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcHJvalN0b3JlW2xlbl0gPSBwcm9qO1xuICBwcm9qLm5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICBuYW1lc1tuLnRvTG93ZXJDYXNlKCldID0gbGVuO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb3JtYWxpemVkUHJvak5hbWUobikge1xuICByZXR1cm4gbi5yZXBsYWNlKC9bLVxcKFxcKVxcc10rL2csICcgJykudHJpbSgpLnJlcGxhY2UoLyAvZywgJ18nKTtcbn1cblxuLyoqXG4gKiBHZXQgYSBwcm9qZWN0aW9uIGJ5IG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHJldHVybnMge2ltcG9ydCgnLi9Qcm9qJykuZGVmYXVsdHxmYWxzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldChuYW1lKSB7XG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbiA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKHR5cGVvZiBuYW1lc1tuXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvalN0b3JlW25hbWVzW25dXSkge1xuICAgIHJldHVybiBwcm9qU3RvcmVbbmFtZXNbbl1dO1xuICB9XG4gIG4gPSBnZXROb3JtYWxpemVkUHJvak5hbWUobik7XG4gIGlmIChuIGluIG5hbWVzICYmIHByb2pTdG9yZVtuYW1lc1tuXV0pIHtcbiAgICByZXR1cm4gcHJvalN0b3JlW25hbWVzW25dXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQoKSB7XG4gIHByb2pzLmZvckVhY2goYWRkKTtcbn1cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3RhcnQ6IHN0YXJ0LFxuICBhZGQ6IGFkZCxcbiAgZ2V0OiBnZXRcbn07XG4iLCJpbXBvcnQgbXNmbnogZnJvbSAnLi4vY29tbW9uL21zZm56JztcbmltcG9ydCBxc2ZueiBmcm9tICcuLi9jb21tb24vcXNmbnonO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFzaW56IGZyb20gJy4uL2NvbW1vbi9hc2lueic7XG5pbXBvcnQgeyBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRlbXBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGUzXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luX3BvXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zX3BvXG4gKiBAcHJvcGVydHkge251bWJlcn0gdDFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb25cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtczFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxczFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0MlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1zMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHFzMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHQzXG4gKiBAcHJvcGVydHkge251bWJlcn0gcXMwXG4gKiBAcHJvcGVydHkge251bWJlcn0gbnMwXG4gKiBAcHJvcGVydHkge251bWJlcn0gY1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHJoXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luX3BoaVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc19waGlcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgKyB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmVzID0gMSAtIE1hdGgucG93KHRoaXMudGVtcCwgMik7XG4gIHRoaXMuZTMgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG5cbiAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDEpO1xuICB0aGlzLmNvc19wbyA9IE1hdGguY29zKHRoaXMubGF0MSk7XG4gIHRoaXMudDEgPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5jb24gPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5tczEgPSBtc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbywgdGhpcy5jb3NfcG8pO1xuICB0aGlzLnFzMSA9IHFzZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvKTtcblxuICB0aGlzLnNpbl9wbyA9IE1hdGguc2luKHRoaXMubGF0Mik7XG4gIHRoaXMuY29zX3BvID0gTWF0aC5jb3ModGhpcy5sYXQyKTtcbiAgdGhpcy50MiA9IHRoaXMuc2luX3BvO1xuICB0aGlzLm1zMiA9IG1zZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvLCB0aGlzLmNvc19wbyk7XG4gIHRoaXMucXMyID0gcXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcG8pO1xuXG4gIHRoaXMuc2luX3BvID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgdGhpcy5jb3NfcG8gPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICB0aGlzLnQzID0gdGhpcy5zaW5fcG87XG4gIHRoaXMucXMwID0gcXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcG8pO1xuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgLSB0aGlzLmxhdDIpID4gRVBTTE4pIHtcbiAgICB0aGlzLm5zMCA9ICh0aGlzLm1zMSAqIHRoaXMubXMxIC0gdGhpcy5tczIgKiB0aGlzLm1zMikgLyAodGhpcy5xczIgLSB0aGlzLnFzMSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5uczAgPSB0aGlzLmNvbjtcbiAgfVxuICB0aGlzLmMgPSB0aGlzLm1zMSAqIHRoaXMubXMxICsgdGhpcy5uczAgKiB0aGlzLnFzMTtcbiAgdGhpcy5yaCA9IHRoaXMuYSAqIE1hdGguc3FydCh0aGlzLmMgLSB0aGlzLm5zMCAqIHRoaXMucXMwKSAvIHRoaXMubnMwO1xufVxuXG4vKiBBbGJlcnMgQ29uaWNhbCBFcXVhbCBBcmVhIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHRoaXMuc2luX3BoaSA9IE1hdGguc2luKGxhdCk7XG4gIHRoaXMuY29zX3BoaSA9IE1hdGguY29zKGxhdCk7XG5cbiAgdmFyIHFzID0gcXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcGhpKTtcbiAgdmFyIHJoMSA9IHRoaXMuYSAqIE1hdGguc3FydCh0aGlzLmMgLSB0aGlzLm5zMCAqIHFzKSAvIHRoaXMubnMwO1xuICB2YXIgdGhldGEgPSB0aGlzLm5zMCAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIHggPSByaDEgKiBNYXRoLnNpbih0aGV0YSkgKyB0aGlzLngwO1xuICB2YXIgeSA9IHRoaXMucmggLSByaDEgKiBNYXRoLmNvcyh0aGV0YSkgKyB0aGlzLnkwO1xuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciByaDEsIHFzLCBjb24sIHRoZXRhLCBsb24sIGxhdDtcblxuICBwLnggLT0gdGhpcy54MDtcbiAgcC55ID0gdGhpcy5yaCAtIHAueSArIHRoaXMueTA7XG4gIGlmICh0aGlzLm5zMCA+PSAwKSB7XG4gICAgcmgxID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gMTtcbiAgfSBlbHNlIHtcbiAgICByaDEgPSAtTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gLTE7XG4gIH1cbiAgdGhldGEgPSAwO1xuICBpZiAocmgxICE9PSAwKSB7XG4gICAgdGhldGEgPSBNYXRoLmF0YW4yKGNvbiAqIHAueCwgY29uICogcC55KTtcbiAgfVxuICBjb24gPSByaDEgKiB0aGlzLm5zMCAvIHRoaXMuYTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgbGF0ID0gTWF0aC5hc2luKCh0aGlzLmMgLSBjb24gKiBjb24pIC8gKDIgKiB0aGlzLm5zMCkpO1xuICB9IGVsc2Uge1xuICAgIHFzID0gKHRoaXMuYyAtIGNvbiAqIGNvbikgLyB0aGlzLm5zMDtcbiAgICBsYXQgPSB0aGlzLnBoaTF6KHRoaXMuZTMsIHFzKTtcbiAgfVxuXG4gIGxvbiA9IGFkanVzdF9sb24odGhldGEgLyB0aGlzLm5zMCArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuLyogRnVuY3Rpb24gdG8gY29tcHV0ZSBwaGkxLCB0aGUgbGF0aXR1ZGUgZm9yIHRoZSBpbnZlcnNlIG9mIHRoZVxuICAgQWxiZXJzIENvbmljYWwgRXF1YWwtQXJlYSBwcm9qZWN0aW9uLlxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBoaTF6KGVjY2VudCwgcXMpIHtcbiAgdmFyIHNpbnBoaSwgY29zcGhpLCBjb24sIGNvbSwgZHBoaTtcbiAgdmFyIHBoaSA9IGFzaW56KDAuNSAqIHFzKTtcbiAgaWYgKGVjY2VudCA8IEVQU0xOKSB7XG4gICAgcmV0dXJuIHBoaTtcbiAgfVxuXG4gIHZhciBlY2NudHMgPSBlY2NlbnQgKiBlY2NlbnQ7XG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IDI1OyBpKyspIHtcbiAgICBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgY29uID0gZWNjZW50ICogc2lucGhpO1xuICAgIGNvbSA9IDEgLSBjb24gKiBjb247XG4gICAgZHBoaSA9IDAuNSAqIGNvbSAqIGNvbSAvIGNvc3BoaSAqIChxcyAvICgxIC0gZWNjbnRzKSAtIHNpbnBoaSAvIGNvbSArIDAuNSAvIGVjY2VudCAqIE1hdGgubG9nKCgxIC0gY29uKSAvICgxICsgY29uKSkpO1xuICAgIHBoaSA9IHBoaSArIGRwaGk7XG4gICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IDFlLTcpIHtcbiAgICAgIHJldHVybiBwaGk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydBbGJlcnNfQ29uaWNfRXF1YWxfQXJlYScsICdBbGJlcnNfRXF1YWxfQXJlYScsICdBbGJlcnMnLCAnYWVhJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lcyxcbiAgcGhpMXo6IHBoaTF6XG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHsgSEFMRl9QSSwgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBtbGZuIGZyb20gJy4uL2NvbW1vbi9tbGZuJztcbmltcG9ydCBlMGZuIGZyb20gJy4uL2NvbW1vbi9lMGZuJztcbmltcG9ydCBlMWZuIGZyb20gJy4uL2NvbW1vbi9lMWZuJztcbmltcG9ydCBlMmZuIGZyb20gJy4uL2NvbW1vbi9lMmZuJztcbmltcG9ydCBlM2ZuIGZyb20gJy4uL2NvbW1vbi9lM2ZuJztcbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuaW1wb3J0IGltbGZuIGZyb20gJy4uL2NvbW1vbi9pbWxmbic7XG5pbXBvcnQgeyB2aW5jZW50eURpcmVjdCwgdmluY2VudHlJbnZlcnNlIH0gZnJvbSAnLi4vY29tbW9uL3ZpbmNlbnR5JztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbl9wMTJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NfcDEyXG4gKiBAcHJvcGVydHkge251bWJlcn0gYVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGZcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMuc2luX3AxMiA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gIHRoaXMuY29zX3AxMiA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIC8vIGZsYXR0ZW5pbmcgZm9yIGVsbGlwc29pZFxuICB0aGlzLmYgPSB0aGlzLmVzIC8gKDEgKyBNYXRoLnNxcnQoMSAtIHRoaXMuZXMpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgc2lucGhpID0gTWF0aC5zaW4ocC55KTtcbiAgdmFyIGNvc3BoaSA9IE1hdGguY29zKHAueSk7XG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgZTAsIGUxLCBlMiwgZTMsIE1scCwgTWwsIGMsIGtwLCBjb3NfYywgdmFycywgYXppMTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiAtIDEpIDw9IEVQU0xOKSB7XG4gICAgICAvLyBOb3J0aCBQb2xlIGNhc2VcbiAgICAgIHAueCA9IHRoaXMueDAgKyB0aGlzLmEgKiAoSEFMRl9QSSAtIGxhdCkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICAgIHAueSA9IHRoaXMueTAgLSB0aGlzLmEgKiAoSEFMRl9QSSAtIGxhdCkgKiBNYXRoLmNvcyhkbG9uKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyICsgMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vIFNvdXRoIFBvbGUgY2FzZVxuICAgICAgcC54ID0gdGhpcy54MCArIHRoaXMuYSAqIChIQUxGX1BJICsgbGF0KSAqIE1hdGguc2luKGRsb24pO1xuICAgICAgcC55ID0gdGhpcy55MCArIHRoaXMuYSAqIChIQUxGX1BJICsgbGF0KSAqIE1hdGguY29zKGRsb24pO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHQgY2FzZVxuICAgICAgY29zX2MgPSB0aGlzLnNpbl9wMTIgKiBzaW5waGkgKyB0aGlzLmNvc19wMTIgKiBjb3NwaGkgKiBNYXRoLmNvcyhkbG9uKTtcbiAgICAgIGMgPSBNYXRoLmFjb3MoY29zX2MpO1xuICAgICAga3AgPSBjID8gYyAvIE1hdGguc2luKGMpIDogMTtcbiAgICAgIHAueCA9IHRoaXMueDAgKyB0aGlzLmEgKiBrcCAqIGNvc3BoaSAqIE1hdGguc2luKGRsb24pO1xuICAgICAgcC55ID0gdGhpcy55MCArIHRoaXMuYSAqIGtwICogKHRoaXMuY29zX3AxMiAqIHNpbnBoaSAtIHRoaXMuc2luX3AxMiAqIGNvc3BoaSAqIE1hdGguY29zKGRsb24pKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlMCA9IGUwZm4odGhpcy5lcyk7XG4gICAgZTEgPSBlMWZuKHRoaXMuZXMpO1xuICAgIGUyID0gZTJmbih0aGlzLmVzKTtcbiAgICBlMyA9IGUzZm4odGhpcy5lcyk7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiAtIDEpIDw9IEVQU0xOKSB7XG4gICAgICAvLyBOb3J0aCBQb2xlIGNhc2VcbiAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuICAgICAgTWwgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBsYXQpO1xuICAgICAgcC54ID0gdGhpcy54MCArIChNbHAgLSBNbCkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICAgIHAueSA9IHRoaXMueTAgLSAoTWxwIC0gTWwpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICByZXR1cm4gcDtcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiArIDEpIDw9IEVQU0xOKSB7XG4gICAgICAvLyBTb3V0aCBQb2xlIGNhc2VcbiAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuICAgICAgTWwgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBsYXQpO1xuICAgICAgcC54ID0gdGhpcy54MCArIChNbHAgKyBNbCkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICAgIHAueSA9IHRoaXMueTAgKyAoTWxwICsgTWwpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICByZXR1cm4gcDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVmYXVsdCBjYXNlXG4gICAgICBpZiAoTWF0aC5hYnMobG9uKSA8IEVQU0xOICYmIE1hdGguYWJzKGxhdCAtIHRoaXMubGF0MCkgPCBFUFNMTikge1xuICAgICAgICBwLnggPSBwLnkgPSAwO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH1cbiAgICAgIHZhcnMgPSB2aW5jZW50eUludmVyc2UodGhpcy5sYXQwLCB0aGlzLmxvbmcwLCBsYXQsIGxvbiwgdGhpcy5hLCB0aGlzLmYpO1xuICAgICAgYXppMSA9IHZhcnMuYXppMTtcbiAgICAgIHAueCA9IHZhcnMuczEyICogTWF0aC5zaW4oYXppMSk7XG4gICAgICBwLnkgPSB2YXJzLnMxMiAqIE1hdGguY29zKGF6aTEpO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICB2YXIgcmgsIHosIHNpbnosIGNvc3osIGxvbiwgbGF0LCBjb24sIGUwLCBlMSwgZTIsIGUzLCBNbHAsIE0sIGF6aTEsIHMxMiwgdmFycztcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICBpZiAocmggPiAoMiAqIEhBTEZfUEkgKiB0aGlzLmEpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHogPSByaCAvIHRoaXMuYTtcblxuICAgIHNpbnogPSBNYXRoLnNpbih6KTtcbiAgICBjb3N6ID0gTWF0aC5jb3Moeik7XG5cbiAgICBsb24gPSB0aGlzLmxvbmcwO1xuICAgIGlmIChNYXRoLmFicyhyaCkgPD0gRVBTTE4pIHtcbiAgICAgIGxhdCA9IHRoaXMubGF0MDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF0ID0gYXNpbnooY29zeiAqIHRoaXMuc2luX3AxMiArIChwLnkgKiBzaW56ICogdGhpcy5jb3NfcDEyKSAvIHJoKTtcbiAgICAgIGNvbiA9IE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJO1xuICAgICAgaWYgKE1hdGguYWJzKGNvbikgPD0gRVBTTE4pIHtcbiAgICAgICAgaWYgKHRoaXMubGF0MCA+PSAwKSB7XG4gICAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC1wLnkpLCB0aGlzLm92ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCAtIE1hdGguYXRhbjIoLXAueCwgcC55KSwgdGhpcy5vdmVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLnggKiBzaW56LCByaCAqIHRoaXMuY29zX3AxMiAqIGNvc3ogLSBwLnkgKiB0aGlzLnNpbl9wMTIgKiBzaW56KSwgdGhpcy5vdmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9IGVsc2Uge1xuICAgIGUwID0gZTBmbih0aGlzLmVzKTtcbiAgICBlMSA9IGUxZm4odGhpcy5lcyk7XG4gICAgZTIgPSBlMmZuKHRoaXMuZXMpO1xuICAgIGUzID0gZTNmbih0aGlzLmVzKTtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyIC0gMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vIE5vcnRoIHBvbGUgY2FzZVxuICAgICAgTWxwID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgSEFMRl9QSSk7XG4gICAgICByaCA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgICAgTSA9IE1scCAtIHJoO1xuICAgICAgbGF0ID0gaW1sZm4oTSAvIHRoaXMuYSwgZTAsIGUxLCBlMiwgZTMpO1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0xICogcC55KSwgdGhpcy5vdmVyKTtcbiAgICAgIHAueCA9IGxvbjtcbiAgICAgIHAueSA9IGxhdDtcbiAgICAgIHJldHVybiBwO1xuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyICsgMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vIFNvdXRoIHBvbGUgY2FzZVxuICAgICAgTWxwID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgSEFMRl9QSSk7XG4gICAgICByaCA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgICAgTSA9IHJoIC0gTWxwO1xuXG4gICAgICBsYXQgPSBpbWxmbihNIC8gdGhpcy5hLCBlMCwgZTEsIGUyLCBlMyk7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgcC55KSwgdGhpcy5vdmVyKTtcbiAgICAgIHAueCA9IGxvbjtcbiAgICAgIHAueSA9IGxhdDtcbiAgICAgIHJldHVybiBwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZhdWx0IGNhc2VcbiAgICAgIGF6aTEgPSBNYXRoLmF0YW4yKHAueCwgcC55KTtcbiAgICAgIHMxMiA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgICAgdmFycyA9IHZpbmNlbnR5RGlyZWN0KHRoaXMubGF0MCwgdGhpcy5sb25nMCwgYXppMSwgczEyLCB0aGlzLmEsIHRoaXMuZik7XG5cbiAgICAgIHAueCA9IHZhcnMubG9uMjtcbiAgICAgIHAueSA9IHZhcnMubGF0MjtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydBemltdXRoYWxfRXF1aWRpc3RhbnQnLCAnYWVxZCddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgaHlwb3QgZnJvbSAnLi4vY29tbW9uL2h5cG90JztcbmltcG9ydCBwal9lbmZuIGZyb20gJy4uL2NvbW1vbi9wal9lbmZuJztcbmltcG9ydCBwal9pbnZfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfaW52X21sZm4nO1xuaW1wb3J0IHBqX21sZm4gZnJvbSAnLi4vY29tbW9uL3BqX21sZm4nO1xuaW1wb3J0IHsgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHBoaTFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjcGhpMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGVuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbTFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhbTFcbiAqL1xuXG52YXIgRVBTMTAgPSAxZS0xMDtcblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgYztcblxuICB0aGlzLnBoaTEgPSB0aGlzLmxhdDE7XG4gIGlmIChNYXRoLmFicyh0aGlzLnBoaTEpIDwgRVBTMTApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgfVxuICBpZiAodGhpcy5lcykge1xuICAgIHRoaXMuZW4gPSBwal9lbmZuKHRoaXMuZXMpO1xuICAgIHRoaXMubTEgPSBwal9tbGZuKHRoaXMucGhpMSwgdGhpcy5hbTEgPSBNYXRoLnNpbih0aGlzLnBoaTEpLFxuICAgICAgYyA9IE1hdGguY29zKHRoaXMucGhpMSksIHRoaXMuZW4pO1xuICAgIHRoaXMuYW0xID0gYyAvIChNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiB0aGlzLmFtMSAqIHRoaXMuYW0xKSAqIHRoaXMuYW0xKTtcbiAgICB0aGlzLmludmVyc2UgPSBlX2ludjtcbiAgICB0aGlzLmZvcndhcmQgPSBlX2Z3ZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5waGkxKSArIEVQUzEwID49IEhBTEZfUEkpIHtcbiAgICAgIHRoaXMuY3BoaTEgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNwaGkxID0gMSAvIE1hdGgudGFuKHRoaXMucGhpMSk7XG4gICAgfVxuICAgIHRoaXMuaW52ZXJzZSA9IHNfaW52O1xuICAgIHRoaXMuZm9yd2FyZCA9IHNfZndkO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVfZndkKHApIHtcbiAgdmFyIGxhbSA9IGFkanVzdF9sb24ocC54IC0gKHRoaXMubG9uZzAgfHwgMCksIHRoaXMub3Zlcik7XG4gIHZhciBwaGkgPSBwLnk7XG4gIHZhciByaCwgRSwgYztcbiAgcmggPSB0aGlzLmFtMSArIHRoaXMubTEgLSBwal9tbGZuKHBoaSwgRSA9IE1hdGguc2luKHBoaSksIGMgPSBNYXRoLmNvcyhwaGkpLCB0aGlzLmVuKTtcbiAgRSA9IGMgKiBsYW0gLyAocmggKiBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBFICogRSkpO1xuICBwLnggPSByaCAqIE1hdGguc2luKEUpO1xuICBwLnkgPSB0aGlzLmFtMSAtIHJoICogTWF0aC5jb3MoRSk7XG5cbiAgcC54ID0gdGhpcy5hICogcC54ICsgKHRoaXMueDAgfHwgMCk7XG4gIHAueSA9IHRoaXMuYSAqIHAueSArICh0aGlzLnkwIHx8IDApO1xuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gZV9pbnYocCkge1xuICBwLnggPSAocC54IC0gKHRoaXMueDAgfHwgMCkpIC8gdGhpcy5hO1xuICBwLnkgPSAocC55IC0gKHRoaXMueTAgfHwgMCkpIC8gdGhpcy5hO1xuXG4gIHZhciBzLCByaCwgbGFtLCBwaGk7XG4gIHJoID0gaHlwb3QocC54LCBwLnkgPSB0aGlzLmFtMSAtIHAueSk7XG4gIHBoaSA9IHBqX2ludl9tbGZuKHRoaXMuYW0xICsgdGhpcy5tMSAtIHJoLCB0aGlzLmVzLCB0aGlzLmVuKTtcbiAgaWYgKChzID0gTWF0aC5hYnMocGhpKSkgPCBIQUxGX1BJKSB7XG4gICAgcyA9IE1hdGguc2luKHBoaSk7XG4gICAgbGFtID0gcmggKiBNYXRoLmF0YW4yKHAueCwgcC55KSAqIE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIHMgKiBzKSAvIE1hdGguY29zKHBoaSk7XG4gIH0gZWxzZSBpZiAoTWF0aC5hYnMocyAtIEhBTEZfUEkpIDw9IEVQUzEwKSB7XG4gICAgbGFtID0gMDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgfVxuICBwLnggPSBhZGp1c3RfbG9uKGxhbSArICh0aGlzLmxvbmcwIHx8IDApLCB0aGlzLm92ZXIpO1xuICBwLnkgPSBhZGp1c3RfbGF0KHBoaSk7XG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBzX2Z3ZChwKSB7XG4gIHZhciBsYW0gPSBhZGp1c3RfbG9uKHAueCAtICh0aGlzLmxvbmcwIHx8IDApLCB0aGlzLm92ZXIpO1xuICB2YXIgcGhpID0gcC55O1xuICB2YXIgRSwgcmg7XG4gIHJoID0gdGhpcy5jcGhpMSArIHRoaXMucGhpMSAtIHBoaTtcbiAgaWYgKE1hdGguYWJzKHJoKSA+IEVQUzEwKSB7XG4gICAgcC54ID0gcmggKiBNYXRoLnNpbihFID0gbGFtICogTWF0aC5jb3MocGhpKSAvIHJoKTtcbiAgICBwLnkgPSB0aGlzLmNwaGkxIC0gcmggKiBNYXRoLmNvcyhFKTtcbiAgfSBlbHNlIHtcbiAgICBwLnggPSBwLnkgPSAwO1xuICB9XG5cbiAgcC54ID0gdGhpcy5hICogcC54ICsgKHRoaXMueDAgfHwgMCk7XG4gIHAueSA9IHRoaXMuYSAqIHAueSArICh0aGlzLnkwIHx8IDApO1xuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gc19pbnYocCkge1xuICBwLnggPSAocC54IC0gKHRoaXMueDAgfHwgMCkpIC8gdGhpcy5hO1xuICBwLnkgPSAocC55IC0gKHRoaXMueTAgfHwgMCkpIC8gdGhpcy5hO1xuXG4gIHZhciBsYW0sIHBoaTtcbiAgdmFyIHJoID0gaHlwb3QocC54LCBwLnkgPSB0aGlzLmNwaGkxIC0gcC55KTtcbiAgcGhpID0gdGhpcy5jcGhpMSArIHRoaXMucGhpMSAtIHJoO1xuICBpZiAoTWF0aC5hYnMocGhpKSA+IEhBTEZfUEkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgfVxuICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMocGhpKSAtIEhBTEZfUEkpIDw9IEVQUzEwKSB7XG4gICAgbGFtID0gMDtcbiAgfSBlbHNlIHtcbiAgICBsYW0gPSByaCAqIE1hdGguYXRhbjIocC54LCBwLnkpIC8gTWF0aC5jb3MocGhpKTtcbiAgfVxuICBwLnggPSBhZGp1c3RfbG9uKGxhbSArICh0aGlzLmxvbmcwIHx8IDApLCB0aGlzLm92ZXIpO1xuICBwLnkgPSBhZGp1c3RfbGF0KHBoaSk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydib25uZScsICdCb25uZSAoV2VybmVyIGxhdF8xPTkwKSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgbWxmbiBmcm9tICcuLi9jb21tb24vbWxmbic7XG5pbXBvcnQgZTBmbiBmcm9tICcuLi9jb21tb24vZTBmbic7XG5pbXBvcnQgZTFmbiBmcm9tICcuLi9jb21tb24vZTFmbic7XG5pbXBvcnQgZTJmbiBmcm9tICcuLi9jb21tb24vZTJmbic7XG5pbXBvcnQgZTNmbiBmcm9tICcuLi9jb21tb24vZTNmbic7XG5pbXBvcnQgZ04gZnJvbSAnLi4vY29tbW9uL2dOJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhZGp1c3RfbGF0IGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbGF0JztcbmltcG9ydCBpbWxmbiBmcm9tICcuLi9jb21tb24vaW1sZm4nO1xuaW1wb3J0IHsgSEFMRl9QSSwgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGUwXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWwwXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBpZiAoIXRoaXMuc3BoZXJlKSB7XG4gICAgdGhpcy5lMCA9IGUwZm4odGhpcy5lcyk7XG4gICAgdGhpcy5lMSA9IGUxZm4odGhpcy5lcyk7XG4gICAgdGhpcy5lMiA9IGUyZm4odGhpcy5lcyk7XG4gICAgdGhpcy5lMyA9IGUzZm4odGhpcy5lcyk7XG4gICAgdGhpcy5tbDAgPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHRoaXMubGF0MCk7XG4gIH1cbn1cblxuLyogQ2Fzc2luaSBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHZhciB4LCB5O1xuICB2YXIgbGFtID0gcC54O1xuICB2YXIgcGhpID0gcC55O1xuICBsYW0gPSBhZGp1c3RfbG9uKGxhbSAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgeCA9IHRoaXMuYSAqIE1hdGguYXNpbihNYXRoLmNvcyhwaGkpICogTWF0aC5zaW4obGFtKSk7XG4gICAgeSA9IHRoaXMuYSAqIChNYXRoLmF0YW4yKE1hdGgudGFuKHBoaSksIE1hdGguY29zKGxhbSkpIC0gdGhpcy5sYXQwKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBlbGxpcHNvaWRcbiAgICB2YXIgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICB2YXIgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICB2YXIgbmwgPSBnTih0aGlzLmEsIHRoaXMuZSwgc2lucGhpKTtcbiAgICB2YXIgdGwgPSBNYXRoLnRhbihwaGkpICogTWF0aC50YW4ocGhpKTtcbiAgICB2YXIgYWwgPSBsYW0gKiBNYXRoLmNvcyhwaGkpO1xuICAgIHZhciBhc3EgPSBhbCAqIGFsO1xuICAgIHZhciBjbCA9IHRoaXMuZXMgKiBjb3NwaGkgKiBjb3NwaGkgLyAoMSAtIHRoaXMuZXMpO1xuICAgIHZhciBtbCA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgcGhpKTtcblxuICAgIHggPSBubCAqIGFsICogKDEgLSBhc3EgKiB0bCAqICgxIC8gNiAtICg4IC0gdGwgKyA4ICogY2wpICogYXNxIC8gMTIwKSk7XG4gICAgeSA9IG1sIC0gdGhpcy5tbDAgKyBubCAqIHNpbnBoaSAvIGNvc3BoaSAqIGFzcSAqICgwLjUgKyAoNSAtIHRsICsgNiAqIGNsKSAqIGFzcSAvIDI0KTtcbiAgfVxuXG4gIHAueCA9IHggKyB0aGlzLngwO1xuICBwLnkgPSB5ICsgdGhpcy55MDtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEludmVyc2UgZXF1YXRpb25zXG4gIC0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgdmFyIHggPSBwLnggLyB0aGlzLmE7XG4gIHZhciB5ID0gcC55IC8gdGhpcy5hO1xuICB2YXIgcGhpLCBsYW07XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgdmFyIGRkID0geSArIHRoaXMubGF0MDtcbiAgICBwaGkgPSBNYXRoLmFzaW4oTWF0aC5zaW4oZGQpICogTWF0aC5jb3MoeCkpO1xuICAgIGxhbSA9IE1hdGguYXRhbjIoTWF0aC50YW4oeCksIE1hdGguY29zKGRkKSk7XG4gIH0gZWxzZSB7XG4gICAgLyogZWxsaXBzb2lkICovXG4gICAgdmFyIG1sMSA9IHRoaXMubWwwIC8gdGhpcy5hICsgeTtcbiAgICB2YXIgcGhpMSA9IGltbGZuKG1sMSwgdGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMyk7XG4gICAgaWYgKE1hdGguYWJzKE1hdGguYWJzKHBoaTEpIC0gSEFMRl9QSSkgPD0gRVBTTE4pIHtcbiAgICAgIHAueCA9IHRoaXMubG9uZzA7XG4gICAgICBwLnkgPSBIQUxGX1BJO1xuICAgICAgaWYgKHkgPCAwKSB7XG4gICAgICAgIHAueSAqPSAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICB2YXIgbmwxID0gZ04odGhpcy5hLCB0aGlzLmUsIE1hdGguc2luKHBoaTEpKTtcblxuICAgIHZhciBybDEgPSBubDEgKiBubDEgKiBubDEgLyB0aGlzLmEgLyB0aGlzLmEgKiAoMSAtIHRoaXMuZXMpO1xuICAgIHZhciB0bDEgPSBNYXRoLnBvdyhNYXRoLnRhbihwaGkxKSwgMik7XG4gICAgdmFyIGRsID0geCAqIHRoaXMuYSAvIG5sMTtcbiAgICB2YXIgZHNxID0gZGwgKiBkbDtcbiAgICBwaGkgPSBwaGkxIC0gbmwxICogTWF0aC50YW4ocGhpMSkgLyBybDEgKiBkbCAqIGRsICogKDAuNSAtICgxICsgMyAqIHRsMSkgKiBkbCAqIGRsIC8gMjQpO1xuICAgIGxhbSA9IGRsICogKDEgLSBkc3EgKiAodGwxIC8gMyArICgxICsgMyAqIHRsMSkgKiB0bDEgKiBkc3EgLyAxNSkpIC8gTWF0aC5jb3MocGhpMSk7XG4gIH1cblxuICBwLnggPSBhZGp1c3RfbG9uKGxhbSArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHAueSA9IGFkanVzdF9sYXQocGhpKTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0Nhc3NpbmknLCAnQ2Fzc2luaV9Tb2xkbmVyJywgJ2Nhc3MnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHFzZm56IGZyb20gJy4uL2NvbW1vbi9xc2Zueic7XG5pbXBvcnQgbXNmbnogZnJvbSAnLi4vY29tbW9uL21zZm56JztcbmltcG9ydCBpcXNmbnogZnJvbSAnLi4vY29tbW9uL2lxc2Zueic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICovXG5cbi8qKlxuICByZWZlcmVuY2U6XG4gICAgXCJDYXJ0b2dyYXBoaWMgUHJvamVjdGlvbiBQcm9jZWR1cmVzIGZvciB0aGUgVU5JWCBFbnZpcm9ubWVudC1cbiAgICBBIFVzZXIncyBNYW51YWxcIiBieSBHZXJhbGQgSS4gRXZlbmRlbixcbiAgICBVU0dTIE9wZW4gRmlsZSBSZXBvcnQgOTAtMjg0YW5kIFJlbGVhc2UgNCBJbnRlcmltIFJlcG9ydHMgKDIwMDMpXG4gIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc31cbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gbm8tb3BcbiAgaWYgKCF0aGlzLnNwaGVyZSkge1xuICAgIHRoaXMuazAgPSBtc2Zueih0aGlzLmUsIE1hdGguc2luKHRoaXMubGF0X3RzKSwgTWF0aC5jb3ModGhpcy5sYXRfdHMpKTtcbiAgfVxufVxuXG4vKiBDeWxpbmRyaWNhbCBFcXVhbCBBcmVhIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgeCwgeTtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICB4ID0gdGhpcy54MCArIHRoaXMuYSAqIGRsb24gKiBNYXRoLmNvcyh0aGlzLmxhdF90cyk7XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBNYXRoLnNpbihsYXQpIC8gTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBxcyA9IHFzZm56KHRoaXMuZSwgTWF0aC5zaW4obGF0KSk7XG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiB0aGlzLmswICogZGxvbjtcbiAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIHFzICogMC41IC8gdGhpcy5rMDtcbiAgfVxuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG4vKiBDeWxpbmRyaWNhbCBFcXVhbCBBcmVhIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciBsb24sIGxhdDtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAocC54IC8gdGhpcy5hKSAvIE1hdGguY29zKHRoaXMubGF0X3RzKSwgdGhpcy5vdmVyKTtcbiAgICBsYXQgPSBNYXRoLmFzaW4oKHAueSAvIHRoaXMuYSkgKiBNYXRoLmNvcyh0aGlzLmxhdF90cykpO1xuICB9IGVsc2Uge1xuICAgIGxhdCA9IGlxc2Zueih0aGlzLmUsIDIgKiBwLnkgKiB0aGlzLmswIC8gdGhpcy5hKTtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBwLnggLyAodGhpcy5hICogdGhpcy5rMCksIHRoaXMub3Zlcik7XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ2NlYSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgfHwgMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcbiAgdGhpcy5sYXRfdHMgPSB0aGlzLmxhdF90cyB8fCAwO1xuICB0aGlzLnRpdGxlID0gdGhpcy50aXRsZSB8fCAnRXF1aWRpc3RhbnQgQ3lsaW5kcmljYWwgKFBsYXRlIENhcnJlKSc7XG5cbiAgdGhpcy5yYyA9IE1hdGguY29zKHRoaXMubGF0X3RzKTtcbn1cblxuLy8gZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgZGxhdCA9IGFkanVzdF9sYXQobGF0IC0gdGhpcy5sYXQwKTtcbiAgcC54ID0gdGhpcy54MCArICh0aGlzLmEgKiBkbG9uICogdGhpcy5yYyk7XG4gIHAueSA9IHRoaXMueTAgKyAodGhpcy5hICogZGxhdCk7XG4gIHJldHVybiBwO1xufVxuXG4vLyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciB4ID0gcC54O1xuICB2YXIgeSA9IHAueTtcblxuICBwLnggPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAoKHggLSB0aGlzLngwKSAvICh0aGlzLmEgKiB0aGlzLnJjKSksIHRoaXMub3Zlcik7XG4gIHAueSA9IGFkanVzdF9sYXQodGhpcy5sYXQwICsgKCh5IC0gdGhpcy55MCkgLyAodGhpcy5hKSkpO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnRXF1aXJlY3Rhbmd1bGFyJywgJ0VxdWlkaXN0YW50X0N5bGluZHJpY2FsJywgJ0VxdWlkaXN0YW50X0N5bGluZHJpY2FsX1NwaGVyaWNhbCcsICdlcWMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGUwZm4gZnJvbSAnLi4vY29tbW9uL2UwZm4nO1xuaW1wb3J0IGUxZm4gZnJvbSAnLi4vY29tbW9uL2UxZm4nO1xuaW1wb3J0IGUyZm4gZnJvbSAnLi4vY29tbW9uL2UyZm4nO1xuaW1wb3J0IGUzZm4gZnJvbSAnLi4vY29tbW9uL2UzZm4nO1xuaW1wb3J0IG1zZm56IGZyb20gJy4uL2NvbW1vbi9tc2Zueic7XG5pbXBvcnQgbWxmbiBmcm9tICcuLi9jb21tb24vbWxmbic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5pbXBvcnQgaW1sZm4gZnJvbSAnLi4vY29tbW9uL2ltbGZuJztcbmltcG9ydCB7IEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGVtcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUwXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUzXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luX3BoaVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc19waGlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtczFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtbDFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtczJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtbDJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBuc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGdcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtbDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByaFxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAvLyBTdGFuZGFyZCBQYXJhbGxlbHMgY2Fubm90IGJlIGVxdWFsIGFuZCBvbiBvcHBvc2l0ZSBzaWRlcyBvZiB0aGUgZXF1YXRvclxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxICsgdGhpcy5sYXQyKSA8IEVQU0xOKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMubGF0MiA9IHRoaXMubGF0MiB8fCB0aGlzLmxhdDE7XG4gIHRoaXMudGVtcCA9IHRoaXMuYiAvIHRoaXMuYTtcbiAgdGhpcy5lcyA9IDEgLSBNYXRoLnBvdyh0aGlzLnRlbXAsIDIpO1xuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG4gIHRoaXMuZTAgPSBlMGZuKHRoaXMuZXMpO1xuICB0aGlzLmUxID0gZTFmbih0aGlzLmVzKTtcbiAgdGhpcy5lMiA9IGUyZm4odGhpcy5lcyk7XG4gIHRoaXMuZTMgPSBlM2ZuKHRoaXMuZXMpO1xuXG4gIHRoaXMuc2luX3BoaSA9IE1hdGguc2luKHRoaXMubGF0MSk7XG4gIHRoaXMuY29zX3BoaSA9IE1hdGguY29zKHRoaXMubGF0MSk7XG5cbiAgdGhpcy5tczEgPSBtc2Zueih0aGlzLmUsIHRoaXMuc2luX3BoaSwgdGhpcy5jb3NfcGhpKTtcbiAgdGhpcy5tbDEgPSBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHRoaXMubGF0MSk7XG5cbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MSAtIHRoaXMubGF0MikgPCBFUFNMTikge1xuICAgIHRoaXMubnMgPSB0aGlzLnNpbl9waGk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zaW5fcGhpID0gTWF0aC5zaW4odGhpcy5sYXQyKTtcbiAgICB0aGlzLmNvc19waGkgPSBNYXRoLmNvcyh0aGlzLmxhdDIpO1xuICAgIHRoaXMubXMyID0gbXNmbnoodGhpcy5lLCB0aGlzLnNpbl9waGksIHRoaXMuY29zX3BoaSk7XG4gICAgdGhpcy5tbDIgPSBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHRoaXMubGF0Mik7XG4gICAgdGhpcy5ucyA9ICh0aGlzLm1zMSAtIHRoaXMubXMyKSAvICh0aGlzLm1sMiAtIHRoaXMubWwxKTtcbiAgfVxuICB0aGlzLmcgPSB0aGlzLm1sMSArIHRoaXMubXMxIC8gdGhpcy5ucztcbiAgdGhpcy5tbDAgPSBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHRoaXMubGF0MCk7XG4gIHRoaXMucmggPSB0aGlzLmEgKiAodGhpcy5nIC0gdGhpcy5tbDApO1xufVxuXG4vKiBFcXVpZGlzdGFudCBDb25pYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHJoMTtcblxuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgcmgxID0gdGhpcy5hICogKHRoaXMuZyAtIGxhdCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1sID0gbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCBsYXQpO1xuICAgIHJoMSA9IHRoaXMuYSAqICh0aGlzLmcgLSBtbCk7XG4gIH1cbiAgdmFyIHRoZXRhID0gdGhpcy5ucyAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIHggPSB0aGlzLngwICsgcmgxICogTWF0aC5zaW4odGhldGEpO1xuICB2YXIgeSA9IHRoaXMueTAgKyB0aGlzLnJoIC0gcmgxICogTWF0aC5jb3ModGhldGEpO1xuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSA9IHRoaXMucmggLSBwLnkgKyB0aGlzLnkwO1xuICB2YXIgY29uLCByaDEsIGxhdCwgbG9uO1xuICBpZiAodGhpcy5ucyA+PSAwKSB7XG4gICAgcmgxID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gMTtcbiAgfSBlbHNlIHtcbiAgICByaDEgPSAtTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gLTE7XG4gIH1cbiAgdmFyIHRoZXRhID0gMDtcbiAgaWYgKHJoMSAhPT0gMCkge1xuICAgIHRoZXRhID0gTWF0aC5hdGFuMihjb24gKiBwLngsIGNvbiAqIHAueSk7XG4gIH1cblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyB0aGV0YSAvIHRoaXMubnMsIHRoaXMub3Zlcik7XG4gICAgbGF0ID0gYWRqdXN0X2xhdCh0aGlzLmcgLSByaDEgLyB0aGlzLmEpO1xuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1sID0gdGhpcy5nIC0gcmgxIC8gdGhpcy5hO1xuICAgIGxhdCA9IGltbGZuKG1sLCB0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzKTtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyB0aGV0YSAvIHRoaXMubnMsIHRoaXMub3Zlcik7XG4gICAgcC54ID0gbG9uO1xuICAgIHAueSA9IGxhdDtcbiAgICByZXR1cm4gcDtcbiAgfVxufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydFcXVpZGlzdGFudF9Db25pYycsICdlcWRjJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTggQmVybmllIEplbm55LCBNb25hc2ggVW5pdmVyc2l0eSwgTWVsYm91cm5lLCBBdXN0cmFsaWEuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogRXF1YWwgRWFydGggaXMgYSBwcm9qZWN0aW9uIGluc3BpcmVkIGJ5IHRoZSBSb2JpbnNvbiBwcm9qZWN0aW9uLCBidXQgdW5saWtlXG4gKiB0aGUgUm9iaW5zb24gcHJvamVjdGlvbiByZXRhaW5zIHRoZSByZWxhdGl2ZSBzaXplIG9mIGFyZWFzLiBUaGUgcHJvamVjdGlvblxuICogd2FzIGRlc2lnbmVkIGluIDIwMTggYnkgQm9qYW4gU2F2cmljLCBUb20gUGF0dGVyc29uIGFuZCBCZXJuaGFyZCBKZW5ueS5cbiAqXG4gKiBQdWJsaWNhdGlvbjpcbiAqIEJvamFuIFNhdnJpYywgVG9tIFBhdHRlcnNvbiAmIEJlcm5oYXJkIEplbm55ICgyMDE4KS4gVGhlIEVxdWFsIEVhcnRoIG1hcFxuICogcHJvamVjdGlvbiwgSW50ZXJuYXRpb25hbCBKb3VybmFsIG9mIEdlb2dyYXBoaWNhbCBJbmZvcm1hdGlvbiBTY2llbmNlLFxuICogRE9JOiAxMC4xMDgwLzEzNjU4ODE2LjIwMTguMTUwNDk0OVxuICpcbiAqIENvZGUgcmVsZWFzZWQgQXVndXN0IDIwMThcbiAqIFBvcnRlZCB0byBKYXZhU2NyaXB0IGFuZCBhZGFwdGVkIGZvciBtYXBzaGFwZXItcHJvaiBieSBNYXR0aGV3IEJsb2NoIEF1Z3VzdCAyMDE4XG4gKiBNb2RpZmllZCBmb3IgcHJvajRqcyBieSBBbmRyZWFzIEhvY2V2YXIgYnkgQW5kcmVhcyBIb2NldmFyIE1hcmNoIDIwMjRcbiAqL1xuXG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbnZhciBBMSA9IDEuMzQwMjY0LFxuICBBMiA9IC0wLjA4MTEwNixcbiAgQTMgPSAwLjAwMDg5MyxcbiAgQTQgPSAwLjAwMzc5NixcbiAgTSA9IE1hdGguc3FydCgzKSAvIDIuMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMuZXMgPSAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sb25nMCA6IDA7XG4gIHRoaXMueDAgPSB0aGlzLngwICE9PSB1bmRlZmluZWQgPyB0aGlzLngwIDogMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgIT09IHVuZGVmaW5lZCA/IHRoaXMueTAgOiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsYW0gPSBhZGp1c3RfbG9uKHAueCAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciBwaGkgPSBwLnk7XG4gIHZhciBwYXJhbUxhdCA9IE1hdGguYXNpbihNICogTWF0aC5zaW4ocGhpKSksXG4gICAgcGFyYW1MYXRTcSA9IHBhcmFtTGF0ICogcGFyYW1MYXQsXG4gICAgcGFyYW1MYXRQb3c2ID0gcGFyYW1MYXRTcSAqIHBhcmFtTGF0U3EgKiBwYXJhbUxhdFNxO1xuICBwLnggPSBsYW0gKiBNYXRoLmNvcyhwYXJhbUxhdClcbiAgICAvIChNICogKEExICsgMyAqIEEyICogcGFyYW1MYXRTcSArIHBhcmFtTGF0UG93NiAqICg3ICogQTMgKyA5ICogQTQgKiBwYXJhbUxhdFNxKSkpO1xuICBwLnkgPSBwYXJhbUxhdCAqIChBMSArIEEyICogcGFyYW1MYXRTcSArIHBhcmFtTGF0UG93NiAqIChBMyArIEE0ICogcGFyYW1MYXRTcSkpO1xuXG4gIHAueCA9IHRoaXMuYSAqIHAueCArIHRoaXMueDA7XG4gIHAueSA9IHRoaXMuYSAqIHAueSArIHRoaXMueTA7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG4gIHZhciBFUFMgPSAxZS05LFxuICAgIE5JVEVSID0gMTIsXG4gICAgcGFyYW1MYXQgPSBwLnksXG4gICAgcGFyYW1MYXRTcSwgcGFyYW1MYXRQb3c2LCBmeSwgZnB5LCBkbGF0LCBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBOSVRFUjsgKytpKSB7XG4gICAgcGFyYW1MYXRTcSA9IHBhcmFtTGF0ICogcGFyYW1MYXQ7XG4gICAgcGFyYW1MYXRQb3c2ID0gcGFyYW1MYXRTcSAqIHBhcmFtTGF0U3EgKiBwYXJhbUxhdFNxO1xuICAgIGZ5ID0gcGFyYW1MYXQgKiAoQTEgKyBBMiAqIHBhcmFtTGF0U3EgKyBwYXJhbUxhdFBvdzYgKiAoQTMgKyBBNCAqIHBhcmFtTGF0U3EpKSAtIHAueTtcbiAgICBmcHkgPSBBMSArIDMgKiBBMiAqIHBhcmFtTGF0U3EgKyBwYXJhbUxhdFBvdzYgKiAoNyAqIEEzICsgOSAqIEE0ICogcGFyYW1MYXRTcSk7XG4gICAgcGFyYW1MYXQgLT0gZGxhdCA9IGZ5IC8gZnB5O1xuICAgIGlmIChNYXRoLmFicyhkbGF0KSA8IEVQUykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHBhcmFtTGF0U3EgPSBwYXJhbUxhdCAqIHBhcmFtTGF0O1xuICBwYXJhbUxhdFBvdzYgPSBwYXJhbUxhdFNxICogcGFyYW1MYXRTcSAqIHBhcmFtTGF0U3E7XG4gIHAueCA9IE0gKiBwLnggKiAoQTEgKyAzICogQTIgKiBwYXJhbUxhdFNxICsgcGFyYW1MYXRQb3c2ICogKDcgKiBBMyArIDkgKiBBNCAqIHBhcmFtTGF0U3EpKVxuICAgIC8gTWF0aC5jb3MocGFyYW1MYXQpO1xuICBwLnkgPSBNYXRoLmFzaW4oTWF0aC5zaW4ocGFyYW1MYXQpIC8gTSk7XG5cbiAgcC54ID0gYWRqdXN0X2xvbihwLnggKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnZXFlYXJ0aCcsICdFcXVhbCBFYXJ0aCcsICdFcXVhbF9FYXJ0aCddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvLyBIZWF2aWx5IGJhc2VkIG9uIHRoaXMgZXRtZXJjIHByb2plY3Rpb24gaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYmxvY2gvbWFwc2hhcGVyLXByb2ovYmxvYi9tYXN0ZXIvc3JjL3Byb2plY3Rpb25zL2V0bWVyYy5qc1xuXG5pbXBvcnQgdG1lcmMgZnJvbSAnLi4vcHJvamVjdGlvbnMvdG1lcmMnO1xuaW1wb3J0IHNpbmggZnJvbSAnLi4vY29tbW9uL3NpbmgnO1xuaW1wb3J0IGh5cG90IGZyb20gJy4uL2NvbW1vbi9oeXBvdCc7XG5pbXBvcnQgYXNpbmh5IGZyb20gJy4uL2NvbW1vbi9hc2luaHknO1xuaW1wb3J0IGdhdGcgZnJvbSAnLi4vY29tbW9uL2dhdGcnO1xuaW1wb3J0IGNsZW5zIGZyb20gJy4uL2NvbW1vbi9jbGVucyc7XG5pbXBvcnQgY2xlbnNfY21wbHggZnJvbSAnLi4vY29tbW9uL2NsZW5zX2NtcGx4JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBjYmdcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gY2diXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IHV0Z1xuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBndHVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBRblxuICogQHByb3BlcnR5IHtudW1iZXJ9IFpiXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBpZiAoIXRoaXMuYXBwcm94ICYmIChpc05hTih0aGlzLmVzKSB8fCB0aGlzLmVzIDw9IDApKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgZWxsaXB0aWNhbCB1c2FnZS4gVHJ5IHVzaW5nIHRoZSArYXBwcm94IG9wdGlvbiBpbiB0aGUgcHJvaiBzdHJpbmcsIG9yIFBST0pFQ1RJT05bXCJGYXN0X1RyYW5zdmVyc2VfTWVyY2F0b3JcIl0gaW4gdGhlIFdLVC4nKTtcbiAgfVxuICBpZiAodGhpcy5hcHByb3gpIHtcbiAgICAvLyBXaGVuICcrYXBwcm94JyBpcyBzZXQsIHVzZSB0bWVyYyBpbnN0ZWFkXG4gICAgdG1lcmMuaW5pdC5hcHBseSh0aGlzKTtcbiAgICB0aGlzLmZvcndhcmQgPSB0bWVyYy5mb3J3YXJkO1xuICAgIHRoaXMuaW52ZXJzZSA9IHRtZXJjLmludmVyc2U7XG4gIH1cblxuICB0aGlzLngwID0gdGhpcy54MCAhPT0gdW5kZWZpbmVkID8gdGhpcy54MCA6IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwICE9PSB1bmRlZmluZWQgPyB0aGlzLnkwIDogMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgIT09IHVuZGVmaW5lZCA/IHRoaXMubG9uZzAgOiAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgIT09IHVuZGVmaW5lZCA/IHRoaXMubGF0MCA6IDA7XG5cbiAgdGhpcy5jZ2IgPSBbXTtcbiAgdGhpcy5jYmcgPSBbXTtcbiAgdGhpcy51dGcgPSBbXTtcbiAgdGhpcy5ndHUgPSBbXTtcblxuICB2YXIgZiA9IHRoaXMuZXMgLyAoMSArIE1hdGguc3FydCgxIC0gdGhpcy5lcykpO1xuICB2YXIgbiA9IGYgLyAoMiAtIGYpO1xuICB2YXIgbnAgPSBuO1xuXG4gIHRoaXMuY2diWzBdID0gbiAqICgyICsgbiAqICgtMiAvIDMgKyBuICogKC0yICsgbiAqICgxMTYgLyA0NSArIG4gKiAoMjYgLyA0NSArIG4gKiAoLTI4NTQgLyA2NzUpKSkpKSk7XG4gIHRoaXMuY2JnWzBdID0gbiAqICgtMiArIG4gKiAoMiAvIDMgKyBuICogKDQgLyAzICsgbiAqICgtODIgLyA0NSArIG4gKiAoMzIgLyA0NSArIG4gKiAoNDY0MiAvIDQ3MjUpKSkpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMuY2diWzFdID0gbnAgKiAoNyAvIDMgKyBuICogKC04IC8gNSArIG4gKiAoLTIyNyAvIDQ1ICsgbiAqICgyNzA0IC8gMzE1ICsgbiAqICgyMzIzIC8gOTQ1KSkpKSk7XG4gIHRoaXMuY2JnWzFdID0gbnAgKiAoNSAvIDMgKyBuICogKC0xNiAvIDE1ICsgbiAqICgtMTMgLyA5ICsgbiAqICg5MDQgLyAzMTUgKyBuICogKC0xNTIyIC8gOTQ1KSkpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMuY2diWzJdID0gbnAgKiAoNTYgLyAxNSArIG4gKiAoLTEzNiAvIDM1ICsgbiAqICgtMTI2MiAvIDEwNSArIG4gKiAoNzM4MTQgLyAyODM1KSkpKTtcbiAgdGhpcy5jYmdbMl0gPSBucCAqICgtMjYgLyAxNSArIG4gKiAoMzQgLyAyMSArIG4gKiAoOCAvIDUgKyBuICogKC0xMjY4NiAvIDI4MzUpKSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLmNnYlszXSA9IG5wICogKDQyNzkgLyA2MzAgKyBuICogKC0zMzIgLyAzNSArIG4gKiAoLTM5OTU3MiAvIDE0MTc1KSkpO1xuICB0aGlzLmNiZ1szXSA9IG5wICogKDEyMzcgLyA2MzAgKyBuICogKC0xMiAvIDUgKyBuICogKC0yNDgzMiAvIDE0MTc1KSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLmNnYls0XSA9IG5wICogKDQxNzQgLyAzMTUgKyBuICogKC0xNDQ4MzggLyA2MjM3KSk7XG4gIHRoaXMuY2JnWzRdID0gbnAgKiAoLTczNCAvIDMxNSArIG4gKiAoMTA5NTk4IC8gMzExODUpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy5jZ2JbNV0gPSBucCAqICg2MDE2NzYgLyAyMjI3NSk7XG4gIHRoaXMuY2JnWzVdID0gbnAgKiAoNDQ0MzM3IC8gMTU1OTI1KTtcblxuICBucCA9IE1hdGgucG93KG4sIDIpO1xuICB0aGlzLlFuID0gdGhpcy5rMCAvICgxICsgbikgKiAoMSArIG5wICogKDEgLyA0ICsgbnAgKiAoMSAvIDY0ICsgbnAgLyAyNTYpKSk7XG5cbiAgdGhpcy51dGdbMF0gPSBuICogKC0wLjUgKyBuICogKDIgLyAzICsgbiAqICgtMzcgLyA5NiArIG4gKiAoMSAvIDM2MCArIG4gKiAoODEgLyA1MTIgKyBuICogKC05NjE5OSAvIDYwNDgwMCkpKSkpKTtcbiAgdGhpcy5ndHVbMF0gPSBuICogKDAuNSArIG4gKiAoLTIgLyAzICsgbiAqICg1IC8gMTYgKyBuICogKDQxIC8gMTgwICsgbiAqICgtMTI3IC8gMjg4ICsgbiAqICg3ODkxIC8gMzc4MDApKSkpKSk7XG5cbiAgdGhpcy51dGdbMV0gPSBucCAqICgtMSAvIDQ4ICsgbiAqICgtMSAvIDE1ICsgbiAqICg0MzcgLyAxNDQwICsgbiAqICgtNDYgLyAxMDUgKyBuICogKDExMTg3MTEgLyAzODcwNzIwKSkpKSk7XG4gIHRoaXMuZ3R1WzFdID0gbnAgKiAoMTMgLyA0OCArIG4gKiAoLTMgLyA1ICsgbiAqICg1NTcgLyAxNDQwICsgbiAqICgyODEgLyA2MzAgKyBuICogKC0xOTgzNDMzIC8gMTkzNTM2MCkpKSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLnV0Z1syXSA9IG5wICogKC0xNyAvIDQ4MCArIG4gKiAoMzcgLyA4NDAgKyBuICogKDIwOSAvIDQ0ODAgKyBuICogKC01NTY5IC8gOTA3MjApKSkpO1xuICB0aGlzLmd0dVsyXSA9IG5wICogKDYxIC8gMjQwICsgbiAqICgtMTAzIC8gMTQwICsgbiAqICgxNTA2MSAvIDI2ODgwICsgbiAqICgxNjc2MDMgLyAxODE0NDApKSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLnV0Z1szXSA9IG5wICogKC00Mzk3IC8gMTYxMjgwICsgbiAqICgxMSAvIDUwNCArIG4gKiAoODMwMjUxIC8gNzI1NzYwMCkpKTtcbiAgdGhpcy5ndHVbM10gPSBucCAqICg0OTU2MSAvIDE2MTI4MCArIG4gKiAoLTE3OSAvIDE2OCArIG4gKiAoNjYwMTY2MSAvIDcyNTc2MDApKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMudXRnWzRdID0gbnAgKiAoLTQ1ODMgLyAxNjEyODAgKyBuICogKDEwODg0NyAvIDM5OTE2ODApKTtcbiAgdGhpcy5ndHVbNF0gPSBucCAqICgzNDcyOSAvIDgwNjQwICsgbiAqICgtMzQxODg4OSAvIDE5OTU4NDApKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy51dGdbNV0gPSBucCAqICgtMjA2NDg2OTMgLyA2Mzg2Njg4MDApO1xuICB0aGlzLmd0dVs1XSA9IG5wICogKDIxMjM3ODk0MSAvIDMxOTMzNDQwMCk7XG5cbiAgdmFyIFogPSBnYXRnKHRoaXMuY2JnLCB0aGlzLmxhdDApO1xuICB0aGlzLlpiID0gLXRoaXMuUW4gKiAoWiArIGNsZW5zKHRoaXMuZ3R1LCAyICogWikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBDZSA9IGFkanVzdF9sb24ocC54IC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIENuID0gcC55O1xuXG4gIENuID0gZ2F0Zyh0aGlzLmNiZywgQ24pO1xuICB2YXIgc2luX0NuID0gTWF0aC5zaW4oQ24pO1xuICB2YXIgY29zX0NuID0gTWF0aC5jb3MoQ24pO1xuICB2YXIgc2luX0NlID0gTWF0aC5zaW4oQ2UpO1xuICB2YXIgY29zX0NlID0gTWF0aC5jb3MoQ2UpO1xuXG4gIENuID0gTWF0aC5hdGFuMihzaW5fQ24sIGNvc19DZSAqIGNvc19Dbik7XG4gIENlID0gTWF0aC5hdGFuMihzaW5fQ2UgKiBjb3NfQ24sIGh5cG90KHNpbl9DbiwgY29zX0NuICogY29zX0NlKSk7XG4gIENlID0gYXNpbmh5KE1hdGgudGFuKENlKSk7XG5cbiAgdmFyIHRtcCA9IGNsZW5zX2NtcGx4KHRoaXMuZ3R1LCAyICogQ24sIDIgKiBDZSk7XG5cbiAgQ24gPSBDbiArIHRtcFswXTtcbiAgQ2UgPSBDZSArIHRtcFsxXTtcblxuICB2YXIgeDtcbiAgdmFyIHk7XG5cbiAgaWYgKE1hdGguYWJzKENlKSA8PSAyLjYyMzM5NTE2Mjc3OCkge1xuICAgIHggPSB0aGlzLmEgKiAodGhpcy5RbiAqIENlKSArIHRoaXMueDA7XG4gICAgeSA9IHRoaXMuYSAqICh0aGlzLlFuICogQ24gKyB0aGlzLlpiKSArIHRoaXMueTA7XG4gIH0gZWxzZSB7XG4gICAgeCA9IEluZmluaXR5O1xuICAgIHkgPSBJbmZpbml0eTtcbiAgfVxuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG5cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIENlID0gKHAueCAtIHRoaXMueDApICogKDEgLyB0aGlzLmEpO1xuICB2YXIgQ24gPSAocC55IC0gdGhpcy55MCkgKiAoMSAvIHRoaXMuYSk7XG5cbiAgQ24gPSAoQ24gLSB0aGlzLlpiKSAvIHRoaXMuUW47XG4gIENlID0gQ2UgLyB0aGlzLlFuO1xuXG4gIHZhciBsb247XG4gIHZhciBsYXQ7XG5cbiAgaWYgKE1hdGguYWJzKENlKSA8PSAyLjYyMzM5NTE2Mjc3OCkge1xuICAgIHZhciB0bXAgPSBjbGVuc19jbXBseCh0aGlzLnV0ZywgMiAqIENuLCAyICogQ2UpO1xuXG4gICAgQ24gPSBDbiArIHRtcFswXTtcbiAgICBDZSA9IENlICsgdG1wWzFdO1xuICAgIENlID0gTWF0aC5hdGFuKHNpbmgoQ2UpKTtcblxuICAgIHZhciBzaW5fQ24gPSBNYXRoLnNpbihDbik7XG4gICAgdmFyIGNvc19DbiA9IE1hdGguY29zKENuKTtcbiAgICB2YXIgc2luX0NlID0gTWF0aC5zaW4oQ2UpO1xuICAgIHZhciBjb3NfQ2UgPSBNYXRoLmNvcyhDZSk7XG5cbiAgICBDbiA9IE1hdGguYXRhbjIoc2luX0NuICogY29zX0NlLCBoeXBvdChzaW5fQ2UsIGNvc19DZSAqIGNvc19DbikpO1xuICAgIENlID0gTWF0aC5hdGFuMihzaW5fQ2UsIGNvc19DZSAqIGNvc19Dbik7XG5cbiAgICBsb24gPSBhZGp1c3RfbG9uKENlICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgICBsYXQgPSBnYXRnKHRoaXMuY2diLCBDbik7XG4gIH0gZWxzZSB7XG4gICAgbG9uID0gSW5maW5pdHk7XG4gICAgbGF0ID0gSW5maW5pdHk7XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcblxuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnRXh0ZW5kZWRfVHJhbnN2ZXJzZV9NZXJjYXRvcicsICdFeHRlbmRlZCBUcmFuc3ZlcnNlIE1lcmNhdG9yJywgJ2V0bWVyYycsICdUcmFuc3ZlcnNlX01lcmNhdG9yJywgJ1RyYW5zdmVyc2UgTWVyY2F0b3InLCAnR2F1c3MgS3J1Z2VyJywgJ0dhdXNzX0tydWdlcicsICd0bWVyYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgc3JhdCBmcm9tICcuLi9jb21tb24vc3JhdCc7XG52YXIgTUFYX0lURVIgPSAyMDtcbmltcG9ydCB7IEhBTEZfUEksIEZPUlRQSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHJjXG4gKiBAcHJvcGVydHkge251bWJlcn0gQ1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHBoaWMwXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmF0ZXhwXG4gKiBAcHJvcGVydHkge251bWJlcn0gS1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHNwaGkgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB2YXIgY3BoaSA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIGNwaGkgKj0gY3BoaTtcbiAgdGhpcy5yYyA9IE1hdGguc3FydCgxIC0gdGhpcy5lcykgLyAoMSAtIHRoaXMuZXMgKiBzcGhpICogc3BoaSk7XG4gIHRoaXMuQyA9IE1hdGguc3FydCgxICsgdGhpcy5lcyAqIGNwaGkgKiBjcGhpIC8gKDEgLSB0aGlzLmVzKSk7XG4gIHRoaXMucGhpYzAgPSBNYXRoLmFzaW4oc3BoaSAvIHRoaXMuQyk7XG4gIHRoaXMucmF0ZXhwID0gMC41ICogdGhpcy5DICogdGhpcy5lO1xuICB0aGlzLksgPSBNYXRoLnRhbigwLjUgKiB0aGlzLnBoaWMwICsgRk9SVFBJKSAvIChNYXRoLnBvdyhNYXRoLnRhbigwLjUgKiB0aGlzLmxhdDAgKyBGT1JUUEkpLCB0aGlzLkMpICogc3JhdCh0aGlzLmUgKiBzcGhpLCB0aGlzLnJhdGV4cCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgcC55ID0gMiAqIE1hdGguYXRhbih0aGlzLksgKiBNYXRoLnBvdyhNYXRoLnRhbigwLjUgKiBsYXQgKyBGT1JUUEkpLCB0aGlzLkMpICogc3JhdCh0aGlzLmUgKiBNYXRoLnNpbihsYXQpLCB0aGlzLnJhdGV4cCkpIC0gSEFMRl9QSTtcbiAgcC54ID0gdGhpcy5DICogbG9uO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgREVMX1RPTCA9IDFlLTE0O1xuICB2YXIgbG9uID0gcC54IC8gdGhpcy5DO1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgbnVtID0gTWF0aC5wb3coTWF0aC50YW4oMC41ICogbGF0ICsgRk9SVFBJKSAvIHRoaXMuSywgMSAvIHRoaXMuQyk7XG4gIGZvciAodmFyIGkgPSBNQVhfSVRFUjsgaSA+IDA7IC0taSkge1xuICAgIGxhdCA9IDIgKiBNYXRoLmF0YW4obnVtICogc3JhdCh0aGlzLmUgKiBNYXRoLnNpbihwLnkpLCAtMC41ICogdGhpcy5lKSkgLSBIQUxGX1BJO1xuICAgIGlmIChNYXRoLmFicyhsYXQgLSBwLnkpIDwgREVMX1RPTCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHAueSA9IGxhdDtcbiAgfVxuICAvKiBjb252ZXJnZW5jZSBmYWlsZWQgKi9cbiAgaWYgKCFpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydnYXVzcyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQge1xuICBnZW9kZXRpY1RvR2VvY2VudHJpYyxcbiAgZ2VvY2VudHJpY1RvR2VvZGV0aWNcbn0gZnJvbSAnLi4vZGF0dW1VdGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLm5hbWUgPSAnZ2VvY2VudCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHBvaW50ID0gZ2VvZGV0aWNUb0dlb2NlbnRyaWMocCwgdGhpcy5lcywgdGhpcy5hKTtcbiAgcmV0dXJuIHBvaW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBwb2ludCA9IGdlb2NlbnRyaWNUb0dlb2RldGljKHAsIHRoaXMuZXMsIHRoaXMuYSwgdGhpcy5iKTtcbiAgcmV0dXJuIHBvaW50O1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydHZW9jZW50cmljJywgJ2dlb2NlbnRyaWMnLCAnZ2VvY2VudCcsICdHZW9jZW50J107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBoeXBvdCBmcm9tICcuLi9jb21tb24vaHlwb3QnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHsxIHwgMH0gZmxpcF9heGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gaFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1c19nXzFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByYWRpdXNfZ1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1c19wXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmFkaXVzX3AyXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmFkaXVzX3BfaW52MlxuICogQHByb3BlcnR5IHsnZWxsaXBzZSd8J3NwaGVyZSd9IHNoYXBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gQ1xuICogQHByb3BlcnR5IHtzdHJpbmd9IHN3ZWVwXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMuZmxpcF9heGlzID0gKHRoaXMuc3dlZXAgPT09ICd4JyA/IDEgOiAwKTtcbiAgdGhpcy5oID0gTnVtYmVyKHRoaXMuaCk7XG4gIHRoaXMucmFkaXVzX2dfMSA9IHRoaXMuaCAvIHRoaXMuYTtcblxuICBpZiAodGhpcy5yYWRpdXNfZ18xIDw9IDAgfHwgdGhpcy5yYWRpdXNfZ18xID4gMWUxMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigpO1xuICB9XG5cbiAgdGhpcy5yYWRpdXNfZyA9IDEuMCArIHRoaXMucmFkaXVzX2dfMTtcbiAgdGhpcy5DID0gdGhpcy5yYWRpdXNfZyAqIHRoaXMucmFkaXVzX2cgLSAxLjA7XG5cbiAgaWYgKHRoaXMuZXMgIT09IDAuMCkge1xuICAgIHZhciBvbmVfZXMgPSAxLjAgLSB0aGlzLmVzO1xuICAgIHZhciByb25lX2VzID0gMSAvIG9uZV9lcztcblxuICAgIHRoaXMucmFkaXVzX3AgPSBNYXRoLnNxcnQob25lX2VzKTtcbiAgICB0aGlzLnJhZGl1c19wMiA9IG9uZV9lcztcbiAgICB0aGlzLnJhZGl1c19wX2ludjIgPSByb25lX2VzO1xuXG4gICAgdGhpcy5zaGFwZSA9ICdlbGxpcHNlJzsgLy8gVXNlIGFzIGEgY29uZGl0aW9uIGluIHRoZSBmb3J3YXJkIGFuZCBpbnZlcnNlIGZ1bmN0aW9ucy5cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnJhZGl1c19wID0gMS4wO1xuICAgIHRoaXMucmFkaXVzX3AyID0gMS4wO1xuICAgIHRoaXMucmFkaXVzX3BfaW52MiA9IDEuMDtcblxuICAgIHRoaXMuc2hhcGUgPSAnc3BoZXJlJzsgLy8gVXNlIGFzIGEgY29uZGl0aW9uIGluIHRoZSBmb3J3YXJkIGFuZCBpbnZlcnNlIGZ1bmN0aW9ucy5cbiAgfVxuXG4gIGlmICghdGhpcy50aXRsZSkge1xuICAgIHRoaXMudGl0bGUgPSAnR2Vvc3RhdGlvbmFyeSBTYXRlbGxpdGUgVmlldyc7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciB0bXAsIHZfeCwgdl95LCB2X3o7XG4gIGxvbiA9IGxvbiAtIHRoaXMubG9uZzA7XG5cbiAgaWYgKHRoaXMuc2hhcGUgPT09ICdlbGxpcHNlJykge1xuICAgIGxhdCA9IE1hdGguYXRhbih0aGlzLnJhZGl1c19wMiAqIE1hdGgudGFuKGxhdCkpO1xuICAgIHZhciByID0gdGhpcy5yYWRpdXNfcCAvIGh5cG90KHRoaXMucmFkaXVzX3AgKiBNYXRoLmNvcyhsYXQpLCBNYXRoLnNpbihsYXQpKTtcblxuICAgIHZfeCA9IHIgKiBNYXRoLmNvcyhsb24pICogTWF0aC5jb3MobGF0KTtcbiAgICB2X3kgPSByICogTWF0aC5zaW4obG9uKSAqIE1hdGguY29zKGxhdCk7XG4gICAgdl96ID0gciAqIE1hdGguc2luKGxhdCk7XG5cbiAgICBpZiAoKCh0aGlzLnJhZGl1c19nIC0gdl94KSAqIHZfeCAtIHZfeSAqIHZfeSAtIHZfeiAqIHZfeiAqIHRoaXMucmFkaXVzX3BfaW52MikgPCAwLjApIHtcbiAgICAgIHAueCA9IE51bWJlci5OYU47XG4gICAgICBwLnkgPSBOdW1iZXIuTmFOO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgdG1wID0gdGhpcy5yYWRpdXNfZyAtIHZfeDtcbiAgICBpZiAodGhpcy5mbGlwX2F4aXMpIHtcbiAgICAgIHAueCA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3kgLyBoeXBvdCh2X3osIHRtcCkpO1xuICAgICAgcC55ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeiAvIHRtcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3kgLyB0bXApO1xuICAgICAgcC55ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeiAvIGh5cG90KHZfeSwgdG1wKSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHRoaXMuc2hhcGUgPT09ICdzcGhlcmUnKSB7XG4gICAgdG1wID0gTWF0aC5jb3MobGF0KTtcbiAgICB2X3ggPSBNYXRoLmNvcyhsb24pICogdG1wO1xuICAgIHZfeSA9IE1hdGguc2luKGxvbikgKiB0bXA7XG4gICAgdl96ID0gTWF0aC5zaW4obGF0KTtcbiAgICB0bXAgPSB0aGlzLnJhZGl1c19nIC0gdl94O1xuXG4gICAgaWYgKHRoaXMuZmxpcF9heGlzKSB7XG4gICAgICBwLnggPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl95IC8gaHlwb3Qodl96LCB0bXApKTtcbiAgICAgIHAueSA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3ogLyB0bXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnggPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl95IC8gdG1wKTtcbiAgICAgIHAueSA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3ogLyBoeXBvdCh2X3ksIHRtcCkpO1xuICAgIH1cbiAgfVxuICBwLnggPSBwLnggKiB0aGlzLmE7XG4gIHAueSA9IHAueSAqIHRoaXMuYTtcbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgdl94ID0gLTEuMDtcbiAgdmFyIHZfeSA9IDAuMDtcbiAgdmFyIHZfeiA9IDAuMDtcbiAgdmFyIGEsIGIsIGRldCwgaztcblxuICBwLnggPSBwLnggLyB0aGlzLmE7XG4gIHAueSA9IHAueSAvIHRoaXMuYTtcblxuICBpZiAodGhpcy5zaGFwZSA9PT0gJ2VsbGlwc2UnKSB7XG4gICAgaWYgKHRoaXMuZmxpcF9heGlzKSB7XG4gICAgICB2X3ogPSBNYXRoLnRhbihwLnkgLyB0aGlzLnJhZGl1c19nXzEpO1xuICAgICAgdl95ID0gTWF0aC50YW4ocC54IC8gdGhpcy5yYWRpdXNfZ18xKSAqIGh5cG90KDEuMCwgdl96KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdl95ID0gTWF0aC50YW4ocC54IC8gdGhpcy5yYWRpdXNfZ18xKTtcbiAgICAgIHZfeiA9IE1hdGgudGFuKHAueSAvIHRoaXMucmFkaXVzX2dfMSkgKiBoeXBvdCgxLjAsIHZfeSk7XG4gICAgfVxuXG4gICAgdmFyIHZfenAgPSB2X3ogLyB0aGlzLnJhZGl1c19wO1xuICAgIGEgPSB2X3kgKiB2X3kgKyB2X3pwICogdl96cCArIHZfeCAqIHZfeDtcbiAgICBiID0gMiAqIHRoaXMucmFkaXVzX2cgKiB2X3g7XG4gICAgZGV0ID0gKGIgKiBiKSAtIDQgKiBhICogdGhpcy5DO1xuXG4gICAgaWYgKGRldCA8IDAuMCkge1xuICAgICAgcC54ID0gTnVtYmVyLk5hTjtcbiAgICAgIHAueSA9IE51bWJlci5OYU47XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBrID0gKC1iIC0gTWF0aC5zcXJ0KGRldCkpIC8gKDIuMCAqIGEpO1xuICAgIHZfeCA9IHRoaXMucmFkaXVzX2cgKyBrICogdl94O1xuICAgIHZfeSAqPSBrO1xuICAgIHZfeiAqPSBrO1xuXG4gICAgcC54ID0gTWF0aC5hdGFuMih2X3ksIHZfeCk7XG4gICAgcC55ID0gTWF0aC5hdGFuKHZfeiAqIE1hdGguY29zKHAueCkgLyB2X3gpO1xuICAgIHAueSA9IE1hdGguYXRhbih0aGlzLnJhZGl1c19wX2ludjIgKiBNYXRoLnRhbihwLnkpKTtcbiAgfSBlbHNlIGlmICh0aGlzLnNoYXBlID09PSAnc3BoZXJlJykge1xuICAgIGlmICh0aGlzLmZsaXBfYXhpcykge1xuICAgICAgdl96ID0gTWF0aC50YW4ocC55IC8gdGhpcy5yYWRpdXNfZ18xKTtcbiAgICAgIHZfeSA9IE1hdGgudGFuKHAueCAvIHRoaXMucmFkaXVzX2dfMSkgKiBNYXRoLnNxcnQoMS4wICsgdl96ICogdl96KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdl95ID0gTWF0aC50YW4ocC54IC8gdGhpcy5yYWRpdXNfZ18xKTtcbiAgICAgIHZfeiA9IE1hdGgudGFuKHAueSAvIHRoaXMucmFkaXVzX2dfMSkgKiBNYXRoLnNxcnQoMS4wICsgdl95ICogdl95KTtcbiAgICB9XG5cbiAgICBhID0gdl95ICogdl95ICsgdl96ICogdl96ICsgdl94ICogdl94O1xuICAgIGIgPSAyICogdGhpcy5yYWRpdXNfZyAqIHZfeDtcbiAgICBkZXQgPSAoYiAqIGIpIC0gNCAqIGEgKiB0aGlzLkM7XG4gICAgaWYgKGRldCA8IDAuMCkge1xuICAgICAgcC54ID0gTnVtYmVyLk5hTjtcbiAgICAgIHAueSA9IE51bWJlci5OYU47XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBrID0gKC1iIC0gTWF0aC5zcXJ0KGRldCkpIC8gKDIuMCAqIGEpO1xuICAgIHZfeCA9IHRoaXMucmFkaXVzX2cgKyBrICogdl94O1xuICAgIHZfeSAqPSBrO1xuICAgIHZfeiAqPSBrO1xuXG4gICAgcC54ID0gTWF0aC5hdGFuMih2X3ksIHZfeCk7XG4gICAgcC55ID0gTWF0aC5hdGFuKHZfeiAqIE1hdGguY29zKHAueCkgLyB2X3gpO1xuICB9XG4gIHAueCA9IHAueCArIHRoaXMubG9uZzA7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydHZW9zdGF0aW9uYXJ5IFNhdGVsbGl0ZSBWaWV3JywgJ0dlb3N0YXRpb25hcnlfU2F0ZWxsaXRlJywgJ2dlb3MnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFzaW56IGZyb20gJy4uL2NvbW1vbi9hc2lueic7XG5pbXBvcnQgeyBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbl9wMTRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NfcDE0XG4gKiBAcHJvcGVydHkge251bWJlcn0gaW5maW5pdHlfZGlzdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJjXG4gKi9cblxuLyoqXG4gIHJlZmVyZW5jZTpcbiAgICBXb2xmcmFtIE1hdGh3b3JsZCBcIkdub21vbmljIFByb2plY3Rpb25cIlxuICAgIGh0dHA6Ly9tYXRod29ybGQud29sZnJhbS5jb20vR25vbW9uaWNQcm9qZWN0aW9uLmh0bWxcbiAgICBBY2Nlc3NlZDogMTJ0aCBOb3ZlbWJlciAyMDA5XG4gICBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHRoaXMuc2luX3AxNCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gIHRoaXMuY29zX3AxNCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIC8vIEFwcHJveGltYXRpb24gZm9yIHByb2plY3RpbmcgcG9pbnRzIHRvIHRoZSBob3Jpem9uIChpbmZpbml0eSlcbiAgdGhpcy5pbmZpbml0eV9kaXN0ID0gMTAwMCAqIHRoaXMuYTtcbiAgdGhpcy5yYyA9IDE7XG59XG5cbi8qIEdub21vbmljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgc2lucGhpLCBjb3NwaGk7IC8qIHNpbiBhbmQgY29zIHZhbHVlICAgICAgICAqL1xuICB2YXIgZGxvbjsgLyogZGVsdGEgbG9uZ2l0dWRlIHZhbHVlICAgICAgKi9cbiAgdmFyIGNvc2xvbjsgLyogY29zIG9mIGxvbmdpdHVkZSAgICAgICAgKi9cbiAgdmFyIGtzcDsgLyogc2NhbGUgZmFjdG9yICAgICAgICAgICovXG4gIHZhciBnO1xuICB2YXIgeCwgeTtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG5cbiAgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcbiAgY29zcGhpID0gTWF0aC5jb3MobGF0KTtcblxuICBjb3Nsb24gPSBNYXRoLmNvcyhkbG9uKTtcbiAgZyA9IHRoaXMuc2luX3AxNCAqIHNpbnBoaSArIHRoaXMuY29zX3AxNCAqIGNvc3BoaSAqIGNvc2xvbjtcbiAga3NwID0gMTtcbiAgaWYgKChnID4gMCkgfHwgKE1hdGguYWJzKGcpIDw9IEVQU0xOKSkge1xuICAgIHggPSB0aGlzLngwICsgdGhpcy5hICoga3NwICogY29zcGhpICogTWF0aC5zaW4oZGxvbikgLyBnO1xuICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICoga3NwICogKHRoaXMuY29zX3AxNCAqIHNpbnBoaSAtIHRoaXMuc2luX3AxNCAqIGNvc3BoaSAqIGNvc2xvbikgLyBnO1xuICB9IGVsc2Uge1xuICAgIC8vIFBvaW50IGlzIGluIHRoZSBvcHBvc2luZyBoZW1pc3BoZXJlIGFuZCBpcyB1bnByb2plY3RhYmxlXG4gICAgLy8gV2Ugc3RpbGwgbmVlZCB0byByZXR1cm4gYSByZWFzb25hYmxlIHBvaW50LCBzbyB3ZSBwcm9qZWN0XG4gICAgLy8gdG8gaW5maW5pdHksIG9uIGEgYmVhcmluZ1xuICAgIC8vIGVxdWl2YWxlbnQgdG8gdGhlIG5vcnRoZXJuIGhlbWlzcGhlcmUgZXF1aXZhbGVudFxuICAgIC8vIFRoaXMgaXMgYSByZWFzb25hYmxlIGFwcHJveGltYXRpb24gZm9yIHNob3J0IHNoYXBlcyBhbmQgbGluZXMgdGhhdFxuICAgIC8vIHN0cmFkZGxlIHRoZSBob3Jpem9uLlxuXG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLmluZmluaXR5X2Rpc3QgKiBjb3NwaGkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICB5ID0gdGhpcy55MCArIHRoaXMuaW5maW5pdHlfZGlzdCAqICh0aGlzLmNvc19wMTQgKiBzaW5waGkgLSB0aGlzLnNpbl9wMTQgKiBjb3NwaGkgKiBjb3Nsb24pO1xuICB9XG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciByaDsgLyogUmhvICovXG4gIHZhciBzaW5jLCBjb3NjO1xuICB2YXIgYztcbiAgdmFyIGxvbiwgbGF0O1xuXG4gIC8qIEludmVyc2UgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBwLnggPSAocC54IC0gdGhpcy54MCkgLyB0aGlzLmE7XG4gIHAueSA9IChwLnkgLSB0aGlzLnkwKSAvIHRoaXMuYTtcblxuICBwLnggLz0gdGhpcy5rMDtcbiAgcC55IC89IHRoaXMuazA7XG5cbiAgaWYgKChyaCA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpKSkge1xuICAgIGMgPSBNYXRoLmF0YW4yKHJoLCB0aGlzLnJjKTtcbiAgICBzaW5jID0gTWF0aC5zaW4oYyk7XG4gICAgY29zYyA9IE1hdGguY29zKGMpO1xuXG4gICAgbGF0ID0gYXNpbnooY29zYyAqIHRoaXMuc2luX3AxNCArIChwLnkgKiBzaW5jICogdGhpcy5jb3NfcDE0KSAvIHJoKTtcbiAgICBsb24gPSBNYXRoLmF0YW4yKHAueCAqIHNpbmMsIHJoICogdGhpcy5jb3NfcDE0ICogY29zYyAtIHAueSAqIHRoaXMuc2luX3AxNCAqIHNpbmMpO1xuICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIGxvbiwgdGhpcy5vdmVyKTtcbiAgfSBlbHNlIHtcbiAgICBsYXQgPSB0aGlzLnBoaWMwO1xuICAgIGxvbiA9IDA7XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ2dub20nXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy5hID0gNjM3NzM5Ny4xNTU7XG4gIHRoaXMuZXMgPSAwLjAwNjY3NDM3MjIzMDYxNDtcbiAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuICBpZiAoIXRoaXMubGF0MCkge1xuICAgIHRoaXMubGF0MCA9IDAuODYzOTM3OTc5NzM3MTkzO1xuICB9XG4gIGlmICghdGhpcy5sb25nMCkge1xuICAgIHRoaXMubG9uZzAgPSAwLjc0MTc2NDkzMjA5NzU5MDEgLSAwLjMwODM0MTUwMTE4NTY2NTtcbiAgfVxuICAvKiBpZiBzY2FsZSBub3Qgc2V0IGRlZmF1bHQgdG8gMC45OTk5ICovXG4gIGlmICghdGhpcy5rMCkge1xuICAgIHRoaXMuazAgPSAwLjk5OTk7XG4gIH1cbiAgdGhpcy5zNDUgPSAwLjc4NTM5ODE2MzM5NzQ0ODsgLyogNDUgKi9cbiAgdGhpcy5zOTAgPSAyICogdGhpcy5zNDU7XG4gIHRoaXMuZmkwID0gdGhpcy5sYXQwO1xuICB0aGlzLmUyID0gdGhpcy5lcztcbiAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZTIpO1xuICB0aGlzLmFsZmEgPSBNYXRoLnNxcnQoMSArICh0aGlzLmUyICogTWF0aC5wb3coTWF0aC5jb3ModGhpcy5maTApLCA0KSkgLyAoMSAtIHRoaXMuZTIpKTtcbiAgdGhpcy51cSA9IDEuMDQyMTY4NTYzODA0NzQ7XG4gIHRoaXMudTAgPSBNYXRoLmFzaW4oTWF0aC5zaW4odGhpcy5maTApIC8gdGhpcy5hbGZhKTtcbiAgdGhpcy5nID0gTWF0aC5wb3coKDEgKyB0aGlzLmUgKiBNYXRoLnNpbih0aGlzLmZpMCkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbih0aGlzLmZpMCkpLCB0aGlzLmFsZmEgKiB0aGlzLmUgLyAyKTtcbiAgdGhpcy5rID0gTWF0aC50YW4odGhpcy51MCAvIDIgKyB0aGlzLnM0NSkgLyBNYXRoLnBvdyhNYXRoLnRhbih0aGlzLmZpMCAvIDIgKyB0aGlzLnM0NSksIHRoaXMuYWxmYSkgKiB0aGlzLmc7XG4gIHRoaXMuazEgPSB0aGlzLmswO1xuICB0aGlzLm4wID0gdGhpcy5hICogTWF0aC5zcXJ0KDEgLSB0aGlzLmUyKSAvICgxIC0gdGhpcy5lMiAqIE1hdGgucG93KE1hdGguc2luKHRoaXMuZmkwKSwgMikpO1xuICB0aGlzLnMwID0gMS4zNzAwODM0NjI4MTU1NTtcbiAgdGhpcy5uID0gTWF0aC5zaW4odGhpcy5zMCk7XG4gIHRoaXMucm8wID0gdGhpcy5rMSAqIHRoaXMubjAgLyBNYXRoLnRhbih0aGlzLnMwKTtcbiAgdGhpcy5hZCA9IHRoaXMuczkwIC0gdGhpcy51cTtcbn1cblxuLyogZWxsaXBzb2lkICovXG4vKiBjYWxjdWxhdGUgeHkgZnJvbSBsYXQvbG9uICovXG4vKiBDb25zdGFudHMsIGlkZW50aWNhbCB0byBpbnZlcnNlIHRyYW5zZm9ybSBmdW5jdGlvbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgZ2ZpLCB1LCBkZWx0YXYsIHMsIGQsIGVwcywgcm87XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciBkZWx0YV9sb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIC8qIFRyYW5zZm9ybWF0aW9uICovXG4gIGdmaSA9IE1hdGgucG93KCgoMSArIHRoaXMuZSAqIE1hdGguc2luKGxhdCkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbihsYXQpKSksICh0aGlzLmFsZmEgKiB0aGlzLmUgLyAyKSk7XG4gIHUgPSAyICogKE1hdGguYXRhbih0aGlzLmsgKiBNYXRoLnBvdyhNYXRoLnRhbihsYXQgLyAyICsgdGhpcy5zNDUpLCB0aGlzLmFsZmEpIC8gZ2ZpKSAtIHRoaXMuczQ1KTtcbiAgZGVsdGF2ID0gLWRlbHRhX2xvbiAqIHRoaXMuYWxmYTtcbiAgcyA9IE1hdGguYXNpbihNYXRoLmNvcyh0aGlzLmFkKSAqIE1hdGguc2luKHUpICsgTWF0aC5zaW4odGhpcy5hZCkgKiBNYXRoLmNvcyh1KSAqIE1hdGguY29zKGRlbHRhdikpO1xuICBkID0gTWF0aC5hc2luKE1hdGguY29zKHUpICogTWF0aC5zaW4oZGVsdGF2KSAvIE1hdGguY29zKHMpKTtcbiAgZXBzID0gdGhpcy5uICogZDtcbiAgcm8gPSB0aGlzLnJvMCAqIE1hdGgucG93KE1hdGgudGFuKHRoaXMuczAgLyAyICsgdGhpcy5zNDUpLCB0aGlzLm4pIC8gTWF0aC5wb3coTWF0aC50YW4ocyAvIDIgKyB0aGlzLnM0NSksIHRoaXMubik7XG4gIHAueSA9IHJvICogTWF0aC5jb3MoZXBzKSAvIDE7XG4gIHAueCA9IHJvICogTWF0aC5zaW4oZXBzKSAvIDE7XG5cbiAgaWYgKCF0aGlzLmN6ZWNoKSB7XG4gICAgcC55ICo9IC0xO1xuICAgIHAueCAqPSAtMTtcbiAgfVxuICByZXR1cm4gKHApO1xufVxuXG4vKiBjYWxjdWxhdGUgbGF0L2xvbiBmcm9tIHh5ICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciB1LCBkZWx0YXYsIHMsIGQsIGVwcywgcm8sIGZpMTtcbiAgdmFyIG9rO1xuXG4gIC8qIFRyYW5zZm9ybWF0aW9uICovXG4gIC8qIHJldmVydCB5LCB4ICovXG4gIHZhciB0bXAgPSBwLng7XG4gIHAueCA9IHAueTtcbiAgcC55ID0gdG1wO1xuICBpZiAoIXRoaXMuY3plY2gpIHtcbiAgICBwLnkgKj0gLTE7XG4gICAgcC54ICo9IC0xO1xuICB9XG4gIHJvID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gIGVwcyA9IE1hdGguYXRhbjIocC55LCBwLngpO1xuICBkID0gZXBzIC8gTWF0aC5zaW4odGhpcy5zMCk7XG4gIHMgPSAyICogKE1hdGguYXRhbihNYXRoLnBvdyh0aGlzLnJvMCAvIHJvLCAxIC8gdGhpcy5uKSAqIE1hdGgudGFuKHRoaXMuczAgLyAyICsgdGhpcy5zNDUpKSAtIHRoaXMuczQ1KTtcbiAgdSA9IE1hdGguYXNpbihNYXRoLmNvcyh0aGlzLmFkKSAqIE1hdGguc2luKHMpIC0gTWF0aC5zaW4odGhpcy5hZCkgKiBNYXRoLmNvcyhzKSAqIE1hdGguY29zKGQpKTtcbiAgZGVsdGF2ID0gTWF0aC5hc2luKE1hdGguY29zKHMpICogTWF0aC5zaW4oZCkgLyBNYXRoLmNvcyh1KSk7XG4gIHAueCA9IHRoaXMubG9uZzAgLSBkZWx0YXYgLyB0aGlzLmFsZmE7XG4gIGZpMSA9IHU7XG4gIG9rID0gMDtcbiAgdmFyIGl0ZXIgPSAwO1xuICBkbyB7XG4gICAgcC55ID0gMiAqIChNYXRoLmF0YW4oTWF0aC5wb3codGhpcy5rLCAtMSAvIHRoaXMuYWxmYSkgKiBNYXRoLnBvdyhNYXRoLnRhbih1IC8gMiArIHRoaXMuczQ1KSwgMSAvIHRoaXMuYWxmYSkgKiBNYXRoLnBvdygoMSArIHRoaXMuZSAqIE1hdGguc2luKGZpMSkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbihmaTEpKSwgdGhpcy5lIC8gMikpIC0gdGhpcy5zNDUpO1xuICAgIGlmIChNYXRoLmFicyhmaTEgLSBwLnkpIDwgMC4wMDAwMDAwMDAxKSB7XG4gICAgICBvayA9IDE7XG4gICAgfVxuICAgIGZpMSA9IHAueTtcbiAgICBpdGVyICs9IDE7XG4gIH0gd2hpbGUgKG9rID09PSAwICYmIGl0ZXIgPCAxNSk7XG4gIGlmIChpdGVyID49IDE1KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKHApO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydLcm92YWsnLCAna3JvdmFrJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB7IEhBTEZfUEksIEVQU0xOLCBGT1JUUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuaW1wb3J0IHFzZm56IGZyb20gJy4uL2NvbW1vbi9xc2Zueic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbW9kZVxuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBhcGFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG1tZlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJxXG4gKiBAcHJvcGVydHkge251bWJlcn0gcXBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5iMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc2IxXG4gKiBAcHJvcGVydHkge251bWJlcn0geW1mXG4gKiBAcHJvcGVydHkge251bWJlcn0geG1mXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2lucGgwXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zcGgwXG4gKi9cblxuLypcbiAgcmVmZXJlbmNlXG4gICAgXCJOZXcgRXF1YWwtQXJlYSBNYXAgUHJvamVjdGlvbnMgZm9yIE5vbmNpcmN1bGFyIFJlZ2lvbnNcIiwgSm9obiBQLiBTbnlkZXIsXG4gICAgVGhlIEFtZXJpY2FuIENhcnRvZ3JhcGhlciwgVm9sIDE1LCBOby4gNCwgT2N0b2JlciAxOTg4LCBwcC4gMzQxLTM1NS5cbiAgKi9cblxuZXhwb3J0IHZhciBTX1BPTEUgPSAxO1xuZXhwb3J0IHZhciBOX1BPTEUgPSAyO1xuZXhwb3J0IHZhciBFUVVJVCA9IDM7XG5leHBvcnQgdmFyIE9CTElRID0gNDtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBMYW1iZXJ0IEF6aW11dGhhbCBFcXVhbCBBcmVhIHByb2plY3Rpb25cbiAqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciB0ID0gTWF0aC5hYnModGhpcy5sYXQwKTtcbiAgaWYgKE1hdGguYWJzKHQgLSBIQUxGX1BJKSA8IEVQU0xOKSB7XG4gICAgdGhpcy5tb2RlID0gdGhpcy5sYXQwIDwgMCA/IFNfUE9MRSA6IE5fUE9MRTtcbiAgfSBlbHNlIGlmIChNYXRoLmFicyh0KSA8IEVQU0xOKSB7XG4gICAgdGhpcy5tb2RlID0gRVFVSVQ7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tb2RlID0gT0JMSVE7XG4gIH1cbiAgaWYgKHRoaXMuZXMgPiAwKSB7XG4gICAgdmFyIHNpbnBoaTtcblxuICAgIHRoaXMucXAgPSBxc2Zueih0aGlzLmUsIDEpO1xuICAgIHRoaXMubW1mID0gMC41IC8gKDEgLSB0aGlzLmVzKTtcbiAgICB0aGlzLmFwYSA9IGF1dGhzZXQodGhpcy5lcyk7XG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgTl9QT0xFOlxuICAgICAgICB0aGlzLmRkID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNfUE9MRTpcbiAgICAgICAgdGhpcy5kZCA9IDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFUVVJVDpcbiAgICAgICAgdGhpcy5ycSA9IE1hdGguc3FydCgwLjUgKiB0aGlzLnFwKTtcbiAgICAgICAgdGhpcy5kZCA9IDEgLyB0aGlzLnJxO1xuICAgICAgICB0aGlzLnhtZiA9IDE7XG4gICAgICAgIHRoaXMueW1mID0gMC41ICogdGhpcy5xcDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE9CTElROlxuICAgICAgICB0aGlzLnJxID0gTWF0aC5zcXJ0KDAuNSAqIHRoaXMucXApO1xuICAgICAgICBzaW5waGkgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICAgICAgICB0aGlzLnNpbmIxID0gcXNmbnoodGhpcy5lLCBzaW5waGkpIC8gdGhpcy5xcDtcbiAgICAgICAgdGhpcy5jb3NiMSA9IE1hdGguc3FydCgxIC0gdGhpcy5zaW5iMSAqIHRoaXMuc2luYjEpO1xuICAgICAgICB0aGlzLmRkID0gTWF0aC5jb3ModGhpcy5sYXQwKSAvIChNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBzaW5waGkgKiBzaW5waGkpICogdGhpcy5ycSAqIHRoaXMuY29zYjEpO1xuICAgICAgICB0aGlzLnltZiA9ICh0aGlzLnhtZiA9IHRoaXMucnEpIC8gdGhpcy5kZDtcbiAgICAgICAgdGhpcy54bWYgKj0gdGhpcy5kZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICh0aGlzLm1vZGUgPT09IE9CTElRKSB7XG4gICAgICB0aGlzLnNpbnBoMCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gICAgICB0aGlzLmNvc3BoMCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gICAgfVxuICB9XG59XG5cbi8qIExhbWJlcnQgQXppbXV0aGFsIEVxdWFsIEFyZWEgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB2YXIgeCwgeSwgY29zbGFtLCBzaW5sYW0sIHNpbnBoaSwgcSwgc2luYiwgY29zYiwgYiwgY29zcGhpO1xuICB2YXIgbGFtID0gcC54O1xuICB2YXIgcGhpID0gcC55O1xuXG4gIGxhbSA9IGFkanVzdF9sb24obGFtIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIGNvc2xhbSA9IE1hdGguY29zKGxhbSk7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSB8fCB0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQpIHtcbiAgICAgIHkgPSAodGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSA/IDEgKyBjb3NwaGkgKiBjb3NsYW0gOiAxICsgdGhpcy5zaW5waDAgKiBzaW5waGkgKyB0aGlzLmNvc3BoMCAqIGNvc3BoaSAqIGNvc2xhbTtcbiAgICAgIGlmICh5IDw9IEVQU0xOKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgeSA9IE1hdGguc3FydCgyIC8geSk7XG4gICAgICB4ID0geSAqIGNvc3BoaSAqIE1hdGguc2luKGxhbSk7XG4gICAgICB5ICo9ICh0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQpID8gc2lucGhpIDogdGhpcy5jb3NwaDAgKiBzaW5waGkgLSB0aGlzLnNpbnBoMCAqIGNvc3BoaSAqIGNvc2xhbTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUgfHwgdGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkge1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUpIHtcbiAgICAgICAgY29zbGFtID0gLWNvc2xhbTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLmFicyhwaGkgKyB0aGlzLmxhdDApIDwgRVBTTE4pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB5ID0gRk9SVFBJIC0gcGhpICogMC41O1xuICAgICAgeSA9IDIgKiAoKHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpID8gTWF0aC5jb3MoeSkgOiBNYXRoLnNpbih5KSk7XG4gICAgICB4ID0geSAqIE1hdGguc2luKGxhbSk7XG4gICAgICB5ICo9IGNvc2xhbTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2luYiA9IDA7XG4gICAgY29zYiA9IDA7XG4gICAgYiA9IDA7XG4gICAgY29zbGFtID0gTWF0aC5jb3MobGFtKTtcbiAgICBzaW5sYW0gPSBNYXRoLnNpbihsYW0pO1xuICAgIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgcSA9IHFzZm56KHRoaXMuZSwgc2lucGhpKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuICAgICAgc2luYiA9IHEgLyB0aGlzLnFwO1xuICAgICAgY29zYiA9IE1hdGguc3FydCgxIC0gc2luYiAqIHNpbmIpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSB0aGlzLk9CTElROlxuICAgICAgICBiID0gMSArIHRoaXMuc2luYjEgKiBzaW5iICsgdGhpcy5jb3NiMSAqIGNvc2IgKiBjb3NsYW07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLkVRVUlUOlxuICAgICAgICBiID0gMSArIGNvc2IgKiBjb3NsYW07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLk5fUE9MRTpcbiAgICAgICAgYiA9IEhBTEZfUEkgKyBwaGk7XG4gICAgICAgIHEgPSB0aGlzLnFwIC0gcTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuU19QT0xFOlxuICAgICAgICBiID0gcGhpIC0gSEFMRl9QSTtcbiAgICAgICAgcSA9IHRoaXMucXAgKyBxO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKE1hdGguYWJzKGIpIDwgRVBTTE4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSB0aGlzLk9CTElROlxuICAgICAgY2FzZSB0aGlzLkVRVUlUOlxuICAgICAgICBiID0gTWF0aC5zcXJ0KDIgLyBiKTtcbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSkge1xuICAgICAgICAgIHkgPSB0aGlzLnltZiAqIGIgKiAodGhpcy5jb3NiMSAqIHNpbmIgLSB0aGlzLnNpbmIxICogY29zYiAqIGNvc2xhbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeSA9IChiID0gTWF0aC5zcXJ0KDIgLyAoMSArIGNvc2IgKiBjb3NsYW0pKSkgKiBzaW5iICogdGhpcy55bWY7XG4gICAgICAgIH1cbiAgICAgICAgeCA9IHRoaXMueG1mICogYiAqIGNvc2IgKiBzaW5sYW07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLk5fUE9MRTpcbiAgICAgIGNhc2UgdGhpcy5TX1BPTEU6XG4gICAgICAgIGlmIChxID49IDApIHtcbiAgICAgICAgICB4ID0gKGIgPSBNYXRoLnNxcnQocSkpICogc2lubGFtO1xuICAgICAgICAgIHkgPSBjb3NsYW0gKiAoKHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpID8gYiA6IC1iKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4ID0geSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcC54ID0gdGhpcy5hICogeCArIHRoaXMueDA7XG4gIHAueSA9IHRoaXMuYSAqIHkgKyB0aGlzLnkwO1xuICByZXR1cm4gcDtcbn1cblxuLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICB2YXIgeCA9IHAueCAvIHRoaXMuYTtcbiAgdmFyIHkgPSBwLnkgLyB0aGlzLmE7XG4gIHZhciBsYW0sIHBoaSwgY0NlLCBzQ2UsIHEsIHJobywgYWI7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHZhciBjb3N6ID0gMCxcbiAgICAgIHJoLCBzaW56ID0gMDtcblxuICAgIHJoID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIHBoaSA9IHJoICogMC41O1xuICAgIGlmIChwaGkgPiAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcGhpID0gMiAqIE1hdGguYXNpbihwaGkpO1xuICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEgfHwgdGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSB7XG4gICAgICBzaW56ID0gTWF0aC5zaW4ocGhpKTtcbiAgICAgIGNvc3ogPSBNYXRoLmNvcyhwaGkpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSB0aGlzLkVRVUlUOlxuICAgICAgICBwaGkgPSAoTWF0aC5hYnMocmgpIDw9IEVQU0xOKSA/IDAgOiBNYXRoLmFzaW4oeSAqIHNpbnogLyByaCk7XG4gICAgICAgIHggKj0gc2luejtcbiAgICAgICAgeSA9IGNvc3ogKiByaDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuT0JMSVE6XG4gICAgICAgIHBoaSA9IChNYXRoLmFicyhyaCkgPD0gRVBTTE4pID8gdGhpcy5sYXQwIDogTWF0aC5hc2luKGNvc3ogKiB0aGlzLnNpbnBoMCArIHkgKiBzaW56ICogdGhpcy5jb3NwaDAgLyByaCk7XG4gICAgICAgIHggKj0gc2lueiAqIHRoaXMuY29zcGgwO1xuICAgICAgICB5ID0gKGNvc3ogLSBNYXRoLnNpbihwaGkpICogdGhpcy5zaW5waDApICogcmg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLk5fUE9MRTpcbiAgICAgICAgeSA9IC15O1xuICAgICAgICBwaGkgPSBIQUxGX1BJIC0gcGhpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5TX1BPTEU6XG4gICAgICAgIHBoaSAtPSBIQUxGX1BJO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgbGFtID0gKHkgPT09IDAgJiYgKHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCB8fCB0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEpKSA/IDAgOiBNYXRoLmF0YW4yKHgsIHkpO1xuICB9IGVsc2Uge1xuICAgIGFiID0gMDtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuICAgICAgeCAvPSB0aGlzLmRkO1xuICAgICAgeSAqPSB0aGlzLmRkO1xuICAgICAgcmhvID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgICAgaWYgKHJobyA8IEVQU0xOKSB7XG4gICAgICAgIHAueCA9IHRoaXMubG9uZzA7XG4gICAgICAgIHAueSA9IHRoaXMubGF0MDtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9XG4gICAgICBzQ2UgPSAyICogTWF0aC5hc2luKDAuNSAqIHJobyAvIHRoaXMucnEpO1xuICAgICAgY0NlID0gTWF0aC5jb3Moc0NlKTtcbiAgICAgIHggKj0gKHNDZSA9IE1hdGguc2luKHNDZSkpO1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSkge1xuICAgICAgICBhYiA9IGNDZSAqIHRoaXMuc2luYjEgKyB5ICogc0NlICogdGhpcy5jb3NiMSAvIHJobztcbiAgICAgICAgcSA9IHRoaXMucXAgKiBhYjtcbiAgICAgICAgeSA9IHJobyAqIHRoaXMuY29zYjEgKiBjQ2UgLSB5ICogdGhpcy5zaW5iMSAqIHNDZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFiID0geSAqIHNDZSAvIHJobztcbiAgICAgICAgcSA9IHRoaXMucXAgKiBhYjtcbiAgICAgICAgeSA9IHJobyAqIGNDZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUgfHwgdGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkge1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUpIHtcbiAgICAgICAgeSA9IC15O1xuICAgICAgfVxuICAgICAgcSA9ICh4ICogeCArIHkgKiB5KTtcbiAgICAgIGlmICghcSkge1xuICAgICAgICBwLnggPSB0aGlzLmxvbmcwO1xuICAgICAgICBwLnkgPSB0aGlzLmxhdDA7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfVxuICAgICAgYWIgPSAxIC0gcSAvIHRoaXMucXA7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkge1xuICAgICAgICBhYiA9IC1hYjtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFtID0gTWF0aC5hdGFuMih4LCB5KTtcbiAgICBwaGkgPSBhdXRobGF0KE1hdGguYXNpbihhYiksIHRoaXMuYXBhKTtcbiAgfVxuXG4gIHAueCA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIGxhbSwgdGhpcy5vdmVyKTtcbiAgcC55ID0gcGhpO1xuICByZXR1cm4gcDtcbn1cblxuLyogZGV0ZXJtaW5lIGxhdGl0dWRlIGZyb20gYXV0aGFsaWMgbGF0aXR1ZGUgKi9cbnZhciBQMDAgPSAwLjMzMzMzMzMzMzMzMzMzMzMzMzMzO1xuXG52YXIgUDAxID0gMC4xNzIyMjIyMjIyMjIyMjIyMjIyMjtcbnZhciBQMDIgPSAwLjEwMjU3OTM2NTA3OTM2NTA3OTM2O1xudmFyIFAxMCA9IDAuMDYzODg4ODg4ODg4ODg4ODg4ODg7XG52YXIgUDExID0gMC4wNjY0MDIxMTY0MDIxMTY0MDIxMTtcbnZhciBQMjAgPSAwLjAxNjQxNTAxMjk0MjE5MTU0NDQzO1xuXG5mdW5jdGlvbiBhdXRoc2V0KGVzKSB7XG4gIHZhciB0O1xuICB2YXIgQVBBID0gW107XG4gIEFQQVswXSA9IGVzICogUDAwO1xuICB0ID0gZXMgKiBlcztcbiAgQVBBWzBdICs9IHQgKiBQMDE7XG4gIEFQQVsxXSA9IHQgKiBQMTA7XG4gIHQgKj0gZXM7XG4gIEFQQVswXSArPSB0ICogUDAyO1xuICBBUEFbMV0gKz0gdCAqIFAxMTtcbiAgQVBBWzJdID0gdCAqIFAyMDtcbiAgcmV0dXJuIEFQQTtcbn1cblxuZnVuY3Rpb24gYXV0aGxhdChiZXRhLCBBUEEpIHtcbiAgdmFyIHQgPSBiZXRhICsgYmV0YTtcbiAgcmV0dXJuIChiZXRhICsgQVBBWzBdICogTWF0aC5zaW4odCkgKyBBUEFbMV0gKiBNYXRoLnNpbih0ICsgdCkgKyBBUEFbMl0gKiBNYXRoLnNpbih0ICsgdCArIHQpKTtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnTGFtYmVydCBBemltdXRoYWwgRXF1YWwgQXJlYScsICdMYW1iZXJ0X0F6aW11dGhhbF9FcXVhbF9BcmVhJywgJ2xhZWEnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzLFxuICBTX1BPTEU6IFNfUE9MRSxcbiAgTl9QT0xFOiBOX1BPTEUsXG4gIEVRVUlUOiBFUVVJVCxcbiAgT0JMSVE6IE9CTElRXG59O1xuIiwiaW1wb3J0IG1zZm56IGZyb20gJy4uL2NvbW1vbi9tc2Zueic7XG5pbXBvcnQgdHNmbnogZnJvbSAnLi4vY29tbW9uL3RzZm56JztcbmltcG9ydCBzaWduIGZyb20gJy4uL2NvbW1vbi9zaWduJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBwaGkyeiBmcm9tICcuLi9jb21tb24vcGhpMnonO1xuaW1wb3J0IHsgSEFMRl9QSSwgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gbnNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBmMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJoXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvLyBkb3VibGUgbGF0MDsgICAgICAgICAgICAgICAgICAgIC8qIHRoZSByZWZlcmVuY2UgbGF0aXR1ZGUgICAgICAgICAgICAgICAqL1xuICAvLyBkb3VibGUgbG9uZzA7ICAgICAgICAgICAgICAgICAgIC8qIHRoZSByZWZlcmVuY2UgbG9uZ2l0dWRlICAgICAgICAgICAgICAqL1xuICAvLyBkb3VibGUgbGF0MTsgICAgICAgICAgICAgICAgICAgIC8qIGZpcnN0IHN0YW5kYXJkIHBhcmFsbGVsICAgICAgICAgICAgICAqL1xuICAvLyBkb3VibGUgbGF0MjsgICAgICAgICAgICAgICAgICAgIC8qIHNlY29uZCBzdGFuZGFyZCBwYXJhbGxlbCAgICAgICAgICAgICAqL1xuICAvLyBkb3VibGUgcl9tYWo7ICAgICAgICAgICAgICAgICAgIC8qIG1ham9yIGF4aXMgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAvLyBkb3VibGUgcl9taW47ICAgICAgICAgICAgICAgICAgIC8qIG1pbm9yIGF4aXMgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAvLyBkb3VibGUgZmFsc2VfZWFzdDsgICAgICAgICAgICAgIC8qIHggb2Zmc2V0IGluIG1ldGVycyAgICAgICAgICAgICAgICAgICAqL1xuICAvLyBkb3VibGUgZmFsc2Vfbm9ydGg7ICAgICAgICAgICAgIC8qIHkgb2Zmc2V0IGluIG1ldGVycyAgICAgICAgICAgICAgICAgICAqL1xuXG4gIC8vIHRoZSBhYm92ZSB2YWx1ZSBjYW4gYmUgc2V0IHdpdGggcHJvajQuZGVmc1xuICAvLyBleGFtcGxlOiBwcm9qNC5kZWZzKFwiRVBTRzoyMTU0XCIsXCIrcHJvaj1sY2MgK2xhdF8xPTQ5ICtsYXRfMj00NCArbGF0XzA9NDYuNSArbG9uXzA9MyAreF8wPTcwMDAwMCAreV8wPTY2MDAwMDAgK2VsbHBzPUdSUzgwICt0b3dnczg0PTAsMCwwLDAsMCwwLDAgK3VuaXRzPW0gK25vX2RlZnNcIik7XG5cbiAgaWYgKCF0aGlzLmxhdDIpIHtcbiAgICB0aGlzLmxhdDIgPSB0aGlzLmxhdDE7XG4gIH0gLy8gaWYgbGF0MiBpcyBub3QgZGVmaW5lZFxuICBpZiAoIXRoaXMuazApIHtcbiAgICB0aGlzLmswID0gMTtcbiAgfVxuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICAvLyBTdGFuZGFyZCBQYXJhbGxlbHMgY2Fubm90IGJlIGVxdWFsIGFuZCBvbiBvcHBvc2l0ZSBzaWRlcyBvZiB0aGUgZXF1YXRvclxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxICsgdGhpcy5sYXQyKSA8IEVQU0xOKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRlbXAgPSB0aGlzLmIgLyB0aGlzLmE7XG4gIHRoaXMuZSA9IE1hdGguc3FydCgxIC0gdGVtcCAqIHRlbXApO1xuXG4gIHZhciBzaW4xID0gTWF0aC5zaW4odGhpcy5sYXQxKTtcbiAgdmFyIGNvczEgPSBNYXRoLmNvcyh0aGlzLmxhdDEpO1xuICB2YXIgbXMxID0gbXNmbnoodGhpcy5lLCBzaW4xLCBjb3MxKTtcbiAgdmFyIHRzMSA9IHRzZm56KHRoaXMuZSwgdGhpcy5sYXQxLCBzaW4xKTtcblxuICB2YXIgc2luMiA9IE1hdGguc2luKHRoaXMubGF0Mik7XG4gIHZhciBjb3MyID0gTWF0aC5jb3ModGhpcy5sYXQyKTtcbiAgdmFyIG1zMiA9IG1zZm56KHRoaXMuZSwgc2luMiwgY29zMik7XG4gIHZhciB0czIgPSB0c2Zueih0aGlzLmUsIHRoaXMubGF0Miwgc2luMik7XG5cbiAgdmFyIHRzMCA9IE1hdGguYWJzKE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJKSA8IEVQU0xOXG4gICAgPyAwIC8vIEhhbmRsZSBwb2xlcyBieSBzZXR0aW5nIHRzMCB0byAwXG4gICAgOiB0c2Zueih0aGlzLmUsIHRoaXMubGF0MCwgTWF0aC5zaW4odGhpcy5sYXQwKSk7XG5cbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MSAtIHRoaXMubGF0MikgPiBFUFNMTikge1xuICAgIHRoaXMubnMgPSBNYXRoLmxvZyhtczEgLyBtczIpIC8gTWF0aC5sb2codHMxIC8gdHMyKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm5zID0gc2luMTtcbiAgfVxuICBpZiAoaXNOYU4odGhpcy5ucykpIHtcbiAgICB0aGlzLm5zID0gc2luMTtcbiAgfVxuICB0aGlzLmYwID0gbXMxIC8gKHRoaXMubnMgKiBNYXRoLnBvdyh0czEsIHRoaXMubnMpKTtcbiAgdGhpcy5yaCA9IHRoaXMuYSAqIHRoaXMuZjAgKiBNYXRoLnBvdyh0czAsIHRoaXMubnMpO1xuICBpZiAoIXRoaXMudGl0bGUpIHtcbiAgICB0aGlzLnRpdGxlID0gJ0xhbWJlcnQgQ29uZm9ybWFsIENvbmljJztcbiAgfVxufVxuXG4vLyBMYW1iZXJ0IENvbmZvcm1hbCBjb25pYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgLy8gc2luZ3VsYXIgY2FzZXMgOlxuICBpZiAoTWF0aC5hYnMoMiAqIE1hdGguYWJzKGxhdCkgLSBNYXRoLlBJKSA8PSBFUFNMTikge1xuICAgIGxhdCA9IHNpZ24obGF0KSAqIChIQUxGX1BJIC0gMiAqIEVQU0xOKTtcbiAgfVxuXG4gIHZhciBjb24gPSBNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSk7XG4gIHZhciB0cywgcmgxO1xuICBpZiAoY29uID4gRVBTTE4pIHtcbiAgICB0cyA9IHRzZm56KHRoaXMuZSwgbGF0LCBNYXRoLnNpbihsYXQpKTtcbiAgICByaDEgPSB0aGlzLmEgKiB0aGlzLmYwICogTWF0aC5wb3codHMsIHRoaXMubnMpO1xuICB9IGVsc2Uge1xuICAgIGNvbiA9IGxhdCAqIHRoaXMubnM7XG4gICAgaWYgKGNvbiA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmgxID0gMDtcbiAgfVxuICB2YXIgdGhldGEgPSB0aGlzLm5zICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICBwLnggPSB0aGlzLmswICogKHJoMSAqIE1hdGguc2luKHRoZXRhKSkgKyB0aGlzLngwO1xuICBwLnkgPSB0aGlzLmswICogKHRoaXMucmggLSByaDEgKiBNYXRoLmNvcyh0aGV0YSkpICsgdGhpcy55MDtcblxuICByZXR1cm4gcDtcbn1cblxuLy8gTGFtYmVydCBDb25mb3JtYWwgQ29uaWMgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgcmgxLCBjb24sIHRzO1xuICB2YXIgbGF0LCBsb247XG4gIHZhciB4ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5rMDtcbiAgdmFyIHkgPSAodGhpcy5yaCAtIChwLnkgLSB0aGlzLnkwKSAvIHRoaXMuazApO1xuICBpZiAodGhpcy5ucyA+IDApIHtcbiAgICByaDEgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgY29uID0gMTtcbiAgfSBlbHNlIHtcbiAgICByaDEgPSAtTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIGNvbiA9IC0xO1xuICB9XG4gIHZhciB0aGV0YSA9IDA7XG4gIGlmIChyaDEgIT09IDApIHtcbiAgICB0aGV0YSA9IE1hdGguYXRhbjIoKGNvbiAqIHgpLCAoY29uICogeSkpO1xuICB9XG4gIGlmICgocmgxICE9PSAwKSB8fCAodGhpcy5ucyA+IDApKSB7XG4gICAgY29uID0gMSAvIHRoaXMubnM7XG4gICAgdHMgPSBNYXRoLnBvdygocmgxIC8gKHRoaXMuYSAqIHRoaXMuZjApKSwgY29uKTtcbiAgICBsYXQgPSBwaGkyeih0aGlzLmUsIHRzKTtcbiAgICBpZiAobGF0ID09PSAtOTk5OSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxhdCA9IC1IQUxGX1BJO1xuICB9XG4gIGxvbiA9IGFkanVzdF9sb24odGhldGEgLyB0aGlzLm5zICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXG4gICdMYW1iZXJ0IFRhbmdlbnRpYWwgQ29uZm9ybWFsIENvbmljIFByb2plY3Rpb24nLFxuICAnTGFtYmVydF9Db25mb3JtYWxfQ29uaWMnLFxuICAnTGFtYmVydF9Db25mb3JtYWxfQ29uaWNfMVNQJyxcbiAgJ0xhbWJlcnRfQ29uZm9ybWFsX0NvbmljXzJTUCcsXG4gICdsY2MnLFxuICAnTGFtYmVydCBDb25pYyBDb25mb3JtYWwgKDFTUCknLFxuICAnTGFtYmVydCBDb25pYyBDb25mb3JtYWwgKDJTUCknXG5dO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvLyBuby1vcCBmb3IgbG9uZ2xhdFxufVxuXG5mdW5jdGlvbiBpZGVudGl0eShwdCkge1xuICByZXR1cm4gcHQ7XG59XG5leHBvcnQgeyBpZGVudGl0eSBhcyBmb3J3YXJkIH07XG5leHBvcnQgeyBpZGVudGl0eSBhcyBpbnZlcnNlIH07XG5leHBvcnQgdmFyIG5hbWVzID0gWydsb25nbGF0JywgJ2lkZW50aXR5J107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGlkZW50aXR5LFxuICBpbnZlcnNlOiBpZGVudGl0eSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IG1zZm56IGZyb20gJy4uL2NvbW1vbi9tc2Zueic7XG5cbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCB0c2ZueiBmcm9tICcuLi9jb21tb24vdHNmbnonO1xuaW1wb3J0IHBoaTJ6IGZyb20gJy4uL2NvbW1vbi9waGkyeic7XG5pbXBvcnQgeyBGT1JUUEksIFIyRCwgRVBTTE4sIEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBrXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgY29uID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmVzID0gMSAtIGNvbiAqIGNvbjtcbiAgaWYgKCEoJ3gwJyBpbiB0aGlzKSkge1xuICAgIHRoaXMueDAgPSAwO1xuICB9XG4gIGlmICghKCd5MCcgaW4gdGhpcykpIHtcbiAgICB0aGlzLnkwID0gMDtcbiAgfVxuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG4gIGlmICh0aGlzLmxhdF90cykge1xuICAgIGlmICh0aGlzLnNwaGVyZSkge1xuICAgICAgdGhpcy5rMCA9IE1hdGguY29zKHRoaXMubGF0X3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5rMCA9IG1zZm56KHRoaXMuZSwgTWF0aC5zaW4odGhpcy5sYXRfdHMpLCBNYXRoLmNvcyh0aGlzLmxhdF90cykpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIXRoaXMuazApIHtcbiAgICAgIGlmICh0aGlzLmspIHtcbiAgICAgICAgdGhpcy5rMCA9IHRoaXMuaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuazAgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiBNZXJjYXRvciBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICAvLyBjb252ZXJ0IHRvIHJhZGlhbnNcbiAgaWYgKGxhdCAqIFIyRCA+IDkwICYmIGxhdCAqIFIyRCA8IC05MCAmJiBsb24gKiBSMkQgPiAxODAgJiYgbG9uICogUjJEIDwgLTE4MCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHgsIHk7XG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSkgPD0gRVBTTE4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogdGhpcy5rMCAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICogdGhpcy5rMCAqIE1hdGgubG9nKE1hdGgudGFuKEZPUlRQSSArIDAuNSAqIGxhdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcbiAgICAgIHZhciB0cyA9IHRzZm56KHRoaXMuZSwgbGF0LCBzaW5waGkpO1xuICAgICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiB0aGlzLmswICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICAgICAgeSA9IHRoaXMueTAgLSB0aGlzLmEgKiB0aGlzLmswICogTWF0aC5sb2codHMpO1xuICAgIH1cbiAgICBwLnggPSB4O1xuICAgIHAueSA9IHk7XG4gICAgcmV0dXJuIHA7XG4gIH1cbn1cblxuLyogTWVyY2F0b3IgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciB4ID0gcC54IC0gdGhpcy54MDtcbiAgdmFyIHkgPSBwLnkgLSB0aGlzLnkwO1xuICB2YXIgbG9uLCBsYXQ7XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgbGF0ID0gSEFMRl9QSSAtIDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoLXkgLyAodGhpcy5hICogdGhpcy5rMCkpKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdHMgPSBNYXRoLmV4cCgteSAvICh0aGlzLmEgKiB0aGlzLmswKSk7XG4gICAgbGF0ID0gcGhpMnoodGhpcy5lLCB0cyk7XG4gICAgaWYgKGxhdCA9PT0gLTk5OTkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyB4IC8gKHRoaXMuYSAqIHRoaXMuazApLCB0aGlzLm92ZXIpO1xuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnTWVyY2F0b3InLCAnUG9wdWxhciBWaXN1YWxpc2F0aW9uIFBzZXVkbyBNZXJjYXRvcicsICdNZXJjYXRvcl8xU1AnLCAnTWVyY2F0b3JfQXV4aWxpYXJ5X1NwaGVyZScsICdNZXJjYXRvcl9WYXJpYW50X0EnLCAnbWVyYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbi8qXG4gIHJlZmVyZW5jZVxuICAgIFwiTmV3IEVxdWFsLUFyZWEgTWFwIFByb2plY3Rpb25zIGZvciBOb25jaXJjdWxhciBSZWdpb25zXCIsIEpvaG4gUC4gU255ZGVyLFxuICAgIFRoZSBBbWVyaWNhbiBDYXJ0b2dyYXBoZXIsIFZvbCAxNSwgTm8uIDQsIE9jdG9iZXIgMTk4OCwgcHAuIDM0MS0zNTUuXG4gICovXG5cbi8qIEluaXRpYWxpemUgdGhlIE1pbGxlciBDeWxpbmRyaWNhbCBwcm9qZWN0aW9uXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvLyBuby1vcFxufVxuXG4vKiBNaWxsZXIgQ3lsaW5kcmljYWwgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIHggPSB0aGlzLngwICsgdGhpcy5hICogZGxvbjtcbiAgdmFyIHkgPSB0aGlzLnkwICsgdGhpcy5hICogTWF0aC5sb2coTWF0aC50YW4oKE1hdGguUEkgLyA0KSArIChsYXQgLyAyLjUpKSkgKiAxLjI1O1xuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG4vKiBNaWxsZXIgQ3lsaW5kcmljYWwgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcblxuICB2YXIgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgcC54IC8gdGhpcy5hLCB0aGlzLm92ZXIpO1xuICB2YXIgbGF0ID0gMi41ICogKE1hdGguYXRhbihNYXRoLmV4cCgwLjggKiBwLnkgLyB0aGlzLmEpKSAtIE1hdGguUEkgLyA0KTtcblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ01pbGxlcl9DeWxpbmRyaWNhbCcsICdtaWxsJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCB7IEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb259ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy54MCA9IHRoaXMueDAgIT09IHVuZGVmaW5lZCA/IHRoaXMueDAgOiAwO1xuICB0aGlzLnkwID0gdGhpcy55MCAhPT0gdW5kZWZpbmVkID8gdGhpcy55MCA6IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwICE9PSB1bmRlZmluZWQgPyB0aGlzLmxvbmcwIDogMDtcbn1cblxuLyogTW9sbHdlaWRlIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgdmFyIGRlbHRhX2xvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIHRoZXRhID0gbGF0O1xuICB2YXIgY29uID0gTWF0aC5QSSAqIE1hdGguc2luKGxhdCk7XG5cbiAgLyogSXRlcmF0ZSB1c2luZyB0aGUgTmV3dG9uLVJhcGhzb24gbWV0aG9kIHRvIGZpbmQgdGhldGFcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIGRlbHRhX3RoZXRhID0gLSh0aGV0YSArIE1hdGguc2luKHRoZXRhKSAtIGNvbikgLyAoMSArIE1hdGguY29zKHRoZXRhKSk7XG4gICAgdGhldGEgKz0gZGVsdGFfdGhldGE7XG4gICAgaWYgKE1hdGguYWJzKGRlbHRhX3RoZXRhKSA8IEVQU0xOKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdGhldGEgLz0gMjtcblxuICAvKiBJZiB0aGUgbGF0aXR1ZGUgaXMgOTAgZGVnLCBmb3JjZSB0aGUgeCBjb29yZGluYXRlIHRvIGJlIFwiMCArIGZhbHNlIGVhc3RpbmdcIlxuICAgICAgIHRoaXMgaXMgZG9uZSBoZXJlIGJlY2F1c2Ugb2YgcHJlY2lzaW9uIHByb2JsZW1zIHdpdGggXCJjb3ModGhldGEpXCJcbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBpZiAoTWF0aC5QSSAvIDIgLSBNYXRoLmFicyhsYXQpIDwgRVBTTE4pIHtcbiAgICBkZWx0YV9sb24gPSAwO1xuICB9XG4gIHZhciB4ID0gMC45MDAzMTYzMTYxNTggKiB0aGlzLmEgKiBkZWx0YV9sb24gKiBNYXRoLmNvcyh0aGV0YSkgKyB0aGlzLngwO1xuICB2YXIgeSA9IDEuNDE0MjEzNTYyMzczMSAqIHRoaXMuYSAqIE1hdGguc2luKHRoZXRhKSArIHRoaXMueTA7XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHRoZXRhO1xuICB2YXIgYXJnO1xuXG4gIC8qIEludmVyc2UgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIGFyZyA9IHAueSAvICgxLjQxNDIxMzU2MjM3MzEgKiB0aGlzLmEpO1xuXG4gIC8qIEJlY2F1c2Ugb2YgZGl2aXNpb24gYnkgemVybyBwcm9ibGVtcywgJ2FyZycgY2FuIG5vdCBiZSAxLiAgVGhlcmVmb3JlXG4gICAgICAgYSBudW1iZXIgdmVyeSBjbG9zZSB0byBvbmUgaXMgdXNlZCBpbnN0ZWFkLlxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgaWYgKE1hdGguYWJzKGFyZykgPiAwLjk5OTk5OTk5OTk5OSkge1xuICAgIGFyZyA9IDAuOTk5OTk5OTk5OTk5O1xuICB9XG4gIHRoZXRhID0gTWF0aC5hc2luKGFyZyk7XG4gIHZhciBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAocC54IC8gKDAuOTAwMzE2MzE2MTU4ICogdGhpcy5hICogTWF0aC5jb3ModGhldGEpKSksIHRoaXMub3Zlcik7XG4gIGlmIChsb24gPCAoLU1hdGguUEkpKSB7XG4gICAgbG9uID0gLU1hdGguUEk7XG4gIH1cbiAgaWYgKGxvbiA+IE1hdGguUEkpIHtcbiAgICBsb24gPSBNYXRoLlBJO1xuICB9XG4gIGFyZyA9ICgyICogdGhldGEgKyBNYXRoLnNpbigyICogdGhldGEpKSAvIE1hdGguUEk7XG4gIGlmIChNYXRoLmFicyhhcmcpID4gMSkge1xuICAgIGFyZyA9IDE7XG4gIH1cbiAgdmFyIGxhdCA9IE1hdGguYXNpbihhcmcpO1xuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnTW9sbHdlaWRlJywgJ21vbGwnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHsgU0VDX1RPX1JBRCB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKlxuICByZWZlcmVuY2VcbiAgICBEZXBhcnRtZW50IG9mIExhbmQgYW5kIFN1cnZleSBUZWNobmljYWwgQ2lyY3VsYXIgMTk3My8zMlxuICAgICAgaHR0cDovL3d3dy5saW56LmdvdnQubnovZG9jcy9taXNjZWxsYW5lb3VzL256LW1hcC1kZWZpbml0aW9uLnBkZlxuICAgIE9TRyBUZWNobmljYWwgUmVwb3J0IDQuMVxuICAgICAgaHR0cDovL3d3dy5saW56LmdvdnQubnovZG9jcy9taXNjZWxsYW5lb3VzL256bWcucGRmXG4gICovXG5cbi8qKlxuICogaXRlcmF0aW9uczogTnVtYmVyIG9mIGl0ZXJhdGlvbnMgdG8gcmVmaW5lIGludmVyc2UgdHJhbnNmb3JtLlxuICogICAgIDAgLT4ga20gYWNjdXJhY3lcbiAqICAgICAxIC0+IG0gYWNjdXJhY3kgLS0gc3VpdGFibGUgZm9yIG1vc3QgbWFwcGluZyBhcHBsaWNhdGlvbnNcbiAqICAgICAyIC0+IG1tIGFjY3VyYWN5XG4gKi9cbmV4cG9ydCB2YXIgaXRlcmF0aW9ucyA9IDE7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLkEgPSBbXTtcbiAgdGhpcy5BWzFdID0gMC42Mzk5MTc1MDczO1xuICB0aGlzLkFbMl0gPSAtMC4xMzU4Nzk3NjEzO1xuICB0aGlzLkFbM10gPSAwLjA2MzI5NDQwOTtcbiAgdGhpcy5BWzRdID0gLTAuMDI1MjY4NTM7XG4gIHRoaXMuQVs1XSA9IDAuMDExNzg3OTtcbiAgdGhpcy5BWzZdID0gLTAuMDA1NTE2MTtcbiAgdGhpcy5BWzddID0gMC4wMDI2OTA2O1xuICB0aGlzLkFbOF0gPSAtMC4wMDEzMzM7XG4gIHRoaXMuQVs5XSA9IDAuMDAwNjc7XG4gIHRoaXMuQVsxMF0gPSAtMC4wMDAzNDtcblxuICB0aGlzLkJfcmUgPSBbXTtcbiAgdGhpcy5CX2ltID0gW107XG4gIHRoaXMuQl9yZVsxXSA9IDAuNzU1Nzg1MzIyODtcbiAgdGhpcy5CX2ltWzFdID0gMDtcbiAgdGhpcy5CX3JlWzJdID0gMC4yNDkyMDQ2NDY7XG4gIHRoaXMuQl9pbVsyXSA9IDAuMDAzMzcxNTA3O1xuICB0aGlzLkJfcmVbM10gPSAtMC4wMDE1NDE3Mzk7XG4gIHRoaXMuQl9pbVszXSA9IDAuMDQxMDU4NTYwO1xuICB0aGlzLkJfcmVbNF0gPSAtMC4xMDE2MjkwNztcbiAgdGhpcy5CX2ltWzRdID0gMC4wMTcyNzYwOTtcbiAgdGhpcy5CX3JlWzVdID0gLTAuMjY2MjM0ODk7XG4gIHRoaXMuQl9pbVs1XSA9IC0wLjM2MjQ5MjE4O1xuICB0aGlzLkJfcmVbNl0gPSAtMC42ODcwOTgzO1xuICB0aGlzLkJfaW1bNl0gPSAtMS4xNjUxOTY3O1xuXG4gIHRoaXMuQ19yZSA9IFtdO1xuICB0aGlzLkNfaW0gPSBbXTtcbiAgdGhpcy5DX3JlWzFdID0gMS4zMjMxMjcwNDM5O1xuICB0aGlzLkNfaW1bMV0gPSAwO1xuICB0aGlzLkNfcmVbMl0gPSAtMC41NzcyNDU3ODk7XG4gIHRoaXMuQ19pbVsyXSA9IC0wLjAwNzgwOTU5ODtcbiAgdGhpcy5DX3JlWzNdID0gMC41MDgzMDc1MTM7XG4gIHRoaXMuQ19pbVszXSA9IC0wLjExMjIwODk1MjtcbiAgdGhpcy5DX3JlWzRdID0gLTAuMTUwOTQ3NjI7XG4gIHRoaXMuQ19pbVs0XSA9IDAuMTgyMDA2MDI7XG4gIHRoaXMuQ19yZVs1XSA9IDEuMDE0MTgxNzk7XG4gIHRoaXMuQ19pbVs1XSA9IDEuNjQ0OTc2OTY7XG4gIHRoaXMuQ19yZVs2XSA9IDEuOTY2MDU0OTtcbiAgdGhpcy5DX2ltWzZdID0gMi41MTI3NjQ1O1xuXG4gIHRoaXMuRCA9IFtdO1xuICB0aGlzLkRbMV0gPSAxLjU2MjcwMTQyNDM7XG4gIHRoaXMuRFsyXSA9IDAuNTE4NTQwNjM5ODtcbiAgdGhpcy5EWzNdID0gLTAuMDMzMzMwOTg7XG4gIHRoaXMuRFs0XSA9IC0wLjEwNTI5MDY7XG4gIHRoaXMuRFs1XSA9IC0wLjAzNjg1OTQ7XG4gIHRoaXMuRFs2XSA9IDAuMDA3MzE3O1xuICB0aGlzLkRbN10gPSAwLjAxMjIwO1xuICB0aGlzLkRbOF0gPSAwLjAwMzk0O1xuICB0aGlzLkRbOV0gPSAtMC4wMDEzO1xufVxuXG4vKipcbiAgICBOZXcgWmVhbGFuZCBNYXAgR3JpZCBGb3J3YXJkICAtIGxvbmcvbGF0IHRvIHgveVxuICAgIGxvbmcvbGF0IGluIHJhZGlhbnNcbiAgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIG47XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgdmFyIGRlbHRhX2xhdCA9IGxhdCAtIHRoaXMubGF0MDtcbiAgdmFyIGRlbHRhX2xvbiA9IGxvbiAtIHRoaXMubG9uZzA7XG5cbiAgLy8gMS4gQ2FsY3VsYXRlIGRfcGhpIGFuZCBkX3BzaSAgICAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBkX2xhbWJkYVxuICAvLyBGb3IgdGhpcyBhbGdvcml0aG0sIGRlbHRhX2xhdGl0dWRlIGlzIGluIHNlY29uZHMgb2YgYXJjIHggMTAtNSwgc28gd2UgbmVlZCB0byBzY2FsZSB0byB0aG9zZSB1bml0cy4gTG9uZ2l0dWRlIGlzIHJhZGlhbnMuXG4gIHZhciBkX3BoaSA9IGRlbHRhX2xhdCAvIFNFQ19UT19SQUQgKiAxRS01O1xuICB2YXIgZF9sYW1iZGEgPSBkZWx0YV9sb247XG4gIHZhciBkX3BoaV9uID0gMTsgLy8gZF9waGleMFxuXG4gIHZhciBkX3BzaSA9IDA7XG4gIGZvciAobiA9IDE7IG4gPD0gMTA7IG4rKykge1xuICAgIGRfcGhpX24gPSBkX3BoaV9uICogZF9waGk7XG4gICAgZF9wc2kgPSBkX3BzaSArIHRoaXMuQVtuXSAqIGRfcGhpX247XG4gIH1cblxuICAvLyAyLiBDYWxjdWxhdGUgdGhldGFcbiAgdmFyIHRoX3JlID0gZF9wc2k7XG4gIHZhciB0aF9pbSA9IGRfbGFtYmRhO1xuXG4gIC8vIDMuIENhbGN1bGF0ZSB6XG4gIHZhciB0aF9uX3JlID0gMTtcbiAgdmFyIHRoX25faW0gPSAwOyAvLyB0aGV0YV4wXG4gIHZhciB0aF9uX3JlMTtcbiAgdmFyIHRoX25faW0xO1xuXG4gIHZhciB6X3JlID0gMDtcbiAgdmFyIHpfaW0gPSAwO1xuICBmb3IgKG4gPSAxOyBuIDw9IDY7IG4rKykge1xuICAgIHRoX25fcmUxID0gdGhfbl9yZSAqIHRoX3JlIC0gdGhfbl9pbSAqIHRoX2ltO1xuICAgIHRoX25faW0xID0gdGhfbl9pbSAqIHRoX3JlICsgdGhfbl9yZSAqIHRoX2ltO1xuICAgIHRoX25fcmUgPSB0aF9uX3JlMTtcbiAgICB0aF9uX2ltID0gdGhfbl9pbTE7XG4gICAgel9yZSA9IHpfcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX3JlIC0gdGhpcy5CX2ltW25dICogdGhfbl9pbTtcbiAgICB6X2ltID0gel9pbSArIHRoaXMuQl9pbVtuXSAqIHRoX25fcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX2ltO1xuICB9XG5cbiAgLy8gNC4gQ2FsY3VsYXRlIGVhc3RpbmcgYW5kIG5vcnRoaW5nXG4gIHAueCA9ICh6X2ltICogdGhpcy5hKSArIHRoaXMueDA7XG4gIHAueSA9ICh6X3JlICogdGhpcy5hKSArIHRoaXMueTA7XG5cbiAgcmV0dXJuIHA7XG59XG5cbi8qKlxuICAgIE5ldyBaZWFsYW5kIE1hcCBHcmlkIEludmVyc2UgIC0gIHgveSB0byBsb25nL2xhdFxuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbjtcbiAgdmFyIHggPSBwLng7XG4gIHZhciB5ID0gcC55O1xuXG4gIHZhciBkZWx0YV94ID0geCAtIHRoaXMueDA7XG4gIHZhciBkZWx0YV95ID0geSAtIHRoaXMueTA7XG5cbiAgLy8gMS4gQ2FsY3VsYXRlIHpcbiAgdmFyIHpfcmUgPSBkZWx0YV95IC8gdGhpcy5hO1xuICB2YXIgel9pbSA9IGRlbHRhX3ggLyB0aGlzLmE7XG5cbiAgLy8gMmEuIENhbGN1bGF0ZSB0aGV0YSAtIGZpcnN0IGFwcHJveGltYXRpb24gZ2l2ZXMga20gYWNjdXJhY3lcbiAgdmFyIHpfbl9yZSA9IDE7XG4gIHZhciB6X25faW0gPSAwOyAvLyB6XjBcbiAgdmFyIHpfbl9yZTE7XG4gIHZhciB6X25faW0xO1xuXG4gIHZhciB0aF9yZSA9IDA7XG4gIHZhciB0aF9pbSA9IDA7XG4gIGZvciAobiA9IDE7IG4gPD0gNjsgbisrKSB7XG4gICAgel9uX3JlMSA9IHpfbl9yZSAqIHpfcmUgLSB6X25faW0gKiB6X2ltO1xuICAgIHpfbl9pbTEgPSB6X25faW0gKiB6X3JlICsgel9uX3JlICogel9pbTtcbiAgICB6X25fcmUgPSB6X25fcmUxO1xuICAgIHpfbl9pbSA9IHpfbl9pbTE7XG4gICAgdGhfcmUgPSB0aF9yZSArIHRoaXMuQ19yZVtuXSAqIHpfbl9yZSAtIHRoaXMuQ19pbVtuXSAqIHpfbl9pbTtcbiAgICB0aF9pbSA9IHRoX2ltICsgdGhpcy5DX2ltW25dICogel9uX3JlICsgdGhpcy5DX3JlW25dICogel9uX2ltO1xuICB9XG5cbiAgLy8gMmIuIEl0ZXJhdGUgdG8gcmVmaW5lIHRoZSBhY2N1cmFjeSBvZiB0aGUgY2FsY3VsYXRpb25cbiAgLy8gICAgICAgIDAgaXRlcmF0aW9ucyBnaXZlcyBrbSBhY2N1cmFjeVxuICAvLyAgICAgICAgMSBpdGVyYXRpb24gZ2l2ZXMgbSBhY2N1cmFjeSAtLSBnb29kIGVub3VnaCBmb3IgbW9zdCBtYXBwaW5nIGFwcGxpY2F0aW9uc1xuICAvLyAgICAgICAgMiBpdGVyYXRpb25zIGJpdmVzIG1tIGFjY3VyYWN5XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVyYXRpb25zOyBpKyspIHtcbiAgICB2YXIgdGhfbl9yZSA9IHRoX3JlO1xuICAgIHZhciB0aF9uX2ltID0gdGhfaW07XG4gICAgdmFyIHRoX25fcmUxO1xuICAgIHZhciB0aF9uX2ltMTtcblxuICAgIHZhciBudW1fcmUgPSB6X3JlO1xuICAgIHZhciBudW1faW0gPSB6X2ltO1xuICAgIGZvciAobiA9IDI7IG4gPD0gNjsgbisrKSB7XG4gICAgICB0aF9uX3JlMSA9IHRoX25fcmUgKiB0aF9yZSAtIHRoX25faW0gKiB0aF9pbTtcbiAgICAgIHRoX25faW0xID0gdGhfbl9pbSAqIHRoX3JlICsgdGhfbl9yZSAqIHRoX2ltO1xuICAgICAgdGhfbl9yZSA9IHRoX25fcmUxO1xuICAgICAgdGhfbl9pbSA9IHRoX25faW0xO1xuICAgICAgbnVtX3JlID0gbnVtX3JlICsgKG4gLSAxKSAqICh0aGlzLkJfcmVbbl0gKiB0aF9uX3JlIC0gdGhpcy5CX2ltW25dICogdGhfbl9pbSk7XG4gICAgICBudW1faW0gPSBudW1faW0gKyAobiAtIDEpICogKHRoaXMuQl9pbVtuXSAqIHRoX25fcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX2ltKTtcbiAgICB9XG5cbiAgICB0aF9uX3JlID0gMTtcbiAgICB0aF9uX2ltID0gMDtcbiAgICB2YXIgZGVuX3JlID0gdGhpcy5CX3JlWzFdO1xuICAgIHZhciBkZW5faW0gPSB0aGlzLkJfaW1bMV07XG4gICAgZm9yIChuID0gMjsgbiA8PSA2OyBuKyspIHtcbiAgICAgIHRoX25fcmUxID0gdGhfbl9yZSAqIHRoX3JlIC0gdGhfbl9pbSAqIHRoX2ltO1xuICAgICAgdGhfbl9pbTEgPSB0aF9uX2ltICogdGhfcmUgKyB0aF9uX3JlICogdGhfaW07XG4gICAgICB0aF9uX3JlID0gdGhfbl9yZTE7XG4gICAgICB0aF9uX2ltID0gdGhfbl9pbTE7XG4gICAgICBkZW5fcmUgPSBkZW5fcmUgKyBuICogKHRoaXMuQl9yZVtuXSAqIHRoX25fcmUgLSB0aGlzLkJfaW1bbl0gKiB0aF9uX2ltKTtcbiAgICAgIGRlbl9pbSA9IGRlbl9pbSArIG4gKiAodGhpcy5CX2ltW25dICogdGhfbl9yZSArIHRoaXMuQl9yZVtuXSAqIHRoX25faW0pO1xuICAgIH1cblxuICAgIC8vIENvbXBsZXggZGl2aXNpb25cbiAgICB2YXIgZGVuMiA9IGRlbl9yZSAqIGRlbl9yZSArIGRlbl9pbSAqIGRlbl9pbTtcbiAgICB0aF9yZSA9IChudW1fcmUgKiBkZW5fcmUgKyBudW1faW0gKiBkZW5faW0pIC8gZGVuMjtcbiAgICB0aF9pbSA9IChudW1faW0gKiBkZW5fcmUgLSBudW1fcmUgKiBkZW5faW0pIC8gZGVuMjtcbiAgfVxuXG4gIC8vIDMuIENhbGN1bGF0ZSBkX3BoaSAgICAgICAgICAgICAgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGRfbGFtYmRhXG4gIHZhciBkX3BzaSA9IHRoX3JlO1xuICB2YXIgZF9sYW1iZGEgPSB0aF9pbTtcbiAgdmFyIGRfcHNpX24gPSAxOyAvLyBkX3BzaV4wXG5cbiAgdmFyIGRfcGhpID0gMDtcbiAgZm9yIChuID0gMTsgbiA8PSA5OyBuKyspIHtcbiAgICBkX3BzaV9uID0gZF9wc2lfbiAqIGRfcHNpO1xuICAgIGRfcGhpID0gZF9waGkgKyB0aGlzLkRbbl0gKiBkX3BzaV9uO1xuICB9XG5cbiAgLy8gNC4gQ2FsY3VsYXRlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGVcbiAgLy8gZF9waGkgaXMgY2FsY3VhdGVkIGluIHNlY29uZCBvZiBhcmMgKiAxMF4tNSwgc28gd2UgbmVlZCB0byBzY2FsZSBiYWNrIHRvIHJhZGlhbnMuIGRfbGFtYmRhIGlzIGluIHJhZGlhbnMuXG4gIHZhciBsYXQgPSB0aGlzLmxhdDAgKyAoZF9waGkgKiBTRUNfVE9fUkFEICogMUU1KTtcbiAgdmFyIGxvbiA9IHRoaXMubG9uZzAgKyBkX2xhbWJkYTtcblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcblxuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnTmV3X1plYWxhbmRfTWFwX0dyaWQnLCAnbnptZyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgeyBEMlIsIFIyRCwgSEFMRl9QSSwgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBQcm9qIGZyb20gJy4uL1Byb2onO1xuaW1wb3J0IHsgbmFtZXMgYXMgbG9uZ0xhdE5hbWVzIH0gZnJvbSAnLi9sb25nbGF0JztcblxuLyoqXG4gICAgT3JpZ2luYWwgcHJvamVjdGlvbiBpbXBsZW1lbnRhdGlvbjpcbiAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL09TR2VvL1BST0ovYmxvYi80NmM0N2U5YWRmNjM3NmFlMDZhZmFiZTVkMjRhMDAxNmEwNWNlZDgyL3NyYy9wcm9qZWN0aW9ucy9vYl90cmFuLmNwcFxuXG4gICAgRG9jdW1lbnRhdGlvbjpcbiAgICAgICAgaHR0cHM6Ly9wcm9qLm9yZy9vcGVyYXRpb25zL3Byb2plY3Rpb25zL29iX3RyYW4uaHRtbFxuXG4gICAgUmVmZXJlbmNlcy9Gb3JtdWxhczpcbiAgICAgICAgaHR0cHM6Ly9wdWJzLnVzZ3MuZ292L3BwLzEzOTUvcmVwb3J0LnBkZlxuXG4gICAgRXhhbXBsZXM6XG4gICAgICAgICtwcm9qPW9iX3RyYW4gK29fcHJvaj1tb2xsICtvX2xhdF9wPTQ1ICtvX2xvbl9wPS05MFxuICAgICAgICArcHJvaj1vYl90cmFuICtvX3Byb2o9bW9sbCArb19sYXRfcD00NSArb19sb25fcD0tOTAgK2xvbl8wPTYwXG4gICAgICAgICtwcm9qPW9iX3RyYW4gK29fcHJvaj1tb2xsICtvX2xhdF9wPTQ1ICtvX2xvbl9wPS05MCArbG9uXzA9LTkwXG4qL1xuXG5jb25zdCBwcm9qZWN0aW9uVHlwZSA9IHtcbiAgT0JMSVFVRToge1xuICAgIGZvcndhcmQ6IGZvcndhcmRPYmxpcXVlLFxuICAgIGludmVyc2U6IGludmVyc2VPYmxpcXVlXG4gIH0sXG4gIFRSQU5TVkVSU0U6IHtcbiAgICBmb3J3YXJkOiBmb3J3YXJkVHJhbnN2ZXJzZSxcbiAgICBpbnZlcnNlOiBpbnZlcnNlVHJhbnN2ZXJzZVxuICB9XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGxhbXBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjcGhpcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNwaGlwXG4gKiBAcHJvcGVydHkge09iamVjdH0gcHJvamVjdGlvblR5cGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX3Byb2pcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xvbl9wXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sYXRfcFxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fYWxwaGFcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xvbl9jXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sYXRfY1xuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbG9uXzFcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xhdF8xXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sb25fMlxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbGF0XzJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTG9uZ1BcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTGF0UFxuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9BbHBoYVxuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9Mb25nQ1xuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9MYXRDXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xvbmcxXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xhdDFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTG9uZzJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTGF0MlxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0lkZW50aXR5XG4gKiBAcHJvcGVydHkge2ltcG9ydCgnLi4nKS5Db252ZXJ0ZXJ9IG9ibGlxdWVQcm9qZWN0aW9uXG4gKlxuICovXG5cbi8qKlxuICogICAgUGFyYW1ldGVycyBjYW4gYmUgZnJvbSB0aGUgZm9sbG93aW5nIHNldHM6XG4gKiAgICAgICBOZXcgcG9sZSAtLT4gb19sYXRfcCwgb19sb25fcFxuICogICAgICAgUm90YXRlIGFib3V0IHBvaW50IC0tPiBvX2FscGhhLCBvX2xvbl9jLCBvX2xhdF9jXG4gKiAgICAgICBOZXcgZXF1YXRvciBwb2ludHMgLS0+IGxvbl8xLCBsYXRfMSwgbG9uXzIsIGxhdF8yXG4gKlxuICogICAgUGVyIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29kZSwgdGhlIHBhcmFtZXRlciBzZXRzIGFyZVxuICogICAgY2hlY2tlZCBpbiB0aGUgb3JkZXIgb2YgdGhlIG9iamVjdCBiZWxvdy5cbiAqL1xuY29uc3QgcGFyYW1TZXRzID0ge1xuICBST1RBVEU6IHtcbiAgICBvX2FscGhhOiAnb0FscGhhJyxcbiAgICBvX2xvbl9jOiAnb0xvbmdDJyxcbiAgICBvX2xhdF9jOiAnb0xhdEMnXG4gIH0sXG4gIE5FV19QT0xFOiB7XG4gICAgb19sYXRfcDogJ29MYXRQJyxcbiAgICBvX2xvbl9wOiAnb0xvbmdQJ1xuICB9LFxuICBORVdfRVFVQVRPUjoge1xuICAgIG9fbG9uXzE6ICdvTG9uZzEnLFxuICAgIG9fbGF0XzE6ICdvTGF0MScsXG4gICAgb19sb25fMjogJ29Mb25nMicsXG4gICAgb19sYXRfMjogJ29MYXQyJ1xuICB9XG59O1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwIHx8IDA7XG4gIHRoaXMudGl0bGUgPSB0aGlzLnRpdGxlIHx8ICdHZW5lcmFsIE9ibGlxdWUgVHJhbnNmb3JtYXRpb24nO1xuICB0aGlzLmlzSWRlbnRpdHkgPSBsb25nTGF0TmFtZXMuaW5jbHVkZXModGhpcy5vX3Byb2opO1xuXG4gIC8qKiBWZXJpZnkgcmVxdWlyZWQgcGFyYW1ldGVycyBleGlzdCAqL1xuICBpZiAoIXRoaXMub19wcm9qKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHBhcmFtZXRlcjogb19wcm9qJyk7XG4gIH1cblxuICBpZiAodGhpcy5vX3Byb2ogPT09IGBvYl90cmFuYCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3Igb19wcm9qOiAnICsgdGhpcy5vX3Byb2opO1xuICB9XG5cbiAgY29uc3QgbmV3UHJvalN0ciA9IHRoaXMucHJvalN0ci5yZXBsYWNlKCcrcHJvaj1vYl90cmFuJywgJycpLnJlcGxhY2UoJytvX3Byb2o9JywgJytwcm9qPScpLnRyaW0oKTtcblxuICAvKiogQHR5cGUge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSAqL1xuICBjb25zdCBvUHJvaiA9IFByb2oobmV3UHJvalN0cik7XG4gIGlmICghb1Byb2opIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyOiBvX3Byb2ouIFVua25vd24gcHJvamVjdGlvbiAnICsgdGhpcy5vX3Byb2opO1xuICB9XG4gIG9Qcm9qLmxvbmcwID0gMDsgLy8gd2UgaGFuZGxlIGxvbmcwIGJlZm9yZS9hZnRlciBmb3J3YXJkL2ludmVyc2VcbiAgdGhpcy5vYmxpcXVlUHJvamVjdGlvbiA9IG9Qcm9qO1xuXG4gIGxldCBtYXRjaGVkU2V0O1xuICBjb25zdCBwYXJhbVNldHNLZXlzID0gT2JqZWN0LmtleXMocGFyYW1TZXRzKTtcblxuICAvKipcbiAgICogcGFyc2Ugc3RyaW5ncywgY29udmVydCB0byByYWRpYW5zLCB0aHJvdyBvbiBOYU5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybnMge251bWJlciB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGNvbnN0IHBhcnNlUGFyYW0gPSAobmFtZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgdGhpc1tuYW1lXSA9PT0gYHVuZGVmaW5lZGApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IHZhbCA9IHBhcnNlRmxvYXQodGhpc1tuYW1lXSkgKiBEMlI7XG4gICAgaWYgKGlzTmFOKHZhbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3IgJyArIG5hbWUgKyAnOiAnICsgdGhpc1tuYW1lXSk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG4gIH07XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJhbVNldHNLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2V0S2V5ID0gcGFyYW1TZXRzS2V5c1tpXTtcbiAgICBjb25zdCBzZXQgPSBwYXJhbVNldHNbc2V0S2V5XTtcbiAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuZW50cmllcyhzZXQpO1xuICAgIGNvbnN0IHNldEhhc1BhcmFtcyA9IHBhcmFtcy5zb21lKFxuICAgICAgKFtwXSkgPT4gdHlwZW9mIHRoaXNbcF0gIT09ICd1bmRlZmluZWQnXG4gICAgKTtcbiAgICBpZiAoIXNldEhhc1BhcmFtcykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIG1hdGNoZWRTZXQgPSBzZXQ7XG4gICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IHBhcmFtcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIGNvbnN0IFtpbnB1dFBhcmFtLCBwYXJhbV0gPSBwYXJhbXNbaWldO1xuICAgICAgY29uc3QgdmFsID0gcGFyc2VQYXJhbShpbnB1dFBhcmFtKTtcbiAgICAgIGlmICh0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcGFyYW1ldGVyOiAnICsgaW5wdXRQYXJhbSArICcuJyk7XG4gICAgICB9XG4gICAgICB0aGlzW3BhcmFtXSA9IHZhbDtcbiAgICB9XG4gICAgYnJlYWs7XG4gIH1cblxuICBpZiAoIW1hdGNoZWRTZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHZhbGlkIHBhcmFtZXRlcnMgcHJvdmlkZWQgZm9yIG9iX3RyYW4gcHJvamVjdGlvbi4nKTtcbiAgfVxuXG4gIGNvbnN0IHsgbGFtcCwgcGhpcCB9ID0gY3JlYXRlUm90YXRpb24odGhpcywgbWF0Y2hlZFNldCk7XG4gIHRoaXMubGFtcCA9IGxhbXA7XG5cbiAgaWYgKE1hdGguYWJzKHBoaXApID4gRVBTTE4pIHtcbiAgICB0aGlzLmNwaGlwID0gTWF0aC5jb3MocGhpcCk7XG4gICAgdGhpcy5zcGhpcCA9IE1hdGguc2luKHBoaXApO1xuICAgIHRoaXMucHJvamVjdGlvblR5cGUgPSBwcm9qZWN0aW9uVHlwZS5PQkxJUVVFO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucHJvamVjdGlvblR5cGUgPSBwcm9qZWN0aW9uVHlwZS5UUkFOU1ZFUlNFO1xuICB9XG59XG5cbi8vIG9iX3RyYW4gZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgKGxhdCxsb25nKSB0byAoeCx5KVxuLy8gdHJhbnN2ZXJzZSAoOTAgZGVncmVlcyBmcm9tIG5vcm1hbCBvcmllbnRhdGlvbikgLSBmb3J3YXJkVHJhbnN2ZXJzZVxuLy8gb3Igb2JsaXF1ZSAoYXJiaXRyYXJ5IGFuZ2xlKSB1c2VkIGJhc2VkIG9uIHBhcmFtZXRlcnMgLSBmb3J3YXJkT2JsaXF1ZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHJldHVybiB0aGlzLnByb2plY3Rpb25UeXBlLmZvcndhcmQodGhpcywgcCk7XG59XG5cbi8vIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nICh4LHkpIHRvIChsYXQsbG9uZylcbi8vIHRyYW5zdmVyc2U6IGludmVyc2VUcmFuc3ZlcnNlXG4vLyBvYmxpcXVlOiBpbnZlcnNlT2JsaXF1ZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHJldHVybiB0aGlzLnByb2plY3Rpb25UeXBlLmludmVyc2UodGhpcywgcCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gcGFyYW1zIC0gSW5pdGlhbGl6ZWQgcHJvamVjdGlvbiBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gaG93IC0gVHJhbnNmb3JtYXRpb24gbWV0aG9kXG4gKiBAcmV0dXJucyB7e3BoaXA6IG51bWJlciwgbGFtcDogbnVtYmVyfX1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUm90YXRpb24ocGFyYW1zLCBob3cpIHtcbiAgbGV0IHBoaXAsIGxhbXA7XG4gIGlmIChob3cgPT09IHBhcmFtU2V0cy5ST1RBVEUpIHtcbiAgICBsZXQgbGFtYyA9IHBhcmFtcy5vTG9uZ0M7XG4gICAgbGV0IHBoaWMgPSBwYXJhbXMub0xhdEM7XG4gICAgbGV0IGFscGhhID0gcGFyYW1zLm9BbHBoYTtcbiAgICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMocGhpYykgLSBIQUxGX1BJKSA8PSBFUFNMTikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBvX2xhdF9jOiAnICsgcGFyYW1zLm9fbGF0X2MgKyAnIHNob3VsZCBiZSA8IDkwwrAnKTtcbiAgICB9XG4gICAgbGFtcCA9IGxhbWMgKyBNYXRoLmF0YW4yKC0xICogTWF0aC5jb3MoYWxwaGEpLCAtMSAqIE1hdGguc2luKGFscGhhKSAqIE1hdGguc2luKHBoaWMpKTtcbiAgICBwaGlwID0gTWF0aC5hc2luKE1hdGguY29zKHBoaWMpICogTWF0aC5zaW4oYWxwaGEpKTtcbiAgfSBlbHNlIGlmIChob3cgPT09IHBhcmFtU2V0cy5ORVdfUE9MRSkge1xuICAgIGxhbXAgPSBwYXJhbXMub0xvbmdQO1xuICAgIHBoaXAgPSBwYXJhbXMub0xhdFA7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGxhbTEgPSBwYXJhbXMub0xvbmcxO1xuICAgIGxldCBwaGkxID0gcGFyYW1zLm9MYXQxO1xuICAgIGxldCBsYW0yID0gcGFyYW1zLm9Mb25nMjtcbiAgICBsZXQgcGhpMiA9IHBhcmFtcy5vTGF0MjtcbiAgICBsZXQgY29uID0gTWF0aC5hYnMocGhpMSk7XG5cbiAgICBpZiAoTWF0aC5hYnMocGhpMSkgPiBIQUxGX1BJIC0gRVBTTE4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3Igb19sYXRfMTogJyArIHBhcmFtcy5vX2xhdF8xICsgJyBzaG91bGQgYmUgPCA5MMKwJyk7XG4gICAgfVxuXG4gICAgaWYgKE1hdGguYWJzKHBoaTIpID4gSEFMRl9QSSAtIEVQU0xOKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9fbGF0XzI6ICcgKyBwYXJhbXMub19sYXRfMiArICcgc2hvdWxkIGJlIDwgOTDCsCcpO1xuICAgIH1cblxuICAgIGlmIChNYXRoLmFicyhwaGkxIC0gcGhpMikgPCBFUFNMTikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBvX2xhdF8xIGFuZCBvX2xhdF8yOiBvX2xhdF8xIHNob3VsZCBiZSBkaWZmZXJlbnQgZnJvbSBvX2xhdF8yJyk7XG4gICAgfVxuICAgIGlmIChjb24gPCBFUFNMTikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBvX2xhdF8xOiBvX2xhdF8xIHNob3VsZCBiZSBkaWZmZXJlbnQgZnJvbSB6ZXJvJyk7XG4gICAgfVxuXG4gICAgbGFtcCA9IE1hdGguYXRhbjIoXG4gICAgICAoTWF0aC5jb3MocGhpMSkgKiBNYXRoLnNpbihwaGkyKSAqIE1hdGguY29zKGxhbTEpKVxuICAgICAgLSAoTWF0aC5zaW4ocGhpMSkgKiBNYXRoLmNvcyhwaGkyKSAqIE1hdGguY29zKGxhbTIpKSxcbiAgICAgIChNYXRoLnNpbihwaGkxKSAqIE1hdGguY29zKHBoaTIpICogTWF0aC5zaW4obGFtMikpXG4gICAgICAtIChNYXRoLmNvcyhwaGkxKSAqIE1hdGguc2luKHBoaTIpICogTWF0aC5zaW4obGFtMSkpXG4gICAgKTtcblxuICAgIHBoaXAgPSBNYXRoLmF0YW4oLTEgKiBNYXRoLmNvcyhsYW1wIC0gbGFtMSkgLyBNYXRoLnRhbihwaGkxKSk7XG4gIH1cblxuICByZXR1cm4geyBsYW1wLCBwaGlwIH07XG59XG5cbi8qKlxuICogRm9yd2FyZCAobG5nLCBsYXQpIHRvICh4LCB5KSBmb3Igb2JsaXF1ZSBjYXNlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSBzZWxmXG4gKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IGxwIC0gbGFtYmRhLCBwaGlcbiAqL1xuZnVuY3Rpb24gZm9yd2FyZE9ibGlxdWUoc2VsZiwgbHApIHtcbiAgbGV0IHsgeDogbGFtLCB5OiBwaGkgfSA9IGxwO1xuICBsYW0gKz0gc2VsZi5sb25nMDtcbiAgY29uc3QgY29zbGFtID0gTWF0aC5jb3MobGFtKTtcbiAgY29uc3Qgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgY29uc3QgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcblxuICBscC54ID0gYWRqdXN0X2xvbihcbiAgICBNYXRoLmF0YW4yKFxuICAgICAgY29zcGhpICogTWF0aC5zaW4obGFtKSxcbiAgICAgIChzZWxmLnNwaGlwICogY29zcGhpICogY29zbGFtKSArIChzZWxmLmNwaGlwICogc2lucGhpKVxuICAgICkgKyBzZWxmLmxhbXBcbiAgKTtcbiAgbHAueSA9IE1hdGguYXNpbihcbiAgICAoc2VsZi5zcGhpcCAqIHNpbnBoaSkgLSAoc2VsZi5jcGhpcCAqIGNvc3BoaSAqIGNvc2xhbSlcbiAgKTtcblxuICBjb25zdCByZXN1bHQgPSBzZWxmLm9ibGlxdWVQcm9qZWN0aW9uLmZvcndhcmQobHApO1xuICBpZiAoc2VsZi5pc0lkZW50aXR5KSB7XG4gICAgcmVzdWx0LnggKj0gUjJEO1xuICAgIHJlc3VsdC55ICo9IFIyRDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZvcndhcmQgKGxuZywgbGF0KSB0byAoeCwgeSkgZm9yIHRyYW5zdmVyc2UgY2FzZVxuICogQHBhcmFtIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gc2VsZlxuICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSBscCAtIGxhbWJkYSwgcGhpXG4gKi9cbmZ1bmN0aW9uIGZvcndhcmRUcmFuc3ZlcnNlKHNlbGYsIGxwKSB7XG4gIGxldCB7IHg6IGxhbSwgeTogcGhpIH0gPSBscDtcbiAgbGFtICs9IHNlbGYubG9uZzA7XG4gIGNvbnN0IGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gIGNvbnN0IGNvc2xhbSA9IE1hdGguY29zKGxhbSk7XG4gIGxwLnggPSBhZGp1c3RfbG9uKFxuICAgIE1hdGguYXRhbjIoXG4gICAgICBjb3NwaGkgKiBNYXRoLnNpbihsYW0pLFxuICAgICAgTWF0aC5zaW4ocGhpKVxuICAgICkgKyBzZWxmLmxhbXBcbiAgKTtcbiAgbHAueSA9IE1hdGguYXNpbigtMSAqIGNvc3BoaSAqIGNvc2xhbSk7XG5cbiAgY29uc3QgcmVzdWx0ID0gc2VsZi5vYmxpcXVlUHJvamVjdGlvbi5mb3J3YXJkKGxwKTtcblxuICBpZiAoc2VsZi5pc0lkZW50aXR5KSB7XG4gICAgcmVzdWx0LnggKj0gUjJEO1xuICAgIHJlc3VsdC55ICo9IFIyRDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEludmVyc2UgKHgsIHkpIHRvIChsbmcsIGxhdCkgZm9yIG9ibGlxdWUgY2FzZVxuICogQHBhcmFtIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gc2VsZlxuICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSBscCAtIGxhbWJkYSwgcGhpXG4gKi9cbmZ1bmN0aW9uIGludmVyc2VPYmxpcXVlKHNlbGYsIGxwKSB7XG4gIGlmIChzZWxmLmlzSWRlbnRpdHkpIHtcbiAgICBscC54ICo9IEQyUjtcbiAgICBscC55ICo9IEQyUjtcbiAgfVxuXG4gIGNvbnN0IGlubmVyTHAgPSBzZWxmLm9ibGlxdWVQcm9qZWN0aW9uLmludmVyc2UobHApO1xuICBsZXQgeyB4OiBsYW0sIHk6IHBoaSB9ID0gaW5uZXJMcDtcblxuICBpZiAobGFtIDwgTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgIGxhbSAtPSBzZWxmLmxhbXA7XG4gICAgY29uc3QgY29zbGFtID0gTWF0aC5jb3MobGFtKTtcbiAgICBjb25zdCBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIGNvbnN0IGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgbHAueCA9IE1hdGguYXRhbjIoXG4gICAgICBjb3NwaGkgKiBNYXRoLnNpbihsYW0pLFxuICAgICAgKHNlbGYuc3BoaXAgKiBjb3NwaGkgKiBjb3NsYW0pIC0gKHNlbGYuY3BoaXAgKiBzaW5waGkpXG4gICAgKTtcbiAgICBscC55ID0gTWF0aC5hc2luKFxuICAgICAgKHNlbGYuc3BoaXAgKiBzaW5waGkpICsgKHNlbGYuY3BoaXAgKiBjb3NwaGkgKiBjb3NsYW0pXG4gICAgKTtcbiAgfVxuXG4gIGxwLnggPSBhZGp1c3RfbG9uKGxwLnggKyBzZWxmLmxvbmcwKTtcbiAgcmV0dXJuIGxwO1xufVxuXG4vKipcbiAqIEludmVyc2UgKHgsIHkpIHRvIChsbmcsIGxhdCkgZm9yIHRyYW5zdmVyc2UgY2FzZVxuICogQHBhcmFtIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gc2VsZlxuICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSBscCAtIGxhbWJkYSwgcGhpXG4gKi9cbmZ1bmN0aW9uIGludmVyc2VUcmFuc3ZlcnNlKHNlbGYsIGxwKSB7XG4gIGlmIChzZWxmLmlzSWRlbnRpdHkpIHtcbiAgICBscC54ICo9IEQyUjtcbiAgICBscC55ICo9IEQyUjtcbiAgfVxuXG4gIGNvbnN0IGlubmVyTHAgPSBzZWxmLm9ibGlxdWVQcm9qZWN0aW9uLmludmVyc2UobHApO1xuICBsZXQgeyB4OiBsYW0sIHk6IHBoaSB9ID0gaW5uZXJMcDtcblxuICBpZiAobGFtIDwgTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgIGNvbnN0IGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgbGFtIC09IHNlbGYubGFtcDtcbiAgICBscC54ID0gTWF0aC5hdGFuMihcbiAgICAgIGNvc3BoaSAqIE1hdGguc2luKGxhbSksXG4gICAgICAtMSAqIE1hdGguc2luKHBoaSlcbiAgICApO1xuICAgIGxwLnkgPSBNYXRoLmFzaW4oXG4gICAgICBjb3NwaGkgKiBNYXRoLmNvcyhsYW0pXG4gICAgKTtcbiAgfVxuXG4gIGxwLnggPSBhZGp1c3RfbG9uKGxwLnggKyBzZWxmLmxvbmcwKTtcbiAgcmV0dXJuIGxwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydHZW5lcmFsIE9ibGlxdWUgVHJhbnNmb3JtYXRpb24nLCAnR2VuZXJhbF9PYmxpcXVlX1RyYW5zZm9ybWF0aW9uJywgJ29iX3RyYW4nXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHRzZm56IGZyb20gJy4uL2NvbW1vbi90c2Zueic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgcGhpMnogZnJvbSAnLi4vY29tbW9uL3BoaTJ6JztcbmltcG9ydCB7IEVQU0xOLCBIQUxGX1BJLCBUV09fUEksIEZPUlRQSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IHsgZ2V0Tm9ybWFsaXplZFByb2pOYW1lIH0gZnJvbSAnLi4vcHJvamVjdGlvbnMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtib29sZWFufSBub19vZmZcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbm9fcm90XG4gKiBAcHJvcGVydHkge251bWJlcn0gcmVjdGlmaWVkX2dyaWRfYW5nbGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IEFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCXG4gKiBAcHJvcGVydHkge251bWJlcn0gRVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsYW0wXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luZ2FtXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zZ2FtXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2lucm90XG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zcm90XG4gKiBAcHJvcGVydHkge251bWJlcn0gckJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBBckJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCckFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB1XzBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB2X3BvbGVfblxuICogQHByb3BlcnR5IHtudW1iZXJ9IHZfcG9sZV9zXG4gKi9cblxudmFyIFRPTCA9IDFlLTc7XG5cbmZ1bmN0aW9uIGlzVHlwZUEoUCkge1xuICB2YXIgdHlwZUFQcm9qZWN0aW9ucyA9IFsnSG90aW5lX09ibGlxdWVfTWVyY2F0b3InLCAnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfdmFyaWFudF9BJywgJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yX0F6aW11dGhfTmF0dXJhbF9PcmlnaW4nXTtcbiAgdmFyIHByb2plY3Rpb25OYW1lID0gdHlwZW9mIFAucHJvak5hbWUgPT09ICdvYmplY3QnID8gT2JqZWN0LmtleXMoUC5wcm9qTmFtZSlbMF0gOiBQLnByb2pOYW1lO1xuXG4gIHJldHVybiAnbm9fdW9mZicgaW4gUCB8fCAnbm9fb2ZmJyBpbiBQIHx8IHR5cGVBUHJvamVjdGlvbnMuaW5kZXhPZihwcm9qZWN0aW9uTmFtZSkgIT09IC0xIHx8IHR5cGVBUHJvamVjdGlvbnMuaW5kZXhPZihnZXROb3JtYWxpemVkUHJvak5hbWUocHJvamVjdGlvbk5hbWUpKSAhPT0gLTE7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgT2JsaXF1ZSBNZXJjYXRvciAgcHJvamVjdGlvblxuICogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIGNvbiwgY29tLCBjb3NwaDAsIEQsIEYsIEgsIEwsIHNpbnBoMCwgcCwgSiwgZ2FtbWEgPSAwLFxuICAgIGdhbW1hMCwgbGFtYyA9IDAsIGxhbTEgPSAwLCBsYW0yID0gMCwgcGhpMSA9IDAsIHBoaTIgPSAwLCBhbHBoYV9jID0gMDtcblxuICAvLyBvbmx5IFR5cGUgQSB1c2VzIHRoZSBub19vZmYgb3Igbm9fdW9mZiBwcm9wZXJ0eVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vcHJvai40L2lzc3Vlcy8xMDRcbiAgdGhpcy5ub19vZmYgPSBpc1R5cGVBKHRoaXMpO1xuICB0aGlzLm5vX3JvdCA9ICdub19yb3QnIGluIHRoaXM7XG5cbiAgdmFyIGFscCA9IGZhbHNlO1xuICBpZiAoJ2FscGhhJyBpbiB0aGlzKSB7XG4gICAgYWxwID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBnYW0gPSBmYWxzZTtcbiAgaWYgKCdyZWN0aWZpZWRfZ3JpZF9hbmdsZScgaW4gdGhpcykge1xuICAgIGdhbSA9IHRydWU7XG4gIH1cblxuICBpZiAoYWxwKSB7XG4gICAgYWxwaGFfYyA9IHRoaXMuYWxwaGE7XG4gIH1cblxuICBpZiAoZ2FtKSB7XG4gICAgZ2FtbWEgPSB0aGlzLnJlY3RpZmllZF9ncmlkX2FuZ2xlO1xuICB9XG5cbiAgaWYgKGFscCB8fCBnYW0pIHtcbiAgICBsYW1jID0gdGhpcy5sb25nYztcbiAgfSBlbHNlIHtcbiAgICBsYW0xID0gdGhpcy5sb25nMTtcbiAgICBwaGkxID0gdGhpcy5sYXQxO1xuICAgIGxhbTIgPSB0aGlzLmxvbmcyO1xuICAgIHBoaTIgPSB0aGlzLmxhdDI7XG5cbiAgICBpZiAoTWF0aC5hYnMocGhpMSAtIHBoaTIpIDw9IFRPTCB8fCAoY29uID0gTWF0aC5hYnMocGhpMSkpIDw9IFRPTFxuICAgICAgfHwgTWF0aC5hYnMoY29uIC0gSEFMRl9QSSkgPD0gVE9MIHx8IE1hdGguYWJzKE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJKSA8PSBUT0xcbiAgICAgIHx8IE1hdGguYWJzKE1hdGguYWJzKHBoaTIpIC0gSEFMRl9QSSkgPD0gVE9MKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICB2YXIgb25lX2VzID0gMS4wIC0gdGhpcy5lcztcbiAgY29tID0gTWF0aC5zcXJ0KG9uZV9lcyk7XG5cbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MCkgPiBFUFNMTikge1xuICAgIHNpbnBoMCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gICAgY29zcGgwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgICBjb24gPSAxIC0gdGhpcy5lcyAqIHNpbnBoMCAqIHNpbnBoMDtcbiAgICB0aGlzLkIgPSBjb3NwaDAgKiBjb3NwaDA7XG4gICAgdGhpcy5CID0gTWF0aC5zcXJ0KDEgKyB0aGlzLmVzICogdGhpcy5CICogdGhpcy5CIC8gb25lX2VzKTtcbiAgICB0aGlzLkEgPSB0aGlzLkIgKiB0aGlzLmswICogY29tIC8gY29uO1xuICAgIEQgPSB0aGlzLkIgKiBjb20gLyAoY29zcGgwICogTWF0aC5zcXJ0KGNvbikpO1xuICAgIEYgPSBEICogRCAtIDE7XG5cbiAgICBpZiAoRiA8PSAwKSB7XG4gICAgICBGID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgRiA9IE1hdGguc3FydChGKTtcbiAgICAgIGlmICh0aGlzLmxhdDAgPCAwKSB7XG4gICAgICAgIEYgPSAtRjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLkUgPSBGICs9IEQ7XG4gICAgdGhpcy5FICo9IE1hdGgucG93KHRzZm56KHRoaXMuZSwgdGhpcy5sYXQwLCBzaW5waDApLCB0aGlzLkIpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuQiA9IDEgLyBjb207XG4gICAgdGhpcy5BID0gdGhpcy5rMDtcbiAgICB0aGlzLkUgPSBEID0gRiA9IDE7XG4gIH1cblxuICBpZiAoYWxwIHx8IGdhbSkge1xuICAgIGlmIChhbHApIHtcbiAgICAgIGdhbW1hMCA9IE1hdGguYXNpbihNYXRoLnNpbihhbHBoYV9jKSAvIEQpO1xuICAgICAgaWYgKCFnYW0pIHtcbiAgICAgICAgZ2FtbWEgPSBhbHBoYV9jO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBnYW1tYTAgPSBnYW1tYTtcbiAgICAgIGFscGhhX2MgPSBNYXRoLmFzaW4oRCAqIE1hdGguc2luKGdhbW1hMCkpO1xuICAgIH1cbiAgICB0aGlzLmxhbTAgPSBsYW1jIC0gTWF0aC5hc2luKDAuNSAqIChGIC0gMSAvIEYpICogTWF0aC50YW4oZ2FtbWEwKSkgLyB0aGlzLkI7XG4gIH0gZWxzZSB7XG4gICAgSCA9IE1hdGgucG93KHRzZm56KHRoaXMuZSwgcGhpMSwgTWF0aC5zaW4ocGhpMSkpLCB0aGlzLkIpO1xuICAgIEwgPSBNYXRoLnBvdyh0c2Zueih0aGlzLmUsIHBoaTIsIE1hdGguc2luKHBoaTIpKSwgdGhpcy5CKTtcbiAgICBGID0gdGhpcy5FIC8gSDtcbiAgICBwID0gKEwgLSBIKSAvIChMICsgSCk7XG4gICAgSiA9IHRoaXMuRSAqIHRoaXMuRTtcbiAgICBKID0gKEogLSBMICogSCkgLyAoSiArIEwgKiBIKTtcbiAgICBjb24gPSBsYW0xIC0gbGFtMjtcblxuICAgIGlmIChjb24gPCAtTWF0aC5QSSkge1xuICAgICAgbGFtMiAtPSBUV09fUEk7XG4gICAgfSBlbHNlIGlmIChjb24gPiBNYXRoLlBJKSB7XG4gICAgICBsYW0yICs9IFRXT19QSTtcbiAgICB9XG5cbiAgICB0aGlzLmxhbTAgPSBhZGp1c3RfbG9uKDAuNSAqIChsYW0xICsgbGFtMikgLSBNYXRoLmF0YW4oSiAqIE1hdGgudGFuKDAuNSAqIHRoaXMuQiAqIChsYW0xIC0gbGFtMikpIC8gcCkgLyB0aGlzLkIsIHRoaXMub3Zlcik7XG4gICAgZ2FtbWEwID0gTWF0aC5hdGFuKDIgKiBNYXRoLnNpbih0aGlzLkIgKiBhZGp1c3RfbG9uKGxhbTEgLSB0aGlzLmxhbTAsIHRoaXMub3ZlcikpIC8gKEYgLSAxIC8gRikpO1xuICAgIGdhbW1hID0gYWxwaGFfYyA9IE1hdGguYXNpbihEICogTWF0aC5zaW4oZ2FtbWEwKSk7XG4gIH1cblxuICB0aGlzLnNpbmdhbSA9IE1hdGguc2luKGdhbW1hMCk7XG4gIHRoaXMuY29zZ2FtID0gTWF0aC5jb3MoZ2FtbWEwKTtcbiAgdGhpcy5zaW5yb3QgPSBNYXRoLnNpbihnYW1tYSk7XG4gIHRoaXMuY29zcm90ID0gTWF0aC5jb3MoZ2FtbWEpO1xuXG4gIHRoaXMuckIgPSAxIC8gdGhpcy5CO1xuICB0aGlzLkFyQiA9IHRoaXMuQSAqIHRoaXMuckI7XG4gIHRoaXMuQnJBID0gMSAvIHRoaXMuQXJCO1xuXG4gIGlmICh0aGlzLm5vX29mZikge1xuICAgIHRoaXMudV8wID0gMDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVfMCA9IE1hdGguYWJzKHRoaXMuQXJCICogTWF0aC5hdGFuKE1hdGguc3FydChEICogRCAtIDEpIC8gTWF0aC5jb3MoYWxwaGFfYykpKTtcblxuICAgIGlmICh0aGlzLmxhdDAgPCAwKSB7XG4gICAgICB0aGlzLnVfMCA9IC10aGlzLnVfMDtcbiAgICB9XG4gIH1cblxuICBGID0gMC41ICogZ2FtbWEwO1xuICB0aGlzLnZfcG9sZV9uID0gdGhpcy5BckIgKiBNYXRoLmxvZyhNYXRoLnRhbihGT1JUUEkgLSBGKSk7XG4gIHRoaXMudl9wb2xlX3MgPSB0aGlzLkFyQiAqIE1hdGgubG9nKE1hdGgudGFuKEZPUlRQSSArIEYpKTtcbn1cblxuLyogT2JsaXF1ZSBNZXJjYXRvciBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBjb29yZHMgPSB7fTtcbiAgdmFyIFMsIFQsIFUsIFYsIFcsIHRlbXAsIHUsIHY7XG4gIHAueCA9IHAueCAtIHRoaXMubGFtMDtcblxuICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMocC55KSAtIEhBTEZfUEkpID4gRVBTTE4pIHtcbiAgICBXID0gdGhpcy5FIC8gTWF0aC5wb3codHNmbnoodGhpcy5lLCBwLnksIE1hdGguc2luKHAueSkpLCB0aGlzLkIpO1xuXG4gICAgdGVtcCA9IDEgLyBXO1xuICAgIFMgPSAwLjUgKiAoVyAtIHRlbXApO1xuICAgIFQgPSAwLjUgKiAoVyArIHRlbXApO1xuICAgIFYgPSBNYXRoLnNpbih0aGlzLkIgKiBwLngpO1xuICAgIFUgPSAoUyAqIHRoaXMuc2luZ2FtIC0gViAqIHRoaXMuY29zZ2FtKSAvIFQ7XG5cbiAgICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMoVSkgLSAxLjApIDwgRVBTTE4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cblxuICAgIHYgPSAwLjUgKiB0aGlzLkFyQiAqIE1hdGgubG9nKCgxIC0gVSkgLyAoMSArIFUpKTtcbiAgICB0ZW1wID0gTWF0aC5jb3ModGhpcy5CICogcC54KTtcblxuICAgIGlmIChNYXRoLmFicyh0ZW1wKSA8IFRPTCkge1xuICAgICAgdSA9IHRoaXMuQSAqIHAueDtcbiAgICB9IGVsc2Uge1xuICAgICAgdSA9IHRoaXMuQXJCICogTWF0aC5hdGFuMigoUyAqIHRoaXMuY29zZ2FtICsgViAqIHRoaXMuc2luZ2FtKSwgdGVtcCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHYgPSBwLnkgPiAwID8gdGhpcy52X3BvbGVfbiA6IHRoaXMudl9wb2xlX3M7XG4gICAgdSA9IHRoaXMuQXJCICogcC55O1xuICB9XG5cbiAgaWYgKHRoaXMubm9fcm90KSB7XG4gICAgY29vcmRzLnggPSB1O1xuICAgIGNvb3Jkcy55ID0gdjtcbiAgfSBlbHNlIHtcbiAgICB1IC09IHRoaXMudV8wO1xuICAgIGNvb3Jkcy54ID0gdiAqIHRoaXMuY29zcm90ICsgdSAqIHRoaXMuc2lucm90O1xuICAgIGNvb3Jkcy55ID0gdSAqIHRoaXMuY29zcm90IC0gdiAqIHRoaXMuc2lucm90O1xuICB9XG5cbiAgY29vcmRzLnggPSAodGhpcy5hICogY29vcmRzLnggKyB0aGlzLngwKTtcbiAgY29vcmRzLnkgPSAodGhpcy5hICogY29vcmRzLnkgKyB0aGlzLnkwKTtcblxuICByZXR1cm4gY29vcmRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciB1LCB2LCBRcCwgU3AsIFRwLCBWcCwgVXA7XG4gIHZhciBjb29yZHMgPSB7fTtcblxuICBwLnggPSAocC54IC0gdGhpcy54MCkgKiAoMS4wIC8gdGhpcy5hKTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApICogKDEuMCAvIHRoaXMuYSk7XG5cbiAgaWYgKHRoaXMubm9fcm90KSB7XG4gICAgdiA9IHAueTtcbiAgICB1ID0gcC54O1xuICB9IGVsc2Uge1xuICAgIHYgPSBwLnggKiB0aGlzLmNvc3JvdCAtIHAueSAqIHRoaXMuc2lucm90O1xuICAgIHUgPSBwLnkgKiB0aGlzLmNvc3JvdCArIHAueCAqIHRoaXMuc2lucm90ICsgdGhpcy51XzA7XG4gIH1cblxuICBRcCA9IE1hdGguZXhwKC10aGlzLkJyQSAqIHYpO1xuICBTcCA9IDAuNSAqIChRcCAtIDEgLyBRcCk7XG4gIFRwID0gMC41ICogKFFwICsgMSAvIFFwKTtcbiAgVnAgPSBNYXRoLnNpbih0aGlzLkJyQSAqIHUpO1xuICBVcCA9IChWcCAqIHRoaXMuY29zZ2FtICsgU3AgKiB0aGlzLnNpbmdhbSkgLyBUcDtcblxuICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMoVXApIC0gMSkgPCBFUFNMTikge1xuICAgIGNvb3Jkcy54ID0gMDtcbiAgICBjb29yZHMueSA9IFVwIDwgMCA/IC1IQUxGX1BJIDogSEFMRl9QSTtcbiAgfSBlbHNlIHtcbiAgICBjb29yZHMueSA9IHRoaXMuRSAvIE1hdGguc3FydCgoMSArIFVwKSAvICgxIC0gVXApKTtcbiAgICBjb29yZHMueSA9IHBoaTJ6KHRoaXMuZSwgTWF0aC5wb3coY29vcmRzLnksIDEgLyB0aGlzLkIpKTtcblxuICAgIGlmIChjb29yZHMueSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cblxuICAgIGNvb3Jkcy54ID0gLXRoaXMuckIgKiBNYXRoLmF0YW4yKChTcCAqIHRoaXMuY29zZ2FtIC0gVnAgKiB0aGlzLnNpbmdhbSksIE1hdGguY29zKHRoaXMuQnJBICogdSkpO1xuICB9XG5cbiAgY29vcmRzLnggKz0gdGhpcy5sYW0wO1xuXG4gIHJldHVybiBjb29yZHM7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yJywgJ0hvdGluZSBPYmxpcXVlIE1lcmNhdG9yJywgJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yX3ZhcmlhbnRfQScsICdIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl9WYXJpYW50X0InLCAnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfQXppbXV0aF9OYXR1cmFsX09yaWdpbicsICdIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl9Ud29fUG9pbnRfTmF0dXJhbF9PcmlnaW4nLCAnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfQXppbXV0aF9DZW50ZXInLCAnT2JsaXF1ZV9NZXJjYXRvcicsICdvbWVyYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcbmltcG9ydCB7IEVQU0xOLCBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luX3AxNFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc19wMTRcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIGRvdWJsZSB0ZW1wOyAgICAgIC8qIHRlbXBvcmFyeSB2YXJpYWJsZSAgICAqL1xuXG4gIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2VcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdGhpcy5zaW5fcDE0ID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgdGhpcy5jb3NfcDE0ID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbn1cblxuLyogT3J0aG9ncmFwaGljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgc2lucGhpLCBjb3NwaGk7IC8qIHNpbiBhbmQgY29zIHZhbHVlICAgICAgICAqL1xuICB2YXIgZGxvbjsgLyogZGVsdGEgbG9uZ2l0dWRlIHZhbHVlICAgICAgKi9cbiAgdmFyIGNvc2xvbjsgLyogY29zIG9mIGxvbmdpdHVkZSAgICAgICAgKi9cbiAgdmFyIGtzcDsgLyogc2NhbGUgZmFjdG9yICAgICAgICAgICovXG4gIHZhciBnLCB4LCB5O1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcblxuICBzaW5waGkgPSBNYXRoLnNpbihsYXQpO1xuICBjb3NwaGkgPSBNYXRoLmNvcyhsYXQpO1xuXG4gIGNvc2xvbiA9IE1hdGguY29zKGRsb24pO1xuICBnID0gdGhpcy5zaW5fcDE0ICogc2lucGhpICsgdGhpcy5jb3NfcDE0ICogY29zcGhpICogY29zbG9uO1xuICBrc3AgPSAxO1xuICBpZiAoKGcgPiAwKSB8fCAoTWF0aC5hYnMoZykgPD0gRVBTTE4pKSB7XG4gICAgeCA9IHRoaXMuYSAqIGtzcCAqIGNvc3BoaSAqIE1hdGguc2luKGRsb24pO1xuICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICoga3NwICogKHRoaXMuY29zX3AxNCAqIHNpbnBoaSAtIHRoaXMuc2luX3AxNCAqIGNvc3BoaSAqIGNvc2xvbik7XG4gIH1cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHJoOyAvKiBoZWlnaHQgYWJvdmUgZWxsaXBzb2lkICAgICAgKi9cbiAgdmFyIHo7IC8qIGFuZ2xlICAgICAgICAgICovXG4gIHZhciBzaW56LCBjb3N6OyAvKiBzaW4gb2YgeiBhbmQgY29zIG9mIHogICAgICAqL1xuICB2YXIgY29uO1xuICB2YXIgbG9uLCBsYXQ7XG4gIC8qIEludmVyc2UgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gIHogPSBhc2lueihyaCAvIHRoaXMuYSk7XG5cbiAgc2lueiA9IE1hdGguc2luKHopO1xuICBjb3N6ID0gTWF0aC5jb3Moeik7XG5cbiAgbG9uID0gdGhpcy5sb25nMDtcbiAgaWYgKE1hdGguYWJzKHJoKSA8PSBFUFNMTikge1xuICAgIGxhdCA9IHRoaXMubGF0MDtcbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9XG4gIGxhdCA9IGFzaW56KGNvc3ogKiB0aGlzLnNpbl9wMTQgKyAocC55ICogc2lueiAqIHRoaXMuY29zX3AxNCkgLyByaCk7XG4gIGNvbiA9IE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJO1xuICBpZiAoTWF0aC5hYnMoY29uKSA8PSBFUFNMTikge1xuICAgIGlmICh0aGlzLmxhdDAgPj0gMCkge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC1wLnkpLCB0aGlzLm92ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgLSBNYXRoLmF0YW4yKC1wLngsIHAueSksIHRoaXMub3Zlcik7XG4gICAgfVxuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMigocC54ICogc2lueiksIHJoICogdGhpcy5jb3NfcDE0ICogY29zeiAtIHAueSAqIHRoaXMuc2luX3AxNCAqIHNpbnopLCB0aGlzLm92ZXIpO1xuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ29ydGhvJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBlMGZuIGZyb20gJy4uL2NvbW1vbi9lMGZuJztcbmltcG9ydCBlMWZuIGZyb20gJy4uL2NvbW1vbi9lMWZuJztcbmltcG9ydCBlMmZuIGZyb20gJy4uL2NvbW1vbi9lMmZuJztcbmltcG9ydCBlM2ZuIGZyb20gJy4uL2NvbW1vbi9lM2ZuJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhZGp1c3RfbGF0IGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbGF0JztcbmltcG9ydCBtbGZuIGZyb20gJy4uL2NvbW1vbi9tbGZuJztcbmltcG9ydCB7IEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBnTiBmcm9tICcuLi9jb21tb24vZ04nO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRlbXBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUxXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlM1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG1sMFxuICovXG5cbnZhciBNQVhfSVRFUiA9IDIwO1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2VcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmVzID0gMSAtIE1hdGgucG93KHRoaXMudGVtcCwgMik7IC8vIGRldmFpdCBldHJlIGRhbnMgdG1lcmMuanMgbWFpcyBuIHkgZXN0IHBhcyBkb25jIGplIGNvbW1lbnRlIHNpbm9uIHJldG91ciBkZSB2YWxldXJzIG51bGxlc1xuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG4gIHRoaXMuZTAgPSBlMGZuKHRoaXMuZXMpO1xuICB0aGlzLmUxID0gZTFmbih0aGlzLmVzKTtcbiAgdGhpcy5lMiA9IGUyZm4odGhpcy5lcyk7XG4gIHRoaXMuZTMgPSBlM2ZuKHRoaXMuZXMpO1xuICB0aGlzLm1sMCA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQwKTsgLy8gc2kgcXVlIGRlcyB6ZXJvcyBsZSBjYWxjdWwgbmUgc2UgZmFpdCBwYXNcbn1cblxuLyogUG9seWNvbmljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgeCwgeSwgZWw7XG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICBlbCA9IGRsb24gKiBNYXRoLnNpbihsYXQpO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBpZiAoTWF0aC5hYnMobGF0KSA8PSBFUFNMTikge1xuICAgICAgeCA9IHRoaXMuYSAqIGRsb247XG4gICAgICB5ID0gLTEgKiB0aGlzLmEgKiB0aGlzLmxhdDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB0aGlzLmEgKiBNYXRoLnNpbihlbCkgLyBNYXRoLnRhbihsYXQpO1xuICAgICAgeSA9IHRoaXMuYSAqIChhZGp1c3RfbGF0KGxhdCAtIHRoaXMubGF0MCkgKyAoMSAtIE1hdGguY29zKGVsKSkgLyBNYXRoLnRhbihsYXQpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1hdGguYWJzKGxhdCkgPD0gRVBTTE4pIHtcbiAgICAgIHggPSB0aGlzLmEgKiBkbG9uO1xuICAgICAgeSA9IC0xICogdGhpcy5tbDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBubCA9IGdOKHRoaXMuYSwgdGhpcy5lLCBNYXRoLnNpbihsYXQpKSAvIE1hdGgudGFuKGxhdCk7XG4gICAgICB4ID0gbmwgKiBNYXRoLnNpbihlbCk7XG4gICAgICB5ID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCBsYXQpIC0gdGhpcy5tbDAgKyBubCAqICgxIC0gTWF0aC5jb3MoZWwpKTtcbiAgICB9XG4gIH1cbiAgcC54ID0geCArIHRoaXMueDA7XG4gIHAueSA9IHkgKyB0aGlzLnkwO1xuICByZXR1cm4gcDtcbn1cblxuLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIGxvbiwgbGF0LCB4LCB5LCBpO1xuICB2YXIgYWwsIGJsO1xuICB2YXIgcGhpLCBkcGhpO1xuICB4ID0gcC54IC0gdGhpcy54MDtcbiAgeSA9IHAueSAtIHRoaXMueTA7XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgaWYgKE1hdGguYWJzKHkgKyB0aGlzLmEgKiB0aGlzLmxhdDApIDw9IEVQU0xOKSB7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHggLyB0aGlzLmEgKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICAgICAgbGF0ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgYWwgPSB0aGlzLmxhdDAgKyB5IC8gdGhpcy5hO1xuICAgICAgYmwgPSB4ICogeCAvIHRoaXMuYSAvIHRoaXMuYSArIGFsICogYWw7XG4gICAgICBwaGkgPSBhbDtcbiAgICAgIHZhciB0YW5waGk7XG4gICAgICBmb3IgKGkgPSBNQVhfSVRFUjsgaTsgLS1pKSB7XG4gICAgICAgIHRhbnBoaSA9IE1hdGgudGFuKHBoaSk7XG4gICAgICAgIGRwaGkgPSAtMSAqIChhbCAqIChwaGkgKiB0YW5waGkgKyAxKSAtIHBoaSAtIDAuNSAqIChwaGkgKiBwaGkgKyBibCkgKiB0YW5waGkpIC8gKChwaGkgLSBhbCkgLyB0YW5waGkgLSAxKTtcbiAgICAgICAgcGhpICs9IGRwaGk7XG4gICAgICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSBFUFNMTikge1xuICAgICAgICAgIGxhdCA9IHBoaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKE1hdGguYXNpbih4ICogTWF0aC50YW4ocGhpKSAvIHRoaXMuYSkpIC8gTWF0aC5zaW4obGF0KSwgdGhpcy5vdmVyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1hdGguYWJzKHkgKyB0aGlzLm1sMCkgPD0gRVBTTE4pIHtcbiAgICAgIGxhdCA9IDA7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyB4IC8gdGhpcy5hLCB0aGlzLm92ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbCA9ICh0aGlzLm1sMCArIHkpIC8gdGhpcy5hO1xuICAgICAgYmwgPSB4ICogeCAvIHRoaXMuYSAvIHRoaXMuYSArIGFsICogYWw7XG4gICAgICBwaGkgPSBhbDtcbiAgICAgIHZhciBjbCwgbWxuLCBtbG5wLCBtYTtcbiAgICAgIHZhciBjb247XG4gICAgICBmb3IgKGkgPSBNQVhfSVRFUjsgaTsgLS1pKSB7XG4gICAgICAgIGNvbiA9IHRoaXMuZSAqIE1hdGguc2luKHBoaSk7XG4gICAgICAgIGNsID0gTWF0aC5zcXJ0KDEgLSBjb24gKiBjb24pICogTWF0aC50YW4ocGhpKTtcbiAgICAgICAgbWxuID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCBwaGkpO1xuICAgICAgICBtbG5wID0gdGhpcy5lMCAtIDIgKiB0aGlzLmUxICogTWF0aC5jb3MoMiAqIHBoaSkgKyA0ICogdGhpcy5lMiAqIE1hdGguY29zKDQgKiBwaGkpIC0gNiAqIHRoaXMuZTMgKiBNYXRoLmNvcyg2ICogcGhpKTtcbiAgICAgICAgbWEgPSBtbG4gLyB0aGlzLmE7XG4gICAgICAgIGRwaGkgPSAoYWwgKiAoY2wgKiBtYSArIDEpIC0gbWEgLSAwLjUgKiBjbCAqIChtYSAqIG1hICsgYmwpKSAvICh0aGlzLmVzICogTWF0aC5zaW4oMiAqIHBoaSkgKiAobWEgKiBtYSArIGJsIC0gMiAqIGFsICogbWEpIC8gKDQgKiBjbCkgKyAoYWwgLSBtYSkgKiAoY2wgKiBtbG5wIC0gMiAvIE1hdGguc2luKDIgKiBwaGkpKSAtIG1sbnApO1xuICAgICAgICBwaGkgLT0gZHBoaTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IEVQU0xOKSB7XG4gICAgICAgICAgbGF0ID0gcGhpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGxhdD1waGk0eih0aGlzLmUsdGhpcy5lMCx0aGlzLmUxLHRoaXMuZTIsdGhpcy5lMyxhbCxibCwwLDApO1xuICAgICAgY2wgPSBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBNYXRoLnBvdyhNYXRoLnNpbihsYXQpLCAyKSkgKiBNYXRoLnRhbihsYXQpO1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hc2luKHggKiBjbCAvIHRoaXMuYSkgLyBNYXRoLnNpbihsYXQpLCB0aGlzLm92ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnUG9seWNvbmljJywgJ0FtZXJpY2FuX1BvbHljb25pYycsICdwb2x5J107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIi8vIFFTQyBwcm9qZWN0aW9uIHJld3JpdHRlbiBmcm9tIHRoZSBvcmlnaW5hbCBQUk9KNFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL09TR2VvL3Byb2ouNC9ibG9iL21hc3Rlci9zcmMvUEpfcXNjLmNcblxuaW1wb3J0IHsgRVBTTE4sIFRXT19QSSwgU1BJLCBIQUxGX1BJLCBGT1JUUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBmYWNlXG4gKiBAcHJvcGVydHkge251bWJlcn0geDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5MFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gb25lX21pbnVzX2ZcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBvbmVfbWludXNfZl9zcXVhcmVkXG4gKi9cblxuLyogY29uc3RhbnRzICovXG52YXIgRkFDRV9FTlVNID0ge1xuICBGUk9OVDogMSxcbiAgUklHSFQ6IDIsXG4gIEJBQ0s6IDMsXG4gIExFRlQ6IDQsXG4gIFRPUDogNSxcbiAgQk9UVE9NOiA2XG59O1xuXG52YXIgQVJFQV9FTlVNID0ge1xuICBBUkVBXzA6IDEsXG4gIEFSRUFfMTogMixcbiAgQVJFQV8yOiAzLFxuICBBUkVBXzM6IDRcbn07XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy54MCA9IHRoaXMueDAgfHwgMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgfHwgMDtcbiAgdGhpcy5sYXQwID0gdGhpcy5sYXQwIHx8IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwIHx8IDA7XG4gIHRoaXMubGF0X3RzID0gdGhpcy5sYXRfdHMgfHwgMDtcbiAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGUgfHwgJ1F1YWRyaWxhdGVyYWxpemVkIFNwaGVyaWNhbCBDdWJlJztcblxuICAvKiBEZXRlcm1pbmUgdGhlIGN1YmUgZmFjZSBmcm9tIHRoZSBjZW50ZXIgb2YgcHJvamVjdGlvbi4gKi9cbiAgaWYgKHRoaXMubGF0MCA+PSBIQUxGX1BJIC0gRk9SVFBJIC8gMi4wKSB7XG4gICAgdGhpcy5mYWNlID0gRkFDRV9FTlVNLlRPUDtcbiAgfSBlbHNlIGlmICh0aGlzLmxhdDAgPD0gLShIQUxGX1BJIC0gRk9SVFBJIC8gMi4wKSkge1xuICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5CT1RUT007XG4gIH0gZWxzZSBpZiAoTWF0aC5hYnModGhpcy5sb25nMCkgPD0gRk9SVFBJKSB7XG4gICAgdGhpcy5mYWNlID0gRkFDRV9FTlVNLkZST05UO1xuICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMubG9uZzApIDw9IEhBTEZfUEkgKyBGT1JUUEkpIHtcbiAgICB0aGlzLmZhY2UgPSB0aGlzLmxvbmcwID4gMC4wID8gRkFDRV9FTlVNLlJJR0hUIDogRkFDRV9FTlVNLkxFRlQ7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5mYWNlID0gRkFDRV9FTlVNLkJBQ0s7XG4gIH1cblxuICAvKiBGaWxsIGluIHVzZWZ1bCB2YWx1ZXMgZm9yIHRoZSBlbGxpcHNvaWQgPC0+IHNwaGVyZSBzaGlmdFxuICAgKiBkZXNjcmliZWQgaW4gW0xLMTJdLiAqL1xuICBpZiAodGhpcy5lcyAhPT0gMCkge1xuICAgIHRoaXMub25lX21pbnVzX2YgPSAxIC0gKHRoaXMuYSAtIHRoaXMuYikgLyB0aGlzLmE7XG4gICAgdGhpcy5vbmVfbWludXNfZl9zcXVhcmVkID0gdGhpcy5vbmVfbWludXNfZiAqIHRoaXMub25lX21pbnVzX2Y7XG4gIH1cbn1cblxuLy8gUVNDIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHh5ID0geyB4OiAwLCB5OiAwIH07XG4gIHZhciBsYXQsIGxvbjtcbiAgdmFyIHRoZXRhLCBwaGk7XG4gIHZhciB0LCBtdTtcbiAgLyogbnU7ICovXG4gIHZhciBhcmVhID0geyB2YWx1ZTogMCB9O1xuXG4gIC8vIG1vdmUgbG9uIGFjY29yZGluZyB0byBwcm9qZWN0aW9uJ3MgbG9uXG4gIHAueCAtPSB0aGlzLmxvbmcwO1xuXG4gIC8qIENvbnZlcnQgdGhlIGdlb2RldGljIGxhdGl0dWRlIHRvIGEgZ2VvY2VudHJpYyBsYXRpdHVkZS5cbiAgICogVGhpcyBjb3JyZXNwb25kcyB0byB0aGUgc2hpZnQgZnJvbSB0aGUgZWxsaXBzb2lkIHRvIHRoZSBzcGhlcmVcbiAgICogZGVzY3JpYmVkIGluIFtMSzEyXS4gKi9cbiAgaWYgKHRoaXMuZXMgIT09IDApIHsgLy8gaWYgKFAtPmVzICE9IDApIHtcbiAgICBsYXQgPSBNYXRoLmF0YW4odGhpcy5vbmVfbWludXNfZl9zcXVhcmVkICogTWF0aC50YW4ocC55KSk7XG4gIH0gZWxzZSB7XG4gICAgbGF0ID0gcC55O1xuICB9XG5cbiAgLyogQ29udmVydCB0aGUgaW5wdXQgbGF0LCBsb24gaW50byB0aGV0YSwgcGhpIGFzIHVzZWQgYnkgUVNDLlxuICAgKiBUaGlzIGRlcGVuZHMgb24gdGhlIGN1YmUgZmFjZSBhbmQgdGhlIGFyZWEgb24gaXQuXG4gICAqIEZvciB0aGUgdG9wIGFuZCBib3R0b20gZmFjZSwgd2UgY2FuIGNvbXB1dGUgdGhldGEgYW5kIHBoaVxuICAgKiBkaXJlY3RseSBmcm9tIHBoaSwgbGFtLiBGb3IgdGhlIG90aGVyIGZhY2VzLCB3ZSBtdXN0IHVzZVxuICAgKiB1bml0IHNwaGVyZSBjYXJ0ZXNpYW4gY29vcmRpbmF0ZXMgYXMgYW4gaW50ZXJtZWRpYXRlIHN0ZXAuICovXG4gIGxvbiA9IHAueDsgLy8gbG9uID0gbHAubGFtO1xuICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uVE9QKSB7XG4gICAgcGhpID0gSEFMRl9QSSAtIGxhdDtcbiAgICBpZiAobG9uID49IEZPUlRQSSAmJiBsb24gPD0gSEFMRl9QSSArIEZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgICB0aGV0YSA9IGxvbiAtIEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmIChsb24gPiBIQUxGX1BJICsgRk9SVFBJIHx8IGxvbiA8PSAtKEhBTEZfUEkgKyBGT1JUUEkpKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcbiAgICAgIHRoZXRhID0gKGxvbiA+IDAuMCA/IGxvbiAtIFNQSSA6IGxvbiArIFNQSSk7XG4gICAgfSBlbHNlIGlmIChsb24gPiAtKEhBTEZfUEkgKyBGT1JUUEkpICYmIGxvbiA8PSAtRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMjtcbiAgICAgIHRoZXRhID0gbG9uICsgSEFMRl9QSTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgICB0aGV0YSA9IGxvbjtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQk9UVE9NKSB7XG4gICAgcGhpID0gSEFMRl9QSSArIGxhdDtcbiAgICBpZiAobG9uID49IEZPUlRQSSAmJiBsb24gPD0gSEFMRl9QSSArIEZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgICB0aGV0YSA9IC1sb24gKyBIQUxGX1BJO1xuICAgIH0gZWxzZSBpZiAobG9uIDwgRk9SVFBJICYmIGxvbiA+PSAtRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcbiAgICAgIHRoZXRhID0gLWxvbjtcbiAgICB9IGVsc2UgaWYgKGxvbiA8IC1GT1JUUEkgJiYgbG9uID49IC0oSEFMRl9QSSArIEZPUlRQSSkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8yO1xuICAgICAgdGhldGEgPSAtbG9uIC0gSEFMRl9QSTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgICB0aGV0YSA9IChsb24gPiAwLjAgPyAtbG9uICsgU1BJIDogLWxvbiAtIFNQSSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBxLCByLCBzO1xuICAgIHZhciBzaW5sYXQsIGNvc2xhdDtcbiAgICB2YXIgc2lubG9uLCBjb3Nsb247XG5cbiAgICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcbiAgICAgIGxvbiA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgK0hBTEZfUEkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgbG9uID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obG9uLCArU1BJKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkxFRlQpIHtcbiAgICAgIGxvbiA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgLUhBTEZfUEkpO1xuICAgIH1cbiAgICBzaW5sYXQgPSBNYXRoLnNpbihsYXQpO1xuICAgIGNvc2xhdCA9IE1hdGguY29zKGxhdCk7XG4gICAgc2lubG9uID0gTWF0aC5zaW4obG9uKTtcbiAgICBjb3Nsb24gPSBNYXRoLmNvcyhsb24pO1xuICAgIHEgPSBjb3NsYXQgKiBjb3Nsb247XG4gICAgciA9IGNvc2xhdCAqIHNpbmxvbjtcbiAgICBzID0gc2lubGF0O1xuXG4gICAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkZST05UKSB7XG4gICAgICBwaGkgPSBNYXRoLmFjb3MocSk7XG4gICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIHIsIGFyZWEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcbiAgICAgIHBoaSA9IE1hdGguYWNvcyhyKTtcbiAgICAgIHRoZXRhID0gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgcywgLXEsIGFyZWEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgcGhpID0gTWF0aC5hY29zKC1xKTtcbiAgICAgIHRoZXRhID0gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgcywgLXIsIGFyZWEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uTEVGVCkge1xuICAgICAgcGhpID0gTWF0aC5hY29zKC1yKTtcbiAgICAgIHRoZXRhID0gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgcywgcSwgYXJlYSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qIEltcG9zc2libGUgKi9cbiAgICAgIHBoaSA9IHRoZXRhID0gMDtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICAgIH1cbiAgfVxuXG4gIC8qIENvbXB1dGUgbXUgYW5kIG51IGZvciB0aGUgYXJlYSBvZiBkZWZpbml0aW9uLlxuICAgKiBGb3IgbXUsIHNlZSBFcS4gKDMtMjEpIGluIFtPTDc2XSwgYnV0IG5vdGUgdGhlIHR5cG9zOlxuICAgKiBjb21wYXJlIHdpdGggRXEuICgzLTE0KS4gRm9yIG51LCBzZWUgRXEuICgzLTM4KS4gKi9cbiAgbXUgPSBNYXRoLmF0YW4oKDEyIC8gU1BJKSAqICh0aGV0YSArIE1hdGguYWNvcyhNYXRoLnNpbih0aGV0YSkgKiBNYXRoLmNvcyhGT1JUUEkpKSAtIEhBTEZfUEkpKTtcbiAgdCA9IE1hdGguc3FydCgoMSAtIE1hdGguY29zKHBoaSkpIC8gKE1hdGguY29zKG11KSAqIE1hdGguY29zKG11KSkgLyAoMSAtIE1hdGguY29zKE1hdGguYXRhbigxIC8gTWF0aC5jb3ModGhldGEpKSkpKTtcblxuICAvKiBBcHBseSB0aGUgcmVzdWx0IHRvIHRoZSByZWFsIGFyZWEuICovXG4gIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG4gICAgbXUgKz0gSEFMRl9QSTtcbiAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8yKSB7XG4gICAgbXUgKz0gU1BJO1xuICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzMpIHtcbiAgICBtdSArPSAxLjUgKiBTUEk7XG4gIH1cblxuICAvKiBOb3cgY29tcHV0ZSB4LCB5IGZyb20gbXUgYW5kIG51ICovXG4gIHh5LnggPSB0ICogTWF0aC5jb3MobXUpO1xuICB4eS55ID0gdCAqIE1hdGguc2luKG11KTtcbiAgeHkueCA9IHh5LnggKiB0aGlzLmEgKyB0aGlzLngwO1xuICB4eS55ID0geHkueSAqIHRoaXMuYSArIHRoaXMueTA7XG5cbiAgcC54ID0geHkueDtcbiAgcC55ID0geHkueTtcbiAgcmV0dXJuIHA7XG59XG5cbi8vIFFTQyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBscCA9IHsgbGFtOiAwLCBwaGk6IDAgfTtcbiAgdmFyIG11LCBudSwgY29zbXUsIHRhbm51O1xuICB2YXIgdGFudGhldGEsIHRoZXRhLCBjb3NwaGksIHBoaTtcbiAgdmFyIHQ7XG4gIHZhciBhcmVhID0geyB2YWx1ZTogMCB9O1xuXG4gIC8qIGRlLW9mZnNldCAqL1xuICBwLnggPSAocC54IC0gdGhpcy54MCkgLyB0aGlzLmE7XG4gIHAueSA9IChwLnkgLSB0aGlzLnkwKSAvIHRoaXMuYTtcblxuICAvKiBDb252ZXJ0IHRoZSBpbnB1dCB4LCB5IHRvIHRoZSBtdSBhbmQgbnUgYW5nbGVzIGFzIHVzZWQgYnkgUVNDLlxuICAgKiBUaGlzIGRlcGVuZHMgb24gdGhlIGFyZWEgb2YgdGhlIGN1YmUgZmFjZS4gKi9cbiAgbnUgPSBNYXRoLmF0YW4oTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSkpO1xuICBtdSA9IE1hdGguYXRhbjIocC55LCBwLngpO1xuICBpZiAocC54ID49IDAuMCAmJiBwLnggPj0gTWF0aC5hYnMocC55KSkge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICB9IGVsc2UgaWYgKHAueSA+PSAwLjAgJiYgcC55ID49IE1hdGguYWJzKHAueCkpIHtcbiAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcbiAgICBtdSAtPSBIQUxGX1BJO1xuICB9IGVsc2UgaWYgKHAueCA8IDAuMCAmJiAtcC54ID49IE1hdGguYWJzKHAueSkpIHtcbiAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMjtcbiAgICBtdSA9IChtdSA8IDAuMCA/IG11ICsgU1BJIDogbXUgLSBTUEkpO1xuICB9IGVsc2Uge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8zO1xuICAgIG11ICs9IEhBTEZfUEk7XG4gIH1cblxuICAvKiBDb21wdXRlIHBoaSBhbmQgdGhldGEgZm9yIHRoZSBhcmVhIG9mIGRlZmluaXRpb24uXG4gICAqIFRoZSBpbnZlcnNlIHByb2plY3Rpb24gaXMgbm90IGRlc2NyaWJlZCBpbiB0aGUgb3JpZ2luYWwgcGFwZXIsIGJ1dCBzb21lXG4gICAqIGdvb2QgaGludHMgY2FuIGJlIGZvdW5kIGhlcmUgKGFzIG9mIDIwMTEtMTItMTQpOlxuICAgKiBodHRwOi8vZml0cy5nc2ZjLm5hc2EuZ292L2ZpdHNiaXRzL3NhZi45My9zYWYuOTMwMlxuICAgKiAoc2VhcmNoIGZvciBcIk1lc3NhZ2UtSWQ6IDw5MzAyMTgxNzU5LkFBMjU0NzcgYXQgZml0cy5jdi5ucmFvLmVkdT5cIikgKi9cbiAgdCA9IChTUEkgLyAxMikgKiBNYXRoLnRhbihtdSk7XG4gIHRhbnRoZXRhID0gTWF0aC5zaW4odCkgLyAoTWF0aC5jb3ModCkgLSAoMSAvIE1hdGguc3FydCgyKSkpO1xuICB0aGV0YSA9IE1hdGguYXRhbih0YW50aGV0YSk7XG4gIGNvc211ID0gTWF0aC5jb3MobXUpO1xuICB0YW5udSA9IE1hdGgudGFuKG51KTtcbiAgY29zcGhpID0gMSAtIGNvc211ICogY29zbXUgKiB0YW5udSAqIHRhbm51ICogKDEgLSBNYXRoLmNvcyhNYXRoLmF0YW4oMSAvIE1hdGguY29zKHRoZXRhKSkpKTtcbiAgaWYgKGNvc3BoaSA8IC0xKSB7XG4gICAgY29zcGhpID0gLTE7XG4gIH0gZWxzZSBpZiAoY29zcGhpID4gKzEpIHtcbiAgICBjb3NwaGkgPSArMTtcbiAgfVxuXG4gIC8qIEFwcGx5IHRoZSByZXN1bHQgdG8gdGhlIHJlYWwgYXJlYSBvbiB0aGUgY3ViZSBmYWNlLlxuICAgKiBGb3IgdGhlIHRvcCBhbmQgYm90dG9tIGZhY2UsIHdlIGNhbiBjb21wdXRlIHBoaSBhbmQgbGFtIGRpcmVjdGx5LlxuICAgKiBGb3IgdGhlIG90aGVyIGZhY2VzLCB3ZSBtdXN0IHVzZSB1bml0IHNwaGVyZSBjYXJ0ZXNpYW4gY29vcmRpbmF0ZXNcbiAgICogYXMgYW4gaW50ZXJtZWRpYXRlIHN0ZXAuICovXG4gIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5UT1ApIHtcbiAgICBwaGkgPSBNYXRoLmFjb3MoY29zcGhpKTtcbiAgICBscC5waGkgPSBIQUxGX1BJIC0gcGhpO1xuICAgIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8wKSB7XG4gICAgICBscC5sYW0gPSB0aGV0YSArIEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG4gICAgICBscC5sYW0gPSAodGhldGEgPCAwLjAgPyB0aGV0YSArIFNQSSA6IHRoZXRhIC0gU1BJKTtcbiAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzIpIHtcbiAgICAgIGxwLmxhbSA9IHRoZXRhIC0gSEFMRl9QSTtcbiAgICB9IGVsc2UgLyogYXJlYS52YWx1ZSA9PSBBUkVBX0VOVU0uQVJFQV8zICovIHtcbiAgICAgIGxwLmxhbSA9IHRoZXRhO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5CT1RUT00pIHtcbiAgICBwaGkgPSBNYXRoLmFjb3MoY29zcGhpKTtcbiAgICBscC5waGkgPSBwaGkgLSBIQUxGX1BJO1xuICAgIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8wKSB7XG4gICAgICBscC5sYW0gPSAtdGhldGEgKyBIQUxGX1BJO1xuICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMSkge1xuICAgICAgbHAubGFtID0gLXRoZXRhO1xuICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMikge1xuICAgICAgbHAubGFtID0gLXRoZXRhIC0gSEFMRl9QSTtcbiAgICB9IGVsc2UgLyogYXJlYS52YWx1ZSA9PSBBUkVBX0VOVU0uQVJFQV8zICovIHtcbiAgICAgIGxwLmxhbSA9ICh0aGV0YSA8IDAuMCA/IC10aGV0YSAtIFNQSSA6IC10aGV0YSArIFNQSSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8qIENvbXB1dGUgcGhpIGFuZCBsYW0gdmlhIGNhcnRlc2lhbiB1bml0IHNwaGVyZSBjb29yZGluYXRlcy4gKi9cbiAgICB2YXIgcSwgciwgcztcbiAgICBxID0gY29zcGhpO1xuICAgIHQgPSBxICogcTtcbiAgICBpZiAodCA+PSAxKSB7XG4gICAgICBzID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcyA9IE1hdGguc3FydCgxIC0gdCkgKiBNYXRoLnNpbih0aGV0YSk7XG4gICAgfVxuICAgIHQgKz0gcyAqIHM7XG4gICAgaWYgKHQgPj0gMSkge1xuICAgICAgciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHIgPSBNYXRoLnNxcnQoMSAtIHQpO1xuICAgIH1cbiAgICAvKiBSb3RhdGUgcSxyLHMgaW50byB0aGUgY29ycmVjdCBhcmVhLiAqL1xuICAgIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG4gICAgICB0ID0gcjtcbiAgICAgIHIgPSAtcztcbiAgICAgIHMgPSB0O1xuICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMikge1xuICAgICAgciA9IC1yO1xuICAgICAgcyA9IC1zO1xuICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMykge1xuICAgICAgdCA9IHI7XG4gICAgICByID0gcztcbiAgICAgIHMgPSAtdDtcbiAgICB9XG4gICAgLyogUm90YXRlIHEscixzIGludG8gdGhlIGNvcnJlY3QgY3ViZSBmYWNlLiAqL1xuICAgIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5SSUdIVCkge1xuICAgICAgdCA9IHE7XG4gICAgICBxID0gLXI7XG4gICAgICByID0gdDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJBQ0spIHtcbiAgICAgIHEgPSAtcTtcbiAgICAgIHIgPSAtcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkxFRlQpIHtcbiAgICAgIHQgPSBxO1xuICAgICAgcSA9IHI7XG4gICAgICByID0gLXQ7XG4gICAgfVxuICAgIC8qIE5vdyBjb21wdXRlIHBoaSBhbmQgbGFtIGZyb20gdGhlIHVuaXQgc3BoZXJlIGNvb3JkaW5hdGVzLiAqL1xuICAgIGxwLnBoaSA9IE1hdGguYWNvcygtcykgLSBIQUxGX1BJO1xuICAgIGxwLmxhbSA9IE1hdGguYXRhbjIociwgcSk7XG4gICAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlJJR0hUKSB7XG4gICAgICBscC5sYW0gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihscC5sYW0sIC1IQUxGX1BJKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJBQ0spIHtcbiAgICAgIGxwLmxhbSA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxwLmxhbSwgLVNQSSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5MRUZUKSB7XG4gICAgICBscC5sYW0gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihscC5sYW0sICtIQUxGX1BJKTtcbiAgICB9XG4gIH1cblxuICAvKiBBcHBseSB0aGUgc2hpZnQgZnJvbSB0aGUgc3BoZXJlIHRvIHRoZSBlbGxpcHNvaWQgYXMgZGVzY3JpYmVkXG4gICAqIGluIFtMSzEyXS4gKi9cbiAgaWYgKHRoaXMuZXMgIT09IDApIHtcbiAgICB2YXIgaW52ZXJ0X3NpZ247XG4gICAgdmFyIHRhbnBoaSwgeGE7XG4gICAgaW52ZXJ0X3NpZ24gPSAobHAucGhpIDwgMCA/IDEgOiAwKTtcbiAgICB0YW5waGkgPSBNYXRoLnRhbihscC5waGkpO1xuICAgIHhhID0gdGhpcy5iIC8gTWF0aC5zcXJ0KHRhbnBoaSAqIHRhbnBoaSArIHRoaXMub25lX21pbnVzX2Zfc3F1YXJlZCk7XG4gICAgbHAucGhpID0gTWF0aC5hdGFuKE1hdGguc3FydCh0aGlzLmEgKiB0aGlzLmEgLSB4YSAqIHhhKSAvICh0aGlzLm9uZV9taW51c19mICogeGEpKTtcbiAgICBpZiAoaW52ZXJ0X3NpZ24pIHtcbiAgICAgIGxwLnBoaSA9IC1scC5waGk7XG4gICAgfVxuICB9XG5cbiAgbHAubGFtICs9IHRoaXMubG9uZzA7XG4gIHAueCA9IGxwLmxhbTtcbiAgcC55ID0gbHAucGhpO1xuICByZXR1cm4gcDtcbn1cblxuLyogSGVscGVyIGZ1bmN0aW9uIGZvciBmb3J3YXJkIHByb2plY3Rpb246IGNvbXB1dGUgdGhlIHRoZXRhIGFuZ2xlXG4gKiBhbmQgZGV0ZXJtaW5lIHRoZSBhcmVhIG51bWJlci4gKi9cbmZ1bmN0aW9uIHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHksIHgsIGFyZWEpIHtcbiAgdmFyIHRoZXRhO1xuICBpZiAocGhpIDwgRVBTTE4pIHtcbiAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcbiAgICB0aGV0YSA9IDAuMDtcbiAgfSBlbHNlIHtcbiAgICB0aGV0YSA9IE1hdGguYXRhbjIoeSwgeCk7XG4gICAgaWYgKE1hdGguYWJzKHRoZXRhKSA8PSBGT1JUUEkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICAgIH0gZWxzZSBpZiAodGhldGEgPiBGT1JUUEkgJiYgdGhldGEgPD0gSEFMRl9QSSArIEZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzE7XG4gICAgICB0aGV0YSAtPSBIQUxGX1BJO1xuICAgIH0gZWxzZSBpZiAodGhldGEgPiBIQUxGX1BJICsgRk9SVFBJIHx8IHRoZXRhIDw9IC0oSEFMRl9QSSArIEZPUlRQSSkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8yO1xuICAgICAgdGhldGEgPSAodGhldGEgPj0gMC4wID8gdGhldGEgLSBTUEkgOiB0aGV0YSArIFNQSSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8zO1xuICAgICAgdGhldGEgKz0gSEFMRl9QSTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoZXRhO1xufVxuXG4vKiBIZWxwZXIgZnVuY3Rpb246IHNoaWZ0IHRoZSBsb25naXR1ZGUuICovXG5mdW5jdGlvbiBxc2Nfc2hpZnRfbG9uX29yaWdpbihsb24sIG9mZnNldCkge1xuICB2YXIgc2xvbiA9IGxvbiArIG9mZnNldDtcbiAgaWYgKHNsb24gPCAtU1BJKSB7XG4gICAgc2xvbiArPSBUV09fUEk7XG4gIH0gZWxzZSBpZiAoc2xvbiA+ICtTUEkpIHtcbiAgICBzbG9uIC09IFRXT19QSTtcbiAgfVxuICByZXR1cm4gc2xvbjtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnUXVhZHJpbGF0ZXJhbGl6ZWQgU3BoZXJpY2FsIEN1YmUnLCAnUXVhZHJpbGF0ZXJhbGl6ZWRfU3BoZXJpY2FsX0N1YmUnLCAncXNjJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIi8vIFJvYmluc29uIHByb2plY3Rpb25cbi8vIEJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9PU0dlby9wcm9qLjQvYmxvYi9tYXN0ZXIvc3JjL1BKX3JvYmluLmNcbi8vIFBvbHlub21pYWwgY29lZmljaWVudHMgZnJvbSBodHRwOi8vYXJ0aWNsZS5nbWFuZS5vcmcvZ21hbmUuY29tcC5naXMucHJvai00LmRldmVsLzYwMzlcblxuaW1wb3J0IHsgSEFMRl9QSSwgRDJSLCBSMkQsIEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbnZhciBDT0VGU19YID0gW1xuICBbMS4wMDAwLCAyLjIxOTllLTE3LCAtNy4xNTUxNWUtMDUsIDMuMTEwM2UtMDZdLFxuICBbMC45OTg2LCAtMC4wMDA0ODIyNDMsIC0yLjQ4OTdlLTA1LCAtMS4zMzA5ZS0wNl0sXG4gIFswLjk5NTQsIC0wLjAwMDgzMTAzLCAtNC40ODYwNWUtMDUsIC05Ljg2NzAxZS0wN10sXG4gIFswLjk5MDAsIC0wLjAwMTM1MzY0LCAtNS45NjYxZS0wNSwgMy42Nzc3ZS0wNl0sXG4gIFswLjk4MjIsIC0wLjAwMTY3NDQyLCAtNC40OTU0N2UtMDYsIC01LjcyNDExZS0wNl0sXG4gIFswLjk3MzAsIC0wLjAwMjE0ODY4LCAtOS4wMzU3MWUtMDUsIDEuODczNmUtMDhdLFxuICBbMC45NjAwLCAtMC4wMDMwNTA4NSwgLTkuMDA3NjFlLTA1LCAxLjY0OTE3ZS0wNl0sXG4gIFswLjk0MjcsIC0wLjAwMzgyNzkyLCAtNi41MzM4NmUtMDUsIC0yLjYxNTRlLTA2XSxcbiAgWzAuOTIxNiwgLTAuMDA0Njc3NDYsIC0wLjAwMDEwNDU3LCA0LjgxMjQzZS0wNl0sXG4gIFswLjg5NjIsIC0wLjAwNTM2MjIzLCAtMy4yMzgzMWUtMDUsIC01LjQzNDMyZS0wNl0sXG4gIFswLjg2NzksIC0wLjAwNjA5MzYzLCAtMC4wMDAxMTM4OTgsIDMuMzI0ODRlLTA2XSxcbiAgWzAuODM1MCwgLTAuMDA2OTgzMjUsIC02LjQwMjUzZS0wNSwgOS4zNDk1OWUtMDddLFxuICBbMC43OTg2LCAtMC4wMDc1NTMzOCwgLTUuMDAwMDllLTA1LCA5LjM1MzI0ZS0wN10sXG4gIFswLjc1OTcsIC0wLjAwNzk4MzI0LCAtMy41OTcxZS0wNSwgLTIuMjc2MjZlLTA2XSxcbiAgWzAuNzE4NiwgLTAuMDA4NTEzNjcsIC03LjAxMTQ5ZS0wNSwgLTguNjMwM2UtMDZdLFxuICBbMC42NzMyLCAtMC4wMDk4NjIwOSwgLTAuMDAwMTk5NTY5LCAxLjkxOTc0ZS0wNV0sXG4gIFswLjYyMTMsIC0wLjAxMDQxOCwgOC44MzkyM2UtMDUsIDYuMjQwNTFlLTA2XSxcbiAgWzAuNTcyMiwgLTAuMDA5MDY2MDEsIDAuMDAwMTgyLCA2LjI0MDUxZS0wNl0sXG4gIFswLjUzMjIsIC0wLjAwNjc3Nzk3LCAwLjAwMDI3NTYwOCwgNi4yNDA1MWUtMDZdXG5dO1xuXG52YXIgQ09FRlNfWSA9IFtcbiAgWy01LjIwNDE3ZS0xOCwgMC4wMTI0LCAxLjIxNDMxZS0xOCwgLTguNDUyODRlLTExXSxcbiAgWzAuMDYyMCwgMC4wMTI0LCAtMS4yNjc5M2UtMDksIDQuMjI2NDJlLTEwXSxcbiAgWzAuMTI0MCwgMC4wMTI0LCA1LjA3MTcxZS0wOSwgLTEuNjA2MDRlLTA5XSxcbiAgWzAuMTg2MCwgMC4wMTIzOTk5LCAtMS45MDE4OWUtMDgsIDYuMDAxNTJlLTA5XSxcbiAgWzAuMjQ4MCwgMC4wMTI0MDAyLCA3LjEwMDM5ZS0wOCwgLTIuMjRlLTA4XSxcbiAgWzAuMzEwMCwgMC4wMTIzOTkyLCAtMi42NDk5N2UtMDcsIDguMzU5ODZlLTA4XSxcbiAgWzAuMzcyMCwgMC4wMTI0MDI5LCA5Ljg4OTgzZS0wNywgLTMuMTE5OTRlLTA3XSxcbiAgWzAuNDM0MCwgMC4wMTIzODkzLCAtMy42OTA5M2UtMDYsIC00LjM1NjIxZS0wN10sXG4gIFswLjQ5NTgsIDAuMDEyMzE5OCwgLTEuMDIyNTJlLTA1LCAtMy40NTUyM2UtMDddLFxuICBbMC41NTcxLCAwLjAxMjE5MTYsIC0xLjU0MDgxZS0wNSwgLTUuODIyODhlLTA3XSxcbiAgWzAuNjE3NiwgMC4wMTE5OTM4LCAtMi40MTQyNGUtMDUsIC01LjI1MzI3ZS0wN10sXG4gIFswLjY3NjksIDAuMDExNzEzLCAtMy4yMDIyM2UtMDUsIC01LjE2NDA1ZS0wN10sXG4gIFswLjczNDYsIDAuMDExMzU0MSwgLTMuOTc2ODRlLTA1LCAtNi4wOTA1MmUtMDddLFxuICBbMC43OTAzLCAwLjAxMDkxMDcsIC00Ljg5MDQyZS0wNSwgLTEuMDQ3MzllLTA2XSxcbiAgWzAuODQzNSwgMC4wMTAzNDMxLCAtNi40NjE1ZS0wNSwgLTEuNDAzNzRlLTA5XSxcbiAgWzAuODkzNiwgMC4wMDk2OTY4NiwgLTYuNDYzNmUtMDUsIC04LjU0N2UtMDZdLFxuICBbMC45Mzk0LCAwLjAwODQwOTQ3LCAtMC4wMDAxOTI4NDEsIC00LjIxMDZlLTA2XSxcbiAgWzAuOTc2MSwgMC4wMDYxNjUyNywgLTAuMDAwMjU2LCAtNC4yMTA2ZS0wNl0sXG4gIFsxLjAwMDAsIDAuMDAzMjg5NDcsIC0wLjAwMDMxOTE1OSwgLTQuMjEwNmUtMDZdXG5dO1xuXG52YXIgRlhDID0gMC44NDg3O1xudmFyIEZZQyA9IDEuMzUyMztcbnZhciBDMSA9IFIyRCAvIDU7IC8vIHJhZCB0byA1LWRlZ3JlZSBpbnRlcnZhbFxudmFyIFJDMSA9IDEgLyBDMTtcbnZhciBOT0RFUyA9IDE4O1xuXG52YXIgcG9seTNfdmFsID0gZnVuY3Rpb24gKGNvZWZzLCB4KSB7XG4gIHJldHVybiBjb2Vmc1swXSArIHggKiAoY29lZnNbMV0gKyB4ICogKGNvZWZzWzJdICsgeCAqIGNvZWZzWzNdKSk7XG59O1xuXG52YXIgcG9seTNfZGVyID0gZnVuY3Rpb24gKGNvZWZzLCB4KSB7XG4gIHJldHVybiBjb2Vmc1sxXSArIHggKiAoMiAqIGNvZWZzWzJdICsgeCAqIDMgKiBjb2Vmc1szXSk7XG59O1xuXG5mdW5jdGlvbiBuZXd0b25fcmFwc2hvbihmX2RmLCBzdGFydCwgbWF4X2VyciwgaXRlcnMpIHtcbiAgdmFyIHggPSBzdGFydDtcbiAgZm9yICg7IGl0ZXJzOyAtLWl0ZXJzKSB7XG4gICAgdmFyIHVwZCA9IGZfZGYoeCk7XG4gICAgeCAtPSB1cGQ7XG4gICAgaWYgKE1hdGguYWJzKHVwZCkgPCBtYXhfZXJyKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCB8fCAwO1xuICB0aGlzLmVzID0gMDtcbiAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGUgfHwgJ1JvYmluc29uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQobGwpIHtcbiAgdmFyIGxvbiA9IGFkanVzdF9sb24obGwueCAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG5cbiAgdmFyIGRwaGkgPSBNYXRoLmFicyhsbC55KTtcbiAgdmFyIGkgPSBNYXRoLmZsb29yKGRwaGkgKiBDMSk7XG4gIGlmIChpIDwgMCkge1xuICAgIGkgPSAwO1xuICB9IGVsc2UgaWYgKGkgPj0gTk9ERVMpIHtcbiAgICBpID0gTk9ERVMgLSAxO1xuICB9XG4gIGRwaGkgPSBSMkQgKiAoZHBoaSAtIFJDMSAqIGkpO1xuICB2YXIgeHkgPSB7XG4gICAgeDogcG9seTNfdmFsKENPRUZTX1hbaV0sIGRwaGkpICogbG9uLFxuICAgIHk6IHBvbHkzX3ZhbChDT0VGU19ZW2ldLCBkcGhpKVxuICB9O1xuICBpZiAobGwueSA8IDApIHtcbiAgICB4eS55ID0gLXh5Lnk7XG4gIH1cblxuICB4eS54ID0geHkueCAqIHRoaXMuYSAqIEZYQyArIHRoaXMueDA7XG4gIHh5LnkgPSB4eS55ICogdGhpcy5hICogRllDICsgdGhpcy55MDtcbiAgcmV0dXJuIHh5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZSh4eSkge1xuICB2YXIgbGwgPSB7XG4gICAgeDogKHh5LnggLSB0aGlzLngwKSAvICh0aGlzLmEgKiBGWEMpLFxuICAgIHk6IE1hdGguYWJzKHh5LnkgLSB0aGlzLnkwKSAvICh0aGlzLmEgKiBGWUMpXG4gIH07XG5cbiAgaWYgKGxsLnkgPj0gMSkgeyAvLyBwYXRob2xvZ2ljIGNhc2VcbiAgICBsbC54IC89IENPRUZTX1hbTk9ERVNdWzBdO1xuICAgIGxsLnkgPSB4eS55IDwgMCA/IC1IQUxGX1BJIDogSEFMRl9QSTtcbiAgfSBlbHNlIHtcbiAgICAvLyBmaW5kIHRhYmxlIGludGVydmFsXG4gICAgdmFyIGkgPSBNYXRoLmZsb29yKGxsLnkgKiBOT0RFUyk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICBpID0gMDtcbiAgICB9IGVsc2UgaWYgKGkgPj0gTk9ERVMpIHtcbiAgICAgIGkgPSBOT0RFUyAtIDE7XG4gICAgfVxuICAgIGZvciAoOzspIHtcbiAgICAgIGlmIChDT0VGU19ZW2ldWzBdID4gbGwueSkge1xuICAgICAgICAtLWk7XG4gICAgICB9IGVsc2UgaWYgKENPRUZTX1lbaSArIDFdWzBdIDw9IGxsLnkpIHtcbiAgICAgICAgKytpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGxpbmVhciBpbnRlcnBvbGF0aW9uIGluIDUgZGVncmVlIGludGVydmFsXG4gICAgdmFyIGNvZWZzID0gQ09FRlNfWVtpXTtcbiAgICB2YXIgdCA9IDUgKiAobGwueSAtIGNvZWZzWzBdKSAvIChDT0VGU19ZW2kgKyAxXVswXSAtIGNvZWZzWzBdKTtcbiAgICAvLyBmaW5kIHQgc28gdGhhdCBwb2x5M192YWwoY29lZnMsIHQpID0gbGwueVxuICAgIHQgPSBuZXd0b25fcmFwc2hvbihmdW5jdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIChwb2x5M192YWwoY29lZnMsIHgpIC0gbGwueSkgLyBwb2x5M19kZXIoY29lZnMsIHgpO1xuICAgIH0sIHQsIEVQU0xOLCAxMDApO1xuXG4gICAgbGwueCAvPSBwb2x5M192YWwoQ09FRlNfWFtpXSwgdCk7XG4gICAgbGwueSA9ICg1ICogaSArIHQpICogRDJSO1xuICAgIGlmICh4eS55IDwgMCkge1xuICAgICAgbGwueSA9IC1sbC55O1xuICAgIH1cbiAgfVxuXG4gIGxsLnggPSBhZGp1c3RfbG9uKGxsLnggKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICByZXR1cm4gbGw7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1JvYmluc29uJywgJ3JvYmluJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhZGp1c3RfbGF0IGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbGF0JztcbmltcG9ydCBwal9lbmZuIGZyb20gJy4uL2NvbW1vbi9wal9lbmZuJztcbnZhciBNQVhfSVRFUiA9IDIwO1xuaW1wb3J0IHBqX21sZm4gZnJvbSAnLi4vY29tbW9uL3BqX21sZm4nO1xuaW1wb3J0IHBqX2ludl9tbGZuIGZyb20gJy4uL2NvbW1vbi9wal9pbnZfbWxmbic7XG5pbXBvcnQgeyBFUFNMTiwgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gZW5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbVxuICogQHByb3BlcnR5IHtudW1iZXJ9IENfeVxuICogQHByb3BlcnR5IHtudW1iZXJ9IENfeFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIGlmICghdGhpcy5zcGhlcmUpIHtcbiAgICB0aGlzLmVuID0gcGpfZW5mbih0aGlzLmVzKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm4gPSAxO1xuICAgIHRoaXMubSA9IDA7XG4gICAgdGhpcy5lcyA9IDA7XG4gICAgdGhpcy5DX3kgPSBNYXRoLnNxcnQoKHRoaXMubSArIDEpIC8gdGhpcy5uKTtcbiAgICB0aGlzLkNfeCA9IHRoaXMuQ195IC8gKHRoaXMubSArIDEpO1xuICB9XG59XG5cbi8qIFNpbnVzb2lkYWwgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciB4LCB5O1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBpZiAoIXRoaXMubSkge1xuICAgICAgbGF0ID0gdGhpcy5uICE9PSAxID8gTWF0aC5hc2luKHRoaXMubiAqIE1hdGguc2luKGxhdCkpIDogbGF0O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgayA9IHRoaXMubiAqIE1hdGguc2luKGxhdCk7XG4gICAgICBmb3IgKHZhciBpID0gTUFYX0lURVI7IGk7IC0taSkge1xuICAgICAgICB2YXIgViA9ICh0aGlzLm0gKiBsYXQgKyBNYXRoLnNpbihsYXQpIC0gaykgLyAodGhpcy5tICsgTWF0aC5jb3MobGF0KSk7XG4gICAgICAgIGxhdCAtPSBWO1xuICAgICAgICBpZiAoTWF0aC5hYnMoVikgPCBFUFNMTikge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHggPSB0aGlzLmEgKiB0aGlzLkNfeCAqIGxvbiAqICh0aGlzLm0gKyBNYXRoLmNvcyhsYXQpKTtcbiAgICB5ID0gdGhpcy5hICogdGhpcy5DX3kgKiBsYXQ7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihsYXQpO1xuICAgIHZhciBjID0gTWF0aC5jb3MobGF0KTtcbiAgICB5ID0gdGhpcy5hICogcGpfbWxmbihsYXQsIHMsIGMsIHRoaXMuZW4pO1xuICAgIHggPSB0aGlzLmEgKiBsb24gKiBjIC8gTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogcyAqIHMpO1xuICB9XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIGxhdCwgdGVtcCwgbG9uLCBzO1xuXG4gIHAueCAtPSB0aGlzLngwO1xuICBsb24gPSBwLnggLyB0aGlzLmE7XG4gIHAueSAtPSB0aGlzLnkwO1xuICBsYXQgPSBwLnkgLyB0aGlzLmE7XG5cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgbGF0IC89IHRoaXMuQ195O1xuICAgIGxvbiA9IGxvbiAvICh0aGlzLkNfeCAqICh0aGlzLm0gKyBNYXRoLmNvcyhsYXQpKSk7XG4gICAgaWYgKHRoaXMubSkge1xuICAgICAgbGF0ID0gYXNpbnooKHRoaXMubSAqIGxhdCArIE1hdGguc2luKGxhdCkpIC8gdGhpcy5uKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubiAhPT0gMSkge1xuICAgICAgbGF0ID0gYXNpbnooTWF0aC5zaW4obGF0KSAvIHRoaXMubik7XG4gICAgfVxuICAgIGxvbiA9IGFkanVzdF9sb24obG9uICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgICBsYXQgPSBhZGp1c3RfbGF0KGxhdCk7XG4gIH0gZWxzZSB7XG4gICAgbGF0ID0gcGpfaW52X21sZm4ocC55IC8gdGhpcy5hLCB0aGlzLmVzLCB0aGlzLmVuKTtcbiAgICBzID0gTWF0aC5hYnMobGF0KTtcbiAgICBpZiAocyA8IEhBTEZfUEkpIHtcbiAgICAgIHMgPSBNYXRoLnNpbihsYXQpO1xuICAgICAgdGVtcCA9IHRoaXMubG9uZzAgKyBwLnggKiBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBzICogcykgLyAodGhpcy5hICogTWF0aC5jb3MobGF0KSk7XG4gICAgICAvLyB0ZW1wID0gdGhpcy5sb25nMCArIHAueCAvICh0aGlzLmEgKiBNYXRoLmNvcyhsYXQpKTtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGVtcCwgdGhpcy5vdmVyKTtcbiAgICB9IGVsc2UgaWYgKChzIC0gRVBTTE4pIDwgSEFMRl9QSSkge1xuICAgICAgbG9uID0gdGhpcy5sb25nMDtcbiAgICB9XG4gIH1cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydTaW51c29pZGFsJywgJ3NpbnUnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiLypcbiAgcmVmZXJlbmNlczpcbiAgICBGb3JtdWxlcyBldCBjb25zdGFudGVzIHBvdXIgbGUgQ2FsY3VsIHBvdXIgbGFcbiAgICBwcm9qZWN0aW9uIGN5bGluZHJpcXVlIGNvbmZvcm1lIMOgIGF4ZSBvYmxpcXVlIGV0IHBvdXIgbGEgdHJhbnNmb3JtYXRpb24gZW50cmVcbiAgICBkZXMgc3lzdMOobWVzIGRlIHLDqWbDqXJlbmNlLlxuICAgIGh0dHA6Ly93d3cuc3dpc3N0b3BvLmFkbWluLmNoL2ludGVybmV0L3N3aXNzdG9wby9mci9ob21lL3RvcGljcy9zdXJ2ZXkvc3lzL3JlZnN5cy9zd2l0emVybGFuZC5wYXJzeXNyZWxhdGVkMS4zMTIxNi5kb3dubG9hZExpc3QuNzcwMDQuRG93bmxvYWRGaWxlLnRtcC9zd2lzc3Byb2plY3Rpb25mci5wZGZcbiAgKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsYW1iZGEwXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IEtcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBwaHkwID0gdGhpcy5sYXQwO1xuICB0aGlzLmxhbWJkYTAgPSB0aGlzLmxvbmcwO1xuICB2YXIgc2luUGh5MCA9IE1hdGguc2luKHBoeTApO1xuICB2YXIgc2VtaU1ham9yQXhpcyA9IHRoaXMuYTtcbiAgdmFyIGludkYgPSB0aGlzLnJmO1xuICB2YXIgZmxhdHRlbmluZyA9IDEgLyBpbnZGO1xuICB2YXIgZTIgPSAyICogZmxhdHRlbmluZyAtIE1hdGgucG93KGZsYXR0ZW5pbmcsIDIpO1xuICB2YXIgZSA9IHRoaXMuZSA9IE1hdGguc3FydChlMik7XG4gIHRoaXMuUiA9IHRoaXMuazAgKiBzZW1pTWFqb3JBeGlzICogTWF0aC5zcXJ0KDEgLSBlMikgLyAoMSAtIGUyICogTWF0aC5wb3coc2luUGh5MCwgMikpO1xuICB0aGlzLmFscGhhID0gTWF0aC5zcXJ0KDEgKyBlMiAvICgxIC0gZTIpICogTWF0aC5wb3coTWF0aC5jb3MocGh5MCksIDQpKTtcbiAgdGhpcy5iMCA9IE1hdGguYXNpbihzaW5QaHkwIC8gdGhpcy5hbHBoYSk7XG4gIHZhciBrMSA9IE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgdGhpcy5iMCAvIDIpKTtcbiAgdmFyIGsyID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBwaHkwIC8gMikpO1xuICB2YXIgazMgPSBNYXRoLmxvZygoMSArIGUgKiBzaW5QaHkwKSAvICgxIC0gZSAqIHNpblBoeTApKTtcbiAgdGhpcy5LID0gazEgLSB0aGlzLmFscGhhICogazIgKyB0aGlzLmFscGhhICogZSAvIDIgKiBrMztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgU2ExID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgLSBwLnkgLyAyKSk7XG4gIHZhciBTYTIgPSB0aGlzLmUgLyAyICogTWF0aC5sb2coKDEgKyB0aGlzLmUgKiBNYXRoLnNpbihwLnkpKSAvICgxIC0gdGhpcy5lICogTWF0aC5zaW4ocC55KSkpO1xuICB2YXIgUyA9IC10aGlzLmFscGhhICogKFNhMSArIFNhMikgKyB0aGlzLks7XG5cbiAgLy8gc3BoZXJpYyBsYXRpdHVkZVxuICB2YXIgYiA9IDIgKiAoTWF0aC5hdGFuKE1hdGguZXhwKFMpKSAtIE1hdGguUEkgLyA0KTtcblxuICAvLyBzcGhlcmljIGxvbmdpdHVkZVxuICB2YXIgSSA9IHRoaXMuYWxwaGEgKiAocC54IC0gdGhpcy5sYW1iZGEwKTtcblxuICAvLyBwc29ldWRvIGVxdWF0b3JpYWwgcm90YXRpb25cbiAgdmFyIHJvdEkgPSBNYXRoLmF0YW4oTWF0aC5zaW4oSSkgLyAoTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLnRhbihiKSArIE1hdGguY29zKHRoaXMuYjApICogTWF0aC5jb3MoSSkpKTtcblxuICB2YXIgcm90QiA9IE1hdGguYXNpbihNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguc2luKGIpIC0gTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLmNvcyhiKSAqIE1hdGguY29zKEkpKTtcblxuICBwLnkgPSB0aGlzLlIgLyAyICogTWF0aC5sb2coKDEgKyBNYXRoLnNpbihyb3RCKSkgLyAoMSAtIE1hdGguc2luKHJvdEIpKSkgKyB0aGlzLnkwO1xuICBwLnggPSB0aGlzLlIgKiByb3RJICsgdGhpcy54MDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIFkgPSBwLnggLSB0aGlzLngwO1xuICB2YXIgWCA9IHAueSAtIHRoaXMueTA7XG5cbiAgdmFyIHJvdEkgPSBZIC8gdGhpcy5SO1xuICB2YXIgcm90QiA9IDIgKiAoTWF0aC5hdGFuKE1hdGguZXhwKFggLyB0aGlzLlIpKSAtIE1hdGguUEkgLyA0KTtcblxuICB2YXIgYiA9IE1hdGguYXNpbihNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguc2luKHJvdEIpICsgTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLmNvcyhyb3RCKSAqIE1hdGguY29zKHJvdEkpKTtcbiAgdmFyIEkgPSBNYXRoLmF0YW4oTWF0aC5zaW4ocm90SSkgLyAoTWF0aC5jb3ModGhpcy5iMCkgKiBNYXRoLmNvcyhyb3RJKSAtIE1hdGguc2luKHRoaXMuYjApICogTWF0aC50YW4ocm90QikpKTtcblxuICB2YXIgbGFtYmRhID0gdGhpcy5sYW1iZGEwICsgSSAvIHRoaXMuYWxwaGE7XG5cbiAgdmFyIFMgPSAwO1xuICB2YXIgcGh5ID0gYjtcbiAgdmFyIHByZXZQaHkgPSAtMTAwMDtcbiAgdmFyIGl0ZXJhdGlvbiA9IDA7XG4gIHdoaWxlIChNYXRoLmFicyhwaHkgLSBwcmV2UGh5KSA+IDAuMDAwMDAwMSkge1xuICAgIGlmICgrK2l0ZXJhdGlvbiA+IDIwKSB7XG4gICAgICAvLyAuLi5yZXBvcnRFcnJvcihcIm9tZXJjRndkSW5maW5pdHlcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFMgPSBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIHBoeSAvIDIpKTtcbiAgICBTID0gMSAvIHRoaXMuYWxwaGEgKiAoTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBiIC8gMikpIC0gdGhpcy5LKSArIHRoaXMuZSAqIE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgTWF0aC5hc2luKHRoaXMuZSAqIE1hdGguc2luKHBoeSkpIC8gMikpO1xuICAgIHByZXZQaHkgPSBwaHk7XG4gICAgcGh5ID0gMiAqIE1hdGguYXRhbihNYXRoLmV4cChTKSkgLSBNYXRoLlBJIC8gMjtcbiAgfVxuXG4gIHAueCA9IGxhbWJkYTtcbiAgcC55ID0gcGh5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnc29tZXJjJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB7IEVQU0xOLCBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBzaWduIGZyb20gJy4uL2NvbW1vbi9zaWduJztcbmltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IHRzZm56IGZyb20gJy4uL2NvbW1vbi90c2Zueic7XG5pbXBvcnQgcGhpMnogZnJvbSAnLi4vY29tbW9uL3BoaTJ6JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NsYXQwXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2lubGF0MFxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1zMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFgwXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zWDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5YMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvblxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvbnNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNzZm5fKHBoaXQsIHNpbnBoaSwgZWNjZW4pIHtcbiAgc2lucGhpICo9IGVjY2VuO1xuICByZXR1cm4gKE1hdGgudGFuKDAuNSAqIChIQUxGX1BJICsgcGhpdCkpICogTWF0aC5wb3coKDEgLSBzaW5waGkpIC8gKDEgKyBzaW5waGkpLCAwLjUgKiBlY2NlbikpO1xufVxuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIHNldHRpbmcgZGVmYXVsdCBwYXJhbWV0ZXJzXG4gIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG4gIHRoaXMubGF0MCA9IHRoaXMubGF0MCB8fCAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCB8fCAwO1xuXG4gIHRoaXMuY29zbGF0MCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIHRoaXMuc2lubGF0MCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmICh0aGlzLmswID09PSAxICYmICFpc05hTih0aGlzLmxhdF90cykgJiYgTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8PSBFUFNMTikge1xuICAgICAgdGhpcy5rMCA9IDAuNSAqICgxICsgc2lnbih0aGlzLmxhdDApICogTWF0aC5zaW4odGhpcy5sYXRfdHMpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIGlmICh0aGlzLmxhdDAgPiAwKSB7XG4gICAgICAgIC8vIE5vcnRoIHBvbGVcbiAgICAgICAgLy8gdHJhY2UoJ3N0ZXJlOm5vcnRoIHBvbGUnKTtcbiAgICAgICAgdGhpcy5jb24gPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU291dGggcG9sZVxuICAgICAgICAvLyB0cmFjZSgnc3RlcmU6c291dGggcG9sZScpO1xuICAgICAgICB0aGlzLmNvbiA9IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbnMgPSBNYXRoLnNxcnQoTWF0aC5wb3coMSArIHRoaXMuZSwgMSArIHRoaXMuZSkgKiBNYXRoLnBvdygxIC0gdGhpcy5lLCAxIC0gdGhpcy5lKSk7XG4gICAgaWYgKHRoaXMuazAgPT09IDEgJiYgIWlzTmFOKHRoaXMubGF0X3RzKSAmJiBNYXRoLmFicyh0aGlzLmNvc2xhdDApIDw9IEVQU0xOICYmIE1hdGguYWJzKE1hdGguY29zKHRoaXMubGF0X3RzKSkgPiBFUFNMTikge1xuICAgICAgLy8gV2hlbiBrMCBpcyAxIChkZWZhdWx0IHZhbHVlKSBhbmQgbGF0X3RzIGlzIGEgdmFpbGQgbnVtYmVyIGFuZCBsYXQwIGlzIGF0IGEgcG9sZSBhbmQgbGF0X3RzIGlzIG5vdCBhdCBhIHBvbGVcbiAgICAgIC8vIFJlY2FsY3VsYXRlIGswIHVzaW5nIGZvcm11bGEgMjEtMzUgZnJvbSBwMTYxIG9mIFNueWRlciwgMTk4N1xuICAgICAgdGhpcy5rMCA9IDAuNSAqIHRoaXMuY29ucyAqIG1zZm56KHRoaXMuZSwgTWF0aC5zaW4odGhpcy5sYXRfdHMpLCBNYXRoLmNvcyh0aGlzLmxhdF90cykpIC8gdHNmbnoodGhpcy5lLCB0aGlzLmNvbiAqIHRoaXMubGF0X3RzLCB0aGlzLmNvbiAqIE1hdGguc2luKHRoaXMubGF0X3RzKSk7XG4gICAgfVxuICAgIHRoaXMubXMxID0gbXNmbnoodGhpcy5lLCB0aGlzLnNpbmxhdDAsIHRoaXMuY29zbGF0MCk7XG4gICAgdGhpcy5YMCA9IDIgKiBNYXRoLmF0YW4oc3Nmbl8odGhpcy5sYXQwLCB0aGlzLnNpbmxhdDAsIHRoaXMuZSkpIC0gSEFMRl9QSTtcbiAgICB0aGlzLmNvc1gwID0gTWF0aC5jb3ModGhpcy5YMCk7XG4gICAgdGhpcy5zaW5YMCA9IE1hdGguc2luKHRoaXMuWDApO1xuICB9XG59XG5cbi8vIFN0ZXJlb2dyYXBoaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciBzaW5sYXQgPSBNYXRoLnNpbihsYXQpO1xuICB2YXIgY29zbGF0ID0gTWF0aC5jb3MobGF0KTtcbiAgdmFyIEEsIFgsIHNpblgsIGNvc1gsIHRzLCByaDtcbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG5cbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKGxvbiAtIHRoaXMubG9uZzApIC0gTWF0aC5QSSkgPD0gRVBTTE4gJiYgTWF0aC5hYnMobGF0ICsgdGhpcy5sYXQwKSA8PSBFUFNMTikge1xuICAgIC8vIGNhc2Ugb2YgdGhlIG9yaWdpbmUgcG9pbnRcbiAgICAvLyB0cmFjZSgnc3RlcmU6dGhpcyBpcyB0aGUgb3JpZ2luIHBvaW50Jyk7XG4gICAgcC54ID0gTmFOO1xuICAgIHAueSA9IE5hTjtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICAvLyB0cmFjZSgnc3RlcmU6c3BoZXJlIGNhc2UnKTtcbiAgICBBID0gMiAqIHRoaXMuazAgLyAoMSArIHRoaXMuc2lubGF0MCAqIHNpbmxhdCArIHRoaXMuY29zbGF0MCAqIGNvc2xhdCAqIE1hdGguY29zKGRsb24pKTtcbiAgICBwLnggPSB0aGlzLmEgKiBBICogY29zbGF0ICogTWF0aC5zaW4oZGxvbikgKyB0aGlzLngwO1xuICAgIHAueSA9IHRoaXMuYSAqIEEgKiAodGhpcy5jb3NsYXQwICogc2lubGF0IC0gdGhpcy5zaW5sYXQwICogY29zbGF0ICogTWF0aC5jb3MoZGxvbikpICsgdGhpcy55MDtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICBYID0gMiAqIE1hdGguYXRhbihzc2ZuXyhsYXQsIHNpbmxhdCwgdGhpcy5lKSkgLSBIQUxGX1BJO1xuICAgIGNvc1ggPSBNYXRoLmNvcyhYKTtcbiAgICBzaW5YID0gTWF0aC5zaW4oWCk7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIHRzID0gdHNmbnoodGhpcy5lLCBsYXQgKiB0aGlzLmNvbiwgdGhpcy5jb24gKiBzaW5sYXQpO1xuICAgICAgcmggPSAyICogdGhpcy5hICogdGhpcy5rMCAqIHRzIC8gdGhpcy5jb25zO1xuICAgICAgcC54ID0gdGhpcy54MCArIHJoICogTWF0aC5zaW4obG9uIC0gdGhpcy5sb25nMCk7XG4gICAgICBwLnkgPSB0aGlzLnkwIC0gdGhpcy5jb24gKiByaCAqIE1hdGguY29zKGxvbiAtIHRoaXMubG9uZzApO1xuICAgICAgLy8gdHJhY2UocC50b1N0cmluZygpKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnModGhpcy5zaW5sYXQwKSA8IEVQU0xOKSB7XG4gICAgICAvLyBFcVxuICAgICAgLy8gdHJhY2UoJ3N0ZXJlOmVxdWF0ZXVyJyk7XG4gICAgICBBID0gMiAqIHRoaXMuYSAqIHRoaXMuazAgLyAoMSArIGNvc1ggKiBNYXRoLmNvcyhkbG9uKSk7XG4gICAgICBwLnkgPSBBICogc2luWDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gb3RoZXIgY2FzZVxuICAgICAgLy8gdHJhY2UoJ3N0ZXJlOm5vcm1hbCBjYXNlJyk7XG4gICAgICBBID0gMiAqIHRoaXMuYSAqIHRoaXMuazAgKiB0aGlzLm1zMSAvICh0aGlzLmNvc1gwICogKDEgKyB0aGlzLnNpblgwICogc2luWCArIHRoaXMuY29zWDAgKiBjb3NYICogTWF0aC5jb3MoZGxvbikpKTtcbiAgICAgIHAueSA9IEEgKiAodGhpcy5jb3NYMCAqIHNpblggLSB0aGlzLnNpblgwICogY29zWCAqIE1hdGguY29zKGRsb24pKSArIHRoaXMueTA7XG4gICAgfVxuICAgIHAueCA9IEEgKiBjb3NYICogTWF0aC5zaW4oZGxvbikgKyB0aGlzLngwO1xuICB9XG4gIC8vIHRyYWNlKHAudG9TdHJpbmcoKSk7XG4gIHJldHVybiBwO1xufVxuXG4vLyogU3RlcmVvZ3JhcGhpYyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICB2YXIgbG9uLCBsYXQsIHRzLCBjZSwgQ2hpO1xuICB2YXIgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgdmFyIGMgPSAyICogTWF0aC5hdGFuKHJoIC8gKDIgKiB0aGlzLmEgKiB0aGlzLmswKSk7XG4gICAgbG9uID0gdGhpcy5sb25nMDtcbiAgICBsYXQgPSB0aGlzLmxhdDA7XG4gICAgaWYgKHJoIDw9IEVQU0xOKSB7XG4gICAgICBwLnggPSBsb247XG4gICAgICBwLnkgPSBsYXQ7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgbGF0ID0gTWF0aC5hc2luKE1hdGguY29zKGMpICogdGhpcy5zaW5sYXQwICsgcC55ICogTWF0aC5zaW4oYykgKiB0aGlzLmNvc2xhdDAgLyByaCk7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPCBFUFNMTikge1xuICAgICAgaWYgKHRoaXMubGF0MCA+IDApIHtcbiAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0xICogcC55KSwgdGhpcy5vdmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCBwLnkpLCB0aGlzLm92ZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCAqIE1hdGguc2luKGMpLCByaCAqIHRoaXMuY29zbGF0MCAqIE1hdGguY29zKGMpIC0gcC55ICogdGhpcy5zaW5sYXQwICogTWF0aC5zaW4oYykpLCB0aGlzLm92ZXIpO1xuICAgIH1cbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9IGVsc2Uge1xuICAgIGlmIChNYXRoLmFicyh0aGlzLmNvc2xhdDApIDw9IEVQU0xOKSB7XG4gICAgICBpZiAocmggPD0gRVBTTE4pIHtcbiAgICAgICAgbGF0ID0gdGhpcy5sYXQwO1xuICAgICAgICBsb24gPSB0aGlzLmxvbmcwO1xuICAgICAgICBwLnggPSBsb247XG4gICAgICAgIHAueSA9IGxhdDtcbiAgICAgICAgLy8gdHJhY2UocC50b1N0cmluZygpKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9XG4gICAgICBwLnggKj0gdGhpcy5jb247XG4gICAgICBwLnkgKj0gdGhpcy5jb247XG4gICAgICB0cyA9IHJoICogdGhpcy5jb25zIC8gKDIgKiB0aGlzLmEgKiB0aGlzLmswKTtcbiAgICAgIGxhdCA9IHRoaXMuY29uICogcGhpMnoodGhpcy5lLCB0cyk7XG4gICAgICBsb24gPSB0aGlzLmNvbiAqIGFkanVzdF9sb24odGhpcy5jb24gKiB0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0xICogcC55KSwgdGhpcy5vdmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2UgPSAyICogTWF0aC5hdGFuKHJoICogdGhpcy5jb3NYMCAvICgyICogdGhpcy5hICogdGhpcy5rMCAqIHRoaXMubXMxKSk7XG4gICAgICBsb24gPSB0aGlzLmxvbmcwO1xuICAgICAgaWYgKHJoIDw9IEVQU0xOKSB7XG4gICAgICAgIENoaSA9IHRoaXMuWDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBDaGkgPSBNYXRoLmFzaW4oTWF0aC5jb3MoY2UpICogdGhpcy5zaW5YMCArIHAueSAqIE1hdGguc2luKGNlKSAqIHRoaXMuY29zWDAgLyByaCk7XG4gICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54ICogTWF0aC5zaW4oY2UpLCByaCAqIHRoaXMuY29zWDAgKiBNYXRoLmNvcyhjZSkgLSBwLnkgKiB0aGlzLnNpblgwICogTWF0aC5zaW4oY2UpKSwgdGhpcy5vdmVyKTtcbiAgICAgIH1cbiAgICAgIGxhdCA9IC0xICogcGhpMnoodGhpcy5lLCBNYXRoLnRhbigwLjUgKiAoSEFMRl9QSSArIENoaSkpKTtcbiAgICB9XG4gIH1cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG5cbiAgLy8gdHJhY2UocC50b1N0cmluZygpKTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ3N0ZXJlJywgJ1N0ZXJlb2dyYXBoaWNfU291dGhfUG9sZScsICdQb2xhcl9TdGVyZW9ncmFwaGljX3ZhcmlhbnRfQScsICdQb2xhcl9TdGVyZW9ncmFwaGljX3ZhcmlhbnRfQicsICdQb2xhcl9TdGVyZW9ncmFwaGljJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lcyxcbiAgc3Nmbl86IHNzZm5fXG59O1xuIiwiaW1wb3J0IGdhdXNzIGZyb20gJy4vZ2F1c3MnO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGh5cG90IGZyb20gJy4uL2NvbW1vbi9oeXBvdCc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luYzBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NjMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IFIyXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwaGljMFxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgZ2F1c3MuaW5pdC5hcHBseSh0aGlzKTtcbiAgaWYgKCF0aGlzLnJjKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuc2luYzAgPSBNYXRoLnNpbih0aGlzLnBoaWMwKTtcbiAgdGhpcy5jb3NjMCA9IE1hdGguY29zKHRoaXMucGhpYzApO1xuICB0aGlzLlIyID0gMiAqIHRoaXMucmM7XG4gIGlmICghdGhpcy50aXRsZSkge1xuICAgIHRoaXMudGl0bGUgPSAnT2JsaXF1ZSBTdGVyZW9ncmFwaGljIEFsdGVybmF0aXZlJztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBzaW5jLCBjb3NjLCBjb3NsLCBrO1xuICBwLnggPSBhZGp1c3RfbG9uKHAueCAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIGdhdXNzLmZvcndhcmQuYXBwbHkodGhpcywgW3BdKTtcbiAgc2luYyA9IE1hdGguc2luKHAueSk7XG4gIGNvc2MgPSBNYXRoLmNvcyhwLnkpO1xuICBjb3NsID0gTWF0aC5jb3MocC54KTtcbiAgayA9IHRoaXMuazAgKiB0aGlzLlIyIC8gKDEgKyB0aGlzLnNpbmMwICogc2luYyArIHRoaXMuY29zYzAgKiBjb3NjICogY29zbCk7XG4gIHAueCA9IGsgKiBjb3NjICogTWF0aC5zaW4ocC54KTtcbiAgcC55ID0gayAqICh0aGlzLmNvc2MwICogc2luYyAtIHRoaXMuc2luYzAgKiBjb3NjICogY29zbCk7XG4gIHAueCA9IHRoaXMuYSAqIHAueCArIHRoaXMueDA7XG4gIHAueSA9IHRoaXMuYSAqIHAueSArIHRoaXMueTA7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBzaW5jLCBjb3NjLCBsb24sIGxhdCwgcmhvO1xuICBwLnggPSAocC54IC0gdGhpcy54MCkgLyB0aGlzLmE7XG4gIHAueSA9IChwLnkgLSB0aGlzLnkwKSAvIHRoaXMuYTtcblxuICBwLnggLz0gdGhpcy5rMDtcbiAgcC55IC89IHRoaXMuazA7XG4gIGlmICgocmhvID0gaHlwb3QocC54LCBwLnkpKSkge1xuICAgIHZhciBjID0gMiAqIE1hdGguYXRhbjIocmhvLCB0aGlzLlIyKTtcbiAgICBzaW5jID0gTWF0aC5zaW4oYyk7XG4gICAgY29zYyA9IE1hdGguY29zKGMpO1xuICAgIGxhdCA9IE1hdGguYXNpbihjb3NjICogdGhpcy5zaW5jMCArIHAueSAqIHNpbmMgKiB0aGlzLmNvc2MwIC8gcmhvKTtcbiAgICBsb24gPSBNYXRoLmF0YW4yKHAueCAqIHNpbmMsIHJobyAqIHRoaXMuY29zYzAgKiBjb3NjIC0gcC55ICogdGhpcy5zaW5jMCAqIHNpbmMpO1xuICB9IGVsc2Uge1xuICAgIGxhdCA9IHRoaXMucGhpYzA7XG4gICAgbG9uID0gMDtcbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICBnYXVzcy5pbnZlcnNlLmFwcGx5KHRoaXMsIFtwXSk7XG4gIHAueCA9IGFkanVzdF9sb24ocC54ICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1N0ZXJlb2dyYXBoaWNfTm9ydGhfUG9sZScsICdPYmxpcXVlX1N0ZXJlb2dyYXBoaWMnLCAnc3RlcmVhJywgJ09ibGlxdWUgU3RlcmVvZ3JhcGhpYyBBbHRlcm5hdGl2ZScsICdEb3VibGVfU3RlcmVvZ3JhcGhpYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvLyBIZWF2aWx5IGJhc2VkIG9uIHRoaXMgdG1lcmMgcHJvamVjdGlvbiBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21ibG9jaC9tYXBzaGFwZXItcHJvai9ibG9iL21hc3Rlci9zcmMvcHJvamVjdGlvbnMvdG1lcmMuanNcblxuaW1wb3J0IHBqX2VuZm4gZnJvbSAnLi4vY29tbW9uL3BqX2VuZm4nO1xuaW1wb3J0IHBqX21sZm4gZnJvbSAnLi4vY29tbW9uL3BqX21sZm4nO1xuaW1wb3J0IHBqX2ludl9tbGZuIGZyb20gJy4uL2NvbW1vbi9wal9pbnZfbWxmbic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbmltcG9ydCB7IEVQU0xOLCBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgc2lnbiBmcm9tICcuLi9jb21tb24vc2lnbic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gZW5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtbDBcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMueDAgPSB0aGlzLngwICE9PSB1bmRlZmluZWQgPyB0aGlzLngwIDogMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgIT09IHVuZGVmaW5lZCA/IHRoaXMueTAgOiAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sb25nMCA6IDA7XG4gIHRoaXMubGF0MCA9IHRoaXMubGF0MCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sYXQwIDogMDtcblxuICBpZiAodGhpcy5lcykge1xuICAgIHRoaXMuZW4gPSBwal9lbmZuKHRoaXMuZXMpO1xuICAgIHRoaXMubWwwID0gcGpfbWxmbih0aGlzLmxhdDAsIE1hdGguc2luKHRoaXMubGF0MCksIE1hdGguY29zKHRoaXMubGF0MCksIHRoaXMuZW4pO1xuICB9XG59XG5cbi8qKlxuICAgIFRyYW5zdmVyc2UgTWVyY2F0b3IgRm9yd2FyZCAgLSBsb25nL2xhdCB0byB4L3lcbiAgICBsb25nL2xhdCBpbiByYWRpYW5zXG4gICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgdmFyIGRlbHRhX2xvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIGNvbjtcbiAgdmFyIHgsIHk7XG4gIHZhciBzaW5fcGhpID0gTWF0aC5zaW4obGF0KTtcbiAgdmFyIGNvc19waGkgPSBNYXRoLmNvcyhsYXQpO1xuXG4gIGlmICghdGhpcy5lcykge1xuICAgIHZhciBiID0gY29zX3BoaSAqIE1hdGguc2luKGRlbHRhX2xvbik7XG5cbiAgICBpZiAoKE1hdGguYWJzKE1hdGguYWJzKGIpIC0gMSkpIDwgRVBTTE4pIHtcbiAgICAgIHJldHVybiAoOTMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0gMC41ICogdGhpcy5hICogdGhpcy5rMCAqIE1hdGgubG9nKCgxICsgYikgLyAoMSAtIGIpKSArIHRoaXMueDA7XG4gICAgICB5ID0gY29zX3BoaSAqIE1hdGguY29zKGRlbHRhX2xvbikgLyBNYXRoLnNxcnQoMSAtIE1hdGgucG93KGIsIDIpKTtcbiAgICAgIGIgPSBNYXRoLmFicyh5KTtcblxuICAgICAgaWYgKGIgPj0gMSkge1xuICAgICAgICBpZiAoKGIgLSAxKSA+IEVQU0xOKSB7XG4gICAgICAgICAgcmV0dXJuICg5Myk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHkgPSBNYXRoLmFjb3MoeSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYXQgPCAwKSB7XG4gICAgICAgIHkgPSAteTtcbiAgICAgIH1cblxuICAgICAgeSA9IHRoaXMuYSAqIHRoaXMuazAgKiAoeSAtIHRoaXMubGF0MCkgKyB0aGlzLnkwO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYWwgPSBjb3NfcGhpICogZGVsdGFfbG9uO1xuICAgIHZhciBhbHMgPSBNYXRoLnBvdyhhbCwgMik7XG4gICAgdmFyIGMgPSB0aGlzLmVwMiAqIE1hdGgucG93KGNvc19waGksIDIpO1xuICAgIHZhciBjcyA9IE1hdGgucG93KGMsIDIpO1xuICAgIHZhciB0cSA9IE1hdGguYWJzKGNvc19waGkpID4gRVBTTE4gPyBNYXRoLnRhbihsYXQpIDogMDtcbiAgICB2YXIgdCA9IE1hdGgucG93KHRxLCAyKTtcbiAgICB2YXIgdHMgPSBNYXRoLnBvdyh0LCAyKTtcbiAgICBjb24gPSAxIC0gdGhpcy5lcyAqIE1hdGgucG93KHNpbl9waGksIDIpO1xuICAgIGFsID0gYWwgLyBNYXRoLnNxcnQoY29uKTtcbiAgICB2YXIgbWwgPSBwal9tbGZuKGxhdCwgc2luX3BoaSwgY29zX3BoaSwgdGhpcy5lbik7XG5cbiAgICB4ID0gdGhpcy5hICogKHRoaXMuazAgKiBhbCAqICgxXG4gICAgICArIGFscyAvIDYgKiAoMSAtIHQgKyBjXG4gICAgICAgICsgYWxzIC8gMjAgKiAoNSAtIDE4ICogdCArIHRzICsgMTQgKiBjIC0gNTggKiB0ICogY1xuICAgICAgICAgICsgYWxzIC8gNDIgKiAoNjEgKyAxNzkgKiB0cyAtIHRzICogdCAtIDQ3OSAqIHQpKSkpKVxuICAgICAgICArIHRoaXMueDA7XG5cbiAgICB5ID0gdGhpcy5hICogKHRoaXMuazAgKiAobWwgLSB0aGlzLm1sMFxuICAgICAgKyBzaW5fcGhpICogZGVsdGFfbG9uICogYWwgLyAyICogKDFcbiAgICAgICAgKyBhbHMgLyAxMiAqICg1IC0gdCArIDkgKiBjICsgNCAqIGNzXG4gICAgICAgICAgKyBhbHMgLyAzMCAqICg2MSArIHRzIC0gNTggKiB0ICsgMjcwICogYyAtIDMzMCAqIHQgKiBjXG4gICAgICAgICAgICArIGFscyAvIDU2ICogKDEzODUgKyA1NDMgKiB0cyAtIHRzICogdCAtIDMxMTEgKiB0KSkpKSkpXG4gICAgICAgICAgKyB0aGlzLnkwO1xuICB9XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcblxuICByZXR1cm4gcDtcbn1cblxuLyoqXG4gICAgVHJhbnN2ZXJzZSBNZXJjYXRvciBJbnZlcnNlICAtICB4L3kgdG8gbG9uZy9sYXRcbiAgKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIGNvbiwgcGhpO1xuICB2YXIgbGF0LCBsb247XG4gIHZhciB4ID0gKHAueCAtIHRoaXMueDApICogKDEgLyB0aGlzLmEpO1xuICB2YXIgeSA9IChwLnkgLSB0aGlzLnkwKSAqICgxIC8gdGhpcy5hKTtcblxuICBpZiAoIXRoaXMuZXMpIHtcbiAgICB2YXIgZiA9IE1hdGguZXhwKHggLyB0aGlzLmswKTtcbiAgICB2YXIgZyA9IDAuNSAqIChmIC0gMSAvIGYpO1xuICAgIHZhciB0ZW1wID0gdGhpcy5sYXQwICsgeSAvIHRoaXMuazA7XG4gICAgdmFyIGggPSBNYXRoLmNvcyh0ZW1wKTtcbiAgICBjb24gPSBNYXRoLnNxcnQoKDEgLSBNYXRoLnBvdyhoLCAyKSkgLyAoMSArIE1hdGgucG93KGcsIDIpKSk7XG4gICAgbGF0ID0gTWF0aC5hc2luKGNvbik7XG5cbiAgICBpZiAoeSA8IDApIHtcbiAgICAgIGxhdCA9IC1sYXQ7XG4gICAgfVxuXG4gICAgaWYgKChnID09PSAwKSAmJiAoaCA9PT0gMCkpIHtcbiAgICAgIGxvbiA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24oTWF0aC5hdGFuMihnLCBoKSArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gICAgfVxuICB9IGVsc2UgeyAvLyBlbGxpcHNvaWRhbCBmb3JtXG4gICAgY29uID0gdGhpcy5tbDAgKyB5IC8gdGhpcy5rMDtcbiAgICBwaGkgPSBwal9pbnZfbWxmbihjb24sIHRoaXMuZXMsIHRoaXMuZW4pO1xuXG4gICAgaWYgKE1hdGguYWJzKHBoaSkgPCBIQUxGX1BJKSB7XG4gICAgICB2YXIgc2luX3BoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgICB2YXIgY29zX3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgICB2YXIgdGFuX3BoaSA9IE1hdGguYWJzKGNvc19waGkpID4gRVBTTE4gPyBNYXRoLnRhbihwaGkpIDogMDtcbiAgICAgIHZhciBjID0gdGhpcy5lcDIgKiBNYXRoLnBvdyhjb3NfcGhpLCAyKTtcbiAgICAgIHZhciBjcyA9IE1hdGgucG93KGMsIDIpO1xuICAgICAgdmFyIHQgPSBNYXRoLnBvdyh0YW5fcGhpLCAyKTtcbiAgICAgIHZhciB0cyA9IE1hdGgucG93KHQsIDIpO1xuICAgICAgY29uID0gMSAtIHRoaXMuZXMgKiBNYXRoLnBvdyhzaW5fcGhpLCAyKTtcbiAgICAgIHZhciBkID0geCAqIE1hdGguc3FydChjb24pIC8gdGhpcy5rMDtcbiAgICAgIHZhciBkcyA9IE1hdGgucG93KGQsIDIpO1xuICAgICAgY29uID0gY29uICogdGFuX3BoaTtcblxuICAgICAgbGF0ID0gcGhpIC0gKGNvbiAqIGRzIC8gKDEgLSB0aGlzLmVzKSkgKiAwLjUgKiAoMVxuICAgICAgICAtIGRzIC8gMTIgKiAoNSArIDMgKiB0IC0gOSAqIGMgKiB0ICsgYyAtIDQgKiBjc1xuICAgICAgICAgIC0gZHMgLyAzMCAqICg2MSArIDkwICogdCAtIDI1MiAqIGMgKiB0ICsgNDUgKiB0cyArIDQ2ICogY1xuICAgICAgICAgICAgLSBkcyAvIDU2ICogKDEzODUgKyAzNjMzICogdCArIDQwOTUgKiB0cyArIDE1NzQgKiB0cyAqIHQpKSkpO1xuXG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAoZCAqICgxXG4gICAgICAgIC0gZHMgLyA2ICogKDEgKyAyICogdCArIGNcbiAgICAgICAgICAtIGRzIC8gMjAgKiAoNSArIDI4ICogdCArIDI0ICogdHMgKyA4ICogYyAqIHQgKyA2ICogY1xuICAgICAgICAgICAgLSBkcyAvIDQyICogKDYxICsgNjYyICogdCArIDEzMjAgKiB0cyArIDcyMCAqIHRzICogdCkpKSkgLyBjb3NfcGhpKSwgdGhpcy5vdmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF0ID0gSEFMRl9QSSAqIHNpZ24oeSk7XG4gICAgICBsb24gPSAwO1xuICAgIH1cbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuXG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydGYXN0X1RyYW5zdmVyc2VfTWVyY2F0b3InLCAnRmFzdCBUcmFuc3ZlcnNlIE1lcmNhdG9yJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB7IEQyUiwgSEFMRl9QSSwgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBoeXBvdCBmcm9tICcuLi9jb21tb24vaHlwb3QnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG1vZGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5waDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NwaDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwbjFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBoXG4gKiBAcHJvcGVydHkge251bWJlcn0gcnBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwXG4gKiBAcHJvcGVydHkge251bWJlcn0gaDFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwZmFjdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGlsdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGF6aVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNnXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2dcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjd1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHN3XG4gKi9cblxudmFyIG1vZGUgPSB7XG4gIE5fUE9MRTogMCxcbiAgU19QT0xFOiAxLFxuICBFUVVJVDogMixcbiAgT0JMSVE6IDNcbn07XG5cbnZhciBwYXJhbXMgPSB7XG4gIGg6IHsgZGVmOiAxMDAwMDAsIG51bTogdHJ1ZSB9LCAvLyBkZWZhdWx0IGlzIEthcm1hbiBsaW5lLCBubyBkZWZhdWx0IGluIFBST0ouN1xuICBhemk6IHsgZGVmOiAwLCBudW06IHRydWUsIGRlZ3JlZXM6IHRydWUgfSwgLy8gZGVmYXVsdCBpcyBOb3J0aFxuICB0aWx0OiB7IGRlZjogMCwgbnVtOiB0cnVlLCBkZWdyZWVzOiB0cnVlIH0sIC8vIGRlZmF1bHQgaXMgTmFkaXJcbiAgbG9uZzA6IHsgZGVmOiAwLCBudW06IHRydWUgfSwgLy8gZGVmYXVsdCBpcyBHcmVlbndpY2gsIGNvbnZlcnNpb24gdG8gcmFkIGlzIGF1dG9tYXRpY1xuICBsYXQwOiB7IGRlZjogMCwgbnVtOiB0cnVlIH0gLy8gZGVmYXVsdCBpcyBFcXVhdG9yLCBjb252ZXJzaW9uIHRvIHJhZCBpcyBhdXRvbWF0aWNcbn07XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzW3BdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpc1twXSA9IHBhcmFtc1twXS5kZWY7XG4gICAgfSBlbHNlIGlmIChwYXJhbXNbcF0ubnVtICYmIGlzTmFOKHRoaXNbcF0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyIHZhbHVlLCBtdXN0IGJlIG51bWVyaWMgJyArIHAgKyAnID0gJyArIHRoaXNbcF0pO1xuICAgIH0gZWxzZSBpZiAocGFyYW1zW3BdLm51bSkge1xuICAgICAgdGhpc1twXSA9IHBhcnNlRmxvYXQodGhpc1twXSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXNbcF0uZGVncmVlcykge1xuICAgICAgdGhpc1twXSA9IHRoaXNbcF0gKiBEMlI7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xuXG4gIGlmIChNYXRoLmFicygoTWF0aC5hYnModGhpcy5sYXQwKSAtIEhBTEZfUEkpKSA8IEVQU0xOKSB7XG4gICAgdGhpcy5tb2RlID0gdGhpcy5sYXQwIDwgMCA/IG1vZGUuU19QT0xFIDogbW9kZS5OX1BPTEU7XG4gIH0gZWxzZSBpZiAoTWF0aC5hYnModGhpcy5sYXQwKSA8IEVQU0xOKSB7XG4gICAgdGhpcy5tb2RlID0gbW9kZS5FUVVJVDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlLk9CTElRO1xuICAgIHRoaXMuc2lucGgwID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgICB0aGlzLmNvc3BoMCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIH1cblxuICB0aGlzLnBuMSA9IHRoaXMuaCAvIHRoaXMuYTsgLy8gTm9ybWFsaXplIHJlbGF0aXZlIHRvIHRoZSBFYXJ0aCdzIHJhZGl1c1xuXG4gIGlmICh0aGlzLnBuMSA8PSAwIHx8IHRoaXMucG4xID4gMWUxMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZWlnaHQnKTtcbiAgfVxuXG4gIHRoaXMucCA9IDEgKyB0aGlzLnBuMTtcbiAgdGhpcy5ycCA9IDEgLyB0aGlzLnA7XG4gIHRoaXMuaDEgPSAxIC8gdGhpcy5wbjE7XG4gIHRoaXMucGZhY3QgPSAodGhpcy5wICsgMSkgKiB0aGlzLmgxO1xuICB0aGlzLmVzID0gMDtcblxuICB2YXIgb21lZ2EgPSB0aGlzLnRpbHQ7XG4gIHZhciBnYW1tYSA9IHRoaXMuYXppO1xuICB0aGlzLmNnID0gTWF0aC5jb3MoZ2FtbWEpO1xuICB0aGlzLnNnID0gTWF0aC5zaW4oZ2FtbWEpO1xuICB0aGlzLmN3ID0gTWF0aC5jb3Mob21lZ2EpO1xuICB0aGlzLnN3ID0gTWF0aC5zaW4ob21lZ2EpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHAueCAtPSB0aGlzLmxvbmcwO1xuICB2YXIgc2lucGhpID0gTWF0aC5zaW4ocC55KTtcbiAgdmFyIGNvc3BoaSA9IE1hdGguY29zKHAueSk7XG4gIHZhciBjb3NsYW0gPSBNYXRoLmNvcyhwLngpO1xuICB2YXIgeCwgeTtcbiAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICBjYXNlIG1vZGUuT0JMSVE6XG4gICAgICB5ID0gdGhpcy5zaW5waDAgKiBzaW5waGkgKyB0aGlzLmNvc3BoMCAqIGNvc3BoaSAqIGNvc2xhbTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbW9kZS5FUVVJVDpcbiAgICAgIHkgPSBjb3NwaGkgKiBjb3NsYW07XG4gICAgICBicmVhaztcbiAgICBjYXNlIG1vZGUuU19QT0xFOlxuICAgICAgeSA9IC1zaW5waGk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIG1vZGUuTl9QT0xFOlxuICAgICAgeSA9IHNpbnBoaTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHkgPSB0aGlzLnBuMSAvICh0aGlzLnAgLSB5KTtcbiAgeCA9IHkgKiBjb3NwaGkgKiBNYXRoLnNpbihwLngpO1xuXG4gIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgY2FzZSBtb2RlLk9CTElROlxuICAgICAgeSAqPSB0aGlzLmNvc3BoMCAqIHNpbnBoaSAtIHRoaXMuc2lucGgwICogY29zcGhpICogY29zbGFtO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLkVRVUlUOlxuICAgICAgeSAqPSBzaW5waGk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIG1vZGUuTl9QT0xFOlxuICAgICAgeSAqPSAtKGNvc3BoaSAqIGNvc2xhbSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIG1vZGUuU19QT0xFOlxuICAgICAgeSAqPSBjb3NwaGkgKiBjb3NsYW07XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIFRpbHRcbiAgdmFyIHl0LCBiYTtcbiAgeXQgPSB5ICogdGhpcy5jZyArIHggKiB0aGlzLnNnO1xuICBiYSA9IDEgLyAoeXQgKiB0aGlzLnN3ICogdGhpcy5oMSArIHRoaXMuY3cpO1xuICB4ID0gKHggKiB0aGlzLmNnIC0geSAqIHRoaXMuc2cpICogdGhpcy5jdyAqIGJhO1xuICB5ID0geXQgKiBiYTtcblxuICBwLnggPSB4ICogdGhpcy5hO1xuICBwLnkgPSB5ICogdGhpcy5hO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLz0gdGhpcy5hO1xuICBwLnkgLz0gdGhpcy5hO1xuICB2YXIgciA9IHsgeDogcC54LCB5OiBwLnkgfTtcblxuICAvLyBVbi1UaWx0XG4gIHZhciBibSwgYnEsIHl0O1xuICB5dCA9IDEgLyAodGhpcy5wbjEgLSBwLnkgKiB0aGlzLnN3KTtcbiAgYm0gPSB0aGlzLnBuMSAqIHAueCAqIHl0O1xuICBicSA9IHRoaXMucG4xICogcC55ICogdGhpcy5jdyAqIHl0O1xuICBwLnggPSBibSAqIHRoaXMuY2cgKyBicSAqIHRoaXMuc2c7XG4gIHAueSA9IGJxICogdGhpcy5jZyAtIGJtICogdGhpcy5zZztcblxuICB2YXIgcmggPSBoeXBvdChwLngsIHAueSk7XG4gIGlmIChNYXRoLmFicyhyaCkgPCBFUFNMTikge1xuICAgIHIueCA9IDA7XG4gICAgci55ID0gcC55O1xuICB9IGVsc2Uge1xuICAgIHZhciBjb3N6LCBzaW56O1xuICAgIHNpbnogPSAxIC0gcmggKiByaCAqIHRoaXMucGZhY3Q7XG4gICAgc2lueiA9ICh0aGlzLnAgLSBNYXRoLnNxcnQoc2lueikpIC8gKHRoaXMucG4xIC8gcmggKyByaCAvIHRoaXMucG4xKTtcbiAgICBjb3N6ID0gTWF0aC5zcXJ0KDEgLSBzaW56ICogc2lueik7XG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgbW9kZS5PQkxJUTpcbiAgICAgICAgci55ID0gTWF0aC5hc2luKGNvc3ogKiB0aGlzLnNpbnBoMCArIHAueSAqIHNpbnogKiB0aGlzLmNvc3BoMCAvIHJoKTtcbiAgICAgICAgcC55ID0gKGNvc3ogLSB0aGlzLnNpbnBoMCAqIE1hdGguc2luKHIueSkpICogcmg7XG4gICAgICAgIHAueCAqPSBzaW56ICogdGhpcy5jb3NwaDA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBtb2RlLkVRVUlUOlxuICAgICAgICByLnkgPSBNYXRoLmFzaW4ocC55ICogc2lueiAvIHJoKTtcbiAgICAgICAgcC55ID0gY29zeiAqIHJoO1xuICAgICAgICBwLnggKj0gc2luejtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG1vZGUuTl9QT0xFOlxuICAgICAgICByLnkgPSBNYXRoLmFzaW4oY29zeik7XG4gICAgICAgIHAueSA9IC1wLnk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBtb2RlLlNfUE9MRTpcbiAgICAgICAgci55ID0gLU1hdGguYXNpbihjb3N6KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHIueCA9IE1hdGguYXRhbjIocC54LCBwLnkpO1xuICB9XG5cbiAgcC54ID0gci54ICsgdGhpcy5sb25nMDtcbiAgcC55ID0gci55O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnVGlsdGVkX1BlcnNwZWN0aXZlJywgJ3RwZXJzJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3Rfem9uZSBmcm9tICcuLi9jb21tb24vYWRqdXN0X3pvbmUnO1xuaW1wb3J0IGV0bWVyYyBmcm9tICcuL2V0bWVyYyc7XG5leHBvcnQgdmFyIGRlcGVuZHNPbiA9ICdldG1lcmMnO1xuaW1wb3J0IHsgRDJSIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb259ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHpvbmUgPSBhZGp1c3Rfem9uZSh0aGlzLnpvbmUsIHRoaXMubG9uZzApO1xuICBpZiAoem9uZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIHV0bSB6b25lJyk7XG4gIH1cbiAgdGhpcy5sYXQwID0gMDtcbiAgdGhpcy5sb25nMCA9ICgoNiAqIE1hdGguYWJzKHpvbmUpKSAtIDE4MykgKiBEMlI7XG4gIHRoaXMueDAgPSA1MDAwMDA7XG4gIHRoaXMueTAgPSB0aGlzLnV0bVNvdXRoID8gMTAwMDAwMDAgOiAwO1xuICB0aGlzLmswID0gMC45OTk2O1xuXG4gIGV0bWVyYy5pbml0LmFwcGx5KHRoaXMpO1xuICB0aGlzLmZvcndhcmQgPSBldG1lcmMuZm9yd2FyZDtcbiAgdGhpcy5pbnZlcnNlID0gZXRtZXJjLmludmVyc2U7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1VuaXZlcnNhbCBUcmFuc3ZlcnNlIE1lcmNhdG9yIFN5c3RlbScsICd1dG0nXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgbmFtZXM6IG5hbWVzLFxuICBkZXBlbmRzT246IGRlcGVuZHNPblxufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuaW1wb3J0IHsgSEFMRl9QSSwgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuaW1wb3J0IGFzaW56IGZyb20gJy4uL2NvbW1vbi9hc2lueic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gUiAtIFJhZGl1cyBvZiB0aGUgRWFydGhcbiAqL1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIFZhbiBEZXIgR3JpbnRlbiBwcm9qZWN0aW9uXG4gKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvLyB0aGlzLlIgPSA2MzcwOTk3OyAvL1JhZGl1cyBvZiBlYXJ0aFxuICB0aGlzLlIgPSB0aGlzLmE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgeCwgeTtcblxuICBpZiAoTWF0aC5hYnMobGF0KSA8PSBFUFNMTikge1xuICAgIHggPSB0aGlzLngwICsgdGhpcy5SICogZGxvbjtcbiAgICB5ID0gdGhpcy55MDtcbiAgfVxuICB2YXIgdGhldGEgPSBhc2lueigyICogTWF0aC5hYnMobGF0IC8gTWF0aC5QSSkpO1xuICBpZiAoKE1hdGguYWJzKGRsb24pIDw9IEVQU0xOKSB8fCAoTWF0aC5hYnMoTWF0aC5hYnMobGF0KSAtIEhBTEZfUEkpIDw9IEVQU0xOKSkge1xuICAgIHggPSB0aGlzLngwO1xuICAgIGlmIChsYXQgPj0gMCkge1xuICAgICAgeSA9IHRoaXMueTAgKyBNYXRoLlBJICogdGhpcy5SICogTWF0aC50YW4oMC41ICogdGhldGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB5ID0gdGhpcy55MCArIE1hdGguUEkgKiB0aGlzLlIgKiAtTWF0aC50YW4oMC41ICogdGhldGEpO1xuICAgIH1cbiAgICAvLyAgcmV0dXJuKE9LKTtcbiAgfVxuICB2YXIgYWwgPSAwLjUgKiBNYXRoLmFicygoTWF0aC5QSSAvIGRsb24pIC0gKGRsb24gLyBNYXRoLlBJKSk7XG4gIHZhciBhc3EgPSBhbCAqIGFsO1xuICB2YXIgc2ludGggPSBNYXRoLnNpbih0aGV0YSk7XG4gIHZhciBjb3N0aCA9IE1hdGguY29zKHRoZXRhKTtcblxuICB2YXIgZyA9IGNvc3RoIC8gKHNpbnRoICsgY29zdGggLSAxKTtcbiAgdmFyIGdzcSA9IGcgKiBnO1xuICB2YXIgbSA9IGcgKiAoMiAvIHNpbnRoIC0gMSk7XG4gIHZhciBtc3EgPSBtICogbTtcbiAgdmFyIGNvbiA9IE1hdGguUEkgKiB0aGlzLlIgKiAoYWwgKiAoZyAtIG1zcSkgKyBNYXRoLnNxcnQoYXNxICogKGcgLSBtc3EpICogKGcgLSBtc3EpIC0gKG1zcSArIGFzcSkgKiAoZ3NxIC0gbXNxKSkpIC8gKG1zcSArIGFzcSk7XG4gIGlmIChkbG9uIDwgMCkge1xuICAgIGNvbiA9IC1jb247XG4gIH1cbiAgeCA9IHRoaXMueDAgKyBjb247XG4gIC8vIGNvbiA9IE1hdGguYWJzKGNvbiAvIChNYXRoLlBJICogdGhpcy5SKSk7XG4gIHZhciBxID0gYXNxICsgZztcbiAgY29uID0gTWF0aC5QSSAqIHRoaXMuUiAqIChtICogcSAtIGFsICogTWF0aC5zcXJ0KChtc3EgKyBhc3EpICogKGFzcSArIDEpIC0gcSAqIHEpKSAvIChtc3EgKyBhc3EpO1xuICBpZiAobGF0ID49IDApIHtcbiAgICAvLyB5ID0gdGhpcy55MCArIE1hdGguUEkgKiB0aGlzLlIgKiBNYXRoLnNxcnQoMSAtIGNvbiAqIGNvbiAtIDIgKiBhbCAqIGNvbik7XG4gICAgeSA9IHRoaXMueTAgKyBjb247XG4gIH0gZWxzZSB7XG4gICAgLy8geSA9IHRoaXMueTAgLSBNYXRoLlBJICogdGhpcy5SICogTWF0aC5zcXJ0KDEgLSBjb24gKiBjb24gLSAyICogYWwgKiBjb24pO1xuICAgIHkgPSB0aGlzLnkwIC0gY29uO1xuICB9XG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG4vKiBWYW4gRGVyIEdyaW50ZW4gaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbG9uLCBsYXQ7XG4gIHZhciB4eCwgeXksIHh5cywgYzEsIGMyLCBjMztcbiAgdmFyIGExO1xuICB2YXIgbTE7XG4gIHZhciBjb247XG4gIHZhciB0aDE7XG4gIHZhciBkO1xuXG4gIC8qIGludmVyc2UgZXF1YXRpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICBjb24gPSBNYXRoLlBJICogdGhpcy5SO1xuICB4eCA9IHAueCAvIGNvbjtcbiAgeXkgPSBwLnkgLyBjb247XG4gIHh5cyA9IHh4ICogeHggKyB5eSAqIHl5O1xuICBjMSA9IC1NYXRoLmFicyh5eSkgKiAoMSArIHh5cyk7XG4gIGMyID0gYzEgLSAyICogeXkgKiB5eSArIHh4ICogeHg7XG4gIGMzID0gLTIgKiBjMSArIDEgKyAyICogeXkgKiB5eSArIHh5cyAqIHh5cztcbiAgZCA9IHl5ICogeXkgLyBjMyArICgyICogYzIgKiBjMiAqIGMyIC8gYzMgLyBjMyAvIGMzIC0gOSAqIGMxICogYzIgLyBjMyAvIGMzKSAvIDI3O1xuICBhMSA9IChjMSAtIGMyICogYzIgLyAzIC8gYzMpIC8gYzM7XG4gIG0xID0gMiAqIE1hdGguc3FydCgtYTEgLyAzKTtcbiAgY29uID0gKCgzICogZCkgLyBhMSkgLyBtMTtcbiAgaWYgKE1hdGguYWJzKGNvbikgPiAxKSB7XG4gICAgaWYgKGNvbiA+PSAwKSB7XG4gICAgICBjb24gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb24gPSAtMTtcbiAgICB9XG4gIH1cbiAgdGgxID0gTWF0aC5hY29zKGNvbikgLyAzO1xuICBpZiAocC55ID49IDApIHtcbiAgICBsYXQgPSAoLW0xICogTWF0aC5jb3ModGgxICsgTWF0aC5QSSAvIDMpIC0gYzIgLyAzIC8gYzMpICogTWF0aC5QSTtcbiAgfSBlbHNlIHtcbiAgICBsYXQgPSAtKC1tMSAqIE1hdGguY29zKHRoMSArIE1hdGguUEkgLyAzKSAtIGMyIC8gMyAvIGMzKSAqIE1hdGguUEk7XG4gIH1cblxuICBpZiAoTWF0aC5hYnMoeHgpIDwgRVBTTE4pIHtcbiAgICBsb24gPSB0aGlzLmxvbmcwO1xuICB9IGVsc2Uge1xuICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguUEkgKiAoeHlzIC0gMSArIE1hdGguc3FydCgxICsgMiAqICh4eCAqIHh4IC0geXkgKiB5eSkgKyB4eXMgKiB4eXMpKSAvIDIgLyB4eCwgdGhpcy5vdmVyKTtcbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnVmFuX2Rlcl9HcmludGVuX0knLCAnVmFuRGVyR3JpbnRlbicsICdWYW5fZGVyX0dyaW50ZW4nLCAndmFuZGcnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHsgRDJSLCBSMkQsIFBKRF8zUEFSQU0sIFBKRF83UEFSQU0sIFBKRF9HUklEU0hJRlQgfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IGRhdHVtX3RyYW5zZm9ybSBmcm9tICcuL2RhdHVtX3RyYW5zZm9ybSc7XG5pbXBvcnQgYWRqdXN0X2F4aXMgZnJvbSAnLi9hZGp1c3RfYXhpcyc7XG5pbXBvcnQgcHJvaiBmcm9tICcuL1Byb2onO1xuaW1wb3J0IHRvUG9pbnQgZnJvbSAnLi9jb21tb24vdG9Qb2ludCc7XG5pbXBvcnQgY2hlY2tTYW5pdHkgZnJvbSAnLi9jaGVja1Nhbml0eSc7XG5cbmZ1bmN0aW9uIGNoZWNrTm90V0dTKHNvdXJjZSwgZGVzdCkge1xuICByZXR1cm4gKFxuICAgIChzb3VyY2UuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEXzNQQVJBTSB8fCBzb3VyY2UuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSB8fCBzb3VyY2UuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEX0dSSURTSElGVCkgJiYgZGVzdC5kYXR1bUNvZGUgIT09ICdXR1M4NCcpXG4gIHx8ICgoZGVzdC5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfM1BBUkFNIHx8IGRlc3QuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSB8fCBkZXN0LmRhdHVtLmRhdHVtX3R5cGUgPT09IFBKRF9HUklEU0hJRlQpICYmIHNvdXJjZS5kYXR1bUNvZGUgIT09ICdXR1M4NCcpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gc291cmNlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259IGRlc3RcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzfSBwb2ludFxuICogQHBhcmFtIHtib29sZWFufSBlbmZvcmNlQXhpc1xuICogQHJldHVybnMge2ltcG9ydCgnLi9jb3JlJykuSW50ZXJmYWNlQ29vcmRpbmF0ZXMgfCB1bmRlZmluZWR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRyYW5zZm9ybShzb3VyY2UsIGRlc3QsIHBvaW50LCBlbmZvcmNlQXhpcykge1xuICB2YXIgd2dzODQ7XG4gIGlmIChBcnJheS5pc0FycmF5KHBvaW50KSkge1xuICAgIHBvaW50ID0gdG9Qb2ludChwb2ludCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQ2xvbmUgdGhlIHBvaW50IG9iamVjdCBzbyBpbnB1dHMgZG9uJ3QgZ2V0IG1vZGlmaWVkXG4gICAgcG9pbnQgPSB7XG4gICAgICB4OiBwb2ludC54LFxuICAgICAgeTogcG9pbnQueSxcbiAgICAgIHo6IHBvaW50LnosXG4gICAgICBtOiBwb2ludC5tXG4gICAgfTtcbiAgfVxuICB2YXIgaGFzWiA9IHBvaW50LnogIT09IHVuZGVmaW5lZDtcbiAgY2hlY2tTYW5pdHkocG9pbnQpO1xuICAvLyBXb3JrYXJvdW5kIGZvciBkYXR1bSBzaGlmdHMgdG93Z3M4NCwgaWYgZWl0aGVyIHNvdXJjZSBvciBkZXN0aW5hdGlvbiBwcm9qZWN0aW9uIGlzIG5vdCB3Z3M4NFxuICBpZiAoc291cmNlLmRhdHVtICYmIGRlc3QuZGF0dW0gJiYgY2hlY2tOb3RXR1Moc291cmNlLCBkZXN0KSkge1xuICAgIHdnczg0ID0gbmV3IHByb2ooJ1dHUzg0Jyk7XG4gICAgcG9pbnQgPSB0cmFuc2Zvcm0oc291cmNlLCB3Z3M4NCwgcG9pbnQsIGVuZm9yY2VBeGlzKTtcbiAgICBzb3VyY2UgPSB3Z3M4NDtcbiAgfVxuICAvLyBER1IsIDIwMTAvMTEvMTJcbiAgaWYgKGVuZm9yY2VBeGlzICYmIHNvdXJjZS5heGlzICE9PSAnZW51Jykge1xuICAgIHBvaW50ID0gYWRqdXN0X2F4aXMoc291cmNlLCBmYWxzZSwgcG9pbnQpO1xuICB9XG4gIC8vIFRyYW5zZm9ybSBzb3VyY2UgcG9pbnRzIHRvIGxvbmcvbGF0LCBpZiB0aGV5IGFyZW4ndCBhbHJlYWR5LlxuICBpZiAoc291cmNlLnByb2pOYW1lID09PSAnbG9uZ2xhdCcpIHtcbiAgICBwb2ludCA9IHtcbiAgICAgIHg6IHBvaW50LnggKiBEMlIsXG4gICAgICB5OiBwb2ludC55ICogRDJSLFxuICAgICAgejogcG9pbnQueiB8fCAwXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoc291cmNlLnRvX21ldGVyKSB7XG4gICAgICBwb2ludCA9IHtcbiAgICAgICAgeDogcG9pbnQueCAqIHNvdXJjZS50b19tZXRlcixcbiAgICAgICAgeTogcG9pbnQueSAqIHNvdXJjZS50b19tZXRlcixcbiAgICAgICAgejogcG9pbnQueiB8fCAwXG4gICAgICB9O1xuICAgIH1cbiAgICBwb2ludCA9IHNvdXJjZS5pbnZlcnNlKHBvaW50KTsgLy8gQ29udmVydCBDYXJ0ZXNpYW4gdG8gbG9uZ2xhdFxuICAgIGlmICghcG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgLy8gQWRqdXN0IGZvciB0aGUgcHJpbWUgbWVyaWRpYW4gaWYgbmVjZXNzYXJ5XG4gIGlmIChzb3VyY2UuZnJvbV9ncmVlbndpY2gpIHtcbiAgICBwb2ludC54ICs9IHNvdXJjZS5mcm9tX2dyZWVud2ljaDtcbiAgfVxuXG4gIC8vIENvbnZlcnQgZGF0dW1zIGlmIG5lZWRlZCwgYW5kIGlmIHBvc3NpYmxlLlxuICBwb2ludCA9IGRhdHVtX3RyYW5zZm9ybShzb3VyY2UuZGF0dW0sIGRlc3QuZGF0dW0sIHBvaW50KTtcbiAgaWYgKCFwb2ludCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHBvaW50ID0gLyoqIEB0eXBlIHtpbXBvcnQoJy4vY29yZScpLkludGVyZmFjZUNvb3JkaW5hdGVzfSAqLyAocG9pbnQpO1xuXG4gIC8vIEFkanVzdCBmb3IgdGhlIHByaW1lIG1lcmlkaWFuIGlmIG5lY2Vzc2FyeVxuICBpZiAoZGVzdC5mcm9tX2dyZWVud2ljaCkge1xuICAgIHBvaW50ID0ge1xuICAgICAgeDogcG9pbnQueCAtIGRlc3QuZnJvbV9ncmVlbndpY2gsXG4gICAgICB5OiBwb2ludC55LFxuICAgICAgejogcG9pbnQueiB8fCAwXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXN0LnByb2pOYW1lID09PSAnbG9uZ2xhdCcpIHtcbiAgICAvLyBjb252ZXJ0IHJhZGlhbnMgdG8gZGVjaW1hbCBkZWdyZWVzXG4gICAgcG9pbnQgPSB7XG4gICAgICB4OiBwb2ludC54ICogUjJELFxuICAgICAgeTogcG9pbnQueSAqIFIyRCxcbiAgICAgIHo6IHBvaW50LnogfHwgMFxuICAgIH07XG4gIH0gZWxzZSB7IC8vIGVsc2UgcHJvamVjdFxuICAgIHBvaW50ID0gZGVzdC5mb3J3YXJkKHBvaW50KTtcbiAgICBpZiAoZGVzdC50b19tZXRlcikge1xuICAgICAgcG9pbnQgPSB7XG4gICAgICAgIHg6IHBvaW50LnggLyBkZXN0LnRvX21ldGVyLFxuICAgICAgICB5OiBwb2ludC55IC8gZGVzdC50b19tZXRlcixcbiAgICAgICAgejogcG9pbnQueiB8fCAwXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIERHUiwgMjAxMC8xMS8xMlxuICBpZiAoZW5mb3JjZUF4aXMgJiYgZGVzdC5heGlzICE9PSAnZW51Jykge1xuICAgIHJldHVybiBhZGp1c3RfYXhpcyhkZXN0LCB0cnVlLCBwb2ludCk7XG4gIH1cblxuICBpZiAocG9pbnQgJiYgIWhhc1opIHtcbiAgICBkZWxldGUgcG9pbnQuejtcbiAgfVxuICByZXR1cm4gcG9pbnQ7XG59XG4iLCJpbXBvcnQgdG1lcmMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvdG1lcmMnO1xuaW1wb3J0IGV0bWVyYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9ldG1lcmMnO1xuaW1wb3J0IHV0bSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy91dG0nO1xuaW1wb3J0IHN0ZXJlYSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9zdGVyZWEnO1xuaW1wb3J0IHN0ZXJlIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3N0ZXJlJztcbmltcG9ydCBzb21lcmMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvc29tZXJjJztcbmltcG9ydCBvbWVyYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9vbWVyYyc7XG5pbXBvcnQgbGNjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2xjYyc7XG5pbXBvcnQga3JvdmFrIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2tyb3Zhayc7XG5pbXBvcnQgY2FzcyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9jYXNzJztcbmltcG9ydCBsYWVhIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2xhZWEnO1xuaW1wb3J0IGFlYSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9hZWEnO1xuaW1wb3J0IGdub20gZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZ25vbSc7XG5pbXBvcnQgY2VhIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2NlYSc7XG5pbXBvcnQgZXFjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2VxYyc7XG5pbXBvcnQgcG9seSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9wb2x5JztcbmltcG9ydCBuem1nIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL256bWcnO1xuaW1wb3J0IG1pbGwgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbWlsbCc7XG5pbXBvcnQgc2ludSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9zaW51JztcbmltcG9ydCBtb2xsIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL21vbGwnO1xuaW1wb3J0IGVxZGMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZXFkYyc7XG5pbXBvcnQgdmFuZGcgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvdmFuZGcnO1xuaW1wb3J0IGFlcWQgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvYWVxZCc7XG5pbXBvcnQgb3J0aG8gZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvb3J0aG8nO1xuaW1wb3J0IHFzYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9xc2MnO1xuaW1wb3J0IHJvYmluIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3JvYmluJztcbmltcG9ydCBnZW9jZW50IGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2dlb2NlbnQnO1xuaW1wb3J0IHRwZXJzIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3RwZXJzJztcbmltcG9ydCBnZW9zIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2dlb3MnO1xuaW1wb3J0IGVxZWFydGggZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZXFlYXJ0aCc7XG5pbXBvcnQgYm9ubmUgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvYm9ubmUnO1xuaW1wb3J0IG9iX3RyYW4gZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvb2JfdHJhbic7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHJvajQpIHtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQodG1lcmMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChldG1lcmMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZCh1dG0pO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChzdGVyZWEpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChzdGVyZSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHNvbWVyYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG9tZXJjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobGNjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoa3JvdmFrKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoY2Fzcyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGxhZWEpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChhZWEpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChnbm9tKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoY2VhKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZXFjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQocG9seSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG56bWcpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChtaWxsKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoc2ludSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG1vbGwpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChlcWRjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQodmFuZGcpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChhZXFkKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQob3J0aG8pO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChxc2MpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChyb2Jpbik7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGdlb2NlbnQpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZCh0cGVycyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGdlb3MpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChlcWVhcnRoKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoYm9ubmUpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChvYl90cmFuKTtcbn1cbiIsImltcG9ydCBQUk9KSlNPTkJ1aWxkZXJCYXNlIGZyb20gJy4vUFJPSkpTT05CdWlsZGVyQmFzZS5qcyc7XG5cbmNsYXNzIFBST0pKU09OQnVpbGRlcjIwMTUgZXh0ZW5kcyBQUk9KSlNPTkJ1aWxkZXJCYXNlIHtcbiAgc3RhdGljIGNvbnZlcnQobm9kZSwgcmVzdWx0ID0ge30pIHtcbiAgICBzdXBlci5jb252ZXJ0KG5vZGUsIHJlc3VsdCk7XG5cbiAgICAvLyBTa2lwIGBDU2AgYW5kIGBVU0FHRWAgbm9kZXMgZm9yIFdLVDItMjAxNVxuICAgIGlmIChyZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0gJiYgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtLnN1YnR5cGUgPT09ICdDYXJ0ZXNpYW4nKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtO1xuICAgIH1cbiAgICBpZiAocmVzdWx0LnVzYWdlKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LnVzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUFJPSkpTT05CdWlsZGVyMjAxNTsiLCJpbXBvcnQgUFJPSkpTT05CdWlsZGVyQmFzZSBmcm9tICcuL1BST0pKU09OQnVpbGRlckJhc2UuanMnO1xuXG5jbGFzcyBQUk9KSlNPTkJ1aWxkZXIyMDE5IGV4dGVuZHMgUFJPSkpTT05CdWlsZGVyQmFzZSB7XG4gIHN0YXRpYyBjb252ZXJ0KG5vZGUsIHJlc3VsdCA9IHt9KSB7XG4gICAgc3VwZXIuY29udmVydChub2RlLCByZXN1bHQpO1xuXG4gICAgLy8gSGFuZGxlIGBDU2Agbm9kZSBmb3IgV0tUMi0yMDE5XG4gICAgY29uc3QgY3NOb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdDUycpO1xuICAgIGlmIChjc05vZGUpIHtcbiAgICAgIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbSA9IHtcbiAgICAgICAgc3VidHlwZTogY3NOb2RlWzFdLFxuICAgICAgICBheGlzOiB0aGlzLmV4dHJhY3RBeGVzKG5vZGUpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYFVTQUdFYCBub2RlIGZvciBXS1QyLTIwMTlcbiAgICBjb25zdCB1c2FnZU5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ1VTQUdFJyk7XG4gICAgaWYgKHVzYWdlTm9kZSkge1xuICAgICAgY29uc3Qgc2NvcGUgPSB1c2FnZU5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnU0NPUEUnKTtcbiAgICAgIGNvbnN0IGFyZWEgPSB1c2FnZU5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQVJFQScpO1xuICAgICAgY29uc3QgYmJveCA9IHVzYWdlTm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdCQk9YJyk7XG4gICAgICByZXN1bHQudXNhZ2UgPSB7fTtcbiAgICAgIGlmIChzY29wZSkge1xuICAgICAgICByZXN1bHQudXNhZ2Uuc2NvcGUgPSBzY29wZVsxXTtcbiAgICAgIH1cbiAgICAgIGlmIChhcmVhKSB7XG4gICAgICAgIHJlc3VsdC51c2FnZS5hcmVhID0gYXJlYVsxXTtcbiAgICAgIH1cbiAgICAgIGlmIChiYm94KSB7XG4gICAgICAgIHJlc3VsdC51c2FnZS5iYm94ID0gYmJveC5zbGljZSgxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBST0pKU09OQnVpbGRlcjIwMTk7IiwiY2xhc3MgUFJPSkpTT05CdWlsZGVyQmFzZSB7XG4gIHN0YXRpYyBnZXRJZChub2RlKSB7XG4gICAgY29uc3QgaWROb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdJRCcpO1xuICAgIGlmIChpZE5vZGUgJiYgaWROb2RlLmxlbmd0aCA+PSAzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhdXRob3JpdHk6IGlkTm9kZVsxXSxcbiAgICAgICAgY29kZTogcGFyc2VJbnQoaWROb2RlWzJdLCAxMCksXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBjb252ZXJ0VW5pdChub2RlLCB0eXBlID0gJ3VuaXQnKSB7XG4gICAgaWYgKCFub2RlIHx8IG5vZGUubGVuZ3RoIDwgMykge1xuICAgICAgcmV0dXJuIHsgdHlwZSwgbmFtZTogJ3Vua25vd24nLCBjb252ZXJzaW9uX2ZhY3RvcjogbnVsbCB9O1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSBub2RlWzFdO1xuICAgIGNvbnN0IGNvbnZlcnNpb25GYWN0b3IgPSBwYXJzZUZsb2F0KG5vZGVbMl0pIHx8IG51bGw7XG5cbiAgICBjb25zdCBpZE5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0lEJyk7XG4gICAgY29uc3QgaWQgPSBpZE5vZGVcbiAgICAgID8ge1xuICAgICAgICBhdXRob3JpdHk6IGlkTm9kZVsxXSxcbiAgICAgICAgY29kZTogcGFyc2VJbnQoaWROb2RlWzJdLCAxMCksXG4gICAgICB9XG4gICAgICA6IG51bGw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZSxcbiAgICAgIG5hbWUsXG4gICAgICBjb252ZXJzaW9uX2ZhY3RvcjogY29udmVyc2lvbkZhY3RvcixcbiAgICAgIGlkLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgY29udmVydEF4aXMobm9kZSkge1xuICAgIGNvbnN0IG5hbWUgPSBub2RlWzFdIHx8ICdVbmtub3duJztcblxuICAgIC8vIERldGVybWluZSB0aGUgZGlyZWN0aW9uXG4gICAgbGV0IGRpcmVjdGlvbjtcbiAgICBjb25zdCBhYmJyZXZpYXRpb25NYXRjaCA9IG5hbWUubWF0Y2goL15cXCgoLilcXCkkLyk7IC8vIE1hdGNoIGFiYnJldmlhdGlvbnMgbGlrZSBcIihFKVwiIG9yIFwiKE4pXCJcbiAgICBpZiAoYWJicmV2aWF0aW9uTWF0Y2gpIHtcbiAgICAgIC8vIFVzZSB0aGUgYWJicmV2aWF0aW9uIHRvIGRldGVybWluZSB0aGUgZGlyZWN0aW9uXG4gICAgICBjb25zdCBhYmJyZXZpYXRpb24gPSBhYmJyZXZpYXRpb25NYXRjaFsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgaWYgKGFiYnJldmlhdGlvbiA9PT0gJ0UnKSBkaXJlY3Rpb24gPSAnZWFzdCc7XG4gICAgICBlbHNlIGlmIChhYmJyZXZpYXRpb24gPT09ICdOJykgZGlyZWN0aW9uID0gJ25vcnRoJztcbiAgICAgIGVsc2UgaWYgKGFiYnJldmlhdGlvbiA9PT0gJ1UnKSBkaXJlY3Rpb24gPSAndXAnO1xuICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gYXhpcyBhYmJyZXZpYXRpb246ICR7YWJicmV2aWF0aW9ufWApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGV4cGxpY2l0IGRpcmVjdGlvbiBwcm92aWRlZCBpbiB0aGUgQVhJUyBub2RlXG4gICAgICBkaXJlY3Rpb24gPSBub2RlWzJdID8gbm9kZVsyXS50b0xvd2VyQ2FzZSgpIDogJ3Vua25vd24nO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnT1JERVInKTtcbiAgICBjb25zdCBvcmRlciA9IG9yZGVyTm9kZSA/IHBhcnNlSW50KG9yZGVyTm9kZVsxXSwgMTApIDogbnVsbDtcblxuICAgIGNvbnN0IHVuaXROb2RlID0gbm9kZS5maW5kKFxuICAgICAgKGNoaWxkKSA9PlxuICAgICAgICBBcnJheS5pc0FycmF5KGNoaWxkKSAmJlxuICAgICAgICAoY2hpbGRbMF0gPT09ICdMRU5HVEhVTklUJyB8fCBjaGlsZFswXSA9PT0gJ0FOR0xFVU5JVCcgfHwgY2hpbGRbMF0gPT09ICdTQ0FMRVVOSVQnKVxuICAgICk7XG4gICAgY29uc3QgdW5pdCA9IHRoaXMuY29udmVydFVuaXQodW5pdE5vZGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWUsXG4gICAgICBkaXJlY3Rpb24sIC8vIFVzZSB0aGUgdmFsaWQgUFJPSkpTT04gZGlyZWN0aW9uIHZhbHVlXG4gICAgICB1bml0LFxuICAgICAgb3JkZXIsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBleHRyYWN0QXhlcyhub2RlKSB7XG4gICAgcmV0dXJuIG5vZGVcbiAgICAgIC5maWx0ZXIoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0FYSVMnKVxuICAgICAgLm1hcCgoYXhpcykgPT4gdGhpcy5jb252ZXJ0QXhpcyhheGlzKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiAoYS5vcmRlciB8fCAwKSAtIChiLm9yZGVyIHx8IDApKTsgLy8gU29ydCBieSB0aGUgXCJvcmRlclwiIHByb3BlcnR5XG4gIH1cblxuICBzdGF0aWMgY29udmVydChub2RlLCByZXN1bHQgPSB7fSkge1xuXG4gICAgc3dpdGNoIChub2RlWzBdKSB7XG4gICAgICBjYXNlICdQUk9KQ1JTJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnUHJvamVjdGVkQ1JTJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgICByZXN1bHQuYmFzZV9jcnMgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0JBU0VHRU9HQ1JTJylcbiAgICAgICAgICA/IHRoaXMuY29udmVydChub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0JBU0VHRU9HQ1JTJykpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICByZXN1bHQuY29udmVyc2lvbiA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQ09OVkVSU0lPTicpXG4gICAgICAgICAgPyB0aGlzLmNvbnZlcnQobm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdDT05WRVJTSU9OJykpXG4gICAgICAgICAgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IGNzTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQ1MnKTtcbiAgICAgICAgaWYgKGNzTm9kZSkge1xuICAgICAgICAgIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbSA9IHtcbiAgICAgICAgICAgIHR5cGU6IGNzTm9kZVsxXSxcbiAgICAgICAgICAgIGF4aXM6IHRoaXMuZXh0cmFjdEF4ZXMobm9kZSksXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxlbmd0aFVuaXROb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdMRU5HVEhVTklUJyk7XG4gICAgICAgIGlmIChsZW5ndGhVbml0Tm9kZSkge1xuICAgICAgICAgIGNvbnN0IHVuaXQgPSB0aGlzLmNvbnZlcnRVbml0KGxlbmd0aFVuaXROb2RlKTtcbiAgICAgICAgICByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0udW5pdCA9IHVuaXQ7IC8vIEFkZCB1bml0IHRvIGNvb3JkaW5hdGVfc3lzdGVtXG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQuaWQgPSB0aGlzLmdldElkKG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnQkFTRUdFT0dDUlMnOlxuICAgICAgY2FzZSAnR0VPR0NSUyc6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ0dlb2dyYXBoaWNDUlMnO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICBcbiAgICAgICAgLy8gSGFuZGxlIERBVFVNIG9yIEVOU0VNQkxFXG4gICAgICAgIGNvbnN0IGRhdHVtT3JFbnNlbWJsZU5vZGUgPSBub2RlLmZpbmQoXG4gICAgICAgICAgKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiAoY2hpbGRbMF0gPT09ICdEQVRVTScgfHwgY2hpbGRbMF0gPT09ICdFTlNFTUJMRScpXG4gICAgICAgICk7XG4gICAgICAgIGlmIChkYXR1bU9yRW5zZW1ibGVOb2RlKSB7XG4gICAgICAgICAgY29uc3QgZGF0dW1PckVuc2VtYmxlID0gdGhpcy5jb252ZXJ0KGRhdHVtT3JFbnNlbWJsZU5vZGUpO1xuICAgICAgICAgIGlmIChkYXR1bU9yRW5zZW1ibGVOb2RlWzBdID09PSAnRU5TRU1CTEUnKSB7XG4gICAgICAgICAgICByZXN1bHQuZGF0dW1fZW5zZW1ibGUgPSBkYXR1bU9yRW5zZW1ibGU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5kYXR1bSA9IGRhdHVtT3JFbnNlbWJsZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcHJpbWVtID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdQUklNRU0nKTtcbiAgICAgICAgICBpZiAocHJpbWVtICYmIHByaW1lbVsxXSAhPT0gJ0dyZWVud2ljaCcpIHtcbiAgICAgICAgICAgIGRhdHVtT3JFbnNlbWJsZS5wcmltZV9tZXJpZGlhbiA9IHtcbiAgICAgICAgICAgICAgbmFtZTogcHJpbWVtWzFdLFxuICAgICAgICAgICAgICBsb25naXR1ZGU6IHBhcnNlRmxvYXQocHJpbWVtWzJdKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0gPSB7XG4gICAgICAgICAgdHlwZTogJ2VsbGlwc29pZGFsJyxcbiAgICAgICAgICBheGlzOiB0aGlzLmV4dHJhY3RBeGVzKG5vZGUpLFxuICAgICAgICB9O1xuICAgICAgXG4gICAgICAgIHJlc3VsdC5pZCA9IHRoaXMuZ2V0SWQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdEQVRVTSc6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ0dlb2RldGljUmVmZXJlbmNlRnJhbWUnO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICAgIHJlc3VsdC5lbGxpcHNvaWQgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0VMTElQU09JRCcpXG4gICAgICAgICAgPyB0aGlzLmNvbnZlcnQobm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdFTExJUFNPSUQnKSlcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgICBjYXNlICdFTlNFTUJMRSc6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ0RhdHVtRW5zZW1ibGUnO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICBcbiAgICAgICAgLy8gRXh0cmFjdCBlbnNlbWJsZSBtZW1iZXJzXG4gICAgICAgIHJlc3VsdC5tZW1iZXJzID0gbm9kZVxuICAgICAgICAgIC5maWx0ZXIoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ01FTUJFUicpXG4gICAgICAgICAgLm1hcCgobWVtYmVyKSA9PiAoe1xuICAgICAgICAgICAgdHlwZTogJ0RhdHVtRW5zZW1ibGVNZW1iZXInLFxuICAgICAgICAgICAgbmFtZTogbWVtYmVyWzFdLFxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2V0SWQobWVtYmVyKSwgLy8gRXh0cmFjdCBJRCBhcyB7IGF1dGhvcml0eSwgY29kZSB9XG4gICAgICAgICAgfSkpO1xuICAgICAgXG4gICAgICAgIC8vIEV4dHJhY3QgYWNjdXJhY3lcbiAgICAgICAgY29uc3QgYWNjdXJhY3lOb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdFTlNFTUJMRUFDQ1VSQUNZJyk7XG4gICAgICAgIGlmIChhY2N1cmFjeU5vZGUpIHtcbiAgICAgICAgICByZXN1bHQuYWNjdXJhY3kgPSBwYXJzZUZsb2F0KGFjY3VyYWN5Tm9kZVsxXSk7XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICAvLyBFeHRyYWN0IGVsbGlwc29pZFxuICAgICAgICBjb25zdCBlbGxpcHNvaWROb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdFTExJUFNPSUQnKTtcbiAgICAgICAgaWYgKGVsbGlwc29pZE5vZGUpIHtcbiAgICAgICAgICByZXN1bHQuZWxsaXBzb2lkID0gdGhpcy5jb252ZXJ0KGVsbGlwc29pZE5vZGUpOyAvLyBDb252ZXJ0IHRoZSBlbGxpcHNvaWQgbm9kZVxuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgLy8gRXh0cmFjdCBpZGVudGlmaWVyIGZvciB0aGUgZW5zZW1ibGVcbiAgICAgICAgcmVzdWx0LmlkID0gdGhpcy5nZXRJZChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0VMTElQU09JRCc6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ0VsbGlwc29pZCc7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgICAgcmVzdWx0LnNlbWlfbWFqb3JfYXhpcyA9IHBhcnNlRmxvYXQobm9kZVsyXSk7XG4gICAgICAgIHJlc3VsdC5pbnZlcnNlX2ZsYXR0ZW5pbmcgPSBwYXJzZUZsb2F0KG5vZGVbM10pO1xuICAgICAgICBjb25zdCB1bml0cyA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTEVOR1RIVU5JVCcpXG4gICAgICAgICAgPyB0aGlzLmNvbnZlcnQobm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdMRU5HVEhVTklUJyksIHJlc3VsdClcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdDT05WRVJTSU9OJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnQ29udmVyc2lvbic7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgICAgcmVzdWx0Lm1ldGhvZCA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTUVUSE9EJylcbiAgICAgICAgICA/IHRoaXMuY29udmVydChub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ01FVEhPRCcpKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgcmVzdWx0LnBhcmFtZXRlcnMgPSBub2RlXG4gICAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnUEFSQU1FVEVSJylcbiAgICAgICAgICAubWFwKChwYXJhbSkgPT4gdGhpcy5jb252ZXJ0KHBhcmFtKSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdNRVRIT0QnOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdNZXRob2QnO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICAgIHJlc3VsdC5pZCA9IHRoaXMuZ2V0SWQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdQQVJBTUVURVInOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdQYXJhbWV0ZXInO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICAgIHJlc3VsdC52YWx1ZSA9IHBhcnNlRmxvYXQobm9kZVsyXSk7XG4gICAgICAgIHJlc3VsdC51bml0ID0gdGhpcy5jb252ZXJ0VW5pdChcbiAgICAgICAgICBub2RlLmZpbmQoXG4gICAgICAgICAgICAoY2hpbGQpID0+XG4gICAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoY2hpbGQpICYmXG4gICAgICAgICAgICAgIChjaGlsZFswXSA9PT0gJ0xFTkdUSFVOSVQnIHx8IGNoaWxkWzBdID09PSAnQU5HTEVVTklUJyB8fCBjaGlsZFswXSA9PT0gJ1NDQUxFVU5JVCcpXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICByZXN1bHQuaWQgPSB0aGlzLmdldElkKG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnQk9VTkRDUlMnOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdCb3VuZENSUyc7XG5cbiAgICAgICAgLy8gUHJvY2VzcyBTT1VSQ0VDUlNcbiAgICAgICAgY29uc3Qgc291cmNlQ3JzTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnU09VUkNFQ1JTJyk7XG4gICAgICAgIGlmIChzb3VyY2VDcnNOb2RlKSB7XG4gICAgICAgICAgY29uc3Qgc291cmNlQ3JzQ29udGVudCA9IHNvdXJjZUNyc05vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpKTtcbiAgICAgICAgICByZXN1bHQuc291cmNlX2NycyA9IHNvdXJjZUNyc0NvbnRlbnQgPyB0aGlzLmNvbnZlcnQoc291cmNlQ3JzQ29udGVudCkgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHJvY2VzcyBUQVJHRVRDUlNcbiAgICAgICAgY29uc3QgdGFyZ2V0Q3JzTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnVEFSR0VUQ1JTJyk7XG4gICAgICAgIGlmICh0YXJnZXRDcnNOb2RlKSB7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0Q3JzQ29udGVudCA9IHRhcmdldENyc05vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpKTtcbiAgICAgICAgICByZXN1bHQudGFyZ2V0X2NycyA9IHRhcmdldENyc0NvbnRlbnQgPyB0aGlzLmNvbnZlcnQodGFyZ2V0Q3JzQ29udGVudCkgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHJvY2VzcyBBQlJJREdFRFRSQU5TRk9STUFUSU9OXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWF0aW9uTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQUJSSURHRURUUkFOU0ZPUk1BVElPTicpO1xuICAgICAgICBpZiAodHJhbnNmb3JtYXRpb25Ob2RlKSB7XG4gICAgICAgICAgcmVzdWx0LnRyYW5zZm9ybWF0aW9uID0gdGhpcy5jb252ZXJ0KHRyYW5zZm9ybWF0aW9uTm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnRyYW5zZm9ybWF0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnQUJSSURHRURUUkFOU0ZPUk1BVElPTic6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ1RyYW5zZm9ybWF0aW9uJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgICByZXN1bHQubWV0aG9kID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdNRVRIT0QnKVxuICAgICAgICAgID8gdGhpcy5jb252ZXJ0KG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTUVUSE9EJykpXG4gICAgICAgICAgOiBudWxsO1xuXG4gICAgICAgIHJlc3VsdC5wYXJhbWV0ZXJzID0gbm9kZVxuICAgICAgICAgIC5maWx0ZXIoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiAoY2hpbGRbMF0gPT09ICdQQVJBTUVURVInIHx8IGNoaWxkWzBdID09PSAnUEFSQU1FVEVSRklMRScpKVxuICAgICAgICAgIC5tYXAoKHBhcmFtKSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1bMF0gPT09ICdQQVJBTUVURVInKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnQocGFyYW0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbVswXSA9PT0gJ1BBUkFNRVRFUkZJTEUnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogcGFyYW1bMV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHBhcmFtWzJdLFxuICAgICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgICAnYXV0aG9yaXR5JzogJ0VQU0cnLFxuICAgICAgICAgICAgICAgICAgJ2NvZGUnOiA4NjU2XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkanVzdCB0aGUgU2NhbGUgZGlmZmVyZW5jZSBwYXJhbWV0ZXIgaWYgcHJlc2VudFxuICAgICAgICBpZiAocmVzdWx0LnBhcmFtZXRlcnMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICAgY29uc3Qgc2NhbGVEaWZmZXJlbmNlID0gcmVzdWx0LnBhcmFtZXRlcnNbNl07XG4gICAgICAgICAgaWYgKHNjYWxlRGlmZmVyZW5jZS5uYW1lID09PSAnU2NhbGUgZGlmZmVyZW5jZScpIHtcbiAgICAgICAgICAgIHNjYWxlRGlmZmVyZW5jZS52YWx1ZSA9IE1hdGgucm91bmQoKHNjYWxlRGlmZmVyZW5jZS52YWx1ZSAtIDEpICogMWUxMikgLyAxZTY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LmlkID0gdGhpcy5nZXRJZChub2RlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBcbiAgICAgIGNhc2UgJ0FYSVMnOlxuICAgICAgICBpZiAoIXJlc3VsdC5jb29yZGluYXRlX3N5c3RlbSkge1xuICAgICAgICAgIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbSA9IHsgdHlwZTogJ3Vuc3BlY2lmaWVkJywgYXhpczogW10gfTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0uYXhpcy5wdXNoKHRoaXMuY29udmVydEF4aXMobm9kZSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIFxuICAgICAgY2FzZSAnTEVOR1RIVU5JVCc6XG4gICAgICAgIGNvbnN0IHVuaXQgPSB0aGlzLmNvbnZlcnRVbml0KG5vZGUsICdMaW5lYXJVbml0Jyk7XG4gICAgICAgIGlmIChyZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0gJiYgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtLmF4aXMpIHtcbiAgICAgICAgICByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0uYXhpcy5mb3JFYWNoKChheGlzKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWF4aXMudW5pdCkge1xuICAgICAgICAgICAgICBheGlzLnVuaXQgPSB1bml0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0LmNvbnZlcnNpb25fZmFjdG9yICYmIHVuaXQuY29udmVyc2lvbl9mYWN0b3IgIT09IDEpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnNlbWlfbWFqb3JfYXhpcykge1xuICAgICAgICAgICAgcmVzdWx0LnNlbWlfbWFqb3JfYXhpcyA9IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5zZW1pX21ham9yX2F4aXMsXG4gICAgICAgICAgICAgIHVuaXQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXN1bHQua2V5d29yZCA9IG5vZGVbMF07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUFJPSkpTT05CdWlsZGVyQmFzZTsiLCJpbXBvcnQgUFJPSkpTT05CdWlsZGVyMjAxNSBmcm9tICcuL1BST0pKU09OQnVpbGRlcjIwMTUuanMnO1xuaW1wb3J0IFBST0pKU09OQnVpbGRlcjIwMTkgZnJvbSAnLi9QUk9KSlNPTkJ1aWxkZXIyMDE5LmpzJztcblxuLyoqXG4gKiBEZXRlY3RzIHRoZSBXS1QyIHZlcnNpb24gYmFzZWQgb24gdGhlIHN0cnVjdHVyZSBvZiB0aGUgV0tULlxuICogQHBhcmFtIHtBcnJheX0gcm9vdCBUaGUgcm9vdCBXS1QgYXJyYXkgbm9kZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBkZXRlY3RlZCB2ZXJzaW9uIChcIjIwMTVcIiBvciBcIjIwMTlcIikuXG4gKi9cbmZ1bmN0aW9uIGRldGVjdFdLVDJWZXJzaW9uKHJvb3QpIHtcbiAgLy8gQ2hlY2sgZm9yIFdLVDItMjAxOS1zcGVjaWZpYyBub2Rlc1xuICBpZiAocm9vdC5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdVU0FHRScpKSB7XG4gICAgcmV0dXJuICcyMDE5JzsgLy8gYFVTQUdFYCBpcyBzcGVjaWZpYyB0byBXS1QyLTIwMTlcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBXS1QyLTIwMTUtc3BlY2lmaWMgbm9kZXNcbiAgaWYgKHJvb3QuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQ1MnKSkge1xuICAgIHJldHVybiAnMjAxNSc7IC8vIGBDU2AgaXMgdmFsaWQgaW4gYm90aCwgYnV0IGRlZmF1bHQgdG8gMjAxNSB1bmxlc3MgYFVTQUdFYCBpcyBwcmVzZW50XG4gIH1cblxuICBpZiAocm9vdFswXSA9PT0gJ0JPVU5EQ1JTJyB8fCByb290WzBdID09PSAnUFJPSkNSUycgfHwgcm9vdFswXSA9PT0gJ0dFT0dDUlMnKSB7XG4gICAgcmV0dXJuICcyMDE1JzsgLy8gVGhlc2UgYXJlIHZhbGlkIGluIGJvdGgsIGJ1dCBkZWZhdWx0IHRvIDIwMTVcbiAgfVxuXG4gIC8vIERlZmF1bHQgdG8gV0tUMi0yMDE1IGlmIG5vIHNwZWNpZmljIGluZGljYXRvcnMgYXJlIGZvdW5kXG4gIHJldHVybiAnMjAxNSc7XG59XG5cbi8qKlxuICogQnVpbGRzIGEgUFJPSkpTT04gb2JqZWN0IGZyb20gYSBXS1QgYXJyYXkgc3RydWN0dXJlLlxuICogQHBhcmFtIHtBcnJheX0gcm9vdCBUaGUgcm9vdCBXS1QgYXJyYXkgbm9kZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBQUk9KSlNPTiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFBST0pKU09OKHJvb3QpIHtcbiAgY29uc3QgdmVyc2lvbiA9IGRldGVjdFdLVDJWZXJzaW9uKHJvb3QpO1xuICBjb25zdCBidWlsZGVyID0gdmVyc2lvbiA9PT0gJzIwMTknID8gUFJPSkpTT05CdWlsZGVyMjAxOSA6IFBST0pKU09OQnVpbGRlcjIwMTU7XG4gIHJldHVybiBidWlsZGVyLmNvbnZlcnQocm9vdCk7XG59XG4iLCIvKipcbiAqIERldGVjdHMgd2hldGhlciB0aGUgV0tUIHN0cmluZyBpcyBXS1QxIG9yIFdLVDIuXG4gKiBAcGFyYW0ge3N0cmluZ30gd2t0IFRoZSBXS1Qgc3RyaW5nLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGRldGVjdGVkIHZlcnNpb24gKFwiV0tUMVwiIG9yIFwiV0tUMlwiKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdFdLVFZlcnNpb24od2t0KSB7XG4gIC8vIE5vcm1hbGl6ZSB0aGUgV0tUIHN0cmluZyBmb3IgZWFzaWVyIGtleXdvcmQgbWF0Y2hpbmdcbiAgY29uc3Qgbm9ybWFsaXplZFdLVCA9IHdrdC50b1VwcGVyQ2FzZSgpO1xuXG4gIC8vIENoZWNrIGZvciBXS1QyLXNwZWNpZmljIGtleXdvcmRzXG4gIGlmIChcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdQUk9KQ1JTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdHRU9HQ1JTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdCT1VORENSUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnVkVSVENSUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnTEVOR1RIVU5JVCcpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnQU5HTEVVTklUJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdTQ0FMRVVOSVQnKVxuICApIHtcbiAgICByZXR1cm4gJ1dLVDInO1xuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIFdLVDEtc3BlY2lmaWMga2V5d29yZHNcbiAgaWYgKFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ1BST0pDUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnR0VPR0NTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdMT0NBTF9DUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnVkVSVF9DUycpIHx8XG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnVU5JVCcpXG4gICkge1xuICAgIHJldHVybiAnV0tUMSc7XG4gIH1cblxuICAvLyBEZWZhdWx0IHRvIFdLVDEgaWYgbm8gc3BlY2lmaWMgaW5kaWNhdG9ycyBhcmUgZm91bmRcbiAgcmV0dXJuICdXS1QxJztcbn0iLCJpbXBvcnQgeyBidWlsZFBST0pKU09OIH0gZnJvbSAnLi9idWlsZFBST0pKU09OLmpzJztcbmltcG9ydCB7IGRldGVjdFdLVFZlcnNpb24gfSBmcm9tICcuL2RldGVjdFdLVFZlcnNpb24uanMnO1xuaW1wb3J0IHBhcnNlciBmcm9tICcuL3BhcnNlci5qcyc7XG5pbXBvcnQge3NFeHByfSBmcm9tICcuL3Byb2Nlc3MuanMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtUFJPSkpTT04gfSBmcm9tICcuL3RyYW5zZm9ybVBST0pKU09OLmpzJztcbmltcG9ydCB7IGFwcGx5UHJvamVjdGlvbkRlZmF1bHRzLCBkMnIgfSBmcm9tICcuL3V0aWwuanMnO1xuXG52YXIga25vd25UeXBlcyA9IFsnUFJPSkVDVEVEQ1JTJywgJ1BST0pDUlMnLCAnR0VPR0NTJywgJ0dFT0NDUycsICdQUk9KQ1MnLCAnTE9DQUxfQ1MnLCAnR0VPRENSUycsXG4gICdHRU9ERVRJQ0NSUycsICdHRU9ERVRJQ0RBVFVNJywgJ0VOR0NSUycsICdFTkdJTkVFUklOR0NSUyddO1xuXG5mdW5jdGlvbiByZW5hbWUob2JqLCBwYXJhbXMpIHtcbiAgdmFyIG91dE5hbWUgPSBwYXJhbXNbMF07XG4gIHZhciBpbk5hbWUgPSBwYXJhbXNbMV07XG4gIGlmICghKG91dE5hbWUgaW4gb2JqKSAmJiAoaW5OYW1lIGluIG9iaikpIHtcbiAgICBvYmpbb3V0TmFtZV0gPSBvYmpbaW5OYW1lXTtcbiAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMykge1xuICAgICAgb2JqW291dE5hbWVdID0gcGFyYW1zWzJdKG9ialtvdXROYW1lXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFuV0tUKHdrdCkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHdrdCk7XG4gIGZvciAodmFyIGkgPSAwLCBpaSA9IGtleXMubGVuZ3RoOyBpIDxpaTsgKytpKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgLy8gdGhlIGZvbGxvd2luZ3MgYXJlIHRoZSBjcnMgZGVmaW5lZCBpblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9qNGpzL3Byb2o0anMvYmxvYi8xZGE0ZWQwYjg2NWQwZmNiNTFjMTM2MDkwNTY5MjEwY2RjYzkwMTllL2xpYi9wYXJzZUNvZGUuanMjTDExXG4gICAgaWYgKGtub3duVHlwZXMuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgc2V0UHJvcGVydGllc0Zyb21Xa3Qod2t0W2tleV0pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHdrdFtrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgY2xlYW5XS1Qod2t0W2tleV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzRnJvbVdrdCh3a3QpIHtcbiAgaWYgKHdrdC5BVVRIT1JJVFkpIHtcbiAgICB2YXIgYXV0aG9yaXR5ID0gT2JqZWN0LmtleXMod2t0LkFVVEhPUklUWSlbMF07XG4gICAgaWYgKGF1dGhvcml0eSAmJiBhdXRob3JpdHkgaW4gd2t0LkFVVEhPUklUWSkge1xuICAgICAgd2t0LnRpdGxlID0gYXV0aG9yaXR5ICsgJzonICsgd2t0LkFVVEhPUklUWVthdXRob3JpdHldO1xuICAgIH1cbiAgfVxuICBpZiAod2t0LnR5cGUgPT09ICdHRU9HQ1MnKSB7XG4gICAgd2t0LnByb2pOYW1lID0gJ2xvbmdsYXQnO1xuICB9IGVsc2UgaWYgKHdrdC50eXBlID09PSAnTE9DQUxfQ1MnKSB7XG4gICAgd2t0LnByb2pOYW1lID0gJ2lkZW50aXR5JztcbiAgICB3a3QubG9jYWwgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygd2t0LlBST0pFQ1RJT04gPT09ICdvYmplY3QnKSB7XG4gICAgICB3a3QucHJvak5hbWUgPSBPYmplY3Qua2V5cyh3a3QuUFJPSkVDVElPTilbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHdrdC5wcm9qTmFtZSA9IHdrdC5QUk9KRUNUSU9OO1xuICAgIH1cbiAgfVxuICBpZiAod2t0LkFYSVMpIHtcbiAgICB2YXIgYXhpc09yZGVyID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gd2t0LkFYSVMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgdmFyIGF4aXMgPSBbd2t0LkFYSVNbaV1bMF0udG9Mb3dlckNhc2UoKSwgd2t0LkFYSVNbaV1bMV0udG9Mb3dlckNhc2UoKV07XG4gICAgICBpZiAoYXhpc1swXS5pbmRleE9mKCdub3J0aCcpICE9PSAtMSB8fCAoKGF4aXNbMF0gPT09ICd5JyB8fCBheGlzWzBdID09PSAnbGF0JykgJiYgYXhpc1sxXSA9PT0gJ25vcnRoJykpIHtcbiAgICAgICAgYXhpc09yZGVyICs9ICduJztcbiAgICAgIH0gZWxzZSBpZiAoYXhpc1swXS5pbmRleE9mKCdzb3V0aCcpICE9PSAtMSB8fCAoKGF4aXNbMF0gPT09ICd5JyB8fCBheGlzWzBdID09PSAnbGF0JykgJiYgYXhpc1sxXSA9PT0gJ3NvdXRoJykpIHtcbiAgICAgICAgYXhpc09yZGVyICs9ICdzJztcbiAgICAgIH0gZWxzZSBpZiAoYXhpc1swXS5pbmRleE9mKCdlYXN0JykgIT09IC0xIHx8ICgoYXhpc1swXSA9PT0gJ3gnIHx8IGF4aXNbMF0gPT09ICdsb24nKSAmJiBheGlzWzFdID09PSAnZWFzdCcpKSB7XG4gICAgICAgIGF4aXNPcmRlciArPSAnZSc7XG4gICAgICB9IGVsc2UgaWYgKGF4aXNbMF0uaW5kZXhPZignd2VzdCcpICE9PSAtMSB8fCAoKGF4aXNbMF0gPT09ICd4JyB8fCBheGlzWzBdID09PSAnbG9uJykgJiYgYXhpc1sxXSA9PT0gJ3dlc3QnKSkge1xuICAgICAgICBheGlzT3JkZXIgKz0gJ3cnO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXhpc09yZGVyLmxlbmd0aCA9PT0gMikge1xuICAgICAgYXhpc09yZGVyICs9ICd1JztcbiAgICB9XG4gICAgaWYgKGF4aXNPcmRlci5sZW5ndGggPT09IDMpIHtcbiAgICAgIHdrdC5heGlzID0gYXhpc09yZGVyO1xuICAgIH1cbiAgfVxuICBpZiAod2t0LlVOSVQpIHtcbiAgICB3a3QudW5pdHMgPSB3a3QuVU5JVC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHdrdC51bml0cyA9PT0gJ21ldHJlJykge1xuICAgICAgd2t0LnVuaXRzID0gJ21ldGVyJztcbiAgICB9XG4gICAgaWYgKHdrdC5VTklULmNvbnZlcnQpIHtcbiAgICAgIGlmICh3a3QudHlwZSA9PT0gJ0dFT0dDUycpIHtcbiAgICAgICAgaWYgKHdrdC5EQVRVTSAmJiB3a3QuREFUVU0uU1BIRVJPSUQpIHtcbiAgICAgICAgICB3a3QudG9fbWV0ZXIgPSB3a3QuVU5JVC5jb252ZXJ0KndrdC5EQVRVTS5TUEhFUk9JRC5hO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3a3QudG9fbWV0ZXIgPSB3a3QuVU5JVC5jb252ZXJ0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXIgZ2VvZ2NzID0gd2t0LkdFT0dDUztcbiAgaWYgKHdrdC50eXBlID09PSAnR0VPR0NTJykge1xuICAgIGdlb2djcyA9IHdrdDtcbiAgfVxuICBpZiAoZ2VvZ2NzKSB7XG4gICAgLy9pZih3a3QuR0VPR0NTLlBSSU1FTSYmd2t0LkdFT0dDUy5QUklNRU0uY29udmVydCl7XG4gICAgLy8gIHdrdC5mcm9tX2dyZWVud2ljaD13a3QuR0VPR0NTLlBSSU1FTS5jb252ZXJ0KkQyUjtcbiAgICAvL31cbiAgICBpZiAoZ2VvZ2NzLkRBVFVNKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gZ2VvZ2NzLkRBVFVNLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9IGdlb2djcy5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGlmICh3a3QuZGF0dW1Db2RlLnNsaWNlKDAsIDIpID09PSAnZF8nKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gd2t0LmRhdHVtQ29kZS5zbGljZSgyKTtcbiAgICB9XG4gICAgaWYgKHdrdC5kYXR1bUNvZGUgPT09ICduZXdfemVhbGFuZF8xOTQ5Jykge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICduemdkNDknO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZSA9PT0gJ3dnc18xOTg0JyB8fCB3a3QuZGF0dW1Db2RlID09PSAnd29ybGRfZ2VvZGV0aWNfc3lzdGVtXzE5ODQnKSB7XG4gICAgICBpZiAod2t0LlBST0pFQ1RJT04gPT09ICdNZXJjYXRvcl9BdXhpbGlhcnlfU3BoZXJlJykge1xuICAgICAgICB3a3Quc3BoZXJlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnd2dzODQnO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZSA9PT0gJ2JlbGdlXzE5NzInKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ3JuYjcyJztcbiAgICB9XG4gICAgaWYgKGdlb2djcy5EQVRVTSAmJiBnZW9nY3MuREFUVU0uU1BIRVJPSUQpIHtcbiAgICAgIHdrdC5lbGxwcyA9IGdlb2djcy5EQVRVTS5TUEhFUk9JRC5uYW1lLnJlcGxhY2UoJ18xOScsICcnKS5yZXBsYWNlKC9bQ2NdbGFya2VcXF8xOC8sICdjbHJrJyk7XG4gICAgICBpZiAod2t0LmVsbHBzLnRvTG93ZXJDYXNlKCkuc2xpY2UoMCwgMTMpID09PSAnaW50ZXJuYXRpb25hbCcpIHtcbiAgICAgICAgd2t0LmVsbHBzID0gJ2ludGwnO1xuICAgICAgfVxuXG4gICAgICB3a3QuYSA9IGdlb2djcy5EQVRVTS5TUEhFUk9JRC5hO1xuICAgICAgd2t0LnJmID0gcGFyc2VGbG9hdChnZW9nY3MuREFUVU0uU1BIRVJPSUQucmYsIDEwKTtcbiAgICB9XG5cbiAgICBpZiAoZ2VvZ2NzLkRBVFVNICYmIGdlb2djcy5EQVRVTS5UT1dHUzg0KSB7XG4gICAgICB3a3QuZGF0dW1fcGFyYW1zID0gZ2VvZ2NzLkRBVFVNLlRPV0dTODQ7XG4gICAgfVxuICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdvc2diXzE5MzYnKSkge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdvc2diMzYnO1xuICAgIH1cbiAgICBpZiAofndrdC5kYXR1bUNvZGUuaW5kZXhPZignb3NuaV8xOTUyJykpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnb3NuaTUyJztcbiAgICB9XG4gICAgaWYgKH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ3RtNjUnKVxuICAgICAgfHwgfndrdC5kYXR1bUNvZGUuaW5kZXhPZignZ2VvZGV0aWNfZGF0dW1fb2ZfMTk2NScpKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ2lyZTY1JztcbiAgICB9XG4gICAgaWYgKHdrdC5kYXR1bUNvZGUgPT09ICdjaDE5MDMrJykge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdjaDE5MDMnO1xuICAgIH1cbiAgICBpZiAofndrdC5kYXR1bUNvZGUuaW5kZXhPZignaXNyYWVsJykpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnaXNyOTMnO1xuICAgIH1cbiAgfVxuICBpZiAod2t0LmIgJiYgIWlzRmluaXRlKHdrdC5iKSkge1xuICAgIHdrdC5iID0gd2t0LmE7XG4gIH1cbiAgaWYgKHdrdC5yZWN0aWZpZWRfZ3JpZF9hbmdsZSkge1xuICAgIHdrdC5yZWN0aWZpZWRfZ3JpZF9hbmdsZSA9IGQycih3a3QucmVjdGlmaWVkX2dyaWRfYW5nbGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9NZXRlcihpbnB1dCkge1xuICAgIHZhciByYXRpbyA9IHdrdC50b19tZXRlciB8fCAxO1xuICAgIHJldHVybiBpbnB1dCAqIHJhdGlvO1xuICB9XG4gIHZhciByZW5hbWVyID0gZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiByZW5hbWUod2t0LCBhKTtcbiAgfTtcbiAgdmFyIGxpc3QgPSBbXG4gICAgWydzdGFuZGFyZF9wYXJhbGxlbF8xJywgJ1N0YW5kYXJkX1BhcmFsbGVsXzEnXSxcbiAgICBbJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCAnTGF0aXR1ZGUgb2YgMXN0IHN0YW5kYXJkIHBhcmFsbGVsJ10sXG4gICAgWydzdGFuZGFyZF9wYXJhbGxlbF8yJywgJ1N0YW5kYXJkX1BhcmFsbGVsXzInXSxcbiAgICBbJ3N0YW5kYXJkX3BhcmFsbGVsXzInLCAnTGF0aXR1ZGUgb2YgMm5kIHN0YW5kYXJkIHBhcmFsbGVsJ10sXG4gICAgWydmYWxzZV9lYXN0aW5nJywgJ0ZhbHNlX0Vhc3RpbmcnXSxcbiAgICBbJ2ZhbHNlX2Vhc3RpbmcnLCAnRmFsc2UgZWFzdGluZyddLFxuICAgIFsnZmFsc2UtZWFzdGluZycsICdFYXN0aW5nIGF0IGZhbHNlIG9yaWdpbiddLFxuICAgIFsnZmFsc2Vfbm9ydGhpbmcnLCAnRmFsc2VfTm9ydGhpbmcnXSxcbiAgICBbJ2ZhbHNlX25vcnRoaW5nJywgJ0ZhbHNlIG5vcnRoaW5nJ10sXG4gICAgWydmYWxzZV9ub3J0aGluZycsICdOb3J0aGluZyBhdCBmYWxzZSBvcmlnaW4nXSxcbiAgICBbJ2NlbnRyYWxfbWVyaWRpYW4nLCAnQ2VudHJhbF9NZXJpZGlhbiddLFxuICAgIFsnY2VudHJhbF9tZXJpZGlhbicsICdMb25naXR1ZGUgb2YgbmF0dXJhbCBvcmlnaW4nXSxcbiAgICBbJ2NlbnRyYWxfbWVyaWRpYW4nLCAnTG9uZ2l0dWRlIG9mIGZhbHNlIG9yaWdpbiddLFxuICAgIFsnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgJ0xhdGl0dWRlX09mX09yaWdpbiddLFxuICAgIFsnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgJ0NlbnRyYWxfUGFyYWxsZWwnXSxcbiAgICBbJ2xhdGl0dWRlX29mX29yaWdpbicsICdMYXRpdHVkZSBvZiBuYXR1cmFsIG9yaWdpbiddLFxuICAgIFsnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgJ0xhdGl0dWRlIG9mIGZhbHNlIG9yaWdpbiddLFxuICAgIFsnc2NhbGVfZmFjdG9yJywgJ1NjYWxlX0ZhY3RvciddLFxuICAgIFsnazAnLCAnc2NhbGVfZmFjdG9yJ10sXG4gICAgWydsYXRpdHVkZV9vZl9jZW50ZXInLCAnTGF0aXR1ZGVfT2ZfQ2VudGVyJ10sXG4gICAgWydsYXRpdHVkZV9vZl9jZW50ZXInLCAnTGF0aXR1ZGVfb2ZfY2VudGVyJ10sXG4gICAgWydsYXQwJywgJ2xhdGl0dWRlX29mX2NlbnRlcicsIGQycl0sXG4gICAgWydsb25naXR1ZGVfb2ZfY2VudGVyJywgJ0xvbmdpdHVkZV9PZl9DZW50ZXInXSxcbiAgICBbJ2xvbmdpdHVkZV9vZl9jZW50ZXInLCAnTG9uZ2l0dWRlX29mX2NlbnRlciddLFxuICAgIFsnbG9uZ2MnLCAnbG9uZ2l0dWRlX29mX2NlbnRlcicsIGQycl0sXG4gICAgWyd4MCcsICdmYWxzZV9lYXN0aW5nJywgdG9NZXRlcl0sXG4gICAgWyd5MCcsICdmYWxzZV9ub3J0aGluZycsIHRvTWV0ZXJdLFxuICAgIFsnbG9uZzAnLCAnY2VudHJhbF9tZXJpZGlhbicsIGQycl0sXG4gICAgWydsYXQwJywgJ2xhdGl0dWRlX29mX29yaWdpbicsIGQycl0sXG4gICAgWydsYXQwJywgJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCBkMnJdLFxuICAgIFsnbGF0MScsICdzdGFuZGFyZF9wYXJhbGxlbF8xJywgZDJyXSxcbiAgICBbJ2xhdDInLCAnc3RhbmRhcmRfcGFyYWxsZWxfMicsIGQycl0sXG4gICAgWydhemltdXRoJywgJ0F6aW11dGgnXSxcbiAgICBbJ2FscGhhJywgJ2F6aW11dGgnLCBkMnJdLFxuICAgIFsnc3JzQ29kZScsICduYW1lJ11cbiAgXTtcbiAgbGlzdC5mb3JFYWNoKHJlbmFtZXIpO1xuICBhcHBseVByb2plY3Rpb25EZWZhdWx0cyh3a3QpO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24od2t0KSB7XG4gIGlmICh0eXBlb2Ygd2t0ID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB0cmFuc2Zvcm1QUk9KSlNPTih3a3QpO1xuICB9XG4gIGNvbnN0IHZlcnNpb24gPSBkZXRlY3RXS1RWZXJzaW9uKHdrdCk7XG4gIHZhciBsaXNwID0gcGFyc2VyKHdrdCk7XG4gIGlmICh2ZXJzaW9uID09PSAnV0tUMicpIHtcbiAgICBjb25zdCBwcm9qanNvbiA9IGJ1aWxkUFJPSkpTT04obGlzcCk7XG4gICAgcmV0dXJuIHRyYW5zZm9ybVBST0pKU09OKHByb2pqc29uKTtcbiAgfVxuICB2YXIgdHlwZSA9IGxpc3BbMF07XG4gIHZhciBvYmogPSB7fTtcbiAgc0V4cHIobGlzcCwgb2JqKTtcbiAgY2xlYW5XS1Qob2JqKTtcbiAgcmV0dXJuIG9ialt0eXBlXTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IHBhcnNlU3RyaW5nO1xuXG52YXIgTkVVVFJBTCA9IDE7XG52YXIgS0VZV09SRCA9IDI7XG52YXIgTlVNQkVSID0gMztcbnZhciBRVU9URUQgPSA0O1xudmFyIEFGVEVSUVVPVEUgPSA1O1xudmFyIEVOREVEID0gLTE7XG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvO1xudmFyIGxhdGluID0gL1tBLVphLXpdLztcbnZhciBrZXl3b3JkID0gL1tBLVphLXo4NF9dLztcbnZhciBlbmRUaGluZ3MgPSAvWyxcXF1dLztcbnZhciBkaWdldHMgPSAvW1xcZFxcLkVcXC1cXCtdLztcbi8vIGNvbnN0IGlnbm9yZWRDaGFyID0gL1tcXHNfXFwtXFwvXFwoXFwpXS9nO1xuZnVuY3Rpb24gUGFyc2VyKHRleHQpIHtcbiAgaWYgKHR5cGVvZiB0ZXh0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignbm90IGEgc3RyaW5nJyk7XG4gIH1cbiAgdGhpcy50ZXh0ID0gdGV4dC50cmltKCk7XG4gIHRoaXMubGV2ZWwgPSAwO1xuICB0aGlzLnBsYWNlID0gMDtcbiAgdGhpcy5yb290ID0gbnVsbDtcbiAgdGhpcy5zdGFjayA9IFtdO1xuICB0aGlzLmN1cnJlbnRPYmplY3QgPSBudWxsO1xuICB0aGlzLnN0YXRlID0gTkVVVFJBTDtcbn1cblBhcnNlci5wcm90b3R5cGUucmVhZENoYXJpY3RlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2hhciA9IHRoaXMudGV4dFt0aGlzLnBsYWNlKytdO1xuICBpZiAodGhpcy5zdGF0ZSAhPT0gUVVPVEVEKSB7XG4gICAgd2hpbGUgKHdoaXRlc3BhY2UudGVzdChjaGFyKSkge1xuICAgICAgaWYgKHRoaXMucGxhY2UgPj0gdGhpcy50ZXh0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjaGFyID0gdGhpcy50ZXh0W3RoaXMucGxhY2UrK107XG4gICAgfVxuICB9XG4gIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgIGNhc2UgTkVVVFJBTDpcbiAgICAgIHJldHVybiB0aGlzLm5ldXRyYWwoY2hhcik7XG4gICAgY2FzZSBLRVlXT1JEOlxuICAgICAgcmV0dXJuIHRoaXMua2V5d29yZChjaGFyKVxuICAgIGNhc2UgUVVPVEVEOlxuICAgICAgcmV0dXJuIHRoaXMucXVvdGVkKGNoYXIpO1xuICAgIGNhc2UgQUZURVJRVU9URTpcbiAgICAgIHJldHVybiB0aGlzLmFmdGVycXVvdGUoY2hhcik7XG4gICAgY2FzZSBOVU1CRVI6XG4gICAgICByZXR1cm4gdGhpcy5udW1iZXIoY2hhcik7XG4gICAgY2FzZSBFTkRFRDpcbiAgICAgIHJldHVybjtcbiAgfVxufTtcblBhcnNlci5wcm90b3R5cGUuYWZ0ZXJxdW90ZSA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGNoYXIgPT09ICdcIicpIHtcbiAgICB0aGlzLndvcmQgKz0gJ1wiJztcbiAgICB0aGlzLnN0YXRlID0gUVVPVEVEO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZW5kVGhpbmdzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgPSB0aGlzLndvcmQudHJpbSgpO1xuICAgIHRoaXMuYWZ0ZXJJdGVtKGNoYXIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2hhdm5cXCd0IGhhbmRsZWQgXCInICtjaGFyICsgJ1wiIGluIGFmdGVycXVvdGUgeWV0LCBpbmRleCAnICsgdGhpcy5wbGFjZSk7XG59O1xuUGFyc2VyLnByb3RvdHlwZS5hZnRlckl0ZW0gPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChjaGFyID09PSAnLCcpIHtcbiAgICBpZiAodGhpcy53b3JkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmN1cnJlbnRPYmplY3QucHVzaCh0aGlzLndvcmQpO1xuICAgIH1cbiAgICB0aGlzLndvcmQgPSBudWxsO1xuICAgIHRoaXMuc3RhdGUgPSBORVVUUkFMO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY2hhciA9PT0gJ10nKSB7XG4gICAgdGhpcy5sZXZlbC0tO1xuICAgIGlmICh0aGlzLndvcmQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuY3VycmVudE9iamVjdC5wdXNoKHRoaXMud29yZCk7XG4gICAgICB0aGlzLndvcmQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0gTkVVVFJBTDtcbiAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSB0aGlzLnN0YWNrLnBvcCgpO1xuICAgIGlmICghdGhpcy5jdXJyZW50T2JqZWN0KSB7XG4gICAgICB0aGlzLnN0YXRlID0gRU5ERUQ7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG59O1xuUGFyc2VyLnByb3RvdHlwZS5udW1iZXIgPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChkaWdldHMudGVzdChjaGFyKSkge1xuICAgIHRoaXMud29yZCArPSBjaGFyO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZW5kVGhpbmdzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgPSBwYXJzZUZsb2F0KHRoaXMud29yZCk7XG4gICAgdGhpcy5hZnRlckl0ZW0oY2hhcik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignaGF2blxcJ3QgaGFuZGxlZCBcIicgK2NoYXIgKyAnXCIgaW4gbnVtYmVyIHlldCwgaW5kZXggJyArIHRoaXMucGxhY2UpO1xufTtcblBhcnNlci5wcm90b3R5cGUucXVvdGVkID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAoY2hhciA9PT0gJ1wiJykge1xuICAgIHRoaXMuc3RhdGUgPSBBRlRFUlFVT1RFO1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLndvcmQgKz0gY2hhcjtcbiAgcmV0dXJuO1xufTtcblBhcnNlci5wcm90b3R5cGUua2V5d29yZCA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGtleXdvcmQudGVzdChjaGFyKSkge1xuICAgIHRoaXMud29yZCArPSBjaGFyO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY2hhciA9PT0gJ1snKSB7XG4gICAgdmFyIG5ld09iamVjdHMgPSBbXTtcbiAgICBuZXdPYmplY3RzLnB1c2godGhpcy53b3JkKTtcbiAgICB0aGlzLmxldmVsKys7XG4gICAgaWYgKHRoaXMucm9vdCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5yb290ID0gbmV3T2JqZWN0cztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LnB1c2gobmV3T2JqZWN0cyk7XG4gICAgfVxuICAgIHRoaXMuc3RhY2sucHVzaCh0aGlzLmN1cnJlbnRPYmplY3QpO1xuICAgIHRoaXMuY3VycmVudE9iamVjdCA9IG5ld09iamVjdHM7XG4gICAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbmRUaGluZ3MudGVzdChjaGFyKSkge1xuICAgIHRoaXMuYWZ0ZXJJdGVtKGNoYXIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2hhdm5cXCd0IGhhbmRsZWQgXCInICtjaGFyICsgJ1wiIGluIGtleXdvcmQgeWV0LCBpbmRleCAnICsgdGhpcy5wbGFjZSk7XG59O1xuUGFyc2VyLnByb3RvdHlwZS5uZXV0cmFsID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAobGF0aW4udGVzdChjaGFyKSkge1xuICAgIHRoaXMud29yZCA9IGNoYXI7XG4gICAgdGhpcy5zdGF0ZSA9IEtFWVdPUkQ7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjaGFyID09PSAnXCInKSB7XG4gICAgdGhpcy53b3JkID0gJyc7XG4gICAgdGhpcy5zdGF0ZSA9IFFVT1RFRDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGRpZ2V0cy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkID0gY2hhcjtcbiAgICB0aGlzLnN0YXRlID0gTlVNQkVSO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZW5kVGhpbmdzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBuZXV0cmFsIHlldCwgaW5kZXggJyArIHRoaXMucGxhY2UpO1xufTtcblBhcnNlci5wcm90b3R5cGUub3V0cHV0ID0gZnVuY3Rpb24oKSB7XG4gIHdoaWxlICh0aGlzLnBsYWNlIDwgdGhpcy50ZXh0Lmxlbmd0aCkge1xuICAgIHRoaXMucmVhZENoYXJpY3RlcigpO1xuICB9XG4gIGlmICh0aGlzLnN0YXRlID09PSBFTkRFRCkge1xuICAgIHJldHVybiB0aGlzLnJvb3Q7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gcGFyc2Ugc3RyaW5nIFwiJyArdGhpcy50ZXh0ICsgJ1wiLiBTdGF0ZSBpcyAnICsgdGhpcy5zdGF0ZSk7XG59O1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyh0eHQpIHtcbiAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXIodHh0KTtcbiAgcmV0dXJuIHBhcnNlci5vdXRwdXQoKTtcbn1cbiIsIlxuXG5mdW5jdGlvbiBtYXBpdChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgIHZhbHVlLnVuc2hpZnQoa2V5KTtcbiAgICBrZXkgPSBudWxsO1xuICB9XG4gIHZhciB0aGluZyA9IGtleSA/IHt9IDogb2JqO1xuXG4gIHZhciBvdXQgPSB2YWx1ZS5yZWR1Y2UoZnVuY3Rpb24obmV3T2JqLCBpdGVtKSB7XG4gICAgc0V4cHIoaXRlbSwgbmV3T2JqKTtcbiAgICByZXR1cm4gbmV3T2JqXG4gIH0sIHRoaW5nKTtcbiAgaWYgKGtleSkge1xuICAgIG9ialtrZXldID0gb3V0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzRXhwcih2LCBvYmopIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgb2JqW3ZdID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGtleSA9IHYuc2hpZnQoKTtcbiAgaWYgKGtleSA9PT0gJ1BBUkFNRVRFUicpIHtcbiAgICBrZXkgPSB2LnNoaWZ0KCk7XG4gIH1cbiAgaWYgKHYubGVuZ3RoID09PSAxKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodlswXSkpIHtcbiAgICAgIG9ialtrZXldID0ge307XG4gICAgICBzRXhwcih2WzBdLCBvYmpba2V5XSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9ialtrZXldID0gdlswXTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF2Lmxlbmd0aCkge1xuICAgIG9ialtrZXldID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGtleSA9PT0gJ1RPV0dTODQnKSB7XG4gICAgb2JqW2tleV0gPSB2O1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoa2V5ID09PSAnQVhJUycpIHtcbiAgICBpZiAoIShrZXkgaW4gb2JqKSkge1xuICAgICAgb2JqW2tleV0gPSBbXTtcbiAgICB9XG4gICAgb2JqW2tleV0ucHVzaCh2KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICBvYmpba2V5XSA9IHt9O1xuICB9XG5cbiAgdmFyIGk7XG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSAnVU5JVCc6XG4gICAgY2FzZSAnUFJJTUVNJzpcbiAgICBjYXNlICdWRVJUX0RBVFVNJzpcbiAgICAgIG9ialtrZXldID0ge1xuICAgICAgICBuYW1lOiB2WzBdLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGNvbnZlcnQ6IHZbMV1cbiAgICAgIH07XG4gICAgICBpZiAodi5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgc0V4cHIodlsyXSwgb2JqW2tleV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIGNhc2UgJ1NQSEVST0lEJzpcbiAgICBjYXNlICdFTExJUFNPSUQnOlxuICAgICAgb2JqW2tleV0gPSB7XG4gICAgICAgIG5hbWU6IHZbMF0sXG4gICAgICAgIGE6IHZbMV0sXG4gICAgICAgIHJmOiB2WzJdXG4gICAgICB9O1xuICAgICAgaWYgKHYubGVuZ3RoID09PSA0KSB7XG4gICAgICAgIHNFeHByKHZbM10sIG9ialtrZXldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdFREFUVU0nOlxuICAgIGNhc2UgJ0VOR0lORUVSSU5HREFUVU0nOlxuICAgIGNhc2UgJ0xPQ0FMX0RBVFVNJzpcbiAgICBjYXNlICdEQVRVTSc6XG4gICAgY2FzZSAnVkVSVF9DUyc6XG4gICAgY2FzZSAnVkVSVENSUyc6XG4gICAgY2FzZSAnVkVSVElDQUxDUlMnOlxuICAgICAgdlswXSA9IFsnbmFtZScsIHZbMF1dO1xuICAgICAgbWFwaXQob2JqLCBrZXksIHYpO1xuICAgICAgcmV0dXJuO1xuICAgIGNhc2UgJ0NPTVBEX0NTJzpcbiAgICBjYXNlICdDT01QT1VORENSUyc6XG4gICAgY2FzZSAnRklUVEVEX0NTJzpcbiAgICAvLyB0aGUgZm9sbG93aW5ncyBhcmUgdGhlIGNycyBkZWZpbmVkIGluXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Byb2o0anMvcHJvajRqcy9ibG9iLzFkYTRlZDBiODY1ZDBmY2I1MWMxMzYwOTA1NjkyMTBjZGNjOTAxOWUvbGliL3BhcnNlQ29kZS5qcyNMMTFcbiAgICBjYXNlICdQUk9KRUNURURDUlMnOlxuICAgIGNhc2UgJ1BST0pDUlMnOlxuICAgIGNhc2UgJ0dFT0dDUyc6XG4gICAgY2FzZSAnR0VPQ0NTJzpcbiAgICBjYXNlICdQUk9KQ1MnOlxuICAgIGNhc2UgJ0xPQ0FMX0NTJzpcbiAgICBjYXNlICdHRU9EQ1JTJzpcbiAgICBjYXNlICdHRU9ERVRJQ0NSUyc6XG4gICAgY2FzZSAnR0VPREVUSUNEQVRVTSc6XG4gICAgY2FzZSAnRU5HQ1JTJzpcbiAgICBjYXNlICdFTkdJTkVFUklOR0NSUyc6XG4gICAgICB2WzBdID0gWyduYW1lJywgdlswXV07XG4gICAgICBtYXBpdChvYmosIGtleSwgdik7XG4gICAgICBvYmpba2V5XS50eXBlID0ga2V5O1xuICAgICAgcmV0dXJuO1xuICAgIGRlZmF1bHQ6XG4gICAgICBpID0gLTE7XG4gICAgICB3aGlsZSAoKytpIDwgdi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHNFeHByKHYsIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcGl0KG9iaiwga2V5LCB2KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgYXBwbHlQcm9qZWN0aW9uRGVmYXVsdHMgfSBmcm9tICcuL3V0aWwuanMnO1xuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gcHJvY2VzcyB1bml0cyBhbmQgdG9fbWV0ZXJcbmZ1bmN0aW9uIHByb2Nlc3NVbml0KHVuaXQpIHtcbiAgbGV0IHJlc3VsdCA9IHsgdW5pdHM6IG51bGwsIHRvX21ldGVyOiB1bmRlZmluZWQgfTtcblxuICBpZiAodHlwZW9mIHVuaXQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmVzdWx0LnVuaXRzID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChyZXN1bHQudW5pdHMgPT09ICdtZXRyZScpIHtcbiAgICAgIHJlc3VsdC51bml0cyA9ICdtZXRlcic7IC8vIE5vcm1hbGl6ZSAnbWV0cmUnIHRvICdtZXRlcidcbiAgICB9XG4gICAgaWYgKHJlc3VsdC51bml0cyA9PT0gJ21ldGVyJykge1xuICAgICAgcmVzdWx0LnRvX21ldGVyID0gMTsgLy8gT25seSBzZXQgdG9fbWV0ZXIgaWYgdW5pdHMgYXJlICdtZXRlcidcbiAgICB9XG4gIH0gZWxzZSBpZiAodW5pdCAmJiB1bml0Lm5hbWUpIHtcbiAgICByZXN1bHQudW5pdHMgPSB1bml0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAocmVzdWx0LnVuaXRzID09PSAnbWV0cmUnKSB7XG4gICAgICByZXN1bHQudW5pdHMgPSAnbWV0ZXInOyAvLyBOb3JtYWxpemUgJ21ldHJlJyB0byAnbWV0ZXInXG4gICAgfVxuICAgIHJlc3VsdC50b19tZXRlciA9IHVuaXQuY29udmVyc2lvbl9mYWN0b3I7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB0b1ZhbHVlKHZhbHVlT3JPYmplY3QpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZU9yT2JqZWN0ID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB2YWx1ZU9yT2JqZWN0LnZhbHVlICogdmFsdWVPck9iamVjdC51bml0LmNvbnZlcnNpb25fZmFjdG9yO1xuICB9XG4gIHJldHVybiB2YWx1ZU9yT2JqZWN0O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFbGxpcHNvaWQodmFsdWUsIHJlc3VsdCkge1xuICBpZiAodmFsdWUuZWxsaXBzb2lkLnJhZGl1cykge1xuICAgIHJlc3VsdC5hID0gdmFsdWUuZWxsaXBzb2lkLnJhZGl1cztcbiAgICByZXN1bHQucmYgPSAwO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5hID0gdG9WYWx1ZSh2YWx1ZS5lbGxpcHNvaWQuc2VtaV9tYWpvcl9heGlzKTtcbiAgICBpZiAodmFsdWUuZWxsaXBzb2lkLmludmVyc2VfZmxhdHRlbmluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQucmYgPSB2YWx1ZS5lbGxpcHNvaWQuaW52ZXJzZV9mbGF0dGVuaW5nO1xuICAgIH0gZWxzZSBpZiAodmFsdWUuZWxsaXBzb2lkLnNlbWlfbWFqb3JfYXhpcyAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmVsbGlwc29pZC5zZW1pX21pbm9yX2F4aXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0LnJmID0gcmVzdWx0LmEgLyAocmVzdWx0LmEgLSB0b1ZhbHVlKHZhbHVlLmVsbGlwc29pZC5zZW1pX21pbm9yX2F4aXMpKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVBST0pKU09OKHByb2pqc29uLCByZXN1bHQgPSB7fSkge1xuICBpZiAoIXByb2pqc29uIHx8IHR5cGVvZiBwcm9qanNvbiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gcHJvampzb247IC8vIFJldHVybiBwcmltaXRpdmUgdmFsdWVzIGFzLWlzXG4gIH1cblxuICBpZiAocHJvampzb24udHlwZSA9PT0gJ0JvdW5kQ1JTJykge1xuICAgIHRyYW5zZm9ybVBST0pKU09OKHByb2pqc29uLnNvdXJjZV9jcnMsIHJlc3VsdCk7XG5cbiAgICBpZiAocHJvampzb24udHJhbnNmb3JtYXRpb24pIHtcbiAgICAgIGlmIChwcm9qanNvbi50cmFuc2Zvcm1hdGlvbi5tZXRob2QgJiYgcHJvampzb24udHJhbnNmb3JtYXRpb24ubWV0aG9kLm5hbWUgPT09ICdOVHYyJykge1xuICAgICAgICAvLyBTZXQgbmFkZ3JpZHMgdG8gdGhlIGZpbGVuYW1lIGZyb20gdGhlIHBhcmFtZXRlcmZpbGVcbiAgICAgICAgcmVzdWx0Lm5hZGdyaWRzID0gcHJvampzb24udHJhbnNmb3JtYXRpb24ucGFyYW1ldGVyc1swXS52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFBvcHVsYXRlIGRhdHVtX3BhcmFtcyBpZiBubyBwYXJhbWV0ZXJmaWxlIGlzIGZvdW5kXG4gICAgICAgIHJlc3VsdC5kYXR1bV9wYXJhbXMgPSBwcm9qanNvbi50cmFuc2Zvcm1hdGlvbi5wYXJhbWV0ZXJzLm1hcCgocGFyYW0pID0+IHBhcmFtLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDsgLy8gUmV0dXJuIGVhcmx5IGZvciBCb3VuZENSU1xuICB9XG5cbiAgLy8gSGFuZGxlIHNwZWNpZmljIGtleXMgaW4gUFJPSkpTT05cbiAgT2JqZWN0LmtleXMocHJvampzb24pLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gcHJvampzb25ba2V5XTtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgIGlmIChyZXN1bHQuc3JzQ29kZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5uYW1lID0gdmFsdWU7XG4gICAgICAgIHJlc3VsdC5zcnNDb2RlID0gdmFsdWU7IC8vIE1hcCBgbmFtZWAgdG8gYHNyc0NvZGVgXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgaWYgKHZhbHVlID09PSAnR2VvZ3JhcGhpY0NSUycpIHtcbiAgICAgICAgICByZXN1bHQucHJvak5hbWUgPSAnbG9uZ2xhdCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdQcm9qZWN0ZWRDUlMnICYmIHByb2pqc29uLmNvbnZlcnNpb24gJiYgcHJvampzb24uY29udmVyc2lvbi5tZXRob2QpIHtcbiAgICAgICAgICByZXN1bHQucHJvak5hbWUgPSBwcm9qanNvbi5jb252ZXJzaW9uLm1ldGhvZC5uYW1lOyAvLyBSZXRhaW4gb3JpZ2luYWwgY2FwaXRhbGl6YXRpb25cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZGF0dW0nOlxuICAgICAgY2FzZSAnZGF0dW1fZW5zZW1ibGUnOiAvLyBIYW5kbGUgYm90aCBkYXR1bSBhbmQgZW5zZW1ibGVcbiAgICAgICAgaWYgKHZhbHVlLmVsbGlwc29pZCkge1xuICAgICAgICAgIC8vIEV4dHJhY3QgZWxsaXBzb2lkIHByb3BlcnRpZXNcbiAgICAgICAgICByZXN1bHQuZWxscHMgPSB2YWx1ZS5lbGxpcHNvaWQubmFtZTtcbiAgICAgICAgICBjYWxjdWxhdGVFbGxpcHNvaWQodmFsdWUsIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLnByaW1lX21lcmlkaWFuKSB7XG4gICAgICAgICAgcmVzdWx0LmZyb21fZ3JlZW53aWNoID0gdmFsdWUucHJpbWVfbWVyaWRpYW4ubG9uZ2l0dWRlICogTWF0aC5QSSAvIDE4MDsgLy8gQ29udmVydCB0byByYWRpYW5zXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2VsbGlwc29pZCc6XG4gICAgICAgIHJlc3VsdC5lbGxwcyA9IHZhbHVlLm5hbWU7XG4gICAgICAgIGNhbGN1bGF0ZUVsbGlwc29pZCh2YWx1ZSwgcmVzdWx0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3ByaW1lX21lcmlkaWFuJzpcbiAgICAgICAgcmVzdWx0LmxvbmcwID0gKHZhbHVlLmxvbmdpdHVkZSB8fCAwKSAqIE1hdGguUEkgLyAxODA7IC8vIENvbnZlcnQgdG8gcmFkaWFuc1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY29vcmRpbmF0ZV9zeXN0ZW0nOlxuICAgICAgICBpZiAodmFsdWUuYXhpcykge1xuICAgICAgICAgIHJlc3VsdC5heGlzID0gdmFsdWUuYXhpc1xuICAgICAgICAgICAgLm1hcCgoYXhpcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBheGlzLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2Vhc3QnKSByZXR1cm4gJ2UnO1xuICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbm9ydGgnKSByZXR1cm4gJ24nO1xuICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnd2VzdCcpIHJldHVybiAndyc7XG4gICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdzb3V0aCcpIHJldHVybiAncyc7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBheGlzIGRpcmVjdGlvbjogJHtkaXJlY3Rpb259YCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oJycpICsgJ3UnOyAvLyBDb21iaW5lIGludG8gYSBzaW5nbGUgc3RyaW5nIChlLmcuLCBcImVudVwiKVxuXG4gICAgICAgICAgaWYgKHZhbHVlLnVuaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdW5pdHMsIHRvX21ldGVyIH0gPSBwcm9jZXNzVW5pdCh2YWx1ZS51bml0KTtcbiAgICAgICAgICAgIHJlc3VsdC51bml0cyA9IHVuaXRzO1xuICAgICAgICAgICAgcmVzdWx0LnRvX21ldGVyID0gdG9fbWV0ZXI7XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5heGlzWzBdICYmIHZhbHVlLmF4aXNbMF0udW5pdCkge1xuICAgICAgICAgICAgY29uc3QgeyB1bml0cywgdG9fbWV0ZXIgfSA9IHByb2Nlc3NVbml0KHZhbHVlLmF4aXNbMF0udW5pdCk7XG4gICAgICAgICAgICByZXN1bHQudW5pdHMgPSB1bml0cztcbiAgICAgICAgICAgIHJlc3VsdC50b19tZXRlciA9IHRvX21ldGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICBjYXNlICdpZCc6XG4gICAgICAgIGlmICh2YWx1ZS5hdXRob3JpdHkgJiYgdmFsdWUuY29kZSkge1xuICAgICAgICAgIHJlc3VsdC50aXRsZSA9IHZhbHVlLmF1dGhvcml0eSArICc6JyArIHZhbHVlLmNvZGU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2NvbnZlcnNpb24nOlxuICAgICAgICBpZiAodmFsdWUubWV0aG9kICYmIHZhbHVlLm1ldGhvZC5uYW1lKSB7XG4gICAgICAgICAgcmVzdWx0LnByb2pOYW1lID0gdmFsdWUubWV0aG9kLm5hbWU7IC8vIFJldGFpbiBvcmlnaW5hbCBjYXBpdGFsaXphdGlvblxuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5wYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgdmFsdWUucGFyYW1ldGVycy5mb3JFYWNoKChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1OYW1lID0gcGFyYW0ubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgJ18nKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtVmFsdWUgPSBwYXJhbS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwYXJhbS51bml0ICYmIHBhcmFtLnVuaXQuY29udmVyc2lvbl9mYWN0b3IpIHtcbiAgICAgICAgICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBwYXJhbVZhbHVlICogcGFyYW0udW5pdC5jb252ZXJzaW9uX2ZhY3RvcjsgLy8gQ29udmVydCB0byByYWRpYW5zIG9yIG1ldGVyc1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbS51bml0ID09PSAnZGVncmVlJykge1xuICAgICAgICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IHBhcmFtVmFsdWUgKiBNYXRoLlBJIC8gMTgwOyAvLyBDb252ZXJ0IHRvIHJhZGlhbnNcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gcGFyYW1WYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndW5pdCc6XG4gICAgICAgIGlmICh2YWx1ZS5uYW1lKSB7XG4gICAgICAgICAgcmVzdWx0LnVuaXRzID0gdmFsdWUubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIGlmIChyZXN1bHQudW5pdHMgPT09ICdtZXRyZScpIHtcbiAgICAgICAgICAgIHJlc3VsdC51bml0cyA9ICdtZXRlcic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5jb252ZXJzaW9uX2ZhY3Rvcikge1xuICAgICAgICAgIHJlc3VsdC50b19tZXRlciA9IHZhbHVlLmNvbnZlcnNpb25fZmFjdG9yO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdiYXNlX2Nycyc6XG4gICAgICAgIHRyYW5zZm9ybVBST0pKU09OKHZhbHVlLCByZXN1bHQpOyAvLyBQYXNzIGByZXN1bHRgIGRpcmVjdGx5XG4gICAgICAgIHJlc3VsdC5kYXR1bUNvZGUgPSB2YWx1ZS5pZCA/IHZhbHVlLmlkLmF1dGhvcml0eSArICdfJyArIHZhbHVlLmlkLmNvZGUgOiB2YWx1ZS5uYW1lOyAvLyBTZXQgZGF0dW1Db2RlXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBJZ25vcmUgaXJyZWxldmFudCBvciB1bm5lZWRlZCBwcm9wZXJ0aWVzXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWRkaXRpb25hbCBjYWxjdWxhdGVkIHByb3BlcnRpZXNcbiAgaWYgKHJlc3VsdC5sYXRpdHVkZV9vZl9mYWxzZV9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQwID0gcmVzdWx0LmxhdGl0dWRlX29mX2ZhbHNlX29yaWdpbjsgLy8gQWxyZWFkeSBpbiByYWRpYW5zXG4gIH1cbiAgaWYgKHJlc3VsdC5sb25naXR1ZGVfb2ZfZmFsc2Vfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubG9uZzAgPSByZXN1bHQubG9uZ2l0dWRlX29mX2ZhbHNlX29yaWdpbjtcbiAgfVxuICBpZiAocmVzdWx0LmxhdGl0dWRlX29mX3N0YW5kYXJkX3BhcmFsbGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MCA9IHJlc3VsdC5sYXRpdHVkZV9vZl9zdGFuZGFyZF9wYXJhbGxlbDtcbiAgICByZXN1bHQubGF0MSA9IHJlc3VsdC5sYXRpdHVkZV9vZl9zdGFuZGFyZF9wYXJhbGxlbDtcbiAgfVxuICBpZiAocmVzdWx0LmxhdGl0dWRlX29mXzFzdF9zdGFuZGFyZF9wYXJhbGxlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDEgPSByZXN1bHQubGF0aXR1ZGVfb2ZfMXN0X3N0YW5kYXJkX3BhcmFsbGVsO1xuICB9XG4gIGlmIChyZXN1bHQubGF0aXR1ZGVfb2ZfMm5kX3N0YW5kYXJkX3BhcmFsbGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MiA9IHJlc3VsdC5sYXRpdHVkZV9vZl8ybmRfc3RhbmRhcmRfcGFyYWxsZWw7IFxuICB9XG4gIGlmIChyZXN1bHQubGF0aXR1ZGVfb2ZfcHJvamVjdGlvbl9jZW50cmUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQwID0gcmVzdWx0LmxhdGl0dWRlX29mX3Byb2plY3Rpb25fY2VudHJlO1xuICB9XG4gIGlmIChyZXN1bHQubG9uZ2l0dWRlX29mX3Byb2plY3Rpb25fY2VudHJlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubG9uZ2MgPSByZXN1bHQubG9uZ2l0dWRlX29mX3Byb2plY3Rpb25fY2VudHJlO1xuICB9XG4gIGlmIChyZXN1bHQuZWFzdGluZ19hdF9mYWxzZV9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC54MCA9IHJlc3VsdC5lYXN0aW5nX2F0X2ZhbHNlX29yaWdpbjtcbiAgfVxuICBpZiAocmVzdWx0Lm5vcnRoaW5nX2F0X2ZhbHNlX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LnkwID0gcmVzdWx0Lm5vcnRoaW5nX2F0X2ZhbHNlX29yaWdpbjtcbiAgfVxuICBpZiAocmVzdWx0LmxhdGl0dWRlX29mX25hdHVyYWxfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MCA9IHJlc3VsdC5sYXRpdHVkZV9vZl9uYXR1cmFsX29yaWdpbjtcbiAgfVxuICBpZiAocmVzdWx0LmxvbmdpdHVkZV9vZl9uYXR1cmFsX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxvbmcwID0gcmVzdWx0LmxvbmdpdHVkZV9vZl9uYXR1cmFsX29yaWdpbjtcbiAgfVxuICBpZiAocmVzdWx0LmxvbmdpdHVkZV9vZl9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sb25nMCA9IHJlc3VsdC5sb25naXR1ZGVfb2Zfb3JpZ2luO1xuICB9XG4gIGlmIChyZXN1bHQuZmFsc2VfZWFzdGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LngwID0gcmVzdWx0LmZhbHNlX2Vhc3Rpbmc7XG4gIH1cbiAgaWYgKHJlc3VsdC5lYXN0aW5nX2F0X3Byb2plY3Rpb25fY2VudHJlKSB7XG4gICAgcmVzdWx0LngwID0gcmVzdWx0LmVhc3RpbmdfYXRfcHJvamVjdGlvbl9jZW50cmU7XG4gIH1cbiAgaWYgKHJlc3VsdC5mYWxzZV9ub3J0aGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LnkwID0gcmVzdWx0LmZhbHNlX25vcnRoaW5nO1xuICB9XG4gIGlmIChyZXN1bHQubm9ydGhpbmdfYXRfcHJvamVjdGlvbl9jZW50cmUpIHtcbiAgICByZXN1bHQueTAgPSByZXN1bHQubm9ydGhpbmdfYXRfcHJvamVjdGlvbl9jZW50cmU7XG4gIH1cbiAgaWYgKHJlc3VsdC5zdGFuZGFyZF9wYXJhbGxlbF8xICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MSA9IHJlc3VsdC5zdGFuZGFyZF9wYXJhbGxlbF8xO1xuICB9XG4gIGlmIChyZXN1bHQuc3RhbmRhcmRfcGFyYWxsZWxfMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDIgPSByZXN1bHQuc3RhbmRhcmRfcGFyYWxsZWxfMjtcbiAgfVxuICBpZiAocmVzdWx0LnNjYWxlX2ZhY3Rvcl9hdF9uYXR1cmFsX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmswID0gcmVzdWx0LnNjYWxlX2ZhY3Rvcl9hdF9uYXR1cmFsX29yaWdpbjtcbiAgfVxuICBpZiAocmVzdWx0LnNjYWxlX2ZhY3Rvcl9hdF9wcm9qZWN0aW9uX2NlbnRyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmswID0gcmVzdWx0LnNjYWxlX2ZhY3Rvcl9hdF9wcm9qZWN0aW9uX2NlbnRyZTtcbiAgfVxuICBpZiAocmVzdWx0LnNjYWxlX2ZhY3Rvcl9vbl9wc2V1ZG9fc3RhbmRhcmRfcGFyYWxsZWwgIT09IHVuZGVmaW5lZCkgeyAgXG4gICAgcmVzdWx0LmswID0gcmVzdWx0LnNjYWxlX2ZhY3Rvcl9vbl9wc2V1ZG9fc3RhbmRhcmRfcGFyYWxsZWw7XG4gIH1cbiAgaWYgKHJlc3VsdC5hemltdXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQuYWxwaGEgPSByZXN1bHQuYXppbXV0aDtcbiAgfVxuICBpZiAocmVzdWx0LmF6aW11dGhfYXRfcHJvamVjdGlvbl9jZW50cmUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5hbHBoYSA9IHJlc3VsdC5hemltdXRoX2F0X3Byb2plY3Rpb25fY2VudHJlO1xuICB9XG4gIGlmIChyZXN1bHQuYW5nbGVfZnJvbV9yZWN0aWZpZWRfdG9fc2tld19ncmlkKSB7XG4gICAgcmVzdWx0LnJlY3RpZmllZF9ncmlkX2FuZ2xlID0gcmVzdWx0LmFuZ2xlX2Zyb21fcmVjdGlmaWVkX3RvX3NrZXdfZ3JpZDtcbiAgfVxuXG4gIC8vIEFwcGx5IHByb2plY3Rpb24gZGVmYXVsdHNcbiAgYXBwbHlQcm9qZWN0aW9uRGVmYXVsdHMocmVzdWx0KTtcblxuICByZXR1cm4gcmVzdWx0O1xufSIsInZhciBEMlIgPSAwLjAxNzQ1MzI5MjUxOTk0MzI5NTc3O1xuXG5leHBvcnQgZnVuY3Rpb24gZDJyKGlucHV0KSB7XG4gIHJldHVybiBpbnB1dCAqIEQyUjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UHJvamVjdGlvbkRlZmF1bHRzKHdrdCkge1xuICAvLyBOb3JtYWxpemUgcHJvak5hbWUgZm9yIFdLVDIgY29tcGF0aWJpbGl0eVxuICBjb25zdCBub3JtYWxpemVkUHJvak5hbWUgPSAod2t0LnByb2pOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJyAnKTtcblxuICBpZiAoIXdrdC5sb25nMCAmJiB3a3QubG9uZ2MgJiYgKG5vcm1hbGl6ZWRQcm9qTmFtZSA9PT0gJ2FsYmVycyBjb25pYyBlcXVhbCBhcmVhJyB8fCBub3JtYWxpemVkUHJvak5hbWUgPT09ICdsYW1iZXJ0IGF6aW11dGhhbCBlcXVhbCBhcmVhJykpIHtcbiAgICB3a3QubG9uZzAgPSB3a3QubG9uZ2M7XG4gIH1cbiAgaWYgKCF3a3QubGF0X3RzICYmIHdrdC5sYXQxICYmIChub3JtYWxpemVkUHJvak5hbWUgPT09ICdzdGVyZW9ncmFwaGljIHNvdXRoIHBvbGUnIHx8IG5vcm1hbGl6ZWRQcm9qTmFtZSA9PT0gJ3BvbGFyIHN0ZXJlb2dyYXBoaWMgKHZhcmlhbnQgYiknKSkge1xuICAgIHdrdC5sYXQwID0gZDJyKHdrdC5sYXQxID4gMCA/IDkwIDogLTkwKTtcbiAgICB3a3QubGF0X3RzID0gd2t0LmxhdDE7XG4gICAgZGVsZXRlIHdrdC5sYXQxO1xuICB9IGVsc2UgaWYgKCF3a3QubGF0X3RzICYmIHdrdC5sYXQwICYmIChub3JtYWxpemVkUHJvak5hbWUgPT09ICdwb2xhciBzdGVyZW9ncmFwaGljJyB8fCBub3JtYWxpemVkUHJvak5hbWUgPT09ICdwb2xhciBzdGVyZW9ncmFwaGljICh2YXJpYW50IGEpJykpIHtcbiAgICB3a3QubGF0X3RzID0gd2t0LmxhdDA7XG4gICAgd2t0LmxhdDAgPSBkMnIod2t0LmxhdDAgPiAwID8gOTAgOiAtOTApO1xuICAgIGRlbGV0ZSB3a3QubGF0MTtcbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy9AdHMtY2hlY2tcbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgcHJvajQgZnJvbSBcInByb2o0XCI7XG5cbi8vIEVQU0c6MzAzNSBkZWZpbml0aW9uXG5wcm9qNC5kZWZzKFwiRVBTRzozMDM1XCIsXG4gIFwiK3Byb2o9bGFlYSArbGF0XzA9NTIgK2xvbl8wPTEwICt4XzA9NDMyMTAwMCAreV8wPTMyMTAwMDAgK2VsbHBzPUdSUzgwICt1bml0cz1tICtub19kZWZzXCJcbik7XG5jb25zdCB0cmFuc2Zvcm0gPSBwcm9qNChwcm9qNC5XR1M4NCwgXCJFUFNHOjMwMzVcIik7XG5cbi8qKlxuICogUHJvamVjdGlvbiBmdW5jdGlvbiBmb3IgRXVyb3BlYW4gTEFFQS5cbiAqIEZyb20gW2xvbixsYXRdIHRvIFt4LHldXG4gKi9cbmV4cG9ydCBjb25zdCBwcm9qMzAzNSA9IHRyYW5zZm9ybS5mb3J3YXJkO1xuXG5cbi8vdGVzdFxuLy9jb25zb2xlLmxvZyhwcm9qMzAzNShbMzMuMDAzLCAzNC43NDddKSlcbi8vMTYxNTA2NywyICA2NDE1NzI4LDVcblxuXG4vL2ltcG9ydCB7IGdlb0F6aW11dGhhbEVxdWFsQXJlYSB9IGZyb20gJ2QzLWdlbydcbi8vXCJkMy1nZW9cIjogXCJeMy4wLjFcIixcblxuLypleHBvcnQgY29uc3QgcHJvajMwMzUgPSBnZW9BemltdXRoYWxFcXVhbEFyZWEoKVxuICAgIC5yb3RhdGUoWy0xMCwgLTUyXSlcbiAgICAucmVmbGVjdFgoZmFsc2UpXG4gICAgLnJlZmxlY3RZKHRydWUpXG4gICAgLnNjYWxlKDYzNzA5OTcpIC8vNjM3ODEzN1xuICAgIC50cmFuc2xhdGUoWzQzMjEwMDAsIDMyMTAwMDBdKVxuKi9cblxuXG5cblxuLyoqXG4gKiBSZXR1cm5zIG9wdGlvbnMgZm9yIGdyaWR2aXogbGFiZWwgbGF5ZXIuXG4gKiBGcm9tIEV1cm9ueW0gZGF0YTogaHR0cHM6Ly9naXRodWIuY29tL2V1cm9zdGF0L2V1cm9ueW1cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgZ2V0RXVyb255bWVMYWJlbExheWVyID0gZnVuY3Rpb24gKGNjID0gJ0VVUicsIHJlcyA9IDUwLCBvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge31cbiAgICBjb25zdCBleCA9IG9wdHMuZXggfHwgMS4yXG4gICAgY29uc3QgZm9udEZhbWlseSA9IG9wdHMuZm9udEZhbWlseSB8fCAnQXJpYWwnXG4gICAgY29uc3QgZXhTaXplID0gb3B0cy5leFNpemUgfHwgMS4yXG4gICAgb3B0cy5zdHlsZSA9XG4gICAgICAgIG9wdHMuc3R5bGUgfHxcbiAgICAgICAgKChsYiwgemYpID0+IHtcbiAgICAgICAgICAgIGlmIChsYi5ycyA8IGV4ICogemYpIHJldHVyblxuICAgICAgICAgICAgaWYgKGxiLnIxIDwgZXggKiB6ZikgcmV0dXJuIGV4U2l6ZSArICdlbSAnICsgZm9udEZhbWlseVxuICAgICAgICAgICAgcmV0dXJuIGV4U2l6ZSAqIDEuNSArICdlbSAnICsgZm9udEZhbWlseVxuICAgICAgICB9KVxuICAgIG9wdHMucHJvaiA9IG9wdHMucHJvaiB8fCBwcm9qMzAzNVxuICAgIG9wdHMucHJlcHJvY2VzcyA9IChsYikgPT4ge1xuICAgICAgICAvL2V4Y2x1ZGUgY291bnRyaWVzXG4gICAgICAgIC8vaWYob3B0cy5jY091dCAmJiBsYi5jYyAmJiBvcHRzLmNjT3V0LmluY2x1ZGVzKGxiLmNjKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAob3B0cy5jY0luICYmIGxiLmNjICYmICEob3B0cy5jY0luLmluZGV4T2YobGIuY2MpID49IDApKSByZXR1cm4gZmFsc2VcblxuICAgICAgICAvL3Byb2plY3QgZnJvbSBnZW8gY29vcmRpbmF0ZXMgdG8gRVRSUzg5LUxBRUFcbiAgICAgICAgY29uc3QgcCA9IG9wdHMucHJvaihbbGIubG9uLCBsYi5sYXRdKVxuICAgICAgICBsYi54ID0gcFswXVxuICAgICAgICBsYi55ID0gcFsxXVxuICAgICAgICBkZWxldGUgbGIubG9uXG4gICAgICAgIGRlbGV0ZSBsYi5sYXRcbiAgICB9XG4gICAgb3B0cy5iYXNlVVJMID0gb3B0cy5iYXNlVVJMIHx8ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZXVyb3N0YXQvZXVyb255bS9tYWluL3B1Yi92My9VVEZfTEFUSU4vJ1xuICAgIG9wdHMudXJsID0gb3B0cy5iYXNlVVJMICsgcmVzICsgJy8nICsgY2MgKyAnLmNzdidcbiAgICByZXR1cm4gb3B0c1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBvcHRpb25zIGZvciBncmlkdml6IGJvdW5kYXJpZXMgbGF5ZXIuXG4gKiBGcm9tIE51dHMyanNvbiBkYXRhOiBodHRwczovL2dpdGh1Yi5jb20vZXVyb3N0YXQvTnV0czJqc29uXG4gKiBcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFdXJvc3RhdEJvdW5kYXJpZXNMYXllciA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge31cbiAgICBjb25zdCBudXRzWWVhciA9IG9wdHMubnV0c1llYXIgfHwgJzIwMjEnXG4gICAgY29uc3QgZ2VvID0gb3B0cy5nZW9cbiAgICBjb25zdCBjcnMgPSBvcHRzLmNycyB8fCAnMzAzNSdcbiAgICBjb25zdCBzY2FsZSA9IG9wdHMuc2NhbGUgfHwgJzAzTSdcbiAgICBjb25zdCBudXRzTGV2ZWwgPSBvcHRzLm51dHNMZXZlbCB8fCAnMydcbiAgICBjb25zdCBjb2wgPSBvcHRzLmNvbCB8fCAnIzg4OCdcbiAgICBjb25zdCBjb2xLb3Nvdm8gPSBvcHRzLmNvbEtvc292byB8fCAnI2JjYmNiYydcbiAgICBjb25zdCBzaG93T3RoID0gb3B0cy5zaG93T3RoID09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRzLnNob3dPdGhcblxuICAgIC8vaW4gbW9zdCBvZiB0aGUgY2FzZSwgYWxyZWFkeSBwcm9qZWN0ZWQgZGF0YSBvZiBudXRzMmpzb24gd2lsbCBiZSB1c2VkLCB1c2luZyAnb3B0cy5jcnMnXG4gICAgaWYgKG9wdHMucHJvailcbiAgICAgICAgb3B0cy5wcmVwcm9jZXNzID0gKGJuKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChibi5nZW9tZXRyeS50eXBlID09PSBcIkxpbmVTdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNzID0gW11cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjIG9mIGJuLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAgICAgICAgICAgICBjcy5wdXNoKG9wdHMucHJvaihjKSlcbiAgICAgICAgICAgICAgICBibi5nZW9tZXRyeS5jb29yZGluYXRlcyA9IGNzXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBwcm9qZWN0IGJvdW5kYXJ5IC0gdW5zdXBwb3J0ZWQgZ2VvbWV0cnkgdHlwZTogXCIgKyBibi5nZW9tZXRyeS50eXBlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgb3B0cy5jb2xvciA9XG4gICAgICAgIG9wdHMuY29sb3IgfHxcbiAgICAgICAgKChmLCB6ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IGYucHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKCFzaG93T3RoIC8qJiYgcC5jbyA9PSBcIkZcIiovICYmIHAuZXUgIT0gJ1QnICYmIHAuY2MgIT0gJ1QnICYmIHAuZWZ0YSAhPSAnVCcgJiYgcC5vdGggPT09ICdUJylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGlmIChwLmlkID49IDEwMDAwMCkgcmV0dXJuIGNvbEtvc292b1xuICAgICAgICAgICAgaWYgKHAuY28gPT09ICdUJykgcmV0dXJuIGNvbFxuICAgICAgICAgICAgaWYgKHpmIDwgNDAwKSByZXR1cm4gY29sXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA+PSAzID8gJycgOiBjb2xcbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMjAwMCkgcmV0dXJuIHAubHZsID49IDIgPyAnJyA6IGNvbFxuICAgICAgICAgICAgZWxzZSByZXR1cm4gcC5sdmwgPj0gMSA/ICcnIDogY29sXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLndpZHRoID1cbiAgICAgICAgb3B0cy53aWR0aCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gMC41XG4gICAgICAgICAgICBpZiAoemYgPCA0MDApIHJldHVybiBwLmx2bCA9PSAzID8gMi4yIDogcC5sdmwgPT0gMiA/IDIuMiA6IHAubHZsID09IDEgPyAyLjIgOiA0XG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApIHJldHVybiBwLmx2bCA9PSAyID8gMS44IDogcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAyMDAwKSByZXR1cm4gcC5sdmwgPT0gMSA/IDEuOCA6IDIuNVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gMS4yXG4gICAgICAgIH0pXG5cbiAgICBvcHRzLmxpbmVEYXNoID1cbiAgICAgICAgb3B0cy5saW5lRGFzaCB8fFxuICAgICAgICAoKGYsIHpmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gZi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAocC5jbyA9PT0gJ1QnKSByZXR1cm4gW11cbiAgICAgICAgICAgIGlmICh6ZiA8IDQwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gM1xuICAgICAgICAgICAgICAgICAgICA/IFsyICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgOiBwLmx2bCA9PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFs1ICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogcC5sdmwgPT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gWzUgKiB6ZiwgMiAqIHpmXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWzEwICogemYsIDMgKiB6Zl1cbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMTAwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcC5sdmwgPT0gMiA/IFs1ICogemYsIDIgKiB6Zl0gOiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDIwMDApIHJldHVybiBwLmx2bCA9PSAxID8gWzUgKiB6ZiwgMiAqIHpmXSA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIHJldHVybiBbMTAgKiB6ZiwgMyAqIHpmXVxuICAgICAgICB9KVxuXG4gICAgb3B0cy5iYXNlVVJMID0gb3B0cy5iYXNlVVJMIHx8ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZXVyb3N0YXQvTnV0czJqc29uL21hc3Rlci9wdWIvdjIvJ1xuICAgIG9wdHMudXJsID0gb3B0cy5iYXNlVVJMICsgbnV0c1llYXIgKyAoZ2VvID8gJy8nICsgZ2VvIDogJycpICsgJy8nICsgY3JzICsgJy8nICsgc2NhbGUgKyAnL251dHNibl8nICsgbnV0c0xldmVsICsgJy5qc29uJ1xuICAgIHJldHVybiBvcHRzXG59XG5cblxuXG4vL3ByZXBhcmUgb2JqZWN0IGZvciBnaXNjbyBiYWNrZ3JvdW5kIGxheWVyIGNyZWF0aW9uXG4vL3NlZSBodHRwczovL2dpc2NvLXNlcnZpY2VzLmVjLmV1cm9wYS5ldS9tYXBzL2RlbW8vP3dtdHNfbGF5ZXI9T1NNUG9zaXRyb25CYWNrZ3JvdW5kJmZvcm1hdD1wbmcmc3JzPUVQU0clM0EzMDM1XG5leHBvcnQgZnVuY3Rpb24gZ2lzY29CYWNrZ3JvdW5kTGF5ZXIobWFwID0gXCJPU01Qb3NpdHJvbkJhY2tncm91bmRcIiwgZGVwdGggPSAxOSwgY3JzID0gXCJFUFNHMzAzNVwiLCB0ZW1wbGF0ZSA9IHt9KSB7XG4gICAgdGVtcGxhdGUudXJsID0gXCJodHRwczovL2dpc2NvLXNlcnZpY2VzLmVjLmV1cm9wYS5ldS9tYXBzL3RpbGVzL1wiICsgbWFwICsgXCIvXCIgKyBjcnMgKyBcIi9cIlxuICAgIHRlbXBsYXRlLnJlc29sdXRpb25zID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogZGVwdGggfSwgKF8sIGkpID0+IDE1NjU0My4wMzM5MjgwNDA5NyAqIE1hdGgucG93KDIsIC1pKSlcbiAgICB0ZW1wbGF0ZS5vcmlnaW4gPSBbMCwgNjAwMDAwMF1cbiAgICByZXR1cm4gdGVtcGxhdGVcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==