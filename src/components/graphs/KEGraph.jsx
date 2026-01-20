import { useEffect, useRef } from "react";

const W = 350;
const H = 160;
const PADDING = 25;
const MAX_POINTS = 300;

export default function KEGraph({ time, KE }) {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]); // store history

  useEffect(() => {
    // Append new point
    pointsRef.current.push({ t: time, KE });

    // Trim old points
    if (pointsRef.current.length > MAX_POINTS) {
      pointsRef.current.shift();
    }

    const ctx = canvasRef.current.getContext("2d");

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, W, H);

    // Axes
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(PADDING, PADDING);
    ctx.lineTo(PADDING, H - PADDING);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(PADDING, H - PADDING);
    ctx.lineTo(W - PADDING, H - PADDING);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText("Total KE (J)", 5, 15);
    ctx.fillText("Time (s)", W - 60, H - 8);

    if (pointsRef.current.length < 2) return;

    // Scale data
    const times = pointsRef.current.map(p => p.t);
    const KEs = pointsRef.current.map(p => p.KE);

    const tMin = Math.max(0, times[0]);
    const tMax = times[times.length - 1] || 1;
    const keMax = Math.max(...KEs, 0.1);

    const scaleX = (t) =>
      PADDING + ((t - tMin) / (tMax - tMin || 1)) * (W - 2 * PADDING);

    const scaleY = (ke) =>
      H - PADDING - (ke / keMax) * (H - 2 * PADDING);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;

    pointsRef.current.forEach((p, i) => {
      const x = scaleX(p.t);
      const y = scaleY(p.KE);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }, [time, KE]);

  return (
    <div className="ke-graph-panel">
      <h3>Live Total Kinetic Energy</h3>
      <canvas ref={canvasRef} width={W} height={H} />
    </div>
  );
}
