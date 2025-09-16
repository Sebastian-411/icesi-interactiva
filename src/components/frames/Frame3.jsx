import React from 'react';

const Frame3 = () => {
  return (
    <div className="story-frame active" data-frame="3">
      <div className="frame-background tower-capture">
        <div className="icesi-tower-active">
          <div className="tower-glow"></div>
          <div className="clock-countdown"></div>
        </div>
      </div>
      <div className="frame-content">
        <div className="friends-being-captured">
          <div className="friend-flying andy">🐿️</div>
          <div className="friend-flying pigeon">🕊️</div>
          <div className="friend-flying bat">🦇</div>
          <div className="friend-flying lizard">🦎</div>
          <div className="friend-flying possum">🐾</div>
        </div>
        <div className="story-text">Andy y sus amigos fueron encerrados en la torre de ICESI...</div>
      </div>
    </div>
  );
};

export default Frame3;