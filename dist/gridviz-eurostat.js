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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHZpei1ldXJvc3RhdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFFBQVE7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxRQUFRO0FBQ1o7QUFDQTs7QUFFQSxZQUFZO0FBQ1osWUFBWTtBQUNaLFlBQVk7QUFDWixZQUFZO0FBQ1osWUFBWTtBQUNaLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCO0FBQ087QUFDUCw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUI7QUFDckIsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBLCtDQUErQztBQUMvQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ2h3Q3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEs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dURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxhQUFhO0FBQ3RFLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7O0FBRUEsa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLG1CQUFtQixFOzs7Ozs7Ozs7Ozs7Ozs7O0FDNVR5QjtBQUNBOztBQUUzRDtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNPO0FBQ1A7QUFDQSx1Q0FBdUMsK0RBQW1CLEdBQUcsK0RBQW1CO0FBQ2hGO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkNtRDtBQUNNO0FBQ3hCO0FBQ0U7QUFDd0I7QUFDRjs7QUFFekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsNkNBQUc7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyx5Q0FBRztBQUN0QztBQUNBO0FBQ0EscUNBQXFDLHlDQUFHO0FBQ3hDO0FBQ0E7QUFDQSxrQ0FBa0MseUNBQUc7QUFDckMsbUNBQW1DLHlDQUFHO0FBQ3RDLG9DQUFvQyx5Q0FBRztBQUN2QyxvQ0FBb0MseUNBQUc7QUFDdkMsb0NBQW9DLHlDQUFHO0FBQ3ZDO0FBQ0EseUJBQXlCLHlDQUFHO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLEVBQUUsaUVBQXVCO0FBQ3pCO0FBQ0EsNkJBQWUsb0NBQVM7QUFDeEI7QUFDQSxXQUFXLHdFQUFpQjtBQUM1QjtBQUNBLGtCQUFrQixzRUFBZ0I7QUFDbEMsYUFBYSxzREFBTTtBQUNuQjtBQUNBLHFCQUFxQixnRUFBYTtBQUNsQyxXQUFXLHdFQUFpQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxFQUFFLGtEQUFLO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUMxTkEsaUVBQWUsV0FBVyxFQUFDOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDTyx3R0FBd0c7QUFDL0c7QUFDQSx3Q0FBd0MsZUFBZTtBQUN2RDtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL21ncnMvbWdycy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9Qb2ludC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9Qcm9qLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2FkanVzdF9heGlzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NoZWNrU2FuaXR5LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9hZGp1c3RfbGF0LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9hZGp1c3RfbG9uLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9hZGp1c3Rfem9uZS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vYXNpbmh5LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9hc2luei5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vY2xlbnMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2NsZW5zX2NtcGx4LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9jb3NoLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9lMGZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9lMWZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9lMmZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9lM2ZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9nTi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZ2F0Zy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vaHlwb3QuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2ltbGZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9pcXNmbnouanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2xvZzFweS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vbWxmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vbXNmbnouanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3BoaTJ6LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9wal9lbmZuLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9wal9pbnZfbWxmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vcGpfbWxmbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vcXNmbnouanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3NpZ24uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3NpbmguanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3NyYXQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3RvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3RzZm56LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi92aW5jZW50eS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb25zdGFudHMvRGF0dW0uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29uc3RhbnRzL0VsbGlwc29pZC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb25zdGFudHMvUHJpbWVNZXJpZGlhbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb25zdGFudHMvdW5pdHMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29uc3RhbnRzL3ZhbHVlcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb3JlLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2RhdHVtLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2RhdHVtVXRpbHMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGF0dW1fdHJhbnNmb3JtLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2RlZnMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGVyaXZlQ29uc3RhbnRzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvbWF0Y2guanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvbmFkZ3JpZC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wYXJzZUNvZGUuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvalN0cmluZy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9hZWEuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvYWVxZC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9ib25uZS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9jYXNzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2NlYS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9lcWMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZXFkYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9lcWVhcnRoLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2V0bWVyYy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9nYXVzcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9nZW9jZW50LmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2dlb3MuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZ25vbS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9rcm92YWsuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbGFlYS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9sY2MuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbG9uZ2xhdC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9tZXJjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL21pbGwuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbW9sbC5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9uem1nLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL29iX3RyYW4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvb21lcmMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvb3J0aG8uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvcG9seS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9xc2MuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvcm9iaW4uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvc2ludS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9zb21lcmMuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvc3RlcmUuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvc3RlcmVhLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3RtZXJjLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3RwZXJzLmpzIiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3V0bS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy92YW5kZy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi90cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy9wcm9qNC9wcm9qcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvUFJPSkpTT05CdWlsZGVyMjAxNS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvUFJPSkpTT05CdWlsZGVyMjAxOS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvUFJPSkpTT05CdWlsZGVyQmFzZS5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvYnVpbGRQUk9KSlNPTi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvZGV0ZWN0V0tUVmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL3BhcnNlci5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvcHJvY2Vzcy5qcyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0Ly4vbm9kZV9tb2R1bGVzL3drdC1wYXJzZXIvdHJhbnNmb3JtUFJPSkpTT04uanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ncmlkdml6X2V1cm9zdGF0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZ3JpZHZpel9ldXJvc3RhdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2dyaWR2aXpfZXVyb3N0YXQvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZ3JpZHZpel9ldXJvc3RhdFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJncmlkdml6X2V1cm9zdGF0XCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIlxuXG5cbi8qKlxuICogVVRNIHpvbmVzIGFyZSBncm91cGVkLCBhbmQgYXNzaWduZWQgdG8gb25lIG9mIGEgZ3JvdXAgb2YgNlxuICogc2V0cy5cbiAqXG4gKiB7aW50fSBAcHJpdmF0ZVxuICovXG52YXIgTlVNXzEwMEtfU0VUUyA9IDY7XG5cbi8qKlxuICogVGhlIGNvbHVtbiBsZXR0ZXJzIChmb3IgZWFzdGluZykgb2YgdGhlIGxvd2VyIGxlZnQgdmFsdWUsIHBlclxuICogc2V0LlxuICpcbiAqIHtzdHJpbmd9IEBwcml2YXRlXG4gKi9cbnZhciBTRVRfT1JJR0lOX0NPTFVNTl9MRVRURVJTID0gJ0FKU0FKUyc7XG5cbi8qKlxuICogVGhlIHJvdyBsZXR0ZXJzIChmb3Igbm9ydGhpbmcpIG9mIHRoZSBsb3dlciBsZWZ0IHZhbHVlLCBwZXJcbiAqIHNldC5cbiAqXG4gKiB7c3RyaW5nfSBAcHJpdmF0ZVxuICovXG52YXIgU0VUX09SSUdJTl9ST1dfTEVUVEVSUyA9ICdBRkFGQUYnO1xuXG52YXIgQSA9IDY1OyAvLyBBXG52YXIgSSA9IDczOyAvLyBJXG52YXIgTyA9IDc5OyAvLyBPXG52YXIgViA9IDg2OyAvLyBWXG52YXIgWiA9IDkwOyAvLyBaXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIHRvUG9pbnQ6IHRvUG9pbnRcbn07XG4vKipcbiAqIENvbnZlcnNpb24gb2YgbGF0L2xvbiB0byBNR1JTLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBsbCBPYmplY3QgbGl0ZXJhbCB3aXRoIGxhdCBhbmQgbG9uIHByb3BlcnRpZXMgb24gYVxuICogICAgIFdHUzg0IGVsbGlwc29pZC5cbiAqIEBwYXJhbSB7aW50fSBhY2N1cmFjeSBBY2N1cmFjeSBpbiBkaWdpdHMgKDUgZm9yIDEgbSwgNCBmb3IgMTAgbSwgMyBmb3JcbiAqICAgICAgMTAwIG0sIDIgZm9yIDEwMDAgbSBvciAxIGZvciAxMDAwMCBtKS4gT3B0aW9uYWwsIGRlZmF1bHQgaXMgNS5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIE1HUlMgc3RyaW5nIGZvciB0aGUgZ2l2ZW4gbG9jYXRpb24gYW5kIGFjY3VyYWN5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChsbCwgYWNjdXJhY3kpIHtcbiAgYWNjdXJhY3kgPSBhY2N1cmFjeSB8fCA1OyAvLyBkZWZhdWx0IGFjY3VyYWN5IDFtXG4gIHJldHVybiBlbmNvZGUoTEx0b1VUTSh7XG4gICAgbGF0OiBsbFsxXSxcbiAgICBsb246IGxsWzBdXG4gIH0pLCBhY2N1cmFjeSk7XG59O1xuXG4vKipcbiAqIENvbnZlcnNpb24gb2YgTUdSUyB0byBsYXQvbG9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZ3JzIE1HUlMgc3RyaW5nLlxuICogQHJldHVybiB7YXJyYXl9IEFuIGFycmF5IHdpdGggbGVmdCAobG9uZ2l0dWRlKSwgYm90dG9tIChsYXRpdHVkZSksIHJpZ2h0XG4gKiAgICAgKGxvbmdpdHVkZSkgYW5kIHRvcCAobGF0aXR1ZGUpIHZhbHVlcyBpbiBXR1M4NCwgcmVwcmVzZW50aW5nIHRoZVxuICogICAgIGJvdW5kaW5nIGJveCBmb3IgdGhlIHByb3ZpZGVkIE1HUlMgcmVmZXJlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShtZ3JzKSB7XG4gIHZhciBiYm94ID0gVVRNdG9MTChkZWNvZGUobWdycy50b1VwcGVyQ2FzZSgpKSk7XG4gIGlmIChiYm94LmxhdCAmJiBiYm94Lmxvbikge1xuICAgIHJldHVybiBbYmJveC5sb24sIGJib3gubGF0LCBiYm94LmxvbiwgYmJveC5sYXRdO1xuICB9XG4gIHJldHVybiBbYmJveC5sZWZ0LCBiYm94LmJvdHRvbSwgYmJveC5yaWdodCwgYmJveC50b3BdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvUG9pbnQobWdycykge1xuICB2YXIgYmJveCA9IFVUTXRvTEwoZGVjb2RlKG1ncnMudG9VcHBlckNhc2UoKSkpO1xuICBpZiAoYmJveC5sYXQgJiYgYmJveC5sb24pIHtcbiAgICByZXR1cm4gW2Jib3gubG9uLCBiYm94LmxhdF07XG4gIH1cbiAgcmV0dXJuIFsoYmJveC5sZWZ0ICsgYmJveC5yaWdodCkgLyAyLCAoYmJveC50b3AgKyBiYm94LmJvdHRvbSkgLyAyXTtcbn07XG4vKipcbiAqIENvbnZlcnNpb24gZnJvbSBkZWdyZWVzIHRvIHJhZGlhbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWcgdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBhbmdsZSBpbiByYWRpYW5zLlxuICovXG5mdW5jdGlvbiBkZWdUb1JhZChkZWcpIHtcbiAgcmV0dXJuIChkZWcgKiAoTWF0aC5QSSAvIDE4MC4wKSk7XG59XG5cbi8qKlxuICogQ29udmVyc2lvbiBmcm9tIHJhZGlhbnMgdG8gZGVncmVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gKi9cbmZ1bmN0aW9uIHJhZFRvRGVnKHJhZCkge1xuICByZXR1cm4gKDE4MC4wICogKHJhZCAvIE1hdGguUEkpKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIHNldCBvZiBMb25naXR1ZGUgYW5kIExhdGl0dWRlIGNvLW9yZGluYXRlcyB0byBVVE1cbiAqIHVzaW5nIHRoZSBXR1M4NCBlbGxpcHNvaWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBsbCBPYmplY3QgbGl0ZXJhbCB3aXRoIGxhdCBhbmQgbG9uIHByb3BlcnRpZXNcbiAqICAgICByZXByZXNlbnRpbmcgdGhlIFdHUzg0IGNvb3JkaW5hdGUgdG8gYmUgY29udmVydGVkLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgbGl0ZXJhbCBjb250YWluaW5nIHRoZSBVVE0gdmFsdWUgd2l0aCBlYXN0aW5nLFxuICogICAgIG5vcnRoaW5nLCB6b25lTnVtYmVyIGFuZCB6b25lTGV0dGVyIHByb3BlcnRpZXMsIGFuZCBhbiBvcHRpb25hbFxuICogICAgIGFjY3VyYWN5IHByb3BlcnR5IGluIGRpZ2l0cy4gUmV0dXJucyBudWxsIGlmIHRoZSBjb252ZXJzaW9uIGZhaWxlZC5cbiAqL1xuZnVuY3Rpb24gTEx0b1VUTShsbCkge1xuICB2YXIgTGF0ID0gbGwubGF0O1xuICB2YXIgTG9uZyA9IGxsLmxvbjtcbiAgdmFyIGEgPSA2Mzc4MTM3LjA7IC8vZWxsaXAucmFkaXVzO1xuICB2YXIgZWNjU3F1YXJlZCA9IDAuMDA2Njk0Mzg7IC8vZWxsaXAuZWNjc3E7XG4gIHZhciBrMCA9IDAuOTk5NjtcbiAgdmFyIExvbmdPcmlnaW47XG4gIHZhciBlY2NQcmltZVNxdWFyZWQ7XG4gIHZhciBOLCBULCBDLCBBLCBNO1xuICB2YXIgTGF0UmFkID0gZGVnVG9SYWQoTGF0KTtcbiAgdmFyIExvbmdSYWQgPSBkZWdUb1JhZChMb25nKTtcbiAgdmFyIExvbmdPcmlnaW5SYWQ7XG4gIHZhciBab25lTnVtYmVyO1xuICAvLyAoaW50KVxuICBab25lTnVtYmVyID0gTWF0aC5mbG9vcigoTG9uZyArIDE4MCkgLyA2KSArIDE7XG5cbiAgLy9NYWtlIHN1cmUgdGhlIGxvbmdpdHVkZSAxODAuMDAgaXMgaW4gWm9uZSA2MFxuICBpZiAoTG9uZyA9PT0gMTgwKSB7XG4gICAgWm9uZU51bWJlciA9IDYwO1xuICB9XG5cbiAgLy8gU3BlY2lhbCB6b25lIGZvciBOb3J3YXlcbiAgaWYgKExhdCA+PSA1Ni4wICYmIExhdCA8IDY0LjAgJiYgTG9uZyA+PSAzLjAgJiYgTG9uZyA8IDEyLjApIHtcbiAgICBab25lTnVtYmVyID0gMzI7XG4gIH1cblxuICAvLyBTcGVjaWFsIHpvbmVzIGZvciBTdmFsYmFyZFxuICBpZiAoTGF0ID49IDcyLjAgJiYgTGF0IDwgODQuMCkge1xuICAgIGlmIChMb25nID49IDAuMCAmJiBMb25nIDwgOS4wKSB7XG4gICAgICBab25lTnVtYmVyID0gMzE7XG4gICAgfVxuICAgIGVsc2UgaWYgKExvbmcgPj0gOS4wICYmIExvbmcgPCAyMS4wKSB7XG4gICAgICBab25lTnVtYmVyID0gMzM7XG4gICAgfVxuICAgIGVsc2UgaWYgKExvbmcgPj0gMjEuMCAmJiBMb25nIDwgMzMuMCkge1xuICAgICAgWm9uZU51bWJlciA9IDM1O1xuICAgIH1cbiAgICBlbHNlIGlmIChMb25nID49IDMzLjAgJiYgTG9uZyA8IDQyLjApIHtcbiAgICAgIFpvbmVOdW1iZXIgPSAzNztcbiAgICB9XG4gIH1cblxuICBMb25nT3JpZ2luID0gKFpvbmVOdW1iZXIgLSAxKSAqIDYgLSAxODAgKyAzOyAvLyszIHB1dHMgb3JpZ2luXG4gIC8vIGluIG1pZGRsZSBvZlxuICAvLyB6b25lXG4gIExvbmdPcmlnaW5SYWQgPSBkZWdUb1JhZChMb25nT3JpZ2luKTtcblxuICBlY2NQcmltZVNxdWFyZWQgPSAoZWNjU3F1YXJlZCkgLyAoMSAtIGVjY1NxdWFyZWQpO1xuXG4gIE4gPSBhIC8gTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkICogTWF0aC5zaW4oTGF0UmFkKSAqIE1hdGguc2luKExhdFJhZCkpO1xuICBUID0gTWF0aC50YW4oTGF0UmFkKSAqIE1hdGgudGFuKExhdFJhZCk7XG4gIEMgPSBlY2NQcmltZVNxdWFyZWQgKiBNYXRoLmNvcyhMYXRSYWQpICogTWF0aC5jb3MoTGF0UmFkKTtcbiAgQSA9IE1hdGguY29zKExhdFJhZCkgKiAoTG9uZ1JhZCAtIExvbmdPcmlnaW5SYWQpO1xuXG4gIE0gPSBhICogKCgxIC0gZWNjU3F1YXJlZCAvIDQgLSAzICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyA2NCAtIDUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAyNTYpICogTGF0UmFkIC0gKDMgKiBlY2NTcXVhcmVkIC8gOCArIDMgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDMyICsgNDUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAxMDI0KSAqIE1hdGguc2luKDIgKiBMYXRSYWQpICsgKDE1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAyNTYgKyA0NSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDEwMjQpICogTWF0aC5zaW4oNCAqIExhdFJhZCkgLSAoMzUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAzMDcyKSAqIE1hdGguc2luKDYgKiBMYXRSYWQpKTtcblxuICB2YXIgVVRNRWFzdGluZyA9IChrMCAqIE4gKiAoQSArICgxIC0gVCArIEMpICogQSAqIEEgKiBBIC8gNi4wICsgKDUgLSAxOCAqIFQgKyBUICogVCArIDcyICogQyAtIDU4ICogZWNjUHJpbWVTcXVhcmVkKSAqIEEgKiBBICogQSAqIEEgKiBBIC8gMTIwLjApICsgNTAwMDAwLjApO1xuXG4gIHZhciBVVE1Ob3J0aGluZyA9IChrMCAqIChNICsgTiAqIE1hdGgudGFuKExhdFJhZCkgKiAoQSAqIEEgLyAyICsgKDUgLSBUICsgOSAqIEMgKyA0ICogQyAqIEMpICogQSAqIEEgKiBBICogQSAvIDI0LjAgKyAoNjEgLSA1OCAqIFQgKyBUICogVCArIDYwMCAqIEMgLSAzMzAgKiBlY2NQcmltZVNxdWFyZWQpICogQSAqIEEgKiBBICogQSAqIEEgKiBBIC8gNzIwLjApKSk7XG4gIGlmIChMYXQgPCAwLjApIHtcbiAgICBVVE1Ob3J0aGluZyArPSAxMDAwMDAwMC4wOyAvLzEwMDAwMDAwIG1ldGVyIG9mZnNldCBmb3JcbiAgICAvLyBzb3V0aGVybiBoZW1pc3BoZXJlXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5vcnRoaW5nOiBNYXRoLnJvdW5kKFVUTU5vcnRoaW5nKSxcbiAgICBlYXN0aW5nOiBNYXRoLnJvdW5kKFVUTUVhc3RpbmcpLFxuICAgIHpvbmVOdW1iZXI6IFpvbmVOdW1iZXIsXG4gICAgem9uZUxldHRlcjogZ2V0TGV0dGVyRGVzaWduYXRvcihMYXQpXG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgVVRNIGNvb3JkcyB0byBsYXQvbG9uZywgdXNpbmcgdGhlIFdHUzg0IGVsbGlwc29pZC4gVGhpcyBpcyBhIGNvbnZlbmllbmNlXG4gKiBjbGFzcyB3aGVyZSB0aGUgWm9uZSBjYW4gYmUgc3BlY2lmaWVkIGFzIGEgc2luZ2xlIHN0cmluZyBlZy5cIjYwTlwiIHdoaWNoXG4gKiBpcyB0aGVuIGJyb2tlbiBkb3duIGludG8gdGhlIFpvbmVOdW1iZXIgYW5kIFpvbmVMZXR0ZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB1dG0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCBub3J0aGluZywgZWFzdGluZywgem9uZU51bWJlclxuICogICAgIGFuZCB6b25lTGV0dGVyIHByb3BlcnRpZXMuIElmIGFuIG9wdGlvbmFsIGFjY3VyYWN5IHByb3BlcnR5IGlzXG4gKiAgICAgcHJvdmlkZWQgKGluIG1ldGVycyksIGEgYm91bmRpbmcgYm94IHdpbGwgYmUgcmV0dXJuZWQgaW5zdGVhZCBvZlxuICogICAgIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUuXG4gKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBsaXRlcmFsIGNvbnRhaW5pbmcgZWl0aGVyIGxhdCBhbmQgbG9uIHZhbHVlc1xuICogICAgIChpZiBubyBhY2N1cmFjeSB3YXMgcHJvdmlkZWQpLCBvciB0b3AsIHJpZ2h0LCBib3R0b20gYW5kIGxlZnQgdmFsdWVzXG4gKiAgICAgZm9yIHRoZSBib3VuZGluZyBib3ggY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHByb3ZpZGVkIGFjY3VyYWN5LlxuICogICAgIFJldHVybnMgbnVsbCBpZiB0aGUgY29udmVyc2lvbiBmYWlsZWQuXG4gKi9cbmZ1bmN0aW9uIFVUTXRvTEwodXRtKSB7XG5cbiAgdmFyIFVUTU5vcnRoaW5nID0gdXRtLm5vcnRoaW5nO1xuICB2YXIgVVRNRWFzdGluZyA9IHV0bS5lYXN0aW5nO1xuICB2YXIgem9uZUxldHRlciA9IHV0bS56b25lTGV0dGVyO1xuICB2YXIgem9uZU51bWJlciA9IHV0bS56b25lTnVtYmVyO1xuICAvLyBjaGVjayB0aGUgWm9uZU51bW1iZXIgaXMgdmFsaWRcbiAgaWYgKHpvbmVOdW1iZXIgPCAwIHx8IHpvbmVOdW1iZXIgPiA2MCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGswID0gMC45OTk2O1xuICB2YXIgYSA9IDYzNzgxMzcuMDsgLy9lbGxpcC5yYWRpdXM7XG4gIHZhciBlY2NTcXVhcmVkID0gMC4wMDY2OTQzODsgLy9lbGxpcC5lY2NzcTtcbiAgdmFyIGVjY1ByaW1lU3F1YXJlZDtcbiAgdmFyIGUxID0gKDEgLSBNYXRoLnNxcnQoMSAtIGVjY1NxdWFyZWQpKSAvICgxICsgTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkKSk7XG4gIHZhciBOMSwgVDEsIEMxLCBSMSwgRCwgTTtcbiAgdmFyIExvbmdPcmlnaW47XG4gIHZhciBtdSwgcGhpMVJhZDtcblxuICAvLyByZW1vdmUgNTAwLDAwMCBtZXRlciBvZmZzZXQgZm9yIGxvbmdpdHVkZVxuICB2YXIgeCA9IFVUTUVhc3RpbmcgLSA1MDAwMDAuMDtcbiAgdmFyIHkgPSBVVE1Ob3J0aGluZztcblxuICAvLyBXZSBtdXN0IGtub3cgc29tZWhvdyBpZiB3ZSBhcmUgaW4gdGhlIE5vcnRoZXJuIG9yIFNvdXRoZXJuXG4gIC8vIGhlbWlzcGhlcmUsIHRoaXMgaXMgdGhlIG9ubHkgdGltZSB3ZSB1c2UgdGhlIGxldHRlciBTbyBldmVuXG4gIC8vIGlmIHRoZSBab25lIGxldHRlciBpc24ndCBleGFjdGx5IGNvcnJlY3QgaXQgc2hvdWxkIGluZGljYXRlXG4gIC8vIHRoZSBoZW1pc3BoZXJlIGNvcnJlY3RseVxuICBpZiAoem9uZUxldHRlciA8ICdOJykge1xuICAgIHkgLT0gMTAwMDAwMDAuMDsgLy8gcmVtb3ZlIDEwLDAwMCwwMDAgbWV0ZXIgb2Zmc2V0IHVzZWRcbiAgICAvLyBmb3Igc291dGhlcm4gaGVtaXNwaGVyZVxuICB9XG5cbiAgLy8gVGhlcmUgYXJlIDYwIHpvbmVzIHdpdGggem9uZSAxIGJlaW5nIGF0IFdlc3QgLTE4MCB0byAtMTc0XG4gIExvbmdPcmlnaW4gPSAoem9uZU51bWJlciAtIDEpICogNiAtIDE4MCArIDM7IC8vICszIHB1dHMgb3JpZ2luXG4gIC8vIGluIG1pZGRsZSBvZlxuICAvLyB6b25lXG5cbiAgZWNjUHJpbWVTcXVhcmVkID0gKGVjY1NxdWFyZWQpIC8gKDEgLSBlY2NTcXVhcmVkKTtcblxuICBNID0geSAvIGswO1xuICBtdSA9IE0gLyAoYSAqICgxIC0gZWNjU3F1YXJlZCAvIDQgLSAzICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyA2NCAtIDUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAyNTYpKTtcblxuICBwaGkxUmFkID0gbXUgKyAoMyAqIGUxIC8gMiAtIDI3ICogZTEgKiBlMSAqIGUxIC8gMzIpICogTWF0aC5zaW4oMiAqIG11KSArICgyMSAqIGUxICogZTEgLyAxNiAtIDU1ICogZTEgKiBlMSAqIGUxICogZTEgLyAzMikgKiBNYXRoLnNpbig0ICogbXUpICsgKDE1MSAqIGUxICogZTEgKiBlMSAvIDk2KSAqIE1hdGguc2luKDYgKiBtdSk7XG4gIC8vIGRvdWJsZSBwaGkxID0gUHJvak1hdGgucmFkVG9EZWcocGhpMVJhZCk7XG5cbiAgTjEgPSBhIC8gTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkICogTWF0aC5zaW4ocGhpMVJhZCkgKiBNYXRoLnNpbihwaGkxUmFkKSk7XG4gIFQxID0gTWF0aC50YW4ocGhpMVJhZCkgKiBNYXRoLnRhbihwaGkxUmFkKTtcbiAgQzEgPSBlY2NQcmltZVNxdWFyZWQgKiBNYXRoLmNvcyhwaGkxUmFkKSAqIE1hdGguY29zKHBoaTFSYWQpO1xuICBSMSA9IGEgKiAoMSAtIGVjY1NxdWFyZWQpIC8gTWF0aC5wb3coMSAtIGVjY1NxdWFyZWQgKiBNYXRoLnNpbihwaGkxUmFkKSAqIE1hdGguc2luKHBoaTFSYWQpLCAxLjUpO1xuICBEID0geCAvIChOMSAqIGswKTtcblxuICB2YXIgbGF0ID0gcGhpMVJhZCAtIChOMSAqIE1hdGgudGFuKHBoaTFSYWQpIC8gUjEpICogKEQgKiBEIC8gMiAtICg1ICsgMyAqIFQxICsgMTAgKiBDMSAtIDQgKiBDMSAqIEMxIC0gOSAqIGVjY1ByaW1lU3F1YXJlZCkgKiBEICogRCAqIEQgKiBEIC8gMjQgKyAoNjEgKyA5MCAqIFQxICsgMjk4ICogQzEgKyA0NSAqIFQxICogVDEgLSAyNTIgKiBlY2NQcmltZVNxdWFyZWQgLSAzICogQzEgKiBDMSkgKiBEICogRCAqIEQgKiBEICogRCAqIEQgLyA3MjApO1xuICBsYXQgPSByYWRUb0RlZyhsYXQpO1xuXG4gIHZhciBsb24gPSAoRCAtICgxICsgMiAqIFQxICsgQzEpICogRCAqIEQgKiBEIC8gNiArICg1IC0gMiAqIEMxICsgMjggKiBUMSAtIDMgKiBDMSAqIEMxICsgOCAqIGVjY1ByaW1lU3F1YXJlZCArIDI0ICogVDEgKiBUMSkgKiBEICogRCAqIEQgKiBEICogRCAvIDEyMCkgLyBNYXRoLmNvcyhwaGkxUmFkKTtcbiAgbG9uID0gTG9uZ09yaWdpbiArIHJhZFRvRGVnKGxvbik7XG5cbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHV0bS5hY2N1cmFjeSkge1xuICAgIHZhciB0b3BSaWdodCA9IFVUTXRvTEwoe1xuICAgICAgbm9ydGhpbmc6IHV0bS5ub3J0aGluZyArIHV0bS5hY2N1cmFjeSxcbiAgICAgIGVhc3Rpbmc6IHV0bS5lYXN0aW5nICsgdXRtLmFjY3VyYWN5LFxuICAgICAgem9uZUxldHRlcjogdXRtLnpvbmVMZXR0ZXIsXG4gICAgICB6b25lTnVtYmVyOiB1dG0uem9uZU51bWJlclxuICAgIH0pO1xuICAgIHJlc3VsdCA9IHtcbiAgICAgIHRvcDogdG9wUmlnaHQubGF0LFxuICAgICAgcmlnaHQ6IHRvcFJpZ2h0LmxvbixcbiAgICAgIGJvdHRvbTogbGF0LFxuICAgICAgbGVmdDogbG9uXG4gICAgfTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQgPSB7XG4gICAgICBsYXQ6IGxhdCxcbiAgICAgIGxvbjogbG9uXG4gICAgfTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIE1HUlMgbGV0dGVyIGRlc2lnbmF0b3IgZm9yIHRoZSBnaXZlbiBsYXRpdHVkZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGxhdCBUaGUgbGF0aXR1ZGUgaW4gV0dTODQgdG8gZ2V0IHRoZSBsZXR0ZXIgZGVzaWduYXRvclxuICogICAgIGZvci5cbiAqIEByZXR1cm4ge2NoYXJ9IFRoZSBsZXR0ZXIgZGVzaWduYXRvci5cbiAqL1xuZnVuY3Rpb24gZ2V0TGV0dGVyRGVzaWduYXRvcihsYXQpIHtcbiAgLy9UaGlzIGlzIGhlcmUgYXMgYW4gZXJyb3IgZmxhZyB0byBzaG93IHRoYXQgdGhlIExhdGl0dWRlIGlzXG4gIC8vb3V0c2lkZSBNR1JTIGxpbWl0c1xuICB2YXIgTGV0dGVyRGVzaWduYXRvciA9ICdaJztcblxuICBpZiAoKDg0ID49IGxhdCkgJiYgKGxhdCA+PSA3MikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1gnO1xuICB9XG4gIGVsc2UgaWYgKCg3MiA+IGxhdCkgJiYgKGxhdCA+PSA2NCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1cnO1xuICB9XG4gIGVsc2UgaWYgKCg2NCA+IGxhdCkgJiYgKGxhdCA+PSA1NikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1YnO1xuICB9XG4gIGVsc2UgaWYgKCg1NiA+IGxhdCkgJiYgKGxhdCA+PSA0OCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1UnO1xuICB9XG4gIGVsc2UgaWYgKCg0OCA+IGxhdCkgJiYgKGxhdCA+PSA0MCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1QnO1xuICB9XG4gIGVsc2UgaWYgKCg0MCA+IGxhdCkgJiYgKGxhdCA+PSAzMikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1MnO1xuICB9XG4gIGVsc2UgaWYgKCgzMiA+IGxhdCkgJiYgKGxhdCA+PSAyNCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1InO1xuICB9XG4gIGVsc2UgaWYgKCgyNCA+IGxhdCkgJiYgKGxhdCA+PSAxNikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1EnO1xuICB9XG4gIGVsc2UgaWYgKCgxNiA+IGxhdCkgJiYgKGxhdCA+PSA4KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnUCc7XG4gIH1cbiAgZWxzZSBpZiAoKDggPiBsYXQpICYmIChsYXQgPj0gMCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ04nO1xuICB9XG4gIGVsc2UgaWYgKCgwID4gbGF0KSAmJiAobGF0ID49IC04KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnTSc7XG4gIH1cbiAgZWxzZSBpZiAoKC04ID4gbGF0KSAmJiAobGF0ID49IC0xNikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0wnO1xuICB9XG4gIGVsc2UgaWYgKCgtMTYgPiBsYXQpICYmIChsYXQgPj0gLTI0KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnSyc7XG4gIH1cbiAgZWxzZSBpZiAoKC0yNCA+IGxhdCkgJiYgKGxhdCA+PSAtMzIpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdKJztcbiAgfVxuICBlbHNlIGlmICgoLTMyID4gbGF0KSAmJiAobGF0ID49IC00MCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0gnO1xuICB9XG4gIGVsc2UgaWYgKCgtNDAgPiBsYXQpICYmIChsYXQgPj0gLTQ4KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnRyc7XG4gIH1cbiAgZWxzZSBpZiAoKC00OCA+IGxhdCkgJiYgKGxhdCA+PSAtNTYpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdGJztcbiAgfVxuICBlbHNlIGlmICgoLTU2ID4gbGF0KSAmJiAobGF0ID49IC02NCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0UnO1xuICB9XG4gIGVsc2UgaWYgKCgtNjQgPiBsYXQpICYmIChsYXQgPj0gLTcyKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnRCc7XG4gIH1cbiAgZWxzZSBpZiAoKC03MiA+IGxhdCkgJiYgKGxhdCA+PSAtODApKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdDJztcbiAgfVxuICByZXR1cm4gTGV0dGVyRGVzaWduYXRvcjtcbn1cblxuLyoqXG4gKiBFbmNvZGVzIGEgVVRNIGxvY2F0aW9uIGFzIE1HUlMgc3RyaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gdXRtIEFuIG9iamVjdCBsaXRlcmFsIHdpdGggZWFzdGluZywgbm9ydGhpbmcsXG4gKiAgICAgem9uZUxldHRlciwgem9uZU51bWJlclxuICogQHBhcmFtIHtudW1iZXJ9IGFjY3VyYWN5IEFjY3VyYWN5IGluIGRpZ2l0cyAoMS01KS5cbiAqIEByZXR1cm4ge3N0cmluZ30gTUdSUyBzdHJpbmcgZm9yIHRoZSBnaXZlbiBVVE0gbG9jYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGVuY29kZSh1dG0sIGFjY3VyYWN5KSB7XG4gIC8vIHByZXBlbmQgd2l0aCBsZWFkaW5nIHplcm9lc1xuICB2YXIgc2Vhc3RpbmcgPSBcIjAwMDAwXCIgKyB1dG0uZWFzdGluZyxcbiAgICBzbm9ydGhpbmcgPSBcIjAwMDAwXCIgKyB1dG0ubm9ydGhpbmc7XG5cbiAgcmV0dXJuIHV0bS56b25lTnVtYmVyICsgdXRtLnpvbmVMZXR0ZXIgKyBnZXQxMDBrSUQodXRtLmVhc3RpbmcsIHV0bS5ub3J0aGluZywgdXRtLnpvbmVOdW1iZXIpICsgc2Vhc3Rpbmcuc3Vic3RyKHNlYXN0aW5nLmxlbmd0aCAtIDUsIGFjY3VyYWN5KSArIHNub3J0aGluZy5zdWJzdHIoc25vcnRoaW5nLmxlbmd0aCAtIDUsIGFjY3VyYWN5KTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHR3byBsZXR0ZXIgMTAwayBkZXNpZ25hdG9yIGZvciBhIGdpdmVuIFVUTSBlYXN0aW5nLFxuICogbm9ydGhpbmcgYW5kIHpvbmUgbnVtYmVyIHZhbHVlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZWFzdGluZ1xuICogQHBhcmFtIHtudW1iZXJ9IG5vcnRoaW5nXG4gKiBAcGFyYW0ge251bWJlcn0gem9uZU51bWJlclxuICogQHJldHVybiB0aGUgdHdvIGxldHRlciAxMDBrIGRlc2lnbmF0b3IgZm9yIHRoZSBnaXZlbiBVVE0gbG9jYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGdldDEwMGtJRChlYXN0aW5nLCBub3J0aGluZywgem9uZU51bWJlcikge1xuICB2YXIgc2V0UGFybSA9IGdldDEwMGtTZXRGb3Jab25lKHpvbmVOdW1iZXIpO1xuICB2YXIgc2V0Q29sdW1uID0gTWF0aC5mbG9vcihlYXN0aW5nIC8gMTAwMDAwKTtcbiAgdmFyIHNldFJvdyA9IE1hdGguZmxvb3Iobm9ydGhpbmcgLyAxMDAwMDApICUgMjA7XG4gIHJldHVybiBnZXRMZXR0ZXIxMDBrSUQoc2V0Q29sdW1uLCBzZXRSb3csIHNldFBhcm0pO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgVVRNIHpvbmUgbnVtYmVyLCBmaWd1cmUgb3V0IHRoZSBNR1JTIDEwMEsgc2V0IGl0IGlzIGluLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gaSBBbiBVVE0gem9uZSBudW1iZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSAxMDBrIHNldCB0aGUgVVRNIHpvbmUgaXMgaW4uXG4gKi9cbmZ1bmN0aW9uIGdldDEwMGtTZXRGb3Jab25lKGkpIHtcbiAgdmFyIHNldFBhcm0gPSBpICUgTlVNXzEwMEtfU0VUUztcbiAgaWYgKHNldFBhcm0gPT09IDApIHtcbiAgICBzZXRQYXJtID0gTlVNXzEwMEtfU0VUUztcbiAgfVxuXG4gIHJldHVybiBzZXRQYXJtO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdHdvLWxldHRlciBNR1JTIDEwMGsgZGVzaWduYXRvciBnaXZlbiBpbmZvcm1hdGlvblxuICogdHJhbnNsYXRlZCBmcm9tIHRoZSBVVE0gbm9ydGhpbmcsIGVhc3RpbmcgYW5kIHpvbmUgbnVtYmVyLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gY29sdW1uIHRoZSBjb2x1bW4gaW5kZXggYXMgaXQgcmVsYXRlcyB0byB0aGUgTUdSU1xuICogICAgICAgIDEwMGsgc2V0IHNwcmVhZHNoZWV0LCBjcmVhdGVkIGZyb20gdGhlIFVUTSBlYXN0aW5nLlxuICogICAgICAgIFZhbHVlcyBhcmUgMS04LlxuICogQHBhcmFtIHtudW1iZXJ9IHJvdyB0aGUgcm93IGluZGV4IGFzIGl0IHJlbGF0ZXMgdG8gdGhlIE1HUlMgMTAwayBzZXRcbiAqICAgICAgICBzcHJlYWRzaGVldCwgY3JlYXRlZCBmcm9tIHRoZSBVVE0gbm9ydGhpbmcgdmFsdWUuIFZhbHVlc1xuICogICAgICAgIGFyZSBmcm9tIDAtMTkuXG4gKiBAcGFyYW0ge251bWJlcn0gcGFybSB0aGUgc2V0IGJsb2NrLCBhcyBpdCByZWxhdGVzIHRvIHRoZSBNR1JTIDEwMGsgc2V0XG4gKiAgICAgICAgc3ByZWFkc2hlZXQsIGNyZWF0ZWQgZnJvbSB0aGUgVVRNIHpvbmUuIFZhbHVlcyBhcmUgZnJvbVxuICogICAgICAgIDEtNjAuXG4gKiBAcmV0dXJuIHR3byBsZXR0ZXIgTUdSUyAxMDBrIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIGdldExldHRlcjEwMGtJRChjb2x1bW4sIHJvdywgcGFybSkge1xuICAvLyBjb2xPcmlnaW4gYW5kIHJvd09yaWdpbiBhcmUgdGhlIGxldHRlcnMgYXQgdGhlIG9yaWdpbiBvZiB0aGUgc2V0XG4gIHZhciBpbmRleCA9IHBhcm0gLSAxO1xuICB2YXIgY29sT3JpZ2luID0gU0VUX09SSUdJTl9DT0xVTU5fTEVUVEVSUy5jaGFyQ29kZUF0KGluZGV4KTtcbiAgdmFyIHJvd09yaWdpbiA9IFNFVF9PUklHSU5fUk9XX0xFVFRFUlMuY2hhckNvZGVBdChpbmRleCk7XG5cbiAgLy8gY29sSW50IGFuZCByb3dJbnQgYXJlIHRoZSBsZXR0ZXJzIHRvIGJ1aWxkIHRvIHJldHVyblxuICB2YXIgY29sSW50ID0gY29sT3JpZ2luICsgY29sdW1uIC0gMTtcbiAgdmFyIHJvd0ludCA9IHJvd09yaWdpbiArIHJvdztcbiAgdmFyIHJvbGxvdmVyID0gZmFsc2U7XG5cbiAgaWYgKGNvbEludCA+IFopIHtcbiAgICBjb2xJbnQgPSBjb2xJbnQgLSBaICsgQSAtIDE7XG4gICAgcm9sbG92ZXIgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGNvbEludCA9PT0gSSB8fCAoY29sT3JpZ2luIDwgSSAmJiBjb2xJbnQgPiBJKSB8fCAoKGNvbEludCA+IEkgfHwgY29sT3JpZ2luIDwgSSkgJiYgcm9sbG92ZXIpKSB7XG4gICAgY29sSW50Kys7XG4gIH1cblxuICBpZiAoY29sSW50ID09PSBPIHx8IChjb2xPcmlnaW4gPCBPICYmIGNvbEludCA+IE8pIHx8ICgoY29sSW50ID4gTyB8fCBjb2xPcmlnaW4gPCBPKSAmJiByb2xsb3ZlcikpIHtcbiAgICBjb2xJbnQrKztcblxuICAgIGlmIChjb2xJbnQgPT09IEkpIHtcbiAgICAgIGNvbEludCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjb2xJbnQgPiBaKSB7XG4gICAgY29sSW50ID0gY29sSW50IC0gWiArIEEgLSAxO1xuICB9XG5cbiAgaWYgKHJvd0ludCA+IFYpIHtcbiAgICByb3dJbnQgPSByb3dJbnQgLSBWICsgQSAtIDE7XG4gICAgcm9sbG92ZXIgPSB0cnVlO1xuICB9XG4gIGVsc2Uge1xuICAgIHJvbGxvdmVyID0gZmFsc2U7XG4gIH1cblxuICBpZiAoKChyb3dJbnQgPT09IEkpIHx8ICgocm93T3JpZ2luIDwgSSkgJiYgKHJvd0ludCA+IEkpKSkgfHwgKCgocm93SW50ID4gSSkgfHwgKHJvd09yaWdpbiA8IEkpKSAmJiByb2xsb3ZlcikpIHtcbiAgICByb3dJbnQrKztcbiAgfVxuXG4gIGlmICgoKHJvd0ludCA9PT0gTykgfHwgKChyb3dPcmlnaW4gPCBPKSAmJiAocm93SW50ID4gTykpKSB8fCAoKChyb3dJbnQgPiBPKSB8fCAocm93T3JpZ2luIDwgTykpICYmIHJvbGxvdmVyKSkge1xuICAgIHJvd0ludCsrO1xuXG4gICAgaWYgKHJvd0ludCA9PT0gSSkge1xuICAgICAgcm93SW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKHJvd0ludCA+IFYpIHtcbiAgICByb3dJbnQgPSByb3dJbnQgLSBWICsgQSAtIDE7XG4gIH1cblxuICB2YXIgdHdvTGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2xJbnQpICsgU3RyaW5nLmZyb21DaGFyQ29kZShyb3dJbnQpO1xuICByZXR1cm4gdHdvTGV0dGVyO1xufVxuXG4vKipcbiAqIERlY29kZSB0aGUgVVRNIHBhcmFtZXRlcnMgZnJvbSBhIE1HUlMgc3RyaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gbWdyc1N0cmluZyBhbiBVUFBFUkNBU0UgY29vcmRpbmF0ZSBzdHJpbmcgaXMgZXhwZWN0ZWQuXG4gKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBsaXRlcmFsIHdpdGggZWFzdGluZywgbm9ydGhpbmcsIHpvbmVMZXR0ZXIsXG4gKiAgICAgem9uZU51bWJlciBhbmQgYWNjdXJhY3kgKGluIG1ldGVycykgcHJvcGVydGllcy5cbiAqL1xuZnVuY3Rpb24gZGVjb2RlKG1ncnNTdHJpbmcpIHtcblxuICBpZiAobWdyc1N0cmluZyAmJiBtZ3JzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IChcIk1HUlNQb2ludCBjb3ZlcnRpbmcgZnJvbSBub3RoaW5nXCIpO1xuICB9XG5cbiAgdmFyIGxlbmd0aCA9IG1ncnNTdHJpbmcubGVuZ3RoO1xuXG4gIHZhciBodW5LID0gbnVsbDtcbiAgdmFyIHNiID0gXCJcIjtcbiAgdmFyIHRlc3RDaGFyO1xuICB2YXIgaSA9IDA7XG5cbiAgLy8gZ2V0IFpvbmUgbnVtYmVyXG4gIHdoaWxlICghKC9bQS1aXS8pLnRlc3QodGVzdENoYXIgPSBtZ3JzU3RyaW5nLmNoYXJBdChpKSkpIHtcbiAgICBpZiAoaSA+PSAyKSB7XG4gICAgICB0aHJvdyAoXCJNR1JTUG9pbnQgYmFkIGNvbnZlcnNpb24gZnJvbTogXCIgKyBtZ3JzU3RyaW5nKTtcbiAgICB9XG4gICAgc2IgKz0gdGVzdENoYXI7XG4gICAgaSsrO1xuICB9XG5cbiAgdmFyIHpvbmVOdW1iZXIgPSBwYXJzZUludChzYiwgMTApO1xuXG4gIGlmIChpID09PSAwIHx8IGkgKyAzID4gbGVuZ3RoKSB7XG4gICAgLy8gQSBnb29kIE1HUlMgc3RyaW5nIGhhcyB0byBiZSA0LTUgZGlnaXRzIGxvbmcsXG4gICAgLy8gIyNBQUEvI0FBQSBhdCBsZWFzdC5cbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgYmFkIGNvbnZlcnNpb24gZnJvbTogXCIgKyBtZ3JzU3RyaW5nKTtcbiAgfVxuXG4gIHZhciB6b25lTGV0dGVyID0gbWdyc1N0cmluZy5jaGFyQXQoaSsrKTtcblxuICAvLyBTaG91bGQgd2UgY2hlY2sgdGhlIHpvbmUgbGV0dGVyIGhlcmU/IFdoeSBub3QuXG4gIGlmICh6b25lTGV0dGVyIDw9ICdBJyB8fCB6b25lTGV0dGVyID09PSAnQicgfHwgem9uZUxldHRlciA9PT0gJ1knIHx8IHpvbmVMZXR0ZXIgPj0gJ1onIHx8IHpvbmVMZXR0ZXIgPT09ICdJJyB8fCB6b25lTGV0dGVyID09PSAnTycpIHtcbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgem9uZSBsZXR0ZXIgXCIgKyB6b25lTGV0dGVyICsgXCIgbm90IGhhbmRsZWQ6IFwiICsgbWdyc1N0cmluZyk7XG4gIH1cblxuICBodW5LID0gbWdyc1N0cmluZy5zdWJzdHJpbmcoaSwgaSArPSAyKTtcblxuICB2YXIgc2V0ID0gZ2V0MTAwa1NldEZvclpvbmUoem9uZU51bWJlcik7XG5cbiAgdmFyIGVhc3QxMDBrID0gZ2V0RWFzdGluZ0Zyb21DaGFyKGh1bksuY2hhckF0KDApLCBzZXQpO1xuICB2YXIgbm9ydGgxMDBrID0gZ2V0Tm9ydGhpbmdGcm9tQ2hhcihodW5LLmNoYXJBdCgxKSwgc2V0KTtcblxuICAvLyBXZSBoYXZlIGEgYnVnIHdoZXJlIHRoZSBub3J0aGluZyBtYXkgYmUgMjAwMDAwMCB0b28gbG93LlxuICAvLyBIb3dcbiAgLy8gZG8gd2Uga25vdyB3aGVuIHRvIHJvbGwgb3Zlcj9cblxuICB3aGlsZSAobm9ydGgxMDBrIDwgZ2V0TWluTm9ydGhpbmcoem9uZUxldHRlcikpIHtcbiAgICBub3J0aDEwMGsgKz0gMjAwMDAwMDtcbiAgfVxuXG4gIC8vIGNhbGN1bGF0ZSB0aGUgY2hhciBpbmRleCBmb3IgZWFzdGluZy9ub3J0aGluZyBzZXBhcmF0b3JcbiAgdmFyIHJlbWFpbmRlciA9IGxlbmd0aCAtIGk7XG5cbiAgaWYgKHJlbWFpbmRlciAlIDIgIT09IDApIHtcbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgaGFzIHRvIGhhdmUgYW4gZXZlbiBudW1iZXIgXFxub2YgZGlnaXRzIGFmdGVyIHRoZSB6b25lIGxldHRlciBhbmQgdHdvIDEwMGttIGxldHRlcnMgLSBmcm9udCBcXG5oYWxmIGZvciBlYXN0aW5nIG1ldGVycywgc2Vjb25kIGhhbGYgZm9yIFxcbm5vcnRoaW5nIG1ldGVyc1wiICsgbWdyc1N0cmluZyk7XG4gIH1cblxuICB2YXIgc2VwID0gcmVtYWluZGVyIC8gMjtcblxuICB2YXIgc2VwRWFzdGluZyA9IDAuMDtcbiAgdmFyIHNlcE5vcnRoaW5nID0gMC4wO1xuICB2YXIgYWNjdXJhY3lCb251cywgc2VwRWFzdGluZ1N0cmluZywgc2VwTm9ydGhpbmdTdHJpbmcsIGVhc3RpbmcsIG5vcnRoaW5nO1xuICBpZiAoc2VwID4gMCkge1xuICAgIGFjY3VyYWN5Qm9udXMgPSAxMDAwMDAuMCAvIE1hdGgucG93KDEwLCBzZXApO1xuICAgIHNlcEVhc3RpbmdTdHJpbmcgPSBtZ3JzU3RyaW5nLnN1YnN0cmluZyhpLCBpICsgc2VwKTtcbiAgICBzZXBFYXN0aW5nID0gcGFyc2VGbG9hdChzZXBFYXN0aW5nU3RyaW5nKSAqIGFjY3VyYWN5Qm9udXM7XG4gICAgc2VwTm9ydGhpbmdTdHJpbmcgPSBtZ3JzU3RyaW5nLnN1YnN0cmluZyhpICsgc2VwKTtcbiAgICBzZXBOb3J0aGluZyA9IHBhcnNlRmxvYXQoc2VwTm9ydGhpbmdTdHJpbmcpICogYWNjdXJhY3lCb251cztcbiAgfVxuXG4gIGVhc3RpbmcgPSBzZXBFYXN0aW5nICsgZWFzdDEwMGs7XG4gIG5vcnRoaW5nID0gc2VwTm9ydGhpbmcgKyBub3J0aDEwMGs7XG5cbiAgcmV0dXJuIHtcbiAgICBlYXN0aW5nOiBlYXN0aW5nLFxuICAgIG5vcnRoaW5nOiBub3J0aGluZyxcbiAgICB6b25lTGV0dGVyOiB6b25lTGV0dGVyLFxuICAgIHpvbmVOdW1iZXI6IHpvbmVOdW1iZXIsXG4gICAgYWNjdXJhY3k6IGFjY3VyYWN5Qm9udXNcbiAgfTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZmlyc3QgbGV0dGVyIGZyb20gYSB0d28tbGV0dGVyIE1HUlMgMTAwayB6b25lLCBhbmQgZ2l2ZW4gdGhlXG4gKiBNR1JTIHRhYmxlIHNldCBmb3IgdGhlIHpvbmUgbnVtYmVyLCBmaWd1cmUgb3V0IHRoZSBlYXN0aW5nIHZhbHVlIHRoYXRcbiAqIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgb3RoZXIsIHNlY29uZGFyeSBlYXN0aW5nIHZhbHVlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2NoYXJ9IGUgVGhlIGZpcnN0IGxldHRlciBmcm9tIGEgdHdvLWxldHRlciBNR1JTIDEwMMK0ayB6b25lLlxuICogQHBhcmFtIHtudW1iZXJ9IHNldCBUaGUgTUdSUyB0YWJsZSBzZXQgZm9yIHRoZSB6b25lIG51bWJlci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGVhc3RpbmcgdmFsdWUgZm9yIHRoZSBnaXZlbiBsZXR0ZXIgYW5kIHNldC5cbiAqL1xuZnVuY3Rpb24gZ2V0RWFzdGluZ0Zyb21DaGFyKGUsIHNldCkge1xuICAvLyBjb2xPcmlnaW4gaXMgdGhlIGxldHRlciBhdCB0aGUgb3JpZ2luIG9mIHRoZSBzZXQgZm9yIHRoZVxuICAvLyBjb2x1bW5cbiAgdmFyIGN1ckNvbCA9IFNFVF9PUklHSU5fQ09MVU1OX0xFVFRFUlMuY2hhckNvZGVBdChzZXQgLSAxKTtcbiAgdmFyIGVhc3RpbmdWYWx1ZSA9IDEwMDAwMC4wO1xuICB2YXIgcmV3aW5kTWFya2VyID0gZmFsc2U7XG5cbiAgd2hpbGUgKGN1ckNvbCAhPT0gZS5jaGFyQ29kZUF0KDApKSB7XG4gICAgY3VyQ29sKys7XG4gICAgaWYgKGN1ckNvbCA9PT0gSSkge1xuICAgICAgY3VyQ29sKys7XG4gICAgfVxuICAgIGlmIChjdXJDb2wgPT09IE8pIHtcbiAgICAgIGN1ckNvbCsrO1xuICAgIH1cbiAgICBpZiAoY3VyQ29sID4gWikge1xuICAgICAgaWYgKHJld2luZE1hcmtlcikge1xuICAgICAgICB0aHJvdyAoXCJCYWQgY2hhcmFjdGVyOiBcIiArIGUpO1xuICAgICAgfVxuICAgICAgY3VyQ29sID0gQTtcbiAgICAgIHJld2luZE1hcmtlciA9IHRydWU7XG4gICAgfVxuICAgIGVhc3RpbmdWYWx1ZSArPSAxMDAwMDAuMDtcbiAgfVxuXG4gIHJldHVybiBlYXN0aW5nVmFsdWU7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIHNlY29uZCBsZXR0ZXIgZnJvbSBhIHR3by1sZXR0ZXIgTUdSUyAxMDBrIHpvbmUsIGFuZCBnaXZlbiB0aGVcbiAqIE1HUlMgdGFibGUgc2V0IGZvciB0aGUgem9uZSBudW1iZXIsIGZpZ3VyZSBvdXQgdGhlIG5vcnRoaW5nIHZhbHVlIHRoYXRcbiAqIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgb3RoZXIsIHNlY29uZGFyeSBub3J0aGluZyB2YWx1ZS4gWW91IGhhdmUgdG9cbiAqIHJlbWVtYmVyIHRoYXQgTm9ydGhpbmdzIGFyZSBkZXRlcm1pbmVkIGZyb20gdGhlIGVxdWF0b3IsIGFuZCB0aGUgdmVydGljYWxcbiAqIGN5Y2xlIG9mIGxldHRlcnMgbWVhbiBhIDIwMDAwMDAgYWRkaXRpb25hbCBub3J0aGluZyBtZXRlcnMuIFRoaXMgaGFwcGVuc1xuICogYXBwcm94LiBldmVyeSAxOCBkZWdyZWVzIG9mIGxhdGl0dWRlLiBUaGlzIG1ldGhvZCBkb2VzICpOT1QqIGNvdW50IGFueVxuICogYWRkaXRpb25hbCBub3J0aGluZ3MuIFlvdSBoYXZlIHRvIGZpZ3VyZSBvdXQgaG93IG1hbnkgMjAwMDAwMCBtZXRlcnMgbmVlZFxuICogdG8gYmUgYWRkZWQgZm9yIHRoZSB6b25lIGxldHRlciBvZiB0aGUgTUdSUyBjb29yZGluYXRlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2NoYXJ9IG4gU2Vjb25kIGxldHRlciBvZiB0aGUgTUdSUyAxMDBrIHpvbmVcbiAqIEBwYXJhbSB7bnVtYmVyfSBzZXQgVGhlIE1HUlMgdGFibGUgc2V0IG51bWJlciwgd2hpY2ggaXMgZGVwZW5kZW50IG9uIHRoZVxuICogICAgIFVUTSB6b25lIG51bWJlci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG5vcnRoaW5nIHZhbHVlIGZvciB0aGUgZ2l2ZW4gbGV0dGVyIGFuZCBzZXQuXG4gKi9cbmZ1bmN0aW9uIGdldE5vcnRoaW5nRnJvbUNoYXIobiwgc2V0KSB7XG5cbiAgaWYgKG4gPiAnVicpIHtcbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgZ2l2ZW4gaW52YWxpZCBOb3J0aGluZyBcIiArIG4pO1xuICB9XG5cbiAgLy8gcm93T3JpZ2luIGlzIHRoZSBsZXR0ZXIgYXQgdGhlIG9yaWdpbiBvZiB0aGUgc2V0IGZvciB0aGVcbiAgLy8gY29sdW1uXG4gIHZhciBjdXJSb3cgPSBTRVRfT1JJR0lOX1JPV19MRVRURVJTLmNoYXJDb2RlQXQoc2V0IC0gMSk7XG4gIHZhciBub3J0aGluZ1ZhbHVlID0gMC4wO1xuICB2YXIgcmV3aW5kTWFya2VyID0gZmFsc2U7XG5cbiAgd2hpbGUgKGN1clJvdyAhPT0gbi5jaGFyQ29kZUF0KDApKSB7XG4gICAgY3VyUm93Kys7XG4gICAgaWYgKGN1clJvdyA9PT0gSSkge1xuICAgICAgY3VyUm93Kys7XG4gICAgfVxuICAgIGlmIChjdXJSb3cgPT09IE8pIHtcbiAgICAgIGN1clJvdysrO1xuICAgIH1cbiAgICAvLyBmaXhpbmcgYSBidWcgbWFraW5nIHdob2xlIGFwcGxpY2F0aW9uIGhhbmcgaW4gdGhpcyBsb29wXG4gICAgLy8gd2hlbiAnbicgaXMgYSB3cm9uZyBjaGFyYWN0ZXJcbiAgICBpZiAoY3VyUm93ID4gVikge1xuICAgICAgaWYgKHJld2luZE1hcmtlcikgeyAvLyBtYWtpbmcgc3VyZSB0aGF0IHRoaXMgbG9vcCBlbmRzXG4gICAgICAgIHRocm93IChcIkJhZCBjaGFyYWN0ZXI6IFwiICsgbik7XG4gICAgICB9XG4gICAgICBjdXJSb3cgPSBBO1xuICAgICAgcmV3aW5kTWFya2VyID0gdHJ1ZTtcbiAgICB9XG4gICAgbm9ydGhpbmdWYWx1ZSArPSAxMDAwMDAuMDtcbiAgfVxuXG4gIHJldHVybiBub3J0aGluZ1ZhbHVlO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBnZXRNaW5Ob3J0aGluZyByZXR1cm5zIHRoZSBtaW5pbXVtIG5vcnRoaW5nIHZhbHVlIG9mIGEgTUdSU1xuICogem9uZS5cbiAqXG4gKiBQb3J0ZWQgZnJvbSBHZW90cmFucycgYyBMYXR0aXR1ZGVfQmFuZF9WYWx1ZSBzdHJ1Y3R1cmUgdGFibGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Y2hhcn0gem9uZUxldHRlciBUaGUgTUdSUyB6b25lIHRvIGdldCB0aGUgbWluIG5vcnRoaW5nIGZvci5cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0TWluTm9ydGhpbmcoem9uZUxldHRlcikge1xuICB2YXIgbm9ydGhpbmc7XG4gIHN3aXRjaCAoem9uZUxldHRlcikge1xuICBjYXNlICdDJzpcbiAgICBub3J0aGluZyA9IDExMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnRCc6XG4gICAgbm9ydGhpbmcgPSAyMDAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0UnOlxuICAgIG5vcnRoaW5nID0gMjgwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdGJzpcbiAgICBub3J0aGluZyA9IDM3MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnRyc6XG4gICAgbm9ydGhpbmcgPSA0NjAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0gnOlxuICAgIG5vcnRoaW5nID0gNTUwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdKJzpcbiAgICBub3J0aGluZyA9IDY0MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnSyc6XG4gICAgbm9ydGhpbmcgPSA3MzAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0wnOlxuICAgIG5vcnRoaW5nID0gODIwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdNJzpcbiAgICBub3J0aGluZyA9IDkxMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnTic6XG4gICAgbm9ydGhpbmcgPSAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1AnOlxuICAgIG5vcnRoaW5nID0gODAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1EnOlxuICAgIG5vcnRoaW5nID0gMTcwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdSJzpcbiAgICBub3J0aGluZyA9IDI2MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnUyc6XG4gICAgbm9ydGhpbmcgPSAzNTAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1QnOlxuICAgIG5vcnRoaW5nID0gNDQwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdVJzpcbiAgICBub3J0aGluZyA9IDUzMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnVic6XG4gICAgbm9ydGhpbmcgPSA2MjAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1cnOlxuICAgIG5vcnRoaW5nID0gNzAwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdYJzpcbiAgICBub3J0aGluZyA9IDc5MDAwMDAuMDtcbiAgICBicmVhaztcbiAgZGVmYXVsdDpcbiAgICBub3J0aGluZyA9IC0xLjA7XG4gIH1cbiAgaWYgKG5vcnRoaW5nID49IDAuMCkge1xuICAgIHJldHVybiBub3J0aGluZztcbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyAoXCJJbnZhbGlkIHpvbmUgbGV0dGVyOiBcIiArIHpvbmVMZXR0ZXIpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IHRvUG9pbnQsIGZvcndhcmQgfSBmcm9tICdtZ3JzJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB2My4wLjAgLSB1c2UgcHJvajQudG9Qb2ludCBpbnN0ZWFkXG4gKiBAcGFyYW0ge251bWJlciB8IGltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlcyB8IHN0cmluZ30geFxuICogQHBhcmFtIHtudW1iZXJ9IFt5XVxuICogQHBhcmFtIHtudW1iZXJ9IFt6XVxuICovXG5mdW5jdGlvbiBQb2ludCh4LCB5LCB6KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQb2ludCkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHgsIHksIHopO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgdGhpcy54ID0geFswXTtcbiAgICB0aGlzLnkgPSB4WzFdO1xuICAgIHRoaXMueiA9IHhbMl0gfHwgMC4wO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuICAgIHRoaXMueCA9IHgueDtcbiAgICB0aGlzLnkgPSB4Lnk7XG4gICAgdGhpcy56ID0geC56IHx8IDAuMDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIGNvb3JkcyA9IHguc3BsaXQoJywnKTtcbiAgICB0aGlzLnggPSBwYXJzZUZsb2F0KGNvb3Jkc1swXSk7XG4gICAgdGhpcy55ID0gcGFyc2VGbG9hdChjb29yZHNbMV0pO1xuICAgIHRoaXMueiA9IHBhcnNlRmxvYXQoY29vcmRzWzJdKSB8fCAwLjA7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMueiA9IHogfHwgMC4wO1xuICB9XG4gIGNvbnNvbGUud2FybigncHJvajQuUG9pbnQgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gMywgdXNlIHByb2o0LnRvUG9pbnQnKTtcbn1cblxuUG9pbnQuZnJvbU1HUlMgPSBmdW5jdGlvbiAobWdyc1N0cikge1xuICByZXR1cm4gbmV3IFBvaW50KHRvUG9pbnQobWdyc1N0cikpO1xufTtcblBvaW50LnByb3RvdHlwZS50b01HUlMgPSBmdW5jdGlvbiAoYWNjdXJhY3kpIHtcbiAgcmV0dXJuIGZvcndhcmQoW3RoaXMueCwgdGhpcy55XSwgYWNjdXJhY3kpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFBvaW50O1xuIiwiaW1wb3J0IHBhcnNlQ29kZSBmcm9tICcuL3BhcnNlQ29kZSc7XG5pbXBvcnQgZXh0ZW5kIGZyb20gJy4vZXh0ZW5kJztcbmltcG9ydCBwcm9qZWN0aW9ucyBmcm9tICcuL3Byb2plY3Rpb25zJztcbmltcG9ydCB7IHNwaGVyZSBhcyBkY19zcGhlcmUsIGVjY2VudHJpY2l0eSBhcyBkY19lY2NlbnRyaWNpdHkgfSBmcm9tICcuL2Rlcml2ZUNvbnN0YW50cyc7XG5pbXBvcnQgRGF0dW0gZnJvbSAnLi9jb25zdGFudHMvRGF0dW0nO1xuaW1wb3J0IGRhdHVtIGZyb20gJy4vZGF0dW0nO1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnO1xuaW1wb3J0IHsgZ2V0TmFkZ3JpZHMgfSBmcm9tICcuL25hZGdyaWQnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdHVtRGVmaW5pdGlvblxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRhdHVtX3R5cGUgLSBUaGUgdHlwZSBvZiBkYXR1bS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhIC0gU2VtaS1tYWpvciBheGlzIG9mIHRoZSBlbGxpcHNvaWQuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYiAtIFNlbWktbWlub3IgYXhpcyBvZiB0aGUgZWxsaXBzb2lkLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzIC0gRWNjZW50cmljaXR5IHNxdWFyZWQgb2YgdGhlIGVsbGlwc29pZC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlcDIgLSBTZWNvbmQgZWNjZW50cmljaXR5IHNxdWFyZWQgb2YgdGhlIGVsbGlwc29pZC5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nIHwgaW1wb3J0KCcuL2NvcmUnKS5QUk9KSlNPTkRlZmluaXRpb24gfCBpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSBzcnNDb2RlXG4gKiBAcGFyYW0geyhlcnJvck1lc3NhZ2U/OiBzdHJpbmcsIGluc3RhbmNlPzogUHJvamVjdGlvbikgPT4gdm9pZH0gW2NhbGxiYWNrXVxuICovXG5mdW5jdGlvbiBQcm9qZWN0aW9uKHNyc0NvZGUsIGNhbGxiYWNrKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9qZWN0aW9uKSkge1xuICAgIHJldHVybiBuZXcgUHJvamVjdGlvbihzcnNDb2RlKTtcbiAgfVxuICAvKiogQHR5cGUgezxUIGV4dGVuZHMgaW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzPihjb29yZGluYXRlczogVCwgZW5mb3JjZUF4aXM/OiBib29sZWFuKSA9PiBUfSAqL1xuICB0aGlzLmZvcndhcmQgPSBudWxsO1xuICAvKiogQHR5cGUgezxUIGV4dGVuZHMgaW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzPihjb29yZGluYXRlczogVCwgZW5mb3JjZUF4aXM/OiBib29sZWFuKSA9PiBUfSAqL1xuICB0aGlzLmludmVyc2UgPSBudWxsO1xuICAvKiogQHR5cGUge2Z1bmN0aW9uKCk6IHZvaWR9ICovXG4gIHRoaXMuaW5pdCA9IG51bGw7XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICB0aGlzLm5hbWU7XG4gIC8qKiBAdHlwZSB7QXJyYXk8c3RyaW5nPn0gKi9cbiAgdGhpcy5uYW1lcyA9IG51bGw7XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICB0aGlzLnRpdGxlO1xuICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9O1xuICB2YXIganNvbiA9IHBhcnNlQ29kZShzcnNDb2RlKTtcbiAgaWYgKHR5cGVvZiBqc29uICE9PSAnb2JqZWN0Jykge1xuICAgIGNhbGxiYWNrKCdDb3VsZCBub3QgcGFyc2UgdG8gdmFsaWQganNvbjogJyArIHNyc0NvZGUpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgb3VyUHJvaiA9IFByb2plY3Rpb24ucHJvamVjdGlvbnMuZ2V0KGpzb24ucHJvak5hbWUpO1xuICBpZiAoIW91clByb2opIHtcbiAgICBjYWxsYmFjaygnQ291bGQgbm90IGdldCBwcm9qZWN0aW9uIG5hbWUgZnJvbTogJyArIHNyc0NvZGUpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoanNvbi5kYXR1bUNvZGUgJiYganNvbi5kYXR1bUNvZGUgIT09ICdub25lJykge1xuICAgIHZhciBkYXR1bURlZiA9IG1hdGNoKERhdHVtLCBqc29uLmRhdHVtQ29kZSk7XG4gICAgaWYgKGRhdHVtRGVmKSB7XG4gICAgICBqc29uLmRhdHVtX3BhcmFtcyA9IGpzb24uZGF0dW1fcGFyYW1zIHx8IChkYXR1bURlZi50b3dnczg0ID8gZGF0dW1EZWYudG93Z3M4NC5zcGxpdCgnLCcpIDogbnVsbCk7XG4gICAgICBqc29uLmVsbHBzID0gZGF0dW1EZWYuZWxsaXBzZTtcbiAgICAgIGpzb24uZGF0dW1OYW1lID0gZGF0dW1EZWYuZGF0dW1OYW1lID8gZGF0dW1EZWYuZGF0dW1OYW1lIDoganNvbi5kYXR1bUNvZGU7XG4gICAgfVxuICB9XG4gIGpzb24uazAgPSBqc29uLmswIHx8IDEuMDtcbiAganNvbi5heGlzID0ganNvbi5heGlzIHx8ICdlbnUnO1xuICBqc29uLmVsbHBzID0ganNvbi5lbGxwcyB8fCAnd2dzODQnO1xuICBqc29uLmxhdDEgPSBqc29uLmxhdDEgfHwganNvbi5sYXQwOyAvLyBMYW1iZXJ0X0NvbmZvcm1hbF9Db25pY18xU1AsIGZvciBleGFtcGxlLCBuZWVkcyB0aGlzXG5cbiAgdmFyIHNwaGVyZV8gPSBkY19zcGhlcmUoanNvbi5hLCBqc29uLmIsIGpzb24ucmYsIGpzb24uZWxscHMsIGpzb24uc3BoZXJlKTtcbiAgdmFyIGVjYyA9IGRjX2VjY2VudHJpY2l0eShzcGhlcmVfLmEsIHNwaGVyZV8uYiwgc3BoZXJlXy5yZiwganNvbi5SX0EpO1xuICB2YXIgbmFkZ3JpZHMgPSBnZXROYWRncmlkcyhqc29uLm5hZGdyaWRzKTtcbiAgLyoqIEB0eXBlIHtEYXR1bURlZmluaXRpb259ICovXG4gIHZhciBkYXR1bU9iaiA9IGpzb24uZGF0dW0gfHwgZGF0dW0oanNvbi5kYXR1bUNvZGUsIGpzb24uZGF0dW1fcGFyYW1zLCBzcGhlcmVfLmEsIHNwaGVyZV8uYiwgZWNjLmVzLCBlY2MuZXAyLFxuICAgIG5hZGdyaWRzKTtcblxuICBleHRlbmQodGhpcywganNvbik7IC8vIHRyYW5zZmVyIGV2ZXJ5dGhpbmcgb3ZlciBmcm9tIHRoZSBwcm9qZWN0aW9uIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IHdlJ2xsIG5lZWRcbiAgZXh0ZW5kKHRoaXMsIG91clByb2opOyAvLyB0cmFuc2ZlciBhbGwgdGhlIG1ldGhvZHMgZnJvbSB0aGUgcHJvamVjdGlvblxuXG4gIC8vIGNvcHkgdGhlIDQgdGhpbmdzIG92ZXIgd2UgY2FsY3VsYXRlZCBpbiBkZXJpdmVDb25zdGFudHMuc3BoZXJlXG4gIHRoaXMuYSA9IHNwaGVyZV8uYTtcbiAgdGhpcy5iID0gc3BoZXJlXy5iO1xuICB0aGlzLnJmID0gc3BoZXJlXy5yZjtcbiAgdGhpcy5zcGhlcmUgPSBzcGhlcmVfLnNwaGVyZTtcblxuICAvLyBjb3B5IHRoZSAzIHRoaW5ncyB3ZSBjYWxjdWxhdGVkIGluIGRlcml2ZUNvbnN0YW50cy5lY2NlbnRyaWNpdHlcbiAgdGhpcy5lcyA9IGVjYy5lcztcbiAgdGhpcy5lID0gZWNjLmU7XG4gIHRoaXMuZXAyID0gZWNjLmVwMjtcblxuICAvLyBhZGQgaW4gdGhlIGRhdHVtIG9iamVjdFxuICB0aGlzLmRhdHVtID0gZGF0dW1PYmo7XG5cbiAgLy8gaW5pdCB0aGUgcHJvamVjdGlvblxuICBpZiAoJ2luaXQnIGluIHRoaXMgJiYgdHlwZW9mIHRoaXMuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgLy8gbGVnZWN5IGNhbGxiYWNrIGZyb20gYmFjayBpbiB0aGUgZGF5IHdoZW4gaXQgd2VudCB0byBzcGF0aWFscmVmZXJlbmNlLm9yZ1xuICBjYWxsYmFjayhudWxsLCB0aGlzKTtcbn1cblByb2plY3Rpb24ucHJvamVjdGlvbnMgPSBwcm9qZWN0aW9ucztcblByb2plY3Rpb24ucHJvamVjdGlvbnMuc3RhcnQoKTtcbmV4cG9ydCBkZWZhdWx0IFByb2plY3Rpb247XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoY3JzLCBkZW5vcm0sIHBvaW50KSB7XG4gIHZhciB4aW4gPSBwb2ludC54LFxuICAgIHlpbiA9IHBvaW50LnksXG4gICAgemluID0gcG9pbnQueiB8fCAwLjA7XG4gIHZhciB2LCB0LCBpO1xuICAvKiogQHR5cGUge2ltcG9ydChcIi4vY29yZVwiKS5JbnRlcmZhY2VDb29yZGluYXRlc30gKi9cbiAgdmFyIG91dCA9IHt9O1xuICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgaWYgKGRlbm9ybSAmJiBpID09PSAyICYmIHBvaW50LnogPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChpID09PSAwKSB7XG4gICAgICB2ID0geGluO1xuICAgICAgaWYgKCdldycuaW5kZXhPZihjcnMuYXhpc1tpXSkgIT09IC0xKSB7XG4gICAgICAgIHQgPSAneCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ID0gJ3knO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaSA9PT0gMSkge1xuICAgICAgdiA9IHlpbjtcbiAgICAgIGlmICgnbnMnLmluZGV4T2YoY3JzLmF4aXNbaV0pICE9PSAtMSkge1xuICAgICAgICB0ID0gJ3knO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdCA9ICd4JztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdiA9IHppbjtcbiAgICAgIHQgPSAneic7XG4gICAgfVxuICAgIHN3aXRjaCAoY3JzLmF4aXNbaV0pIHtcbiAgICAgIGNhc2UgJ2UnOlxuICAgICAgICBvdXRbdF0gPSB2O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBvdXRbdF0gPSAtdjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICduJzpcbiAgICAgICAgb3V0W3RdID0gdjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzJzpcbiAgICAgICAgb3V0W3RdID0gLXY7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndSc6XG4gICAgICAgIGlmIChwb2ludFt0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0LnogPSB2O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZCc6XG4gICAgICAgIGlmIChwb2ludFt0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0LnogPSAtdjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkVSUk9SOiB1bmtub3cgYXhpcyAoXCIrY3JzLmF4aXNbaV0rXCIpIC0gY2hlY2sgZGVmaW5pdGlvbiBvZiBcIitjcnMucHJvak5hbWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwb2ludCkge1xuICBjaGVja0Nvb3JkKHBvaW50LngpO1xuICBjaGVja0Nvb3JkKHBvaW50LnkpO1xufVxuZnVuY3Rpb24gY2hlY2tDb29yZChudW0pIHtcbiAgaWYgKHR5cGVvZiBOdW1iZXIuaXNGaW5pdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG51bSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29vcmRpbmF0ZXMgbXVzdCBiZSBmaW5pdGUgbnVtYmVycycpO1xuICB9XG4gIGlmICh0eXBlb2YgbnVtICE9PSAnbnVtYmVyJyB8fCBudW0gIT09IG51bSB8fCAhaXNGaW5pdGUobnVtKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nvb3JkaW5hdGVzIG11c3QgYmUgZmluaXRlIG51bWJlcnMnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IHNpZ24gZnJvbSAnLi9zaWduJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuIChNYXRoLmFicyh4KSA8IEhBTEZfUEkpID8geCA6ICh4IC0gKHNpZ24oeCkgKiBNYXRoLlBJKSk7XG59XG4iLCJpbXBvcnQgeyBUV09fUEksIFNQSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IHNpZ24gZnJvbSAnLi9zaWduJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgsIHNraXBBZGp1c3QpIHtcbiAgaWYgKHNraXBBZGp1c3QpIHtcbiAgICByZXR1cm4geDtcbiAgfVxuICByZXR1cm4gKE1hdGguYWJzKHgpIDw9IFNQSSkgPyB4IDogKHggLSAoc2lnbih4KSAqIFRXT19QSSkpO1xufVxuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi9hZGp1c3RfbG9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHpvbmUsIGxvbikge1xuICBpZiAoem9uZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgem9uZSA9IE1hdGguZmxvb3IoKGFkanVzdF9sb24obG9uKSArIE1hdGguUEkpICogMzAgLyBNYXRoLlBJKSArIDE7XG5cbiAgICBpZiAoem9uZSA8IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSBpZiAoem9uZSA+IDYwKSB7XG4gICAgICByZXR1cm4gNjA7XG4gICAgfVxuICB9XG4gIHJldHVybiB6b25lO1xufVxuIiwiaW1wb3J0IGh5cG90IGZyb20gJy4vaHlwb3QnO1xuaW1wb3J0IGxvZzFweSBmcm9tICcuL2xvZzFweSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHZhciB5ID0gTWF0aC5hYnMoeCk7XG4gIHkgPSBsb2cxcHkoeSAqICgxICsgeSAvIChoeXBvdCgxLCB5KSArIDEpKSk7XG5cbiAgcmV0dXJuIHggPCAwID8gLXkgOiB5O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgaWYgKE1hdGguYWJzKHgpID4gMSkge1xuICAgIHggPSAoeCA+IDEpID8gMSA6IC0xO1xuICB9XG4gIHJldHVybiBNYXRoLmFzaW4oeCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHAsIGFyZ19yKSB7XG4gIHZhciByID0gMiAqIE1hdGguY29zKGFyZ19yKTtcbiAgdmFyIGkgPSBwcC5sZW5ndGggLSAxO1xuICB2YXIgaHIxID0gcHBbaV07XG4gIHZhciBocjIgPSAwO1xuICB2YXIgaHI7XG5cbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgaHIgPSAtaHIyICsgciAqIGhyMSArIHBwW2ldO1xuICAgIGhyMiA9IGhyMTtcbiAgICBocjEgPSBocjtcbiAgfVxuXG4gIHJldHVybiBNYXRoLnNpbihhcmdfcikgKiBocjtcbn1cbiIsImltcG9ydCBzaW5oIGZyb20gJy4vc2luaCc7XG5pbXBvcnQgY29zaCBmcm9tICcuL2Nvc2gnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHAsIGFyZ19yLCBhcmdfaSkge1xuICB2YXIgc2luX2FyZ19yID0gTWF0aC5zaW4oYXJnX3IpO1xuICB2YXIgY29zX2FyZ19yID0gTWF0aC5jb3MoYXJnX3IpO1xuICB2YXIgc2luaF9hcmdfaSA9IHNpbmgoYXJnX2kpO1xuICB2YXIgY29zaF9hcmdfaSA9IGNvc2goYXJnX2kpO1xuICB2YXIgciA9IDIgKiBjb3NfYXJnX3IgKiBjb3NoX2FyZ19pO1xuICB2YXIgaSA9IC0yICogc2luX2FyZ19yICogc2luaF9hcmdfaTtcbiAgdmFyIGogPSBwcC5sZW5ndGggLSAxO1xuICB2YXIgaHIgPSBwcFtqXTtcbiAgdmFyIGhpMSA9IDA7XG4gIHZhciBocjEgPSAwO1xuICB2YXIgaGkgPSAwO1xuICB2YXIgaHIyO1xuICB2YXIgaGkyO1xuXG4gIHdoaWxlICgtLWogPj0gMCkge1xuICAgIGhyMiA9IGhyMTtcbiAgICBoaTIgPSBoaTE7XG4gICAgaHIxID0gaHI7XG4gICAgaGkxID0gaGk7XG4gICAgaHIgPSAtaHIyICsgciAqIGhyMSAtIGkgKiBoaTEgKyBwcFtqXTtcbiAgICBoaSA9IC1oaTIgKyBpICogaHIxICsgciAqIGhpMTtcbiAgfVxuXG4gIHIgPSBzaW5fYXJnX3IgKiBjb3NoX2FyZ19pO1xuICBpID0gY29zX2FyZ19yICogc2luaF9hcmdfaTtcblxuICByZXR1cm4gW3IgKiBociAtIGkgKiBoaSwgciAqIGhpICsgaSAqIGhyXTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHZhciByID0gTWF0aC5leHAoeCk7XG4gIHIgPSAociArIDEgLyByKSAvIDI7XG4gIHJldHVybiByO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuICgxIC0gMC4yNSAqIHggKiAoMSArIHggLyAxNiAqICgzICsgMS4yNSAqIHgpKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gKDAuMzc1ICogeCAqICgxICsgMC4yNSAqIHggKiAoMSArIDAuNDY4NzUgKiB4KSkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuICgwLjA1ODU5Mzc1ICogeCAqIHggKiAoMSArIDAuNzUgKiB4KSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gKHggKiB4ICogeCAqICgzNSAvIDMwNzIpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhLCBlLCBzaW5waGkpIHtcbiAgdmFyIHRlbXAgPSBlICogc2lucGhpO1xuICByZXR1cm4gYSAvIE1hdGguc3FydCgxIC0gdGVtcCAqIHRlbXApO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHBwLCBCKSB7XG4gIHZhciBjb3NfMkIgPSAyICogTWF0aC5jb3MoMiAqIEIpO1xuICB2YXIgaSA9IHBwLmxlbmd0aCAtIDE7XG4gIHZhciBoMSA9IHBwW2ldO1xuICB2YXIgaDIgPSAwO1xuICB2YXIgaDtcblxuICB3aGlsZSAoLS1pID49IDApIHtcbiAgICBoID0gLWgyICsgY29zXzJCICogaDEgKyBwcFtpXTtcbiAgICBoMiA9IGgxO1xuICAgIGgxID0gaDtcbiAgfVxuXG4gIHJldHVybiAoQiArIGggKiBNYXRoLnNpbigyICogQikpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgsIHkpIHtcbiAgeCA9IE1hdGguYWJzKHgpO1xuICB5ID0gTWF0aC5hYnMoeSk7XG4gIHZhciBhID0gTWF0aC5tYXgoeCwgeSk7XG4gIHZhciBiID0gTWF0aC5taW4oeCwgeSkgLyAoYSA/IGEgOiAxKTtcblxuICByZXR1cm4gYSAqIE1hdGguc3FydCgxICsgTWF0aC5wb3coYiwgMikpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG1sLCBlMCwgZTEsIGUyLCBlMykge1xuICB2YXIgcGhpO1xuICB2YXIgZHBoaTtcblxuICBwaGkgPSBtbCAvIGUwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDE1OyBpKyspIHtcbiAgICBkcGhpID0gKG1sIC0gKGUwICogcGhpIC0gZTEgKiBNYXRoLnNpbigyICogcGhpKSArIGUyICogTWF0aC5zaW4oNCAqIHBoaSkgLSBlMyAqIE1hdGguc2luKDYgKiBwaGkpKSkgLyAoZTAgLSAyICogZTEgKiBNYXRoLmNvcygyICogcGhpKSArIDQgKiBlMiAqIE1hdGguY29zKDQgKiBwaGkpIC0gNiAqIGUzICogTWF0aC5jb3MoNiAqIHBoaSkpO1xuICAgIHBoaSArPSBkcGhpO1xuICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSAwLjAwMDAwMDAwMDEpIHtcbiAgICAgIHJldHVybiBwaGk7XG4gICAgfVxuICB9XG5cbiAgLy8gLi5yZXBvcnRFcnJvcihcIklNTEZOLUNPTlY6TGF0aXR1ZGUgZmFpbGVkIHRvIGNvbnZlcmdlIGFmdGVyIDE1IGl0ZXJhdGlvbnNcIik7XG4gIHJldHVybiBOYU47XG59XG4iLCJpbXBvcnQgeyBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlY2NlbnQsIHEpIHtcbiAgdmFyIHRlbXAgPSAxIC0gKDEgLSBlY2NlbnQgKiBlY2NlbnQpIC8gKDIgKiBlY2NlbnQpICogTWF0aC5sb2coKDEgLSBlY2NlbnQpIC8gKDEgKyBlY2NlbnQpKTtcbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKHEpIC0gdGVtcCkgPCAxLjBFLTYpIHtcbiAgICBpZiAocSA8IDApIHtcbiAgICAgIHJldHVybiAoLTEgKiBIQUxGX1BJKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIEhBTEZfUEk7XG4gICAgfVxuICB9XG4gIC8vIHZhciBwaGkgPSAwLjUqIHEvKDEtZWNjZW50KmVjY2VudCk7XG4gIHZhciBwaGkgPSBNYXRoLmFzaW4oMC41ICogcSk7XG4gIHZhciBkcGhpO1xuICB2YXIgc2luX3BoaTtcbiAgdmFyIGNvc19waGk7XG4gIHZhciBjb247XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzA7IGkrKykge1xuICAgIHNpbl9waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIGNvc19waGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIGNvbiA9IGVjY2VudCAqIHNpbl9waGk7XG4gICAgZHBoaSA9IE1hdGgucG93KDEgLSBjb24gKiBjb24sIDIpIC8gKDIgKiBjb3NfcGhpKSAqIChxIC8gKDEgLSBlY2NlbnQgKiBlY2NlbnQpIC0gc2luX3BoaSAvICgxIC0gY29uICogY29uKSArIDAuNSAvIGVjY2VudCAqIE1hdGgubG9nKCgxIC0gY29uKSAvICgxICsgY29uKSkpO1xuICAgIHBoaSArPSBkcGhpO1xuICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSAwLjAwMDAwMDAwMDEpIHtcbiAgICAgIHJldHVybiBwaGk7XG4gICAgfVxuICB9XG5cbiAgLy8gY29uc29sZS5sb2coXCJJUVNGTi1DT05WOkxhdGl0dWRlIGZhaWxlZCB0byBjb252ZXJnZSBhZnRlciAzMCBpdGVyYXRpb25zXCIpO1xuICByZXR1cm4gTmFOO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHkgPSAxICsgeDtcbiAgdmFyIHogPSB5IC0gMTtcblxuICByZXR1cm4geiA9PT0gMCA/IHggOiB4ICogTWF0aC5sb2coeSkgLyB6O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGUwLCBlMSwgZTIsIGUzLCBwaGkpIHtcbiAgcmV0dXJuIChlMCAqIHBoaSAtIGUxICogTWF0aC5zaW4oMiAqIHBoaSkgKyBlMiAqIE1hdGguc2luKDQgKiBwaGkpIC0gZTMgKiBNYXRoLnNpbig2ICogcGhpKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZWNjZW50LCBzaW5waGksIGNvc3BoaSkge1xuICB2YXIgY29uID0gZWNjZW50ICogc2lucGhpO1xuICByZXR1cm4gY29zcGhpIC8gKE1hdGguc3FydCgxIC0gY29uICogY29uKSk7XG59XG4iLCJpbXBvcnQgeyBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlY2NlbnQsIHRzKSB7XG4gIHZhciBlY2NudGggPSAwLjUgKiBlY2NlbnQ7XG4gIHZhciBjb24sIGRwaGk7XG4gIHZhciBwaGkgPSBIQUxGX1BJIC0gMiAqIE1hdGguYXRhbih0cyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDw9IDE1OyBpKyspIHtcbiAgICBjb24gPSBlY2NlbnQgKiBNYXRoLnNpbihwaGkpO1xuICAgIGRwaGkgPSBIQUxGX1BJIC0gMiAqIE1hdGguYXRhbih0cyAqIChNYXRoLnBvdygoKDEgLSBjb24pIC8gKDEgKyBjb24pKSwgZWNjbnRoKSkpIC0gcGhpO1xuICAgIHBoaSArPSBkcGhpO1xuICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSAwLjAwMDAwMDAwMDEpIHtcbiAgICAgIHJldHVybiBwaGk7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUubG9nKFwicGhpMnogaGFzIE5vQ29udmVyZ2VuY2VcIik7XG4gIHJldHVybiAtOTk5OTtcbn1cbiIsInZhciBDMDAgPSAxO1xudmFyIEMwMiA9IDAuMjU7XG52YXIgQzA0ID0gMC4wNDY4NzU7XG52YXIgQzA2ID0gMC4wMTk1MzEyNTtcbnZhciBDMDggPSAwLjAxMDY4MTE1MjM0Mzc1O1xudmFyIEMyMiA9IDAuNzU7XG52YXIgQzQ0ID0gMC40Njg3NTtcbnZhciBDNDYgPSAwLjAxMzAyMDgzMzMzMzMzMzMzMzMzO1xudmFyIEM0OCA9IDAuMDA3MTIwNzY4MjI5MTY2NjY2NjY7XG52YXIgQzY2ID0gMC4zNjQ1ODMzMzMzMzMzMzMzMzMzMztcbnZhciBDNjggPSAwLjAwNTY5NjYxNDU4MzMzMzMzMzMzO1xudmFyIEM4OCA9IDAuMzA3NjE3MTg3NTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGVzKSB7XG4gIHZhciBlbiA9IFtdO1xuICBlblswXSA9IEMwMCAtIGVzICogKEMwMiArIGVzICogKEMwNCArIGVzICogKEMwNiArIGVzICogQzA4KSkpO1xuICBlblsxXSA9IGVzICogKEMyMiAtIGVzICogKEMwNCArIGVzICogKEMwNiArIGVzICogQzA4KSkpO1xuICB2YXIgdCA9IGVzICogZXM7XG4gIGVuWzJdID0gdCAqIChDNDQgLSBlcyAqIChDNDYgKyBlcyAqIEM0OCkpO1xuICB0ICo9IGVzO1xuICBlblszXSA9IHQgKiAoQzY2IC0gZXMgKiBDNjgpO1xuICBlbls0XSA9IHQgKiBlcyAqIEM4ODtcbiAgcmV0dXJuIGVuO1xufVxuIiwiaW1wb3J0IHBqX21sZm4gZnJvbSAnLi9wal9tbGZuJztcbmltcG9ydCB7IEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbnZhciBNQVhfSVRFUiA9IDIwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYXJnLCBlcywgZW4pIHtcbiAgdmFyIGsgPSAxIC8gKDEgLSBlcyk7XG4gIHZhciBwaGkgPSBhcmc7XG4gIGZvciAodmFyIGkgPSBNQVhfSVRFUjsgaTsgLS1pKSB7IC8qIHJhcmVseSBnb2VzIG92ZXIgMiBpdGVyYXRpb25zICovXG4gICAgdmFyIHMgPSBNYXRoLnNpbihwaGkpO1xuICAgIHZhciB0ID0gMSAtIGVzICogcyAqIHM7XG4gICAgLy8gdCA9IHRoaXMucGpfbWxmbihwaGksIHMsIE1hdGguY29zKHBoaSksIGVuKSAtIGFyZztcbiAgICAvLyBwaGkgLT0gdCAqICh0ICogTWF0aC5zcXJ0KHQpKSAqIGs7XG4gICAgdCA9IChwal9tbGZuKHBoaSwgcywgTWF0aC5jb3MocGhpKSwgZW4pIC0gYXJnKSAqICh0ICogTWF0aC5zcXJ0KHQpKSAqIGs7XG4gICAgcGhpIC09IHQ7XG4gICAgaWYgKE1hdGguYWJzKHQpIDwgRVBTTE4pIHtcbiAgICAgIHJldHVybiBwaGk7XG4gICAgfVxuICB9XG4gIC8vIC4ucmVwb3J0RXJyb3IoXCJjYXNzOnBqX2ludl9tbGZuOiBDb252ZXJnZW5jZSBlcnJvclwiKTtcbiAgcmV0dXJuIHBoaTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwaGksIHNwaGksIGNwaGksIGVuKSB7XG4gIGNwaGkgKj0gc3BoaTtcbiAgc3BoaSAqPSBzcGhpO1xuICByZXR1cm4gKGVuWzBdICogcGhpIC0gY3BoaSAqIChlblsxXSArIHNwaGkgKiAoZW5bMl0gKyBzcGhpICogKGVuWzNdICsgc3BoaSAqIGVuWzRdKSkpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChlY2NlbnQsIHNpbnBoaSkge1xuICB2YXIgY29uO1xuICBpZiAoZWNjZW50ID4gMS4wZS03KSB7XG4gICAgY29uID0gZWNjZW50ICogc2lucGhpO1xuICAgIHJldHVybiAoKDEgLSBlY2NlbnQgKiBlY2NlbnQpICogKHNpbnBoaSAvICgxIC0gY29uICogY29uKSAtICgwLjUgLyBlY2NlbnQpICogTWF0aC5sb2coKDEgLSBjb24pIC8gKDEgKyBjb24pKSkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAoMiAqIHNpbnBoaSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiB4IDwgMCA/IC0xIDogMTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4KSB7XG4gIHZhciByID0gTWF0aC5leHAoeCk7XG4gIHIgPSAociAtIDEgLyByKSAvIDI7XG4gIHJldHVybiByO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGVzaW5wLCBleHApIHtcbiAgcmV0dXJuIChNYXRoLnBvdygoMSAtIGVzaW5wKSAvICgxICsgZXNpbnApLCBleHApKTtcbn1cbiIsIi8qKlxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBhcnJheVxuICogQHJldHVybnMge2ltcG9ydChcIi4uL2NvcmVcIikuSW50ZXJmYWNlQ29vcmRpbmF0ZXN9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhcnJheSkge1xuICB2YXIgb3V0ID0ge1xuICAgIHg6IGFycmF5WzBdLFxuICAgIHk6IGFycmF5WzFdXG4gIH07XG4gIGlmIChhcnJheS5sZW5ndGggPiAyKSB7XG4gICAgb3V0LnogPSBhcnJheVsyXTtcbiAgfVxuICBpZiAoYXJyYXkubGVuZ3RoID4gMykge1xuICAgIG91dC5tID0gYXJyYXlbM107XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsImltcG9ydCB7IEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGVjY2VudCwgcGhpLCBzaW5waGkpIHtcbiAgdmFyIGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcbiAgdmFyIGNvbSA9IDAuNSAqIGVjY2VudDtcbiAgY29uID0gTWF0aC5wb3coKCgxIC0gY29uKSAvICgxICsgY29uKSksIGNvbSk7XG4gIHJldHVybiAoTWF0aC50YW4oMC41ICogKEhBTEZfUEkgLSBwaGkpKSAvIGNvbik7XG59XG4iLCIvKipcbiAqIENhbGN1bGF0ZXMgdGhlIGludmVyc2UgZ2VvZGVzaWMgcHJvYmxlbSB1c2luZyBWaW5jZW50eSdzIGZvcm11bGFlLlxuICogQ29tcHV0ZXMgdGhlIGZvcndhcmQgYXppbXV0aCBhbmQgZWxsaXBzb2lkYWwgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG4gKiBzcGVjaWZpZWQgYnkgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBvbiB0aGUgc3VyZmFjZSBvZiBhbiBlbGxpcHNvaWQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGxhdDEgTGF0aXR1ZGUgb2YgdGhlIGZpcnN0IHBvaW50IGluIHJhZGlhbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gbG9uMSBMb25naXR1ZGUgb2YgdGhlIGZpcnN0IHBvaW50IGluIHJhZGlhbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGF0MiBMYXRpdHVkZSBvZiB0aGUgc2Vjb25kIHBvaW50IGluIHJhZGlhbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gbG9uMiBMb25naXR1ZGUgb2YgdGhlIHNlY29uZCBwb2ludCBpbiByYWRpYW5zLlxuICogQHBhcmFtIHtudW1iZXJ9IGEgU2VtaS1tYWpvciBheGlzIG9mIHRoZSBlbGxpcHNvaWQgKG1ldGVycykuXG4gKiBAcGFyYW0ge251bWJlcn0gZiBGbGF0dGVuaW5nIG9mIHRoZSBlbGxpcHNvaWQuXG4gKiBAcmV0dXJucyB7eyBhemkxOiBudW1iZXIsIHMxMjogbnVtYmVyIH19IEFuIG9iamVjdCBjb250YWluaW5nOlxuICogICAtIGF6aTE6IEZvcndhcmQgYXppbXV0aCBmcm9tIHRoZSBmaXJzdCBwb2ludCB0byB0aGUgc2Vjb25kIHBvaW50IChyYWRpYW5zKS5cbiAqICAgLSBzMTI6IEVsbGlwc29pZGFsIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHMgKG1ldGVycykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2aW5jZW50eUludmVyc2UobGF0MSwgbG9uMSwgbGF0MiwgbG9uMiwgYSwgZikge1xuICBjb25zdCBMID0gbG9uMiAtIGxvbjE7XG4gIGNvbnN0IFUxID0gTWF0aC5hdGFuKCgxIC0gZikgKiBNYXRoLnRhbihsYXQxKSk7XG4gIGNvbnN0IFUyID0gTWF0aC5hdGFuKCgxIC0gZikgKiBNYXRoLnRhbihsYXQyKSk7XG4gIGNvbnN0IHNpblUxID0gTWF0aC5zaW4oVTEpLCBjb3NVMSA9IE1hdGguY29zKFUxKTtcbiAgY29uc3Qgc2luVTIgPSBNYXRoLnNpbihVMiksIGNvc1UyID0gTWF0aC5jb3MoVTIpO1xuXG4gIGxldCBsYW1iZGEgPSBMLCBsYW1iZGFQLCBpdGVyTGltaXQgPSAxMDA7XG4gIGxldCBzaW5MYW1iZGEsIGNvc0xhbWJkYSwgc2luU2lnbWEsIGNvc1NpZ21hLCBzaWdtYSwgc2luQWxwaGEsIGNvczJBbHBoYSwgY29zMlNpZ21hTSwgQztcbiAgbGV0IHVTcSwgQSwgQiwgZGVsdGFTaWdtYSwgcztcblxuICBkbyB7XG4gICAgc2luTGFtYmRhID0gTWF0aC5zaW4obGFtYmRhKTtcbiAgICBjb3NMYW1iZGEgPSBNYXRoLmNvcyhsYW1iZGEpO1xuICAgIHNpblNpZ21hID0gTWF0aC5zcXJ0KFxuICAgICAgKGNvc1UyICogc2luTGFtYmRhKSAqIChjb3NVMiAqIHNpbkxhbWJkYSlcbiAgICAgICsgKGNvc1UxICogc2luVTIgLSBzaW5VMSAqIGNvc1UyICogY29zTGFtYmRhKVxuICAgICAgKiAoY29zVTEgKiBzaW5VMiAtIHNpblUxICogY29zVTIgKiBjb3NMYW1iZGEpXG4gICAgKTtcbiAgICBpZiAoc2luU2lnbWEgPT09IDApIHtcbiAgICAgIHJldHVybiB7IGF6aTE6IDAsIHMxMjogMCB9OyAvLyBjb2luY2lkZW50IHBvaW50c1xuICAgIH1cbiAgICBjb3NTaWdtYSA9IHNpblUxICogc2luVTIgKyBjb3NVMSAqIGNvc1UyICogY29zTGFtYmRhO1xuICAgIHNpZ21hID0gTWF0aC5hdGFuMihzaW5TaWdtYSwgY29zU2lnbWEpO1xuICAgIHNpbkFscGhhID0gY29zVTEgKiBjb3NVMiAqIHNpbkxhbWJkYSAvIHNpblNpZ21hO1xuICAgIGNvczJBbHBoYSA9IDEgLSBzaW5BbHBoYSAqIHNpbkFscGhhO1xuICAgIGNvczJTaWdtYU0gPSAoY29zMkFscGhhICE9PSAwKSA/IChjb3NTaWdtYSAtIDIgKiBzaW5VMSAqIHNpblUyIC8gY29zMkFscGhhKSA6IDA7XG4gICAgQyA9IGYgLyAxNiAqIGNvczJBbHBoYSAqICg0ICsgZiAqICg0IC0gMyAqIGNvczJBbHBoYSkpO1xuICAgIGxhbWJkYVAgPSBsYW1iZGE7XG4gICAgbGFtYmRhID0gTCArICgxIC0gQykgKiBmICogc2luQWxwaGFcbiAgICAqIChzaWdtYSArIEMgKiBzaW5TaWdtYSAqIChjb3MyU2lnbWFNICsgQyAqIGNvc1NpZ21hICogKC0xICsgMiAqIGNvczJTaWdtYU0gKiBjb3MyU2lnbWFNKSkpO1xuICB9IHdoaWxlIChNYXRoLmFicyhsYW1iZGEgLSBsYW1iZGFQKSA+IDFlLTEyICYmIC0taXRlckxpbWl0ID4gMCk7XG5cbiAgaWYgKGl0ZXJMaW1pdCA9PT0gMCkge1xuICAgIHJldHVybiB7IGF6aTE6IE5hTiwgczEyOiBOYU4gfTsgLy8gZm9ybXVsYSBmYWlsZWQgdG8gY29udmVyZ2VcbiAgfVxuXG4gIHVTcSA9IGNvczJBbHBoYSAqIChhICogYSAtIChhICogKDEgLSBmKSkgKiAoYSAqICgxIC0gZikpKSAvICgoYSAqICgxIC0gZikpICogKGEgKiAoMSAtIGYpKSk7XG4gIEEgPSAxICsgdVNxIC8gMTYzODQgKiAoNDA5NiArIHVTcSAqICgtNzY4ICsgdVNxICogKDMyMCAtIDE3NSAqIHVTcSkpKTtcbiAgQiA9IHVTcSAvIDEwMjQgKiAoMjU2ICsgdVNxICogKC0xMjggKyB1U3EgKiAoNzQgLSA0NyAqIHVTcSkpKTtcbiAgZGVsdGFTaWdtYSA9IEIgKiBzaW5TaWdtYSAqIChjb3MyU2lnbWFNICsgQiAvIDQgKiAoY29zU2lnbWEgKiAoLTEgKyAyICogY29zMlNpZ21hTSAqIGNvczJTaWdtYU0pXG4gICAgLSBCIC8gNiAqIGNvczJTaWdtYU0gKiAoLTMgKyA0ICogc2luU2lnbWEgKiBzaW5TaWdtYSkgKiAoLTMgKyA0ICogY29zMlNpZ21hTSAqIGNvczJTaWdtYU0pKSk7XG5cbiAgcyA9IChhICogKDEgLSBmKSkgKiBBICogKHNpZ21hIC0gZGVsdGFTaWdtYSk7XG5cbiAgLy8gRm9yd2FyZCBhemltdXRoXG4gIGNvbnN0IGF6aTEgPSBNYXRoLmF0YW4yKGNvc1UyICogc2luTGFtYmRhLCBjb3NVMSAqIHNpblUyIC0gc2luVTEgKiBjb3NVMiAqIGNvc0xhbWJkYSk7XG5cbiAgcmV0dXJuIHsgYXppMSwgczEyOiBzIH07XG59XG5cbi8qKlxuICogU29sdmVzIHRoZSBkaXJlY3QgZ2VvZGV0aWMgcHJvYmxlbSB1c2luZyBWaW5jZW50eSdzIGZvcm11bGFlLlxuICogR2l2ZW4gYSBzdGFydGluZyBwb2ludCwgaW5pdGlhbCBhemltdXRoLCBhbmQgZGlzdGFuY2UsIGNvbXB1dGVzIHRoZSBkZXN0aW5hdGlvbiBwb2ludCBvbiB0aGUgZWxsaXBzb2lkLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBsYXQxIExhdGl0dWRlIG9mIHRoZSBzdGFydGluZyBwb2ludCBpbiByYWRpYW5zLlxuICogQHBhcmFtIHtudW1iZXJ9IGxvbjEgTG9uZ2l0dWRlIG9mIHRoZSBzdGFydGluZyBwb2ludCBpbiByYWRpYW5zLlxuICogQHBhcmFtIHtudW1iZXJ9IGF6aTEgSW5pdGlhbCBhemltdXRoIChmb3J3YXJkIGF6aW11dGgpIGluIHJhZGlhbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gczEyIERpc3RhbmNlIHRvIHRyYXZlbCBmcm9tIHRoZSBzdGFydGluZyBwb2ludCBpbiBtZXRlcnMuXG4gKiBAcGFyYW0ge251bWJlcn0gYSBTZW1pLW1ham9yIGF4aXMgb2YgdGhlIGVsbGlwc29pZCBpbiBtZXRlcnMuXG4gKiBAcGFyYW0ge251bWJlcn0gZiBGbGF0dGVuaW5nIG9mIHRoZSBlbGxpcHNvaWQuXG4gKiBAcmV0dXJucyB7e2xhdDI6IG51bWJlciwgbG9uMjogbnVtYmVyfX0gVGhlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgKGluIHJhZGlhbnMpIG9mIHRoZSBkZXN0aW5hdGlvbiBwb2ludC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZpbmNlbnR5RGlyZWN0KGxhdDEsIGxvbjEsIGF6aTEsIHMxMiwgYSwgZikge1xuICBjb25zdCBVMSA9IE1hdGguYXRhbigoMSAtIGYpICogTWF0aC50YW4obGF0MSkpO1xuICBjb25zdCBzaW5VMSA9IE1hdGguc2luKFUxKSwgY29zVTEgPSBNYXRoLmNvcyhVMSk7XG4gIGNvbnN0IHNpbkFscGhhMSA9IE1hdGguc2luKGF6aTEpLCBjb3NBbHBoYTEgPSBNYXRoLmNvcyhhemkxKTtcblxuICBjb25zdCBzaWdtYTEgPSBNYXRoLmF0YW4yKHNpblUxLCBjb3NVMSAqIGNvc0FscGhhMSk7XG4gIGNvbnN0IHNpbkFscGhhID0gY29zVTEgKiBzaW5BbHBoYTE7XG4gIGNvbnN0IGNvczJBbHBoYSA9IDEgLSBzaW5BbHBoYSAqIHNpbkFscGhhO1xuICBjb25zdCB1U3EgPSBjb3MyQWxwaGEgKiAoYSAqIGEgLSAoYSAqICgxIC0gZikpICogKGEgKiAoMSAtIGYpKSkgLyAoKGEgKiAoMSAtIGYpKSAqIChhICogKDEgLSBmKSkpO1xuICBjb25zdCBBID0gMSArIHVTcSAvIDE2Mzg0ICogKDQwOTYgKyB1U3EgKiAoLTc2OCArIHVTcSAqICgzMjAgLSAxNzUgKiB1U3EpKSk7XG4gIGNvbnN0IEIgPSB1U3EgLyAxMDI0ICogKDI1NiArIHVTcSAqICgtMTI4ICsgdVNxICogKDc0IC0gNDcgKiB1U3EpKSk7XG5cbiAgbGV0IHNpZ21hID0gczEyIC8gKChhICogKDEgLSBmKSkgKiBBKSwgc2lnbWFQLCBpdGVyTGltaXQgPSAxMDA7XG4gIGxldCBjb3MyU2lnbWFNLCBzaW5TaWdtYSwgY29zU2lnbWEsIGRlbHRhU2lnbWE7XG5cbiAgZG8ge1xuICAgIGNvczJTaWdtYU0gPSBNYXRoLmNvcygyICogc2lnbWExICsgc2lnbWEpO1xuICAgIHNpblNpZ21hID0gTWF0aC5zaW4oc2lnbWEpO1xuICAgIGNvc1NpZ21hID0gTWF0aC5jb3Moc2lnbWEpO1xuICAgIGRlbHRhU2lnbWEgPSBCICogc2luU2lnbWEgKiAoY29zMlNpZ21hTSArIEIgLyA0ICogKGNvc1NpZ21hICogKC0xICsgMiAqIGNvczJTaWdtYU0gKiBjb3MyU2lnbWFNKVxuICAgICAgLSBCIC8gNiAqIGNvczJTaWdtYU0gKiAoLTMgKyA0ICogc2luU2lnbWEgKiBzaW5TaWdtYSkgKiAoLTMgKyA0ICogY29zMlNpZ21hTSAqIGNvczJTaWdtYU0pKSk7XG4gICAgc2lnbWFQID0gc2lnbWE7XG4gICAgc2lnbWEgPSBzMTIgLyAoKGEgKiAoMSAtIGYpKSAqIEEpICsgZGVsdGFTaWdtYTtcbiAgfSB3aGlsZSAoTWF0aC5hYnMoc2lnbWEgLSBzaWdtYVApID4gMWUtMTIgJiYgLS1pdGVyTGltaXQgPiAwKTtcblxuICBpZiAoaXRlckxpbWl0ID09PSAwKSB7XG4gICAgcmV0dXJuIHsgbGF0MjogTmFOLCBsb24yOiBOYU4gfTtcbiAgfVxuXG4gIGNvbnN0IHRtcCA9IHNpblUxICogc2luU2lnbWEgLSBjb3NVMSAqIGNvc1NpZ21hICogY29zQWxwaGExO1xuICBjb25zdCBsYXQyID0gTWF0aC5hdGFuMihcbiAgICBzaW5VMSAqIGNvc1NpZ21hICsgY29zVTEgKiBzaW5TaWdtYSAqIGNvc0FscGhhMSxcbiAgICAoMSAtIGYpICogTWF0aC5zcXJ0KHNpbkFscGhhICogc2luQWxwaGEgKyB0bXAgKiB0bXApXG4gICk7XG4gIGNvbnN0IGxhbWJkYSA9IE1hdGguYXRhbjIoXG4gICAgc2luU2lnbWEgKiBzaW5BbHBoYTEsXG4gICAgY29zVTEgKiBjb3NTaWdtYSAtIHNpblUxICogc2luU2lnbWEgKiBjb3NBbHBoYTFcbiAgKTtcbiAgY29uc3QgQyA9IGYgLyAxNiAqIGNvczJBbHBoYSAqICg0ICsgZiAqICg0IC0gMyAqIGNvczJBbHBoYSkpO1xuICBjb25zdCBMID0gbGFtYmRhIC0gKDEgLSBDKSAqIGYgKiBzaW5BbHBoYVxuICAgICogKHNpZ21hICsgQyAqIHNpblNpZ21hICogKGNvczJTaWdtYU0gKyBDICogY29zU2lnbWEgKiAoLTEgKyAyICogY29zMlNpZ21hTSAqIGNvczJTaWdtYU0pKSk7XG4gIGNvbnN0IGxvbjIgPSBsb24xICsgTDtcblxuICByZXR1cm4geyBsYXQyLCBsb24yIH07XG59XG4iLCJ2YXIgZGF0dW1zID0ge1xuICB3Z3M4NDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCcsXG4gICAgZWxsaXBzZTogJ1dHUzg0JyxcbiAgICBkYXR1bU5hbWU6ICdXR1M4NCdcbiAgfSxcbiAgY2gxOTAzOiB7XG4gICAgdG93Z3M4NDogJzY3NC4zNzQsMTUuMDU2LDQwNS4zNDYnLFxuICAgIGVsbGlwc2U6ICdiZXNzZWwnLFxuICAgIGRhdHVtTmFtZTogJ3N3aXNzJ1xuICB9LFxuICBnZ3JzODc6IHtcbiAgICB0b3dnczg0OiAnLTE5OS44Nyw3NC43OSwyNDYuNjInLFxuICAgIGVsbGlwc2U6ICdHUlM4MCcsXG4gICAgZGF0dW1OYW1lOiAnR3JlZWtfR2VvZGV0aWNfUmVmZXJlbmNlX1N5c3RlbV8xOTg3J1xuICB9LFxuICBuYWQ4Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCcsXG4gICAgZWxsaXBzZTogJ0dSUzgwJyxcbiAgICBkYXR1bU5hbWU6ICdOb3J0aF9BbWVyaWNhbl9EYXR1bV8xOTgzJ1xuICB9LFxuICBuYWQyNzoge1xuICAgIG5hZGdyaWRzOiAnQGNvbnVzLEBhbGFza2EsQG50djJfMC5nc2IsQG50djFfY2FuLmRhdCcsXG4gICAgZWxsaXBzZTogJ2Nscms2NicsXG4gICAgZGF0dW1OYW1lOiAnTm9ydGhfQW1lcmljYW5fRGF0dW1fMTkyNydcbiAgfSxcbiAgcG90c2RhbToge1xuICAgIHRvd2dzODQ6ICc1OTguMSw3My43LDQxOC4yLDAuMjAyLDAuMDQ1LC0yLjQ1NSw2LjcnLFxuICAgIGVsbGlwc2U6ICdiZXNzZWwnLFxuICAgIGRhdHVtTmFtZTogJ1BvdHNkYW0gUmF1ZW5iZXJnIDE5NTAgREhETidcbiAgfSxcbiAgY2FydGhhZ2U6IHtcbiAgICB0b3dnczg0OiAnLTI2My4wLDYuMCw0MzEuMCcsXG4gICAgZWxsaXBzZTogJ2NsYXJrODAnLFxuICAgIGRhdHVtTmFtZTogJ0NhcnRoYWdlIDE5MzQgVHVuaXNpYSdcbiAgfSxcbiAgaGVybWFubnNrb2dlbDoge1xuICAgIHRvd2dzODQ6ICc1NzcuMzI2LDkwLjEyOSw0NjMuOTE5LDUuMTM3LDEuNDc0LDUuMjk3LDIuNDIzMicsXG4gICAgZWxsaXBzZTogJ2Jlc3NlbCcsXG4gICAgZGF0dW1OYW1lOiAnSGVybWFubnNrb2dlbCdcbiAgfSxcbiAgbWdpOiB7XG4gICAgdG93Z3M4NDogJzU3Ny4zMjYsOTAuMTI5LDQ2My45MTksNS4xMzcsMS40NzQsNS4yOTcsMi40MjMyJyxcbiAgICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgICBkYXR1bU5hbWU6ICdNaWxpdGFyLUdlb2dyYXBoaXNjaGUgSW5zdGl0dXQnXG4gIH0sXG4gIG9zbmk1Mjoge1xuICAgIHRvd2dzODQ6ICc0ODIuNTMwLC0xMzAuNTk2LDU2NC41NTcsLTEuMDQyLC0wLjIxNCwtMC42MzEsOC4xNScsXG4gICAgZWxsaXBzZTogJ2FpcnknLFxuICAgIGRhdHVtTmFtZTogJ0lyaXNoIE5hdGlvbmFsJ1xuICB9LFxuICBpcmU2NToge1xuICAgIHRvd2dzODQ6ICc0ODIuNTMwLC0xMzAuNTk2LDU2NC41NTcsLTEuMDQyLC0wLjIxNCwtMC42MzEsOC4xNScsXG4gICAgZWxsaXBzZTogJ21vZF9haXJ5JyxcbiAgICBkYXR1bU5hbWU6ICdJcmVsYW5kIDE5NjUnXG4gIH0sXG4gIHJhc3NhZGlyYW46IHtcbiAgICB0b3dnczg0OiAnLTEzMy42MywtMTU3LjUsLTE1OC42MicsXG4gICAgZWxsaXBzZTogJ2ludGwnLFxuICAgIGRhdHVtTmFtZTogJ1Jhc3NhZGlyYW4nXG4gIH0sXG4gIG56Z2Q0OToge1xuICAgIHRvd2dzODQ6ICc1OS40NywtNS4wNCwxODcuNDQsMC40NywtMC4xLDEuMDI0LC00LjU5OTMnLFxuICAgIGVsbGlwc2U6ICdpbnRsJyxcbiAgICBkYXR1bU5hbWU6ICdOZXcgWmVhbGFuZCBHZW9kZXRpYyBEYXR1bSAxOTQ5J1xuICB9LFxuICBvc2diMzY6IHtcbiAgICB0b3dnczg0OiAnNDQ2LjQ0OCwtMTI1LjE1Nyw1NDIuMDYwLDAuMTUwMiwwLjI0NzAsMC44NDIxLC0yMC40ODk0JyxcbiAgICBlbGxpcHNlOiAnYWlyeScsXG4gICAgZGF0dW1OYW1lOiAnT3JkbmFuY2UgU3VydmV5IG9mIEdyZWF0IEJyaXRhaW4gMTkzNidcbiAgfSxcbiAgc19qdHNrOiB7XG4gICAgdG93Z3M4NDogJzU4OSw3Niw0ODAnLFxuICAgIGVsbGlwc2U6ICdiZXNzZWwnLFxuICAgIGRhdHVtTmFtZTogJ1MtSlRTSyAoRmVycm8pJ1xuICB9LFxuICBiZWR1YXJhbToge1xuICAgIHRvd2dzODQ6ICctMTA2LC04NywxODgnLFxuICAgIGVsbGlwc2U6ICdjbHJrODAnLFxuICAgIGRhdHVtTmFtZTogJ0JlZHVhcmFtJ1xuICB9LFxuICBndW51bmdfc2VnYXJhOiB7XG4gICAgdG93Z3M4NDogJy00MDMsNjg0LDQxJyxcbiAgICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgICBkYXR1bU5hbWU6ICdHdW51bmcgU2VnYXJhIEpha2FydGEnXG4gIH0sXG4gIHJuYjcyOiB7XG4gICAgdG93Z3M4NDogJzEwNi44NjksLTUyLjI5NzgsMTAzLjcyNCwtMC4zMzY1NywwLjQ1Njk1NSwtMS44NDIxOCwxJyxcbiAgICBlbGxpcHNlOiAnaW50bCcsXG4gICAgZGF0dW1OYW1lOiAnUmVzZWF1IE5hdGlvbmFsIEJlbGdlIDE5NzInXG4gIH0sXG4gIEVQU0dfNTQ1MToge1xuICAgIHRvd2dzODQ6ICc2LjQxLC00OS4wNSwtMTEuMjgsMS41NjU3LDAuNTI0Miw2Ljk3MTgsLTUuNzY0OSdcbiAgfSxcbiAgSUdORl9MVVJFU0c6IHtcbiAgICB0b3dnczg0OiAnLTE5Mi45ODYsMTMuNjczLC0zOS4zMDksLTAuNDA5OSwtMi45MzMyLDIuNjg4MSwwLjQzJ1xuICB9LFxuICBFUFNHXzQ2MTQ6IHtcbiAgICB0b3dnczg0OiAnLTExOS40MjQ4LC0zMDMuNjU4NzIsLTExLjAwMDYxLDEuMTY0Mjk4LDAuMTc0NDU4LDEuMDk2MjU5LDMuNjU3MDY1J1xuICB9LFxuICBFUFNHXzQ2MTU6IHtcbiAgICB0b3dnczg0OiAnLTQ5NC4wODgsLTMxMi4xMjksMjc5Ljg3NywtMS40MjMsLTEuMDEzLDEuNTksLTAuNzQ4J1xuICB9LFxuICBFU1JJXzM3MjQxOiB7XG4gICAgdG93Z3M4NDogJy03Ni44MjIsMjU3LjQ1NywtMTIuODE3LDIuMTM2LC0wLjAzMywtMi4zOTIsLTAuMDMxJ1xuICB9LFxuICBFU1JJXzM3MjQ5OiB7XG4gICAgdG93Z3M4NDogJy00NDAuMjk2LDU4LjU0OCwyOTYuMjY1LDEuMTI4LDEwLjIwMiw0LjU1OSwtMC40MzgnXG4gIH0sXG4gIEVTUklfMzcyNDU6IHtcbiAgICB0b3dnczg0OiAnLTUxMS4xNTEsLTE4MS4yNjksMTM5LjYwOSwxLjA1LDIuNzAzLDEuNzk4LDMuMDcxJ1xuICB9LFxuICBFUFNHXzQxNzg6IHtcbiAgICB0b3dnczg0OiAnMjQuOSwtMTI2LjQsLTkzLjIsLTAuMDYzLC0wLjI0NywtMC4wNDEsMS4wMSdcbiAgfSxcbiAgRVBTR180NjIyOiB7XG4gICAgdG93Z3M4NDogJy00NzIuMjksLTUuNjMsLTMwNC4xMiwwLjQzNjIsLTAuODM3NCwwLjI1NjMsMS44OTg0J1xuICB9LFxuICBFUFNHXzQ2MjU6IHtcbiAgICB0b3dnczg0OiAnMTI2LjkzLDU0Ny45NCwxMzAuNDEsLTIuNzg2Nyw1LjE2MTIsLTAuODU4NCwxMy44MjI3J1xuICB9LFxuICBFUFNHXzUyNTI6IHtcbiAgICB0b3dnczg0OiAnMC4wMjMsMC4wMzYsLTAuMDY4LDAuMDAxNzYsMC4wMDkxMiwtMC4wMTEzNiwwLjAwNDM5J1xuICB9LFxuICBFUFNHXzQzMTQ6IHtcbiAgICB0b3dnczg0OiAnNTk3LjEsNzEuNCw0MTIuMSwwLjg5NCwwLjA2OCwtMS41NjMsNy41OCdcbiAgfSxcbiAgRVBTR180MjgyOiB7XG4gICAgdG93Z3M4NDogJy0xNzguMywtMzE2LjcsLTEzMS41LDUuMjc4LDYuMDc3LDEwLjk3OSwxOS4xNjYnXG4gIH0sXG4gIEVQU0dfNDIzMToge1xuICAgIHRvd2dzODQ6ICctODMuMTEsLTk3LjM4LC0xMTcuMjIsMC4wMjc2LC0wLjIxNjcsMC4yMTQ3LDAuMTIxOCdcbiAgfSxcbiAgRVBTR180Mjc0OiB7XG4gICAgdG93Z3M4NDogJy0yMzAuOTk0LDEwMi41OTEsMjUuMTk5LDAuNjMzLC0wLjIzOSwwLjksMS45NSdcbiAgfSxcbiAgRVBTR180MTM0OiB7XG4gICAgdG93Z3M4NDogJy0xODAuNjI0LC0yMjUuNTE2LDE3My45MTksLTAuODEsLTEuODk4LDguMzM2LDE2LjcxMDA2J1xuICB9LFxuICBFUFNHXzQyNTQ6IHtcbiAgICB0b3dnczg0OiAnMTguMzgsMTkyLjQ1LDk2LjgyLDAuMDU2LC0wLjE0MiwtMC4yLC0wLjAwMTMnXG4gIH0sXG4gIEVQU0dfNDE1OToge1xuICAgIHRvd2dzODQ6ICctMTk0LjUxMywtNjMuOTc4LC0yNS43NTksLTMuNDAyNywzLjc1NiwtMy4zNTIsLTAuOTE3NSdcbiAgfSxcbiAgRVBTR180Njg3OiB7XG4gICAgdG93Z3M4NDogJzAuMDcyLC0wLjUwNywtMC4yNDUsMC4wMTgzLC0wLjAwMDMsMC4wMDcsLTAuMDA5MydcbiAgfSxcbiAgRVBTR180MjI3OiB7XG4gICAgdG93Z3M4NDogJy04My41OCwtMzk3LjU0LDQ1OC43OCwtMTcuNTk1LC0yLjg0Nyw0LjI1NiwzLjIyNSdcbiAgfSxcbiAgRVBTR180NzQ2OiB7XG4gICAgdG93Z3M4NDogJzU5OS40LDcyLjQsNDE5LjIsLTAuMDYyLC0wLjAyMiwtMi43MjMsNi40NidcbiAgfSxcbiAgRVBTR180NzQ1OiB7XG4gICAgdG93Z3M4NDogJzYxMi40LDc3LDQ0MC4yLC0wLjA1NCwwLjA1NywtMi43OTcsMi41NSdcbiAgfSxcbiAgRVBTR182MzExOiB7XG4gICAgdG93Z3M4NDogJzguODQ2LC00LjM5NCwtMS4xMjIsLTAuMDAyMzcsLTAuMTQ2NTI4LDAuMTMwNDI4LDAuNzgzOTI2J1xuICB9LFxuICBFUFNHXzQyODk6IHtcbiAgICB0b3dnczg0OiAnNTY1LjczODEsNTAuNDAxOCw0NjUuMjkwNCwtMS45MTUxNCwxLjYwMzYzLC05LjA5NTQ2LDQuMDcyNDQnXG4gIH0sXG4gIEVQU0dfNDIzMDoge1xuICAgIHRvd2dzODQ6ICctNjguODYzLC0xMzQuODg4LC0xMTEuNDksLTAuNTMsLTAuMTQsMC41NywtMy40J1xuICB9LFxuICBFUFNHXzQxNTQ6IHtcbiAgICB0b3dnczg0OiAnLTEyMy4wMiwtMTU4Ljk1LC0xNjguNDcnXG4gIH0sXG4gIEVQU0dfNDE1Njoge1xuICAgIHRvd2dzODQ6ICc1NzAuOCw4NS43LDQ2Mi44LDQuOTk4LDEuNTg3LDUuMjYxLDMuNTYnXG4gIH0sXG4gIEVQU0dfNDI5OToge1xuICAgIHRvd2dzODQ6ICc0ODIuNSwtMTMwLjYsNTY0LjYsLTEuMDQyLC0wLjIxNCwtMC42MzEsOC4xNSdcbiAgfSxcbiAgRVBTR180MTc5OiB7XG4gICAgdG93Z3M4NDogJzMzLjQsLTE0Ni42LC03Ni4zLC0wLjM1OSwtMC4wNTMsMC44NDQsLTAuODQnXG4gIH0sXG4gIEVQU0dfNDMxMzoge1xuICAgIHRvd2dzODQ6ICctMTA2Ljg2ODYsNTIuMjk3OCwtMTAzLjcyMzksMC4zMzY2LC0wLjQ1NywxLjg0MjIsLTEuMjc0NydcbiAgfSxcbiAgRVBTR180MTk0OiB7XG4gICAgdG93Z3M4NDogJzE2My41MTEsMTI3LjUzMywtMTU5Ljc4OSdcbiAgfSxcbiAgRVBTR180MTk1OiB7XG4gICAgdG93Z3M4NDogJzEwNSwzMjYsLTEwMi41J1xuICB9LFxuICBFUFNHXzQxOTY6IHtcbiAgICB0b3dnczg0OiAnLTQ1LDQxNywtMy41J1xuICB9LFxuICBFUFNHXzQ2MTE6IHtcbiAgICB0b3dnczg0OiAnLTE2Mi42MTksLTI3Ni45NTksLTE2MS43NjQsMC4wNjc3NTMsLTIuMjQzNjQ5LC0xLjE1ODgyNywtMS4wOTQyNDYnXG4gIH0sXG4gIEVQU0dfNDYzMzoge1xuICAgIHRvd2dzODQ6ICcxMzcuMDkyLDEzMS42Niw5MS40NzUsLTEuOTQzNiwtMTEuNTk5MywtNC4zMzIxLC03LjQ4MjQnXG4gIH0sXG4gIEVQU0dfNDY0MToge1xuICAgIHRvd2dzODQ6ICctNDA4LjgwOSwzNjYuODU2LC00MTIuOTg3LDEuODg0MiwtMC41MzA4LDIuMTY1NSwtMTIxLjA5OTMnXG4gIH0sXG4gIEVQU0dfNDY0Mzoge1xuICAgIHRvd2dzODQ6ICctNDgwLjI2LC00MzguMzIsLTY0My40MjksMTYuMzExOSwyMC4xNzIxLC00LjAzNDksLTExMS43MDAyJ1xuICB9LFxuICBFUFNHXzQzMDA6IHtcbiAgICB0b3dnczg0OiAnNDgyLjUsLTEzMC42LDU2NC42LC0xLjA0MiwtMC4yMTQsLTAuNjMxLDguMTUnXG4gIH0sXG4gIEVQU0dfNDE4ODoge1xuICAgIHRvd2dzODQ6ICc0ODIuNSwtMTMwLjYsNTY0LjYsLTEuMDQyLC0wLjIxNCwtMC42MzEsOC4xNSdcbiAgfSxcbiAgRVBTR180NjYwOiB7XG4gICAgdG93Z3M4NDogJzk4Mi42MDg3LDU1Mi43NTMsLTU0MC44NzMsMzIuMzkzNDQsLTE1My4yNTY4NCwtOTYuMjI2NiwxNi44MDUnXG4gIH0sXG4gIEVQU0dfNDY2Mjoge1xuICAgIHRvd2dzODQ6ICc5Ny4yOTUsLTI2My4yNDcsMzEwLjg4MiwtMS41OTk5LDAuODM4NiwzLjE0MDksMTMuMzI1OSdcbiAgfSxcbiAgRVBTR18zOTA2OiB7XG4gICAgdG93Z3M4NDogJzU3Ny44ODg5MSwxNjUuMjIyMDUsMzkxLjE4Mjg5LDQuOTE0NSwtMC45NDcyOSwtMTMuMDUwOTgsNy43ODY2NCdcbiAgfSxcbiAgRVBTR180MzA3OiB7XG4gICAgdG93Z3M4NDogJy0yMDkuMzYyMiwtODcuODE2Miw0MDQuNjE5OCwwLjAwNDYsMy40Nzg0LDAuNTgwNSwtMS40NTQ3J1xuICB9LFxuICBFUFNHXzY4OTI6IHtcbiAgICB0b3dnczg0OiAnLTc2LjI2OSwtMTYuNjgzLDY4LjU2MiwtNi4yNzUsMTAuNTM2LC00LjI4NiwtMTMuNjg2J1xuICB9LFxuICBFUFNHXzQ2OTA6IHtcbiAgICB0b3dnczg0OiAnMjIxLjU5NywxNTIuNDQxLDE3Ni41MjMsMi40MDMsMS4zODkzLDAuODg0LDExLjQ2NDgnXG4gIH0sXG4gIEVQU0dfNDY5MToge1xuICAgIHRvd2dzODQ6ICcyMTguNzY5LDE1MC43NSwxNzYuNzUsMy41MjMxLDIuMDAzNywxLjI4OCwxMC45ODE3J1xuICB9LFxuICBFUFNHXzQ2Mjk6IHtcbiAgICB0b3dnczg0OiAnNzIuNTEsMzQ1LjQxMSw3OS4yNDEsLTEuNTg2MiwtMC44ODI2LC0wLjU0OTUsMS4zNjUzJ1xuICB9LFxuICBFUFNHXzQ2MzA6IHtcbiAgICB0b3dnczg0OiAnMTY1LjgwNCwyMTYuMjEzLDE4MC4yNiwtMC42MjUxLC0wLjQ1MTUsLTAuMDcyMSw3LjQxMTEnXG4gIH0sXG4gIEVQU0dfNDY5Mjoge1xuICAgIHRvd2dzODQ6ICcyMTcuMTA5LDg2LjQ1MiwyMy43MTEsMC4wMTgzLC0wLjAwMDMsMC4wMDcsLTAuMDA5MydcbiAgfSxcbiAgRVBTR185MzMzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwLC04LjM5MywwLjc0OSwtMTAuMjc2LDAnXG4gIH0sXG4gIEVQU0dfOTA1OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MzEyOiB7XG4gICAgdG93Z3M4NDogJzYwMS43MDUsODQuMjYzLDQ4NS4yMjcsNC43MzU0LDEuMzE0NSw1LjM5MywtMi4zODg3J1xuICB9LFxuICBFUFNHXzQxMjM6IHtcbiAgICB0b3dnczg0OiAnLTk2LjA2MiwtODIuNDI4LC0xMjEuNzUzLDQuODAxLDAuMzQ1LC0xLjM3NiwxLjQ5NidcbiAgfSxcbiAgRVBTR180MzA5OiB7XG4gICAgdG93Z3M4NDogJy0xMjQuNDUsMTgzLjc0LDQ0LjY0LC0wLjQzODQsMC41NDQ2LC0wLjk3MDYsLTIuMTM2NSdcbiAgfSxcbiAgRVNSSV8xMDQxMDY6IHtcbiAgICB0b3dnczg0OiAnLTI4My4wODgsLTcwLjY5MywxMTcuNDQ1LC0xLjE1NywwLjA1OSwtMC42NTIsLTQuMDU4J1xuICB9LFxuICBFUFNHXzQyODE6IHtcbiAgICB0b3dnczg0OiAnLTIxOS4yNDcsLTczLjgwMiwyNjkuNTI5J1xuICB9LFxuICBFUFNHXzQzMjI6IHtcbiAgICB0b3dnczg0OiAnMCwwLDQuNSdcbiAgfSxcbiAgRVBTR180MzI0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwxLjknXG4gIH0sXG4gIEVQU0dfNDI4NDoge1xuICAgIHRvd2dzODQ6ICc0My44MjIsLTEwOC44NDIsLTExOS41ODUsMS40NTUsLTAuNzYxLDAuNzM3LDAuNTQ5J1xuICB9LFxuICBFUFNHXzQyNzc6IHtcbiAgICB0b3dnczg0OiAnNDQ2LjQ0OCwtMTI1LjE1Nyw1NDIuMDYsMC4xNSwwLjI0NywwLjg0MiwtMjAuNDg5J1xuICB9LFxuICBFUFNHXzQyMDc6IHtcbiAgICB0b3dnczg0OiAnLTI4Mi4xLC03Mi4yLDEyMCwtMS41MjksMC4xNDUsLTAuODksLTQuNDYnXG4gIH0sXG4gIEVQU0dfNDY4ODoge1xuICAgIHRvd2dzODQ6ICczNDcuMTc1LDEwNzcuNjE4LDI2MjMuNjc3LDMzLjkwNTgsLTcwLjY3NzYsOS40MDEzLDE4Ni4wNjQ3J1xuICB9LFxuICBFUFNHXzQ2ODk6IHtcbiAgICB0b3dnczg0OiAnNDEwLjc5Myw1NC41NDIsODAuNTAxLC0yLjU1OTYsLTIuMzUxNywtMC42NTk0LDE3LjMyMTgnXG4gIH0sXG4gIEVQU0dfNDcyMDoge1xuICAgIHRvd2dzODQ6ICcwLDAsNC41J1xuICB9LFxuICBFUFNHXzQyNzM6IHtcbiAgICB0b3dnczg0OiAnMjc4LjMsOTMsNDc0LjUsNy44ODksMC4wNSwtNi42MSw2LjIxJ1xuICB9LFxuICBFUFNHXzQyNDA6IHtcbiAgICB0b3dnczg0OiAnMjA0LjY0LDgzNC43NCwyOTMuOCdcbiAgfSxcbiAgRVBTR180ODE3OiB7XG4gICAgdG93Z3M4NDogJzI3OC4zLDkzLDQ3NC41LDcuODg5LDAuMDUsLTYuNjEsNi4yMSdcbiAgfSxcbiAgRVNSSV8xMDQxMzE6IHtcbiAgICB0b3dnczg0OiAnNDI2LjYyLDE0Mi42Miw0NjAuMDksNC45OCw0LjQ5LC0xMi40MiwtMTcuMSdcbiAgfSxcbiAgRVBTR180MjY1OiB7XG4gICAgdG93Z3M4NDogJy0xMDQuMSwtNDkuMSwtOS45LDAuOTcxLC0yLjkxNywwLjcxNCwtMTEuNjgnXG4gIH0sXG4gIEVQU0dfNDI2Mzoge1xuICAgIHRvd2dzODQ6ICctMTExLjkyLC04Ny44NSwxMTQuNSwxLjg3NSwwLjIwMiwwLjIxOSwwLjAzMidcbiAgfSxcbiAgRVBTR180Mjk4OiB7XG4gICAgdG93Z3M4NDogJy02ODkuNTkzNyw2MjMuODQwNDYsLTY1LjkzNTY2LC0wLjAyMzMxLDEuMTcwOTQsLTAuODAwNTQsNS44ODUzNidcbiAgfSxcbiAgRVBTR180MjcwOiB7XG4gICAgdG93Z3M4NDogJy0yNTMuNDM5MiwtMTQ4LjQ1MiwzODYuNTI2NywwLjE1NjA1LDAuNDMsLTAuMTAxMywtMC4wNDI0J1xuICB9LFxuICBFUFNHXzQyMjk6IHtcbiAgICB0b3dnczg0OiAnLTEyMS44LDk4LjEsLTEwLjcnXG4gIH0sXG4gIEVQU0dfNDIyMDoge1xuICAgIHRvd2dzODQ6ICctNTUuNSwtMzQ4LC0yMjkuMidcbiAgfSxcbiAgRVBTR180MjE0OiB7XG4gICAgdG93Z3M4NDogJzEyLjY0NiwtMTU1LjE3NiwtODAuODYzJ1xuICB9LFxuICBFUFNHXzQyMzI6IHtcbiAgICB0b3dnczg0OiAnLTM0NSwzLDIyMydcbiAgfSxcbiAgRVBTR180MjM4OiB7XG4gICAgdG93Z3M4NDogJy0xLjk3NywtMTMuMDYsLTkuOTkzLDAuMzY0LDAuMjU0LDAuNjg5LC0xLjAzNydcbiAgfSxcbiAgRVBTR180MTY4OiB7XG4gICAgdG93Z3M4NDogJy0xNzAsMzMsMzI2J1xuICB9LFxuICBFUFNHXzQxMzE6IHtcbiAgICB0b3dnczg0OiAnMTk5LDkzMSwzMTguOSdcbiAgfSxcbiAgRVBTR180MTUyOiB7XG4gICAgdG93Z3M4NDogJy0wLjkxMDIsMi4wMTQxLDAuNTYwMiwwLjAyOTAzOSwwLjAxMDA2NSwwLjAxMDEwMSwwJ1xuICB9LFxuICBFUFNHXzUyMjg6IHtcbiAgICB0b3dnczg0OiAnNTcyLjIxMyw4NS4zMzQsNDYxLjk0LDQuOTczMiwxLjUyOSw1LjI0ODQsMy41Mzc4J1xuICB9LFxuICBFUFNHXzgzNTE6IHtcbiAgICB0b3dnczg0OiAnNDg1LjAyMSwxNjkuNDY1LDQ4My44MzksNy43ODYzNDIsNC4zOTc1NTQsNC4xMDI2NTUsMCdcbiAgfSxcbiAgRVBTR180NjgzOiB7XG4gICAgdG93Z3M4NDogJy0xMjcuNjIsLTY3LjI0LC00Ny4wNCwtMy4wNjgsNC45MDMsMS41NzgsLTEuMDYnXG4gIH0sXG4gIEVQU0dfNDEzMzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR183MzczOiB7XG4gICAgdG93Z3M4NDogJzAuODE5LC0wLjU3NjIsLTEuNjQ0NiwtMC4wMDM3OCwtMC4wMzMxNywwLjAwMzE4LDAuMDY5MydcbiAgfSxcbiAgRVBTR185MDc1OiB7XG4gICAgdG93Z3M4NDogJy0wLjkxMDIsMi4wMTQxLDAuNTYwMiwwLjAyOTAzOSwwLjAxMDA2NSwwLjAxMDEwMSwwJ1xuICB9LFxuICBFUFNHXzkwNzI6IHtcbiAgICB0b3dnczg0OiAnLTAuOTEwMiwyLjAxNDEsMC41NjAyLDAuMDI5MDM5LDAuMDEwMDY1LDAuMDEwMTAxLDAnXG4gIH0sXG4gIEVQU0dfOTI5NDoge1xuICAgIHRvd2dzODQ6ICcxLjE2ODM1LC0xLjQyMDAxLC0yLjI0NDMxLC0wLjAwODIyLC0wLjA1NTA4LDAuMDE4MTgsMC4yMzM4OCdcbiAgfSxcbiAgRVBTR180MjEyOiB7XG4gICAgdG93Z3M4NDogJy0yNjcuNDM0LDE3My40OTYsMTgxLjgxNCwtMTMuNDcwNCw4LjcxNTQsNy4zOTI2LDE0Ljc0OTInXG4gIH0sXG4gIEVQU0dfNDE5MToge1xuICAgIHRvd2dzODQ6ICctNDQuMTgzLC0wLjU4LC0zOC40ODksMi4zODY3LDIuNzA3MiwtMy41MTk2LC04LjI3MDMnXG4gIH0sXG4gIEVQU0dfNDIzNzoge1xuICAgIHRvd2dzODQ6ICc1Mi42ODQsLTcxLjE5NCwtMTMuOTc1LC0wLjMxMiwtMC4xMDYzLC0wLjM3MjksMS4wMTkxJ1xuICB9LFxuICBFUFNHXzQ3NDA6IHtcbiAgICB0b3dnczg0OiAnLTEuMDgsLTAuMjcsLTAuOSdcbiAgfSxcbiAgRVBTR180MTI0OiB7XG4gICAgdG93Z3M4NDogJzQxOS4zODM2LDk5LjMzMzUsNTkxLjM0NTEsMC44NTAzODksMS44MTcyNzcsLTcuODYyMjM4LC0wLjk5NDk2J1xuICB9LFxuICBFUFNHXzU2ODE6IHtcbiAgICB0b3dnczg0OiAnNTg0Ljk2MzYsMTA3LjcxNzUsNDEzLjgwNjcsMS4xMTU1LDAuMjgyNCwtMy4xMzg0LDcuOTkyMidcbiAgfSxcbiAgRVBTR180MTQxOiB7XG4gICAgdG93Z3M4NDogJzIzLjc3MiwxNy40OSwxNy44NTksLTAuMzEzMiwtMS44NTI3NCwxLjY3Mjk5LC01LjQyNjInXG4gIH0sXG4gIEVQU0dfNDIwNDoge1xuICAgIHRvd2dzODQ6ICctODUuNjQ1LC0yNzMuMDc3LC03OS43MDgsMi4yODksLTEuNDIxLDIuNTMyLDMuMTk0J1xuICB9LFxuICBFUFNHXzQzMTk6IHtcbiAgICB0b3dnczg0OiAnMjI2LjcwMiwtMTkzLjMzNywtMzUuMzcxLC0yLjIyOSwtNC4zOTEsOS4yMzgsMC45Nzk4J1xuICB9LFxuICBFUFNHXzQyMDA6IHtcbiAgICB0b3dnczg0OiAnMjQuODIsLTEzMS4yMSwtODIuNjYnXG4gIH0sXG4gIEVQU0dfNDEzMDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTI3OiB7XG4gICAgdG93Z3M4NDogJy04Mi44NzUsLTU3LjA5NywtMTU2Ljc2OCwtMi4xNTgsMS41MjQsLTAuOTgyLC0wLjM1OSdcbiAgfSxcbiAgRVBTR180MTQ5OiB7XG4gICAgdG93Z3M4NDogJzY3NC4zNzQsMTUuMDU2LDQwNS4zNDYnXG4gIH0sXG4gIEVQU0dfNDYxNzoge1xuICAgIHRvd2dzODQ6ICctMC45OTEsMS45MDcyLDAuNTEyOSwxLjI1MDMzZS03LDQuNjc4NWUtOCw1LjY1MjllLTgsMCdcbiAgfSxcbiAgRVBTR180NjYzOiB7XG4gICAgdG93Z3M4NDogJy0yMTAuNTAyLC02Ni45MDIsLTQ4LjQ3NiwyLjA5NCwtMTUuMDY3LC01LjgxNywwLjQ4NSdcbiAgfSxcbiAgRVBTR180NjY0OiB7XG4gICAgdG93Z3M4NDogJy0yMTEuOTM5LDEzNy42MjYsNTguMywtMC4wODksMC4yNTEsMC4wNzksMC4zODQnXG4gIH0sXG4gIEVQU0dfNDY2NToge1xuICAgIHRvd2dzODQ6ICctMTA1Ljg1NCwxNjUuNTg5LC0zOC4zMTIsLTAuMDAzLC0wLjAyNiwwLjAyNCwtMC4wNDgnXG4gIH0sXG4gIEVQU0dfNDY2Njoge1xuICAgIHRvd2dzODQ6ICc2MzEuMzkyLC02Ni41NTEsNDgxLjQ0MiwxLjA5LC00LjQ0NSwtNC40ODcsLTQuNDMnXG4gIH0sXG4gIEVQU0dfNDc1Njoge1xuICAgIHRvd2dzODQ6ICctMTkyLjg3MywtMzkuMzgyLC0xMTEuMjAyLC0wLjAwMjA1LC0wLjAwMDUsMC4wMDMzNSwwLjAxODgnXG4gIH0sXG4gIEVQU0dfNDcyMzoge1xuICAgIHRvd2dzODQ6ICctMTc5LjQ4MywtNjkuMzc5LC0yNy41ODQsLTcuODYyLDguMTYzLDYuMDQyLC0xMy45MjUnXG4gIH0sXG4gIEVQU0dfNDcyNjoge1xuICAgIHRvd2dzODQ6ICc4Ljg1MywtNTIuNjQ0LDE4MC4zMDQsLTAuMzkzLC0yLjMyMywyLjk2LC0yNC4wODEnXG4gIH0sXG4gIEVQU0dfNDI2Nzoge1xuICAgIHRvd2dzODQ6ICctOC4wLDE2MC4wLDE3Ni4wJ1xuICB9LFxuICBFUFNHXzUzNjU6IHtcbiAgICB0b3dnczg0OiAnLTAuMTY5NTksMC4zNTMxMiwwLjUxODQ2LDAuMDMzODUsLTAuMTYzMjUsMC4wMzQ0NiwwLjAzNjkzJ1xuICB9LFxuICBFUFNHXzQyMTg6IHtcbiAgICB0b3dnczg0OiAnMzA0LjUsMzA2LjUsLTMxOC4xJ1xuICB9LFxuICBFUFNHXzQyNDI6IHtcbiAgICB0b3dnczg0OiAnLTMzLjcyMiwxNTMuNzg5LDk0Ljk1OSwtOC41ODEsLTQuNDc4LDQuNTQsOC45NSdcbiAgfSxcbiAgRVBTR180MjE2OiB7XG4gICAgdG93Z3M4NDogJy0yOTIuMjk1LDI0OC43NTgsNDI5LjQ0Nyw0Ljk5NzEsMi45OSw2LjY5MDYsMS4wMjg5J1xuICB9LFxuICBFU1JJXzEwNDEwNToge1xuICAgIHRvd2dzODQ6ICc2MzEuMzkyLC02Ni41NTEsNDgxLjQ0MiwxLjA5LC00LjQ0NSwtNC40ODcsLTQuNDMnXG4gIH0sXG4gIEVTUklfMTA0MTI5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2NzM6IHtcbiAgICB0b3dnczg0OiAnMTc0LjA1LC0yNS40OSwxMTIuNTcnXG4gIH0sXG4gIEVQU0dfNDIwMjoge1xuICAgIHRvd2dzODQ6ICctMTI0LC02MCwxNTQnXG4gIH0sXG4gIEVQU0dfNDIwMzoge1xuICAgIHRvd2dzODQ6ICctMTE3Ljc2MywtNTEuNTEsMTM5LjA2MSwwLjI5MiwwLjQ0MywwLjI3NywtMC4xOTEnXG4gIH0sXG4gIEVQU0dfMzgxOToge1xuICAgIHRvd2dzODQ6ICc1OTUuNDgsMTIxLjY5LDUxNS4zNSw0LjExNSwtMi45MzgzLDAuODUzLC0zLjQwOCdcbiAgfSxcbiAgRVBTR184Njk0OiB7XG4gICAgdG93Z3M4NDogJy05My43OTksLTEzMi43MzcsLTIxOS4wNzMsLTEuODQ0LDAuNjQ4LC02LjM3LC0wLjE2OSdcbiAgfSxcbiAgRVBTR180MTQ1OiB7XG4gICAgdG93Z3M4NDogJzI3NS41Nyw2NzYuNzgsMjI5LjYnXG4gIH0sXG4gIEVQU0dfNDI4Mzoge1xuICAgIHRvd2dzODQ6ICc2MS41NSwtMTAuODcsLTQwLjE5LDM5LjQ5MjQsMzIuNzIyMSwzMi44OTc5LC05Ljk5NCdcbiAgfSxcbiAgRVBTR180MzE3OiB7XG4gICAgdG93Z3M4NDogJzIuMzI4NywtMTQ3LjA0MjUsLTkyLjA4MDIsLTAuMzA5MjQ4MywwLjMyNDgyMTg1LDAuNDk3Mjk5MzQsNS42ODkwNjI2NidcbiAgfSxcbiAgRVBTR180MjcyOiB7XG4gICAgdG93Z3M4NDogJzU5LjQ3LC01LjA0LDE4Ny40NCwwLjQ3LC0wLjEsMS4wMjQsLTQuNTk5MydcbiAgfSxcbiAgRVBTR180MjQ4OiB7XG4gICAgdG93Z3M4NDogJy0zMDcuNywyNjUuMywtMzYzLjUnXG4gIH0sXG4gIEVQU0dfNTU2MToge1xuICAgIHRvd2dzODQ6ICcyNCwtMTIxLC03NidcbiAgfSxcbiAgRVBTR181MjMzOiB7XG4gICAgdG93Z3M4NDogJy0wLjI5Myw3NjYuOTUsODcuNzEzLDAuMTk1NzA0LDEuNjk1MDY4LDMuNDczMDE2LC0wLjAzOTMzOCdcbiAgfSxcbiAgRVNSSV8xMDQxMzA6IHtcbiAgICB0b3dnczg0OiAnLTg2LC05OCwtMTE5J1xuICB9LFxuICBFU1JJXzEwNDEwMjoge1xuICAgIHRvd2dzODQ6ICc2ODIsLTIwMyw0ODAnXG4gIH0sXG4gIEVTUklfMzcyMDc6IHtcbiAgICB0b3dnczg0OiAnNywtMTAsLTI2J1xuICB9LFxuICBFUFNHXzQ2NzU6IHtcbiAgICB0b3dnczg0OiAnNTkuOTM1LDExOC40LC0xMC44NzEnXG4gIH0sXG4gIEVTUklfMTA0MTA5OiB7XG4gICAgdG93Z3M4NDogJy04OS4xMjEsLTM0OC4xODIsMjYwLjg3MSdcbiAgfSxcbiAgRVNSSV8xMDQxMTI6IHtcbiAgICB0b3dnczg0OiAnLTE4NS41ODMsLTIzMC4wOTYsMjgxLjM2MSdcbiAgfSxcbiAgRVNSSV8xMDQxMTM6IHtcbiAgICB0b3dnczg0OiAnMjUuMSwtMjc1LjYsMjIyLjYnXG4gIH0sXG4gIElHTkZfV0dTNzJHOiB7XG4gICAgdG93Z3M4NDogJzAsMTIsNidcbiAgfSxcbiAgSUdORl9OVEZHOiB7XG4gICAgdG93Z3M4NDogJy0xNjgsLTYwLDMyMCdcbiAgfSxcbiAgSUdORl9FRkFURTU3Rzoge1xuICAgIHRvd2dzODQ6ICctMTI3LC03NjksNDcyJ1xuICB9LFxuICBJR05GX1BHUDUwRzoge1xuICAgIHRvd2dzODQ6ICczMjQuOCwxNTMuNiwxNzIuMSdcbiAgfSxcbiAgSUdORl9SRVVONDdHOiB7XG4gICAgdG93Z3M4NDogJzk0LC05NDgsLTEyNjInXG4gIH0sXG4gIElHTkZfQ1NHNjdHOiB7XG4gICAgdG93Z3M4NDogJy0xODYsMjMwLDExMCdcbiAgfSxcbiAgSUdORl9HVUFENDhHOiB7XG4gICAgdG93Z3M4NDogJy00NjcsLTE2LC0zMDAnXG4gIH0sXG4gIElHTkZfVEFISTUxRzoge1xuICAgIHRvd2dzODQ6ICcxNjIsMTE3LDE1NCdcbiAgfSxcbiAgSUdORl9UQUhBQUc6IHtcbiAgICB0b3dnczg0OiAnNjUsMzQyLDc3J1xuICB9LFxuICBJR05GX05VS1U3Mkc6IHtcbiAgICB0b3dnczg0OiAnODQsMjc0LDY1J1xuICB9LFxuICBJR05GX1BFVFJFTFM3Mkc6IHtcbiAgICB0b3dnczg0OiAnMzY1LDE5NCwxNjYnXG4gIH0sXG4gIElHTkZfV0FMTDc4Rzoge1xuICAgIHRvd2dzODQ6ICcyNTMsLTEzMywtMTI3J1xuICB9LFxuICBJR05GX01BWU81MEc6IHtcbiAgICB0b3dnczg0OiAnLTM4MiwtNTksLTI2MidcbiAgfSxcbiAgSUdORl9UQU5OQUc6IHtcbiAgICB0b3dnczg0OiAnLTEzOSwtOTY3LDQzNidcbiAgfSxcbiAgSUdORl9JR043Mkc6IHtcbiAgICB0b3dnczg0OiAnLTEzLC0zNDgsMjkyJ1xuICB9LFxuICBJR05GX0FUSUdHOiB7XG4gICAgdG93Z3M4NDogJzExMTgsMjMsNjYnXG4gIH0sXG4gIElHTkZfRkFOR0E4NEc6IHtcbiAgICB0b3dnczg0OiAnMTUwLjU3LDE1OC4zMywxMTguMzInXG4gIH0sXG4gIElHTkZfUlVTQVQ4NEc6IHtcbiAgICB0b3dnczg0OiAnMjAyLjEzLDE3NC42LC0xNS43NCdcbiAgfSxcbiAgSUdORl9LQVVFNzBHOiB7XG4gICAgdG93Z3M4NDogJzEyNi43NCwzMDAuMSwtNzUuNDknXG4gIH0sXG4gIElHTkZfTU9QOTBHOiB7XG4gICAgdG93Z3M4NDogJy0xMC44LC0xLjgsMTIuNzcnXG4gIH0sXG4gIElHTkZfTUhQRjY3Rzoge1xuICAgIHRvd2dzODQ6ICczMzguMDgsMjEyLjU4LC0yOTYuMTcnXG4gIH0sXG4gIElHTkZfVEFISTc5Rzoge1xuICAgIHRvd2dzODQ6ICcxNjAuNjEsMTE2LjA1LDE1My42OSdcbiAgfSxcbiAgSUdORl9BTkFBOTJHOiB7XG4gICAgdG93Z3M4NDogJzEuNSwzLjg0LDQuODEnXG4gIH0sXG4gIElHTkZfTUFSUVVJNzJHOiB7XG4gICAgdG93Z3M4NDogJzMzMC45MSwtMTMuOTIsNTguNTYnXG4gIH0sXG4gIElHTkZfQVBBVDg2Rzoge1xuICAgIHRvd2dzODQ6ICcxNDMuNiwxOTcuODIsNzQuMDUnXG4gIH0sXG4gIElHTkZfVFVCVTY5Rzoge1xuICAgIHRvd2dzODQ6ICcyMzcuMTcsMTcxLjYxLC03Ny44NCdcbiAgfSxcbiAgSUdORl9TVFBNNTBHOiB7XG4gICAgdG93Z3M4NDogJzExLjM2Myw0MjQuMTQ4LDM3My4xMydcbiAgfSxcbiAgRVBTR180MTUwOiB7XG4gICAgdG93Z3M4NDogJzY3NC4zNzQsMTUuMDU2LDQwNS4zNDYnXG4gIH0sXG4gIEVQU0dfNDc1NDoge1xuICAgIHRvd2dzODQ6ICctMjA4LjQwNTgsLTEwOS44Nzc3LC0yLjU3NjQnXG4gIH0sXG4gIEVTUklfMTA0MTAxOiB7XG4gICAgdG93Z3M4NDogJzM3NCwxNTAsNTg4J1xuICB9LFxuICBFUFNHXzQ2OTM6IHtcbiAgICB0b3dnczg0OiAnMCwtMC4xNSwwLjY4J1xuICB9LFxuICBFUFNHXzYyMDc6IHtcbiAgICB0b3dnczg0OiAnMjkzLjE3LDcyNi4xOCwyNDUuMzYnXG4gIH0sXG4gIEVQU0dfNDE1Mzoge1xuICAgIHRvd2dzODQ6ICctMTMzLjYzLC0xNTcuNSwtMTU4LjYyJ1xuICB9LFxuICBFUFNHXzQxMzI6IHtcbiAgICB0b3dnczg0OiAnLTI0MS41NCwtMTYzLjY0LDM5Ni4wNidcbiAgfSxcbiAgRVBTR180MjIxOiB7XG4gICAgdG93Z3M4NDogJy0xNTQuNSwxNTAuNywxMDAuNCdcbiAgfSxcbiAgRVBTR180MjY2OiB7XG4gICAgdG93Z3M4NDogJy04MC43LC0xMzIuNSw0MS4xJ1xuICB9LFxuICBFUFNHXzQxOTM6IHtcbiAgICB0b3dnczg0OiAnLTcwLjksLTE1MS44LC00MS40J1xuICB9LFxuICBFUFNHXzUzNDA6IHtcbiAgICB0b3dnczg0OiAnLTAuNDEsMC40NiwtMC4zNSdcbiAgfSxcbiAgRVBTR180MjQ2OiB7XG4gICAgdG93Z3M4NDogJy0yOTQuNywtMjAwLjEsNTI1LjUnXG4gIH0sXG4gIEVQU0dfNDMxODoge1xuICAgIHRvd2dzODQ6ICctMy4yLC01LjcsMi44J1xuICB9LFxuICBFUFNHXzQxMjE6IHtcbiAgICB0b3dnczg0OiAnLTE5OS44Nyw3NC43OSwyNDYuNjInXG4gIH0sXG4gIEVQU0dfNDIyMzoge1xuICAgIHRvd2dzODQ6ICctMjYwLjEsNS41LDQzMi4yJ1xuICB9LFxuICBFUFNHXzQxNTg6IHtcbiAgICB0b3dnczg0OiAnLTAuNDY1LDM3Mi4wOTUsMTcxLjczNidcbiAgfSxcbiAgRVBTR180Mjg1OiB7XG4gICAgdG93Z3M4NDogJy0xMjguMTYsLTI4Mi40MiwyMS45MydcbiAgfSxcbiAgRVBTR180NjEzOiB7XG4gICAgdG93Z3M4NDogJy00MDQuNzgsNjg1LjY4LDQ1LjQ3J1xuICB9LFxuICBFUFNHXzQ2MDc6IHtcbiAgICB0b3dnczg0OiAnMTk1LjY3MSwzMzIuNTE3LDI3NC42MDcnXG4gIH0sXG4gIEVQU0dfNDQ3NToge1xuICAgIHRvd2dzODQ6ICctMzgxLjc4OCwtNTcuNTAxLC0yNTYuNjczJ1xuICB9LFxuICBFUFNHXzQyMDg6IHtcbiAgICB0b3dnczg0OiAnLTE1Ny44NCwzMDguNTQsLTE0Ni42J1xuICB9LFxuICBFUFNHXzQ3NDM6IHtcbiAgICB0b3dnczg0OiAnNzAuOTk1LC0zMzUuOTE2LDI2Mi44OTgnXG4gIH0sXG4gIEVQU0dfNDcxMDoge1xuICAgIHRvd2dzODQ6ICctMzIzLjY1LDU1MS4zOSwtNDkxLjIyJ1xuICB9LFxuICBFUFNHXzc4ODE6IHtcbiAgICB0b3dnczg0OiAnLTAuMDc3LDAuMDc5LDAuMDg2J1xuICB9LFxuICBFUFNHXzQ2ODI6IHtcbiAgICB0b3dnczg0OiAnMjgzLjcyOSw3MzUuOTQyLDI2MS4xNDMnXG4gIH0sXG4gIEVQU0dfNDczOToge1xuICAgIHRvd2dzODQ6ICctMTU2LC0yNzEsLTE4OSdcbiAgfSxcbiAgRVBTR180Njc5OiB7XG4gICAgdG93Z3M4NDogJy04MC4wMSwyNTMuMjYsMjkxLjE5J1xuICB9LFxuICBFUFNHXzQ3NTA6IHtcbiAgICB0b3dnczg0OiAnLTU2LjI2MywxNi4xMzYsLTIyLjg1NidcbiAgfSxcbiAgRVBTR180NjQ0OiB7XG4gICAgdG93Z3M4NDogJy0xMC4xOCwtMzUwLjQzLDI5MS4zNydcbiAgfSxcbiAgRVBTR180Njk1OiB7XG4gICAgdG93Z3M4NDogJy0xMDMuNzQ2LC05LjYxNCwtMjU1Ljk1J1xuICB9LFxuICBFUFNHXzQyOTI6IHtcbiAgICB0b3dnczg0OiAnLTM1NSwyMSw3MidcbiAgfSxcbiAgRVBTR180MzAyOiB7XG4gICAgdG93Z3M4NDogJy02MS43MDIsMjg0LjQ4OCw0NzIuMDUyJ1xuICB9LFxuICBFUFNHXzQxNDM6IHtcbiAgICB0b3dnczg0OiAnLTEyNC43Niw1Myw0NjYuNzknXG4gIH0sXG4gIEVQU0dfNDYwNjoge1xuICAgIHRvd2dzODQ6ICctMTUzLDE1MywzMDcnXG4gIH0sXG4gIEVQU0dfNDY5OToge1xuICAgIHRvd2dzODQ6ICctNzcwLjEsMTU4LjQsLTQ5OC4yJ1xuICB9LFxuICBFUFNHXzQyNDc6IHtcbiAgICB0b3dnczg0OiAnLTI3My41LDExMC42LC0zNTcuOSdcbiAgfSxcbiAgRVBTR180MTYwOiB7XG4gICAgdG93Z3M4NDogJzguODgsMTg0Ljg2LDEwNi42OSdcbiAgfSxcbiAgRVBTR180MTYxOiB7XG4gICAgdG93Z3M4NDogJy0yMzMuNDMsNi42NSwxNzMuNjQnXG4gIH0sXG4gIEVQU0dfOTI1MToge1xuICAgIHRvd2dzODQ6ICctOS41LDEyMi45LDEzOC4yJ1xuICB9LFxuICBFUFNHXzkyNTM6IHtcbiAgICB0b3dnczg0OiAnLTc4LjEsMTAxLjYsMTMzLjMnXG4gIH0sXG4gIEVQU0dfNDI5Nzoge1xuICAgIHRvd2dzODQ6ICctMTk4LjM4MywtMjQwLjUxNywtMTA3LjkwOSdcbiAgfSxcbiAgRVBTR180MjY5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQzMDE6IHtcbiAgICB0b3dnczg0OiAnLTE0Nyw1MDYsNjg3J1xuICB9LFxuICBFUFNHXzQ2MTg6IHtcbiAgICB0b3dnczg0OiAnLTU5LC0xMSwtNTInXG4gIH0sXG4gIEVQU0dfNDYxMjoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180Njc4OiB7XG4gICAgdG93Z3M4NDogJzQ0LjU4NSwtMTMxLjIxMiwtMzkuNTQ0J1xuICB9LFxuICBFUFNHXzQyNTA6IHtcbiAgICB0b3dnczg0OiAnLTEzMCwyOSwzNjQnXG4gIH0sXG4gIEVQU0dfNDE0NDoge1xuICAgIHRvd2dzODQ6ICcyMTQsODA0LDI2OCdcbiAgfSxcbiAgRVBTR180MTQ3OiB7XG4gICAgdG93Z3M4NDogJy0xNy41MSwtMTA4LjMyLC02Mi4zOSdcbiAgfSxcbiAgRVBTR180MjU5OiB7XG4gICAgdG93Z3M4NDogJy0yNTQuMSwtNS4zNiwtMTAwLjI5J1xuICB9LFxuICBFUFNHXzQxNjQ6IHtcbiAgICB0b3dnczg0OiAnLTc2LC0xMzgsNjcnXG4gIH0sXG4gIEVQU0dfNDIxMToge1xuICAgIHRvd2dzODQ6ICctMzc4Ljg3Myw2NzYuMDAyLC00Ni4yNTUnXG4gIH0sXG4gIEVQU0dfNDE4Mjoge1xuICAgIHRvd2dzODQ6ICctNDIyLjY1MSwtMTcyLjk5NSw4NC4wMidcbiAgfSxcbiAgRVBTR180MjI0OiB7XG4gICAgdG93Z3M4NDogJy0xNDMuODcsMjQzLjM3LC0zMy41MidcbiAgfSxcbiAgRVBTR180MjI1OiB7XG4gICAgdG93Z3M4NDogJy0yMDUuNTcsMTY4Ljc3LC00LjEyJ1xuICB9LFxuICBFUFNHXzU1Mjc6IHtcbiAgICB0b3dnczg0OiAnLTY3LjM1LDMuODgsLTM4LjIyJ1xuICB9LFxuICBFUFNHXzQ3NTI6IHtcbiAgICB0b3dnczg0OiAnOTgsMzkwLC0yMidcbiAgfSxcbiAgRVBTR180MzEwOiB7XG4gICAgdG93Z3M4NDogJy0zMCwxOTAsODknXG4gIH0sXG4gIEVQU0dfOTI0ODoge1xuICAgIHRvd2dzODQ6ICctMTkyLjI2LDY1LjcyLDEzMi4wOCdcbiAgfSxcbiAgRVBTR180NjgwOiB7XG4gICAgdG93Z3M4NDogJzEyNC41LC02My41LC0yODEnXG4gIH0sXG4gIEVQU0dfNDcwMToge1xuICAgIHRvd2dzODQ6ICctNzkuOSwtMTU4LC0xNjguOSdcbiAgfSxcbiAgRVBTR180NzA2OiB7XG4gICAgdG93Z3M4NDogJy0xNDYuMjEsMTEyLjYzLDQuMDUnXG4gIH0sXG4gIEVQU0dfNDgwNToge1xuICAgIHRvd2dzODQ6ICc2ODIsLTIwMyw0ODAnXG4gIH0sXG4gIEVQU0dfNDIwMToge1xuICAgIHRvd2dzODQ6ICctMTY1LC0xMSwyMDYnXG4gIH0sXG4gIEVQU0dfNDIxMDoge1xuICAgIHRvd2dzODQ6ICctMTU3LC0yLC0yOTknXG4gIH0sXG4gIEVQU0dfNDE4Mzoge1xuICAgIHRvd2dzODQ6ICctMTA0LDE2NywtMzgnXG4gIH0sXG4gIEVQU0dfNDEzOToge1xuICAgIHRvd2dzODQ6ICcxMSw3MiwtMTAxJ1xuICB9LFxuICBFUFNHXzQ2Njg6IHtcbiAgICB0b3dnczg0OiAnLTg2LC05OCwtMTE5J1xuICB9LFxuICBFUFNHXzQ3MTc6IHtcbiAgICB0b3dnczg0OiAnLTIsMTUxLDE4MSdcbiAgfSxcbiAgRVBTR180NzMyOiB7XG4gICAgdG93Z3M4NDogJzEwMiw1MiwtMzgnXG4gIH0sXG4gIEVQU0dfNDI4MDoge1xuICAgIHRvd2dzODQ6ICctMzc3LDY4MSwtNTAnXG4gIH0sXG4gIEVQU0dfNDIwOToge1xuICAgIHRvd2dzODQ6ICctMTM4LC0xMDUsLTI4OSdcbiAgfSxcbiAgRVBTR180MjYxOiB7XG4gICAgdG93Z3M4NDogJzMxLDE0Niw0NydcbiAgfSxcbiAgRVBTR180NjU4OiB7XG4gICAgdG93Z3M4NDogJy03Myw0NiwtODYnXG4gIH0sXG4gIEVQU0dfNDcyMToge1xuICAgIHRvd2dzODQ6ICcyNjUuMDI1LDM4NC45MjksLTE5NC4wNDYnXG4gIH0sXG4gIEVQU0dfNDIyMjoge1xuICAgIHRvd2dzODQ6ICctMTM2LC0xMDgsLTI5MidcbiAgfSxcbiAgRVBTR180NjAxOiB7XG4gICAgdG93Z3M4NDogJy0yNTUsLTE1LDcxJ1xuICB9LFxuICBFUFNHXzQ2MDI6IHtcbiAgICB0b3dnczg0OiAnNzI1LDY4NSw1MzYnXG4gIH0sXG4gIEVQU0dfNDYwMzoge1xuICAgIHRvd2dzODQ6ICc3MiwyMTMuNyw5MydcbiAgfSxcbiAgRVBTR180NjA1OiB7XG4gICAgdG93Z3M4NDogJzksMTgzLDIzNidcbiAgfSxcbiAgRVBTR180NjIxOiB7XG4gICAgdG93Z3M4NDogJzEzNywyNDgsLTQzMCdcbiAgfSxcbiAgRVBTR180NjU3OiB7XG4gICAgdG93Z3M4NDogJy0yOCwxOTksNSdcbiAgfSxcbiAgRVBTR180MzE2OiB7XG4gICAgdG93Z3M4NDogJzEwMy4yNSwtMTAwLjQsLTMwNy4xOSdcbiAgfSxcbiAgRVBTR180NjQyOiB7XG4gICAgdG93Z3M4NDogJy0xMywtMzQ4LDI5MidcbiAgfSxcbiAgRVBTR180Njk4OiB7XG4gICAgdG93Z3M4NDogJzE0NSwtMTg3LDEwMydcbiAgfSxcbiAgRVBTR180MTkyOiB7XG4gICAgdG93Z3M4NDogJy0yMDYuMSwtMTc0LjcsLTg3LjcnXG4gIH0sXG4gIEVQU0dfNDMxMToge1xuICAgIHRvd2dzODQ6ICctMjY1LDEyMCwtMzU4J1xuICB9LFxuICBFUFNHXzQxMzU6IHtcbiAgICB0b3dnczg0OiAnNTgsLTI4MywtMTgyJ1xuICB9LFxuICBFU1JJXzEwNDEzODoge1xuICAgIHRvd2dzODQ6ICcxOTgsLTIyNiwtMzQ3J1xuICB9LFxuICBFUFNHXzQyNDU6IHtcbiAgICB0b3dnczg0OiAnLTExLDg1MSw1J1xuICB9LFxuICBFUFNHXzQxNDI6IHtcbiAgICB0b3dnczg0OiAnLTEyNSw1Myw0NjcnXG4gIH0sXG4gIEVQU0dfNDIxMzoge1xuICAgIHRvd2dzODQ6ICctMTA2LC04NywxODgnXG4gIH0sXG4gIEVQU0dfNDI1Mzoge1xuICAgIHRvd2dzODQ6ICctMTMzLC03NywtNTEnXG4gIH0sXG4gIEVQU0dfNDEyOToge1xuICAgIHRvd2dzODQ6ICctMTMyLC0xMTAsLTMzNSdcbiAgfSxcbiAgRVBTR180NzEzOiB7XG4gICAgdG93Z3M4NDogJy03NywtMTI4LDE0MidcbiAgfSxcbiAgRVBTR180MjM5OiB7XG4gICAgdG93Z3M4NDogJzIxNyw4MjMsMjk5J1xuICB9LFxuICBFUFNHXzQxNDY6IHtcbiAgICB0b3dnczg0OiAnMjk1LDczNiwyNTcnXG4gIH0sXG4gIEVQU0dfNDE1NToge1xuICAgIHRvd2dzODQ6ICctODMsMzcsMTI0J1xuICB9LFxuICBFUFNHXzQxNjU6IHtcbiAgICB0b3dnczg0OiAnLTE3MywyNTMsMjcnXG4gIH0sXG4gIEVQU0dfNDY3Mjoge1xuICAgIHRvd2dzODQ6ICcxNzUsLTM4LDExMydcbiAgfSxcbiAgRVBTR180MjM2OiB7XG4gICAgdG93Z3M4NDogJy02MzcsLTU0OSwtMjAzJ1xuICB9LFxuICBFUFNHXzQyNTE6IHtcbiAgICB0b3dnczg0OiAnLTkwLDQwLDg4J1xuICB9LFxuICBFUFNHXzQyNzE6IHtcbiAgICB0b3dnczg0OiAnLTIsMzc0LDE3MidcbiAgfSxcbiAgRVBTR180MTc1OiB7XG4gICAgdG93Z3M4NDogJy04OCw0LDEwMSdcbiAgfSxcbiAgRVBTR180NzE2OiB7XG4gICAgdG93Z3M4NDogJzI5OCwtMzA0LC0zNzUnXG4gIH0sXG4gIEVQU0dfNDMxNToge1xuICAgIHRvd2dzODQ6ICctMjMsMjU5LC05J1xuICB9LFxuICBFUFNHXzQ3NDQ6IHtcbiAgICB0b3dnczg0OiAnLTI0Mi4yLC0xNDQuOSwzNzAuMydcbiAgfSxcbiAgRVBTR180MjQ0OiB7XG4gICAgdG93Z3M4NDogJy05Nyw3ODcsODYnXG4gIH0sXG4gIEVQU0dfNDI5Mzoge1xuICAgIHRvd2dzODQ6ICc2MTYsOTcsLTI1MSdcbiAgfSxcbiAgRVBTR180NzE0OiB7XG4gICAgdG93Z3M4NDogJy0xMjcsLTc2OSw0NzInXG4gIH0sXG4gIEVQU0dfNDczNjoge1xuICAgIHRvd2dzODQ6ICcyNjAsMTIsLTE0NydcbiAgfSxcbiAgRVBTR182ODgzOiB7XG4gICAgdG93Z3M4NDogJy0yMzUsLTExMCwzOTMnXG4gIH0sXG4gIEVQU0dfNjg5NDoge1xuICAgIHRvd2dzODQ6ICctNjMsMTc2LDE4NSdcbiAgfSxcbiAgRVBTR180MjA1OiB7XG4gICAgdG93Z3M4NDogJy00MywtMTYzLDQ1J1xuICB9LFxuICBFUFNHXzQyNTY6IHtcbiAgICB0b3dnczg0OiAnNDEsLTIyMCwtMTM0J1xuICB9LFxuICBFUFNHXzQyNjI6IHtcbiAgICB0b3dnczg0OiAnNjM5LDQwNSw2MCdcbiAgfSxcbiAgRVBTR180NjA0OiB7XG4gICAgdG93Z3M4NDogJzE3NCwzNTksMzY1J1xuICB9LFxuICBFUFNHXzQxNjk6IHtcbiAgICB0b3dnczg0OiAnLTExNSwxMTgsNDI2J1xuICB9LFxuICBFUFNHXzQ2MjA6IHtcbiAgICB0b3dnczg0OiAnLTEwNiwtMTI5LDE2NSdcbiAgfSxcbiAgRVBTR180MTg0OiB7XG4gICAgdG93Z3M4NDogJy0yMDMsMTQxLDUzJ1xuICB9LFxuICBFUFNHXzQ2MTY6IHtcbiAgICB0b3dnczg0OiAnLTI4OSwtMTI0LDYwJ1xuICB9LFxuICBFUFNHXzk0MDM6IHtcbiAgICB0b3dnczg0OiAnLTMwNywtOTIsMTI3J1xuICB9LFxuICBFUFNHXzQ2ODQ6IHtcbiAgICB0b3dnczg0OiAnLTEzMywtMzIxLDUwJ1xuICB9LFxuICBFUFNHXzQ3MDg6IHtcbiAgICB0b3dnczg0OiAnLTQ5MSwtMjIsNDM1J1xuICB9LFxuICBFUFNHXzQ3MDc6IHtcbiAgICB0b3dnczg0OiAnMTE0LC0xMTYsLTMzMydcbiAgfSxcbiAgRVBTR180NzA5OiB7XG4gICAgdG93Z3M4NDogJzE0NSw3NSwtMjcyJ1xuICB9LFxuICBFUFNHXzQ3MTI6IHtcbiAgICB0b3dnczg0OiAnLTIwNSwxMDcsNTMnXG4gIH0sXG4gIEVQU0dfNDcxMToge1xuICAgIHRvd2dzODQ6ICcxMjQsLTIzNCwtMjUnXG4gIH0sXG4gIEVQU0dfNDcxODoge1xuICAgIHRvd2dzODQ6ICcyMzAsLTE5OSwtNzUyJ1xuICB9LFxuICBFUFNHXzQ3MTk6IHtcbiAgICB0b3dnczg0OiAnMjExLDE0NywxMTEnXG4gIH0sXG4gIEVQU0dfNDcyNDoge1xuICAgIHRvd2dzODQ6ICcyMDgsLTQzNSwtMjI5J1xuICB9LFxuICBFUFNHXzQ3MjU6IHtcbiAgICB0b3dnczg0OiAnMTg5LC03OSwtMjAyJ1xuICB9LFxuICBFUFNHXzQ3MzU6IHtcbiAgICB0b3dnczg0OiAnNjQ3LDE3NzcsLTExMjQnXG4gIH0sXG4gIEVQU0dfNDcyMjoge1xuICAgIHRvd2dzODQ6ICctNzk0LDExOSwtMjk4J1xuICB9LFxuICBFUFNHXzQ3Mjg6IHtcbiAgICB0b3dnczg0OiAnLTMwNywtOTIsMTI3J1xuICB9LFxuICBFUFNHXzQ3MzQ6IHtcbiAgICB0b3dnczg0OiAnLTYzMiw0MzgsLTYwOSdcbiAgfSxcbiAgRVBTR180NzI3OiB7XG4gICAgdG93Z3M4NDogJzkxMiwtNTgsMTIyNydcbiAgfSxcbiAgRVBTR180NzI5OiB7XG4gICAgdG93Z3M4NDogJzE4NSwxNjUsNDInXG4gIH0sXG4gIEVQU0dfNDczMDoge1xuICAgIHRvd2dzODQ6ICcxNzAsNDIsODQnXG4gIH0sXG4gIEVQU0dfNDczMzoge1xuICAgIHRvd2dzODQ6ICcyNzYsLTU3LDE0OSdcbiAgfSxcbiAgRVNSSV8zNzIxODoge1xuICAgIHRvd2dzODQ6ICcyMzAsLTE5OSwtNzUyJ1xuICB9LFxuICBFU1JJXzM3MjQwOiB7XG4gICAgdG93Z3M4NDogJy03LDIxNSwyMjUnXG4gIH0sXG4gIEVTUklfMzcyMjE6IHtcbiAgICB0b3dnczg0OiAnMjUyLC0yMDksLTc1MSdcbiAgfSxcbiAgRVNSSV80MzA1OiB7XG4gICAgdG93Z3M4NDogJy0xMjMsLTIwNiwyMTknXG4gIH0sXG4gIEVTUklfMTA0MTM5OiB7XG4gICAgdG93Z3M4NDogJy03MywtMjQ3LDIyNydcbiAgfSxcbiAgRVBTR180NzQ4OiB7XG4gICAgdG93Z3M4NDogJzUxLDM5MSwtMzYnXG4gIH0sXG4gIEVQU0dfNDIxOToge1xuICAgIHRvd2dzODQ6ICctMzg0LDY2NCwtNDgnXG4gIH0sXG4gIEVQU0dfNDI1NToge1xuICAgIHRvd2dzODQ6ICctMzMzLC0yMjIsMTE0J1xuICB9LFxuICBFUFNHXzQyNTc6IHtcbiAgICB0b3dnczg0OiAnLTU4Ny44LDUxOS43NSwxNDUuNzYnXG4gIH0sXG4gIEVQU0dfNDY0Njoge1xuICAgIHRvd2dzODQ6ICctOTYzLDUxMCwtMzU5J1xuICB9LFxuICBFUFNHXzY4ODE6IHtcbiAgICB0b3dnczg0OiAnLTI0LC0yMDMsMjY4J1xuICB9LFxuICBFUFNHXzY4ODI6IHtcbiAgICB0b3dnczg0OiAnLTE4MywtMTUsMjczJ1xuICB9LFxuICBFUFNHXzQ3MTU6IHtcbiAgICB0b3dnczg0OiAnLTEwNCwtMTI5LDIzOSdcbiAgfSxcbiAgSUdORl9SR0Y5M0dERDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9SR00wNEdERDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9SR1NQTTA2R0REOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX1JHVEFBRjA3R0REOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX1JHRkc5NUdERDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9SR05DRzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgSUdORl9SR1BGR0REOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBJR05GX0VUUlM4OUc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIElHTkZfUkdSOTJHREQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE3Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTgwOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2MTk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY2Nzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MDc1OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzY3MDY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNzc5ODoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NjYxOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2Njk6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfODY4NToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTUxOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzk3MDI6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc1ODoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzYxOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NjU6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfODk5Nzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MDIzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2NzA6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDY5NDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTQ4OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNjM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE2Nzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTg5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxOTA6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDE3Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NjU5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzM4MjQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfMzg4OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MDQ2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQwODE6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDU1ODoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NDgzOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUwMTM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTI2NDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MzI0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUzNTQ6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTM3MToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181MzczOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUzODE6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTM5Mzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR181NDg5OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzU1OTM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNjEzNToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR182MzY1OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzUyNDY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNzg4Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR184NDMxOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzg0Mjc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfODY5OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR184ODE4OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NTc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfOTE0MDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR184MDg2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ2ODY6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDczNzoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzAyOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NDc6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc0OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180Njc0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NTU6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc1OToge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180NzYyOiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ3NjM6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNDc2NDoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR180MTY2OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQxNzA6IHtcbiAgICB0b3dnczg0OiAnMCwwLDAnXG4gIH0sXG4gIEVQU0dfNTU0Njoge1xuICAgIHRvd2dzODQ6ICcwLDAsMCdcbiAgfSxcbiAgRVBTR183ODQ0OiB7XG4gICAgdG93Z3M4NDogJzAsMCwwJ1xuICB9LFxuICBFUFNHXzQ4MTg6IHtcbiAgICB0b3dnczg0OiAnNTg5LDc2LDQ4MCdcbiAgfVxufTtcblxuZm9yICh2YXIga2V5IGluIGRhdHVtcykge1xuICB2YXIgZGF0dW0gPSBkYXR1bXNba2V5XTtcbiAgaWYgKCFkYXR1bS5kYXR1bU5hbWUpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuICBkYXR1bXNbZGF0dW0uZGF0dW1OYW1lXSA9IGRhdHVtO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkYXR1bXM7XG4iLCJ2YXIgZWxsaXBzb2lkcyA9IHtcbiAgTUVSSVQ6IHtcbiAgICBhOiA2Mzc4MTM3LFxuICAgIHJmOiAyOTguMjU3LFxuICAgIGVsbGlwc2VOYW1lOiAnTUVSSVQgMTk4MydcbiAgfSxcbiAgU0dTODU6IHtcbiAgICBhOiA2Mzc4MTM2LFxuICAgIHJmOiAyOTguMjU3LFxuICAgIGVsbGlwc2VOYW1lOiAnU292aWV0IEdlb2RldGljIFN5c3RlbSA4NSdcbiAgfSxcbiAgR1JTODA6IHtcbiAgICBhOiA2Mzc4MTM3LFxuICAgIHJmOiAyOTguMjU3MjIyMTAxLFxuICAgIGVsbGlwc2VOYW1lOiAnR1JTIDE5ODAoSVVHRywgMTk4MCknXG4gIH0sXG4gIElBVTc2OiB7XG4gICAgYTogNjM3ODE0MCxcbiAgICByZjogMjk4LjI1NyxcbiAgICBlbGxpcHNlTmFtZTogJ0lBVSAxOTc2J1xuICB9LFxuICBhaXJ5OiB7XG4gICAgYTogNjM3NzU2My4zOTYsXG4gICAgYjogNjM1NjI1Ni45MSxcbiAgICBlbGxpcHNlTmFtZTogJ0FpcnkgMTgzMCdcbiAgfSxcbiAgQVBMNDoge1xuICAgIGE6IDYzNzgxMzcsXG4gICAgcmY6IDI5OC4yNSxcbiAgICBlbGxpcHNlTmFtZTogJ0FwcGwuIFBoeXNpY3MuIDE5NjUnXG4gIH0sXG4gIE5XTDlEOiB7XG4gICAgYTogNjM3ODE0NSxcbiAgICByZjogMjk4LjI1LFxuICAgIGVsbGlwc2VOYW1lOiAnTmF2YWwgV2VhcG9ucyBMYWIuLCAxOTY1J1xuICB9LFxuICBtb2RfYWlyeToge1xuICAgIGE6IDYzNzczNDAuMTg5LFxuICAgIGI6IDYzNTYwMzQuNDQ2LFxuICAgIGVsbGlwc2VOYW1lOiAnTW9kaWZpZWQgQWlyeSdcbiAgfSxcbiAgYW5kcmFlOiB7XG4gICAgYTogNjM3NzEwNC40MyxcbiAgICByZjogMzAwLFxuICAgIGVsbGlwc2VOYW1lOiAnQW5kcmFlIDE4NzYgKERlbi4sIEljbG5kLiknXG4gIH0sXG4gIGF1c3RfU0E6IHtcbiAgICBhOiA2Mzc4MTYwLFxuICAgIHJmOiAyOTguMjUsXG4gICAgZWxsaXBzZU5hbWU6ICdBdXN0cmFsaWFuIE5hdGwgJiBTLiBBbWVyLiAxOTY5J1xuICB9LFxuICBHUlM2Nzoge1xuICAgIGE6IDYzNzgxNjAsXG4gICAgcmY6IDI5OC4yNDcxNjc0MjcsXG4gICAgZWxsaXBzZU5hbWU6ICdHUlMgNjcoSVVHRyAxOTY3KSdcbiAgfSxcbiAgYmVzc2VsOiB7XG4gICAgYTogNjM3NzM5Ny4xNTUsXG4gICAgcmY6IDI5OS4xNTI4MTI4LFxuICAgIGVsbGlwc2VOYW1lOiAnQmVzc2VsIDE4NDEnXG4gIH0sXG4gIGJlc3NfbmFtOiB7XG4gICAgYTogNjM3NzQ4My44NjUsXG4gICAgcmY6IDI5OS4xNTI4MTI4LFxuICAgIGVsbGlwc2VOYW1lOiAnQmVzc2VsIDE4NDEgKE5hbWliaWEpJ1xuICB9LFxuICBjbHJrNjY6IHtcbiAgICBhOiA2Mzc4MjA2LjQsXG4gICAgYjogNjM1NjU4My44LFxuICAgIGVsbGlwc2VOYW1lOiAnQ2xhcmtlIDE4NjYnXG4gIH0sXG4gIGNscms4MDoge1xuICAgIGE6IDYzNzgyNDkuMTQ1LFxuICAgIHJmOiAyOTMuNDY2MyxcbiAgICBlbGxpcHNlTmFtZTogJ0NsYXJrZSAxODgwIG1vZC4nXG4gIH0sXG4gIGNscms4MGlnbjoge1xuICAgIGE6IDYzNzgyNDkuMixcbiAgICBiOiA2MzU2NTE1LFxuICAgIHJmOiAyOTMuNDY2MDIxMyxcbiAgICBlbGxpcHNlTmFtZTogJ0NsYXJrZSAxODgwIChJR04pJ1xuICB9LFxuICBjbHJrNTg6IHtcbiAgICBhOiA2Mzc4MjkzLjY0NTIwODc1OSxcbiAgICByZjogMjk0LjI2MDY3NjM2OTI2NTQsXG4gICAgZWxsaXBzZU5hbWU6ICdDbGFya2UgMTg1OCdcbiAgfSxcbiAgQ1BNOiB7XG4gICAgYTogNjM3NTczOC43LFxuICAgIHJmOiAzMzQuMjksXG4gICAgZWxsaXBzZU5hbWU6ICdDb21tLiBkZXMgUG9pZHMgZXQgTWVzdXJlcyAxNzk5J1xuICB9LFxuICBkZWxtYnI6IHtcbiAgICBhOiA2Mzc2NDI4LFxuICAgIHJmOiAzMTEuNSxcbiAgICBlbGxpcHNlTmFtZTogJ0RlbGFtYnJlIDE4MTAgKEJlbGdpdW0pJ1xuICB9LFxuICBlbmdlbGlzOiB7XG4gICAgYTogNjM3ODEzNi4wNSxcbiAgICByZjogMjk4LjI1NjYsXG4gICAgZWxsaXBzZU5hbWU6ICdFbmdlbGlzIDE5ODUnXG4gIH0sXG4gIGV2cnN0MzA6IHtcbiAgICBhOiA2Mzc3Mjc2LjM0NSxcbiAgICByZjogMzAwLjgwMTcsXG4gICAgZWxsaXBzZU5hbWU6ICdFdmVyZXN0IDE4MzAnXG4gIH0sXG4gIGV2cnN0NDg6IHtcbiAgICBhOiA2Mzc3MzA0LjA2MyxcbiAgICByZjogMzAwLjgwMTcsXG4gICAgZWxsaXBzZU5hbWU6ICdFdmVyZXN0IDE5NDgnXG4gIH0sXG4gIGV2cnN0NTY6IHtcbiAgICBhOiA2Mzc3MzAxLjI0MyxcbiAgICByZjogMzAwLjgwMTcsXG4gICAgZWxsaXBzZU5hbWU6ICdFdmVyZXN0IDE5NTYnXG4gIH0sXG4gIGV2cnN0Njk6IHtcbiAgICBhOiA2Mzc3Mjk1LjY2NCxcbiAgICByZjogMzAwLjgwMTcsXG4gICAgZWxsaXBzZU5hbWU6ICdFdmVyZXN0IDE5NjknXG4gIH0sXG4gIGV2cnN0U1M6IHtcbiAgICBhOiA2Mzc3Mjk4LjU1NixcbiAgICByZjogMzAwLjgwMTcsXG4gICAgZWxsaXBzZU5hbWU6ICdFdmVyZXN0IChTYWJhaCAmIFNhcmF3YWspJ1xuICB9LFxuICBmc2NocjYwOiB7XG4gICAgYTogNjM3ODE2NixcbiAgICByZjogMjk4LjMsXG4gICAgZWxsaXBzZU5hbWU6ICdGaXNjaGVyIChNZXJjdXJ5IERhdHVtKSAxOTYwJ1xuICB9LFxuICBmc2NocjYwbToge1xuICAgIGE6IDYzNzgxNTUsXG4gICAgcmY6IDI5OC4zLFxuICAgIGVsbGlwc2VOYW1lOiAnRmlzY2hlciAxOTYwJ1xuICB9LFxuICBmc2NocjY4OiB7XG4gICAgYTogNjM3ODE1MCxcbiAgICByZjogMjk4LjMsXG4gICAgZWxsaXBzZU5hbWU6ICdGaXNjaGVyIDE5NjgnXG4gIH0sXG4gIGhlbG1lcnQ6IHtcbiAgICBhOiA2Mzc4MjAwLFxuICAgIHJmOiAyOTguMyxcbiAgICBlbGxpcHNlTmFtZTogJ0hlbG1lcnQgMTkwNidcbiAgfSxcbiAgaG91Z2g6IHtcbiAgICBhOiA2Mzc4MjcwLFxuICAgIHJmOiAyOTcsXG4gICAgZWxsaXBzZU5hbWU6ICdIb3VnaCdcbiAgfSxcbiAgaW50bDoge1xuICAgIGE6IDYzNzgzODgsXG4gICAgcmY6IDI5NyxcbiAgICBlbGxpcHNlTmFtZTogJ0ludGVybmF0aW9uYWwgMTkwOSAoSGF5Zm9yZCknXG4gIH0sXG4gIGthdWxhOiB7XG4gICAgYTogNjM3ODE2MyxcbiAgICByZjogMjk4LjI0LFxuICAgIGVsbGlwc2VOYW1lOiAnS2F1bGEgMTk2MSdcbiAgfSxcbiAgbGVyY2g6IHtcbiAgICBhOiA2Mzc4MTM5LFxuICAgIHJmOiAyOTguMjU3LFxuICAgIGVsbGlwc2VOYW1lOiAnTGVyY2ggMTk3OSdcbiAgfSxcbiAgbXBydHM6IHtcbiAgICBhOiA2Mzk3MzAwLFxuICAgIHJmOiAxOTEsXG4gICAgZWxsaXBzZU5hbWU6ICdNYXVwZXJ0aXVzIDE3MzgnXG4gIH0sXG4gIG5ld19pbnRsOiB7XG4gICAgYTogNjM3ODE1Ny41LFxuICAgIGI6IDYzNTY3NzIuMixcbiAgICBlbGxpcHNlTmFtZTogJ05ldyBJbnRlcm5hdGlvbmFsIDE5NjcnXG4gIH0sXG4gIHBsZXNzaXM6IHtcbiAgICBhOiA2Mzc2NTIzLFxuICAgIHJmOiA2MzU1ODYzLFxuICAgIGVsbGlwc2VOYW1lOiAnUGxlc3NpcyAxODE3IChGcmFuY2UpJ1xuICB9LFxuICBrcmFzczoge1xuICAgIGE6IDYzNzgyNDUsXG4gICAgcmY6IDI5OC4zLFxuICAgIGVsbGlwc2VOYW1lOiAnS3Jhc3NvdnNreSwgMTk0MidcbiAgfSxcbiAgU0Vhc2lhOiB7XG4gICAgYTogNjM3ODE1NSxcbiAgICBiOiA2MzU2NzczLjMyMDUsXG4gICAgZWxsaXBzZU5hbWU6ICdTb3V0aGVhc3QgQXNpYSdcbiAgfSxcbiAgd2FsYmVjazoge1xuICAgIGE6IDYzNzY4OTYsXG4gICAgYjogNjM1NTgzNC44NDY3LFxuICAgIGVsbGlwc2VOYW1lOiAnV2FsYmVjaydcbiAgfSxcbiAgV0dTNjA6IHtcbiAgICBhOiA2Mzc4MTY1LFxuICAgIHJmOiAyOTguMyxcbiAgICBlbGxpcHNlTmFtZTogJ1dHUyA2MCdcbiAgfSxcbiAgV0dTNjY6IHtcbiAgICBhOiA2Mzc4MTQ1LFxuICAgIHJmOiAyOTguMjUsXG4gICAgZWxsaXBzZU5hbWU6ICdXR1MgNjYnXG4gIH0sXG4gIFdHUzc6IHtcbiAgICBhOiA2Mzc4MTM1LFxuICAgIHJmOiAyOTguMjYsXG4gICAgZWxsaXBzZU5hbWU6ICdXR1MgNzInXG4gIH0sXG4gIFdHUzg0OiB7XG4gICAgYTogNjM3ODEzNyxcbiAgICByZjogMjk4LjI1NzIyMzU2MyxcbiAgICBlbGxpcHNlTmFtZTogJ1dHUyA4NCdcbiAgfSxcbiAgc3BoZXJlOiB7XG4gICAgYTogNjM3MDk5NyxcbiAgICBiOiA2MzcwOTk3LFxuICAgIGVsbGlwc2VOYW1lOiAnTm9ybWFsIFNwaGVyZSAocj02MzcwOTk3KSdcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZWxsaXBzb2lkcztcbiIsInZhciBwcmltZU1lcmlkaWFuID0ge307XG5cbnByaW1lTWVyaWRpYW4uZ3JlZW53aWNoID0gMC4wOyAvLyBcIjBkRVwiLFxucHJpbWVNZXJpZGlhbi5saXNib24gPSAtOS4xMzE5MDYxMTExMTE7IC8vIFwiOWQwNyc1NC44NjJcXFwiV1wiLFxucHJpbWVNZXJpZGlhbi5wYXJpcyA9IDIuMzM3MjI5MTY2NjY3OyAvLyBcIjJkMjAnMTQuMDI1XFxcIkVcIixcbnByaW1lTWVyaWRpYW4uYm9nb3RhID0gLTc0LjA4MDkxNjY2NjY2NzsgLy8gXCI3NGQwNCc1MS4zXFxcIldcIixcbnByaW1lTWVyaWRpYW4ubWFkcmlkID0gLTMuNjg3OTM4ODg4ODg5OyAvLyBcIjNkNDEnMTYuNThcXFwiV1wiLFxucHJpbWVNZXJpZGlhbi5yb21lID0gMTIuNDUyMzMzMzMzMzMzOyAvLyBcIjEyZDI3JzguNFxcXCJFXCIsXG5wcmltZU1lcmlkaWFuLmJlcm4gPSA3LjQzOTU4MzMzMzMzMzsgLy8gXCI3ZDI2JzIyLjVcXFwiRVwiLFxucHJpbWVNZXJpZGlhbi5qYWthcnRhID0gMTA2LjgwNzcxOTQ0NDQ0NDsgLy8gXCIxMDZkNDgnMjcuNzlcXFwiRVwiLFxucHJpbWVNZXJpZGlhbi5mZXJybyA9IC0xNy42NjY2NjY2NjY2Njc7IC8vIFwiMTdkNDAnV1wiLFxucHJpbWVNZXJpZGlhbi5icnVzc2VscyA9IDQuMzY3OTc1OyAvLyBcIjRkMjInNC43MVxcXCJFXCIsXG5wcmltZU1lcmlkaWFuLnN0b2NraG9sbSA9IDE4LjA1ODI3Nzc3Nzc3ODsgLy8gXCIxOGQzJzI5LjhcXFwiRVwiLFxucHJpbWVNZXJpZGlhbi5hdGhlbnMgPSAyMy43MTYzMzc1OyAvLyBcIjIzZDQyJzU4LjgxNVxcXCJFXCIsXG5wcmltZU1lcmlkaWFuLm9zbG8gPSAxMC43MjI5MTY2NjY2Njc7IC8vIFwiMTBkNDMnMjIuNVxcXCJFXCJcblxuZXhwb3J0IGRlZmF1bHQgcHJpbWVNZXJpZGlhbjtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgbW06IHsgdG9fbWV0ZXI6IDAuMDAxIH0sXG4gIGNtOiB7IHRvX21ldGVyOiAwLjAxIH0sXG4gIGZ0OiB7IHRvX21ldGVyOiAwLjMwNDggfSxcbiAgJ3VzLWZ0JzogeyB0b19tZXRlcjogMTIwMCAvIDM5MzcgfSxcbiAgZmF0aDogeyB0b19tZXRlcjogMS44Mjg4IH0sXG4gIGttaTogeyB0b19tZXRlcjogMTg1MiB9LFxuICAndXMtY2gnOiB7IHRvX21ldGVyOiAyMC4xMTY4NDAyMzM2ODA1IH0sXG4gICd1cy1taSc6IHsgdG9fbWV0ZXI6IDE2MDkuMzQ3MjE4Njk0NDQgfSxcbiAga206IHsgdG9fbWV0ZXI6IDEwMDAgfSxcbiAgJ2luZC1mdCc6IHsgdG9fbWV0ZXI6IDAuMzA0Nzk4NDEgfSxcbiAgJ2luZC15ZCc6IHsgdG9fbWV0ZXI6IDAuOTE0Mzk1MjMgfSxcbiAgbWk6IHsgdG9fbWV0ZXI6IDE2MDkuMzQ0IH0sXG4gIHlkOiB7IHRvX21ldGVyOiAwLjkxNDQgfSxcbiAgY2g6IHsgdG9fbWV0ZXI6IDIwLjExNjggfSxcbiAgbGluazogeyB0b19tZXRlcjogMC4yMDExNjggfSxcbiAgZG06IHsgdG9fbWV0ZXI6IDAuMSB9LFxuICBpbjogeyB0b19tZXRlcjogMC4wMjU0IH0sXG4gICdpbmQtY2gnOiB7IHRvX21ldGVyOiAyMC4xMTY2OTUwNiB9LFxuICAndXMtaW4nOiB7IHRvX21ldGVyOiAwLjAyNTQwMDA1MDgwMDEwMSB9LFxuICAndXMteWQnOiB7IHRvX21ldGVyOiAwLjkxNDQwMTgyODgwMzY1OCB9XG59O1xuIiwiZXhwb3J0IHZhciBQSkRfM1BBUkFNID0gMTtcbmV4cG9ydCB2YXIgUEpEXzdQQVJBTSA9IDI7XG5leHBvcnQgdmFyIFBKRF9HUklEU0hJRlQgPSAzO1xuZXhwb3J0IHZhciBQSkRfV0dTODQgPSA0OyAvLyBXR1M4NCBvciBlcXVpdmFsZW50XG5leHBvcnQgdmFyIFBKRF9OT0RBVFVNID0gNTsgLy8gV0dTODQgb3IgZXF1aXZhbGVudFxuZXhwb3J0IHZhciBTUlNfV0dTODRfU0VNSU1BSk9SID0gNjM3ODEzNy4wOyAvLyBvbmx5IHVzZWQgaW4gZ3JpZCBzaGlmdCB0cmFuc2Zvcm1zXG5leHBvcnQgdmFyIFNSU19XR1M4NF9TRU1JTUlOT1IgPSA2MzU2NzUyLjMxNDsgLy8gb25seSB1c2VkIGluIGdyaWQgc2hpZnQgdHJhbnNmb3Jtc1xuZXhwb3J0IHZhciBTUlNfV0dTODRfRVNRVUFSRUQgPSAwLjAwNjY5NDM3OTk5MDE0MTMxNjU7IC8vIG9ubHkgdXNlZCBpbiBncmlkIHNoaWZ0IHRyYW5zZm9ybXNcbmV4cG9ydCB2YXIgU0VDX1RPX1JBRCA9IDQuODQ4MTM2ODExMDk1MzU5OTM1ODk5MTQxMDIzNTdlLTY7XG5leHBvcnQgdmFyIEhBTEZfUEkgPSBNYXRoLlBJIC8gMjtcbi8vIGVsbGlwb2lkIHBqX3NldF9lbGwuY1xuZXhwb3J0IHZhciBTSVhUSCA9IDAuMTY2NjY2NjY2NjY2NjY2NjY2Nztcbi8qIDEvNiAqL1xuZXhwb3J0IHZhciBSQTQgPSAwLjA0NzIyMjIyMjIyMjIyMjIyMjIyO1xuLyogMTcvMzYwICovXG5leHBvcnQgdmFyIFJBNiA9IDAuMDIyMTU2MDg0NjU2MDg0NjU2MDg7XG5leHBvcnQgdmFyIEVQU0xOID0gMS4wZS0xMDtcbi8vIHlvdSdkIHRoaW5rIHlvdSBjb3VsZCB1c2UgTnVtYmVyLkVQU0lMT04gYWJvdmUgYnV0IHRoYXQgbWFrZXNcbi8vIE1vbGx3ZWlkZSBnZXQgaW50byBhbiBpbmZpbmF0ZSBsb29wLlxuXG5leHBvcnQgdmFyIEQyUiA9IDAuMDE3NDUzMjkyNTE5OTQzMjk1Nzc7XG5leHBvcnQgdmFyIFIyRCA9IDU3LjI5NTc3OTUxMzA4MjMyMDg4O1xuZXhwb3J0IHZhciBGT1JUUEkgPSBNYXRoLlBJIC8gNDtcbmV4cG9ydCB2YXIgVFdPX1BJID0gTWF0aC5QSSAqIDI7XG4vLyBTUEkgaXMgc2xpZ2h0bHkgZ3JlYXRlciB0aGFuIE1hdGguUEksIHNvIHZhbHVlcyB0aGF0IGV4Y2VlZCB0aGUgLTE4MC4uMTgwXG4vLyBkZWdyZWUgcmFuZ2UgYnkgYSB0aW55IGFtb3VudCBkb24ndCBnZXQgd3JhcHBlZC4gVGhpcyBwcmV2ZW50cyBwb2ludHMgdGhhdFxuLy8gaGF2ZSBkcmlmdGVkIGZyb20gdGhlaXIgb3JpZ2luYWwgbG9jYXRpb24gYWxvbmcgdGhlIDE4MHRoIG1lcmlkaWFuIChkdWUgdG9cbi8vIGZsb2F0aW5nIHBvaW50IGVycm9yKSBmcm9tIGNoYW5naW5nIHRoZWlyIHNpZ24uXG5leHBvcnQgdmFyIFNQSSA9IDMuMTQxNTkyNjUzNTk7XG4iLCJpbXBvcnQgcHJvaiBmcm9tICcuL1Byb2onO1xuaW1wb3J0IHRyYW5zZm9ybSBmcm9tICcuL3RyYW5zZm9ybSc7XG52YXIgd2dzODQgPSBwcm9qKCdXR1M4NCcpO1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7eDogbnVtYmVyLCB5OiBudW1iZXIsIHo/OiBudW1iZXIsIG0/OiBudW1iZXJ9fSBJbnRlcmZhY2VDb29yZGluYXRlc1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0FycmF5PG51bWJlcj4gfCBJbnRlcmZhY2VDb29yZGluYXRlc30gVGVtcGxhdGVDb29yZGluYXRlc1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gQ29udmVydGVyXG4gKiBAcHJvcGVydHkgezxUIGV4dGVuZHMgVGVtcGxhdGVDb29yZGluYXRlcz4oY29vcmRpbmF0ZXM6IFQsIGVuZm9yY2VBeGlzPzogYm9vbGVhbikgPT4gVH0gZm9yd2FyZFxuICogQHByb3BlcnR5IHs8VCBleHRlbmRzIFRlbXBsYXRlQ29vcmRpbmF0ZXM+KGNvb3JkaW5hdGVzOiBULCBlbmZvcmNlQXhpcz86IGJvb2xlYW4pID0+IFR9IGludmVyc2VcbiAqIEBwcm9wZXJ0eSB7cHJvan0gW29Qcm9qXVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gUFJPSkpTT05EZWZpbml0aW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gWyRzY2hlbWFdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXVxuICogQHByb3BlcnR5IHt7YXV0aG9yaXR5OiBzdHJpbmcsIGNvZGU6IG51bWJlcn19IFtpZF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2NvcGVdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2FyZWFdXG4gKiBAcHJvcGVydHkge3tzb3V0aF9sYXRpdHVkZTogbnVtYmVyLCB3ZXN0X2xvbmdpdHVkZTogbnVtYmVyLCBub3J0aF9sYXRpdHVkZTogbnVtYmVyLCBlYXN0X2xvbmdpdHVkZTogbnVtYmVyfX0gW2Jib3hdXG4gKiBAcHJvcGVydHkge1BST0pKU09ORGVmaW5pdGlvbltdfSBbY29tcG9uZW50c11cbiAqIEBwcm9wZXJ0eSB7e3R5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nfX0gW2RhdHVtXVxuICogQHByb3BlcnR5IHt7XG4gKiAgIG5hbWU6IHN0cmluZyxcbiAqICAgbWVtYmVyczogQXJyYXk8e1xuICogICAgIG5hbWU6IHN0cmluZyxcbiAqICAgICBpZD86IHthdXRob3JpdHk6IHN0cmluZywgY29kZTogbnVtYmVyfVxuICogICB9PixcbiAqICAgZWxsaXBzb2lkPzoge1xuICogICAgIG5hbWU6IHN0cmluZyxcbiAqICAgICBzZW1pX21ham9yX2F4aXM6IG51bWJlcixcbiAqICAgICBpbnZlcnNlX2ZsYXR0ZW5pbmc/OiBudW1iZXJcbiAqICAgfSxcbiAqICAgYWNjdXJhY3k/OiBzdHJpbmcsXG4gKiAgIGlkPzoge2F1dGhvcml0eTogc3RyaW5nLCBjb2RlOiBudW1iZXJ9XG4gKiB9fSBbZGF0dW1fZW5zZW1ibGVdXG4gKiBAcHJvcGVydHkge3tcbiAqICAgc3VidHlwZTogc3RyaW5nLFxuICogICBheGlzOiBBcnJheTx7XG4gKiAgICAgbmFtZTogc3RyaW5nLFxuICogICAgIGFiYnJldmlhdGlvbj86IHN0cmluZyxcbiAqICAgICBkaXJlY3Rpb246IHN0cmluZyxcbiAqICAgICB1bml0OiBzdHJpbmdcbiAqICAgfT5cbiAqIH19IFtjb29yZGluYXRlX3N5c3RlbV1cbiAqIEBwcm9wZXJ0eSB7e1xuICogICBuYW1lOiBzdHJpbmcsXG4gKiAgIG1ldGhvZDoge25hbWU6IHN0cmluZ30sXG4gKiAgIHBhcmFtZXRlcnM6IEFycmF5PHtcbiAqICAgICBuYW1lOiBzdHJpbmcsXG4gKiAgICAgdmFsdWU6IG51bWJlcixcbiAqICAgICB1bml0Pzogc3RyaW5nXG4gKiAgIH0+XG4gKiB9fSBbY29udmVyc2lvbl1cbiAqIEBwcm9wZXJ0eSB7e1xuICogICBuYW1lOiBzdHJpbmcsXG4gKiAgIG1ldGhvZDoge25hbWU6IHN0cmluZ30sXG4gKiAgIHBhcmFtZXRlcnM6IEFycmF5PHtcbiAqICAgICBuYW1lOiBzdHJpbmcsXG4gKiAgICAgdmFsdWU6IG51bWJlcixcbiAqICAgICB1bml0Pzogc3RyaW5nLFxuICogICAgIHR5cGU/OiBzdHJpbmcsXG4gKiAgICAgZmlsZV9uYW1lPzogc3RyaW5nXG4gKiAgIH0+XG4gKiB9fSBbdHJhbnNmb3JtYXRpb25dXG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUge1RlbXBsYXRlQ29vcmRpbmF0ZXN9IFRcbiAqIEBwYXJhbSB7cHJvan0gZnJvbVxuICogQHBhcmFtIHtwcm9qfSB0b1xuICogQHBhcmFtIHtUfSBjb29yZHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2VuZm9yY2VBeGlzXVxuICogQHJldHVybnMge1R9XG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybWVyKGZyb20sIHRvLCBjb29yZHMsIGVuZm9yY2VBeGlzKSB7XG4gIHZhciB0cmFuc2Zvcm1lZEFycmF5LCBvdXQsIGtleXM7XG4gIGlmIChBcnJheS5pc0FycmF5KGNvb3JkcykpIHtcbiAgICB0cmFuc2Zvcm1lZEFycmF5ID0gdHJhbnNmb3JtKGZyb20sIHRvLCBjb29yZHMsIGVuZm9yY2VBeGlzKSB8fCB7IHg6IE5hTiwgeTogTmFOIH07XG4gICAgaWYgKGNvb3Jkcy5sZW5ndGggPiAyKSB7XG4gICAgICBpZiAoKHR5cGVvZiBmcm9tLm5hbWUgIT09ICd1bmRlZmluZWQnICYmIGZyb20ubmFtZSA9PT0gJ2dlb2NlbnQnKSB8fCAodHlwZW9mIHRvLm5hbWUgIT09ICd1bmRlZmluZWQnICYmIHRvLm5hbWUgPT09ICdnZW9jZW50JykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc2Zvcm1lZEFycmF5LnogPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKFt0cmFuc2Zvcm1lZEFycmF5LngsIHRyYW5zZm9ybWVkQXJyYXkueSwgdHJhbnNmb3JtZWRBcnJheS56XS5jb25jYXQoY29vcmRzLnNsaWNlKDMpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKFt0cmFuc2Zvcm1lZEFycmF5LngsIHRyYW5zZm9ybWVkQXJyYXkueSwgY29vcmRzWzJdXS5jb25jYXQoY29vcmRzLnNsaWNlKDMpKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAvKiogQHR5cGUge1R9ICovIChbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnldLmNvbmNhdChjb29yZHMuc2xpY2UoMikpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKFt0cmFuc2Zvcm1lZEFycmF5LngsIHRyYW5zZm9ybWVkQXJyYXkueV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXQgPSB0cmFuc2Zvcm0oZnJvbSwgdG8sIGNvb3JkcywgZW5mb3JjZUF4aXMpO1xuICAgIGtleXMgPSBPYmplY3Qua2V5cyhjb29yZHMpO1xuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKG91dCk7XG4gICAgfVxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBpZiAoKHR5cGVvZiBmcm9tLm5hbWUgIT09ICd1bmRlZmluZWQnICYmIGZyb20ubmFtZSA9PT0gJ2dlb2NlbnQnKSB8fCAodHlwZW9mIHRvLm5hbWUgIT09ICd1bmRlZmluZWQnICYmIHRvLm5hbWUgPT09ICdnZW9jZW50JykpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3gnIHx8IGtleSA9PT0gJ3knIHx8IGtleSA9PT0gJ3onKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoa2V5ID09PSAneCcgfHwga2V5ID09PSAneScpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG91dFtrZXldID0gY29vcmRzW2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKG91dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Byb2ogfCBzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBDb252ZXJ0ZXJ9IGl0ZW1cbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vUHJvaicpLmRlZmF1bHR9XG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvaihpdGVtKSB7XG4gIGlmIChpdGVtIGluc3RhbmNlb2YgcHJvaikge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgJ29Qcm9qJyBpbiBpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0ub1Byb2o7XG4gIH1cbiAgcmV0dXJuIHByb2ooLyoqIEB0eXBlIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb259ICovIChpdGVtKSk7XG59XG5cbi8qKlxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2p9IHRvUHJvalxuICogQHJldHVybnMge0NvbnZlcnRlcn1cbiAqL1xuLyoqXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvan0gZnJvbVByb2pcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvan0gdG9Qcm9qXG4gKiBAcmV0dXJucyB7Q29udmVydGVyfVxuICovXG4vKipcbiAqIEB0ZW1wbGF0ZSB7VGVtcGxhdGVDb29yZGluYXRlc30gVFxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2p9IHRvUHJvalxuICogQHBhcmFtIHtUfSBjb29yZFxuICogQHJldHVybnMge1R9XG4gKi9cbi8qKlxuICogQHRlbXBsYXRlIHtUZW1wbGF0ZUNvb3JkaW5hdGVzfSBUXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvan0gZnJvbVByb2pcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvan0gdG9Qcm9qXG4gKiBAcGFyYW0ge1R9IGNvb3JkXG4gKiBAcmV0dXJucyB7VH1cbiAqL1xuLyoqXG4gKiBAdGVtcGxhdGUge1RlbXBsYXRlQ29vcmRpbmF0ZXN9IFRcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUFJPSkpTT05EZWZpbml0aW9uIHwgcHJvan0gZnJvbVByb2pPclRvUHJvalxuICogQHBhcmFtIHtzdHJpbmcgfCBQUk9KSlNPTkRlZmluaXRpb24gfCBwcm9qIHwgVGVtcGxhdGVDb29yZGluYXRlc30gW3RvUHJvak9yQ29vcmRdXG4gKiBAcGFyYW0ge1R9IFtjb29yZF1cbiAqIEByZXR1cm5zIHtUfENvbnZlcnRlcn1cbiAqL1xuZnVuY3Rpb24gcHJvajQoZnJvbVByb2pPclRvUHJvaiwgdG9Qcm9qT3JDb29yZCwgY29vcmQpIHtcbiAgLyoqIEB0eXBlIHtwcm9qfSAqL1xuICB2YXIgZnJvbVByb2o7XG4gIC8qKiBAdHlwZSB7cHJvan0gKi9cbiAgdmFyIHRvUHJvajtcbiAgdmFyIHNpbmdsZSA9IGZhbHNlO1xuICAvKiogQHR5cGUge0NvbnZlcnRlcn0gKi9cbiAgdmFyIG9iajtcbiAgaWYgKHR5cGVvZiB0b1Byb2pPckNvb3JkID09PSAndW5kZWZpbmVkJykge1xuICAgIHRvUHJvaiA9IGNoZWNrUHJvaihmcm9tUHJvak9yVG9Qcm9qKTtcbiAgICBmcm9tUHJvaiA9IHdnczg0O1xuICAgIHNpbmdsZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIC8qKiBAdHlwZSB7P30gKi8gKHRvUHJvak9yQ29vcmQpLnggIT09ICd1bmRlZmluZWQnIHx8IEFycmF5LmlzQXJyYXkodG9Qcm9qT3JDb29yZCkpIHtcbiAgICBjb29yZCA9IC8qKiBAdHlwZSB7VH0gKi8gKC8qKiBAdHlwZSB7P30gKi8gKHRvUHJvak9yQ29vcmQpKTtcbiAgICB0b1Byb2ogPSBjaGVja1Byb2ooZnJvbVByb2pPclRvUHJvaik7XG4gICAgZnJvbVByb2ogPSB3Z3M4NDtcbiAgICBzaW5nbGUgPSB0cnVlO1xuICB9XG4gIGlmICghZnJvbVByb2opIHtcbiAgICBmcm9tUHJvaiA9IGNoZWNrUHJvaihmcm9tUHJvak9yVG9Qcm9qKTtcbiAgfVxuICBpZiAoIXRvUHJvaikge1xuICAgIHRvUHJvaiA9IGNoZWNrUHJvaigvKiogQHR5cGUge3N0cmluZyB8IFBST0pKU09ORGVmaW5pdGlvbiB8IHByb2ogfSAqLyAodG9Qcm9qT3JDb29yZCkpO1xuICB9XG4gIGlmIChjb29yZCkge1xuICAgIHJldHVybiB0cmFuc2Zvcm1lcihmcm9tUHJvaiwgdG9Qcm9qLCBjb29yZCk7XG4gIH0gZWxzZSB7XG4gICAgb2JqID0ge1xuICAgICAgLyoqXG4gICAgICAgKiBAdGVtcGxhdGUge1RlbXBsYXRlQ29vcmRpbmF0ZXN9IFRcbiAgICAgICAqIEBwYXJhbSB7VH0gY29vcmRzXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBlbmZvcmNlQXhpc1xuICAgICAgICogQHJldHVybnMge1R9XG4gICAgICAgKi9cbiAgICAgIGZvcndhcmQ6IGZ1bmN0aW9uIChjb29yZHMsIGVuZm9yY2VBeGlzKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcihmcm9tUHJvaiwgdG9Qcm9qLCBjb29yZHMsIGVuZm9yY2VBeGlzKTtcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIEB0ZW1wbGF0ZSB7VGVtcGxhdGVDb29yZGluYXRlc30gVFxuICAgICAgICogQHBhcmFtIHtUfSBjb29yZHNcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IGVuZm9yY2VBeGlzXG4gICAgICAgKiBAcmV0dXJucyB7VH1cbiAgICAgICAqL1xuICAgICAgaW52ZXJzZTogZnVuY3Rpb24gKGNvb3JkcywgZW5mb3JjZUF4aXMpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyKHRvUHJvaiwgZnJvbVByb2osIGNvb3JkcywgZW5mb3JjZUF4aXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNpbmdsZSkge1xuICAgICAgb2JqLm9Qcm9qID0gdG9Qcm9qO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByb2o0O1xuIiwiaW1wb3J0IHsgUEpEXzNQQVJBTSwgUEpEXzdQQVJBTSwgUEpEX0dSSURTSElGVCwgUEpEX1dHUzg0LCBQSkRfTk9EQVRVTSwgU0VDX1RPX1JBRCB9IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmZ1bmN0aW9uIGRhdHVtKGRhdHVtQ29kZSwgZGF0dW1fcGFyYW1zLCBhLCBiLCBlcywgZXAyLCBuYWRncmlkcykge1xuICB2YXIgb3V0ID0ge307XG5cbiAgaWYgKGRhdHVtQ29kZSA9PT0gdW5kZWZpbmVkIHx8IGRhdHVtQ29kZSA9PT0gJ25vbmUnKSB7XG4gICAgb3V0LmRhdHVtX3R5cGUgPSBQSkRfTk9EQVRVTTtcbiAgfSBlbHNlIHtcbiAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF9XR1M4NDtcbiAgfVxuXG4gIGlmIChkYXR1bV9wYXJhbXMpIHtcbiAgICBvdXQuZGF0dW1fcGFyYW1zID0gZGF0dW1fcGFyYW1zLm1hcChwYXJzZUZsb2F0KTtcbiAgICBpZiAob3V0LmRhdHVtX3BhcmFtc1swXSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzFdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbMl0gIT09IDApIHtcbiAgICAgIG91dC5kYXR1bV90eXBlID0gUEpEXzNQQVJBTTtcbiAgICB9XG4gICAgaWYgKG91dC5kYXR1bV9wYXJhbXMubGVuZ3RoID4gMykge1xuICAgICAgaWYgKG91dC5kYXR1bV9wYXJhbXNbM10gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1s0XSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzVdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbNl0gIT09IDApIHtcbiAgICAgICAgb3V0LmRhdHVtX3R5cGUgPSBQSkRfN1BBUkFNO1xuICAgICAgICBvdXQuZGF0dW1fcGFyYW1zWzNdICo9IFNFQ19UT19SQUQ7XG4gICAgICAgIG91dC5kYXR1bV9wYXJhbXNbNF0gKj0gU0VDX1RPX1JBRDtcbiAgICAgICAgb3V0LmRhdHVtX3BhcmFtc1s1XSAqPSBTRUNfVE9fUkFEO1xuICAgICAgICBvdXQuZGF0dW1fcGFyYW1zWzZdID0gKG91dC5kYXR1bV9wYXJhbXNbNl0gLyAxMDAwMDAwLjApICsgMS4wO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChuYWRncmlkcykge1xuICAgIG91dC5kYXR1bV90eXBlID0gUEpEX0dSSURTSElGVDtcbiAgICBvdXQuZ3JpZHMgPSBuYWRncmlkcztcbiAgfVxuICBvdXQuYSA9IGE7IC8vIGRhdHVtIG9iamVjdCBhbHNvIHVzZXMgdGhlc2UgdmFsdWVzXG4gIG91dC5iID0gYjtcbiAgb3V0LmVzID0gZXM7XG4gIG91dC5lcDIgPSBlcDI7XG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdHVtO1xuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHsgUEpEXzNQQVJBTSwgUEpEXzdQQVJBTSwgSEFMRl9QSSB9IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZURhdHVtcyhzb3VyY2UsIGRlc3QpIHtcbiAgaWYgKHNvdXJjZS5kYXR1bV90eXBlICE9PSBkZXN0LmRhdHVtX3R5cGUpIHtcbiAgICByZXR1cm4gZmFsc2U7IC8vIGZhbHNlLCBkYXR1bXMgYXJlIG5vdCBlcXVhbFxuICB9IGVsc2UgaWYgKHNvdXJjZS5hICE9PSBkZXN0LmEgfHwgTWF0aC5hYnMoc291cmNlLmVzIC0gZGVzdC5lcykgPiAwLjAwMDAwMDAwMDA1MCkge1xuICAgIC8vIHRoZSB0b2xlcmFuY2UgZm9yIGVzIGlzIHRvIGVuc3VyZSB0aGF0IEdSUzgwIGFuZCBXR1M4NFxuICAgIC8vIGFyZSBjb25zaWRlcmVkIGlkZW50aWNhbFxuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChzb3VyY2UuZGF0dW1fdHlwZSA9PT0gUEpEXzNQQVJBTSkge1xuICAgIHJldHVybiAoc291cmNlLmRhdHVtX3BhcmFtc1swXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMF0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1sxXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMV0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1syXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMl0pO1xuICB9IGVsc2UgaWYgKHNvdXJjZS5kYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSB7XG4gICAgcmV0dXJuIChzb3VyY2UuZGF0dW1fcGFyYW1zWzBdID09PSBkZXN0LmRhdHVtX3BhcmFtc1swXSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzFdID09PSBkZXN0LmRhdHVtX3BhcmFtc1sxXSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzJdID09PSBkZXN0LmRhdHVtX3BhcmFtc1syXSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzNdID09PSBkZXN0LmRhdHVtX3BhcmFtc1szXSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzRdID09PSBkZXN0LmRhdHVtX3BhcmFtc1s0XSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzVdID09PSBkZXN0LmRhdHVtX3BhcmFtc1s1XSAmJiBzb3VyY2UuZGF0dW1fcGFyYW1zWzZdID09PSBkZXN0LmRhdHVtX3BhcmFtc1s2XSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7IC8vIGRhdHVtcyBhcmUgZXF1YWxcbiAgfVxufSAvLyBjc19jb21wYXJlX2RhdHVtcygpXG5cbi8qXG4gKiBUaGUgZnVuY3Rpb24gQ29udmVydF9HZW9kZXRpY19Ub19HZW9jZW50cmljIGNvbnZlcnRzIGdlb2RldGljIGNvb3JkaW5hdGVzXG4gKiAobGF0aXR1ZGUsIGxvbmdpdHVkZSwgYW5kIGhlaWdodCkgdG8gZ2VvY2VudHJpYyBjb29yZGluYXRlcyAoWCwgWSwgWiksXG4gKiBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZWxsaXBzb2lkIHBhcmFtZXRlcnMuXG4gKlxuICogICAgTGF0aXR1ZGUgIDogR2VvZGV0aWMgbGF0aXR1ZGUgaW4gcmFkaWFucyAgICAgICAgICAgICAgICAgICAgIChpbnB1dClcbiAqICAgIExvbmdpdHVkZSA6IEdlb2RldGljIGxvbmdpdHVkZSBpbiByYWRpYW5zICAgICAgICAgICAgICAgICAgICAoaW5wdXQpXG4gKiAgICBIZWlnaHQgICAgOiBHZW9kZXRpYyBoZWlnaHQsIGluIG1ldGVycyAgICAgICAgICAgICAgICAgICAgICAgKGlucHV0KVxuICogICAgWCAgICAgICAgIDogQ2FsY3VsYXRlZCBHZW9jZW50cmljIFggY29vcmRpbmF0ZSwgaW4gbWV0ZXJzICAgIChvdXRwdXQpXG4gKiAgICBZICAgICAgICAgOiBDYWxjdWxhdGVkIEdlb2NlbnRyaWMgWSBjb29yZGluYXRlLCBpbiBtZXRlcnMgICAgKG91dHB1dClcbiAqICAgIFogICAgICAgICA6IENhbGN1bGF0ZWQgR2VvY2VudHJpYyBaIGNvb3JkaW5hdGUsIGluIG1ldGVycyAgICAob3V0cHV0KVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlb2RldGljVG9HZW9jZW50cmljKHAsIGVzLCBhKSB7XG4gIHZhciBMb25naXR1ZGUgPSBwLng7XG4gIHZhciBMYXRpdHVkZSA9IHAueTtcbiAgdmFyIEhlaWdodCA9IHAueiA/IHAueiA6IDA7IC8vIFogdmFsdWUgbm90IGFsd2F5cyBzdXBwbGllZFxuXG4gIHZhciBSbjsgLyogIEVhcnRoIHJhZGl1cyBhdCBsb2NhdGlvbiAgKi9cbiAgdmFyIFNpbl9MYXQ7IC8qICBNYXRoLnNpbihMYXRpdHVkZSkgICovXG4gIHZhciBTaW4yX0xhdDsgLyogIFNxdWFyZSBvZiBNYXRoLnNpbihMYXRpdHVkZSkgICovXG4gIHZhciBDb3NfTGF0OyAvKiAgTWF0aC5jb3MoTGF0aXR1ZGUpICAqL1xuXG4gIC8qXG4gICAqKiBEb24ndCBibG93IHVwIGlmIExhdGl0dWRlIGlzIGp1c3QgYSBsaXR0bGUgb3V0IG9mIHRoZSB2YWx1ZVxuICAgKiogcmFuZ2UgYXMgaXQgbWF5IGp1c3QgYmUgYSByb3VuZGluZyBpc3N1ZS4gIEFsc28gcmVtb3ZlZCBsb25naXR1ZGVcbiAgICoqIHRlc3QsIGl0IHNob3VsZCBiZSB3cmFwcGVkIGJ5IE1hdGguY29zKCkgYW5kIE1hdGguc2luKCkuICBORlcgZm9yIFBST0ouNCwgU2VwLzIwMDEuXG4gICAqL1xuICBpZiAoTGF0aXR1ZGUgPCAtSEFMRl9QSSAmJiBMYXRpdHVkZSA+IC0xLjAwMSAqIEhBTEZfUEkpIHtcbiAgICBMYXRpdHVkZSA9IC1IQUxGX1BJO1xuICB9IGVsc2UgaWYgKExhdGl0dWRlID4gSEFMRl9QSSAmJiBMYXRpdHVkZSA8IDEuMDAxICogSEFMRl9QSSkge1xuICAgIExhdGl0dWRlID0gSEFMRl9QSTtcbiAgfSBlbHNlIGlmIChMYXRpdHVkZSA8IC1IQUxGX1BJKSB7XG4gICAgLyogTGF0aXR1ZGUgb3V0IG9mIHJhbmdlICovXG4gICAgLy8gLi5yZXBvcnRFcnJvcignZ2VvY2VudDpsYXQgb3V0IG9mIHJhbmdlOicgKyBMYXRpdHVkZSk7XG4gICAgcmV0dXJuIHsgeDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIHo6IHAueiB9O1xuICB9IGVsc2UgaWYgKExhdGl0dWRlID4gSEFMRl9QSSkge1xuICAgIC8qIExhdGl0dWRlIG91dCBvZiByYW5nZSAqL1xuICAgIHJldHVybiB7IHg6IEluZmluaXR5LCB5OiBJbmZpbml0eSwgejogcC56IH07XG4gIH1cblxuICBpZiAoTG9uZ2l0dWRlID4gTWF0aC5QSSkge1xuICAgIExvbmdpdHVkZSAtPSAoMiAqIE1hdGguUEkpO1xuICB9XG4gIFNpbl9MYXQgPSBNYXRoLnNpbihMYXRpdHVkZSk7XG4gIENvc19MYXQgPSBNYXRoLmNvcyhMYXRpdHVkZSk7XG4gIFNpbjJfTGF0ID0gU2luX0xhdCAqIFNpbl9MYXQ7XG4gIFJuID0gYSAvIChNYXRoLnNxcnQoMS4wZTAgLSBlcyAqIFNpbjJfTGF0KSk7XG4gIHJldHVybiB7XG4gICAgeDogKFJuICsgSGVpZ2h0KSAqIENvc19MYXQgKiBNYXRoLmNvcyhMb25naXR1ZGUpLFxuICAgIHk6IChSbiArIEhlaWdodCkgKiBDb3NfTGF0ICogTWF0aC5zaW4oTG9uZ2l0dWRlKSxcbiAgICB6OiAoKFJuICogKDEgLSBlcykpICsgSGVpZ2h0KSAqIFNpbl9MYXRcbiAgfTtcbn0gLy8gY3NfZ2VvZGV0aWNfdG9fZ2VvY2VudHJpYygpXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW9jZW50cmljVG9HZW9kZXRpYyhwLCBlcywgYSwgYikge1xuICAvKiBsb2NhbCBkZWZpbnRpb25zIGFuZCB2YXJpYWJsZXMgKi9cbiAgLyogZW5kLWNyaXRlcml1bSBvZiBsb29wLCBhY2N1cmFjeSBvZiBzaW4oTGF0aXR1ZGUpICovXG4gIHZhciBnZW5hdSA9IDFlLTEyO1xuICB2YXIgZ2VuYXUyID0gKGdlbmF1ICogZ2VuYXUpO1xuICB2YXIgbWF4aXRlciA9IDMwO1xuXG4gIHZhciBQOyAvKiBkaXN0YW5jZSBiZXR3ZWVuIHNlbWktbWlub3IgYXhpcyBhbmQgbG9jYXRpb24gKi9cbiAgdmFyIFJSOyAvKiBkaXN0YW5jZSBiZXR3ZWVuIGNlbnRlciBhbmQgbG9jYXRpb24gKi9cbiAgdmFyIENUOyAvKiBzaW4gb2YgZ2VvY2VudHJpYyBsYXRpdHVkZSAqL1xuICB2YXIgU1Q7IC8qIGNvcyBvZiBnZW9jZW50cmljIGxhdGl0dWRlICovXG4gIHZhciBSWDtcbiAgdmFyIFJLO1xuICB2YXIgUk47IC8qIEVhcnRoIHJhZGl1cyBhdCBsb2NhdGlvbiAqL1xuICB2YXIgQ1BISTA7IC8qIGNvcyBvZiBzdGFydCBvciBvbGQgZ2VvZGV0aWMgbGF0aXR1ZGUgaW4gaXRlcmF0aW9ucyAqL1xuICB2YXIgU1BISTA7IC8qIHNpbiBvZiBzdGFydCBvciBvbGQgZ2VvZGV0aWMgbGF0aXR1ZGUgaW4gaXRlcmF0aW9ucyAqL1xuICB2YXIgQ1BISTsgLyogY29zIG9mIHNlYXJjaGVkIGdlb2RldGljIGxhdGl0dWRlICovXG4gIHZhciBTUEhJOyAvKiBzaW4gb2Ygc2VhcmNoZWQgZ2VvZGV0aWMgbGF0aXR1ZGUgKi9cbiAgdmFyIFNEUEhJOyAvKiBlbmQtY3JpdGVyaXVtOiBhZGRpdGlvbi10aGVvcmVtIG9mIHNpbihMYXRpdHVkZShpdGVyKS1MYXRpdHVkZShpdGVyLTEpKSAqL1xuICB2YXIgaXRlcjsgLyogIyBvZiBjb250aW5vdXMgaXRlcmF0aW9uLCBtYXguIDMwIGlzIGFsd2F5cyBlbm91Z2ggKHMuYS4pICovXG5cbiAgdmFyIFggPSBwLng7XG4gIHZhciBZID0gcC55O1xuICB2YXIgWiA9IHAueiA/IHAueiA6IDAuMDsgLy8gWiB2YWx1ZSBub3QgYWx3YXlzIHN1cHBsaWVkXG4gIHZhciBMb25naXR1ZGU7XG4gIHZhciBMYXRpdHVkZTtcbiAgdmFyIEhlaWdodDtcblxuICBQID0gTWF0aC5zcXJ0KFggKiBYICsgWSAqIFkpO1xuICBSUiA9IE1hdGguc3FydChYICogWCArIFkgKiBZICsgWiAqIFopO1xuXG4gIC8qICAgICAgc3BlY2lhbCBjYXNlcyBmb3IgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSAqL1xuICBpZiAoUCAvIGEgPCBnZW5hdSkge1xuICAgIC8qICBzcGVjaWFsIGNhc2UsIGlmIFA9MC4gKFg9MC4sIFk9MC4pICovXG4gICAgTG9uZ2l0dWRlID0gMC4wO1xuXG4gICAgLyogIGlmIChYLFksWik9KDAuLDAuLDAuKSB0aGVuIEhlaWdodCBiZWNvbWVzIHNlbWktbWlub3IgYXhpc1xuICAgICAqICBvZiBlbGxpcHNvaWQgKD1jZW50ZXIgb2YgbWFzcyksIExhdGl0dWRlIGJlY29tZXMgUEkvMiAqL1xuICAgIGlmIChSUiAvIGEgPCBnZW5hdSkge1xuICAgICAgTGF0aXR1ZGUgPSBIQUxGX1BJO1xuICAgICAgSGVpZ2h0ID0gLWI7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBwLngsXG4gICAgICAgIHk6IHAueSxcbiAgICAgICAgejogcC56XG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvKiAgZWxsaXBzb2lkYWwgKGdlb2RldGljKSBsb25naXR1ZGVcbiAgICAgKiAgaW50ZXJ2YWw6IC1QSSA8IExvbmdpdHVkZSA8PSArUEkgKi9cbiAgICBMb25naXR1ZGUgPSBNYXRoLmF0YW4yKFksIFgpO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRm9sbG93aW5nIGl0ZXJhdGl2ZSBhbGdvcml0aG0gd2FzIGRldmVsb3BwZWQgYnlcbiAgICogXCJJbnN0aXR1dCBmb3IgRXJkbWVzc3VuZ1wiLCBVbml2ZXJzaXR5IG9mIEhhbm5vdmVyLCBKdWx5IDE5ODguXG4gICAqIEludGVybmV0OiB3d3cuaWZlLnVuaS1oYW5ub3Zlci5kZVxuICAgKiBJdGVyYXRpdmUgY29tcHV0YXRpb24gb2YgQ1BISSxTUEhJIGFuZCBIZWlnaHQuXG4gICAqIEl0ZXJhdGlvbiBvZiBDUEhJIGFuZCBTUEhJIHRvIDEwKiotMTIgcmFkaWFuIHJlc3AuXG4gICAqIDIqMTAqKi03IGFyY3NlYy5cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIENUID0gWiAvIFJSO1xuICBTVCA9IFAgLyBSUjtcbiAgUlggPSAxLjAgLyBNYXRoLnNxcnQoMS4wIC0gZXMgKiAoMi4wIC0gZXMpICogU1QgKiBTVCk7XG4gIENQSEkwID0gU1QgKiAoMS4wIC0gZXMpICogUlg7XG4gIFNQSEkwID0gQ1QgKiBSWDtcbiAgaXRlciA9IDA7XG5cbiAgLyogbG9vcCB0byBmaW5kIHNpbihMYXRpdHVkZSkgcmVzcC4gTGF0aXR1ZGVcbiAgICogdW50aWwgfHNpbihMYXRpdHVkZShpdGVyKS1MYXRpdHVkZShpdGVyLTEpKXwgPCBnZW5hdSAqL1xuICBkbyB7XG4gICAgaXRlcisrO1xuICAgIFJOID0gYSAvIE1hdGguc3FydCgxLjAgLSBlcyAqIFNQSEkwICogU1BISTApO1xuXG4gICAgLyogIGVsbGlwc29pZGFsIChnZW9kZXRpYykgaGVpZ2h0ICovXG4gICAgSGVpZ2h0ID0gUCAqIENQSEkwICsgWiAqIFNQSEkwIC0gUk4gKiAoMS4wIC0gZXMgKiBTUEhJMCAqIFNQSEkwKTtcblxuICAgIFJLID0gZXMgKiBSTiAvIChSTiArIEhlaWdodCk7XG4gICAgUlggPSAxLjAgLyBNYXRoLnNxcnQoMS4wIC0gUksgKiAoMi4wIC0gUkspICogU1QgKiBTVCk7XG4gICAgQ1BISSA9IFNUICogKDEuMCAtIFJLKSAqIFJYO1xuICAgIFNQSEkgPSBDVCAqIFJYO1xuICAgIFNEUEhJID0gU1BISSAqIENQSEkwIC0gQ1BISSAqIFNQSEkwO1xuICAgIENQSEkwID0gQ1BISTtcbiAgICBTUEhJMCA9IFNQSEk7XG4gIH1cbiAgd2hpbGUgKFNEUEhJICogU0RQSEkgPiBnZW5hdTIgJiYgaXRlciA8IG1heGl0ZXIpO1xuXG4gIC8qICAgICAgZWxsaXBzb2lkYWwgKGdlb2RldGljKSBsYXRpdHVkZSAqL1xuICBMYXRpdHVkZSA9IE1hdGguYXRhbihTUEhJIC8gTWF0aC5hYnMoQ1BISSkpO1xuICByZXR1cm4ge1xuICAgIHg6IExvbmdpdHVkZSxcbiAgICB5OiBMYXRpdHVkZSxcbiAgICB6OiBIZWlnaHRcbiAgfTtcbn0gLy8gY3NfZ2VvY2VudHJpY190b19nZW9kZXRpYygpXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gcGpfZ2VvY2VudGljX3RvX3dnczg0KCBwIClcbi8vICBwID0gcG9pbnQgdG8gdHJhbnNmb3JtIGluIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMgKHgseSx6KVxuXG4vKiogcG9pbnQgb2JqZWN0LCBub3RoaW5nIGZhbmN5LCBqdXN0IGFsbG93cyB2YWx1ZXMgdG8gYmVcbiAgICBwYXNzZWQgYmFjayBhbmQgZm9ydGggYnkgcmVmZXJlbmNlIHJhdGhlciB0aGFuIGJ5IHZhbHVlLlxuICAgIE90aGVyIHBvaW50IGNsYXNzZXMgbWF5IGJlIHVzZWQgYXMgbG9uZyBhcyB0aGV5IGhhdmVcbiAgICB4IGFuZCB5IHByb3BlcnRpZXMsIHdoaWNoIHdpbGwgZ2V0IG1vZGlmaWVkIGluIHRoZSB0cmFuc2Zvcm0gbWV0aG9kLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW9jZW50cmljVG9XZ3M4NChwLCBkYXR1bV90eXBlLCBkYXR1bV9wYXJhbXMpIHtcbiAgaWYgKGRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0pIHtcbiAgICAvLyBpZiggeFtpb10gPT09IEhVR0VfVkFMIClcbiAgICAvLyAgICBjb250aW51ZTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcC54ICsgZGF0dW1fcGFyYW1zWzBdLFxuICAgICAgeTogcC55ICsgZGF0dW1fcGFyYW1zWzFdLFxuICAgICAgejogcC56ICsgZGF0dW1fcGFyYW1zWzJdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSB7XG4gICAgdmFyIER4X0JGID0gZGF0dW1fcGFyYW1zWzBdO1xuICAgIHZhciBEeV9CRiA9IGRhdHVtX3BhcmFtc1sxXTtcbiAgICB2YXIgRHpfQkYgPSBkYXR1bV9wYXJhbXNbMl07XG4gICAgdmFyIFJ4X0JGID0gZGF0dW1fcGFyYW1zWzNdO1xuICAgIHZhciBSeV9CRiA9IGRhdHVtX3BhcmFtc1s0XTtcbiAgICB2YXIgUnpfQkYgPSBkYXR1bV9wYXJhbXNbNV07XG4gICAgdmFyIE1fQkYgPSBkYXR1bV9wYXJhbXNbNl07XG4gICAgLy8gaWYoIHhbaW9dID09PSBIVUdFX1ZBTCApXG4gICAgLy8gICAgY29udGludWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IE1fQkYgKiAocC54IC0gUnpfQkYgKiBwLnkgKyBSeV9CRiAqIHAueikgKyBEeF9CRixcbiAgICAgIHk6IE1fQkYgKiAoUnpfQkYgKiBwLnggKyBwLnkgLSBSeF9CRiAqIHAueikgKyBEeV9CRixcbiAgICAgIHo6IE1fQkYgKiAoLVJ5X0JGICogcC54ICsgUnhfQkYgKiBwLnkgKyBwLnopICsgRHpfQkZcbiAgICB9O1xuICB9XG59IC8vIGNzX2dlb2NlbnRyaWNfdG9fd2dzODRcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBwal9nZW9jZW50aWNfZnJvbV93Z3M4NCgpXG4vLyAgY29vcmRpbmF0ZSBzeXN0ZW0gZGVmaW5pdGlvbixcbi8vICBwb2ludCB0byB0cmFuc2Zvcm0gaW4gZ2VvY2VudHJpYyBjb29yZGluYXRlcyAoeCx5LHopXG5leHBvcnQgZnVuY3Rpb24gZ2VvY2VudHJpY0Zyb21XZ3M4NChwLCBkYXR1bV90eXBlLCBkYXR1bV9wYXJhbXMpIHtcbiAgaWYgKGRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0pIHtcbiAgICAvLyBpZiggeFtpb10gPT09IEhVR0VfVkFMIClcbiAgICAvLyAgICBjb250aW51ZTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcC54IC0gZGF0dW1fcGFyYW1zWzBdLFxuICAgICAgeTogcC55IC0gZGF0dW1fcGFyYW1zWzFdLFxuICAgICAgejogcC56IC0gZGF0dW1fcGFyYW1zWzJdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSB7XG4gICAgdmFyIER4X0JGID0gZGF0dW1fcGFyYW1zWzBdO1xuICAgIHZhciBEeV9CRiA9IGRhdHVtX3BhcmFtc1sxXTtcbiAgICB2YXIgRHpfQkYgPSBkYXR1bV9wYXJhbXNbMl07XG4gICAgdmFyIFJ4X0JGID0gZGF0dW1fcGFyYW1zWzNdO1xuICAgIHZhciBSeV9CRiA9IGRhdHVtX3BhcmFtc1s0XTtcbiAgICB2YXIgUnpfQkYgPSBkYXR1bV9wYXJhbXNbNV07XG4gICAgdmFyIE1fQkYgPSBkYXR1bV9wYXJhbXNbNl07XG4gICAgdmFyIHhfdG1wID0gKHAueCAtIER4X0JGKSAvIE1fQkY7XG4gICAgdmFyIHlfdG1wID0gKHAueSAtIER5X0JGKSAvIE1fQkY7XG4gICAgdmFyIHpfdG1wID0gKHAueiAtIER6X0JGKSAvIE1fQkY7XG4gICAgLy8gaWYoIHhbaW9dID09PSBIVUdFX1ZBTCApXG4gICAgLy8gICAgY29udGludWU7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogeF90bXAgKyBSel9CRiAqIHlfdG1wIC0gUnlfQkYgKiB6X3RtcCxcbiAgICAgIHk6IC1Sel9CRiAqIHhfdG1wICsgeV90bXAgKyBSeF9CRiAqIHpfdG1wLFxuICAgICAgejogUnlfQkYgKiB4X3RtcCAtIFJ4X0JGICogeV90bXAgKyB6X3RtcFxuICAgIH07XG4gIH0gLy8gY3NfZ2VvY2VudHJpY19mcm9tX3dnczg0KClcbn1cbiIsImltcG9ydCB7XG4gIFBKRF8zUEFSQU0sXG4gIFBKRF83UEFSQU0sXG4gIFBKRF9HUklEU0hJRlQsXG4gIFBKRF9OT0RBVFVNLFxuICBSMkQsXG4gIFNSU19XR1M4NF9FU1FVQVJFRCxcbiAgU1JTX1dHUzg0X1NFTUlNQUpPUiwgU1JTX1dHUzg0X1NFTUlNSU5PUlxufSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5pbXBvcnQgeyBnZW9kZXRpY1RvR2VvY2VudHJpYywgZ2VvY2VudHJpY1RvR2VvZGV0aWMsIGdlb2NlbnRyaWNUb1dnczg0LCBnZW9jZW50cmljRnJvbVdnczg0LCBjb21wYXJlRGF0dW1zIH0gZnJvbSAnLi9kYXR1bVV0aWxzJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4vY29tbW9uL2FkanVzdF9sb24nO1xuZnVuY3Rpb24gY2hlY2tQYXJhbXModHlwZSkge1xuICByZXR1cm4gKHR5cGUgPT09IFBKRF8zUEFSQU0gfHwgdHlwZSA9PT0gUEpEXzdQQVJBTSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChzb3VyY2UsIGRlc3QsIHBvaW50KSB7XG4gIC8vIFNob3J0IGN1dCBpZiB0aGUgZGF0dW1zIGFyZSBpZGVudGljYWwuXG4gIGlmIChjb21wYXJlRGF0dW1zKHNvdXJjZSwgZGVzdCkpIHtcbiAgICByZXR1cm4gcG9pbnQ7IC8vIGluIHRoaXMgY2FzZSwgemVybyBpcyBzdWNlc3MsXG4gICAgLy8gd2hlcmVhcyBjc19jb21wYXJlX2RhdHVtcyByZXR1cm5zIDEgdG8gaW5kaWNhdGUgVFJVRVxuICAgIC8vIGNvbmZ1c2luZywgc2hvdWxkIGZpeCB0aGlzXG4gIH1cblxuICAvLyBFeHBsaWNpdGx5IHNraXAgZGF0dW0gdHJhbnNmb3JtIGJ5IHNldHRpbmcgJ2RhdHVtPW5vbmUnIGFzIHBhcmFtZXRlciBmb3IgZWl0aGVyIHNvdXJjZSBvciBkZXN0XG4gIGlmIChzb3VyY2UuZGF0dW1fdHlwZSA9PT0gUEpEX05PREFUVU0gfHwgZGVzdC5kYXR1bV90eXBlID09PSBQSkRfTk9EQVRVTSkge1xuICAgIHJldHVybiBwb2ludDtcbiAgfVxuXG4gIC8vIElmIHRoaXMgZGF0dW0gcmVxdWlyZXMgZ3JpZCBzaGlmdHMsIHRoZW4gYXBwbHkgaXQgdG8gZ2VvZGV0aWMgY29vcmRpbmF0ZXMuXG4gIHZhciBzb3VyY2VfYSA9IHNvdXJjZS5hO1xuICB2YXIgc291cmNlX2VzID0gc291cmNlLmVzO1xuICBpZiAoc291cmNlLmRhdHVtX3R5cGUgPT09IFBKRF9HUklEU0hJRlQpIHtcbiAgICB2YXIgZ3JpZFNoaWZ0Q29kZSA9IGFwcGx5R3JpZFNoaWZ0KHNvdXJjZSwgZmFsc2UsIHBvaW50KTtcbiAgICBpZiAoZ3JpZFNoaWZ0Q29kZSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc291cmNlX2EgPSBTUlNfV0dTODRfU0VNSU1BSk9SO1xuICAgIHNvdXJjZV9lcyA9IFNSU19XR1M4NF9FU1FVQVJFRDtcbiAgfVxuXG4gIHZhciBkZXN0X2EgPSBkZXN0LmE7XG4gIHZhciBkZXN0X2IgPSBkZXN0LmI7XG4gIHZhciBkZXN0X2VzID0gZGVzdC5lcztcbiAgaWYgKGRlc3QuZGF0dW1fdHlwZSA9PT0gUEpEX0dSSURTSElGVCkge1xuICAgIGRlc3RfYSA9IFNSU19XR1M4NF9TRU1JTUFKT1I7XG4gICAgZGVzdF9iID0gU1JTX1dHUzg0X1NFTUlNSU5PUjtcbiAgICBkZXN0X2VzID0gU1JTX1dHUzg0X0VTUVVBUkVEO1xuICB9XG5cbiAgLy8gRG8gd2UgbmVlZCB0byBnbyB0aHJvdWdoIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXM/XG4gIGlmIChzb3VyY2VfZXMgPT09IGRlc3RfZXMgJiYgc291cmNlX2EgPT09IGRlc3RfYSAmJiAhY2hlY2tQYXJhbXMoc291cmNlLmRhdHVtX3R5cGUpICYmICFjaGVja1BhcmFtcyhkZXN0LmRhdHVtX3R5cGUpKSB7XG4gICAgcmV0dXJuIHBvaW50O1xuICB9XG5cbiAgLy8gQ29udmVydCB0byBnZW9jZW50cmljIGNvb3JkaW5hdGVzLlxuICBwb2ludCA9IGdlb2RldGljVG9HZW9jZW50cmljKHBvaW50LCBzb3VyY2VfZXMsIHNvdXJjZV9hKTtcbiAgLy8gQ29udmVydCBiZXR3ZWVuIGRhdHVtc1xuICBpZiAoY2hlY2tQYXJhbXMoc291cmNlLmRhdHVtX3R5cGUpKSB7XG4gICAgcG9pbnQgPSBnZW9jZW50cmljVG9XZ3M4NChwb2ludCwgc291cmNlLmRhdHVtX3R5cGUsIHNvdXJjZS5kYXR1bV9wYXJhbXMpO1xuICB9XG4gIGlmIChjaGVja1BhcmFtcyhkZXN0LmRhdHVtX3R5cGUpKSB7XG4gICAgcG9pbnQgPSBnZW9jZW50cmljRnJvbVdnczg0KHBvaW50LCBkZXN0LmRhdHVtX3R5cGUsIGRlc3QuZGF0dW1fcGFyYW1zKTtcbiAgfVxuICBwb2ludCA9IGdlb2NlbnRyaWNUb0dlb2RldGljKHBvaW50LCBkZXN0X2VzLCBkZXN0X2EsIGRlc3RfYik7XG5cbiAgaWYgKGRlc3QuZGF0dW1fdHlwZSA9PT0gUEpEX0dSSURTSElGVCkge1xuICAgIHZhciBkZXN0R3JpZFNoaWZ0UmVzdWx0ID0gYXBwbHlHcmlkU2hpZnQoZGVzdCwgdHJ1ZSwgcG9pbnQpO1xuICAgIGlmIChkZXN0R3JpZFNoaWZ0UmVzdWx0ICE9PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwb2ludDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5R3JpZFNoaWZ0KHNvdXJjZSwgaW52ZXJzZSwgcG9pbnQpIHtcbiAgaWYgKHNvdXJjZS5ncmlkcyA9PT0gbnVsbCB8fCBzb3VyY2UuZ3JpZHMubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc29sZS5sb2coJ0dyaWQgc2hpZnQgZ3JpZHMgbm90IGZvdW5kJyk7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHZhciBpbnB1dCA9IHsgeDogLXBvaW50LngsIHk6IHBvaW50LnkgfTtcbiAgdmFyIG91dHB1dCA9IHsgeDogTnVtYmVyLk5hTiwgeTogTnVtYmVyLk5hTiB9O1xuICB2YXIgYXR0ZW1wdGVkR3JpZHMgPSBbXTtcbiAgb3V0ZXI6XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlLmdyaWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGdyaWQgPSBzb3VyY2UuZ3JpZHNbaV07XG4gICAgYXR0ZW1wdGVkR3JpZHMucHVzaChncmlkLm5hbWUpO1xuICAgIGlmIChncmlkLmlzTnVsbCkge1xuICAgICAgb3V0cHV0ID0gaW5wdXQ7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKGdyaWQuZ3JpZCA9PT0gbnVsbCkge1xuICAgICAgaWYgKGdyaWQubWFuZGF0b3J5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdVbmFibGUgdG8gZmluZCBtYW5kYXRvcnkgZ3JpZCBcXCcnICsgZ3JpZC5uYW1lICsgJ1xcJycpO1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdmFyIHN1YmdyaWRzID0gZ3JpZC5ncmlkLnN1YmdyaWRzO1xuICAgIGZvciAodmFyIGogPSAwLCBqaiA9IHN1YmdyaWRzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgIHZhciBzdWJncmlkID0gc3ViZ3JpZHNbal07XG4gICAgICAvLyBza2lwIHRhYmxlcyB0aGF0IGRvbid0IG1hdGNoIG91ciBwb2ludCBhdCBhbGxcbiAgICAgIHZhciBlcHNpbG9uID0gKE1hdGguYWJzKHN1YmdyaWQuZGVsWzFdKSArIE1hdGguYWJzKHN1YmdyaWQuZGVsWzBdKSkgLyAxMDAwMC4wO1xuICAgICAgdmFyIG1pblggPSBzdWJncmlkLmxsWzBdIC0gZXBzaWxvbjtcbiAgICAgIHZhciBtaW5ZID0gc3ViZ3JpZC5sbFsxXSAtIGVwc2lsb247XG4gICAgICB2YXIgbWF4WCA9IHN1YmdyaWQubGxbMF0gKyAoc3ViZ3JpZC5saW1bMF0gLSAxKSAqIHN1YmdyaWQuZGVsWzBdICsgZXBzaWxvbjtcbiAgICAgIHZhciBtYXhZID0gc3ViZ3JpZC5sbFsxXSArIChzdWJncmlkLmxpbVsxXSAtIDEpICogc3ViZ3JpZC5kZWxbMV0gKyBlcHNpbG9uO1xuICAgICAgaWYgKG1pblkgPiBpbnB1dC55IHx8IG1pblggPiBpbnB1dC54IHx8IG1heFkgPCBpbnB1dC55IHx8IG1heFggPCBpbnB1dC54KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgb3V0cHV0ID0gYXBwbHlTdWJncmlkU2hpZnQoaW5wdXQsIGludmVyc2UsIHN1YmdyaWQpO1xuICAgICAgaWYgKCFpc05hTihvdXRwdXQueCkpIHtcbiAgICAgICAgYnJlYWsgb3V0ZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChpc05hTihvdXRwdXQueCkpIHtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGZpbmQgYSBncmlkIHNoaWZ0IHRhYmxlIGZvciBsb2NhdGlvbiBcXCcnXG4gICAgICArIC1pbnB1dC54ICogUjJEICsgJyAnICsgaW5wdXQueSAqIFIyRCArICcgdHJpZWQ6IFxcJycgKyBhdHRlbXB0ZWRHcmlkcyArICdcXCcnKTtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgcG9pbnQueCA9IC1vdXRwdXQueDtcbiAgcG9pbnQueSA9IG91dHB1dC55O1xuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gYXBwbHlTdWJncmlkU2hpZnQocGluLCBpbnZlcnNlLCBjdCkge1xuICB2YXIgdmFsID0geyB4OiBOdW1iZXIuTmFOLCB5OiBOdW1iZXIuTmFOIH07XG4gIGlmIChpc05hTihwaW4ueCkpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIHZhciB0YiA9IHsgeDogcGluLngsIHk6IHBpbi55IH07XG4gIHRiLnggLT0gY3QubGxbMF07XG4gIHRiLnkgLT0gY3QubGxbMV07XG4gIHRiLnggPSBhZGp1c3RfbG9uKHRiLnggLSBNYXRoLlBJKSArIE1hdGguUEk7XG4gIHZhciB0ID0gbmFkSW50ZXJwb2xhdGUodGIsIGN0KTtcbiAgaWYgKGludmVyc2UpIHtcbiAgICBpZiAoaXNOYU4odC54KSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdC54ID0gdGIueCAtIHQueDtcbiAgICB0LnkgPSB0Yi55IC0gdC55O1xuICAgIHZhciBpID0gOSwgdG9sID0gMWUtMTI7XG4gICAgdmFyIGRpZiwgZGVsO1xuICAgIGRvIHtcbiAgICAgIGRlbCA9IG5hZEludGVycG9sYXRlKHQsIGN0KTtcbiAgICAgIGlmIChpc05hTihkZWwueCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ludmVyc2UgZ3JpZCBzaGlmdCBpdGVyYXRpb24gZmFpbGVkLCBwcmVzdW1hYmx5IGF0IGdyaWQgZWRnZS4gIFVzaW5nIGZpcnN0IGFwcHJveGltYXRpb24uJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGlmID0geyB4OiB0Yi54IC0gKGRlbC54ICsgdC54KSwgeTogdGIueSAtIChkZWwueSArIHQueSkgfTtcbiAgICAgIHQueCArPSBkaWYueDtcbiAgICAgIHQueSArPSBkaWYueTtcbiAgICB9IHdoaWxlIChpLS0gJiYgTWF0aC5hYnMoZGlmLngpID4gdG9sICYmIE1hdGguYWJzKGRpZi55KSA+IHRvbCk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZygnSW52ZXJzZSBncmlkIHNoaWZ0IGl0ZXJhdG9yIGZhaWxlZCB0byBjb252ZXJnZS4nKTtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIHZhbC54ID0gYWRqdXN0X2xvbih0LnggKyBjdC5sbFswXSk7XG4gICAgdmFsLnkgPSB0LnkgKyBjdC5sbFsxXTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIWlzTmFOKHQueCkpIHtcbiAgICAgIHZhbC54ID0gcGluLnggKyB0Lng7XG4gICAgICB2YWwueSA9IHBpbi55ICsgdC55O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBuYWRJbnRlcnBvbGF0ZShwaW4sIGN0KSB7XG4gIHZhciB0ID0geyB4OiBwaW4ueCAvIGN0LmRlbFswXSwgeTogcGluLnkgLyBjdC5kZWxbMV0gfTtcbiAgdmFyIGluZHggPSB7IHg6IE1hdGguZmxvb3IodC54KSwgeTogTWF0aC5mbG9vcih0LnkpIH07XG4gIHZhciBmcmN0ID0geyB4OiB0LnggLSAxLjAgKiBpbmR4LngsIHk6IHQueSAtIDEuMCAqIGluZHgueSB9O1xuICB2YXIgdmFsID0geyB4OiBOdW1iZXIuTmFOLCB5OiBOdW1iZXIuTmFOIH07XG4gIHZhciBpbng7XG4gIGlmIChpbmR4LnggPCAwIHx8IGluZHgueCA+PSBjdC5saW1bMF0pIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIGlmIChpbmR4LnkgPCAwIHx8IGluZHgueSA+PSBjdC5saW1bMV0pIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIGlueCA9IChpbmR4LnkgKiBjdC5saW1bMF0pICsgaW5keC54O1xuICB2YXIgZjAwID0geyB4OiBjdC5jdnNbaW54XVswXSwgeTogY3QuY3ZzW2lueF1bMV0gfTtcbiAgaW54Kys7XG4gIHZhciBmMTAgPSB7IHg6IGN0LmN2c1tpbnhdWzBdLCB5OiBjdC5jdnNbaW54XVsxXSB9O1xuICBpbnggKz0gY3QubGltWzBdO1xuICB2YXIgZjExID0geyB4OiBjdC5jdnNbaW54XVswXSwgeTogY3QuY3ZzW2lueF1bMV0gfTtcbiAgaW54LS07XG4gIHZhciBmMDEgPSB7IHg6IGN0LmN2c1tpbnhdWzBdLCB5OiBjdC5jdnNbaW54XVsxXSB9O1xuICB2YXIgbTExID0gZnJjdC54ICogZnJjdC55LCBtMTAgPSBmcmN0LnggKiAoMS4wIC0gZnJjdC55KSxcbiAgICBtMDAgPSAoMS4wIC0gZnJjdC54KSAqICgxLjAgLSBmcmN0LnkpLCBtMDEgPSAoMS4wIC0gZnJjdC54KSAqIGZyY3QueTtcbiAgdmFsLnggPSAobTAwICogZjAwLnggKyBtMTAgKiBmMTAueCArIG0wMSAqIGYwMS54ICsgbTExICogZjExLngpO1xuICB2YWwueSA9IChtMDAgKiBmMDAueSArIG0xMCAqIGYxMC55ICsgbTAxICogZjAxLnkgKyBtMTEgKiBmMTEueSk7XG4gIHJldHVybiB2YWw7XG59XG4iLCJpbXBvcnQgZ2xvYmFscyBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgcGFyc2VQcm9qIGZyb20gJy4vcHJvalN0cmluZyc7XG5pbXBvcnQgd2t0IGZyb20gJ3drdC1wYXJzZXInO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb2plY3Rpb25EZWZpbml0aW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGl0bGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcHJvak5hbWVdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2VsbHBzXVxuICogQHByb3BlcnR5IHtpbXBvcnQoJy4vUHJvai5qcycpLkRhdHVtRGVmaW5pdGlvbn0gW2RhdHVtXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkYXR1bU5hbWVdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3JmXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsYXQwXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsYXQxXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsYXQyXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsYXRfdHNdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xvbmcwXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsb25nMV1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbG9uZzJdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2FscGhhXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsb25nY11cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbeDBdXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3kwXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtrMF1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbYV1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbYl1cbiAqIEBwcm9wZXJ0eSB7dHJ1ZX0gW1JfQV1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbem9uZV1cbiAqIEBwcm9wZXJ0eSB7dHJ1ZX0gW3V0bVNvdXRoXVxuICogQHByb3BlcnR5IHtzdHJpbmd8QXJyYXk8bnVtYmVyPn0gW2RhdHVtX3BhcmFtc11cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbdG9fbWV0ZXJdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3VuaXRzXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtmcm9tX2dyZWVud2ljaF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGF0dW1Db2RlXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYWRncmlkc11cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbYXhpc11cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3NwaGVyZV1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbcmVjdGlmaWVkX2dyaWRfYW5nbGVdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFthcHByb3hdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtvdmVyXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtwcm9qU3RyXVxuICogQHByb3BlcnR5IHs8VCBleHRlbmRzIGltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlcz4oY29vcmRpbmF0ZXM6IFQsIGVuZm9yY2VBeGlzPzogYm9vbGVhbikgPT4gVH0gaW52ZXJzZVxuICogQHByb3BlcnR5IHs8VCBleHRlbmRzIGltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlcz4oY29vcmRpbmF0ZXM6IFQsIGVuZm9yY2VBeGlzPzogYm9vbGVhbikgPT4gVH0gZm9yd2FyZFxuICovXG5cbi8qKlxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd8UHJvamVjdGlvbkRlZmluaXRpb258aW1wb3J0KCcuL2NvcmUuanMnKS5QUk9KSlNPTkRlZmluaXRpb259IHByb2plY3Rpb25cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG4vKipcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtBcnJheTxbc3RyaW5nLCBzdHJpbmddPn0gbmFtZVxuICogQHJldHVybnMge0FycmF5PFByb2plY3Rpb25EZWZpbml0aW9ufHVuZGVmaW5lZD59XG4gKi9cbi8qKlxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHJldHVybnMge1Byb2plY3Rpb25EZWZpbml0aW9ufVxuICovXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmcgfCBBcnJheTxBcnJheTxzdHJpbmc+PiB8IFBhcnRpYWw8UmVjb3JkPCdFUFNHJ3wnRVNSSSd8J0lBVTIwMDAnLCBQcm9qZWN0aW9uRGVmaW5pdGlvbj4+fSBuYW1lXG4gKiBAcmV0dXJucyB7UHJvamVjdGlvbkRlZmluaXRpb24gfCBBcnJheTxQcm9qZWN0aW9uRGVmaW5pdGlvbnx1bmRlZmluZWQ+IHwgdm9pZH1cbiAqL1xuZnVuY3Rpb24gZGVmcyhuYW1lKSB7XG4gIC8qIGdsb2JhbCBjb25zb2xlICovXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICB2YXIgZGVmID0gYXJndW1lbnRzWzFdO1xuICAgIGlmICh0eXBlb2YgZGVmID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKGRlZi5jaGFyQXQoMCkgPT09ICcrJykge1xuICAgICAgICBkZWZzWy8qKiBAdHlwZSB7c3RyaW5nfSAqLyAobmFtZSldID0gcGFyc2VQcm9qKGFyZ3VtZW50c1sxXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWZzWy8qKiBAdHlwZSB7c3RyaW5nfSAqLyAobmFtZSldID0gd2t0KGFyZ3VtZW50c1sxXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkZWYgJiYgdHlwZW9mIGRlZiA9PT0gJ29iamVjdCcgJiYgISgncHJvak5hbWUnIGluIGRlZikpIHtcbiAgICAgIC8vIFBST0pKU09OXG4gICAgICBkZWZzWy8qKiBAdHlwZSB7c3RyaW5nfSAqLyAobmFtZSldID0gd2t0KGFyZ3VtZW50c1sxXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZnNbLyoqIEB0eXBlIHtzdHJpbmd9ICovIChuYW1lKV0gPSBkZWY7XG4gICAgICBpZiAoIWRlZikge1xuICAgICAgICBkZWxldGUgZGVmc1svKiogQHR5cGUge3N0cmluZ30gKi8gKG5hbWUpXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5hbWUpKSB7XG4gICAgICByZXR1cm4gbmFtZS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICByZXR1cm4gZGVmcy5hcHBseSh0aGF0LCB2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZGVmcyh2KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChuYW1lIGluIGRlZnMpIHtcbiAgICAgICAgcmV0dXJuIGRlZnNbbmFtZV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgnRVBTRycgaW4gbmFtZSkge1xuICAgICAgZGVmc1snRVBTRzonICsgbmFtZS5FUFNHXSA9IG5hbWU7XG4gICAgfSBlbHNlIGlmICgnRVNSSScgaW4gbmFtZSkge1xuICAgICAgZGVmc1snRVNSSTonICsgbmFtZS5FU1JJXSA9IG5hbWU7XG4gICAgfSBlbHNlIGlmICgnSUFVMjAwMCcgaW4gbmFtZSkge1xuICAgICAgZGVmc1snSUFVMjAwMDonICsgbmFtZS5JQVUyMDAwXSA9IG5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbn1cbmdsb2JhbHMoZGVmcyk7XG5leHBvcnQgZGVmYXVsdCBkZWZzO1xuIiwiaW1wb3J0IHsgU0lYVEgsIFJBNCwgUkE2LCBFUFNMTiB9IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIEVsbGlwc29pZCB9IGZyb20gJy4vY29uc3RhbnRzL0VsbGlwc29pZCc7XG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCc7XG5cbmNvbnN0IFdHUzg0ID0gRWxsaXBzb2lkLldHUzg0OyAvLyBkZWZhdWx0IGVsbGlwc29pZFxuXG5leHBvcnQgZnVuY3Rpb24gZWNjZW50cmljaXR5KGEsIGIsIHJmLCBSX0EpIHtcbiAgdmFyIGEyID0gYSAqIGE7IC8vIHVzZWQgaW4gZ2VvY2VudHJpY1xuICB2YXIgYjIgPSBiICogYjsgLy8gdXNlZCBpbiBnZW9jZW50cmljXG4gIHZhciBlcyA9IChhMiAtIGIyKSAvIGEyOyAvLyBlIF4gMlxuICB2YXIgZSA9IDA7XG4gIGlmIChSX0EpIHtcbiAgICBhICo9IDEgLSBlcyAqIChTSVhUSCArIGVzICogKFJBNCArIGVzICogUkE2KSk7XG4gICAgYTIgPSBhICogYTtcbiAgICBlcyA9IDA7XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguc3FydChlcyk7IC8vIGVjY2VudHJpY2l0eVxuICB9XG4gIHZhciBlcDIgPSAoYTIgLSBiMikgLyBiMjsgLy8gdXNlZCBpbiBnZW9jZW50cmljXG4gIHJldHVybiB7XG4gICAgZXM6IGVzLFxuICAgIGU6IGUsXG4gICAgZXAyOiBlcDJcbiAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzcGhlcmUoYSwgYiwgcmYsIGVsbHBzLCBzcGhlcmUpIHtcbiAgaWYgKCFhKSB7IC8vIGRvIHdlIGhhdmUgYW4gZWxsaXBzb2lkP1xuICAgIHZhciBlbGxpcHNlID0gbWF0Y2goRWxsaXBzb2lkLCBlbGxwcyk7XG4gICAgaWYgKCFlbGxpcHNlKSB7XG4gICAgICBlbGxpcHNlID0gV0dTODQ7XG4gICAgfVxuICAgIGEgPSBlbGxpcHNlLmE7XG4gICAgYiA9IGVsbGlwc2UuYjtcbiAgICByZiA9IGVsbGlwc2UucmY7XG4gIH1cblxuICBpZiAocmYgJiYgIWIpIHtcbiAgICBiID0gKDEuMCAtIDEuMCAvIHJmKSAqIGE7XG4gIH1cbiAgaWYgKHJmID09PSAwIHx8IE1hdGguYWJzKGEgLSBiKSA8IEVQU0xOKSB7XG4gICAgc3BoZXJlID0gdHJ1ZTtcbiAgICBiID0gYTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGE6IGEsXG4gICAgYjogYixcbiAgICByZjogcmYsXG4gICAgc3BoZXJlOiBzcGhlcmVcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG4gIGRlc3RpbmF0aW9uID0gZGVzdGluYXRpb24gfHwge307XG4gIHZhciB2YWx1ZSwgcHJvcGVydHk7XG4gIGlmICghc291cmNlKSB7XG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICB9XG4gIGZvciAocHJvcGVydHkgaW4gc291cmNlKSB7XG4gICAgdmFsdWUgPSBzb3VyY2VbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGRlZnMpIHtcbiAgZGVmcygnRVBTRzo0MzI2JywgJyt0aXRsZT1XR1MgODQgKGxvbmcvbGF0KSArcHJvaj1sb25nbGF0ICtlbGxwcz1XR1M4NCArZGF0dW09V0dTODQgK3VuaXRzPWRlZ3JlZXMnKTtcbiAgZGVmcygnRVBTRzo0MjY5JywgJyt0aXRsZT1OQUQ4MyAobG9uZy9sYXQpICtwcm9qPWxvbmdsYXQgK2E9NjM3ODEzNy4wICtiPTYzNTY3NTIuMzE0MTQwMzYgK2VsbHBzPUdSUzgwICtkYXR1bT1OQUQ4MyArdW5pdHM9ZGVncmVlcycpO1xuICBkZWZzKCdFUFNHOjM4NTcnLCAnK3RpdGxlPVdHUyA4NCAvIFBzZXVkby1NZXJjYXRvciArcHJvaj1tZXJjICthPTYzNzgxMzcgK2I9NjM3ODEzNyArbGF0X3RzPTAuMCArbG9uXzA9MC4wICt4XzA9MC4wICt5XzA9MCAraz0xLjAgK3VuaXRzPW0gK25hZGdyaWRzPUBudWxsICtub19kZWZzJyk7XG4gIC8vIFVUTSBXR1M4NFxuICBmb3IgKHZhciBpID0gMTsgaSA8PSA2MDsgKytpKSB7XG4gICAgZGVmcygnRVBTRzonICsgKDMyNjAwICsgaSksICcrcHJvaj11dG0gK3pvbmU9JyArIGkgKyAnICtkYXR1bT1XR1M4NCArdW5pdHM9bScpO1xuICAgIGRlZnMoJ0VQU0c6JyArICgzMjcwMCArIGkpLCAnK3Byb2o9dXRtICt6b25lPScgKyBpICsgJyArc291dGggK2RhdHVtPVdHUzg0ICt1bml0cz1tJyk7XG4gIH1cbiAgZGVmcygnRVBTRzo1MDQxJywgJyt0aXRsZT1XR1MgODQgLyBVUFMgTm9ydGggKEUsTikgK3Byb2o9c3RlcmUgK2xhdF8wPTkwICtsb25fMD0wICtrPTAuOTk0ICt4XzA9MjAwMDAwMCAreV8wPTIwMDAwMDAgK2RhdHVtPVdHUzg0ICt1bml0cz1tJyk7XG4gIGRlZnMoJ0VQU0c6NTA0MicsICcrdGl0bGU9V0dTIDg0IC8gVVBTIFNvdXRoIChFLE4pICtwcm9qPXN0ZXJlICtsYXRfMD0tOTAgK2xvbl8wPTAgK2s9MC45OTQgK3hfMD0yMDAwMDAwICt5XzA9MjAwMDAwMCArZGF0dW09V0dTODQgK3VuaXRzPW0nKTtcblxuICBkZWZzLldHUzg0ID0gZGVmc1snRVBTRzo0MzI2J107XG4gIGRlZnNbJ0VQU0c6Mzc4NSddID0gZGVmc1snRVBTRzozODU3J107IC8vIG1haW50YWluIGJhY2t3YXJkIGNvbXBhdCwgb2ZmaWNpYWwgY29kZSBpcyAzODU3XG4gIGRlZnMuR09PR0xFID0gZGVmc1snRVBTRzozODU3J107XG4gIGRlZnNbJ0VQU0c6OTAwOTEzJ10gPSBkZWZzWydFUFNHOjM4NTcnXTtcbiAgZGVmc1snRVBTRzoxMDIxMTMnXSA9IGRlZnNbJ0VQU0c6Mzg1NyddO1xufVxuIiwiaW1wb3J0IGNvcmUgZnJvbSAnLi9jb3JlJztcbmltcG9ydCBQcm9qIGZyb20gJy4vUHJvaic7XG5pbXBvcnQgUG9pbnQgZnJvbSAnLi9Qb2ludCc7XG5pbXBvcnQgY29tbW9uIGZyb20gJy4vY29tbW9uL3RvUG9pbnQnO1xuaW1wb3J0IGRlZnMgZnJvbSAnLi9kZWZzJztcbmltcG9ydCBuYWRncmlkIGZyb20gJy4vbmFkZ3JpZCc7XG5pbXBvcnQgdHJhbnNmb3JtIGZyb20gJy4vdHJhbnNmb3JtJztcbmltcG9ydCBtZ3JzIGZyb20gJ21ncnMnO1xuaW1wb3J0IGluY2x1ZGVkUHJvamVjdGlvbnMgZnJvbSAnLi4vcHJvanMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE1ncnNcbiAqIEBwcm9wZXJ0eSB7KGxvbmxhdDogW251bWJlciwgbnVtYmVyXSkgPT4gc3RyaW5nfSBmb3J3YXJkXG4gKiBAcHJvcGVydHkgeyhtZ3JzU3RyaW5nOiBzdHJpbmcpID0+IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdfSBpbnZlcnNlXG4gKiBAcHJvcGVydHkgeyhtZ3JzU3RyaW5nOiBzdHJpbmcpID0+IFtudW1iZXIsIG51bWJlcl19IHRvUG9pbnRcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSBQcm9qZWN0aW9uRGVmaW5pdGlvblxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9jb3JlJykuVGVtcGxhdGVDb29yZGluYXRlc30gVGVtcGxhdGVDb29yZGluYXRlc1xuICogQHR5cGVkZWYge2ltcG9ydCgnLi9jb3JlJykuSW50ZXJmYWNlQ29vcmRpbmF0ZXN9IEludGVyZmFjZUNvb3JkaW5hdGVzXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2NvcmUnKS5Db252ZXJ0ZXJ9IENvbnZlcnRlclxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9Qcm9qJykuRGF0dW1EZWZpbml0aW9ufSBEYXR1bURlZmluaXRpb25cbiAqL1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7aW1wb3J0KCcuL2NvcmUnKS5UZW1wbGF0ZUNvb3JkaW5hdGVzfSBUXG4gKiBAdHlwZSB7Y29yZTxUPiAmIHtkZWZhdWx0RGF0dW06IHN0cmluZywgUHJvajogdHlwZW9mIFByb2osIFdHUzg0OiBQcm9qLCBQb2ludDogdHlwZW9mIFBvaW50LCB0b1BvaW50OiB0eXBlb2YgY29tbW9uLCBkZWZzOiB0eXBlb2YgZGVmcywgbmFkZ3JpZDogdHlwZW9mIG5hZGdyaWQsIHRyYW5zZm9ybTogdHlwZW9mIHRyYW5zZm9ybSwgbWdyczogTWdycywgdmVyc2lvbjogc3RyaW5nfX1cbiAqL1xuY29uc3QgcHJvajQgPSBPYmplY3QuYXNzaWduKGNvcmUsIHtcbiAgZGVmYXVsdERhdHVtOiAnV0dTODQnLFxuICBQcm9qLFxuICBXR1M4NDogbmV3IFByb2ooJ1dHUzg0JyksXG4gIFBvaW50LFxuICB0b1BvaW50OiBjb21tb24sXG4gIGRlZnMsXG4gIG5hZGdyaWQsXG4gIHRyYW5zZm9ybSxcbiAgbWdycyxcbiAgdmVyc2lvbjogJ19fVkVSU0lPTl9fJ1xufSk7XG5pbmNsdWRlZFByb2plY3Rpb25zKHByb2o0KTtcbmV4cG9ydCBkZWZhdWx0IHByb2o0O1xuIiwidmFyIGlnbm9yZWRDaGFyID0gL1tcXHNfXFwtXFwvXFwoXFwpXS9nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2gob2JqLCBrZXkpIHtcbiAgaWYgKG9ialtrZXldKSB7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgdmFyIGxrZXkgPSBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGlnbm9yZWRDaGFyLCAnJyk7XG4gIHZhciBpID0gLTE7XG4gIHZhciB0ZXN0a2V5LCBwcm9jZXNzZWRLZXk7XG4gIHdoaWxlICgrK2kgPCBrZXlzLmxlbmd0aCkge1xuICAgIHRlc3RrZXkgPSBrZXlzW2ldO1xuICAgIHByb2Nlc3NlZEtleSA9IHRlc3RrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGlnbm9yZWRDaGFyLCAnJyk7XG4gICAgaWYgKHByb2Nlc3NlZEtleSA9PT0gbGtleSkge1xuICAgICAgcmV0dXJuIG9ialt0ZXN0a2V5XTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogUmVzb3VyY2VzIGZvciBkZXRhaWxzIG9mIE5UdjIgZmlsZSBmb3JtYXRzOlxuICogLSBodHRwczovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAxNDAxMjcyMDQ4MjJpZl8vaHR0cDovL3d3dy5tZ3MuZ292Lm9uLmNhOjgwL3N0ZHByb2Rjb25zdW1lL2dyb3Vwcy9jb250ZW50L0BtZ3MvQGlhbmRpdC9kb2N1bWVudHMvcmVzb3VyY2VsaXN0L3N0ZWwwMl8wNDc0NDcucGRmXG4gKiAtIGh0dHA6Ly9taW1ha2EuY29tL2hlbHAvZ3MvaHRtbC8wMDRfTlRWMiUyMERhdGElMjBGb3JtYXQuaHRtXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBOYWRncmlkSW5mb1xuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIE5BRCBncmlkIG9yICdudWxsJyBpZiBub3Qgc3BlY2lmaWVkLlxuICogQHByb3BlcnR5IHtib29sZWFufSBtYW5kYXRvcnkgSW5kaWNhdGVzIGlmIHRoZSBncmlkIGlzIG1hbmRhdG9yeSAodHJ1ZSkgb3Igb3B0aW9uYWwgKGZhbHNlKS5cbiAqIEBwcm9wZXJ0eSB7Kn0gZ3JpZCBUaGUgbG9hZGVkIE5BRCBncmlkIG9iamVjdCwgb3IgbnVsbCBpZiBub3QgbG9hZGVkIG9yIG5vdCBhcHBsaWNhYmxlLlxuICogQHByb3BlcnR5IHtib29sZWFufSBpc051bGwgVHJ1ZSBpZiB0aGUgZ3JpZCBpcyBleHBsaWNpdGx5ICdudWxsJywgb3RoZXJ3aXNlIGZhbHNlLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTlRWMkdyaWRPcHRpb25zXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtpbmNsdWRlRXJyb3JGaWVsZHM9dHJ1ZV0gV2hldGhlciB0byBpbmNsdWRlIGVycm9yIGZpZWxkcyBpbiB0aGUgc3ViZ3JpZHMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBOYWRncmlkSGVhZGVyXG4gKiBAcHJvcGVydHkge251bWJlcn0gW25GaWVsZHNdIE51bWJlciBvZiBmaWVsZHMgaW4gdGhlIGhlYWRlci5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbblN1YmdyaWRGaWVsZHNdIE51bWJlciBvZiBmaWVsZHMgaW4gZWFjaCBzdWJncmlkIGhlYWRlci5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBuU3ViZ3JpZHMgTnVtYmVyIG9mIHN1YmdyaWRzIGluIHRoZSBmaWxlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzaGlmdFR5cGVdIFR5cGUgb2Ygc2hpZnQgKGUuZy4sIFwiU0VDT05EU1wiKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbZnJvbVNlbWlNYWpvckF4aXNdIFNvdXJjZSBlbGxpcHNvaWQgc2VtaS1tYWpvciBheGlzLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtmcm9tU2VtaU1pbm9yQXhpc10gU291cmNlIGVsbGlwc29pZCBzZW1pLW1pbm9yIGF4aXMuXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3RvU2VtaU1ham9yQXhpc10gVGFyZ2V0IGVsbGlwc29pZCBzZW1pLW1ham9yIGF4aXMuXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3RvU2VtaU1pbm9yQXhpc10gVGFyZ2V0IGVsbGlwc29pZCBzZW1pLW1pbm9yIGF4aXMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTdWJncmlkXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGxsIExvd2VyIGxlZnQgY29ybmVyIG9mIHRoZSBncmlkIGluIHJhZGlhbnMgW2xvbmdpdHVkZSwgbGF0aXR1ZGVdLlxuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBkZWwgR3JpZCBzcGFjaW5nIGluIHJhZGlhbnMgW2xvbmdpdHVkZSBpbnRlcnZhbCwgbGF0aXR1ZGUgaW50ZXJ2YWxdLlxuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBsaW0gTnVtYmVyIG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQgW2xvbmdpdHVkZSBjb2x1bW5zLCBsYXRpdHVkZSBjb2x1bW5zXS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbY291bnRdIFRvdGFsIG51bWJlciBvZiBncmlkIG5vZGVzLlxuICogQHByb3BlcnR5IHtBcnJheX0gY3ZzIE1hcHBlZCBub2RlIHZhbHVlcyBmb3IgdGhlIGdyaWQuXG4gKi9cblxuLyoqIEB0eXBlZGVmIHt7aGVhZGVyOiBOYWRncmlkSGVhZGVyLCBzdWJncmlkczogQXJyYXk8U3ViZ3JpZD59fSBOQURHcmlkICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gR2VvVElGRlxuICogQHByb3BlcnR5IHsoKSA9PiBQcm9taXNlPG51bWJlcj59IGdldEltYWdlQ291bnQgLSBSZXR1cm5zIHRoZSBudW1iZXIgb2YgaW1hZ2VzIGluIHRoZSBHZW9USUZGLlxuICogQHByb3BlcnR5IHsoaW5kZXg6IG51bWJlcikgPT4gUHJvbWlzZTxHZW9USUZGSW1hZ2U+fSBnZXRJbWFnZSAtIFJldHVybnMgYSBHZW9USUZGSW1hZ2UgZm9yIHRoZSBnaXZlbiBpbmRleC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEdlb1RJRkZJbWFnZVxuICogQHByb3BlcnR5IHsoKSA9PiBudW1iZXJ9IGdldFdpZHRoIC0gUmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIGltYWdlLlxuICogQHByb3BlcnR5IHsoKSA9PiBudW1iZXJ9IGdldEhlaWdodCAtIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgaW1hZ2UuXG4gKiBAcHJvcGVydHkgeygpID0+IG51bWJlcltdfSBnZXRCb3VuZGluZ0JveCAtIFJldHVybnMgdGhlIGJvdW5kaW5nIGJveCBhcyBbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0gaW4gZGVncmVlcy5cbiAqIEBwcm9wZXJ0eSB7KCkgPT4gUHJvbWlzZTxBcnJheUxpa2U8QXJyYXlMaWtlPG51bWJlcj4+Pn0gcmVhZFJhc3RlcnMgLSBSZXR1cm5zIHRoZSByYXN0ZXIgZGF0YSBhcyBhbiBhcnJheSBvZiBiYW5kcy5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBmaWxlRGlyZWN0b3J5IC0gVGhlIGZpbGUgZGlyZWN0b3J5IG9iamVjdCBjb250YWluaW5nIG1ldGFkYXRhLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGZpbGVEaXJlY3RvcnkuTW9kZWxQaXhlbFNjYWxlIC0gVGhlIHBpeGVsIHNjYWxlIGFycmF5IFtzY2FsZVgsIHNjYWxlWSwgc2NhbGVaXSBpbiBkZWdyZWVzLlxuICovXG5cbnZhciBsb2FkZWROYWRncmlkcyA9IHt9O1xuXG4vKipcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGxvYWRlZCBncmlkLlxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gZGF0YSAtIFRoZSBOVHYyIGdyaWQgZGF0YSBhcyBhbiBBcnJheUJ1ZmZlci5cbiAqIEBwYXJhbSB7TlRWMkdyaWRPcHRpb25zfSBbb3B0aW9uc10gLSBPcHRpb25hbCBwYXJhbWV0ZXJzIGZvciBsb2FkaW5nIHRoZSBncmlkLlxuICogQHJldHVybnMge05BREdyaWR9IC0gVGhlIGxvYWRlZCBOQUQgZ3JpZCBpbmZvcm1hdGlvbi5cbiAqL1xuLyoqXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBsb2FkZWQgZ3JpZC5cbiAqIEBwYXJhbSB7R2VvVElGRn0gZGF0YSAtIFRoZSBHZW9USUZGIGluc3RhbmNlIHRvIHJlYWQgdGhlIGdyaWQgZnJvbS5cbiAqIEByZXR1cm5zIHt7cmVhZHk6IFByb21pc2U8TkFER3JpZD59fSAtIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBsb2FkZWQgZ3JpZCBpbmZvcm1hdGlvbi5cbiAqL1xuLyoqXG4gKiBMb2FkIGVpdGhlciBhIE5UdjIgZmlsZSAoLmdzYikgb3IgYSBHZW90aWZmICgudGlmKSB0byBhIGtleSB0aGF0IGNhbiBiZSB1c2VkIGluIGEgcHJvaiBzdHJpbmcgbGlrZSArbmFkZ3JpZHM9PGtleT4uIFBhc3MgdGhlIE5UdjIgZmlsZVxuICogYXMgYW4gQXJyYXlCdWZmZXIuIFBhc3MgR2VvdGlmZiBhcyBhIEdlb1RJRkYgaW5zdGFuY2UgZnJvbSB0aGUgZ2VvdGlmZi5qcyBsaWJyYXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGxvYWRlZCBncmlkLlxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcnxHZW9USUZGfSBkYXRhIFRoZSBkYXRhIHRvIGxvYWQsIGVpdGhlciBhbiBBcnJheUJ1ZmZlciBmb3IgTlR2MiBvciBhIEdlb1RJRkYgaW5zdGFuY2UuXG4gKiBAcGFyYW0ge05UVjJHcmlkT3B0aW9uc30gW29wdGlvbnNdIE9wdGlvbmFsIHBhcmFtZXRlcnMuXG4gKiBAcmV0dXJucyB7e3JlYWR5OiBQcm9taXNlPE5BREdyaWQ+fXxOQURHcmlkfSAtIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBsb2FkZWQgZ3JpZCBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbmFkZ3JpZChrZXksIGRhdGEsIG9wdGlvbnMpIHtcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiByZWFkTlRWMkdyaWQoa2V5LCBkYXRhLCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4geyByZWFkeTogcmVhZEdlb3RpZmZHcmlkKGtleSwgZGF0YSkgfTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGxvYWRlZCBncmlkLlxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gZGF0YSBUaGUgTlR2MiBncmlkIGRhdGEgYXMgYW4gQXJyYXlCdWZmZXIuXG4gKiBAcGFyYW0ge05UVjJHcmlkT3B0aW9uc30gW29wdGlvbnNdIE9wdGlvbmFsIHBhcmFtZXRlcnMgZm9yIGxvYWRpbmcgdGhlIGdyaWQuXG4gKiBAcmV0dXJucyB7TkFER3JpZH0gVGhlIGxvYWRlZCBOQUQgZ3JpZCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gcmVhZE5UVjJHcmlkKGtleSwgZGF0YSwgb3B0aW9ucykge1xuICB2YXIgaW5jbHVkZUVycm9yRmllbGRzID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLmluY2x1ZGVFcnJvckZpZWxkcyA9PT0gZmFsc2UpIHtcbiAgICBpbmNsdWRlRXJyb3JGaWVsZHMgPSBmYWxzZTtcbiAgfVxuICB2YXIgdmlldyA9IG5ldyBEYXRhVmlldyhkYXRhKTtcbiAgdmFyIGlzTGl0dGxlRW5kaWFuID0gZGV0ZWN0TGl0dGxlRW5kaWFuKHZpZXcpO1xuICB2YXIgaGVhZGVyID0gcmVhZEhlYWRlcih2aWV3LCBpc0xpdHRsZUVuZGlhbik7XG4gIHZhciBzdWJncmlkcyA9IHJlYWRTdWJncmlkcyh2aWV3LCBoZWFkZXIsIGlzTGl0dGxlRW5kaWFuLCBpbmNsdWRlRXJyb3JGaWVsZHMpO1xuICB2YXIgbmFkZ3JpZCA9IHsgaGVhZGVyOiBoZWFkZXIsIHN1YmdyaWRzOiBzdWJncmlkcyB9O1xuICBsb2FkZWROYWRncmlkc1trZXldID0gbmFkZ3JpZDtcbiAgcmV0dXJuIG5hZGdyaWQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBsb2FkZWQgZ3JpZC5cbiAqIEBwYXJhbSB7R2VvVElGRn0gdGlmZiBUaGUgR2VvVElGRiBpbnN0YW5jZSB0byByZWFkIHRoZSBncmlkIGZyb20uXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxOQURHcmlkPn0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGxvYWRlZCBOQUQgZ3JpZCBpbmZvcm1hdGlvbi5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVhZEdlb3RpZmZHcmlkKGtleSwgdGlmZikge1xuICB2YXIgc3ViZ3JpZHMgPSBbXTtcbiAgdmFyIHN1YkdyaWRDb3VudCA9IGF3YWl0IHRpZmYuZ2V0SW1hZ2VDb3VudCgpO1xuICAvLyBwcm9qIHByb2R1Y2VkIHRpZmYgZ3JpZCBzaGlmdCBmaWxlcyBhcHBlYXIgdG8gb3JnYW5pemUgbG93ZXIgcmVzIHN1YmdyaWRzIGZpcnN0LCBoaWdoZXIgcmVzLyBjaGlsZCBzdWJncmlkcyBsYXN0LlxuICBmb3IgKHZhciBzdWJncmlkSW5kZXggPSBzdWJHcmlkQ291bnQgLSAxOyBzdWJncmlkSW5kZXggPj0gMDsgc3ViZ3JpZEluZGV4LS0pIHtcbiAgICB2YXIgaW1hZ2UgPSBhd2FpdCB0aWZmLmdldEltYWdlKHN1YmdyaWRJbmRleCk7XG5cbiAgICB2YXIgcmFzdGVycyA9IGF3YWl0IGltYWdlLnJlYWRSYXN0ZXJzKCk7XG4gICAgdmFyIGRhdGEgPSByYXN0ZXJzO1xuICAgIHZhciBsaW0gPSBbaW1hZ2UuZ2V0V2lkdGgoKSwgaW1hZ2UuZ2V0SGVpZ2h0KCldO1xuICAgIHZhciBpbWFnZUJCb3hSYWRpYW5zID0gaW1hZ2UuZ2V0Qm91bmRpbmdCb3goKS5tYXAoZGVncmVlc1RvUmFkaWFucyk7XG4gICAgdmFyIGRlbCA9IFtpbWFnZS5maWxlRGlyZWN0b3J5Lk1vZGVsUGl4ZWxTY2FsZVswXSwgaW1hZ2UuZmlsZURpcmVjdG9yeS5Nb2RlbFBpeGVsU2NhbGVbMV1dLm1hcChkZWdyZWVzVG9SYWRpYW5zKTtcblxuICAgIHZhciBtYXhYID0gaW1hZ2VCQm94UmFkaWFuc1swXSArIChsaW1bMF0gLSAxKSAqIGRlbFswXTtcbiAgICB2YXIgbWluWSA9IGltYWdlQkJveFJhZGlhbnNbM10gLSAobGltWzFdIC0gMSkgKiBkZWxbMV07XG5cbiAgICB2YXIgbGF0aXR1ZGVPZmZzZXRCYW5kID0gZGF0YVswXTtcbiAgICB2YXIgbG9uZ2l0dWRlT2Zmc2V0QmFuZCA9IGRhdGFbMV07XG4gICAgdmFyIG5vZGVzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gbGltWzFdIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGZvciAobGV0IGogPSBsaW1bMF0gLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICB2YXIgaW5kZXggPSBpICogbGltWzBdICsgajtcbiAgICAgICAgbm9kZXMucHVzaChbLXNlY29uZHNUb1JhZGlhbnMobG9uZ2l0dWRlT2Zmc2V0QmFuZFtpbmRleF0pLCBzZWNvbmRzVG9SYWRpYW5zKGxhdGl0dWRlT2Zmc2V0QmFuZFtpbmRleF0pXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3ViZ3JpZHMucHVzaCh7XG4gICAgICBkZWw6IGRlbCxcbiAgICAgIGxpbTogbGltLFxuICAgICAgbGw6IFstbWF4WCwgbWluWV0sXG4gICAgICBjdnM6IG5vZGVzXG4gICAgfSk7XG4gIH1cblxuICB2YXIgdGlmR3JpZCA9IHtcbiAgICBoZWFkZXI6IHtcbiAgICAgIG5TdWJncmlkczogc3ViR3JpZENvdW50XG4gICAgfSxcbiAgICBzdWJncmlkczogc3ViZ3JpZHNcbiAgfTtcbiAgbG9hZGVkTmFkZ3JpZHNba2V5XSA9IHRpZkdyaWQ7XG4gIHJldHVybiB0aWZHcmlkO1xufTtcblxuLyoqXG4gKiBHaXZlbiBhIHByb2o0IHZhbHVlIGZvciBuYWRncmlkcywgcmV0dXJuIGFuIGFycmF5IG9mIGxvYWRlZCBncmlkc1xuICogQHBhcmFtIHtzdHJpbmd9IG5hZGdyaWRzIEEgY29tbWEtc2VwYXJhdGVkIGxpc3Qgb2YgZ3JpZCBuYW1lcywgb3B0aW9uYWxseSBwcmVmaXhlZCB3aXRoICdAJyB0byBpbmRpY2F0ZSBvcHRpb25hbCBncmlkcy5cbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROYWRncmlkcyhuYWRncmlkcykge1xuICAvLyBGb3JtYXQgZGV0YWlsczogaHR0cDovL3Byb2oubWFwdG9vbHMub3JnL2dlbl9wYXJtcy5odG1sXG4gIGlmIChuYWRncmlkcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIGdyaWRzID0gbmFkZ3JpZHMuc3BsaXQoJywnKTtcbiAgcmV0dXJuIGdyaWRzLm1hcChwYXJzZU5hZGdyaWRTdHJpbmcpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgbmFkZ3JpZCBzdHJpbmcgdG8gZ2V0IGluZm9ybWF0aW9uIGZvci5cbiAqIEByZXR1cm5zIHtOYWRncmlkSW5mb3xudWxsfSBBbiBvYmplY3Qgd2l0aCBncmlkIGluZm9ybWF0aW9uLCBvciBudWxsIGlmIHRoZSBpbnB1dCBpcyBlbXB0eS5cbiAqL1xuZnVuY3Rpb24gcGFyc2VOYWRncmlkU3RyaW5nKHZhbHVlKSB7XG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgb3B0aW9uYWwgPSB2YWx1ZVswXSA9PT0gJ0AnO1xuICBpZiAob3B0aW9uYWwpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEpO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgcmV0dXJuIHsgbmFtZTogJ251bGwnLCBtYW5kYXRvcnk6ICFvcHRpb25hbCwgZ3JpZDogbnVsbCwgaXNOdWxsOiB0cnVlIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiB2YWx1ZSxcbiAgICBtYW5kYXRvcnk6ICFvcHRpb25hbCxcbiAgICBncmlkOiBsb2FkZWROYWRncmlkc1t2YWx1ZV0gfHwgbnVsbCxcbiAgICBpc051bGw6IGZhbHNlXG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcykge1xuICByZXR1cm4gKGRlZ3JlZXMpICogTWF0aC5QSSAvIDE4MDtcbn1cblxuZnVuY3Rpb24gc2Vjb25kc1RvUmFkaWFucyhzZWNvbmRzKSB7XG4gIHJldHVybiAoc2Vjb25kcyAvIDM2MDApICogTWF0aC5QSSAvIDE4MDtcbn1cblxuZnVuY3Rpb24gZGV0ZWN0TGl0dGxlRW5kaWFuKHZpZXcpIHtcbiAgdmFyIG5GaWVsZHMgPSB2aWV3LmdldEludDMyKDgsIGZhbHNlKTtcbiAgaWYgKG5GaWVsZHMgPT09IDExKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIG5GaWVsZHMgPSB2aWV3LmdldEludDMyKDgsIHRydWUpO1xuICBpZiAobkZpZWxkcyAhPT0gMTEpIHtcbiAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBkZXRlY3QgbmFkZ3JpZCBlbmRpYW4tbmVzcywgZGVmYXVsdGluZyB0byBsaXR0bGUtZW5kaWFuJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJlYWRIZWFkZXIodmlldywgaXNMaXR0bGVFbmRpYW4pIHtcbiAgcmV0dXJuIHtcbiAgICBuRmllbGRzOiB2aWV3LmdldEludDMyKDgsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBuU3ViZ3JpZEZpZWxkczogdmlldy5nZXRJbnQzMigyNCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIG5TdWJncmlkczogdmlldy5nZXRJbnQzMig0MCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHNoaWZ0VHlwZTogZGVjb2RlU3RyaW5nKHZpZXcsIDU2LCA1NiArIDgpLnRyaW0oKSxcbiAgICBmcm9tU2VtaU1ham9yQXhpczogdmlldy5nZXRGbG9hdDY0KDEyMCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIGZyb21TZW1pTWlub3JBeGlzOiB2aWV3LmdldEZsb2F0NjQoMTM2LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgdG9TZW1pTWFqb3JBeGlzOiB2aWV3LmdldEZsb2F0NjQoMTUyLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgdG9TZW1pTWlub3JBeGlzOiB2aWV3LmdldEZsb2F0NjQoMTY4LCBpc0xpdHRsZUVuZGlhbilcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlU3RyaW5nKHZpZXcsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQ4QXJyYXkodmlldy5idWZmZXIuc2xpY2Uoc3RhcnQsIGVuZCkpKTtcbn1cblxuZnVuY3Rpb24gcmVhZFN1YmdyaWRzKHZpZXcsIGhlYWRlciwgaXNMaXR0bGVFbmRpYW4sIGluY2x1ZGVFcnJvckZpZWxkcykge1xuICB2YXIgZ3JpZE9mZnNldCA9IDE3NjtcbiAgdmFyIGdyaWRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaGVhZGVyLm5TdWJncmlkczsgaSsrKSB7XG4gICAgdmFyIHN1YkhlYWRlciA9IHJlYWRHcmlkSGVhZGVyKHZpZXcsIGdyaWRPZmZzZXQsIGlzTGl0dGxlRW5kaWFuKTtcbiAgICB2YXIgbm9kZXMgPSByZWFkR3JpZE5vZGVzKHZpZXcsIGdyaWRPZmZzZXQsIHN1YkhlYWRlciwgaXNMaXR0bGVFbmRpYW4sIGluY2x1ZGVFcnJvckZpZWxkcyk7XG4gICAgdmFyIGxuZ0NvbHVtbkNvdW50ID0gTWF0aC5yb3VuZChcbiAgICAgIDEgKyAoc3ViSGVhZGVyLnVwcGVyTG9uZ2l0dWRlIC0gc3ViSGVhZGVyLmxvd2VyTG9uZ2l0dWRlKSAvIHN1YkhlYWRlci5sb25naXR1ZGVJbnRlcnZhbCk7XG4gICAgdmFyIGxhdENvbHVtbkNvdW50ID0gTWF0aC5yb3VuZChcbiAgICAgIDEgKyAoc3ViSGVhZGVyLnVwcGVyTGF0aXR1ZGUgLSBzdWJIZWFkZXIubG93ZXJMYXRpdHVkZSkgLyBzdWJIZWFkZXIubGF0aXR1ZGVJbnRlcnZhbCk7XG4gICAgLy8gUHJvajQgb3BlcmF0ZXMgb24gcmFkaWFucyB3aGVyZWFzIHRoZSBjb29yZGluYXRlcyBhcmUgaW4gc2Vjb25kcyBpbiB0aGUgZ3JpZFxuICAgIGdyaWRzLnB1c2goe1xuICAgICAgbGw6IFtzZWNvbmRzVG9SYWRpYW5zKHN1YkhlYWRlci5sb3dlckxvbmdpdHVkZSksIHNlY29uZHNUb1JhZGlhbnMoc3ViSGVhZGVyLmxvd2VyTGF0aXR1ZGUpXSxcbiAgICAgIGRlbDogW3NlY29uZHNUb1JhZGlhbnMoc3ViSGVhZGVyLmxvbmdpdHVkZUludGVydmFsKSwgc2Vjb25kc1RvUmFkaWFucyhzdWJIZWFkZXIubGF0aXR1ZGVJbnRlcnZhbCldLFxuICAgICAgbGltOiBbbG5nQ29sdW1uQ291bnQsIGxhdENvbHVtbkNvdW50XSxcbiAgICAgIGNvdW50OiBzdWJIZWFkZXIuZ3JpZE5vZGVDb3VudCxcbiAgICAgIGN2czogbWFwTm9kZXMobm9kZXMpXG4gICAgfSk7XG4gICAgdmFyIHJvd1NpemUgPSAxNjtcbiAgICBpZiAoaW5jbHVkZUVycm9yRmllbGRzID09PSBmYWxzZSkge1xuICAgICAgcm93U2l6ZSA9IDg7XG4gICAgfVxuICAgIGdyaWRPZmZzZXQgKz0gMTc2ICsgc3ViSGVhZGVyLmdyaWROb2RlQ291bnQgKiByb3dTaXplO1xuICB9XG4gIHJldHVybiBncmlkcztcbn1cblxuLyoqXG4gKiBAcGFyYW0geyp9IG5vZGVzXG4gKiBAcmV0dXJucyBBcnJheTxBcnJheTxudW1iZXI+PlxuICovXG5mdW5jdGlvbiBtYXBOb2Rlcyhub2Rlcykge1xuICByZXR1cm4gbm9kZXMubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgcmV0dXJuIFtzZWNvbmRzVG9SYWRpYW5zKHIubG9uZ2l0dWRlU2hpZnQpLCBzZWNvbmRzVG9SYWRpYW5zKHIubGF0aXR1ZGVTaGlmdCldO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVhZEdyaWRIZWFkZXIodmlldywgb2Zmc2V0LCBpc0xpdHRsZUVuZGlhbikge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IGRlY29kZVN0cmluZyh2aWV3LCBvZmZzZXQgKyA4LCBvZmZzZXQgKyAxNikudHJpbSgpLFxuICAgIHBhcmVudDogZGVjb2RlU3RyaW5nKHZpZXcsIG9mZnNldCArIDI0LCBvZmZzZXQgKyAyNCArIDgpLnRyaW0oKSxcbiAgICBsb3dlckxhdGl0dWRlOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgNzIsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICB1cHBlckxhdGl0dWRlOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgODgsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBsb3dlckxvbmdpdHVkZTogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDEwNCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHVwcGVyTG9uZ2l0dWRlOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgMTIwLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgbGF0aXR1ZGVJbnRlcnZhbDogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDEzNiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIGxvbmdpdHVkZUludGVydmFsOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgMTUyLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgZ3JpZE5vZGVDb3VudDogdmlldy5nZXRJbnQzMihvZmZzZXQgKyAxNjgsIGlzTGl0dGxlRW5kaWFuKVxuICB9O1xufVxuXG5mdW5jdGlvbiByZWFkR3JpZE5vZGVzKHZpZXcsIG9mZnNldCwgZ3JpZEhlYWRlciwgaXNMaXR0bGVFbmRpYW4sIGluY2x1ZGVFcnJvckZpZWxkcykge1xuICB2YXIgbm9kZXNPZmZzZXQgPSBvZmZzZXQgKyAxNzY7XG4gIHZhciBncmlkUmVjb3JkTGVuZ3RoID0gMTY7XG5cbiAgaWYgKGluY2x1ZGVFcnJvckZpZWxkcyA9PT0gZmFsc2UpIHtcbiAgICBncmlkUmVjb3JkTGVuZ3RoID0gODtcbiAgfVxuXG4gIHZhciBncmlkU2hpZnRSZWNvcmRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JpZEhlYWRlci5ncmlkTm9kZUNvdW50OyBpKyspIHtcbiAgICB2YXIgcmVjb3JkID0ge1xuICAgICAgbGF0aXR1ZGVTaGlmdDogdmlldy5nZXRGbG9hdDMyKG5vZGVzT2Zmc2V0ICsgaSAqIGdyaWRSZWNvcmRMZW5ndGgsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICAgIGxvbmdpdHVkZVNoaWZ0OiB2aWV3LmdldEZsb2F0MzIobm9kZXNPZmZzZXQgKyBpICogZ3JpZFJlY29yZExlbmd0aCArIDQsIGlzTGl0dGxlRW5kaWFuKVxuXG4gICAgfTtcblxuICAgIGlmIChpbmNsdWRlRXJyb3JGaWVsZHMgIT09IGZhbHNlKSB7XG4gICAgICByZWNvcmQubGF0aXR1ZGVBY2N1cmFjeSA9IHZpZXcuZ2V0RmxvYXQzMihub2Rlc09mZnNldCArIGkgKiBncmlkUmVjb3JkTGVuZ3RoICsgOCwgaXNMaXR0bGVFbmRpYW4pO1xuICAgICAgcmVjb3JkLmxvbmdpdHVkZUFjY3VyYWN5ID0gdmlldy5nZXRGbG9hdDMyKG5vZGVzT2Zmc2V0ICsgaSAqIGdyaWRSZWNvcmRMZW5ndGggKyAxMiwgaXNMaXR0bGVFbmRpYW4pO1xuICAgIH1cblxuICAgIGdyaWRTaGlmdFJlY29yZHMucHVzaChyZWNvcmQpO1xuICB9XG4gIHJldHVybiBncmlkU2hpZnRSZWNvcmRzO1xufVxuIiwiaW1wb3J0IGRlZnMgZnJvbSAnLi9kZWZzJztcbmltcG9ydCB3a3QgZnJvbSAnd2t0LXBhcnNlcic7XG5pbXBvcnQgcHJvalN0ciBmcm9tICcuL3Byb2pTdHJpbmcnO1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnO1xuZnVuY3Rpb24gdGVzdE9iaihjb2RlKSB7XG4gIHJldHVybiB0eXBlb2YgY29kZSA9PT0gJ3N0cmluZyc7XG59XG5mdW5jdGlvbiB0ZXN0RGVmKGNvZGUpIHtcbiAgcmV0dXJuIGNvZGUgaW4gZGVmcztcbn1cbmZ1bmN0aW9uIHRlc3RXS1QoY29kZSkge1xuICByZXR1cm4gKGNvZGUuaW5kZXhPZignKycpICE9PSAwICYmIGNvZGUuaW5kZXhPZignWycpICE9PSAtMSkgfHwgKHR5cGVvZiBjb2RlID09PSAnb2JqZWN0JyAmJiAhKCdzcnNDb2RlJyBpbiBjb2RlKSk7XG59XG52YXIgY29kZXMgPSBbJzM4NTcnLCAnOTAwOTEzJywgJzM3ODUnLCAnMTAyMTEzJ107XG5mdW5jdGlvbiBjaGVja01lcmNhdG9yKGl0ZW0pIHtcbiAgdmFyIGF1dGggPSBtYXRjaChpdGVtLCAnYXV0aG9yaXR5Jyk7XG4gIGlmICghYXV0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgY29kZSA9IG1hdGNoKGF1dGgsICdlcHNnJyk7XG4gIHJldHVybiBjb2RlICYmIGNvZGVzLmluZGV4T2YoY29kZSkgPiAtMTtcbn1cbmZ1bmN0aW9uIGNoZWNrUHJvalN0cihpdGVtKSB7XG4gIHZhciBleHQgPSBtYXRjaChpdGVtLCAnZXh0ZW5zaW9uJyk7XG4gIGlmICghZXh0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBtYXRjaChleHQsICdwcm9qNCcpO1xufVxuZnVuY3Rpb24gdGVzdFByb2ooY29kZSkge1xuICByZXR1cm4gY29kZVswXSA9PT0gJysnO1xufVxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZyB8IGltcG9ydCgnLi9jb3JlJykuUFJPSkpTT05EZWZpbml0aW9uIHwgaW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gY29kZVxuICogQHJldHVybnMge2ltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259XG4gKi9cbmZ1bmN0aW9uIHBhcnNlKGNvZGUpIHtcbiAgaWYgKHRlc3RPYmooY29kZSkpIHtcbiAgICAvLyBjaGVjayB0byBzZWUgaWYgdGhpcyBpcyBhIFdLVCBzdHJpbmdcbiAgICBpZiAodGVzdERlZihjb2RlKSkge1xuICAgICAgcmV0dXJuIGRlZnNbY29kZV07XG4gICAgfVxuICAgIGlmICh0ZXN0V0tUKGNvZGUpKSB7XG4gICAgICB2YXIgb3V0ID0gd2t0KGNvZGUpO1xuICAgICAgLy8gdGVzdCBvZiBzcGV0aWFsIGNhc2UsIGR1ZSB0byB0aGlzIGJlaW5nIGEgdmVyeSBjb21tb24gYW5kIG9mdGVuIG1hbGZvcm1lZFxuICAgICAgaWYgKGNoZWNrTWVyY2F0b3Iob3V0KSkge1xuICAgICAgICByZXR1cm4gZGVmc1snRVBTRzozODU3J107XG4gICAgICB9XG4gICAgICB2YXIgbWF5YmVQcm9qU3RyID0gY2hlY2tQcm9qU3RyKG91dCk7XG4gICAgICBpZiAobWF5YmVQcm9qU3RyKSB7XG4gICAgICAgIHJldHVybiBwcm9qU3RyKG1heWJlUHJvalN0cik7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBpZiAodGVzdFByb2ooY29kZSkpIHtcbiAgICAgIHJldHVybiBwcm9qU3RyKGNvZGUpO1xuICAgIH1cbiAgfSBlbHNlIGlmICghKCdwcm9qTmFtZScgaW4gY29kZSkpIHtcbiAgICByZXR1cm4gd2t0KGNvZGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb2RlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlO1xuIiwiaW1wb3J0IHsgRDJSIH0gZnJvbSAnLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBQcmltZU1lcmlkaWFuIGZyb20gJy4vY29uc3RhbnRzL1ByaW1lTWVyaWRpYW4nO1xuaW1wb3J0IHVuaXRzIGZyb20gJy4vY29uc3RhbnRzL3VuaXRzJztcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJztcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVmRGF0YVxuICogQHJldHVybnMge2ltcG9ydCgnLi9kZWZzJykuUHJvamVjdGlvbkRlZmluaXRpb259XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChkZWZEYXRhKSB7XG4gIC8qKiBAdHlwZSB7aW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gKi9cbiAgdmFyIHNlbGYgPSB7fTtcbiAgdmFyIHBhcmFtT2JqID0gZGVmRGF0YS5zcGxpdCgnKycpLm1hcChmdW5jdGlvbiAodikge1xuICAgIHJldHVybiB2LnRyaW0oKTtcbiAgfSkuZmlsdGVyKGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0pLnJlZHVjZShmdW5jdGlvbiAocCwgYSkge1xuICAgIC8qKiBAdHlwZSB7QXJyYXk8Pz59ICovXG4gICAgdmFyIHNwbGl0ID0gYS5zcGxpdCgnPScpO1xuICAgIHNwbGl0LnB1c2godHJ1ZSk7XG4gICAgcFtzcGxpdFswXS50b0xvd2VyQ2FzZSgpXSA9IHNwbGl0WzFdO1xuICAgIHJldHVybiBwO1xuICB9LCB7fSk7XG4gIHZhciBwYXJhbU5hbWUsIHBhcmFtVmFsLCBwYXJhbU91dG5hbWU7XG4gIHZhciBwYXJhbXMgPSB7XG4gICAgcHJvajogJ3Byb2pOYW1lJyxcbiAgICBkYXR1bTogJ2RhdHVtQ29kZScsXG4gICAgcmY6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLnJmID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGxhdF8wOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sYXQwID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGxhdF8xOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sYXQxID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGxhdF8yOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sYXQyID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGxhdF90czogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubGF0X3RzID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGxvbl8wOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5sb25nMCA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBsb25fMTogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubG9uZzEgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbG9uXzI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmxvbmcyID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGFscGhhOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5hbHBoYSA9IHBhcnNlRmxvYXQodikgKiBEMlI7XG4gICAgfSxcbiAgICBnYW1tYTogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYucmVjdGlmaWVkX2dyaWRfYW5nbGUgPSBwYXJzZUZsb2F0KHYpICogRDJSO1xuICAgIH0sXG4gICAgbG9uYzogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYubG9uZ2MgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgeF8wOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi54MCA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICB5XzA6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLnkwID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGtfMDogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuazAgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgazogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuazAgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgYTogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuYSA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICBiOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi5iID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIHI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmEgPSBzZWxmLmIgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgcl9hOiBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLlJfQSA9IHRydWU7XG4gICAgfSxcbiAgICB6b25lOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi56b25lID0gcGFyc2VJbnQodiwgMTApO1xuICAgIH0sXG4gICAgc291dGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYudXRtU291dGggPSB0cnVlO1xuICAgIH0sXG4gICAgdG93Z3M4NDogZnVuY3Rpb24gKHYpIHtcbiAgICAgIHNlbGYuZGF0dW1fcGFyYW1zID0gdi5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChhKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdG9fbWV0ZXI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLnRvX21ldGVyID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIHVuaXRzOiBmdW5jdGlvbiAodikge1xuICAgICAgc2VsZi51bml0cyA9IHY7XG4gICAgICB2YXIgdW5pdCA9IG1hdGNoKHVuaXRzLCB2KTtcbiAgICAgIGlmICh1bml0KSB7XG4gICAgICAgIHNlbGYudG9fbWV0ZXIgPSB1bml0LnRvX21ldGVyO1xuICAgICAgfVxuICAgIH0sXG4gICAgZnJvbV9ncmVlbndpY2g6IGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmZyb21fZ3JlZW53aWNoID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIHBtOiBmdW5jdGlvbiAodikge1xuICAgICAgdmFyIHBtID0gbWF0Y2goUHJpbWVNZXJpZGlhbiwgdik7XG4gICAgICBzZWxmLmZyb21fZ3JlZW53aWNoID0gKHBtID8gcG0gOiBwYXJzZUZsb2F0KHYpKSAqIEQyUjtcbiAgICB9LFxuICAgIG5hZGdyaWRzOiBmdW5jdGlvbiAodikge1xuICAgICAgaWYgKHYgPT09ICdAbnVsbCcpIHtcbiAgICAgICAgc2VsZi5kYXR1bUNvZGUgPSAnbm9uZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLm5hZGdyaWRzID0gdjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGF4aXM6IGZ1bmN0aW9uICh2KSB7XG4gICAgICB2YXIgbGVnYWxBeGlzID0gJ2V3bnN1ZCc7XG4gICAgICBpZiAodi5sZW5ndGggPT09IDMgJiYgbGVnYWxBeGlzLmluZGV4T2Yodi5zdWJzdHIoMCwgMSkpICE9PSAtMSAmJiBsZWdhbEF4aXMuaW5kZXhPZih2LnN1YnN0cigxLCAxKSkgIT09IC0xICYmIGxlZ2FsQXhpcy5pbmRleE9mKHYuc3Vic3RyKDIsIDEpKSAhPT0gLTEpIHtcbiAgICAgICAgc2VsZi5heGlzID0gdjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFwcHJveDogZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5hcHByb3ggPSB0cnVlO1xuICAgIH0sXG4gICAgb3ZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5vdmVyID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIGZvciAocGFyYW1OYW1lIGluIHBhcmFtT2JqKSB7XG4gICAgcGFyYW1WYWwgPSBwYXJhbU9ialtwYXJhbU5hbWVdO1xuICAgIGlmIChwYXJhbU5hbWUgaW4gcGFyYW1zKSB7XG4gICAgICBwYXJhbU91dG5hbWUgPSBwYXJhbXNbcGFyYW1OYW1lXTtcbiAgICAgIGlmICh0eXBlb2YgcGFyYW1PdXRuYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBhcmFtT3V0bmFtZShwYXJhbVZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmW3BhcmFtT3V0bmFtZV0gPSBwYXJhbVZhbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZltwYXJhbU5hbWVdID0gcGFyYW1WYWw7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2Ygc2VsZi5kYXR1bUNvZGUgPT09ICdzdHJpbmcnICYmIHNlbGYuZGF0dW1Db2RlICE9PSAnV0dTODQnKSB7XG4gICAgc2VsZi5kYXR1bUNvZGUgPSBzZWxmLmRhdHVtQ29kZS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIHNlbGZbJ3Byb2pTdHInXSA9IGRlZkRhdGE7XG4gIHJldHVybiBzZWxmO1xufVxuIiwiaW1wb3J0IG1lcmMgZnJvbSAnLi9wcm9qZWN0aW9ucy9tZXJjJztcbmltcG9ydCBsb25nbGF0IGZyb20gJy4vcHJvamVjdGlvbnMvbG9uZ2xhdCc7XG4vKiogQHR5cGUge0FycmF5PFBhcnRpYWw8aW1wb3J0KCcuL1Byb2onKS5kZWZhdWx0Pj59ICovXG52YXIgcHJvanMgPSBbbWVyYywgbG9uZ2xhdF07XG52YXIgbmFtZXMgPSB7fTtcbnZhciBwcm9qU3RvcmUgPSBbXTtcblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9Qcm9qJykuZGVmYXVsdH0gcHJvalxuICogQHBhcmFtIHtudW1iZXJ9IGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZChwcm9qLCBpKSB7XG4gIHZhciBsZW4gPSBwcm9qU3RvcmUubGVuZ3RoO1xuICBpZiAoIXByb2oubmFtZXMpIHtcbiAgICBjb25zb2xlLmxvZyhpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwcm9qU3RvcmVbbGVuXSA9IHByb2o7XG4gIHByb2oubmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgIG5hbWVzW24udG9Mb3dlckNhc2UoKV0gPSBsZW47XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vcm1hbGl6ZWRQcm9qTmFtZShuKSB7XG4gIHJldHVybiBuLnJlcGxhY2UoL1stXFwoXFwpXFxzXSsvZywgJyAnKS50cmltKCkucmVwbGFjZSgvIC9nLCAnXycpO1xufVxuXG4vKipcbiAqIEdldCBhIHByb2plY3Rpb24gYnkgbmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL1Byb2onKS5kZWZhdWx0fGZhbHNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0KG5hbWUpIHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBuID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAodHlwZW9mIG5hbWVzW25dICE9PSAndW5kZWZpbmVkJyAmJiBwcm9qU3RvcmVbbmFtZXNbbl1dKSB7XG4gICAgcmV0dXJuIHByb2pTdG9yZVtuYW1lc1tuXV07XG4gIH1cbiAgbiA9IGdldE5vcm1hbGl6ZWRQcm9qTmFtZShuKTtcbiAgaWYgKG4gaW4gbmFtZXMgJiYgcHJvalN0b3JlW25hbWVzW25dXSkge1xuICAgIHJldHVybiBwcm9qU3RvcmVbbmFtZXNbbl1dO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydCgpIHtcbiAgcHJvanMuZm9yRWFjaChhZGQpO1xufVxuZXhwb3J0IGRlZmF1bHQge1xuICBzdGFydDogc3RhcnQsXG4gIGFkZDogYWRkLFxuICBnZXQ6IGdldFxufTtcbiIsImltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IHFzZm56IGZyb20gJy4uL2NvbW1vbi9xc2Zueic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcbmltcG9ydCB7IEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGVtcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5fcG9cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NfcG9cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0MVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvblxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1zMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHFzMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHQyXG4gKiBAcHJvcGVydHkge251bWJlcn0gbXMyXG4gKiBAcHJvcGVydHkge251bWJlcn0gcXMyXG4gKiBAcHJvcGVydHkge251bWJlcn0gdDNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxczBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBuczBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmhcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5fcGhpXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zX3BoaVxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MSArIHRoaXMubGF0MikgPCBFUFNMTikge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnRlbXAgPSB0aGlzLmIgLyB0aGlzLmE7XG4gIHRoaXMuZXMgPSAxIC0gTWF0aC5wb3codGhpcy50ZW1wLCAyKTtcbiAgdGhpcy5lMyA9IE1hdGguc3FydCh0aGlzLmVzKTtcblxuICB0aGlzLnNpbl9wbyA9IE1hdGguc2luKHRoaXMubGF0MSk7XG4gIHRoaXMuY29zX3BvID0gTWF0aC5jb3ModGhpcy5sYXQxKTtcbiAgdGhpcy50MSA9IHRoaXMuc2luX3BvO1xuICB0aGlzLmNvbiA9IHRoaXMuc2luX3BvO1xuICB0aGlzLm1zMSA9IG1zZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvLCB0aGlzLmNvc19wbyk7XG4gIHRoaXMucXMxID0gcXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcG8pO1xuXG4gIHRoaXMuc2luX3BvID0gTWF0aC5zaW4odGhpcy5sYXQyKTtcbiAgdGhpcy5jb3NfcG8gPSBNYXRoLmNvcyh0aGlzLmxhdDIpO1xuICB0aGlzLnQyID0gdGhpcy5zaW5fcG87XG4gIHRoaXMubXMyID0gbXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcG8sIHRoaXMuY29zX3BvKTtcbiAgdGhpcy5xczIgPSBxc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbyk7XG5cbiAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB0aGlzLmNvc19wbyA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIHRoaXMudDMgPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5xczAgPSBxc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbyk7XG5cbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MSAtIHRoaXMubGF0MikgPiBFUFNMTikge1xuICAgIHRoaXMubnMwID0gKHRoaXMubXMxICogdGhpcy5tczEgLSB0aGlzLm1zMiAqIHRoaXMubXMyKSAvICh0aGlzLnFzMiAtIHRoaXMucXMxKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm5zMCA9IHRoaXMuY29uO1xuICB9XG4gIHRoaXMuYyA9IHRoaXMubXMxICogdGhpcy5tczEgKyB0aGlzLm5zMCAqIHRoaXMucXMxO1xuICB0aGlzLnJoID0gdGhpcy5hICogTWF0aC5zcXJ0KHRoaXMuYyAtIHRoaXMubnMwICogdGhpcy5xczApIC8gdGhpcy5uczA7XG59XG5cbi8qIEFsYmVycyBDb25pY2FsIEVxdWFsIEFyZWEgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgdGhpcy5zaW5fcGhpID0gTWF0aC5zaW4obGF0KTtcbiAgdGhpcy5jb3NfcGhpID0gTWF0aC5jb3MobGF0KTtcblxuICB2YXIgcXMgPSBxc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9waGkpO1xuICB2YXIgcmgxID0gdGhpcy5hICogTWF0aC5zcXJ0KHRoaXMuYyAtIHRoaXMubnMwICogcXMpIC8gdGhpcy5uczA7XG4gIHZhciB0aGV0YSA9IHRoaXMubnMwICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgeCA9IHJoMSAqIE1hdGguc2luKHRoZXRhKSArIHRoaXMueDA7XG4gIHZhciB5ID0gdGhpcy5yaCAtIHJoMSAqIE1hdGguY29zKHRoZXRhKSArIHRoaXMueTA7XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHJoMSwgcXMsIGNvbiwgdGhldGEsIGxvbiwgbGF0O1xuXG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgPSB0aGlzLnJoIC0gcC55ICsgdGhpcy55MDtcbiAgaWYgKHRoaXMubnMwID49IDApIHtcbiAgICByaDEgPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICBjb24gPSAxO1xuICB9IGVsc2Uge1xuICAgIHJoMSA9IC1NYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICBjb24gPSAtMTtcbiAgfVxuICB0aGV0YSA9IDA7XG4gIGlmIChyaDEgIT09IDApIHtcbiAgICB0aGV0YSA9IE1hdGguYXRhbjIoY29uICogcC54LCBjb24gKiBwLnkpO1xuICB9XG4gIGNvbiA9IHJoMSAqIHRoaXMubnMwIC8gdGhpcy5hO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsYXQgPSBNYXRoLmFzaW4oKHRoaXMuYyAtIGNvbiAqIGNvbikgLyAoMiAqIHRoaXMubnMwKSk7XG4gIH0gZWxzZSB7XG4gICAgcXMgPSAodGhpcy5jIC0gY29uICogY29uKSAvIHRoaXMubnMwO1xuICAgIGxhdCA9IHRoaXMucGhpMXoodGhpcy5lMywgcXMpO1xuICB9XG5cbiAgbG9uID0gYWRqdXN0X2xvbih0aGV0YSAvIHRoaXMubnMwICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG4vKiBGdW5jdGlvbiB0byBjb21wdXRlIHBoaTEsIHRoZSBsYXRpdHVkZSBmb3IgdGhlIGludmVyc2Ugb2YgdGhlXG4gICBBbGJlcnMgQ29uaWNhbCBFcXVhbC1BcmVhIHByb2plY3Rpb24uXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gcGhpMXooZWNjZW50LCBxcykge1xuICB2YXIgc2lucGhpLCBjb3NwaGksIGNvbiwgY29tLCBkcGhpO1xuICB2YXIgcGhpID0gYXNpbnooMC41ICogcXMpO1xuICBpZiAoZWNjZW50IDwgRVBTTE4pIHtcbiAgICByZXR1cm4gcGhpO1xuICB9XG5cbiAgdmFyIGVjY250cyA9IGVjY2VudCAqIGVjY2VudDtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMjU7IGkrKykge1xuICAgIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBjb24gPSBlY2NlbnQgKiBzaW5waGk7XG4gICAgY29tID0gMSAtIGNvbiAqIGNvbjtcbiAgICBkcGhpID0gMC41ICogY29tICogY29tIC8gY29zcGhpICogKHFzIC8gKDEgLSBlY2NudHMpIC0gc2lucGhpIC8gY29tICsgMC41IC8gZWNjZW50ICogTWF0aC5sb2coKDEgLSBjb24pIC8gKDEgKyBjb24pKSk7XG4gICAgcGhpID0gcGhpICsgZHBoaTtcbiAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gMWUtNykge1xuICAgICAgcmV0dXJuIHBoaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0FsYmVyc19Db25pY19FcXVhbF9BcmVhJywgJ0FsYmVyc19FcXVhbF9BcmVhJywgJ0FsYmVycycsICdhZWEnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzLFxuICBwaGkxejogcGhpMXpcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgeyBIQUxGX1BJLCBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IG1sZm4gZnJvbSAnLi4vY29tbW9uL21sZm4nO1xuaW1wb3J0IGUwZm4gZnJvbSAnLi4vY29tbW9uL2UwZm4nO1xuaW1wb3J0IGUxZm4gZnJvbSAnLi4vY29tbW9uL2UxZm4nO1xuaW1wb3J0IGUyZm4gZnJvbSAnLi4vY29tbW9uL2UyZm4nO1xuaW1wb3J0IGUzZm4gZnJvbSAnLi4vY29tbW9uL2UzZm4nO1xuaW1wb3J0IGFzaW56IGZyb20gJy4uL2NvbW1vbi9hc2lueic7XG5pbXBvcnQgaW1sZm4gZnJvbSAnLi4vY29tbW9uL2ltbGZuJztcbmltcG9ydCB7IHZpbmNlbnR5RGlyZWN0LCB2aW5jZW50eUludmVyc2UgfSBmcm9tICcuLi9jb21tb24vdmluY2VudHknO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luX3AxMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc19wMTJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhXG4gKiBAcHJvcGVydHkge251bWJlcn0gZlxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy5zaW5fcDEyID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgdGhpcy5jb3NfcDEyID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgLy8gZmxhdHRlbmluZyBmb3IgZWxsaXBzb2lkXG4gIHRoaXMuZiA9IHRoaXMuZXMgLyAoMSArIE1hdGguc3FydCgxIC0gdGhpcy5lcykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciBzaW5waGkgPSBNYXRoLnNpbihwLnkpO1xuICB2YXIgY29zcGhpID0gTWF0aC5jb3MocC55KTtcbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciBlMCwgZTEsIGUyLCBlMywgTWxwLCBNbCwgYywga3AsIGNvc19jLCB2YXJzLCBhemkxO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyIC0gMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vIE5vcnRoIFBvbGUgY2FzZVxuICAgICAgcC54ID0gdGhpcy54MCArIHRoaXMuYSAqIChIQUxGX1BJIC0gbGF0KSAqIE1hdGguc2luKGRsb24pO1xuICAgICAgcC55ID0gdGhpcy55MCAtIHRoaXMuYSAqIChIQUxGX1BJIC0gbGF0KSAqIE1hdGguY29zKGRsb24pO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgKyAxKSA8PSBFUFNMTikge1xuICAgICAgLy8gU291dGggUG9sZSBjYXNlXG4gICAgICBwLnggPSB0aGlzLngwICsgdGhpcy5hICogKEhBTEZfUEkgKyBsYXQpICogTWF0aC5zaW4oZGxvbik7XG4gICAgICBwLnkgPSB0aGlzLnkwICsgdGhpcy5hICogKEhBTEZfUEkgKyBsYXQpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICByZXR1cm4gcDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVmYXVsdCBjYXNlXG4gICAgICBjb3NfYyA9IHRoaXMuc2luX3AxMiAqIHNpbnBoaSArIHRoaXMuY29zX3AxMiAqIGNvc3BoaSAqIE1hdGguY29zKGRsb24pO1xuICAgICAgYyA9IE1hdGguYWNvcyhjb3NfYyk7XG4gICAgICBrcCA9IGMgPyBjIC8gTWF0aC5zaW4oYykgOiAxO1xuICAgICAgcC54ID0gdGhpcy54MCArIHRoaXMuYSAqIGtwICogY29zcGhpICogTWF0aC5zaW4oZGxvbik7XG4gICAgICBwLnkgPSB0aGlzLnkwICsgdGhpcy5hICoga3AgKiAodGhpcy5jb3NfcDEyICogc2lucGhpIC0gdGhpcy5zaW5fcDEyICogY29zcGhpICogTWF0aC5jb3MoZGxvbikpO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGUwID0gZTBmbih0aGlzLmVzKTtcbiAgICBlMSA9IGUxZm4odGhpcy5lcyk7XG4gICAgZTIgPSBlMmZuKHRoaXMuZXMpO1xuICAgIGUzID0gZTNmbih0aGlzLmVzKTtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyIC0gMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vIE5vcnRoIFBvbGUgY2FzZVxuICAgICAgTWxwID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgSEFMRl9QSSk7XG4gICAgICBNbCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIGxhdCk7XG4gICAgICBwLnggPSB0aGlzLngwICsgKE1scCAtIE1sKSAqIE1hdGguc2luKGRsb24pO1xuICAgICAgcC55ID0gdGhpcy55MCAtIChNbHAgLSBNbCkgKiBNYXRoLmNvcyhkbG9uKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyICsgMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vIFNvdXRoIFBvbGUgY2FzZVxuICAgICAgTWxwID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgSEFMRl9QSSk7XG4gICAgICBNbCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIGxhdCk7XG4gICAgICBwLnggPSB0aGlzLngwICsgKE1scCArIE1sKSAqIE1hdGguc2luKGRsb24pO1xuICAgICAgcC55ID0gdGhpcy55MCArIChNbHAgKyBNbCkgKiBNYXRoLmNvcyhkbG9uKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWZhdWx0IGNhc2VcbiAgICAgIGlmIChNYXRoLmFicyhsb24pIDwgRVBTTE4gJiYgTWF0aC5hYnMobGF0IC0gdGhpcy5sYXQwKSA8IEVQU0xOKSB7XG4gICAgICAgIHAueCA9IHAueSA9IDA7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfVxuICAgICAgdmFycyA9IHZpbmNlbnR5SW52ZXJzZSh0aGlzLmxhdDAsIHRoaXMubG9uZzAsIGxhdCwgbG9uLCB0aGlzLmEsIHRoaXMuZik7XG4gICAgICBhemkxID0gdmFycy5hemkxO1xuICAgICAgcC54ID0gdmFycy5zMTIgKiBNYXRoLnNpbihhemkxKTtcbiAgICAgIHAueSA9IHZhcnMuczEyICogTWF0aC5jb3MoYXppMSk7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciByaCwgeiwgc2lueiwgY29zeiwgbG9uLCBsYXQsIGNvbiwgZTAsIGUxLCBlMiwgZTMsIE1scCwgTSwgYXppMSwgczEyLCB2YXJzO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICByaCA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICAgIGlmIChyaCA+ICgyICogSEFMRl9QSSAqIHRoaXMuYSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgeiA9IHJoIC8gdGhpcy5hO1xuXG4gICAgc2lueiA9IE1hdGguc2luKHopO1xuICAgIGNvc3ogPSBNYXRoLmNvcyh6KTtcblxuICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgaWYgKE1hdGguYWJzKHJoKSA8PSBFUFNMTikge1xuICAgICAgbGF0ID0gdGhpcy5sYXQwO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXQgPSBhc2lueihjb3N6ICogdGhpcy5zaW5fcDEyICsgKHAueSAqIHNpbnogKiB0aGlzLmNvc19wMTIpIC8gcmgpO1xuICAgICAgY29uID0gTWF0aC5hYnModGhpcy5sYXQwKSAtIEhBTEZfUEk7XG4gICAgICBpZiAoTWF0aC5hYnMoY29uKSA8PSBFUFNMTikge1xuICAgICAgICBpZiAodGhpcy5sYXQwID49IDApIHtcbiAgICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgLXAueSksIHRoaXMub3Zlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwIC0gTWF0aC5hdGFuMigtcC54LCBwLnkpLCB0aGlzLm92ZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCAqIHNpbnosIHJoICogdGhpcy5jb3NfcDEyICogY29zeiAtIHAueSAqIHRoaXMuc2luX3AxMiAqIHNpbnopLCB0aGlzLm92ZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH0gZWxzZSB7XG4gICAgZTAgPSBlMGZuKHRoaXMuZXMpO1xuICAgIGUxID0gZTFmbih0aGlzLmVzKTtcbiAgICBlMiA9IGUyZm4odGhpcy5lcyk7XG4gICAgZTMgPSBlM2ZuKHRoaXMuZXMpO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgLSAxKSA8PSBFUFNMTikge1xuICAgICAgLy8gTm9ydGggcG9sZSBjYXNlXG4gICAgICBNbHAgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBIQUxGX1BJKTtcbiAgICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgICBNID0gTWxwIC0gcmg7XG4gICAgICBsYXQgPSBpbWxmbihNIC8gdGhpcy5hLCBlMCwgZTEsIGUyLCBlMyk7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgLTEgKiBwLnkpLCB0aGlzLm92ZXIpO1xuICAgICAgcC54ID0gbG9uO1xuICAgICAgcC55ID0gbGF0O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgKyAxKSA8PSBFUFNMTikge1xuICAgICAgLy8gU291dGggcG9sZSBjYXNlXG4gICAgICBNbHAgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBIQUxGX1BJKTtcbiAgICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgICBNID0gcmggLSBNbHA7XG5cbiAgICAgIGxhdCA9IGltbGZuKE0gLyB0aGlzLmEsIGUwLCBlMSwgZTIsIGUzKTtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCBwLnkpLCB0aGlzLm92ZXIpO1xuICAgICAgcC54ID0gbG9uO1xuICAgICAgcC55ID0gbGF0O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHQgY2FzZVxuICAgICAgYXppMSA9IE1hdGguYXRhbjIocC54LCBwLnkpO1xuICAgICAgczEyID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgICB2YXJzID0gdmluY2VudHlEaXJlY3QodGhpcy5sYXQwLCB0aGlzLmxvbmcwLCBhemkxLCBzMTIsIHRoaXMuYSwgdGhpcy5mKTtcblxuICAgICAgcC54ID0gdmFycy5sb24yO1xuICAgICAgcC55ID0gdmFycy5sYXQyO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0F6aW11dGhhbF9FcXVpZGlzdGFudCcsICdhZXFkJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbGF0IGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbGF0JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBoeXBvdCBmcm9tICcuLi9jb21tb24vaHlwb3QnO1xuaW1wb3J0IHBqX2VuZm4gZnJvbSAnLi4vY29tbW9uL3BqX2VuZm4nO1xuaW1wb3J0IHBqX2ludl9tbGZuIGZyb20gJy4uL2NvbW1vbi9wal9pbnZfbWxmbic7XG5pbXBvcnQgcGpfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfbWxmbic7XG5pbXBvcnQgeyBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGhpMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNwaGkxXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gZW5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGFtMVxuICovXG5cbnZhciBFUFMxMCA9IDFlLTEwO1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBjO1xuXG4gIHRoaXMucGhpMSA9IHRoaXMubGF0MTtcbiAgaWYgKE1hdGguYWJzKHRoaXMucGhpMSkgPCBFUFMxMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigpO1xuICB9XG4gIGlmICh0aGlzLmVzKSB7XG4gICAgdGhpcy5lbiA9IHBqX2VuZm4odGhpcy5lcyk7XG4gICAgdGhpcy5tMSA9IHBqX21sZm4odGhpcy5waGkxLCB0aGlzLmFtMSA9IE1hdGguc2luKHRoaXMucGhpMSksXG4gICAgICBjID0gTWF0aC5jb3ModGhpcy5waGkxKSwgdGhpcy5lbik7XG4gICAgdGhpcy5hbTEgPSBjIC8gKE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIHRoaXMuYW0xICogdGhpcy5hbTEpICogdGhpcy5hbTEpO1xuICAgIHRoaXMuaW52ZXJzZSA9IGVfaW52O1xuICAgIHRoaXMuZm9yd2FyZCA9IGVfZndkO1xuICB9IGVsc2Uge1xuICAgIGlmIChNYXRoLmFicyh0aGlzLnBoaTEpICsgRVBTMTAgPj0gSEFMRl9QSSkge1xuICAgICAgdGhpcy5jcGhpMSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3BoaTEgPSAxIC8gTWF0aC50YW4odGhpcy5waGkxKTtcbiAgICB9XG4gICAgdGhpcy5pbnZlcnNlID0gc19pbnY7XG4gICAgdGhpcy5mb3J3YXJkID0gc19md2Q7XG4gIH1cbn1cblxuZnVuY3Rpb24gZV9md2QocCkge1xuICB2YXIgbGFtID0gYWRqdXN0X2xvbihwLnggLSAodGhpcy5sb25nMCB8fCAwKSwgdGhpcy5vdmVyKTtcbiAgdmFyIHBoaSA9IHAueTtcbiAgdmFyIHJoLCBFLCBjO1xuICByaCA9IHRoaXMuYW0xICsgdGhpcy5tMSAtIHBqX21sZm4ocGhpLCBFID0gTWF0aC5zaW4ocGhpKSwgYyA9IE1hdGguY29zKHBoaSksIHRoaXMuZW4pO1xuICBFID0gYyAqIGxhbSAvIChyaCAqIE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIEUgKiBFKSk7XG4gIHAueCA9IHJoICogTWF0aC5zaW4oRSk7XG4gIHAueSA9IHRoaXMuYW0xIC0gcmggKiBNYXRoLmNvcyhFKTtcblxuICBwLnggPSB0aGlzLmEgKiBwLnggKyAodGhpcy54MCB8fCAwKTtcbiAgcC55ID0gdGhpcy5hICogcC55ICsgKHRoaXMueTAgfHwgMCk7XG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBlX2ludihwKSB7XG4gIHAueCA9IChwLnggLSAodGhpcy54MCB8fCAwKSkgLyB0aGlzLmE7XG4gIHAueSA9IChwLnkgLSAodGhpcy55MCB8fCAwKSkgLyB0aGlzLmE7XG5cbiAgdmFyIHMsIHJoLCBsYW0sIHBoaTtcbiAgcmggPSBoeXBvdChwLngsIHAueSA9IHRoaXMuYW0xIC0gcC55KTtcbiAgcGhpID0gcGpfaW52X21sZm4odGhpcy5hbTEgKyB0aGlzLm0xIC0gcmgsIHRoaXMuZXMsIHRoaXMuZW4pO1xuICBpZiAoKHMgPSBNYXRoLmFicyhwaGkpKSA8IEhBTEZfUEkpIHtcbiAgICBzID0gTWF0aC5zaW4ocGhpKTtcbiAgICBsYW0gPSByaCAqIE1hdGguYXRhbjIocC54LCBwLnkpICogTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogcyAqIHMpIC8gTWF0aC5jb3MocGhpKTtcbiAgfSBlbHNlIGlmIChNYXRoLmFicyhzIC0gSEFMRl9QSSkgPD0gRVBTMTApIHtcbiAgICBsYW0gPSAwO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcigpO1xuICB9XG4gIHAueCA9IGFkanVzdF9sb24obGFtICsgKHRoaXMubG9uZzAgfHwgMCksIHRoaXMub3Zlcik7XG4gIHAueSA9IGFkanVzdF9sYXQocGhpKTtcbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHNfZndkKHApIHtcbiAgdmFyIGxhbSA9IGFkanVzdF9sb24ocC54IC0gKHRoaXMubG9uZzAgfHwgMCksIHRoaXMub3Zlcik7XG4gIHZhciBwaGkgPSBwLnk7XG4gIHZhciBFLCByaDtcbiAgcmggPSB0aGlzLmNwaGkxICsgdGhpcy5waGkxIC0gcGhpO1xuICBpZiAoTWF0aC5hYnMocmgpID4gRVBTMTApIHtcbiAgICBwLnggPSByaCAqIE1hdGguc2luKEUgPSBsYW0gKiBNYXRoLmNvcyhwaGkpIC8gcmgpO1xuICAgIHAueSA9IHRoaXMuY3BoaTEgLSByaCAqIE1hdGguY29zKEUpO1xuICB9IGVsc2Uge1xuICAgIHAueCA9IHAueSA9IDA7XG4gIH1cblxuICBwLnggPSB0aGlzLmEgKiBwLnggKyAodGhpcy54MCB8fCAwKTtcbiAgcC55ID0gdGhpcy5hICogcC55ICsgKHRoaXMueTAgfHwgMCk7XG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBzX2ludihwKSB7XG4gIHAueCA9IChwLnggLSAodGhpcy54MCB8fCAwKSkgLyB0aGlzLmE7XG4gIHAueSA9IChwLnkgLSAodGhpcy55MCB8fCAwKSkgLyB0aGlzLmE7XG5cbiAgdmFyIGxhbSwgcGhpO1xuICB2YXIgcmggPSBoeXBvdChwLngsIHAueSA9IHRoaXMuY3BoaTEgLSBwLnkpO1xuICBwaGkgPSB0aGlzLmNwaGkxICsgdGhpcy5waGkxIC0gcmg7XG4gIGlmIChNYXRoLmFicyhwaGkpID4gSEFMRl9QSSkge1xuICAgIHRocm93IG5ldyBFcnJvcigpO1xuICB9XG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhwaGkpIC0gSEFMRl9QSSkgPD0gRVBTMTApIHtcbiAgICBsYW0gPSAwO1xuICB9IGVsc2Uge1xuICAgIGxhbSA9IHJoICogTWF0aC5hdGFuMihwLngsIHAueSkgLyBNYXRoLmNvcyhwaGkpO1xuICB9XG4gIHAueCA9IGFkanVzdF9sb24obGFtICsgKHRoaXMubG9uZzAgfHwgMCksIHRoaXMub3Zlcik7XG4gIHAueSA9IGFkanVzdF9sYXQocGhpKTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ2Jvbm5lJywgJ0Jvbm5lIChXZXJuZXIgbGF0XzE9OTApJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBtbGZuIGZyb20gJy4uL2NvbW1vbi9tbGZuJztcbmltcG9ydCBlMGZuIGZyb20gJy4uL2NvbW1vbi9lMGZuJztcbmltcG9ydCBlMWZuIGZyb20gJy4uL2NvbW1vbi9lMWZuJztcbmltcG9ydCBlMmZuIGZyb20gJy4uL2NvbW1vbi9lMmZuJztcbmltcG9ydCBlM2ZuIGZyb20gJy4uL2NvbW1vbi9lM2ZuJztcbmltcG9ydCBnTiBmcm9tICcuLi9jb21tb24vZ04nO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuaW1wb3J0IGltbGZuIGZyb20gJy4uL2NvbW1vbi9pbWxmbic7XG5pbXBvcnQgeyBIQUxGX1BJLCBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtbDBcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIGlmICghdGhpcy5zcGhlcmUpIHtcbiAgICB0aGlzLmUwID0gZTBmbih0aGlzLmVzKTtcbiAgICB0aGlzLmUxID0gZTFmbih0aGlzLmVzKTtcbiAgICB0aGlzLmUyID0gZTJmbih0aGlzLmVzKTtcbiAgICB0aGlzLmUzID0gZTNmbih0aGlzLmVzKTtcbiAgICB0aGlzLm1sMCA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQwKTtcbiAgfVxufVxuXG4vKiBDYXNzaW5pIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdmFyIHgsIHk7XG4gIHZhciBsYW0gPSBwLng7XG4gIHZhciBwaGkgPSBwLnk7XG4gIGxhbSA9IGFkanVzdF9sb24obGFtIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICB4ID0gdGhpcy5hICogTWF0aC5hc2luKE1hdGguY29zKHBoaSkgKiBNYXRoLnNpbihsYW0pKTtcbiAgICB5ID0gdGhpcy5hICogKE1hdGguYXRhbjIoTWF0aC50YW4ocGhpKSwgTWF0aC5jb3MobGFtKSkgLSB0aGlzLmxhdDApO1xuICB9IGVsc2Uge1xuICAgIC8vIGVsbGlwc29pZFxuICAgIHZhciBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIHZhciBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIHZhciBubCA9IGdOKHRoaXMuYSwgdGhpcy5lLCBzaW5waGkpO1xuICAgIHZhciB0bCA9IE1hdGgudGFuKHBoaSkgKiBNYXRoLnRhbihwaGkpO1xuICAgIHZhciBhbCA9IGxhbSAqIE1hdGguY29zKHBoaSk7XG4gICAgdmFyIGFzcSA9IGFsICogYWw7XG4gICAgdmFyIGNsID0gdGhpcy5lcyAqIGNvc3BoaSAqIGNvc3BoaSAvICgxIC0gdGhpcy5lcyk7XG4gICAgdmFyIG1sID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCBwaGkpO1xuXG4gICAgeCA9IG5sICogYWwgKiAoMSAtIGFzcSAqIHRsICogKDEgLyA2IC0gKDggLSB0bCArIDggKiBjbCkgKiBhc3EgLyAxMjApKTtcbiAgICB5ID0gbWwgLSB0aGlzLm1sMCArIG5sICogc2lucGhpIC8gY29zcGhpICogYXNxICogKDAuNSArICg1IC0gdGwgKyA2ICogY2wpICogYXNxIC8gMjQpO1xuICB9XG5cbiAgcC54ID0geCArIHRoaXMueDA7XG4gIHAueSA9IHkgKyB0aGlzLnkwO1xuICByZXR1cm4gcDtcbn1cblxuLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICB2YXIgeCA9IHAueCAvIHRoaXMuYTtcbiAgdmFyIHkgPSBwLnkgLyB0aGlzLmE7XG4gIHZhciBwaGksIGxhbTtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICB2YXIgZGQgPSB5ICsgdGhpcy5sYXQwO1xuICAgIHBoaSA9IE1hdGguYXNpbihNYXRoLnNpbihkZCkgKiBNYXRoLmNvcyh4KSk7XG4gICAgbGFtID0gTWF0aC5hdGFuMihNYXRoLnRhbih4KSwgTWF0aC5jb3MoZGQpKTtcbiAgfSBlbHNlIHtcbiAgICAvKiBlbGxpcHNvaWQgKi9cbiAgICB2YXIgbWwxID0gdGhpcy5tbDAgLyB0aGlzLmEgKyB5O1xuICAgIHZhciBwaGkxID0gaW1sZm4obWwxLCB0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzKTtcbiAgICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMocGhpMSkgLSBIQUxGX1BJKSA8PSBFUFNMTikge1xuICAgICAgcC54ID0gdGhpcy5sb25nMDtcbiAgICAgIHAueSA9IEhBTEZfUEk7XG4gICAgICBpZiAoeSA8IDApIHtcbiAgICAgICAgcC55ICo9IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIHZhciBubDEgPSBnTih0aGlzLmEsIHRoaXMuZSwgTWF0aC5zaW4ocGhpMSkpO1xuXG4gICAgdmFyIHJsMSA9IG5sMSAqIG5sMSAqIG5sMSAvIHRoaXMuYSAvIHRoaXMuYSAqICgxIC0gdGhpcy5lcyk7XG4gICAgdmFyIHRsMSA9IE1hdGgucG93KE1hdGgudGFuKHBoaTEpLCAyKTtcbiAgICB2YXIgZGwgPSB4ICogdGhpcy5hIC8gbmwxO1xuICAgIHZhciBkc3EgPSBkbCAqIGRsO1xuICAgIHBoaSA9IHBoaTEgLSBubDEgKiBNYXRoLnRhbihwaGkxKSAvIHJsMSAqIGRsICogZGwgKiAoMC41IC0gKDEgKyAzICogdGwxKSAqIGRsICogZGwgLyAyNCk7XG4gICAgbGFtID0gZGwgKiAoMSAtIGRzcSAqICh0bDEgLyAzICsgKDEgKyAzICogdGwxKSAqIHRsMSAqIGRzcSAvIDE1KSkgLyBNYXRoLmNvcyhwaGkxKTtcbiAgfVxuXG4gIHAueCA9IGFkanVzdF9sb24obGFtICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgcC55ID0gYWRqdXN0X2xhdChwaGkpO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnQ2Fzc2luaScsICdDYXNzaW5pX1NvbGRuZXInLCAnY2FzcyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgcXNmbnogZnJvbSAnLi4vY29tbW9uL3FzZm56JztcbmltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IGlxc2ZueiBmcm9tICcuLi9jb21tb24vaXFzZm56JztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKi9cblxuLyoqXG4gIHJlZmVyZW5jZTpcbiAgICBcIkNhcnRvZ3JhcGhpYyBQcm9qZWN0aW9uIFByb2NlZHVyZXMgZm9yIHRoZSBVTklYIEVudmlyb25tZW50LVxuICAgIEEgVXNlcidzIE1hbnVhbFwiIGJ5IEdlcmFsZCBJLiBFdmVuZGVuLFxuICAgIFVTR1MgT3BlbiBGaWxlIFJlcG9ydCA5MC0yODRhbmQgUmVsZWFzZSA0IEludGVyaW0gUmVwb3J0cyAoMjAwMylcbiAgQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvLyBuby1vcFxuICBpZiAoIXRoaXMuc3BoZXJlKSB7XG4gICAgdGhpcy5rMCA9IG1zZm56KHRoaXMuZSwgTWF0aC5zaW4odGhpcy5sYXRfdHMpLCBNYXRoLmNvcyh0aGlzLmxhdF90cykpO1xuICB9XG59XG5cbi8qIEN5bGluZHJpY2FsIEVxdWFsIEFyZWEgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciB4LCB5O1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogZGxvbiAqIE1hdGguY29zKHRoaXMubGF0X3RzKTtcbiAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIE1hdGguc2luKGxhdCkgLyBNYXRoLmNvcyh0aGlzLmxhdF90cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHFzID0gcXNmbnoodGhpcy5lLCBNYXRoLnNpbihsYXQpKTtcbiAgICB4ID0gdGhpcy54MCArIHRoaXMuYSAqIHRoaXMuazAgKiBkbG9uO1xuICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICogcXMgKiAwLjUgLyB0aGlzLmswO1xuICB9XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEN5bGluZHJpY2FsIEVxdWFsIEFyZWEgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgdmFyIGxvbiwgbGF0O1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIChwLnggLyB0aGlzLmEpIC8gTWF0aC5jb3ModGhpcy5sYXRfdHMpLCB0aGlzLm92ZXIpO1xuICAgIGxhdCA9IE1hdGguYXNpbigocC55IC8gdGhpcy5hKSAqIE1hdGguY29zKHRoaXMubGF0X3RzKSk7XG4gIH0gZWxzZSB7XG4gICAgbGF0ID0gaXFzZm56KHRoaXMuZSwgMiAqIHAueSAqIHRoaXMuazAgLyB0aGlzLmEpO1xuICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHAueCAvICh0aGlzLmEgKiB0aGlzLmswKSwgdGhpcy5vdmVyKTtcbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnY2VhJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhZGp1c3RfbGF0IGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbGF0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG4gIHRoaXMubGF0MCA9IHRoaXMubGF0MCB8fCAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCB8fCAwO1xuICB0aGlzLmxhdF90cyA9IHRoaXMubGF0X3RzIHx8IDA7XG4gIHRoaXMudGl0bGUgPSB0aGlzLnRpdGxlIHx8ICdFcXVpZGlzdGFudCBDeWxpbmRyaWNhbCAoUGxhdGUgQ2FycmUpJztcblxuICB0aGlzLnJjID0gTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xufVxuXG4vLyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciBkbGF0ID0gYWRqdXN0X2xhdChsYXQgLSB0aGlzLmxhdDApO1xuICBwLnggPSB0aGlzLngwICsgKHRoaXMuYSAqIGRsb24gKiB0aGlzLnJjKTtcbiAgcC55ID0gdGhpcy55MCArICh0aGlzLmEgKiBkbGF0KTtcbiAgcmV0dXJuIHA7XG59XG5cbi8vIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHggPSBwLng7XG4gIHZhciB5ID0gcC55O1xuXG4gIHAueCA9IGFkanVzdF9sb24odGhpcy5sb25nMCArICgoeCAtIHRoaXMueDApIC8gKHRoaXMuYSAqIHRoaXMucmMpKSwgdGhpcy5vdmVyKTtcbiAgcC55ID0gYWRqdXN0X2xhdCh0aGlzLmxhdDAgKyAoKHkgLSB0aGlzLnkwKSAvICh0aGlzLmEpKSk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydFcXVpcmVjdGFuZ3VsYXInLCAnRXF1aWRpc3RhbnRfQ3lsaW5kcmljYWwnLCAnRXF1aWRpc3RhbnRfQ3lsaW5kcmljYWxfU3BoZXJpY2FsJywgJ2VxYyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgZTBmbiBmcm9tICcuLi9jb21tb24vZTBmbic7XG5pbXBvcnQgZTFmbiBmcm9tICcuLi9jb21tb24vZTFmbic7XG5pbXBvcnQgZTJmbiBmcm9tICcuLi9jb21tb24vZTJmbic7XG5pbXBvcnQgZTNmbiBmcm9tICcuLi9jb21tb24vZTNmbic7XG5pbXBvcnQgbXNmbnogZnJvbSAnLi4vY29tbW9uL21zZm56JztcbmltcG9ydCBtbGZuIGZyb20gJy4uL2NvbW1vbi9tbGZuJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhZGp1c3RfbGF0IGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbGF0JztcbmltcG9ydCBpbWxmbiBmcm9tICcuLi9jb21tb24vaW1sZm4nO1xuaW1wb3J0IHsgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0ZW1wXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5fcGhpXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zX3BoaVxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1zMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1sMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1zMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1sMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5zXG4gKiBAcHJvcGVydHkge251bWJlcn0gZ1xuICogQHByb3BlcnR5IHtudW1iZXJ9IG1sMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJoXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIC8vIFN0YW5kYXJkIFBhcmFsbGVscyBjYW5ub3QgYmUgZXF1YWwgYW5kIG9uIG9wcG9zaXRlIHNpZGVzIG9mIHRoZSBlcXVhdG9yXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgKyB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5sYXQyID0gdGhpcy5sYXQyIHx8IHRoaXMubGF0MTtcbiAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmVzID0gMSAtIE1hdGgucG93KHRoaXMudGVtcCwgMik7XG4gIHRoaXMuZSA9IE1hdGguc3FydCh0aGlzLmVzKTtcbiAgdGhpcy5lMCA9IGUwZm4odGhpcy5lcyk7XG4gIHRoaXMuZTEgPSBlMWZuKHRoaXMuZXMpO1xuICB0aGlzLmUyID0gZTJmbih0aGlzLmVzKTtcbiAgdGhpcy5lMyA9IGUzZm4odGhpcy5lcyk7XG5cbiAgdGhpcy5zaW5fcGhpID0gTWF0aC5zaW4odGhpcy5sYXQxKTtcbiAgdGhpcy5jb3NfcGhpID0gTWF0aC5jb3ModGhpcy5sYXQxKTtcblxuICB0aGlzLm1zMSA9IG1zZm56KHRoaXMuZSwgdGhpcy5zaW5fcGhpLCB0aGlzLmNvc19waGkpO1xuICB0aGlzLm1sMSA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQxKTtcblxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxIC0gdGhpcy5sYXQyKSA8IEVQU0xOKSB7XG4gICAgdGhpcy5ucyA9IHRoaXMuc2luX3BoaTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNpbl9waGkgPSBNYXRoLnNpbih0aGlzLmxhdDIpO1xuICAgIHRoaXMuY29zX3BoaSA9IE1hdGguY29zKHRoaXMubGF0Mik7XG4gICAgdGhpcy5tczIgPSBtc2Zueih0aGlzLmUsIHRoaXMuc2luX3BoaSwgdGhpcy5jb3NfcGhpKTtcbiAgICB0aGlzLm1sMiA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQyKTtcbiAgICB0aGlzLm5zID0gKHRoaXMubXMxIC0gdGhpcy5tczIpIC8gKHRoaXMubWwyIC0gdGhpcy5tbDEpO1xuICB9XG4gIHRoaXMuZyA9IHRoaXMubWwxICsgdGhpcy5tczEgLyB0aGlzLm5zO1xuICB0aGlzLm1sMCA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQwKTtcbiAgdGhpcy5yaCA9IHRoaXMuYSAqICh0aGlzLmcgLSB0aGlzLm1sMCk7XG59XG5cbi8qIEVxdWlkaXN0YW50IENvbmljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgcmgxO1xuXG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICByaDEgPSB0aGlzLmEgKiAodGhpcy5nIC0gbGF0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWwgPSBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIGxhdCk7XG4gICAgcmgxID0gdGhpcy5hICogKHRoaXMuZyAtIG1sKTtcbiAgfVxuICB2YXIgdGhldGEgPSB0aGlzLm5zICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgeCA9IHRoaXMueDAgKyByaDEgKiBNYXRoLnNpbih0aGV0YSk7XG4gIHZhciB5ID0gdGhpcy55MCArIHRoaXMucmggLSByaDEgKiBNYXRoLmNvcyh0aGV0YSk7XG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG4vKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55ID0gdGhpcy5yaCAtIHAueSArIHRoaXMueTA7XG4gIHZhciBjb24sIHJoMSwgbGF0LCBsb247XG4gIGlmICh0aGlzLm5zID49IDApIHtcbiAgICByaDEgPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICBjb24gPSAxO1xuICB9IGVsc2Uge1xuICAgIHJoMSA9IC1NYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICBjb24gPSAtMTtcbiAgfVxuICB2YXIgdGhldGEgPSAwO1xuICBpZiAocmgxICE9PSAwKSB7XG4gICAgdGhldGEgPSBNYXRoLmF0YW4yKGNvbiAqIHAueCwgY29uICogcC55KTtcbiAgfVxuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHRoZXRhIC8gdGhpcy5ucywgdGhpcy5vdmVyKTtcbiAgICBsYXQgPSBhZGp1c3RfbGF0KHRoaXMuZyAtIHJoMSAvIHRoaXMuYSk7XG4gICAgcC54ID0gbG9uO1xuICAgIHAueSA9IGxhdDtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWwgPSB0aGlzLmcgLSByaDEgLyB0aGlzLmE7XG4gICAgbGF0ID0gaW1sZm4obWwsIHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMpO1xuICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHRoZXRhIC8gdGhpcy5ucywgdGhpcy5vdmVyKTtcbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0VxdWlkaXN0YW50X0NvbmljJywgJ2VxZGMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxOCBCZXJuaWUgSmVubnksIE1vbmFzaCBVbml2ZXJzaXR5LCBNZWxib3VybmUsIEF1c3RyYWxpYS5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBFcXVhbCBFYXJ0aCBpcyBhIHByb2plY3Rpb24gaW5zcGlyZWQgYnkgdGhlIFJvYmluc29uIHByb2plY3Rpb24sIGJ1dCB1bmxpa2VcbiAqIHRoZSBSb2JpbnNvbiBwcm9qZWN0aW9uIHJldGFpbnMgdGhlIHJlbGF0aXZlIHNpemUgb2YgYXJlYXMuIFRoZSBwcm9qZWN0aW9uXG4gKiB3YXMgZGVzaWduZWQgaW4gMjAxOCBieSBCb2phbiBTYXZyaWMsIFRvbSBQYXR0ZXJzb24gYW5kIEJlcm5oYXJkIEplbm55LlxuICpcbiAqIFB1YmxpY2F0aW9uOlxuICogQm9qYW4gU2F2cmljLCBUb20gUGF0dGVyc29uICYgQmVybmhhcmQgSmVubnkgKDIwMTgpLiBUaGUgRXF1YWwgRWFydGggbWFwXG4gKiBwcm9qZWN0aW9uLCBJbnRlcm5hdGlvbmFsIEpvdXJuYWwgb2YgR2VvZ3JhcGhpY2FsIEluZm9ybWF0aW9uIFNjaWVuY2UsXG4gKiBET0k6IDEwLjEwODAvMTM2NTg4MTYuMjAxOC4xNTA0OTQ5XG4gKlxuICogQ29kZSByZWxlYXNlZCBBdWd1c3QgMjAxOFxuICogUG9ydGVkIHRvIEphdmFTY3JpcHQgYW5kIGFkYXB0ZWQgZm9yIG1hcHNoYXBlci1wcm9qIGJ5IE1hdHRoZXcgQmxvY2ggQXVndXN0IDIwMThcbiAqIE1vZGlmaWVkIGZvciBwcm9qNGpzIGJ5IEFuZHJlYXMgSG9jZXZhciBieSBBbmRyZWFzIEhvY2V2YXIgTWFyY2ggMjAyNFxuICovXG5cbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxudmFyIEExID0gMS4zNDAyNjQsXG4gIEEyID0gLTAuMDgxMTA2LFxuICBBMyA9IDAuMDAwODkzLFxuICBBNCA9IDAuMDAzNzk2LFxuICBNID0gTWF0aC5zcXJ0KDMpIC8gMi4wO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy5lcyA9IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwICE9PSB1bmRlZmluZWQgPyB0aGlzLmxvbmcwIDogMDtcbiAgdGhpcy54MCA9IHRoaXMueDAgIT09IHVuZGVmaW5lZCA/IHRoaXMueDAgOiAwO1xuICB0aGlzLnkwID0gdGhpcy55MCAhPT0gdW5kZWZpbmVkID8gdGhpcy55MCA6IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxhbSA9IGFkanVzdF9sb24ocC54IC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgdmFyIHBoaSA9IHAueTtcbiAgdmFyIHBhcmFtTGF0ID0gTWF0aC5hc2luKE0gKiBNYXRoLnNpbihwaGkpKSxcbiAgICBwYXJhbUxhdFNxID0gcGFyYW1MYXQgKiBwYXJhbUxhdCxcbiAgICBwYXJhbUxhdFBvdzYgPSBwYXJhbUxhdFNxICogcGFyYW1MYXRTcSAqIHBhcmFtTGF0U3E7XG4gIHAueCA9IGxhbSAqIE1hdGguY29zKHBhcmFtTGF0KVxuICAgIC8gKE0gKiAoQTEgKyAzICogQTIgKiBwYXJhbUxhdFNxICsgcGFyYW1MYXRQb3c2ICogKDcgKiBBMyArIDkgKiBBNCAqIHBhcmFtTGF0U3EpKSk7XG4gIHAueSA9IHBhcmFtTGF0ICogKEExICsgQTIgKiBwYXJhbUxhdFNxICsgcGFyYW1MYXRQb3c2ICogKEEzICsgQTQgKiBwYXJhbUxhdFNxKSk7XG5cbiAgcC54ID0gdGhpcy5hICogcC54ICsgdGhpcy54MDtcbiAgcC55ID0gdGhpcy5hICogcC55ICsgdGhpcy55MDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5hO1xuICBwLnkgPSAocC55IC0gdGhpcy55MCkgLyB0aGlzLmE7XG5cbiAgdmFyIEVQUyA9IDFlLTksXG4gICAgTklURVIgPSAxMixcbiAgICBwYXJhbUxhdCA9IHAueSxcbiAgICBwYXJhbUxhdFNxLCBwYXJhbUxhdFBvdzYsIGZ5LCBmcHksIGRsYXQsIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IE5JVEVSOyArK2kpIHtcbiAgICBwYXJhbUxhdFNxID0gcGFyYW1MYXQgKiBwYXJhbUxhdDtcbiAgICBwYXJhbUxhdFBvdzYgPSBwYXJhbUxhdFNxICogcGFyYW1MYXRTcSAqIHBhcmFtTGF0U3E7XG4gICAgZnkgPSBwYXJhbUxhdCAqIChBMSArIEEyICogcGFyYW1MYXRTcSArIHBhcmFtTGF0UG93NiAqIChBMyArIEE0ICogcGFyYW1MYXRTcSkpIC0gcC55O1xuICAgIGZweSA9IEExICsgMyAqIEEyICogcGFyYW1MYXRTcSArIHBhcmFtTGF0UG93NiAqICg3ICogQTMgKyA5ICogQTQgKiBwYXJhbUxhdFNxKTtcbiAgICBwYXJhbUxhdCAtPSBkbGF0ID0gZnkgLyBmcHk7XG4gICAgaWYgKE1hdGguYWJzKGRsYXQpIDwgRVBTKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcGFyYW1MYXRTcSA9IHBhcmFtTGF0ICogcGFyYW1MYXQ7XG4gIHBhcmFtTGF0UG93NiA9IHBhcmFtTGF0U3EgKiBwYXJhbUxhdFNxICogcGFyYW1MYXRTcTtcbiAgcC54ID0gTSAqIHAueCAqIChBMSArIDMgKiBBMiAqIHBhcmFtTGF0U3EgKyBwYXJhbUxhdFBvdzYgKiAoNyAqIEEzICsgOSAqIEE0ICogcGFyYW1MYXRTcSkpXG4gICAgLyBNYXRoLmNvcyhwYXJhbUxhdCk7XG4gIHAueSA9IE1hdGguYXNpbihNYXRoLnNpbihwYXJhbUxhdCkgLyBNKTtcblxuICBwLnggPSBhZGp1c3RfbG9uKHAueCArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydlcWVhcnRoJywgJ0VxdWFsIEVhcnRoJywgJ0VxdWFsX0VhcnRoJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIi8vIEhlYXZpbHkgYmFzZWQgb24gdGhpcyBldG1lcmMgcHJvamVjdGlvbiBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21ibG9jaC9tYXBzaGFwZXItcHJvai9ibG9iL21hc3Rlci9zcmMvcHJvamVjdGlvbnMvZXRtZXJjLmpzXG5cbmltcG9ydCB0bWVyYyBmcm9tICcuLi9wcm9qZWN0aW9ucy90bWVyYyc7XG5pbXBvcnQgc2luaCBmcm9tICcuLi9jb21tb24vc2luaCc7XG5pbXBvcnQgaHlwb3QgZnJvbSAnLi4vY29tbW9uL2h5cG90JztcbmltcG9ydCBhc2luaHkgZnJvbSAnLi4vY29tbW9uL2FzaW5oeSc7XG5pbXBvcnQgZ2F0ZyBmcm9tICcuLi9jb21tb24vZ2F0Zyc7XG5pbXBvcnQgY2xlbnMgZnJvbSAnLi4vY29tbW9uL2NsZW5zJztcbmltcG9ydCBjbGVuc19jbXBseCBmcm9tICcuLi9jb21tb24vY2xlbnNfY21wbHgnO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGNiZ1xuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBjZ2JcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8bnVtYmVyPn0gdXRnXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGd0dVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFFuXG4gKiBAcHJvcGVydHkge251bWJlcn0gWmJcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIGlmICghdGhpcy5hcHByb3ggJiYgKGlzTmFOKHRoaXMuZXMpIHx8IHRoaXMuZXMgPD0gMCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBlbGxpcHRpY2FsIHVzYWdlLiBUcnkgdXNpbmcgdGhlICthcHByb3ggb3B0aW9uIGluIHRoZSBwcm9qIHN0cmluZywgb3IgUFJPSkVDVElPTltcIkZhc3RfVHJhbnN2ZXJzZV9NZXJjYXRvclwiXSBpbiB0aGUgV0tULicpO1xuICB9XG4gIGlmICh0aGlzLmFwcHJveCkge1xuICAgIC8vIFdoZW4gJythcHByb3gnIGlzIHNldCwgdXNlIHRtZXJjIGluc3RlYWRcbiAgICB0bWVyYy5pbml0LmFwcGx5KHRoaXMpO1xuICAgIHRoaXMuZm9yd2FyZCA9IHRtZXJjLmZvcndhcmQ7XG4gICAgdGhpcy5pbnZlcnNlID0gdG1lcmMuaW52ZXJzZTtcbiAgfVxuXG4gIHRoaXMueDAgPSB0aGlzLngwICE9PSB1bmRlZmluZWQgPyB0aGlzLngwIDogMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgIT09IHVuZGVmaW5lZCA/IHRoaXMueTAgOiAwO1xuICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sb25nMCA6IDA7XG4gIHRoaXMubGF0MCA9IHRoaXMubGF0MCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sYXQwIDogMDtcblxuICB0aGlzLmNnYiA9IFtdO1xuICB0aGlzLmNiZyA9IFtdO1xuICB0aGlzLnV0ZyA9IFtdO1xuICB0aGlzLmd0dSA9IFtdO1xuXG4gIHZhciBmID0gdGhpcy5lcyAvICgxICsgTWF0aC5zcXJ0KDEgLSB0aGlzLmVzKSk7XG4gIHZhciBuID0gZiAvICgyIC0gZik7XG4gIHZhciBucCA9IG47XG5cbiAgdGhpcy5jZ2JbMF0gPSBuICogKDIgKyBuICogKC0yIC8gMyArIG4gKiAoLTIgKyBuICogKDExNiAvIDQ1ICsgbiAqICgyNiAvIDQ1ICsgbiAqICgtMjg1NCAvIDY3NSkpKSkpKTtcbiAgdGhpcy5jYmdbMF0gPSBuICogKC0yICsgbiAqICgyIC8gMyArIG4gKiAoNCAvIDMgKyBuICogKC04MiAvIDQ1ICsgbiAqICgzMiAvIDQ1ICsgbiAqICg0NjQyIC8gNDcyNSkpKSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy5jZ2JbMV0gPSBucCAqICg3IC8gMyArIG4gKiAoLTggLyA1ICsgbiAqICgtMjI3IC8gNDUgKyBuICogKDI3MDQgLyAzMTUgKyBuICogKDIzMjMgLyA5NDUpKSkpKTtcbiAgdGhpcy5jYmdbMV0gPSBucCAqICg1IC8gMyArIG4gKiAoLTE2IC8gMTUgKyBuICogKC0xMyAvIDkgKyBuICogKDkwNCAvIDMxNSArIG4gKiAoLTE1MjIgLyA5NDUpKSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy5jZ2JbMl0gPSBucCAqICg1NiAvIDE1ICsgbiAqICgtMTM2IC8gMzUgKyBuICogKC0xMjYyIC8gMTA1ICsgbiAqICg3MzgxNCAvIDI4MzUpKSkpO1xuICB0aGlzLmNiZ1syXSA9IG5wICogKC0yNiAvIDE1ICsgbiAqICgzNCAvIDIxICsgbiAqICg4IC8gNSArIG4gKiAoLTEyNjg2IC8gMjgzNSkpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMuY2diWzNdID0gbnAgKiAoNDI3OSAvIDYzMCArIG4gKiAoLTMzMiAvIDM1ICsgbiAqICgtMzk5NTcyIC8gMTQxNzUpKSk7XG4gIHRoaXMuY2JnWzNdID0gbnAgKiAoMTIzNyAvIDYzMCArIG4gKiAoLTEyIC8gNSArIG4gKiAoLTI0ODMyIC8gMTQxNzUpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMuY2diWzRdID0gbnAgKiAoNDE3NCAvIDMxNSArIG4gKiAoLTE0NDgzOCAvIDYyMzcpKTtcbiAgdGhpcy5jYmdbNF0gPSBucCAqICgtNzM0IC8gMzE1ICsgbiAqICgxMDk1OTggLyAzMTE4NSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLmNnYls1XSA9IG5wICogKDYwMTY3NiAvIDIyMjc1KTtcbiAgdGhpcy5jYmdbNV0gPSBucCAqICg0NDQzMzcgLyAxNTU5MjUpO1xuXG4gIG5wID0gTWF0aC5wb3cobiwgMik7XG4gIHRoaXMuUW4gPSB0aGlzLmswIC8gKDEgKyBuKSAqICgxICsgbnAgKiAoMSAvIDQgKyBucCAqICgxIC8gNjQgKyBucCAvIDI1NikpKTtcblxuICB0aGlzLnV0Z1swXSA9IG4gKiAoLTAuNSArIG4gKiAoMiAvIDMgKyBuICogKC0zNyAvIDk2ICsgbiAqICgxIC8gMzYwICsgbiAqICg4MSAvIDUxMiArIG4gKiAoLTk2MTk5IC8gNjA0ODAwKSkpKSkpO1xuICB0aGlzLmd0dVswXSA9IG4gKiAoMC41ICsgbiAqICgtMiAvIDMgKyBuICogKDUgLyAxNiArIG4gKiAoNDEgLyAxODAgKyBuICogKC0xMjcgLyAyODggKyBuICogKDc4OTEgLyAzNzgwMCkpKSkpKTtcblxuICB0aGlzLnV0Z1sxXSA9IG5wICogKC0xIC8gNDggKyBuICogKC0xIC8gMTUgKyBuICogKDQzNyAvIDE0NDAgKyBuICogKC00NiAvIDEwNSArIG4gKiAoMTExODcxMSAvIDM4NzA3MjApKSkpKTtcbiAgdGhpcy5ndHVbMV0gPSBucCAqICgxMyAvIDQ4ICsgbiAqICgtMyAvIDUgKyBuICogKDU1NyAvIDE0NDAgKyBuICogKDI4MSAvIDYzMCArIG4gKiAoLTE5ODM0MzMgLyAxOTM1MzYwKSkpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMudXRnWzJdID0gbnAgKiAoLTE3IC8gNDgwICsgbiAqICgzNyAvIDg0MCArIG4gKiAoMjA5IC8gNDQ4MCArIG4gKiAoLTU1NjkgLyA5MDcyMCkpKSk7XG4gIHRoaXMuZ3R1WzJdID0gbnAgKiAoNjEgLyAyNDAgKyBuICogKC0xMDMgLyAxNDAgKyBuICogKDE1MDYxIC8gMjY4ODAgKyBuICogKDE2NzYwMyAvIDE4MTQ0MCkpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMudXRnWzNdID0gbnAgKiAoLTQzOTcgLyAxNjEyODAgKyBuICogKDExIC8gNTA0ICsgbiAqICg4MzAyNTEgLyA3MjU3NjAwKSkpO1xuICB0aGlzLmd0dVszXSA9IG5wICogKDQ5NTYxIC8gMTYxMjgwICsgbiAqICgtMTc5IC8gMTY4ICsgbiAqICg2NjAxNjYxIC8gNzI1NzYwMCkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy51dGdbNF0gPSBucCAqICgtNDU4MyAvIDE2MTI4MCArIG4gKiAoMTA4ODQ3IC8gMzk5MTY4MCkpO1xuICB0aGlzLmd0dVs0XSA9IG5wICogKDM0NzI5IC8gODA2NDAgKyBuICogKC0zNDE4ODg5IC8gMTk5NTg0MCkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLnV0Z1s1XSA9IG5wICogKC0yMDY0ODY5MyAvIDYzODY2ODgwMCk7XG4gIHRoaXMuZ3R1WzVdID0gbnAgKiAoMjEyMzc4OTQxIC8gMzE5MzM0NDAwKTtcblxuICB2YXIgWiA9IGdhdGcodGhpcy5jYmcsIHRoaXMubGF0MCk7XG4gIHRoaXMuWmIgPSAtdGhpcy5RbiAqIChaICsgY2xlbnModGhpcy5ndHUsIDIgKiBaKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIENlID0gYWRqdXN0X2xvbihwLnggLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgQ24gPSBwLnk7XG5cbiAgQ24gPSBnYXRnKHRoaXMuY2JnLCBDbik7XG4gIHZhciBzaW5fQ24gPSBNYXRoLnNpbihDbik7XG4gIHZhciBjb3NfQ24gPSBNYXRoLmNvcyhDbik7XG4gIHZhciBzaW5fQ2UgPSBNYXRoLnNpbihDZSk7XG4gIHZhciBjb3NfQ2UgPSBNYXRoLmNvcyhDZSk7XG5cbiAgQ24gPSBNYXRoLmF0YW4yKHNpbl9DbiwgY29zX0NlICogY29zX0NuKTtcbiAgQ2UgPSBNYXRoLmF0YW4yKHNpbl9DZSAqIGNvc19DbiwgaHlwb3Qoc2luX0NuLCBjb3NfQ24gKiBjb3NfQ2UpKTtcbiAgQ2UgPSBhc2luaHkoTWF0aC50YW4oQ2UpKTtcblxuICB2YXIgdG1wID0gY2xlbnNfY21wbHgodGhpcy5ndHUsIDIgKiBDbiwgMiAqIENlKTtcblxuICBDbiA9IENuICsgdG1wWzBdO1xuICBDZSA9IENlICsgdG1wWzFdO1xuXG4gIHZhciB4O1xuICB2YXIgeTtcblxuICBpZiAoTWF0aC5hYnMoQ2UpIDw9IDIuNjIzMzk1MTYyNzc4KSB7XG4gICAgeCA9IHRoaXMuYSAqICh0aGlzLlFuICogQ2UpICsgdGhpcy54MDtcbiAgICB5ID0gdGhpcy5hICogKHRoaXMuUW4gKiBDbiArIHRoaXMuWmIpICsgdGhpcy55MDtcbiAgfSBlbHNlIHtcbiAgICB4ID0gSW5maW5pdHk7XG4gICAgeSA9IEluZmluaXR5O1xuICB9XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcblxuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgQ2UgPSAocC54IC0gdGhpcy54MCkgKiAoMSAvIHRoaXMuYSk7XG4gIHZhciBDbiA9IChwLnkgLSB0aGlzLnkwKSAqICgxIC8gdGhpcy5hKTtcblxuICBDbiA9IChDbiAtIHRoaXMuWmIpIC8gdGhpcy5RbjtcbiAgQ2UgPSBDZSAvIHRoaXMuUW47XG5cbiAgdmFyIGxvbjtcbiAgdmFyIGxhdDtcblxuICBpZiAoTWF0aC5hYnMoQ2UpIDw9IDIuNjIzMzk1MTYyNzc4KSB7XG4gICAgdmFyIHRtcCA9IGNsZW5zX2NtcGx4KHRoaXMudXRnLCAyICogQ24sIDIgKiBDZSk7XG5cbiAgICBDbiA9IENuICsgdG1wWzBdO1xuICAgIENlID0gQ2UgKyB0bXBbMV07XG4gICAgQ2UgPSBNYXRoLmF0YW4oc2luaChDZSkpO1xuXG4gICAgdmFyIHNpbl9DbiA9IE1hdGguc2luKENuKTtcbiAgICB2YXIgY29zX0NuID0gTWF0aC5jb3MoQ24pO1xuICAgIHZhciBzaW5fQ2UgPSBNYXRoLnNpbihDZSk7XG4gICAgdmFyIGNvc19DZSA9IE1hdGguY29zKENlKTtcblxuICAgIENuID0gTWF0aC5hdGFuMihzaW5fQ24gKiBjb3NfQ2UsIGh5cG90KHNpbl9DZSwgY29zX0NlICogY29zX0NuKSk7XG4gICAgQ2UgPSBNYXRoLmF0YW4yKHNpbl9DZSwgY29zX0NlICogY29zX0NuKTtcblxuICAgIGxvbiA9IGFkanVzdF9sb24oQ2UgKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICAgIGxhdCA9IGdhdGcodGhpcy5jZ2IsIENuKTtcbiAgfSBlbHNlIHtcbiAgICBsb24gPSBJbmZpbml0eTtcbiAgICBsYXQgPSBJbmZpbml0eTtcbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuXG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydFeHRlbmRlZF9UcmFuc3ZlcnNlX01lcmNhdG9yJywgJ0V4dGVuZGVkIFRyYW5zdmVyc2UgTWVyY2F0b3InLCAnZXRtZXJjJywgJ1RyYW5zdmVyc2VfTWVyY2F0b3InLCAnVHJhbnN2ZXJzZSBNZXJjYXRvcicsICdHYXVzcyBLcnVnZXInLCAnR2F1c3NfS3J1Z2VyJywgJ3RtZXJjJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBzcmF0IGZyb20gJy4uL2NvbW1vbi9zcmF0JztcbnZhciBNQVhfSVRFUiA9IDIwO1xuaW1wb3J0IHsgSEFMRl9QSSwgRk9SVFBJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGhpYzBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByYXRleHBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBLXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgc3BoaSA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gIHZhciBjcGhpID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgY3BoaSAqPSBjcGhpO1xuICB0aGlzLnJjID0gTWF0aC5zcXJ0KDEgLSB0aGlzLmVzKSAvICgxIC0gdGhpcy5lcyAqIHNwaGkgKiBzcGhpKTtcbiAgdGhpcy5DID0gTWF0aC5zcXJ0KDEgKyB0aGlzLmVzICogY3BoaSAqIGNwaGkgLyAoMSAtIHRoaXMuZXMpKTtcbiAgdGhpcy5waGljMCA9IE1hdGguYXNpbihzcGhpIC8gdGhpcy5DKTtcbiAgdGhpcy5yYXRleHAgPSAwLjUgKiB0aGlzLkMgKiB0aGlzLmU7XG4gIHRoaXMuSyA9IE1hdGgudGFuKDAuNSAqIHRoaXMucGhpYzAgKyBGT1JUUEkpIC8gKE1hdGgucG93KE1hdGgudGFuKDAuNSAqIHRoaXMubGF0MCArIEZPUlRQSSksIHRoaXMuQykgKiBzcmF0KHRoaXMuZSAqIHNwaGksIHRoaXMucmF0ZXhwKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICBwLnkgPSAyICogTWF0aC5hdGFuKHRoaXMuSyAqIE1hdGgucG93KE1hdGgudGFuKDAuNSAqIGxhdCArIEZPUlRQSSksIHRoaXMuQykgKiBzcmF0KHRoaXMuZSAqIE1hdGguc2luKGxhdCksIHRoaXMucmF0ZXhwKSkgLSBIQUxGX1BJO1xuICBwLnggPSB0aGlzLkMgKiBsb247XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBERUxfVE9MID0gMWUtMTQ7XG4gIHZhciBsb24gPSBwLnggLyB0aGlzLkM7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciBudW0gPSBNYXRoLnBvdyhNYXRoLnRhbigwLjUgKiBsYXQgKyBGT1JUUEkpIC8gdGhpcy5LLCAxIC8gdGhpcy5DKTtcbiAgZm9yICh2YXIgaSA9IE1BWF9JVEVSOyBpID4gMDsgLS1pKSB7XG4gICAgbGF0ID0gMiAqIE1hdGguYXRhbihudW0gKiBzcmF0KHRoaXMuZSAqIE1hdGguc2luKHAueSksIC0wLjUgKiB0aGlzLmUpKSAtIEhBTEZfUEk7XG4gICAgaWYgKE1hdGguYWJzKGxhdCAtIHAueSkgPCBERUxfVE9MKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcC55ID0gbGF0O1xuICB9XG4gIC8qIGNvbnZlcmdlbmNlIGZhaWxlZCAqL1xuICBpZiAoIWkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ2dhdXNzJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB7XG4gIGdlb2RldGljVG9HZW9jZW50cmljLFxuICBnZW9jZW50cmljVG9HZW9kZXRpY1xufSBmcm9tICcuLi9kYXR1bVV0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMubmFtZSA9ICdnZW9jZW50Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgcG9pbnQgPSBnZW9kZXRpY1RvR2VvY2VudHJpYyhwLCB0aGlzLmVzLCB0aGlzLmEpO1xuICByZXR1cm4gcG9pbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHBvaW50ID0gZ2VvY2VudHJpY1RvR2VvZGV0aWMocCwgdGhpcy5lcywgdGhpcy5hLCB0aGlzLmIpO1xuICByZXR1cm4gcG9pbnQ7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0dlb2NlbnRyaWMnLCAnZ2VvY2VudHJpYycsICdnZW9jZW50JywgJ0dlb2NlbnQnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGh5cG90IGZyb20gJy4uL2NvbW1vbi9oeXBvdCc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkgezEgfCAwfSBmbGlwX2F4aXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBoXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmFkaXVzX2dfMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1c19nXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmFkaXVzX3BcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByYWRpdXNfcDJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByYWRpdXNfcF9pbnYyXG4gKiBAcHJvcGVydHkgeydlbGxpcHNlJ3wnc3BoZXJlJ30gc2hhcGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc3dlZXBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy5mbGlwX2F4aXMgPSAodGhpcy5zd2VlcCA9PT0gJ3gnID8gMSA6IDApO1xuICB0aGlzLmggPSBOdW1iZXIodGhpcy5oKTtcbiAgdGhpcy5yYWRpdXNfZ18xID0gdGhpcy5oIC8gdGhpcy5hO1xuXG4gIGlmICh0aGlzLnJhZGl1c19nXzEgPD0gMCB8fCB0aGlzLnJhZGl1c19nXzEgPiAxZTEwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gIH1cblxuICB0aGlzLnJhZGl1c19nID0gMS4wICsgdGhpcy5yYWRpdXNfZ18xO1xuICB0aGlzLkMgPSB0aGlzLnJhZGl1c19nICogdGhpcy5yYWRpdXNfZyAtIDEuMDtcblxuICBpZiAodGhpcy5lcyAhPT0gMC4wKSB7XG4gICAgdmFyIG9uZV9lcyA9IDEuMCAtIHRoaXMuZXM7XG4gICAgdmFyIHJvbmVfZXMgPSAxIC8gb25lX2VzO1xuXG4gICAgdGhpcy5yYWRpdXNfcCA9IE1hdGguc3FydChvbmVfZXMpO1xuICAgIHRoaXMucmFkaXVzX3AyID0gb25lX2VzO1xuICAgIHRoaXMucmFkaXVzX3BfaW52MiA9IHJvbmVfZXM7XG5cbiAgICB0aGlzLnNoYXBlID0gJ2VsbGlwc2UnOyAvLyBVc2UgYXMgYSBjb25kaXRpb24gaW4gdGhlIGZvcndhcmQgYW5kIGludmVyc2UgZnVuY3Rpb25zLlxuICB9IGVsc2Uge1xuICAgIHRoaXMucmFkaXVzX3AgPSAxLjA7XG4gICAgdGhpcy5yYWRpdXNfcDIgPSAxLjA7XG4gICAgdGhpcy5yYWRpdXNfcF9pbnYyID0gMS4wO1xuXG4gICAgdGhpcy5zaGFwZSA9ICdzcGhlcmUnOyAvLyBVc2UgYXMgYSBjb25kaXRpb24gaW4gdGhlIGZvcndhcmQgYW5kIGludmVyc2UgZnVuY3Rpb25zLlxuICB9XG5cbiAgaWYgKCF0aGlzLnRpdGxlKSB7XG4gICAgdGhpcy50aXRsZSA9ICdHZW9zdGF0aW9uYXJ5IFNhdGVsbGl0ZSBWaWV3JztcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHRtcCwgdl94LCB2X3ksIHZfejtcbiAgbG9uID0gbG9uIC0gdGhpcy5sb25nMDtcblxuICBpZiAodGhpcy5zaGFwZSA9PT0gJ2VsbGlwc2UnKSB7XG4gICAgbGF0ID0gTWF0aC5hdGFuKHRoaXMucmFkaXVzX3AyICogTWF0aC50YW4obGF0KSk7XG4gICAgdmFyIHIgPSB0aGlzLnJhZGl1c19wIC8gaHlwb3QodGhpcy5yYWRpdXNfcCAqIE1hdGguY29zKGxhdCksIE1hdGguc2luKGxhdCkpO1xuXG4gICAgdl94ID0gciAqIE1hdGguY29zKGxvbikgKiBNYXRoLmNvcyhsYXQpO1xuICAgIHZfeSA9IHIgKiBNYXRoLnNpbihsb24pICogTWF0aC5jb3MobGF0KTtcbiAgICB2X3ogPSByICogTWF0aC5zaW4obGF0KTtcblxuICAgIGlmICgoKHRoaXMucmFkaXVzX2cgLSB2X3gpICogdl94IC0gdl95ICogdl95IC0gdl96ICogdl96ICogdGhpcy5yYWRpdXNfcF9pbnYyKSA8IDAuMCkge1xuICAgICAgcC54ID0gTnVtYmVyLk5hTjtcbiAgICAgIHAueSA9IE51bWJlci5OYU47XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICB0bXAgPSB0aGlzLnJhZGl1c19nIC0gdl94O1xuICAgIGlmICh0aGlzLmZsaXBfYXhpcykge1xuICAgICAgcC54ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeSAvIGh5cG90KHZfeiwgdG1wKSk7XG4gICAgICBwLnkgPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl96IC8gdG1wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeSAvIHRtcCk7XG4gICAgICBwLnkgPSB0aGlzLnJhZGl1c19nXzEgKiBNYXRoLmF0YW4odl96IC8gaHlwb3Qodl95LCB0bXApKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5zaGFwZSA9PT0gJ3NwaGVyZScpIHtcbiAgICB0bXAgPSBNYXRoLmNvcyhsYXQpO1xuICAgIHZfeCA9IE1hdGguY29zKGxvbikgKiB0bXA7XG4gICAgdl95ID0gTWF0aC5zaW4obG9uKSAqIHRtcDtcbiAgICB2X3ogPSBNYXRoLnNpbihsYXQpO1xuICAgIHRtcCA9IHRoaXMucmFkaXVzX2cgLSB2X3g7XG5cbiAgICBpZiAodGhpcy5mbGlwX2F4aXMpIHtcbiAgICAgIHAueCA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3kgLyBoeXBvdCh2X3osIHRtcCkpO1xuICAgICAgcC55ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeiAvIHRtcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHRoaXMucmFkaXVzX2dfMSAqIE1hdGguYXRhbih2X3kgLyB0bXApO1xuICAgICAgcC55ID0gdGhpcy5yYWRpdXNfZ18xICogTWF0aC5hdGFuKHZfeiAvIGh5cG90KHZfeSwgdG1wKSk7XG4gICAgfVxuICB9XG4gIHAueCA9IHAueCAqIHRoaXMuYTtcbiAgcC55ID0gcC55ICogdGhpcy5hO1xuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciB2X3ggPSAtMS4wO1xuICB2YXIgdl95ID0gMC4wO1xuICB2YXIgdl96ID0gMC4wO1xuICB2YXIgYSwgYiwgZGV0LCBrO1xuXG4gIHAueCA9IHAueCAvIHRoaXMuYTtcbiAgcC55ID0gcC55IC8gdGhpcy5hO1xuXG4gIGlmICh0aGlzLnNoYXBlID09PSAnZWxsaXBzZScpIHtcbiAgICBpZiAodGhpcy5mbGlwX2F4aXMpIHtcbiAgICAgIHZfeiA9IE1hdGgudGFuKHAueSAvIHRoaXMucmFkaXVzX2dfMSk7XG4gICAgICB2X3kgPSBNYXRoLnRhbihwLnggLyB0aGlzLnJhZGl1c19nXzEpICogaHlwb3QoMS4wLCB2X3opO1xuICAgIH0gZWxzZSB7XG4gICAgICB2X3kgPSBNYXRoLnRhbihwLnggLyB0aGlzLnJhZGl1c19nXzEpO1xuICAgICAgdl96ID0gTWF0aC50YW4ocC55IC8gdGhpcy5yYWRpdXNfZ18xKSAqIGh5cG90KDEuMCwgdl95KTtcbiAgICB9XG5cbiAgICB2YXIgdl96cCA9IHZfeiAvIHRoaXMucmFkaXVzX3A7XG4gICAgYSA9IHZfeSAqIHZfeSArIHZfenAgKiB2X3pwICsgdl94ICogdl94O1xuICAgIGIgPSAyICogdGhpcy5yYWRpdXNfZyAqIHZfeDtcbiAgICBkZXQgPSAoYiAqIGIpIC0gNCAqIGEgKiB0aGlzLkM7XG5cbiAgICBpZiAoZGV0IDwgMC4wKSB7XG4gICAgICBwLnggPSBOdW1iZXIuTmFOO1xuICAgICAgcC55ID0gTnVtYmVyLk5hTjtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIGsgPSAoLWIgLSBNYXRoLnNxcnQoZGV0KSkgLyAoMi4wICogYSk7XG4gICAgdl94ID0gdGhpcy5yYWRpdXNfZyArIGsgKiB2X3g7XG4gICAgdl95ICo9IGs7XG4gICAgdl96ICo9IGs7XG5cbiAgICBwLnggPSBNYXRoLmF0YW4yKHZfeSwgdl94KTtcbiAgICBwLnkgPSBNYXRoLmF0YW4odl96ICogTWF0aC5jb3MocC54KSAvIHZfeCk7XG4gICAgcC55ID0gTWF0aC5hdGFuKHRoaXMucmFkaXVzX3BfaW52MiAqIE1hdGgudGFuKHAueSkpO1xuICB9IGVsc2UgaWYgKHRoaXMuc2hhcGUgPT09ICdzcGhlcmUnKSB7XG4gICAgaWYgKHRoaXMuZmxpcF9heGlzKSB7XG4gICAgICB2X3ogPSBNYXRoLnRhbihwLnkgLyB0aGlzLnJhZGl1c19nXzEpO1xuICAgICAgdl95ID0gTWF0aC50YW4ocC54IC8gdGhpcy5yYWRpdXNfZ18xKSAqIE1hdGguc3FydCgxLjAgKyB2X3ogKiB2X3opO1xuICAgIH0gZWxzZSB7XG4gICAgICB2X3kgPSBNYXRoLnRhbihwLnggLyB0aGlzLnJhZGl1c19nXzEpO1xuICAgICAgdl96ID0gTWF0aC50YW4ocC55IC8gdGhpcy5yYWRpdXNfZ18xKSAqIE1hdGguc3FydCgxLjAgKyB2X3kgKiB2X3kpO1xuICAgIH1cblxuICAgIGEgPSB2X3kgKiB2X3kgKyB2X3ogKiB2X3ogKyB2X3ggKiB2X3g7XG4gICAgYiA9IDIgKiB0aGlzLnJhZGl1c19nICogdl94O1xuICAgIGRldCA9IChiICogYikgLSA0ICogYSAqIHRoaXMuQztcbiAgICBpZiAoZGV0IDwgMC4wKSB7XG4gICAgICBwLnggPSBOdW1iZXIuTmFOO1xuICAgICAgcC55ID0gTnVtYmVyLk5hTjtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIGsgPSAoLWIgLSBNYXRoLnNxcnQoZGV0KSkgLyAoMi4wICogYSk7XG4gICAgdl94ID0gdGhpcy5yYWRpdXNfZyArIGsgKiB2X3g7XG4gICAgdl95ICo9IGs7XG4gICAgdl96ICo9IGs7XG5cbiAgICBwLnggPSBNYXRoLmF0YW4yKHZfeSwgdl94KTtcbiAgICBwLnkgPSBNYXRoLmF0YW4odl96ICogTWF0aC5jb3MocC54KSAvIHZfeCk7XG4gIH1cbiAgcC54ID0gcC54ICsgdGhpcy5sb25nMDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0dlb3N0YXRpb25hcnkgU2F0ZWxsaXRlIFZpZXcnLCAnR2Vvc3RhdGlvbmFyeV9TYXRlbGxpdGUnLCAnZ2VvcyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcbmltcG9ydCB7IEVQU0xOIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2luX3AxNFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc19wMTRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBpbmZpbml0eV9kaXN0XG4gKiBAcHJvcGVydHkge251bWJlcn0gcmNcbiAqL1xuXG4vKipcbiAgcmVmZXJlbmNlOlxuICAgIFdvbGZyYW0gTWF0aHdvcmxkIFwiR25vbW9uaWMgUHJvamVjdGlvblwiXG4gICAgaHR0cDovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9Hbm9tb25pY1Byb2plY3Rpb24uaHRtbFxuICAgIEFjY2Vzc2VkOiAxMnRoIE5vdmVtYmVyIDIwMDlcbiAgIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2VcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdGhpcy5zaW5fcDE0ID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgdGhpcy5jb3NfcDE0ID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgLy8gQXBwcm94aW1hdGlvbiBmb3IgcHJvamVjdGluZyBwb2ludHMgdG8gdGhlIGhvcml6b24gKGluZmluaXR5KVxuICB0aGlzLmluZmluaXR5X2Rpc3QgPSAxMDAwICogdGhpcy5hO1xuICB0aGlzLnJjID0gMTtcbn1cblxuLyogR25vbW9uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBzaW5waGksIGNvc3BoaTsgLyogc2luIGFuZCBjb3MgdmFsdWUgICAgICAgICovXG4gIHZhciBkbG9uOyAvKiBkZWx0YSBsb25naXR1ZGUgdmFsdWUgICAgICAqL1xuICB2YXIgY29zbG9uOyAvKiBjb3Mgb2YgbG9uZ2l0dWRlICAgICAgICAqL1xuICB2YXIga3NwOyAvKiBzY2FsZSBmYWN0b3IgICAgICAgICAgKi9cbiAgdmFyIGc7XG4gIHZhciB4LCB5O1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcblxuICBzaW5waGkgPSBNYXRoLnNpbihsYXQpO1xuICBjb3NwaGkgPSBNYXRoLmNvcyhsYXQpO1xuXG4gIGNvc2xvbiA9IE1hdGguY29zKGRsb24pO1xuICBnID0gdGhpcy5zaW5fcDE0ICogc2lucGhpICsgdGhpcy5jb3NfcDE0ICogY29zcGhpICogY29zbG9uO1xuICBrc3AgPSAxO1xuICBpZiAoKGcgPiAwKSB8fCAoTWF0aC5hYnMoZykgPD0gRVBTTE4pKSB7XG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiBrc3AgKiBjb3NwaGkgKiBNYXRoLnNpbihkbG9uKSAvIGc7XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBrc3AgKiAodGhpcy5jb3NfcDE0ICogc2lucGhpIC0gdGhpcy5zaW5fcDE0ICogY29zcGhpICogY29zbG9uKSAvIGc7XG4gIH0gZWxzZSB7XG4gICAgLy8gUG9pbnQgaXMgaW4gdGhlIG9wcG9zaW5nIGhlbWlzcGhlcmUgYW5kIGlzIHVucHJvamVjdGFibGVcbiAgICAvLyBXZSBzdGlsbCBuZWVkIHRvIHJldHVybiBhIHJlYXNvbmFibGUgcG9pbnQsIHNvIHdlIHByb2plY3RcbiAgICAvLyB0byBpbmZpbml0eSwgb24gYSBiZWFyaW5nXG4gICAgLy8gZXF1aXZhbGVudCB0byB0aGUgbm9ydGhlcm4gaGVtaXNwaGVyZSBlcXVpdmFsZW50XG4gICAgLy8gVGhpcyBpcyBhIHJlYXNvbmFibGUgYXBwcm94aW1hdGlvbiBmb3Igc2hvcnQgc2hhcGVzIGFuZCBsaW5lcyB0aGF0XG4gICAgLy8gc3RyYWRkbGUgdGhlIGhvcml6b24uXG5cbiAgICB4ID0gdGhpcy54MCArIHRoaXMuaW5maW5pdHlfZGlzdCAqIGNvc3BoaSAqIE1hdGguc2luKGRsb24pO1xuICAgIHkgPSB0aGlzLnkwICsgdGhpcy5pbmZpbml0eV9kaXN0ICogKHRoaXMuY29zX3AxNCAqIHNpbnBoaSAtIHRoaXMuc2luX3AxNCAqIGNvc3BoaSAqIGNvc2xvbik7XG4gIH1cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHJoOyAvKiBSaG8gKi9cbiAgdmFyIHNpbmMsIGNvc2M7XG4gIHZhciBjO1xuICB2YXIgbG9uLCBsYXQ7XG5cbiAgLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG4gIHAueCAvPSB0aGlzLmswO1xuICBwLnkgLz0gdGhpcy5rMDtcblxuICBpZiAoKHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSkpKSB7XG4gICAgYyA9IE1hdGguYXRhbjIocmgsIHRoaXMucmMpO1xuICAgIHNpbmMgPSBNYXRoLnNpbihjKTtcbiAgICBjb3NjID0gTWF0aC5jb3MoYyk7XG5cbiAgICBsYXQgPSBhc2lueihjb3NjICogdGhpcy5zaW5fcDE0ICsgKHAueSAqIHNpbmMgKiB0aGlzLmNvc19wMTQpIC8gcmgpO1xuICAgIGxvbiA9IE1hdGguYXRhbjIocC54ICogc2luYywgcmggKiB0aGlzLmNvc19wMTQgKiBjb3NjIC0gcC55ICogdGhpcy5zaW5fcDE0ICogc2luYyk7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgbG9uLCB0aGlzLm92ZXIpO1xuICB9IGVsc2Uge1xuICAgIGxhdCA9IHRoaXMucGhpYzA7XG4gICAgbG9uID0gMDtcbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnZ25vbSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLmEgPSA2Mzc3Mzk3LjE1NTtcbiAgdGhpcy5lcyA9IDAuMDA2Njc0MzcyMjMwNjE0O1xuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG4gIGlmICghdGhpcy5sYXQwKSB7XG4gICAgdGhpcy5sYXQwID0gMC44NjM5Mzc5Nzk3MzcxOTM7XG4gIH1cbiAgaWYgKCF0aGlzLmxvbmcwKSB7XG4gICAgdGhpcy5sb25nMCA9IDAuNzQxNzY0OTMyMDk3NTkwMSAtIDAuMzA4MzQxNTAxMTg1NjY1O1xuICB9XG4gIC8qIGlmIHNjYWxlIG5vdCBzZXQgZGVmYXVsdCB0byAwLjk5OTkgKi9cbiAgaWYgKCF0aGlzLmswKSB7XG4gICAgdGhpcy5rMCA9IDAuOTk5OTtcbiAgfVxuICB0aGlzLnM0NSA9IDAuNzg1Mzk4MTYzMzk3NDQ4OyAvKiA0NSAqL1xuICB0aGlzLnM5MCA9IDIgKiB0aGlzLnM0NTtcbiAgdGhpcy5maTAgPSB0aGlzLmxhdDA7XG4gIHRoaXMuZTIgPSB0aGlzLmVzO1xuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lMik7XG4gIHRoaXMuYWxmYSA9IE1hdGguc3FydCgxICsgKHRoaXMuZTIgKiBNYXRoLnBvdyhNYXRoLmNvcyh0aGlzLmZpMCksIDQpKSAvICgxIC0gdGhpcy5lMikpO1xuICB0aGlzLnVxID0gMS4wNDIxNjg1NjM4MDQ3NDtcbiAgdGhpcy51MCA9IE1hdGguYXNpbihNYXRoLnNpbih0aGlzLmZpMCkgLyB0aGlzLmFsZmEpO1xuICB0aGlzLmcgPSBNYXRoLnBvdygoMSArIHRoaXMuZSAqIE1hdGguc2luKHRoaXMuZmkwKSkgLyAoMSAtIHRoaXMuZSAqIE1hdGguc2luKHRoaXMuZmkwKSksIHRoaXMuYWxmYSAqIHRoaXMuZSAvIDIpO1xuICB0aGlzLmsgPSBNYXRoLnRhbih0aGlzLnUwIC8gMiArIHRoaXMuczQ1KSAvIE1hdGgucG93KE1hdGgudGFuKHRoaXMuZmkwIC8gMiArIHRoaXMuczQ1KSwgdGhpcy5hbGZhKSAqIHRoaXMuZztcbiAgdGhpcy5rMSA9IHRoaXMuazA7XG4gIHRoaXMubjAgPSB0aGlzLmEgKiBNYXRoLnNxcnQoMSAtIHRoaXMuZTIpIC8gKDEgLSB0aGlzLmUyICogTWF0aC5wb3coTWF0aC5zaW4odGhpcy5maTApLCAyKSk7XG4gIHRoaXMuczAgPSAxLjM3MDA4MzQ2MjgxNTU1O1xuICB0aGlzLm4gPSBNYXRoLnNpbih0aGlzLnMwKTtcbiAgdGhpcy5ybzAgPSB0aGlzLmsxICogdGhpcy5uMCAvIE1hdGgudGFuKHRoaXMuczApO1xuICB0aGlzLmFkID0gdGhpcy5zOTAgLSB0aGlzLnVxO1xufVxuXG4vKiBlbGxpcHNvaWQgKi9cbi8qIGNhbGN1bGF0ZSB4eSBmcm9tIGxhdC9sb24gKi9cbi8qIENvbnN0YW50cywgaWRlbnRpY2FsIHRvIGludmVyc2UgdHJhbnNmb3JtIGZ1bmN0aW9uICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBnZmksIHUsIGRlbHRhdiwgcywgZCwgZXBzLCBybztcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIGRlbHRhX2xvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgLyogVHJhbnNmb3JtYXRpb24gKi9cbiAgZ2ZpID0gTWF0aC5wb3coKCgxICsgdGhpcy5lICogTWF0aC5zaW4obGF0KSkgLyAoMSAtIHRoaXMuZSAqIE1hdGguc2luKGxhdCkpKSwgKHRoaXMuYWxmYSAqIHRoaXMuZSAvIDIpKTtcbiAgdSA9IDIgKiAoTWF0aC5hdGFuKHRoaXMuayAqIE1hdGgucG93KE1hdGgudGFuKGxhdCAvIDIgKyB0aGlzLnM0NSksIHRoaXMuYWxmYSkgLyBnZmkpIC0gdGhpcy5zNDUpO1xuICBkZWx0YXYgPSAtZGVsdGFfbG9uICogdGhpcy5hbGZhO1xuICBzID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYWQpICogTWF0aC5zaW4odSkgKyBNYXRoLnNpbih0aGlzLmFkKSAqIE1hdGguY29zKHUpICogTWF0aC5jb3MoZGVsdGF2KSk7XG4gIGQgPSBNYXRoLmFzaW4oTWF0aC5jb3ModSkgKiBNYXRoLnNpbihkZWx0YXYpIC8gTWF0aC5jb3MocykpO1xuICBlcHMgPSB0aGlzLm4gKiBkO1xuICBybyA9IHRoaXMucm8wICogTWF0aC5wb3coTWF0aC50YW4odGhpcy5zMCAvIDIgKyB0aGlzLnM0NSksIHRoaXMubikgLyBNYXRoLnBvdyhNYXRoLnRhbihzIC8gMiArIHRoaXMuczQ1KSwgdGhpcy5uKTtcbiAgcC55ID0gcm8gKiBNYXRoLmNvcyhlcHMpIC8gMTtcbiAgcC54ID0gcm8gKiBNYXRoLnNpbihlcHMpIC8gMTtcblxuICBpZiAoIXRoaXMuY3plY2gpIHtcbiAgICBwLnkgKj0gLTE7XG4gICAgcC54ICo9IC0xO1xuICB9XG4gIHJldHVybiAocCk7XG59XG5cbi8qIGNhbGN1bGF0ZSBsYXQvbG9uIGZyb20geHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHUsIGRlbHRhdiwgcywgZCwgZXBzLCBybywgZmkxO1xuICB2YXIgb2s7XG5cbiAgLyogVHJhbnNmb3JtYXRpb24gKi9cbiAgLyogcmV2ZXJ0IHksIHggKi9cbiAgdmFyIHRtcCA9IHAueDtcbiAgcC54ID0gcC55O1xuICBwLnkgPSB0bXA7XG4gIGlmICghdGhpcy5jemVjaCkge1xuICAgIHAueSAqPSAtMTtcbiAgICBwLnggKj0gLTE7XG4gIH1cbiAgcm8gPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgZXBzID0gTWF0aC5hdGFuMihwLnksIHAueCk7XG4gIGQgPSBlcHMgLyBNYXRoLnNpbih0aGlzLnMwKTtcbiAgcyA9IDIgKiAoTWF0aC5hdGFuKE1hdGgucG93KHRoaXMucm8wIC8gcm8sIDEgLyB0aGlzLm4pICogTWF0aC50YW4odGhpcy5zMCAvIDIgKyB0aGlzLnM0NSkpIC0gdGhpcy5zNDUpO1xuICB1ID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYWQpICogTWF0aC5zaW4ocykgLSBNYXRoLnNpbih0aGlzLmFkKSAqIE1hdGguY29zKHMpICogTWF0aC5jb3MoZCkpO1xuICBkZWx0YXYgPSBNYXRoLmFzaW4oTWF0aC5jb3MocykgKiBNYXRoLnNpbihkKSAvIE1hdGguY29zKHUpKTtcbiAgcC54ID0gdGhpcy5sb25nMCAtIGRlbHRhdiAvIHRoaXMuYWxmYTtcbiAgZmkxID0gdTtcbiAgb2sgPSAwO1xuICB2YXIgaXRlciA9IDA7XG4gIGRvIHtcbiAgICBwLnkgPSAyICogKE1hdGguYXRhbihNYXRoLnBvdyh0aGlzLmssIC0xIC8gdGhpcy5hbGZhKSAqIE1hdGgucG93KE1hdGgudGFuKHUgLyAyICsgdGhpcy5zNDUpLCAxIC8gdGhpcy5hbGZhKSAqIE1hdGgucG93KCgxICsgdGhpcy5lICogTWF0aC5zaW4oZmkxKSkgLyAoMSAtIHRoaXMuZSAqIE1hdGguc2luKGZpMSkpLCB0aGlzLmUgLyAyKSkgLSB0aGlzLnM0NSk7XG4gICAgaWYgKE1hdGguYWJzKGZpMSAtIHAueSkgPCAwLjAwMDAwMDAwMDEpIHtcbiAgICAgIG9rID0gMTtcbiAgICB9XG4gICAgZmkxID0gcC55O1xuICAgIGl0ZXIgKz0gMTtcbiAgfSB3aGlsZSAob2sgPT09IDAgJiYgaXRlciA8IDE1KTtcbiAgaWYgKGl0ZXIgPj0gMTUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAocCk7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0tyb3ZhaycsICdrcm92YWsnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHsgSEFMRl9QSSwgRVBTTE4sIEZPUlRQSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5pbXBvcnQgcXNmbnogZnJvbSAnLi4vY29tbW9uL3FzZm56JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtb2RlXG4gKiBAcHJvcGVydHkge0FycmF5PG51bWJlcj59IGFwYVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRkXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbW1mXG4gKiBAcHJvcGVydHkge251bWJlcn0gcnFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbmIxXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zYjFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5bWZcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB4bWZcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5waDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NwaDBcbiAqL1xuXG4vKlxuICByZWZlcmVuY2VcbiAgICBcIk5ldyBFcXVhbC1BcmVhIE1hcCBQcm9qZWN0aW9ucyBmb3IgTm9uY2lyY3VsYXIgUmVnaW9uc1wiLCBKb2huIFAuIFNueWRlcixcbiAgICBUaGUgQW1lcmljYW4gQ2FydG9ncmFwaGVyLCBWb2wgMTUsIE5vLiA0LCBPY3RvYmVyIDE5ODgsIHBwLiAzNDEtMzU1LlxuICAqL1xuXG5leHBvcnQgdmFyIFNfUE9MRSA9IDE7XG5leHBvcnQgdmFyIE5fUE9MRSA9IDI7XG5leHBvcnQgdmFyIEVRVUlUID0gMztcbmV4cG9ydCB2YXIgT0JMSVEgPSA0O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIExhbWJlcnQgQXppbXV0aGFsIEVxdWFsIEFyZWEgcHJvamVjdGlvblxuICogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHQgPSBNYXRoLmFicyh0aGlzLmxhdDApO1xuICBpZiAoTWF0aC5hYnModCAtIEhBTEZfUEkpIDwgRVBTTE4pIHtcbiAgICB0aGlzLm1vZGUgPSB0aGlzLmxhdDAgPCAwID8gU19QT0xFIDogTl9QT0xFO1xuICB9IGVsc2UgaWYgKE1hdGguYWJzKHQpIDwgRVBTTE4pIHtcbiAgICB0aGlzLm1vZGUgPSBFUVVJVDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1vZGUgPSBPQkxJUTtcbiAgfVxuICBpZiAodGhpcy5lcyA+IDApIHtcbiAgICB2YXIgc2lucGhpO1xuXG4gICAgdGhpcy5xcCA9IHFzZm56KHRoaXMuZSwgMSk7XG4gICAgdGhpcy5tbWYgPSAwLjUgLyAoMSAtIHRoaXMuZXMpO1xuICAgIHRoaXMuYXBhID0gYXV0aHNldCh0aGlzLmVzKTtcbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSBOX1BPTEU6XG4gICAgICAgIHRoaXMuZGQgPSAxO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU19QT0xFOlxuICAgICAgICB0aGlzLmRkID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVRVUlUOlxuICAgICAgICB0aGlzLnJxID0gTWF0aC5zcXJ0KDAuNSAqIHRoaXMucXApO1xuICAgICAgICB0aGlzLmRkID0gMSAvIHRoaXMucnE7XG4gICAgICAgIHRoaXMueG1mID0gMTtcbiAgICAgICAgdGhpcy55bWYgPSAwLjUgKiB0aGlzLnFwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT0JMSVE6XG4gICAgICAgIHRoaXMucnEgPSBNYXRoLnNxcnQoMC41ICogdGhpcy5xcCk7XG4gICAgICAgIHNpbnBoaSA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gICAgICAgIHRoaXMuc2luYjEgPSBxc2Zueih0aGlzLmUsIHNpbnBoaSkgLyB0aGlzLnFwO1xuICAgICAgICB0aGlzLmNvc2IxID0gTWF0aC5zcXJ0KDEgLSB0aGlzLnNpbmIxICogdGhpcy5zaW5iMSk7XG4gICAgICAgIHRoaXMuZGQgPSBNYXRoLmNvcyh0aGlzLmxhdDApIC8gKE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIHNpbnBoaSAqIHNpbnBoaSkgKiB0aGlzLnJxICogdGhpcy5jb3NiMSk7XG4gICAgICAgIHRoaXMueW1mID0gKHRoaXMueG1mID0gdGhpcy5ycSkgLyB0aGlzLmRkO1xuICAgICAgICB0aGlzLnhtZiAqPSB0aGlzLmRkO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gT0JMSVEpIHtcbiAgICAgIHRoaXMuc2lucGgwID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgICAgIHRoaXMuY29zcGgwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgICB9XG4gIH1cbn1cblxuLyogTGFtYmVydCBBemltdXRoYWwgRXF1YWwgQXJlYSBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHZhciB4LCB5LCBjb3NsYW0sIHNpbmxhbSwgc2lucGhpLCBxLCBzaW5iLCBjb3NiLCBiLCBjb3NwaGk7XG4gIHZhciBsYW0gPSBwLng7XG4gIHZhciBwaGkgPSBwLnk7XG5cbiAgbGFtID0gYWRqdXN0X2xvbihsYW0gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgY29zbGFtID0gTWF0aC5jb3MobGFtKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuICAgICAgeSA9ICh0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQpID8gMSArIGNvc3BoaSAqIGNvc2xhbSA6IDEgKyB0aGlzLnNpbnBoMCAqIHNpbnBoaSArIHRoaXMuY29zcGgwICogY29zcGhpICogY29zbGFtO1xuICAgICAgaWYgKHkgPD0gRVBTTE4pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB5ID0gTWF0aC5zcXJ0KDIgLyB5KTtcbiAgICAgIHggPSB5ICogY29zcGhpICogTWF0aC5zaW4obGFtKTtcbiAgICAgIHkgKj0gKHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkgPyBzaW5waGkgOiB0aGlzLmNvc3BoMCAqIHNpbnBoaSAtIHRoaXMuc2lucGgwICogY29zcGhpICogY29zbGFtO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlID09PSB0aGlzLk5fUE9MRSB8fCB0aGlzLm1vZGUgPT09IHRoaXMuU19QT0xFKSB7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk5fUE9MRSkge1xuICAgICAgICBjb3NsYW0gPSAtY29zbGFtO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGguYWJzKHBoaSArIHRoaXMubGF0MCkgPCBFUFNMTikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHkgPSBGT1JUUEkgLSBwaGkgKiAwLjU7XG4gICAgICB5ID0gMiAqICgodGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkgPyBNYXRoLmNvcyh5KSA6IE1hdGguc2luKHkpKTtcbiAgICAgIHggPSB5ICogTWF0aC5zaW4obGFtKTtcbiAgICAgIHkgKj0gY29zbGFtO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzaW5iID0gMDtcbiAgICBjb3NiID0gMDtcbiAgICBiID0gMDtcbiAgICBjb3NsYW0gPSBNYXRoLmNvcyhsYW0pO1xuICAgIHNpbmxhbSA9IE1hdGguc2luKGxhbSk7XG4gICAgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICBxID0gcXNmbnoodGhpcy5lLCBzaW5waGkpO1xuICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEgfHwgdGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSB7XG4gICAgICBzaW5iID0gcSAvIHRoaXMucXA7XG4gICAgICBjb3NiID0gTWF0aC5zcXJ0KDEgLSBzaW5iICogc2luYik7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlIHRoaXMuT0JMSVE6XG4gICAgICAgIGIgPSAxICsgdGhpcy5zaW5iMSAqIHNpbmIgKyB0aGlzLmNvc2IxICogY29zYiAqIGNvc2xhbTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuRVFVSVQ6XG4gICAgICAgIGIgPSAxICsgY29zYiAqIGNvc2xhbTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuTl9QT0xFOlxuICAgICAgICBiID0gSEFMRl9QSSArIHBoaTtcbiAgICAgICAgcSA9IHRoaXMucXAgLSBxO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5TX1BPTEU6XG4gICAgICAgIGIgPSBwaGkgLSBIQUxGX1BJO1xuICAgICAgICBxID0gdGhpcy5xcCArIHE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoTWF0aC5hYnMoYikgPCBFUFNMTikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlIHRoaXMuT0JMSVE6XG4gICAgICBjYXNlIHRoaXMuRVFVSVQ6XG4gICAgICAgIGIgPSBNYXRoLnNxcnQoMiAvIGIpO1xuICAgICAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRKSB7XG4gICAgICAgICAgeSA9IHRoaXMueW1mICogYiAqICh0aGlzLmNvc2IxICogc2luYiAtIHRoaXMuc2luYjEgKiBjb3NiICogY29zbGFtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB5ID0gKGIgPSBNYXRoLnNxcnQoMiAvICgxICsgY29zYiAqIGNvc2xhbSkpKSAqIHNpbmIgKiB0aGlzLnltZjtcbiAgICAgICAgfVxuICAgICAgICB4ID0gdGhpcy54bWYgKiBiICogY29zYiAqIHNpbmxhbTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuTl9QT0xFOlxuICAgICAgY2FzZSB0aGlzLlNfUE9MRTpcbiAgICAgICAgaWYgKHEgPj0gMCkge1xuICAgICAgICAgIHggPSAoYiA9IE1hdGguc3FydChxKSkgKiBzaW5sYW07XG4gICAgICAgICAgeSA9IGNvc2xhbSAqICgodGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkgPyBiIDogLWIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHggPSB5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwLnggPSB0aGlzLmEgKiB4ICsgdGhpcy54MDtcbiAgcC55ID0gdGhpcy5hICogeSArIHRoaXMueTA7XG4gIHJldHVybiBwO1xufVxuXG4vKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciB4ID0gcC54IC8gdGhpcy5hO1xuICB2YXIgeSA9IHAueSAvIHRoaXMuYTtcbiAgdmFyIGxhbSwgcGhpLCBjQ2UsIHNDZSwgcSwgcmhvLCBhYjtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgdmFyIGNvc3ogPSAwLFxuICAgICAgcmgsIHNpbnogPSAwO1xuXG4gICAgcmggPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgcGhpID0gcmggKiAwLjU7XG4gICAgaWYgKHBoaSA+IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBwaGkgPSAyICogTWF0aC5hc2luKHBoaSk7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSB8fCB0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQpIHtcbiAgICAgIHNpbnogPSBNYXRoLnNpbihwaGkpO1xuICAgICAgY29zeiA9IE1hdGguY29zKHBoaSk7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlIHRoaXMuRVFVSVQ6XG4gICAgICAgIHBoaSA9IChNYXRoLmFicyhyaCkgPD0gRVBTTE4pID8gMCA6IE1hdGguYXNpbih5ICogc2lueiAvIHJoKTtcbiAgICAgICAgeCAqPSBzaW56O1xuICAgICAgICB5ID0gY29zeiAqIHJoO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5PQkxJUTpcbiAgICAgICAgcGhpID0gKE1hdGguYWJzKHJoKSA8PSBFUFNMTikgPyB0aGlzLmxhdDAgOiBNYXRoLmFzaW4oY29zeiAqIHRoaXMuc2lucGgwICsgeSAqIHNpbnogKiB0aGlzLmNvc3BoMCAvIHJoKTtcbiAgICAgICAgeCAqPSBzaW56ICogdGhpcy5jb3NwaDA7XG4gICAgICAgIHkgPSAoY29zeiAtIE1hdGguc2luKHBoaSkgKiB0aGlzLnNpbnBoMCkgKiByaDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuTl9QT0xFOlxuICAgICAgICB5ID0gLXk7XG4gICAgICAgIHBoaSA9IEhBTEZfUEkgLSBwaGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLlNfUE9MRTpcbiAgICAgICAgcGhpIC09IEhBTEZfUEk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsYW0gPSAoeSA9PT0gMCAmJiAodGhpcy5tb2RlID09PSB0aGlzLkVRVUlUIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSkpID8gMCA6IE1hdGguYXRhbjIoeCwgeSk7XG4gIH0gZWxzZSB7XG4gICAgYWIgPSAwO1xuICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEgfHwgdGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSB7XG4gICAgICB4IC89IHRoaXMuZGQ7XG4gICAgICB5ICo9IHRoaXMuZGQ7XG4gICAgICByaG8gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgICBpZiAocmhvIDwgRVBTTE4pIHtcbiAgICAgICAgcC54ID0gdGhpcy5sb25nMDtcbiAgICAgICAgcC55ID0gdGhpcy5sYXQwO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH1cbiAgICAgIHNDZSA9IDIgKiBNYXRoLmFzaW4oMC41ICogcmhvIC8gdGhpcy5ycSk7XG4gICAgICBjQ2UgPSBNYXRoLmNvcyhzQ2UpO1xuICAgICAgeCAqPSAoc0NlID0gTWF0aC5zaW4oc0NlKSk7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRKSB7XG4gICAgICAgIGFiID0gY0NlICogdGhpcy5zaW5iMSArIHkgKiBzQ2UgKiB0aGlzLmNvc2IxIC8gcmhvO1xuICAgICAgICBxID0gdGhpcy5xcCAqIGFiO1xuICAgICAgICB5ID0gcmhvICogdGhpcy5jb3NiMSAqIGNDZSAtIHkgKiB0aGlzLnNpbmIxICogc0NlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWIgPSB5ICogc0NlIC8gcmhvO1xuICAgICAgICBxID0gdGhpcy5xcCAqIGFiO1xuICAgICAgICB5ID0gcmhvICogY0NlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlID09PSB0aGlzLk5fUE9MRSB8fCB0aGlzLm1vZGUgPT09IHRoaXMuU19QT0xFKSB7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk5fUE9MRSkge1xuICAgICAgICB5ID0gLXk7XG4gICAgICB9XG4gICAgICBxID0gKHggKiB4ICsgeSAqIHkpO1xuICAgICAgaWYgKCFxKSB7XG4gICAgICAgIHAueCA9IHRoaXMubG9uZzA7XG4gICAgICAgIHAueSA9IHRoaXMubGF0MDtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9XG4gICAgICBhYiA9IDEgLSBxIC8gdGhpcy5xcDtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuU19QT0xFKSB7XG4gICAgICAgIGFiID0gLWFiO1xuICAgICAgfVxuICAgIH1cbiAgICBsYW0gPSBNYXRoLmF0YW4yKHgsIHkpO1xuICAgIHBoaSA9IGF1dGhsYXQoTWF0aC5hc2luKGFiKSwgdGhpcy5hcGEpO1xuICB9XG5cbiAgcC54ID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgbGFtLCB0aGlzLm92ZXIpO1xuICBwLnkgPSBwaGk7XG4gIHJldHVybiBwO1xufVxuXG4vKiBkZXRlcm1pbmUgbGF0aXR1ZGUgZnJvbSBhdXRoYWxpYyBsYXRpdHVkZSAqL1xudmFyIFAwMCA9IDAuMzMzMzMzMzMzMzMzMzMzMzMzMzM7XG5cbnZhciBQMDEgPSAwLjE3MjIyMjIyMjIyMjIyMjIyMjIyO1xudmFyIFAwMiA9IDAuMTAyNTc5MzY1MDc5MzY1MDc5MzY7XG52YXIgUDEwID0gMC4wNjM4ODg4ODg4ODg4ODg4ODg4ODtcbnZhciBQMTEgPSAwLjA2NjQwMjExNjQwMjExNjQwMjExO1xudmFyIFAyMCA9IDAuMDE2NDE1MDEyOTQyMTkxNTQ0NDM7XG5cbmZ1bmN0aW9uIGF1dGhzZXQoZXMpIHtcbiAgdmFyIHQ7XG4gIHZhciBBUEEgPSBbXTtcbiAgQVBBWzBdID0gZXMgKiBQMDA7XG4gIHQgPSBlcyAqIGVzO1xuICBBUEFbMF0gKz0gdCAqIFAwMTtcbiAgQVBBWzFdID0gdCAqIFAxMDtcbiAgdCAqPSBlcztcbiAgQVBBWzBdICs9IHQgKiBQMDI7XG4gIEFQQVsxXSArPSB0ICogUDExO1xuICBBUEFbMl0gPSB0ICogUDIwO1xuICByZXR1cm4gQVBBO1xufVxuXG5mdW5jdGlvbiBhdXRobGF0KGJldGEsIEFQQSkge1xuICB2YXIgdCA9IGJldGEgKyBiZXRhO1xuICByZXR1cm4gKGJldGEgKyBBUEFbMF0gKiBNYXRoLnNpbih0KSArIEFQQVsxXSAqIE1hdGguc2luKHQgKyB0KSArIEFQQVsyXSAqIE1hdGguc2luKHQgKyB0ICsgdCkpO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydMYW1iZXJ0IEF6aW11dGhhbCBFcXVhbCBBcmVhJywgJ0xhbWJlcnRfQXppbXV0aGFsX0VxdWFsX0FyZWEnLCAnbGFlYSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXMsXG4gIFNfUE9MRTogU19QT0xFLFxuICBOX1BPTEU6IE5fUE9MRSxcbiAgRVFVSVQ6IEVRVUlULFxuICBPQkxJUTogT0JMSVFcbn07XG4iLCJpbXBvcnQgbXNmbnogZnJvbSAnLi4vY29tbW9uL21zZm56JztcbmltcG9ydCB0c2ZueiBmcm9tICcuLi9jb21tb24vdHNmbnonO1xuaW1wb3J0IHNpZ24gZnJvbSAnLi4vY29tbW9uL3NpZ24nO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHBoaTJ6IGZyb20gJy4uL2NvbW1vbi9waGkyeic7XG5pbXBvcnQgeyBIQUxGX1BJLCBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBuc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGYwXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmhcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIGRvdWJsZSBsYXQwOyAgICAgICAgICAgICAgICAgICAgLyogdGhlIHJlZmVyZW5jZSBsYXRpdHVkZSAgICAgICAgICAgICAgICovXG4gIC8vIGRvdWJsZSBsb25nMDsgICAgICAgICAgICAgICAgICAgLyogdGhlIHJlZmVyZW5jZSBsb25naXR1ZGUgICAgICAgICAgICAgICovXG4gIC8vIGRvdWJsZSBsYXQxOyAgICAgICAgICAgICAgICAgICAgLyogZmlyc3Qgc3RhbmRhcmQgcGFyYWxsZWwgICAgICAgICAgICAgICovXG4gIC8vIGRvdWJsZSBsYXQyOyAgICAgICAgICAgICAgICAgICAgLyogc2Vjb25kIHN0YW5kYXJkIHBhcmFsbGVsICAgICAgICAgICAgICovXG4gIC8vIGRvdWJsZSByX21hajsgICAgICAgICAgICAgICAgICAgLyogbWFqb3IgYXhpcyAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gIC8vIGRvdWJsZSByX21pbjsgICAgICAgICAgICAgICAgICAgLyogbWlub3IgYXhpcyAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gIC8vIGRvdWJsZSBmYWxzZV9lYXN0OyAgICAgICAgICAgICAgLyogeCBvZmZzZXQgaW4gbWV0ZXJzICAgICAgICAgICAgICAgICAgICovXG4gIC8vIGRvdWJsZSBmYWxzZV9ub3J0aDsgICAgICAgICAgICAgLyogeSBvZmZzZXQgaW4gbWV0ZXJzICAgICAgICAgICAgICAgICAgICovXG5cbiAgLy8gdGhlIGFib3ZlIHZhbHVlIGNhbiBiZSBzZXQgd2l0aCBwcm9qNC5kZWZzXG4gIC8vIGV4YW1wbGU6IHByb2o0LmRlZnMoXCJFUFNHOjIxNTRcIixcIitwcm9qPWxjYyArbGF0XzE9NDkgK2xhdF8yPTQ0ICtsYXRfMD00Ni41ICtsb25fMD0zICt4XzA9NzAwMDAwICt5XzA9NjYwMDAwMCArZWxscHM9R1JTODAgK3Rvd2dzODQ9MCwwLDAsMCwwLDAsMCArdW5pdHM9bSArbm9fZGVmc1wiKTtcblxuICBpZiAoIXRoaXMubGF0Mikge1xuICAgIHRoaXMubGF0MiA9IHRoaXMubGF0MTtcbiAgfSAvLyBpZiBsYXQyIGlzIG5vdCBkZWZpbmVkXG4gIGlmICghdGhpcy5rMCkge1xuICAgIHRoaXMuazAgPSAxO1xuICB9XG4gIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG4gIC8vIFN0YW5kYXJkIFBhcmFsbGVscyBjYW5ub3QgYmUgZXF1YWwgYW5kIG9uIG9wcG9zaXRlIHNpZGVzIG9mIHRoZSBlcXVhdG9yXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgKyB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdGVtcCA9IHRoaXMuYiAvIHRoaXMuYTtcbiAgdGhpcy5lID0gTWF0aC5zcXJ0KDEgLSB0ZW1wICogdGVtcCk7XG5cbiAgdmFyIHNpbjEgPSBNYXRoLnNpbih0aGlzLmxhdDEpO1xuICB2YXIgY29zMSA9IE1hdGguY29zKHRoaXMubGF0MSk7XG4gIHZhciBtczEgPSBtc2Zueih0aGlzLmUsIHNpbjEsIGNvczEpO1xuICB2YXIgdHMxID0gdHNmbnoodGhpcy5lLCB0aGlzLmxhdDEsIHNpbjEpO1xuXG4gIHZhciBzaW4yID0gTWF0aC5zaW4odGhpcy5sYXQyKTtcbiAgdmFyIGNvczIgPSBNYXRoLmNvcyh0aGlzLmxhdDIpO1xuICB2YXIgbXMyID0gbXNmbnoodGhpcy5lLCBzaW4yLCBjb3MyKTtcbiAgdmFyIHRzMiA9IHRzZm56KHRoaXMuZSwgdGhpcy5sYXQyLCBzaW4yKTtcblxuICB2YXIgdHMwID0gTWF0aC5hYnMoTWF0aC5hYnModGhpcy5sYXQwKSAtIEhBTEZfUEkpIDwgRVBTTE5cbiAgICA/IDAgLy8gSGFuZGxlIHBvbGVzIGJ5IHNldHRpbmcgdHMwIHRvIDBcbiAgICA6IHRzZm56KHRoaXMuZSwgdGhpcy5sYXQwLCBNYXRoLnNpbih0aGlzLmxhdDApKTtcblxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxIC0gdGhpcy5sYXQyKSA+IEVQU0xOKSB7XG4gICAgdGhpcy5ucyA9IE1hdGgubG9nKG1zMSAvIG1zMikgLyBNYXRoLmxvZyh0czEgLyB0czIpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubnMgPSBzaW4xO1xuICB9XG4gIGlmIChpc05hTih0aGlzLm5zKSkge1xuICAgIHRoaXMubnMgPSBzaW4xO1xuICB9XG4gIHRoaXMuZjAgPSBtczEgLyAodGhpcy5ucyAqIE1hdGgucG93KHRzMSwgdGhpcy5ucykpO1xuICB0aGlzLnJoID0gdGhpcy5hICogdGhpcy5mMCAqIE1hdGgucG93KHRzMCwgdGhpcy5ucyk7XG4gIGlmICghdGhpcy50aXRsZSkge1xuICAgIHRoaXMudGl0bGUgPSAnTGFtYmVydCBDb25mb3JtYWwgQ29uaWMnO1xuICB9XG59XG5cbi8vIExhbWJlcnQgQ29uZm9ybWFsIGNvbmljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICAvLyBzaW5ndWxhciBjYXNlcyA6XG4gIGlmIChNYXRoLmFicygyICogTWF0aC5hYnMobGF0KSAtIE1hdGguUEkpIDw9IEVQU0xOKSB7XG4gICAgbGF0ID0gc2lnbihsYXQpICogKEhBTEZfUEkgLSAyICogRVBTTE4pO1xuICB9XG5cbiAgdmFyIGNvbiA9IE1hdGguYWJzKE1hdGguYWJzKGxhdCkgLSBIQUxGX1BJKTtcbiAgdmFyIHRzLCByaDE7XG4gIGlmIChjb24gPiBFUFNMTikge1xuICAgIHRzID0gdHNmbnoodGhpcy5lLCBsYXQsIE1hdGguc2luKGxhdCkpO1xuICAgIHJoMSA9IHRoaXMuYSAqIHRoaXMuZjAgKiBNYXRoLnBvdyh0cywgdGhpcy5ucyk7XG4gIH0gZWxzZSB7XG4gICAgY29uID0gbGF0ICogdGhpcy5ucztcbiAgICBpZiAoY29uIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByaDEgPSAwO1xuICB9XG4gIHZhciB0aGV0YSA9IHRoaXMubnMgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHAueCA9IHRoaXMuazAgKiAocmgxICogTWF0aC5zaW4odGhldGEpKSArIHRoaXMueDA7XG4gIHAueSA9IHRoaXMuazAgKiAodGhpcy5yaCAtIHJoMSAqIE1hdGguY29zKHRoZXRhKSkgKyB0aGlzLnkwO1xuXG4gIHJldHVybiBwO1xufVxuXG4vLyBMYW1iZXJ0IENvbmZvcm1hbCBDb25pYyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciByaDEsIGNvbiwgdHM7XG4gIHZhciBsYXQsIGxvbjtcbiAgdmFyIHggPSAocC54IC0gdGhpcy54MCkgLyB0aGlzLmswO1xuICB2YXIgeSA9ICh0aGlzLnJoIC0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5rMCk7XG4gIGlmICh0aGlzLm5zID4gMCkge1xuICAgIHJoMSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICBjb24gPSAxO1xuICB9IGVsc2Uge1xuICAgIHJoMSA9IC1NYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgY29uID0gLTE7XG4gIH1cbiAgdmFyIHRoZXRhID0gMDtcbiAgaWYgKHJoMSAhPT0gMCkge1xuICAgIHRoZXRhID0gTWF0aC5hdGFuMigoY29uICogeCksIChjb24gKiB5KSk7XG4gIH1cbiAgaWYgKChyaDEgIT09IDApIHx8ICh0aGlzLm5zID4gMCkpIHtcbiAgICBjb24gPSAxIC8gdGhpcy5ucztcbiAgICB0cyA9IE1hdGgucG93KChyaDEgLyAodGhpcy5hICogdGhpcy5mMCkpLCBjb24pO1xuICAgIGxhdCA9IHBoaTJ6KHRoaXMuZSwgdHMpO1xuICAgIGlmIChsYXQgPT09IC05OTk5KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGF0ID0gLUhBTEZfUEk7XG4gIH1cbiAgbG9uID0gYWRqdXN0X2xvbih0aGV0YSAvIHRoaXMubnMgKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcbiAgJ0xhbWJlcnQgVGFuZ2VudGlhbCBDb25mb3JtYWwgQ29uaWMgUHJvamVjdGlvbicsXG4gICdMYW1iZXJ0X0NvbmZvcm1hbF9Db25pYycsXG4gICdMYW1iZXJ0X0NvbmZvcm1hbF9Db25pY18xU1AnLFxuICAnTGFtYmVydF9Db25mb3JtYWxfQ29uaWNfMlNQJyxcbiAgJ2xjYycsXG4gICdMYW1iZXJ0IENvbmljIENvbmZvcm1hbCAoMVNQKScsXG4gICdMYW1iZXJ0IENvbmljIENvbmZvcm1hbCAoMlNQKSdcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIG5vLW9wIGZvciBsb25nbGF0XG59XG5cbmZ1bmN0aW9uIGlkZW50aXR5KHB0KSB7XG4gIHJldHVybiBwdDtcbn1cbmV4cG9ydCB7IGlkZW50aXR5IGFzIGZvcndhcmQgfTtcbmV4cG9ydCB7IGlkZW50aXR5IGFzIGludmVyc2UgfTtcbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ2xvbmdsYXQnLCAnaWRlbnRpdHknXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogaWRlbnRpdHksXG4gIGludmVyc2U6IGlkZW50aXR5LFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgbXNmbnogZnJvbSAnLi4vY29tbW9uL21zZm56JztcblxuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHRzZm56IGZyb20gJy4uL2NvbW1vbi90c2Zueic7XG5pbXBvcnQgcGhpMnogZnJvbSAnLi4vY29tbW9uL3BoaTJ6JztcbmltcG9ydCB7IEZPUlRQSSwgUjJELCBFUFNMTiwgSEFMRl9QSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGtcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBjb24gPSB0aGlzLmIgLyB0aGlzLmE7XG4gIHRoaXMuZXMgPSAxIC0gY29uICogY29uO1xuICBpZiAoISgneDAnIGluIHRoaXMpKSB7XG4gICAgdGhpcy54MCA9IDA7XG4gIH1cbiAgaWYgKCEoJ3kwJyBpbiB0aGlzKSkge1xuICAgIHRoaXMueTAgPSAwO1xuICB9XG4gIHRoaXMuZSA9IE1hdGguc3FydCh0aGlzLmVzKTtcbiAgaWYgKHRoaXMubGF0X3RzKSB7XG4gICAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgICB0aGlzLmswID0gTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmswID0gbXNmbnoodGhpcy5lLCBNYXRoLnNpbih0aGlzLmxhdF90cyksIE1hdGguY29zKHRoaXMubGF0X3RzKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghdGhpcy5rMCkge1xuICAgICAgaWYgKHRoaXMuaykge1xuICAgICAgICB0aGlzLmswID0gdGhpcy5rO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5rMCA9IDE7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qIE1lcmNhdG9yIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIC8vIGNvbnZlcnQgdG8gcmFkaWFuc1xuICBpZiAobGF0ICogUjJEID4gOTAgJiYgbGF0ICogUjJEIDwgLTkwICYmIGxvbiAqIFIyRCA+IDE4MCAmJiBsb24gKiBSMkQgPCAtMTgwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgeCwgeTtcbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKGxhdCkgLSBIQUxGX1BJKSA8PSBFUFNMTikge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGlzLnNwaGVyZSkge1xuICAgICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiB0aGlzLmswICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICAgICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiB0aGlzLmswICogTWF0aC5sb2coTWF0aC50YW4oRk9SVFBJICsgMC41ICogbGF0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzaW5waGkgPSBNYXRoLnNpbihsYXQpO1xuICAgICAgdmFyIHRzID0gdHNmbnoodGhpcy5lLCBsYXQsIHNpbnBoaSk7XG4gICAgICB4ID0gdGhpcy54MCArIHRoaXMuYSAqIHRoaXMuazAgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gICAgICB5ID0gdGhpcy55MCAtIHRoaXMuYSAqIHRoaXMuazAgKiBNYXRoLmxvZyh0cyk7XG4gICAgfVxuICAgIHAueCA9IHg7XG4gICAgcC55ID0geTtcbiAgICByZXR1cm4gcDtcbiAgfVxufVxuXG4vKiBNZXJjYXRvciBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHggPSBwLnggLSB0aGlzLngwO1xuICB2YXIgeSA9IHAueSAtIHRoaXMueTA7XG4gIHZhciBsb24sIGxhdDtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsYXQgPSBIQUxGX1BJIC0gMiAqIE1hdGguYXRhbihNYXRoLmV4cCgteSAvICh0aGlzLmEgKiB0aGlzLmswKSkpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0cyA9IE1hdGguZXhwKC15IC8gKHRoaXMuYSAqIHRoaXMuazApKTtcbiAgICBsYXQgPSBwaGkyeih0aGlzLmUsIHRzKTtcbiAgICBpZiAobGF0ID09PSAtOTk5OSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHggLyAodGhpcy5hICogdGhpcy5rMCksIHRoaXMub3Zlcik7XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydNZXJjYXRvcicsICdQb3B1bGFyIFZpc3VhbGlzYXRpb24gUHNldWRvIE1lcmNhdG9yJywgJ01lcmNhdG9yXzFTUCcsICdNZXJjYXRvcl9BdXhpbGlhcnlfU3BoZXJlJywgJ01lcmNhdG9yX1ZhcmlhbnRfQScsICdtZXJjJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuLypcbiAgcmVmZXJlbmNlXG4gICAgXCJOZXcgRXF1YWwtQXJlYSBNYXAgUHJvamVjdGlvbnMgZm9yIE5vbmNpcmN1bGFyIFJlZ2lvbnNcIiwgSm9obiBQLiBTbnlkZXIsXG4gICAgVGhlIEFtZXJpY2FuIENhcnRvZ3JhcGhlciwgVm9sIDE1LCBOby4gNCwgT2N0b2JlciAxOTg4LCBwcC4gMzQxLTM1NS5cbiAgKi9cblxuLyogSW5pdGlhbGl6ZSB0aGUgTWlsbGVyIEN5bGluZHJpY2FsIHByb2plY3Rpb25cbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIG5vLW9wXG59XG5cbi8qIE1pbGxlciBDeWxpbmRyaWNhbCBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiBkbG9uO1xuICB2YXIgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBNYXRoLmxvZyhNYXRoLnRhbigoTWF0aC5QSSAvIDQpICsgKGxhdCAvIDIuNSkpKSAqIDEuMjU7XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIE1pbGxlciBDeWxpbmRyaWNhbCBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuXG4gIHZhciBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBwLnggLyB0aGlzLmEsIHRoaXMub3Zlcik7XG4gIHZhciBsYXQgPSAyLjUgKiAoTWF0aC5hdGFuKE1hdGguZXhwKDAuOCAqIHAueSAvIHRoaXMuYSkpIC0gTWF0aC5QSSAvIDQpO1xuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnTWlsbGVyX0N5bGluZHJpY2FsJywgJ21pbGwnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHsgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLngwID0gdGhpcy54MCAhPT0gdW5kZWZpbmVkID8gdGhpcy54MCA6IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwICE9PSB1bmRlZmluZWQgPyB0aGlzLnkwIDogMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgIT09IHVuZGVmaW5lZCA/IHRoaXMubG9uZzAgOiAwO1xufVxuXG4vKiBNb2xsd2VpZGUgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICB2YXIgZGVsdGFfbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgdGhldGEgPSBsYXQ7XG4gIHZhciBjb24gPSBNYXRoLlBJICogTWF0aC5zaW4obGF0KTtcblxuICAvKiBJdGVyYXRlIHVzaW5nIHRoZSBOZXd0b24tUmFwaHNvbiBtZXRob2QgdG8gZmluZCB0aGV0YVxuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgZGVsdGFfdGhldGEgPSAtKHRoZXRhICsgTWF0aC5zaW4odGhldGEpIC0gY29uKSAvICgxICsgTWF0aC5jb3ModGhldGEpKTtcbiAgICB0aGV0YSArPSBkZWx0YV90aGV0YTtcbiAgICBpZiAoTWF0aC5hYnMoZGVsdGFfdGhldGEpIDwgRVBTTE4pIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGV0YSAvPSAyO1xuXG4gIC8qIElmIHRoZSBsYXRpdHVkZSBpcyA5MCBkZWcsIGZvcmNlIHRoZSB4IGNvb3JkaW5hdGUgdG8gYmUgXCIwICsgZmFsc2UgZWFzdGluZ1wiXG4gICAgICAgdGhpcyBpcyBkb25lIGhlcmUgYmVjYXVzZSBvZiBwcmVjaXNpb24gcHJvYmxlbXMgd2l0aCBcImNvcyh0aGV0YSlcIlxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIGlmIChNYXRoLlBJIC8gMiAtIE1hdGguYWJzKGxhdCkgPCBFUFNMTikge1xuICAgIGRlbHRhX2xvbiA9IDA7XG4gIH1cbiAgdmFyIHggPSAwLjkwMDMxNjMxNjE1OCAqIHRoaXMuYSAqIGRlbHRhX2xvbiAqIE1hdGguY29zKHRoZXRhKSArIHRoaXMueDA7XG4gIHZhciB5ID0gMS40MTQyMTM1NjIzNzMxICogdGhpcy5hICogTWF0aC5zaW4odGhldGEpICsgdGhpcy55MDtcblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgdGhldGE7XG4gIHZhciBhcmc7XG5cbiAgLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgYXJnID0gcC55IC8gKDEuNDE0MjEzNTYyMzczMSAqIHRoaXMuYSk7XG5cbiAgLyogQmVjYXVzZSBvZiBkaXZpc2lvbiBieSB6ZXJvIHByb2JsZW1zLCAnYXJnJyBjYW4gbm90IGJlIDEuICBUaGVyZWZvcmVcbiAgICAgICBhIG51bWJlciB2ZXJ5IGNsb3NlIHRvIG9uZSBpcyB1c2VkIGluc3RlYWQuXG4gICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBpZiAoTWF0aC5hYnMoYXJnKSA+IDAuOTk5OTk5OTk5OTk5KSB7XG4gICAgYXJnID0gMC45OTk5OTk5OTk5OTk7XG4gIH1cbiAgdGhldGEgPSBNYXRoLmFzaW4oYXJnKTtcbiAgdmFyIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIChwLnggLyAoMC45MDAzMTYzMTYxNTggKiB0aGlzLmEgKiBNYXRoLmNvcyh0aGV0YSkpKSwgdGhpcy5vdmVyKTtcbiAgaWYgKGxvbiA8ICgtTWF0aC5QSSkpIHtcbiAgICBsb24gPSAtTWF0aC5QSTtcbiAgfVxuICBpZiAobG9uID4gTWF0aC5QSSkge1xuICAgIGxvbiA9IE1hdGguUEk7XG4gIH1cbiAgYXJnID0gKDIgKiB0aGV0YSArIE1hdGguc2luKDIgKiB0aGV0YSkpIC8gTWF0aC5QSTtcbiAgaWYgKE1hdGguYWJzKGFyZykgPiAxKSB7XG4gICAgYXJnID0gMTtcbiAgfVxuICB2YXIgbGF0ID0gTWF0aC5hc2luKGFyZyk7XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydNb2xsd2VpZGUnLCAnbW9sbCddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgeyBTRUNfVE9fUkFEIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbi8qXG4gIHJlZmVyZW5jZVxuICAgIERlcGFydG1lbnQgb2YgTGFuZCBhbmQgU3VydmV5IFRlY2huaWNhbCBDaXJjdWxhciAxOTczLzMyXG4gICAgICBodHRwOi8vd3d3LmxpbnouZ292dC5uei9kb2NzL21pc2NlbGxhbmVvdXMvbnotbWFwLWRlZmluaXRpb24ucGRmXG4gICAgT1NHIFRlY2huaWNhbCBSZXBvcnQgNC4xXG4gICAgICBodHRwOi8vd3d3LmxpbnouZ292dC5uei9kb2NzL21pc2NlbGxhbmVvdXMvbnptZy5wZGZcbiAgKi9cblxuLyoqXG4gKiBpdGVyYXRpb25zOiBOdW1iZXIgb2YgaXRlcmF0aW9ucyB0byByZWZpbmUgaW52ZXJzZSB0cmFuc2Zvcm0uXG4gKiAgICAgMCAtPiBrbSBhY2N1cmFjeVxuICogICAgIDEgLT4gbSBhY2N1cmFjeSAtLSBzdWl0YWJsZSBmb3IgbW9zdCBtYXBwaW5nIGFwcGxpY2F0aW9uc1xuICogICAgIDIgLT4gbW0gYWNjdXJhY3lcbiAqL1xuZXhwb3J0IHZhciBpdGVyYXRpb25zID0gMTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMuQSA9IFtdO1xuICB0aGlzLkFbMV0gPSAwLjYzOTkxNzUwNzM7XG4gIHRoaXMuQVsyXSA9IC0wLjEzNTg3OTc2MTM7XG4gIHRoaXMuQVszXSA9IDAuMDYzMjk0NDA5O1xuICB0aGlzLkFbNF0gPSAtMC4wMjUyNjg1MztcbiAgdGhpcy5BWzVdID0gMC4wMTE3ODc5O1xuICB0aGlzLkFbNl0gPSAtMC4wMDU1MTYxO1xuICB0aGlzLkFbN10gPSAwLjAwMjY5MDY7XG4gIHRoaXMuQVs4XSA9IC0wLjAwMTMzMztcbiAgdGhpcy5BWzldID0gMC4wMDA2NztcbiAgdGhpcy5BWzEwXSA9IC0wLjAwMDM0O1xuXG4gIHRoaXMuQl9yZSA9IFtdO1xuICB0aGlzLkJfaW0gPSBbXTtcbiAgdGhpcy5CX3JlWzFdID0gMC43NTU3ODUzMjI4O1xuICB0aGlzLkJfaW1bMV0gPSAwO1xuICB0aGlzLkJfcmVbMl0gPSAwLjI0OTIwNDY0NjtcbiAgdGhpcy5CX2ltWzJdID0gMC4wMDMzNzE1MDc7XG4gIHRoaXMuQl9yZVszXSA9IC0wLjAwMTU0MTczOTtcbiAgdGhpcy5CX2ltWzNdID0gMC4wNDEwNTg1NjA7XG4gIHRoaXMuQl9yZVs0XSA9IC0wLjEwMTYyOTA3O1xuICB0aGlzLkJfaW1bNF0gPSAwLjAxNzI3NjA5O1xuICB0aGlzLkJfcmVbNV0gPSAtMC4yNjYyMzQ4OTtcbiAgdGhpcy5CX2ltWzVdID0gLTAuMzYyNDkyMTg7XG4gIHRoaXMuQl9yZVs2XSA9IC0wLjY4NzA5ODM7XG4gIHRoaXMuQl9pbVs2XSA9IC0xLjE2NTE5Njc7XG5cbiAgdGhpcy5DX3JlID0gW107XG4gIHRoaXMuQ19pbSA9IFtdO1xuICB0aGlzLkNfcmVbMV0gPSAxLjMyMzEyNzA0Mzk7XG4gIHRoaXMuQ19pbVsxXSA9IDA7XG4gIHRoaXMuQ19yZVsyXSA9IC0wLjU3NzI0NTc4OTtcbiAgdGhpcy5DX2ltWzJdID0gLTAuMDA3ODA5NTk4O1xuICB0aGlzLkNfcmVbM10gPSAwLjUwODMwNzUxMztcbiAgdGhpcy5DX2ltWzNdID0gLTAuMTEyMjA4OTUyO1xuICB0aGlzLkNfcmVbNF0gPSAtMC4xNTA5NDc2MjtcbiAgdGhpcy5DX2ltWzRdID0gMC4xODIwMDYwMjtcbiAgdGhpcy5DX3JlWzVdID0gMS4wMTQxODE3OTtcbiAgdGhpcy5DX2ltWzVdID0gMS42NDQ5NzY5NjtcbiAgdGhpcy5DX3JlWzZdID0gMS45NjYwNTQ5O1xuICB0aGlzLkNfaW1bNl0gPSAyLjUxMjc2NDU7XG5cbiAgdGhpcy5EID0gW107XG4gIHRoaXMuRFsxXSA9IDEuNTYyNzAxNDI0MztcbiAgdGhpcy5EWzJdID0gMC41MTg1NDA2Mzk4O1xuICB0aGlzLkRbM10gPSAtMC4wMzMzMzA5ODtcbiAgdGhpcy5EWzRdID0gLTAuMTA1MjkwNjtcbiAgdGhpcy5EWzVdID0gLTAuMDM2ODU5NDtcbiAgdGhpcy5EWzZdID0gMC4wMDczMTc7XG4gIHRoaXMuRFs3XSA9IDAuMDEyMjA7XG4gIHRoaXMuRFs4XSA9IDAuMDAzOTQ7XG4gIHRoaXMuRFs5XSA9IC0wLjAwMTM7XG59XG5cbi8qKlxuICAgIE5ldyBaZWFsYW5kIE1hcCBHcmlkIEZvcndhcmQgIC0gbG9uZy9sYXQgdG8geC95XG4gICAgbG9uZy9sYXQgaW4gcmFkaWFuc1xuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbjtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICB2YXIgZGVsdGFfbGF0ID0gbGF0IC0gdGhpcy5sYXQwO1xuICB2YXIgZGVsdGFfbG9uID0gbG9uIC0gdGhpcy5sb25nMDtcblxuICAvLyAxLiBDYWxjdWxhdGUgZF9waGkgYW5kIGRfcHNpICAgIC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGRfbGFtYmRhXG4gIC8vIEZvciB0aGlzIGFsZ29yaXRobSwgZGVsdGFfbGF0aXR1ZGUgaXMgaW4gc2Vjb25kcyBvZiBhcmMgeCAxMC01LCBzbyB3ZSBuZWVkIHRvIHNjYWxlIHRvIHRob3NlIHVuaXRzLiBMb25naXR1ZGUgaXMgcmFkaWFucy5cbiAgdmFyIGRfcGhpID0gZGVsdGFfbGF0IC8gU0VDX1RPX1JBRCAqIDFFLTU7XG4gIHZhciBkX2xhbWJkYSA9IGRlbHRhX2xvbjtcbiAgdmFyIGRfcGhpX24gPSAxOyAvLyBkX3BoaV4wXG5cbiAgdmFyIGRfcHNpID0gMDtcbiAgZm9yIChuID0gMTsgbiA8PSAxMDsgbisrKSB7XG4gICAgZF9waGlfbiA9IGRfcGhpX24gKiBkX3BoaTtcbiAgICBkX3BzaSA9IGRfcHNpICsgdGhpcy5BW25dICogZF9waGlfbjtcbiAgfVxuXG4gIC8vIDIuIENhbGN1bGF0ZSB0aGV0YVxuICB2YXIgdGhfcmUgPSBkX3BzaTtcbiAgdmFyIHRoX2ltID0gZF9sYW1iZGE7XG5cbiAgLy8gMy4gQ2FsY3VsYXRlIHpcbiAgdmFyIHRoX25fcmUgPSAxO1xuICB2YXIgdGhfbl9pbSA9IDA7IC8vIHRoZXRhXjBcbiAgdmFyIHRoX25fcmUxO1xuICB2YXIgdGhfbl9pbTE7XG5cbiAgdmFyIHpfcmUgPSAwO1xuICB2YXIgel9pbSA9IDA7XG4gIGZvciAobiA9IDE7IG4gPD0gNjsgbisrKSB7XG4gICAgdGhfbl9yZTEgPSB0aF9uX3JlICogdGhfcmUgLSB0aF9uX2ltICogdGhfaW07XG4gICAgdGhfbl9pbTEgPSB0aF9uX2ltICogdGhfcmUgKyB0aF9uX3JlICogdGhfaW07XG4gICAgdGhfbl9yZSA9IHRoX25fcmUxO1xuICAgIHRoX25faW0gPSB0aF9uX2ltMTtcbiAgICB6X3JlID0gel9yZSArIHRoaXMuQl9yZVtuXSAqIHRoX25fcmUgLSB0aGlzLkJfaW1bbl0gKiB0aF9uX2ltO1xuICAgIHpfaW0gPSB6X2ltICsgdGhpcy5CX2ltW25dICogdGhfbl9yZSArIHRoaXMuQl9yZVtuXSAqIHRoX25faW07XG4gIH1cblxuICAvLyA0LiBDYWxjdWxhdGUgZWFzdGluZyBhbmQgbm9ydGhpbmdcbiAgcC54ID0gKHpfaW0gKiB0aGlzLmEpICsgdGhpcy54MDtcbiAgcC55ID0gKHpfcmUgKiB0aGlzLmEpICsgdGhpcy55MDtcblxuICByZXR1cm4gcDtcbn1cblxuLyoqXG4gICAgTmV3IFplYWxhbmQgTWFwIEdyaWQgSW52ZXJzZSAgLSAgeC95IHRvIGxvbmcvbGF0XG4gICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBuO1xuICB2YXIgeCA9IHAueDtcbiAgdmFyIHkgPSBwLnk7XG5cbiAgdmFyIGRlbHRhX3ggPSB4IC0gdGhpcy54MDtcbiAgdmFyIGRlbHRhX3kgPSB5IC0gdGhpcy55MDtcblxuICAvLyAxLiBDYWxjdWxhdGUgelxuICB2YXIgel9yZSA9IGRlbHRhX3kgLyB0aGlzLmE7XG4gIHZhciB6X2ltID0gZGVsdGFfeCAvIHRoaXMuYTtcblxuICAvLyAyYS4gQ2FsY3VsYXRlIHRoZXRhIC0gZmlyc3QgYXBwcm94aW1hdGlvbiBnaXZlcyBrbSBhY2N1cmFjeVxuICB2YXIgel9uX3JlID0gMTtcbiAgdmFyIHpfbl9pbSA9IDA7IC8vIHpeMFxuICB2YXIgel9uX3JlMTtcbiAgdmFyIHpfbl9pbTE7XG5cbiAgdmFyIHRoX3JlID0gMDtcbiAgdmFyIHRoX2ltID0gMDtcbiAgZm9yIChuID0gMTsgbiA8PSA2OyBuKyspIHtcbiAgICB6X25fcmUxID0gel9uX3JlICogel9yZSAtIHpfbl9pbSAqIHpfaW07XG4gICAgel9uX2ltMSA9IHpfbl9pbSAqIHpfcmUgKyB6X25fcmUgKiB6X2ltO1xuICAgIHpfbl9yZSA9IHpfbl9yZTE7XG4gICAgel9uX2ltID0gel9uX2ltMTtcbiAgICB0aF9yZSA9IHRoX3JlICsgdGhpcy5DX3JlW25dICogel9uX3JlIC0gdGhpcy5DX2ltW25dICogel9uX2ltO1xuICAgIHRoX2ltID0gdGhfaW0gKyB0aGlzLkNfaW1bbl0gKiB6X25fcmUgKyB0aGlzLkNfcmVbbl0gKiB6X25faW07XG4gIH1cblxuICAvLyAyYi4gSXRlcmF0ZSB0byByZWZpbmUgdGhlIGFjY3VyYWN5IG9mIHRoZSBjYWxjdWxhdGlvblxuICAvLyAgICAgICAgMCBpdGVyYXRpb25zIGdpdmVzIGttIGFjY3VyYWN5XG4gIC8vICAgICAgICAxIGl0ZXJhdGlvbiBnaXZlcyBtIGFjY3VyYWN5IC0tIGdvb2QgZW5vdWdoIGZvciBtb3N0IG1hcHBpbmcgYXBwbGljYXRpb25zXG4gIC8vICAgICAgICAyIGl0ZXJhdGlvbnMgYml2ZXMgbW0gYWNjdXJhY3lcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZXJhdGlvbnM7IGkrKykge1xuICAgIHZhciB0aF9uX3JlID0gdGhfcmU7XG4gICAgdmFyIHRoX25faW0gPSB0aF9pbTtcbiAgICB2YXIgdGhfbl9yZTE7XG4gICAgdmFyIHRoX25faW0xO1xuXG4gICAgdmFyIG51bV9yZSA9IHpfcmU7XG4gICAgdmFyIG51bV9pbSA9IHpfaW07XG4gICAgZm9yIChuID0gMjsgbiA8PSA2OyBuKyspIHtcbiAgICAgIHRoX25fcmUxID0gdGhfbl9yZSAqIHRoX3JlIC0gdGhfbl9pbSAqIHRoX2ltO1xuICAgICAgdGhfbl9pbTEgPSB0aF9uX2ltICogdGhfcmUgKyB0aF9uX3JlICogdGhfaW07XG4gICAgICB0aF9uX3JlID0gdGhfbl9yZTE7XG4gICAgICB0aF9uX2ltID0gdGhfbl9pbTE7XG4gICAgICBudW1fcmUgPSBudW1fcmUgKyAobiAtIDEpICogKHRoaXMuQl9yZVtuXSAqIHRoX25fcmUgLSB0aGlzLkJfaW1bbl0gKiB0aF9uX2ltKTtcbiAgICAgIG51bV9pbSA9IG51bV9pbSArIChuIC0gMSkgKiAodGhpcy5CX2ltW25dICogdGhfbl9yZSArIHRoaXMuQl9yZVtuXSAqIHRoX25faW0pO1xuICAgIH1cblxuICAgIHRoX25fcmUgPSAxO1xuICAgIHRoX25faW0gPSAwO1xuICAgIHZhciBkZW5fcmUgPSB0aGlzLkJfcmVbMV07XG4gICAgdmFyIGRlbl9pbSA9IHRoaXMuQl9pbVsxXTtcbiAgICBmb3IgKG4gPSAyOyBuIDw9IDY7IG4rKykge1xuICAgICAgdGhfbl9yZTEgPSB0aF9uX3JlICogdGhfcmUgLSB0aF9uX2ltICogdGhfaW07XG4gICAgICB0aF9uX2ltMSA9IHRoX25faW0gKiB0aF9yZSArIHRoX25fcmUgKiB0aF9pbTtcbiAgICAgIHRoX25fcmUgPSB0aF9uX3JlMTtcbiAgICAgIHRoX25faW0gPSB0aF9uX2ltMTtcbiAgICAgIGRlbl9yZSA9IGRlbl9yZSArIG4gKiAodGhpcy5CX3JlW25dICogdGhfbl9yZSAtIHRoaXMuQl9pbVtuXSAqIHRoX25faW0pO1xuICAgICAgZGVuX2ltID0gZGVuX2ltICsgbiAqICh0aGlzLkJfaW1bbl0gKiB0aF9uX3JlICsgdGhpcy5CX3JlW25dICogdGhfbl9pbSk7XG4gICAgfVxuXG4gICAgLy8gQ29tcGxleCBkaXZpc2lvblxuICAgIHZhciBkZW4yID0gZGVuX3JlICogZGVuX3JlICsgZGVuX2ltICogZGVuX2ltO1xuICAgIHRoX3JlID0gKG51bV9yZSAqIGRlbl9yZSArIG51bV9pbSAqIGRlbl9pbSkgLyBkZW4yO1xuICAgIHRoX2ltID0gKG51bV9pbSAqIGRlbl9yZSAtIG51bV9yZSAqIGRlbl9pbSkgLyBkZW4yO1xuICB9XG5cbiAgLy8gMy4gQ2FsY3VsYXRlIGRfcGhpICAgICAgICAgICAgICAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgZF9sYW1iZGFcbiAgdmFyIGRfcHNpID0gdGhfcmU7XG4gIHZhciBkX2xhbWJkYSA9IHRoX2ltO1xuICB2YXIgZF9wc2lfbiA9IDE7IC8vIGRfcHNpXjBcblxuICB2YXIgZF9waGkgPSAwO1xuICBmb3IgKG4gPSAxOyBuIDw9IDk7IG4rKykge1xuICAgIGRfcHNpX24gPSBkX3BzaV9uICogZF9wc2k7XG4gICAgZF9waGkgPSBkX3BoaSArIHRoaXMuRFtuXSAqIGRfcHNpX247XG4gIH1cblxuICAvLyA0LiBDYWxjdWxhdGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZVxuICAvLyBkX3BoaSBpcyBjYWxjdWF0ZWQgaW4gc2Vjb25kIG9mIGFyYyAqIDEwXi01LCBzbyB3ZSBuZWVkIHRvIHNjYWxlIGJhY2sgdG8gcmFkaWFucy4gZF9sYW1iZGEgaXMgaW4gcmFkaWFucy5cbiAgdmFyIGxhdCA9IHRoaXMubGF0MCArIChkX3BoaSAqIFNFQ19UT19SQUQgKiAxRTUpO1xuICB2YXIgbG9uID0gdGhpcy5sb25nMCArIGRfbGFtYmRhO1xuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuXG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydOZXdfWmVhbGFuZF9NYXBfR3JpZCcsICduem1nJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCB7IEQyUiwgUjJELCBIQUxGX1BJLCBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IFByb2ogZnJvbSAnLi4vUHJvaic7XG5pbXBvcnQgeyBuYW1lcyBhcyBsb25nTGF0TmFtZXMgfSBmcm9tICcuL2xvbmdsYXQnO1xuXG4vKipcbiAgICBPcmlnaW5hbCBwcm9qZWN0aW9uIGltcGxlbWVudGF0aW9uOlxuICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vUFJPSi9ibG9iLzQ2YzQ3ZTlhZGY2Mzc2YWUwNmFmYWJlNWQyNGEwMDE2YTA1Y2VkODIvc3JjL3Byb2plY3Rpb25zL29iX3RyYW4uY3BwXG5cbiAgICBEb2N1bWVudGF0aW9uOlxuICAgICAgICBodHRwczovL3Byb2oub3JnL29wZXJhdGlvbnMvcHJvamVjdGlvbnMvb2JfdHJhbi5odG1sXG5cbiAgICBSZWZlcmVuY2VzL0Zvcm11bGFzOlxuICAgICAgICBodHRwczovL3B1YnMudXNncy5nb3YvcHAvMTM5NS9yZXBvcnQucGRmXG5cbiAgICBFeGFtcGxlczpcbiAgICAgICAgK3Byb2o9b2JfdHJhbiArb19wcm9qPW1vbGwgK29fbGF0X3A9NDUgK29fbG9uX3A9LTkwXG4gICAgICAgICtwcm9qPW9iX3RyYW4gK29fcHJvaj1tb2xsICtvX2xhdF9wPTQ1ICtvX2xvbl9wPS05MCArbG9uXzA9NjBcbiAgICAgICAgK3Byb2o9b2JfdHJhbiArb19wcm9qPW1vbGwgK29fbGF0X3A9NDUgK29fbG9uX3A9LTkwICtsb25fMD0tOTBcbiovXG5cbmNvbnN0IHByb2plY3Rpb25UeXBlID0ge1xuICBPQkxJUVVFOiB7XG4gICAgZm9yd2FyZDogZm9yd2FyZE9ibGlxdWUsXG4gICAgaW52ZXJzZTogaW52ZXJzZU9ibGlxdWVcbiAgfSxcbiAgVFJBTlNWRVJTRToge1xuICAgIGZvcndhcmQ6IGZvcndhcmRUcmFuc3ZlcnNlLFxuICAgIGludmVyc2U6IGludmVyc2VUcmFuc3ZlcnNlXG4gIH1cbn07XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbGFtcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNwaGlwXG4gKiBAcHJvcGVydHkge251bWJlcn0gc3BoaXBcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwcm9qZWN0aW9uVHlwZVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fcHJvalxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbG9uX3BcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xhdF9wXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19hbHBoYVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbG9uX2NcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xhdF9jXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sb25fMVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCB1bmRlZmluZWR9IG9fbGF0XzFcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBvX2xvbl8yXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IHVuZGVmaW5lZH0gb19sYXRfMlxuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9Mb25nUFxuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9MYXRQXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0FscGhhXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xvbmdDXG4gKiBAcHJvcGVydHkge251bWJlciB8IHVuZGVmaW5lZH0gb0xhdENcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTG9uZzFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyIHwgdW5kZWZpbmVkfSBvTGF0MVxuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9Mb25nMlxuICogQHByb3BlcnR5IHtudW1iZXIgfCB1bmRlZmluZWR9IG9MYXQyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzSWRlbnRpdHlcbiAqIEBwcm9wZXJ0eSB7aW1wb3J0KCcuLicpLkNvbnZlcnRlcn0gb2JsaXF1ZVByb2plY3Rpb25cbiAqXG4gKi9cblxuLyoqXG4gKiAgICBQYXJhbWV0ZXJzIGNhbiBiZSBmcm9tIHRoZSBmb2xsb3dpbmcgc2V0czpcbiAqICAgICAgIE5ldyBwb2xlIC0tPiBvX2xhdF9wLCBvX2xvbl9wXG4gKiAgICAgICBSb3RhdGUgYWJvdXQgcG9pbnQgLS0+IG9fYWxwaGEsIG9fbG9uX2MsIG9fbGF0X2NcbiAqICAgICAgIE5ldyBlcXVhdG9yIHBvaW50cyAtLT4gbG9uXzEsIGxhdF8xLCBsb25fMiwgbGF0XzJcbiAqXG4gKiAgICBQZXIgdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlLCB0aGUgcGFyYW1ldGVyIHNldHMgYXJlXG4gKiAgICBjaGVja2VkIGluIHRoZSBvcmRlciBvZiB0aGUgb2JqZWN0IGJlbG93LlxuICovXG5jb25zdCBwYXJhbVNldHMgPSB7XG4gIFJPVEFURToge1xuICAgIG9fYWxwaGE6ICdvQWxwaGEnLFxuICAgIG9fbG9uX2M6ICdvTG9uZ0MnLFxuICAgIG9fbGF0X2M6ICdvTGF0QydcbiAgfSxcbiAgTkVXX1BPTEU6IHtcbiAgICBvX2xhdF9wOiAnb0xhdFAnLFxuICAgIG9fbG9uX3A6ICdvTG9uZ1AnXG4gIH0sXG4gIE5FV19FUVVBVE9SOiB7XG4gICAgb19sb25fMTogJ29Mb25nMScsXG4gICAgb19sYXRfMTogJ29MYXQxJyxcbiAgICBvX2xvbl8yOiAnb0xvbmcyJyxcbiAgICBvX2xhdF8yOiAnb0xhdDInXG4gIH1cbn07XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy54MCA9IHRoaXMueDAgfHwgMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgfHwgMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcbiAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGUgfHwgJ0dlbmVyYWwgT2JsaXF1ZSBUcmFuc2Zvcm1hdGlvbic7XG4gIHRoaXMuaXNJZGVudGl0eSA9IGxvbmdMYXROYW1lcy5pbmNsdWRlcyh0aGlzLm9fcHJvaik7XG5cbiAgLyoqIFZlcmlmeSByZXF1aXJlZCBwYXJhbWV0ZXJzIGV4aXN0ICovXG4gIGlmICghdGhpcy5vX3Byb2opIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcGFyYW1ldGVyOiBvX3Byb2onKTtcbiAgfVxuXG4gIGlmICh0aGlzLm9fcHJvaiA9PT0gYG9iX3RyYW5gKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBvX3Byb2o6ICcgKyB0aGlzLm9fcHJvaik7XG4gIH1cblxuICBjb25zdCBuZXdQcm9qU3RyID0gdGhpcy5wcm9qU3RyLnJlcGxhY2UoJytwcm9qPW9iX3RyYW4nLCAnJykucmVwbGFjZSgnK29fcHJvaj0nLCAnK3Byb2o9JykudHJpbSgpO1xuXG4gIC8qKiBAdHlwZSB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb259ICovXG4gIGNvbnN0IG9Qcm9qID0gUHJvaihuZXdQcm9qU3RyKTtcbiAgaWYgKCFvUHJvaikge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXJhbWV0ZXI6IG9fcHJvai4gVW5rbm93biBwcm9qZWN0aW9uICcgKyB0aGlzLm9fcHJvaik7XG4gIH1cbiAgb1Byb2oubG9uZzAgPSAwOyAvLyB3ZSBoYW5kbGUgbG9uZzAgYmVmb3JlL2FmdGVyIGZvcndhcmQvaW52ZXJzZVxuICB0aGlzLm9ibGlxdWVQcm9qZWN0aW9uID0gb1Byb2o7XG5cbiAgbGV0IG1hdGNoZWRTZXQ7XG4gIGNvbnN0IHBhcmFtU2V0c0tleXMgPSBPYmplY3Qua2V5cyhwYXJhbVNldHMpO1xuXG4gIC8qKlxuICAgKiBwYXJzZSBzdHJpbmdzLCBjb252ZXJ0IHRvIHJhZGlhbnMsIHRocm93IG9uIE5hTlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgY29uc3QgcGFyc2VQYXJhbSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB0aGlzW25hbWVdID09PSBgdW5kZWZpbmVkYCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgdmFsID0gcGFyc2VGbG9hdCh0aGlzW25hbWVdKSAqIEQyUjtcbiAgICBpZiAoaXNOYU4odmFsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciAnICsgbmFtZSArICc6ICcgKyB0aGlzW25hbWVdKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbiAgfTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtU2V0c0tleXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzZXRLZXkgPSBwYXJhbVNldHNLZXlzW2ldO1xuICAgIGNvbnN0IHNldCA9IHBhcmFtU2V0c1tzZXRLZXldO1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5lbnRyaWVzKHNldCk7XG4gICAgY29uc3Qgc2V0SGFzUGFyYW1zID0gcGFyYW1zLnNvbWUoXG4gICAgICAoW3BdKSA9PiB0eXBlb2YgdGhpc1twXSAhPT0gJ3VuZGVmaW5lZCdcbiAgICApO1xuICAgIGlmICghc2V0SGFzUGFyYW1zKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgbWF0Y2hlZFNldCA9IHNldDtcbiAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgcGFyYW1zLmxlbmd0aDsgaWkrKykge1xuICAgICAgY29uc3QgW2lucHV0UGFyYW0sIHBhcmFtXSA9IHBhcmFtc1tpaV07XG4gICAgICBjb25zdCB2YWwgPSBwYXJzZVBhcmFtKGlucHV0UGFyYW0pO1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBwYXJhbWV0ZXI6ICcgKyBpbnB1dFBhcmFtICsgJy4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXNbcGFyYW1dID0gdmFsO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIGlmICghbWF0Y2hlZFNldCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gdmFsaWQgcGFyYW1ldGVycyBwcm92aWRlZCBmb3Igb2JfdHJhbiBwcm9qZWN0aW9uLicpO1xuICB9XG5cbiAgY29uc3QgeyBsYW1wLCBwaGlwIH0gPSBjcmVhdGVSb3RhdGlvbih0aGlzLCBtYXRjaGVkU2V0KTtcbiAgdGhpcy5sYW1wID0gbGFtcDtcblxuICBpZiAoTWF0aC5hYnMocGhpcCkgPiBFUFNMTikge1xuICAgIHRoaXMuY3BoaXAgPSBNYXRoLmNvcyhwaGlwKTtcbiAgICB0aGlzLnNwaGlwID0gTWF0aC5zaW4ocGhpcCk7XG4gICAgdGhpcy5wcm9qZWN0aW9uVHlwZSA9IHByb2plY3Rpb25UeXBlLk9CTElRVUU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wcm9qZWN0aW9uVHlwZSA9IHByb2plY3Rpb25UeXBlLlRSQU5TVkVSU0U7XG4gIH1cbn1cblxuLy8gb2JfdHJhbiBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyAobGF0LGxvbmcpIHRvICh4LHkpXG4vLyB0cmFuc3ZlcnNlICg5MCBkZWdyZWVzIGZyb20gbm9ybWFsIG9yaWVudGF0aW9uKSAtIGZvcndhcmRUcmFuc3ZlcnNlXG4vLyBvciBvYmxpcXVlIChhcmJpdHJhcnkgYW5nbGUpIHVzZWQgYmFzZWQgb24gcGFyYW1ldGVycyAtIGZvcndhcmRPYmxpcXVlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgcmV0dXJuIHRoaXMucHJvamVjdGlvblR5cGUuZm9yd2FyZCh0aGlzLCBwKTtcbn1cblxuLy8gaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgKHgseSkgdG8gKGxhdCxsb25nKVxuLy8gdHJhbnN2ZXJzZTogaW52ZXJzZVRyYW5zdmVyc2Vcbi8vIG9ibGlxdWU6IGludmVyc2VPYmxpcXVlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcmV0dXJuIHRoaXMucHJvamVjdGlvblR5cGUuaW52ZXJzZSh0aGlzLCBwKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSBwYXJhbXMgLSBJbml0aWFsaXplZCBwcm9qZWN0aW9uIGRlZmluaXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBob3cgLSBUcmFuc2Zvcm1hdGlvbiBtZXRob2RcbiAqIEByZXR1cm5zIHt7cGhpcDogbnVtYmVyLCBsYW1wOiBudW1iZXJ9fVxuICovXG5mdW5jdGlvbiBjcmVhdGVSb3RhdGlvbihwYXJhbXMsIGhvdykge1xuICBsZXQgcGhpcCwgbGFtcDtcbiAgaWYgKGhvdyA9PT0gcGFyYW1TZXRzLlJPVEFURSkge1xuICAgIGxldCBsYW1jID0gcGFyYW1zLm9Mb25nQztcbiAgICBsZXQgcGhpYyA9IHBhcmFtcy5vTGF0QztcbiAgICBsZXQgYWxwaGEgPSBwYXJhbXMub0FscGhhO1xuICAgIGlmIChNYXRoLmFicyhNYXRoLmFicyhwaGljKSAtIEhBTEZfUEkpIDw9IEVQU0xOKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9fbGF0X2M6ICcgKyBwYXJhbXMub19sYXRfYyArICcgc2hvdWxkIGJlIDwgOTDCsCcpO1xuICAgIH1cbiAgICBsYW1wID0gbGFtYyArIE1hdGguYXRhbjIoLTEgKiBNYXRoLmNvcyhhbHBoYSksIC0xICogTWF0aC5zaW4oYWxwaGEpICogTWF0aC5zaW4ocGhpYykpO1xuICAgIHBoaXAgPSBNYXRoLmFzaW4oTWF0aC5jb3MocGhpYykgKiBNYXRoLnNpbihhbHBoYSkpO1xuICB9IGVsc2UgaWYgKGhvdyA9PT0gcGFyYW1TZXRzLk5FV19QT0xFKSB7XG4gICAgbGFtcCA9IHBhcmFtcy5vTG9uZ1A7XG4gICAgcGhpcCA9IHBhcmFtcy5vTGF0UDtcbiAgfSBlbHNlIHtcbiAgICBsZXQgbGFtMSA9IHBhcmFtcy5vTG9uZzE7XG4gICAgbGV0IHBoaTEgPSBwYXJhbXMub0xhdDE7XG4gICAgbGV0IGxhbTIgPSBwYXJhbXMub0xvbmcyO1xuICAgIGxldCBwaGkyID0gcGFyYW1zLm9MYXQyO1xuICAgIGxldCBjb24gPSBNYXRoLmFicyhwaGkxKTtcblxuICAgIGlmIChNYXRoLmFicyhwaGkxKSA+IEhBTEZfUEkgLSBFUFNMTikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBvX2xhdF8xOiAnICsgcGFyYW1zLm9fbGF0XzEgKyAnIHNob3VsZCBiZSA8IDkwwrAnKTtcbiAgICB9XG5cbiAgICBpZiAoTWF0aC5hYnMocGhpMikgPiBIQUxGX1BJIC0gRVBTTE4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3Igb19sYXRfMjogJyArIHBhcmFtcy5vX2xhdF8yICsgJyBzaG91bGQgYmUgPCA5MMKwJyk7XG4gICAgfVxuXG4gICAgaWYgKE1hdGguYWJzKHBoaTEgLSBwaGkyKSA8IEVQU0xOKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9fbGF0XzEgYW5kIG9fbGF0XzI6IG9fbGF0XzEgc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIG9fbGF0XzInKTtcbiAgICB9XG4gICAgaWYgKGNvbiA8IEVQU0xOKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9fbGF0XzE6IG9fbGF0XzEgc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHplcm8nKTtcbiAgICB9XG5cbiAgICBsYW1wID0gTWF0aC5hdGFuMihcbiAgICAgIChNYXRoLmNvcyhwaGkxKSAqIE1hdGguc2luKHBoaTIpICogTWF0aC5jb3MobGFtMSkpXG4gICAgICAtIChNYXRoLnNpbihwaGkxKSAqIE1hdGguY29zKHBoaTIpICogTWF0aC5jb3MobGFtMikpLFxuICAgICAgKE1hdGguc2luKHBoaTEpICogTWF0aC5jb3MocGhpMikgKiBNYXRoLnNpbihsYW0yKSlcbiAgICAgIC0gKE1hdGguY29zKHBoaTEpICogTWF0aC5zaW4ocGhpMikgKiBNYXRoLnNpbihsYW0xKSlcbiAgICApO1xuXG4gICAgcGhpcCA9IE1hdGguYXRhbigtMSAqIE1hdGguY29zKGxhbXAgLSBsYW0xKSAvIE1hdGgudGFuKHBoaTEpKTtcbiAgfVxuXG4gIHJldHVybiB7IGxhbXAsIHBoaXAgfTtcbn1cblxuLyoqXG4gKiBGb3J3YXJkIChsbmcsIGxhdCkgdG8gKHgsIHkpIGZvciBvYmxpcXVlIGNhc2VcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9IHNlbGZcbiAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gbHAgLSBsYW1iZGEsIHBoaVxuICovXG5mdW5jdGlvbiBmb3J3YXJkT2JsaXF1ZShzZWxmLCBscCkge1xuICBsZXQgeyB4OiBsYW0sIHk6IHBoaSB9ID0gbHA7XG4gIGxhbSArPSBzZWxmLmxvbmcwO1xuICBjb25zdCBjb3NsYW0gPSBNYXRoLmNvcyhsYW0pO1xuICBjb25zdCBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xuICBjb25zdCBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuXG4gIGxwLnggPSBhZGp1c3RfbG9uKFxuICAgIE1hdGguYXRhbjIoXG4gICAgICBjb3NwaGkgKiBNYXRoLnNpbihsYW0pLFxuICAgICAgKHNlbGYuc3BoaXAgKiBjb3NwaGkgKiBjb3NsYW0pICsgKHNlbGYuY3BoaXAgKiBzaW5waGkpXG4gICAgKSArIHNlbGYubGFtcFxuICApO1xuICBscC55ID0gTWF0aC5hc2luKFxuICAgIChzZWxmLnNwaGlwICogc2lucGhpKSAtIChzZWxmLmNwaGlwICogY29zcGhpICogY29zbGFtKVxuICApO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHNlbGYub2JsaXF1ZVByb2plY3Rpb24uZm9yd2FyZChscCk7XG4gIGlmIChzZWxmLmlzSWRlbnRpdHkpIHtcbiAgICByZXN1bHQueCAqPSBSMkQ7XG4gICAgcmVzdWx0LnkgKj0gUjJEO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRm9yd2FyZCAobG5nLCBsYXQpIHRvICh4LCB5KSBmb3IgdHJhbnN2ZXJzZSBjYXNlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSBzZWxmXG4gKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IGxwIC0gbGFtYmRhLCBwaGlcbiAqL1xuZnVuY3Rpb24gZm9yd2FyZFRyYW5zdmVyc2Uoc2VsZiwgbHApIHtcbiAgbGV0IHsgeDogbGFtLCB5OiBwaGkgfSA9IGxwO1xuICBsYW0gKz0gc2VsZi5sb25nMDtcbiAgY29uc3QgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgY29uc3QgY29zbGFtID0gTWF0aC5jb3MobGFtKTtcbiAgbHAueCA9IGFkanVzdF9sb24oXG4gICAgTWF0aC5hdGFuMihcbiAgICAgIGNvc3BoaSAqIE1hdGguc2luKGxhbSksXG4gICAgICBNYXRoLnNpbihwaGkpXG4gICAgKSArIHNlbGYubGFtcFxuICApO1xuICBscC55ID0gTWF0aC5hc2luKC0xICogY29zcGhpICogY29zbGFtKTtcblxuICBjb25zdCByZXN1bHQgPSBzZWxmLm9ibGlxdWVQcm9qZWN0aW9uLmZvcndhcmQobHApO1xuXG4gIGlmIChzZWxmLmlzSWRlbnRpdHkpIHtcbiAgICByZXN1bHQueCAqPSBSMkQ7XG4gICAgcmVzdWx0LnkgKj0gUjJEO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogSW52ZXJzZSAoeCwgeSkgdG8gKGxuZywgbGF0KSBmb3Igb2JsaXF1ZSBjYXNlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSBzZWxmXG4gKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IGxwIC0gbGFtYmRhLCBwaGlcbiAqL1xuZnVuY3Rpb24gaW52ZXJzZU9ibGlxdWUoc2VsZiwgbHApIHtcbiAgaWYgKHNlbGYuaXNJZGVudGl0eSkge1xuICAgIGxwLnggKj0gRDJSO1xuICAgIGxwLnkgKj0gRDJSO1xuICB9XG5cbiAgY29uc3QgaW5uZXJMcCA9IHNlbGYub2JsaXF1ZVByb2plY3Rpb24uaW52ZXJzZShscCk7XG4gIGxldCB7IHg6IGxhbSwgeTogcGhpIH0gPSBpbm5lckxwO1xuXG4gIGlmIChsYW0gPCBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgbGFtIC09IHNlbGYubGFtcDtcbiAgICBjb25zdCBjb3NsYW0gPSBNYXRoLmNvcyhsYW0pO1xuICAgIGNvbnN0IHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgY29uc3QgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBscC54ID0gTWF0aC5hdGFuMihcbiAgICAgIGNvc3BoaSAqIE1hdGguc2luKGxhbSksXG4gICAgICAoc2VsZi5zcGhpcCAqIGNvc3BoaSAqIGNvc2xhbSkgLSAoc2VsZi5jcGhpcCAqIHNpbnBoaSlcbiAgICApO1xuICAgIGxwLnkgPSBNYXRoLmFzaW4oXG4gICAgICAoc2VsZi5zcGhpcCAqIHNpbnBoaSkgKyAoc2VsZi5jcGhpcCAqIGNvc3BoaSAqIGNvc2xhbSlcbiAgICApO1xuICB9XG5cbiAgbHAueCA9IGFkanVzdF9sb24obHAueCArIHNlbGYubG9uZzApO1xuICByZXR1cm4gbHA7XG59XG5cbi8qKlxuICogSW52ZXJzZSAoeCwgeSkgdG8gKGxuZywgbGF0KSBmb3IgdHJhbnN2ZXJzZSBjYXNlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSBzZWxmXG4gKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IGxwIC0gbGFtYmRhLCBwaGlcbiAqL1xuZnVuY3Rpb24gaW52ZXJzZVRyYW5zdmVyc2Uoc2VsZiwgbHApIHtcbiAgaWYgKHNlbGYuaXNJZGVudGl0eSkge1xuICAgIGxwLnggKj0gRDJSO1xuICAgIGxwLnkgKj0gRDJSO1xuICB9XG5cbiAgY29uc3QgaW5uZXJMcCA9IHNlbGYub2JsaXF1ZVByb2plY3Rpb24uaW52ZXJzZShscCk7XG4gIGxldCB7IHg6IGxhbSwgeTogcGhpIH0gPSBpbm5lckxwO1xuXG4gIGlmIChsYW0gPCBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgY29uc3QgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBsYW0gLT0gc2VsZi5sYW1wO1xuICAgIGxwLnggPSBNYXRoLmF0YW4yKFxuICAgICAgY29zcGhpICogTWF0aC5zaW4obGFtKSxcbiAgICAgIC0xICogTWF0aC5zaW4ocGhpKVxuICAgICk7XG4gICAgbHAueSA9IE1hdGguYXNpbihcbiAgICAgIGNvc3BoaSAqIE1hdGguY29zKGxhbSlcbiAgICApO1xuICB9XG5cbiAgbHAueCA9IGFkanVzdF9sb24obHAueCArIHNlbGYubG9uZzApO1xuICByZXR1cm4gbHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0dlbmVyYWwgT2JsaXF1ZSBUcmFuc2Zvcm1hdGlvbicsICdHZW5lcmFsX09ibGlxdWVfVHJhbnNmb3JtYXRpb24nLCAnb2JfdHJhbiddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgdHNmbnogZnJvbSAnLi4vY29tbW9uL3RzZm56JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBwaGkyeiBmcm9tICcuLi9jb21tb24vcGhpMnonO1xuaW1wb3J0IHsgRVBTTE4sIEhBTEZfUEksIFRXT19QSSwgRk9SVFBJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgeyBnZXROb3JtYWxpemVkUHJvak5hbWUgfSBmcm9tICcuLi9wcm9qZWN0aW9ucyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG5vX29mZlxuICogQHByb3BlcnR5IHtib29sZWFufSBub19yb3RcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZWN0aWZpZWRfZ3JpZF9hbmdsZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gQVxuICogQHByb3BlcnR5IHtudW1iZXJ9IEJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBFXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGxhbTBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5nYW1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NnYW1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5yb3RcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3Nyb3RcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByQlxuICogQHByb3BlcnR5IHtudW1iZXJ9IEFyQlxuICogQHByb3BlcnR5IHtudW1iZXJ9IEJyQVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHVfMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHZfcG9sZV9uXG4gKiBAcHJvcGVydHkge251bWJlcn0gdl9wb2xlX3NcbiAqL1xuXG52YXIgVE9MID0gMWUtNztcblxuZnVuY3Rpb24gaXNUeXBlQShQKSB7XG4gIHZhciB0eXBlQVByb2plY3Rpb25zID0gWydIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcicsICdIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl92YXJpYW50X0EnLCAnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfQXppbXV0aF9OYXR1cmFsX09yaWdpbiddO1xuICB2YXIgcHJvamVjdGlvbk5hbWUgPSB0eXBlb2YgUC5wcm9qTmFtZSA9PT0gJ29iamVjdCcgPyBPYmplY3Qua2V5cyhQLnByb2pOYW1lKVswXSA6IFAucHJvak5hbWU7XG5cbiAgcmV0dXJuICdub191b2ZmJyBpbiBQIHx8ICdub19vZmYnIGluIFAgfHwgdHlwZUFQcm9qZWN0aW9ucy5pbmRleE9mKHByb2plY3Rpb25OYW1lKSAhPT0gLTEgfHwgdHlwZUFQcm9qZWN0aW9ucy5pbmRleE9mKGdldE5vcm1hbGl6ZWRQcm9qTmFtZShwcm9qZWN0aW9uTmFtZSkpICE9PSAtMTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBPYmxpcXVlIE1lcmNhdG9yICBwcm9qZWN0aW9uXG4gKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgY29uLCBjb20sIGNvc3BoMCwgRCwgRiwgSCwgTCwgc2lucGgwLCBwLCBKLCBnYW1tYSA9IDAsXG4gICAgZ2FtbWEwLCBsYW1jID0gMCwgbGFtMSA9IDAsIGxhbTIgPSAwLCBwaGkxID0gMCwgcGhpMiA9IDAsIGFscGhhX2MgPSAwO1xuXG4gIC8vIG9ubHkgVHlwZSBBIHVzZXMgdGhlIG5vX29mZiBvciBub191b2ZmIHByb3BlcnR5XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9PU0dlby9wcm9qLjQvaXNzdWVzLzEwNFxuICB0aGlzLm5vX29mZiA9IGlzVHlwZUEodGhpcyk7XG4gIHRoaXMubm9fcm90ID0gJ25vX3JvdCcgaW4gdGhpcztcblxuICB2YXIgYWxwID0gZmFsc2U7XG4gIGlmICgnYWxwaGEnIGluIHRoaXMpIHtcbiAgICBhbHAgPSB0cnVlO1xuICB9XG5cbiAgdmFyIGdhbSA9IGZhbHNlO1xuICBpZiAoJ3JlY3RpZmllZF9ncmlkX2FuZ2xlJyBpbiB0aGlzKSB7XG4gICAgZ2FtID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChhbHApIHtcbiAgICBhbHBoYV9jID0gdGhpcy5hbHBoYTtcbiAgfVxuXG4gIGlmIChnYW0pIHtcbiAgICBnYW1tYSA9IHRoaXMucmVjdGlmaWVkX2dyaWRfYW5nbGU7XG4gIH1cblxuICBpZiAoYWxwIHx8IGdhbSkge1xuICAgIGxhbWMgPSB0aGlzLmxvbmdjO1xuICB9IGVsc2Uge1xuICAgIGxhbTEgPSB0aGlzLmxvbmcxO1xuICAgIHBoaTEgPSB0aGlzLmxhdDE7XG4gICAgbGFtMiA9IHRoaXMubG9uZzI7XG4gICAgcGhpMiA9IHRoaXMubGF0MjtcblxuICAgIGlmIChNYXRoLmFicyhwaGkxIC0gcGhpMikgPD0gVE9MIHx8IChjb24gPSBNYXRoLmFicyhwaGkxKSkgPD0gVE9MXG4gICAgICB8fCBNYXRoLmFicyhjb24gLSBIQUxGX1BJKSA8PSBUT0wgfHwgTWF0aC5hYnMoTWF0aC5hYnModGhpcy5sYXQwKSAtIEhBTEZfUEkpIDw9IFRPTFxuICAgICAgfHwgTWF0aC5hYnMoTWF0aC5hYnMocGhpMikgLSBIQUxGX1BJKSA8PSBUT0wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvbmVfZXMgPSAxLjAgLSB0aGlzLmVzO1xuICBjb20gPSBNYXRoLnNxcnQob25lX2VzKTtcblxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQwKSA+IEVQU0xOKSB7XG4gICAgc2lucGgwID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgICBjb3NwaDAgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuICAgIGNvbiA9IDEgLSB0aGlzLmVzICogc2lucGgwICogc2lucGgwO1xuICAgIHRoaXMuQiA9IGNvc3BoMCAqIGNvc3BoMDtcbiAgICB0aGlzLkIgPSBNYXRoLnNxcnQoMSArIHRoaXMuZXMgKiB0aGlzLkIgKiB0aGlzLkIgLyBvbmVfZXMpO1xuICAgIHRoaXMuQSA9IHRoaXMuQiAqIHRoaXMuazAgKiBjb20gLyBjb247XG4gICAgRCA9IHRoaXMuQiAqIGNvbSAvIChjb3NwaDAgKiBNYXRoLnNxcnQoY29uKSk7XG4gICAgRiA9IEQgKiBEIC0gMTtcblxuICAgIGlmIChGIDw9IDApIHtcbiAgICAgIEYgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBGID0gTWF0aC5zcXJ0KEYpO1xuICAgICAgaWYgKHRoaXMubGF0MCA8IDApIHtcbiAgICAgICAgRiA9IC1GO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuRSA9IEYgKz0gRDtcbiAgICB0aGlzLkUgKj0gTWF0aC5wb3codHNmbnoodGhpcy5lLCB0aGlzLmxhdDAsIHNpbnBoMCksIHRoaXMuQik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5CID0gMSAvIGNvbTtcbiAgICB0aGlzLkEgPSB0aGlzLmswO1xuICAgIHRoaXMuRSA9IEQgPSBGID0gMTtcbiAgfVxuXG4gIGlmIChhbHAgfHwgZ2FtKSB7XG4gICAgaWYgKGFscCkge1xuICAgICAgZ2FtbWEwID0gTWF0aC5hc2luKE1hdGguc2luKGFscGhhX2MpIC8gRCk7XG4gICAgICBpZiAoIWdhbSkge1xuICAgICAgICBnYW1tYSA9IGFscGhhX2M7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGdhbW1hMCA9IGdhbW1hO1xuICAgICAgYWxwaGFfYyA9IE1hdGguYXNpbihEICogTWF0aC5zaW4oZ2FtbWEwKSk7XG4gICAgfVxuICAgIHRoaXMubGFtMCA9IGxhbWMgLSBNYXRoLmFzaW4oMC41ICogKEYgLSAxIC8gRikgKiBNYXRoLnRhbihnYW1tYTApKSAvIHRoaXMuQjtcbiAgfSBlbHNlIHtcbiAgICBIID0gTWF0aC5wb3codHNmbnoodGhpcy5lLCBwaGkxLCBNYXRoLnNpbihwaGkxKSksIHRoaXMuQik7XG4gICAgTCA9IE1hdGgucG93KHRzZm56KHRoaXMuZSwgcGhpMiwgTWF0aC5zaW4ocGhpMikpLCB0aGlzLkIpO1xuICAgIEYgPSB0aGlzLkUgLyBIO1xuICAgIHAgPSAoTCAtIEgpIC8gKEwgKyBIKTtcbiAgICBKID0gdGhpcy5FICogdGhpcy5FO1xuICAgIEogPSAoSiAtIEwgKiBIKSAvIChKICsgTCAqIEgpO1xuICAgIGNvbiA9IGxhbTEgLSBsYW0yO1xuXG4gICAgaWYgKGNvbiA8IC1NYXRoLlBJKSB7XG4gICAgICBsYW0yIC09IFRXT19QSTtcbiAgICB9IGVsc2UgaWYgKGNvbiA+IE1hdGguUEkpIHtcbiAgICAgIGxhbTIgKz0gVFdPX1BJO1xuICAgIH1cblxuICAgIHRoaXMubGFtMCA9IGFkanVzdF9sb24oMC41ICogKGxhbTEgKyBsYW0yKSAtIE1hdGguYXRhbihKICogTWF0aC50YW4oMC41ICogdGhpcy5CICogKGxhbTEgLSBsYW0yKSkgLyBwKSAvIHRoaXMuQiwgdGhpcy5vdmVyKTtcbiAgICBnYW1tYTAgPSBNYXRoLmF0YW4oMiAqIE1hdGguc2luKHRoaXMuQiAqIGFkanVzdF9sb24obGFtMSAtIHRoaXMubGFtMCwgdGhpcy5vdmVyKSkgLyAoRiAtIDEgLyBGKSk7XG4gICAgZ2FtbWEgPSBhbHBoYV9jID0gTWF0aC5hc2luKEQgKiBNYXRoLnNpbihnYW1tYTApKTtcbiAgfVxuXG4gIHRoaXMuc2luZ2FtID0gTWF0aC5zaW4oZ2FtbWEwKTtcbiAgdGhpcy5jb3NnYW0gPSBNYXRoLmNvcyhnYW1tYTApO1xuICB0aGlzLnNpbnJvdCA9IE1hdGguc2luKGdhbW1hKTtcbiAgdGhpcy5jb3Nyb3QgPSBNYXRoLmNvcyhnYW1tYSk7XG5cbiAgdGhpcy5yQiA9IDEgLyB0aGlzLkI7XG4gIHRoaXMuQXJCID0gdGhpcy5BICogdGhpcy5yQjtcbiAgdGhpcy5CckEgPSAxIC8gdGhpcy5BckI7XG5cbiAgaWYgKHRoaXMubm9fb2ZmKSB7XG4gICAgdGhpcy51XzAgPSAwO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudV8wID0gTWF0aC5hYnModGhpcy5BckIgKiBNYXRoLmF0YW4oTWF0aC5zcXJ0KEQgKiBEIC0gMSkgLyBNYXRoLmNvcyhhbHBoYV9jKSkpO1xuXG4gICAgaWYgKHRoaXMubGF0MCA8IDApIHtcbiAgICAgIHRoaXMudV8wID0gLXRoaXMudV8wO1xuICAgIH1cbiAgfVxuXG4gIEYgPSAwLjUgKiBnYW1tYTA7XG4gIHRoaXMudl9wb2xlX24gPSB0aGlzLkFyQiAqIE1hdGgubG9nKE1hdGgudGFuKEZPUlRQSSAtIEYpKTtcbiAgdGhpcy52X3BvbGVfcyA9IHRoaXMuQXJCICogTWF0aC5sb2coTWF0aC50YW4oRk9SVFBJICsgRikpO1xufVxuXG4vKiBPYmxpcXVlIE1lcmNhdG9yIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGNvb3JkcyA9IHt9O1xuICB2YXIgUywgVCwgVSwgViwgVywgdGVtcCwgdSwgdjtcbiAgcC54ID0gcC54IC0gdGhpcy5sYW0wO1xuXG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhwLnkpIC0gSEFMRl9QSSkgPiBFUFNMTikge1xuICAgIFcgPSB0aGlzLkUgLyBNYXRoLnBvdyh0c2Zueih0aGlzLmUsIHAueSwgTWF0aC5zaW4ocC55KSksIHRoaXMuQik7XG5cbiAgICB0ZW1wID0gMSAvIFc7XG4gICAgUyA9IDAuNSAqIChXIC0gdGVtcCk7XG4gICAgVCA9IDAuNSAqIChXICsgdGVtcCk7XG4gICAgViA9IE1hdGguc2luKHRoaXMuQiAqIHAueCk7XG4gICAgVSA9IChTICogdGhpcy5zaW5nYW0gLSBWICogdGhpcy5jb3NnYW0pIC8gVDtcblxuICAgIGlmIChNYXRoLmFicyhNYXRoLmFicyhVKSAtIDEuMCkgPCBFUFNMTikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxuXG4gICAgdiA9IDAuNSAqIHRoaXMuQXJCICogTWF0aC5sb2coKDEgLSBVKSAvICgxICsgVSkpO1xuICAgIHRlbXAgPSBNYXRoLmNvcyh0aGlzLkIgKiBwLngpO1xuXG4gICAgaWYgKE1hdGguYWJzKHRlbXApIDwgVE9MKSB7XG4gICAgICB1ID0gdGhpcy5BICogcC54O1xuICAgIH0gZWxzZSB7XG4gICAgICB1ID0gdGhpcy5BckIgKiBNYXRoLmF0YW4yKChTICogdGhpcy5jb3NnYW0gKyBWICogdGhpcy5zaW5nYW0pLCB0ZW1wKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdiA9IHAueSA+IDAgPyB0aGlzLnZfcG9sZV9uIDogdGhpcy52X3BvbGVfcztcbiAgICB1ID0gdGhpcy5BckIgKiBwLnk7XG4gIH1cblxuICBpZiAodGhpcy5ub19yb3QpIHtcbiAgICBjb29yZHMueCA9IHU7XG4gICAgY29vcmRzLnkgPSB2O1xuICB9IGVsc2Uge1xuICAgIHUgLT0gdGhpcy51XzA7XG4gICAgY29vcmRzLnggPSB2ICogdGhpcy5jb3Nyb3QgKyB1ICogdGhpcy5zaW5yb3Q7XG4gICAgY29vcmRzLnkgPSB1ICogdGhpcy5jb3Nyb3QgLSB2ICogdGhpcy5zaW5yb3Q7XG4gIH1cblxuICBjb29yZHMueCA9ICh0aGlzLmEgKiBjb29yZHMueCArIHRoaXMueDApO1xuICBjb29yZHMueSA9ICh0aGlzLmEgKiBjb29yZHMueSArIHRoaXMueTApO1xuXG4gIHJldHVybiBjb29yZHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHUsIHYsIFFwLCBTcCwgVHAsIFZwLCBVcDtcbiAgdmFyIGNvb3JkcyA9IHt9O1xuXG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAqICgxLjAgLyB0aGlzLmEpO1xuICBwLnkgPSAocC55IC0gdGhpcy55MCkgKiAoMS4wIC8gdGhpcy5hKTtcblxuICBpZiAodGhpcy5ub19yb3QpIHtcbiAgICB2ID0gcC55O1xuICAgIHUgPSBwLng7XG4gIH0gZWxzZSB7XG4gICAgdiA9IHAueCAqIHRoaXMuY29zcm90IC0gcC55ICogdGhpcy5zaW5yb3Q7XG4gICAgdSA9IHAueSAqIHRoaXMuY29zcm90ICsgcC54ICogdGhpcy5zaW5yb3QgKyB0aGlzLnVfMDtcbiAgfVxuXG4gIFFwID0gTWF0aC5leHAoLXRoaXMuQnJBICogdik7XG4gIFNwID0gMC41ICogKFFwIC0gMSAvIFFwKTtcbiAgVHAgPSAwLjUgKiAoUXAgKyAxIC8gUXApO1xuICBWcCA9IE1hdGguc2luKHRoaXMuQnJBICogdSk7XG4gIFVwID0gKFZwICogdGhpcy5jb3NnYW0gKyBTcCAqIHRoaXMuc2luZ2FtKSAvIFRwO1xuXG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhVcCkgLSAxKSA8IEVQU0xOKSB7XG4gICAgY29vcmRzLnggPSAwO1xuICAgIGNvb3Jkcy55ID0gVXAgPCAwID8gLUhBTEZfUEkgOiBIQUxGX1BJO1xuICB9IGVsc2Uge1xuICAgIGNvb3Jkcy55ID0gdGhpcy5FIC8gTWF0aC5zcXJ0KCgxICsgVXApIC8gKDEgLSBVcCkpO1xuICAgIGNvb3Jkcy55ID0gcGhpMnoodGhpcy5lLCBNYXRoLnBvdyhjb29yZHMueSwgMSAvIHRoaXMuQikpO1xuXG4gICAgaWYgKGNvb3Jkcy55ID09PSBJbmZpbml0eSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxuXG4gICAgY29vcmRzLnggPSAtdGhpcy5yQiAqIE1hdGguYXRhbjIoKFNwICogdGhpcy5jb3NnYW0gLSBWcCAqIHRoaXMuc2luZ2FtKSwgTWF0aC5jb3ModGhpcy5CckEgKiB1KSk7XG4gIH1cblxuICBjb29yZHMueCArPSB0aGlzLmxhbTA7XG5cbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnSG90aW5lX09ibGlxdWVfTWVyY2F0b3InLCAnSG90aW5lIE9ibGlxdWUgTWVyY2F0b3InLCAnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfdmFyaWFudF9BJywgJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yX1ZhcmlhbnRfQicsICdIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl9BemltdXRoX05hdHVyYWxfT3JpZ2luJywgJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yX1R3b19Qb2ludF9OYXR1cmFsX09yaWdpbicsICdIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl9BemltdXRoX0NlbnRlcicsICdPYmxpcXVlX01lcmNhdG9yJywgJ29tZXJjJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuaW1wb3J0IHsgRVBTTE4sIEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5fcDE0XG4gKiBAcHJvcGVydHkge251bWJlcn0gY29zX3AxNFxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gZG91YmxlIHRlbXA7ICAgICAgLyogdGVtcG9yYXJ5IHZhcmlhYmxlICAgICovXG5cbiAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB0aGlzLnNpbl9wMTQgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB0aGlzLmNvc19wMTQgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xufVxuXG4vKiBPcnRob2dyYXBoaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBzaW5waGksIGNvc3BoaTsgLyogc2luIGFuZCBjb3MgdmFsdWUgICAgICAgICovXG4gIHZhciBkbG9uOyAvKiBkZWx0YSBsb25naXR1ZGUgdmFsdWUgICAgICAqL1xuICB2YXIgY29zbG9uOyAvKiBjb3Mgb2YgbG9uZ2l0dWRlICAgICAgICAqL1xuICB2YXIga3NwOyAvKiBzY2FsZSBmYWN0b3IgICAgICAgICAgKi9cbiAgdmFyIGcsIHgsIHk7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuXG4gIHNpbnBoaSA9IE1hdGguc2luKGxhdCk7XG4gIGNvc3BoaSA9IE1hdGguY29zKGxhdCk7XG5cbiAgY29zbG9uID0gTWF0aC5jb3MoZGxvbik7XG4gIGcgPSB0aGlzLnNpbl9wMTQgKiBzaW5waGkgKyB0aGlzLmNvc19wMTQgKiBjb3NwaGkgKiBjb3Nsb247XG4gIGtzcCA9IDE7XG4gIGlmICgoZyA+IDApIHx8IChNYXRoLmFicyhnKSA8PSBFUFNMTikpIHtcbiAgICB4ID0gdGhpcy5hICoga3NwICogY29zcGhpICogTWF0aC5zaW4oZGxvbik7XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBrc3AgKiAodGhpcy5jb3NfcDE0ICogc2lucGhpIC0gdGhpcy5zaW5fcDE0ICogY29zcGhpICogY29zbG9uKTtcbiAgfVxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgcmg7IC8qIGhlaWdodCBhYm92ZSBlbGxpcHNvaWQgICAgICAqL1xuICB2YXIgejsgLyogYW5nbGUgICAgICAgICAgKi9cbiAgdmFyIHNpbnosIGNvc3o7IC8qIHNpbiBvZiB6IGFuZCBjb3Mgb2YgeiAgICAgICovXG4gIHZhciBjb247XG4gIHZhciBsb24sIGxhdDtcbiAgLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tICovXG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgeiA9IGFzaW56KHJoIC8gdGhpcy5hKTtcblxuICBzaW56ID0gTWF0aC5zaW4oeik7XG4gIGNvc3ogPSBNYXRoLmNvcyh6KTtcblxuICBsb24gPSB0aGlzLmxvbmcwO1xuICBpZiAoTWF0aC5hYnMocmgpIDw9IEVQU0xOKSB7XG4gICAgbGF0ID0gdGhpcy5sYXQwO1xuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgbGF0ID0gYXNpbnooY29zeiAqIHRoaXMuc2luX3AxNCArIChwLnkgKiBzaW56ICogdGhpcy5jb3NfcDE0KSAvIHJoKTtcbiAgY29uID0gTWF0aC5hYnModGhpcy5sYXQwKSAtIEhBTEZfUEk7XG4gIGlmIChNYXRoLmFicyhjb24pIDw9IEVQU0xOKSB7XG4gICAgaWYgKHRoaXMubGF0MCA+PSAwKSB7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgLXAueSksIHRoaXMub3Zlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCAtIE1hdGguYXRhbjIoLXAueCwgcC55KSwgdGhpcy5vdmVyKTtcbiAgICB9XG4gICAgcC54ID0gbG9uO1xuICAgIHAueSA9IGxhdDtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKChwLnggKiBzaW56KSwgcmggKiB0aGlzLmNvc19wMTQgKiBjb3N6IC0gcC55ICogdGhpcy5zaW5fcDE0ICogc2lueiksIHRoaXMub3Zlcik7XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnb3J0aG8nXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGUwZm4gZnJvbSAnLi4vY29tbW9uL2UwZm4nO1xuaW1wb3J0IGUxZm4gZnJvbSAnLi4vY29tbW9uL2UxZm4nO1xuaW1wb3J0IGUyZm4gZnJvbSAnLi4vY29tbW9uL2UyZm4nO1xuaW1wb3J0IGUzZm4gZnJvbSAnLi4vY29tbW9uL2UzZm4nO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuaW1wb3J0IG1sZm4gZnJvbSAnLi4vY29tbW9uL21sZm4nO1xuaW1wb3J0IHsgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuaW1wb3J0IGdOIGZyb20gJy4uL2NvbW1vbi9nTic7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGVtcFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUwXG4gKiBAcHJvcGVydHkge251bWJlcn0gZTFcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlMlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGUzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWwwXG4gKi9cblxudmFyIE1BWF9JVEVSID0gMjA7XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICB0aGlzLnRlbXAgPSB0aGlzLmIgLyB0aGlzLmE7XG4gIHRoaXMuZXMgPSAxIC0gTWF0aC5wb3codGhpcy50ZW1wLCAyKTsgLy8gZGV2YWl0IGV0cmUgZGFucyB0bWVyYy5qcyBtYWlzIG4geSBlc3QgcGFzIGRvbmMgamUgY29tbWVudGUgc2lub24gcmV0b3VyIGRlIHZhbGV1cnMgbnVsbGVzXG4gIHRoaXMuZSA9IE1hdGguc3FydCh0aGlzLmVzKTtcbiAgdGhpcy5lMCA9IGUwZm4odGhpcy5lcyk7XG4gIHRoaXMuZTEgPSBlMWZuKHRoaXMuZXMpO1xuICB0aGlzLmUyID0gZTJmbih0aGlzLmVzKTtcbiAgdGhpcy5lMyA9IGUzZm4odGhpcy5lcyk7XG4gIHRoaXMubWwwID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDApOyAvLyBzaSBxdWUgZGVzIHplcm9zIGxlIGNhbGN1bCBuZSBzZSBmYWl0IHBhc1xufVxuXG4vKiBQb2x5Y29uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciB4LCB5LCBlbDtcbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIGVsID0gZGxvbiAqIE1hdGguc2luKGxhdCk7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG4gICAgICB4ID0gdGhpcy5hICogZGxvbjtcbiAgICAgIHkgPSAtMSAqIHRoaXMuYSAqIHRoaXMubGF0MDtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IHRoaXMuYSAqIE1hdGguc2luKGVsKSAvIE1hdGgudGFuKGxhdCk7XG4gICAgICB5ID0gdGhpcy5hICogKGFkanVzdF9sYXQobGF0IC0gdGhpcy5sYXQwKSArICgxIC0gTWF0aC5jb3MoZWwpKSAvIE1hdGgudGFuKGxhdCkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoTWF0aC5hYnMobGF0KSA8PSBFUFNMTikge1xuICAgICAgeCA9IHRoaXMuYSAqIGRsb247XG4gICAgICB5ID0gLTEgKiB0aGlzLm1sMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5sID0gZ04odGhpcy5hLCB0aGlzLmUsIE1hdGguc2luKGxhdCkpIC8gTWF0aC50YW4obGF0KTtcbiAgICAgIHggPSBubCAqIE1hdGguc2luKGVsKTtcbiAgICAgIHkgPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIGxhdCkgLSB0aGlzLm1sMCArIG5sICogKDEgLSBNYXRoLmNvcyhlbCkpO1xuICAgIH1cbiAgfVxuICBwLnggPSB4ICsgdGhpcy54MDtcbiAgcC55ID0geSArIHRoaXMueTA7XG4gIHJldHVybiBwO1xufVxuXG4vKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbG9uLCBsYXQsIHgsIHksIGk7XG4gIHZhciBhbCwgYmw7XG4gIHZhciBwaGksIGRwaGk7XG4gIHggPSBwLnggLSB0aGlzLngwO1xuICB5ID0gcC55IC0gdGhpcy55MDtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBpZiAoTWF0aC5hYnMoeSArIHRoaXMuYSAqIHRoaXMubGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24oeCAvIHRoaXMuYSArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gICAgICBsYXQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbCA9IHRoaXMubGF0MCArIHkgLyB0aGlzLmE7XG4gICAgICBibCA9IHggKiB4IC8gdGhpcy5hIC8gdGhpcy5hICsgYWwgKiBhbDtcbiAgICAgIHBoaSA9IGFsO1xuICAgICAgdmFyIHRhbnBoaTtcbiAgICAgIGZvciAoaSA9IE1BWF9JVEVSOyBpOyAtLWkpIHtcbiAgICAgICAgdGFucGhpID0gTWF0aC50YW4ocGhpKTtcbiAgICAgICAgZHBoaSA9IC0xICogKGFsICogKHBoaSAqIHRhbnBoaSArIDEpIC0gcGhpIC0gMC41ICogKHBoaSAqIHBoaSArIGJsKSAqIHRhbnBoaSkgLyAoKHBoaSAtIGFsKSAvIHRhbnBoaSAtIDEpO1xuICAgICAgICBwaGkgKz0gZHBoaTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IEVQU0xOKSB7XG4gICAgICAgICAgbGF0ID0gcGhpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAoTWF0aC5hc2luKHggKiBNYXRoLnRhbihwaGkpIC8gdGhpcy5hKSkgLyBNYXRoLnNpbihsYXQpLCB0aGlzLm92ZXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoTWF0aC5hYnMoeSArIHRoaXMubWwwKSA8PSBFUFNMTikge1xuICAgICAgbGF0ID0gMDtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHggLyB0aGlzLmEsIHRoaXMub3Zlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsID0gKHRoaXMubWwwICsgeSkgLyB0aGlzLmE7XG4gICAgICBibCA9IHggKiB4IC8gdGhpcy5hIC8gdGhpcy5hICsgYWwgKiBhbDtcbiAgICAgIHBoaSA9IGFsO1xuICAgICAgdmFyIGNsLCBtbG4sIG1sbnAsIG1hO1xuICAgICAgdmFyIGNvbjtcbiAgICAgIGZvciAoaSA9IE1BWF9JVEVSOyBpOyAtLWkpIHtcbiAgICAgICAgY29uID0gdGhpcy5lICogTWF0aC5zaW4ocGhpKTtcbiAgICAgICAgY2wgPSBNYXRoLnNxcnQoMSAtIGNvbiAqIGNvbikgKiBNYXRoLnRhbihwaGkpO1xuICAgICAgICBtbG4gPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHBoaSk7XG4gICAgICAgIG1sbnAgPSB0aGlzLmUwIC0gMiAqIHRoaXMuZTEgKiBNYXRoLmNvcygyICogcGhpKSArIDQgKiB0aGlzLmUyICogTWF0aC5jb3MoNCAqIHBoaSkgLSA2ICogdGhpcy5lMyAqIE1hdGguY29zKDYgKiBwaGkpO1xuICAgICAgICBtYSA9IG1sbiAvIHRoaXMuYTtcbiAgICAgICAgZHBoaSA9IChhbCAqIChjbCAqIG1hICsgMSkgLSBtYSAtIDAuNSAqIGNsICogKG1hICogbWEgKyBibCkpIC8gKHRoaXMuZXMgKiBNYXRoLnNpbigyICogcGhpKSAqIChtYSAqIG1hICsgYmwgLSAyICogYWwgKiBtYSkgLyAoNCAqIGNsKSArIChhbCAtIG1hKSAqIChjbCAqIG1sbnAgLSAyIC8gTWF0aC5zaW4oMiAqIHBoaSkpIC0gbWxucCk7XG4gICAgICAgIHBoaSAtPSBkcGhpO1xuICAgICAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gRVBTTE4pIHtcbiAgICAgICAgICBsYXQgPSBwaGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbGF0PXBoaTR6KHRoaXMuZSx0aGlzLmUwLHRoaXMuZTEsdGhpcy5lMix0aGlzLmUzLGFsLGJsLDAsMCk7XG4gICAgICBjbCA9IE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIE1hdGgucG93KE1hdGguc2luKGxhdCksIDIpKSAqIE1hdGgudGFuKGxhdCk7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmFzaW4oeCAqIGNsIC8gdGhpcy5hKSAvIE1hdGguc2luKGxhdCksIHRoaXMub3Zlcik7XG4gICAgfVxuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydQb2x5Y29uaWMnLCAnQW1lcmljYW5fUG9seWNvbmljJywgJ3BvbHknXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiLy8gUVNDIHByb2plY3Rpb24gcmV3cml0dGVuIGZyb20gdGhlIG9yaWdpbmFsIFBST0o0XG4vLyBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vcHJvai40L2Jsb2IvbWFzdGVyL3NyYy9QSl9xc2MuY1xuXG5pbXBvcnQgeyBFUFNMTiwgVFdPX1BJLCBTUEksIEhBTEZfUEksIEZPUlRQSSB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGZhY2VcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB4MFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHkwXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBvbmVfbWludXNfZlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG9uZV9taW51c19mX3NxdWFyZWRcbiAqL1xuXG4vKiBjb25zdGFudHMgKi9cbnZhciBGQUNFX0VOVU0gPSB7XG4gIEZST05UOiAxLFxuICBSSUdIVDogMixcbiAgQkFDSzogMyxcbiAgTEVGVDogNCxcbiAgVE9QOiA1LFxuICBCT1RUT006IDZcbn07XG5cbnZhciBBUkVBX0VOVU0gPSB7XG4gIEFSRUFfMDogMSxcbiAgQVJFQV8xOiAyLFxuICBBUkVBXzI6IDMsXG4gIEFSRUFfMzogNFxufTtcblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgfHwgMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcbiAgdGhpcy5sYXRfdHMgPSB0aGlzLmxhdF90cyB8fCAwO1xuICB0aGlzLnRpdGxlID0gdGhpcy50aXRsZSB8fCAnUXVhZHJpbGF0ZXJhbGl6ZWQgU3BoZXJpY2FsIEN1YmUnO1xuXG4gIC8qIERldGVybWluZSB0aGUgY3ViZSBmYWNlIGZyb20gdGhlIGNlbnRlciBvZiBwcm9qZWN0aW9uLiAqL1xuICBpZiAodGhpcy5sYXQwID49IEhBTEZfUEkgLSBGT1JUUEkgLyAyLjApIHtcbiAgICB0aGlzLmZhY2UgPSBGQUNFX0VOVU0uVE9QO1xuICB9IGVsc2UgaWYgKHRoaXMubGF0MCA8PSAtKEhBTEZfUEkgLSBGT1JUUEkgLyAyLjApKSB7XG4gICAgdGhpcy5mYWNlID0gRkFDRV9FTlVNLkJPVFRPTTtcbiAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLmxvbmcwKSA8PSBGT1JUUEkpIHtcbiAgICB0aGlzLmZhY2UgPSBGQUNFX0VOVU0uRlJPTlQ7XG4gIH0gZWxzZSBpZiAoTWF0aC5hYnModGhpcy5sb25nMCkgPD0gSEFMRl9QSSArIEZPUlRQSSkge1xuICAgIHRoaXMuZmFjZSA9IHRoaXMubG9uZzAgPiAwLjAgPyBGQUNFX0VOVU0uUklHSFQgOiBGQUNFX0VOVU0uTEVGVDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmZhY2UgPSBGQUNFX0VOVU0uQkFDSztcbiAgfVxuXG4gIC8qIEZpbGwgaW4gdXNlZnVsIHZhbHVlcyBmb3IgdGhlIGVsbGlwc29pZCA8LT4gc3BoZXJlIHNoaWZ0XG4gICAqIGRlc2NyaWJlZCBpbiBbTEsxMl0uICovXG4gIGlmICh0aGlzLmVzICE9PSAwKSB7XG4gICAgdGhpcy5vbmVfbWludXNfZiA9IDEgLSAodGhpcy5hIC0gdGhpcy5iKSAvIHRoaXMuYTtcbiAgICB0aGlzLm9uZV9taW51c19mX3NxdWFyZWQgPSB0aGlzLm9uZV9taW51c19mICogdGhpcy5vbmVfbWludXNfZjtcbiAgfVxufVxuXG4vLyBRU0MgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgeHkgPSB7IHg6IDAsIHk6IDAgfTtcbiAgdmFyIGxhdCwgbG9uO1xuICB2YXIgdGhldGEsIHBoaTtcbiAgdmFyIHQsIG11O1xuICAvKiBudTsgKi9cbiAgdmFyIGFyZWEgPSB7IHZhbHVlOiAwIH07XG5cbiAgLy8gbW92ZSBsb24gYWNjb3JkaW5nIHRvIHByb2plY3Rpb24ncyBsb25cbiAgcC54IC09IHRoaXMubG9uZzA7XG5cbiAgLyogQ29udmVydCB0aGUgZ2VvZGV0aWMgbGF0aXR1ZGUgdG8gYSBnZW9jZW50cmljIGxhdGl0dWRlLlxuICAgKiBUaGlzIGNvcnJlc3BvbmRzIHRvIHRoZSBzaGlmdCBmcm9tIHRoZSBlbGxpcHNvaWQgdG8gdGhlIHNwaGVyZVxuICAgKiBkZXNjcmliZWQgaW4gW0xLMTJdLiAqL1xuICBpZiAodGhpcy5lcyAhPT0gMCkgeyAvLyBpZiAoUC0+ZXMgIT0gMCkge1xuICAgIGxhdCA9IE1hdGguYXRhbih0aGlzLm9uZV9taW51c19mX3NxdWFyZWQgKiBNYXRoLnRhbihwLnkpKTtcbiAgfSBlbHNlIHtcbiAgICBsYXQgPSBwLnk7XG4gIH1cblxuICAvKiBDb252ZXJ0IHRoZSBpbnB1dCBsYXQsIGxvbiBpbnRvIHRoZXRhLCBwaGkgYXMgdXNlZCBieSBRU0MuXG4gICAqIFRoaXMgZGVwZW5kcyBvbiB0aGUgY3ViZSBmYWNlIGFuZCB0aGUgYXJlYSBvbiBpdC5cbiAgICogRm9yIHRoZSB0b3AgYW5kIGJvdHRvbSBmYWNlLCB3ZSBjYW4gY29tcHV0ZSB0aGV0YSBhbmQgcGhpXG4gICAqIGRpcmVjdGx5IGZyb20gcGhpLCBsYW0uIEZvciB0aGUgb3RoZXIgZmFjZXMsIHdlIG11c3QgdXNlXG4gICAqIHVuaXQgc3BoZXJlIGNhcnRlc2lhbiBjb29yZGluYXRlcyBhcyBhbiBpbnRlcm1lZGlhdGUgc3RlcC4gKi9cbiAgbG9uID0gcC54OyAvLyBsb24gPSBscC5sYW07XG4gIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5UT1ApIHtcbiAgICBwaGkgPSBIQUxGX1BJIC0gbGF0O1xuICAgIGlmIChsb24gPj0gRk9SVFBJICYmIGxvbiA8PSBIQUxGX1BJICsgRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcbiAgICAgIHRoZXRhID0gbG9uIC0gSEFMRl9QSTtcbiAgICB9IGVsc2UgaWYgKGxvbiA+IEhBTEZfUEkgKyBGT1JUUEkgfHwgbG9uIDw9IC0oSEFMRl9QSSArIEZPUlRQSSkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8xO1xuICAgICAgdGhldGEgPSAobG9uID4gMC4wID8gbG9uIC0gU1BJIDogbG9uICsgU1BJKTtcbiAgICB9IGVsc2UgaWYgKGxvbiA+IC0oSEFMRl9QSSArIEZPUlRQSSkgJiYgbG9uIDw9IC1GT1JUUEkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8yO1xuICAgICAgdGhldGEgPSBsb24gKyBIQUxGX1BJO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMztcbiAgICAgIHRoZXRhID0gbG9uO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5CT1RUT00pIHtcbiAgICBwaGkgPSBIQUxGX1BJICsgbGF0O1xuICAgIGlmIChsb24gPj0gRk9SVFBJICYmIGxvbiA8PSBIQUxGX1BJICsgRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcbiAgICAgIHRoZXRhID0gLWxvbiArIEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmIChsb24gPCBGT1JUUEkgJiYgbG9uID49IC1GT1JUUEkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8xO1xuICAgICAgdGhldGEgPSAtbG9uO1xuICAgIH0gZWxzZSBpZiAobG9uIDwgLUZPUlRQSSAmJiBsb24gPj0gLShIQUxGX1BJICsgRk9SVFBJKSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzI7XG4gICAgICB0aGV0YSA9IC1sb24gLSBIQUxGX1BJO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMztcbiAgICAgIHRoZXRhID0gKGxvbiA+IDAuMCA/IC1sb24gKyBTUEkgOiAtbG9uIC0gU1BJKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHEsIHIsIHM7XG4gICAgdmFyIHNpbmxhdCwgY29zbGF0O1xuICAgIHZhciBzaW5sb24sIGNvc2xvbjtcblxuICAgIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5SSUdIVCkge1xuICAgICAgbG9uID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obG9uLCArSEFMRl9QSSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5CQUNLKSB7XG4gICAgICBsb24gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihsb24sICtTUEkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uTEVGVCkge1xuICAgICAgbG9uID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obG9uLCAtSEFMRl9QSSk7XG4gICAgfVxuICAgIHNpbmxhdCA9IE1hdGguc2luKGxhdCk7XG4gICAgY29zbGF0ID0gTWF0aC5jb3MobGF0KTtcbiAgICBzaW5sb24gPSBNYXRoLnNpbihsb24pO1xuICAgIGNvc2xvbiA9IE1hdGguY29zKGxvbik7XG4gICAgcSA9IGNvc2xhdCAqIGNvc2xvbjtcbiAgICByID0gY29zbGF0ICogc2lubG9uO1xuICAgIHMgPSBzaW5sYXQ7XG5cbiAgICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uRlJPTlQpIHtcbiAgICAgIHBoaSA9IE1hdGguYWNvcyhxKTtcbiAgICAgIHRoZXRhID0gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgcywgciwgYXJlYSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5SSUdIVCkge1xuICAgICAgcGhpID0gTWF0aC5hY29zKHIpO1xuICAgICAgdGhldGEgPSBxc2NfZndkX2VxdWF0X2ZhY2VfdGhldGEocGhpLCBzLCAtcSwgYXJlYSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5CQUNLKSB7XG4gICAgICBwaGkgPSBNYXRoLmFjb3MoLXEpO1xuICAgICAgdGhldGEgPSBxc2NfZndkX2VxdWF0X2ZhY2VfdGhldGEocGhpLCBzLCAtciwgYXJlYSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5MRUZUKSB7XG4gICAgICBwaGkgPSBNYXRoLmFjb3MoLXIpO1xuICAgICAgdGhldGEgPSBxc2NfZndkX2VxdWF0X2ZhY2VfdGhldGEocGhpLCBzLCBxLCBhcmVhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLyogSW1wb3NzaWJsZSAqL1xuICAgICAgcGhpID0gdGhldGEgPSAwO1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgfVxuICB9XG5cbiAgLyogQ29tcHV0ZSBtdSBhbmQgbnUgZm9yIHRoZSBhcmVhIG9mIGRlZmluaXRpb24uXG4gICAqIEZvciBtdSwgc2VlIEVxLiAoMy0yMSkgaW4gW09MNzZdLCBidXQgbm90ZSB0aGUgdHlwb3M6XG4gICAqIGNvbXBhcmUgd2l0aCBFcS4gKDMtMTQpLiBGb3IgbnUsIHNlZSBFcS4gKDMtMzgpLiAqL1xuICBtdSA9IE1hdGguYXRhbigoMTIgLyBTUEkpICogKHRoZXRhICsgTWF0aC5hY29zKE1hdGguc2luKHRoZXRhKSAqIE1hdGguY29zKEZPUlRQSSkpIC0gSEFMRl9QSSkpO1xuICB0ID0gTWF0aC5zcXJ0KCgxIC0gTWF0aC5jb3MocGhpKSkgLyAoTWF0aC5jb3MobXUpICogTWF0aC5jb3MobXUpKSAvICgxIC0gTWF0aC5jb3MoTWF0aC5hdGFuKDEgLyBNYXRoLmNvcyh0aGV0YSkpKSkpO1xuXG4gIC8qIEFwcGx5IHRoZSByZXN1bHQgdG8gdGhlIHJlYWwgYXJlYS4gKi9cbiAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcbiAgICBtdSArPSBIQUxGX1BJO1xuICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzIpIHtcbiAgICBtdSArPSBTUEk7XG4gIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMykge1xuICAgIG11ICs9IDEuNSAqIFNQSTtcbiAgfVxuXG4gIC8qIE5vdyBjb21wdXRlIHgsIHkgZnJvbSBtdSBhbmQgbnUgKi9cbiAgeHkueCA9IHQgKiBNYXRoLmNvcyhtdSk7XG4gIHh5LnkgPSB0ICogTWF0aC5zaW4obXUpO1xuICB4eS54ID0geHkueCAqIHRoaXMuYSArIHRoaXMueDA7XG4gIHh5LnkgPSB4eS55ICogdGhpcy5hICsgdGhpcy55MDtcblxuICBwLnggPSB4eS54O1xuICBwLnkgPSB4eS55O1xuICByZXR1cm4gcDtcbn1cblxuLy8gUVNDIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIGxwID0geyBsYW06IDAsIHBoaTogMCB9O1xuICB2YXIgbXUsIG51LCBjb3NtdSwgdGFubnU7XG4gIHZhciB0YW50aGV0YSwgdGhldGEsIGNvc3BoaSwgcGhpO1xuICB2YXIgdDtcbiAgdmFyIGFyZWEgPSB7IHZhbHVlOiAwIH07XG5cbiAgLyogZGUtb2Zmc2V0ICovXG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG4gIC8qIENvbnZlcnQgdGhlIGlucHV0IHgsIHkgdG8gdGhlIG11IGFuZCBudSBhbmdsZXMgYXMgdXNlZCBieSBRU0MuXG4gICAqIFRoaXMgZGVwZW5kcyBvbiB0aGUgYXJlYSBvZiB0aGUgY3ViZSBmYWNlLiAqL1xuICBudSA9IE1hdGguYXRhbihNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KSk7XG4gIG11ID0gTWF0aC5hdGFuMihwLnksIHAueCk7XG4gIGlmIChwLnggPj0gMC4wICYmIHAueCA+PSBNYXRoLmFicyhwLnkpKSB7XG4gICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gIH0gZWxzZSBpZiAocC55ID49IDAuMCAmJiBwLnkgPj0gTWF0aC5hYnMocC54KSkge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8xO1xuICAgIG11IC09IEhBTEZfUEk7XG4gIH0gZWxzZSBpZiAocC54IDwgMC4wICYmIC1wLnggPj0gTWF0aC5hYnMocC55KSkge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8yO1xuICAgIG11ID0gKG11IDwgMC4wID8gbXUgKyBTUEkgOiBtdSAtIFNQSSk7XG4gIH0gZWxzZSB7XG4gICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgbXUgKz0gSEFMRl9QSTtcbiAgfVxuXG4gIC8qIENvbXB1dGUgcGhpIGFuZCB0aGV0YSBmb3IgdGhlIGFyZWEgb2YgZGVmaW5pdGlvbi5cbiAgICogVGhlIGludmVyc2UgcHJvamVjdGlvbiBpcyBub3QgZGVzY3JpYmVkIGluIHRoZSBvcmlnaW5hbCBwYXBlciwgYnV0IHNvbWVcbiAgICogZ29vZCBoaW50cyBjYW4gYmUgZm91bmQgaGVyZSAoYXMgb2YgMjAxMS0xMi0xNCk6XG4gICAqIGh0dHA6Ly9maXRzLmdzZmMubmFzYS5nb3YvZml0c2JpdHMvc2FmLjkzL3NhZi45MzAyXG4gICAqIChzZWFyY2ggZm9yIFwiTWVzc2FnZS1JZDogPDkzMDIxODE3NTkuQUEyNTQ3NyBhdCBmaXRzLmN2Lm5yYW8uZWR1PlwiKSAqL1xuICB0ID0gKFNQSSAvIDEyKSAqIE1hdGgudGFuKG11KTtcbiAgdGFudGhldGEgPSBNYXRoLnNpbih0KSAvIChNYXRoLmNvcyh0KSAtICgxIC8gTWF0aC5zcXJ0KDIpKSk7XG4gIHRoZXRhID0gTWF0aC5hdGFuKHRhbnRoZXRhKTtcbiAgY29zbXUgPSBNYXRoLmNvcyhtdSk7XG4gIHRhbm51ID0gTWF0aC50YW4obnUpO1xuICBjb3NwaGkgPSAxIC0gY29zbXUgKiBjb3NtdSAqIHRhbm51ICogdGFubnUgKiAoMSAtIE1hdGguY29zKE1hdGguYXRhbigxIC8gTWF0aC5jb3ModGhldGEpKSkpO1xuICBpZiAoY29zcGhpIDwgLTEpIHtcbiAgICBjb3NwaGkgPSAtMTtcbiAgfSBlbHNlIGlmIChjb3NwaGkgPiArMSkge1xuICAgIGNvc3BoaSA9ICsxO1xuICB9XG5cbiAgLyogQXBwbHkgdGhlIHJlc3VsdCB0byB0aGUgcmVhbCBhcmVhIG9uIHRoZSBjdWJlIGZhY2UuXG4gICAqIEZvciB0aGUgdG9wIGFuZCBib3R0b20gZmFjZSwgd2UgY2FuIGNvbXB1dGUgcGhpIGFuZCBsYW0gZGlyZWN0bHkuXG4gICAqIEZvciB0aGUgb3RoZXIgZmFjZXMsIHdlIG11c3QgdXNlIHVuaXQgc3BoZXJlIGNhcnRlc2lhbiBjb29yZGluYXRlc1xuICAgKiBhcyBhbiBpbnRlcm1lZGlhdGUgc3RlcC4gKi9cbiAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlRPUCkge1xuICAgIHBoaSA9IE1hdGguYWNvcyhjb3NwaGkpO1xuICAgIGxwLnBoaSA9IEhBTEZfUEkgLSBwaGk7XG4gICAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzApIHtcbiAgICAgIGxwLmxhbSA9IHRoZXRhICsgSEFMRl9QSTtcbiAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcbiAgICAgIGxwLmxhbSA9ICh0aGV0YSA8IDAuMCA/IHRoZXRhICsgU1BJIDogdGhldGEgLSBTUEkpO1xuICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMikge1xuICAgICAgbHAubGFtID0gdGhldGEgLSBIQUxGX1BJO1xuICAgIH0gZWxzZSAvKiBhcmVhLnZhbHVlID09IEFSRUFfRU5VTS5BUkVBXzMgKi8ge1xuICAgICAgbHAubGFtID0gdGhldGE7XG4gICAgfVxuICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJPVFRPTSkge1xuICAgIHBoaSA9IE1hdGguYWNvcyhjb3NwaGkpO1xuICAgIGxwLnBoaSA9IHBoaSAtIEhBTEZfUEk7XG4gICAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzApIHtcbiAgICAgIGxwLmxhbSA9IC10aGV0YSArIEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG4gICAgICBscC5sYW0gPSAtdGhldGE7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8yKSB7XG4gICAgICBscC5sYW0gPSAtdGhldGEgLSBIQUxGX1BJO1xuICAgIH0gZWxzZSAvKiBhcmVhLnZhbHVlID09IEFSRUFfRU5VTS5BUkVBXzMgKi8ge1xuICAgICAgbHAubGFtID0gKHRoZXRhIDwgMC4wID8gLXRoZXRhIC0gU1BJIDogLXRoZXRhICsgU1BJKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLyogQ29tcHV0ZSBwaGkgYW5kIGxhbSB2aWEgY2FydGVzaWFuIHVuaXQgc3BoZXJlIGNvb3JkaW5hdGVzLiAqL1xuICAgIHZhciBxLCByLCBzO1xuICAgIHEgPSBjb3NwaGk7XG4gICAgdCA9IHEgKiBxO1xuICAgIGlmICh0ID49IDEpIHtcbiAgICAgIHMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBzID0gTWF0aC5zcXJ0KDEgLSB0KSAqIE1hdGguc2luKHRoZXRhKTtcbiAgICB9XG4gICAgdCArPSBzICogcztcbiAgICBpZiAodCA+PSAxKSB7XG4gICAgICByID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgciA9IE1hdGguc3FydCgxIC0gdCk7XG4gICAgfVxuICAgIC8qIFJvdGF0ZSBxLHIscyBpbnRvIHRoZSBjb3JyZWN0IGFyZWEuICovXG4gICAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcbiAgICAgIHQgPSByO1xuICAgICAgciA9IC1zO1xuICAgICAgcyA9IHQ7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8yKSB7XG4gICAgICByID0gLXI7XG4gICAgICBzID0gLXM7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8zKSB7XG4gICAgICB0ID0gcjtcbiAgICAgIHIgPSBzO1xuICAgICAgcyA9IC10O1xuICAgIH1cbiAgICAvKiBSb3RhdGUgcSxyLHMgaW50byB0aGUgY29ycmVjdCBjdWJlIGZhY2UuICovXG4gICAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlJJR0hUKSB7XG4gICAgICB0ID0gcTtcbiAgICAgIHEgPSAtcjtcbiAgICAgIHIgPSB0O1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgcSA9IC1xO1xuICAgICAgciA9IC1yO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uTEVGVCkge1xuICAgICAgdCA9IHE7XG4gICAgICBxID0gcjtcbiAgICAgIHIgPSAtdDtcbiAgICB9XG4gICAgLyogTm93IGNvbXB1dGUgcGhpIGFuZCBsYW0gZnJvbSB0aGUgdW5pdCBzcGhlcmUgY29vcmRpbmF0ZXMuICovXG4gICAgbHAucGhpID0gTWF0aC5hY29zKC1zKSAtIEhBTEZfUEk7XG4gICAgbHAubGFtID0gTWF0aC5hdGFuMihyLCBxKTtcbiAgICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcbiAgICAgIGxwLmxhbSA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxwLmxhbSwgLUhBTEZfUEkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgbHAubGFtID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obHAubGFtLCAtU1BJKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkxFRlQpIHtcbiAgICAgIGxwLmxhbSA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxwLmxhbSwgK0hBTEZfUEkpO1xuICAgIH1cbiAgfVxuXG4gIC8qIEFwcGx5IHRoZSBzaGlmdCBmcm9tIHRoZSBzcGhlcmUgdG8gdGhlIGVsbGlwc29pZCBhcyBkZXNjcmliZWRcbiAgICogaW4gW0xLMTJdLiAqL1xuICBpZiAodGhpcy5lcyAhPT0gMCkge1xuICAgIHZhciBpbnZlcnRfc2lnbjtcbiAgICB2YXIgdGFucGhpLCB4YTtcbiAgICBpbnZlcnRfc2lnbiA9IChscC5waGkgPCAwID8gMSA6IDApO1xuICAgIHRhbnBoaSA9IE1hdGgudGFuKGxwLnBoaSk7XG4gICAgeGEgPSB0aGlzLmIgLyBNYXRoLnNxcnQodGFucGhpICogdGFucGhpICsgdGhpcy5vbmVfbWludXNfZl9zcXVhcmVkKTtcbiAgICBscC5waGkgPSBNYXRoLmF0YW4oTWF0aC5zcXJ0KHRoaXMuYSAqIHRoaXMuYSAtIHhhICogeGEpIC8gKHRoaXMub25lX21pbnVzX2YgKiB4YSkpO1xuICAgIGlmIChpbnZlcnRfc2lnbikge1xuICAgICAgbHAucGhpID0gLWxwLnBoaTtcbiAgICB9XG4gIH1cblxuICBscC5sYW0gKz0gdGhpcy5sb25nMDtcbiAgcC54ID0gbHAubGFtO1xuICBwLnkgPSBscC5waGk7XG4gIHJldHVybiBwO1xufVxuXG4vKiBIZWxwZXIgZnVuY3Rpb24gZm9yIGZvcndhcmQgcHJvamVjdGlvbjogY29tcHV0ZSB0aGUgdGhldGEgYW5nbGVcbiAqIGFuZCBkZXRlcm1pbmUgdGhlIGFyZWEgbnVtYmVyLiAqL1xuZnVuY3Rpb24gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgeSwgeCwgYXJlYSkge1xuICB2YXIgdGhldGE7XG4gIGlmIChwaGkgPCBFUFNMTikge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICAgIHRoZXRhID0gMC4wO1xuICB9IGVsc2Uge1xuICAgIHRoZXRhID0gTWF0aC5hdGFuMih5LCB4KTtcbiAgICBpZiAoTWF0aC5hYnModGhldGEpIDw9IEZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgfSBlbHNlIGlmICh0aGV0YSA+IEZPUlRQSSAmJiB0aGV0YSA8PSBIQUxGX1BJICsgRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcbiAgICAgIHRoZXRhIC09IEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmICh0aGV0YSA+IEhBTEZfUEkgKyBGT1JUUEkgfHwgdGhldGEgPD0gLShIQUxGX1BJICsgRk9SVFBJKSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzI7XG4gICAgICB0aGV0YSA9ICh0aGV0YSA+PSAwLjAgPyB0aGV0YSAtIFNQSSA6IHRoZXRhICsgU1BJKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgICB0aGV0YSArPSBIQUxGX1BJO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhldGE7XG59XG5cbi8qIEhlbHBlciBmdW5jdGlvbjogc2hpZnQgdGhlIGxvbmdpdHVkZS4gKi9cbmZ1bmN0aW9uIHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgb2Zmc2V0KSB7XG4gIHZhciBzbG9uID0gbG9uICsgb2Zmc2V0O1xuICBpZiAoc2xvbiA8IC1TUEkpIHtcbiAgICBzbG9uICs9IFRXT19QSTtcbiAgfSBlbHNlIGlmIChzbG9uID4gK1NQSSkge1xuICAgIHNsb24gLT0gVFdPX1BJO1xuICB9XG4gIHJldHVybiBzbG9uO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydRdWFkcmlsYXRlcmFsaXplZCBTcGhlcmljYWwgQ3ViZScsICdRdWFkcmlsYXRlcmFsaXplZF9TcGhlcmljYWxfQ3ViZScsICdxc2MnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiLy8gUm9iaW5zb24gcHJvamVjdGlvblxuLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL09TR2VvL3Byb2ouNC9ibG9iL21hc3Rlci9zcmMvUEpfcm9iaW4uY1xuLy8gUG9seW5vbWlhbCBjb2VmaWNpZW50cyBmcm9tIGh0dHA6Ly9hcnRpY2xlLmdtYW5lLm9yZy9nbWFuZS5jb21wLmdpcy5wcm9qLTQuZGV2ZWwvNjAzOVxuXG5pbXBvcnQgeyBIQUxGX1BJLCBEMlIsIFIyRCwgRVBTTE4gfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxudmFyIENPRUZTX1ggPSBbXG4gIFsxLjAwMDAsIDIuMjE5OWUtMTcsIC03LjE1NTE1ZS0wNSwgMy4xMTAzZS0wNl0sXG4gIFswLjk5ODYsIC0wLjAwMDQ4MjI0MywgLTIuNDg5N2UtMDUsIC0xLjMzMDllLTA2XSxcbiAgWzAuOTk1NCwgLTAuMDAwODMxMDMsIC00LjQ4NjA1ZS0wNSwgLTkuODY3MDFlLTA3XSxcbiAgWzAuOTkwMCwgLTAuMDAxMzUzNjQsIC01Ljk2NjFlLTA1LCAzLjY3NzdlLTA2XSxcbiAgWzAuOTgyMiwgLTAuMDAxNjc0NDIsIC00LjQ5NTQ3ZS0wNiwgLTUuNzI0MTFlLTA2XSxcbiAgWzAuOTczMCwgLTAuMDAyMTQ4NjgsIC05LjAzNTcxZS0wNSwgMS44NzM2ZS0wOF0sXG4gIFswLjk2MDAsIC0wLjAwMzA1MDg1LCAtOS4wMDc2MWUtMDUsIDEuNjQ5MTdlLTA2XSxcbiAgWzAuOTQyNywgLTAuMDAzODI3OTIsIC02LjUzMzg2ZS0wNSwgLTIuNjE1NGUtMDZdLFxuICBbMC45MjE2LCAtMC4wMDQ2Nzc0NiwgLTAuMDAwMTA0NTcsIDQuODEyNDNlLTA2XSxcbiAgWzAuODk2MiwgLTAuMDA1MzYyMjMsIC0zLjIzODMxZS0wNSwgLTUuNDM0MzJlLTA2XSxcbiAgWzAuODY3OSwgLTAuMDA2MDkzNjMsIC0wLjAwMDExMzg5OCwgMy4zMjQ4NGUtMDZdLFxuICBbMC44MzUwLCAtMC4wMDY5ODMyNSwgLTYuNDAyNTNlLTA1LCA5LjM0OTU5ZS0wN10sXG4gIFswLjc5ODYsIC0wLjAwNzU1MzM4LCAtNS4wMDAwOWUtMDUsIDkuMzUzMjRlLTA3XSxcbiAgWzAuNzU5NywgLTAuMDA3OTgzMjQsIC0zLjU5NzFlLTA1LCAtMi4yNzYyNmUtMDZdLFxuICBbMC43MTg2LCAtMC4wMDg1MTM2NywgLTcuMDExNDllLTA1LCAtOC42MzAzZS0wNl0sXG4gIFswLjY3MzIsIC0wLjAwOTg2MjA5LCAtMC4wMDAxOTk1NjksIDEuOTE5NzRlLTA1XSxcbiAgWzAuNjIxMywgLTAuMDEwNDE4LCA4LjgzOTIzZS0wNSwgNi4yNDA1MWUtMDZdLFxuICBbMC41NzIyLCAtMC4wMDkwNjYwMSwgMC4wMDAxODIsIDYuMjQwNTFlLTA2XSxcbiAgWzAuNTMyMiwgLTAuMDA2Nzc3OTcsIDAuMDAwMjc1NjA4LCA2LjI0MDUxZS0wNl1cbl07XG5cbnZhciBDT0VGU19ZID0gW1xuICBbLTUuMjA0MTdlLTE4LCAwLjAxMjQsIDEuMjE0MzFlLTE4LCAtOC40NTI4NGUtMTFdLFxuICBbMC4wNjIwLCAwLjAxMjQsIC0xLjI2NzkzZS0wOSwgNC4yMjY0MmUtMTBdLFxuICBbMC4xMjQwLCAwLjAxMjQsIDUuMDcxNzFlLTA5LCAtMS42MDYwNGUtMDldLFxuICBbMC4xODYwLCAwLjAxMjM5OTksIC0xLjkwMTg5ZS0wOCwgNi4wMDE1MmUtMDldLFxuICBbMC4yNDgwLCAwLjAxMjQwMDIsIDcuMTAwMzllLTA4LCAtMi4yNGUtMDhdLFxuICBbMC4zMTAwLCAwLjAxMjM5OTIsIC0yLjY0OTk3ZS0wNywgOC4zNTk4NmUtMDhdLFxuICBbMC4zNzIwLCAwLjAxMjQwMjksIDkuODg5ODNlLTA3LCAtMy4xMTk5NGUtMDddLFxuICBbMC40MzQwLCAwLjAxMjM4OTMsIC0zLjY5MDkzZS0wNiwgLTQuMzU2MjFlLTA3XSxcbiAgWzAuNDk1OCwgMC4wMTIzMTk4LCAtMS4wMjI1MmUtMDUsIC0zLjQ1NTIzZS0wN10sXG4gIFswLjU1NzEsIDAuMDEyMTkxNiwgLTEuNTQwODFlLTA1LCAtNS44MjI4OGUtMDddLFxuICBbMC42MTc2LCAwLjAxMTk5MzgsIC0yLjQxNDI0ZS0wNSwgLTUuMjUzMjdlLTA3XSxcbiAgWzAuNjc2OSwgMC4wMTE3MTMsIC0zLjIwMjIzZS0wNSwgLTUuMTY0MDVlLTA3XSxcbiAgWzAuNzM0NiwgMC4wMTEzNTQxLCAtMy45NzY4NGUtMDUsIC02LjA5MDUyZS0wN10sXG4gIFswLjc5MDMsIDAuMDEwOTEwNywgLTQuODkwNDJlLTA1LCAtMS4wNDczOWUtMDZdLFxuICBbMC44NDM1LCAwLjAxMDM0MzEsIC02LjQ2MTVlLTA1LCAtMS40MDM3NGUtMDldLFxuICBbMC44OTM2LCAwLjAwOTY5Njg2LCAtNi40NjM2ZS0wNSwgLTguNTQ3ZS0wNl0sXG4gIFswLjkzOTQsIDAuMDA4NDA5NDcsIC0wLjAwMDE5Mjg0MSwgLTQuMjEwNmUtMDZdLFxuICBbMC45NzYxLCAwLjAwNjE2NTI3LCAtMC4wMDAyNTYsIC00LjIxMDZlLTA2XSxcbiAgWzEuMDAwMCwgMC4wMDMyODk0NywgLTAuMDAwMzE5MTU5LCAtNC4yMTA2ZS0wNl1cbl07XG5cbnZhciBGWEMgPSAwLjg0ODc7XG52YXIgRllDID0gMS4zNTIzO1xudmFyIEMxID0gUjJEIC8gNTsgLy8gcmFkIHRvIDUtZGVncmVlIGludGVydmFsXG52YXIgUkMxID0gMSAvIEMxO1xudmFyIE5PREVTID0gMTg7XG5cbnZhciBwb2x5M192YWwgPSBmdW5jdGlvbiAoY29lZnMsIHgpIHtcbiAgcmV0dXJuIGNvZWZzWzBdICsgeCAqIChjb2Vmc1sxXSArIHggKiAoY29lZnNbMl0gKyB4ICogY29lZnNbM10pKTtcbn07XG5cbnZhciBwb2x5M19kZXIgPSBmdW5jdGlvbiAoY29lZnMsIHgpIHtcbiAgcmV0dXJuIGNvZWZzWzFdICsgeCAqICgyICogY29lZnNbMl0gKyB4ICogMyAqIGNvZWZzWzNdKTtcbn07XG5cbmZ1bmN0aW9uIG5ld3Rvbl9yYXBzaG9uKGZfZGYsIHN0YXJ0LCBtYXhfZXJyLCBpdGVycykge1xuICB2YXIgeCA9IHN0YXJ0O1xuICBmb3IgKDsgaXRlcnM7IC0taXRlcnMpIHtcbiAgICB2YXIgdXBkID0gZl9kZih4KTtcbiAgICB4IC09IHVwZDtcbiAgICBpZiAoTWF0aC5hYnModXBkKSA8IG1heF9lcnIpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwIHx8IDA7XG4gIHRoaXMuZXMgPSAwO1xuICB0aGlzLnRpdGxlID0gdGhpcy50aXRsZSB8fCAnUm9iaW5zb24nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChsbCkge1xuICB2YXIgbG9uID0gYWRqdXN0X2xvbihsbC54IC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcblxuICB2YXIgZHBoaSA9IE1hdGguYWJzKGxsLnkpO1xuICB2YXIgaSA9IE1hdGguZmxvb3IoZHBoaSAqIEMxKTtcbiAgaWYgKGkgPCAwKSB7XG4gICAgaSA9IDA7XG4gIH0gZWxzZSBpZiAoaSA+PSBOT0RFUykge1xuICAgIGkgPSBOT0RFUyAtIDE7XG4gIH1cbiAgZHBoaSA9IFIyRCAqIChkcGhpIC0gUkMxICogaSk7XG4gIHZhciB4eSA9IHtcbiAgICB4OiBwb2x5M192YWwoQ09FRlNfWFtpXSwgZHBoaSkgKiBsb24sXG4gICAgeTogcG9seTNfdmFsKENPRUZTX1lbaV0sIGRwaGkpXG4gIH07XG4gIGlmIChsbC55IDwgMCkge1xuICAgIHh5LnkgPSAteHkueTtcbiAgfVxuXG4gIHh5LnggPSB4eS54ICogdGhpcy5hICogRlhDICsgdGhpcy54MDtcbiAgeHkueSA9IHh5LnkgKiB0aGlzLmEgKiBGWUMgKyB0aGlzLnkwO1xuICByZXR1cm4geHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHh5KSB7XG4gIHZhciBsbCA9IHtcbiAgICB4OiAoeHkueCAtIHRoaXMueDApIC8gKHRoaXMuYSAqIEZYQyksXG4gICAgeTogTWF0aC5hYnMoeHkueSAtIHRoaXMueTApIC8gKHRoaXMuYSAqIEZZQylcbiAgfTtcblxuICBpZiAobGwueSA+PSAxKSB7IC8vIHBhdGhvbG9naWMgY2FzZVxuICAgIGxsLnggLz0gQ09FRlNfWFtOT0RFU11bMF07XG4gICAgbGwueSA9IHh5LnkgPCAwID8gLUhBTEZfUEkgOiBIQUxGX1BJO1xuICB9IGVsc2Uge1xuICAgIC8vIGZpbmQgdGFibGUgaW50ZXJ2YWxcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IobGwueSAqIE5PREVTKTtcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgIGkgPSAwO1xuICAgIH0gZWxzZSBpZiAoaSA+PSBOT0RFUykge1xuICAgICAgaSA9IE5PREVTIC0gMTtcbiAgICB9XG4gICAgZm9yICg7Oykge1xuICAgICAgaWYgKENPRUZTX1lbaV1bMF0gPiBsbC55KSB7XG4gICAgICAgIC0taTtcbiAgICAgIH0gZWxzZSBpZiAoQ09FRlNfWVtpICsgMV1bMF0gPD0gbGwueSkge1xuICAgICAgICArK2k7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gbGluZWFyIGludGVycG9sYXRpb24gaW4gNSBkZWdyZWUgaW50ZXJ2YWxcbiAgICB2YXIgY29lZnMgPSBDT0VGU19ZW2ldO1xuICAgIHZhciB0ID0gNSAqIChsbC55IC0gY29lZnNbMF0pIC8gKENPRUZTX1lbaSArIDFdWzBdIC0gY29lZnNbMF0pO1xuICAgIC8vIGZpbmQgdCBzbyB0aGF0IHBvbHkzX3ZhbChjb2VmcywgdCkgPSBsbC55XG4gICAgdCA9IG5ld3Rvbl9yYXBzaG9uKGZ1bmN0aW9uICh4KSB7XG4gICAgICByZXR1cm4gKHBvbHkzX3ZhbChjb2VmcywgeCkgLSBsbC55KSAvIHBvbHkzX2Rlcihjb2VmcywgeCk7XG4gICAgfSwgdCwgRVBTTE4sIDEwMCk7XG5cbiAgICBsbC54IC89IHBvbHkzX3ZhbChDT0VGU19YW2ldLCB0KTtcbiAgICBsbC55ID0gKDUgKiBpICsgdCkgKiBEMlI7XG4gICAgaWYgKHh5LnkgPCAwKSB7XG4gICAgICBsbC55ID0gLWxsLnk7XG4gICAgfVxuICB9XG5cbiAgbGwueCA9IGFkanVzdF9sb24obGwueCArIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHJldHVybiBsbDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnUm9iaW5zb24nLCAncm9iaW4nXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuaW1wb3J0IHBqX2VuZm4gZnJvbSAnLi4vY29tbW9uL3BqX2VuZm4nO1xudmFyIE1BWF9JVEVSID0gMjA7XG5pbXBvcnQgcGpfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfbWxmbic7XG5pbXBvcnQgcGpfaW52X21sZm4gZnJvbSAnLi4vY29tbW9uL3BqX2ludl9tbGZuJztcbmltcG9ydCB7IEVQU0xOLCBIQUxGX1BJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBlblxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtXG4gKiBAcHJvcGVydHkge251bWJlcn0gQ195XG4gKiBAcHJvcGVydHkge251bWJlcn0gQ194XG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqL1xuXG4vKiogQHRoaXMge2ltcG9ydCgnLi4vZGVmcy5qcycpLlByb2plY3Rpb25EZWZpbml0aW9uICYgTG9jYWxUaGlzfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2VcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgaWYgKCF0aGlzLnNwaGVyZSkge1xuICAgIHRoaXMuZW4gPSBwal9lbmZuKHRoaXMuZXMpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubiA9IDE7XG4gICAgdGhpcy5tID0gMDtcbiAgICB0aGlzLmVzID0gMDtcbiAgICB0aGlzLkNfeSA9IE1hdGguc3FydCgodGhpcy5tICsgMSkgLyB0aGlzLm4pO1xuICAgIHRoaXMuQ194ID0gdGhpcy5DX3kgLyAodGhpcy5tICsgMSk7XG4gIH1cbn1cblxuLyogU2ludXNvaWRhbCBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHgsIHk7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmICghdGhpcy5tKSB7XG4gICAgICBsYXQgPSB0aGlzLm4gIT09IDEgPyBNYXRoLmFzaW4odGhpcy5uICogTWF0aC5zaW4obGF0KSkgOiBsYXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrID0gdGhpcy5uICogTWF0aC5zaW4obGF0KTtcbiAgICAgIGZvciAodmFyIGkgPSBNQVhfSVRFUjsgaTsgLS1pKSB7XG4gICAgICAgIHZhciBWID0gKHRoaXMubSAqIGxhdCArIE1hdGguc2luKGxhdCkgLSBrKSAvICh0aGlzLm0gKyBNYXRoLmNvcyhsYXQpKTtcbiAgICAgICAgbGF0IC09IFY7XG4gICAgICAgIGlmIChNYXRoLmFicyhWKSA8IEVQU0xOKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgeCA9IHRoaXMuYSAqIHRoaXMuQ194ICogbG9uICogKHRoaXMubSArIE1hdGguY29zKGxhdCkpO1xuICAgIHkgPSB0aGlzLmEgKiB0aGlzLkNfeSAqIGxhdDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKGxhdCk7XG4gICAgdmFyIGMgPSBNYXRoLmNvcyhsYXQpO1xuICAgIHkgPSB0aGlzLmEgKiBwal9tbGZuKGxhdCwgcywgYywgdGhpcy5lbik7XG4gICAgeCA9IHRoaXMuYSAqIGxvbiAqIGMgLyBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBzICogcyk7XG4gIH1cblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbGF0LCB0ZW1wLCBsb24sIHM7XG5cbiAgcC54IC09IHRoaXMueDA7XG4gIGxvbiA9IHAueCAvIHRoaXMuYTtcbiAgcC55IC09IHRoaXMueTA7XG4gIGxhdCA9IHAueSAvIHRoaXMuYTtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsYXQgLz0gdGhpcy5DX3k7XG4gICAgbG9uID0gbG9uIC8gKHRoaXMuQ194ICogKHRoaXMubSArIE1hdGguY29zKGxhdCkpKTtcbiAgICBpZiAodGhpcy5tKSB7XG4gICAgICBsYXQgPSBhc2lueigodGhpcy5tICogbGF0ICsgTWF0aC5zaW4obGF0KSkgLyB0aGlzLm4pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uICE9PSAxKSB7XG4gICAgICBsYXQgPSBhc2lueihNYXRoLnNpbihsYXQpIC8gdGhpcy5uKTtcbiAgICB9XG4gICAgbG9uID0gYWRqdXN0X2xvbihsb24gKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICAgIGxhdCA9IGFkanVzdF9sYXQobGF0KTtcbiAgfSBlbHNlIHtcbiAgICBsYXQgPSBwal9pbnZfbWxmbihwLnkgLyB0aGlzLmEsIHRoaXMuZXMsIHRoaXMuZW4pO1xuICAgIHMgPSBNYXRoLmFicyhsYXQpO1xuICAgIGlmIChzIDwgSEFMRl9QSSkge1xuICAgICAgcyA9IE1hdGguc2luKGxhdCk7XG4gICAgICB0ZW1wID0gdGhpcy5sb25nMCArIHAueCAqIE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIHMgKiBzKSAvICh0aGlzLmEgKiBNYXRoLmNvcyhsYXQpKTtcbiAgICAgIC8vIHRlbXAgPSB0aGlzLmxvbmcwICsgcC54IC8gKHRoaXMuYSAqIE1hdGguY29zKGxhdCkpO1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0ZW1wLCB0aGlzLm92ZXIpO1xuICAgIH0gZWxzZSBpZiAoKHMgLSBFUFNMTikgPCBIQUxGX1BJKSB7XG4gICAgICBsb24gPSB0aGlzLmxvbmcwO1xuICAgIH1cbiAgfVxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ1NpbnVzb2lkYWwnLCAnc2ludSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvKlxuICByZWZlcmVuY2VzOlxuICAgIEZvcm11bGVzIGV0IGNvbnN0YW50ZXMgcG91ciBsZSBDYWxjdWwgcG91ciBsYVxuICAgIHByb2plY3Rpb24gY3lsaW5kcmlxdWUgY29uZm9ybWUgw6AgYXhlIG9ibGlxdWUgZXQgcG91ciBsYSB0cmFuc2Zvcm1hdGlvbiBlbnRyZVxuICAgIGRlcyBzeXN0w6htZXMgZGUgcsOpZsOpcmVuY2UuXG4gICAgaHR0cDovL3d3dy5zd2lzc3RvcG8uYWRtaW4uY2gvaW50ZXJuZXQvc3dpc3N0b3BvL2ZyL2hvbWUvdG9waWNzL3N1cnZleS9zeXMvcmVmc3lzL3N3aXR6ZXJsYW5kLnBhcnN5c3JlbGF0ZWQxLjMxMjE2LmRvd25sb2FkTGlzdC43NzAwNC5Eb3dubG9hZEZpbGUudG1wL3N3aXNzcHJvamVjdGlvbmZyLnBkZlxuICAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGxhbWJkYTBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlXG4gKiBAcHJvcGVydHkge251bWJlcn0gUlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGIwXG4gKiBAcHJvcGVydHkge251bWJlcn0gS1xuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHBoeTAgPSB0aGlzLmxhdDA7XG4gIHRoaXMubGFtYmRhMCA9IHRoaXMubG9uZzA7XG4gIHZhciBzaW5QaHkwID0gTWF0aC5zaW4ocGh5MCk7XG4gIHZhciBzZW1pTWFqb3JBeGlzID0gdGhpcy5hO1xuICB2YXIgaW52RiA9IHRoaXMucmY7XG4gIHZhciBmbGF0dGVuaW5nID0gMSAvIGludkY7XG4gIHZhciBlMiA9IDIgKiBmbGF0dGVuaW5nIC0gTWF0aC5wb3coZmxhdHRlbmluZywgMik7XG4gIHZhciBlID0gdGhpcy5lID0gTWF0aC5zcXJ0KGUyKTtcbiAgdGhpcy5SID0gdGhpcy5rMCAqIHNlbWlNYWpvckF4aXMgKiBNYXRoLnNxcnQoMSAtIGUyKSAvICgxIC0gZTIgKiBNYXRoLnBvdyhzaW5QaHkwLCAyKSk7XG4gIHRoaXMuYWxwaGEgPSBNYXRoLnNxcnQoMSArIGUyIC8gKDEgLSBlMikgKiBNYXRoLnBvdyhNYXRoLmNvcyhwaHkwKSwgNCkpO1xuICB0aGlzLmIwID0gTWF0aC5hc2luKHNpblBoeTAgLyB0aGlzLmFscGhhKTtcbiAgdmFyIGsxID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyB0aGlzLmIwIC8gMikpO1xuICB2YXIgazIgPSBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIHBoeTAgLyAyKSk7XG4gIHZhciBrMyA9IE1hdGgubG9nKCgxICsgZSAqIHNpblBoeTApIC8gKDEgLSBlICogc2luUGh5MCkpO1xuICB0aGlzLksgPSBrMSAtIHRoaXMuYWxwaGEgKiBrMiArIHRoaXMuYWxwaGEgKiBlIC8gMiAqIGszO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBTYTEgPSBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCAtIHAueSAvIDIpKTtcbiAgdmFyIFNhMiA9IHRoaXMuZSAvIDIgKiBNYXRoLmxvZygoMSArIHRoaXMuZSAqIE1hdGguc2luKHAueSkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbihwLnkpKSk7XG4gIHZhciBTID0gLXRoaXMuYWxwaGEgKiAoU2ExICsgU2EyKSArIHRoaXMuSztcblxuICAvLyBzcGhlcmljIGxhdGl0dWRlXG4gIHZhciBiID0gMiAqIChNYXRoLmF0YW4oTWF0aC5leHAoUykpIC0gTWF0aC5QSSAvIDQpO1xuXG4gIC8vIHNwaGVyaWMgbG9uZ2l0dWRlXG4gIHZhciBJID0gdGhpcy5hbHBoYSAqIChwLnggLSB0aGlzLmxhbWJkYTApO1xuXG4gIC8vIHBzb2V1ZG8gZXF1YXRvcmlhbCByb3RhdGlvblxuICB2YXIgcm90SSA9IE1hdGguYXRhbihNYXRoLnNpbihJKSAvIChNYXRoLnNpbih0aGlzLmIwKSAqIE1hdGgudGFuKGIpICsgTWF0aC5jb3ModGhpcy5iMCkgKiBNYXRoLmNvcyhJKSkpO1xuXG4gIHZhciByb3RCID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYjApICogTWF0aC5zaW4oYikgLSBNYXRoLnNpbih0aGlzLmIwKSAqIE1hdGguY29zKGIpICogTWF0aC5jb3MoSSkpO1xuXG4gIHAueSA9IHRoaXMuUiAvIDIgKiBNYXRoLmxvZygoMSArIE1hdGguc2luKHJvdEIpKSAvICgxIC0gTWF0aC5zaW4ocm90QikpKSArIHRoaXMueTA7XG4gIHAueCA9IHRoaXMuUiAqIHJvdEkgKyB0aGlzLngwO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgWSA9IHAueCAtIHRoaXMueDA7XG4gIHZhciBYID0gcC55IC0gdGhpcy55MDtcblxuICB2YXIgcm90SSA9IFkgLyB0aGlzLlI7XG4gIHZhciByb3RCID0gMiAqIChNYXRoLmF0YW4oTWF0aC5leHAoWCAvIHRoaXMuUikpIC0gTWF0aC5QSSAvIDQpO1xuXG4gIHZhciBiID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYjApICogTWF0aC5zaW4ocm90QikgKyBNYXRoLnNpbih0aGlzLmIwKSAqIE1hdGguY29zKHJvdEIpICogTWF0aC5jb3Mocm90SSkpO1xuICB2YXIgSSA9IE1hdGguYXRhbihNYXRoLnNpbihyb3RJKSAvIChNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguY29zKHJvdEkpIC0gTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLnRhbihyb3RCKSkpO1xuXG4gIHZhciBsYW1iZGEgPSB0aGlzLmxhbWJkYTAgKyBJIC8gdGhpcy5hbHBoYTtcblxuICB2YXIgUyA9IDA7XG4gIHZhciBwaHkgPSBiO1xuICB2YXIgcHJldlBoeSA9IC0xMDAwO1xuICB2YXIgaXRlcmF0aW9uID0gMDtcbiAgd2hpbGUgKE1hdGguYWJzKHBoeSAtIHByZXZQaHkpID4gMC4wMDAwMDAxKSB7XG4gICAgaWYgKCsraXRlcmF0aW9uID4gMjApIHtcbiAgICAgIC8vIC4uLnJlcG9ydEVycm9yKFwib21lcmNGd2RJbmZpbml0eVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gUyA9IE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgcGh5IC8gMikpO1xuICAgIFMgPSAxIC8gdGhpcy5hbHBoYSAqIChNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIGIgLyAyKSkgLSB0aGlzLkspICsgdGhpcy5lICogTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBNYXRoLmFzaW4odGhpcy5lICogTWF0aC5zaW4ocGh5KSkgLyAyKSk7XG4gICAgcHJldlBoeSA9IHBoeTtcbiAgICBwaHkgPSAyICogTWF0aC5hdGFuKE1hdGguZXhwKFMpKSAtIE1hdGguUEkgLyAyO1xuICB9XG5cbiAgcC54ID0gbGFtYmRhO1xuICBwLnkgPSBwaHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydzb21lcmMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHsgRVBTTE4sIEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuaW1wb3J0IHNpZ24gZnJvbSAnLi4vY29tbW9uL3NpZ24nO1xuaW1wb3J0IG1zZm56IGZyb20gJy4uL2NvbW1vbi9tc2Zueic7XG5pbXBvcnQgdHNmbnogZnJvbSAnLi4vY29tbW9uL3RzZm56JztcbmltcG9ydCBwaGkyeiBmcm9tICcuLi9jb21tb24vcGhpMnonO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvY2FsVGhpc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc2xhdDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5sYXQwXG4gKiBAcHJvcGVydHkge251bWJlcn0gbXMxXG4gKiBAcHJvcGVydHkge251bWJlcn0gWDBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb3NYMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpblgwXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29uXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29uc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc3Nmbl8ocGhpdCwgc2lucGhpLCBlY2Nlbikge1xuICBzaW5waGkgKj0gZWNjZW47XG4gIHJldHVybiAoTWF0aC50YW4oMC41ICogKEhBTEZfUEkgKyBwaGl0KSkgKiBNYXRoLnBvdygoMSAtIHNpbnBoaSkgLyAoMSArIHNpbnBoaSksIDAuNSAqIGVjY2VuKSk7XG59XG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gc2V0dGluZyBkZWZhdWx0IHBhcmFtZXRlcnNcbiAgdGhpcy54MCA9IHRoaXMueDAgfHwgMDtcbiAgdGhpcy55MCA9IHRoaXMueTAgfHwgMDtcbiAgdGhpcy5sYXQwID0gdGhpcy5sYXQwIHx8IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwIHx8IDA7XG5cbiAgdGhpcy5jb3NsYXQwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgdGhpcy5zaW5sYXQwID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgaWYgKHRoaXMuazAgPT09IDEgJiYgIWlzTmFOKHRoaXMubGF0X3RzKSAmJiBNYXRoLmFicyh0aGlzLmNvc2xhdDApIDw9IEVQU0xOKSB7XG4gICAgICB0aGlzLmswID0gMC41ICogKDEgKyBzaWduKHRoaXMubGF0MCkgKiBNYXRoLnNpbih0aGlzLmxhdF90cykpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8PSBFUFNMTikge1xuICAgICAgaWYgKHRoaXMubGF0MCA+IDApIHtcbiAgICAgICAgLy8gTm9ydGggcG9sZVxuICAgICAgICAvLyB0cmFjZSgnc3RlcmU6bm9ydGggcG9sZScpO1xuICAgICAgICB0aGlzLmNvbiA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTb3V0aCBwb2xlXG4gICAgICAgIC8vIHRyYWNlKCdzdGVyZTpzb3V0aCBwb2xlJyk7XG4gICAgICAgIHRoaXMuY29uID0gLTE7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ucyA9IE1hdGguc3FydChNYXRoLnBvdygxICsgdGhpcy5lLCAxICsgdGhpcy5lKSAqIE1hdGgucG93KDEgLSB0aGlzLmUsIDEgLSB0aGlzLmUpKTtcbiAgICBpZiAodGhpcy5rMCA9PT0gMSAmJiAhaXNOYU4odGhpcy5sYXRfdHMpICYmIE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4gJiYgTWF0aC5hYnMoTWF0aC5jb3ModGhpcy5sYXRfdHMpKSA+IEVQU0xOKSB7XG4gICAgICAvLyBXaGVuIGswIGlzIDEgKGRlZmF1bHQgdmFsdWUpIGFuZCBsYXRfdHMgaXMgYSB2YWlsZCBudW1iZXIgYW5kIGxhdDAgaXMgYXQgYSBwb2xlIGFuZCBsYXRfdHMgaXMgbm90IGF0IGEgcG9sZVxuICAgICAgLy8gUmVjYWxjdWxhdGUgazAgdXNpbmcgZm9ybXVsYSAyMS0zNSBmcm9tIHAxNjEgb2YgU255ZGVyLCAxOTg3XG4gICAgICB0aGlzLmswID0gMC41ICogdGhpcy5jb25zICogbXNmbnoodGhpcy5lLCBNYXRoLnNpbih0aGlzLmxhdF90cyksIE1hdGguY29zKHRoaXMubGF0X3RzKSkgLyB0c2Zueih0aGlzLmUsIHRoaXMuY29uICogdGhpcy5sYXRfdHMsIHRoaXMuY29uICogTWF0aC5zaW4odGhpcy5sYXRfdHMpKTtcbiAgICB9XG4gICAgdGhpcy5tczEgPSBtc2Zueih0aGlzLmUsIHRoaXMuc2lubGF0MCwgdGhpcy5jb3NsYXQwKTtcbiAgICB0aGlzLlgwID0gMiAqIE1hdGguYXRhbihzc2ZuXyh0aGlzLmxhdDAsIHRoaXMuc2lubGF0MCwgdGhpcy5lKSkgLSBIQUxGX1BJO1xuICAgIHRoaXMuY29zWDAgPSBNYXRoLmNvcyh0aGlzLlgwKTtcbiAgICB0aGlzLnNpblgwID0gTWF0aC5zaW4odGhpcy5YMCk7XG4gIH1cbn1cblxuLy8gU3RlcmVvZ3JhcGhpYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHNpbmxhdCA9IE1hdGguc2luKGxhdCk7XG4gIHZhciBjb3NsYXQgPSBNYXRoLmNvcyhsYXQpO1xuICB2YXIgQSwgWCwgc2luWCwgY29zWCwgdHMsIHJoO1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcblxuICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMobG9uIC0gdGhpcy5sb25nMCkgLSBNYXRoLlBJKSA8PSBFUFNMTiAmJiBNYXRoLmFicyhsYXQgKyB0aGlzLmxhdDApIDw9IEVQU0xOKSB7XG4gICAgLy8gY2FzZSBvZiB0aGUgb3JpZ2luZSBwb2ludFxuICAgIC8vIHRyYWNlKCdzdGVyZTp0aGlzIGlzIHRoZSBvcmlnaW4gcG9pbnQnKTtcbiAgICBwLnggPSBOYU47XG4gICAgcC55ID0gTmFOO1xuICAgIHJldHVybiBwO1xuICB9XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIC8vIHRyYWNlKCdzdGVyZTpzcGhlcmUgY2FzZScpO1xuICAgIEEgPSAyICogdGhpcy5rMCAvICgxICsgdGhpcy5zaW5sYXQwICogc2lubGF0ICsgdGhpcy5jb3NsYXQwICogY29zbGF0ICogTWF0aC5jb3MoZGxvbikpO1xuICAgIHAueCA9IHRoaXMuYSAqIEEgKiBjb3NsYXQgKiBNYXRoLnNpbihkbG9uKSArIHRoaXMueDA7XG4gICAgcC55ID0gdGhpcy5hICogQSAqICh0aGlzLmNvc2xhdDAgKiBzaW5sYXQgLSB0aGlzLnNpbmxhdDAgKiBjb3NsYXQgKiBNYXRoLmNvcyhkbG9uKSkgKyB0aGlzLnkwO1xuICAgIHJldHVybiBwO1xuICB9IGVsc2Uge1xuICAgIFggPSAyICogTWF0aC5hdGFuKHNzZm5fKGxhdCwgc2lubGF0LCB0aGlzLmUpKSAtIEhBTEZfUEk7XG4gICAgY29zWCA9IE1hdGguY29zKFgpO1xuICAgIHNpblggPSBNYXRoLnNpbihYKTtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8PSBFUFNMTikge1xuICAgICAgdHMgPSB0c2Zueih0aGlzLmUsIGxhdCAqIHRoaXMuY29uLCB0aGlzLmNvbiAqIHNpbmxhdCk7XG4gICAgICByaCA9IDIgKiB0aGlzLmEgKiB0aGlzLmswICogdHMgLyB0aGlzLmNvbnM7XG4gICAgICBwLnggPSB0aGlzLngwICsgcmggKiBNYXRoLnNpbihsb24gLSB0aGlzLmxvbmcwKTtcbiAgICAgIHAueSA9IHRoaXMueTAgLSB0aGlzLmNvbiAqIHJoICogTWF0aC5jb3MobG9uIC0gdGhpcy5sb25nMCk7XG4gICAgICAvLyB0cmFjZShwLnRvU3RyaW5nKCkpO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbmxhdDApIDwgRVBTTE4pIHtcbiAgICAgIC8vIEVxXG4gICAgICAvLyB0cmFjZSgnc3RlcmU6ZXF1YXRldXInKTtcbiAgICAgIEEgPSAyICogdGhpcy5hICogdGhpcy5rMCAvICgxICsgY29zWCAqIE1hdGguY29zKGRsb24pKTtcbiAgICAgIHAueSA9IEEgKiBzaW5YO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlciBjYXNlXG4gICAgICAvLyB0cmFjZSgnc3RlcmU6bm9ybWFsIGNhc2UnKTtcbiAgICAgIEEgPSAyICogdGhpcy5hICogdGhpcy5rMCAqIHRoaXMubXMxIC8gKHRoaXMuY29zWDAgKiAoMSArIHRoaXMuc2luWDAgKiBzaW5YICsgdGhpcy5jb3NYMCAqIGNvc1ggKiBNYXRoLmNvcyhkbG9uKSkpO1xuICAgICAgcC55ID0gQSAqICh0aGlzLmNvc1gwICogc2luWCAtIHRoaXMuc2luWDAgKiBjb3NYICogTWF0aC5jb3MoZGxvbikpICsgdGhpcy55MDtcbiAgICB9XG4gICAgcC54ID0gQSAqIGNvc1ggKiBNYXRoLnNpbihkbG9uKSArIHRoaXMueDA7XG4gIH1cbiAgLy8gdHJhY2UocC50b1N0cmluZygpKTtcbiAgcmV0dXJuIHA7XG59XG5cbi8vKiBTdGVyZW9ncmFwaGljIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciBsb24sIGxhdCwgdHMsIGNlLCBDaGk7XG4gIHZhciByaCA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4ocmggLyAoMiAqIHRoaXMuYSAqIHRoaXMuazApKTtcbiAgICBsb24gPSB0aGlzLmxvbmcwO1xuICAgIGxhdCA9IHRoaXMubGF0MDtcbiAgICBpZiAocmggPD0gRVBTTE4pIHtcbiAgICAgIHAueCA9IGxvbjtcbiAgICAgIHAueSA9IGxhdDtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBsYXQgPSBNYXRoLmFzaW4oTWF0aC5jb3MoYykgKiB0aGlzLnNpbmxhdDAgKyBwLnkgKiBNYXRoLnNpbihjKSAqIHRoaXMuY29zbGF0MCAvIHJoKTtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8IEVQU0xOKSB7XG4gICAgICBpZiAodGhpcy5sYXQwID4gMCkge1xuICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgLTEgKiBwLnkpLCB0aGlzLm92ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIHAueSksIHRoaXMub3Zlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54ICogTWF0aC5zaW4oYyksIHJoICogdGhpcy5jb3NsYXQwICogTWF0aC5jb3MoYykgLSBwLnkgKiB0aGlzLnNpbmxhdDAgKiBNYXRoLnNpbihjKSksIHRoaXMub3Zlcik7XG4gICAgfVxuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIGlmIChyaCA8PSBFUFNMTikge1xuICAgICAgICBsYXQgPSB0aGlzLmxhdDA7XG4gICAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgICAgIHAueCA9IGxvbjtcbiAgICAgICAgcC55ID0gbGF0O1xuICAgICAgICAvLyB0cmFjZShwLnRvU3RyaW5nKCkpO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH1cbiAgICAgIHAueCAqPSB0aGlzLmNvbjtcbiAgICAgIHAueSAqPSB0aGlzLmNvbjtcbiAgICAgIHRzID0gcmggKiB0aGlzLmNvbnMgLyAoMiAqIHRoaXMuYSAqIHRoaXMuazApO1xuICAgICAgbGF0ID0gdGhpcy5jb24gKiBwaGkyeih0aGlzLmUsIHRzKTtcbiAgICAgIGxvbiA9IHRoaXMuY29uICogYWRqdXN0X2xvbih0aGlzLmNvbiAqIHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgLTEgKiBwLnkpLCB0aGlzLm92ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZSA9IDIgKiBNYXRoLmF0YW4ocmggKiB0aGlzLmNvc1gwIC8gKDIgKiB0aGlzLmEgKiB0aGlzLmswICogdGhpcy5tczEpKTtcbiAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgICBpZiAocmggPD0gRVBTTE4pIHtcbiAgICAgICAgQ2hpID0gdGhpcy5YMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIENoaSA9IE1hdGguYXNpbihNYXRoLmNvcyhjZSkgKiB0aGlzLnNpblgwICsgcC55ICogTWF0aC5zaW4oY2UpICogdGhpcy5jb3NYMCAvIHJoKTtcbiAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLnggKiBNYXRoLnNpbihjZSksIHJoICogdGhpcy5jb3NYMCAqIE1hdGguY29zKGNlKSAtIHAueSAqIHRoaXMuc2luWDAgKiBNYXRoLnNpbihjZSkpLCB0aGlzLm92ZXIpO1xuICAgICAgfVxuICAgICAgbGF0ID0gLTEgKiBwaGkyeih0aGlzLmUsIE1hdGgudGFuKDAuNSAqIChIQUxGX1BJICsgQ2hpKSkpO1xuICAgIH1cbiAgfVxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcblxuICAvLyB0cmFjZShwLnRvU3RyaW5nKCkpO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnc3RlcmUnLCAnU3RlcmVvZ3JhcGhpY19Tb3V0aF9Qb2xlJywgJ1BvbGFyX1N0ZXJlb2dyYXBoaWNfdmFyaWFudF9BJywgJ1BvbGFyX1N0ZXJlb2dyYXBoaWNfdmFyaWFudF9CJywgJ1BvbGFyX1N0ZXJlb2dyYXBoaWMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzLFxuICBzc2ZuXzogc3Nmbl9cbn07XG4iLCJpbXBvcnQgZ2F1c3MgZnJvbSAnLi9nYXVzcyc7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgaHlwb3QgZnJvbSAnLi4vY29tbW9uL2h5cG90JztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaW5jMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc2MwXG4gKiBAcHJvcGVydHkge251bWJlcn0gUjJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByY1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHBoaWMwXG4gKi9cblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBnYXVzcy5pbml0LmFwcGx5KHRoaXMpO1xuICBpZiAoIXRoaXMucmMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5zaW5jMCA9IE1hdGguc2luKHRoaXMucGhpYzApO1xuICB0aGlzLmNvc2MwID0gTWF0aC5jb3ModGhpcy5waGljMCk7XG4gIHRoaXMuUjIgPSAyICogdGhpcy5yYztcbiAgaWYgKCF0aGlzLnRpdGxlKSB7XG4gICAgdGhpcy50aXRsZSA9ICdPYmxpcXVlIFN0ZXJlb2dyYXBoaWMgQWx0ZXJuYXRpdmUnO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHNpbmMsIGNvc2MsIGNvc2wsIGs7XG4gIHAueCA9IGFkanVzdF9sb24ocC54IC0gdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgZ2F1c3MuZm9yd2FyZC5hcHBseSh0aGlzLCBbcF0pO1xuICBzaW5jID0gTWF0aC5zaW4ocC55KTtcbiAgY29zYyA9IE1hdGguY29zKHAueSk7XG4gIGNvc2wgPSBNYXRoLmNvcyhwLngpO1xuICBrID0gdGhpcy5rMCAqIHRoaXMuUjIgLyAoMSArIHRoaXMuc2luYzAgKiBzaW5jICsgdGhpcy5jb3NjMCAqIGNvc2MgKiBjb3NsKTtcbiAgcC54ID0gayAqIGNvc2MgKiBNYXRoLnNpbihwLngpO1xuICBwLnkgPSBrICogKHRoaXMuY29zYzAgKiBzaW5jIC0gdGhpcy5zaW5jMCAqIGNvc2MgKiBjb3NsKTtcbiAgcC54ID0gdGhpcy5hICogcC54ICsgdGhpcy54MDtcbiAgcC55ID0gdGhpcy5hICogcC55ICsgdGhpcy55MDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHNpbmMsIGNvc2MsIGxvbiwgbGF0LCByaG87XG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG4gIHAueCAvPSB0aGlzLmswO1xuICBwLnkgLz0gdGhpcy5rMDtcbiAgaWYgKChyaG8gPSBoeXBvdChwLngsIHAueSkpKSB7XG4gICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihyaG8sIHRoaXMuUjIpO1xuICAgIHNpbmMgPSBNYXRoLnNpbihjKTtcbiAgICBjb3NjID0gTWF0aC5jb3MoYyk7XG4gICAgbGF0ID0gTWF0aC5hc2luKGNvc2MgKiB0aGlzLnNpbmMwICsgcC55ICogc2luYyAqIHRoaXMuY29zYzAgLyByaG8pO1xuICAgIGxvbiA9IE1hdGguYXRhbjIocC54ICogc2luYywgcmhvICogdGhpcy5jb3NjMCAqIGNvc2MgLSBwLnkgKiB0aGlzLnNpbmMwICogc2luYyk7XG4gIH0gZWxzZSB7XG4gICAgbGF0ID0gdGhpcy5waGljMDtcbiAgICBsb24gPSAwO1xuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIGdhdXNzLmludmVyc2UuYXBwbHkodGhpcywgW3BdKTtcbiAgcC54ID0gYWRqdXN0X2xvbihwLnggKyB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnU3RlcmVvZ3JhcGhpY19Ob3J0aF9Qb2xlJywgJ09ibGlxdWVfU3RlcmVvZ3JhcGhpYycsICdzdGVyZWEnLCAnT2JsaXF1ZSBTdGVyZW9ncmFwaGljIEFsdGVybmF0aXZlJywgJ0RvdWJsZV9TdGVyZW9ncmFwaGljJ107XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIi8vIEhlYXZpbHkgYmFzZWQgb24gdGhpcyB0bWVyYyBwcm9qZWN0aW9uIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWJsb2NoL21hcHNoYXBlci1wcm9qL2Jsb2IvbWFzdGVyL3NyYy9wcm9qZWN0aW9ucy90bWVyYy5qc1xuXG5pbXBvcnQgcGpfZW5mbiBmcm9tICcuLi9jb21tb24vcGpfZW5mbic7XG5pbXBvcnQgcGpfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfbWxmbic7XG5pbXBvcnQgcGpfaW52X21sZm4gZnJvbSAnLi4vY29tbW9uL3BqX2ludl9tbGZuJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuaW1wb3J0IHsgRVBTTE4sIEhBTEZfUEkgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBzaWduIGZyb20gJy4uL2NvbW1vbi9zaWduJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBlc1xuICogQHByb3BlcnR5IHtBcnJheTxudW1iZXI+fSBlblxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1sMFxuICovXG5cbi8qKiBAdGhpcyB7aW1wb3J0KCcuLi9kZWZzLmpzJykuUHJvamVjdGlvbkRlZmluaXRpb24gJiBMb2NhbFRoaXN9ICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy54MCA9IHRoaXMueDAgIT09IHVuZGVmaW5lZCA/IHRoaXMueDAgOiAwO1xuICB0aGlzLnkwID0gdGhpcy55MCAhPT0gdW5kZWZpbmVkID8gdGhpcy55MCA6IDA7XG4gIHRoaXMubG9uZzAgPSB0aGlzLmxvbmcwICE9PSB1bmRlZmluZWQgPyB0aGlzLmxvbmcwIDogMDtcbiAgdGhpcy5sYXQwID0gdGhpcy5sYXQwICE9PSB1bmRlZmluZWQgPyB0aGlzLmxhdDAgOiAwO1xuXG4gIGlmICh0aGlzLmVzKSB7XG4gICAgdGhpcy5lbiA9IHBqX2VuZm4odGhpcy5lcyk7XG4gICAgdGhpcy5tbDAgPSBwal9tbGZuKHRoaXMubGF0MCwgTWF0aC5zaW4odGhpcy5sYXQwKSwgTWF0aC5jb3ModGhpcy5sYXQwKSwgdGhpcy5lbik7XG4gIH1cbn1cblxuLyoqXG4gICAgVHJhbnN2ZXJzZSBNZXJjYXRvciBGb3J3YXJkICAtIGxvbmcvbGF0IHRvIHgveVxuICAgIGxvbmcvbGF0IGluIHJhZGlhbnNcbiAgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICB2YXIgZGVsdGFfbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwLCB0aGlzLm92ZXIpO1xuICB2YXIgY29uO1xuICB2YXIgeCwgeTtcbiAgdmFyIHNpbl9waGkgPSBNYXRoLnNpbihsYXQpO1xuICB2YXIgY29zX3BoaSA9IE1hdGguY29zKGxhdCk7XG5cbiAgaWYgKCF0aGlzLmVzKSB7XG4gICAgdmFyIGIgPSBjb3NfcGhpICogTWF0aC5zaW4oZGVsdGFfbG9uKTtcblxuICAgIGlmICgoTWF0aC5hYnMoTWF0aC5hYnMoYikgLSAxKSkgPCBFUFNMTikge1xuICAgICAgcmV0dXJuICg5Myk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSAwLjUgKiB0aGlzLmEgKiB0aGlzLmswICogTWF0aC5sb2coKDEgKyBiKSAvICgxIC0gYikpICsgdGhpcy54MDtcbiAgICAgIHkgPSBjb3NfcGhpICogTWF0aC5jb3MoZGVsdGFfbG9uKSAvIE1hdGguc3FydCgxIC0gTWF0aC5wb3coYiwgMikpO1xuICAgICAgYiA9IE1hdGguYWJzKHkpO1xuXG4gICAgICBpZiAoYiA+PSAxKSB7XG4gICAgICAgIGlmICgoYiAtIDEpID4gRVBTTE4pIHtcbiAgICAgICAgICByZXR1cm4gKDkzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB5ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeSA9IE1hdGguYWNvcyh5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhdCA8IDApIHtcbiAgICAgICAgeSA9IC15O1xuICAgICAgfVxuXG4gICAgICB5ID0gdGhpcy5hICogdGhpcy5rMCAqICh5IC0gdGhpcy5sYXQwKSArIHRoaXMueTA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBhbCA9IGNvc19waGkgKiBkZWx0YV9sb247XG4gICAgdmFyIGFscyA9IE1hdGgucG93KGFsLCAyKTtcbiAgICB2YXIgYyA9IHRoaXMuZXAyICogTWF0aC5wb3coY29zX3BoaSwgMik7XG4gICAgdmFyIGNzID0gTWF0aC5wb3coYywgMik7XG4gICAgdmFyIHRxID0gTWF0aC5hYnMoY29zX3BoaSkgPiBFUFNMTiA/IE1hdGgudGFuKGxhdCkgOiAwO1xuICAgIHZhciB0ID0gTWF0aC5wb3codHEsIDIpO1xuICAgIHZhciB0cyA9IE1hdGgucG93KHQsIDIpO1xuICAgIGNvbiA9IDEgLSB0aGlzLmVzICogTWF0aC5wb3coc2luX3BoaSwgMik7XG4gICAgYWwgPSBhbCAvIE1hdGguc3FydChjb24pO1xuICAgIHZhciBtbCA9IHBqX21sZm4obGF0LCBzaW5fcGhpLCBjb3NfcGhpLCB0aGlzLmVuKTtcblxuICAgIHggPSB0aGlzLmEgKiAodGhpcy5rMCAqIGFsICogKDFcbiAgICAgICsgYWxzIC8gNiAqICgxIC0gdCArIGNcbiAgICAgICAgKyBhbHMgLyAyMCAqICg1IC0gMTggKiB0ICsgdHMgKyAxNCAqIGMgLSA1OCAqIHQgKiBjXG4gICAgICAgICAgKyBhbHMgLyA0MiAqICg2MSArIDE3OSAqIHRzIC0gdHMgKiB0IC0gNDc5ICogdCkpKSkpXG4gICAgICAgICsgdGhpcy54MDtcblxuICAgIHkgPSB0aGlzLmEgKiAodGhpcy5rMCAqIChtbCAtIHRoaXMubWwwXG4gICAgICArIHNpbl9waGkgKiBkZWx0YV9sb24gKiBhbCAvIDIgKiAoMVxuICAgICAgICArIGFscyAvIDEyICogKDUgLSB0ICsgOSAqIGMgKyA0ICogY3NcbiAgICAgICAgICArIGFscyAvIDMwICogKDYxICsgdHMgLSA1OCAqIHQgKyAyNzAgKiBjIC0gMzMwICogdCAqIGNcbiAgICAgICAgICAgICsgYWxzIC8gNTYgKiAoMTM4NSArIDU0MyAqIHRzIC0gdHMgKiB0IC0gMzExMSAqIHQpKSkpKSlcbiAgICAgICAgICArIHRoaXMueTA7XG4gIH1cblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuXG4gIHJldHVybiBwO1xufVxuXG4vKipcbiAgICBUcmFuc3ZlcnNlIE1lcmNhdG9yIEludmVyc2UgIC0gIHgveSB0byBsb25nL2xhdFxuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgY29uLCBwaGk7XG4gIHZhciBsYXQsIGxvbjtcbiAgdmFyIHggPSAocC54IC0gdGhpcy54MCkgKiAoMSAvIHRoaXMuYSk7XG4gIHZhciB5ID0gKHAueSAtIHRoaXMueTApICogKDEgLyB0aGlzLmEpO1xuXG4gIGlmICghdGhpcy5lcykge1xuICAgIHZhciBmID0gTWF0aC5leHAoeCAvIHRoaXMuazApO1xuICAgIHZhciBnID0gMC41ICogKGYgLSAxIC8gZik7XG4gICAgdmFyIHRlbXAgPSB0aGlzLmxhdDAgKyB5IC8gdGhpcy5rMDtcbiAgICB2YXIgaCA9IE1hdGguY29zKHRlbXApO1xuICAgIGNvbiA9IE1hdGguc3FydCgoMSAtIE1hdGgucG93KGgsIDIpKSAvICgxICsgTWF0aC5wb3coZywgMikpKTtcbiAgICBsYXQgPSBNYXRoLmFzaW4oY29uKTtcblxuICAgIGlmICh5IDwgMCkge1xuICAgICAgbGF0ID0gLWxhdDtcbiAgICB9XG5cbiAgICBpZiAoKGcgPT09IDApICYmIChoID09PSAwKSkge1xuICAgICAgbG9uID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbihNYXRoLmF0YW4yKGcsIGgpICsgdGhpcy5sb25nMCwgdGhpcy5vdmVyKTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGVsbGlwc29pZGFsIGZvcm1cbiAgICBjb24gPSB0aGlzLm1sMCArIHkgLyB0aGlzLmswO1xuICAgIHBoaSA9IHBqX2ludl9tbGZuKGNvbiwgdGhpcy5lcywgdGhpcy5lbik7XG5cbiAgICBpZiAoTWF0aC5hYnMocGhpKSA8IEhBTEZfUEkpIHtcbiAgICAgIHZhciBzaW5fcGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICAgIHZhciBjb3NfcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICAgIHZhciB0YW5fcGhpID0gTWF0aC5hYnMoY29zX3BoaSkgPiBFUFNMTiA/IE1hdGgudGFuKHBoaSkgOiAwO1xuICAgICAgdmFyIGMgPSB0aGlzLmVwMiAqIE1hdGgucG93KGNvc19waGksIDIpO1xuICAgICAgdmFyIGNzID0gTWF0aC5wb3coYywgMik7XG4gICAgICB2YXIgdCA9IE1hdGgucG93KHRhbl9waGksIDIpO1xuICAgICAgdmFyIHRzID0gTWF0aC5wb3codCwgMik7XG4gICAgICBjb24gPSAxIC0gdGhpcy5lcyAqIE1hdGgucG93KHNpbl9waGksIDIpO1xuICAgICAgdmFyIGQgPSB4ICogTWF0aC5zcXJ0KGNvbikgLyB0aGlzLmswO1xuICAgICAgdmFyIGRzID0gTWF0aC5wb3coZCwgMik7XG4gICAgICBjb24gPSBjb24gKiB0YW5fcGhpO1xuXG4gICAgICBsYXQgPSBwaGkgLSAoY29uICogZHMgLyAoMSAtIHRoaXMuZXMpKSAqIDAuNSAqICgxXG4gICAgICAgIC0gZHMgLyAxMiAqICg1ICsgMyAqIHQgLSA5ICogYyAqIHQgKyBjIC0gNCAqIGNzXG4gICAgICAgICAgLSBkcyAvIDMwICogKDYxICsgOTAgKiB0IC0gMjUyICogYyAqIHQgKyA0NSAqIHRzICsgNDYgKiBjXG4gICAgICAgICAgICAtIGRzIC8gNTYgKiAoMTM4NSArIDM2MzMgKiB0ICsgNDA5NSAqIHRzICsgMTU3NCAqIHRzICogdCkpKSk7XG5cbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIChkICogKDFcbiAgICAgICAgLSBkcyAvIDYgKiAoMSArIDIgKiB0ICsgY1xuICAgICAgICAgIC0gZHMgLyAyMCAqICg1ICsgMjggKiB0ICsgMjQgKiB0cyArIDggKiBjICogdCArIDYgKiBjXG4gICAgICAgICAgICAtIGRzIC8gNDIgKiAoNjEgKyA2NjIgKiB0ICsgMTMyMCAqIHRzICsgNzIwICogdHMgKiB0KSkpKSAvIGNvc19waGkpLCB0aGlzLm92ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXQgPSBIQUxGX1BJICogc2lnbih5KTtcbiAgICAgIGxvbiA9IDA7XG4gICAgfVxuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG5cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbJ0Zhc3RfVHJhbnN2ZXJzZV9NZXJjYXRvcicsICdGYXN0IFRyYW5zdmVyc2UgTWVyY2F0b3InXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHsgRDJSLCBIQUxGX1BJLCBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IGh5cG90IGZyb20gJy4uL2NvbW1vbi9oeXBvdCc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9jYWxUaGlzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbW9kZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpbnBoMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvc3BoMFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBuMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGhcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBycFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBoMVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBmYWN0XG4gKiBAcHJvcGVydHkge251bWJlcn0gZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0aWx0XG4gKiBAcHJvcGVydHkge251bWJlcn0gYXppXG4gKiBAcHJvcGVydHkge251bWJlcn0gY2dcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzZ1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGN3XG4gKiBAcHJvcGVydHkge251bWJlcn0gc3dcbiAqL1xuXG52YXIgbW9kZSA9IHtcbiAgTl9QT0xFOiAwLFxuICBTX1BPTEU6IDEsXG4gIEVRVUlUOiAyLFxuICBPQkxJUTogM1xufTtcblxudmFyIHBhcmFtcyA9IHtcbiAgaDogeyBkZWY6IDEwMDAwMCwgbnVtOiB0cnVlIH0sIC8vIGRlZmF1bHQgaXMgS2FybWFuIGxpbmUsIG5vIGRlZmF1bHQgaW4gUFJPSi43XG4gIGF6aTogeyBkZWY6IDAsIG51bTogdHJ1ZSwgZGVncmVlczogdHJ1ZSB9LCAvLyBkZWZhdWx0IGlzIE5vcnRoXG4gIHRpbHQ6IHsgZGVmOiAwLCBudW06IHRydWUsIGRlZ3JlZXM6IHRydWUgfSwgLy8gZGVmYXVsdCBpcyBOYWRpclxuICBsb25nMDogeyBkZWY6IDAsIG51bTogdHJ1ZSB9LCAvLyBkZWZhdWx0IGlzIEdyZWVud2ljaCwgY29udmVyc2lvbiB0byByYWQgaXMgYXV0b21hdGljXG4gIGxhdDA6IHsgZGVmOiAwLCBudW06IHRydWUgfSAvLyBkZWZhdWx0IGlzIEVxdWF0b3IsIGNvbnZlcnNpb24gdG8gcmFkIGlzIGF1dG9tYXRpY1xufTtcblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc30gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goZnVuY3Rpb24gKHApIHtcbiAgICBpZiAodHlwZW9mIHRoaXNbcF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzW3BdID0gcGFyYW1zW3BdLmRlZjtcbiAgICB9IGVsc2UgaWYgKHBhcmFtc1twXS5udW0gJiYgaXNOYU4odGhpc1twXSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXJhbWV0ZXIgdmFsdWUsIG11c3QgYmUgbnVtZXJpYyAnICsgcCArICcgPSAnICsgdGhpc1twXSk7XG4gICAgfSBlbHNlIGlmIChwYXJhbXNbcF0ubnVtKSB7XG4gICAgICB0aGlzW3BdID0gcGFyc2VGbG9hdCh0aGlzW3BdKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtc1twXS5kZWdyZWVzKSB7XG4gICAgICB0aGlzW3BdID0gdGhpc1twXSAqIEQyUjtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgaWYgKE1hdGguYWJzKChNYXRoLmFicyh0aGlzLmxhdDApIC0gSEFMRl9QSSkpIDwgRVBTTE4pIHtcbiAgICB0aGlzLm1vZGUgPSB0aGlzLmxhdDAgPCAwID8gbW9kZS5TX1BPTEUgOiBtb2RlLk5fUE9MRTtcbiAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLmxhdDApIDwgRVBTTE4pIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlLkVRVUlUO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubW9kZSA9IG1vZGUuT0JMSVE7XG4gICAgdGhpcy5zaW5waDAgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICAgIHRoaXMuY29zcGgwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgfVxuXG4gIHRoaXMucG4xID0gdGhpcy5oIC8gdGhpcy5hOyAvLyBOb3JtYWxpemUgcmVsYXRpdmUgdG8gdGhlIEVhcnRoJ3MgcmFkaXVzXG5cbiAgaWYgKHRoaXMucG4xIDw9IDAgfHwgdGhpcy5wbjEgPiAxZTEwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhlaWdodCcpO1xuICB9XG5cbiAgdGhpcy5wID0gMSArIHRoaXMucG4xO1xuICB0aGlzLnJwID0gMSAvIHRoaXMucDtcbiAgdGhpcy5oMSA9IDEgLyB0aGlzLnBuMTtcbiAgdGhpcy5wZmFjdCA9ICh0aGlzLnAgKyAxKSAqIHRoaXMuaDE7XG4gIHRoaXMuZXMgPSAwO1xuXG4gIHZhciBvbWVnYSA9IHRoaXMudGlsdDtcbiAgdmFyIGdhbW1hID0gdGhpcy5hemk7XG4gIHRoaXMuY2cgPSBNYXRoLmNvcyhnYW1tYSk7XG4gIHRoaXMuc2cgPSBNYXRoLnNpbihnYW1tYSk7XG4gIHRoaXMuY3cgPSBNYXRoLmNvcyhvbWVnYSk7XG4gIHRoaXMuc3cgPSBNYXRoLnNpbihvbWVnYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgcC54IC09IHRoaXMubG9uZzA7XG4gIHZhciBzaW5waGkgPSBNYXRoLnNpbihwLnkpO1xuICB2YXIgY29zcGhpID0gTWF0aC5jb3MocC55KTtcbiAgdmFyIGNvc2xhbSA9IE1hdGguY29zKHAueCk7XG4gIHZhciB4LCB5O1xuICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgIGNhc2UgbW9kZS5PQkxJUTpcbiAgICAgIHkgPSB0aGlzLnNpbnBoMCAqIHNpbnBoaSArIHRoaXMuY29zcGgwICogY29zcGhpICogY29zbGFtO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLkVRVUlUOlxuICAgICAgeSA9IGNvc3BoaSAqIGNvc2xhbTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbW9kZS5TX1BPTEU6XG4gICAgICB5ID0gLXNpbnBoaTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbW9kZS5OX1BPTEU6XG4gICAgICB5ID0gc2lucGhpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgeSA9IHRoaXMucG4xIC8gKHRoaXMucCAtIHkpO1xuICB4ID0geSAqIGNvc3BoaSAqIE1hdGguc2luKHAueCk7XG5cbiAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICBjYXNlIG1vZGUuT0JMSVE6XG4gICAgICB5ICo9IHRoaXMuY29zcGgwICogc2lucGhpIC0gdGhpcy5zaW5waDAgKiBjb3NwaGkgKiBjb3NsYW07XG4gICAgICBicmVhaztcbiAgICBjYXNlIG1vZGUuRVFVSVQ6XG4gICAgICB5ICo9IHNpbnBoaTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbW9kZS5OX1BPTEU6XG4gICAgICB5ICo9IC0oY29zcGhpICogY29zbGFtKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbW9kZS5TX1BPTEU6XG4gICAgICB5ICo9IGNvc3BoaSAqIGNvc2xhbTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gVGlsdFxuICB2YXIgeXQsIGJhO1xuICB5dCA9IHkgKiB0aGlzLmNnICsgeCAqIHRoaXMuc2c7XG4gIGJhID0gMSAvICh5dCAqIHRoaXMuc3cgKiB0aGlzLmgxICsgdGhpcy5jdyk7XG4gIHggPSAoeCAqIHRoaXMuY2cgLSB5ICogdGhpcy5zZykgKiB0aGlzLmN3ICogYmE7XG4gIHkgPSB5dCAqIGJhO1xuXG4gIHAueCA9IHggKiB0aGlzLmE7XG4gIHAueSA9IHkgKiB0aGlzLmE7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAvPSB0aGlzLmE7XG4gIHAueSAvPSB0aGlzLmE7XG4gIHZhciByID0geyB4OiBwLngsIHk6IHAueSB9O1xuXG4gIC8vIFVuLVRpbHRcbiAgdmFyIGJtLCBicSwgeXQ7XG4gIHl0ID0gMSAvICh0aGlzLnBuMSAtIHAueSAqIHRoaXMuc3cpO1xuICBibSA9IHRoaXMucG4xICogcC54ICogeXQ7XG4gIGJxID0gdGhpcy5wbjEgKiBwLnkgKiB0aGlzLmN3ICogeXQ7XG4gIHAueCA9IGJtICogdGhpcy5jZyArIGJxICogdGhpcy5zZztcbiAgcC55ID0gYnEgKiB0aGlzLmNnIC0gYm0gKiB0aGlzLnNnO1xuXG4gIHZhciByaCA9IGh5cG90KHAueCwgcC55KTtcbiAgaWYgKE1hdGguYWJzKHJoKSA8IEVQU0xOKSB7XG4gICAgci54ID0gMDtcbiAgICByLnkgPSBwLnk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNvc3osIHNpbno7XG4gICAgc2lueiA9IDEgLSByaCAqIHJoICogdGhpcy5wZmFjdDtcbiAgICBzaW56ID0gKHRoaXMucCAtIE1hdGguc3FydChzaW56KSkgLyAodGhpcy5wbjEgLyByaCArIHJoIC8gdGhpcy5wbjEpO1xuICAgIGNvc3ogPSBNYXRoLnNxcnQoMSAtIHNpbnogKiBzaW56KTtcbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSBtb2RlLk9CTElROlxuICAgICAgICByLnkgPSBNYXRoLmFzaW4oY29zeiAqIHRoaXMuc2lucGgwICsgcC55ICogc2lueiAqIHRoaXMuY29zcGgwIC8gcmgpO1xuICAgICAgICBwLnkgPSAoY29zeiAtIHRoaXMuc2lucGgwICogTWF0aC5zaW4oci55KSkgKiByaDtcbiAgICAgICAgcC54ICo9IHNpbnogKiB0aGlzLmNvc3BoMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG1vZGUuRVFVSVQ6XG4gICAgICAgIHIueSA9IE1hdGguYXNpbihwLnkgKiBzaW56IC8gcmgpO1xuICAgICAgICBwLnkgPSBjb3N6ICogcmg7XG4gICAgICAgIHAueCAqPSBzaW56O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgbW9kZS5OX1BPTEU6XG4gICAgICAgIHIueSA9IE1hdGguYXNpbihjb3N6KTtcbiAgICAgICAgcC55ID0gLXAueTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG1vZGUuU19QT0xFOlxuICAgICAgICByLnkgPSAtTWF0aC5hc2luKGNvc3opO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgci54ID0gTWF0aC5hdGFuMihwLngsIHAueSk7XG4gIH1cblxuICBwLnggPSByLnggKyB0aGlzLmxvbmcwO1xuICBwLnkgPSByLnk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydUaWx0ZWRfUGVyc3BlY3RpdmUnLCAndHBlcnMnXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF96b25lIGZyb20gJy4uL2NvbW1vbi9hZGp1c3Rfem9uZSc7XG5pbXBvcnQgZXRtZXJjIGZyb20gJy4vZXRtZXJjJztcbmV4cG9ydCB2YXIgZGVwZW5kc09uID0gJ2V0bWVyYyc7XG5pbXBvcnQgeyBEMlIgfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuLyoqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgem9uZSA9IGFkanVzdF96b25lKHRoaXMuem9uZSwgdGhpcy5sb25nMCk7XG4gIGlmICh6b25lID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gdXRtIHpvbmUnKTtcbiAgfVxuICB0aGlzLmxhdDAgPSAwO1xuICB0aGlzLmxvbmcwID0gKCg2ICogTWF0aC5hYnMoem9uZSkpIC0gMTgzKSAqIEQyUjtcbiAgdGhpcy54MCA9IDUwMDAwMDtcbiAgdGhpcy55MCA9IHRoaXMudXRtU291dGggPyAxMDAwMDAwMCA6IDA7XG4gIHRoaXMuazAgPSAwLjk5OTY7XG5cbiAgZXRtZXJjLmluaXQuYXBwbHkodGhpcyk7XG4gIHRoaXMuZm9yd2FyZCA9IGV0bWVyYy5mb3J3YXJkO1xuICB0aGlzLmludmVyc2UgPSBldG1lcmMuaW52ZXJzZTtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFsnVW5pdmVyc2FsIFRyYW5zdmVyc2UgTWVyY2F0b3IgU3lzdGVtJywgJ3V0bSddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBuYW1lczogbmFtZXMsXG4gIGRlcGVuZHNPbjogZGVwZW5kc09uXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG5pbXBvcnQgeyBIQUxGX1BJLCBFUFNMTiB9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2NhbFRoaXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBSIC0gUmFkaXVzIG9mIHRoZSBFYXJ0aFxuICovXG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgVmFuIERlciBHcmludGVuIHByb2plY3Rpb25cbiAqIEB0aGlzIHtpbXBvcnQoJy4uL2RlZnMuanMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbiAmIExvY2FsVGhpc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIHRoaXMuUiA9IDYzNzA5OTc7IC8vUmFkaXVzIG9mIGVhcnRoXG4gIHRoaXMuUiA9IHRoaXMuYTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzAsIHRoaXMub3Zlcik7XG4gIHZhciB4LCB5O1xuXG4gIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLlIgKiBkbG9uO1xuICAgIHkgPSB0aGlzLnkwO1xuICB9XG4gIHZhciB0aGV0YSA9IGFzaW56KDIgKiBNYXRoLmFicyhsYXQgLyBNYXRoLlBJKSk7XG4gIGlmICgoTWF0aC5hYnMoZGxvbikgPD0gRVBTTE4pIHx8IChNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSkgPD0gRVBTTE4pKSB7XG4gICAgeCA9IHRoaXMueDA7XG4gICAgaWYgKGxhdCA+PSAwKSB7XG4gICAgICB5ID0gdGhpcy55MCArIE1hdGguUEkgKiB0aGlzLlIgKiBNYXRoLnRhbigwLjUgKiB0aGV0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHkgPSB0aGlzLnkwICsgTWF0aC5QSSAqIHRoaXMuUiAqIC1NYXRoLnRhbigwLjUgKiB0aGV0YSk7XG4gICAgfVxuICAgIC8vICByZXR1cm4oT0spO1xuICB9XG4gIHZhciBhbCA9IDAuNSAqIE1hdGguYWJzKChNYXRoLlBJIC8gZGxvbikgLSAoZGxvbiAvIE1hdGguUEkpKTtcbiAgdmFyIGFzcSA9IGFsICogYWw7XG4gIHZhciBzaW50aCA9IE1hdGguc2luKHRoZXRhKTtcbiAgdmFyIGNvc3RoID0gTWF0aC5jb3ModGhldGEpO1xuXG4gIHZhciBnID0gY29zdGggLyAoc2ludGggKyBjb3N0aCAtIDEpO1xuICB2YXIgZ3NxID0gZyAqIGc7XG4gIHZhciBtID0gZyAqICgyIC8gc2ludGggLSAxKTtcbiAgdmFyIG1zcSA9IG0gKiBtO1xuICB2YXIgY29uID0gTWF0aC5QSSAqIHRoaXMuUiAqIChhbCAqIChnIC0gbXNxKSArIE1hdGguc3FydChhc3EgKiAoZyAtIG1zcSkgKiAoZyAtIG1zcSkgLSAobXNxICsgYXNxKSAqIChnc3EgLSBtc3EpKSkgLyAobXNxICsgYXNxKTtcbiAgaWYgKGRsb24gPCAwKSB7XG4gICAgY29uID0gLWNvbjtcbiAgfVxuICB4ID0gdGhpcy54MCArIGNvbjtcbiAgLy8gY29uID0gTWF0aC5hYnMoY29uIC8gKE1hdGguUEkgKiB0aGlzLlIpKTtcbiAgdmFyIHEgPSBhc3EgKyBnO1xuICBjb24gPSBNYXRoLlBJICogdGhpcy5SICogKG0gKiBxIC0gYWwgKiBNYXRoLnNxcnQoKG1zcSArIGFzcSkgKiAoYXNxICsgMSkgLSBxICogcSkpIC8gKG1zcSArIGFzcSk7XG4gIGlmIChsYXQgPj0gMCkge1xuICAgIC8vIHkgPSB0aGlzLnkwICsgTWF0aC5QSSAqIHRoaXMuUiAqIE1hdGguc3FydCgxIC0gY29uICogY29uIC0gMiAqIGFsICogY29uKTtcbiAgICB5ID0gdGhpcy55MCArIGNvbjtcbiAgfSBlbHNlIHtcbiAgICAvLyB5ID0gdGhpcy55MCAtIE1hdGguUEkgKiB0aGlzLlIgKiBNYXRoLnNxcnQoMSAtIGNvbiAqIGNvbiAtIDIgKiBhbCAqIGNvbik7XG4gICAgeSA9IHRoaXMueTAgLSBjb247XG4gIH1cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIFZhbiBEZXIgR3JpbnRlbiBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBsb24sIGxhdDtcbiAgdmFyIHh4LCB5eSwgeHlzLCBjMSwgYzIsIGMzO1xuICB2YXIgYTE7XG4gIHZhciBtMTtcbiAgdmFyIGNvbjtcbiAgdmFyIHRoMTtcbiAgdmFyIGQ7XG5cbiAgLyogaW52ZXJzZSBlcXVhdGlvbnNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIGNvbiA9IE1hdGguUEkgKiB0aGlzLlI7XG4gIHh4ID0gcC54IC8gY29uO1xuICB5eSA9IHAueSAvIGNvbjtcbiAgeHlzID0geHggKiB4eCArIHl5ICogeXk7XG4gIGMxID0gLU1hdGguYWJzKHl5KSAqICgxICsgeHlzKTtcbiAgYzIgPSBjMSAtIDIgKiB5eSAqIHl5ICsgeHggKiB4eDtcbiAgYzMgPSAtMiAqIGMxICsgMSArIDIgKiB5eSAqIHl5ICsgeHlzICogeHlzO1xuICBkID0geXkgKiB5eSAvIGMzICsgKDIgKiBjMiAqIGMyICogYzIgLyBjMyAvIGMzIC8gYzMgLSA5ICogYzEgKiBjMiAvIGMzIC8gYzMpIC8gMjc7XG4gIGExID0gKGMxIC0gYzIgKiBjMiAvIDMgLyBjMykgLyBjMztcbiAgbTEgPSAyICogTWF0aC5zcXJ0KC1hMSAvIDMpO1xuICBjb24gPSAoKDMgKiBkKSAvIGExKSAvIG0xO1xuICBpZiAoTWF0aC5hYnMoY29uKSA+IDEpIHtcbiAgICBpZiAoY29uID49IDApIHtcbiAgICAgIGNvbiA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbiA9IC0xO1xuICAgIH1cbiAgfVxuICB0aDEgPSBNYXRoLmFjb3MoY29uKSAvIDM7XG4gIGlmIChwLnkgPj0gMCkge1xuICAgIGxhdCA9ICgtbTEgKiBNYXRoLmNvcyh0aDEgKyBNYXRoLlBJIC8gMykgLSBjMiAvIDMgLyBjMykgKiBNYXRoLlBJO1xuICB9IGVsc2Uge1xuICAgIGxhdCA9IC0oLW0xICogTWF0aC5jb3ModGgxICsgTWF0aC5QSSAvIDMpIC0gYzIgLyAzIC8gYzMpICogTWF0aC5QSTtcbiAgfVxuXG4gIGlmIChNYXRoLmFicyh4eCkgPCBFUFNMTikge1xuICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gIH0gZWxzZSB7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5QSSAqICh4eXMgLSAxICsgTWF0aC5zcXJ0KDEgKyAyICogKHh4ICogeHggLSB5eSAqIHl5KSArIHh5cyAqIHh5cykpIC8gMiAvIHh4LCB0aGlzLm92ZXIpO1xuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gWydWYW5fZGVyX0dyaW50ZW5fSScsICdWYW5EZXJHcmludGVuJywgJ1Zhbl9kZXJfR3JpbnRlbicsICd2YW5kZyddO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgeyBEMlIsIFIyRCwgUEpEXzNQQVJBTSwgUEpEXzdQQVJBTSwgUEpEX0dSSURTSElGVCB9IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgZGF0dW1fdHJhbnNmb3JtIGZyb20gJy4vZGF0dW1fdHJhbnNmb3JtJztcbmltcG9ydCBhZGp1c3RfYXhpcyBmcm9tICcuL2FkanVzdF9heGlzJztcbmltcG9ydCBwcm9qIGZyb20gJy4vUHJvaic7XG5pbXBvcnQgdG9Qb2ludCBmcm9tICcuL2NvbW1vbi90b1BvaW50JztcbmltcG9ydCBjaGVja1Nhbml0eSBmcm9tICcuL2NoZWNrU2FuaXR5JztcblxuZnVuY3Rpb24gY2hlY2tOb3RXR1Moc291cmNlLCBkZXN0KSB7XG4gIHJldHVybiAoXG4gICAgKHNvdXJjZS5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfM1BBUkFNIHx8IHNvdXJjZS5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfN1BBUkFNIHx8IHNvdXJjZS5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfR1JJRFNISUZUKSAmJiBkZXN0LmRhdHVtQ29kZSAhPT0gJ1dHUzg0JylcbiAgfHwgKChkZXN0LmRhdHVtLmRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0gfHwgZGVzdC5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfN1BBUkFNIHx8IGRlc3QuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEX0dSSURTSElGVCkgJiYgc291cmNlLmRhdHVtQ29kZSAhPT0gJ1dHUzg0Jyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtpbXBvcnQoJy4vZGVmcycpLlByb2plY3Rpb25EZWZpbml0aW9ufSBzb3VyY2VcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2RlZnMnKS5Qcm9qZWN0aW9uRGVmaW5pdGlvbn0gZGVzdFxuICogQHBhcmFtIHtpbXBvcnQoJy4vY29yZScpLlRlbXBsYXRlQ29vcmRpbmF0ZXN9IHBvaW50XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGVuZm9yY2VBeGlzXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL2NvcmUnKS5JbnRlcmZhY2VDb29yZGluYXRlcyB8IHVuZGVmaW5lZH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNmb3JtKHNvdXJjZSwgZGVzdCwgcG9pbnQsIGVuZm9yY2VBeGlzKSB7XG4gIHZhciB3Z3M4NDtcbiAgaWYgKEFycmF5LmlzQXJyYXkocG9pbnQpKSB7XG4gICAgcG9pbnQgPSB0b1BvaW50KHBvaW50KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDbG9uZSB0aGUgcG9pbnQgb2JqZWN0IHNvIGlucHV0cyBkb24ndCBnZXQgbW9kaWZpZWRcbiAgICBwb2ludCA9IHtcbiAgICAgIHg6IHBvaW50LngsXG4gICAgICB5OiBwb2ludC55LFxuICAgICAgejogcG9pbnQueixcbiAgICAgIG06IHBvaW50Lm1cbiAgICB9O1xuICB9XG4gIHZhciBoYXNaID0gcG9pbnQueiAhPT0gdW5kZWZpbmVkO1xuICBjaGVja1Nhbml0eShwb2ludCk7XG4gIC8vIFdvcmthcm91bmQgZm9yIGRhdHVtIHNoaWZ0cyB0b3dnczg0LCBpZiBlaXRoZXIgc291cmNlIG9yIGRlc3RpbmF0aW9uIHByb2plY3Rpb24gaXMgbm90IHdnczg0XG4gIGlmIChzb3VyY2UuZGF0dW0gJiYgZGVzdC5kYXR1bSAmJiBjaGVja05vdFdHUyhzb3VyY2UsIGRlc3QpKSB7XG4gICAgd2dzODQgPSBuZXcgcHJvaignV0dTODQnKTtcbiAgICBwb2ludCA9IHRyYW5zZm9ybShzb3VyY2UsIHdnczg0LCBwb2ludCwgZW5mb3JjZUF4aXMpO1xuICAgIHNvdXJjZSA9IHdnczg0O1xuICB9XG4gIC8vIERHUiwgMjAxMC8xMS8xMlxuICBpZiAoZW5mb3JjZUF4aXMgJiYgc291cmNlLmF4aXMgIT09ICdlbnUnKSB7XG4gICAgcG9pbnQgPSBhZGp1c3RfYXhpcyhzb3VyY2UsIGZhbHNlLCBwb2ludCk7XG4gIH1cbiAgLy8gVHJhbnNmb3JtIHNvdXJjZSBwb2ludHMgdG8gbG9uZy9sYXQsIGlmIHRoZXkgYXJlbid0IGFscmVhZHkuXG4gIGlmIChzb3VyY2UucHJvak5hbWUgPT09ICdsb25nbGF0Jykge1xuICAgIHBvaW50ID0ge1xuICAgICAgeDogcG9pbnQueCAqIEQyUixcbiAgICAgIHk6IHBvaW50LnkgKiBEMlIsXG4gICAgICB6OiBwb2ludC56IHx8IDBcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGlmIChzb3VyY2UudG9fbWV0ZXIpIHtcbiAgICAgIHBvaW50ID0ge1xuICAgICAgICB4OiBwb2ludC54ICogc291cmNlLnRvX21ldGVyLFxuICAgICAgICB5OiBwb2ludC55ICogc291cmNlLnRvX21ldGVyLFxuICAgICAgICB6OiBwb2ludC56IHx8IDBcbiAgICAgIH07XG4gICAgfVxuICAgIHBvaW50ID0gc291cmNlLmludmVyc2UocG9pbnQpOyAvLyBDb252ZXJ0IENhcnRlc2lhbiB0byBsb25nbGF0XG4gICAgaWYgKCFwb2ludCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICAvLyBBZGp1c3QgZm9yIHRoZSBwcmltZSBtZXJpZGlhbiBpZiBuZWNlc3NhcnlcbiAgaWYgKHNvdXJjZS5mcm9tX2dyZWVud2ljaCkge1xuICAgIHBvaW50LnggKz0gc291cmNlLmZyb21fZ3JlZW53aWNoO1xuICB9XG5cbiAgLy8gQ29udmVydCBkYXR1bXMgaWYgbmVlZGVkLCBhbmQgaWYgcG9zc2libGUuXG4gIHBvaW50ID0gZGF0dW1fdHJhbnNmb3JtKHNvdXJjZS5kYXR1bSwgZGVzdC5kYXR1bSwgcG9pbnQpO1xuICBpZiAoIXBvaW50KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcG9pbnQgPSAvKiogQHR5cGUge2ltcG9ydCgnLi9jb3JlJykuSW50ZXJmYWNlQ29vcmRpbmF0ZXN9ICovIChwb2ludCk7XG5cbiAgLy8gQWRqdXN0IGZvciB0aGUgcHJpbWUgbWVyaWRpYW4gaWYgbmVjZXNzYXJ5XG4gIGlmIChkZXN0LmZyb21fZ3JlZW53aWNoKSB7XG4gICAgcG9pbnQgPSB7XG4gICAgICB4OiBwb2ludC54IC0gZGVzdC5mcm9tX2dyZWVud2ljaCxcbiAgICAgIHk6IHBvaW50LnksXG4gICAgICB6OiBwb2ludC56IHx8IDBcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRlc3QucHJvak5hbWUgPT09ICdsb25nbGF0Jykge1xuICAgIC8vIGNvbnZlcnQgcmFkaWFucyB0byBkZWNpbWFsIGRlZ3JlZXNcbiAgICBwb2ludCA9IHtcbiAgICAgIHg6IHBvaW50LnggKiBSMkQsXG4gICAgICB5OiBwb2ludC55ICogUjJELFxuICAgICAgejogcG9pbnQueiB8fCAwXG4gICAgfTtcbiAgfSBlbHNlIHsgLy8gZWxzZSBwcm9qZWN0XG4gICAgcG9pbnQgPSBkZXN0LmZvcndhcmQocG9pbnQpO1xuICAgIGlmIChkZXN0LnRvX21ldGVyKSB7XG4gICAgICBwb2ludCA9IHtcbiAgICAgICAgeDogcG9pbnQueCAvIGRlc3QudG9fbWV0ZXIsXG4gICAgICAgIHk6IHBvaW50LnkgLyBkZXN0LnRvX21ldGVyLFxuICAgICAgICB6OiBwb2ludC56IHx8IDBcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLy8gREdSLCAyMDEwLzExLzEyXG4gIGlmIChlbmZvcmNlQXhpcyAmJiBkZXN0LmF4aXMgIT09ICdlbnUnKSB7XG4gICAgcmV0dXJuIGFkanVzdF9heGlzKGRlc3QsIHRydWUsIHBvaW50KTtcbiAgfVxuXG4gIGlmIChwb2ludCAmJiAhaGFzWikge1xuICAgIGRlbGV0ZSBwb2ludC56O1xuICB9XG4gIHJldHVybiBwb2ludDtcbn1cbiIsImltcG9ydCB0bWVyYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy90bWVyYyc7XG5pbXBvcnQgZXRtZXJjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2V0bWVyYyc7XG5pbXBvcnQgdXRtIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3V0bSc7XG5pbXBvcnQgc3RlcmVhIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3N0ZXJlYSc7XG5pbXBvcnQgc3RlcmUgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvc3RlcmUnO1xuaW1wb3J0IHNvbWVyYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9zb21lcmMnO1xuaW1wb3J0IG9tZXJjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL29tZXJjJztcbmltcG9ydCBsY2MgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbGNjJztcbmltcG9ydCBrcm92YWsgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMva3JvdmFrJztcbmltcG9ydCBjYXNzIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2Nhc3MnO1xuaW1wb3J0IGxhZWEgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbGFlYSc7XG5pbXBvcnQgYWVhIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2FlYSc7XG5pbXBvcnQgZ25vbSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9nbm9tJztcbmltcG9ydCBjZWEgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvY2VhJztcbmltcG9ydCBlcWMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZXFjJztcbmltcG9ydCBwb2x5IGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3BvbHknO1xuaW1wb3J0IG56bWcgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbnptZyc7XG5pbXBvcnQgbWlsbCBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9taWxsJztcbmltcG9ydCBzaW51IGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3NpbnUnO1xuaW1wb3J0IG1vbGwgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbW9sbCc7XG5pbXBvcnQgZXFkYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9lcWRjJztcbmltcG9ydCB2YW5kZyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy92YW5kZyc7XG5pbXBvcnQgYWVxZCBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9hZXFkJztcbmltcG9ydCBvcnRobyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9vcnRobyc7XG5pbXBvcnQgcXNjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3FzYyc7XG5pbXBvcnQgcm9iaW4gZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvcm9iaW4nO1xuaW1wb3J0IGdlb2NlbnQgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZ2VvY2VudCc7XG5pbXBvcnQgdHBlcnMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvdHBlcnMnO1xuaW1wb3J0IGdlb3MgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZ2Vvcyc7XG5pbXBvcnQgZXFlYXJ0aCBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9lcWVhcnRoJztcbmltcG9ydCBib25uZSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9ib25uZSc7XG5pbXBvcnQgb2JfdHJhbiBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9vYl90cmFuJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwcm9qNCkge1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZCh0bWVyYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGV0bWVyYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHV0bSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHN0ZXJlYSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHN0ZXJlKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoc29tZXJjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQob21lcmMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChsY2MpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChrcm92YWspO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChjYXNzKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobGFlYSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGFlYSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGdub20pO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChjZWEpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChlcWMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChwb2x5KTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobnptZyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG1pbGwpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChzaW51KTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobW9sbCk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGVxZGMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZCh2YW5kZyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGFlcWQpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChvcnRobyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHFzYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHJvYmluKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZ2VvY2VudCk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHRwZXJzKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZ2Vvcyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGVxZWFydGgpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChib25uZSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG9iX3RyYW4pO1xufVxuIiwiaW1wb3J0IFBST0pKU09OQnVpbGRlckJhc2UgZnJvbSAnLi9QUk9KSlNPTkJ1aWxkZXJCYXNlLmpzJztcblxuY2xhc3MgUFJPSkpTT05CdWlsZGVyMjAxNSBleHRlbmRzIFBST0pKU09OQnVpbGRlckJhc2Uge1xuICBzdGF0aWMgY29udmVydChub2RlLCByZXN1bHQgPSB7fSkge1xuICAgIHN1cGVyLmNvbnZlcnQobm9kZSwgcmVzdWx0KTtcblxuICAgIC8vIFNraXAgYENTYCBhbmQgYFVTQUdFYCBub2RlcyBmb3IgV0tUMi0yMDE1XG4gICAgaWYgKHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbSAmJiByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0uc3VidHlwZSA9PT0gJ0NhcnRlc2lhbicpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW07XG4gICAgfVxuICAgIGlmIChyZXN1bHQudXNhZ2UpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQudXNhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQUk9KSlNPTkJ1aWxkZXIyMDE1OyIsImltcG9ydCBQUk9KSlNPTkJ1aWxkZXJCYXNlIGZyb20gJy4vUFJPSkpTT05CdWlsZGVyQmFzZS5qcyc7XG5cbmNsYXNzIFBST0pKU09OQnVpbGRlcjIwMTkgZXh0ZW5kcyBQUk9KSlNPTkJ1aWxkZXJCYXNlIHtcbiAgc3RhdGljIGNvbnZlcnQobm9kZSwgcmVzdWx0ID0ge30pIHtcbiAgICBzdXBlci5jb252ZXJ0KG5vZGUsIHJlc3VsdCk7XG5cbiAgICAvLyBIYW5kbGUgYENTYCBub2RlIGZvciBXS1QyLTIwMTlcbiAgICBjb25zdCBjc05vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0NTJyk7XG4gICAgaWYgKGNzTm9kZSkge1xuICAgICAgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtID0ge1xuICAgICAgICBzdWJ0eXBlOiBjc05vZGVbMV0sXG4gICAgICAgIGF4aXM6IHRoaXMuZXh0cmFjdEF4ZXMobm9kZSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBgVVNBR0VgIG5vZGUgZm9yIFdLVDItMjAxOVxuICAgIGNvbnN0IHVzYWdlTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnVVNBR0UnKTtcbiAgICBpZiAodXNhZ2VOb2RlKSB7XG4gICAgICBjb25zdCBzY29wZSA9IHVzYWdlTm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdTQ09QRScpO1xuICAgICAgY29uc3QgYXJlYSA9IHVzYWdlTm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdBUkVBJyk7XG4gICAgICBjb25zdCBiYm94ID0gdXNhZ2VOb2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0JCT1gnKTtcbiAgICAgIHJlc3VsdC51c2FnZSA9IHt9O1xuICAgICAgaWYgKHNjb3BlKSB7XG4gICAgICAgIHJlc3VsdC51c2FnZS5zY29wZSA9IHNjb3BlWzFdO1xuICAgICAgfVxuICAgICAgaWYgKGFyZWEpIHtcbiAgICAgICAgcmVzdWx0LnVzYWdlLmFyZWEgPSBhcmVhWzFdO1xuICAgICAgfVxuICAgICAgaWYgKGJib3gpIHtcbiAgICAgICAgcmVzdWx0LnVzYWdlLmJib3ggPSBiYm94LnNsaWNlKDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUFJPSkpTT05CdWlsZGVyMjAxOTsiLCJjbGFzcyBQUk9KSlNPTkJ1aWxkZXJCYXNlIHtcbiAgc3RhdGljIGdldElkKG5vZGUpIHtcbiAgICBjb25zdCBpZE5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0lEJyk7XG4gICAgaWYgKGlkTm9kZSAmJiBpZE5vZGUubGVuZ3RoID49IDMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGF1dGhvcml0eTogaWROb2RlWzFdLFxuICAgICAgICBjb2RlOiBwYXJzZUludChpZE5vZGVbMl0sIDEwKSxcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc3RhdGljIGNvbnZlcnRVbml0KG5vZGUsIHR5cGUgPSAndW5pdCcpIHtcbiAgICBpZiAoIW5vZGUgfHwgbm9kZS5sZW5ndGggPCAzKSB7XG4gICAgICByZXR1cm4geyB0eXBlLCBuYW1lOiAndW5rbm93bicsIGNvbnZlcnNpb25fZmFjdG9yOiBudWxsIH07XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IG5vZGVbMV07XG4gICAgY29uc3QgY29udmVyc2lvbkZhY3RvciA9IHBhcnNlRmxvYXQobm9kZVsyXSkgfHwgbnVsbDtcblxuICAgIGNvbnN0IGlkTm9kZSA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnSUQnKTtcbiAgICBjb25zdCBpZCA9IGlkTm9kZVxuICAgICAgPyB7XG4gICAgICAgIGF1dGhvcml0eTogaWROb2RlWzFdLFxuICAgICAgICBjb2RlOiBwYXJzZUludChpZE5vZGVbMl0sIDEwKSxcbiAgICAgIH1cbiAgICAgIDogbnVsbDtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlLFxuICAgICAgbmFtZSxcbiAgICAgIGNvbnZlcnNpb25fZmFjdG9yOiBjb252ZXJzaW9uRmFjdG9yLFxuICAgICAgaWQsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBjb252ZXJ0QXhpcyhub2RlKSB7XG4gICAgY29uc3QgbmFtZSA9IG5vZGVbMV0gfHwgJ1Vua25vd24nO1xuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBkaXJlY3Rpb25cbiAgICBsZXQgZGlyZWN0aW9uO1xuICAgIGNvbnN0IGFiYnJldmlhdGlvbk1hdGNoID0gbmFtZS5tYXRjaCgvXlxcKCguKVxcKSQvKTsgLy8gTWF0Y2ggYWJicmV2aWF0aW9ucyBsaWtlIFwiKEUpXCIgb3IgXCIoTilcIlxuICAgIGlmIChhYmJyZXZpYXRpb25NYXRjaCkge1xuICAgICAgLy8gVXNlIHRoZSBhYmJyZXZpYXRpb24gdG8gZGV0ZXJtaW5lIHRoZSBkaXJlY3Rpb25cbiAgICAgIGNvbnN0IGFiYnJldmlhdGlvbiA9IGFiYnJldmlhdGlvbk1hdGNoWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICBpZiAoYWJicmV2aWF0aW9uID09PSAnRScpIGRpcmVjdGlvbiA9ICdlYXN0JztcbiAgICAgIGVsc2UgaWYgKGFiYnJldmlhdGlvbiA9PT0gJ04nKSBkaXJlY3Rpb24gPSAnbm9ydGgnO1xuICAgICAgZWxzZSBpZiAoYWJicmV2aWF0aW9uID09PSAnVScpIGRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICBlbHNlIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBheGlzIGFiYnJldmlhdGlvbjogJHthYmJyZXZpYXRpb259YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVzZSB0aGUgZXhwbGljaXQgZGlyZWN0aW9uIHByb3ZpZGVkIGluIHRoZSBBWElTIG5vZGVcbiAgICAgIGRpcmVjdGlvbiA9IG5vZGVbMl0gPyBub2RlWzJdLnRvTG93ZXJDYXNlKCkgOiAndW5rbm93bic7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJOb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdPUkRFUicpO1xuICAgIGNvbnN0IG9yZGVyID0gb3JkZXJOb2RlID8gcGFyc2VJbnQob3JkZXJOb2RlWzFdLCAxMCkgOiBudWxsO1xuXG4gICAgY29uc3QgdW5pdE5vZGUgPSBub2RlLmZpbmQoXG4gICAgICAoY2hpbGQpID0+XG4gICAgICAgIEFycmF5LmlzQXJyYXkoY2hpbGQpICYmXG4gICAgICAgIChjaGlsZFswXSA9PT0gJ0xFTkdUSFVOSVQnIHx8IGNoaWxkWzBdID09PSAnQU5HTEVVTklUJyB8fCBjaGlsZFswXSA9PT0gJ1NDQUxFVU5JVCcpXG4gICAgKTtcbiAgICBjb25zdCB1bml0ID0gdGhpcy5jb252ZXJ0VW5pdCh1bml0Tm9kZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZSxcbiAgICAgIGRpcmVjdGlvbiwgLy8gVXNlIHRoZSB2YWxpZCBQUk9KSlNPTiBkaXJlY3Rpb24gdmFsdWVcbiAgICAgIHVuaXQsXG4gICAgICBvcmRlcixcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGV4dHJhY3RBeGVzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZVxuICAgICAgLmZpbHRlcigoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQVhJUycpXG4gICAgICAubWFwKChheGlzKSA9PiB0aGlzLmNvbnZlcnRBeGlzKGF4aXMpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IChhLm9yZGVyIHx8IDApIC0gKGIub3JkZXIgfHwgMCkpOyAvLyBTb3J0IGJ5IHRoZSBcIm9yZGVyXCIgcHJvcGVydHlcbiAgfVxuXG4gIHN0YXRpYyBjb252ZXJ0KG5vZGUsIHJlc3VsdCA9IHt9KSB7XG5cbiAgICBzd2l0Y2ggKG5vZGVbMF0pIHtcbiAgICAgIGNhc2UgJ1BST0pDUlMnOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdQcm9qZWN0ZWRDUlMnO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICAgIHJlc3VsdC5iYXNlX2NycyA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQkFTRUdFT0dDUlMnKVxuICAgICAgICAgID8gdGhpcy5jb252ZXJ0KG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnQkFTRUdFT0dDUlMnKSlcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIHJlc3VsdC5jb252ZXJzaW9uID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdDT05WRVJTSU9OJylcbiAgICAgICAgICA/IHRoaXMuY29udmVydChub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0NPTlZFUlNJT04nKSlcbiAgICAgICAgICA6IG51bGw7XG5cbiAgICAgICAgY29uc3QgY3NOb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdDUycpO1xuICAgICAgICBpZiAoY3NOb2RlKSB7XG4gICAgICAgICAgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtID0ge1xuICAgICAgICAgICAgdHlwZTogY3NOb2RlWzFdLFxuICAgICAgICAgICAgYXhpczogdGhpcy5leHRyYWN0QXhlcyhub2RlKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoVW5pdE5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0xFTkdUSFVOSVQnKTtcbiAgICAgICAgaWYgKGxlbmd0aFVuaXROb2RlKSB7XG4gICAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMuY29udmVydFVuaXQobGVuZ3RoVW5pdE5vZGUpO1xuICAgICAgICAgIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbS51bml0ID0gdW5pdDsgLy8gQWRkIHVuaXQgdG8gY29vcmRpbmF0ZV9zeXN0ZW1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5pZCA9IHRoaXMuZ2V0SWQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdCQVNFR0VPR0NSUyc6XG4gICAgICBjYXNlICdHRU9HQ1JTJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnR2VvZ3JhcGhpY0NSUyc7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgIFxuICAgICAgICAvLyBIYW5kbGUgREFUVU0gb3IgRU5TRU1CTEVcbiAgICAgICAgY29uc3QgZGF0dW1PckVuc2VtYmxlTm9kZSA9IG5vZGUuZmluZChcbiAgICAgICAgICAoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIChjaGlsZFswXSA9PT0gJ0RBVFVNJyB8fCBjaGlsZFswXSA9PT0gJ0VOU0VNQkxFJylcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGRhdHVtT3JFbnNlbWJsZU5vZGUpIHtcbiAgICAgICAgICBjb25zdCBkYXR1bU9yRW5zZW1ibGUgPSB0aGlzLmNvbnZlcnQoZGF0dW1PckVuc2VtYmxlTm9kZSk7XG4gICAgICAgICAgaWYgKGRhdHVtT3JFbnNlbWJsZU5vZGVbMF0gPT09ICdFTlNFTUJMRScpIHtcbiAgICAgICAgICAgIHJlc3VsdC5kYXR1bV9lbnNlbWJsZSA9IGRhdHVtT3JFbnNlbWJsZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LmRhdHVtID0gZGF0dW1PckVuc2VtYmxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBwcmltZW0gPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ1BSSU1FTScpO1xuICAgICAgICAgIGlmIChwcmltZW0gJiYgcHJpbWVtWzFdICE9PSAnR3JlZW53aWNoJykge1xuICAgICAgICAgICAgZGF0dW1PckVuc2VtYmxlLnByaW1lX21lcmlkaWFuID0ge1xuICAgICAgICAgICAgICBuYW1lOiBwcmltZW1bMV0sXG4gICAgICAgICAgICAgIGxvbmdpdHVkZTogcGFyc2VGbG9hdChwcmltZW1bMl0pLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXG4gICAgICAgIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbSA9IHtcbiAgICAgICAgICB0eXBlOiAnZWxsaXBzb2lkYWwnLFxuICAgICAgICAgIGF4aXM6IHRoaXMuZXh0cmFjdEF4ZXMobm9kZSksXG4gICAgICAgIH07XG4gICAgICBcbiAgICAgICAgcmVzdWx0LmlkID0gdGhpcy5nZXRJZChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0RBVFVNJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnR2VvZGV0aWNSZWZlcmVuY2VGcmFtZSc7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgICAgcmVzdWx0LmVsbGlwc29pZCA9IG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnRUxMSVBTT0lEJylcbiAgICAgICAgICA/IHRoaXMuY29udmVydChub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0VMTElQU09JRCcpKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBcbiAgICAgIGNhc2UgJ0VOU0VNQkxFJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnRGF0dW1FbnNlbWJsZSc7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgIFxuICAgICAgICAvLyBFeHRyYWN0IGVuc2VtYmxlIG1lbWJlcnNcbiAgICAgICAgcmVzdWx0Lm1lbWJlcnMgPSBub2RlXG4gICAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTUVNQkVSJylcbiAgICAgICAgICAubWFwKChtZW1iZXIpID0+ICh7XG4gICAgICAgICAgICB0eXBlOiAnRGF0dW1FbnNlbWJsZU1lbWJlcicsXG4gICAgICAgICAgICBuYW1lOiBtZW1iZXJbMV0sXG4gICAgICAgICAgICBpZDogdGhpcy5nZXRJZChtZW1iZXIpLCAvLyBFeHRyYWN0IElEIGFzIHsgYXV0aG9yaXR5LCBjb2RlIH1cbiAgICAgICAgICB9KSk7XG4gICAgICBcbiAgICAgICAgLy8gRXh0cmFjdCBhY2N1cmFjeVxuICAgICAgICBjb25zdCBhY2N1cmFjeU5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0VOU0VNQkxFQUNDVVJBQ1knKTtcbiAgICAgICAgaWYgKGFjY3VyYWN5Tm9kZSkge1xuICAgICAgICAgIHJlc3VsdC5hY2N1cmFjeSA9IHBhcnNlRmxvYXQoYWNjdXJhY3lOb2RlWzFdKTtcbiAgICAgICAgfVxuICAgICAgXG4gICAgICAgIC8vIEV4dHJhY3QgZWxsaXBzb2lkXG4gICAgICAgIGNvbnN0IGVsbGlwc29pZE5vZGUgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0VMTElQU09JRCcpO1xuICAgICAgICBpZiAoZWxsaXBzb2lkTm9kZSkge1xuICAgICAgICAgIHJlc3VsdC5lbGxpcHNvaWQgPSB0aGlzLmNvbnZlcnQoZWxsaXBzb2lkTm9kZSk7IC8vIENvbnZlcnQgdGhlIGVsbGlwc29pZCBub2RlXG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICAvLyBFeHRyYWN0IGlkZW50aWZpZXIgZm9yIHRoZSBlbnNlbWJsZVxuICAgICAgICByZXN1bHQuaWQgPSB0aGlzLmdldElkKG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnRUxMSVBTT0lEJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnRWxsaXBzb2lkJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgICByZXN1bHQuc2VtaV9tYWpvcl9heGlzID0gcGFyc2VGbG9hdChub2RlWzJdKTtcbiAgICAgICAgcmVzdWx0LmludmVyc2VfZmxhdHRlbmluZyA9IHBhcnNlRmxvYXQobm9kZVszXSk7XG4gICAgICAgIGNvbnN0IHVuaXRzID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdMRU5HVEhVTklUJylcbiAgICAgICAgICA/IHRoaXMuY29udmVydChub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ0xFTkdUSFVOSVQnKSwgcmVzdWx0KVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0NPTlZFUlNJT04nOlxuICAgICAgICByZXN1bHQudHlwZSA9ICdDb252ZXJzaW9uJztcbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBub2RlWzFdO1xuICAgICAgICByZXN1bHQubWV0aG9kID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdNRVRIT0QnKVxuICAgICAgICAgID8gdGhpcy5jb252ZXJ0KG5vZGUuZmluZCgoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIGNoaWxkWzBdID09PSAnTUVUSE9EJykpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICByZXN1bHQucGFyYW1ldGVycyA9IG5vZGVcbiAgICAgICAgICAuZmlsdGVyKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdQQVJBTUVURVInKVxuICAgICAgICAgIC5tYXAoKHBhcmFtKSA9PiB0aGlzLmNvbnZlcnQocGFyYW0pKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ01FVEhPRCc6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ01ldGhvZCc7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgICAgcmVzdWx0LmlkID0gdGhpcy5nZXRJZChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ1BBUkFNRVRFUic6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ1BhcmFtZXRlcic7XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbm9kZVsxXTtcbiAgICAgICAgcmVzdWx0LnZhbHVlID0gcGFyc2VGbG9hdChub2RlWzJdKTtcbiAgICAgICAgcmVzdWx0LnVuaXQgPSB0aGlzLmNvbnZlcnRVbml0KFxuICAgICAgICAgIG5vZGUuZmluZChcbiAgICAgICAgICAgIChjaGlsZCkgPT5cbiAgICAgICAgICAgICAgQXJyYXkuaXNBcnJheShjaGlsZCkgJiZcbiAgICAgICAgICAgICAgKGNoaWxkWzBdID09PSAnTEVOR1RIVU5JVCcgfHwgY2hpbGRbMF0gPT09ICdBTkdMRVVOSVQnIHx8IGNoaWxkWzBdID09PSAnU0NBTEVVTklUJylcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIHJlc3VsdC5pZCA9IHRoaXMuZ2V0SWQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdCT1VORENSUyc6XG4gICAgICAgIHJlc3VsdC50eXBlID0gJ0JvdW5kQ1JTJztcblxuICAgICAgICAvLyBQcm9jZXNzIFNPVVJDRUNSU1xuICAgICAgICBjb25zdCBzb3VyY2VDcnNOb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdTT1VSQ0VDUlMnKTtcbiAgICAgICAgaWYgKHNvdXJjZUNyc05vZGUpIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2VDcnNDb250ZW50ID0gc291cmNlQ3JzTm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkpO1xuICAgICAgICAgIHJlc3VsdC5zb3VyY2VfY3JzID0gc291cmNlQ3JzQ29udGVudCA/IHRoaXMuY29udmVydChzb3VyY2VDcnNDb250ZW50KSA6IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIFRBUkdFVENSU1xuICAgICAgICBjb25zdCB0YXJnZXRDcnNOb2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdUQVJHRVRDUlMnKTtcbiAgICAgICAgaWYgKHRhcmdldENyc05vZGUpIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXRDcnNDb250ZW50ID0gdGFyZ2V0Q3JzTm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkpO1xuICAgICAgICAgIHJlc3VsdC50YXJnZXRfY3JzID0gdGFyZ2V0Q3JzQ29udGVudCA/IHRoaXMuY29udmVydCh0YXJnZXRDcnNDb250ZW50KSA6IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIEFCUklER0VEVFJBTlNGT1JNQVRJT05cbiAgICAgICAgY29uc3QgdHJhbnNmb3JtYXRpb25Ob2RlID0gbm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdBQlJJREdFRFRSQU5TRk9STUFUSU9OJyk7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1hdGlvbk5vZGUpIHtcbiAgICAgICAgICByZXN1bHQudHJhbnNmb3JtYXRpb24gPSB0aGlzLmNvbnZlcnQodHJhbnNmb3JtYXRpb25Ob2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQudHJhbnNmb3JtYXRpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdBQlJJREdFRFRSQU5TRk9STUFUSU9OJzpcbiAgICAgICAgcmVzdWx0LnR5cGUgPSAnVHJhbnNmb3JtYXRpb24nO1xuICAgICAgICByZXN1bHQubmFtZSA9IG5vZGVbMV07XG4gICAgICAgIHJlc3VsdC5tZXRob2QgPSBub2RlLmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ01FVEhPRCcpXG4gICAgICAgICAgPyB0aGlzLmNvbnZlcnQobm9kZS5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdNRVRIT0QnKSlcbiAgICAgICAgICA6IG51bGw7XG5cbiAgICAgICAgcmVzdWx0LnBhcmFtZXRlcnMgPSBub2RlXG4gICAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IEFycmF5LmlzQXJyYXkoY2hpbGQpICYmIChjaGlsZFswXSA9PT0gJ1BBUkFNRVRFUicgfHwgY2hpbGRbMF0gPT09ICdQQVJBTUVURVJGSUxFJykpXG4gICAgICAgICAgLm1hcCgocGFyYW0pID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbVswXSA9PT0gJ1BBUkFNRVRFUicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydChwYXJhbSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtWzBdID09PSAnUEFSQU1FVEVSRklMRScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBwYXJhbVsxXSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcGFyYW1bMl0sXG4gICAgICAgICAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgICAgICAgICdhdXRob3JpdHknOiAnRVBTRycsXG4gICAgICAgICAgICAgICAgICAnY29kZSc6IDg2NTZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWRqdXN0IHRoZSBTY2FsZSBkaWZmZXJlbmNlIHBhcmFtZXRlciBpZiBwcmVzZW50XG4gICAgICAgIGlmIChyZXN1bHQucGFyYW1ldGVycy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgICBjb25zdCBzY2FsZURpZmZlcmVuY2UgPSByZXN1bHQucGFyYW1ldGVyc1s2XTtcbiAgICAgICAgICBpZiAoc2NhbGVEaWZmZXJlbmNlLm5hbWUgPT09ICdTY2FsZSBkaWZmZXJlbmNlJykge1xuICAgICAgICAgICAgc2NhbGVEaWZmZXJlbmNlLnZhbHVlID0gTWF0aC5yb3VuZCgoc2NhbGVEaWZmZXJlbmNlLnZhbHVlIC0gMSkgKiAxZTEyKSAvIDFlNjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQuaWQgPSB0aGlzLmdldElkKG5vZGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIFxuICAgICAgY2FzZSAnQVhJUyc6XG4gICAgICAgIGlmICghcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtKSB7XG4gICAgICAgICAgcmVzdWx0LmNvb3JkaW5hdGVfc3lzdGVtID0geyB0eXBlOiAndW5zcGVjaWZpZWQnLCBheGlzOiBbXSB9O1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbS5heGlzLnB1c2godGhpcy5jb252ZXJ0QXhpcyhub2RlKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgICBjYXNlICdMRU5HVEhVTklUJzpcbiAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMuY29udmVydFVuaXQobm9kZSwgJ0xpbmVhclVuaXQnKTtcbiAgICAgICAgaWYgKHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbSAmJiByZXN1bHQuY29vcmRpbmF0ZV9zeXN0ZW0uYXhpcykge1xuICAgICAgICAgIHJlc3VsdC5jb29yZGluYXRlX3N5c3RlbS5heGlzLmZvckVhY2goKGF4aXMpID0+IHtcbiAgICAgICAgICAgIGlmICghYXhpcy51bml0KSB7XG4gICAgICAgICAgICAgIGF4aXMudW5pdCA9IHVuaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXQuY29udmVyc2lvbl9mYWN0b3IgJiYgdW5pdC5jb252ZXJzaW9uX2ZhY3RvciAhPT0gMSkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc2VtaV9tYWpvcl9heGlzKSB7XG4gICAgICAgICAgICByZXN1bHQuc2VtaV9tYWpvcl9heGlzID0ge1xuICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnNlbWlfbWFqb3JfYXhpcyxcbiAgICAgICAgICAgICAgdW5pdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJlc3VsdC5rZXl3b3JkID0gbm9kZVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQUk9KSlNPTkJ1aWxkZXJCYXNlOyIsImltcG9ydCBQUk9KSlNPTkJ1aWxkZXIyMDE1IGZyb20gJy4vUFJPSkpTT05CdWlsZGVyMjAxNS5qcyc7XG5pbXBvcnQgUFJPSkpTT05CdWlsZGVyMjAxOSBmcm9tICcuL1BST0pKU09OQnVpbGRlcjIwMTkuanMnO1xuXG4vKipcbiAqIERldGVjdHMgdGhlIFdLVDIgdmVyc2lvbiBiYXNlZCBvbiB0aGUgc3RydWN0dXJlIG9mIHRoZSBXS1QuXG4gKiBAcGFyYW0ge0FycmF5fSByb290IFRoZSByb290IFdLVCBhcnJheSBub2RlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGRldGVjdGVkIHZlcnNpb24gKFwiMjAxNVwiIG9yIFwiMjAxOVwiKS5cbiAqL1xuZnVuY3Rpb24gZGV0ZWN0V0tUMlZlcnNpb24ocm9vdCkge1xuICAvLyBDaGVjayBmb3IgV0tUMi0yMDE5LXNwZWNpZmljIG5vZGVzXG4gIGlmIChyb290LmZpbmQoKGNoaWxkKSA9PiBBcnJheS5pc0FycmF5KGNoaWxkKSAmJiBjaGlsZFswXSA9PT0gJ1VTQUdFJykpIHtcbiAgICByZXR1cm4gJzIwMTknOyAvLyBgVVNBR0VgIGlzIHNwZWNpZmljIHRvIFdLVDItMjAxOVxuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIFdLVDItMjAxNS1zcGVjaWZpYyBub2Rlc1xuICBpZiAocm9vdC5maW5kKChjaGlsZCkgPT4gQXJyYXkuaXNBcnJheShjaGlsZCkgJiYgY2hpbGRbMF0gPT09ICdDUycpKSB7XG4gICAgcmV0dXJuICcyMDE1JzsgLy8gYENTYCBpcyB2YWxpZCBpbiBib3RoLCBidXQgZGVmYXVsdCB0byAyMDE1IHVubGVzcyBgVVNBR0VgIGlzIHByZXNlbnRcbiAgfVxuXG4gIGlmIChyb290WzBdID09PSAnQk9VTkRDUlMnIHx8IHJvb3RbMF0gPT09ICdQUk9KQ1JTJyB8fCByb290WzBdID09PSAnR0VPR0NSUycpIHtcbiAgICByZXR1cm4gJzIwMTUnOyAvLyBUaGVzZSBhcmUgdmFsaWQgaW4gYm90aCwgYnV0IGRlZmF1bHQgdG8gMjAxNVxuICB9XG5cbiAgLy8gRGVmYXVsdCB0byBXS1QyLTIwMTUgaWYgbm8gc3BlY2lmaWMgaW5kaWNhdG9ycyBhcmUgZm91bmRcbiAgcmV0dXJuICcyMDE1Jztcbn1cblxuLyoqXG4gKiBCdWlsZHMgYSBQUk9KSlNPTiBvYmplY3QgZnJvbSBhIFdLVCBhcnJheSBzdHJ1Y3R1cmUuXG4gKiBAcGFyYW0ge0FycmF5fSByb290IFRoZSByb290IFdLVCBhcnJheSBub2RlLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIFBST0pKU09OIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUFJPSkpTT04ocm9vdCkge1xuICBjb25zdCB2ZXJzaW9uID0gZGV0ZWN0V0tUMlZlcnNpb24ocm9vdCk7XG4gIGNvbnN0IGJ1aWxkZXIgPSB2ZXJzaW9uID09PSAnMjAxOScgPyBQUk9KSlNPTkJ1aWxkZXIyMDE5IDogUFJPSkpTT05CdWlsZGVyMjAxNTtcbiAgcmV0dXJuIGJ1aWxkZXIuY29udmVydChyb290KTtcbn1cbiIsIi8qKlxuICogRGV0ZWN0cyB3aGV0aGVyIHRoZSBXS1Qgc3RyaW5nIGlzIFdLVDEgb3IgV0tUMi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB3a3QgVGhlIFdLVCBzdHJpbmcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgdmVyc2lvbiAoXCJXS1QxXCIgb3IgXCJXS1QyXCIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0V0tUVmVyc2lvbih3a3QpIHtcbiAgLy8gTm9ybWFsaXplIHRoZSBXS1Qgc3RyaW5nIGZvciBlYXNpZXIga2V5d29yZCBtYXRjaGluZ1xuICBjb25zdCBub3JtYWxpemVkV0tUID0gd2t0LnRvVXBwZXJDYXNlKCk7XG5cbiAgLy8gQ2hlY2sgZm9yIFdLVDItc3BlY2lmaWMga2V5d29yZHNcbiAgaWYgKFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ1BST0pDUlMnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ0dFT0dDUlMnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ0JPVU5EQ1JTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdWRVJUQ1JTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdMRU5HVEhVTklUJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdBTkdMRVVOSVQnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ1NDQUxFVU5JVCcpXG4gICkge1xuICAgIHJldHVybiAnV0tUMic7XG4gIH1cblxuICAvLyBDaGVjayBmb3IgV0tUMS1zcGVjaWZpYyBrZXl3b3Jkc1xuICBpZiAoXG4gICAgbm9ybWFsaXplZFdLVC5pbmNsdWRlcygnUFJPSkNTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdHRU9HQ1MnKSB8fFxuICAgIG5vcm1hbGl6ZWRXS1QuaW5jbHVkZXMoJ0xPQ0FMX0NTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdWRVJUX0NTJykgfHxcbiAgICBub3JtYWxpemVkV0tULmluY2x1ZGVzKCdVTklUJylcbiAgKSB7XG4gICAgcmV0dXJuICdXS1QxJztcbiAgfVxuXG4gIC8vIERlZmF1bHQgdG8gV0tUMSBpZiBubyBzcGVjaWZpYyBpbmRpY2F0b3JzIGFyZSBmb3VuZFxuICByZXR1cm4gJ1dLVDEnO1xufSIsImltcG9ydCB7IGJ1aWxkUFJPSkpTT04gfSBmcm9tICcuL2J1aWxkUFJPSkpTT04uanMnO1xuaW1wb3J0IHsgZGV0ZWN0V0tUVmVyc2lvbiB9IGZyb20gJy4vZGV0ZWN0V0tUVmVyc2lvbi5qcyc7XG5pbXBvcnQgcGFyc2VyIGZyb20gJy4vcGFyc2VyLmpzJztcbmltcG9ydCB7c0V4cHJ9IGZyb20gJy4vcHJvY2Vzcy5qcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1QUk9KSlNPTiB9IGZyb20gJy4vdHJhbnNmb3JtUFJPSkpTT04uanMnO1xuaW1wb3J0IHsgYXBwbHlQcm9qZWN0aW9uRGVmYXVsdHMsIGQyciB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbnZhciBrbm93blR5cGVzID0gWydQUk9KRUNURURDUlMnLCAnUFJPSkNSUycsICdHRU9HQ1MnLCAnR0VPQ0NTJywgJ1BST0pDUycsICdMT0NBTF9DUycsICdHRU9EQ1JTJyxcbiAgJ0dFT0RFVElDQ1JTJywgJ0dFT0RFVElDREFUVU0nLCAnRU5HQ1JTJywgJ0VOR0lORUVSSU5HQ1JTJ107XG5cbmZ1bmN0aW9uIHJlbmFtZShvYmosIHBhcmFtcykge1xuICB2YXIgb3V0TmFtZSA9IHBhcmFtc1swXTtcbiAgdmFyIGluTmFtZSA9IHBhcmFtc1sxXTtcbiAgaWYgKCEob3V0TmFtZSBpbiBvYmopICYmIChpbk5hbWUgaW4gb2JqKSkge1xuICAgIG9ialtvdXROYW1lXSA9IG9ialtpbk5hbWVdO1xuICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAzKSB7XG4gICAgICBvYmpbb3V0TmFtZV0gPSBwYXJhbXNbMl0ob2JqW291dE5hbWVdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xlYW5XS1Qod2t0KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMod2t0KTtcbiAgZm9yICh2YXIgaSA9IDAsIGlpID0ga2V5cy5sZW5ndGg7IGkgPGlpOyArK2kpIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAvLyB0aGUgZm9sbG93aW5ncyBhcmUgdGhlIGNycyBkZWZpbmVkIGluXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Byb2o0anMvcHJvajRqcy9ibG9iLzFkYTRlZDBiODY1ZDBmY2I1MWMxMzYwOTA1NjkyMTBjZGNjOTAxOWUvbGliL3BhcnNlQ29kZS5qcyNMMTFcbiAgICBpZiAoa25vd25UeXBlcy5pbmRleE9mKGtleSkgIT09IC0xKSB7XG4gICAgICBzZXRQcm9wZXJ0aWVzRnJvbVdrdCh3a3Rba2V5XSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2t0W2tleV0gPT09ICdvYmplY3QnKSB7XG4gICAgICBjbGVhbldLVCh3a3Rba2V5XSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXNGcm9tV2t0KHdrdCkge1xuICBpZiAod2t0LkFVVEhPUklUWSkge1xuICAgIHZhciBhdXRob3JpdHkgPSBPYmplY3Qua2V5cyh3a3QuQVVUSE9SSVRZKVswXTtcbiAgICBpZiAoYXV0aG9yaXR5ICYmIGF1dGhvcml0eSBpbiB3a3QuQVVUSE9SSVRZKSB7XG4gICAgICB3a3QudGl0bGUgPSBhdXRob3JpdHkgKyAnOicgKyB3a3QuQVVUSE9SSVRZW2F1dGhvcml0eV07XG4gICAgfVxuICB9XG4gIGlmICh3a3QudHlwZSA9PT0gJ0dFT0dDUycpIHtcbiAgICB3a3QucHJvak5hbWUgPSAnbG9uZ2xhdCc7XG4gIH0gZWxzZSBpZiAod2t0LnR5cGUgPT09ICdMT0NBTF9DUycpIHtcbiAgICB3a3QucHJvak5hbWUgPSAnaWRlbnRpdHknO1xuICAgIHdrdC5sb2NhbCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiB3a3QuUFJPSkVDVElPTiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHdrdC5wcm9qTmFtZSA9IE9iamVjdC5rZXlzKHdrdC5QUk9KRUNUSU9OKVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2t0LnByb2pOYW1lID0gd2t0LlBST0pFQ1RJT047XG4gICAgfVxuICB9XG4gIGlmICh3a3QuQVhJUykge1xuICAgIHZhciBheGlzT3JkZXIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB3a3QuQVhJUy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICB2YXIgYXhpcyA9IFt3a3QuQVhJU1tpXVswXS50b0xvd2VyQ2FzZSgpLCB3a3QuQVhJU1tpXVsxXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgIGlmIChheGlzWzBdLmluZGV4T2YoJ25vcnRoJykgIT09IC0xIHx8ICgoYXhpc1swXSA9PT0gJ3knIHx8IGF4aXNbMF0gPT09ICdsYXQnKSAmJiBheGlzWzFdID09PSAnbm9ydGgnKSkge1xuICAgICAgICBheGlzT3JkZXIgKz0gJ24nO1xuICAgICAgfSBlbHNlIGlmIChheGlzWzBdLmluZGV4T2YoJ3NvdXRoJykgIT09IC0xIHx8ICgoYXhpc1swXSA9PT0gJ3knIHx8IGF4aXNbMF0gPT09ICdsYXQnKSAmJiBheGlzWzFdID09PSAnc291dGgnKSkge1xuICAgICAgICBheGlzT3JkZXIgKz0gJ3MnO1xuICAgICAgfSBlbHNlIGlmIChheGlzWzBdLmluZGV4T2YoJ2Vhc3QnKSAhPT0gLTEgfHwgKChheGlzWzBdID09PSAneCcgfHwgYXhpc1swXSA9PT0gJ2xvbicpICYmIGF4aXNbMV0gPT09ICdlYXN0JykpIHtcbiAgICAgICAgYXhpc09yZGVyICs9ICdlJztcbiAgICAgIH0gZWxzZSBpZiAoYXhpc1swXS5pbmRleE9mKCd3ZXN0JykgIT09IC0xIHx8ICgoYXhpc1swXSA9PT0gJ3gnIHx8IGF4aXNbMF0gPT09ICdsb24nKSAmJiBheGlzWzFdID09PSAnd2VzdCcpKSB7XG4gICAgICAgIGF4aXNPcmRlciArPSAndyc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChheGlzT3JkZXIubGVuZ3RoID09PSAyKSB7XG4gICAgICBheGlzT3JkZXIgKz0gJ3UnO1xuICAgIH1cbiAgICBpZiAoYXhpc09yZGVyLmxlbmd0aCA9PT0gMykge1xuICAgICAgd2t0LmF4aXMgPSBheGlzT3JkZXI7XG4gICAgfVxuICB9XG4gIGlmICh3a3QuVU5JVCkge1xuICAgIHdrdC51bml0cyA9IHdrdC5VTklULm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAod2t0LnVuaXRzID09PSAnbWV0cmUnKSB7XG4gICAgICB3a3QudW5pdHMgPSAnbWV0ZXInO1xuICAgIH1cbiAgICBpZiAod2t0LlVOSVQuY29udmVydCkge1xuICAgICAgaWYgKHdrdC50eXBlID09PSAnR0VPR0NTJykge1xuICAgICAgICBpZiAod2t0LkRBVFVNICYmIHdrdC5EQVRVTS5TUEhFUk9JRCkge1xuICAgICAgICAgIHdrdC50b19tZXRlciA9IHdrdC5VTklULmNvbnZlcnQqd2t0LkRBVFVNLlNQSEVST0lELmE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdrdC50b19tZXRlciA9IHdrdC5VTklULmNvbnZlcnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHZhciBnZW9nY3MgPSB3a3QuR0VPR0NTO1xuICBpZiAod2t0LnR5cGUgPT09ICdHRU9HQ1MnKSB7XG4gICAgZ2VvZ2NzID0gd2t0O1xuICB9XG4gIGlmIChnZW9nY3MpIHtcbiAgICAvL2lmKHdrdC5HRU9HQ1MuUFJJTUVNJiZ3a3QuR0VPR0NTLlBSSU1FTS5jb252ZXJ0KXtcbiAgICAvLyAgd2t0LmZyb21fZ3JlZW53aWNoPXdrdC5HRU9HQ1MuUFJJTUVNLmNvbnZlcnQqRDJSO1xuICAgIC8vfVxuICAgIGlmIChnZW9nY3MuREFUVU0pIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSBnZW9nY3MuREFUVU0ubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gZ2VvZ2NzLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKHdrdC5kYXR1bUNvZGUuc2xpY2UoMCwgMikgPT09ICdkXycpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSB3a3QuZGF0dW1Db2RlLnNsaWNlKDIpO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZSA9PT0gJ25ld196ZWFsYW5kXzE5NDknKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ256Z2Q0OSc7XG4gICAgfVxuICAgIGlmICh3a3QuZGF0dW1Db2RlID09PSAnd2dzXzE5ODQnIHx8IHdrdC5kYXR1bUNvZGUgPT09ICd3b3JsZF9nZW9kZXRpY19zeXN0ZW1fMTk4NCcpIHtcbiAgICAgIGlmICh3a3QuUFJPSkVDVElPTiA9PT0gJ01lcmNhdG9yX0F1eGlsaWFyeV9TcGhlcmUnKSB7XG4gICAgICAgIHdrdC5zcGhlcmUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgd2t0LmRhdHVtQ29kZSA9ICd3Z3M4NCc7XG4gICAgfVxuICAgIGlmICh3a3QuZGF0dW1Db2RlID09PSAnYmVsZ2VfMTk3MicpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAncm5iNzInO1xuICAgIH1cbiAgICBpZiAoZ2VvZ2NzLkRBVFVNICYmIGdlb2djcy5EQVRVTS5TUEhFUk9JRCkge1xuICAgICAgd2t0LmVsbHBzID0gZ2VvZ2NzLkRBVFVNLlNQSEVST0lELm5hbWUucmVwbGFjZSgnXzE5JywgJycpLnJlcGxhY2UoL1tDY11sYXJrZVxcXzE4LywgJ2NscmsnKTtcbiAgICAgIGlmICh3a3QuZWxscHMudG9Mb3dlckNhc2UoKS5zbGljZSgwLCAxMykgPT09ICdpbnRlcm5hdGlvbmFsJykge1xuICAgICAgICB3a3QuZWxscHMgPSAnaW50bCc7XG4gICAgICB9XG5cbiAgICAgIHdrdC5hID0gZ2VvZ2NzLkRBVFVNLlNQSEVST0lELmE7XG4gICAgICB3a3QucmYgPSBwYXJzZUZsb2F0KGdlb2djcy5EQVRVTS5TUEhFUk9JRC5yZiwgMTApO1xuICAgIH1cblxuICAgIGlmIChnZW9nY3MuREFUVU0gJiYgZ2VvZ2NzLkRBVFVNLlRPV0dTODQpIHtcbiAgICAgIHdrdC5kYXR1bV9wYXJhbXMgPSBnZW9nY3MuREFUVU0uVE9XR1M4NDtcbiAgICB9XG4gICAgaWYgKH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ29zZ2JfMTkzNicpKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ29zZ2IzNic7XG4gICAgfVxuICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdvc25pXzE5NTInKSkge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdvc25pNTInO1xuICAgIH1cbiAgICBpZiAofndrdC5kYXR1bUNvZGUuaW5kZXhPZigndG02NScpXG4gICAgICB8fCB+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdnZW9kZXRpY19kYXR1bV9vZl8xOTY1JykpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnaXJlNjUnO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZSA9PT0gJ2NoMTkwMysnKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ2NoMTkwMyc7XG4gICAgfVxuICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdpc3JhZWwnKSkge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdpc3I5Myc7XG4gICAgfVxuICB9XG4gIGlmICh3a3QuYiAmJiAhaXNGaW5pdGUod2t0LmIpKSB7XG4gICAgd2t0LmIgPSB3a3QuYTtcbiAgfVxuICBpZiAod2t0LnJlY3RpZmllZF9ncmlkX2FuZ2xlKSB7XG4gICAgd2t0LnJlY3RpZmllZF9ncmlkX2FuZ2xlID0gZDJyKHdrdC5yZWN0aWZpZWRfZ3JpZF9hbmdsZSk7XG4gIH1cblxuICBmdW5jdGlvbiB0b01ldGVyKGlucHV0KSB7XG4gICAgdmFyIHJhdGlvID0gd2t0LnRvX21ldGVyIHx8IDE7XG4gICAgcmV0dXJuIGlucHV0ICogcmF0aW87XG4gIH1cbiAgdmFyIHJlbmFtZXIgPSBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIHJlbmFtZSh3a3QsIGEpO1xuICB9O1xuICB2YXIgbGlzdCA9IFtcbiAgICBbJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCAnU3RhbmRhcmRfUGFyYWxsZWxfMSddLFxuICAgIFsnc3RhbmRhcmRfcGFyYWxsZWxfMScsICdMYXRpdHVkZSBvZiAxc3Qgc3RhbmRhcmQgcGFyYWxsZWwnXSxcbiAgICBbJ3N0YW5kYXJkX3BhcmFsbGVsXzInLCAnU3RhbmRhcmRfUGFyYWxsZWxfMiddLFxuICAgIFsnc3RhbmRhcmRfcGFyYWxsZWxfMicsICdMYXRpdHVkZSBvZiAybmQgc3RhbmRhcmQgcGFyYWxsZWwnXSxcbiAgICBbJ2ZhbHNlX2Vhc3RpbmcnLCAnRmFsc2VfRWFzdGluZyddLFxuICAgIFsnZmFsc2VfZWFzdGluZycsICdGYWxzZSBlYXN0aW5nJ10sXG4gICAgWydmYWxzZS1lYXN0aW5nJywgJ0Vhc3RpbmcgYXQgZmFsc2Ugb3JpZ2luJ10sXG4gICAgWydmYWxzZV9ub3J0aGluZycsICdGYWxzZV9Ob3J0aGluZyddLFxuICAgIFsnZmFsc2Vfbm9ydGhpbmcnLCAnRmFsc2Ugbm9ydGhpbmcnXSxcbiAgICBbJ2ZhbHNlX25vcnRoaW5nJywgJ05vcnRoaW5nIGF0IGZhbHNlIG9yaWdpbiddLFxuICAgIFsnY2VudHJhbF9tZXJpZGlhbicsICdDZW50cmFsX01lcmlkaWFuJ10sXG4gICAgWydjZW50cmFsX21lcmlkaWFuJywgJ0xvbmdpdHVkZSBvZiBuYXR1cmFsIG9yaWdpbiddLFxuICAgIFsnY2VudHJhbF9tZXJpZGlhbicsICdMb25naXR1ZGUgb2YgZmFsc2Ugb3JpZ2luJ10sXG4gICAgWydsYXRpdHVkZV9vZl9vcmlnaW4nLCAnTGF0aXR1ZGVfT2ZfT3JpZ2luJ10sXG4gICAgWydsYXRpdHVkZV9vZl9vcmlnaW4nLCAnQ2VudHJhbF9QYXJhbGxlbCddLFxuICAgIFsnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgJ0xhdGl0dWRlIG9mIG5hdHVyYWwgb3JpZ2luJ10sXG4gICAgWydsYXRpdHVkZV9vZl9vcmlnaW4nLCAnTGF0aXR1ZGUgb2YgZmFsc2Ugb3JpZ2luJ10sXG4gICAgWydzY2FsZV9mYWN0b3InLCAnU2NhbGVfRmFjdG9yJ10sXG4gICAgWydrMCcsICdzY2FsZV9mYWN0b3InXSxcbiAgICBbJ2xhdGl0dWRlX29mX2NlbnRlcicsICdMYXRpdHVkZV9PZl9DZW50ZXInXSxcbiAgICBbJ2xhdGl0dWRlX29mX2NlbnRlcicsICdMYXRpdHVkZV9vZl9jZW50ZXInXSxcbiAgICBbJ2xhdDAnLCAnbGF0aXR1ZGVfb2ZfY2VudGVyJywgZDJyXSxcbiAgICBbJ2xvbmdpdHVkZV9vZl9jZW50ZXInLCAnTG9uZ2l0dWRlX09mX0NlbnRlciddLFxuICAgIFsnbG9uZ2l0dWRlX29mX2NlbnRlcicsICdMb25naXR1ZGVfb2ZfY2VudGVyJ10sXG4gICAgWydsb25nYycsICdsb25naXR1ZGVfb2ZfY2VudGVyJywgZDJyXSxcbiAgICBbJ3gwJywgJ2ZhbHNlX2Vhc3RpbmcnLCB0b01ldGVyXSxcbiAgICBbJ3kwJywgJ2ZhbHNlX25vcnRoaW5nJywgdG9NZXRlcl0sXG4gICAgWydsb25nMCcsICdjZW50cmFsX21lcmlkaWFuJywgZDJyXSxcbiAgICBbJ2xhdDAnLCAnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgZDJyXSxcbiAgICBbJ2xhdDAnLCAnc3RhbmRhcmRfcGFyYWxsZWxfMScsIGQycl0sXG4gICAgWydsYXQxJywgJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCBkMnJdLFxuICAgIFsnbGF0MicsICdzdGFuZGFyZF9wYXJhbGxlbF8yJywgZDJyXSxcbiAgICBbJ2F6aW11dGgnLCAnQXppbXV0aCddLFxuICAgIFsnYWxwaGEnLCAnYXppbXV0aCcsIGQycl0sXG4gICAgWydzcnNDb2RlJywgJ25hbWUnXVxuICBdO1xuICBsaXN0LmZvckVhY2gocmVuYW1lcik7XG4gIGFwcGx5UHJvamVjdGlvbkRlZmF1bHRzKHdrdCk7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih3a3QpIHtcbiAgaWYgKHR5cGVvZiB3a3QgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHRyYW5zZm9ybVBST0pKU09OKHdrdCk7XG4gIH1cbiAgY29uc3QgdmVyc2lvbiA9IGRldGVjdFdLVFZlcnNpb24od2t0KTtcbiAgdmFyIGxpc3AgPSBwYXJzZXIod2t0KTtcbiAgaWYgKHZlcnNpb24gPT09ICdXS1QyJykge1xuICAgIGNvbnN0IHByb2pqc29uID0gYnVpbGRQUk9KSlNPTihsaXNwKTtcbiAgICByZXR1cm4gdHJhbnNmb3JtUFJPSkpTT04ocHJvampzb24pO1xuICB9XG4gIHZhciB0eXBlID0gbGlzcFswXTtcbiAgdmFyIG9iaiA9IHt9O1xuICBzRXhwcihsaXNwLCBvYmopO1xuICBjbGVhbldLVChvYmopO1xuICByZXR1cm4gb2JqW3R5cGVdO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgcGFyc2VTdHJpbmc7XG5cbnZhciBORVVUUkFMID0gMTtcbnZhciBLRVlXT1JEID0gMjtcbnZhciBOVU1CRVIgPSAzO1xudmFyIFFVT1RFRCA9IDQ7XG52YXIgQUZURVJRVU9URSA9IDU7XG52YXIgRU5ERUQgPSAtMTtcbnZhciB3aGl0ZXNwYWNlID0gL1xccy87XG52YXIgbGF0aW4gPSAvW0EtWmEtel0vO1xudmFyIGtleXdvcmQgPSAvW0EtWmEtejg0X10vO1xudmFyIGVuZFRoaW5ncyA9IC9bLFxcXV0vO1xudmFyIGRpZ2V0cyA9IC9bXFxkXFwuRVxcLVxcK10vO1xuLy8gY29uc3QgaWdub3JlZENoYXIgPSAvW1xcc19cXC1cXC9cXChcXCldL2c7XG5mdW5jdGlvbiBQYXJzZXIodGV4dCkge1xuICBpZiAodHlwZW9mIHRleHQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdub3QgYSBzdHJpbmcnKTtcbiAgfVxuICB0aGlzLnRleHQgPSB0ZXh0LnRyaW0oKTtcbiAgdGhpcy5sZXZlbCA9IDA7XG4gIHRoaXMucGxhY2UgPSAwO1xuICB0aGlzLnJvb3QgPSBudWxsO1xuICB0aGlzLnN0YWNrID0gW107XG4gIHRoaXMuY3VycmVudE9iamVjdCA9IG51bGw7XG4gIHRoaXMuc3RhdGUgPSBORVVUUkFMO1xufVxuUGFyc2VyLnByb3RvdHlwZS5yZWFkQ2hhcmljdGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjaGFyID0gdGhpcy50ZXh0W3RoaXMucGxhY2UrK107XG4gIGlmICh0aGlzLnN0YXRlICE9PSBRVU9URUQpIHtcbiAgICB3aGlsZSAod2hpdGVzcGFjZS50ZXN0KGNoYXIpKSB7XG4gICAgICBpZiAodGhpcy5wbGFjZSA+PSB0aGlzLnRleHQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNoYXIgPSB0aGlzLnRleHRbdGhpcy5wbGFjZSsrXTtcbiAgICB9XG4gIH1cbiAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgY2FzZSBORVVUUkFMOlxuICAgICAgcmV0dXJuIHRoaXMubmV1dHJhbChjaGFyKTtcbiAgICBjYXNlIEtFWVdPUkQ6XG4gICAgICByZXR1cm4gdGhpcy5rZXl3b3JkKGNoYXIpXG4gICAgY2FzZSBRVU9URUQ6XG4gICAgICByZXR1cm4gdGhpcy5xdW90ZWQoY2hhcik7XG4gICAgY2FzZSBBRlRFUlFVT1RFOlxuICAgICAgcmV0dXJuIHRoaXMuYWZ0ZXJxdW90ZShjaGFyKTtcbiAgICBjYXNlIE5VTUJFUjpcbiAgICAgIHJldHVybiB0aGlzLm51bWJlcihjaGFyKTtcbiAgICBjYXNlIEVOREVEOlxuICAgICAgcmV0dXJuO1xuICB9XG59O1xuUGFyc2VyLnByb3RvdHlwZS5hZnRlcnF1b3RlID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAoY2hhciA9PT0gJ1wiJykge1xuICAgIHRoaXMud29yZCArPSAnXCInO1xuICAgIHRoaXMuc3RhdGUgPSBRVU9URUQ7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbmRUaGluZ3MudGVzdChjaGFyKSkge1xuICAgIHRoaXMud29yZCA9IHRoaXMud29yZC50cmltKCk7XG4gICAgdGhpcy5hZnRlckl0ZW0oY2hhcik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignaGF2blxcJ3QgaGFuZGxlZCBcIicgK2NoYXIgKyAnXCIgaW4gYWZ0ZXJxdW90ZSB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcbn07XG5QYXJzZXIucHJvdG90eXBlLmFmdGVySXRlbSA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGNoYXIgPT09ICcsJykge1xuICAgIGlmICh0aGlzLndvcmQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuY3VycmVudE9iamVjdC5wdXNoKHRoaXMud29yZCk7XG4gICAgfVxuICAgIHRoaXMud29yZCA9IG51bGw7XG4gICAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjaGFyID09PSAnXScpIHtcbiAgICB0aGlzLmxldmVsLS07XG4gICAgaWYgKHRoaXMud29yZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LnB1c2godGhpcy53b3JkKTtcbiAgICAgIHRoaXMud29yZCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSBORVVUUkFMO1xuICAgIHRoaXMuY3VycmVudE9iamVjdCA9IHRoaXMuc3RhY2sucG9wKCk7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRPYmplY3QpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBFTkRFRDtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cbn07XG5QYXJzZXIucHJvdG90eXBlLm51bWJlciA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGRpZ2V0cy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkICs9IGNoYXI7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbmRUaGluZ3MudGVzdChjaGFyKSkge1xuICAgIHRoaXMud29yZCA9IHBhcnNlRmxvYXQodGhpcy53b3JkKTtcbiAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBudW1iZXIgeWV0LCBpbmRleCAnICsgdGhpcy5wbGFjZSk7XG59O1xuUGFyc2VyLnByb3RvdHlwZS5xdW90ZWQgPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChjaGFyID09PSAnXCInKSB7XG4gICAgdGhpcy5zdGF0ZSA9IEFGVEVSUVVPVEU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMud29yZCArPSBjaGFyO1xuICByZXR1cm47XG59O1xuUGFyc2VyLnByb3RvdHlwZS5rZXl3b3JkID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAoa2V5d29yZC50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkICs9IGNoYXI7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjaGFyID09PSAnWycpIHtcbiAgICB2YXIgbmV3T2JqZWN0cyA9IFtdO1xuICAgIG5ld09iamVjdHMucHVzaCh0aGlzLndvcmQpO1xuICAgIHRoaXMubGV2ZWwrKztcbiAgICBpZiAodGhpcy5yb290ID09PSBudWxsKSB7XG4gICAgICB0aGlzLnJvb3QgPSBuZXdPYmplY3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRPYmplY3QucHVzaChuZXdPYmplY3RzKTtcbiAgICB9XG4gICAgdGhpcy5zdGFjay5wdXNoKHRoaXMuY3VycmVudE9iamVjdCk7XG4gICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbmV3T2JqZWN0cztcbiAgICB0aGlzLnN0YXRlID0gTkVVVFJBTDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy5hZnRlckl0ZW0oY2hhcik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignaGF2blxcJ3QgaGFuZGxlZCBcIicgK2NoYXIgKyAnXCIgaW4ga2V5d29yZCB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcbn07XG5QYXJzZXIucHJvdG90eXBlLm5ldXRyYWwgPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChsYXRpbi50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkID0gY2hhcjtcbiAgICB0aGlzLnN0YXRlID0gS0VZV09SRDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNoYXIgPT09ICdcIicpIHtcbiAgICB0aGlzLndvcmQgPSAnJztcbiAgICB0aGlzLnN0YXRlID0gUVVPVEVEO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZGlnZXRzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgPSBjaGFyO1xuICAgIHRoaXMuc3RhdGUgPSBOVU1CRVI7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbmRUaGluZ3MudGVzdChjaGFyKSkge1xuICAgIHRoaXMuYWZ0ZXJJdGVtKGNoYXIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2hhdm5cXCd0IGhhbmRsZWQgXCInICtjaGFyICsgJ1wiIGluIG5ldXRyYWwgeWV0LCBpbmRleCAnICsgdGhpcy5wbGFjZSk7XG59O1xuUGFyc2VyLnByb3RvdHlwZS5vdXRwdXQgPSBmdW5jdGlvbigpIHtcbiAgd2hpbGUgKHRoaXMucGxhY2UgPCB0aGlzLnRleHQubGVuZ3RoKSB7XG4gICAgdGhpcy5yZWFkQ2hhcmljdGVyKCk7XG4gIH1cbiAgaWYgKHRoaXMuc3RhdGUgPT09IEVOREVEKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBwYXJzZSBzdHJpbmcgXCInICt0aGlzLnRleHQgKyAnXCIuIFN0YXRlIGlzICcgKyB0aGlzLnN0YXRlKTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHR4dCkge1xuICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcih0eHQpO1xuICByZXR1cm4gcGFyc2VyLm91dHB1dCgpO1xufVxuIiwiXG5cbmZ1bmN0aW9uIG1hcGl0KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgdmFsdWUudW5zaGlmdChrZXkpO1xuICAgIGtleSA9IG51bGw7XG4gIH1cbiAgdmFyIHRoaW5nID0ga2V5ID8ge30gOiBvYmo7XG5cbiAgdmFyIG91dCA9IHZhbHVlLnJlZHVjZShmdW5jdGlvbihuZXdPYmosIGl0ZW0pIHtcbiAgICBzRXhwcihpdGVtLCBuZXdPYmopO1xuICAgIHJldHVybiBuZXdPYmpcbiAgfSwgdGhpbmcpO1xuICBpZiAoa2V5KSB7XG4gICAgb2JqW2tleV0gPSBvdXQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNFeHByKHYsIG9iaikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkodikpIHtcbiAgICBvYmpbdl0gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5ID0gdi5zaGlmdCgpO1xuICBpZiAoa2V5ID09PSAnUEFSQU1FVEVSJykge1xuICAgIGtleSA9IHYuc2hpZnQoKTtcbiAgfVxuICBpZiAodi5sZW5ndGggPT09IDEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2WzBdKSkge1xuICAgICAgb2JqW2tleV0gPSB7fTtcbiAgICAgIHNFeHByKHZbMF0sIG9ialtrZXldKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb2JqW2tleV0gPSB2WzBdO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIXYubGVuZ3RoKSB7XG4gICAgb2JqW2tleV0gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoa2V5ID09PSAnVE9XR1M4NCcpIHtcbiAgICBvYmpba2V5XSA9IHY7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChrZXkgPT09ICdBWElTJykge1xuICAgIGlmICghKGtleSBpbiBvYmopKSB7XG4gICAgICBvYmpba2V5XSA9IFtdO1xuICAgIH1cbiAgICBvYmpba2V5XS5wdXNoKHYpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIUFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgIG9ialtrZXldID0ge307XG4gIH1cblxuICB2YXIgaTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlICdVTklUJzpcbiAgICBjYXNlICdQUklNRU0nOlxuICAgIGNhc2UgJ1ZFUlRfREFUVU0nOlxuICAgICAgb2JqW2tleV0gPSB7XG4gICAgICAgIG5hbWU6IHZbMF0udG9Mb3dlckNhc2UoKSxcbiAgICAgICAgY29udmVydDogdlsxXVxuICAgICAgfTtcbiAgICAgIGlmICh2Lmxlbmd0aCA9PT0gMykge1xuICAgICAgICBzRXhwcih2WzJdLCBvYmpba2V5XSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgY2FzZSAnU1BIRVJPSUQnOlxuICAgIGNhc2UgJ0VMTElQU09JRCc6XG4gICAgICBvYmpba2V5XSA9IHtcbiAgICAgICAgbmFtZTogdlswXSxcbiAgICAgICAgYTogdlsxXSxcbiAgICAgICAgcmY6IHZbMl1cbiAgICAgIH07XG4gICAgICBpZiAodi5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgc0V4cHIodlszXSwgb2JqW2tleV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIGNhc2UgJ0VEQVRVTSc6XG4gICAgY2FzZSAnRU5HSU5FRVJJTkdEQVRVTSc6XG4gICAgY2FzZSAnTE9DQUxfREFUVU0nOlxuICAgIGNhc2UgJ0RBVFVNJzpcbiAgICBjYXNlICdWRVJUX0NTJzpcbiAgICBjYXNlICdWRVJUQ1JTJzpcbiAgICBjYXNlICdWRVJUSUNBTENSUyc6XG4gICAgICB2WzBdID0gWyduYW1lJywgdlswXV07XG4gICAgICBtYXBpdChvYmosIGtleSwgdik7XG4gICAgICByZXR1cm47XG4gICAgY2FzZSAnQ09NUERfQ1MnOlxuICAgIGNhc2UgJ0NPTVBPVU5EQ1JTJzpcbiAgICBjYXNlICdGSVRURURfQ1MnOlxuICAgIC8vIHRoZSBmb2xsb3dpbmdzIGFyZSB0aGUgY3JzIGRlZmluZWQgaW5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcHJvajRqcy9wcm9qNGpzL2Jsb2IvMWRhNGVkMGI4NjVkMGZjYjUxYzEzNjA5MDU2OTIxMGNkY2M5MDE5ZS9saWIvcGFyc2VDb2RlLmpzI0wxMVxuICAgIGNhc2UgJ1BST0pFQ1RFRENSUyc6XG4gICAgY2FzZSAnUFJPSkNSUyc6XG4gICAgY2FzZSAnR0VPR0NTJzpcbiAgICBjYXNlICdHRU9DQ1MnOlxuICAgIGNhc2UgJ1BST0pDUyc6XG4gICAgY2FzZSAnTE9DQUxfQ1MnOlxuICAgIGNhc2UgJ0dFT0RDUlMnOlxuICAgIGNhc2UgJ0dFT0RFVElDQ1JTJzpcbiAgICBjYXNlICdHRU9ERVRJQ0RBVFVNJzpcbiAgICBjYXNlICdFTkdDUlMnOlxuICAgIGNhc2UgJ0VOR0lORUVSSU5HQ1JTJzpcbiAgICAgIHZbMF0gPSBbJ25hbWUnLCB2WzBdXTtcbiAgICAgIG1hcGl0KG9iaiwga2V5LCB2KTtcbiAgICAgIG9ialtrZXldLnR5cGUgPSBrZXk7XG4gICAgICByZXR1cm47XG4gICAgZGVmYXVsdDpcbiAgICAgIGkgPSAtMTtcbiAgICAgIHdoaWxlICgrK2kgPCB2Lmxlbmd0aCkge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodltpXSkpIHtcbiAgICAgICAgICByZXR1cm4gc0V4cHIodiwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwaXQob2JqLCBrZXksIHYpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhcHBseVByb2plY3Rpb25EZWZhdWx0cyB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBwcm9jZXNzIHVuaXRzIGFuZCB0b19tZXRlclxuZnVuY3Rpb24gcHJvY2Vzc1VuaXQodW5pdCkge1xuICBsZXQgcmVzdWx0ID0geyB1bml0czogbnVsbCwgdG9fbWV0ZXI6IHVuZGVmaW5lZCB9O1xuXG4gIGlmICh0eXBlb2YgdW5pdCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXN1bHQudW5pdHMgPSB1bml0LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHJlc3VsdC51bml0cyA9PT0gJ21ldHJlJykge1xuICAgICAgcmVzdWx0LnVuaXRzID0gJ21ldGVyJzsgLy8gTm9ybWFsaXplICdtZXRyZScgdG8gJ21ldGVyJ1xuICAgIH1cbiAgICBpZiAocmVzdWx0LnVuaXRzID09PSAnbWV0ZXInKSB7XG4gICAgICByZXN1bHQudG9fbWV0ZXIgPSAxOyAvLyBPbmx5IHNldCB0b19tZXRlciBpZiB1bml0cyBhcmUgJ21ldGVyJ1xuICAgIH1cbiAgfSBlbHNlIGlmICh1bml0ICYmIHVuaXQubmFtZSkge1xuICAgIHJlc3VsdC51bml0cyA9IHVuaXQubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChyZXN1bHQudW5pdHMgPT09ICdtZXRyZScpIHtcbiAgICAgIHJlc3VsdC51bml0cyA9ICdtZXRlcic7IC8vIE5vcm1hbGl6ZSAnbWV0cmUnIHRvICdtZXRlcidcbiAgICB9XG4gICAgcmVzdWx0LnRvX21ldGVyID0gdW5pdC5jb252ZXJzaW9uX2ZhY3RvcjtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHRvVmFsdWUodmFsdWVPck9iamVjdCkge1xuICBpZiAodHlwZW9mIHZhbHVlT3JPYmplY3QgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHZhbHVlT3JPYmplY3QudmFsdWUgKiB2YWx1ZU9yT2JqZWN0LnVuaXQuY29udmVyc2lvbl9mYWN0b3I7XG4gIH1cbiAgcmV0dXJuIHZhbHVlT3JPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUVsbGlwc29pZCh2YWx1ZSwgcmVzdWx0KSB7XG4gIGlmICh2YWx1ZS5lbGxpcHNvaWQucmFkaXVzKSB7XG4gICAgcmVzdWx0LmEgPSB2YWx1ZS5lbGxpcHNvaWQucmFkaXVzO1xuICAgIHJlc3VsdC5yZiA9IDA7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0LmEgPSB0b1ZhbHVlKHZhbHVlLmVsbGlwc29pZC5zZW1pX21ham9yX2F4aXMpO1xuICAgIGlmICh2YWx1ZS5lbGxpcHNvaWQuaW52ZXJzZV9mbGF0dGVuaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5yZiA9IHZhbHVlLmVsbGlwc29pZC5pbnZlcnNlX2ZsYXR0ZW5pbmc7XG4gICAgfSBlbHNlIGlmICh2YWx1ZS5lbGxpcHNvaWQuc2VtaV9tYWpvcl9heGlzICE9PSB1bmRlZmluZWQgJiYgdmFsdWUuZWxsaXBzb2lkLnNlbWlfbWlub3JfYXhpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQucmYgPSByZXN1bHQuYSAvIChyZXN1bHQuYSAtIHRvVmFsdWUodmFsdWUuZWxsaXBzb2lkLnNlbWlfbWlub3JfYXhpcykpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUFJPSkpTT04ocHJvampzb24sIHJlc3VsdCA9IHt9KSB7XG4gIGlmICghcHJvampzb24gfHwgdHlwZW9mIHByb2pqc29uICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBwcm9qanNvbjsgLy8gUmV0dXJuIHByaW1pdGl2ZSB2YWx1ZXMgYXMtaXNcbiAgfVxuXG4gIGlmIChwcm9qanNvbi50eXBlID09PSAnQm91bmRDUlMnKSB7XG4gICAgdHJhbnNmb3JtUFJPSkpTT04ocHJvampzb24uc291cmNlX2NycywgcmVzdWx0KTtcblxuICAgIGlmIChwcm9qanNvbi50cmFuc2Zvcm1hdGlvbikge1xuICAgICAgaWYgKHByb2pqc29uLnRyYW5zZm9ybWF0aW9uLm1ldGhvZCAmJiBwcm9qanNvbi50cmFuc2Zvcm1hdGlvbi5tZXRob2QubmFtZSA9PT0gJ05UdjInKSB7XG4gICAgICAgIC8vIFNldCBuYWRncmlkcyB0byB0aGUgZmlsZW5hbWUgZnJvbSB0aGUgcGFyYW1ldGVyZmlsZVxuICAgICAgICByZXN1bHQubmFkZ3JpZHMgPSBwcm9qanNvbi50cmFuc2Zvcm1hdGlvbi5wYXJhbWV0ZXJzWzBdLnZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUG9wdWxhdGUgZGF0dW1fcGFyYW1zIGlmIG5vIHBhcmFtZXRlcmZpbGUgaXMgZm91bmRcbiAgICAgICAgcmVzdWx0LmRhdHVtX3BhcmFtcyA9IHByb2pqc29uLnRyYW5zZm9ybWF0aW9uLnBhcmFtZXRlcnMubWFwKChwYXJhbSkgPT4gcGFyYW0udmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0OyAvLyBSZXR1cm4gZWFybHkgZm9yIEJvdW5kQ1JTXG4gIH1cblxuICAvLyBIYW5kbGUgc3BlY2lmaWMga2V5cyBpbiBQUk9KSlNPTlxuICBPYmplY3Qua2V5cyhwcm9qanNvbikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBwcm9qanNvbltrZXldO1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlICduYW1lJzpcbiAgICAgICAgaWYgKHJlc3VsdC5zcnNDb2RlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0Lm5hbWUgPSB2YWx1ZTtcbiAgICAgICAgcmVzdWx0LnNyc0NvZGUgPSB2YWx1ZTsgLy8gTWFwIGBuYW1lYCB0byBgc3JzQ29kZWBcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3R5cGUnOlxuICAgICAgICBpZiAodmFsdWUgPT09ICdHZW9ncmFwaGljQ1JTJykge1xuICAgICAgICAgIHJlc3VsdC5wcm9qTmFtZSA9ICdsb25nbGF0JztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ1Byb2plY3RlZENSUycgJiYgcHJvampzb24uY29udmVyc2lvbiAmJiBwcm9qanNvbi5jb252ZXJzaW9uLm1ldGhvZCkge1xuICAgICAgICAgIHJlc3VsdC5wcm9qTmFtZSA9IHByb2pqc29uLmNvbnZlcnNpb24ubWV0aG9kLm5hbWU7IC8vIFJldGFpbiBvcmlnaW5hbCBjYXBpdGFsaXphdGlvblxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdkYXR1bSc6XG4gICAgICBjYXNlICdkYXR1bV9lbnNlbWJsZSc6IC8vIEhhbmRsZSBib3RoIGRhdHVtIGFuZCBlbnNlbWJsZVxuICAgICAgICBpZiAodmFsdWUuZWxsaXBzb2lkKSB7XG4gICAgICAgICAgLy8gRXh0cmFjdCBlbGxpcHNvaWQgcHJvcGVydGllc1xuICAgICAgICAgIHJlc3VsdC5lbGxwcyA9IHZhbHVlLmVsbGlwc29pZC5uYW1lO1xuICAgICAgICAgIGNhbGN1bGF0ZUVsbGlwc29pZCh2YWx1ZSwgcmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUucHJpbWVfbWVyaWRpYW4pIHtcbiAgICAgICAgICByZXN1bHQuZnJvbV9ncmVlbndpY2ggPSB2YWx1ZS5wcmltZV9tZXJpZGlhbi5sb25naXR1ZGUgKiBNYXRoLlBJIC8gMTgwOyAvLyBDb252ZXJ0IHRvIHJhZGlhbnNcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZWxsaXBzb2lkJzpcbiAgICAgICAgcmVzdWx0LmVsbHBzID0gdmFsdWUubmFtZTtcbiAgICAgICAgY2FsY3VsYXRlRWxsaXBzb2lkKHZhbHVlLCByZXN1bHQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncHJpbWVfbWVyaWRpYW4nOlxuICAgICAgICByZXN1bHQubG9uZzAgPSAodmFsdWUubG9uZ2l0dWRlIHx8IDApICogTWF0aC5QSSAvIDE4MDsgLy8gQ29udmVydCB0byByYWRpYW5zXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjb29yZGluYXRlX3N5c3RlbSc6XG4gICAgICAgIGlmICh2YWx1ZS5heGlzKSB7XG4gICAgICAgICAgcmVzdWx0LmF4aXMgPSB2YWx1ZS5heGlzXG4gICAgICAgICAgICAubWFwKChheGlzKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGF4aXMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnZWFzdCcpIHJldHVybiAnZSc7XG4gICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdub3J0aCcpIHJldHVybiAnbic7XG4gICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd3ZXN0JykgcmV0dXJuICd3JztcbiAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3NvdXRoJykgcmV0dXJuICdzJztcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGF4aXMgZGlyZWN0aW9uOiAke2RpcmVjdGlvbn1gKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignJykgKyAndSc7IC8vIENvbWJpbmUgaW50byBhIHNpbmdsZSBzdHJpbmcgKGUuZy4sIFwiZW51XCIpXG5cbiAgICAgICAgICBpZiAodmFsdWUudW5pdCkge1xuICAgICAgICAgICAgY29uc3QgeyB1bml0cywgdG9fbWV0ZXIgfSA9IHByb2Nlc3NVbml0KHZhbHVlLnVuaXQpO1xuICAgICAgICAgICAgcmVzdWx0LnVuaXRzID0gdW5pdHM7XG4gICAgICAgICAgICByZXN1bHQudG9fbWV0ZXIgPSB0b19tZXRlcjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmF4aXNbMF0gJiYgdmFsdWUuYXhpc1swXS51bml0KSB7XG4gICAgICAgICAgICBjb25zdCB7IHVuaXRzLCB0b19tZXRlciB9ID0gcHJvY2Vzc1VuaXQodmFsdWUuYXhpc1swXS51bml0KTtcbiAgICAgICAgICAgIHJlc3VsdC51bml0cyA9IHVuaXRzO1xuICAgICAgICAgICAgcmVzdWx0LnRvX21ldGVyID0gdG9fbWV0ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgIGNhc2UgJ2lkJzpcbiAgICAgICAgaWYgKHZhbHVlLmF1dGhvcml0eSAmJiB2YWx1ZS5jb2RlKSB7XG4gICAgICAgICAgcmVzdWx0LnRpdGxlID0gdmFsdWUuYXV0aG9yaXR5ICsgJzonICsgdmFsdWUuY29kZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY29udmVyc2lvbic6XG4gICAgICAgIGlmICh2YWx1ZS5tZXRob2QgJiYgdmFsdWUubWV0aG9kLm5hbWUpIHtcbiAgICAgICAgICByZXN1bHQucHJvak5hbWUgPSB2YWx1ZS5tZXRob2QubmFtZTsgLy8gUmV0YWluIG9yaWdpbmFsIGNhcGl0YWxpemF0aW9uXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLnBhcmFtZXRlcnMpIHtcbiAgICAgICAgICB2YWx1ZS5wYXJhbWV0ZXJzLmZvckVhY2goKHBhcmFtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbU5hbWUgPSBwYXJhbS5uYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nLCAnXycpO1xuICAgICAgICAgICAgY29uc3QgcGFyYW1WYWx1ZSA9IHBhcmFtLnZhbHVlO1xuICAgICAgICAgICAgaWYgKHBhcmFtLnVuaXQgJiYgcGFyYW0udW5pdC5jb252ZXJzaW9uX2ZhY3Rvcikge1xuICAgICAgICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IHBhcmFtVmFsdWUgKiBwYXJhbS51bml0LmNvbnZlcnNpb25fZmFjdG9yOyAvLyBDb252ZXJ0IHRvIHJhZGlhbnMgb3IgbWV0ZXJzXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtLnVuaXQgPT09ICdkZWdyZWUnKSB7XG4gICAgICAgICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gcGFyYW1WYWx1ZSAqIE1hdGguUEkgLyAxODA7IC8vIENvbnZlcnQgdG8gcmFkaWFuc1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBwYXJhbVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd1bml0JzpcbiAgICAgICAgaWYgKHZhbHVlLm5hbWUpIHtcbiAgICAgICAgICByZXN1bHQudW5pdHMgPSB2YWx1ZS5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgaWYgKHJlc3VsdC51bml0cyA9PT0gJ21ldHJlJykge1xuICAgICAgICAgICAgcmVzdWx0LnVuaXRzID0gJ21ldGVyJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLmNvbnZlcnNpb25fZmFjdG9yKSB7XG4gICAgICAgICAgcmVzdWx0LnRvX21ldGVyID0gdmFsdWUuY29udmVyc2lvbl9mYWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2Jhc2VfY3JzJzpcbiAgICAgICAgdHJhbnNmb3JtUFJPSkpTT04odmFsdWUsIHJlc3VsdCk7IC8vIFBhc3MgYHJlc3VsdGAgZGlyZWN0bHlcbiAgICAgICAgcmVzdWx0LmRhdHVtQ29kZSA9IHZhbHVlLmlkID8gdmFsdWUuaWQuYXV0aG9yaXR5ICsgJ18nICsgdmFsdWUuaWQuY29kZSA6IHZhbHVlLm5hbWU7IC8vIFNldCBkYXR1bUNvZGVcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIElnbm9yZSBpcnJlbGV2YW50IG9yIHVubmVlZGVkIHByb3BlcnRpZXNcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxuICAvLyBBZGRpdGlvbmFsIGNhbGN1bGF0ZWQgcHJvcGVydGllc1xuICBpZiAocmVzdWx0LmxhdGl0dWRlX29mX2ZhbHNlX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDAgPSByZXN1bHQubGF0aXR1ZGVfb2ZfZmFsc2Vfb3JpZ2luOyAvLyBBbHJlYWR5IGluIHJhZGlhbnNcbiAgfVxuICBpZiAocmVzdWx0LmxvbmdpdHVkZV9vZl9mYWxzZV9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sb25nMCA9IHJlc3VsdC5sb25naXR1ZGVfb2ZfZmFsc2Vfb3JpZ2luO1xuICB9XG4gIGlmIChyZXN1bHQubGF0aXR1ZGVfb2Zfc3RhbmRhcmRfcGFyYWxsZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQwID0gcmVzdWx0LmxhdGl0dWRlX29mX3N0YW5kYXJkX3BhcmFsbGVsO1xuICAgIHJlc3VsdC5sYXQxID0gcmVzdWx0LmxhdGl0dWRlX29mX3N0YW5kYXJkX3BhcmFsbGVsO1xuICB9XG4gIGlmIChyZXN1bHQubGF0aXR1ZGVfb2ZfMXN0X3N0YW5kYXJkX3BhcmFsbGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MSA9IHJlc3VsdC5sYXRpdHVkZV9vZl8xc3Rfc3RhbmRhcmRfcGFyYWxsZWw7XG4gIH1cbiAgaWYgKHJlc3VsdC5sYXRpdHVkZV9vZl8ybmRfc3RhbmRhcmRfcGFyYWxsZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQyID0gcmVzdWx0LmxhdGl0dWRlX29mXzJuZF9zdGFuZGFyZF9wYXJhbGxlbDsgXG4gIH1cbiAgaWYgKHJlc3VsdC5sYXRpdHVkZV9vZl9wcm9qZWN0aW9uX2NlbnRyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxhdDAgPSByZXN1bHQubGF0aXR1ZGVfb2ZfcHJvamVjdGlvbl9jZW50cmU7XG4gIH1cbiAgaWYgKHJlc3VsdC5sb25naXR1ZGVfb2ZfcHJvamVjdGlvbl9jZW50cmUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sb25nYyA9IHJlc3VsdC5sb25naXR1ZGVfb2ZfcHJvamVjdGlvbl9jZW50cmU7XG4gIH1cbiAgaWYgKHJlc3VsdC5lYXN0aW5nX2F0X2ZhbHNlX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LngwID0gcmVzdWx0LmVhc3RpbmdfYXRfZmFsc2Vfb3JpZ2luO1xuICB9XG4gIGlmIChyZXN1bHQubm9ydGhpbmdfYXRfZmFsc2Vfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQueTAgPSByZXN1bHQubm9ydGhpbmdfYXRfZmFsc2Vfb3JpZ2luO1xuICB9XG4gIGlmIChyZXN1bHQubGF0aXR1ZGVfb2ZfbmF0dXJhbF9vcmlnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQwID0gcmVzdWx0LmxhdGl0dWRlX29mX25hdHVyYWxfb3JpZ2luO1xuICB9XG4gIGlmIChyZXN1bHQubG9uZ2l0dWRlX29mX25hdHVyYWxfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubG9uZzAgPSByZXN1bHQubG9uZ2l0dWRlX29mX25hdHVyYWxfb3JpZ2luO1xuICB9XG4gIGlmIChyZXN1bHQubG9uZ2l0dWRlX29mX29yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmxvbmcwID0gcmVzdWx0LmxvbmdpdHVkZV9vZl9vcmlnaW47XG4gIH1cbiAgaWYgKHJlc3VsdC5mYWxzZV9lYXN0aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQueDAgPSByZXN1bHQuZmFsc2VfZWFzdGluZztcbiAgfVxuICBpZiAocmVzdWx0LmVhc3RpbmdfYXRfcHJvamVjdGlvbl9jZW50cmUpIHtcbiAgICByZXN1bHQueDAgPSByZXN1bHQuZWFzdGluZ19hdF9wcm9qZWN0aW9uX2NlbnRyZTtcbiAgfVxuICBpZiAocmVzdWx0LmZhbHNlX25vcnRoaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQueTAgPSByZXN1bHQuZmFsc2Vfbm9ydGhpbmc7XG4gIH1cbiAgaWYgKHJlc3VsdC5ub3J0aGluZ19hdF9wcm9qZWN0aW9uX2NlbnRyZSkge1xuICAgIHJlc3VsdC55MCA9IHJlc3VsdC5ub3J0aGluZ19hdF9wcm9qZWN0aW9uX2NlbnRyZTtcbiAgfVxuICBpZiAocmVzdWx0LnN0YW5kYXJkX3BhcmFsbGVsXzEgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5sYXQxID0gcmVzdWx0LnN0YW5kYXJkX3BhcmFsbGVsXzE7XG4gIH1cbiAgaWYgKHJlc3VsdC5zdGFuZGFyZF9wYXJhbGxlbF8yICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQubGF0MiA9IHJlc3VsdC5zdGFuZGFyZF9wYXJhbGxlbF8yO1xuICB9XG4gIGlmIChyZXN1bHQuc2NhbGVfZmFjdG9yX2F0X25hdHVyYWxfb3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQuazAgPSByZXN1bHQuc2NhbGVfZmFjdG9yX2F0X25hdHVyYWxfb3JpZ2luO1xuICB9XG4gIGlmIChyZXN1bHQuc2NhbGVfZmFjdG9yX2F0X3Byb2plY3Rpb25fY2VudHJlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXN1bHQuazAgPSByZXN1bHQuc2NhbGVfZmFjdG9yX2F0X3Byb2plY3Rpb25fY2VudHJlO1xuICB9XG4gIGlmIChyZXN1bHQuc2NhbGVfZmFjdG9yX29uX3BzZXVkb19zdGFuZGFyZF9wYXJhbGxlbCAhPT0gdW5kZWZpbmVkKSB7ICBcbiAgICByZXN1bHQuazAgPSByZXN1bHQuc2NhbGVfZmFjdG9yX29uX3BzZXVkb19zdGFuZGFyZF9wYXJhbGxlbDtcbiAgfVxuICBpZiAocmVzdWx0LmF6aW11dGggIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5hbHBoYSA9IHJlc3VsdC5hemltdXRoO1xuICB9XG4gIGlmIChyZXN1bHQuYXppbXV0aF9hdF9wcm9qZWN0aW9uX2NlbnRyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzdWx0LmFscGhhID0gcmVzdWx0LmF6aW11dGhfYXRfcHJvamVjdGlvbl9jZW50cmU7XG4gIH1cbiAgaWYgKHJlc3VsdC5hbmdsZV9mcm9tX3JlY3RpZmllZF90b19za2V3X2dyaWQpIHtcbiAgICByZXN1bHQucmVjdGlmaWVkX2dyaWRfYW5nbGUgPSByZXN1bHQuYW5nbGVfZnJvbV9yZWN0aWZpZWRfdG9fc2tld19ncmlkO1xuICB9XG5cbiAgLy8gQXBwbHkgcHJvamVjdGlvbiBkZWZhdWx0c1xuICBhcHBseVByb2plY3Rpb25EZWZhdWx0cyhyZXN1bHQpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59IiwidmFyIEQyUiA9IDAuMDE3NDUzMjkyNTE5OTQzMjk1Nzc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkMnIoaW5wdXQpIHtcbiAgcmV0dXJuIGlucHV0ICogRDJSO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQcm9qZWN0aW9uRGVmYXVsdHMod2t0KSB7XG4gIC8vIE5vcm1hbGl6ZSBwcm9qTmFtZSBmb3IgV0tUMiBjb21wYXRpYmlsaXR5XG4gIGNvbnN0IG5vcm1hbGl6ZWRQcm9qTmFtZSA9ICh3a3QucHJvak5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpO1xuXG4gIGlmICghd2t0LmxvbmcwICYmIHdrdC5sb25nYyAmJiAobm9ybWFsaXplZFByb2pOYW1lID09PSAnYWxiZXJzIGNvbmljIGVxdWFsIGFyZWEnIHx8IG5vcm1hbGl6ZWRQcm9qTmFtZSA9PT0gJ2xhbWJlcnQgYXppbXV0aGFsIGVxdWFsIGFyZWEnKSkge1xuICAgIHdrdC5sb25nMCA9IHdrdC5sb25nYztcbiAgfVxuICBpZiAoIXdrdC5sYXRfdHMgJiYgd2t0LmxhdDEgJiYgKG5vcm1hbGl6ZWRQcm9qTmFtZSA9PT0gJ3N0ZXJlb2dyYXBoaWMgc291dGggcG9sZScgfHwgbm9ybWFsaXplZFByb2pOYW1lID09PSAncG9sYXIgc3RlcmVvZ3JhcGhpYyAodmFyaWFudCBiKScpKSB7XG4gICAgd2t0LmxhdDAgPSBkMnIod2t0LmxhdDEgPiAwID8gOTAgOiAtOTApO1xuICAgIHdrdC5sYXRfdHMgPSB3a3QubGF0MTtcbiAgICBkZWxldGUgd2t0LmxhdDE7XG4gIH0gZWxzZSBpZiAoIXdrdC5sYXRfdHMgJiYgd2t0LmxhdDAgJiYgKG5vcm1hbGl6ZWRQcm9qTmFtZSA9PT0gJ3BvbGFyIHN0ZXJlb2dyYXBoaWMnIHx8IG5vcm1hbGl6ZWRQcm9qTmFtZSA9PT0gJ3BvbGFyIHN0ZXJlb2dyYXBoaWMgKHZhcmlhbnQgYSknKSkge1xuICAgIHdrdC5sYXRfdHMgPSB3a3QubGF0MDtcbiAgICB3a3QubGF0MCA9IGQycih3a3QubGF0MCA+IDAgPyA5MCA6IC05MCk7XG4gICAgZGVsZXRlIHdrdC5sYXQxO1xuICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvL0B0cy1jaGVja1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBwcm9qNCBmcm9tIFwicHJvajRcIjtcblxuLy8gRVBTRzozMDM1IGRlZmluaXRpb25cbnByb2o0LmRlZnMoXCJFUFNHOjMwMzVcIixcbiAgXCIrcHJvaj1sYWVhICtsYXRfMD01MiArbG9uXzA9MTAgK3hfMD00MzIxMDAwICt5XzA9MzIxMDAwMCArZWxscHM9R1JTODAgK3VuaXRzPW0gK25vX2RlZnNcIlxuKTtcbmNvbnN0IHRyYW5zZm9ybSA9IHByb2o0KHByb2o0LldHUzg0LCBcIkVQU0c6MzAzNVwiKTtcblxuLyoqXG4gKiBQcm9qZWN0aW9uIGZ1bmN0aW9uIGZvciBFdXJvcGVhbiBMQUVBLlxuICogRnJvbSBbbG9uLGxhdF0gdG8gW3gseV1cbiAqL1xuZXhwb3J0IGNvbnN0IHByb2ozMDM1ID0gdHJhbnNmb3JtLmZvcndhcmQ7XG5cblxuLy90ZXN0XG4vL2NvbnNvbGUubG9nKHByb2ozMDM1KFszMy4wMDMsIDM0Ljc0N10pKVxuLy8xNjE1MDY3LDIgIDY0MTU3MjgsNVxuXG5cbi8vaW1wb3J0IHsgZ2VvQXppbXV0aGFsRXF1YWxBcmVhIH0gZnJvbSAnZDMtZ2VvJ1xuLy9cImQzLWdlb1wiOiBcIl4zLjAuMVwiLFxuXG4vKmV4cG9ydCBjb25zdCBwcm9qMzAzNSA9IGdlb0F6aW11dGhhbEVxdWFsQXJlYSgpXG4gICAgLnJvdGF0ZShbLTEwLCAtNTJdKVxuICAgIC5yZWZsZWN0WChmYWxzZSlcbiAgICAucmVmbGVjdFkodHJ1ZSlcbiAgICAuc2NhbGUoNjM3MDk5NykgLy82Mzc4MTM3XG4gICAgLnRyYW5zbGF0ZShbNDMyMTAwMCwgMzIxMDAwMF0pXG4qL1xuXG5cblxuXG4vKipcbiAqIFJldHVybnMgb3B0aW9ucyBmb3IgZ3JpZHZpeiBsYWJlbCBsYXllci5cbiAqIEZyb20gRXVyb255bSBkYXRhOiBodHRwczovL2dpdGh1Yi5jb20vZXVyb3N0YXQvZXVyb255bVxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFdXJvbnltZUxhYmVsTGF5ZXIgPSBmdW5jdGlvbiAoY2MgPSAnRVVSJywgcmVzID0gNTAsIG9wdHM9e30pIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fVxuICAgIGNvbnN0IGV4ID0gb3B0cy5leCB8fCAxLjJcbiAgICBjb25zdCBmb250RmFtaWx5ID0gb3B0cy5mb250RmFtaWx5IHx8ICdBcmlhbCdcbiAgICBjb25zdCBleFNpemUgPSBvcHRzLmV4U2l6ZSB8fCAxLjJcbiAgICBvcHRzLnN0eWxlID1cbiAgICAgICAgb3B0cy5zdHlsZSB8fFxuICAgICAgICAoKGxiLCB6ZikgPT4ge1xuICAgICAgICAgICAgaWYgKGxiLnJzIDwgZXggKiB6ZikgcmV0dXJuXG4gICAgICAgICAgICBpZiAobGIucjEgPCBleCAqIHpmKSByZXR1cm4gZXhTaXplICsgJ2VtICcgKyBmb250RmFtaWx5XG4gICAgICAgICAgICByZXR1cm4gZXhTaXplICogMS41ICsgJ2VtICcgKyBmb250RmFtaWx5XG4gICAgICAgIH0pXG4gICAgb3B0cy5wcm9qID0gb3B0cy5wcm9qIHx8IHByb2ozMDM1XG4gICAgb3B0cy5wcmVwcm9jZXNzID0gKGxiKSA9PiB7XG4gICAgICAgIC8vZXhjbHVkZSBjb3VudHJpZXNcbiAgICAgICAgLy9pZihvcHRzLmNjT3V0ICYmIGxiLmNjICYmIG9wdHMuY2NPdXQuaW5jbHVkZXMobGIuY2MpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChvcHRzLmNjSW4gJiYgbGIuY2MgJiYgIShvcHRzLmNjSW4uaW5kZXhPZihsYi5jYykgPj0gMCkpIHJldHVybiBmYWxzZVxuXG4gICAgICAgIC8vcHJvamVjdCBmcm9tIGdlbyBjb29yZGluYXRlcyB0byBFVFJTODktTEFFQVxuICAgICAgICBjb25zdCBwID0gb3B0cy5wcm9qKFsrbGIubG9uLCArbGIubGF0XSlcbiAgICAgICAgbGIueCA9IHBbMF1cbiAgICAgICAgbGIueSA9IHBbMV1cbiAgICAgICAgZGVsZXRlIGxiLmxvblxuICAgICAgICBkZWxldGUgbGIubGF0XG4gICAgfVxuICAgIG9wdHMuYmFzZVVSTCA9IG9wdHMuYmFzZVVSTCB8fCAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2V1cm9zdGF0L2V1cm9ueW0vbWFpbi9wdWIvdjMvVVRGX0xBVElOLydcbiAgICBvcHRzLnVybCA9IG9wdHMuYmFzZVVSTCArIHJlcyArICcvJyArIGNjICsgJy5jc3YnXG4gICAgcmV0dXJuIG9wdHNcbn1cblxuXG4vKipcbiAqIFJldHVybnMgb3B0aW9ucyBmb3IgZ3JpZHZpeiBib3VuZGFyaWVzIGxheWVyLlxuICogRnJvbSBOdXRzMmpzb24gZGF0YTogaHR0cHM6Ly9naXRodWIuY29tL2V1cm9zdGF0L051dHMyanNvblxuICogXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgZ2V0RXVyb3N0YXRCb3VuZGFyaWVzTGF5ZXIgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgY29uc3QgbnV0c1llYXIgPSBvcHRzLm51dHNZZWFyIHx8ICcyMDIxJ1xuICAgIGNvbnN0IGdlbyA9IG9wdHMuZ2VvXG4gICAgY29uc3QgY3JzID0gb3B0cy5jcnMgfHwgJzMwMzUnXG4gICAgY29uc3Qgc2NhbGUgPSBvcHRzLnNjYWxlIHx8ICcwM00nXG4gICAgY29uc3QgbnV0c0xldmVsID0gb3B0cy5udXRzTGV2ZWwgfHwgJzMnXG4gICAgY29uc3QgY29sID0gb3B0cy5jb2wgfHwgJyM4ODgnXG4gICAgY29uc3QgY29sS29zb3ZvID0gb3B0cy5jb2xLb3Nvdm8gfHwgJyNiY2JjYmMnXG4gICAgY29uc3Qgc2hvd090aCA9IG9wdHMuc2hvd090aCA9PSB1bmRlZmluZWQgPyB0cnVlIDogb3B0cy5zaG93T3RoXG5cbiAgICAvL2luIG1vc3Qgb2YgdGhlIGNhc2UsIGFscmVhZHkgcHJvamVjdGVkIGRhdGEgb2YgbnV0czJqc29uIHdpbGwgYmUgdXNlZCwgdXNpbmcgJ29wdHMuY3JzJ1xuICAgIGlmIChvcHRzLnByb2opXG4gICAgICAgIG9wdHMucHJlcHJvY2VzcyA9IChibikgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYm4uZ2VvbWV0cnkudHlwZSA9PT0gXCJMaW5lU3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjcyA9IFtdXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYyBvZiBibi5nZW9tZXRyeS5jb29yZGluYXRlcylcbiAgICAgICAgICAgICAgICAgICAgY3MucHVzaChvcHRzLnByb2ooYykpXG4gICAgICAgICAgICAgICAgYm4uZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBjc1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDb3VsZCBub3QgcHJvamVjdCBib3VuZGFyeSAtIHVuc3VwcG9ydGVkIGdlb21ldHJ5IHR5cGU6IFwiICsgYm4uZ2VvbWV0cnkudHlwZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgIG9wdHMuY29sb3IgPVxuICAgICAgICBvcHRzLmNvbG9yIHx8XG4gICAgICAgICgoZiwgemYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBmLnByb3BlcnRpZXNcbiAgICAgICAgICAgIGlmICghc2hvd090aCAvKiYmIHAuY28gPT0gXCJGXCIqLyAmJiBwLmV1ICE9ICdUJyAmJiBwLmNjICE9ICdUJyAmJiBwLmVmdGEgIT0gJ1QnICYmIHAub3RoID09PSAnVCcpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBpZiAocC5pZCA+PSAxMDAwMDApIHJldHVybiBjb2xLb3Nvdm9cbiAgICAgICAgICAgIGlmIChwLmNvID09PSAnVCcpIHJldHVybiBjb2xcbiAgICAgICAgICAgIGlmICh6ZiA8IDQwMCkgcmV0dXJuIGNvbFxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAxMDAwKSByZXR1cm4gcC5sdmwgPj0gMyA/ICcnIDogY29sXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDIwMDApIHJldHVybiBwLmx2bCA+PSAyID8gJycgOiBjb2xcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHAubHZsID49IDEgPyAnJyA6IGNvbFxuICAgICAgICB9KVxuXG4gICAgb3B0cy53aWR0aCA9XG4gICAgICAgIG9wdHMud2lkdGggfHxcbiAgICAgICAgKChmLCB6ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IGYucHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKHAuY28gPT09ICdUJykgcmV0dXJuIDAuNVxuICAgICAgICAgICAgaWYgKHpmIDwgNDAwKSByZXR1cm4gcC5sdmwgPT0gMyA/IDIuMiA6IHAubHZsID09IDIgPyAyLjIgOiBwLmx2bCA9PSAxID8gMi4yIDogNFxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAxMDAwKSByZXR1cm4gcC5sdmwgPT0gMiA/IDEuOCA6IHAubHZsID09IDEgPyAxLjggOiAyLjVcbiAgICAgICAgICAgIGVsc2UgaWYgKHpmIDwgMjAwMCkgcmV0dXJuIHAubHZsID09IDEgPyAxLjggOiAyLjVcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIDEuMlxuICAgICAgICB9KVxuXG4gICAgb3B0cy5saW5lRGFzaCA9XG4gICAgICAgIG9wdHMubGluZURhc2ggfHxcbiAgICAgICAgKChmLCB6ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IGYucHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKHAuY28gPT09ICdUJykgcmV0dXJuIFtdXG4gICAgICAgICAgICBpZiAoemYgPCA0MDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHAubHZsID09IDNcbiAgICAgICAgICAgICAgICAgICAgPyBbMiAqIHpmLCAyICogemZdXG4gICAgICAgICAgICAgICAgICAgIDogcC5sdmwgPT0gMlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBbNSAqIHpmLCAyICogemZdXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHAubHZsID09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFs1ICogemYsIDIgKiB6Zl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsxMCAqIHpmLCAzICogemZdXG4gICAgICAgICAgICBlbHNlIGlmICh6ZiA8IDEwMDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHAubHZsID09IDIgPyBbNSAqIHpmLCAyICogemZdIDogcC5sdmwgPT0gMSA/IFs1ICogemYsIDIgKiB6Zl0gOiBbMTAgKiB6ZiwgMyAqIHpmXVxuICAgICAgICAgICAgZWxzZSBpZiAoemYgPCAyMDAwKSByZXR1cm4gcC5sdmwgPT0gMSA/IFs1ICogemYsIDIgKiB6Zl0gOiBbMTAgKiB6ZiwgMyAqIHpmXVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gWzEwICogemYsIDMgKiB6Zl1cbiAgICAgICAgfSlcblxuICAgIG9wdHMuYmFzZVVSTCA9IG9wdHMuYmFzZVVSTCB8fCAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2V1cm9zdGF0L051dHMyanNvbi9tYXN0ZXIvcHViL3YyLydcbiAgICBvcHRzLnVybCA9IG9wdHMuYmFzZVVSTCArIG51dHNZZWFyICsgKGdlbyA/ICcvJyArIGdlbyA6ICcnKSArICcvJyArIGNycyArICcvJyArIHNjYWxlICsgJy9udXRzYm5fJyArIG51dHNMZXZlbCArICcuanNvbidcbiAgICByZXR1cm4gb3B0c1xufVxuXG5cblxuLy9wcmVwYXJlIG9iamVjdCBmb3IgZ2lzY28gYmFja2dyb3VuZCBsYXllciBjcmVhdGlvblxuLy9zZWUgaHR0cHM6Ly9naXNjby1zZXJ2aWNlcy5lYy5ldXJvcGEuZXUvbWFwcy9kZW1vLz93bXRzX2xheWVyPU9TTVBvc2l0cm9uQmFja2dyb3VuZCZmb3JtYXQ9cG5nJnNycz1FUFNHJTNBMzAzNVxuZXhwb3J0IGZ1bmN0aW9uIGdpc2NvQmFja2dyb3VuZExheWVyKG1hcCA9IFwiT1NNUG9zaXRyb25CYWNrZ3JvdW5kXCIsIGRlcHRoID0gMTksIGNycyA9IFwiRVBTRzMwMzVcIiwgdGVtcGxhdGUgPSB7fSkge1xuICAgIHRlbXBsYXRlLnVybCA9IFwiaHR0cHM6Ly9naXNjby1zZXJ2aWNlcy5lYy5ldXJvcGEuZXUvbWFwcy90aWxlcy9cIiArIG1hcCArIFwiL1wiICsgY3JzICsgXCIvXCJcbiAgICB0ZW1wbGF0ZS5yZXNvbHV0aW9ucyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IGRlcHRoIH0sIChfLCBpKSA9PiAxNTY1NDMuMDMzOTI4MDQwOTcgKiBNYXRoLnBvdygyLCAtaSkpXG4gICAgdGVtcGxhdGUub3JpZ2luID0gWzAsIDYwMDAwMDBdXG4gICAgcmV0dXJuIHRlbXBsYXRlXG59XG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==