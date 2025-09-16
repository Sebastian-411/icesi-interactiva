import React from 'react';
import { useGame } from '../../context/GameContext';

const FinalBossScreen = ({ isActive }) => {
  const { state, showScreen } = useGame();

  return (
    <div id="final-boss-screen" className={`screen ${isActive ? 'active' : ''}`}>
      <div className="boss-container">
        <h2>Nivel 5 - La Batalla contra EL GLITCH</h2>
        <div className="andy-profile" id="andy-profile">
          <div className="profile-header">
            <div className="profile-pic">🐿️</div>
            <div className="profile-info">
              <h3>Andy la Ardilla</h3>
              <p>@andy_icesi</p>
            </div>
          </div>
          <div className="profile-content">
            <div className="bio-section">
              <h4>Biografía</h4>
              <div className="bio-text" id="bio-text">
                Estudiante de Ingeniería de Sistemas en la Universidad Icesi. 
                Amante de la tecnología y los algoritmos.
              </div>
            </div>
            <div className="close-friends-section">
              <h4>Close Friends</h4>
              <div className="friends-grid" id="friends-grid">
                {state.completedLevels.map((levelId, index) => {
                  const friendData = state.levelData[levelId];
                  return (
                    <div key={levelId} className="friend-slot filled">
                      <div className="friend-avatar">{friendData.friend === 'pigeon' ? '🕊️' : 
                                                   friendData.friend === 'bat' ? '🦇' :
                                                   friendData.friend === 'lizard' ? '🦎' :
                                                   friendData.friend === 'possum' ? '🐾' : '🐿️'}</div>
                      <div className="friend-name">{friendData.friendName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="boss-hud">
          <div className="glitch-health">
            <span>El Glitch:</span>
            <div className="health-bar">
              <div className="health-fill" id="glitch-health" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalBossScreen;
