from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel, EmailStr
from app.database import users_collection
from app.utils.auth import hash_password, verify_password, create_session, delete_session
import re

router = APIRouter(prefix="/auth", tags=["auth"])


# ---------- schemas ----------

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ---------- helpers ----------

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _validate_email(email: str):
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Invalid email address")


# ---------- routes ----------

@router.post("/register")
def register(body: RegisterRequest):
    if not body.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required")
    _validate_email(body.email)
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if body.password != body.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    email = body.email.lower().strip()
    if users_collection.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email already registered")

    user_doc = {
        "_id": email,          # use email as _id for easy lookup
        "full_name": body.full_name.strip(),
        "email": email,
        "password_hash": hash_password(body.password),
    }
    users_collection.insert_one(user_doc)
    token = create_session(email)
    return {"message": "Registration successful", "token": token, "full_name": body.full_name.strip()}


@router.post("/login")
def login(body: LoginRequest):
    _validate_email(body.email)
    email = body.email.lower().strip()
    user = users_collection.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_session(email)
    return {"message": "Login successful", "token": token, "full_name": user.get("full_name", "")}


@router.post("/logout")
def logout(authorization: str = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        delete_session(token)
    return {"message": "Logged out"}


@router.get("/me")
def me(authorization: str = Header(None)):
    from app.utils.deps import get_current_user
    from fastapi import Request
    # inline to avoid circular import in simple cases
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    from app.utils.auth import get_user_from_token
    token = authorization.split(" ", 1)[1]
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return {"email": user["email"], "full_name": user.get("full_name", "")}
