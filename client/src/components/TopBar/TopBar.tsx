import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './TopBar.module.css';

const TopBar: React.FC = () => {
  return (
    <nav className={Styles.TopBarContainer}>
      <span>Mi Super Tienda</span>
      <div>
        <Link to="/home">Inicio</Link>
        <Link to="/shop">Productos</Link>
        <Link to="/carrito">Carrito</Link>
      </div>
    </nav>
  );
};

export default TopBar;