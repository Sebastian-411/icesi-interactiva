import React from 'react';
import { useGame } from '../../context/GameContext';

const LevelSummaryScreen = ({ isActive }) => {
  const { state, showScreen, completeLevel } = useGame();

  const handleContinue = () => {
    console.log('🏆 Completando nivel:', state.currentLevel);
    
    // Completar el nivel actual
    const levelData = {
      level: state.currentLevel,
      points: state.totalScore,
      stars: 3, // Máximo por ahora
      medals: 1
    };
    
    console.log('📊 Datos del nivel completado:', levelData);
    completeLevel(levelData);
    
    // Si es el último nivel (nivel 4), ir a la pantalla de victoria
    if (state.currentLevel === 4) {
      showScreen('victory-screen');
    } else {
      showScreen('world-map-screen');
    }
  };

  const levelData = state.levelData[state.currentLevel];
  
  // Función para obtener los datos específicos del nivel actual
  const getCurrentLevelStats = () => {
    switch(state.currentLevel) {
      case 1:
        return {
          itemsCollected: state.level1State.dataPacketsCollected,
          maxItems: 4,
          itemName: "Paquetes de Datos",
          friendRescued: state.level1State.pigeonRescued,
          friendName: "Paloma"
        };
      case 2:
        return {
          itemsCollected: state.level2State.cpuCollected + state.level2State.ramCollected,
          maxItems: 6,
          itemName: "Componentes (CPU + RAM)",
          friendRescued: state.level2State.batRescued,
          friendName: "Murciélago"
        };
      case 3:
        return {
          itemsCollected: state.level3State.fieldsCollected + state.level3State.keysCollected + state.level3State.indexesCollected,
          maxItems: 7,
          itemName: "Elementos de BD (Campos + Llaves + Índices)",
          friendRescued: state.level3State.lizardRescued,
          friendName: "Iguana"
        };
      case 4:
        return {
          itemsCollected: state.level4State.modulesCollected + state.level4State.bugsFixed,
          maxItems: 7,
          itemName: "Módulos + Bugs Arreglados",
          friendRescued: state.level4State.possumRescued,
          friendName: "Zarigüeya"
        };
      default:
        return {
          itemsCollected: 0,
          maxItems: 0,
          itemName: "Elementos",
          friendRescued: false,
          friendName: "Amigo"
        };
    }
  };

  const levelStats = getCurrentLevelStats();
  
  // Mensajes específicos de Andy para cada nivel
  const getAndyMessage = () => {
    switch(state.currentLevel) {
      case 1:
        return "¡Primer amigo rescatado! Pero el villano aún controla la Cueva de Sistemas… ¿te atreves a seguir?";
      case 2:
        return "¡El Murciélago está libre! Los sistemas funcionan mejor, pero el Pantano de Datos necesita tu ayuda...";
      case 3:
        return "¡La Iguana guardiana está libre! Los datos fluyen organizados, pero aún queda el desafío final en el Pico de Software...";
      case 4:
        return "¡Increíble! Has rescatado a la Zarigüeya del Pico de Software. ¡Tu dominio de la Ingeniería de Software es impresionante! Ahora solo falta enfrentar al villano final en la Torre ICESI...";
      default:
        return "¡Buen trabajo! Sigamos con la aventura...";
    }
  };

  // Emoji de Andy que cambia según el nivel y el amigo rescatado
  const getAndyEmoji = () => {
    switch(state.currentLevel) {
      case 1:
        return levelStats.friendRescued ? "🐿️🕊️" : "🐿️"; // Andy con paloma si fue rescatada
      case 2:
        return levelStats.friendRescued ? "🐿️🦇" : "🐿️"; // Andy con murciélago si fue rescatado
      case 3:
        return levelStats.friendRescued ? "🐿️🦎" : "🐿️"; // Andy con iguana si fue rescatada
      case 4:
        return levelStats.friendRescued ? "🐿️🐾" : "🐿️"; // Andy con zarigüeya si fue rescatada
      default:
        return "🐿️";
    }
  };

  // Conocimiento específico para cada nivel
  const getKnowledgeText = () => {
    switch(state.currentLevel) {
      case 1:
        return "Sabías que... La Universidad Icesi usa servicios en la nube como AWS y Azure para potenciar sus plataformas de investigación y aprendizaje. ¡Lo que acabas de hacer es el día a día de un ingeniero de sistemas!";
      case 2:
        return "Sabías que... Los servidores de ICESI procesan miles de transacciones académicas diariamente. La arquitectura de sistemas que acabas de explorar es fundamental para mantener todo funcionando.";
      case 3:
        return "Sabías que... ICESI maneja enormes bases de datos con información de estudiantes, investigación y administración. Los conceptos de bases de datos que practicaste son esenciales en el mundo real.";
      case 4:
        return "Sabías que... En ICESI se desarrollan proyectos de software que impactan la región. Los estudiantes trabajan con metodologías ágiles, DevOps y arquitecturas de software modernas. ¡La ingeniería de software que acabas de dominar es clave para crear soluciones tecnológicas innovadoras!";
      default:
        return "¡Excelente trabajo explorando los conceptos de Ingeniería de Sistemas!";
    }
  };

  return (
    <div id="level-summary-screen" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="summary-container">
        <h2>¡NIVEL COMPLETADO!</h2>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Puntaje Obtenido:</span>
            <span id="final-score">{state.totalScore}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{levelStats.itemName}:</span>
            <span id="data-collected">{levelStats.itemsCollected}/{levelStats.maxItems}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Amigos Rescatados:</span>
            <span id="friends-rescued">{levelStats.friendRescued ? `1 (${levelStats.friendName})` : '0'}</span>
          </div>
        </div>
        <div className="knowledge-capsule">
          <h3>Cápsula de Conocimiento Icesi</h3>
          <p id="knowledge-text">
            {getKnowledgeText()}
          </p>
        </div>
        <div className="andy-closing-message">
          <div className="andy-avatar-small">{getAndyEmoji()}</div>
          <p>"{getAndyMessage()}"</p>
        </div>
        <button 
          id="continue-btn" 
          className="btn-primary"
          onClick={handleContinue}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export default LevelSummaryScreen;
