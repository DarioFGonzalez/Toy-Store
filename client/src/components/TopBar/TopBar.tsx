import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './TopBar.module.css';

const TopBar: React.FC = () =>
{
  const [ isAdmin, setIsAdmin ] = useState<boolean>( false );

  useEffect( ()=>
  {
    const token = localStorage.getItem( 'adminToken' );
    setIsAdmin( token ? true : false );
  }, [])

  return (
    <nav className={Styles.TopBarContainer}>
      <span>Violeta's</span>
      <div>
        <Link to="/home">Inicio</Link>
        <Link to="/shop">Productos</Link>
        <Link to="/carrito">Carrito</Link>
        {isAdmin && <Link to="/dashboard"> Administración </Link>}
      </div>
    </nav>
  );
};

export default TopBar;