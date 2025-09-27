import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const DataModelingPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del puzzle
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, completed
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [mixedData, setMixedData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  // Desafíos de modelado de datos
  const challenges = [
    {
      id: 1,
      title: "Estudiantes",
      description: "Organiza los datos de estudiantes en columnas correctas",
      tableName: "estudiantes",
      columns: [
        { id: 'id', name: 'ID', type: 'primary_key', color: '#f39c12', required: true },
        { id: 'nombre', name: 'Nombre', type: 'text', color: '#3498db', required: true },
        { id: 'edad', name: 'Edad', type: 'number', color: '#2ecc71', required: true },
        { id: 'carrera', name: 'Carrera', type: 'text', color: '#9b59b6', required: true }
      ],
      mixedData: [
        { id: 'data1', value: 'Juan Pérez', type: 'nombre', correctColumn: 'nombre' },
        { id: 'data2', value: '001', type: 'id', correctColumn: 'id' },
        { id: 'data3', value: 'Ingeniería de Sistemas', type: 'carrera', correctColumn: 'carrera' },
        { id: 'data4', value: '22', type: 'edad', correctColumn: 'edad' },
        { id: 'data5', value: 'María García', type: 'nombre', correctColumn: 'nombre' },
        { id: 'data6', value: '002', type: 'id', correctColumn: 'id' },
        { id: 'data7', value: 'Medicina', type: 'carrera', correctColumn: 'carrera' },
        { id: 'data8', value: '20', type: 'edad', correctColumn: 'edad' }
      ]
    },
    {
      id: 2,
      title: "Productos",
      description: "Organiza los datos de productos en una tienda",
      tableName: "productos",
      columns: [
        { id: 'id', name: 'ID', type: 'primary_key', color: '#f39c12', required: true },
        { id: 'nombre', name: 'Producto', type: 'text', color: '#3498db', required: true },
        { id: 'precio', name: 'Precio', type: 'decimal', color: '#e74c3c', required: true },
        { id: 'categoria', name: 'Categoría', type: 'text', color: '#2ecc71', required: true },
        { id: 'stock', name: 'Stock', type: 'number', color: '#9b59b6', required: true }
      ],
      mixedData: [
        { id: 'data1', value: 'Laptop HP', type: 'nombre', correctColumn: 'nombre' },
        { id: 'data2', value: 'P001', type: 'id', correctColumn: 'id' },
        { id: 'data3', value: 'Electrónicos', type: 'categoria', correctColumn: 'categoria' },
        { id: 'data4', value: '1500000', type: 'precio', correctColumn: 'precio' },
        { id: 'data5', value: '25', type: 'stock', correctColumn: 'stock' },
        { id: 'data6', value: 'Mouse Logitech', type: 'nombre', correctColumn: 'nombre' },
        { id: 'data7', value: 'P002', type: 'id', correctColumn: 'id' },
        { id: 'data8', value: 'Accesorios', type: 'categoria', correctColumn: 'categoria' },
        { id: 'data9', value: '85000', type: 'precio', correctColumn: 'precio' },
        { id: 'data10', value: '100', type: 'stock', correctColumn: 'stock' }
      ]
    },
    {
      id: 3,
      title: "Empleados",
      description: "Organiza los datos de empleados de una empresa",
      tableName: "empleados",
      columns: [
        { id: 'id', name: 'ID', type: 'primary_key', color: '#f39c12', required: true },
        { id: 'nombre', name: 'Nombre', type: 'text', color: '#3498db', required: true },
        { id: 'email', name: 'Email', type: 'email', color: '#e67e22', required: true },
        { id: 'departamento', name: 'Departamento', type: 'text', color: '#2ecc71', required: true },
        { id: 'salario', name: 'Salario', type: 'decimal', color: '#8e44ad', required: true },
        { id: 'fecha_ingreso', name: 'Fecha Ingreso', type: 'date', color: '#16a085', required: true }
      ],
      mixedData: [
        { id: 'data1', value: 'Ana López', type: 'nombre', correctColumn: 'nombre' },
        { id: 'data2', value: 'E001', type: 'id', correctColumn: 'id' },
        { id: 'data3', value: 'ana.lopez@empresa.com', type: 'email', correctColumn: 'email' },
        { id: 'data4', value: 'Desarrollo', type: 'departamento', correctColumn: 'departamento' },
        { id: 'data5', value: '5000000', type: 'salario', correctColumn: 'salario' },
        { id: 'data6', value: '2023-01-15', type: 'fecha_ingreso', correctColumn: 'fecha_ingreso' },
        { id: 'data7', value: 'Carlos Ruiz', type: 'nombre', correctColumn: 'nombre' },
        { id: 'data8', value: 'E002', type: 'id', correctColumn: 'id' },
        { id: 'data9', value: 'carlos.ruiz@empresa.com', type: 'email', correctColumn: 'email' },
        { id: 'data10', value: 'Marketing', type: 'departamento', correctColumn: 'departamento' },
        { id: 'data11', value: '4000000', type: 'salario', correctColumn: 'salario' },
        { id: 'data12', value: '2023-03-20', type: 'fecha_ingreso', correctColumn: 'fecha_ingreso' }
      ]
    }
  ];

  // Inicializar desafío
  useEffect(() => {
    if (gamePhase === 'playing') {
      const challenge = challenges[currentChallenge - 1];
      setMixedData([...challenge.mixedData]);
      setTableColumns(challenge.columns.map(col => ({ ...col, data: [] })));
      setValidationResult(null);
    }
  }, [currentChallenge, gamePhase]);

  // Comenzar el juego
  const startGame = () => {
    setGamePhase('playing');
  };

  // Manejar inicio del drag
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Manejar drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Manejar drop en columna
  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Verificar si ya existe en alguna columna
    const isAlreadyPlaced = tableColumns.some(col => 
      col.data.some(data => data.id === draggedItem.id)
    );

    if (isAlreadyPlaced) {
      // Remover de la columna actual
      setTableColumns(prev => prev.map(col => ({
        ...col,
        data: col.data.filter(data => data.id !== draggedItem.id)
      })));
    }

    // Agregar a la nueva columna
    setTableColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, data: [...col.data, draggedItem] }
        : col
    ));

    setDraggedItem(null);
  };

  // Función para reorganizar datos por filas
  const organizeDataByRows = () => {
    const challenge = getCurrentChallenge();
    const organizedRows = [];
    
    // Obtener todos los datos de todas las columnas
    const allData = [];
    challenge.columns.forEach(column => {
      const columnData = tableColumns.find(col => col.id === column.id)?.data || [];
      columnData.forEach(data => {
        allData.push({ ...data, columnId: column.id });
      });
    });

    // Agrupar datos por grupos relacionados (mismo índice en los datos originales)
    const dataGroups = {};
    challenge.mixedData.forEach((originalData, index) => {
      const placedData = allData.find(data => data.id === originalData.id);
      if (placedData) {
        if (!dataGroups[index]) {
          dataGroups[index] = {};
        }
        dataGroups[index][placedData.columnId] = placedData;
      }
    });

    // Convertir grupos a filas
    Object.values(dataGroups).forEach(group => {
      const row = {};
      challenge.columns.forEach(column => {
        row[column.id] = group[column.id] || null;
      });
      organizedRows.push(row);
    });

    // Agregar filas vacías para datos sueltos
    const maxRows = Math.max(...Object.values(dataGroups).map(group => 
      Object.keys(group).length
    ));
    
    // Si hay menos filas que el máximo, agregar filas vacías
    while (organizedRows.length < maxRows) {
      const emptyRow = {};
      challenge.columns.forEach(column => {
        emptyRow[column.id] = null;
      });
      organizedRows.push(emptyRow);
    }
    
    return organizedRows;
  };

  // Validar organización
  const validateOrganization = () => {
    const challenge = challenges[currentChallenge - 1];
    let correct = 0;
    let total = 0;
    const errors = [];

    challenge.columns.forEach(column => {
      const columnData = tableColumns.find(col => col.id === column.id)?.data || [];
      
      columnData.forEach(data => {
        total++;
        if (data.correctColumn === column.id) {
          correct++;
        } else {
          errors.push(`"${data.value}" debería estar en la columna "${column.name}"`);
        }
      });
    });

    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    const isSuccess = accuracy >= 80; // 80% de precisión requerida

    setValidationResult({
      success: isSuccess,
      accuracy: Math.round(accuracy),
      correct,
      total,
      errors: errors.slice(0, 3) // Mostrar solo los primeros 3 errores
    });

    if (isSuccess) {
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
          setValidationResult(null);
        }
      }, 3000);
    }
  };

  // Obtener desafío actual
  const getCurrentChallenge = () => {
    return challenges[currentChallenge - 1];
  };

  // Renderizar datos mezclados
  const renderMixedData = () => {
    return mixedData.map(item => {
      const isPlaced = tableColumns.some(col => 
        col.data.some(data => data.id === item.id)
      );

      if (isPlaced) return null;

      return (
        <div
          key={item.id}
          className="data-card"
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
        >
          <div className="data-value">{item.value}</div>
          <div className="data-type">{item.type}</div>
        </div>
      );
    });
  };

  // Renderizar tabla
  const renderTable = () => {
    const challenge = getCurrentChallenge();
    const organizedRows = organizeDataByRows();
    
    return (
      <div className="table-container">
        <h4>📊 Tabla: {challenge.tableName}</h4>
        <div className="table-wrapper">
          <table className="data-table">
            {/* Header de la tabla */}
            <thead>
              <tr>
                {challenge.columns.map(column => (
                  <th 
                    key={column.id}
                    className="table-header"
                    style={{ backgroundColor: column.color }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    <div className="header-content">
                      <div className="column-name">{column.name}</div>
                      <div className="column-type">{column.type}</div>
                      {column.type === 'primary_key' && <div className="key-indicator">🔑</div>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Filas de datos */}
            <tbody>
              {organizedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="table-row">
                  {challenge.columns.map((column, cellIndex) => (
                    <td 
                      key={cellIndex}
                      className="table-cell"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, column.id)}
                    >
                      {row[column.id] ? (
                        <div className="data-item">
                          {row[column.id].value}
                        </div>
                      ) : (
                        <div className="empty-cell">
                          {rowIndex === 0 && cellIndex === 0 && "Arrastra datos aquí"}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Fila vacía adicional para más datos */}
              <tr className="table-row">
                {challenge.columns.map((column, index) => (
                  <td 
                    key={index}
                    className="table-cell drop-zone"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    <div className="empty-cell">
                      {index === 0 && "Arrastra más datos aquí"}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="data-modeling-puzzle-overlay">
      <div className="data-modeling-puzzle-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 1: Organiza la Tabla</h3>
          <p>Arrastra los datos mezclados a las columnas correctas</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Puntuación */}
        <div className="score-display">
          <div className="score-stat">🏆 Puntuación: {score}</div>
          <div className="progress-stat">📊 Progreso: {completedChallenges}/{challenges.length}</div>
        </div>

        {gamePhase === 'intro' && (
          <div className="intro-screen">
            <div className="swamp-data-scene">
              <div className="data-visualization">
                <div className="mixed-data">📄📊📋📄</div>
                <div className="disorganized-table">
                  <div className="table-chaos">📊❌📊❌</div>
                  <p>¡Los datos están mezclados!</p>
                </div>
              </div>
            </div>
            
            <div className="intro-content">
              <h4>🎯 Tu Misión</h4>
              <p>Los datos están desorganizados en el pantano. Debes organizarlos en tablas con columnas correctas.</p>
              <p>Arrastra cada dato a su columna correspondiente para crear una estructura de base de datos válida.</p>
              
              <div className="data-concepts">
                <h5>📚 Conceptos que aprenderás:</h5>
                <div className="concept-cards">
                  <div className="concept-card">
                    <h6>🔑 Clave Primaria</h6>
                    <p>Identificador único para cada fila</p>
                  </div>
                  <div className="concept-card">
                    <h6>📊 Columnas</h6>
                    <p>Atributos que describen los datos</p>
                  </div>
                  <div className="concept-card">
                    <h6>📋 Filas</h6>
                    <p>Registros individuales de datos</p>
                  </div>
                </div>
              </div>
              
              <button className="start-btn" onClick={startGame}>
                🚀 Comenzar Organización
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

            {/* Datos mezclados */}
            <div className="mixed-data-area">
              <h5>📄 Datos Mezclados</h5>
              <div className="mixed-data-container">
                {renderMixedData()}
              </div>
            </div>

            {/* Tabla */}
            <div className="table-area">
              {renderTable()}
            </div>

            {/* Controles */}
            <div className="controls">
              <button 
                className="validate-btn"
                onClick={validateOrganization}
                disabled={mixedData.some(item => !tableColumns.some(col => 
                  col.data.some(data => data.id === item.id)
                ))}
              >
                🔍 Validar Organización
              </button>
            </div>

            {/* Resultado de validación */}
            {validationResult && (
              <div className={`validation-result ${validationResult.success ? 'success' : 'failure'}`}>
                <div className="result-header">
                  <h5>
                    {validationResult.success ? '✅ ¡Tabla Organizada!' : '❌ Datos Inconsistentes'}
                  </h5>
                </div>
                
                <div className="result-content">
                  <p><strong>Precisión:</strong> {validationResult.accuracy}%</p>
                  <p><strong>Correctos:</strong> {validationResult.correct}/{validationResult.total}</p>
                  
                  {validationResult.success ? (
                    <div className="success-details">
                      <div className="success-animation">
                        <div className="golden-keys">🔑✨🔑✨</div>
                        <p>¡Las llaves doradas indican una estructura perfecta!</p>
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
                      <p>💡 Intenta reorganizar los datos en las columnas correctas</p>
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
              <div className="organized-data">📊✅📊✅</div>
              <div className="success-message">
                <h3>🎉 ¡Excelente Trabajo!</h3>
                <p>Has dominado el modelado de datos básico</p>
                <p>Puntuación total: {score}</p>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .data-modeling-puzzle-overlay {
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

          .data-modeling-puzzle-container {
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

          .swamp-data-scene {
            margin-bottom: 2rem;
          }

          .data-visualization {
            background: rgba(0, 0, 0, 0.5);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 1rem;
          }

          .mixed-data {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: data-float 2s ease-in-out infinite alternate;
          }

          .table-chaos {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: chaos-shake 1.5s ease-in-out infinite;
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

          .data-concepts {
            margin: 2rem 0;
          }

          .data-concepts h5 {
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

          .mixed-data-area {
            margin-bottom: 2rem;
          }

          .mixed-data-area h5 {
            color: #e74c3c;
            font-size: 0.8rem;
            margin-bottom: 1rem;
          }

          .mixed-data-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            background: rgba(231, 76, 60, 0.1);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #e74c3c;
            min-height: 120px;
          }

          .data-card {
            background: #fff;
            color: #2c3e50;
            padding: 0.8rem;
            border-radius: 8px;
            cursor: grab;
            transition: all 0.3s;
            border: 2px solid transparent;
            min-width: 100px;
            text-align: center;
          }

          .data-card:hover {
            transform: scale(1.05);
            border-color: #3498db;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
          }

          .data-card:active {
            cursor: grabbing;
          }

          .data-value {
            font-size: 0.7rem;
            font-weight: bold;
            margin-bottom: 0.3rem;
          }

          .data-type {
            font-size: 0.5rem;
            color: #7f8c8d;
            background: #ecf0f1;
            padding: 0.2rem;
            border-radius: 4px;
          }

          .table-area {
            margin-bottom: 2rem;
          }

          .table-container {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #3498db;
            margin-bottom: 1rem;
          }

          .table-container h4 {
            color: #3498db;
            font-size: 0.8rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            border: 2px solid #34495e;
            background: rgba(255, 255, 255, 0.1);
          }

          .data-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'Press Start 2P', monospace;
            background: rgba(255, 255, 255, 0.05);
          }

          .table-header {
            background: #34495e;
            color: white;
            padding: 0.8rem;
            text-align: center;
            border: 1px solid #2c3e50;
            position: relative;
            min-width: 120px;
            transition: all 0.3s;
          }

          .table-header:hover {
            background: #3498db;
            transform: scale(1.02);
          }

          .header-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
          }

          .column-name {
            font-size: 0.6rem;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          }

          .column-type {
            font-size: 0.4rem;
            opacity: 0.9;
            background: rgba(0, 0, 0, 0.3);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
          }

          .key-indicator {
            position: absolute;
            top: 0.3rem;
            right: 0.3rem;
            font-size: 0.8rem;
            animation: key-pulse 2s ease-in-out infinite;
          }

          .table-row {
            border-bottom: 1px solid #34495e;
          }

          .table-cell {
            padding: 0.6rem;
            border: 1px solid #34495e;
            text-align: center;
            vertical-align: middle;
            min-width: 120px;
            min-height: 50px;
            transition: all 0.3s;
            position: relative;
          }

          .table-cell:hover {
            background: rgba(52, 152, 219, 0.1);
            border-color: #3498db;
          }

          .table-cell.drop-zone {
            border: 2px dashed #7f8c8d;
            background: rgba(127, 128, 128, 0.1);
          }

          .table-cell.drop-zone:hover {
            border-color: #3498db;
            background: rgba(52, 152, 219, 0.2);
          }

          .data-item {
            background: #ecf0f1;
            color: #2c3e50;
            padding: 0.4rem 0.6rem;
            border-radius: 4px;
            font-size: 0.5rem;
            text-align: center;
            border: 1px solid #bdc3c7;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
            word-break: break-word;
          }

          .data-item:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .empty-cell {
            color: #7f8c8d;
            font-size: 0.4rem;
            font-style: italic;
            opacity: 0.6;
            padding: 0.5rem;
            min-height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
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

          .golden-keys {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: keys-glow 1s ease-in-out infinite alternate;
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

          .organized-data {
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

          @keyframes data-float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }

          @keyframes chaos-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes keys-glow {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.5) drop-shadow(0 0 10px #f39c12); }
          }

          @keyframes data-celebration {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
          }

          @keyframes key-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }

          @media (max-width: 768px) {
            .data-table {
              font-size: 0.4rem;
            }
            
            .table-header {
              padding: 0.5rem;
              min-width: 80px;
            }
            
            .column-name {
              font-size: 0.5rem;
            }
            
            .column-type {
              font-size: 0.3rem;
            }
            
            .table-cell {
              padding: 0.4rem;
              min-width: 80px;
              min-height: 40px;
            }
            
            .data-item {
              font-size: 0.4rem;
              padding: 0.3rem 0.4rem;
            }
            
            .empty-cell {
              font-size: 0.3rem;
              min-height: 25px;
            }
            
            .concept-cards {
              flex-direction: column;
              align-items: center;
            }
            
            .mixed-data-container {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DataModelingPuzzle;
