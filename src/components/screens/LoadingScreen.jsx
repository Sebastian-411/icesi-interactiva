import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [loadingTip, setLoadingTip] = useState('Compilando shaders...');
  const [progress, setProgress] = useState(0);

  const tips = [
    'Compilando shaders...',
    'Cargando texturas...',
    'Inicializando audio...',
    'Preparando niveles...',
    '¡Casi listo!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const tipInterval = setInterval(() => {
      setLoadingTip(prev => {
        const currentIndex = tips.indexOf(prev);
        return tips[(currentIndex + 1) % tips.length];
      });
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div id="loading-screen" className="screen active">
      <div className="loading-container">
        <div className="andy-silhouette">🐿️</div>
        <div className="loading-bar">
          <div 
            className="loading-progress" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="loading-tip" id="loading-tip">{loadingTip}</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
