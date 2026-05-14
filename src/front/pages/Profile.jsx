import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGlobalReducer from '../hooks/useGlobalReducer'

export const Profile = () => {
    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const [perfil, setPerfil] = useState(null)

    useEffect(() => {
        const token = store.token || sessionStorage.getItem("token")
        const fetchMe = async () => {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            const data = await resp.json()
            setPerfil(data)
        }
        if (token) fetchMe()
    }, [store.token])
    if (!perfil) return <p className="text-center mt-5">cargando perfil...</p>

    return (
        <section className='vh-100 vw-100'>
            <div className="container-fluid py-5 h-100">
                <div className="row d-flex justify-content-center">
                    <div className="col col-lg-11 col-xl-8">
                        <div className="card">
                            <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                    <img
                                        src={perfil.profile_picture || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"}
                                        alt="avatar"
                                        className='img-fluid img-thumbnail rounded-circle mt-4 mb-2'
                                        style={{ zIndex: '1', height: '150px' }}
                                    />
                                    <button
                                        type='button'
                                        className='btn btn-outline-dark text-body'
                                        style={{ zIndex: '1' }}
                                        onClick={() => navigate('/settings')}
                                        ><i class="fa-solid fa-pen"></i> Edit Profil</button>
                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    <h5>{perfil.username}</h5>
                                    <p className='mb-0'>{perfil.bio || ''}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-body-tertiary">
                                <div className="d-flex justify-content-end text-center py-1">
                                    <div><p className='mb-1 h5'>253</p><p className="small text-muted mb-0">Posts</p></div>
                                    <div className='px-3'><p className="mb-1 h5">1026</p><p className="small text-muted mb-0">Followers</p></div>
                                    <div><p className="mb-1 h5">478</p><p className="small text-muted mb-0">Following</p></div>
                                </div>
                            </div>

                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className="col-4">
                                        <div className='mt-3 mx-2'>
                                            <label className='py-2'><strong>Biography:</strong></label>
                                            <p>{perfil.bio || 'usuario sin bio'}</p>
                                            {perfil.instagram && <p><i class="fa-brands fa-instagram"></i> {perfil.instagram}</p>}
                                            {perfil.twitter && <p><i class="fa-brands fa-x-twitter"></i> {perfil.twitter}</p>}
                                        </div>
                                    </div>
                                    <div className='col-8'>
                                        Posts aquí
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}