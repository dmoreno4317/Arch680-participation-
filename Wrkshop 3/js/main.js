import { World } from "./world.js";
import { Renderer } from "./renderer.js";
import { bindClickToAdd } from "./input.js";

const canvas = document.getElementById("world");
const renderer = new Renderer(canvas);
let world = null;

function createWorld() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.resize(width, height);
  return new World(width, height);
}

world = createWorld();
bindClickToAdd(canvas, () => world);

window.addEventListener("resize", () => {
  world = createWorld();
});

function frame() {
  world.step();
  renderer.draw(world);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
