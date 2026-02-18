from flask import Flask, request, jsonify
from src.predict import predict_importance
import os

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Safety check
        if not data or "reason" not in data:
            return jsonify({"importance": "Normal"}), 200

        reason = data["reason"]

        if reason.strip() == "":
            return jsonify({"importance": "Normal"}), 200

        # Call ML prediction
        importance = predict_importance(reason)

        return jsonify({"importance": importance}), 200

    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({"importance": "Normal"}), 200


if __name__ == "__main__":
    # 🔥 IMPORTANT: Dynamic port for Render
    port = int(os.environ.get("PORT", 4000))
    app.run(host="0.0.0.0", port=port)
