import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { createPhysicsLoop } from "../../engines/physicsLoop";
import { DataLogger } from "../../engines/dataLogger";
import CanvasView from "../../components/CanvasView";
import ControlsPanel from "../../components/ControlsPanel";
import RunResetButtons from "../../components/RunResetButtons";
import PedagogicalQuestions from "../../components/PedagogicalQuestions";
import EnergyGraph from "../../components/graphs/EnergyGraph";

const CANVAS_W = 420;
const CANVAS_H = 260;

const g = 9.8;
const SCALE = 20; // px per meter
const BALL_RADIUS_PX = 6;
const BALL_RADIUS_M = BALL_RADIUS_PX / SCALE;

// --- Finite world (meters) ---
const WORLD = {
  left: 0,
  right: CANVAS_W / SCALE,
  floor: 0,
  ceiling: (CANVAS_H - 20) / SCALE
};

const INITIAL_STATE = {
  x: 1,
  y: 8,
  vx: 8,
  vy: 8,
  m: 1,
  t: 0,
  KE: 0,
  PE: 0,
  E: 0
};

export default function EnergyProjectile() {
  const [state, setState] = useState(INITIAL_STATE);
  const [isRunning, setIsRunning] = useState(false);
  const logger = useRef(new DataLogger("energy-projectile")).current;

  // --- Physics loop ---
  const loop = useRef(
    createPhysicsLoop({
      update: dt => {
        setState(prev => {
          let { x, y, vx, vy, m } = prev;

          // --- Forces ---
          vy -= g * dt;

          // --- Integrate ---
          x += vx * dt;
          y += vy * dt;

          // --- Ground collision (inelastic) ---
          if (y - BALL_RADIUS_M <= WORLD.floor) {
            y = WORLD.floor + BALL_RADIUS_M;
            vx = 0;
            vy = 0;
          }

          // --- Ceiling clamp ---
          if (y + BALL_RADIUS_M >= WORLD.ceiling) {
            y = WORLD.ceiling - BALL_RADIUS_M;
            vy = 0;
          }

          // --- Left wall ---
          if (x - BALL_RADIUS_M <= WORLD.left) {
            x = WORLD.left + BALL_RADIUS_M;
            vx = 0;
          }

          // --- Right wall ---
          if (x + BALL_RADIUS_M >= WORLD.right) {
            x = WORLD.right - BALL_RADIUS_M;
            vx = 0;
          }

          // --- Energies ---
          const speed2 = vx * vx + vy * vy;
          const KE = 0.5 * m * speed2;
          const PE = m * g * (y - BALL_RADIUS_M);
          const E = KE + PE;

          return {
            ...prev,
            x,
            y,
            vx,
            vy,
            t: prev.t + dt,
            KE,
            PE,
            E
          };
        });
      }
    })
  ).current;

  // --- Renderer ---
  const draw = useCallback(
    ctx => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background
      ctx.fillStyle = "#eef2f5";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Ground
      ctx.strokeStyle = "#94a3b8";
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H - 20);
      ctx.lineTo(CANVAS_W, CANVAS_H - 20);
      ctx.stroke();

      // Convert meters → pixels
      const px = state.x * SCALE;
      const py = CANVAS_H - 20 - state.y * SCALE;

      // Projectile
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(px, py, BALL_RADIUS_PX, 0, Math.PI * 2);
      ctx.fill();

      // Readout
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.fillText(`KE: ${state.KE.toFixed(1)} J`, 10, 20);
      ctx.fillText(`PE: ${state.PE.toFixed(1)} J`, 10, 40);
      ctx.fillText(`E: ${state.E.toFixed(1)} J`, 10, 60);
    },
    [state]
  );

  // --- Controls ---
  const handlePlay = () => {
    logger.log("start");
    setIsRunning(true);
    loop.start();
  };

  const handlePause = () => {
    logger.log("pause");
    setIsRunning(false);
    loop.pause();
  };

  const handleReset = () => {
    logger.log("reset");
    loop.reset();
    setIsRunning(false);
    setState(INITIAL_STATE);
  };

  return (
    <div className="page">
      <div className="container sim-page">
        <h2>Energy: Projectile Motion</h2>

        <motion.div
          className="sim-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Simulation */}
          <div style={{ gridArea: "sim" }}>
            <h3>Motion View</h3>
            <CanvasView
              width={CANVAS_W}
              height={CANVAS_H}
              draw={draw}
              isRunning={isRunning}
            />
          </div>

          {/* Controls + Graph */}
          <div style={{ gridArea: "controls" }} className="controls-with-graph">
            <ControlsPanel title="Parameters">
              <label>
                Height (m)
                <input
                  type="range"
                  min="2"
                  max={WORLD.ceiling - 1}
                  step="0.5"
                  value={state.y}
                  onChange={e =>
                    setState(s => ({ ...s, y: +e.target.value, t: 0 }))
                  }
                />
                <span>{state.y.toFixed(1)}</span>
              </label>

              <label>
                Speed X (m/s)
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={state.vx}
                  onChange={e =>
                    setState(s => ({ ...s, vx: +e.target.value }))
                  }
                />
                <span>{state.vx.toFixed(1)}</span>
              </label>

              <label>
                Speed Y (m/s)
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={state.vy}
                  onChange={e =>
                    setState(s => ({ ...s, vy: +e.target.value }))
                  }
                />
                <span>{state.vy.toFixed(1)}</span>
              </label>

              <RunResetButtons
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
              />
            </ControlsPanel>

            <EnergyGraph
              time={state.t}
              KE={state.KE}
              PE={state.PE}
              E={state.E}
            />
          </div>

          {/* Questions */}
          <div style={{ gridArea: "questions" }}>
            <h3>Check Your Understanding</h3>
            <PedagogicalQuestions
              onResetSignal={state.t}
              questions={[
                {
                  id: "ep1",
                  type: "mcq",
                  text: "At the highest point, which energy is maximum?",
                  options: ["Kinetic", "Potential", "Both equal", "Zero"]
                },
                {
                  id: "ep2",
                  type: "text",
                  text:
                    "Why does total mechanical energy remain approximately constant?"
                }
              ]}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
