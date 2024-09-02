import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import Howtoplay from './components/pages/Howtoplay';
import Hints from './components/pages/Hints';

function App() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [whiteOccupied, setWhiteOccupied] = useState([[0, 0], [1, 0]]);
  const [blackOccupied, setBlackOccupied] = useState([[3, 3], [2, 3]]);
  const [board, setBoard] = useState(initializeBoard(4, 4, whiteOccupied, blackOccupied));
  const [currentPlayer, setCurrentPlayer] = useState('white');
  
  useEffect(() => {
    setBoard(initializeBoard(rows, cols, whiteOccupied, blackOccupied));
  }, [rows, cols, whiteOccupied, blackOccupied]);

  function initializeBoard(rows, cols, whiteOccupied, blackOccupied) {
    const newBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
    whiteOccupied.forEach(([row, col]) => newBoard[row][col] = 'white');
    blackOccupied.forEach(([row, col]) => newBoard[row][col] = 'black');
    return newBoard;
  }

  return (
    <div className='outer-div'>
      <div className='main-div'>
        <Router>
          <Navbar 
            board={board}
            currentPlayer={currentPlayer}
            whiteOccupied={whiteOccupied}
            blackOccupied={blackOccupied}
            rows={rows}
            cols={cols}
          />
          <Routes>
            <Route path='/' element={
              <Dashboard 
                rows={rows}
                cols={cols}
                board={board}
                setBoard={setBoard}
                whiteOccupied={whiteOccupied}
                setWhiteOccupied={setWhiteOccupied}
                blackOccupied={blackOccupied}
                setBlackOccupied={setBlackOccupied}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                setRows={setRows}
                setCols={setCols}
              />
            } />
            <Route path='/how-to-play' element={<Howtoplay />} />
            <Route path='/hints' element={<Hints />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
