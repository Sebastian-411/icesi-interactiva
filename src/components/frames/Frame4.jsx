import React from 'react';

const Frame4 = () => {
  return (
    <div className="story-frame active" data-frame="4">
      <div className="frame-background clock-closeup">
        <div className="giant-clock">
          <div className="clock-face"></div>
          <div className="clock-hands-fast"></div>
          <div className="tick-tock-effect">TIC TAC</div>
        </div>
      </div>
      <div className="frame-content">
        <div className="story-text urgent">El tiempo corre... si no los rescatas, será demasiado tarde.</div>
      </div>
    </div>
  );
};

export default Frame4;