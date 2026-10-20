export function bindClickToAdd(canvas, getWorld) {
  canvas.addEventListener("pointerdown", (event) => {
    const world = getWorld();
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    world.addFood(x, y);
  });
}
