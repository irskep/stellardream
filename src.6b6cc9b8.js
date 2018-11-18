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
},{}],"stars.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var weightedChoice_1 = __importDefault(require("./weightedChoice"));
function normalizedToRange(min, max, val) {
    return min + (max - min) * val;
}
/* STARS */
var StarType;
(function (StarType) {
    /* Planets in HZ will be tidally locked very quickly
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
/*
// this is garbage and wrong, don't use this
export function computeRadius(t: StarType, luminosity: number): number {
  const temperature = StarTemperature.get(t)!;
  const tempRatio = temperature / StarTemperature.get(StarType.G)!

  return Math.sqrt(Math.pow(tempRatio, 4) / luminosity);
}
*/
var Star = /** @class */function () {
    function Star(alea) {
        var weights = Array();
        exports.StarTypeProbabilities.forEach(function (v, k) {
            weights.push([k, v]);
        });
        this.starType = weightedChoice_1.default(weights, alea());
        // StarTypeProbabilities.keys().map((k: StarType) => []), alea);
        this.color = exports.StarColors.get(this.starType);
        var sizeValue = alea();
        this.luminosity = normalizedToRange(exports.StarLuminosityMin.get(this.starType), exports.StarLuminosityMax.get(this.starType), sizeValue);
        this.radius = normalizedToRange(exports.StarRadiusMin.get(this.starType), exports.StarRadiusMax.get(this.starType), sizeValue);
        // https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation
        this.mass = Math.pow(this.luminosity, 1 / 3.5);
    }
    return Star;
}();
exports.Star = Star;
},{"./weightedChoice":"weightedChoice.ts"}],"../node_modules/alea/alea.js":[function(require,module,exports) {
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

},{}],"starSystem.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var alea_1 = __importDefault(require("alea"));
var stars_1 = require("./stars");
var StarSystem = /** @class */function () {
    function StarSystem(seed) {
        this.seed = seed;
        var alea = new alea_1.default(seed);
        this.stars = [new stars_1.Star(alea)];
        if (alea() > 0.5) {
            this.stars.push(new stars_1.Star(alea));
        }
        this.stars.sort(function (a, b) {
            return b.mass - a.mass;
        });
    }
    return StarSystem;
}();
exports.StarSystem = StarSystem;
},{"alea":"../node_modules/alea/alea.js","./stars":"stars.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var stars_1 = require("./stars");
var starSystem_1 = require("./starSystem");
/// Tweak probability values to make planets more habitable and life-infested
function cheatStars() {
    stars_1.StarTypeProbabilities.set(stars_1.StarType.K, stars_1.StarTypeProbabilities.get(stars_1.StarType.K) + 0.5);
    stars_1.StarTypeProbabilities.set(stars_1.StarType.G, stars_1.StarTypeProbabilities.get(stars_1.StarType.G) + 0.5);
    stars_1.StarTypeProbabilities.set(stars_1.StarType.F, stars_1.StarTypeProbabilities.get(stars_1.StarType.F) + 0.5);
    // Cheat so about half of G-type stars have a planet in their habitable zones
    for (var _i = 0, _a = Object.keys(stars_1.StarType); _i < _a.length; _i++) {
        var k = _a[_i];
        var t = stars_1.StarType[k];
        stars_1.HabitableZonePlanetLikelihoods.set(t, stars_1.HabitableZonePlanetLikelihoods.get(t) * 250);
    }
}
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
            // const labelEl = document.createElement('div');
            // labelEl.innerHTML = star.starType;
            // labelEl.style.textAlign = 'center';
            // systemEl.appendChild(labelEl);
            var starEl = document.createElement('div');
            systemEl.appendChild(starEl);
            starEl.className = 'star';
            starEl.style.backgroundColor = star.color;
            starEl.innerHTML = star.starType;
            var w = 10 / 0.08 * star.radius;
            starEl.style.width = w.toString() + 'px';
            starEl.style.height = w.toString() + 'px';
            starEl.style.borderRadius = (w / 2).toString() + 'px';
            console.table(system.stars[0]);
        }
        main.appendChild(systemEl);
    }
}
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '57118' + '/');
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