import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import "./Profile.css"

const MEDALLAS = ["#FFD700", "#C0C0C0", "#CD7F32"]
const AVATAR_DEFAULT = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"

export const UserProfile = () => {
    const { username } = useParams()
    const navigate = useNavigate()
    const [perfil, setPerfil] = useState(null)
    const [usuarioActual, setUsuarioActual] = useState(null)
    const [bioExpandida, setBioExpandida] = useState(false)
    const [siguiendo, setSiguiendo] = useState(false)
    const [seguidores, setSeguidores] = useState(0)
    const [modal, setModal] = useState(null)
    const [lista, setLista] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {}
        fetch(import.meta.env.VITE_BACKEND_URL + `/api/profile/${username}`, { headers })
            .then(r => r.json())
            .then(data => {
                setPerfil(data)
                setSiguiendo(!!data.is_following)
                setSeguidores(data.followers_count || 0)
            })
    }, [username])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => setUsuarioActual(data))
    }, [])

    const toggleSeguir = async () => {
        const token = localStorage.getItem('token')
        if (!token) { navigate('/login'); return }
        const metodo = siguiendo ? 'DELETE' : 'POST'
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/follow/${perfil.id}`, {
            method: metodo,
            headers: { 'Authorization': 'Bearer ' + token }
        })
        if (resp.ok) {
            setSeguidores(prev => siguiendo ? prev - 1 : prev + 1)
            setSiguiendo(!siguiendo)
        }
    }

    const abrirLista = async (tipo) => {
        const token = localStorage.getItem('token')
        if (!token) return 
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/profile/${username}/${tipo}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        if (resp.ok) {
            setLista(await resp.json())
            setModal(tipo)
        }
    }

    if (!perfil) return <p className="text-center mt-5" style={{ color: "#e0e0ff" }}>Cargando...</p>
    if (perfil.error) return <h1 className="text-center mt-5" style={{ color: "#e0e0ff" }}>Usuario no encontrado</h1>

    const esMiPerfil = usuarioActual?.username === perfil.username
    const esArtista = perfil.tipo === 'Artista'
    const bio = perfil.bio || "Sin bio todavía..."
    const bioCorta = bio.length > 120 ? bio.slice(0, 120) + "..." : bio

    return (
        <div className="profile-page">
            <div className="profile-banner"></div>
            <div className="container py-3">
                <div className="row">
                    <div className="col-3 profile-left">
                        <img
                            src={perfil.profile_picture || AVATAR_DEFAULT}
                            alt="avatar"
                            className="profile-avatar"
                        />
                        <h5 className="mb-0 fw-bold mt-2" style={{ color: "#e0e0ff" }}>
                            {perfil.username}
                        </h5>
                        {perfil.artist_type && (
                            <p className="mb-0 small" style={{ color: "#a0a0c0" }}>
                                {perfil.artist_type}
                            </p>
                        )}
                        {perfil.tipo && (
                            <span className="profile-tipo">
                                <i className={`fa-solid me-1 ${esArtista ? 'fa-pen-nib' : 'fa-book-open'}`} />
                                {perfil.tipo}
                            </span>
                        )}
                        <div className="profile-bio mt-3">
                            <p className="mb-1 small" style={{ color: "#a0a0c0" }}>
                                {bioExpandida ? bio : bioCorta}
                            </p>
                            {bio.length > 120 && (
                                <button className="btn btn-link p-0 small profile-leermas" onClick={() => setBioExpandida(!bioExpandida)}>
                                    {bioExpandida ? "Leer menos" : "Leer más..."}
                                </button>
                            )}
                        </div>
                        <div className="d-flex flex-column gap-1 mt-2">
                            {perfil.instagram && (
                                <a href={`https://instagram.com/${perfil.instagram}`} target="_blank" className="profile-link">
                                    <i className="fa-brands fa-instagram me-1"></i>{perfil.instagram}
                                </a>
                            )}
                            {perfil.twitter && (
                                <a href={`https://twitter.com/${perfil.twitter}`} target="_blank" className="profile-link">
                                    <i className="fa-brands fa-x-twitter me-1"></i>{perfil.twitter}
                                </a>
                            )}
                        </div>
                        {esMiPerfil && (
                            <button className="btn btn-sm mt-3 profile-btn-ajustes" onClick={() => navigate('/settings')}>
                                <i className="fa-solid fa-gear me-1"></i>Ajustes
                            </button>
                        )}
                        {!esMiPerfil && usuarioActual && (
                            <button
                                className="btn btn-sm mt-3"
                                onClick={toggleSeguir}
                                style={siguiendo
                                    ? { backgroundColor: 'transparent', border: '1px solid #c8b8ff', color: '#c8b8ff' }
                                    : { backgroundColor: '#c8b8ff', border: 'none', color: '#12121f', fontWeight: 600 }}
                            >
                                <i className={`fa-solid me-1 ${siguiendo ? 'fa-check' : 'fa-plus'}`}></i>
                                {siguiendo ? 'Siguiendo' : 'Seguir'}
                            </button>
                        )}
                    </div>
                    <div className="col-9 profile-right pt-3">
                        <div className="d-flex gap-4 mb-4">
                            <div className="text-center">
                                <p className="mb-0 fw-bold" style={{ color: "#e0e0ff" }}>{perfil.posts.length}</p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>Posts</p>
                            </div>
                            <div
                                className="text-center"
                                style={usuarioActual ? { cursor: "pointer" } : {}}
                                onClick={usuarioActual ? () => abrirLista('followers') : undefined}
                            >
                                <p className="mb-0 fw-bold" style={{ color: "#e0e0ff" }}>{seguidores}</p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>Seguidores</p>
                            </div>
                            <div
                                className="text-center"
                                style={usuarioActual ? { cursor: "pointer" } : {}}
                                onClick={usuarioActual ? () => abrirLista('following') : undefined}
                            >
                                <p className="mb-0 fw-bold" style={{ color: "#e0e0ff" }}>{perfil.following_count}</p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>Seguidos</p>
                            </div>
                        </div>
                        {esArtista && (
                            <>
                                <p className="mb-2 fw-semibold" style={{ color: "#e0e0ff" }}>
                                    Obras destacadas <i className="fa-solid fa-star"></i>
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    {perfil.posts.map((obra, i) => (
                                        <Link key={obra.id} to={`/comic/${obra.id}`} className="obra-destacada" style={{ textDecoration: "none" }}>
                                            <div
                                                className="obra-destacada-img"
                                                style={{
                                                    backgroundImage: `url(${obra.cover || ''})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center"
                                                }}
                                            ></div>
                                            {i < 3 && (
                                                <span className="obra-medalla" style={{ backgroundColor: MEDALLAS[i] }}>
                                                    {i + 1}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {modal && (
                <div
                    onClick={() => setModal(null)}
                    style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{ backgroundColor: "#1e1e2e", border: "1px solid #2a2a45", borderRadius: "12px", width: "90%", maxWidth: "400px", maxHeight: "70vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
                    >
                        <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ borderBottom: "1px solid #2a2a45" }}>
                            <span className="fw-bold" style={{ color: "#e0e0ff" }}>
                                {modal === 'followers' ? 'Seguidores' : 'Seguidos'}
                            </span>
                            <button onClick={() => setModal(null)} className="btn p-0" style={{ background: "none", border: "none", color: "#a0a0c0" }}>
                                <i className="fa-solid fa-xmark" style={{ fontSize: "1.2rem" }}></i>
                            </button>
                        </div>
                        <div style={{ overflowY: "auto" }}>
                            {lista.length === 0 ? (
                                <p className="text-center py-4 mb-0" style={{ color: "#7070aa" }}>
                                    {modal === 'followers' ? 'Todavía no tiene seguidores' : 'Todavía no sigue a nadie'}
                                </p>
                            ) : (
                                lista.map((u, i) => (
                                    <Link
                                        key={i}
                                        to={`/profile/${u.username}`}
                                        onClick={() => setModal(null)}
                                        className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                                        style={{ color: "#e0e0ff" }}
                                    >
                                        <img
                                            src={u.profile_picture || AVATAR_DEFAULT}
                                            alt={u.username}
                                            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                        <span className="fw-semibold">{u.username}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}