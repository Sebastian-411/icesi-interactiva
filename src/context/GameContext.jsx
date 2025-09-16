import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial del juego
const initialState = {
  currentScreen: 'loading-screen',
  currentLevel: 1,
  lives: 3,
  totalScore: 0,
  completedLevels: [],
  levelData: {
    1: { friend: 'pigeon', friendName: 'Paloma', concept: 'Jardín de Redes - Redes y Comunicaciones' },
    2: { friend: 'bat', friendName: 'Murciélago', concept: 'Cueva de Sistemas - Arquitectura de Sistemas' },
    3: { friend: 'lizard', friendName: 'Iguana', concept: 'Pantano de Datos - Bases de Datos' },
    4: { friend: 'possum', friendName: 'Zarigüeya', concept: 'Pico de Software - Ingeniería de Software' },
    5: { friend: 'andy', friendName: 'Andy', concept: 'Cima de la Torre - Proyecto Final' }
  },
  // Estado específico del Nivel 1
  level1State: {
    introCompleted: false,
    routersFixed: 0,
    dataPacketsCollected: 0,
    bridgeUnlocked: false,
    pigeonRescued: false,
    currentPuzzle: null,
    movementHintsShown: false,
    enemiesDefeated: 0,
    powerupsCollected: 0
  },
  // Estado del jugador
  playerState: {
    x: 10,
    y: 20,
    isJumping: false,
    jumpVelocity: 0,
    gravity: 0.5,
    jumpPower: -8,
    speed: 2,
    groundLevel: 20
  },
  // Audio
  audioContext: null,
  musicEnabled: true,
  sfxEnabled: true,
  // Tutorial
  tutorialCompleted: false,
  currentTutorialStep: 1
};

// Acciones del reducer
const gameActions = {
  SET_SCREEN: 'SET_SCREEN',
  SET_LEVEL: 'SET_LEVEL',
  UPDATE_SCORE: 'UPDATE_SCORE',
  UPDATE_LIVES: 'UPDATE_LIVES',
  COMPLETE_LEVEL: 'COMPLETE_LEVEL',
  UPDATE_LEVEL1_STATE: 'UPDATE_LEVEL1_STATE',
  UPDATE_PLAYER_STATE: 'UPDATE_PLAYER_STATE',
  SET_AUDIO_CONTEXT: 'SET_AUDIO_CONTEXT',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  TOGGLE_SFX: 'TOGGLE_SFX',
  UPDATE_TUTORIAL: 'UPDATE_TUTORIAL'
};

// Reducer del juego
function gameReducer(state, action) {
  switch (action.type) {
    case gameActions.SET_SCREEN:
      return { ...state, currentScreen: action.payload };
    
    case gameActions.SET_LEVEL:
      return { ...state, currentLevel: action.payload };
    
    case gameActions.UPDATE_SCORE:
      return { ...state, totalScore: state.totalScore + action.payload };
    
    case gameActions.UPDATE_LIVES:
      return { ...state, lives: Math.max(0, state.lives + action.payload) };
    
    case gameActions.COMPLETE_LEVEL:
      return {
        ...state,
        completedLevels: [...state.completedLevels, action.payload],
        totalScore: state.totalScore + action.payload.points
      };
    
    case gameActions.UPDATE_LEVEL1_STATE:
      return {
        ...state,
        level1State: { ...state.level1State, ...action.payload }
      };
    
    case gameActions.UPDATE_PLAYER_STATE:
      return {
        ...state,
        playerState: { ...state.playerState, ...action.payload }
      };
    
    case gameActions.SET_AUDIO_CONTEXT:
      return { ...state, audioContext: action.payload };
    
    case gameActions.TOGGLE_MUSIC:
      return { ...state, musicEnabled: !state.musicEnabled };
    
    case gameActions.TOGGLE_SFX:
      return { ...state, sfxEnabled: !state.sfxEnabled };
    
    case gameActions.UPDATE_TUTORIAL:
      return {
        ...state,
        tutorialCompleted: action.payload.completed,
        currentTutorialStep: action.payload.step || state.currentTutorialStep
      };
    
    default:
      return state;
  }
}

// Context del juego
const GameContext = createContext();

// Provider del contexto
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Inicializar audio context
  useEffect(() => {
    if (!state.audioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      dispatch({ type: gameActions.SET_AUDIO_CONTEXT, payload: audioContext });
    }
  }, [state.audioContext]);

  // Funciones del juego
  const gameFunctions = {
    // Navegación
    showScreen: (screenId) => {
      dispatch({ type: gameActions.SET_SCREEN, payload: screenId });
    },
    
    setLevel: (level) => {
      dispatch({ type: gameActions.SET_LEVEL, payload: level });
    },
    
    // Puntuación y vidas
    updateScore: (points) => {
      dispatch({ type: gameActions.UPDATE_SCORE, payload: points });
    },
    
    updateLives: (lives) => {
      dispatch({ type: gameActions.UPDATE_LIVES, payload: lives });
    },
    
    // Nivel 1 específico
    updateLevel1State: (updates) => {
      dispatch({ type: gameActions.UPDATE_LEVEL1_STATE, payload: updates });
    },
    
    // Jugador
    updatePlayerState: (updates) => {
      dispatch({ type: gameActions.UPDATE_PLAYER_STATE, payload: updates });
    },
    
    // Audio
    toggleMusic: () => {
      dispatch({ type: gameActions.TOGGLE_MUSIC });
    },
    
    toggleSFX: () => {
      dispatch({ type: gameActions.TOGGLE_SFX });
    },
    
    // Tutorial
    updateTutorial: (updates) => {
      dispatch({ type: gameActions.UPDATE_TUTORIAL, payload: updates });
    },
    
    // Completar nivel
    completeLevel: (levelData) => {
      dispatch({ type: gameActions.COMPLETE_LEVEL, payload: levelData });
    }
  };

  return (
    <GameContext.Provider value={{ state, ...gameFunctions }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook para usar el contexto
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser usado dentro de GameProvider');
  }
  return context;
}

export { gameActions };
