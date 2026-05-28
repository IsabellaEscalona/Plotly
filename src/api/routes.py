"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
import cloudinary
import cloudinary.uploader
from api.models import db, User, Profile, Enum_Artist, TIPO_MAP, Post, Enum_Genre_post, Enum_Category_Post, Content_Post
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
api = Blueprint('api', __name__)
bcrypt = Bcrypt()
# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    body = request.json
    if not body.get("email") or not body.get("contraseña") or not body.get("usuario"):
        return jsonify({"error": "Email, usuario y contraseña son obligatorios!"}), 400
    existing_user = User.query.filter_by(email=body["email"]).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400
    hashed = bcrypt.generate_password_hash(body["contraseña"]).decode('utf-8')
    new_user = User(email=body["email"],
                    password=hashed, username=body["usuario"])
    db.session.add(new_user)
    db.session.flush()
    tipo_recibido = body.get('tipo', 'Lector')
    if tipo_recibido == 'Lector':
        artist_type = Enum_Artist.READER
    else:
        subtipo_map = {
            'Comic Artist': Enum_Artist.COMIC_ARTIST,
            'Writer': Enum_Artist.WRITER,
            'Hybrid': Enum_Artist.HYBRID
        }
        artist_type = subtipo_map.get(
            body.get('artist_type', 'Hybrid'), Enum_Artist.HYBRID)
    new_profile = Profile(user_id=new_user.id, artist_type=artist_type)
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({"message": "Usuario creado correctamente!"}), 200


@api.route('/login', methods=['POST'])
def login():
    body = request.json
    user = User.query.filter_by(email=body["email"]).first()
    if user is None or not bcrypt.check_password_hash(user.password, body["contraseña"]):
        return jsonify({"error": "Email o contraseña incorrectos!"}), 401
    profile = Profile.query.filter_by(user_id=user.id).first()
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize(), "profile": profile.serialize()}), 200


@api.route('/me', methods=['GET'])
@jwt_required()
def show_own_profile():
    id = get_jwt_identity()
    user = db.session.get(User, id)
    data = user.serialize()
    if user.perfil:
        data['bio'] = user.perfil.bio
        data['instagram'] = user.perfil.instagram
        data['twitter'] = user.perfil.twitter
        data['profile_picture'] = user.perfil.profile_picture
        data['tipo'] = user.perfil.serialize()['tipo']
    return jsonify(data), 200


@api.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    body = request.json
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not bcrypt.check_password_hash(user.password, body["contraseña_actual"]):
        return jsonify({"error": "Contraseña actual equivocada, prueba de nuevo!"}), 401
    hashed = bcrypt.generate_password_hash(
        body["nueva_contraseña"]).decode('utf-8')
    user.password = hashed
    db.session.commit()
    return jsonify({"message": "Contraseña actualizada :)"}), 200


@api.route('/settings', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    profile = user.perfil
    body = request.json
    user.username = body.get("username", user.username)
    user.email = body.get("email", user.email)

    if body.get("password"):
        user.password = bcrypt.generate_password_hash(
            body["password"]).decode('utf-8')

    profile.bio = body.get("bio", profile.bio)
    profile.instagram = body.get("instagram", profile.instagram)
    profile.twitter = body.get("twitter", profile.twitter)
    if body.get("tipo"):
        profile.artist_type = Enum_Artist.COMIC_ARTIST if body[
            "tipo"] == 'Artista' else Enum_Artist.READER

    db.session.commit()
    return jsonify({
        "message": "perfil actualizado correctamente",
        "user": user.serialize(),
        "profile": profile.serialize()
    }), 200


@api.route('/reset-password', methods=['PUT'])
def reset_password():
    body = request.json
    if not body.get("email") or not body.get("nueva_contraseña"):
        return jsonify({"error": "Email y nueva contraseña son obligatorios"}), 400
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"Error": "No existe una cuenta con el email ingresado"}), 404
    hashed = bcrypt.generate_password_hash(
        body["nueva_contraseña"]).decode('utf-8')
    user.password = hashed
    db.session.commit()
    return jsonify({"message": "Contraseña restablecida correctamente!"}), 200


@api.route('/newComic', methods=['POST'])
@jwt_required()
def newComic():
    body = request.form
    print(request.files)
    user_id = get_jwt_identity()
    if not body.get('title'):
        return jsonify({'status': 'error', 'message': 'El titulo es obligatorio'}), 400
    if not body.get('principal_genre'):
        return jsonify({'status': 'error', 'message': 'El genero principal es obligatorio'}), 400
    if not 'content[]' in request.files:
        return jsonify({'status': 'error', 'message': 'Los archivos son obligatorios'}), 400

    title = body['title']
    category = Enum_Category_Post.COMIC

    primer_tipo_recibido = body['principal_genre']

    if primer_tipo_recibido == 'Accion':
        principal_genre = Enum_Genre_post.ACCION
    if primer_tipo_recibido == 'Romance':
        principal_genre = Enum_Genre_post.ROMANCE
    if primer_tipo_recibido == 'Terror':
        principal_genre = Enum_Genre_post.TERROR
    if primer_tipo_recibido == 'Fantasia':
        principal_genre = Enum_Genre_post.FANTASIA
    if primer_tipo_recibido == 'Sci-Fi':
        principal_genre = Enum_Genre_post.SCIFI

    segundo_tipo_recibido = body['secondary_genre']

    if segundo_tipo_recibido == 'Accion':
        secondary_genre = Enum_Genre_post.ACCION
    if segundo_tipo_recibido == 'Romance':
        secondary_genre = Enum_Genre_post.ROMANCE
    if segundo_tipo_recibido == 'Terror':
        secondary_genre = Enum_Genre_post.TERROR
    if segundo_tipo_recibido == 'Fantasia':
        secondary_genre = Enum_Genre_post.FANTASIA
    if segundo_tipo_recibido == 'Sci-Fi':
        secondary_genre = Enum_Genre_post.SCIFI

    description = body['description']
    cover = request.files['cover']

    result = cloudinary.uploader.upload(cover, folder='covers')

    if result:

        new_Post= Post(user_id=user_id, title=title, category=category, principal_genre=principal_genre, 
                       secondary_genre=secondary_genre, description=description, cover=result['secure_url'])
        
        db.session.add(new_Post)
        db.session.flush()
        
        files = request.files.getlist('content[]')
        print(files)
        result_files=''

        for file in files:
            try:
                response=cloudinary.uploader.upload(file, folder='files')
                print(response['secure_url'])
                result_files=response['secure_url']
                new_content_post= Content_Post(post_id=new_Post.id, url=result_files)
                db.session.add(new_content_post)
                db.session.flush()

            except Exception as e:
                return jsonify({'message':'Hubo un error al subir el contenido del comic'}), 400
            
        db.session.commit()

        return jsonify({'message':'Post creado exito'}), 200
    
    else:
        return jsonify({'message':'Post no creado'}), 500
