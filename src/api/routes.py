"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profile
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

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
    body=request.json
    if not body.get("email") or not body.get("contraseña") or not body.get("usuario"):
        return jsonify({"error": "Email, usuario y  contraseña son obligatorios!"}), 400
    existing_user = User.query.filter_by(email=body["email"]).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400
    new_user = User(email=body["email"], password=body["contraseña"], username=body["usuario"])
    db.session.add(new_user)
    db.session.flush()
    new_profile = Profile(user_id=new_user.id)
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({"message": "Usuario creado correctamente!"}), 200