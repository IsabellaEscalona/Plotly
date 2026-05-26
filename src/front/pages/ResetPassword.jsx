import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export const ResetPassword = () => {
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden!")
            return
        }
        if (newPassword.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres")
            return
        }
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/reset-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, nueva_contraseña: newPassword })
        })
        if (resp.ok) {
            alert("Contraseña restablecida! Inicia sesión")
            navigate("/login")
        } else {
            alert("Credenciales inválidas.")
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h4>Restablecer contraseña</h4>
            <input type="email" placeholder="Email" className="form-control mb-2" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Nueva contraseña" className="form-control mb-2" onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirmar contraseña" className="form-control mb-3" onChange={e => setConfirmPassword(e.target.value)} />
            <button className="btn btn-primary w-100" onClick={handleSubmit}>Restablecer</button>
            <p className="text-center mt-3">
                <Link to="/login">Volver</Link>
            </p>
        </div>
    )
}