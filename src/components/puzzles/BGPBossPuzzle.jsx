import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const BGPBossPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del boss fight
  const [gamePhase, setGamePhase] = useState('intro'); // intro, challenge, victory, defeat
  const [villainHealth, setVillainHealth] = useState(100);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [showVillainDialog, setShowVillainDialog] = useState(true);
  const [cageUnlocking, setCageUnlocking] = useState(false);

  // Diálogos del villano
  const villainDialogs = {
    intro: [
      "¡JAJAJA! ¡Nadie podrá comunicarse sin mí!",
      "Si quieres liberar a tu amiga, tendrás que demostrar",
      "que sabes cómo viajan los mensajes en una red.",
      "¡Pero mis rutas malvadas confundirán tu mente!"
    ],
    challenge1: [
      "¡Primer desafío! ¿Puedes elegir la ruta correcta?",
      "Recuerda: BGP tiene reglas de prioridad...",
      "¡Pero yo he alterado las rutas para confundirte!"
    ],
    challenge2: [
      "¡Imposible! ¡Pero tengo más trucos!",
      "Esta vez las rutas son más complicadas...",
      "¡LocalPref vs AS-PATH! ¡Elige sabiamente!"
    ],
    challenge3: [
      "¡No puede ser! ¡Un último intento!",
      "¡Esta es mi trampa más diabólica!",
      "¡Múltiples atributos BGP! ¡Te confundiré!"
    ],
    defeat: [
      "¡NOOOOO! ¡Mi poder sobre las rutas se desvanece!",
      "Has demostrado que entiendes las redes...",
      "¡La paloma es libre! ¡Pero volveré!"
    ]
  };

  // Desafíos BGP
  const challenges = [
    {
      id: 1,
      scenario: "Destino: 192.168.1.0/24",
      description: "El villano ofrece dos rutas al mismo destino. ¿Cuál elegirías?",
      routes: [
        {
          id: "A",
          name: "Ruta A",
          asPath: "AS100 → AS200 → AS300",
          localPref: 80,
          pathLength: 3,
          isCorrect: false,
          explanation: "AS-PATH más corto (3), pero LocalPref más bajo (80)"
        },
        {
          id: "B", 
          name: "Ruta B",
          asPath: "AS100 → AS400 → AS500 → AS600",
          localPref: 120,
          pathLength: 4,
          isCorrect: true,
          explanation: "LocalPref más alto (120) tiene prioridad sobre AS-PATH más largo"
        }
      ],
      correctExplanation: "¡Correcto! En BGP, LocalPref tiene mayor prioridad que la longitud del AS-PATH. Ruta B gana con LocalPref 120.",
      villainReaction: "¡Argh! ¡Conoces las reglas básicas de BGP!"
    },
    {
      id: 2,
      scenario: "Destino: 10.0.0.0/8",
      description: "Dos rutas con mismo LocalPref. ¿Cuál es mejor?",
      routes: [
        {
          id: "A",
          name: "Ruta A",
          asPath: "AS100 → AS200",
          localPref: 100,
          pathLength: 2,
          origin: "IGP",
          isCorrect: true,
          explanation: "AS-PATH más corto (2) y origen IGP"
        },
        {
          id: "B",
          name: "Ruta B", 
          asPath: "AS100 → AS300 → AS400 → AS500",
          localPref: 100,
          pathLength: 4,
          origin: "EGP",
          isCorrect: false,
          explanation: "AS-PATH más largo (4) y origen EGP (menor prioridad)"
        }
      ],
      correctExplanation: "¡Excelente! Con LocalPref igual, se prefiere el AS-PATH más corto. Ruta A gana con longitud 2.",
      villainReaction: "¡Imposible! ¡Entiendes la selección de rutas!"
    },
    {
      id: 3,
      scenario: "Destino: 172.16.0.0/12",
      description: "¡Desafío final! Múltiples atributos BGP en juego.",
      routes: [
        {
          id: "A",
          name: "Ruta A",
          asPath: "AS100 → AS200 → AS300",
          localPref: 90,
          pathLength: 3,
          med: 50,
          origin: "IGP",
          isCorrect: false,
          explanation: "LocalPref bajo (90), aunque MED es mejor"
        },
        {
          id: "B",
          name: "Ruta B",
          asPath: "AS100 → AS400",
          localPref: 110,
          pathLength: 2,
          med: 100,
          origin: "IGP", 
          isCorrect: true,
          explanation: "LocalPref alto (110) y AS-PATH corto (2)"
        },
        {
          id: "C",
          name: "Ruta C",
          asPath: "AS100 → AS500 → AS600 → AS700 → AS800",
          localPref: 110,
          pathLength: 5,
          med: 30,
          origin: "IGP",
          isCorrect: false,
          explanation: "LocalPref alto pero AS-PATH muy largo (5)"
        }
      ],
      correctExplanation: "¡PERFECTO! Ruta B tiene LocalPref alto (110) y AS-PATH más corto (2). LocalPref siempre gana primero, luego AS-PATH.",
      villainReaction: "¡NOOOOO! ¡Eres un maestro de BGP!"
    }
  ];

  // Comenzar el juego
  const startChallenge = () => {
    setGamePhase('challenge');
    setShowVillainDialog(false);
  };

  // Manejar selección de ruta
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setShowExplanation(true);
    
    if (route.isCorrect) {
      // Respuesta correcta
      const damage = 35;
      setVillainHealth(prev => Math.max(0, prev - damage));
      setPlayerScore(prev => prev + 200);
      updateScore(200);
      
      setTimeout(() => {
        if (villainHealth - damage <= 0) {
          // ¡Victoria!
          setGamePhase('victory');
          setCageUnlocking(true);
          setTimeout(() => {
            onComplete();
          }, 4000);
        } else if (currentChallenge < challenges.length) {
          // Siguiente desafío
          setCurrentChallenge(prev => prev + 1);
          setSelectedRoute(null);
          setShowExplanation(false);
          setShowVillainDialog(true);
          
          setTimeout(() => {
            setShowVillainDialog(false);
          }, 3000);
        }
      }, 4000);
    } else {
      // Respuesta incorrecta
      setTimeout(() => {
        setSelectedRoute(null);
        setShowExplanation(false);
      }, 3000);
    }
  };

  // Obtener desafío actual
  const getCurrentChallenge = () => {
    return challenges[currentChallenge - 1];
  };

  // Obtener diálogo actual del villano
  const getCurrentVillainDialog = () => {
    if (gamePhase === 'intro') return villainDialogs.intro;
    if (gamePhase === 'victory') return villainDialogs.defeat;
    return villainDialogs[`challenge${currentChallenge}`] || [];
  };

  return (
    <div className="bgp-boss-overlay">
      <div className="bgp-boss-container">
        <div className="puzzle-header">
          <h3>⚔️ Boss Final: El Villano Router Mago</h3>
          <p>Demuestra tu conocimiento de BGP para liberar a la paloma</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Barra de vida del villano */}
        <div className="villain-health-bar">
          <div className="health-label">🦹‍♂️ Villano Router Mago</div>
          <div className="health-bar-container">
            <div 
              className="health-bar-fill"
              style={{ width: `${villainHealth}%` }}
            ></div>
          </div>
          <div className="health-text">{villainHealth}/100 HP</div>
        </div>

        {/* Puntuación del jugador */}
        <div className="player-score">
          🏆 Puntuación: {playerScore}
        </div>

        {/* Área del boss fight */}
        <div className="boss-arena">
          {gamePhase === 'intro' && (
            <div className="intro-scene">
              <div className="scene-setup">
                <div className="andy-character">🐿️</div>
                <div className="villain-character">🦹‍♂️</div>
                <div className="trapped-pigeon">
                  <div className="cage-digital">🏛️</div>
                  <div className="pigeon-trapped">🕊️💔</div>
                  <div className="digital-lock">🔒</div>
                </div>
              </div>
              
              {showVillainDialog && (
                <div className="villain-dialog">
                  <div className="dialog-bubble">
                    {getCurrentVillainDialog().map((line, index) => (
                      <p key={index} className="dialog-line">{line}</p>
                    ))}
                  </div>
                  <button className="challenge-btn" onClick={startChallenge}>
                    ⚔️ ¡Acepto el Desafío!
                  </button>
                </div>
              )}
            </div>
          )}

          {gamePhase === 'challenge' && (
            <div className="challenge-scene">
              {showVillainDialog && (
                <div className="villain-dialog mini">
                  <div className="dialog-bubble">
                    {getCurrentVillainDialog().map((line, index) => (
                      <p key={index} className="dialog-line">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="challenge-content">
                <div className="challenge-header">
                  <h4>🎯 Desafío {currentChallenge}/3</h4>
                  <p className="scenario">{getCurrentChallenge().scenario}</p>
                  <p className="description">{getCurrentChallenge().description}</p>
                </div>

                <div className="routes-container">
                  {getCurrentChallenge().routes.map(route => (
                    <div 
                      key={route.id}
                      className={`route-card ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                      onClick={() => !showExplanation && handleRouteSelect(route)}
                    >
                      <div className="route-header">
                        <h5>{route.name}</h5>
                        <div className="route-id">{route.id}</div>
                      </div>
                      
                      <div className="route-details">
                        <div className="detail-item">
                          <span className="label">AS-PATH:</span>
                          <span className="value">{route.asPath}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">LocalPref:</span>
                          <span className="value highlight">{route.localPref}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Longitud:</span>
                          <span className="value">{route.pathLength} saltos</span>
                        </div>
                        {route.med && (
                          <div className="detail-item">
                            <span className="label">MED:</span>
                            <span className="value">{route.med}</span>
                          </div>
                        )}
                        {route.origin && (
                          <div className="detail-item">
                            <span className="label">Origen:</span>
                            <span className="value">{route.origin}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explicación de la respuesta */}
                {showExplanation && selectedRoute && (
                  <div className={`explanation-panel ${selectedRoute.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="explanation-header">
                      <h5>
                        {selectedRoute.isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto"}
                      </h5>
                    </div>
                    
                    <div className="explanation-content">
                      <p><strong>Tu elección:</strong> {selectedRoute.explanation}</p>
                      
                      {selectedRoute.isCorrect ? (
                        <div>
                          <p className="correct-explanation">
                            {getCurrentChallenge().correctExplanation}
                          </p>
                          <p className="villain-reaction">
                            <em>Villano: "{getCurrentChallenge().villainReaction}"</em>
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="hint">
                            💡 <strong>Pista:</strong> Recuerda el orden de prioridad BGP:
                            1. LocalPref (más alto mejor)
                            2. AS-PATH (más corto mejor)
                            3. Origen (IGP &gt; EGP &gt; Incomplete)
                            4. MED (más bajo mejor)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {gamePhase === 'victory' && (
            <div className="victory-scene">
              <div className="victory-animation">
                <div className="defeated-villain">🦹‍♂️💥</div>
                <div className={`cage-unlocking ${cageUnlocking ? 'unlocking' : ''}`}>
                  <div className="cage-breaking">🏛️💥</div>
                  <div className="pigeon-free">🕊️✨</div>
                </div>
                <div className="andy-victorious">🐿️🎉</div>
              </div>
              
              <div className="victory-dialog">
                <h4>🎉 ¡Victoria!</h4>
                <div className="dialog-bubble">
                  {getCurrentVillainDialog().map((line, index) => (
                    <p key={index} className="dialog-line">{line}</p>
                  ))}
                </div>
                
                <div className="victory-stats">
                  <p>🏆 Puntuación Final: <strong>{playerScore}</strong></p>
                  <p>⚔️ Desafíos Completados: <strong>{challenges.length}/3</strong></p>
                  <p>🧠 Conocimiento BGP: <strong>¡Maestro!</strong></p>
                </div>
                
                <div className="victory-message">
                  <p>
                    <strong>¡Has demostrado que entiendes cómo Internet decide las mejores rutas!</strong>
                  </p>
                  <p>
                    La paloma está libre gracias a tu conocimiento de BGP y redes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel educativo */}
        <div className="education-panel">
          <h4>📚 Orden de Prioridad BGP</h4>
          <ol>
            <li><strong>LocalPref:</strong> Preferencia local (más alto = mejor)</li>
            <li><strong>AS-PATH:</strong> Longitud del camino (más corto = mejor)</li>
            <li><strong>Origen:</strong> IGP &gt; EGP &gt; Incomplete</li>
            <li><strong>MED:</strong> Multi-Exit Discriminator (más bajo = mejor)</li>
          </ol>
        </div>
      </div>

      <style>{`
        .bgp-boss-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .bgp-boss-container {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          max-width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 3px solid #8b4513;
        }

        .puzzle-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .puzzle-header h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #8b4513;
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

        .villain-health-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          background: #2c3e50;
          padding: 1rem;
          border-radius: 10px;
          color: white;
        }

        .health-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          min-width: 200px;
        }

        .health-bar-container {
          flex: 1;
          height: 20px;
          background: #34495e;
          border-radius: 10px;
          overflow: hidden;
        }

        .health-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #e74c3c, #f39c12, #27ae60);
          transition: width 1s ease-out;
        }

        .health-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          min-width: 80px;
        }

        .player-score {
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          background: #f39c12;
          color: white;
          padding: 0.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .boss-arena {
          min-height: 400px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 2rem;
          position: relative;
        }

        .intro-scene,
        .victory-scene {
          text-align: center;
          color: white;
        }

        .scene-setup {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 3rem;
        }

        .trapped-pigeon {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cage-digital {
          font-size: 4rem;
          margin-bottom: -1rem;
        }

        .digital-lock {
          position: absolute;
          top: 1rem;
          right: -1rem;
          font-size: 2rem;
          animation: lock-pulse 1s ease-in-out infinite;
        }

        .villain-dialog {
          background: rgba(0, 0, 0, 0.8);
          padding: 2rem;
          border-radius: 15px;
          border: 2px solid #f39c12;
        }

        .villain-dialog.mini {
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .dialog-bubble {
          margin-bottom: 1rem;
        }

        .dialog-line {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .challenge-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .challenge-btn:hover {
          background: #c0392b;
          transform: scale(1.05);
        }

        .challenge-content {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          color: #2c3e50;
        }

        .challenge-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .challenge-header h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #8b4513;
        }

        .scenario {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          color: #3498db;
        }

        .description {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.4;
        }

        .routes-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .route-card {
          flex: 1;
          background: #f8f9fa;
          border: 2px solid #bdc3c7;
          border-radius: 10px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 200px;
        }

        .route-card:hover {
          border-color: #3498db;
          transform: translateY(-2px);
        }

        .route-card.selected {
          border-color: #f39c12;
          background: #fef9e7;
        }

        .route-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .route-header h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #2c3e50;
        }

        .route-id {
          background: #3498db;
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 50%;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
        }

        .route-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #7f8c8d;
        }

        .value {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #2c3e50;
        }

        .value.highlight {
          background: #f39c12;
          color: white;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }

        .explanation-panel {
          padding: 1.5rem;
          border-radius: 10px;
          animation: explanation-slide 0.5s ease-out;
        }

        .explanation-panel.correct {
          background: #d5f4e6;
          border: 2px solid #27ae60;
        }

        .explanation-panel.incorrect {
          background: #fadbd8;
          border: 2px solid #e74c3c;
        }

        .explanation-header h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .explanation-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.8rem;
          line-height: 1.4;
        }

        .correct-explanation {
          color: #27ae60;
          font-weight: bold;
        }

        .villain-reaction {
          color: #8b4513;
          font-style: italic;
        }

        .hint {
          background: rgba(52, 152, 219, 0.1);
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .victory-animation {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 4rem;
        }

        .cage-unlocking.unlocking .cage-breaking {
          animation: cage-break 2s ease-out;
        }

        .cage-unlocking.unlocking .pigeon-free {
          animation: pigeon-fly 2s ease-out 1s;
        }

        .victory-dialog {
          background: rgba(46, 204, 113, 0.9);
          padding: 2rem;
          border-radius: 15px;
          color: white;
        }

        .victory-dialog h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .victory-stats {
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .victory-stats p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.5rem;
        }

        .victory-message {
          text-align: center;
          margin-top: 1rem;
        }

        .victory-message p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.4;
          margin-bottom: 0.8rem;
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
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .education-panel ol {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
        }

        .education-panel li {
          margin-bottom: 0.5rem;
        }

        @keyframes lock-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes explanation-slide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes cage-break {
          0% { transform: scale(1); }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(0.8) rotate(-5deg); opacity: 0.5; }
        }

        @keyframes pigeon-fly {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-50px) scale(1.2); }
          100% { transform: translateY(-100px) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default BGPBossPuzzle;
