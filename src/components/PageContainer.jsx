import { Outlet, useParams } from "react-router-dom";

const PageContainer = ({ title }) => {
  const { id } = useParams();

  return (
    <>
      <div className="container">
        <div className="container-header">
          <h1>{title.replace(":id", id || "")}</h1>
        </div>
        <div className="container-body">
          <Outlet />
        </div>
        <div className="container-footer"></div>
      </div>
    </>
  );
};

export default PageContainer;
