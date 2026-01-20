import { useEffect, useRef } from "react";

const W = 320;
const H = 160;
const PADDING = 30;

export default function PendulumGraphs({ time, theta, omega }) {
  const tRef = useRef(null);
  const oRef = useRef(null);
  const dataRef = useRef([]);

  useEffect(() => {
    dataRef.current.push({ t: time, theta, omega });

    const drawGrid = (ctx) => {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;

      for (let i = 0; i <= 5; i++) {
        const x = PADDING + (i / 5) * (W - 2 * PADDING);
        ctx.beginPath();
        ctx.moveTo(x, PADDING);
        ctx.lineTo(x, H - PADDING);
        ctx.stroke();
      }

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

      ctx.beginPath();
      ctx.moveTo(PADDING, H - PADDING);
      ctx.lineTo(W - PADDING, H - PADDING);
      ctx.stroke();

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

    const mapX = (t) => PADDING + (t / 10) * (W - 2 * PADDING);
    const mapYTheta = (th) =>
      H / 2 - (th / Math.PI) * (H / 2 - PADDING);
    const mapYOmega = (o) =>
      H / 2 - (o / 5) * (H / 2 - PADDING);

    // ====== THETA GRAPH ======
    const tctx = tRef.current.getContext("2d");
    tctx.clearRect(0, 0, W, H);

    drawGrid(tctx);
    drawAxes(tctx, "Time (s)", "Angle (rad)");

    tctx.strokeStyle = "#2563eb";
    tctx.lineWidth = 2;
    tctx.beginPath();
    dataRef.current.forEach((p, i) => {
      const x = mapX(p.t);
      const y = mapYTheta(p.theta);
      i === 0 ? tctx.moveTo(x, y) : tctx.lineTo(x, y);
    });
    tctx.stroke();

    tctx.fillStyle = "#2563eb";
    tctx.fillRect(W - 90, 10, 10, 10);
    tctx.fillStyle = "#000";
    tctx.fillText("Theta (θ)", W - 75, 20);

    // ====== OMEGA GRAPH ======
    const octx = oRef.current.getContext("2d");
    octx.clearRect(0, 0, W, H);

    drawGrid(octx);
    drawAxes(octx, "Time (s)", "Angular Velocity (rad/s)");

    octx.strokeStyle = "#16a34a";
    octx.lineWidth = 2;
    octx.beginPath();
    dataRef.current.forEach((p, i) => {
      const x = mapX(p.t);
      const y = mapYOmega(p.omega);
      i === 0 ? octx.moveTo(x, y) : octx.lineTo(x, y);
    });
    octx.stroke();

    octx.fillStyle = "#16a34a";
    octx.fillRect(W - 120, 10, 10, 10);
    octx.fillStyle = "#000";
    octx.fillText("Angular Velocity (ω)", W - 105, 20);
  }, [time, theta, omega]);

  return (
    <div className="graph-stack">
      <div className="graph-panel">
        <h4>Angle (θ) vs Time</h4>
        <canvas ref={tRef} width={W} height={H} />
      </div>

      <div className="graph-panel">
        <h4>Angular Velocity (ω) vs Time</h4>
        <canvas ref={oRef} width={W} height={H} />
      </div>
    </div>
  );
}
