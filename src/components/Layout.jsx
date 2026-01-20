import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <TopBar />
      <div className="main-content">
        <Sidebar />
        <div className="workspace">
          {children}
        </div>
      </div>
    </div>
  );
}
