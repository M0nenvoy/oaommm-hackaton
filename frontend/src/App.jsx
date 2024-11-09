import './App.css'
import Auth from './components/auth/Auth'
import { Route, Router, Routes } from 'react-router-dom'
import Main from './components/main/Main'

function App() {
  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('idChat'); // Удаление записи укажет, что уход не связан с перезагрузкой
  });

  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/register' element={<Auth />} />
      </Routes>
    </div>
  )
}

export default App
