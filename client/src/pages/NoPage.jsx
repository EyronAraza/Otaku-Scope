import { useEffect } from "react"

function NoPage() {
    useEffect(() => {
        // Tab title
        document.title = "404 Not Found | OtakuScope"
    }, [])

    return (
        <h1>404 Not Found</h1>
    )
}

export default NoPage