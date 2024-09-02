import React from 'react'

function Howtoplay() {
  return (
    <div>
        <h1><center>How to play?</center></h1>
        <p>QuadroCount is a two-player partisan game</p>
        They practice alternate play and aim to minimise the
central game score in every move
Game Board: The Game Board is a grid of any size. The minimum size of the board must be 4 to accommodate
all the pieces in the game
The pieces: Both players L and R have two pieces they can move. For convention, assume L moves the white
pieces and R moves the black pieces. Initially, the pieces can be placed anywhere, but are places near the edges in
the following manner in standard play:
Figure 1: Initial game layout Figure 2: Score calculation
The score: The score is defined as the sum of the areas of the four rectangles formed by the considering one white
piece and one black piece as the diagonal edges
Moves: A player, at his or her turn must make a move that decreases the characteristic score of the game by at
least one. If they are unable to do so, the player who made the last turn wins
    </div>
  )
}

export default Howtoplay