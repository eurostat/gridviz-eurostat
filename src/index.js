//@ts-check
'use strict'

import proj4 from "proj4";

// EPSG:3035 definition
proj4.defs("EPSG:3035",
  "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs"
);
const transform = proj4(proj4.WGS84, "EPSG:3035");

/**
 * Projection function for European LAEA.
 * From [lon,lat] to [x,y]
 */
export const proj3035 = transform.forward;


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
export const getEuronymeLabelLayer = function (cc = 'EUR', res = 50, opts) {
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
export const getEurostatBoundariesLayer = function (opts) {
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
export function giscoBackgroundLayer(map = "OSMPositronBackground", depth = 19, crs = "EPSG3035", template = {}) {
    template.url = "https://gisco-services.ec.europa.eu/maps/tiles/" + map + "/" + crs + "/"
    template.resolutions = Array.from({ length: depth }, (_, i) => 156543.03392804097 * Math.pow(2, -i))
    template.origin = [0, 6000000]
    return template
}
