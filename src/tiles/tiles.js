import React from 'react'
import './tiles.css'

// Example function to set new dimensions
function setSquareDimensions(width, height) {
  document.documentElement.style.setProperty('--square-width', width + 'px');
  document.documentElement.style.setProperty('--square-height', height + 'px');
}

// Set new dimensions
setSquareDimensions(100, 100); // This will change the width and height to 150px


const tiles = () => {
  return (
    <div className='Square'></div>
  )
}

export default tiles