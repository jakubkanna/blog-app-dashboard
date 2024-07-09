import { Outlet, useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";

const PageContainer = ({ title }) => {
  const { id } = useParams();

  return (
    <Container maxWidth="100%">
      <div style={{ marginBottom: "20px" }}>
        <Typography variant="h4">{title.replace(":id", id || "")}</Typography>
      </div>
      <div style={{ minHeight: "300px" }}>
        <Outlet />
      </div>
      {/* You can add a footer here if needed */}
    </Container>
  );
};

export default PageContainer;
