import React, { useState, useEffect } from 'react';

const Frame4 = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = "El tiempo corre... si no los rescatas, será demasiado tarde.";
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        setShowCursor(true);
        clearInterval(typingInterval);
        
        // Esperar 2 segundos antes de marcar como completo
        setTimeout(() => {
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        }, 2000);
      }
    }, 100); // Velocidad del typewriter
    
    return () => clearInterval(typingInterval);
  }, [onComplete]);
  
  useEffect(() => {
    if (showCursor) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [showCursor]);

  return (
    <div className="story-frame active" data-frame="4">
      {/* Fondo de la portada con ambiente urgente */}
      <div className="frame-background icesi-campus-background urgente">
        <div className="pixel-sun urgent-sun"></div>
        <div className="tropical-vegetation urgent-vegetation"></div>
        <div className="icesi-tower urgent-tower">
          <div className="tower-base"></div>
          <div className="tower-middle"></div>
          <div className="tower-top">
            <div className="icesi-text">ICESI</div>
            <div className="tower-clock urgent-clock"></div>
          </div>
          <div className="brick-patterns"></div>
        </div>
        <div className="urgent-clouds">
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">☁️</div>
          <div className="cloud cloud-3">☁️</div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="frame-content">
        {/* Caja de texto refinada */}
        <div className="story-text-box refined urgent">
          <div className="text-box-background">
            <div className="text-box-border"></div>
            <div className="narrator-icon">⏰</div>
            <div className="text-content">
              <div className="story-text typewriter">
                {text}
                {showCursor && <span className="cursor">_</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* HUD inferior refinado */}
      <div className="frame-hud refined">
        <div className="progress-dots">
          <div className="dot filled">■</div>
          <div className="dot filled">■</div>
          <div className="dot filled">■</div>
          <div className="dot filled">■</div>
          <div className="dot empty">□</div>
        </div>
      </div>
      
      <style>{`
        .story-frame {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Press Start 2P', monospace;
        }
        
        /* Fondo de la portada con ambiente urgente */
        .frame-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #FF4500, #FF6347, #FF8C00);
          overflow: hidden;
        }
        
        /* Sol urgente */
        .urgent-sun {
          position: absolute;
          top: 15%;
          left: 10%;
          width: 80px;
          height: 80px;
          background: #FFD700;
          border: 4px solid #FF8C00;
          border-radius: 0;
          box-shadow: inset 4px 4px 0 #FFFF00, inset -4px -4px 0 #FFA500, 4px 4px 0 #000;
          animation: urgent-sun-pulse 1s infinite alternate;
        }
        
        .urgent-sun::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          width: 8px;
          height: 8px;
          background: #FF0000;
          border: 2px solid #8B0000;
        }
        
        .urgent-sun::after {
          content: '';
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: #FF0000;
          border: 2px solid #8B0000;
        }
        
        /* Vegetación urgente */
        .urgent-vegetation {
          background: linear-gradient(to top, #228B22, #32CD32, #90EE90);
          filter: brightness(0.8) contrast(1.3) hue-rotate(15deg);
        }
        
        /* Torre urgente */
        .urgent-tower {
          position: absolute;
          bottom: 0;
          right: 5%;
          width: 250px;
          height: 500px;
          z-index: 2;
        }
        
        .urgent-tower .tower-base {
          background: #A0522D;
          border-color: #654321;
        }
        
        .urgent-tower .tower-middle {
          background: #CD853F;
          border-color: #A0522D;
        }
        
        .urgent-tower .tower-top {
          background: #DEB887;
          border-color: #CD853F;
        }
        
        .urgent-tower .icesi-text {
          color: #FF0000;
          text-shadow: 0 0 10px #FF0000;
          animation: urgent-text-flash 0.5s ease-in-out infinite alternate;
        }
        
        .urgent-clock {
          animation: urgent-clock-tick 1s ease-in-out infinite;
        }
        
        /* Nubes urgentes */
        .urgent-clouds {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .urgent-clouds .cloud {
          position: absolute;
          font-size: 2rem;
          opacity: 0.7;
          animation: urgent-cloud-move 15s ease-in-out infinite;
        }
        
        .urgent-clouds .cloud-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .urgent-clouds .cloud-2 {
          top: 30%;
          right: 15%;
          animation-delay: -5s;
        }
        
        .urgent-clouds .cloud-3 {
          top: 25%;
          left: 60%;
          animation-delay: -10s;
        }
        
        /* Contenido principal */
        .frame-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 8rem;
        }
        
        /* Caja de texto refinada */
        .story-text-box.refined {
          position: relative;
          z-index: 15;
        }
        
        .text-box-background {
          background: rgba(14, 20, 27, 0.9);
          border: 3px solid #FF4500;
          border-radius: 6px;
          padding: 1.5rem 2.5rem;
          position: relative;
          box-shadow: 0 0 20px rgba(255, 69, 0, 0.3);
          min-width: 450px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .text-box-border {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #FF4500, #FF6347, #FF4500);
          border-radius: 8px;
          z-index: -1;
          animation: urgent-border-pulse 1s ease-in-out infinite;
        }
        
        .narrator-icon {
          font-size: 2rem;
          animation: urgent-icon-bounce 0.5s ease-in-out infinite;
        }
        
        .text-content {
          flex: 1;
        }
        
        .story-text.typewriter {
          font-size: 0.9rem;
          color: #FFFFFF;
          line-height: 1.6;
          font-family: 'Press Start 2P', monospace;
        }
        
        .cursor {
          color: #FF4500;
          animation: cursor-blink 1s ease-in-out infinite;
        }
        
        /* HUD inferior refinado */
        .frame-hud.refined {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 2rem;
          z-index: 20;
        }
        
        .progress-dots {
          display: flex;
          gap: 0.5rem;
        }
        
        .dot {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #FF4500;
        }
        
        .dot.filled {
          animation: dot-pulse 2s ease-in-out infinite;
        }
        
        /* Animaciones */
        @keyframes urgent-sun-pulse {
          0%, 100% { 
            box-shadow: inset 4px 4px 0 #FFFF00, inset -4px -4px 0 #FFA500, 4px 4px 0 #000, 0 0 20px rgba(255, 215, 0, 0.6);
          }
          50% { 
            box-shadow: inset 4px 4px 0 #FFFF00, inset -4px -4px 0 #FFA500, 4px 4px 0 #000, 0 0 30px rgba(255, 215, 0, 0.9);
          }
        }
        
        @keyframes urgent-text-flash {
          0%, 100% { 
            text-shadow: 0 0 10px #FF0000;
          }
          50% { 
            text-shadow: 0 0 20px #FF0000, 0 0 30px #FF4500;
          }
        }
        
        @keyframes urgent-clock-tick {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes urgent-cloud-move {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(50px) translateY(-20px); }
          50% { transform: translateX(-40px) translateY(15px); }
          75% { transform: translateX(45px) translateY(-10px); }
        }
        
        @keyframes urgent-border-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 69, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 69, 0, 0.6); }
        }
        
        @keyframes urgent-icon-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .text-box-background {
            min-width: 300px;
            padding: 1rem 1.5rem;
          }
          
          .story-text.typewriter {
            font-size: 0.7rem;
          }
          
          .frame-hud.refined {
            bottom: 1rem;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Frame4;