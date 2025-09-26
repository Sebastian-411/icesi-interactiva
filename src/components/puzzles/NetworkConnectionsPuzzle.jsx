import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const NetworkConnectionsPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado de los dispositivos y conexiones
  const [devices, setDevices] = useState([
    { id: 'pc1', type: 'pc', x: 100, y: 150, connected: false, label: 'PC 1' },
    { id: 'pc2', type: 'pc', x: 100, y: 250, connected: false, label: 'PC 2' },
    { id: 'pc3', type: 'pc', x: 100, y: 350, connected: false, label: 'PC 3' },
    { id: 'switch', type: 'switch', x: 300, y: 250, connected: false, label: 'Switch' },
    { id: 'router', type: 'router', x: 500, y: 250, connected: false, label: 'Router' },
    { id: 'internet', type: 'internet', x: 700, y: 250, connected: false, label: 'Internet' }
  ]);
  
  const [connections, setConnections] = useState([]);
  const [draggedCable, setDraggedCable] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDataFlow, setShowDataFlow] = useState(false);

  // Conexiones correctas esperadas
  const correctConnections = [
    { from: 'pc1', to: 'switch' },
    { from: 'pc2', to: 'switch' },
    { from: 'pc3', to: 'switch' },
    { from: 'switch', to: 'router' },
    { from: 'router', to: 'internet' }
  ];

  // Función para verificar si una conexión es válida
  const isValidConnection = (from, to) => {
    return correctConnections.some(conn => 
      (conn.from === from && conn.to === to) || 
      (conn.from === to && conn.to === from)
    );
  };

  // Manejar inicio de arrastre de cable
  const handleCableStart = (deviceId) => {
    setDraggedCable(deviceId);
  };

  // Manejar conexión de cable
  const handleCableConnect = (deviceId) => {
    if (draggedCable && draggedCable !== deviceId) {
      const newConnection = { from: draggedCable, to: deviceId };
      
      // Verificar si la conexión es válida
      if (isValidConnection(draggedCable, deviceId)) {
        // Verificar si la conexión ya existe
        const connectionExists = connections.some(conn =>
          (conn.from === draggedCable && conn.to === deviceId) ||
          (conn.from === deviceId && conn.to === draggedCable)
        );
        
        if (!connectionExists) {
          setConnections(prev => [...prev, newConnection]);
          
          // Marcar dispositivos como conectados
          setDevices(prev => prev.map(device => 
            device.id === draggedCable || device.id === deviceId
              ? { ...device, connected: true }
              : device
          ));
        }
      }
    }
    setDraggedCable(null);
  };

  // Verificar si el puzzle está completo
  useEffect(() => {
    if (connections.length === correctConnections.length) {
      const allCorrect = correctConnections.every(correctConn =>
        connections.some(conn =>
          (conn.from === correctConn.from && conn.to === correctConn.to) ||
          (conn.from === correctConn.to && conn.to === correctConn.from)
        )
      );
      
      if (allCorrect) {
        setIsCompleted(true);
        setShowDataFlow(true);
        updateScore(300);
        
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }
  }, [connections, onComplete, updateScore]);

  // Obtener posición de dispositivo
  const getDevicePosition = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    return device ? { x: device.x, y: device.y } : { x: 0, y: 0 };
  };

  // Renderizar icono de dispositivo
  const renderDeviceIcon = (device) => {
    const icons = {
      pc: '💻',
      switch: '🔀',
      router: '📡',
      internet: '🌐'
    };
    return icons[device.type] || '❓';
  };

  return (
    <div className="network-puzzle-overlay">
      <div className="network-puzzle-container">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 1: Conexiones Correctas</h3>
          <p>Conecta los dispositivos correctamente para establecer la red</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="network-diagram">
          <svg width="800" height="500" className="network-svg">
            {/* Renderizar conexiones */}
            {connections.map((conn, index) => {
              const fromPos = getDevicePosition(conn.from);
              const toPos = getDevicePosition(conn.to);
              const isValid = isValidConnection(conn.from, conn.to);
              
              return (
                <g key={index}>
                  <line
                    x1={fromPos.x + 50}
                    y1={fromPos.y + 50}
                    x2={toPos.x + 50}
                    y2={toPos.y + 50}
                    stroke={isValid ? "#27ae60" : "#e74c3c"}
                    strokeWidth="4"
                    className={`network-cable ${isValid ? 'valid' : 'invalid'}`}
                  />
                  
                  {/* Animación de datos si está completado */}
                  {showDataFlow && isValid && (
                    <circle
                      r="8"
                      fill="#3498db"
                      className="data-packet"
                    >
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={`M${fromPos.x + 50},${fromPos.y + 50} L${toPos.x + 50},${toPos.y + 50}`}
                      />
                      <text
                        textAnchor="middle"
                        dy="4"
                        fontSize="10"
                        fill="white"
                      >
                        01
                      </text>
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Cable siendo arrastrado */}
            {draggedCable && (
              <line
                x1={getDevicePosition(draggedCable).x + 50}
                y1={getDevicePosition(draggedCable).y + 50}
                x2={getDevicePosition(draggedCable).x + 50}
                y2={getDevicePosition(draggedCable).y + 50}
                stroke="#f39c12"
                strokeWidth="4"
                strokeDasharray="5,5"
                className="dragging-cable"
              />
            )}

            {/* Renderizar dispositivos */}
            {devices.map(device => (
              <g key={device.id}>
                <rect
                  x={device.x}
                  y={device.y}
                  width="100"
                  height="100"
                  rx="10"
                  fill={device.connected ? "#2ecc71" : "#ecf0f1"}
                  stroke={draggedCable === device.id ? "#f39c12" : "#bdc3c7"}
                  strokeWidth={draggedCable === device.id ? "4" : "2"}
                  className="device-container"
                  onClick={() => {
                    if (draggedCable) {
                      handleCableConnect(device.id);
                    } else {
                      handleCableStart(device.id);
                    }
                  }}
                />
                
                <text
                  x={device.x + 50}
                  y={device.y + 40}
                  textAnchor="middle"
                  fontSize="30"
                >
                  {renderDeviceIcon(device)}
                </text>
                
                <text
                  x={device.x + 50}
                  y={device.y + 70}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="'Press Start 2P', monospace"
                  fill="#2c3e50"
                >
                  {device.label}
                </text>
                
                {/* Indicador de conexión */}
                {device.connected && (
                  <circle
                    cx={device.x + 85}
                    cy={device.y + 15}
                    r="8"
                    fill="#27ae60"
                    className="connection-indicator"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="puzzle-instructions">
          <div className="instruction-panel">
            <h4>📋 Instrucciones:</h4>
            <ol>
              <li>Haz clic en un dispositivo para empezar a conectar</li>
              <li>Haz clic en otro dispositivo para completar la conexión</li>
              <li>Conecta todos los PCs al Switch</li>
              <li>Conecta el Switch al Router</li>
              <li>Conecta el Router a Internet</li>
            </ol>
          </div>
          
          <div className="progress-panel">
            <h4>📊 Progreso:</h4>
            <p>Conexiones: {connections.filter(conn => isValidConnection(conn.from, conn.to)).length}/{correctConnections.length}</p>
            {isCompleted && (
              <div className="completion-message">
                <h4>🎉 ¡Excelente!</h4>
                <p>Has establecido la topología de red correctamente.</p>
                <p>Observa cómo fluyen los datos a través de la red.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .network-puzzle-overlay {
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

        .network-puzzle-container {
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
          margin-bottom: 2rem;
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

        .network-diagram {
          margin-bottom: 2rem;
        }

        .network-svg {
          border: 2px solid #bdc3c7;
          border-radius: 10px;
          background: #f8f9fa;
        }

        .device-container {
          cursor: pointer;
          transition: all 0.2s;
        }

        .device-container:hover {
          filter: brightness(1.1);
        }

        .network-cable {
          transition: stroke 0.3s;
        }

        .network-cable.valid {
          animation: data-flow 1s infinite;
        }

        .network-cable.invalid {
          animation: error-flash 0.5s infinite;
        }

        .data-packet {
          font-family: 'Press Start 2P', monospace;
        }

        .connection-indicator {
          animation: pulse 1s infinite;
        }

        .puzzle-instructions {
          display: flex;
          gap: 2rem;
        }

        .instruction-panel,
        .progress-panel {
          flex: 1;
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 10px;
        }

        .instruction-panel h4,
        .progress-panel h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .instruction-panel ol {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.5;
        }

        .progress-panel p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          margin-bottom: 0.5rem;
        }

        .completion-message {
          background: #d5f4e6;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .completion-message h4 {
          color: #27ae60;
          margin-bottom: 0.5rem;
        }

        .completion-message p {
          color: #27ae60;
        }

        @keyframes data-flow {
          0%, 100% { stroke-dasharray: 10, 5; stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 15; }
        }

        @keyframes error-flash {
          0%, 100% { stroke: #e74c3c; }
          50% { stroke: #c0392b; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .dragging-cable {
          animation: dash 1s linear infinite;
        }

        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
      `}</style>
    </div>
  );
};

export default NetworkConnectionsPuzzle;
