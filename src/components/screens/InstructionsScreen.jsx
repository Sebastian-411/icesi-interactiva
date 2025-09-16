import React from 'react';
import { useGame } from '../../context/GameContext';

const InstructionsScreen = ({ isActive }) => {
  const { showScreen } = useGame();

  const handleBackClick = () => {
    showScreen('home-screen');
  };

  return (
    <div id="instructions-screen" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="instructions-container">
        <h2>Instrucciones del Juego</h2>
        <div className="instructions-content">
          <div className="instruction-section">
            <h3>🎮 Controles</h3>
            <ul>
              <li><strong>Flechas Izquierda/Derecha:</strong> Mover a Andy</li>
              <li><strong>Barra Espaciadora:</strong> Saltar</li>
              <li><strong>Click:</strong> Interactuar con elementos</li>
            </ul>
          </div>
          
          <div className="instruction-section">
            <h3>🎯 Objetivo</h3>
            <p>Rescata a Andy y a sus 4 mejores amigos que han sido secuestrados en la torre de ladrillos. Cada nivel te llevará a un piso diferente donde encontrarás a uno de sus amigos.</p>
          </div>
          
          <div className="instruction-section">
            <h3>⭐ Elementos del Juego</h3>
            <ul>
              <li><strong>🪙 Monedas:</strong> +100 puntos cada una</li>
              <li><strong>🍄 Hongo:</strong> +1 vida extra</li>
              <li><strong>⭐ Estrella:</strong> Invencibilidad temporal</li>
              <li><strong>👹 Enemigos:</strong> Evítalos o perderás vidas</li>
              <li><strong>🧱 Ladrillos:</strong> Haz clic para romperlos</li>
            </ul>
          </div>
          
          <div className="instruction-section">
            <h3>🏆 Progresión</h3>
            <p>Completa cada nivel rescatando al amigo correspondiente. Al final, enfrentarás al jefe final para rescatar a Andy y completar la aventura.</p>
          </div>
        </div>
        <button 
          id="instructions-back-btn" 
          className="btn-primary"
          onClick={handleBackClick}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default InstructionsScreen;
