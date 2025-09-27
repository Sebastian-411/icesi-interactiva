import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import Frame1 from '../frames/Frame1';
import Frame2 from '../frames/Frame2';
import Frame3 from '../frames/Frame3';
import Frame4 from '../frames/Frame4';
import Frame5 from '../frames/Frame5';

const IntroScreen = ({ isActive }) => {
  const { showScreen } = useGame();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const intervalRef = useRef(null);

  const nextFrame = () => {
    console.log('nextFrame called, currentFrame:', currentFrame);
    if (currentFrame < 5) {
      setCurrentFrame(prev => prev + 1);
    }
  };

  const previousFrame = () => {
    if (currentFrame > 1) {
      setCurrentFrame(prev => prev - 1);
    }
  };

  // Auto-play con setInterval y dependencia de frame actual
  useEffect(() => {
    if (!isAutoPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (currentFrame >= 5) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Reiniciar el intervalo cada vez que cambie el frame o el estado de autoplay
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentFrame(prev => Math.min(prev + 1, 5));
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, currentFrame]);

  const handleStartAdventure = () => {
    showScreen('world-map-screen');
  };

  const handleSkipIntro = () => {
    showScreen('world-map-screen');
  };

  const renderFrame = () => {
    console.log('renderFrame called with currentFrame:', currentFrame);
    switch (currentFrame) {
      case 1:
        return <Frame1 onComplete={nextFrame} />;
      case 2:
        return <Frame2 onComplete={nextFrame} />;
      case 3:
        return <Frame3 onComplete={nextFrame} />;
      case 4:
        return <Frame4 onComplete={nextFrame} />;
      case 5:
        return <Frame5 onStartAdventure={handleStartAdventure} />;
      default:
        return <Frame1 onComplete={nextFrame} />;
    }
  };

  return (
    <div id="intro-screen" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="story-container">
        {renderFrame()}
        
        {/* Navegación */}
        <div className="story-navigation">
          <button 
            id="prev-frame-btn" 
            className="btn-secondary story-nav"
            onClick={previousFrame}
            disabled={currentFrame <= 1}
          >
            Anterior
          </button>
          <button 
            id="play-pause-btn" 
            className="btn-secondary story-nav"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? '⏸ Pausar' : '▶ Reproducir'}
          </button>
          <button 
            id="next-frame-btn" 
            className="btn-secondary story-nav"
            onClick={nextFrame}
            disabled={currentFrame >= 5}
          >
            {currentFrame >= 5 ? 'Final' : 'Siguiente'}
          </button>
        </div>
                
        {/* Indicadores de frame */}
        <div className="frame-indicators">
          {[1, 2, 3, 4, 5].map((frameNum) => (
            <div 
              key={frameNum}
              className={`frame-dot ${frameNum === currentFrame ? 'active' : ''}`}
              onClick={() => setCurrentFrame(frameNum)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;