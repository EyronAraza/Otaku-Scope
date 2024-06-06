import { useGlobalContext } from "../context/GlobalContext"
import RenderAnimeBoxes from '../context/RenderAnimeBoxes';

function PopularAnime({ rendered }) {
    // Use global context
    const { popularAnime, loading, search } = useGlobalContext()


    // Wait before anime data is fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        // Render popular anime items
        <RenderAnimeBoxes passAnimeType={popularAnime} rendered={rendered} />
    )
}

export default PopularAnime