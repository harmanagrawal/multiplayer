import React from 'react'

function initializeBoard(rows, cols, whiteOccupied, blackOccupied) {
    const newBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
  
    whiteOccupied.forEach(([row, col]) => {
      if (row < rows && col < cols) {
        newBoard[row][col] = 'white';
      }
    });
  
    blackOccupied.forEach(([row, col]) => {
      if (row < rows && col < cols) {
        newBoard[row][col] = 'black';
      }
    });
  
    return newBoard;
}

export default initializeBoard

/*function initializeBoard(rows, cols, whiteOccupied, blackOccupied) {
    const newBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
    whiteOccupied.forEach(([row, col]) => newBoard[row][col] = 'white');
    blackOccupied.forEach(([row, col]) => newBoard[row][col] = 'black');
    return newBoard;
  }*/