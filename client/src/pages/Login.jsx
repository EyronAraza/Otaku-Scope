import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import loginStyle from '/src/css/Login.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from "../context/GlobalContext";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    useEffect(() => {
        // Tab title
        document.title = "Login | OtakuScope"
    }, [])

    // Use global context
    const { SERVER_URL } = useGlobalContext()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true;

    // Store user details
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // For navigating through pages
    const navigate = useNavigate()

    // Handle Submit for account creation
    const handleSubmit = (e) => {
        e.preventDefault() // prevent browser from reloading the page so the code below can be executed

        // Check if any field is empty
        if (username.trim() === '') {
            toast.error("Username is empty!", { toastId: 'user' })
            return
        }
        if (password.trim() === '') {
            toast.error("Password is empty!", { toastId: 'pass' })
            return
        }

        // This post the data to the server side
        axios.post(`${SERVER_URL}/login`, { username, password }) // This post the data to the server's localhost
            .then(result => {
                console.log(result)
                // Check if login is success
                if (result.data.status === "Success") {
                    navigate('/home') // go to home page after login
                }

                // If user password is wrong
                if (result.data === "wrong password") {
                    toast.error("Wrong password!", { toastId: 'pass-wrong' })
                }

                // If inputted user does not exist
                if (result.data === "No record existed") {
                    toast.error("Username does not exist!", { toastId: 'user-no-exist' })
                }
            })
            .catch(err => console.log(err))
    }

    // To check if user is actually login
    useEffect(() => {
        // GET request
        axios.get(`${SERVER_URL}/home`)
            .then(result => {
                console.log(result) // print result

                // If user is logged in, prevent them from going to login or sign up paeg
                if (result.data.status === "Token Success") {
                    navigate('/home')
                }
            })
    }, [])

    return (
        <>
            {/* Nav Bar */}
            <Navbar />

            {/* Main Content */}
            <main id={loginStyle['main-content']}>
                <p id={loginStyle['discover-text']}>Discover and track your favourite anime shows with OtakuScope.</p>

                {/* Login Form */}
                <div id={loginStyle['login-container']}>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        {/* User */}
                        <label htmlFor="user">
                            <strong>Username or Email</strong>
                        </label>
                        <input
                            type="text"
                            placeholder='Enter Username or Email'
                            autoComplete='off'
                            name='user'
                            onChange={(e) => setUsername(e.target.value)} // Store to variable
                        />

                        {/* Password */}
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            autoComplete='off'
                            name='password'
                            onChange={(e) => setPassword(e.target.value)} // Store to variable
                        />

                        {/* Login Button */}
                        <button type='submit' id={loginStyle['login-btn']}>
                            Login
                        </button>
                    </form>

                    {/* Sign Up button that links to register page */}
                    <p>Don't have an account?</p>

                    <Link to="/signup" id={loginStyle['register-grey-btn']}>
                        Sign Up
                    </Link>
                </div>
            </main>

            {/* Customize Toaster */}
            <ToastContainer
                // toastStyle={{ backgroundColor: "#12B59B" }}
                position="top-center"
                autoClose={2000}
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover={false}
                limit={5}
                theme="dark" />
        </>
    )
}

export default Login