import { Link } from "react-router-dom";
import { ThemeToggleBtn } from "./ToggleThemeButton";
import "../styles/Header.css";

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
            <Link to={"/logout"}>Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
