import React from 'react';

const Frame5 = ({ onStartAdventure }) => {
  return (
    <div className="story-frame active" data-frame="5">
      <div className="frame-background icesi-campus-background">
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
      <div className="frame-content">
        <div className="final-call-to-action">
          <h2 className="mission-title">¡Es tu misión rescatar a Andy de ICESI!</h2>
          <button 
            id="start-adventure-btn" 
            className="btn-primary btn-large"
            onClick={onStartAdventure}
          >
            COMENZAR AVENTURA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Frame5;