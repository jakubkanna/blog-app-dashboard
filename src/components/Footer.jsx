import "../styles/Footer.scss";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <a href="https://github.com/jakubkanna/blog-app-dashboard">
        <small>
          by jakubkanna <Github width={12} height={12} />
        </small>
      </a>
    </footer>
  );
}
