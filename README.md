# Stellar Dream

**A procedural star system generator based on 21st century exoplanet research**

[API docs](http://steveasleep.com/stellardream/) (unfortunately not very good due to TypeDoc being immature)

[Fancy demo](http://steveasleep.com/keplverse/)

Example:

```js
// yarn add stellardream
import { StarSystem } from 'stellardream';

const starSystem = new StarSystem(1549748672440);
console.log(JSON.stringify(starSystem, null, 2));
```

Output:

```json
{
  "seed": 1549748672440,
  "stars": [
    {
      "starType": "M",
      "color": "#ffcc6f",
      "luminosity": 0.08146542016231641,
      "radius": 0.6672486719861627,
      "mass": 0.00004404465444029455,
      "metallicity": -0.4644594123491739
    }
  ],
  "planets": [
    {
      "planetType": "Neptunian",
      "distance": 0.7056894102143391,
      "star": {...},
      "mass": 50.855421425168565,
      "radius": 10.156380943821096
    },
    {
      "planetType": "Neptunian",
      "distance": 1.4088214414363596,
      "star": {...},
      "mass": 93.80083236897875,
      "radius": 14.574778000691158
    },
    {
      "planetType": "Terran",
      "distance": 1.6471194862679563,
      "star": {...},
      "mass": 1.5873990501015234,
      "radius": 1.1381306327054284
    },
    {
      "planetType": "Terran",
      "distance": 4.667571108746888,
      "star": {...},
      "mass": 0.38512287666914696,
      "radius": 0.7655398605940172
    }
  ],
  "habitableZoneMin": 0.27854284130147977,
  "habitableZoneMax": 0.5492938907169364
}
```

## Rough API with units

```ts
class StarSystem {
  seed: number;
  stars: Array<Star>;
  planets: Array<Planet>;
  habitableZoneMin: number; // AU
  habitableZoneMax: number; // AU
}

class Star {
    starType: "M|K|G|F|A|B|O";
    luminosity: number;   // L⊙ (sun watts)
    mass: number;         // M⊙ (sun masses)
    radius: number;       // R⊙ (sun radii)
    color: string;        // Hex color string
    metallicity: number;  // [Fe/H]
}

class Planet {
    distance: number;     // AU
    mass: number;         // Earth masses
    radius: number;       // Earth radii
    star: Star;
    planetType: "Terran|Neptunian|Jovian"
}
```

## Changelog

### 0.1.5

* Initial release with docs

## Links

## Stars

* [What Color are the Stars?][starcolors]
* [The Real Starry Sky][starrysky]
* [Calculating the Radius of a Star][starradius]
* [Metallicity of Stars][starmetallicity]
* [The Metallicity Distribution of the Milky Way Bulge][milkywaymetallicity]

## Exoplanets

* [Stars and Habitable Planets](http://www.solstation.com/habitable.htm)
* [The Planet-Metallicity Correlation][gasgiantmetallicity]
* [Kepler Mission Objectives][kepler]
* [All the Exoplanets We've Discovered in One Small Chart][popsci_exoplanets]
* [Applying Titus-Bode's Law on Exoplanetary Systems][titusbode2]
* [White Dwarfs, Habitable Zones, and Other Earths][white_dwarf_habitability]
* [Probabilistic Forecasting of the Masses and Radii of Other Worlds][planettypes]

## Prior art

* [Procedurally Generating an Artificial Galaxy][procedural]
* [Procedural Planet Generator](http://thrivegame.wikidot.com/procedural-planet-generator)
* [Shannon Eichorn's Planet Generator](https://blog.shannoneichorn.com/?p=43)

[white_dwarf_habitability]: https://www.technologyreview.com/s/423341/white-dwarfs-habitable-zones-and-other-earths/
[starcolors]: http://www.vendian.org/mncharity/dir3/starcolor/
[procedural]: http://lup.lub.lu.se/luur/download?func=downloadFile&recordOId=8867455&fileOId=8870454
[starrysky]: http://adsabs.harvard.edu/abs/2001JRASC..95...32L
[starradius]: http://cas.sdss.org/dr4/en/proj/advanced/hr/radius1.asp
[starmetallicity]: http://icc.dur.ac.uk/~tt/Lectures/Galaxies/TeX/lec/node27.html
[gasgiantmetallicity]: https://iopscience.iop.org/article/10.1086/428383/pdf
[milkywaymetallicity]: https://arxiv.org/pdf/1511.07438.pdf
[kepler]: https://keplerscience.arc.nasa.gov/objectives.html

[popsci_exoplanets]: https://www.popularmechanics.com/space/deep-space/a13733860/all-the-exoplanets-weve-discovered-in-one-small-chart/
[gasgiants]: https://iopscience.iop.org/article/10.1086/428383/pdf

[titusbode]: https://en.wikipedia.org/wiki/Titius%E2%80%93Bode_law
[titusbode2]: https://arxiv.org/pdf/1602.02877.pdf

[planettypes]: https://arxiv.org/pdf/1603.08614v2.pdf