import { CONFIG } from "./config.js";
import { dist2, lerpAngle, rand, wrapAngle } from "./utils.js";

export class Ant {
  constructor(x, y, heading) {
    this.x = x;
    this.y = y;
    this.heading = heading;
    this.hasFood = false;
    this.length = rand(4.6, 6.4);
    this.shade = rand(0.72, 1);
  }

  sense(field, layer) {
    const d = CONFIG.sensorDistance;
    const a = CONFIG.sensorAngle;
    const left = field.sample(
      layer,
      this.x + Math.cos(this.heading - a) * d,
      this.y + Math.sin(this.heading - a) * d
    );
    const forward = field.sample(
      layer,
      this.x + Math.cos(this.heading) * d,
      this.y + Math.sin(this.heading) * d
    );
    const right = field.sample(
      layer,
      this.x + Math.cos(this.heading + a) * d,
      this.y + Math.sin(this.heading + a) * d
    );
    return { left, forward, right };
  }

  steerToward(targetHeading) {
    this.heading = lerpAngle(this.heading, targetHeading, CONFIG.homeBias);
  }

  follow(senses) {
    const { left, forward, right } = senses;
    const strongest = Math.max(left, forward, right);
    if (strongest < 0.8) return;
    if (left > right && left > forward) this.heading -= CONFIG.turnRate;
    else if (right > left && right > forward) this.heading += CONFIG.turnRate;
    else this.heading += (Math.random() - 0.5) * 0.08;
  }

  step(world) {
    this.heading += (Math.random() - 0.5) * CONFIG.wanderStrength;
    const nestAngle = Math.atan2(world.nest.y - this.y, world.nest.x - this.x);

    if (this.hasFood) {
      this.follow(this.sense(world.pheromone, world.pheromone.toHome));
      this.steerToward(nestAngle);
      world.pheromone.deposit(
        world.pheromone.toFood,
        this.x,
        this.y,
        CONFIG.pheromoneDeposit
      );
    } else {
      this.follow(this.sense(world.pheromone, world.pheromone.toFood));
      world.pheromone.deposit(
        world.pheromone.toHome,
        this.x,
        this.y,
        CONFIG.pheromoneDeposit * 0.55
      );
    }

    this.x += Math.cos(this.heading) * CONFIG.antSpeed;
    this.y += Math.sin(this.heading) * CONFIG.antSpeed;
    this.bounce(world);

    if (!this.hasFood) {
      for (const pile of world.food) {
        const grain = pile.take(this.x, this.y);
        if (grain) {
          this.hasFood = true;
          this.heading = wrapAngle(this.heading + Math.PI);
          break;
        }
      }
    } else if (dist2(this.x, this.y, world.nest.x, world.nest.y) < world.nest.radius * world.nest.radius) {
      this.hasFood = false;
      world.storedFood += 1;
      this.heading = wrapAngle(this.heading + Math.PI + rand(-0.4, 0.4));
    }
  }

  bounce(world) {
    const m = 8;
    if (this.x < m) {
      this.x = m;
      this.heading = Math.PI - this.heading;
    } else if (this.x > world.width - m) {
      this.x = world.width - m;
      this.heading = Math.PI - this.heading;
    }
    if (this.y < m) {
      this.y = m;
      this.heading = -this.heading;
    } else if (this.y > world.height - m) {
      this.y = world.height - m;
      this.heading = -this.heading;
    }
  }
}
