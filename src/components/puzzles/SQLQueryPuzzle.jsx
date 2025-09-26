import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const SQLQueryPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del puzzle
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, completed
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [currentPosition, setCurrentPosition] = useState('start');
  const [selectedPath, setSelectedPath] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  // Desafíos de consultas SQL
  const challenges = [
    {
      id: 1,
      title: "Consulta Básica",
      description: "Selecciona todos los estudiantes",
      hint: "Necesitas obtener TODA la información de la tabla",
      correctQuery: "SELECT * FROM estudiantes",
      paths: [
        { id: 'path1', query: "SELECT * FROM estudiantes", label: "SELECT *" },
        { id: 'path2', query: "SELECT nombre FROM estudiantes", label: "SELECT nombre" },
        { id: 'path3', query: "INSERT INTO estudiantes", label: "INSERT" }
      ],
      table: {
        name: "estudiantes",
        columns: ["id", "nombre", "edad", "carrera"],
        data: [
          { id: 1, nombre: "Juan Pérez", edad: 22, carrera: "Sistemas" },
          { id: 2, nombre: "María García", edad: 20, carrera: "Medicina" },
          { id: 3, nombre: "Carlos Ruiz", edad: 21, carrera: "Sistemas" }
        ]
      }
    },
    {
      id: 2,
      title: "Consulta con WHERE",
      description: "Encuentra solo los estudiantes de Sistemas",
      hint: "Necesitas filtrar por carrera usando WHERE",
      correctQuery: "SELECT * FROM estudiantes WHERE carrera='Sistemas'",
      paths: [
        { id: 'path1', query: "SELECT * FROM estudiantes WHERE carrera='Sistemas'", label: "SELECT * WHERE carrera='Sistemas'" },
        { id: 'path2', query: "SELECT nombre FROM estudiantes", label: "SELECT nombre" },
        { id: 'path3', query: "SELECT * FROM estudiantes WHERE edad>20", label: "SELECT * WHERE edad>20" }
      ],
      table: {
        name: "estudiantes",
        columns: ["id", "nombre", "edad", "carrera"],
        data: [
          { id: 1, nombre: "Juan Pérez", edad: 22, carrera: "Sistemas" },
          { id: 2, nombre: "María García", edad: 20, carrera: "Medicina" },
          { id: 3, nombre: "Carlos Ruiz", edad: 21, carrera: "Sistemas" }
        ]
      }
    },
    {
      id: 3,
      title: "Consulta Específica",
      description: "Obtén solo los nombres de estudiantes de Medicina",
      hint: "Necesitas seleccionar solo la columna nombre y filtrar por carrera",
      correctQuery: "SELECT nombre FROM estudiantes WHERE carrera='Medicina'",
      paths: [
        { id: 'path1', query: "SELECT nombre FROM estudiantes WHERE carrera='Medicina'", label: "SELECT nombre WHERE carrera='Medicina'" },
        { id: 'path2', query: "SELECT * FROM estudiantes WHERE carrera='Medicina'", label: "SELECT * WHERE carrera='Medicina'" },
        { id: 'path3', query: "SELECT nombre FROM estudiantes", label: "SELECT nombre" }
      ],
      table: {
        name: "estudiantes",
        columns: ["id", "nombre", "edad", "carrera"],
        data: [
          { id: 1, nombre: "Juan Pérez", edad: 22, carrera: "Sistemas" },
          { id: 2, nombre: "María García", edad: 20, carrera: "Medicina" },
          { id: 3, nombre: "Carlos Ruiz", edad: 21, carrera: "Sistemas" }
        ]
      }
    }
  ];

  // Inicializar desafío
  useEffect(() => {
    if (gamePhase === 'playing') {
      setCurrentPosition('start');
      setSelectedPath(null);
      setQueryResult(null);
    }
  }, [currentChallenge, gamePhase]);

  // Comenzar el juego
  const startGame = () => {
    setGamePhase('playing');
  };

  // Seleccionar camino
  const selectPath = (path) => {
    setSelectedPath(path);
    setCurrentPosition('querying');
    
    // Simular ejecución de consulta
    setTimeout(() => {
      executeQuery(path.query);
    }, 1000);
  };

  // Ejecutar consulta
  const executeQuery = (query) => {
    const challenge = challenges[currentChallenge - 1];
    const isCorrect = query === challenge.correctQuery;
    
    let result = [];
    
    if (isCorrect) {
      // Ejecutar consulta correcta
      if (query.includes('WHERE carrera=\'Sistemas\'')) {
        result = challenge.table.data.filter(row => row.carrera === 'Sistemas');
      } else if (query.includes('WHERE carrera=\'Medicina\'')) {
        result = challenge.table.data.filter(row => row.carrera === 'Medicina');
        if (query.includes('SELECT nombre')) {
          result = result.map(row => ({ nombre: row.nombre }));
        }
      } else if (query.includes('SELECT nombre') && !query.includes('WHERE')) {
        result = challenge.table.data.map(row => ({ nombre: row.nombre }));
      } else {
        result = challenge.table.data;
      }
    }

    setQueryResult({
      success: isCorrect,
      query: query,
      result: result,
      message: isCorrect ? 
        `¡Consulta exitosa! Se encontraron ${result.length} registros.` :
        "Consulta incorrecta. Los datos no coinciden con lo solicitado."
    });

    if (isCorrect) {
      const points = 200 * currentChallenge;
      setScore(prev => prev + points);
      updateScore(points);
      setCompletedChallenges(prev => prev + 1);

      setTimeout(() => {
        if (currentChallenge >= challenges.length) {
          setGamePhase('completed');
          setTimeout(() => onComplete(), 3000);
        } else {
          setCurrentChallenge(prev => prev + 1);
          setQueryResult(null);
          setCurrentPosition('start');
          setSelectedPath(null);
        }
      }, 3000);
    } else {
      setTimeout(() => {
        setCurrentPosition('start');
        setSelectedPath(null);
        setQueryResult(null);
      }, 3000);
    }
  };

  // Obtener desafío actual
  const getCurrentChallenge = () => {
    return challenges[currentChallenge - 1];
  };

  // Renderizar laberinto de consultas
  const renderQueryMaze = () => {
    const challenge = getCurrentChallenge();
    
    return (
      <div className="query-maze">
        <div className="maze-start">
          <div className="start-point">🚀</div>
          <div className="start-label">Inicio</div>
        </div>
        
        <div className="maze-paths">
          {challenge.paths.map((path, index) => (
            <div key={path.id} className="maze-path">
              <div className="path-sign">
                <div className="query-text">{path.label}</div>
              </div>
              <button 
                className={`path-btn ${selectedPath?.id === path.id ? 'selected' : ''}`}
                onClick={() => selectPath(path)}
                disabled={currentPosition !== 'start'}
              >
                {currentPosition === 'start' ? '👆 Elegir' : '⏳ Procesando...'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="maze-end">
          <div className="end-point">
            {currentPosition === 'querying' ? '⚙️' : '🎯'}
          </div>
          <div className="end-label">
            {currentPosition === 'querying' ? 'Ejecutando...' : 'Resultado'}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar tabla de datos
  const renderDataTable = () => {
    const challenge = getCurrentChallenge();
    
    return (
      <div className="data-table">
        <h5>📊 Tabla: {challenge.table.name}</h5>
        <div className="table-structure">
          <div className="table-header">
            {challenge.table.columns.map(column => (
              <div key={column} className="table-column-header">
                {column}
              </div>
            ))}
          </div>
          <div className="table-body">
            {challenge.table.data.map((row, index) => (
              <div key={index} className="table-row">
                {challenge.table.columns.map(column => (
                  <div key={column} className="table-cell">
                    {row[column]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="sql-query-puzzle-overlay">
      <div className="sql-query-puzzle-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 2: El Camino de la Consulta</h3>
          <p>Elige el camino correcto para tu consulta SQL</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Puntuación */}
        <div className="score-display">
          <div className="score-stat">🏆 Puntuación: {score}</div>
          <div className="progress-stat">📊 Progreso: {completedChallenges}/{challenges.length}</div>
        </div>

        {gamePhase === 'intro' && (
          <div className="intro-screen">
            <div className="query-maze-scene">
              <div className="maze-visualization">
                <div className="sql-signs">📝SELECT📝WHERE📝FROM</div>
                <div className="maze-paths">
                  <div className="path-option">🛤️</div>
                  <div className="path-option">🛤️</div>
                  <div className="path-option">🛤️</div>
                </div>
                <p>¡Un laberinto de consultas SQL!</p>
              </div>
            </div>
            
            <div className="intro-content">
              <h4>🎯 Tu Misión</h4>
              <p>Debes navegar por un laberinto eligiendo el camino correcto según la consulta SQL necesaria.</p>
              <p>Cada camino tiene una consulta diferente. Elige la que resuelva el problema correctamente.</p>
              
              <div className="sql-concepts">
                <h5>📚 Conceptos SQL:</h5>
                <div className="concept-cards">
                  <div className="concept-card">
                    <h6>SELECT</h6>
                    <p>Selecciona columnas específicas</p>
                  </div>
                  <div className="concept-card">
                    <h6>WHERE</h6>
                    <p>Filtra registros por condiciones</p>
                  </div>
                  <div className="concept-card">
                    <h6>FROM</h6>
                    <p>Especifica la tabla origen</p>
                  </div>
                </div>
              </div>
              
              <button className="start-btn" onClick={startGame}>
                🚀 Comenzar Navegación
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'playing' && (
          <div className="playing-area">
            <div className="challenge-info">
              <h4>🌊 Desafío {currentChallenge}/{challenges.length}: {getCurrentChallenge().title}</h4>
              <p>{getCurrentChallenge().description}</p>
              <div className="hint-box">
                <p>💡 <strong>Pista:</strong> {getCurrentChallenge().hint}</p>
              </div>
            </div>

            {/* Tabla de datos */}
            <div className="table-area">
              {renderDataTable()}
            </div>

            {/* Laberinto de consultas */}
            <div className="maze-area">
              {renderQueryMaze()}
            </div>

            {/* Resultado de consulta */}
            {queryResult && (
              <div className={`query-result ${queryResult.success ? 'success' : 'failure'}`}>
                <div className="result-header">
                  <h5>
                    {queryResult.success ? '✅ ¡Consulta Exitosa!' : '❌ Consulta Incorrecta'}
                  </h5>
                </div>
                
                <div className="result-content">
                  <p><strong>Consulta ejecutada:</strong> {queryResult.query}</p>
                  <p><strong>Mensaje:</strong> {queryResult.message}</p>
                  
                  {queryResult.success && queryResult.result.length > 0 && (
                    <div className="result-data">
                      <h6>📋 Resultados:</h6>
                      <div className="result-table">
                        <div className="result-row">
                          {Object.keys(queryResult.result[0]).map(key => (
                            <div key={key} className="result-cell header">{key}</div>
                          ))}
                        </div>
                        {queryResult.result.map((row, index) => (
                          <div key={index} className="result-row">
                            {Object.values(row).map((value, cellIndex) => (
                              <div key={cellIndex} className="result-cell">{value}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!queryResult.success && (
                    <div className="error-details">
                      <p>💡 Revisa la consulta y asegúrate de que coincida exactamente con lo solicitado</p>
                      <p>🔄 Intenta de nuevo con un camino diferente</p>
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
              <div className="success-queries">📝✅📝✅</div>
              <div className="success-message">
                <h3>🎉 ¡Excelente Navegación!</h3>
                <p>Has dominado las consultas SQL básicas</p>
                <p>Puntuación total: {score}</p>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .sql-query-puzzle-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            font-family: 'Press Start 2P', monospace;
          }

          .sql-query-puzzle-container {
            width: 95%;
            max-width: 1200px;
            max-height: 90vh;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #1a1a2e 100%);
            border-radius: 20px;
            padding: 2rem;
            overflow-y: auto;
            border: 3px solid #3498db;
            box-shadow: 0 0 30px rgba(52, 152, 219, 0.3);
          }

          .puzzle-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid #3498db;
            padding-bottom: 1rem;
          }

          .puzzle-header h3 {
            color: #3498db;
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

          .score-display {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
            background: rgba(52, 152, 219, 0.1);
            padding: 1rem;
            border-radius: 10px;
          }

          .score-stat, .progress-stat {
            color: #3498db;
            font-size: 0.8rem;
          }

          .intro-screen {
            text-align: center;
            color: white;
          }

          .query-maze-scene {
            margin-bottom: 2rem;
          }

          .maze-visualization {
            background: rgba(0, 0, 0, 0.5);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 1rem;
          }

          .sql-signs {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: signs-glow 2s ease-in-out infinite alternate;
          }

          .maze-paths {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 1rem;
          }

          .path-option {
            font-size: 2rem;
            animation: path-pulse 1.5s ease-in-out infinite;
          }

          .intro-content h4 {
            color: #3498db;
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .intro-content p {
            font-size: 0.7rem;
            line-height: 1.4;
            margin-bottom: 1rem;
            color: #ecf0f1;
          }

          .sql-concepts {
            margin: 2rem 0;
          }

          .sql-concepts h5 {
            color: #2ecc71;
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
            background: rgba(46, 204, 113, 0.1);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #2ecc71;
            min-width: 150px;
          }

          .concept-card h6 {
            color: #2ecc71;
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
          }

          .concept-card p {
            font-size: 0.6rem;
            color: #ecf0f1;
            margin: 0;
          }

          .start-btn {
            background: linear-gradient(45deg, #2ecc71, #27ae60);
            color: white;
            border: none;
            padding: 1.5rem 3rem;
            border-radius: 15px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
          }

          .start-btn:hover {
            background: linear-gradient(45deg, #27ae60, #229954);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
          }

          .playing-area {
            width: 100%;
          }

          .challenge-info {
            text-align: center;
            margin-bottom: 2rem;
            background: rgba(52, 152, 219, 0.1);
            padding: 1rem;
            border-radius: 10px;
          }

          .challenge-info h4 {
            color: #3498db;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .challenge-info p {
            color: #ecf0f1;
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
          }

          .hint-box {
            background: rgba(241, 196, 15, 0.2);
            padding: 0.8rem;
            border-radius: 8px;
            border: 2px solid #f1c40f;
            margin-top: 1rem;
          }

          .hint-box p {
            color: #f1c40f;
            font-size: 0.6rem;
            margin: 0;
          }

          .table-area {
            margin-bottom: 2rem;
          }

          .data-table {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #3498db;
          }

          .data-table h5 {
            color: #3498db;
            font-size: 0.8rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .table-structure {
            overflow-x: auto;
          }

          .table-header {
            display: flex;
            background: #3498db;
            color: white;
            font-weight: bold;
          }

          .table-column-header {
            padding: 0.8rem;
            font-size: 0.6rem;
            border-right: 1px solid #2980b9;
            min-width: 100px;
            text-align: center;
          }

          .table-body {
            background: white;
            color: #2c3e50;
          }

          .table-row {
            display: flex;
            border-bottom: 1px solid #bdc3c7;
          }

          .table-row:nth-child(even) {
            background: #ecf0f1;
          }

          .table-cell {
            padding: 0.8rem;
            font-size: 0.6rem;
            border-right: 1px solid #bdc3c7;
            min-width: 100px;
            text-align: center;
          }

          .maze-area {
            margin-bottom: 2rem;
          }

          .query-maze {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(0, 0, 0, 0.3);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #7f8c8d;
          }

          .maze-start, .maze-end {
            text-align: center;
            color: white;
          }

          .start-point, .end-point {
            font-size: 3rem;
            margin-bottom: 0.5rem;
          }

          .start-label, .end-label {
            font-size: 0.6rem;
            color: #ecf0f1;
          }

          .maze-paths {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex: 1;
            margin: 0 2rem;
          }

          .maze-path {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            border: 2px solid #7f8c8d;
            transition: all 0.3s;
          }

          .maze-path:hover {
            border-color: #3498db;
            background: rgba(52, 152, 219, 0.1);
          }

          .path-sign {
            flex: 1;
            background: #34495e;
            padding: 1rem;
            border-radius: 8px;
            border: 2px solid #2c3e50;
          }

          .query-text {
            color: #ecf0f1;
            font-size: 0.6rem;
            font-family: 'Courier New', monospace;
            text-align: center;
          }

          .path-btn {
            background: #2ecc71;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.6rem;
            cursor: pointer;
            transition: all 0.3s;
            min-width: 120px;
          }

          .path-btn:hover:not(:disabled) {
            background: #27ae60;
            transform: scale(1.05);
          }

          .path-btn:disabled {
            background: #7f8c8d;
            cursor: not-allowed;
          }

          .path-btn.selected {
            background: #f39c12;
          }

          .query-result {
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
          }

          .query-result.success {
            border: 3px solid #2ecc71;
          }

          .query-result.failure {
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

          .result-data {
            margin-top: 1rem;
          }

          .result-data h6 {
            color: #2ecc71;
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
          }

          .result-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid #2ecc71;
          }

          .result-row {
            display: flex;
          }

          .result-row:first-child {
            background: #2ecc71;
            color: white;
          }

          .result-row:nth-child(even) {
            background: #ecf0f1;
          }

          .result-cell {
            padding: 0.5rem;
            font-size: 0.5rem;
            border-right: 1px solid #bdc3c7;
            min-width: 80px;
            text-align: center;
          }

          .result-cell.header {
            font-weight: bold;
          }

          .error-details {
            background: rgba(231, 76, 60, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
          }

          .error-details p {
            color: #e74c3c;
            font-size: 0.6rem;
            margin-bottom: 0.3rem;
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

          .success-queries {
            font-size: 4rem;
            margin-bottom: 2rem;
            animation: query-celebration 2s ease-in-out infinite;
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

          @keyframes signs-glow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.3) drop-shadow(0 0 10px #3498db); }
          }

          @keyframes path-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes query-celebration {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
          }

          @media (max-width: 768px) {
            .query-maze {
              flex-direction: column;
              gap: 1rem;
            }
            
            .maze-paths {
              margin: 1rem 0;
              width: 100%;
            }
            
            .maze-path {
              flex-direction: column;
              text-align: center;
            }
            
            .table-header, .table-row {
              flex-direction: column;
            }
            
            .table-column-header, .table-cell {
              border-right: none;
              border-bottom: 1px solid #bdc3c7;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SQLQueryPuzzle;
