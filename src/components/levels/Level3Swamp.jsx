import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import DataModelingPuzzle from '../puzzles/DataModelingPuzzle';
import SQLQueryPuzzle from '../puzzles/SQLQueryPuzzle';
import TableRelationsPuzzle from '../puzzles/TableRelationsPuzzle';
import SQLInjectionBossPuzzle from '../puzzles/SQLInjectionBossPuzzle';

const Level3Swamp = () => {
  const { state, updateLevel3State, updateScore, showScreen } = useGame();
  
  // Estados principales del nivel
  const [currentPhase, setCurrentPhase] = useState('intro'); // intro, modeling, query, relations, boss, completed
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState({
    modeling: false,
    query: false,
    relations: false,
    boss: false
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
      // Mostrar intro animada por 30 segundos
      setTimeout(() => {
        setShowIntroAnimation(false);
        startFirstPuzzle();
      }, 5000); // Reducido para desarrollo, en producción sería 30000
    }
  }, [gameStarted]);

  // Funciones de utilidad
  const showTemporaryMessage = (message, duration = 4000) => {
    setCurrentMessage(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), duration);
  };

  const startFirstPuzzle = () => {
    setCurrentPhase('modeling');
    showTemporaryMessage("¡Aquí los datos se hunden y nunca se encuentran! Si no sabes cómo organizarlos y consultarlos, tu amiga la iguana quedará atrapada para siempre.", 6000);
    setTimeout(() => {
      setShowPuzzle(true);
    }, 6000);
  };

  const handlePuzzleComplete = (puzzleType) => {
    setShowPuzzle(false);
    setCompletedPuzzles(prev => ({ ...prev, [puzzleType]: true }));
    
    // Determinar siguiente fase
    switch (puzzleType) {
      case 'modeling':
        showTemporaryMessage("¡Excelente! Has organizado los datos correctamente. Ahora debes aprender a consultarlos...", 3000);
        setTimeout(() => {
          setCurrentPhase('query');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'query':
        showTemporaryMessage("¡Perfecto! Dominas las consultas SQL. Ahora necesitamos conectar las tablas...", 3000);
        setTimeout(() => {
          setCurrentPhase('relations');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'relations':
        showTemporaryMessage("¡Impresionante! Las relaciones están establecidas. Pero hay un último desafío: el villano SQL Injection...", 3000);
        setTimeout(() => {
          setCurrentPhase('boss');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'boss':
        completeLevel();
          break;
      }
    };

  const handlePuzzleClose = () => {
    setShowPuzzle(false);
    // Permitir volver a abrir el puzzle
  };

  const completeLevel = () => {
    setCurrentPhase('completed');
    const totalTime = timeElapsed;
    let stars = 3;
    if (totalTime > 600) stars = 2; // Más de 10 minutos
    if (totalTime > 1200) stars = 1; // Más de 20 minutos
    
    updateLevel3State({ 
      iguanaRescued: true, 
      completionTime: totalTime,
      stars: stars
    });
    
    showTemporaryMessage("¡La iguana está libre! Has demostrado que entiendes las bases de datos. ¡Los datos están perfectamente organizados!", 5000);
    
    setTimeout(() => {
      showScreen('level-summary-screen');
    }, 5000);
  };

  const getCurrentPhaseDescription = () => {
    switch (currentPhase) {
      case 'modeling': return 'Organización de Datos';
      case 'query': return 'Consultas SQL';
      case 'relations': return 'Relaciones entre Tablas';
      case 'boss': return 'Defensa contra SQL Injection';
      case 'completed': return '¡Nivel Completado!';
      default: return 'Iniciando...';
    }
  };

  const getPuzzleButtonText = () => {
    switch (currentPhase) {
      case 'modeling': return '📊 Organizar Tabla';
      case 'query': return '📝 Navegar Consultas';
      case 'relations': return '🔗 Conectar Tablas';
      case 'boss': return '🛡️ Defender Base de Datos';
      default: return '🎮 Continuar';
    }
  };

  return (
    <div className="level3-swamp-new">
      {/* HUD */}
      <div className="level-hud">
        <div className="progress-indicator">
          Progreso: {Object.values(completedPuzzles).filter(Boolean).length}/4
        </div>
        <div className="time-indicator">
          Tiempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
        </div>
        
        {/* Botón de desarrollo */}
            <button 
          className="dev-skip-btn"
          onClick={() => completeLevel()}
          title="Modo desarrollo - Completar nivel"
        >
          🚀 COMPLETAR
            </button>
      </div>

      {/* Mensaje temporal */}
      {showMessage && (
        <div className="story-message-overlay">
          <div className="andy-avatar">🐿️🔍</div>
          <div className="message-bubble">
            {currentMessage}
          </div>
        </div>
      )}

      {/* Área principal del juego */}
      <div className="level3-main-area">
        {showIntroAnimation ? (
          <div className="intro-animation">
            <div className="animation-scene">
              <div className="swamp-background">
                <div className="swamp-water">💧🌊💧🌊</div>
                <div className="data-columns">📊📊📊📊</div>
                <div className="lily-pads">🪷🪷🪷🪷</div>
              </div>
              
              <div className="characters">
                <div className="andy-entrance">
                  <div className="andy-character">🐿️🔍</div>
                  <div className="andy-speech">¡Andy llega al pantano de datos!</div>
                </div>
                
                <div className="trapped-iguana-scene">
                  <div className="data-maze">
                    <div className="sql-queries">
                      <span className="malicious-query">💥SELECT💥</span>
                      <span className="malicious-query">💥WHERE💥</span>
                      <span className="malicious-query">💥UNION💥</span>
                      <span className="malicious-query">💥DROP💥</span>
                    </div>
                  </div>
                  <div className="trap-label">Iguana atrapada en consultas maliciosas</div>
                </div>
              </div>
              
              <div className="villain-appearance">
                <div className="villain-character">🦹‍♂️💾</div>
                <div className="villain-speech">
                  <p>"¡Aquí los datos se hunden y nunca se encuentran!"</p>
                  <p>"Si no sabes cómo organizarlos y consultarlos, tu amiga la iguana quedará atrapada para siempre."</p>
                </div>
              </div>
            </div>
            
            <div className="intro-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p>Iniciando bases de datos...</p>
            </div>
          </div>
        ) : (
          <div className="game-main-area">
            {/* Sidebar izquierdo con información */}
            <div className="game-sidebar-left">
              {/* Información del nivel */}
              <div className="sidebar-block">
                <div className="block-header">
                  <span className="block-icon">🌊</span>
                  <h4>Pantano de Datos</h4>
                </div>
                <div className="block-content">
                  <p>⏱️ Tiempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
                  <p>📊 Progreso: {Object.values(completedPuzzles).filter(Boolean).length}/4</p>
                  <div className="progress-indicators">
                    <div className={`progress-dot ${completedPuzzles.modeling ? 'completed' : currentPhase === 'modeling' ? 'active' : 'pending'}`}>1</div>
                    <div className={`progress-dot ${completedPuzzles.query ? 'completed' : currentPhase === 'query' ? 'active' : 'pending'}`}>2</div>
                    <div className={`progress-dot ${completedPuzzles.relations ? 'completed' : currentPhase === 'relations' ? 'active' : 'pending'}`}>3</div>
                    <div className={`progress-dot ${completedPuzzles.boss ? 'completed' : currentPhase === 'boss' ? 'active' : 'pending'}`}>👑</div>
                  </div>
                </div>
              </div>

              {/* Fase actual */}
              <div className="sidebar-block">
                <div className="block-header">
                  <span className="block-icon">📍</span>
                  <h4>Fase Actual</h4>
                </div>
                <div className="block-content">
                  <p><strong>{getCurrentPhaseDescription()}</strong></p>
                  <p>🎯 {getPuzzleButtonText()}</p>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="sidebar-block">
                <div className="block-header">
                  <span className="block-icon">🚀</span>
                  <h4>Acción</h4>
                </div>
                <div className="block-content">
                  {!showPuzzle && currentPhase !== 'completed' && (
                    <button 
                      className="puzzle-trigger-btn"
                      onClick={() => setShowPuzzle(true)}
                    >
                      {getPuzzleButtonText()}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Área central del juego */}
            <div className="game-central-area">
              <div className="swamp-scene">
                <div className="scene-header">
                  <h3>🌊 Pantano de Datos - Bases de Datos</h3>
                  <p>Organiza, consulta y protege los datos para rescatar a la iguana</p>
                </div>
                
                <div className="scene-elements">
                  <div className="andy-character">
                    <div className="character">🐿️🔍</div>
                    <div className="character-label">Andy</div>
                  </div>
                  
                  <div className="database-elements">
                    <div className={`data-modeling ${completedPuzzles.modeling ? 'active' : 'inactive'}`}>
                      <div className="system-icon">📊</div>
                      <div className="system-label">Modelado</div>
                      {completedPuzzles.modeling && <div className="completion-check">✅</div>}
                    </div>
                    
                    <div className={`sql-queries ${completedPuzzles.query ? 'active' : 'inactive'}`}>
                      <div className="system-icon">📝</div>
                      <div className="system-label">Consultas</div>
                      {completedPuzzles.query && <div className="completion-check">✅</div>}
                    </div>
                    
                    <div className={`table-relations ${completedPuzzles.relations ? 'active' : 'inactive'}`}>
                      <div className="system-icon">🔗</div>
                      <div className="system-label">Relaciones</div>
                      {completedPuzzles.relations && <div className="completion-check">✅</div>}
                    </div>
                    
                    <div className={`sql-security ${completedPuzzles.boss ? 'active' : 'inactive'}`}>
                      <div className="system-icon">🛡️</div>
                      <div className="system-label">Seguridad</div>
                      {completedPuzzles.boss && <div className="completion-check">✅</div>}
                    </div>
                  </div>
                  
                  <div className="iguana-area">
                    <div className={`iguana-container ${currentPhase === 'completed' ? 'freed' : 'trapped'}`}>
                      <div className="data-chamber">🗄️</div>
                      <div className={`iguana ${currentPhase === 'completed' ? 'free' : 'frozen'}`}>
                        {currentPhase === 'completed' ? '🦎✨' : '🦎💾'}
                      </div>
                      <div className={`data-lock ${currentPhase === 'completed' ? 'unlocked' : 'locked'}`}>
                        {currentPhase === 'completed' ? '🔓' : '🔒'}
                      </div>
                    </div>
                    <div className="iguana-label">
                      {currentPhase === 'completed' ? '¡Iguana libre!' : 'Iguana en datos'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Puzzles */}
      {showPuzzle && currentPhase === 'modeling' && (
        <DataModelingPuzzle 
          onComplete={() => handlePuzzleComplete('modeling')}
          onClose={handlePuzzleClose}
        />
      )}
      
      {showPuzzle && currentPhase === 'query' && (
        <SQLQueryPuzzle 
          onComplete={() => handlePuzzleComplete('query')}
          onClose={handlePuzzleClose}
        />
      )}
      
      {showPuzzle && currentPhase === 'relations' && (
        <TableRelationsPuzzle 
          onComplete={() => handlePuzzleComplete('relations')}
          onClose={handlePuzzleClose}
        />
      )}
      
      {showPuzzle && currentPhase === 'boss' && (
        <SQLInjectionBossPuzzle 
          onComplete={() => handlePuzzleComplete('boss')}
          onClose={handlePuzzleClose}
        />
      )}

      <style>{`
        .level3-swamp-new {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #1a4d3a 0%, #2d5a47 50%, #1a2f1a 100%);
          position: relative;
          overflow: hidden;
        }

        .level-hud {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(26, 77, 58, 0.9);
          padding: 1rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          z-index: 100;
          color: white;
        }

        .dev-skip-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
        }

        .story-message-overlay {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(26, 77, 58, 0.9);
          padding: 1.5rem;
          border-radius: 15px;
          z-index: 200;
        }

        .andy-avatar {
          font-size: 3rem;
          animation: data-search 2s ease-in-out infinite alternate;
        }

        .message-bubble {
          background: rgba(236, 240, 241, 0.95);
          color: #2c3e50;
          padding: 1rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.4;
          flex: 1;
        }

        .level3-main-area {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding-top: 5rem;
        }

        .game-main-area {
          flex: 1;
          display: flex;
          padding: 0.5rem;
          gap: 0.5rem;
          overflow: hidden;
        }

        .game-sidebar-left {
          flex: 0 0 28%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.3rem;
          overflow-y: auto;
        }

        .game-central-area {
          flex: 1;
          padding: 0.3rem;
          overflow: hidden;
        }

        .sidebar-block {
          background: rgba(26, 77, 58, 0.8);
          border: 2px solid #2d5a47;
          border-radius: 10px;
          padding: 0.8rem;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(26, 77, 58, 0.3);
        }

        .block-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(45, 90, 71, 0.5);
        }

        .block-icon {
          font-size: 1rem;
        }

        .block-header h4 {
          font-size: 0.6rem;
          color: #ecf0f1;
          margin: 0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .block-content {
          color: #ecf0f1;
        }

        .block-content p {
          font-size: 0.5rem;
          line-height: 1.3;
          margin: 0.3rem 0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .progress-indicators {
          display: flex;
          gap: 0.3rem;
          margin-top: 0.5rem;
        }

        .progress-dot {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          border: 2px solid #7f8c8d;
          background: rgba(127, 128, 128, 0.3);
          transition: all 0.3s;
        }

        .progress-dot.active {
          border-color: #2ecc71;
          background: rgba(46, 204, 113, 0.3);
          animation: pulse 1s ease-in-out infinite alternate;
        }

        .progress-dot.completed {
          border-color: #27ae60;
          background: rgba(39, 174, 96, 0.3);
        }

        .swamp-scene {
          background: linear-gradient(180deg, #1a4d3a 0%, #2d5a47 50%, #1a2f1a 100%);
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .scene-header {
          text-align: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .scene-header h3 {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          color: #ecf0f1;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .scene-header p {
          font-size: 0.6rem;
          line-height: 1.3;
          color: #bdc3c7;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .scene-elements {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
          flex: 1;
          justify-content: center;
        }

        .intro-animation {
          text-align: center;
          color: white;
          width: 100%;
          max-width: 900px;
        }

        .animation-scene {
          background: rgba(0, 0, 0, 0.8);
          padding: 3rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          border: 2px solid #2d5a47;
        }

        .swamp-background {
          font-size: 3rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .swamp-water {
          animation: water-flow 3s ease-in-out infinite;
        }

        .data-columns {
          animation: data-pulse 2s ease-in-out infinite alternate;
        }

        .lily-pads {
          animation: lily-float 4s ease-in-out infinite;
        }

        .characters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .andy-entrance {
          text-align: center;
        }

        .andy-character {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: data-walk 2s ease-in-out infinite alternate;
        }

        .andy-speech {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          background: rgba(52, 152, 219, 0.2);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .trapped-iguana-scene {
          text-align: center;
          position: relative;
        }

        .data-maze {
          font-size: 3rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .sql-queries {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .malicious-query {
          font-size: 2rem;
          animation: query-attack 2s ease-in-out infinite;
        }

        .malicious-query:nth-child(2) { animation-delay: 0.3s; }
        .malicious-query:nth-child(3) { animation-delay: 0.6s; }
        .malicious-query:nth-child(4) { animation-delay: 0.9s; }

        .trap-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #e74c3c;
        }

        .villain-appearance {
          text-align: center;
          margin-top: 2rem;
        }

        .villain-character {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: villain-data-menace 2s ease-in-out infinite alternate;
        }

        .villain-speech {
          background: rgba(231, 76, 60, 0.8);
          padding: 1rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.4;
        }

        .villain-speech p {
          margin-bottom: 0.5rem;
        }

        .intro-progress {
          text-align: center;
        }

        .progress-bar {
          width: 400px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          margin: 0 auto 1rem auto;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2ecc71, #3498db);
          width: 0;
          animation: progress-fill 5s ease-out forwards;
        }

        .intro-progress p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
        }

        .swamp-game-area {
          width: 100%;
          max-width: 1000px;
          color: white;
        }

        .swamp-scene {
          background: rgba(26, 77, 58, 0.8);
          padding: 3rem;
          border-radius: 20px;
          border: 2px solid #7f8c8d;
        }

        .scene-elements {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .andy-character,
        .iguana-area {
          text-align: center;
        }

        .character,
        .system-icon,
        .data-chamber {
          font-size: 2.5rem;
          margin-bottom: 0.3rem;
        }

        .character-label,
        .system-label,
        .iguana-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          color: #ecf0f1;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .database-elements {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .data-modeling,
        .sql-queries,
        .table-relations,
        .sql-security {
          text-align: center;
          position: relative;
          padding: 0.8rem;
          border-radius: 10px;
          transition: all 0.3s;
          border: 2px solid;
        }

        .data-modeling.active,
        .sql-queries.active,
        .table-relations.active,
        .sql-security.active {
          background: rgba(46, 204, 113, 0.3);
          border-color: #2ecc71;
          box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
        }

        .data-modeling.inactive,
        .sql-queries.inactive,
        .table-relations.inactive,
        .sql-security.inactive {
          background: rgba(149, 165, 166, 0.3);
          border-color: #95a5a6;
          box-shadow: 0 4px 15px rgba(149, 165, 166, 0.2);
        }

        .completion-check {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 1.5rem;
          animation: completion-pop 0.5s ease-out;
        }

        .iguana-container {
          position: relative;
          text-align: center;
        }

        .iguana {
          position: absolute;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 3rem;
          transition: all 1s ease;
        }

        .iguana.free {
          animation: iguana-freedom 2s ease-out infinite;
        }

        .iguana.frozen {
          animation: data-trapped 1.5s ease-in-out infinite;
        }

        .data-lock {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 2rem;
          transition: all 0.5s;
        }

        .data-lock.unlocked {
          transform: rotate(45deg) scale(0.8);
          opacity: 0.5;
        }

        .phase-indicator {
          text-align: center;
          margin-bottom: 2rem;
        }

        .phase-indicator h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 1rem;
          color: white;
        }

        .progress-indicators {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .phase-dot {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          transition: all 0.3s;
        }

        .phase-dot.pending {
          background: rgba(149, 165, 166, 0.5);
          color: #bdc3c7;
        }

        .phase-dot.active {
          background: #2ecc71;
          color: white;
          animation: pulse 1s ease-in-out infinite alternate;
        }

        .phase-dot.completed {
          background: #27ae60;
          color: white;
        }

        .action-area {
          text-align: center;
        }

        .puzzle-trigger-btn {
          background: linear-gradient(45deg, #2ecc71, #3498db);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          border: 2px solid #229954;
          box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .puzzle-trigger-btn:hover {
          background: linear-gradient(45deg, #27ae60, #2980b9);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
        }

        @media (max-width: 768px) {
          .level3-main-area {
            padding-top: 4rem;
          }
          
          .game-main-area {
            padding: 0.3rem;
            gap: 0.3rem;
          }
          
          .game-sidebar-left {
            gap: 0.3rem;
            padding: 0.3rem;
            max-height: 120px;
            overflow-x: auto;
            flex-direction: row;
          }
          
          .game-central-area {
            min-height: 300px;
          }
          
          .sidebar-block {
            flex: 0 0 180px;
            padding: 0.6rem;
          }
          
          .block-header h4 {
            font-size: 0.5rem;
          }
          
          .block-content p {
            font-size: 0.4rem;
          }
          
          .progress-dot {
            width: 20px;
            height: 20px;
            font-size: 0.6rem;
          }
          
          .puzzle-trigger-btn {
            padding: 0.6rem 1rem;
            font-size: 0.5rem;
          }
          
          .scene-header h3 {
            font-size: 0.7rem;
          }
          
          .scene-header p {
            font-size: 0.5rem;
          }
          
          .character,
          .system-icon,
          .data-chamber {
            font-size: 2rem;
          }
          
          .character-label,
          .system-label,
          .iguana-label {
            font-size: 0.4rem;
          }
          
          .database-elements {
            gap: 0.8rem;
          }
          
          .data-modeling,
          .sql-queries,
          .table-relations,
          .sql-security {
            padding: 0.6rem;
          }
        }

        @keyframes data-search {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.3) drop-shadow(0 0 10px #3498db); }
        }

        @keyframes data-walk {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }

        @keyframes data-trapped {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(0.9) rotate(-2deg); }
        }

        @keyframes water-flow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        @keyframes data-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        @keyframes lily-float {
          0%, 90%, 100% { transform: translateY(0); }
          5% { transform: translateY(2px); }
        }

        @keyframes query-attack {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes villain-data-menace {
          0% { transform: translateY(0) rotate(-2deg); }
          100% { transform: translateY(-15px) rotate(2deg); }
        }

        @keyframes progress-fill {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes completion-pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        @keyframes iguana-freedom {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-20px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .scene-elements {
            flex-direction: column;
            gap: 1rem;
          }
          
          .database-elements {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .character,
          .system-icon,
          .data-chamber {
            font-size: 2.5rem;
          }
          
          .characters {
            flex-direction: column;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Level3Swamp;