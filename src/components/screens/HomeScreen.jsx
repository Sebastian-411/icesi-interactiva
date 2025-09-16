import React from 'react';
import { useGame } from '../../context/GameContext';

const HomeScreen = () => {
  const { showScreen } = useGame();

  const handlePlayClick = () => {
    showScreen('intro-screen');
  };

  const handleInstructionsClick = () => {
    showScreen('instructions-screen');
  };

  return (
    <div id="home-screen" className="screen">
      <div className="background-animation">
        <div className="icesi-campus-background">
          <div className="pixel-sun"></div>
          <div className="tropical-vegetation"></div>
          <div className="icesi-tower">
            <div className="tower-base"></div>
            <div className="tower-middle"></div>
            <div className="tower-top">
              <div className="icesi-text">ICESI</div>
              <div className="tower-clock"></div>
            </div>
            <div className="brick-patterns"></div>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="center-section">
          <div className="andy-pixel-container">
            <div className="andy-pixel-art">
              <div className="andy-head"></div>
              <div className="andy-body"></div>
              <div className="andy-tail"></div>
              <div className="andy-eye"></div>
            </div>
            <div className="andy-caption">Andy Secuestrado</div>
          </div>
          
          <div className="title-container">
            <h1 className="game-title">RESCATA A ANDY Y A SUS MEJORES AMIGOS!</h1>
            <div className="subtitle">Una aventura épica en la Universidad Icesi</div>
          </div>
          
          <div className="menu-buttons">
            <button 
              id="play-btn" 
              className="btn-primary pixel-btn"
              onClick={handlePlayClick}
            >
              INICIAR AVENTURA
            </button>
            <button 
              id="instructions-btn" 
              className="btn-secondary pixel-btn"
              onClick={handleInstructionsClick}
            >
              INSTRUCCIONES
            </button>
          </div>
        </div>
      </div>
      
      <div className="icesi-logo">🏛️ Universidad Icesi - Cali, Colombia</div>
    </div>
  );
};

export default HomeScreen;
