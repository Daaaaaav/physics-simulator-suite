import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <h3>Simulations</h3>

      <div className="menu-group">
        <h4>Motion</h4>
        <NavLink to="/motion/freefall">Free Fall</NavLink>
        <NavLink to="/motion/projectile">Projectile</NavLink>
        <NavLink to="/motion/circular">Circular Motion</NavLink>
      </div>

      <div className="menu-group">
        <h4>Oscillation</h4>
        <NavLink to="/oscillation/pendulum">Pendulum</NavLink>
        <NavLink to="/oscillation/spring">Spring-Mass</NavLink>
      </div>

      <div className="menu-group">
        <h4>Force</h4>
        <NavLink to="/force/collision">Collision</NavLink>
      </div>

      <div className="menu-group">
        <h4>Energy</h4>
        <NavLink to="/energy/projectile">Energy: Projectile</NavLink>
        <NavLink to="/energy/pendulum">Energy: Pendulum</NavLink>
      </div>
    </nav>
  );
}
