import { ThemeToggleBtn } from "./ToggleThemeButton";
import "../styles/Header.css";
import Logout from "./Logout";

export default function Header() {
  return (
    <header>
      <nav>
        <h1 className="brandname">Blog App Dashboard</h1>
        <ul className="menu">
          <li className="menu-item">
            <ThemeToggleBtn />
          </li>
          <li className="menu-item">
            <Logout />
          </li>
        </ul>
      </nav>
    </header>
  );
}
