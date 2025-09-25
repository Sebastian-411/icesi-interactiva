import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const WorldMapScreen = ({ isActive }) => {
  const { state, showScreen, setLevel, updateTutorial } = useGame();
  const [showTutorial, setShowTutorial] = useState(!state.tutorialCompleted);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(1);

  const levels = [
    { id: 1, name: 'Jardín de Redes', friend: '🕊️', icon: '🏠', biome: 'garden', unlocked: true },
    { id: 2, name: 'Cueva de Sistemas', friend: '🦇', icon: '🌑', biome: 'cave', unlocked: state.completedLevels.length >= 1 },
    { id: 3, name: 'Pantano de Datos', friend: '🦎', icon: '💧', biome: 'swamp', unlocked: state.completedLevels.length >= 2 },
    { id: 4, name: 'Pico de Software', friend: '🐾', icon: '🌪️', biome: 'peak', unlocked: state.completedLevels.length >= 3 }
  ];

  const handleLevelClick = (level) => {
    console.log('🎮 Click en nivel:', level.id, 'completedLevels:', state.completedLevels);
    
    // Solo permitir acceso si el nivel está desbloqueado Y no ha sido completado
    if (level.unlocked && !state.completedLevels.includes(level.id)) {
      console.log('✅ Acceso permitido al nivel', level.id);
      setLevel(level.id);
      showScreen('level-screen');
    } else if (state.completedLevels.includes(level.id)) {
      // Mostrar mensaje si el nivel ya fue completado
      console.log('🚫 Nivel ya completado:', level.id);
      alert(`¡Ya completaste el ${level.name}! ${level.friend} ha sido rescatado. Continúa con el siguiente desafío.`);
    } else {
      console.log('🔒 Nivel bloqueado:', level.id);
    }
  };

  const nextTutorialStep = () => {
    if (currentTutorialStep < 4) {
      setCurrentTutorialStep(currentTutorialStep + 1);
    } else {
      finishTutorial();
    }
  };

  const previousTutorialStep = () => {
    if (currentTutorialStep > 1) {
      setCurrentTutorialStep(currentTutorialStep - 1);
    }
  };

  const finishTutorial = () => {
    setShowTutorial(false);
    updateTutorial({ completed: true, step: 4 });
  };

  const tutorialSteps = [
    {
      icon: '🐿️',
      text: 'Andy debe salvar a sus amigos atrapados en diferentes mundos tecnológicos.'
    },
    {
      icon: '🗺️',
      text: 'Cada nivel representa un concepto de Ingeniería de Sistemas.'
    },
    {
      icon: '🎯',
      text: 'Haz clic en un área desbloqueada para comenzar tu misión.'
    },
    {
      icon: '⭐',
      text: 'Gana estrellas, medallas y puntos por cada rescate exitoso.'
    }
  ];

  // Función para obtener la posición de Andy basada en el progreso
  const getAndyPosition = () => {
    const completedCount = state.completedLevels.length;
    
    // Posiciones para cada nivel (left, bottom en porcentajes)
    const positions = [
      { left: '10%', bottom: '20%' },  // Posición inicial (Jardín)
      { left: '25%', bottom: '35%' },  // Después del nivel 1 (Cueva)
      { left: '45%', bottom: '25%' },  // Después del nivel 2 (Pantano)
      { left: '65%', bottom: '40%' },  // Después del nivel 3 (Pico)
      { left: '50%', bottom: '60%' }   // Después del nivel 4 (Torre Central)
    ];
    
    return positions[completedCount] || positions[0];
  };

  // Obtener el emoji de Andy con el amigo rescatado más reciente
  const getAndyMapEmoji = () => {
    const completedCount = state.completedLevels.length;
    
    if (completedCount === 0) return '🐿️';
    
    // Mostrar Andy con el último amigo rescatado
    const lastCompletedLevel = Math.max(...state.completedLevels);
    
    switch(lastCompletedLevel) {
      case 1: return '🐿️🕊️'; // Andy con paloma
      case 2: return '🐿️🦇'; // Andy con murciélago  
      case 3: return '🐿️🦎'; // Andy con iguana
      case 4: return '🐿️🐾'; // Andy con zarigüeya
      default: return '🐿️';
    }
  };

  return (
    <div id="world-map-screen" className={`screen ${isActive ? 'active' : ''}`}>
      {/* Fondo del mapa con paisaje */}
      <div className="world-map-landscape">
        <div className="sky-background">
          <div className="tech-elements">
            <div className="floating-servers"></div>
            <div className="data-cables"></div>
            <div className="tech-symbols"></div>
          </div>
          <div className="floating-clouds"></div>
          <div className="mountain-backdrop"></div>
        </div>
        
        {/* Biomas */}
        <div className="biome garden-biome">
          <div className="garden-trees"></div>
          <div className="garden-flowers"></div>
        </div>
        
        <div className="biome cave-biome">
          <div className="cave-entrance"></div>
          <div className="cave-rocks"></div>
        </div>
        
        <div className="biome swamp-biome">
          <div className="swamp-water"></div>
          <div className="swamp-plants"></div>
        </div>
        
        <div className="biome windy-peak-biome">
          <div className="wind-clouds"></div>
          <div className="peak-platforms"></div>
        </div>
        
        {/* Torre ICESI Central */}
        <div 
          className={`central-icesi-tower ${state.completedLevels.length >= 4 ? 'tower-activated' : ''}`}
          onClick={() => {
            if (state.completedLevels.length >= 4) {
              console.log('🏛️ Accediendo a la Torre Final');
              setLevel(5); // Nivel 5 será la torre final
              showScreen('level-screen');
            } else {
              alert(`¡Debes completar todos los niveles primero! Progreso: ${state.completedLevels.length}/4`);
            }
          }}
          style={{
            cursor: state.completedLevels.length >= 4 ? 'pointer' : 'not-allowed',
            filter: state.completedLevels.length >= 4 ? 'brightness(1.3)' : 'brightness(0.8)'
          }}
        >
          <div className="tower-base-large"></div>
          <div className="tower-middle-large"></div>
          <div className="tower-top-large"></div>
          <div className="icesi-text-large">ICESI</div>
          <div className="tower-clock-large"></div>
          <div className={`tower-glow-effect ${state.completedLevels.length >= 4 ? 'tower-final-glow' : ''}`}></div>
          
          {/* Indicador de acceso */}
          {state.completedLevels.length >= 4 && (
            <div className="tower-access-indicator">
              <div className="access-icon">⚡</div>
              <div className="access-text">¡TORRE ACTIVADA!</div>
            </div>
          )}
          
          {/* Andy atrapado en la torre */}
          {state.completedLevels.length >= 4 && (
            <div className="andy-trapped">
              <div className="andy-icon">🐿️</div>
              <div className="help-text">¡AYUDA!</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Caminos conectores */}
      <div className="adventure-paths">
        <div className={`path path-1 ${levels[0].unlocked ? 'unlocked' : 'locked'}`}></div>
        <div className={`path path-2 ${levels[1].unlocked ? 'unlocked' : 'locked'}`}></div>
        <div className={`path path-3 ${levels[2].unlocked ? 'unlocked' : 'locked'}`}></div>
        <div className={`path path-4 ${levels[3].unlocked ? 'unlocked' : 'locked'}`}></div>
        <div className={`path path-final ${state.completedLevels.length >= 4 ? 'unlocked' : 'locked'}`}></div>
      </div>
      
      {/* Niveles como estaciones en el mapa */}
      <div className="level-stations">
        {levels.map((level, index) => {
          const isCompleted = state.completedLevels.includes(level.id);
          const isAccessible = level.unlocked && !isCompleted;
          const isCurrentLevel = state.completedLevels.length + 1 === level.id;
          
          return (
            <div 
              key={level.id}
              className={`level-station station-${level.id} ${
                isCompleted ? 'completed' : 
                isAccessible ? 'unlocked' : 
                'locked'
              } ${isCurrentLevel ? 'current-level' : ''}`}
              data-level={level.id}
              onClick={() => handleLevelClick(level)}
              style={{
                cursor: isAccessible ? 'pointer' : 'not-allowed',
                opacity: isAccessible ? 1 : isCompleted ? 0.7 : 0.4
              }}
            >
              <div className={`station-platform ${level.biome}-platform`}></div>
              <div className="level-icon">{level.icon}</div>
              <div className="friend-icon" style={{
                filter: isCompleted ? 'brightness(1.2) saturate(1.5)' : 'none'
              }}>
                {level.friend}
              </div>
              <div className="level-label">{level.name}</div>
              <div className="level-status">
                {isCompleted ? '✅' : isAccessible ? '🎯' : '🔒'}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Avatar de Andy que se mueve por el mapa */}
      <div 
        className="andy-avatar" 
        id="map-andy"
        style={{
          left: getAndyPosition().left,
          bottom: getAndyPosition().bottom,
          transition: 'all 2s ease-in-out'
        }}
      >
        <div className="andy-sprite">{getAndyMapEmoji()}</div>
        <div className="andy-shadow"></div>
      </div>
      
      {/* Título del mapa */}
      <div className="map-header">
        <h2 className="adventure-title">¡Rescata a los Amigos de Andy!</h2>
        <div className="progress-indicator">
          <span className="rescued-count">{state.completedLevels.length}</span> / 4 amigos rescatados
        </div>
        <div className="gamification-stats">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value" id="total-stars">{state.completedLevels.length * 3}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span className="stat-value" id="total-medals">{state.completedLevels.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-value" id="total-points">{state.totalScore}</span>
          </div>
        </div>
      </div>
      
      {/* Tutorial Modal */}
      {showTutorial && (
        <div id="tutorial-modal" className="tutorial-overlay active">
          <div className="tutorial-content">
            <div className="tutorial-header">
              <h3>🎮 ¡Bienvenido a la Aventura!</h3>
            </div>
            <div className="tutorial-body">
              {tutorialSteps.map((step, index) => (
                <div 
                  key={index + 1}
                  className={`tutorial-step ${currentTutorialStep === index + 1 ? 'active' : ''}`}
                  data-step={index + 1}
                >
                  <div className="tutorial-icon">{step.icon}</div>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
            <div className="tutorial-controls">
              <button 
                id="tutorial-prev" 
                className="btn-secondary tutorial-btn"
                onClick={previousTutorialStep}
                disabled={currentTutorialStep === 1}
              >
                Anterior
              </button>
              <div className="tutorial-dots">
                {tutorialSteps.map((_, index) => (
                  <span 
                    key={index + 1}
                    className={`dot ${currentTutorialStep === index + 1 ? 'active' : ''}`}
                    data-step={index + 1}
                    onClick={() => setCurrentTutorialStep(index + 1)}
                  ></span>
                ))}
              </div>
              <button 
                id="tutorial-next" 
                className="btn-primary tutorial-btn"
                onClick={nextTutorialStep}
              >
                {currentTutorialStep === 4 ? '¡Comenzar!' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Highlight para primera misión */}
      {!state.tutorialCompleted && (
        <div id="first-mission-highlight" className="mission-highlight active"></div>
      )}
    </div>
  );
};

export default WorldMapScreen;
