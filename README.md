# Stellar Dream

**A procedural star system generator**

[API docs](http://steveasleep.com/stellardream/) (unfortunately not very good due to TypeDoc being immature)

[Fancy demo](http://steveasleep.com/keplverse/)

Example:

```js
// yarn add stellardream
import { StarSystem } from 'stellardream';

const starSystem = new StarSystem(1549747868036);
console.log(JSON.stringify(starSystem, null, 2));
```

Output:

```json
{
  "seed": 1549747868036,
  "stars": [
    {
      "starType": "M",
      "color": "#ffcc6f",
      "luminosity": 0.07814883353601768,
      "radius": 0.6432943872734904,
      "mass": 0.000037298382653340906,
      "metallicity": 0.2528634301283026
    }
  ],
  "planets": [
    {
      "planetType": "Neptunian",
      "distance": 0.16810944726859728,
      "star": {...}
    },
    {
      "planetType": "Terran",
      "distance": 0.496924006806994,
      "star": {...}
    },
    {
      "planetType": "Neptunian",
      "distance": 1.384123549033455,
      "star": {...}
    },
    {
      "planetType": "Jovian",
      "distance": 3.029218926694,
      "star": {...}
    }
  ],
  "habitableZoneMin": 0.2728139668537757,
  "habitableZoneMax": 0.537996397950277
}
```

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