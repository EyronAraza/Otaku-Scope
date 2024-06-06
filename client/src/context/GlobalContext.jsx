import { createContext, useEffect, useReducer, useState } from 'react'
import { useContext } from 'react'

// Create global context
const GlobalContext = createContext()

// API Link (Anime API)
const baseApiUrl = "https://api.jikan.moe/v4"

// Action Types
const LOADING = "LOADING"
const SEARCH = "SEARCH"
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME"
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME"
const GET_AIRING_ANIME = "GET_AIRING_ANIME"

// Reducer Action Types to update states
const reducer = (state, action) => {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case GET_POPULAR_ANIME:
            return { ...state, popularAnime: action.payload, loading: false }
        case GET_UPCOMING_ANIME:
            return { ...state, upcomingAnime: action.payload, loading: false }
        case GET_AIRING_ANIME:
            return { ...state, airingAnime: action.payload, loading: false }
        case SEARCH:
            return { ...state, searchResults: action.payload, loading: false, totalSearchResults: action.payload.length }
        default:
            return state
    }
}

// Create Global Provider
export const GlobalProvider = ({ children }) => {
    // Store access to server/back-end side
    const SERVER_URL = "https://otaku-scope-api.vercel.app"

    // Initial state
    const initialState = {
        popularAnime: [],
        upcomingAnime: [],
        airingAnime: [],
        pictures: [],
        isSearch: false,
        searchResults: [],
        loading: false,
        totalSearchResults: []
    }

    // Store search text
    const [search, setSearch] = useState('')

    // Store fixed search text that doesn't update the text onChange bar search bar
    const [fixedSearch, setFixedSearch] = useState('')

    // Create use reducer to handle and manipulate multiple states
    // Dispatch is used to send the data and the reducer will update and store to initialState variables
    const [state, dispatch] = useReducer(reducer, initialState)

    // Handle change from search bar
    const handleChange = (e) => {
        setSearch(e.target.value)

        // If user search empty, display popular animes instead (commented out)
        // if (e.target.value === '') {
        //     state.isSearch = false
        // }
    }

    // Handle submit from search bar
    const handleSubmit = (e) => {
        e.preventDefault() // prevent browser refresh
        // Check if there are input characters in search
        if (search) {
            searchAnime(search)
            setFixedSearch(search) // save search text
            state.isSearch = true
        } else {
            state.isSearch = false
            alert("Please enter a search term")
        }
    }

    // Fetch popular anime
    const getPopularAnime = async () => {
        state.isSearch = false
        dispatch({ type: LOADING })
        const response = await fetch(`${baseApiUrl}/top/anime?filter=bypopularity&sfw`)
        const data = await response.json()

        // Filter out NSFW genres
        const filteredData = data.data.filter(anime =>
            !anime.genres.some(genre => genre.name.includes("Hentai") || genre.name.includes("Ecchi"))
        )

        dispatch({ type: GET_POPULAR_ANIME, payload: filteredData })
    }

    // Fetch upcoming anime
    const getUpcomingAnime = async () => {
        state.isSearch = false
        dispatch({ type: LOADING })
        const response = await fetch(`${baseApiUrl}/top/anime?filter=upcoming&sfw`)
        const data = await response.json()

        // Filter out NSFW genres
        const filteredData = data.data.filter(anime =>
            !anime.genres.some(genre => genre.name.includes("Hentai") || genre.name.includes("Ecchi"))
        )

        dispatch({ type: GET_UPCOMING_ANIME, payload: filteredData })
    }

    // Fetch airing anime
    const getAiringAnime = async () => {
        state.isSearch = false // disable search
        dispatch({ type: LOADING }) // enable loading
        const response = await fetch(`${baseApiUrl}/top/anime?filter=airing&sfw`) // fetch data
        const data = await response.json() // get data after fetch

        // Filter out NSFW genres
        const filteredData = data.data.filter(anime =>
            !anime.genres.some(genre => genre.name.includes("Hentai") || genre.name.includes("Ecchi"))
        )

        // Send data to to update getAiringAnime state
        dispatch({ type: GET_AIRING_ANIME, payload: filteredData })
    }

    // Fetch anime by search (sorted by popular and ascending order)
    const searchAnime = async (anime) => {
        dispatch({ type: LOADING })
        const response = await fetch(`${baseApiUrl}/anime?q=${anime}&order_by=popularity&sort=asc&sfw`)
        const data = await response.json()

        // Filter out NSFW genres
        const filteredData = data.data.filter(anime =>
            !anime.genres.some(genre => genre.name.includes("Hentai") || genre.name.includes("Ecchi"))
        )

        dispatch({ type: SEARCH, payload: filteredData })
    }

    // Initial render (to display popular anime first at home page)
    useEffect(() => {
        getPopularAnime()
    }, [])

    return (
        // Global variables
        <GlobalContext.Provider value={{
            ...state,
            handleChange,
            handleSubmit,
            searchAnime,
            search,
            getPopularAnime,
            getAiringAnime,
            getUpcomingAnime,
            setSearch,
            fixedSearch,
            SERVER_URL
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

// Set useGlobalContext to import this component
export const useGlobalContext = () => {
    return useContext(GlobalContext)
}