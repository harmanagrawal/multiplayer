import React, { useState, useEffect } from 'react';
import '../../App.css';
import './Dashboard.css';
import Tiles from '../../tiles/tiles';
import { useNavigate } from 'react-router-dom';

function Dashboard({
    rows,
    cols,
    board,
    setBoard,
    whiteOccupied,
    setWhiteOccupied,
    blackOccupied,
    setBlackOccupied,
    currentPlayer,
    setCurrentPlayer,
    setRows,
    setCols
}) {
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentScore, setCurrentScore] = useState(Infinity);
    const [showEndGameModal, setShowEndGameModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const maxDimension = 370;
        const squareSize = Math.min(maxDimension / rows, maxDimension / cols);
        setSquareDimensions(squareSize, squareSize);
        setBoard(initializeBoard(rows, cols, whiteOccupied, blackOccupied));
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

                // Clone current state to allow rollback
                const prevBoard = board.map(row => row.slice());
                const prevWhiteOccupied = [...whiteOccupied];
                const prevBlackOccupied = [...blackOccupied];

                let updatedOccupied = currentPlayer === 'white'
                    ? updateOccupied(whiteOccupied, prevRow, prevCol, row, col)
                    : updateOccupied(blackOccupied, prevRow, prevCol, row, col);

                const newBoard = board.map(row => row.slice());
                newBoard[prevRow][prevCol] = null;  // Piece disappears from the original position
                newBoard[row][col] = piece;
                setBoard(newBoard);

                const newScore = calculateScore(updatedOccupied, currentPlayer === 'white' ? blackOccupied : whiteOccupied);
                if (newScore >= currentScore) {
                    setErrorMessage('Invalid move. Score does not decrease.');
                    
                    // Restore previous state
                    prevBoard[prevRow][prevCol] = piece;
                    setBoard(prevBoard);
                    setSelectedPiece(null);
                    return;
                }

                setCurrentScore(newScore);

                if (currentPlayer === 'white') {
                    setWhiteOccupied(updatedOccupied);
                } else {
                    setBlackOccupied(updatedOccupied);
                }

                setSelectedPiece(null);
                setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

                if (checkGameEnd(updatedOccupied, currentPlayer === 'white' ? blackOccupied : whiteOccupied)) {
                    setErrorMessage(`${currentPlayer === 'white' ? 'White' : 'Black'} player wins!`);
                    setShowEndGameModal(true);
                }
            } else {
                setErrorMessage('This position is already occupied');
            }
        } else if (board[row][col] && board[row][col] === currentPlayer) {
            setSelectedPiece({ row, col, piece: board[row][col] });

            const newBoard = board.map(row => row.slice());
            newBoard[row][col] = null;  // Make the selected piece disappear
            setBoard(newBoard);
        } else if (board[row][col]) {
            setErrorMessage('Not your turn');
        } else {
            setErrorMessage('There is no piece here');
        }
    };

    function calculateScore(occupied, opponentOccupied) {
        if (occupied.length !== 2 || opponentOccupied.length !== 2) {
            return Infinity;
        }

        const [w1, w2] = occupied;
        const [b1, b2] = opponentOccupied;

        const dist = (piece1, piece2) => {
            return (Math.abs(piece1[0] - piece2[0]) + 1) * (Math.abs(piece1[1] - piece2[1]) + 1);
        };

        const score = dist(w1, b1) + dist(w1, b2) + dist(w2, b1) + dist(w2, b2);

        return score;
    }

    function checkGameEnd(occupied, opponentOccupied) {
        const currentScore = calculateScore(occupied, opponentOccupied);

        // Loop over all pieces and empty cells to check for valid moves
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!board[i][j]) {
                    for (let k = 0; k < occupied.length; k++) {
                        const tempOccupied = [...occupied];
                        tempOccupied[k] = [i, j];
                        const tempScore = calculateScore(tempOccupied, opponentOccupied);
                        if (tempScore < currentScore) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    function setSquareDimensions(width, height) {
        document.documentElement.style.setProperty('--square-width', width + 'px');
        document.documentElement.style.setProperty('--square-height', height + 'px');
    }

    function initializeBoard(rows, cols) {
        const newBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
        const whiteOccupied = [];
        for (let i = 0; i < 2; i++) {
          whiteOccupied.push([i, 0]); // First column
        }
        whiteOccupied.forEach(([row, col]) => {
          newBoard[row][col] = 'white';
        });
      
        const blackOccupied = [];
        for (let i = 0; i < 2; i++) {
          blackOccupied.push([rows - 1 - i, cols - 1]); // Last column
        }
        blackOccupied.forEach(([row, col]) => {
          newBoard[row][col] = 'black';
        });
      
        return newBoard;
      }
      

    function updateOccupied(occupiedArray, prevRow, prevCol, newRow, newCol) {
        const updatedArray = occupiedArray.filter(
            (pos) => !(pos[0] === prevRow && pos[1] === prevCol)
        );
        updatedArray.push([newRow, newCol]);
        return updatedArray;
    }

    function resetGame() {
        setWhiteOccupied([[0, 0], [1, 0]]);
        setBlackOccupied([[3, 3], [2, 3]]);
        setBoard(initializeBoard(rows, cols, [[0, 0], [1, 0]], [[3, 3], [2, 3]]));
        setSelectedPiece(null);
        setCurrentPlayer('white');
        setCurrentScore(Infinity);
        setErrorMessage('');
        setShowEndGameModal(false);
    }

    const handlePlayAgain = () => {
        resetGame();
    };

    const handleLeaveGame = () => {
        setShowEndGameModal(false);
        // You can add additional logic to navigate away or do something else
    };

    return (
        <div className='dashboard'>
            <div className='main-div'>
                <div>
                    <header className="App-header">
                        <h2>QuadroCount</h2>
                    </header>
                    <div className='moveDetection'>
                        <div className={`white ${currentPlayer === 'white' ? 'current-player' : ''}`}>White</div>
                        <div className={`black ${currentPlayer === 'black' ? 'current-player' : ''}`}>Black</div>
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
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${cols}, var(--square-width))`,
                            gap: '10px'
                        }}>
                        {board.map((row, rowIndex) =>
                            row.map((tile, colIndex) =>
                                <Tiles
                                    key={`${rowIndex}-${colIndex}`}
                                    value={tile}
                                    onClick={() => handleTileClick(rowIndex, colIndex)}
                                    className={selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected-piece' : ''}
                                />
                            )
                        )}
                    </div>
                    <div className='lower-buttons'>
                    <button className='reset-button' onClick={resetGame}>Reset Game</button>
                    </div>
                </div>
            </div>
            <div className='score-error'>
                <div className='score'>Score = {currentScore}</div>
                <div className='error'>{errorMessage}</div>
            </div>
            {showEndGameModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{errorMessage}</h2>
                        <h3>Game Over</h3>
                        <div>
                        <button onClick={handlePlayAgain}>Play Again</button>
                        <button onClick={handleLeaveGame}>Leave</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
