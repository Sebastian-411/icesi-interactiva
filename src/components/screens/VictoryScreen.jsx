import React from 'react';
import { useGame } from '../../context/GameContext';

const VictoryScreen = ({ isActive }) => {
  const { showScreen } = useGame();

  const handleContinue = () => {
    showScreen('final-results-screen');
  };

  return (
    <div id="victory-screen" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="victory-container">
        <div className="victory-animation">
          <div className="andy-celebration">🐿️🎉</div>
          <div className="friends-video-call" id="friends-video-call">
            <div className="friend-video">🕊️</div>
            <div className="friend-video">🦇</div>
            <div className="friend-video">🦎</div>
            <div className="friend-video">🐾</div>
          </div>
        </div>
        <h2>¡LO LOGRAMOS!</h2>
        <p>¡Gracias a tu ingenio, mi comunidad está a salvo! ¡Eres increíble!</p>
        <button 
          className="btn-primary"
          onClick={handleContinue}
        >
          Ver Resultados
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;
