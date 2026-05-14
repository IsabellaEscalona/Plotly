import { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import useGlobalReducer from '../hooks/useGlobalReducer'

export const Profile = () => {
    const { store } = useGlobalReducer()
    const navigate = useNavigate()

    return (
        <section className='vh-100 vw-100'>
            <div className="container-fluid py-5 h-100">
                <div className="row d-flex justify-content-center">
                    <div className="col col-lg-11 col-xl-8">
                        <div className="card">
                            <div className="rounded-top text-white d-flex flex-row" style={{ 'backgroundColor': '#000', 'height': '200px' }}>
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ 'width': '150' }}>

                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                        alt="generic placeholder image" className='img-fluid img-thumbnail rounded-circle mt-4 mb-2'
                                        style={{ 'zIndex': '1', 'height': '150px' }} />
                                    <button type='button' className='btn btn-outline-dark text-body'
                                        style={{ 'zIndex': '1' }}>
                                        Edit Profile
                                    </button>
                                </div>
                                <div className="ms-3" style={{ 'marginTop': '130px' }}>
                                    <h5>{store?.user?.username}</h5>
                                    <p>{store?.profile?.artist_type}</p>
                                </div>
                            </div>
                            <div className="p-4 text-black bg-body-tertiary">
                                <div className="d-flex justify-content-end text-center py-1 text-body">
                                    <div>
                                        <p className='mb-1 h5'>253</p>
                                        <p className="small text-muted mb-0">Posts</p>
                                    </div>
                                    <div className='px-3'>
                                        <p className="mb-1 h5">1026</p>
                                        <p className="small text-muted mb-0">Follower</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 h5">478</p>
                                        <p className="small text-muted mb-0">Following</p>
                                    </div>
                                </div>
                            </div>
                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className="col-4">
                                        <div className='mt-3 mx-2'>
                                            <label className='py-2 ' htmlFor="Bio">Biography:</label>
                                            <textarea className='form-control mb-4' name="Bio"
                                                placeholder='Sobre ti...'
                                                disabled></textarea>
                                        </div>
                                    </div>
                                    <div className='col-8'>
                                        Post1
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

