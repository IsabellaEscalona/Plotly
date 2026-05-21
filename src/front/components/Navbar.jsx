import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "logout" });
        sessionStorage.clear();
        navigate("/login");
    };

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
			<div className="mx-auto">
                <input className="form-control" type="search" placeholder="Buscar..." />
            </div>
			{/* deshabilitado, primero hay que desarrollar bien el subir archivos */}
			<div className="dropdown ms-3">
                <button className="btn btn-dark dropdown-toggle disabled">
                    Subir
                </button>
            </div>
			<div className="dropdown ms-3">
                    <button className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                        <i className="fas fa-user-circle" style={{ fontSize: "1.5rem" }}></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><Link className="dropdown-item" to="/me">Mi Perfil</Link></li>
                        <li><a className="dropdown-item disabled" href="#">Notis</a></li>
                        <li><a className="dropdown-item disabled" href="#">Buzón</a></li>
                        <li><a className="dropdown-item disabled" href="#">Biblioteca</a></li>
                        <li><Link className="dropdown-item" to="/settings">Configuración</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar sesión</button></li>
                    </ul>
                </div>
		</nav>
	);
};