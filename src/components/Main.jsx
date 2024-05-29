import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <>
      <main>
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
