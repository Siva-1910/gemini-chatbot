from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyBpzUIpspSMZzCgZhPBL7xVZgBID3DWKk4")

# Use the selected stable model
model = genai.GenerativeModel('models/gemini-2.5-pro')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'Message is required'}), 400

    try:
        response = model.generate_content(user_message)
        reply = response.text
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

