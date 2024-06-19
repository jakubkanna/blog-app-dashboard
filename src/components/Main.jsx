import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <main>
      <div className="main-content">
        <Sidebar />
        <Outlet />
      </div>
    </main>
  );
}
