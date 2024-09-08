import React from 'react';
import terminal1 from './terminal1.png';
import terminal2 from './terminal2.png';
import terminal3 from './terminal3.png';
import terminal4 from './terminal4.png';
import './Terminal.css';

function Terminal() {
  return (
    <div className="howtoplay-container">
      <p className="intro-text">
        The following are the terminal positions of the game. They can help you get a sense of where you should steer the board towards 
      </p>
      <div className="image-container">
        <img src={terminal1} alt="terminal-position1" className="game-image"/>
        <p className="image-caption">Terminal position</p>
      </div>
      <p className="details">
        This is a type of terminal. This pattern can be present in a bigger form as well, shown in the following image.
      </p>
      <div className="image-container">
        <img src={terminal2} alt="terminal-position2" className="game-image"/>
        <p className="image-caption">Variation of the previous position</p>
      </div>
      <p className="details">
        There are two other type of game positions, illustrated below:
      </p>
      <div className="image-container">
        <img src={terminal3} alt="terminal-position3" className="game-image"/>
      </div>
      <div className="image-container">
        <img src={terminal4} alt="terminal-position4" className="game-image"/>
      </div>
    </div>
  );
}

export default Terminal;
