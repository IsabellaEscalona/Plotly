import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import placeholderImage from "../assets/img/placeholder.jpg"

export const Biblioteca = () => {
    const navigate = useNavigate()
    const [comics, setComics] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/library', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(r => r.json())
            .then(data => setComics(data))
    }, [])

    if (!comics) return <p className="text-center mt-5" style={{ color: "#e0e0ff" }}>Cargando...</p>

    return (
        <div className="px-4 py-4" style={{ color: "#e0e0ff" }}>
            <h3 className="fw-bold mb-4">
                <i className="fa-solid fa-bookmark me-2" style={{ color: "#c8b8ff" }}></i>
                Biblioteca
            </h3>

            {comics.length === 0 ? (
                <p style={{ color: "#888aaa" }}>¡Todavía no hay material en la biblioteca!</p>
            ) : (
                <div className="d-flex flex-wrap gap-4">
                    {comics.map(comic => (
                        <Link
                            key={comic.id}
                            to={`/comic/${comic.id}`}
                            style={{ textDecoration: "none", color: "#e0e0ff", width: "180px" }}
                        >
                            <img
                                src={comic.cover || placeholderImage}
                                alt={comic.title}
                                style={{ width: "180px", height: "260px", objectFit: "cover", borderRadius: "10px", display: "block" }}
                            />
                            <div className="mt-2 fw-bold" style={{ fontSize: "0.95rem" }}>{comic.title}</div>
                            <div style={{ color: "#888aaa", fontSize: "0.85rem" }}>{comic.autor}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}