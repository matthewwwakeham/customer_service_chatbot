# app/train_model.py

# imports
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pandas as pd

def train_and_save_model():
    # Load dataset
    faq_data = pd.read_csv('data/faq_dataset.csv')

    # Extract features and labels
    questions = faq_data['Question']
    intents = faq_data['Intent']  # Make sure the 'Intent' column exists in your dataset

    # Vectorize the questions
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(questions)

    # Train a simple classifier
    model = LogisticRegression()
    model.fit(X, intents)

    # Save the model and vectorizer
    joblib.dump(model, 'app/models/intent_model.pkl')
    joblib.dump(vectorizer, 'app/models/intent_vectorizer.pkl')

train_and_save_model()