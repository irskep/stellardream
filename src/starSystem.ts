import Alea from "alea";
import {
    Star,
} from "./stars";

export class StarSystem {
    seed: number;
    stars: Array<Star>;

    constructor(seed: number) {
        this.seed = seed;

        const alea = new (Alea as any)(seed);

        this.stars = [new Star(alea)];
        
        if (alea() > 0.5) {
            this.stars.push(new Star(alea));
        }

        this.stars.sort((a, b) => {
            return b.mass - a.mass;
        });
    }
}