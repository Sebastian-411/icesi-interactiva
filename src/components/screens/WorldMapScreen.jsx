import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';

const WorldMapScreen = ({ isActive }) => {
  const { state, showScreen, setLevel, updateTutorial } = useGame();
  const containerRef = useRef(null);
  const stationRefs = useRef({});
  const [pathSegments, setPathSegments] = useState([]);
  const [showTutorial, setShowTutorial] = useState(!state.tutorialCompleted);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(1);

  const levels = [
    // Iconos únicos solicitados: árbol con antena, cueva con murciélago, charco verdoso con iguana, montaña con engranaje
    { id: 1, name: 'Jardín de Redes', friend: '🕊️', icon: '🌳📡', biome: 'garden', unlocked: true },
    { id: 2, name: 'Cueva de Sistemas', friend: '🦇', icon: '🕳️🦇', biome: 'cave', unlocked: state.completedLevels.length >= 1 },
    { id: 3, name: 'Pantano de Datos', friend: '🦎', icon: '💧🦎', biome: 'swamp', unlocked: state.completedLevels.length >= 2 },
    { id: 4, name: 'Pico de Software', friend: '🐾', icon: '⛰️⚙️', biome: 'peak', unlocked: state.completedLevels.length >= 3 }
  ];

  // Calcular caminos dinámicos para que el trazo pase por las estaciones
  useEffect(() => {
    const calcPaths = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const toSvg = (xPx, yPx) => {
        const x = ((xPx - containerRect.left) / containerRect.width) * 100; // viewBox width 100
        const y = ((yPx - containerRect.top) / containerRect.height) * 60;   // viewBox height 60
        return { x, y };
      };

      // Recoger puntos en orden 1->2->3->4->punta torre (aprox)
      const points = [];
      [1, 2, 3, 4].forEach((id) => {
        const el = stationRefs.current[id];
        if (el) {
          const r = el.getBoundingClientRect();
          points.push(toSvg(r.left + r.width / 2, r.top + r.height / 2));
        }
      });
      // Punto final cercano a la torre (parte inferior izquierda de la torre decorativa)
      const towerEl = containerRef.current.querySelector('.central-icesi-tower');
      if (towerEl) {
        const tr = towerEl.getBoundingClientRect();
        points.push(toSvg(tr.left + tr.width * 0.15, tr.top + tr.height * 0.55));
      }

      // Generar segmentos con curvas suaves entre puntos consecutivos
      const segs = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const dx = (p1.x - p0.x);
        const dy = (p1.y - p0.y);
        const c1 = { x: p0.x + dx * 0.35, y: p0.y + dy * 0.15 };
        const c2 = { x: p0.x + dx * 0.75, y: p0.y + dy * 0.85 };
        segs.push({
          dBorder: `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
        });
      }
      setPathSegments(segs);
    };

    calcPaths();
    window.addEventListener('resize', calcPaths);
    const id = setInterval(calcPaths, 500); // recompute mientras hay HMR/animaciones
    return () => {
      window.removeEventListener('resize', calcPaths);
      clearInterval(id);
    };
  }, [state.completedLevels.length]);

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
      <div ref={containerRef} className={`world-map-landscape progress-${state.completedLevels.length}`}>
        <div className="sky-background">
          <div className="tech-elements">
            <div className="floating-servers"></div>
            <div className="data-cables"></div>
            <div className="tech-symbols"></div>
          </div>
          <div className="floating-clouds parallax-clouds"></div>
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
        
        {/* Torre ICESI Central (decorativa, no clickeable) */}
        <div 
          className={`central-icesi-tower decorative ${state.completedLevels.length >= 4 ? 'tower-activated' : ''}`}
          style={{
            cursor: 'not-allowed'
          }}
        >
          <div className="tower-base-large"></div>
          <div className="tower-middle-large"></div>
          <div className="tower-top-large"></div>
          <div className="icesi-text-large">ICESI</div>
          <div className="tower-clock-large"></div>
          <div className={`tower-glow-effect ${state.completedLevels.length >= 4 ? 'tower-final-glow' : 'tower-red-glow'}`}></div>
          {/* Barrera mágica / niebla para recordar que no se entra desde el mapa */}
          <div className={`tower-barrier ${state.completedLevels.length >= 4 ? 'barrier-weak' : 'barrier-strong'}`}></div>

        </div>

        {/* Bosquecitos con profundidad (parallax) */}
        <div className="forest-layer back">
          <span className="tree pine" style={{ left: '8%', bottom: '18%' }}></span>
          <span className="tree round" style={{ left: '14%', bottom: '20%' }}></span>
          <span className="tree pine" style={{ left: '20%', bottom: '22%' }}></span>
          <span className="tree round" style={{ left: '38%', bottom: '18%' }}></span>
          <span className="tree pine" style={{ left: '56%', bottom: '26%' }}></span>
          <span className="tree round" style={{ left: '72%', bottom: '28%' }}></span>
        </div>
        <div className="forest-layer mid">
          <span className="tree round" style={{ left: '11%', bottom: '16%' }}></span>
          <span className="tree pine" style={{ left: '16%', bottom: '18%' }}></span>
          <span className="tree round" style={{ left: '33%', bottom: '22%' }}></span>
          <span className="tree pine" style={{ left: '47%', bottom: '24%' }}></span>
          <span className="tree round" style={{ left: '63%', bottom: '30%' }}></span>
        </div>
        <div className="forest-layer front">
          <span className="tree pine big" style={{ left: '13%', bottom: '14%' }}></span>
          <span className="tree round big" style={{ left: '30%', bottom: '20%' }}></span>
          <span className="tree pine big" style={{ left: '52%', bottom: '26%' }}></span>
          <span className="bush" style={{ left: '28%', bottom: '18%' }}></span>
          <span className="bush" style={{ left: '55%', bottom: '24%' }}></span>
          <span className="rock" style={{ left: '18%', bottom: '16%' }}></span>
          <span className="flower" style={{ left: '35%', bottom: '19%' }}></span>
        </div>
      </div>
      
      {/* Caminos deshabilitados */}
      
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
              ref={(el) => { stationRefs.current[level.id] = el; }}
              onClick={() => handleLevelClick(level)}
              style={{
                cursor: isAccessible ? 'pointer' : 'not-allowed',
                opacity: isAccessible ? 1 : isCompleted ? 0.7 : 0.4
              }}
            >
              <img src={`/level${level.id}.png`} alt={level.name} className="level-icon-img" />
              <div className="level-label simple">{level.name}</div>
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
      
      {/* Título del mapa + caritas de amigos como progreso */}
      <div className="map-header">
        <h2 className="adventure-title">¡Rescata a los Amigos de Andy!</h2>
        <div className="friends-progress">
          {[
            { id: 1, face: '🕊️' },
            { id: 2, face: '🦇' },
            { id: 3, face: '🦎' },
            { id: 4, face: '🐾' },
          ].map(({ id, face }) => {
            const rescued = state.completedLevels.includes(id);
            return (
              <span key={id} className={`friend-face ${rescued ? 'rescued' : 'pending'}`}>{face}</span>
            );
          })}
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
/* Inline styles for decorative tower and map enhancements */
/* Keeping styles here for clarity; consider moving to CSS file if preferred */
// Note: This component relies on existing CSS in public/styles.css.
// The following classes add only the new visual states requested.

