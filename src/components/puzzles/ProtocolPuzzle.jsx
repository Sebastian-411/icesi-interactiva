import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';

const ProtocolPuzzle = () => {
  const { state, updateLevel1State, updateScore } = useGame();
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const showPuzzle = state.level1State.currentPuzzle === 'protocol';

  const handleProtocolSelect = (protocol) => {
    setSelectedProtocol(protocol);
    setShowResult(true);
    
    // Bonus por elegir TCP
    const bonus = protocol === 'tcp' ? 100 : 0;
    updateScore(200 + bonus);
    
    // Completar puzzle después de mostrar resultado
    setTimeout(() => {
      updateLevel1State({ routersFixed: state.level1State.routersFixed + 1 });
      updateLevel1State({ currentPuzzle: null });
    }, 4000);
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
          maxWidth: '600px'
        }}
      >
        <h3 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '1rem', marginBottom: '1rem' }}>
          🌐 Elige el Protocolo
        </h3>
        <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem', marginBottom: '2rem' }}>
          Algunas veces debes elegir cómo transmitir los datos. ¿Qué protocolo usarías?
        </p>
        
        {!showResult ? (
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <button 
              onClick={() => handleProtocolSelect('tcp')}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '150px'
              }}
            >
              <div style={{ fontSize: '2rem' }}>📦</div>
              <div style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.8rem' }}>TCP</div>
              <div style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.5rem' }}>Confiable y ordenado</div>
            </button>
            
            <button 
              onClick={() => handleProtocolSelect('udp')}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '150px'
              }}
            >
              <div style={{ fontSize: '2rem' }}>⚡</div>
              <div style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.8rem' }}>UDP</div>
              <div style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.5rem' }}>Rápido pero inestable</div>
            </button>
          </div>
        ) : (
          <div 
            style={{
              background: selectedProtocol === 'tcp' ? '#27ae60' : '#f39c12',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '0.6rem'
            }}
          >
            {selectedProtocol === 'tcp' ? (
              <>
                <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>🎯 ¡Excelente Elección!</h3>
                <p>TCP es perfecto para rescatar a la Paloma porque:</p>
                <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                  <li>✅ Garantiza que cada paquete de datos llegue</li>
                  <li>✅ Ordena los mensajes correctamente</li>
                  <li>✅ Detecta y corrige errores automáticamente</li>
                </ul>
                <p style={{ marginTop: '1rem' }}>
                  <strong>¡La Paloma necesita que todos sus mensajes lleguen completos!</strong>
                </p>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>⚠️ UDP es Rápido, Pero...</h3>
                <p>UDP es bueno para algunas cosas, pero para rescatar a la Paloma:</p>
                <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                  <li>❌ Puede perder algunos paquetes de datos</li>
                  <li>❌ Los mensajes pueden llegar desordenados</li>
                  <li>❌ No detecta errores automáticamente</li>
                </ul>
                <p style={{ marginTop: '1rem' }}>
                  <strong>¡La Paloma necesita que todos sus mensajes lleguen completos!</strong>
                </p>
                <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                  💡 TCP habría sido mejor para esta misión
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolPuzzle;