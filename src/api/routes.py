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

def method_allowed(request, method):
    if request.method != method:
        return jsonify({"error":"Method not allowed"}), 405

def get_password(password, salt):
    return generate_password_hash(f"{password}{salt}")

def check_password(hash_password, password, salt):
    return check_password_hash(hash_password, f"{password}{salt}")

@api.route('/private', methods=['GET'])
def get_all_posts():
    posts = Post.query.all()
    if posts is None:
        return jsonify({"error": "No posts"}), 400
    print(posts)
    return  jsonify(list(map(lambda post: post.serialize(), posts))), 200

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

            new_user = User(username=username, email=email, password=encrypted_password, is_active=True, salt=salt)
            db.session.add(new_user)

            try:
                db.session.commit()
                return jsonify(new_user.serialize()), 201
            except Exception as error:
                db.session.rollback()
                return jsonify({"message": f"Error {error.args}"}), 500
            return jsonify({"message":"internal server error"}), 500

@api.route("/", methods=['POST'])
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
            if login_user is not None:
                is_valid = check_password(login_user.password, password, login_user.salt)
                print(is_valid)
                if is_valid:
                    token = create_access_token(identity=login_user.id)
                    return jsonify({
                    "token": token,
                    }), 200
                else:
                    return jsonify("bad credentials"), 400
            else:
                return jsonify("bad credentials"), 400
            
    return jsonify({"message":"bad credentials"})