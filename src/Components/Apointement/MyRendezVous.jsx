import React, { useEffect, useState } from "react";

const statusConfig = {
  CONFIRMED: { label: "Confirmé", color: "#065f46", bg: "#d1fae5", dot: "#10b981" },
  PENDING: { label: "En attente", color: "#92400e", bg: "#fef3c7", dot: "#f59e0b" },
  CANCELLED: { label: "Annulé", color: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
  COMPLETED: { label: "Terminé", color: "#1e3a5f", bg: "#dbeafe", dot: "#3b82f6" },
};

const getStatus = (status) =>
  statusConfig[status?.toUpperCase()] || {
    label: status || "—",
    color: "#374151",
    bg: "#f3f4f6",
    dot: "#9ca3af",
  };

const MyRendezVous = () => {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const patientId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!patientId) {
      setError("Patient non connecté");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/rendezvous/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => {
        setRendezVous(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [patientId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rdv-wrapper {
          font-family: 'DM Sans', sans-serif;
          background: #f0faf4;
          min-height: 100vh;
          padding: 40px 24px;
          color: #1a2e1a;
        }

        .rdv-card {
          max-width: 960px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 32px rgba(16, 185, 129, 0.08), 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .rdv-header {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%);
          padding: 36px 40px;
          position: relative;
          overflow: hidden;
        }

        .rdv-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        .rdv-header::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 30%;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }

        .rdv-header-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 6px;
        }

        .rdv-icon {
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.15);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          backdrop-filter: blur(4px);
        }

        .rdv-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .rdv-subtitle {
          color: rgba(255,255,255,0.65);
          font-size: 13.5px;
          font-weight: 300;
          padding-left: 58px;
        }

        .rdv-body {
          padding: 32px 40px 40px;
        }

        /* Loading */
        .rdv-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 60px 20px;
          color: #6b7280;
        }

        .rdv-spinner {
          width: 38px; height: 38px;
          border: 3px solid #d1fae5;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Error */
        .rdv-error {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 12px;
          padding: 16px 20px;
          color: #991b1b;
          font-size: 14px;
        }

        /* Empty */
        .rdv-empty {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .rdv-empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .rdv-empty p {
          font-size: 15px;
        }

        /* Stats bar */
        .rdv-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .rdv-stat {
          flex: 1;
          min-width: 120px;
          background: #f0faf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 14px 18px;
          text-align: center;
        }

        .rdv-stat-num {
          font-size: 26px;
          font-weight: 600;
          color: #065f46;
          line-height: 1;
        }

        .rdv-stat-label {
          font-size: 11.5px;
          color: #6b7280;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Table */
        .rdv-table-wrap {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #d1fae5;
        }

        .rdv-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .rdv-table thead {
          background: #f0faf4;
        }

        .rdv-table thead th {
          padding: 14px 18px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #047857;
          border-bottom: 1px solid #d1fae5;
        }

        .rdv-table tbody tr {
          border-bottom: 1px solid #f0faf4;
          transition: background 0.15s ease;
        }

        .rdv-table tbody tr:last-child {
          border-bottom: none;
        }

        .rdv-table tbody tr:hover {
          background: #f9fffe;
        }

        .rdv-table td {
          padding: 16px 18px;
          color: #1a2e1a;
          vertical-align: middle;
        }

        .rdv-date-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rdv-date-main {
          font-weight: 500;
          color: #064e3b;
          font-size: 14px;
        }

        .rdv-time {
          font-size: 12px;
          color: #6b7280;
          font-weight: 300;
        }

        .rdv-doctor {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rdv-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #065f46;
          flex-shrink: 0;
        }

        .rdv-doctor-name {
          font-weight: 500;
          color: #1a2e1a;
          font-size: 14px;
        }

        .rdv-specialty-badge {
          display: inline-block;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .rdv-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .rdv-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .rdv-header { padding: 28px 24px; }
          .rdv-body { padding: 24px 20px 32px; }
          .rdv-table thead { display: none; }
          .rdv-table tbody tr {
            display: block;
            padding: 16px;
            border-bottom: 1px solid #d1fae5;
          }
          .rdv-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border: none;
          }
          .rdv-table td::before {
            content: attr(data-label);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #9ca3af;
            font-weight: 600;
          }
        }
      `}</style>

      <div className="rdv-wrapper">
        <div className="rdv-card">
          <div className="rdv-header">
            <div className="rdv-header-top">
              <div className="rdv-icon">🩺</div>
              <h2 className="rdv-title">Mes Rendez-vous</h2>
            </div>
            <p className="rdv-subtitle">Historique et suivi de vos consultations médicales</p>
          </div>

          <div className="rdv-body">
            {loading ? (
              <div className="rdv-loading">
                <div className="rdv-spinner" />
                <span>Chargement de vos rendez-vous…</span>
              </div>
            ) : error ? (
              <div className="rdv-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            ) : rendezVous.length === 0 ? (
              <div className="rdv-empty">
                <div className="rdv-empty-icon">📅</div>
                <p>Aucun rendez-vous trouvé</p>
              </div>
            ) : (
              <>
                <div className="rdv-stats">
                  <div className="rdv-stat">
                    <div className="rdv-stat-num">{rendezVous.length}</div>
                    <div className="rdv-stat-label">Total</div>
                  </div>
                  <div className="rdv-stat">
                    <div className="rdv-stat-num">
                      {rendezVous.filter(r => r.status?.toUpperCase() === "CONFIRMED").length}
                    </div>
                    <div className="rdv-stat-label">Confirmés</div>
                  </div>
                  <div className="rdv-stat">
                    <div className="rdv-stat-num">
                      {rendezVous.filter(r => r.status?.toUpperCase() === "PENDING").length}
                    </div>
                    <div className="rdv-stat-label">En attente</div>
                  </div>
                  <div className="rdv-stat">
                    <div className="rdv-stat-num">
                      {rendezVous.filter(r => r.status?.toUpperCase() === "COMPLETED").length}
                    </div>
                    <div className="rdv-stat-label">Terminés</div>
                  </div>
                </div>

                <div className="rdv-table-wrap">
                  <table className="rdv-table">
                    <thead>
                      <tr>
                        <th>Date & Heure</th>
                        <th>Médecin</th>
                        <th>Spécialité</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rendezVous.map((rdv) => {
                        const st = getStatus(rdv.status);
                        const initials = rdv.medecinNom
                          ? rdv.medecinNom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                          : "Dr";
                        return (
                          <tr key={rdv.id}>
                            <td data-label="Date">
                              <div className="rdv-date-block">
                                <span className="rdv-date-main">
                                  {new Date(rdv.dateHeureDebut).toLocaleDateString("fr-FR", {
                                    weekday: "short", day: "numeric", month: "long", year: "numeric"
                                  })}
                                </span>
                                <span className="rdv-time">
                                  {new Date(rdv.dateHeureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                  {" – "}
                                  {new Date(rdv.dateHeureFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            </td>
                            <td data-label="Médecin">
                              <div className="rdv-doctor">
                                <div className="rdv-avatar">{initials}</div>
                                <span className="rdv-doctor-name">{rdv.medecinNom || "—"}</span>
                              </div>
                            </td>
                            <td data-label="Spécialité">
                              <span className="rdv-specialty-badge">{rdv.specialite || "—"}</span>
                            </td>
                            <td data-label="Statut">
                              <span
                                className="rdv-status-badge"
                                style={{ background: st.bg, color: st.color }}
                              >
                                <span className="rdv-status-dot" style={{ background: st.dot }} />
                                {st.label}
                              </span>
                            </td>
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