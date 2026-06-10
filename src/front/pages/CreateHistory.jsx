import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import placeholderImage from '../assets/img/placeholder.jpg'
import shortid from "https://esm.sh/shortid@2.2.16";
import '../CreateComic.css'
import useGlobalReducer from '../hooks/useGlobalReducer'

export const CreateHistory = () => {
    const { store, dispatch } = useGlobalReducer()
    const [error, setError] = useState('')
    const [preview, setPreview] = useState(placeholderImage)
    const [cover, setCover] = useState(null)
    const [selectedfile, SetSelectedFile] = useState([]);
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [principalGenre, setPrincipalGenre] = useState('')
    const [secondaryGenre, setSecondaryGenre] = useState('')
    const [enviando, setEnviando] = useState(false)
    const navigate = useNavigate()




    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (!title) {
            setError('Por favor, escriba un titulo para su historia')
            return;
        }
        else if (!principalGenre) {
            setError('Elija un genero para su historia')
            return;
        }
        else if (files.length == 0) {
            setError('Ponga el contenido de su historia')
            return;
        }

        console.log(files)

        const formData = new FormData();
        formData.append('title', title)
        formData.append('description', description)
        formData.append('principal_genre', principalGenre)
        formData.append('secondary_genre', secondaryGenre)
        formData.append('cover', cover)

        for (let content of files) {

            formData.append('content[]', content)
        }

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        register(formData)
    }

    const register = async (form) => {
    const token = store.token || localStorage.getItem("token")
    setEnviando(true)
    try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/newHistory', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: form
        })
        const data = await resp.json()
        if (resp.ok) {
            navigate('/comic/' + data.id)
        } else {
            setError(data.message || 'Hubo un error al crear la historia')
            setEnviando(false)
        }
    } catch (err) {
        setError('No se pudo conectar con el servidor')
        setEnviando(false)
    }
}

    const MAX_SIZE = 10 * 1024 * 1024

    const handleFileChangeCover = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return
        if (selectedFile.size > MAX_SIZE) {
            setError('La portada supera los 10MB. Elija una imagen más liviana.')
            e.target.value = ''
            return
        }
        if (selectedFile.type.startsWith('image/')) {
            setError('')
            setCover(selectedFile)
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)
        }
    }

    const handleFileChangeComic = (e) => {
        const seleccionados = Array.from(e.target.files)
        const grandes = seleccionados.filter(f => f.size > MAX_SIZE)
        const validos = seleccionados.filter(f => f.size <= MAX_SIZE)
        if (grandes.length > 0) {
            setError(`Estos archivos superan los 10MB y no se agregaron: ${grandes.map(f => f.name).join(', ')}`)
        } else {
            setError('')
        }
        for (let i = 0; i < validos.length; i++) {
            let reader = new FileReader();
            let file = validos[i];
            reader.onloadend = () => {
                SetSelectedFile((preValue) => [
                    ...preValue,
                    {
                        id: shortid.generate(),
                        filename: file.name,
                        fileimage: reader.result,
                    }
                ]);
            }
            reader.readAsDataURL(file);
        }
        setFiles(validos)
    }

    const DeleteSelectFile = (id) => {
        if (window.confirm("Are you sure you want to delete this File?")) {
            const result = selectedfile.filter((data) => data.id !== id);
            SetSelectedFile(result);
        }

    }

    const Enum_Genre_post = {
        ACCION: 'Accion',
        ROMANCE: 'Romance',
        TERROR: 'Terror',
        FANTASIA: 'Fantasia',
        SCIFI: 'Sci-Fi'
    }

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    useEffect(() => {
        const token = store.token || localStorage.getItem('token')

        if (!token) navigate('/login')

    }, [store.token])


    return (


        <form onSubmit={handleSubmit}>
            <div className="container py-5 text-center create-form" style={{ maxWidth: '700px', color: '#e0e0ff' }}>
                <h2 className="mb-4">Detalles de su nueva historia</h2>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="container d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start">

                    <div className="d-flex flex-column align-items-center flex-shrink-0">
                        <h5 className="pb-2">Portada</h5>
                        {preview && <img className="rounded rounded-2" src={preview} alt='Preview' style={{ 'width': '200px', 'height': '300px', 'objectFit': 'cover' }} />}
                        <input className='form-control mt-1' type='file' accept='.jpg,.jpeg,.png,.webp' onChange={handleFileChangeCover} style={{ 'width': '200px' }} />
                    </div>
                    <div className="flex-grow-1 w-100">
                        <input
                            className="form-control my-3"
                            type="text"
                            placeholder="Título"
                            name="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <textarea className="form-control my-4" name="descripcionPost"
                            id="descripcionPost" placeholder="Descripción" rows={5} value={description} onChange={e => setDescription(e.target.value)}></textarea>
                        <select
                            className="form-select my-4"
                            aria-label="Default select example"
                            defaultValue=""
                            value={principalGenre}
                            onChange={e => setPrincipalGenre(e.target.value)}
                        >
                            <option value='' disabled hidden>Genero Principal</option>
                            <option value={Enum_Genre_post.ACCION}>Acción</option>
                            <option value={Enum_Genre_post.FANTASIA}>Fantasia</option>
                            <option value={Enum_Genre_post.ROMANCE}>Romance</option>
                            <option value={Enum_Genre_post.SCIFI}>Ciencia Ficción</option>
                            <option value={Enum_Genre_post.TERROR}>Terror</option>
                        </select>
                        <select
                            className="form-select mt-4 mb-2"
                            aria-label="Default select example"
                            defaultValue=""
                            value={secondaryGenre}
                            onChange={e => setSecondaryGenre(e.target.value)}
                        >
                            <option value='' disabled hidden>Genero Secundario</option>
                            <option value={Enum_Genre_post.ACCION}>Acción</option>
                            <option value={Enum_Genre_post.FANTASIA}>Fantasia</option>
                            <option value={Enum_Genre_post.ROMANCE}>Romance</option>
                            <option value={Enum_Genre_post.SCIFI}>Ciencia Ficción</option>
                            <option value={Enum_Genre_post.TERROR}>Terror</option>
                        </select>

                    </div>
                </div>
                <div className="fileupload-view">
                    <div className="row justify-content-center ms-5">
                        <div className="col-md-12 col-lg-12">
                            <div className="card mt-5">
                                <div className="card-body">
                                    <div className="kb-data-box">
                                        <div className="kb-modal-data-title">
                                            <div className="kb-data-title">
                                                <h6>Archivos de la Historia</h6>
                                            </div>
                                        </div>
                                        <div className="kb-file-upload">
                                            <div className="file-upload-box">
                                                <input type="file" id="fileupload" className="file-upload-input" onChange={handleFileChangeComic} accept='.txt,.md,.json,.docx,.odt,.rtf,.pdf,.epub' />
                                                <span>Arrastrar y soltar o <span className="file-link">elija sus archivos</span></span>
                                                <small className="d-block mt-2" style={{ color: '#888aaa' }}>Máximo 10MB por archivo</small>
                                            </div>
                                        </div>
                                        <div className="kb-attach-box mb-3">
                                            {
                                                selectedfile.map((data, index) => {
                                                    const { id, filename, fileimage } = data;
                                                    return (
                                                        <div className="file-atc-box" key={id}>
                                                            <div className="file-image"> <img src={fileimage} alt="" /></div>
                                                            <div className="file-detail">
                                                                <h6>{filename}</h6>
                                                                <p></p>
                                                                <div className="file-actions">
                                                                    <button type="button" className="file-action-btn" onClick={() => DeleteSelectFile(id)}>Delete</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-success m-1 ms-0" disabled={enviando}>
                    {enviando ? 'Creando...' : 'Crear'}
                </button>

                <Link to='/'><button className="btn btn-secondary m-1">Cancelar</button></Link>
            </div>
        </form>

    )

}