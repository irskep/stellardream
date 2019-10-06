import { StarType, computeHabitableZone } from "./stars";
import { Planet, PlanetType, PlanetTypeProbabilities, PlanetTypeMassMin, PlanetTypeMassMax } from "./planets";
import { addMoons } from './moons';
import weightedRandom from "./weightedChoice";
import { StarSystem } from "./starSystem";

/// Project a value 0-1 onto a range min-max
export function normalizedToRange(min: number, max: number, val: number): number {
    return min + (max - min) * val;
}
/*
    https://www.cfa.harvard.edu/news/2013-01

    "Altogether, the researchers found that 50 percent of stars have a
    planet of Earth-size or larger in a close orbit. By adding larger
    planets, which have been detected in wider orbits up to the orbital
    distance of the Earth, this number reaches 70 percent."

    "for every planet size except gas giants, the type of star doesn't
    matter."
*/
const atLeastOnePlanetProbability = 0.7;
// This comes from nowhere in particular. I made it up.
export const closeBinaryProbability = 0.11;
export function addPlanets(starSystem: StarSystem, getRandom: () => number) {
    switch (starSystem.stars[0].starType) {
        case (StarType.A):
        case (StarType.B):
        case (StarType.O):
            // These behave differently so I'm skipping them for now.
            // Planets may form at 100-1000au from the star, but will
            // only be habitable for a few million years.
            return;
    }
    if (getRandom() > atLeastOnePlanetProbability) {
        // Current research suggests that 70% of sunlike stars have terran
        // or neptunian planets (see comment later). So in 30% of cases, just
        // bail.
        return;
    }
    const [hzMin, hzMax] = computeHabitableZone(starSystem.stars[0].starType, starSystem.stars[0].luminosity);
    // Artistic license, since there isn't a clear rule for planet placement:
    // pick an orbit in the habitable zone, and then use the Titus-Bode relation
    // to generate 5 closer orbits and 5 farther orbits.
    const planetAnchor = normalizedToRange(hzMin, hzMax, getRandom());
    const numHotSlots = 5;
    const numColdSlots = 5;
    let planetSlots = [planetAnchor];
    // Add slots away from the star
    for (let i = 0; i < numColdSlots; i++) {
        planetSlots.push(planetSlots[planetSlots.length - 1] * normalizedToRange(1.1, 2, getRandom()));
    }
    // Add slots close to the star
    for (let i = 0; i < numHotSlots; i++) {
        planetSlots.unshift(planetSlots[0] / normalizedToRange(1.1, 2, getRandom()));
    }
    const jovianWeight = starSystem.metallicity >= 0
        ? PlanetTypeProbabilities.jovianInHighMetallicitySystem
        : PlanetTypeProbabilities.jovianInLowMetallicitySystem;
    const planetTypeChoices: Array<[PlanetType, number]> = [
        [PlanetType.Terran, PlanetTypeProbabilities.terran],
        [PlanetType.Neptunian, PlanetTypeProbabilities.neptunian],
        [PlanetType.Jovian, jovianWeight / atLeastOnePlanetProbability],
    ];
    // Star making planets somewhere random
    let start = Math.floor(normalizedToRange(2, planetSlots.length - 2, getRandom()));
    // 50% of M-Dwarfs have Terrans in the HZ. There's already "some" probability that
    // we'll get a Terran orbiting an M-dwarf in the HZ, but give it an extra 40% nudge
    // anyway.
    // http://www.pnas.org/content/111/35/12647
    const forceHZTerran = starSystem.stars[0].starType == StarType.M && getRandom() < 0.4;
    if (forceHZTerran) {
        start = numHotSlots;
    }
    let left = start;
    let right = start;
    function makePlanet(i: number, t?: PlanetType) {
        if (i < 0 || i >= planetSlots.length) {
            throw new Error("Trying to make a planet out of bounds");
        }
        let planetType = t || weightedRandom(planetTypeChoices, getRandom());
        let mass = normalizedToRange(PlanetTypeMassMin.get(planetType) || 0, PlanetTypeMassMax.get(planetType) || 0, getRandom());
        starSystem.planets.push(new Planet(planetType, starSystem.stars[0], planetSlots[i], Math.pow(10, mass)));
    }
    if (forceHZTerran) {
        makePlanet(start, PlanetType.Terran);
    }
    else {
        makePlanet(start);
    }
    // https://www.nasa.gov/image-feature/ames/planetary-systems-by-number-of-known-planets
    // Just eyeballing the graph, and with the assumption that many exoplanets
    // are not yet discovered in known systems, let's say that there's a 30% chance
    // of continuing our planet-adding loop each time.
    // And FYI, it's totally fine to have 2+ gas giants in a system. This paper
    // describes one with SIX: https://arxiv.org/pdf/1710.07337.pdf
    while (getRandom() < 0.15 && left > 0) {
        left -= 1;
        // Skip a slot sometimes just for fun
        if (left > 0 && getRandom() < 0.5)
            left -= 1;
        makePlanet(left);
    }
    while (getRandom() < 0.15 && right < planetSlots.length - 1) {
        right += 1;
        // Skip a slot sometimes just for fun
        if (right < planetSlots.length - 1 && getRandom() < 0.5)
            right += 1;
        makePlanet(right);
    }
    starSystem.planets.sort((a, b) => {
        return a.distance - b.distance;
    });
    for (const planet of starSystem.planets) {
        addMoons(planet, hzMin, getRandom);
    }
}
