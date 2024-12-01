import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ board, currentPlayer, whiteOccupied, blackOccupied, rows, cols }) {
    const [click, setClick] = useState(false);
    const navigate = useNavigate(); // Use navigate hook

    const handleClick = () => setClick(!click);
    const closedMobileMenu = () => setClick(false);

    const handleGoBack = () => {
        navigate(-1, {
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

    const handleHintsClick = () => {
        closedMobileMenu();
        navigate('/hints', {
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

    const handlePlayClick = () => {
        closedMobileMenu();
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

        return (
            <>
                <nav className='Navbar'>
                    <div className='Navbar-container'>
                        <ul className={click ? 'nav-menu-active' : 'nav-menu'}>
                            <li className='nav-item'>
                                {/* Trigger the handlePlayClick on click */}
                                <div className='nav-links' onClick={handlePlayClick}>Play</div>
                            </li>
                            <li className='nav-item'>
                                {/* Trigger the handleHintsClick on click */}
                                <div className='nav-links' onClick={handleHintsClick}>Hints</div>
                            </li>
                            <li className='nav-item'>
                                <Link to='/rules' className='nav-links' onClick={closedMobileMenu}>Rules</Link>
                            </li>
                            <li className='nav-item'>
                                <Link to='/terminal-positions' className='nav-links' onClick={closedMobileMenu}>End Positions</Link>
                            </li>
                            <li className='nav-item'>
                                <Link to='/test-config' className='nav-links' onClick={closedMobileMenu}>Test Configurations</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </>
        );
    }

    export default Navbar;
