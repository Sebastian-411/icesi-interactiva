import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const SQLInjectionBossPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del puzzle
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, completed
  const [currentAttack, setCurrentAttack] = useState(1);
  const [maliciousQuery, setMaliciousQuery] = useState('');
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [defenseResult, setDefenseResult] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [completedAttacks, setCompletedAttacks] = useState(0);

  // Ataques de SQL Injection
  const attacks = [
    {
      id: 1,
      title: "Ataque Básico",
      description: "El villano intenta acceder a todos los usuarios",
      maliciousQuery: "SELECT * FROM usuarios WHERE nombre='' OR '1'='1'",
      explanation: "Este ataque usa OR '1'='1' para hacer que la condición siempre sea verdadera",
      defenses: [
        {
          id: 'prepared',
          name: 'Usar parámetros preparados',
          description: 'PreparedStatement previene la inyección',
          correct: true,
          code: "PreparedStatement stmt = conn.prepareStatement(\"SELECT * FROM usuarios WHERE nombre = ?\");\nstmt.setString(1, nombre);"
        },
        {
          id: 'validation',
          name: 'Validar entrada del usuario',
          description: 'Verificar que los datos cumplan el formato esperado',
          correct: false,
          code: "if (nombre.matches(\"[a-zA-Z ]+\")) {\n    // procesar consulta\n}"
        },
        {
          id: 'allow',
          name: 'Permitir el ataque',
          description: 'Dejar que la consulta se ejecute normalmente',
          correct: false,
          code: "// Sin protección - VULNERABLE"
        }
      ]
    },
    {
      id: 2,
      title: "Ataque de Unión",
      description: "El villano intenta obtener información de otras tablas",
      maliciousQuery: "SELECT * FROM productos WHERE id=1 UNION SELECT password FROM usuarios",
      explanation: "Este ataque usa UNION para combinar datos de tablas diferentes",
      defenses: [
        {
          id: 'prepared',
          name: 'Usar parámetros preparados',
          description: 'PreparedStatement bloquea la inyección UNION',
          correct: true,
          code: "PreparedStatement stmt = conn.prepareStatement(\"SELECT * FROM productos WHERE id = ?\");\nstmt.setInt(1, id);"
        },
        {
          id: 'escape',
          name: 'Escapar caracteres especiales',
          description: 'Reemplazar caracteres peligrosos',
          correct: false,
          code: "String safeInput = input.replace(\"'\", \"''\");"
        },
        {
          id: 'allow',
          name: 'Permitir el ataque',
          description: 'Dejar que la consulta se ejecute normalmente',
          correct: false,
          code: "// Sin protección - VULNERABLE"
        }
      ]
    },
    {
      id: 3,
      title: "Ataque de Eliminación",
      description: "El villano intenta eliminar todos los datos",
      maliciousQuery: "SELECT * FROM usuarios WHERE id=1; DROP TABLE usuarios; --",
      explanation: "Este ataque intenta ejecutar múltiples consultas, incluyendo DROP TABLE",
      defenses: [
        {
          id: 'prepared',
          name: 'Usar parámetros preparados',
          description: 'PreparedStatement solo permite una consulta por statement',
          correct: true,
          code: "PreparedStatement stmt = conn.prepareStatement(\"SELECT * FROM usuarios WHERE id = ?\");\nstmt.setInt(1, id);"
        },
        {
          id: 'sanitize',
          name: 'Sanitizar entrada',
          description: 'Remover palabras clave peligrosas',
          correct: false,
          code: "String safeInput = input.replaceAll(\"(?i)(DROP|DELETE|UPDATE|INSERT)\", \"\");"
        },
        {
          id: 'allow',
          name: 'Permitir el ataque',
          description: 'Dejar que la consulta se ejecute normalmente',
          correct: false,
          code: "// Sin protección - VULNERABLE"
        }
      ]
    }
  ];

  // Inicializar ataque
  useEffect(() => {
    if (gamePhase === 'playing') {
      const attack = attacks[currentAttack - 1];
      setMaliciousQuery(attack.maliciousQuery);
      setSelectedDefense(null);
      setDefenseResult(null);
    }
  }, [currentAttack, gamePhase]);

  // Comenzar el juego
  const startGame = () => {
    setGamePhase('playing');
  };

  // Seleccionar defensa
  const selectDefense = (defense) => {
    setSelectedDefense(defense);
  };

  // Ejecutar defensa
  const executeDefense = () => {
    if (!selectedDefense) return;

    const isCorrect = selectedDefense.correct;
    
    setDefenseResult({
      success: isCorrect,
      defense: selectedDefense,
      message: isCorrect ? 
        "¡Defensa exitosa! El ataque ha sido bloqueado." :
        "¡Defensa fallida! El ataque ha comprometido la base de datos."
    });

    if (isCorrect) {
      const points = 400 * currentAttack;
      setScore(prev => prev + points);
      updateScore(points);
      setCompletedAttacks(prev => prev + 1);

      setTimeout(() => {
        if (currentAttack >= attacks.length) {
          setGamePhase('completed');
          setTimeout(() => onComplete(), 3000);
        } else {
          setCurrentAttack(prev => prev + 1);
          setDefenseResult(null);
          setSelectedDefense(null);
        }
      }, 3000);
    } else {
      setLives(prev => prev - 1);
      
      if (lives <= 1) {
        setTimeout(() => {
          setGamePhase('gameOver');
          setTimeout(() => onClose(), 3000);
        }, 3000);
      } else {
        setTimeout(() => {
          setDefenseResult(null);
          setSelectedDefense(null);
        }, 3000);
      }
    }
  };

  // Obtener ataque actual
  const getCurrentAttack = () => {
    return attacks[currentAttack - 1];
  };

  return (
    <div className="sql-injection-boss-overlay">
      <div className="sql-injection-boss-container">
        <div className="puzzle-header">
          <h3>👑 Boss: El Villano SQL Injection</h3>
          <p>Defiende la base de datos de ataques maliciosos</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Puntuación y vidas */}
        <div className="boss-stats">
          <div className="score-stat">🏆 Puntuación: {score}</div>
          <div className="lives-stat">❤️ Vidas: {lives}/3</div>
          <div className="progress-stat">⚔️ Ataques: {completedAttacks}/{attacks.length}</div>
        </div>

        {gamePhase === 'intro' && (
          <div className="intro-screen">
            <div className="villain-appearance">
              <div className="villain-character">🦹‍♂️💥</div>
              <div className="villain-speech">
                <p>"¡He lanzado consultas maliciosas contra tu base de datos!"</p>
                <p>"Si no sabes cómo defenderme, todos los datos serán destruidos!"</p>
              </div>
            </div>
            
            <div className="intro-content">
              <h4>🎯 Tu Misión</h4>
              <p>El villano está atacando la base de datos con SQL Injection. Debes elegir la defensa correcta para cada ataque.</p>
              <p>Si fallas, perderás vidas. Si te quedas sin vidas, el villano ganará.</p>
              
              <div className="security-concepts">
                <h5>🛡️ Defensas contra SQL Injection:</h5>
                <div className="concept-cards">
                  <div className="concept-card">
                    <h6>🔒 Parámetros Preparados</h6>
                    <p>La mejor defensa contra inyección SQL</p>
                  </div>
                  <div className="concept-card">
                    <h6>✅ Validación de Entrada</h6>
                    <p>Verificar que los datos cumplan el formato esperado</p>
                  </div>
                  <div className="concept-card">
                    <h6>🧹 Sanitización</h6>
                    <p>Limpiar datos peligrosos antes de procesarlos</p>
                  </div>
                </div>
              </div>
              
              <button className="start-btn" onClick={startGame}>
                🛡️ Comenzar Defensa
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'playing' && (
          <div className="playing-area">
            <div className="attack-info">
              <h4>⚔️ Ataque {currentAttack}/{attacks.length}: {getCurrentAttack().title}</h4>
              <p>{getCurrentAttack().description}</p>
            </div>

            {/* Consulta maliciosa */}
            <div className="malicious-query">
              <h5>💥 Consulta Maliciosa del Villano:</h5>
              <div className="query-box">
                <code>{getCurrentAttack().maliciousQuery}</code>
              </div>
              <div className="explanation">
                <p>💡 <strong>Explicación:</strong> {getCurrentAttack().explanation}</p>
              </div>
            </div>

            {/* Opciones de defensa */}
            <div className="defense-options">
              <h5>🛡️ Elige tu defensa:</h5>
              <div className="defense-grid">
                {getCurrentAttack().defenses.map(defense => (
                  <div 
                    key={defense.id}
                    className={`defense-card ${selectedDefense?.id === defense.id ? 'selected' : ''}`}
                    onClick={() => selectDefense(defense)}
                  >
                    <div className="defense-header">
                      <h6>{defense.name}</h6>
                      <div className={`defense-indicator ${defense.correct ? 'correct' : 'incorrect'}`}>
                        {defense.correct ? '✅' : '❌'}
                      </div>
                    </div>
                    <p>{defense.description}</p>
                    <div className="defense-code">
                      <pre>{defense.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de ejecutar */}
            <div className="controls">
              <button 
                className="execute-btn"
                onClick={executeDefense}
                disabled={!selectedDefense}
              >
                ⚡ Ejecutar Defensa
              </button>
            </div>

            {/* Resultado de defensa */}
            {defenseResult && (
              <div className={`defense-result ${defenseResult.success ? 'success' : 'failure'}`}>
                <div className="result-header">
                  <h5>
                    {defenseResult.success ? '✅ ¡Defensa Exitosa!' : '❌ ¡Defensa Fallida!'}
                  </h5>
                </div>
                
                <div className="result-content">
                  <p><strong>Defensa usada:</strong> {defenseResult.defense.name}</p>
                  <p><strong>Resultado:</strong> {defenseResult.message}</p>
                  
                  {defenseResult.success ? (
                    <div className="success-animation">
                      <div className="shield-protection">🛡️✨🛡️✨</div>
                      <p>¡La base de datos está protegida!</p>
                    </div>
                  ) : (
                    <div className="failure-animation">
                      <div className="database-explosion">💥💾💥💾</div>
                      <p>¡El ataque ha comprometido los datos!</p>
                      <p>Vidas restantes: {lives - 1}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {gamePhase === 'completed' && (
          <div className="completion-screen">
            <div className="victory-animation">
              <div className="villain-defeated">🦹‍♂️💥 → 🛡️✅</div>
              <div className="victory-message">
                <h3>🎉 ¡Villano Derrotado!</h3>
                <p>Has protegido exitosamente la base de datos</p>
                <p>Puntuación total: {score}</p>
                <p>¡La iguana está libre!</p>
              </div>
            </div>
          </div>
        )}

        {gamePhase === 'gameOver' && (
          <div className="game-over-screen">
            <div className="defeat-animation">
              <div className="villain-victory">🦹‍♂️👑💥</div>
              <div className="defeat-message">
                <h3>💀 ¡Derrota!</h3>
                <p>El villano ha destruido la base de datos</p>
                <p>Puntuación final: {score}</p>
                <p>La iguana sigue atrapada...</p>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .sql-injection-boss-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            font-family: 'Press Start 2P', monospace;
          }

          .sql-injection-boss-container {
            width: 95%;
            max-width: 1200px;
            max-height: 90vh;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #1a1a2e 100%);
            border-radius: 20px;
            padding: 2rem;
            overflow-y: auto;
            border: 3px solid #e74c3c;
            box-shadow: 0 0 30px rgba(231, 76, 60, 0.5);
          }

          .puzzle-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid #e74c3c;
            padding-bottom: 1rem;
          }

          .puzzle-header h3 {
            color: #e74c3c;
            font-size: 1.2rem;
            margin: 0;
          }

          .puzzle-header p {
            color: #ecf0f1;
            font-size: 0.8rem;
            margin: 0.5rem 0 0 0;
          }

          .close-btn {
            background: #e74c3c;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .close-btn:hover {
            background: #c0392b;
            transform: scale(1.1);
          }

          .boss-stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
            background: rgba(231, 76, 60, 0.1);
            padding: 1rem;
            border-radius: 10px;
          }

          .score-stat, .lives-stat, .progress-stat {
            color: #e74c3c;
            font-size: 0.8rem;
          }

          .intro-screen {
            text-align: center;
            color: white;
          }

          .villain-appearance {
            margin-bottom: 2rem;
          }

          .villain-character {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: villain-menace 2s ease-in-out infinite alternate;
          }

          .villain-speech {
            background: rgba(231, 76, 60, 0.8);
            padding: 1.5rem;
            border-radius: 15px;
            font-size: 0.7rem;
            line-height: 1.4;
            max-width: 600px;
            margin: 0 auto;
          }

          .villain-speech p {
            margin-bottom: 0.5rem;
          }

          .intro-content h4 {
            color: #e74c3c;
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .intro-content p {
            font-size: 0.7rem;
            line-height: 1.4;
            margin-bottom: 1rem;
            color: #ecf0f1;
          }

          .security-concepts {
            margin: 2rem 0;
          }

          .security-concepts h5 {
            color: #f39c12;
            font-size: 0.8rem;
            margin-bottom: 1rem;
          }

          .concept-cards {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .concept-card {
            background: rgba(243, 156, 18, 0.1);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #f39c12;
            min-width: 150px;
          }

          .concept-card h6 {
            color: #f39c12;
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
          }

          .concept-card p {
            font-size: 0.6rem;
            color: #ecf0f1;
            margin: 0;
          }

          .start-btn {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            padding: 1.5rem 3rem;
            border-radius: 15px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
          }

          .start-btn:hover {
            background: linear-gradient(45deg, #c0392b, #a93226);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
          }

          .playing-area {
            width: 100%;
          }

          .attack-info {
            text-align: center;
            margin-bottom: 2rem;
            background: rgba(231, 76, 60, 0.1);
            padding: 1rem;
            border-radius: 10px;
          }

          .attack-info h4 {
            color: #e74c3c;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .attack-info p {
            color: #ecf0f1;
            font-size: 0.7rem;
            margin: 0;
          }

          .malicious-query {
            margin-bottom: 2rem;
          }

          .malicious-query h5 {
            color: #e74c3c;
            font-size: 0.8rem;
            margin-bottom: 1rem;
          }

          .query-box {
            background: rgba(0, 0, 0, 0.8);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #e74c3c;
            margin-bottom: 1rem;
          }

          .query-box code {
            color: #e74c3c;
            font-family: 'Courier New', monospace;
            font-size: 0.7rem;
            line-height: 1.4;
          }

          .explanation {
            background: rgba(241, 196, 15, 0.1);
            padding: 1rem;
            border-radius: 8px;
            border: 2px solid #f1c40f;
          }

          .explanation p {
            color: #f1c40f;
            font-size: 0.6rem;
            margin: 0;
          }

          .defense-options {
            margin-bottom: 2rem;
          }

          .defense-options h5 {
            color: #f39c12;
            font-size: 0.8rem;
            margin-bottom: 1rem;
          }

          .defense-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }

          .defense-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #7f8c8d;
            cursor: pointer;
            transition: all 0.3s;
          }

          .defense-card:hover {
            border-color: #f39c12;
            background: rgba(243, 156, 18, 0.1);
          }

          .defense-card.selected {
            border-color: #f39c12;
            background: rgba(243, 156, 18, 0.2);
          }

          .defense-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .defense-header h6 {
            color: #ecf0f1;
            font-size: 0.7rem;
            margin: 0;
          }

          .defense-indicator {
            font-size: 1rem;
          }

          .defense-card p {
            color: #bdc3c7;
            font-size: 0.6rem;
            margin-bottom: 1rem;
            line-height: 1.3;
          }

          .defense-code {
            background: rgba(0, 0, 0, 0.5);
            padding: 0.8rem;
            border-radius: 5px;
            border: 1px solid #34495e;
          }

          .defense-code pre {
            color: #2ecc71;
            font-family: 'Courier New', monospace;
            font-size: 0.5rem;
            margin: 0;
            line-height: 1.3;
          }

          .controls {
            text-align: center;
            margin-bottom: 2rem;
          }

          .execute-btn {
            background: #f39c12;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .execute-btn:hover:not(:disabled) {
            background: #e67e22;
            transform: translateY(-2px);
          }

          .execute-btn:disabled {
            background: #7f8c8d;
            cursor: not-allowed;
          }

          .defense-result {
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
          }

          .defense-result.success {
            border: 3px solid #2ecc71;
          }

          .defense-result.failure {
            border: 3px solid #e74c3c;
          }

          .result-header h5 {
            font-size: 1rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .result-content p {
            font-size: 0.6rem;
            margin-bottom: 0.8rem;
            line-height: 1.4;
          }

          .success-animation {
            text-align: center;
            margin-top: 1rem;
          }

          .shield-protection {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: shield-glow 1s ease-in-out infinite alternate;
          }

          .failure-animation {
            text-align: center;
            margin-top: 1rem;
          }

          .database-explosion {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: explosion-shake 0.5s ease-in-out infinite;
          }

          .completion-screen, .game-over-screen {
            text-align: center;
            color: white;
          }

          .victory-animation, .defeat-animation {
            background: rgba(0, 0, 0, 0.5);
            padding: 3rem;
            border-radius: 20px;
          }

          .villain-defeated, .villain-victory {
            font-size: 4rem;
            margin-bottom: 2rem;
            animation: boss-result 2s ease-in-out infinite;
          }

          .victory-message h3 {
            color: #2ecc71;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }

          .defeat-message h3 {
            color: #e74c3c;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }

          .victory-message p, .defeat-message p {
            font-size: 0.8rem;
            color: #ecf0f1;
            margin-bottom: 0.5rem;
          }

          @keyframes villain-menace {
            0% { transform: translateY(0) rotate(-2deg); }
            100% { transform: translateY(-15px) rotate(2deg); }
          }

          @keyframes shield-glow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.5) drop-shadow(0 0 10px #2ecc71); }
          }

          @keyframes explosion-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes boss-result {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
          }

          @media (max-width: 768px) {
            .defense-grid {
              grid-template-columns: 1fr;
            }
            
            .boss-stats {
              flex-direction: column;
              gap: 0.5rem;
            }
            
            .query-box code {
              font-size: 0.6rem;
            }
            
            .defense-code pre {
              font-size: 0.4rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SQLInjectionBossPuzzle;
