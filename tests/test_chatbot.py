# imports
import pytest
from app.chatbot_logic import get_response, load_chatbot_resources

# Load the resources (questions, answers, intents, models, etc.)
questions, answers, intents, intent_model, intent_vectorizer, faq_vectorizer = load_chatbot_resources()

# Test chatbot response for a specific user query
def test_chatbot_response():
    # Sample query regarding business hours
    user_input = "What are your business hours?"

    # The expected response from the chatbot for the query above
    expected_response = "Our business hours are 9 AM to 5 PM, Monday to Friday."

    # Call the get_response function to obtain the chatbot's response
    response = get_response(user_input, questions, answers, intents, intent_model, intent_vectorizer, faq_vectorizer)

    # Use assert to make sure the chatbot's response matches the expected response
    # Helps make sure chatbot provides correct information (i.e. business hours)
    assert response == expected_response