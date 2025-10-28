import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import ComingSoon from './components/ComingSoon'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register/>}/>
          <Route path='/comingsoon' element={<ComingSoon/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
