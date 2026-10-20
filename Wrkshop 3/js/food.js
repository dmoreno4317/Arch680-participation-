import { CONFIG } from "./config.js";
import { dist2, rand } from "./utils.js";

export class FoodPile {
  constructor(x, y, grainCount = CONFIG.foodGrainCount) {
    this.x = x;
    this.y = y;
    this.grains = [];
    this.scatter(grainCount);
  }

  scatter(count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 22;
      this.grains.push({
        x: this.x + Math.cos(a) * r,
        y: this.y + Math.sin(a) * r,
        size: rand(1.4, 3.2),
      });
    }
  }

  take(x, y) {
    const r2 = CONFIG.foodPickupRadius * CONFIG.foodPickupRadius;
    for (let i = this.grains.length - 1; i >= 0; i--) {
      if (dist2(x, y, this.grains[i].x, this.grains[i].y) < r2) {
        const grain = this.grains[i];
        this.grains.splice(i, 1);
        this.recenter();
        return grain;
      }
    }
    return null;
  }

  recenter() {
    if (!this.grains.length) return;
    let sx = 0;
    let sy = 0;
    for (const grain of this.grains) {
      sx += grain.x;
      sy += grain.y;
    }
    this.x = sx / this.grains.length;
    this.y = sy / this.grains.length;
  }

  get empty() {
    return this.grains.length === 0;
  }
}
