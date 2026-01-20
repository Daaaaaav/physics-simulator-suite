export default function ControlsPanel({ title, children }) {
  return (
    <div className="controls-panel">
      {title && <h3>{title}</h3>}
      <div className="controls-grid">
        {children}
      </div>
    </div>
  );
}
