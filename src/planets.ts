// Kepler groupings:
// export enum PlanetType {
//     HotJupiter = "HotJupiter",
//     ColdGasGiant = "ColdGasGiant",
//     IceGiant = "IceGiant",
//     OceanWorld = "OceanWorld",
//     LavaWorld = "LavaWorld",
//     Rocky = "Rocky",
// }

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
        this.isNominallyHabitable = !isTooCold && !isTooCold && !this.isTidallyLocked && this.planetType == PlanetType.Rocky;
    }
}