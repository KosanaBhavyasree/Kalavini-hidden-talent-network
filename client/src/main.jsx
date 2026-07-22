// src/main.jsx
//
// Entry point of the React app. Vite calls this file first.
// We wrap <App /> in <BrowserRouter> here (not in App.jsx) so that
// App.jsx can stay focused purely on defining routes.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
