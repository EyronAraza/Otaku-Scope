import { useGlobalContext } from "../context/GlobalContext"
import RenderAnimeBoxes from '../context/RenderAnimeBoxes';

function AiringAnime({ rendered }) {
    // Use global context
    const { airingAnime, loading } = useGlobalContext()

    // Wait before anime data is fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        // Render airing anime items
        <RenderAnimeBoxes passAnimeType={airingAnime} rendered={rendered} />
    )
}

export default AiringAnime