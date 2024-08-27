import React, { useState, useEffect } from 'react';
import '../../App.css';
import Tiles from '../../tiles/tiles';

function Dashboard() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const whiteOccupied = [];
  const blackOccupied = [];
  const [board, setBoard] = useState(initializeBoard(4, 4));
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [currentScore, setCurrentScore] = useState(calculateScore());
  useEffect(() => {
    const maxDimension = 400; 
    const squareSize = Math.min(maxDimension / rows, maxDimension / cols);
    setSquareDimensions(squareSize, squareSize);
    setBoard(initializeBoard(rows, cols));
  }, [rows, cols]);

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
        const { row: prevRow, col: prevCol, piece } = selectedPiece;
        if (currentPlayer === 'white') {
          updateOccupied(whiteOccupied, prevRow, prevCol, row, col);
        } else if (currentPlayer === 'black') {
          updateOccupied(blackOccupied, prevRow, prevCol, row, col);
        }

        if (calculateScore() >= currentScore) {
          setErrorMessage('Invalid move. Score does not decrease.')
          if (currentPlayer === 'white') {
            updateOccupied(whiteOccupied, row, col, prevRow, prevCol);
          } else if (currentPlayer === 'black') {
            updateOccupied(blackOccupied, row, col, prevRow, prevCol);
          }

          const newBoard = board.map(row => row.slice());
          newBoard[prevRow][prevCol] = currentPlayer; // Remove the clicked piece
          setBoard(newBoard);
          setSelectedPiece(null);

          return;
        }

        setCurrentScore(calculateScore());
        const newBoard = board.map(row => row.slice());
        newBoard[prevRow][prevCol] = null;
        newBoard[row][col] = selectedPiece.piece;
        setBoard(newBoard);

        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      } else {
        setErrorMessage('This position is already occupied');
      }
    } 
    else if (board[row][col] && board[row][col] === currentPlayer) { // removing the piece
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

  function calculateScore() {
    if (whiteOccupied.length !== 2 || blackOccupied.length !== 2) {
      return Infinity;
    }

    const [w1, w2] = whiteOccupied;
    const [b1, b2] = blackOccupied;

    const a = (Math.abs(b1[0] - w1[0]) + 1) * (Math.abs(b1[1] - w1[1]) + 1);
    const b = (Math.abs(b2[0] - w1[0]) + 1) * (Math.abs(b2[1] - w1[1]) + 1);
    const c = (Math.abs(b1[0] - w2[0]) + 1) * (Math.abs(b1[1] - w2[1]) + 1);
    const d = (Math.abs(b2[0] - w2[0]) + 1) * (Math.abs(b2[1] - w2[1]) + 1);

    return a + b + c + d;
  }

  function setSquareDimensions(width, height) {
    document.documentElement.style.setProperty('--square-width', width + 'px');
    document.documentElement.style.setProperty('--square-height', height + 'px');
  }

  function initializeBoard(rows, cols) {
    const newBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
    if (rows > 1 && cols > 1) {
      newBoard[0][0] = 'white';
      newBoard[1][0] = 'white';
      whiteOccupied.push([0, 0]);
      whiteOccupied.push([1, 0]);
      newBoard[rows - 1][cols - 1] = 'black';
      newBoard[rows - 2][cols - 1] = 'black';
      blackOccupied.push([rows - 1, cols - 1]);
      blackOccupied.push([rows - 2, cols - 1]);
    }
    return newBoard;
  }

  function updateOccupied(occupiedArray, prevRow, prevCol, newRow, newCol) {
    for (let i = 0; i < occupiedArray.length; i++) {
      if (occupiedArray[i][0] === prevRow && occupiedArray[i][1] === prevCol) {
        occupiedArray.splice(i, 1);
        break;
      }
    }
    occupiedArray.push([newRow, newCol]);
  }


  return (
    <div className='dashboard'>
      <div className='main-div'>
      <div>
        <header className="App-header">
          <h1>QuadroCount</h1>
        </header>
        <div className='moveDetection'>
          <div className='white'>White</div>
          <div className='black'>Black</div>
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
      </div>
      </div>
      <div className='score-error'>
        <div className='score'>Score = {currentScore}</div>
        <div className='error'>{errorMessage}</div>
      </div>
    </div>
  );
}

export default Dashboard;