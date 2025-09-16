# Andy's Close Friends Rescue 🐿️🏛️

Un juego web educativo desarrollado para la Universidad Icesi que combina gamificación con conceptos de Ingeniería de Sistemas. Ahora con **mapa del mundo estilo Mario**, **tutorial interactivo** y **sistema de recompensas** completo.

## 🎮 Descripción del Juego

Andy la Ardilla necesita tu ayuda para rescatar a sus 4 mejores amigos que fueron encerrados por un villano en la icónica **Torre ICESI**. Como futuro ingeniero de sistemas, deberás navegar por diferentes biomas tecnológicos, cada uno representando un concepto fundamental de la carrera.

## ✨ Características Principales

### 🗺️ **Mapa del Mundo Épico**
- **Torre ICESI Central**: Réplica pixel art de la torre auténtica con reloj funcional
- **4 Biomas Únicos**: Jardín, Cueva, Pantano y Pico Ventoso
- **Caminos Interactivos**: Se desbloquean progresivamente con efectos dorados
- **Avatar Dinámico**: Andy se mueve automáticamente mostrando tu progreso

### 🎓 **Tutorial Educativo Interactivo**
- **4 pasos narrativos** que explican la aventura tecnológica
- **Navegación intuitiva** con dots clickeables y botones
- **Highlight automático** de la primera misión
- **Integración perfecta** con la temática de Ingeniería de Sistemas

### 🏆 **Sistema de Gamificación Completo**
- **⭐ Estrellas**: Por rendimiento en niveles
- **🏆 Medallas**: Por logros específicos  
- **🎯 Puntos**: Puntuación acumulada
- **Animaciones de recompensas**: Efectos visuales al ganar premios

### 🖥️ **Temática Tecnológica**
- **Servidores flotantes** con luces LED animadas
- **Cables de datos** con flujo de información
- **Símbolos de programación** (`</>`, `{}`, `SQL`, `01`)
- **Nubes pixeladas** estilo retro-tech

### 🎵 **Audio Dinámico**
- **Música adaptativa** según el contexto del juego
- **Efectos específicos** para tutorial y recompensas
- **Chiptune procedural** para máxima inmersión

## 🎯 Niveles y Biomas

### 🌻 Nivel 1: Jardín de Redes (Paloma)
- **Concepto**: Redes y Comunicaciones
- **Bioma**: Jardín tropical con flores animadas
- **Objetivo**: Rescatar a la Paloma de su casa en el jardín
- **Mecánica**: Plataformas verdes con enemigos básicos

### 🌑 Nivel 2: Cueva de Sistemas (Murciélago)  
- **Concepto**: Sistemas Operativos
- **Bioma**: Cueva oscura con rocas y entrada misteriosa
- **Objetivo**: Liberar al Murciélago de las profundidades
- **Mecánica**: Navegación en oscuridad con obstáculos

### 💧 Nivel 3: Pantano de Datos (Iguana)
- **Concepto**: Bases de Datos
- **Bioma**: Pantano con agua ondulante y plantas acuáticas
- **Objetivo**: Salvar a la Iguana del pantano de información
- **Mecánica**: Organización de datos en ambiente acuático

### 🌪️ Nivel 4: Pico de Software (Zarigüeya)
- **Concepto**: Ingeniería de Software  
- **Bioma**: Cima ventosa con nubes y plataformas flotantes
- **Objetivo**: Rescatar a la Zarigüeya de las alturas
- **Mecánica**: Plataformas móviles con vientos cambiantes

### 🏛️ Torre Final: Rescate de Andy
- **Ubicación**: Torre ICESI Central
- **Objetivo**: Confrontar al villano y rescatar a Andy
- **Mecánica**: Batalla final épica

## 🎮 Controles

### 💻 Desktop (Optimizado)
- **Flechas ←/→**: Moverse horizontalmente
- **Barra Espaciadora**: Saltar/Interactuar
- **Click**: Seleccionar niveles y navegación
- **Hover**: Efectos visuales mejorados

### 📱 Móvil (Responsive)
- **Deslizar ←/→**: Moverse
- **Deslizar ↑**: Saltar  
- **Tap**: Interactuar y seleccionar
- **Touch optimizado** para pantallas pequeñas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: +60 animaciones personalizadas
- **JavaScript ES6+**: Lógica de juego orientada a objetos
- **Pixel Art CSS**: Arte completamente vectorial

### Audio
- **Web Audio API**: Música chiptune procedural
- **Efectos dinámicos**: Sonidos contextuales
- **Control de volumen**: Música y SFX independientes

### Características Técnicas
- **Responsive Design**: Mobile-first approach
- **Touch Events**: Controles táctiles nativos
- **Performance**: Animaciones optimizadas con CSS
- **Accesibilidad**: Contraste mejorado y navegación clara

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ **Chrome/Chromium** 90+ (recomendado)
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

### Dispositivos
- ✅ **Desktop**: Windows, macOS, Linux
- ✅ **Móvil**: iOS 14+, Android 10+
- ✅ **Tablet**: iPad, Android tablets

## 🚀 Instalación y Uso

### Método 1: Servidor Local (Recomendado)
```bash
# Navegar al directorio del proyecto
cd "icesi interactiva"

# Iniciar servidor HTTP simple
python -m http.server 8000

# Abrir en navegador
# http://localhost:8000
```

### Método 2: Directo
1. Descargar/clonar repositorio
2. Abrir `index.html` en navegador
3. ¡Disfrutar del juego!

**Nota**: Algunas características de audio requieren servidor local.

## 🎵 Sistema de Audio

### Música Adaptativa
- **Portada**: Melodía épica de bienvenida
- **Tutorial**: Música educativa suave
- **Mapa**: Tema de aventura con elementos tech
- **Niveles**: Soundtracks específicos por bioma
- **Victoria**: Fanfarrias de celebración

### Efectos de Sonido
- **Navegación**: Clicks y transiciones
- **Gameplay**: Saltos, colectas, impactos
- **Recompensas**: Sonidos de logros y puntos
- **Ambiente**: Efectos ambientales por bioma

## 🏆 Sistema de Puntuación y Recompensas

### Métricas de Rendimiento
- **⭐ Estrellas**: 1-3 por nivel según rendimiento
- **🏆 Medallas**: Logros específicos y desafíos
- **🎯 Puntos**: Sistema acumulativo detallado

### Cálculo de Puntos
- **Rescate exitoso**: +100 puntos base
- **Bonus de velocidad**: +50 puntos adicionales
- **Coleccionables**: +10 puntos por item
- **Combo perfecto**: Multiplicadores especiales

### Rangos de Ingeniero ICESI
- **🥇 Ingeniero Legendario**: 1000+ puntos
- **🥈 Arquitecto de Sistemas**: 750+ puntos  
- **🥉 Desarrollador Senior**: 500+ puntos
- **🎖️ Ingeniero de Sistemas**: 250+ puntos
- **📚 Estudiante Prometedor**: <250 puntos

## 🎓 Objetivos Educativos

### Conceptos Técnicos
- **Redes y Comunicaciones**: Nivel Jardín
- **Sistemas Operativos**: Nivel Cueva
- **Bases de Datos**: Nivel Pantano
- **Ingeniería de Software**: Nivel Pico

### Habilidades Desarrolladas
- **Resolución de problemas**: Navegación por obstáculos
- **Pensamiento lógico**: Mecánicas de plataformas
- **Persistencia**: Sistema de progreso incremental
- **Trabajo bajo presión**: Elementos de tiempo y desafío

### Conexión con ICESI
- **Torre auténtica**: Representación fiel del campus
- **Identidad visual**: Colores y elementos institucionales
- **Mensaje educativo**: Promoción del programa académico
- **Call to action**: Enlace directo al programa

## 🎨 Arte y Diseño

### Estilo Visual
- **Pixel Art**: Estética retro-gaming coherente
- **Paleta de colores**: Verde ICESI + acentos tecnológicos
- **Animaciones**: 60+ efectos CSS personalizados
- **Tipografía**: Press Start 2P para autenticidad

### Elementos Únicos
- **Torre ICESI**: Réplica pixel perfect con reloj funcional
- **Biomas temáticos**: Cada nivel con identidad visual propia
- **Efectos tech**: Servidores, cables y símbolos de programación
- **UI cohesiva**: Botones y elementos con estilo unificado

## 🔗 Enlaces Importantes

- **🎓 Ingeniería de Sistemas ICESI**: [Ver Programa](https://www.icesi.edu.co/programas/ingenieria-de-sistemas/)
- **🏛️ Universidad Icesi**: [Sitio Oficial](https://www.icesi.edu.co/)
- **📧 Contacto Académico**: [Información del Programa](https://www.icesi.edu.co/contacto/)

## 🚀 Características Técnicas Avanzadas

### Rendimiento
- **Animaciones GPU**: Hardware acceleration para fluidez
- **Lazy Loading**: Carga optimizada de recursos
- **Memory Management**: Gestión eficiente de objetos de juego
- **60 FPS**: Experiencia de juego suave

### Accesibilidad
- **Contraste AA**: Cumple estándares WCAG
- **Navegación por teclado**: Soporte completo
- **Texto legible**: Tamaños y contrastes optimizados
- **Feedback visual**: Indicadores claros de estado

### Arquitectura del Código
- **Patrón MVC**: Separación clara de responsabilidades
- **Programación orientada a objetos**: Código mantenible
- **Event-driven**: Sistema de eventos robusto
- **Modular**: Componentes reutilizables

## 📄 Licencia y Derechos

Desarrollado específicamente para la **Universidad Icesi** como herramienta de marketing educativo y promoción del programa de Ingeniería de Sistemas.

**© 2024 Universidad Icesi - Todos los derechos reservados**

## 🤝 Contribuciones y Soporte

Para sugerencias, mejoras o reportar problemas:
- **Contacto**: Programa de Ingeniería de Sistemas ICESI
- **Propósito**: Herramienta educativa y promocional
- **Audiencia**: Futuros estudiantes de ingeniería

---

## 🎮 ¡Comienza tu Aventura!

**¿Tienes lo necesario para ser un Ingeniero de Sistemas de ICESI?**

🚀 Rescata a Andy y sus amigos  
🏛️ Explora la Torre ICESI  
🎓 Descubre tu potencial en ingeniería  
💚 ¡Únete a la familia ICESI!

**[▶️ JUGAR AHORA](index.html)**

---

*Desarrollado con 💚 para la comunidad ICESI*