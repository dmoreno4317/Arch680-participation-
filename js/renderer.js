export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ground = document.createElement("canvas");
    this.groundCtx = this.ground.getContext("2d");
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ground.width = width;
    this.ground.height = height;
    this.paintGround();
  }

  paintGround() {
    const { width, height } = this.ground;
    const ctx = this.groundCtx;
    ctx.fillStyle = "#07080c";
    ctx.fillRect(0, 0, width, height);

    const specks = Math.floor((width * height) / 280);
    for (let i = 0; i < specks; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const a = 0.04 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(90, 78, 62, ${a})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  draw(world) {
    const ctx = this.ctx;
    const { width, height } = this.canvas;
    ctx.drawImage(this.ground, 0, 0);

    const scent = world.pheromone.paint();
    ctx.imageSmoothingEnabled = true;
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(scent, 0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";

    this.drawNest(world.nest);
    this.drawFood(world.food);
    this.drawAnts(world.ants);
  }

  drawNest(nest) {
    const ctx = this.ctx;
    const glow = ctx.createRadialGradient(
      nest.x,
      nest.y,
      nest.radius * 0.2,
      nest.x,
      nest.y,
      nest.radius * 2.4
    );
    glow.addColorStop(0, "rgba(48, 28, 12, 0.9)");
    glow.addColorStop(0.45, "rgba(18, 12, 8, 0.75)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(nest.x, nest.y, nest.radius * 2.4, 0, Math.PI * 2);
    ctx.fill();

    const hole = ctx.createRadialGradient(
      nest.x - 4,
      nest.y - 5,
      2,
      nest.x,
      nest.y,
      nest.radius
    );
    hole.addColorStop(0, "#2a1a10");
    hole.addColorStop(0.55, "#120c08");
    hole.addColorStop(1, "#050403");
    ctx.fillStyle = hole;
    ctx.beginPath();
    ctx.arc(nest.x, nest.y, nest.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(92, 62, 32, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(nest.x, nest.y, nest.radius - 1, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawFood(piles) {
    const ctx = this.ctx;
    for (const pile of piles) {
      const aura = ctx.createRadialGradient(
        pile.x,
        pile.y,
        4,
        pile.x,
        pile.y,
        36
      );
      aura.addColorStop(0, "rgba(214, 168, 42, 0.22)");
      aura.addColorStop(1, "rgba(214, 168, 42, 0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(pile.x, pile.y, 36, 0, Math.PI * 2);
      ctx.fill();

      for (const grain of pile.grains) {
        ctx.fillStyle = grain.size > 2.4 ? "#e3b84a" : "#c9942e";
        ctx.beginPath();
        ctx.arc(grain.x, grain.y, grain.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawAnts(ants) {
    const ctx = this.ctx;
    for (const ant of ants) {
      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(ant.heading);
      const body = ant.hasFood ? `rgba(210, 168, 96, ${ant.shade})` : `rgba(168, 148, 122, ${ant.shade})`;
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0, 0, ant.length, 1.35, 0, 0, Math.PI * 2);
      ctx.fill();
      if (ant.hasFood) {
        ctx.fillStyle = "#efc45a";
        ctx.beginPath();
        ctx.arc(-ant.length * 0.55, 0, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
}
