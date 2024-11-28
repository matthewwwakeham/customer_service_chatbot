# app/__init__.py

# imports
import logging
from flask import Flask

# Create app as a package
def create_app():
    app = Flask(__name__)

    # Global logging configuration
    logging.basicConfig(
        filename='logs/global_logs.log',
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

    # Register routes
    from .routes import chatbot_bp
    app.register_blueprint(chatbot_bp)

    return app