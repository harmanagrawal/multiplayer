import React, { useState } from 'react';
import './TestConfig.css';

function TestConfig() {
    const [testRows, setTestRows] = useState(5); 
    const [testCols, setTestCols] = useState(5); 
    const [whitePieces, setWhitePieces] = useState(1);
    const [blackPieces, setBlackPieces] = useState(1);
    const [board, setBoard] = useState(initializeGrid(5, 5));
    const [selectedPiece, setSelectedPiece] = useState('white');
    const [remainingPieces, setRemainingPieces] = useState({ white: 1, black: 1 });
    const [isTerminal, setIsTerminal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    function initializeGrid(testRows, testCols) {
        const newBoard = Array.from({ length: testRows }, () => Array(testCols).fill(null));
        return newBoard;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const totalCells = testRows * testCols;
        if (whitePieces + blackPieces > totalCells) {
            alert('Number of pieces cannot exceed total grid cells.');
            return;
        }
        setBoard(initializeGrid(testRows, testCols));
        setRemainingPieces({ white: whitePieces, black: blackPieces });
    };

    const handleCellClick = (row, col) => {
        if (isEditing) {
            // Remove a piece in edit mode
            const currentPiece = board[row][col];
            if (currentPiece) {
                const updatedBoard = board.map((r, rowIndex) =>
                    r.map((cell, colIndex) =>
                        rowIndex === row && colIndex === col ? null : cell
                    )
                );

                setBoard(updatedBoard);
                setRemainingPieces((prev) => ({
                    ...prev,
                    [currentPiece]: prev[currentPiece] + 1,
                }));
            }
        } else {
            // Add a piece in placement mode
            if (board[row][col]) {
                alert('This cell is already occupied.');
                return;
            }

            if (remainingPieces[selectedPiece] <= 0) {
                alert(`No ${selectedPiece} pieces remaining.`);
                return;
            }

            const updatedBoard = board.map((r, rowIndex) =>
                r.map((cell, colIndex) =>
                    rowIndex === row && colIndex === col ? selectedPiece : cell
                )
            );

            setBoard(updatedBoard);
            setRemainingPieces((prev) => ({
                ...prev,
                [selectedPiece]: prev[selectedPiece] - 1,
            }));
        }
    };

    function calculateScore(whiteOccupied, blackOccupied) {
        if (whiteOccupied.length !== whitePieces || blackOccupied.length !== blackPieces) {
            return Infinity;
        }

        const dist = (piece1, piece2) => {
            return (Math.abs(piece1[0] - piece2[0]) + 1) * (Math.abs(piece1[1] - piece2[1]) + 1);
        };

        let score = 0
        
        for(let i = 0; i < whitePieces; i++) {
            for (let j = 0; j < blackPieces; j++) {
                score += dist(whiteOccupied[i], blackOccupied[j])
            }
        }

        return score;
    }

    function checkGameEnd(occupied, opponentOccupied) {
        const currentScore = calculateScore(occupied, opponentOccupied);
        const newBoard = Array.from({ length: testRows }, () => Array(testCols).fill(null));
        occupied.forEach(([row, col]) => {
            newBoard[row][col] = 1;
        });

        opponentOccupied.forEach(([row, col]) => {
            newBoard[row][col] = 1;
        });

        for (let i = 0; i < occupied.length; i++) {
            for (let row = 0; row < testRows; row++) {
                for (let col = 0; col < testCols; col++) {
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

        for (let i = 0; i < opponentOccupied.length; i++) {
            for (let row = 0; row < testRows; row++) {
                for (let col = 0; col < testCols; col++) {
                    if (!newBoard[row][col]) {  // Check if this position is empty
                        const potentialOccupied = [...opponentOccupied];
                        potentialOccupied[i] = [row, col];
                        const potentialScore = calculateScore(occupied, potentialOccupied);
                        if (potentialScore < currentScore) {
                            return false; // A valid move exists
                        }
                    }
                }
            }
        }

        return true; // No valid moves left
    }

    const handleCheckConfiguration = () => {
        // Calculate whiteOccupied and blackOccupied
        const whiteOccupied = [];
        const blackOccupied = [];
    
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 'white') {
                    whiteOccupied.push([rowIndex, colIndex]); // Add coordinates of white pieces
                } else if (cell === 'black') {
                    blackOccupied.push([rowIndex, colIndex]); // Add coordinates of black pieces
                }
            });
        });
    
        // Call checkGameEnd with the occupied cells
        const result = checkGameEnd(whiteOccupied, blackOccupied);
        setIsTerminal(result); // Update state with the result
    };

    return (
        <div className="test-config-container">
            <form onSubmit={handleSubmit} className="config-form">
                <label>
                    Rows:
                    <input
                        type="number"
                        min="1"
                        value={testRows}
                        onChange={(e) => setTestRows(parseInt(e.target.value))}
                    />
                </label>
                <label>
                    Columns:
                    <input
                        type="number"
                        min="1"
                        value={testCols}
                        onChange={(e) => setTestCols(parseInt(e.target.value))}
                    />
                    </label>
                <label>
                    White Pieces:
                    <input
                        type="number"
                        min="0"
                        value={whitePieces}
                        onChange={(e) => setWhitePieces(parseInt(e.target.value))}
                    />
                </label>
                <label>
                    Black Pieces:
                    <input
                        type="number"
                        min="0"
                        value={blackPieces}
                        onChange={(e) => setBlackPieces(parseInt(e.target.value))}
                    />
                </label>
                <button type="submit">Generate Grid</button>
            </form>

            <div className="piece-selector">
                <button
                    className={selectedPiece === 'white' ? 'selected' : ''}
                    onClick={() => setSelectedPiece('white')}
                >
                    White Piece
                </button>
                <button
                    className={selectedPiece === 'black' ? 'selected' : ''}
                    onClick={() => setSelectedPiece('black')}
                >
                    Black Piece
                </button>
            </div>

            <div className="grid-container">
                {board.map((row, rowIndex) => (
                    <div className="grid-row" key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <div
                                className={`grid-cell ${cell}`}
                                key={colIndex}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {cell === 'white'}
                                {cell === 'black'}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="remaining-pieces">
                <p>Remaining White Pieces: {remainingPieces.white}</p>
                <p>Remaining Black Pieces: {remainingPieces.black}</p>
            </div>

            {(
                <div className="action-buttons">
                    <button
                        className="check-config-button"
                        onClick={handleCheckConfiguration}
                    >
                        Check Configuration
                    </button>
                    <button
                        className="edit-config-button"
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        {isEditing ? 'Place pieces again' : 'Edit Configuration'}
                    </button>
                </div>
            )}

            {isEditing == true && (
                <p>Select pieces to remove</p>
            )}

            {isTerminal !== null && (
                <p className="terminal-result">
                    Configuration is {isTerminal ? 'Terminal' : 'Not Terminal'}.
                </p>
            )}

        </div>
    );
}


export default TestConfig;
