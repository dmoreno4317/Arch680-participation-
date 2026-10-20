import { CONFIG } from "./config.js";
import { Ant } from "./ant.js";
import { FoodPile } from "./food.js";
import { PheromoneField } from "./pheromone.js";
import { rand } from "./utils.js";

export class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.nest = {
      x: width * 0.34,
      y: height * 0.52,
      radius: CONFIG.nestRadius,
    };
    this.pheromone = new PheromoneField(width, height);
    this.food = [
      new FoodPile(width * 0.78, height * 0.28, 90),
      new FoodPile(width * 0.72, height * 0.76, 90),
    ];
    this.ants = [];
    this.storedFood = 0;
    this.spawnAnts();
  }

  spawnAnts() {
    for (let i = 0; i < CONFIG.antCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * this.nest.radius * 0.8;
      this.ants.push(
        new Ant(
          this.nest.x + Math.cos(a) * r,
          this.nest.y + Math.sin(a) * r,
          rand(-Math.PI, Math.PI)
        )
      );
    }
  }

  addFood(x, y) {
    const nearby = this.food.find(
      (pile) => Math.hypot(pile.x - x, pile.y - y) < 40
    );
    if (nearby) {
      nearby.scatter(CONFIG.clickFoodGrains);
      nearby.recenter();
      return;
    }
    this.food.push(new FoodPile(x, y, CONFIG.clickFoodGrains));
  }

  step() {
    this.food = this.food.filter((pile) => !pile.empty);
    for (const ant of this.ants) ant.step(this);
    this.pheromone.evaporate();
  }
}
