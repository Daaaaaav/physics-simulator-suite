import { useEffect, useRef } from "react";

const WIDTH = 360;
const HEIGHT = 160;
const MAX_POINTS = 300;

export default function EnergyGraph({ time, KE, PE, E }) {
  const canvasRef = useRef(null);
  const dataRef = useRef({
    t: [],
    KE: [],
    PE: [],
    E: []
  });

  // ---- DATA COLLECTION ----
  useEffect(() => {
    if (time === 0) {
      dataRef.current = { t: [], KE: [], PE: [], E: [] };
      return;
    }

    dataRef.current.t.push(time);
    dataRef.current.KE.push(KE);
    dataRef.current.PE.push(PE);
    dataRef.current.E.push(E);

    if (dataRef.current.t.length > MAX_POINTS) {
      Object.keys(dataRef.current).forEach(
        k => dataRef.current[k].shift()
      );
    }
  }, [time, KE, PE, E]);

  // ---- RENDER ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const allEnergies = [
      ...dataRef.current.KE,
      ...dataRef.current.PE,
      ...dataRef.current.E
    ];

    const maxE = Math.max(...allEnergies, 1);

    const drawLine = (values, color) => {
      ctx.strokeStyle = color;
      ctx.beginPath();

      values.forEach((v, i) => {
        const x = (i / MAX_POINTS) * WIDTH;
        const y = HEIGHT - (v / maxE) * (HEIGHT - 20);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
    };

    drawLine(dataRef.current.KE, "#ef4444"); // red
    drawLine(dataRef.current.PE, "#3b82f6"); // blue
    drawLine(dataRef.current.E, "#10b981");  // green

    // Axes
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT - 1);
    ctx.lineTo(WIDTH, HEIGHT - 1);
    ctx.stroke();

    // Legend
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ef4444";
    ctx.fillText("KE", 10, 14);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("PE", 45, 14);
    ctx.fillStyle = "#10b981";
    ctx.fillText("Total", 80, 14);
  }, [time]);

  return (
    <div className="graph-panel">
      <h4>Energy vs Time</h4>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  );
}
