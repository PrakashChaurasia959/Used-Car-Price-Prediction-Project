import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="navbar-logo-wrap" style={{ width: 32, height: 32 }}>
              <span style={{ fontSize: 16 }}>🚗</span>
            </div>
            <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>CarPrice AI</span>
          </div>
          <p>Smart Used Car Valuation Powered by Machine Learning. Get accurate price estimates instantly.</p>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/predict">Predict Price</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/compare">Compare Cars</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Tools</h4>
          <ul>
            <li><Link to="/emi">EMI Calculator</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/about">About Project</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Technology</h4>
          <ul>
            <li><a href="#" onClick={e => e.preventDefault()}>React + Vite</a></li>
            <li><a href="#" onClick={e => e.preventDefault()}>FastAPI</a></li>
            <li><a href="#" onClick={e => e.preventDefault()}>Scikit-Learn</a></li>
            <li><a href="#" onClick={e => e.preventDefault()}>MongoDB</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CarPrice AI — College Project</span>
        <span>Built with React · FastAPI · Python · ML</span>
      </div>
    </footer>
  );
}
