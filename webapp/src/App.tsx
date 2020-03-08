import React from "react";
import Layout from "./pages/Shared/components/Layout";
import { BrowserRouter } from "react-router-dom";
import { KeyContextProvider } from "./context/KeyContext";
import { AuthorityContextProvider } from "./context/AuthorityContext";
import { StompContextProvider } from "./context/StompContext";
import { Web3ContextProvider } from "./context/Web3Context";
import { ToastContextProvider } from "./context/ToastContext";
import { TreatmentProviderViewContextProvider } from "./context/TreatmentProviderViewContext";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContextProvider>
        <StompContextProvider>
          <Web3ContextProvider>
            <KeyContextProvider>
              <AuthorityContextProvider>
                <TreatmentProviderViewContextProvider>
                  <Layout></Layout>
                </TreatmentProviderViewContextProvider>
              </AuthorityContextProvider>
            </KeyContextProvider>
          </Web3ContextProvider>
        </StompContextProvider>
      </ToastContextProvider>
    </BrowserRouter>
  );
}
