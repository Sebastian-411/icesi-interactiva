import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const NetworkConnectionsPuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado de los dispositivos y conexiones - Posiciones hardcodeadas desordenadas
  const [devices, setDevices] = useState([
    // PCs distribuidos en diferentes posiciones
    { id: 'pc1', type: 'pc', x: 120, y: 150, connected: false, label: 'PC 1' },
    { id: 'pc2', type: 'pc', x: 200, y: 80, connected: false, label: 'PC 2' },
    { id: 'pc3', type: 'pc', x: 80, y: 280, connected: false, label: 'PC 3' },
    
    // Switch en posición central
    { id: 'switch', type: 'switch', x: 350, y: 200, connected: false, label: 'Switch' },
    
    // Router hacia la derecha
    { id: 'router', type: 'router', x: 550, y: 180, connected: false, label: 'Router' },
    
    // Internet en esquina superior derecha
    { id: 'internet', type: 'internet', x: 650, y: 120, connected: false, label: 'Internet' },
    
    // Distractores distribuidos
    { id: 'fake-server', type: 'server', x: 250, y: 300, connected: false, label: 'Servidor', isDistractor: true },
    { id: 'fake-cloud', type: 'cloud', x: 500, y: 320, connected: false, label: 'Nube Privada', isDistractor: true },
    { id: 'fake-hub', type: 'hub', x: 450, y: 100, connected: false, label: 'Hub', isDistractor: true }
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

  // Manejar handshake TCP (solo para puzzle #2)
  const handleTCPHandshake = (deviceId) => {
    // Solo activar handshake TCP en el puzzle #2 (Packet Adventure)
    // Para el puzzle #1 (Network Connections) usar conexión directa
    handleCableConnect(deviceId);
  };

  // Función para regenerar posiciones hardcodeadas alternativas
  const regeneratePositions = () => {
    const alternativePositions = [
      // Configuración alternativa 1
      [
        { id: 'pc1', type: 'pc', x: 100, y: 100, connected: false, label: 'PC 1' },
        { id: 'pc2', type: 'pc', x: 150, y: 250, connected: false, label: 'PC 2' },
        { id: 'pc3', type: 'pc', x: 200, y: 150, connected: false, label: 'PC 3' },
        { id: 'switch', type: 'switch', x: 400, y: 180, connected: false, label: 'Switch' },
        { id: 'router', type: 'router', x: 600, y: 200, connected: false, label: 'Router' },
        { id: 'internet', type: 'internet', x: 700, y: 150, connected: false, label: 'Internet' },
        { id: 'fake-server', type: 'server', x: 300, y: 100, connected: false, label: 'Servidor', isDistractor: true },
        { id: 'fake-cloud', type: 'cloud', x: 500, y: 300, connected: false, label: 'Nube Privada', isDistractor: true },
        { id: 'fake-hub', type: 'hub', x: 350, y: 300, connected: false, label: 'Hub', isDistractor: true }
      ],
      // Configuración alternativa 2
      [
        { id: 'pc1', type: 'pc', x: 80, y: 200, connected: false, label: 'PC 1' },
        { id: 'pc2', type: 'pc', x: 180, y: 120, connected: false, label: 'PC 2' },
        { id: 'pc3', type: 'pc', x: 120, y: 300, connected: false, label: 'PC 3' },
        { id: 'switch', type: 'switch', x: 380, y: 220, connected: false, label: 'Switch' },
        { id: 'router', type: 'router', x: 580, y: 180, connected: false, label: 'Router' },
        { id: 'internet', type: 'internet', x: 680, y: 100, connected: false, label: 'Internet' },
        { id: 'fake-server', type: 'server', x: 280, y: 80, connected: false, label: 'Servidor', isDistractor: true },
        { id: 'fake-cloud', type: 'cloud', x: 480, y: 320, connected: false, label: 'Nube Privada', isDistractor: true },
        { id: 'fake-hub', type: 'hub', x: 420, y: 120, connected: false, label: 'Hub', isDistractor: true }
      ],
      // Configuración alternativa 3
      [
        { id: 'pc1', type: 'pc', x: 150, y: 180, connected: false, label: 'PC 1' },
        { id: 'pc2', type: 'pc', x: 100, y: 80, connected: false, label: 'PC 2' },
        { id: 'pc3', type: 'pc', x: 200, y: 280, connected: false, label: 'PC 3' },
        { id: 'switch', type: 'switch', x: 320, y: 160, connected: false, label: 'Switch' },
        { id: 'router', type: 'router', x: 520, y: 200, connected: false, label: 'Router' },
        { id: 'internet', type: 'internet', x: 620, y: 80, connected: false, label: 'Internet' },
        { id: 'fake-server', type: 'server', x: 250, y: 320, connected: false, label: 'Servidor', isDistractor: true },
        { id: 'fake-cloud', type: 'cloud', x: 450, y: 280, connected: false, label: 'Nube Privada', isDistractor: true },
        { id: 'fake-hub', type: 'hub', x: 380, y: 100, connected: false, label: 'Hub', isDistractor: true }
      ]
    ];
    
    // Seleccionar una configuración aleatoria
    const randomConfig = alternativePositions[Math.floor(Math.random() * alternativePositions.length)];
    setDevices(randomConfig);
    setConnections([]);
    setDraggedCable(null);
    setIsCompleted(false);
    setShowDataFlow(false);
  };

  // Manejar conexión de cable
  const handleCableConnect = (deviceId) => {
    if (draggedCable && draggedCable !== deviceId) {
      const newConnection = { from: draggedCable, to: deviceId };
      
      // Verificar si alguno de los dispositivos es un distractor
      const fromDevice = devices.find(d => d.id === draggedCable);
      const toDevice = devices.find(d => d.id === deviceId);
      
      if (fromDevice?.isDistractor || toDevice?.isDistractor) {
        // Si es un distractor, no hacer nada (permitir el intento pero no conectar)
        setDraggedCable(null);
        return;
      }
      
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
      internet: '🌐',
      server: '🖥️',
      cloud: '☁️',
      hub: '🔌'
    };
    return icons[device.type] || '❓';
  };

  return (
    <>
      <div className="network-puzzle-overlay">
        <div className="network-puzzle-container">
        {/* Header mejorado */}
        <div className="puzzle-header-enhanced">
          <div className="header-content">
            <div className="puzzle-icon">🧩</div>
            <div className="puzzle-title">
              <h3>Puzzle 1: Conexiones Correctas</h3>
              <p>Conecta los dispositivos correctamente para establecer la red</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="regenerate-button" onClick={regeneratePositions}>
              🔄 Mezclar
            </button>
            <button className="close-btn-enhanced" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Área principal del puzzle */}
          {/* Diagrama gamificado */}
          <div className="network-diagram-enhanced">
            <div className="diagram-background">
              <div className="network-pattern"></div>
            </div>
            
            <svg width="800" height="500" className="network-svg-enhanced">
              {/* Patrón de fondo de red */}
              <defs>
                <pattern id="networkPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="#3498db" opacity="0.3"/>
                  <line x1="0" y1="20" x2="40" y2="20" stroke="#3498db" strokeWidth="0.5" opacity="0.2"/>
                  <line x1="20" y1="0" x2="20" y2="40" stroke="#3498db" strokeWidth="0.5" opacity="0.2"/>
                </pattern>
              </defs>
              
              {/* Fondo con patrón */}
              <rect width="800" height="500" fill="url(#networkPattern)" className="pattern-background"/>
              
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
                      strokeWidth="6"
                      className={`network-cable-enhanced ${isValid ? 'valid' : 'invalid'}`}
                      filter="url(#cableGlow)"
                    />
                    
                    {/* Animación de datos si está completado */}
                    {showDataFlow && isValid && (
                      <circle
                        r="10"
                        fill="#3498db"
                        className="data-packet-enhanced"
                        filter="url(#packetGlow)"
                      >
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          path={`M${fromPos.x + 50},${fromPos.y + 50} L${toPos.x + 50},${toPos.y + 50}`}
                        />
                        <text
                          textAnchor="middle"
                          dy="3"
                          fontSize="8"
                          fill="white"
                          fontFamily="'Press Start 2P', monospace"
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
                  strokeWidth="6"
                  strokeDasharray="8,4"
                  className="dragging-cable-enhanced"
                  filter="url(#dragGlow)"
                />
              )}

              {/* Renderizar dispositivos gamificados */}
              {devices.map(device => (
                <g key={device.id}>
                  {/* Sombra del dispositivo */}
                  <ellipse
                    cx={device.x + 35}
                    cy={device.y + 70}
                    rx="30"
                    ry="5"
                    fill="rgba(0,0,0,0.3)"
                    className="device-shadow"
                  />
                  
                  {/* Contenedor del dispositivo */}
                  <rect
                    x={device.x}
                    y={device.y}
                    width="70"
                    height="70"
                    rx="12"
                    fill={device.connected ? "#2ecc71" : "#ecf0f1"}
                    stroke={draggedCable === device.id ? "#f39c12" : "#bdc3c7"}
                    strokeWidth={draggedCable === device.id ? "4" : "2"}
                    className={`device-container-enhanced ${device.connected ? 'connected' : 'disconnected'} ${device.isDistractor ? 'distractor' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (draggedCable) {
                        handleCableConnect(device.id);
                      } else {
                        handleCableStart(device.id);
                      }
                    }}
                    filter={draggedCable === device.id ? "url(#deviceGlow)" : "none"}
                    opacity="1"
                  />
                  
                  {/* Icono del dispositivo con personalidad */}
                  <text
                    x={device.x + 35}
                    y={device.y + 40}
                    textAnchor="middle"
                    fontSize="25"
                    className="device-icon-enhanced"
                    opacity="1"
                  >
                    {renderDeviceIcon(device)}
                  </text>
                  
                  {/* Etiqueta del dispositivo */}
                  <text
                    x={device.x + 35}
                    y={device.y + 60}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="'Press Start 2P', monospace"
                    fill="#2c3e50"
                    className="device-label-enhanced"
                    opacity="1"
                  >
                    {device.label}
                  </text>
                  
                  {/* Indicador de conexión mejorado */}
                  {device.connected && (
                    <g className="connection-indicator-enhanced">
                      <circle
                        cx={device.x + 60}
                        cy={device.y + 10}
                        r="8"
                        fill="#27ae60"
                        className="connection-dot"
                      />
                      <text
                        x={device.x + 60}
                        y={device.y + 15}
                        textAnchor="middle"
                        fontSize="6"
                        fill="white"
                        fontFamily="'Press Start 2P', monospace"
                      >
                        ✓
                      </text>
                    </g>
                  )}
                  
                  {/* Efecto de selección */}
                  {draggedCable === device.id && (
                    <circle
                      cx={device.x + 50}
                      cy={device.y + 50}
                      r="60"
                      fill="none"
                      stroke="#f39c12"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      className="selection-ring"
                    />
                  )}
                </g>
              ))}
              
              {/* Filtros SVG para efectos */}
              <defs>
                <filter id="cableGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="packetGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="dragGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="deviceGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {/* Panel de instrucciones flotante */}
          <div className="instruction-panel-floating">
            <div className="panel-header">
              <div className="panel-icon">📋</div>
              <h4>Instrucciones</h4>
            </div>
            <div className="instruction-content">
              <div className="instruction-step">
                <div className="step-icon">1️⃣</div>
                <p>Haz clic en un dispositivo para empezar a conectar</p>
              </div>
              <div className="instruction-step">
                <div className="step-icon">2️⃣</div>
                <p>Haz clic en otro dispositivo para completar la conexión</p>
              </div>
              <div className="instruction-step">
                <div className="step-icon">3️⃣</div>
                <p>Conecta todos los PCs al Switch</p>
              </div>
              <div className="instruction-step">
                <div className="step-icon">4️⃣</div>
                <p>Conecta el Switch al Router</p>
              </div>
              <div className="instruction-step">
                <div className="step-icon">5️⃣</div>
                <p>Conecta el Router a Internet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de progreso mejorado */}
        <div className="progress-panel-enhanced">
          <div className="progress-header">
            <div className="progress-icon">📊</div>
            <h4>Progreso</h4>
          </div>
          <div className="progress-content">
            <div className="progress-circles">
              {correctConnections.map((_, index) => {
                const isCompleted = connections.some(conn => 
                  (conn.from === correctConnections[index].from && conn.to === correctConnections[index].to) ||
                  (conn.from === correctConnections[index].to && conn.to === correctConnections[index].from)
                );
                return (
                  <div key={index} className={`progress-circle ${isCompleted ? 'completed' : 'pending'}`}>
                    <div className="circle-number">{index + 1}</div>
                    {isCompleted && <div className="circle-check">✓</div>}
                  </div>
                );
              })}
            </div>
            <div className="progress-text">
              Conexiones: {connections.filter(conn => isValidConnection(conn.from, conn.to)).length}/{correctConnections.length}
            </div>
            {isCompleted && (
              <div className="completion-message-enhanced">
                <div className="completion-icon">🎉</div>
                <h4>¡Excelente!</h4>
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
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 60, 114, 0.8));
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .network-puzzle-container {
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          padding: 3rem;
          border-radius: 20px;
          max-width: 1400px;
          max-height: 95vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 3px solid #C95E12;
        }

        /* Header mejorado */
        .puzzle-header-enhanced {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding-bottom: 1.5rem;
          border-bottom: 3px solid #C95E12;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .puzzle-icon {
          font-size: 3rem;
        }

        .puzzle-title h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .puzzle-title p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #7f8c8d;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .regenerate-button {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
          border: 2px solid #d35400;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);
        }

        .regenerate-button:hover {
          background: linear-gradient(135deg, #e67e22, #d35400);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(243, 156, 18, 0.4);
        }

        .close-btn-enhanced {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }

        .close-btn-enhanced:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(231, 76, 60, 0.5);
        }

        /* Área principal del puzzle */
        .puzzle-main-area {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        /* Diagrama gamificado */
        .network-diagram-enhanced {
          flex: 1;
          position: relative;
          min-height: 500px;
          padding: 2rem;
        }

        .diagram-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 15px;
          overflow: hidden;
        }

        .network-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.1) 0%, transparent 50%);
        }

        .network-svg-enhanced {
          border: 3px solid #C95E12;
          border-radius: 15px;
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 2;
        }

        .pattern-background {
          opacity: 0.3;
        }

        /* Dispositivos gamificados */
        .device-container-enhanced {
          cursor: pointer;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          transform: none !important;
          transition: none !important;
        }

        .device-container-enhanced:hover {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .device-container-enhanced.distractor {
          opacity: 1;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .device-container-enhanced.distractor:hover {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .device-icon-enhanced {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          font-size: 2rem;
        }

        .device-label-enhanced {
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .device-shadow {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .selection-ring {
          animation: selection-pulse 1s ease-in-out infinite;
        }

        /* Conexiones mejoradas */
        .network-cable-enhanced {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .network-cable-enhanced.valid {
          stroke: #2ecc71;
        }

        .network-cable-enhanced.invalid {
          stroke: #e74c3c;
        }

        .data-packet-enhanced {
          font-family: 'Press Start 2P', monospace;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .dragging-cable-enhanced {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .connection-indicator-enhanced {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .connection-dot {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        /* Panel de instrucciones flotante */
        .instruction-panel-floating {
          flex: 0 0 350px;
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(41, 128, 185, 0.1));
          backdrop-filter: blur(10px);
          border: 2px solid rgba(52, 152, 219, 0.3);
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.2);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(52, 152, 219, 0.3);
        }

        .panel-icon {
          font-size: 1.5rem;
        }

        .panel-header h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #2c3e50;
          margin: 0;
        }

        .instruction-content {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .instruction-step {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .instruction-step:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateX(5px);
        }

        .step-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .instruction-step p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #2c3e50;
          margin: 0;
          line-height: 1.4;
        }

        /* Panel de progreso mejorado */
        .progress-panel-enhanced {
          background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(142, 68, 173, 0.1));
          backdrop-filter: blur(10px);
          border: 2px solid rgba(155, 89, 182, 0.3);
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);
        }

        .progress-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(155, 89, 182, 0.3);
        }

        .progress-icon {
          font-size: 1.5rem;
        }

        .progress-header h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #2c3e50;
          margin: 0;
        }

        .progress-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .progress-circles {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .progress-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          border: 3px solid;
        }

        .progress-circle.pending {
          background: rgba(149, 165, 166, 0.2);
          border-color: #95a5a6;
        }

        .progress-circle.completed {
          background: rgba(52, 152, 219, 0.2);
          border-color: #3498db;
        }

        .circle-number {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .circle-check {
          position: absolute;
          font-size: 1.2rem;
          color: #27ae60;
        }

        .progress-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #2c3e50;
          text-align: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
        }

        .completion-message-enhanced {
          background: linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(46, 204, 113, 0.1));
          border: 2px solid rgba(39, 174, 96, 0.3);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }

        .completion-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .completion-message-enhanced h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #27ae60;
          margin-bottom: 0.5rem;
        }

        .completion-message-enhanced p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #27ae60;
          margin: 0.3rem 0;
        }

        /* Elementos SVG fijos */
        .device-container-enhanced rect {
          transform: none !important;
          transition: none !important;
        }

        .device-container-enhanced text {
          transform: none !important;
          transition: none !important;
        }

        .device-container-enhanced ellipse {
          transform: none !important;
          transition: none !important;
        }

        @media (max-width: 1024px) {
          .puzzle-main-area {
            flex-direction: column;
            gap: 1rem;
          }

          .instruction-panel-floating {
            flex: none;
          }

          .network-svg-enhanced {
            width: 100%;
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .network-puzzle-container {
            padding: 1rem;
            margin: 1rem;
          }

          .puzzle-header-enhanced {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .puzzle-title h3 {
            font-size: 1rem;
          }

          .puzzle-title p {
            font-size: 0.6rem;
          }

          .network-svg-enhanced {
            height: 300px;
          }

          .progress-circles {
            flex-wrap: wrap;
            justify-content: center;
          }

          .instruction-step {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default NetworkConnectionsPuzzle;
