import { ThemeToggleBtn } from "./ToggleThemeButton";
import "../styles/Header.css";
import Logout from "./Logout";
import usePermissions from "../hooks/usePermissions";

export default function Header() {
  const { isLoggedIn } = usePermissions();

  return (
    <header>
      <nav>
        <h1 className="brandname">Admin Dashboard</h1>
        <ul className="menu">
          {/* <li className="menu-item">
            <ThemeToggleBtn />
          </li> */}
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
