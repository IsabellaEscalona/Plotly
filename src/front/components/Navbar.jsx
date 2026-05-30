import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "logout" });
        sessionStorage.clear();
        navigate("/login");
    };

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [showResults, setShowResults] = useState(true)
    const handleSearch = async (e) => {
        const value = e.target.value
        setQuery(value)
        if (value.length < 3) { setResults([]); return }
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/search-books?q=" + value)
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
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item">Acción</a></li>
                    <li><a className="dropdown-item">Romance</a></li>
                    <li><a className="dropdown-item">Terror</a></li>
                    <li><a className="dropdown-item">Fantasía</a></li>
                    <li><a className="dropdown-item">Ciencia Ficción</a></li>
                </ul>
            </div>


            <div className="mx-auto position-relative">
                <input className="form-control" type="search" placeholder="Buscar libros..."
                    value={query} onChange={handleSearch}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    onFocus={() => setShowResults(true)}
                />
                {results.length > 0 && showResults && (
                    <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                        {results.slice(0, 5).map((book, i) => (
                            <li key={i} className="list-group-item d-flex align-items-center gap-2">
                                {book.cover && <img src={book.cover} style={{ height: "40px" }} />}
                                <span>{book.title} - {book.author}</span>
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
                <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/newComic">Cómic</Link></li>
                    <li><a className="dropdown-item disabled" href="#">Escritura</a></li>
                </ul>
            </div>
            <div className="dropdown ms-3">
                <button className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                    <i className="fas fa-user-circle" style={{ fontSize: "1.5rem" }}></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/me">Mi Perfil</Link></li>
                    <li><a className="dropdown-item disabled" href="#">Notis</a></li>
                    <li><a className="dropdown-item disabled" href="#">Buzón</a></li>
                    <li><Link className="dropdown-item" to="/biblioteca">Biblioteca</Link></li>
                    <li><Link className="dropdown-item" to="/settings">Configuración</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar sesión</button></li>
                </ul>
            </div>
        </nav>
    );
};