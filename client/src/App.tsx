import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Landing } from './components/Landing/Landing'
import Create from './components/Create/Create';
import Detail from './components/Detail/Detail';
import Home from './components/Home/Home';

function App() {

  return (

    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/home' element={ <Home />} />
      <Route path='/detail/:id' element={ <Detail /> } />
      <Route path='/create' element={ <Create />} />
    </Routes>
  )
}

export default App
