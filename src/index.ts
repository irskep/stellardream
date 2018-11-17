import Alea from "alea";

class StarSystem {
    seed: number;
    // u0: number;
    // u1: number;
    // u2: number;
    // u3: number;
    u4: number;
    u5: number;
    u6: number;
    u7: number;
    luminosity: number;
    radius: number;
    r: number;
    g: number;
    b: number;

    constructor(seed: number) {
        this.seed = seed;

        const alea = new (Alea as any)(seed);
        // this.u0 = alea(seed);
        // this.u1 = alea(seed + 1);
        // this.u2 = alea(seed + 2);
        // this.u3 = alea(seed + 3);
        this.u4 = alea(seed + 4) * 0.3 + 0.7;
        this.u5 = 0;
        this.u6 = 0;
        this.u7 = 0;

        this.luminosity = Math.min(
            78100000,
            0.00016 + 45 * Math.pow(-Math.log(1 - this.u4) / 4.6, 5.4));
        this.radius = Math.min(
            12,
            0.08 - 0.43912 * Math.log(1 - this.u4));

        this.r = Math.min(1, 0.62 + Math.pow(-Math.log(this.u4), 0.2));
        this.b = Math.min(1, 0.25 + 0.9 * Math.pow(-Math.log(1 - this.u4) / 4.4, 0.7));
        this.g = this.b + 0.25 / Math.pow(1 + this.u4 * 2, 2)
    }
}

// main
const main = document.getElementById("js-main");
const seed = Date.now();

if (main) {
    main.innerHTML = '';
    console.log(1);
    for (let i=0; i<102; i++) {
        const system = new StarSystem(seed + i);

        const systemEl = document.createElement('div');
        systemEl.className = 'system';

        const starEl = document.createElement('div');
        systemEl.appendChild(starEl);
        starEl.className = 'star';
        starEl.style.backgroundColor = (
            "rgb(" + 255 * system.r + ", " + 255 * system.g + ", " + 255 * system.b + ")"
        );
        starEl.style.width = '50%';
        starEl.style.height = '50%';
        starEl.style.borderRadius = '50%';

        main.appendChild(systemEl);
    }
}