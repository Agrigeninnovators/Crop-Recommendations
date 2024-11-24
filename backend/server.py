from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.preprocessing.image import img_to_array
from keras.applications.vgg19 import preprocess_input
from keras.models import load_model
import numpy as np
from PIL import Image
import os

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load your trained model
model = load_model('./bestmodel.h5')  # Update with the correct path if necessary

# Define your class mapping dictionary
ref = {
    0: 'Grape_healthy',
    1: 'Grape_leaf_blight',
    2: 'peach__Bacterial_spot',
    3: 'peach__healthy',
    4: 'pepper_bell__bacterial_spot',
    5: 'pepper_bell__healthy',
    6: 'potato__early_blight',
    7: 'potato__healthy',
    8: 'potato__late_blight',
    9: 'Strawberry__healthy',
    10: 'strawberry__leaf_scorch',
    11: 'tomato__bacterial_spot',
    12: 'tomato__healthy',
    13: 'tomato_other_disease'  # Update or complete this mapping as needed
}

# Function to preprocess the image
def preprocess_image(image_path):
    try:
        img = Image.open(image_path)
        img = img.resize((256, 256))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        return img_array
    except Exception as e:
        raise RuntimeError(f"Error preprocessing image: {str(e)}")

# Function to predict the class of the image
def predict_image(image_path):
    try:
        processed_img = preprocess_image(image_path)
        prediction = model.predict(processed_img)
        predicted_label = np.argmax(prediction)

        if predicted_label in ref:
            class_name = ref[predicted_label]
            return class_name
        else:
            return "Unknown class index"
    except Exception as e:
        raise RuntimeError(f"Error predicting image: {str(e)}")

# API endpoint for uploading an image
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'plantImage' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['plantImage']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file:
            filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filename)
            class_name = predict_image(filename)
            return jsonify({'class_name': class_name}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
