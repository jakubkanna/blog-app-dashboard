import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import getRoutes from "./pages/config/getRoutes.jsx";

const routes = getRoutes();
const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
