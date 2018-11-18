import Alea from "alea";

import {Star} from "./stars";

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

    http://iopscience.iop.org/article/10.1086/428383/pdf

    "One-quarter of the FGK-type stars with [Fe/H] > 0.3 dex harbor
    Jupiter-like planets with orbital periods shorter than 4 yr. In
    contrast, gas giant planets are detected around fewer than 3% of
    the stars with subsolar metallicity. "
*/

export function addPlanets(starSystem: StarSystem) {
  
}

export class StarSystem {
    seed: number;
    stars: Array<Star>;

    constructor(seed: number) {
        this.seed = seed;

        const alea = new (Alea as any)(seed);

        this.stars = [new Star(alea)];
        
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

            // One strategy for generating the second star would be to force
            // it to be smaller than the first, but it's simpler to just
            // generate them independently and sort by mass.
            this.stars = this.stars.sort((a, b) => {
                return b.mass - a.mass;
            });
        }
    }
}