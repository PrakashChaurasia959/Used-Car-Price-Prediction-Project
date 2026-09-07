import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarImage from "../components/CarImage";
import {
  IconCar, IconGauge, IconFuel, IconCalendar,
  IconUser, IconCheckCircle, IconArrow
} from "../components/Icons";

const BRANDS       = ["Maruti","Hyundai","Honda","Toyota","Ford","Tata","Mahindra","Volkswagen","BMW","Mercedes"];
const FUEL_TYPES   = ["Petrol","Diesel","CNG","Electric"];
const TRANSMISSIONS= ["Manual","Automatic"];
const OWNER_TYPES  = ["First","Second","Third","Fourth & Above"];

const INITIAL = {
  brand: "Maruti", year: 2019, km_driven: 40000,
  fuel_type: "Petrol", transmission: "Manual", owner_type: "First",
  mileage: 18.0, engine_cc: 1200, power_bhp: 82.0, seats: 5,
};

function fmt(n) { return n?.toLocaleString("en-IN") ?? "—"; }

export default function Predict() {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = (name, val) => {
    setForm(f => ({ ...f, [name]: val }));
    setResult(null); setSaved(false);
  };
  const onChange = e => {
    const { name, value, type } = e.target;
    set(name, type === "number" ? Number(value) : value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError(""); setResult(null); setSaved(false);
    setLoading(true);
    try {
      const data = await api.predict(form);
      setResult(data.predicted_price);
    } catch (err) {
      setError("Prediction failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (result === null) return;
    setSaving(true);
    try {
      await api.savePrediction({ ...form, predicted_price: result });
      setSaved(true);
    } catch {
      setError("Could not save prediction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Simple ±10% range from single model output
  const rangeLow  = result != null ? Math.max(0.1, +(result * 0.90).toFixed(2)) : null;
  const rangeHigh = result != null ? +(result * 1.10).toFixed(2) : null;

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-body">
        <div className="page-header">
          <h1>Predict Car Price</h1>
          <p>Fill in the vehicle details to get an instant ML-powered market value estimate.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="predict-layout">
          {/* ── Form ── */}
          <div>
            {/* Vehicle Information */}
            <div className="form-section">
              <div className="form-section-header">
                <IconCar size={16} className="form-section-icon" />
                <h3>Vehicle Information</h3>
              </div>
              <div className="form-section-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <div className="input-wrap">
                      <IconCar size={15} />
                      <select name="brand" value={form.brand} onChange={onChange}>
                        {BRANDS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Year of Manufacture</label>
                    <div className="input-wrap">
                      <IconCalendar size={15} />
                      <input name="year" type="number" min="1995" max="2024"
                        value={form.year} onChange={onChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fuel Type</label>
                    <div className="input-wrap">
                      <IconFuel size={15} />
                      <select name="fuel_type" value={form.fuel_type} onChange={onChange}>
                        {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Transmission</label>
                    <div className="input-wrap">
                      <IconGauge size={15} />
                      <select name="transmission" value={form.transmission} onChange={onChange}>
                        {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Information */}
            <div className="form-section">
              <div className="form-section-header">
                <IconGauge size={16} className="form-section-icon" />
                <h3>Usage Information</h3>
              </div>
              <div className="form-section-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Kilometres Driven</label>
                    <div className="input-wrap">
                      <IconGauge size={15} />
                      <input name="km_driven" type="number" min="0" max="999999"
                        placeholder="e.g. 45000" value={form.km_driven} onChange={onChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Owner Type</label>
                    <div className="input-wrap">
                      <IconUser size={15} />
                      <select name="owner_type" value={form.owner_type} onChange={onChange}>
                        {OWNER_TYPES.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="form-section">
              <div className="form-section-header">
                <IconGauge size={16} className="form-section-icon" />
                <h3>Technical Specifications</h3>
              </div>
              <div className="form-section-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Mileage (km/l)</label>
                    <input name="mileage" type="number" min="5" max="50" step="0.1"
                      placeholder="e.g. 18.5" value={form.mileage} onChange={onChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Engine Displacement (cc)</label>
                    <input name="engine_cc" type="number" min="500" max="6000"
                      placeholder="e.g. 1200" value={form.engine_cc} onChange={onChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Power (bhp)</label>
                    <input name="power_bhp" type="number" min="20" max="600" step="0.1"
                      placeholder="e.g. 88.5" value={form.power_bhp} onChange={onChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Seating Capacity</label>
                    <select name="seats" value={form.seats} onChange={onChange}>
                      {[4,5,6,7,8].map(s => <option key={s} value={s}>{s} Seats</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSubmit}
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" style={{ width:18,height:18,borderWidth:2,marginRight:8 }} />Analysing vehicle…</>
              ) : (
                <>Predict Car Price <IconArrow size={16} /></>
              )}
            </button>
          </div>

          {/* ── Result panel ── */}
          <div>
            {result === null ? (
              <div className="predict-empty">
                <div className="predict-empty-icon">
                  <IconCar size={32} />
                </div>
                <h3>Ready to predict</h3>
                <p>Fill in the vehicle details on the left and click Predict Car Price.</p>
                <CarImage brand={form.brand}
                  style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "var(--r-lg)", marginTop: 8 }} />
              </div>
            ) : (
              <div className="result-card">
                <span className="result-card-badge">AI Estimated Price</span>

                <CarImage brand={form.brand}
                  style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "var(--r-lg)" }} />

                <div>
                  <div className="result-price-main">₹ {fmt(result)}</div>
                  <div className="result-price-unit">Lakh INR</div>
                </div>

                {/* Price range – honest ±10% band */}
                <div className="result-range-row">
                  <div className="result-range-label">Approximate Market Range</div>
                  <div className="result-range-vals">
                    <span className="result-range-low">₹ {rangeLow} L</span>
                    <span style={{ color: "var(--gray-400)", fontSize: 12 }}>to</span>
                    <span className="result-range-high">₹ {rangeHigh} L</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    ±10% indicative market band
                  </div>
                </div>

                {/* Car details */}
                <div className="result-car-meta">
                  {[
                    ["Brand",        form.brand],
                    ["Year",         form.year],
                    ["Fuel Type",    form.fuel_type],
                    ["Transmission", form.transmission],
                    ["KM Driven",    fmt(form.km_driven) + " km"],
                    ["Owner",        form.owner_type],
                    ["Engine",       form.engine_cc + " cc"],
                    ["Power",        form.power_bhp + " bhp"],
                  ].map(([k, v]) => (
                    <div className="result-meta-row" key={k}>
                      <span className="result-meta-key">{k}</span>
                      <span className="result-meta-val">{v}</span>
                    </div>
                  ))}
                </div>

                {saved ? (
                  <div className="alert alert-success" style={{ width: "100%", margin: 0 }}>
                    <IconCheckCircle size={16} /> Saved to history
                  </div>
                ) : (
                  <button onClick={onSave} className="btn btn-secondary btn-full" disabled={saving}>
                    {saving ? "Saving…" : "💾 Save to History"}
                  </button>
                )}

                <Link to="/history" style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  View all predictions →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
