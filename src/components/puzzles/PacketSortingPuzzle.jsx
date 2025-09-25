import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';

const PacketSortingPuzzle = () => {
  const { state, updateLevel1State, updateScore, showScreen } = useGame();
  const [packets, setPackets] = useState([
    { id: 1, order: '1', position: null },
    { id: 2, order: '3', position: null },
    { id: 3, order: '2', position: null },
    { id: 4, order: '4', position: null }
  ]);
  const [slots, setSlots] = useState([
    { id: 1, position: 1, content: null },
    { id: 2, position: 2, content: null },
    { id: 3, position: 3, content: null },
    { id: 4, position: 4, content: null }
  ]);

  const showPuzzle = state.level1State.currentPuzzle === 'packet-sorting';
  const [showRelease, setShowRelease] = useState(false);

  const handleDragStart = (e, packetOrder) => {
    e.dataTransfer.setData('text/plain', packetOrder);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slotPosition) => {
    e.preventDefault();
    const packetOrder = e.dataTransfer.getData('text/plain');
    
    // Verificar si el paquete está en la posición correcta
    const correctSequence = ['1', '3', '2', '4'];
    const isCorrect = packetOrder === correctSequence[slotPosition - 1];
    
    // Actualizar slots
    setSlots(prev => prev.map(slot => 
      slot.position === slotPosition 
        ? { ...slot, content: packetOrder, correct: isCorrect }
        : slot
    ));
    
    // Verificar si el puzzle está completo
    setTimeout(() => {
      checkPuzzleComplete();
    }, 100);
  };

  const checkPuzzleComplete = () => {
    const currentSequence = slots.map(slot => slot.content).filter(Boolean);
    const correctSequence = ['1', '3', '2', '4'];
    
    if (currentSequence.length === 4 && 
        currentSequence.every((order, index) => order === correctSequence[index])) {
      // Puzzle completado
      console.log('📦 ¡Puzzle final completado! Nivel terminado');
      updateScore(500);
      updateLevel1State({ pigeonRescued: true });
      setShowRelease(true);
      
      setTimeout(() => {
        updateLevel1State({ currentPuzzle: null });
        showScreen('level-summary-screen');
      }, 1000);
    }
  };

  const handleCheckSorting = () => {
    checkPuzzleComplete();
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
          maxWidth: '600px',
          position: 'relative'
        }}
      >
        {showRelease ? (
          <div>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(46, 204, 113, 0.25)' }} />
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🕊️✉️</div>
            <h3 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.9rem', marginBottom: '0.8rem', color: '#27ae60' }}>¡Conexión final restablecida!</h3>
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem' }}>¡Has aprendido cómo las redes transmiten mensajes! Gracias a ti, el Jardín vuelve a estar conectado.</p>
          </div>
        ) : (
        <>
          <h3 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '1rem', marginBottom: '1rem' }}>
            📦 Reensambla los Paquetes
          </h3>
          <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem', marginBottom: '2rem' }}>
            ¡Estamos cerca! Restablece la conexión final para liberarla.
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
              {packets.map(packet => (
                <div
                  key={packet.id}
                  style={{
                    width: '60px',
                    height: '60px',
                    background: '#3498db',
                    color: 'white',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontFamily: 'Press Start 2P, monospace',
                    cursor: 'grab',
                    userSelect: 'none'
                  }}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, packet.order)}
                >
                  {packet.order}
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {slots.map(slot => (
                <div
                  key={slot.id}
                  style={{
                    width: '60px',
                    height: '60px',
                    background: slot.correct ? '#27ae60' : slot.content ? '#f39c12' : '#ecf0f1',
                    border: '2px dashed #bdc3c7',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontFamily: 'Press Start 2P, monospace',
                    color: slot.content ? 'white' : '#7f8c8d'
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.position)}
                >
                  {slot.content}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleCheckSorting}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '5px',
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '0.6rem',
              cursor: 'pointer'
            }}
          >
            Verificar Orden
          </button>
        </>
        )}
      </div>
    </div>
  );
};

export default PacketSortingPuzzle;