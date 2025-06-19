import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { Landing } from './components/Landing/Landing'
import Create from './components/Create/Create';
import Detail from './components/Detail/Detail';
import Home from './components/Home/Home';
import Highlight from './components/Highlight/Highlight';
import TopBar from './components/top bar/TopBar';
import Shop from './components/Shop/Shop';
import './App.css';

function App()
{
  const location = useLocation();

  return (
    <div className='general'>
      {location.pathname!=='/' && <TopBar />}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={ <Home />} />
        <Route path='/shop' element={ <Shop />} />
        <Route path='/detail/:id' element={ <Detail /> } />
        <Route path='/create' element={ <Create />} />
        <Route path='/high' element={ <Highlight />} />
      </Routes>
    </div>
  )
}

export default App
