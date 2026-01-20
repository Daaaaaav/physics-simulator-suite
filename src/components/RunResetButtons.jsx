export default function RunResetButtons({ onPlay, onPause, onReset }) {
  return (
    <div className="btn-row">
      <button className="primary" onClick={onPlay}>▶ Run</button>
      <button onClick={onPause}>⏸ Pause</button>
      <button className="secondary" onClick={onReset}>↺ Reset</button>
    </div>
  );
}
