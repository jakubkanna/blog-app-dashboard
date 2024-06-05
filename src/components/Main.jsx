import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Message from "./Message";

export default function Main() {
  const [errorMessage, setErrorMessage] = useState("");
  const [url, setUrl] = useState("/");
  let location = useLocation();

  useEffect(() => {
    // Check if the current location is outside "/admin/posts" path
    if (
      !location.pathname.startsWith("/admin/posts") ||
      !location.pathname === "/admin/posts"
    ) {
      // Check session storage for items starting with "/admin/posts/"
      for (let key in sessionStorage) {
        if (key.startsWith("/admin/posts/")) {
          setErrorMessage("Posts editor has unsaved changes");
          setUrl(key);
          break; // Stop looping once an unsaved change is found
        }
      }
    } else {
      setErrorMessage("");
    }
  }, [location]);

  return (
    <>
      <main>
        {errorMessage && (
          <Message message={errorMessage} type={"warning"} url={url} />
        )}
        <div className="main-content">
          <Sidebar />
          <Outlet />
        </div>
      </main>
    </>
  );
}

Main.propTypes = {
  title: PropTypes.string,
};
