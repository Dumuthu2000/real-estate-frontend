import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './components/Header'
const App=()=>{
  return (
    <BrowserRouter>
    <Header />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sign-in' element={<Signin />} />
            <Route path='/sign-up' element={<Signup />} />
            <Route path='/about' element={<About />} />
            <Route path='/profile' element={<Profile />} />
        </Routes>
    </BrowserRouter>
  )
}
export default App