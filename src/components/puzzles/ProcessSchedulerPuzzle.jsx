import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const ProcessSchedulerPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del puzzle
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, completed
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [processQueue, setProcessQueue] = useState([]);
  const [executionQueue, setExecutionQueue] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [score, setScore] = useState(0);

  // Procesos representados como murciélagos
  const processes = [
    { id: 'P1', name: 'Murciélago A', burstTime: 2, priority: 3, emoji: '🦇', color: '#e74c3c' },
    { id: 'P2', name: 'Murciélago B', burstTime: 6, priority: 1, emoji: '🦇', color: '#3498db' },
    { id: 'P3', name: 'Murciélago C', burstTime: 4, priority: 2, emoji: '🦇', color: '#f39c12' },
    { id: 'P4', name: 'Murciélago D', burstTime: 1, priority: 4, emoji: '🦇', color: '#2ecc71' },
    { id: 'P5', name: 'Murciélago E', burstTime: 3, priority: 1, emoji: '🦇', color: '#9b59b6' }
  ];

  // Desafíos del scheduler
  const challenges = [
    {
      id: 1,
      title: "FIFO (First In, First Out)",
      description: "Los procesos se ejecutan en el orden que llegan",
      processes: [processes[0], processes[1], processes[2]],
      correctOrder: ['P1', 'P2', 'P3'],
      algorithm: 'FIFO',
      explanation: "En FIFO, el primer proceso en llegar es el primero en ejecutarse"
    },
    {
      id: 2,
      title: "SJF (Shortest Job First)",
      description: "Se ejecuta primero el proceso con menor tiempo de CPU",
      processes: [processes[0], processes[3], processes[4]],
      correctOrder: ['P4', 'P1', 'P5'], // Ordenados por burstTime: 1, 2, 3
      algorithm: 'SJF',
      explanation: "SJF minimiza el tiempo de espera promedio ejecutando primero los trabajos más cortos"
    },
    {
      id: 3,
      title: "Priority Scheduling",
      description: "Se ejecuta primero el proceso con mayor prioridad (menor número = mayor prioridad)",
      processes: [processes[1], processes[2], processes[4]],
      correctOrder: ['P2', 'P5', 'P3'], // Ordenados por prioridad: 1, 1, 2
      algorithm: 'Priority',
      explanation: "En Priority Scheduling, los procesos con mayor prioridad (menor número) se ejecutan primero"
    }
  ];

  // Inicializar desafío
  useEffect(() => {
    if (gamePhase === 'playing') {
      const challenge = challenges[currentChallenge - 1];
      setProcessQueue([...challenge.processes]);
      setExecutionQueue([]);
      setSelectedAlgorithm(null);
      setExecutionResult(null);
    }
  }, [currentChallenge, gamePhase]);

  // Comenzar el juego
  const startGame = () => {
    setGamePhase('playing');
  };

  // Manejar arrastre de proceso
  const handleDragStart = (e, process) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(process));
  };

  // Manejar soltar proceso en la cola de ejecución
  const handleDrop = (e) => {
    e.preventDefault();
    const processData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Agregar a la cola de ejecución si no está ya
    if (!executionQueue.find(p => p.id === processData.id)) {
      setExecutionQueue(prev => [...prev, processData]);
      setProcessQueue(prev => prev.filter(p => p.id !== processData.id));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Remover proceso de la cola de ejecución
  const removeFromExecutionQueue = (processId) => {
    const process = executionQueue.find(p => p.id === processId);
    if (process) {
      setExecutionQueue(prev => prev.filter(p => p.id !== processId));
      setProcessQueue(prev => [...prev, process]);
    }
  };

  // Ejecutar algoritmo seleccionado
  const executeScheduler = () => {
    const challenge = challenges[currentChallenge - 1];
    const userOrder = executionQueue.map(p => p.id);
    const correctOrder = challenge.correctOrder;
    
    setIsExecuting(true);
    
    // Simular ejecución
    setTimeout(() => {
      const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
      
      setExecutionResult({
        isCorrect,
        userOrder,
        correctOrder,
        algorithm: challenge.algorithm,
        explanation: challenge.explanation
      });
      
      if (isCorrect) {
        const points = 150 * currentChallenge;
        setScore(prev => prev + points);
        updateScore(points);
        
        setTimeout(() => {
          if (currentChallenge >= challenges.length) {
            setGamePhase('completed');
            setTimeout(() => onComplete(), 3000);
          } else {
            setCurrentChallenge(prev => prev + 1);
            setIsExecuting(false);
            setExecutionResult(null);
          }
        }, 4000);
      } else {
        setTimeout(() => {
          setIsExecuting(false);
          setExecutionResult(null);
          // Resetear para intentar de nuevo
          setProcessQueue([...challenge.processes]);
          setExecutionQueue([]);
        }, 4000);
      }
    }, 2000);
  };

  // Obtener desafío actual
  const getCurrentChallenge = () => {
    return challenges[currentChallenge - 1];
  };

  return (
    <div className="scheduler-puzzle-overlay">
      <div className="scheduler-puzzle-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 1: La Cola de Procesos</h3>
          <p>Organiza los murciélagos según el algoritmo de planificación</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Puntuación */}
        <div className="score-display">
          🏆 Puntuación: {score}
        </div>

        {gamePhase === 'intro' && (
          <div className="intro-screen">
            <div className="cave-scene">
              <div className="cave-background">🕳️🌑✨</div>
              <div className="trapped-processes">
                <div className="process-chaos">
                  <span className="chaotic-bat">🦇</span>
                  <span className="chaotic-bat">🦇</span>
                  <span className="chaotic-bat">🦇</span>
                  <span className="chaotic-bat">🦇</span>
                </div>
                <p>¡Los procesos están en caos sin un planificador!</p>
              </div>
            </div>
            
            <div className="intro-content">
              <h4>🎯 Tu Misión</h4>
              <p>Los murciélagos representan procesos esperando ser ejecutados por la CPU.</p>
              <p>Debes organizarlos según diferentes algoritmos de planificación.</p>
              
              <div className="scheduler-info">
                <h5>📚 Algoritmos que aprenderás:</h5>
                <ul>
                  <li><strong>FIFO:</strong> Primero en llegar, primero en ser atendido</li>
                  <li><strong>SJF:</strong> El trabajo más corto primero</li>
                  <li><strong>Priority:</strong> Mayor prioridad primero</li>
                </ul>
              </div>
              
              <button className="start-btn" onClick={startGame}>
                🚀 Comenzar Planificación
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'playing' && (
          <div className="playing-area">
            <div className="challenge-info">
              <h4>🌊 Desafío {currentChallenge}/3: {getCurrentChallenge().title}</h4>
              <p>{getCurrentChallenge().description}</p>
            </div>

            <div className="scheduler-workspace">
              {/* Cola de procesos disponibles */}
              <div className="process-pool">
                <h5>🦇 Procesos Esperando</h5>
                <div className="processes-container">
                  {processQueue.map(process => (
                    <div
                      key={process.id}
                      className="process-bat"
                      draggable
                      onDragStart={(e) => handleDragStart(e, process)}
                      style={{ backgroundColor: process.color }}
                    >
                      <div className="bat-emoji">{process.emoji}</div>
                      <div className="process-info">
                        <div className="process-name">{process.name}</div>
                        <div className="process-stats">
                          <span>⏱️ {process.burstTime}s</span>
                          <span>🔥 P{process.priority}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cola de ejecución */}
              <div className="execution-queue">
                <h5>⚡ Cola de Ejecución (CPU)</h5>
                <div 
                  className="queue-container"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {executionQueue.length === 0 ? (
                    <div className="empty-queue">
                      <div className="cpu-icon">🖥️</div>
                      <p>Arrastra los murciélagos aquí</p>
                    </div>
                  ) : (
                    <div className="queue-processes">
                      {executionQueue.map((process, index) => (
                        <div
                          key={process.id}
                          className="queued-process"
                          style={{ backgroundColor: process.color }}
                          onClick={() => removeFromExecutionQueue(process.id)}
                        >
                          <div className="queue-position">{index + 1}</div>
                          <div className="bat-emoji">{process.emoji}</div>
                          <div className="process-info">
                            <div className="process-name">{process.name}</div>
                            <div className="process-stats">
                              <span>⏱️ {process.burstTime}s</span>
                              <span>🔥 P{process.priority}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="controls">
              <button 
                className="execute-btn"
                onClick={executeScheduler}
                disabled={executionQueue.length === 0 || isExecuting}
              >
                {isExecuting ? '⚡ Ejecutando...' : '🚀 Ejecutar Planificador'}
              </button>
            </div>

            {/* Resultado de ejecución */}
            {executionResult && (
              <div className={`execution-result ${executionResult.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-header">
                  <h5>
                    {executionResult.isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
                  </h5>
                </div>
                
                <div className="result-content">
                  <div className="order-comparison">
                    <div className="user-order">
                      <h6>Tu orden:</h6>
                      <div className="order-list">
                        {executionResult.userOrder.map((processId, index) => (
                          <span key={processId} className="order-item">
                            {processId}{index < executionResult.userOrder.length - 1 ? ' → ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="correct-order">
                      <h6>Orden correcto ({executionResult.algorithm}):</h6>
                      <div className="order-list">
                        {executionResult.correctOrder.map((processId, index) => (
                          <span key={processId} className="order-item correct">
                            {processId}{index < executionResult.correctOrder.length - 1 ? ' → ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="explanation">
                    <p><strong>💡 Explicación:</strong> {executionResult.explanation}</p>
                  </div>
                  
                  {executionResult.isCorrect && (
                    <div className="success-animation">
                      <div className="flying-bats">
                        <span className="flying-bat">🦇</span>
                        <span className="flying-bat">🦇</span>
                        <span className="flying-bat">🦇</span>
                      </div>
                      <p>¡Los murciélagos vuelan en armonía hacia la CPU!</p>
                    </div>
                  )}
                  
                  {!executionResult.isCorrect && (
                    <div className="failure-animation">
                      <div className="colliding-bats">
                        <span className="colliding-bat">🦇💥</span>
                        <span className="colliding-bat">🦇💥</span>
                      </div>
                      <p>Los murciélagos chocan entre sí. ¡Inténtalo de nuevo!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {gamePhase === 'completed' && (
          <div className="completion-screen">
            <div className="completion-animation">
              <div className="liberated-cpu">🖥️✨</div>
              <div className="happy-bats">
                <span className="happy-bat">🦇😊</span>
                <span className="happy-bat">🦇😊</span>
                <span className="happy-bat">🦇😊</span>
                <span className="happy-bat">🦇😊</span>
              </div>
            </div>
            
            <div className="completion-message">
              <h4>🎉 ¡Planificación Completada!</h4>
              <p>Has dominado los algoritmos de planificación de procesos.</p>
              <p>Los murciélagos ahora pueden volar ordenadamente hacia la CPU.</p>
              
              <div className="final-stats">
                <p>🏆 Puntuación Final: <strong>{score}</strong></p>
                <p>🧠 Algoritmos Dominados: <strong>3/3</strong></p>
                <p>⚡ Nivel de CPU: <strong>¡Experto!</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Panel educativo */}
        <div className="education-panel">
          <h4>📚 Planificación de Procesos</h4>
          <p>
            El planificador del SO decide qué proceso debe usar la CPU en cada momento.
            Diferentes algoritmos optimizan para distintos objetivos: tiempo de respuesta,
            throughput, o fairness.
          </p>
        </div>
      </div>

      <style>{`
        .scheduler-puzzle-overlay {
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

        .scheduler-puzzle-container {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          padding: 2rem;
          border-radius: 15px;
          max-width: 1100px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 3px solid #f39c12;
        }

        .puzzle-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .puzzle-header h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #f39c12;
        }

        .puzzle-header p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #ecf0f1;
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

        .score-display {
          text-align: center;
          background: #f39c12;
          color: white;
          padding: 0.8rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 2rem;
        }

        .intro-screen {
          text-align: center;
        }

        .cave-scene {
          background: rgba(0, 0, 0, 0.8);
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
        }

        .cave-background {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .trapped-processes {
          margin-bottom: 1rem;
        }

        .process-chaos {
          margin-bottom: 1rem;
        }

        .chaotic-bat {
          font-size: 2rem;
          margin: 0 0.5rem;
          animation: chaotic-movement 1s ease-in-out infinite;
        }

        .chaotic-bat:nth-child(2) { animation-delay: 0.2s; }
        .chaotic-bat:nth-child(3) { animation-delay: 0.4s; }
        .chaotic-bat:nth-child(4) { animation-delay: 0.6s; }

        .intro-content h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #3498db;
        }

        .intro-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .scheduler-info {
          background: rgba(52, 152, 219, 0.2);
          padding: 1rem;
          border-radius: 10px;
          margin: 1rem 0;
          text-align: left;
        }

        .scheduler-info h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.8rem;
          color: #3498db;
        }

        .scheduler-info ul {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
        }

        .scheduler-info li {
          margin-bottom: 0.5rem;
        }

        .start-btn {
          background: #27ae60;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .start-btn:hover {
          background: #229954;
          transform: translateY(-2px);
        }

        .playing-area {
          width: 100%;
        }

        .challenge-info {
          text-align: center;
          background: rgba(52, 152, 219, 0.2);
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .challenge-info h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: #3498db;
        }

        .challenge-info p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          line-height: 1.4;
        }

        .scheduler-workspace {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .process-pool,
        .execution-queue {
          flex: 1;
          background: rgba(44, 62, 80, 0.8);
          padding: 1rem;
          border-radius: 10px;
        }

        .process-pool h5,
        .execution-queue h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
          color: #f39c12;
          text-align: center;
        }

        .processes-container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .process-bat {
          padding: 0.8rem;
          border-radius: 8px;
          cursor: grab;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border: 2px solid transparent;
        }

        .process-bat:hover {
          transform: translateY(-2px);
          border-color: #f39c12;
        }

        .process-bat:active {
          cursor: grabbing;
        }

        .bat-emoji {
          font-size: 2rem;
        }

        .process-info {
          flex: 1;
        }

        .process-name {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.3rem;
          color: white;
        }

        .process-stats {
          display: flex;
          gap: 0.8rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          color: #ecf0f1;
        }

        .queue-container {
          min-height: 300px;
          border: 2px dashed #7f8c8d;
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .empty-queue {
          text-align: center;
          color: #7f8c8d;
        }

        .cpu-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-queue p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
        }

        .queue-processes {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .queued-process {
          padding: 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border: 2px solid #27ae60;
          position: relative;
        }

        .queued-process:hover {
          border-color: #e74c3c;
        }

        .queue-position {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #27ae60;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
        }

        .controls {
          text-align: center;
          margin-bottom: 2rem;
        }

        .execute-btn {
          background: #e74c3c;
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
          background: #c0392b;
          transform: translateY(-2px);
        }

        .execute-btn:disabled {
          background: #7f8c8d;
          cursor: not-allowed;
        }

        .execution-result {
          background: rgba(0, 0, 0, 0.8);
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
        }

        .execution-result.correct {
          border: 3px solid #27ae60;
        }

        .execution-result.incorrect {
          border: 3px solid #e74c3c;
        }

        .result-header h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .order-comparison {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .user-order,
        .correct-order {
          flex: 1;
        }

        .user-order h6,
        .correct-order h6 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
          color: #f39c12;
        }

        .order-list {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.8rem;
          border-radius: 8px;
        }

        .order-item {
          color: #ecf0f1;
        }

        .order-item.correct {
          color: #27ae60;
        }

        .explanation {
          background: rgba(52, 152, 219, 0.2);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .explanation p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.4;
          margin: 0;
        }

        .success-animation,
        .failure-animation {
          text-align: center;
          margin-top: 1rem;
        }

        .flying-bats,
        .colliding-bats {
          margin-bottom: 1rem;
        }

        .flying-bat {
          font-size: 2rem;
          margin: 0 0.5rem;
          animation: fly-to-cpu 2s ease-in-out infinite;
        }

        .flying-bat:nth-child(2) { animation-delay: 0.3s; }
        .flying-bat:nth-child(3) { animation-delay: 0.6s; }

        .colliding-bat {
          font-size: 2rem;
          margin: 0 0.5rem;
          animation: collision 1s ease-in-out infinite;
        }

        .colliding-bat:nth-child(2) { animation-delay: 0.5s; }

        .success-animation p,
        .failure-animation p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #ecf0f1;
        }

        .completion-screen {
          text-align: center;
        }

        .completion-animation {
          margin-bottom: 2rem;
        }

        .liberated-cpu {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: cpu-glow 1s ease-in-out infinite alternate;
        }

        .happy-bats {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .happy-bat {
          font-size: 2.5rem;
          animation: happy-bounce 1s ease-in-out infinite alternate;
        }

        .happy-bat:nth-child(2) { animation-delay: 0.2s; }
        .happy-bat:nth-child(3) { animation-delay: 0.4s; }
        .happy-bat:nth-child(4) { animation-delay: 0.6s; }

        .completion-message h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #27ae60;
        }

        .completion-message p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .final-stats {
          background: rgba(46, 204, 113, 0.2);
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
        }

        .final-stats p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.5rem;
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
          margin-bottom: 0.8rem;
          color: #3498db;
        }

        .education-panel p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
        }

        @keyframes chaotic-movement {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-10px) rotate(-10deg); }
          50% { transform: translateX(10px) rotate(10deg); }
          75% { transform: translateX(-5px) rotate(-5deg); }
        }

        @keyframes fly-to-cpu {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-10px); }
        }

        @keyframes collision {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(0.8) rotate(180deg); }
        }

        @keyframes cpu-glow {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.3) drop-shadow(0 0 20px #f39c12); }
        }

        @keyframes happy-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-15px); }
        }

        @media (max-width: 768px) {
          .scheduler-workspace {
            flex-direction: column;
            gap: 1rem;
          }
          
          .order-comparison {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProcessSchedulerPuzzle;
