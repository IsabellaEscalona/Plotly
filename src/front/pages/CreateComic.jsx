import React, { useState, useEffect } from "react"
import placeholderImage from '../assets/img/placeholder.jpg'
import shortid from "https://esm.sh/shortid@2.2.16";
import '../CreateComic.css'

export const CreateComic = () => {
    const [preview, setPreview] = useState(placeholderImage)
    const [file, setFile] = useState(null)
    const [selectedfile, SetSelectedFile] = useState([]);
    const [Files, SetFiles] = useState([]);

    const handleFileChangeCover = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile)
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)
        }
    }

    const handleFileChangeComic = (e) => {
        // --For Multiple File Input
        let images = [];
        for (let i = 0; i < e.target.files.length; i++) {
            images.push((e.target.files[i]));
            let reader = new FileReader();
            let file = e.target.files[i];
            reader.onloadend = () => {
                SetSelectedFile((preValue) => {
                    return [
                        ...preValue,
                        {
                            id: shortid.generate(),
                            filename: e.target.files[i].name,
                            fileimage: reader.result,
                        }
                    ]
                });
            }
            if (e.target.files[i]) {
                reader.readAsDataURL(file);
            }
        }
    }

    const DeleteSelectFile = (id) => {
        if (window.confirm("Are you sure you want to delete this Image?")) {
            const result = selectedfile.filter((data) => data.id !== id);
            SetSelectedFile(result);
        }

    }

    const Enum_Category_Post = {
        ONLY_TEXT: 'only text',
        COMIC: 'comic'
    }

    const Enum_Genre_post = {
        ACCION: 'Accion',
        ROMANCE: 'Romamnce',
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


    return (
        <>


            <div className="container py-5 text-align-center" style={{ maxWidth: '700px', color: '#e0e0ff' }}>
                <h2 className="mb-4">Detalles de nueva historia</h2>
                <div className="container d-flex">
                    <div className="col-4 justify-content-center">
                        <h5 className="pb-2">Portada</h5>
                        {preview && <img className="rounded rounded-2" src={preview} alt='Preview' style={{ 'width': '200px', 'height': '300px', 'objectFit': 'cover' }} />}
                        <input className='form-control mt-1' type='file' accept='image/*' onChange={handleFileChangeCover} style={{ 'width': '200px' }} />
                    </div>
                    <div className="col-9 mx-4">
                        <input className="form-control my-3" type="text" placeholder="Título" />
                        <textarea className="form-control my-4" name="descripcionPost"
                            id="descripcionPost" placeholder="Descripción" rows={5}></textarea>
                        {/*                         <select className="form-select my-4" aria-label="Default select example" defaultValue="">
                            <option value='' disabled hidden>Seleccione el tipo de historia</option>
                            <option value={Enum_Category_Post.ONLY_TEXT}>Solo texto</option>
                            <option value={Enum_Category_Post.COMIC}>Comic</option>
                        </select> */}
                        <select className="form-select my-4" aria-label="Default select example" defaultValue="">
                            <option value='' disabled hidden>Genero Principal</option>
                            <option value={Enum_Genre_post.ACCION}>Acción</option>
                            <option value={Enum_Genre_post.FANTASIA}>Fantasia</option>
                            <option value={Enum_Genre_post.ROMANCE}>Romance</option>
                            <option value={Enum_Genre_post.SCIFI}>Ciencia Ficción</option>
                            <option value={Enum_Genre_post.TERROR}>Terror</option>
                        </select>
                        <select className="form-select mt-4 mb-2" aria-label="Default select example" defaultValue="">
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
                                                <h6>Imagenes del comic</h6>
                                            </div>
                                        </div>
                                        <div className="kb-file-upload">
                                            <div className="file-upload-box">
                                                <input type="file" id="fileupload" className="file-upload-input" onChange={handleFileChangeComic} multiple />
                                                <span>Arrastrar y soltar o <span className="file-link">elija sus archivos</span></span>
                                            </div>
                                        </div>
                                        <div className="kb-attach-box mb-3">
                                            {
                                                selectedfile.map((data, index) => {
                                                    const { id, filename, fileimage } = data;
                                                    return (
                                                        <div className="file-atc-box" key={id}>
                                                            {
                                                                filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ?
                                                                    <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                                    <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                            }
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
                                        {Files.length > 0 ?
                                            <div className="kb-attach-box">
                                                <hr />
                                                {
                                                    Files.map((data, index) => {
                                                        const { id, filename, fileimage } = data;
                                                        return (
                                                            <div className="file-atc-box" key={index}>
                                                                {
                                                                    filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ?
                                                                        <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                                        <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                                }
                                                                <div className="file-detail">
                                                                    <h6>{filename}</h6>
                                                                    <div className="file-actions">
                                                                        <button className="file-action-btn" onClick={() => DeleteFile(id)}>Delete</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-success m-1 ms-0">Crear</button>
                <button className="btn btn-secondary m-1">Cancelar</button>
            </div>





        </>

    )

}