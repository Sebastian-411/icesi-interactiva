import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const DeadlockBossPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del boss fight
  const [gamePhase, setGamePhase] = useState('intro'); // intro, challenge, victory
  const [villainHealth, setVillainHealth] = useState(100);
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [processes, setProcesses] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [deadlockDetected, setDeadlockDetected] = useState(false);
  const [solutionResult, setSolutionResult] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [showVillainDialog, setShowVillainDialog] = useState(true);

  // Diálogos del villano
  const villainDialogs = {
    intro: [
      "¡JAJAJA! ¡He creado el deadlock perfecto!",
      "Mis procesos están atrapados en un círculo eterno",
      "esperando recursos que nunca se liberarán.",
      "¡Solo un verdadero experto en SO puede romper mi hechizo!"
    ],
    challenge1: [
      "¡Primer hechizo de deadlock!",
      "Cuatro procesos, cuatro recursos...",
      "¡Cada uno espera lo que el otro tiene!"
    ],
    challenge2: [
      "¡Imposible! Pero tengo más trucos...",
      "¡Esta vez el deadlock es más complejo!",
      "¡Múltiples recursos y dependencias!"
    ],
    challenge3: [
      "¡No puede ser! ¡Mi último y más poderoso deadlock!",
      "¡Con prioridades y múltiples hilos!",
      "¡Jamás podrás resolverlo!"
    ],
    defeat: [
      "¡NOOOOO! ¡Mi poder sobre los procesos se desvanece!",
      "Has demostrado que entiendes los deadlocks...",
      "¡El murciélago es libre! ¡Pero volveré!"
    ]
  };

  // Desafíos de deadlock
  const challenges = [
    {
      id: 1,
      title: "Deadlock Clásico",
      description: "Cuatro procesos en deadlock circular",
      processes: [
        { 
          id: 'P1', 
          name: 'Proceso Murciélago A', 
          emoji: '🦇', 
          color: '#e74c3c',
          holds: ['R1'], 
          waitsFor: ['R2'],
          position: { x: 200, y: 100 }
        },
        { 
          id: 'P2', 
          name: 'Proceso Murciélago B', 
          emoji: '🦇', 
          color: '#3498db',
          holds: ['R2'], 
          waitsFor: ['R3'],
          position: { x: 400, y: 100 }
        },
        { 
          id: 'P3', 
          name: 'Proceso Murciélago C', 
          emoji: '🦇', 
          color: '#f39c12',
          holds: ['R3'], 
          waitsFor: ['R4'],
          position: { x: 400, y: 300 }
        },
        { 
          id: 'P4', 
          name: 'Proceso Murciélago D', 
          emoji: '🦇', 
          color: '#2ecc71',
          holds: ['R4'], 
          waitsFor: ['R1'],
          position: { x: 200, y: 300 }
        }
      ],
      resources: [
        { id: 'R1', name: 'Recurso Cristal', emoji: '💎', color: '#9b59b6', position: { x: 150, y: 150 } },
        { id: 'R2', name: 'Recurso Gema', emoji: '💍', color: '#1abc9c', position: { x: 450, y: 150 } },
        { id: 'R3', name: 'Recurso Oro', emoji: '🏆', color: '#f1c40f', position: { x: 450, y: 250 } },
        { id: 'R4', name: 'Recurso Plata', emoji: '🥈', color: '#95a5a6', position: { x: 150, y: 250 } }
      ],
      solution: {
        type: 'release_resource',
        correctProcess: 'P1',
        explanation: 'Liberar el recurso R1 del proceso P1 rompe el ciclo de espera'
      }
    },
    {
      id: 2,
      title: "Deadlock Múltiple",
      description: "Deadlock con múltiples recursos por proceso",
      processes: [
        { 
          id: 'P1', 
          name: 'Proceso Alpha', 
          emoji: '🦇', 
          color: '#e74c3c',
          holds: ['R1', 'R2'], 
          waitsFor: ['R3'],
          position: { x: 150, y: 150 }
        },
        { 
          id: 'P2', 
          name: 'Proceso Beta', 
          emoji: '🦇', 
          color: '#3498db',
          holds: ['R3'], 
          waitsFor: ['R4', 'R5'],
          position: { x: 450, y: 150 }
        },
        { 
          id: 'P3', 
          name: 'Proceso Gamma', 
          emoji: '🦇', 
          color: '#f39c12',
          holds: ['R4', 'R5'], 
          waitsFor: ['R1'],
          position: { x: 300, y: 300 }
        }
      ],
      resources: [
        { id: 'R1', name: 'CPU', emoji: '🖥️', color: '#9b59b6', position: { x: 100, y: 200 } },
        { id: 'R2', name: 'RAM', emoji: '💾', color: '#1abc9c', position: { x: 200, y: 100 } },
        { id: 'R3', name: 'Disco', emoji: '💿', color: '#f1c40f', position: { x: 500, y: 200 } },
        { id: 'R4', name: 'Red', emoji: '🌐', color: '#95a5a6', position: { x: 350, y: 350 } },
        { id: 'R5', name: 'Impresora', emoji: '🖨️', color: '#e67e22', position: { x: 250, y: 350 } }
      ],
      solution: {
        type: 'preempt_process',
        correctProcess: 'P3',
        explanation: 'Interrumpir P3 y liberar R4 y R5 permite que P2 continúe'
      }
    },
    {
      id: 3,
      title: "Deadlock Jerárquico",
      description: "Deadlock complejo con prioridades",
      processes: [
        { 
          id: 'P1', 
          name: 'Proceso High Priority', 
          emoji: '🦇', 
          color: '#e74c3c',
          holds: ['R1'], 
          waitsFor: ['R2'],
          priority: 'high',
          position: { x: 200, y: 100 }
        },
        { 
          id: 'P2', 
          name: 'Proceso Medium Priority', 
          emoji: '🦇', 
          color: '#f39c12',
          holds: ['R2', 'R3'], 
          waitsFor: ['R4'],
          priority: 'medium',
          position: { x: 400, y: 200 }
        },
        { 
          id: 'P3', 
          name: 'Proceso Low Priority', 
          emoji: '🦇', 
          color: '#2ecc71',
          holds: ['R4'], 
          waitsFor: ['R1'],
          priority: 'low',
          position: { x: 200, y: 300 }
        }
      ],
      resources: [
        { id: 'R1', name: 'Mutex A', emoji: '🔐', color: '#9b59b6', position: { x: 150, y: 150 } },
        { id: 'R2', name: 'Mutex B', emoji: '🗝️', color: '#1abc9c', position: { x: 450, y: 150 } },
        { id: 'R3', name: 'Semáforo', emoji: '🚦', color: '#f1c40f', position: { x: 450, y: 250 } },
        { id: 'R4', name: 'Lock', emoji: '🔒', color: '#95a5a6', position: { x: 150, y: 250 } }
      ],
      solution: {
        type: 'priority_inheritance',
        correctProcess: 'P2',
        explanation: 'Aplicar herencia de prioridad: P2 hereda la prioridad alta de P1'
      }
    }
  ];

  // Inicializar desafío
  useEffect(() => {
    if (gamePhase === 'challenge') {
      const challenge = challenges[currentChallenge - 1];
      setProcesses([...challenge.processes]);
      setResources([...challenge.resources]);
      setDeadlockDetected(true);
      setSolutionResult(null);
      setSelectedProcess(null);
    }
  }, [currentChallenge, gamePhase]);

  // Comenzar el desafío
  const startChallenge = () => {
    setGamePhase('challenge');
    setShowVillainDialog(false);
  };

  // Seleccionar proceso para acción
  const selectProcess = (process) => {
    setSelectedProcess(process);
  };

  // Intentar resolver deadlock
  const attemptSolution = (actionType) => {
    if (!selectedProcess) return;

    const challenge = challenges[currentChallenge - 1];
    const isCorrect = 
      (actionType === challenge.solution.type && 
       selectedProcess.id === challenge.solution.correctProcess) ||
      (actionType === 'release_resource' && challenge.solution.type === 'release_resource' && selectedProcess.id === challenge.solution.correctProcess) ||
      (actionType === 'preempt_process' && challenge.solution.type === 'preempt_process' && selectedProcess.id === challenge.solution.correctProcess) ||
      (actionType === 'priority_inheritance' && challenge.solution.type === 'priority_inheritance' && selectedProcess.id === challenge.solution.correctProcess);

    if (isCorrect) {
      // Solución correcta
      const damage = 35;
      setVillainHealth(prev => Math.max(0, prev - damage));
      setPlayerScore(prev => prev + 250);
      updateScore(250);
      setDeadlockDetected(false);
      
      // Animar la liberación
      animateDeadlockResolution();
      
      setSolutionResult({
        success: true,
        message: `¡Correcto! ${challenge.solution.explanation}`,
        action: actionType,
        process: selectedProcess.name
      });

      setTimeout(() => {
        if (villainHealth - damage <= 0) {
          // ¡Victoria!
          setGamePhase('victory');
          setTimeout(() => {
            onComplete();
          }, 4000);
        } else if (currentChallenge < challenges.length) {
          // Siguiente desafío
          setCurrentChallenge(prev => prev + 1);
          setSolutionResult(null);
          setShowVillainDialog(true);
          
          setTimeout(() => {
            setShowVillainDialog(false);
          }, 3000);
        }
      }, 4000);
    } else {
      // Solución incorrecta
      setSolutionResult({
        success: false,
        message: `Incorrecto. Esa acción no resuelve el deadlock.`,
        action: actionType,
        process: selectedProcess.name,
        hint: getHintForChallenge(challenge)
      });
      
      setTimeout(() => {
        setSolutionResult(null);
        setSelectedProcess(null);
      }, 4000);
    }
  };

  // Animar resolución de deadlock
  const animateDeadlockResolution = () => {
    // Actualizar procesos para mostrar que están liberados
    setProcesses(prev => prev.map(p => ({
      ...p,
      waitsFor: [],
      status: 'freed'
    })));
  };

  // Obtener pista para el desafío
  const getHintForChallenge = (challenge) => {
    switch (challenge.solution.type) {
      case 'release_resource':
        return 'Pista: Identifica qué proceso puede liberar un recurso para romper el ciclo.';
      case 'preempt_process':
        return 'Pista: Considera interrumpir un proceso para liberar múltiples recursos.';
      case 'priority_inheritance':
        return 'Pista: Usa herencia de prioridad para evitar inversión de prioridades.';
      default:
        return 'Pista: Analiza el grafo de espera para encontrar el punto de ruptura.';
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

  // Renderizar conexiones de deadlock
  const renderDeadlockConnections = () => {
    if (!deadlockDetected) return null;

    return processes.map(process => {
      return process.waitsFor.map(resourceId => {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return null;

        return (
          <line
            key={`${process.id}-${resourceId}`}
            x1={process.position.x + 30}
            y1={process.position.y + 30}
            x2={resource.position.x + 25}
            y2={resource.position.y + 25}
            stroke="#e74c3c"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="deadlock-connection"
          />
        );
      });
    }).flat();
  };

  return (
    <div className="deadlock-boss-overlay">
      <div className="deadlock-boss-container">
        <div className="puzzle-header">
          <h3>⚔️ Boss Final: Deadlock del Villano</h3>
          <p>Rompe los deadlocks para liberar al murciélago</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Barra de vida del villano */}
        <div className="villain-health-bar">
          <div className="health-label">🦹‍♂️ Villano Deadlock Master</div>
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
                <div className="trapped-bat">
                  <div className="deadlock-circle">
                    <div className="trapped-processes">
                      <span className="trapped-process">🦇</span>
                      <span className="trapped-process">🦇</span>
                      <span className="trapped-process">🦇</span>
                      <span className="trapped-process">🦇</span>
                    </div>
                  </div>
                  <div className="deadlock-label">¡Deadlock Eterno!</div>
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
                    ⚔️ ¡Romper el Deadlock!
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
                  <h4>🎯 Desafío {currentChallenge}/3: {getCurrentChallenge().title}</h4>
                  <p className="description">{getCurrentChallenge().description}</p>
                  {deadlockDetected && (
                    <div className="deadlock-warning">
                      ⚠️ <strong>DEADLOCK DETECTADO</strong> - Los procesos están bloqueados mutuamente
                    </div>
                  )}
                </div>

                {/* Visualización del deadlock */}
                <div className="deadlock-visualization">
                  <svg width="600" height="400" className="deadlock-graph">
                    {/* Renderizar conexiones de deadlock */}
                    {renderDeadlockConnections()}
                    
                    {/* Renderizar procesos */}
                    {processes.map(process => (
                      <g key={process.id} className="process-node">
                        <circle
                          cx={process.position.x + 30}
                          cy={process.position.y + 30}
                          r="35"
                          fill={process.color}
                          stroke={selectedProcess?.id === process.id ? '#f39c12' : '#2c3e50'}
                          strokeWidth={selectedProcess?.id === process.id ? "4" : "2"}
                          className={`process-circle ${process.status || ''}`}
                          onClick={() => selectProcess(process)}
                        />
                        
                        <text
                          x={process.position.x + 30}
                          y={process.position.y + 38}
                          textAnchor="middle"
                          fontSize="20"
                        >
                          {process.emoji}
                        </text>
                        
                        <text
                          x={process.position.x + 30}
                          y={process.position.y + 85}
                          textAnchor="middle"
                          fontSize="8"
                          fontFamily="'Press Start 2P', monospace"
                          fill="#2c3e50"
                        >
                          {process.id}
                        </text>
                        
                        {/* Indicador de prioridad */}
                        {process.priority && (
                          <text
                            x={process.position.x + 55}
                            y={process.position.y + 15}
                            fontSize="12"
                            fill={
                              process.priority === 'high' ? '#e74c3c' :
                              process.priority === 'medium' ? '#f39c12' : '#2ecc71'
                            }
                          >
                            {process.priority === 'high' ? '🔴' : 
                             process.priority === 'medium' ? '🟡' : '🟢'}
                          </text>
                        )}
                        
                        {/* Información de recursos */}
                        <text
                          x={process.position.x + 30}
                          y={process.position.y + 100}
                          textAnchor="middle"
                          fontSize="6"
                          fontFamily="'Press Start 2P', monospace"
                          fill="#2c3e50"
                        >
                          Tiene: {process.holds.join(', ')}
                        </text>
                        <text
                          x={process.position.x + 30}
                          y={process.position.y + 115}
                          textAnchor="middle"
                          fontSize="6"
                          fontFamily="'Press Start 2P', monospace"
                          fill="#e74c3c"
                        >
                          Espera: {process.waitsFor.join(', ')}
                        </text>
                      </g>
                    ))}
                    
                    {/* Renderizar recursos */}
                    {resources.map(resource => (
                      <g key={resource.id} className="resource-node">
                        <rect
                          x={resource.position.x}
                          y={resource.position.y}
                          width="50"
                          height="50"
                          fill={resource.color}
                          stroke="#2c3e50"
                          strokeWidth="2"
                          rx="5"
                          className="resource-rect"
                        />
                        
                        <text
                          x={resource.position.x + 25}
                          y={resource.position.y + 35}
                          textAnchor="middle"
                          fontSize="20"
                        >
                          {resource.emoji}
                        </text>
                        
                        <text
                          x={resource.position.x + 25}
                          y={resource.position.y + 70}
                          textAnchor="middle"
                          fontSize="6"
                          fontFamily="'Press Start 2P', monospace"
                          fill="#2c3e50"
                        >
                          {resource.id}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Controles de solución */}
                <div className="solution-controls">
                  <h5>🔧 Acciones para resolver deadlock:</h5>
                  <div className="action-buttons">
                    <button 
                      className="action-btn release"
                      onClick={() => attemptSolution('release_resource')}
                      disabled={!selectedProcess}
                    >
                      🔓 Liberar Recurso
                    </button>
                    <button 
                      className="action-btn preempt"
                      onClick={() => attemptSolution('preempt_process')}
                      disabled={!selectedProcess}
                    >
                      ⏹️ Interrumpir Proceso
                    </button>
                    <button 
                      className="action-btn priority"
                      onClick={() => attemptSolution('priority_inheritance')}
                      disabled={!selectedProcess}
                    >
                      ⬆️ Herencia de Prioridad
                    </button>
                  </div>
                  
                  {selectedProcess && (
                    <div className="selected-process-info">
                      <p>Proceso seleccionado: <strong>{selectedProcess.name}</strong></p>
                      <p>Recursos que tiene: <strong>{selectedProcess.holds.join(', ')}</strong></p>
                      <p>Recursos que espera: <strong>{selectedProcess.waitsFor.join(', ')}</strong></p>
                    </div>
                  )}
                </div>

                {/* Resultado de la solución */}
                {solutionResult && (
                  <div className={`solution-result ${solutionResult.success ? 'correct' : 'incorrect'}`}>
                    <div className="result-header">
                      <h5>
                        {solutionResult.success ? "✅ ¡Deadlock Resuelto!" : "❌ Solución Incorrecta"}
                      </h5>
                    </div>
                    
                    <div className="result-content">
                      <p><strong>Acción:</strong> {solutionResult.action}</p>
                      <p><strong>Proceso:</strong> {solutionResult.process}</p>
                      <p><strong>Resultado:</strong> {solutionResult.message}</p>
                      
                      {!solutionResult.success && solutionResult.hint && (
                        <div className="hint-box">
                          <p><strong>💡 {solutionResult.hint}</strong></p>
                        </div>
                      )}
                      
                      {solutionResult.success && (
                        <div className="success-animation">
                          <div className="freed-processes">
                            <span className="freed-bat">🦇✨</span>
                            <span className="freed-bat">🦇✨</span>
                            <span className="freed-bat">🦇✨</span>
                          </div>
                          <p>¡Los procesos murciélago están libres del deadlock!</p>
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
                <div className="freed-bat-final">🦇🆓✨</div>
                <div className="andy-victorious">🐿️🎉</div>
              </div>
              
              <div className="victory-dialog">
                <h4>🎉 ¡Victoria Total!</h4>
                <div className="dialog-bubble">
                  {getCurrentVillainDialog().map((line, index) => (
                    <p key={index} className="dialog-line">{line}</p>
                  ))}
                </div>
                
                <div className="victory-stats">
                  <p>🏆 Puntuación Final: <strong>{playerScore}</strong></p>
                  <p>⚔️ Deadlocks Resueltos: <strong>{challenges.length}/3</strong></p>
                  <p>🧠 Conocimiento SO: <strong>¡Maestro de Deadlocks!</strong></p>
                </div>
                
                <div className="victory-message">
                  <p>
                    <strong>¡Has demostrado que entiendes los deadlocks y cómo resolverlos!</strong>
                  </p>
                  <p>
                    El murciélago está libre y los procesos pueden ejecutarse sin bloqueos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel educativo */}
        <div className="education-panel">
          <h4>📚 Deadlocks en Sistemas Operativos</h4>
          <div className="deadlock-conditions">
            <h5>Condiciones para Deadlock:</h5>
            <ul>
              <li><strong>Exclusión Mutua:</strong> Recursos no compartibles</li>
              <li><strong>Hold and Wait:</strong> Procesos mantienen recursos y esperan otros</li>
              <li><strong>No Preemption:</strong> Recursos no pueden ser quitados forzosamente</li>
              <li><strong>Circular Wait:</strong> Cadena circular de espera de recursos</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .deadlock-boss-overlay {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #1a1a2e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
        }

        .deadlock-boss-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          width: 100%;
          height: 100%;
          max-height: 95vh;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
        }

        .puzzle-header {
          text-align: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .puzzle-header h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 0.3rem;
          color: #2c3e50;
        }

        .puzzle-header p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
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
          min-width: 220px;
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
          flex: 1;
          min-height: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 1rem;
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

        .trapped-bat {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .deadlock-circle {
          position: relative;
          width: 120px;
          height: 120px;
          border: 4px solid #e74c3c;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: deadlock-spin 3s linear infinite;
        }

        .trapped-processes {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        .trapped-process {
          font-size: 1.5rem;
          animation: struggle 1s ease-in-out infinite alternate;
        }

        .trapped-process:nth-child(2) { animation-delay: 0.2s; }
        .trapped-process:nth-child(3) { animation-delay: 0.4s; }
        .trapped-process:nth-child(4) { animation-delay: 0.6s; }

        .deadlock-label {
          margin-top: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #e74c3c;
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

        .description {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .deadlock-warning {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          padding: 1rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          border: 2px solid #e74c3c;
        }

        .deadlock-visualization {
          margin: 2rem 0;
          display: flex;
          justify-content: center;
        }

        .deadlock-graph {
          border: 2px solid #bdc3c7;
          border-radius: 10px;
          background: #f8f9fa;
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
        }

        .process-circle {
          cursor: pointer;
          transition: all 0.3s;
        }

        .process-circle:hover {
          transform: scale(1.1);
        }

        .process-circle.freed {
          animation: freedom-glow 1s ease-in-out infinite alternate;
        }

        .resource-rect {
          transition: all 0.3s;
        }

        .deadlock-connection {
          animation: deadlock-pulse 2s ease-in-out infinite;
        }

        .solution-controls {
          background: rgba(52, 152, 219, 0.1);
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .solution-controls h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: 150px;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.3s;
          color: white;
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn.release {
          background: #27ae60;
        }

        .action-btn.release:hover:not(:disabled) {
          background: #229954;
        }

        .action-btn.preempt {
          background: #e74c3c;
        }

        .action-btn.preempt:hover:not(:disabled) {
          background: #c0392b;
        }

        .action-btn.priority {
          background: #f39c12;
        }

        .action-btn.priority:hover:not(:disabled) {
          background: #e67e22;
        }

        .selected-process-info {
          background: rgba(241, 196, 15, 0.2);
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #f1c40f;
        }

        .selected-process-info p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .solution-result {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
        }

        .solution-result.correct {
          border: 3px solid #27ae60;
        }

        .solution-result.incorrect {
          border: 3px solid #e74c3c;
        }

        .result-header h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .result-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.8rem;
          line-height: 1.4;
        }

        .hint-box {
          background: rgba(52, 152, 219, 0.2);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          border-left: 4px solid #3498db;
        }

        .success-animation {
          text-align: center;
          margin-top: 1rem;
        }

        .freed-processes {
          margin-bottom: 1rem;
        }

        .freed-bat {
          font-size: 2rem;
          margin: 0 0.5rem;
          animation: freedom-dance 1s ease-in-out infinite alternate;
        }

        .freed-bat:nth-child(2) { animation-delay: 0.2s; }
        .freed-bat:nth-child(3) { animation-delay: 0.4s; }

        .success-animation p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #27ae60;
        }

        .victory-animation {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 4rem;
        }

        .freed-bat-final {
          animation: final-freedom 2s ease-out infinite;
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
          background: rgba(52, 152, 219, 0.2);
          padding: 1rem;
          border-radius: 10px;
          margin-top: 2rem;
        }

        .education-panel h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          color: #3498db;
        }

        .deadlock-conditions h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.8rem;
          color: #f39c12;
        }

        .deadlock-conditions ul {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
        }

        .deadlock-conditions li {
          margin-bottom: 0.5rem;
        }

        @keyframes deadlock-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes struggle {
          0% { transform: scale(1) rotate(-5deg); }
          100% { transform: scale(0.9) rotate(5deg); }
        }

        @keyframes deadlock-pulse {
          0%, 100% { stroke-opacity: 1; }
          50% { stroke-opacity: 0.3; }
        }

        @keyframes freedom-glow {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.5) drop-shadow(0 0 10px #27ae60); }
        }

        @keyframes freedom-dance {
          0% { transform: translateY(0) rotate(-10deg); }
          100% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes final-freedom {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.2); }
        }

        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
          }
          
          .scene-setup {
            flex-direction: column;
            gap: 2rem;
          }
          
          .deadlock-graph {
            width: 100%;
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default DeadlockBossPuzzle;
