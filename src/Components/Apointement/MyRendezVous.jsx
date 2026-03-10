import React, { useEffect, useState } from "react";
import UpdateStatusModal from "./UpdateStatus";

const statusConfig = {
  CONFIRMED: { label: "Confirmé", color: "#065f46", bg: "#dcfce7", dot: "#16a34a", ring: "#bbf7d0" },
  PENDING:   { label: "En attente", color: "#92400e", bg: "#fef9c3", dot: "#ca8a04", ring: "#fde68a" },
  CANCELLED: { label: "Annulé", color: "#991b1b", bg: "#fee2e2", dot: "#dc2626", ring: "#fca5a5" },
  COMPLETED: { label: "Terminé", color: "#1e40af", bg: "#dbeafe", dot: "#2563eb", ring: "#bfdbfe" },
};

const getStatus = (status) =>
  statusConfig[status?.toUpperCase()] || {
    label: status || "—", color: "#374151", bg: "#f3f4f6", dot: "#9ca3af", ring: "#e5e7eb",
  };

const MyRendezVous = () => {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem("role");
  const isMedecin = role === "MEDECIN";
  const userId = localStorage.getItem("user_id");
  const endpoint = isMedecin
    ? `http://localhost:8080/api/rendezvous/medecin/${userId}`
    : `http://localhost:8080/api/rendezvous/patient/${userId}`;

  useEffect(() => {
    if (!userId) { setError("Utilisateur non connecté"); setLoading(false); return; }
    fetch(endpoint, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((res) => { if (!res.ok) throw new Error("Erreur lors du chargement"); return res.json(); })
      .then((data) => { setRendezVous(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [endpoint, userId]);

  const stats = [
    { num: rendezVous.length, label: "Total", icon: "📋", color: "#065f46", bg: "#f0fdf4", border: "#bbf7d0" },
    { num: rendezVous.filter(r => r.status?.toUpperCase() === "CONFIRMED").length,  label: "Confirmés",  icon: "✓",  color: "#15803d", bg: "#f0fdf4", border: "#86efac" },
    { num: rendezVous.filter(r => r.status?.toUpperCase() === "PENDING").length,    label: "En attente", icon: "⏳", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
    { num: rendezVous.filter(r => r.status?.toUpperCase() === "COMPLETED").length,  label: "Terminés",   icon: "✔✔", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Lora:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rv-root {
          font-family: 'Outfit', sans-serif;
          background: #f8fffe;
          min-height: 100vh;
          padding: 36px 20px 60px;
          color: #111827;
        }

        /* ── CARD ── */
        .rv-card {
          max-width: 1040px; margin: 0 auto;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(4,120,87,0.08);
          overflow: hidden;
        }

        /* ── HEADER ── */
        .rv-header {
          background: linear-gradient(130deg, #022c22 0%, #064e3b 45%, #065f46 75%, #047857 100%);
          padding: 32px 40px 28px;
          position: relative; overflow: hidden;
        }
        .rv-header::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(16,185,129,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .rv-header-row { display: flex; align-items: center; gap: 16px; position: relative; }
        .rv-header-icon {
          width: 48px; height: 48px; flex-shrink: 0;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; backdrop-filter: blur(6px);
        }
        .rv-header-text { flex: 1; }
        .rv-title {
          font-family: 'Lora', serif;
          font-size: 24px; font-weight: 700;
          color: #fff; letter-spacing: -0.3px; line-height: 1.2;
        }
        .rv-subtitle { color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 300; margin-top: 3px; }
        .rv-role-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px; padding: 5px 14px;
          font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85);
          position: relative;
        }
        .rv-role-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; }

        /* ── BODY ── */
        .rv-body { padding: 28px 32px 36px; }

        /* ── STATES ── */
        .rv-loading { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 70px 0; color: #6b7280; font-size: 14px; }
        .rv-spinner {
          width: 36px; height: 36px;
          border: 3px solid #d1fae5; border-top-color: #059669;
          border-radius: 50%; animation: rv-spin 0.75s linear infinite;
        }
        @keyframes rv-spin { to { transform: rotate(360deg); } }
        .rv-error {
          display: flex; align-items: center; gap: 12px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 14px; padding: 16px 20px;
          color: #b91c1c; font-size: 14px;
        }
        .rv-empty { text-align: center; padding: 70px 0; color: #9ca3af; }
        .rv-empty-icon { font-size: 52px; margin-bottom: 14px; opacity: 0.4; }
        .rv-empty p { font-size: 15px; }

        /* ── STATS ── */
        .rv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
        @media (max-width: 640px) { .rv-stats { grid-template-columns: repeat(2, 1fr); } }
        .rv-stat {
          border-radius: 14px; padding: 16px 18px;
          border: 1px solid; text-align: center;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .rv-stat:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .rv-stat-icon { font-size: 18px; margin-bottom: 6px; }
        .rv-stat-num { font-size: 28px; font-weight: 700; line-height: 1; }
        .rv-stat-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 4px; opacity: 0.7; }

        /* ── TABLE ── */
        .rv-table-wrap {
          border-radius: 16px; overflow: hidden;
          border: 1px solid #e7f5ef;
          box-shadow: 0 1px 6px rgba(4,120,87,0.04);
        }
        .rv-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .rv-table thead { background: #f0fdf4; }
        .rv-table thead th {
          padding: 13px 18px; text-align: left;
          font-size: 10.5px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.9px;
          color: #059669; border-bottom: 1px solid #d1fae5;
          white-space: nowrap;
        }
        .rv-table thead th:last-child { text-align: center; }
        .rv-table tbody tr {
          border-bottom: 1px solid #f0fdf4;
          transition: background 0.12s;
        }
        .rv-table tbody tr:last-child { border-bottom: none; }
        .rv-table tbody tr:hover { background: #f9fffd; }
        .rv-table td { padding: 15px 18px; vertical-align: middle; }
        .rv-table td:last-child { text-align: center; }

        /* date cell */
        .rv-date-main { font-weight: 600; color: #064e3b; font-size: 13px; }
        .rv-date-time { font-size: 11.5px; color: #6b7280; margin-top: 2px; font-weight: 300; }

        /* person cell */
        .rv-person { display: flex; align-items: center; gap: 10px; }
        .rv-avatar {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #d1fae5, #6ee7b7);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #065f46;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px #a7f3d0;
        }
        .rv-person-name { font-weight: 500; color: #111827; font-size: 13.5px; }

        /* specialty */
        .rv-badge {
          display: inline-block;
          background: #ecfdf5; color: #047857;
          border: 1px solid #a7f3d0;
          padding: 4px 11px; border-radius: 20px;
          font-size: 12px; font-weight: 500;
        }

        /* status */
        .rv-status {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 20px;
          font-size: 12px; font-weight: 600; white-space: nowrap;
          border: 1px solid transparent;
        }
        .rv-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* action col */
        .rv-action-cell { white-space: nowrap; }
      `}</style>

      <div className="rv-root">
        <div className="rv-card">

          {/* Header */}
          <div className="rv-header">
            <div className="rv-header-row">
              <div className="rv-header-icon">🩺</div>
              <div className="rv-header-text">
                <h1 className="rv-title">Mes Rendez-vous</h1>
                <p className="rv-subtitle">Historique et suivi de vos consultations médicales</p>
              </div>
              <div className="rv-role-chip">
                <span className="rv-role-dot" />
                {isMedecin ? "Médecin" : "Patient"}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="rv-body">
            {loading ? (
              <div className="rv-loading">
                <div className="rv-spinner" />
                <span>Chargement des rendez-vous…</span>
              </div>
            ) : error ? (
              <div className="rv-error">
                <span>⚠️</span><span>{error}</span>
              </div>
            ) : rendezVous.length === 0 ? (
              <div className="rv-empty">
                <div className="rv-empty-icon">📅</div>
                <p>Aucun rendez-vous trouvé</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="rv-stats">
                  {stats.map((s) => (
                    <div key={s.label} className="rv-stat"
                      style={{ background: s.bg, borderColor: s.border, color: s.color }}>
                      <div className="rv-stat-icon">{s.icon}</div>
                      <div className="rv-stat-num">{s.num}</div>
                      <div className="rv-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="rv-table-wrap">
                  <table className="rv-table">
                    <thead>
                      <tr>
                        <th>Date & Heure</th>
                        <th>{isMedecin ? "Patient" : "Médecin"}</th>
                        <th>Spécialité</th>
                        <th>Statut</th>
                        {isMedecin && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {rendezVous.map((rdv) => {
                        const st = getStatus(rdv.status);
                        const personName = isMedecin
                          ? (rdv.patientnom || rdv.patientNom || "—")
                          : (rdv.medecinNom?.nom || rdv.medecinNom || "—");
                        const initials = personName !== "—"
                          ? personName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                          : (isMedecin ? "PT" : "DR");
                        const specialiteName = rdv.specialite?.nomspecialite || rdv.specialite || "—";

                        return (
                          <tr key={rdv.id}>
                            {/* Date */}
                            <td>
                              <div className="rv-date-main">
                                {new Date(rdv.dateHeureDebut).toLocaleDateString("fr-FR", {
                                  weekday: "short", day: "numeric", month: "short", year: "numeric"
                                })}
                              </div>
                              <div className="rv-date-time">
                                {new Date(rdv.dateHeureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                {" – "}
                                {new Date(rdv.dateHeureFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </td>

                            {/* Person */}
                            <td>
                              <div className="rv-person">
                                <div className="rv-avatar">{initials}</div>
                                <span className="rv-person-name">{personName}</span>
                              </div>
                            </td>

                            {/* Specialty */}
                            <td>
                              <span className="rv-badge">{specialiteName}</span>
                            </td>

                            {/* Status */}
                            <td>
                              <span className="rv-status"
                                style={{ background: st.bg, color: st.color, borderColor: st.ring }}>
                                <span className="rv-status-dot" style={{ background: st.dot }} />
                                {st.label}
                              </span>
                            </td>

                            {/* Action — médecin only */}
                            {isMedecin && (
                              <td className="rv-action-cell">
                                <UpdateStatusModal
                                  rendezVousId={rdv.id}
                                  currentStatus={rdv.status}
                                  onUpdate={(newStatus) =>
                                    setRendezVous(prev =>
                                      prev.map(r => r.id === rdv.id ? { ...r, status: newStatus } : r)
                                    )
                                  }
                                />
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRendezVous;