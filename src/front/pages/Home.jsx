import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import placeholderImg from "../assets/img/placeholder.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import "./Home.css";

const VISIBLE = 8;

const Carrusel = ({ titulo, obras, mensajeVacio = "Todavía no hay obras para mostrar." }) => {
    const [inicio, setInicio] = useState(0);
    const prev = () => setInicio(i => Math.max(0, i - 1));
    const next = () => setInicio(i => Math.min(obras.length - VISIBLE, i + 1));

    if (obras.length === 0) {
        return (
            <div className="mb-5">
                <h5 className="mb-3 fw-semibold" style={{ color: "#c8b8ff" }}>{titulo}</h5>
                <p className="small" style={{ color: "#7070aa" }}>{mensajeVacio}</p>
            </div>
        );
    }

    return (
        <div className="mb-5">
            <h5 className="mb-3 fw-semibold" style={{ color: "#c8b8ff" }}>{titulo}</h5>
            <div className="d-flex align-items-center gap-2">
                <button
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "36px", height: "36px" }}
                    onClick={prev}
                    disabled={inicio === 0}
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="d-flex gap-3">
                    {obras.slice(inicio, inicio + VISIBLE).map(obra => (
                        <Link key={obra.id} to={`/comic/${obra.id}`} className="obra-card flex-grow-1 text-decoration-none">
                            <img src={obra.portada || placeholderImg} alt={obra.titulo} className="obra-portada" />
                            <div className="p-2">
                                <p className="mb-0 small fw-semibold text-truncate" style={{ color: "#e0e0ff" }}>
                                    {obra.titulo}
                                </p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>
                                    {obra.autor}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                <button
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "36px", height: "36px" }}
                    onClick={next}
                    disabled={inicio >= obras.length - VISIBLE}
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

export const Home = () => {
    const { store } = useGlobalReducer();
    const [novedades, setNovedades] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/feed")
            .then(r => r.json())
            .then(data => {
                const obras = data.map(c => ({
                    id: c.id,
                    titulo: c.title,
                    autor: c.autor,
                    portada: c.cover
                }));
                setNovedades(obras);
            })
            .catch(err => console.error("Error cargando el feed:", err));
    }, []);

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ color: "#e0e0ff" }}>
                <h4 className="mb-4 fw-semibold">
                    ¡Bienvenido, {store?.user?.username || "lector"}!
                </h4>
                {/* Aun no funcional, falta terminar y pulir los seguidores */}
                <Carrusel
                    titulo="Seguidos"
                    obras={[]}
                    mensajeVacio="Sigue a artistas para ver sus obras"
                />
                <Carrusel titulo="Novedades" obras={novedades} />
            </div>
        </div>
    );
};