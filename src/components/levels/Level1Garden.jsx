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

  // Renderizar el contenido principal del juego
  const renderMainContent = () => {
    if (showIntroAnimation) {
      return renderIntroAnimation();
    }

    if (showPuzzle) {
      return renderCurrentPuzzle();
    }

    return renderGameScene();
  };

  // Renderizar la escena del juego
  const renderGameScene = () => (
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
        
        {currentPhase !== 'completed' && (
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

  // Renderizar el puzzle actual
  const renderCurrentPuzzle = () => {
    switch (currentPhase) {
      case 'connections':
        return (
          <div className="puzzle-container">
            <NetworkConnectionsPuzzle 
              onComplete={() => handlePuzzleComplete('connections')}
              onClose={() => setShowPuzzle(false)}
            />
          </div>
        );
      case 'packet-adventure':
        return (
          <div className="puzzle-container">
            <PacketAdventurePuzzle 
              onComplete={() => handlePuzzleComplete('packetAdventure')}
              onClose={() => setShowPuzzle(false)}
            />
          </div>
        );
      case 'arp-maze':
        return (
          <div className="puzzle-container">
            <ARPMazePuzzle 
              onComplete={() => handlePuzzleComplete('arpMaze')}
              onClose={() => setShowPuzzle(false)}
            />
          </div>
        );
      case 'boss-fight':
        return (
          <div className="puzzle-container">
            <BGPBossPuzzle 
              onComplete={() => handlePuzzleComplete('bossFight')}
              onClose={() => setShowPuzzle(false)}
            />
          </div>
        );
      default:
        return renderGameScene();
    }
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

  const getCurrentInstructions = () => {
    switch (currentPhase) {
      case 'connections': return 'Conecta los dispositivos de red para establecer comunicación entre ellos.';
      case 'packet-adventure': return 'Guía el paquete TCP a través del handshake de 3 vías.';
      case 'arp-maze': return 'Evita los ataques ARP y encuentra la ruta segura.';
      case 'boss-fight': return 'Enfrenta al villano final y demuestra tus conocimientos de BGP.';
      case 'completed': return '¡Nivel completado! Has rescatado a la paloma.';
      default: return 'Preparando el primer desafío...';
    }
  };

  const getCurrentStory = () => {
    switch (currentPhase) {
      case 'connections': return 'El villano ha desconectado la red. Sin comunicación, nadie puede pedir ayuda.';
      case 'packet-adventure': return 'Los paquetes están perdidos en la red. Necesitan encontrar su destino.';
      case 'arp-maze': return 'Impostores intentan suplantar identidades. La seguridad está en peligro.';
      case 'boss-fight': return 'El villano final controla el routing. Es hora de la batalla decisiva.';
      case 'completed': return 'La paloma es libre y la red está segura. ¡Misión cumplida!';
      default: return 'Andy llega al jardín de redes para rescatar a su amiga paloma.';
    }
  };

  const getCurrentProgress = () => {
    const completedCount = Object.values(completedPuzzles).filter(Boolean).length;
    const totalPuzzles = 4;
    const percentage = Math.round((completedCount / totalPuzzles) * 100);
    
    switch (currentPhase) {
      case 'connections': return `Puzzle 1/4 - Conexiones de Red (0%)`;
      case 'packet-adventure': return `Puzzle 2/4 - Aventura del Paquete (25%)`;
      case 'arp-maze': return `Puzzle 3/4 - Evitando Ataques (50%)`;
      case 'boss-fight': return `Puzzle 4/4 - Desafío Final (75%)`;
      case 'completed': return `¡Completado! - Todos los puzzles (100%)`;
      default: return `Preparando... - ${completedCount}/${totalPuzzles} puzzles (${percentage}%)`;
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

      {/* Área principal del juego */}
      <div className="game-main-area">
        {/* Escenario del juego - 70% de ancho (izquierda) */}
        <div className="game-scenario">
          {renderMainContent()}
        </div>
        
        {/* Área de diálogos - 30% de ancho (derecha) */}
        <div className="game-dialogue-area">
          {/* Sección izquierda (50% del 30%) */}
          <div className="dialogue-section">
            <div className="dialogue-row instructions">
              📋 <strong>Instrucciones:</strong> {getCurrentInstructions()}
            </div>
      {showMessage && (
              <div className="dialogue-row message">
                🐿️ <strong>Andy:</strong> {currentMessage}
              </div>
            )}
          </div>
          
          {/* Sección derecha (50% del 30%) */}
          <div className="dialogue-section">
            <div className="dialogue-row story">
              📖 <strong>Historia:</strong> {getCurrentStory()}
            </div>
            <div className="dialogue-row progress">
              🎯 <strong>Progreso:</strong> {getCurrentProgress()}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .level1-garden-new {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .level1-garden-new::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .level-hud {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 100;
        }

        .level-hud > div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .dev-skip-btn {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }

        .dev-skip-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
        }

        .story-message-overlay {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          right: 2rem;
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 200;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .andy-avatar {
          font-size: 3.5rem;
          animation: andy-bounce 2s ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .message-bubble {
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          padding: 1.5rem;
          border-radius: 16px;
          font-size: 1rem;
          line-height: 1.6;
          flex: 1;
          color: #2c3e50;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .message-bubble::before {
          content: '';
          position: absolute;
          left: -10px;
          top: 20px;
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid #ffffff;
        }

        .game-main-area {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          padding: 7rem 2rem 2rem 2rem;
          gap: 2rem;
        }

        .game-scenario {
          flex: 0 0 70%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .game-dialogue-area {
          flex: 0 0 30%;
          display: flex;
          flex-direction: row;
          gap: 1rem;
          padding: 1rem 0;
        }

        .dialogue-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .dialogue-row {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 60px;
          display: flex;
          align-items: center;
          color: white;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .dialogue-row.instructions {
          background: rgba(52, 152, 219, 0.2);
          border-color: rgba(52, 152, 219, 0.3);
        }

        .dialogue-row.story {
          background: rgba(155, 89, 182, 0.2);
          border-color: rgba(155, 89, 182, 0.3);
        }

        .dialogue-row.message {
          background: rgba(241, 196, 15, 0.2);
          border-color: rgba(241, 196, 15, 0.3);
          animation: message-pulse 2s ease-in-out infinite;
        }

        .dialogue-row.progress {
          background: rgba(52, 152, 219, 0.2);
          border-color: rgba(52, 152, 219, 0.3);
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
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 24px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .scene-background {
          font-size: 4rem;
          margin-bottom: 2rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .characters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          gap: 2rem;
        }

        .andy-arrival {
          text-align: center;
          flex: 1;
        }

        .andy-character {
          font-size: 5rem;
          margin-bottom: 1rem;
          animation: andy-walk 3s ease-in-out infinite;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
        }

        .andy-speech {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(5px);
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pigeon-cage {
          text-align: center;
          position: relative;
          flex: 1;
        }

        .cage-container {
          font-size: 5rem;
          position: relative;
          margin-bottom: 1rem;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
        }

        .digital-cage {
          position: relative;
        }

        .trapped-pigeon {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 3rem;
          animation: pigeon-struggle 2s ease-in-out infinite;
        }

        .digital-lock {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 2.5rem;
          animation: lock-pulse 1.5s ease-in-out infinite;
        }

        .cage-label {
          font-size: 0.8rem;
          color: #f39c12;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .villain-appearance {
          text-align: center;
          margin-top: 2rem;
        }

        .villain-character {
          font-size: 5rem;
          margin-bottom: 1rem;
          animation: villain-hover 3s ease-in-out infinite;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
        }

        .villain-speech {
          background: linear-gradient(135deg, rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.9));
          backdrop-filter: blur(5px);
          padding: 1.5rem;
          border-radius: 16px;
          font-size: 0.8rem;
          line-height: 1.6;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
        }

        .villain-speech p {
          margin-bottom: 0.8rem;
        }

        .intro-progress {
          text-align: center;
        }

        .progress-bar {
          width: 400px;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          margin: 0 auto 1rem auto;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2980b9, #f39c12);
          width: 0;
          animation: progress-fill 5s ease-out forwards;
          border-radius: 4px;
        }

        .intro-progress p {
          font-size: 0.9rem;
          color: white;
          font-weight: 500;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .garden-game-area {
          width: 100%;
          max-width: 1200px;
          color: white;
        }

        .garden-scene {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(15px);
          padding: 3rem;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .scene-elements {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 3rem;
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
          font-size: 4.5rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .character-label,
        .device-label,
        .packet-label,
        .shield-label,
        .pigeon-label {
          font-size: 0.8rem;
          color: #ecf0f1;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .network-elements {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
        }

        .network-device,
        .packet-flow,
        .security-shield {
          text-align: center;
          position: relative;
          padding: 1.5rem;
          border-radius: 16px;
          transition: all 0.4s ease;
          min-width: 150px;
          backdrop-filter: blur(5px);
        }

        .network-device.active,
        .packet-flow.active,
        .security-shield.active {
          background: rgba(52, 152, 219, 0.2);
          border: 2px solid #3498db;
          box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
          transform: scale(1.05);
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
          font-size: 1.8rem;
          animation: completion-pop 0.6s ease-out;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
          font-size: 3.5rem;
          transition: all 1s ease;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .pigeon.free {
          animation: pigeon-fly-free 3s ease-out infinite;
        }

        .pigeon.trapped {
          animation: pigeon-struggle 2s ease-in-out infinite;
        }

        .lock {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 2.5rem;
          transition: all 0.5s;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: white;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .progress-indicators {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .phase-dot {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.4s ease;
          backdrop-filter: blur(5px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .phase-dot.pending {
          background: rgba(149, 165, 166, 0.3);
          color: #bdc3c7;
        }

        .phase-dot.active {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
        }

        .phase-dot.completed {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
        }

        .action-area {
          text-align: center;
        }

        .puzzle-trigger-btn {
          background: linear-gradient(135deg, #3498db, #2980b9, #5dade2);
          color: white;
          border: none;
          padding: 1.5rem 3rem;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
          position: relative;
          overflow: hidden;
        }

        .puzzle-trigger-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .puzzle-trigger-btn:hover::before {
          left: 100%;
        }

        .puzzle-trigger-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
        }

        @keyframes andy-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }

        @keyframes andy-walk {
          0% { transform: translateX(-15px) rotate(-2deg); }
          50% { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(15px) rotate(2deg); }
        }

        @keyframes pigeon-struggle {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          25% { transform: translateX(-50%) translateY(-8px) rotate(-2deg); }
          75% { transform: translateX(-50%) translateY(-8px) rotate(2deg); }
        }

        @keyframes lock-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes villain-hover {
          0% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          100% { transform: translateY(0) rotate(3deg); }
        }

        @keyframes progress-fill {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes completion-pop {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.4) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }

        @keyframes pigeon-fly-free {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          25% { transform: translateX(-50%) translateY(-25px) rotate(-5deg); }
          75% { transform: translateX(-50%) translateY(-25px) rotate(5deg); }
        }

        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(243, 156, 18, 0.5); }
          50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(243, 156, 18, 0.7); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(243, 156, 18, 0.5); }
        }

        @keyframes message-pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }

        @media (max-width: 1024px) {
          .scene-elements {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .network-elements {
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .characters {
            flex-direction: column;
            gap: 2rem;
          }
        }

        @media (max-width: 1024px) {
          .game-main-area {
            flex-direction: column;
            gap: 1rem;
          }
          
          .game-scenario {
            flex: 0 0 70%;
          }
          
          .game-dialogue-area {
            flex: 0 0 30%;
            flex-direction: column;
          }
          
          .dialogue-section {
            flex: none;
          }
        }

        @media (max-width: 768px) {
          .level-hud {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .story-message-overlay {
            flex-direction: column;
            text-align: center;
          }
          
          .message-bubble::before {
            display: none;
          }
          
          .game-main-area {
            padding: 6rem 1rem 1rem 1rem;
            flex-direction: column;
            gap: 1rem;
          }
          
          .game-scenario {
            flex: 0 0 60%;
          }
          
          .game-dialogue-area {
            flex: 0 0 40%;
            gap: 0.5rem;
            flex-direction: column;
          }
          
          .dialogue-section {
            flex: none;
          }
          
          .dialogue-row {
            padding: 0.8rem 1rem;
            font-size: 0.8rem;
            min-height: 50px;
          }
          
          .character,
          .device,
          .packet,
          .shield,
          .cage {
            font-size: 3rem;
          }
          
          .andy-character,
          .villain-character {
            font-size: 3.5rem;
          }
          
          .progress-indicators {
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .phase-dot {
            width: 50px;
            height: 50px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Level1Garden;