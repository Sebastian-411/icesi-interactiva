import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import InstructionsScreen from './screens/InstructionsScreen';
import OptionsScreen from './screens/OptionsScreen';
import IntroScreen from './screens/IntroScreen';
import WorldMapScreen from './screens/WorldMapScreen';
import LevelScreen from './screens/LevelScreen';
import LevelSummaryScreen from './screens/LevelSummaryScreen';
import FinalBossScreen from './screens/FinalBossScreen';
import VictoryScreen from './screens/VictoryScreen';
import FinalResultsScreen from './screens/FinalResultsScreen';
import CreditsScreen from './screens/CreditsScreen';

function GameApp() {
  const { state, showScreen } = useGame();

  // Inicializar el juego
  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      showScreen('home-screen');
    }, 2000);

    return () => clearTimeout(timer);
  }, [showScreen]);

  // Renderizar pantalla actual
  const renderCurrentScreen = () => {
    const isActive = true; // En React, solo renderizamos la pantalla activa
    
    switch (state.currentScreen) {
      case 'loading-screen':
        return <LoadingScreen isActive={isActive} />;
      case 'home-screen':
        return <HomeScreen isActive={isActive} />;
      case 'instructions-screen':
        return <InstructionsScreen isActive={isActive} />;
      case 'options-screen':
        return <OptionsScreen isActive={isActive} />;
      case 'intro-screen':
        return <IntroScreen isActive={isActive} />;
      case 'world-map-screen':
        return <WorldMapScreen isActive={isActive} />;
      case 'level-screen':
        return <LevelScreen isActive={isActive} />;
      case 'level-summary-screen':
        return <LevelSummaryScreen isActive={isActive} />;
      case 'final-boss-screen':
        return <FinalBossScreen isActive={isActive} />;
      case 'victory-screen':
        return <VictoryScreen isActive={isActive} />;
      case 'final-results-screen':
        return <FinalResultsScreen isActive={isActive} />;
      case 'credits-screen':
        return <CreditsScreen isActive={isActive} />;
      default:
        return <LoadingScreen isActive={isActive} />;
    }
  };

  return (
    <div className="react-game-container">
      {renderCurrentScreen()}
    </div>
  );
}

export default GameApp;
