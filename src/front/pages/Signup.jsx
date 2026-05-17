import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError("")
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.")
            return
        }
        if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.")
        return
    }
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contraseña: password, usuario: username })
        })
        if (resp.ok) {
            navigate("/login")
        } else {
            const data = await resp.json()
            setError(data.error || "Algo salió mal, intente de nuevo.")
        }
    }

    return (
        <div 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: "100vh", backgroundColor: "#12121f" }}>
            <div 
            className="p-4 rounded-4 shadow" 
            style={{ backgroundColor: "#1e1e2e", width: "100%", maxWidth: "420px" }}>

                <div className="text-center mb-4">
                    <span style={{ fontSize: "2rem", color: "rgb(255, 255, 255)" }}><i class="fa-solid fa-cubes"></i></span>
                    <h4 className="text-white fw-bold mt-1">Plotly</h4>
                    <p className="text-secondary mb-0">Creá tu cuenta</p>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="mb-3">
                    <label className="form-label text-secondary">Usuario</label>
                    <input
                        type="text"
                        className="form-control border-secondary"
                        placeholder="nombre de usuario"
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-secondary">Email</label>
                    <input
                        type="email"
                        className="form-control border-secondary"
                        placeholder="ejemplo@email.com"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-secondary">Contraseña</label>
                    <input
                        type="password"
                        className="form-control border-secondary"
                        placeholder="********"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <small className="text-secondary d-block mb-1" style={{ fontSize: "0.89rem" }}>
                        Mínimo 6 caracteres
                    </small>
                </div>
                <div className="mb-4">
                    <label className="form-label text-secondary">Confirmar contraseña</label>
                    <input
                        type="password"
                        className="form-control border-secondary"
                        placeholder="********"
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary w-100 fw-bold" onClick={handleSubmit}>
                    Registrarse
                </button>
                <p className="text-center text-secondary mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
                    ¿Tienes cuenta?{" "}
                    <Link to="/login" >Iniciá sesión</Link>
                </p>
            </div>
        </div>
    )
}