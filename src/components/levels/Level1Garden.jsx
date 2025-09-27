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


  // Renderizar el contenido principal del juego
  const renderMainContent = () => {

    if (showPuzzle) {
      return renderCurrentPuzzle();
    }

    return renderGameScene();
  };

  // Renderizar la escena del juego
  const renderGameScene = () => (
    <div className="game-layout-reorganized">
      {/* Mapa central */}
      <div className="central-map-area">
        <div className="adventure-path">
          {/* Andy */}
          <div className="andy-start-position">
            <div className="character-path">🐿️</div>
            <div className="character-label-path">Andy</div>
          </div>

          {/* Conectores */}
          <div className="path-connectors">
            <div className="path-line-segment segment-1"></div>
            <div className="path-line-segment segment-2"></div>
            <div className="path-line-segment segment-3"></div>
            <div className="path-line-segment segment-4"></div>
          </div>

          {/* Fases */}
          <div className="phases-on-path">
            <div className={`phase-on-path ${completedPuzzles.connections ? 'completed' : currentPhase === 'connections' ? 'active' : 'pending'}`}
                 onClick={() => currentPhase === 'connections' && setShowPuzzle(true)}>
              <div className="phase-icon-path">📡</div>
              <div className="phase-number-path">1</div>
              <div className="phase-label-path">Red</div>
              {completedPuzzles.connections && <div className="phase-check-path">✅</div>}
            </div>
            
            <div className={`phase-on-path ${completedPuzzles.packetAdventure ? 'completed' : currentPhase === 'packet-adventure' ? 'active' : 'pending'}`}
                 onClick={() => currentPhase === 'packet-adventure' && setShowPuzzle(true)}>
              <div className="phase-icon-path">📦</div>
              <div className="phase-number-path">2</div>
              <div className="phase-label-path">Paquetes</div>
              {completedPuzzles.packetAdventure && <div className="phase-check-path">✅</div>}
            </div>
            
            <div className={`phase-on-path ${completedPuzzles.arpMaze ? 'completed' : currentPhase === 'arp-maze' ? 'active' : 'pending'}`}
                 onClick={() => currentPhase === 'arp-maze' && setShowPuzzle(true)}>
              <div className="phase-icon-path">🛡️</div>
              <div className="phase-number-path">3</div>
              <div className="phase-label-path">Seguridad</div>
              {completedPuzzles.arpMaze && <div className="phase-check-path">✅</div>}
            </div>
            
            <div className={`phase-on-path boss-phase ${completedPuzzles.bossFight ? 'completed' : currentPhase === 'boss-fight' ? 'active' : 'pending'}`}
                 onClick={() => currentPhase === 'boss-fight' && setShowPuzzle(true)}>
              <div className="phase-icon-path">👑</div>
              <div className="phase-number-path">BOSS</div>
              <div className="phase-label-path">Final</div>
              {completedPuzzles.bossFight && <div className="phase-check-path">✅</div>}
            </div>
          </div>

          {/* Paloma objetivo final */}
          <div className="pigeon-final-objective">
            <div className={`pigeon-cage-final ${currentPhase === 'completed' ? 'opened' : 'locked'}`}>
              <div className="cage-final">🏛️</div>
              <div className={`pigeon-final ${currentPhase === 'completed' ? 'free' : 'trapped'}`}>
                {currentPhase === 'completed' ? '🕊️✨' : '🕊️💔'}
              </div>
              <div className={`lock-final ${currentPhase === 'completed' ? 'broken' : 'active'}`}>
                {currentPhase === 'completed' ? '🔓' : '🔒'}
              </div>
            </div>
            <div className="objective-label-final">
              {currentPhase === 'completed' ? '¡OBJETIVO CUMPLIDO!' : 'OBJETIVO FINAL'}
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        {currentPhase !== 'completed' && (
          <button 
            className="pixel-action-button-centered"
            onClick={() => setShowPuzzle(true)}
          >
            {getPuzzleButtonText()}
          </button>
        )}
      </div>

      {/* Sidebar derecho */}
      <div className="right-sidebar">
        <div className="right-block block-1">
          <div className="block-header">
            <div className="block-icon">📖</div>
            <h4>Historia</h4>
          </div>
          <div className="block-content">
            <p>{getCurrentStory()}</p>
          </div>
        </div>
        <div className="right-block block-2">
          <div className="block-header">
            <div className="block-icon">📋</div>
            <h4>Instrucciones</h4>
          </div>
          <div className="block-content">
            <p>{getCurrentInstructions()}</p>
          </div>
        </div>
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

      {/* Área principal del juego */}
      <div >
        {/* Escenario del juego - 70% de ancho (izquierda) */}
          {renderMainContent()}
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

        /* ========================================
           LAYOUT REORGANIZADO: SIDEBAR IZQUIERDO + MAPA CENTRAL + SIDEBAR DERECHO
           ======================================== */
        
        .game-layout-reorganized {
          display: flex;
          height: 100vh;
          gap: 1rem;
          padding: 0.5rem;
          align-items: stretch;
        }

        /* Mapa central - Ocupa todo el espacio disponible */
        .central-map-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          margin: 0.5rem 0;
          width: 100%;
        }

        /* Sidebar derecho - Dos bloques */
        .right-sidebar {
          width: 250px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          height: 100%;
          padding: 0.5rem 0;
        }

        /* Bloques del sidebar derecho */
        .right-block {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          overflow: hidden;
          flex: 1;
          min-height: 150px;
          display: flex;
          flex-direction: column;
        }

        .block-header {
          background: rgba(52, 152, 219, 0.2);
          padding: 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .block-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .block-header h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #3498db;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .block-content {
          padding: 1rem;
          flex: 1;
          overflow-y: auto;
        }

        .block-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          color: #ecf0f1;
          line-height: 1.4;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }


        .adventure-path {
          display: flex;
          align-items: center;
          gap: 2rem;
          position: relative;
          max-width: 1200px;
          width: 100%;
          padding: 1rem;
        }

        /* Andy como protagonista - Inicio del camino */
        .andy-start-position {
          flex-shrink: 0;
        }


        .character-path {
          font-size: 5rem;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          animation: andy-bounce-path 3s ease-in-out infinite;
        }

        .character-label-path {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #f39c12;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .andy-path-glow {
          position: absolute;
          top: -1rem;
          left: -1rem;
          right: -1rem;
          bottom: -1rem;
          background: radial-gradient(circle, rgba(243, 156, 18, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: andy-glow-pulse-path 3s ease-in-out infinite;
          z-index: -1;
        }

        /* Conectores visuales del camino */
        .path-connectors {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          z-index: 1;
          pointer-events: none;
        }

        .path-line-segment {
          position: absolute;
          height: 100%;
          background: linear-gradient(90deg, #3498db, #f39c12, #e74c3c, #9b59b6);
          border-radius: 2px;
          animation: path-flow 3s ease-in-out infinite;
        }

        .segment-1 { left: 8%; width: 15%; animation-delay: 0s; }
        .segment-2 { left: 28%; width: 15%; animation-delay: 0.5s; }
        .segment-3 { left: 48%; width: 15%; animation-delay: 1s; }
        .segment-4 { left: 68%; width: 15%; animation-delay: 1.5s; }

        /* Fases únicas en el camino */
        .phases-on-path {
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .phase-on-path {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.4s ease;
          cursor: pointer;
          padding: 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(5px);
          position: relative;
          min-width: 150px;
        }

        .phase-on-path.pending {
          background: rgba(149, 165, 166, 0.2);
          border: 2px solid #95a5a6;
        }

        .phase-on-path.active {
          background: rgba(243, 156, 18, 0.2);
          border: 2px solid #f39c12;
          animation: phase-pulse-path 2s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
        }

        .phase-on-path.completed {
          background: rgba(52, 152, 219, 0.2);
          border: 2px solid #3498db;
          box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
        }

        .phase-on-path.boss-phase {
          border: 3px solid #e74c3c;
          background: rgba(231, 76, 60, 0.2);
        }

        .phase-on-path.boss-phase.active {
          animation: boss-pulse-path 2s ease-in-out infinite;
          box-shadow: 0 0 25px rgba(231, 76, 60, 0.6);
        }

        .phase-icon-path {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .phase-number-path {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .phase-label-path {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #ecf0f1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .phase-check-path {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 1.5rem;
          animation: check-pop-path 0.6s ease-out;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        /* Paloma atrapada - Objetivo final del camino */
        .pigeon-final-objective {
          flex-shrink: 0;
          position: relative;
          text-align: center;
        }


        .pigeon-cage-final {
          position: relative;
          font-size: 6rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
        }

        .cage-final {
          position: relative;
          z-index: 2;
        }

        .pigeon-final {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 4rem;
          transition: all 1s ease;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          z-index: 3;
        }

        .pigeon-final.free {
          animation: pigeon-fly-free-path 3s ease-out infinite;
        }

        .pigeon-final.trapped {
          animation: pigeon-struggle-path 2s ease-in-out infinite;
        }

        .lock-final {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 2.5rem;
          transition: all 0.5s;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          z-index: 4;
        }

        .lock-final.broken {
          transform: rotate(45deg) scale(0.8);
          opacity: 0.5;
        }

        .objective-label-final {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #f39c12;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          margin-bottom: 1rem;
          animation: objective-label-pulse 2s ease-in-out infinite;
        }

        .progress-ring {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }

        .progress-ring svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-ring-fill {
          fill: none;
          stroke: #f39c12;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 0 100;
          transition: stroke-dasharray 0.5s ease;
        }

        /* ========================================
           SIDEBAR IZQUIERDO - ESTILOS ACTUALIZADOS
           ======================================== */

        .sidebar-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.8rem 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab:last-child {
          border-right: none;
        }

        .tab.active {
          background: rgba(52, 152, 219, 0.3);
          border-bottom: 2px solid #3498db;
        }

        .tab-icon {
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
        }

        .tab span {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .sidebar-content {
          padding: 1rem;
          min-height: 200px;
        }

        .content-section {
          display: none;
        }

        .content-section.active {
          display: block;
        }

        .content-section h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #f39c12;
          margin-bottom: 0.8rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .content-section p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: white;
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        /* ========================================
           BOTÓN DE ACCIÓN CENTRADO Y COHERENTE
           ======================================== */
        

        .pixel-action-button-centered {
          position: relative;
          background: linear-gradient(135deg, #3498db, #2980b9, #5dade2);
          color: white;
          border: 4px solid #2c3e50;
          padding: 1.5rem 3rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
          overflow: hidden;
        }

        .pixel-action-button-centered:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(52, 152, 219, 0.6);
        }

        .button-text-centered {
          position: relative;
          z-index: 2;
        }

        .button-glow-centered {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .pixel-action-button-centered:hover .button-glow-centered {
          left: 100%;
        }

        /* ========================================
           ANIMACIONES PARA EL NUEVO DISEÑO
           ======================================== */
        
        @keyframes andy-bounce-path {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }

        @keyframes andy-glow-pulse-path {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes path-flow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes phase-pulse-path {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(243, 156, 18, 0.5); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(243, 156, 18, 0.8); }
        }

        @keyframes boss-pulse-path {
          0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(231, 76, 60, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(231, 76, 60, 0.9); }
        }

        @keyframes check-pop-path {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes objective-aura-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes pigeon-fly-free-path {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          25% { transform: translateX(-50%) translateY(-15px) rotate(-5deg); }
          75% { transform: translateX(-50%) translateY(-15px) rotate(5deg); }
        }

        @keyframes pigeon-struggle-path {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          25% { transform: translateX(-50%) translateY(-8px) rotate(-2deg); }
          75% { transform: translateX(-50%) translateY(-8px) rotate(2deg); }
        }

        @keyframes objective-label-pulse {
          0%, 100% { opacity: 1; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
          50% { opacity: 0.8; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(243, 156, 18, 0.8); }
        }

        /* ========================================
           RESPONSIVE PARA EL NUEVO LAYOUT DE DOS COLUMNAS
           ======================================== */
        
        @media (max-width: 1200px) {
          .game-layout-reorganized {
            gap: 1.5rem;
            padding: 1.5rem;
          }

          .right-sidebar {
            width: 280px;
          }

          .central-map-area {
            max-width: 75%;
            padding: 2.5rem;
          }

          .adventure-path {
            gap: 1.5rem;
            padding: 1.5rem;
          }

          .character-path {
            font-size: 3.5rem;
          }

          .phase-on-path {
            min-width: 100px;
            padding: 0.8rem;
          }

          .phase-icon-path {
            font-size: 2rem;
          }

          .pigeon-cage-final {
            font-size: 4rem;
          }

          .pigeon-final {
            font-size: 3rem;
          }
        }

        @media (max-width: 1024px) {
          .game-layout-reorganized {
            gap: 1rem;
            padding: 1rem;
          }

          .right-sidebar {
            width: 250px;
          }

          .central-map-area {
            max-width: 80%;
            padding: 2rem;
          }

          .adventure-path {
            gap: 1rem;
            padding: 1rem;
          }

          .character-path {
            font-size: 3rem;
          }

          .phase-icon-path {
            font-size: 1.8rem;
          }

          .pigeon-cage-final {
            font-size: 3.5rem;
          }

          .pigeon-final {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .game-layout-reorganized {
            flex-direction: column;
            height: auto;
            gap: 1rem;
            padding: 1rem;
          }

          .central-map-area {
            order: 1;
            padding: 1.5rem;
            margin: 0;
            min-height: auto;
            max-width: 100%;
          }

          .right-sidebar {
            width: 100%;
            order: 2;
            flex-direction: row;
            gap: 1rem;
            height: auto;
          }

          .right-block {
            flex: 1;
            min-height: 150px;
          }

          .adventure-path {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .andy-start-position {
            order: 1;
          }

          .phases-on-path {
            order: 2;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .phase-on-path {
            width: 100%;
            min-width: auto;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
          }

          .phase-icon-path {
            font-size: 2.5rem;
            margin-bottom: 0;
            margin-right: 1rem;
          }

          .pigeon-final-objective {
            order: 3;
          }

          .path-connectors {
            display: none;
          }

          .character-path {
            font-size: 2.5rem;
          }

          .pigeon-cage-final {
            font-size: 3rem;
          }

          .pigeon-final {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .game-layout-reorganized {
            padding: 0.5rem;
            gap: 0.5rem;
          }

          .central-map-area {
            padding: 1rem;
          }

          .right-sidebar {
            flex-direction: column;
            gap: 0.5rem;
          }

          .right-block {
            min-height: 120px;
          }

          .adventure-path {
            padding: 0.5rem;
          }

          .character-path {
            font-size: 2rem;
          }

          .phase-on-path {
            padding: 0.6rem;
          }

          .phase-icon-path {
            font-size: 1.5rem;
          }

          .phase-number-path {
            font-size: 0.6rem;
          }

          .phase-label-path {
            font-size: 0.4rem;
          }

          .pigeon-cage-final {
            font-size: 2.5rem;
          }

          .pigeon-final {
            font-size: 1.5rem;
          }

          .objective-label-final {
            font-size: 0.6rem;
          }

          .pixel-action-button-centered {
            padding: 0.8rem 1.5rem;
            font-size: 0.7rem;
          }
        }

        @keyframes andy-glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes checkpoint-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(243, 156, 18, 0.5); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(243, 156, 18, 0.7); }
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