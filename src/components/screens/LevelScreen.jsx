import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import Level1Garden from '../levels/Level1Garden';
import CablePuzzle from '../puzzles/CablePuzzle';
import ProtocolPuzzle from '../puzzles/ProtocolPuzzle';
import PacketSortingPuzzle from '../puzzles/PacketSortingPuzzle';

const LevelScreen = () => {
  const { state, showScreen, setLevel, updateLevel1State } = useGame();
  const [showIntroCutscene, setShowIntroCutscene] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  const levelData = state.levelData[state.currentLevel];

  useEffect(() => {
    if (state.currentLevel === 1 && !state.level1State.introCompleted) {
      setShowIntroCutscene(true);
    } else {
      startCountdown();
    }
  }, [state.currentLevel, state.level1State.introCompleted]);

  const startCountdown = () => {
    setShowIntroCutscene(false);
    setShowCountdown(true);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowCountdown(false);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStartLevel = () => {
    updateLevel1State({ introCompleted: true });
    startCountdown();
  };

  const renderLevelContent = () => {
    switch (state.currentLevel) {
      case 1:
        return <Level1Garden />;
      default:
        return <div>Nivel en desarrollo...</div>;
    }
  };

  return (
    <div id="level-screen" className="screen">
      {/* Cinemática de Introducción del Nivel */}
      {showIntroCutscene && (
        <div id="level-intro-cutscene" className="cutscene-overlay">
          <div className="cutscene-content">
            <div className="garden-background-intro">
              <div className="network-flowers"></div>
              <div className="broken-router"></div>
              <div className="pigeon-trapped">🕊️</div>
            </div>
            <div className="andy-dialogue">
              <div className="andy-avatar worried">🐿️😟</div>
              <div className="dialogue-box">
                <p id="intro-dialogue">
                  "La Paloma quedó atrapada… pero el Jardín está desconectado. 
                  ¡Las rutas de comunicación están rotas! Si no restablecemos la red, nunca podremos salvarla."
                </p>
              </div>
            </div>
            <div className="intro-instructions">
              <h3>🌻 Jardín de Redes - Nivel 1</h3>
              <p>Tu misión: Restablecer las conexiones de red para rescatar a la Paloma</p>
              <ul>
                <li>🏃 Mueve a Andy con las flechas o WASD</li>
                <li>🦘 Salta con ESPACIO</li>
                <li>📦 Recolecta paquetes de datos</li>
                <li>🔧 Repara los routers apagados</li>
                <li>🌐 Elige los protocolos correctos</li>
              </ul>
            </div>
            <button 
              id="start-level-btn" 
              className="btn-primary"
              onClick={handleStartLevel}
            >
              ¡Empezar Aventura!
            </button>
          </div>
        </div>
      )}

      {/* Pantalla de Inicio del Nivel */}
      {showCountdown && (
        <div className="level-start">
          <h2 id="level-title">{levelData.concept}</h2>
          <div className="concept-info">
            <h3>🌻 Redes y Comunicaciones</h3>
            <p>
              Ayuda a Andy a restablecer las conexiones de red en el jardín para rescatar a la Paloma. 
              ¡Aprende cómo funcionan los protocolos de comunicación!
            </p>
          </div>
          <div className="countdown" id="countdown">{countdown}</div>
        </div>
      )}

      {/* Contenido del juego */}
      {!showIntroCutscene && !showCountdown && (
        <div className="game-container" id="game-container">
          <div className="hud">
            <div className="friends-counter">
              <span className="close-friends-icon">🐿️</span>
              <span id="friends-count">{state.completedLevels.length}/5</span>
            </div>
            <div className="score-counter">
              <span className="coin-icon">🪙</span>
              <span id="score">{state.totalScore.toString().padStart(5, '0')}</span>
            </div>
            <div className="lives-counter">
              <span className="lives-icon">❤️</span>
              <span id="lives">{state.lives}</span>
            </div>
          </div>
          
          {renderLevelContent()}
          
          {/* Overlays de Puzzles */}
          <CablePuzzle />
          <ProtocolPuzzle />
          <PacketSortingPuzzle />
        </div>
      )}
    </div>
  );
};

export default LevelScreen;
