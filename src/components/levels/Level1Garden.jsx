import React, { useEffect, useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Level1Garden = () => {
  const { state, updateLevel1State, updateScore, showScreen } = useGame();
  
  // Estados del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 20, y: 20 });
  const [playerVelocity, setPlayerVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [enemies, setEnemies] = useState([]);
  const [packets, setPackets] = useState([]);
  const [coins, setCoins] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [carryingPackage, setCarryingPackage] = useState(false);
  const [collisionsCount, setCollisionsCount] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [canDoubleJump, setCanDoubleJump] = useState(false);
  const [hasDoubleJumped, setHasDoubleJumped] = useState(false);
  const [flowers] = useState([
    { id: 1, x: 120 },
    { id: 2, x: 260 },
    { id: 3, x: 420 },
    { id: 4, x: 760 }
  ]);

  // Constantes del juego
  const GRAVITY = -0.8;
  const JUMP_POWER = 12;
  const BASE_PLAYER_SPEED = 3;
  const GROUND_LEVEL = 20;
  const WORLD_WIDTH = 1000;
  const BRIDGE_X_START = 470; // posición de inicio del hueco/puente
  const BRIDGE_X_END = 530;   // posición de fin del hueco/puente
  const ROUTER1_X = 80;
  const ROUTER2_X = 900;

  // Mostrar mensaje temporal
  const showTemporaryMessage = useCallback((message, duration = 3000) => {
    setCurrentMessage(message);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, duration);
  }, []);

  // Escuchar mensajes de guía desde puzzles
  useEffect(() => {
    const handleGuideMessage = (event) => {
      showTemporaryMessage(event.detail.message, 4000);
    };
    
    window.addEventListener('showGuideMessage', handleGuideMessage);
    return () => window.removeEventListener('showGuideMessage', handleGuideMessage);
  }, [showTemporaryMessage]);

  // Inicializar elementos del juego
  useEffect(() => {
    if (!gameStarted) {
      // Crear enemigos iniciales
      const initialEnemies = [
        { id: 1, x: 240, y: 100, defeated: false },
        { id: 2, x: 520, y: 120, defeated: false },
        { id: 3, x: 700, y: 110, defeated: false }
      ];
      setEnemies(initialEnemies);

      // Sin paquetes a recolectar (mecánica deshabilitada)
      setPackets([]);

      // Monedas de energía
      const initialCoins = [
        { id: 1, x: 200, y: 90, collected: false },
        { id: 2, x: 480, y: 120, collected: false },
        { id: 3, x: 780, y: 140, collected: false }
      ];
      setCoins(initialCoins);

      // Obstáculos (congestión)
      const initialObstacles = [
        { id: 1, x: 300, y: 40 },
        { id: 2, x: 520, y: 40 },
        { id: 3, x: 700, y: 40 }
      ];
      setObstacles(initialObstacles);

      setGameStarted(true);
      setTimeout(() => setIntroVisible(false), 3500);
      showTemporaryMessage("¡Usa ← → para moverte, ESPACIO para saltar. Repara los Routers 1 y 2 para liberar a la Paloma!");
    }
  }, [gameStarted, showTemporaryMessage]);

  // Desbloquear puente: por Router 1 (cable) o por 3 paquetes (fallback)
  useEffect(() => {
    if (state.level1State.routersFixed >= 1 && !state.level1State.bridgeUnlocked) {
      updateLevel1State({ bridgeUnlocked: true });
      showTemporaryMessage("¡Conexión establecida! El camino dorado se desbloquea.");
      return;
    }
    if (state.level1State.dataPacketsCollected >= 3 && !state.level1State.bridgeUnlocked) {
      updateLevel1State({ bridgeUnlocked: true });
      showTemporaryMessage("Puente activado: ¡la red comienza a fluir!");
    }
  }, [state.level1State.dataPacketsCollected, state.level1State.bridgeUnlocked, state.level1State.routersFixed, updateLevel1State, showTemporaryMessage]);

  // Controles del jugador
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return;
      if (introVisible) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPlayerVelocity(prev => ({ ...prev, x: -BASE_PLAYER_SPEED * speedMultiplier }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerVelocity(prev => ({ ...prev, x: BASE_PLAYER_SPEED * speedMultiplier }));
          break;
        case ' ':
          if (!isJumping && playerPosition.y <= GROUND_LEVEL) {
            setPlayerVelocity(prev => ({ ...prev, y: JUMP_POWER }));
            setIsJumping(true);
            showTemporaryMessage("¡Perfecto! ESPACIO hace que Andy salte.");
            setHasDoubleJumped(false);
          } else if (canDoubleJump && !hasDoubleJumped) {
            setPlayerVelocity(prev => ({ ...prev, y: JUMP_POWER * 0.9 }));
            setHasDoubleJumped(true);
            showTemporaryMessage("¡Doble salto activado!");
          }
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
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

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, isJumping, playerPosition.y, speedMultiplier, canDoubleJump, hasDoubleJumped, introVisible, showTemporaryMessage]);

  // Física del jugador
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      setPlayerPosition(prev => {
        let newX = prev.x + playerVelocity.x;
        let newY = prev.y + playerVelocity.y;

        // Limitar movimiento horizontal
        newX = Math.max(0, Math.min(WORLD_WIDTH, newX));

        // Bloquear paso por el hueco si el puente no está activado
        if (!state.level1State.bridgeUnlocked) {
          if (prev.x < BRIDGE_X_START && newX >= BRIDGE_X_START) {
            newX = BRIDGE_X_START - 1;
            showTemporaryMessage("Este puente está caído. Recolecta 3 paquetes para activarlo.");
          }
        }

        // Aplicar gravedad (y es la distancia desde el suelo).
        if (newY <= GROUND_LEVEL) {
          newY = GROUND_LEVEL;
          if (isJumping) setIsJumping(false);
          setPlayerVelocity(prevVel => ({ ...prevVel, y: 0 }));
        } else {
          setPlayerVelocity(prevVel => ({ ...prevVel, y: prevVel.y + GRAVITY }));
        }

        return { x: newX, y: newY };
      });
    }, 16); // ~60fps

    return () => clearInterval(gameLoop);
  }, [gameStarted, playerVelocity, GROUND_LEVEL, state.level1State.bridgeUnlocked, showTemporaryMessage]);

  // Detectar colisiones
  useEffect(() => {
    if (!gameStarted) return;

    const checkCollisions = () => {
      // Colisión con enemigos => genera paquete
      enemies.forEach(enemy => {
        if (!enemy.defeated) {
          const distance = Math.sqrt(
            Math.pow(playerPosition.x - enemy.x, 2) + 
            Math.pow(playerPosition.y - enemy.y, 2)
          );
          if (distance < 40) {
            defeatEnemy(enemy.id);
          }
        }
      });

      // Sin colisión con paquetes (deshabilitado)

      // Colisión con obstáculos => pierdes paquete y vuelves a checkpoint
      obstacles.forEach(obs => {
        const distance = Math.abs(playerPosition.x - obs.x);
        if (distance < 20 && playerPosition.y <= 40) {
          handleObstacleHit();
        }
      });

      // Colisión con monedas (energía)
      coins.forEach(coin => {
        if (!coin.collected) {
          const distance = Math.sqrt(
            Math.pow(playerPosition.x - coin.x, 2) + 
            Math.pow(playerPosition.y - coin.y, 2)
          );
          if (distance < 25) {
            collectCoin(coin.id);
          }
        }
      });

      // No hay entrega en R2 en el modo de 3 puzzles
    };

    const collisionInterval = setInterval(checkCollisions, 100);
    return () => clearInterval(collisionInterval);
  }, [gameStarted, playerPosition, enemies, packets, carryingPackage, obstacles, coins]);

  // Funciones del juego
  const defeatEnemy = (enemyId) => {
    setEnemies(prev => prev.map(enemy => 
      enemy.id === enemyId ? { ...enemy, defeated: true } : enemy
    ));
    showTemporaryMessage("¡Un error de transmisión eliminado!");
    updateScore(100);
  };

  const collectPacket = () => {};

  const collectCoin = (coinId) => {
    setCoins(prev => prev.map(c => c.id === coinId ? { ...c, collected: true } : c));
    updateScore(50);
    if (!canDoubleJump) {
      setCanDoubleJump(true);
      showTemporaryMessage("⚡ Energía de red: puedes hacer doble salto por un rato.");
      setTimeout(() => setCanDoubleJump(false), 8000);
    } else {
      setSpeedMultiplier(1.6);
      showTemporaryMessage("⚡ Energía de red: ¡corres más rápido!");
      setTimeout(() => setSpeedMultiplier(1), 8000);
    }
  };

  const handleObstacleHit = () => {
    setCollisionsCount(prev => prev + 1);
    if (carryingPackage) {
      setCarryingPackage(false);
      showTemporaryMessage("❌ Congestión de red: perdiste el paquete. Vuelve a recoger otro.");
    } else {
      showTemporaryMessage("❌ Congestión de red: te detuvo el tráfico.");
    }
    // Retroceso leve
    setPlayerPosition(prev => ({ x: Math.max(20, prev.x - 40), y: GROUND_LEVEL }));
  };

  const deliverPackage = () => {
    setCarryingPackage(false);
    setDeliveredCount(prev => prev + 1);
    updateScore(200);
    showTemporaryMessage("📡 Paquete entregado en Router 2. ¡Sigue así!");
  };

  // Abrir puzzles
  const openRouterPuzzle = (routerId) => {
    if (routerId === 1) {
      showTemporaryMessage("Un ingeniero de sistemas sabe cómo conectar los puntos. Restablece el camino de la información.");
      updateLevel1State({ currentPuzzle: 'cable' });
    } else {
      showTemporaryMessage("Algunas veces debes elegir cómo transmitir los datos. ¿Qué protocolo usarías?");
      updateLevel1State({ currentPuzzle: 'protocol' });
    }
  };

  const openCagePuzzle = () => {
    console.log('🕊️ Level1Garden: Intentando abrir jaula, routersFixed:', state.level1State.routersFixed);
    if (state.level1State.routersFixed >= 2) {
      console.log('🕊️ Level1Garden: Jaula desbloqueada, abriendo puzzle final');
      showTemporaryMessage("¡Estamos cerca! Restablece la conexión final para liberarla.");
      updateLevel1State({ currentPuzzle: 'packet-sorting' });
    } else {
      console.log('🕊️ Level1Garden: Jaula bloqueada, necesitas reparar más routers');
      showTemporaryMessage("Repara primero ambos routers para liberar a la Paloma.");
    }
  };

  // Final al entregar 3 paquetes

  // Log del estado actual (solo cuando cambia)
  if (state.level1State.routersFixed >= 2) {
    console.log('🌱 Level1Garden: Jaula debería estar desbloqueada, routersFixed:', state.level1State.routersFixed);
  }

  if (!gameStarted) {
    return <div>Cargando nivel...</div>;
  }

  return (
    <div className="level-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Intro fade-in */}
      {introVisible && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
          <div style={{ maxWidth: '720px', textAlign: 'center', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '1rem', marginBottom: '1rem' }}>Bienvenido a la Red de los Bosques</h2>
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.7rem', lineHeight: 1.6 }}>
              Aquí los paquetes (📦) deben llegar desde el Router 1 hasta el Router 2. Tú, ardilla veloz, harás que la información fluya sin pérdidas.
            </p>
            <button onClick={() => setIntroVisible(false)} className="btn-primary" style={{ marginTop: '1.2rem' }}>Comenzar</button>
          </div>
        </div>
      )}

      {/* HUD */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'white', fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
        <div>Colisiones: {collisionsCount}</div>
        <div>Energía: {canDoubleJump ? 'Doble salto' : speedMultiplier > 1 ? 'Velocidad' : '—'}</div>
      </div>

      {/* Botón de desarrollo - Pasar a siguiente nivel */}
      <button 
        onClick={() => {
          console.log('🚀 Modo desarrollo: Pasando al siguiente nivel');
          updateLevel1State({ pigeonRescued: true });
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
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.8rem 1rem', borderRadius: '8px', zIndex: 10, maxWidth: '360px', fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem', lineHeight: 1.4 }}>
          {currentMessage}
        </div>
      )}

      {/* Mundo */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <div style={{ position: 'relative', width: `${WORLD_WIDTH}px`, height: '360px', background: 'linear-gradient(#b8e994, #60a3bc)', border: '3px solid #2c3e50', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Suelo */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '40px', background: '#27ae60' }} />

          {/* Flores (nodos con ping al pisarlas) */}
          {flowers.map(f => (
            <div key={f.id} style={{ position: 'absolute', left: `${f.x}px`, bottom: '40px', width: '24px', height: '24px', borderRadius: '50%', background: '#f1c40f', boxShadow: '0 0 12px rgba(241,196,15,0.8)' }} />
          ))}

          {/* Hueco y puente */}
          <div style={{ position: 'absolute', left: `${BRIDGE_X_START}px`, width: `${BRIDGE_X_END - BRIDGE_X_START}px`, bottom: 0, height: '40px', background: state.level1State.bridgeUnlocked ? '#f1c40f' : '#2c3e50' }} />
          {!state.level1State.bridgeUnlocked && (
            <div style={{ position: 'absolute', left: `${BRIDGE_X_START}px`, width: `${BRIDGE_X_END - BRIDGE_X_START}px`, bottom: '40px', top: 0, background: 'rgba(0,0,0,0.15)' }} />
          )}

          {/* Router 1 (antena parpadeando) */}
          <div onClick={() => openRouterPuzzle(1)} title="Router 1" style={{ position: 'absolute', left: `${ROUTER1_X}px`, bottom: '60px', width: '90px', height: '60px', background: '#2980b9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Press Start 2P, monospace', fontSize: '0.5rem', cursor: 'pointer' }}>
            R1
            <div style={{ position: 'absolute', top: '-10px', width: '6px', height: '10px', background: '#f1c40f', boxShadow: '0 0 8px rgba(241,196,15,0.9)' }} />
          </div>

          {/* Router 2 (puzzle de protocolo) */}
          <div onClick={() => openRouterPuzzle(2)} title="Router 2" style={{ position: 'absolute', left: `${ROUTER2_X}px`, bottom: '60px', width: '90px', height: '60px', background: state.level1State.routersFixed >= 2 ? '#27ae60' : '#7f8c8d', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Press Start 2P, monospace', fontSize: '0.5rem', cursor: 'pointer', boxShadow: state.level1State.routersFixed >= 2 ? '0 0 12px rgba(39,174,96,0.9)' : 'none' }}>
            R2
            <div style={{ position: 'absolute', top: '-10px', width: '6px', height: '10px', background: state.level1State.routersFixed >= 2 ? '#2ecc71' : '#bdc3c7', boxShadow: state.level1State.routersFixed >= 2 ? '0 0 8px rgba(46,204,113,0.9)' : 'none' }} />
          </div>

          {/* Jaula de la Paloma */}
          <div onClick={() => {
            console.log('🕊️ Level1Garden: Click en jaula detectado, routersFixed:', state.level1State.routersFixed);
            openCagePuzzle();
          }} title="Jaula de la Paloma" style={{ 
            position: 'absolute', 
            left: `${ROUTER2_X - 100}px`, 
            bottom: '60px', 
            width: '80px', 
            height: '80px', 
            background: state.level1State.routersFixed >= 2 ? '#f39c12' : '#95a5a6', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.5rem', 
            cursor: state.level1State.routersFixed >= 2 ? 'pointer' : 'not-allowed',
            boxShadow: state.level1State.routersFixed >= 2 ? '0 0 15px rgba(243,156,18,0.8)' : 'none',
            border: state.level1State.routersFixed >= 2 ? '2px solid #e67e22' : '2px solid #7f8c8d'
          }}>
            🕊️
            {state.level1State.routersFixed < 2 && (
              <div style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '0.8rem' }}>🔒</div>
            )}
          </div>

          {/* Obstáculos (congestión ❌) */}
          {obstacles.map(obs => (
            <div key={obs.id} style={{ position: 'absolute', left: `${obs.x}px`, bottom: `${obs.y}px`, fontSize: '1.2rem', color: '#e74c3c' }}>❌</div>
          ))}

          {/* Enemigos */}
          {enemies.filter(e => !e.defeated).map(enemy => (
            <div key={enemy.id} style={{ position: 'absolute', left: `${enemy.x}px`, bottom: `${enemy.y}px`, transform: 'translateY(-20px)', fontSize: '1.2rem' }}>❌</div>
          ))}

          {/* Paquetes coleccionables ocultos */}

          {/* Monedas de energía */}
          {coins.filter(c => !c.collected).map(coin => (
            <div key={coin.id} style={{ position: 'absolute', left: `${coin.x}px`, bottom: `${coin.y}px`, fontSize: '1.1rem', color: '#f1c40f', textShadow: '0 0 8px rgba(241,196,15,0.9)' }}>⚡</div>
          ))}

          {/* Jugador (Andy) con animaciones sencillas */}
          <div style={{ position: 'absolute', left: `${playerPosition.x}px`, bottom: `${playerPosition.y}px`, fontSize: '1.6rem', transition: 'transform 120ms' }}>
            {isJumping ? '🐿️🦘' : (playerVelocity.x !== 0 ? '🐿️💨' : '🐿️')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level1Garden;