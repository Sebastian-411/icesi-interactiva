import React from 'react';
import { GameProvider } from './context/GameContext';
import GameApp from './components/GameApp';
import './App.css';

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App;
