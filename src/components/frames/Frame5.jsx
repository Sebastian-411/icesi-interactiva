import React from 'react';

const Frame5 = ({ onStartAdventure }) => {
  return (
    <div className="story-frame active" data-frame="5">
      <div className="frame-background tower-final">
        <div className="icesi-tower-dramatic">
          <div className="tower-shadows"></div>
          <div className="clock-glowing"></div>
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