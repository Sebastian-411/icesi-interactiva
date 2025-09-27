import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const MemoryManagementPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del puzzle
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, completed
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [memoryBlocks, setMemoryBlocks] = useState([]);
  const [waitingProcesses, setWaitingProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [allocationResult, setAllocationResult] = useState(null);
  const [score, setScore] = useState(0);
  const [fragmentationLevel, setFragmentationLevel] = useState(0);

  // Algoritmos de asignación de memoria
  const algorithms = {
    'first-fit': {
      name: 'First Fit',
      description: 'Asigna el proceso al primer bloque libre que sea suficientemente grande',
      color: '#3498db'
    },
    'best-fit': {
      name: 'Best Fit',
      description: 'Asigna el proceso al bloque libre más pequeño que sea suficientemente grande',
      color: '#27ae60'
    },
    'worst-fit': {
      name: 'Worst Fit',
      description: 'Asigna el proceso al bloque libre más grande disponible',
      color: '#e74c3c'
    }
  };

  // Desafíos de memoria
  const challenges = [
    {
      id: 1,
      title: "Tutorial Básico",
      description: "¡Aprende a asignar memoria! Usa cualquier algoritmo",
      memorySize: 400,
      initialAllocations: [
        { start: 0, size: 100, allocated: true, processId: 'P0' },
        { start: 100, size: 150, allocated: false },
        { start: 250, size: 150, allocated: false }
      ],
      processes: [
        { id: 'PA', name: 'Murciélago A', size: 50, color: '#f39c12', emoji: '🦇' }
      ],
      targetAlgorithm: 'first-fit',
      maxFragmentation: 100
    },
    {
      id: 2,
      title: "Optimización de Memoria",
      description: "Usa Best Fit para minimizar fragmentación",
      memorySize: 800,
      initialAllocations: [
        { start: 0, size: 80, allocated: true, processId: 'P0' },
        { start: 80, size: 120, allocated: false },
        { start: 200, size: 100, allocated: true, processId: 'P1' },
        { start: 300, size: 50, allocated: false },
        { start: 350, size: 200, allocated: false },
        { start: 550, size: 100, allocated: true, processId: 'P2' },
        { start: 650, size: 150, allocated: false }
      ],
      processes: [
        { id: 'PC', name: 'Proceso C', size: 45, color: '#2ecc71', emoji: '🦇' },
        { id: 'PD', name: 'Proceso D', size: 110, color: '#e67e22', emoji: '🦇' },
        { id: 'PE', name: 'Proceso E', size: 140, color: '#1abc9c', emoji: '🦇' }
      ],
      targetAlgorithm: 'best-fit',
      maxFragmentation: 20
    },
    {
      id: 3,
      title: "Desafío Final",
      description: "¡Demuestra tu dominio de la gestión de memoria!",
      memorySize: 1000,
      initialAllocations: [
        { start: 0, size: 100, allocated: true, processId: 'P0' },
        { start: 100, size: 150, allocated: false },
        { start: 250, size: 100, allocated: true, processId: 'P1' },
        { start: 350, size: 200, allocated: false },
        { start: 550, size: 150, allocated: true, processId: 'P2' },
        { start: 700, size: 300, allocated: false }
      ],
      processes: [
        { id: 'PF', name: 'Murciélago Pequeño', size: 80, color: '#34495e', emoji: '🦇' },
        { id: 'PG', name: 'Murciélago Mediano', size: 120, color: '#8e44ad', emoji: '🦇' },
        { id: 'PH', name: 'Murciélago Grande', size: 180, color: '#d35400', emoji: '🦇' }
      ],
      targetAlgorithm: 'best-fit',
      maxFragmentation: 25
    }
  ];

  // Inicializar desafío
  useEffect(() => {
    if (gamePhase === 'playing') {
      const challenge = challenges[currentChallenge - 1];
      setMemoryBlocks([...challenge.initialAllocations]);
      setWaitingProcesses([...challenge.processes]);
      setSelectedAlgorithm(null);
      setSelectedProcess(null);
      setAllocationResult(null);
      calculateFragmentation(challenge.initialAllocations);
    }
  }, [currentChallenge, gamePhase]);

  // Calcular fragmentación
  const calculateFragmentation = (blocks) => {
    const freeBlocks = blocks.filter(block => !block.allocated);
    const totalFreeSpace = freeBlocks.reduce((sum, block) => sum + block.size, 0);
    const largestFreeBlock = Math.max(...freeBlocks.map(block => block.size), 0);
    
    if (totalFreeSpace === 0) {
      setFragmentationLevel(0);
      return;
    }
    
    const fragmentation = ((totalFreeSpace - largestFreeBlock) / totalFreeSpace) * 100;
    setFragmentationLevel(Math.round(fragmentation));
  };

  // Comenzar el juego
  const startGame = () => {
    console.log('🚀 Iniciando juego de memoria...');
    setGamePhase('playing');
    console.log('✅ GamePhase cambiado a playing');
  };

  // Seleccionar algoritmo
  const selectAlgorithm = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setAllocationResult(null);
  };

  // Seleccionar proceso
  const selectProcess = (process) => {
    setSelectedProcess(process);
  };

  // Asignar proceso usando algoritmo seleccionado
  const allocateProcess = () => {
    if (!selectedAlgorithm || !selectedProcess) return;

    const freeBlocks = memoryBlocks
      .map((block, index) => ({ ...block, index }))
      .filter(block => !block.allocated && block.size >= selectedProcess.size);

    if (freeBlocks.length === 0) {
      setAllocationResult({
        success: false,
        message: 'No hay bloques libres suficientemente grandes para este proceso. Intenta con un algoritmo diferente o reinicia el desafío.',
        algorithm: selectedAlgorithm
      });
      return;
    }

    let targetBlock;
    
    switch (selectedAlgorithm) {
      case 'first-fit':
        targetBlock = freeBlocks[0]; // Primer bloque que quepa
        break;
      case 'best-fit':
        targetBlock = freeBlocks.reduce((best, current) => 
          current.size < best.size ? current : best
        );
        break;
      case 'worst-fit':
        targetBlock = freeBlocks.reduce((worst, current) => 
          current.size > worst.size ? current : worst
        );
        break;
      default:
        return;
    }

    // Crear nuevos bloques después de la asignación
    const newBlocks = [...memoryBlocks];
    const blockIndex = targetBlock.index;
    
    // Reemplazar el bloque libre con el proceso asignado
    newBlocks[blockIndex] = {
      start: targetBlock.start,
      size: selectedProcess.size,
      allocated: true,
      processId: selectedProcess.id,
      processName: selectedProcess.name,
      color: selectedProcess.color
    };
    
    // Si queda espacio, crear un nuevo bloque libre
    const remainingSize = targetBlock.size - selectedProcess.size;
    if (remainingSize > 0) {
      newBlocks.splice(blockIndex + 1, 0, {
        start: targetBlock.start + selectedProcess.size,
        size: remainingSize,
        allocated: false
      });
    }

    setMemoryBlocks(newBlocks);
    const remainingProcesses = waitingProcesses.filter(p => p.id !== selectedProcess.id);
    setWaitingProcesses(remainingProcesses);
    
    calculateFragmentation(newBlocks);
    
    const challenge = challenges[currentChallenge - 1];
    const isOptimal = selectedAlgorithm === challenge.targetAlgorithm;
    const points = isOptimal ? 200 : 100;
    
    setScore(prev => prev + points);
    updateScore(points);
    
    setAllocationResult({
      success: true,
      message: `Proceso ${selectedProcess.name} asignado exitosamente`,
      algorithm: selectedAlgorithm,
      isOptimal,
      fragmentationLevel
    });

    setSelectedProcess(null);
    
    // Verificar si el desafío está completo
    setTimeout(() => {
      checkChallengeCompletion(newBlocks, remainingProcesses);
    }, 2000);
  };

  // Verificar si el desafío está completo
  const checkChallengeCompletion = (blocks, remainingProcesses) => {
    const challenge = challenges[currentChallenge - 1];
    
    // Usar el parámetro remainingProcesses en lugar del estado que puede no haberse actualizado
    if (remainingProcesses.length === 0) {
      // Calcular fragmentación con los bloques actualizados
      const freeBlocks = blocks.filter(block => !block.allocated);
      const totalFreeSpace = freeBlocks.reduce((sum, block) => sum + block.size, 0);
      const largestFreeBlock = Math.max(...freeBlocks.map(block => block.size), 0);
      
      let currentFragmentation = 0;
      if (totalFreeSpace > 0) {
        currentFragmentation = ((totalFreeSpace - largestFreeBlock) / totalFreeSpace) * 100;
      }
      currentFragmentation = Math.round(currentFragmentation);
      
      setFragmentationLevel(currentFragmentation);
      
      // Para el primer nivel, ser más permisivo
      const isFirstLevel = currentChallenge === 1;
      const fragmentationOk = isFirstLevel ? true : (currentFragmentation <= challenge.maxFragmentation);
      
      if (fragmentationOk) {
        // Desafío completado exitosamente
        setAllocationResult(prev => ({
          ...prev,
          success: true,
          message: `¡Nivel completado! Fragmentación final: ${currentFragmentation}%`,
          fragmentationLevel: currentFragmentation
        }));
        
        setTimeout(() => {
          if (currentChallenge >= challenges.length) {
            setGamePhase('completed');
            setTimeout(() => onComplete(), 3000);
          } else {
            setCurrentChallenge(prev => prev + 1);
            setAllocationResult(null);
          }
        }, 2000);
      } else {
        // Fragmentación demasiado alta, mostrar mensaje
        setAllocationResult(prev => ({
          ...prev,
          success: false,
          message: `Fragmentación demasiado alta (${currentFragmentation}%). Objetivo: ≤${challenge.maxFragmentation}%. Intenta con un algoritmo diferente.`,
          fragmentationLevel: currentFragmentation
        }));
      }
    }
  };

  // Obtener desafío actual
  const getCurrentChallenge = () => {
    return challenges[currentChallenge - 1];
  };

  // Reiniciar el desafío actual
  const restartCurrentChallenge = () => {
    const challenge = getCurrentChallenge();
    setMemoryBlocks([...challenge.initialAllocations]);
    setWaitingProcesses([...challenge.processes]);
    setSelectedAlgorithm(null);
    setSelectedProcess(null);
    setAllocationResult(null);
    setFragmentationLevel(0);
  };

  // Renderizar bloque de memoria
  const renderMemoryBlock = (block, index) => {
    const widthPercentage = (block.size / getCurrentChallenge().memorySize) * 100;
    
    return (
      <div
        key={index}
        className={`memory-block ${block.allocated ? 'allocated' : 'free'}`}
        style={{
          width: `${widthPercentage}%`,
          backgroundColor: block.allocated ? block.color : '#ecf0f1',
          border: block.allocated ? '2px solid #2c3e50' : '2px dashed #7f8c8d'
        }}
        title={`${block.allocated ? `${block.processName} (${block.processId})` : 'Libre'} - ${block.size} KB`}
      >
        <div className="block-info">
          <div className="block-size">{block.size}KB</div>
          {block.allocated && (
            <div className="block-process">
              <span className="process-emoji">🦇</span>
              <span className="process-id">{block.processId}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="memory-puzzle-overlay">
      <div className="memory-puzzle-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 2: La Memoria Encantada</h3>
          <p>Asigna procesos en memoria usando diferentes algoritmos</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Puntuación y fragmentación */}
        <div className="stats-display">
          <div className="score-stat">🏆 Puntuación: {score}</div>
          <div className="fragmentation-stat">
            📊 Fragmentación: {fragmentationLevel}%
            <div className={`fragmentation-indicator ${fragmentationLevel > 25 ? 'high' : fragmentationLevel > 15 ? 'medium' : 'low'}`}>
              <div className="fragmentation-bar" style={{ width: `${fragmentationLevel}%` }}></div>
            </div>
          </div>
        </div>

        {gamePhase === 'intro' && (
          <div className="intro-screen">
            <div className="intro-content">
              <h4>🎯 ¿Cómo Jugar?</h4>
              <div className="tutorial-steps">
                <div className="tutorial-step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <h5>Selecciona un Algoritmo</h5>
                    <p>Elige cómo quieres asignar memoria: First Fit, Best Fit o Worst Fit</p>
                  </div>
                </div>
                <div className="tutorial-step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <h5>Selecciona un Proceso</h5>
                    <p>Haz clic en un murciélago (proceso) que quieras colocar en memoria</p>
                  </div>
                </div>
                <div className="tutorial-step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <h5>Asignar Proceso</h5>
                    <p>Haz clic en "Asignar Proceso" - el algoritmo decidirá dónde colocarlo</p>
                  </div>
                </div>
                <div className="tutorial-step">
                  <span className="step-number">4</span>
                  <div className="step-content">
                    <h5>Objetivo</h5>
                    <p>Asigna TODOS los procesos manteniendo la fragmentación baja (&lt;30%)</p>
                  </div>
                </div>
              </div>
              
              <div className="algorithms-info">
                <h5>📚 Algoritmos Explicados:</h5>
                <div className="algorithm-cards">
                  <div className="algorithm-card" style={{ borderColor: '#3498db' }}>
                    <h6 style={{ color: '#3498db' }}>First Fit</h6>
                    <p>🎯 Usa el PRIMER espacio libre que encuentre</p>
                    <p>✅ Rápido | ❌ Puede desperdiciar espacio</p>
                  </div>
                  <div className="algorithm-card" style={{ borderColor: '#27ae60' }}>
                    <h6 style={{ color: '#27ae60' }}>Best Fit</h6>
                    <p>🎯 Usa el espacio libre MÁS PEQUEÑO que quepa</p>
                    <p>✅ Menos desperdicio | ❌ Más lento</p>
                  </div>
                  <div className="algorithm-card" style={{ borderColor: '#e74c3c' }}>
                    <h6 style={{ color: '#e74c3c' }}>Worst Fit</h6>
                    <p>🎯 Usa el espacio libre MÁS GRANDE</p>
                    <p>✅ Deja espacios grandes | ❌ Mucho desperdicio</p>
                  </div>
                </div>
              </div>
              
              <div className="key-concept">
                <h5>🔑 Concepto Clave: Fragmentación</h5>
                <p>La fragmentación mide cuánto espacio de memoria se desperdicia en pequeños huecos que no se pueden usar. ¡Mantenla baja!</p>
              </div>
              
              <button 
                className="start-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🖱️ Botón clickeado');
                  startGame();
                }}
                onMouseDown={(e) => {
                  console.log('🖱️ Mouse down en botón');
                }}
              >
                🚀 ¡Entendido! Comenzar
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'playing' && (
          <div className="playing-area">
            <div className="challenge-info">
              <h4>🌊 Desafío {currentChallenge}/3: {getCurrentChallenge().title}</h4>
              <p>{getCurrentChallenge().description}</p>
              <div className="objective-box">
                <p><strong>🎯 OBJETIVO:</strong></p>
                <p>✅ Asignar TODOS los murciélagos en memoria</p>
                {currentChallenge === 1 ? (
                  <p>✅ <em>Nivel de práctica - ¡Usa cualquier algoritmo!</em></p>
                ) : (
                  <p>✅ Mantener fragmentación ≤ {getCurrentChallenge().maxFragmentation}%</p>
                )}
                <p>💡 <em>Algoritmo recomendado: {algorithms[getCurrentChallenge().targetAlgorithm].name}</em></p>
              </div>
            </div>

            {/* Visualización de memoria */}
            <div className="memory-visualization">
              <h5>💾 Memoria del Sistema ({getCurrentChallenge().memorySize} KB)</h5>
              <div className="memory-blocks-container">
                {memoryBlocks.map((block, index) => renderMemoryBlock(block, index))}
              </div>
              <div className="memory-scale">
                <span>0 KB</span>
                <span>{getCurrentChallenge().memorySize} KB</span>
              </div>
            </div>

            {/* Algoritmos disponibles */}
            <div className="algorithm-selector">
              <h5>🧠 Selecciona Algoritmo:</h5>
              <div className="algorithm-buttons">
                {Object.entries(algorithms).map(([key, algo]) => (
                  <button
                    key={key}
                    className={`algorithm-btn ${selectedAlgorithm === key ? 'selected' : ''}`}
                    style={{ 
                      borderColor: algo.color,
                      backgroundColor: selectedAlgorithm === key ? algo.color : 'transparent',
                      color: selectedAlgorithm === key ? 'white' : algo.color
                    }}
                    onClick={() => selectAlgorithm(key)}
                  >
                    <div className="algo-name">{algo.name}</div>
                    <div className="algo-desc">{algo.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Procesos esperando */}
            <div className="waiting-processes">
              <h5>🦇 Procesos Esperando:</h5>
              <div className="process-list">
                {waitingProcesses.map(process => (
                  <div
                    key={process.id}
                    className={`waiting-process ${selectedProcess?.id === process.id ? 'selected' : ''}`}
                    style={{ backgroundColor: process.color }}
                    onClick={() => selectProcess(process)}
                  >
                    <div className="process-emoji">{process.emoji}</div>
                    <div className="process-details">
                      <div className="process-name">{process.name}</div>
                      <div className="process-size">{process.size} KB</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles */}
            <div className="controls">
              <div className="control-instructions">
                {!selectedAlgorithm && !selectedProcess && (
                  <p className="instruction-text">
                    👆 <strong>Paso 1:</strong> Selecciona un algoritmo de arriba
                  </p>
                )}
                {selectedAlgorithm && !selectedProcess && (
                  <p className="instruction-text">
                    👆 <strong>Paso 2:</strong> Selecciona un murciélago (proceso) de arriba
                  </p>
                )}
                {selectedAlgorithm && selectedProcess && (
                  <p className="instruction-text">
                    👇 <strong>Paso 3:</strong> ¡Haz clic en "Asignar Proceso"!
                  </p>
                )}
              </div>
              
              <button 
                className="allocate-btn"
                onClick={allocateProcess}
                disabled={!selectedAlgorithm || !selectedProcess}
              >
                {!selectedAlgorithm ? '⚠️ Selecciona Algoritmo' : 
                 !selectedProcess ? '⚠️ Selecciona Proceso' : 
                 '🔧 Asignar Proceso'}
              </button>
              
              {selectedAlgorithm && selectedProcess && (
                <div className="preview-info">
                  <p>
                    <strong>{algorithms[selectedAlgorithm].name}</strong> asignará 
                    <strong> {selectedProcess.name} ({selectedProcess.size}KB)</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Resultado de asignación */}
            {allocationResult && (
              <div className={`allocation-result ${allocationResult.success ? 'success' : 'failure'}`}>
                <div className="result-header">
                  <h5>
                    {allocationResult.success ? '✅ Asignación Exitosa' : '❌ Asignación Fallida'}
                  </h5>
                </div>
                
                <div className="result-content">
                  <p><strong>Mensaje:</strong> {allocationResult.message}</p>
                  <p><strong>Algoritmo usado:</strong> {algorithms[allocationResult.algorithm]?.name}</p>
                  
                  {allocationResult.success && (
                    <div>
                      <p><strong>Fragmentación actual:</strong> {allocationResult.fragmentationLevel}%</p>
                      {allocationResult.isOptimal ? (
                        <div className="optimal-message">
                          🎯 <strong>¡Algoritmo óptimo seleccionado!</strong>
                        </div>
                      ) : (
                        <div className="suboptimal-message">
                          💡 <strong>Pista:</strong> {algorithms[getCurrentChallenge().targetAlgorithm]?.name} 
                          sería más eficiente para este caso.
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!allocationResult.success && (
                    <div className="failure-actions">
                      <div className="failure-message">
                        💡 <strong>¡No te preocupes!</strong> Puedes intentar de nuevo con un algoritmo diferente.
                      </div>
                      <button className="retry-btn" onClick={restartCurrentChallenge}>
                        🔄 Reintentar Desafío
                      </button>
                    </div>
                  )}
                  
                  {allocationResult.success && (
                    <div className="memory-animation">
                      <div className="allocated-bat">
                        <span className="bat-flying">🦇✨</span>
                      </div>
                      <p>¡El murciélago encuentra su lugar en la memoria!</p>
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
              <div className="organized-memory">💾✨</div>
              <div className="happy-memory-bats">
                <span className="memory-bat">🦇😊</span>
                <span className="memory-bat">🦇😊</span>
                <span className="memory-bat">🦇😊</span>
              </div>
            </div>
            
            <div className="completion-message">
              <h4>🎉 ¡Gestión de Memoria Completada!</h4>
              <p>Has dominado los algoritmos de asignación de memoria.</p>
              <p>La memoria de la cueva ahora está perfectamente organizada.</p>
              
              <div className="final-stats">
                <p>🏆 Puntuación Final: <strong>{score}</strong></p>
                <p>📊 Fragmentación Final: <strong>{fragmentationLevel}%</strong></p>
                <p>🧠 Algoritmos Dominados: <strong>3/3</strong></p>
                <p>💾 Nivel de Memoria: <strong>¡Experto!</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Panel educativo */}
        <div className="education-panel">
          <h4>📚 Gestión de Memoria</h4>
          <p>
            Los sistemas operativos deben asignar memoria eficientemente para evitar 
            fragmentación. Diferentes algoritmos optimizan para distintos objetivos: 
            velocidad de asignación vs. minimización de desperdicios.
          </p>
        </div>
      </div>

      <style>{`
        .memory-puzzle-overlay {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #1a1a2e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .memory-puzzle-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem;
          border-radius: 15px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          width: 100%;
          height: 100%;
          max-height: 100vh;
          overflow-y: auto;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          pointer-events: auto;
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

        .stats-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(155, 89, 182, 0.3);
          padding: 0.8rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          border: 2px solid #9b59b6;
          box-shadow: 0 4px 15px rgba(155, 89, 182, 0.2);
        }

        .score-stat {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #2c3e50;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .fragmentation-stat {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: #2c3e50;
        }

        .fragmentation-indicator {
          width: 100px;
          height: 10px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid #7f8c8d;
        }

        .fragmentation-bar {
          height: 100%;
          transition: width 0.5s ease;
        }

        .fragmentation-indicator.low .fragmentation-bar {
          background: #27ae60;
        }

        .fragmentation-indicator.medium .fragmentation-bar {
          background: #f39c12;
        }

        .fragmentation-indicator.high .fragmentation-bar {
          background: #e74c3c;
        }

        .intro-screen {
          text-align: center;
        }

        .intro-content h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #2c3e50;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .intro-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
          line-height: 1.4;
          color: #34495e;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .algorithms-info {
          background: rgba(52, 152, 219, 0.3);
          padding: 1rem;
          border-radius: 10px;
          margin: 1rem 0;
          border: 2px solid #3498db;
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
        }

        .algorithms-info h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
          color: #2c3e50;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .algorithm-cards {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .algorithm-card {
          flex: 1;
          min-width: 200px;
          padding: 1rem;
          border: 2px solid;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .algorithm-card h6 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.5rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .algorithm-card p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          line-height: 1.3;
          margin: 0;
          color: #34495e;
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
          border: 2px solid #229954;
          box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 10;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .start-btn:hover {
          background: #229954;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(39, 174, 96, 0.6);
        }

        .start-btn:active {
          background: #1e8449;
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
        }

        .start-btn:focus {
          outline: 3px solid #f39c12;
          outline-offset: 2px;
        }

        .tutorial-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1rem 0;
          background: rgba(52, 152, 219, 0.1);
          padding: 1rem;
          border-radius: 10px;
        }

        .tutorial-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .step-number {
          width: 30px;
          height: 30px;
          background: #3498db;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        .step-content h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .step-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.4;
          margin: 0;
        }

        .key-concept {
          background: rgba(241, 196, 15, 0.3);
          padding: 1rem;
          border-radius: 10px;
          margin: 1rem 0;
          border-left: 4px solid #f1c40f;
          border: 2px solid #f1c40f;
          box-shadow: 0 4px 15px rgba(241, 196, 15, 0.2);
        }

        .key-concept h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .key-concept p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.4;
          margin: 0;
          color: #34495e;
        }

        .control-instructions {
          text-align: center;
          margin-bottom: 1rem;
        }

        .instruction-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #3498db;
          background: rgba(52, 152, 219, 0.1);
          padding: 0.8rem;
          border-radius: 8px;
          border: 2px solid #3498db;
          animation: instruction-glow 2s ease-in-out infinite alternate;
        }

        .preview-info {
          text-align: center;
          margin-top: 1rem;
          background: rgba(46, 204, 113, 0.1);
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid #27ae60;
        }

        .preview-info p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #27ae60;
          margin: 0;
        }

        @keyframes instruction-glow {
          0% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); }
          100% { box-shadow: 0 0 15px rgba(52, 152, 219, 0.6); }
        }

        .playing-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow-y: auto;
        }

        .challenge-info {
          text-align: center;
          background: rgba(155, 89, 182, 0.2);
          padding: 0.8rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .challenge-info h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 0.4rem;
          color: #9b59b6;
        }

        .challenge-info p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.3rem;
          line-height: 1.3;
        }

        .objective-box {
          background: rgba(46, 204, 113, 0.2);
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid #27ae60;
          margin-top: 1rem;
        }

        .objective-box p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.5rem;
          color: #27ae60;
        }

        .objective-box p:first-child {
          color: #2ecc71;
          font-size: 0.7rem;
          margin-bottom: 0.8rem;
        }

        .memory-visualization {
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .memory-visualization h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.8rem;
          color: #2c3e50;
          text-align: center;
        }

        .memory-blocks-container {
          display: flex;
          width: 100%;
          height: 60px;
          border: 2px solid #7f8c8d;
          border-radius: 5px;
          overflow: hidden;
        }

        .memory-block {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          position: relative;
        }

        .memory-block:hover {
          transform: translateY(-2px);
          z-index: 10;
        }

        .block-info {
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.4rem;
        }

        .block-size {
          color: #2c3e50;
          font-weight: bold;
        }

        .block-process {
          margin-top: 0.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
        }

        .process-emoji {
          font-size: 0.8rem;
        }

        .process-id {
          color: white;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.1rem 0.2rem;
          border-radius: 2px;
        }

        .memory-scale {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          color: #7f8c8d;
        }

        .algorithm-selector {
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .algorithm-selector h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.8rem;
          color: #f39c12;
        }

        .algorithm-buttons {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .algorithm-btn {
          flex: 1;
          min-width: 180px;
          padding: 0.8rem;
          border: 2px solid;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }

        .algorithm-btn:hover {
          transform: translateY(-2px);
        }

        .algo-name {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
        }

        .algo-desc {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          line-height: 1.3;
        }

        .waiting-processes {
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .waiting-processes h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.8rem;
          color: #2ecc71;
        }

        .process-list {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .waiting-process {
          padding: 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border: 2px solid transparent;
          min-width: 140px;
        }

        .waiting-process:hover {
          transform: translateY(-2px);
          border-color: white;
        }

        .waiting-process.selected {
          border-color: #f39c12;
          box-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
        }

        .waiting-process .process-emoji {
          font-size: 2rem;
        }

        .process-details {
          font-family: 'Press Start 2P', monospace;
        }

        .process-name {
          font-size: 0.6rem;
          margin-bottom: 0.3rem;
          color: white;
        }

        .process-size {
          font-size: 0.5rem;
          color: #ecf0f1;
        }

        .controls {
          text-align: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .allocate-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .allocate-btn:hover:not(:disabled) {
          background: #c0392b;
          transform: translateY(-2px);
        }

        .allocate-btn:disabled {
          background: #7f8c8d;
          cursor: not-allowed;
        }

        .allocation-result {
          background: rgba(0, 0, 0, 0.8);
          padding: 1rem;
          border-radius: 15px;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .allocation-result.success {
          border: 3px solid #27ae60;
        }

        .allocation-result.failure {
          border: 3px solid #e74c3c;
        }

        .result-header h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 0.8rem;
          text-align: center;
        }

        .result-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          margin-bottom: 0.6rem;
          line-height: 1.3;
        }

        .optimal-message {
          background: rgba(46, 204, 113, 0.2);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #27ae60;
        }

        .suboptimal-message {
          background: rgba(243, 156, 18, 0.2);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #f39c12;
        }

        .memory-animation {
          text-align: center;
          margin-top: 1rem;
        }

        .allocated-bat {
          margin-bottom: 1rem;
        }

        .bat-flying {
          font-size: 2rem;
          animation: bat-allocate 1s ease-in-out infinite alternate;
        }

        .memory-animation p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #27ae60;
        }

        .failure-actions {
          text-align: center;
          margin-top: 1rem;
        }

        .failure-message {
          background: rgba(231, 76, 60, 0.2);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #e74c3c;
          line-height: 1.4;
        }

        .retry-btn {
          background: #f39c12;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
          animation: retry-pulse 2s ease-in-out infinite alternate;
        }

        .retry-btn:hover {
          background: #e67e22;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4);
        }

        @keyframes retry-pulse {
          0% { box-shadow: 0 0 5px rgba(243, 156, 18, 0.3); }
          100% { box-shadow: 0 0 15px rgba(243, 156, 18, 0.6); }
        }

        .completion-screen {
          text-align: center;
        }

        .completion-animation {
          margin-bottom: 2rem;
        }

        .organized-memory {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: memory-glow 1s ease-in-out infinite alternate;
        }

        .happy-memory-bats {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .memory-bat {
          font-size: 2.5rem;
          animation: memory-bat-dance 1s ease-in-out infinite alternate;
        }

        .memory-bat:nth-child(2) { animation-delay: 0.2s; }
        .memory-bat:nth-child(3) { animation-delay: 0.4s; }

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
          background: rgba(155, 89, 182, 0.3);
          padding: 0.8rem;
          border-radius: 10px;
          margin-top: 1rem;
          flex-shrink: 0;
          border: 2px solid #9b59b6;
          box-shadow: 0 4px 15px rgba(155, 89, 182, 0.2);
        }

        .education-panel h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.6rem;
          color: #2c3e50;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .education-panel p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          line-height: 1.4;
          color: #34495e;
        }

        @keyframes bat-allocate {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-10px) scale(1.1); }
        }

        @keyframes memory-glow {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.3) drop-shadow(0 0 20px #9b59b6); }
        }

        @keyframes memory-bat-dance {
          0% { transform: translateY(0) rotate(-5deg); }
          100% { transform: translateY(-15px) rotate(5deg); }
        }

        @media (max-width: 768px) {
          .memory-puzzle-container {
            padding: 0.8rem;
            border-radius: 10px;
          }
          
          .stats-display {
            flex-direction: column;
            gap: 0.8rem;
          }
          
          .algorithm-buttons,
          .process-list {
            flex-direction: column;
          }
          
          .algorithm-cards {
            flex-direction: column;
          }
          
          .memory-blocks-container {
            height: 50px;
          }
          
          .algorithm-btn {
            min-width: 100%;
            padding: 0.6rem;
          }
          
          .waiting-process {
            min-width: 100%;
            padding: 0.6rem;
          }
          
          .allocate-btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryManagementPuzzle;
