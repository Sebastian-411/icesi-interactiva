import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import Level1Garden from '../levels/Level1Garden';
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

  const   renderLevelContent = () => {
    switch (state.currentLevel) {
      case 1:
        return <Level1Garden />;
      default:
        return <div>Nivel en desarrollo...</div>;
    }
  };

  return (
    <div id="level-screen" className={`screen ${isActive ? 'active' : ''}`}>
      {renderLevelContent()}
    </div>
  );
};

export default LevelScreen;
