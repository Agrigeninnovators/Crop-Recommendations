import os
import re
import pickle
import numpy as np
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Check if the required files exist
required_files = ["model.pkl", "standscaler.pkl", "minmaxscaler.pkl"]
for file in required_files:
    if not os.path.exists(file):
        raise FileNotFoundError(f"{file} not found. Please make sure the file is present in the correct directory.")

# Load the trained model and scalers
try:
    with open("model.pkl", "rb") as model_file:
        model = pickle.load(model_file)
    with open("standscaler.pkl", "rb") as sc_file:
        sc = pickle.load(sc_file)
    with open("minmaxscaler.pkl", "rb") as mx_file:
        mx = pickle.load(mx_file)
except Exception as e:
    raise RuntimeError(f"Error loading model/scaler files: {str(e)}")

GEMINI_API_KEY = "AIzaSyAboqT2HP8Mn63IiE3MTQ7Tje6IhyBH-Vo"


def format_response(text):
    """
    Format the chatbot's response to plain text with bold subheadings and new lines for each section.
    """
    text = text.replace("html", "").strip()

    # Replace HTML tags with plain text equivalents
    text = re.sub(r"<strong>(.*?)</strong>", r"**\1**", text)  # Bold subheadings
    text = re.sub(r"<p>(.*?)</p>", r"\1\n", text)  # Paragraphs -> Newline
    text = re.sub(r"<.*?>", "", text)  # Remove other HTML tags

    # Ensure subheadings are on a new line
    formatted_lines = []
    for line in text.split("\n"):
        if "**" in line:
            formatted_lines.append(f"\n{line.strip()}\n")
        else:
            formatted_lines.append(line.strip())

    return "\n".join([line for line in formatted_lines if line]).strip()


def send_to_chatbot(crops):
    """
    Send the top 3 crops to the chatbot API for recommendations.
    """
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}'
    headers = {"Content-Type": "application/json"}
    prompt = f"Given the top 3 recommended crops: ({crops}), provide a response in the following format:\n\n" \
             "For low budget: {cropX}. Reason: Explain why this crop is cost-effective, compared to other two crops " \
             "(e.g., requires fewer resources, lower input costs, etc.).\n" \
             "For limited water: {cropY}. Reason: Explain why this crop uses less water, compared to other two crops " \
             "(e.g., drought-tolerant, requires minimal irrigation, etc.).\n" \
             "Overall: {cropZ}. Reason: Explain why this crop is the best overall choice, compared to other two crops " \
             "(e.g., high productivity, fits optimal conditions, etc.)."

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

            # Format the text
            formatted_text = format_response(raw_text)
            return formatted_text
        else:
            return f"Error: Unable to fetch information from the chatbot. Status Code: {response.status_code}"
    except Exception as e:
        return f"Error occurred: {str(e)}"


@app.route("/")
def home():
    return render_template("index.html")  # A basic home page


@app.route("/predict", methods=["POST"])
def predict_crops():
    data = request.json

    # Validate input data
    required_keys = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "phValue", "rainfall"]
    if not all(k in data for k in required_keys):
        return jsonify({"error": f"Missing input data. Required fields: {', '.join(required_keys)}"}), 400

    inputs = [
        data["nitrogen"],
        data["phosphorus"],
        data["potassium"],
        data["temperature"],
        data["humidity"],
        data["phValue"],
        data["rainfall"],
    ]

    # Prepare the input for prediction
    single_pred = np.array(inputs).reshape(1, -1)

    # Scale the input features
    try:
        mx_features = mx.transform(single_pred)
        sc_mx_features = sc.transform(mx_features)
    except Exception as e:
        return jsonify({"error": f"Scaling error: {str(e)}"}), 500

    # Make a prediction
    try:
        prediction = model.predict(sc_mx_features)
        probabilities = model.predict_proba(sc_mx_features)[0]
    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

    # Mapping of predicted values to crop names
    crop_dict = {
        1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut",
        6: "Papaya", 7: "Orange", 8: "Apple", 9: "Muskmelon",
        10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
        14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean",
        18: "Mothbeans", 19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea",
        22: "Coffee"
    }

    # Prepare the list of crops and their corresponding probabilities
    crop_probabilities = []
    for idx, prob in enumerate(probabilities):
        crop_name = crop_dict.get(idx + 1, "Unknown Crop")
        crop_probabilities.append({
            "name": crop_name,
            "yieldPotential": round(prob * 100, 2)
        })

    # Sort the crops by probability in descending order
    crop_probabilities.sort(key=lambda x: x["yieldPotential"], reverse=True)

    # Extract the top 3 crops
    top_3_crops = crop_probabilities[:3]

    # Ensure the response is not empty
    if not top_3_crops:
        return jsonify({"error": "No crop predictions available"}), 500

    # Get crop names for the chatbot function
    crop_names = [crop["name"] for crop in top_3_crops]

    # Send top 3 crops to chatbot function
    try:
        chatbot_response = send_to_chatbot(", ".join(crop_names))
    except Exception as e:
        chatbot_response = f"Error generating chatbot response: {str(e)}"

    # Return the top 3 crop predictions along with the chatbot response
    return jsonify({"topCrops": top_3_crops, "chatbotResponse": chatbot_response})


if __name__ == "__main__":
    try:
        app.run(debug=True, host="0.0.0.0", port=5000)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
