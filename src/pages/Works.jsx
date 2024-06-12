import { Link } from "react-router-dom";
import Table from "../components/Table";
import { useState } from "react";

export default function Works() {
  const columns = [
    { label: "Title" },
    { label: "Medium" },
    { label: "Year", type: "year" },
    { label: "Images" },
    { label: "Events" },
    { label: "Tags" },
  ];

  const defaultData = [
    ["Untitled", "charcoal, video, T6 aluminum", "", "", "", ""],
  ];

  const [data, setData] = useState(defaultData);

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
      <div className="container-body">
        <Table columns={columns} data={data} />
      </div>
      <div className="container-footer"></div>
    </div>
  );
}
