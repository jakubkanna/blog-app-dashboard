import { Outlet } from "react-router-dom";

export default function PageContainer({ title }) {
  return (
    <>
      <div className="container">
        <div className="container-header">
          <h1>{title}</h1>
        </div>
        <div className="container-body">
          <Outlet />
        </div>
        <div className="container-footer"></div>
      </div>
    </>
  );
}
