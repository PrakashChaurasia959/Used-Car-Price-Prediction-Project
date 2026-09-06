import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarImage from "../components/CarImage";
import { IconCompare } from "../components/Icons";

function Slot({ label, history, selected, onSelect, onClear }) {
  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>
        {label}
      </div>
      {selected ? (
        <div className="compare-card">
          <CarImage brand={selected.brand} className="compare-thumb" />
          <div className="compare-body">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.brand} · {selected.year}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{selected.fuel_type} · {selected.transmission}</div>
              </div>
              <button className="btn btn-sm btn-ghost" onClick={onClear}>Change</button>
            </div>
            <table className="compare-table">
              <tbody>
                {[
                  ["KM Driven",    selected.km_driven?.toLocaleString() + " km"],
                  ["Fuel",         selected.fuel_type],
                  ["Transmission", selected.transmission],
                  ["Engine",       selected.engine_cc ? selected.engine_cc + " cc" : "—"],
                  ["Power",        selected.power_bhp ? selected.power_bhp + " bhp" : "—"],
                  ["Seats",        selected.seats || "—"],
                ].map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="compare-select-area">
          <IconCompare size={32} style={{ color: "var(--gray-300)" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Select a saved prediction</p>
          {history.length === 0 ? (
            <Link to="/predict" className="btn btn-primary btn-sm">Make a prediction first</Link>
          ) : (
            <div style={{ width: "100%", maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map(row => (
                <button
                  key={row.id}
                  className="btn btn-ghost"
                  style={{ justifyContent: "space-between", textAlign: "left" }}
                  onClick={() => onSelect(row)}
                >
                  <span>{row.brand} · {row.year} · {row.fuel_type}</span>
                  <span style={{ fontWeight: 700, color: "var(--brand-600)" }}>₹ {row.predicted_price} L</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Compare() {
  const [history, setHistory] = useState([]);
  const [carA, setCarA] = useState(null);
  const [carB, setCarB] = useState(null);

  useEffect(() => {
    api.history().then(d => setHistory(d.history || [])).catch(() => {});
  }, []);

  const aWins = carA && carB && carA.predicted_price < carB.predicted_price;
  const bWins = carA && carB && carB.predicted_price < carA.predicted_price;

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-body">
        <div className="page-header">
          <h1>Compare Predictions</h1>
          <p>Select two saved predictions to compare their vehicle details and estimated prices side by side.</p>
        </div>

        <div className="compare-grid">
          <Slot
            label="Car A"
            history={history.filter(r => r.id !== carB?.id)}
            selected={carA}
            onSelect={setCarA}
            onClear={() => setCarA(null)}
          />
          <Slot
            label="Car B"
            history={history.filter(r => r.id !== carA?.id)}
            selected={carB}
            onSelect={setCarB}
            onClear={() => setCarB(null)}
          />
        </div>

        {/* Price comparison */}
        {carA && carB && (
          <div className="card card-p" style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>Price Comparison</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
              <div className={`card card-p text-center ${aWins ? "compare-winner" : bWins ? "compare-loser" : ""}`}
                style={{ borderRadius: "var(--r-lg)" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{carA.brand} · {carA.year}</div>
                <div className="compare-price">₹ {carA.predicted_price} L</div>
                {aWins && <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginTop: 6 }}>✓ Lower Price</div>}
              </div>

              <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>VS</div>

              <div className={`card card-p text-center ${bWins ? "compare-winner" : aWins ? "compare-loser" : ""}`}
                style={{ borderRadius: "var(--r-lg)" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{carB.brand} · {carB.year}</div>
                <div className="compare-price">₹ {carB.predicted_price} L</div>
                {bWins && <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginTop: 6 }}>✓ Lower Price</div>}
              </div>
            </div>

            {carA.predicted_price !== carB.predicted_price && (
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "var(--text-muted)" }}>
                Difference:&nbsp;
                <strong style={{ color: "var(--text-primary)" }}>
                  ₹ {Math.abs(carA.predicted_price - carB.predicted_price).toFixed(2)} L
                </strong>
                &nbsp;({Math.abs(((carA.predicted_price - carB.predicted_price) / Math.max(carA.predicted_price, carB.predicted_price)) * 100).toFixed(1)}% difference)
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
