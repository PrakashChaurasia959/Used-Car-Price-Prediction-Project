import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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
            Smart Used Car Valuation Powered by Machine Learning
          </div>
          <div className="auth-left-features">
            {[
              ["🤖", "ML-powered Gradient Boosting model"],
              ["⚡", "Instant price estimates in seconds"],
              ["📋", "Full prediction history & comparison"],
              ["💰", "Built-in EMI calculator"],
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
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-sub">Sign in to your CarPrice AI account</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">
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
                placeholder="Your password"
                value={form.password} onChange={onChange}
                required autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 4 }} disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Signing in…</>
              ) : "Sign In"}
            </button>
          </form>

          <p className="auth-footer-link">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
