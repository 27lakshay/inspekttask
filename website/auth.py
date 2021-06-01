from flask import Blueprint, request, make_response, jsonify, render_template, current_app
from flask.helpers import url_for
from werkzeug.utils import redirect
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
import jwt
import datetime
from functools import wraps
import uuid

auth = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try: 
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms="HS256")
            current_user = User.query.filter_by(email=data['email']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401
            # return redirect(url_for('views.home')), 401

        return f(current_user, *args, **kwargs)

    return decorated

@auth.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        new_user = User(email = email, name = name, password = generate_password_hash(password, method='sha256'))
        
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message' : 'New user created!'})
    return render_template('register.html')

@auth.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()

        if not user:
            return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

        if check_password_hash(user.password, password):
            token = jwt.encode({'email' : user.email, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=60)}, current_app.config['SECRET_KEY'])

        return jsonify({'token' : token})
        # return redirect(url_for('views.home'))
    return render_template('login.html')

# @auth.route('/logout')
# def logout():
#         return ""
