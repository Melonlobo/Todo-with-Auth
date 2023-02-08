import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContext } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContext>
      <App />
    </AuthContext>
  </React.StrictMode>
);
