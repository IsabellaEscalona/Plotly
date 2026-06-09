import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Sidebar } from "../components/Sidebar.jsx"
import placeholderImage from "../assets/img/placeholder.jpg"

const GENEROS = {
    Accion: "Acción",
    Romance: "Romance",
    Terror: "Terror",
    Fantasia: "Fantasía",
    "Sci-Fi": "Ciencia Ficción"
}

export const CategoriaPage = () => {
    const { genero } = useParams()
    const [obras, setObras] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        setCargando(true)
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/feed")
            .then(r => r.json())
            .then(data => {
                const filtradas = data.filter(
                    o => o.principal_genre === genero || o.secondary_genre === genero
                )
                setObras(filtradas)
                setCargando(false)
            })
            .catch(() => setCargando(false))
    }, [genero])

    const nombreGenero = GENEROS[genero] || genero

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ color: "#e0e0ff", minWidth: 0 }}>
                <button className="btn btn-dark d-lg-none mb-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
                <h2 className="fw-bold mb-4">
                    <i className="fa-solid fa-layer-group me-2" style={{ color: "#c8b8ff" }}></i>
                    {nombreGenero}
                </h2>
                {cargando ? (
                    <p style={{ color: "#b0b0cc" }}>Cargando...</p>
                ) : (
                    <div className="d-flex flex-wrap gap-4">
                        {obras.map(obra => (
                            <Link key={obra.id} to={`/comic/${obra.id}`} style={{ textDecoration: "none", width: "180px" }}>
                                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "10px", overflow: "hidden", height: "100%" }}>
                                    <img src={obra.cover || placeholderImage} alt={obra.title}
                                        style={{ width: "100%", height: "240px", objectFit: "cover" }} />
                                    <div className="p-2">
                                        <p className="fw-bold mb-1" style={{ color: "#e0e0ff", fontSize: "0.95rem" }}>{obra.title}</p>
                                        <p className="mb-1" style={{ color: "#888aaa", fontSize: "0.8rem" }}>
                                            <i className="fa-solid fa-user me-1"></i>{obra.autor}
                                        </p>
                                        <p className="mb-0" style={{ color: "#c8b8ff", fontSize: "0.8rem" }}>
                                            <i className="fa-solid fa-bookmark me-1"></i>{obra.guardados}
                                        </p>
                                        <p className="mb-0" style={{ color: "#888aaa", fontSize: "0.8rem" }}>
                                            <i className="fa-regular fa-comment me-1"></i>{obra.comentarios}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}