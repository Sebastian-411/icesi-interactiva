import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const TableRelationsPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del puzzle
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, completed
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [table1, setTable1] = useState(null);
  const [table2, setTable2] = useState(null);
  const [connections, setConnections] = useState([]);
  const [selectedColumn1, setSelectedColumn1] = useState(null);
  const [selectedColumn2, setSelectedColumn2] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  // Desafíos de relaciones entre tablas
  const challenges = [
    {
      id: 1,
      title: "Estudiantes y Cursos",
      description: "Conecta estudiantes con sus cursos",
      table1: {
        name: "estudiantes",
        columns: [
          { id: 'id', name: 'id', type: 'primary_key', color: '#f39c12' },
          { id: 'nombre', name: 'nombre', type: 'text', color: '#3498db' },
          { id: 'carrera', name: 'carrera', type: 'text', color: '#2ecc71' }
        ],
        data: [
          { id: 1, nombre: 'Juan Pérez', carrera: 'Sistemas' },
          { id: 2, nombre: 'María García', carrera: 'Medicina' }
        ]
      },
      table2: {
        name: "cursos",
        columns: [
          { id: 'id', name: 'id', type: 'primary_key', color: '#f39c12' },
          { id: 'nombre', name: 'nombre', type: 'text', color: '#3498db' },
          { id: 'estudiante_id', name: 'estudiante_id', type: 'foreign_key', color: '#e74c3c' }
        ],
        data: [
          { id: 1, nombre: 'Programación I', estudiante_id: 1 },
          { id: 2, nombre: 'Bases de Datos', estudiante_id: 1 },
          { id: 3, nombre: 'Anatomía', estudiante_id: 2 }
        ]
      },
      correctConnections: [
        { from: 'estudiantes.id', to: 'cursos.estudiante_id', type: 'one_to_many' }
      ]
    },
    {
      id: 2,
      title: "Productos y Categorías",
      description: "Relaciona productos con sus categorías",
      table1: {
        name: "categorias",
        columns: [
          { id: 'id', name: 'id', type: 'primary_key', color: '#f39c12' },
          { id: 'nombre', name: 'nombre', type: 'text', color: '#3498db' }
        ],
        data: [
          { id: 1, nombre: 'Electrónicos' },
          { id: 2, nombre: 'Ropa' }
        ]
      },
      table2: {
        name: "productos",
        columns: [
          { id: 'id', name: 'id', type: 'primary_key', color: '#f39c12' },
          { id: 'nombre', name: 'nombre', type: 'text', color: '#3498db' },
          { id: 'precio', name: 'precio', type: 'decimal', color: '#2ecc71' },
          { id: 'categoria_id', name: 'categoria_id', type: 'foreign_key', color: '#e74c3c' }
        ],
        data: [
          { id: 1, nombre: 'Laptop HP', precio: 1500000, categoria_id: 1 },
          { id: 2, nombre: 'Mouse Logitech', precio: 85000, categoria_id: 1 },
          { id: 3, nombre: 'Camiseta Nike', precio: 120000, categoria_id: 2 }
        ]
      },
      correctConnections: [
        { from: 'categorias.id', to: 'productos.categoria_id', type: 'one_to_many' }
      ]
    },
    {
      id: 3,
      title: "Empleados y Departamentos",
      description: "Conecta empleados con departamentos y jefes",
      table1: {
        name: "departamentos",
        columns: [
          { id: 'id', name: 'id', type: 'primary_key', color: '#f39c12' },
          { id: 'nombre', name: 'nombre', type: 'text', color: '#3498db' }
        ],
        data: [
          { id: 1, nombre: 'Desarrollo' },
          { id: 2, nombre: 'Marketing' }
        ]
      },
      table2: {
        name: "empleados",
        columns: [
          { id: 'id', name: 'id', type: 'primary_key', color: '#f39c12' },
          { id: 'nombre', name: 'nombre', type: 'text', color: '#3498db' },
          { id: 'departamento_id', name: 'departamento_id', type: 'foreign_key', color: '#e74c3c' },
          { id: 'jefe_id', name: 'jefe_id', type: 'foreign_key', color: '#9b59b6' }
        ],
        data: [
          { id: 1, nombre: 'Ana López', departamento_id: 1, jefe_id: null },
          { id: 2, nombre: 'Carlos Ruiz', departamento_id: 1, jefe_id: 1 },
          { id: 3, nombre: 'Laura Torres', departamento_id: 2, jefe_id: null }
        ]
      },
      correctConnections: [
        { from: 'departamentos.id', to: 'empleados.departamento_id', type: 'one_to_many' },
        { from: 'empleados.id', to: 'empleados.jefe_id', type: 'self_reference' }
      ]
    }
  ];

  // Inicializar desafío
  useEffect(() => {
    if (gamePhase === 'playing') {
      const challenge = challenges[currentChallenge - 1];
      setTable1(challenge.table1);
      setTable2(challenge.table2);
      setConnections([]);
      setValidationResult(null);
      setSelectedColumn1(null);
      setSelectedColumn2(null);
    }
  }, [currentChallenge, gamePhase]);

  // Comenzar el juego
  const startGame = () => {
    setGamePhase('playing');
  };

  // Manejar selección de columna
  const handleColumnClick = (column, tableName) => {
    const columnInfo = { ...column, tableName };
    
    // Si no hay ninguna columna seleccionada, seleccionar la primera
    if (!selectedColumn1) {
      setSelectedColumn1(columnInfo);
      return;
    }
    
    // Si hay una columna seleccionada, seleccionar la segunda
    if (!selectedColumn2) {
      // Verificar que no sea la misma columna
      if (selectedColumn1.tableName === tableName && selectedColumn1.id === column.id) {
        return;
      }
      
      setSelectedColumn2(columnInfo);
      
      // Crear conexión automáticamente
      const fromTableName = selectedColumn1.tableName === 'table1' ? table1.name : table2.name;
      const toTableName = tableName === 'table1' ? table1.name : table2.name;
      
      const connection = {
        id: `${fromTableName}.${selectedColumn1.id}-${toTableName}.${column.id}`,
        from: `${fromTableName}.${selectedColumn1.id}`,
        to: `${toTableName}.${column.id}`,
        fromTable: selectedColumn1.tableName,
        toTable: tableName,
        fromColumn: selectedColumn1.id,
        toColumn: column.id
      };

      // Verificar si ya existe una conexión similar
      const existingConnection = connections.find(conn => 
        (conn.from === connection.from && conn.to === connection.to) ||
        (conn.from === connection.to && conn.to === connection.from)
      );

      if (!existingConnection) {
        setConnections(prev => [...prev, connection]);
      }
      
      // Limpiar selecciones
      setSelectedColumn1(null);
      setSelectedColumn2(null);
    }
  };

  // Limpiar selecciones
  const clearSelections = () => {
    setSelectedColumn1(null);
    setSelectedColumn2(null);
  };

  // Remover conexión
  const removeConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  // Validar conexiones
  const validateConnections = () => {
    const challenge = challenges[currentChallenge - 1];
    const correctConnections = challenge.correctConnections;
    
    // Mapear nombres de tablas reales
    const table1Name = table1 ? table1.name : '';
    const table2Name = table2 ? table2.name : '';
    
    let correct = 0;
    let total = correctConnections.length;
    const errors = [];

    correctConnections.forEach(correctConn => {
      const foundConnection = connections.find(conn => 
        (conn.from === correctConn.from && conn.to === correctConn.to) ||
        (conn.from === correctConn.to && conn.to === correctConn.from)
      );

      if (foundConnection) {
        correct++;
      } else {
        errors.push(`Falta conectar: ${correctConn.from} ↔ ${correctConn.to}`);
      }
    });

    // Verificar conexiones incorrectas
    connections.forEach(conn => {
      const isCorrect = correctConnections.some(correctConn => 
        (conn.from === correctConn.from && conn.to === correctConn.to) ||
        (conn.from === correctConn.to && conn.to === correctConn.from)
      );

      if (!isCorrect) {
        errors.push(`Conexión incorrecta: ${conn.from} ↔ ${conn.to}`);
      }
    });

    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    const isSuccess = accuracy >= 100 && connections.length === correct; // 100% de precisión

    setValidationResult({
      success: isSuccess,
      accuracy: Math.round(accuracy),
      correct,
      total,
      errors: errors.slice(0, 5) // Mostrar solo los primeros 5 errores
    });

    if (isSuccess) {
      const points = 300 * currentChallenge;
      setScore(prev => prev + points);
      updateScore(points);
      setCompletedChallenges(prev => prev + 1);

      setTimeout(() => {
        if (currentChallenge >= challenges.length) {
          setGamePhase('completed');
          setTimeout(() => onComplete(), 3000);
        } else {
          setCurrentChallenge(prev => prev + 1);
          setValidationResult(null);
        }
      }, 3000);
    }
  };

  // Obtener desafío actual
  const getCurrentChallenge = () => {
    return challenges[currentChallenge - 1];
  };

  // Renderizar tabla
  const renderTable = (table, tableName) => {
    if (!table) return null;

    return (
      <div className="table-container">
        <h4>📊 Tabla: {table.name}</h4>
        <div className="table-structure">
          <div className="table-header">
            {table.columns.map(column => {
              const isSelected = 
                (selectedColumn1?.tableName === tableName && selectedColumn1?.id === column.id) ||
                (selectedColumn2?.tableName === tableName && selectedColumn2?.id === column.id);
              
              return (
                <div 
                  key={column.id}
                  className={`table-column-header ${column.type === 'primary_key' ? 'primary-key' : 
                            column.type === 'foreign_key' ? 'foreign-key' : 'regular-column'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleColumnClick(column, tableName)}
                  style={{ backgroundColor: column.color }}
                >
                  <div className="column-name">{column.name}</div>
                  <div className="column-type">{column.type}</div>
                  {column.type === 'primary_key' && <div className="key-indicator">🔑</div>}
                  {column.type === 'foreign_key' && <div className="key-indicator">🔗</div>}
                  {isSelected && <div className="selection-indicator">👆</div>}
                </div>
              );
            })}
          </div>
          
          <div className="table-body">
            {table.data.map((row, index) => (
              <div key={index} className="table-row">
                {table.columns.map(column => (
                  <div key={column.id} className="table-cell">
                    {row[column.id]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar conexiones
  const renderConnections = () => {
    return (
      <div className="connections-area">
        <h5>🔗 Conexiones Establecidas</h5>
        <div className="connections-list">
          {connections.map(connection => (
            <div key={connection.id} className="connection-item">
              <span className="connection-text">
                {connection.from} ↔ {connection.to}
              </span>
              <button 
                className="remove-connection-btn"
                onClick={() => removeConnection(connection.id)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
        {connections.length === 0 && (
          <p className="no-connections">No hay conexiones establecidas</p>
        )}
      </div>
    );
  };

  return (
    <div className="table-relations-puzzle-overlay">
      <div className="table-relations-puzzle-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 3: El Pantano de las Relaciones</h3>
          <p>Conecta las tablas arrastrando las llaves entre columnas</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Puntuación */}
        <div className="score-display">
          <div className="score-stat">🏆 Puntuación: {score}</div>
          <div className="progress-stat">📊 Progreso: {completedChallenges}/{challenges.length}</div>
        </div>

        {gamePhase === 'intro' && (
          <div className="intro-screen">
            <div className="swamp-relations-scene">
              <div className="relations-visualization">
                <div className="separated-tables">📊🪨📊</div>
                <div className="missing-connections">
                  <div className="broken-bridge">🌉❌🌉</div>
                  <p>¡Las tablas están desconectadas!</p>
                </div>
              </div>
            </div>
            
            <div className="intro-content">
              <h4>🎯 Tu Misión</h4>
              <p>Las tablas están separadas como nenúfares en un pantano. Debes conectarlas creando relaciones entre sus columnas.</p>
              <p>Arrastra las llaves (🔑 primaria, 🔗 foránea) entre las columnas que deben relacionarse.</p>
              
              <div className="relation-concepts">
                <h5>📚 Tipos de Relaciones:</h5>
                <div className="concept-cards">
                  <div className="concept-card">
                    <h6>🔑 Clave Primaria</h6>
                    <p>Identificador único en una tabla</p>
                  </div>
                  <div className="concept-card">
                    <h6>🔗 Clave Foránea</h6>
                    <p>Referencia a una clave primaria</p>
                  </div>
                  <div className="concept-card">
                    <h6>🌉 Relación 1:N</h6>
                    <p>Uno a muchos entre tablas</p>
                  </div>
                </div>
              </div>
              
              <button className="start-btn" onClick={startGame}>
                🚀 Comenzar Conexiones
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'playing' && (
          <div className="playing-area">
            <div className="challenge-info">
              <h4>🌊 Desafío {currentChallenge}/{challenges.length}: {getCurrentChallenge().title}</h4>
              <p>{getCurrentChallenge().description}</p>
            </div>

            {/* Tablas separadas */}
            <div className="tables-area">
              <div className="table-platform">
                {renderTable(table1, 'table1')}
              </div>
              
            <div className="connection-space">
              <div className="connection-instructions">
                <p>🔗 Haz clic en las columnas para conectarlas</p>
                <p>👆 Selecciona una columna de cada tabla para crear una relación</p>
              </div>
              
              {/* Estado de selección */}
              {(selectedColumn1 || selectedColumn2) && (
                <div className="selection-status">
                  <p>Primera columna: {selectedColumn1 ? `${selectedColumn1.tableName === 'table1' ? (table1 ? table1.name : 'table1') : (table2 ? table2.name : 'table2')}.${selectedColumn1.name}` : 'No seleccionada'}</p>
                  <p>Segunda columna: {selectedColumn2 ? `${selectedColumn2.tableName === 'table1' ? (table1 ? table1.name : 'table1') : (table2 ? table2.name : 'table2')}.${selectedColumn2.name}` : 'No seleccionada'}</p>
                  <button className="clear-selection-btn" onClick={clearSelections}>
                    🗑️ Limpiar Selección
                  </button>
                </div>
              )}
            </div>
              
              <div className="table-platform">
                {renderTable(table2, 'table2')}
              </div>
            </div>

            {/* Conexiones */}
            <div className="connections-section">
              {renderConnections()}
            </div>

            {/* Controles */}
            <div className="controls">
              <button 
                className="validate-btn"
                onClick={validateConnections}
                disabled={connections.length === 0}
              >
                🔍 Validar Conexiones
              </button>
            </div>

            {/* Resultado de validación */}
            {validationResult && (
              <div className={`validation-result ${validationResult.success ? 'success' : 'failure'}`}>
                <div className="result-header">
                  <h5>
                    {validationResult.success ? '✅ ¡Relaciones Correctas!' : '❌ Conexiones Incorrectas'}
                  </h5>
                </div>
                
                <div className="result-content">
                  <p><strong>Precisión:</strong> {validationResult.accuracy}%</p>
                  <p><strong>Correctas:</strong> {validationResult.correct}/{validationResult.total}</p>
                  
                  {validationResult.success ? (
                    <div className="success-details">
                      <div className="success-animation">
                        <div className="data-bridges">🌉✨🌉✨</div>
                        <p>¡Los puentes de datos conectan las tablas perfectamente!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="error-details">
                      <h6>Errores encontrados:</h6>
                      <ul>
                        {validationResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                      <p>💡 Revisa las conexiones y asegúrate de conectar las columnas correctas</p>
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
              <div className="connected-data">🌉📊🌉📊</div>
              <div className="success-message">
                <h3>🎉 ¡Excelente Trabajo!</h3>
                <p>Has dominado las relaciones entre tablas</p>
                <p>Puntuación total: {score}</p>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .table-relations-puzzle-overlay {
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

          .table-relations-puzzle-container {
            width: 95%;
            max-width: 1400px;
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

          .swamp-relations-scene {
            margin-bottom: 2rem;
          }

          .relations-visualization {
            background: rgba(0, 0, 0, 0.5);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 1rem;
          }

          .separated-tables {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: tables-float 2s ease-in-out infinite alternate;
          }

          .broken-bridge {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: bridge-shake 1.5s ease-in-out infinite;
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

          .relation-concepts {
            margin: 2rem 0;
          }

          .relation-concepts h5 {
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
            margin: 0;
          }

          .tables-area {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;
            min-height: 400px;
          }

          .table-platform {
            flex: 1;
            background: rgba(46, 204, 113, 0.1);
            padding: 1rem;
            border-radius: 15px;
            border: 3px solid #2ecc71;
            position: relative;
          }

          .table-platform::before {
            content: '🪷';
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2rem;
          }

          .connection-space {
            flex: 0 0 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .connection-instructions {
            text-align: center;
            background: rgba(241, 196, 15, 0.2);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #f1c40f;
          }

          .connection-instructions p {
            color: #f1c40f;
            font-size: 0.6rem;
            margin: 0 0 0.5rem 0;
          }

          .selection-status {
            background: rgba(52, 152, 219, 0.1);
            padding: 1rem;
            border-radius: 8px;
            border: 2px solid #3498db;
            margin-top: 1rem;
          }

          .selection-status p {
            color: #3498db;
            font-size: 0.6rem;
            margin-bottom: 0.5rem;
          }

          .clear-selection-btn {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.5rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .clear-selection-btn:hover {
            background: #c0392b;
            transform: scale(1.05);
          }

          .table-container {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 10px;
          }

          .table-container h4 {
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
            background: #34495e;
            color: white;
            font-weight: bold;
          }

          .table-column-header {
            padding: 1rem;
            font-size: 0.6rem;
            border-right: 1px solid #2c3e50;
            min-width: 120px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
          }

          .table-column-header:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
          }

          .table-column-header.selected {
            border: 3px solid #f39c12;
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(243, 156, 18, 0.5);
          }

          .table-column-header.primary-key {
            background: #f39c12;
          }

          .table-column-header.foreign-key {
            background: #e74c3c;
          }

          .column-name {
            margin-bottom: 0.3rem;
          }

          .column-type {
            font-size: 0.5rem;
            opacity: 0.8;
          }

          .key-indicator {
            position: absolute;
            top: 0.3rem;
            right: 0.3rem;
            font-size: 0.8rem;
          }

          .selection-indicator {
            position: absolute;
            top: 0.3rem;
            left: 0.3rem;
            font-size: 0.8rem;
            animation: selection-pulse 1s ease-in-out infinite;
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
            min-width: 120px;
            text-align: center;
          }

          .connections-section {
            margin-bottom: 2rem;
          }

          .connections-area {
            background: rgba(52, 152, 219, 0.1);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #3498db;
          }

          .connections-area h5 {
            color: #3498db;
            font-size: 0.8rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .connections-list {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            min-height: 60px;
          }

          .connection-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(46, 204, 113, 0.2);
            padding: 0.8rem;
            border-radius: 8px;
            border: 2px solid #2ecc71;
          }

          .connection-text {
            color: #2ecc71;
            font-size: 0.6rem;
            font-family: 'Courier New', monospace;
          }

          .remove-connection-btn {
            background: #e74c3c;
            color: white;
            border: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 0.6rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .remove-connection-btn:hover {
            background: #c0392b;
            transform: scale(1.1);
          }

          .no-connections {
            color: #7f8c8d;
            font-size: 0.6rem;
            text-align: center;
            font-style: italic;
          }

          .controls {
            text-align: center;
            margin-bottom: 2rem;
          }

          .validate-btn {
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

          .validate-btn:hover:not(:disabled) {
            background: #27ae60;
            transform: translateY(-2px);
          }

          .validate-btn:disabled {
            background: #7f8c8d;
            cursor: not-allowed;
          }

          .validation-result {
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
          }

          .validation-result.success {
            border: 3px solid #2ecc71;
          }

          .validation-result.failure {
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

          .data-bridges {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: bridges-glow 1s ease-in-out infinite alternate;
          }

          .error-details {
            background: rgba(231, 76, 60, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
          }

          .error-details h6 {
            color: #e74c3c;
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
          }

          .error-details ul {
            list-style: none;
            padding: 0;
          }

          .error-details li {
            font-size: 0.6rem;
            color: #e74c3c;
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

          .connected-data {
            font-size: 4rem;
            margin-bottom: 2rem;
            animation: data-celebration 2s ease-in-out infinite;
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

          @keyframes tables-float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }

          @keyframes bridge-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes bridges-glow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.5) drop-shadow(0 0 10px #2ecc71); }
          }

        @keyframes data-celebration {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }

        @keyframes selection-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

          @media (max-width: 768px) {
            .tables-area {
              flex-direction: column;
              gap: 1rem;
            }
            
            .connection-space {
              flex: none;
              order: -1;
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

export default TableRelationsPuzzle;
