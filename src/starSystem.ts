import Alea from "alea";

import {Star, StarType, computeHabitableZone} from "./stars";
import {Planet, PlanetType} from "./planets";
import weightedRandom from "./weightedChoice";

function normalizedToRange(min: number, max: number, val: number): number {
  return min + (max - min) * val;
}

function shuffle<T>(a: Array<T>) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
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
    const jovianWeight = starSystem.metallicity >= 0 ? 0.3 : 0.04;
    // The others are eyeballed figures from https://www.popularmechanics.com/space/deep-space/a13733860/all-the-exoplanets-weve-discovered-in-one-small-chart/
    const terrainWeight = 0.3;
    const neptunianWeight = 0.6;

    const [hzMin, hzMax] = computeHabitableZone(
        starSystem.stars[0].starType, starSystem.stars[0].luminosity);

    // Stick a planet slot in the habitable zone because I don't have anything
    // else to go on. Then add slots toward and away from the sun based on
    // the Titus-Bode law:
    // https://en.wikipedia.org/wiki/Titius%E2%80%93Bode_law
    // According to this paper it's pretty darn accurate:
    // https://watermark.silverchair.com/stt1357.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAkYwggJCBgkqhkiG9w0BBwagggIzMIICLwIBADCCAigGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMXXlXIp7_lwD8QJsjAgEQgIIB-Z96njhcrt4HyhJSQ_02byW4uXVLfJlgORYjKns4IgHZ7hOohpgBhhuilHJ9CqVseHjZ2gRc6UxJ9zbWPMSEbR2ccKm93ziwbQIfl0cP7lLi50lTyffZyuW4klH9hF5usqCbX3mVLhrMVLaHRqpHY9ciTzJnLosk_FJJbYNV_OkvruGc0uY_6EtOkt13FZRxTG-Of3T9CfZj2L6PMTZxVTOMP-xY8TEDr20Kgxkwp-0DA9Lbec4SBgaEAMYSo8FJDHH_VZqYUE4H5BoUk3MRzaIbmGfCxttLGm96f-Pa0uYneyt6XZFXSUj9X7kAcN1wO0ul3pLBmhhY8dGYF_dFNKOnV3Q4O5yaFjtsJXrJheJh82UsyYmZo36QaZIC8c7h5fDluDz51JM-n_pdaI_Nj6DKXk1eisgd5wLj3MeZappwhTVDsRZnyfhLRkW6VWb0bm-FzcjEw6KvOZtJh9D7-jPyqc4Qnpdt5jLXyLqXJDOlUH1IYf0fJf1k_cw1jAPMHveHHEGrxwpZ1Jee7Q7gR1hZwkVBC4BzPq2K9a22SJ8Jgktr5PHi7RXSTeXVa9mlDTM8uqnXmwYdAu_y3SeyPvIJL7LZ7KKh_Z7FPqIwMjUHWDrY20FWHUl9oRlqthDT9CgEW1ECV9h6-MfEUlKMXUKf92FKxzICRlk

    const planetAnchor = normalizedToRange(hzMin, hzMax, getRandom());
    const numHotSlots = 5;
    const numColdSlots = 5;
    let planetSlots = [planetAnchor];

    // Add slots away from the star
    for (let i=0; i<numColdSlots; i++) {
        planetSlots.push(planetSlots[planetSlots.length - 1] * normalizedToRange(1.1, 2, getRandom()));
    }
    // Add slots close to the star
    for (let i=0; i<numHotSlots; i++) {
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

    const planetTypeChoices: Array<[PlanetType, number]> = [
        [PlanetType.Terran, terrainWeight],
        [PlanetType.Neptunian, neptunianWeight],
        [PlanetType.Jovian, jovianWeight],
    ]

    let start = Math.floor(normalizedToRange(2, planetSlots.length - 2, getRandom()));
    const forceHZTerran = starSystem.stars[0].starType == StarType.M && getRandom() < 0.5;
    if (forceHZTerran) {
        start = numHotSlots;
    }
    let left = start;
    let right = start;

    function makePlanet(i: number, t?: PlanetType) {
        let starType = weightedRandom(planetTypeChoices, getRandom());
        if (t) { starType = t; }
        starSystem.planets.push(new Planet(
            starType,
            starSystem.stars[0],
            planetSlots[i]));
    }

    if (forceHZTerran) {
        console.log(planetSlots[start] > hzMin, planetSlots[start] < hzMax, planetSlots[start], planetAnchor);
        makePlanet(start, PlanetType.Terran);
    } else {
        makePlanet(start);
    }

    // https://www.nasa.gov/image-feature/ames/planetary-systems-by-number-of-known-planets
    // Just eyeballing the graph, and with the assumption that many exoplanets
    // are not yet discovered in known systems, let's say that there's a 30% chance
    // of continuing our planet-adding loop each time.
    // And FYI, it's totally fine to have 2+ gas giants in a system. This paper
    // describes one with SIX: https://arxiv.org/pdf/1710.07337.pdf
    while(getRandom() < 0.3) {
        left -= 1;
        // Skip a slot sometimes just for fun
        if (left > 0 && getRandom() < 0.5) left -= 1;
        makePlanet(left);
    }

    while(getRandom() < 0.3) {
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

export class StarSystem {
    seed: number;
    stars: Array<Star>;
    planets: Array<Planet>;
    // metallicity: number;

    constructor(seed: number) {
        this.seed = seed;

        const alea = new (Alea as any)(seed);

        this.stars = [new Star(alea)];
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
            this.stars.push(new Star(alea));
            // this.metallicity = Math.max(this.metallicity, this.stars[1].metallicity);

            // One strategy for generating the second star would be to force
            // it to be smaller than the first, but it's simpler to just
            // generate them independently and sort by mass.
            this.stars = this.stars.sort((a, b) => {
                return b.mass - a.mass;
            });
        }

        this.planets = [];
        addPlanets(this, alea);
    }

    get metallicity(): number {
        let metallicity: number = this.stars[0].metallicity;
        for (let s of this.stars) {
            metallicity = Math.max(metallicity, s.metallicity);
        }
        return metallicity;
    }
}