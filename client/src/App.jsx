import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyList from './pages/MyList'
import NoPage from './pages/NoPage'
import AnimeItem from './pages/AnimeItem'
import ScrollToTop from './context/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      {/* Auto scroll to top */}
      <ScrollToTop />

      {/* Creating routes, basically the going to the pages, element parameter represents jsx files of pages */}
      <Routes>
        {/* To go to these pages, type "http://localhost:5173/register" after running the server, next to the local host url, just type the path for example "/register" */}
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/anime/:id' element={<AnimeItem />}></Route>
        <Route path='/mylist' element={<MyList />}></Route>
        <Route path='*' element={<NoPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
