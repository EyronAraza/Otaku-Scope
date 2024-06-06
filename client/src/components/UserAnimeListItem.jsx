import React, { useEffect, useState } from 'react'
import userItemStyle from '/src/css/UsersAnimeItem.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useGlobalContext } from '../context/GlobalContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserAnimeListItem({ anime_id, currentStatus, currentEpisode, onDelete }) {
    // Use global context
    const { SERVER_URL } = useGlobalContext()

    // Store Anime details which is object based on Anime ID
    const [anime, setAnime] = useState({})

    // Destructure anime details
    const { title, title_english, images, episodes, } = anime

    // Get anime based on ID
    const getAnime = async (anime) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}`)
        const data = await response.json()
        setAnime(data.data)
    }

    useEffect(() => {
        // Store Anime details to object variable after fetch
        getAnime(anime_id)
    }, [])

    // Change item's border color based on Status
    const [status, setStatus] = useState(currentStatus)
    const [styleBorder, setStyleBorder] = useState('')

    // Set Status border colors at start
    useEffect(() => {
        switch (status) {
            case "Watching":
                setStyleBorder('purple')
                break;
            case "Plan to Watch":
                setStyleBorder('blue')
                break;
            case "Completed":
                setStyleBorder('green')
                break;
            case "Dropped":
                setStyleBorder('red')
                break;
            default:
                setStyleBorder('')
                return;
        }
    }, [])

    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value; // Get option's value from selection 
        setStatus(selectedStatus);

        // Pass border color class based on status selection
        switch (selectedStatus) {
            case "Watching":
                setStyleBorder('purple')
                break;
            case "Plan to Watch":
                setStyleBorder('blue')
                break;
            case "Completed":
                setStyleBorder('green')
                break;
            case "Dropped":
                setStyleBorder('red')
                break;
            default:
                setStyleBorder('')
                return;
        }
    }

    // Track current episode
    const [episodeInputValue, setEpisodeInputValue] = useState(currentEpisode)

    // Handle episode input on change
    const handleEpisodeInputChange = (e) => {
        setEpisodeInputValue(e.target.value);
    }

    // Handle form submission to save changes
    const handleSaveSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Update mongodb items of current status and current episode 
            const response = await axios.put(`${SERVER_URL}/update-anime-item`, {
                animeId: anime_id,
                status: status,
                episode: episodeInputValue,
            });

            // Notify saved successfully
            console.log(response.data);
            toast.success(`Saved changes for "${title_english ? title_english : title}"`)
        } catch (error) {
            console.error("Failed to update anime item:", error);
        }
    }

    return (
        <div id={userItemStyle['item-container']} className={userItemStyle[styleBorder]}>

            <form onSubmit={handleSaveSubmit}>
                <div id={userItemStyle['image-container']}>
                    {/* Anime Image */}
                    <Link to={`/anime/${anime_id}`}>
                        <img src={images?.jpg.large_image_url}
                            alt="" /> <br />
                    </Link>
                </div>

                <div id={userItemStyle['title-container']}>
                    <Link to={`/anime/${anime_id}`}>{title_english ? title_english : title}</Link>
                </div>

                <div id={userItemStyle['status-container']}>
                    <p>Status</p>
                    <select onChange={handleStatusChange} value={status}>
                        <option value="Watching">Watching</option>
                        <option value="Plan to Watch">Plan to Watch</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </div>

                <div id={userItemStyle['episode-container']}>
                    <p>Episodes</p>
                    <input type="number" inputMode='numeric' value={episodeInputValue} onChange={handleEpisodeInputChange} max={episodes !== null ? episodes : Number.MAX_SAFE_INTEGER} />
                    <p>/ {episodes !== null ? episodes : 'NA'}</p>
                </div>

                <div id={userItemStyle['save-delete-container']}>
                    <button id={userItemStyle['save-btn']} type='submit'>Save</button>
                    <button id={userItemStyle['delete-btn']} onClick={() => onDelete(anime_id)}>Delete</button>
                </div>
            </form>

            <ToastContainer
                // toastStyle={{ backgroundColor: "#12B59B" }}
                position="top-center"
                autoClose={2000}
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover={false}
                limit={5}
                theme="dark" />
        </div>
    )
}

export default UserAnimeListItem