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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  // Auto-play con setInterval en lugar de setTimeout
  useEffect(() => {
    console.log('Auto-play effect triggered, currentFrame:', currentFrame, 'isAutoPlaying:', isAutoPlaying);
    
    if (isAutoPlaying && currentFrame < 5) {
      console.log('Starting auto-play interval');
      intervalRef.current = setInterval(() => {
        console.log('Interval fired, advancing frame');
        setCurrentFrame(prev => {
          console.log('setCurrentFrame called, prev:', prev);
          if (prev >= 5) {
            clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    } else {
      if (intervalRef.current) {
        console.log('Clearing interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        console.log('Clearing interval on cleanup');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying]); // Solo depende de isAutoPlaying, no de currentFrame

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
        return <Frame1 />;
      case 2:
        return <Frame2 />;
      case 3:
        return <Frame3 />;
      case 4:
        return <Frame4 />;
      case 5:
        return <Frame5 onStartAdventure={handleStartAdventure} />;
      default:
        return <Frame1 />;
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
        
        {/* Progreso */}
        <div className="story-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentFrame / 5) * 100}%` }}
            ></div>
          </div>
          <span className="frame-counter">{currentFrame} / 5</span>
          <div className="auto-play-indicator">
            {isAutoPlaying ? '▶ AUTO' : '⏸ MANUAL'}
          </div>
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
        
        {/* Botón para saltar */}
        <button 
          id="skip-intro-btn" 
          className="btn-small skip-btn"
          onClick={handleSkipIntro}
        >
          Saltar Cinemática
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;