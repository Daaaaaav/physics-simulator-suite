import { useRef, useEffect } from "react";

export default function CanvasView({
  width = 400,
  height = 200,
  draw,
  isRunning = false
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    function render() {
      if (draw) {
        draw(ctx);
      }
      if (isRunning) {
        animationRef.current = requestAnimationFrame(render);
      }
    }

    if (isRunning) {
      animationRef.current = requestAnimationFrame(render);
    } else {
      // draw one final frame when paused
      draw?.(ctx);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, isRunning]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: "1px solid #ccc",
        background: "#f7f7f7"
      }}
    />
  );
}
