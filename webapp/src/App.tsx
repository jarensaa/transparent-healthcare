import React from "react";
import Layout from "./pages/Shared/components/Layout";
import { BrowserRouter } from "react-router-dom";
import { KeyContextProvider } from "./context/KeyContext";

/*
const stomp = useContext(WebSocketContext);

stomp.watch("/authority/proposal").subscribe(message => {
  console.log(message.body);
});

*/

export default function App() {
  return (
    <BrowserRouter>
      <KeyContextProvider>
        <Layout></Layout>;
      </KeyContextProvider>
    </BrowserRouter>
  );
}
