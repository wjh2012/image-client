import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { env } from "@/config/env.ts";

if (env.ENABLE_API_MOCKING) {
  const { worker } = await import("@/mocks/browser");
  await worker.start();
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
