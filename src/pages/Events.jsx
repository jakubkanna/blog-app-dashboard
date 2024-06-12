import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Events.scss";
import Status from "../components/Status";
import ButtonDelete from "../components/ButtonDelete";
import Table from "../components/Table";

const mockFetchOptions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Option 1", "Option 2", "Option 3"]);
    }, 1000);
  });
};

export default function Events() {
  const columns = useMemo(
    () => [
      { label: "Title" },
      { label: "Start date", type: "date" },
      { label: "End date", type: "date" },
      { label: "Place" },
      { label: "Curators" },
      {
        label: "Tags",
        type: "select",
        fetchOptions: mockFetchOptions,
      },
      { label: "Post", editable: false },
      { label: "Link", editable: false },
    ],
    []
  );

  const defaultData = [
    [
      "Untitled",
      "2022-09-19",
      "2022-09-28",
      "Galeria Miejska Arsenał",
      "Anna Nowak",
      "Group Exhibition",
      "link",
      "link",
    ],
  ];

  const [data, setData] = useState(defaultData);

  return (
    <div className="container">
      <div className="container-head">
        <h2>Events</h2>
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
