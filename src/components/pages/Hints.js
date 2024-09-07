import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';
import './Hints.css';

function Hints() {
    const location = useLocation();
    const navigate = useNavigate();

    // Debugging: Log the location state
    console.log("Location State:", location.state);

    if (!location.state) {
        console.error("No state found, redirecting...");
        navigate('/');
        return null;
    }

    const { board, currentPlayer, whiteOccupied, blackOccupied, rows, cols } = location.state;

    const goBack = () => {
        navigate('/', {
            state: {
                board,
                currentPlayer,
                whiteOccupied,
                blackOccupied,
                rows,
                cols
            }
        });
    };

    const calculateValidMoves = () => {
        const occupied = currentPlayer === 'white' ? whiteOccupied : blackOccupied;
        const opponentOccupied = currentPlayer === 'white' ? blackOccupied : whiteOccupied;
        const validMovesForTile1 = [];
        const validMovesForTile2 = [];

        const currentScore = calculateScore(occupied, opponentOccupied);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!board[i][j]) {
                    // Test the move for tile 1
                    const tempOccupied1 = [...occupied];
                    tempOccupied1[0] = [i, j];
                    const tempScore1 = calculateScore(tempOccupied1, opponentOccupied);
                    if (tempScore1 < currentScore) {
                        validMovesForTile1.push([i, j]);
                    }

                    // Test the move for tile 2
                    const tempOccupied2 = [...occupied];
                    tempOccupied2[1] = [i, j];
                    const tempScore2 = calculateScore(tempOccupied2, opponentOccupied);
                    if (tempScore2 < currentScore) {
                        validMovesForTile2.push([i, j]);
                    }
                }
            }
        }

        return { validMovesForTile1, validMovesForTile2, occupied };
    };

    const calculateScore = (occupied, opponentOccupied) => {
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
    };

    const { validMovesForTile1, validMovesForTile2, occupied } = calculateValidMoves();

    return (
        <div className='hints'>
            <div className='hints-board'
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, var(--square-width))`,
                    gap: '10px'
                }}>
                {board.map((row, rowIndex) =>
                    row.map((tile, colIndex) => {
                        const isValidMoveForTile1 = validMovesForTile1.some(
                            ([validRow, validCol]) => validRow === rowIndex && validCol === colIndex
                        );

                        const isValidMoveForTile2 = validMovesForTile2.some(
                            ([validRow, validCol]) => validRow === rowIndex && validCol === colIndex
                        );

                        const isTile1Position = occupied[0][0] === rowIndex && occupied[0][1] === colIndex;
                        const isTile2Position = occupied[1][0] === rowIndex && occupied[1][1] === colIndex;

                        let tileClass = '';
                        if (isValidMoveForTile1) tileClass = 'valid-move-tile1';
                        if (isValidMoveForTile2) tileClass = 'valid-move-tile2';
                        if (isValidMoveForTile1 && isValidMoveForTile2) tileClass = 'valid-move-both';

                        let pieceClass = '';
                        if (isTile1Position) pieceClass = 'tile1';
                        if (isTile2Position) pieceClass = 'tile2';

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`tile ${tileClass} ${pieceClass}`}
                            >
                                {/* Display the text for Tile 1 or Tile 2 */}
                                {isTile1Position && <span className="tile-text">Tile 1</span>}
                                {isTile2Position && <span className="tile-text">Tile 2</span>}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="hint-key">
                <div>
                    <div className="key-square valid-move-tile1"></div>
                    <span>Valid moves for Tile 1</span>
                </div>
                <div>
                    <div className="key-square valid-move-tile2"></div>
                    <span>Valid moves for Tile 2</span>
                </div>
                <div>
                    <div className="key-square valid-move-both"></div>
                    <span>Valid moves for both</span>
                </div>
            </div>

            <div className="navigation-buttons">
                <button onClick={goBack}>Go Back</button>
            </div>
        </div>
    );
}

export default Hints;
