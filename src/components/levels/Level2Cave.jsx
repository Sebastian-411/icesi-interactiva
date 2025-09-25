import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Level2Cave = () => {
  const { state, updateLevel2State, updateScore, showScreen } = useGame();
  
  // Estados del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 20 });
  const [playerVelocity, setPlayerVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [torchRadius, setTorchRadius] = useState(80); // Radio de visión inicial
  const [cpuBlocks, setCpuBlocks] = useState([]);
  const [ramFragments, setRamFragments] = useState([]);
  const [rocks, setRocks] = useState([]);
  const [bats, setBats] = useState([]);
  const [traps, setTraps] = useState([]);
  const [collectedCPU, setCollectedCPU] = useState(0);
  const [collectedRAM, setCollectedRAM] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [altarActivated, setAltarActivated] = useState(false);
  const [batRescued, setBatRescued] = useState(false);

  // Constantes del juego
  const GRAVITY = -0.8;
  const JUMP_POWER = 12;
  const GROUND_LEVEL = 20;
  const WORLD_WIDTH = 1000;
  const CAVE_HEIGHT = 400;
  const ALTAR_X = 500;
  const ALTAR_Y = 50;

  // Mostrar mensaje temporal
  const showTemporaryMessage = useCallback((message, duration = 3000) => {
    setCurrentMessage(message);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, duration);
  }, []);

  // Inicializar elementos del juego
  useEffect(() => {
    if (!gameStarted) {
      // Crear bloques de CPU
      const initialCPU = [
        { id: 1, x: 150, y: 100, collected: false },
        { id: 2, x: 300, y: 150, collected: false },
        { id: 3, x: 700, y: 120, collected: false },
        { id: 4, x: 850, y: 180, collected: false }
      ];
      setCpuBlocks(initialCPU);

      // Crear fragmentos de RAM
      const initialRAM = [
        { id: 1, x: 200, y: 200, collected: false },
        { id: 2, x: 400, y: 250, collected: false },
        { id: 3, x: 600, y: 300, collected: false },
        { id: 4, x: 800, y: 220, collected: false }
      ];
      setRamFragments(initialRAM);

      // Crear rocas que bloquean el paso
      const initialRocks = [
        { id: 1, x: 250, y: 50, pushable: true },
        { id: 2, x: 450, y: 80, pushable: true },
        { id: 3, x: 750, y: 60, pushable: true }
      ];
      setRocks(initialRocks);

      // Crear murciélagos voladores
      const initialBats = [
        { id: 1, x: 180, y: 120, defeated: false },
        { id: 2, x: 350, y: 180, defeated: false },
        { id: 3, x: 650, y: 140, defeated: false }
      ];
      setBats(initialBats);

      // Crear trampas (huecos negros)
      const initialTraps = [
        { id: 1, x: 320, y: 0, width: 40 },
        { id: 2, x: 520, y: 0, width: 30 },
        { id: 3, x: 720, y: 0, width: 35 }
      ];
      setTraps(initialTraps);

      setGameStarted(true);
    }
  }, [gameStarted]);

  // Física del jugador
  useEffect(() => {
    if (!gameStarted) return;
    
    const gameLoop = setInterval(() => {
      setPlayerPosition(prev => {
        let newX = prev.x + playerVelocity.x;
        let newY = prev.y + playerVelocity.y;
        
        // Límites horizontales
        newX = Math.max(10, Math.min(WORLD_WIDTH - 10, newX));
        
        // Aplicar gravedad
        if (newY <= GROUND_LEVEL) {
          newY = GROUND_LEVEL;
          if (isJumping) setIsJumping(false);
          setPlayerVelocity(prevVel => ({ ...prevVel, y: 0 }));
        } else {
          setPlayerVelocity(prevVel => ({ ...prevVel, y: prevVel.y + GRAVITY }));
        }
        
        return { x: newX, y: newY };
      });
    }, 16);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, playerVelocity, GROUND_LEVEL, isJumping]);

  // Controles del jugador
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      
      switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPlayerVelocity(prev => ({ ...prev, x: -3 }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerVelocity(prev => ({ ...prev, x: 3 }));
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          if (!isJumping && playerPosition.y <= GROUND_LEVEL) {
            setPlayerVelocity(prev => ({ ...prev, y: JUMP_POWER }));
            setIsJumping(true);
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          // Empujar rocas
          pushRock();
          break;
      }
    };

    const handleKeyRelease = (e) => {
      if (!gameStarted) return;
      
      switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerVelocity(prev => ({ ...prev, x: 0 }));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyRelease);
    };
  }, [gameStarted, isJumping, playerPosition.y]);

  // Función para empujar rocas
  const pushRock = () => {
    const playerRect = {
      x: playerPosition.x - 10,
      y: playerPosition.y - 20,
      width: 20,
      height: 20
    };

    setRocks(prev => prev.map(rock => {
      const rockRect = {
        x: rock.x - 15,
        y: rock.y - 15,
        width: 30,
        height: 30
      };

      if (isColliding(playerRect, rockRect) && rock.pushable) {
        // Empujar roca hacia la derecha
        const newX = Math.min(WORLD_WIDTH - 20, rock.x + 30);
        showTemporaryMessage("¡Roca empujada! El camino está más despejado.");
        return { ...rock, x: newX };
      }
      return rock;
    }));
  };

  // Función de colisión
  const isColliding = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Recolectar CPU
  const collectCPU = (cpuId) => {
    setCpuBlocks(prev => prev.filter(cpu => cpu.id !== cpuId));
    setCollectedCPU(prev => prev + 1);
    updateScore(150);
    showTemporaryMessage("¡Bloque de CPU recolectado! Tu velocidad aumenta.");
  };

  // Recolectar RAM
  const collectRAM = (ramId) => {
    setRamFragments(prev => prev.filter(ram => ram.id !== ramId));
    setCollectedRAM(prev => prev + 1);
    setTorchRadius(prev => prev + 20); // Aumentar radio de visión
    updateScore(100);
    showTemporaryMessage("¡Fragmento de RAM recolectado! Tu visión se expande.");
  };

  // Activar altar
  const activateAltar = () => {
    if (collectedCPU >= 3 && collectedRAM >= 3 && !altarActivated) {
      setAltarActivated(true);
      showTemporaryMessage("¡El altar se activa! El Sistema Operativo despierta...");
      
      setTimeout(() => {
        setBatRescued(true);
        showTemporaryMessage("¡El Murciélago Guardián está libre! El sistema operativo funciona.");
        
        setTimeout(() => {
          updateLevel2State({ batRescued: true });
          showScreen('level-summary-screen');
        }, 3000);
      }, 2000);
    } else {
      showTemporaryMessage(`Necesitas más recursos: ${collectedCPU}/3 CPU, ${collectedRAM}/3 RAM`);
    }
  };

  if (!gameStarted) {
    return <div>Cargando cueva...</div>;
  }

  return (
    <div className="level-container" style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      overflow: 'hidden'
    }}>
      {/* Intro */}
      {showIntro && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'rgba(0,0,0,0.9)', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 20 
        }}>
          <div style={{ maxWidth: '720px', textAlign: 'center', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '1rem', marginBottom: '1rem' }}>
              🌑 Cueva de Sistemas
            </h2>
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.7rem', lineHeight: 1.6 }}>
              En lo profundo de esta cueva descansa el Murciélago, guardián de los Sistemas Operativos. 
              Recolecta recursos (CPU ⚙️ y RAM 💾) para activar el altar y liberarlo.
            </p>
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem', marginTop: '1rem', color: '#ffd700' }}>
              Controles: ← → para mover, ESPACIO para saltar, ↓ para empujar rocas
            </p>
            <button 
              onClick={() => setShowIntro(false)} 
              className="btn-primary" 
              style={{ marginTop: '1.2rem' }}
            >
              Entrar a la Cueva
            </button>
          </div>
        </div>
      )}

      {/* Cueva principal */}
      {!showIntro && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Suelo de la cueva */}
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            right: 0, 
            bottom: 0, 
            height: '40px', 
            background: 'linear-gradient(90deg, #2c3e50, #34495e, #2c3e50)',
            borderTop: '2px solid #7f8c8d'
          }} />

          {/* Estalactitas (teclas rotas) */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'absolute', 
                left: `${100 + i * 100}px`, 
                top: '20px', 
                width: '20px', 
                height: '60px', 
                background: 'linear-gradient(180deg, #95a5a6, #7f8c8d)', 
                borderRadius: '10px 10px 0 0',
                boxShadow: '0 0 10px rgba(149,165,166,0.5)'
              }} 
            />
          ))}

          {/* Trampas (huecos negros) */}
          {traps.map(trap => (
            <div 
              key={trap.id} 
              style={{ 
                position: 'absolute', 
                left: `${trap.x}px`, 
                bottom: '40px', 
                width: `${trap.width}px`, 
                height: '40px', 
                background: 'black',
                borderRadius: '0 0 20px 20px'
              }} 
            />
          ))}

          {/* Rocas empujables */}
          {rocks.map(rock => (
            <div 
              key={rock.id} 
              style={{ 
                position: 'absolute', 
                left: `${rock.x}px`, 
                bottom: `${rock.y}px`, 
                width: '30px', 
                height: '30px', 
                background: 'linear-gradient(45deg, #7f8c8d, #95a5a6)', 
                borderRadius: '5px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }} 
              title="Roca - Presiona ↓ para empujar"
            />
          ))}

          {/* Murciélagos voladores */}
          {bats.filter(bat => !bat.defeated).map(bat => (
            <div 
              key={bat.id} 
              style={{ 
                position: 'absolute', 
                left: `${bat.x}px`, 
                bottom: `${bat.y}px`, 
                fontSize: '1.2rem',
                animation: 'batFly 2s ease-in-out infinite',
                animationDelay: `${bat.id * 0.5}s`
              }}
            >
              🦇
            </div>
          ))}

          {/* Bloques de CPU */}
          {cpuBlocks.filter(cpu => !cpu.collected).map(cpu => (
            <div 
              key={cpu.id} 
              onClick={() => collectCPU(cpu.id)}
              style={{ 
                position: 'absolute', 
                left: `${cpu.x}px`, 
                bottom: `${cpu.y}px`, 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(52,152,219,0.8)',
                animation: 'cpuGlow 1.5s ease-in-out infinite'
              }}
              title="Bloque de CPU - Aumenta velocidad"
            >
              ⚙️
            </div>
          ))}

          {/* Fragmentos de RAM */}
          {ramFragments.filter(ram => !ram.collected).map(ram => (
            <div 
              key={ram.id} 
              onClick={() => collectRAM(ram.id)}
              style={{ 
                position: 'absolute', 
                left: `${ram.x}px`, 
                bottom: `${ram.y}px`, 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(155,89,182,0.8)',
                animation: 'ramGlow 1.5s ease-in-out infinite'
              }}
              title="Fragmento de RAM - Expande visión"
            >
              💾
            </div>
          ))}

          {/* Altar del Sistema Operativo */}
          <div 
            onClick={activateAltar}
            style={{ 
              position: 'absolute', 
              left: `${ALTAR_X}px`, 
              bottom: `${ALTAR_Y}px`, 
              width: '80px', 
              height: '60px', 
              background: altarActivated ? 
                'linear-gradient(45deg, #f39c12, #e67e22)' : 
                'linear-gradient(45deg, #7f8c8d, #95a5a6)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              boxShadow: altarActivated ? 
                '0 0 20px rgba(243,156,18,0.8)' : 
                '0 0 10px rgba(0,0,0,0.3)',
              border: altarActivated ? '2px solid #e67e22' : '2px solid #7f8c8d'
            }}
            title="Altar del Sistema Operativo - Activa con recursos"
          >
            {altarActivated ? '⚡' : '🖥️'}
          </div>

          {/* Murciélago Guardián */}
          <div 
            style={{ 
              position: 'absolute', 
              left: `${ALTAR_X + 100}px`, 
              bottom: `${ALTAR_Y + 20}px`, 
              fontSize: '2rem',
              opacity: batRescued ? 1 : 0.3,
              animation: batRescued ? 'batRescue 2s ease-out' : 'none',
              textShadow: batRescued ? '0 0 20px rgba(52,152,219,0.8)' : 'none'
            }}
          >
            🦇
          </div>

          {/* Jugador (Andy con antorcha) */}
          <div style={{ 
            position: 'absolute', 
            left: `${playerPosition.x}px`, 
            bottom: `${playerPosition.y}px`, 
            fontSize: '1.6rem',
            transition: 'transform 120ms',
            textShadow: '0 0 15px rgba(255,193,7,0.8)'
          }}>
            🐿️🔥
          </div>

          {/* Efecto de visión limitada (círculo de luz) */}
          <div 
            style={{ 
              position: 'absolute', 
              left: `${playerPosition.x - torchRadius}px`, 
              bottom: `${playerPosition.y - torchRadius}px`, 
              width: `${torchRadius * 2}px`, 
              height: `${torchRadius * 2}px`, 
              background: `radial-gradient(circle, transparent 0%, transparent 70%, rgba(0,0,0,0.8) 100%)`,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 5
            }} 
          />
        </div>
      )}

      {/* HUD */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        zIndex: 10, 
        color: 'white', 
        fontFamily: 'Press Start 2P, monospace', 
        fontSize: '0.6rem', 
        textShadow: '0 2px 6px rgba(0,0,0,0.6)' 
      }}>
        <div>CPU: {collectedCPU}/3</div>
        <div>RAM: {collectedRAM}/3</div>
        <div>Visión: {torchRadius}px</div>
      </div>

      {/* Botón de desarrollo - Pasar a siguiente nivel */}
      <button 
        onClick={() => {
          console.log('🚀 Modo desarrollo: Pasando al siguiente nivel');
          updateLevel2State({ batRescued: true });
          showScreen('level-summary-screen');
        }}
        style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 10, 
          background: 'rgba(255, 193, 7, 0.9)', 
          color: 'black', 
          border: '2px solid #ffc107', 
          borderRadius: '5px', 
          padding: '0.5rem 1rem', 
          fontFamily: 'Press Start 2P, monospace', 
          fontSize: '0.5rem', 
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(255, 193, 7, 0.5)'
        }}
        title="Modo desarrollo - Saltar al siguiente nivel"
      >
        🚀 SIGUIENTE NIVEL
      </button>

      {/* Mensajes */}
      {showMessage && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          background: 'rgba(0,0,0,0.8)', 
          color: '#ffd700', 
          padding: '1rem 2rem', 
          borderRadius: '10px', 
          fontFamily: 'Press Start 2P, monospace', 
          fontSize: '0.6rem', 
          zIndex: 15, 
          textAlign: 'center', 
          border: '2px solid #ffd700' 
        }}>
          {currentMessage}
        </div>
      )}
    </div>
  );
};

export default Level2Cave;
