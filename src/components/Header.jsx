import Logout from "./Logout";
import usePermissions from "../utils/usePermissions";

export default function Header() {
  const { isLoggedIn } = usePermissions();

  return (
    <header>
      <nav>
        <h1 className="brandname">Admin Dashboard</h1>
        <ul className="menu">
          {isLoggedIn && (
            <li className="menu-item">
              <Logout />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
