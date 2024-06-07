import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import UserAnimeListItem from "../components/UserAnimeListItem"
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from "../context/GlobalContext"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myListStyle from '/src/css/MyList.module.css'
import Cookies from 'js-cookie';

function MyList() {
    useEffect(() => {
        // Tab title
        document.title = "My List | OtakuScope"
    }, [])

    const { SERVER_URL } = useGlobalContext()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true;

    // Use navigate
    const navigate = useNavigate()

    // Set username
    const [username, setUsername] = useState('')

    // Set user's added anime items
    const [animeItems, setAnimeItems] = useState([])

    // To check if user is actually login
    useEffect(() => {
        // Function to check if user is logged in and fetch cart items
        const checkLoginAndFetchItems = async () => {
            // First, check if user is logged in
            const loginResult = await axios.get(`${SERVER_URL}/home`)
            console.log(loginResult.data);
            // If no user is logged in, send them back to login
            if (loginResult.data.status !== "Token Success") {
                navigate('/login')
            } else {
                // Get username 
                const getUser = await axios.get(`${SERVER_URL}/home`)
                const username = getUser.data.user

                // Save username to useState varible
                setUsername(username)

                // Fetch user's added anime items 
                const animeItemResponse = await axios.get(`${SERVER_URL}/animeitem/items?username=${username}`);
                setAnimeItems(animeItemResponse.data)
            }
        }

        // Call function
        checkLoginAndFetchItems()
    }, [navigate])

    // Handle delete by getting anime's id
    const handleDelete = (animeIdToDelete) => {
        // Remove anime from array
        setAnimeItems(prevItems => prevItems.filter(item => item.animeId !== animeIdToDelete));

        // Delete specific anime item from database
        axios.delete(`${SERVER_URL}/animeitem/${username}/${animeIdToDelete}`)
            .then(result => {
                console.log(`${animeItems.map(item => (item.animeTitle))} has been removed from your list.`)
                console.log(result.data);
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <Navbar />

            <main id={myListStyle['main-content']}>
                {/* Back button */}
                <Link to='/home' id={myListStyle['back-btn']}>Back Home</Link>

                <h1>{username}'s Anime List</h1>

                <div id={myListStyle["anime-list-container"]}>
                    {animeItems.slice().reverse().map(item => (
                        <UserAnimeListItem
                            key={item._id}
                            anime_id={item.animeId}
                            currentStatus={item.status}
                            currentEpisode={item.episode}
                            onDelete={handleDelete}
                        />
                    ))}

                    {/* <UserAnimeListItem anime_id='16498' />
                    <UserAnimeListItem anime_id='42897' />
                    <UserAnimeListItem anime_id='21' />
                    <UserAnimeListItem anime_id='1535' />
                    <UserAnimeListItem anime_id='11757' />
                    <UserAnimeListItem anime_id='40748' />
                    <UserAnimeListItem anime_id='4224' />
                    <UserAnimeListItem anime_id='31240' /> */}
                </div>
            </main>

        </>
    )
}

export default MyList