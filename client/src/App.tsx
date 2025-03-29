import { Route, Routes } from 'react-router';
import './App.scss';
import Auth from './features/auth/index'
import Main from './features/pages/Main';
import { useSelector } from 'react-redux';
import Weather from './features/weather';
import { useEffect } from 'react';
import { refresh } from './store/AuthThunks';
import { RootState, useAppDispatch } from './store/store';

function App() {
  const {isAuth} = useSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(refresh())
    
    const authInterval = setInterval(() => {
      dispatch(refresh())
    }, 1000 * 60 * 60 )

    return () => {
      clearInterval(authInterval)
    }
  }, [])

  return (
    <div className="App">
          <div>
              <Routes>
                {isAuth ? <Route path="/" element={<Weather/>} /> : <Route path="/" element={<Main/>} />}
                <Route path="/register" element={<Auth type="register"/>} />
                <Route path="/login" element={<Auth type="login"/>} />
                <Route path="/reset-password/:id" element={<Auth type="reset"/>} />
                <Route path="/reset-password-request" element={<Auth type="reset-request"/>} />
              </Routes>
          </div>
    </div>
  );
}

export default App;
