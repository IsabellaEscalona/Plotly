import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Me = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (!token) { navigate('/login'); return }
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.username) navigate(`/profile/${data.username}`, { replace: true })
                else navigate('/login')
            })
    }, [])
    return <p className="text-center mt-5" style={{ color: "#e0e0ff" }}>Cargando...</p>
}
