"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
import cloudinary
import cloudinary.uploader
from api.models import db, User, Profile, Enum_Artist, TIPO_MAP, Post, Enum_Genre_post, Enum_Category_Post, Content_Post, Saved, Comment, Like
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
api = Blueprint('api', __name__)
bcrypt = Bcrypt()
# Allow CORS requests to this API
CORS(api)

GENRE_MAP = {
    'Accion': Enum_Genre_post.ACCION,
    'Romance': Enum_Genre_post.ROMANCE,
    'Terror': Enum_Genre_post.TERROR,
    'Fantasia': Enum_Genre_post.FANTASIA,
    'Sci-Fi': Enum_Genre_post.SCIFI,
}


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


@api.route('/follow/<int:user_id>', methods=['POST'])
@jwt_required()
def follow_user(user_id):
    current_id = int(get_jwt_identity())
    if current_id == user_id:
        return jsonify({'error': 'No puedes seguirte a ti mismo'}), 400
    me = db.session.get(User, current_id)
    target = db.session.get(User, user_id)
    if not target:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    me.follow(target)
    db.session.commit()
    return jsonify({'message': f'Ahora sigues a {target.username}', 'following': True}), 200


@api.route('/follow/<int:user_id>', methods=['DELETE'])
@jwt_required()
def unfollow_user(user_id):
    current_id = int(get_jwt_identity())
    me = db.session.get(User, current_id)
    target = db.session.get(User, user_id)
    if not target:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    me.unfollow(target)
    db.session.commit()
    return jsonify({'message': f'Dejaste de seguir a {target.username}', 'following': False}), 200


@api.route('/feed/following', methods=['GET'])
@jwt_required()
def get_following_feed():
    current_id = int(get_jwt_identity())
    me = db.session.get(User, current_id)
    seguidos_ids = [u.id for u in me.following]
    if not seguidos_ids:
        return jsonify([]), 200
    posts = Post.query.filter(Post.user_id.in_(
        seguidos_ids)).order_by(Post.id.desc()).all()
    comics = []
    for p in posts:
        comics.append({
            **p.serialize(),
            'autor': p.author.username,
            'guardados': len(p.saved),
            'comentarios': len(p.comment)
        })
    return jsonify(comics), 200

@api.route('/profile/<username>/followers', methods=['GET'])
def get_user_followers(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    lista = []
    for u in user.followers:
        lista.append({
            'username': u.username,
            'profile_picture': u.perfil.profile_picture if u.perfil else None
        })
    return jsonify(lista), 200


@api.route('/profile/<username>/following', methods=['GET'])
def get_user_following(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    lista = []
    for u in user.following:
        lista.append({
            'username': u.username,
            'profile_picture': u.perfil.profile_picture if u.perfil else None
        })
    return jsonify(lista), 200


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


@api.route('/profile-picture', methods=['PUT'])
@jwt_required()
def update_profile_picture():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user or not user.perfil:
        return jsonify({'error': 'Perfil no encontrado'}), 404
    if 'profile_picture' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400
    file = request.files['profile_picture']
    result = cloudinary.uploader.upload(file, folder='profiles')
    user.perfil.profile_picture = result['secure_url']
    db.session.commit()
    return jsonify({
        'message': 'Foto de perfil actualizada',
        'profile_picture': result['secure_url']
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

    principal_genre = GENRE_MAP.get(body['principal_genre'])
    secondary_genre = GENRE_MAP.get(body.get('secondary_genre'))

    description = body['description']
    cover = request.files['cover']

    result = cloudinary.uploader.upload(cover, folder='covers')

    if result:

        new_Post = Post(user_id=user_id, title=title, category=category, principal_genre=principal_genre,
                        secondary_genre=secondary_genre, description=description, cover=result['secure_url'])

        db.session.add(new_Post)
        db.session.flush()

        files = request.files.getlist('content[]')
        print(files)
        result_files = ''

        for file in files:
            try:
                response = cloudinary.uploader.upload(file, folder='files')
                print(response['secure_url'])
                result_files = response['secure_url']
                new_content_post = Content_Post(
                    post_id=new_Post.id, url=result_files)
                db.session.add(new_content_post)
                db.session.flush()

            except Exception as e:
                return jsonify({'message': 'Hubo un error al subir el contenido del comic'}), 400

        db.session.commit()

        return jsonify({'message': 'Post creado exito'}), 200

    else:
        return jsonify({'message': 'Post no creado'}), 500


@api.route('/search-books', methods=['GET'])
def search_books():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Se requiere un término de búsqueda"}), 400

    response = requests.get(
        f"https://openlibrary.org/search.json?q={query}&limit=10")
    data = response.json()

    books = []
    for book in data.get("docs", []):
        books.append({
            "title": book.get("title"),
            "author": book.get("author_name", ["Desconocido"])[0],
            "year": book.get("first_publish_year"),
            "cover": f"https://covers.openlibrary.org/b/id/{book.get('cover_i')}-M.jpg" if book.get("cover_i") else None
        })

    return jsonify(books), 200


@api.route('/newHistory', methods=['POST'])
@jwt_required()
def newHistory():
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
    category = Enum_Category_Post.ONLY_TEXT

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

        new_Post = Post(user_id=user_id, title=title, category=category, principal_genre=principal_genre,
                        secondary_genre=secondary_genre, description=description, cover=result['secure_url'])

        db.session.add(new_Post)
        db.session.flush()

        files = request.files.getlist('content[]')
        print(files)
        result_files = ''

        for file in files:
            try:
                response = cloudinary.uploader.upload(file, folder='files')
                print(response['secure_url'])
                result_files = response['secure_url']
                new_content_post = Content_Post(
                    post_id=new_Post.id, url=result_files)
                db.session.add(new_content_post)
                db.session.flush()

            except Exception as e:
                return jsonify({'message': 'Hubo un error al subir el contenido del historia'}), 400

        db.session.commit()

        return jsonify({'message': 'Post creado exito'}), 200

    else:
        return jsonify({'message': 'Post no creado'}), 500


@api.route('/comic/<int:post_id>', methods=['GET'])
@jwt_required(optional=True)
def get_comic(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Comic no encontrado'}), 404
    paginas = [c.url for c in post.content]
    user_id = get_jwt_identity()
    guardado = False
    if user_id:
        guardado = Saved.query.filter_by(
            user_id=user_id, post_id=post_id).first() is not None
    comentarios = []
    for c in post.comment:
        autor = User.query.get(c.user_id)
        comentarios.append({
            'id': c.id,
            'user_id': c.user_id,
            'usuario': autor.username if autor else 'desconocido',
            'texto': c.content
        })
    return jsonify({
        **post.serialize(),
        'autor': post.author.username,
        'paginas': paginas,
        'guardado': guardado,
        'comentarios': comentarios
    }), 200


@api.route('/save/<int:post_id>', methods=['POST'])
@jwt_required()
def save_comic(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Comic no encontrado'}), 404
    ya_guardado = Saved.query.filter_by(
        user_id=user_id, post_id=post_id).first()
    if ya_guardado:
        return jsonify({'message': 'Ya estaba guardado'}), 200
    nuevo_guardado = Saved(user_id=user_id, post_id=post_id)
    db.session.add(nuevo_guardado)
    db.session.commit()
    return jsonify({'message': 'Comic guardado'}), 201


@api.route('/save/<int:post_id>', methods=['DELETE'])
@jwt_required()
def unsave_comic(post_id):
    user_id = get_jwt_identity()
    guardado = Saved.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not guardado:
        return jsonify({'message': 'No estaba guardado'}), 200
    db.session.delete(guardado)
    db.session.commit()
    return jsonify({'message': 'Comic removido de guardados'}), 200


@api.route('/comic/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_comic(post_id):
    current_id = int(get_jwt_identity())
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({'error': 'Comic no encontrado'}), 404
    if post.user_id != current_id:
        return jsonify({'error': 'No puedes borrar obras de otro usuario'}), 403
    Content_Post.query.filter_by(post_id=post_id).delete()
    Comment.query.filter_by(post_id=post_id).delete()
    Like.query.filter_by(post_id=post_id).delete()
    Saved.query.filter_by(post_id=post_id).delete()
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Obra eliminada'}), 200


@api.route('/library', methods=['GET'])
@jwt_required()
def get_library():
    user_id = get_jwt_identity()
    guardados = Saved.query.filter_by(user_id=user_id).all()
    comics = []
    for g in guardados:
        post = g.post
        comics.append({
            **post.serialize(),
            'autor': post.author.username
        })
    return jsonify(comics), 200


@api.route('/comic/<int:post_id>/comment', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    body = request.json
    if not body.get('content'):
        return jsonify({'error': 'El comentario no puede estar vacio'}), 400
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Comic no encontrado'}), 404
    nuevo = Comment(user_id=user_id, post_id=post_id, content=body['content'])
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({'message': 'Comentario agregado'}), 201


@api.route('/comment/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    current_id = int(get_jwt_identity())
    comment = db.session.get(Comment, comment_id)
    if not comment:
        return jsonify({'error': 'Comentario no encontrado'}), 404
    if comment.user_id != current_id:
        return jsonify({'error': 'No puedes borrar comentarios de otro usuario'}), 403
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comentario eliminado'}), 200


@api.route('/profile/<username>', methods=['GET'])
@jwt_required(optional=True)
def get_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    posts = []
    for p in user.Post:
        posts.append({
            **p.serialize(),
            'autor': user.username,
            'guardados': len(p.saved)
        })
    posts.sort(key=lambda x: x['guardados'], reverse=True)
    data = user.perfil.serialize() if user.perfil else {}
    data['id'] = user.id
    data['username'] = user.username
    data['posts'] = posts
    data['followers_count'] = user.followers.count()
    data['following_count'] = user.following.count()
    data['is_following'] = False
    current_id = get_jwt_identity()
    if current_id:
        me = db.session.get(User, int(current_id))
        if me:
            data['is_following'] = me.is_following(user)
    return jsonify(data), 200


@api.route('/feed', methods=['GET'])
def get_feed():
    posts = Post.query.order_by(Post.id.desc()).all()
    comics = []
    for p in posts:
        comics.append({
            **p.serialize(),
            'autor': p.author.username,
            'guardados': len(p.saved),
            'comentarios': len(p.comment)
        })
    return jsonify(comics), 200

@api.route('/search', methods=['GET'])
def search_posts():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([]), 200
    posts = Post.query.filter(Post.title.ilike(f'%{query}%')).order_by(Post.id.desc()).all()
    resultados = []
    for p in posts:
        resultados.append({
            **p.serialize(),
            'autor': p.author.username
        })
    return jsonify(resultados), 200
