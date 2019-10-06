import { Star } from "./stars";

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
// Figure 3:
// https://arxiv.org/pdf/1603.08614v2.pdf
export const PlanetTypeRadiusExponent = new Map<PlanetType, number>([
    [PlanetType.Terran, 0.28],
    [PlanetType.Neptunian, 0.59],
    [PlanetType.Jovian, -0.04],
]);

export const PlanetTypeProbabilities = {
    /*
        http://iopscience.iop.org/article/10.1086/428383/pdf
        https://arxiv.org/pdf/1511.07438.pdf

        "One-quarter of the FGK-type stars with [Fe/H] > 0.3 dex harbor
        Jupiter-like planets with orbital periods shorter than 4 yr. In
        contrast, gas giant planets are detected around fewer than 3% of
        the stars with subsolar metallicity. "

        So if stars have a 70% chance of having any planets, and a 25%
        chance of specifically having a gas giant, we want about a 35%
        chance of a planet being a gas giant.
    */
    jovianInHighMetallicitySystem: 0.5,
    jovianInLowMetallicitySystem: 0.05,
    // eyeballed from
    // https://www.popularmechanics.com/space/deep-space/a13733860/all-the-exoplanets-weve-discovered-in-one-small-chart/
    neptunian: 1,
    terran: 0.5,
}

export class Moon {
    // AU
    distance: number;
    // Earth masses
    mass: number;

    constructor(
        distance: number,
        mass: number)
    {
        this.distance = distance;
        this.mass = mass;
    }
}

export class Planet {
    // AU
    distance: number;
    // Earth masses
    mass: number;
    // Earth radii
    radius: number;
    star: Star;
    planetType: PlanetType;

    moons: Array<Moon>;

    constructor(
        planetType: PlanetType,
        star: Star,
        distance: number,
        mass: number)
    {
        this.moons = [];
        this.planetType = planetType;
        this.distance = distance;
        this.star = star
        this.mass = mass;
        this.radius = Math.pow(this.mass, PlanetTypeRadiusExponent.get(planetType) || 0)
    }
}