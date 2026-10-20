import { CONFIG } from "./config.js";
import { clamp } from "./utils.js";

export class PheromoneField {
  constructor(width, height) {
    this.cell = CONFIG.pheromoneCell;
    this.cols = Math.max(1, Math.ceil(width / this.cell));
    this.rows = Math.max(1, Math.ceil(height / this.cell));
    const size = this.cols * this.rows;
    this.toFood = new Float32Array(size);
    this.toHome = new Float32Array(size);
    this.scratch = new Float32Array(size);
    this.tick = 0;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.image = this.ctx.createImageData(this.cols, this.rows);
  }

  index(x, y) {
    const col = clamp(Math.floor(x / this.cell), 0, this.cols - 1);
    const row = clamp(Math.floor(y / this.cell), 0, this.rows - 1);
    return row * this.cols + col;
  }

  sample(layer, x, y) {
    return layer[this.index(x, y)];
  }

  deposit(layer, x, y, amount) {
    const i = this.index(x, y);
    layer[i] = Math.min(255, layer[i] + amount);
  }

  evaporate() {
    const decay = CONFIG.pheromoneEvaporate;
    const food = this.toFood;
    const home = this.toHome;
    for (let i = 0; i < food.length; i++) {
      food[i] *= decay;
      home[i] *= decay;
      if (food[i] < 0.04) food[i] = 0;
      if (home[i] < 0.04) home[i] = 0;
    }

    this.tick += 1;
    if (this.tick % CONFIG.pheromoneDiffuseEvery === 0) {
      this.diffuse(food);
      this.diffuse(home);
    }
  }

  diffuse(layer) {
    const { cols, rows, scratch } = this;
    scratch.set(layer);
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        const i = y * cols + x;
        const avg =
          (scratch[i] * 4 +
            scratch[i - 1] +
            scratch[i + 1] +
            scratch[i - cols] +
            scratch[i + cols]) /
          8;
        layer[i] = avg;
      }
    }
  }

  paint() {
    const data = this.image.data;
    const food = this.toFood;
    const home = this.toHome;
    for (let i = 0; i < food.length; i++) {
      const f = Math.min(255, food[i]);
      const h = Math.min(255, home[i]);
      const p = i * 4;
      data[p] = h * 0.85 + f * 0.12;
      data[p + 1] = f * 0.72 + h * 0.18;
      data[p + 2] = f * 0.95;
      data[p + 3] = Math.min(210, f * 1.15 + h * 0.55);
    }
    this.ctx.putImageData(this.image, 0, 0);
    return this.canvas;
  }
}
