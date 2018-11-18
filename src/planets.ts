// Kepler groupings:
// export enum PlanetType {
//     HotJupiter = "HotJupiter",
//     ColdGasGiant = "ColdGasGiant",
//     IceGiant = "IceGiant",
//     OceanWorld = "OceanWorld",
//     LavaWorld = "LavaWorld",
//     Rocky = "Rocky",
// }

/*
    https://www.manyworlds.space/index.php/tag/hydrogen-and-helium-envelope/

    "...it appears that once a planet has a radius more than 1.5 or 1.6
    times the size of Earth, it will most likely have a thick gas envelope of
    hydrogen, helium and sometimes methane and ammonia around it."
*/

export class Planet {
    isTooHot: boolean;
    isTooCold: boolean;
    isNominallyHabitable: boolean;
    isTidallyLocked: boolean;
    radius: number;
    distance: number;
    mass: number;
    orbitalPeriod: number;

    constructor(
        distance: number,
        mass: number,
        radius: number,
        orbitalPeriod: number,
        isTooHot: boolean,
        isTooCold: boolean,
        isTidallyLocked: boolean)
    {
        this.mass = mass;
        this.distance = distance;
        this.radius = radius;
        this.orbitalPeriod = orbitalPeriod;
        this.isTooCold = isTooCold;
        this.isTooHot = isTooHot;
        this.isTidallyLocked = isTidallyLocked;
        this.isNominallyHabitable = !isTooCold && !isTooCold && !this.isTidallyLocked;
    }
}