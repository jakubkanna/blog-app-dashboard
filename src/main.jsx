import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Router from "./Router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <Router />
      </ThemeProvider>
    </React.StrictMode>
  </AuthProvider>
);
