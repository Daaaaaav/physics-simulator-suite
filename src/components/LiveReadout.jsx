export default function LiveReadout({ state }) {
  return (
    <div className="readout">
      <h4>Live Output</h4>
      <p>Position: {state.y.toFixed(2)}</p>
      <p>Velocity: {state.v.toFixed(2)}</p>
      {state.a !== undefined && <p>Acceleration: {state.a.toFixed(2)}</p>}
    </div>
  );
}
