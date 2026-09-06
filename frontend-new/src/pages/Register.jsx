import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

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
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
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
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">🚗</div>
          <div className="auth-left-title">CarPrice AI</div>
          <div className="auth-left-sub">
            Know your car's real market value — instantly, accurately, free.
          </div>
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

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-sub">Join CarPrice AI — it's free</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">Full Name</label>
              <input
                id="full_name" name="full_name" type="text"
                placeholder="John Doe"
                value={form.full_name} onChange={onChange}
                required autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com"
                value={form.email} onChange={onChange}
                required autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password"
                placeholder="Min. 6 characters"
                value={form.password} onChange={onChange}
                required minLength={6} autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm_password">Confirm Password</label>
              <input
                id="confirm_password" name="confirm_password" type="password"
                placeholder="Repeat your password"
                value={form.confirm_password} onChange={onChange}
                required autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 4 }} disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Creating account…</>
              ) : "Create Account"}
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
