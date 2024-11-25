# app/__init__.py

# imports
from flask import Flask

# Create app as a package
def create_app():
    app = Flask(__name__)

    # Register routes
    from .routes import chatbot_bp
    app.register_blueprint(chatbot_bp)

    return app