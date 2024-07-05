import React from 'react'
import './tiles.css'

function tiles({ value, onClick }) {
  return (
    <div className="Square" onClick={onClick}>
      {value && (
        <div className={`piece ${value}`}></div>
      )}
    </div>
  );
}



export default tiles