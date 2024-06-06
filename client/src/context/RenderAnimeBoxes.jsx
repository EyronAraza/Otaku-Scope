import animeBoxStyle from '/src/css/AnimeBoxes.module.css'
import { useGlobalContext } from "../context/GlobalContext"
import { Link } from 'react-router-dom';

function RenderAnimeBoxes({ passAnimeType, rendered }) {

    // My only method to prevent "429 Too Many Requests"
    if (passAnimeType === undefined) {
        // Refresh the page
        return window.location.reload();
    }

    // Use global context
    const { isSearch, searchResults } = useGlobalContext()

    // Conditional title to check if english title is not null, otherwise use Japanese title
    const conditionalAnimeTitle = (animeData) => {
        return animeData.title_english ? animeData.title_english : animeData.title
    }

    // Conditional Render
    const conditionalRender = () => {
        // If theres no input in search, display popular anime
        // Otherwise, display anime based on search input
        if (!isSearch && rendered) {
            // Post popular animes
            return passAnimeType.map((anime, index) => {
                return (
                    <Link to={`/anime/${anime.mal_id}`} key={`${anime.mal_id}-${index}`}>
                        <img src={anime.images.jpg.large_image_url} alt="" />
                        <div className={animeBoxStyle["text-popup"]}>
                            <p>{conditionalAnimeTitle(anime)}</p>
                        </div>
                    </Link>
                )
            })
        } else {
            // Post animes based on search input
            return searchResults.map((anime, index) => {
                return <Link to={`/anime/${anime.mal_id}`} key={`${anime.mal_id}-${index}`}>
                    <img src={anime.images.jpg.large_image_url} alt="" />
                    <div className={animeBoxStyle["text-popup"]}>
                        <p>{conditionalAnimeTitle(anime)}</p>
                    </div>
                </Link>
            })
        }
    }

    return (
        // Display popular anime items
        <div id={animeBoxStyle["animeitems-container"]}>
            {conditionalRender()}
        </div>
    )
}

export default RenderAnimeBoxes