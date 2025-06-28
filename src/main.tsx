import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router";
import HomePage from "./pages/Main";
import "./index.css";
import { Scene } from "./three";

new Scene();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route index element={<HomePage />} />
        {/* <Route path="/game" element={<GamePage />} /> */}
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
