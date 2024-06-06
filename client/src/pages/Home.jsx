import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import homeStyle from '/src/css/Home.module.css'
import { useGlobalContext } from "../context/GlobalContext"
import { Link } from 'react-router-dom';
import PopularAnime from '../components/PopularAnime'
import AiringAnime from "../components/AiringAnime";
import UpcomingAnime from "../components/UpcomingAnime";
import axios from "axios";

function Home() {
    // Use global context
    const { search,
        getPopularAnime, getAiringAnime, getUpcomingAnime,
        isSearch, loading, totalSearchResults, fixedSearch
    } = useGlobalContext()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true;

    // To change render
    const [rendered, setRendered] = useState('popular')

    // To switch between components
    const switchComponent = () => {
        switch (rendered) {
            case 'popular':
                return <PopularAnime rendered={rendered} />
            case 'airing':
                return <AiringAnime rendered={rendered} />
            case 'upcoming':
                return <UpcomingAnime rendered={rendered} />
            default:
                return <PopularAnime rendered={rendered} />
        }
    }

    useEffect(() => {
        // Tab title
        document.title = "Home | OtakuScope"
    }, [])

    return (
        <>
            <Navbar />

            {/* Main Content */}
            <main id={homeStyle['main-content']}>
                {/* Change heading based on changes from buttons or search bar */}
                <h1>
                    {/* If user is not searching, display the headings, otherwise display search input */}
                    {!isSearch ? (
                        rendered === 'popular' ? 'Popular Anime' :
                            rendered === 'airing' ? 'Airing Anime' : 'Upcoming Anime'
                    ) : (
                        `"${fixedSearch}" (${totalSearchResults} Results)`
                    )}
                </h1>

                {/* Buttons to switch components upon clicking  */}
                <div id={homeStyle['buttons-container']} >
                    {
                        !loading ? (
                            <>
                                <button onClick={() => { setRendered('popular'); getPopularAnime(); }}>Popular</button>
                                <button onClick={() => { setRendered('airing'); getAiringAnime(); }}>Airing</button>
                                <button onClick={() => { setRendered('upcoming'); getUpcomingAnime(); }}>Upcoming</button>
                            </>
                        ) : null}
                </div>

                {/* Display anime data based on switch component */}
                {switchComponent()}
            </main>
        </>
    )
}

export default Home