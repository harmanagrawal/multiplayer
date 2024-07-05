import React, { useState, useEffect } from 'react';
import './App.css';
import Tiles from './tiles/tiles';

function App() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const maxDimension = 400; 
    const squareSize = Math.min(maxDimension / rows, maxDimension / cols);
    setSquareDimensions(squareSize, squareSize);
  }, [rows, cols]);

  let k = 1;
  let renderGameBoard = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => k++)
  );


  const handleRowsChange = (e) => {
    setRows(Number(e.target.value));
  };

  const handleColsChange = (e) => {
    setCols(Number(e.target.value));
  };


  return (
    <div className="main-div">
      <div>
        <header className="App-header">
          <h1>QuadroCount</h1>
        </header>
        <div className='moveDetection'>
          <div className='left'>Yourself</div>
          <div className='right'>Opponent</div>
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
          {renderGameBoard.map(row => 
            row.map(value => <Tiles key={value} value={value} />)
          )}
        </div>
      </div>
    </div>
  );

  function setSquareDimensions(width, height) {
    document.documentElement.style.setProperty('--square-width', width + 'px');
    document.documentElement.style.setProperty('--square-height', height + 'px');
  }
}

export default App;