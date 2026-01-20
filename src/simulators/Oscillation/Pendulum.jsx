import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { createPhysicsLoop } from "../../engines/physicsLoop";
import { DataLogger } from "../../engines/dataLogger";
import ControlsPanel from "../../components/ControlsPanel";
import RunResetButtons from "../../components/RunResetButtons";
import CanvasView from "../../components/CanvasView";
import PendulumGraphs from "../../components/graphs/PendulumGraphs";
import PedagogicalQuestions from "../../components/PedagogicalQuestions";

const CANVAS_W = 400;
const CANVAS_H = 220;
const PIVOT_X = CANVAS_W / 2;
const PIVOT_Y = 30;
const BOB_RADIUS = 8;
const g = 9.8;

export default function Pendulum() {
  const [state, setState] = useState({
    theta: Math.PI / 4,
    omega: 0,
    L: 120,
    t: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const logger = useRef(new DataLogger("pendulum")).current;

  const loop = useRef(
    createPhysicsLoop({
      update: (dt) => {
        setState(prev => {
          const alpha = -(g / prev.L) * Math.sin(prev.theta);
          return {
            ...prev,
            t: prev.t + dt,
            omega: prev.omega + alpha * dt,
            theta: prev.theta + prev.omega * dt
          };
        });
      }
    })
  ).current;

  const draw = useCallback(
    ctx => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = "#eef2f5";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const x = PIVOT_X + state.L * Math.sin(state.theta);
      const y = PIVOT_Y + state.L * Math.cos(state.theta);

      ctx.strokeStyle = "#333";
      ctx.beginPath();
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.fillStyle = "#ff3b3b";
      ctx.beginPath();
      ctx.arc(x, y, BOB_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.fillText(`θ = ${(state.theta * 180 / Math.PI).toFixed(1)}°`, 10, 20);
      ctx.fillText(`ω = ${state.omega.toFixed(2)} rad/s`, 10, 40);
      ctx.fillText(`t = ${state.t.toFixed(2)} s`, 10, 60);
    },
    [state]
  );

  return (
    <div className="page">
      <div className="container sim-page">
        <h2>Pendulum Simulation</h2>

        <motion.div
          className="sim-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Canvas */}
          <div style={{ gridArea: "sim" }}>
            <h3>Motion View</h3>
            <CanvasView
              width={CANVAS_W}
              height={CANVAS_H}
              draw={draw}
              isRunning={isRunning}
            />
          </div>

          {/* Controls + Graphs */}
          <div style={{ gridArea: "controls" }} className="controls-with-graph">
            <ControlsPanel title="Parameters">
              <label>
                Angle (°)
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={(state.theta * 180) / Math.PI}
                  onChange={e => {
                    const newTheta = (+e.target.value * Math.PI) / 180;
                    logger.logParameterChange("theta", state.theta, newTheta);
                    setState(s => ({ ...s, theta: newTheta, omega: 0 }));
                  }}
                />
                <span>{(state.theta * 180 / Math.PI).toFixed(0)}°</span>
              </label>

              <label>
                Length (px)
                <input
                  type="range"
                  min="60"
                  max="160"
                  step="5"
                  value={state.L}
                  onChange={e => {
                    const newL = +e.target.value;
                    logger.logParameterChange("L", state.L, newL);
                    setState(s => ({ ...s, L: newL }));
                  }}
                />
                <span>{state.L} px</span>
              </label>

              <RunResetButtons
                onPlay={() => {
                  setIsRunning(true);
                  loop.start();
                }}
                onPause={() => {
                  setIsRunning(false);
                  loop.pause();
                }}
                onReset={() => {
                  loop.reset();
                  setIsRunning(false);
                  setState({
                    theta: Math.PI / 4,
                    omega: 0,
                    L: 120,
                    t: 0
                  });
                }}
              />
            </ControlsPanel>

            <PendulumGraphs
              time={state.t}
              theta={state.theta}
              omega={state.omega}
            />

          </div>

          {/* Questions */}
          <div style={{ gridArea: "questions" }}>
            <h3>Check Your Understanding</h3>
            <PedagogicalQuestions
              onResetSignal={state.t}
              questions={[
                {
                  id: "p1",
                  type: "mcq",
                  text: "What happens to angular velocity at the endpoints?",
                  options: ["Maximum", "Zero", "Constant", "Undefined"],
                  hint: "Consider turning points."
                },
                {
                  id: "p2",
                  type: "text",
                  text: "How does length affect the period of the pendulum?"
                }
              ]}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
