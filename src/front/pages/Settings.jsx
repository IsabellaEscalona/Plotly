import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGlobalReducer from '../hooks/useGlobalReducer'

export const Settings = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', email: '', bio: '', instagram: '', twitter: '' })
    const [pass, setPass] = useState({ actual: '', nueva: '', confirmar: '' })
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const token = store.token || sessionStorage.getItem("token")
        if (!token) return
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json()).then(data => setForm({
            username: data.username || '', email: data.email || '',
            bio: data.bio || '', instagram: data.instagram || '', twitter: data.twitter || ''
        }))
    }, [store.token])
    const handleSave = async () => {
    setMensaje(''); setError('')
    const token = store.token || sessionStorage.getItem("token")
    if (!token) { setError("No hay sesión activa"); return }
    if (pass.actual || pass.nueva || pass.confirmar) {
        if (!pass.actual || !pass.nueva || !pass.confirmar) {
            setError('Completa los tres campos de contraseña'); return
        }
        if (pass.nueva !== pass.confirmar) {
            setError('Las contraseñas nuevas no coinciden'); return
        }
        if (pass.nueva.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres'); return
        }
    }
    const body = Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== ''))
    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(body)
    })
    if (!resp.ok) { setError('Error al guardar el perfil'); return }
    const data = await resp.json()
    dispatch({ type: "set_user", payload: data.user })
    dispatch({ type: "set_profile", payload: data.profile })
    setMensaje("Perfil actualizado")
    if (pass.actual) {
        const passResp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/change-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({
                "contraseña_actual": pass.actual,
                "nueva_contraseña": pass.nueva
            })
        })
        const passData = await passResp.json()
        if (passResp.ok) {
            setPass({ actual: '', nueva: '', confirmar: '' })
            setMensaje('Perfil y contraseña actualizados')
        } else {
            setError(passData.error || 'Error al cambiar la contraseña')
        }
    }
}

    return (
        <div className="container py-5" style={{ maxWidth: '600px', color: '#e0e0ff' }}>
            <h2 className="mb-4">Configuración de perfil</h2>
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input className="form-control" name="username" value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })} />
                </div>
                {/* email aun no recibe cambio correctamente*/}
                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" name="email" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Instagram</label>
                    <input className="form-control" name="instagram" value={form.instagram}
                        onChange={e => setForm({ ...form, instagram: e.target.value })} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Twitter</label>
                    <input className="form-control" name="twitter" value={form.twitter}
                        onChange={e => setForm({ ...form, twitter: e.target.value })} />
                </div>
                <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" name="bio" value={form.bio} rows={3}
                        onChange={e => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="col-12"><hr /></div>
                <div className="col-12">
                    <label className="form-label">Contraseña actual</label>
                    <input className="form-control" type="password" value={pass.actual}
                        onChange={e => setPass({ ...pass, actual: e.target.value })} />
                </div>
                <div className="col-12">
                    <label className="form-label">Nueva contraseña</label>
                    <input className="form-control" type="password" value={pass.nueva}
                        onChange={e => setPass({ ...pass, nueva: e.target.value })} />
                </div>
                <div className="col-12">
                    <label className="form-label">Confirmar nueva contraseña</label>
                    <input className="form-control" type="password" value={pass.confirmar}
                        onChange={e => setPass({ ...pass, confirmar: e.target.value })} />
                </div>
                <div className="col-12 d-flex gap-2">
                    <button className="btn btn-dark" onClick={handleSave}>Guardar cambios</button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/me')}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}