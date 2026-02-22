import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { MemberProvider } from "./contexts/MemberContext";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MemberProvider>
          <App />
        </MemberProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
