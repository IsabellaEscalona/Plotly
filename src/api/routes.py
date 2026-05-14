"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profile
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
        return jsonify({"error": "Email, usuario y  contraseña son obligatorios!"}), 400
    existing_user = User.query.filter_by(email=body["email"]).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400
    hashed = bcrypt.generate_password_hash(body["contraseña"]).decode('utf-8')
    new_user = User(email=body["email"],
                    password=hashed, username=body["usuario"])
    db.session.add(new_user)
    db.session.flush()
    new_profile = Profile(user_id=new_user.id)
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({"message": "Usuario creado correctamente!"}), 200


@api.route('/login', methods=['POST'])
def login():
    body = request.json
    user = User.query.filter_by(email=body["email"]).first()
    profile = Profile.query.filter_by(user_id=user.id).first()
    if user is None or not bcrypt.check_password_hash(user.password, body["contraseña"]):
        return jsonify({"error": "Email o contraseña incorrectos!"}), 401
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
    return jsonify(data), 200


@api.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    body = request.json
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not bcrypt.check_password_hash(user.password, body["contraseña_actual"]):
        return jsonify({"error": "Contraseña actual equivocada, prueba de nuevo!"}), 401
    hashed = bcrypt.generate_password_hash(body["nueva_contraseña"]).decode('utf-8')
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
        user.password = bcrypt.generate_password_hash(body["password"]).decode('utf-8')

    profile.bio = body.get("bio", profile.bio)
    profile.instagram = body.get("instagram", profile.instagram)
    profile.twitter = body.get("twitter", profile.twitter)

    db.session.commit()
    return jsonify({          
        "message": "perfil actualizado correctamente",
        "user": user.serialize(),
        "profile": profile.serialize()
    }), 200