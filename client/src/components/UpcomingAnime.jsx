import { useGlobalContext } from "../context/GlobalContext"
import RenderAnimeBoxes from '../context/RenderAnimeBoxes';

function UpcomingAnime({ rendered }) {
    // Use global context
    const { upcomingAnime, loading } = useGlobalContext()

    // Wait before anime data is fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        // Render airing anime items
        <RenderAnimeBoxes passAnimeType={upcomingAnime} rendered={rendered} />
    )
}

export default UpcomingAnime