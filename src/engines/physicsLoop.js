export function createPhysicsLoop({ update }) {
  let lastTime = null;
  let running = false;
  let rafId = null;

  function step(time) {
    if (!running) return;

    if (lastTime === null) lastTime = time;
    const dt = (time - lastTime) / 1000; 
    lastTime = time;

    update(dt);

    rafId = requestAnimationFrame(step);
  }

  return {
    start() {
      if (!running) {
        running = true;
        lastTime = null;
        rafId = requestAnimationFrame(step);
      }
    },
    pause() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    },
    reset() {
      this.pause();
      lastTime = null;
    },
    isRunning: () => running
  };
}
