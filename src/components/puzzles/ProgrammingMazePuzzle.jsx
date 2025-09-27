import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const ProgrammingMazePuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del puzzle
  const [gamePhase, setGamePhase] = useState('intro');
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [andyPosition, setAndyPosition] = useState({ x: 1, y: 1 });
  const [andyDirection, setAndyDirection] = useState('right');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [score, setScore] = useState(0);
  const [draggedBlock, setDraggedBlock] = useState(null);

  // Laberinto complejo único
  const maze = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', 'A', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '#', '.', '#'],
    ['#', '.', '#', '.', '#', '.', '#', '.', '#', '.', '#', '.', '#', '.', '#'],
    ['#', '.', '#', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '#', '#', '#', '#', '.', '#', '#', '#', '.', '#', '#', '#', '#', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'Z', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
  ];

  const startPosition = { x: 1, y: 1 };
  const targetPosition = { x: 13, y: 13 };

  // Bloques disponibles
  const availableBlocks = [
    {
      id: 'mover',
      type: 'action',
      name: 'mover',
      label: 'Mover',
      icon: '👆',
      parameters: [
        { name: 'pasos', type: 'number', default: 1, min: 1, max: 5 }
      ],
      color: '#3498db',
      shape: 'square'
    },
    {
      id: 'girar_izquierda',
      type: 'action',
      name: 'girar_izquierda',
      label: 'Girar Izq',
      icon: '↶',
      parameters: [],
      color: '#e74c3c',
      shape: 'square'
    },
    {
      id: 'girar_derecha',
      type: 'action',
      name: 'girar_derecha',
      label: 'Girar Der',
      icon: '↷',
      parameters: [],
      color: '#e74c3c',
      shape: 'square'
    },
    {
      id: 'inicio_repetir',
      type: 'control_start',
      name: 'inicio_repetir',
      label: 'Repetir',
      icon: '🔄',
      parameters: [
        { name: 'veces', type: 'number', default: 2, min: 2, max: 10 }
      ],
      color: '#f39c12',
      shape: 'start'
    },
    {
      id: 'fin_repetir',
      type: 'control_end',
      name: 'fin_repetir',
      label: 'Fin',
      icon: '🔄',
      parameters: [],
      color: '#f39c12',
      shape: 'end'
    }
  ];

  // Funciones auxiliares
  const getCellAt = (x, y) => {
    if (y < 0 || y >= maze.length || x < 0 || x >= maze[y].length) {
      return '#';
    }
    return maze[y][x];
  };

  const isValidPosition = (x, y) => {
    const cell = getCellAt(x, y);
    return cell !== '#' && cell !== undefined;
  };

  const getNextPosition = (currentX, currentY, direction) => {
    switch (direction) {
      case 'right': return { x: currentX + 1, y: currentY };
      case 'down': return { x: currentX, y: currentY + 1 };
      case 'left': return { x: currentX - 1, y: currentY };
      case 'up': return { x: currentX, y: currentY - 1 };
      default: return { x: currentX, y: currentY };
    }
  };

  const turnDirection = (currentDirection, turn) => {
    const directions = ['right', 'down', 'left', 'up'];
    const currentIndex = directions.indexOf(currentDirection);
    
    if (turn === 'derecha') {
      // Girar a la derecha: right -> down -> left -> up -> right
      return directions[(currentIndex + 1) % 4];
    } else if (turn === 'izquierda') {
      // Girar a la izquierda: right -> up -> left -> down -> right
      return directions[(currentIndex - 1 + 4) % 4];
    } else {
      // Por defecto, no girar
      return currentDirection;
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedBlock) {
      const newBlocks = [...codeBlocks];
      newBlocks.splice(targetIndex, 0, {
        ...draggedBlock,
        id: Date.now() + Math.random()
      });
      setCodeBlocks(newBlocks);
      setDraggedBlock(null);
    }
  };

  const removeBlock = (blockId) => {
    setCodeBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  // Función para encontrar el bloque de fin correspondiente
  const findMatchingEndBlock = (startIndex) => {
    let depth = 1;
    for (let i = startIndex + 1; i < codeBlocks.length; i++) {
      const block = codeBlocks[i];
      if (block.name === 'inicio_repetir') {
        depth++;
      } else if (block.name === 'fin_repetir') {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }
    return -1;
  };

  // Ejecutar código
  const executeCode = async () => {
    if (codeBlocks.length === 0) {
      setExecutionResult({
        success: false,
        message: "No hay código para ejecutar",
        steps: 0,
        efficiency: 0,
        robustness: 0
      });
      return;
    }

    setIsExecuting(true);
    let currentX = startPosition.x;
    let currentY = startPosition.y;
    let currentDir = 'right';
    let totalSteps = 0;

    // Resetear posición
    setAndyPosition({ x: currentX, y: currentY });
    setAndyDirection(currentDir);
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Iniciando ejecución en:', { x: currentX, y: currentY, dir: currentDir });

    // Ejecutar bloques
    for (let i = 0; i < codeBlocks.length; i++) {
      const block = codeBlocks[i];
      console.log('Ejecutando bloque:', block.name, block.parameters);
      
      if (block.name === 'mover') {
        const pasos = block.parameters.find(p => p.name === 'pasos')?.value || 1;
        console.log('Moviendo', pasos, 'pasos hacia', currentDir);
        
        for (let step = 0; step < pasos; step++) {
          const nextPos = getNextPosition(currentX, currentY, currentDir);
          console.log('Siguiente posición:', nextPos);
          
          if (isValidPosition(nextPos.x, nextPos.y)) {
            currentX = nextPos.x;
            currentY = nextPos.y;
            totalSteps++;
            setAndyPosition({ x: currentX, y: currentY });
            console.log('Movido a:', { x: currentX, y: currentY });
            await new Promise(resolve => setTimeout(resolve, 300));
          } else {
            console.log('Chocó con pared en:', nextPos);
            break;
          }
        }
      } else if (block.name === 'girar_izquierda') {
        const oldDir = currentDir;
        currentDir = turnDirection(currentDir, 'izquierda');
        setAndyDirection(currentDir);
        totalSteps++;
        console.log(`Giró izquierda: ${oldDir} -> ${currentDir}`);
        await new Promise(resolve => setTimeout(resolve, 200));
      } else if (block.name === 'girar_derecha') {
        const oldDir = currentDir;
        currentDir = turnDirection(currentDir, 'derecha');
        setAndyDirection(currentDir);
        totalSteps++;
        console.log(`Giró derecha: ${oldDir} -> ${currentDir}`);
        await new Promise(resolve => setTimeout(resolve, 200));
      } else if (block.name === 'inicio_repetir') {
        const veces = block.parameters.find(p => p.name === 'veces')?.value || 2;
        const endIndex = findMatchingEndBlock(i);
        
        if (endIndex !== -1) {
          console.log('Iniciando bucle de', veces, 'veces');
          
          for (let iteration = 0; iteration < veces; iteration++) {
            console.log(`Iteración ${iteration + 1}/${veces}`);
            
            // Ejecutar bloques dentro del bucle
            for (let j = i + 1; j < endIndex; j++) {
              const innerBlock = codeBlocks[j];
              
              if (innerBlock.name === 'mover') {
                const pasos = innerBlock.parameters.find(p => p.name === 'pasos')?.value || 1;
                for (let step = 0; step < pasos; step++) {
                  const nextPos = getNextPosition(currentX, currentY, currentDir);
                  if (isValidPosition(nextPos.x, nextPos.y)) {
                    currentX = nextPos.x;
                    currentY = nextPos.y;
                    totalSteps++;
                    setAndyPosition({ x: currentX, y: currentY });
                    await new Promise(resolve => setTimeout(resolve, 300));
                  } else {
                    break;
                  }
                }
              } else if (innerBlock.name === 'girar_izquierda') {
                const oldDir = currentDir;
                currentDir = turnDirection(currentDir, 'izquierda');
                setAndyDirection(currentDir);
                totalSteps++;
                console.log(`[Bucle] Giró izquierda: ${oldDir} -> ${currentDir}`);
                await new Promise(resolve => setTimeout(resolve, 200));
              } else if (innerBlock.name === 'girar_derecha') {
                const oldDir = currentDir;
                currentDir = turnDirection(currentDir, 'derecha');
                setAndyDirection(currentDir);
                totalSteps++;
                console.log(`[Bucle] Giró derecha: ${oldDir} -> ${currentDir}`);
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            }
          }
          
          i = endIndex; // Saltar al final del bucle
        }
      }
    }

    setIsExecuting(false);

    // Evaluar resultado
    const reachedTarget = currentX === targetPosition.x && currentY === targetPosition.y;
    const hasLoops = codeBlocks.some(block => block.name === 'inicio_repetir');
    
    const efficiency = hasLoops ? 100 : Math.max(0, 100 - (totalSteps * 2));
    const robustness = 0; // Por ahora no hay condicionales

    console.log('Resultado final:', { x: currentX, y: currentY }, 'Target:', targetPosition, 'Reached:', reachedTarget);

    setExecutionResult({
      success: reachedTarget,
      message: reachedTarget ? "¡Andy llegó a la zarigüeya!" : "Andy no llegó al destino",
      steps: totalSteps,
      efficiency: efficiency,
      robustness: robustness,
      reachedTarget: reachedTarget
    });

    if (reachedTarget) {
      const points = 1000 + (efficiency + robustness);
      setScore(prev => prev + points);
      updateScore(points);

      setTimeout(() => {
        setGamePhase('completed');
        setTimeout(() => onComplete(), 3000);
      }, 3000);
    } else {
      // Si falla, solo mostrar el resultado, no reiniciar automáticamente
      console.log('Código falló, esperando nueva ejecución del usuario');
    }
  };

  // Comenzar el juego
  const startGame = () => {
    setGamePhase('programming');
  };

  // Reiniciar posición de Andy
  const resetAndyPosition = () => {
    setAndyPosition(startPosition);
    setAndyDirection('right');
    setExecutionResult(null);
    console.log('Posición de Andy reiniciada a:', startPosition);
  };

  // Renderizar laberinto
  const renderMaze = () => {
    return (
      <div className="maze-container">
        <div className="maze-grid">
          {maze.map((row, y) => (
            <div key={y} className="maze-row">
              {row.map((cell, x) => (
                <div key={x} className={`maze-cell ${cell === '#' ? 'wall' : 'path'}`}>
                  {/* Andy en posición actual */}
                  {x === andyPosition.x && y === andyPosition.y && (
                    <div className={`andy-character ${andyDirection} ${isExecuting ? 'moving' : ''}`}>
                      <div className="andy-avatar">🐿️</div>
                      <div className="direction-arrow">
                        {andyDirection === 'right' && '→'}
                        {andyDirection === 'down' && '↓'}
                        {andyDirection === 'left' && '←'}
                        {andyDirection === 'up' && '↑'}
                      </div>
                    </div>
                  )}
                  
                  {/* Zarigüeya en posición objetivo */}
                  {x === targetPosition.x && y === targetPosition.y && (
                    <div className="target-character">
                      🦫
                    </div>
                  )}
                  
                  {/* Punto de inicio (si no es Andy) */}
                  {cell === 'A' && !(x === andyPosition.x && y === andyPosition.y) && (
                    <div className="start-marker">🚪</div>
                  )}
                  
                  {/* Camino vacío */}
                  {cell === '.' && !(x === andyPosition.x && y === andyPosition.y) && !(x === targetPosition.x && y === targetPosition.y) && (
                    <div className="path-dot">·</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar bloques disponibles
  const renderAvailableBlocks = () => {
    return (
      <div className="blocks-palette">
        <h5>🧩 Bloques Disponibles</h5>
        <div className="blocks-grid">
          {availableBlocks.map(block => (
            <div
              key={block.id}
              className={`block-item ${block.shape}`}
              draggable
              onDragStart={(e) => handleDragStart(e, block)}
              style={{ backgroundColor: block.color }}
            >
              <div className="block-icon">{block.icon}</div>
              <div className="block-label">{block.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar código
  const renderCode = () => {
    return (
      <div className="code-area">
        <h5>📝 Tu Código</h5>
        <div 
          className="code-blocks"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, codeBlocks.length)}
        >
          {codeBlocks.map((block, index) => (
            <div key={block.id}>
              <div 
                className="drop-zone"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              />
              <div 
                className={`code-block ${block.shape}`} 
                style={{ backgroundColor: block.color }}
              >
                <div className="block-header">
                  <span className="block-icon">{block.icon}</span>
                  <span className="block-name">{block.label}</span>
                  <button 
                    className="remove-block-btn"
                    onClick={() => removeBlock(block.id)}
                  >
                    ❌
                  </button>
                </div>
                {block.parameters.map((param, paramIndex) => (
                  <div key={paramIndex} className="block-parameter">
                    <label>{param.name}:</label>
                    {param.type === 'number' ? (
                      <input
                        type="number"
                        value={param.value}
                        min={param.min}
                        max={param.max}
                        onChange={(e) => {
                          const newBlocks = [...codeBlocks];
                          newBlocks[index].parameters[paramIndex].value = parseInt(e.target.value);
                          setCodeBlocks(newBlocks);
                        }}
                      />
                    ) : (
                      <select
                        value={param.value}
                        onChange={(e) => {
                          const newBlocks = [...codeBlocks];
                          newBlocks[index].parameters[paramIndex].value = e.target.value;
                          setCodeBlocks(newBlocks);
                        }}
                      >
                        {param.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div 
            className="drop-zone final"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, codeBlocks.length)}
          />
        </div>
        {codeBlocks.length === 0 && (
          <div className="empty-code">
            <p>Arrastra bloques aquí para crear tu código</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="programming-maze-puzzle-overlay">
      <div className="programming-maze-puzzle-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle: El Gran Laberinto Programado</h3>
          <p>Programa a Andy para que llegue a la zarigüeya</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Puntuación */}
        <div className="score-display">
          <div className="score-stat">🏆 Puntuación: {score}</div>
        </div>

        {gamePhase === 'intro' && (
          <div className="intro-screen">
            <div className="maze-intro-scene">
              <div className="maze-visualization">
                <div className="code-blocks-demo">🧩📝🧩📝</div>
                <div className="andy-maze">
                  <div className="maze-preview">🐿️ → 🦫</div>
                  <p>¡Andy necesita programación para navegar!</p>
                </div>
              </div>
            </div>
            
            <div className="intro-content">
              <h4>🎯 Tu Misión</h4>
              <p>Andy está atrapado en un laberinto complejo y necesita que lo programes para llegar a la zarigüeya.</p>
              <p>Usa bloques de programación como rompecabezas para crear un algoritmo que lo guíe hasta el destino.</p>
              
              <div className="programming-concepts">
                <h5>📚 Conceptos de Programación:</h5>
                <div className="concept-cards">
                  <div className="concept-card">
                    <h6>🧩 Bloques</h6>
                    <p>Instrucciones básicas de movimiento</p>
                  </div>
                  <div className="concept-card">
                    <h6>🔄 Bucles</h6>
                    <p>Repetir acciones para optimizar código</p>
                  </div>
                  <div className="concept-card">
                    <h6>🎯 Algoritmos</h6>
                    <p>Secuencia lógica de pasos</p>
                  </div>
                </div>
              </div>
              
              <button className="start-btn" onClick={startGame}>
                🚀 Comenzar Programación
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'programming' && (
          <div className="programming-area">
            <div className="game-layout">
              {/* Laberinto */}
              <div className="maze-section">
                {renderMaze()}
              </div>

              {/* Bloques y código */}
              <div className="programming-section">
                {renderAvailableBlocks()}
                {renderCode()}
              </div>
            </div>

            {/* Controles */}
            <div className="controls">
              <button 
                className="execute-btn"
                onClick={executeCode}
                disabled={isExecuting || codeBlocks.length === 0}
              >
                {isExecuting ? '⚡ Ejecutando...' : '▶️ Ejecutar Código'}
              </button>
              <button 
                className="reset-btn"
                onClick={resetAndyPosition}
                disabled={isExecuting}
              >
                🔄 Reiniciar Posición
              </button>
            </div>

            {/* Resultado de ejecución */}
            {executionResult && (
              <div className={`execution-result ${executionResult.success ? 'success' : 'failure'}`}>
                <div className="result-header">
                  <h5>
                    {executionResult.success ? '✅ ¡Código Exitoso!' : '❌ Código Fallido'}
                  </h5>
                </div>
                
                <div className="result-content">
                  <p><strong>Resultado:</strong> {executionResult.message}</p>
                  <p><strong>Pasos utilizados:</strong> {executionResult.steps}</p>
                  
                  <div className="evaluation-criteria">
                    <div className="criterion">
                      <span className="criterion-label">✅ Funciona:</span>
                      <span className="criterion-value">{executionResult.reachedTarget ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="criterion">
                      <span className="criterion-label">⭐ Optimizado:</span>
                      <span className="criterion-value">{executionResult.efficiency}%</span>
                    </div>
                  </div>
                  
                  {executionResult.success ? (
                    <div className="success-animation">
                      <div className="andy-rescue">🐿️✨🦫✨</div>
                      <p>¡Andy rescató a la zarigüeya!</p>
                    </div>
                  ) : (
                    <div className="failure-message">
                      <p>💡 <strong>Consejo:</strong> Revisa tu código y usa el botón "🔄 Reiniciar Posición" para volver a intentar</p>
                      <p>Puedes modificar los bloques y ejecutar de nuevo sin perder tu progreso</p>
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
              <div className="final-rescue">🐿️🎉🦫🎉</div>
              <div className="success-message">
                <h3>🎉 ¡Laberinto Completado!</h3>
                <p>Has dominado la programación con bloques</p>
                <p>Puntuación total: {score}</p>
                <p>¡La zarigüeya está libre!</p>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .programming-maze-puzzle-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #1a1a2e 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            z-index: 1000;
            overflow: hidden;
            font-family: 'Press Start 2P', monospace;
          }

          .programming-maze-puzzle-container {
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.8rem;
            background: rgba(52, 152, 219, 0.3);
            padding: 0.8rem;
            border-radius: 10px;
            border: 2px solid #3498db;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
          }

          .puzzle-header h3 {
            color: #2c3e50;
            font-size: 0.8rem;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
          }

          .puzzle-header p {
            color: #34495e;
            font-size: 0.5rem;
            margin: 0.3rem 0 0 0;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          .close-btn {
            background: #e74c3c;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            border: 2px solid #c0392b;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          }

          .close-btn:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
          }

          .score-display {
            display: flex;
            justify-content: center;
            margin-bottom: 0.8rem;
            background: rgba(243, 156, 18, 0.3);
            padding: 0.8rem;
            border-radius: 10px;
            border: 2px solid #f39c12;
            box-shadow: 0 4px 15px rgba(243, 156, 18, 0.2);
          }

          .score-stat {
            color: #2c3e50;
            font-size: 0.6rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          .intro-screen {
            text-align: center;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
          }

          .maze-intro-scene {
            margin-bottom: 2rem;
          }

          .maze-visualization {
            background: rgba(0, 0, 0, 0.5);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 1rem;
          }

          .code-blocks-demo {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: blocks-float 2s ease-in-out infinite alternate;
          }

          .andy-maze {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .maze-preview {
            animation: maze-walk 3s ease-in-out infinite;
          }

          .intro-content {
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #3498db;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
          }

          .intro-content h4 {
            color: #3498db;
            font-size: 1rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          }

          .intro-content p {
            font-size: 0.7rem;
            line-height: 1.4;
            margin-bottom: 1rem;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          }

          .programming-concepts {
            margin: 2rem 0;
          }

          .programming-concepts h5 {
            color: #2ecc71;
            font-size: 0.8rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          }

          .concept-cards {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .concept-card {
            background: rgba(0, 0, 0, 0.6);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #2ecc71;
            min-width: 150px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }

          .concept-card h6 {
            color: #2ecc71;
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          }

          .concept-card p {
            font-size: 0.6rem;
            color: #ffffff;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          }

          .start-btn {
            background: linear-gradient(45deg, #2ecc71, #27ae60);
            color: white;
            border: 2px solid #27ae60;
            padding: 1.5rem 3rem;
            border-radius: 15px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            margin-top: 1rem;
          }

          .start-btn:hover {
            background: linear-gradient(45deg, #27ae60, #229954);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
          }

          .programming-area {
            width: 100%;
          }

          .level-info {
            text-align: center;
            margin-bottom: 2rem;
            background: rgba(52, 152, 219, 0.1);
            padding: 1rem;
            border-radius: 10px;
          }

          .level-info h4 {
            color: #3498db;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .level-info p {
            color: #ecf0f1;
            font-size: 0.7rem;
            margin: 0;
          }

          .game-layout {
            display: grid;
            grid-template-columns: 70% 30%;
            gap: 2rem;
            margin-bottom: 2rem;
            min-height: 70vh;
          }

          .maze-section {
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 10px;
            border: 2px solid #7f8c8d;
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .maze-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            width: 100%;
          }

          .maze-grid {
            display: grid;
            gap: 2px;
            background: #2c3e50;
            padding: 1.5rem;
            border-radius: 8px;
            min-height: 50vh;
            width: fit-content;
            margin: 0 auto;
          }

          .maze-row {
            display: flex;
            gap: 1px;
          }

          .maze-cell {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            position: relative;
          }

          .maze-cell.wall {
            background: #34495e;
            border: 1px solid #2c3e50;
          }

          .maze-cell.path {
            background: #ecf0f1;
            border: 1px solid #bdc3c7;
          }

          .andy-character {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            width: 100%;
            height: 100%;
          }

          .andy-character.moving {
            animation: andy-move 0.3s ease-in-out;
          }

          .andy-avatar {
            font-size: 1rem;
            margin-bottom: 2px;
            z-index: 2;
          }

          .direction-arrow {
            font-size: 0.6rem;
            color: #e74c3c;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
            animation: arrow-pulse 1.5s ease-in-out infinite;
            z-index: 3;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            width: 12px;
            height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e74c3c;
          }

          .target-character {
            font-size: 1rem;
            animation: target-pulse 2s ease-in-out infinite;
          }

          .path-dot {
            color: #bdc3c7;
            font-size: 0.6rem;
          }

          .start-marker {
            font-size: 0.8rem;
            animation: start-pulse 2s ease-in-out infinite;
          }

          .programming-section {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            min-height: 60vh;
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 10px;
            border: 2px solid #7f8c8d;
          }

          .blocks-palette {
            background: rgba(0, 0, 0, 0.4);
            padding: 1.2rem;
            border-radius: 10px;
            border: 2px solid #f39c12;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }

          .blocks-palette h5 {
            color: #f39c12;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            font-weight: bold;
          }

          .blocks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 0.5rem;
          }

          .block-item {
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            cursor: grab;
            transition: all 0.3s;
            color: white;
            user-select: none;
            font-size: 1rem;
            min-height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            font-weight: bold;
          }

          .block-item:active {
            cursor: grabbing;
          }

          .block-item:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }

          .block-item.square {
            border-radius: 8px;
          }

          .block-item.start {
            border-radius: 8px 8px 0 0;
            border-bottom: 3px solid #2ecc71;
          }

          .block-item.end {
            border-radius: 0 0 8px 8px;
            border-top: 3px solid #e74c3c;
          }

          .block-icon {
            font-size: 1rem;
            margin-bottom: 0.2rem;
          }

          .block-label {
            font-size: 0.4rem;
            line-height: 1.2;
          }

          .code-area {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #3498db;
            min-height: 200px;
          }

          .code-area h5 {
            color: #3498db;
            font-size: 0.8rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .code-blocks {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            min-height: 220px;
            padding: 1.2rem;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            border: 2px solid #7f8c8d;
            align-items: stretch;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }

          .drop-zone {
            height: 15px;
            border: 2px dashed transparent;
            border-radius: 4px;
            transition: all 0.3s;
            margin: 0;
            width: 100%;
            box-sizing: border-box;
          }

          .drop-zone:hover {
            border-color: #3498db;
            background: rgba(52, 152, 219, 0.1);
          }

          .drop-zone.final {
            flex: 1;
            min-height: 30px;
            margin: 0;
            width: 100%;
            box-sizing: border-box;
          }

          .code-block {
            padding: 1rem;
            border-radius: 8px;
            color: white;
            position: relative;
            font-size: 1rem;
            min-height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            width: 100%;
            box-sizing: border-box;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            font-weight: bold;
          }

          .code-block.square {
            border-radius: 8px;
          }

          .code-block.start {
            border-radius: 8px 8px 0 0;
            border-bottom: 3px solid #2ecc71;
            margin: 0;
          }

          .code-block.end {
            border-radius: 0 0 8px 8px;
            border-top: 3px solid #e74c3c;
            margin: 0;
          }

          .block-header {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            margin-bottom: 0.4rem;
          }

          .block-icon {
            font-size: 0.8rem;
          }

          .block-name {
            font-size: 0.5rem;
            flex: 1;
          }

          .remove-block-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            font-size: 0.5rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .remove-block-btn:hover {
            background: #e74c3c;
            transform: scale(1.1);
          }

          .block-parameter {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            margin-bottom: 0.2rem;
          }

          .block-parameter label {
            font-size: 0.4rem;
            min-width: 40px;
          }

          .block-parameter input,
          .block-parameter select {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.1rem;
            border-radius: 3px;
            font-size: 0.4rem;
            font-family: 'Press Start 2P', monospace;
          }

          .empty-code {
            text-align: center;
            color: #7f8c8d;
            font-size: 0.5rem;
            font-style: italic;
            padding: 2rem;
          }

          .controls {
            text-align: center;
            margin-bottom: 2rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .execute-btn {
            background: #2ecc71;
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
            background: #27ae60;
            transform: translateY(-2px);
          }

          .execute-btn:disabled {
            background: #7f8c8d;
            cursor: not-allowed;
          }

          .reset-btn {
            background: #f39c12;
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.7rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .reset-btn:hover:not(:disabled) {
            background: #e67e22;
            transform: translateY(-2px);
          }

          .reset-btn:disabled {
            background: #7f8c8d;
            cursor: not-allowed;
          }

          .execution-result {
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
          }

          .execution-result.success {
            border: 3px solid #2ecc71;
          }

          .execution-result.failure {
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

          .evaluation-criteria {
            display: flex;
            justify-content: space-around;
            margin: 1rem 0;
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 8px;
          }

          .criterion {
            text-align: center;
          }

          .criterion-label {
            display: block;
            color: #ecf0f1;
            font-size: 0.6rem;
            margin-bottom: 0.3rem;
          }

          .criterion-value {
            display: block;
            color: #2ecc71;
            font-size: 0.7rem;
            font-weight: bold;
          }

          .success-animation {
            text-align: center;
            margin-top: 1rem;
          }

          .andy-rescue {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: rescue-celebration 2s ease-in-out infinite;
          }

          .failure-message {
            text-align: center;
            margin-top: 1rem;
            background: rgba(231, 76, 60, 0.1);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #e74c3c;
          }

          .failure-message p {
            font-size: 0.6rem;
            color: #ecf0f1;
            margin-bottom: 0.5rem;
            line-height: 1.4;
          }

          .completion-screen {
            text-align: center;
            color: white;
          }

          .completion-animation {
            background: rgba(0, 0, 0, 0.5);
            padding: 3rem;
            border-radius: 20px;
          }

          .final-rescue {
            font-size: 4rem;
            margin-bottom: 2rem;
            animation: final-celebration 2s ease-in-out infinite;
          }

          .success-message h3 {
            color: #2ecc71;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }

          .success-message p {
            font-size: 0.8rem;
            color: #ecf0f1;
            margin-bottom: 0.5rem;
          }

          @keyframes blocks-float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }

          @keyframes maze-walk {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(20px); }
          }

          @keyframes andy-move {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }

          @keyframes target-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes arrow-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
          }

          @keyframes start-pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
          }

          @keyframes rescue-celebration {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
          }

          @keyframes final-celebration {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(10deg); }
          }

          @media (max-width: 768px) {
            .game-layout {
              grid-template-columns: 1fr;
            }
            
            .maze-cell {
              width: 15px;
              height: 15px;
            }
            
            .blocks-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            
            .evaluation-criteria {
              flex-direction: column;
              gap: 0.5rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProgrammingMazePuzzle;