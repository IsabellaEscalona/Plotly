import { NavLink } from "react-router-dom";
import "../Sidebar.css";

export const Sidebar = () => {
    const cerrarMenu = () => {
        document.querySelector("#sidebarMenu .btn-close")?.click();
    };
    return (
        <div className="offcanvas-lg offcanvas-start plotly-sidebar" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
            <div className="offcanvas-header d-lg-none">
                <h5 className="offcanvas-title" id="sidebarMenuLabel">Menú</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Cerrar"></button>
            </div>
            <div className="offcanvas-body">
                <nav className="sidebar-nav">
                    <NavLink to="/" end onClick={cerrarMenu}
                        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
                        <i className="fa-solid fa-house"></i>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/MejoresObras" onClick={cerrarMenu}
                        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
                        <i className="fa-solid fa-star"></i>
                        <span>Mejores Obras</span>
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};