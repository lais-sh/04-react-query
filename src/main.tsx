import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import App from "./components/App/App";
import "modern-normalize";
import "./index.css";

// Ініціалізуємо клієнт для керування кешем запитів
const queryHandler = new QueryClient();

const container = document.getElementById("root")!;

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryHandler}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
