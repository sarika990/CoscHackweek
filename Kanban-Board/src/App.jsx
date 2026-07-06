import React from 'react';
import Board from './components/Board';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Kanban Flow</h1>
      </header>
      <main className="board-wrapper" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Board />
      </main>
    </div>
  );
}

export default App;
