# 🚗 CarPrice AI — Used Car Price Prediction

> **Smart Used Car Valuation Powered by Machine Learning**

A full-stack web application that predicts the market value of used cars using a **Gradient Boosting Regressor** ML model. Built with React, FastAPI, Python, and MongoDB.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Secure email/password login & register with SHA-256 hashed passwords |
| 🔮 Price Prediction | ML-powered instant used car valuation (10 vehicle parameters) |
| 📋 Prediction History | Save, view, search, filter, sort and delete past predictions |
| 📊 Dashboard | Live stats — total predictions, latest price, average price |
| ⚖️ Car Comparison | Compare 2 saved predictions side by side |
| 💰 EMI Calculator | Calculate monthly car loan EMI, total interest & payment |
| 👤 Profile Page | User account info and activity summary |
| ℹ️ About Page | Full project documentation — model, architecture, tech stack |
| 📱 Responsive | Works on desktop, laptop, tablet and mobile |

---

## 🧠 Machine Learning Model

| Property | Value |
|---|---|
| **Algorithm** | Gradient Boosting Regressor |
| **Library** | scikit-learn |
| **R² Score** | > 0.99 |
| **Estimators** | 200 trees |
| **Max Depth** | 4 |
| **Learning Rate** | 0.1 |
| **Input Features** | 10 (brand, year, km driven, fuel type, transmission, owner type, mileage, engine cc, power bhp, seats) |
| **Output** | Predicted price in Lakh INR |

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite 8
- React Router DOM
- Custom CSS design system (no UI framework)
- Inline SVG icons (no icon library)

**Backend**
- Python 3.14
- FastAPI 0.141+
- Uvicorn (ASGI server)
- Pydantic v2
- python-dotenv

**Machine Learning**
- scikit-learn (GradientBoostingRegressor)
- NumPy
- LabelEncoder for categorical features

**Database**
- MongoDB (pymongo)
- Collections: `users`, `sessions`, `predictions`

**Security**
- SHA-256 + salt password hashing (stdlib `hashlib`)
- Server-side session tokens (24-hour expiry)
- Bearer token authentication

---

## 📁 Project Structure

```
Used-Car-Price-Prediction-Project/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env                     # MongoDB URI, DB name (not committed)
│   ├── app/
│   │   ├── database.py          # MongoDB collections
│   │   ├── routes/
│   │   │   ├── auth.py          # /auth/register, /login, /logout, /me
│   │   │   └── predict.py       # /predict, /predict/save, /history, /stats, DELETE
│   │   └── utils/
│   │       ├── auth.py          # Password hashing, session management
│   │       └── deps.py          # Bearer token dependency
│   └── ml/
│       ├── model_trainer.py     # Train & save GBR model
│       ├── predictor.py         # Load model & run inference
│       └── model/               # Saved .pkl files (not committed)
│
└── frontend-new/
    ├── src/
    │   ├── App.jsx              # Routes (9 pages)
    │   ├── AuthContext.jsx      # Global auth state
    │   ├── api.js               # All API calls
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Icons.jsx        # 22 inline SVG icons
    │   │   └── CarImage.jsx     # Brand-mapped car images
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Predict.jsx
    │   │   ├── History.jsx
    │   │   ├── Profile.jsx
    │   │   ├── EMI.jsx
    │   │   ├── Compare.jsx
    │   │   └── About.jsx
    │   └── index.css            # Complete design system
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Clone the repository

```bash
git clone https://github.com/PrakashChaurasia959/Used-Car-Price-Prediction-Project.git
cd Used-Car-Price-Prediction-Project
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
# Create backend/.env with:
# MONGO_URI=mongodb://localhost:27017
# DB_NAME=usedcar_db

# Train the ML model (first time only)
python ml/model_trainer.py

# Start the backend server
$env:PYTHONPATH = "."   # Windows PowerShell
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend-new

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, returns Bearer token |
| POST | `/auth/logout` | ✅ | Invalidate session |
| GET | `/auth/me` | ✅ | Get current user info |
| POST | `/predict` | ✅ | Run ML price prediction |
| POST | `/predict/save` | ✅ | Save prediction to history |
| GET | `/predict/history` | ✅ | Get user's prediction history |
| GET | `/predict/stats` | ✅ | Get stats (total, avg, latest) |
| DELETE | `/predict/{id}` | ✅ | Delete a saved prediction |

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=usedcar_db
SECRET_KEY=your_secret_key_here
```

---

## 🖥️ Screenshots

> Dashboard · Predict · History · EMI Calculator · About

---

## 📚 About This Project

This is a college final year project demonstrating:

- **End-to-end ML pipeline** — data generation, model training, serialization, and real-time inference
- **REST API design** — FastAPI with Pydantic validation, dependency injection, and proper HTTP status codes
- **React SPA** — context-based auth, protected routes, responsive layout without external UI libraries
- **NoSQL database** — MongoDB with document-based storage for users, sessions, and predictions
- **Security fundamentals** — password hashing with salt, session-based auth with expiry

---

## 👨‍💻 Author

**Prakash Chaurasia**  
GitHub: [@PrakashChaurasia959](https://github.com/PrakashChaurasia959)

---

## 📄 License

This project is for educational purposes.
