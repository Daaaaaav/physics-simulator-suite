import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { createPhysicsLoop } from "../../engines/physicsLoop";
import { DataLogger } from "../../engines/dataLogger";
import ControlsPanel from "../../components/ControlsPanel";
import RunResetButtons from "../../components/RunResetButtons";
import CanvasView from "../../components/CanvasView";
import FreeFallGraphs from "../../components/graphs/FreeFallGraphs";
import EnergyGraph from "../../components/graphs/EnergyGraph";
import PedagogicalQuestions from "../../components/PedagogicalQuestions";

const BALL_RADIUS = 8;
const START_Y = 30;
const GROUND_Y = 180;
const CANVAS_W = 400;
const CANVAS_H = 200;

export default function FreeFall() {
  const [state, setState] = useState({
    y: START_Y,
    v: 0,
    g: 9.8,
    t: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const [impactTime, setImpactTime] = useState(null);

  const logger = useRef(new DataLogger("free_fall")).current;

  const loop = useRef(
    createPhysicsLoop({
      update: (dt) => {
        setState(prev => {
          const next = {
            ...prev,
            t: prev.t + dt,
            v: prev.v + prev.g * dt,
            y: prev.y + prev.v * dt
          };

          if (next.y >= GROUND_Y - BALL_RADIUS) {
            next.y = GROUND_Y - BALL_RADIUS;
            next.v = 0;

            if (!impactTime) {
              setImpactTime(next.t);
              logger.log("ground_impact", { impactTime: next.t });
            }

            setIsRunning(false);
            return next;
          }

          return next;
        });
      }
    })
  ).current;

  const handlePlay = () => {
    logger.log("simulation_start", { timestamp: Date.now() });
    setIsRunning(true);
    loop.start();
  };

  const handlePause = () => {
    logger.log("simulation_pause", { timestamp: Date.now() });
    setIsRunning(false);
    loop.pause();
  };

  const handleReset = () => {
    logger.log("simulation_reset", { timestamp: Date.now() });
    loop.reset();
    setIsRunning(false);
    setImpactTime(null);
    setState({ y: START_Y, v: 0, g: 9.8, t: 0 });
  };

  const draw = useCallback(
    ctx => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = "#eef2f5";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_W, GROUND_Y);
      ctx.stroke();

      ctx.fillStyle = "#ff3b3b";
      ctx.beginPath();
      ctx.arc(CANVAS_W / 2, state.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.fillText(`y = ${state.y.toFixed(1)} px`, 10, 20);
      ctx.fillText(`v = ${state.v.toFixed(2)} m/s`, 10, 40);
      ctx.fillText(`t = ${state.t.toFixed(2)} s`, 10, 60);

      if (impactTime) {
        ctx.fillText(`Impact: ${impactTime.toFixed(2)} s`, 10, 80);
      }
    },
    [state, impactTime]
  );

  return (
    <div className="page">
      <div className="container sim-page">
        <h2>Free Fall Simulation</h2>

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
          <div style={{ gridArea: "controls" }} className="controls-with-graph">
            <ControlsPanel title="Parameters">
              <label>
                Gravity (m/s²)
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={state.g}
                  onChange={e => setState(s => ({ ...s, g: +e.target.value }))}
                />
                <span>{state.g.toFixed(1)}</span>
              </label>

              <div className="output-panel">
                <p>Time: {state.t.toFixed(2)} s</p>
                <p>Velocity: {state.v.toFixed(2)} m/s</p>
                <p>Height: {state.y.toFixed(1)} px</p>
                {impactTime && <p><strong>Impact:</strong> {impactTime.toFixed(2)} s</p>}
              </div>

              <RunResetButtons
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
              />
            </ControlsPanel>

            <FreeFallGraphs
              time={state.t}
              y={state.y}
              v={state.v}
              impactTime={impactTime}
            />

            <EnergyGraph
                time={state.t}
                KE={state.KE}
                PE={state.PE}
                E={state.E}
            />

          </div>

          {/* --- Questions --- */}
          <div style={{ gridArea: "questions" }}>
            <h3>Check Your Understanding</h3>
            <PedagogicalQuestions
              onResetSignal={impactTime}
              questions={[
                {
                  id: "ff1",
                  type: "mcq",
                  text: "What happens to velocity as the object falls?",
                  options: [
                    "It stays constant",
                    "It increases linearly",
                    "It decreases",
                    "It oscillates"
                  ],
                  hint: "Think about constant acceleration."
                },
                {
                  id: "ff2",
                  type: "text",
                  text: "How would changing gravity affect impact time?"
                }
              ]}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
