import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside>
      <ul className="side-menu">
        <>
          <li className="side-menu-item">
            <Link to="posts">Posts</Link>
          </li>
          <li className="side-menu-item">
            <Link to="comments">Comments</Link>
          </li>
        </>
        <li className="side-menu-item">
          <Link to="settings">Settings</Link>
        </li>
      </ul>
    </aside>
  );
}
