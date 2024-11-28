# imports
import pytest
from app import create_app

# Test client to create the app for testing purposes
@pytest.fixture
def client():
    # Create a test client to interact with Flask
    app = create_app()
    return app.test_client()

# Chatbot test
def test_chatbot_route(client):

    # Send a message to the chatbot to get a response
    # This is basically a POST request
    response = client.post('/chat', json={'message': 'What are your hours?'})

    # Get a status code (200) back if connection successful
    assert response.status_code == 200

    # Get the response data as JSON
    response_json = response.get_json()

    # Response from chatbot to the user, checking the bot's response field
    assert "Our business hours are 9 AM to 5 PM" in response_json['bot_response']['message']

# Invalid route
def test_invalid_route(client):

    # Test an invalid route (empty input)
    # Also a POST request
    response = client.post('/chat', json={})

    # Get a status code (400) indicating bad route/request
    assert response.status_code == 400