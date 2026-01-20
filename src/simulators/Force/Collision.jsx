import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { createPhysicsLoop } from "../../engines/physicsLoop";
import { DataLogger } from "../../engines/dataLogger";

import ControlsPanel from "../../components/ControlsPanel";
import RunResetButtons from "../../components/RunResetButtons";
import CanvasView from "../../components/CanvasView";
import KEGraph from "../../components/graphs/KEGraph";
import PedagogicalQuestions from "../../components/PedagogicalQuestions";

/* =====================
   CONSTANTS
===================== */
const CANVAS_W = 400;
const CANVAS_H = 180;

const PIXELS_PER_METER = 40;
const BOX_SIZE_M = 0.4;
const BOX_SIZE_PX = BOX_SIZE_M * PIXELS_PER_METER;

const WORLD_W_M = CANVAS_W / PIXELS_PER_METER;
const FLOOR_Y = CANVAS_H / 2 - BOX_SIZE_PX / 2;

/* =====================
   INITIAL STATE
===================== */
const INITIAL_STATE = {
  x1: 1.0,
  v1: 2.5,
  m1: 1,

  x2: 7.0,
  v2: -1.5,
  m2: 1,

  e: 1,
  t: 0,

  KE1: 0,
  KE2: 0,
  KEtotal: 0
};

export default function Collision() {
  const [state, setState] = useState(INITIAL_STATE);
  const [isRunning, setIsRunning] = useState(false);
  const [collisionCount, setCollisionCount] = useState(0);

  const logger = useRef(new DataLogger("collision")).current;

  /* =====================
     PHYSICS LOOP
  ===================== */
  const loop = useRef(
    createPhysicsLoop({
      update: (dt) => {
        setState(prev => {
          let { x1, v1, x2, v2, m1, m2, e } = prev;

          /* ---- Integrate motion ---- */
          x1 += v1 * dt;
          x2 += v2 * dt;

          /* ---- Wall collisions ---- */
          const maxX = WORLD_W_M - BOX_SIZE_M;

          if (x1 <= 0 || x1 >= maxX) {
            x1 = Math.max(0, Math.min(x1, maxX));
            v1 *= -1;
          }

          if (x2 <= 0 || x2 >= maxX) {
            x2 = Math.max(0, Math.min(x2, maxX));
            v2 *= -1;
          }

          /* ---- Block collision (direction-aware) ---- */
          const x1Right = x1 + BOX_SIZE_M;
          const x2Left = x2;

          const overlapping = x1Right >= x2Left;
          const approaching = v1 > v2;

          if (overlapping && approaching) {
            setCollisionCount(c => c + 1);

            logger.log("block_collision", {
              t: prev.t,
              v1,
              v2,
              e
            });

            const newV1 =
              ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / (m1 + m2);

            const newV2 =
              ((m2 - e * m1) * v2 + (1 + e) * m1 * v1) / (m1 + m2);

            v1 = newV1;
            v2 = newV2;

            // Separate blocks to avoid sticking
            const overlap = x1Right - x2Left;
            x1 -= overlap / 2;
            x2 += overlap / 2;
          }

          /* ---- Energies ---- */
          const KE1 = 0.5 * m1 * v1 * v1;
          const KE2 = 0.5 * m2 * v2 * v2;

          return {
            ...prev,
            t: prev.t + dt,
            x1,
            v1,
            x2,
            v2,
            KE1,
            KE2,
            KEtotal: KE1 + KE2
          };
        });
      }
    })
  ).current;

  /* =====================
     CONTROLS
  ===================== */
  const handlePlay = () => {
    logger.log("simulation_start", { t: Date.now() });
    setIsRunning(true);
    loop.start();
  };

  const handlePause = () => {
    logger.log("simulation_pause", { t: Date.now() });
    setIsRunning(false);
    loop.pause();
  };

  const handleReset = () => {
    logger.log("simulation_reset", { t: Date.now() });
    loop.reset();
    setIsRunning(false);
    setCollisionCount(0);
    setState(INITIAL_STATE);
  };

  /* =====================
     DRAW
  ===================== */
  const draw = useCallback((ctx) => {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = "#eef2f5";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.strokeStyle = "#c7d2fe";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y + BOX_SIZE_PX);
    ctx.lineTo(CANVAS_W, FLOOR_Y + BOX_SIZE_PX);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#93c5fd";
    ctx.fillRect(
      state.x1 * PIXELS_PER_METER,
      FLOOR_Y,
      BOX_SIZE_PX,
      BOX_SIZE_PX
    );

    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(
      state.x2 * PIXELS_PER_METER,
      FLOOR_Y,
      BOX_SIZE_PX,
      BOX_SIZE_PX
    );
  }, [state]);

  /* =====================
     UI
  ===================== */
  return (
  <div className="page">
    <div className="container sim-page">
      <h2>Collision Simulation</h2>

      <motion.div
        className="sim-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- Simulation Canvas --- */}
        <div style={{ gridArea: "sim" }}>
          <h3>Motion View</h3>
          <CanvasView
            width={CANVAS_W}
            height={CANVAS_H}
            draw={draw}
            isRunning={isRunning}
          />
        </div>

        {/* --- Controls + Graphs --- */}
        <div
          style={{ gridArea: "controls" }}
          className="controls-with-graph"
        >
          <ControlsPanel title="Parameters">
            {/* sliders here (unchanged logic) */}

            <div className="output-panel">
              <p>Time: {state.t.toFixed(2)} s</p>
              <p>v₁: {state.v1.toFixed(2)} m/s</p>
              <p>v₂: {state.v2.toFixed(2)} m/s</p>
              <p>KE₁: {state.KE1.toFixed(2)} J</p>
              <p>KE₂: {state.KE2.toFixed(2)} J</p>
              <p>
                <strong>Total KE:</strong>{" "}
                {state.KEtotal.toFixed(2)} J
              </p>
              <p>Collisions: {collisionCount}</p>
            </div>

            <RunResetButtons
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
            />
          </ControlsPanel>

          <KEGraph time={state.t} KE={state.KEtotal} />
        </div>

        {/* --- Questions --- */}
        <div style={{ gridArea: "questions" }}>
          <h3>Check Your Understanding</h3>
          <PedagogicalQuestions
            onResetSignal={collisionCount}
            questions={[
              {
                id: "c1",
                type: "mcq",
                text:
                  "In an elastic collision, what happens to total kinetic energy?",
                options: [
                  "Lost",
                  "Gained",
                  "Conserved",
                  "Random"
                ]
              },
              {
                id: "c2",
                type: "text",
                text:
                  "How does mass ratio affect velocity after collision?"
              }
            ]}
          />
        </div>
      </motion.div>
    </div>
  </div>
);
}