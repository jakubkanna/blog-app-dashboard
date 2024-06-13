import { Link } from "react-router-dom";

export default function Sidebar() {
  const sidebarRoutes = [
    { path: "/admin/events", name: "Events" },
    { path: "/admin/works", name: "Works" },
    { path: "/admin/posts", name: "Posts" },
    { path: "/admin/comments", name: "Comments" },
    { path: "/admin/settings", name: "Settings" },
  ];
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
