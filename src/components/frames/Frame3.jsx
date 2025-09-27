import React, { useState, useEffect } from 'react';

const Frame3 = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = "Andy y sus amigos fueron encerrados en la torre de ICESI...";
  
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
    <div className="story-frame active" data-frame="3">
      {/* Fondo de la portada con ambiente diabólico */}
      <div className="frame-background icesi-campus-background diabolico">
        <div className="pixel-hell-sun"></div>
        <div className="tropical-vegetation hell-vegetation"></div>
        <div className="icesi-tower hell-tower">
          <div className="tower-base"></div>
          <div className="tower-middle"></div>
          <div className="tower-top">
            <div className="icesi-text">ICESI</div>
            <div className="tower-clock"></div>
          </div>
          <div className="brick-patterns"></div>
          <div className="hell-glow"></div>
        </div>
        <div className="hell-clouds">
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">☁️</div>
          <div className="cloud cloud-3">☁️</div>
        </div>
        <div className="lightning-bolts">
          <div className="lightning lightning-1">⚡</div>
          <div className="lightning lightning-2">⚡</div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="frame-content">
        {/* Animales siendo capturados */}
        <div className="friends-being-captured">
          <div className="friend-flying andy">🐿️</div>
          <div className="friend-flying pigeon">🕊️</div>
          <div className="friend-flying bat">🦇</div>
          <div className="friend-flying lizard">🦎</div>
          <div className="friend-flying possum">🐾</div>
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
        
        /* Fondo de la portada con ambiente diabólico */
        .frame-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #8B0000, #DC143C, #2F0000);
          overflow: hidden;
        }
        
        /* Sol infernal */
        .pixel-hell-sun {
          position: absolute;
          top: 15%;
          left: 10%;
          width: 80px;
          height: 80px;
          background: #FF4500;
          border: 4px solid #FF0000;
          border-radius: 0;
          box-shadow: inset 4px 4px 0 #FF6347, inset -4px -4px 0 #DC143C, 4px 4px 0 #000;
          animation: hell-sun-glow 2s infinite alternate;
        }
        
        .pixel-hell-sun::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          width: 8px;
          height: 8px;
          background: #FF0000;
          border: 2px solid #8B0000;
        }
        
        .pixel-hell-sun::after {
          content: '';
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: #FF0000;
          border: 2px solid #8B0000;
        }
        
        /* Vegetación infernal */
        .hell-vegetation {
          background: linear-gradient(to top, #2F0000, #4B0000, #8B0000);
          filter: brightness(0.4) contrast(1.5) hue-rotate(30deg);
        }
        
        /* Torre infernal */
        .hell-tower {
          position: absolute;
          bottom: 0;
          right: 5%;
          width: 250px;
          height: 500px;
          z-index: 2;
        }
        
        .hell-tower .tower-base {
          background: #2F0000;
          border-color: #1a0000;
        }
        
        .hell-tower .tower-middle {
          background: #4B0000;
          border-color: #2F0000;
        }
        
        .hell-tower .tower-top {
          background: #8B0000;
          border-color: #4B0000;
        }
        
        .hell-tower .icesi-text {
          color: #FFD700;
          text-shadow: 0 0 15px #FF0000, 0 0 25px #FF4500;
          animation: hell-glow 1.5s ease-in-out infinite alternate;
        }
        
        /* Resplandor infernal */
        .hell-glow {
          position: absolute;
          top: -30px;
          left: -30px;
          right: -30px;
          bottom: -30px;
          background: radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, rgba(255, 69, 0, 0.2) 50%, transparent 70%);
          border-radius: 50%;
          animation: hell-glow-pulse 3s ease-in-out infinite;
        }
        
        /* Nubes infernales */
        .hell-clouds {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .hell-clouds .cloud {
          position: absolute;
          font-size: 2rem;
          opacity: 0.8;
          filter: brightness(0.2) hue-rotate(30deg);
          animation: hell-cloud-float 20s ease-in-out infinite;
        }
        
        .hell-clouds .cloud-1 {
          top: 25%;
          left: 15%;
          animation-delay: 0s;
        }
        
        .hell-clouds .cloud-2 {
          top: 35%;
          right: 20%;
          animation-delay: -7s;
        }
        
        .hell-clouds .cloud-3 {
          top: 20%;
          left: 65%;
          animation-delay: -14s;
        }
        
        /* Rayos */
        .lightning-bolts {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .lightning {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.9;
          animation: lightning-flash 4s ease-in-out infinite;
        }
        
        .lightning-1 {
          top: 30%;
          left: 30%;
          animation-delay: 0s;
        }
        
        .lightning-2 {
          top: 40%;
          right: 25%;
          animation-delay: -2s;
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
        
        /* Animales siendo capturados */
        .friends-being-captured {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          animation: friends-capture 3s ease-in-out infinite;
        }
        
        .friend-flying {
          font-size: 3rem;
          animation: friend-fly 2s ease-in-out infinite;
        }
        
        .andy { animation-delay: 0s; }
        .pigeon { animation-delay: -0.4s; }
        .bat { animation-delay: -0.8s; }
        .lizard { animation-delay: -1.2s; }
        .possum { animation-delay: -1.6s; }
        
        /* Caja de texto refinada */
        .story-text-box.refined {
          position: relative;
          z-index: 15;
        }
        
        .text-box-background {
          background: rgba(14, 20, 27, 0.9);
          border: 3px solid #FFD700;
          border-radius: 6px;
          padding: 1.5rem 2.5rem;
          position: relative;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
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
          background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
          border-radius: 8px;
          z-index: -1;
          animation: hell-border-glow 2s ease-in-out infinite;
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
          color: #FFD700;
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
          color: #FFD700;
        }
        
        .dot.filled {
          animation: dot-pulse 2s ease-in-out infinite;
        }
        
        /* Animaciones */
        @keyframes hell-sun-glow {
          0%, 100% { 
            box-shadow: inset 4px 4px 0 #FF6347, inset -4px -4px 0 #DC143C, 4px 4px 0 #000, 0 0 25px rgba(255, 69, 0, 0.6);
          }
          50% { 
            box-shadow: inset 4px 4px 0 #FF6347, inset -4px -4px 0 #DC143C, 4px 4px 0 #000, 0 0 35px rgba(255, 69, 0, 0.9);
          }
        }
        
        @keyframes hell-glow {
          0%, 100% { 
            text-shadow: 0 0 15px #FF0000, 0 0 25px #FF4500;
          }
          50% { 
            text-shadow: 0 0 25px #FF0000, 0 0 35px #FF4500, 0 0 45px #FFD700;
          }
        }
        
        @keyframes hell-glow-pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        @keyframes hell-cloud-float {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(40px) translateY(-20px); }
          50% { transform: translateX(-30px) translateY(15px); }
          75% { transform: translateX(35px) translateY(-10px); }
        }
        
        @keyframes lightning-flash {
          0%, 90%, 100% { opacity: 0; }
          95% { opacity: 0.9; }
        }
        
        @keyframes friends-capture {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes friend-fly {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        
        @keyframes hell-border-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
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
          .friends-being-captured {
            gap: 1rem;
          }
          
          .friend-flying {
            font-size: 2.5rem;
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

export default Frame3;