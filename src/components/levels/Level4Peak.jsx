import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Level4Peak = () => {
  const { state, updateScore, updateLevel4State, showScreen } = useGame();
  
  // Verificar que las funciones necesarias estén disponibles
  if (!updateLevel4State) {
    console.error('updateLevel4State no está disponible');
    return <div>Error: Funciones del juego no disponibles</div>;
  }
  
  // Estado local del nivel
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 100 });
  const [isJumping, setIsJumping] = useState(false);
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const [onPlatform, setOnPlatform] = useState(true);
  const [message, setMessage] = useState('');
  const [windDirection, setWindDirection] = useState('right');
  const [windStrength, setWindStrength] = useState(1);
  
  // Elementos del nivel
  const [modules, setModules] = useState([
    { id: 1, x: 200, y: 200, collected: false, type: 'frontend', name: 'Frontend Module' },
    { id: 2, x: 400, y: 150, collected: false, type: 'backend', name: 'Backend Module' },
    { id: 3, x: 600, y: 250, collected: false, type: 'database', name: 'Database Module' },
    { id: 4, x: 800, y: 180, collected: false, type: 'api', name: 'API Module' }
  ]);
  
  const [platforms, setPlatforms] = useState([
    { id: 1, x: 150, y: 200, width: 100, moving: true, direction: 1, speed: 1, range: 100 },
    { id: 2, x: 350, y: 150, width: 120, moving: true, direction: -1, speed: 0.8, range: 80 },
    { id: 3, x: 550, y: 250, width: 100, moving: true, direction: 1, speed: 1.2, range: 120 },
    { id: 4, x: 750, y: 180, width: 140, moving: true, direction: -1, speed: 0.9, range: 90 }
  ]);
  
  const [bugs, setBugs] = useState([
    { id: 1, x: 300, y: 160, fixed: false, type: 'syntax', name: 'Syntax Error' },
    { id: 2, x: 500, y: 260, fixed: false, type: 'logic', name: 'Logic Error' },
    { id: 3, x: 700, y: 190, fixed: false, type: 'runtime', name: 'Runtime Error' }
  ]);
  
  // Constantes del nivel
  const GROUND_LEVEL = 100;
  const GRAVITY = 0.5;
  const JUMP_POWER = -12;
  const PLAYER_SPEED = 3;
  const WIND_EFFECT = 0.5;
  
  // Inicializar el estado del nivel 4 si no existe
  useEffect(() => {
    if (!state.level4State) {
      updateLevel4State({
        introCompleted: false,
        modulesCollected: 0,
        testsCompleted: 0,
        bugsFixed: 0,
        codeReviewed: false,
        deploymentReady: false,
        possumRescued: false,
        platformsActivated: 0,
        windDirection: 'right',
        windStrength: 1
      });
    }
  }, [state.level4State, updateLevel4State]);

  // Inicializar el juego
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
      showTemporaryMessage("¡Bienvenido al Pico de Software! Cuidado con los vientos cambiantes...");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Sistema de vientos cambiantes
  useEffect(() => {
    if (!gameStarted) return;
    
    const windTimer = setInterval(() => {
      const directions = ['left', 'right', 'up', 'down'];
      const newDirection = directions[Math.floor(Math.random() * directions.length)];
      const newStrength = Math.random() * 2 + 0.5; // 0.5 a 2.5
      
      setWindDirection(newDirection);
      setWindStrength(newStrength);
      updateLevel4State({ windDirection: newDirection, windStrength: newStrength });
      
      showTemporaryMessage(`¡Viento ${newDirection === 'left' ? '←' : newDirection === 'right' ? '→' : newDirection === 'up' ? '↑' : '↓'} de fuerza ${newStrength.toFixed(1)}!`);
    }, 5000);
    
    return () => clearInterval(windTimer);
  }, [gameStarted, updateLevel4State]);
  
  // Movimiento de plataformas
  useEffect(() => {
    if (!gameStarted) return;
    
    const platformTimer = setInterval(() => {
      setPlatforms(prevPlatforms => 
        prevPlatforms.map(platform => {
          if (!platform.moving) return platform;
          
          let newX = platform.x + (platform.direction * platform.speed);
          let newDirection = platform.direction;
          
          // Cambiar dirección en los límites
          if (newX <= platform.range || newX >= 800 - platform.range) {
            newDirection = -platform.direction;
          }
          
          return {
            ...platform,
            x: Math.max(platform.range, Math.min(800 - platform.range, newX)),
            direction: newDirection
          };
        })
      );
    }, 50);
    
    return () => clearInterval(platformTimer);
  }, [gameStarted]);
  
  // Física del jugador
  useEffect(() => {
    if (!gameStarted) return;
    
    const physicsTimer = setInterval(() => {
      setPlayerPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        // Aplicar efecto del viento
        if (windDirection === 'left') {
          newX -= windStrength * WIND_EFFECT;
        } else if (windDirection === 'right') {
          newX += windStrength * WIND_EFFECT;
        }
        
        // Limitar posición horizontal
        newX = Math.max(20, Math.min(980, newX));
        
        // Verificar colisión con plataformas
        let onAnyPlatform = false;
        platforms.forEach(platform => {
          if (newX >= platform.x - 20 && newX <= platform.x + platform.width + 20 &&
              newY <= platform.y + 20 && newY >= platform.y - 20) {
            onAnyPlatform = true;
            newY = platform.y;
          }
        });
        
        // Si no está en plataforma, aplicar gravedad
        if (!onAnyPlatform && newY < 400) {
          if (windDirection === 'up') {
            newY -= windStrength * WIND_EFFECT * 0.3;
          } else if (windDirection === 'down') {
            newY += windStrength * WIND_EFFECT * 0.8;
          }
        }
        
        setOnPlatform(onAnyPlatform);
        return { x: newX, y: Math.max(GROUND_LEVEL, newY) };
      });
    }, 50);
    
    return () => clearInterval(physicsTimer);
  }, [gameStarted, platforms, windDirection, windStrength]);
  
  // Mostrar mensaje temporal
  const showTemporaryMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }, []);
  
  // Controles del teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      
      switch(e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          setPlayerPosition(prev => ({
            ...prev,
            x: Math.max(20, prev.x - PLAYER_SPEED)
          }));
          break;
        case 'd':
        case 'arrowright':
          setPlayerPosition(prev => ({
            ...prev,
            x: Math.min(980, prev.x + PLAYER_SPEED)
          }));
          break;
        case 'w':
        case ' ':
        case 'arrowup':
          if (onPlatform && !isJumping) {
            setIsJumping(true);
            setJumpVelocity(JUMP_POWER);
            setOnPlatform(false);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, onPlatform, isJumping]);
  
  // Salto
  useEffect(() => {
    if (!isJumping) return;
    
    const jumpTimer = setInterval(() => {
      setJumpVelocity(prev => prev + GRAVITY);
      setPlayerPosition(prev => {
        const newY = prev.y + jumpVelocity;
        if (newY >= GROUND_LEVEL) {
          setIsJumping(false);
          setJumpVelocity(0);
          return { ...prev, y: GROUND_LEVEL };
        }
        return { ...prev, y: newY };
      });
    }, 50);
    
    return () => clearInterval(jumpTimer);
  }, [isJumping, jumpVelocity]);
  
  // Recolectar módulos
  const collectModule = (moduleId) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, collected: true } : m
    ));
    
    const module = modules.find(m => m.id === moduleId);
    updateScore(200);
    updateLevel4State({ modulesCollected: (state.level4State?.modulesCollected || 0) + 1 });
    showTemporaryMessage(`¡${module.name} recolectado! +200 puntos`);
  };
  
  // Arreglar bugs
  const fixBug = (bugId) => {
    setBugs(prev => prev.map(b => 
      b.id === bugId ? { ...b, fixed: true } : b
    ));
    
    const bug = bugs.find(b => b.id === bugId);
    updateScore(150);
    updateLevel4State({ bugsFixed: (state.level4State?.bugsFixed || 0) + 1 });
    showTemporaryMessage(`¡${bug.name} arreglado! +150 puntos`);
  };
  
  // Verificar si se puede rescatar a la zarigüeya
  const canRescuePossum = () => {
    if (!state.level4State) return false;
    return state.level4State.modulesCollected >= 4 && 
           state.level4State.bugsFixed >= 3;
  };
  
  // Rescatar zarigüeya
  const rescuePossum = () => {
    if (canRescuePossum()) {
      updateLevel4State({ possumRescued: true });
      updateScore(500);
      showTemporaryMessage("¡Zarigüeya rescatada! ¡Software desplegado exitosamente!");
      
      setTimeout(() => {
        showScreen('level-summary-screen');
      }, 3000);
    } else {
      const modulesNeeded = 4 - (state.level4State?.modulesCollected || 0);
      const bugsNeeded = 3 - (state.level4State?.bugsFixed || 0);
      showTemporaryMessage(`Necesitas: ${modulesNeeded} módulos, ${bugsNeeded} bugs por arreglar`);
    }
  };
  
  if (!gameStarted) {
    return <div>Cargando pico ventoso...</div>;
  }
  
  return (
    <div className="level-container" style={{ 
      background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)',
      position: 'relative',
      width: '1000px',
      height: '500px',
      overflow: 'hidden'
    }}>
      
      {/* Nubes de fondo */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '100px',
        fontSize: '3rem',
        opacity: 0.7,
        animation: 'float 4s ease-in-out infinite'
      }}>☁️</div>
      
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '150px',
        fontSize: '2.5rem',
        opacity: 0.6,
        animation: 'float 3s ease-in-out infinite reverse'
      }}>☁️</div>
      
      {/* Indicador de viento */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '0.6rem'
      }}>
        <div>Viento: {windDirection === 'left' ? '←' : windDirection === 'right' ? '→' : windDirection === 'up' ? '↑' : '↓'}</div>
        <div>Fuerza: {windStrength.toFixed(1)}</div>
      </div>
      
      {/* Plataformas móviles */}
      {platforms.map(platform => (
        <div key={platform.id} style={{
          position: 'absolute',
          left: `${platform.x}px`,
          bottom: `${platform.y}px`,
          width: `${platform.width}px`,
          height: '20px',
          background: 'linear-gradient(45deg, #708090, #778899)',
          borderRadius: '10px',
          border: '2px solid #556B2F',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          transition: platform.moving ? 'none' : 'all 0.3s'
        }} />
      ))}
      
      {/* Módulos de software */}
      {modules.filter(m => !m.collected).map(module => (
        <div
          key={module.id}
          onClick={() => collectModule(module.id)}
          style={{
            position: 'absolute',
            left: `${module.x}px`,
            bottom: `${module.y + 30}px`,
            width: '40px',
            height: '40px',
            background: module.type === 'frontend' ? '#61DAFB' :
                       module.type === 'backend' ? '#68217A' :
                       module.type === 'database' ? '#336791' : '#FF6B35',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 0 15px rgba(255,255,255,0.5)',
            animation: 'pulse 2s infinite'
          }}
          title={module.name}
        >
          {module.type === 'frontend' ? '🎨' :
           module.type === 'backend' ? '⚙️' :
           module.type === 'database' ? '🗄️' : '🔗'}
        </div>
      ))}
      
      {/* Bugs para arreglar */}
      {bugs.filter(b => !b.fixed).map(bug => (
        <div
          key={bug.id}
          onClick={() => fixBug(bug.id)}
          style={{
            position: 'absolute',
            left: `${bug.x}px`,
            bottom: `${bug.y + 40}px`,
            width: '35px',
            height: '35px',
            background: bug.type === 'syntax' ? '#FF4444' :
                       bug.type === 'logic' ? '#FF8800' : '#FF0088',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.5rem',
            animation: 'shake 1s infinite'
          }}
          title={`Arreglar ${bug.name}`}
        >
          🐛
        </div>
      ))}
      
      {/* Zarigüeya */}
      <div
        onClick={rescuePossum}
        style={{
          position: 'absolute',
          right: '50px',
          bottom: '350px',
          fontSize: '2.5rem',
          cursor: canRescuePossum() ? 'pointer' : 'not-allowed',
          opacity: canRescuePossum() ? 1 : 0.5,
          animation: canRescuePossum() ? 'bounce 2s infinite' : 'none',
          filter: canRescuePossum() ? 'brightness(1.2)' : 'grayscale(0.8)'
        }}
        title={canRescuePossum() ? "¡Rescatar Zarigüeya!" : "Completa todos los módulos y arregla los bugs"}
      >
        🐾
      </div>
      
      {/* Jugador (Andy) */}
      <div style={{
        position: 'absolute',
        left: `${playerPosition.x}px`,
        bottom: `${playerPosition.y}px`,
        fontSize: '1.6rem',
        transition: 'none',
        textShadow: '0 0 10px rgba(255,255,255,0.8)',
        transform: isJumping ? 'rotate(15deg)' : 'none'
      }}>
        🐿️
      </div>
      
      {/* HUD */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '0.6rem'
      }}>
        <div>Módulos: {state.level4State?.modulesCollected || 0}/4</div>
        <div>Bugs: {state.level4State?.bugsFixed || 0}/3</div>
        <div>Puntos: {state.totalScore}</div>
      </div>
      
      {/* Controles */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px',
        borderRadius: '8px',
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '0.5rem'
      }}>
        A/D: Mover | W/Espacio: Saltar
      </div>
      
      {/* Mensajes */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          fontFamily: 'Press Start 2P, monospace',
          fontSize: '0.7rem',
          textAlign: 'center',
          zIndex: 100
        }}>
          {message}
        </div>
      )}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Level4Peak;
