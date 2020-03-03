import React from "react";
import Layout from "./pages/Shared/components/Layout";
import { BrowserRouter } from "react-router-dom";
import { KeyContextProvider } from "./context/KeyContext";
import { AuthorityContextProvider } from "./context/AuthorityContext";
import { StompContextProvider } from "./context/StompContext";

export default function App() {
  return (
    <BrowserRouter>
      <StompContextProvider>
        <AuthorityContextProvider>
          <KeyContextProvider>
            <Layout></Layout>
          </KeyContextProvider>
        </AuthorityContextProvider>
      </StompContextProvider>
    </BrowserRouter>
  );
}
