import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <h3>Simulations</h3>

      <div className="menu-group">
        <h4>Motion</h4>
        <NavLink to="/motion/freefall">Free Fall</NavLink>
      </div>

      <div className="menu-group">
        <h4>Oscillation</h4>
        <NavLink to="/oscillation/pendulum">Pendulum</NavLink>
      </div>

      <div className="menu-group">
        <h4>Force</h4>
        <NavLink to="/force/collision">Collision</NavLink>
      </div>

      <div className="menu-group">
        <h4>Energy</h4>
        <NavLink to="/energy/projectile">Energy: Projectile</NavLink>
      </div>
    </nav>
  );
}
