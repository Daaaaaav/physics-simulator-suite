import { useEffect, useRef } from "react";

const W = 320;
const H = 160;
const PADDING = 30;

export default function FreeFallGraphs({ time, y, v, impactTime }) {
  const hRef = useRef(null);
  const vRef = useRef(null);
  const dataRef = useRef([]);

  useEffect(() => {
    dataRef.current.push({ t: time, y, v });

    // ---- Common helpers ----
    const drawGrid = (ctx) => {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;

      // vertical grid lines
      for (let i = 0; i <= 5; i++) {
        const x = PADDING + (i / 5) * (W - 2 * PADDING);
        ctx.beginPath();
        ctx.moveTo(x, PADDING);
        ctx.lineTo(x, H - PADDING);
        ctx.stroke();
      }

      // horizontal grid lines
      for (let i = 0; i <= 4; i++) {
        const y = PADDING + (i / 4) * (H - 2 * PADDING);
        ctx.beginPath();
        ctx.moveTo(PADDING, y);
        ctx.lineTo(W - PADDING, y);
        ctx.stroke();
      }
    };

    const drawAxes = (ctx, xLabel, yLabel) => {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;

      // x-axis
      ctx.beginPath();
      ctx.moveTo(PADDING, H - PADDING);
      ctx.lineTo(W - PADDING, H - PADDING);
      ctx.stroke();

      // y-axis
      ctx.beginPath();
      ctx.moveTo(PADDING, PADDING);
      ctx.lineTo(PADDING, H - PADDING);
      ctx.stroke();

      ctx.fillStyle = "#000";
      ctx.font = "10px Arial";
      ctx.fillText(xLabel, W / 2 - 15, H - 8);
      ctx.save();
      ctx.translate(8, H / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(yLabel, 0, 0);
      ctx.restore();
    };

    const mapX = (t) => PADDING + (t / 5) * (W - 2 * PADDING);
    const mapYHeight = (y) =>
      H - PADDING - (y / 180) * (H - 2 * PADDING);
    const mapYVel = (v) =>
      H - PADDING - (v / 20) * (H - 2 * PADDING);

    // ========== HEIGHT GRAPH ==========
    const hctx = hRef.current.getContext("2d");
    hctx.clearRect(0, 0, W, H);

    drawGrid(hctx);
    drawAxes(hctx, "Time (s)", "Height (px)");

    hctx.strokeStyle = "#2563eb"; // blue line
    hctx.lineWidth = 2;
    hctx.beginPath();
    dataRef.current.forEach((p, i) => {
      const x = mapX(p.t);
      const ypix = mapYHeight(p.y);
      i === 0 ? hctx.moveTo(x, ypix) : hctx.lineTo(x, ypix);
    });
    hctx.stroke();

    // Legend
    hctx.fillStyle = "#2563eb";
    hctx.fillRect(W - 90, 10, 10, 10);
    hctx.fillStyle = "#000";
    hctx.fillText("Height", W - 75, 20);

    // Impact marker
    if (impactTime) {
      const x = mapX(impactTime);
      hctx.strokeStyle = "#dc2626"; // red
      hctx.beginPath();
      hctx.moveTo(x, PADDING);
      hctx.lineTo(x, H - PADDING);
      hctx.stroke();

      hctx.fillStyle = "#dc2626";
      hctx.fillText(`Impact: ${impactTime.toFixed(2)} s`, x + 5, PADDING + 12);
    }

    // ========== VELOCITY GRAPH ==========
    const vctx = vRef.current.getContext("2d");
    vctx.clearRect(0, 0, W, H);

    drawGrid(vctx);
    drawAxes(vctx, "Time (s)", "Velocity (m/s)");

    vctx.strokeStyle = "#16a34a"; // green line
    vctx.lineWidth = 2;
    vctx.beginPath();
    dataRef.current.forEach((p, i) => {
      const x = mapX(p.t);
      const ypix = mapYVel(p.v);
      i === 0 ? vctx.moveTo(x, ypix) : vctx.lineTo(x, ypix);
    });
    vctx.stroke();

    // Legend
    vctx.fillStyle = "#16a34a";
    vctx.fillRect(W - 90, 10, 10, 10);
    vctx.fillStyle = "#000";
    vctx.fillText("Velocity", W - 75, 20);

    if (impactTime) {
      const x = mapX(impactTime);
      vctx.strokeStyle = "#dc2626";
      vctx.beginPath();
      vctx.moveTo(x, PADDING);
      vctx.lineTo(x, H - PADDING);
      vctx.stroke();
    }
  }, [time, y, v, impactTime]);

  return (
    <div className="graph-stack">
      <div className="graph-panel">
        <h4>Height vs Time</h4>
        <canvas ref={hRef} width={W} height={H} />
      </div>

      <div className="graph-panel">
        <h4>Velocity vs Time</h4>
        <canvas ref={vRef} width={W} height={H} />
      </div>
    </div>
  );
}
