import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import placeholderImg from "../assets/img/placeholder.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import "./Home.css";

const OBRAS_SEGUIDOS = [
    { id: 1, titulo: "Obra Uno", autor: "Autor A" },
    { id: 2, titulo: "Obra Dos", autor: "Autor B" },
    { id: 3, titulo: "Obra Tres", autor: "Autor C" },
    { id: 4, titulo: "Obra Cuatro", autor: "Autor D" },
    { id: 5, titulo: "Obra Cinco", autor: "Autor E" },
    { id: 6, titulo: "Obra Seis", autor: "Autor F" },
    { id: 7, titulo: "Obra Siete", autor: "Autor G" },
    { id: 8, titulo: "Obra Ocho", autor: "Autor H" },
    { id: 9, titulo: "Obra Nueve", autor: "Autor I" },
    { id: 10, titulo: "Obra Die", autor: "Autor J" },
];

const OBRAS_NOVEDADES = [
    { id: 1, titulo: "Novedad Uno", autor: "Autor G" },
    { id: 2, titulo: "Novedad Dos", autor: "Autor F" },
    { id: 3, titulo: "Novedad Tres", autor: "Autor E" },
    { id: 4, titulo: "Novedad Cuatro", autor: "Autor D" },
    { id: 5, titulo: "Novedad Cinco", autor: "Autor C" },
    { id: 6, titulo: "Novedad Cinco", autor: "Autor B" },
    { id: 7, titulo: "Novedad Siete", autor: "Autor A" },
];

const VISIBLE = 6;

const Carrusel = ({ titulo, obras }) => {
    const [inicio, setInicio] = useState(0);
    const prev = () => setInicio(i => Math.max(0, i - 1));
    const next = () => setInicio(i => Math.min(obras.length - VISIBLE, i + 1));

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
                        <div key={obra.id} className="obra-card flex-grow-1">
                            <img src={placeholderImg} alt={obra.titulo} className="obra-portada" />
                            <div className="p-2">
                                <p className="mb-0 small fw-semibold text-truncate" style={{ color: "#e0e0ff" }}>
                                    {obra.titulo}
                                </p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>
                                    {obra.autor}
                                </p>
                            </div>
                        </div>
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
    const { store, dispatch } = useGlobalReducer();
    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")
            const response = await fetch(backendUrl + "/api/hello")
            const data = await response.json()
            if (response.ok) dispatch({ type: "set_hello", payload: data.message })
            return data
        } catch (error) {
            if (error.message) throw new Error(
                `Could not fetch the message from the backend. Please check if the backend is running and the backend port is public.`
            );
        }
    }

    useEffect(() => { loadMessage() }, [])

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ color: "#e0e0ff" }}>
                <h4 className="mb-4 fw-semibold">
                    ¡Bienvenido, {store?.user?.username || "lector"}!
                </h4>
                <Carrusel titulo="Seguidos" obras={OBRAS_SEGUIDOS} />
                <Carrusel titulo="Novedades" obras={OBRAS_NOVEDADES} />
                <hr style={{ borderColor: "#2a2a45" }} />
                <div className="text-center mt-4">
                    <h1 className="display-4">Hello Rigo!!</h1>
                    <p className="lead">
                        <img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
                    </p>
                    <div className="alert alert-info">
                        {store.message ? (
                            <span>{store.message}</span>
                        ) : (
                            <span className="text-danger">
                                Loading message from the backend (make sure your python 🐍 backend is running)...
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};