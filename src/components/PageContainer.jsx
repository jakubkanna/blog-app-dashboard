import { Outlet } from "react-router-dom";

export default function PageContainer({ title }) {
  return (
    <>
      <div className="container">
        <h1>{title}</h1>
        <Outlet />
      </div>
    </>
  );
}
