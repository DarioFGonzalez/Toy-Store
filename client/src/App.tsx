import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Landing } from './components/Landing/Landing'
import Create from './components/Create/Create';
import Detail from './components/Detail/Detail';
import Home from './components/Home/Home';
import TopBar from './components/top bar/TopBar';
import Shop from './components/Shop/Shop';
import MP from './components/MP/MP';
import PagoCorrecto from './components/MP/PagoCorrecto/PagoCorrecto';
import PagoErroneo from './components/MP/PagoErroneo/PagoErroneo';
import './App.css';
import Carrito from './components/Carrito/Carrito';
import { useEffect } from 'react';
import { URL } from './types/constants';
import axios from 'axios';

function App()
{
  const location = useLocation();

  useEffect( () =>
  {
    const cartId = localStorage.getItem( 'cartId' );
    if(cartId)
    {
      axios.get(`${URL}cart/${JSON.parse(cartId)}`)
      .then( ( {data} ) =>
      {
        if(data.status=='purchased')
        {
          localStorage.removeItem( 'cartId' );
        }
      })
      .catch( ( err ) => console.log( err ) );
    }
  }, [])

  return (
    <div className='general'>
      {location.pathname!=='/' && <TopBar />}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={ <Home />} />
        <Route path='/shop' element={ <Shop />} />
        <Route path='/detail/:id' element={ <Detail /> } />
        <Route path='/carrito' element={ <Carrito />} />
        {/*Solo para el administrador*/}
        <Route path='/create' element={ <Create />} />
        {/*En desarrollo*/}
        <Route path='/pasarela' element={ <MP /> }/>
        <Route path='/success' element={ <PagoCorrecto />} />
        <Route path='/failure' element= { <PagoErroneo />} />
      </Routes>
    </div>
  )
}

export default App
