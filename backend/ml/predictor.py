"""Load model and encoders once; expose predict()."""
import os
import pickle
import numpy as np

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "car_price_model.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")

CAT_COLS = ["fuel_type", "transmission", "owner_type", "brand"]
FEATURE_ORDER = ["year", "km_driven", "fuel_type", "transmission", "owner_type", "brand", "mileage", "engine_cc", "power_bhp", "seats"]

_model = None
_encoders = None


def _load():
    global _model, _encoders
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            # Auto-train if model not found
            import sys, importlib.util
            trainer_path = os.path.join(os.path.dirname(__file__), "model_trainer.py")
            spec = importlib.util.spec_from_file_location("model_trainer", trainer_path)
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            _model, _encoders = mod.train_and_save()
        else:
            with open(MODEL_PATH, "rb") as f:
                _model = pickle.load(f)
            with open(ENCODERS_PATH, "rb") as f:
                _encoders = pickle.load(f)


def predict(data: dict) -> float:
    """
    data keys: year, km_driven, fuel_type, transmission, owner_type, brand,
               mileage, engine_cc, power_bhp, seats
    Returns predicted price in lakhs.
    """
    _load()

    row = {}
    for col in FEATURE_ORDER:
        val = data.get(col)
        if col in CAT_COLS:
            le = _encoders.get(col)
            if le is not None:
                try:
                    val = int(le.transform([str(val)])[0])
                except Exception:
                    # unseen label → use 0
                    val = 0
            else:
                val = 0
        else:
            val = float(val) if val is not None else 0.0
        row[col] = val

    features = np.array([[row[c] for c in FEATURE_ORDER]])
    prediction = float(_model.predict(features)[0])
    return round(max(0.5, prediction), 2)
