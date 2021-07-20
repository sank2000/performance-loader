import React, { useState, useEffect } from 'react';

import './App.css';

import socket from './utilities/socketConnection';

function App() {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    socket.on('data', (data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello socket client </p>
      </header>
    </div>
  );
}

export default App;
