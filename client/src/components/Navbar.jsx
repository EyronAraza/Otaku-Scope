import { useEffect, useState } from 'react'
import logoImg from '/src/assets/logo-img.png'
import navbarStyle from '/src/css/Navbar.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

function Navbar() {
    // Use global context
    const { handleSubmit, search, searchAnime, handleChange, isSearch, SERVER_URL } = useGlobalContext()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true;

    // Use Navigate
    const navigate = useNavigate()

    // Bool to check if user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Set username
    const [username, setUsername] = useState('')

    // To check if user is actually login
    useEffect(() => {
        // GET request
        axios.get(`${SERVER_URL}/home`)
            .then(result => {
                console.log(result) // print result

                // If no user is logged in
                if (result.data.status !== "Token Success") {
                    setIsLoggedIn(false)
                } else {
                    // Get username after login
                    setUsername(result.data.user)
                    setIsLoggedIn(true)
                }
            })
    }, [])

    // Bool to display dropdrown menu from user display
    const [showUserDropDown, setShowUserDropDown] = useState(false)

    // Handle user dropdown
    const handleDropdown = () => {
        setShowUserDropDown(!showUserDropDown)
    }

    // Logout button
    const handleLogout = async () => {
        await axios.post(`${SERVER_URL}/logout`, {}, { withCredentials: true })

        setIsLoggedIn(false)

        // redirect to login page
        navigate('/login')
    }

    // Button to redirect to "My List" page 
    const navToMyList = () => {
        navigate('/mylist')
    }

    // Handle search submit
    const handleFormSubmit = (e) => {
        handleSubmit(e);
        navigate('/home');
    }

    return (
        <nav id={navbarStyle['main-nav']}>
            {/* Logo (clicking this will refresh page)*/}
            <Link to='/home' id={navbarStyle['link-img']} onClick={() => { setTimeout(() => { window.location.reload() }, 1) }}>
                <img src={logoImg} alt="Logo" id={navbarStyle['logo-img']} />
            </Link>

            {/* Searchbar */}
            <form id={navbarStyle['searchbar-container']} onSubmit={handleFormSubmit}>
                <input type="text" placeholder='Search Anime ...' value={search} onChange={handleChange} />
                <button id={navbarStyle['searchbar-btn']} type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
            </form>

            {/* Check if user login */}
            {!isLoggedIn ? (
                // Login Button
                <Link to='/login' id={navbarStyle['login-btn']} onClick={() => {
                }}>Login / Sign Up</Link>
            ) : (
                // User Display container
                <div id={navbarStyle['user-container']} onClick={() => handleDropdown()} style={showUserDropDown ? { backgroundColor: "rgba(255, 255, 255, 0.25)" } : {}}>
                    {/* Username display */}
                    <div id={navbarStyle["user-display-container"]}>
                        <b id={navbarStyle['user-display-1']}>Hello, {username} <i className="fa-solid fa-caret-down"></i></b>
                        <b id={navbarStyle['user-display-2']}><i className="fa-solid fa-circle-user"></i> <i className="fa-solid fa-caret-down"></i></b>
                    </div>

                    {/* Dropdown Menu */}
                    <div id={navbarStyle["user-dropdown-container"]} style={showUserDropDown ? { display: 'flex' } : { display: 'none' }}>
                        {/* My List button */}
                        <button onClick={navToMyList}><i className="fa-solid fa-star"></i>My List</button>

                        {/* Logout button */}
                        <button onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Logout</button>
                    </div>
                </div>
            )}

            {/* Customize Toaster */}
            <ToastContainer
                // toastStyle={{ backgroundColor: "#12B59B" }}
                position="top-center"
                autoClose={2000}
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover={false}
                theme="dark" />
        </nav>
    )
}

export default Navbar