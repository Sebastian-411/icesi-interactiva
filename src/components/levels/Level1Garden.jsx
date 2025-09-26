import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import NetworkConnectionsPuzzle from '../puzzles/NetworkConnectionsPuzzle';
import PacketAdventurePuzzle from '../puzzles/PacketAdventurePuzzle';
import ARPMazePuzzle from '../puzzles/ARPMazePuzzle';
import BGPBossPuzzle from '../puzzles/BGPBossPuzzle';

const Level1Garden = () => {
  const { state, updateLevel1State, updateScore, showScreen } = useGame();
  
  // Estados principales del nivel
  const [currentPhase, setCurrentPhase] = useState('intro'); // intro, connections, packet-adventure, arp-maze, boss-fight, completed
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState({
    connections: false,
    packetAdventure: false,
    arpMaze: false,
    bossFight: false
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
    setCurrentPhase('connections');
    showTemporaryMessage("¡Nadie podrá comunicarse sin mí! Si quieres liberar a tu amiga, tendrás que demostrar que sabes cómo viajan los mensajes en una red.", 6000);
    setTimeout(() => {
      setShowPuzzle(true);
    }, 6000);
  };

  const handlePuzzleComplete = (puzzleType) => {
    setShowPuzzle(false);
    setCompletedPuzzles(prev => ({ ...prev, [puzzleType]: true }));
    
    // Determinar siguiente fase
    switch (puzzleType) {
      case 'connections':
        showTemporaryMessage("¡Excelente! Has entendido la topología de red. Ahora veamos cómo viajan los paquetes...", 3000);
        setTimeout(() => {
          setCurrentPhase('packet-adventure');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'packetAdventure':
        showTemporaryMessage("¡Perfecto! Conoces el handshake TCP. Pero cuidado, no todo en la red es confiable...", 3000);
        setTimeout(() => {
          setCurrentPhase('arp-maze');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'arpMaze':
        showTemporaryMessage("¡Impresionante! Has evitado los ataques. Ahora enfréntate al desafío final...", 3000);
        setTimeout(() => {
          setCurrentPhase('boss-fight');
          setShowPuzzle(true);
        }, 3000);
        break;
        
      case 'bossFight':
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
    if (totalTime > 300) stars = 2; // Más de 5 minutos
    if (totalTime > 600) stars = 1; // Más de 10 minutos
    
    updateLevel1State({ 
      pigeonRescued: true, 
      completionTime: totalTime,
      stars: stars
    });
    
    showTemporaryMessage("¡La paloma es libre! Has demostrado que entiendes cómo funcionan las redes. ¡Eres un verdadero ingeniero de sistemas!", 5000);
    
    setTimeout(() => {
      showScreen('level-summary-screen');
    }, 5000);
  };

  // Renderizar la intro animada
  const renderIntroAnimation = () => (
    <div className="intro-animation">
      <div className="animation-scene">
        <div className="scene-background">
          <div className="garden-background">🌳🌸🌺🌻</div>
        </div>
        
        <div className="characters">
          <div className="andy-arrival">
            <div className="andy-character">🐿️</div>
            <div className="andy-speech">¡Andy llega al jardín!</div>
          </div>
          
          <div className="pigeon-cage">
            <div className="cage-container">
              <div className="digital-cage">🏛️</div>
              <div className="trapped-pigeon">🕊️💔</div>
              <div className="digital-lock">🔒</div>
            </div>
            <div className="cage-label">Paloma atrapada</div>
          </div>
        </div>
        
        <div className="villain-appearance">
          <div className="villain-character">🦹‍♂️</div>
          <div className="villain-speech">
            <p>"¡Nadie podrá comunicarse sin mí!"</p>
            <p>"Si quieres liberar a tu amiga, tendrás que demostrar que sabes cómo viajan los mensajes en una red."</p>
          </div>
        </div>
      </div>
      
      <div className="intro-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <p>Preparando el primer desafío...</p>
      </div>
    </div>
  );

  // Renderizar el estado actual del juego
  const renderGameState = () => {
    if (showIntroAnimation) {
      return renderIntroAnimation();
    }

    return (
      <div className="garden-game-area">
        <div className="garden-scene">
          <div className="scene-elements">
            <div className="andy-character">
              <div className="character">🐿️</div>
              <div className="character-label">Andy</div>
            </div>
            
            <div className="network-elements">
              <div className={`network-device ${completedPuzzles.connections ? 'active' : 'inactive'}`}>
                <div className="device">📡</div>
                <div className="device-label">Red</div>
                {completedPuzzles.connections && <div className="completion-check">✅</div>}
              </div>
              
              <div className={`packet-flow ${completedPuzzles.packetAdventure ? 'active' : 'inactive'}`}>
                <div className="packet">📦</div>
                <div className="packet-label">Paquetes</div>
                {completedPuzzles.packetAdventure && <div className="completion-check">✅</div>}
              </div>
              
              <div className={`security-shield ${completedPuzzles.arpMaze ? 'active' : 'inactive'}`}>
                <div className="shield">🛡️</div>
                <div className="shield-label">Seguridad</div>
                {completedPuzzles.arpMaze && <div className="completion-check">✅</div>}
              </div>
            </div>
            
            <div className="pigeon-area">
              <div className={`pigeon-cage ${currentPhase === 'completed' ? 'opened' : 'locked'}`}>
                <div className="cage">🏛️</div>
                <div className={`pigeon ${currentPhase === 'completed' ? 'free' : 'trapped'}`}>
                  {currentPhase === 'completed' ? '🕊️✨' : '🕊️💔'}
                </div>
                <div className={`lock ${currentPhase === 'completed' ? 'broken' : 'active'}`}>
                  {currentPhase === 'completed' ? '🔓' : '🔒'}
                </div>
              </div>
              <div className="pigeon-label">
                {currentPhase === 'completed' ? '¡Paloma libre!' : 'Paloma atrapada'}
              </div>
            </div>
          </div>
          
          <div className="phase-indicator">
            <h3>📍 Fase Actual: {getCurrentPhaseDescription()}</h3>
            <div className="progress-indicators">
              <div className={`phase-dot ${completedPuzzles.connections ? 'completed' : currentPhase === 'connections' ? 'active' : 'pending'}`}>1</div>
              <div className={`phase-dot ${completedPuzzles.packetAdventure ? 'completed' : currentPhase === 'packet-adventure' ? 'active' : 'pending'}`}>2</div>
              <div className={`phase-dot ${completedPuzzles.arpMaze ? 'completed' : currentPhase === 'arp-maze' ? 'active' : 'pending'}`}>3</div>
              <div className={`phase-dot ${completedPuzzles.bossFight ? 'completed' : currentPhase === 'boss-fight' ? 'active' : 'pending'}`}>👑</div>
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
  };

  const getCurrentPhaseDescription = () => {
    switch (currentPhase) {
      case 'connections': return 'Conexiones de Red';
      case 'packet-adventure': return 'Aventura del Paquete';
      case 'arp-maze': return 'Evitando Ataques';
      case 'boss-fight': return 'Desafío Final';
      case 'completed': return '¡Nivel Completado!';
      default: return 'Preparando...';
    }
  };

  const getPuzzleButtonText = () => {
    switch (currentPhase) {
      case 'connections': return '🔌 Conectar Dispositivos';
      case 'packet-adventure': return '📦 Guiar el Paquete';
      case 'arp-maze': return '🛡️ Evitar Impostores';
      case 'boss-fight': return '⚔️ Enfrentar al Villano';
      default: return '🎮 Continuar';
    }
  };

  return (
    <div className="level1-garden-new">
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
          <div className="andy-avatar">🐿️</div>
          <div className="message-bubble">
            {currentMessage}
          </div>
        </div>
      )}

      {/* Área principal del juego */}
      <div className="game-main-area">
        {renderGameState()}
      </div>

      {/* Puzzles */}
      {showPuzzle && currentPhase === 'connections' && (
        <NetworkConnectionsPuzzle 
          onComplete={() => handlePuzzleComplete('connections')}
          onClose={handlePuzzleClose}
        />
      )}
      
      {showPuzzle && currentPhase === 'packet-adventure' && (
        <PacketAdventurePuzzle 
          onComplete={() => handlePuzzleComplete('packetAdventure')}
          onClose={handlePuzzleClose}
        />
      )}
      
      {showPuzzle && currentPhase === 'arp-maze' && (
        <ARPMazePuzzle 
          onComplete={() => handlePuzzleComplete('arpMaze')}
          onClose={handlePuzzleClose}
        />
      )}
      
      {showPuzzle && currentPhase === 'boss-fight' && (
        <BGPBossPuzzle 
          onComplete={() => handlePuzzleComplete('bossFight')}
          onClose={handlePuzzleClose}
        />
      )}

      <style>{`
        .level1-garden-new {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          z-index: 100;
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
          background: rgba(0, 0, 0, 0.8);
          padding: 1.5rem;
          border-radius: 15px;
          z-index: 200;
        }

        .andy-avatar {
          font-size: 3rem;
          animation: bounce 1s ease-in-out infinite alternate;
        }

        .message-bubble {
          background: white;
          padding: 1rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.4;
          flex: 1;
        }

        .game-main-area {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem 2rem 2rem;
        }

        .intro-animation {
          text-align: center;
          color: white;
          width: 100%;
          max-width: 800px;
        }

        .animation-scene {
          background: rgba(0, 0, 0, 0.7);
          padding: 3rem;
          border-radius: 20px;
          margin-bottom: 2rem;
        }

        .scene-background {
          font-size: 3rem;
          margin-bottom: 2rem;
        }

        .characters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .andy-arrival {
          text-align: center;
        }

        .andy-character {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: andy-walk 2s ease-in-out infinite alternate;
        }

        .andy-speech {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .pigeon-cage {
          text-align: center;
          position: relative;
        }

        .cage-container {
          font-size: 4rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .digital-cage {
          position: relative;
        }

        .trapped-pigeon {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2.5rem;
          animation: pigeon-struggle 1.5s ease-in-out infinite;
        }

        .digital-lock {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 2rem;
          animation: lock-pulse 1s ease-in-out infinite;
        }

        .cage-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #f39c12;
        }

        .villain-appearance {
          text-align: center;
          margin-top: 2rem;
        }

        .villain-character {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: villain-hover 2s ease-in-out infinite alternate;
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
          width: 300px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          margin: 0 auto 1rem auto;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2ecc71);
          width: 0;
          animation: progress-fill 5s ease-out forwards;
        }

        .intro-progress p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
        }

        .garden-game-area {
          width: 100%;
          max-width: 1000px;
          color: white;
        }

        .garden-scene {
          background: rgba(0, 0, 0, 0.6);
          padding: 3rem;
          border-radius: 20px;
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
        .pigeon-area {
          text-align: center;
        }

        .character,
        .device,
        .packet,
        .shield,
        .cage {
          font-size: 4rem;
          margin-bottom: 0.5rem;
        }

        .character-label,
        .device-label,
        .packet-label,
        .shield-label,
        .pigeon-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #ecf0f1;
        }

        .network-elements {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .network-device,
        .packet-flow,
        .security-shield {
          text-align: center;
          position: relative;
          padding: 1rem;
          border-radius: 10px;
          transition: all 0.3s;
        }

        .network-device.active,
        .packet-flow.active,
        .security-shield.active {
          background: rgba(46, 204, 113, 0.2);
          border: 2px solid #2ecc71;
        }

        .network-device.inactive,
        .packet-flow.inactive,
        .security-shield.inactive {
          background: rgba(149, 165, 166, 0.2);
          border: 2px solid #95a5a6;
        }

        .completion-check {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 1.5rem;
          animation: completion-pop 0.5s ease-out;
        }

        .pigeon-cage {
          position: relative;
          text-align: center;
        }

        .pigeon {
          position: absolute;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 3rem;
          transition: all 1s ease;
        }

        .pigeon.free {
          animation: pigeon-fly-free 2s ease-out infinite;
        }

        .pigeon.trapped {
          animation: pigeon-struggle 1.5s ease-in-out infinite;
        }

        .lock {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 2rem;
          transition: all 0.5s;
        }

        .lock.broken {
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
          background: #f39c12;
          color: white;
          animation: pulse 1s ease-in-out infinite alternate;
        }

        .phase-dot.completed {
          background: #2ecc71;
          color: white;
        }

        .action-area {
          text-align: center;
        }

        .puzzle-trigger-btn {
          background: linear-gradient(45deg, #3498db, #2ecc71);
          color: white;
          border: none;
          padding: 1.5rem 3rem;
          border-radius: 15px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .puzzle-trigger-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }

        @keyframes andy-walk {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }

        @keyframes pigeon-struggle {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }

        @keyframes lock-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes villain-hover {
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

        @keyframes pigeon-fly-free {
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
          
          .network-elements {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .character,
          .device,
          .packet,
          .shield,
          .cage {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Level1Garden;