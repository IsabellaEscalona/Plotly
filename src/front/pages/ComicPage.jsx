import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import placeholderImage from "../assets/img/placeholder.jpg"

export const ComicPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [obra, setObra] = useState(null)
    const [guardado, setGuardado] = useState(false)
    const [comentario, setComentario] = useState("")

    const cargarComic = () => {
        const token = sessionStorage.getItem('token')
        fetch(import.meta.env.VITE_BACKEND_URL + `/api/comic/${id}`, {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        })
            .then(r => r.json())
            .then(data => {
                setObra(data)
                setGuardado(data.guardado)
            })
    }

    useEffect(() => {
        cargarComic()
    }, [id])

    const handleComentar = () => {
        const token = sessionStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }
        if (!comentario.trim()) return
        fetch(import.meta.env.VITE_BACKEND_URL + `/api/comic/${id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ content: comentario })
        })
            .then(r => {
                if (r.ok) {
                    setComentario("")
                    cargarComic()
                }
            })
    }
    const handleGuardar = () => {
        const token = sessionStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + `/api/save/${id}`, {
            method: guardado ? 'DELETE' : 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(r => {
                if (r.ok) setGuardado(!guardado)
            })
    }

    if (!obra) return <p className="text-center mt-5" style={{ color: "#e0e0ff" }}>Cargando...</p>

    return (
        <div style={{ color: "#ffffff" }}>
            <div className="d-flex gap-4 px-4 py-4 flex-wrap" style={{ backgroundColor: "#1e1e2e" }}>
                <img
                    src={obra.cover || placeholderImage}
                    alt={obra.title}
                    style={{ width: "130px", height: "190px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }}
                />
                <div className="flex-grow-1">
                    <h3 className="fw-bold mb-1">{obra.title}</h3>
                    <p className="mb-2">
                        <i className="fa-solid fa-user me-2"></i>
                        <Link to={`/profile/${obra.autor}`} style={{ color: "#ffffff", textDecoration: "none" }}>{obra.autor}</Link>
                    </p>
                    <div className="d-flex gap-2 mb-2">
                        <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#2a2a45", color: "#c8b8ff" }}>
                            {obra.principal_genre}
                        </span>
                        {obra.secondary_genre && (
                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#2a2a45", color: "#c8b8ff" }}>
                                {obra.secondary_genre}
                            </span>
                        )}
                    </div>
                    <p className="mb-3" style={{ color: "#b0b0cc", fontSize: "0.9rem", maxWidth: "600px" }}>{obra.description}</p>
                    <div className="d-flex gap-2">
                        <button
                            className="btn px-3"
                            onClick={handleGuardar}
                            style={{ backgroundColor: "#2a2a45", color: guardado ? "#c8b8ff" : "#888aaa", border: "none" }}
                        >
                            <i className={`fa-${guardado ? "solid" : "regular"} fa-bookmark`}></i>
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: "#000000", paddingTop: "32px", paddingBottom: "30px" }}>
                <div className="d-flex flex-column align-items-center" style={{ gap: "12px" }}>
                    {(obra.paginas || []).map((pagina, index) => (
                        <img
                            key={index}
                            src={pagina}
                            alt={`Página ${index + 1}`}
                            style={{ width: "100%", maxWidth: "600px", height: "auto", display: "block" }}
                        />
                    ))}
                </div>
            </div>

            <div className="px-4 py-5" style={{ backgroundColor: "#1e1e2e" }}>
                <h5 className="fw-bold mb-4">
                    <i className="fa-solid fa-comments me-2"></i>Comentarios
                </h5>
                <div className="d-flex gap-2 mb-5">
                    <input
                        className="form-control"
                        placeholder="Escribe un comentario..."
                        value={comentario}
                        onChange={e => setComentario(e.target.value)}
                        style={{ backgroundColor: "#ffffff", border: "1px solid #3a3a55", color: "#2c2c2c" }}
                    />
                    <button className="btn px-3 fw-bold" onClick={handleComentar} style={{ backgroundColor: "#c8b8ff", color: "#12121f", whiteSpace: "nowrap" }}>
                        Enviar
                    </button>
                </div>
                <div className="d-flex flex-column gap-4">
                    {(obra.comentarios || []).map(c => (
                        <div key={c.id} className="d-flex gap-3">
                            <Link to={`/profile/${c.usuario}`} style={{ flexShrink: 0 }}>
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "50%",
                                    backgroundColor: "#2a2a45",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                    <i className="fa-solid fa-user" style={{ color: "#c8b8ff" }}></i>
                                </div>
                            </Link>
                            <div>
                                <Link to={`/profile/${c.usuario}`} className="fw-bold mb-1 d-block" style={{ color: "#ffffff", fontSize: "0.9rem", textDecoration: "none" }}>
                                    {c.usuario}
                                </Link>
                                <p className="mb-0" style={{ color: "#b0b0cc", fontSize: "0.95rem" }}>{c.texto}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}