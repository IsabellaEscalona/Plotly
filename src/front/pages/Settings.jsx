import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGlobalReducer from '../hooks/useGlobalReducer'

export const Settings = () => {
    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: '', email: '', password: '',
        bio: '', instagram: '', twitter: ''
    })
    const [mensaje, setMensaje] = useState('')
    useEffect(() => {
        const token = store.token || sessionStorage.getItem("token")
        const fetchMe = async () => {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            const data = await resp.json()
            setForm({
                username: data.username || '',
                email: data.email || '',
                password: '',
                bio: data.bio || '',
                instagram: data.instagram || '',
                twitter: data.twitter || ''
            })
        }
        if (token) fetchMe()
    }, [store.token])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleSave = async () => {
        const token = store.token || sessionStorage.getItem("token")
        if (!token) {
            setMensaje("no hay cuenta")
            return
        }
        const body = Object.fromEntries(
            Object.entries(form).filter(([_, v]) => v !== '')
        )
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(body)
        })
        if (resp.ok) {
            setMensaje('perfil actualizado')
            setTimeout(() => navigate('/me'), 1500)
        } else {
            setMensaje('algo salió mal')
        }
    }

    return (
        <div className="container py-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Configuración de perfil</h2>
            {mensaje && <div className="alert alert-info">{mensaje}</div>}
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input className="form-control" name="username" value={form.username} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <label className="form-label">Nueva contraseña</label>
                    <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Instagram</label>
                    <input className="form-control" name="instagram" value={form.instagram} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Twitter</label>
                    <input className="form-control" name="twitter" value={form.twitter} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} rows={3} />
                </div>
                <div className="col-12 d-flex gap-2">
                    <button className="btn btn-dark" onClick={handleSave}>Guardar cambios</button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/me')}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}