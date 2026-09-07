import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { api } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IconLogout, IconUser, IconHistory, IconTrending } from "../components/Icons";

export default function Profile() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.stats().then(s => setStats(s)).catch(() => {});
  }, []);

  const initials = user?.full_name
    ? user.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.[0] || "?").toUpperCase();

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-body" style={{ maxWidth: 760 }}>
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Your account information and activity summary.</p>
        </div>

        {/* Header card */}
        <div className="profile-header-card">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-info">
            <h2>{user?.full_name || "User"}</h2>
            <p>{user?.email}</p>
            <p style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>CarPrice AI Member</p>
          </div>
          <button
            className="btn btn-sm"
            onClick={logout}
            style={{ marginLeft: "auto", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }}
          >
            <IconLogout size={14} /> Logout
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Predictions Made</span>
              <div className="stat-card-icon-wrap stat-card-icon-blue"><IconHistory size={17} /></div>
            </div>
            <div className="stat-card-value">{stats?.total ?? "—"}</div>
            <div className="stat-card-sub">Total saved predictions</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Latest Price</span>
              <div className="stat-card-icon-wrap stat-card-icon-green"><IconTrending size={17} /></div>
            </div>
            <div className="stat-card-value" style={{ fontSize: 20 }}>
              {stats?.latest_price != null ? `₹ ${stats.latest_price} L` : "—"}
            </div>
            <div className="stat-card-sub">{stats?.latest_brand || "No predictions yet"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Average Price</span>
              <div className="stat-card-icon-wrap stat-card-icon-orange"><IconTrending size={17} /></div>
            </div>
            <div className="stat-card-value" style={{ fontSize: 20 }}>
              {stats?.avg_price != null ? `₹ ${stats.avg_price} L` : "—"}
            </div>
            <div className="stat-card-sub">Across all predictions</div>
          </div>
        </div>

        {/* Account details */}
        <div className="card card-p" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <IconUser size={17} style={{ color: "var(--brand-600)" }} />
            Account Details
          </h3>
          <div className="profile-grid">
            <div className="profile-field">
              <div className="profile-field-label">Full Name</div>
              <div className="profile-field-value">{user?.full_name || "—"}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Email Address</div>
              <div className="profile-field-value">{user?.email || "—"}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Account Type</div>
              <div className="profile-field-value">Standard User</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Platform</div>
              <div className="profile-field-value">CarPrice AI</div>
            </div>
          </div>
        </div>

        <button className="btn btn-danger btn-full" onClick={logout}>
          <IconLogout size={16} />
          Sign Out of Account
        </button>
      </main>

      <Footer />
    </div>
  );
}
