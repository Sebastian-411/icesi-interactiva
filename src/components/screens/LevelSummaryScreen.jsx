import React from 'react';
import { useGame } from '../../context/GameContext';

const LevelSummaryScreen = ({ isActive }) => {
  const { state, showScreen, completeLevel } = useGame();

  const handleContinue = () => {
    console.log('🏆 Yendo al mapa del mundo');
    
    // Completar el nivel actual
    completeLevel({
      level: state.currentLevel,
      points: state.totalScore,
      stars: 3, // Máximo por ahora
      medals: 1
    });
    
    showScreen('world-map-screen');
  };

  const levelData = state.levelData[state.currentLevel];

  return (
    <div id="level-summary-screen" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="summary-container">
        <h2>¡NIVEL COMPLETADO!</h2>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Puntaje Obtenido:</span>
            <span id="final-score">{state.totalScore}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Paquetes de Datos:</span>
            <span id="data-collected">{state.level1State.dataPacketsCollected}/4</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Amigos Rescatados:</span>
            <span id="friends-rescued">{state.level1State.pigeonRescued ? 1 : 0}</span>
          </div>
        </div>
        <div className="knowledge-capsule">
          <h3>Cápsula de Conocimiento Icesi</h3>
          <p id="knowledge-text">
            Sabías que... La Universidad Icesi usa servicios en la nube como AWS y Azure para potenciar 
            sus plataformas de investigación y aprendizaje. ¡Lo que acabas de hacer es el día a día de un 
            ingeniero de sistemas!
          </p>
        </div>
        <div className="andy-closing-message">
          <div className="andy-avatar-small">🐿️</div>
          <p>"¡Primer amigo rescatado! Pero el villano aún controla la Cueva de Sistemas… ¿te atreves a seguir?"</p>
        </div>
        <button 
          id="continue-btn" 
          className="btn-primary"
          onClick={handleContinue}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export default LevelSummaryScreen;
