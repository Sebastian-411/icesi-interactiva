import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import ProcessSchedulerPuzzle from '../puzzles/ProcessSchedulerPuzzle';
import MemoryManagementPuzzle from '../puzzles/MemoryManagementPuzzle';
import DeadlockBossPuzzle from '../puzzles/DeadlockBossPuzzle';

const Level2Cave = () => {
  const { state, updateLevel2State, updateScore, showScreen } = useGame();
  
  // Estados principales del nivel
  const [currentPhase, setCurrentPhase] = useState('intro'); // intro, scheduler, memory, deadlock, completed
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState({
    scheduler: false,
    memory: false,
    deadlock: false
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
    setCurrentPhase('scheduler');
    showTemporaryMessage("¡Sin un sistema operativo que administre recursos, el caos reina aquí! Si quieres liberar al murciélago, deberás demostrar que entiendes cómo funciona un SO.", 6000);
    setTimeout(() => {
      setShowPuzzle(true);
    }, 6000);
  };

  const handlePuzzleComplete = (puzzleType) => {
    setShowPuzzle(false);
    setCompletedPuzzles(prev => ({ ...prev, [puzzleType]: true }));
    
    // Determinar siguiente fase
    switch (puzzleType) {
      case 'scheduler':
        showTemporaryMessage("¡Excelente! Has dominado la planificación de procesos. Ahora necesitamos organizar la memoria...", 3000);
        setTimeout(() => {
          setCurrentPhase('memory');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'memory':
        showTemporaryMessage("¡Perfecto! La memoria está optimizada. Ahora hay un último desafío: resolver el deadlock final...", 3000);
        setTimeout(() => {
          setCurrentPhase('deadlock');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'deadlock':
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
    if (totalTime > 400) stars = 2; // Más de 6.5 minutos
    if (totalTime > 800) stars = 1; // Más de 13 minutos
    
    updateLevel2State({ 
      batRescued: true, 
      completionTime: totalTime,
      stars: stars
    });
    
    showTemporaryMessage("¡El murciélago está libre! Has demostrado que entiendes los sistemas operativos. ¡El sistema funciona perfectamente!", 5000);
    
    setTimeout(() => {
      showScreen('level-summary-screen');
    }, 5000);
  };

  // Renderizar la intro animada
  const renderIntroAnimation = () => (
    <div className="intro-animation">
      <div className="animation-scene">
        <div className="cave-background">
          <div className="cave-entrance">🕳️🌑</div>
          <div className="cave-stalactites">🪨🪨🪨🪨</div>
        </div>
        
        <div className="characters">
          <div className="andy-entrance">
            <div className="andy-character">🐿️🔥</div>
            <div className="andy-speech">¡Andy entra a la cueva con su antorcha!</div>
          </div>
          
          <div className="trapped-bat-scene">
            <div className="process-network">
              <div className="frozen-processes">
                <span className="frozen-process">🦇❄️</span>
                <span className="frozen-process">🦇❄️</span>
                <span className="frozen-process">🦇❄️</span>
                <span className="frozen-process">🦇❄️</span>
              </div>
            </div>
            <div className="trap-label">Murciélago atrapado en procesos congelados</div>
          </div>
        </div>
        
        <div className="villain-appearance">
          <div className="villain-character">🦹‍♂️</div>
          <div className="villain-speech">
            <p>"¡Sin un sistema operativo que administre recursos, el caos reina aquí!"</p>
            <p>"Si quieres liberar al murciélago, deberás demostrar que entiendes cómo funciona un SO."</p>
          </div>
        </div>
      </div>
      
      <div className="intro-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <p>Iniciando sistemas operativos...</p>
      </div>
    </div>
  );

  // Renderizar contenido principal
  const renderMainContent = () => {
    if (showIntroAnimation) {
      return renderIntroAnimation();
    }

    if (showPuzzle) {
      return renderCurrentPuzzle();
    }

    return renderGameScene();
  };

  // Renderizar el puzzle actual
  const renderCurrentPuzzle = () => {
    switch (currentPhase) {
      case 'scheduler':
        return (
          <div className="puzzle-container">
            <ProcessSchedulerPuzzle 
              onComplete={() => handlePuzzleComplete('scheduler')}
              onClose={handlePuzzleClose}
            />
          </div>
        );
      case 'memory':
        return (
          <div className="puzzle-container">
            <MemoryManagementPuzzle 
              onComplete={() => handlePuzzleComplete('memory')}
              onClose={handlePuzzleClose}
            />
          </div>
        );
      case 'deadlock':
        return (
          <div className="puzzle-container">
            <DeadlockBossPuzzle 
              onComplete={() => handlePuzzleComplete('deadlock')}
              onClose={handlePuzzleClose}
            />
          </div>
        );
      default:
        return renderGameScene();
    }
  };

  // Renderizar escena del juego
  const renderGameScene = () => (
    <div className="cave-game-area">
      <div className="cave-scene">
        <div className="scene-elements">
          <div className="andy-character">
            <div className="character">🐿️🔥</div>
            <div className="character-label">Andy</div>
          </div>
          
          <div className="system-elements">
            <div className={`cpu-scheduler ${completedPuzzles.scheduler ? 'active' : 'inactive'}`}>
              <div className="system-icon">⚙️</div>
              <div className="system-label">Planificador</div>
              {completedPuzzles.scheduler && <div className="completion-check">✅</div>}
            </div>
            
            <div className={`memory-manager ${completedPuzzles.memory ? 'active' : 'inactive'}`}>
              <div className="system-icon">💾</div>
              <div className="system-label">Memoria</div>
              {completedPuzzles.memory && <div className="completion-check">✅</div>}
            </div>
            
            <div className={`deadlock-resolver ${completedPuzzles.deadlock ? 'active' : 'inactive'}`}>
              <div className="system-icon">🔓</div>
              <div className="system-label">Deadlock</div>
              {completedPuzzles.deadlock && <div className="completion-check">✅</div>}
            </div>
          </div>
          
          <div className="bat-area">
            <div className={`bat-container ${currentPhase === 'completed' ? 'freed' : 'trapped'}`}>
              <div className="cave-chamber">🏛️</div>
              <div className={`bat ${currentPhase === 'completed' ? 'free' : 'frozen'}`}>
                {currentPhase === 'completed' ? '🦇✨' : '🦇❄️'}
              </div>
              <div className={`system-lock ${currentPhase === 'completed' ? 'unlocked' : 'locked'}`}>
                {currentPhase === 'completed' ? '🔓' : '🔒'}
              </div>
            </div>
            <div className="bat-label">
              {currentPhase === 'completed' ? '¡Murciélago libre!' : 'Murciélago congelado'}
            </div>
          </div>
        </div>

        <div className="phase-indicator">
          <h3>📍 Fase Actual: {getCurrentPhaseDescription()}</h3>
          <div className="progress-indicators">
            <div className={`phase-dot ${completedPuzzles.scheduler ? 'completed' : currentPhase === 'scheduler' ? 'active' : 'pending'}`}>1</div>
            <div className={`phase-dot ${completedPuzzles.memory ? 'completed' : currentPhase === 'memory' ? 'active' : 'pending'}`}>2</div>
            <div className={`phase-dot ${completedPuzzles.deadlock ? 'completed' : currentPhase === 'deadlock' ? 'active' : 'pending'}`}>👑</div>
          </div>
        </div>

        {!showPuzzle && currentPhase !== 'completed' && (
          <div className="action-area">
            <button 
              className="puzzle-trigger-btn"
              onClick={() => setShowPuzzle(true)}
            >
              {getPuzzleButtonText()}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Funciones para contenido dinámico
  const getCurrentInstructions = () => {
    switch (currentPhase) {
      case 'scheduler':
        return 'Organiza los procesos en la cola de planificación usando algoritmos de scheduling.';
      case 'memory':
        return 'Gestiona la memoria asignando y liberando bloques de memoria de manera eficiente.';
      case 'deadlock':
        return 'Resuelve el deadlock identificando y rompiendo el ciclo de dependencias.';
      case 'completed':
        return '¡Nivel completado! El murciélago está libre.';
      default:
        return 'Explora la cueva y libera al murciélago resolviendo los desafíos del sistema operativo.';
    }
  };

  const getCurrentStory = () => {
    switch (currentPhase) {
      case 'scheduler':
        return 'El planificador de procesos está desorganizado. Los procesos están esperando indefinidamente.';
      case 'memory':
        return 'La gestión de memoria está fragmentada. Necesitamos optimizar la asignación de memoria.';
      case 'deadlock':
        return 'Un deadlock ha paralizado el sistema. Los recursos están bloqueados mutuamente.';
      case 'completed':
        return '¡El sistema operativo funciona perfectamente! El murciélago puede volar libremente.';
      default:
        return 'Andy entra a la cueva oscura donde el murciélago está atrapado en procesos congelados.';
    }
  };

  const getCurrentProgress = () => {
    const completed = Object.values(completedPuzzles).filter(Boolean).length;
    const total = 3;
    return `${completed}/${total} sistemas operativos resueltos`;
  };

  const getCurrentPhaseDescription = () => {
    switch (currentPhase) {
      case 'scheduler': return 'Cola de Procesos';
      case 'memory': return 'Gestión de Memoria';
      case 'deadlock': return 'Resolución de Deadlock';
      case 'completed': return '¡Nivel Completado!';
      default: return 'Iniciando...';
    }
  };

  const getPuzzleButtonText = () => {
    switch (currentPhase) {
      case 'scheduler': return '⚙️ Organizar Procesos';
      case 'memory': return '💾 Gestionar Memoria';
      case 'deadlock': return '🔓 Resolver Deadlock';
      default: return '🎮 Continuar';
    }
  };

  return (
    <div className="level2-cave-new">

      {/* Mensaje temporal */}
      {showMessage && (
        <div className="story-message-overlay">
          <div className="andy-avatar">🐿️🔥</div>
          <div className="message-bubble">
          {currentMessage}
          </div>
        </div>
      )}

      {/* Área principal del juego */}
      <div className="game-main-area">
        {/* Sidebar izquierdo - Información del juego */}
        <div className="game-sidebar-left">
          <div className="sidebar-block">
            <div className="block-header">
              <div className="block-icon">📋</div>
              <h4>Instrucciones</h4>
            </div>
            <div className="block-content">
              <p>{getCurrentInstructions()}</p>
            </div>
          </div>
          
          <div className="sidebar-block">
            <div className="block-header">
              <div className="block-icon">📖</div>
              <h4>Historia</h4>
            </div>
            <div className="block-content">
              <p>{getCurrentStory()}</p>
            </div>
          </div>
          
          <div className="sidebar-block">
            <div className="block-header">
              <div className="block-icon">🎯</div>
              <h4>Progreso</h4>
            </div>
            <div className="block-content">
              <p>{getCurrentProgress()}</p>
            </div>
          </div>
          
          {showMessage && (
            <div className="sidebar-block message-block">
              <div className="block-header">
                <div className="block-icon">🐿️</div>
                <h4>Andy</h4>
              </div>
              <div className="block-content">
                <p>{currentMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Área central del juego */}
        <div className="game-central-area">
          {renderMainContent()}
        </div>
      </div>


      <style>{`
        .level2-cave-new {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #1a1a2e 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .level-hud {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(44, 62, 80, 0.9);
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


        .game-main-area {
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: row;
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
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.3rem;
          overflow: hidden;
        }

        .sidebar-block {
          background: rgba(44, 62, 80, 0.9);
          border-radius: 10px;
          padding: 0.8rem;
          border: 2px solid #7f8c8d;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .sidebar-block:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .sidebar-block.message-block {
          border-color: #f39c12;
          background: rgba(243, 156, 18, 0.1);
        }

        .block-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(127, 140, 141, 0.3);
        }

        .block-icon {
          font-size: 1rem;
        }

        .block-header h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #ecf0f1;
          margin: 0;
        }

        .block-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          line-height: 1.3;
          color: #bdc3c7;
          margin: 0;
        }

        .puzzle-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
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
          border: 2px solid #34495e;
        }

        .cave-background {
          font-size: 3rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .cave-entrance {
          animation: cave-echo 3s ease-in-out infinite;
        }

        .cave-stalactites {
          animation: stalactite-drip 4s ease-in-out infinite;
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
          animation: torch-walk 2s ease-in-out infinite alternate;
        }

        .andy-speech {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          background: rgba(52, 152, 219, 0.2);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .trapped-bat-scene {
          text-align: center;
          position: relative;
        }

        .process-network {
          font-size: 3rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .frozen-processes {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .frozen-process {
          font-size: 2rem;
          animation: frozen-struggle 2s ease-in-out infinite;
        }

        .frozen-process:nth-child(2) { animation-delay: 0.3s; }
        .frozen-process:nth-child(3) { animation-delay: 0.6s; }
        .frozen-process:nth-child(4) { animation-delay: 0.9s; }

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
          animation: villain-menace 2s ease-in-out infinite alternate;
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
          background: linear-gradient(90deg, #9b59b6, #3498db);
          width: 0;
          animation: progress-fill 5s ease-out forwards;
        }

        .intro-progress p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
        }

        .cave-game-area {
          width: 100%;
          max-width: 100%;
          color: white;
          height: 100%;
        }

        .cave-scene {
          background: rgba(44, 62, 80, 0.9);
          padding: 1.5rem;
          border-radius: 15px;
          border: 3px solid #7f8c8d;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .scene-elements {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
          flex: 1;
        }

        .andy-character,
        .bat-area {
          text-align: center;
        }

        .character,
        .system-icon,
        .cave-chamber {
          font-size: 4rem;
          margin-bottom: 0.5rem;
        }

        .character-label,
        .system-label,
        .bat-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #ecf0f1;
        }

        .system-elements {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cpu-scheduler,
        .memory-manager,
        .deadlock-resolver {
          text-align: center;
          position: relative;
          padding: 1.2rem;
          border-radius: 15px;
          transition: all 0.3s ease;
          min-width: 120px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cpu-scheduler.active,
        .memory-manager.active,
        .deadlock-resolver.active {
          background: linear-gradient(135deg, rgba(46, 204, 113, 0.3), rgba(39, 174, 96, 0.2));
          border: 3px solid #2ecc71;
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
        }

        .cpu-scheduler.inactive,
        .memory-manager.inactive,
        .deadlock-resolver.inactive {
          background: linear-gradient(135deg, rgba(149, 165, 166, 0.2), rgba(127, 140, 141, 0.1));
          border: 2px solid #95a5a6;
          opacity: 0.7;
        }

        .completion-check {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 1.5rem;
          animation: completion-pop 0.5s ease-out;
        }

        .bat-container {
          position: relative;
          text-align: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          border: 2px solid #7f8c8d;
          min-width: 150px;
        }

        .bat {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2.5rem;
          transition: all 1s ease;
          z-index: 2;
        }

        .bat.free {
          animation: bat-freedom 2s ease-out infinite;
        }

        .bat.frozen {
          animation: frozen-struggle 1.5s ease-in-out infinite;
        }

        .system-lock {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 1.5rem;
          transition: all 0.5s;
          z-index: 3;
        }

        .system-lock.unlocked {
          transform: rotate(45deg) scale(0.8);
          opacity: 0.5;
        }

        .phase-indicator {
          text-align: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .phase-indicator h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
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
          background: #9b59b6;
          color: white;
          animation: pulse 1s ease-in-out infinite alternate;
        }

        .phase-dot.completed {
          background: #2ecc71;
          color: white;
        }

        .action-area {
          text-align: center;
          flex-shrink: 0;
        }

        .puzzle-trigger-btn {
          background: linear-gradient(135deg, #9b59b6, #3498db, #2ecc71);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 15px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .puzzle-trigger-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          background: linear-gradient(135deg, #8e44ad, #2980b9, #27ae60);
        }

        .puzzle-trigger-btn:active {
          transform: translateY(-2px) scale(0.98);
        }

        @keyframes torch-flicker {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.3) drop-shadow(0 0 10px #f39c12); }
        }

        @keyframes torch-walk {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }

        @keyframes frozen-struggle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(0.9) rotate(-2deg); }
        }

        @keyframes cave-echo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes stalactite-drip {
          0%, 90%, 100% { transform: translateY(0); }
          5% { transform: translateY(2px); }
        }

        @keyframes villain-menace {
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

        @keyframes bat-freedom {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-20px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .game-main-area {
            flex-direction: column;
            padding: 0.3rem;
            gap: 0.3rem;
          }
          
          .game-sidebar-left {
            flex: 0 0 auto;
            flex-direction: row;
            gap: 0.3rem;
            overflow-x: auto;
            padding: 0.3rem;
            max-height: 120px;
          }
          
          .game-central-area {
            flex: 1;
            min-height: 300px;
          }
          
          .sidebar-block {
            flex: 0 0 180px;
            padding: 0.6rem;
          }
          
          .scene-elements {
            flex-direction: column;
            gap: 0.8rem;
          }
          
          .system-elements {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem;
          }
          
          .character,
          .system-icon,
          .cave-chamber {
            font-size: 2rem;
          }
          
          .bat {
            font-size: 1.8rem;
          }
          
          .puzzle-trigger-btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Level2Cave;

