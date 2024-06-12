import { Link } from "react-router-dom";
import { sidebarRoutes } from "../Router";

export default function Sidebar() {
  return (
    <aside>
      <ul className="side-menu">
        {sidebarRoutes.map((route, index) => (
          <li key={index} className="side-menu-item">
            <Link to={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
