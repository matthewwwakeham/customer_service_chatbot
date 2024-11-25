# app/chatbot_logic.py

# imports
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

# Load dataset and models
def load_chatbot_resources():
    faq_data = pd.read_csv('data/faq_dataset.csv')
    questions, answers = faq_data['Question'].tolist(), faq_data['Answer'].tolist()

    intent_model = joblib.load('app/models/intent_model.pkl')
    intent_vectorizer = joblib.load('app/models/intent_vectorizer.pkl')

    return questions, answers, intent_model, intent_vectorizer

def get_response(user_query, questions, answers):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(questions)
    query_vec = vectorizer.transform([user_query])

    similarity = cosine_similarity(query_vec, tfidf_matrix)
    best_match = similarity.argmax()

    if similarity[0, best_match] > 0.2:
        return answers[best_match]
    else:
        return "I'm sorry, I don't have an answer for that. Please contact support."