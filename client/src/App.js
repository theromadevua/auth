import { Route, Router, Routes } from 'react-router';
import './App.css';
import Auth from './features/auth/index'
import Main from './features/pages/Main';
import { useDispatch, useSelector } from 'react-redux';
import Authorized from './features/pages/Authorized';
import { useEffect } from 'react';
import { refresh } from './store/AuthSlice';

function App() {
  const {isAuth} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refresh())
}, [])
  return (
    <div className="App">
          <div>
              <Routes>
              {isAuth? <Route path="/" element={<Authorized/>} /> : <Route path="/" element={<Main/>} />}
              <Route path="/register" element={<Auth type="register"/>} />
              <Route path="/login" element={<Auth type="login"/>} />
              
              </Routes>
          </div>
    </div>
  );
}

export default App;
