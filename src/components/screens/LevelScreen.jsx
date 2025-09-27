import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import Level1Garden from '../levels/Level1Garden';
import Level2Cave from '../levels/Level2Cave';
import Level3Swamp from '../levels/Level3Swamp';
import Level4Peak from '../levels/Level4Peak';
import Level5TowerFinal from '../levels/Level5TowerFinal';
import CablePuzzle from '../puzzles/CablePuzzle';
import ProtocolPuzzle from '../puzzles/ProtocolPuzzle';
import PacketSortingPuzzle from '../puzzles/PacketSortingPuzzle';

const LevelScreen = ({ isActive }) => {
  const { state, showScreen, setLevel, updateLevel1State } = useGame();
  const [showIntroCutscene, setShowIntroCutscene] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  const levelData = state.levelData[state.currentLevel];

  useEffect(() => {
    if (state.currentLevel === 1 && !state.level1State.introCompleted) {
      setShowIntroCutscene(true);
    } else {
      startCountdown();
    }
  }, [state.currentLevel, state.level1State.introCompleted]);

  const startCountdown = () => {
    setShowIntroCutscene(false);
    setShowCountdown(true);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowCountdown(false);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStartLevel = () => {
    updateLevel1State({ introCompleted: true });
    startCountdown();
  };

  const renderLevelContent = () => {
    switch (state.currentLevel) {
      case 1:
        return <Level1Garden />;
      case 2:
        return <Level2Cave />;
      case 3:
        return <Level3Swamp />;
      case 4:
        return <Level4Peak />;
      case 5:
        return <Level5TowerFinal />;
      default:
        return <div>Nivel en desarrollo...</div>;
    }
  };

  return (
    <div id="level-screen" className={`screen ${isActive ? 'active' : ''}`}>
      {renderLevelContent()}

      {showIntroCutscene && state.currentLevel === 1 && (
        <div className="intro-cutscene-overlay">
          <div className="intro-cutscene-container">
            {/* Fondo con vida y cohesión */}
            <div className="garden-background-enhanced">
              <div className="corner-trees">
                <div className="tree-left">🌳</div>
                <div className="tree-right">🌳</div>
              </div>
              <div className="floating-elements">
                <div className="floating-flower flower-1">🌸</div>
                <div className="floating-flower flower-2">🌺</div>
                <div className="floating-flower flower-3">🌻</div>
                <div className="falling-leaf leaf-1">🍃</div>
                <div className="falling-leaf leaf-2">🍂</div>
              </div>
            </div>

            {/* Contenido principal reorganizado */}
            <div className="intro-content-enhanced">
              {/* PALOMA ATRAPADA - PROTAGONISTA ABSOLUTO */}
              <div className="trapped-pigeon-hero">
                <div className="pigeon-cage-hero">
                  <div className="cage-glow-aura"></div>
                  <div className="digital-cage-hero">🏛️</div>
                  <div className="trapped-pigeon-hero-icon">🕊️💔</div>
                  <div className="digital-lock-hero">🔒</div>
                </div>
                <div className="objective-label-hero">
                  <div className="objective-text">¡OBJETIVO: RESCATAR!</div>
                  <div className="objective-glow"></div>
                </div>
              </div>

              {/* Caja narrativa compacta y centrada */}
              <div className="narrative-card-compact">
                <div className="card-header">
                  <div className="narrator-icon-compact">📜</div>
                  <h2 className="narrative-title">Jardín de Redes</h2>
                </div>
                <div className="narrative-text-compact">
                  <p>La Paloma quedó atrapada…</p>
                  <p>¡El Jardín está desconectado!</p>
                  <p>Las rutas de comunicación están rotas.</p>
                  <p>Sin red, nunca podremos salvarla.</p>
                </div>
              </div>

              {/* Villano con marco temático que interrumpe */}
              <div className="villain-interruption">
                <div className="villain-frame-thematic">
                  <div className="frame-corners">
                    <div className="corner corner-tl">⚡</div>
                    <div className="corner corner-tr">⚡</div>
                    <div className="corner corner-bl">⚡</div>
                    <div className="corner corner-br">⚡</div>
                  </div>
                  <div className="villain-character-thematic">🦹‍♂️</div>
                  <div className="villain-shadow-thematic"></div>
                </div>
                
                {/* Globo de diálogo apuntando al villano */}
                <div className="villain-speech-bubble-thematic">
                  <div className="speech-tail"></div>
                  <div className="speech-content">
                    <div className="speech-icon">💀</div>
                    <p className="speech-text-villain">"¡Nadie podrá comunicarse sin mí!"</p>
                  </div>
                </div>
              </div>

              {/* Botón principal mejorado */}
              <div className="action-section-enhanced">
                <button onClick={handleStartLevel} className="pixel-start-button-enhanced">
                  <span className="button-text-enhanced">🚀 COMENZAR AVENTURA</span>
                  <div className="button-glow-enhanced"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCountdown && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 850 }}>
          <div style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '3rem', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{countdown}</div>
        </div>
      )}

      {/* Puzzles como overlays */}
      <CablePuzzle />
      <ProtocolPuzzle />
      <PacketSortingPuzzle />

      <style>{`
        /* ========================================
           PANTALLA DE INTRODUCCIÓN REFACTORIZADA
           ======================================== */
        
        .intro-cutscene-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 900;
          overflow: hidden;
        }

        .intro-cutscene-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          max-width: 1200px;
        }

        /* ========================================
           FONDO CON VIDA Y COHESIÓN
           ======================================== */
        
        .garden-background-enhanced {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.4;
          z-index: 1;
          pointer-events: none;
        }

        .corner-trees {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 2rem;
        }

        .tree-left, .tree-right {
          font-size: 3rem;
          animation: tree-sway 4s ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .tree-left { animation-delay: 0s; }
        .tree-right { animation-delay: 2s; }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .floating-flower, .falling-leaf {
          position: absolute;
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .flower-1 { top: 20%; left: 15%; animation: flower-float 3s ease-in-out infinite; }
        .flower-2 { top: 30%; right: 20%; animation: flower-float 3s ease-in-out infinite 1s; }
        .flower-3 { top: 60%; left: 25%; animation: flower-float 3s ease-in-out infinite 2s; }

        .leaf-1 { top: 10%; right: 30%; animation: leaf-fall 6s linear infinite; }
        .leaf-2 { top: 15%; left: 40%; animation: leaf-fall 6s linear infinite 3s; }

        /* ========================================
           CONTENIDO PRINCIPAL REORGANIZADO
           ======================================== */
        
        .intro-content-enhanced {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
          max-width: 800px;
        }

        /* ========================================
           PALOMA ATRAPADA - PROTAGONISTA ABSOLUTO
           ======================================== */
        
        .trapped-pigeon-hero {
          text-align: center;
          position: relative;
          margin-bottom: 1rem;
        }

        .pigeon-cage-hero {
          position: relative;
          font-size: 7rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
        }

        .cage-glow-aura {
          position: absolute;
          top: -2rem;
          left: -2rem;
          right: -2rem;
          bottom: -2rem;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 140, 0, 0.3) 50%, transparent 70%);
          border-radius: 50%;
          animation: aura-pulse 2s ease-in-out infinite;
          z-index: -1;
        }

        .digital-cage-hero {
          position: relative;
          z-index: 2;
        }

        .trapped-pigeon-hero-icon {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 4rem;
          animation: pigeon-struggle-hero 2s ease-in-out infinite;
          z-index: 3;
        }

        .digital-lock-hero {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-size: 2.5rem;
          animation: lock-pulse-hero 1.5s ease-in-out infinite;
          z-index: 4;
        }

        .objective-label-hero {
          position: relative;
          margin-top: 1rem;
        }

        .objective-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.2rem;
          color: #f39c12;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          animation: objective-blink 1.5s ease-in-out infinite;
        }

        .objective-glow {
          position: absolute;
          top: -0.5rem;
          left: -0.5rem;
          right: -0.5rem;
          bottom: -0.5rem;
          background: radial-gradient(circle, rgba(243, 156, 18, 0.3) 0%, transparent 70%);
          border-radius: 8px;
          animation: objective-glow-pulse 2s ease-in-out infinite;
          z-index: -1;
        }

        /* ========================================
           CAJA NARRATIVA COMPACTA Y CENTRADA
           ======================================== */
        
        .narrative-card-compact {
          background: rgba(14, 20, 27, 0.95);
          border: 3px solid #C95E12;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 0 30px rgba(201, 94, 18, 0.4);
          backdrop-filter: blur(10px);
          position: relative;
        }

        .narrative-card-compact::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #C95E12, #FF6B35, #C95E12);
          border-radius: 14px;
          z-index: -1;
          animation: border-glow-enhanced 3s ease-in-out infinite;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(201, 94, 18, 0.3);
        }

        .narrator-icon-compact {
          font-size: 2rem;
          animation: icon-float-enhanced 2s ease-in-out infinite;
        }

        .narrative-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #FFFFFF;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .narrative-text-compact {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .narrative-text-compact p {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: #FFFFFF;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          line-height: 1.4;
        }

        /* ========================================
           VILLANO CON MARCO TEMÁTICO QUE INTERRUMPE
           ======================================== */
        
        .villain-interruption {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .villain-frame-thematic {
          position: relative;
          background: rgba(231, 76, 60, 0.2);
          border: 4px solid #e74c3c;
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 40px rgba(231, 76, 60, 0.5);
        }

        .frame-corners {
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          pointer-events: none;
        }

        .corner {
          position: absolute;
          font-size: 1.5rem;
          color: #e74c3c;
          animation: corner-flash 2s ease-in-out infinite;
        }

        .corner-tl { top: 0; left: 0; animation-delay: 0s; }
        .corner-tr { top: 0; right: 0; animation-delay: 0.5s; }
        .corner-bl { bottom: 0; left: 0; animation-delay: 1s; }
        .corner-br { bottom: 0; right: 0; animation-delay: 1.5s; }

        .villain-character-thematic {
          font-size: 5rem;
          animation: villain-hover-enhanced 3s ease-in-out infinite;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
        }

        .villain-shadow-thematic {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 20px;
          background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: shadow-pulse-enhanced 2s ease-in-out infinite;
        }

        /* ========================================
           GLOBO DE DIÁLOGO APUNTANDO AL VILLANO
           ======================================== */
        
        .villain-speech-bubble-thematic {
          position: relative;
          background: linear-gradient(135deg, rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.9));
          backdrop-filter: blur(5px);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
          max-width: 300px;
        }

        .speech-tail {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid rgba(231, 76, 60, 0.9);
        }

        .speech-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .speech-icon {
          font-size: 1.2rem;
          animation: skull-pulse 2s ease-in-out infinite;
        }

        .speech-text-villain {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          font-style: italic;
        }

        /* ========================================
           BOTÓN PRINCIPAL MEJORADO
           ======================================== */
        
        .action-section-enhanced {
          margin-top: 1rem;
        }

        .pixel-start-button-enhanced {
          position: relative;
          background: linear-gradient(135deg, #3498db, #2980b9, #5dade2);
          color: white;
          border: 4px solid #2c3e50;
          padding: 1.2rem 2.5rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
          overflow: hidden;
        }

        .pixel-start-button-enhanced:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(52, 152, 219, 0.6);
        }

        .button-text-enhanced {
          position: relative;
          z-index: 2;
        }

        .button-glow-enhanced {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .pixel-start-button-enhanced:hover .button-glow-enhanced {
          left: 100%;
        }

        /* ========================================
           ANIMACIONES MEJORADAS
           ======================================== */
        
        @keyframes tree-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes flower-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes leaf-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes aura-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes pigeon-struggle-hero {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          25% { transform: translateX(-50%) translateY(-8px) rotate(-2deg); }
          75% { transform: translateX(-50%) translateY(-8px) rotate(2deg); }
        }

        @keyframes lock-pulse-hero {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes objective-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes objective-glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes border-glow-enhanced {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 94, 18, 0.4); }
          50% { box-shadow: 0 0 40px rgba(201, 94, 18, 0.8); }
        }

        @keyframes icon-float-enhanced {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes corner-flash {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes villain-hover-enhanced {
          0% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(0deg); }
          100% { transform: translateY(0) rotate(2deg); }
        }

        @keyframes shadow-pulse-enhanced {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
        }

        @keyframes skull-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* ========================================
           RESPONSIVE MEJORADO
           ======================================== */
        
        @media (max-width: 768px) {
          .intro-content-enhanced {
            gap: 1.5rem;
            padding: 0.5rem;
          }

          .pigeon-cage-hero {
            font-size: 5rem;
          }

          .trapped-pigeon-hero-icon {
            font-size: 3rem;
          }

          .digital-lock-hero {
            font-size: 2rem;
          }

          .objective-text {
            font-size: 1rem;
          }

          .villain-character-thematic {
            font-size: 4rem;
          }

          .narrative-card-compact {
            padding: 1rem 1.5rem;
            max-width: 400px;
          }

          .narrative-title {
            font-size: 0.9rem;
          }

          .narrative-text-compact p {
            font-size: 0.6rem;
          }

          .pixel-start-button-enhanced {
            padding: 1rem 2rem;
            font-size: 0.8rem;
          }

          .corner-trees {
            padding: 1rem;
          }

          .tree-left, .tree-right {
            font-size: 2rem;
          }

          .floating-flower, .falling-leaf {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .intro-cutscene-container {
            padding: 0.5rem;
          }

          .pigeon-cage-hero {
            font-size: 4rem;
          }

          .trapped-pigeon-hero-icon {
            font-size: 2.5rem;
          }

          .objective-text {
            font-size: 0.8rem;
          }

          .narrative-card-compact {
            padding: 0.8rem 1rem;
            max-width: 350px;
          }

          .villain-character-thematic {
            font-size: 3rem;
          }

          .villain-frame-thematic {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LevelScreen;
