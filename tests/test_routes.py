# app/tests/test_routes.py

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
    response = client.post('/chatbot', json={'message': 'What are your hours?'})

    # Get a status code (200) back if connection successful
    assert response.status_code == 200

    # Response from chatbot to the user if connected
    # Similar to the chatbot, we are looking for a correct response to our query
    assert b"Our business hours are 9 AM to 5 PM" in response.data

# Invalid route
def test_invalid_route(client):

    # Test an invalid route (empty input)
    # Also a POST request
    response = client.post('/chatbot', json={})

    # Get a status code (400) indicating bad route/request
    assert response.status_code == 400
    