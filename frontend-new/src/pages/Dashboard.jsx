import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { api } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarImage from "../components/CarImage";
import {
  IconCar, IconTrending, IconStar, IconHistory,
  IconCalculator, IconCompare, IconArrow, IconBrain, IconCheckCircle
} from "../components/Icons";

const FEATURED = [
  { brand: "BMW",     label: "BMW 5 Series", desc: "Luxury Sedan · Automatic",  range: "₹ 28–55 L" },
  { brand: "Toyota",  label: "Toyota Fortuner", desc: "Premium SUV · Diesel",   range: "₹ 22–38 L" },
  { brand: "Honda",   label: "Honda City",   desc: "Executive Sedan · Petrol",   range: "₹ 8–16 L" },
  { brand: "Hyundai", label: "Hyundai Creta", desc: "Compact SUV · Petrol",     range: "₹ 10–18 L" },
  { brand: "Maruti",  label: "Maruti Swift", desc: "Hatchback · Petrol",         range: "₹ 4–8 L" },
  { brand: "Mercedes",label: "Mercedes C-Class", desc: "Luxury Sedan · Diesel", range: "₹ 35–70 L" },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.history()])
      .then(([s, h]) => {
        setStats(s);
        setRecent((h.history || []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-body">
        {/* Welcome bar with hero image */}
        <div className="welcome-bar" style={{ overflow: "hidden", minHeight: 130 }}>
          <div style={{ zIndex: 1 }}>
            <h1>Hello, {firstName} 👋</h1>
            <p>Smart Used Car Valuation Powered by Machine Learning</p>
            <Link to="/predict" className="btn btn-lg" style={{ marginTop: 16, background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", display: "inline-flex" }}>
              New Prediction <IconArrow size={16} />
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=70&auto=format&fit=crop&crop=right"
            alt="Luxury car"
            style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              height: "100%", width: "340px",
              objectFit: "cover", objectPosition: "center",
              opacity: 0.22, maskImage: "linear-gradient(to right, transparent 0%, black 40%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%)",
              pointerEvents: "none",
            }}
            loading="lazy"
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Stats cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Total Predictions</span>
              <div className="stat-card-icon-wrap stat-card-icon-blue"><IconHistory size={18} /></div>
            </div>
            <div className="stat-card-value">
              {loadingStats ? "—" : (stats?.total ?? 0)}
            </div>
            <div className="stat-card-sub">All time predictions made</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Latest Prediction</span>
              <div className="stat-card-icon-wrap stat-card-icon-green"><IconCar size={18} /></div>
            </div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>
              {loadingStats ? "—" : stats?.latest_price != null ? `₹ ${stats.latest_price} L` : "—"}
            </div>
            <div className="stat-card-sub">
              {stats?.latest_brand ? `${stats.latest_brand} · ${stats.latest_year}` : "No predictions yet"}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Average Price</span>
              <div className="stat-card-icon-wrap stat-card-icon-orange"><IconTrending size={18} /></div>
            </div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>
              {loadingStats ? "—" : stats?.avg_price != null ? `₹ ${stats.avg_price} L` : "—"}
            </div>
            <div className="stat-card-sub">Across all saved predictions</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Saved Cars</span>
              <div className="stat-card-icon-wrap stat-card-icon-purple"><IconStar size={18} /></div>
            </div>
            <div className="stat-card-value">
              {loadingStats ? "—" : (stats?.total ?? 0)}
            </div>
            <div className="stat-card-sub">In your history</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          <Link to="/predict" className="qa-card">
            <div className="qa-icon qa-icon-blue">
              <IconCar size={22} style={{ color: "var(--brand-600)" }} />
            </div>
            <h3>Predict Car Price</h3>
            <p>Enter vehicle details and get an instant ML-powered market value estimate.</p>
            <span className="qa-cta">Start prediction →</span>
          </Link>
          <Link to="/history" className="qa-card">
            <div className="qa-icon qa-icon-green">
              <IconHistory size={22} style={{ color: "var(--success)" }} />
            </div>
            <h3>View History</h3>
            <p>Browse, filter, and manage all your saved predictions in one place.</p>
            <span className="qa-cta">Open history →</span>
          </Link>
          <Link to="/emi" className="qa-card">
            <div className="qa-icon qa-icon-purple">
              <IconCalculator size={22} style={{ color: "#7c3aed" }} />
            </div>
            <h3>EMI Calculator</h3>
            <p>Calculate monthly EMI, total interest, and payment for any car loan.</p>
            <span className="qa-cta">Calculate EMI →</span>
          </Link>
        </div>

        {/* Recent predictions */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-header">
            <h2>Recent Predictions</h2>
            {recent.length > 0 && (
              <Link to="/history" className="btn btn-sm btn-ghost">View all</Link>
            )}
          </div>

          {loadingStats ? (
            <div className="card card-p" style={{ textAlign: "center", color: "var(--text-muted)", padding: 32 }}>
              <div className="spinner" style={{ margin: "0 auto 8px" }} />
              Loading…
            </div>
          ) : recent.length === 0 ? (
            <div className="empty-state" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)" }}>
              <CarImage brand="Maruti" style={{ width: 160, height: 100, borderRadius: "var(--r-lg)", opacity: 0.6 }} />
              <h3>No predictions yet</h3>
              <p>Your prediction history will appear here once you make your first prediction.</p>
              <Link to="/predict" className="btn btn-primary">Predict your first car →</Link>
            </div>
          ) : (
            <div className="history-grid">
              {recent.map(row => (
                <div className="history-row" key={row.id}>
                  <CarImage brand={row.brand} className="history-thumb" />
                  <div className="history-info">
                    <h4>{row.brand} · {row.year}</h4>
                    <p>{row.km_driven?.toLocaleString()} km · {row.fuel_type} · {row.transmission}</p>
                    <div className="history-badges">
                      <span className="badge badge-blue">{row.fuel_type}</span>
                      <span className="badge badge-gray">{row.transmission}</span>
                    </div>
                  </div>
                  <div className="history-right">
                    <div className="history-price">₹ {row.predicted_price} L</div>
                    <div className="history-date">{formatDate(row.timestamp)}</div>
                    <Link to="/history" className="btn btn-sm btn-secondary">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured cars */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-header">
            <h2>Featured Car Categories</h2>
            <Link to="/predict" className="btn btn-sm btn-ghost">Predict any car →</Link>
          </div>
          <div className="featured-grid">
            {FEATURED.map(car => (
              <Link to="/predict" key={car.brand + car.label} className="featured-card" style={{ textDecoration: "none" }}>
                <CarImage brand={car.brand} className="featured-img" />
                <div className="featured-body">
                  <div className="featured-title">{car.label}</div>
                  <div className="featured-sub">{car.desc}</div>
                  <div className="featured-price">{car.range}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-header" style={{ marginBottom: 20 }}>
            <h2>How It Works</h2>
          </div>
          <div className="how-steps">
            {[
              { n: "01", title: "Enter Car Details", desc: "Provide brand, year, fuel type, km driven and technical specs." },
              { n: "02", title: "ML Analysis",        desc: "Our Gradient Boosting model analyzes 10+ vehicle parameters." },
              { n: "03", title: "Price Prediction",   desc: "Get an instant estimated market value with price range." },
              { n: "04", title: "Save & Review",      desc: "Save predictions to history, compare and track over time." },
            ].map(s => (
              <div className="how-step" key={s.n}>
                <div className="how-step-num">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ML section */}
        <div className="ml-section">
          <div className="ml-header">
            <IconBrain size={22} style={{ color: "var(--brand-600)" }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Powered by Machine Learning</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Real model — not a mock</div>
            </div>
            <span className="ml-badge" style={{ marginLeft: "auto" }}>Gradient Boosting Regressor</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.7 }}>
            This system uses a <strong>Gradient Boosting Regressor</strong> (scikit-learn) trained on used car market data.
            The model considers 10 vehicle features including brand, manufacturing year, fuel type, transmission,
            kilometres driven, engine displacement, power output and seating capacity to produce accurate price estimates.
          </p>
          <div className="ml-metrics">
            <div className="ml-metric">
              <div className="ml-metric-label">R² Score</div>
              <div className="ml-metric-value">&gt; 0.99</div>
              <div className="ml-metric-sub">Coefficient of Determination</div>
            </div>
            <div className="ml-metric">
              <div className="ml-metric-label">Algorithm</div>
              <div className="ml-metric-value" style={{ fontSize: 16, paddingTop: 6 }}>GBR</div>
              <div className="ml-metric-sub">Gradient Boosting Regressor</div>
            </div>
            <div className="ml-metric">
              <div className="ml-metric-label">Features Used</div>
              <div className="ml-metric-value">10</div>
              <div className="ml-metric-sub">Vehicle parameters</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
