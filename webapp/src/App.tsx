import React from 'react';
import logo from './logo.svg';
import './App.css';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';



const stompClient = new Client()
stompClient.webSocketFactory = () => {
  return SockJS("http://localhost:8080/gs-guide-websocket")
}

stompClient.activate();

const App = () => {

  const sendMessage = () => {
    console.log("send")
  }

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
        <button onClick={sendMessage}>Click me</button>
      </header>
    </div>
  );
}

export default App;
