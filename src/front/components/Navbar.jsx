import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState, useEffect } from "react";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "logout" });
        localStorage.clear();
        navigate("/login");
    };

    const [miFoto, setMiFoto] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setMiFoto(data.profile_picture) })
    }, [])

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [showResults, setShowResults] = useState(true)
    const handleSearch = async (e) => {
        const value = e.target.value
        setQuery(value)
        if (value.length < 2) { setResults([]); return }
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/search?q=" + encodeURIComponent(value))
        const data = await resp.json()
        setResults(data)
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                <span style={{ fontSize: "1.5rem" }}><i className="fa-solid fa-cubes"></i></span>
                <span className="fw-bold">Plotly</span>
            </Link>
            <div className="dropdown ms-3">
                <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
                    Categorías
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                    <li><Link className="dropdown-item" to="/categoria/Accion">Acción</Link></li>
                    <li><Link className="dropdown-item" to="/categoria/Romance">Romance</Link></li>
                    <li><Link className="dropdown-item" to="/categoria/Terror">Terror</Link></li>
                    <li><Link className="dropdown-item" to="/categoria/Fantasia">Fantasía</Link></li>
                    <li><Link className="dropdown-item" to="/categoria/Sci-Fi">Ciencia Ficción</Link></li>
                </ul>
            </div>

            <div className="mx-auto position-relative">
                <input className="form-control buscador" type="search" placeholder="Buscar obras..."
                    style={{
                        backgroundColor: "#1e1e2e",
                        color: "#e0e0ff",
                        border: "1px solid #2a2a45",
                        boxShadow: "none",
                        outline: "none"
                    }}
                    value={query} onChange={handleSearch}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    onFocus={() => setShowResults(true)}
                />
                {results.length > 0 && showResults && (
                    <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: "320px", overflowY: "auto" }}>
                        {results.slice(0, 6).map((obra) => (
                            <li key={obra.id} className="list-group-item p-0" style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a45" }}>
                                <Link
                                    to={`/comic/${obra.id}`}
                                    className="d-flex align-items-center gap-2 p-2 text-decoration-none"
                                    style={{ color: "#e0e0ff" }}
                                    onClick={() => { setShowResults(false); setQuery(""); setResults([]) }}
                                >
                                    <img
                                        src={obra.cover || ""}
                                        alt={obra.title}
                                        style={{ width: "32px", height: "44px", objectFit: "cover", borderRadius: "4px", flexShrink: 0, backgroundColor: "#2a2a45" }}
                                    />
                                    <div style={{ overflow: "hidden" }}>
                                        <div className="fw-semibold text-truncate" style={{ fontSize: "0.9rem" }}>{obra.title}</div>
                                        <div className="text-truncate" style={{ fontSize: "0.8rem", color: "#7070aa" }}>{obra.autor}</div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ddisponible cómic, falta escritura */}
            <div className="dropdown ms-3">
                <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
                    Subir
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                    <li><Link className="dropdown-item" to="/newComic">Cómic</Link></li>
                    <li><Link className="dropdown-item" to="/newHistory">Escritura</Link></li>
                </ul>
            </div>
            <div className="dropdown ms-3">
                <button className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                    {miFoto
                        ? <img src={miFoto} alt="perfil" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                        : <i className="fas fa-user-circle" style={{ fontSize: "1.5rem" }}></i>}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/me">Mi Perfil</Link></li>
                    <li><Link className="dropdown-item" to="/biblioteca">Biblioteca</Link></li>
                    <li><Link className="dropdown-item" to="/settings">Configuración</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar sesión</button></li>
                </ul>
            </div>
        </nav>
    );
};