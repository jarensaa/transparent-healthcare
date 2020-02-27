import React, { useState, FunctionComponent } from "react";
import { RxStomp } from "@stomp/rx-stomp";
import SockJS from "sockjs-client";

const StompContext = React.createContext<RxStomp>(new RxStomp());

const StompContextProvider: FunctionComponent = ({ children }) => {
  const rxStompClient = new RxStomp();

  rxStompClient.stompClient.webSocketFactory = () => {
    return SockJS("http://localhost:8080/gs-guide-websocket");
  };

  rxStompClient.activate();

  return (
    <StompContext.Provider value={rxStompClient}>
      {children}
    </StompContext.Provider>
  );
};

export { StompContextProvider };
export default StompContext;
