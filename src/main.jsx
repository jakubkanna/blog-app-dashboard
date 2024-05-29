import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Router from "./Router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <Router />
      </ThemeProvider>
    </React.StrictMode>
  </AuthProvider>
);
