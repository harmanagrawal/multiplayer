import React, { useState, useEffect } from 'react';
import './App.css';
import Tiles from './tiles/tiles';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <div className='outer-div'>
      <div className='main-div'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/how-to-play' element={<howtoplay />} />
        </Routes>
      </Router>
      </div>
    </div>
  );
}

export default App;