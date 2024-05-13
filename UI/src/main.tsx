import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WordCloud from "./components/word-cloud/WordCloud.tsx";

import "./index.css";
import WorldCloudContainer from "./containers/word-cloud-container/WorldCloudContainer.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <WorldCloudContainer />
    </React.StrictMode>
  </QueryClientProvider>
);
