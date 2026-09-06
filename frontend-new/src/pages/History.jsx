import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarImage from "../components/CarImage";
import { IconSearch, IconTrash, IconEye, IconX, IconFilter, IconSort } from "../components/Icons";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function DetailModal({ row, onClose }) {
  if (!row) return null;
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h3>{row.brand} · {row.year}</h3>
          <button className="modal-close" onClick={onClose}><IconX size={18} /></button>
        </div>
        <div className="modal-body">
          <CarImage brand={row.brand} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "var(--r-lg)", marginBottom: 20 }} />

          <div className="detail-grid">
            {[
              ["Brand",        row.brand],
              ["Year",         row.year],
              ["Fuel Type",    row.fuel_type],
              ["Transmission", row.transmission],
              ["KM Driven",    row.km_driven?.toLocaleString() + " km"],
              ["Owner Type",   row.owner_type || "—"],
              ["Engine",       row.engine_cc ? row.engine_cc + " cc" : "—"],
              ["Power",        row.power_bhp ? row.power_bhp + " bhp" : "—"],
              ["Mileage",      row.mileage ? row.mileage + " km/l" : "—"],
              ["Seats",        row.seats || "—"],
            ].map(([label, val]) => (
              <div className="detail-item" key={label}>
                <div className="detail-item-label">{label}</div>
                <div className="detail-item-value">{val}</div>
              </div>
            ))}
          </div>

          <div className="detail-price-highlight">
            <div className="detail-price-label">Estimated Market Value</div>
            <div className="detail-price-value">₹ {row.predicted_price} L</div>
            <div style={{ fontSize: 12, color: "var(--brand-600)", marginTop: 4 }}>{formatDate(row.timestamp)}</div>
          </div>
        </div>
        <div className="modal-footer">
          <Link to="/predict" className="btn btn-primary btn-sm">Predict Another Car</Link>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [fuelFilter, setFuel] = useState("All");
  const [sort, setSort]       = useState("newest");
  const [detail, setDetail]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.history()
      .then(d => setHistory(d.history || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fuels = useMemo(() => ["All", ...new Set(history.map(r => r.fuel_type))], [history]);

  const filtered = useMemo(() => {
    let rows = [...history];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.brand?.toLowerCase().includes(q) ||
        String(r.year).includes(q) ||
        r.fuel_type?.toLowerCase().includes(q)
      );
    }
    if (fuelFilter !== "All") rows = rows.filter(r => r.fuel_type === fuelFilter);
    if (sort === "newest") rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    else if (sort === "oldest") rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    else if (sort === "price-high") rows.sort((a, b) => b.predicted_price - a.predicted_price);
    else if (sort === "price-low")  rows.sort((a, b) => a.predicted_price - b.predicted_price);
    return rows;
  }, [history, search, fuelFilter, sort]);

  const handleDelete = async id => {
    if (!window.confirm("Delete this prediction?")) return;
    setDeleting(id);
    try {
      await api.deletePrediction(id);
      setHistory(h => h.filter(r => r.id !== id));
      if (detail?.id === id) setDetail(null);
    } catch {
      setError("Could not delete prediction.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-body">
        <div className="page-header">
          <h1>Prediction History</h1>
          <p>All your saved car price predictions — search, filter, and manage them here.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Toolbar */}
        <div className="history-toolbar">
          <div className="input-wrap" style={{ flex: 1, maxWidth: 280 }}>
            <IconSearch size={15} />
            <input
              placeholder="Search brand, year, fuel…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="input-wrap" style={{ maxWidth: 160 }}>
            <IconFilter size={14} />
            <select value={fuelFilter} onChange={e => setFuel(e.target.value)}>
              {fuels.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          <div className="input-wrap" style={{ maxWidth: 170 }}>
            <IconSort size={14} />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price-high">Price: High → Low</option>
              <option value="price-low">Price: Low → High</option>
            </select>
          </div>

          {history.length > 0 && (
            <span className="badge badge-gray" style={{ flexShrink: 0 }}>
              {filtered.length} / {history.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" />Loading predictions…</div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <CarImage brand="Maruti" style={{ width: 180, height: 120, borderRadius: "var(--r-lg)", opacity: 0.6 }} />
            <h3>No predictions yet</h3>
            <p>You haven't saved any predictions. Head to the Predict page to get started.</p>
            <Link to="/predict" className="btn btn-primary">Make your first prediction →</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No results found</h3>
            <p>Try adjusting your search or filter.</p>
            <button className="btn btn-ghost" onClick={() => { setSearch(""); setFuel("All"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {filtered.map(row => (
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
                  <div className="history-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setDetail(row)}
                      title="View details"
                    >
                      <IconEye size={14} /> View
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(row.id)}
                      disabled={deleting === row.id}
                      title="Delete"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {detail && <DetailModal row={detail} onClose={() => setDetail(null)} />}
      <Footer />
    </div>
  );
}
