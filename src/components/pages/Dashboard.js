// src/components/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import '../../App.css';
import './Dashboard.css';
import Tiles from '../../tiles/tiles';
import { useLocation } from 'react-router-dom';

function Dashboard({
    rows,
    cols,
    pieces,
    board,
    setBoard,
    whiteOccupied,
    setWhiteOccupied,
    blackOccupied,
    setBlackOccupied,
    currentPlayer,
    setCurrentPlayer,
    setRows,
    setCols,
    setPieces
}) {
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentScore, setCurrentScore] = useState(Infinity);
    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [hoveredTile, setHoveredTile] = useState(null);
    const [hoveredTileScore, setHoveredTileScore] = useState(null);
    const [switchPieces, setSwitchPieces] = useState(false);
    const location = useLocation();

    // Temporary state for input fields
    const [tempRows, setTempRows] = useState(rows);
    const [tempCols, setTempCols] = useState(cols);
    const [tempPieces, setTempPieces] = useState(pieces)

    useEffect(() => {
        const maxDimension = 370;
        const squareSize = Math.min(maxDimension / rows, maxDimension / cols);
        setSquareDimensions(squareSize, squareSize);
    }, [rows, cols]);

    useEffect(() => {
        setCurrentScore(calculateScore(whiteOccupied, blackOccupied));
    }, [whiteOccupied, blackOccupied]);

    const handleRowsChange = (e) => {
        setTempRows(Number(e.target.value));
    };
    
    const handleColsChange = (e) => {
        setTempCols(Number(e.target.value));
    }; 
    
    const handlePiecesChange = (e) => {
        setTempPieces(Number(e.target.value));
    }; 

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedPiece(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleApplyChanges = () => {
        if (tempRows < 2 || tempCols < 2) {
            setErrorMessage('Rows and Columns must be at least 2.');
            return;
        }
        
        setErrorMessage('');
        setRows(tempRows);
        setCols(tempCols);
        setPieces(tempPieces);

        const newBoard = Array.from({ length: tempRows }, () => Array(tempCols).fill(null));
        const initialWhiteOccupied = [[0, 0], [1, 0]];
        const initialBlackOccupied = [[tempRows - 1, tempCols - 1], [tempRows - 2, tempCols - 1]];
        initialWhiteOccupied.forEach(([row, col]) => {
            newBoard[row][col] = 'white';
        });
        initialBlackOccupied.forEach(([row, col]) => {
            newBoard[row][col] = 'black';
        });
        setBoard(newBoard);
        setWhiteOccupied(initialWhiteOccupied);
        setBlackOccupied(initialBlackOccupied);
        setCurrentScore(calculateScore(initialWhiteOccupied, initialBlackOccupied));
        setSelectedPiece(null);
        setCurrentPlayer('white');
        setShowEndGameModal(false);
    };

    const handleTileClick = (row, col) => {
        setErrorMessage('');
    
        if (selectedPiece) {
            const { row: prevRow, col: prevCol, piece } = selectedPiece;
            if (!board[row][col]) {
                const prevBoard = board.map(r => r.slice());
    
                let updatedOccupied = currentPlayer === 'white'
                    ? updateOccupied(whiteOccupied, prevRow, prevCol, row, col)
                    : updateOccupied(blackOccupied, prevRow, prevCol, row, col);
    
                const newBoard = board.map(r => r.slice());
                newBoard[prevRow][prevCol] = null;
                newBoard[row][col] = piece;
                setBoard(newBoard);
    
                const newScore = calculateScore(updatedOccupied, currentPlayer === 'white' ? blackOccupied : whiteOccupied);
                if (newScore >= currentScore) {
                    setErrorMessage('Invalid move. Score does not decrease.');
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
                const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
                const opponentOccupied = nextPlayer === 'white' ? whiteOccupied : blackOccupied;
                const gameEnded = checkGameEnd(opponentOccupied, updatedOccupied);
    
                if (gameEnded) {
                    setErrorMessage(`${currentPlayer === 'white' ? 'White' : 'Black'} player wins!`);
                    setShowEndGameModal(true);
                } else {
                    setCurrentPlayer(nextPlayer);
                }
            } else if(board[row][col] == currentPlayer){
                const newBoard = board.map(r => r.slice());
                const clickedPiece = board[row][col];

                newBoard[prevRow][prevCol] = piece;
                setSelectedPiece({ row, col, piece: clickedPiece });
                setSwitchPieces(false);
            } else{
                setErrorMessage('This position is already occupied');
            }
        } else if (board[row][col] && board[row][col] === currentPlayer) {
            setSelectedPiece({ row, col, piece: board[row][col] });
    
            const newBoard = board.map(r => r.slice());
            newBoard[row][col] = null;
            setBoard(newBoard);
        } else if (board[row][col]) {
            setErrorMessage('Not your turn');
        } else {
            setErrorMessage('There is no piece here');
        }
    };    

    const handleTileHover = (row, col) => {
        if (selectedPiece && !board[row][col]) {
            setSwitchPieces(false);
            const { row: prevRow, col: prevCol } = selectedPiece;
            const potentialOccupied = currentPlayer === 'white'
                ? updateOccupied(whiteOccupied, prevRow, prevCol, row, col)
                : updateOccupied(blackOccupied, prevRow, prevCol, row, col);
    
            const potentialScore = calculateScore(
                potentialOccupied,
                currentPlayer === 'white' ? blackOccupied : whiteOccupied
            );
    
            setHoveredTile([row, col]);
            setHoveredTileScore(potentialScore);
    
            // Compare potential score with current score
            const isBetterMove = potentialScore < currentScore;
            setHoveredTileScore(potentialScore);
            return isBetterMove;
        } else if (selectedPiece && board[row][col] == currentPlayer){
            setHoveredTile([row, col]);
            setSwitchPieces(true);
        } else {
            setSwitchPieces(false);
            return null;
        }
    };
    
    
    const handleTileHoverLeave = () => {
        setHoveredTile(null);
        setHoveredTileScore(null);
        setSwitchPieces(false);
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
        const newBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
        occupied.forEach(([row, col]) => {
            newBoard[row][col] = 1;
        });

        opponentOccupied.forEach(([row, col]) => {
            newBoard[row][col] = 1;
        });

        for (let i = 0; i < occupied.length; i++) {
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (!newBoard[row][col]) {  // Check if this position is empty
                        const potentialOccupied = [...occupied];
                        potentialOccupied[i] = [row, col];
                        const potentialScore = calculateScore(potentialOccupied, opponentOccupied);
                        if (potentialScore < currentScore) {
                            return false; // A valid move exists
                        }
                    }
                }
            }
        }

        return true; // No valid moves left
    }

    function setSquareDimensions(width, height) {
        document.documentElement.style.setProperty('--square-width', width + 'px');
        document.documentElement.style.setProperty('--square-height', height + 'px');
    }

    function updateOccupied(occupiedArray, prevRow, prevCol, newRow, newCol) {
        const updatedArray = occupiedArray.filter(
            (pos) => !(pos[0] === prevRow && pos[1] === prevCol)
        );
        updatedArray.push([newRow, newCol]);
        return updatedArray;
    }

    const resetGame = () => {
        const initialWhiteOccupied = [[0, 0], [1, 0]];
        const initialBlackOccupied = [[rows - 1, cols - 1], [rows - 2, cols - 1]];
      
        setWhiteOccupied(initialWhiteOccupied);
        setBlackOccupied(initialBlackOccupied);
      
        setCurrentScore(calculateScore(initialWhiteOccupied, initialBlackOccupied));
        setSelectedPiece(null);
        setCurrentPlayer('white');
        setErrorMessage('');
        setShowEndGameModal(false);
    };

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
                            <input
                                type="number"
                                value={tempRows}
                                onChange={handleRowsChange}
                                min="2"
                            />
                        </label>
                        <label>
                            Columns:
                            <input
                                type="number"
                                value={tempCols}
                                onChange={handleColsChange}
                                min="2"
                            />
                        </label>
                        <label>
                            Pieces:
                            <input
                                type="number"
                                value={tempPieces}
                                onChange={handlePiecesChange}
                                min="1"
                            />
                        </label>
                        <button onClick={handleApplyChanges}>Enter</button>
                    </div>
                    <div className='tileswrap'
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${cols}, var(--square-width))`,
                            gap: '10px'
                        }}>
                        {board.map((row, rowIndex) =>
                            row.map((tile, colIndex) => {
                                const isHovered = hoveredTile && hoveredTile[0] === rowIndex && hoveredTile[1] === colIndex;
                                const isWorseMove = hoveredTileScore !== null && hoveredTileScore >= currentScore;
                                
                                return (
                                    <Tiles
                                        key={`${rowIndex}-${colIndex}`}
                                        value={tile}
                                        onClick={() => handleTileClick(rowIndex, colIndex)}
                                        onMouseEnter={() => handleTileHover(rowIndex, colIndex)}
                                        onMouseLeave={handleTileHoverLeave}
                                        className={`
                                            ${isHovered ? 'hovered-tile' : ''}
                                            ${isHovered && isWorseMove ? 'worse-move' : ''}
                                            ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected-tile' : ''}
                                        `}
                                    />
                                );
                            })
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
            <div className='potential-score'>
                {hoveredTileScore !== null && (
                    <div>
                        Potential Score: {hoveredTileScore}
                    </div>
                )}
                {switchPieces && (
                    <div> Switch </div>
                )}
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