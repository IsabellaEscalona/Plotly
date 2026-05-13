import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { dispatch } = useGlobalReducer()
    const navigate = useNavigate()


    const handleLogin = async () => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contraseña: password})
        })
        const data = await resp.json()
        if (resp.ok) {
            sessionStorage.setItem("token", data.token)
            dispatch({type:"set_token", payload: data.token})
            navigate("/me")
        } else {
            alert("Email o contraseña incorrectos. Intenta de nuevo!")
        }
    }
        
    
    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2>Iniciar sesión</h2>
            <input type="email" placeholder="Email" className="form-control mb-2" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" className="form-control mb-2" onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-success w-100" onClick={handleLogin}>Entrar</button>
        </div>
    )
}
