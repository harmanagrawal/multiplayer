import React from 'react';
import './Howtoplay.css';  // Link to the CSS file
import layoutImage from './layout.png';  // Import image for game layout (Figure 1)
import scoreImage from './score.png';    // Import image for score calculation (Figure 2)

function Howtoplay() {
  return (
    <div className="howtoplay-container">
      <h1 className="title"><center>How to play?</center></h1>
      <p className="intro-text">
        QuadroCount is a two-player partisan game. They take alternate turns and aim to minimize the central game 
        score in every move.
      </p>
      <p className="details">
        <strong>Game Board:</strong> The game board is a grid of any size. The minimum size of the board must be 4 to 
        accommodate all the pieces in the game.
      </p>
      <p className="details">
        <strong>The pieces:</strong> Both players L and R have two pieces they can move. For convention, assume L moves the white 
        pieces and R moves the black pieces. Initially, the pieces can be placed anywhere, but are placed near the edges 
        in the following manner in standard play:
      </p>
      <div className="image-container">
        <img src={layoutImage} alt="Initial game layout" className="game-image"/>
        <p className="image-caption">Figure 1: Initial game layout</p>
      </div>
      
      <p className="details">
        <strong>The score:</strong> The score is defined as the sum of the areas of the four rectangles formed by 
        considering one white piece and one black piece as the diagonal edges.
      </p>
      <div className="image-container">
        <img src={scoreImage} alt="Score calculation" className="game-image"/>
        <p className="image-caption">Figure 2: Score calculation</p>
      </div>

      <p className="details">
        <strong>Moves:</strong> A player, on their turn, must make a move that decreases the characteristic score of the game 
        by at least one. If they are unable to do so, the player who made the last turn wins.
      </p>
    </div>
  );
}

export default Howtoplay;
