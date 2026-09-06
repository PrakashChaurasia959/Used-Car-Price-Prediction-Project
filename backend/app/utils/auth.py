import hashlib
import secrets
from datetime import datetime, timedelta
from app.database import users_collection, sessions_collection


def hash_password(password: str) -> str:
    """Hash password using SHA-256 with a salt."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{hashed}"


def verify_password(password: str, stored: str) -> bool:
    """Verify password against stored salt:hash."""
    try:
        salt, hashed = stored.split(":", 1)
        return hashlib.sha256((salt + password).encode()).hexdigest() == hashed
    except Exception:
        return False


def create_session(user_id: str) -> str:
    """Create a session token and store it in DB."""
    token = secrets.token_hex(32)
    sessions_collection.delete_many({"user_id": user_id})  # clear old sessions
    sessions_collection.insert_one({
        "user_id": user_id,
        "token": token,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(hours=24),
    })
    return token


def get_user_from_token(token: str):
    """Return user document if token is valid, else None."""
    if not token:
        return None
    session = sessions_collection.find_one({"token": token})
    if not session:
        return None
    if session["expires_at"] < datetime.utcnow():
        sessions_collection.delete_one({"token": token})
        return None
    user = users_collection.find_one({"_id": session["user_id"]})
    return user


def delete_session(token: str):
    """Remove session token."""
    sessions_collection.delete_one({"token": token})
