// frontend-vite/src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ContractProvider from "./context/ContractProvider";

// theme init (apply stored user preference early)
const stored = localStorage.getItem("sec_theme");
if (stored === "dark") document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContractProvider>
        <App />
      </ContractProvider>
    </BrowserRouter>
  </React.StrictMode>
);
