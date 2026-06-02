import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGlobalReducer from '../hooks/useGlobalReducer'

export const Settings = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', email: '', bio: '', instagram: '', twitter: '', tipo: '', artistType: '', profile_picture: '' })
    const [pass, setPass] = useState({ actual: '', nueva: '', confirmar: '' })
    const [preview, setPreview] = useState('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp')
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')

    const handleFileChangeCover = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setForm({ ...form, profile_picture: selectedFile })
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)
        }
    }

    useEffect(() => {
        const token = store.token || localStorage.getItem("token")
        if (!token) {
            navigate('/login')
            return
        }
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json()).then(data => setForm({
            username: data.username || '', email: data.email || '',
            bio: data.bio || '', instagram: data.instagram || '',
            twitter: data.twitter || '', tipo: data.tipo || '',
            artistType: data.artist_type || 'Hybrid'
        }))
    }, [store.token])
    const handleSave = async () => {
        setMensaje(''); setError('')
        const token = store.token || localStorage.getItem("token")
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
        const body = Object.fromEntries(
            Object.entries(form).filter(([k, v]) => v !== '' && k !== 'profile_picture')
        )
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
        if (form.profile_picture instanceof File) {
            const fd = new FormData()
            fd.append('profile_picture', form.profile_picture)
            const picResp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/profile-picture', {
                method: 'PUT',
                headers: { 'Authorization': 'Bearer ' + token },
                body: fd
            })
            if (!picResp.ok) { setError('Error al subir la foto de perfil'); return }
        }
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
                <div className="col-md-5">
                    <label className="form-label">Profile Picture</label>
                    {preview && <img className="rounded rounded-circle" src={preview} alt='Preview' style={{ 'width': '200px', 'height': '200px', 'objectFit': 'cover' }} />}
                    <input className='form-control mt-1' type='file' accept='.jpg,.jpeg,.png,.webp' onChange={handleFileChangeCover} style={{ 'width': '200px' }} />
                </div>
                <div className='col-md-6'></div>
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
                <div className="col-12">
                    <label className="form-label">Tipo de usuario</label>
                    <div className="d-flex gap-3">
                        {['Artista', 'Lector'].map(t => (
                            <div
                                key={t}
                                onClick={() => setForm({ ...form, tipo: t })}
                                className="flex-fill text-center p-3 rounded-3"
                                style={{
                                    cursor: 'pointer',
                                    border: `2px solid ${form.tipo === t ? (t === 'Artista' ? '#1a6ebd' : '#ac5353') : '#6c757d'}`,
                                    backgroundColor: form.tipo === t ? (t === 'Artista' ? '#1a6ebd22' : '#8b1a1a22') : 'transparent',
                                    color: form.tipo === t ? (t === 'Artista' ? '#1a6ebd' : '#ac5353') : '#adb5bd',
                                    transition: 'all 0.2s'
                                }}>
                                <i className={`fa-solid ${t === 'Artista' ? 'fa-pen-nib' : 'fa-book-open'}`}
                                    style={{ fontSize: '1.5rem' }} />
                                <div className="fw-bold mt-1">{t}</div>
                            </div>
                        ))}
                    </div>
                    {form.tipo === 'Artista' && (
                        <div className="col-12 mt-2">
                            <label className="form-label">Tipo de artista</label>
                            <div className="d-flex gap-2">
                                {[
                                    { valor: 'Comic Artist', icono: 'fa-image' },
                                    { valor: 'Writer', icono: 'fa-feather' },
                                    { valor: 'Hybrid', icono: 'fa-layer-group' }
                                ].map(({ valor, icono }) => (
                                    <div
                                        key={valor}
                                        onClick={() => setForm({ ...form, artistType: valor })}
                                        className="flex-fill text-center p-2 rounded-3"
                                        style={{
                                            cursor: 'pointer',
                                            border: `2px solid ${form.artistType === valor ? '#1a6ebd' : '#6c757d'}`,
                                            backgroundColor: form.artistType === valor ? '#1a6ebd22' : 'transparent',
                                            color: form.artistType === valor ? '#1a6ebd' : '#adb5bd',
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