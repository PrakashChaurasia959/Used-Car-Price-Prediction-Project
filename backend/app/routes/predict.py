from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.utils.deps import get_current_user
from app.database import predictions_collection

router = APIRouter(prefix="/predict", tags=["prediction"])


class PredictRequest(BaseModel):
    year: int
    km_driven: int
    fuel_type: str
    transmission: str
    owner_type: str
    brand: str
    mileage: float
    engine_cc: int
    power_bhp: float
    seats: int


class SavePredictionRequest(BaseModel):
    year: int
    km_driven: int
    fuel_type: str
    transmission: str
    owner_type: str
    brand: str
    mileage: float
    engine_cc: int
    power_bhp: float
    seats: int
    predicted_price: float


@router.post("")
def predict_price(body: PredictRequest, user=Depends(get_current_user)):
    try:
        from ml.predictor import predict
        price = predict(body.model_dump())
        return {"predicted_price": price, "currency": "Lakh INR"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.post("/save")
def save_prediction(body: SavePredictionRequest, user=Depends(get_current_user)):
    doc = {
        "user_id": user["_id"],
        "email": user["email"],
        "timestamp": datetime.utcnow(),
        **body.model_dump(),
    }
    result = predictions_collection.insert_one(doc)
    return {"message": "Prediction saved", "id": str(result.inserted_id)}


@router.get("/history")
def prediction_history(user=Depends(get_current_user)):
    docs = list(
        predictions_collection.find(
            {"user_id": user["_id"]},
            {"_id": 1, "brand": 1, "year": 1, "km_driven": 1, "fuel_type": 1,
             "transmission": 1, "owner_type": 1, "mileage": 1, "engine_cc": 1,
             "power_bhp": 1, "seats": 1, "predicted_price": 1, "timestamp": 1}
        ).sort("timestamp", -1).limit(50)
    )
    for d in docs:
        d["id"] = str(d.pop("_id"))
        if "timestamp" in d:
            d["timestamp"] = d["timestamp"].isoformat()
    return {"history": docs}


@router.get("/stats")
def prediction_stats(user=Depends(get_current_user)):
    docs = list(predictions_collection.find(
        {"user_id": user["_id"]},
        {"predicted_price": 1, "brand": 1, "year": 1, "timestamp": 1}
    ).sort("timestamp", -1))
    total = len(docs)
    if total == 0:
        return {"total": 0, "latest_price": None, "avg_price": None, "latest_brand": None, "latest_year": None}
    prices = [d["predicted_price"] for d in docs if "predicted_price" in d]
    avg = round(sum(prices) / len(prices), 2) if prices else None
    latest = docs[0]
    return {
        "total": total,
        "latest_price": latest.get("predicted_price"),
        "latest_brand": latest.get("brand"),
        "latest_year": latest.get("year"),
        "avg_price": avg,
    }


@router.delete("/{prediction_id}")
def delete_prediction(prediction_id: str, user=Depends(get_current_user)):
    try:
        oid = ObjectId(prediction_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid prediction ID")
    result = predictions_collection.delete_one({"_id": oid, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return {"message": "Deleted"}
