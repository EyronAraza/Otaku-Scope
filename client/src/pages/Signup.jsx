import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import signupStyle from '/src/css/Signup.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from "../context/GlobalContext"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    // Use global context
    const { SERVER_URL } = useGlobalContext()

    useEffect(() => {
        // Tab title
        document.title = "Sign Up | OtakuScope"
    }, [])

    // Store user details
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    // For navigating through pages
    const navigate = useNavigate()

    // Handle Submit for account creation
    const handleSubmit = (e) => {
        e.preventDefault() // prevent browser from reloading the page so the code below can be executed

        // Check if any field is empty
        if (username.trim() === '') {
            toast.error("Username is empty!")
            return
        }
        if (email.trim() === '') {
            toast.error("E-mail is empty!")
            return
        }
        if (password.trim() === '') {
            toast.error("Password is empty!")
            return
        }
        if (confirmPass.trim() === '') {
            toast.error("Confirm Password is empty!")
            return
        }

        // Check if passwords don't match
        if (password !== confirmPass) {
            toast.error("Passwords do not match!")
            return
        }

        // Send / Post user details to server side (this executes if all fields are not empty) 
        axios.post(`${SERVER_URL}/register`, { username, email, password }) // This post the data to the server's localhost
            .then(result => {
                console.log(result)

                // Check if regiester is successful
                if (result.data === "Registered") {
                    // Display toast notification
                    toast.success(`Account "${username}" created successfully! You can now login.`, { toastId: 'success-login' })

                    setTimeout(() => {
                        navigate('/login') // go back to login page after registering
                    }, 2000)
                }

                // Check if username or email exist
                if (result.data === "Username or email already exists!") {
                    toast.error("Username or email already exists!", { toastId: 'user-exist' })
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
            <main id={signupStyle['main-content']}>
                <p id={signupStyle['discover-text']}>Discover and track your favourite anime shows with OtakuScope.</p>

                {/* Login Form */}
                <div id={signupStyle['signup-container']}>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <label htmlFor="user">
                            <strong>Username</strong>
                        </label>
                        <input
                            type="text"
                            placeholder='Enter Username'
                            autoComplete='off'
                            name='user'
                            maxLength="40"
                            onChange={(e) => setUsername(e.target.value)} // Store to variable
                        />

                        {/* Email */}
                        <label htmlFor="user">
                            <strong>E-mail</strong>
                        </label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            autoComplete='off'
                            name='email'
                            maxLength="40"
                            onChange={(e) => setEmail(e.target.value)} // Store to variable
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
                            maxLength="40"
                            onChange={(e) => setPassword(e.target.value)} // Store to variable
                        />

                        {/* Confirm Password */}
                        <label htmlFor="email">
                            <strong>Confirm Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder='Enter Confirm Password'
                            autoComplete='off'
                            name='confirmpassword'
                            maxLength="40"
                            onChange={(e) => setConfirmPass(e.target.value)} // Store to variable
                        />

                        {/* Sign Up Button */}
                        <button type='submit' id={signupStyle['signup-btn']}>
                            Create Account
                        </button>
                    </form>

                    {/* Login button that links to login page */}
                    <p>Already have an account?</p>

                    <Link to="/login" id={signupStyle['login-grey-btn']}>
                        Go to Login
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

export default Signup