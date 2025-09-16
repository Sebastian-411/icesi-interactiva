import React from 'react';
import { useGame } from '../../context/GameContext';

const OptionsScreen = () => {
  const { state, toggleMusic, toggleSFX, showScreen } = useGame();

  const handleBackClick = () => {
    showScreen('home-screen');
  };

  return (
    <div id="options-screen" className="screen">
      <div className="options-container">
        <h2>Opciones</h2>
        <div className="option-item">
          <label htmlFor="music-toggle">Música:</label>
          <input 
            type="checkbox" 
            id="music-toggle" 
            checked={state.musicEnabled}
            onChange={toggleMusic}
          />
        </div>
        <div className="option-item">
          <label htmlFor="sfx-toggle">Efectos de Sonido:</label>
          <input 
            type="checkbox" 
            id="sfx-toggle" 
            checked={state.sfxEnabled}
            onChange={toggleSFX}
          />
        </div>
        <button 
          id="back-btn" 
          className="btn-primary"
          onClick={handleBackClick}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default OptionsScreen;
