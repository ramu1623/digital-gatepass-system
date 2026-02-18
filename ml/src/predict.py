import joblib
import os
from src.preprocess import preprocess_text

# Get absolute path of current file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "model", "importance_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "model", "vectorizer.pkl")

# Load trained model and vectorizer
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

def predict_importance(reason):
    """
    Predict importance level for gate pass reason
    """
    clean_reason = preprocess_text(reason)
    vectorized_reason = vectorizer.transform([clean_reason])
    prediction = model.predict(vectorized_reason)
    return prediction[0]
