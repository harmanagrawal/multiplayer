import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import Howtoplay from './components/pages/Howtoplay';
import Hints from './components/pages/Hints';
import Terminal from './components/pages/Terminal';
import initializeBoard from './utils/initializeBoard';
import TestConfig from './components/pages/TestConfig';

function App() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [pieces, setPieces] = useState(2);
  const [whiteOccupied, setWhiteOccupied] = useState([[0, 0], [1, 0]]);
  const [blackOccupied, setBlackOccupied] = useState([[3, 3], [2, 3]]);
  const [board, setBoard] = useState(initializeBoard(4, 4, whiteOccupied, blackOccupied));
  const [currentPlayer, setCurrentPlayer] = useState('white');
  
  useEffect(() => {
    const adjustedWhiteOccupied = adjustOccupiedPieces(whiteOccupied, rows, cols);
    const adjustedBlackOccupied = adjustOccupiedPieces(blackOccupied, rows, cols);

    setWhiteOccupied(adjustedWhiteOccupied);
    setBlackOccupied(adjustedBlackOccupied);

    setBoard(initializeBoard(rows, cols, adjustedWhiteOccupied, adjustedBlackOccupied));
  }, [rows, cols, whiteOccupied, blackOccupied]);

  function adjustOccupiedPieces(occupied, newRows, newCols) {
    return occupied.map(([row, col]) => [
      Math.min(row, newRows - 1),
      Math.min(col, newCols - 1),
    ]);
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
                pieces={pieces}
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
                setPieces={setPieces}
              />
            } />
            <Route path='/rules' element={<Howtoplay />} />
            <Route path='/hints' element={<Hints />} />
            <Route path='/terminal-positions' element={<Terminal />} />
            <Route path='/test-config' element={<TestConfig />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
