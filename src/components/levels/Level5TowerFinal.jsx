import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Level5TowerFinal = () => {
  const { state, updateScore, showScreen } = useGame();
  
  // Estado local del nivel final
  const [gameStarted, setGameStarted] = useState(false);
  const [battlePhase, setBattlePhase] = useState('intro'); // 'intro', 'phase1', 'phase2', 'phase3', 'victory'
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 100 });
  const [villainPosition, setVillainPosition] = useState({ x: 800, y: 300 });
  const [andyPosition, setAndyPosition] = useState({ x: 850, y: 400 });
  const [playerHealth, setPlayerHealth] = useState(100);
  const [villainHealth, setVillainHealth] = useState(300);
  const [message, setMessage] = useState('');
  const [isAttacking, setIsAttacking] = useState(false);
  const [villainAttacking, setVillainAttacking] = useState(false);
  const [showDialogue, setShowDialogue] = useState(true);
  const [dialogueStep, setDialogueStep] = useState(0);
  
  // Ataques y habilidades
  const [playerAttacks, setPlayerAttacks] = useState({
    basic: { damage: 15, cooldown: 0, maxCooldown: 1000 },
    special: { damage: 30, cooldown: 0, maxCooldown: 3000 },
    ultimate: { damage: 50, cooldown: 0, maxCooldown: 5000 }
  });
  
  // Proyectiles
  const [projectiles, setProjectiles] = useState([]);
  const [villainProjectiles, setVillainProjectiles] = useState([]);
  
  // Diálogos de la historia
  const dialogues = [
    {
      speaker: "Villano",
      text: "¡Ja! Has llegado hasta aquí, pequeña ardilla. Pero no podrás detenerme.",
      emoji: "👹"
    },
    {
      speaker: "Andy",
      text: "¡Amigo! ¡Has venido a rescatarme! Cuidado, el villano controla toda la tecnología de ICESI.",
      emoji: "🐿️"
    },
    {
      speaker: "Villano", 
      text: "He corrompido todos los sistemas. ¡Las redes, las bases de datos, el software... TODO ES MÍO!",
      emoji: "👹"
    },
    {
      speaker: "Jugador",
      text: "No mientras yo esté aquí. He aprendido sobre redes, sistemas, datos y software. ¡Es hora de usarlo!",
      emoji: "🐿️"
    }
  ];
  
  // Constantes del juego
  const PLAYER_SPEED = 4;
  const PROJECTILE_SPEED = 6;
  const TOWER_WIDTH = 1000;
  const TOWER_HEIGHT = 500;
  
  // Inicializar el juego
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Mostrar mensaje temporal
  const showTemporaryMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  }, []);
  
  // Manejar diálogo
  const nextDialogue = () => {
    if (dialogueStep < dialogues.length - 1) {
      setDialogueStep(dialogueStep + 1);
    } else {
      setShowDialogue(false);
      setBattlePhase('phase1');
      showTemporaryMessage("¡LA BATALLA COMIENZA!");
    }
  };
  
  // Controles del teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || showDialogue || battlePhase === 'victory') return;
      
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
            x: Math.min(TOWER_WIDTH - 50, prev.x + PLAYER_SPEED)
          }));
          break;
        case 'w':
        case 'arrowup':
          setPlayerPosition(prev => ({
            ...prev,
            y: Math.max(50, prev.y - PLAYER_SPEED)
          }));
          break;
        case 's':
        case 'arrowdown':
          setPlayerPosition(prev => ({
            ...prev,
            y: Math.min(TOWER_HEIGHT - 50, prev.y + PLAYER_SPEED)
          }));
          break;
        case ' ':
          basicAttack();
          break;
        case 'q':
          specialAttack();
          break;
        case 'e':
          ultimateAttack();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, showDialogue, battlePhase, playerAttacks]);
  
  // Ataques del jugador
  const basicAttack = () => {
    if (playerAttacks.basic.cooldown > 0) return;
    
    setIsAttacking(true);
    setProjectiles(prev => [...prev, {
      id: Date.now(),
      x: playerPosition.x + 30,
      y: playerPosition.y + 15,
      damage: playerAttacks.basic.damage,
      type: 'basic'
    }]);
    
    setPlayerAttacks(prev => ({
      ...prev,
      basic: { ...prev.basic, cooldown: prev.basic.maxCooldown }
    }));
    
    setTimeout(() => setIsAttacking(false), 200);
  };
  
  const specialAttack = () => {
    if (playerAttacks.special.cooldown > 0) return;
    
    setIsAttacking(true);
    setProjectiles(prev => [...prev, {
      id: Date.now(),
      x: playerPosition.x + 30,
      y: playerPosition.y + 15,
      damage: playerAttacks.special.damage,
      type: 'special'
    }]);
    
    setPlayerAttacks(prev => ({
      ...prev,
      special: { ...prev.special, cooldown: prev.special.maxCooldown }
    }));
    
    showTemporaryMessage("¡Ataque de Ingeniería de Sistemas!");
    setTimeout(() => setIsAttacking(false), 300);
  };
  
  const ultimateAttack = () => {
    if (playerAttacks.ultimate.cooldown > 0) return;
    
    setIsAttacking(true);
    // Crear múltiples proyectiles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        setProjectiles(prev => [...prev, {
          id: Date.now() + i,
          x: playerPosition.x + 30,
          y: playerPosition.y + 15 + (i * 10),
          damage: playerAttacks.ultimate.damage,
          type: 'ultimate'
        }]);
      }, i * 100);
    }
    
    setPlayerAttacks(prev => ({
      ...prev,
      ultimate: { ...prev.ultimate, cooldown: prev.ultimate.maxCooldown }
    }));
    
    showTemporaryMessage("¡PODER MÁXIMO DE ICESI!");
    setTimeout(() => setIsAttacking(false), 500);
  };
  
  // Actualizar cooldowns
  useEffect(() => {
    const cooldownTimer = setInterval(() => {
      setPlayerAttacks(prev => ({
        basic: { ...prev.basic, cooldown: Math.max(0, prev.basic.cooldown - 100) },
        special: { ...prev.special, cooldown: Math.max(0, prev.special.cooldown - 100) },
        ultimate: { ...prev.ultimate, cooldown: Math.max(0, prev.ultimate.cooldown - 100) }
      }));
    }, 100);
    
    return () => clearInterval(cooldownTimer);
  }, []);
  
  // Movimiento de proyectiles
  useEffect(() => {
    if (!gameStarted || showDialogue) return;
    
    const projectileTimer = setInterval(() => {
      // Proyectiles del jugador
      setProjectiles(prev => prev.map(proj => ({
        ...proj,
        x: proj.x + PROJECTILE_SPEED
      })).filter(proj => proj.x < TOWER_WIDTH));
      
      // Proyectiles del villano
      setVillainProjectiles(prev => prev.map(proj => ({
        ...proj,
        x: proj.x - PROJECTILE_SPEED
      })).filter(proj => proj.x > 0));
    }, 50);
    
    return () => clearInterval(projectileTimer);
  }, [gameStarted, showDialogue]);
  
  // IA del villano
  useEffect(() => {
    if (!gameStarted || showDialogue || battlePhase === 'victory') return;
    
    const villainAI = setInterval(() => {
      // Movimiento del villano
      setVillainPosition(prev => {
        const targetY = playerPosition.y;
        const diff = targetY - prev.y;
        const moveSpeed = 2;
        
        return {
          ...prev,
          y: prev.y + Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed)
        };
      });
      
      // Ataques del villano
      if (Math.random() < 0.3) {
        setVillainAttacking(true);
        setVillainProjectiles(prev => [...prev, {
          id: Date.now(),
          x: villainPosition.x - 30,
          y: villainPosition.y + 15,
          damage: 20
        }]);
        
        setTimeout(() => setVillainAttacking(false), 300);
      }
    }, 1000);
    
    return () => clearInterval(villainAI);
  }, [gameStarted, showDialogue, battlePhase, playerPosition.y, villainPosition.x, villainPosition.y]);
  
  // Detección de colisiones
  useEffect(() => {
    // Proyectiles del jugador vs villano
    setProjectiles(prev => {
      const remaining = [];
      let damage = 0;
      
      prev.forEach(proj => {
        if (proj.x >= villainPosition.x - 30 && proj.x <= villainPosition.x + 30 &&
            proj.y >= villainPosition.y - 30 && proj.y <= villainPosition.y + 30) {
          damage += proj.damage;
        } else {
          remaining.push(proj);
        }
      });
      
      if (damage > 0) {
        setVillainHealth(prevHealth => {
          const newHealth = Math.max(0, prevHealth - damage);
          if (newHealth <= 0) {
            setBattlePhase('victory');
            showTemporaryMessage("¡VICTORIA! ¡Has derrotado al villano!");
            updateScore(1000);
          }
          return newHealth;
        });
      }
      
      return remaining;
    });
    
    // Proyectiles del villano vs jugador
    setVillainProjectiles(prev => {
      const remaining = [];
      let damage = 0;
      
      prev.forEach(proj => {
        if (proj.x >= playerPosition.x - 20 && proj.x <= playerPosition.x + 20 &&
            proj.y >= playerPosition.y - 20 && proj.y <= playerPosition.y + 20) {
          damage += proj.damage;
        } else {
          remaining.push(proj);
        }
      });
      
      if (damage > 0) {
        setPlayerHealth(prevHealth => {
          const newHealth = Math.max(0, prevHealth - damage);
          if (newHealth <= 0) {
            showTemporaryMessage("¡Has sido derrotado! Inténtalo de nuevo.");
            // Reiniciar batalla
            setTimeout(() => {
              setPlayerHealth(100);
              setVillainHealth(300);
              setBattlePhase('phase1');
            }, 2000);
          }
          return newHealth;
        });
      }
      
      return remaining;
    });
  }, [projectiles, villainProjectiles, villainPosition, playerPosition, updateScore]);
  
  // Victoria - rescatar a Andy
  useEffect(() => {
    if (battlePhase === 'victory') {
      setTimeout(() => {
        showTemporaryMessage("¡Andy está libre! ¡Has salvado ICESI!");
        setTimeout(() => {
          showScreen('final-results-screen');
        }, 3000);
      }, 2000);
    }
  }, [battlePhase, showScreen]);
  
  if (!gameStarted) {
    return <div>Cargando Torre Final...</div>;
  }
  
  return (
    <div className="level-container" style={{ 
      background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      position: 'relative',
      width: '1000px',
      height: '500px',
      overflow: 'hidden',
      border: '3px solid #FFD700'
    }}>
      
      {/* Fondo de la torre */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(45deg, transparent 49%, rgba(255,215,0,0.1) 50%, transparent 51%)',
        backgroundSize: '20px 20px',
        animation: 'grid-move 2s linear infinite'
      }} />
      
      {/* Diálogo de introducción */}
      {showDialogue && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.9)',
          border: '3px solid #FFD700',
          borderRadius: '15px',
          padding: '20px',
          maxWidth: '600px',
          zIndex: 100,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '10px'
          }}>
            {dialogues[dialogueStep].emoji}
          </div>
          <div style={{
            fontFamily: 'Press Start 2P, monospace',
            fontSize: '0.8rem',
            color: '#FFD700',
            marginBottom: '10px'
          }}>
            {dialogues[dialogueStep].speaker}
          </div>
          <div style={{
            fontFamily: 'Press Start 2P, monospace',
            fontSize: '0.6rem',
            color: 'white',
            lineHeight: 1.5,
            marginBottom: '20px'
          }}>
            {dialogues[dialogueStep].text}
          </div>
          <button
            onClick={nextDialogue}
            style={{
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '0.6rem',
              padding: '10px 20px',
              background: '#FFD700',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {dialogueStep < dialogues.length - 1 ? 'Siguiente' : '¡A LA BATALLA!'}
          </button>
        </div>
      )}
      
      {/* Jugador */}
      <div style={{
        position: 'absolute',
        left: `${playerPosition.x}px`,
        top: `${playerPosition.y}px`,
        fontSize: '2rem',
        transform: isAttacking ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.1s',
        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
        zIndex: 10
      }}>
        🐿️
      </div>
      
      {/* Villano */}
      <div style={{
        position: 'absolute',
        left: `${villainPosition.x}px`,
        top: `${villainPosition.y}px`,
        fontSize: '3rem',
        transform: villainAttacking ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.1s',
        filter: 'drop-shadow(0 0 15px rgba(255,0,0,0.8))',
        zIndex: 10
      }}>
        👹
      </div>
      
      {/* Andy atrapado */}
      {battlePhase !== 'victory' && (
        <div style={{
          position: 'absolute',
          left: `${andyPosition.x}px`,
          top: `${andyPosition.y}px`,
          fontSize: '1.5rem',
          animation: 'trapped-shake 1s infinite',
          filter: 'grayscale(0.8)',
          zIndex: 5
        }}>
          🐿️
        </div>
      )}
      
      {/* Andy liberado */}
      {battlePhase === 'victory' && (
        <div style={{
          position: 'absolute',
          left: `${andyPosition.x}px`,
          top: `${andyPosition.y}px`,
          fontSize: '2rem',
          animation: 'bounce 1s infinite',
          filter: 'brightness(1.5)',
          zIndex: 15
        }}>
          🐿️✨
        </div>
      )}
      
      {/* Proyectiles del jugador */}
      {projectiles.map(proj => (
        <div key={proj.id} style={{
          position: 'absolute',
          left: `${proj.x}px`,
          top: `${proj.y}px`,
          fontSize: proj.type === 'ultimate' ? '1.2rem' : '0.8rem',
          color: proj.type === 'ultimate' ? '#FFD700' : proj.type === 'special' ? '#00FFFF' : '#FFFFFF',
          zIndex: 8
        }}>
          {proj.type === 'ultimate' ? '⚡' : proj.type === 'special' ? '💻' : '•'}
        </div>
      ))}
      
      {/* Proyectiles del villano */}
      {villainProjectiles.map(proj => (
        <div key={proj.id} style={{
          position: 'absolute',
          left: `${proj.x}px`,
          top: `${proj.y}px`,
          fontSize: '1rem',
          color: '#FF0000',
          zIndex: 8
        }}>
          🔥
        </div>
      ))}
      
      {/* HUD */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '10px',
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '0.6rem',
        color: 'white',
        zIndex: 20
      }}>
        <div style={{ color: '#00FF00', marginBottom: '5px' }}>
          Jugador: {playerHealth}/100 HP
        </div>
        <div style={{ color: '#FF0000', marginBottom: '10px' }}>
          Villano: {villainHealth}/300 HP
        </div>
        <div style={{ fontSize: '0.5rem', color: '#FFD700' }}>
          <div>Básico: {playerAttacks.basic.cooldown > 0 ? `${(playerAttacks.basic.cooldown/1000).toFixed(1)}s` : 'LISTO'}</div>
          <div>Especial (Q): {playerAttacks.special.cooldown > 0 ? `${(playerAttacks.special.cooldown/1000).toFixed(1)}s` : 'LISTO'}</div>
          <div>Definitivo (E): {playerAttacks.ultimate.cooldown > 0 ? `${(playerAttacks.ultimate.cooldown/1000).toFixed(1)}s` : 'LISTO'}</div>
        </div>
      </div>
      
      {/* Controles */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '0.5rem',
        color: 'white',
        zIndex: 20
      }}>
        WASD: Mover | Espacio: Ataque | Q: Especial | E: Definitivo
      </div>
      
      {/* Mensajes */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,215,0,0.9)',
          color: '#000',
          padding: '15px',
          borderRadius: '10px',
          fontFamily: 'Press Start 2P, monospace',
          fontSize: '0.8rem',
          textAlign: 'center',
          zIndex: 50,
          border: '2px solid #FFA500'
        }}>
          {message}
        </div>
      )}
      
      <style jsx>{`
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
      `}</style>
    </div>
  );
};

export default Level5TowerFinal;
