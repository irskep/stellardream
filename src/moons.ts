import gaussian from "gaussian";
import weightedChoice from './weightedChoice';

import {Planet, PlanetType, Moon} from './planets';

export const MoonMass = new Map<PlanetType, number>([
    [PlanetType.Terran, 0.01],
    [PlanetType.Neptunian, 0.001],
    [PlanetType.Jovian, 0.0001],
]);

/// Project a value 0-1 onto a range min-max
function normalizedToRange(min: number, max: number, val: number): number {
    return min + (max - min) * val;
}

export function addMoons(planet: Planet, hzMin: number, getRandom: () => number) {
  // Moons only stick around if they are within the Hill Sphere
  // https://en.wikipedia.org/wiki/Hill_sphere
  // For a zero-eccentricity orbit, the radius of the Hill Sphere is
  // a * Math.cbrt(m/3M)
  // where a = semimajor axis of the planet's orbit,
  //       m = mass of planet,
  //       M = mass of star
  // But I'm ignoring this for now

  const hillSphereRadiusAU = planet.distance * Math.cbrt(planet.mass / planet.star.mass);
  const auKM = 149600000 // km
  const hillSphereRadiusKM = hillSphereRadiusAU * auKM;
  const earthRadiusKM = 6371
  const planetRadiusKM = earthRadiusKM * planet.radius;

  const earthMassKG = 5.97 * 10e24;

  let numMoons = 0;
  let moonMassDistribution: any = null;
  let moonDistanceMinKM = 0;
  let moonDistanceMaxKM = 0;

  if (planet.planetType === PlanetType.Terran) {
    // Moons on rocky planets come from impacts, so let's imagine some impacts
    numMoons = weightedChoice([[0, 75], [1, 25], [2, 5], [3, 1], [4, 0.1]], getRandom())
    moonMassDistribution = gaussian(planet.mass * 0.01, planet.mass * 0.005);
    moonDistanceMinKM = 2 * planetRadiusKM;
    moonDistanceMaxKM = hillSphereRadiusKM;
  } else {
    // basic power law fit to solar system moons around neptunians and jovians
    let numMoonsAvg = 5.3743 * Math.pow(planet.mass, 0.4876);
    // oops, the sun burned off our accretion disc, goodbye 90% of moons
    if (planet.distance < hzMin) numMoonsAvg *= 0.1;
    numMoons = gaussian(numMoonsAvg, numMoonsAvg * 0.3).ppf(getRandom());
    moonMassDistribution = gaussian(planet.mass * 0.0001, planet.mass * 0.00005);
    moonDistanceMinKM = 5 * planetRadiusKM;
    moonDistanceMaxKM = 30 * planetRadiusKM;
  }

  // smallest moon of jupiter is 0.0090 * 10e16 kg
  const moonMassMin = 0.0090 * 10e16 / earthMassKG;
  for(let i=0; i<numMoons; i++) {
    const massVsEarth = Math.max(moonMassMin, moonMassDistribution.ppf(getRandom()) * planet.mass);
    const distanceKM = normalizedToRange(moonDistanceMinKM, moonDistanceMaxKM, getRandom());

    planet.moons.push(new Moon(distanceKM / auKM, massVsEarth));
  }
}