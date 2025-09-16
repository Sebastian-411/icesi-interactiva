import React from 'react';
import { useGame } from '../../context/GameContext';

const FinalResultsScreen = ({ isActive }) => {
  const { state, showScreen } = useGame();

  const calculateRank = (score) => {
    if (score >= 1000) return 'Diseñador de Experiencias Legendario';
    if (score >= 750) return 'Arquitecto de Sistemas';
    if (score >= 500) return 'Desarrollador Senior';
    if (score >= 250) return 'Ingeniero de Sistemas';
    return 'Estudiante Prometedor';
  };

  const handlePlayAgain = () => {
    showScreen('home-screen');
  };

  const handleCredits = () => {
    showScreen('credits-screen');
  };

  return (
    <div id="final-results-screen" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="results-container">
        <h1>¡MISIÓN CUMPLIDA, INGENIER@!</h1>
        <div className="final-stats">
          <div className="final-score">
            <span className="stat-label">Puntaje Total:</span>
            <span id="total-score">{state.totalScore}</span>
          </div>
          <div className="engineer-rank">
            <span className="stat-label">Tu Rango de Ingeniero:</span>
            <span id="rank">{calculateRank(state.totalScore)}</span>
          </div>
        </div>
        <div className="final-message">
          Demostraste tener la lógica, la creatividad y la pasión de un Ingeniero de Sistemas de la Universidad Icesi. 
          ¿Quieres convertir este juego en tu realidad profesional?
        </div>
        <div className="final-actions">
          <a 
            href="https://www.icesi.edu.co/programas/ingenieria-de-sistemas/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary btn-large"
          >
            CONOCE EL PROGRAMA DE ING. DE SISTEMAS EN ICESI
          </a>
          <button 
            id="share-btn" 
            className="btn-secondary"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Andy\'s Close Friends Rescue',
                  text: `¡Completé el juego con ${state.totalScore} puntos!`,
                  url: window.location.href
                });
              }
            }}
          >
            COMPARTE TU LOGRO
          </button>
        </div>
        <div className="final-footer">
          <button 
            id="play-again-btn" 
            className="btn-small"
            onClick={handlePlayAgain}
          >
            Volver a Jugar
          </button>
          <button 
            id="credits-btn" 
            className="btn-small"
            onClick={handleCredits}
          >
            Créditos
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalResultsScreen;
