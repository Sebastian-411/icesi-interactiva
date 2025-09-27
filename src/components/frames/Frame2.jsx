import React, { useState, useEffect } from 'react';

const Frame2 = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = "Hasta que alguien decidió arruinarlo todo...";
  
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
    <div className="story-frame active" data-frame="2">
      {/* Fondo de la portada con ambiente tenebroso */}
      <div className="frame-background icesi-campus-background tenebroso">
        <div className="pixel-moon"></div>
        <div className="tropical-vegetation dark-vegetation"></div>
        <div className="icesi-tower ominous-tower">
          <div className="tower-base"></div>
          <div className="tower-middle"></div>
          <div className="tower-top">
            <div className="icesi-text">ICESI</div>
            <div className="tower-clock"></div>
          </div>
          <div className="brick-patterns"></div>
          <div className="villain-silhouette">👹</div>
        </div>
        <div className="dark-clouds">
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">☁️</div>
          <div className="cloud cloud-3">☁️</div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="frame-content">
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
        
        /* Fondo de la portada con ambiente tenebroso */
        .frame-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #2c3e50, #34495e, #1a1a2e);
          overflow: hidden;
        }
        
        /* Luna tenebrosa */
        .pixel-moon {
          position: absolute;
          top: 15%;
          left: 10%;
          width: 80px;
          height: 80px;
          background: #E6E6FA;
          border: 4px solid #C0C0C0;
          border-radius: 0;
          box-shadow: inset 4px 4px 0 #F0F8FF, inset -4px -4px 0 #B0B0B0, 4px 4px 0 #000;
          animation: moon-glow 4s infinite alternate;
        }
        
        .pixel-moon::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          width: 15px;
          height: 15px;
          background: #D3D3D3;
          border-radius: 50%;
        }
        
        .pixel-moon::after {
          content: '';
          position: absolute;
          top: 15px;
          right: 15px;
          width: 10px;
          height: 10px;
          background: #D3D3D3;
          border-radius: 50%;
        }
        
        /* Vegetación oscura */
        .dark-vegetation {
          background: linear-gradient(to top, #1a3a1a, #2d4a2d, #3a5a3a);
          filter: brightness(0.6) contrast(1.2);
        }
        
        /* Torre ominosa */
        .ominous-tower {
          position: absolute;
          bottom: 0;
          right: 5%;
          width: 250px;
          height: 500px;
          z-index: 2;
        }
        
        .ominous-tower .tower-base {
          background: #4a2c2c;
          border-color: #3a1a1a;
        }
        
        .ominous-tower .tower-middle {
          background: #5a3c3c;
          border-color: #4a2c2c;
        }
        
        .ominous-tower .tower-top {
          background: #6a4c4c;
          border-color: #5a3c3c;
        }
        
        .ominous-tower .icesi-text {
          color: #ff4444;
          text-shadow: 0 0 10px #ff0000;
          animation: ominous-glow 2s ease-in-out infinite alternate;
        }
        
        /* Villano */
        .villain-silhouette {
          position: absolute;
          top: -50px;
          right: -20px;
          font-size: 3rem;
          animation: villain-float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 10px #ff0000);
        }
        
        /* Nubes oscuras */
        .dark-clouds {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .dark-clouds .cloud {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          filter: brightness(0.3);
          animation: dark-cloud-float 25s ease-in-out infinite;
        }
        
        .dark-clouds .cloud-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .dark-clouds .cloud-2 {
          top: 30%;
          right: 15%;
          animation-delay: -8s;
        }
        
        .dark-clouds .cloud-3 {
          top: 15%;
          left: 60%;
          animation-delay: -16s;
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
          border: 3px solid #ff4444;
          border-radius: 6px;
          padding: 1.5rem 2.5rem;
          position: relative;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
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
          background: linear-gradient(45deg, #ff4444, #ff6666, #ff4444);
          border-radius: 8px;
          z-index: -1;
          animation: ominous-border-glow 3s ease-in-out infinite;
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
          color: #ff4444;
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
          color: #ff4444;
        }
        
        .dot.filled {
          animation: dot-pulse 2s ease-in-out infinite;
        }
        
        /* Animaciones */
        @keyframes moon-glow {
          0%, 100% { 
            box-shadow: inset 4px 4px 0 #F0F8FF, inset -4px -4px 0 #B0B0B0, 4px 4px 0 #000, 0 0 20px rgba(230, 230, 250, 0.3);
          }
          50% { 
            box-shadow: inset 4px 4px 0 #F0F8FF, inset -4px -4px 0 #B0B0B0, 4px 4px 0 #000, 0 0 30px rgba(230, 230, 250, 0.6);
          }
        }
        
        @keyframes ominous-glow {
          0%, 100% { 
            text-shadow: 0 0 10px #ff0000;
          }
          50% { 
            text-shadow: 0 0 20px #ff0000, 0 0 30px #ff4444;
          }
        }
        
        @keyframes villain-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes dark-cloud-float {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(30px) translateY(-15px); }
          50% { transform: translateX(-20px) translateY(10px); }
          75% { transform: translateX(25px) translateY(-8px); }
        }
        
        @keyframes ominous-border-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 68, 68, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 68, 68, 0.6); }
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

export default Frame2;