# app/routes.py

# imports
from flask import Blueprint, request, jsonify, render_template
from .chatbot_logic import load_chatbot_resources, get_response

chatbot_bp = Blueprint('chatbot', __name__)

# Load resources
questions, answers, intent_model, intent_vectorizer = load_chatbot_resources()

# Home route for UI
@chatbot_bp.route('/')
def home():
    return render_template('index.html')

# Chatbot API endpoint
@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '')
    if not user_input:
        return jsonify({'error': 'No message provided.'}), 400
    
    response = get_response(user_input, questions, answers)
    return jsonify({'response': response})