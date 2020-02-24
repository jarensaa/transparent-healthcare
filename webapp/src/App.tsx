import React, { useContext } from "react";
import logo from "./logo.svg";
import "./App.css";

import WebSocketContext from "./hooks/useWebSocket";

const App = () => {
  const stomp = useContext(WebSocketContext);

  stomp.watch("/authority/proposal").subscribe(message => {
    console.log(message.body);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
