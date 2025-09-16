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
    switch (state.currentScreen) {
      case 'loading-screen':
        return <LoadingScreen />;
      case 'home-screen':
        return <HomeScreen />;
      case 'instructions-screen':
        return <InstructionsScreen />;
      case 'options-screen':
        return <OptionsScreen />;
      case 'intro-screen':
        return <IntroScreen />;
      case 'world-map-screen':
        return <WorldMapScreen />;
      case 'level-screen':
        return <LevelScreen />;
      case 'level-summary-screen':
        return <LevelSummaryScreen />;
      case 'final-boss-screen':
        return <FinalBossScreen />;
      case 'victory-screen':
        return <VictoryScreen />;
      case 'final-results-screen':
        return <FinalResultsScreen />;
      case 'credits-screen':
        return <CreditsScreen />;
      default:
        return <LoadingScreen />;
    }
  };

  return (
    <div className="react-game-container">
      {renderCurrentScreen()}
    </div>
  );
}

export default GameApp;
