import React, { useState, useEffect } from 'react';

const Frame1 = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = "Todo parecía normal en ICESI...";
  
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
        
        // Esperar 3 segundos antes de marcar como completo
        setTimeout(() => {
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        }, 3000);
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
    <div className="story-frame active" data-frame="1">
      {/* Fondo de la portada */}
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
      
      {/* Contenido principal */}
      <div className="frame-content">
        {/* Animales protagonistas con animaciones */}
        <div className="andy-and-friends refined">
          <div className="animal-row">
            <div className="andy-happy bounce-animation">
              <div className="animal-emoji">🐿️</div>
              <div className="idle-effect"></div>
            </div>
            <div className="friend pigeon bounce-animation">
              <div className="animal-emoji">🕊️</div>
              <div className="wing-flap"></div>
            </div>
            <div className="friend bat bounce-animation">
              <div className="animal-emoji">🦇</div>
              <div className="blink-effect"></div>
            </div>
            <div className="friend lizard bounce-animation">
              <div className="animal-emoji">🦎</div>
              <div className="tail-wag"></div>
            </div>
            <div className="friend possum bounce-animation">
              <div className="animal-emoji">🐾</div>
              <div className="ear-twitch"></div>
            </div>
          </div>
        </div>
        
        {/* Caja de texto refinada */}
        <div className="story-text-box refined">
          <div className="text-box-background">
            <div className="text-box-border"></div>
            <div className="narrator-icon">📜</div>
            <div className="text-content">
              <div className="story-text typewriter">
                {text}
                {showCursor && <span className="cursor">_</span>}
              </div>
            </div>
          </div>
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
        
        /* Fondo de la portada */
        .frame-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #87CEEB, #98FB98);
          overflow: hidden;
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
        
        /* Animales con animaciones */
        .andy-and-friends.refined {
          margin-bottom: 2rem;
        }
        
        .animal-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          transform: perspective(500px) rotateX(5deg);
        }
        
        .bounce-animation {
          animation: bounce-gentle 3s ease-in-out infinite;
          position: relative;
        }
        
        .andy-happy { animation-delay: 0s; }
        .pigeon { animation-delay: -0.6s; }
        .bat { animation-delay: -1.2s; }
        .lizard { animation-delay: -1.8s; }
        .possum { animation-delay: -2.4s; }
        
        .animal-emoji {
          font-size: 4rem;
          position: relative;
          z-index: 2;
        }
        
        /* Efectos idle */
        .idle-effect {
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(255, 255, 0, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .wing-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: wing-flap 1.5s ease-in-out infinite;
        }
        
        .blink-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: blink 3s ease-in-out infinite;
        }
        
        .tail-wag {
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 30px;
          height: 30px;
          animation: tail-wag 2s ease-in-out infinite;
        }
        
        .ear-twitch {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 15px;
          height: 15px;
          animation: ear-twitch 2.5s ease-in-out infinite;
        }
        
        /* Caja de texto refinada */
        .story-text-box.refined {
          position: relative;
          z-index: 15;
        }
        
        .text-box-background {
          background: rgba(14, 20, 27, 0.9);
          border: 3px solid #C95E12;
          border-radius: 6px;
          padding: 1.5rem 2.5rem;
          position: relative;
          box-shadow: 0 0 20px rgba(201, 94, 18, 0.3);
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
          background: linear-gradient(45deg, #C95E12, #FF6B35, #C95E12);
          border-radius: 8px;
          z-index: -1;
          animation: border-glow 3s ease-in-out infinite;
        }
        
        .narrator-icon {
          font-size: 2rem;
          animation: icon-float 2s ease-in-out infinite;
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
          color: #C95E12;
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
          color: #C95E12;
        }
        
        .dot.filled {
          animation: dot-pulse 2s ease-in-out infinite;
        }
        
        
        /* Animaciones */
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.2); }
        }
        
        @keyframes wing-flap {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.3; }
        }
        
        @keyframes tail-wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        
        @keyframes ear-twitch {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 94, 18, 0.3); }
          50% { box-shadow: 0 0 30px rgba(201, 94, 18, 0.6); }
        }
        
        @keyframes icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
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
          .animal-row {
            gap: 1rem;
          }
          
          .animal-emoji {
            font-size: 3rem;
          }
          
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

export default Frame1;