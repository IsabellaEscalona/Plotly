import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async () => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contraseña: password, usuario: username })
        })
        if (resp.ok) {
            alert("Usuario creado! Por favor inicia sesión.")
            navigate("/login")
        } else {
            alert("Algo salió mal): intenta de nuevo por favor.")
        }
    }

    /*falta mejorar este frontend jaja*/
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#1a1a2e", display: "flex",  justifyContent: "center" }}>
            <div style={{ backgroundColor: "black", borderRadius: "10px", width: "400px"}}>
                <h2 style={{ color: "white", textAlign: "center"}}>Plotly</h2>
                <h5 style={{ color: "white"}}>Crear cuenta</h5>
                <input type="text" placeholder="Usuario" className="form-control mb-3" onChange={e => setUsername(e.target.value)} />
                <input type="email" placeholder="Email" className="form-control mb-3" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Contraseña" className="form-control mb-3" onChange={e => setPassword(e.target.value)} />
                <button className="btn w-100" style={{ backgroundColor: "green", color: "white" }} onClick={handleSubmit}>
                    Registrarse
                </button>
                <p style={{ color: "gray", textAlign: "center", fontSize: "1rem" }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: "blue" }}>Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}