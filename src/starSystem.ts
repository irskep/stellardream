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
    http://www.solstation.com/habitable.htm

    "Thus far, no one theory has been able to make definitive predictions of the
    frequency of planet formation nor of the distribution of planetary sizes and
    orbits."

    "planetary systems may be more common around stars whose spectra show an
    enriched abundance of elements heavier than hydrogen and helium -- also
    called high 'metallicity'"

    "Numerical modeling of the accumulation of planetesimals during molecular
    cloud collapse have produced, on average, four rocky inner planets for models
    similar to the Solar System. The results included two, roughly Earth-sized
    planets and two smaller planets, where their orbital distance ranged between
    that of Mercury (0.4 AU) and Mars (1.5 AU). Hence, some astronomers expect to
    find rocky planets around other stars within that range of orbits."

    "NASA's Kepler Mission is defining the size of an Earth-type planet to be
    those that have between 0.5 and 2.0 times Earth's mass, or those having
    between 0.8 and 1.3 times Earth's radius or diameter. The mission will
    also investigate larger terrestrial planets that have two to ten Earth
    masses, or 1.3 to 2.2 times its radius/diameter. Larger planets, however,
    will be excluded because they may have sufficient gravity to attract a
    massive hydrogen-helium atmosphere like the gas giants. On the other
    extreme, those planets -- like Mars or Mercury -- that have less than
    half the Earth's mass and are located in or near their star's habitable
    zone may lose their initial life-supporting atmosphere because of low
    gravity and/or the lack of plate tectonics needed to recycle
    heat-retaining carbon dioxide gas back into the atmosphere."

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

    const [hzMin, hzMax] = computeHabitableZone(
        starSystem.stars[0].starType, starSystem.stars[0].luminosity);

    // Stick a planet slot in the habitable zone because I don't have anything
    // else to go on. Then add slots toward and away from the sun based on
    // the Titus-Bode law:
    // https://en.wikipedia.org/wiki/Titius%E2%80%93Bode_law
    // According to this paper it's pretty darn accurate:
    // https://watermark.silverchair.com/stt1357.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAkYwggJCBgkqhkiG9w0BBwagggIzMIICLwIBADCCAigGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMXXlXIp7_lwD8QJsjAgEQgIIB-Z96njhcrt4HyhJSQ_02byW4uXVLfJlgORYjKns4IgHZ7hOohpgBhhuilHJ9CqVseHjZ2gRc6UxJ9zbWPMSEbR2ccKm93ziwbQIfl0cP7lLi50lTyffZyuW4klH9hF5usqCbX3mVLhrMVLaHRqpHY9ciTzJnLosk_FJJbYNV_OkvruGc0uY_6EtOkt13FZRxTG-Of3T9CfZj2L6PMTZxVTOMP-xY8TEDr20Kgxkwp-0DA9Lbec4SBgaEAMYSo8FJDHH_VZqYUE4H5BoUk3MRzaIbmGfCxttLGm96f-Pa0uYneyt6XZFXSUj9X7kAcN1wO0ul3pLBmhhY8dGYF_dFNKOnV3Q4O5yaFjtsJXrJheJh82UsyYmZo36QaZIC8c7h5fDluDz51JM-n_pdaI_Nj6DKXk1eisgd5wLj3MeZappwhTVDsRZnyfhLRkW6VWb0bm-FzcjEw6KvOZtJh9D7-jPyqc4Qnpdt5jLXyLqXJDOlUH1IYf0fJf1k_cw1jAPMHveHHEGrxwpZ1Jee7Q7gR1hZwkVBC4BzPq2K9a22SJ8Jgktr5PHi7RXSTeXVa9mlDTM8uqnXmwYdAu_y3SeyPvIJL7LZ7KKh_Z7FPqIwMjUHWDrY20FWHUl9oRlqthDT9CgEW1ECV9h6-MfEUlKMXUKf92FKxzICRlk

    const planetAnchor = normalizedToRange(hzMin, hzMax, getRandom());
    let planetSlots = [planetAnchor];
    // Add 6 slots away from the star (solar system value + 1)
    for (let i=0; i<5; i++) {
        planetSlots.unshift(planetSlots[0] * normalizedToRange(1.1, 2, getRandom()));
    }
    // Add 4 slots close to the star (solar system value + 1)
    for (let i=0; i<5; i++) {
        planetSlots.push(planetSlots[planetSlots.length - 1] / normalizedToRange(1.1, 2, getRandom()));
    }
    // Remember original slots so we can add placeholder planets later on as markers
    const originalSlots = planetSlots.map((i) => i);
    planetSlots = shuffle(planetSlots);

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

   // Eyeballed figures from https://www.popularmechanics.com/space/deep-space/a13733860/all-the-exoplanets-weve-discovered-in-one-small-chart/
   const terrainWeight = 0.3;
   const neptunianWeight = 0.6;

    const hzSlots = planetSlots.filter((dist) => dist > hzMin && dist < hzMax);
    const hotSlots = planetSlots.filter((dist) => dist <= hzMin);
    const coldSlots = planetSlots.filter((dist) => dist >= hzMax);

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

    /*
    The way that all gets captured here is to just pick random planet slots
    and put planets in them.

    ~50% of planet slots are "close" orbits (HZ or closer), which captures
    the M-type data pretty well, and since other star types have habitable
    zones farther out, that will naturally push all the planet slots outward
    as well.
    */

    const planetTypeChoices: Array<[PlanetType, number]> = [
        [PlanetType.Terran, terrainWeight],
        [PlanetType.Neptunian, neptunianWeight],
        [PlanetType.Jovian, jovianWeight],
    ]

    // As mentioned earlier, half of dwarf stars have a Terran planet
    // in their HZs. For other stars, just do something random.
    if (starSystem.stars[0].starType == StarType.M) {
        starSystem.planets.push(new Planet(
            weightedRandom(planetTypeChoices, getRandom()),
            starSystem.stars[0],
            hzSlots.pop()!));
        planetSlots = hzSlots.concat(hotSlots).concat(coldSlots);
    } else {
        starSystem.planets.push(new Planet(
            weightedRandom(planetTypeChoices, getRandom()),
            starSystem.stars[0],
            planetSlots.pop()!));
    }

    // https://www.nasa.gov/image-feature/ames/planetary-systems-by-number-of-known-planets
    // Just eyeballing the graph, and with the assumption that many exoplanets
    // are not yet discovered in known systems, let's say that there's a 30% chance
    // of continuing our planet-adding loop each time.
    // And FYI, it's totally fine to have 2+ gas giants in a system. This paper
    // describes one with SIX: https://arxiv.org/pdf/1710.07337.pdf
    while (planetSlots.length > 0 && getRandom() < 0.3) {
        starSystem.planets.push(new Planet(
            weightedRandom(planetTypeChoices, getRandom()),
            starSystem.stars[0],
            planetSlots.pop()!));
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
          estimated at half of binary systems), and say their planets are in
          orbit of both stars simultaneously. Other binaries will be treated
          like separate star systems. Research shows that even non-close
          binaries make planetary orbits eccentric over time (billions of
          years), but this would have no effect on colonization potential by
          humans (I suppose) except as it relates to the development of
          human-relevant life.
         */
        if (alea() > 0.22) {
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