import React, { useState, useEffect } from 'react';
import './App.css';
import Tiles from './tiles/tiles';

function App() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [board, setBoard] = useState(initializeBoard(4, 4));
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('white');

  useEffect(() => {
    const maxDimension = 400; 
    const squareSize = Math.min(maxDimension / rows, maxDimension / cols);
    setSquareDimensions(squareSize, squareSize);
    setBoard(initializeBoard(rows, cols));
  }, [rows, cols]);

  //let k = 1;
  //let renderGameBoard = Array.from({ length: rows }, (_, i) =>
  //  Array.from({ length: cols }, (_, j) => k++)
  //);


  const handleRowsChange = (e) => {
    setRows(Number(e.target.value));
  };

  const handleColsChange = (e) => {
    setCols(Number(e.target.value));
  };

  const handleTileClick = (row, col) => {
    setErrorMessage('');

    if (selectedPiece) {
      if (!board[row][col]) {
        const newBoard = board.map(row => row.slice());
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        newBoard[row][col] = selectedPiece.piece;
        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      } else {
        setErrorMessage('This position is already occupied');
      }
    } else if (board[row][col] && board[row][col] === currentPlayer) {
      const newBoard = board.map(row => row.slice());
      newBoard[row][col] = null; // Remove the clicked piece
      setBoard(newBoard);
      setSelectedPiece({ row, col, piece: board[row][col] });
    } else if (board[row][col]){
      setErrorMessage('Not your turn');
    } else {
      setErrorMessage('There is no piece here');
    }
  };

  /*const handleTileClick = (row, col) => {
    // Check if a white piece is clicked
    if (whitePieces.some(piece => piece.row === row && piece.col === col)) {
      setWhitePieces(whitePieces.filter(piece => piece.row !== row || piece.col !== col));
    }

    // Check if a black piece is clicked
    if (blackPieces.some(piece => piece.row === row && piece.col === col)) {
      setBlackPieces(blackPieces.filter(piece => piece.row !== row || piece.col !== col));
    }
  };*/

  return (
    <div className="main-div">
      <div>
        <header className="App-header">
          <h1>QuadroCount</h1>
        </header>
        <div className='moveDetection'>
          <div className='left'>Yourself</div>
          <div className='right'>Opponent</div>
        </div>
        <div className='input'>
          <label>
            Rows:  
            <input type="number" value={rows} onChange={handleRowsChange} min="1" />
          </label>
          <label>
            Columns:  
            <input type="number" value={cols} onChange={handleColsChange} min="1" />
          </label>
        </div>
        <div className='tileswrap'
          style= {{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, var(--square-width))`,
            gap: '10px' }}>
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => 
              <Tiles key={`${rowIndex}-${colIndex}`} value={tile} onClick={() => handleTileClick(rowIndex, colIndex)} />
            )
          )}
        </div>
        <div className='error message'>{errorMessage}</div>
      </div>
    </div>
  );

  function setSquareDimensions(width, height) {
    document.documentElement.style.setProperty('--square-width', width + 'px');
    document.documentElement.style.setProperty('--square-height', height + 'px');
  }

  function initializeBoard(rows, cols) {
    const newBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
    // Place two black and two white pieces
    if (rows > 1 && cols > 1) {
      newBoard[0][0] = 'white';
      newBoard[1][0] = 'white';
      newBoard[rows - 1][cols - 1] = 'black';
      newBoard[rows - 2][cols - 1] = 'black';
    }
    return newBoard;
  }
}

export default App;