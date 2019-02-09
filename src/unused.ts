import {StarType} from './stars';

// unused; future work? comments map wonky infographic clusters onto PlanetType
export enum KeplerGrouping {
    // "big" jovians that are doing a fusion
    HotJupiter = "HotJupiter",
    // "small" jovians
    ColdGasGiant = "ColdGasGiant",
    // neptunes
    IceGiant = "IceGiant",
    // watery terrans
    OceanWorld = "OceanWorld",
    // mercury-sized terrans
    LavaWorld = "LavaWorld",
    // terrans
    Rocky = "Rocky",
}

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
export const HabitableZonePlanetLikelihoods = new Map<StarType, number>([
  [StarType.M, 0.0002],
  [StarType.K, 0.001],
  [StarType.G, 0.002],
  [StarType.F, 0.001],
  // my sources don't discuss these star types, and they are rare, so just pick
  // some random small values
  [StarType.A, 0.0002],
  [StarType.B, 0.00015],
  [StarType.O, 0.0001],
]);