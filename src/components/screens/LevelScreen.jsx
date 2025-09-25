import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import Level1Garden from '../levels/Level1Garden';
import Level2Cave from '../levels/Level2Cave';
import Level3Swamp from '../levels/Level3Swamp';
import CablePuzzle from '../puzzles/CablePuzzle';
import ProtocolPuzzle from '../puzzles/ProtocolPuzzle';
import PacketSortingPuzzle from '../puzzles/PacketSortingPuzzle';

const LevelScreen = ({ isActive }) => {
  const { state, showScreen, setLevel, updateLevel1State } = useGame();
  const [showIntroCutscene, setShowIntroCutscene] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  const levelData = state.levelData[state.currentLevel];

  useEffect(() => {
    if (state.currentLevel === 1 && !state.level1State.introCompleted) {
      setShowIntroCutscene(true);
    } else {
      startCountdown();
    }
  }, [state.currentLevel, state.level1State.introCompleted]);

  const startCountdown = () => {
    setShowIntroCutscene(false);
    setShowCountdown(true);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowCountdown(false);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStartLevel = () => {
    updateLevel1State({ introCompleted: true });
    startCountdown();
  };

  const renderLevelContent = () => {
    switch (state.currentLevel) {
      case 1:
        return <Level1Garden />;
      case 2:
        return <Level2Cave />;
      case 3:
        return <Level3Swamp />;
      default:
        return <div>Nivel en desarrollo...</div>;
    }
  };

  return (
    <div id="level-screen" className={`screen ${isActive ? 'active' : ''}`}>
      {renderLevelContent()}

      {showIntroCutscene && state.currentLevel === 1 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 900
        }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', maxWidth: '800px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '1rem', marginBottom: '1rem' }}>Jardín de Redes</h2>
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.7rem', lineHeight: 1.6 }}>
              La Paloma quedó atrapada… pero el Jardín está desconectado. ¡Las rutas de comunicación están rotas! Si no restablecemos la red, nunca podremos salvarla.
            </p>
            <button onClick={handleStartLevel} className="btn-primary" style={{ marginTop: '1.5rem' }}>Comenzar</button>
          </div>
        </div>
      )}

      {showCountdown && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 850 }}>
          <div style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '3rem', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{countdown}</div>
        </div>
      )}

      {/* Puzzles como overlays */}
      <CablePuzzle />
      <ProtocolPuzzle />
      <PacketSortingPuzzle />
    </div>
  );
};

export default LevelScreen;
