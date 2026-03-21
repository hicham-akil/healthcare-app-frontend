import React, { useEffect, useState } from "react";
import UpdateStatusModal from "./UpdateStatus";
import BASE_URL from "../../utils/api.js";

const statusConfig = {
  EN_ATTENTE: { label: "En attente",  color: "#92400e", bg: "#fef9c3", dot: "#ca8a04", ring: "#fde68a" },
  EN_COURS:   { label: "En cours",    color: "#065f46", bg: "#dcfce7", dot: "#16a34a", ring: "#bbf7d0" },
  COMPLETED:  { label: "Terminé",     color: "#1e40af", bg: "#dbeafe", dot: "#2563eb", ring: "#bfdbfe" },
  ANNULE:     { label: "Annulé",      color: "#991b1b", bg: "#fee2e2", dot: "#dc2626", ring: "#fca5a5" },
};

const getStatus = (status) =>
  statusConfig[status?.toUpperCase()] || {
    label: status || "—", color: "#374151", bg: "#f3f4f6", dot: "#9ca3af", ring: "#e5e7eb",
  };

const MyRendezVous = () => {
  const [rendezVous, setRendezVous]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [nextLoading, setNextLoading]       = useState(false);
  const [nextError, setNextError]           = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);

  const role      = localStorage.getItem("role");
  const isMedecin = role === "MEDECIN";
  const userId    = localStorage.getItem("user_id");
  const token     = localStorage.getItem("token");

  const endpoint = isMedecin
    ? `${BASE_URL}/api/rendezvous/medecin/${userId}`
    : `${BASE_URL}/api/rendezvous/patient/${userId}`;

  const fetchData = () => {
    if (!userId) { setError("Utilisateur non connecté"); setLoading(false); return; }
    setLoading(true);
    fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error("Erreur lors du chargement"); return res.json(); })
      .then((data) => {
        setRendezVous(data);
        if (isMedecin) {
          setCurrentPatient(data.find(r => r.status?.toUpperCase() === "EN_COURS") || null);
        }
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [endpoint, userId]);

  const handleNextPatient = async () => {
    setNextError(null);
    setNextLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/rendezvous/medecin/${userId}/next`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Aucun patient en attente");
      }
      const next = await res.json();
      fetchData();
      setCurrentPatient(next);
    } catch (err) {
      setNextError(err.message);
    } finally {
      setNextLoading(false);
    }
  };

  const stats = isMedecin
    ? [
        { num: rendezVous.length,                                                                       label: "Total",      icon: "📋", color: "#065f46", bg: "#f0fdf4", border: "#bbf7d0" },
        { num: rendezVous.filter(r => r.status?.toUpperCase() === "EN_ATTENTE").length,                 label: "En attente", icon: "⏳", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
        { num: rendezVous.filter(r => r.status?.toUpperCase() === "EN_COURS").length,                   label: "En cours",   icon: "🔵", color: "#065f46", bg: "#f0fdf4", border: "#86efac" },
        { num: rendezVous.filter(r => r.status?.toUpperCase() === "COMPLETED").length,                  label: "Terminés",   icon: "✔✔", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
      ]
    : [
        { num: rendezVous.length,                                                                       label: "Total",      icon: "📋", color: "#065f46", bg: "#f0fdf4", border: "#bbf7d0" },
        { num: rendezVous.filter(r => r.status?.toUpperCase() === "EN_ATTENTE").length,                 label: "En attente", icon: "⏳", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
        { num: rendezVous.filter(r => r.status?.toUpperCase() === "EN_COURS").length,                   label: "En cours",   icon: "🟢", color: "#065f46", bg: "#f0fdf4", border: "#86efac" },
        { num: rendezVous.filter(r => r.status?.toUpperCase() === "COMPLETED").length,                  label: "Terminés",   icon: "✔✔", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
      ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Lora:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rv-root { font-family: 'Outfit', sans-serif; background: #f8fffe; min-height: 100vh; padding: 36px 20px 60px; color: #111827; }

        .rv-card { max-width: 1040px; margin: 0 auto; background: #fff; border-radius: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(4,120,87,0.08); overflow: hidden; }

        .rv-header { background: linear-gradient(130deg, #022c22 0%, #064e3b 45%, #065f46 75%, #047857 100%); padding: 32px 40px 28px; position: relative; overflow: hidden; }
        .rv-header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(16,185,129,0.12) 0%, transparent 70%); pointer-events: none; }
        .rv-header-row { display: flex; align-items: center; gap: 16px; position: relative; }
        .rv-header-icon { width: 48px; height: 48px; flex-shrink: 0; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; backdrop-filter: blur(6px); }
        .rv-header-text { flex: 1; }
        .rv-title { font-family: 'Lora', serif; font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.3px; line-height: 1.2; }
        .rv-subtitle { color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 300; margin-top: 3px; }
        .rv-role-chip { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85); }
        .rv-role-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; }

        .rv-body { padding: 28px 32px 36px; }

        .rv-next-banner { border-radius: 16px; overflow: hidden; margin-bottom: 24px; border: 1px solid #d1fae5; }
        .rv-next-banner-top { background: linear-gradient(135deg, #064e3b, #047857); padding: 16px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .rv-next-info { display: flex; align-items: center; gap: 12px; }
        .rv-next-avatar { width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .rv-next-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #6ee7b7; margin-bottom: 2px; }
        .rv-next-name { font-size: 15px; font-weight: 600; color: #fff; }
        .rv-next-queue { font-size: 12px; color: rgba(255,255,255,0.6); }
        .rv-next-btn { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #064e3b; font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 700; padding: 10px 22px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.12); transition: transform 0.2s, box-shadow 0.2s; white-space: nowrap; }
        .rv-next-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
        .rv-next-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .rv-next-empty { padding: 16px 22px; background: #f0fdf4; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .rv-next-empty-text { font-size: 13px; color: #6b7280; }
        .rv-next-error { padding: 10px 22px; background: #fef2f2; font-size: 12px; color: #dc2626; }

        .rv-row-active { background: #f0fdf4 !important; }
        .rv-row-active td:first-child { border-left: 3px solid #10b981; }

        /* Completed rows dimmed */
        .rv-row-completed { opacity: 0.55; }

        /* Divider row between active and completed */
        .rv-divider td { padding: 6px 18px; background: #f9fafb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #9ca3af; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; }

        .rv-loading { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 70px 0; color: #6b7280; font-size: 14px; }
        .rv-spinner { width: 36px; height: 36px; border: 3px solid #d1fae5; border-top-color: #059669; border-radius: 50%; animation: rv-spin 0.75s linear infinite; }
        @keyframes rv-spin { to { transform: rotate(360deg); } }
        .rv-error { display: flex; align-items: center; gap: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 16px 20px; color: #b91c1c; font-size: 14px; }
        .rv-empty { text-align: center; padding: 70px 0; color: #9ca3af; }
        .rv-empty-icon { font-size: 52px; margin-bottom: 14px; opacity: 0.4; }
        .rv-empty p { font-size: 15px; }

        .rv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        @media (max-width: 640px) { .rv-stats { grid-template-columns: repeat(2, 1fr); } }
        .rv-stat { border-radius: 14px; padding: 16px 18px; border: 1px solid; text-align: center; transition: transform 0.15s, box-shadow 0.15s; }
        .rv-stat:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .rv-stat-icon { font-size: 18px; margin-bottom: 6px; }
        .rv-stat-num { font-size: 28px; font-weight: 700; line-height: 1; }
        .rv-stat-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 4px; opacity: 0.7; }

        .rv-table-wrap { border-radius: 16px; overflow: hidden; border: 1px solid #e7f5ef; box-shadow: 0 1px 6px rgba(4,120,87,0.04); }
        .rv-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .rv-table thead { background: #f0fdf4; }
        .rv-table thead th { padding: 13px 18px; text-align: left; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.9px; color: #059669; border-bottom: 1px solid #d1fae5; white-space: nowrap; }
        .rv-table thead th:last-child { text-align: center; }
        .rv-table tbody tr { border-bottom: 1px solid #f0fdf4; transition: background 0.12s; }
        .rv-table tbody tr:last-child { border-bottom: none; }
        .rv-table tbody tr:hover { background: #f9fffd; }
        .rv-table td { padding: 15px 18px; vertical-align: middle; }
        .rv-table td:last-child { text-align: center; }

        .rv-queue-block { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; font-family: 'Lora', serif; font-size: 18px; font-weight: 700; color: #064e3b; }
        .rv-queue-block.active { background: linear-gradient(135deg, #064e3b, #047857); color: #6ee7b7; border-color: #047857; }
        .rv-queue-block.done { background: #f3f4f6; border-color: #e5e7eb; color: #9ca3af; }

        .rv-date-main { font-weight: 600; color: #064e3b; font-size: 13px; }
        .rv-date-sub { font-size: 11.5px; color: #6b7280; margin-top: 2px; font-weight: 300; }

        .rv-person { display: flex; align-items: center; gap: 10px; }
        .rv-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, #d1fae5, #6ee7b7); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #065f46; border: 2px solid #fff; box-shadow: 0 0 0 1px #a7f3d0; }
        .rv-person-name { font-weight: 500; color: #111827; font-size: 13.5px; }
        .rv-badge { display: inline-block; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 4px 11px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .rv-status { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; border: 1px solid transparent; }
        .rv-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
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
                <p className="rv-subtitle">
                  {isMedecin
                    ? "Gérez la file d'attente de vos patients"
                    : "Suivez votre position dans la file d'attente"}
                </p>
              </div>
              <div className="rv-role-chip">
                <span className="rv-role-dot" />
                {isMedecin ? "Médecin" : "Patient"}
              </div>
            </div>
          </div>

          <div className="rv-body">
            {loading ? (
              <div className="rv-loading">
                <div className="rv-spinner" />
                <span>Chargement des rendez-vous…</span>
              </div>
            ) : error ? (
              <div className="rv-error"><span>⚠️</span><span>{error}</span></div>
            ) : rendezVous.length === 0 ? (
              <div className="rv-empty">
                <div className="rv-empty-icon">📅</div>
                <p>Aucun rendez-vous trouvé</p>
              </div>
            ) : (
              <>
                {/* Next Patient Banner — médecin only */}
                {isMedecin && (
                  <div className="rv-next-banner">
                    {currentPatient ? (
                      <div className="rv-next-banner-top">
                        <div className="rv-next-info">
                          <div className="rv-next-avatar">
                            {(currentPatient.patientNom || currentPatient.patientnom || "PT")
                              .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="rv-next-label">En consultation</p>
                            <p className="rv-next-name">
                              {currentPatient.patientNom || currentPatient.patientnom || "—"}
                            </p>
                            <p className="rv-next-queue">
                              #{currentPatient.queueNumber} · {currentPatient.specialite || "—"}
                            </p>
                          </div>
                        </div>
                        <button className="rv-next-btn" onClick={handleNextPatient} disabled={nextLoading}>
                          {nextLoading ? "..." : "✓ Suivant →"}
                        </button>
                      </div>
                    ) : (
                      <div className="rv-next-empty">
                        <p className="rv-next-empty-text">
                          Aucun patient en cours — appelez le premier patient en attente.
                        </p>
                        <button
                          className="rv-next-btn"
                          onClick={handleNextPatient}
                          disabled={nextLoading}
                          style={{ background: "linear-gradient(135deg,#064e3b,#047857)", color: "#fff" }}
                        >
                          {nextLoading ? "..." : "▶ Appeler premier patient"}
                        </button>
                      </div>
                    )}
                    {nextError && <div className="rv-next-error">⚠️ {nextError}</div>}
                  </div>
                )}

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
                        <th>#</th>
                        <th>Date</th>
                        <th>{isMedecin ? "Patient" : "Médecin"}</th>
                        <th>Spécialité</th>
                        <th>Statut</th>
                        {isMedecin && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Split into active (EN_ATTENTE, EN_COURS, ANNULE) and completed
                        const sorted = [...rendezVous].sort((a, b) => {
                          const aCompleted = a.status?.toUpperCase() === "COMPLETED" ? 1 : 0;
                          const bCompleted = b.status?.toUpperCase() === "COMPLETED" ? 1 : 0;
                          if (aCompleted !== bCompleted) return aCompleted - bCompleted;
                          return (a.queueNumber ?? 99) - (b.queueNumber ?? 99);
                        });

                        const activeRows    = sorted.filter(r => r.status?.toUpperCase() !== "COMPLETED");
                        const completedRows = sorted.filter(r => r.status?.toUpperCase() === "COMPLETED");

                        const renderRow = (rdv) => {
                          const st         = getStatus(rdv.status);
                          const isActive   = rdv.status?.toUpperCase() === "EN_COURS";
                          const isDone     = rdv.status?.toUpperCase() === "COMPLETED";
                          const personName = isMedecin
                            ? (rdv.patientnom || rdv.patientNom || "—")
                            : (rdv.medecinNom?.nom || rdv.medecinNom || "—");
                          const initials = personName !== "—"
                            ? personName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                            : (isMedecin ? "PT" : "DR");
                          const specialiteName = rdv.specialite?.nomspecialite || rdv.specialite || "—";

                          return (
                            <tr
                              key={rdv.id}
                              className={
                                isActive ? "rv-row-active" :
                                isDone   ? "rv-row-completed" : ""
                              }
                            >
                              {/* Queue number */}
                              <td>
                                <span className={`rv-queue-block${isActive ? " active" : isDone ? " done" : ""}`}>
                                  {rdv.queueNumber ?? "—"}
                                </span>
                              </td>

                              {/* Date */}
                              <td>
                                <div className="rv-date-main">
                                  {new Date(rdv.dateHeureDebut).toLocaleDateString("fr-FR", {
                                    weekday: "short", day: "numeric", month: "short", year: "numeric"
                                  })}
                                </div>
                                {isActive && (
                                  <div className="rv-date-sub" style={{ color: "#10b981" }}>
                                    🟢 En consultation
                                  </div>
                                )}
                              </td>

                              {/* Person */}
                              <td>
                                <div className="rv-person">
                                  <div className="rv-avatar">{initials}</div>
                                  <span className="rv-person-name">{personName}</span>
                                </div>
                              </td>

                              {/* Specialty */}
                              <td><span className="rv-badge">{specialiteName}</span></td>

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
                                    onUpdate={(newStatus) => {
                                      setRendezVous(prev =>
                                        prev.map(r => r.id === rdv.id ? { ...r, status: newStatus } : r)
                                      );
                                      if (newStatus.toUpperCase() === "EN_COURS") {
                                        setCurrentPatient({ ...rdv, status: newStatus });
                                      }
                                      if (rdv.id === currentPatient?.id && newStatus.toUpperCase() !== "EN_COURS") {
                                        setCurrentPatient(null);
                                      }
                                    }}
                                  />
                                </td>
                              )}
                            </tr>
                          );
                        };

                        return (
                          <>
                            {/* Active rows first */}
                            {activeRows.map(renderRow)}

                            {/* Divider only if both groups exist */}
                            {activeRows.length > 0 && completedRows.length > 0 && (
                              <tr className="rv-divider">
                                <td colSpan={isMedecin ? 6 : 5}>
                                  ✔ Consultations terminées
                                </td>
                              </tr>
                            )}

                            {/* Completed rows at the bottom, dimmed */}
                            {completedRows.map(renderRow)}
                          </>
                        );
                      })()}
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