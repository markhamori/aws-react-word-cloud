import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorldCloudContainer from "./containers/word-cloud-container/WordCloudContainer.tsx";

import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <WorldCloudContainer />
    </React.StrictMode>
  </QueryClientProvider>
);
