import { useState } from "react"
import { Link } from "react-router-dom"
import placeholderImage from "../assets/img/placeholder.jpg"

const OBRA = {
    id: 1,
    titulo: "Titulo de la obra",
    autor: "pepitogamer06",
    portada: null,
    genero_principal: "Fantasía",
    genero_secundario: "Acción",
    descripcion: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus, saepe esse! Nesciunt, voluptates quasi! Earum placeat, beatae culpa molestiae temporibus ullam fugit iure perspiciatis rerum possimus voluptatum dolorem ea molestias non, cum hic doloremque!",
    likes: 110,
    vistas: 380,
    seguidores: 4,
    paginas: [
        placeholderImage,
        placeholderImage,
        placeholderImage,
        placeholderImage,
        placeholderImage,
    ]
}

const COMENTARIOS = [
    { id: 1, usuario: "juanceto01", texto: "Y esos auris de virgo momo?", fecha: "hace 2 días" },
    { id: 2, usuario: "elrubioONG", texto: "aaaaaaaaaaaaaaaaaaaaaaaaa", fecha: "hace 5 días" },
    { id: 3, usuario: "goku234", texto: "holasoygoku", fecha: "hace 1 semana" },
]

export const ComicPage = () => {
    const [siguiendo, setSiguiendo] = useState(false)
    const [guardado, setGuardado] = useState(false)
    const [comentario, setComentario] = useState("")

    return (
        <div style={{ color: "#ffffff" }}>
            <div className="d-flex gap-4 px-4 py-4 flex-wrap" style={{ backgroundColor: "#1e1e2e" }}>
                <img
                    src={OBRA.portada || placeholderImage}
                    alt={OBRA.titulo}
                    style={{ width: "130px", height: "190px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }}
                />

                <div className="flex-grow-1">
                    <h3 className="fw-bold mb-1">{OBRA.titulo}</h3>
                    <p className="mb-2">
                        <i className="fa-solid fa-user me-2"></i>
                        {/* hay que remplazar el "/me" por la id del usuario, ya que en realidad este link es para el perfil porpio y no ajeno */}
                        <Link to="/me" style={{ color: "#ffffff", textDecoration: "none" }}>{OBRA.autor}</Link>
                    </p>

                    <div className="d-flex gap-2 mb-2">
                        <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#2a2a45", color: "#c8b8ff" }}>
                            {OBRA.genero_principal}
                        </span>
                        {OBRA.genero_secundario && (
                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#2a2a45", color: "#c8b8ff" }}>
                                {OBRA.genero_secundario}
                            </span>
                        )}
                    </div>

                    <p className="mb-3" style={{ color: "#b0b0cc", fontSize: "0.9rem", maxWidth: "600px" }}>{OBRA.descripcion}</p>
                    <div className="d-flex gap-4 mb-3" style={{ color: "#888aaa" }}>
                        <span><i className="fa-solid fa-eye me-1"></i>{OBRA.vistas.toLocaleString()}</span>
                        <span><i className="fa-solid fa-heart me-1"></i>{OBRA.likes.toLocaleString()}</span>
                        <span><i className="fa-solid fa-bookmark me-1"></i>{OBRA.seguidores.toLocaleString()}</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn fw-bold px-4"
                            onClick={() => setSiguiendo(!siguiendo)}
                            style={{
                                backgroundColor: siguiendo ? "#2a2a45" : "#c8b8ff",
                                color: siguiendo ? "#c8b8ff" : "#12121f",
                                border: "none"
                            }}
                        >
                            <i className={`fa-solid ${siguiendo ? "fa-check" : "fa-plus"} me-2`}></i>
                            {siguiendo ? "Siguiendo" : "Seguir"}
                        </button>
                        <button
                            className="btn px-3"
                            onClick={() => setGuardado(!guardado)}
                            style={{ backgroundColor: "#2a2a45", color: guardado ? "#c8b8ff" : "#888aaa", border: "none" }}
                        >
                            <i className={`fa-${guardado ? "solid" : "regular"} fa-bookmark`}></i>
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: "#000000", paddingTop: "32px", paddingBottom: "30px" }}>
                <div className="d-flex flex-column align-items-center" style={{ gap: "12px" }}>
                    {OBRA.paginas.map((pagina, index) => (
                        <img
                            key={index}
                            src={pagina}
                            alt={`Página ${index + 1}`}
                            style={{
                                width: "100%",
                                maxWidth: "450px",
                                aspectRatio: "2 / 3",
                                objectFit: "cover",
                                display: "block"
                            }}
                        />
                    ))}
                </div>
            </div>
            {/* los comentarios (al igual que todos los elementos) no funcionan, está todo 
            hardcodeado, cuando el post de comics quede realizado ya haremos esta page funcional */}
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
                        style={{ backgroundColor: "#ffffff", border: "1px solid #3a3a55", color: "#e0e0ff" }}
                    />
                    <button
                        className="btn px-3 fw-bold"
                        style={{ backgroundColor: "#ffffff", color: "#12121f", whiteSpace: "nowrap" }}
                    >
                        Enviar
                    </button>
                </div>
                <div className="d-flex flex-column gap-4">
                    {COMENTARIOS.map(c => (
                        <div key={c.id} className="d-flex gap-3">
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "50%",
                                backgroundColor: "#2a2a45", flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <i className="fa-solid fa-user" style={{ color: "#c8b8ff" }}></i>
                            </div>
                            <div>
                                <div className="d-flex gap-2 align-items-center mb-1">
                                    <span className="fw-bold" style={{ color: "#ffffff", fontSize: "0.9rem" }}>{c.usuario}</span>
                                    <span style={{ color: "#555", fontSize: "0.8rem" }}>{c.fecha}</span>
                                </div>
                                <p className="mb-0" style={{ color: "#b0b0cc", fontSize: "0.95rem" }}>{c.texto}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}