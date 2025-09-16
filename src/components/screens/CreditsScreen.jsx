import React from 'react';
import { useGame } from '../../context/GameContext';

const CreditsScreen = () => {
  const { showScreen } = useGame();

  const handleBackClick = () => {
    showScreen('final-results-screen');
  };

  return (
    <div id="credits-screen" className="screen">
      <div className="credits-container">
        <h2>Créditos</h2>
        <div className="credits-content">
          <p><strong>Desarrollado para:</strong> Universidad Icesi</p>
          <p><strong>Programa:</strong> Ingeniería de Sistemas</p>
          <p><strong>Personaje:</strong> Andy la Ardilla</p>
          <p><strong>Concepto:</strong> Gamificación Educativa</p>
          <p><strong>Tecnología:</strong> React + Vite</p>
        </div>
        <button 
          id="credits-back-btn" 
          className="btn-primary"
          onClick={handleBackClick}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default CreditsScreen;
