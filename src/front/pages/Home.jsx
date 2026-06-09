import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import placeholderImg from "../assets/img/placeholder.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";

import "./Home.css";

const VISIBLE = 8;

const Carrusel = ({ titulo, obras, mensajeVacio = "Todavía no hay obras para mostrar." }) => {
    const scrollRef = useRef(null);
    const scroll = (dir) => {
        scrollRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
    };

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
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "36px", height: "36px" }}
                    onClick={() => scroll(-1)}
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="d-flex gap-3 obra-scroll" ref={scrollRef}>
                    {obras.map(obra => (
                        <Link key={obra.id} to={`/comic/${obra.id}`} className="obra-card text-decoration-none">
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
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "36px", height: "36px" }}
                    onClick={() => scroll(1)}
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
    const [seguidos, setSeguidos] = useState([]);

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
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/feed/following", {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const obras = data.map(c => ({
                    id: c.id,
                    titulo: c.title,
                    autor: c.autor,
                    portada: c.cover
                }));
                setSeguidos(obras);
            })
            .catch(err => console.error("Error cargando seguidos:", err));
    }, []);

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ color: "#e0e0ff", minWidth: 0 }}>
                <button className="btn btn-dark d-lg-none mb-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
                <h4 className="mb-4 fw-semibold">
                    ¡Bienvenido, {store?.user?.username || "lector"}!
                </h4>
                <Carrusel
                    titulo="Seguidos"
                    obras={seguidos}
                    mensajeVacio="Sigue a artistas para ver sus obras"
                />
                <Carrusel titulo="Novedades" obras={novedades} />
            </div>
        </div>
    );
};