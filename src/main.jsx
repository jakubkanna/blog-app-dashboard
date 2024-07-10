import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <Router />
      </ThemeProvider>
    </React.StrictMode>
  </AuthProvider>
);
