import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import ProgrammingMazePuzzle from '../puzzles/ProgrammingMazePuzzle';
import './Level4Peak.css';

const Level4Peak = () => {
  const { state, updateLevel4State, updateScore, showScreen } = useGame();
  
  // Estados principales del nivel
  const [currentPhase, setCurrentPhase] = useState('intro'); // intro, programming, completed
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState({
    programming: false
  });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  // Timer para medir tiempo
  useEffect(() => {
    if (gameStarted && currentPhase !== 'completed') {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, currentPhase]);

  // Inicializar el nivel
  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true);
      // Mostrar intro animada por 5 segundos
      setTimeout(() => {
        setShowIntroAnimation(false);
        startFirstPuzzle();
      }, 5000);
    }
  }, [gameStarted]);

  // Funciones de utilidad
  const showTemporaryMessage = (message, duration = 4000) => {
    setCurrentMessage(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), duration);
  };

  const startFirstPuzzle = () => {
    setCurrentPhase('programming');
    showTemporaryMessage("¡Sin programación, nadie puede navegar este laberinto! Si quieres rescatar a tu amiga, tendrás que pensar como un ingeniero de software.", 6000);
    setTimeout(() => {
      setShowPuzzle(true);
    }, 6000);
  };

  const handlePuzzleComplete = (puzzleType) => {
    setShowPuzzle(false);
    setCompletedPuzzles(prev => ({ ...prev, [puzzleType]: true }));
    
    if (puzzleType === 'programming') {
      completeLevel();
    }
  };

  const handlePuzzleClose = () => {
    setShowPuzzle(false);
  };

  const completeLevel = () => {
    setCurrentPhase('completed');
    updateLevel4State({ possumRescued: true });
    updateScore(1000);
    
    showTemporaryMessage("¡Zarigüeya rescatada! Has dominado la programación con bloques.", 4000);
    
    setTimeout(() => {
      showScreen('level-summary-screen');
    }, 5000);
  };

  // Función para desarrolladores - completar nivel automáticamente
  const skipToCompletion = () => {
    if (window.confirm('¿Completar nivel automáticamente? (Solo para desarrolladores)')) {
      completeLevel();
    }
  };

  return (
    <div id="level4-peak" className="level-container">
      {/* Mensaje temporal */}
      {showMessage && (
        <div className="temporary-message">
          <div className="message-content">
            <p>{currentMessage}</p>
          </div>
        </div>
      )}

      {/* Contenido principal del nivel */}
      {showIntroAnimation && (
        <div className="level-intro-animation">
          <div className="intro-background">
            <div className="mountain-peak">
              <div className="wind-clouds"></div>
              <div className="code-walls"></div>
              <div className="floating-platforms"></div>
            </div>
          </div>
          
          <div className="intro-content">
            <div className="intro-title">
              <h1>🌪️ Nivel 4 - Pico de Software</h1>
              <div className="subtitle">Zarigüeya Atrapada</div>
            </div>
            
            <div className="intro-story">
              <div className="story-text">
                <p>Andy llega a la cima de la montaña y encuentra un laberinto extraño...</p>
                <p>Las paredes están hechas de código roto y los caminos cambian constantemente.</p>
                <p>En el centro, la zarigüeya está atrapada en una jaula digital.</p>
              </div>
              
              <div className="villain-dialogue">
                <div className="villain-avatar">👹</div>
                <div className="dialogue-bubble">
                  <p>"¡Sin programación, nadie puede navegar este laberinto!"</p>
                  <p>"Si quieres rescatar a tu amiga, tendrás que pensar como un ingeniero de software."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showIntroAnimation && currentPhase !== 'completed' && (
        <div className="level4-peak-main">
          {/* Layout de dos columnas */}
          <div className="game-main-area">
            {/* Sidebar izquierdo con información */}
            <div className="game-sidebar-left">
              {/* Información del nivel */}
              <div className="sidebar-block">
                <div className="block-header">
                  <span className="block-icon">🌪️</span>
                  <h4>Pico de Software</h4>
                </div>
                <div className="block-content">
                  <p>⏱️ Tiempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
                  <p>🏆 Puntuación: {state.totalScore}</p>
                  <div className="progress-indicators">
                    <div className={`progress-dot ${completedPuzzles.programming ? 'completed' : 'pending'}`}>
                      🧩
                    </div>
                  </div>
                </div>
              </div>

              {/* Objetivos del puzzle */}
              <div className="sidebar-block">
                <div className="block-header">
                  <span className="block-icon">🎯</span>
                  <h4>Objetivos</h4>
                </div>
                <div className="block-content">
                  <ul>
                    <li>✅ Hacer que Andy llegue a la zarigüeya</li>
                    <li>⭐ Optimizar el código con bucles</li>
                    <li>⭐⭐ Hacer el código robusto con condicionales</li>
                  </ul>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="sidebar-block">
                <div className="block-header">
                  <span className="block-icon">🚀</span>
                  <h4>Acción</h4>
                </div>
                <div className="block-content">
                  <button 
                    className="start-puzzle-btn"
                    onClick={() => setShowPuzzle(true)}
                  >
                    {completedPuzzles.programming ? '🔄 Reintentar' : '🚀 Comenzar Puzzle'}
                  </button>
                  <button className="dev-skip-btn" onClick={skipToCompletion} title="Completar nivel (Dev)">
                    ⚡ Completar (Dev)
                  </button>
                </div>
              </div>
            </div>

            {/* Área central del juego */}
            <div className="game-central-area">
              <div className="peak-scene">
                <div className="scene-header">
                  <h3>🧩 El Gran Laberinto Programado</h3>
                  <p>Programa a Andy usando bloques de código para navegar el laberinto y rescatar a la zarigüeya.</p>
                </div>
                
                <div className="scene-elements">
                  <div className="maze-preview">
                    <div className="maze-grid-preview">
                      <div className="maze-cell start">🚪</div>
                      <div className="maze-cell path">·</div>
                      <div className="maze-cell path">·</div>
                      <div className="maze-cell wall">#</div>
                      <div className="maze-cell path">·</div>
                      <div className="maze-cell path">·</div>
                      <div className="maze-cell target">🦫</div>
                    </div>
                  </div>
                  
                  <div className="possum-trapped">
                    <div className="possum-avatar">🐾</div>
                    <div className="cage-effect">🔒</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPhase === 'completed' && (
        <div className="level-completed-screen">
          <div className="completion-animation">
            <div className="possum-rescued">🐾✨</div>
            <div className="andy-celebration">🐿️🎉</div>
          </div>
          
          <div className="completion-content">
            <h2>🎉 ¡Zarigüeya Rescatada!</h2>
            <p>Andy logró programar su camino a través del laberinto.</p>
            <p>Usando bucles y condicionales, creó un algoritmo eficiente y robusto.</p>
            <p>La zarigüeya está libre y agradecida por el rescate.</p>
            
            <div className="possum-dialogue">
              <div className="possum-avatar">🐾</div>
              <div className="dialogue-bubble">
                <p>"¡Gracias Andy! Aprendí que la Ingeniería de Software no es solo resolver problemas,"</p>
                <p>"sino hacerlo con código claro, optimizado y preparado para errores."</p>
              </div>
            </div>
            
            <div className="final-stats">
              <div className="stat-item">
                <span className="stat-label">⏱️ Tiempo Total:</span>
                <span className="stat-value">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">🧩 Puzzles Completados:</span>
                <span className="stat-value">{Object.values(completedPuzzles).filter(Boolean).length}/1</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">🏆 Puntuación:</span>
                <span className="stat-value">{state.totalScore}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Puzzle overlay */}
      {showPuzzle && (
        <ProgrammingMazePuzzle
          onComplete={() => handlePuzzleComplete('programming')}
          onClose={handlePuzzleClose}
        />
      )}
    </div>
  );
};

export default Level4Peak;