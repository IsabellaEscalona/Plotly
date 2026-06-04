import { NavLink } from "react-router-dom";
import "../Sidebar.css";

export const Sidebar = () => {
    return (
        <aside className="plotly-sidebar">
            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        "sidebar-link" + (isActive ? " active" : "")
                    }
                >
                    <i className="fa-solid fa-house"></i>
                    <span>Home</span>
                </NavLink>
                <NavLink
                    to="/MejoresObras"
                    className={({ isActive }) =>
                        "sidebar-link" + (isActive ? " active" : "")
                    }
                >
                    <i className="fa-solid fa-star"></i>
                    <span>Mejores Obras</span>
                </NavLink>
            </nav>
        </aside>
    );
};