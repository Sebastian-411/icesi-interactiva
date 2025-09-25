import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Level3Swamp = () => {
  const { state, updateLevel3State, updateScore, showScreen } = useGame();
  
  // Estados del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 20 });
  const [playerVelocity, setPlayerVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [isOnLilypad, setIsOnLilypad] = useState(false);
  const [backpack, setBackpack] = useState([]);
  const [dataFields, setDataFields] = useState([]);
  const [primaryKeys, setPrimaryKeys] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const [lilypads, setLilypads] = useState([]);
  const [waterCurrents, setWaterCurrents] = useState([]);
  const [corruptedPlants, setCorruptedPlants] = useState([]);
  const [collectedFields, setCollectedFields] = useState(0);
  const [collectedKeys, setCollectedKeys] = useState(0);
  const [collectedIndexes, setCollectedIndexes] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [databaseComplete, setDatabaseComplete] = useState(false);
  const [lizardRescued, setLizardRescued] = useState(false);
  const [showDatabasePuzzle, setShowDatabasePuzzle] = useState(false);

  // Constantes del juego
  const GRAVITY = -0.6; // Menos gravedad por el agua
  const JUMP_POWER = 10;
  const GROUND_LEVEL = 20;
  const WORLD_WIDTH = 1000;
  const SWAMP_HEIGHT = 400;
  const DATABASE_X = 500;
  const DATABASE_Y = 50;
  const MOVEMENT_SPEED = 1.5; // Más lento por el fango

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
      // Crear campos de datos (tablas)
      const initialFields = [
        { id: 1, x: 150, y: 100, type: 'table', collected: false },
        { id: 2, x: 300, y: 150, type: 'row', collected: false },
        { id: 3, x: 700, y: 120, type: 'column', collected: false },
        { id: 4, x: 850, y: 180, type: 'table', collected: false }
      ];
      setDataFields(initialFields);

      // Crear llaves primarias
      const initialKeys = [
        { id: 1, x: 200, y: 200, collected: false },
        { id: 2, x: 400, y: 250, collected: false },
        { id: 3, x: 600, y: 300, collected: false }
      ];
      setPrimaryKeys(initialKeys);

      // Crear índices
      const initialIndexes = [
        { id: 1, x: 250, y: 80, collected: false },
        { id: 2, x: 450, y: 120, collected: false },
        { id: 3, x: 750, y: 90, collected: false }
      ];
      setIndexes(initialIndexes);

      // Crear nenúfares flotantes
      const initialLilypads = [
        { id: 1, x: 180, y: 120, size: 'medium' },
        { id: 2, x: 350, y: 180, size: 'large' },
        { id: 3, x: 520, y: 140, size: 'small' },
        { id: 4, x: 680, y: 200, size: 'medium' },
        { id: 5, x: 820, y: 160, size: 'large' }
      ];
      setLilypads(initialLilypads);

      // Crear corrientes de agua
      const initialCurrents = [
        { id: 1, x: 320, y: 0, width: 60, direction: 'right', strength: 0.5 },
        { id: 2, x: 520, y: 0, width: 40, direction: 'left', strength: 0.3 },
        { id: 3, x: 720, y: 0, width: 50, direction: 'right', strength: 0.4 }
      ];
      setWaterCurrents(initialCurrents);

      // Crear plantas corruptas
      const initialPlants = [
        { id: 1, x: 280, y: 50, defeated: false },
        { id: 2, x: 480, y: 80, defeated: false },
        { id: 3, x: 780, y: 60, defeated: false }
      ];
      setCorruptedPlants(initialPlants);

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
        
        // Verificar si está en un nenúfar
        const currentLilypad = lilypads.find(lilypad => 
          Math.abs(prev.x - lilypad.x) < 30 && Math.abs(prev.y - lilypad.y) < 20
        );
        
        if (currentLilypad) {
          setIsOnLilypad(true);
          // Moverse con el nenúfar (flotación)
          newY = currentLilypad.y + Math.sin(Date.now() * 0.001) * 5;
        } else {
          setIsOnLilypad(false);
        }
        
        // Verificar corrientes de agua
        const currentWater = waterCurrents.find(current => 
          newX >= current.x && newX <= current.x + current.width && newY <= GROUND_LEVEL + 20
        );
        
        if (currentWater) {
          // Ser arrastrado por la corriente
          if (currentWater.direction === 'right') {
            newX += currentWater.strength;
          } else {
            newX -= currentWater.strength;
          }
          showTemporaryMessage("¡Corriente de agua! Te está arrastrando...");
        }
        
        // Límites horizontales
        newX = Math.max(10, Math.min(WORLD_WIDTH - 10, newX));
        
        // Aplicar gravedad (menos intensa en el pantano)
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
  }, [gameStarted, playerVelocity, GROUND_LEVEL, isJumping, lilypads, waterCurrents]);

  // Controles del jugador
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      
      switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPlayerVelocity(prev => ({ ...prev, x: -MOVEMENT_SPEED }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerVelocity(prev => ({ ...prev, x: MOVEMENT_SPEED }));
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          if (!isJumping && (playerPosition.y <= GROUND_LEVEL || isOnLilypad)) {
            setPlayerVelocity(prev => ({ ...prev, y: JUMP_POWER }));
            setIsJumping(true);
          }
          break;
        case 'e':
        case 'E':
          // Interactuar con elementos cercanos
          interactWithNearby();
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
  }, [gameStarted, isJumping, playerPosition.y, isOnLilypad]);

  // Función de interacción
  const interactWithNearby = () => {
    const playerRect = {
      x: playerPosition.x - 15,
      y: playerPosition.y - 20,
      width: 30,
      height: 30
    };

    // Recolectar campos de datos
    setDataFields(prev => prev.map(field => {
      const fieldRect = {
        x: field.x - 15,
        y: field.y - 15,
        width: 30,
        height: 30
      };

      if (isColliding(playerRect, fieldRect) && !field.collected) {
        collectDataField(field);
        return { ...field, collected: true };
      }
      return field;
    }));

    // Recolectar llaves primarias
    setPrimaryKeys(prev => prev.map(key => {
      const keyRect = {
        x: key.x - 15,
        y: key.y - 15,
        width: 30,
        height: 30
      };

      if (isColliding(playerRect, keyRect) && !key.collected) {
        collectPrimaryKey(key);
        return { ...key, collected: true };
      }
      return key;
    }));

    // Recolectar índices
    setIndexes(prev => prev.map(index => {
      const indexRect = {
        x: index.x - 15,
        y: index.y - 15,
        width: 30,
        height: 30
      };

      if (isColliding(playerRect, indexRect) && !index.collected) {
        collectIndex(index);
        return { ...index, collected: true };
      }
      return index;
    }));
  };

  // Función de colisión
  const isColliding = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Recolectar campo de datos
  const collectDataField = (field) => {
    setBackpack(prev => [...prev, { type: 'field', data: field }]);
    setCollectedFields(prev => prev + 1);
    updateScore(100);
    showTemporaryMessage(`¡Campo de datos recolectado! (${field.type})`);
    updateLevel3State({ fieldsCollected: collectedFields + 1, backpackItems: backpack.length + 1 });
  };

  // Recolectar llave primaria
  const collectPrimaryKey = (key) => {
    setBackpack(prev => [...prev, { type: 'key', data: key }]);
    setCollectedKeys(prev => prev + 1);
    updateScore(150);
    showTemporaryMessage("¡Llave primaria recolectada! Desbloquea caminos.");
    updateLevel3State({ keysCollected: collectedKeys + 1, backpackItems: backpack.length + 1 });
  };

  // Recolectar índice
  const collectIndex = (index) => {
    setBackpack(prev => [...prev, { type: 'index', data: index }]);
    setCollectedIndexes(prev => prev + 1);
    updateScore(120);
    showTemporaryMessage("¡Índice recolectado! Movimiento más rápido entre nenúfares.");
    updateLevel3State({ indexesCollected: collectedIndexes + 1, backpackItems: backpack.length + 1 });
  };

  // Activar base de datos
  const activateDatabase = () => {
    if (collectedFields >= 3 && collectedKeys >= 2 && collectedIndexes >= 2 && !databaseComplete) {
      setDatabaseComplete(true);
      updateLevel3State({ databaseComplete: true });
      showTemporaryMessage("¡Base de datos organizada! Los datos fluyen con orden...");
      
      setTimeout(() => {
        setLizardRescued(true);
        showTemporaryMessage("¡La Iguana Guardiana está libre! La información ahora es accesible.");
        
        setTimeout(() => {
          updateLevel3State({ lizardRescued: true });
          showScreen('level-summary-screen');
        }, 3000);
      }, 2000);
    } else {
      showTemporaryMessage(`Necesitas más elementos: ${collectedFields}/3 campos, ${collectedKeys}/2 llaves, ${collectedIndexes}/2 índices`);
    }
  };

  if (!gameStarted) {
    return <div>Cargando pantano...</div>;
  }

  return (
    <div className="level-container" style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 30%, #1e3c72 70%, #0f4c75 100%)',
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
              💧 Pantano de Datos
            </h2>
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.7rem', lineHeight: 1.6 }}>
              Los datos sin orden son como un pantano interminable: confusos, lentos y difíciles de navegar. 
              Solo organizándolos podrás encontrar la salida y rescatar a la Iguana.
            </p>
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '0.6rem', marginTop: '1rem', color: '#90EE90' }}>
              Controles: ← → para mover (más lento), ESPACIO para saltar, E para recolectar
            </p>
            <button 
              onClick={() => setShowIntro(false)} 
              className="btn-primary" 
              style={{ marginTop: '1.2rem' }}
            >
              Entrar al Pantano
            </button>
          </div>
        </div>
      )}

      {/* Pantano principal */}
      {!showIntro && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Agua del pantano */}
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            right: 0, 
            bottom: 0, 
            height: '60px', 
            background: 'linear-gradient(90deg, #4682B4, #5F9EA0, #4682B4)',
            borderTop: '2px solid #87CEEB',
            animation: 'waterRipple 3s ease-in-out infinite'
          }} />

          {/* Burbujas de datos flotantes */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'absolute', 
                left: `${50 + i * 80}px`, 
                bottom: `${20 + (i % 3) * 15}px`, 
                fontSize: '0.8rem', 
                color: 'rgba(255,255,255,0.7)',
                animation: `bubbleFloat ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              {['📊', '📈', '📋', '🗂️'][i % 4]}
            </div>
          ))}

          {/* Troncos como puentes */}
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'absolute', 
                left: `${150 + i * 200}px`, 
                bottom: '60px', 
                width: '80px', 
                height: '20px', 
                background: 'linear-gradient(90deg, #8B4513, #A0522D)', 
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }} 
            />
          ))}

          {/* Corrientes de agua */}
          {waterCurrents.map(current => (
            <div 
              key={current.id} 
              style={{ 
                position: 'absolute', 
                left: `${current.x}px`, 
                bottom: '60px', 
                width: `${current.width}px`, 
                height: '20px', 
                background: 'linear-gradient(90deg, rgba(70,130,180,0.3), rgba(135,206,235,0.3))',
                borderRadius: '0 0 10px 10px',
                animation: `waterFlow${current.direction} 2s ease-in-out infinite`
              }} 
            />
          ))}

          {/* Plantas corruptas */}
          {corruptedPlants.filter(plant => !plant.defeated).map(plant => (
            <div 
              key={plant.id} 
              style={{ 
                position: 'absolute', 
                left: `${plant.x}px`, 
                bottom: `${plant.y}px`, 
                fontSize: '1.5rem',
                animation: 'corruptedGlow 2s ease-in-out infinite',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCorruptedPlants(prev => prev.map(p => 
                  p.id === plant.id ? { ...p, defeated: true } : p
                ));
                showTemporaryMessage("¡Planta corrupta eliminada! El camino está más claro.");
                updateScore(80);
              }}
              title="Planta corrupta - Haz clic para eliminar"
            >
              🌿
            </div>
          ))}

          {/* Nenúfares flotantes */}
          {lilypads.map(lilypad => (
            <div 
              key={lilypad.id} 
              style={{ 
                position: 'absolute', 
                left: `${lilypad.x}px`, 
                bottom: `${lilypad.y + Math.sin(Date.now() * 0.001 + lilypad.id) * 5}px`, 
                width: lilypad.size === 'small' ? '40px' : lilypad.size === 'medium' ? '60px' : '80px',
                height: lilypad.size === 'small' ? '30px' : lilypad.size === 'medium' ? '45px' : '60px',
                background: 'linear-gradient(45deg, #90EE90, #98FB98)', 
                borderRadius: '50%',
                border: '2px solid #228B22',
                cursor: 'pointer',
                animation: 'lilypadFloat 3s ease-in-out infinite',
                animationDelay: `${lilypad.id * 0.5}s`
              }} 
              title="Nenúfar - Salta sobre él"
            />
          ))}

          {/* Campos de datos */}
          {dataFields.filter(field => !field.collected).map(field => (
            <div 
              key={field.id} 
              style={{ 
                position: 'absolute', 
                left: `${field.x}px`, 
                bottom: `${field.y}px`, 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(70,130,180,0.8)',
                animation: 'dataGlow 1.5s ease-in-out infinite'
              }}
              onClick={() => collectDataField(field)}
              title={`Campo de datos (${field.type}) - Presiona E para recolectar`}
            >
              {field.type === 'table' ? '📊' : field.type === 'row' ? '📋' : '📈'}
            </div>
          ))}

          {/* Llaves primarias */}
          {primaryKeys.filter(key => !key.collected).map(key => (
            <div 
              key={key.id} 
              style={{ 
                position: 'absolute', 
                left: `${key.x}px`, 
                bottom: `${key.y}px`, 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(255,215,0,0.8)',
                animation: 'keyGlow 1.5s ease-in-out infinite'
              }}
              onClick={() => collectPrimaryKey(key)}
              title="Llave primaria - Presiona E para recolectar"
            >
              🔑
            </div>
          ))}

          {/* Índices */}
          {indexes.filter(index => !index.collected).map(index => (
            <div 
              key={index.id} 
              style={{ 
                position: 'absolute', 
                left: `${index.x}px`, 
                bottom: `${index.y}px`, 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(138,43,226,0.8)',
                animation: 'indexGlow 1.5s ease-in-out infinite'
              }}
              onClick={() => collectIndex(index)}
              title="Índice - Presiona E para recolectar"
            >
              📚
            </div>
          ))}

          {/* Base de datos central */}
          <div 
            onClick={activateDatabase}
            style={{ 
              position: 'absolute', 
              left: `${DATABASE_X}px`, 
              bottom: `${DATABASE_Y}px`, 
              width: '100px', 
              height: '80px', 
              background: databaseComplete ? 
                'linear-gradient(45deg, #00CED1, #20B2AA)' : 
                'linear-gradient(45deg, #708090, #778899)', 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '2rem', 
              cursor: 'pointer',
              boxShadow: databaseComplete ? 
                '0 0 25px rgba(0,206,209,0.8)' : 
                '0 0 15px rgba(0,0,0,0.3)',
              border: databaseComplete ? '3px solid #00CED1' : '3px solid #708090'
            }}
            title="Base de datos - Organiza los datos recolectados"
          >
            {databaseComplete ? '💎' : '🗄️'}
          </div>

          {/* Iguana Guardiana */}
          <div 
            style={{ 
              position: 'absolute', 
              left: `${DATABASE_X + 120}px`, 
              bottom: `${DATABASE_Y + 20}px`, 
              fontSize: '2.5rem',
              opacity: lizardRescued ? 1 : 0.3,
              animation: lizardRescued ? 'lizardRescue 2s ease-out' : 'none',
              textShadow: lizardRescued ? '0 0 25px rgba(0,206,209,0.8)' : 'none'
            }}
          >
            🦎
          </div>

          {/* Jugador (Andy con mochila) */}
          <div style={{ 
            position: 'absolute', 
            left: `${playerPosition.x}px`, 
            bottom: `${playerPosition.y}px`, 
            fontSize: '1.6rem',
            transition: 'transform 120ms',
            textShadow: '0 0 15px rgba(255,193,7,0.8)'
          }}>
            {isOnLilypad ? '🐿️🦘' : '🐿️🎒'}
          </div>
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
        <div>Campos: {collectedFields}/3</div>
        <div>Llaves: {collectedKeys}/2</div>
        <div>Índices: {collectedIndexes}/2</div>
        <div>Mochila: {backpack.length}/10</div>
      </div>

      {/* Botón de desarrollo - Pasar a siguiente nivel */}
      <button 
        onClick={() => {
          console.log('🚀 Modo desarrollo: Pasando al siguiente nivel');
          updateLevel3State({ lizardRescued: true });
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
          color: '#90EE90', 
          padding: '1rem 2rem', 
          borderRadius: '10px', 
          fontFamily: 'Press Start 2P, monospace', 
          fontSize: '0.6rem', 
          zIndex: 15, 
          textAlign: 'center', 
          border: '2px solid #90EE90' 
        }}>
          {currentMessage}
        </div>
      )}
    </div>
  );
};

export default Level3Swamp;
