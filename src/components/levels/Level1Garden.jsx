import React, { useEffect, useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Level1Garden = () => {
  const { state, updateLevel1State, updateScore, showScreen } = useGame();
  
  // Estados del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 10, y: 20 });
  const [playerVelocity, setPlayerVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [enemies, setEnemies] = useState([]);
  const [packets, setPackets] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // Constantes del juego
  const GRAVITY = 0.8;
  const JUMP_POWER = -12;
  const PLAYER_SPEED = 3;
  const GROUND_LEVEL = 20;

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
      // Crear enemigos iniciales
      const initialEnemies = [
        { id: 1, x: 200, y: 100, defeated: false },
        { id: 2, x: 400, y: 150, defeated: false },
        { id: 3, x: 600, y: 120, defeated: false }
      ];
      setEnemies(initialEnemies);

      // Crear paquetes iniciales
      const initialPackets = [
        { id: 1, x: 150, y: 200, collected: false },
        { id: 2, x: 350, y: 250, collected: false },
        { id: 3, x: 550, y: 220, collected: false },
        { id: 4, x: 750, y: 180, collected: false }
      ];
      setPackets(initialPackets);

      setGameStarted(true);
      showTemporaryMessage("¡Bienvenido al Jardín de Redes! Usa las flechas para moverte y ESPACIO para saltar.");
    }
  }, [gameStarted, showTemporaryMessage]);

  // Controles del jugador
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPlayerVelocity(prev => ({ ...prev, x: -PLAYER_SPEED }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerVelocity(prev => ({ ...prev, x: PLAYER_SPEED }));
          break;
        case ' ':
          if (!isJumping && playerPosition.y >= GROUND_LEVEL) {
            setPlayerVelocity(prev => ({ ...prev, y: JUMP_POWER }));
            setIsJumping(true);
            showTemporaryMessage("¡Perfecto! ESPACIO hace que Andy salte.");
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
  }, [gameStarted, isJumping, playerPosition.y, showTemporaryMessage]);

  // Física del jugador
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      setPlayerPosition(prev => {
        let newX = prev.x + playerVelocity.x;
        let newY = prev.y + playerVelocity.y;

        // Limitar movimiento horizontal
        newX = Math.max(0, Math.min(800, newX));

        // Aplicar gravedad
        if (newY < GROUND_LEVEL) {
          newY = GROUND_LEVEL;
          setIsJumping(false);
          setPlayerVelocity(prevVel => ({ ...prevVel, y: 0 }));
        } else if (newY > GROUND_LEVEL) {
          setPlayerVelocity(prevVel => ({ ...prevVel, y: prevVel.y + GRAVITY }));
        }

        return { x: newX, y: newY };
      });
    }, 16); // ~60fps

    return () => clearInterval(gameLoop);
  }, [gameStarted, playerVelocity, GROUND_LEVEL]);

  // Detectar colisiones
  useEffect(() => {
    if (!gameStarted) return;

    const checkCollisions = () => {
      // Colisión con enemigos
      enemies.forEach(enemy => {
        if (!enemy.defeated) {
          const distance = Math.sqrt(
            Math.pow(playerPosition.x - enemy.x, 2) + 
            Math.pow(playerPosition.y - enemy.y, 2)
          );
          
          if (distance < 40) {
            // Click en enemigo
            defeatEnemy(enemy.id);
          }
        }
      });

      // Colisión con paquetes
      packets.forEach(packet => {
        if (!packet.collected) {
          const distance = Math.sqrt(
            Math.pow(playerPosition.x - packet.x, 2) + 
            Math.pow(playerPosition.y - packet.y, 2)
          );
          
          if (distance < 30) {
            collectPacket(packet.id);
          }
        }
      });
    };

    const collisionInterval = setInterval(checkCollisions, 100);
    return () => clearInterval(collisionInterval);
  }, [gameStarted, playerPosition, enemies, packets]);

  // Funciones del juego
  const defeatEnemy = (enemyId) => {
    setEnemies(prev => prev.map(enemy => 
      enemy.id === enemyId ? { ...enemy, defeated: true } : enemy
    ));
    
    // Generar nuevo paquete
    const newPacket = {
      id: Date.now(),
      x: Math.random() * 600 + 100,
      y: Math.random() * 200 + 150,
      collected: false
    };
    setPackets(prev => [...prev, newPacket]);
    
    showTemporaryMessage("¡Un error de transmisión eliminado! Se generó un paquete de datos brillante.");
    updateScore(100);
  };

  const collectPacket = (packetId) => {
    setPackets(prev => prev.map(packet => 
      packet.id === packetId ? { ...packet, collected: true } : packet
    ));
    
    updateLevel1State({ 
      dataPacketsCollected: state.level1State.dataPacketsCollected + 1 
    });
    updateScore(150);
    
    showTemporaryMessage("¡Paquete de datos recolectado! Los paquetes son como mensajes en Internet.");
  };

  const pingFlower = (flowerId) => {
    showTemporaryMessage("¡Ping! Las flores son nodos de red que responden a las conexiones.");
  };

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
    if (state.level1State.dataPacketsCollected >= 3 && state.level1State.routersFixed >= 2) {
      showTemporaryMessage("¡Estamos cerca! Restablece la conexión final para liberarla.");
      updateLevel1State({ currentPuzzle: 'packet-sorting' });
    } else {
      showTemporaryMessage("Necesitas recolectar más paquetes y reparar los routers primero.");
    }
  };

  const rescuePigeon = () => {
    showTemporaryMessage("¡Has aprendido cómo las redes transmiten mensajes! Gracias a ti, el Jardín vuelve a estar conectado.");
    updateLevel1State({ pigeonRescued: true });
    updateScore(500);
    
    setTimeout(() => {
      showScreen('level-summary-screen');
    }, 3000);
  };

  if (!gameStarted) {
    return <div>Cargando nivel...</div>;
  }

  return (
    <div className="level-container">
      <div className="level-header">
        <h1>Level 1 Garden</h1>
      </div>
    </div>
  );
};

export default Level1Garden;