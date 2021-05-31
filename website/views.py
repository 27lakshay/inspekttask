from flask import Blueprint, flash, request, redirect, url_for, render_template
import os
from werkzeug.utils import secure_filename

views = Blueprint('views', __name__)

# from main import app

UPLOAD_FOLDER = 'website/static/uploads/'

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# views.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
 
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
     
 
@views.route('/')
def home():
    return render_template('index.html')
 
@views.route('/captureimage')
def captureImage():
    return render_template('captureimage.html')

@views.route('/uploadimage', methods=['POST'])
def save_image():
    print(request)
    if 'image' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['image']
    if file.filename == '':
        flash('No image selected for uploading')
        return redirect(request.url)
    if file and allowed_file(file.filename):
    # if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        #print('upload_image filename: ' + filename)
        flash('Image successfully uploaded and its name is below')
        # return render_template('viewimage.html', filename=filename)
        return redirect(url_for('views.view_image', filename=filename))
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')
        return redirect(request.url)

@views.route('/viewimage/<filename>', methods=['GET'])
def view_image(filename):
    return render_template('viewimage.html', filename=filename)

@views.route('/getimage/<filename>')
def get_image(filename):
    #print('display_image filename: ' + filename)
    return redirect(url_for('static', filename='uploads/' + filename), code=301)

if __name__ == "__main__":
    views.run(debug=True)
    # </filename>

@views.route('/', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No image selected for uploading')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        #print('upload_image filename: ' + filename)
        flash('Image successfully uploaded and its name is below')
        return render_template('index.html', filename=filename)
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')
        return redirect(request.url)
