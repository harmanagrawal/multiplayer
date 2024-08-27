import React, {useState} from 'react'
import {Link} from 'react-router-dom'
//import { Button } from './Button';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closedMobileMenu = () => setClick(false);

  /*const showButton = () => {
    if(window.innerWidth <= 960) {
        setButton(false);
    } else {
        setButton(true);
    }
  }*/

 // window.addEventListener('resize', showButton);
  return (
    <>
    <nav className='Navbar'>
        <div className='Navbar-container'>
            <ul className={click ? 'nav-menu-active' : 'nav-menu'}>
                <li className='nav-item'>
                    <Link to='/' className='nav-links' onClick={closedMobileMenu}>Play</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/hints' className='nav-links' onClick={closedMobileMenu}>Hints</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/how-to-play' className='nav-links' onClick={closedMobileMenu}>How to Play</Link>
                </li>
            </ul>
        </div>
    </nav>
    </>
  )
}

export default Navbar