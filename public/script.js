// Andy's Close Friends Rescue - Juego Principal
class AndysGame {
    constructor() {
        this.currentScreen = 'loading-screen';
        this.gameState = {
            currentLevel: 1,
            totalScore: 0,
            friendsRescued: 0,
            lives: 3,
            musicEnabled: true,
            sfxEnabled: true,
            levelScores: {},
            tutorialCompleted: false,
            totalStars: 0,
            totalMedals: 0,
            totalPoints: 0,
            completedLevels: [],
            levelData: {
                1: { friend: 'pigeon', friendName: 'Paloma', concept: 'Jardín de Redes - Redes y Comunicaciones' },
                2: { friend: 'bat', friendName: 'Murciélago', concept: 'Cueva de Sistemas - Arquitectura de Sistemas' },
                3: { friend: 'lizard', friendName: 'Iguana', concept: 'Pantano de Datos - Bases de Datos' },
                4: { friend: 'possum', friendName: 'Zarigüeya', concept: 'Pico de Software - Desarrollo de Software' },
                5: { friend: 'andy', friendName: 'Andy', concept: 'Cima de la Torre - Proyecto Final' }
            },
            // Estado específico del Nivel 1
            level1State: {
                introCompleted: false,
                routersFixed: 0,
                dataPacketsCollected: 0,
                bridgeUnlocked: false,
                pigeonRescued: false,
                currentPuzzle: null,
                movementHintsShown: false,
                tutorialCompleted: false
            }
        };
        
        this.loadingTips = [
            'Compilando shaders...',
            'Desplegando servidores...',
            'Cargando algoritmos...',
            'Inicializando base de datos...',
            'Conectando a la nube...',
            'Optimizando rendimiento...',
            'Sincronizando nodos...',
            'Verificando seguridad...'
        ];
        
        this.knowledgeCapsules = {
            1: '¡Excelente! Has rescatado a la Paloma usando tus habilidades de ingeniería. En Icesi, los estudiantes aprenden a resolver problemas complejos paso a paso, ¡como escalar una torre de ladrillos!',
            2: '¡Increíble! El Murciélago está libre gracias a tu destreza. Los ingenieros de sistemas de Icesi desarrollan la misma precisión y lógica que usaste para superar este nivel.',
            3: '¡Fantástico! Has salvado a la Iguana con ingenio y creatividad. En Icesi, los estudiantes aprenden a pensar fuera de la caja para encontrar soluciones innovadoras.',
            4: '¡Maravilloso! La Zarigüeya está a salvo gracias a tu perseverancia. Los ingenieros de sistemas de Icesi desarrollan esa misma determinación para resolver problemas complejos.',
            5: '¡FELICITACIONES! Has rescatado a Andy y demostrado todas las habilidades de un ingeniero de sistemas de Icesi: lógica, creatividad, resolución de problemas y pasión por la tecnología.'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.addRewardAnimationCSS();
        this.startLoading();
    }
    
    setupEventListeners() {
        // Botones principales
        document.getElementById('play-btn')?.addEventListener('click', () => this.showScreen('intro-screen'));
        document.getElementById('instructions-btn')?.addEventListener('click', () => this.showScreen('instructions-screen'));
        document.getElementById('instructions-back-btn')?.addEventListener('click', () => this.showScreen('home-screen'));
        document.getElementById('back-btn')?.addEventListener('click', () => this.showScreen('home-screen'));
        
        // Opciones
        document.getElementById('music-toggle')?.addEventListener('change', (e) => {
            this.gameState.musicEnabled = e.target.checked;
            this.toggleMusic();
        });
        
        document.getElementById('sfx-toggle')?.addEventListener('change', (e) => {
            this.gameState.sfxEnabled = e.target.checked;
        });
        
        // Cinemática
        document.getElementById('next-frame-btn')?.addEventListener('click', () => this.nextStoryFrame());
        document.getElementById('start-adventure-btn')?.addEventListener('click', () => this.showScreen('world-map-screen'));
        
        // Mapa del mundo
        document.querySelectorAll('.level-station').forEach(station => {
            station.addEventListener('click', () => this.selectLevel(station));
        });
        
        // Tutorial
        document.getElementById('tutorial-prev')?.addEventListener('click', () => this.previousTutorialStep());
        document.getElementById('tutorial-next')?.addEventListener('click', () => this.nextTutorialStep());
        document.getElementById('tutorial-finish')?.addEventListener('click', () => this.finishTutorial());
        
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', (e) => this.goToTutorialStep(parseInt(e.target.dataset.step)));
        });
        
        // Niveles
        document.getElementById('continue-btn')?.addEventListener('click', () => this.returnToWorldMap());
        
        // Final
        document.getElementById('share-btn')?.addEventListener('click', () => this.shareAchievement());
        document.getElementById('play-again-btn')?.addEventListener('click', () => this.restartGame());
        document.getElementById('credits-btn')?.addEventListener('click', () => this.showScreen('credits-screen'));
        document.getElementById('credits-back-btn')?.addEventListener('click', () => this.showScreen('final-results-screen'));
        
        // Controles del juego
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Controles táctiles para móviles
        this.setupTouchControls();
    }
    
    startLoading() {
        const loadingProgress = document.querySelector('.loading-progress');
        const loadingTip = document.getElementById('loading-tip');
        let progress = 0;
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => this.showScreen('home-screen'), 500);
            }
            
            loadingProgress.style.width = progress + '%';
            
            // Cambiar consejo aleatorio
            if (Math.random() < 0.3) {
                const randomTip = this.loadingTips[Math.floor(Math.random() * this.loadingTips.length)];
                loadingTip.textContent = randomTip;
            }
        }, 100);
    }
    
    showScreen(screenId) {
        // Detener progresión automática del storytelling si está activa
        this.stopAutoStoryProgression();
        
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar pantalla seleccionada
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
        
        // Inicializar pantalla específica
        this.initializeScreen(screenId);
    }
    
    initializeScreen(screenId) {
        switch(screenId) {
            case 'home-screen':
                this.playBackgroundMusic();
                break;
            case 'intro-screen':
                this.startIntroSequence();
                break;
            case 'world-map-screen':
                this.initializeWorldMap();
                break;
            case 'level-screen':
                this.startLevel();
                break;
            case 'final-boss-screen':
                this.startFinalBoss();
                break;
        }
    }
    
    startIntroSequence() {
        this.currentFrame = 1;
        const frames = document.querySelectorAll('.story-frame');
        const nextFrameBtn = document.getElementById('next-frame-btn');
        
        // Ocultar botón de siguiente (ya no es necesario)
        if (nextFrameBtn) {
            nextFrameBtn.style.display = 'none';
        }
        
        // Inicializar frames
        frames.forEach((frame, index) => {
            frame.classList.remove('active');
            if (index === 0) frame.classList.add('active');
        });
        
        // Actualizar barra de progreso
        this.updateStoryProgress();
        
        // Cambiar música a tensa para el storytelling
        this.playStoryMusic();
        
        // Iniciar reproducción automática
        this.startAutoStoryProgression();
    }
    
    nextStoryFrame() {
        const frames = document.querySelectorAll('.story-frame');
        
        if (this.currentFrame < frames.length) {
            // Ocultar frame actual
            frames[this.currentFrame - 1].classList.remove('active');
            
            // Mostrar siguiente frame
            this.currentFrame++;
            frames[this.currentFrame - 1].classList.add('active');
            
            // Actualizar progreso
            this.updateStoryProgress();
            
            // Cambiar música según el frame
            this.updateStoryMusic();
        }
    }
    
    updateStoryProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const frameCounter = document.querySelector('.frame-counter');
        
        const progressPercentage = (this.currentFrame / 5) * 100;
        progressFill.style.width = progressPercentage + '%';
        frameCounter.textContent = `${this.currentFrame} / 5`;
    }
    
    playStoryMusic() {
        // Música inicial alegre
        if (this.gameState.musicEnabled) {
            this.currentMusicTone = 'happy';
        }
    }
    
    updateStoryMusic() {
        if (!this.gameState.musicEnabled) return;
        
        switch(this.currentFrame) {
            case 1:
                // Música alegre y relajada
                this.currentMusicTone = 'happy';
                break;
            case 2:
                // Cambio súbito a música tensa
                this.currentMusicTone = 'tense';
                this.playSound('villain');
                break;
            case 3:
                // Música de captura/urgencia
                this.currentMusicTone = 'urgent';
                this.playSound('capture');
                break;
            case 4:
                // Música de reloj/tiempo
                this.currentMusicTone = 'clock';
                this.playSound('tick');
                break;
            case 5:
                // Música épica de reto
                this.currentMusicTone = 'epic';
                this.playSound('challenge');
                break;
        }
    }
    
    startAutoStoryProgression() {
        // Definir duración de cada frame en milisegundos
        const frameDurations = {
            1: 4000,  // 4 segundos - vida tranquila
            2: 3500,  // 3.5 segundos - aparición del villano
            3: 4500,  // 4.5 segundos - captura (más tiempo para ver la animación)
            4: 3000,  // 3 segundos - urgencia del reloj
            5: 0      // Frame final - se queda hasta que el usuario haga clic
        };
        
        const advanceFrame = () => {
            if (this.currentFrame < 5) {
                // Avanzar al siguiente frame
                this.nextStoryFrame();
                
                // Programar el siguiente avance
                const nextDuration = frameDurations[this.currentFrame];
                if (nextDuration > 0) {
                    this.storyTimer = setTimeout(advanceFrame, nextDuration);
                }
            }
        };
        
        // Iniciar el primer timer
        const firstDuration = frameDurations[this.currentFrame];
        if (firstDuration > 0) {
            this.storyTimer = setTimeout(advanceFrame, firstDuration);
        }
    }
    
    stopAutoStoryProgression() {
        if (this.storyTimer) {
            clearTimeout(this.storyTimer);
            this.storyTimer = null;
        }
    }
    
    initializeWorldMap() {
        const levelStations = document.querySelectorAll('.level-station');
        const andyAvatar = document.getElementById('map-andy');
        const rescuedCount = document.querySelector('.rescued-count');
        
        // Actualizar contador de rescatados y stats
        if (rescuedCount) {
            rescuedCount.textContent = this.gameState.completedLevels.length;
        }
        this.updateGameStats();
        
        // Configurar estaciones según progreso
        levelStations.forEach((station, index) => {
            const level = index + 1;
            const isUnlocked = level <= this.gameState.currentLevel;
            const isCompleted = this.gameState.completedLevels.includes(level);
            
            station.classList.remove('unlocked', 'locked', 'completed');
            
            if (isCompleted) {
                station.classList.add('unlocked', 'completed');
                station.querySelector('.level-status').textContent = '✅';
            } else if (isUnlocked) {
                station.classList.add('unlocked');
                station.querySelector('.level-status').textContent = '🎯';
            } else {
                station.classList.add('locked');
                station.querySelector('.level-status').textContent = '🔒';
            }
        });
        
        // Actualizar caminos según progreso
        this.updateAdventurePaths();
        
        // Mover avatar de Andy al nivel actual
        this.moveAndyAvatar();
        
        // Mostrar tutorial si es la primera vez
        if (!this.gameState.tutorialCompleted) {
            this.showTutorial();
        }
        
        // Resaltar primera misión si no está completada
        this.highlightFirstMission();
    }
    
    updateAdventurePaths() {
        const paths = document.querySelectorAll('.path');
        
        paths.forEach((path, index) => {
            const pathLevel = index + 1;
            const isUnlocked = pathLevel <= this.gameState.currentLevel;
            
            path.classList.remove('unlocked', 'locked');
            path.classList.add(isUnlocked ? 'unlocked' : 'locked');
        });
    }
    
    moveAndyAvatar() {
        const andyAvatar = document.getElementById('map-andy');
        const currentLevel = Math.min(this.gameState.currentLevel, 4);
        const targetStation = document.querySelector(`.station-${currentLevel}`);
        
        if (andyAvatar && targetStation) {
            // Posición fija basada en las estaciones CSS
            const positions = {
                1: { left: '10%', bottom: '20%' },
                2: { left: '28%', bottom: '30%' },
                3: { right: '30%', bottom: '35%' },
                4: { right: '18%', bottom: '50%' }
            };
            
            const pos = positions[currentLevel];
            if (pos) {
                Object.assign(andyAvatar.style, pos);
            }
        }
    }
    
    selectLevel(station) {
        if (station.classList.contains('locked')) return;
        
        const levelNumber = parseInt(station.dataset.level);
        this.gameState.currentLevel = levelNumber;
        
        // Reproducir sonido de selección
        this.playSound('powerup');
        
        if (levelNumber === 5) {
            this.showScreen('final-boss-screen');
        } else {
            this.showScreen('level-screen');
        }
    }
    
    startLevel() {
        const levelData = this.gameState.levelData[this.gameState.currentLevel];
        
        // Actualizar información del nivel
        document.getElementById('level-title').textContent = `Nivel ${this.gameState.currentLevel} - ${levelData.concept}`;
        document.querySelector('.concept-info h3').textContent = levelData.concept;
        
        // Actualizar contador de amigos
        document.getElementById('friends-count').textContent = `${this.gameState.friendsRescued}/5`;
        document.getElementById('lives').textContent = this.gameState.lives;
        
        // Para el Nivel 1, mostrar cinemática de introducción
        if (this.gameState.currentLevel === 1 && !this.gameState.level1State.introCompleted) {
            this.showLevel1Intro();
        } else {
            this.startCountdown();
        }
    }
    
    startCountdown() {
        const countdownElement = document.getElementById('countdown');
        let count = 3;
        
        const countdownInterval = setInterval(() => {
            countdownElement.textContent = count;
            if (count <= 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = 'none';
                this.startGameplay();
            }
            count--;
        }, 1000);
    }
    
    startGameplay() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'block';
        
        // Inicializar juego según el nivel
        switch(this.gameState.currentLevel) {
            case 1:
                this.initLevel1();
                break;
            case 2:
                this.initLevel2();
                break;
            case 3:
                this.initLevel3();
                break;
            case 4:
                this.initLevel4();
                break;
        }
    }
    
    initLevel1() {
        console.log('Inicializando Nivel 1: Jardín de Redes');
        
        try {
            // Nivel 1: Jardín de Redes
            this.initializeGardenEnvironment();
            this.createNetworkEnemies();
            this.createDataPackets();
            this.createNetworkPowerups();
            this.setupGardenInteractions();
            this.startPlayerMovement();
            this.updateGardenState();
            this.setupLevel1EventListeners();
            
            // Mostrar mensaje de bienvenida educativo
            setTimeout(() => {
                this.showEducationalMessage('¡Bienvenido al Jardín de Redes! Aprende sobre protocolos de comunicación mientras rescatas a la Paloma.');
            }, 1000);
            
            console.log('Nivel 1 inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando Nivel 1:', error);
            // Fallback: usar el sistema original
            this.initLevel1Fallback();
        }
    }
    
    initLevel1Fallback() {
        console.log('Usando fallback para Nivel 1');
        
        // Crear un nivel simple que funcione
        this.createSimpleLevel1();
        this.startPlayerMovement();
    }
    
    createSimpleLevel1() {
        console.log('Creando nivel simple del Jardín de Redes');
        
        // Limpiar contenedores existentes
        const enemiesContainer = document.getElementById('enemies');
        const collectiblesContainer = document.getElementById('collectibles');
        const powerupsContainer = document.getElementById('power-ups');
        
        if (enemiesContainer) enemiesContainer.innerHTML = '';
        if (collectiblesContainer) collectiblesContainer.innerHTML = '';
        if (powerupsContainer) powerupsContainer.innerHTML = '';
        
        // Crear elementos básicos del jardín
        this.createSimpleNetworkElements();
        
        // Mostrar mensaje de bienvenida
        this.showEducationalMessage('¡Bienvenido al Jardín de Redes! Usa las flechas o WASD para moverte y ESPACIO para saltar. Recolecta 3 paquetes de datos para rescatar a la Paloma.');
    }
    
    createSimpleNetworkElements() {
        const enemiesContainer = document.getElementById('enemies');
        const collectiblesContainer = document.getElementById('collectibles');
        
        if (!enemiesContainer || !collectiblesContainer) {
            console.error('Contenedores no encontrados');
            return;
        }
        
        // Crear algunos enemigos simples
        for (let i = 0; i < 3; i++) {
            const enemy = document.createElement('div');
            enemy.className = 'enemy';
            enemy.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                background: #ff0000;
                border: 2px solid #8B0000;
                border-radius: 50%;
                left: ${20 + i * 30}%;
                bottom: ${25}%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                z-index: 50;
            `;
            enemy.innerHTML = '❌';
            enemy.title = 'Paquete perdido - ¡Cuidado!';
            
            enemiesContainer.appendChild(enemy);
        }
        
        // Crear algunos paquetes de datos
        for (let i = 0; i < 4; i++) {
            const packet = document.createElement('div');
            packet.className = 'collectible';
            packet.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                background: linear-gradient(45deg, #00ff00, #00ffff);
                border: 2px solid #008080;
                border-radius: 10px;
                left: ${15 + i * 20}%;
                bottom: ${35}%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                z-index: 50;
            `;
            packet.innerHTML = '📦';
            packet.title = 'Paquete de datos';
            
            collectiblesContainer.appendChild(packet);
        }
    }
    
    checkLevel1Progress() {
        // Verificar si se pueden activar los routers
        if (this.gameState.level1State.dataPacketsCollected >= 3 && this.gameState.level1State.routersFixed < 2) {
            this.showEducationalMessage('¡Tienes suficientes paquetes! Ahora puedes reparar los routers apagados.');
        }
        
        // Verificar si se puede acceder a la jaula de la paloma
        if (this.gameState.level1State.dataPacketsCollected >= 3 && this.gameState.level1State.routersFixed >= 2) {
            const cage = document.getElementById('pigeon-cage');
            if (cage) {
                cage.style.cursor = 'pointer';
                cage.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
                this.showEducationalMessage('¡Todos los routers están activos! Puedes intentar rescatar a la Paloma.');
            }
        }
        
        // Verificar progreso general
        const progress = this.gameState.level1State.dataPacketsCollected + this.gameState.level1State.routersFixed;
        if (progress >= 5 && !this.gameState.level1State.pigeonRescued) {
            this.showEducationalMessage('¡Casi lo logras! Solo falta el paso final para rescatar a la Paloma.');
        }
    }
    
    // Funciones específicas del Nivel 1: Jardín de Redes
    showLevel1Intro() {
        const cutscene = document.getElementById('level-intro-cutscene');
        if (cutscene) {
            cutscene.classList.remove('hidden');
            
            // Configurar evento del botón
            const startBtn = document.getElementById('start-level-btn');
            if (startBtn) {
                startBtn.onclick = () => {
                    this.gameState.level1State.introCompleted = true;
                    cutscene.classList.add('hidden');
                    this.startCountdown();
                };
            }
            
            // Reproducir música de introducción
            this.playSound('intro');
        } else {
            console.error('No se encontró el elemento level-intro-cutscene');
            // Si no existe la cinemática, ir directo al countdown
            this.startCountdown();
        }
    }
    
    initializeGardenEnvironment() {
        try {
            // Configurar plataformas de flores
            const flowerPlatforms = document.querySelectorAll('.flower-platform');
            console.log(`Encontradas ${flowerPlatforms.length} plataformas de flores`);
            flowerPlatforms.forEach(platform => {
                platform.addEventListener('click', () => this.onFlowerPlatformClick(platform));
            });
            
            // Configurar routers
            const routers = document.querySelectorAll('.router');
            console.log(`Encontrados ${routers.length} routers`);
            routers.forEach(router => {
                router.addEventListener('click', () => this.onRouterClick(router));
            });
            
            // Configurar puente de datos
            const bridge = document.getElementById('data-bridge');
            if (bridge) {
                this.updateBridgeState();
            } else {
                console.warn('No se encontró el puente de datos');
            }
            
            // Configurar jaula de la paloma
            const cage = document.getElementById('pigeon-cage');
            if (cage) {
                this.updateCageState();
            } else {
                console.warn('No se encontró la jaula de la paloma');
            }
        } catch (error) {
            console.error('Error inicializando el ambiente del jardín:', error);
        }
    }
    
    createNetworkEnemies() {
        const enemiesContainer = document.getElementById('enemies');
        if (!enemiesContainer) {
            console.error('No se encontró el contenedor de enemigos');
            return;
        }
        
        enemiesContainer.innerHTML = '';
        
        // Crear enemigos con forma de paquetes perdidos (insectos con forma de ❌)
        const enemyPositions = [
            { x: 20, y: 30, type: 'error' },
            { x: 60, y: 50, type: 'corrupted' },
            { x: 80, y: 25, type: 'lost' }
        ];
        
        enemyPositions.forEach((pos, index) => {
            const enemy = document.createElement('div');
            enemy.className = 'enemy network-enemy';
            enemy.style.left = `${pos.x}%`;
            enemy.style.bottom = `${pos.y}%`;
            enemy.innerHTML = '❌';
            enemy.title = 'Insecto con forma de paquete perdido - ¡Cuidado!';
            enemy.dataset.type = pos.type;
            
            // Agregar animación de glitch
            enemy.style.animation = 'enemyGlitch 1s ease-in-out infinite';
            enemy.style.animationDelay = `${index * 0.3}s`;
            
            enemy.addEventListener('click', () => this.defeatNetworkEnemy(enemy));
            enemiesContainer.appendChild(enemy);
        });
        
        console.log(`Creados ${enemyPositions.length} enemigos de red (paquetes perdidos)`);
    }
    
    createDataPackets() {
        const collectiblesContainer = document.getElementById('collectibles');
        if (!collectiblesContainer) {
            console.error('No se encontró el contenedor de coleccionables');
            return;
        }
        
        collectiblesContainer.innerHTML = '';
        
        // Crear paquetes de datos brillantes
        const packetPositions = [
            { x: 15, y: 40 },
            { x: 45, y: 60 },
            { x: 75, y: 35 },
            { x: 85, y: 55 }
        ];
        
        packetPositions.forEach((pos, index) => {
            const packet = document.createElement('div');
            packet.className = 'collectible data-packet';
            packet.style.left = `${pos.x}%`;
            packet.style.bottom = `${pos.y}%`;
            packet.innerHTML = '📦';
            packet.title = 'Paquete de datos';
            
            packet.addEventListener('click', () => this.collectDataPacket(packet));
            collectiblesContainer.appendChild(packet);
        });
        
        console.log(`Creados ${packetPositions.length} paquetes de datos`);
    }
    
    createNetworkPowerups() {
        const powerupsContainer = document.getElementById('power-ups');
        if (!powerupsContainer) {
            console.error('No se encontró el contenedor de power-ups');
            return;
        }
        
        powerupsContainer.innerHTML = '';
        
        // Crear power-ups de red
        const powerupPositions = [
            { x: 30, y: 70 },
            { x: 70, y: 45 }
        ];
        
        powerupPositions.forEach((pos, index) => {
            const powerup = document.createElement('div');
            powerup.className = 'powerup network-powerup';
            powerup.style.left = `${pos.x}%`;
            powerup.style.bottom = `${pos.y}%`;
            powerup.innerHTML = '⚡';
            powerup.title = 'Boost de velocidad de red';
            
            powerup.addEventListener('click', () => this.collectNetworkPowerup(powerup));
            powerupsContainer.appendChild(powerup);
        });
        
        console.log(`Creados ${powerupPositions.length} power-ups de red`);
    }
    
    setupGardenInteractions() {
        try {
            // Configurar puzzles
            this.setupCablePuzzle();
            this.setupProtocolPuzzle();
            this.setupPacketSortingPuzzle();
            console.log('Interacciones del jardín configuradas');
        } catch (error) {
            console.error('Error configurando interacciones del jardín:', error);
        }
    }
    
    setupLevel1EventListeners() {
        // Configurar event listeners específicos del Nivel 1
        const startBtn = document.getElementById('start-level-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.gameState.level1State.introCompleted = true;
                document.getElementById('level-intro-cutscene').classList.add('hidden');
                this.startCountdown();
            });
        }
        
        // Configurar mensajes educativos específicos
        this.setupEducationalMessages();
    }
    
    setupEducationalMessages() {
        // Mensajes educativos específicos del Nivel 1
        this.level1Messages = {
            movement: '¡Bien hecho! Las flechas o WASD te permiten mover a Andy por el jardín.',
            jump: '¡Perfecto! ESPACIO hace que Andy salte. Úsalo para alcanzar plataformas altas.',
            enemy: '¡Un error de transmisión! Ten cuidado, estos bichos cortan el flujo de datos.',
            packet: '¡Paquete de datos recolectado! Los paquetes son como mensajes en Internet.',
            router: '¡Un router apagado! Los routers dirigen el tráfico de datos en las redes.',
            bridge: 'Los paquetes son como mensajes en Internet. Recolecta todos para que la red funcione.',
            tcp: '¡Bien hecho! TCP asegura que cada paquete llegue en orden.',
            udp: 'UDP es rápido, pero no garantiza que todo llegue. A veces sirve, ¡pero aquí TCP era mejor!',
            rescue: '¡Has aprendido cómo las redes transmiten mensajes! Gracias a ti, el Jardín vuelve a estar conectado.'
        };
    }
    
    setupCablePuzzle() {
        const connectBtn = document.getElementById('connect-cable-btn');
        const startPoint = document.getElementById('connection-start');
        const endPoint = document.getElementById('connection-end');
        const cablePath = document.getElementById('cable-path');
        
        if (!connectBtn || !startPoint || !endPoint || !cablePath) {
            console.warn('Elementos del puzzle de cable no encontrados');
            return;
        }
        
        let isConnected = false;
        let isDragging = false;
        
        // Configurar drag and drop para conectar cable
        startPoint.addEventListener('mousedown', (e) => {
            if (isConnected) return;
            isDragging = true;
            startPoint.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || isConnected) return;
            
            // Mostrar línea temporal mientras se arrastra
            const rect = cablePath.getBoundingClientRect();
            const startRect = startPoint.getBoundingClientRect();
            const endRect = endPoint.getBoundingClientRect();
            
            // Crear línea visual temporal
            if (!document.querySelector('.temp-cable')) {
                const tempCable = document.createElement('div');
                tempCable.className = 'temp-cable';
                tempCable.style.cssText = `
                    position: fixed;
                    height: 4px;
                    background: #00ff00;
                    z-index: 1001;
                    pointer-events: none;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
                `;
                document.body.appendChild(tempCable);
            }
            
            const tempCable = document.querySelector('.temp-cable');
            const startX = startRect.left + startRect.width / 2;
            const startY = startRect.top + startRect.height / 2;
            const endX = e.clientX;
            const endY = e.clientY;
            
            const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
            
            tempCable.style.left = startX + 'px';
            tempCable.style.top = startY + 'px';
            tempCable.style.width = length + 'px';
            tempCable.style.transform = `rotate(${angle}deg)`;
            tempCable.style.transformOrigin = '0 50%';
        });
        
        endPoint.addEventListener('mouseup', (e) => {
            if (!isDragging || isConnected) return;
            
            isDragging = false;
            startPoint.style.cursor = 'grab';
            
            // Verificar si se conectó correctamente
            const tempCable = document.querySelector('.temp-cable');
            if (tempCable) {
                tempCable.remove();
            }
            
            // Conectar cable
            cablePath.classList.add('connected');
            connectBtn.textContent = 'Cable Conectado ✅';
            connectBtn.disabled = true;
            isConnected = true;
            
            // Mostrar mensaje educativo
            this.showEducationalMessage('Un ingeniero de sistemas sabe cómo conectar los puntos. ¡Restablece el camino de la información!');
            
            // Completar puzzle del router 1
            setTimeout(() => {
                this.completeRouterPuzzle(1);
            }, 2000);
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                startPoint.style.cursor = 'grab';
                const tempCable = document.querySelector('.temp-cable');
                if (tempCable) {
                    tempCable.remove();
                }
            }
        });
        
        // Configurar cursor inicial
        startPoint.style.cursor = 'grab';
        startPoint.title = 'Arrastra para conectar el cable';
    }
    
    setupProtocolPuzzle() {
        const protocolBtns = document.querySelectorAll('.protocol-btn');
        const protocolInfo = document.getElementById('protocol-info');
        const protocolExplanation = document.getElementById('protocol-explanation');
        
        if (protocolBtns.length === 0) {
            console.warn('No se encontraron botones de protocolo');
            return;
        }
        
        // Mostrar información inicial sobre protocolos
        if (protocolInfo) {
            protocolInfo.innerHTML = `
                <h3>🔧 Elige el Protocolo Correcto</h3>
                <p>Los protocolos son como idiomas que usan las computadoras para comunicarse:</p>
                <div class="protocol-options">
                    <div class="protocol-option">
                        <h4>TCP - Tranquilo y Confiable</h4>
                        <p>✅ Garantiza que cada mensaje llegue</p>
                        <p>✅ Ordena los mensajes correctamente</p>
                        <p>⏱️ Un poco más lento pero seguro</p>
                    </div>
                    <div class="protocol-option">
                        <h4>UDP - Rápido y Directo</h4>
                        <p>⚡ Muy rápido</p>
                        <p>❌ No garantiza que llegue todo</p>
                        <p>❌ Los mensajes pueden llegar desordenados</p>
                    </div>
                </div>
            `;
        }
        
        let selectedProtocol = null;
        
        protocolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover selección anterior
                protocolBtns.forEach(b => {
                    b.classList.remove('selected');
                    b.style.opacity = '0.7';
                });
                
                // Seleccionar nuevo protocolo
                btn.classList.add('selected');
                btn.style.opacity = '1';
                selectedProtocol = btn.dataset.protocol;
                
                // Mostrar explicación del protocolo elegido
                if (protocolExplanation) {
                    if (selectedProtocol === 'tcp') {
                        protocolExplanation.innerHTML = `
                            <div class="protocol-result tcp-result">
                                <h3>🎯 ¡Excelente Elección!</h3>
                                <p>TCP es perfecto para rescatar a la Paloma porque:</p>
                                <ul>
                                    <li>✅ Garantiza que cada paquete de datos llegue</li>
                                    <li>✅ Ordena los mensajes correctamente</li>
                                    <li>✅ Detecta y corrige errores automáticamente</li>
                                </ul>
                                <p><strong>¡La Paloma necesita que todos sus mensajes lleguen completos!</strong></p>
                            </div>
                        `;
                    } else {
                        protocolExplanation.innerHTML = `
                            <div class="protocol-result udp-result">
                                <h3>⚠️ UDP es Rápido, Pero...</h3>
                                <p>UDP es bueno para algunas cosas, pero para rescatar a la Paloma:</p>
                                <ul>
                                    <li>❌ Puede perder algunos paquetes de datos</li>
                                    <li>❌ Los mensajes pueden llegar desordenados</li>
                                    <li>❌ No detecta errores automáticamente</li>
                                </ul>
                                <p><strong>¡La Paloma necesita que todos sus mensajes lleguen completos!</strong></p>
                                <p class="hint">💡 <em>TCP habría sido mejor para esta misión</em></p>
                            </div>
                        `;
                    }
                }
                
                // Mostrar mensaje educativo
                const message = selectedProtocol === 'tcp' 
                    ? '¡Perfecto! TCP asegura que cada paquete llegue en orden. ¡Es ideal para rescatar a la Paloma!'
                    : 'UDP es rápido, pero no garantiza que todo llegue. ¡A veces sirve, pero aquí TCP era mejor!';
                
                this.showEducationalMessage(message);
                
                // Completar puzzle después de un breve delay
                setTimeout(() => {
                    this.completeRouterPuzzle(2, selectedProtocol);
                }, 3000);
            });
            
            // Agregar efectos hover
            btn.addEventListener('mouseenter', () => {
                if (!btn.classList.contains('selected')) {
                    btn.style.transform = 'scale(1.05)';
                    btn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                if (!btn.classList.contains('selected')) {
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                }
            });
        });
    }
    
    setupPacketSortingPuzzle() {
        const packets = document.querySelectorAll('.packet.draggable');
        const slots = document.querySelectorAll('.sort-slot');
        const checkBtn = document.getElementById('check-sorting-btn');
        const puzzleInfo = document.getElementById('packet-sorting-info');
        
        if (packets.length === 0 || slots.length === 0 || !checkBtn) {
            console.warn('Elementos del puzzle de ordenamiento no encontrados');
            return;
        }
        
        // Mostrar información inicial sobre el puzzle
        if (puzzleInfo) {
            puzzleInfo.innerHTML = `
                <h3>📦 Ordena los Paquetes de Datos</h3>
                <p>La Paloma necesita enviar un mensaje de rescate, pero los paquetes llegaron desordenados.</p>
                <p><strong>Orden correcto: 1 → 3 → 2 → 4</strong></p>
                <div class="packet-explanation">
                    <p>💡 <em>En las redes, los paquetes a veces llegan desordenados. TCP los reorganiza, pero aquí debes hacerlo tú.</em></p>
                </div>
            `;
        }
        
        let isPuzzleComplete = false;
        
        // Implementar drag and drop mejorado
        packets.forEach(packet => {
            packet.draggable = true;
            
            packet.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', packet.dataset.order);
                packet.classList.add('dragging');
                packet.style.opacity = '0.5';
            });
            
            packet.addEventListener('dragend', () => {
                packet.classList.remove('dragging');
                packet.style.opacity = '1';
            });
        });
        
        slots.forEach((slot, index) => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('valid-drop');
                slot.style.background = 'rgba(0, 255, 0, 0.2)';
                slot.style.border = '2px dashed #00ff00';
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('valid-drop');
                slot.style.background = '';
                slot.style.border = '';
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const packetOrder = e.dataTransfer.getData('text/plain');
                const slotPosition = slot.dataset.position;
                
                slot.classList.remove('valid-drop');
                slot.style.background = '';
                slot.style.border = '';
                
                // Verificar si el paquete está en la posición correcta
                if (packetOrder === slotPosition) {
                    slot.classList.add('correct');
                    slot.innerHTML = packetOrder;
                    slot.style.background = 'rgba(76, 175, 80, 0.3)';
                    slot.style.border = '2px solid #4CAF50';
                    slot.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
                    
                    // Verificar si el puzzle está completo
                    this.checkPacketSorting();
                } else {
                    slot.classList.add('incorrect');
                    slot.style.background = 'rgba(255, 0, 0, 0.2)';
                    slot.style.border = '2px solid #ff0000';
                    slot.style.animation = 'shake 0.5s ease-in-out';
                    
                    setTimeout(() => {
                        slot.classList.remove('incorrect');
                        slot.innerHTML = '';
                        slot.style.background = '';
                        slot.style.border = '';
                        slot.style.animation = '';
                    }, 1000);
                    
                    // Mostrar pista
                    this.showEducationalMessage(`El paquete ${packetOrder} no va en la posición ${slotPosition}. Recuerda: la secuencia debe ser 1-3-2-4.`);
                }
            });
        });
        
        checkBtn.addEventListener('click', () => {
            if (isPuzzleComplete) return;
            this.checkPacketSorting();
        });
    }
    
    checkPacketSorting() {
        const slots = document.querySelectorAll('.sort-slot');
        const correctSequence = ['1', '3', '2', '4'];
        const currentSequence = Array.from(slots).map(slot => slot.innerHTML);
        
        if (JSON.stringify(currentSequence) === JSON.stringify(correctSequence)) {
            // Puzzle completado
            const checkBtn = document.getElementById('check-sorting-btn');
            if (checkBtn) {
                checkBtn.textContent = '¡Orden Correcto! ✅';
                checkBtn.disabled = true;
                checkBtn.style.background = '#4CAF50';
            }
            
            this.showEducationalMessage('¡Perfecto! Los paquetes están en el orden correcto para que la Paloma pueda enviar su mensaje de rescate.');
            
            setTimeout(() => {
                this.rescuePigeon();
            }, 2000);
        } else {
            // Mostrar pista sobre el orden correcto
            const incorrectSlots = [];
            currentSequence.forEach((order, index) => {
                if (order !== correctSequence[index]) {
                    incorrectSlots.push(index + 1);
                }
            });
            
            this.showEducationalMessage(`Los paquetes no están en el orden correcto. Revisa las posiciones ${incorrectSlots.join(', ')}. Recuerda: la secuencia debe ser 1-3-2-4.`);
        }
    }
    
    // Event handlers del jardín
    onFlowerPlatformClick(platform) {
        platform.classList.add('pinged');
        this.playSound('ping');
        
        // Mostrar mensaje educativo
        this.showEducationalMessage('¡Ping! Las flores son nodos de red que responden a las conexiones.');
        
        setTimeout(() => {
            platform.classList.remove('pinged');
        }, 500);
    }
    
    onRouterClick(router) {
        const puzzleType = router.dataset.puzzle;
        this.gameState.level1State.currentPuzzle = puzzleType;
        
        // Mostrar puzzle correspondiente
        switch(puzzleType) {
            case 'cable':
                this.showCablePuzzle();
                break;
            case 'protocol':
                this.showProtocolPuzzle();
                break;
        }
    }
    
    defeatNetworkEnemy(enemy) {
        enemy.style.animation = 'enemyDefeat 0.5s ease-out forwards';
        this.playSound('enemy-defeat');
        
        // Mostrar mensaje educativo específico
        const message = this.level1Messages?.enemy || '¡Un error de transmisión eliminado! Los paquetes perdidos pueden cortar el flujo de datos.';
        this.showEducationalMessage(message);
        
        // Crear paquete de datos brillante después de derrotar al enemigo
        setTimeout(() => {
            const packet = document.createElement('div');
            packet.className = 'collectible data-packet';
            packet.style.left = enemy.style.left;
            packet.style.bottom = enemy.style.bottom;
            packet.innerHTML = '📦';
            packet.title = 'Paquete de datos brillante - ¡Recolectado!';
            
            // Agregar efecto de brillo
            packet.style.animation = 'dataPacketGlow 2s ease-in-out infinite';
            packet.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
            
            packet.addEventListener('click', () => this.collectDataPacket(packet));
            document.getElementById('collectibles').appendChild(packet);
            
            enemy.remove();
            
            // Mostrar mensaje sobre el paquete generado
            setTimeout(() => {
                this.showEducationalMessage('¡Al derrotar el insecto se generó un paquete de datos brillante!');
            }, 1000);
        }, 500);
    }
    
    collectDataPacket(packet) {
        packet.style.animation = 'collectibleCollected 0.5s ease-out forwards';
        this.playSound('collect');
        
        this.gameState.level1State.dataPacketsCollected++;
        this.gameState.totalScore += 100;
        
        // Mostrar mensaje educativo específico
        const message = this.level1Messages?.packet || '¡Paquete de datos recolectado! Los paquetes son como mensajes en Internet.';
        this.showEducationalMessage(message);
        
        // Actualizar contador de paquetes
        this.updatePacketCounter();
        
        setTimeout(() => {
            packet.remove();
            this.updateBridgeState();
            this.checkLevel1Progress();
        }, 500);
    }
    
    updatePacketCounter() {
        // Actualizar contador visual de paquetes recolectados
        const bridgeRequirement = document.querySelector('.bridge-requirement');
        if (bridgeRequirement) {
            const remaining = Math.max(0, 3 - this.gameState.level1State.dataPacketsCollected);
            if (remaining > 0) {
                bridgeRequirement.textContent = `Necesitas ${remaining} paquetes más para activar el puente`;
            } else {
                bridgeRequirement.textContent = '¡Puente activado! Puedes cruzar.';
            }
        }
    }
    
    collectNetworkPowerup(powerup) {
        powerup.style.animation = 'collectibleCollected 0.5s ease-out forwards';
        this.playSound('powerup');
        
        this.gameState.totalScore += 200;
        this.showEducationalMessage('¡Boost de velocidad de red! Tu conexión es más rápida ahora.');
        
        setTimeout(() => {
            powerup.remove();
        }, 500);
    }
    
    // Funciones de puzzles
    showCablePuzzle() {
        const overlay = document.getElementById('cable-puzzle-overlay');
        overlay.classList.add('active');
    }
    
    showProtocolPuzzle() {
        const overlay = document.getElementById('protocol-puzzle-overlay');
        overlay.classList.add('active');
    }
    
    showPacketSortingPuzzle() {
        const overlay = document.getElementById('packet-sorting-overlay');
        overlay.classList.add('active');
    }
    
    completeRouterPuzzle(routerNumber, protocol = null) {
        const router = document.getElementById(`router-${routerNumber}`);
        router.classList.remove('offline');
        router.classList.add('online');
        
        this.gameState.level1State.routersFixed++;
        this.gameState.totalScore += 300;
        
        // Mostrar mensaje educativo según el protocolo
        let message = '';
        if (protocol === 'tcp') {
            message = this.level1Messages?.tcp || '¡Excelente elección! TCP asegura que cada paquete llegue en orden y sin errores.';
            // Efecto visual para TCP (confiable)
            router.style.filter = 'brightness(1.2)';
            router.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
        } else if (protocol === 'udp') {
            message = this.level1Messages?.udp || 'UDP es rápido pero no garantiza que todo llegue. ¡A veces sirve, pero aquí TCP era mejor!';
            // Efecto visual para UDP (inestable)
            router.style.filter = 'brightness(1.1)';
            router.style.boxShadow = '0 0 20px rgba(255, 255, 0, 0.8)';
        } else {
            message = '¡Conexión establecida! Ahora el jardín vuelve a comunicarse.';
            router.style.filter = 'brightness(1.2)';
            router.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
        }
        
        this.showEducationalMessage(message);
        
        // Mostrar mensaje de Andy
        setTimeout(() => {
            this.showEducationalMessage('¡Conexión establecida! Ahora el jardín vuelve a comunicarse.');
        }, 2000);
        
        // Cerrar overlay
        setTimeout(() => {
            document.querySelectorAll('.puzzle-overlay').forEach(overlay => {
                overlay.classList.remove('active');
            });
        }, 3000);
        
        this.updateGardenState();
    }
    
    checkPacketSorting() {
        const slots = document.querySelectorAll('.sort-slot');
        let allCorrect = true;
        
        slots.forEach(slot => {
            const position = slot.dataset.position;
            const content = slot.textContent.trim();
            
            if (content === position) {
                slot.classList.add('correct');
            } else {
                slot.classList.add('incorrect');
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            this.completePacketSorting();
        } else {
            this.showEducationalMessage('¡Inténtalo de nuevo! Los paquetes deben estar en orden secuencial.');
        }
    }
    
    completePacketSorting() {
        this.gameState.totalScore += 500;
        this.showEducationalMessage('¡Perfecto! Has reensamblado los paquetes correctamente. ¡La Paloma está libre!');
        
        // Liberar a la paloma
        setTimeout(() => {
            this.rescuePigeon();
        }, 2000);
        
        // Cerrar overlay
        setTimeout(() => {
            document.getElementById('packet-sorting-overlay').classList.remove('active');
        }, 3000);
    }
    
    rescuePigeon() {
        const cage = document.getElementById('pigeon-cage');
        const pigeon = cage.querySelector('.pigeon-friend');
        const lock = cage.querySelector('.cage-lock');
        
        if (!cage || !pigeon) {
            console.warn('Elementos de la paloma no encontrados');
            return;
        }
        
        // Mostrar mensaje inicial
        this.showEducationalMessage('¡Estamos cerca! Restablece la conexión final para liberarla.');
        
        // Efecto visual de desbloqueo de la jaula
        cage.style.animation = 'cageUnlock 1s ease-out forwards';
        cage.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        cage.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.8)';
        
        if (lock) {
            lock.style.display = 'none';
        }
        
        // Efecto de liberación de la paloma
        setTimeout(() => {
            // Cambiar la paloma a versión con sobre de correo
            pigeon.innerHTML = '🕊️✉️';
            pigeon.style.animation = 'pigeonHop 0.5s ease-in-out infinite';
            
            // Mostrar mensaje de liberación
            this.showEducationalMessage('¡La Paloma está libre! Ahora puede enviar su mensaje de rescate a través de la red.');
            
            // Efecto de vuelo
            setTimeout(() => {
                pigeon.style.animation = 'pigeonFlyAway 2s ease-out forwards';
                pigeon.style.transform = 'translateY(-100px) translateX(50px)';
                pigeon.style.opacity = '0';
                
                // Mostrar mensaje educativo final
                const message = this.level1Messages?.rescue || '¡Has aprendido cómo las redes transmiten mensajes! Gracias a ti, el Jardín vuelve a estar conectado.';
                this.showEducationalMessage(message);
                
                // Actualizar estado del juego
                this.gameState.friendsRescued++;
                this.gameState.level1State.pigeonRescued = true;
                this.gameState.totalScore += 500; // Bonus por completar el nivel
                
                // Efecto visual del jardín restaurado
                this.restoreGarden();
                
                // Mostrar resumen del nivel
                setTimeout(() => {
                    this.showLevel1Summary();
                }, 3000);
                
            }, 2000);
            
        }, 1000);
    }
    
    restoreGarden() {
        // Efecto visual de restauración del jardín
        const gardenElements = document.querySelectorAll('.network-flower, .router, .data-bridge');
        gardenElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = 'gardenRestore 1s ease-out forwards';
                element.style.filter = 'brightness(1.2)';
                element.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.6)';
            }, index * 200);
        });
        
        // Mostrar mensaje de restauración
        setTimeout(() => {
            this.showEducationalMessage('¡El Jardín de Redes ha sido restaurado! Todas las conexiones están funcionando correctamente.');
        }, 1000);
    }
    
    showLevel1Summary() {
        const stars = this.calculateLevelStars();
        const medals = this.calculateLevelMedals();
        const points = this.gameState.totalScore;
        
        // Calcular logros específicos del nivel
        const achievements = this.calculateLevel1Achievements();
        
        // Mostrar pantalla de recompensas
        this.showRewardsScreen(1, stars, medals, points, achievements);
        
        // Actualizar estado del juego
        this.gameState.completedLevels.push(1);
        this.gameState.currentLevel = 2;
        
        // Mostrar mensajes educativos
        setTimeout(() => {
            this.showEducationalMessage('¡Primer amigo rescatado! Pero el villano aún controla la Cueva de Sistemas… ¿te atreves a seguir?');
        }, 1000);
        
        setTimeout(() => {
            this.showEducationalMessage(`¡Excelente trabajo! Rescataste a la Paloma y aprendiste sobre redes. ¡Has ganado ${stars} estrellas!`);
        }, 3000);
        
        // Transición al mapa mundial
        setTimeout(() => {
            this.showScreen('world-map-screen');
        }, 8000);
    }
    
    calculateLevel1Achievements() {
        const achievements = [];
        
        // Verificar logros específicos del nivel 1
        if (this.gameState.level1State.dataPacketsCollected >= 3) {
            achievements.push({
                name: 'Coleccionista de Paquetes',
                description: 'Recolectaste todos los paquetes de datos',
                icon: '📦',
                points: 100
            });
        }
        
        if (this.gameState.level1State.routersFixed >= 2) {
            achievements.push({
                name: 'Ingeniero de Redes',
                description: 'Reparaste todos los routers del jardín',
                icon: '🔧',
                points: 150
            });
        }
        
        if (this.gameState.level1State.pigeonRescued) {
            achievements.push({
                name: 'Héroe del Jardín',
                description: 'Rescataste exitosamente a la Paloma',
                icon: '🕊️',
                points: 200
            });
        }
        
        // Verificar si completó el tutorial
        if (this.gameState.level1State.movementHintsShown) {
            achievements.push({
                name: 'Aprendiz de Movimiento',
                description: 'Dominaste los controles básicos del juego',
                icon: '🏃',
                points: 50
            });
        }
        
        return achievements;
    }
    
    showRewardsScreen(level, stars, medals, points, achievements) {
        // Crear pantalla de recompensas
        const rewardsScreen = document.createElement('div');
        rewardsScreen.className = 'rewards-screen';
        rewardsScreen.innerHTML = `
            <div class="rewards-container">
                <h2>🎉 ¡Nivel ${level} Completado! 🎉</h2>
                
                <div class="rewards-summary">
                    <div class="reward-item">
                        <div class="reward-icon">⭐</div>
                        <div class="reward-text">
                            <h3>Estrellas</h3>
                            <p>${stars}/3</p>
                        </div>
                    </div>
                    
                    <div class="reward-item">
                        <div class="reward-icon">🏆</div>
                        <div class="reward-text">
                            <h3>Medallas</h3>
                            <p>${medals}</p>
                        </div>
                    </div>
                    
                    <div class="reward-item">
                        <div class="reward-icon">💎</div>
                        <div class="reward-text">
                            <h3>Puntos</h3>
                            <p>${points}</p>
                        </div>
                    </div>
                </div>
                
                <div class="achievements-section">
                    <h3>🏅 Logros Desbloqueados</h3>
                    <div class="achievements-list">
                        ${achievements.map(achievement => `
                            <div class="achievement-item">
                                <div class="achievement-icon">${achievement.icon}</div>
                                <div class="achievement-text">
                                    <h4>${achievement.name}</h4>
                                    <p>${achievement.description}</p>
                                    <span class="achievement-points">+${achievement.points} puntos</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="friend-rescued">
                    <h3>👥 Amigo Rescatado</h3>
                    <div class="friend-card">
                        <div class="friend-avatar">🕊️</div>
                        <div class="friend-info">
                            <h4>La Paloma</h4>
                            <p>Especialista en mensajería de red</p>
                            <p>Ahora puede enviar mensajes a través de Internet</p>
                        </div>
                    </div>
                </div>
                
                <div class="next-level-hint">
                    <p>🌋 Próximo nivel: Cueva de Sistemas</p>
                    <p>¡Prepárate para enfrentar al villano principal!</p>
                </div>
            </div>
        `;
        
        // Agregar estilos
        rewardsScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease-in;
        `;
        
        // Agregar al DOM
        document.body.appendChild(rewardsScreen);
        
        // Remover después de un tiempo
        setTimeout(() => {
            rewardsScreen.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(rewardsScreen);
            }, 500);
        }, 6000);
    }
    
    // Funciones de estado del jardín
    updateGardenState() {
        this.updateBridgeState();
        this.updateCageState();
        this.updateRouterStates();
    }
    
    updateBridgeState() {
        const bridge = document.getElementById('data-bridge');
        const requirement = bridge.querySelector('.bridge-requirement');
        const bridgeStatus = bridge.querySelector('.bridge-status');
        
        if (!bridge || !requirement) {
            console.warn('Elementos del puente no encontrados');
            return;
        }
        
        const packetsNeeded = Math.max(0, 3 - this.gameState.level1State.dataPacketsCollected);
        
        if (this.gameState.level1State.dataPacketsCollected >= 3) {
            // Puente desbloqueado
            bridge.classList.remove('locked');
            bridge.classList.add('unlocked');
            bridge.style.cursor = 'pointer';
            bridge.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            bridge.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.8)';
            bridge.style.animation = 'bridgeGlow 2s ease-in-out infinite';
            
            requirement.textContent = '¡Puente Activado! Puedes cruzar.';
            requirement.style.color = '#4CAF50';
            requirement.style.fontWeight = 'bold';
            
            if (bridgeStatus) {
                bridgeStatus.innerHTML = '🌉 <strong>PUENTE ACTIVO</strong> 🌉';
                bridgeStatus.style.color = '#4CAF50';
            }
            
            // Mostrar mensaje educativo
            this.showEducationalMessage('¡Excelente! Con suficientes paquetes de datos, el puente de red se ha activado. Ahora puedes cruzar al área de la Paloma.');
            
            // Agregar evento de clic para cruzar el puente
            bridge.onclick = () => {
                this.crossBridge();
            };
            
            // Efecto visual de activación
            setTimeout(() => {
                bridge.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    bridge.style.transform = 'scale(1)';
                }, 200);
            }, 100);
            
        } else {
            // Puente bloqueado
            bridge.classList.remove('unlocked');
            bridge.classList.add('locked');
            bridge.style.cursor = 'not-allowed';
            bridge.style.background = 'linear-gradient(45deg, #666, #444)';
            bridge.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3)';
            bridge.style.animation = 'bridgeFlicker 1.5s ease-in-out infinite';
            
            requirement.textContent = `Necesitas ${packetsNeeded} paquete${packetsNeeded !== 1 ? 's' : ''} más para activar el puente`;
            requirement.style.color = '#ff4444';
            
            if (bridgeStatus) {
                bridgeStatus.innerHTML = '🚧 <strong>PUENTE BLOQUEADO</strong> 🚧';
                bridgeStatus.style.color = '#ff4444';
            }
            
            // Mostrar pista educativa
            if (packetsNeeded === 2) {
                this.showEducationalMessage('El puente necesita 3 paquetes de datos para activarse. ¡Derrota más insectos para obtener paquetes!');
            } else if (packetsNeeded === 1) {
                this.showEducationalMessage('¡Solo falta 1 paquete más! Derrota otro insecto para activar el puente.');
            }
        }
    }
    
    crossBridge() {
        const bridge = document.getElementById('data-bridge');
        if (!bridge || !bridge.classList.contains('unlocked')) return;
        
        // Efecto visual de cruzar
        bridge.style.animation = 'bridgeCross 1s ease-in-out';
        this.playSound('bridge-cross');
        
        // Mostrar mensaje educativo
        this.showEducationalMessage('¡Cruzando el puente de datos! Ahora estás en el área de la Paloma. Busca la jaula para rescatarla.');
        
        // Actualizar posición del jugador (simular movimiento)
        setTimeout(() => {
            this.showEducationalMessage('¡Has llegado al área de la Paloma! Ahora debes resolver el puzzle final para rescatarla.');
            this.updateCageState();
        }, 2000);
    }
    
    updateCageState() {
        const cage = document.getElementById('pigeon-cage');
        const lock = cage.querySelector('.cage-lock');
        const pigeon = cage.querySelector('.pigeon-friend');
        
        if (!cage || !lock) {
            console.warn('Elementos de la jaula no encontrados');
            return;
        }
        
        if (this.gameState.level1State.routersFixed >= 2 && this.gameState.level1State.dataPacketsCollected >= 3) {
            // Jaula desbloqueada
            lock.style.display = 'none';
            cage.style.cursor = 'pointer';
            cage.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            cage.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.8)';
            cage.style.animation = 'cageGlow 2s ease-in-out infinite';
            
            if (pigeon) {
                pigeon.style.animation = 'pigeonHop 1s ease-in-out infinite';
            }
            
            // Mostrar mensaje educativo
            this.showEducationalMessage('¡La jaula está desbloqueada! Haz clic en ella para resolver el puzzle final y rescatar a la Paloma.');
            
            // Agregar evento de clic para mostrar el puzzle
            cage.onclick = () => {
                this.showPacketSortingPuzzle();
            };
            
            // Efecto visual de desbloqueo
            setTimeout(() => {
                cage.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    cage.style.transform = 'scale(1)';
                }, 200);
            }, 100);
            
        } else {
            // Jaula bloqueada
            cage.style.cursor = 'not-allowed';
            cage.style.background = 'linear-gradient(45deg, #666, #444)';
            cage.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3)';
            cage.style.animation = 'cageFlicker 1.5s ease-in-out infinite';
            
            if (pigeon) {
                pigeon.style.animation = 'pigeonTrapped 2s ease-in-out infinite';
            }
            
            // Mostrar pista educativa
            const routersNeeded = Math.max(0, 2 - this.gameState.level1State.routersFixed);
            const packetsNeeded = Math.max(0, 3 - this.gameState.level1State.dataPacketsCollected);
            
            if (routersNeeded > 0 && packetsNeeded > 0) {
                this.showEducationalMessage(`Necesitas reparar ${routersNeeded} router${routersNeeded !== 1 ? 's' : ''} más y recoger ${packetsNeeded} paquete${packetsNeeded !== 1 ? 's' : ''} más para desbloquear la jaula.`);
            } else if (routersNeeded > 0) {
                this.showEducationalMessage(`Necesitas reparar ${routersNeeded} router${routersNeeded !== 1 ? 's' : ''} más para desbloquear la jaula.`);
            } else if (packetsNeeded > 0) {
                this.showEducationalMessage(`Necesitas recoger ${packetsNeeded} paquete${packetsNeeded !== 1 ? 's' : ''} más para desbloquear la jaula.`);
            }
        }
    }
    
    updateRouterStates() {
        const routers = document.querySelectorAll('.router');
        routers.forEach((router, index) => {
            if (index < this.gameState.level1State.routersFixed) {
                router.classList.remove('offline');
                router.classList.add('online');
            }
        });
    }
    
    showEducationalMessage(message) {
        // Crear mensaje educativo temporal
        const messageDiv = document.createElement('div');
        messageDiv.className = 'educational-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            padding: 1rem 2rem;
            border: 2px solid #00ff00;
            border-radius: 10px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.7rem;
            z-index: 1000;
            text-align: center;
            max-width: 80%;
            animation: messageFadeIn 0.5s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'messageFadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                messageDiv.remove();
            }, 500);
        }, 3000);
    }
    
    calculateLevelStars() {
        let stars = 0;
        if (this.gameState.level1State.routersFixed >= 2) stars++;
        if (this.gameState.level1State.dataPacketsCollected >= 3) stars++;
        if (this.gameState.level1State.pigeonRescued) stars++;
        return stars;
    }
    
    calculateLevelMedals() {
        let medals = 0;
        if (this.gameState.totalScore >= 1000) medals++;
        if (this.gameState.level1State.routersFixed === 2) medals++;
        return medals;
    }
    
    createBrickTower() {
        // La torre de ladrillos ya está creada en el HTML
        // Solo necesitamos agregar elementos interactivos
        const brickRows = document.querySelectorAll('.brick-row');
        brickRows.forEach((row, index) => {
            // Agregar eventos de click a los ladrillos
            row.addEventListener('click', () => this.breakBrick(row));
            row.style.cursor = 'pointer';
        });
    }
    
    breakBrick(brick) {
        // Efecto de romper ladrillo
        brick.style.animation = 'brickBreak 0.5s ease-out forwards';
        
        // Agregar puntaje
        this.gameState.totalScore += 50;
        this.updateScore();
        
        // Efecto de sonido
        if (this.gameState.sfxEnabled) {
            this.playSound('break');
        }
        
        // Remover ladrillo después de la animación
        setTimeout(() => {
            brick.style.display = 'none';
        }, 500);
    }
    
    createEnemies() {
        const enemiesContainer = document.getElementById('enemies');
        enemiesContainer.innerHTML = '';
        
        // Crear enemigos estilo Mario
        const enemyPositions = [
            { left: 200, top: 280, type: 'goomba' },
            { left: 400, top: 230, type: 'koopa' },
            { left: 600, top: 180, type: 'goomba' }
        ];
        
        enemyPositions.forEach(pos => {
            const enemy = document.createElement('div');
            enemy.className = 'enemy';
            enemy.innerHTML = pos.type === 'goomba' ? '🍄' : '🐢';
            enemy.style.left = pos.left + 'px';
            enemy.style.top = pos.top + 'px';
            enemy.dataset.type = pos.type;
            enemiesContainer.appendChild(enemy);
        });
    }
    
    createCollectibles() {
        const collectiblesContainer = document.getElementById('collectibles');
        collectiblesContainer.innerHTML = '';
        
        // Crear monedas estilo Mario
        const collectiblePositions = [
            { left: 120, top: 270 },
            { left: 320, top: 220 },
            { left: 520, top: 170 },
            { left: 720, top: 120 },
            { left: 200, top: 270 },
            { left: 400, top: 220 },
            { left: 600, top: 170 }
        ];
        
        collectiblePositions.forEach(pos => {
            const collectible = document.createElement('div');
            collectible.className = 'collectible';
            collectible.innerHTML = '🪙';
            collectible.style.left = pos.left + 'px';
            collectible.style.top = pos.top + 'px';
            collectible.style.animation = 'coinSpin 2s infinite';
            collectible.addEventListener('click', () => this.collectCoin(collectible));
            collectiblesContainer.appendChild(collectible);
        });
    }
    
    createPowerUps() {
        const powerUpsContainer = document.getElementById('power-ups');
        powerUpsContainer.innerHTML = '';
        
        // Crear power-ups estilo Mario
        const powerUpPositions = [
            { left: 250, top: 200, type: 'mushroom' },
            { left: 450, top: 150, type: 'star' }
        ];
        
        powerUpPositions.forEach(pos => {
            const powerUp = document.createElement('div');
            powerUp.className = 'power-up';
            powerUp.innerHTML = pos.type === 'mushroom' ? '🍄' : '⭐';
            powerUp.style.left = pos.left + 'px';
            powerUp.style.top = pos.top + 'px';
            powerUp.dataset.type = pos.type;
            powerUp.addEventListener('click', () => this.collectPowerUp(powerUp));
            powerUpsContainer.appendChild(powerUp);
        });
    }
    
    createFriendPrison() {
        const friendPrison = document.getElementById('friend-prison');
        const levelData = this.gameState.levelData[this.gameState.currentLevel];
        
        // Mostrar el amigo capturado según el nivel
        const friendElement = friendPrison.querySelector('.friend-captured');
        friendElement.className = `friend-captured ${levelData.friend}`;
        
        switch(levelData.friend) {
            case 'pigeon':
                friendElement.innerHTML = '🕊️';
                break;
            case 'bat':
                friendElement.innerHTML = '🦇';
                break;
            case 'lizard':
                friendElement.innerHTML = '🦎';
                break;
            case 'possum':
                friendElement.innerHTML = '🐾';
                break;
            case 'andy':
                friendElement.innerHTML = '🐿️';
                break;
        }
        
        // Hacer clickeable para rescatar
        friendPrison.addEventListener('click', () => this.rescueFriend());
    }
    
    startPlayerMovement() {
        const player = document.getElementById('player');
        if (!player) {
            console.error('No se encontró el elemento player');
            return;
        }
        
        // Detener cualquier loop anterior
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        // Configuración inicial del jugador
        this.playerState = {
            x: 50, // Posición inicial en porcentaje
            y: 20, // Posición inicial en porcentaje (desde abajo)
            isJumping: false,
            jumpVelocity: 0,
            gravity: 0.5,
            jumpPower: -8,
            speed: 2,
            groundLevel: 20 // Nivel del suelo en porcentaje
        };
        
        // Establecer posición inicial
        player.style.left = this.playerState.x + '%';
        player.style.bottom = this.playerState.y + '%';
        player.style.position = 'absolute';
        player.style.zIndex = '100';
        
        console.log('Movimiento del jugador inicializado');
        
        const gameLoop = setInterval(() => {
            this.updatePlayerPosition();
        }, 16);
        
        this.gameLoop = gameLoop;
    }
    
    updatePlayerPosition() {
        const player = document.getElementById('player');
        if (!player) return;
        
        // Aplicar gravedad
        if (this.playerState.y > this.playerState.groundLevel) {
            this.playerState.y += this.playerState.jumpVelocity;
            this.playerState.jumpVelocity += this.playerState.gravity;
        } else {
            this.playerState.y = this.playerState.groundLevel;
            this.playerState.jumpVelocity = 0;
            this.playerState.isJumping = false;
        }
        
        // Actualizar posición visual
        player.style.left = this.playerState.x + '%';
        player.style.bottom = this.playerState.y + '%';
        
        // Verificar colisiones
        this.checkPlayerCollisions();
    }
    
    checkPlayerCollisions() {
        if (!this.playerState) return;
        
        const player = document.getElementById('player');
        if (!player) return;
        
        // Verificar colisiones con enemigos
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();
            
            if (this.isColliding(playerRect, enemyRect)) {
                this.handleEnemyCollision(enemy);
            }
        });
        
        // Verificar colisiones con coleccionables
        const collectibles = document.querySelectorAll('.collectible');
        collectibles.forEach(collectible => {
            const collectibleRect = collectible.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();
            
            if (this.isColliding(playerRect, collectibleRect)) {
                this.handleCollectibleCollision(collectible);
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.left < rect2.right &&
               rect1.right > rect2.left &&
               rect1.top < rect2.bottom &&
               rect1.bottom > rect2.top;
    }
    
    handleEnemyCollision(enemy) {
        // Solo procesar colisión si el enemigo aún existe
        if (!enemy.parentNode) return;
        
        this.gameState.lives--;
        this.showEducationalMessage('¡Ouch! Te golpeaste con un paquete perdido.');
        
        // Actualizar contador de vidas
        const livesElement = document.getElementById('lives');
        if (livesElement) {
            livesElement.textContent = this.gameState.lives;
        }
        
        // Eliminar enemigo
        enemy.remove();
        
        if (this.gameState.lives <= 0) {
            this.gameOver();
        }
    }
    
    gameOver() {
        console.log('Game Over');
        
        // Detener el loop del juego
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        // Mostrar mensaje de game over
        this.showEducationalMessage('¡Game Over! Andy necesita más práctica. ¡Inténtalo de nuevo!');
        
        // Volver al mapa después de un delay
        setTimeout(() => {
            this.showScreen('world-map-screen');
        }, 3000);
    }
    
    handleCollectibleCollision(collectible) {
        // Solo procesar colisión si el coleccionable aún existe
        if (!collectible.parentNode) return;
        
        // Determinar tipo de coleccionable
        if (collectible.innerHTML.includes('📦')) {
            this.collectDataPacket(collectible);
        } else if (collectible.innerHTML.includes('⚡')) {
            this.collectNetworkPowerup(collectible);
        } else {
            // Coleccionable genérico
            collectible.style.animation = 'collectibleCollected 0.5s ease-out forwards';
            this.gameState.totalScore += 100;
            
            setTimeout(() => {
                collectible.remove();
            }, 500);
        }
    }
    
    handleKeyPress(e) {
        if (this.currentScreen !== 'level-screen') return;
        if (!this.playerState) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.playerState.x = Math.max(5, this.playerState.x - this.playerState.speed);
                this.showMovementHint('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.playerState.x = Math.min(90, this.playerState.x + this.playerState.speed);
                this.showMovementHint('right');
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
                if (!this.playerState.isJumping && this.playerState.y <= this.playerState.groundLevel) {
                    this.playerState.jumpVelocity = this.playerState.jumpPower;
                    this.playerState.isJumping = true;
                    this.playSound('jump');
                    this.showMovementHint('jump');
                }
                break;
        }
        
        // Prevenir comportamiento por defecto
        e.preventDefault();
    }
    
    showMovementHint(direction) {
        // Mostrar pistas de movimiento solo la primera vez
        if (!this.gameState.level1State.movementHintsShown) {
            this.gameState.level1State.movementHintsShown = true;
            
            let message = '';
            switch(direction) {
                case 'left':
                case 'right':
                    message = this.level1Messages?.movement || '¡Bien hecho! Las flechas o WASD te permiten mover a Andy por el jardín.';
                    break;
                case 'jump':
                    message = this.level1Messages?.jump || '¡Perfecto! ESPACIO hace que Andy salte. Úsalo para alcanzar plataformas altas.';
                    break;
            }
            
            if (message) {
                this.showEducationalMessage(message);
            }
        }
    }
    
    jumpPlayer() {
        const player = document.getElementById('player');
        player.style.animation = 'none';
        setTimeout(() => {
            player.style.animation = 'bounce 0.6s ease-out';
        }, 10);
    }
    
    checkEnemyCollisions(playerX, playerY) {
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            const gameRect = document.getElementById('game-world').getBoundingClientRect();
            const enemyX = enemyRect.left - gameRect.left;
            const enemyY = enemyRect.top - gameRect.top;
            
            if (Math.abs(playerX - enemyX) < 30 && Math.abs(playerY - enemyY) < 30) {
                this.playerHit();
            }
        });
    }
    
    playerHit() {
        // Efecto de daño
        const player = document.getElementById('player');
        player.style.animation = 'shake 0.5s';
        
        // Reducir vidas
        this.gameState.lives -= 1;
        document.getElementById('lives').textContent = this.gameState.lives;
        
        // Efecto de sonido
        if (this.gameState.sfxEnabled) {
            this.playSound('hit');
        }
        
        setTimeout(() => {
            player.style.animation = '';
            
            // Verificar si el jugador se quedó sin vidas
            if (this.gameState.lives <= 0) {
                this.gameOver();
            }
        }, 500);
    }
    
    gameOver() {
        clearInterval(this.gameLoop);
        
        // Mostrar pantalla de Game Over
        alert('¡Game Over! Has perdido todas tus vidas. ¡Inténtalo de nuevo!');
        
        // Reiniciar nivel
        this.gameState.lives = 3;
        this.showScreen('world-map-screen');
    }
    
    collectCoin(collectible) {
        collectible.style.display = 'none';
        this.gameState.totalScore += 100;
        this.updateScore();
        
        // Efecto de sonido
        if (this.gameState.sfxEnabled) {
            this.playSound('coin');
        }
    }
    
    collectPowerUp(powerUp) {
        powerUp.style.display = 'none';
        const type = powerUp.dataset.type;
        
        if (type === 'mushroom') {
            this.gameState.totalScore += 500;
            this.gameState.lives += 1; // Vida extra
            document.getElementById('lives').textContent = this.gameState.lives;
        } else if (type === 'star') {
            this.gameState.totalScore += 1000;
            // Efecto de invencibilidad temporal
            this.makePlayerInvincible();
        }
        
        this.updateScore();
        
        // Efecto de sonido
        if (this.gameState.sfxEnabled) {
            this.playSound('powerup');
        }
    }
    
    rescueFriend() {
        this.gameState.friendsRescued += 1;
        this.gameState.totalScore += 2000;
        
        // Actualizar contador
        document.getElementById('friends-count').textContent = `${this.gameState.friendsRescued}/5`;
        this.updateScore();
        
        // Efecto de sonido
        if (this.gameState.sfxEnabled) {
            this.playSound('rescue');
        }
        
        // Completar nivel
        setTimeout(() => {
            this.completeLevel();
        }, 1000);
    }
    
    makePlayerInvincible() {
        const player = document.getElementById('player');
        player.style.animation = 'marioJump 0.5s infinite';
        
        setTimeout(() => {
            player.style.animation = '';
        }, 5000);
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.gameState.totalScore.toString().padStart(5, '0');
    }
    
    completeLevel() {
        clearInterval(this.gameLoop);
        
        // Animación de victoria
        this.showVictoryAnimation();
        
        setTimeout(() => {
            this.showLevelSummary();
        }, 2000);
    }
    
    showVictoryAnimation() {
        const masterServer = document.getElementById('master-server');
        masterServer.style.background = '#00ff00';
        masterServer.style.boxShadow = '0 0 30px #00ff00';
        
        // Crear avatares de amigos rescatados
        const levelData = this.gameState.levelData[this.gameState.currentLevel];
        for (let i = 0; i < levelData.friends; i++) {
            setTimeout(() => {
                this.createFlyingFriend();
            }, i * 200);
        }
    }
    
    createFlyingFriend() {
        const friend = document.createElement('div');
        friend.innerHTML = '👤';
        friend.style.position = 'absolute';
        friend.style.fontSize = '1.5rem';
        friend.style.left = '50%';
        friend.style.top = '50%';
        friend.style.animation = 'float 1s ease-out forwards';
        friend.style.zIndex = '100';
        
        document.getElementById('game-world').appendChild(friend);
        
        setTimeout(() => {
            friend.remove();
        }, 1000);
    }
    
    showLevelSummary() {
        const levelData = this.gameState.levelData[this.gameState.currentLevel];
        
        document.getElementById('final-score').textContent = this.gameState.totalScore;
        document.getElementById('data-collected').textContent = `${Math.floor(this.gameState.totalScore / 100)} monedas`;
        document.getElementById('friends-rescued').textContent = levelData.friendName;
        document.getElementById('knowledge-text').textContent = this.knowledgeCapsules[this.gameState.currentLevel];
        
        this.showScreen('level-summary-screen');
    }
    
    returnToWorldMap() {
        // Desbloquear siguiente nivel
        if (this.gameState.currentLevel < 5) {
            this.gameState.currentLevel++;
        }
        
        this.showScreen('world-map-screen');
    }
    
    startFinalBoss() {
        this.createFriendsGrid();
        this.startBossBattle();
    }
    
    createFriendsGrid() {
        const friendsGrid = document.getElementById('friends-grid');
        friendsGrid.innerHTML = '';
        
        for (let i = 0; i < 25; i++) {
            const friendSlot = document.createElement('div');
            friendSlot.className = 'friend-slot';
            friendSlot.innerHTML = '👤';
            friendSlot.addEventListener('click', () => this.placeFriend(friendSlot));
            friendsGrid.appendChild(friendSlot);
        }
    }
    
    placeFriend(slot) {
        if (slot.classList.contains('filled')) return;
        
        slot.classList.add('filled');
        this.gameState.friendsRescued++;
        
        // Actualizar salud del Glitch
        const healthFill = document.getElementById('glitch-health');
        const healthPercentage = ((25 - this.gameState.friendsRescued) / 25) * 100;
        healthFill.style.width = healthPercentage + '%';
        
        if (this.gameState.friendsRescued >= 25) {
            this.defeatGlitch();
        }
    }
    
    defeatGlitch() {
        // Animación de derrota del Glitch
        const glitchElement = document.querySelector('.glitch-character');
        if (glitchElement) {
            glitchElement.style.animation = 'glitch 0.1s infinite';
            glitchElement.innerHTML = '💥';
        }
        
        setTimeout(() => {
            this.showScreen('victory-screen');
            this.createVictoryAnimation();
        }, 2000);
    }
    
    createVictoryAnimation() {
        const friendsVideoCall = document.getElementById('friends-video-call');
        friendsVideoCall.innerHTML = '';
        
        for (let i = 0; i < 25; i++) {
            const friendVideo = document.createElement('div');
            friendVideo.className = 'friend-video';
            friendVideo.innerHTML = '👤';
            friendVideo.style.animationDelay = (i * 0.1) + 's';
            friendsVideoCall.appendChild(friendVideo);
        }
        
        setTimeout(() => {
            this.showScreen('final-results-screen');
            this.calculateFinalResults();
        }, 3000);
    }
    
    calculateFinalResults() {
        const totalScore = this.gameState.totalScore + (this.gameState.friendsRescued * 1000);
        document.getElementById('total-score').textContent = totalScore.toLocaleString();
        
        // Calcular rango
        const rank = this.calculateRank(totalScore);
        document.getElementById('rank').textContent = rank;
    }
    
    calculateRank(score) {
        if (score >= 100000) return 'Diseñador de Experiencias Legendario';
        if (score >= 80000) return 'Arquitecto de Sistemas Élite';
        if (score >= 60000) return 'Desarrollador Senior';
        if (score >= 40000) return 'Ingeniero de Sistemas';
        return 'Desarrollador Junior';
    }
    
    shareAchievement() {
        const rank = document.getElementById('rank').textContent;
        const score = document.getElementById('total-score').textContent;
        
        const shareText = `¡Rescaté a los 25 Close Friends de Andy y obtuve el rango de '${rank}' con ${score} puntos! 🐿️💚 #FuturoIngenieroIcesi #SistemasIcesi`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Andy\'s Close Friends Rescue',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            navigator.clipboard.writeText(shareText).then(() => {
                alert('¡Logro copiado al portapapeles! Puedes pegarlo en tus redes sociales.');
            });
        }
    }
    
    restartGame() {
        this.gameState = {
            currentLevel: 1,
            totalScore: 0,
            friendsRescued: 0,
            lives: 3,
            musicEnabled: this.gameState.musicEnabled,
            sfxEnabled: this.gameState.sfxEnabled,
            levelScores: {},
            levelData: {
                1: { friend: 'pigeon', friendName: 'Paloma', concept: 'Piso 1 de la Torre' },
                2: { friend: 'bat', friendName: 'Murciélago', concept: 'Piso 2 de la Torre' },
                3: { friend: 'lizard', friendName: 'Iguana', concept: 'Piso 3 de la Torre' },
                4: { friend: 'possum', friendName: 'Zarigüeya', concept: 'Piso 4 de la Torre' },
                5: { friend: 'andy', friendName: 'Andy', concept: 'Cima de la Torre' }
            }
        };
        
        this.showScreen('home-screen');
    }
    
    playBackgroundMusic() {
        if (!this.gameState.musicEnabled) return;
        
        // Crear audio context para música chiptune
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioContext = audioContext;
            this.playChiptuneMusic();
        } catch (e) {
            console.log('Audio no soportado');
        }
    }
    
    playChiptuneMusic() {
        if (!this.audioContext || !this.gameState.musicEnabled) return;
        
        // Melodía simple de chiptune
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        let noteIndex = 0;
        
        const playNote = () => {
            if (!this.gameState.musicEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(notes[noteIndex], this.audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
            
            noteIndex = (noteIndex + 1) % notes.length;
            
            setTimeout(playNote, 300);
        };
        
        playNote();
    }
    
    toggleMusic() {
        if (this.gameState.musicEnabled) {
            this.playBackgroundMusic();
        } else {
            if (this.audioContext) {
                this.audioContext.close();
            }
        }
    }
    
    playSound(soundType) {
        if (!this.gameState.sfxEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(soundType) {
            case 'coin':
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'jump':
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'powerup':
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.3);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;
            case 'hit':
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
            case 'rescue':
                oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1500, this.audioContext.currentTime + 0.5);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);
                break;
            case 'break':
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'villain':
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;
            case 'capture':
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.4);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.4);
                break;
            case 'tick':
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.05);
                break;
            case 'challenge':
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.6);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.6);
                break;
        }
    }
    
    setupTouchControls() {
        // Controles táctiles para móviles
        const gameWorld = document.getElementById('game-world');
        if (!gameWorld) return;
        
        let touchStartX = 0;
        let touchStartY = 0;
        
        gameWorld.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        gameWorld.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Movimiento horizontal
                if (deltaX > 50) {
                    this.handleKeyPress({ key: 'ArrowRight' });
                } else if (deltaX < -50) {
                    this.handleKeyPress({ key: 'ArrowLeft' });
                }
            } else {
                // Movimiento vertical (salto)
                if (deltaY < -50) {
                    this.handleKeyPress({ key: ' ' });
                }
            }
        });
    }
    
    // Métodos para otros niveles (simplificados por ahora)
    initLevel2() {
        this.initLevel1(); // Reutilizar lógica base con diferentes enemigos
    }
    
    initLevel3() {
        this.initLevel1(); // Reutilizar lógica base con diferentes enemigos
    }
    
    initLevel4() {
        this.initLevel1(); // Reutilizar lógica base con diferentes enemigos
    }
    
    startBossBattle() {
        // Lógica específica de la batalla final
        console.log('Iniciando batalla contra El Glitch');
    }
    
    // Tutorial Functions
    showTutorial() {
        const tutorialModal = document.getElementById('tutorial-modal');
        if (tutorialModal) {
            tutorialModal.classList.add('active');
            this.currentTutorialStep = 1;
        }
    }
    
    nextTutorialStep() {
        if (this.currentTutorialStep < 4) {
            this.currentTutorialStep++;
            this.updateTutorialStep();
        } else {
            this.finishTutorial();
        }
    }
    
    previousTutorialStep() {
        if (this.currentTutorialStep > 1) {
            this.currentTutorialStep--;
            this.updateTutorialStep();
        }
    }
    
    goToTutorialStep(step) {
        this.currentTutorialStep = step;
        this.updateTutorialStep();
    }
    
    updateTutorialStep() {
        const steps = document.querySelectorAll('.tutorial-step');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('tutorial-prev');
        const nextBtn = document.getElementById('tutorial-next');
        const finishBtn = document.getElementById('tutorial-finish');
        
        // Actualizar steps
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentTutorialStep) {
                step.classList.add('active');
            }
        });
        
        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index + 1 === this.currentTutorialStep) {
                dot.classList.add('active');
            }
        });
        
        // Actualizar botones
        prevBtn.style.display = this.currentTutorialStep === 1 ? 'none' : 'block';
        if (this.currentTutorialStep === 4) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            finishBtn.style.display = 'none';
        }
    }
    
    finishTutorial() {
        const tutorialModal = document.getElementById('tutorial-modal');
        if (tutorialModal) {
            tutorialModal.classList.remove('active');
            this.gameState.tutorialCompleted = true;
            this.highlightFirstMission();
        }
    }
    
    highlightFirstMission() {
        const highlight = document.getElementById('first-mission-highlight');
        const firstStation = document.querySelector('.station-1');
        
        if (highlight && firstStation && !this.gameState.completedLevels.includes(1)) {
            const stationRect = firstStation.getBoundingClientRect();
            const mapRect = document.getElementById('world-map-screen').getBoundingClientRect();
            
            const leftPercent = ((stationRect.left - mapRect.left + stationRect.width / 2 - 40) / mapRect.width) * 100;
            const bottomPercent = ((mapRect.bottom - stationRect.bottom + stationRect.height / 2 - 40) / mapRect.height) * 100;
            
            highlight.style.left = `${leftPercent}%`;
            highlight.style.bottom = `${bottomPercent}%`;
            highlight.classList.add('active');
        } else if (highlight) {
            highlight.classList.remove('active');
        }
    }
    
    // Gamification Functions
    updateGameStats() {
        const starsElement = document.getElementById('total-stars');
        const medalsElement = document.getElementById('total-medals');
        const pointsElement = document.getElementById('total-points');
        
        if (starsElement) {
            starsElement.textContent = this.gameState.totalStars || 0;
        }
        if (medalsElement) {
            medalsElement.textContent = this.gameState.totalMedals || 0;
        }
        if (pointsElement) {
            pointsElement.textContent = this.gameState.totalPoints || 0;
        }
    }
    
    awardRewards(level) {
        // Calcular recompensas basadas en el rendimiento
        const baseStars = 1;
        const baseMedals = 1;
        const basePoints = 100;
        
        // Bonus por completar rápido (simulado)
        const timeBonus = Math.floor(Math.random() * 2);
        const stars = baseStars + timeBonus;
        const medals = baseMedals;
        const points = basePoints + (timeBonus * 50);
        
        // Actualizar estado del juego
        this.gameState.totalStars = (this.gameState.totalStars || 0) + stars;
        this.gameState.totalMedals = (this.gameState.totalMedals || 0) + medals;
        this.gameState.totalPoints = (this.gameState.totalPoints || 0) + points;
        
        // Mostrar animación de recompensas
        this.showRewardAnimation(stars, medals, points);
        
        // Actualizar display
        this.updateGameStats();
    }
    
    showRewardAnimation(stars, medals, points) {
        // Crear elementos de animación de recompensas
        const rewards = [
            { icon: '⭐', value: stars, color: '#FFD700' },
            { icon: '🏆', value: medals, color: '#FF6B35' },
            { icon: '🎯', value: points, color: '#00FF00' }
        ];
        
        rewards.forEach((reward, index) => {
            if (reward.value > 0) {
                const rewardEl = document.createElement('div');
                rewardEl.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 2rem;
                    color: ${reward.color};
                    z-index: 1001;
                    pointer-events: none;
                    animation: rewardFloat 2s ease-out forwards;
                    animation-delay: ${index * 0.3}s;
                `;
                rewardEl.textContent = `${reward.icon} +${reward.value}`;
                document.body.appendChild(rewardEl);
                
                // Remover elemento después de la animación
                setTimeout(() => {
                    document.body.removeChild(rewardEl);
                }, 2300 + (index * 300));
            }
        });
        
        // Reproducir sonido de recompensa
        this.playSound('powerup');
    }
    
    // Agregar animación CSS para las recompensas
    addRewardAnimationCSS() {
        if (!document.getElementById('reward-animation-css')) {
            const style = document.createElement('style');
            style.id = 'reward-animation-css';
            style.textContent = `
                @keyframes rewardFloat {
                    0% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0.5); 
                    }
                    20% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1.2); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(-50%, -150%) scale(1); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AndysGame();
});

// Prevenir zoom en móviles
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });
