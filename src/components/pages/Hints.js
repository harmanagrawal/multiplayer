import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';
import './Hints.css'; // Add CSS for the highlighted tiles

function Hints() {
    const location = useLocation();
    const navigate = useNavigate();
    const { board, currentPlayer, whiteOccupied, blackOccupied, rows, cols } = location.state;

    const goBack = () => {
        navigate(-1, { state: location.state }); // Go back to the previous page with the same state
    };


    const calculateValidMoves = () => {
        const occupied = currentPlayer === 'white' ? whiteOccupied : blackOccupied;
        const opponentOccupied = currentPlayer === 'white' ? blackOccupied : whiteOccupied;
        const validMoves = [];

        const currentScore = calculateScore(occupied, opponentOccupied);

        // Loop through all empty tiles and check if moving there reduces the score
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!board[i][j]) {
                    for (let k = 0; k < occupied.length; k++) {
                        const tempOccupied = [...occupied];
                        tempOccupied[k] = [i, j];
                        const tempScore = calculateScore(tempOccupied, opponentOccupied);
                        if (tempScore < currentScore) {
                            validMoves.push([i, j]);
                        }
                    }
                }
            }
        }

        return validMoves;
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

    const validMoves = calculateValidMoves();

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
                        const isValidMove = validMoves.some(
                            ([validRow, validCol]) => validRow === rowIndex && validCol === colIndex
                        );

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`tile ${isValidMove ? 'valid-move' : ''}`}
                            >
                                {tile}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="navigation-buttons">
                <button onClick={goBack}>Go Back</button>
            </div>
        </div>
    );
}

export default Hints;
