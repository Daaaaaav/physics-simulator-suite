import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Simulators
import FreeFall from "./simulators/Motion/FreeFall";
import Pendulum from "./simulators/Oscillation/Pendulum";
import Collision from "./simulators/Force/Collision";
import Projectile from "./simulators/Energy/Projectile";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/motion/freefall" />} />

          <Route path="/motion/freefall" element={<FreeFall />} />
          <Route path="/oscillation/pendulum" element={<Pendulum />} />
          <Route path="/force/collision" element={<Collision />} />
          <Route path="/energy/projectile" element={<Projectile />} />
          {/* More routes can be added once built */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
