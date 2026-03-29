import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = { <Landing /> } />
        <Route path='/v0/login' element = { <Login /> } />
        <Route path='/v0/register' element = { <Register /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
