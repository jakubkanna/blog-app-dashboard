import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Message from "./Message";

export default function Main() {
  //test
  const [dirty, setDirty] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let location = useLocation();

  useEffect(() => {
    const importantLocation = "/admin/posts/create";
    const errorText = "Post editor has unsaved changes.";

    if (location.pathname === importantLocation) setDirty(true);

    if (dirty && location.pathname !== importantLocation) {
      setErrorMessage(errorText);
      setDirty(false);
    }
  }, [dirty, location, setDirty]);

  return (
    <>
      <main>
        {errorMessage && (
          <Message
            message={errorMessage}
            type={"warning"}
            url={"posts/create"}
          />
        )}
        <div className="main-content">
          <Sidebar />
          <Outlet context={[dirty, setDirty]} />{" "}
        </div>
      </main>
    </>
  );
}

Main.propTypes = {
  title: PropTypes.string,
};
