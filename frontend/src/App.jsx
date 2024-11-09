import './App.css'
import Auth from './components/auth/Auth'
import { Route, Router, Routes } from 'react-router-dom'
import Main from './components/main/Main'
import Wrapper from './components/history/Wrapper'
import Chat from './components/chat/Chat'

function App() {
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
