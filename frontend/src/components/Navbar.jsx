import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  IconDashboard, IconCar, IconHistory, IconCalculator,
  IconInfo, IconUser, IconLogout, IconX, IconMenu
} from "./Icons";

const LINKS = [
  { to: "/dashboard",  label: "Dashboard",    Icon: IconDashboard },
  { to: "/predict",    label: "Predict",       Icon: IconCar },
  { to: "/history",    label: "History",       Icon: IconHistory },
  { to: "/compare",    label: "Compare",       Icon: null },
  { to: "/emi",        label: "EMI Calc",      Icon: IconCalculator },
  { to: "/about",      label: "About",         Icon: IconInfo },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const initials = user?.full_name
    ? user.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.[0] || "?").toUpperCase();

  const firstName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <>
      <header className="navbar">
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo-wrap">
            <span style={{ fontSize: 18 }}>🚗</span>
          </div>
          <span className="navbar-brand-text">CarPrice AI</span>
        </Link>

        <div className="navbar-spacer" />

        <nav className="navbar-links">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link${location.pathname === to ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="navbar-right">
          <div className="nav-user">
            <div className="nav-avatar">{initials}</div>
            <span className="nav-user-name">{firstName}</span>
          </div>
          <button className="btn-nav-logout" onClick={logout}>
            <IconLogout size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
            Logout
          </button>
          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <nav className={`nav-mobile-menu${open ? " open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0 12px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
          <div className="nav-avatar">{initials}</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{user?.full_name || firstName}</div>
            <div style={{ color: "var(--gray-500)", fontSize: 12 }}>{user?.email}</div>
          </div>
        </div>
        {LINKS.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link${location.pathname === to ? " active" : ""}`}
            onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            {Icon && <Icon size={16} />}
            {label}
          </Link>
        ))}
        <button
          className="btn-nav-logout"
          onClick={() => { setOpen(false); logout(); }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <IconLogout size={15} />
          Logout
        </button>
      </nav>
    </>
  );
}
