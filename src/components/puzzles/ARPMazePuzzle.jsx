import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const ARPMazePuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del juego
  const [andyPosition, setAndyPosition] = useState({ x: 50, y: 200 });
  const [packetPosition, setPacketPosition] = useState({ x: 80, y: 200 });
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, success, failed
  const [currentWave, setCurrentWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Impostores y router legítimo
  const [entities, setEntities] = useState([]);
  const [targetRouter, setTargetRouter] = useState(null);

  // Configuración de ondas
  const waves = [
    {
      wave: 1,
      description: "Encuentra el router legítimo (192.168.1.1)",
      targetIP: "192.168.1.1",
      impostors: [
        { id: 1, x: 200, y: 150, ip: "192.168.1.1", isLegit: false, message: "¡Yo soy el router real!" },
        { id: 2, x: 350, y: 200, ip: "192.168.1.1", isLegit: true, message: "Soy el router legítimo" },
        { id: 3, x: 200, y: 250, ip: "192.168.1.1", isLegit: false, message: "¡Dame el paquete!" }
      ]
    },
    {
      wave: 2,
      description: "Cuidado con los ARP Spoofing (10.0.0.1)",
      targetIP: "10.0.0.1",
      impostors: [
        { id: 1, x: 180, y: 120, ip: "10.0.0.1", isLegit: false, message: "Soy tu gateway!" },
        { id: 2, x: 320, y: 180, ip: "10.0.0.1", isLegit: false, message: "¡Confía en mí!" },
        { id: 3, x: 450, y: 220, ip: "10.0.0.1", isLegit: true, message: "Router auténtico aquí" },
        { id: 4, x: 280, y: 280, ip: "10.0.0.1", isLegit: false, message: "¡Yo tengo la ruta!" }
      ]
    },
    {
      wave: 3,
      description: "Ataque masivo - Identifica el verdadero (172.16.0.1)",
      targetIP: "172.16.0.1",
      impostors: [
        { id: 1, x: 150, y: 100, ip: "172.16.0.1", isLegit: false, message: "¡Hacker router!" },
        { id: 2, x: 300, y: 130, ip: "172.16.0.1", isLegit: false, message: "¡Dame tus datos!" },
        { id: 3, x: 450, y: 160, ip: "172.16.0.1", isLegit: false, message: "¡Soy malicioso!" },
        { id: 4, x: 200, y: 240, ip: "172.16.0.1", isLegit: true, message: "Router legítimo certificado" },
        { id: 5, x: 400, y: 280, ip: "172.16.0.1", isLegit: false, message: "¡Te voy a hackear!" }
      ]
    }
  ];

  // Inicializar onda
  useEffect(() => {
    if (gamePhase === 'playing') {
      const wave = waves[currentWave - 1];
      if (wave) {
        setEntities(wave.impostors);
        setTargetRouter(wave.impostors.find(imp => imp.isLegit));
      }
    }
  }, [currentWave, gamePhase]);

  // Comenzar el juego
  const startGame = () => {
    setGamePhase('playing');
    setCurrentWave(1);
    setLives(3);
    setScore(0);
  };

  // Manejar clic en router/impostor
  const handleEntityClick = (entity) => {
    if (gamePhase !== 'playing') return;

    if (entity.isLegit) {
      // ¡Correcto!
      const waveScore = currentWave * 100;
      setScore(prev => prev + waveScore);
      updateScore(waveScore);
      
      showTemporaryWarning(`¡Correcto! +${waveScore} puntos`, 'success');
      
      // Animar paquete hacia el router correcto
      animatePacketToRouter(entity);
      
      setTimeout(() => {
        if (currentWave >= waves.length) {
          // Juego completado
          setGamePhase('success');
          setTimeout(() => {
            onComplete();
          }, 3000);
        } else {
          // Siguiente onda
          setCurrentWave(prev => prev + 1);
          resetPositions();
        }
      }, 2000);
      
    } else {
      // ¡Impostor!
      setLives(prev => prev - 1);
      showTemporaryWarning(`¡Es un impostor! ${entity.message}`, 'danger');
      
      // Animar "hackeo"
      animateHackerAttack(entity);
      
      if (lives <= 1) {
        // Game over
        setTimeout(() => {
          setGamePhase('failed');
        }, 2000);
      }
    }
  };

  // Animar paquete hacia router
  const animatePacketToRouter = (router) => {
    setPacketPosition({ x: router.x + 20, y: router.y + 20 });
  };

  // Animar ataque de hacker
  const animateHackerAttack = (hacker) => {
    // Efecto visual de "robo" del paquete
    setPacketPosition({ x: hacker.x + 20, y: hacker.y + 20 });
    
    setTimeout(() => {
      // Resetear posición del paquete
      resetPositions();
    }, 1500);
  };

  // Resetear posiciones
  const resetPositions = () => {
    setAndyPosition({ x: 50, y: 200 });
    setPacketPosition({ x: 80, y: 200 });
  };

  // Mostrar advertencia temporal
  const showTemporaryWarning = (message, type) => {
    setWarningMessage(message);
    setShowWarning(true);
    
    setTimeout(() => {
      setShowWarning(false);
    }, 2000);
  };

  // Obtener color del router según su estado
  const getRouterColor = (entity) => {
    if (entity.isLegit) {
      return "#27ae60"; // Verde para legítimo
    } else {
      return "#e74c3c"; // Rojo para impostor
    }
  };

  return (
    <div className="arp-maze-overlay">
      <div className="arp-maze-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 3: Evita el Ataque</h3>
          <p>Identifica el router legítimo y evita los impostores ARP</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Panel de estado */}
        <div className="game-status">
          <div className="status-item">
            <span>🏆 Puntos: {score}</span>
          </div>
          <div className="status-item">
            <span>❤️ Vidas: {lives}</span>
          </div>
          <div className="status-item">
            <span>🌊 Onda: {currentWave}/{waves.length}</span>
          </div>
        </div>

        {/* Advertencia temporal */}
        {showWarning && (
          <div className={`warning-banner ${warningMessage.includes('Correcto') ? 'success' : 'danger'}`}>
            {warningMessage}
          </div>
        )}

        {/* Área del juego */}
        <div className="game-area">
          {gamePhase === 'intro' && (
            <div className="intro-screen">
              <div className="intro-content">
                <h4>🛡️ Misión: Proteger el Paquete</h4>
                <p>Los hackers han creado routers falsos para interceptar tu paquete.</p>
                <p>Andy debe identificar el router legítimo en cada onda.</p>
                <div className="intro-tips">
                  <h5>💡 Consejos:</h5>
                  <ul>
                    <li>Los impostores suelen ser más agresivos en sus mensajes</li>
                    <li>El router legítimo se comporta de manera profesional</li>
                    <li>Tienes 3 vidas - ¡úsalas sabiamente!</li>
                  </ul>
                </div>
                <button className="start-btn" onClick={startGame}>
                  🚀 Comenzar Misión
                </button>
              </div>
            </div>
          )}

          {gamePhase === 'playing' && (
            <div className="playing-area">
              <div className="wave-info">
                <h4>🌊 Onda {currentWave}</h4>
                <p>{waves[currentWave - 1]?.description}</p>
                <p>Busca: <strong>{waves[currentWave - 1]?.targetIP}</strong></p>
              </div>

              <svg width="600" height="350" className="maze-svg">
                {/* Camino/red */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ecf0f1" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Andy */}
                <g className="andy-character">
                  <circle
                    cx={andyPosition.x}
                    cy={andyPosition.y}
                    r="20"
                    fill="#3498db"
                    stroke="#2980b9"
                    strokeWidth="2"
                  />
                  <text
                    x={andyPosition.x}
                    y={andyPosition.y + 5}
                    textAnchor="middle"
                    fontSize="16"
                  >
                    🐿️
                  </text>
                  <text
                    x={andyPosition.x}
                    y={andyPosition.y - 30}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="'Press Start 2P', monospace"
                    fill="#2c3e50"
                  >
                    Andy
                  </text>
                </g>

                {/* Paquete */}
                <g className="packet-item">
                  <circle
                    cx={packetPosition.x}
                    cy={packetPosition.y}
                    r="15"
                    fill="#f39c12"
                    stroke="#e67e22"
                    strokeWidth="2"
                    className="packet-glow"
                  />
                  <text
                    x={packetPosition.x}
                    y={packetPosition.y + 5}
                    textAnchor="middle"
                    fontSize="14"
                  >
                    📦
                  </text>
                </g>

                {/* Routers e impostores */}
                {entities.map(entity => (
                  <g key={entity.id} className="router-entity">
                    <circle
                      cx={entity.x + 30}
                      cy={entity.y + 30}
                      r="35"
                      fill={getRouterColor(entity)}
                      stroke="#2c3e50"
                      strokeWidth="3"
                      className={`router-circle ${entity.isLegit ? 'legit' : 'impostor'}`}
                      onClick={() => handleEntityClick(entity)}
                    />
                    
                    {/* Icono del router */}
                    <text
                      x={entity.x + 30}
                      y={entity.y + 38}
                      textAnchor="middle"
                      fontSize="20"
                    >
                      {entity.isLegit ? "📡" : "🤖"}
                    </text>
                    
                    {/* IP del router */}
                    <text
                      x={entity.x + 30}
                      y={entity.y + 80}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="'Press Start 2P', monospace"
                      fill="#2c3e50"
                    >
                      {entity.ip}
                    </text>
                    
                    {/* Globo de diálogo */}
                    <g className="speech-bubble">
                      <rect
                        x={entity.x - 20}
                        y={entity.y - 30}
                        width="100"
                        height="25"
                        rx="5"
                        fill="white"
                        stroke="#2c3e50"
                        strokeWidth="1"
                        className="bubble-rect"
                      />
                      <text
                        x={entity.x + 30}
                        y={entity.y - 15}
                        textAnchor="middle"
                        fontSize="6"
                        fontFamily="'Press Start 2P', monospace"
                        fill="#2c3e50"
                      >
                        {entity.message}
                      </text>
                    </g>
                    
                    {/* Indicador de peligro para impostores */}
                    {!entity.isLegit && (
                      <text
                        x={entity.x + 55}
                        y={entity.y + 15}
                        fontSize="16"
                        className="danger-indicator"
                      >
                        ⚠️
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          )}

          {gamePhase === 'success' && (
            <div className="success-screen">
              <div className="success-content">
                <h4>🎉 ¡Misión Completada!</h4>
                <p>Has protegido exitosamente el paquete de todos los ataques ARP.</p>
                <p>Puntuación final: <strong>{score} puntos</strong></p>
                <div className="success-animation">
                  <span className="celebration">🎊</span>
                  <span className="celebration">🛡️</span>
                  <span className="celebration">✨</span>
                </div>
                <p className="success-lesson">
                  <strong>Lección aprendida:</strong> En las redes reales, siempre verifica 
                  la autenticidad de los dispositivos antes de enviar datos sensibles.
                </p>
              </div>
            </div>
          )}

          {gamePhase === 'failed' && (
            <div className="failed-screen">
              <div className="failed-content">
                <h4>💥 Misión Fallida</h4>
                <p>Los hackers han interceptado demasiados paquetes.</p>
                <p>Puntuación: <strong>{score} puntos</strong></p>
                <div className="failed-animation">
                  <span className="hacker">🤖</span>
                  <span className="stolen-packet">📦💔</span>
                </div>
                <button className="retry-btn" onClick={startGame}>
                  🔄 Intentar de Nuevo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel educativo */}
        <div className="education-panel">
          <h4>📚 ¿Qué es ARP Spoofing?</h4>
          <p>
            Los atacantes pueden hacerse pasar por dispositivos legítimos en la red 
            para interceptar o modificar el tráfico de datos. Siempre es importante 
            verificar la autenticidad de los dispositivos de red.
          </p>
        </div>
      </div>

      <style>{`
        .arp-maze-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .arp-maze-container {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .puzzle-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .puzzle-header h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .puzzle-header p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #7f8c8d;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .game-status {
          display: flex;
          justify-content: space-around;
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .status-item span {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #2c3e50;
        }

        .warning-banner {
          text-align: center;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          animation: banner-slide 0.5s ease-out;
        }

        .warning-banner.success {
          background: #d5f4e6;
          color: #27ae60;
          border: 2px solid #27ae60;
        }

        .warning-banner.danger {
          background: #fadbd8;
          color: #e74c3c;
          border: 2px solid #e74c3c;
        }

        .game-area {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .intro-screen,
        .success-screen,
        .failed-screen {
          text-align: center;
          padding: 2rem;
        }

        .intro-content h4,
        .success-content h4,
        .failed-content h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .intro-content p,
        .success-content p,
        .failed-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .intro-tips {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          text-align: left;
        }

        .intro-tips h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
          color: #3498db;
        }

        .intro-tips ul {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.4;
        }

        .start-btn,
        .retry-btn {
          background: #27ae60;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .start-btn:hover,
        .retry-btn:hover {
          background: #229954;
          transform: translateY(-2px);
        }

        .playing-area {
          width: 100%;
        }

        .wave-info {
          text-align: center;
          margin-bottom: 1rem;
          background: #ecf0f1;
          padding: 1rem;
          border-radius: 8px;
        }

        .wave-info h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .wave-info p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.3rem;
        }

        .maze-svg {
          border: 2px solid #bdc3c7;
          border-radius: 10px;
          background: #f8f9fa;
          width: 100%;
        }

        .router-circle {
          cursor: pointer;
          transition: all 0.3s;
        }

        .router-circle:hover {
          transform: scale(1.1);
          filter: brightness(1.1);
        }

        .router-circle.impostor {
          animation: impostor-pulse 2s ease-in-out infinite;
        }

        .router-circle.legit {
          animation: legit-glow 3s ease-in-out infinite;
        }

        .packet-glow {
          animation: packet-pulse 1.5s ease-in-out infinite;
        }

        .speech-bubble {
          opacity: 0;
          animation: bubble-appear 0.5s ease-out 1s forwards;
        }

        .danger-indicator {
          animation: danger-blink 1s ease-in-out infinite;
        }

        .success-animation,
        .failed-animation {
          margin: 2rem 0;
        }

        .celebration,
        .hacker,
        .stolen-packet {
          font-size: 2rem;
          margin: 0 0.5rem;
          animation: celebration-bounce 0.6s ease-in-out infinite alternate;
        }

        .celebration:nth-child(2),
        .stolen-packet {
          animation-delay: 0.2s;
        }

        .celebration:nth-child(3) {
          animation-delay: 0.4s;
        }

        .success-lesson {
          background: #d5f4e6;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          border-left: 4px solid #27ae60;
        }

        .education-panel {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 10px;
          margin-top: 2rem;
        }

        .education-panel h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .education-panel p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
        }

        @keyframes banner-slide {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes impostor-pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(0.8) saturate(1.5); }
        }

        @keyframes legit-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2) drop-shadow(0 0 10px #27ae60); }
        }

        @keyframes packet-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes bubble-appear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes danger-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes celebration-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default ARPMazePuzzle;
