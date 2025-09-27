import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const PacketAdventurePuzzle = ({ onComplete, onClose }) => {
  const { updateScore } = useGame();
  
  // Estado del paquete y el laberinto
  const [packetPosition, setPacketPosition] = useState({ x: 50, y: 250 });
  const [currentNode, setCurrentNode] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [animatingPacket, setAnimatingPacket] = useState(false);

  // Nodos del laberinto con preguntas TCP handshake
  const nodes = [
    {
      id: 0,
      x: 50,
      y: 250,
      question: null,
      isStart: true,
      label: "Inicio"
    },
    {
      id: 1,
      x: 200,
      y: 250,
      question: {
        text: "El cliente quiere iniciar una conexión. ¿Qué mensaje envía primero?",
        options: [
          { id: "syn", text: "SYN", correct: true, explanation: "¡Correcto! SYN (Synchronize) es el primer paso del handshake TCP." },
          { id: "ack", text: "ACK", correct: false, explanation: "No, ACK viene después. Primero necesitamos sincronizar." },
          { id: "fin", text: "FIN", correct: false, explanation: "FIN se usa para cerrar conexiones, no para abrirlas." }
        ]
      },
      label: "Nodo 1"
    },
    {
      id: 2,
      x: 350,
      y: 150,
      question: {
        text: "El servidor recibe SYN. ¿Cómo responde?",
        options: [
          { id: "syn-ack", text: "SYN-ACK", correct: true, explanation: "¡Perfecto! El servidor confirma con SYN-ACK (Synchronize-Acknowledge)." },
          { id: "ack-only", text: "Solo ACK", correct: false, explanation: "Necesita tanto SYN como ACK para establecer la conexión bidireccional." },
          { id: "rst", text: "RST", correct: false, explanation: "RST resetearía la conexión, no la establecería." }
        ]
      },
      label: "Nodo 2"
    },
    {
      id: 3,
      x: 500,
      y: 250,
      question: {
        text: "Para completar el handshake, el cliente debe enviar:",
        options: [
          { id: "ack-final", text: "ACK", correct: true, explanation: "¡Excelente! El ACK final completa el handshake de 3 vías TCP." },
          { id: "syn-again", text: "SYN otra vez", correct: false, explanation: "No necesita enviar SYN de nuevo, ya fue reconocido." },
          { id: "data", text: "Datos directamente", correct: false, explanation: "Primero debe completar el handshake con ACK." }
        ]
      },
      label: "Nodo 3"
    },
    {
      id: 4,
      x: 650,
      y: 250,
      question: null,
      isEnd: true,
      label: "¡Conexión Establecida!"
    }
  ];

  // Rutas entre nodos
  const paths = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 }
  ];

  // Manejar clic en nodo
  const handleNodeClick = (nodeId) => {
    if (nodeId === currentNode + 1) {
      const node = nodes[nodeId];
      if (node.question) {
        setShowQuestion(true);
      } else if (node.isEnd) {
        completeAdventure();
      } else {
        moveToNode(nodeId);
      }
    }
  };

  // Mover paquete a nodo
  const moveToNode = (nodeId) => {
    const node = nodes[nodeId];
    setAnimatingPacket(true);
    
    setTimeout(() => {
      setPacketPosition({ x: node.x, y: node.y });
      setCurrentNode(nodeId);
      setAnimatingPacket(false);
      
      if (node.isEnd) {
        completeAdventure();
      }
    }, 1000);
  };

  // Manejar respuesta a pregunta
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer.correct) {
      updateScore(100);
      setTimeout(() => {
        setShowQuestion(false);
        setShowFeedback(false);
        setSelectedAnswer(null);
        moveToNode(currentNode + 1);
      }, 3000);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 3000);
    }
  };

  // Completar aventura
  const completeAdventure = () => {
    setIsCompleted(true);
    updateScore(200);
    
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  return (
    <div className="packet-adventure-container">
      <div className="packet-adventure-content">
        <div className="puzzle-header">
          <h3>🧩 Puzzle 2: El Camino del Paquete</h3>
          <p>Guía el paquete a través del handshake TCP</p>
        </div>

        <div className="adventure-area">
          <svg width="750" height="400" className="maze-svg">
            {/* Renderizar rutas */}
            {paths.map((path, index) => {
              const fromNode = nodes[path.from];
              const toNode = nodes[path.to];
              const isActive = currentNode >= path.from;
              
              return (
                <line
                  key={index}
                  x1={fromNode.x + 30}
                  y1={fromNode.y + 30}
                  x2={toNode.x + 30}
                  y2={toNode.y + 30}
                  stroke={isActive ? "#27ae60" : "#bdc3c7"}
                  strokeWidth="4"
                  strokeDasharray={isActive ? "none" : "5,5"}
                  className="maze-path"
                />
              );
            })}

            {/* Renderizar nodos */}
            {nodes.map(node => {
              const isCurrentNode = currentNode === node.id;
              const isNextNode = currentNode + 1 === node.id;
              const isCompleted = currentNode > node.id;
              
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x + 30}
                    cy={node.y + 30}
                    r="30"
                    fill={
                      isCurrentNode ? "#3498db" : 
                      isCompleted ? "#27ae60" : 
                      isNextNode ? "#f39c12" : "#ecf0f1"
                    }
                    stroke="#2c3e50"
                    strokeWidth="3"
                    className={`maze-node ${isNextNode ? 'clickable' : ''}`}
                    onClick={() => handleNodeClick(node.id)}
                  />
                  
                  {/* Icono del nodo */}
                  <text
                    x={node.x + 30}
                    y={node.y + 38}
                    textAnchor="middle"
                    fontSize="20"
                  >
                    {node.isStart ? "🚀" : node.isEnd ? "🎯" : "🔄"}
                  </text>
                  
                  {/* Etiqueta del nodo */}
                  <text
                    x={node.x + 30}
                    y={node.y + 80}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="'Press Start 2P', monospace"
                    fill="#2c3e50"
                  >
                    {node.label}
                  </text>
                  
                  {/* Indicador de pregunta */}
                  {node.question && (
                    <text
                      x={node.x + 50}
                      y={node.y + 15}
                      fontSize="16"
                    >
                      ❓
                    </text>
                  )}
                </g>
              );
            })}

            {/* Paquete animado */}
            <g className={`packet ${animatingPacket ? 'moving' : ''}`}>
              <circle
                cx={packetPosition.x + 30}
                cy={packetPosition.y + 30}
                r="25"
                fill="#e74c3c"
                stroke="#c0392b"
                strokeWidth="2"
                className="packet-body"
              />
              <text
                x={packetPosition.x + 30}
                y={packetPosition.y + 38}
                textAnchor="middle"
                fontSize="16"
              >
                📨
              </text>
              
              {/* Alas del paquete */}
              <path
                d={`M${packetPosition.x + 10},${packetPosition.y + 20} Q${packetPosition.x},${packetPosition.y + 10} ${packetPosition.x + 10},${packetPosition.y + 5}`}
                fill="#f39c12"
                className="packet-wing left-wing"
              />
              <path
                d={`M${packetPosition.x + 50},${packetPosition.y + 20} Q${packetPosition.x + 60},${packetPosition.y + 10} ${packetPosition.x + 50},${packetPosition.y + 5}`}
                fill="#f39c12"
                className="packet-wing right-wing"
              />
            </g>
          </svg>
        </div>

        {/* Panel de pregunta */}
        {showQuestion && currentNode < nodes.length - 1 && (
          <div className="question-panel">
            <div className="question-content">
              <h4>🤔 Pregunta TCP</h4>
              <p>{nodes[currentNode + 1].question.text}</p>
              
              <div className="answer-options">
                {nodes[currentNode + 1].question.options.map(option => (
                  <button
                    key={option.id}
                    className={`answer-btn ${selectedAnswer?.id === option.id ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              
              {/* Feedback */}
              {showFeedback && selectedAnswer && (
                <div className={`feedback ${selectedAnswer.correct ? 'correct' : 'incorrect'}`}>
                  <h5>{selectedAnswer.correct ? "✅ ¡Correcto!" : "❌ Incorrecto"}</h5>
                  <p>{selectedAnswer.explanation}</p>
                  {!selectedAnswer.correct && (
                    <p><strong>💡 Inténtalo de nuevo</strong></p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}


        {/* Mensaje de completado */}
        {isCompleted && (
          <div className="completion-overlay">
            <div className="completion-message">
              <h3>🎉 ¡Aventura Completada!</h3>
              <p>Has guiado exitosamente el paquete a través del handshake TCP.</p>
              <p>Ahora entiendes cómo se establecen las conexiones confiables en las redes.</p>
              <div className="completion-animation">
                <span className="celebration">🎊</span>
                <span className="celebration">🎉</span>
                <span className="celebration">✨</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .packet-adventure-container {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
        }

        .packet-adventure-content {
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

        .adventure-area {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 0;
        }

        .maze-svg {
          border: 2px solid #bdc3c7;
          border-radius: 10px;
          background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%, transparent 75%, #f8f9fa 75%, #f8f9fa),
                      linear-gradient(45deg, #f8f9fa 25%, transparent 25%, transparent 75%, #f8f9fa 75%, #f8f9fa);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
        }

        .maze-node {
          transform: none !important;
          transition: none !important;
        }

        .maze-node.clickable {
          cursor: pointer;
          filter: brightness(1.1);
          transform: none !important;
          transition: none !important;
        }

        .maze-node.clickable:hover {
          filter: brightness(1.2);
        }

        .packet {
          transition: all 1s ease-in-out;
        }

        .packet.moving {
          animation: packet-bounce 1s ease-in-out;
        }

        .packet-wing {
          animation: wing-flap 0.5s ease-in-out infinite alternate;
        }

        .question-panel {
          background: #ecf0f1;
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .question-content h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .question-content p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .answer-options {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .answer-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.3s;
          flex: 1;
          min-width: 150px;
        }

        .answer-btn:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .answer-btn.selected {
          background: #f39c12;
        }

        .answer-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .feedback {
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .feedback.correct {
          background: #d5f4e6;
          border: 2px solid #27ae60;
        }

        .feedback.incorrect {
          background: #fadbd8;
          border: 2px solid #e74c3c;
        }

        .feedback h5 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
        }

        .feedback p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          line-height: 1.4;
        }

        .progress-panel {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 10px;
        }

        .progress-panel h4 {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .handshake-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .step.completed {
          background: #d5f4e6;
        }

        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #bdc3c7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
        }

        .step.completed .step-number {
          background: #27ae60;
        }

        .step-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #2c3e50;
        }

        .completion-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 204, 113, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
        }

        .completion-message {
          text-align: center;
          color: white;
        }

        .completion-message h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .completion-message p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .completion-animation {
          margin-top: 2rem;
        }

        .celebration {
          font-size: 2rem;
          margin: 0 0.5rem;
          animation: celebration-bounce 0.6s ease-in-out infinite alternate;
        }

        .celebration:nth-child(2) {
          animation-delay: 0.2s;
        }

        .celebration:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes packet-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes wing-flap {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(10deg); }
        }

        @keyframes celebration-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default PacketAdventurePuzzle;
