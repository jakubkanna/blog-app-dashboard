import { Outlet } from "react-router-dom";
import { Container, Typography } from "@mui/material";

// eslint-disable-next-line react/prop-types
const PageContainer = ({ title }) => {
  return (
    <Container maxWidth="100%">
      <div style={{ marginBottom: "20px" }}>
        <Typography variant="h4">{title}</Typography>
      </div>
      <div style={{ minHeight: "300px" }}>
        <Outlet />
      </div>
    </Container>
  );
};

export default PageContainer;
