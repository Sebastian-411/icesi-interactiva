import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const IntroScreen = () => {
  const { showScreen } = useGame();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const frames = [
    {
      id: 1,
      background: 'campus-day',
      content: (
        <div className="frame-content">
          <div className="andy-and-friends">
            <div className="andy-happy">🐿️</div>
            <div className="friend pigeon">🕊️</div>
            <div className="friend bat">🦇</div>
            <div className="friend lizard">🦎</div>
            <div className="friend possum">🐾</div>
          </div>
          <div className="story-text">Todo parecía normal en ICESI...</div>
        </div>
      )
    },
    {
      id: 2,
      background: 'campus-dark',
      content: (
        <div className="frame-content">
          <div className="story-text">Hasta que alguien decidió arruinarlo todo...</div>
        </div>
      )
    },
    {
      id: 3,
      background: 'tower-capture',
      content: (
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
      )
    },
    {
      id: 4,
      background: 'clock-closeup',
      content: (
        <div className="frame-content">
          <div className="story-text urgent">El tiempo corre... si no los rescatas, será demasiado tarde.</div>
        </div>
      )
    },
    {
      id: 5,
      background: 'tower-final',
      content: (
        <div className="frame-content">
          <div className="final-call-to-action">
            <h2 className="mission-title">¡Es tu misión rescatar a Andy de ICESI!</h2>
            <button 
              id="start-adventure-btn" 
              className="btn-primary btn-large"
              onClick={() => showScreen('world-map-screen')}
            >
              COMENZAR AVENTURA
            </button>
          </div>
        </div>
      )
    }
  ];

  const nextFrame = () => {
    if (currentFrame < frames.length) {
      setCurrentFrame(currentFrame + 1);
    }
  };

  const previousFrame = () => {
    if (currentFrame > 1) {
      setCurrentFrame(currentFrame - 1);
    }
  };

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && currentFrame < frames.length) {
      const timer = setTimeout(() => {
        nextFrame();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentFrame, isAutoPlaying]);

  const currentFrameData = frames.find(frame => frame.id === currentFrame);

  return (
    <div id="intro-screen" className="screen">
      <div className="story-container">
        {frames.map(frame => (
          <div 
            key={frame.id}
            className={`story-frame ${frame.id === currentFrame ? 'active' : ''}`}
            data-frame={frame.id}
          >
            <div className={`frame-background ${frame.background}`}>
              {frame.id === 1 && (
                <div className="icesi-campus-peaceful">
                  <div className="campus-buildings"></div>
                  <div className="campus-trees"></div>
                </div>
              )}
              {frame.id === 2 && (
                <>
                  <div className="dark-clouds"></div>
                  <div className="icesi-tower-ominous">
                    <div className="tower-shadow"></div>
                    <div className="villain-silhouette">👹</div>
                  </div>
                </>
              )}
              {frame.id === 3 && (
                <div className="icesi-tower-active">
                  <div className="tower-glow"></div>
                  <div className="clock-countdown"></div>
                </div>
              )}
              {frame.id === 4 && (
                <div className="giant-clock">
                  <div className="clock-face"></div>
                  <div className="clock-hands-fast"></div>
                  <div className="tick-tock-effect">TIC TAC</div>
                </div>
              )}
              {frame.id === 5 && (
                <div className="icesi-tower-dramatic">
                  <div className="tower-shadows"></div>
                  <div className="clock-glowing"></div>
                </div>
              )}
            </div>
            {frame.content}
          </div>
        ))}
        
        <button 
          id="next-frame-btn" 
          className="btn-secondary story-nav"
          onClick={nextFrame}
          disabled={currentFrame === frames.length}
        >
          Siguiente
        </button>
        
        <div className="story-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentFrame / frames.length) * 100}%` }}
            ></div>
          </div>
          <span className="frame-counter">{currentFrame} / {frames.length}</span>
          <div className="auto-play-indicator">▶ AUTO</div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
