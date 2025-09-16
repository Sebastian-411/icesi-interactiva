import React from 'react';

const Frame1 = () => {
  return (
    <div className="story-frame active" data-frame="1">
      <div className="frame-background campus-day">
        <div className="icesi-campus-peaceful">
          <div className="campus-buildings"></div>
          <div className="campus-trees"></div>
        </div>
      </div>
      <div className="frame-content">
        <div className="andy-and-friends">
          <div className="andy-happy">🐿️</div>
          <div className="friend pigeon">🕊️</div>
          <div className="friend bat">🦇</div>
          <div className="friend lizard">🦎</div>
          <div className="friend possum">🐾</div>
        </div>
        <div className="story-text">Todo parecía normal en ICESI...</div>
      </div>
    </div>
  );
};

export default Frame1;