# imports
import logging
from datetime import datetime
from flask import Blueprint, request, jsonify, render_template
from .chatbot_logic import load_chatbot_resources, get_response

chatbot_bp = Blueprint('chatbot', __name__)

# Load resources
questions, answers, intents, intent_model, intent_vectorizer, faq_vectorizer = load_chatbot_resources()

# Configure chat logs
chat_logger = logging.getLogger("chat")
chat_logger.setLevel(logging.INFO)
chat_handler = logging.FileHandler("logs/chat_logs.log")
chat_handler.setFormatter(logging.Formatter("%(asctime)s - User: %(message)s"))
chat_logger.addHandler(chat_handler)

# Configure error and warning logs
error_logger = logging.getLogger("error")
error_logger.setLevel(logging.WARNING)
error_handler = logging.FileHandler("logs/error_logs.log")
error_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
error_logger.addHandler(error_handler)

# Home route for UI
@chatbot_bp.route('/')
def home():
    return render_template('index.html')

# Health check route
@chatbot_bp.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'OK', 'message': 'Chatbot is running!'}), 200

# Chatbot API endpoint
@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '')
    
    if not user_input:
        # Log to error log
        error_logger.warning("User message: [EMPTY] - Error: No message provided.")
        return jsonify({'error': 'No message provided.'}), 400
    
    # Enforce character limit (140 characters)
    if len(user_input) > 140:
        # Log to error log
        error_logger.warning(f"User message exceeded character limit: {len(user_input)} characters.")
        return jsonify({'error': 'Message exceeds 140 characters.'}), 400

    # Get the current time
    timestamp = datetime.now().strftime("%H:%M")

    # Generate chatbot response
    try:
        response = get_response(user_input, questions, answers, intents, intent_model, intent_vectorizer, faq_vectorizer)
        
        # Log the interaction to chat logs
        chat_logger.info(f"{user_input} | Bot: {response}")
    except Exception as e:
        # Log errors to the error log
        error_logger.error(f"Error processing message '{user_input}': {e}")
        response = "Sorry, there was an error processing your request."

    # Include timestamps in the response
    return jsonify({
        'user_message': {
            'message': user_input,
            'timestamp': timestamp
        },
        'bot_response': {
            'message': response,
            'timestamp': timestamp
        }
    })