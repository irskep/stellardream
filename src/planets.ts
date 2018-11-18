import { Star } from "./stars";

export enum KeplerGrouping {
    HotJupiter = "HotJupiter",
    ColdGasGiant = "ColdGasGiant",
    IceGiant = "IceGiant",
    OceanWorld = "OceanWorld",
    LavaWorld = "LavaWorld",
    Rocky = "Rocky",
}

// https://medium.com/starts-with-a-bang/sorry-super-earth-fans-there-are-only-three-classes-of-planet-44f3da47eb64
export enum PlanetType {
    Terran = "Terran",
    Neptunian = "Neptunian",
    Jovian = "Jovian",
}

// Units: 10^x earth-masses
// https://arxiv.org/pdf/1603.08614v2.pdf%29
/*
    https://www.manyworlds.space/index.php/tag/hydrogen-and-helium-envelope/

    "...it appears that once a planet has a radius more than 1.5 or 1.6
    times the size of Earth, it will most likely have a thick gas envelope of
    hydrogen, helium and sometimes methane and ammonia around it."
*/
export const PlanetTypeMassMin = new Map<PlanetType, number>([
    [PlanetType.Terran, -1.3],      // ~mercury sized
    [PlanetType.Neptunian, 0.22],   // ~1.6 earth masses
    [PlanetType.Jovian, 2],
]);

export const PlanetTypeMassMax = new Map<PlanetType, number>([
    [PlanetType.Terran, 0.22],
    [PlanetType.Neptunian, 2],
    [PlanetType.Jovian, 3.5],
]);

// R = M^exponent
export const PlanetTypeRadiusExponent = new Map<PlanetType, number>([
    [PlanetType.Terran, 0.28],
    [PlanetType.Neptunian, 0.59],
    [PlanetType.Jovian, -0.04],
]);

export class Planet {
    distance: number;
    star: Star;
    planetType: PlanetType;

    constructor(
        planetType: PlanetType,
        star: Star,
        distance: number)
    {
        this.planetType = planetType;
        this.distance = distance;
        this.star = star;
    }
}