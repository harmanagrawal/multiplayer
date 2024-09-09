import React, { useState, useEffect } from 'react';
import '../../App.css';
import './Dashboard.css';
import Tiles from '../../tiles/tiles';
import { useLocation } from 'react-router-dom';

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
    const [hoveredTile, setHoveredTile] = useState(null);
    const [hoveredTileScore, setHoveredTileScore] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const maxDimension = 370;
        const squareSize = Math.min(maxDimension / rows, maxDimension / cols);
        setSquareDimensions(squareSize, squareSize);

        // Check if there's any state passed from the Hints component or any other component
        if (location.state) {
            const { board, whiteOccupied, blackOccupied, currentPlayer, rows, cols } = location.state;
            setBoard(board);
            setWhiteOccupied(whiteOccupied);
            setBlackOccupied(blackOccupied);
            setCurrentPlayer(currentPlayer);
            setRows(rows);
            setCols(cols);
            setCurrentScore(calculateScore(whiteOccupied, blackOccupied));
        } else {
            const newBoard = initializeBoard(rows, cols);
            const initialScore = calculateScore(whiteOccupied, blackOccupied);
            setCurrentScore(initialScore);  // Ensure score is set at the start of the game
            setBoard(newBoard);
        }
    }, []);

    const handleRowsChange = (e) => {
        const newRows = Number(e.target.value);
        setRows(newRows);
        adjustBoardSize(newRows, cols);  // Adjust the board when rows change
    };
    
    const handleColsChange = (e) => {
        const newCols = Number(e.target.value);
        setCols(newCols);
        adjustBoardSize(rows, newCols);  // Adjust the board when columns change
    };

    const adjustBoardSize = (newRows, newCols) => {
        const newBoard = initializeBoard(newRows, newCols); // Initialize a fresh board with new size
        const updatedWhiteOccupied = adjustOccupiedPieces(whiteOccupied, newRows, newCols);
        const updatedBlackOccupied = adjustOccupiedPieces(blackOccupied, newRows, newCols);
    
        setWhiteOccupied(updatedWhiteOccupied);
        setBlackOccupied(updatedBlackOccupied);
        setBoard(newBoard);
        setCurrentScore(calculateScore(updatedWhiteOccupied, updatedBlackOccupied));
    };
    

    const adjustOccupiedPieces = (occupied, newRows, newCols) => {
        return occupied.map(([row, col]) => {
            const newRow = Math.min(row, newRows - 1);
            const newCol = Math.min(col, newCols - 1);
            return [newRow, newCol];
        });
    };
    

    const handleTileClick = (row, col) => {
        setErrorMessage('');

        if (selectedPiece) {
            if (!board[row][col]) {
                const { row: prevRow, col: prevCol, piece } = selectedPiece;

                // Clone current state to allow rollback
                const prevBoard = board.map(row => row.slice());

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

    const handleTileHover = (row, col) => {
        if (selectedPiece && !board[row][col]) {
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
        }
        return null;
    };
    
    
    const handleTileHoverLeave = () => {
        setHoveredTile(null);
        setHoveredTileScore(null);
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

    const initializeBoard = (newRows, newCols) => {
        const newBoard = Array.from({ length: newRows }, () => Array(newCols).fill(null));

        const whiteOccupiedAdjusted = adjustOccupiedPieces([[0, 0], [1, 0]], newRows, newCols);
        const blackOccupiedAdjusted = adjustOccupiedPieces([[newRows - 1, newCols - 1], [newRows - 2, newCols - 1]], newRows, newCols);
    
        whiteOccupiedAdjusted.forEach(([row, col]) => {
            if (row < newRows && col < newCols) { // Ensure the row and col are within the board bounds
                newBoard[row][col] = 'white';
            }
        });

        blackOccupiedAdjusted.forEach(([row, col]) => {
            if (row < newRows && col < newCols) { // Ensure the row and col are within the board bounds
                newBoard[row][col] = 'black';
            }
        });
    
        setWhiteOccupied(whiteOccupiedAdjusted);
        setBlackOccupied(blackOccupiedAdjusted);
        setCurrentPlayer('white');
    
        return newBoard;
    };
    

    function updateOccupied(occupiedArray, prevRow, prevCol, newRow, newCol) {
        const updatedArray = occupiedArray.filter(
            (pos) => !(pos[0] === prevRow && pos[1] === prevCol)
        );
        updatedArray.push([newRow, newCol]);
        return updatedArray;
    }

    function resetGame() {
        const initialWhiteOccupied = [[0, 0], [1, 0]];
        const initialBlackOccupied = [[rows - 1, cols - 1], [rows - 2, cols - 1]];

        setWhiteOccupied(initialWhiteOccupied);
        setBlackOccupied(initialBlackOccupied);
    
        const newBoard = initializeBoard(rows, cols);
        setBoard(newBoard);

        const initialScore = calculateScore(initialWhiteOccupied, initialBlackOccupied);
        setCurrentScore(initialScore);  // Set the initial score for the reset game
    
        setSelectedPiece(null);
        setCurrentPlayer('white');
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
                            <input type="number" value={rows} onChange={handleRowsChange} min="2" />
                        </label>
                        <label>
                            Columns:
                            <input type="number" value={cols} onChange={handleColsChange} min="2" />
                        </label>
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
                                        onMouseEnter={() => handleTileHover(rowIndex, colIndex)} // Only hover event triggers
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
