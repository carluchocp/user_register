"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import base64
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

def get_password(password, salt):
    return generate_password_hash(f"{password}{salt}")

def check_password(hash_password, password, salt):
    return check_password_hash(hash_password, f"{password}{salt}")

@api.route('/private', methods=['GET'])
@jwt_required()
def handle_users():
    user = User.query.get(get_jwt_identity())
    return jsonify(user.serialize()), 200

@api.route("/signup", methods=['POST'])
def signup_user():
    if request.method == 'POST':
        body = request.json

        username = body.get("username")
        email = body.get("email")
        password = body.get("password")

        if username is None:
            return jsonify({"message":"Error, you have to put what is being asked for"}), 400
        elif email is None:
            return jsonify({"message":"Error, you have to put what is being asked for"}), 400
        elif password is None:
            return jsonify({"message":"Error, you have to put what is being asked for"}), 400
        else:
            salt = b64encode(os.urandom(32)).decode('utf-8')
            encrypted_password = get_password(password=password, salt=salt)
            print(encrypted_password)

            new_user = User(username=username, email=email, password=encrypted_password, is_active=True, salt=salt)
            db.session.add(new_user)

            try:
                db.session.commit()
                return jsonify(new_user.serialize()), 201
            except Exception as error:
                db.session.rollback()
                return jsonify({"message": f"Error {error.args}"}), 500
            return jsonify({"message":"internal server error"}), 500

@api.route("/login", methods=['POST'])
def login_user():
    if request.method == 'POST':
        body = request.json

        email = body.get("email")
        password = body.get("password")

        if email is None:
            return jsonify({"message":"Error, bad request"}), 400
        elif password is None:
            return jsonify({"message":"Error, bad request"}), 400
        else:
            login_user = User.query.filter_by(email=email).first()
            is_valid = check_password(login_user.password, password, login_user.salt)
            print(is_valid)
            token = create_access_token(identity=login_user.id)
            print(token)
            return jsonify(login_user.serialize())
