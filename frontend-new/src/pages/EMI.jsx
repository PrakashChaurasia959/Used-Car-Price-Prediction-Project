import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IconCalculator } from "../components/Icons";

function fmt(n) {
  if (!n && n !== 0) return "—";
  return "₹ " + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function EMI() {
  const [form, setForm] = useState({
    car_price: 800000,
    down_payment: 200000,
    interest_rate: 9.5,
    tenure_months: 60,
  });

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: Number(value) }));
  };

  const result = useMemo(() => {
    const principal = Math.max(0, form.car_price - form.down_payment);
    if (principal <= 0 || form.interest_rate <= 0 || form.tenure_months <= 0) {
      return null;
    }
    const r = form.interest_rate / 12 / 100;
    const n = form.tenure_months;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total_payment = emi * n;
    const total_interest = total_payment - principal;
    return {
      principal: Math.round(principal),
      emi: Math.round(emi),
      total_interest: Math.round(total_interest),
      total_payment: Math.round(total_payment),
    };
  }, [form]);

  const tenureOptions = [12, 24, 36, 48, 60, 72, 84];

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-body">
        <div className="page-header">
          <h1>Car EMI Calculator</h1>
          <p>Calculate your monthly car loan EMI, total interest, and overall payment.</p>
        </div>

        <div className="emi-layout">
          {/* Inputs */}
          <div className="card card-p">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <IconCalculator size={17} style={{ color: "var(--brand-600)" }} />
              Loan Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Car Price (₹)</label>
                <input
                  name="car_price" type="number" min="0" step="10000"
                  value={form.car_price} onChange={onChange}
                />
                <span className="text-sm text-muted" style={{ marginTop: 2 }}>{fmt(form.car_price)}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Down Payment (₹)</label>
                <input
                  name="down_payment" type="number" min="0" step="10000"
                  value={form.down_payment} onChange={onChange}
                />
                <span className="text-sm text-muted" style={{ marginTop: 2 }}>
                  Loan Amount: {fmt(Math.max(0, form.car_price - form.down_payment))}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Annual Interest Rate (%)</label>
                <input
                  name="interest_rate" type="number" min="1" max="30" step="0.1"
                  value={form.interest_rate} onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loan Tenure</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {tenureOptions.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tenure_months: t }))}
                      className="btn btn-sm"
                      style={{
                        background: form.tenure_months === t ? "var(--brand-600)" : "var(--gray-100)",
                        color: form.tenure_months === t ? "#fff" : "var(--text-secondary)",
                        border: "1px solid " + (form.tenure_months === t ? "var(--brand-600)" : "var(--border)"),
                      }}
                    >
                      {t < 12 ? t + " mo" : (t / 12) + " yr"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          {result ? (
            <div className="emi-result-card">
              <div className="emi-result-main">
                <div className="emi-result-label">Monthly EMI</div>
                <div className="emi-result-value">{fmt(result.emi)}</div>
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
                  per month for {form.tenure_months} months
                </div>
              </div>

              <div className="emi-breakdown">
                {[
                  ["Loan Amount",    fmt(result.principal)],
                  ["Total Interest", fmt(result.total_interest)],
                  ["Total Payment",  fmt(result.total_payment)],
                  ["Interest Rate",  form.interest_rate + "% p.a."],
                  ["Tenure",         form.tenure_months + " months (" + (form.tenure_months / 12).toFixed(1) + " yrs)"],
                ].map(([label, val]) => (
                  <div className="emi-row" key={label}>
                    <span className="emi-row-label">{label}</span>
                    <span className="emi-row-value">{val}</span>
                  </div>
                ))}
              </div>

              {/* Interest proportion */}
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "var(--r)", padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                  <span>Principal</span>
                  <span>Interest</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: (result.principal / result.total_payment * 100).toFixed(1) + "%",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 4,
                    transition: "width 0.4s",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.65, marginTop: 4 }}>
                  <span>{(result.principal / result.total_payment * 100).toFixed(0)}%</span>
                  <span>{(result.total_interest / result.total_payment * 100).toFixed(0)}%</span>
                </div>
              </div>

              <p style={{ fontSize: 11, opacity: 0.5, textAlign: "center" }}>
                * This is an estimate. Actual EMI may vary by lender.
              </p>
            </div>
          ) : (
            <div className="card card-p flex-center" style={{ minHeight: 240, flexDirection: "column", gap: 12, color: "var(--text-muted)", textAlign: "center" }}>
              <IconCalculator size={36} style={{ opacity: 0.3 }} />
              <p>Enter loan details to calculate EMI.</p>
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="alert alert-info" style={{ marginTop: 24 }}>
          <span>ℹ</span>
          <span>
            This calculator uses the standard reducing-balance EMI formula.
            It does not connect to any bank or financial system.
            Always consult your lender for exact figures.
          </span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
