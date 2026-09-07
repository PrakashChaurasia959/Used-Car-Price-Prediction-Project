import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PwdField({ id, name, placeholder, value, onChange, autoComplete, label }) {
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          id={id} name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value} onChange={onChange}
          required minLength={6} autoComplete={autoComplete}
          style={{ paddingRight: 44 }}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          style={{
            position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--gray-400)", display: "flex", alignItems: "center",
            padding: 2,
          }}
          aria-label={show ? "Hide password" : "Show password"}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm_password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await register(form.full_name, form.email, form.password, form.confirm_password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">🚗</div>
          <div className="auth-left-title">CarPrice AI</div>
          <div className="auth-left-sub">Know your car's real market value — instantly, accurately, free.</div>
          <div className="auth-left-features">
            {[
              ["📊", "R² > 0.99 Gradient Boosting model"],
              ["🔐", "Secure SHA-256 password hashing"],
              ["💾", "Save & review all predictions"],
              ["📱", "Responsive — works on any device"],
            ].map(([icon, text]) => (
              <div className="auth-left-feat" key={text}>
                <div className="auth-left-feat-icon">{icon}</div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-sub">Join CarPrice AI — it's free</p>

          {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">Full Name</label>
              <input id="full_name" name="full_name" type="text" placeholder="John Doe"
                value={form.full_name} onChange={onChange} required autoComplete="name" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={onChange} required autoComplete="email" />
            </div>

            <PwdField
              id="password" name="password" label="Password"
              placeholder="Min. 6 characters" value={form.password}
              onChange={onChange} autoComplete="new-password"
            />

            <PwdField
              id="confirm_password" name="confirm_password" label="Confirm Password"
              placeholder="Repeat your password" value={form.confirm_password}
              onChange={onChange} autoComplete="new-password"
            />

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 4 }} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Creating account…</>
                : "Create Account"
              }
            </button>
          </form>

          <p className="auth-footer-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
