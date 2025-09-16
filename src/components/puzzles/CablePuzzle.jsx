import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';

const CablePuzzle = () => {
  const { state, updateLevel1State, updateScore } = useGame();
  const [isConnected, setIsConnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const showPuzzle = state.level1State.currentPuzzle === 'cable';

  const handleConnect = () => {
    setIsConnected(true);
    updateLevel1State({ routersFixed: state.level1State.routersFixed + 1 });
    updateScore(300);
    
    // Cerrar puzzle después de un delay
    setTimeout(() => {
      updateLevel1State({ currentPuzzle: null });
    }, 2000);
  };

  const handleMouseDown = (e) => {
    if (isConnected) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isDragging && !isConnected) {
      setIsDragging(false);
      handleConnect();
    }
  };

  if (!showPuzzle) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div 
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          textAlign: 'center',
          maxWidth: '500px'
        }}
      >
        <h3 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '1rem', marginBottom: '1rem' }}>
          🔧 Restablece la Conexión
        </h3>
        <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem', marginBottom: '2rem' }}>
          Un ingeniero de sistemas sabe cómo conectar los puntos. Restablece el camino de la información.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div 
            style={{
              width: '60px',
              height: '60px',
              background: '#3498db',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              cursor: isConnected ? 'default' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            🔌
          </div>
          
          <div 
            style={{
              width: '200px',
              height: '4px',
              background: isConnected ? '#27ae60' : '#95a5a6',
              borderRadius: '2px'
            }}
          ></div>
          
          <div 
            style={{
              width: '60px',
              height: '60px',
              background: '#3498db',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}
          >
            🔌
          </div>
        </div>
        
        <button 
          onClick={handleConnect}
          disabled={isConnected}
          style={{
            background: isConnected ? '#27ae60' : '#3498db',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '5px',
            fontFamily: 'Press Start 2P, monospace',
            fontSize: '0.6rem',
            cursor: isConnected ? 'default' : 'pointer'
          }}
        >
          {isConnected ? 'Cable Conectado ✅' : 'Conectar Cable'}
        </button>
      </div>
    </div>
  );
};

export default CablePuzzle;