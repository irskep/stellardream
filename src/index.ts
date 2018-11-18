import Alea from "alea";
import {
    StarTypeProbabilities,
    StarType,
    HabitableZonePlanetLikelihoods,
} from "./stars";
import {StarSystem} from "./starSystem";

/// Tweak probability values to make planets more habitable and life-infested
function cheatStars() {
    StarTypeProbabilities.set(StarType.K, StarTypeProbabilities.get(StarType.K)! + 0.5);
    StarTypeProbabilities.set(StarType.G, StarTypeProbabilities.get(StarType.G)! + 0.5);
    StarTypeProbabilities.set(StarType.F, StarTypeProbabilities.get(StarType.F)! + 0.5);

    // Cheat so about half of G-type stars have a planet in their habitable zones
    for (let k of Object.keys(StarType)) {
        const t = StarType[k as keyof typeof StarType];
        HabitableZonePlanetLikelihoods.set(t, HabitableZonePlanetLikelihoods.get(t)! * 250);
    }
}
// cheatStars();

// main
const main = document.getElementById("js-main");
const seed = Date.now();

if (main) {
    main.innerHTML = '';
    for (let i=0; i<102; i++) {
        const system = new StarSystem(seed + i);

        const systemEl = document.createElement('div');
        systemEl.className = 'system';

        for (let star of system.stars) {
            // const labelEl = document.createElement('div');
            // labelEl.innerHTML = star.starType;
            // labelEl.style.textAlign = 'center';
            // systemEl.appendChild(labelEl);

            const starEl = document.createElement('div');
            systemEl.appendChild(starEl);
            starEl.className = 'star';
            starEl.style.backgroundColor = star.color;
            starEl.innerHTML = star.starType;

            const w = 10 / 0.08 * star.radius;
            starEl.style.width = w.toString() + 'px';
            starEl.style.height = w.toString() + 'px';
            starEl.style.borderRadius = (w / 2).toString() + 'px';

            console.table(system.stars[0]);
        }

        main.appendChild(systemEl);
    }
}