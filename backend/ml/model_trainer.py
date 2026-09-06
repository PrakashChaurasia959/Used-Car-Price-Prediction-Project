"""
Train and save a simple car price prediction model using numpy only.
Run this file directly to create the model:
    python ml/model_trainer.py
"""
import os
import pickle
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "car_price_model.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")

BRANDS = ["Maruti", "Hyundai", "Honda", "Toyota", "Ford", "Tata", "Mahindra", "Volkswagen", "BMW", "Mercedes"]
FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric"]
TRANSMISSIONS = ["Manual", "Automatic"]
OWNER_TYPES = ["First", "Second", "Third", "Fourth & Above"]
CAT_COLS = ["fuel_type", "transmission", "owner_type", "brand"]
FEATURE_ORDER = ["year", "km_driven", "fuel_type", "transmission", "owner_type", "brand", "mileage", "engine_cc", "power_bhp", "seats"]


def _generate_synthetic_data(n=3000, seed=42):
    rng = np.random.default_rng(seed)
    records = []
    for _ in range(n):
        brand = rng.choice(BRANDS)
        fuel = rng.choice(FUEL_TYPES, p=[0.45, 0.40, 0.10, 0.05])
        trans = rng.choice(TRANSMISSIONS, p=[0.60, 0.40])
        owner = rng.choice(OWNER_TYPES, p=[0.50, 0.30, 0.15, 0.05])
        year = int(rng.integers(2005, 2024))
        age = 2024 - year
        km = int(rng.integers(5000, 200000))
        mileage = float(rng.uniform(10, 30))
        engine = int(rng.choice([800, 1000, 1200, 1500, 1800, 2000, 2500, 3000]))
        power = round(float(engine * rng.uniform(0.05, 0.12)), 1)
        seats = int(rng.choice([4, 5, 6, 7, 8], p=[0.05, 0.65, 0.05, 0.20, 0.05]))

        base = 5 + (10 if brand in ["BMW", "Mercedes"] else 0) + (3 if brand in ["Toyota", "Honda"] else 0)
        price = (base + power * 0.3 - age * 0.5 - km * 0.00003
                 + (2 if trans == "Automatic" else 0)
                 - (2 if owner in ["Third", "Fourth & Above"] else 0)
                 + float(rng.normal(0, 1)))
        price = max(0.5, price)

        records.append({
            "year": year, "km_driven": km, "fuel_type": fuel,
            "transmission": trans, "owner_type": owner, "brand": brand,
            "mileage": mileage, "engine_cc": engine, "power_bhp": power,
            "seats": seats, "price_lakh": round(price, 2),
        })
    return records


def train_and_save():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # Generate synthetic training data (pure numpy, no pandas)
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "cars.csv")
    if os.path.exists(data_path):
        # Try loading CSV with stdlib csv module
        import csv
        records = []
        with open(data_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append({k: v for k, v in row.items()})
        print(f"Loaded real data: {len(records)} rows")
    else:
        records = _generate_synthetic_data()
        print(f"Generated synthetic data: {len(records)} rows")

    # Encode categoricals
    encoders = {}
    for col in CAT_COLS:
        le = LabelEncoder()
        vals = [str(r[col]) for r in records]
        le.fit(vals)
        encoders[col] = le

    def encode_row(r):
        row = []
        for col in FEATURE_ORDER:
            v = r[col]
            if col in CAT_COLS:
                try:
                    v = int(encoders[col].transform([str(v)])[0])
                except Exception:
                    v = 0
            else:
                v = float(v)
            row.append(v)
        return row

    X = np.array([encode_row(r) for r in records])
    y = np.array([float(r["price_lakh"]) for r in records])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(n_estimators=200, max_depth=4, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)

    score = model.score(X_test, y_test)
    print(f"Model R² on test set: {score:.4f}")

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    with open(ENCODERS_PATH, "wb") as f:
        pickle.dump(encoders, f)

    print(f"Model saved to {MODEL_PATH}")
    return model, encoders


if __name__ == "__main__":
    train_and_save()
