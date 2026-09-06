from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "usedcar_db")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
sessions_collection = db["sessions"]
predictions_collection = db["predictions"]
