import { Link } from "react-router-dom";
import { useState } from "react";

export default function Works() {
  return (
    <div className="container">
      <div className="container-head">
        <h2>Works</h2>{" "}
        <button
          className={
            sessionStorage.getItem("/admin/events/create") ? "dirty" : ""
          }>
          <Link to={"create"}>Add New</Link>
        </button>
      </div>
      <div className="container-body"></div>
      <div className="container-footer"></div>
    </div>
  );
}
