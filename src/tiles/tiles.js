import React from 'react';
import './tiles.css';

function Tiles({ value, onClick, onMouseEnter, onMouseLeave, className }) {
  return (
    <div 
      className={`Square ${className}`} // Dynamically apply className here
      onClick={onClick} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      {value && (
        <div className={`piece ${value}`}></div> // The value determines the piece color/class
      )}
    </div>
  );
}

export default Tiles;
