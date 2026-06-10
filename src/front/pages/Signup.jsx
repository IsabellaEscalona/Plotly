import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import logo from '../assets/img/logo-plotly.png'

export const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [tipo, setTipo] = useState("")
    const [artistType, setArtistType] = useState('Hybrid')
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
        if (!tipo) {
            setError("Selecciona un tipo de cuenta.")
            return
        }
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contraseña: password, usuario: username, tipo, artist_type: artistType })
        })
        if (resp.ok) {
            navigate("/login")
        } else {
            const data = await resp.json()
            setError(data.error || "Algo salió mal, intente de nuevo.")
        }
    }
    const tipoEstilo = {
        Artista: { activo: '#1a6ebd', borde: '#1a6ebd', fondo: '#1a6ebd22' },
        Lector: { activo: '#ac5353', borde: '#ac5353', fondo: '#8b1a1a22' }
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}>
            <div
                className="p-4 rounded-4 shadow"
                style={{ backgroundColor: "#1e1e2e", width: "100%", maxWidth: "420px" }}>
                    
                <div className="text-center mb-4">
                    <span><img src={logo} style={{ width: "90px" }}/></span>
                    <h4 className="text-white fw-bold mt-1">Plotly</h4>
                    <p className="text-secondary mb-0">Crea tu cuenta</p>
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
                    <div className="mb-4">
                        <label className="form-label text-secondary">Tipo de cuenta</label>
                        <div className="d-flex gap-3">
                            {['Artista', 'Lector'].map(t => (
                                <div
                                    key={t}
                                    onClick={() => setTipo(t)}
                                    className="flex-fill text-center p-3 rounded-3"
                                    style={{
                                        cursor: 'pointer',
                                        border: `2px solid ${tipo === t ? tipoEstilo[t].borde : '#6c757d'}`,
                                        backgroundColor: tipo === t ? tipoEstilo[t].fondo : 'transparent',
                                        color: tipo === t ? tipoEstilo[t].activo : '#adb5bd',
                                        transition: 'all 0.2s'
                                    }}>
                                    <i className={`fa-solid ${t === 'Artista' ? 'fa-pen-nib' : 'fa-book-open'}`}
                                        style={{ fontSize: '1.5rem' }} />
                                    <div className="fw-bold mt-1">{t}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {tipo === 'Artista' && (
                        <div className="mt-3">
                            <label className="form-label text-secondary">Tipo de artista</label>
                            <div className="d-flex gap-2">
                                {[
                                    { valor: 'Comic Artist', icono: 'fa-image' },
                                    { valor: 'Writer', icono: 'fa-feather' },
                                    { valor: 'Hybrid', icono: 'fa-layer-group' }
                                ].map(({ valor, icono }) => (
                                    <div
                                        key={valor}
                                        onClick={() => setArtistType(valor)}
                                        className="flex-fill text-center p-2 rounded-3"
                                        style={{
                                            cursor: 'pointer',
                                            border: `2px solid ${artistType === valor ? '#1a6ebd' : '#6c757d'}`,
                                            backgroundColor: artistType === valor ? '#1a6ebd22' : 'transparent',
                                            color: artistType === valor ? '#1a6ebd' : '#adb5bd',
                                            transition: 'all 0.2s'
                                        }}>
                                        <i className={`fa-solid ${icono}`} style={{ fontSize: '1.2rem' }} />
                                        <div className="fw-bold mt-1" style={{ fontSize: '0.8rem' }}>{valor}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button className="btn btn-primary w-100 fw-bold" onClick={handleSubmit}>
                    Registrarse
                </button>
                <p className="text-center text-secondary mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
                    ¿Tienes cuenta?{" "}
                    <Link to="/login" >Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}