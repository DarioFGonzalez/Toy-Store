import axios from 'axios';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Carrito from './components/Carrito/Carrito';
import Create from './components/Create/Create';
import Detail from './components/Detail/Detail';
import Home from './components/Home/Home';
import MP from './components/MP/MP';
import PagoCorrecto from './components/MP/PagoCorrecto/PagoCorrecto';
import PagoErroneo from './components/MP/PagoErroneo/PagoErroneo';
import Shop from './components/Shop/Shop';
import TopBar from './components/TopBar/TopBar';
import { URL } from './types/constants';

function App() {

  useEffect(() => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      axios.get(`${URL}cart/${JSON.parse(cartId)}`)
        .then(({ data }) => {
          if (data.status === 'purchased') {
            localStorage.removeItem('cartId');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className='app-container-wrapper'>
      <TopBar />
      <div className='main-content-area'>
        <div className='page-content-wrapper'>
          <Routes>
            <Route path='/' element={<Navigate to="/home" replace />} />
            <Route path='/home' element={<Home />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/detail/:id' element={<Detail />} />
            <Route path='/carrito' element={<Carrito />} />
            <Route path='/create' element={<Create />} />
            <Route path='/pasarela' element={<MP />} />
            <Route path='/success' element={<PagoCorrecto />} />
            <Route path='/failure' element={<PagoErroneo />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;