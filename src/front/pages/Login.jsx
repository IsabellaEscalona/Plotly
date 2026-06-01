import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    const handleLogin = async () => {
        setError("")
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contraseña: password })
        })
        const data = await resp.json()

        if (resp.ok) {
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            localStorage.setItem("profile", JSON.stringify(data.profile))
            dispatch({ type: "set_token", payload: data.token })
            dispatch({ type: "set_user", payload: data.user })
            dispatch({ type: "set_profile", payload: data.profile })
            navigate("/me")
        } else {
            setError(data.error || "Email o contraseña incorrectos.")
        }
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}>
            <div
                className="p-4 rounded-4 shadow"
                style={{ backgroundColor: "#1e1e2e", width: "100%", maxWidth: "420px" }}>
                <div className="text-center mb-4">
                    <span style={{ fontSize: "2rem", color: "rgb(255, 255, 255)" }}>
                        <i className="fa-solid fa-cubes"></i>
                    </span>
                    <h4 className="text-white fw-bold mt-1">Plotly</h4>
                    <p className="text-secondary mb-0">Iniciar sesión</p>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="mb-3">
                    <label className="form-label text-secondary">Email</label>
                    <input
                        type="email"
                        className="form-control border-secondary"
                        placeholder="tu@email.com"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label text-secondary">Contraseña</label>
                    <input
                        type="password"
                        className="form-control border-secondary"
                        placeholder="******"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary w-100 fw-bold" onClick={handleLogin}>
                    Entrar
                </button>
                <p className="text-center">
                    <Link to="/reset-password" style={{ color: "gray" }}>¿Olvidaste tu contraseña?</Link>
                </p>
                <p className="text-center text-secondary mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
                    ¿No tienes cuenta?{" "}
                    <Link to="/signup">Regístrate</Link>
                </p>

            </div>
        </div>
    )
}