// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"weightedChoice.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function weightedRandom(weights, normalizedValue) {
    var sumOfWeights = 0;
    for (var _i = 0, weights_1 = weights; _i < weights_1.length; _i++) {
        var item = weights_1[_i];
        sumOfWeights += item[1];
    }
    var randomValue = normalizedValue * sumOfWeights;
    var sumSoFar = 0;
    for (var _a = 0, weights_2 = weights; _a < weights_2.length; _a++) {
        var _b = weights_2[_a],
            value = _b[0],
            weight = _b[1];
        sumSoFar += weight;
        if (randomValue <= sumSoFar) {
            return value;
        }
    }
    throw new Error("Choice error: " + randomValue);
}
exports.default = weightedRandom;
},{}],"../node_modules/gaussian/lib/gaussian.js":[function(require,module,exports) {
(function (exports) {

  // Complementary error function
  // From Numerical Recipes in C 2e p221
  var erfc = function (x) {
    var z = Math.abs(x);
    var t = 1 / (1 + z / 2);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  };

  // Inverse complementary error function
  // From Numerical Recipes 3e p265
  var ierfc = function (x) {
    if (x >= 2) {
      return -100;
    }
    if (x <= 0) {
      return 100;
    }

    var xx = x < 1 ? x : 2 - x;
    var t = Math.sqrt(-2 * Math.log(xx / 2));

    var r = -0.70711 * ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t);

    for (var j = 0; j < 2; j++) {
      var err = erfc(r) - xx;
      r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err);
    }

    return x < 1 ? r : -r;
  };

  // Models the normal distribution
  var Gaussian = function (mean, variance) {
    if (variance <= 0) {
      throw new Error('Variance must be > 0 (but was ' + variance + ')');
    }
    this.mean = mean;
    this.variance = variance;
    this.standardDeviation = Math.sqrt(variance);
  };

  // Probability density function
  Gaussian.prototype.pdf = function (x) {
    var m = this.standardDeviation * Math.sqrt(2 * Math.PI);
    var e = Math.exp(-Math.pow(x - this.mean, 2) / (2 * this.variance));
    return e / m;
  };

  // Cumulative density function
  Gaussian.prototype.cdf = function (x) {
    return 0.5 * erfc(-(x - this.mean) / (this.standardDeviation * Math.sqrt(2)));
  };

  // Percent point function
  Gaussian.prototype.ppf = function (x) {
    return this.mean - this.standardDeviation * Math.sqrt(2) * ierfc(2 * x);
  };

  // Product distribution of this and d (scale for constant)
  Gaussian.prototype.mul = function (d) {
    if (typeof d === "number") {
      return this.scale(d);
    }
    var precision = 1 / this.variance;
    var dprecision = 1 / d.variance;
    return fromPrecisionMean(precision + dprecision, precision * this.mean + dprecision * d.mean);
  };

  // Quotient distribution of this and d (scale for constant)
  Gaussian.prototype.div = function (d) {
    if (typeof d === "number") {
      return this.scale(1 / d);
    }
    var precision = 1 / this.variance;
    var dprecision = 1 / d.variance;
    return fromPrecisionMean(precision - dprecision, precision * this.mean - dprecision * d.mean);
  };

  // Addition of this and d
  Gaussian.prototype.add = function (d) {
    return gaussian(this.mean + d.mean, this.variance + d.variance);
  };

  // Subtraction of this and d
  Gaussian.prototype.sub = function (d) {
    return gaussian(this.mean - d.mean, this.variance + d.variance);
  };

  // Scale this by constant c
  Gaussian.prototype.scale = function (c) {
    return gaussian(this.mean * c, this.variance * c * c);
  };

  var gaussian = function (mean, variance) {
    return new Gaussian(mean, variance);
  };

  var fromPrecisionMean = function (precision, precisionmean) {
    return gaussian(precisionmean / precision, 1 / precision);
  };

  exports(gaussian);
})(typeof exports !== "undefined" ? function (e) {
  module.exports = e;
} : function (e) {
  this["gaussian"] = e;
});
},{}],"stars.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var weightedChoice_1 = __importDefault(require("./weightedChoice"));
var gaussian_1 = __importDefault(require("gaussian"));
function normalizedToRange(min, max, val) {
    return min + (max - min) * val;
}
/* STARS */
var StarType;
(function (StarType) {
    /* Planets in HZ will be tidally locked very quickly, but about half of
       all M dwarfs will have a planet in the HZ
     */
    StarType["M"] = "M";
    /* Starting to look good. Kepler searches star types K-F.
     */
    StarType["K"] = "K";
    StarType["G"] = "G";
    StarType["F"] = "F";
    /* Stars age too quickly - only support life for about 2 billion years. Life may
       be microbial, but likely no trees.
     */
    StarType["A"] = "A";
    StarType["B"] = "B";
    /*
    Planetary dust disks located within 1.6 light-years of O-type stars are
    likely to be "boiled off" by superhot radiation and winds
    (therefore O-type stars likely won't have planets)
    */
    StarType["O"] = "O";
})(StarType = exports.StarType || (exports.StarType = {}));
// http://lup.lub.lu.se/luur/download?func=downloadFile&recordOId=8867455&fileOId=8870454
exports.StarTypeProbabilities = new Map([[StarType.M, 0.7645629], [StarType.K, 0.1213592], [StarType.G, 0.0764563], [StarType.F, 0.0303398], [StarType.A, 0.0060679], [StarType.B, 0.0012136], [StarType.O, 0.0000003]]);
exports.StarTemperature = new Map([[StarType.M, 3850], [StarType.K, 5300], [StarType.G, 5920], [StarType.F, 7240], [StarType.A, 9500], [StarType.B, 31000], [StarType.O, 41000]]);
exports.StarLuminosityMin = new Map([[StarType.M, 0.000158], [StarType.K, 0.086], [StarType.G, 0.58], [StarType.F, 1.54], [StarType.A, 4.42], [StarType.B, 21.2], [StarType.O, 26800]]);
exports.StarLuminosityMax = new Map([[StarType.M, 0.086], [StarType.K, 0.58], [StarType.G, 1.54], [StarType.F, 4.42], [StarType.A, 21.2], [StarType.B, 26800], [StarType.O, 78100000]]);
exports.StarRadiusMin = new Map([[StarType.M, 0.08], [StarType.K, 0.7], [StarType.G, 0.96], [StarType.F, 1.15], [StarType.A, 1.4], [StarType.B, 1.8], [StarType.O, 6.6]]);
exports.StarRadiusMax = new Map([[StarType.M, 0.7], [StarType.K, 0.96], [StarType.G, 1.15], [StarType.F, 1.4], [StarType.A, 1.8], [StarType.B, 6.6], [StarType.O, 12]]);
// http://www.vendian.org/mncharity/dir3/starcolor/
exports.StarColors = new Map([[StarType.O, '#9bb0ff'], [StarType.B, '#aabfff'], [StarType.A, '#cad7ff'], [StarType.F, '#f8f7ff'], [StarType.G, '#fff4ea'], [StarType.K, '#ffd2a1'], [StarType.M, '#ffcc6f']]);
// http://www.solstation.com/habitable.htm
/**
* ~44% of F6-K3 stars with 0.5-1.5 stellar masses are likely binary/multiple star systems,
* making stable orbits extremely unlikely unless the stars are close together.
*
* Inside HZ: "water is broken up by stellar radiation into oxygen and hydrogen...
* the freed hydrogen would escape to space due to the relatively puny
* gravitational pull of small rocky planets like Earth"
*
* Outside HZ: "atmospheric carbon dioxide condenses...which eliminates its
* greenhouse warming effect."
*
* Stars get brighter as they age, so HZ expands outward. CHZ = "continuously habitable zone"
* over time.
*/
exports.HabitableZonePlanetLikelihoods = new Map([[StarType.M, 0.0002], [StarType.K, 0.001], [StarType.G, 0.002], [StarType.F, 0.001],
// my sources don't discuss these star types, and they are rare, so just pick
// some random small values
[StarType.A, 0.0002], [StarType.B, 0.00015], [StarType.O, 0.0001]]);
// "normalized solar flux factor"
// http://www.solstation.com/habitable.htm
var SeffInner = new Map([[StarType.M, 1.05], [StarType.K, 1.05], [StarType.G, 1.41], [StarType.F, 1.9], [StarType.A, 0], [StarType.B, 0], [StarType.O, 0]]);
var SeffOuter = new Map([[StarType.M, 0.27], [StarType.K, 0.27], [StarType.G, 0.36], [StarType.F, 0.46], [StarType.A, 0], [StarType.B, 0], [StarType.O, 0]]);
function computeHabitableZoneHelper(luminosity, seff) {
    return 1 * Math.pow(luminosity / seff, 0.5);
}
function computeHabitableZone(t, luminosity) {
    return [computeHabitableZoneHelper(luminosity, SeffInner.get(t)), computeHabitableZoneHelper(luminosity, SeffOuter.get(t))];
}
exports.computeHabitableZone = computeHabitableZone;
function computeMass(luminosity) {
    // https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation
    // and also 
    // http://lup.lub.lu.se/luur/download?func=downloadFile&recordOId=8867455&fileOId=8870454
    var a = 0.23;
    var b = 2.3;
    if (luminosity > 0.03) {
        a = 1;
        b = 4;
    }
    if (luminosity > 16) {
        a = 1.5;
        b = 3.5;
    }
    if (luminosity > 54) {
        a = 3200;
        b = 1;
    }
    return Math.pow(luminosity / a, b);
}
exports.computeMass = computeMass;
/*
// this is garbage and wrong, don't use this
// might be able to salvage using this:
// https://www.astro.princeton.edu/~gk/A403/constants.pdf
export function computeRadius(t: StarType, luminosity: number): number {
  const temperature = StarTemperature.get(t)!;
  const tempRatio = temperature / StarTemperature.get(StarType.G)!

  return Math.sqrt(Math.pow(tempRatio, 4) / luminosity);
}
*/
/*
  https://arxiv.org/pdf/1511.07438.pdf
  
  According to this paper, metallicity distribution is best represented
  by a combination of two Gaussians.

  Units are in [Fe/H], which you should google. It's a measure of the
  presence of iron vs the solar system on a logarithmic scale.
*/
function getMetallicityValue(aRandomNumber, n2) {
    var dist1 = gaussian_1.default(0.3, 0.1);
    var dist2 = gaussian_1.default(-0.45, 0.1);
    var val1 = dist1.ppf(aRandomNumber);
    var val2 = dist2.ppf(aRandomNumber);
    // According to stats.stackexchange.com there's a super mathy way to
    // combine two Gaussian distributions, but using a weighted choice
    // seems to produce similar results, so whatever.
    return weightedChoice_1.default([[val1, 1.5], [val2, 0.5]], n2);
}
exports.getMetallicityValue = getMetallicityValue;
var Star = /** @class */function () {
    // _metallicity?: number;
    // _metallicityValues: [number, number];
    function Star(getRandom) {
        var weights = Array();
        exports.StarTypeProbabilities.forEach(function (v, k) {
            weights.push([k, v]);
        });
        this.starType = weightedChoice_1.default(weights, getRandom());
        this.color = exports.StarColors.get(this.starType);
        var sizeValue = getRandom();
        this.luminosity = normalizedToRange(exports.StarLuminosityMin.get(this.starType), exports.StarLuminosityMax.get(this.starType), sizeValue);
        this.radius = normalizedToRange(exports.StarRadiusMin.get(this.starType), exports.StarRadiusMax.get(this.starType), sizeValue);
        this.mass = computeMass(this.luminosity);
        // this._metallicity = undefined;
        // this._metallicityValues = [getRandom(), getRandom()];
        this.metallicity = getMetallicityValue(getRandom(), getRandom());
    }
    return Star;
}();
exports.Star = Star;
},{"./weightedChoice":"weightedChoice.ts","gaussian":"../node_modules/gaussian/lib/gaussian.js"}],"../node_modules/alea/alea.js":[function(require,module,exports) {
var define;
(function (root, factory) {
  if (typeof exports === 'object') {
      module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
      define(factory);
  } else {
      root.Alea = factory();
  }
}(this, function () {

  'use strict';

  // From http://baagoe.com/en/RandomMusings/javascript/

  // importState to sync generator states
  Alea.importState = function(i){
    var random = new Alea();
    random.importState(i);
    return random;
  };

  return Alea;

  function Alea() {
    return (function(args) {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if (args.length == 0) {
        args = [+new Date];
      }
      var mash = Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() + 
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;

      // my own additions to sync state between two generators
      random.exportState = function(){
        return [s0, s1, s2, c];
      };
      random.importState = function(i){
        s0 = +i[0] || 0;
        s1 = +i[1] || 0;
        s2 = +i[2] || 0;
        c = +i[3] || 0;
      };
 
      return random;

    } (Array.prototype.slice.call(arguments)));
  }

  function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }
}));

},{}],"planets.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var KeplerGrouping;
(function (KeplerGrouping) {
    KeplerGrouping["HotJupiter"] = "HotJupiter";
    KeplerGrouping["ColdGasGiant"] = "ColdGasGiant";
    KeplerGrouping["IceGiant"] = "IceGiant";
    KeplerGrouping["OceanWorld"] = "OceanWorld";
    KeplerGrouping["LavaWorld"] = "LavaWorld";
    KeplerGrouping["Rocky"] = "Rocky";
})(KeplerGrouping = exports.KeplerGrouping || (exports.KeplerGrouping = {}));
// https://medium.com/starts-with-a-bang/sorry-super-earth-fans-there-are-only-three-classes-of-planet-44f3da47eb64
var PlanetType;
(function (PlanetType) {
    PlanetType["Terran"] = "Terran";
    PlanetType["Neptunian"] = "Neptunian";
    PlanetType["Jovian"] = "Jovian";
    PlanetType["Placeholder"] = "Placeholder";
})(PlanetType = exports.PlanetType || (exports.PlanetType = {}));
// Units: 10^x earth-masses
// https://arxiv.org/pdf/1603.08614v2.pdf%29
/*
    https://www.manyworlds.space/index.php/tag/hydrogen-and-helium-envelope/

    "...it appears that once a planet has a radius more than 1.5 or 1.6
    times the size of Earth, it will most likely have a thick gas envelope of
    hydrogen, helium and sometimes methane and ammonia around it."
*/
exports.PlanetTypeMassMin = new Map([[PlanetType.Terran, -1.3], [PlanetType.Neptunian, 0.22], [PlanetType.Jovian, 2]]);
exports.PlanetTypeMassMax = new Map([[PlanetType.Terran, 0.22], [PlanetType.Neptunian, 2], [PlanetType.Jovian, 3.5]]);
// R = M^exponent
exports.PlanetTypeRadiusExponent = new Map([[PlanetType.Terran, 0.28], [PlanetType.Neptunian, 0.59], [PlanetType.Jovian, -0.04]]);
var Planet = /** @class */function () {
    function Planet(planetType, star, distance) {
        this.planetType = planetType;
        this.distance = distance;
        this.star = star;
    }
    return Planet;
}();
exports.Planet = Planet;
},{}],"starSystem.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var alea_1 = __importDefault(require("alea"));
var stars_1 = require("./stars");
var planets_1 = require("./planets");
var weightedChoice_1 = __importDefault(require("./weightedChoice"));
function normalizedToRange(min, max, val) {
    return min + (max - min) * val;
}
function shuffle(a) {
    var _a;
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
    }
    return a;
}
/*
    https://www.gemini.edu/node/12025

    "In our search, we could have found gas giants beyond orbital distances
    corresponding to Uranus and Neptune in our own Solar System, but we didn’t
    find any."
*/
/*
    https://www.cfa.harvard.edu/news/2013-01

    "At Least One in Six Stars Has an Earth-sized Planet"
*/
/*
    https://en.wikipedia.org/wiki/Circumbinary_planet
    https://en.wikipedia.org/wiki/Habitability_of_binary_star_systems

    Many restrictions on circumbinary planets have not been implemented here
*/
/*
    https://www.manyworlds.space/index.php/2018/07/09/the-architecture-of-solar-systems/
    
    Planets seem to have similar sizes as their neighbors
*/
function addPlanets(starSystem, getRandom) {
    switch (starSystem.stars[0].starType) {
        case stars_1.StarType.A:
        case stars_1.StarType.B:
        case stars_1.StarType.O:
            // These behave differently so I'm skipping them for now.
            // Planets may form at 100-1000au from the star, but will
            // only be habitable for a few million years.
            return;
    }
    if (getRandom() < 0.3) {
        // Current research suggests that 70% of sunlike stars have terran
        // or neptunian planets (see comment later). So in 30% of cases, just
        // bail.
        return;
    }
    /*
        http://iopscience.iop.org/article/10.1086/428383/pdf
        https://arxiv.org/pdf/1511.07438.pdf
         "One-quarter of the FGK-type stars with [Fe/H] > 0.3 dex harbor
        Jupiter-like planets with orbital periods shorter than 4 yr. In
        contrast, gas giant planets are detected around fewer than 3% of
        the stars with subsolar metallicity. "
    */
    /*
    We can use that information to form a simple planet type distribution
    strategy. If a star has high metallicity, we'll say gas giant probability
    per plant is 30%; otherwise it'll be 6%.
    */
    var jovianWeight = starSystem.metallicity >= 0 ? 0.3 : 0.04;
    // The others are eyeballed figures from https://www.popularmechanics.com/space/deep-space/a13733860/all-the-exoplanets-weve-discovered-in-one-small-chart/
    var terrainWeight = 0.3;
    var neptunianWeight = 0.6;
    var _a = stars_1.computeHabitableZone(starSystem.stars[0].starType, starSystem.stars[0].luminosity),
        hzMin = _a[0],
        hzMax = _a[1];
    // Stick a planet slot in the habitable zone because I don't have anything
    // else to go on. Then add slots toward and away from the sun based on
    // the Titus-Bode law:
    // https://en.wikipedia.org/wiki/Titius%E2%80%93Bode_law
    // According to this paper it's pretty darn accurate:
    // https://watermark.silverchair.com/stt1357.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAkYwggJCBgkqhkiG9w0BBwagggIzMIICLwIBADCCAigGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMXXlXIp7_lwD8QJsjAgEQgIIB-Z96njhcrt4HyhJSQ_02byW4uXVLfJlgORYjKns4IgHZ7hOohpgBhhuilHJ9CqVseHjZ2gRc6UxJ9zbWPMSEbR2ccKm93ziwbQIfl0cP7lLi50lTyffZyuW4klH9hF5usqCbX3mVLhrMVLaHRqpHY9ciTzJnLosk_FJJbYNV_OkvruGc0uY_6EtOkt13FZRxTG-Of3T9CfZj2L6PMTZxVTOMP-xY8TEDr20Kgxkwp-0DA9Lbec4SBgaEAMYSo8FJDHH_VZqYUE4H5BoUk3MRzaIbmGfCxttLGm96f-Pa0uYneyt6XZFXSUj9X7kAcN1wO0ul3pLBmhhY8dGYF_dFNKOnV3Q4O5yaFjtsJXrJheJh82UsyYmZo36QaZIC8c7h5fDluDz51JM-n_pdaI_Nj6DKXk1eisgd5wLj3MeZappwhTVDsRZnyfhLRkW6VWb0bm-FzcjEw6KvOZtJh9D7-jPyqc4Qnpdt5jLXyLqXJDOlUH1IYf0fJf1k_cw1jAPMHveHHEGrxwpZ1Jee7Q7gR1hZwkVBC4BzPq2K9a22SJ8Jgktr5PHi7RXSTeXVa9mlDTM8uqnXmwYdAu_y3SeyPvIJL7LZ7KKh_Z7FPqIwMjUHWDrY20FWHUl9oRlqthDT9CgEW1ECV9h6-MfEUlKMXUKf92FKxzICRlk
    var planetAnchor = normalizedToRange(hzMin, hzMax, getRandom());
    var numHotSlots = 5;
    var numColdSlots = 5;
    var planetSlots = [planetAnchor];
    // Add slots away from the star
    for (var i = 0; i < numColdSlots; i++) {
        planetSlots.push(planetSlots[planetSlots.length - 1] * normalizedToRange(1.1, 2, getRandom()));
    }
    // Add slots close to the star
    for (var i = 0; i < numHotSlots; i++) {
        planetSlots.unshift(planetSlots[0] / normalizedToRange(1.1, 2, getRandom()));
    }
    /*
        https://www.nasa.gov/mission_pages/kepler/news/17-percent-of-stars-have-earth-size-planets.html
         "Extrapolating from Kepler's currently ongoing observations and results
        from other detection techniques, scientists have determined that nearly
        all sun-like stars have planets."
    */
    /*
        https://www.cfa.harvard.edu/news/2013-01
         "Altogether, the researchers found that 50 percent of stars have a
        planet of Earth-size or larger in a close orbit. By adding larger
        planets, which have been detected in wider orbits up to the orbital
        distance of the Earth, this number reaches 70 percent."
         "for every planet size except gas giants, the type of star doesn't
        matter."
    */
    /*
        http://www.pnas.org/content/111/35/12647
         "The HZ of M-type dwarfs corresponds to orbital periods of a few weeks
        to a few months. Kepler’s current planet catalog is sufficient for
        addressing statistics of HZ exoplanets orbiting M stars. The results
        indicate that the average number of small (0.5–1.4 R⊕) HZ
        (optimistic) planets per M-type main-sequence star is ∼0.5."
         "Collectively, the statistics emerging from the Kepler data suggest
        that every late-type main-sequence star has at least one planet (of
        any size), that one in six has an Earth-size planet within a
        Mercury-like orbit, and that small HZ planets around M dwarfs abound."
    */
    var planetTypeChoices = [[planets_1.PlanetType.Terran, terrainWeight], [planets_1.PlanetType.Neptunian, neptunianWeight], [planets_1.PlanetType.Jovian, jovianWeight]];
    var start = Math.floor(normalizedToRange(2, planetSlots.length - 2, getRandom()));
    var forceHZTerran = starSystem.stars[0].starType == stars_1.StarType.M && getRandom() < 0.5;
    if (forceHZTerran) {
        start = numHotSlots;
    }
    var left = start;
    var right = start;
    function makePlanet(i, t) {
        var starType = weightedChoice_1.default(planetTypeChoices, getRandom());
        if (t) {
            starType = t;
        }
        starSystem.planets.push(new planets_1.Planet(starType, starSystem.stars[0], planetSlots[i]));
    }
    if (forceHZTerran) {
        console.log(planetSlots[start] > hzMin, planetSlots[start] < hzMax, planetSlots[start], planetAnchor);
        makePlanet(start, planets_1.PlanetType.Terran);
    } else {
        makePlanet(start);
    }
    // https://www.nasa.gov/image-feature/ames/planetary-systems-by-number-of-known-planets
    // Just eyeballing the graph, and with the assumption that many exoplanets
    // are not yet discovered in known systems, let's say that there's a 30% chance
    // of continuing our planet-adding loop each time.
    // And FYI, it's totally fine to have 2+ gas giants in a system. This paper
    // describes one with SIX: https://arxiv.org/pdf/1710.07337.pdf
    while (getRandom() < 0.3) {
        left -= 1;
        // Skip a slot sometimes just for fun
        if (left > 0 && getRandom() < 0.5) left -= 1;
        makePlanet(left);
    }
    while (getRandom() < 0.3) {
        right += 1;
        // Skip a slot sometimes just for fun
        if (right < planetSlots.length - 1 && getRandom() < 0.5) right += 1;
        makePlanet(right);
    }
    // for (let s of originalSlots) {
    //     starSystem.planets.push(new Planet(
    //         PlanetType.Placeholder, starSystem.stars[0], s));
    // }
}
exports.addPlanets = addPlanets;
var StarSystem = /** @class */function () {
    // metallicity: number;
    function StarSystem(seed) {
        this.seed = seed;
        var alea = new alea_1.default(seed);
        this.stars = [new stars_1.Star(alea)];
        // this.metallicity = this.stars[0].metallicity;
        /*
          Roughly 44% of star systems have two stars. The stars orbit each
          other at distances of "zero-ish" to 1 light year. Alpha Centauri,
          for example, has Proxima Centauri at 15,000 AU (~0.23 light years).
           This model will only look at "close binaries" (hand-wavingly
          estimated at 1/4 of binary systems), and say their planets are in
          orbit of both stars simultaneously. Other binaries will be treated
          like separate star systems. Research shows that even non-close
          binaries make planetary orbits eccentric over time (billions of
          years), but this would have no effect on colonization potential by
          humans (I suppose) except as it relates to the development of
          human-relevant life.
         */
        if (alea() < 0.25) {
            this.stars.push(new stars_1.Star(alea));
            // this.metallicity = Math.max(this.metallicity, this.stars[1].metallicity);
            // One strategy for generating the second star would be to force
            // it to be smaller than the first, but it's simpler to just
            // generate them independently and sort by mass.
            this.stars = this.stars.sort(function (a, b) {
                return b.mass - a.mass;
            });
        }
        this.planets = [];
        addPlanets(this, alea);
    }
    Object.defineProperty(StarSystem.prototype, "metallicity", {
        get: function get() {
            var metallicity = this.stars[0].metallicity;
            for (var _i = 0, _a = this.stars; _i < _a.length; _i++) {
                var s = _a[_i];
                metallicity = Math.max(metallicity, s.metallicity);
            }
            return metallicity;
        },
        enumerable: true,
        configurable: true
    });
    return StarSystem;
}();
exports.StarSystem = StarSystem;
},{"alea":"../node_modules/alea/alea.js","./stars":"stars.ts","./planets":"planets.ts","./weightedChoice":"weightedChoice.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var stars_1 = require("./stars");
var starSystem_1 = require("./starSystem");
/// Tweak probability values to make planets more habitable and life-infested
// function cheatStars() {
//     StarTypeProbabilities.set(StarType.K, StarTypeProbabilities.get(StarType.K)! + 0.5);
//     StarTypeProbabilities.set(StarType.G, StarTypeProbabilities.get(StarType.G)! + 0.5);
//     StarTypeProbabilities.set(StarType.F, StarTypeProbabilities.get(StarType.F)! + 0.5);
//     // Cheat so about half of G-type stars have a planet in their habitable zones
//     for (let k of Object.keys(StarType)) {
//         const t = StarType[k as keyof typeof StarType];
//         HabitableZonePlanetLikelihoods.set(t, HabitableZonePlanetLikelihoods.get(t)! * 250);
//     }
// }
// cheatStars();
// main
var main = document.getElementById("js-main");
var seed = Date.now();
if (main) {
    main.innerHTML = '';
    for (var i = 0; i < 102; i++) {
        var system = new starSystem_1.StarSystem(seed + i);
        var systemEl = document.createElement('div');
        systemEl.className = 'system';
        for (var _i = 0, _a = system.stars; _i < _a.length; _i++) {
            var star = _a[_i];
            var starEl = document.createElement('div');
            systemEl.appendChild(starEl);
            starEl.className = 'star';
            starEl.style.backgroundColor = star.color;
            starEl.innerHTML = star.starType == stars_1.StarType.M ? "" : star.starType;
            starEl.title = JSON.stringify(star, null, 2);
            var minStarSize = 0.08;
            var minPixelSize = 3;
            var w = minPixelSize / minStarSize * star.radius;
            starEl.style.width = w.toString() + 'px';
            starEl.style.height = w.toString() + 'px';
            starEl.style.borderRadius = (w / 2).toString() + 'px';
            // console.table(system.stars[0]);
        }
        var separatorEl = document.createElement('div');
        systemEl.appendChild(separatorEl);
        separatorEl.className = 'planet-separator';
        var planetsEl = document.createElement('div');
        systemEl.appendChild(planetsEl);
        planetsEl.className = 'planets-container';
        var distanceFactor = 50;
        var hzEl = document.createElement('div');
        planetsEl.appendChild(hzEl);
        hzEl.className = 'hz-indicator';
        var _b = stars_1.computeHabitableZone(system.stars[0].starType, system.stars[0].luminosity),
            hzMin = _b[0],
            hzMax = _b[1];
        hzEl.style.left = hzMin * distanceFactor + "px";
        hzEl.style.width = (hzMax - hzMin) * distanceFactor + "px";
        var maxDistance = 1;
        for (var _c = 0, _d = system.planets; _c < _d.length; _c++) {
            var planet = _d[_c];
            var planetEl = document.createElement('div');
            planetsEl.appendChild(planetEl);
            planetEl.className = "planet-" + planet.planetType.toString().toLowerCase();
            planetEl.style.position = 'absolute';
            planetEl.style.left = planet.distance * distanceFactor + "px";
            planetEl.title = JSON.stringify(planet, null, 2);
            maxDistance = Math.max(maxDistance, planet.distance);
            planetsEl.style.backgroundColor = 'lightblue';
        }
        planetsEl.style.width = maxDistance * distanceFactor + 100 + "px";
        main.appendChild(systemEl);
    }
}
// Dumb visual check of the metallicity probability distribution
// function testMetallicity() {
//     if (document.body.children[0].tagName == 'CANVAS') {
//         document.body.removeChild(document.body.children[0]);
//     }
//     const buckets: any = {};
//     let maxCount = 0;
//     let min = 0;
//     let max = 0;
//     const mult = 100;
//     for(let i=0; i<100000; i++) {
//         const val = getMetallicityValue(Math.random(), Math.random());
//         const roundedVal = Math.floor(val * mult) / mult;
//         min = Math.min(min, roundedVal);
//         max = Math.max(max, roundedVal);
//         if (!buckets[roundedVal]) buckets[roundedVal] = 0;
//         buckets[roundedVal] += 1;
//         maxCount = Math.max(maxCount, buckets[roundedVal]);
//     }
//     console.log(maxCount);
//     const height = 200;
//     const factor = height / maxCount;
//     const canvasEl = document.createElement('canvas');
//     canvasEl.width = (max - min) * mult;
//     canvasEl.height = height;
//     canvasEl.style.backgroundColor = 'white';
//     const ctx = canvasEl.getContext('2d');
//     if (!ctx) return;
//     ctx.fillStyle = 'black';
//     for(let i=min * mult; i<max * mult; i+=1) {
//         const k = i / mult;
//         const val = buckets[k];
//         switch (k) {
//         case 0:
//             ctx.fillStyle = 'red';
//             break;
//         case 0.3:
//         case -0.45:
//             ctx.fillStyle = 'lightgreen';
//             break;
//         case 1:
//             ctx.fillStyle = 'cyan';
//             break;
//         case -1:
//             ctx.fillStyle = 'yellow';
//             break;
//         default:
//             ctx.fillStyle = 'black';
//             break;
//         }
//         ctx.fillRect(i - (min * mult), height - val * factor, 1, val * factor);
//     }
//     console.log(buckets);
//     document.body.insertBefore(canvasEl, document.body.children[0]);
// }
// testMetallicity();
},{"./stars":"stars.ts","./starSystem":"starSystem.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '58948' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.6b6cc9b8.map