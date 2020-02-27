import React from "react";
import Layout from "./pages/Shared/components/Layout";
import { BrowserRouter } from "react-router-dom";
import { KeyContextProvider } from "./context/KeyContext";
import { AuthorityEventContextProvider } from "./context/AuthorityEventContext";
import { StompContextProvider } from "./context/StompContext";

/*
const stomp = useContext(WebSocketContext);

stomp.watch("/authority/proposal").subscribe(message => {
  console.log(message.body);
});

*/

export default function App() {
  return (
    <BrowserRouter>
      <StompContextProvider>
        <AuthorityEventContextProvider>
          <KeyContextProvider>
            <Layout></Layout>;
          </KeyContextProvider>
        </AuthorityEventContextProvider>
      </StompContextProvider>
    </BrowserRouter>
  );
}
