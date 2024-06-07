import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { MessageContext } from "../context/MessageContext";

export default function Main() {
  const location = useLocation();
  const { showMessage, hideMessage } = useContext(MessageContext);

  useEffect(() => {
    // Check if the current location is outside "/admin/posts" path
    if (
      !location.pathname.startsWith("/admin/posts") ||
      !location.pathname === "/admin/posts"
    ) {
      // Check session storage for items starting with "/admin/posts/"
      for (let key in sessionStorage) {
        if (key.startsWith("/admin/posts/")) {
          showMessage({ message: "Posts editor has unsaved changes" }, key);
          break; // Stop looping once an unsaved change is found
        }
      }
    } else {
      // hideMessage();
    }
  }, [location]);

  return (
    <main>
      <div className="main-content">
        <Sidebar />
        <Outlet />
      </div>
    </main>
  );
}
