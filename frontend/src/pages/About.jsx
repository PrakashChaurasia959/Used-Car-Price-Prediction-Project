import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TECH = [
  { icon: "⚛️",  name: "React 19",      desc: "Frontend UI" },
  { icon: "⚡",  name: "Vite 8",         desc: "Build Tool" },
  { icon: "🐍",  name: "Python 3.14",   desc: "Backend Language" },
  { icon: "🚀",  name: "FastAPI",        desc: "REST API" },
  { icon: "🤖",  name: "Scikit-Learn",  desc: "ML Framework" },
  { icon: "🗄️",  name: "MongoDB",       desc: "Database" },
  { icon: "🐼",  name: "NumPy",         desc: "Numerical Ops" },
  { icon: "📦",  name: "Uvicorn",       desc: "ASGI Server" },
];

const ARCH = [
  { title: "User Interface (React + Vite)",        desc: "Single-page application with protected routes, auth context, and responsive design." },
  { title: "REST API Layer (FastAPI)",              desc: "Stateless JSON API with Bearer token authentication and request validation via Pydantic." },
  { title: "ML Inference Engine (scikit-learn)",   desc: "Gradient Boosting Regressor loaded at startup. Accepts 10 vehicle features and returns a price estimate." },
  { title: "Data Persistence (MongoDB)",           desc: "Stores users, session tokens, and prediction history. Each prediction is linked to the authenticated user." },
];

export default function About() {
  return (
    <div className="app-shell">
      <Navbar />

      {/* Hero */}
      <div className="about-hero">
        <div style={{ fontSize: 52, marginBottom: 16 }}>🚗</div>
        <h1>CarPrice AI</h1>
        <p>Smart Used Car Valuation Powered by Machine Learning</p>
        <p style={{ marginTop: 8, fontSize: 13, opacity: 0.5 }}>College Project · 2026</p>
      </div>

      <div className="about-content">

        {/* Problem Statement */}
        <div className="about-section">
          <h2><span>❓</span> Problem Statement</h2>
          <p>
            Buying or selling a used car in India is a challenge. Prices are highly inconsistent
            across platforms and dealers, and buyers often overpay or undersell without knowing the
            true market value. There is no transparent, data-driven way for an individual to
            instantly estimate what a used car is worth.
          </p>
        </div>

        <hr className="divider" />

        {/* Objective */}
        <div className="about-section">
          <h2><span>🎯</span> Objective</h2>
          <p>
            CarPrice AI addresses this by providing an instant, ML-powered used car price
            prediction system. Users enter vehicle details — brand, year, fuel type, kilometres
            driven, engine specs — and receive an estimated market value in seconds. All
            predictions are stored and can be compared over time.
          </p>
        </div>

        <hr className="divider" />

        {/* Technology Stack */}
        <div className="about-section">
          <h2><span>🛠️</span> Technology Stack</h2>
          <div className="tech-cards">
            {TECH.map(t => (
              <div className="tech-card" key={t.name}>
                <div className="tech-icon">{t.icon}</div>
                <div className="tech-name">{t.name}</div>
                <div className="tech-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* ML Model */}
        <div className="about-section">
          <h2><span>🤖</span> Machine Learning Model</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <p style={{ marginBottom: 16 }}>
                The prediction engine uses a <strong>Gradient Boosting Regressor</strong> from
                scikit-learn, an ensemble method that builds decision trees sequentially where each
                tree corrects errors of the previous one.
              </p>
              <p>
                The model is trained on used car data with 200 estimators, max depth of 4, and a
                learning rate of 0.1, achieving an R² score above 0.99 on the test set.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Algorithm",      "Gradient Boosting Regressor"],
                ["Library",        "scikit-learn 1.7+"],
                ["Input Features", "10 vehicle parameters"],
                ["R² Score",       "> 0.99 on test data"],
                ["Estimators",     "200 trees"],
                ["Output",         "Price in Lakh INR"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--gray-50)", borderRadius: "var(--r)", fontSize: 14 }}>
                  <span style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* System Architecture */}
        <div className="about-section">
          <h2><span>🏗️</span> System Architecture</h2>
          <div className="arch-steps">
            {ARCH.map(s => (
              <div className="arch-step" key={s.title}>
                <div>
                  <div className="arch-step-title">{s.title}</div>
                  <div className="arch-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* How Prediction Works */}
        <div className="about-section">
          <h2><span>⚙️</span> How Prediction Works</h2>
          <p style={{ marginBottom: 16 }}>
            When a user submits the prediction form, the frontend sends a POST request to
            <code style={{ background: "var(--gray-100)", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}> /predict </code>
            with 10 vehicle fields. The FastAPI backend passes these to the loaded
            <strong> Gradient Boosting Regressor</strong>. Categorical fields (brand, fuel type,
            transmission, owner type) are encoded using fitted <code style={{ background: "var(--gray-100)", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>LabelEncoder</code>s
            stored alongside the model. The regressor returns a price in Lakh INR which is
            returned as a JSON response and displayed instantly.
          </p>
        </div>

        <hr className="divider" />

        {/* Database */}
        <div className="about-section">
          <h2><span>🗄️</span> Database</h2>
          <p>
            MongoDB stores three collections: <strong>users</strong> (email + hashed password),
            <strong> sessions</strong> (Bearer tokens with 24-hour expiry), and
            <strong> predictions</strong> (all saved prediction records linked to user IDs).
            Passwords are hashed with SHA-256 + salt. No OTP or third-party auth is used.
          </p>
        </div>

        <hr className="divider" />

        {/* Future Scope */}
        <div className="about-section">
          <h2><span>🔭</span> Future Scope</h2>
          <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7 }}>
            <li>Train on real scraped used car marketplace data (CarDekho, Cars24, OLX)</li>
            <li>Add location-based price adjustment by city/region</li>
            <li>Integrate depreciation curves per brand and model</li>
            <li>Add PDF export for prediction reports</li>
            <li>Multi-language support (Hindi, Tamil, etc.)</li>
            <li>Mobile application using React Native</li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/predict" className="btn btn-primary btn-lg">
            Try the Prediction Engine →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
