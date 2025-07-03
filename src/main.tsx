import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router";
import HomePage from "./pages/Main";
import "./index.css";
import { Scene } from "./three";
import * as RAPIER from "@dimforge/rapier3d-compat";

async function main() {
  await RAPIER.init();
  new Scene();
}

main();

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
