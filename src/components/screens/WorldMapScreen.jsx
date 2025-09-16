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
    if (level.unlocked) {
      setLevel(level.id);
      showScreen('level-screen');
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
        <div className="central-icesi-tower">
          <div className="tower-base-large"></div>
          <div className="tower-middle-large"></div>
          <div className="tower-top-large"></div>
          <div className="icesi-text-large">ICESI</div>
          <div className="tower-clock-large"></div>
          <div className="tower-glow-effect"></div>
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
        {levels.map((level, index) => (
          <div 
            key={level.id}
            className={`level-station station-${level.id} ${level.unlocked ? 'unlocked' : 'locked'}`}
            data-level={level.id}
            onClick={() => handleLevelClick(level)}
          >
            <div className={`station-platform ${level.biome}-platform`}></div>
            <div className="level-icon">{level.icon}</div>
            <div className="friend-icon">{level.friend}</div>
            <div className="level-label">{level.name}</div>
            <div className="level-status">
              {state.completedLevels.includes(level.id) ? '✓' : level.unlocked ? '🔓' : '🔒'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Avatar de Andy que se mueve por el mapa */}
      <div className="andy-avatar" id="map-andy">
        <div className="andy-sprite">🐿️</div>
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
