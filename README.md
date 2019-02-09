# Stellar Dream

**A procedural star system generator**

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

### Prior art

- http://thrivegame.wikidot.com/procedural-planet-generator

### Orbits

- https://physics.stackexchange.com/questions/41020/what-is-the-relationship-between-mass-speed-and-distance-of-a-planet-orbiting-t
- http://homepages.wmich.edu/~korista/Newton-Kepler.html

### Kepler data

- http://www.pnas.org/content/111/35/12647
- http://phl.upr.edu/projects/habitable-exoplanets-catalog

### Classification systems

- https://medium.com/starts-with-a-bang/sorry-super-earth-fans-there-are-only-three-classes-of-planet-44f3da47eb64
- **https://arxiv.org/pdf/1603.08614v2.pdf%29**
- http://phl.upr.edu/library/notes/amassclassificationforbothsolarandextrasolarplanets

### Planet sizes and positions

- https://www.manyworlds.space/index.php/2018/07/09/the-architecture-of-solar-systems/
- https://www.manyworlds.space/index.php/2018/07/03/exoplanet-science-flying-high/
- http://ifa.hawaii.edu/~howard/ast241/exoplanet_properties.pdf
- https://www.nasa.gov/image-feature/ames/planetary-systems-by-number-of-known-planets
- https://exoplanetarchive.ipac.caltech.edu/docs/counts_detail.html
- https://phys.org/news/2017-06-kepler-taught-rocky-planets-common.html