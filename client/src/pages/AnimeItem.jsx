import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import animeStyle from '/src/css/AnimeItem.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// For displaying anime info
function AnimeItem() {
    // Use global context
    const { SERVER_URL } = useGlobalContext()

    const navigate = useNavigate()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true;

    // Get Anime ID from URL's param
    const { id } = useParams()

    // Store Anime details which is object based on Anime ID
    const [anime, setAnime] = useState({})

    // Destructure anime details
    const { title, title_english, images,
        aired, rating, genres,
        duration, episodes, studios, synopsis, trailer, mal_id } = anime

    // Anime title to check for english title, otherwise use japanese title
    const animeTitleCheck = title_english ? title_english : title

    // Get anime based on ID
    const getAnime = async (anime) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}`)
        const data = await response.json()
        setAnime(data.data)
    }

    useEffect(() => {
        // Store Anime details to object variable after fetch
        getAnime(id)
    }, [])

    // Get username
    const [username, setUsername] = useState('')

    // Bool for Add to my List button
    const [isAdded, setIsAdded] = useState(false)

    // Bool to check if user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false)

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

    // Function to toggle the cart item status
    const toggleAddListStatus = () => {
        setIsAdded(prevState => !prevState);
    };

    useEffect(() => {
        // Check if there are any added anime items by the user in the database to set the current status of the button
        axios.get(`${SERVER_URL}/animeitem/status?username=${username}&animeId=${encodeURIComponent(id)}`)
            .then(response => {
                setIsAdded(response.data.isInList); // set true or false if user already added the anime to their list or not
            })
            .catch(error => console.error("Error fetching anime items:", error));
    }, [])

    // Handle "Add to my List" button
    const handleAddListButton = () => {
        if (isLoggedIn) {
            const newState = !isAdded;

            // If press add
            if (newState) {
                console.log(`${animeTitleCheck} is added to your list.`)

                // Post added anime item to database
                axios.post(`${SERVER_URL}/animeitem`, { username: username, animeId: id, animeTitle: animeTitleCheck })
                    .then(result => {
                        console.log(result)
                    })
                    .catch(err => console.log(err))

                // Notify successfully added
                toast.success(`"${animeTitleCheck}" is added to your list.`, { toastId: 'success-added' })
            } else { // If press remove
                console.log(`${animeTitleCheck} is removed from your list.`)

                // Delete specific anime item from database
                axios.delete(`${SERVER_URL}/animeitem/${username}/${id}`)
                    .then(result => {
                        console.log(result.data);
                    })
                    .catch(err => console.log(err));

                // Notify anime removed from list
                toast.info(`"${animeTitleCheck}" is removed from your list.`, { toastId: 'success-removed' })
            }

            toggleAddListStatus()
        } else {
            // Notify to log in if they want to add anime to list
            toast.warning("Please log in if you want to add to list!", { toastId: 'warn' })
        }
    }

    return (
        <>
            <Navbar />

            {/* Main Content (takes whole screen below navbar)*/}
            <main id={animeStyle['main-content']}>
                {/* Content Container */}
                <div id={animeStyle["content-container"]}>
                    {/* Back button */}
                    <Link onClick={() => { navigate(-1) }} id={animeStyle['back-btn']}><i className="fa-solid fa-arrow-left"></i> Back</Link>

                    {/* Container consists of Anime information */}
                    <div id={animeStyle["anime-info-container"]}>
                        {/* Image and Info Container */}
                        <div id={animeStyle["anime-info-child-container"]}>
                            {/* Anime Image and button container */}
                            <div id={animeStyle["anime-img-container"]}>
                                {/* Anime Image */}
                                <img src={images?.jpg.large_image_url}
                                    alt="" /> <br />

                                {/* Add to List button */}
                                <button
                                    id={animeStyle['add-list-button']}
                                    onClick={() => handleAddListButton()}
                                    style={isAdded ? { backgroundColor: "#FF2877" } : {}}>
                                    {isAdded ? "Remove from my List" : "Add To my List"}
                                </button>
                            </div>

                            {/* Anime Description container */}
                            <div id={animeStyle["anime-desc-container"]}>
                                {/* Anime Title (If english title is null, switch to Japanese title) */}
                                <h1>{animeTitleCheck}</h1>
                                <hr />

                                {/* Anime Description */}
                                <p>{synopsis}</p>
                            </div>
                        </div>

                        {/* Anime Details Table */}
                        <table id={animeStyle['anime-details-table']}>
                            {/* Change column size */}
                            <colgroup>
                                <col />
                                <col style={{ width: "100%" }} />
                            </colgroup>

                            {/* Anime Details */}
                            <tbody>
                                <tr>
                                    {/* Aired Date */}
                                    <td className={animeStyle['nowrap-cell']}><span className={animeStyle['detail-type-text']}>Aired Date:</span></td>
                                    <td>{aired?.string}</td>
                                </tr>
                                <tr>
                                    {/* Age Rating */}
                                    <td className={animeStyle['nowrap-cell']}><span className={animeStyle['detail-type-text']}>Age Rating:</span></td>
                                    <td>{rating}</td>
                                </tr>
                                <tr>
                                    {/* Genres */}
                                    <td className={animeStyle['nowrap-cell']}><span className={animeStyle['detail-type-text']}>Genre(s):</span></td>
                                    <td>{genres && genres.map((genre) => genre.name).join(' - ')}</td>
                                </tr>
                                <tr>
                                    {/* Episodes */}
                                    <td className={animeStyle['nowrap-cell']}><span className={animeStyle['detail-type-text']}>Episodes:</span></td>
                                    <td>{episodes}</td>
                                </tr>
                                <tr>
                                    {/* Duration */}
                                    <td className={animeStyle['nowrap-cell']}><span className={animeStyle['detail-type-text']}>Duration:</span></td>
                                    <td>{duration}</td>
                                </tr>
                                <tr>
                                    {/* Studio */}
                                    <td className={animeStyle['nowrap-cell']}><span className={animeStyle['detail-type-text']}>Studio(s):</span></td>
                                    <td>{studios && studios.map((studio) => studio.name).join(' - ')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Anime Trailer Container */}
                    <div id={animeStyle["anime-trailer-container"]}>
                        <h1>Trailer</h1>

                        {/* YouTube Video */}
                        <div id={animeStyle["video-container"]}>
                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailer?.youtube_id}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            {/* https://www.youtube-nocookie.com/embed/${trailer?.youtube_id} */}
                            {/* https://www.youtube.com/embed/${trailer?.youtube_id} */}
                        </div>
                    </div>
                </div>

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

                {/* Fetch test */}
                {/* <h1>{title_english}</h1> <br />
                <img src={images?.jpg.large_image_url}
                    alt="" /> <br />
                <p>{aired?.string}</p> <br />
                <p>{rating}</p> <br />
                {genres && genres.map((genre, index) => (
                    <p key={index}>{genre.name}</p>
                ))} <br />
                <p>{duration}</p> <br />
                <p>{episodes}</p> <br />
                {studios && studios.map((genre, index) => (
                    <p key={index}>{genre.name}</p>
                ))} <br />
                <p>{synopsis}</p> <br /> */}
            </main>
        </>
    )
}

export default AnimeItem