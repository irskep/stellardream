import {
    Star,
    StarTypeProbabilities,
    StarType,
    computeHabitableZone,
} from "./stars";
import {
    Planet,
    PlanetType,
    PlanetTypeProbabilities,
} from './planets';
import {StarSystem} from "./starSystem";

// main
const main = document.getElementById("js-stellardream-main");
const seed = Date.now();

if (main) {
    main.innerHTML = '';
    let j = 0;
    for (let i=0; i<102; i++) {
        let system = new StarSystem(seed + j);
        j += 1;
        while (system.planets.length < 4) {
            system = new StarSystem(seed + i + j);
            j += 1;
        }

        const systemEl = document.createElement('div');
        systemEl.className = 'system';

        for (let star of system.stars) {
            const starEl = document.createElement('div');
            systemEl.appendChild(starEl);
            starEl.className = 'star';
            starEl.style.backgroundColor = star.color;
            starEl.innerHTML = star.starType == StarType.M ? "" : star.starType;
            starEl.title = JSON.stringify(star, null, 2);

            const minStarSize = 0.08;
            const minPixelSize = 3;
            const w = minPixelSize / minStarSize * star.radius;
            starEl.style.width = w.toString() + 'px';
            starEl.style.height = w.toString() + 'px';
            starEl.style.borderRadius = (w / 2).toString() + 'px';

            // console.table(system.stars[0]);
        }

        const separatorEl = document.createElement('div');
        systemEl.appendChild(separatorEl);
        separatorEl.className = 'planet-separator';

        const planetsEl = document.createElement('div');
        systemEl.appendChild(planetsEl);
        planetsEl.className = 'planets-container';

        const distanceFactor = 50;

        const hzEl = document.createElement('div');
        planetsEl.appendChild(hzEl);
        hzEl.className = 'hz-indicator';
        const [hzMin, hzMax] = computeHabitableZone(system.stars[0].starType, system.stars[0].luminosity);
        hzEl.style.left = hzMin * distanceFactor + "px";
        hzEl.style.width = (hzMax - hzMin) * distanceFactor + "px";

        let maxDistance = 1;
        for (let planet of system.planets) {
            const planetEl = document.createElement('div');
            planetsEl.appendChild(planetEl);
            planetEl.className = "planet-" + planet.planetType.toString().toLowerCase();
            planetEl.style.position = 'absolute';
            planetEl.style.left = planet.distance * distanceFactor + "px";
            planetEl.title = JSON.stringify(planet, null, 2);
            maxDistance = Math.max(maxDistance, planet.distance);

            planetsEl.style.backgroundColor = 'lightblue';
        }
        planetsEl.style.width = (maxDistance * distanceFactor) + 100 + "px";

        main.appendChild(systemEl);

        console.log(JSON.stringify(system, null, 2));
    }
}

export {
    Star,
    StarSystem,
    StarType,
    StarTypeProbabilities,
    Planet,
    PlanetType,
    PlanetTypeProbabilities,
};