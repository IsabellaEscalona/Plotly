import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../components/Sidebar.jsx"
import placeholderImg from "../assets/img/placeholder.jpg"
import "./Home.css"

export const MejoresObras = () => {
    const [obras, setObras] = useState(null)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/feed")
            .then(r => r.json())
            .then(data => {
                const ordenadas = [...data].sort((a, b) => b.guardados - a.guardados)
                setObras(ordenadas)
            })
            .catch(err => console.error("Error cargando mejores obras:", err))
    }, [])

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ color: "#e0e0ff", minWidth: 0 }}>
                <button className="btn btn-dark d-lg-none mb-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
                <h4 className="mb-4 fw-semibold">
                    Mejores Obras
                </h4>
                {obras === null ? (
                    <p style={{ color: "#7070aa" }}>Cargando...</p>
                ) : obras.length === 0 ? (
                    <p style={{ color: "#7070aa" }}>Todavía no hay obras para mostrar.</p>
                ) : (
                    <div className="d-flex flex-wrap gap-3">
                        {obras.map(obra => (
                            <Link key={obra.id} to={`/comic/${obra.id}`} className="obra-card text-decoration-none" style={{ width: "160px" }}>
                                <img src={obra.cover || placeholderImg} alt={obra.title} className="obra-portada" />
                                <div className="p-2">
                                    <p className="mb-0 small fw-semibold text-truncate" style={{ color: "#e0e0ff" }}>
                                        {obra.title}
                                    </p>
                                    <p className="mb-0 small" style={{ color: "#7070aa" }}>
                                        {obra.autor}
                                    </p>
                                    <p className="mb-0 small" style={{ color: "#c8b8ff" }}>
                                        <i className="fa-solid fa-bookmark me-1"></i>{obra.guardados}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}