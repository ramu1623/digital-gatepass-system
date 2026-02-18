import pandas as pd
import joblib
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

from src.preprocess import preprocess_text

# Absolute base directory (ml/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "data", "training_data.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")

os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
data = pd.read_csv(DATA_PATH)

# 🔥 REMOVE EMPTY ROWS
data = data.dropna(subset=["reason", "importance"])

# 🔥 FORCE STRING TYPE
data["reason"] = data["reason"].astype(str)
data["importance"] = data["importance"].astype(str).str.strip()

# Preprocess text
data["clean_reason"] = data["reason"].apply(preprocess_text)

# 🔥 FINAL SAFETY CHECK
data = data[data["clean_reason"] != ""]

# Convert text to numerical form
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(data["clean_reason"])

# Labels (NO NaN now)
y = data["importance"]

# Train model
model = MultinomialNB()
model.fit(X, y)

# Save model and vectorizer
joblib.dump(model, os.path.join(MODEL_DIR, "importance_model.pkl"))
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "vectorizer.pkl"))

print("✅ Model trained and saved successfully")
