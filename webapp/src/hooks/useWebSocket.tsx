import { createContext } from "react";
import { RxStomp } from "@stomp/rx-stomp";
import SockJS from "sockjs-client";

const rxStompClient = new RxStomp();

rxStompClient.stompClient.webSocketFactory = () => {
  return SockJS("http://localhost:8080/gs-guide-websocket");
};

/*stompClient.onConnect = () => {
  stompClient.subscribe("/authority/proposal", event => {
    console.log(event);
  });
};*/

rxStompClient.activate();

const WebSocketContext = createContext(rxStompClient);

export default WebSocketContext;
