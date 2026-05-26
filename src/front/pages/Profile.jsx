import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import useGlobalReducer from '../hooks/useGlobalReducer'
import "./Profile.css"

const OBRAS_DESTACADAS = [
    { id: 1, titulo: "Obra Uno", portada: null },
    { id: 2, titulo: "Obra Dos", portada: null },
    { id: 3, titulo: "Obra Tres", portada: null },
]

const MEDALLAS = ["#FFD700", "#C0C0C0", "#CD7F32"]

export const Profile = () => {
    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const [bioExpandida, setBioExpandida] = useState(false)

    const bio = store?.profile?.bio || "Sin bio todavía..."
    const bioCorta = bio.length > 120 ? bio.slice(0, 120) + "..." : bio

    return (
        <div className="profile-page">
            <div className="profile-banner"></div>
            <div className="container py-3">
                <div className="row">
                    <div className="col-3 profile-left">
                        <img
                            src={store?.profile?.profile_picture || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"}
                            alt="avatar"
                            className="profile-avatar"
                        />
                        <h5 className="mb-0 fw-bold mt-2" style={{ color: "#e0e0ff" }}>
                            {store?.user?.username || "Usuario"}
                        </h5>
                        {store?.profile?.artist_type && (
                            <p className="mb-0 small" style={{ color: "#a0a0c0" }}>
                                {store.profile.artist_type}
                            </p>
                        )}
                        {store?.profile?.tipo && (
                            <span className="profile-tipo">
                                <i className={`fa-solid me-1 ${store.profile.tipo === 'Artista' ? 'fa-pen-nib' : 'fa-book-open'}`} />
                                {store.profile.tipo}
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
                            {store?.profile?.instagram && (
                                <a href={`https://instagram.com/${store.profile.instagram}`} target="_blank" className="profile-link">
                                    <i className="fa-brands fa-instagram me-1"></i>{store.profile.instagram}
                                </a>
                            )}
                            {store?.profile?.twitter && (
                                <a href={`https://twitter.com/${store.profile.twitter}`} target="_blank" className="profile-link">
                                    <i className="fa-brands fa-x-twitter me-1"></i>{store.profile.twitter}
                                </a>
                            )}
                        </div>
                        <button className="btn btn-sm mt-3 profile-btn-ajustes" onClick={() => navigate('/settings')}>
                            <i className="fa-solid fa-gear me-1"></i>Ajustes
                        </button>
                    </div>
                    <div className="col-9 profile-right pt-3">
                        <div className="d-flex gap-4 mb-4">
                            <div className="text-center">
                                <p className="mb-0 fw-bold" style={{ color: "#e0e0ff" }}>253</p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="mb-0 fw-bold" style={{ color: "#e0e0ff" }}>1026</p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>Seguidores</p>
                            </div>
                            <div className="text-center">
                                <p className="mb-0 fw-bold" style={{ color: "#e0e0ff" }}>478</p>
                                <p className="mb-0 small" style={{ color: "#7070aa" }}>Seguidos</p>
                            </div>
                        </div>
                        <p className="mb-2 fw-semibold" style={{ color: "#e0e0ff" }}>
                            Obras destacadas <i class="fa-solid fa-star"></i>
                        </p>
                        <div className="d-flex gap-3">
                            {OBRAS_DESTACADAS.map((obra, i) => (
                                <div key={obra.id} className="obra-destacada">
                                    <div className="obra-destacada-img"></div>
                                    <span className="obra-medalla" style={{ backgroundColor: MEDALLAS[i] }}>
                                        {i + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}